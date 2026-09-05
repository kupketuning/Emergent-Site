"""Serverseitige Bildverarbeitung: halbtransparentes Logo-Wasserzeichen."""
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

FONT_PATH = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
WATERMARK_TEXT = "KUPKE-TUNING"


def apply_watermark(content: bytes, content_type: str):
    """Fügt ein halbtransparentes Wasserzeichen unten rechts ein.
    Gibt (neuer_inhalt, content_type) zurück. Bei Nicht-Bildern unverändert."""
    if not (content_type or "").lower().startswith("image/"):
        return content, content_type
    try:
        img = Image.open(BytesIO(content)).convert("RGBA")
    except Exception:
        return content, content_type

    w, h = img.size
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    font_size = max(16, int(w * 0.055))
    try:
        font = ImageFont.truetype(FONT_PATH, font_size)
    except Exception:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), WATERMARK_TEXT, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    margin = int(w * 0.03)
    x = w - tw - margin
    y = h - th - margin - bbox[1]
    # Schatten + Text (halbtransparent)
    draw.text((x + 2, y + 2), WATERMARK_TEXT, font=font, fill=(0, 0, 0, 90))
    draw.text((x, y), WATERMARK_TEXT, font=font, fill=(255, 255, 255, 125))

    out = Image.alpha_composite(img, overlay)

    ctl = (content_type or "").lower()
    if "jpeg" in ctl or "jpg" in ctl:
        out = out.convert("RGB")
        fmt, ct = "JPEG", "image/jpeg"
    elif "webp" in ctl:
        fmt, ct = "WEBP", "image/webp"
    else:
        fmt, ct = "PNG", "image/png"

    buf = BytesIO()
    out.save(buf, format=fmt)
    buf.seek(0)
    return buf.read(), ct
