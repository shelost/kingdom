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
	 * Intimate / adult cue art. Hidden unless the reader leaves
	 * “Intimate scenes” on. `true` or `"erotic"` both count as NSFW.
	 */
	nsfw?: boolean | 'erotic';
	/** Kept in story.json and on disk, but left out of the chronicle until reinstated (edit mode → Hide). */
	hidden?: boolean;
	/**
	 * Optional people.ts ids of everyone visible in the still.
	 * Gallery membership prefers the sidecar `image-people.json`
	 * (`peopleOfSlot`); this field is for hand edits on a slot.
	 */
	people?: string[];
	/**
	 * Which beat this image belongs to: a fragment of the block it should
	 * appear alongside. Images sharing an anchor stack together; images with
	 * no anchor open the entry.
	 */
	at?: string;
}

/** ImageSlot plus the beat index it was flattened against for sticky stacks. */
export type StackImage = ImageSlot & { beatIndex?: number };

/**
 * Panel note for the artist / letterer ("Wordless.", "Thought balloon.",
 * "Full-page end card.", camera and posture directions). Never rendered in
 * the reader; the script export prints it beside the beat.
 */
export type PanelNote = { art?: string };

export type Block = PanelNote &
	(
	// `ko` is the Korean rendering of English narration
	| { kind: 'p'; html: string; ko?: string; nsfw?: boolean; /** Soundtrack cue while this paragraph is the latest one reached. */ music?: string }
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
			/** Hidden when Intimate scenes are off — same gate as cue art. */
			nsfw?: boolean;
	  }
	| { kind: 'cite'; html: string; ko?: string } // "• 👑 King Mu (51) of Baekje"
	// `en` is the English rendering of `lines`, index-for-index.
	| { kind: 'verse'; color: string; lines: string[]; en?: string[] }
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
	| { kind: 'monologue'; html: string; ko?: string; person?: string; look?: string; nsfw?: boolean }
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
	| { kind: 'flashback'; year?: string; title?: string; blocks: Block[] }
	);

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
	/** `images[].id` of the representative still under the title. Omit to use the first landscape still. */
	thumbnail?: string;
	/** `'temp'`: show that cue's temp stand-in, not its final `src`. */
	thumbnailLayer?: 'temp';
	badges?: string[]; // emoji / flag chips under the title (`flag:silla`, `flag:baekje`, …)
	music?: string; // track name — shows in the player tag while this entry is read
	/** Genre voice of this episode — e.g. "political thriller", "island folklore". */
	tone?: string;
	/** One-line director's brief expanding on `tone`. */
	toneNote?: string;
	/** `PLACES` id — the map pin and place banner beside this episode. */
	place?: string;
	/** TOC category icons, in display order; most episodes have none. */
	kinds?: EpisodeKind[];
	/** 등장인물 tags under the title, in order. Omit to derive from dialogue and stills (`entryCast`). */
	cast?: string[];
	images: ImageSlot[];
	blocks: Block[];
}

/** Episode categories that earn a TOC icon. `flashback` is derived from `flash`, never stored. */
export type EpisodeKind =
	| 'love'
	| 'myth'
	| 'founding'
	| 'battle'
	| 'siege'
	| 'naval'
	| 'coup'
	| 'coronation';

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

const RR_INITIAL = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const RR_MEDIAL = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const RR_FINAL = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];

/** Revised Romanization of Hangul syllables (final consonants simplified), for slugs. */
function romanizeHangul(s: string): string {
	return s.replace(/[\uac00-\ud7a3]/g, (ch) => {
		const n = ch.charCodeAt(0) - 0xac00;
		return RR_INITIAL[Math.floor(n / 588)] + RR_MEDIAL[Math.floor((n % 588) / 28)] + RR_FINAL[n % 28];
	});
}

/**
 * Stable DOM / hash id fragment from an episode title.
 * Apostrophes drop so “Yeon’s Massacre” → `yeons-massacre`; Hangul romanizes so “기 (起)” and “Gi (起)” both → `gi`.
 */
export function entrySlug(title: string): string {
	return romanizeHangul(title)
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

export function isEpilogue(chapter: Pick<Chapter, 'id'>): boolean {
	return chapter.id.startsWith('epilogue');
}

/** Reader-facing chapter numbers: epilogues are unnumbered and do not advance the count. */
const CHAPTER_NUMBERS: (number | null)[] = (() => {
	let n = 0;
	return chapters.map((ch) => (isEpilogue(ch) ? null : ++n));
})();

export function chapterNumber(chapterIndex: number): number | null {
	return CHAPTER_NUMBERS[chapterIndex] ?? null;
}

/** Reader-facing episode ordinals: one running count over every entry in reading order, epilogues included. */
const EPISODE_ORDINALS: number[][] = (() => {
	let n = 0;
	return chapters.map((ch) => ch.entries.map(() => ++n));
})();

export const EPISODE_COUNT = EPISODE_ORDINALS.reduce((n, ch) => n + ch.length, 0);

/** 1-based position of an entry in the whole run — `37`; 0 when out of range. */
export function episodeOrdinal(chapterIndex: number, entryIndex: number): number {
	return EPISODE_ORDINALS[chapterIndex]?.[entryIndex] ?? 0;
}

/** Reader-facing episode number as a label — `37`; empty when out of range. */
export function episodeNumber(chapterIndex: number, entryIndex: number): string {
	const n = episodeOrdinal(chapterIndex, entryIndex);
	return n ? String(n) : '';
}

/** DOM id for a chapter's part title page — distinct from episode slugs. */
export function partId(chapterId: string): string {
	return `part-${chapterId}`;
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
