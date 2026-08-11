// One-off: caps the long edge of every static/temp stand-in JPEG and re-encodes it.
// The volume is near capacity and these are display-only placeholders, so generator-native
// resolution is dead weight. Filenames are unchanged, so story.json needs no edits.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const TEMP_DIR = 'static/temp';
const QUALITY = '72';
const MAX_EDGE = 1200;

const files = fs.readdirSync(TEMP_DIR).filter((f) => f.endsWith('.jpg'));

let before = 0;
let after = 0;
let skipped = 0;

for (const file of files) {
	const target = path.join(TEMP_DIR, file);
	const size = fs.statSync(target).size;
	const dims = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', target], {
		encoding: 'utf8'
	});
	const width = Number(dims.match(/pixelWidth:\s*(\d+)/)?.[1] ?? 0);
	const height = Number(dims.match(/pixelHeight:\s*(\d+)/)?.[1] ?? 0);
	if (Math.max(width, height) <= MAX_EDGE) {
		skipped++;
		before += size;
		after += size;
		continue;
	}
	execFileSync(
		'sips',
		['-s', 'format', 'jpeg', '-s', 'formatOptions', QUALITY, '-Z', String(MAX_EDGE), target],
		{ stdio: 'ignore' }
	);
	before += size;
	after += fs.statSync(target).size;
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + 'MB';
console.log(
	`shrank ${files.length - skipped} of ${files.length} files (${skipped} already small): ` +
		`${mb(before)} -> ${mb(after)}, freed ${mb(before - after)}`
);
