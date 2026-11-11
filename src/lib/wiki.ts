/**
 * Wiki corpus helpers — the encyclopedia reads PROFILES directly.
 * No parallel CMS; categories are derived from `Person.entity`.
 *
 * ## Entry sort order
 * Within a filtered list (and within each kind / god-tier group), entries are ordered by:
 * 1. **God tier** — S → I → II → III → IV → demigod → unranked
 * 2. **Relevance score** (`relevanceScore`) — how much the chronicle itself uses the name:
 *    story appearances, `main`, chart rank, portrait, plus an optional `weight` nudge.
 *    Myth furniture the story never visits (the ten hells, the western rivers) carries a
 *    large negative `weight` and sinks to the bottom.
 * 3. **Name** — `nameOf` localeCompare as final tie-break
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
	photoOf,
	stillsArtOf,
	colorOf,
	sortHwarangMembers,
	isMonarch,
	titleOf,
	regnalOf,
	type CareerOffice,
	type GodTier,
	type Person,
	type TieKind
} from '$lib/people';
import confirmedPortraits from '$lib/data/confirmed-portraits.json';
import { CHART_NODES, TIE_META, tieOf, tieStages } from '$lib/relations';
import { flowerKindOf } from '$lib/flowers';
import { hasTerm } from '$lib/romanFold';
import { peopleOfSlot } from '$lib/imagePeople';
import { chapters, type Block } from '$lib/story';
import {
	POLITIES_OF,
	CIVILIZATION_IDS,
	FAMOUS_OF,
	LAND_RINGS,
	type CivilizationId,
	type Famous
} from '$lib/civilizations';
import { widgetPeople, widgetTexts } from '$lib/widgets';

export type WikiKind =
	| 'character'
	| 'god'
	| 'city'
	| 'place'
	| 'room'
	| 'people'
	| 'nation'
	| 'concept'
	| 'object'
	| 'animal'
	| 'flower'
	| 'organization'
	| 'group'
	| 'clan'
	| 'relationship'
	| 'other';

/** Sword / instrument / clothing under the Objects shelf. */
export type ObjectKind = 'sword' | 'instrument' | 'clothing';

export const WIKI_KINDS: {
	id: WikiKind;
	label: string;
	plural: string;
}[] = [
	{ id: 'character', label: 'Character', plural: 'Characters' },
	{ id: 'god', label: 'God', plural: 'Gods' },
	{ id: 'animal', label: 'Animal', plural: 'Animals' },
	{ id: 'flower', label: 'Flower', plural: 'Flowers' },
	{ id: 'city', label: 'City', plural: 'Cities' },
	{ id: 'place', label: 'Place', plural: 'Places' },
	{ id: 'room', label: 'Room', plural: 'Rooms' },
	{ id: 'people', label: 'Civilization', plural: 'Ten Peoples' },
	{ id: 'nation', label: 'Nation', plural: 'Nations' },
	{ id: 'organization', label: 'Organization', plural: 'Organizations' },
	{ id: 'group', label: 'Group', plural: 'Groups' },
	{ id: 'clan', label: 'Clan', plural: 'Clans' },
	{ id: 'concept', label: 'Concept', plural: 'Concepts' },
	{ id: 'object', label: 'Object', plural: 'Objects' },
	{ id: 'relationship', label: 'Relationship', plural: 'Relationships' },
	{ id: 'other', label: 'Other', plural: 'Other' }
];

/** Legacy top-level kinds folded under Objects — old URLs still resolve. */
const LEGACY_OBJECT_KINDS = new Set(['sword', 'instrument', 'clothing']);

export function isLegacyObjectKind(k: string): k is ObjectKind {
	return LEGACY_OBJECT_KINDS.has(k);
}

export function kindOf(p: Person): WikiKind {
	if (!p.entity) return 'character';
	if (p.entity === 'god') return 'god';
	if (p.entity === 'place') {
		/** Capitals / fortress-cities vs interiors vs rivers, mountains, caverns, harbours. */
		if (p.placeKind === 'city') return 'city';
		if (p.placeKind === 'room') return 'room';
		return 'place';
	}
	/** The ten civilizations share `entity: 'nation'` with the kingdoms but list apart from them. */
	if (p.entity === 'nation') return isCivilization(p.id) ? 'people' : 'nation';
	if (p.entity === 'organization') return 'organization';
	if (p.entity === 'group') return 'group';
	if (p.entity === 'clan') return 'clan';
	if (p.entity === 'concept') return 'concept';
	if (p.entity === 'sword' || p.entity === 'instrument' || p.entity === 'clothing') return 'object';
	if (p.entity === 'animal') return 'animal';
	if (p.entity === 'flower') return 'flower';
	if (p.entity === 'relationship') return 'relationship';
	return 'other';
}

/** Which Objects shelf a profile sits on — null outside swords / instruments / clothing. */
export function objectKindOf(p: Person): ObjectKind | null {
	if (p.entity === 'sword' || p.entity === 'instrument' || p.entity === 'clothing') return p.entity;
	return null;
}

/** Secondary chip under a category — only some kinds publish a row. */
export type WikiSubSpec = { id: string; en: string; ko: string; icon?: string };

const GENERAL_RE =
	/\b(General|Marshal|Commander|Admiral|Guardian|대장군|장군|대막리지|막리지|도독|병마|원수|총관)\b/i;
const MONK_RE = /\b(Monk|Abbot|Priest|Nun|법사|승려|화상|대사|스님|比丘|沙門|沙弥)\b/i;
const NOBLE_RE =
	/\b(Prince|Princess|Lord|Lady|Duke|Marquis|Count|Queen Consort|King Consort|Empress Dowager|Galmunwang|True Bone|Sacred Bone|진골|성골|대감|왕자|공주|태자)\b/i;

export type CharacterRole = 'monarch' | 'general' | 'noble' | 'monk' | 'other';

/**
 * Later / side crowns that sit on the Characters → Other shelf (Wang Gun, Gung Ye,
 * Kyun Hwon, Dae Joyoung, Choi Ri, Song Yang…), not among the Samhan king-lists.
 */
