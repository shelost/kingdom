"""Two-row ref sheet: faces/boards on top (ch_* cropped to the bust), the sword board full-width underneath.
GenerateImage takes one reference under ~45 KB, and small-refs.mjs lays everything in one row,
where the long sword board shrinks the faces.

    python3 scripts/.cache/posters/sheet.py <name> <face…> [--row <board…>] [--sword]

Refs after --row go on a smaller second row (place boards, costume charts, hat boards).
"""
import os
import sys
from PIL import Image, ImageChops

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
STATIC = os.path.join(ROOT, 'static')
OUT = os.path.join(ROOT, 'scripts/.cache/refs-small')
LIMIT = 45_000
H = 300


def load(name, bust):
    im = Image.open(name if os.path.isabs(name) and os.path.exists(name) else os.path.join(STATIC, name.lstrip('/')))
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, 'white')
        bg.paste(im, mask=im.split()[-1])
        im = bg
    im = im.convert('RGB')
    if bust:
        box = ImageChops.difference(im, Image.new('RGB', im.size, 'white')).convert('L').point(lambda v: 255 if v > 24 else 0).getbbox()
        if box:
            im = im.crop(box)
        im = im.crop((0, 0, im.width, round(im.height * 0.5)))
    return im


def row(refs, h):
    tiles = []
    for ref in refs:
        im = load(ref, os.path.basename(ref).startswith('ch_'))
        tiles.append(im.resize((round(im.width * h / im.height), h), Image.LANCZOS))
    return tiles


def row_width(tiles):
    return sum(t.width for t in tiles) + 8 * (len(tiles) - 1) if tiles else 0


args = sys.argv[1:]
sword = '--sword' in args
name, *refs = [a for a in args if a != '--sword']
split = refs.index('--row') if '--row' in refs else len(refs)
top, bottom = refs[:split], refs[split + 1:]
rows = [r for r in (row(top, H), row(bottom, round(H * 0.6))) if r]
width = max(row_width(r) for r in rows)
height = sum(r[0].height for r in rows) + 8 * (len(rows) - 1)
if sword:
    sw = load('sw_bidam.png', False)
    sw = sw.resize((width, round(sw.height * width / sw.width)), Image.LANCZOS)
    height += 8 + sw.height
sheet = Image.new('RGB', (width, height), 'white')
y = 0
for r in rows:
    x = 0
    for t in r:
        sheet.paste(t, (x, y))
        x += t.width + 8
    y += r[0].height + 8
if sword:
    sheet.paste(sw, (0, y))

os.makedirs(OUT, exist_ok=True)
dest = os.path.join(OUT, f'{name}.jpg')
w, q = min(width, 960), 80
while True:
    im = sheet.resize((w, round(height * w / width)), Image.LANCZOS)
    im.save(dest, 'JPEG', quality=q)
    if os.path.getsize(dest) <= LIMIT or w <= 240:
        break
    if q > 55:
        q -= 10
    else:
        w = round(w * 0.85)
print(dest)
