/**
 * Wiki corpus helpers — the encyclopedia reads PROFILES directly.
 * No parallel CMS; categories are derived from `Person.entity`.
 *
 * ## Entry sort order
 * Within a filtered list (and within each kind / god-tier group), entries are ordered by:
 * 1. **God tier** — S → I → II → III → demigod → unranked
 * 2. **Lead** — `main: true` first
 * 3. **Appearances** — higher count from `story.json` first (dialogue/monologue
 *    `person` ids, plus alias hits in prose / cite / quote / moral / flashback text)
 * 4. **Chart rank** — relationship-chart `rank` (3 > 2 > 1 > uncharted 0)
 * 5. **Portrait** — real avatar before placeholder / initial
 * 6. **Name** — `nameOf` localeCompare as final tie-break
 *
 * When Type = Gods, the index also buckets into class sections via `groupByGodTier`.
 * When Type = Clans, entries sort by member count (desc), then importance; roster
 * within each clan detail sorts youngest → oldest by birth year.
 * The Hwarang org detail is a member grid grouped by yearly class
 * (First Class / 제일기 first), then seniority within the class. Only
 * occupied rooms appear — class number = entry year − 559.
 * Group detail rosters follow `GROUP_ROSTERS` when pinned (e.g. Five Princes
 * by birth); otherwise the same importance sort as the index.
 */

import {
	PROFILES,
	KINGDOMS,
	GROUP_ROSTERS,
	byId,
	nameOf,
	isPlaceholderArt,
	avatarOf,
	sortHwarangMembers,
	type CareerOffice,
	type GodTier,
	type Person
} from '$lib/people';
import { BOND_LABEL, CHART_NODES } from '$lib/relations';
import { chapters, type Block } from '$lib/story';

export type WikiKind =
	| 'character'
	| 'god'
	| 'city'
	| 'place'
	| 'nation'
	| 'phrase'
	| 'concept'
	| 'sword'
	| 'organization'
	| 'group'
	| 'clan'
	| 'relationship'
	| 'other';

export const WIKI_KINDS: {
	id: WikiKind;
	label: string;
	plural: string;
}[] = [
	{ id: 'character', label: 'Character', plural: 'Characters' },
	{ id: 'god', label: 'God', plural: 'Gods' },
	{ id: 'city', label: 'City', plural: 'Cities' },
	{ id: 'place', label: 'Place', plural: 'Places' },
	{ id: 'nation', label: 'Nation', plural: 'Nations' },
	{ id: 'phrase', label: 'Phrase', plural: 'Phrases' },
	{ id: 'organization', label: 'Organization', plural: 'Organizations' },
	{ id: 'group', label: 'Group', plural: 'Groups' },
	{ id: 'clan', label: 'Clan', plural: 'Clans' },
	{ id: 'concept', label: 'Concept', plural: 'Concepts' },
	{ id: 'sword', label: 'Sword', plural: 'Swords' },
	{ id: 'relationship', label: 'Relationship', plural: 'Relationships' },
	{ id: 'other', label: 'Other', plural: 'Other' }
];

export function kindOf(p: Person): WikiKind {
	if (!p.entity) return 'character';
	if (p.entity === 'god') return 'god';
	if (p.entity === 'place') {
		/** Capitals / fortress-cities vs rivers, mountains, caverns, harbours. */
		if (p.placeKind === 'city') return 'city';
		return 'place';
	}
	if (p.entity === 'nation') return 'nation';
	if (p.entity === 'phrase') return 'phrase';
	if (p.entity === 'organization') return 'organization';
	if (p.entity === 'group') return 'group';
	if (p.entity === 'clan') return 'clan';
	if (p.entity === 'concept') return 'concept';
	if (p.entity === 'sword') return 'sword';
	if (p.entity === 'relationship') return 'relationship';
	return 'other';
}

export function kindLabel(p: Person): string {
	const k = kindOf(p);
	if (k === 'relationship' && p.bond) return BOND_LABEL[p.bond];
	return WIKI_KINDS.find((w) => w.id === k)?.label ?? 'Entry';
}

