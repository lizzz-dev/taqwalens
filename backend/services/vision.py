"""
TaqwaLens Vision Service
Handles image preprocessing (downscaling to max 1024x1024),
Groq Llama 3.2 11B Vision primary inference, and automatic Gemini 1.5 Flash fallback.
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

VISION_SYSTEM_PROMPT = """You are TaqwaLens Vision AI, an expert food packaging compliance auditor.
Analyze the provided food packaging image and extract:
1. Product name and brand (if visible).
2. Complete list of ingredients listed in the ingredients statement (normalize and list each ingredient distinctly).
3. Any visible Halal certification logos or markings (e.g. JAKIM, MUI, IFANCA, HMC, SANHA, Halal Correct, Crescent, etc.).

Return ONLY a valid JSON object matching this schema:
{
  "product_name": "Product Name or Inferred Item",
  "brand": "Brand Name or null",
  "ingredients": [
    "ingredient 1 (e.g. Wheat Flour)",
    "ingredient 2 (e.g. Emulsifier E471)",
    "ingredient 3 (e.g. Carmine E120)"
  ],
  "detected_certifications": ["JAKIM", "IFANCA"]
}

Important:
- If no ingredients are legible, return an empty array for ingredients.
- Separate sub-ingredients (e.g. "chocolate (sugar, cocoa butter, milk powder)" -> ["sugar", "cocoa butter", "milk powder"]).
- Keep E-numbers intact if listed (e.g. "E471", "E120", "INS 500").
- Do NOT output any markdown backticks, extra commentary, or conversational filler. Only pure JSON.
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


async def call_gemini_vision(image_bytes: bytes) -> dict:
    """Fallback: Invoke Gemini 1.5 Flash vision using google-genai SDK."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or "your_gemini_api_key_here" in api_key:
        raise ValueError("GEMINI_API_KEY is not configured in .env")

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
        response = await client.aio.models.generate_content(
            model="gemini-1.5-flash",
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                VISION_SYSTEM_PROMPT
            ],
            config=types.GenerateContentConfig(
                temperature=0.1,
                response_mime_type="application/json"
            )
        )
        return _clean_json_output(response.text)
    except Exception as e:
        logger.warning(f"google-genai client call failed: {e}. Trying httpx REST fallback.")
        # Direct REST fallback to Gemini 1.5 Flash endpoint if SDK encounters version mismatch
        import httpx
        import base64
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
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
            return _clean_json_output(raw_text)


async def extract_packaging_data(raw_image_bytes: bytes) -> Tuple[dict, dict]:
    """
    Main vision pipeline:
    1. Preprocesses & compresses image to max 1024x1024.
    2. Runs Groq Llama 3.2 Vision.
    3. Seamlessly falls back to Gemini 1.5 Flash on any failure or rate limit.
    Returns: (parsed_data, telemetry_metadata)
    """
    start_time = time.time()
    compressed_bytes, width, height = preprocess_image(raw_image_bytes)

    model_used = "groq-llama-3.2-11b-vision-preview"
    fallback_triggered = False
    result_data = None

    # Attempt Primary Engine: Groq Vision
    try:
        logger.info("Attempting primary vision engine: Groq Llama 3.2 11B Vision...")
        result_data = await call_groq_vision(compressed_bytes)
    except Exception as groq_err:
        logger.warning(f"Groq Vision failed or rate limited ({groq_err}). Triggering fallback to Gemini 1.5 Flash...")
        fallback_triggered = True
        model_used = "gemini-1.5-flash"
        try:
            result_data = await call_gemini_vision(compressed_bytes)
        except Exception as gemini_err:
            logger.error(f"Gemini fallback also failed: {gemini_err}")
            # If both fail (e.g. during demo without keys), provide graceful mock recovery
            result_data = {
                "product_name": "Sample Packaging Item (Demo Mode)",
                "brand": "Demo Brand",
                "ingredients": [
                    "Wheat Flour",
                    "Vegetable Oil",
                    "Sugar",
                    "Emulsifier (E471)",
                    "Salt",
                    "Natural Flavoring"
                ],
                "detected_certifications": []
            }
            model_used = "local-demo-engine"

    latency_ms = int((time.time() - start_time) * 1000)

    metadata = {
        "model_used": model_used,
        "processing_time_ms": latency_ms,
        "image_width": width,
        "image_height": height,
        "groq_fallback_triggered": fallback_triggered
    }

    return result_data, metadata
