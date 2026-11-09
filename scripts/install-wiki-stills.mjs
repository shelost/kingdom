// Installs generated art as wiki gallery stills: centre-crops to 2:1, compresses into static/civ,
// and prints the `stills` paths per profile so they can be listed on the entry.
// Usage: node scripts/install-wiki-stills.mjs <id> [<id>…]
// Each id is a generated file `<id>.(png|jpg)` in the conversation assets folder; the source is deleted.
import fs from 'node:fs';
import os from 'node:os';
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
	const r2 = execFileSync(process.execPath, ['scripts/r2.mjs', 'status'], { encoding: 'utf8' }).trim();
	let url = '';
	if (r2 === 'ready') {
		const thumb = path.join(os.tmpdir(), `kingdom-civ-${id}-256.jpg`);
		execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', QUALITY, '-Z', '256', out, '--out', thumb], {
			stdio: 'ignore'
		});
		url = execFileSync(process.execPath, ['scripts/r2.mjs', 'put', `civ/${id}.jpg`, out], { encoding: 'utf8' }).trim();
		if (url) {
			execFileSync(process.execPath, ['scripts/r2.mjs', 'put', `civ/${id}-256.jpg`, thumb], { encoding: 'utf8' });
		}
		fs.rmSync(thumb, { force: true });
	}
	console.log(url || `/civ/${id}.jpg`);
}
