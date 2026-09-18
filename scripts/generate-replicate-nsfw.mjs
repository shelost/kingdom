#!/usr/bin/env node
/**
 * NSFW stills via Replicate (Pony XL). API can set disable_safety_checker.
 *
 *   node scripts/generate-replicate-nsfw.mjs --id slot-id --prompt "..."
 *
 * Reads REPLICATE_API_TOKEN from env / .env. Never logs the token.
 * Writes `{id}.png` into the Cursor assets folder for install-temp-art.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const MODEL = process.env.REPLICATE_NSFW_MODEL ?? 'aisha-ai-official/prefect-pony-xl-v5';

function loadDotEnv() {
	const envPath = path.join(ROOT, '.env');
	if (!fs.existsSync(envPath)) return;
	for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
		const t = line.trim();
		if (!t || t.startsWith('#')) continue;
		const eq = t.indexOf('=');
		if (eq < 1) continue;
		const key = t.slice(0, eq).trim();
		if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) continue;
		if (process.env[key]) continue;
		let val = t.slice(eq + 1).trim();
		if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
			val = val.slice(1, -1);
		}
		process.env[key] = val;
	}
}

function arg(flag, fallback) {
	const i = process.argv.indexOf(flag);
	if (i < 0 || i + 1 >= process.argv.length) return fallback;
	return process.argv[i + 1];
}

loadDotEnv();

const id = arg('--id');
const prompt = arg('--prompt');
if (!id || !prompt) {
	console.error(
		'usage: node scripts/generate-replicate-nsfw.mjs --id <slot-id> --prompt "..." [--couple]'
	);
	process.exit(1);
}

const token = process.env.REPLICATE_API_TOKEN;
if (!token) {
	console.error('REPLICATE_API_TOKEN missing in env / .env');
	process.exit(2);
}

const housePath = path.join(ROOT, 'src/lib/data/image-prompt-house.json');
let houseSuffix = '';
try {
	const house = JSON.parse(fs.readFileSync(housePath, 'utf8'));
	houseSuffix = typeof house.suffix === 'string' ? house.suffix.trim() : '';
} catch {
	/* grade page writes this */
}

const couple = process.argv.includes('--couple');
const ponyPrefix = couple
	? 'score_9, score_8_up, score_7_up, source_anime, rating_explicit, cinematic still, 1girl, 1boy, two adults, '
	: 'score_9, score_8_up, score_7_up, source_anime, rating_explicit, cinematic still, 1girl, adult woman, ';
const antiPoster =
	'Simple 2D anime-painterly movie frame filling the image. NO picture frame, NO neon, NO HUD, NO collage, NO split-screen, NO overlay bars, NO readable text, NO watermark. ';
const scene = houseSuffix && !prompt.includes(houseSuffix) ? `${prompt} ${houseSuffix}` : prompt;

const input = {
	prompt: ponyPrefix + antiPoster + scene,
	negative_prompt:
		'score_4, score_5, score_6, text, watermark, logo, extra people, crowd, child, loli, shota, photoreal, 3d render, cgi, neon, HUD, collage, split screen, picture frame, overlay, barcode, english text',
	width: 1216,
	height: 688,
	num_inference_steps: 28,
	guidance_scale: 6,
	disable_safety_checker: true
};

const headers = {
	Authorization: `Bearer ${token}`,
	'Content-Type': 'application/json',
	Prefer: 'wait'
};

const modelRes = await fetch(`https://api.replicate.com/v1/models/${MODEL}`, { headers });
if (!modelRes.ok) {
	console.error(`replicate model ${modelRes.status}: ${(await modelRes.text()).slice(0, 400)}`);
	process.exit(3);
}
const version = (await modelRes.json())?.latest_version?.id;
if (!version) {
	console.error(`replicate model ${MODEL} has no latest_version`);
	process.exit(3);
}

let res;
try {
	res = await fetch('https://api.replicate.com/v1/predictions', {
		method: 'POST',
		headers,
		body: JSON.stringify({ version, input })
	});
} catch (err) {
	console.error(`Replicate not reachable (${MODEL}).`);
	console.error(String(err));
	process.exit(2);
}

if (!res.ok) {
	const text = await res.text();
	console.error(`replicate ${res.status}: ${text.slice(0, 500)}`);
	process.exit(3);
}

let json = await res.json();
let guard = 0;
while (json.status === 'starting' || json.status === 'processing') {
	if (++guard > 60) {
		console.error('replicate timed out waiting');
		process.exit(6);
	}
	await new Promise((r) => setTimeout(r, 2000));
	const poll = await fetch(json.urls.get, {
		headers: { Authorization: `Bearer ${token}` }
	});
	json = await poll.json();
}

if (json.status !== 'succeeded') {
	console.error(`replicate ${json.status}: ${String(json.error ?? '').slice(0, 400)}`);
	process.exit(4);
}

const outUrl = Array.isArray(json.output) ? json.output[0] : json.output;
if (!outUrl || typeof outUrl !== 'string') {
	console.error('replicate returned no image url');
	process.exit(4);
}

fs.mkdirSync(ASSETS, { recursive: true });
const out = path.join(ASSETS, `${id}.png`);
const img = await fetch(outUrl);
if (!img.ok) {
	console.error(`download ${img.status}`);
	process.exit(5);
}
fs.writeFileSync(out, Buffer.from(await img.arrayBuffer()));
console.log(out);
