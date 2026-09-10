import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { RequestHandler } from './$types';
import type { GalleryDeleteItem, GalleryDeleteRequest } from '$lib/galleryDelete';

const ROOT = path.resolve('.');
const STATIC_ROOT = path.resolve(ROOT, 'static');
const TEMP_DIR = path.resolve(STATIC_ROOT, 'temp');
const STORY_FILE = path.resolve(ROOT, 'src/lib/data/story.json');
const PEOPLE_FILE = path.resolve(ROOT, 'src/lib/data/image-people.json');
const INVENTORY_FILE = path.resolve(ROOT, 'src/lib/tempArtInventory.ts');

const MAX_ITEMS = 200;
const PORTRAIT_FILE = /^(ch_|pl_|bn_|sword_|flag)/i;

type StorySlot = {
	id?: string;
	src?: string;
	tempImage?: string;
	refs?: unknown;
};

type StoryEntry = {
	images?: StorySlot[];
};

type StoryChapter = {
	entries?: StoryEntry[];
};

function asItems(body: unknown): GalleryDeleteItem[] {
	if (!body || typeof body !== 'object') error(400, 'Expected a JSON object');
	const items = (body as GalleryDeleteRequest).items;
	if (!Array.isArray(items) || items.length === 0) error(400, 'Expected items: []');
	if (items.length > MAX_ITEMS) error(400, `At most ${MAX_ITEMS} stills per request`);
	const out: GalleryDeleteItem[] = [];
	for (const raw of items) {
		if (!raw || typeof raw !== 'object') error(400, 'Invalid delete item');
		const kind = (raw as GalleryDeleteItem).kind;
		if (kind === 'cue') {
			const slotId = (raw as { slotId?: unknown }).slotId;
			if (typeof slotId !== 'string' || !slotId.trim() || slotId.includes('/') || slotId.includes('\\')) {
				error(400, 'Invalid cue slot id');
			}
			out.push({ kind: 'cue', slotId: slotId.trim() });
			continue;
		}
		if (kind === 'orphan') {
			const id = (raw as { id?: unknown }).id;
			if (typeof id !== 'string' || !id.trim() || id.includes('/') || id.includes('\\')) {
				error(400, 'Invalid orphan id');
			}
			out.push({ kind: 'orphan', id: id.trim() });
			continue;
		}
		error(400, 'Each item needs kind "cue" or "orphan"');
	}
	return out;
}

function publicPath(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	const trimmed = value.trim().split('?')[0] ?? '';
	if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return undefined;
	return trimmed;
}

function artKey(pathOrId: string): string {
	const raw = pathOrId.trim().split('?')[0] ?? '';
	if (!raw) return '';
	const base = raw.split('/').pop() ?? raw;
	return base.replace(/\.[^.]+$/i, '').replace(/_/g, '-').toLowerCase();
}

/** Map `/temp/foo.jpg` → absolute file under `static/`, or null if it escapes. */
function resolveUnderStatic(publicUrl: string): string | null {
	const rel = publicUrl.replace(/^\/+/, '');
	if (!rel) return null;
	const abs = path.resolve(STATIC_ROOT, rel);
	const fromRoot = path.relative(STATIC_ROOT, abs);
	if (!fromRoot || fromRoot.startsWith('..') || path.isAbsolute(fromRoot)) return null;
	return abs;
}

function isProtectedFile(abs: string): boolean {
	return PORTRAIT_FILE.test(path.basename(abs));
}

function addPath(set: Set<string>, value: unknown) {
	const p = publicPath(value);
	if (p) set.add(p);
}

function referencedPublicPaths(chapters: StoryChapter[]): Set<string> {
	const out = new Set<string>();
	for (const ch of chapters) {
		for (const entry of ch.entries ?? []) {
			for (const slot of entry.images ?? []) {
				addPath(out, slot.src);
				addPath(out, slot.tempImage);
				if (Array.isArray(slot.refs)) {
					for (const ref of slot.refs) addPath(out, ref);
				}
			}
		}
	}
	return out;
}

function referencedArtKeys(chapters: StoryChapter[]): Set<string> {
	const keys = new Set<string>();
	for (const ch of chapters) {
		for (const entry of ch.entries ?? []) {
			for (const slot of entry.images ?? []) {
				if (typeof slot.id === 'string') {
					const k = artKey(slot.id);
					if (k) keys.add(k);
				}
				for (const value of [slot.src, slot.tempImage]) {
					const k = artKey(typeof value === 'string' ? value : '');
					if (k) keys.add(k);
				}
				if (Array.isArray(slot.refs)) {
					for (const ref of slot.refs) {
						const k = artKey(typeof ref === 'string' ? ref : '');
						if (k) keys.add(k);
					}
				}
			}
		}
	}
	return keys;
}

async function unlinkAllowed(abs: string): Promise<string | null> {
	if (isProtectedFile(abs)) return null;
	try {
		await fs.unlink(abs);
		return path.relative(STATIC_ROOT, abs).split(path.sep).join('/');
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
		throw err;
	}
}

