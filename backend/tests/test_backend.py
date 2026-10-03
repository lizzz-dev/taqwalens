"""
Unit and Integration Tests for TaqwaLens Enterprise Backend
Tests additives lookup, image preprocessing, engine verdicts, inquiry generation,
security headers, magic-byte validation, payload limits, and error masking.
"""

import io
from PIL import Image
import pytest
from fastapi.testclient import TestClient

from backend.data.additives_db import get_total_count, lookup_additive, normalize_term
from backend.main import MAX_PAYLOAD_SIZE, app
from backend.models.schemas import VerdictStatus
from backend.services.engine import audit_compliance
from backend.services.vision import preprocess_image

client = TestClient(app)


def test_additives_db_count():
    """Verify that 350+ additives are loaded in the database."""
    total = get_total_count()
    assert total >= 350, f"Expected at least 350 additives, found {total}"


def test_additives_normalization():
    """Verify normalization handles messy user inputs and synonyms."""
    assert normalize_term("E-471") == "E471"
    assert normalize_term("e 471") == "E471"
    assert normalize_term("INS 471") == "E471"
    assert normalize_term("471") == "E471"
    assert normalize_term("e120") == "E120"


def test_additives_lookup_key_items():
    """Test critical items: E471 (Mushbooh), E120 (Haram), E100 (Halal), Gelatin (Mushbooh)."""
    e471 = lookup_additive("E471")
    assert e471 is not None
    assert e471["status"].lower() == "mushbooh"

    e120 = lookup_additive("carmine")
    assert e120 is not None
    assert e120["status"].lower() == "haram"

    e100 = lookup_additive("curcumin")
    assert e100 is not None
    assert e100["status"].lower() == "halal"

    gelatin = lookup_additive("pork gelatin")
    assert gelatin is not None
    assert gelatin["status"].lower() == "haram"


def test_image_preprocessing():
    """Test image downscaling to max 1024x1024 preserving aspect ratio."""
    img = Image.new("RGBA", (2000, 1000), color=(255, 0, 0, 255))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    raw_bytes = buf.getvalue()

    compressed_bytes, w, h = preprocess_image(raw_bytes, max_dim=1024)
    assert w == 1024
    assert h == 512
    assert len(compressed_bytes) > 0


def test_engine_audit_verdicts_and_colors():
    """Verify refined institutional colors: Emerald (#059669), Honey Amber (#D97706), Crimson (#DC2626)."""
    telemetry = {
        "model_used": "test-model",
        "processing_time_ms": 100,
        "image_width": 1024,
        "image_height": 768,
        "groq_fallback_triggered": False
    }

    # Mushbooh item (E471)
    mushbooh_vision = {
        "product_name": "Cocoa Biscuits",
        "brand": "Delice",
        "ingredients": ["Wheat Flour", "Sugar", "Emulsifier E471"],
        "detected_certifications": []
    }
    res_mushbooh = audit_compliance(mushbooh_vision, telemetry)
    assert res_mushbooh.overall_verdict == VerdictStatus.MUSHBOOH
    assert res_mushbooh.verdict_color == "#D97706"  # Refined Honey Amber
    assert "E471" in res_mushbooh.inquiry_email
    assert len(res_mushbooh.inquiry_tweet) <= 280

    # Haram item (Carmine / E120)
    haram_vision = {
        "product_name": "Strawberry Candy",
        "brand": "SweetCo",
        "ingredients": ["Sugar", "Color (E120)", "Citric Acid"],
        "detected_certifications": []
    }
    res_haram = audit_compliance(haram_vision, telemetry)
    assert res_haram.overall_verdict == VerdictStatus.HARAM
    assert res_haram.verdict_color == "#DC2626"  # Muted Crimson

    # Halal item
    halal_vision = {
        "product_name": "Organic Honey Cereal",
        "brand": "NatureBio",
        "ingredients": ["Wheat", "Sugar", "Honey", "Curcumin E100", "Salt"],
        "detected_certifications": ["JAKIM"]
    }
    res_halal = audit_compliance(halal_vision, telemetry)
    assert res_halal.overall_verdict == VerdictStatus.HALAL
    assert res_halal.verdict_color == "#059669"  # Refined Emerald


def test_security_headers():
    """Verify defensive HTTP security headers are injected on all endpoints."""
    res = client.get("/health")
    assert res.status_code == 200
    assert res.headers.get("X-Content-Type-Options") == "nosniff"
    assert res.headers.get("X-Frame-Options") == "DENY"
    assert res.headers.get("X-XSS-Protection") == "1; mode=block"
    assert res.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"