const SIDE_MONARCH = new Set([
	'wanggun',
	'songyang',
	'kyunhwon',
	'gungye',
	'daejoyoung',
	'choiri'
]);

/** Mortal characters, plus demigod founders who wear a crown (Hyukgosé, Jumong, Dangun). */
export function onCharacterShelf(p: Person): boolean {
	const k = kindOf(p);
	return k === 'character' || (k === 'god' && p.godTier === 'demigod');
}

/** Role bucket for the Characters sub-chips. */
export function characterRoleOf(p: Person): CharacterRole {
	if (!onCharacterShelf(p)) return 'other';
	if (SIDE_MONARCH.has(p.id)) return 'other';
	if (isMonarch(p)) return 'monarch';
	const hay = [titleOf(p), p.tagline, ...(p.career ?? []).map((c) => c.title)]
		.filter(Boolean)
		.join(' ');
	if (GENERAL_RE.test(hay)) return 'general';
	if (MONK_RE.test(hay)) return 'monk';
	if (NOBLE_RE.test(hay)) return 'noble';
	return 'other';
}

export function conceptKindOf(p: Person): 'idiom' | 'idea' {
	if (p.conceptKind === 'idiom' || p.id.startsWith('phrase-')) return 'idiom';
	return 'idea';
}

/** Sub-filter chips that only appear for certain categories. */
export const WIKI_SUBS: Partial<Record<WikiKind, readonly WikiSubSpec[]>> = {
	character: [
		{ id: 'monarch', en: 'Monarchs', ko: '군주', icon: 'crown' },
		{ id: 'general', en: 'Generals', ko: '장군', icon: 'swords' },
		{ id: 'noble', en: 'Nobles', ko: '귀족', icon: 'diamond' },
		{ id: 'monk', en: 'Monks', ko: '승려', icon: 'self_improvement' },
		{ id: 'other', en: 'Others', ko: '그 밖', icon: 'person' }
	],
	god: [
		{ id: 'S', en: 'Tier S', ko: 'S', icon: 'star' },
		{ id: 'I', en: 'Tier I', ko: 'I', icon: 'star' },
		{ id: 'II', en: 'Tier II', ko: 'II', icon: 'star' },
		{ id: 'III', en: 'Tier III', ko: 'III', icon: 'star' },
		{ id: 'IV', en: 'Tier IV', ko: 'IV', icon: 'star' },
		{ id: 'demigod', en: 'Demigods', ko: '반신', icon: 'brightness_alert' }
	],
	people: [
		{ id: 'near', en: 'Near Lands', ko: '옆나라', icon: 'near_me' },
		{ id: 'far', en: 'Far Lands', ko: '먼나라', icon: 'travel_explore' }
	],
	concept: [
		{ id: 'idiom', en: 'Idioms', ko: '관용구', icon: 'format_quote' },
		{ id: 'idea', en: 'Ideas', ko: '제도·사상', icon: 'lightbulb' }
	],
	place: [
		{ id: 'mountain', en: 'Mountains', ko: '산', icon: 'landscape' },
		{ id: 'river', en: 'Rivers', ko: '강', icon: 'water' },
		{ id: 'cave', en: 'Caves', ko: '동굴', icon: 'hiking' },
		{ id: 'harbor', en: 'Harbours', ko: '항구', icon: 'sailing' },
		{ id: 'other', en: 'Other', ko: '그 밖', icon: 'place' }
	],
	nation: [
		{ id: 'near', en: 'Near Lands', ko: '옆나라', icon: 'near_me' },
		{ id: 'far', en: 'Far Lands', ko: '먼나라', icon: 'travel_explore' },
		{ id: 'other', en: 'Other', ko: '그 밖', icon: 'flag' }
	],
	object: [
		{ id: 'sword', en: 'Swords', ko: '칼', icon: 'swords' },
		{ id: 'instrument', en: 'Instruments', ko: '악기', icon: 'music_note' },
		{ id: 'clothing', en: 'Clothing', ko: '옷과 관', icon: 'checkroom' }
	],
	flower: [
		{ id: 'revive', en: 'Resurrection', ko: '환생', icon: 'spa' },
		{ id: 'curse', en: 'Curse blooms', ko: '주화', icon: 'local_fire_department' },
		{ id: 'life', en: 'Life', ko: '생명', icon: 'favorite' }
	],
	relationship: [
		{ id: 'romance', en: 'Romance', ko: '연인', icon: 'favorite' },
		{ id: 'spouse', en: 'Married', ko: '부부', icon: 'join_inner' },
		{ id: 'friend', en: 'Friends', ko: '벗', icon: 'handshake' },
		{ id: 'ally', en: 'Allies', ko: '동지', icon: 'shield' },
		{ id: 'mentor', en: 'Mentor', ko: '스승과 제자', icon: 'menu_book' },
		{ id: 'rival', en: 'Rivals', ko: '라이벌', icon: 'swords' },
		{ id: 'enemy', en: 'Enemies', ko: '원수', icon: 'skull' },
		{ id: 'liege', en: 'Lord & Servant', ko: '주군과 신하', icon: 'crown' },
		{ id: 'parent', en: 'Parent & Child', ko: '부모와 자식', icon: 'family_restroom' },
		{ id: 'sibling', en: 'Siblings', ko: '형제자매', icon: 'group' },
		{ id: 'family', en: 'Family', ko: '가족', icon: 'home' }
	]
};

export function wikiSubsOf(kind: WikiKind | 'all'): readonly WikiSubSpec[] {
	if (kind === 'all') return [];
	return WIKI_SUBS[kind] ?? [];
}

const NEAR_IDS = new Set<string>(LAND_RINGS.near.ids);
const FAR_IDS = new Set<string>(LAND_RINGS.far.ids);
const NEAR_POLITIES = new Set(LAND_RINGS.near.ids.flatMap((id) => [...(POLITIES_OF[id] ?? [])]));
const FAR_POLITIES = new Set(LAND_RINGS.far.ids.flatMap((id) => [...(POLITIES_OF[id] ?? [])]));

