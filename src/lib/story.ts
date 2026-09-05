// Types for the story data. The content itself lives in ./data/story.json
// and is edited visually at /edit (dev only) or by hand in the JSON file.

export interface ImageSlot {
	id: string; // slot name, e.g. "sunduk-crown"
	ratio: number; // width / height of the strip
	tone?: string; // placeholder background hint, used until art exists
	src?: string; // final artwork, e.g. "/img_04.png" — kept as alternate / hover stack layer
	/**
	 * Machine-generated stand-in art, e.g. "/temp/steam_01.jpg".
	 * Gallery (/images) prefers this when present; chronicle reading prefers
	 * final `src` and only falls back to temp. Namespaced under /temp so every
	 * provisional image is trivial to find and swap later.
	 */
	tempImage?: string;
	alt?: string;
	/** Midjourney-style generation prompt — shown on empty slots for art direction. */
	prompt?: string;
	/**
	 * Optional input reference image paths/URLs used when generating temp art
	 * (people / place avatars, etc.). The /images cues view surfaces these;
	 * when omitted, nearby speakers and the entry place are inferred.
	 */
	refs?: string[];
	/** Explicit placeholder flag — treated as temp cue art when set. */
	isPlaceholder?: boolean;
	/**
	 * Which beat this image belongs to: a fragment of the block it should
	 * appear alongside. Images sharing an anchor stack together; images with
	 * no anchor open the entry.
	 */
	at?: string;
	/**
	 * Intimate / adult cue art. Hidden unless the reader turns on
	 * “Show intimate scenes”. `true` or `"erotic"` both count as NSFW.
	 */
	nsfw?: boolean | 'erotic';
}

/** ImageSlot plus the beat index it was flattened against for sticky stacks. */
export type StackImage = ImageSlot & { beatIndex?: number };

export type Block =
	// `ko` is the Korean rendering of English narration
	| { kind: 'p'; html: string; ko?: string }
	// `en` is the English rendering of `lines`, index-for-index.
	// Tang / Chinese speech may add `zh` + `zhLatn` (pinyin); Yamato / Japanese
	// speech may add `ja` + `jaLatn` (Hepburn romaji) — subtitle layers shown
	// regardless of the reader's ko/en preference.
	| {
			kind: 'dialogue';
			chip: string;
			lines: string[];
			en?: string[];
			zh?: string[];
			zhLatn?: string[];
			ja?: string[];
			jaLatn?: string[];
			speaker?: string;
			person?: string;
			/** Pin a life-stage portrait (`PersonStage.id`) regardless of entry year. */
			look?: string;
	  }
	| { kind: 'cite'; html: string; ko?: string } // "• 👑 King Mu (51) of Baekje"
	| { kind: 'verse'; color: string; lines: string[] }
	| { kind: 'table'; head: string[]; rows: string[][]; colors?: string[] }
	| { kind: 'hanja'; chars: { char: string; gloss: string }[]; after?: string }
	// A genuine line from the record — rendered in light yellow, with its source.
	| { kind: 'quote'; html: string; ko?: string; hanja?: string; source: string }
	// A battle formation: two sides of labelled units, drawn as a diagram.
	| {
			kind: 'formation';
			title?: string;
			note?: string;
			sides: { name: string; color: string; units: { label: string; sub?: string }[] }[];
	  }
	// The lesson a told story leaves behind — set apart, the way the islanders say it.
	| { kind: 'moral'; label?: string; html: string; ko?: string }
	// A character’s internal voice spoken from later — retrospective tense.
	| { kind: 'monologue'; html: string; ko?: string; person?: string; look?: string }
	// An animated explainer for an institution or concept — resolved through the
	// registry in components/diagrams. `diagram` names the component; `step`
	// picks the moment it depicts (each component documents its own steps).
	| {
			kind: 'diagram';
			diagram: string;
			step?: string;
			realm?: string; // pantheon column filter when diagram is `pantheon`
			title?: string; // small-caps heading above the drawing
			caption?: string; // English caption under the drawing
			ko?: string; // Korean caption
	  }
	// A large chapter-within-an-entry header — "DAY 1" over a siege chronicle.
	| { kind: 'day'; label: string; ko?: string }
	// Scene break (same plate as `day`; used if a merge names the cut a scene).
	| { kind: 'scene'; label: string; ko?: string }
	// A mini-flashback that interrupts an entry mid-scroll.
	| { kind: 'flashback'; year?: string; title?: string; blocks: Block[] };

