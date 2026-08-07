/**
 * Wiki corpus helpers — the encyclopedia reads PROFILES directly.
 * No parallel CMS; categories are derived from `Person.entity`.
 *
 * ## Entry sort order
 * Within a filtered list (and within each kind group), entries are ordered by:
 * 1. **Lead** — `main: true` first
 * 2. **Appearances** — higher count from `story.json` first (dialogue/monologue
 *    `person` ids, plus alias hits in prose / cite / quote / moral / flashback text)
 * 3. **Chart rank** — relationship-chart `rank` (3 > 2 > 1 > uncharted 0)
 * 4. **Portrait** — real avatar before placeholder / initial
 * 5. **Name** — `nameOf` localeCompare as final tie-break
 */

import {
	PROFILES,
	KINGDOMS,
	byId,
	nameOf,
	isPlaceholderArt,
	avatarOf,
	type Person
} from '$lib/people';
import { BOND_LABEL, CHART_NODES } from '$lib/relations';
import { chapters, type Block } from '$lib/story';

export type WikiKind =
	| 'character'
	| 'place'
	| 'nation'
	| 'concept'
	| 'relationship'
	| 'other';

export const WIKI_KINDS: {
	id: WikiKind;
	label: string;
	plural: string;
}[] = [
	{ id: 'character', label: 'Character', plural: 'Characters' },
	{ id: 'place', label: 'Place', plural: 'Places' },
	{ id: 'nation', label: 'Nation', plural: 'Nations' },
	{ id: 'concept', label: 'Concept', plural: 'Concepts' },
	{ id: 'relationship', label: 'Relationship', plural: 'Relationships' },
	{ id: 'other', label: 'Other', plural: 'Other' }
];

export function kindOf(p: Person): WikiKind {
	if (!p.entity) return 'character';
	if (p.entity === 'place') return 'place';
	if (p.entity === 'nation') return 'nation';
	if (p.entity === 'concept') return 'concept';
	if (p.entity === 'relationship') return 'relationship';
	return 'other';
}

export function kindLabel(p: Person): string {
	const k = kindOf(p);
	if (k === 'relationship' && p.bond) return BOND_LABEL[p.bond];
	return WIKI_KINDS.find((w) => w.id === k)?.label ?? 'Entry';
}

/** Format born/died as a lifespan string, or empty when unknown. */
export function lifespanOf(p: Person): string {
	const f = (n?: number) => (n == null ? '?' : n < 0 ? `${-n} BCE` : `${n}`);
	if (p.born == null && p.died == null) return '';
	return `${p.bornApprox ? 'c. ' : ''}${f(p.born)} – ${f(p.died)}`;
}

export function formatYear(year: number | undefined | null): string {
	if (year == null) return '—';
	return year < 0 ? `${-year} BCE` : String(year);
}

/** Bonds that mention this person (or the bond itself if looking at a relationship). */
export function bondsFor(id: string): Person[] {
	return PROFILES.filter(
		(p) => p.entity === 'relationship' && p.between?.includes(id)
	);
}

/** People on either end of a relationship profile. */
export function betweenPeople(p: Person): Person[] {
	if (!p.between) return [];
	return p.between.map((id) => byId.get(id)).filter((x): x is Person => !!x);
}

export type WikiFilters = {
	kind: WikiKind | 'all';
	kingdom: Person['kingdom'] | 'all';
	q: string;
};

const CHART_RANK = new Map(CHART_NODES.map((n) => [n.id, n.rank as number]));

/** Escape for RegExp from alias strings. */
function escapeRe(s: string) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Build appearance counts once from the chronicle.
 * Dialogue / monologue `person` fields count 1 each; alias matches in free text
 * also increment (capped per text blob so a repeated name in one paragraph
 * does not dominate).
 */
