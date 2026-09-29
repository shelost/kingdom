/**
 * Move `scene_<id>_<n>.png` from the Cursor assets folder into
 * `static/scene_<id>_<n>.jpg` and append it to that scene's `frames` in scenes.ts.
 * Usage: node scripts/.cache/install-scene-stills.mjs [n=2]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const STATIC = path.resolve('static');
const SCENES = path.resolve('src/lib/scenes.ts');

const N = /^\d+$/.test(process.argv[2] ?? '') ? process.argv[2] : '2';
const FILE_RE = new RegExp(`^scene_[\\w-]+_${N}\\.png$`);

let text = fs.readFileSync(SCENES, 'utf8');
const files = fs.readdirSync(ASSETS).filter((f) => FILE_RE.test(f));
const done = [];
const missing = [];

for (const file of files) {
	const id = file.replace(/^scene_/, '').replace(new RegExp(`_${N}\\.png$`), '');
	const marker = `\t\tid: '${id}',`;
	const start = text.indexOf(marker);
	if (start < 0) {
		missing.push(id);
		continue;
	}
	const out = `scene_${id}_${N}.jpg`;
	execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '84', path.join(ASSETS, file), '--out', path.join(STATIC, out)], { stdio: 'ignore' });

	const nextScene = text.indexOf("\n\t\tid: '", start + marker.length);
	const end = nextScene < 0 ? text.length : nextScene;
	let block = text.slice(start, end);
	const src = `/${out}`;
	if (block.includes(`'${src}'`)) {
		fs.rmSync(path.join(ASSETS, file));
		continue;
	}
	const multi = block.match(/frames: \[(\n[\s\S]*?)\n\t\t\]/);
	const single = block.match(/frames: \[([^\n\]]+)\]/);
	if (multi) {
		block = block.replace(multi[0], `frames: [${multi[1]},\n\t\t\t'${src}'\n\t\t]`);
	} else if (single) {
		block = block.replace(single[0], `frames: [${single[1]}, '${src}']`);
	} else {
		const image = block.match(/\t\timage: '([^']+)',\n/);
		if (!image) {
			missing.push(id);
			continue;
		}
		block = block.replace(
			image[0],
			`${image[0]}\t\tframes: [\n\t\t\t'${image[1]}',\n\t\t\t'${src}'\n\t\t],\n`
		);
	}
	text = text.slice(0, start) + block + text.slice(end);
	fs.rmSync(path.join(ASSETS, file));
	done.push(id);
}

fs.writeFileSync(SCENES, text);
console.log(`installed ${done.length}`);
if (missing.length) console.log('missing scene ids:', missing.join(', '));
