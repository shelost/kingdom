#!/usr/bin/env node
/**
 * InstantID Pony: Cursor plate (or portrait) as face lock + explicit scene prompt.
 * Draw Things is down; this is the hosted half of the two-pass workflow.
 */
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

const token = process.env.REPLICATE_API_TOKEN;
const VERSION = '9b1951176565c8f810f28ed140787a81c8f49b49e2d40d0a135d9491b95782bd';
const OUT = path.join(ROOT, 'scripts/.cache/nsfw-filter-probe');
const NEG =
	'score_4, score_5, score_6, child, loli, shota, photoreal, 3d, western hotel, maid, neon, text, watermark, extra girls, deformed hands';

function dataUri(file) {
	const buf = fs.readFileSync(file);
	const mime = file.endsWith('.jpg') || file.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
	return `data:${mime};base64,${buf.toString('base64')}`;
}

const JOBS = [
	{
		id: 'idpony-sosuno-loft-ecu',
		ref: path.join(ROOT, 'static/temp/sosuno-seq-loft-ecu.jpg'),
		prompt:
			'score_9, score_8_up, source_anime, rating_explicit, 1girl, adult Korean woman, same face as reference, long black hair, red forehead cord, gold phoenix hairpin, dusty-rose hanbok jeogori, timber loft, window, ECU wanting face, heavy blush, bitten lip, sweat, hand under hiked chima, masturbation, cinematic shallow DOF, crushed blacks, hard key, no text'
	},
	{
		id: 'idpony-sosuno-loft-climax',
		ref: path.join(ROOT, 'static/temp/sosuno-seq-loft-climax.jpg'),
		prompt:
			'score_9, score_8_up, source_anime, rating_explicit, 1girl, adult Korean woman, same face as reference, long black hair, red forehead cord, gold phoenix hairpin, dusty-rose hanbok falling off shoulder, timber loft, climax face, ahegao, wrist in mouth, hiked chima, wet, explicit masturbation, cinematic, crushed blacks, hard key, no text'
	},
	{
		id: 'idpony-maehwa-tease',
		ref: path.join(ROOT, 'static/temp/nsfw-maehwa-tease.jpg'),
		prompt:
			'score_9, score_8_up, source_anime, rating_explicit, 1girl, adult Korean woman, same face as reference, tan skin, messy bun, wooden sprig hairpin, teal sage hanbok #8AAFA0, packed earth yard, looking back over shoulder, hiking chima, hip, skin-forward, smug, dutch angle, cinematic, no text'
	},
	{
		id: 'idpony-maehwa-disrobe',
		ref: path.join(ROOT, 'static/temp/nsfw-maehwa-disrobe.jpg'),
		prompt:
			'score_9, score_8_up, source_anime, rating_explicit, 1girl 1boy, adult Korean woman same face as reference, tan skin, messy bun, wooden sprig hairpin, teal sage hanbok slipping off, pulling ice-blue robe off adult man with blue crescent headband, timber hall, oil lamp, flushed, skin-forward, passionate, cinematic, no text'
	}
];

async function sleep(ms) {
	await new Promise((r) => setTimeout(r, ms));
}

async function run(job) {
	const t0 = Date.now();
	for (let attempt = 0; attempt < 8; attempt++) {
		const res = await fetch('https://api.replicate.com/v1/predictions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				Prefer: 'wait'
			},
			body: JSON.stringify({
				version: VERSION,
				input: {
					prompt: job.prompt,
					negative_prompt: NEG,
					reference_image: dataUri(job.ref),
					width: 1216,
					height: 688,
					steps: 28,
					cfg: 6,
					sampler_name: 'euler_ancestral',
					scheduler: 'karras',
					hyperlora_weight: 0.7,
					instantid_weight: 0.75,
					facedetail_strength: 0.4
				}
			})
		});
		const text = await res.text();
		let json;
		try {
			json = JSON.parse(text);
		} catch {
			return { id: job.id, ok: false, http: res.status, error: text.slice(0, 300), ms: Date.now() - t0 };
		}
		if (res.status === 429) {
			console.error(job.id, '429, wait 12s');
			await sleep(12000);
			continue;
		}
		if (!res.ok) {
			return {
				id: job.id,
				ok: false,
				http: res.status,
				error: String(json.detail ?? json.error ?? text).slice(0, 400),
				ms: Date.now() - t0
			};
		}
		let pred = json;
		let g = 0;
		while (pred.status === 'starting' || pred.status === 'processing') {
			if (++g > 50) return { id: job.id, ok: false, error: 'timeout', ms: Date.now() - t0 };
			await sleep(2000);
			pred = await (
				await fetch(pred.urls.get, { headers: { Authorization: `Bearer ${token}` } })
			).json();
		}
		if (pred.status !== 'succeeded') {
			return { id: job.id, ok: false, error: String(pred.error ?? pred.status), ms: Date.now() - t0 };
		}
		const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
		if (!url) return { id: job.id, ok: false, error: 'no output', ms: Date.now() - t0 };
		const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
		const file = path.join(OUT, `${job.id}.png`);
		fs.writeFileSync(file, buf);
		return { id: job.id, ok: true, file, bytes: buf.length, ms: Date.now() - t0 };
	}
	return { id: job.id, ok: false, error: 'rate limit', ms: Date.now() - t0 };
}

const log = [];
for (const job of JOBS) {
	console.error('run', job.id);
	const r = await run(job);
	log.push(r);
	console.error(job.id, r.ok, r.error ?? r.file, r.ms + 'ms');
	await sleep(11000);
}
fs.writeFileSync(path.join(OUT, 'idpony-log.json'), JSON.stringify(log, null, 2));
console.log(path.join(OUT, 'idpony-log.json'));
