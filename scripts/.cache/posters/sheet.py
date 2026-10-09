"""Two-row ref sheet: faces/boards on top (ch_* cropped to the bust), the sword board full-width underneath.
GenerateImage takes one reference under ~45 KB, and small-refs.mjs lays everything in one row,
where the long sword board shrinks the faces.

    python3 scripts/.cache/posters/sheet.py <name> <ref> [ref…] [--sword]
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
    im = Image.open(os.path.join(STATIC, name.lstrip('/')))
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


args = sys.argv[1:]
sword = '--sword' in args
name, *refs = [a for a in args if a != '--sword']
tiles = []
for ref in refs:
    im = load(ref, os.path.basename(ref).startswith('ch_'))
    tiles.append(im.resize((round(im.width * H / im.height), H), Image.LANCZOS))
width = sum(t.width for t in tiles) + 8 * (len(tiles) - 1)
height = H
if sword:
    sw = load('sw_bidam.png', False)
    sw = sw.resize((width, round(sw.height * width / sw.width)), Image.LANCZOS)
    height += 8 + sw.height
sheet = Image.new('RGB', (width, height), 'white')
x = 0
for t in tiles:
    sheet.paste(t, (x, 0))
    x += t.width + 8
if sword:
    sheet.paste(sw, (0, H + 8))

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
