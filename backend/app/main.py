import io
from typing import Literal, Optional, Tuple

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from PIL import Image
from rembg import remove, new_session
import base64
import numpy as np
import cv2
import os

from .schemas import TryOnResponse
from .gemini import generate_tryon_image

app = FastAPI(title="Virtual Try-On API")

# Load env vars from .env when running locally
load_dotenv()

# Configurable model and image size (override via env)
_rembg_model_name = os.getenv("REMBG_MODEL", "u2net")
_max_dim_str = os.getenv("MAX_DIM", "1536")
try:
    _max_dim = max(256, min(4096, int(_max_dim_str)))
except Exception:
    _max_dim = 1536

# Create background removal session and warm it up on startup
_rembg_session = new_session(_rembg_model_name)

@app.on_event("startup")
async def _warmup_model() -> None:
    # Run a tiny warmup so first request is faster (and triggers model download)
    try:
        tiny = Image.new("RGBA", (2, 2), (0, 0, 0, 0))
        _ = remove(tiny, session=_rembg_session)
    except Exception:
        pass


def _downscale_max_dim(img: Image.Image, max_dim: int = 1024) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_dim:
        return img
    scale = max_dim / float(max(w, h))
    new_size = (max(1, int(w * scale)), max(1, int(h * scale)))
    return img.resize(new_size, Image.LANCZOS)


def _detect_face_bbox(bgr_image: np.ndarray) -> Optional[Tuple[int, int, int, int]]:
    gray = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
    if len(faces) == 0:
        return None
    # Choose largest face
    x, y, w, h = max(faces, key=lambda r: r[2] * r[3])
    return int(x), int(y), int(w), int(h)


def _preserve_face_with_poisson(user_png: bytes, generated_png: bytes) -> bytes:
    try:
        # Decode to BGR
        user_arr = np.frombuffer(user_png, dtype=np.uint8)
        gen_arr = np.frombuffer(generated_png, dtype=np.uint8)
        user_bgr = cv2.imdecode(user_arr, cv2.IMREAD_COLOR)
        gen_bgr = cv2.imdecode(gen_arr, cv2.IMREAD_COLOR)
        if user_bgr is None or gen_bgr is None:
            return generated_png

        src_box = _detect_face_bbox(user_bgr)
        dst_box = _detect_face_bbox(gen_bgr)
        if src_box is None or dst_box is None:
            return generated_png

        sx, sy, sw, sh = src_box
        dx, dy, dw, dh = dst_box

        # Crop and resize user face to destination size
        user_face = user_bgr[max(sy, 0): sy + sh, max(sx, 0): sx + sw]
        if user_face.size == 0:
            return generated_png
        user_face_resized = cv2.resize(user_face, (dw, dh), interpolation=cv2.INTER_CUBIC)

        # Elliptical mask for smoother boundaries
        mask = np.zeros((dh, dw), dtype=np.uint8)
        cv2.ellipse(
            mask,
            (dw // 2, dh // 2),
            (int(dw * 0.45), int(dh * 0.55)),
            0,
            0,
            360,
            255,
            -1,
        )

        center = (dx + dw // 2, dy + dh // 2)
        blended = cv2.seamlessClone(user_face_resized, gen_bgr, mask, center, cv2.NORMAL_CLONE)

        # Encode back to PNG bytes
        ok, out_buf = cv2.imencode('.png', blended)
        if not ok:
            return generated_png
        return out_buf.tobytes()
    except Exception:
        # Fallback on any error
        return generated_png

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve React build if present (Docker/Heroku image copies to /app/static)
try:
    app.mount("/", StaticFiles(directory="static", html=True), name="static")
except Exception:
    pass

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/tryon", response_model=TryOnResponse)
async def tryon(
    user_image: UploadFile = File(...),
    clothing_image: UploadFile = File(...),
    background: Literal[
        "Plain White", "Library", "Party", "Beach", "Office"
    ] = Form(...),
):
    # Read files
    user_bytes = await user_image.read()
    clothing_bytes = await clothing_image.read()

    # Background removal on user image
    try:
        user_img = Image.open(io.BytesIO(user_bytes)).convert("RGBA")
        user_img = _downscale_max_dim(user_img, _max_dim)
    except Exception:
        return JSONResponse(status_code=400, content={"detail": "Invalid user image"})

    try:
        user_no_bg = remove(user_img, session=_rembg_session)
    except Exception:
        # If background removal fails, fallback to original
        user_no_bg = user_img

    # Ensure PNG bytes
    out_buf = io.BytesIO()
    user_no_bg.save(out_buf, format="PNG")
    user_png = out_buf.getvalue()

    # Ensure clothing is PNG bytes
    try:
        cloth_img = Image.open(io.BytesIO(clothing_bytes)).convert("RGBA")
        cloth_img = _downscale_max_dim(cloth_img, _max_dim)
        out_cloth = io.BytesIO()
        cloth_img.save(out_cloth, format="PNG")
        clothing_png = out_cloth.getvalue()
    except Exception:
        return JSONResponse(status_code=400, content={"detail": "Invalid clothing image"})

    # Call Gemini
    try:
        img_b64 = generate_tryon_image(user_png, clothing_png, background)
        # Post-process to preserve original face region
        generated_png = base64.b64decode(img_b64)
        merged_png = _preserve_face_with_poisson(user_png, generated_png)
        if merged_png != generated_png:
            # Re-encode and return merged result
            img_b64 = base64.b64encode(merged_png).decode('utf-8')
    except Exception as e:
        message = str(e)
        if message == "Gemini did not return an image":
            raise HTTPException(status_code=500, detail=message)
        raise HTTPException(status_code=500, detail=message)

    return {"image_base64": img_b64}