function buildAppearanceCounts(): Map<string, number> {
	const counts = new Map<string, number>();
	const bump = (id: string, n = 1) => {
		if (!id || !byId.has(id)) return;
		counts.set(id, (counts.get(id) ?? 0) + n);
	};

	const aliases = PROFILES.flatMap((p) =>
		p.aliases
			.filter((a) => a.trim().length >= 2)
			.map((alias) => ({ alias, id: p.id }))
	).sort((a, b) => b.alias.length - a.alias.length);

	const nameRe =
		aliases.length === 0
			? null
			: new RegExp(`\\b(${aliases.map((a) => escapeRe(a.alias)).join('|')})\\b`, 'g');
	const aliasToId = new Map(aliases.map((a) => [a.alias, a.id]));

	function countText(text: string | undefined | null) {
		if (!text || !nameRe) return;
		const seen = new Set<string>();
		nameRe.lastIndex = 0;
		let m: RegExpExecArray | null;
		while ((m = nameRe.exec(text)) !== null) {
			const id = aliasToId.get(m[1]);
			if (!id || seen.has(id)) continue;
			seen.add(id);
			bump(id);
		}
	}

	function walkBlocks(blocks: Block[]) {
		for (const b of blocks) {
			if (b.kind === 'dialogue' || b.kind === 'monologue') {
				if (b.person) bump(b.person, 2); // speaker credit weighs more than a mention
			}
			if (b.kind === 'dialogue') {
				for (const line of b.lines ?? []) countText(line);
				for (const line of b.en ?? []) countText(line);
			} else if (b.kind === 'p' || b.kind === 'cite' || b.kind === 'quote' || b.kind === 'moral') {
				countText(b.html);
				countText(b.ko);
			} else if (b.kind === 'monologue') {
				countText(b.html);
				countText(b.ko);
			} else if (b.kind === 'hanja') {
				countText(b.after);
			} else if (b.kind === 'flashback') {
				countText(b.title);
				walkBlocks(b.blocks);
			}
		}
	}

	for (const ch of chapters) {
		for (const entry of ch.entries) {
			walkBlocks(entry.blocks);
		}
	}

	return counts;
}

const APPEARANCES = buildAppearanceCounts();

export function appearanceCount(id: string): number {
	return APPEARANCES.get(id) ?? 0;
}

function chartRankOf(p: Person): number {
	return CHART_RANK.get(p.id) ?? 0;
}

function hasRealAvatar(p: Person): boolean {
	const art = avatarOf(p);
	return !!art && !isPlaceholderArt(art);
}

/**
 * Importance + frequency sort (see file header).
 * Stable enough for the encyclopedia index — not alphabetical.
 */
export function compareWikiEntries(a: Person, b: Person): number {
	const main = Number(!!b.main) - Number(!!a.main);
	if (main) return main;

	const apps = appearanceCount(b.id) - appearanceCount(a.id);
	if (apps) return apps;

	const rank = chartRankOf(b) - chartRankOf(a);
	if (rank) return rank;

	const av = Number(hasRealAvatar(b)) - Number(hasRealAvatar(a));
	if (av) return av;

	return nameOf(a).localeCompare(nameOf(b));
}

export function filterProfiles(filters: WikiFilters): Person[] {
	const q = filters.q.trim().toLowerCase();
	return PROFILES.filter((p) => {
		if (filters.kind !== 'all' && kindOf(p) !== filters.kind) return false;
		if (filters.kingdom !== 'all' && p.kingdom !== filters.kingdom) return false;
		if (!q) return true;
		const hay = [
			p.name,
			p.korean,
			p.hanja,
			p.title,
			p.tagline,
			...p.aliases,
			...(p.sobriquets ?? [])
		]
			.filter(Boolean)
			.join(' ')
			.toLowerCase();
		return hay.includes(q);
	}).sort(compareWikiEntries);
}

export function groupByKind(entries: Person[]): { kind: WikiKind; items: Person[] }[] {
	const order = WIKI_KINDS.map((k) => k.id);
	const buckets = new Map<WikiKind, Person[]>();
	for (const p of entries) {
		const k = kindOf(p);
		const list = buckets.get(k);
		if (list) list.push(p);
		else buckets.set(k, [p]);
	}
	return order
		.filter((k) => buckets.has(k))
		.map((k) => ({ kind: k, items: buckets.get(k)! }));
}

/** Filter chips — every named kingdom except the catch-all `other`. */
export const WIKI_KINGDOMS = (
	Object.keys(KINGDOMS) as Person['kingdom'][]
).filter((k) => k !== 'other');

export const WIKI_TOTAL = PROFILES.length;
