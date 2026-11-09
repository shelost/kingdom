/**
 * Momal's answer format, shared by the server (`/api/ask` trace, `/api/momal/refs`)
 * and the client widgets. The model writes markdown with fenced ```widget blocks of
 * JSON; `parseMomal` splits a (possibly still streaming) answer into prose and widgets.
 */

/** Which layer a fact belongs to: the historical record, this chronicle's invention, or both. */
export type MomalLayer = 'record' | 'chronicle' | 'both';

export type MomalPersonRef = {
	id: string;
	name: string;
	korean?: string;
	hanja?: string;
	kingdom: string;
	kingdomKo?: string;
	color: string;
	avatar?: string | null;
	life?: string;
	title?: string;
	tagline?: string;
	/** Birth or death year is the chronicle's, not the record's. */
	invented?: boolean;
};

export type MomalEpisodeRef = {
	id: string;
	queryId: string;
	title: string;
	subtitle?: string;
	year: string;
	logline?: { en: string; ko: string };
	cover?: string;
};

export type MomalStill = { id: string; src: string; alt: string; episode: string; episodeTitle: string };

export type MomalSource = { label: string; url?: string; layer: MomalLayer };

export type MomalStep = { icon: string; en: string; ko: string; items: string[] };

/** How two people are related on our wiki's family tree. Lines run from the common ancestor down. */
export type MomalKin = {
	a: string;
	b: string;
	chon: number | null;
	en: string;
	ko: string;
	married?: boolean;
	ancestor?: string;
	toA?: string[];
	toB?: string[];
};

/** One person's immediate family on our wiki's tree. */
export type MomalFamily = {
	person: string;
	parents: string[];
	spouses: string[];
	siblings: string[];
	children: string[];
};

export type MomalRefs = {
	people: Record<string, MomalPersonRef>;
	episodes: Record<string, MomalEpisodeRef>;
	stills: Record<string, MomalStill[]>;
	/** Keyed by `kinKey(a, b)`. */
	kin: Record<string, MomalKin>;
	family: Record<string, MomalFamily>;
};

export function kinKey(a: string, b: string): string {
	return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export type MomalTrace = MomalRefs & {
	/** Server time spent gathering the briefing. */
	ms: number;
	steps: MomalStep[];
	sources: MomalSource[];
};

export type MomalWidget =
	| {
			type: 'split';
			topic?: string;
			record?: string[];
			chronicle?: string[];
			recordSources?: string[];
			episodes?: string[];
			verdict?: string;
	  }
	| { type: 'people'; ids: string[]; note?: string }
	| { type: 'relation'; a: string; b: string; label: string; layer?: MomalLayer }
	| { type: 'timeline'; title?: string; events: { year: number; label: string; layer?: MomalLayer }[] }
	| { type: 'quote'; source: string; hanja?: string; ko?: string; en?: string }
	| { type: 'episodes'; ids: string[] }
	| { type: 'gallery'; person: string }
	/** A widget from the book itself (diagram, record, term, map, card…), by its `storyWidgetId`. */
	| { type: 'story'; id: string; note?: string }
	| { type: 'kin'; a: string; b: string }
	| { type: 'family'; person: string };

export type MomalSegment =
	| { kind: 'text'; text: string }
	| { kind: 'widget'; widget: MomalWidget }
	/** A widget block that has started streaming but has not closed yet. */
	| { kind: 'pending'; type?: string };

const FENCE = /```widget[^\n]*\n([\s\S]*?)(?:```|$)/g;

function asStrings(v: unknown, max = 12): string[] {
	return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && !!x.trim()).slice(0, max) : [];
}

/** Episode ids as the model may write them (`?ep=gi`, `ep=gi`, `gi`) → `gi`. */
function asEpisodes(v: unknown, max: number): string[] {
	return asStrings(v, max).map((s) => s.trim().replace(/^\??ep=/, ''));
}

/** A lone "Follow-up questions:" line the model sometimes writes above the followups block. */
const FOLLOW_HEAD = /^\s*(\*\*)?\s*(follow[- ]?up( questions)?|next questions|이어서 물어보기|다음 질문)\s*:?\s*(\*\*)?\s*:?\s*$/i;

function asLayer(v: unknown): MomalLayer | undefined {
	return v === 'record' || v === 'chronicle' || v === 'both' ? v : undefined;
}

