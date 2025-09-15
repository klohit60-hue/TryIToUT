import io
import gc
from typing import Literal, Optional, Tuple

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from dotenv import load_dotenv
from PIL import Image
from rembg import remove, new_session
import base64
import numpy as np
import cv2
import os

from .schemas import TryOnResponse, TryOnMultiResponse
from .gemini import generate_tryon_image

app = FastAPI(title="Virtual Try-On API")

# Load env vars from .env when running locally
load_dotenv()

# Configurable model and image size (override via env)
_rembg_model_name = os.getenv("REMBG_MODEL", "u2net")
_max_dim_str = os.getenv("MAX_DIM", "1536")
_face_blend_enabled = os.getenv("FACE_BLEND", "1").lower() not in ("0", "false", "no")
try:
    _max_variants = max(1, min(3, int(os.getenv("MAX_VARIANTS", "1"))))
except Exception:
    _max_variants = 1
try:
    _max_attempts = max(1, min(3, int(os.getenv("RETRIES", "1"))))
except Exception:
    _max_attempts = 1
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

        # Sanity checks to avoid blending a tiny/huge or misplaced face (prevents "face pasted" look)
        H, W = gen_bgr.shape[:2]
        if dw <= 0 or dh <= 0 or W <= 0 or H <= 0:
            return generated_png
        # Face should be within frame and not cover unrealistic area
        if dx < 0 or dy < 0 or dx + dw > W or dy + dh > H:
            return generated_png
        face_area = dw * dh
        frame_area = W * H
        if face_area < 0.01 * frame_area or face_area > 0.25 * frame_area:
            # Too small or too large → skip blending
            return generated_png

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


def _reject_generated_if_collage(generated_png: bytes) -> bool:
    """Heuristic filter to catch collage/inset-face artifacts.
    Reject when: more than one detected face, or the only detected face sits unusually low
    (e.g., embedded on clothing) relative to image height.
    """
    try:
        arr = np.frombuffer(generated_png, dtype=np.uint8)
        bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if bgr is None:
            return False
        gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
        if len(faces) == 0:
            # Sometimes the face detector misses valid faces; don't over-reject
            return False
        if len(faces) > 1:
            return True
        (x, y, w, h) = faces[0]
        H, W = bgr.shape[:2]
        # Reject if face center is below ~70% height (more lenient for pose/composition changes)
        cy = y + h / 2.0
        if cy > 0.7 * H:
            return True
        # Reject if face area is implausibly small/large
        area_ratio = (w * h) / float(max(1, W * H))
        if area_ratio < 0.008 or area_ratio > 0.40:
            return True
        return False
    except Exception:
        return False


def _auto_crop_letterbox(generated_png: bytes) -> bytes:
    """Remove uniform near-black letterbox bars from edges (left/right/top/bottom).
    Crops only when large contiguous edge strips are >98% near-black and
    total crop per edge is <=20% of dimension.
    """
    try:
        arr = np.frombuffer(generated_png, dtype=np.uint8)
        bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if bgr is None:
            return generated_png
        H, W = bgr.shape[:2]
        if H < 10 or W < 10:
            return generated_png

        gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
        black_thresh = 14  # very dark
        max_frac = 0.20
        min_run = 6

        def count_black_cols_from_edge(img_gray: np.ndarray, from_left: bool) -> int:
            h, w = img_gray.shape
            limit = int(w * max_frac)
            run = 0
            rng = range(w) if from_left else range(w - 1, -1, -1)
            for xi, x in enumerate(rng):
                if xi >= limit:
                    break
                col = img_gray[:, x]
                black_ratio = float((col <= black_thresh).sum()) / float(h)
                if black_ratio >= 0.98:
                    run += 1
                else:
                    break
            return run if run >= min_run else 0

        def count_black_rows_from_edge(img_gray: np.ndarray, from_top: bool) -> int:
            h, w = img_gray.shape
            limit = int(h * max_frac)
            run = 0
            rng = range(h) if from_top else range(h - 1, -1, -1)
            for yi, y in enumerate(rng):
                if yi >= limit:
                    break
                row = img_gray[y, :]
                black_ratio = float((row <= black_thresh).sum()) / float(w)
                if black_ratio >= 0.98:
                    run += 1
                else:
                    break
            return run if run >= min_run else 0

        left = count_black_cols_from_edge(gray, True)
        right = count_black_cols_from_edge(gray, False)
        top = count_black_rows_from_edge(gray, True)
        bottom = count_black_rows_from_edge(gray, False)

        x0 = left
        x1 = W - right
        y0 = top
        y1 = H - bottom
        # Validate crop box
        if x0 < 0 or y0 < 0 or x1 <= x0 + 10 or y1 <= y0 + 10:
            return generated_png

        cropped = bgr[y0:y1, x0:x1]
        ok, out = cv2.imencode('.png', cropped)
        if not ok:
            return generated_png
        return out.tobytes()
    except Exception:
        return generated_png

