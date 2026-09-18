#!/usr/bin/env node
/**
 * NSFW stills via fal.ai Pony V7 (safety checker off by default on this model).
 *
 *   node scripts/generate-fal-nsfw.mjs --id slot-id --prompt "..." [--couple] [--ref path]...
 *
 * fal-ai/pony-v7 is text-to-image only (no IP-Adapter / image_url). Optional
 * `--swap` runs fal-ai/face-swap on each `ch_*` --ref (largest face; wrecks
 * two-shots). Place files (pl_*) can only be described in the prompt.
 *
 * Reads FAL_KEY from the environment (or a local .env). Never logs the key.
 * Writes `{id}.png` into the Cursor assets folder for install-temp-art.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const MODEL = process.env.FAL_NSFW_MODEL ?? 'fal-ai/pony-v7';
const SWAP_MODEL = process.env.FAL_SWAP_MODEL ?? 'fal-ai/face-swap';

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

function argsAll(flag) {
	const out = [];
	for (let i = 0; i < process.argv.length; i++) {
		if (process.argv[i] === flag && process.argv[i + 1]) out.push(process.argv[i + 1]);
	}
	return out;
}

function dataUriFromFile(filePath) {
	const abs = path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath.replace(/^\//, ''));
	const buf = fs.readFileSync(abs);
	const ext = path.extname(abs).slice(1).toLowerCase() || 'png';
	const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
	return `data:${mime};base64,${buf.toString('base64')}`;
}

loadDotEnv();

const id = arg('--id');
const prompt = arg('--prompt');
if (!id || !prompt) {
	console.error(
		'usage: node scripts/generate-fal-nsfw.mjs --id <slot-id> --prompt "..." [--couple] [--swap] [--ref path]...'
	);
	process.exit(1);
}

const key = process.env.FAL_KEY;
if (!key) {
	console.error('FAL_KEY missing in env / .env — cannot call fal.ai');
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
const doSwap = process.argv.includes('--swap');
const noHouse = process.argv.includes('--no-house');
const refPaths = argsAll('--ref');
const faceRefs = refPaths.filter((p) => {
	const base = path.basename(p);
	return base.startsWith('ch_') && !base.includes('binyeo');
});

const ponyPrefix = couple
	? 'score_9, score_8_up, score_7_up, source_anime, rating_explicit, cinematic still, 1girl, 1boy, two adults, '
	: 'score_9, score_8_up, score_7_up, source_anime, rating_explicit, cinematic still, 1girl, adult woman, ';
const scene =
	!noHouse && houseSuffix && !prompt.includes(houseSuffix) ? `${prompt} ${houseSuffix}` : prompt;
const antiPoster =
	'Simple 2D anime-painterly movie still filling the whole frame. No picture-frame border, no neon, no HUD, no collage, no split-screen, no overlay bars, no readable text, no watermark. ';

async function falJson(model, payload) {
	const res = await fetch(`https://fal.run/${model}`, {
		method: 'POST',
		headers: {
			Authorization: `Key ${key}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});
	const text = await res.text();
	let json;
	try {
		json = JSON.parse(text);
	} catch {
		json = { raw: text };
	}
	if (!res.ok) {
		const err = new Error(`fal ${model} ${res.status}: ${text.slice(0, 400)}`);
		err.status = res.status;
		err.body = json;
		throw err;
	}
	return json;
}

async function downloadTo(url, dest) {
	if (url.startsWith('data:')) {
		fs.writeFileSync(dest, Buffer.from(url.split(',')[1], 'base64'));
		return;
	}
	const img = await fetch(url);
	if (!img.ok) throw new Error(`download ${img.status}`);
	fs.writeFileSync(dest, Buffer.from(await img.arrayBuffer()));
}

const body = {
	prompt: ponyPrefix + antiPoster + scene,
	image_size: { width: 1216, height: 688 },
	num_images: 1,
	guidance_scale: 3.5,
	num_inference_steps: 40,
	enable_safety_checker: false,
	output_format: 'png'
};

let json;
try {
	json = await falJson(MODEL, body);
} catch (err) {
	console.error(String(err));
	process.exit(err.status === 401 || err.status === 403 ? 2 : 3);
}

const imageUrl = json?.images?.[0]?.url;
if (!imageUrl) {
	console.error('fal returned no image url');
	process.exit(4);
}

fs.mkdirSync(ASSETS, { recursive: true });
const out = path.join(ASSETS, `${id}.png`);
await downloadTo(imageUrl, out);

if (doSwap && faceRefs.length) {
	let current = `data:image/png;base64,${fs.readFileSync(out).toString('base64')}`;
	for (const face of faceRefs) {
		try {
			const swapped = await falJson(SWAP_MODEL, {
				base_image_url: current,
				swap_image_url: dataUriFromFile(face)
			});
			const next = swapped?.image?.url;
			if (!next) {
				console.error(`face-swap skipped (${path.basename(face)}): no image`);
				continue;
			}
			await downloadTo(next, out);
			current = `data:image/png;base64,${fs.readFileSync(out).toString('base64')}`;
			console.error(`swapped ${path.basename(face)}`);
		} catch (err) {
			console.error(`face-swap ${path.basename(face)} failed: ${String(err).slice(0, 300)}`);
		}
	}
}

console.log(out);
