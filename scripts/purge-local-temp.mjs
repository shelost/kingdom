// Upload every still in static/temp, point live references at the public URL,
// then delete the local file once the plate and its 256px thumb both answer 200.
// Starred stills stay on disk. Resumes from scripts/.cache/r2-backfill.json.
// Usage: node scripts/purge-local-temp.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { putFile, r2Status } from './r2.mjs';

const TEMP = 'static/temp';
const PROG = 'scripts/.cache/r2-backfill.json';
const STARS = 'src/lib/data/image-stars.json';
const SOURCES = [
	'src/lib/data/story.json',
	'src/lib/people.ts',
	'src/lib/scenes.ts',
	'src/lib/animals.ts',
	'src/lib/relations.ts',
	'src/lib/places.ts',
	'src/lib/data/image-grades.json',
	'src/lib/data/visual-canon.json',
	'src/lib/movieSequences.ts'
];

const status = r2Status();
if (!status.ready) {
	console.error(`r2 not ready: ${status.missing.join(', ')}`);
	process.exit(1);
}

/** @type {Record<string, string>} */
const done = fs.existsSync(PROG) ? JSON.parse(fs.readFileSync(PROG, 'utf8')) : {};
const stars = new Set(
	JSON.parse(fs.readFileSync(STARS, 'utf8')).stars.map((id) => String(id).replace(/_/g, '-').toLowerCase())
);

function artKey(name) {
	return name.replace(/\.[^.]+$/i, '').replace(/_/g, '-').toLowerCase();
}

function saveProg() {
	fs.mkdirSync(path.dirname(PROG), { recursive: true });
	fs.writeFileSync(PROG, JSON.stringify(done));
}

function thumbKey(base) {
	return `stills/${base.replace(/\.(jpe?g|png|webp)$/i, '-256.jpg')}`;
}

async function uploadOne(base, file) {
	if (done[base]) return done[base];
	const stem = base.replace(/\.(jpe?g|png|webp)$/i, '');
	const thumb = path.join(os.tmpdir(), `kingdom-still-${stem}-256.jpg`);
	execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '256', file, '--out', thumb], {
		stdio: 'ignore'
	});
	if (!fs.existsSync(thumb) || fs.statSync(thumb).size === 0) {
		throw new Error('thumb was not written');
	}
	const url = await putFile(`stills/${base}`, file);
	if (!url) throw new Error('R2 put returned no url');
	await putFile(thumbKey(base), thumb);
	fs.rmSync(thumb, { force: true });
	done[base] = url;
	return url;
}

async function headOk(url) {
	const res = await fetch(url, { method: 'HEAD' });
	return res.ok && Number(res.headers.get('content-length') ?? '1') > 0;
}

const names = fs
	.readdirSync(TEMP)
	.filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
	.sort();

/** @type {Map<string, string>} */
const verified = new Map();
let uploaded = 0;
let failed = 0;
let empty = 0;
const CONCURRENCY = 6;
let cursor = 0;

async function worker() {
	for (;;) {
		const i = cursor++;
		if (i >= names.length) return;
		const base = names[i];
		const file = path.join(TEMP, base);
		if (fs.statSync(file).size === 0) {
			empty++;
			continue;
		}
		try {
			const fresh = !done[base];
			const url = await uploadOne(base, file);
			if (fresh) uploaded++;
			const thumbUrl = url.replace(/\/stills\/[^/?]+/, (m) => m.replace(/\.(jpe?g|png|webp)$/i, '-256.jpg'));
			let plateOk = await headOk(url);
			let thumbOk = await headOk(thumbUrl);
			if (!plateOk || !thumbOk) {
				delete done[base];
				const again = await uploadOne(base, file);
				plateOk = await headOk(again);
				thumbOk = await headOk(again.replace(/\/stills\/[^/?]+/, (m) => m.replace(/\.(jpe?g|png|webp)$/i, '-256.jpg')));
				if (plateOk && thumbOk) verified.set(base, again);
			} else {
				verified.set(base, url);
			}
			if ((verified.size + failed) % 100 === 0) {
				saveProg();
				console.log(`checked ${verified.size + failed + empty}/${names.length}`);
			}
		} catch (err) {
			failed++;
			console.error(`fail ${base}: ${err instanceof Error ? err.message : err}`);
		}
	}
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
saveProg();

const storyPath = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(storyPath, 'utf8'));
for (const ch of story) {
	for (const en of ch.entries ?? []) {
		for (const im of en.images ?? []) {
			const id = typeof im.id === 'string' ? im.id : '';
			const current = typeof im.tempImage === 'string' ? im.tempImage : '';
			const fromPath = current.split('?')[0].split('/').pop() ?? '';
			const url = verified.get(fromPath) || (id && verified.get(`${id}.jpg`)) || (id && verified.get(`${id}.png`)) || (id && verified.get(`${id}.webp`));
			if (url && (!current || current.startsWith('/temp/'))) im.tempImage = url;
		}
	}
}
fs.writeFileSync(storyPath, JSON.stringify(story, null, '\t') + '\n');

for (const file of SOURCES) {
	const before = fs.readFileSync(file, 'utf8');
	const after = before.replace(/\/temp\/([^'"\s)]+?\.(?:jpe?g|png|webp))(?:\?v=\d+)?/gi, (full, name) => {
		return verified.get(name) ?? full;
	});
	if (after !== before) fs.writeFileSync(file, after);
}

const stillLocal = new Set();
for (const file of SOURCES) {
	const text = fs.readFileSync(file, 'utf8');
	for (const match of text.matchAll(/\/temp\/([^'"\s)]+?\.(?:jpe?g|png|webp))/gi)) {
		stillLocal.add(match[1]);
	}
}

let removed = 0;
let keptStar = 0;
let keptRef = 0;
for (const [base] of verified) {
	if (stars.has(artKey(base))) {
		keptStar++;
		continue;
	}
	if (stillLocal.has(base)) {
		keptRef++;
		continue;
	}
	fs.rmSync(path.join(TEMP, base), { force: true });
	removed++;
}

console.log(
	`verified ${verified.size}, uploaded ${uploaded}, failed ${failed}, empty ${empty}, removed ${removed}, kept starred ${keptStar}, kept referenced ${keptRef}`
);
