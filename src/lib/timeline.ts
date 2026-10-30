/**
 * The /timeline board: every episode as a bar on one vertical time axis. The present-day
 * story runs down one primary column (with its Arcs marked on a strip beside it); parallel
 * tellings, flashbacks and myths sit in side columns, so their overlap with the main story
 * reads straight across.
 *
 * Years are fractional: 642.58 is August 642. The axis is compressed: a year in which
 * something starts gets room for its labels, a year a long bar only passes through stays
 * thin, and a run of empty years collapses into one break.
 */
import { plateYear, storiesOf, type Block, type Entry, type ImageSlot } from '$lib/story';
import { byId, KINGDOMS, type Person } from '$lib/people';
import { PARTS, wordsIn, type DirectoryEpisode } from '$lib/episodeDirectory';
import KEY_EVENTS from '$lib/data/key-events.json';
import { arcLabelAt } from '$lib/tocTree';
import { displayArtOf } from '$lib/cueArt';
import { entryCast } from '$lib/entryHead';

export type TimelineStory = { id: string; title: string; ko?: string; start: number; end: number; top: number; height: number };
export type TimelineMarker = { year: number; top: number };
export type TimelineItem = {
	ep: DirectoryEpisode;
	lane: number;
	start: number;
	end: number;
	/** First and last calendar year shown on the bar. */
	from: number;
	to: number;
	top: number;
	height: number;
	flash: boolean;
	tone: string;
	stories: TimelineStory[];
	/** Years only remembered in inline flashbacks, outside the bar's own span. */
	flashbacks: TimelineMarker[];
};
export type ColumnId = 'primary' | 'alongside' | 'flashbacks' | 'myths';
type Bilingual = { en: string; ko: string };
export type TimelineColumn = {
	id: ColumnId;
	title: Bilingual;
	note: Bilingual;
	lanes: number;
	items: TimelineItem[];
	/** Episodes with no calendar year ("Long ago", 태초). */
	timeless: DirectoryEpisode[];
};
export type TimelineTick = { year: number; top: number; major: boolean };
export type TimelineBreak = { from: number; to: number; top: number; height: number };
/** An Arc's stretch of the primary column. */
export type TimelineArc = { id: string; label: Bilingual; title: Bilingual; top: number; height: number };
/** An episode that tells a key event: `full` when it gives the event a real scene, otherwise a brief mention. */
export type EventCover = { ep: DirectoryEpisode; full: boolean };
export type EventStill = { id: string; src: string; alt: string };
export type TimelineEvent = {
	id: string;
	year: number;
	sub?: string;
	title: Bilingual;
	top: number;
	covers: EventCover[];
	/** Told in more than one episode — a crossover between storylines. */
	crossover: boolean;
	people: Person[];
	stills: EventStill[];
};

/**
 * Where an episode tells an event (`src/lib/data/key-events.json`): one or more scene labels,
 * an inline flashback by year, a line of text (always brief), or the whole episode.
 */
type CoverSpec = { ep: string; scene?: string | string[]; flashback?: number; text?: string; brief?: boolean };
type EventSpec = {
	id: string;
	year: number;
	sub?: string;
	en: string;
	ko: string;
	covers: CoverSpec[];
	people?: string[];
	stills?: string[];
};

const MAX_STILLS = 3;

/** Old cover titles from when episodes were renamed. Lookup also strips † and a trailing (hanja). */
const COVER_ALIASES: Record<string, string> = {
	gwansan: 'King Seong',
	'colossal river': 'Eulji Mundeok',
	'yellow mountain': 'Hwangsan Field',
	'siege of daeya': 'Jukjuk',
	"yeon's massacre": 'The Revolt',
	'the eastern star': 'The Morning Star',
	ansi: 'Lord of Ansi',
	'chunchu & yeon': 'The Oath',
	'euija & yeon': 'Yunchung',
	rebellion: 'Gyul',
	jiabeng: 'Li Shimin',
	sabi: 'Buyeo Euija',
	betrayal: 'White River',
	'pyongyang ii': 'Pyongyang',
	'final ford': 'Gibulpo'
};

