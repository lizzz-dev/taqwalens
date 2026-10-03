"""
TaqwaLens Compliance Engine
Cross-references extracted ingredients against the 350+ E-code database,
determines overall compliance verdicts, and synthesizes 1-click brand inquiries.
"""

import logging
from typing import Dict, List, Optional, Tuple

from backend.data.additives_db import lookup_additive
from backend.models.schemas import (
    AdditiveDetail,
    AuditMetadata,
    AuditResponse,
    IngredientItem,
    IngredientSource,
    InquiryDrafts,
    InquiryEmailDraft,
    VerdictStatus,
)

logger = logging.getLogger("taqwalens.engine")


def _map_origin_to_source(origins: List[str]) -> IngredientSource:
    """Map database origins list to standard IngredientSource enum."""
    if not origins:
        return IngredientSource.UNKNOWN
    primary = origins[0].lower()
    if "plant" in primary or "algae" in primary:
        return IngredientSource.PLANT
    elif "animal" in primary or "insect" in primary:
        return IngredientSource.ANIMAL
    elif "synthetic" in primary or "chemical" in primary:
        return IngredientSource.SYNTHETIC
    elif "mineral" in primary:
        return IngredientSource.MINERAL
    elif "microbial" in primary:
        return IngredientSource.MICROBIAL
    return IngredientSource.UNKNOWN


def _classify_ingredient(raw_text: str) -> IngredientItem:
    """Classify an individual ingredient string using the additives knowledge base."""
    raw_clean = raw_text.strip()
    match = lookup_additive(raw_clean)

    if match:
        status_str = match.get("status", "Mushbooh").upper()
        if "HARAM" in status_str:
            status = VerdictStatus.HARAM
            is_flagged = True
        elif "HALAL" in status_str:
            status = VerdictStatus.HALAL
            is_flagged = False
        else:
            status = VerdictStatus.MUSHBOOH
            is_flagged = True

        origins = match.get("origins", [])
        source = _map_origin_to_source(origins)

        additive_detail = AdditiveDetail(
            code=match.get("code", "E-Additive"),
            name=match.get("name", raw_clean),
            category=match.get("category", "Food Additive"),
            status=status,
            source=source,
            description=match.get("concern", "Standard food additive."),
            fiqh_notes=match.get("concern", "Requires origin verification."),
            reference_authority=match.get("standards_ref", "Halal Standard Guidelines")
        )

        return IngredientItem(
            name=match.get("name", raw_clean),
            raw_text=raw_clean,
            status=status,
            is_flagged=is_flagged,
            source=source,
            additive_detail=additive_detail,
            reason=match.get("concern", "")
        )

    # Contextual heuristic checks for non-database terms
    lower_term = raw_clean.lower()
    
    # Obvious Halal staples
    halal_keywords = [
        "water", "sugar", "salt", "flour", "wheat", "rice", "corn", "maize", "oat",
        "cocoa", "coffee", "tea", "fruit", "juice", "vegetable", "sunflower oil",
        "palm oil", "canola oil", "olive oil", "soybean oil", "coconut", "vanillin",
        "starch", "glucose", "dextrose", "yeast"
    ]
    if any(k in lower_term for k in halal_keywords) and "pork" not in lower_term and "gelatin" not in lower_term:
        return IngredientItem(
            name=raw_clean.title(),
            raw_text=raw_clean,
            status=VerdictStatus.HALAL,
            is_flagged=False,
            source=IngredientSource.PLANT,
            additive_detail=None,
            reason="Natural plant, mineral, or universal Halal food staple."
        )

    # Suspicious non-specified terms
    if any(k in lower_term for k in ["flavor", "flavour", "shortening", "enzyme", "culture", "emulsifier"]):
        return IngredientItem(
            name=raw_clean.title(),
            raw_text=raw_clean,
            status=VerdictStatus.MUSHBOOH,
            is_flagged=True,
            source=IngredientSource.UNKNOWN,
            additive_detail=None,
            reason="Broad category ingredient without declared plant vs animal or alcohol carrier origin."
        )

    # Default to neutral Halal with review note if simple staple
    return IngredientItem(
        name=raw_clean.title(),
        raw_text=raw_clean,
        status=VerdictStatus.HALAL,
        is_flagged=False,
        source=IngredientSource.UNKNOWN,
        additive_detail=None,
        reason="General food ingredient. No prohibited substances identified in initial scan."
    )


