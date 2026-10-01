// static/flag_*.svg → static/flag_*.png (768×512) so GenerateImage can take kingdom flags as refs.
// macOS only: sips rasterizes SVG at the svg's own width/height, so the copy is scaled up first.
// CLI: node scripts/rasterize-flags.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const STATIC = fileURLToPath(new URL('../static/', import.meta.url));
const W = 768;
const H = 512;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'flags-'));
const svgs = fs.readdirSync(STATIC).filter((f) => /^flag_[\w-]+\.svg$/.test(f));

for (const file of svgs) {
	const scaled = fs
		.readFileSync(STATIC + file, 'utf8')
		.replace(/<svg([^>]*?)\swidth="[\d.]+"\s+height="[\d.]+"/, `<svg$1 width="${W}" height="${H}"`);
	const src = path.join(tmp, file);
	fs.writeFileSync(src, scaled);
	const out = STATIC + file.replace(/\.svg$/, '.png');
	execFileSync('sips', ['-s', 'format', 'png', src, '--out', out], { stdio: 'ignore' });
	console.log(`wrote static/${path.basename(out)}`);
}

fs.rmSync(tmp, { recursive: true, force: true });
