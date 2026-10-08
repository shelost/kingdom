#!/usr/bin/env node
/**
 * GenerateImage accepts ONE reference image, under ~45 KB; anything larger, or a second
 * ref, fails with "Unable to generate an image from this description". This lays the
 * given refs side by side on one sheet (left to right, in argument order), shrinks it
 * under the limit, and prints its absolute path for `reference_image_paths`.
 * Name the faces by position in the prompt ("LEFT face of the sheet = …").
 * `--bust` crops each ch_* portrait to head and chest, so faces stay large enough to copy.
 *
 *   node scripts/small-refs.mjs sadaham-rope-cut /ch_sadaham.png /ch_mugwan.png
 *   node scripts/small-refs.mjs --bust rel-yushin-sunduk /ch_kim_yushin.png /ch_sunduk.png
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const OUT = join(ROOT, 'scripts/.cache/refs-small');
const LIMIT = 45_000;

const SHEET_PY = `
import sys
from PIL import Image, ImageChops
import os
out, limit, bust, refs = sys.argv[1], int(sys.argv[2]), float(sys.argv[3]), sys.argv[4:]
H = 384
tiles = []
for ref in refs:
    im = Image.open(ref)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, 'white')
        bg.paste(im, mask=im.split()[-1])
        im = bg
    im = im.convert('RGB')
    if bust and os.path.basename(ref).startswith('ch_'):
        box = ImageChops.difference(im, Image.new('RGB', im.size, 'white')).convert('L').point(lambda v: 255 if v > 24 else 0).getbbox()
        if box:
            im = im.crop(box)
        im = im.crop((0, 0, im.width, round(im.height * bust)))
    tiles.append(im.resize((round(im.width * H / im.height), H), Image.LANCZOS))
sheet = Image.new('RGB', (sum(t.width for t in tiles) + 8 * (len(tiles) - 1), H), 'white')
x = 0
for t in tiles:
    sheet.paste(t, (x, 0))
    x += t.width + 8
width, quality = min(sheet.width, 960), 80
while True:
    im = sheet.resize((width, round(H * width / sheet.width)), Image.LANCZOS)
    im.save(out, 'JPEG', quality=quality)
    if os.path.getsize(out) <= limit or width <= 240:
        break
    if quality > 55:
        quality -= 10
    else:
        width = round(width * 0.85)
`;

function locate(ref) {
	const candidates = isAbsolute(ref) ? [ref, join(ROOT, 'static', ref)] : [resolve(ROOT, ref), join(ROOT, 'static', ref)];
	return candidates.find((p) => existsSync(p) && statSync(p).isFile());
}

const argv = process.argv.slice(2);
const bust = argv.includes('--bust') ? 0.5 : 0;
const [name, ...refs] = argv.filter((a) => a !== '--bust');
if (!name || !refs.length) {
	console.error('usage: node scripts/small-refs.mjs [--bust] <sheet-name> <ref> [ref…]');
	process.exit(1);
}
const files = refs.map((ref) => {
	const file = locate(ref);
	if (!file) {
		console.error(`missing: ${ref}`);
		process.exit(1);
	}
	return file;
});

mkdirSync(OUT, { recursive: true });
const dest = join(OUT, `${name}.jpg`);
execFileSync('python3', ['-c', SHEET_PY, dest, String(LIMIT), String(bust), ...files], { stdio: 'inherit' });
console.log(dest);