/** Format born/died as a year span, or empty when unknown. Nations/places: founding–fall. */
export function lifespanOf(p: Person): string {
	const f = (n?: number) => (n == null ? '?' : n < 0 ? `${-n} BCE` : `${n}`);
	if (p.born == null && p.died == null) return '';
	return `${p.bornApprox ? 'c. ' : ''}${f(p.born)} – ${f(p.died)}`;
}

export function formatYear(year: number | undefined | null): string {
	if (year == null) return '—';
	return year < 0 ? `${-year} BCE` : String(year);
}

/** Resolved end year: explicit `to`, else death when the post is open-ended. */
function careerEndYear(office: CareerOffice, died?: number): number | undefined {
	return office.to ?? died;
}

/** Year span for a CV row — `668–673`, `654–`, `–649`, or `—`. */
export function careerYearsOf(office: CareerOffice, died?: number): string {
	const from = office.from;
	const to = careerEndYear(office, died);
	if (from == null && to == null) return '—';
	if (from != null && to != null && from === to) return formatYear(from);
	if (from != null && to != null) return `${formatYear(from)}–${formatYear(to)}`;
	if (from != null) return `${formatYear(from)}–`;
	return `–${formatYear(to)}`;
}

/** Age span from `born` + years; null when birth year is unknown. Callers skip this for nations/places. */
export function careerAgesOf(
	office: CareerOffice,
	born?: number,
	died?: number
): string | null {
	if (born == null) return null;
	const fromY = office.from;
	const toY = careerEndYear(office, died);
	const a0 = fromY != null ? fromY - born : null;
	const a1 = toY != null ? toY - born : null;
	if (a0 == null && a1 == null) return null;
	if (a0 != null && a1 != null) return a0 === a1 ? `${a0}` : `${a0}–${a1}`;
	if (a0 != null) return `${a0}–`;
	return `–${a1}`;
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

/** Nation profile id for a kingdom key (when one exists in the corpus). */
const NATION_BY_KINGDOM: Partial<Record<Person['kingdom'], string>> = {
	silla: 'nation-silla',
	baekje: 'nation-baekje',
	goguryeo: 'nation-goguryeo',
	tang: 'nation-tang',
	gaya: 'nation-gaya',
	tamla: 'nation-tamla',
	joseon: 'nation-joseon',
	yamato: 'nation-yamato'
};

/** Nation encyclopedia entry for a kingdom, if present. */
export function nationOf(kingdom: Person['kingdom']): Person | undefined {
	const id = NATION_BY_KINGDOM[kingdom];
	return id ? byId.get(id) : undefined;
}

/**
 * Cosmological place for a person (or a realm kingdom key) — not a political nation.
 * Gods keep `kingdom: 'underworld'` / `'other'` for color / chart clustering;
 * the encyclopedia entry is the place (저승, 서천꽃밭, 이승, 하늘나라).
 */
const REALM_PLACE_BY_KINGDOM: Partial<Record<Person['kingdom'], string>> = {
	underworld: 'underworld'
};

const REALM_PLACE_BY_ID: Record<string, string> = {
	sara: 'western_flower_field',
	saradoryeong: 'western_flower_field',
	sobyeol: 'living_world',
	hwanin: 'heaven'
};

export function realmPlaceOf(who: Person | Person['kingdom']): Person | undefined {
	const id =
		typeof who === 'string'
			? REALM_PLACE_BY_KINGDOM[who]
			: (REALM_PLACE_BY_ID[who.id] ?? REALM_PLACE_BY_KINGDOM[who.kingdom]);
	if (!id) return undefined;
	const place = byId.get(id);
	return place?.entity === 'place' ? place : undefined;
}

/** Political kingdoms shown as wiki filter chips — not `other`, not 저승. */
export function isWikiKingdomChip(kingdom: Person['kingdom']): boolean {
	return kingdom !== 'other' && kingdom !== 'underworld';
}

/** Parent place for a site (`cityId`) — a city, or a realm that contains the site. */
export function parentPlaceOf(p: Person): Person | undefined {
	if (!p.cityId) return undefined;
	const parent = byId.get(p.cityId);
	if (!parent || parent.entity !== 'place') return undefined;
	return parent;
}

/** Parent city profile for a place (`cityId`), when the parent is a fortress-city. */
export function cityOf(p: Person): Person | undefined {
	const parent = parentPlaceOf(p);
	if (!parent || parent.placeKind !== 'city') return undefined;
	return parent;
}

/** Non-city places that list this id as `cityId` (city or containing realm). */
export function placesInCity(cityId: string): Person[] {
	return PROFILES.filter(
		(p) =>
			p.entity === 'place' &&
			p.placeKind !== 'city' &&
			p.cityId === cityId
	).sort(compareWikiEntries);
}

/** Fortress / capital cities belonging to a kingdom. */
export function citiesOfKingdom(kingdom: Person['kingdom']): Person[] {
	return PROFILES.filter(
		(p) => p.entity === 'place' && p.placeKind === 'city' && p.kingdom === kingdom
	).sort(compareWikiEntries);
}

/**
 * Accent hex chips only for Characters (incl. Gods) and Nations / Kingdoms.
 * Places, cities, orgs, clans, phrases, concepts, relationships omit them.
 */
export function showsWikiAccent(p: Person): boolean {
	const k = kindOf(p);
	return k === 'character' || k === 'god' || k === 'nation';
}

export type FamilyLink = { role: string; person: Person };

/**
 * Family rows for the infobox: explicit `family` first; otherwise kin bonds,
 * then love bonds as Spouse.
 */
export function familyOf(p: Person): FamilyLink[] {
	if (p.family?.length) {
		const rows: FamilyLink[] = [];
		const seen = new Set<string>();
		for (const f of p.family) {
			const person = byId.get(f.id);
			if (!person || seen.has(person.id)) continue;
			seen.add(person.id);
			rows.push({ role: f.role, person });
		}
		return rows;
	}

	const seen = new Set<string>();
	const rows: FamilyLink[] = [];
	const push = (role: string, other: Person) => {
		if (other.id === p.id || seen.has(other.id)) return;
		seen.add(other.id);
		rows.push({ role, person: other });
	};

	for (const bond of bondsFor(p.id)) {
		if (bond.bond !== 'kin') continue;
		for (const other of betweenPeople(bond)) {
			push(bond.title ?? 'Kin', other);
		}
	}
	for (const bond of bondsFor(p.id)) {
		if (bond.bond !== 'love') continue;
		for (const other of betweenPeople(bond)) {
			push('Spouse', other);
		}
	}
	return rows;
}

/** First sentence / truncated temperament line for the infobox. */
export function natureSummary(text: string | undefined, max = 140): string {
	if (!text) return '';
	const first = text.split(/(?<=[.!?…])\s+/)[0] ?? text;
	if (first.length <= max) return first;
	return `${first.slice(0, max - 1).trimEnd()}…`;
}

/** Clan encyclopedia entry when `p.clan` is a clan entity id. */
export function clanEntryOf(p: Person): Person | undefined {
	if (!p.clan?.trim()) return undefined;
	const c = byId.get(p.clan.trim());
	return c && c.entity === 'clan' ? c : undefined;
}

/** All clan entity ids on a person (`clan` + `clans`). */
export function clanIdsOf(p: Person): string[] {
	const ids: string[] = [];
	const seen = new Set<string>();
	for (const raw of [p.clan, ...(p.clans ?? [])]) {
		const id = raw?.trim();
		if (!id || seen.has(id)) continue;
		seen.add(id);
		ids.push(id);
	}
	return ids;
}

/** Clan encyclopedia entries for every affiliation. */
export function clanEntriesOf(p: Person): Person[] {
	const rows: Person[] = [];
	for (const id of clanIdsOf(p)) {
		const c = byId.get(id);
		if (c && c.entity === 'clan') rows.push(c);
	}
	return rows;
}

/** Era-primary clan label; modern `korean` gloss in parentheses when set. */
export function clanLabelOf(entry: Person): string {
	const era = nameOf(entry);
	const modern = entry.korean?.trim();
	return modern ? `${era} (${modern})` : era;
}

/**
 * Clan / house line for the infobox. Resolves clan entity ids to a display
 * label; otherwise keeps free text or light surname inference.
 */
export function clanOf(p: Person): string | undefined {
	const entries = clanEntriesOf(p);
	if (entries.length) {
		return entries.map(clanLabelOf).join(' · ');
	}
	if (p.clan?.trim()) return p.clan.trim();
	const hay = [p.name, p.korean, ...(p.aliases ?? [])].filter(Boolean).join(' ');
	if (/\bSatek\b/i.test(hay) || /사택/.test(hay)) return 'Satek (사택)';
	if (/\bGwishil\b/i.test(hay) || /귀실/.test(hay)) return 'Gwishil (귀실)';
	// Buyeo before Yeon: Prince Yun / 부여연 must not infer Goguryeo’s Yeon (淵) clan.
	if (/\bBuyeo\b/i.test(hay) || /부여|扶餘/.test(hay)) return 'Buyeo royal house (부여)';
	if (/\bYeon\b/i.test(hay) || /연개|淵蓋|淵男/.test(hay)) return 'Yeon (연 / 淵)';
	if (/\bKim\b/i.test(hay) || /^김/.test(p.korean ?? '') || /김[가-힣]/.test(hay)) {
		if (p.kingdom === 'silla') return 'Kim (김)';
	}
	return undefined;
}

/** Compact event list for the infobox (full list stays in “more”). */
export function compactEvents(
	events: Person['events'],
	limit = 4
): { shown: NonNullable<Person['events']>; rest: number } {
	if (!events?.length) return { shown: [], rest: 0 };
	if (events.length <= limit) return { shown: events, rest: 0 };
	return { shown: events.slice(0, limit), rest: events.length - limit };
}

export type WikiGenderFilter = 'all' | 'm' | 'f';

export type WikiFilters = {
	kind: WikiKind | 'all';
	kingdom: Person['kingdom'] | 'all';
	/** Era tag slug (`gen-i`, `joseon`, …) or `all`. */
	tag: string | 'all';
	/** Mortal / divine gender chip — characters & gods only; unset gender stays in All. */
	gender: WikiGenderFilter;
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
	/** First wins on collisions (e.g. bare “Yeon” stays Gesomun, not Prince Yun). */
	const aliasToId = new Map<string, string>();
	for (const a of aliases) {
		if (!aliasToId.has(a.alias)) aliasToId.set(a.alias, a.id);
	}

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

/** Lower = more important. Unranked gods/mortals share the last bucket. */
const GOD_TIER_RANK: Record<GodTier | 'unranked', number> = {
	S: 0,
	I: 1,
	II: 2,
	III: 3,
	demigod: 4,
	unranked: 5
};

export function godTierRank(p: Person): number {
	return GOD_TIER_RANK[p.godTier ?? 'unranked'] ?? GOD_TIER_RANK.unranked;
}

export function godTierLabel(tier: GodTier): { short: string; en: string; hint: string } {
	switch (tier) {
		case 'S':
			return { short: 'S', en: 'Class S', hint: 'Creator — Hwanin, above the Three Realms' };
		case 'I':
			return { short: 'I', en: 'Class I', hint: 'Sovereign of one of the Three Realms (삼계)' };
		case 'II':
			return { short: 'II', en: 'Class II', hint: 'Broad domain or office' };
		case 'III':
			return { short: 'III', en: 'Class III', hint: 'Specific function, domain, or territory' };
		case 'demigod':
			return { short: '½', en: 'Demigod', hint: 'Semi-divine founder or heaven-touched' };
	}
}

/** Section headers when the encyclopedia Type filter is Gods. */
export const GOD_TIER_SECTIONS: {
	id: GodTier;
	title: string;
	subtitle: string;
}[] = [
	{ id: 'S', title: 'Tier S', subtitle: 'The Creator · Hwanin' },
	{ id: 'I', title: 'Tier I', subtitle: 'Three Realms' },
	{ id: 'II', title: 'Tier II', subtitle: 'Domains' },
	{ id: 'III', title: 'Tier III', subtitle: 'Particulars' },
	{ id: 'demigod', title: 'Demigods', subtitle: '' }
];

export type GodTierGroup = {
	tier: GodTier | 'unranked';
	title: string;
	subtitle: string;
	items: Person[];
};

/** Bucket gods by `godTier`. Entries stay in existing importance order within each bucket. */
export function groupByGodTier(entries: Person[]): GodTierGroup[] {
	const buckets = new Map<GodTier | 'unranked', Person[]>();
	for (const p of entries) {
		const tier = p.godTier ?? 'unranked';
		const list = buckets.get(tier);
		if (list) list.push(p);
		else buckets.set(tier, [p]);
	}
	const sections: GodTierGroup[] = GOD_TIER_SECTIONS.filter((s) => buckets.has(s.id)).map(
		(s) => ({
			tier: s.id,
			title: s.title,
			subtitle: s.subtitle,
			items: buckets.get(s.id)!
		})
	);
	const unranked = buckets.get('unranked');
	if (unranked?.length) {
		sections.push({ tier: 'unranked', title: 'Unranked', subtitle: '', items: unranked });
	}
	return sections;
}

/**
 * Importance + frequency sort (see file header).
 * Stable enough for the encyclopedia index — not alphabetical.
 */
export function compareWikiEntries(a: Person, b: Person): number {
	const tier = godTierRank(a) - godTierRank(b);
	if (tier) return tier;

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
		// Era is character-only metadata. Never hide gods/orgs/nations/places/etc.
		// for lacking era tags — when an era is selected, filter the character
		// subset and keep every non-character that matches the other filters.
		if (filters.tag !== 'all' && kindOf(p) === 'character') {
			if (!(p.tags ?? []).includes(filters.tag)) return false;
		}
		// Gender applies to mortal characters and gendered gods. Entries without
		// `gender` appear only when the chip is All — never inferred.
		if (filters.gender !== 'all') {
			const k = kindOf(p);
			if (k === 'character' || k === 'god') {
				if (!p.gender || p.gender !== filters.gender) return false;
			}
		}
		if (!q) return true;
		const ownerHay =
			p.entity === 'sword'
				? ownersOf(p.id)
						.flatMap((o) => [o.name, o.korean, o.hanja, ...(o.aliases ?? [])])
						.filter(Boolean)
						.join(' ')
				: '';
		const hay = [
			p.name,
			p.korean,
			p.hanja,
			p.title,
			p.tagline,
			p.clan,
			clanOf(p),
			p.realm?.en,
			p.realm?.ko,
			ownerHay,
			...(p.personality ?? []),
			...p.aliases,
			...(p.sobriquets ?? []),
			...(p.tags ?? [])
		]
			.filter(Boolean)
			.join(' ')
			.toLowerCase();
		return hay.includes(q);
	}).sort(filters.kind === 'clan' ? compareClanEntries : compareWikiEntries);
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
		.map((k) => {
			const items = buckets.get(k)!;
			if (k === 'clan') items.sort(compareClanEntries);
			return { kind: k, items };
		});
}

