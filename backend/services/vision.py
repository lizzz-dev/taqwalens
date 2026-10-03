"""
TaqwaLens Vision Service — Anti-Hallucination & Truthful Optical Pipeline
Strict separation of concerns:
1. Validates that image is a genuine food packaging label (rejects people, rooms, objects, blur).
2. Performs faithful OCR extraction without hallucinating ingredients or guessing religious verdicts.
3. Automatically falls back from Groq Llama 3.2 11B Vision to Gemini 1.5 Flash.
"""

import io
import json
import logging
import os
import re
import time
from typing import Any, Dict, List, Optional, Tuple
from PIL import Image
from dotenv import load_dotenv

# Load root .env
load_dotenv()

logger = logging.getLogger("taqwalens.vision")

VISION_SYSTEM_PROMPT = """You are TaqwaLens Vision AI, a rigorous, objective optical OCR scanner for food packaging labels.

FIRST, evaluate: Does this image contain a readable food packaging label, ingredient list, nutrition panel, or visible E-numbers/chemical additives?
- If the image depicts a human face, clothing, shoe, room, scenery, pet, animal, blank screen, solid color, random non-food object, or is completely unreadable/blurry:
  Return strictly:
  {
    "is_valid_label": false,
    "error_message": "No food ingredient panel or E-codes detected. Please capture a clear photo of the packaging label.",
    "product_name": null,
    "brand": null,
    "ingredients": [],
    "detected_certifications": []
  }

- If the image DOES contain a readable food packaging label or ingredient list:
  Extract:
  1. "is_valid_label": true
  2. "error_message": null
  3. "product_name": Extracted product name from packaging (or null if unstated)
  4. "brand": Extracted brand/manufacturer name (or null)
  5. "ingredients": An array of raw ingredient strings exactly as listed on the label. Break down compound ingredients into discrete items. Keep E-numbers and codes intact (e.g. "Emulsifier (E471)", "Carmine (E120)", "Wheat Flour").
  6. "detected_certifications": An array of recognized Halal certifying logos or text (e.g. "JAKIM", "MUI", "IFANCA", "HMC", "SANHA", "BPJPH", "Halal Correct", "Halal").

CRITICAL GROUND-TRUTH RULES:
- DO NOT invent, hallucinate, or guess ingredients that are not visible in the image.
- DO NOT assess or output any Halal/Haram/Mushbooh verdicts. Your sole responsibility is faithful OCR extraction of the raw text and visual badges.
- Return ONLY valid JSON matching the schema above with no markdown fences, no conversational filler, and no commentary.
"""


def preprocess_image(image_bytes: bytes, max_dim: int = 1024, quality: int = 85) -> Tuple[bytes, int, int]:
    """
    Auto-resizes and optimizes packaging images to max dimensions (1024x1024)
    preserving aspect ratio. Converts non-RGB images to standard RGB.
    Returns (optimized_jpeg_bytes, width, height).
    """
    image = Image.open(io.BytesIO(image_bytes))

    # Convert modes like RGBA, CMYK, P to standard RGB
    if image.mode in ("RGBA", "LA", "P"):
        rgb_image = Image.new("RGB", image.size, (255, 255, 255))
        if image.mode == "P":
            image = image.convert("RGBA")
        rgb_image.paste(image, mask=image.split()[3] if len(image.split()) == 4 else None)
        image = rgb_image
    elif image.mode != "RGB":
        image = image.convert("RGB")

    orig_w, orig_h = image.size
    scaling_factor = min(max_dim / max(orig_w, orig_h), 1.0)

    if scaling_factor < 1.0:
        new_w = int(orig_w * scaling_factor)
        new_h = int(orig_h * scaling_factor)
        image = image.resize((new_w, new_h), Image.Resampling.LANCZOS)
    else:
        new_w, new_h = orig_w, orig_h

    output_buffer = io.BytesIO()
    image.save(output_buffer, format="JPEG", quality=quality, optimize=True)
    return output_buffer.getvalue(), new_w, new_h


def _clean_json_output(raw_text: str) -> dict:
    """Extract valid JSON from raw LLM output, handling markdown blocks if present."""
    text = raw_text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    text = text.strip()
    return json.loads(text)


