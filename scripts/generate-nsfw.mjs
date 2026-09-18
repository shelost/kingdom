#!/usr/bin/env node
/**
 * Generate an NSFW chronicle still — Fal (refs + NSFW) or Draw Things local.
 *
 * Preferred: Fal `fal-ai/lora` with Pony Diffusion V6 XL + IP-Adapter face refs.
 * Requires FAL_KEY in `.env` / `.env.local` / the environment.
 *
 *   node scripts/generate-nsfw.mjs --id nsfw-sosuno-grind-fit \
 *     --prompt "…" \
 *     --ref static/ch_sosuno.png \
 *     --ref static/ch_jumong.png
 *
 * Fallback when --provider drawthings or no FAL_KEY:
 *   Draw Things A1111 API at 127.0.0.1:7860 (txt2img only — no refs).
 *
 * Writes {id}.png into the Cursor assets folder for install-temp-art.mjs.
 * Appends the house prompt suffix from image-prompt-house.json.
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
	'extra limbs, fused fingers, deformed hands';

const PONY_MODEL =
	process.env.FAL_PONY_MODEL ||
	'https://huggingface.co/AstraliteHeart/pony-diffusion-v6/resolve/main/v6.safetensors';

/** SDXL IP-Adapter Plus Face — keeps likeness without cloning portrait pose. */
const IP_ADAPTER_FACE = {
	path: 'h94/IP-Adapter',
	model_subfolder: 'sdxl_models',
	weight_name: 'ip-adapter-plus-face_sdxl_vit-h.bin'
};

