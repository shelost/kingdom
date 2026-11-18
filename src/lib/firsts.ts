/**
 * How a person enters the book.
 *
 * One pass over the chronicle, in reading order. The wiki profile and the
 * dashboard threads both read this — a hint, a naming, an entrance, and a
 * first line are kept only when they fall in different episodes.
 *
 * Allusions cannot be mined from names. The table below is the words on the
 * page, and only the earliest hint that arrives before the name and the body.
 */

import { peopleOfSlot } from '$lib/imagePeople';
import { byId, nameHits, nameOf } from '$lib/people';
import { chapters, type Block } from '$lib/story';
import { widgetTexts } from '$lib/widgets';

export type FirstKind = 'allusion' | 'mention' | 'appearance' | 'speech';

export interface FirstBeat {
	kind: FirstKind;
	episode: string;
	year: string;
	/** A line from the page, for a hint or the sentence that first says the name. */
	line?: string;
	/** How far this beat sits after the first one in the chain. */
	later?: FirstSpan;
}

/** Episodes, chapters, and years between the plant and a later beat. */
export interface FirstSpan {
	episodes: number;
	chapters: number;
	years: number | null;
}

export interface Arrival {
	id: string;
	name: string;
	korean?: string;
	god: boolean;
	beats: FirstBeat[];
}

/** Hints that never say the name. Episode titles are the book's titles. */
const ALLUSIONS: { person: string; episode: string; line: string }[] = [
	{
		person: 'yongsu',
		episode: 'Queen Sunduk',
		line: 'And one of them was a fox, and he bowed to Grandfather, and he said—'
	},
	{
		person: 'yongsu',
		episode: 'Munhee',
		line: 'Your father talks to water.'
	},
	{
		person: 'chunchu',
		episode: 'Munhee',
		line: 'Oi. Ghost boy.'
	},
	{
		person: 'muryuk',
		episode: 'King Jinhung',
		line: 'In the Silla line a tall cone helm does not cheer.'
	},
	{
		person: 'onjo',
		episode: 'Haemosu',
		line: 'If it’s a boy, tell him: under the pine, on the seven-sided stone.'
	}
];

const STOCK = new Set(['courtmaid', 'herald', 'haenyeo', 'narrator', 'messenger']);

const LABEL: Record<FirstKind, string> = {
	allusion: 'First allusion',
	mention: 'First mention',
	appearance: 'First appearance',
	speech: 'First words'
};

export function firstLabel(kind: FirstKind): string {
	return LABEL[kind];
}

function yearNum(year: string): number | null {
	const m = year.match(/-?\d+/);
	if (!m) return null;
	const n = Number(m[0]);
	return Number.isFinite(n) ? n : null;
}

function yearGap(from: string, to: string): number | null {
	const a = yearNum(from);
	const b = yearNum(to);
	if (a == null || b == null) return null;
	const d = b - a;
	return d > 0 ? d : null;
}

/** “24 episodes later · 3 chapters later · 9 years later.” Empty when nothing elapsed. */
export function laterLabel(span: FirstSpan, ko = false): string {
	const bits: string[] = [];
	if (span.episodes > 0) {
		bits.push(
			ko
				? `${span.episodes}화 뒤`
				: span.episodes === 1
					? '1 episode later'
					: `${span.episodes} episodes later`
		);
	}
	if (span.chapters > 0) {
		bits.push(
			ko
				? `${span.chapters}편 뒤`
				: span.chapters === 1
					? '1 chapter later'
					: `${span.chapters} chapters later`
		);
	}
	if (span.years != null && span.years > 0) {
		bits.push(ko ? `${span.years}년 뒤` : span.years === 1 ? '1 year later' : `${span.years} years later`);
	}
	return bits.join(' · ');
}

function track(id: string): boolean {
	const p = byId.get(id);
	if (!p || STOCK.has(id)) return false;
	return p.entity == null || p.entity === 'god' || p.entity === 'animal' || p.entity === 'relic';
}

/**
 * Surface forms that also mean something else on the page: a verb (사라, 죽지),
 * an office (중시), or a title the book uses for more than one man.
 */
const NOT_A_NAME = new Set([
	'사라',
	'죽지',
	'중시',
	'侍中',
	'Creator',
	'the Creator',
	'창조주',
	'Son of Heaven',
	'천자',
	'Chancellor',
	'Grand Herald',
	'대대로',
	'Premier',
	'Gardener',
	'마리',
	'매화',
	'Xuanwu',
	'Buyeo',
	'부여',
	'이치',
	'Yeon',
	'자의'
]);

