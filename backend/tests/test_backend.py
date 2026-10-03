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


def test_api_audit_endpoint_valid():
    """Test POST /api/audit with a valid genuine JPEG."""
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
    assert "product_name" in data
    assert "overall_verdict" in data
    assert data["verdict_color"] in ["#059669", "#DC2626", "#D97706", "#64748B"]
    assert "inquiry_email" in data
    assert "inquiry_tweet" in data
    assert "metadata" in data


def test_api_ecode_lookup():
    """Test GET /api/ecode/E471."""
    res = client.get("/api/ecode/E471")
    assert res.status_code == 200
    data = res.json()
    assert data["code"] == "E471"
    assert data["status"] == "MUSHBOOH"