const IP_ADAPTER_PLUS = {
	path: 'h94/IP-Adapter',
	model_subfolder: 'sdxl_models',
	weight_name: 'ip-adapter-plus_sdxl_vit-h.bin'
};

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
		w: 832,
		h: 1216,
		steps: 28,
		cfg: 7,
		seed: -1,
		provider: null, // 'fal' | 'drawthings' | null = auto
		faceScale: 0.72,
		placeScale: 0.45,
		refs: [],
		faceRefs: [],
		placeRefs: []
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
		else if (a === '--provider') out.provider = next();
		else if (a === '--face-scale') out.faceScale = Number(next());
		else if (a === '--place-scale') out.placeScale = Number(next());
		else if (a === '--ref') out.refs.push(next());
		else if (a === '--face') out.faceRefs.push(next());
		else if (a === '--place') out.placeRefs.push(next());
		else if (a === '--no-suffix') out.noSuffix = true;
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
	if (!p) return null;
	const abs = p.startsWith('/') && !p.startsWith(ROOT) ? join(ROOT, p.replace(/^\//, '')) : resolve(ROOT, p);
	const candidates = [
		abs,
		join(ROOT, p),
		join(ROOT, 'static', basename(p)),
		join(ROOT, 'static', p.replace(/^\/?static\//, ''))
	];
	for (const c of candidates) {
		if (existsSync(c)) return c;
	}
	throw new Error(`Ref not found: ${p}`);
}

function classifyRef(path) {
	const b = basename(path).toLowerCase();
	if (b.startsWith('ch_') || b.startsWith('bn_')) return 'face';
	if (b.startsWith('pl_') || b.startsWith('ar_')) return 'place';
	return 'face';
}

function findAssetsDir(id) {
	const home = process.env.HOME || '';
	const base = join(home, '.cursor/projects');
	const fallback = join(ROOT, 'scripts/.cache/out');
	if (!existsSync(base)) {
		mkdirSync(fallback, { recursive: true });
		return fallback;
	}

	const projects = readdirSync(base);
	const prefer = projects.filter((p) => /kingdom/i.test(p));
	const rest = projects.filter((p) => !/kingdom/i.test(p));
	for (const proj of [...prefer, ...rest]) {
		const assets = join(base, proj, 'assets');
		if (!existsSync(assets) && prefer.includes(proj)) {
			mkdirSync(assets, { recursive: true });
			return assets;
		}
		if (existsSync(assets)) {
			if (prefer.includes(proj)) return assets;
		}
	}
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

async function uploadRef(absPath) {
	const buf = readFileSync(absPath);
	const file = new File([buf], basename(absPath), { type: mimeFor(absPath) });
	const url = await fal.storage.upload(file);
	console.log(`  uploaded ${basename(absPath)} → ${url.slice(0, 64)}…`);
	return url;
}

async function generateFal(opts, fullPrompt) {
	const key = process.env.FAL_KEY;
	if (!key) throw new Error('FAL_KEY missing. Add it to .env / .env.local.');
	fal.config({ credentials: key });

	const facePaths = [...opts.faceRefs];
	const placePaths = [...opts.placeRefs];
	for (const r of opts.refs) {
		if (classifyRef(r) === 'place') placePaths.push(r);
		else facePaths.push(r);
	}

	const faceUrls = [];
	for (const r of facePaths) {
		faceUrls.push(await uploadRef(resolveAsset(r)));
	}
	const placeUrls = [];
	for (const r of placePaths) {
		placeUrls.push(await uploadRef(resolveAsset(r)));
	}

	const ip_adapter = [];
	if (faceUrls.length) {
		ip_adapter.push({
			...IP_ADAPTER_FACE,
			ip_adapter_image_url: faceUrls.length === 1 ? faceUrls[0] : faceUrls,
			scale: opts.faceScale
		});
	}
	if (placeUrls.length) {
		ip_adapter.push({
			...IP_ADAPTER_PLUS,
			ip_adapter_image_url: placeUrls.length === 1 ? placeUrls[0] : placeUrls,
			scale: opts.placeScale
		});
	}

	const input = {
		model_name: PONY_MODEL,
		prompt: fullPrompt,
		negative_prompt: opts.neg,
		image_size: { width: opts.w, height: opts.h },
		num_inference_steps: Math.max(20, opts.steps),
		guidance_scale: opts.cfg,
		num_images: 1,
		enable_safety_checker: false,
		image_format: 'png',
		scheduler: 'Euler A',
		clip_skip: 2,
		...(opts.seed >= 0 ? { seed: opts.seed } : {}),
		...(ip_adapter.length
			? {
					image_encoder_path: 'h94/IP-Adapter',
					image_encoder_subfolder: 'models/image_encoder',
					ip_adapter
				}
			: {})
	};

	console.log(
		`Fal fal-ai/lora · Pony V6 XL · ${opts.w}×${opts.h} · faces=${faceUrls.length} places=${placeUrls.length}`
	);

	let result;
	try {
		result = await fal.subscribe('fal-ai/lora', {
			input,
			logs: true,
			onQueueUpdate: (update) => {
				if (update.status === 'IN_PROGRESS' && update.logs?.length) {
					const last = update.logs[update.logs.length - 1];
					if (last?.message) console.log(`  ${last.message}`);
				}
			}
		});
	} catch (err) {
		const detail = err?.body ? JSON.stringify(err.body) : err?.message || String(err);
		throw new Error(`Fal request failed: ${detail}`);
	}

	const images = result.data?.images;
	const url = images?.[0]?.url;
	if (!url) {
		throw new Error(`Fal returned no image: ${JSON.stringify(result.data).slice(0, 400)}`);
	}
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Download failed: ${res.status}`);
	const buf = Buffer.from(await res.arrayBuffer());
	if (result.data?.has_nsfw_concepts?.[0]) {
		console.log('  (fal flagged NSFW concepts — kept; safety checker was off)');
	}
	return buf;
}

async function generateDrawThings(opts, fullPrompt) {
	const base = process.env.DRAWTHINGS_URL || 'http://127.0.0.1:7860';
	const body = {
		prompt: fullPrompt,
		negative_prompt: opts.neg,
		width: opts.w,
		height: opts.h,
		steps: opts.steps,
		cfg_scale: opts.cfg,
		seed: opts.seed,
		sampler_name: 'Euler a'
	};
	console.log(`Draw Things ${base}/sdapi/v1/txt2img · ${opts.w}×${opts.h} (no ref support)`);
	const res = await fetch(`${base}/sdapi/v1/txt2img`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`Draw Things ${res.status}: ${t.slice(0, 300)}`);
	}
	const json = await res.json();
	const b64 = json.images?.[0];
	if (!b64) throw new Error('Draw Things returned no images');
	return Buffer.from(b64, 'base64');
}

function usage() {
	console.log(`Usage:
  node scripts/generate-nsfw.mjs --id <slot-id> --prompt "…" \\
    [--ref static/ch_sosuno.png] [--face …] [--place static/pl_….png] \\
    [--provider fal|drawthings] [--w 832] [--h 1216] [--steps 28] [--cfg 7]

Env:
  FAL_KEY              required for Fal (also read from .env / .env.local)
  FAL_PONY_MODEL       override Pony checkpoint URL
  DRAWTHINGS_URL       default http://127.0.0.1:7860

Auto provider: Fal when FAL_KEY is set, else Draw Things.`);
}

async function main() {
	loadEnvFiles();
	const opts = parseArgs(process.argv.slice(2));
	if (opts.help || !opts.id || !opts.prompt) {
		usage();
		process.exit(opts.help ? 0 : 1);
	}

	const suffix = opts.noSuffix ? '' : houseSuffix();
	const fullPrompt = suffix ? `${opts.prompt.trim()} ${suffix}` : opts.prompt.trim();

	const provider =
		opts.provider || (process.env.FAL_KEY ? 'fal' : 'drawthings');

	let buf;
	if (provider === 'fal') {
		buf = await generateFal(opts, fullPrompt);
	} else if (provider === 'drawthings') {
		if (opts.refs.length || opts.faceRefs.length || opts.placeRefs.length) {
			console.warn('Warning: Draw Things path ignores --ref/--face/--place. Use --provider fal.');
		}
		buf = await generateDrawThings(opts, fullPrompt);
	} else {
		throw new Error(`Unknown provider: ${provider}`);
	}

	const dir = findAssetsDir(opts.id);
	const outPath = join(dir, `${opts.id}.png`);
	writeFileSync(outPath, buf);
	console.log(`Wrote ${outPath} (${buf.length} bytes)`);
	console.log(`Next: node scripts/install-temp-art.mjs <manifest.json>  # id=${opts.id}`);
}

main().catch((err) => {
	console.error(err.message || err);
	process.exit(1);
});