/** Organization profiles listed on a character (forward links). */
export function orgsOf(p: Person): Person[] {
	if (!p.orgs?.length) return [];
	const rows: Person[] = [];
	const seen = new Set<string>();
	for (const id of p.orgs) {
		const org = byId.get(id);
		if (!org || seen.has(org.id)) continue;
		seen.add(org.id);
		rows.push(org);
	}
	return rows;
}

/** Characters / gods who wield or wielded this sword profile. */
export function ownersOf(swordId: string): Person[] {
	const sword = byId.get(swordId);
	if (!sword?.owners?.length) return [];
	const rows: Person[] = [];
	const seen = new Set<string>();
	for (const id of sword.owners) {
		const person = byId.get(id);
		if (!person || seen.has(person.id)) continue;
		seen.add(person.id);
		rows.push(person);
	}
	return rows;
}

/** Sword encyclopedia entries linked to a person (via `owners`). */
export function swordsOf(personId: string): Person[] {
	return PROFILES.filter(
		(p) => p.entity === 'sword' && (p.owners ?? []).includes(personId)
	).sort(compareWikiEntries);
}

/** Primary sword profile for a character — `sword-{personId}` when present. */
export function swordOfPerson(personId: string): Person | undefined {
	const direct = byId.get(`sword-${personId}`);
	if (direct?.entity === 'sword') return direct;
	const linked = swordsOf(personId);
	return linked[0];
}

