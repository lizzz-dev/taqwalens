# TaqwaLens — Data Contract & Schema Specification

**Document ID:** `02_DATA_CONTRACT.md`  
**Version:** 1.0.0  
**Scope:** Universal schema contract unifying Backend (Pydantic v2) and Frontend (TypeScript).

---

## 1. Core Enumerations & Types

### 1.1 Verdict Status
- `HALAL`: Permissible ingredients with no doubtful or prohibited substances.
- `HARAM`: Definitively prohibited substance found (e.g., pork gelatine, alcohol, carmine in certain rulings).
- `MUSHBOOH`: Doubtful/conditional origin requiring manufacturer clarification (e.g., unspecified E471, rennet, pepsin).
- `NEEDS_REVIEW`: Packaging unclear, obscured text, or insufficient data.

---

## 2. Python Pydantic Models (`schemas.py`)

```python
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
    overall_verdict: VerdictStatus = Field(description="Aggregate compliance verdict")
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
```

---

## 3. TypeScript Interfaces (`types.ts`)

```typescript
export type VerdictStatus = 'HALAL' | 'HARAM' | 'MUSHBOOH' | 'NEEDS_REVIEW';

export type IngredientSource = 'plant' | 'animal' | 'synthetic' | 'mineral' | 'microbial' | 'unknown';

export interface AdditiveDetail {
  code: string;
  name: string;
  category: string;
  status: VerdictStatus;
  source: IngredientSource;
  description: string;
  fiqh_notes: string;
  reference_authority?: string;
}

export interface IngredientItem {
  name: string;
  raw_text: string;
  status: VerdictStatus;
  is_flagged: boolean;
  source?: IngredientSource;
  additive_detail?: AdditiveDetail | null;
  reason?: string;
}

export interface InquiryEmailDraft {
  subject: string;
  body: string;
  suggested_recipient?: string;
}

export interface InquiryDrafts {
  email: InquiryEmailDraft;
  tweet: string;
}

export interface AuditMetadata {
  model_used: string;
  processing_time_ms: number;
  image_width: number;
  image_height: number;
  groq_fallback_triggered: boolean;
}

export interface AuditResponse {
  product_name: string;
  brand?: string;
  overall_verdict: VerdictStatus;
  verdict_color: string; // e.g. '#10B981' | '#EF4444' | '#F59E0B' | '#6B7280'
  verdict_summary: string;
  detected_certifications: string[];
  ingredients: IngredientItem[];
  flagged_items: IngredientItem[];
  inquiry_email: string;
  inquiry_tweet: string;
  inquiry_details?: InquiryDrafts;
  disclaimer: string;
  metadata: AuditMetadata;
}
```

---

## 4. Canonical JSON Response Example

```json
{
  "product_name": "Crispy Cocoa Cream Filled Biscuits",
  "brand": "Delice Bakery",
  "overall_verdict": "MUSHBOOH",
  "verdict_color": "#F59E0B",
  "verdict_summary": "Product contains Mono- and Diglycerides of Fatty Acids (E471) without plant-origin specification, alongside Whey Powder of unknown rennet origin. No certified Halal logo was detected.",
  "detected_certifications": [],
  "ingredients": [
    {
      "name": "Wheat Flour",
      "raw_text": "wheat flour",
      "status": "HALAL",
      "is_flagged": false,
      "source": "plant",
      "additive_detail": null,
      "reason": "Natural cereal grain product, universally permissible."
    },
    {
      "name": "Mono- and diglycerides of fatty acids",
      "raw_text": "emulsifier (E471)",
      "status": "MUSHBOOH",
      "is_flagged": true,
      "source": "unknown",
      "additive_detail": {
        "code": "E471",
        "name": "Mono- and diglycerides of fatty acids",
        "category": "Emulsifier",
        "status": "MUSHBOOH",
        "source": "unknown",
        "description": "Fats and oils synthesized from glycerol and natural fatty acids.",
        "fiqh_notes": "Permissible if derived 100% from vegetable oils (e.g. palm, soy). Haram if synthesized from non-halal animal fats (swine or non-dhabihah tallow). Packaging does not specify 'vegetable origin'.",
        "reference_authority": "JAKIM Halal Verification Index"
      },
      "reason": "Unspecified fat source (plant vs animal origin not stated)."
    }
  ],
  "flagged_items": [
    {
      "name": "Mono- and diglycerides of fatty acids",
      "raw_text": "emulsifier (E471)",
      "status": "MUSHBOOH",
      "is_flagged": true,
      "source": "unknown",
      "additive_detail": {
        "code": "E471",
        "name": "Mono- and diglycerides of fatty acids",
        "category": "Emulsifier",
        "status": "MUSHBOOH",
        "source": "unknown",
        "description": "Fats and oils synthesized from glycerol and natural fatty acids.",
        "fiqh_notes": "Permissible if derived 100% from vegetable oils. Origin unstated on label.",
        "reference_authority": "JAKIM Halal Verification Index"
      },
      "reason": "Unspecified fat source."
    }
  ],
  "inquiry_email": "Subject: Ingredient Source Clarification — Crispy Cocoa Cream Filled Biscuits\n\nDear Delice Bakery Consumer Care Team,\n\nI am writing to inquire about the dietary compliance of your product: Crispy Cocoa Cream Filled Biscuits.\n\nThe packaging lists 'Emulsifier (E471)'. Could you please confirm whether this additive is derived 100% from plant-based/vegetable sources (such as palm or soybean oil) or from animal fats? Furthermore, is there any risk of cross-contamination with porcine-derived substances or alcohol processing aids in your production facility?\n\nThank you for your transparency.\n\nWarm regards,\nA Concerned Consumer",
  "inquiry_tweet": "@DeliceBakery Hi! Could you clarify if the emulsifier E471 in your Crispy Cocoa Cream Biscuits is 100% plant-derived (vegetarian/halal)? Thank you! #HalalCheck #ConsumerTransparency",
  "inquiry_details": {
    "email": {
      "subject": "Ingredient Source Clarification — Crispy Cocoa Cream Filled Biscuits",
      "body": "Dear Delice Bakery Consumer Care Team,\n\nI am writing to inquire about...",
      "suggested_recipient": "care@delicebakery.com"
    },
    "tweet": "@DeliceBakery Hi! Could you clarify if the emulsifier E471 in your Crispy Cocoa Cream Biscuits is 100% plant-derived? #HalalCheck"
  },
  "disclaimer": "TaqwaLens provides educational compliance analysis and is not a religious decree (fatwa). Verify with accredited scholars.",
  "metadata": {
    "model_used": "groq-llama-3.2-11b-vision-preview",
    "processing_time_ms": 1140,
    "image_width": 1024,
    "image_height": 768,
    "groq_fallback_triggered": false
  }
}
```
