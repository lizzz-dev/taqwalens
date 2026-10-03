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
  - Badge with refined verdict color:
    * `HALAL`: Refined Emerald (`#059669`)
    * `MUSHBOOH`: Warm Honey Amber (`#D97706`)
    * `HARAM`: Muted Crimson (`#DC2626`)
    * `NEEDS_REVIEW`: Deep Slate (`#64748B`)
  - Expandable ingredient accordion detailing source origin, Halal certification status, and Madhhab/Fiqh notes.
- **1-Click Brand Inquiry Drawer (`components/inquiry/InquiryDrawer.tsx`):**
  - Sliding side-drawer triggered for products with `MUSHBOOH` status.
  - Pre-populated Email tab (`mailto:` link generator with recipient, subject, body).
  - Pre-populated Social tab (X/Twitter intent URL with hashtags and brand tag).

---

## 3. Enterprise Design System Directives (Anti-Cliché Standards)

- **Aesthetic Benchmark:** Clean, institutional, modern fintech/healthtech (inspired by Linear and Stripe).
- **Anti-Cliché Policy:** STRICTLY NO purple/violet gradients, neon blur spheres, floating cartoon icons, or generic "AI glow" templates.
- **Surface & Hierarchy:** Deep neutral slate palette (`slate-950` `#020617`, `slate-900` `#0F172A`), high-contrast crisp text (`slate-50` / `slate-200`), hairline precision borders (`slate-800` `#1E293B`).
- **3D & Animation Standards:** Subtle, purposeful micro-interactions (perspective hover tilt, precision border sheen, laser scanning grid), never noisy or distracting.

---

## 4. Backend Security & Defensive Architecture

- **File Upload Integrity & Magic Bytes:**
  - Validates incoming image streams using Pillow header parsing and byte inspection.
  - Allowed image formats: `JPEG`, `PNG`, `WEBP`. Rejects disguised binaries, shell scripts, or polyglots with `400 Bad Request`.
- **Payload Size Enforcement:**
  - Maximum upload ceiling: `10MB` (`10,485,760` bytes).
  - Requests exceeding 10MB are immediately rejected with `413 Payload Too Large` to prevent memory exhaustion / DoS attacks.
- **Error Masking & Information Sanitization:**
  - Zero traceback or internal stack trace leakage in API responses.
  - All errors return structured JSON envelopes: `{"error": "...", "detail": "...", "status_code": ...}`.
- **API Key Shielding:**
  - Groq and Gemini API keys are strictly confined to server-side memory (`os.getenv`), never surfaced to the browser or embedded in client bundles.
- **CORS & Defensive Headers Middleware:**
  - Strict CORS origin whitelisting: `http://localhost:3000` and `http://127.0.0.1:3000` (wildcards prohibited).
  - Mandatory HTTP response headers on every route:
    * `X-Content-Type-Options: nosniff`
    * `X-Frame-Options: DENY`
    * `X-XSS-Protection: 1; mode=block`
    * `Referrer-Policy: strict-origin-when-cross-origin`

---

## 5. Resilience & Fallback Matrix

| Condition | Primary Behavior | Fallback Action | Status Code to Client |
| :--- | :--- | :--- | :--- |
| **Normal Operation** | Groq Llama 3.2 Vision completes in ~900ms | Inactive | `200 OK` (Metadata: `model_used="groq-llama-3.2-11b-vision-preview"`) |
| **Payload > 10MB** | Rejected at gateway/middleware | None | `413 Payload Too Large` |
| **Corrupted/Fake Image** | Rejected by byte validator | None | `400 Bad Request` |
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
