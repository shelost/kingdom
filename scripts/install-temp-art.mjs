// Installs generated art into static/temp as compressed JPEGs and points story.json slots at them.
// Usage: node scripts/install-temp-art.mjs <manifest.json>
// Manifest: [{ "id": "slot-id", "prompt": "...", "alt": "...", "ratio"?: 2 | 1 | "native" }]
// Every still is centre-cropped to the house 2:1 unless the item names another ratio.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { cropArgs, imageSize, parseRatio } from './crop-ratio.mjs';

const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const TEMP_DIR = 'static/temp';
const STORY = 'src/lib/data/story.json';
// Stand-in art is display-only and the volume is near capacity, so cap the long
// edge and lean on JPEG rather than storing generator-native resolution.
const QUALITY = '72';
const MAX_EDGE = '1200';

const manifest = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const slots = new Map();
for (const ch of Object.values(story)) {
	for (const en of ch.entries ?? []) {
		for (const im of en.images ?? []) slots.set(im.id, im);
	}
}

const installed = [];
const skipped = [];

for (const item of manifest) {
	const slot = slots.get(item.id);
	if (!slot) {
		skipped.push(`${item.id}: no such slot`);
		continue;
	}
	const source = ['png', 'jpg', 'jpeg']
		.map((ext) => path.join(ASSETS, `${item.id}.${ext}`))
		.find((file) => fs.existsSync(file));
	if (!source) {
		skipped.push(`${item.id}: missing ${path.join(ASSETS, `${item.id}.png`)}`);
		continue;
	}
	const out = path.join(TEMP_DIR, `${item.id}.jpg`);
	const ratio = parseRatio(item.ratio);
	execFileSync(
		'sips',
		['-s', 'format', 'jpeg', '-s', 'formatOptions', QUALITY, ...cropArgs(source, ratio), source, '--out', out],
		{ stdio: 'ignore' }
	);
	const { w, h } = imageSize(out);
	if (Math.max(w, h) > Number(MAX_EDGE)) {
		execFileSync('sips', ['-s', 'formatOptions', QUALITY, '-Z', MAX_EDGE, out], { stdio: 'ignore' });
	}
	fs.rmSync(source);

	slot.ratio = ratio ?? Number((w / h).toFixed(3));
	slot.tempImage = `/temp/${item.id}.jpg`;
	if (item.prompt) slot.prompt = item.prompt;
	if (item.alt) slot.alt = item.alt;
	installed.push(item.id);
}

fs.mkdirSync(TEMP_DIR, { recursive: true });
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

// Keep the client-side convention fallback inventory in sync (referenced only).
execFileSync(process.execPath, ['scripts/sync-temp-deploy.mjs'], { stdio: 'inherit' });

console.log(`installed ${installed.length}: ${installed.join(', ')}`);
if (skipped.length) console.log(`skipped ${skipped.length}:\n  ${skipped.join('\n  ')}`);

let bare = 0;
for (const im of slots.values()) {
	if (im.src) continue;
	if (im.tempImage && fs.existsSync(path.join('static', im.tempImage.replace(/^\//, '')))) continue;
	if (fs.existsSync(path.join(TEMP_DIR, `${im.id}.jpg`))) continue;
	if (fs.existsSync(path.join(TEMP_DIR, `${im.id}.png`))) continue;
	bare++;
}
console.log(`remaining bare slots: ${bare}`);
