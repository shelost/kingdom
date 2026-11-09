// Upload chronicle stills already in static/temp and point story.json at the public URLs.
// Resumes from scripts/.cache/r2-backfill.json. Leaves the local files in place.
// Usage: node scripts/backfill-r2.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { putFile, r2Status } from './r2.mjs';

const STORY = 'src/lib/data/story.json';
const PROG = 'scripts/.cache/r2-backfill.json';
const CONCURRENCY = 4;

const status = r2Status();
if (!status.ready) {
	console.error(`r2 not ready: ${status.missing.join(', ')}`);
	process.exit(1);
}

function loadProg() {
	try {
		return JSON.parse(fs.readFileSync(PROG, 'utf8'));
	} catch {
		return {};
	}
}

const done = loadProg();

function saveProg() {
	fs.mkdirSync(path.dirname(PROG), { recursive: true });
	fs.writeFileSync(PROG, JSON.stringify(done));
}

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const chapters = Array.isArray(story) ? story : Object.values(story);

/** @type {Map<string, { file: string, slots: any[] }>} */
const jobs = new Map();
let missing = 0;
for (const ch of chapters) {
	for (const en of ch.entries ?? []) {
		for (const im of en.images ?? []) {
			const t = im.tempImage ?? '';
			if (!t.startsWith('/temp/')) continue;
			const rel = t.split('?')[0];
			const file = path.join('static', rel.slice(1));
			if (!fs.existsSync(file)) {
				missing++;
				continue;
			}
			const base = path.basename(rel);
			if (base.startsWith('_r2-probe')) continue;
			const job = jobs.get(base) ?? { file, slots: [] };
			job.slots.push(im);
			jobs.set(base, job);
		}
	}
}

async function uploadOne(base, file) {
	if (done[base]) return done[base];
	const thumb = path.join(os.tmpdir(), `r2b-${base.replace(/[^\w.-]+/g, '_')}-256.jpg`);
	execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '256', file, '--out', thumb], {
		stdio: 'ignore'
	});
	const url = await putFile(`stills/${base}`, file);
	if (!url) throw new Error('R2 put returned no url');
	const thumbName = base.replace(/\.(jpe?g|png|webp)$/i, '-256.jpg');
	if (thumbName !== base) await putFile(`stills/${thumbName}`, thumb);
	fs.rmSync(thumb, { force: true });
	done[base] = url;
	return url;
}

const bases = [...jobs.keys()];
let cursor = 0;
let finished = 0;
let failed = 0;

async function worker() {
	for (;;) {
		const i = cursor++;
		if (i >= bases.length) return;
		const base = bases[i];
		try {
			const url = await uploadOne(base, jobs.get(base).file);
			for (const slot of jobs.get(base).slots) slot.tempImage = url;
			finished++;
			if (finished % 25 === 0) {
				saveProg();
				console.log(`${finished}/${bases.length}`);
			}
		} catch (err) {
			failed++;
			console.error(`fail ${base}: ${err instanceof Error ? err.message : err}`);
		}
	}
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
saveProg();
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`uploaded ${finished}, failed ${failed}, missing files ${missing}, slots touched ${[...jobs.values()].reduce((n, j) => n + j.slots.length, 0)}`);
