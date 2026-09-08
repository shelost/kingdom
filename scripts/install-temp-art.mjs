// Installs generated art into static/temp as compressed JPEGs and points story.json slots at them.
// Usage: node scripts/install-temp-art.mjs <manifest.json>
// Manifest: [{ "id": "slot-id", "prompt": "...", "alt": "..." }]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ASSETS =
	process.env.INSTALL_TEMP_ART_ASSETS ||
	'/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const TEMP_DIR = 'static/temp';
const STORY = 'src/lib/data/story.json';
// Stand-in art is display-only and the volume is near capacity, so cap the long
// edge and lean on JPEG rather than storing generator-native resolution.
const QUALITY = '72';
const MAX_EDGE = '1200';

function hasSips() {
	try {
		execFileSync('which', ['sips'], { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
}

function convertToJpeg(source, out) {
	if (hasSips()) {
		execFileSync(
			'sips',
			[
				'-s',
				'format',
				'jpeg',
				'-s',
				'formatOptions',
				QUALITY,
				'-Z',
				MAX_EDGE,
				source,
				'--out',
				out
			],
			{ stdio: 'ignore' }
		);
		return;
	}
	execFileSync(
		'python3',
		[
			'-c',
			[
				'from PIL import Image',
				'import sys',
				'src, out, edge, q = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])',
				'im = Image.open(src).convert("RGB")',
				'im.thumbnail((edge, edge))',
				'im.save(out, "JPEG", quality=q, optimize=True)'
			].join('\n'),
			source,
			out,
			MAX_EDGE,
			QUALITY
		],
		{ stdio: 'ignore' }
	);
}

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
	const source = path.join(ASSETS, `${item.id}.png`);
	if (!fs.existsSync(source)) {
		skipped.push(`${item.id}: missing ${source}`);
		continue;
	}
	const out = path.join(TEMP_DIR, `${item.id}.jpg`);
	convertToJpeg(source, out);
	fs.rmSync(source);

	slot.tempImage = `/temp/${item.id}.jpg`;
	if (item.prompt) slot.prompt = item.prompt;
	if (item.alt) slot.alt = item.alt;
	installed.push(item.id);
}

fs.mkdirSync(TEMP_DIR, { recursive: true });
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

// Keep the client-side convention fallback inventory in sync.
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });

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
