# TaqwaLens — System Architecture Specification

**Document ID:** `01_ARCHITECTURE.md`  
**Version:** 1.0.0  
**Backend Port:** `8000` (FastAPI / Uvicorn)  
**Frontend Port:** `3000` (Next.js 14 App Router)  
**Primary Engine:** Groq Cloud LPU (`llama-3.2-11b-vision-preview`)  
**Fallback Engine:** Google Cloud Gemini (`gemini-1.5-flash`)

---

## 1. High-Level System Overview

TaqwaLens is structured as a decoupled, high-performance monorepo/polyrepo architecture designed for sub-second visual inference, bulletproof resilience, and a cinematic 3D user experience.

```
                              [ User Client Browser ]
                                        │
                         [ Next.js 14 App Router : 3000 ]
                                        │
           ┌────────────────────────────┴───────────────────────────┐
           │ Client-Side Compression (<1024px, WebP/JPEG, quality 85)│
           │ 3D Interactive Laser Scanner (Canvas / Three.js)       │
           │ 1-Click Brand Inquiry Drawer                           │
           └────────────────────────────┬───────────────────────────┘
                                        │ POST /api/audit (multipart/json)
                                        ▼
                         [ FastAPI Backend : 8000 ]
                                        │
                     ┌──────────────────┴──────────────────┐
                     │ Pillow Preprocessing Check          │
                     │ (Validate bounds <= 1024x1024)      │
                     └──────────────────┬──────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
           [ Primary Vision ]                       [ Fallback Vision ]
       Groq Llama 3.2 11B Vision                    Gemini 1.5 Flash
   (Latency ~800ms, Structured JSON)         (Triggered on 429/5xx/Timeout)
                    │                                       │
                    └───────────────────┬───────────────────┘
                                        ▼
                         [ Compliance Auditor Engine ]
                                        │
               ┌────────────────────────┴────────────────────────┐
               │ 350+ E-Code JSON / In-Memory Trie Matcher       │
               │ Certification Pattern Recognizer (JAKIM, etc.)  │
               │ Fiqh Rationale Synthesis & Overall Verdict      │
               │ Brand Inquiry Composer (Email & Tweet)          │
               └────────────────────────┬────────────────────────┘
                                        ▼
                          [ AuditResponse JSON Payload ]
```

---

## 2. Component Specifications

### 2.1 Backend: FastAPI (`http://localhost:8000`)
- **Runtime:** Python 3.10+ with `asyncio` and `uvicorn`.
- **Primary Vision Service (`groq_service.py`):**
  - Groq SDK with model: `llama-3.2-11b-vision-preview`.
  - Structured prompt enforcing strict JSON output conforming to `AuditResponse`.
  - Max token limit, temperature tuned for deterministic compliance audits ($T=0.1$).
- **Fallback Vision Service (`gemini_service.py`):**
  - Google GenAI SDK (`google-genai` / `@google/genai`) or REST fallback.
  - Model: `gemini-1.5-flash`.
  - Automatically invoked if:
    - Groq returns `RateLimitError` (HTTP 429).
    - Groq API timeout expires ($> 6.0\text{s}$).
    - Groq returns internal server error (HTTP 500/503).
- **Knowledge Base Module (`ecode_engine.py`):**
  - Local cached JSON database of 350+ E-codes (`backend/data/ecodes.json`).
  - Regex & phonetic matcher resolving international naming variations (e.g., "E 471", "E-471", "INS 471", "Mono- and diglycerides of fatty acids").
- **Image Preprocessing Module (`image_processor.py`):**
  - Uses PIL/Pillow to verify and clamp dimensions to max $1024 \times 1024$ maintaining aspect ratio.
  - Converts RGBA/CMYK to RGB and encodes to base64.

### 2.2 Frontend: Next.js 14 App Router (`http://localhost:3000`)
- **Framework:** Next.js 14 with TypeScript, Tailwind CSS / Vanilla CSS modules.
- **3D Scanner View (`components/scanner/3DScanner.tsx`):**
  - Immersive Three.js / Canvas 3D viewport representing a holographic lens scanner with laser grid, floating focal ring, and dynamic scanning animations.
  - Real-time video stream support with snapshot grab, plus drag-and-drop file upload.
