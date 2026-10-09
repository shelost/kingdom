# GenerateImage accepts one small reference image, so several refs go side by side on one sheet.
# Usage: python3 scripts/.cache/emo/sheet.py <out.jpg> <ref> [ref…]   (refs relative to static/, e.g. ch_munmu.png)
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
HEIGHT = 384
MAX_W = 960

out, refs = sys.argv[1], sys.argv[2:]
tiles = []
for ref in refs:
    im = Image.open(ROOT / 'static' / ref.lstrip('/'))
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, 'white')
        bg.paste(im, mask=im.split()[-1])
        im = bg
    im = im.convert('RGB')
    scale = min(HEIGHT / im.height, HEIGHT / im.width) if im.width > im.height else HEIGHT / im.height
    tiles.append(im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS))

sheet = Image.new('RGB', (sum(t.width for t in tiles) + 8 * (len(tiles) - 1), HEIGHT), 'white')
x = 0
for t in tiles:
    sheet.paste(t, (x, (HEIGHT - t.height) // 2))
    x += t.width + 8
if sheet.width > MAX_W:
    sheet = sheet.resize((MAX_W, round(HEIGHT * MAX_W / sheet.width)), Image.LANCZOS)
sheet.save(out, 'JPEG', quality=80)
print(out, sheet.size, Path(out).stat().st_size)
