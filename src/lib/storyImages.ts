/**
 * Flatten story cue images in reading order (chapter → entry → beat → image)
 * for the /images gallery. Keeps cue context + temp-art metadata DRY.
 */

import { buildBeats } from '$lib/beats';
import { widgetText } from '$lib/widgets';
import {
	displayArtOf,
	finalArtOf,
	hasArtStack,
	hasGenuineTempRefs,
	isSeedCopyTemp,
	isTempCueImage,
	scriptArtFramesOf,
	tempArtOf,
	type ScriptArtFrame
} from '$lib/cueArt';
import { IMAGE_PEOPLE } from '$lib/imagePeople';
import { avatarOf, byId, isPlaceholderArt, nameOf, PROFILES } from '$lib/people';
import { entryPlace } from '$lib/places';
import { chapters, type Block, type Chapter, type Entry, type ImageSlot } from '$lib/story';
import { TEMP_ART_BY_ID } from '$lib/tempArtInventory';
import { isNsfwCueImage } from '$lib/nsfwCue';
import { SvelteSet } from 'svelte/reactivity';

export {
	artOf,
	displayArtOf,
	finalArtOf,
	hasArtStack,
	hasGenuineTempRefs,
	isSeedCopyTemp,
	isTempCueImage,
	scriptArtFramesOf,
	tempArtOf
} from '$lib/cueArt';

export { isNsfwCueImage } from '$lib/nsfwCue';

export type GalleryView = 'grid' | 'cues';

export interface StoryImageRef {
	/** Person / place id when known. */
	id?: string;
	label: string;
	src: string;
}

/** One cue image in story reading order, with the beat / entry context that triggers it. */
export interface StoryCueImage {
	/** Stable unique key for lists — chapter + entry + beat + index + slot id. */
	key: string;
	chapterId: string;
	chapterTitle: string;
	entryIndex: number;
	entryTitle: string;
	entryYear: string;
	entrySubtitle?: string;
	beatIndex: number;
	imageIndexInBeat: number;
	slot: ImageSlot;
	/**
	 * Gallery display art: temp if present, else final `src`.
	 * Alias of `displayArt` for older call sites. Chronicle reading uses
	 * `displayArtOf(slot, 'reading')` (final first) instead.
	 */
	art: string | undefined;
	/** Gallery preferred art: temp stand-in when available, else final. */
	displayArt: string | undefined;
	/** Locked-in final `src` when present. */
	finalArt: string | undefined;
	/** Explicit / inventory temp path when present. */
	tempArt: string | undefined;
	/** True when both a genuine temp and final exist (hover stack on /images). */
	hasStack: boolean;
	/** True when display is a real temp / placeholder (not a seed copy of final). */
	isTemp: boolean;
	/** Intimate / erotic / close still — gallery NSFW badge. */
	isNsfw: boolean;
	/** Temp file is a trivial sips copy of the final — not a real regeneration. */
	isSeedCopy: boolean;
	/** Unique card title for the gallery (entry · cue label). */
	title: string;
	/** Explicit `refs` on the slot (not inferred). */
	hasExplicitRefs: boolean;
	/** True when any refs are shown (explicit or inferred). */
	hasRefs: boolean;
	/**
	 * Refs are tied to a real temp regeneration (not a seeded jpeg-of-final).
	 * Use this for “temp + refs” badges.
	 */
	hasGenuineRefs: boolean;
	/** Prose / dialogue snippet from the beat that owns this cue. */
	cueContext: string;
	/** Explicit `at` fragment when present. */
	at?: string;
	/** Generation prompt (art direction). */
	prompt?: string;
	/** Input reference images used (or inferred) for generation. */
	refs: StoryImageRef[];
}

/** File under `static/temp/` with no story slot, person, place, or wiki-scene home. */
export interface OrphanedImage {
	id: string;
	src: string;
	kind: 'temp' | 'story';
}