def test_disguised_file_rejection():
    """Verify non-image/disguised binaries are rejected via magic byte & Pillow checks."""
    fake_payload = b"#!/bin/bash\necho 'malicious executable payload disguised as jpg'"
    res = client.post(
        "/api/audit",
        files={"file": ("malicious.jpg", fake_payload, "image/jpeg")}
    )
    assert res.status_code == 400
    data = res.json()
    assert "Invalid image signature" in data["detail"] or "integrity check failed" in data["detail"]


def test_payload_limit_enforcement():
    """Verify payloads exceeding 10MB are rejected with 413 Payload Too Large."""
    # Send request with oversized content-length header to trigger early rejection
    res = client.post(
        "/api/audit",
        headers={"content-length": str(MAX_PAYLOAD_SIZE + 5000)},
        files={"file": ("large.jpg", b"fake data", "image/jpeg")}
    )
    assert res.status_code == 413
    data = res.json()
    assert data["error"] == "Payload Too Large"


def test_unlisted_ingredient_classification():
    """Verify non-database terms are classified neutrally as Unlisted / Standard Ingredient."""
    telemetry = {
        "model_used": "test-model",
        "processing_time_ms": 50,
        "image_width": 800,
        "image_height": 600,
        "groq_fallback_triggered": False
    }
    vision_data = {
        "is_valid_label": True,
        "product_name": "Herbal Tea Blend",
        "brand": "PureHerbs",
        "ingredients": ["Dried Mint Leaves", "Crushed Cardamom Pods"],
        "detected_certifications": []
    }
    res = audit_compliance(vision_data, telemetry)
    assert res.overall_verdict == VerdictStatus.HALAL
    assert len(res.ingredients) == 2
    for item in res.ingredients:
        assert item.status == VerdictStatus.HALAL
        assert item.is_flagged is False
        assert "Unlisted / Standard Ingredient" in item.reason


def test_prohibited_keywords_classification():
    """Verify explicit porcine or alcohol ingredients are classified as HARAM."""
    telemetry = {
        "model_used": "test-model",
        "processing_time_ms": 50,
        "image_width": 800,
        "image_height": 600,
        "groq_fallback_triggered": False
    }
    vision_data = {
        "is_valid_label": True,
        "product_name": "Savory Snack",
        "brand": "SnackCorp",
        "ingredients": ["Corn Meal", "Smoked Pork Flavoring", "Vegetable Oil"],
        "detected_certifications": []
    }
    res = audit_compliance(vision_data, telemetry)
    assert res.overall_verdict == VerdictStatus.HARAM
    assert res.verdict_color == "#DC2626"
    assert any("pork" in item.name.lower() and item.status == VerdictStatus.HARAM for item in res.ingredients)


def test_api_audit_rejects_non_food_image(monkeypatch):
    """Verify non-food image (is_valid_label=False) returns HTTP 422 with clean error message."""
    async def mock_extract(bytes_):
        return {
            "is_valid_label": False,
            "error_message": "No food ingredient panel or E-codes detected. Please capture a clear photo of the packaging label.",
            "product_name": None,
            "brand": None,
            "ingredients": [],
            "detected_certifications": []
        }, {
            "model_used": "mock-vision",
            "processing_time_ms": 40,
            "image_width": 400,
            "image_height": 300,
            "groq_fallback_triggered": False
        }

    monkeypatch.setattr("backend.main.extract_packaging_data", mock_extract)

    img = Image.new("RGB", (400, 300), color=(100, 200, 100))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    img_bytes = buf.getvalue()

    response = client.post(
        "/api/audit",
        files={"file": ("room_photo.jpg", img_bytes, "image/jpeg")}
    )
    assert response.status_code == 422
    data = response.json()
    assert "No food ingredient panel or E-codes detected" in data["detail"]


def test_api_audit_rejects_empty_ingredients(monkeypatch):
    """Verify that an image with no extracted ingredients also returns HTTP 422."""
    async def mock_extract(bytes_):
        return {
            "is_valid_label": True,
            "error_message": None,
            "product_name": "Empty Box",
            "brand": None,
            "ingredients": [],
            "detected_certifications": []
        }, {
            "model_used": "mock-vision",
            "processing_time_ms": 40,
            "image_width": 400,
            "image_height": 300,
            "groq_fallback_triggered": False
        }

    monkeypatch.setattr("backend.main.extract_packaging_data", mock_extract)

    img = Image.new("RGB", (400, 300), color=(100, 200, 100))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    img_bytes = buf.getvalue()

    response = client.post(
        "/api/audit",
        files={"file": ("empty_label.jpg", img_bytes, "image/jpeg")}
    )
    assert response.status_code == 422


