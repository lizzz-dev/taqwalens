# TaqwaLens — Product Requirements Document (PRD)

**Document ID:** `00_PRD_CORE.md`  
**Version:** 2.0.0  
**Status:** Complete & Production-Grade MVP Ready  
**Product:** TaqwaLens (Autonomous Halal Ingredient & E-Code Compliance Auditor)

---

## 1. Executive Summary & Product Vision

**TaqwaLens** is an intelligent, agentic food compliance auditor designed to empower Muslim consumers and dietary-conscious shoppers with instant, transparent, and authoritative insights into food ingredients, chemical additives, and E-numbers.

By fusing an **ultra-fast primary vision engine (Groq Llama 3.2 11B Vision)** with a **high-reliability fallback (Google Gemini 1.5 Flash)** and **retail barcode resolution (Pyzbar + OpenFoodFacts)**, TaqwaLens analyzes consumer packaging in sub-second latency. It cross-references extracted ingredients against an exhaustive database of **370+ indexed additives (E-codes)**, detects accredited Halal certification marks, and provides nuanced juristic assessments aligned with classical Sunni legal schools (Hanafi, Shafi'i, Maliki, and Strict/Wara').

When an ingredient origin is ambiguous or doubtful, TaqwaLens activates its **1-Click Brand Inquiry Drawer**, generating pre-composed, legally courteous inquiry emails and tweets directed to the manufacturer to resolve source ambiguity (e.g., animal vs. vegetable fatty acids, microbial vs. porcine enzymes).

---

## 2. Product Scope & Core Capabilities

### 2.1 Dual-Modal Visual Inspection & Barcode Ingestion
- **Packaging Scanner:** Optical ingestion of packaging photos (ingredient panels, additive lists, front/back packaging, certification badges).
- **In-Store Live Camera:** Real-time webcam/rear smartphone camera feed via WebRTC `getUserMedia` with `facingMode: "environment"`.
- **Retail Barcode (UPC/EAN) Scanning:** Fast 1D barcode decoding using `pyzbar` with automated fallback to OpenFoodFacts international API for direct product metadata and ingredient declarations.
- **Auto-Compression Pipeline:** Canvas-based client-side & server-side automatic compression to max $1024 \times 1024$ resolution with quality optimization prior to LLM dispatch. Conserves bandwidth and eliminates rate-limit spikes.
- **Dual-Engine Vision Pipeline:**
  - **Primary:** Groq LPUs running `llama-3.2-11b-vision-preview` for near-instant inference (< 1.2s roundtrip).
  - **Fallback:** Automatic failover to `gemini-1.5-flash` in the event of rate limits (HTTP 429), timeouts, or API degraded states.

### 2.2 Ingredient Parsing & 370+ E-Code Engine
- **Extracted Text Normalization:** Intelligent correction of OCR artifacts, multilingual chemical synonyms (e.g., "lecithin", "E322", "soya lecithin"), and obscured font types.
- **370+ E-Code Knowledge Base:** Granular classification across:
  - **Halal (Permissible):** 100% plant, synthetic, mineral, or universally certified origins (e.g., E100 Curcumin, E300 Ascorbic Acid, E322 Soya Lecithin).
  - **Haram (Prohibited):** Porcine-derived, non-dhabihah animal derivatives, or prohibited alcohol aids (e.g., E120 Carmine/Cochineal under strict Hanafi rulings, E441 Gelatine from non-halal animals, E542 Bone phosphate).
  - **Mushbooh (Doubtful / Conditional):** Origin varies depending on raw material source (e.g., E471 Mono- and diglycerides of fatty acids, E422 Glycerol, E472e). Requires verification of vegetable origin vs. animal origin.
- **Accredited Halal Logo Recognition:** Identifies standard Halal certifying bodies on packaging (JAKIM, MUI/BPJPH, IFANCA, HMC, SANHA, Halal Correct, etc.).