/** Validate one widget object; anything malformed is dropped rather than half-drawn. */
function toWidget(raw: unknown): MomalWidget | 'followups' | null {
	if (!raw || typeof raw !== 'object') return null;
	const o = raw as Record<string, unknown>;
	switch (o.type) {
		case 'followups':
			return 'followups';
		case 'split':
			return {
				type: 'split',
				topic: typeof o.topic === 'string' ? o.topic : undefined,
				record: asStrings(o.record),
				chronicle: asStrings(o.chronicle),
				recordSources: asStrings(o.recordSources, 6),
				episodes: asEpisodes(o.episodes, 4),
				verdict: typeof o.verdict === 'string' ? o.verdict : undefined
			};
		case 'people': {
			const ids = asStrings(o.ids, 4);
			return ids.length ? { type: 'people', ids, note: typeof o.note === 'string' ? o.note : undefined } : null;
		}
		case 'relation':
			return typeof o.a === 'string' && typeof o.b === 'string'
				? { type: 'relation', a: o.a, b: o.b, label: typeof o.label === 'string' ? o.label : '', layer: asLayer(o.layer) }
				: null;
		case 'timeline': {
			const events = (Array.isArray(o.events) ? o.events : [])
				.map((e) => e as Record<string, unknown>)
				.filter((e) => typeof e?.year === 'number' && typeof e.label === 'string')
				.map((e) => ({ year: e.year as number, label: e.label as string, layer: asLayer(e.layer) }))
				.slice(0, 10);
			return events.length
				? { type: 'timeline', title: typeof o.title === 'string' ? o.title : undefined, events }
				: null;
		}
		case 'quote':
			return typeof o.source === 'string' && (o.hanja || o.ko || o.en)
				? {
						type: 'quote',
						source: o.source,
						hanja: typeof o.hanja === 'string' ? o.hanja : undefined,
						ko: typeof o.ko === 'string' ? o.ko : undefined,
						en: typeof o.en === 'string' ? o.en : undefined
					}
				: null;
		case 'episodes': {
			const ids = asEpisodes(o.ids, 4);
			return ids.length ? { type: 'episodes', ids } : null;
		}
		case 'gallery':
			return typeof o.person === 'string' ? { type: 'gallery', person: o.person } : null;
		case 'family':
			return typeof o.person === 'string' ? { type: 'family', person: o.person } : null;
		case 'kin':
			return typeof o.a === 'string' && typeof o.b === 'string' && o.a !== o.b
				? { type: 'kin', a: o.a, b: o.b }
				: null;
		case 'story':
			return typeof o.id === 'string'
				? { type: 'story', id: o.id, note: typeof o.note === 'string' ? o.note : undefined }
				: null;
		default:
			return null;
	}
}

/** Split an answer into prose and widgets, and pull out its follow-up questions. */
export function parseMomal(content: string, live = false): { segments: MomalSegment[]; followups: string[] } {
	const segments: MomalSegment[] = [];
	let followups: string[] = [];
	let last = 0;
	const pushText = (text: string) => {
		const kept = text
			.split('\n')
			.filter((line) => !FOLLOW_HEAD.test(line))
			.join('\n');
		if (kept.trim()) segments.push({ kind: 'text', text: kept });
	};
	for (const m of content.matchAll(FENCE)) {
		pushText(content.slice(last, m.index));
		last = (m.index ?? 0) + m[0].length;
		const closed = m[0].endsWith('```');
		const body = m[1].trim();
		if (!closed) {
			const type = body.match(/"type"\s*:\s*"(\w+)"/)?.[1];
			if (live && type !== 'followups') segments.push({ kind: 'pending', type });
			continue;
		}
		try {
			const raw = JSON.parse(body) as Record<string, unknown>;
			const w = toWidget(raw);
			if (w === 'followups') followups = asStrings(raw.items, 4);
			else if (w) segments.push({ kind: 'widget', widget: w });
		} catch {
			/* malformed block: drop it */
		}
	}
	const tail = content.slice(last);
	const partial = live ? tail.match(/`{1,3}w?i?d?g?e?t?$/) : null;
	if (partial && partial[0].length >= 3) {
		pushText(tail.slice(0, partial.index));
		segments.push({ kind: 'pending' });
	} else pushText(tail);
	return { segments, followups };
}

/** The answer as plain text for copying: prose kept, widget JSON dropped. */
export function momalPlain(content: string): string {
	return content.replace(/```widget[\s\S]*?(?:```|$)/g, '').replace(/\n{3,}/g, '\n\n').trim();
}