/** Plain text of a block — for cue context labels. */
function textOf(b: Block): string {
	switch (b.kind) {
		case 'p':
		case 'cite':
		case 'quote':
		case 'moral':
		case 'monologue':
			return stripHtml(b.html + ' ' + (b.ko ?? ''));
		case 'dialogue':
			return [...b.lines, ...(b.en ?? [])].join(' ');
		case 'verse':
			return b.lines.join(' ');
		case 'hanja':
			return b.chars.map((c) => c.char + ' ' + c.gloss).join(' ') + ' ' + [b.name, b.note, b.after].filter(Boolean).join(' ');
		case 'map':
			return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
		case 'card':
			return [b.write, b.sub, b.role, b.caption, b.ko].filter(Boolean).join(' ');
		case 'term':
			return [b.hanja, b.reading, b.term, b.html, b.ko].filter(Boolean).join(' ');
		case 'flashback':
			return [b.title, b.year].filter(Boolean).join(' ');
		case 'table':
			return [...b.head, ...b.rows.flat()].join(' ');
		case 'formation':
			return [b.title, b.note, ...b.sides.flatMap((s) => [s.name, ...s.units.map((u) => u.label)])]
				.filter(Boolean)
				.join(' ');
		case 'diagram':
			return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
		default:
			return stripHtml(widgetText(b));
	}
}

