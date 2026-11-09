// Upload served stills (root JPEGs, scene plates, intro, posters, stories,
// civ, people, guide, nations) and delete the local file once the plate and
// its 256px thumb both answer 200. Generation boards stay on disk.
// Usage: node scripts/purge-served-images.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { putFile, r2Status } from './r2.mjs';

const DIRS = ['intro', 'posters', 'stories', 'civ', 'people', 'guide', 'nations'];
const ROOT_KEEP = /^(ref_|crown|ar_|obj_|pl_|ch_|bn_|sw_|ship_|flag_|hat_|sword_)/i;
const IMAGE = /\.(jpe?g|png|webp)$/i;
const SOURCES = [];

function walk(dir) {
	for (const name of fs.readdirSync(dir)) {
		if (name === 'node_modules' || name === '.cache') continue;
		const abs = path.join(dir, name);
		const st = fs.statSync(abs);
		if (st.isDirectory()) walk(abs);
		else if (/\.(ts|svelte|js|mjs|json|css|scss)$/i.test(name)) SOURCES.push(abs);
	}
}

const status = r2Status();
if (!status.ready) {
	console.error(`r2 not ready: ${status.missing.join(', ')}`);
	process.exit(1);
}

/** @type {{ rel: string, file: string, key: string }[]} */
const jobs = [];

function add(rel) {
	const file = path.join('static', rel);
	if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return;
	if (!IMAGE.test(rel) || fs.statSync(file).size === 0) return;
	jobs.push({ rel, file, key: rel });
}

for (const name of fs.readdirSync('static')) {
	const abs = path.join('static', name);
	if (!fs.statSync(abs).isFile() || !IMAGE.test(name)) continue;
	if (ROOT_KEEP.test(name)) continue;
	if (/\.png$/i.test(name) && !name.startsWith('scene_')) continue;
	add(name);
}
for (const dir of DIRS) {
	const root = path.join('static', dir);
	if (!fs.existsSync(root)) continue;
	const stack = [root];
	while (stack.length) {
		const cur = stack.pop();
		for (const name of fs.readdirSync(cur)) {
			const abs = path.join(cur, name);
			if (fs.statSync(abs).isDirectory()) stack.push(abs);
			else add(path.relative('static', abs));
		}
	}
}

function thumbKey(key) {
	return key.replace(/\.(jpe?g|png|webp)$/i, '-256.jpg');
}

function thumbFile(key) {
	const safe = key.replace(/[^\w.-]+/g, '_');
	return path.join(os.tmpdir(), `kingdom-served-${safe}`);
}

async function headOk(url) {
	const res = await fetch(url, { method: 'HEAD' });
	return res.ok && Number(res.headers.get('content-length') ?? '1') > 0;
}

/** @type {Map<string, { url: string, bytes: number }>} */
const verified = new Map();
let failed = 0;
let cursor = 0;
const CONCURRENCY = 6;

async function uploadOne(job) {
	const thumb = thumbFile(job.key);
	execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '256', job.file, '--out', thumb], {
		stdio: 'ignore'
	});
	if (!fs.existsSync(thumb) || fs.statSync(thumb).size === 0) throw new Error('thumb was not written');
	const url = await putFile(job.key, job.file);
	if (!url) throw new Error('R2 put returned no url');
	await putFile(thumbKey(job.key), thumb);
	fs.rmSync(thumb, { force: true });
	const q = url.indexOf('?');
	const base = q === -1 ? url : url.slice(0, q);
	const thumbUrl = base.replace(/\.(jpe?g|png|webp)$/i, '-256.jpg') + (q === -1 ? '' : url.slice(q));
	if (!(await headOk(url)) || !(await headOk(thumbUrl))) throw new Error('HEAD failed');
	return url;
}

async function worker() {
	for (;;) {
		const i = cursor++;
		if (i >= jobs.length) return;
		const job = jobs[i];
		try {
			const url = await uploadOne(job);
			verified.set('/' + job.rel, { url, bytes: fs.statSync(job.file).size });
			if (verified.size % 50 === 0) console.log(`verified ${verified.size}/${jobs.length}`);
		} catch (err) {
			failed++;
			console.error(`fail ${job.rel}: ${err instanceof Error ? err.message : err}`);
		}
	}
}

console.log(`queued ${jobs.length}`);
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

walk('src');
for (const file of SOURCES) {
	let text = fs.readFileSync(file, 'utf8');
	const next = text.replace(
		/(?<![A-Za-z0-9._~-])(\/(?:intro|posters|stories|civ|people|guide|nations)\/[^\s"'()]+?\.(?:jpe?g|png|webp)|\/(?:scene_|rel_|grp_|cln_|org_|style_)[^\s"'()]+?\.(?:jpe?g|png|webp))(?:\?v=\d+)?/gi,
		(full, rel) => verified.get(rel)?.url ?? full
	);
	if (next !== text) fs.writeFileSync(file, next);
}

const still = new Set();
for (const file of SOURCES) {
	const text = fs.readFileSync(file, 'utf8');
	for (const match of text.matchAll(
		/(?<![A-Za-z0-9._~-])(\/(?:intro|posters|stories|civ|people|guide|nations)\/[^\s"'()]+?\.(?:jpe?g|png|webp)|\/(?:scene_|rel_|grp_|cln_|org_|style_)[^\s"'()]+?\.(?:jpe?g|png|webp))/gi
	)) {
		still.add(match[1]);
	}
}

let removed = 0;
let bytes = 0;
let kept = 0;
for (const [rel, info] of verified) {
	if (still.has(rel)) {
		kept++;
		continue;
	}
	fs.rmSync(path.join('static', rel.slice(1)), { force: true });
	removed++;
	bytes += info.bytes;
}

console.log(
	`verified ${verified.size}, failed ${failed}, removed ${removed}, kept ${kept}, bytes ${bytes}`
);
