#!/usr/bin/env python3
"""Crop Marvel-style episode title lockups from the A4 sheet."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops

Image.MAX_IMAGE_PIXELS = None

SRC = Path("/Users/heewon/Downloads/A4 - 380.png")
OUT = Path("/Users/heewon/Documents/GitHub/kingdom/static/titles")
THUMB_W, THUMB_H = 1200, 1327

# Boxes on the 1200×1327 thumbnail (x0, y0, x1, y1). Headers excluded.
# Loyalists / Bihyung / Tamla stacks are split by hand from the grouped blobs.
CROPS: dict[str, tuple[int, int, int, int]] = {
    # Hwarang
    "sadaham-ko": (56, 114, 216, 194),
    "sadaham-en": (222, 85, 408, 200),
    # Standalone
    "momal-ko": (60, 300, 217, 386),
    "momal-en": (231, 269, 402, 391),
    # Jumong
    "jumong-ko": (65, 501, 208, 652),
    "jumong-en": (212, 507, 485, 635),
    "onjo-ko": (73, 658, 194, 793),
    "onjo-en": (237, 658, 444, 787),
    # Bihyung
    "bihyung-ko": (62, 870, 209, 948),
    "bihyung-en": (231, 873, 397, 943),
    "yongsu-ko": (62, 960, 209, 1028),
    "yongsu-en": (237, 969, 394, 1034),
    # Gaya
    "suro-ko": (512, 100, 666, 201),
    "suro-en": (694, 113, 842, 187),
    "muryuk-ko": (512, 205, 665, 301),
    "muryuk-en": (692, 210, 844, 284),
    "seohyun-ko": (512, 304, 666, 402),
    "seohyun-en": (685, 305, 850, 379),
    # Loyalists — English thirds of the stacked lockup
    "sunchung-en": (683, 480, 852, 555),
    "hungsu-en": (683, 555, 852, 630),
    "gyebek-en": (683, 630, 852, 704),
    # Tamla
    "kangrim-ko": (511, 768, 666, 868),
    "kangrim-en": (669, 779, 878, 880),
    "hallakgungi-ko": (511, 880, 666, 967),
    "hallakgungi-en": (691, 885, 874, 976),
    "heaven-earth-ko": (512, 983, 672, 1081),
    "heaven-earth-en": (692, 995, 871, 1123),
}

PAD_THUMB = 2
MAX_EDGE = 1800
BLACK = 22
SOFT = 38


def knockout(im: Image.Image) -> Image.Image:
    """Near-black sheet background → transparent. Keeps dark reds (the bow)."""
    rgba = im.convert("RGBA")
    r, g, b, _ = rgba.split()
    brightest = ImageChops.lighter(ImageChops.lighter(r, g), b)
    alpha = brightest.point(
        lambda p: 0
        if p <= BLACK
        else 255
        if p >= SOFT
        else int(255 * (p - BLACK) / (SOFT - BLACK))
    )
    rgba.putalpha(alpha)
    return rgba


def trim(im: Image.Image, margin: int = 8) -> Image.Image:
    alpha = im.split()[-1]
    box = alpha.getbbox()
    if not box:
        return im
    x0, y0, x1, y1 = box
    x0 = max(0, x0 - margin)
    y0 = max(0, y0 - margin)
    x1 = min(im.width, x1 + margin)
    y1 = min(im.height, y1 + margin)
    return im.crop((x0, y0, x1, y1))


def fit(im: Image.Image) -> Image.Image:
    if max(im.size) <= MAX_EDGE:
        return im
    im.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
    return im


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    src = Image.open(SRC)
    sw, sh = src.size
    sx = sw / THUMB_W
    sy = sh / THUMB_H
    print(f"source {sw}×{sh}  scale {sx:.3f}×{sy:.3f}")

    # Korean loyalist stack: hangul is so large the thumb-thirds cut neighbours.
    ko_stack_box = (
        int(532 * sx),
        int(487 * sy),
        int(646 * sx),
        int(685 * sy),
    )
    ko_stack = src.crop(ko_stack_box)
    loyalist_ko = {
        "sunchung-ko": (0, 190, ko_stack.width, 1220),
        "hungsu-ko": (0, 1510, ko_stack.width, 1768),
        "gyebek-ko": (0, 1768, ko_stack.width, ko_stack.height),
    }
    for name, box in loyalist_ko.items():
        out = fit(trim(knockout(ko_stack.crop(box))))
        path = OUT / f"{name}.png"
        out.save(path, "PNG", optimize=True)
        print(f"  {name:22} {out.size[0]:4}×{out.size[1]:<4}  {path.stat().st_size // 1024}kb")

    for name, (x0, y0, x1, y1) in CROPS.items():
        x0 = max(0, x0 - PAD_THUMB)
        y0 = max(0, y0 - PAD_THUMB)
        x1 = min(THUMB_W, x1 + PAD_THUMB)
        y1 = min(THUMB_H, y1 + PAD_THUMB)
        box = (
            int(x0 * sx),
            int(y0 * sy),
            int(x1 * sx),
            int(y1 * sy),
        )
        crop = src.crop(box)
        out = fit(trim(knockout(crop)))
        path = OUT / f"{name}.png"
        out.save(path, "PNG", optimize=True)
        print(f"  {name:22} {out.size[0]:4}×{out.size[1]:<4}  {path.stat().st_size // 1024}kb")


if __name__ == "__main__":
    main()
