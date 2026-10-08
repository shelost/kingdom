/**
 * Every kind of drawn block the chronicle can show — record cards, intro cards,
 * calligraphy, maps, diagrams — with a registry to label them and a walker that
 * finds each instance in the story. Also the plain text of the newer record kinds,
 * shared by search, image anchors, mention counts and word counts.
 */
import type { Block, Chapter, QuoteStyle } from '$lib/story';
import { recordBook, type RecordKind } from '$lib/recordBooks';
import { PLACES } from '$lib/places';
export type WidgetGroup =
	| 'sources'
	| 'characters'
	| 'evolutions'
	| 'places'
	| 'classics'
	| 'maps'
	| 'diagrams'
	| 'other';

/** `quote:<style>` for record cards by material; `card:coronation` for a portrait that evolves. */
export type WidgetKind =
	| `quote:${QuoteStyle | Exclude<RecordKind, QuoteStyle>}`
	| 'card'
	| 'card:coronation'
	| 'hanja'
	| 'term'
	| 'map'
	| 'diagram'
	| 'formation'
	| 'battle'
	| 'table'
	| 'verse'
	| 'poem'
	| 'chengyu'
	| 'edict'
	| 'covenant'
	| 'omens'
	| 'oath'
	| 'place';

export type WidgetType = {
	kind: WidgetKind;
	label: string;
	ko: string;
	group: WidgetGroup;
	describe: string;
};

export const WIDGET_TYPES: WidgetType[] = [
	{ kind: 'quote:annal', label: 'Court annal', ko: '정사', group: 'sources', describe: 'A line from a court history on annal paper, original in woodblock columns, sealed with the book’s seal.' },
	{ kind: 'quote:myth', label: 'Tale record', ko: '설화 기록', group: 'sources', describe: 'A monk’s or storyteller’s record on warmer paper with a double border.' },
	{ kind: 'quote:stele', label: 'Stele rubbing', ko: '비문 탁본', group: 'sources', describe: 'An inscription taken off a standing stone: pale characters on black rubbing paper.' },
	{ kind: 'quote:tomb', label: 'Epitaph stone', ko: '묘지석', group: 'sources', describe: 'A tomb epitaph cut into a ruled stone, every character in its own cell.' },
	{ kind: 'quote:sutra', label: 'Sutra', ko: '경전', group: 'sources', describe: 'Gold ink on indigo paper under a lotus, with the Sanskrit beside the Chinese.' },
	{ kind: 'quote:shaman', label: 'Shaman recitation', ko: '본풀이', group: 'sources', describe: 'A Jeju simbang’s chant, with the five-colour streamers down the edge.' },
	{ kind: 'quote:letter', label: 'Letter', ko: '서신', group: 'sources', describe: 'A folded letter between two correspondents that unfolds; replies answer from the other side.' },
	{ kind: 'quote:stage', label: 'Stage text', ko: '극본', group: 'sources', describe: 'A line from the opera stage.' },
	{ kind: 'edict', label: 'Imperial edict', ko: '조서', group: 'sources', describe: 'A yellow silk edict that unrolls between wooden rollers, read right to left.' },
	{ kind: 'covenant', label: 'Covenant', ko: '맹약', group: 'sources', describe: 'An oath between parties, joined by a red cord and sealed with a smear of blood.' },
	{ kind: 'omens', label: 'Portents', ko: '징조', group: 'sources', describe: 'Omens stamped one by one in vermilion as the reader arrives.' },
	{ kind: 'oath', label: 'Oath stone', ko: '서약석', group: 'sources', describe: 'An inscribed pebble the reader can turn over to read its back.' },
	{ kind: 'card', label: 'Character card', ko: '인물 카드', group: 'characters', describe: 'A portrait beside the name in brushed calligraphy, on first entrance or as a profile.' },
	{ kind: 'card:coronation', label: 'Coronation', ko: '즉위', group: 'evolutions', describe: 'One portrait evolves into the next: before and after side by side, names standing in columns.' },
	{ kind: 'place', label: 'Place card', ko: '장소 카드', group: 'places', describe: 'A location’s first appearance: its hanja brushed in a column beside its picture and name.' },
	{ kind: 'map', label: 'Map excerpt', ko: '지도', group: 'maps', describe: 'A crop of the border map in a given year, with routes and an optional sweep through time.' },
	{ kind: 'battle', label: 'Battle map', ko: '전투 지도', group: 'maps', describe: 'A battlefield phase by phase from the records: terrain, arrows, and troops as moving dots, one per thousand men.' },
	{ kind: 'hanja', label: 'Name in hanja', ko: '한자 이름', group: 'classics', describe: 'A name written character by character, stroke order animated, with each gloss.' },
	{ kind: 'term', label: 'Term', ko: '용어', group: 'classics', describe: 'A word the narrator stops to explain: brushed hanja, reading, gloss.' },
	{ kind: 'chengyu', label: 'Idiom', ko: '고사성어', group: 'classics', describe: 'A four-character idiom brushed in ink, its readings, its source, and the story behind it.' },
	{ kind: 'poem', label: 'Poem', ko: '시', group: 'classics', describe: 'A poem on xuan paper in vertical columns; an answering poem replies from the other side.' },
	{ kind: 'verse', label: 'Verse', ko: '노래', group: 'other', describe: 'Sung or chanted lines set off by a lit rule.' },
	{ kind: 'diagram', label: 'Diagram', ko: '도해', group: 'diagrams', describe: 'An animated explainer for an institution or concept.' },
	{ kind: 'formation', label: 'Battle formation', ko: '진형', group: 'diagrams', describe: 'Two sides of labelled units facing each other.' },
	{ kind: 'table', label: 'Table', ko: '표', group: 'diagrams', describe: 'A plain table of facts.' }
];

