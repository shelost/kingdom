/**
 * One tankōbon per chronicle Chapter. Standing spines in rows grouped by Part.
 */
import { PARTS, type DirectoryChapter, type DirectoryEpisode } from '$lib/episodeDirectory';

export type BookEpisode = {
	id: string;
	queryId: string;
	number: string;
	title: string;
	ko?: string;
	year: string;
	words: number;
	minutes: number;
};

export type BookVolume = {
	id: string;
	number: number;
	title: string;
	ko?: string;
	part: string;
	partTitle?: string;
	partKorean?: string;
	arc: string;
	spine: string;
	episodes: number;
	/** Live English word count of the volume's episodes (from story.json). */
	words: number;
	minutes: number;
	range: string;
	queryId: string;
	slot: number;
	partIndex: number;
	inPart: number;
	chapters: BookEpisode[];
	blurb: { en: string; ko: string };
	/** Cover width (m). */
	w: number;
	/** Cover height (m). */
	h: number;
	/** Spine thickness (m). */
	d: number;
	/** Ink on the painted spine (cream on dark cloth, dark on pastel). */
	spineInk: string;
};

export type BookPose = {
	position: [number, number, number];
	rotation: [number, number, number];
	scale: number;
};

export type ShelfBoard = {
	partIndex: number;
	part: string;
	partTitle?: string;
	partKorean?: string;
	y: number;
	width: number;
	x: number;
};

export type PointerNdc = { x: number; y: number };

/** Cloth colour for each volume. Kingdom triad first; named people keep their hex; myths go pastel. */
const SPINE: Record<string, string> = {
	'ch-three-kingdoms--silla': '#2A5FB8',
	'ch-three-kingdoms--baekje': '#d9b13a',
	'ch-three-kingdoms--goguryeo': '#C30000',
	'ch-five-principles--hwarang': '#7EB8F0',
	'ch-five-principles--master-of-the-classics': '#c9a227',
	'ch-five-principles--grand-academy': '#b43a32',
	'ch-iron-will--daeya': '#8B1E3F',
	'ch-iron-will--supreme-commander': '#d0362f',
	'ch-iron-will--marshal': '#2A5FB8',
	'ch-goguryeo-tang-war--four-dragons': '#c45c2a',
	'ch-goguryeo-tang-war--ansi': '#a31f1a',
	'ch-goguryeo-tang-war--jumong': '#f3b49a',
	'ch-chunchu-era--bidam': '#5C4A8C',
	'ch-chunchu-era--sungman': '#d4b86a',
	'ch-chunchu-era--chunchu': '#D8258C',
	'ch-haedong-jeungja--three-thousand-maids': '#c46a22',
	'ch-haedong-jeungja--three-loyalists': '#8a9a5b',
	'ch-fall-of-baekje--tamla': '#E07030',
	'ch-fall-of-baekje--yellow-mountain': '#9a7b32',
	'ch-fall-of-baekje--four-beasts': '#c5b8d4',
	'ch-fall-of-goguryeo--kudara': '#c47878',
	'ch-fall-of-goguryeo--grand-supreme-commander': '#c45c54',
	'ch-silla-tang-war--hyukgos': '#ead8b0',
	'ch-silla-tang-war--supreme-marshal': '#C41E3A',
	'ch-silla-tang-war--unified-silla': '#1e4d8c'
};

export type BookMode = 'shelf' | 'display';

export function defaultSpine(id: string): string {
	return SPINE[id] ?? '#3a2a1c';
}

