# TaqwaLens — System Architecture Specification

**Document ID:** `01_ARCHITECTURE.md`  
**Version:** 2.0.0  
**Backend Port:** `8000` (FastAPI / Uvicorn)  
**Frontend Port:** `3000` (Next.js 14 App Router)  
**Primary Vision Engine:** Groq Cloud LPU (`llama-3.2-11b-vision-preview`)  
**Fallback Vision Engine:** Google Cloud Gemini (`gemini-1.5-flash`)  
**Barcode Engine:** `pyzbar` + OpenFoodFacts API  
**3D Engine:** Three.js (WebGL Canvas)

---

## 1. High-Level System Overview

TaqwaLens is structured as a decoupled, high-performance architecture designed for sub-second visual inference, bulletproof resilience, and a cinematic 3D user experience.

```
                              [ User Client Browser ]
                                        │
                         [ Next.js 14 App Router : 3000 ]
                                        │
           ┌────────────────────────────┴───────────────────────────┐
           │ Client-Side Compression (<1024px, WebP/JPEG, quality 85)│
           │ 3D Optical Packaging Model (ProductLens3D)             │
           │ 3D Halal Trust Seal Medallion (Compliance3DShowcase)   │
           │ 1-Click Brand Inquiry Drawer (Email / Tweet)           │
           │ Dedicated Official Certificate Route (/certificate)    │
           └────────────────────────────┬───────────────────────────┘
                                        │ POST /api/audit (multipart/barcode)
                                        ▼
                         [ FastAPI Backend : 8000 ]
                                        │
                     ┌──────────────────┴──────────────────┐
                     │ Security & Payload Guard            │
                     │ (Validate magic bytes, cap <= 10MB) │
                     └──────────────────┬──────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
           [ Image Audit Stream ]                  [ Barcode Stream ]
       Groq Llama 3.2 11B Vision / Gemini            pyzbar + OpenFoodFacts
                    │                                       │
                    └───────────────────┬───────────────────┘
                                        ▼
                         [ Compliance Auditor Engine ]
                                        │
               ┌────────────────────────┴────────────────────────┐
               │ 370+ Indexed E-Code Knowledge Base & Trie       │
               │ Multi-Madhhab Fiqh Evaluator (Standard, Hanafi, │
               │   Shafi'i, Strict / Wara')                      │
               │ Certification Pattern Recognizer (JAKIM, etc.)  │
               │ Brand Inquiry Composer (Email & Tweet)          │
               └────────────────────────┬────────────────────────┘
                                        ▼
                          [ AuditResponse JSON Payload ]
```

---

## 2. Component Specifications

### 2.1 Backend: FastAPI (`http://localhost:8000`)
- **Runtime:** Python 3.10+ with `asyncio` and `uvicorn`.
- **Primary Vision Service (`backend/services/vision.py`):**
  - Groq SDK with model: `llama-3.2-11b-vision-preview`.
  - Structured prompt enforcing strict JSON output conforming to `AuditResponse`.
  - Deterministic compliance extraction ($T=0.1$).
- **Fallback Vision Service (`backend/services/vision.py`):**
  - Google GenAI SDK (`gemini-1.5-flash`).
  - Automatically invoked if Groq returns HTTP 429 rate limit, timeouts, or API degraded states.
- **Barcode Resolver Service (`backend/services/barcode.py`):**
  - Fast 1D optical decoding via `pyzbar`.
  - Automated fallback querying the OpenFoodFacts international food registry.
- **Multi-Madhhab Juristic Engine (`backend/services/engine.py`):**
  - Local database indexing 370+ E-numbers and non-E-code animal/plant derivatives.
  - Granular Sunni legal opinions:
    - **Standard:** Consensus international Halal standards (JAKIM, IFANCA).
    - **Hanafi:** Stricter evaluations regarding non-plant rennet and insect-derived colorants (E120 Carmine).
    - **Shafi'i:** Animal slaughter and bovine gelatin verification.
    - **Strict (Wara'):** Flags ambiguous chemical processing aids.
- **Defensive Middleware:**
  - 10MB payload ceiling validation (`HTTP 413`).
  - Magic byte and PIL image verification rejecting non-food images (`HTTP 422`).

### 2.2 Frontend: Next.js 14 App Router (`http://localhost:3000`)
- **Framework:** Next.js 14 with TypeScript, Tailwind CSS, and Framer Motion.
- **3D Packaging Model (`ProductLens3D.tsx`):**
  - Artisan grocery carton with authentic gable roof fold, satin botanical emerald finish, brass magnifying glass, laser sweep beam, and real-time cursor parallax.
- **3D Halal Trust Seal (`Compliance3DShowcase.tsx`):**
  - 8-pointed Rub el Hizb gold & emerald medallion with 100% upright Arabic calligraphy (`حلال`), gentle pendulum oscillation, and automatic spring-back physics.
- **Official Compliance Certificate (`/certificate`):**
  - Dedicated printable dossier page with legal diploma border, live animated gold seal, unique certificate ID (`TL-XXXXX-2026`), and native print-to-PDF support.
- **Interactive Enterprise Suite:**
  - `AskSheikhAI`: Contextual juristic Q&A chat assistant.
  - `DemoPresetsTray`: 1-Click Instant Demo Presets (Gummy Bears, Oat Milk, Energy Bar, Protein Shake, Non-food Scene).
  - `HistoryDrawer`: Persistent scan history with localStorage sync.
  - `ProductComparisonModal`: Side-by-side comparative nutritional and Halal compliance audit.
  - `QuickSearchModal` (`⌘K`): Instant additive search indexing 370+ E-numbers.

---

## 3. Automated Test Suite & Quality Verification

- **Pytest Suite (`backend/tests/test_backend.py`):**
  - 18 passing automated tests (`100%` pass rate in 1.87s).
  - Covers payload limit enforcement, non-food image rejection, empty ingredient list validation, E-code lookup, and Fiqh evaluation under all Madhhab profiles.
- **Next.js Production Build:**
  - Zero-error static build (`next build`) generating all static and dynamic routes.
- **WebGL Stability:**
  - Explicit GPU context release via `renderer.forceContextLoss()`.
  - Replaced deprecated `THREE.Clock` with standard `performance.now()`.