const TYPE_BY_KIND = new Map(WIDGET_TYPES.map((t) => [t.kind, t]));

/** Which widget a block draws, or null for prose, dialogue, plates and flashbacks. */
export function widgetKindOf(b: Block): WidgetKind | null {
	switch (b.kind) {
		case 'quote':
			return `quote:${b.style ?? recordBook(b.source).kind}`;
		case 'card':
			return b.from || b.tab === 'coronation' ? 'card:coronation' : 'card';
		case 'hanja':
		case 'term':
		case 'map':
		case 'diagram':
		case 'formation':
		case 'battle':
		case 'table':
		case 'verse':
		case 'poem':
		case 'chengyu':
		case 'edict':
		case 'covenant':
		case 'omens':
		case 'oath':
		case 'place':
			return b.kind;
		default:
			return null;
	}
}

export function widgetType(kind: WidgetKind): WidgetType | undefined {
	return TYPE_BY_KIND.get(kind);
}

export type WidgetInstance = {
	kind: WidgetKind;
	group: WidgetGroup;
	label: string;
	chapterId: string;
	entryTitle: string;
	/** Position of the entry in the whole run, 0-based, in reading order. */
	entryIndex: number;
	/** Index of the block in `entry.blocks` (for a flashback interior, the flashback's index). */
	blockIndex: number;
	/** Index inside the flashback, when the block sits in one. */
	innerIndex?: number;
	block: Block;
	/** Story year: the flashback's own year when it has one, else the entry's. */
	year: number | null;
	/** Cut from the script; kept for the widgets page, with the line it used to follow. */
	hidden?: { after: string | null };
};

export function yearOf(s: string | undefined): number | null {
	if (!s) return null;
	const m = s.match(/-?\d+/);
	return m ? Number(m[0]) : null;
}

/** Every widget instance in the story, in reading order, flashback interiors included. */
export function collectWidgets(story: Chapter[]): WidgetInstance[] {
	const out: WidgetInstance[] = [];
	let entryIndex = 0;
	const add = (b: Block, base: Omit<WidgetInstance, 'kind' | 'group' | 'label' | 'block'>) => {
		const kind = widgetKindOf(b);
		if (!kind) return;
		const type = TYPE_BY_KIND.get(kind);
		out.push({ ...base, kind, group: type?.group ?? 'other', label: type?.label ?? kind, block: b });
	};
	for (const ch of story) {
		for (const entry of ch.entries) {
			const year = yearOf(entry.year);
			entry.blocks.forEach((b, blockIndex) => {
				const base = { chapterId: ch.id, entryTitle: entry.title, entryIndex, blockIndex, year };
				if (b.kind === 'flashback') {
					const inner = yearOf(b.year) ?? year;
					b.blocks.forEach((ib, innerIndex) => add(ib, { ...base, innerIndex, year: inner }));
				} else add(b, base);
			});
			entryIndex++;
		}
	}
	return out;
}


