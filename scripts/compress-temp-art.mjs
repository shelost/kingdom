// One-off: re-encodes static/temp PNG stand-ins as JPEG and repoints story.json at them.
// Placeholder art is display-only, so lossy compression buys back ~80% of the disk it was using.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const TEMP_DIR = 'static/temp';
const STORY = 'src/lib/data/story.json';
const QUALITY = '78';

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const pngs = fs.readdirSync(TEMP_DIR).filter((f) => f.endsWith('.png'));

let before = 0;
let after = 0;
for (const file of pngs) {
	const source = path.join(TEMP_DIR, file);
	const out = source.replace(/\.png$/, '.jpg');
	before += fs.statSync(source).size;
	execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', QUALITY, source, '--out', out], {
		stdio: 'ignore'
	});
	after += fs.statSync(out).size;
	fs.rmSync(source);
}

let repointed = 0;
for (const ch of Object.values(story)) {
	for (const en of ch.entries ?? []) {
		for (const im of en.images ?? []) {
			if (typeof im.tempImage !== 'string') continue;
			if (!im.tempImage.startsWith('/temp/') || !im.tempImage.endsWith('.png')) continue;
			im.tempImage = im.tempImage.replace(/\.png$/, '.jpg');
			repointed++;
		}
	}
}
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });

const mb = (n) => (n / 1024 / 1024).toFixed(1) + 'MB';
console.log(`converted ${pngs.length} files: ${mb(before)} -> ${mb(after)} (freed ${mb(before - after)})`);
console.log(`repointed ${repointed} tempImage paths`);

let broken = 0;
for (const ch of Object.values(story)) {
	for (const en of ch.entries ?? []) {
		for (const im of en.images ?? []) {
			if (im.tempImage && !fs.existsSync(path.join('static', im.tempImage.replace(/^\//, '')))) {
				broken++;
				console.log(`  BROKEN: ${im.id} -> ${im.tempImage}`);
			}
		}
	}
}
console.log(`broken tempImage paths: ${broken}`);
