// Grid of busts for an ensemble GenerateImage sheet (one image, <45 KB).
// Usage: node scripts/.cache/ensemble-grid.mjs <name> <cols> <ref> [ref…]
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const OUT = join(ROOT, 'scripts/.cache/refs-small');
const LIMIT = 45_000;

const PY = `
import sys
from PIL import Image, ImageChops
import os
out, limit, cols, bust, refs = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), float(sys.argv[4]), sys.argv[5:]
CELL = 160
tiles = []
for ref in refs:
    im = Image.open(ref)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, 'white')
        bg.paste(im, mask=im.split()[-1])
        im = bg
    im = im.convert('RGB')
    if os.path.basename(ref).startswith('ch_'):
        box = ImageChops.difference(im, Image.new('RGB', im.size, 'white')).convert('L').point(lambda v: 255 if v > 24 else 0).getbbox()
        if box:
            im = im.crop(box)
        im = im.crop((0, 0, im.width, max(1, round(im.height * bust))))
    # square-ish bust
    side = min(im.width, im.height)
    im = im.crop(((im.width - side) // 2, 0, (im.width - side) // 2 + side, side))
    tiles.append(im.resize((CELL, CELL), Image.LANCZOS))
rows = (len(tiles) + cols - 1) // cols
sheet = Image.new('RGB', (cols * CELL + 4 * (cols - 1), rows * CELL + 4 * (rows - 1)), 'white')
for i, t in enumerate(tiles):
    r, c = divmod(i, cols)
    sheet.paste(t, (c * (CELL + 4), r * (CELL + 4)))
width, quality = min(sheet.width, 1024), 82
while True:
    im = sheet.resize((width, round(sheet.height * width / sheet.width)), Image.LANCZOS)
    im.save(out, 'JPEG', quality=quality)
    if os.path.getsize(out) <= limit or width <= 320:
        break
    if quality > 50:
        quality -= 8
    else:
        width = round(width * 0.88)
print(os.path.getsize(out), im.size[0], im.size[1], rows, cols, len(tiles))
`;

const [name, colsStr, ...refs] = process.argv.slice(2);
const cols = Number(colsStr);
if (!name || !cols || !refs.length) {
	console.error('usage: node scripts/.cache/ensemble-grid.mjs <name> <cols> <ref>…');
	process.exit(1);
}
const files = refs.map((ref) => {
	const p = join(ROOT, 'static', ref.replace(/^\//, ''));
	if (!existsSync(p) || !statSync(p).isFile()) {
		console.error('missing', ref);
		process.exit(1);
	}
	return p;
});
mkdirSync(OUT, { recursive: true });
const dest = join(OUT, `${name}.jpg`);
execFileSync('python3', ['-c', PY, dest, String(LIMIT), String(cols), '0.48', ...files], { stdio: 'inherit' });
console.log(dest);
