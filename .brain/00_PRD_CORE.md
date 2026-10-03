# TaqwaLens — Product Requirements Document (PRD)

**Document ID:** `00_PRD_CORE.md`  
**Version:** 1.0.0  
**Status:** Approved for Implementation  
**Product:** TaqwaLens (Agentic Food Ingredient & E-Code Compliance Auditor)

---

## 1. Executive Summary & Product Vision

**TaqwaLens** is an intelligent, agentic food compliance auditor designed to empower Muslim consumers and dietary-conscious shoppers with instant, transparent, and authoritative insights into food ingredients, chemical additives, and E-numbers.

By fusing an **ultra-fast primary vision engine (Groq Llama 3.2 11B Vision)** with a **high-reliability fallback (Google Gemini 1.5 Flash)**, TaqwaLens analyzes consumer packaging in sub-second latency. It cross-references extracted ingredients against an exhaustive database of 350+ European and international food additives (E-codes), detects accredited Halal certification marks, and flags doubtful (Mushbooh) or prohibited (Haram) substances with crystal-clear rationale.

When an ingredient origin is ambiguous or doubtful, TaqwaLens activates its **1-Click Brand Inquiry Drawer**, generating pre-composed, legally courteous inquiry emails and tweets directed to the manufacturer to resolve source ambiguity (e.g., animal vs. vegetable fatty acids, microbial vs. porcine enzymes).

---

## 2. Product Scope & Core Capabilities

### 2.1 Visual Inspection & Ingestion
- **Packaging Scanner:** Ingestion of packaging photos (ingredient panels, additive lists, front/back packaging, certification badges).
- **Auto-Compression Pipeline:** Client-side & server-side automatic compression to max $1024 \times 1024$ resolution with quality optimization prior to LLM dispatch. Eliminates unnecessary latency, conserves bandwidth, and prevents rate-limit spikes.
- **Dual-Engine Vision Pipeline:**
  - **Primary:** Groq LPUs running `llama-3.2-11b-vision-preview` for near-instant inference (< 1.2s roundtrip).
  - **Fallback:** Automatic failover to `gemini-1.5-flash` in the event of rate limits (HTTP 429), timeouts, or API degraded states.

### 2.2 Ingredient Parsing & E-Code Engine
- **Extracted Text Normalization:** Intelligent correction of OCR artifacts, multilingual chemical synonyms (e.g., "lecithin", "E322", "soya lecithin"), and obscured font types.
- **350+ E-Code Knowledge Base:** Granular classification across:
  - **Halal (Permissible):** 100% plant, synthetic, mineral, or universally certified origins (e.g., E100 Curcumin, E300 Ascorbic Acid, E322 Soya Lecithin).
  - **Haram (Prohibited):** Porcine-derived, non-dhabihah animal derivatives, or prohibited alcohol aids (e.g., E120 Carmine/Cochineal under strict Hanafi rulings, E441 Gelatine from non-halal animals, E542 Bone phosphate).
  - **Mushbooh (Doubtful / Conditional):** Origin varies depending on raw material source (e.g., E471 Mono- and diglycerides of fatty acids, E422 Glycerol, E472e). Requires verification of vegetable origin vs. animal origin.
- **Accredited Halal Logo Recognition:** Identifies standard Halal certifying bodies on packaging (JAKIM, MUI/BPJPH, IFANCA, HMC, SANHA, Halal Correct, etc.).

### 2.3 Verdict & Transparency Engine
- **Overall Verdict:** 
  - `HALAL` (Green `#10B981`)
  - `HARAM` (Red `#EF4444`)
  - `MUSHBOOH` (Amber `#F59E0B`)
  - `NEEDS_REVIEW` (Slate `#6B7280`)
- **Itemized Breakdown:** Every single ingredient is itemized with status, biological/chemical source, and specific fiqh rationale.

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
   - `Copy to Clipboard`
   - `Open in Default Email Client (mailto:)`
   - `Share on X (Twitter Intent URL)`

---

## 5. User Persona & Success Metrics

| Metric | Target |
| :--- | :--- |
| **End-to-End Processing Time (Groq)** | $< 1,800\text{ ms}$ |
| **Failover Handshake Latency (Gemini)** | $< 2,500\text{ ms}$ |
| **Image Compression Efficiency** | $\ge 70\%$ payload reduction with zero OCR accuracy loss |
| **E-Code Knowledge Base Coverage** | 350+ Additives with full Fiqh metadata |
| **Verdict Accuracy** | $> 99.2\%$ agreement against verified Halal certification indices |

---

## 6. Architecture & System Scope

```
+-------------------------------------------------------------+
|                     Next.js 14 App Router                   |
|  - 3D Interactive Scanner (Three.js / React Three Fiber)    |
|  - Real-Time Camera / Upload & Auto-Compress (1024x1024)    |
|  - Ingredient Breakdown Cards & Fiqh Explanations           |
|  - 1-Click Brand Inquiry Drawer (Email / Tweet)             |
+------------------------------+------------------------------+
                               | REST API (JSON / Multipart)
                               v
+-------------------------------------------------------------+
|                     FastAPI Backend (8000)                  |
|  - Vision Controller: Groq Llama 3.2 11B -> Gemini Flash    |
|  - 350+ E-Code Fiqh Knowledge Base & Regex Normalizer       |
|  - Structured Compliance Auditor & Inquiry Generator        |
+-------------------------------------------------------------+
```
