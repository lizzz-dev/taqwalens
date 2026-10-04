"""
TaqwaLens Presentation Deck Generator
Generates a stunning, production-grade 16:9 widescreen PowerPoint presentation (TaqwaLens_Presentation.pptx)
matching the TaqwaLens dark emerald and radiant gold luxury design system.
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# Theme Color Palette
COLOR_BG_DARK = RGBColor(2, 26, 19)        # #021a13 - Deep Emerald Dark
COLOR_CARD_BG = RGBColor(4, 40, 30)        # #04281e - Forest Green Card
COLOR_CARD_BORDER = RGBColor(16, 185, 129) # #10b981 - Emerald Neon
COLOR_GOLD = RGBColor(245, 158, 11)        # #f59e0b - Radiant Gold
COLOR_GOLD_LIGHT = RGBColor(254, 243, 199) # #fef3c7 - Cream Gold
COLOR_EMERALD_LIGHT = RGBColor(167, 243, 208) # #a7f3d0 - Mint Accent
COLOR_WHITE = RGBColor(250, 248, 245)      # #faf8f5 - Crisp Off-White
COLOR_RED = RGBColor(239, 68, 68)          # #ef4444 - Prohibited Red
COLOR_MUTED = RGBColor(110, 231, 183)      # #6ee7b7 - Subtext Muted

def create_presentation():
    prs = Presentation()
    # 16:9 Widescreen (13.333 x 7.5 inches)
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6]

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_BG_DARK
        bg.line.fill.background() # No border
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text):
        # Header Box
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.733), Inches(1.3))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p_tag = tf.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = COLOR_GOLD
        p_tag.font.name = "Arial"

        p_title = tf.add_paragraph()
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_WHITE
        p_title.font.name = "Georgia"
        p_title.space_before = Pt(4)

        p_sub = tf.add_paragraph()
        p_sub.text = subtitle_text
        p_sub.font.size = Pt(12)
        p_sub.font.color.rgb = COLOR_MUTED
        p_sub.font.name = "Arial"
        p_sub.space_before = Pt(3)

    def add_card(slide, left, top, width, height, bg_color=COLOR_CARD_BG, border_color=COLOR_CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)
        return card

    def add_footer(slide, current_idx, total_count=10, note="TaqwaLens Core Engineering Team // 2026"):
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(6.9), Inches(11.733), Inches(0.4))
        tf = footer_box.text_frame
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = f"{note}   •   SLIDE {current_idx:02d} / {total_count:02d}"
        p.font.size = Pt(9)
        p.font.color.rgb = COLOR_MUTED
        p.font.name = "Arial"

    # =========================================================================
    # SLIDE 1: Title & Executive Vision
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide1)

    # Top release pill
    pill = add_card(slide1, Inches(0.8), Inches(0.8), Inches(3.6), Inches(0.4), RGBColor(6, 78, 59), COLOR_GOLD)
    p_tf = pill.text_frame
    p_tf.margin_top = Inches(0.08)
    p = p_tf.paragraphs[0]
    p.text = "● PRODUCTION RELEASE // VERSION 1.0.0"
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD_LIGHT

    # Main Hero text box
    title_box = slide1.shapes.add_textbox(Inches(0.8), Inches(1.4), Inches(11.733), Inches(2.6))
    tf1 = title_box.text_frame
    tf1.word_wrap = True
    tf1.margin_left = tf1.margin_top = tf1.margin_right = tf1.margin_bottom = 0

    p_org = tf1.paragraphs[0]
    p_org.text = "GLOBAL DIETARY INTEGRITY PLATFORM"
    p_org.font.size = Pt(12)
    p_org.font.bold = True
    p_org.font.color.rgb = COLOR_GOLD

    p_main = tf1.add_paragraph()
    p_main.text = "TaqwaLens"
    p_main.font.size = Pt(54)
    p_main.font.bold = True
    p_main.font.color.rgb = COLOR_WHITE
    p_main.font.name = "Georgia"
    p_main.space_before = Pt(4)

    p_sub = tf1.add_paragraph()
    p_sub.text = "Autonomous Multi-Modal Halal Compliance & Dietary Intelligence System"
    p_sub.font.size = Pt(20)
    p_sub.font.color.rgb = COLOR_GOLD_LIGHT
    p_sub.font.name = "Georgia"
    p_sub.space_before = Pt(6)

    p_desc = tf1.add_paragraph()
    p_desc.text = "Sub-second grocery packaging OCR, deterministic verification across 370+ indexed E-codes, and nuanced classical jurisprudence across 4 Sunni legal schools."
    p_desc.font.size = Pt(13)
    p_desc.font.color.rgb = COLOR_EMERALD_LIGHT
    p_desc.space_before = Pt(8)

    # 3 Executive Value Pillars
    c_w = Inches(3.7)
    c_h = Inches(2.2)
    y_pos = Inches(4.3)

    # Pillar 1
    add_card(slide1, Inches(0.8), y_pos, c_w, c_h)
    tb1 = slide1.shapes.add_textbox(Inches(1.0), y_pos + Inches(0.2), c_w - Inches(0.4), c_h - Inches(0.4))
    tf = tb1.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = "⚡ SUB-SECOND VISION"
    p1.font.size = Pt(13)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_GOLD
    p2 = tf.add_paragraph()
    p2.text = "Groq LPU Llama 3.2 Vision OCR (<1.2s) backed by automated Google Gemini 1.5 Flash failover."
    p2.font.size = Pt(11)
    p2.font.color.rgb = COLOR_WHITE
    p2.space_before = Pt(6)

    # Pillar 2
    add_card(slide1, Inches(4.8), y_pos, c_w, c_h)
    tb2 = slide1.shapes.add_textbox(Inches(5.0), y_pos + Inches(0.2), c_w - Inches(0.4), c_h - Inches(0.4))
    tf = tb2.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = "🛡️ DETERMINISTIC FIQH"
    p1.font.size = Pt(13)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_CARD_BORDER
    p2 = tf.add_paragraph()
    p2.text = "Glass Box architecture with zero LLM hallucination over 370+ indexed food additives."
    p2.font.size = Pt(11)
    p2.font.color.rgb = COLOR_WHITE
    p2.space_before = Pt(6)

    # Pillar 3
    add_card(slide1, Inches(8.8), y_pos, c_w, c_h)
    tb3 = slide1.shapes.add_textbox(Inches(9.0), y_pos + Inches(0.2), c_w - Inches(0.4), c_h - Inches(0.4))
    tf = tb3.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = "⚖️ MULTI-MADHHAB RIGOR"
    p1.font.size = Pt(13)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_GOLD
    p2 = tf.add_paragraph()
    p2.text = "Tailored rulings for Standard Consensus, Hanafi, Shafi'i, and Strict (Wara') high-vigilance."
    p2.font.size = Pt(11)
    p2.font.color.rgb = COLOR_WHITE
    p2.space_before = Pt(6)

    add_footer(slide1, 1, note="Aligned with JAKIM MS 1500, IFANCA & SANHA Standards")

    # =========================================================================
    # SLIDE 2: Problem Space
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide2)
    add_header(slide2, "02 // The Problem Space", "Supermarket Cognitive Saturation & Chemical Ambiguity", "Why 1.9 billion consumers face friction and doubt in grocery aisles every day.")

    # 4 Problem Vectors (Left 2x2)
    pv_w = Inches(3.2)
    pv_h = Inches(1.9)
    # Row 1
    add_card(slide2, Inches(0.8), Inches(2.2), pv_w, pv_h, RGBColor(30, 10, 10), COLOR_RED)
    tb = slide2.shapes.add_textbox(Inches(1.0), Inches(2.3), pv_w - Inches(0.4), pv_h - Inches(0.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "❌ CRYPTIC E-CODES"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = RGBColor(252, 165, 165)
    p2 = tf.add_paragraph()
    p2.text = "Chemical numbers (E471, E120, E441) conceal animal derivatives behind technical jargon."
    p2.font.size = Pt(10)
    p2.font.color.rgb = COLOR_WHITE

    add_card(slide2, Inches(4.3), Inches(2.2), pv_w, pv_h, RGBColor(35, 25, 5), COLOR_GOLD)
    tb = slide2.shapes.add_textbox(Inches(4.5), Inches(2.3), pv_w - Inches(0.4), pv_h - Inches(0.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "⚠️ 15-MINUTE DELAYS"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD_LIGHT
    p2 = tf.add_paragraph()
    p2.text = "Shoppers spend 10-15 minutes Googling conflicting forum posts and outdated PDF lists."
    p2.font.size = Pt(10)
    p2.font.color.rgb = COLOR_WHITE

    # Row 2
    add_card(slide2, Inches(0.8), Inches(4.4), pv_w, pv_h, RGBColor(35, 25, 5), COLOR_GOLD)
    tb = slide2.shapes.add_textbox(Inches(1.0), Inches(4.5), pv_w - Inches(0.4), pv_h - Inches(0.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "⚖️ FIQH DIVERGENCE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD_LIGHT
    p2 = tf.add_paragraph()
    p2.text = "Generic apps ignore madhhab rulings: Carmine (E120) is Haram in Hanafi but permitted elsewhere."
    p2.font.size = Pt(10)
    p2.font.color.rgb = COLOR_WHITE

    add_card(slide2, Inches(4.3), Inches(4.4), pv_w, pv_h, RGBColor(30, 10, 10), COLOR_RED)
    tb = slide2.shapes.add_textbox(Inches(4.5), Inches(4.5), pv_w - Inches(0.4), pv_h - Inches(0.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "❓ ZERO RECOURSE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = RGBColor(252, 165, 165)
    p2 = tf.add_paragraph()
    p2.text = "When an item is doubtful (Mushbooh), consumers have no tool to demand brand clarity."
    p2.font.size = Pt(10)
    p2.font.color.rgb = COLOR_WHITE

    # Right: Simulated Label Box
    label_w = Inches(4.5)
    label_h = Inches(4.1)
    add_card(slide2, Inches(8.0), Inches(2.2), label_w, label_h, RGBColor(10, 15, 15), COLOR_CARD_BORDER)
    tb_l = slide2.shapes.add_textbox(Inches(8.2), Inches(2.4), label_w - Inches(0.4), label_h - Inches(0.4))
    tf = tb_l.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "SIMULATED RETAIL INGREDIENT PANEL"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_CARD_BORDER

    p_ing = tf.add_paragraph()
    p_ing.text = "INGREDIENTS: Wheat Flour, Sugar, Palm Fat, Emulsifier (E471)*, Salt, Carmine (E120)**, Gelatin (E441)***, Natural Vanilla Flavoring."
    p_ing.font.size = Pt(11)
    p_ing.font.color.rgb = COLOR_WHITE
    p_ing.space_before = Pt(8)

    p_c1 = tf.add_paragraph()
    p_c1.text = "* E471: Ambiguous animal vs. plant fatty acid (MUSHBOOH)"
    p_c1.font.size = Pt(10)
    p_c1.font.color.rgb = COLOR_GOLD
    p_c1.space_before = Pt(12)

    p_c2 = tf.add_paragraph()
    p_c2.text = "** E120: Insect extract; strictly Haram in Hanafi"
    p_c2.font.size = Pt(10)
    p_c2.font.color.rgb = RGBColor(248, 113, 113)
    p_c2.space_before = Pt(4)

    p_c3 = tf.add_paragraph()
    p_c3.text = "*** E441: Bovine gelatin requires verified Dhabihah slaughter"
    p_c3.font.size = Pt(10)
    p_c3.font.color.rgb = COLOR_GOLD
    p_c3.space_before = Pt(4)

    add_footer(slide2, 2)

    # =========================================================================
    # SLIDE 3: Vision & Ingestion Pipeline
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide3)
    add_header(slide3, "03 // Ingestion & Vision Pipeline", "High-Speed Optical Ingestion & Dual-Engine Failover", "Sub-second packaging OCR with zero bandwidth waste and automated 99.9% failover.")

    # 4 Pipeline Boxes
    p_w = Inches(2.7)
    p_h = Inches(2.4)
    x_coords = [Inches(0.8), Inches(3.8), Inches(6.8), Inches(9.8)]

    # Step 1
    add_card(slide3, x_coords[0], Inches(2.2), p_w, p_h)
    tb = slide3.shapes.add_textbox(x_coords[0] + Inches(0.2), Inches(2.4), p_w - Inches(0.4), p_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "📸 1. MULTI-STREAM"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD
    p = tf.add_paragraph()
    p.text = "Live camera stream, photo upload, or 1D retail UPC/EAN barcode."
    p.font.size = Pt(10)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(4)
    p = tf.add_paragraph()
    p.text = "Canvas Max 1024px\n78% Size Reduction"
    p.font.size = Pt(9)
    p.font.color.rgb = COLOR_MUTED
    p.space_before = Pt(6)

    # Step 2
    add_card(slide3, x_coords[1], Inches(2.2), p_w, p_h, RGBColor(6, 60, 45), COLOR_CARD_BORDER)
    tb = slide3.shapes.add_textbox(x_coords[1] + Inches(0.2), Inches(2.4), p_w - Inches(0.4), p_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "⚡ 2. GROQ LPU VISION"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_CARD_BORDER
    p = tf.add_paragraph()
    p.text = "Llama 3.2 11B Vision delivers sub-second character extraction."
    p.font.size = Pt(10)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(4)
    p = tf.add_paragraph()
    p.text = "Mean Latency: 1.18s\nStructured JSON OCR"
    p.font.size = Pt(9)
    p.font.color.rgb = COLOR_GOLD_LIGHT
    p.space_before = Pt(6)

    # Step 3
    add_card(slide3, x_coords[2], Inches(2.2), p_w, p_h, RGBColor(35, 25, 5), COLOR_GOLD)
    tb = slide3.shapes.add_textbox(x_coords[2] + Inches(0.2), Inches(2.4), p_w - Inches(0.4), p_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🔄 3. GEMINI FAILOVER"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD
    p = tf.add_paragraph()
    p.text = "Google Gemini 1.5 Flash activated seamlessly if Groq is degraded."
    p.font.size = Pt(10)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(4)
    p = tf.add_paragraph()
    p.text = "99.9% Uptime SLA\nAutomatic Retry"
    p.font.size = Pt(9)
    p.font.color.rgb = COLOR_GOLD_LIGHT
    p.space_before = Pt(6)

    # Step 4
    add_card(slide3, x_coords[3], Inches(2.2), p_w, p_h)
    tb = slide3.shapes.add_textbox(x_coords[3] + Inches(0.2), Inches(2.4), p_w - Inches(0.4), p_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🛡️ 4. NON-FOOD GUARD"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_MUTED
    p = tf.add_paragraph()
    p.text = "Analyzes visual features and rejects non-food scenes immediately."
    p.font.size = Pt(10)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(4)
    p = tf.add_paragraph()
    p.text = "HTTP 422 Rejection\nZero Hallucination"
    p.font.size = Pt(9)
    p.font.color.rgb = COLOR_MUTED
    p.space_before = Pt(6)

    # Telemetry HUD Row
    t_w = Inches(2.7)
    t_h = Inches(1.5)
    telemetry_items = [
        ("INFERENCE LATENCY", "1.18s", COLOR_WHITE),
        ("PAYLOAD COMPRESSION", "78% Red.", COLOR_CARD_BORDER),
        ("BARCODE ENGINE", "OpenFoodFacts", COLOR_GOLD),
        ("CLOUD OVERHEAD", "$0.00 / Free", COLOR_WHITE)
    ]
    for i, (k, v, c) in enumerate(telemetry_items):
        add_card(slide3, x_coords[i], Inches(4.9), t_w, t_h, RGBColor(5, 15, 10), COLOR_CARD_BORDER)
        tb = slide3.shapes.add_textbox(x_coords[i] + Inches(0.1), Inches(5.1), t_w - Inches(0.2), t_h - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = k
        p.font.size = Pt(9)
        p.font.color.rgb = COLOR_MUTED
        p2 = tf.add_paragraph()
        p2.text = v
        p2.font.size = Pt(18)
        p2.font.bold = True
        p2.font.color.rgb = c
        p2.space_before = Pt(4)

    add_footer(slide3, 3)

    # =========================================================================
    # SLIDE 4: Deterministic Fiqh Knowledge Base
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide4)
    add_header(slide4, "04 // Knowledge Engine", "The \"Glass Box\" Principle: Zero Black-Box Hallucinations", "Why probabilistic LLMs must NEVER invent religious rulings or alter certified chemical databases.")

    # 3 Taxonomy Columns
    col_w = Inches(3.7)
    col_h = Inches(3.6)
    c_y = Inches(2.2)

    # HALAL
    add_card(slide4, Inches(0.8), c_y, col_w, col_h, RGBColor(5, 45, 30), COLOR_CARD_BORDER)
    tb = slide4.shapes.add_textbox(Inches(1.0), c_y + Inches(0.2), col_w - Inches(0.4), col_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🟢 HALAL (PERMISSIBLE)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_CARD_BORDER
    p = tf.add_paragraph()
    p.text = "100% plant, mineral, or synthetic sources without animal contamination."
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(6)
    p = tf.add_paragraph()
    p.text = "• E100: Curcumin (Plant)\n• E300: Ascorbic Acid (Synthetic)\n• E322: Soya Lecithin (Vegetable)"
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_EMERALD_LIGHT
    p.space_before = Pt(12)

    # HARAM
    add_card(slide4, Inches(4.8), c_y, col_w, col_h, RGBColor(40, 10, 10), COLOR_RED)
    tb = slide4.shapes.add_textbox(Inches(5.0), c_y + Inches(0.2), col_w - Inches(0.4), col_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🔴 HARAM (PROHIBITED)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = RGBColor(248, 113, 113)
    p = tf.add_paragraph()
    p.text = "Porcine derivatives, unslaughtered animal fats, or prohibited alcohol aids."
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(6)
    p = tf.add_paragraph()
    p.text = "• E120: Carmine (Insect Extract)\n• E542: Bone Phosphate (Animal)\n• E441: Porcine Gelatin"
    p.font.size = Pt(11)
    p.font.color.rgb = RGBColor(252, 165, 165)
    p.space_before = Pt(12)

    # MUSHBOOH
    add_card(slide4, Inches(8.8), c_y, col_w, col_h, RGBColor(40, 30, 5), COLOR_GOLD)
    tb = slide4.shapes.add_textbox(Inches(9.0), c_y + Inches(0.2), col_w - Inches(0.4), col_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🟡 MUSHBOOH (DOUBTFUL)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD
    p = tf.add_paragraph()
    p.text = "Dual-origin fatty acids where plant vs. animal origin is not disclosed on packaging."
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(6)
    p = tf.add_paragraph()
    p.text = "• E471: Mono- & Diglycerides\n• E422: Glycerol (Fatty Acid)\n• E476: Polyglycerol Polyricinoleate"
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_GOLD_LIGHT
    p.space_before = Pt(12)

    # Database Summary Strip
    strip = add_card(slide4, Inches(0.8), Inches(6.0), Inches(11.733), Inches(0.6), RGBColor(10, 20, 15), COLOR_CARD_BORDER)
    tb_s = slide4.shapes.add_textbox(Inches(1.0), Inches(6.1), Inches(11.3), Inches(0.4))
    tf = tb_s.text_frame
    p = tf.paragraphs[0]
    p.text = "DATABASE SCALE: 370+ Indexed Additives Cross-Referenced with JAKIM MS 1500, IFANCA & SANHA Standards"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    add_footer(slide4, 4)

    # =========================================================================
    # SLIDE 5: Multi-Madhhab Juristic Synthesizer
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide5)
    add_header(slide5, "05 // Islamic Jurisprudence", "Multi-Madhhab Engine: Dynamic Juristic Re-Evaluation", "Personalized classical rulings across 4 Sunni legal schools with zero re-scanning required.")

    # 4 Madhhab Cards (Left 2x2)
    m_w = Inches(3.2)
    m_h = Inches(1.9)
    # Row 1
    add_card(slide5, Inches(0.8), Inches(2.2), m_w, m_h)
    tb = slide5.shapes.add_textbox(Inches(1.0), Inches(2.3), m_w - Inches(0.4), m_h - Inches(0.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🏛️ STANDARD CONSENSUS"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_CARD_BORDER
    p2 = tf.add_paragraph()
    p2.text = "Aligned with global Halal bodies (JAKIM, IFANCA). Broadest industrial consensus."
    p2.font.size = Pt(10)
    p2.font.color.rgb = COLOR_WHITE

    add_card(slide5, Inches(4.3), Inches(2.2), m_w, m_h, RGBColor(35, 25, 5), COLOR_GOLD)
    tb = slide5.shapes.add_textbox(Inches(4.5), Inches(2.3), m_w - Inches(0.4), m_h - Inches(0.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "⚖️ HANAFI SCHOOL"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD
    p2 = tf.add_paragraph()
    p2.text = "Strict prohibition on insect-derived food dyes (E120 Carmine) and non-plant rennet."
    p2.font.size = Pt(10)
    p2.font.color.rgb = COLOR_WHITE

    # Row 2
    add_card(slide5, Inches(0.8), Inches(4.4), m_w, m_h)
    tb = slide5.shapes.add_textbox(Inches(1.0), Inches(4.5), m_w - Inches(0.4), m_h - Inches(0.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "📜 SHAFI'I SCHOOL"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_MUTED
    p2 = tf.add_paragraph()
    p2.text = "Rigorous slaughter verification for bovine gelatin (E441) and bone phosphate."
    p2.font.size = Pt(10)
    p2.font.color.rgb = COLOR_WHITE

    add_card(slide5, Inches(4.3), Inches(4.4), m_w, m_h, RGBColor(35, 25, 5), COLOR_GOLD)
    tb = slide5.shapes.add_textbox(Inches(4.5), Inches(4.5), m_w - Inches(0.4), m_h - Inches(0.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🛡️ STRICT (WARA' TIER)"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD_LIGHT
    p2 = tf.add_paragraph()
    p2.text = "Maximum vigilance tier: flags all synthetic chemical carriers & ambiguous solvents."
    p2.font.size = Pt(10)
    p2.font.color.rgb = COLOR_WHITE

    # Right: Case Study Simulator Card
    sim_w = Inches(4.5)
    sim_h = Inches(4.1)
    add_card(slide5, Inches(8.0), Inches(2.2), sim_w, sim_h, RGBColor(10, 15, 15), COLOR_GOLD)
    tb = slide5.shapes.add_textbox(Inches(8.2), Inches(2.4), sim_w - Inches(0.4), sim_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "LIVE JURISTIC CASE STUDY"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    p = tf.add_paragraph()
    p.text = "Product: Strawberry Macaron (Contains E120 Carmine)"
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(6)

    # Standard outcome
    p = tf.add_paragraph()
    p.text = "1. Under Standard Consensus:\n   VERDICT: CONDITIONAL / PERMISSIBLE\n   Purified carmine is tolerated under global certification thresholds."
    p.font.size = Pt(10)
    p.font.color.rgb = COLOR_CARD_BORDER
    p.space_before = Pt(10)

    # Hanafi outcome
    p = tf.add_paragraph()
    p.text = "2. Under Hanafi Profile:\n   VERDICT: HARAM DETECTED\n   Classical rulings strictly prohibit land insect extracts for oral consumption."
    p.font.size = Pt(10)
    p.font.color.rgb = RGBColor(248, 113, 113)
    p.space_before = Pt(10)

    add_footer(slide5, 5)

    # =========================================================================
    # SLIDE 6: 1-Click Brand Inquiry Drawer
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide6)
    add_header(slide6, "06 // Consumer Empowerment", "1-Click Brand Inquiry: Resolving Sourcing Ambiguity", "Shifting consumers from passive confusion to active civic and manufacturer accountability.")

    # Left: Explanation Column
    inq_w = Inches(4.5)
    inq_h = Inches(4.1)
    add_card(slide6, Inches(0.8), Inches(2.2), inq_w, inq_h)
    tb = slide6.shapes.add_textbox(Inches(1.0), Inches(2.4), inq_w - Inches(0.4), inq_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "✉️ AUTOMATED CORPORATE EMAIL"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD
    p = tf.add_paragraph()
    p.text = "Pre-populates formal inquiries specifying exact E-codes, batch codes, and technical origin questions."
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(4)

    p = tf.add_paragraph()
    p.text = "🐦 280-CHAR PUBLIC X POST"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_MUTED
    p.space_before = Pt(12)
    p = tf.add_paragraph()
    p.text = "Generates concise social media posts querying brand handles to encourage public transparency."
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(4)

    p = tf.add_paragraph()
    p.text = "💡 ACTIONABLE IMPACT"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_CARD_BORDER
    p.space_before = Pt(12)
    p = tf.add_paragraph()
    p.text = "Empowers consumer voice and drives multinational brands to disclose plant vs. animal sourcing."
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_EMERALD_LIGHT
    p.space_before = Pt(4)

    # Right: Email Mockup Box
    d_w = Inches(6.8)
    d_h = Inches(4.1)
    add_card(slide6, Inches(5.7), Inches(2.2), d_w, d_h, RGBColor(10, 15, 15), COLOR_CARD_BORDER)
    tb = slide6.shapes.add_textbox(Inches(5.9), Inches(2.4), d_w - Inches(0.4), d_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "GENERATED BRAND INQUIRY DRAFT (Target: E471 Emulsifier)"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    p = tf.add_paragraph()
    p.text = "Subject: Inquiry Regarding Ingredient Sourcing for [Product Name]"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_CARD_BORDER
    p.space_before = Pt(8)

    p = tf.add_paragraph()
    p.text = "Dear Consumer Relations Team,\n\nI am writing to verify the origin of Mono- and diglycerides of fatty acids (E471) listed in your product. Could you clarify whether this emulsifier is derived from 100% vegetable oils or animal fats?\n\nAdditionally, could you confirm whether any alcohol processing aids or porcine enzymes are utilized in this manufacturing facility? Thank you."
    p.font.size = Pt(10)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(6)

    p = tf.add_paragraph()
    p.text = "[ Actions: 📋 Copy to Clipboard   |   ✉️ Launch Default Mail   |   🐦 Share on X ]"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD_LIGHT
    p.space_before = Pt(12)

    add_footer(slide6, 6)

    # =========================================================================
    # SLIDE 7: Institutional Compliance Certificate Dossier
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide7)
    add_header(slide7, "07 // Audit & Compliance", "Institutional Compliance Certificate Dossier", "Printable, audit-grade verification artifacts for consumers, retailers, and food importers.")

    # Left: Features
    c_w = Inches(4.5)
    c_h = Inches(4.1)
    add_card(slide7, Inches(0.8), Inches(2.2), c_w, c_h)
    tb = slide7.shapes.add_textbox(Inches(1.0), Inches(2.4), c_w - Inches(0.4), c_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "📜 LEGAL DIPLOMA LAYOUT"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD
    p = tf.add_paragraph()
    p.text = "Dedicated route at /certificate featuring parchment styling (#FCFBF8) and gold filigree border."
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(4)

    p = tf.add_paragraph()
    p.text = "🖨️ NATIVE PRINT ENGINE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_CARD_BORDER
    p.space_before = Pt(12)
    p = tf.add_paragraph()
    p.text = "Native print-to-PDF stylesheet, iOS Share Sheet, and Android print spooler ready."
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(4)

    p = tf.add_paragraph()
    p.text = "🔒 AUDIT LEDGER TRAIL"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_MUTED
    p.space_before = Pt(12)
    p = tf.add_paragraph()
    p.text = "Generates unique certificate UUIDs (TL-88421-2026) with local storage ledger persistence."
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(4)

    # Right: Parchment Certificate Mockup
    cert_w = Inches(6.8)
    cert_h = Inches(4.1)
    add_card(slide7, Inches(5.7), Inches(2.2), cert_w, cert_h, RGBColor(252, 251, 248), RGBColor(30, 58, 47))
    tb = slide7.shapes.add_textbox(Inches(5.9), Inches(2.4), cert_w - Inches(0.4), cert_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "TAQWALENS COMPLIANCE AUTHORITY"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = RGBColor(30, 58, 47)

    p = tf.add_paragraph()
    p.text = "Institutional Verification Dossier"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = RGBColor(30, 58, 47)
    p.font.name = "Georgia"

    p = tf.add_paragraph()
    p.text = "This official dossier certifies that the inspected food product:"
    p.font.size = Pt(10)
    p.font.italic = True
    p.font.color.rgb = RGBColor(71, 85, 105)
    p.space_before = Pt(6)

    p = tf.add_paragraph()
    p.text = "Artisan Oat Milk & Almond Crunch Bar (UPC: 890123456789)"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = RGBColor(30, 58, 47)
    p.space_before = Pt(4)

    p = tf.add_paragraph()
    p.text = "Verdict: HALAL VERIFIED  •  Juristic Profile: Standard Consensus\nDetected Certifications: JAKIM Halal Certified, IFANCA Verified"
    p.font.size = Pt(10)
    p.font.color.rgb = RGBColor(4, 120, 87)
    p.space_before = Pt(6)

    p = tf.add_paragraph()
    p.text = "Dossier ID: TL-88421-2026   •   Groq LPU + 370+ E-Code Engine Verification"
    p.font.size = Pt(9)
    p.font.color.rgb = RGBColor(100, 116, 139)
    p.space_before = Pt(10)

    add_footer(slide7, 7)

    # =========================================================================
    # SLIDE 8: Technical Architecture & Defensive Security
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide8)
    add_header(slide8, "08 // System Engineering", "Enterprise Full-Stack Architecture & Defensive Security", "Modern web stack hardened against GPU memory leaks, polyglot payloads, and unauthorized access.")

    # Two Main Columns
    b_w = Inches(5.6)
    b_h = Inches(4.1)

    # Left: Architecture Blueprint
    add_card(slide8, Inches(0.8), Inches(2.2), b_w, b_h)
    tb = slide8.shapes.add_textbox(Inches(1.0), Inches(2.4), b_w - Inches(0.4), b_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "📐 FULL-STACK TOPOLOGY"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    items = [
        ("Frontend Framework", "Next.js 14.2+ (App Router), React 18, TypeScript, Tailwind CSS"),
        ("3D Graphics Engine", "Three.js 0.161 with forceContextLoss() GPU lifecycle protection"),
        ("Backend Framework", "FastAPI 0.115 (Python 3.11+), Pydantic v2 declarative schemas"),
        ("Vision Ingestion", "Groq LPU (Llama 3.2 Vision) + Google Gemini 1.5 Flash fallback"),
        ("Barcode Resolution", "pyzbar 1D decoding + OpenFoodFacts International API")
    ]
    for k, v in items:
        p = tf.add_paragraph()
        p.text = f"• {k}: {v}"
        p.font.size = Pt(10)
        p.font.color.rgb = COLOR_WHITE
        p.space_before = Pt(8)

    # Right: Defensive Security Fortress
    add_card(slide8, Inches(6.9), Inches(2.2), b_w, b_h)
    tb = slide8.shapes.add_textbox(Inches(7.1), Inches(2.4), b_w - Inches(0.4), b_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "🛡️ DEFENSIVE SECURITY FORTRESS"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_CARD_BORDER

    sec_items = [
        ("Strict 10MB Ceiling", "Rejects oversized payloads with HTTP 413 to prevent RAM exhaustion."),
        ("Magic Byte Verification", "Pillow header parsing ensures genuine JPEG/PNG/WEBP streams."),
        ("Confidential Error Masking", "Zero internal stack traces or API keys leak to clients."),
        ("Strict CORS Whitelist", "Restricted strictly to authorized origins; no wildcards in production."),
        ("18/18 Automated Pytest Suite", "100% passing automated regression tests across all API endpoints.")
    ]
    for k, v in sec_items:
        p = tf.add_paragraph()
        p.text = f"• {k}: {v}"
        p.font.size = Pt(10)
        p.font.color.rgb = COLOR_WHITE
        p.space_before = Pt(8)

    add_footer(slide8, 8)

    # =========================================================================
    # SLIDE 9: Measurable KPIs & UN SDGs Impact
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide9)
    add_header(slide9, "09 // Impact & Sustainability", "Measurable Humanitarian Impact & UN SDGs Alignment", "Accelerating 5 United Nations Sustainable Development Goals through high-tech dietary intelligence.")

    # Left: Comparative KPIs
    k_w = Inches(4.5)
    k_h = Inches(4.1)
    add_card(slide9, Inches(0.8), Inches(2.2), k_w, k_h)
    tb = slide9.shapes.add_textbox(Inches(1.0), Inches(2.4), k_w - Inches(0.4), k_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "BEFORE VS. AFTER KPIS"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    kpis = [
        ("Mean Time to Audit (MTTA)", "15 min → 1.18s", "92% Reduction"),
        ("E-Code Coverage", "~5 codes → 370+ Additives", "Universal Taxonomy"),
        ("Mushbooh Resolution", "Doubt → 1-Click Inquiry", "Direct Brand Recourse"),
        ("Infrastructure Cost", "$$$ → $0 Serverless", "Zero-Cost Cloud SLA")
    ]
    for metric, change, sub in kpis:
        p = tf.add_paragraph()
        p.text = f"{metric}:\n{change} ({sub})"
        p.font.size = Pt(10)
        p.font.color.rgb = COLOR_WHITE
        p.space_before = Pt(8)

    # Right: 5 SDGs Matrix
    s_w = Inches(6.8)
    s_h = Inches(4.1)
    add_card(slide9, Inches(5.7), Inches(2.2), s_w, s_h)
    tb = slide9.shapes.add_textbox(Inches(5.9), Inches(2.4), s_w - Inches(0.4), s_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "UNITED NATIONS SDGS ALIGNMENT"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_CARD_BORDER

    sdgs = [
        ("SDG 3: Good Health & Well-Being", "Target 3.9: Allergen & toxic chemical preservative screening alongside Halal checks."),
        ("SDG 12: Responsible Consumption", "Target 12.8: Demanding corporate disclosure on plant vs. animal additive origins."),
        ("SDG 9: Industry & Innovation", "Target 9.c: Democratizing access to ultra-fast sub-second AI inference on low-cost devices."),
        ("SDG 16: Peace, Justice & Institutions", "Target 16.6: Countering counterfeit Halal badges and fraudulent packaging claims."),
        ("SDG 17: Partnerships for the Goals", "Target 17.16: Harmonizing standards across JAKIM, IFANCA & SANHA.")
    ]
    for title, desc in sdgs:
        p = tf.add_paragraph()
        p.text = f"• {title}:\n  {desc}"
        p.font.size = Pt(9.5)
        p.font.color.rgb = COLOR_WHITE
        p.space_before = Pt(6)

    add_footer(slide9, 9)

    # =========================================================================
    # SLIDE 10: Strategic Horizon & Future Roadmap
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide10)
    add_header(slide10, "10 // Strategic Horizon", "The Future of Halal Tech: Roadmap to Global Scale", "From individual supermarket scanner to global institutional food supply chain verification.")

    # 3 Evolution Phases
    r_w = Inches(3.7)
    r_h = Inches(3.2)
    y_r = Inches(2.2)

    # Phase 2
    add_card(slide10, Inches(0.8), y_r, r_w, r_h)
    tb = slide10.shapes.add_textbox(Inches(1.0), y_r + Inches(0.2), r_w - Inches(0.4), r_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "PHASE 2 // NEAR-TERM"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD
    p = tf.add_paragraph()
    p.text = "Offline Edge & IoT Model"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(4)
    p = tf.add_paragraph()
    p.text = "On-device quantized vision models (WebAssembly / ONNX) for zero-latency scanning in basement grocery aisles with zero cellular connectivity."
    p.font.size = Pt(10.5)
    p.font.color.rgb = COLOR_EMERALD_LIGHT
    p.space_before = Pt(6)

    # Phase 3
    add_card(slide10, Inches(4.8), y_r, r_w, r_h)
    tb = slide10.shapes.add_textbox(Inches(5.0), y_r + Inches(0.2), r_w - Inches(0.4), r_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "PHASE 3 // MEDIUM-TERM"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = COLOR_CARD_BORDER
    p = tf.add_paragraph()
    p.text = "Global Body Federation"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(4)
    p = tf.add_paragraph()
    p.text = "Direct API synchronization with official regulatory registries (JAKIM e-Halal, BPJPH Indonesia) with cryptographic certificate validation."
    p.font.size = Pt(10.5)
    p.font.color.rgb = COLOR_EMERALD_LIGHT
    p.space_before = Pt(6)

    # Phase 4
    add_card(slide10, Inches(8.8), y_r, r_w, r_h)
    tb = slide10.shapes.add_textbox(Inches(9.0), y_r + Inches(0.2), r_w - Inches(0.4), r_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "PHASE 4 // LONG-TERM"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD_LIGHT
    p = tf.add_paragraph()
    p.text = "Supply Chain ERP Connector"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(4)
    p = tf.add_paragraph()
    p.text = "B2B bulk specification sheet auditor parsing multi-page supplier PDFs/CSVs for international food importers and airline catering."
    p.font.size = Pt(10.5)
    p.font.color.rgb = COLOR_EMERALD_LIGHT
    p.space_before = Pt(6)

    # Bottom Call to action strip
    c_strip = add_card(slide10, Inches(0.8), Inches(5.6), Inches(11.733), Inches(1.0), RGBColor(6, 60, 45), COLOR_GOLD)
    tb_c = slide10.shapes.add_textbox(Inches(1.0), Inches(5.7), Inches(11.3), Inches(0.8))
    tf = tb_c.text_frame
    p = tf.paragraphs[0]
    p.text = "EXPERIENCE TAQWALENS LIVE"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD
    p = tf.add_paragraph()
    p.text = "Open Source Repository: github.com/lizzz-dev/taqwalens   •   Live Web App: taqwalens.vercel.app"
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(4)

    add_footer(slide10, 10, note="TaqwaLens Core Engineering Team // Final Approved Presentation")

    # Save file
    output_filename = "TaqwaLens_Presentation.pptx"
    prs.save(output_filename)
    print(f"Successfully generated {output_filename} with 10 widescreen slides!")

if __name__ == "__main__":
    create_presentation()