/** Whether a profile matches the active category sub-chip. */
export function matchesWikiSub(p: Person, kind: WikiKind | 'all', sub: string | 'all'): boolean {
	if (sub === 'all' || kind === 'all') return true;
	switch (kind) {
		case 'character':
			return characterRoleOf(p) === sub;
		case 'god':
			return (p.godTier ?? 'unranked') === sub;
		case 'people':
			if (sub === 'near') return NEAR_IDS.has(p.id);
			if (sub === 'far') return FAR_IDS.has(p.id);
			return true;
		case 'concept':
			return conceptKindOf(p) === sub;
		case 'place': {
			const pk = p.placeKind ?? 'other';
			if (sub === 'other') return !['mountain', 'river', 'cave', 'harbor'].includes(pk);
			return pk === sub;
		}
		case 'nation':
			if (sub === 'near') return NEAR_POLITIES.has(p.id) || NEAR_IDS.has(p.id);
			if (sub === 'far') return FAR_POLITIES.has(p.id) || FAR_IDS.has(p.id);
			if (sub === 'other') {
				return !NEAR_POLITIES.has(p.id) && !FAR_POLITIES.has(p.id) && !NEAR_IDS.has(p.id) && !FAR_IDS.has(p.id);
			}
			return true;
		case 'object':
			return objectKindOf(p) === sub;
		case 'flower':
			return flowerKindOf(p) === sub;
		case 'relationship':
			return tieStages(p).some((stage) => stage.includes(sub as TieKind));
		default:
			return true;
	}
}

export function wikiSubCount(kind: WikiKind | 'all', sub: string | 'all'): number {
	if (kind === 'all') return PROFILES.length;
	const pool = PROFILES.filter((p) =>
		kind === 'character' ? onCharacterShelf(p) : kindOf(p) === kind
	);
	if (sub === 'all') return pool.length;
	return pool.filter((p) => matchesWikiSub(p, kind, sub)).length;
}

export function kindLabel(p: Person): string {
	const k = kindOf(p);
	if (k === 'relationship') return TIE_META[tieOf(p)].label;
	return WIKI_KINDS.find((w) => w.id === k)?.label ?? 'Entry';
}

export interface LifespanPart {
	text: string;
	/** The story's own year, not the record's. */
	invented: boolean;
}

/** Born/died as two labelled halves, so invented years can be styled apart. Null when both are unknown. */
export function lifespanParts(p: Person): { approx: boolean; born: LifespanPart; died: LifespanPart } | null {
	if (p.born == null && p.died == null) return null;
	const f = (n?: number) => (n == null ? '?' : n < 0 ? `${-n} BCE` : `${n}`);
	return {
		approx: !!p.bornApprox,
		born: { text: f(p.born), invented: p.born != null && !!p.bornInvented },
		died: { text: f(p.died), invented: p.died != null && !!p.diedInvented }
	};
}

