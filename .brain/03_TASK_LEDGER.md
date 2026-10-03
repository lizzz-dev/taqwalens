

# TaqwaLens — Implementation Task Ledger

**Document ID:** `03_TASK_LEDGER.md`  
**Version:** 1.0.0  
**Status:** In Progress — Tracking Active Phases

---

## Phase 1: Backend & Core Compliance Engine

- [x] **1.1 Backend Environment Setup**
  - [x] Initialize Python virtual environment (`venv`) inside `backend/`.
  - [x] Configure `requirements.txt` with: `fastapi`, `uvicorn[standard]`, `groq`, `google-genai`, `pillow`, `pydantic>=2.0`, `python-dotenv`, `python-multipart`, `pytest`, `httpx`.
  - [x] Configure settings loader reading `GROQ_API_KEY` and `GEMINI_API_KEY` from root `.env`.

- [x] **1.2 350+ E-Code Knowledge Base & Fiqh Engine**
  - [x] Curate and build `backend/data/additives_db.py` covering 350+ international food additives (E100–E1520) and critical non-E-code food ingredients (gelatin, carmine, rennet, pepsin, whey, shellac, l-cysteine, etc.).
  - [x] Implement fuzzy normalization and lookup handling international notations (`E-471`, `E 471`, `INS 471`, `471`, and chemical synonyms).

- [x] **1.3 Image Preprocessing & Auto-Compression Pipeline**
  - [x] Implement `preprocess_image` in `backend/services/vision.py` using Pillow:
    - Downsample high-res inputs exceeding $1024 \times 1024$ preserving aspect ratio.
    - Normalize color profiles (RGBA/CMYK $\to$ RGB).
    - Compress to high-efficiency JPEG (target quality 85).
    - Base64 encoding pipeline for Groq & Gemini payloads.

- [x] **1.4 Dual-Engine Vision & Automated Fallback Pipeline**
  - [x] Implement `call_groq_vision`:
    - Model: `llama-3.2-11b-vision-preview`.
    - High-precision prompt tuned for ingredient extraction, E-code detection, and Halal certification badge spotting.
    - Strict schema enforcement via JSON mode.
  - [x] Implement `call_gemini_vision`:
    - Model: `gemini-1.5-flash` with Google GenAI SDK and REST fallback.
    - Identical prompt & structured response contract.
  - [x] Implement `extract_packaging_data`:
    - Primary execution against Groq.
    - Automatic fallback on HTTP 429, timeouts, or exceptions to Gemini 1.5 Flash.
    - Telemetry tracking (`model_used`, `processing_time_ms`, `groq_fallback_triggered`).

- [x] **1.5 Compliance Auditor & Inquiry Generator**
  - [x] Cross-match extracted ingredients against `additives_db.py`.
  - [x] Determine aggregate verdict (`HALAL`, `HARAM`, `MUSHBOOH`, `NEEDS_REVIEW`) and verdict labels/colors.
  - [x] Auto-compose 1-Click Brand Inquiries:
    - Formal customer care email draft targeting ambiguous items.
    - X/Twitter post draft under 280 characters with relevant tags and hashtags.

- [x] **1.6 FastAPI Endpoints & Validation Suite**
  - [x] `POST /api/audit`: Multipart image file upload returning exact `AuditResponse` schema.
  - [x] `GET /api/ecode/{code}`: Quick lookup endpoint for specific additive.
  - [x] `GET /health` & `GET /api/health`: Health status reporting API key configuration & database statistics.
  - [x] Unit & integration test suite (`backend/tests/test_backend.py`) — 8 tests passing.

---

## Phase 2: Next.js 14 Frontend & 3D Scanner UI

- [ ] **2.1 Frontend Project Initialization**
  - [ ] Setup Next.js 14 App Router project in `frontend/`.
  - [ ] Configure Tailwind CSS / custom design tokens with a futuristic Islamic aesthetic (deep emerald `#064E3B`, obsidian `#0F172A`, gold `#F59E0B`, ruby `#EF4444`).
  - [ ] Install 3D & UI libraries: `@react-three/fiber`, `@react-three/drei`, `three`, `lucide-react`, `framer-motion`.

- [ ] **2.2 Client-Side Image Preprocessing**
  - [ ] Implement `lib/compressor.ts`:
    - Automatic canvas-based resize to max 1024px before sending over the wire.
    - Camera snapshot compression reducing network latency by $>70\%$.

- [ ] **2.3 3D Interactive Laser Scanner**
  - [ ] Build `components/scanner/3DScanner.tsx`:
    - Canvas / Three.js 3D viewport featuring a futuristic holographic targeting reticle.
    - Animating vertical laser scan grid with audio-visual micro-interactions.
    - Live webcam stream integration with camera toggle (rear/front).
    - Drag-and-drop image upload zone with instant preview.

- [ ] **2.4 Audit Results Presentation**
  - [ ] Build `components/audit/VerdictCard.tsx`:
    - Dynamic verdict pill with pulsating status glow (`HALAL`, `HARAM`, `MUSHBOOH`).
    - Halal certification badges detected on packaging (JAKIM, MUI, IFANCA, etc.).
    - Prominent Non-Fatwa Educational Disclaimer banner.
  - [ ] Build `components/audit/IngredientAccordion.tsx`:
    - Full ingredient list with color-coded status chips.
    - Expandable cards revealing E-code chemical description, biological source, and Madhhab/Fiqh rationale.

- [ ] **2.5 1-Click Brand Inquiry Drawer**
  - [ ] Build `components/inquiry/InquiryDrawer.tsx`:
    - Slides out when Mushbooh items are detected or user clicks "Inquire with Brand".
    - Tab 1: Formal Email preview with `mailto:` trigger and 1-click clipboard copy.
    - Tab 2: X/Twitter draft with direct Web Intent link (`twitter.com/intent/tweet`).
    - Dynamic brand tagging and product name insertion.

---

## Phase 3: Integration, Performance & Demo Polish

- [ ] **3.1 End-to-End Orchestration**
  - [ ] Validate full loop: Next.js Camera Capture $\to$ Client-side compression $\to$ FastAPI $\to$ Groq Vision $\to$ E-code Engine $\to$ 3D Result Rendering.
  - [ ] Test simulated Groq outage / 429 to prove instantaneous, silent Gemini 1.5 Flash fallback.

- [ ] **3.2 Demo Packaging & Documentation**
  - [ ] Provide sample packaging test images (Halal snack, Haram gelatin gummy, Mushbooh biscuit with E471).
  - [ ] Create simple start scripts (`start_backend.bat`, `start_frontend.bat`).
  - [ ] Comprehensive README with architecture diagrams and API walkthroughs.
