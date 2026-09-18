#!/usr/bin/env node
/**
 * NSFW stills: Pony body (fal-ai/lora, no refs) → fal-ai/face-swap (likeness).
 *
 * pony-v7 blacks out NSFW on many accounts; lora+Pony with safety off does not.
 *
 *   node scripts/generate-nsfw-pony-swap.mjs --id nsfw-maehwa-ride-teach \
 *     --prompt "…" \
 *     --face static/ch_gumil_wife.png \
 *     --face2 static/ch_pumsuk.png
 */
import { fal } from '@fal-ai/client';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { basename, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const DEFAULT_NEG =
	'score_6, score_5, score_4, censored, mosaic censoring, bar censor, ' +
	'text, watermark, logo, signature, lowres, blurry, bad anatomy, ' +
	'extra limbs, fused fingers, deformed hands, mutated, abstract, scribble, ' +
	'modern bedroom, white pillows, bed sheets, tank top, crystal hair, ice spikes, ' +
	'fantasy crown, elf ears, glowing eyes, western room';

function loadEnvFiles() {
	for (const name of ['.env.local', '.env']) {
		const p = join(ROOT, name);
		if (!existsSync(p)) continue;
		for (const line of readFileSync(p, 'utf8').split('\n')) {
			const t = line.trim();
			if (!t || t.startsWith('#')) continue;
			const eq = t.indexOf('=');
			if (eq < 1) continue;
			const k = t.slice(0, eq).trim();
			let v = t.slice(eq + 1).trim();
			if (
				(v.startsWith('"') && v.endsWith('"')) ||
				(v.startsWith("'") && v.endsWith("'"))
			) {
				v = v.slice(1, -1);
			}
			if (process.env[k] === undefined) process.env[k] = v;
		}
	}
}

function parseArgs(argv) {
	const out = {
		id: null,
		prompt: null,
		neg: DEFAULT_NEG,
		w: 1216,
		h: 832,
		steps: 28,
		cfg: 7,
		seed: -1,
		face: null,
		face2: null,
		keepBody: false,
		noSuffix: true
	};
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		const next = () => argv[++i];
		if (a === '--id') out.id = next();
		else if (a === '--prompt') out.prompt = next();
		else if (a === '--neg') out.neg = next();
		else if (a === '--w') out.w = Number(next());
		else if (a === '--h') out.h = Number(next());
		else if (a === '--steps') out.steps = Number(next());
		else if (a === '--cfg') out.cfg = Number(next());
		else if (a === '--seed') out.seed = Number(next());
		else if (a === '--face') out.face = next();
		else if (a === '--face2') out.face2 = next();
		else if (a === '--keep-body') out.keepBody = true;
		else if (a === '--suffix') out.noSuffix = false;
		else if (a === '--help' || a === '-h') out.help = true;
	}
	return out;
}

function houseSuffix() {
	const p = join(ROOT, 'src/lib/data/image-prompt-house.json');
	if (!existsSync(p)) return '';
	try {
		const j = JSON.parse(readFileSync(p, 'utf8'));
		return typeof j.suffix === 'string' ? j.suffix.trim() : '';
	} catch {
		return '';
	}
}