### 2.3 Nuanced Multi-Madhhab Juristic Engine
- **Customizable Fiqh Profiles:** Evaluates ingredient rulings under specific Sunni jurisprudence:
  - **Standard (Global Consensus):** Aligned with international Halal certification bodies (JAKIM MS 1500, IFANCA).
  - **Hanafi School:** Stricter standards regarding non-plant rennet and insect-derived colorants (e.g. E120 Carmine).
  - **Shafi'i School:** Rigorous animal slaughter and bovine gelatin origin verification.
  - **Strict (Wara' / Scrupulousness):** Flags all ambiguous, synthetic, or chemical processing aids requiring absolute certainty.

### 2.4 Spatial 3D Interactive UI & Ambient Aesthetics
- **3D Packaging Model (`ProductLens3D.tsx`):**
  - Artisan botanical grocery carton with authentic gable roof fold and satin emerald finish.
  - Real-time optical brass magnifying glass with physical transmission shader.
  - Laser sweep scanline traversing ingredient declaration panel.
  - High-resolution 1024x1024 canvas label texture with Halal calligraphy and realistic barcode.
- **3D Halal Trust Seal (`Compliance3DShowcase.tsx`):**
  - 8-pointed Rub el Hizb gold & emerald medallion.
  - Strictly upright, 100% horizontal Arabic calligraphy (`حلال`) and brand typography.
  - Gentle pendulum oscillation (`±18°`) with automatic spring-back to center.
  - Zero roll (`rotation.z = 0`) preventing tilt or inversions.
  - Dual independent gyroscopic orbital rings and floating golden sparkle particles.
- **3D Welcome Gateway (`AuthCard3D.tsx`):** Interactive dual-sided flipping credential badge with gold-foil shader.
- **WebGL Stability & Lifecycle:** Explicit GPU context eviction prevention via `renderer.forceContextLoss()`.

### 2.5 Institutional Compliance Certificate Dossier (`/certificate`)
- **Diploma Layout:** Framed legal certificate with double-border parchment texture (`#FCFBF8`).
- **Live Animated Holographic Seal:** Real-time radial light sweep reflecting across gold scalloped edges.
- **Unique Dossier ID:** Dynamic ID generation (`TL-XXXXX-2026`) and date stamping.
- **Native Print-to-PDF Engine:** Native print stylesheet supporting iOS Share Sheet and Android Print Spooler.

### 2.6 Interactive Enterprise Tooling
- **1-Click Instant Demo Presets Tray:** 5 realistic packaged test cases (Gummy Bears, Oat Milk, Energy Bar, Protein Shake, and Invalid Non-Food Scene).
- **Ask Sheikh AI:** Contextual juristic assistant explaining additive chemistry and legal opinions.
- **Persistent Scan History:** Slide-over `HistoryDrawer` with localStorage persistence and instant scan replay.
- **Side-by-Side Product Comparison:** `ProductComparisonModal` auditing multiple products simultaneously.
- **Instant E-Code Quick Search (`⌘K`):** Search bar indexing all 370+ E-numbers with real-time filtering.

---

## 3. Mandatory Non-Fatwa Educational Disclaimer

> [!IMPORTANT]
> ### ⚖️ Educational & Informational Non-Fatwa Notice
> **TaqwaLens is an automated technological tool and educational compliance assistant, NOT an Islamic religious authority, Mufti, or Fatwa-issuing body.**
> 
> - The rulings and classifications provided by TaqwaLens are compiled from published consumer guides, food chemistry disclosures, and standard rulings by established Halal certification authorities (e.g., JAKIM, IFANCA, SANHA, BPJPH).
> - Classifications may vary depending on the school of thought (*Madhhab*), local jurisdiction, or specific manufacturing facility practices.
> - TaqwaLens does not issue binding legal decrees (*Fatawa*). Users are strongly advised to seek guidance from certified Islamic scholars and accredited Halal certifying institutions for definitive personal guidance.

---

## 4. 1-Click Brand Inquiry Drawer (Mushbooh Resolution)

Whenever a product or ingredient is classified as **Mushbooh** (Doubtful) due to source ambiguity (such as unstated source for emulsifiers E471, glycerol E422, or unspecified enzymes/rennet), the UI triggers an interactive **1-Click Brand Inquiry Drawer**.

### 4.1 Feature Mechanics
1. **Ambiguity Detection:** Backend flags specific ingredients that lack origin disclosure on packaging (e.g., "Mono- and diglycerides (E471) — Source not specified on label").
2. **Dynamic Template Generation:** The LLM generates tailored, polite, and technically precise drafts for the specific manufacturer:
   - **Formal Email:** Complete with subject line, product name, barcode/batch prompt, specific E-code inquiry, and formal inquiry regarding animal vs. vegetable derivation, alcohol solvent residues, and shared facility cross-contact.
   - **Public Social Media Post (X/Twitter):** Concise, character-counted inquiry tagging the manufacturer requesting clarification on specific ingredients for dietary compliance.
3. **Action Triggers:**
   - `Copy to Clipboard` (with resilient fallback for universal browser support)
   - `Open in Default Email Client (mailto:)`
   - `Share on X (Twitter Intent URL)`

---

## 5. Defensive Security & Production-Grade Standards

### 5.1 Upload & File Integrity Validation
- **Magic Bytes & Header Inspection:** Every uploaded file is inspected using Pillow and magic byte verification to ensure it is a genuine, uncorrupted image stream (`JPEG`, `PNG`, `WEBP`). Disguised executables or polyglot files are strictly rejected before processing.
- **Payload Size Limits:** Strictly enforce a 10MB maximum request ceiling (`10 * 1024 * 1024` bytes). Any file or payload exceeding 10MB is rejected with `HTTP 413 Payload Too Large`.

### 5.2 Error Masking & Confidentiality
- **No Traceback Leakage:** Internal Python exceptions, stack traces, and library logs are never exposed to the client. All error paths return sanitized JSON envelopes (`{"error": "...", "code": ...}`).
- **API Key Shielding:** All Groq and Gemini API keys remain strictly server-side.

### 5.3 Network & Browser Security Headers
- **Strict CORS Policy:** Restricted strictly to authorized origins (`http://localhost:3000`, `http://127.0.0.1:3000`).
- **Defensive Headers:** Injects `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Referrer-Policy: strict-origin-when-cross-origin`.

---

## 6. Architecture & System Scope

```
+-------------------------------------------------------------+
|                     Next.js 14 App Router                   |
|  - 3D Packaging Model (ProductLens3D)                       |
|  - 3D Halal Trust Seal (Compliance3DShowcase)               |
|  - Dual-Modal Scanner (Camera Viewfinder + Barcode + Upload)|
|  - Multi-Madhhab Selector (Standard, Hanafi, Shafi'i, Strict)|
|  - Full-Width Compliance Dossier & Ask Sheikh AI            |
|  - Official Printable Certificate (/certificate)            |
|  - 1-Click Brand Inquiry Drawer (Email / Tweet)             |
+------------------------------+------------------------------+
                               | REST API (Strict CORS, Max 10MB)
                               v
+-------------------------------------------------------------+
|                     FastAPI Backend (8000)                  |
|  - Security Middleware: Magic bytes, 10MB cap, nosniff      |
|  - Multimodal Vision: Groq Llama 3.2 11B -> Gemini Flash    |
|  - Barcode Service: pyzbar + OpenFoodFacts API              |
|  - 370+ E-Code Fiqh Knowledge Base & Regex Normalizer       |
|  - Structured Compliance Auditor & Inquiry Generator        |
|  - Automated Test Suite: 18 passing pytest test cases       |
+-------------------------------------------------------------+
```