def generate_inquiry_drafts(product_name: str, brand: Optional[str], flagged_items: List[IngredientItem]) -> Tuple[str, str, InquiryDrafts]:
    """Generate pre-composed inquiry email and Twitter/X post for Mushbooh items."""
    brand_display = brand if brand else "Consumer Care"
    flagged_names = [f"• {item.name} ({item.raw_text})" for item in flagged_items]
    flagged_summary_text = "\n".join(flagged_names) if flagged_names else "• Ambiguous emulsifiers/enzymes"

    email_subject = f"Dietary Compliance & Ingredient Source Inquiry: {product_name}"
    email_body = f"""Dear {brand_display} Consumer Care Team,

I hope this message finds you well.

I am writing as an interested consumer to inquire about the dietary compliance and sourcing of your product:
Product: {product_name}
{f"Brand: {brand}" if brand else ""}

Upon reviewing the packaging, I noticed the following ingredient(s) whose origin is not explicitly specified on the label:
{flagged_summary_text}

Could you please clarify the following points for dietary compliance:
1. Are these specific ingredients derived 100% from plant/vegetable or microbial sources, or are animal by-products (such as porcine or bovine derivatives) utilized?
2. Are alcohol-based solvents or processing aids used in the extraction of flavorings or stabilizers?
3. Does this product share processing lines with non-Halal animal or pork-containing items?

Thank you very much for your time, transparency, and assistance.

Warm regards,
A Concerned Consumer"""

    flagged_brief = ", ".join([item.additive_detail.code if item.additive_detail else item.name for item in flagged_items[:2]])
    brand_handle = f"@{brand.replace(' ', '')}" if brand else "@brand"
    tweet = f"Hi {brand_handle}, could you clarify if {flagged_brief} in your '{product_name[:30]}' is 100% plant-based / suitable for a Halal diet? Thank you! #HalalCheck #ConsumerTransparency"
    if len(tweet) > 280:
        tweet = f"Hi {brand_handle}, could you confirm if {flagged_brief} in '{product_name[:25]}' is 100% plant-derived? Thanks! #HalalCheck"

    drafts = InquiryDrafts(
        email=InquiryEmailDraft(
            subject=email_subject,
            body=email_body,
            suggested_recipient=f"care@{brand.lower().replace(' ', '')}.com" if brand else None
        ),
        tweet=tweet
    )

    return email_body, tweet, drafts


def audit_compliance(parsed_vision_data: dict, metadata_dict: dict) -> AuditResponse:
    """
    Synthesize complete AuditResponse based on parsed vision ingredients
    and the 350+ additives database.
    """
    product_name = parsed_vision_data.get("product_name") or "Inspected Product"
    brand = parsed_vision_data.get("brand")
    raw_ingredients = parsed_vision_data.get("ingredients") or []
    detected_certifications = parsed_vision_data.get("detected_certifications") or []

    # Parse and cross-reference each ingredient
    ingredients: List[IngredientItem] = []
    flagged_items: List[IngredientItem] = []

    has_haram = False
    has_mushbooh = False

    for raw in raw_ingredients:
        item = _classify_ingredient(raw)
        ingredients.append(item)
        if item.status == VerdictStatus.HARAM:
            has_haram = True
            flagged_items.append(item)
        elif item.status == VerdictStatus.MUSHBOOH:
            has_mushbooh = True
            flagged_items.append(item)

    # Determine overall verdict
    if not ingredients:
        overall_verdict = VerdictStatus.NEEDS_REVIEW
        verdict_label = "Needs Review"
        verdict_color = "#64748B"
        verdict_summary = "No legible ingredients could be parsed from the packaging image. Please re-scan with clearer lighting or a flatter angle."
    elif has_haram:
        overall_verdict = VerdictStatus.HARAM
        verdict_label = "Haram Detected"
        verdict_color = "#DC2626"
        haram_names = ", ".join([item.name for item in flagged_items if item.status == VerdictStatus.HARAM])
        verdict_summary = f"Prohibited substance(s) detected: {haram_names}. Consuming this product violates standard Islamic dietary guidelines."
    elif has_mushbooh:
        overall_verdict = VerdictStatus.MUSHBOOH
        verdict_label = "Mushbooh (Verification Required)"
        verdict_color = "#D97706"
        mushbooh_names = ", ".join([item.name for item in flagged_items if item.status == VerdictStatus.MUSHBOOH])
        verdict_summary = f"Doubtful ingredient(s) identified: {mushbooh_names}. Packaging does not declare whether these are vegetable- or animal-derived. Use the 1-Click Brand Inquiry drawer to request clarification."
    else:
        overall_verdict = VerdictStatus.HALAL
        verdict_label = "Halal"
        verdict_color = "#059669"
        cert_info = f" Accredited certification marks detected: {', '.join(detected_certifications)}." if detected_certifications else " All identified ingredients are permissible."
        verdict_summary = f"No prohibited or ambiguous additives identified.{cert_info}"

    # Generate inquiry drafts if Mushbooh or Haram
    email_text, tweet_text, inquiry_drafts = generate_inquiry_drafts(
        product_name=product_name,
        brand=brand,
        flagged_items=flagged_items
    )

    metadata = AuditMetadata(
        model_used=metadata_dict.get("model_used", "groq-llama-3.2-11b-vision-preview"),
        processing_time_ms=metadata_dict.get("processing_time_ms", 0),
        image_width=metadata_dict.get("image_width", 1024),
        image_height=metadata_dict.get("image_height", 1024),
        groq_fallback_triggered=metadata_dict.get("groq_fallback_triggered", False)
    )

    return AuditResponse(
        product_name=product_name,
        brand=brand,
        overall_verdict=overall_verdict,
        verdict_label=verdict_label,
        verdict_color=verdict_color,
        verdict_summary=verdict_summary,
        detected_certifications=detected_certifications,
        ingredients=ingredients,
        flagged_items=flagged_items,
        inquiry_email=email_text,
        inquiry_tweet=tweet_text,
        inquiry_details=inquiry_drafts,
        disclaimer="TaqwaLens provides educational compliance analysis and is not a religious decree (fatwa). Verify with accredited scholars.",
        metadata=metadata
    )