function episodeOfCover(name: string, byTitle: Map<string, DirectoryEpisode>): DirectoryEpisode | undefined {
	const exact = byTitle.get(name);
	if (exact) return exact;
	const stripped = name.replace(/†/g, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
	if (stripped !== name) {
		const hit = byTitle.get(stripped);
		if (hit) return hit;
	}
	const alias = COVER_ALIASES[stripped.toLowerCase().replace(/[’‘]/g, "'")];
	if (alias) return byTitle.get(alias);
	const lower = stripped.toLowerCase();
	for (const [title, ep] of byTitle) {
		if (title.toLowerCase() === lower) return ep;
	}
	return undefined;
}

function stillsOfEvent(spec: EventSpec, covers: EventCover[]): EventStill[] {
	const seen = new Set<string>();
	const out: EventStill[] = [];
	const take = (slot: ImageSlot) => {
		if (slot.hidden || slot.nsfw || slot.gallery) return;
		const src = displayArtOf(slot, 'gallery');
		if (!src || seen.has(slot.id)) return;
		seen.add(slot.id);
		out.push({ id: slot.id, src, alt: slot.alt ?? spec.en });
	};
	if (spec.stills?.length) {
		for (const id of spec.stills) {
			for (const c of covers) {
				const slot = c.ep.entry.images.find((im) => im.id === id);
				if (slot) take(slot);
			}
		}
		return out.slice(0, MAX_STILLS);
	}
	const scenes = spec.covers.flatMap((c) => (c.scene ? ([] as string[]).concat(c.scene) : []));
	const ranked: { slot: ImageSlot; score: number }[] = [];
	for (const c of covers) {
		for (const slot of c.ep.entry.images) {
			if (slot.hidden || slot.nsfw || slot.gallery) continue;
			if (!displayArtOf(slot, 'gallery')) continue;
			let score = c.full ? 2 : 0;
			if (c.ep.entry.thumbnail === slot.id) score += 5;
			const at = `${slot.at ?? ''} ${slot.alt ?? ''} ${slot.id}`;
			if (scenes.some((s) => at.toLowerCase().includes(s.toLowerCase()))) score += 8;
			ranked.push({ slot, score });
		}
	}
	ranked.sort((a, b) => b.score - a.score);
	for (const r of ranked) {
		take(r.slot);
		if (out.length >= MAX_STILLS) break;
	}
	return out;
}

function peopleOfEvent(spec: EventSpec, covers: EventCover[], year: number): Person[] {
	const ids = spec.people?.length
		? spec.people
		: [...new Set(covers.flatMap((c) => entryCast(c.ep.entry, year, c.full ? 4 : 2).map((m) => m.id)))];
	return ids.flatMap((id) => {
		const p = byId.get(id);
		return p ? [p] : [];
	});
}

/** A scene of at least this many words counts as telling the event, not mentioning it. */
const FULL_WORDS = 300;

/** Pixel sizes of the board. */
export const LANE_W = 108;
export const ARC_STRIP_W = 18;
export const MIN_ITEM_H = 30;
const THIN_YEAR_H = 4;
const START_ROW_H = MIN_ITEM_H + 3;
const BREAK_H = 24;

const COLUMNS: { id: ColumnId; title: Bilingual; note: Bilingual }[] = [
	{ id: 'primary', title: { en: 'Main story', ko: '본편' }, note: { en: 'Present day', ko: '현재' } },
	{ id: 'alongside', title: { en: 'Alongside', ko: '나란히' }, note: { en: 'Parallel tellings', ko: '같은 시대 다른 이야기' } },
	{ id: 'flashbacks', title: { en: 'Flashbacks', ko: '회상' }, note: { en: 'Remembered history', ko: '기억 속 역사' } },
	{ id: 'myths', title: { en: 'Myths & founders', ko: '신화와 시조' }, note: { en: 'Long ago', ko: '먼 옛날' } }
];
const PRIMARY = 0;
const ALONGSIDE = 1;
const FLASH_TONE = '#8a8a94';
const PLAIN_TONE = '#b08d3c';

const MONTHS: Record<string, number> = {
	january: 0,
	february: 1,
	march: 2,
	april: 3,
	may: 4,
	june: 5,
	july: 6,
	august: 7,
	september: 8,
	october: 9,
	november: 10,
	december: 11,
	spring: 2,
	summer: 5,
	autumn: 8,
	fall: 8,
	winter: 10
};

/** Calendar years in a label: "642", "-59", "576–654", "657-660" (a dash between digits is a range, not a sign). */
export function yearsIn(value: string | number | undefined): number[] {
	if (value === undefined || value === null) return [];
	return String(value)
		.split(/[–—~]|(?<=\d)-(?=\d)/)
		.flatMap((part) => {
			const m = part.match(/-?\d+/);
			return m ? [Number(m[0])] : [];
		});
}

/** `59 BC` / `기원전 59`; AD years stay bare. */
export function yearLabel(year: number, ko = false): string {
	if (year >= 0) return String(year);
	return ko ? `기원전 ${-year}` : `${-year} BC`;
}

function monthOf(sub: string | undefined): number | null {
	if (!sub) return null;
	const m = MONTHS[sub.trim().toLowerCase()];
	return m === undefined ? null : m;
}

/** Years carried by an entry's own plates and maps (not its inline flashbacks). */
function plateYears(b: Block): number[] {
	if (b.kind === 'map') return yearsIn((b as { year?: string | number }).year);
	const year = plateYear(b);
	return year === undefined ? [] : [year];
}

function flashbackYears(blocks: Block[]): number[] {
	return blocks.flatMap((b) => (b.kind === 'flashback' ? [...yearsIn(b.year), ...flashbackYears(b.blocks)] : []));
}

function toneOf(ep: DirectoryEpisode): string {
	if (ep.entry.flash || ep.entry.flashback) return ep.entry.flashTone ?? FLASH_TONE;
	const flag = ep.tags.find((t) => t.flag)?.key.replace('flag:', '');
	return (flag && (KINGDOMS as Record<string, { color: string } | undefined>)[flag]?.color) || PLAIN_TONE;
}

/** Present day → primary; a flash episode that is not a flashback runs alongside; flashbacks split into history and myth. */
function columnOf(ep: DirectoryEpisode): number {
	const { flash, flashback } = ep.entry;
	if (!flash && !flashback) return PRIMARY;
	if (!flashback) return ALONGSIDE;
	return ep.tags.some((t) => t.key === 'myth' || t.key === 'founding') ? 3 : 2;
}

type Draft = {
	ep: DirectoryEpisode;
	column: number;
	month: number | null;
	start: number;
	end: number;
	stories: { id: string; title: string; ko?: string; start: number; end: number }[];
	flashbacks: number[];
};

function draftOf(ep: DirectoryEpisode, column: number): Draft | null {
	const entry: Entry = ep.entry;
	const own = yearsIn(entry.year);
	if (!own.length) return null;
	const top = entry.blocks.flatMap(plateYears);
	const all = [...own, ...top];
	const lo = Math.min(...all);
	const hi = Math.max(...all);
	const month = monthOf(entry.sub);
	const start = lo + (month ?? 0) / 12;
	const end = hi === lo && month !== null ? start + 1 / 12 : hi + 1;

	const { stories } = storiesOf(entry.blocks, ep.id);
	// A story starts at its first dated plate; an undated one picks up the latest year reached so far.
	const starts: number[] = [];
	let at = start;
	let undated = false;
	for (const b of entry.blocks) {
		if (b.kind === 'section') {
			starts.push(at);
			undated = true;
			continue;
		}
		const ys = plateYears(b);
		if (!ys.length) continue;
		if (undated) starts[starts.length - 1] = Math.max(Math.min(...ys), starts[starts.length - 2] ?? start);
		undated = false;
		at = ys[ys.length - 1];
	}
	const storySpans =
		stories.length > 1 && hi > lo
			? stories.map((s, i) => {
					const from = Math.max(start, starts[i] ?? start);
					const to = Math.min(end, i < stories.length - 1 ? (starts[i + 1] ?? end) : end);
					return { id: s.id, title: s.title, ko: s.ko, start: from, end: Math.max(from, to) };
				})
			: [];

	const flashbacks = [...new Set(flashbackYears(entry.blocks))].filter((y) => y < Math.floor(start) || y >= Math.ceil(end));
	return { ep, column, month, start, end, stories: storySpans, flashbacks };
}

/**
 * Same-year episodes in one column each get a slot of the year in reading order, so they
 * stack instead of piling into lanes. Months move a slot later when they still fit.
 */
function spreadWithinYears(drafts: Draft[]) {
	const groups = new Map<string, Draft[]>();
	for (const d of drafts) {
		if (d.end - d.start > 1) continue;
		const key = `${d.column}:${Math.floor(d.start)}`;
		groups.set(key, [...(groups.get(key) ?? []), d]);
	}
	for (const list of groups.values()) {
		if (list.length < 2) continue;
		const year = Math.floor(list[0].start);
		const n = list.length;
		const slots: number[] = [];
		list.forEach((d, i) => slots.push(Math.max((d.month ?? 0) / 12, i ? slots[i - 1] + 1 / n : 0)));
		const fits = slots[n - 1] <= (n - 1) / n + 1e-9;
		list.forEach((d, i) => {
			d.start = year + (fits ? slots[i] : i / n);
			d.end = d.start + 1 / n;
		});
	}
}

type Row = { from: number; to: number; top: number; height: number; gap: boolean };

function buildScale(drafts: Draft[], columns: number) {
	const lo = Math.floor(Math.min(...drafts.map((d) => d.start)));
	const hi = Math.ceil(Math.max(...drafts.map((d) => d.end)));
	const covered = new Set<number>();
	const startsPer = new Map<number, number[]>();
	const bump = (year: number, column: number) => {
		const counts = startsPer.get(year) ?? new Array(columns).fill(0);
		counts[column] += 1;
		startsPer.set(year, counts);
	};
	for (const d of drafts) {
		for (let y = Math.floor(d.start); y < Math.ceil(d.end); y++) covered.add(y);
		bump(Math.floor(d.start), d.column);
		d.stories.slice(1).forEach((s) => bump(Math.floor(s.start), d.column));
	}
	const rows: Row[] = [];
	let top = 0;
	for (let y = lo; y < hi; y++) {
		if (!covered.has(y)) {
			let z = y;
			while (z < hi && !covered.has(z)) z++;
			rows.push({ from: y, to: z, top, height: BREAK_H, gap: true });
			top += BREAK_H;
			y = z - 1;
			continue;
		}
		const n = Math.max(0, ...(startsPer.get(y) ?? [0]));
		const height = n ? n * START_ROW_H : THIN_YEAR_H;
		rows.push({ from: y, to: y + 1, top, height, gap: false });
		top += height;
	}
	const scale = (t: number): number => {
		if (t <= lo) return 0;
		for (const r of rows) if (t < r.to) return r.top + ((t - r.from) / (r.to - r.from)) * r.height;
		return top;
	};
	return { rows, scale, height: top };
}

function ticksOf(rows: Row[]): TimelineTick[] {
	const out: TimelineTick[] = [];
	let last = -Infinity;
	for (const r of rows) {
		if (r.gap) continue;
		const major = r.height >= START_ROW_H;
		const prev = out[out.length - 1];
		if (major && prev && !prev.major && r.top - prev.top < 18) out.pop();
		if (major || (r.from % 10 === 0 && r.top - last >= 18)) {
			out.push({ year: r.from, top: r.top, major });
			last = r.top;
		}
	}
	return out;
}

function laneOf(lanes: number[], top: number, bottom: number): number {
	let lane = lanes.findIndex((b) => b <= top + 0.5);
	if (lane < 0) lane = lanes.length;
	lanes[lane] = bottom;
	return lane;
}

/**
 * The primary column is one lane. Shorter episodes claim it first, so a long bar that spans
 * other present-day episodes (Jahee's ten years, a two-year campaign) moves alongside them.
 */
function spillOverlaps(drafts: Draft[]) {
	const kept: Draft[] = [];
	const byLength = drafts
		.filter((d) => d.column === PRIMARY)
		.sort((a, b) => a.end - a.start - (b.end - b.start) || a.start - b.start);
	for (const d of byLength) {
		if (kept.some((k) => k.start < d.end - 1e-6 && d.start < k.end - 1e-6)) d.column = ALONGSIDE;
		else kept.push(d);
	}
}

/** Each Arc's span on the primary column, from its first bar to its last. */
function arcSpans(items: TimelineItem[], arcOf: Map<string, number>): TimelineArc[] {
	const arcs = PARTS.flatMap((p) => p.arcs);
	const spans = new Map<number, { top: number; bottom: number }>();
	for (const item of items) {
		const a = arcOf.get(item.ep.id)!;
		const s = spans.get(a);
		const bottom = item.top + item.height;
		spans.set(a, s ? { top: Math.min(s.top, item.top), bottom: Math.max(s.bottom, bottom) } : { top: item.top, bottom });
	}
	return [...spans]
		.sort((x, y) => x[1].top - y[1].top)
		.map(([a, s]) => ({
			id: arcs[a].id,
			label: { en: arcLabelAt(arcs[a].index, false), ko: arcLabelAt(arcs[a].index, true) },
			title: { en: arcs[a].title, ko: arcs[a].korean ?? arcs[a].title },
			top: s.top,
			height: s.bottom - s.top
		}));
}

function sceneLabel(b: Block): string {
	return b.kind === 'scene' || b.kind === 'day' ? ((b as { label?: string }).label ?? '') : '';
}

/** Words a cover spec points at; `null` when it is only a mention (or does not resolve). */
function coverWords(blocks: Block[], spec: CoverSpec): number | null {
	if (spec.text !== undefined) return null;
	if (spec.flashback !== undefined) {
		const f = blocks.find((b) => b.kind === 'flashback' && yearsIn(b.year).includes(spec.flashback!));
		return f && f.kind === 'flashback' ? wordsIn(f.blocks) : null;
	}
	if (spec.scene === undefined) return wordsIn(blocks);
	let words = 0;
	for (const frag of ([] as string[]).concat(spec.scene)) {
		const i = blocks.findIndex((b) => sceneLabel(b).includes(frag));
		if (i < 0) continue;
		let j = i + 1;
		while (j < blocks.length && !sceneLabel(blocks[j]) && blocks[j].kind !== 'story') j++;
		words += wordsIn(blocks.slice(i + 1, j));
	}
	return words;
}

/** Key events on the scale; events sharing a year with no month spread across it so each can be snapped to. */
function eventsOf(scale: (t: number) => number): TimelineEvent[] {
	const byTitle = new Map(PARTS.flatMap((p) => p.arcs.flatMap((a) => a.episodes)).map((ep) => [ep.title, ep]));
	const specs = KEY_EVENTS as EventSpec[];
	const plain = new Map<number, EventSpec[]>();
	for (const e of specs) if (monthOf(e.sub) === null) plain.set(e.year, [...(plain.get(e.year) ?? []), e]);
	return specs
		.map((e): TimelineEvent => {
			const month = monthOf(e.sub);
			const same = plain.get(e.year) ?? [e];
			const at = month !== null ? e.year + (month + 0.5) / 12 : e.year + (same.indexOf(e) + 0.5) / same.length;
			const covers = e.covers.flatMap((c): EventCover[] => {
				const ep = episodeOfCover(c.ep, byTitle);
				if (!ep) return [];
				const words = coverWords(ep.entry.blocks, c);
				return [{ ep, full: !c.brief && words !== null && words >= FULL_WORDS }];
			});
			covers.sort((a, b) => Number(b.full) - Number(a.full));
			return {
				id: e.id,
				year: e.year,
				sub: e.sub,
				title: { en: e.en, ko: e.ko },
				top: scale(at),
				covers,
				crossover: covers.length > 1,
				people: peopleOfEvent(e, covers, e.year),
				stills: stillsOfEvent(e, covers)
			};
		})
		.sort((a, b) => a.top - b.top);
}

function build() {
	const arcs = PARTS.flatMap((p) => p.arcs);
	const drafts: Draft[] = [];
	const timeless: DirectoryEpisode[][] = COLUMNS.map(() => []);
	const arcOf = new Map<string, number>();
	arcs.forEach((arc, a) =>
		arc.episodes.forEach((ep) => {
			const column = columnOf(ep);
			arcOf.set(ep.id, a);
			const d = draftOf(ep, column);
			if (d) drafts.push(d);
			else timeless[column].push(ep);
		})
	);
	spreadWithinYears(drafts);
	spillOverlaps(drafts);
	const { rows, scale, height } = buildScale(drafts, COLUMNS.length);

	const built: TimelineColumn[] = COLUMNS.map((meta, column) => {
		const lanes: number[] = [];
		const items = drafts
			.filter((d) => d.column === column)
			.map((d) => {
				const top = scale(d.start);
				return { d, top, bottom: Math.max(scale(d.end), top + MIN_ITEM_H) };
			})
			.sort((a, b) => a.top - b.top || b.bottom - a.bottom)
			.map(({ d, top, bottom }): TimelineItem => ({
				ep: d.ep,
				lane: laneOf(lanes, top, bottom),
				start: d.start,
				end: d.end,
				from: Math.floor(d.start),
				to: Math.ceil(d.end) - 1,
				top,
				height: bottom - top - 3,
				flash: !!(d.ep.entry.flash || d.ep.entry.flashback),
				tone: toneOf(d.ep),
				stories: d.stories.map((s) => {
					const sTop = scale(s.start);
					return { ...s, top: sTop, height: Math.max(0, scale(s.end) - sTop) };
				}),
				flashbacks: d.flashbacks.map((year) => ({ year, top: scale(year + 0.5) }))
			}));
		return { ...meta, lanes: Math.max(1, lanes.length), items, timeless: timeless[column] };
	});
	const columns = built.filter((c) => c.id === 'primary' || c.items.length || c.timeless.length);

	return {
		columns,
		arcs: arcSpans(built[PRIMARY].items, arcOf),
		/** Where the present day begins, so the board opens on the main story. */
		presentTop: Math.min(...built[PRIMARY].items.map((i) => i.top)),
		events: eventsOf(scale),
		rows,
		height,
		ticks: ticksOf(rows),
		breaks: rows.filter((r) => r.gap).map(({ from, to, top, height }): TimelineBreak => ({ from, to, top, height })),
		timelessRows: Math.max(0, ...columns.map((c) => c.timeless.length))
	};
}

export const TIMELINE = build();

/**
 * The year under a pixel of the board, or null inside a folded gap. Only the year: inside a
 * busy year the slots follow reading order, not months.
 */
export function yearAt(px: number): number | null {
	const r = TIMELINE.rows.find((row) => px >= row.top && px < row.top + row.height);
	return r && !r.gap ? r.from : null;
}

/** True when two items share any stretch of time. */
export function concurrent(a: Pick<TimelineItem, 'start' | 'end'>, b: Pick<TimelineItem, 'start' | 'end'>): boolean {
	return a.start < b.end && b.start < a.end;
}
