// Installs generated art as wiki gallery stills: centre-crops to 2:1, compresses into static/civ,
// and prints the `stills` paths per profile so they can be listed on the entry.
// Usage: node scripts/install-wiki-stills.mjs <id> [<id>…]
// Each id is a generated file `<id>.(png|jpg)` in the conversation assets folder; the source is deleted.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { cropArgs } from './crop-ratio.mjs';

const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const OUT_DIR = 'static/civ';
const QUALITY = '72';
const MAX_EDGE = '1400';

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const id of process.argv.slice(2)) {
	const src = ['png', 'jpg', 'jpeg'].map((ext) => path.join(ASSETS, `${id}.${ext}`)).find((f) => fs.existsSync(f));
	if (!src) {
		console.error(`missing ${id}`);
		continue;
	}
	const out = path.join(OUT_DIR, `${id}.jpg`);
	execFileSync('sips', [...cropArgs(src, 2), '-s', 'format', 'jpeg', src, '--out', out], { stdio: 'ignore' });
	execFileSync('sips', ['-Z', MAX_EDGE, '-s', 'formatOptions', QUALITY, out], { stdio: 'ignore' });
	fs.unlinkSync(src);
	console.log(`/civ/${id}.jpg`);
}