/** A bare “the queen” or a three-letter “Won” is not a naming. */
function distinctive(alias: string): boolean {
	const a = alias.trim();
	if (a.length < 2 || NOT_A_NAME.has(a)) return false;
	if (/^(the|a|an)\b/i.test(a)) return false;
	if (/^[A-Za-z]{1,3}$/.test(a)) return false;
	return true;
}

function plain(raw: string, index: number, alias: string): string {
	const start = Math.max(0, index - 70);
	const end = Math.min(raw.length, index + alias.length + 80);
	let s = raw
		.slice(start, end)
		.replace(/<[^>]*>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&#?\w+;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	if (start > 0) {
		const gap = s.search(/\s/);
		if (gap > 0 && gap < 28) s = s.slice(gap + 1);
		s = `…${s}`;
	}
	if (end < raw.length) {
		const gap = s.lastIndexOf(' ');
		if (gap > s.length - 28) s = s.slice(0, gap);
		s = `${s}…`;
	}
	if (s.length > 170) s = `${s.slice(0, 167)}…`;
	return s;
}

interface Slot {
	order: number;
	chapter: number;
	episode: string;
	year: string;
	line?: string;
}

interface Row {
	mention?: Slot;
	appearance?: Slot;
	speech?: Slot;
}

let built: Map<string, FirstBeat[]> | null = null;
let episodeAt = new Map<string, number>();

