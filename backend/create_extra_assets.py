import os
from PIL import Image, ImageDraw

out_dir = r"c:\Windows\System32\taqwalens\backend\assets_presentation"
os.makedirs(out_dir, exist_ok=True)

# 1. Generate Email & Tweet Mockup Component for Slide 8
w, h = 900, 520
img_inq = Image.new("RGBA", (w, h), (255, 255, 255, 255))
draw = ImageDraw.Draw(img_inq)

# Outer card border
draw.rounded_rectangle([(2, 2), (w-3, h-3)], radius=16, fill=(255, 255, 255), outline=(226, 232, 240), width=2)

# Email Header tab
draw.rounded_rectangle([(20, 20), (w-20, 65)], radius=8, fill=(248, 250, 252), outline=(226, 232, 240), width=1)
draw.text((35, 32), "EMAIL COMPOSER // READY-TO-SEND CORPORATE INQUIRY", fill=(6, 95, 70))

# Email Fields
draw.text((35, 80), "To: customer.relations@brand.com", fill=(100, 116, 139))
draw.text((35, 105), "Subject: Dietary Origin Inquiry: Mono- and Diglycerides (E471) in Product Batch #4091", fill=(15, 23, 42))
draw.line([(35, 135), (w-35, 135)], fill=(226, 232, 240), width=1)

body_lines = [
    "Dear Consumer Care Team,",
    "",
    "I am writing to respectfully request clarification regarding the specific sourcing of the following",
    "ingredient listed on the packaging of your product (Batch #4091):",
    "",
    "  • Mono- and Diglycerides of Fatty Acids (E471 / INS 471)",
    "",
    "Could you please confirm whether this emulsifier is derived from 100% plant/vegetable origins",
    "or if it contains animal tallow/fats? Furthermore, are any alcohol processing solvents utilized?",
    "",
    "Thank you for your transparency in assisting dietary-conscious and Halal-observant consumers."
]
y_text = 150
for line in body_lines:
    draw.text((35, y_text), line, fill=(51, 65, 85))
    y_text += 20

# Tweet Box at bottom
draw.rounded_rectangle([(20, 420), (w-20, 500)], radius=10, fill=(236, 253, 245), outline=(167, 243, 208), width=1)
draw.text((35, 430), "PUBLIC 280-CHAR TWEET DRAFT (1-CLICK COPY / LAUNCH):", fill=(4, 120, 87))
draw.text((35, 455), '"Hi @BrandCare! Could you please clarify if the E471 in [Product] is 100% plant-derived or animal-sourced? Seeking dietary verification. Thank you! #HalalVerification #TaqwaLens"', fill=(15, 23, 42))

img_inq.save(os.path.join(out_dir, "inquiry_mockup.png"))
print("Saved inquiry_mockup.png")

# 2. Companion crop from media_1791070189027.png
user_dir = r"C:\Users\dell\.gemini\antigravity-ide\brain\cab0e92e-62bf-447b-b413-7c94765680f2\.user_uploaded"
comp_path = os.path.join(user_dir, "media_1791070189027.png")
if os.path.exists(comp_path):
    img_comp = Image.open(comp_path)
    comp_crop = img_comp.crop((120, 80, 780, 580))
    comp_crop.save(os.path.join(out_dir, "companion_crop.png"))
    print("Saved companion_crop.png")