/** `#RGB` or `#RRGGBB` → `#RRGGBB`. Null when the string is not a hex colour. */
export function normalizeHex(raw: string): string | null {
	const t = raw.trim().replace(/^#/, '');
	if (/^[0-9a-fA-F]{3}$/.test(t)) {
		return `#${t[0]}${t[0]}${t[1]}${t[1]}${t[2]}${t[2]}`.toUpperCase();
	}
	if (/^[0-9a-fA-F]{6}$/.test(t)) return `#${t.toUpperCase()}`;
	return null;
}

export function spineInk(hex: string): string {
	const n = hex.replace('#', '');
	if (n.length < 6) return '#f6f1e6';
	const r = parseInt(n.slice(0, 2), 16) / 255;
	const g = parseInt(n.slice(2, 4), 16) / 255;
	const b = parseInt(n.slice(4, 6), 16) / 255;
	const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
	return L > 0.52 ? '#1c1814' : '#f6f1e6';
}

const GAP = 0.008;
const DISPLAY_GAP = 0.022;
const DISPLAY_SCALE = 1;
/** Distance between row centres. Tight enough that the three shelves read as one stack. */
const ROW = 0.266;
/** Display faces are larger, so the three rows need more air. */
const DISPLAY_ROW = 0.34;
const BOARD_T = 0.028;
/** Spine toward the lens, cover catching a three-quarter from camera-right. */
const SPINE_YAW = 1.05;
const FOV = 38 * (Math.PI / 180);
/** Canvas aspect used to frame the stack. Wider than the old split stage so the cluster sits in the middle of the full floor. */
const VIEW_ASPECT = 1.72;
/** Cover size is shared; spine thickness follows each volume's word count. */
export const BOOK_W = 0.175;
export const BOOK_H = 0.26;
/** Typical spine at the median volume. */
export const BOOK_D = 0.034;
/** Cover width ÷ height. CSS previews and the Threlte mesh share this. */
export const BOOK_RATIO = BOOK_W / BOOK_H;
/** CSS preview height (rem). Width and thickness are derived from BOOK_RATIO and volume.d. */
export const PREVIEW_H = {
	chapter: 10.2,
	arc: 13.4,
	chapterNarrow: 7.6,
	arcNarrow: 10.2
} as const;
/** Floor so a pamphlet spine still takes a title. */
export const PREVIEW_D_MIN = 1.15;

/** Spine thickness as a fraction of cover height — CSS `calc(var(--h) * var(--thick))`.
 *  One tankōbon thick, never the sum of a set: arcs keep the same proportion as /books. */
export function previewThick(volumes: Pick<BookVolume, 'd' | 'h'>[]): number {
	if (!volumes.length) return BOOK_D / BOOK_H;
	const typical = volumes.length === 1 ? volumes[0]! : volumes[Math.floor(volumes.length / 2)]!;
	return typical.d / typical.h;
}
const D_MIN = 0.015;
const D_MAX = 0.082;

function median(values: number[]): number {
	if (!values.length) return 1;
	const s = [...values].sort((a, b) => a - b);
	return s[s.length >> 1] || 1;
}

/** Square-root of words/typical, clamped so a pamphlet still has a spine and a tome still fits the row. */
export function spineDepth(words: number, typical = 1): number {
	const d = BOOK_D * Math.sqrt(Math.max(words, 1) / Math.max(typical, 1));
	return Math.min(D_MAX, Math.max(D_MIN, d));
}

function ofEpisode(ep: DirectoryEpisode): BookEpisode {
	return {
		id: ep.id,
		queryId: ep.queryId,
		number: ep.number,
		title: ep.title,
		ko: ep.ko,
		year: ep.year,
		words: ep.words,
		minutes: ep.minutes
	};
}

function ofChapter(
	chapter: DirectoryChapter,
	slot: number,
	partIndex: number,
	inPart: number,
	part: { label: string; title?: string; korean?: string },
	arc: string
): BookVolume | null {
	if (!chapter.anchor || !chapter.label) return null;
	const first = chapter.episodes[0];
	if (!first) return null;
	const last = chapter.episodes[chapter.episodes.length - 1] ?? first;
	const n = chapter.episodes.length;
	const minutes = chapter.episodes.reduce((sum, ep) => sum + ep.minutes, 0);
	const words = chapter.episodes.reduce((sum, ep) => sum + ep.words, 0);
	return {
		id: chapter.anchor,
		number: chapter.number ?? slot + 1,
		title: chapter.label,
		ko: chapter.ko,
		part: part.label,
		partTitle: part.title,
		partKorean: part.korean,
		arc,
		spine: SPINE[chapter.anchor] ?? '#3a2a1c',
		episodes: n,
		words,
		minutes,
		range: first.year === last.year ? first.year : `${first.year}–${last.year}`,
		queryId: first.queryId,
		slot,
		partIndex,
		inPart,
		chapters: chapter.episodes.map(ofEpisode),
		blurb: first.synopsis,
		w: BOOK_W,
		h: BOOK_H,
		d: BOOK_D,
		spineInk: spineInk(SPINE[chapter.anchor] ?? '#3a2a1c')
	};
}

export const VOLUMES: BookVolume[] = (() => {
	const out: BookVolume[] = [];
	PARTS.forEach((part, partIndex) => {
		let inPart = 0;
		for (const arc of part.arcs) {
			for (const chapter of arc.chapters) {
				const volume = ofChapter(chapter, out.length, partIndex, inPart, part, arc.title);
				if (!volume) continue;
				out.push(volume);
				inPart += 1;
			}
		}
	});
	const typical = median(out.map((v) => v.words));
	for (const volume of out) volume.d = spineDepth(volume.words, typical);
	return out;
})();

export const BOOK_PARTS = PARTS.map((part, partIndex) => ({
	part: part.label,
	title: part.title,
	korean: part.korean,
	volumes: VOLUMES.filter((v) => v.partIndex === partIndex)
})).filter((row) => row.volumes.length);

const ROW_COUNT = BOOK_PARTS.length || 1;
const TOP_Y = ((ROW_COUNT - 1) * ROW) / 2;
/** Drop the cluster so the top row clears the floating site pill. */
const CLUSTER_Y = -0.3;

const DISPLAY_TOP_Y = ((ROW_COUNT - 1) * DISPLAY_ROW) / 2;

function rowY(partIndex: number): number {
	return TOP_Y - partIndex * ROW + CLUSTER_Y;
}

function displayY(partIndex: number): number {
	return DISPLAY_TOP_Y - partIndex * DISPLAY_ROW + CLUSTER_Y;
}

/** World-X footprint of a three-quarter book. Packing by spine depth alone stacks them into a wad. */
function shelfPitch(v: BookVolume): number {
	return v.w * Math.abs(Math.cos(SPINE_YAW)) + v.d * Math.abs(Math.sin(SPINE_YAW)) + GAP;
}

function packRow(row: BookVolume[], by: 'spine' | 'cover'): { xs: number[]; width: number } {
	const gap = by === 'cover' ? DISPLAY_GAP : 0;
	const thick = (v: BookVolume) => (by === 'cover' ? v.w * DISPLAY_SCALE + gap : shelfPitch(v));
	const span = row.reduce((n, v) => n + thick(v), 0);
	let x = -span / 2;
	const xs: number[] = [];
	for (const v of row) {
		const t = thick(v);
		x += t / 2;
		xs.push(x);
		x += t / 2;
	}
	return { xs, width: span };
}

function frameDistance(width: number, height: number, aspect = VIEW_ASPECT): number {
	const half = Math.tan(FOV / 2);
	const zFromW = (width * 0.5 * 1.12) / (half * aspect);
	const zFromH = (height * 0.5 * 1.48) / half;
	return Math.max(zFromW, zFromH, 1.12);
}

const STACK_H = (ROW_COUNT - 1) * ROW + BOOK_H;
const DISPLAY_STACK_H = (ROW_COUNT - 1) * DISPLAY_ROW + BOOK_H * DISPLAY_SCALE;

const ROW_PACK = BOOK_PARTS.map((row) => packRow(row.volumes, 'spine'));
const DISPLAY_PACK = BOOK_PARTS.map((row) => packRow(row.volumes, 'cover'));
const SHELF_W = Math.max(0.6, ...ROW_PACK.map((p) => p.width));
const DISPLAY_W = Math.max(0.6, ...DISPLAY_PACK.map((p) => p.width));

export const SHELVES: ShelfBoard[] = BOOK_PARTS.map((row, i) => ({
	partIndex: row.volumes[0]?.partIndex ?? i,
	part: row.part,
	partTitle: row.title,
	partKorean: row.korean,
	y: rowY(row.volumes[0]?.partIndex ?? i) - BOARD_T / 2 - 0.002,
	width: ROW_PACK[i]?.width ?? 0.8,
	x: 0
}));

const REST = new Map<string, BookPose>();
const DISPLAY = new Map<string, BookPose>();
BOOK_PARTS.forEach((row, i) => {
	const pack = ROW_PACK[i];
	const face = DISPLAY_PACK[i];
	const shelf = rowY(row.volumes[0]?.partIndex ?? i);
	row.volumes.forEach((v, k) => {
		REST.set(v.id, {
			position: [pack?.xs[k] ?? 0, shelf + v.h / 2, 0],
			rotation: [0, SPINE_YAW, 0],
			scale: 1
		});
		DISPLAY.set(v.id, {
			position: [face?.xs[k] ?? 0, displayY(v.partIndex) + (v.h * DISPLAY_SCALE) / 2, 0],
			rotation: [0, 0, 0],
			scale: DISPLAY_SCALE
		});
	});
});

export function restPose(id: string): BookPose {
	return REST.get(id) ?? { position: [0, 0, 0], rotation: [0, SPINE_YAW, 0], scale: 1 };
}

export function displayPose(id: string): BookPose {
	return DISPLAY.get(id) ?? { position: [0, 0, 0], rotation: [0, 0, 0], scale: 0.92 };
}

export function volumeOf(id: string | null): BookVolume | undefined {
	if (!id) return;
	return VOLUMES.find((v) => v.id === id);
}

/** Chapter volumes inside one Arc, in reading order. */
export function volumesInArc(arcId: string): BookVolume[] {
	const prefix = `ch-${arcId}--`;
	return VOLUMES.filter((v) => v.id.startsWith(prefix));
}

/** Standing in the row. Hover lifts a little; the cover preview lives in the overlay, so the book does not spin. */
export function shelfPose(volume: BookVolume, hovered: boolean, _pointer: PointerNdc): BookPose {
	const rest = restPose(volume.id);
	if (!hovered) return rest;
	return {
		position: [rest.position[0], rest.position[1] + 0.01, rest.position[2] + 0.028],
		rotation: rest.rotation,
		scale: 1.02
	};
}

/** Three-quarter cover. Desktop look-at sits to the right so the book stays in the open left, clear of the overlay. */
export function showcasePose(volume: BookVolume, pointer: PointerNdc, narrow = false): BookPose {
	return {
		position: narrow ? [0, 0.1, 0.16] : [0, 0.02, 0.18],
		rotation: [-0.06 + pointer.y * 0.07, -0.32 + pointer.x * 0.1, 0.02],
		scale: narrow ? 1.28 : 1.34
	};
}

export function bookPose(
	volume: BookVolume,
	selected: string | null,
	hovered: string | null,
	pointer: PointerNdc,
	narrow = false,
	mode: BookMode = 'shelf'
): BookPose {
	if (selected === volume.id) return showcasePose(volume, pointer, narrow);
	const rest = mode === 'display' ? displayPose(volume.id) : restPose(volume.id);
	if (selected) {
		return {
			position: [0, -3.2, -8],
			rotation: rest.rotation,
			scale: 0.001
		};
	}
	if (mode === 'display') {
		if (hovered !== volume.id) return rest;
		return {
			position: [rest.position[0], rest.position[1] + 0.012, rest.position[2] + 0.03],
			rotation: rest.rotation,
			scale: rest.scale * 1.04
		};
	}
	return shelfPose(volume, hovered === volume.id, pointer);
}

export function cameraPose(selected: boolean, narrow = false, mode: BookMode = 'shelf'): BookPose {
	if (selected) {
		return {
			position: narrow ? [0.1, 0.16, 1.08] : [0.2, 0.04, 1.12],
			rotation: [0, 0, 0],
			scale: 1
		};
	}
	const aspect = narrow ? 1.05 : VIEW_ASPECT;
	if (mode === 'display') {
		return {
			position: [0, 0.02, frameDistance(DISPLAY_W, DISPLAY_STACK_H, aspect)],
			rotation: [0, 0, 0],
			scale: 1
		};
	}
	return {
		position: [0.04, 0.02, frameDistance(SHELF_W, STACK_H, aspect)],
		rotation: [0, 0, 0],
		scale: 1
	};
}

export function cameraTarget(selected: boolean, narrow = false, mode: BookMode = 'shelf'): [number, number, number] {
	if (selected) return narrow ? [0, 0.08, 0.02] : [0.16, 0.02, 0.04];
	const stackMid = mode === 'display' ? displayY(1) + (BOOK_H * DISPLAY_SCALE) / 2 : rowY(1) + BOOK_H / 2;
	return [0, stackMid + (narrow ? 0.03 : 0), 0];
}

export { BOARD_T };
