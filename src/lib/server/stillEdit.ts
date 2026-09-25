/**
 * Fal-backed chronicle still edits (remove bg / prompt edit / outpaint).
 * Dev-only. Backs up the current plate under static/temp/_orig before overwrite.
 * Not a NSFW generator — do not call Pony / generate-nsfw from here.
 */
import { fal } from '@fal-ai/client';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import { existsSync, mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { env } from '$env/dynamic/private';
import { armSkipChronicleHmr } from '$lib/server/chronicleHmr';
import {
	isStillEditOp,
	isStillExpandAspect,
	type StillEditOp,
	type StillEditRequest,
	type StillEditResponse,
	type StillExpandAspect
} from '$lib/stillEdit';

const ROOT = path.resolve('.');
const STATIC_ROOT = path.resolve(ROOT, 'static');
const TEMP_DIR = path.resolve(STATIC_ROOT, 'temp');
const ORIG_DIR = path.resolve(TEMP_DIR, '_orig');
const STORY_FILE = path.resolve(ROOT, 'src/lib/data/story.json');
const HOUSE_FILE = path.resolve(ROOT, 'src/lib/data/image-prompt-house.json');
const MAX_EDGE = 1200;
const JPEG_QUALITY = '72';

type StorySlot = {
	id?: string;
	src?: string;
	tempImage?: string;
	refs?: unknown;
	prompt?: string;
};

type StoryEntry = { images?: StorySlot[] };
type StoryChapter = { entries?: StoryEntry[] };

export function falKey(): string {
	return env.FAL_KEY?.trim() || '';
}

export function stillEditAvailable(): boolean {
	return Boolean(falKey());
}

function publicPath(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	const trimmed = value.trim().split('?')[0] ?? '';
	if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return undefined;
	return trimmed;
}

function resolveUnderStatic(publicUrl: string): string | null {
	const rel = publicUrl.replace(/^\/+/, '');
	if (!rel) return null;
	const abs = path.resolve(STATIC_ROOT, rel);
	const fromRoot = path.relative(STATIC_ROOT, abs);
	if (!fromRoot || fromRoot.startsWith('..') || path.isAbsolute(fromRoot)) return null;
	return abs;
}

function findSlot(chapters: StoryChapter[], slotId: string): StorySlot | null {
	for (const ch of chapters) {
		for (const entry of ch.entries ?? []) {
			for (const slot of entry.images ?? []) {
				if (slot.id === slotId) return slot;
			}
		}
	}
	return null;
}

function candidateFiles(slot: StorySlot): string[] {
	const out: string[] = [];
	const seen = new Set<string>();
	const add = (abs: string | null) => {
		if (!abs || seen.has(abs) || !existsSync(abs)) return;
		seen.add(abs);
		out.push(abs);
	};
	for (const value of [slot.src, slot.tempImage]) {
		const pub = publicPath(value);
		if (pub) add(resolveUnderStatic(pub));
	}
	if (typeof slot.id === 'string') {
		for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
			add(path.resolve(TEMP_DIR, `${slot.id}${ext}`));
		}
	}
	return out;
}

function mimeOf(abs: string): string {
	const ext = path.extname(abs).slice(1).toLowerCase();
	if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
	if (ext === 'png') return 'image/png';
	if (ext === 'webp') return 'image/webp';
	if (ext === 'gif') return 'image/gif';
	return 'application/octet-stream';
}

function dataUri(abs: string): string {
	const buf = readFileSync(abs);
	return `data:${mimeOf(abs)};base64,${buf.toString('base64')}`;
}

function sipsResize(src: string, dest: string, format: 'jpeg' | 'png') {
	const args =
		format === 'jpeg'
			? [
					'-s',
					'format',
					'jpeg',
					'-s',
					'formatOptions',
					JPEG_QUALITY,
					'-Z',
					String(MAX_EDGE),
					src,
					'--out',
					dest
				]
			: ['-s', 'format', 'png', '-Z', String(MAX_EDGE), src, '--out', dest];
	execFileSync('sips', args, { stdio: 'ignore' });
}

function pixelSize(abs: string): { width: number; height: number } {
	try {
		const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', abs], {
			encoding: 'utf8'
		});
		const w = Number(/pixelWidth:\s*(\d+)/.exec(out)?.[1]);
		const h = Number(/pixelHeight:\s*(\d+)/.exec(out)?.[1]);
		if (w > 0 && h > 0) return { width: w, height: h };
	} catch {
		/* fall through */
	}
	return { width: 1200, height: 675 };
}

function houseSuffix(): string {
	try {
		const house = JSON.parse(readFileSync(HOUSE_FILE, 'utf8')) as { suffix?: unknown };
		return typeof house.suffix === 'string' ? house.suffix.trim() : '';
	} catch {
		return '';
	}
}

function withHouse(prompt: string): string {
	const suffix = houseSuffix();
	if (!suffix || prompt.includes(suffix)) return prompt;
	return `${prompt.trim()} ${suffix}`;
}

