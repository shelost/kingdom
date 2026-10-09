"""Contact sheet of generated intro stills, for review before install.

    python3 scripts/.cache/intro-stills/contact.py <name> <key…>   (or a slice file: slice-3.txt)
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont

ASSETS = os.path.expanduser('~/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets')
HERE = os.path.dirname(os.path.abspath(__file__))
W, H, COLS = 400, 200, 4

name, *args = sys.argv[1:]
keys = []
for a in args:
    path = os.path.join(HERE, a)
    keys += [k.strip() for k in open(path) if k.strip()] if a.endswith('.txt') else [a]
keys = [k for k in keys if os.path.exists(os.path.join(ASSETS, f'{k}.jpg'))]
rows = (len(keys) + COLS - 1) // COLS
sheet = Image.new('RGB', (COLS * W, rows * (H + 22)), (12, 12, 12))
draw = ImageDraw.Draw(sheet)
font = ImageFont.load_default()
for i, key in enumerate(keys):
    im = Image.open(os.path.join(ASSETS, f'{key}.jpg')).convert('RGB')
    top = (im.height - im.width // 2) // 2
    im = im.crop((0, top, im.width, top + im.width // 2)).resize((W, H), Image.LANCZOS)
    x, y = (i % COLS) * W, (i // COLS) * (H + 22)
    sheet.paste(im, (x, y))
    draw.text((x + 4, y + H + 4), key, fill=(230, 230, 230), font=font)
out = os.path.join(HERE, f'contact-{name}.jpg')
sheet.save(out, 'JPEG', quality=82)
print(out, len(keys))