async def call_groq_vision(image_bytes: bytes) -> dict:
    """Invoke Groq Llama 3.2 11B Vision preview with base64 image."""
    import base64
    from groq import AsyncGroq

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or "your_groq_api_key_here" in api_key:
        raise ValueError("GROQ_API_KEY is not configured in .env")

    client = AsyncGroq(api_key=api_key)
    base64_encoded = base64.b64encode(image_bytes).decode("utf-8")
    data_url = f"data:image/jpeg;base64,{base64_encoded}"

    response = await client.chat.completions.create(
        model="llama-3.2-11b-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": VISION_SYSTEM_PROMPT},
                    {"type": "image_url", "image_url": {"url": data_url}}
                ]
            }
        ],
        temperature=0.1,
        max_tokens=1024,
        response_format={"type": "json_object"}
    )
    content = response.choices[0].message.content
    return _clean_json_output(content)


async def call_gemini_vision(image_bytes: bytes) -> Tuple[dict, str]:
    """Fallback: Invoke Gemini Vision using google-genai SDK or REST."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or "your_gemini_api_key_here" in api_key:
        raise ValueError("GEMINI_API_KEY is not configured in .env")

    # Try supported active models in order of latency and quota resilience
    candidate_models = ["gemini-3.5-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"]
    last_err = None

    for model_name in candidate_models:
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=api_key)
            response = await client.aio.models.generate_content(
                model=model_name,
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                    VISION_SYSTEM_PROMPT
                ],
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    response_mime_type="application/json"
                )
            )
            cleaned = _clean_json_output(response.text)
            return cleaned, model_name
        except Exception as e:
            last_err = e
            logger.warning(f"google-genai client call for {model_name} failed: {e}. Trying next...")

    # If google-genai SDK attempts failed, try REST fallback
    try:
        import httpx
        import base64
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={api_key}"
        b64_img = base64.b64encode(image_bytes).decode("utf-8")
        payload = {
            "contents": [{
                "parts": [
                    {"text": VISION_SYSTEM_PROMPT},
                    {"inline_data": {"mime_type": "image/jpeg", "data": b64_img}}
                ]
            }],
            "generationConfig": {"temperature": 0.1, "responseMimeType": "application/json"}
        }
        async with httpx.AsyncClient(timeout=15.0) as http_client:
            res = await http_client.post(url, json=payload)
            res.raise_for_status()
            data = res.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            return _clean_json_output(raw_text), "gemini-3.5-flash-lite-rest"
    except Exception as rest_err:
        logger.error(f"Gemini REST fallback also failed: {rest_err}")
        raise RuntimeError(f"All Gemini vision candidate models failed (Last SDK error: {last_err}, REST error: {rest_err})")


async def extract_packaging_data(raw_image_bytes: bytes) -> Tuple[dict, dict]:
    """
    Main vision pipeline:
    1. Preprocesses & compresses image to max 1024x1024.
    2. Runs Groq Llama 3.2 Vision.
    3. Seamlessly falls back to Gemini 1.5 Flash on 429, timeouts, or exceptions.
    Returns: (parsed_data, telemetry_metadata)
    """
    start_time = time.time()
    compressed_bytes, width, height = preprocess_image(raw_image_bytes)

    model_used = "groq-llama-3.2-11b-vision-preview"
    fallback_triggered = False
    result_data = None

    # Attempt Primary Engine: Groq Vision
    try:
        logger.info("Calling primary vision engine: Groq Llama 3.2 11B Vision...")
        result_data = await call_groq_vision(compressed_bytes)
    except Exception as groq_err:
        logger.warning(f"Groq Vision unavailable ({groq_err}). Triggering fallback to Gemini 1.5 Flash...")
        fallback_triggered = True
        model_used = "gemini-1.5-flash"
        try:
            result_data, model_used = await call_gemini_vision(compressed_bytes)
        except Exception as gemini_err:
            logger.error(f"Gemini fallback also failed: {gemini_err}")
            # Neither API is reachable
            raise RuntimeError(
                f"Both Groq Vision and Gemini fallback failed. Check GROQ_API_KEY and GEMINI_API_KEY in .env. (Groq: {groq_err}, Gemini: {gemini_err})"
            )

    latency_ms = int((time.time() - start_time) * 1000)

    metadata = {
        "model_used": model_used,
        "processing_time_ms": latency_ms,
        "image_width": width,
        "image_height": height,
        "groq_fallback_triggered": fallback_triggered
    }

    return result_data, metadata