/** Characters / gods who list this organization in `orgs`. */
export function membersOf(orgId: string): Person[] {
	const members = PROFILES.filter(
		(p) =>
			(p.entity == null || p.entity === 'god') &&
			(p.orgs ?? []).includes(orgId)
	);
	if (orgId === 'hwarang') return sortHwarangMembers(members);
	return members.sort(compareWikiEntries);
}

/** Group profiles listed on a character (forward links). */
export function groupsOf(p: Person): Person[] {
	if (!p.groups?.length) return [];
	const rows: Person[] = [];
	const seen = new Set<string>();
	for (const id of p.groups) {
		const g = byId.get(id);
		if (!g || seen.has(g.id)) continue;
		seen.add(g.id);
		rows.push(g);
	}
	return rows;
}

/** Characters, gods, and places who list this group in `groups` — the roster. */
export function groupMembersOf(groupId: string): Person[] {
	const members = PROFILES.filter(
		(p) =>
			(p.entity == null || p.entity === 'god' || p.entity === 'place') &&
			(p.groups ?? []).includes(groupId)
	);
	const roster = GROUP_ROSTERS[groupId];
	if (!roster?.length) return members.sort(compareWikiEntries);
	const rank = new Map(roster.map((id, i) => [id, i]));
	return members.sort((a, b) => {
		const ia = rank.get(a.id) ?? Number.POSITIVE_INFINITY;
		const ib = rank.get(b.id) ?? Number.POSITIVE_INFINITY;
		if (ia !== ib) return ia - ib;
		return compareWikiEntries(a, b);
	});
}

