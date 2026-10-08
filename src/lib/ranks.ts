/**
 * Who outranks whom, the way each realm counted it: Silla by bone, Baekje by
 * clan, Goguryeo by 부 (the five tribes that became the five commands), the
 * Tang and the island courts by office, the gods by pantheon class.
 *
 * `rankOf` reads only facts already on `Person` — `boneRank`, `clan`, `tribe`,
 * `godTier`, `career` and the year's stage title — so a new character sorts
 * correctly once those are filled in.
 */
import { byId, isMonarch, resolveStage, titleOf, type CareerOffice, type GodTier, type Person } from '$lib/people';

export type RankMetric = 'bone' | 'clan' | 'tribe' | 'court' | 'divine';

export interface Rank {
	/** Section key: a kingdom, `buyeo` for Buyeo & Jolbon together, or `gods`. */
	kingdom: string;
	section: { en: string; ko: string };
	metric: RankMetric;
	/** The metric's tier for this person — "True Bone", "Satek clan", "East · Crow". */
	label: string;
	ko: string;
	/** Tier within the metric; lower outranks higher. */
	order: number;
	/** Office tier at that year (monarch 0 … no office 8); breaks ties inside a tier. */
	office: number;
	/** The office that set `office`, when there is one. */
	officeLabel?: string;
	officeKo?: string;
}

type Tier = { label: string; ko: string };

const SECTIONS: { id: string; en: string; ko: string; metric: RankMetric }[] = [
	{ id: 'silla', en: 'Silla', ko: '신라', metric: 'bone' },
	{ id: 'baekje', en: 'Baekje', ko: '백제', metric: 'clan' },
	{ id: 'goguryeo', en: 'Goguryeo', ko: '고구려', metric: 'tribe' },
	{ id: 'buyeo', en: 'Buyeo & Jolbon', ko: '부여 · 졸본', metric: 'tribe' },
	{ id: 'gaya', en: 'Gaya', ko: '가야', metric: 'court' },
	{ id: 'tang', en: 'Tang', ko: '당', metric: 'court' },
	{ id: 'yamato', en: 'Yamato', ko: '왜', metric: 'court' },
	{ id: 'tamla', en: 'Tamla', ko: '탐라', metric: 'court' },
	{ id: 'joseon', en: 'Old Joseon', ko: '고조선', metric: 'court' },
	{ id: 'gods', en: 'Gods', ko: '신', metric: 'divine' },
	{ id: 'other', en: 'Others', ko: '그 밖의 인물', metric: 'court' }
];
const SECTION_INDEX = new Map(SECTIONS.map((s, i) => [s.id, i]));

/** Gods (not demigod founders, who rank with their kingdom) share one section. */
function sectionOf(p: Person) {
	if (p.entity === 'god' && p.godTier !== 'demigod') return SECTIONS[SECTION_INDEX.get('gods')!];
	const id = p.kingdom === 'jolbon' ? 'buyeo' : p.kingdom;
	return SECTIONS[SECTION_INDEX.get(id) ?? SECTION_INDEX.get('other')!];
}

// ── Silla: bone rank ──────────────────────────────────────
const BONES: [RegExp, Tier][] = [
	[/sacred|성골/i, { label: 'Sacred Bone', ko: '성골' }],
	[/true|진골/i, { label: 'True Bone', ko: '진골' }],
	[/6|six|육두품/i, { label: 'Head Rank 6', ko: '6두품' }],
	[/5|five|오두품/i, { label: 'Head Rank 5', ko: '5두품' }],
	[/4|four|사두품/i, { label: 'Head Rank 4', ko: '4두품' }],
	[/commoner|평민/i, { label: 'Commoner', ko: '평민' }],
	[/slave|노비/i, { label: 'Slave', ko: '노비' }]
];

function boneTier(p: Person): [number, Tier] {
	const i = p.boneRank ? BONES.findIndex(([re]) => re.test(p.boneRank!)) : -1;
	return i < 0 ? [BONES.length, { label: 'Rank unrecorded', ko: '골품 미상' }] : [i, BONES[i][1]];
}

// ── Baekje: royal Buyeo, then the Eight Great Clans in the story's own order ──
const EIGHT_CLANS = ['clan-satek', 'clan-yunbi', 'clan-jinmo', 'clan-mokli', 'clan-hae', 'clan-baek', 'clan-guk', 'clan-ahn'];

function clanTier(p: Person): [number, Tier] {
	if (p.clan === 'clan-buyeo') return [0, { label: 'Royal Buyeo', ko: '부여 왕가' }];
	const clan = p.clan ? byId.get(p.clan) : undefined;
	const eight = p.clan ? EIGHT_CLANS.indexOf(p.clan) : -1;
	if (clan && eight >= 0) return [1 + eight, { label: `${clan.name} · Eight Clans`, ko: `${clan.korean} · 대성팔족` }];
	if (clan) return [1 + EIGHT_CLANS.length, { label: `${clan.name} clan`, ko: clan.korean ?? clan.name }];
	return [2 + EIGHT_CLANS.length, { label: 'No great house', ko: '대성 밖' }];
}

// ── Goguryeo / Jolbon: the five 부 (royal house, then crow East and the four ka) ──
const TRIBES: Record<NonNullable<Person['tribe']>, [number, Tier]> = {
	royal: [0, { label: 'Royal house · Gyeru', ko: '계루부 · 왕가' }],
	east: [1, { label: 'East · Crow', ko: '동부 · 까마귀' }],
	central: [2, { label: 'Central · Horse', ko: '중부 · 말' }],
	west: [3, { label: 'West · Cow', ko: '서부 · 소' }],
	south: [4, { label: 'South · Pig', ko: '남부 · 돼지' }],
	north: [5, { label: 'North · Dog', ko: '북부 · 개' }]
};