/** The text layers of a record-style block: original, Korean, English (html). */
export type WidgetTexts = { hanja: string[]; ko: string[]; en: string[] };

const some = (...xs: (string | undefined | null)[]) => xs.filter((x): x is string => !!x);

/**
 * Text of the newer record and intro kinds (poem, chengyu, edict, covenant, omens,
 * oath and place), or null for every other kind.
 * Footnotes count as text.
 */
export function widgetTexts(b: Block): WidgetTexts | null {
	const notes = (n: { html: string; ko?: string }[] | undefined) => ({
		en: (n ?? []).map((x) => x.html),
		ko: some(...(n ?? []).map((x) => x.ko))
	});
	switch (b.kind) {
		case 'poem':
		case 'edict':
		case 'covenant':
		case 'oath': {
			const n = notes(b.notes);
			const back = b.kind === 'oath' ? b.back : undefined;
			const title = b.kind === 'oath' ? undefined : b.title;
			return {
				hanja: some(b.hanja),
				ko: some(b.ko, back?.ko, ...n.ko),
				en: some(title, b.html, back?.html, ...n.en)
			};
		}
		case 'chengyu':
			return {
				hanja: some(b.hanja),
				ko: some(b.reading, b.ko, b.storyKo),
				en: some(b.pinyin, b.html, b.story)
			};
		case 'omens':
			return {
				hanja: some(...b.omens.map((o) => o.hanja)),
				ko: some(b.ko, ...b.omens.map((o) => o.ko)),
				en: some(b.title, ...b.omens.map((o) => o.html))
			};
		case 'place': {
			const p = PLACES[b.place];
			return { hanja: some(p?.hanja), ko: some(p?.korean, b.ko), en: some(p?.name, b.html) };
		}
		default:
			return null;
	}
}

/** All of a block's widget text in one string (empty for other kinds) — for anchors and search. */
export function widgetText(b: Block): string {
	const t = widgetTexts(b);
	return t ? [...t.hanja, ...t.ko, ...t.en].join(' ') : '';
}

/** People ids a widget shows: a card's subject, a record's speaker and a letter's recipient. */
export function widgetPeople(b: Block): string[] {
	if (b.kind === 'card') return [b.person];
	if (b.kind === 'quote') return some(b.person, b.to);
	return [];
}

const placeNames = (id: string) => {
	const p = PLACES[id];
	return p ? some(p.name, p.korean, p.hanja) : [];
};

/**
 * Every string a widget draws (html included), for every widget kind: the
 * record kinds through `widgetTexts`, the older kinds field by field. People are
 * left to the caller (`widgetPeople`), which knows how to name them.
 */
export function widgetSearchText(b: Block): string[] {
	const t = widgetTexts(b);
	const base = t ? [...t.hanja, ...t.ko, ...t.en] : [];
	switch (b.kind) {
		case 'quote':
			return some(b.hanja, b.ko, b.html, b.source, b.native, b.nativeLatn, ...(b.notes ?? []).flatMap((n) => [n.html, n.ko]));
		case 'card':
			return some(b.write, b.sub, b.role, b.caption, b.ko);
		case 'hanja':
			return some(b.chars.map((c) => c.char).join(''), b.name, b.ko, b.note, b.noteKo, ...b.chars.flatMap((c) => [c.gloss, c.meaning]));
		case 'term':
			return some(b.hanja, b.reading, b.term, b.html, b.ko);
		case 'map':
			return [...base, ...some(b.title, b.caption, b.ko), ...b.places.flatMap(placeNames)];
		case 'diagram':
			return some(b.diagram, b.title, b.caption, b.ko);
		case 'formation':
			return some(b.title, b.note, ...b.sides.flatMap((s) => [s.name, ...s.units.flatMap((u) => [u.label, u.sub])]));
		// Ids only: the battle files stay out of every bundle but the reader's.
		case 'battle':
			return some(b.battle.replace(/-\d+$/, '').replace(/-/g, ' '), b.phase);
		case 'table':
			return some(...b.head, ...b.rows.flat());
		case 'verse':
			return some(...b.lines, ...(b.en ?? []));
		default:
			return base;
	}
}