def test_api_audit_endpoint_valid(monkeypatch):
    """Test POST /api/audit with a valid genuine food packaging image."""
    async def mock_extract(bytes_):
        return {
            "is_valid_label": True,
            "error_message": None,
            "product_name": "Artisan Biscuits",
            "brand": "SweetBake",
            "ingredients": ["Wheat Flour", "Sugar", "Emulsifier (E471)", "Salt"],
            "detected_certifications": []
        }, {
            "model_used": "gemini-3.5-flash-lite",
            "processing_time_ms": 320,
            "image_width": 800,
            "image_height": 600,
            "groq_fallback_triggered": True
        }

    monkeypatch.setattr("backend.main.extract_packaging_data", mock_extract)

    img = Image.new("RGB", (400, 300), color=(100, 200, 100))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    img_bytes = buf.getvalue()

    response = client.post(
        "/api/audit",
        files={"file": ("test_package.jpg", img_bytes, "image/jpeg")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["product_name"] == "Artisan Biscuits"
    assert data["overall_verdict"] == "MUSHBOOH"
    assert data["verdict_color"] == "#D97706"
    assert "E471" in data["inquiry_email"]
    assert "metadata" in data
    assert data["metadata"]["model_used"] == "gemini-3.5-flash-lite"


def test_api_ecode_lookup():
    """Test GET /api/ecode/E471."""
    res = client.get("/api/ecode/E471")
    assert res.status_code == 200
    data = res.json()
    assert data["code"] == "E471"
    assert data["status"] == "MUSHBOOH"


def test_madhhab_profile_hanafi():
    """Verify that Hanafi profile flags Carmine E120 as strictly Haram."""
    telemetry = {
        "model_used": "test-model",
        "processing_time_ms": 30,
        "image_width": 600,
        "image_height": 400,
        "groq_fallback_triggered": False
    }
    vision_data = {
        "is_valid_label": True,
        "product_name": "Fruit Chews",
        "brand": "CandyCo",
        "ingredients": ["Sugar", "Color Carmine E120", "Citric Acid"],
        "detected_certifications": []
    }
    res = audit_compliance(vision_data, telemetry, madhhab="hanafi")
    assert res.overall_verdict == VerdictStatus.HARAM
    assert res.madhhab_profile == "hanafi"
    assert any("Hanafi" in item.reason for item in res.flagged_items)


def test_allergen_and_dietary_tag_detection():
    """Verify allergen detection (gluten, dairy) and dietary suitability."""
    telemetry = {
        "model_used": "test-model",
        "processing_time_ms": 30,
        "image_width": 600,
        "image_height": 400,
        "groq_fallback_triggered": False
    }
    vision_data = {
        "is_valid_label": True,
        "product_name": "Wheat & Milk Biscuit",
        "brand": "Bakery",
        "ingredients": ["Wheat Flour", "Sugar", "Whole Milk Powder", "Palm Oil"],
        "detected_certifications": []
    }
    res = audit_compliance(vision_data, telemetry)
    assert "Wheat (Gluten)" in res.allergens_detected
    assert "Dairy / Milk" in res.allergens_detected
    assert "Vegetarian" in res.dietary_tags


def test_api_barcode_endpoint(monkeypatch):
    """Test GET /api/barcode/{upc} with mocked OpenFoodFacts response."""
    async def mock_get(self, url, headers=None):
        class MockResponse:
            status_code = 200
            def json(self):
                return {
                    "status": 1,
                    "product": {
                        "product_name": "Lotus Biscoff Spread",
                        "brands": "Lotus",
                        "ingredients_text_en": "Original caramelised biscuits 58% (wheat flour, sugar, vegetable oils (palm, rapeseed), candy sugar syrup, raising agent (sodium hydrogen carbonate), soya flour, salt, cinnamon), rapeseed oil, sugar, emulsifier (soya lecithin), acid (citric acid).",
                        "additives_tags": ["en:e322", "en:e330", "en:e500"],
                        "labels_tags": ["en:halal"]
                    }
                }
            def raise_for_status(self):
                pass
        return MockResponse()

    monkeypatch.setattr("httpx.AsyncClient.get", mock_get)

    res = client.get("/api/barcode/5410126006957")
    assert res.status_code == 200
    data = res.json()
    assert "Lotus Biscoff" in data["product_name"]
    assert data["overall_verdict"] in ["HALAL", "MUSHBOOH"]
    assert "Wheat (Gluten)" in data["allergens_detected"]
    assert "Soy" in data["allergens_detected"]