function resolveAsset(p) {
	const candidates = [
		resolve(ROOT, p),
		join(ROOT, p),
		join(ROOT, 'static', basename(p)),
		join(ROOT, 'static', p.replace(/^\/?static\//, ''))
	];
	for (const c of candidates) {
		if (existsSync(c)) return c;
	}
	throw new Error(`Ref not found: ${p}`);
}

function findAssetsDir() {
	const home = process.env.HOME || '';
	const base = join(home, '.cursor/projects');
	const fallback = join(ROOT, 'scripts/.cache/out');
	if (!existsSync(base)) {
		mkdirSync(fallback, { recursive: true });
		return fallback;
	}
	const projects = readdirSync(base);
	const prefer = projects.filter((p) => /kingdom/i.test(p));
	for (const proj of prefer) {
		const assets = join(base, proj, 'assets');
		mkdirSync(assets, { recursive: true });
		return assets;
	}
	mkdirSync(fallback, { recursive: true });
	return fallback;
}

function mimeFor(path) {
	const b = path.toLowerCase();
	if (b.endsWith('.jpg') || b.endsWith('.jpeg')) return 'image/jpeg';
	if (b.endsWith('.webp')) return 'image/webp';
	return 'image/png';
}

async function upload(absPath) {
	const buf = readFileSync(absPath);
	const file = new File([buf], basename(absPath), { type: mimeFor(absPath) });
	const url = await fal.storage.upload(file);
	console.log(`  uploaded ${basename(absPath)}`);
	return url;
}

async function uploadBuf(buf, name) {
	const file = new File([buf], name, { type: 'image/png' });
	const url = await fal.storage.upload(file);
	console.log(`  uploaded ${name} (buffer)`);
	return url;
}

async function download(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Download failed: ${res.status}`);
	return Buffer.from(await res.arrayBuffer());
}

const PONY_MODEL =
	process.env.FAL_PONY_MODEL ||
	'https://huggingface.co/AstraliteHeart/pony-diffusion-v6/resolve/main/v6.safetensors';

async function ponyBody(opts, prompt) {
	// pony-v7 returns solid black for NSFW on many accounts even with safety off.
	// fal-ai/lora + Pony V6 XL with no IP-Adapter is the reliable NSFW body path.
	const input = {
		model_name: PONY_MODEL,
		prompt,
		negative_prompt: opts.neg,
		image_size: { width: opts.w, height: opts.h },
		num_inference_steps: Math.max(20, opts.steps),
		guidance_scale: opts.cfg >= 6 ? opts.cfg : 7,
		num_images: 1,
		enable_safety_checker: false,
		image_format: 'png',
		scheduler: 'Euler A',
		clip_skip: 2,
		...(opts.seed >= 0 ? { seed: opts.seed } : {})
	};
	console.log(`Fal fal-ai/lora · Pony V6 XL (no refs) · ${opts.w}×${opts.h}`);
	try {
		const result = await fal.subscribe('fal-ai/lora', {
			input,
			logs: true,
			onQueueUpdate: (update) => {
				if (update.status === 'IN_PROGRESS' && update.logs?.length) {
					const last = update.logs[update.logs.length - 1];
					if (last?.message) console.log(`  ${last.message}`);
				}
			}
		});
		const url = result.data?.images?.[0]?.url;
		if (!url) throw new Error(`No image: ${JSON.stringify(result.data).slice(0, 300)}`);
		const buf = await download(url);
		if (buf.length < 80000) {
			throw new Error(`Body looks blank/black (${buf.length} bytes) — NSFW may have been censored`);
		}
		return buf;
	} catch (err) {
		const detail = err?.body ? JSON.stringify(err.body) : err?.message || String(err);
		throw new Error(`pony body failed: ${detail}`);
	}
}

async function faceSwap(baseUrl, faceUrl, label) {
	console.log(`Fal fal-ai/face-swap · ${label}`);
	try {
		const result = await fal.subscribe('fal-ai/face-swap', {
			input: {
				base_image_url: baseUrl,
				swap_image_url: faceUrl
			},
			logs: false
		});
		const url = result.data?.image?.url ?? result.data?.images?.[0]?.url;
		if (!url) throw new Error(`No swap image: ${JSON.stringify(result.data).slice(0, 300)}`);
		return { url, buf: await download(url) };
	} catch (err) {
		const detail = err?.body ? JSON.stringify(err.body) : err?.message || String(err);
		throw new Error(`face-swap failed (${label}): ${detail}`);
	}
}

function usage() {
	console.log(`Usage:
  node scripts/generate-nsfw-pony-swap.mjs --id <slot> --prompt "…" \\
    --face static/ch_gumil_wife.png [--face2 static/ch_pumsuk.png] \\
    [--w 1216] [--h 832] [--steps 28] [--cfg 3.5] [--seed N] [--suffix]`);
}

async function main() {
	loadEnvFiles();
	const opts = parseArgs(process.argv.slice(2));
	if (opts.help || !opts.id || !opts.prompt || !opts.face) {
		usage();
		process.exit(opts.help ? 0 : 1);
	}
	if (!process.env.FAL_KEY) throw new Error('FAL_KEY missing');
	fal.config({ credentials: process.env.FAL_KEY });

	const suffix = opts.noSuffix ? '' : houseSuffix();
	const prompt = suffix ? `${opts.prompt.trim()} ${suffix}` : opts.prompt.trim();

	const bodyBuf = await ponyBody(opts, prompt);
	const cacheDir = join(ROOT, 'scripts/.cache/out');
	mkdirSync(cacheDir, { recursive: true });
	const bodyPath = join(cacheDir, `${opts.id}.body.png`);
	writeFileSync(bodyPath, bodyBuf);
	console.log(`  body → ${bodyPath}`);

	const faceUrl = await upload(resolveAsset(opts.face));
	const baseUrl = await uploadBuf(bodyBuf, `${opts.id}.body.png`);
	let outBuf = bodyBuf;
	let curUrl = baseUrl;
	try {
		const swapped = await faceSwap(baseUrl, faceUrl, basename(opts.face));
		outBuf = swapped.buf;
		curUrl = swapped.url;
	} catch (e) {
		console.warn(`  primary face-swap skipped: ${e.message}`);
		console.warn('  keeping body (no detectable face to swap)');
	}

	if (opts.face2) {
		const face2Url = await upload(resolveAsset(opts.face2));
		const afterFirst = await uploadBuf(outBuf, `${opts.id}.swap1.png`);
		try {
			const second = await faceSwap(afterFirst, face2Url, basename(opts.face2));
			outBuf = second.buf;
			curUrl = second.url;
		} catch (e) {
			console.warn(`  face2 swap skipped: ${e.message}`);
		}
	}

	if (opts.keepBody) {
		/* already saved */
	}

	const dir = findAssetsDir();
	const outPath = join(dir, `${opts.id}.png`);
	writeFileSync(outPath, outBuf);
	console.log(`Wrote ${outPath} (${outBuf.length} bytes)`);
	console.log(`  last url ${curUrl?.slice(0, 70)}…`);
	console.log(`Next: node scripts/install-temp-art.mjs <manifest.json>`);
}

main().catch((err) => {
	console.error(err.message || err);
	process.exit(1);
});