- **Client-Side Compression (`lib/compressor.ts`):**
  - Canvas-based image resizer downsampling images before network dispatch (max dimension 1024px, JPEG/WebP 85% quality).
- **Interactive Result Breakdown (`components/audit/VerdictCard.tsx`):**
  - Badge with verdict color (`#10B981` Halal, `#EF4444` Haram, `#F59E0B` Mushbooh).
  - Expandable ingredient accordion detailing source origin, Halal certification status, and Madhhab/Fiqh notes.
- **1-Click Brand Inquiry Drawer (`components/inquiry/InquiryDrawer.tsx`):**
  - Sliding side-drawer triggered for products with `MUSHBOOH` status.
  - Pre-populated Email tab (`mailto:` link generator with recipient, subject, body).
  - Pre-populated Social tab (X/Twitter intent URL with hashtags and brand tag).

---

## 3. Resilience & Fallback Matrix

| Condition | Primary Behavior | Fallback Action | Status Code to Client |
| :--- | :--- | :--- | :--- |
| **Normal Operation** | Groq Llama 3.2 Vision completes in ~900ms | Inactive | `200 OK` (Metadata: `model_used="groq-llama-3.2-11b-vision-preview"`) |
| **Groq 429 Rate Limit** | Groq raises `RateLimitError` | Seamlessly dispatches image to Gemini 1.5 Flash | `200 OK` (Metadata: `model_used="gemini-1.5-flash"`) |
| **Groq Timeout (>6s)** | `asyncio.wait_for` triggers TimeoutError | Dispatches to Gemini 1.5 Flash | `200 OK` (Metadata: `model_used="gemini-1.5-flash"`) |
| **Both APIs Fail** | Error caught | Fallback to Local OCR + Direct E-Code Dictionary lookup | `200 OK` (Partial) / `503 Service Unavailable` |

---

## 4. API Endpoints Contract

### `POST /api/audit`
- **Description:** Submit packaging image for instant compliance audit.
- **Content-Type:** `multipart/form-data` or `application/json` (base64 image).
- **Request Parameters:**
  - `file`: UploadFile (Image: JPG, PNG, WEBP)
  - `prefer_fast_engine`: boolean (default `true`)
- **Response:** `AuditResponse` (Pydantic validated JSON)

### `GET /api/ecode/{code}`
- **Description:** Direct dictionary lookup for an E-number (e.g. `E471`, `E120`).
- **Response:** `AdditiveDetail`

### `GET /api/health`
- **Description:** Health check reporting Groq API key status, Gemini key status, and E-code database size.
- **Response:**
  ```json
  {
    "status": "healthy",
    "groq_configured": true,
    "gemini_configured": true,
    "ecodes_indexed": 372
  }
  ```

---

## 5. Directory Structure Blueprint

```
taqwalens/
├── .brain/
│   ├── 00_PRD_CORE.md
│   ├── 01_ARCHITECTURE.md
│   ├── 02_DATA_CONTRACT.md
│   └── 03_TASK_LEDGER.md
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── audit.py
│   │   │   ├── ecodes.py
│   │   │   └── health.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── logger.py
│   │   ├── data/
│   │   │   └── ecodes.json
│   │   ├── models/
│   │   │   └── schemas.py
│   │   ├── services/
│   │   │   ├── groq_service.py
│   │   │   ├── gemini_service.py
│   │   │   ├── ecode_engine.py
│   │   │   └── image_processor.py
│   │   └── main.py
│   ├── requirements.txt
│   └── tests/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── scanner/
│   │   │   ├── 3DScanner.tsx
│   │   │   └── CameraFeed.tsx
│   │   ├── audit/
│   │   │   ├── VerdictCard.tsx
│   │   │   ├── IngredientItem.tsx
│   │   │   └── CertificationBadge.tsx
│   │   └── inquiry/
│   │       └── InquiryDrawer.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── compressor.ts
│   │   └── types.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
├── .env
├── .gitignore
└── README.md
```
