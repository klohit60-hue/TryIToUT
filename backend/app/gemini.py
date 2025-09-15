import base64
import logging
import os
from typing import Optional

import requests


GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

logger = logging.getLogger(__name__)


def _ensure_base64(data: bytes) -> str:
    return base64.b64encode(data).decode("utf-8")


def generate_tryon_image(
    user_png_bytes: bytes,
    clothing_png_bytes: bytes,
    background_choice: str,
    api_key: Optional[str] = None,
    model: str = "gemini-2.5-flash-image-preview",
    strict: bool = False,
    retry_note: Optional[str] = None,
) -> str:
    """
    Calls Gemini API to generate a try-on image.

    Returns: base64 PNG string of the generated image.
    Raises: RuntimeError on failure.
    """
    key = api_key or os.getenv("GEMINI_API_KEY")
    if not key:
        raise RuntimeError("GEMINI_API_KEY is not set")

    headers = {"Content-Type": "application/json"}

    user_b64 = _ensure_base64(user_png_bytes)
    clothing_b64 = _ensure_base64(clothing_png_bytes)

    extra_rules = (
        " The second image may include a model/person; treat it ONLY as garment reference. "
        " Do NOT paste, overlay, blend, or insert the second image or any portion of it (face, hands, body) into the output. "
        " The output must show exactly one person: the person from the first image only. No extra faces or people. "
    )

    if strict:
        extra_rules += (
            " Absolutely no picture-in-picture, no collages, no circular crops, no stickers, no logos, no text. "
            " Use the first image as the base and only modify the clothing region below the neck. Keep framing and composition identical. "
        )

    retry_text = f" {retry_note} " if retry_note else ""

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": (
                            "Task: Generate a new photorealistic image of the same person from the first image, now wearing the garment from the second image."
                            " Critical: Do NOT alter the head/face region from the first image. Keep the same face, expression, hairline and skin details—no beautification or smoothing."
                            " Treat the head (from top of hair to just below the chin) as locked and unchanged; only edit from the neck/shoulders downward."
                            " Accurately reproduce the provided garment’s fabric, color, pattern, logo, silhouette, collars, sleeves, and lengths."
                            " You may adapt pose or viewpoint slightly for a natural fit and correct body/garment alignment."
                            " Render realistic cloth drape, folds, occlusions (arms/hair), and lighting consistent with the scene."
                            " Absolutely avoid picture-in-picture, collages, frames, watermarks, borders, stickers, logos, or any inset portraits."
                            " Output must be a single coherent photo of the person; no extra faces or duplicated subjects."
                            " Do not add black bars, frames, borders, or letterboxing. Fill the full canvas naturally."
                            + extra_rules +
                            f" Set background to {background_choice}."
                            " Output: a clean, artifact-free, high-resolution PNG. Return one inline PNG image as the first part." + retry_text
                        )
                    },
                    {"inline_data": {"mime_type": "image/png", "data": user_b64}},
                    {"inline_data": {"mime_type": "image/png", "data": clothing_b64}},
                ],
            }
        ]
    }

    # Try requested model first, then fall back to known image-capable preview models if not found
    models_to_try = [
        model,
        "gemini-2.5-flash-image-preview",
        "gemini-2.0-flash-preview-image-generation",
    ]

    last_error_text = None
    data = None
    for candidate_model in models_to_try:
        url = f"{GEMINI_API_BASE}/{candidate_model}:generateContent?key={key}"
        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=22)
        except requests.RequestException as req_err:
            logger.error("Gemini request failed for %s: %s", candidate_model, str(req_err)[:300])
            last_error_text = str(req_err)[:300]
            continue
        if resp.status_code == 200:
            data = resp.json()
            break
        # If model not found, try next
        if resp.status_code == 404:
            logger.error("Gemini API error: %s %s", resp.status_code, resp.text[:500])
            last_error_text = resp.text[:500]
            continue
        # For transient/server/quota errors, try the next candidate model
        if resp.status_code in (429, 500, 502, 503):
            logger.warning("Gemini transient error on %s: %s %s", candidate_model, resp.status_code, resp.text[:300])
            last_error_text = resp.text[:300]
            continue
        # Any other error -> raise immediately
        logger.error("Gemini API error: %s %s", resp.status_code, resp.text[:500])
        raise RuntimeError(
            f"Gemini API error: {resp.status_code} {resp.text[:500]}"
        )

    if data is None:
        # Exhausted candidates
        raise RuntimeError(
            f"Gemini API error: 404 {last_error_text or 'Model not found'}"
        )

    # Try to extract image data from candidates → content → parts → inline_data
    try:
        candidates = data.get("candidates", [])
        for candidate in candidates:
            content = candidate.get("content", {})
            parts = content.get("parts", [])
            for part in parts:
                if not isinstance(part, dict):
                    continue
                inline = part.get("inline_data") or part.get("inlineData")
                if inline and isinstance(inline, dict):
                    mime = inline.get("mime_type") or inline.get("mimeType") or ""
                    img_b64 = inline.get("data")
                    if img_b64 and (mime.startswith("image/") or mime == ""):
                        return img_b64
    except Exception as parse_err:
        logger.error("Failed to parse Gemini response: %s", parse_err)

    # Fallbacks for AGemini-style responses
    # Accept common shapes like {"image_base64": "..."} or {"data": "..."} or {"image": "..."}
    for key_name in ("image_base64", "data", "image"):
        if isinstance(data, dict) and key_name in data and isinstance(data[key_name], str):
            return data[key_name]

    # Some responses may encode data differently or return only text (fallback)
    raise RuntimeError("Gemini did not return an image")