export type ClanAffiliation = 'blood' | 'marriage';

/** Blood vs marriage for a person in a given clan (see `clanBy` overrides). */
export function clanAffiliationOf(p: Person, clanId: string): ClanAffiliation {
	if (p.clanBy?.[clanId]) return p.clanBy[clanId]!;
	if (p.clan?.trim() === clanId) return 'blood';
	return 'marriage';
}

/** Youngest → oldest within a clan roster; missing birth years last. */
export function compareClanMembers(a: Person, b: Person): number {
	const bornA = a.born ?? Number.NEGATIVE_INFINITY;
	const bornB = b.born ?? Number.NEGATIVE_INFINITY;
	if (bornB !== bornA) return bornB - bornA;
	return nameOf(a).localeCompare(nameOf(b));
}

/** Clan index cards — most members first, then importance. */
export function compareClanEntries(a: Person, b: Person): number {
	const count = clanMembersOf(b.id).length - clanMembersOf(a.id).length;
	if (count) return count;
	return compareWikiEntries(a, b);
}

/** Most important member — spotlight portrait on clan cards. */
export function clanSpotlightOf(clanId: string): Person | undefined {
	const members = PROFILES.filter(
		(p) => (p.entity == null || p.entity === 'god') && clanIdsOf(p).includes(clanId)
	);
	if (!members.length) return undefined;
	return [...members].sort(compareWikiEntries)[0];
}

/** Characters / gods who list this clan entity id in `clan` / `clans`. */
export function clanMembersOf(clanId: string): Person[] {
	return PROFILES.filter(
		(p) => (p.entity == null || p.entity === 'god') && clanIdsOf(p).includes(clanId)
	).sort(compareClanMembers);
}

/** Filter chips — political kingdoms only (`other` and 저승 are not nations). */
export const WIKI_KINGDOMS = (
	Object.keys(KINGDOMS) as Person['kingdom'][]
).filter(isWikiKingdomChip);

export const WIKI_TOTAL = PROFILES.length;