function build(): Map<string, FirstBeat[]> {
	if (built) return built;

	const rows = new Map<string, Row>();
	const rowOf = (id: string): Row => {
		let row = rows.get(id);
		if (!row) {
			row = {};
			rows.set(id, row);
		}
		return row;
	};

	const orderOf = new Map<string, number>();
	episodeAt = orderOf;
	let order = 0;

	const texts: string[] = [];
	const take = (s: string | undefined | null) => {
		if (s) texts.push(s);
	};

	const walk = (blocks: Block[] | undefined, episode: string, year: string, at: number, chapter: number) => {
		for (const b of blocks ?? []) {
			texts.length = 0;
			if (b.kind === 'dialogue' || b.kind === 'monologue' || b.kind === 'poem') {
				if (b.person && track(b.person)) {
					const row = rowOf(b.person);
					if (!row.speech) row.speech = { order: at, chapter, episode, year };
					if (!row.appearance) row.appearance = { order: at, chapter, episode, year };
				}
			} else if (b.kind === 'quote') {
				if (b.person && track(b.person)) {
					const row = rowOf(b.person);
					if (!row.speech) row.speech = { order: at, chapter, episode, year };
				}
			} else if (b.kind === 'card') {
				if (track(b.person)) {
					const row = rowOf(b.person);
					if (!row.appearance) row.appearance = { order: at, chapter, episode, year };
				}
			} else if (b.kind === 'wed') {
				for (const id of b.couple) {
					if (!track(id)) continue;
					const row = rowOf(id);
					if (!row.appearance) row.appearance = { order: at, chapter, episode, year };
				}
			} else if (b.kind === 'diagram' && b.cast) {
				for (const id of Object.values(b.cast)) {
					if (!track(id)) continue;
					const row = rowOf(id);
					if (!row.appearance) row.appearance = { order: at, chapter, episode, year };
				}
			} else if (b.kind === 'flashback') {
				walk(b.blocks, episode, year, at, chapter);
			}

			if (b.kind === 'dialogue') {
				for (const line of b.lines ?? []) take(line);
				for (const line of b.en ?? []) take(line);
			} else if (b.kind === 'p' || b.kind === 'cite' || b.kind === 'quote' || b.kind === 'moral' || b.kind === 'monologue') {
				take(b.html);
				take(b.ko);
			} else if (b.kind === 'poem') {
				take(b.html);
				take(b.ko);
			} else if (b.kind === 'flashback') {
				take(b.title);
			} else if (b.kind === 'card') {
				take(b.caption);
				take(b.ko);
				take(b.write);
			} else if (b.kind !== 'flashback') {
				const t = widgetTexts(b);
				if (t) for (const s of [...t.en, ...t.ko, ...t.hanja]) take(s);
			}

			for (const raw of texts) {
				const seen = new Set<string>();
				for (const hit of nameHits(raw)) {
					if (seen.has(hit.id) || !track(hit.id) || !distinctive(hit.alias)) continue;
					seen.add(hit.id);
					const row = rowOf(hit.id);
					if (row.mention) continue;
					row.mention = { order: at, chapter, episode, year, line: plain(raw, hit.index, hit.alias) };
				}
			}
		}
	};

	const chapterOf = new Map<string, number>();
	let chapterIndex = 0;
	for (const chapter of chapters) {
		for (const entry of chapter.entries) {
			const at = order++;
			if (!orderOf.has(entry.title)) orderOf.set(entry.title, at);
			if (!chapterOf.has(entry.title)) chapterOf.set(entry.title, chapterIndex);
			const episode = entry.title;
			const year = entry.year;
			const chapterAt = chapterOf.get(episode) ?? chapterIndex;
			for (const id of entry.cast ?? []) {
				if (!track(id)) continue;
				const row = rowOf(id);
				if (!row.appearance) row.appearance = { order: at, chapter: chapterAt, episode, year };
			}
			walk(entry.blocks, episode, year, at, chapterAt);
			for (const slot of entry.images ?? []) {
				for (const id of peopleOfSlot(slot.id, slot.people)) {
					if (!track(id)) continue;
					const row = rowOf(id);
					if (!row.appearance) row.appearance = { order: at, chapter: chapterAt, episode, year };
				}
			}
		}
		chapterIndex++;
	}

	const allusions = new Map<string, Slot>();
	for (const hint of ALLUSIONS) {
		if (!track(hint.person) || allusions.has(hint.person)) continue;
		const at = orderOf.get(hint.episode);
		if (at == null) continue;
		const entry = chapters.flatMap((ch) => ch.entries).find((e) => e.title === hint.episode);
		allusions.set(hint.person, {
			order: at,
			chapter: chapterOf.get(hint.episode) ?? 0,
			episode: hint.episode,
			year: entry?.year ?? '',
			line: hint.line
		});
	}

	const out = new Map<string, FirstBeat[]>();
	for (const [id, row] of rows) {
		const allusion = allusions.get(id);
		const prior = [row.mention, row.appearance, row.speech].filter((s): s is Slot => !!s);
		const hint = allusion && prior.every((s) => allusion.order < s.order) ? allusion : undefined;
		type Ev = {
			order: number;
			chapter: number;
			episode: string;
			year: string;
			kinds: Set<FirstKind>;
			lines: Partial<Record<FirstKind, string>>;
		};
		const eps = new Map<number, Ev>();
		const add = (kind: FirstKind, slot?: Slot) => {
			if (!slot) return;
			let ev = eps.get(slot.order);
			if (!ev) {
				ev = {
					order: slot.order,
					chapter: slot.chapter,
					episode: slot.episode,
					year: slot.year,
					kinds: new Set(),
					lines: {}
				};
				eps.set(slot.order, ev);
			}
			ev.kinds.add(kind);
			if (slot.line) ev.lines[kind] = slot.line;
		};
		add('allusion', hint);
		add('mention', row.mention);
		add('appearance', row.appearance);
		add('speech', row.speech);
		const appearanceAt = row.appearance?.order;
		const evs = [...eps.values()].sort((a, b) => a.order - b.order);
		const planted = evs[0];
		const beats: FirstBeat[] = evs.map((ev) => {
			let kind: FirstKind = 'mention';
			if (ev.kinds.has('speech') && appearanceAt != null && appearanceAt !== ev.order) kind = 'speech';
			else if (ev.kinds.has('appearance')) kind = 'appearance';
			else if (ev.kinds.has('speech')) kind = 'speech';
			else if (ev.kinds.has('mention')) kind = 'mention';
			else kind = 'allusion';
			const line = kind === 'allusion' || kind === 'mention' ? ev.lines[kind] : undefined;
			const years = planted ? yearGap(planted.year, ev.year) : null;
			const later =
				planted && ev.order !== planted.order
					? {
							episodes: ev.order - planted.order,
							chapters: ev.chapter - planted.chapter,
							years
						}
					: undefined;
			return { kind, episode: ev.episode, year: ev.year, line, later };
		});
		if (beats.length > 1) out.set(id, beats);
	}

	built = out;
	return out;
}

/** The chain for one profile. Empty when every first lands in the same episode. */
export function firstsOf(id: string): FirstBeat[] {
	return build().get(id) ?? [];
}

/**
 * Entrances the threads page should show: a god, or a name that lands in a
 * different episode from the body. A face in the prologue who speaks later
 * stays on the wiki profile and does not become a device.
 */
export function plantedArrivals(): Arrival[] {
	return arrivals().filter(
		(a) => a.god || a.beats.some((b) => b.kind === 'allusion' || b.kind === 'mention')
	);
}

/** Every split entrance, in the order the book pays them off. */
export function arrivals(): Arrival[] {
	const index = build();
	const list: Arrival[] = [];
	for (const [id, beats] of index) {
		const p = byId.get(id);
		if (!p) continue;
		list.push({
			id,
			name: nameOf(p),
			korean: p.korean,
			god: p.entity === 'god',
			beats
		});
	}
	const at = (a: Arrival) => episodeAt.get(a.beats[a.beats.length - 1]?.episode ?? '') ?? 0;
	list.sort((a, b) => at(a) - at(b) || Number(b.god) - Number(a.god) || a.name.localeCompare(b.name));
	return list;
}
