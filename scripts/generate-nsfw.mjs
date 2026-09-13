#!/usr/bin/env node
/**
 * Local NSFW stills via Draw Things / A1111-compatible HTTP API.
 * Cursor GenerateImage stays filtered — this is the chat-callable path.
 *
 *   node scripts/generate-nsfw.mjs --id slot-id --prompt "..." [--width 1216] [--height 688]
 *
 * Writes `{id}.png` into the Cursor assets folder so install-temp-art.mjs can pick it up.
 * Requires Draw Things open with API Server on (default http://127.0.0.1:7860).
 */
import fs from 'node:fs';
import path from 'node:path';

const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const HOST = process.env.DRAWTHINGS_URL ?? 'http://127.0.0.1:7860';

function arg(flag, fallback) {
	const i = process.argv.indexOf(flag);
	if (i < 0 || i + 1 >= process.argv.length) return fallback;
	return process.argv[i + 1];
}

const id = arg('--id');
const prompt = arg('--prompt');
if (!id || !prompt) {
	console.error('usage: node scripts/generate-nsfw.mjs --id <slot-id> --prompt "..."');
	process.exit(1);
}

const width = Number(arg('--width', '1216'));
const height = Number(arg('--height', '688'));
const steps = Number(arg('--steps', '28'));
const cfg = Number(arg('--cfg', '6'));
const seed = Number(arg('--seed', '-1'));
const negative =
	arg('--negative') ??
	'score_4, score_5, score_6, text, watermark, logo, extra people, crowd, glass lantern, hurricane lamp, photoreal, 3d render, child, loli, shota';

const ponyPrefix =
	'score_9, score_8_up, score_7_up, source_anime, rating_explicit, cinematic still, ';

const housePath = path.resolve('src/lib/data/image-prompt-house.json');
let houseSuffix = '';
try {
	const house = JSON.parse(fs.readFileSync(housePath, 'utf8'));
	houseSuffix = typeof house.suffix === 'string' ? house.suffix.trim() : '';
} catch {
	/* first run — grade page writes this file */
}
const scene = houseSuffix && !prompt.includes(houseSuffix) ? `${prompt} ${houseSuffix}` : prompt;

const body = {
	prompt: ponyPrefix + scene,
	negative_prompt: negative,
	width,
	height,
	steps,
	cfg_scale: cfg,
	seed,
	sampler_name: 'Euler a',
	batch_size: 1
};

const url = `${HOST.replace(/\/$/, '')}/sdapi/v1/txt2img`;
let res;
try {
	res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
} catch (err) {
	console.error(
		`Draw Things API not reachable at ${url}. Open Draw Things → Settings → enable API Server (port 7860), load Pony Diffusion V6 XL, then retry.`
	);
	console.error(String(err));
	process.exit(2);
}

if (!res.ok) {
	const text = await res.text();
	console.error(`API ${res.status}: ${text.slice(0, 400)}`);
	process.exit(3);
}

const json = await res.json();
const b64 = json?.images?.[0];
if (!b64) {
	console.error('API returned no image');
	process.exit(4);
}

fs.mkdirSync(ASSETS, { recursive: true });
const out = path.join(ASSETS, `${id}.png`);
fs.writeFileSync(out, Buffer.from(b64, 'base64'));
console.log(out);
