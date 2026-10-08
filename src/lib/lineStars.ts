/**
 * Starred lines of the script: a whole dialogue line or any highlighted passage.
 * Written in dev by the reader's selection menu → /api/line-stars into
 * `src/lib/data/line-stars.json`; the home page's dialogue reel shows them.
 */

export type StarredLine = {
	/** Stable per episode + text, so starring the same passage twice is one star. */
	id: string;
	episodeId: string;
	entryTitle: string;
	/** Speaker's people.ts id, when the passage sits inside one dialogue block. */
	person?: string;
	en: string;
	ko?: string;
	createdAt: string;
};

export type LineStarStore = { updatedAt: string; lines: StarredLine[] };

export const EMPTY_LINE_STORE: LineStarStore = { updatedAt: '', lines: [] };

/** Short, stable id: FNV-1a over the episode and the trimmed text. */
export function lineStarId(episodeId: string, text: string): string {
	let h = 0x811c9dc5;
	for (const ch of `${episodeId}\n${text.trim()}`) {
		h ^= ch.codePointAt(0) ?? 0;
		h = Math.imul(h, 0x01000193) >>> 0;
	}
	return `ln-${h.toString(36)}`;
}

function cleanLine(raw: unknown): StarredLine | null {
	if (!raw || typeof raw !== 'object') return null;
	const v = raw as Partial<StarredLine>;
	if (typeof v.id !== 'string' || typeof v.en !== 'string' || !v.en.trim()) return null;
	return {
		id: v.id,
		episodeId: typeof v.episodeId === 'string' ? v.episodeId : '',
		entryTitle: typeof v.entryTitle === 'string' ? v.entryTitle : '',
		...(typeof v.person === 'string' && v.person ? { person: v.person } : {}),
		en: v.en.trim(),
		...(typeof v.ko === 'string' && v.ko.trim() ? { ko: v.ko.trim() } : {}),
		createdAt: typeof v.createdAt === 'string' ? v.createdAt : ''
	};
}

export function cleanLineStore(raw: unknown): LineStarStore {
	if (!raw || typeof raw !== 'object') return { ...EMPTY_LINE_STORE, lines: [] };
	const v = raw as Partial<LineStarStore>;
	const seen = new Set<string>();
	const lines = (Array.isArray(v.lines) ? v.lines : [])
		.map(cleanLine)
		.filter((l): l is StarredLine => !!l && !seen.has(l.id) && !!seen.add(l.id));
	return { updatedAt: typeof v.updatedAt === 'string' ? v.updatedAt : '', lines };
}
