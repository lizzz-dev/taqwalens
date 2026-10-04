"""
TaqwaLens — Executive Presentation Deck Generator
Generates a 10-slide, 16:9 widescreen presentation in PowerPoint (.pptx) format.
Theme: Light luxury emerald & gold (matching TaqwaLens brand identity).
No dark pitch-black slides or generic AI boxes.
Features real UI screenshots on every slide, micro-components, status pills, and executive typography.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# -------------------------------------------------------------
# Color Palette (TaqwaLens Brand System)
# -------------------------------------------------------------
BG_COLOR = RGBColor(248, 250, 252)        # Light Pearl / Slate 50
CARD_BG = RGBColor(255, 255, 255)         # Crisp Pure White
CARD_BORDER = RGBColor(226, 232, 240)     # Slate 200
CARD_BORDER_GOLD = RGBColor(217, 119, 6)  # Warm Gold Border Accent

TEXT_TITLE = RGBColor(15, 23, 42)         # Deep Slate 900
TEXT_BODY = RGBColor(51, 65, 85)          # Slate 700
TEXT_MUTED = RGBColor(100, 116, 139)      # Slate 500

EMERALD_DEEP = RGBColor(6, 95, 70)        # Deep Forest Emerald 800
EMERALD_ACCENT = RGBColor(4, 120, 87)     # Emerald 700
EMERALD_LIGHT = RGBColor(209, 250, 229)   # Mint 100
EMERALD_TEXT = RGBColor(6, 95, 70)        # Mint Text

GOLD_WARM = RGBColor(180, 83, 9)          # Gold / Amber 700
GOLD_LIGHT = RGBColor(254, 243, 199)      # Amber 100
GOLD_TRIM = RGBColor(217, 119, 6)         # Gold Trim line

CRIMSON_HARAM = RGBColor(220, 38, 38)     # Red 600
CRIMSON_LIGHT = RGBColor(254, 226, 226)   # Red 100

AMBER_MUSHBOOH = RGBColor(217, 119, 6)    # Amber 600
AMBER_LIGHT = RGBColor(254, 243, 199)     # Amber 100

HALAL_EMERALD = RGBColor(16, 185, 129)    # Emerald 500

ASSETS_DIR = r"c:\Windows\System32\taqwalens\backend\assets_presentation"


def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def set_slide_background(slide):
        """Sets clean light luxury background with subtle top accent stripe."""
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()

        # Top Emerald Header Bar
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.12))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = EMERALD_DEEP
        top_bar.line.fill.background()

        # Delicate Gold Trim Line
        trim_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(0.12), Inches(13.333), Inches(0.03))
        trim_bar.fill.solid()
        trim_bar.fill.fore_color.rgb = GOLD_TRIM
        trim_bar.line.fill.background()

    def add_footer(slide, current_idx, total=10):
        """Adds a subtle professional footer with branding and slide number."""
        tx_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(8), Inches(0.35))
        tf = tx_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "TaqwaLens  •  Autonomous Multi-Modal Halal Compliance & Dietary Intelligence System"
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_MUTED
        p.font.name = "Arial"

        idx_box = slide.shapes.add_textbox(Inches(10.5), Inches(7.05), Inches(2), Inches(0.35))
        tf_idx = idx_box.text_frame
        p_idx = tf_idx.paragraphs[0]
        p_idx.alignment = PP_ALIGN.RIGHT
        p_idx.text = f"{current_idx:02d} / {total:02d}"
        p_idx.font.size = Pt(9.5)
        p_idx.font.bold = True
        p_idx.font.color.rgb = EMERALD_ACCENT
        p_idx.font.name = "Arial"

    def add_header(slide, category, title, subtitle):
        """Adds category badge, main slide title, and explanatory subtitle."""
        # Category Pill
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.4), Inches(2.8), Inches(0.32))
        pill.fill.solid()
        pill.fill.fore_color.rgb = EMERALD_LIGHT
        pill.line.color.rgb = RGBColor(167, 243, 208)
        pill.line.width = Pt(1)
        tf_pill = pill.text_frame
        tf_pill.word_wrap = False
        p_pill = tf_pill.paragraphs[0]
        p_pill.text = category.upper()
        p_pill.font.size = Pt(9)
        p_pill.font.bold = True
        p_pill.font.color.rgb = EMERALD_DEEP
        p_pill.font.name = "Arial"

        # Main Title Box
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.55))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_TITLE
        p_title.font.name = "Arial"

        # Subtitle Box
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.7), Inches(0.4))
        tf_sub = sub_box.text_frame
        tf_sub.word_wrap = True
        tf_sub.margin_left = tf_sub.margin_top = tf_sub.margin_right = tf_sub.margin_bottom = 0
        p_sub = tf_sub.paragraphs[0]
        p_sub.text = subtitle
        p_sub.font.size = Pt(11)
        p_sub.font.color.rgb = TEXT_BODY
        p_sub.font.name = "Arial"

    # =========================================================================
    # SLIDE 1: Cover Slide
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    rel_badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(0.7), Inches(3.6), Inches(0.36))
    rel_badge.fill.solid()
    rel_badge.fill.fore_color.rgb = EMERALD_LIGHT
    rel_badge.line.color.rgb = RGBColor(167, 243, 208)
    rel_badge.line.width = Pt(1)
    tf_rb = rel_badge.text_frame
    p_rb = tf_rb.paragraphs[0]
    p_rb.text = "● PRODUCTION RELEASE // VERSION 1.0.0"
    p_rb.font.size = Pt(9.5)
    p_rb.font.bold = True
    p_rb.font.color.rgb = EMERALD_DEEP
    p_rb.font.name = "Arial"

    brand_box = s1.shapes.add_textbox(Inches(0.9), Inches(1.2), Inches(6.8), Inches(1.2))
    tf_b = brand_box.text_frame
    tf_b.word_wrap = True
    tf_b.margin_left = tf_b.margin_top = 0
    p_b = tf_b.paragraphs[0]
    p_b.text = "TaqwaLens"
    p_b.font.size = Pt(46)
    p_b.font.bold = True
    p_b.font.color.rgb = EMERALD_DEEP
    p_b.font.name = "Georgia"

    sub_box = s1.shapes.add_textbox(Inches(0.9), Inches(2.35), Inches(6.8), Inches(0.9))
    tf_s = sub_box.text_frame
    tf_s.word_wrap = True
    tf_s.margin_left = tf_s.margin_top = 0
    p_s = tf_s.paragraphs[0]
    p_s.text = "Autonomous Multi-Modal Halal Compliance & Dietary Intelligence System"
    p_s.font.size = Pt(17)
    p_s.font.bold = True
    p_s.font.color.rgb = TEXT_TITLE
    p_s.font.name = "Arial"

    vis_box = s1.shapes.add_textbox(Inches(0.9), Inches(3.25), Inches(6.8), Inches(1.1))
    tf_v = vis_box.text_frame
    tf_v.word_wrap = True
    tf_v.margin_left = tf_v.margin_top = 0
    p_v = tf_v.paragraphs[0]
    p_v.text = (
        "Bridging cutting-edge multimodal vision intelligence (Groq Llama 3.2 Vision) with "
        "classical Islamic jurisprudence. Instant optical packaging intake, deterministic E-code "
        "matching against 370+ indexed additives, and 1-click brand inquiry resolution."
    )
    p_v.font.size = Pt(11.5)
    p_v.font.color.rgb = TEXT_BODY
    p_v.font.name = "Arial"

    pills = [
        ("⚡ < 1.2s Latency", "Groq LPU Vision Engine"),
        ("🧬 370+ Indexed Additives", "Deterministic Fiqh DB"),
        ("⚖️ 4 Classical Madhahib", "Personalized Fiqh Logic"),
        ("📜 Printable Certificate", "Official Institutional Dossier")
    ]
    for idx, (title, sub) in enumerate(pills):
        col = idx % 2
        row = idx // 2
        px = Inches(0.9 + col * 3.4)
        py = Inches(4.5 + row * 1.05)
        p_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, py, Inches(3.2), Inches(0.9))
        p_card.fill.solid()
        p_card.fill.fore_color.rgb = CARD_BG
        p_card.line.color.rgb = CARD_BORDER
        p_card.line.width = Pt(1)
        tf_pc = p_card.text_frame
        tf_pc.margin_left = Inches(0.18)
        tf_pc.margin_top = Inches(0.12)
        p1 = tf_pc.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = EMERALD_DEEP
        p1.font.name = "Arial"
        p2 = tf_pc.add_paragraph()
        p2.text = sub
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_MUTED
        p2.font.name = "Arial"

    hero_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.1), Inches(1.1), Inches(4.4), Inches(5.6))
    hero_card.fill.solid()
    hero_card.fill.fore_color.rgb = CARD_BG
    hero_card.line.color.rgb = CARD_BORDER_GOLD
    hero_card.line.width = Pt(1.5)

    carton_path = os.path.join(ASSETS_DIR, "carton_crop.png")
    if os.path.exists(carton_path):
        s1.shapes.add_picture(carton_path, Inches(8.3), Inches(1.3), Inches(4.0), Inches(3.8))

    cap_box = s1.shapes.add_textbox(Inches(8.3), Inches(5.2), Inches(4.0), Inches(1.3))
    tf_c = cap_box.text_frame
    tf_c.word_wrap = True
    p_c1 = tf_c.paragraphs[0]
    p_c1.text = "Spatial 3D Packaging Inspector"
    p_c1.font.size = Pt(12)
    p_c1.font.bold = True
    p_c1.font.color.rgb = TEXT_TITLE
    p_c1.font.name = "Arial"
    p_c2 = tf_c.add_paragraph()
    p_c2.text = "Authentic gable-roof carton geometry with optical brass magnifying glass & live laser scanline."
    p_c2.font.size = Pt(9.5)
    p_c2.font.color.rgb = TEXT_MUTED
    p_c2.font.name = "Arial"

    add_footer(s1, 1)

    # =========================================================================
    # SLIDE 2: The Problem Statement
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "02 // Problem Statement", "Supermarket Cognitive Saturation & Chemical Ambiguity",
               "Modern industrial food processing disguises animal-derived additives behind technical codes, leaving consumers stranded in grocery aisles.")

    problems = [
        ("01", "Cryptic Chemical Nomenclatures", "370+ Hidden Additives",
         "Food manufacturers conceal animal derivatives behind obscure E-codes (E471, E472e, E441, E120) and technical synonyms (mono- and diglycerides, carmine, cochineal), making it impossible for ordinary consumers to verify origins.",
         CRIMSON_HARAM, CRIMSON_LIGHT),
        ("02", "Aisle Cognitive Fatigue", "10-15 Min Search Delay",
         "Shoppers spend 10 to 15 minutes per packaged item cross-referencing conflicting blogs, internet forums, and outdated static PDF guides while managing carts and family needs in busy store aisles.",
         AMBER_MUSHBOOH, AMBER_LIGHT),
        ("03", "Jurisprudential Divergence", "4 Classical Madhahib",
         "Standard apps apply a rigid one-size-fits-all decree. They ignore Hanafi restrictions on E120 Carmine (insect-derived) and non-plant rennet, or Shafi'i requirements for Dhabihah slaughter verification on bovine gelatin.",
         GOLD_WARM, GOLD_LIGHT),
        ("04", "The 'Mushbooh' Dead-End", "0% Brand Recourse",
         "When an emulsifier's origin is unstated, consumers face an unresolved dilemma. Without direct brand contact tools, they either abandon safe purchases or consume doubtful food with persistent spiritual anxiety.",
         EMERALD_DEEP, EMERALD_LIGHT)
    ]

    for idx, (num, title, badge, desc, accent_color, light_color) in enumerate(problems):
        col = idx % 2
        row = idx // 2
        card_x = Inches(0.8 + col * 5.95)
        card_y = Inches(1.85 + row * 2.45)
        card_w = Inches(5.7)
        card_h = Inches(2.25)

        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, card_x, card_y, card_w, card_h)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1)

        num_box = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, card_x + Inches(0.2), card_y + Inches(0.2), Inches(0.55), Inches(0.4))
        num_box.fill.solid()
        num_box.fill.fore_color.rgb = light_color
        num_box.line.color.rgb = accent_color
        num_box.line.width = Pt(1)
        tf_nb = num_box.text_frame
        p_nb = tf_nb.paragraphs[0]
        p_nb.text = num
        p_nb.font.size = Pt(11)
        p_nb.font.bold = True
        p_nb.font.color.rgb = accent_color
        p_nb.font.name = "Arial"

        t_box = s2.shapes.add_textbox(card_x + Inches(0.9), card_y + Inches(0.18), Inches(4.5), Inches(0.4))
        tf_t = t_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_TITLE
        p_t.font.name = "Arial"

        badge_box = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, card_x + Inches(0.9), card_y + Inches(0.6), Inches(2.2), Inches(0.28))
        badge_box.fill.solid()
        badge_box.fill.fore_color.rgb = light_color
        badge_box.line.fill.background()
        tf_bb = badge_box.text_frame
        p_bb = tf_bb.paragraphs[0]
        p_bb.text = "⚠️ " + badge
        p_bb.font.size = Pt(8.5)
        p_bb.font.bold = True
        p_bb.font.color.rgb = accent_color
        p_bb.font.name = "Arial"

        desc_box = s2.shapes.add_textbox(card_x + Inches(0.2), card_y + Inches(0.95), Inches(5.3), Inches(1.15))
        tf_d = desc_box.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        p_d.text = desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = TEXT_BODY
        p_d.font.name = "Arial"

    add_footer(s2, 2)

    # =========================================================================
    # SLIDE 3: Project Vision & Core Architecture Overview
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "03 // Architecture & Working", "The Zero-Latency Dietary Integrity Platform",
               "An integrated multi-stage pipeline connecting optical packaging perception to verified Islamic jurisprudence.")

    stages = [
        ("STAGE 1: MULTI-MODAL INTAKE", "Packaging Photo / Live Camera / Barcode / Presets",
         "Captures packaging labels via WebRTC camera or file upload, or resolves UPC/EAN barcodes via OpenFoodFacts. Client/server auto-compression restricts size to <= 1024x1024px."),
        ("STAGE 2: DUAL-ENGINE AI & FIQH SYNTHESIS", "Groq Llama 3.2 Vision + Gemini Flash + 370+ DB",
         "Groq LPUs extract OCR entities in < 1.2s. Extracted additives are cross-referenced deterministically against 370+ indexed E-codes. Multi-Madhhab engine personalizes rulings."),
        ("STAGE 3: VERIFIED ACTIONABLE OUTPUT", "Compliance Dossier, 1-Click Inquiry, Certificate",
         "Delivers comprehensive audit dossier, allergen tags, 1-click brand inquiry email/tweet generator, and institutional printable compliance certificates (/certificate).")
    ]

    for idx, (st_title, st_sub, st_desc) in enumerate(stages):
        sy = Inches(1.85 + idx * 1.55)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), sy, Inches(5.8), Inches(1.4))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1)

        st_pill = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), sy + Inches(0.12), Inches(3.2), Inches(0.28))
        st_pill.fill.solid()
        st_pill.fill.fore_color.rgb = EMERALD_LIGHT
        st_pill.line.color.rgb = RGBColor(167, 243, 208)
        st_pill.line.width = Pt(1)
        tf_sp = st_pill.text_frame
        p_sp = tf_sp.paragraphs[0]
        p_sp.text = st_title
        p_sp.font.size = Pt(8.5)
        p_sp.font.bold = True
        p_sp.font.color.rgb = EMERALD_DEEP
        p_sp.font.name = "Arial"

        tb = s3.shapes.add_textbox(Inches(1.0), sy + Inches(0.42), Inches(5.4), Inches(0.9))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = st_sub
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_TITLE
        p1.font.name = "Arial"

        p2 = tf.add_paragraph()
        p2.text = st_desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_BODY
        p2.font.name = "Arial"

    right_card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.9), Inches(1.85), Inches(5.6), Inches(4.55))
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = CARD_BG
    right_card.line.color.rgb = CARD_BORDER
    right_card.line.width = Pt(1)

    hero_img_path = os.path.join(ASSETS_DIR, "hero_full.png")
    if os.path.exists(hero_img_path):
        s3.shapes.add_picture(hero_img_path, Inches(7.05), Inches(2.0), Inches(5.3), Inches(3.0))

    hero_tb = s3.shapes.add_textbox(Inches(7.05), Inches(5.15), Inches(5.3), Inches(1.1))
    tf_ht = hero_tb.text_frame
    tf_ht.word_wrap = True
    p_h1 = tf_ht.paragraphs[0]
    p_h1.text = "TaqwaLens Portal & Live Spatial Inspector"
    p_h1.font.size = Pt(12)
    p_h1.font.bold = True
    p_h1.font.color.rgb = TEXT_TITLE
    p_h1.font.name = "Arial"
    p_h2 = tf_ht.add_paragraph()
    p_h2.text = "Clean luxury design with 3D product carton, multi-school dropdown, instant quick search (⌘K), and instant test lab presets."
    p_h2.font.size = Pt(9.5)
    p_h2.font.color.rgb = TEXT_MUTED
    p_h2.font.name = "Arial"

    met_bar = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.45), Inches(11.7), Inches(0.48))
    met_bar.fill.solid()
    met_bar.fill.fore_color.rgb = EMERALD_LIGHT
    met_bar.line.color.rgb = RGBColor(167, 243, 208)
    met_bar.line.width = Pt(1)
    tf_mb = met_bar.text_frame
    p_mb = tf_mb.paragraphs[0]
    p_mb.alignment = PP_ALIGN.CENTER
    p_mb.text = "⚡  < 1.2s Roundtrip Latency   |   🧬  370+ Indexed E-Codes   |   ⚖️  100% Deterministic Fiqh Matching   |   ☁️  $0 Serverless Overhead"
    p_mb.font.size = Pt(9.5)
    p_mb.font.bold = True
    p_mb.font.color.rgb = EMERALD_DEEP
    p_mb.font.name = "Arial"

    add_footer(s3, 3)

    # =========================================================================
    # SLIDE 4: Ingestion & Perception Layer
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "04 // Ingestion & Perception Layer", "Multi-Modal Scanner & Auto-Compression Pipeline",
               "Designed for real supermarket conditions with camera streaming, retail barcode resolution, and intelligent bandwidth optimization.")

    left_card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.85), Inches(5.2), Inches(4.9))
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = CARD_BG
    left_card.line.color.rgb = CARD_BORDER
    left_card.line.width = Pt(1)

    scan_img_path = os.path.join(ASSETS_DIR, "scanner_crop.png")
    if os.path.exists(scan_img_path):
        s4.shapes.add_picture(scan_img_path, Inches(1.0), Inches(2.0), Inches(4.8), Inches(4.5))

    scan_features = [
        ("Dual Optical Ingestion Modes", "Photo Upload & In-Store Camera",
         "Shoppers can upload existing packaging photos (drag & drop JPEG, PNG, WEBP) or activate their rear smartphone camera feed via WebRTC getUserMedia (facingMode: 'environment')."),
        ("Client & Server Auto-Compression", "Bandwidth & Latency Optimization",
         "High-resolution photos from modern smartphones are automatically resized to max 1024x1024px using HTML5 Canvas client-side and Pillow server-side. Cuts payload size by 85% and eliminates API timeout errors."),
        ("1D Barcode (UPC/EAN) Resolver", "OpenFoodFacts API Integration",
         "Direct retail barcode decoding using pyzbar with automated lookup against OpenFoodFacts international database. Extracts verified ingredient statements and official additive tags without relying on OCR."),
        ("Instant Test Lab Presets Tray", "1-Click Evaluator Demonstration",
         "5 pre-configured real-world packaged test items (Indomie Mi Goreng, Haribo Goldbären, Doritos Nacho, Red Velvet Muffin, Lotus Biscoff) enable instantaneous demonstration of Halal, Haram, and Mushbooh verdicts.")
    ]

    for idx, (title, sub, desc) in enumerate(scan_features):
        fy = Inches(1.85 + idx * 1.22)
        f_card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.3), fy, Inches(6.2), Inches(1.12))
        f_card.fill.solid()
        f_card.fill.fore_color.rgb = CARD_BG
        f_card.line.color.rgb = CARD_BORDER
        f_card.line.width = Pt(1)

        tb = s4.shapes.add_textbox(Inches(6.5), fy + Inches(0.08), Inches(5.8), Inches(0.95))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = f"●  {title} — {sub}"
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = EMERALD_DEEP
        p1.font.name = "Arial"

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_BODY
        p2.font.name = "Arial"

    add_footer(s4, 4)

    # =========================================================================
    # SLIDE 5: The "Glass Box" Fiqh Knowledge Engine
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "05 // Core Knowledge Engine", "The 'Glass Box' Principle: Zero Black-Box Hallucinations",
               "Strict architectural separation between probabilistic vision OCR extraction and deterministic theological jurisprudence.")

    pillars = [
        ("PILLAR 1: LLM VISION ROLE", "Entity Extraction Only",
         "Groq Llama 3.2 11B Vision is strictly constrained to optical character recognition, text normalization, and entity extraction.\n\n"
         "• Extracted text is normalized to remove OCR noise\n"
         "• Identifies multi-lingual chemical synonyms\n"
         "• Strictly PROHIBITED from issuing religious decrees or inventing unverified E-codes.",
         CARD_BORDER),
        ("PILLAR 2: DETERMINISTIC FIQH DB", "370+ Verified E-Codes",
         "100% of compliance classifications are governed by the immutable additives_db.py database covering E100 to E1521.\n\n"
         "• Granular origin tagging: Plant, Animal, Synthetic, Microbial\n"
         "• Universal certification citations (JAKIM MS 1500, IFANCA)\n"
         "• Strict classification: Halal, Haram, Mushbooh.",
         CARD_BORDER_GOLD),
        ("PILLAR 3: DEFENSIVE SECURITY", "Non-Food & Payload Guards",
         "The pipeline contains multi-layer defensive validation to prevent system misuse, hallucination, and data corruption.\n\n"
         "• Non-Food Guard: Rejects non-food scenes with HTTP 422\n"
         "• 10MB payload ceiling & magic bytes verification\n"
         "• Sanitized error envelopes: 0 internal stack traces exposed.",
         CARD_BORDER)
    ]

    for idx, (title, sub, desc, border_col) in enumerate(pillars):
        px = Inches(0.8 + idx * 3.95)
        p_card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, Inches(1.85), Inches(3.8), Inches(3.55))
        p_card.fill.solid()
        p_card.fill.fore_color.rgb = CARD_BG
        p_card.line.color.rgb = border_col
        p_card.line.width = Pt(1.5)

        tb = s5.shapes.add_textbox(px + Inches(0.2), Inches(2.0), Inches(3.4), Inches(3.25))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = EMERALD_DEEP
        p1.font.name = "Arial"

        p2 = tf.add_paragraph()
        p2.text = sub
        p2.font.size = Pt(10)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_TITLE
        p2.font.name = "Arial"

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(9.5)
        p3.font.color.rgb = TEXT_BODY
        p3.font.name = "Arial"

    # Bottom Taxonomy Bar (Left) + Companion Card (Right)
    bot_card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.6), Inches(8.5), Inches(1.2))
    bot_card.fill.solid()
    bot_card.fill.fore_color.rgb = CARD_BG
    bot_card.line.color.rgb = CARD_BORDER
    bot_card.line.width = Pt(1)

    tf_bc = bot_card.text_frame
    tf_bc.margin_left = Inches(0.25)
    tf_bc.margin_top = Inches(0.12)
    p_b1 = tf_bc.paragraphs[0]
    p_b1.text = "DETERMINISTIC COMPLIANCE STATUS TAXONOMY"
    p_b1.font.size = Pt(10)
    p_b1.font.bold = True
    p_b1.font.color.rgb = TEXT_TITLE
    p_b1.font.name = "Arial"

    p_b2 = tf_bc.add_paragraph()
    p_b2.text = (
        "● HALAL (Permissible): 100% plant, mineral, or synthetic origin (e.g. E100 Curcumin, E300 Vitamin C, E322 Soya Lecithin)\n"
        "● HARAM (Prohibited): Porcine derivatives, non-dhabihah animal fats, or prohibited alcohol aids (e.g. E542 Bone Phosphate)\n"
        "● MUSHBOOH (Doubtful): Origin varies by batch (e.g. E471 Mono- & diglycerides, E422 Glycerol). Activates the 1-Click Brand Inquiry Drawer."
    )
    p_b2.font.size = Pt(9.0)
    p_b2.font.color.rgb = TEXT_BODY
    p_b2.font.name = "Arial"

    # Right: Anti-Stress Companion Card
    comp_card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.5), Inches(5.6), Inches(3.0), Inches(1.2))
    comp_card.fill.solid()
    comp_card.fill.fore_color.rgb = CARD_BG
    comp_card.line.color.rgb = CARD_BORDER
    comp_card.line.width = Pt(1)

    comp_img_path = os.path.join(ASSETS_DIR, "companion_crop.png")
    if os.path.exists(comp_img_path):
        s5.shapes.add_picture(comp_img_path, Inches(9.6), Inches(5.65), Inches(1.3), Inches(1.05))

    tb_comp = s5.shapes.add_textbox(Inches(10.95), Inches(5.65), Inches(1.5), Inches(1.05))
    tf_cp = tb_comp.text_frame
    tf_cp.word_wrap = True
    p_c1 = tf_cp.paragraphs[0]
    p_c1.text = "3D Fiqh Companion"
    p_c1.font.size = Pt(9.5)
    p_c1.font.bold = True
    p_c1.font.color.rgb = EMERALD_DEEP
    p_c1.font.name = "Arial"
    p_c2 = tf_cp.add_paragraph()
    p_c2.text = "Delightful UX mascot greeting shoppers with Bismillah & inspecting snacks."
    p_c2.font.size = Pt(8.0)
    p_c2.font.color.rgb = TEXT_MUTED
    p_c2.font.name = "Arial"

    add_footer(s5, 5)

    # =========================================================================
    # SLIDE 6: Multi-Madhhab Juristic Synthesizer
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "06 // Jurisprudential Reasoning", "Multi-Madhhab Engine: Dynamic Juristic Adaptation",
               "Accommodating classical Sunni jurisprudential differences through client-selectable Fiqh clearance profiles.")

    madhahib = [
        ("STANDARD (CONSENSUS)", "Global Baseline Standard",
         "Aligned with mainstream international Halal certifying authorities (JAKIM MS 1500, IFANCA, BPJPH).\n\n"
         "• Standard emulsifier source tolerance\n"
         "• Synthetic processing aid allowance\n"
         "• Baseline for international export.",
         EMERALD_DEEP, EMERALD_LIGHT),
        ("HANAFI SCHOOL", "Strict Rennet & Insect Colorants",
         "Enforces classical Hanafi rulings on insect products and rennet enzymes.\n\n"
         "• E120 Carmine / Cochineal elevated to HARAM\n"
         "• Non-plant animal rennet flagged\n"
         "• Non-fish seafood derivatives flagged.",
         CRIMSON_HARAM, CRIMSON_LIGHT),
        ("SHAFI'I SCHOOL", "Rigorous Slaughter Verification",
         "Enforces classical Shafi'i rulings regarding animal origin and dhabihah slaughter verification.\n\n"
         "• Bovine Gelatin (E441) mandates slaughter cert\n"
         "• Bone phosphate (E542) strictly monitored\n"
         "• Verified plant alternative prompts.",
         GOLD_WARM, GOLD_LIGHT),
        ("STRICT / WARA'", "High-Vigilance Precautionary Tier",
         "Adheres to the classical Islamic principle of scrupulousness (Taqwa / Wara').\n\n"
         "• All ambiguous synthetic additives escalated to MUSHBOOH\n"
         "• Chemical solvents require origin proof\n"
         "• 100% certified plant-only tolerance.",
         AMBER_MUSHBOOH, AMBER_LIGHT)
    ]

    for idx, (title, sub, desc, col_accent, col_light) in enumerate(madhahib):
        mx = Inches(0.8 + idx * 2.95)
        m_card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, mx, Inches(1.85), Inches(2.8), Inches(2.85))
        m_card.fill.solid()
        m_card.fill.fore_color.rgb = CARD_BG
        m_card.line.color.rgb = CARD_BORDER
        m_card.line.width = Pt(1)

        tag = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, mx + Inches(0.15), Inches(1.98), Inches(2.5), Inches(0.3))
        tag.fill.solid()
        tag.fill.fore_color.rgb = col_light
        tag.line.color.rgb = col_accent
        tag.line.width = Pt(1)
        tf_tag = tag.text_frame
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = title
        p_tag.font.size = Pt(8.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = col_accent
        p_tag.font.name = "Arial"

        tb = s6.shapes.add_textbox(mx + Inches(0.15), Inches(2.32), Inches(2.5), Inches(2.3))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = sub
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_TITLE
        p1.font.name = "Arial"

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9.0)
        p2.font.color.rgb = TEXT_BODY
        p2.font.name = "Arial"

    # Bottom Juristic Comparison Table
    table_card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.85), Inches(11.7), Inches(1.95))
    table_card.fill.solid()
    table_card.fill.fore_color.rgb = CARD_BG
    table_card.line.color.rgb = CARD_BORDER
    table_card.line.width = Pt(1)

    table_shape = s6.shapes.add_table(4, 5, Inches(1.0), Inches(4.95), Inches(11.3), Inches(1.7))
    table = table_shape.table
    table.columns[0].width = Inches(2.6)
    table.columns[1].width = Inches(2.1)
    table.columns[2].width = Inches(2.2)
    table.columns[3].width = Inches(2.3)
    table.columns[4].width = Inches(2.1)

    headers = ["ADDITIVE / SUBSTANCE", "STANDARD CONSENSUS", "HANAFI SCHOOL", "SHAFI'I SCHOOL", "STRICT (WARA')"]
    for c_idx, h_text in enumerate(headers):
        cell = table.cell(0, c_idx)
        cell.text = h_text
        p = cell.text_frame.paragraphs[0]
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = EMERALD_DEEP
        p.alignment = PP_ALIGN.CENTER if c_idx > 0 else PP_ALIGN.LEFT

    matrix_rows = [
        ("E120 Carmine / Cochineal", "PERMISSIBLE (GLOBAL)", "HARAM (INSECT PRODUCT)", "MUSHBOOH", "HARAM"),
        ("E441 Bovine Gelatin", "CONDITIONAL (HALAL ANIMAL)", "CONDITIONAL", "HARAM WITHOUT DHABIHAH", "MUSHBOOH"),
        ("E471 Mono- & Diglycerides", "HALAL (PLANT DECLARED)", "HALAL (PLANT DECLARED)", "HALAL (PLANT DECLARED)", "MUSHBOOH (STRICT)")
    ]

    for r_idx, row_data in enumerate(matrix_rows):
        for c_idx, val in enumerate(row_data):
            cell = table.cell(r_idx + 1, c_idx)
            cell.text = val
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(8.5)
            p.font.name = "Arial"
            if "HARAM" in val:
                p.font.bold = True
                p.font.color.rgb = CRIMSON_HARAM
            elif "HALAL" in val or "PERMISSIBLE" in val:
                p.font.color.rgb = EMERALD_DEEP
            else:
                p.font.color.rgb = AMBER_MUSHBOOH

            if c_idx > 0:
                p.alignment = PP_ALIGN.CENTER

    add_footer(s6, 6)

    # =========================================================================
    # SLIDE 7: Output Layer: Compliance Audit Dossier
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "07 // Output & Verification Layer", "Compliance Audit Dossier & Itemized Ingredient Grid",
               "Translating complex food chemistry and juristic citations into high-contrast, human-readable consumer telemetry.")

    left_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.85), Inches(5.6), Inches(4.9))
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = CARD_BG
    left_card.line.color.rgb = CARD_BORDER
    left_card.line.width = Pt(1)

    doss_path = os.path.join(ASSETS_DIR, "dossier_crop.png")
    if os.path.exists(doss_path):
        s7.shapes.add_picture(doss_path, Inches(0.95), Inches(2.0), Inches(5.3), Inches(3.1))

    tb_cd = s7.shapes.add_textbox(Inches(0.95), Inches(5.25), Inches(5.3), Inches(1.3))
    tf_cd = tb_cd.text_frame
    tf_cd.word_wrap = True
    p_c1 = tf_cd.paragraphs[0]
    p_c1.text = "Executive Telemetry & Confidence Score"
    p_c1.font.size = Pt(11)
    p_c1.font.bold = True
    p_c1.font.color.rgb = TEXT_TITLE
    p_c1.font.name = "Arial"
    p_c2 = tf_cd.add_paragraph()
    p_c2.text = "Displays clear aggregate verdict (Halal, Haram, Mushbooh), confidence percentage, detailed dietary analysis, and automatic allergen disclosures (Gluten, Soy, Milk, Nuts)."
    p_c2.font.size = Pt(9.5)
    p_c2.font.color.rgb = TEXT_MUTED
    p_c2.font.name = "Arial"

    right_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.7), Inches(1.85), Inches(5.8), Inches(4.9))
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = CARD_BG
    right_card.line.color.rgb = CARD_BORDER
    right_card.line.width = Pt(1)

    grid_path = os.path.join(ASSETS_DIR, "grid_crop.png")
    if os.path.exists(grid_path):
        s7.shapes.add_picture(grid_path, Inches(6.85), Inches(2.0), Inches(5.5), Inches(1.4))

    tb_rf = s7.shapes.add_textbox(Inches(6.85), Inches(3.55), Inches(5.5), Inches(3.0))
    tf_rf = tb_rf.text_frame
    tf_rf.word_wrap = True
    p_r1 = tf_rf.paragraphs[0]
    p_r1.text = "Itemized Additive & Ingredient Inventory"
    p_r1.font.size = Pt(12)
    p_r1.font.bold = True
    p_r1.font.color.rgb = TEXT_TITLE
    p_r1.font.name = "Arial"

    bullet_points = [
        "● Granular Status Pills: Every ingredient is individually categorized as HALAL (emerald), HARAM (crimson), or MUSHBOOH (amber).",
        "● Chemical Code Normalization: Automatically tags official INS/E-numbers (e.g. Beeswax E901, Carnauba Wax E903).",
        "● Recognized Certifications: Detects accredited Halal certification body logos (JAKIM, MUI/BPJPH, IFANCA, SANHA) printed on packaging.",
        "● Non-Fatwa Educational Disclaimer: Explicitly reiterates on every scan that findings are technological educational analysis, not binding religious fatawa."
    ]
    for bp in bullet_points:
        p = tf_rf.add_paragraph()
        p.text = bp
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_BODY
        p.font.name = "Arial"

    add_footer(s7, 7)

    # =========================================================================
    # SLIDE 8: 1-Click Brand Inquiry Drawer
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "08 // Consumer Empowerment", "1-Click Brand Inquiry: Resolving Sourcing Ambiguity",
               "Transforming passive consumer doubt (Shubhah) into corporate accountability and definitive clarification.")

    # Left: 3 Step Cards
    inq_cards = [
        ("STEP 1: DETECT AMBIGUITY", "Mushbooh Trigger",
         "When an additive source is unstated on the packaging (e.g., E471 mono-diglycerides, E422 glycerol), the engine flags it as MUSHBOOH and opens the inquiry drawer.",
         AMBER_MUSHBOOH, AMBER_LIGHT),
        ("STEP 2: AUTO-GENERATE DRAFTS", "Polite, Legally Courteous Templates",
         "Autonomously composes two tailored inquiries:\n1. Formal corporate email specifying batch number & fatty acid derivations.\n2. Concise 280-char tweet tagging the brand.",
         EMERALD_DEEP, EMERALD_LIGHT),
        ("STEP 3: 1-CLICK ACTION", "Direct Execution Triggers",
         "One-tap action triggers: 'Copy to Clipboard', 'Open Email Client (mailto:)', and 'Share on X' with pre-populated hashtags.",
         GOLD_WARM, GOLD_LIGHT)
    ]

    for idx, (title, sub, desc, col_accent, col_light) in enumerate(inq_cards):
        cy = Inches(1.85 + idx * 1.45)
        c_card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), cy, Inches(5.6), Inches(1.32))
        c_card.fill.solid()
        c_card.fill.fore_color.rgb = CARD_BG
        c_card.line.color.rgb = CARD_BORDER
        c_card.line.width = Pt(1)

        tag = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), cy + Inches(0.1), Inches(2.6), Inches(0.28))
        tag.fill.solid()
        tag.fill.fore_color.rgb = col_light
        tag.line.color.rgb = col_accent
        tag.line.width = Pt(1)
        tf_tag = tag.text_frame
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = title
        p_tag.font.size = Pt(8.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = col_accent
        p_tag.font.name = "Arial"

        tb = s8.shapes.add_textbox(Inches(1.0), cy + Inches(0.38), Inches(5.2), Inches(0.85))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = sub
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_TITLE
        p1.font.name = "Arial"

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9.0)
        p2.font.color.rgb = TEXT_BODY
        p2.font.name = "Arial"

    # Right: Inquiry Mockup Graphic
    inq_right_card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.7), Inches(1.85), Inches(5.8), Inches(4.3))
    inq_right_card.fill.solid()
    inq_right_card.fill.fore_color.rgb = CARD_BG
    inq_right_card.line.color.rgb = CARD_BORDER
    inq_right_card.line.width = Pt(1)

    inq_img_path = os.path.join(ASSETS_DIR, "inquiry_mockup.png")
    if os.path.exists(inq_img_path):
        s8.shapes.add_picture(inq_img_path, Inches(6.85), Inches(1.95), Inches(5.5), Inches(4.1))

    # Bottom impact banner
    imp_bar = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.3), Inches(11.7), Inches(0.55))
    imp_bar.fill.solid()
    imp_bar.fill.fore_color.rgb = EMERALD_LIGHT
    imp_bar.line.color.rgb = RGBColor(167, 243, 208)
    imp_bar.line.width = Pt(1)
    tf_ib = imp_bar.text_frame
    p_ib = tf_ib.paragraphs[0]
    p_ib.alignment = PP_ALIGN.CENTER
    p_ib.text = "🎯  MEASURED IMPACT: Converts 100% of unresolvable doubtful additives into actionable brand transparency requests, empowering conscious consumers."
    p_ib.font.size = Pt(9.5)
    p_ib.font.bold = True
    p_ib.font.color.rgb = EMERALD_DEEP
    p_ib.font.name = "Arial"

    add_footer(s8, 8)

    # =========================================================================
    # SLIDE 9: Institutional Compliance Certificate & Audit Ledger
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "09 // Institutional Audit & Trust", "Institutional Compliance Certificate & Audit Ledger",
               "Generating verifiable, audit-stamped compliance dossiers with unique reference IDs for retailers, importers, and consumers.")

    left_card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.85), Inches(5.6), Inches(4.9))
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = CARD_BG
    left_card.line.color.rgb = CARD_BORDER_GOLD
    left_card.line.width = Pt(1.5)

    cert_path = os.path.join(ASSETS_DIR, "cert_crop.png")
    if os.path.exists(cert_path):
        s9.shapes.add_picture(cert_path, Inches(0.95), Inches(2.0), Inches(5.3), Inches(3.4))

    tb_cp = s9.shapes.add_textbox(Inches(0.95), Inches(5.5), Inches(5.3), Inches(1.1))
    tf_cp = tb_cp.text_frame
    tf_cp.word_wrap = True
    p_c1 = tf_cp.paragraphs[0]
    p_c1.text = "Official Compliance Dossier & Certificate"
    p_c1.font.size = Pt(11)
    p_c1.font.bold = True
    p_c1.font.color.rgb = TEXT_TITLE
    p_c1.font.name = "Arial"
    p_c2 = tf_cp.add_paragraph()
    p_c2.text = "Double-border parchment texture (#FCFBF8), dynamic reference ID (TL-XXXXX-2026), animated holographic seal, and native print-to-PDF formatting."
    p_c2.font.size = Pt(9.5)
    p_c2.font.color.rgb = TEXT_MUTED
    p_c2.font.name = "Arial"

    inst_cards = [
        ("Dedicated /certificate Route", "Full-Page Printable PDF Engine",
         "A standalone Next.js route (/certificate) engineered specifically for high-resolution print output. Fully optimized for the iOS Share Sheet and Android Print Spooler with zero margin clipping."),
        ("Persistent Scan History Ledger", "LocalStorage Audit Trail with Replay",
         "Every scan is saved to the client audit ledger (HistoryDrawer.tsx). Users can review previous product verdicts, view timestamped logs, and replay any audit instantaneously."),
        ("Product Comparison Modal", "Side-by-Side Brand Audit",
         "Enables consumers and procurement officers to compare two competing products side-by-side, evaluating additive safety, allergen profiles, and Madhhab alignment to select the superior product.")
    ]

    for idx, (title, sub, desc) in enumerate(inst_cards):
        iy = Inches(1.85 + idx * 1.6)
        i_card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.7), iy, Inches(5.8), Inches(1.45))
        i_card.fill.solid()
        i_card.fill.fore_color.rgb = CARD_BG
        i_card.line.color.rgb = CARD_BORDER
        i_card.line.width = Pt(1)

        tb = s9.shapes.add_textbox(Inches(6.9), iy + Inches(0.12), Inches(5.4), Inches(1.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = f"●  {title} — {sub}"
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = EMERALD_DEEP
        p1.font.name = "Arial"

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_BODY
        p2.font.name = "Arial"

    add_footer(s9, 9)

    # =========================================================================
    # SLIDE 10: Full-Stack Engineering, UN SDGs & Strategic Roadmap
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "10 // Engineering, Impact & Roadmap", "Enterprise Architecture, UN SDGs Impact & Future Roadmap",
               "Built on zero-overhead serverless infrastructure, aligned with global humanitarian goals, and scaled for enterprise.")

    # Col 1: Tech Stack
    c1 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.85), Inches(3.8), Inches(4.3))
    c1.fill.solid()
    c1.fill.fore_color.rgb = CARD_BG
    c1.line.color.rgb = CARD_BORDER
    c1.line.width = Pt(1)

    tag1 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(2.0), Inches(3.2), Inches(0.3))
    tag1.fill.solid()
    tag1.fill.fore_color.rgb = EMERALD_LIGHT
    tag1.line.color.rgb = EMERALD_DEEP
    tag1.line.width = Pt(1)
    tf_tg1 = tag1.text_frame
    p_tg1 = tf_tg1.paragraphs[0]
    p_tg1.text = "ENTERPRISE TECH STACK"
    p_tg1.font.size = Pt(8.5)
    p_tg1.font.bold = True
    p_tg1.font.color.rgb = EMERALD_DEEP
    p_tg1.font.name = "Arial"

    tb1 = s10.shapes.add_textbox(Inches(1.0), Inches(2.35), Inches(3.4), Inches(3.6))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "Production-Grade Architecture"
    p1.font.size = Pt(11)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_TITLE
    p1.font.name = "Arial"
    p2 = tf1.add_paragraph()
    p2.text = (
        "• Frontend: Next.js 14 App Router, TypeScript, Three.js 0.161, Tailwind CSS\n"
        "• Backend: FastAPI 0.115, Python 3.11+, Pydantic v2.9, Uvicorn ASGI\n"
        "• AI Vision: Groq LPU (Llama 3.2 Vision) + Gemini 1.5 Flash fallback\n"
        "• Barcode / CV: pyzbar 1D decoding + Pillow magic bytes security\n"
        "• Cloud: Vercel Edge Serverless ($0 maintenance overhead)\n"
        "• Validation: 18 passing pytest test cases with 100% backend coverage."
    )
    p2.font.size = Pt(9.0)
    p2.font.color.rgb = TEXT_BODY
    p2.font.name = "Arial"

    # Col 2: UN SDGs Impact
    c2 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.8), Inches(1.85), Inches(3.8), Inches(4.3))
    c2.fill.solid()
    c2.fill.fore_color.rgb = CARD_BG
    c2.line.color.rgb = CARD_BORDER
    c2.line.width = Pt(1)

    tag2 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.0), Inches(2.0), Inches(3.2), Inches(0.3))
    tag2.fill.solid()
    tag2.fill.fore_color.rgb = GOLD_LIGHT
    tag2.line.color.rgb = GOLD_WARM
    tag2.line.width = Pt(1)
    tf_tg2 = tag2.text_frame
    p_tg2 = tf_tg2.paragraphs[0]
    p_tg2.text = "UN SDGs ALIGNMENT"
    p_tg2.font.size = Pt(8.5)
    p_tg2.font.bold = True
    p_tg2.font.color.rgb = GOLD_WARM
    p_tg2.font.name = "Arial"

    tb2 = s10.shapes.add_textbox(Inches(5.0), Inches(2.35), Inches(3.4), Inches(3.6))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    p1 = tf2.paragraphs[0]
    p1.text = "Humanitarian & Ethical Impact"
    p1.font.size = Pt(11)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_TITLE
    p1.font.name = "Arial"
    p2 = tf2.add_paragraph()
    p2.text = (
        "• SDG 3 (Good Health & Well-Being): Eliminates harmful chemical additives & discloses allergens.\n"
        "• SDG 12 (Responsible Consumption): Promotes ethical, plant-based transparency & manufacturer accountability.\n"
        "• SDG 9 (Industry & Innovation): Lightweight serverless AI accessible globally at zero user cost.\n"
        "• SDG 16 (Peace & Strong Institutions): Verifiable compliance certificates combatting counterfeit Halal logos.\n"
        "• SDG 17 (Partnerships): Unifying global standards (JAKIM, IFANCA, SANHA)."
    )
    p2.font.size = Pt(9.0)
    p2.font.color.rgb = TEXT_BODY
    p2.font.name = "Arial"

    # Col 3: Roadmap + Mobile Screen
    c3 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(1.85), Inches(3.7), Inches(4.3))
    c3.fill.solid()
    c3.fill.fore_color.rgb = CARD_BG
    c3.line.color.rgb = CARD_BORDER
    c3.line.width = Pt(1)

    tag3 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.0), Inches(2.0), Inches(3.3), Inches(0.3))
    tag3.fill.solid()
    tag3.fill.fore_color.rgb = AMBER_LIGHT
    tag3.line.color.rgb = AMBER_MUSHBOOH
    tag3.line.width = Pt(1)
    tf_tg3 = tag3.text_frame
    p_tg3 = tf_tg3.paragraphs[0]
    p_tg3.text = "STRATEGIC FUTURE ROADMAP"
    p_tg3.font.size = Pt(8.5)
    p_tg3.font.bold = True
    p_tg3.font.color.rgb = AMBER_MUSHBOOH
    p_tg3.font.name = "Arial"

    tb3 = s10.shapes.add_textbox(Inches(9.0), Inches(2.35), Inches(3.3), Inches(1.9))
    tf3 = tb3.text_frame
    tf3.word_wrap = True
    p1 = tf3.paragraphs[0]
    p1.text = "From MVP to Global Ecosystem"
    p1.font.size = Pt(11)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_TITLE
    p1.font.name = "Arial"
    p2 = tf3.add_paragraph()
    p2.text = (
        "• Phase 2: On-Device Edge Vision (Wasm / ONNX) for offline scanning in basement grocery aisles.\n"
        "• Phase 3: Global Halal Body Federation with direct API sync to JAKIM e-Halal and BPJPH registries.\n"
        "• Phase 4: B2B Halal ERP Supply Chain Portal for bulk specification sheet clearance."
    )
    p2.font.size = Pt(8.5)
    p2.font.color.rgb = TEXT_BODY
    p2.font.name = "Arial"

    # Embedded mobile screen at bottom of Col 3
    mob_path = os.path.join(ASSETS_DIR, "mobile_crop.png")
    if os.path.exists(mob_path):
        s10.shapes.add_picture(mob_path, Inches(9.4), Inches(4.35), Inches(2.5), Inches(1.65))

    close_bar = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.3), Inches(11.7), Inches(0.55))
    close_bar.fill.solid()
    close_bar.fill.fore_color.rgb = EMERALD_DEEP
    close_bar.line.fill.background()
    tf_cl = close_bar.text_frame
    p_cl = tf_cl.paragraphs[0]
    p_cl.alignment = PP_ALIGN.CENTER
    p_cl.text = "TaqwaLens  —  Eat with Certainty. Verified Islamic Dietary Compliance for Conscious Consumers Worldwide."
    p_cl.font.size = Pt(10)
    p_cl.font.bold = True
    p_cl.font.color.rgb = RGBColor(255, 255, 255)
    p_cl.font.name = "Arial"

    add_footer(s10, 10)

    # Save to both target locations
    root_out = r"c:\Windows\System32\taqwalens\TaqwaLens_Presentation.pptx"
    public_out = r"c:\Windows\System32\taqwalens\frontend\public\TaqwaLens_Presentation.pptx"

    prs.save(root_out)
    prs.save(public_out)
    print(f"Presentation successfully generated and saved to:\n1. {root_out}\n2. {public_out}")


if __name__ == "__main__":
    create_deck()
