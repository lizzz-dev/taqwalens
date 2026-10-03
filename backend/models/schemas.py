from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class VerdictStatus(str, Enum):
    HALAL = "HALAL"
    HARAM = "HARAM"
    MUSHBOOH = "MUSHBOOH"
    NEEDS_REVIEW = "NEEDS_REVIEW"


class IngredientSource(str, Enum):
    PLANT = "plant"
    ANIMAL = "animal"
    SYNTHETIC = "synthetic"
    MINERAL = "mineral"
    MICROBIAL = "microbial"
    UNKNOWN = "unknown"


class AdditiveDetail(BaseModel):
    code: str = Field(description="E-number or additive identifier, e.g. 'E471' or 'INS471'")
    name: str = Field(description="Standard chemical or additive name, e.g. 'Mono- and diglycerides of fatty acids'")
    category: str = Field(description="Functional category, e.g. 'Emulsifier', 'Preservative', 'Color'")
    status: VerdictStatus = Field(description="Compliance status of this additive")
    source: IngredientSource = Field(description="Primary origin of the substance")
    description: str = Field(description="Layperson explanation of the additive function")
    fiqh_notes: str = Field(description="Specific Islamic jurisprudential reasoning, cross-school opinions, or conditional requirements")
    reference_authority: Optional[str] = Field(default=None, description="Certifying body or food standard citation (e.g. 'JAKIM Halal Standards 2020')")


class IngredientItem(BaseModel):
    name: str = Field(description="Normalized ingredient name")
    raw_text: str = Field(description="Exact verbatim text snippet identified on packaging")
    status: VerdictStatus = Field(description="Ingredient-level compliance status")
    is_flagged: bool = Field(default=False, description="True if this item triggers a Haram or Mushbooh alert")
    source: Optional[IngredientSource] = Field(default=IngredientSource.UNKNOWN)
    additive_detail: Optional[AdditiveDetail] = Field(default=None, description="Detailed additive info if matched with E-code database")
    reason: Optional[str] = Field(default=None, description="Brief explanation of why this item is classified as such")


class InquiryEmailDraft(BaseModel):
    subject: str = Field(description="Email subject line tailored for brand customer care")
    body: str = Field(description="Polite, detailed technical inquiry body specifying product, batch, and ingredients")
    suggested_recipient: Optional[str] = Field(default=None, description="Inferred brand customer care email or contact URL")


class InquiryDrafts(BaseModel):
    email: InquiryEmailDraft = Field(description="Formal brand inquiry email draft")
    tweet: str = Field(max_length=280, description="Concise Twitter/X post querying the manufacturer with relevant hashtags")


class AuditMetadata(BaseModel):
    model_used: str = Field(description="Model identifier, e.g. 'groq-llama-3.2-11b-vision-preview' or 'gemini-1.5-flash'")
    processing_time_ms: int = Field(description="Roundtrip processing latency in milliseconds")
    image_width: int = Field(description="Post-compression image width")
    image_height: int = Field(description="Post-compression image height")
    groq_fallback_triggered: bool = Field(default=False, description="True if primary engine failed and fallback was used")


class AuditResponse(BaseModel):
    product_name: str = Field(description="Extracted or inferred product name from packaging")
    brand: Optional[str] = Field(default=None, description="Identified manufacturer or brand")
    overall_verdict: VerdictStatus = Field(description="Aggregate compliance verdict: HALAL, HARAM, MUSHBOOH, NEEDS_REVIEW")
    verdict_label: str = Field(default="Halal", description="Human-readable verdict label (e.g. 'Halal', 'Haram Detected', 'Mushbooh (Verification Required)')")
    verdict_color: str = Field(description="Hex color code (#10B981, #EF4444, #F59E0B, #6B7280)")
    verdict_summary: str = Field(description="2-3 sentence executive summary explaining the verdict")
    detected_certifications: List[str] = Field(default_factory=list, description="List of recognized Halal logos (e.g. ['JAKIM', 'IFANCA'])")
    ingredients: List[IngredientItem] = Field(description="Comprehensive list of parsed ingredients")
    flagged_items: List[IngredientItem] = Field(default_factory=list, description="Subset of ingredients triggering alerts")
    inquiry_email: str = Field(description="Ready-to-send formatted email body for the 1-click drawer")
    inquiry_tweet: str = Field(description="Ready-to-post tweet draft for the 1-click drawer")
    inquiry_details: Optional[InquiryDrafts] = Field(default=None, description="Structured inquiry payload")
    disclaimer: str = Field(
        default="TaqwaLens provides educational compliance analysis and is not a religious decree (fatwa). Verify with accredited scholars.",
        description="Non-fatwa educational disclaimer"
    )
    metadata: AuditMetadata = Field(description="Telemetry and engine provenance")
    madhhab_profile: Optional[str] = Field(default="standard", description="Applied juristic school profile (standard, hanafi, shafii, strict)")
    dietary_tags: List[str] = Field(default_factory=list, description="Dietary compatibility tags (e.g. 'Vegan Suitable', 'Vegetarian')")
    allergens_detected: List[str] = Field(default_factory=list, description="Common food allergens detected (e.g. 'Wheat (Gluten)', 'Milk')")