/** Format born/died as a year span, or empty when unknown. Nations/places: founding–fall. */
export function lifespanOf(p: Person): string {
	const parts = lifespanParts(p);
	if (!parts) return '';
	return `${parts.approx ? 'c. ' : ''}${parts.born.text} – ${parts.died.text}`;
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

/** Place ids locked on a relationship (`placeId` may be one or many). */
export function placeIdsOf(p: Person): string[] {
	if (p.placeId == null) return [];
	return Array.isArray(p.placeId) ? p.placeId : [p.placeId];
}

/** Place profiles a relationship is locked to. */
export function bondPlacesOf(p: Person): Person[] {
	return placeIdsOf(p)
		.map((id) => byId.get(id))
		.filter((x): x is Person => !!x && x.entity === 'place');
}

/** Relationships whose locked place is this id. */
export function bondsAtPlace(placeId: string): Person[] {
	return PROFILES.filter((p) => p.entity === 'relationship' && placeIdsOf(p).includes(placeId));
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
	buyeo: 'nation-buyeo',
	jolbon: 'nation-jolbon',
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

/** One of the ten human nations (a civilization, not a dynasty’s borders). */
export function isCivilization(id: string): boolean {
	return (CIVILIZATION_IDS as readonly string[]).includes(id);
}

/** A civilization's famous people, each with its wiki profile when the chronicle has one. */
export function famousOf(id: string): { famous: Famous; person?: Person }[] {
	if (!isCivilization(id)) return [];
	return FAMOUS_OF[id as CivilizationId].map((famous) => ({
		famous,
		person: famous.id ? byId.get(famous.id) : undefined
	}));
}

/**
 * Cover art for a Ten Peoples card / detail hero: `photo`, else the first
 * installed `/civ/` still, else any still. Kingdoms keep using flags instead.
 */
export function civilizationCoverOf(p: Person): string | undefined {
	if (!isCivilization(p.id)) return undefined;
	const photo = photoOf(p);
	if (photo) return photo;
	const stills = stillsArtOf(p);
	const civ = stills.find((src) => /\/civ\//.test(src));
	return civ ?? stills[0];
}

/** Linked famous faces for a civilization index card (up to four). */
export function famousFacesOf(id: string): Person[] {
	const out: Person[] = [];
	for (const { person } of famousOf(id)) {
		if (!person) continue;
		out.push(person);
		if (out.length >= 4) break;
	}
	return out;
}

/** Polity pages that sit inside a civilization, in reading order. */
export function politiesOf(id: string): Person[] {
	const order = POLITIES_OF[id] ?? [];
	const out: Person[] = [];
	for (const pid of order) {
		const p = byId.get(pid);
		if (p) out.push(p);
	}
	return out;
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
	wongang: 'living_world',
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

/** Political kingdoms shown as wiki filter chips — not 저승. */
export function isWikiKingdomChip(kingdom: Person['kingdom']): boolean {
	return kingdom !== 'underworld' && kingdom !== 'other';
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

/** Non-city, non-room places that list this id as `cityId` (city or containing realm). */
export function placesInCity(cityId: string): Person[] {
	return PROFILES.filter(
		(p) =>
			p.entity === 'place' &&
			p.placeKind !== 'city' &&
			p.placeKind !== 'room' &&
			p.cityId === cityId
	).sort(compareWikiEntries);
}

/** Interiors (`placeKind: 'room'`) nested under a city. */
export function roomsInCity(cityId: string): Person[] {
	return PROFILES.filter(
		(p) => p.entity === 'place' && p.placeKind === 'room' && p.cityId === cityId
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
 * Places, cities, orgs, clans, concepts, relationships omit them.
 */
export function showsWikiAccent(p: Person): boolean {
	const k = kindOf(p);
	return k === 'character' || k === 'god' || k === 'nation' || k === 'people';
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

/** Key events in year order; an undated beat keeps the slot it was written in. */
export function chronological(events: Person['events']): NonNullable<Person['events']> {
	if (!events?.length) return [];
	const dated = events.filter((e) => e.year != null).sort((a, b) => a.year! - b.year!);
	let next = 0;
	return events.map((e) => (e.year == null ? e : dated[next++]));
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

/** Wiki portrait / board — painted `ch_*` / `pl_*` / org art, not the gendered stand-in. */
export type WikiArtFilter = 'all' | 'confirmed' | 'missing';

export type WikiFilters = {
	kind: WikiKind | 'all';
	/**
	 * Category sub-chip (`monarch`, `near`, `idiom`, …) or `all`.
	 * Only some kinds publish subs — see `wikiSubsOf`.
	 */
	sub: string | 'all';
	kingdom: Person['kingdom'] | 'all';
	/** Era tag slug (`gen-i`, `joseon`, …) or `all`. */
	tag: string | 'all';
	/**
	 * Chronicle episode `title` from `story.json` / `$lib/story` chapters, or `all`.
	 * Character-only: when set, keeps people who appear in that entry.
	 */
	story: string | 'all';
	/** Mortal / divine gender chip — characters & gods only; unset gender stays in All. */
	gender: WikiGenderFilter;
	/**
	 * `missing` hides entries that already have a painted portrait.
	 * `confirmed` keeps only cutout portraits (transparent PNG). Painted
	 * backgrounds, such as Jachungbi, stay out.
	 */
	art: WikiArtFilter;
	q: string;
};

const CHART_RANK = new Map(CHART_NODES.map((n) => [n.id, n.rank as number]));

/** Escape for RegExp from alias strings. */
function escapeRe(s: string) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Every profile alias as one longest-first regex, so “Kim Yushin” wins over
 * “Yushin”. First wins on collisions (bare “Yeon” stays Gesomun, not Prince Yun).
 */
function buildAliasIndex(): { re: RegExp | null; aliasToId: Map<string, string> } {
	const aliases = PROFILES.flatMap((p) =>
		p.aliases.filter((a) => a.trim().length >= 2).map((alias) => ({ alias, id: p.id }))
	).sort((a, b) => b.alias.length - a.alias.length);
	const aliasToId = new Map<string, string>();
	for (const a of aliases) {
		if (!aliasToId.has(a.alias)) aliasToId.set(a.alias, a.id);
	}
	const re =
		aliases.length === 0
			? null
			: new RegExp(`\\b(${aliases.map((a) => escapeRe(a.alias)).join('|')})\\b`, 'g');
	return { re, aliasToId };
}

const ALIAS_INDEX = buildAliasIndex();

/** Each profile named in `text`, once, in reading order: `{ id, index, alias }`. */
function aliasHits(text: string): { id: string; index: number; alias: string }[] {
	const { re, aliasToId } = ALIAS_INDEX;
	if (!text || !re) return [];
	const seen = new Set<string>();
	const hits: { id: string; index: number; alias: string }[] = [];
	re.lastIndex = 0;
	let m: RegExpExecArray | null;
	while ((m = re.exec(text)) !== null) {
		const id = aliasToId.get(m[1]);
		if (!id || seen.has(id)) continue;
		seen.add(id);
		hits.push({ id, index: m.index, alias: m[1] });
	}
	return hits;
}

/** A run of prose; `id` marks a wiki link to that profile. */
export type WikiSegment = { text: string; id?: string };

/**
 * Wikipedia-style inline links: the first mention of each other profile in
 * `text` becomes a link segment. `selfId` (the page being read) never links.
 */
export function linkSegments(text: string, selfId?: string): WikiSegment[] {
	const segments: WikiSegment[] = [];
	let at = 0;
	for (const hit of aliasHits(text)) {
		if (hit.id === selfId) continue;
		if (hit.index > at) segments.push({ text: text.slice(at, hit.index) });
		segments.push({ text: hit.alias, id: hit.id });
		at = hit.index + hit.alias.length;
	}
	if (at < text.length) segments.push({ text: text.slice(at) });
	return segments;
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

	function countText(text: string | undefined | null) {
		if (!text) return;
		for (const hit of aliasHits(text)) bump(hit.id);
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
			} else {
				const t = widgetTexts(b);
				for (const s of [...(t?.ko ?? []), ...(t?.en ?? [])]) countText(s);
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

/**
 * How much the chronicle itself cares about this entry.
 * Story appearances dominate; `main` and chart rank follow; a real portrait is a
 * small bump. `Person.weight` is a manual nudge — the ten hells and the mythical
 * western rivers use a large negative so they sort under every spoken name.
 */
export function relevanceScore(p: Person): number {
	let score = appearanceCount(p.id) * 100;
	if (p.main) score += 10_000;
	score += chartRankOf(p) * 50;
	if (hasRealAvatar(p)) score += 5;
	if (typeof p.weight === 'number') score += p.weight;
	return score;
}

/** Stock chorus voices — speak often, not anyone's story. Same set as `entryCast`. */
const STORY_STOCK = new Set(['courtmaid', 'herald', 'haenyeo', 'narrator', 'messenger']);

/**
 * Entry title → person ids who appear in that episode (speakers, PersonCards,
 * still `people`, explicit `cast`, and alias hits in prose). Built once at
 * module load in chronicle reading order.
 */
function buildStoryCastIndex(): Map<string, Set<string>> {
	const index = new Map<string, Set<string>>();

	const add = (set: Set<string>, id: string | undefined | null) => {
		if (!id || !byId.has(id) || STORY_STOCK.has(id)) return;
		set.add(id);
	};

	function countText(text: string | undefined | null, set: Set<string>) {
		if (!text) return;
		for (const hit of aliasHits(text)) add(set, hit.id);
	}

	function walkBlocks(blocks: Block[], set: Set<string>) {
		for (const b of blocks) {
			if (b.kind === 'dialogue' || b.kind === 'monologue') {
				if (b.person) add(set, b.person);
			}
			for (const id of widgetPeople(b)) add(set, id);
			if (b.kind === 'dialogue') {
				for (const line of b.lines ?? []) countText(line, set);
				for (const line of b.en ?? []) countText(line, set);
			} else if (b.kind === 'p' || b.kind === 'cite' || b.kind === 'quote' || b.kind === 'moral') {
				countText(b.html, set);
				countText(b.ko, set);
			} else if (b.kind === 'monologue') {
				countText(b.html, set);
				countText(b.ko, set);
			} else if (b.kind === 'hanja') {
				countText(b.after, set);
			} else if (b.kind === 'flashback') {
				countText(b.title, set);
				walkBlocks(b.blocks, set);
			} else {
				const t = widgetTexts(b);
				for (const s of [...(t?.ko ?? []), ...(t?.en ?? [])]) countText(s, set);
			}
		}
	}

	for (const ch of chapters) {
		for (const entry of ch.entries) {
			const set = new Set<string>();
			for (const id of entry.cast ?? []) add(set, id);
			walkBlocks(entry.blocks, set);
			for (const slot of entry.images ?? []) {
				for (const id of peopleOfSlot(slot.id, slot.people)) add(set, id);
			}
			if (set.size) index.set(entry.title, set);
		}
	}

	return index;
}

const STORY_CAST = buildStoryCastIndex();
const EMPTY_STORY_CAST: ReadonlySet<string> = new Set();

/** Person ids who appear in the named episode, or empty when unknown. */
export function storyCastOf(title: string): ReadonlySet<string> {
	return STORY_CAST.get(title) ?? EMPTY_STORY_CAST;
}

export type StoryFilterOption = { id: string; label: string; count: number };

/** Episodes with at least one character, in chronicle reading order. */
export const STORY_FILTER_OPTIONS: StoryFilterOption[] = (() => {
	const opts: StoryFilterOption[] = [];
	for (const ch of chapters) {
		for (const entry of ch.entries) {
			const set = STORY_CAST.get(entry.title);
			if (!set?.size) continue;
			let count = 0;
			for (const id of set) {
				const p = byId.get(id);
				if (p && kindOf(p) === 'character') count++;
			}
			if (!count) continue;
			opts.push({ id: entry.title, label: entry.title, count });
		}
	}
	return opts;
})();

export function storyFilterOptions(): StoryFilterOption[] {
	return STORY_FILTER_OPTIONS;
}

function chartRankOf(p: Person): number {
	return CHART_RANK.get(p.id) ?? 0;
}

export function hasRealAvatar(p: Person): boolean {
	const art = avatarOf(p);
	return !!art && !isPlaceholderArt(art);
}

const CONFIRMED_PORTRAITS = new Set(confirmedPortraits);

/** A cutout on a clear ground. Opaque plates and photographs are not confirmed. */
export function hasConfirmedAvatar(p: Person): boolean {
	const art = avatarOf(p);
	if (!art || isPlaceholderArt(art)) return false;
	const path = art.split('?')[0] ?? art;
	return CONFIRMED_PORTRAITS.has(path);
}

/** Lower = more important. Unranked gods/mortals share the last bucket. */
const GOD_TIER_RANK: Record<GodTier | 'unranked', number> = {
	S: 0,
	I: 1,
	II: 2,
	III: 3,
	IV: 4,
	demigod: 5,
	unranked: 6
};

export function godTierRank(p: Person): number {
	return GOD_TIER_RANK[p.godTier ?? 'unranked'] ?? GOD_TIER_RANK.unranked;
}

export function godTierLabel(tier: GodTier): { short: string; en: string; hint: string } {
	switch (tier) {
		case 'S':
			return { short: 'S', en: 'Class S', hint: 'Creator — Hannim, above the Three Realms' };
		case 'I':
			return { short: 'I', en: 'Class I · Lords', hint: 'Sovereign of one of the Three Realms (삼계)' };
		case 'II':
			return { short: 'II', en: 'Class II · Domains', hint: 'Broad domain under a realm lord' };
		case 'III':
			return { short: 'III', en: 'Class III · Roles', hint: 'Office or function — reaper, gate, moon…' };
		case 'IV':
			return { short: 'IV', en: 'Class IV · Particulars', hint: 'God of a specific place or shrine' };
		case 'demigod':
			return { short: '½', en: 'Demigod', hint: 'Semi-divine founder or heaven-touched' };
	}
}

/** Three Realms card border — life red, death blue, western heavens green. */
export type PantheonSide = 'life' | 'death' | 'flower' | 'heaven' | 'all';

export const PANTHEON_SIDE_COLORS: Record<Exclude<PantheonSide, 'all'>, string> = {
	life: '#C94040',
	death: '#3B6FBF',
	flower: '#2F9B6A',
	heaven: '#E8C873'
};

/** Explicit affiliation; everyone else falls back from kingdom / realm text. */
const PANTHEON_SIDE_OF: Record<string, PantheonSide> = {
	hwanin: 'heaven',
	hwanung: 'heaven',
	heavenearthking: 'all',
	sobyeol: 'life',
	haemosu: 'life',
	ibiga: 'life',
	samsin: 'life',
	yuhwa: 'life',
	rabbitking: 'life',
	dragonking: 'life',
	daebyeol: 'death',
	yumla: 'death',
	bari: 'death',
	yongnyeo: 'death',
	kangrim: 'death',
	haewonmek: 'death',
	sara: 'flower',
	saradoryeong: 'flower',
	mujangsung: 'flower'
};

/** Which Three Realms court a god belongs to (for wiki card borders). */
export function pantheonSideOf(p: Person): PantheonSide | null {
	if (p.entity !== 'god' && p.godTier !== 'demigod') return null;
	const pinned = PANTHEON_SIDE_OF[p.id];
	if (pinned) return pinned;
	if (p.kingdom === 'underworld') return 'death';
	const hay = `${p.realm?.en ?? ''} ${p.realm?.ko ?? ''} ${p.title ?? ''}`.toLowerCase();
	if (/서천|flower|western heaven|west field|gate guardian/.test(hay)) return 'flower';
	if (/저승|dead|death|underworld|reaper|judge|hell|시왕/.test(hay)) return 'death';
	if (/이승|living|life|sun|sky|birth|moon|태양|하늘|생명/.test(hay)) return 'life';
	if (/하늘나라|heaven|creator|mandate/.test(hay)) return 'heaven';
	return null;
}

export function pantheonBorderColor(side: PantheonSide | null): string | undefined {
	if (!side || side === 'all') return undefined;
	return PANTHEON_SIDE_COLORS[side];
}

/**
 * Corner mark for gods, shaped by class:
 * - Tier I / S → short Korean charge (서천 · 이승 · 저승)
 * - Tier II → one hanja (日 · 天 · 生 · 子 · 冥 …)
 * - Tier III / demigod → Material icon (mountain, river, …)
 */
export type DomainMarkKind = 'text' | 'hanja' | 'icon';
export type DomainMark = {
	kind: DomainMarkKind;
	/** What the corner shows: `서천`, `日`, or a Material Symbols name. */
	show: string;
	/** @deprecated use `show` — kept so older call sites that read `.glyph` still work. */
	glyph: string;
	en: string;
	ko: string;
	color: string;
};

/** Class I / S — the office name in Korean, short enough for a chip. */
const DOMAIN_TEXT: Record<string, string> = {
	hwanin: '하늘',
	heavenearthking: '천지',
	daebyeol: '저승',
	sobyeol: '이승',
	sara: '서천',
	saradoryeong: '서천'
};

/** Class II — one hanja. */
const DOMAIN_HANJA: Record<string, string> = {
	haemosu: '日',
	ibiga: '天',
	samsin: '生',
	hwanung: '子',
	yumla: '冥',
	bari: '導',
	yongnyeo: '死',
	yuhwa: '月'
};

/** Class III / demigod — Material Symbols outlined name. */
const DOMAIN_ICON: { test: RegExp; icon: string }[] = [
	{ test: /steam|cavern|증기|cave/i, icon: 'water_drop' },
	{ test: /river|강|amnok|압록/i, icon: 'water' },
	{ test: /sea|동해|harbour/i, icon: 'waves' },
	{ test: /mountain|산|ridge/i, icon: 'terrain' },
	{ test: /hunt|사냥/i, icon: 'pets' },
	{ test: /grain|오곡|farm|songdang|송당/i, icon: 'grass' },
	{ test: /fortune|운/i, icon: 'auto_awesome' },
	{ test: /island|탐라|tamla/i, icon: 'landscape' },
	{ test: /sandalwood|신단|bear|joseon|jolbon/i, icon: 'forest' },
	{ test: /match|도령|sky-born/i, icon: 'favorite' },
	{ test: /reaper|저승길/i, icon: 'dark_mode' },
	{ test: /moon|달/i, icon: 'dark_mode' },
	{ test: /founding|졸본|jolbon/i, icon: 'fort' }
];

/** Domain seal for a god’s wiki / card corner. Mortals without a divine class return null. */
export function domainMarkOf(p: Person): DomainMark | null {
	if (p.entity !== 'god' && p.godTier !== 'demigod') return null;
	const realm = p.realm ?? { en: p.title ?? 'Domain', ko: '' };
	const color = colorOf(p);
	const tier = p.godTier ?? 'unranked';

	if (tier === 'I' || tier === 'S') {
		const fromRealm = realm.ko.split(/[·・]/)[0]?.trim() || realm.en;
		const show = DOMAIN_TEXT[p.id] ?? fromRealm;
		return { kind: 'text', show, glyph: show, en: realm.en, ko: realm.ko, color };
	}

	if (tier === 'II') {
		const show =
			DOMAIN_HANJA[p.id] ??
			(/sun|태양/i.test(`${realm.en}${realm.ko}`)
				? '日'
				: /sky|하늘/i.test(`${realm.en}${realm.ko}`)
					? '天'
					: /life|birth|생명|출산/i.test(`${realm.en}${realm.ko}`)
						? '生'
						: /moon|달/i.test(`${realm.en}${realm.ko}`)
							? '月'
							: /dead|저승|judgment|시왕|hell/i.test(`${realm.en}${realm.ko}`)
								? '冥'
								: '神');
		return { kind: 'hanja', show, glyph: show, en: realm.en, ko: realm.ko, color };
	}

	const hay = `${realm.en} ${realm.ko} ${p.id}`;
	const icon = DOMAIN_ICON.find((row) => row.test.test(hay))?.icon ?? 'temple_buddhist';
	return { kind: 'icon', show: icon, glyph: icon, en: realm.en, ko: realm.ko, color };
}

/** Section headers when the encyclopedia Type filter is Gods. */
export const GOD_TIER_SECTIONS: {
	id: GodTier;
	title: string;
	subtitle: string;
}[] = [
	{ id: 'S', title: 'Tier S', subtitle: 'The Creator · Hannim' },
	{ id: 'I', title: 'Tier I · Lords', subtitle: 'Daebyul · Sobyul · Hallakgungi' },
	{ id: 'II', title: 'Tier II · Domains', subtitle: 'Life · Death · broad offices' },
	{ id: 'III', title: 'Tier III · Roles', subtitle: 'Kangrim · Haewonmek · Gate Guardian…' },
	{ id: 'IV', title: 'Tier IV · Particulars', subtitle: 'Gods of specific places' },
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
 * Relevance sort (see file header): god tier, then `relevanceScore`, then name.
 * Default wiki index order — not alphabetical, not reign seat.
 */
export function compareWikiEntries(a: Person, b: Person): number {
	const tier = godTierRank(a) - godTierRank(b);
	if (tier) return tier;

	const rel = relevanceScore(b) - relevanceScore(a);
	if (rel) return rel;

	return nameOf(a).localeCompare(nameOf(b));
}

export function filterProfiles(filters: WikiFilters): Person[] {
	const q = filters.q.trim().toLowerCase();
	return PROFILES.filter((p) => {
		if (filters.kind !== 'all') {
			if (filters.kind === 'character') {
				if (!onCharacterShelf(p)) return false;
			} else if (kindOf(p) !== filters.kind) return false;
		}
		if (filters.sub !== 'all' && !matchesWikiSub(p, filters.kind, filters.sub)) return false;
		if (filters.kingdom !== 'all' && p.kingdom !== filters.kingdom) return false;
		// Era is character-only metadata. Never hide gods/orgs/nations/places/etc.
		// for lacking era tags — when an era is selected, filter the character
		// subset and keep every non-character that matches the other filters.
		if (filters.tag !== 'all' && kindOf(p) === 'character') {
			if (!(p.tags ?? []).includes(filters.tag)) return false;
		}
		// Story is character-only: keep non-characters when kind is All.
		if (filters.story !== 'all' && kindOf(p) === 'character') {
			if (!STORY_CAST.get(filters.story)?.has(p.id)) return false;
		}
		// Gender applies to mortal characters and gendered gods. Entries without
		// `gender` appear only when the chip is All — never inferred.
		if (filters.gender !== 'all') {
			const k = kindOf(p);
			if (k === 'character' || k === 'god') {
				if (!p.gender || p.gender !== filters.gender) return false;
			}
		}
		if (filters.art === 'missing' && hasRealAvatar(p)) return false;
		if (filters.art === 'confirmed' && !hasConfirmedAvatar(p)) return false;
		if (!q) return true;
		const ownerHay =
			hasOwnerRoster(p)
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
		return hasTerm(hay, q);
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

const OBJECT_KIND_ORDER: ObjectKind[] = ['sword', 'instrument', 'clothing'];
const OBJECT_KIND_LABEL: Record<ObjectKind, { en: string; ko: string }> = {
	sword: { en: 'Swords', ko: '칼' },
	instrument: { en: 'Instruments', ko: '악기' },
	clothing: { en: 'Clothing', ko: '옷과 관' }
};

/** Objects page — swords / instruments / clothing as separate section headers. */
export function groupByObjectKind(
	entries: Person[]
): { key: ObjectKind; title: string; titleKo: string; items: Person[] }[] {
	const buckets = new Map<ObjectKind, Person[]>();
	for (const p of entries) {
		const ok = objectKindOf(p);
		if (!ok) continue;
		const list = buckets.get(ok);
		if (list) list.push(p);
		else buckets.set(ok, [p]);
	}
	return OBJECT_KIND_ORDER.filter((k) => buckets.has(k)).map((k) => ({
		key: k,
		title: OBJECT_KIND_LABEL[k].en,
		titleKo: OBJECT_KIND_LABEL[k].ko,
		items: buckets.get(k)!
	}));
}

/** Character browse: split by kingdom, seat-number ascending inside each (monarchs first). */
export type KingdomOrderGroup = {
	key: string;
	title: string;
	subtitle: string;
	items: Person[];
};

const KINGDOM_ORDER: Person['kingdom'][] = [
	'silla',
	'baekje',
	'goguryeo',
	'gaya',
	'buyeo',
	'jolbon',
	'joseon',
	'tamla',
	'tang',
	'yamato',
	'underworld',
	'other'
];

function compareByRegnal(a: Person, b: Person): number {
	const ra = regnalOf(a) ?? Number.POSITIVE_INFINITY;
	const rb = regnalOf(b) ?? Number.POSITIVE_INFINITY;
	if (ra !== rb) return ra - rb;
	return compareWikiEntries(a, b);
}

/**
 * Characters grouped by kingdom, each list ordered by reign seat (제N대).
 * Kingdoms with no one in the filter are skipped. `other` last.
 */
export function groupByKingdomOrder(entries: Person[]): KingdomOrderGroup[] {
	const buckets = new Map<Person['kingdom'], Person[]>();
	for (const p of entries) {
		const list = buckets.get(p.kingdom);
		if (list) list.push(p);
		else buckets.set(p.kingdom, [p]);
	}
	const seen = new Set<Person['kingdom']>();
	const out: KingdomOrderGroup[] = [];
	for (const kid of KINGDOM_ORDER) {
		const items = buckets.get(kid);
		if (!items?.length) continue;
		seen.add(kid);
		items.sort(compareByRegnal);
		const meta = KINGDOMS[kid];
		out.push({
			key: kid,
			title: meta?.label ?? kid,
			subtitle: meta?.korean ?? '',
			items
		});
	}
	for (const [kid, items] of buckets) {
		if (seen.has(kid)) continue;
		items.sort(compareByRegnal);
		const meta = KINGDOMS[kid];
		out.push({
			key: kid,
			title: meta?.label ?? kid,
			subtitle: meta?.korean ?? '',
			items
		});
	}
	return out;
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

/** Swords, animals, instruments and clothing list people in `owners` (wielders / rider / players / wearers). */
export function hasOwnerRoster(p: Person): boolean {
	return p.entity === 'sword' || p.entity === 'animal' || p.entity === 'instrument' || p.entity === 'clothing';
}

/**
 * Index thumbnail width÷height by kind — matches the house boards
 * (portraits 2:3, place / bond boards 2:1, sword pommels square, animal boards &
 * flags ~3:2). Used for wiki cards so compressed tiles don’t force one ratio.
 */
export function wikiThumbRatio(p: Person): number {
	const ok = objectKindOf(p);
	if (ok === 'sword' || ok === 'clothing') return 1;
	if (ok === 'instrument') return 3 / 2;
	switch (kindOf(p)) {
		case 'character':
		case 'god':
		case 'flower':
			return 2 / 3;
		case 'place':
		case 'city':
		case 'room':
		case 'relationship':
			return 2;
		case 'clan':
		case 'animal':
		case 'nation':
		case 'people':
			return 3 / 2;
		case 'organization':
		case 'group':
			return 16 / 10;
		default:
			return 2 / 3;
	}
}

/** Dense wiki index — these kinds use wide boards, so the grid stays ~3 columns. */
export const WIKI_WIDE_THUMB_KINDS: WikiKind[] = [
	'place',
	'city',
	'room',
	'relationship',
	'organization',
	'group',
	'clan',
	'people',
	'nation',
	'animal',
	'object'
];

/** People listed in a profile's `owners` — a sword's wielders, an animal's rider or guided, an instrument's players. */
export function ownersOf(profileId: string): Person[] {
	const profile = byId.get(profileId);
	if (!profile?.owners?.length) return [];
	const rows: Person[] = [];
	const seen = new Set<string>();
	for (const id of profile.owners) {
		const person = byId.get(id);
		if (!person || seen.has(person.id)) continue;
		seen.add(person.id);
		rows.push(person);
	}
	return rows;
}

/** Profiles of one owned kind (sword / animal / instrument) that list this person in `owners`. */
function ownedProfilesOf(personId: string, entity: Person['entity']): Person[] {
	return PROFILES.filter(
		(p) => p.entity === entity && (p.owners ?? []).includes(personId)
	).sort(compareWikiEntries);
}

/** Sword encyclopedia entries linked to a person (via `owners`). */
export function swordsOf(personId: string): Person[] {
	return ownedProfilesOf(personId, 'sword');
}

/** Horses and creatures linked to a person — the animals they ride or are led by. */
export function animalsOf(personId: string): Person[] {
	return ownedProfilesOf(personId, 'animal');
}

/** Instruments a person plays. */
export function instrumentsOf(personId: string): Person[] {
	return ownedProfilesOf(personId, 'instrument');
}

/** Crowns, caps and helms a person wears. */
export function clothingOf(personId: string): Person[] {
	return ownedProfilesOf(personId, 'clothing');
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

/** Kinds whose index grows a row of people chips: entries that are about people. */
export const CAST_KINDS: readonly WikiKind[] = ['relationship', 'group', 'organization'];

export function hasCastFilter(kind: WikiKind | 'all'): boolean {
	return kind !== 'all' && CAST_KINDS.includes(kind);
}

const CAST_CACHE = new Map<string, string[]>();

/** The people an entry is about: a relationship's pair, a group's or organization's members. */
export function castOf(p: Person): string[] {
	const hit = CAST_CACHE.get(p.id);
	if (hit) return hit;
	const k = kindOf(p);
	const ids =
		k === 'relationship'
			? [...(p.between ?? [])]
			: k === 'group'
				? groupMembersOf(p.id).map((m) => m.id)
				: k === 'organization'
					? membersOf(p.id).map((m) => m.id)
					: [];
	CAST_CACHE.set(p.id, ids);
	return ids;
}

export type CastChip = { person: Person; count: number };

/** Everyone the entries are about, with how many entries feature them; most entries first. */
export function castChips(entries: Person[]): CastChip[] {
	const counts = new Map<string, number>();
	for (const e of entries) {
		for (const id of castOf(e)) counts.set(id, (counts.get(id) ?? 0) + 1);
	}
	return [...counts]
		.flatMap(([id, count]) => {
			const person = byId.get(id);
			return person ? [{ person, count }] : [];
		})
		.sort((a, b) => b.count - a.count || compareWikiEntries(a.person, b.person));
}

/**
 * Entries featuring any of `ids`; those featuring more of them come first
 * (Sunduk + Yushin puts their own bond ahead of each one's others). No ids keeps every entry.
 */
export function withCast(entries: Person[], ids: string[]): Person[] {
	if (!ids.length) return entries;
	const picked = new Set(ids);
	return entries
		.map((p) => ({ p, hits: castOf(p).filter((id) => picked.has(id)).length }))
		.filter((r) => r.hits > 0)
		.sort((a, b) => b.hits - a.hits)
		.map((r) => r.p);
}

/** A labelled slice of a wiki roster — a Hwarang class, or one nation’s members. */
export type MemberBand = {
	id: string;
	label: string;
	korean?: string;
	color?: string;
	members: Person[];
};

/** Roster split by each member’s kingdom, nations in the order they first appear. */
export function membersByKingdom(members: Person[]): MemberBand[] {
	const bands = new Map<string, MemberBand>();
	for (const m of members) {
		let band = bands.get(m.kingdom);
		if (!band) {
			const k = KINGDOMS[m.kingdom];
			band = {
				id: m.kingdom,
				label: k.label,
				korean: byId.get(`nation-${m.kingdom}`)?.korean,
				color: k.color,
				members: []
			};
			bands.set(m.kingdom, band);
		}
		band.members.push(m);
	}
	return [...bands.values()];
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

/**
 * Entry art for the wiki's drifting wall, most important first: portraits
 * (2:3, lit from below in the entry's colour) two to every place board (2:1).
 */
export function wikiWallStills(count: number): { src: string; ratio: number; tint: string }[] {
	const ranked = PROFILES.filter(hasRealAvatar).sort(compareWikiEntries);
	const art = (kinds: WikiKind[], ratio: number) =>
		ranked
			.filter((p) => kinds.includes(kindOf(p)))
			.map((p) => ({ src: avatarOf(p)!, ratio, tint: colorOf(p) }));
	const faces = art(['character', 'god'], 2 / 3);
	const boards = art(['place', 'city', 'room'], 2);
	const out: { src: string; ratio: number; tint: string }[] = [];
	for (let i = 0; out.length < count && (faces.length || boards.length); i++) {
		const next = (i % 3 === 2 ? boards : faces).shift() ?? (faces.shift() || boards.shift());
		if (next) out.push(next);
	}
	return out;
}