/** Drop Map lines for deleted `/temp/…` files without regenerating the whole inventory. */
async function pruneTempInventory(gonePublic: Set<string>) {
	if (!gonePublic.size) return;
	let text: string;
	try {
		text = await fs.readFile(INVENTORY_FILE, 'utf-8');
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code === 'ENOENT') return;
		throw err;
	}
	const next = text
		.split('\n')
		.filter((line) => {
			const m = line.match(/^\t\['([^']+)', '([^']+)'\],?\s*$/);
			if (!m) return true;
			return !gonePublic.has(m[2]);
		})
		.join('\n');
	if (next !== text) await fs.writeFile(INVENTORY_FILE, next);
}

async function handleDelete(request: Request) {
	if (!dev) error(403, 'Image delete only runs in local dev, where files are on disk');

	const items = asItems(await request.json());
	const rawStory = JSON.parse(await fs.readFile(STORY_FILE, 'utf-8')) as StoryChapter[];
	if (!Array.isArray(rawStory)) error(500, 'story.json is not an array');

	const cueIds = new Set<string>();
	const orphanIds = new Set<string>();
	for (const item of items) {
		if (item.kind === 'cue') cueIds.add(item.slotId);
		else orphanIds.add(item.id);
	}

	const deleted: GalleryDeleteItem[] = [];
	const candidatePaths = new Set<string>();
	const deletedSlotKeys = new Set<string>();

	if (cueIds.size) {
		for (const ch of rawStory) {
			for (const entry of ch.entries ?? []) {
				const images = entry.images;
				if (!Array.isArray(images) || !images.length) continue;
				const next: StorySlot[] = [];
				for (const slot of images) {
					const id = typeof slot.id === 'string' ? slot.id : '';
					if (!id || !cueIds.has(id)) {
						next.push(slot);
						continue;
					}
					addPath(candidatePaths, slot.src);
					addPath(candidatePaths, slot.tempImage);
					deletedSlotKeys.add(artKey(id));
					if (slot.src) deletedSlotKeys.add(artKey(slot.src));
					if (slot.tempImage) deletedSlotKeys.add(artKey(slot.tempImage));
					deleted.push({ kind: 'cue', slotId: id });
				}
				entry.images = next;
			}
		}
	}

	const remainingPaths = referencedPublicPaths(rawStory);
	const remainingKeys = referencedArtKeys(rawStory);

	if (orphanIds.size) {
		let tempNames: string[] = [];
		try {
			tempNames = await fs.readdir(TEMP_DIR);
		} catch (err) {
			if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
		}
		const byStem = new Map<string, string>();
		for (const name of tempNames) {
			if (name.includes('..') || name.includes('/') || name.includes('\\')) continue;
			if (!/\.(jpe?g|png|webp)$/i.test(name)) continue;
			byStem.set(name.replace(/\.[^.]+$/i, ''), name);
		}
		for (const id of orphanIds) {
			const name = byStem.get(id);
			if (!name) error(404, `Orphan ${id} is not a file in static/temp/`);
			const publicUrl = `/temp/${name}`;
			if (remainingPaths.has(publicUrl) || remainingKeys.has(artKey(id))) {
				error(400, `${id} is still referenced by the chronicle`);
			}
			candidatePaths.add(publicUrl);
			deleted.push({ kind: 'orphan', id });
		}
	}

	if (!deleted.length) error(404, 'None of those stills were found');

	const files: string[] = [];
	const seenAbs = new Set<string>();

	for (const publicUrl of candidatePaths) {
		const abs = resolveUnderStatic(publicUrl);
		if (!abs || seenAbs.has(abs)) continue;
		seenAbs.add(abs);
		if (remainingPaths.has(publicUrl)) continue;
		const rel = await unlinkAllowed(abs);
		if (rel) files.push(rel);
	}

	try {
		const tempNames = await fs.readdir(TEMP_DIR);
		for (const name of tempNames) {
			if (name.includes('..') || name.includes('/') || name.includes('\\')) continue;
			if (!/\.(jpe?g|png|webp)$/i.test(name)) continue;
			const key = artKey(name);
			if (!deletedSlotKeys.has(key) || remainingKeys.has(key)) continue;
			const abs = path.resolve(TEMP_DIR, name);
			if (path.relative(TEMP_DIR, abs).startsWith('..')) continue;
			if (seenAbs.has(abs)) continue;
			seenAbs.add(abs);
			const rel = await unlinkAllowed(abs);
			if (rel) files.push(rel);
		}
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
	}

	const removedCueIds = [...new Set(deleted.filter((d) => d.kind === 'cue').map((d) => d.slotId))];
	if (removedCueIds.length) {
		await fs.writeFile(STORY_FILE, JSON.stringify(rawStory, null, '\t') + '\n');
		try {
			const people = JSON.parse(await fs.readFile(PEOPLE_FILE, 'utf-8')) as Record<string, unknown>;
			let changed = false;
			for (const id of removedCueIds) {
				if (id in people) {
					delete people[id];
					changed = true;
				}
			}
			if (changed) {
				await fs.writeFile(PEOPLE_FILE, JSON.stringify(people, null, '  ') + '\n');
			}
		} catch (err) {
			if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
		}
	}

	await pruneTempInventory(new Set(files.map((rel) => `/${rel}`)));

	return json({ ok: true, deleted, files } satisfies { ok: true; deleted: GalleryDeleteItem[]; files: string[] });
}

export const POST: RequestHandler = async ({ request }) => handleDelete(request);

export const DELETE: RequestHandler = async ({ request }) => handleDelete(request);