# CORS allowlist for our domains and localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:5173",
        "http://127.0.0.1",
        "http://127.0.0.1:5173",
        "http://tryitout.ai",
        "https://tryitout.ai",
        "http://www.tryitout.ai",
        "https://www.tryitout.ai",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# (Temporarily removed; we'll mount the SPA at "/" after API routes)

@app.get("/health")
def health():
    return {"status": "ok"}


# Expose Firebase web config from server env so the frontend can initialize in production
@app.get("/firebase-config.json")
def firebase_config():
    return {
        "apiKey": os.getenv("FIREBASE_API_KEY"),
        "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
        "projectId": os.getenv("FIREBASE_PROJECT_ID"),
        "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
        "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
        "appId": os.getenv("FIREBASE_APP_ID"),
    }


@app.post("/tryon", response_model=TryOnMultiResponse)
@app.post("/api/tryon", response_model=TryOnMultiResponse)
async def tryon(
    user_image: UploadFile = File(...),
    clothing_image: UploadFile = File(...),
    background: Literal[
        "Plain White", "Library", "Party", "Beach", "Office",
        "Street", "Bedroom", "Living Room", "Cafe", "Park", "Studio Gray"
    ] = Form(...),
    variants: int = Form(1),
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
    # Free PIL objects early
    try:
        user_img.close()
        user_no_bg.close()
    except Exception:
        pass
    del out_buf
    gc.collect()

    # Ensure clothing is PNG bytes (and remove its background to avoid overlay/mannequin artifacts)
    try:
        cloth_img = Image.open(io.BytesIO(clothing_bytes)).convert("RGBA")
        cloth_img = _downscale_max_dim(cloth_img, _max_dim)
        try:
            cloth_no_bg = remove(cloth_img, session=_rembg_session)
        except Exception:
            cloth_no_bg = cloth_img
        out_cloth = io.BytesIO()
        cloth_no_bg.save(out_cloth, format="PNG")
        clothing_png = out_cloth.getvalue()
        try:
            cloth_img.close()
            cloth_no_bg.close()
        except Exception:
            pass
        del out_cloth
    except Exception:
        return JSONResponse(status_code=400, content={"detail": "Invalid clothing image"})

    # Call Gemini for N variants (default 2)
    images: list[str] = []
    count = max(1, min(_max_variants, int(variants)))
    for _ in range(count):
        attempts = 0
        accepted = False
        last_b64: str | None = None
        while attempts < _max_attempts and not accepted:
            attempts += 1
            try:
                img_b64 = generate_tryon_image(
                    user_png,
                    clothing_png,
                    background,
                    strict=(attempts > 1),
                    profile=os.getenv("PROMPT_PROFILE", "sep10"),
                    retry_note=(
                        "No overlays/collages/inset portraits. Do not place any faces on clothing. "
                        "If any extra face is produced, discard and regenerate."
                    ) if attempts > 1 else None,
                )
                generated_png = base64.b64decode(img_b64)
                # Reject if collage/inset-face artifact is detected
                if _reject_generated_if_collage(generated_png):
                    last_b64 = img_b64
                    continue
                if _face_blend_enabled and attempts > 1:
                    merged_png = _preserve_face_with_poisson(user_png, generated_png)
                    if merged_png != generated_png:
                        img_b64 = base64.b64encode(merged_png).decode('utf-8')
                # Auto-crop letterbox if present
                cropped_png = _auto_crop_letterbox(base64.b64decode(img_b64))
                if cropped_png:
                    img_b64 = base64.b64encode(cropped_png).decode('utf-8')
                images.append(img_b64)
                accepted = True
            except Exception:
                continue

    if not images:
        raise HTTPException(status_code=500, detail="Generation failed")

    # Encourage memory release
    gc.collect()
    return {"images_base64": images}


# Explicit CORS preflight handlers for browsers
@app.options("/tryon", include_in_schema=False)
@app.options("/api/tryon", include_in_schema=False)
def tryon_options():
    return JSONResponse({})

# SPA routes: serve index.html for client-side routes (must be BEFORE mount at "/")
@app.get("/app", include_in_schema=False)
@app.get("/signin", include_in_schema=False)
@app.get("/signup", include_in_schema=False)
def spa_pages():
    return FileResponse("static/index.html")

# Also serve index.html for root path
@app.get("/", include_in_schema=False)
def spa_index():
    return FileResponse("static/index.html")

# Serve built static files at root so "/vite.svg" and preview images resolve
try:
    app.mount("/", StaticFiles(directory="static"), name="static")
except Exception:
    pass

