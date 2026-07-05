from PIL import Image, ImageDraw, ImageFont
import os

sizes = [16, 48, 128]

for size in sizes:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Dark background circle
    draw.ellipse([0, 0, size-1, size-1], fill="#161b22")

    # Border
    draw.ellipse([1, 1, size-2, size-2], outline="#388bfd", width=max(1, size//16))

    # ✦ symbol
    font_size = int(size * 0.5)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", font_size)
    except:
        font = ImageFont.load_default()

    text = "✦"
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    x = (size - w) // 2
    y = (size - h) // 2
    draw.text((x, y), text, fill="#58a6ff", font=font)

    img.save(f"icon{size}.png")
    print(f"Created icon{size}.png")

print("Done!")