function stripHtml(s: string): string {
	return s
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function personIdsNear(blocks: Block[]): string[] {
	const ids: string[] = [];
	for (const b of blocks) {
		if (b.kind === 'dialogue' || b.kind === 'monologue') {
			const id = b.person;
			if (id && !ids.includes(id)) ids.push(id);
		}
		if (b.kind === 'flashback') {
			for (const nested of b.blocks) {
				if (
					(nested.kind === 'dialogue' || nested.kind === 'monologue') &&
					nested.person &&
					!ids.includes(nested.person)
				) {
					ids.push(nested.person);
				}
			}
		}
	}
	return ids;
}

function normalizeRefPath(p: string): string {
	return p.startsWith('/') ? p : `/${p}`;
}

/** Explicit `refs` on the slot, else avatars of people/places near the beat. */
function refsFor(slot: ImageSlot, entry: Entry, beatBlocks: Block[], year: number | null): StoryImageRef[] {
	const out: StoryImageRef[] = [];
	const seen = new Set<string>();

	const push = (src: string | null | undefined, label: string, id?: string) => {
		if (!src || isPlaceholderArt(src) || seen.has(src)) return;
		seen.add(src);
		out.push({ id, label, src });
	};

	const explicit = slot.refs;
	if (Array.isArray(explicit) && explicit.length) {
		for (const raw of explicit) {
			if (typeof raw !== 'string' || !raw.trim()) continue;
			const src = normalizeRefPath(raw.trim());
			const person = [...byId.values()].find((p) => p.avatar === src || avatarOf(p) === src);
			push(src, person ? nameOf(person) : src.split('/').pop() ?? src, person?.id);
		}
		return out;
	}

	for (const id of personIdsNear(beatBlocks)) {
		const p = byId.get(id);
		if (!p) continue;
		push(avatarOf(p, undefined, year), nameOf(p, year), id);
	}

	// Anyone else speaking in the entry (fallback when the beat has no dialogue).
	if (!out.length) {
		for (const id of personIdsNear(entry.blocks ?? [])) {
			const p = byId.get(id);
			if (!p) continue;
			push(avatarOf(p, undefined, year), nameOf(p, year), id);
		}
	}

	const place = entryPlace(entry);
	if (place?.avatar) push(place.avatar, place.name, place.id);

	return out.slice(0, 6);
}

function cueContextFrom(blocks: Block[], at?: string): string {
	const texts = blocks.map(textOf).filter(Boolean);
	if (at?.trim()) {
		const hit = texts.find((t) => t.includes(at.trim()));
		if (hit) return hit.slice(0, 280);
	}
	return texts.slice(0, 2).join(' · ').slice(0, 280);
}

function entryYearNum(entry: Entry, chapter: Chapter): number | null {
	const n = Number(entry.year);
	if (entry.year.trim() !== '' && Number.isFinite(n)) return n;
	const fromRange = Number(chapter.range?.match(/-?\d+/)?.[0]);
	return Number.isFinite(fromRange) ? fromRange : null;
}

/** Humanize a cue id: `blade-south` → `Blade south`, `yeon_sons_table` → `Yeon sons table`. */
export function humanizeCueId(id: string): string {
	const raw = id.replace(/[_-]+/g, ' ').trim();
	if (!raw) return id;
	return raw.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Distinct gallery title per cue — entry name plus a short unique label
 * from `at`, alt, or a humanized slot id (never entry title alone).
 */
export function uniqueCueTitle(entryTitle: string, slot: ImageSlot): string {
	const at = slot.at?.trim();
	if (at) {
		const short = stripHtml(at)
			.replace(/<[^>]+>/g, '')
			.replace(/\s+/g, ' ')
			.trim();
		const label = short.length > 42 ? `${short.slice(0, 40).trim()}…` : short;
		if (label) return `${entryTitle} · ${label}`;
	}
	const alt = slot.alt?.trim();
	if (alt) {
		const label = alt.length > 42 ? `${alt.slice(0, 40).trim()}…` : alt;
		return `${entryTitle} · ${label}`;
	}
	return `${entryTitle} · ${humanizeCueId(slot.id)}`;
}

/* ————— Real art only —————
   A slot is drawn in the reader only when it resolves to a file: a final `src`
   or a temp stand-in (explicit `tempImage` or the build-time temp inventory).
   A `src` naming a file that is not on disk is only found out when it 404s,
   so frames report failed loads here and the slot drops on the next render. */

const brokenArt = new SvelteSet<string>();

function artFileKey(src: string): string {
	const q = src.indexOf('?');
	return (q === -1 ? src : src.slice(0, q)).toLowerCase();
}

/** Record art that failed to load, so every reader stops reserving room for it. */
export function markBrokenArt(src: string | null | undefined): void {
	if (src) brokenArt.add(artFileKey(src));
}

export function isBrokenArt(src: string | null | undefined): boolean {
	return !!src && brokenArt.has(artFileKey(src));
}

/** Script-view frames of a slot that point at loadable files. */
export function realArtFramesOf(slot: ImageSlot): ScriptArtFrame[] {
	return scriptArtFramesOf(slot).filter((f) => !isBrokenArt(f.src));
}

/** True when the slot has a real image to show (not an empty prompt card). */
export function hasRealImage(slot: ImageSlot): boolean {
	return realArtFramesOf(slot).length > 0;
}

/**
 * Beats with their empty slots dropped, so no reader lays out a placeholder.
 * `keepEmpty` (edit mode) leaves them in: that is where art gets generated.
 */
export function withRealImages<B extends { images: ImageSlot[] }>(beats: B[], keepEmpty = false): B[] {
	if (keepEmpty) return beats;
	return beats.map((beat) => {
		const images = beat.images.filter(hasRealImage);
		return images.length === beat.images.length ? beat : { ...beat, images };
	});
}

/** All cue images in chronicle reading order. */
export function flattenStoryImages(source: Chapter[] = chapters): StoryCueImage[] {
	const list: StoryCueImage[] = [];
	const usedTitles = new Set<string>();

	for (const ch of source) {
		ch.entries.forEach((entry, entryIndex) => {
			const year = entryYearNum(entry, ch);
			const beats = buildBeats(entry);
			beats.forEach((beat, beatIndex) => {
				beat.images.forEach((slot, imageIndexInBeat) => {
					const displayArt = displayArtOf(slot, 'gallery');
					const finalArt = finalArtOf(slot);
					const tempArt = tempArtOf(slot);
					const refs = refsFor(slot, entry, beat.blocks, year);
					const hasExplicitRefs =
						Array.isArray(slot.refs) && slot.refs.some((r) => typeof r === 'string' && r.trim());
					const hasRefs = refs.length > 0;
					let title = uniqueCueTitle(entry.title, slot);
					if (usedTitles.has(title)) {
						title = `${entry.title} · ${humanizeCueId(slot.id)}`;
					}
					if (usedTitles.has(title)) {
						title = `${title} · ${slot.id}`;
					}
					usedTitles.add(title);
					list.push({
						key: `${ch.id}:${entryIndex}:${beatIndex}:${imageIndexInBeat}:${slot.id}`,
						chapterId: ch.id,
						chapterTitle: ch.title,
						entryIndex,
						entryTitle: entry.title,
						entryYear: entry.year,
						entrySubtitle: entry.subtitle,
						beatIndex,
						imageIndexInBeat,
						slot,
						art: displayArt,
						displayArt,
						finalArt,
						tempArt,
						hasStack: hasArtStack(slot),
						isTemp: isTempCueImage(slot),
						isNsfw: isNsfwCueImage(slot),
						isSeedCopy: isSeedCopyTemp(slot),
						title,
						hasExplicitRefs,
						hasRefs,
						hasGenuineRefs: hasGenuineTempRefs(slot, hasRefs),
						cueContext: cueContextFrom(beat.blocks, slot.at),
						at: slot.at,
						prompt: slot.prompt?.trim() || undefined,
						refs
					});
				});
			});
		});
	}

	return list;
}

/** First cue with this slot id (story.json order). */
export function findStoryCueBySlotId(slotId: string, source: Chapter[] = chapters): StoryCueImage | undefined {
	if (!slotId) return undefined;
	return flattenStoryImages(source).find((im) => im.slot.id === slotId);
}

/** Cue ids currently registered in story.json. */
export function storyCueIds(source: Chapter[] = chapters): Set<string> {
	const ids = new Set<string>();
	for (const ch of source) {
		for (const entry of ch.entries) {
			for (const slot of entry.images ?? []) ids.add(slot.id);
		}
	}
	return ids;
}

/**
 * Match inventory files to slots regardless of `/temp` vs root and `_` vs `-`.
 * `yushin_sword_vertical.png` (locked `src`) and `yushin-sword-vertical` (slot id)
 * are the same still.
 */
export function artAttachmentKey(pathOrId: string): string {
	const raw = pathOrId.trim().split('?')[0] ?? '';
	if (!raw) return '';
	const base = raw.split('/').pop() ?? raw;
	return base.replace(/\.[^.]+$/i, '').replace(/_/g, '-').toLowerCase();
}

function addArtKey(keys: Set<string>, value: string | null | undefined) {
	if (!value) return;
	const key = artAttachmentKey(value);
	if (key) keys.add(key);
}

/**
 * Filename keys that have a home: chronicle slot (`id` / `src` / `tempImage` /
 * `refs`), wiki sidecar, or a person/place portrait (`avatar` / `poster`).
 */
export function referencedArtKeys(source: Chapter[] = chapters): Set<string> {
	const keys = new Set<string>();

	for (const ch of source) {
		for (const entry of ch.entries) {
			for (const slot of entry.images ?? []) {
				addArtKey(keys, slot.id);
				addArtKey(keys, slot.src);
				addArtKey(keys, slot.tempImage);
				for (const ref of slot.refs ?? []) addArtKey(keys, ref);
			}
		}
	}

	for (const slotId of Object.keys(IMAGE_PEOPLE)) addArtKey(keys, slotId);

	for (const person of PROFILES) {
		addArtKey(keys, person.avatar);
		addArtKey(keys, person.poster);
		addArtKey(keys, person.photo);
		addArtKey(keys, person.binyeoImage);
		addArtKey(keys, person.swordImage);
		addArtKey(keys, person.objectImage);
		for (const stage of person.stages ?? []) addArtKey(keys, stage.avatar);
	}

	return keys;
}

/**
 * Temp inventory files that no chronicle slot, wiki scene, or profile art
 * references. Slot id need not equal the filename — a kebab slot with an
 * underscore `src` is attached.
 */
export function findOrphanedImages(source: Chapter[] = chapters): OrphanedImage[] {
	const attached = referencedArtKeys(source);
	const out: OrphanedImage[] = [];

	for (const [id, src] of TEMP_ART_BY_ID) {
		const key = artAttachmentKey(id) || artAttachmentKey(src);
		if (key && attached.has(key)) continue;
		out.push({ id, src, kind: 'temp' });
	}

	out.sort((a, b) => a.id.localeCompare(b.id));
	return out;
}