function tribeOf(p: Person): Person['tribe'] {
	if (p.tribe) return p.tribe;
	if (p.clan === 'clan-go') return 'royal';
	if (p.clan === 'clan-yeon') return 'east';
	if (p.kingdom === 'goguryeo' && isMonarch(p)) return 'royal';
	return undefined;
}

function tribeTier(p: Person): [number, Tier] {
	const t = tribeOf(p);
	return t ? TRIBES[t] : [6, { label: 'Outside the five 부', ko: '5부 밖' }];
}

// ── Gods: pantheon class ──────────────────────────────────
const GOD_TIERS: Record<GodTier, [number, Tier]> = {
	S: [0, { label: 'Creator', ko: '창조신' }],
	I: [1, { label: 'Sovereign of a realm', ko: '삼계의 주인' }],
	II: [2, { label: 'God of a domain', ko: '권역의 신' }],
	III: [3, { label: 'God of a place or office', ko: '직능의 신' }],
	demigod: [4, { label: 'Demigod', ko: '반신' }]
};

// ── Office: the same ladder everywhere, from the career entry held that year ──
const OFFICES: [RegExp, number][] = [
	[/^(?:king|emperor|ruler|sovereign|founder|voted king|god-king|heavenly sovereign)\b/i, 0],
	[/^(?:queen|empress)\b|crown prince|crown princess|queen consort|empress|consort|concubine|talented lady|heir/i, 1],
	[/supreme|high commander|high councillor|prime minister|premier|chancellor|taedaegakgan|great minister/i, 2],
	[/general|commander|marshal|guardian|admiral|dragon|tiger|fowl|tortoise|protector|captain|warden/i, 3],
	[/councillor|counsellor|minister|jwapyeong|envoy|governor|chief|chieftain|\bka\b/i, 4],
	[/prince|princess|queen/i, 5],
	[/hwarang/i, 6],
	[/officer|attendant|disciple|scholar|monk/i, 7]
];

const COURT_TIERS: Tier[] = [
	{ label: 'Sovereign', ko: '군주' },
	{ label: 'Royal house', ko: '왕실' },
	{ label: 'First ministers', ko: '재상' },
	{ label: 'Generals', ko: '장수' },
	{ label: 'Ministers & envoys', ko: '대신 · 사신' },
	{ label: 'Royal kin', ko: '왕족' },
	{ label: 'Hwarang', ko: '화랑' },
	{ label: 'Officers', ko: '관리' },
	{ label: 'Subjects', ko: '백성' }
];

const held = (c: CareerOffice, year: number) => (c.from == null || year >= c.from) && (c.to == null || year <= c.to);

function officeOf(p: Person, year?: number | null): { tier: number; label?: string; ko?: string } {
	if (isMonarch(p, year)) {
		const reign = (p.career ?? []).find((c) => year == null || held(c, year));
		return { tier: 0, label: titleOf(p, year) ?? reign?.title, ko: reign?.korean };
	}
	const career = (p.career ?? []).filter((c) => year == null || held(c, year));
	const candidates: { title: string; korean?: string }[] = [...career];
	// A person-level title is a summary of the whole life; with a year, only the stage and the posts held count.
	const title = year == null || !p.career?.length ? titleOf(p, year) : resolveStage(p, year)?.title;
	if (title) candidates.push({ title });
	let best: { tier: number; label?: string; ko?: string } = { tier: 8 };
	for (const c of candidates) {
		const hit = OFFICES.find(([re]) => re.test(c.title));
		if (hit && hit[1] < best.tier) best = { tier: hit[1], label: c.title, ko: c.korean };
	}
	return best;
}

/** A person's standing in their realm, at `year` when given (offices change; blood does not). */
export function rankOf(p: Person, year?: number | null): Rank {
	const section = sectionOf(p);
	const office = officeOf(p, year);
	let order: number;
	let tier: Tier;
	switch (section.metric) {
		case 'bone':
			[order, tier] = boneTier(p);
			break;
		case 'clan':
			[order, tier] = clanTier(p);
			break;
		case 'tribe':
			[order, tier] = tribeTier(p);
			break;
		case 'divine':
			[order, tier] = p.godTier ? GOD_TIERS[p.godTier] : [5, { label: 'Unranked god', ko: '미분류 신' }];
			break;
		default:
			[order, tier] = [office.tier, COURT_TIERS[office.tier]];
	}
	return {
		kingdom: section.id,
		section: { en: section.en, ko: section.ko },
		metric: section.metric,
		label: tier.label,
		ko: tier.ko,
		order,
		office: office.tier,
		officeLabel: office.label,
		officeKo: office.ko
	};
}

/** Kingdom first (Silla, Baekje, Goguryeo, …, gods, others), then the realm's metric, then office. */
export function compareRanks(a: Rank, b: Rank): number {
	return (
		(SECTION_INDEX.get(a.kingdom) ?? 99) - (SECTION_INDEX.get(b.kingdom) ?? 99) ||
		a.order - b.order ||
		a.office - b.office
	);
}

export function compareByRank(a: Person, b: Person, year?: number | null): number {
	return compareRanks(rankOf(a, year), rankOf(b, year));
}
