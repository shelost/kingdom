/**
 * Lines for `/quotes`: the chronicle's iconic mouths, the record cards,
 * and (in the browser) whatever the reader starred from a highlight.
 */
import { chapters, entryId, type Block } from '$lib/story';
import { byId } from '$lib/people';
import { plainText } from '$lib/speech';

export type QuoteKind = 'iconic' | 'record';

export type StoryQuote = {
	id: string;
	kind: QuoteKind;
	en: string;
	ko?: string;
	hanja?: string;
	person?: string;
	episodeId?: string;
	entryTitle?: string;
	/** Annals, stele, letter — only on record cards. */
	source?: string;
	historical?: boolean;
};

const LEADS = [
	'yushin',
	'chunchu',
	'bidam',
	'euija',
	'gyebek',
	'gesomun',
	'sunduk',
	'munmu',
	'jumong',
	'munhee',
	'alchun',
	'seohyeon',
	'taizong',
	'yangmanchun',
	'yuridora',
	'dangun',
	'onjo',
	'suro',
	'haemosu',
	'sosuno'
] as const;

/** Lines the book wants on the wall that are not a person's wiki `quote`. */
const EXTRA: StoryQuote[] = [
	{
		id: 'iconic-yushin-one-way',
		kind: 'iconic',
		person: 'yushin',
		entryTitle: 'Seung',
		episodeId: episodeIdByTitle('Seung'),
		en: 'There are a thousand different ways to be wrong... but only one way to be right.',
		ko: '틀린 길은 천 가지요. 바른 길은 하나요.'
	},
	{
		id: 'iconic-euija-country',
		kind: 'iconic',
		person: 'euija',
		entryTitle: 'Yunchung',
		episodeId: episodeIdByTitle('Yunchung'),
		en: 'A country is a territory governed by a single story.',
		ko: '나라는, 하나의 이야기가 다스리는 영역이다.',
		historical: false
	},
	{
		id: 'iconic-bidam-blood',
		kind: 'iconic',
		person: 'bidam',
		entryTitle: 'Gyul',
		episodeId: episodeIdByTitle('Gyul'),
		en: 'Blood is inevitable.',
		ko: '피는 못 속인다.'
	}
];

function episodeIdByTitle(title: string): string | undefined {
	for (const ch of chapters) {
		if (ch.entries.some((e) => e.title === title)) return entryId(ch.id, title);
	}
}

function walk(blocks: Block[] | undefined, visit: (b: Block) => void) {
	for (const b of blocks ?? []) {
		visit(b);
		if (b.kind === 'flashback') walk(b.blocks, visit);
	}
}

function locate(en: string): { episodeId?: string; entryTitle?: string } {
	const needle = plainText(en).replace(/<[^>]+>/g, '').slice(0, 48).toLowerCase();
	if (needle.length < 12) return {};
	for (const ch of chapters) {
		for (const entry of ch.entries) {
			let found = false;
			walk(entry.blocks, (b) => {
				if (found) return;
				const bits: string[] = [];
				if (b.kind === 'dialogue') bits.push(...(b.en ?? []), ...(b.lines ?? []));
				else if (b.kind === 'quote' || b.kind === 'p') bits.push(b.html ?? '');
				if (bits.some((t) => plainText(t).toLowerCase().includes(needle))) found = true;
			});
			if (found) return { episodeId: entryId(ch.id, entry.title), entryTitle: entry.title };
		}
	}
	return {};
}

function leadQuotes(): StoryQuote[] {
	const extras = new Set(EXTRA.map((q) => q.person));
	return LEADS.flatMap((id) => {
		const p = byId.get(id);
		if (!p?.quote) return [];
		if (extras.has(id) && EXTRA.some((q) => q.en === p.quote)) return [];
		return [
			{
				id: `lead-${id}`,
				kind: 'iconic' as const,
				person: id,
				en: p.quote,
				...locate(p.quote)
			}
		];
	});
}

function recordQuotes(): StoryQuote[] {
	const out: StoryQuote[] = [];
	const seen = new Set<string>();
	for (const ch of chapters) {
		for (const entry of ch.entries) {
			walk(entry.blocks, (b) => {
				if (b.kind !== 'quote') return;
				const en = plainText(b.html).trim();
				if (en.length < 12 || seen.has(en)) return;
				seen.add(en);
				out.push({
					id: `rec-${out.length}-${entryId(ch.id, entry.title)}`,
					kind: 'record',
					en,
					ko: b.ko ? plainText(b.ko) : undefined,
					hanja: b.hanja,
					person: b.person,
					episodeId: entryId(ch.id, entry.title),
					entryTitle: entry.title,
					source: b.source,
					historical: true
				});
			});
		}
	}
	return out;
}

export const ICONIC_QUOTES: StoryQuote[] = [...EXTRA, ...leadQuotes()];
export const RECORD_QUOTES: StoryQuote[] = recordQuotes();
export const CANON_QUOTES: StoryQuote[] = [...ICONIC_QUOTES, ...RECORD_QUOTES];

export const QUOTE_TOTAL = CANON_QUOTES.length;

export function quoteSearchText(q: StoryQuote): string {
	return [q.en, q.ko, q.hanja, q.source, q.entryTitle, q.person ? byId.get(q.person)?.name : '']
		.filter(Boolean)
		.join(' ')
		.toLowerCase();
}