export interface Entry {
	year: string;
	sub?: string; // "February", "???"
	flash?: boolean; // renders on a tinted band — a flashback to an earlier era
	/** Alias of `flash` — whole-episode memory. Inline beats use `kind: 'flashback'`. */
	flashback?: boolean;
	flashTone?: string; // band color; defaults to grey (founding myths use kingdom colors)
	accent?: string; // episode title color — battle entries use red
	title: string; // "Queen Sunduk"
	subtitle?: string; // "선덕여왕"
	badges?: string[]; // emoji / flag chips under the title (`flag:silla`, `flag:baekje`, …)
	music?: string; // track name — shows in the player tag while this entry is read
	/** Genre voice of this episode — e.g. "political thriller", "island folklore". */
	tone?: string;
	/** One-line director's brief expanding on `tone`. */
	toneNote?: string;
	images: ImageSlot[];
	blocks: Block[];
}

export interface Chapter {
	id: string;
	part?: string; // "Part I" — renders a full title page before this chapter
	partTitle?: string; // "The Three Kingdoms"
	partKorean?: string; // "삼국시대"
	partHanja?: string; // "三國時代"
	title: string; // "The King of Samhan"
	hanja?: string; // "三韓王儉"
	korean?: string; // "삼한왕검"
	range: string; // "632–642"
	/** Dominant genre voice of the chapter — entries may override with their own `tone`. */
	tone?: string;
	/** One-line director's brief for the chapter's genre voice. */
	toneNote?: string;
	entries: Entry[];
}

import raw from './data/story.json';

export const chapters = raw as unknown as Chapter[];

/** Whole-entry memory band — `flash` or the explicit `flashback` alias. */
export function isFlashEntry(entry: Pick<Entry, 'flash' | 'flashback'>) {
	return !!(entry.flash || entry.flashback);
}

/**
 * Stable DOM / hash id fragment from an episode title.
 * Apostrophes drop so “Yeon’s Massacre” → `yeons-massacre`.
 */
export function entrySlug(title: string): string {
	return title
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['’‘]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** Canonical episode id: `chapterId-slug`, used for TOC, hashes, and article roots. */
export function entryId(chapterId: string, title: string): string {
	return `${chapterId}-${entrySlug(title)}`;
}

/** DOM id for a chapter's part title page — distinct from episode slugs. */
export function partId(chapterId: string): string {
	return `part-${chapterId}`;
}

export function chapterIdFromPartId(id: string): string | null {
	return id.startsWith('part-') ? id.slice('part-'.length) : null;
}

/** A named cut inside an entry — day plate, scene plate, or titled flashback. */
export type SceneRef = {
	id: string;
	slug: string;
	title: string;
	ko?: string;
	kind: 'day' | 'scene' | 'flashback';
};

/** Top-level blocks that title a scene the reader can jump to. */
export function isSceneHeader(b: Block): boolean {
	return b.kind === 'day' || b.kind === 'scene' || (b.kind === 'flashback' && !!b.title);
}

function uniqueSlug(used: Map<string, number>, title: string): string {
	const base = entrySlug(title) || 'scene';
	const n = (used.get(base) ?? 0) + 1;
	used.set(base, n);
	return n === 1 ? base : `${base}-${n}`;
}

/**
 * Scene list for one entry, in reading order. Ids are `episodeId-scene-slug`
 * so hash jumps share the TOC slug scheme.
 */
export function scenesOf(blocks: Block[] | undefined, episodeId: string): SceneRef[] {
	const used = new Map<string, number>();
	const out: SceneRef[] = [];
	for (const b of blocks ?? []) {
		if (b.kind === 'day' || b.kind === 'scene') {
			const slug = uniqueSlug(used, b.label);
			out.push({ id: `${episodeId}-${slug}`, slug, title: b.label, ko: b.ko, kind: b.kind });
		} else if (b.kind === 'flashback' && b.title) {
			const slug = uniqueSlug(used, b.title);
			out.push({ id: `${episodeId}-${slug}`, slug, title: b.title, kind: 'flashback' });
		}
	}
	return out;
}

function headerTitle(b: Block): string {
	if (b.kind === 'day' || b.kind === 'scene') return b.label;
	if (b.kind === 'flashback') return b.title ?? '';
	return '';
}

/**
 * DOM id for a scene header block. Walks `source` in reading order so slugs
 * match `scenesOf` / the TOC even when this block is rendered in a beat slice.
 */
export function sceneIdForBlock(
	block: Block,
	source: Block[] | undefined,
	episodeId: string
): string | undefined {
	if (!episodeId || !isSceneHeader(block)) return undefined;
	const list = scenesOf(source, episodeId);
	let n = 0;
	for (const b of source ?? []) {
		if (!isSceneHeader(b)) continue;
		const s = list[n++];
		if (b === block) return s?.id;
	}
	const slug = entrySlug(headerTitle(block)) || 'scene';
	return `${episodeId}-${slug}`;
}
