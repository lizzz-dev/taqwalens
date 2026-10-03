# TaqwaLens — Implementation Task Ledger

**Document ID:** `03_TASK_LEDGER.md`  
**Version:** 1.0.0  
**Status:** In Progress — Tracking Active Phases

---

## Phase 1: Backend & Core Compliance Engine

- [ ] **1.1 Backend Environment Setup**
  - [ ] Initialize Python virtual environment (`venv`) inside `backend/`.
  - [ ] Configure `requirements.txt` with: `fastapi`, `uvicorn[standard]`, `groq`, `google-genai`, `pillow`, `pydantic>=2.0`, `python-dotenv`, `python-multipart`, `pytest`, `httpx`.
  - [ ] Configure settings loader reading `GROQ_API_KEY` and `GEMINI_API_KEY` from root `.env`.

- [ ] **1.2 350+ E-Code Knowledge Base & Fiqh Engine**
  - [ ] Curate and build `backend/app/data/ecodes.json` covering 350+ international food additives:
    - E100–E199: Food Colors (e.g. E100 Curcumin, E120 Carmine, E150 Caramel).
    - E200–E299: Preservatives (e.g. E211 Sodium Benzoate, E250 Sodium Nitrite).
    - E300–E399: Antioxidants & Acidity Regulators (e.g. E300 Ascorbic Acid, E322 Lecithin).
    - E400–E499: Thickeners, Stabilizers & Emulsifiers (e.g. E412 Guar Gum, E441 Gelatine, E471 Mono/diglycerides).
    - E500–E599: Anti-caking agents & Acidity regulators (e.g. E542 Bone Phosphate).
    - E600–E699: Flavor enhancers (e.g. E621 MSG, E631 Disodium Inosinate).
    - E900–E999: Glazing agents & Sweeteners (e.g. E901 Beeswax, E904 Shellac, E920 L-Cysteine).
  - [ ] Implement `ecode_engine.py`: fast Trie / regex lookup handling international notations (`E471`, `E-471`, `INS 471`, `471`).

- [ ] **1.3 Image Preprocessing & Auto-Compression Pipeline**
  - [ ] Implement `image_processor.py` using Pillow:
    - Downsample high-res inputs exceeding $1024 \times 1024$ preserving aspect ratio.
    - Normalize color profiles (RGBA/CMYK $\to$ RGB).
    - Compress to high-efficiency WebP/JPEG (target quality 85).
    - Base64 encoding pipeline for Groq & Gemini payloads.

- [ ] **1.4 Dual-Engine Vision & Automated Fallback Pipeline**
  - [ ] Implement `groq_service.py`:
    - Model: `llama-3.2-11b-vision-preview`.
    - High-precision prompt tuned for ingredient extraction, E-code detection, and Halal certification badge spotting.
    - Strict schema enforcement via JSON mode.
  - [ ] Implement `gemini_service.py`:
    - Model: `gemini-1.5-flash`.
    - Identical prompt & structured response contract.
  - [ ] Implement `vision_controller.py`:
    - Primary execution against Groq.
    - Automatic circuit breaker / fallback on HTTP 429, timeouts (>6s), or 5xx errors to Gemini 1.5 Flash.
    - Telemetry tracking (`model_used`, `processing_time_ms`, `groq_fallback_triggered`).

- [ ] **1.5 Compliance Auditor & Inquiry Generator**
  - [ ] Cross-match extracted ingredients against `ecodes.json`.
  - [ ] Determine aggregate verdict (`HALAL`, `HARAM`, `MUSHBOOH`, `NEEDS_REVIEW`).
  - [ ] Auto-compose 1-Click Brand Inquiries:
    - Formal customer care email draft targeting ambiguous items.
    - X/Twitter post draft under 280 characters with relevant tags and hashtags.

- [ ] **1.6 FastAPI Endpoints & Validation Suite**
  - [ ] `POST /api/audit`: Multipart file upload and JSON base64 support.
  - [ ] `GET /api/ecode/{code}`: Quick lookup endpoint for specific additive.
  - [ ] `GET /api/health`: Health status reporting API key configuration & database statistics.
  - [ ] Unit & integration test suite verifying failover, parsing, and data contracts.

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