function expandPixels(
	width: number,
	height: number,
	aspect: StillExpandAspect
): { expand_left: number; expand_right: number; expand_top: number; expand_bottom: number } {
	const target =
		aspect === '16:9' ? 16 / 9 : aspect === '9:16' ? 9 / 16 : aspect === '4:3' ? 4 / 3 : 1;
	const current = width / height;
	const round = (n: number) => Math.max(0, Math.round(n));
	if (Math.abs(current - target) < 0.02) {
		const padW = Math.round(width * 0.12);
		const padH = Math.round(height * 0.12);
		return { expand_left: padW, expand_right: padW, expand_top: padH, expand_bottom: padH };
	}
	if (target > current) {
		const extra = width * (target / current - 1);
		const half = round(extra / 2);
		return { expand_left: half, expand_right: half, expand_top: 0, expand_bottom: 0 };
	}
	const extra = height * (current / target - 1);
	const half = round(extra / 2);
	return { expand_left: 0, expand_right: 0, expand_top: half, expand_bottom: half };
}

function faceRefUris(slot: StorySlot): string[] {
	if (!Array.isArray(slot.refs)) return [];
	const uris: string[] = [];
	for (const ref of slot.refs) {
		if (typeof ref !== 'string') continue;
		const pub = publicPath(ref);
		if (!pub) continue;
		const base = path.basename(pub);
		if (!/^ch_/i.test(base) || /binyeo/i.test(base)) continue;
		const abs = resolveUnderStatic(pub);
		if (!abs || !existsSync(abs)) continue;
		uris.push(dataUri(abs));
		if (uris.length >= 3) break;
	}
	return uris;
}

type FalResult = { data?: unknown };

function falImageUrl(data: unknown): string | null {
	if (!data || typeof data !== 'object') return null;
	const rec = data as Record<string, unknown>;
	const image = rec.image;
	if (image && typeof image === 'object' && typeof (image as { url?: unknown }).url === 'string') {
		return (image as { url: string }).url;
	}
	const images = rec.images;
	if (Array.isArray(images) && images[0] && typeof images[0] === 'object') {
		const url = (images[0] as { url?: unknown }).url;
		if (typeof url === 'string') return url;
	}
	return null;
}

async function falRun(model: string, input: Record<string, unknown>): Promise<{ url: string; model: string }> {
	const key = falKey();
	if (!key) throw new Error('FAL_KEY is not set');
	fal.config({ credentials: key });
	const result = (await fal.subscribe(model, { input, logs: false })) as FalResult;
	const url = falImageUrl(result.data);
	if (!url) throw new Error(`${model} returned no image`);
	return { url, model };
}

async function downloadBytes(url: string): Promise<Buffer> {
	if (url.startsWith('data:')) {
		const comma = url.indexOf(',');
		return Buffer.from(url.slice(comma + 1), 'base64');
	}
	const res = await fetch(url);
	if (!res.ok) throw new Error(`download failed (${res.status})`);
	return Buffer.from(await res.arrayBuffer());
}

async function unlinkIfExists(abs: string) {
	try {
		await fs.unlink(abs);
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
	}
}

function backupOnce(sourceAbs: string, slotId: string): string | undefined {
	mkdirSync(ORIG_DIR, { recursive: true });
	const dest = path.join(ORIG_DIR, `${slotId}${path.extname(sourceAbs) || '.jpg'}`);
	if (existsSync(dest)) return `/temp/_orig/${path.basename(dest)}`;
	copyFileSync(sourceAbs, dest);
	return `/temp/_orig/${path.basename(dest)}`;
}

const CHRONICLE_EDIT_GUARD =
	'Keep the same people, faces, garments, and Korean place. Do not invent a new face. No readable text. No watermark.';

