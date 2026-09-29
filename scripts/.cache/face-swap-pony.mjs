#!/usr/bin/env node
/** Face-swap Pony bodies onto Sosuno / Maehwa portraits via fal-ai/face-swap. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split('\n')) {
	const t = line.trim();
	if (!t || t.startsWith('#')) continue;
	const eq = t.indexOf('=');
	if (eq < 1) continue;
	const k = t.slice(0, eq).trim();
	let v = t.slice(eq + 1).trim();
	if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
	process.env[k] = v;
}
const key = process.env.FAL_KEY;
const OUT = path.join(ROOT, 'scripts/.cache/nsfw-filter-probe');

function dataUri(file) {
	const buf = fs.readFileSync(file);
	const ext = path.extname(file).toLowerCase();
	const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
	return `data:${mime};base64,${buf.toString('base64')}`;
}

const faces = {
	sosuno: path.join(ROOT, 'static/ch_sosuno.png'),
	maehwa: path.join(ROOT, 'static/ch_gumil_wife.png')
};
const bodies = [
	'rep-pony-off-0-clothed-blush.png',
	'rep-pony-off-1-hiked-cleavage.png',
	'rep-pony-off-3-topless.png',
	'rep-pony-off-4-hand-under-skirt.png'
];

async function swap(name, baseFile, faceFile) {
	const t0 = Date.now();
	const res = await fetch('https://fal.run/fal-ai/face-swap', {
		method: 'POST',
		headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			base_image_url: dataUri(baseFile),
			swap_image_url: dataUri(faceFile)
		})
	});
	const text = await res.text();
	let json;
	try {
		json = JSON.parse(text);
	} catch {
		return { name, ok: false, http: res.status, error: text.slice(0, 300), ms: Date.now() - t0 };
	}
	if (!res.ok) {
		const msg = json?.detail?.[0]?.msg ?? json?.detail ?? json?.error ?? text;
		return { name, ok: false, http: res.status, error: (typeof msg === 'string' ? msg : JSON.stringify(msg)).slice(0, 400), ms: Date.now() - t0 };
	}
	const url = json?.image?.url ?? json?.images?.[0]?.url;
	if (!url) return { name, ok: false, error: 'no image', raw: Object.keys(json), ms: Date.now() - t0 };
	const buf = url.startsWith('data:')
		? Buffer.from(url.split(',')[1], 'base64')
		: Buffer.from(await (await fetch(url)).arrayBuffer());
	const file = path.join(OUT, `${name}.png`);
	fs.writeFileSync(file, buf);
	return { name, ok: true, http: res.status, file, bytes: buf.length, ms: Date.now() - t0 };
}

const jobs = [];
for (const body of bodies) {
	for (const [who, face] of Object.entries(faces)) {
		const slug = body.replace('rep-pony-off-', '').replace('.png', '');
		jobs.push({ name: `swap-${who}-${slug}`, base: path.join(OUT, body), face });
	}
}

const log = [];
for (const j of jobs) {
	console.error('swap', j.name);
	const r = await swap(j.name, j.base, j.face);
	log.push(r);
	console.error(j.name, r.ok, r.http ?? '', r.error ?? r.file, r.ms + 'ms');
}
fs.writeFileSync(path.join(OUT, 'face-swap-log.json'), JSON.stringify(log, null, 2));
console.log(path.join(OUT, 'face-swap-log.json'));