async function runOp(
	op: StillEditOp,
	imageUri: string,
	slot: StorySlot,
	prompt: string,
	aspect: StillExpandAspect,
	sourceAbs: string
): Promise<{ url: string; model: string; ext: 'png' | 'jpg' }> {
	if (op === 'remove-bg') {
		try {
			const out = await falRun('fal-ai/birefnet', {
				image_url: imageUri,
				model: 'Portrait',
				refine_foreground: true,
				output_format: 'png'
			});
			return { ...out, ext: 'png' };
		} catch (first) {
			try {
				const out = await falRun('fal-ai/imageutils/rembg', { image_url: imageUri });
				return { ...out, ext: 'png' };
			} catch {
				throw first;
			}
		}
	}

	if (op === 'prompt-edit') {
		const scene = withHouse(`${prompt.trim()} ${CHRONICLE_EDIT_GUARD}`);
		const refs = [imageUri, ...faceRefUris(slot)];
		try {
			const out = await falRun('fal-ai/flux-2-pro/edit', {
				prompt: scene,
				image_urls: refs,
				output_format: 'jpeg',
				safety_tolerance: '5'
			});
			return { ...out, ext: 'jpg' };
		} catch (first) {
			try {
				const out = await falRun('fal-ai/flux-pro/kontext', {
					prompt: scene,
					image_url: imageUri,
					output_format: 'jpeg',
					safety_tolerance: 5
				});
				return { ...out, ext: 'jpg' };
			} catch {
				throw first;
			}
		}
	}

	const { width, height } = pixelSize(sourceAbs);
	const expand = expandPixels(width, height, aspect);
	try {
		const out = await falRun('fal-ai/flux-2-pro/outpaint', {
			image_url: imageUri,
			...expand,
			mode: 'fast',
			enable_safety_checker: false,
			output_format: 'jpeg'
		});
		return { ...out, ext: 'jpg' };
	} catch (first) {
		try {
			const size =
				aspect === '16:9'
					? 'landscape_16_9'
					: aspect === '9:16'
						? 'portrait_16_9'
						: aspect === '4:3'
							? 'landscape_4_3'
							: 'square_hd';
			const out = await falRun('fal-ai/flux-pro/kontext', {
				prompt: withHouse(
					`Uncrop and expand this still to ${aspect}. Continue the same scene at the edges. ${CHRONICLE_EDIT_GUARD}`
				),
				image_url: imageUri,
				image_size: size,
				output_format: 'jpeg',
				safety_tolerance: 5
			});
			return { ...out, ext: 'jpg' };
		} catch {
			throw first;
		}
	}
}

export async function editStill(body: StillEditRequest): Promise<StillEditResponse> {
	if (!stillEditAvailable()) {
		throw Object.assign(new Error('FAL_KEY is not set — still tools need fal.ai'), { status: 503 });
	}
	const slotId = body.slotId.trim();
	if (!slotId || slotId.includes('/') || slotId.includes('\\') || !isStillEditOp(body.op)) {
		throw Object.assign(new Error('Expected { slotId, op }'), { status: 400 });
	}
	if (body.op === 'prompt-edit' && !body.prompt?.trim()) {
		throw Object.assign(new Error('Prompt edit needs a prompt'), { status: 400 });
	}
	const aspect: StillExpandAspect =
		body.op === 'expand' && isStillExpandAspect(body.aspect) ? body.aspect : '16:9';

	const rawStory = JSON.parse(await fs.readFile(STORY_FILE, 'utf8')) as StoryChapter[];
	if (!Array.isArray(rawStory)) {
		throw Object.assign(new Error('story.json is not an array'), { status: 500 });
	}
	const slot = findSlot(rawStory, slotId);
	if (!slot) {
		throw Object.assign(new Error(`No cue slot “${slotId}”`), { status: 404 });
	}

	const files = candidateFiles(slot);
	const sourceAbs = files[0];
	if (!sourceAbs) {
		throw Object.assign(new Error('This cue has no still on disk to edit'), { status: 404 });
	}

	const tmp = path.join(os.tmpdir(), `kingdom-edit-${slotId}-${Date.now()}.jpg`);
	try {
		sipsResize(sourceAbs, tmp, 'jpeg');
	} catch {
		/* send original if sips is missing */
	}
	const sendAbs = existsSync(tmp) ? tmp : sourceAbs;
	const imageUri = dataUri(sendAbs);

	const result = await runOp(body.op, imageUri, slot, body.prompt ?? '', aspect, sourceAbs);
	const bytes = await downloadBytes(result.url);
	const scratch = path.join(os.tmpdir(), `kingdom-edit-out-${slotId}-${Date.now()}`);
	await fs.writeFile(scratch, bytes);

	mkdirSync(TEMP_DIR, { recursive: true });
	const backup = backupOnce(sourceAbs, slotId);
	const ext = result.ext;
	const dest = path.resolve(TEMP_DIR, `${slotId}.${ext}`);
	try {
		sipsResize(scratch, dest, ext === 'png' ? 'png' : 'jpeg');
	} catch {
		await fs.copyFile(scratch, dest);
	}

	for (const other of ['.jpg', '.jpeg', '.png', '.webp']) {
		const sibling = path.resolve(TEMP_DIR, `${slotId}${other}`);
		if (sibling !== dest) await unlinkIfExists(sibling);
	}

	const tempImage = `/temp/${slotId}.${ext}`;
	slot.tempImage = tempImage;
	const srcPub = publicPath(slot.src);
	if (srcPub?.startsWith('/temp/')) slot.src = tempImage;

	armSkipChronicleHmr();
	await fs.writeFile(STORY_FILE, JSON.stringify(rawStory, null, '\t') + '\n');

	await unlinkIfExists(tmp);
	await unlinkIfExists(scratch);

	const rev = Date.now();
	return {
		ok: true,
		slotId,
		op: body.op,
		tempImage,
		previewUrl: `${tempImage}?v=${rev}`,
		backup,
		model: result.model
	};
}
