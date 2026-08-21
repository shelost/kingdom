/**
 * Cast of the chronicle.
 *
 * Ages shown in the prose are *derived* from `born` and the year of the entry
 * they appear in — the story text no longer carries hardcoded ages.
 * `aliases` are the surface forms that appear in the prose.
 */

import { RELATIONSHIPS, CHART_NODES } from '$lib/relations';
import { PLACE_PROFILES, type PlaceKind } from '$lib/places';
import { PHRASES } from '$lib/phrases';
import { SWORDS } from '$lib/swords';
import { PERSONA_META } from '$lib/personaMeta';
import { staticAsset } from '$lib/staticAsset.svelte';

export interface LifeEvent {
	year?: number;
	label: string;
}

/**
 * An office or rank held in life — chronological on `Person.career`.
 * Ages are derived in the wiki from `born` + `from`/`to`; do not store them here.
 * Omit `to` when the post lasts until death or is still held.
 */
export interface CareerOffice {
	title: string;
	korean?: string;
	hanja?: string;
	/** Wiki organization (or nation) id — CV title links to that entry’s chart. */
	org?: string;
	from?: number;
	to?: number;
	note?: string;
}

export type BondKind = 'love' | 'affair' | 'rival' | 'kin' | 'sworn' | 'mentor';

/**
 * Divine class for gods (and rare demigod-touched founders).
 * S = Creator (Hwanin) above the Three Realms; I rules one of the Three;
 * II broad nature; III specific office/territory; demigod = semi-divine founders.
 */
export type GodTier = 'S' | 'I' | 'II' | 'III' | 'demigod';

/**
 * A year-bounded face of the same person — prince vs king, childhood name vs
 * temple title. `from` inclusive, `until` exclusive. Omit either end for open.
 * Unset fields fall back to the person’s base `name` / `title` / `avatar`.
 */
export interface PersonStage {
	/** Stable slug for explicit `look` hints on story blocks — e.g. `queen`, `king`. */
	id?: string;
	from?: number;
	until?: number;
	name?: string;
	korean?: string;
	title?: string;
	avatar?: string;
	/** Wiki chip — e.g. "As queen", "In his last years". */
	label?: string;
}

/** Hierarchy node for organization wiki charts (click → profile when `id` is a person). */
export interface OrgChartNode {
	id: string;
	role?: string;
	/** Parent node id; `null` / omitted = root. */
	reportsTo?: string | null;
}

export interface Person {
	id: string;
	name: string; // display name
	korean?: string;
	hanja?: string;
	title?: string; // "King Muyeol of Silla"
	/**
	 * Encyclopedia kind. Omit for mortal characters.
	 * `god` = deities / divine figures; `concept` = systems & ideas;
	 * `organization` = councils, orders, courts (wiki-browsable);
	 * `group` = named ensembles of characters (Four Dragons, Three Founders, …);
	 * `clan` = blood houses (Yeon, Eight Clans, Kim lines, …);
	 * `phrase` / `nation` / `relationship` / `place` / `sword` as named.
	 */
	entity?:
		| 'god'
		| 'concept'
		| 'organization'
		| 'group'
		| 'clan'
		| 'phrase'
		| 'nation'
		| 'relationship'
		| 'place'
		| 'sword';
	/**
	 * Organization ids this character belongs to (Hwarang, High Summit, …).
	 * Reverse lookup on org pages via `membersOf` in wiki.ts.
	 */
	orgs?: string[];
	/**
	 * Hwarang cohort — numeric class from entry year (`year − 559`; Class 1 = 560).
	 * `HWARANG_CLASSES` pins famous rooms (Jukji with Pumsuk at 74). Filled during profile merge.
	 */
	hwarangClass?: {
		id: string;
		label: string;
		korean?: string;
		initiated?: number;
		/** Stable chip colour for this class (see `HWARANG_CLASS_COLORS`). */
		color?: string;
	};
	/**
	 * Group ids this character or place belongs to (named ensembles — Four Dragons,
	 * Three Sacred Bones, Four Realms places, …). Reverse lookup via `groupMembersOf`
	 * in wiki.ts; display order may be pinned in `GROUP_ROSTERS`.
	 */
	groups?: string[];
	/**
	 * Org-chart seats for `entity: 'organization'` (and `'group'`).
	 * `id` is usually a person id; synthetic seats may use `_seat-n`.
	 */
	orgChart?: OrgChartNode[];
	/**
	 * Character accent hex. Prefer this over kingdom default / COLOR table.
	 * Only characters (and rare dual-tone gods) need special colours —
	 * places/nations/concepts stay on kingdom defaults unless already set.
	 */
	color?: string;
	/**
	 * Optional second accent when a figure is dual-coded (e.g. Heaven–Earth King:
	 * red + blue). UI shows a dual chip; `colorOf` still returns the primary.
	 */
	colorSecondary?: string;
	/**
	 * Era / generation chips for wiki filter & detail — **characters only**.
	 * Gods, nations, places, concepts, phrases, and relationships do not carry eras.
	 * Slugs: `gen-i` | `gen-ii` | `gen-iii` | `joseon` | `founders` | `legends`
	 */
	tags?: string[];
	/**
	 * Realm / domain for gods (and rare place-bound powers).
	 * Shown as a colored chip on wiki cards and detail — EN + KO.
	 */
	realm?: { en: string; ko: string };
	/**
	 * Divine class. Drives wiki default sort among gods (and mixed lists):
	 * S → I → II → III → demigod → unranked.
	 */
	godTier?: GodTier;
	kingdom:
		| 'silla'
		| 'baekje'
		| 'goguryeo'
		| 'tang'
		| 'gaya'
		| 'yamato'
		| 'tamla'
		| 'joseon'
		| 'underworld'
		| 'other';
	born?: number; // negative = BCE
	died?: number;
	bornApprox?: boolean;
	main?: boolean; // the three leads
	/**
	 * Which silhouette stands in when there is no portrait. Only needed for
	 * people the relationship chart does not already place (see `avatarOf`);
	 * on a `concept` it is also what marks the record as a body rather than
	 * an institution.
	 */
	gender?: 'm' | 'f';
	avatar?: string; // profile picture, e.g. "/ch_chunchu.png"
	photo?: string; // real photograph (nations), e.g. "/nations/silla.jpg"
	photoCredit?: string;
	tagline: string; // one line, shown in the hover card
	/** Defining line shown large on the profile panel — prefer actual chronicle dialogue. */
	quote?: string;
	/**
	 * First line this character speaks in the chronicle (EN; optional KO).
	 * Wiki profiles surface these as bookends with `lastLine`.
	 */
	firstLine?: { en: string; ko?: string };
	/**
	 * Last mortal line in the chronicle (EN; optional KO).
	 * Reaper / soul talk comes after this in death scenes.
	 */
	lastLine?: { en: string; ko?: string };
	arc?: string; // character arc, shown in the panel
	/** Temperament / philosophy — how they move through politics and love. */
	nature?: string;
	/**
	 * Ring-pommel blade — unique for those who fight (or rarely do).
	 * Decoration read character the way a crest does.
	 */
	blade?: string;
	/** Ring-pommel illustration (`/sword_*.png` in static). */
	swordImage?: string;
	/** Unique binyeo — hairpin that hints at a woman’s station and nature. */
	binyeo?: string;
	/** Binyeo illustration (`/bn_*.png` in static). */
	binyeoImage?: string;
	events?: LifeEvent[];
	/** Offices and ranks held — chronological. Wiki derives ages from `born`. */
	career?: CareerOffice[];
	/** Year-scoped name / title / portrait overrides (prince → king, etc.). */
	stages?: PersonStage[];
	aliases: string[];
	/**
	 * Lived-in epithets (OP/Naruto-style). Shown in wiki/profile.
	 * Distinctive ones should also appear in `aliases` so prose links;
	 * disputed or ultra-generic titles stay here only to avoid false positives.
	 */
	sobriquets?: string[];
	/**
	 * Clan entity id (`clan-yeon`, `clan-satek`, …) when known.
	 * Free-text leftovers are still accepted by `clanOf` for display.
	 */
	clan?: string;
	/**
	 * Additional clan affiliations (e.g. Sosuno: Yeon by birth + Go by marriage).
	 * Primary remains `clan`; membership lookups include both.
	 */
	clans?: string[];
	/**
	 * Per-clan affiliation override. Default: primary `clan` = blood;
	 * `clans[]` = marriage (maternal eight-clan claims may set `blood` here).
	 */
	clanBy?: Partial<Record<string, 'blood' | 'marriage'>>;
	/**
	 * Map place subtype when `entity: 'place'` — drives Cities vs Places wiki filters.
	 */
	placeKind?: PlaceKind;
	/**
	 * Parent city id when this place is not itself a city (`placeKind !== 'city'`).
	 * Wiki hierarchy: Place → City → Kingdom / Nation.
	 */
	cityId?: string;
	/** Silla bone rank or equivalent caste note when lore states it. */
	boneRank?: string;
	/** Optional tastes / soft spots for denser infobox rows — never invent. */
	likes?: string;
	/**
	 * Modern-gloss political affiliation. Tang is “the West” in-period;
	 * the label is meant to rhyme with later debates (westernization vs modernization).
	 */
	ideology?: string;
	/** One-line gloss for the wiki — period politics in a modern frame. */
	ideologyNote?: string;
	/**
	 * Explicit kin rows for the wiki infobox. When omitted, `familyOf` derives
	 * from relationship profiles (kin → love as Spouse).
	 */
	family?: { id: string; role: string }[];
	/**
	 * Strong personality trait tags for LLM chat (merged from personaMeta when set).
	 */
	personality?: string[];
	/**
	 * Hand-authored LLM system prompt for “Chat as…” / wiki “LLM prompt”.
	 * Alias field `llmPrompt` is accepted and normalized onto `prompt`.
	 * When omitted, `buildChatPrompt` synthesizes from personality / nature / arc.
	 */
	prompt?: string;
	/** Preferred wiki label alias for `prompt`. */
	llmPrompt?: string;
	/** For relationships: the two people this edge connects. */
	between?: [string, string];
	/** For relationships: the nature of the bond. */
	bond?: BondKind;
	/**
	 * For sword profiles: person ids who wield or wielded this blade
	 * (primary / most recent first). Reverse lookup via `swordsOf` in wiki.ts.
	 */
	owners?: string[];
	/** Chart layout hint (people nodes that appear on the relationship graph). */
	chart?: { x: number; y: number };
}

export const KINGDOMS: Record<
	Person['kingdom'],
	{ label: string; color: string; flag?: string; icons?: string }
> = {
	silla: {
		label: 'Silla',
		color: '#3E79E4',
		flag: '/flag_silla.svg',
		icons: 'crown · heavenly horse · blue · moon · love'
	},
	baekje: {
		label: 'Baekje',
		color: '#FFCB51',
		flag: '/flag_baekje.svg',
		icons: 'crown · heavenly deer · yellow · stars · loyalty'
	},
	goguryeo: {
		label: 'Goguryeo',
		color: '#C30000',
		flag: '/flag_goguryeo.svg',
		icons: 'crown · three-legged crow · red · sun · will'
	},
	tang: { label: 'Tang', color: '#b45309', flag: '/flag_tang.svg', icons: 'dragon · gold · empire' },
	gaya: {
		label: 'Gaya',
		color: '#8b5cf6',
		flag: '/flag_gaya.svg',
		icons: 'six eggs · iron · purple'
	},
	yamato: {
		label: 'Yamato',
		color: '#ec4899',
		flag: '/flag_wa.svg',
		icons: 'rising sun · cherry · sea lanes'
	},
	tamla: {
		label: 'Tamla',
		color: '#f97316',
		flag: '/flag_tamla.svg',
		icons: 'oranges · island · three princes'
	},
	joseon: {
		label: 'Joseon',
		color: '#1a4d6d',
		icons: 'sandalwood · mandate · afterlife of the name'
	},
	underworld: {
		label: 'Land of the Dead',
		color: '#5f5f6b',
		icons: 'ledger · crow · borders of the dead'
	},
	other: { label: '—', color: '#8a8a94' }
};

export const PEOPLE: Person[] = [
	{
		id: 'bohee',
		name: 'Bohee',
		korean: '보희',
		kingdom: 'silla',
		gender: 'f',
		title: 'Elder sister of Munhee',
		tagline: 'Dreamed she drowned the capital, and sold the dream for a silk skirt.',
		quote: "Silence is also a stitch.",
		binyeo: 'Silk-wrapped wooden binyeo — plain timber under the wrap; the dream went with the skirt.',
		events: [
			{ year: 625, label: 'Sells the dream. Declines to sew a nobleman’s coat.' }
		],
		aliases: ['Bohee']
	},
	{
		id: 'haemosu',
		avatar: '/ch_haemosu.png',
		name: 'Haemosu',
		korean: '해모수',
		hanja: '解慕漱',
		entity: 'god',
		godTier: 'II',
		gender: 'm',
		kingdom: 'goguryeo',
		title: 'God of the sun',
		realm: { en: 'Sun', ko: '태양' },
		tagline: 'Drove the sun’s chariot every day of his life and stopped it exactly once.',
		quote: "I stop the chariot once. That once is enough.",
		arc: 'Sun under Little Star’s 이승 — Class II beside Ibiga (sky) and the Samsin (life). Not Lord of Heaven, not Son of Heaven, but the light that still answers desire. He crosses the sky on schedule until Yuhwa in the Amnok shallows breaks the schedule; Habek casts her out; Jumong is born of that heat. A younger 해 took the night-road; Haemosu leaves that job alone until the river, once, for his son — Class II still outranks the fetch. When Yuhwa dies he does not send the dark: he comes himself, and she takes the night as moon. A territorial god: where the chariot passes, the day belongs to him.',
		nature:
			'Optimistic jock / cheerleader of the life gods — most extroverted of Haemosu–Ibiga–Samsin. Upbeat, carefree, heat-as-appetite; stops the chariot once and never apologizes for wanting. Has a younger 해 who walked the dark instead of the sun’s chariot; he will shove that one off a riverbank for Jumong and clap him on the shoulder afterward. Death is not his office — except once, for her.',
		events: [
			{ label: 'Sees Yuhwa in the shallows of the Ubal and comes down.' },
			{ label: 'Builds a copper room on the riverbank in an afternoon.' },
			{ year: -37, label: 'Blocks Haewonmek at the river so Jumong may cross.' },
			{ label: 'Takes Yuhwa’s soul himself; she keeps the moon.' }
		],
		aliases: ['Haemosu']
	},
	{
		id: 'habek',
		avatar: '/ch_habek.png',
		name: 'Habek',
		korean: '하백',
		hanja: '河伯',
		entity: 'god',
		godTier: 'III',
		gender: 'm',
		kingdom: 'goguryeo',
		title: 'God of the Amnok River',
		realm: { en: 'Amnok River', ko: '압록강' },
		tagline: 'Ruled a river the way kings rule borders — and cast out a daughter for crossing one.',
		quote: "The Amnok keeps its own court.",
		arc: 'River-god of the Amnok, father of Yuhwa. He keeps a court under the current — vassals of fish and turtle, borders of mist — and when the sun god takes his daughter he answers as a sovereign, not a peasant: exile, not negotiation. Jumong’s claim later runs through his blood whether Habek wills it or not. Territorial: the Amnok’s mist is his seal.',
		events: [
			{ label: 'Casts Yuhwa out for loving Haemosu.' },
			{ label: 'His river later bridges Jumong’s flight on the backs of fish and turtles.' }
		],
		aliases: ['Habek', 'Habaek', '하백', '河伯']
	},
	{
		id: 'hwanin',
		avatar: '/ch_hwanin.png',
		name: 'Hwanin',
		korean: '환인',
		hanja: '桓因',
		entity: 'god',
		godTier: 'S',
		gender: 'm',
		kingdom: 'joseon',
		title: 'Creator · Lord of Heaven · King of Kings',
		realm: { en: 'Heaven · above the Three Realms', ko: '하늘나라 · 삼계 위' },
		tagline: 'Class S — the Creator. The Big Man Upstairs. In charge of the universe; the Three Realms answer beneath him.',
		quote: 'Heaven rules by sending. Earth rules by staying.',
		nature:
			'Creator of the chronicle’s cosmos — Christian overtones without forcing the Name. Elites and island mouths call him Lord, the King of Kings, the Big Man Upstairs (위에 계신 어른 / 만왕의 왕). He keeps 하늘나라 as his own court, not as a peer of the Three Realms. Sons and seals go down from here; living, dead, and western flowers keep house below.',
		arc: 'Class S Creator above 삼계. He does not plough; he commissions. Beneath him the Three Realms: 이승 (Little Star), 저승 (Big Star), 서천꽃밭 (Hallakgungi). Heaven–Earth King once stewarded living and dead under that charge, then retired; the flower wager split those two courts between the twins. When the mortal domain needs a steward of the mandate, Hwanin sends Hwanung — Son of Heaven — with three seals and three thousand, and history is what that descent costs.',
		events: [
			{ label: 'Keeps the universe; the Three Realms sit beneath Heaven.' },
			{ label: 'Sends Hwanung down under the sandalwood tree.' }
		],
		sobriquets: [
			'The Big Man Upstairs',
			'위에 계신 어른',
			'Lord',
			'주님',
			'the King of Kings',
			'만왕의 왕',
			'Creator',
			'창조주',
			'Lord of Heaven'
		],
		career: [
			{ title: 'Lord of Heaven', korean: '환인', hanja: '桓因', org: 'four_divisions' }
		],
		aliases: [
			'Hwanin',
			'환인',
			'桓因',
			'Lord of Heaven',
			'Lord',
			'주님',
			'The Big Man Upstairs',
			'위에 계신 어른',
			'the King of Kings',
			'만왕의 왕',
			'the Creator',
			'Creator',
			'창조주'
		]
	},
	{
		id: 'yeontabal',
		gender: 'm',
		avatar: '/ch_yeon_tabal.png',
		name: 'Yeon Tabal',
		korean: '연타발',
		kingdom: 'goguryeo',
		clan: 'clan-yeon',
		title: 'Chieftain of Jolbon',
		tagline: 'Suspicious of an exile — until that exile split his arrow.',
		quote: "Salt and iron before courtesy.",
		nature:
			'Speaks the way later Yeons will speak — short, hot, no patience for a Go prince who arrives with nothing but a bow. The Yeon clan’s river wealth against the royal Go claim starts here, implied in every weighing look he gives Jumong.',
		blade: 'Ring-pommel hunting sword — tiger-tooth guard, no court polish.',
		events: [
			{ label: 'Backs an exiled prince with salt, iron and his daughter.' },
			{ label: 'The Yeon hall’s register — blunt, loyal, hard to buy — passes down the blood.' }
		],
		career: [
			{ title: 'Chieftain of Jolbon', korean: '족장', from: -37 }
		],
		aliases: ['Yeon Tabal', 'Tabal']
	},
	{
		id: 'jomigon',
		gender: 'm',
		name: 'Jomi-gon',
		korean: '조미곤',
		kingdom: 'silla',
		title: 'Servant, prisoner, and the quietest weapon in the war',
		tagline: 'Sent back into Baekje as a household man, and spent eleven years being useful.',
		quote: "Usefulness is its own exile.",
		events: [
			{ year: 655, label: 'Returns to Sabi as steward to the minister Imja.' },
			{ year: 660, label: 'Imja’s silence becomes Silla’s door.' }
		],
		aliases: ['Jomi-gon', 'Jomigon']
	},
	{
		id: 'imja',
		gender: 'm',
		name: 'Imja',
		korean: '임자',
		hanja: '任子',
		kingdom: 'baekje',
		title: 'Jwapyeong of Baekje',
		tagline: 'Was asked what becomes of his house when the country falls, and did not report the question.',
		quote: "Ask the question. Do not deliver the answer.",
		career: [
			{ title: 'Jwapyeong', korean: '좌평', hanja: '佐平', org: 'ministersassembly' }
		],
		aliases: ['Imja']
	},
	{
		id: 'ibiga',
		avatar: '/ch_ibiga.png',
		name: 'Ibiga',
		korean: '이비가',
		entity: 'god',
		godTier: 'II',
		gender: 'm',
		kingdom: 'gaya',
		title: 'God of the sky',
		realm: { en: 'Sky', ko: '하늘' },
		tagline: 'Came down to a mountain ridge and could not take his hands back.',
		quote: "Desire is a kind of weather — it does not ask permission.",
		arc: 'God of the sky under Little Star’s 이승 — Class II beside Haemosu (sun) and the Samsin (life). Below Heaven’s lordship, beside the mountain’s claim. He descends to the Lady of the Right View’s ridge and cannot leave; Gaya’s eggs are born of that overnight sovereignty. Territorial weather: the deep blue over the ridge is his.',
		nature:
			'Optimistic life-god energy with a sensual, flirty edge — weather as seduction. Extroverted and carefree; less jock than Haemosu, less bluntly carnal than Samsin.',
		events: [{ label: 'Touches the Lady of the Right View; two sons are born of that night.' }],
		aliases: ['Ibiga'],
		chart: { x: 40, y: 520 }
	},
	{
		id: 'samsin',
		avatar: '/ch_samsin.png',
		name: 'Samsin',
		korean: '삼신녀',
		entity: 'god',
		godTier: 'II',
		gender: 'f',
		kingdom: 'other',
		title: 'Birth goddesses · life under 이승',
		realm: { en: 'Life · birth', ko: '생명 · 출산' },
		tagline: 'Class II under Little Star — the three who keep birth, not Silla’s steam cavern.',
		quote: 'Life arrives in threes. Count carefully.',
		nature:
			'The Samsin-nyeo (삼신녀): birth and life’s office in the living world — optimistic, extroverted, carefree, and sexually forward as life/birth goddesses. Charted under Little Star with Ibiga (sky) and Haemosu (sun). Not the steam sisters of Yushin’s cavern — a different three, and an older claim. Notices Yumla’s shy crush and does not mind.',
		arc: 'Class II domain of life within 이승. Folk midwifery and household rites know them as the three who open and close a birth; the pantheon chart seats them under Little Star with Ibiga (sky) and Haemosu (sun) — Little Star’s retinue in the Three Realms, not Heaven’s descent line and not Silla’s steam counsel.',
		binyeo: 'Glass taeguk binyeo — blue and vermilion in one swirl, celadon clouds down a jade-green shaft; birth arrives in threes.',
		binyeoImage: '/bn_samsin.png',
		events: [{ label: 'Kept on the Three Realms chart as life under Little Star.' }],
		sobriquets: ['삼신', 'Three Birth Goddesses', 'Samsin-nyeo'],
		aliases: [
			'Samsin',
			'Samsin-nyeo',
			'삼신녀',
			'삼신',
			'Three Birth Goddesses',
			'Birth Goddesses'
		]
	},
	{
		id: 'jeonggyeon',
		avatar: '/ch_rightview.png',
		name: 'Lady of the Right View',
		korean: '정견모주',
		hanja: '正見母主',
		entity: 'god',
		godTier: 'III',
		gender: 'f',
		kingdom: 'gaya',
		title: 'Goddess of the mountain',
		realm: { en: 'Mountain ridge', ko: '산' },
		tagline: 'Let the sky kneel on her ridge — and kept him until morning.',
		quote: "Nights when heaven kneels are not so common.",
		arc: 'Goddess of the mountain — the ridge that answers the sky. Class III: a specific territory’s claim. She receives Ibiga not as a guest but as a court receives a visiting power, and keeps him until morning; Suro and Ijinasi hatch from that night’s mandate.',
		binyeo: 'Jade-mist binyeo — marbled green shaft, gold bands, cloud-head with a green orb; warm where heaven knelt until morning.',
		binyeoImage: '/bn_right_view.png',
		events: [{ label: 'Mother of Suro and Ijinasi.' }],
		aliases: ['Lady of the Right View', 'Jeonggyeonmoju', 'Jeonggyeon', 'rightview'],
		chart: { x: 220, y: 520 }
	},
	{
		id: 'suro',
		gender: 'm',
		avatar: '/ch_suro.png',
		name: 'King Suro',
		korean: '수로왕',
		hanja: '首露王',
		kingdom: 'gaya',
		title: 'Founder of Golden Gaya',
		tagline: 'Came out of the first egg, and walked down to the beach himself.',
		quote: "Hunger is honest. Meet it yourself.",
		events: [
			{ year: 42, label: 'Hatches from the box of six eggs; founds Golden Gaya.' },
			{ year: 48, label: 'Meets a princess off a red-sailed ship and does not send a servant.' },
			{ label: 'Lets two of his ten sons carry her family name instead of his.' }
		],
		career: [
			{ title: 'King of Golden Gaya', korean: '왕', hanja: '王', org: 'nation-gaya', from: 42 }
		],
		aliases: ['King Suro', 'Suro'],
		clan: 'clan-geumgwan-kim',
		chart: { x: 40, y: 640 }
	},
	{
		id: 'ijinasi',
		avatar: '/ch_ijinasi.png',
		name: 'King Ijinasi',
		korean: '이진아시왕',
		hanja: '伊珍阿豉王',
		kingdom: 'gaya',
		title: 'Founder of Great Gaya',
		gender: 'm',
		clan: 'clan-geumgwan-kim',
		tagline: 'The other egg — Suro’s brother, who walked a different valley.',
		quote: "Six eggs. Six thrones. Take the larger hill.",
		nature: 'Twin-born of the mountain night with Suro; less charming, more territorial. Where Suro waits on a beach for a red sail, Ijinasi builds a court that will one day outlast Golden Gaya’s fame and still lose the war that matters.',
		events: [
			{ year: 42, label: 'Hatches among the six; founds Great Gaya.' }
		],
		career: [
			{ title: 'King of Great Gaya', korean: '왕', hanja: '王', org: 'nation-gaya', from: 42 }
		],
		aliases: ['King Ijinasi', 'Ijinasi', '이진아시']
	},
	{
		id: 'heohwangok',
		avatar: '/ch_heo.png',
		name: 'Queen Heo',
		korean: '허황옥',
		hanja: '許黃玉',
		kingdom: 'gaya',
		gender: 'f',
		title: 'First queen of Golden Gaya',
		clans: ['clan-geumgwan-kim'],
		clanBy: { 'clan-geumgwan-kim': 'marriage' },
		tagline: 'Sailed in from a country nobody had heard of, and kept her own name.',
		quote: "Keep your own name across any sea.",
		binyeo: 'Purple-tiger binyeo — amethyst shaft, gold snarl clutching a violet orb; foreign work no Gaya smith could name, kept like her name across the water.',
		binyeoImage: '/bn_heo.png',
		events: [
			{ year: 48, label: 'Arrives by sea at sixteen; buries her silk trousers as an offering.' },
			{ label: 'Mother of ten sons; two of them take her surname.' }
		],
		career: [
			{ title: 'Queen of Golden Gaya', korean: '왕후', hanja: '王后', org: 'nation-gaya', from: 48 }
		],
		aliases: ['Queen Heo', 'Heo Hwangok'],
		chart: { x: 220, y: 640 }
	},
	{
		id: 'hwanung',
		avatar: '/ch_hwanung.png',
		name: 'Hwanung',
		korean: '환웅',
		hanja: '桓雄',
		entity: 'god',
		godTier: 'II',
		gender: 'm',
		kingdom: 'joseon',
		title: 'Son of Heaven',
		realm: { en: 'Heaven’s descent', ko: '천강' },
		tagline: 'Sent down with the mandate — and could not rule until he had touched the earth.',
		quote: "A king must first touch the earth.",
		arc: 'Son of Heaven — the Creator’s heir, sent below from 하늘나라 into Little Star’s mortal domain with three seals and three thousand. The gravity of the descent is the story: heaven’s word made flesh among garlic, mugwort, and a woman who used to be a bear. Their son Dangun inherits the mandate as earthly steward. Island banter still asks what mortals did with that son.',
		events: [{ label: 'Marries Ungnyeo under the sacred tree; fathers Dangun.' }],
		career: [
			{ title: 'Son of Heaven', korean: '환웅', hanja: '桓雄', org: 'four_divisions' }
		],
		aliases: ['Hwanung', 'Son of Heaven', '천자'],
		chart: { x: 40, y: 760 }
	},
	{
		id: 'ungnyeo',
		avatar: '/ch_ungnyeo.png',
		name: 'Ungnyeo',
		korean: '웅녀',
		hanja: '熊女',
		entity: 'god',
		godTier: 'III',
		gender: 'f',
		kingdom: 'joseon',
		title: 'The Bear-Woman',
		realm: { en: 'Sandalwood ordeal', ko: '신단수' },
		tagline: 'Twenty-one days of garlic and mugwort — then she waited to be seen.',
		quote: "Endure the dark. Become what the light can marry.",
		binyeoImage: '/bn_ungnyeo.png',
		events: [{ label: 'Becomes a woman; stands under the tree until heaven marries her.' }],
		aliases: ['Ungnyeo', 'Bear-Woman', 'the Bear-Woman'],
		chart: { x: 220, y: 760 }
	},
	// ————————————————————————— the three leads —————————————————————————
	{
		id: 'chunchu',
		gender: 'm',
		avatar: '/ch_chunchu.png',
		name: 'King Muyeol',
		korean: '김춘추',
		hanja: '金春秋',
		title: 'King Muyeol, 29th of Silla',
		kingdom: 'silla',
		born: 603,
		died: 661,
		main: true,
		tagline: '“I am the goal. Everything else is scenery.”',
		ideology: 'Westernizing modernizer',
		ideologyNote: 'Insists Samhan must “learn from the West” (Tang then; another empire’s name tomorrow): Chinese-style governance — seal, speed, Secretariat, fewer uncles — without surrendering the lintel. Named for the Chinese classics (春秋, Spring and Autumn) and entirely untroubled by it. Argues modernization through westernization as survival.',
		quote: 'I am the goal. Everything else is scenery.',
		firstLine: {
			en: '…Keep that. I may need to borrow it back when I am braver.',
			ko: '…그건 두어라. 용기가 생기면 도로 빌릴지도 모르니.'
		},
		lastLine: {
			en: 'Bupmin… I love you.',
			ko: '법민아… 사랑한다.'
		},
		nature: 'The smartest and most wily: an opportunist who will say or become whatever the room requires, lethal when patient. Most steeped in Chinese letters, most international — he can meet Tang, Yamato, and Goryeo each in their own tongue, and sometimes still says Goguryeo because the chronicles taught him the older name. His refrain is blunt: learn from the West, westernize the door (seal, speed, Secretariat) without becoming the West — Tang as the period’s “West,” a metaphor that will outlive the dynasty. Also a sheltered ivory-tower elite: almost no opinion of commoners, almost no contact with them; Daeya’s resentment of the capital blindsides him completely. Reads international patterns decades ahead; packed with life-skills — geomancy, arms, charm. Best-looking of the leads, and the most social. Before the crown, corridors whisper Magenta Devil (자의악마 / 자색의 악마) for the 자색 — purple-crimson, 자홍-adjacent — he prefers to wear as habit, not only rank dye; the epithet thins once he is Muyeol.',
		arc: 'Born a royal barred from the throne by Bone Rank, Chunchu becomes the cleverest man in rooms he is not allowed to rule — steeped in Chinese letters, fluent in every tongue the peninsula and its neighbours speak, able to forecast an alliance’s betrayal a generation out. He is also sheltered: he does not know what Surabol looks like from Daeya until it kills his daughter. Gotaso’s death turns wit into patience. For most of the chronicle he has one heir in focus — Bupmin; Inmun is also his son, but lives as Tang’s long hostage-diplomat and stays mostly off the page. As Kim Chunchu he is already the Magenta Devil in other people’s mouths — fox, imugi, and magenta sleeve in one whisper. He kneels in Pyongyang, sails to Yamato, wins Chang’an, founds the Royal Secretariat, and dies the first True Bone king — Baekje gone, Goryeo standing, the Tang already inside the door he opened. After coronation the Magenta Devil talk is mostly retired; kings collect other names.',
		blade: 'Ring-pommel court sword — imugi coiled on the grip; drawn rarely, remembered always.',
		swordImage: '/sword_dragon.png',
		stages: [
			{
				id: 'prince',
				until: 654,
				name: 'Kim Chunchu',
				title: 'Prince of Silla',
				label: 'As Kim Chunchu',
				avatar: '/ch_chunchu.png'
			},
			{
				id: 'king',
				from: 654,
				name: 'King Muyeol',
				title: 'King Muyeol, 29th of Silla',
				label: 'As King Muyeol',
				avatar: '/ch_muyeol.png'
			}
		],
		events: [
			{ year: 632, label: 'Passed over for the throne; Dukman is crowned Queen Sunduk.' },
			{ year: 642, label: 'His daughter Gotaso dies at Daeya Fortress. He swears revenge.' },
			{ year: 642, label: 'Goes to Goryeo for troops; Yeon imprisons him, then lets him go.' },
			{ year: 647, label: 'Survives Bidam’s rebellion at Queen Sunduk’s side.' },
			{ year: 647, label: 'Sails to Yamato to ask for troops. Refused.' },
			{ year: 648, label: 'Wins the Silla–Tang alliance from Emperor Taizong.' },
			{ year: 649, label: 'Returns from Tang; On Gunhae dies in his clothes on the Yellow Sea.' },
			{ year: 651, label: 'Founds the Royal Secretariat, ruling around the Harmony Council.' },
			{ year: 654, label: 'Crowned King Muyeol — the first True Bone king.' },
			{ year: 660, label: 'Sabi falls. He makes Euija pour his wine.' },
			{ year: 661, label: 'Dies with the war unfinished — declines Kangrim and Haewonmek; walks the underworld himself.' }
		],
		clan: 'clan-gyeongju-kim',
		boneRank: 'True Bone (진골)',
		sobriquets: [
			'the most cunning man in Samhan',
			'Nine-Tailed Fox',
			'구미호',
			'Imugi',
			'이무기',
			'Magenta Devil',
			'Devil in Magenta',
			'자의악마',
			'자색의 악마',
			'Devil of Magenta'
		],
		career: [
			{ title: 'Hwarang', korean: '화랑', hanja: '花郎', org: 'hwarang', from: 618, to: 632, note: 'youth' },
			{ title: 'Councillor', korean: '대등', hanja: '大等', org: 'harmonycouncil', from: 632, to: 654 },
			{ title: 'Envoy', korean: '사신', hanja: '使臣', from: 642, to: 648, note: 'Goryeo, Yamato, Tang' },
			{ title: 'King Muyeol', korean: '태종무열왕', hanja: '太宗武烈王', org: 'sillaroyal', from: 654 }
		],
		aliases: [
			'Prince Chunchu',
			'King Muyeol',
			'Kim Chunchu',
			'Muyeol',
			'Chunchu',
			'the most cunning man in Samhan',
			'Nine-Tailed Fox',
			'구미호',
			'Imugi',
			'이무기',
			'Magenta Devil',
			'Devil in Magenta',
			'자의악마',
			'자색의 악마',
			'Devil of Magenta'
		]
	},
	{
		id: 'gesomun',
		gender: 'm',
		avatar: '/ch_yeon_gesomun.png',
		name: 'Yeon Gesomun',
		korean: '연개소문',
		hanja: '淵蓋蘇文',
		title: 'Supreme Commander (대막리지) of Goguryeo',
		kingdom: 'goguryeo',
		born: 605,
		died: 665,
		bornApprox: true,
		main: true,
		clan: 'clan-yeon',
		tagline: '“No one is coming to save the 겨레. So I will.”',
		ideology: 'Ethnonational populist',
		ideologyNote: '겨레 over courts; anti-elite, anti-tribute strongman. Hears “westernize” as kneeling with better stationery.',
		quote: 'No one is coming to save the 겨레. So I will.',
		firstLine: {
			en: 'Do you know what happens to traitors, young man...?',
			ko: '반역자에게 어떤 일이 생기는지 아느냐, 젊은이…?'
		},
		lastLine: {
			en: 'Do not… fight amongst yourselves…',
			ko: '서로… 싸우지 마라…'
		},
		nature: 'The simplest and most passionate of the three: a true patriot of the common people who despises elites, committees, and tribute paid for another decade of quiet. Rural-general faith — he wholeheartedly believes the founding myths: Jumong the holy king, Haemosu’s sun line, heaven’s descent as bone of the 겨레. Speaks often of 겨레 and builds loyalty by heat rather than by book. Everyone else says Goryeo; he alone insists on Goguryeo, the old full name, as if shortening it were already surrender. Implied blood of Yeon Tabal’s hall: same blunt register, same refusal to be bought by a Go king’s courtesy. Tries to import Tang Taoism to starve the Buddhist monk aristocracy of prestige — a policy that fails to prevent a monk from opening Pyongyang. Charisma of the populist strongman — both the shelter he gives the marches and the massacre he calls rescue. Name: Yeon (연 / 淵) is the Goguryeo clan — never Baekje’s Prince Yun / Buyeo Yun (부여연 / 扶餘演), a different man, kingdom, and hanja.',
		arc: 'An Eastern Commander (대가) who despises the High Summit’s courage-until-the-final-vote. In 642 he butchers king and Commanders, invents Supreme Commander (대막리지) above the old High Commander (막리지), seats Dosuryu as Chancellor (대대로), and rules through Bojang. When Euija mocks gods as tools of obedience, Gesomun does not flinch — the marches taught him Jumong was real. He leaves three heirs — Yeon Namseng under his own strict roof, Yeon Namgun and Yeon Namsan under his brother Jungto and sister Sooyoung — and no institution that can hold them together. For twenty years he is proved right against Tang; he builds nothing that can outlive him. Within a year of his death the three sons are at each other’s throats and the eldest guides Tang to Pyongyang. Not kin to Baekje’s Prince Yun.',
		blade: 'The Five Blades — four commandery ring-pommels and the king’s own, each crow-stamped, worn across one spine.',
		swordImage: '/sword_crow.png',
		events: [
			{ year: 634, label: 'Defies the High Summit at Pyongyang; the court marks him a traitor.' },
			{ year: 642, label: 'Renews his vow at Jumong Cavern; massacres the court; creates Supreme Commander (대막리지).' },
			{ year: 642, label: 'Imprisons Kim Chunchu, then releases him at Kim Yushin’s name.' },
			{ year: 645, label: 'Survives Taizong’s invasion; Ansi Fortress holds.' },
			{ year: 662, label: 'Destroys Pang Xiaotai’s army at the Snake River; refuses Kangrim and Haewonmek.' },
			{ year: 665, label: 'Dies in his sleep — Yumla himself comes, after both reapers failed at Salsu.' }
		],
		sobriquets: [
			'the Eternal General',
			'Red Sun of Pyongyang',
			'the Red Sun of Pyongyang',
			'only real man left in Samhan'
		],
		career: [
			{ title: 'Eastern Commander', korean: '대가', hanja: '大加', org: 'highsummit', from: 634, to: 642 },
			{ title: 'Supreme Commander', korean: '대막리지', hanja: '大莫離支', org: 'highsummit', from: 642 }
		],
		aliases: [
			'Yeon Gesomun',
			'Commander Yeon',
			'Gesomun',
			'Yeon',
			'the Eternal General',
			'Eternal General',
			'Red Sun of Pyongyang',
			'the Red Sun of Pyongyang',
			'only real man left in Samhan',
			'Supreme Commander',
			'대막리지'
		]
	},
	{
		id: 'yeonwife',
		name: "Yeon's Wife",
		korean: '연씨부인',
		gender: 'f',
		kingdom: 'goguryeo',
		clan: 'clan-yeon',
		tagline: 'Years of quiet rooms — then a name that sounds like relief.',
		quote: "Ask what the outside will call us — before the banquet cools.",
		nature: 'Patience worn thin in corridors that learned not to hope aloud. Desire: one child who stays. Wound: seasons when the Eastern hall stayed ready and no cry came. Voice: quiet, precise — she saves the hard questions for when the lamps are low.',
		arc: 'The histories leave her unnamed, which is how most wives of strongmen are written. Before Namseng there were years the Eastern hall kept too still — lamps lit for no arrival, women’s voices lowered where even a Supreme Commander’s wife dared not count aloud. When the first heir finally breathes, the household names him plainly: Namseng, a son is born — syllables like thanks. She bears the three heirs; Gesomun keeps the eldest under his own strict roof while Jungto and Sooyoung take the younger two. She keeps the Yeon hall when the banquet hall is still wet, and asks the one question the Supreme Commander cannot answer with a sword: what the outside world will call them.',
		binyeo: 'Plain bronze crow-pin — march metal, not capital gold.',
		events: [
			{ year: 634, label: 'After years of quiet, bears Namseng — “a son is born”; Samsin aids the birth beside their portrait.' },
			{ year: 642, label: 'After the massacre, asks Yeon what foreign courts will say — and receives his answer.' }
		],
		aliases: ["Yeon's Wife", "Yeon’s wife", '연씨부인']
	},
	{
		id: 'gulgul',
		gender: 'm',
		avatar: '/ch_dae_gulgul.png',
		name: 'Gulgul',
		korean: '걸걸',
		hanja: '乞乞',
		title: 'Warden of the northern border',
		kingdom: 'goguryeo',
		tagline: 'A Mohe boy Yeon pulled from the snow — and later, Dae Joyoung’s father.',
		quote: "Loyalty needs no invitation.",
		arc: 'Yeon finds him young on a northern raid and brings him to Pyongyang under the name Gulgul — not Goguryeo, not Mohe, just his. He is raised one step behind Yeon’s sons until the commander posts him to the northern marches and writes the surname Dae on him. When Pyongyang falls he carries a broken piece of the crown into the Manchurian fields — and teaches his son the words Yeon would not let die.',
		blade: 'Border sabre — plain ring pommel, notch from a Liao winter.',
		stages: [
			{
				id: 'young',
				until: 642,
				label: 'As Gulgul',
				avatar: '/ch_dae_gulgul_young.png'
			},
			{
				id: 'dae',
				from: 642,
				label: 'As Dae Gulgul',
				avatar: '/ch_dae_gulgul.png'
			}
		],
		events: [
			{ year: 634, label: 'Taken in by Yeon as a boy; named Gulgul.' },
			{ year: 642, label: 'Given the surname Dae and posted to the northern border.' },
			{ year: 668, label: 'Flees north with a shard of the Goryeo crown.' },
			{ year: 698, label: 'His son founds Balhae on that shard’s memory.' }
		],
		career: [
			{ title: 'Warden of the northern border', korean: '변장', from: 642 }
		],
		aliases: ['Gulgul', 'Dae Gulgul', 'Geolgeol', '걸걸', '대굴굴']
	},
	{
		id: 'daejoyoung',
		gender: 'm',
		avatar: '/ch_dae_joyoung.png',
		name: 'Dae Joyoung',
		korean: '대조영',
		hanja: '大祚榮',
		title: 'Founder of Balhae',
		kingdom: 'goguryeo',
		tagline: 'The boy who repeated what the fields would not forget.',
		quote: "A crown in shards is still a crown.",
		arc: 'Son of Dae Gulgul. Runs through Manchurian millet with a crown-shard against his ribs and a sentence in his mouth that outlives every wall.',
		events: [
			{ year: 668, label: 'Flees the fall with his father and a piece of the crown.' },
			{ year: 698, label: 'Founds Balhae — Goryeo’s afterlife under another name.' }
		],
		career: [
			{ title: 'King of Balhae', korean: '왕', hanja: '王', from: 698 }
		],
		aliases: ['Dae Joyoung', 'Dae Jo-yeong', 'Joyoung', '대조영']
	},
	{
		id: 'euija',
		gender: 'm',
		avatar: '/ch_buyeo_euija.png',
		name: 'King Euija',
		korean: '부여의자',
		hanja: '扶餘義慈',
		title: 'King Euija, 31st Eraha of Baekje',
		kingdom: 'baekje',
		born: 600,
		died: 660,
		bornApprox: true,
		main: true,
		clan: 'clan-buyeo',
		stages: [
			{
				until: 641,
				name: 'Buyeo Euija',
				title: 'Crown Prince of Baekje'
			},
			{
				from: 641,
				name: 'King Euija',
				title: 'King Euija, 31st Eraha of Baekje'
			}
		],
		tagline: '“Find what they fear. Weave it into a story.”',
		ideology: 'Narrative realpolitik',
		ideologyNote: 'Cynical statecraft: people need a story and a leader; historical grudges are borders you can move with a speech.',
		quote: 'Find what they fear. Weave it into a story.',
		firstLine: {
			en: 'Father… I have no interest in these clan quarrels. A king should be for the country—',
			ko: '아버지… 저는 이런 가문 싸움에 관심 없습니다. 왕은 나라를 위한 존재여야—'
		},
		lastLine: {
			en: 'No.',
			ko: '없다.'
		},
		nature: 'Palace-bred realpolitik: cynical, calculating, and liberal with appetite — a prince who learned early that people are clay shaped by their rooms. He openly mocks gods and spirits as cheap civil servants — stories designed to keep the people obedient — and laughs in Gesomun’s face for still believing Jumong’s sun-god descent. He disdains the common folk for how easily a story moves them, and insists they need both a narrative and a leader. His soft spot is Gyebek — whom he sees as unstained by politics, a victim of environment rather than a player — and he teaches Gyebek and Gesomun the dirty grammar of courts throughout their alliances. Most calculating of the three kings; closest in method to classic realpolitik, and the most openly sensual of the leads. Baekje’s eastward manners sit easy on him — the polished court that taught the islands how to look at a king.',
		arc: 'Palace-raised into cynicism, Euija learns early that a kingdom is a story its people agree on — and that gods are props for obedience. He is the most calculating of the age: he teaches Gyebek and Gesomun how courts actually work, laughs when Gesomun cites Jumong’s sun-god blood as fact, keeps a soft spot for Gyebek as the one man unstained by the game, and indulges appetite the way only a prince who never had to wait can. Where Chunchu’s page keeps one heir in focus and Yeon leaves three, Euija breeds fifty-odd sons and five who matter — Yung, Tae, Hyo, Prince Yun, Pung — each already half-claimed by a mother’s clan. He takes Daeya, humiliates Silla, purges the Great Clans, seats forty-odd of his own sons — fifty-plus in the house by the wine years — then the story eats him. Of that swarm the chronicle keeps five: Yung, Tae, Hyo, Prince Yun (Buyeo Yun — not Yeon Gesomun), and Pung. The rest are Assembly furniture. With no rivals left he seals the palace — the clans having already shipped his truth-teller to Tamla while he mourned — starves the other, and dies in Chang’an screaming Chunchu’s name.',
		blade: 'Ring-pommel tiger sword — gold tiger on the pommel; worn for ceremony more than blood.',
		events: [
			{ year: 632, label: 'Crown prince; slips out of the palace and names a nameless boy Gyebek.' },
			{ year: 641, label: 'King Mu dies. Euija takes the throne vowing to finish his war.' },
			{ year: 642, label: 'Takes Daeya Fortress, killing Chunchu’s daughter.' },
			{ year: 642, label: 'Goes in disguise to Goryeo to bargain with Yeon Gesomun.' },
			{ year: 655, label: 'Purges the Ministers’ Assembly, seating 41 of his own sons.' },
			{ year: 656, label: 'Imprisons Sungchung, who starves to death warning him.' },
			{ year: 659, label: 'The nine omens. He jumps the White River and shouts for Gyebek.' },
			{ year: 660, label: 'Sabi falls; he is captured at Bear Fortress and shipped to Tang.' },
			{ year: 660, label: 'Dies in Chang’an — “…so you’re real after all.” Escort unseen.' }
		],
		sobriquets: ['Righteous and Merciful', 'the Righteous and Merciful', 'Thirty-first Eraha'],
		career: [
			{ title: 'Crown Prince', korean: '태자', hanja: '太子', org: 'nation-baekje', from: 632, to: 641 },
			{ title: 'King', korean: '어라하', org: 'nation-baekje', from: 641, note: '31st Eraha' }
		],
		aliases: [
			'King Euija',
			'Prince Euija',
			'Buyeo Euija',
			'Euija',
			'Righteous and Merciful',
			'the Righteous and Merciful',
			'Thirty-first Eraha',
			'31st Eraha'
		]
	},

	// ————————————————————————— Silla —————————————————————————
	{
		id: 'yushin',
		gender: 'm',
		avatar: '/ch_kim_yushin.png',
		name: 'Kim Yushin',
		korean: '김유신',
		hanja: '金庾信',
		title: 'Marshal of Silla',
		kingdom: 'silla',
		born: 595,
		died: 673,
		clan: 'clan-geumgwan-kim',
		boneRank: 'True Bone (진골)',
		tagline: '“In all this world, wouldn’t it be good to have one person always on your side, Princess?”',
		ideology: 'Loyalist modernizer',
		ideologyNote: 'Duty to queen and country over faction. If the crown orders Tang drill and Secretariat speed, he learns them without sentiment — the West’s tools, never the West’s worship. To Bidam that is selling the country; to Yushin it is only the queen’s arithmetic.',
		quote: 'In all this world, wouldn’t it be good to have one person always on your side, Princess?',
		firstLine: {
			en: 'Well stood. Tomorrow on the yard — the hundred-and-ninth is mine.',
			ko: '잘 섰다. 내일 연무장 — 백아홉은 내 것이다.'
		},
		lastLine: {
			en: 'Princess…',
			ko: '공주…'
		},
		nature: 'The patriotism paradox: a man of the periphery — Gaya’s last princely blood — who becomes Silla’s most loyal sword, the model old-stock soldier and general. Stoic, still human; the marshal every True Bone girl invents a husband for, and the one man who will not look back. Deeply romantic, and in love with Dukman in a way he never makes cheap — eyes only for the queen he cannot have. Lifelong sparring partner to Bidam — one year younger, 108–108 — the confrontation at Radiance hurts because the score was always even, and the blood never was. Hwarang to the bone: elite-trained, beautiful in the way the order demands, with forms the yard still names after him.',
		arc: 'Grandson of the prince who surrendered Golden Gaya, Yushin is True Bone by grant — forever the man from the edge who out-loves the centre. He already knows the steam cavern his father found: Narim, Golhwa, and Hyullé keep only Kims — 김, steam and surname in the same breath — and he rides there for counsel, not discovery. Bidam names him foreigner at Radiance and tells him blood is inevitable; after the tenth day Yushin whispers the same line back when Alchun objects to annihilating Bidam’s house — Surabol Son, Gurema’s line — turning Bidam’s heritage logic against the clan that raised him. Marshal of the Hwarang and Premier after Bidam, he trains Chunchu’s son Bupmin in the Five Principles after Daeya; conqueror of forty fortresses, the name that opens Yeon’s prison door; he marries his sister to Chunchu, holds Sunduk as she dies, faces Gyebek at the Yellow Mountain, and outlives almost everyone he swore himself to.',
		blade: 'Ring-pommel fish sword — Gaya fish on the pommel, Silla blue in the fuller.',
		swordImage: '/sword_fish.png',
		events: [
			{ year: 632, label: 'Pledges himself to Queen Sunduk “until the end.”' },
			{ year: 642, label: 'Marches on Baekje to avenge Daeya.' },
			{ year: 643, label: 'Trains Bupmin among the Hwarang — marshal of the flower youth.' },
			{ year: 647, label: 'Puts down Bidam’s rebellion; named Premier (상대등); orders annihilation of Surabol Son; holds Sunduk as she dies.' },
			{ year: 660, label: 'Faces Gyebek at the Yellow Mountain Fields.' },
			{ year: 673, label: 'Dies — Big Star comes himself; offers any wish; the wish is not written.' }
		],
		sobriquets: [
			'First Blade of Samhan',
			'Greatest Blade of Samhan',
			'삼한제일검',
			'Sword of Silla',
			'the Sword of Silla',
			'신라의 도검',
			'Sword of the Divine Country',
			'the Sword of the Divine Country',
			'Last Prince of Gaya',
			'가야의 마지막 왕자',
			'Last Son of Gaya'
		],
		career: [
			{ title: 'Hwarang disciple', korean: '낭도', hanja: '郎徒', org: 'hwarang', from: 610, to: 613, note: 'youth' },
			{ title: 'Hwarang', korean: '화랑', hanja: '花郎', org: 'hwarang', from: 613, to: 632 },
			{ title: 'Marshal', korean: '국선', hanja: '國仙', org: 'hwarang', from: 632, to: 668, note: 'head of the Hwarang' },
			{ title: 'Premier', korean: '상대등', hanja: '上大等', org: 'harmonycouncil', from: 647, to: 668 },
			{ title: 'Grand Elder', korean: '태대각간', hanja: '太大角干', org: 'nation-silla', from: 668 }
		],
		aliases: [
			'Marshal Yushin',
			'Kim Yushin',
			'Yushin',
			'First Blade of Samhan',
			'Sword of Silla',
			'the Sword of Silla',
			'신라의 도검',
			'Sword of the Divine Country',
			'the Sword of the Divine Country',
			'Last Prince of Gaya',
			'가야의 마지막 왕자',
			'Last Son of Gaya'
		],
		stages: [
			{
				id: 'hwarang',
				until: 632,
				label: 'As Hwarang',
				avatar: '/ch_kim_yushin_hwarang.png'
			},
			{
				id: 'marshal',
				from: 632,
				until: 668,
				label: 'As marshal',
				avatar: '/ch_kim_yushin.png'
			},
			{
				id: 'elder',
				from: 668,
				label: 'In his last years',
				avatar: '/ch_kim_yushin_old.png'
			}
		]
	},
	{
		id: 'sunduk',
		avatar: '/ch_dukman.png',
		name: 'Queen Sunduk',
		korean: '선덕여왕',
		hanja: '善德女王',
		title: '27th sovereign of Silla',
		kingdom: 'silla',
		gender: 'f',
		born: 595,
		died: 647,
		bornApprox: true,
		clan: 'clan-gyeongju-kim',
		boneRank: 'Sacred Bone (성골)',
		tagline: '“A country that does not count people as people — how is that meant to last a thousand years?”',
		ideology: 'Soft-power progressive',
		ideologyNote: 'Moral authority and clever mercy as statecraft; opens the age without asking Chang’an for a mirror.',
		quote: '…A country that does not count people as people. How is that meant to last a thousand years?',
		firstLine: {
			en: '…A country that does not count people as people. How is that meant to last a thousand years?',
			ko: '…사람을 사람으로 세지 않는 나라. 그게 어떻게 천 년을 가겠느냐?'
		},
		lastLine: {
			en: 'Yes. …And here we are. At the end.',
			ko: '그래. …여기까지 왔구나. 끝에.'
		},
		nature: 'Queen who reads people the way others read stars. Soft power as the harder blade; holds Yushin’s devotion without making a spectacle of it. Their bond is romantic and physical in the refined register of the chronicle — never crude, never cold. The crown she wears is not only gold: it is the right to speak for the heavenly horse.',
		arc: 'Chosen because the Sacred Bone line had run out of men, Dukman rules for fifteen years under a permanent question mark: whether a woman can govern at all. She answers it by outlasting it — deliberating national affairs in the Eastern Palace, reading the sky from Cheomseongdae — and dies in the middle of a rebellion raised on exactly that slogan.',
		binyeo: 'Gold crescent binyeo — amber sun in engraved moon, jade at the tail; sharp as kindness, never ostentatious.',
		binyeoImage: '/bn_sunduk.png',
		stages: [
			{
				id: 'princess',
				until: 632,
				name: 'Princess Dukman',
				korean: '덕만공주',
				title: 'Sacred Bone princess of Silla',
				label: 'As Princess Dukman',
				avatar: '/ch_dukman.png'
			},
			{
				id: 'queen',
				from: 632,
				until: 642,
				name: 'Queen Sunduk',
				korean: '선덕여왕',
				title: '27th sovereign of Silla',
				label: 'As queen',
				avatar: '/ch_sunduk.png'
			},
			{
				id: 'elder',
				from: 642,
				name: 'Queen Sunduk',
				korean: '선덕여왕',
				title: '27th sovereign of Silla',
				label: 'In her last years',
				avatar: '/ch_sunduk_old.png'
			}
		],
		events: [
			{ year: 632, label: 'Crowned the first Queen of Silla.' },
			{ year: 632, label: 'Makes the Eastern Palace her hall for national affairs.' },
			{ year: 642, label: 'Loses Daeya; sends Chunchu abroad for help.' },
			{ year: 647, label: 'Dies as Bidam besieges the capital.' }
		],
		sobriquets: [
			'the Woman King',
			'여왕',
			'the Blue Moon',
			'푸른 달',
			'청월'
		],
		career: [
			{ title: 'Sacred Bone princess', korean: '공주', org: 'sillaroyal', from: 610, to: 632 },
			{ title: 'Queen', korean: '선덕여왕', hanja: '善德女王', org: 'sillaroyal', from: 632 }
		],
		aliases: [
			'Queen Sunduk',
			'Princess Dukman',
			'Sunduk',
			'Dukman',
			'the Woman King',
			'Woman King',
			'the Blue Moon',
			'Blue Moon',
			'푸른 달',
			'청월'
		]
	},
	{
		id: 'jinduk',
		avatar: '/ch_jinduk.png',
		name: 'Queen Jinduk',
		korean: '진덕여왕',
		title: '28th sovereign of Silla',
		kingdom: 'silla',
		gender: 'f',
		born: 600,
		died: 654,
		bornApprox: true,
		clan: 'clan-gyeongju-kim',
		boneRank: 'Sacred Bone (성골)',
		tagline: '“When I die, do not pretend I ruled.”',
		ideology: 'Caretaker traditionalist',
		ideologyNote: 'Holds Sacred Bone legitimacy as a bridge, not a program — lasts so True Bone can begin.',
		quote: 'When I die, do not pretend I ruled.',
		firstLine: {
			en: 'Bidam…! What are you saying? Surely you don’t—',
			ko: '비담…! 무슨 소리요? 설마—'
		},
		lastLine: {
			en: '…I kept a seat from becoming a joke. That is all the Sacred Bone had left to do.',
			ko: '…자리가 농담이 되지 않게 지켰을 뿐이다. 성골에게 남은 일은 그게 전부였다.'
		},
		nature: 'Sunduk’s cousin; Chunchu’s aunt in the way the house counts kin. She wears the crown; he wears the hours. A kind woman who knows she is a bridge, not a destination — and who lets the bridge do its work without making a speech about it.',
		arc: 'Crowned after Bidam and Sunduk die in the same season. For seven years the Harmony Council still meets, and nothing of consequence leaves the room until Chunchu’s Secretariat has already sealed it. When she dies the Sacred Bone ends; the country continues under the nephew who had already been running it.',
		binyeo: 'Gold crescent binyeo — amber orb in scroll filigree, ruby at the tip; Sacred Bone quiet, no need to shout.',
		binyeoImage: '/bn_jinduk.png',
		stages: [
			{
				id: 'princess',
				until: 647,
				name: 'Princess Seungman',
				korean: '승만공주',
				title: 'Sacred Bone princess of Silla',
				label: 'As Princess Seungman',
				avatar: '/ch_seungman.png'
			},
			{
				id: 'queen',
				from: 647,
				name: 'Queen Jinduk',
				korean: '진덕여왕',
				title: '28th sovereign of Silla',
				label: 'As queen',
				avatar: '/ch_jinduk.png'
			}
		],
		events: [
			{ year: 647, label: 'Crowned after Sunduk’s death.' },
			{ year: 649, label: 'Posthumously names On Gunhae a Daeachan after the Yellow Sea decoy.' },
			{ year: 651, label: 'Watches the Royal Secretariat make the Council ornamental.' },
			{ year: 654, label: 'Dies; the Sacred Bone line is extinct.' }
		],
		career: [
			{ title: 'Sacred Bone princess', korean: '공주', org: 'sillaroyal', from: 615, to: 647 },
			{ title: 'Queen', korean: '진덕여왕', hanja: '眞德女王', org: 'sillaroyal', from: 647 }
		],
		aliases: ['Queen Jinduk', 'Princess Seungman', 'Kim Seungman', 'Jinduk', 'Seungman']
	},
	{
		id: 'munhee',
		avatar: '/ch_munhee.png',
		name: 'Munhee',
		korean: '문희',
		title: 'Queen Munmyung',
		kingdom: 'silla',
		gender: 'f',
		born: 610,
		died: 681,
		bornApprox: true,
		clan: 'clan-geumgwan-kim',
		clans: ['clan-gyeongju-kim'],
		clanBy: { 'clan-gyeongju-kim': 'marriage' },
		boneRank: 'True Bone (진골)',
		tagline: '“Sew the life you mean to keep.”',
		ideology: 'Household pragmatist',
		ideologyNote: 'Politics as packing lists and marriages; soft power that keeps Chunchu’s westernizing door fed.',
		quote: 'Not yet. I’ll pay the rest.',
		firstLine: {
			en: 'Totally unfit for a Noble woman… Come on, boy, can’t you find something better?',
			ko: '귀족 여자에게 전혀 안 어울려… 얘, 좀 더 나은 거 못 찾니?'
		},
		lastLine: {
			en: 'She spent her whole life watching other people love. Mine included.',
			ko: '언니는 평생 남이 사랑하는 걸 보기만 했어. 내 것까지.'
		},
		nature: 'The household half of Chunchu’s politics: she packs the bags for every country he tries to save them with. Their marriage is affectionate and hungry in equal measure — tasteful, never coy about wanting. Related to almost every Silla name that matters — sister of the marshal, wife of the diplomat-king, mother of Munmu, aunt-by-marriage to a generation of True Bone. The story opens on her hair and closes on her watching a son wear a broken northern crown.',
		binyeo: 'Gold dragon binyeo — coral set in the crest, pink glow at the tip; Yushin’s house in miniature.',
		binyeoImage: '/bn_munhee.png',
		events: [
			{ year: 632, label: 'A young noblewoman with three small children — Bupmin among them.' },
			{ year: 641, label: 'Buys a dream; sews a coat; marries Chunchu.' },
			{ year: 642, label: 'Holds the house when Gotaso dies.' },
			{ year: 654, label: 'Becomes queen consort under Muyeol.' },
			{ year: 661, label: 'Pays the rest at Chunchu’s deathbed.' },
			{ year: 676, label: 'Lives to see her son crowned King of Samhan.' }
		],
		sobriquets: [
			'the most powerful woman in Silla',
			'신라 최강의 여인'
		],
		career: [
			{ title: 'Queen consort', korean: '왕후', hanja: '王后', org: 'sillaroyal', from: 654 }
		],
		stages: [
			{
				id: 'young',
				until: 654,
				label: 'As Munhee',
				avatar: '/ch_munhee.png'
			},
			{
				id: 'queen',
				from: 654,
				until: 670,
				name: 'Queen Munmyung',
				korean: '문명왕후',
				label: 'As queen',
				avatar: '/ch_munmyung.png'
			},
			{
				id: 'elder',
				from: 670,
				name: 'Queen Munmyung',
				korean: '문명왕후',
				label: 'In her last years',
				avatar: '/ch_munmyung_old.png'
			}
		],
		aliases: [
			'Queen Munmyung',
			'Munhee',
			'the most powerful woman in Silla',
			'신라 최강의 여인'
		]
	},
	{
		id: 'munmu',
		gender: 'm',
		avatar: '/ch_bupmin.png',
		name: 'King Munmu',
		korean: '문무왕',
		hanja: '文武王',
		title: '30th sovereign of Silla',
		kingdom: 'silla',
		born: 626,
		died: 681,
		clan: 'clan-gyeongju-kim',
		boneRank: 'True Bone (진골)',
		tagline: '“I want to be the king for all.”',
		ideology: 'Civic nationalist',
		ideologyNote: '“King for all” — inclusive realm-nationalism that allies with the West, then expels it.',
		quote: 'I want to be the king for all. Not a king for Sacred Bone. Not a king for True Bone. For all.',
		firstLine: {
			en: 'I want to be the king for all. Not a king for Sacred Bone. Not a king for True Bone. For all.',
			ko: '나는 모두를 위한 왕이 되고 싶다. 성골의 왕도, 진골의 왕도 아닌. 모두를 위한.'
		},
		lastLine: {
			en: 'Wait… why is one side of the Goryeo crown strange?',
			ko: '잠깐… 왜 고구려 관 한쪽이 이상하지?'
		},
		nature: 'Unsung true main character: he does not bend the age the way Chunchu, Yeon, or Euija do, but he is the one the chronicle lets you stand beside — watching a sister die, watching a father invent a country, learning the war from the wrong end of the map, and finishing the sentence he stole as a child. Falls for Jayi at the harbour in a K-drama of rain and wrong sums; keeps the lesson that purple is a colour and the ocean is a country. Desire: a kingdom that includes the quay. Wound: Gotaso’s empty seat. Voice: earnest, slightly awkward, stubbornly kind.',
		arc: 'Chunchu’s story keeps one heir in focus — Bupmin — while brother Inmun stays mostly offstage in Tang. As a boy he takes the words “a king for all” into his own mouth. He watches Gotaso not come home. Under Marshal Yushin he joins the Hwarang — horse, bow, the Five Principles — then volunteers for a Gyebek-style countryside season as junior Pajinchan (Councillor of Ocean Trade) under Kim Seonpum, where he meets Jayi. He grows up in Chunchu’s shadow and Munhee’s packing lists. He inherits a half-won war and an alliance that wants the peninsula as furniture. He commands, waits, and finally expels the Tang — the road his father cleared as far as Baekje, walked to the end of Samhan on his own feet, with Jayi as queen and partner, not ornament.',
		blade: 'Ring-pommel sea-dragon sword — forged for a king who asked to become a dragon in the strait.',
		swordImage: '/sword_dragon.png',
		stages: [
			{
				id: 'prince',
				until: 661,
				name: 'Bupmin',
				korean: '법민',
				title: 'Prince of Silla',
				label: 'As Bupmin',
				avatar: '/ch_kim_bupmin.png'
			},
			{
				id: 'king',
				from: 661,
				name: 'King Munmu',
				korean: '문무왕',
				title: '30th sovereign of Silla',
				label: 'As King Munmu',
				avatar: '/ch_munmu.png'
			}
		],
		events: [
			{ year: 632, label: 'At six, claims the dream of a king for all.' },
			{ year: 642, label: 'Watches the house break when Gotaso dies.' },
			{ year: 643, label: 'Trains as Hwarang under Marshal Yushin.' },
			{ year: 644, label: 'Volunteers as junior Pajinchan; meets Jayi at the harbour.' },
			{ year: 661, label: 'Takes the throne, vowing to unify Samhan.' },
			{ year: 668, label: 'Pyongyang falls; Goguryeo ends.' },
			{ year: 676, label: 'Expels the Tang; becomes King of Samhan.' }
		],
		sobriquets: ['King for All', 'Dragon of the East Sea'],
		career: [
			{ title: 'Prince of Silla', korean: '왕자', org: 'sillaroyal', from: 632, to: 661 },
			{ title: 'Hwarang', korean: '화랑', hanja: '花郎', org: 'hwarang', from: 643, to: 661 },
			{ title: 'Junior Pajinchan', korean: '파진찬', hanja: '波珍飡', org: 'royalsecretariat', from: 644, to: 661, note: 'Councillor of Ocean Trade' },
			{ title: 'King Munmu', korean: '문무왕', hanja: '文武王', org: 'sillaroyal', from: 661, to: 676 },
			{ title: 'King of Samhan', korean: '삼한의 왕', org: 'sillaroyal', from: 676 }
		],
		aliases: ['King Munmu', 'Bupmin', 'Munmu', 'Dragon of the East Sea'],
		family: [
			{ id: 'jayi', role: 'Spouse' },
			{ id: 'chunchu', role: 'Father' },
			{ id: 'munhee', role: 'Mother' },
			{ id: 'inmun', role: 'Brother' }
		]
	},
	{
		id: 'jayi',
		avatar: '/ch_jayi.png',
		name: 'Queen Jayi',
		korean: '자의',
		hanja: '慈儀',
		title: 'Queen consort of King Munmu',
		kingdom: 'silla',
		born: 627,
		bornApprox: true,
		gender: 'f',
		clan: 'clan-gyeongju-kim',
		boneRank: 'True Bone (진골)',
		tagline: '“The ocean does not care what bone you were born with — only whether you can count.”',
		ideology: 'Harbour pragmatist',
		ideologyNote: 'True Bone who still believes ledgers outrank speeches; purple that has smelled salt.',
		quote: 'The ocean does not care what bone you were born with — only whether you can count.',
		firstLine: {
			en: 'Your sums are wrong. The tide does not care that you are a prince.',
			ko: '셈이 틀렸어요. 조수는 왕자인 걸 상관하지 않아요.'
		},
		lastLine: {
			en: 'Keep the harbour book open. A kingdom that cannot count will lose the sea twice.',
			ko: '항구 장부를 열어 두세요. 셈할 줄 모르는 나라는 바다를 두 번 잃어요.'
		},
		nature: 'Sharp, unimpressed, K-drama heroine energy without the helplessness: she steals brushes, vetoes bad arithmetic, and falls for Bupmin only after he stays for the tide book. Daughter of Pajinchan Kim Seonpum. Of all the series’ romances, theirs is the one that survives the war without becoming a tragedy or a joke — partnership as a second country.',
		arc: 'Meets Bupmin when Yushin posts him as temporary junior Councillor of Ocean Trade under her father. Rain, ledgers, almost-kisses, Seonpum’s cough from the warehouse shadow. Years later she sits as Munmu’s queen — still correcting his margins, still treating the realm as a tide table they keep together. Probably the most successful romance the chronicle allows.',
		binyeo: 'Gold wave binyeo — violet enamel in the curl, moonstone at the throat; a harbour pin that never learns court stillness.',
		binyeoImage: '/bn_jayi.png',
		events: [
			{ year: 644, label: 'Meets Bupmin over ocean ledgers at the quay.' },
			{ year: 661, label: 'Becomes queen consort when Bupmin takes the throne.' },
			{ year: 676, label: 'Stands with Munmu as King of Samhan — harbour lesson crowned.' }
		],
		career: [
			{ title: 'Queen consort', korean: '왕후', hanja: '王后', org: 'sillaroyal', from: 661 }
		],
		aliases: ['Queen Jayi', 'Jayi', '자의', 'Jaeui', 'Queen Jaeui', '자이']
	},
	{
		id: 'seonpum',
		avatar: '/ch_kim_sunpum.png',
		name: 'Kim Seonpum',
		korean: '김선품',
		hanja: '金善品',
		title: 'Pajinchan — Councillor of Ocean Trade (파진찬)',
		kingdom: 'silla',
		born: 590,
		bornApprox: true,
		gender: 'm',
		clan: 'clan-gyeongju-kim',
		boneRank: 'True Bone (진골)',
		tagline: 'Fourth of seventeen — purple sleeve, harbour dirt, Jayi’s father.',
		ideology: 'Maritime True Bone',
		ideologyNote: 'Holds Pajinchan as craft: ocean trade under a caste that pretends commerce is beneath purple.',
		quote: 'Do not swagger. The sailors can smell swagger over salt.',
		nature: 'True Bone who actually works the quay. Hosts Bupmin’s voluntary countryside season without mistaking it for picnic. Loves his daughter enough to chaperone weather.',
		arc: 'Sitting Councillor of Ocean Trade (파진찬, 波珍飡) when Marshal Yushin attaches Prince Bupmin as junior under him. Watches a prince learn tide tables and a daughter learn a wrong number worth reading.',
		blade: 'Ring-pommel harbour knife — more ledger-weight than parade.',
		events: [
			{ year: 644, label: 'Hosts Bupmin as junior Pajinchan; Jayi keeps the inkstones.' }
		],
		career: [
			{ title: 'Councillor of Ocean Trade', korean: '파진찬', hanja: '波珍飡', org: 'royalsecretariat', from: 644 }
		],
		aliases: [
			'Kim Seonpum',
			'Seonpum',
			'선품',
			'Pajinchan',
			'파진찬',
			'Councillor of Ocean Trade',
			'波珍飡'
		]
	},
	{
		id: 'jukji',
		gender: 'm',
		name: 'Kim Jukji',
		korean: '김죽지',
		hanja: '金竹旨',
		title: 'First Royal Secretary (시중) of the Royal Secretariat',
		kingdom: 'silla',
		born: 620,
		bornApprox: true,
		clan: 'clan-gyeongju-kim',
		avatar: '/ch_jukji.png',
		tagline: 'True Bone Hwarang of Class 74 — Pumsuk’s cohort; later the first 시중.',
		ideology: 'Technocratic reformer',
		ideologyNote: 'Secretariat craft — implements westernizing speed as office work, not sermon.',
		quote: 'The Council still meets. The seals no longer wait for it.',
		nature: 'Young enough to think a new office is elegant; old enough in the yard to know elegance is a weapon. Loyal to Chunchu the way a Hwarang is loyal to a form — precisely, without needing to be asked twice. Yes-Minister fluency: preserves the Premier’s chair while emptying it of consequences.',
		blade: 'Ring-pommel bamboo sword — light, fast, named for the virtue of bending without breaking.',
		events: [
			{ year: 651, label: 'Named first Royal Secretary (시중) of the Royal Secretariat (집사부).' },
			{ year: 654, label: 'Keeps the seals moving under King Muyeol.' }
		],
		career: [
			{ title: 'Hwarang', korean: '화랑', hanja: '花郎', org: 'hwarang', from: 635, to: 651 },
			{ title: 'Royal Secretary', korean: '시중', hanja: '侍中', org: 'royalsecretariat', from: 651 }
		],
		aliases: [
			'Kim Jukji',
			'Jukji',
			'Jukjirang',
			'죽지',
			'죽지랑',
			'竹旨',
			'竹旨郞',
			'Royal Secretary Jukji',
			'Royal Secretary',
			'시중',
			'侍中'
		]
	},
	{
		id: 'haesang',
		gender: 'm',
		name: 'Haesang',
		korean: '해상',
		title: 'Silla merchant of the southern roads',
		kingdom: 'silla',
		tagline: 'Brings the horizon home — spices, scriptures, and stories told without swagger.',
		ideology: 'Cosmopolitan merchant',
		ideologyNote: 'Soft globalism of harbours; learns from every shore without renaming home the West.',
		quote: 'I sell what the road allows. I tell what the road taught me.',
		nature: 'A recurring face in Surabol markets and harbour inns: respectful of every shore he names — Funan’s harbours, the Ganges ports, Sogdian caravans, Persian glass. Never a lecture; always a tale with the salt still on it. Ordinary people like him. Nobles pretend they do not listen, and listen.',
		events: [
			{ label: 'Trades through Danghang toward the southern seas.' },
			{ label: 'Carries news of India, the steppe roads, and the western markets — carefully, as guest.' }
		],
		aliases: ['Haesang', 'the merchant', 'Merchant Haesang', '해상']
	},
	{
		id: 'bidam',
		gender: 'm',
		avatar: '/ch_bidam.png',
		name: 'Bidam',
		korean: '비담',
		title: 'Premier (상대등) of Silla',
		kingdom: 'silla',
		born: 594,
		died: 647,
		bornApprox: true,
		clan: 'clan-surabol-son',
		tagline: '“If only three of the Sacred Bone remain, then I choose the cleverest of the three.”',
		ideology: 'Radical nativist',
		ideologyNote: 'Blood-and-soil for 삼한 — both Kim lines are imports; the Founding Six had no Kim; opposes Tang-shaped Secretariat and sinicization through courtesy, not rant. Once the liberal who crowned Sunduk and shielded Gaya-blood Yushin; curdles in public — grievance as patriotism, colonizer panic, charm that turns ugly between sips of tea. Genius and charisma never leave him; that is what makes the spiral dangerous. Debates over tea like a salon; dies still charming.',
		quote: 'If only three of the Sacred Bone remain, then I choose the cleverest of the three.',
		firstLine: {
			en: 'My lords keep repeating the one word — “woman.” I have known Princess Dukman since I was a boy.',
			ko: '여러분께서는 “여자”라는 한 단어만 되뇌십니다. 나는 소년 시절부터 덕만공주를 압니다.'
		},
		lastLine: {
			en: 'Hwarang Kim Yushin…',
			ko: '화랑 김유신…'
		},
		nature:
			'Born to one of Surabol’s oldest houses — the chronicle never states, only implies, descent from Gurema of the Surabol Son clan and the Musan hall the Founding Six raised. Aristocratic gentleman: proper titles, tea poured before the barb lands, almost flirtatious composure under the black robe. Oldest of the three Hwarang classmates — then Yushin, then Alchun, a year apart; all three once orbited Princess Dukman. Yard score never leaves 108–108 with Yushin — effort against birthright, and he feels owed. Once the most liberal True Bone — crowned the woman king, shielded Gaya-blood Yushin from nativist bullying — he spirals in public view: grievance dressed as patriotism, “they’re colonizing us,” charming one moment and ugly the next. Self-aware enough to hear the irony; genius and charisma never leave him — that is what makes it dangerous. Loves the sacred country badly. Weaponizes heritage against Yushin at Radiance: “Blood is inevitable.” Dies smiling at the name he first traded as a boy.',
		arc: 'In 632 he crowns Dukman with a speech about cleverness. In 636 he and Alchun break King Mu’s spies at Jade Gate Valley (옥문곡). In 645 he alone blocks Seungman while Supum holds the premier’s chair. In 647 he spends ten days at Radiance with Yumjong — morning tabletop debates with Yushin before the armies fight, youth flashbacks, star omen — the liberal curdling into blood-and-soil between cups of tea. On the fifth morning he tells Yushin 피는 못 속인다 — blood is inevitable — weaponizing Gaya/Heo heritage; on the tenth day Yushin finishes the count at one hundred and nine. Last mortal words: “Hwarang Kim Yushin…” Yushin will whisper the same line back when he orders the annihilation of Bidam’s house.',
		blade: 'Ring-pommel heavenly-horse sword — white horse rearing on the pommel, old-hall steel.',
		swordImage: '/sword_horse.png',
		stages: [
			{
				id: 'hwarang',
				until: 632,
				label: 'As Hwarang',
				avatar: '/ch_bidam_hwarang.png'
			},
			{
				id: 'young',
				from: 632,
				until: 645,
				label: 'As councillor',
				avatar: '/ch_bidam.png'
			},
			{
				id: 'elder',
				from: 645,
				label: 'In his last years',
				avatar: '/ch_bidam_old.png'
			}
		],
		events: [
			{ year: 632, label: 'Turns 3:3 into 6:0 — Silla’s first woman king.' },
			{ year: 636, label: 'With Alchun, breaks Baekje spies at Jade Gate Valley (옥문곡).' },
			{ year: 645, label: 'Alone blocks Seungman as successor — Supum holds the premier’s chair.' },
			{ year: 647, label: 'Ten-day rebellion at Radiance; tells Yushin 피는 못 속인다; dies — “Hwarang Kim Yushin…”' }
		],
		sobriquets: [
			'Second Blade of Samhan',
			'Second Blade',
			'삼한제이검',
			'Spear of Silla',
			'Long Blade of Silla',
			'신라의 장검',
			'Black-Robed Gentleman',
			'흑의군자',
			'Legend of the Hwarang'
		],
		career: [
			{ title: 'Hwarang disciple', korean: '낭도', hanja: '郎徒', org: 'hwarang', from: 610, to: 613 },
			{ title: 'Hwarang', korean: '화랑', hanja: '花郎', org: 'hwarang', from: 613, to: 645 },
			{ title: 'Councillor', korean: '대등', hanja: '大等', org: 'harmonycouncil', from: 632, to: 647 }
		],
		aliases: [
			'Councillor Bidam',
			'Bidam',
			'Second Blade of Samhan',
			'The Second Blade of Samhan',
			'Second Blade',
			'삼한제이검',
			'Spear of Silla',
			'Long Blade of Silla',
			'신라의 장검',
			'Black-Robed Gentleman',
			'흑의군자',
			'Legend of the Hwarang'
		]
	},
	{
		id: 'gotaso',
		avatar: '/ch_gotaso.png',
		name: 'Gotaso',
		korean: '고타소',
		kingdom: 'silla',
		gender: 'f',
		born: 625,
		died: 642,
		bornApprox: true,
		clan: 'clan-gyeongju-kim',
		boneRank: 'True Bone (진골)',
		tagline: 'A love-obsessed girl of sixteen. Her father would burn kingdoms to bring her home.',
		ideology: 'Frontier romantic',
		ideologyNote: 'Love and border fort as the same risk; no doctrine survives Daeya.',
		quote: "Forever is a promise you keep in one season.",
		arc: 'She falls the way teenagers fall — completely, loudly, without a second thought. When she is taken, Chunchu goes quiet. When she marries, she believes in forever. Daeya ends both.',
		binyeo: 'Gilt butterfly binyeo — pink bead in the wings, amber at the bud-tip; a girl’s first grown-up pin, packed for a border fort.',
		binyeoImage: '/bn_gotaso.png',
		events: [
			{ year: 641, label: 'Taken; rescued; marries Pumsuk; moves to Daeya.' },
			{ year: 642, label: 'Dies when Daeya falls.' }
		],
		aliases: ['Princess Gotaso', 'Gotaso']
	},
	{
		id: 'pumsuk',
		gender: 'm',
		avatar: '/ch_pumsuk.png',
		name: 'Kim Pumsuk',
		korean: '김품석',
		title: 'Guardian of Daeya Fortress',
		kingdom: 'silla',
		born: 618,
		died: 642,
		bornApprox: true,
		clan: 'clan-gyeongju-kim',
		tagline: 'A Surabol noble boy — still startled by a woman who isn’t.',
		ideology: 'Aristocratic Hwarang',
		ideologyNote: 'True Bone honour culture — the yard before any doctrine.',
		quote: "A fortress falls from the inside first.",
		arc: 'Capital-bred, True Bone, given a fortress for his rank. Gotaso loves him with her whole chest. At Daeya he meets Gumil’s wife and discovers how little of the world Surabol prepared him for.',
		blade: 'Ring-pommel parade sword — fox on the gilt pommel, never blooded until the wrong night.',
		swordImage: '/sword_fox.png',
		events: [
			{ year: 641, label: 'Marries Gotaso, swearing to protect her with his life.' },
			{ year: 642, label: 'Loses Daeya after betrayal; kills his wife and himself.' }
		],
		career: [
			{ title: 'Hwarang', korean: '화랑', hanja: '花郎', org: 'hwarang', from: 633, to: 641 },
			{ title: 'Guardian of Daeya', korean: '대야성주', from: 641 }
		],
		aliases: ['Hwarang Pumsuk', 'Kim Pumsuk', 'Pumsuk']
	},
	{
		id: 'gumil',
		name: 'Gumil',
		korean: '검일',
		avatar: '/ch_gumil.png',
		kingdom: 'silla',
		died: 660,
		gender: 'm',
		boneRank: '4-dupum (yellow sleeve)',
		tagline: 'Yellow-sleeve border officer — caste fury that opened Daeya’s gates.',
		quote: "Say “True Bone” and the heavens part. Say yellow robe and they send you west to die.",
		arc: 'Posted to Samhan’s most dangerous border because bone rank sends yellow there. Humiliated by purple Pumsuk over his own wife, he betrays Daeya to Baekje — private injury plus caste hate. Muyeol executes him at Sabi eighteen years later.',
		events: [
			{ year: 642, label: 'Betrays Daeya Fortress with Mochuk.' },
			{ year: 660, label: 'Executed by King Muyeol.' }
		],
		career: [
			{ title: 'Border officer', korean: '변방장교', from: 642, to: 660, note: '4-dupum yellow sleeve' }
		],
		aliases: ['Gumil', 'Geomil', '검일']
	},
	{
		id: 'mochuk',
		name: 'Mochuk',
		korean: '모척',
		kingdom: 'silla',
		died: 660,
		gender: 'm',
		boneRank: '4-dupum (yellow sleeve)',
		tagline: 'Gumil’s fellow yellow-sleeve at Daeya — treason as the only promotion left.',
		quote: "Treason is only treason if you lose.",
		aliases: ['Mochuk']
	},
	{
		id: 'daeya_a',
		name: 'Daeya Garrison Man',
		korean: '대야 병사',
		kingdom: 'silla',
		gender: 'm',
		boneRank: '4-dupum (yellow sleeve)',
		tagline: 'Yellow robe, trash posting — the wall under True Bone toys.',
		quote: 'Bone rank is a joke told with our ribs.',
		arc: 'Lowest head ranks posted to Daeya because purple does not post itself to die. Speaks the caste system the capital prefers to leave in dye manuals.',
		aliases: ['Daeya Garrison Man', 'Daeya soldier']
	},
	{
		id: 'daeya_b',
		name: 'Daeya Wall Guard',
		korean: '대야 수비',
		kingdom: 'silla',
		gender: 'm',
		boneRank: '4-dupum (yellow sleeve)',
		tagline: 'Counts graves the Harmony Council never minutes.',
		quote: 'Out here bone rank decides which arrow finds you first.',
		aliases: ['Daeya Wall Guard']
	},
	{
		id: 'inmun',
		name: 'Kim Inmun',
		korean: '김인문',
		hanja: '金仁問',
		kingdom: 'silla',
		born: 629,
		died: 694,
		gender: 'm',
		clan: 'clan-gyeongju-kim',
		boneRank: 'True Bone (진골)',
		tagline: 'Chunchu’s other son — present in Tang, mostly absent from the page on purpose.',
		ideology: 'Hostage-diplomat',
		ideologyNote: 'Living hinge to the West; westernization as bilingual daily life in Chang’an.',
		quote: 'Become necessary, or become forgotten.',
		nature: 'Second-son diplomacy with a first-son’s polish: learns rooms by listening, not by claiming them. Desire: to remain useful enough that Chang’an cannot misplace him. Wound: the chronicle that follows Bupmin home and leaves him in the West. Voice: careful, bilingual, rarely first.',
		arc: 'Where Chunchu’s story keeps one heir in focus — Bupmin — Inmun is the deliberate offstage: hostage, envoy, and long-serving hinge in Tang. He stays in Chang’an on and off for life; the page visits him only when the West must answer. Absent-by-design, not forgotten — the second son who makes the alliance breathe while his brother learns to rule.',
		events: [
			{ year: 632, label: 'A toddler in Munhee’s rooms while Surabol crowns a queen.' },
			{ year: 648, label: 'Left in Chang’an as the living hinge of the Silla–Tang alliance.' },
			{ year: 661, label: 'Still west when Bupmin takes the throne.' }
		],
		family: [
			{ id: 'chunchu', role: 'Father' },
			{ id: 'munhee', role: 'Mother' },
			{ id: 'munmu', role: 'Brother' }
		],
		career: [
			{ title: 'Hostage-envoy', korean: '인질사신', from: 648, note: 'Chang’an hinge of the alliance' }
		],
		aliases: ['Kim Inmun', 'Inmun', '김인문']
	},
	{
		id: 'alchun',
		gender: 'm',
		avatar: '/ch_alchun.png',
		name: 'Alchun',
		korean: '알천',
		title: 'Councillor (대등) of Silla',
		kingdom: 'silla',
		born: 596,
		bornApprox: true,
		clan: 'clan-surabol-choi',
		tagline: '“Why is it always the most ignorant in a country who shout loudest that it is the greatest…”',
		ideology: 'Liberal reformer',
		ideologyNote: 'Open to women on thrones and stolen Tuesdays; modernization without Bidam’s purity test.',
		quote: 'Judge what is best for the divine nation.',
		firstLine: {
			en: 'Below all of them are the slaves — but those are not counted as people.',
			ko: '그 아래는 모두 노비 — 그러나 사람은 세지 않는다.'
		},
		lastLine: {
			en: 'The age of Kim Chunchu begins.',
			ko: '김춘추의 시대가 시작된다.'
		},
		nature: 'Descended from Sobuldori of the Surabol Choi — Dolsan Goheo-chon, Saryang-bu — though he cites the founder only when pressed, and never in a speech. Stuck between Bidam and Yushin since the Hwarang yard — same line, same impossible orbit around Dukman. At Okmun-gok he and Bidam still fight as one; by Radiance he answers both with hard counsel and still raises neither blade nor banner — and neutrality costs him a generation of standing.',
		arc: 'Hwarang with Bidam and Yushin; tiger-catcher of the Council; victor with Bidam at Jade Gate Valley (옥문곡, 636) against King Mu’s spies. In 647 he is summoned to both camps before noon: he tells Yushin not to be blinded by the princess they all loved as boys, tells Bidam that arms against the crown are highest treason — then raises neither blade nor banner for ten days. After Bidam falls, the minutes file him under Neither. Later he laughs the last holdout down so Chunchu can take the throne rather than wear a crown built on that silence.',
		events: [
			{ year: 636, label: 'With Bidam, destroys Baekje spies at Jade Gate Valley (옥문곡).' },
			{
				year: 647,
				label: 'Counsels both camps at Radiance; loses standing for neutrality.'
			},
			{ year: 654, label: 'Laughs down the last holdout; the age of Kim Chunchu begins.' }
		],

		sobriquets: [
			'the tiger-catcher',
			'호랑이도 잡는 알천',
			'호랑이도 잡는'
		],
		career: [
			{ title: 'Hwarang disciple', korean: '낭도', hanja: '郎徒', org: 'hwarang', from: 610, to: 613 },
			{ title: 'Hwarang', korean: '화랑', hanja: '花郎', org: 'hwarang', from: 613, to: 632 },
			{ title: 'Councillor', korean: '대등', hanja: '大等', org: 'harmonycouncil', from: 632, to: 654 }
		],
		aliases: [
			'Alchun',
			'the tiger-catcher',
			'tiger-catcher',
			'호랑이도 잡는 알천',
			'호랑이도 잡는'
		]
	},

	// ————————————————————————— supporting cast (researched) —————————————————————————
	{
		id: 'ongunhae',
		gender: 'm',
		avatar: '/ch_on_gunhae.png',
		name: 'On Gunhae',
		korean: '온군해',
		hanja: '溫君解',
		title: 'Attendant of Kim Chunchu — posthumous Daeachan',
		kingdom: 'silla',
		died: 649,
		boneRank: 'True Bone (진골)',
		tagline: 'He sat in the high cap so the small boat could leave.',
		quote: 'Then I will wear it.',
		firstLine: {
			en: 'My lord. The small boat.',
			ko: '공께서는 작은 배로.'
		},
		lastLine: {
			en: 'Then I will wear it.',
			ko: '그래서 제가 씁니다.'
		},
		nature: 'A retainer who does not require a second instruction. Speaks in objects — cap, coat, the smaller boat — and stops there. The annal keeps almost nothing else.',
		arc: 'He follows Kim Chunchu into Tang and, on the Yellow Sea road home, puts on the high cap and great coat so Goguryeo’s patrol will take the wrong man. They kill him. Chunchu reaches Silla in a small boat. Queen Jinduk posthumously names him Daeachan and pays his descendants. The histories guess True Bone from that rank; they record no other deed.',
		events: [
			{ year: 648, label: 'Attends Chunchu’s Tang embassy.' },
			{ year: 649, label: 'Dies as Chunchu’s decoy on a Goguryeo patrol ship; named Daeachan posthumously.' }
		],
		career: [
			{ title: 'Attendant', korean: '수행', hanja: '隨行', note: 'Tang embassy', from: 648, to: 649 },
			{ title: 'Daeachan (posthumous)', korean: '대아찬', hanja: '大阿飡', from: 649 }
		],
		aliases: [
			'On Gunhae',
			'Gunhae',
			'온군해',
			'溫君解',
			'Ongunhae'
		]
	},
	{
		id: 'ladyye',
		avatar: '/ch_lady_ye.png',
		name: 'Lady Ye',
		korean: '예씨부인',
		kingdom: 'goguryeo',
		gender: 'f',
		tagline: 'Jumong’s first wife, who raised his heir alone in Buyeo.',
		quote: "A broken sword can still raise a king.",
		binyeo: 'Plain horn binyeo — Buyeo winter-cut; she raised a king on half a sword and less gold.',
		aliases: ['Lady Ye']
	},
	{
		id: 'yuri',
		gender: 'm',
		avatar: '/ch_yuri.png',
		name: 'King Yuri',
		korean: '유리왕',
		hanja: '琉璃王',
		godTier: 'demigod',
		kingdom: 'goguryeo',
		clan: 'clan-go',
		died: 18,
		tagline: 'Demigod-touched heir — found the broken sword, took his father’s throne.',
		quote: "What a father hides, a son digs up.",
		events: [{ year: -19, label: 'Succeeds Jumong; Onjo and Biryu go south.' }],
		career: [
			{ title: 'King of Goryeo', korean: '왕', hanja: '王', org: 'nation-goguryeo', from: -19 }
		],
		aliases: ['King Yuri']
	},
	{
		id: 'gumilwife',
		avatar: '/ch_gumil_wife.png',
		name: 'Gumil’s Wife',
		korean: '검일의 아내',
		kingdom: 'silla',
		gender: 'f',
		tagline: 'A commoner woman at a border feast — and the spark that burns down three kingdoms.',
		quote: "A half is still more than mine would ever be.",
		arc: 'She has no name in the histories and no rank worth recording, which is precisely the point. A drunk True Bone takes her because he can; her husband opens the gates of Daeya in return. Everything that follows — Gotaso’s death, Chunchu’s revenge, the Tang alliance, the fall of Baekje and Goryeo — runs back through a woman the system did not consider a person.',
		binyeo: 'Wood-sprig binyeo — gnarled branch, leaf and gold bud; cheap timber, clever seduction without court gold.',
		binyeoImage: '/bn_gumil_wife.png',
		events: [{ year: 642, label: 'Taken by Pumsuk at the Daeya feast; her husband betrays the fortress.' }],
		aliases: ['Gumil’s wife', 'Geomil’s wife']
	},
	{
		id: 'queensatek',
		avatar: '/ch_satek_queen.png',
		name: 'Queen Satek',
		korean: '사택왕후',
		kingdom: 'baekje',
		gender: 'f',
		died: 655,
		clan: 'clan-satek',
		clans: ['clan-buyeo'],
		clanBy: { 'clan-buyeo': 'marriage' },
		title: 'Queen consort — Euija’s mother',
		tagline: 'Euija’s mother — the Satek sleeve on the throne until mourning cuts it.',
		quote: "Mourning can still be a faction.",
		arc: 'Euija’s mother, not a Satek minister. While she lived, Minister Satek’s house had the king’s ear through the queen herself. Her death in 655 releases Euija — and begins the purge that hollows out his court. She is not Elder Satek and not Minister Satek; she is the reason that house could whisper without shouting.',
		binyeo: 'Black-pearl binyeo — wharf-wealth worn at the throne’s ear; the sleeve in miniature.',
		events: [{ year: 655, label: 'Dies; Euija enters mourning, and the Satek fear what comes after.' }],
		family: [{ id: 'euija', role: 'Son' }],
		career: [
			{ title: 'Queen consort', korean: '왕후', hanja: '王后', org: 'nation-baekje', to: 655 }
		],
		aliases: ['Queen Satek', '사택왕후', 'Euija’s mother']
	},
	{
		id: 'eldersatek',
		avatar: '/ch_satek_elder.png',
		name: 'Elder Satek',
		korean: '사택적덕',
		hanja: '沙宅積德',
		title: 'Senior Minister (좌평) — the house elder',
		kingdom: 'baekje',
		gender: 'm',
		clan: 'clan-satek',
		tagline: 'The Satek house-head — berths, four generations, and a veto that sounds like weather.',
		quote: 'Blood cools. A winter anchorage does not.',
		nature: 'Not a cardboard clan elder: a patient accountant of berths who smiles like ceremony and vetoes like weather. Treats Elder Yunbi as weather too — inevitable, inconvenient, useful. Personal name Satek Jukduk — never “Jeokdeok.”',
		arc: '“Elder Satek” in the street mouth; Satek Jukduk in the minutes. He is the house-head who sits across from Elder Yunbi at the monastery truce — four generations of harbour arithmetic, not the Prime Minister’s chair. That chair belongs to his kinsman Minister Satek (Jijuk). He surprises his own side with a levy veto, counts Yunbi footsteps behind monastery screens, and discovers too late that a king who sits forty-one sons in clan chairs does not need a house elder anymore.',
		events: [
			{ year: 632, label: 'House-head of Satek; Queen Satek is Euija’s mother from this sleeve.' },
			{ year: 655, label: 'Night truce with Elder Yunbi while Minister Satek holds the seal.' },
			{ year: 655, label: 'Euija finishes mourning furious; the house is already ash.' }
		],
		career: [
			{ title: 'Senior Minister', korean: '좌평', hanja: '佐平', org: 'ministersassembly', from: 632, to: 655 }
		],
		aliases: [
			'Elder Satek',
			'Satek Jukduk',
			'Jukduk',
			'Satek Jeokdeok',
			'Jeokdeok',
			'Lord Satek',
			'사택적덕',
			'사택 원로'
		]
	},
	{
		id: 'ministersatek',
		avatar: '/ch_satek_minister.png',
		name: 'Minister Satek',
		korean: '사택지적',
		hanja: '沙宅智積',
		title: 'Prime Minister (상좌평) — the political Satek',
		kingdom: 'baekje',
		gender: 'm',
		clan: 'clan-satek',
		tagline: 'Elder Satek’s kinsman — sleeve, seal, and the Assembly’s borrowed stamp.',
		quote: 'Things without a price get removed.',
		nature: 'Practical cruelty dressed as housekeeping. Speaks in short sentences so nobody can quote him beautifully later. Personal name Satek Jijuk.',
		arc: 'While Elder Satek plays memory and majority at the monastery table, Minister Satek (Jijuk) holds the Prime Minister’s chair and the borrowed royal seal. He stamps ship passes, prices exile berths, names Gyebek “the one with no house,” and — while Euija is sealed in mourning — reads the Assembly’s exile order that ships Gyebek to Tamla. After the coup he is furniture Euija no longer needs — a Satek who mistook the seal for a spine.',
		events: [
			{ year: 632, label: 'Prime Minister (상좌평) for the Satek house.' },
			{ year: 655, label: 'Reads the sealed exile order over Gyebek while Euija mourns.' },
			{ year: 655, label: 'Swept from the Assembly when Euija seats his sons.' }
		],
		career: [
			{ title: 'Prime Minister', korean: '상좌평', hanja: '上佐平', org: 'ministersassembly', from: 632, to: 655 }
		],
		aliases: [
			'Minister Satek',
			'Satek Jijuk',
			'Jijuk',
			'Satek Jijeok',
			'Jijeok',
			'Prime Minister Satek',
			'사택지적',
			'사택 재상'
		]
	},
	{
		id: 'sateksondung',
		name: 'Satek Sondeung',
		korean: '사택손등',
		hanja: '沙宅孫登',
		kingdom: 'baekje',
		gender: 'm',
		clan: 'clan-satek',
		tagline: 'The wall-climbing cousin — street volume for a house that pretends it only votes.',
		quote: 'Tonight we go over their wall. Tomorrow they call it politics.',
		nature: 'Young enough to enjoy lantern-festival scores; old enough to know Elder Satek will deny him in the Assembly and thank him in the counting-room.',
		arc: 'Third named Satek of the Euija years: not the sleeve (Minister Satek), not the house-head (Elder Satek), but the cousin who turns carts and climbs walls so the house can look shocked at Deer Rock. Lady Yunbi knows his footsteps by the roof-tiles. After 655 he has nowhere to climb that is not already occupied by a prince.',
		events: [
			{ year: 632, label: 'Street feud with Yunbi boys at the west bridge.' },
			{ year: 655, label: 'Watches Chunbok take the chair his elders lost.' }
		],
		career: [
			{ title: 'Junior Minister', korean: '달솔', hanja: '達率', org: 'ministersassembly', from: 632, to: 655 }
		],
		aliases: ['Satek Sondeung', 'Sondeung', '사택손등']
	},
	{
		id: 'elderyunbi',
		avatar: '/ch_yunbi_elder.png',
		name: 'Elder Yunbi',
		korean: '연비문진',
		hanja: '燕比文進',
		title: 'Senior Minister — coast road and salt quiet',
		kingdom: 'baekje',
		gender: 'm',
		clan: 'clan-yunbi',
		tagline: 'Four hundred years in — still called a guest; still holding the arm, not the sleeve.',
		quote: 'We do not hold the sleeve. We hold the arm.',
		nature: 'Dry, northern-proud, allergic to Satek theatre. Counts nephews the way other men count berths.',
		arc: 'The political Yunbi of the Euija era — “Elder Yunbi” when Satek needs an insult, Munjin when the Assembly needs a majority. Holds the coast road from Sabi to the salt; answers Elder Satek’s sleeve-talk with arm-talk; buries nephews after lantern festivals and still sits down for a night truce when forty-one royal sons threaten every chair.',
		events: [
			{ year: 632, label: 'Four-generation feud with Satek already in full voice.' },
			{ year: 655, label: 'Truces with Elder Satek to remove Gyebek — too late to save the chairs.' }
		],
		career: [
			{ title: 'Senior Minister', korean: '좌평', hanja: '佐平', org: 'ministersassembly', from: 632, to: 655 }
		],
		aliases: [
			'Yunbi Munjin',
			'Munjin',
			'Elder Yunbi',
			'Lord Yunbi',
			'Yunbi',
			'the Yunbi',
			'연비문진',
			'연비 원로'
		]
	},
	{
		id: 'yunbihana',
		avatar: '/ch_yunbi_lady.png',
		name: 'Lady Yunbi',
		korean: '연비한아',
		hanja: '燕比翰娥',
		kingdom: 'baekje',
		gender: 'f',
		clan: 'clan-yunbi',
		tagline: 'House-proud, sharp-tongued — the feud’s best memory and worst manners.',
		quote: 'Your sleeve is wet. Ours is salt. Guess which lasts.',
		nature: 'Not Eight-Clans cardboard: invents insults the way Satek invents majorities. Loves her house louder than she loves peace; respects competence even in a Satek if it arrives without poetry. Personal name Yunbi Hana.',
		arc: 'Fictional daughter-niece of Elder Yunbi’s hall — featured opposite Elder Satek’s cousins in the Euija-era street and wharf wars. Keeps score of overturned carts, stolen clerks, and which Satek boy climbed which wall. When Euija seats his sons, she is the first Yunbi voice to say the feud was never the real enemy — and the last to stop glaring at Sondeung across a emptied Assembly aisle.',
		binyeo: 'Coast-iron binyeo — salt-dark metal, no court pearl.',
		events: [
			{ year: 632, label: 'Trades barbs with Satek Sondeung over a west-bridge cart.' },
			{ year: 655, label: 'Watches the chairs empty; keeps the feud’s ledger anyway.' }
		],
		career: [
			{ title: 'Junior Minister', korean: '달솔', hanja: '達率', org: 'ministersassembly', from: 632, to: 655 }
		],
		aliases: ['Lady Yunbi', 'Yunbi Hana', 'Hana', '연비한아']
	},
	{
		id: 'ladysatek',
		avatar: '/ch_satek_lady.png',
		name: 'Lady Satek',
		korean: '사택한아',
		hanja: '沙宅翰娥',
		kingdom: 'baekje',
		gender: 'f',
		clan: 'clan-satek',
		tagline: 'Harbour pride in a red sleeve — the feud’s sharpest niece.',
		quote: 'Our berth. Your apology. In that order.',
		nature: 'Younger-house Satek: not the queen-consort sleeve, not the Prime Minister’s seal — the niece who keeps score on the wharf. Sharp tongue, faster memory.',
		arc: 'Fictional counterpart to Lady Yunbi on the Satek side — featured in the Euija-era street wars opposite Yunbi Hana. Turns over carts with Sondeung, trades insults across the west bridge, and still shows up when Elder Satek needs a face the Assembly cannot pretend is furniture.',
		binyeo: 'Wharf-iron binyeo — berth-nail metal, no court pearl.',
		events: [
			{ year: 632, label: 'Feud with Lady Yunbi over a west-bridge cart.' },
			{ year: 655, label: 'Watches the chairs empty; keeps the house ledger anyway.' }
		],
		career: [
			{ title: 'Junior Minister', korean: '달솔', hanja: '達率', org: 'ministersassembly', from: 632, to: 655 }
		],
		aliases: ['Lady Satek', 'Satek Hana', '사택한아', '沙宅翰娥']
	},
	{
		id: 'ministeryunbi',
		avatar: '/ch_yunbi_minister.png',
		name: 'Minister Yunbi',
		korean: '연비지적',
		hanja: '燕比智積',
		title: 'Prime Minister (상좌평) — the political Yunbi',
		kingdom: 'baekje',
		gender: 'm',
		clan: 'clan-yunbi',
		tagline: 'Coast-road Premier — salt arithmetic against Satek theatre.',
		quote: 'The sleeve is wet. The ledger is not.',
		nature: 'Elder Yunbi’s kinsman who holds the Prime Minister’s chair when the coast house wins a majority — dry, northern-proud, allergic to harbour poetry.',
		arc: 'While Elder Yunbi counts nephews and truces at monastery tables, Minister Yunbi (Jijuk of the Yunbi line) holds 상좌평 when the Assembly tilts north. He stamps salt passes, prices berths, and treats Minister Satek’s seal like weather — inevitable, inconvenient, negotiable until Euija seats forty-one sons and both Premiers become furniture.',
		events: [
			{ year: 632, label: 'Prime Minister (상좌평) when the Yunbi house holds the aisle.' },
			{ year: 655, label: 'Swept when Euija seats his sons in every chair.' }
		],
		career: [
			{ title: 'Prime Minister', korean: '상좌평', hanja: '上佐平', org: 'ministersassembly', from: 632, to: 655 }
		],
		aliases: ['Minister Yunbi', 'Yunbi Jijuk', '연비지적', '燕比智積']
	},
	{
		id: 'ungo',
		avatar: '/ch_eungo.png',
		name: 'Queen Eungo',
		korean: '웅고왕후',
		kingdom: 'baekje',
		gender: 'f',
		clan: 'Royal consort faction (not Eight-Clan)',
		tagline: 'Euija’s wife, Hyo’s mother — consort rooms against the Satek sleeve.',
		quote: 'A crown prince is not a eldest son. He is a choice.',
		nature: 'Quiet where Queen Satek was faction; political where a court maid is only warmth. Not Jinmo or Yunbi furniture — a royal-consort faction that moves without an Eight-Clan crest. Loves Hyo without apologising for the love looking like policy.',
		arc: 'Mother of Prince Hyo — third of Euija’s five important sons. Whispers what Euija already fears: Yung has grown too used to Satek tutors, Satek berths, Satek inevitability. When Euija swaps the crown-prince mark from Yung to Hyo, Eungo does not cheer in public — she only stops looking afraid of the sleeve.',
		binyeo: 'Pale jade court pin — soft light, hard decision.',
		events: [
			{ year: 655, label: 'Hyo named crown prince; Yung’s faction tastes the cut.' }
		],
		family: [
			{ id: 'euija', role: 'Spouse' },
			{ id: 'hyo', role: 'Son' }
		],
		career: [
			{ title: 'Queen consort', korean: '왕후', hanja: '王后', org: 'nation-baekje' }
		],
		aliases: ['Queen Eungo', 'Eungo', 'Queen Ungo', 'Ungo', 'Ungyo', 'Queen Ungyo', '웅고', '웅고왕후']
	},
	{
		id: 'hyo',
		name: 'Prince Hyo',
		korean: '부여효',
		kingdom: 'baekje',
		born: 617,
		bornApprox: true,
		gender: 'm',
		avatar: '/ch_hyo.png',
		clan: 'clan-buyeo',
		tagline: 'Third of the five — crown prince via Eungo’s rooms, not an Eight-Clan sleeve.',
		quote: 'I did not take the mark. Father moved it.',
		nature: 'Younger-son carefulness with a sudden target on his back. Mother’s faction is royal-consort, not Satek or Jinmo — which is exactly why Euija moves the mark to him. Wants to be worthy without sounding like he asked.',
		arc: 'Third among Euija’s five important princes (of fifty-odd). Second-tier in the swarm until Eungo’s counsel and Euija’s Satek-fear promote him over Yung. Gains a title and a lifelong rival in one afternoon. The rivalry with Yung outlives the coup, the wine, and Sabi — and ends with brothers on opposite banks of the White River.',
		events: [
			{ year: 655, label: 'Named crown prince in Yung’s place.' },
			{ year: 660, label: 'Sabi falls; the mark becomes a memory.' }
		],
		family: [
			{ id: 'euija', role: 'Father' },
			{ id: 'ungo', role: 'Mother' },
			{ id: 'yung', role: 'Brother' },
			{ id: 'tae', role: 'Brother' },
			{ id: 'yun', role: 'Brother' },
			{ id: 'pung', role: 'Brother' }
		],
		career: [
			{ title: 'Prince of Baekje', korean: '왕자', org: 'nation-baekje', from: 632, to: 655 },
			{ title: 'Crown Prince', korean: '태자', hanja: '太子', org: 'nation-baekje', from: 655 }
		],
		aliases: ['Prince Hyo', 'Buyeo Hyo', 'Hyo', '부여효']
	},
	{
		id: 'sosuno',
		avatar: '/ch_sosuno.png',
		gender: 'f',
		name: 'Sosuno',
		korean: '소서노',
		kingdom: 'baekje',
		clan: 'clan-yeon',
		clans: ['clan-go'],
		clanBy: { 'clan-go': 'marriage' },
		tagline: 'Founded one kingdom with her husband, then walked south and founded another with her sons.',
		ideology: 'Partner-founder',
		ideologyNote: 'Co-architect at the root; power shared before it becomes a title.',
		quote: "The bow wins the night. The road wins the rest.",
		nature:
			'Yeon by birth (Tabal’s daughter) and Go by marriage to Jumong — both houses claim her. Love first, alliance second — hunger that founds kingdoms. With Jumong, desire is spoken in glances and grain porches, never as thesis.',
		arc: 'Daughter of Yeon Tabal; she falls for Jumong before the alliance is spoken, and her father’s suspicion breaks on an archery contest. She gives Jumong the tribes that make Goryeo. When his first son arrives from Buyeo and takes the succession, she does not fight for it — she takes Onjo and Biryu south and builds Baekje instead.',
		binyeo: 'Patina-gold binyeo — openwork phoenix in a dark ring; Tabal wealth worn warm, not bright.',
		binyeoImage: '/bn_sosuno.png',
		events: [
			{ year: -37, label: 'Helps Jumong found Goryeo at Jolbon.' },
			{ year: -18, label: 'Leads her sons south; Baekje is founded.' }
		],
		aliases: ['Sosuno']
	},
	{
		id: 'yuhwa',
		avatar: '/ch_yuhwa.png',
		name: 'Lady Yuhwa',
		korean: '유화부인',
		entity: 'god',
		godTier: 'III',
		gender: 'f',
		kingdom: 'goguryeo',
		title: 'Goddess of the moon · river-daughter',
		realm: { en: 'Moon', ko: '달' },
		tagline: 'Habek’s daughter, cast out for the sun; after death she keeps the night.',
		quote: 'Still… across from you is fine.',
		firstLine: { en: 'Sister. Above us.', ko: '언니. 위에.' },
		lastLine: {
			en: 'Build a world of your own…. my son…!',
			ko: '너만의 세상을 만들어라.... 아들아...!'
		},
		arc: 'Class III: Habek’s daughter, not a realm’s sovereign. Exile from the Amnok court for Haemosu; the egg that becomes Jumong is what the river and the sun refuse to unmake. She dies in Buyeo after he has gone. The reapers do not come — Haemosu does. She does not go down. She goes up, and the living world keeps a moon: the office that answers the sun without riding beside him.',
		binyeo: 'Pearl-wave binyeo — mother-of-pearl shaft, blue crest and orb, gold cloud at the tail; cool, never quite dry.',
		binyeoImage: '/bn_yuhwa.png',
		events: [
			{ label: 'Seen by Haemosu in the Ubal shallows; Habek casts her out.' },
			{ label: 'Bears the egg that hatches Jumong.' },
			{ label: 'Dies; Haemosu takes her soul; she becomes goddess of the moon.' }
		],
		aliases: ['Lady Yuhwa', 'Yuhwa', '유화', '유화부인', 'moon goddess']
	},
	{
		id: 'geumwa',
		gender: 'm',
		avatar: '/ch_geumwa.png',
		name: 'King Geumwa',
		korean: '금와왕',
		kingdom: 'other',
		tagline: 'Took in the exiled Yuhwa, and raised the boy who would outgrow his kingdom.',
		quote: "Shelter what heaven abandons.",
		family: [
			{ id: 'daeso', role: 'Son' },
			{ id: 'galsa', role: 'Son' },
			{ id: 'jumong', role: 'Foster son' }
		],
		aliases: ['King Geumwa', 'Geumwa']
	},
	{
		id: 'daeso',
		gender: 'm',
		avatar: '/ch_daeso.png',
		name: 'Daeso',
		korean: '대소',
		kingdom: 'other',
		died: 22,
		tagline: 'Geumwa’s son, who could not bear being outshot by a foundling.',
		quote: "Never be outshot by a foundling.",
		family: [
			{ id: 'geumwa', role: 'Father' },
			{ id: 'galsa', role: 'Brother' },
			{ id: 'jumong', role: 'Stepbrother' }
		],
		aliases: ['Daeso']
	},
	{
		id: 'galsa',
		gender: 'm',
		avatar: '/ch_galsa.png',
		name: 'Galsa',
		korean: '갈사',
		hanja: '曷斯',
		kingdom: 'other',
		tagline: 'Geumwa’s younger son — the smile that shrinks when Jumong hits the mark.',
		quote: 'If the arrow lands, pretend you meant to applaud.',
		nature: 'Second son energy beside Daeso’s heir-rage: less throne, more side-eye. Keeps score the way hunters keep wind.',
		arc: 'Raised in Buyeo’s hall with Daeso while the egg-born boy outgrows every contest. When Jumong slips away into the night, Galsa is among the nets — not the loudest voice, but one of the smiles that got smaller each year the foundling shot true.',
		family: [
			{ id: 'geumwa', role: 'Father' },
			{ id: 'daeso', role: 'Brother' },
			{ id: 'jumong', role: 'Stepbrother' }
		],
		aliases: ['Galsa', '갈사', '曷斯']
	},
	{
		id: 'buyeojashin',
		gender: 'm',
		avatar: '/ch_buyeo_jashin.png',
		name: 'Buyeo Jashin',
		korean: '부여자신',
		hanja: '扶餘子申',
		kingdom: 'other',
		tagline: 'Geumwa’s ledger-man — reads omens the way clerks read tax.',
		quote: 'An egg on the record is still a record.',
		nature: 'Court strategist in red and seal-gold: calm voice, cold categories. Believes Buyeo survives by filing heaven correctly.',
		arc: 'Minister of the accounts and the auguries in Geumwa’s Dongbuyeo — the man who tells the king what the egg means before the egg hatches. He counsels patience when Daeso wants blood and caution when Geumwa wants pride. When Jumong crosses the river on fish and turtles, Jashin is the one who writes “unfiled” in the margin and lives with it.',
		career: [
			{ title: 'Minister', korean: '대臣', hanja: '大臣', from: -50, to: -20, note: 'Geumwa’s Dongbuyeo court' }
		],
		aliases: ['Buyeo Jashin', 'Jashin', '부여자신', '扶餘子申']
	},
	{
		id: 'yomyo',
		gender: 'm',
		name: 'Yomyo',
		korean: '요묘',
		kingdom: 'goguryeo',
		tagline: 'The general who opened Pyongyang’s gates alongside the monk Shinsung.',
		quote: "Open what others lock.",
		events: [{ year: 668, label: 'Opens the fortress gates to the Tang.' }],
		aliases: ['Yomyo']
	},
	{
		id: 'herald',
		gender: 'm',
		name: 'The Herald',
		korean: '전령',
		kingdom: 'other',
		tagline: 'Whoever has to carry the news, and say it out loud.',
		quote: "Someone must say it out loud.",
		arc: 'Not one person but a role — the rider who reaches Surabol with Daeya’s fall, the man who bursts into Yeon’s quarters, the voice that must tell a king what he does not want to hear.',
		aliases: ['The Herald']
	},
	{
		id: 'goguard_a',
		gender: 'm',
		name: 'Gate Guard',
		korean: '문지기',
		kingdom: 'goguryeo',
		tagline: 'One of the two men outside Yeon’s door — comedy until the blood.',
		quote: "Funny until it isn’t — then stand.",
		aliases: ['Gate Guard', 'Goguryeo guard']
	},
	{
		id: 'goguard_b',
		gender: 'm',
		name: 'Junior Guard',
		korean: '병졸',
		kingdom: 'goguryeo',
		tagline: 'The other man outside the door. Easily surprised.',
		quote: "Be surprised once. Learn forever.",
		aliases: ['Junior Guard']
	},
	{
		id: 'narim',
		avatar: '/ch_narim.png',
		name: 'Narim',
		korean: '나림',
		hanja: '奈林',
		kingdom: 'silla',
		entity: 'god',
		godTier: 'III',
		gender: 'f',
		title: 'Eldest of the steam cavern',
		realm: { en: 'Steam Cavern', ko: '증기 동굴' },
		tagline: 'Eldest of the three — house rules, dry counsel, and hunger she usually schedules second.',
		ideology: 'Oracle above faction',
		ideologyNote: 'Counsel and house rules over any -ism; the steam does not vote. Naked, clean-shaven Kims only.',
		quote: 'Counsel first. Hunger second — usually.',
		arc: 'The cavern’s house rules are blunt: naked, clean-shaven, and only men surnamed Kim — 김, the same sound as steam. Seohyeon was first; every later Kim is heirloom. Narim is the mature sister: she names the rule, lets Golhwa’s innuendo run hot, steadies Hyullé, and still delivers the Delphi-sharp advice he rode for — then, once, sends the younger two away and tries to keep him with her mouth instead of counsel, until they catch her at it. Territorial: the steam itself answers her first.',
		binyeo: 'Jade branch binyeo — mint coral at the head, forest-green shaft, gold at the tip; eldest wears one pin in the steam.',
		binyeoImage: '/bn_narim.png',
		aliases: ['Narim', '나림', 'Forest Goddess']
	},
	{
		id: 'hyulle',
		avatar: '/ch_hyullé.png',
		name: 'Hyullé',
		korean: '휠레',
		hanja: '穴禮',
		kingdom: 'silla',
		entity: 'god',
		godTier: 'III',
		gender: 'f',
		title: 'Quiet sister of the steam cavern',
		realm: { en: 'Steam Cavern', ko: '증기 동굴' },
		tagline: 'Quiet at the water’s edge — and secretly the one who loves him most.',
		ideology: 'Quiet devotee',
		ideologyNote: 'Loyalty without a platform — love as the only politics she admits.',
		quote: 'Love quietly. Stay longest.',
		arc: 'She speaks least. When she does, it is almost apology — market gossip about Yushin’s shoulders included. Of the three she is the shy one, which is why he misses that she watches him longest after the others look away, and why catching Narim with him hurts more than Golhwa’s loud jealousy: steam was supposed to be shared among Kims, not monopolised. The cavern’s cool cyan edge is hers.',
		binyeo: 'Teal wave binyeo — crested head, azure collar, silver shaft; water-cool, easy to miss in the steam.',
		binyeoImage: '/bn_hyulle.png',
		aliases: ['Hyullé', 'Hyulle', 'Hyeolrye', '휠레', '혈례', 'Cavern Goddess']
	},
	{
		id: 'golhwa',
		avatar: '/ch_golhwa.png',
		name: 'Golhwa',
		korean: '골화',
		hanja: '骨火',
		kingdom: 'silla',
		entity: 'god',
		godTier: 'III',
		gender: 'f',
		title: 'Youngest of the steam cavern',
		realm: { en: 'Steam Cavern', ko: '증기 동굴' },
		tagline: 'Youngest — body talk, bad jokes, heat first, never sorry.',
		ideology: 'Hedonist counsel',
		ideologyNote: 'Desire as diplomacy; mocks every ideology while delivering the warning anyway.',
		quote: 'Quality control. Underwater. Don’t ask for a receipt.',
		arc: 'Forward to the point of comedy: she inspects chins for the clean-shave rule, inventories Yushin’s waist, mocks “Little Majesty,” drops Aladdin-genie and brand jokes, and once disappears under the water long enough that the steam itself looks compromised. Under the innuendo the counsel is still sharp. She wants him in the lake with them — hates most when Narim eats first — and still wants him alive enough to come back. On the night before Radiance’s tenth day, when his father and grandfather finish naming him, she is the one who looks away holding back tears: Look at him — he’s crying.',
		binyeo: 'Coral-flame binyeo — red stone carved hot, ruby in a gold cap; worn crooked on purpose.',
		binyeoImage: '/bn_golhwa.png',
		aliases: ['Golhwa', '골화', 'Fire Goddess']
	},
	{
		id: 'jukjuk',
		gender: 'm',
		name: 'Jukjuk',
		korean: '죽죽',
		hanja: '竹竹',
		kingdom: 'silla',
		died: 642,
		tagline: 'Named “bamboo” by his father — break, never bend.',
		quote: 'Break. Never bend.',
		arc: 'A local officer of Daeya, sahji rank. When Pumsuk chose surrender, Jukjuk refused: his father had named him after bamboo so that he would wither in the cold before bending. He held the ruined fortress with Yongseok and died fighting.',
		events: [{ year: 642, label: 'Dies defending Daeya after Pumsuk’s surrender.' }],
		aliases: ['Jukjuk']
	},
	{
		id: 'yunchung',
		gender: 'm',
		name: 'Yunchung',
		korean: '윤충',
		hanja: '允忠',
		kingdom: 'baekje',
		tagline: 'The general Euija trusted with ten thousand men and Daeya.',
		quote: "Plain speech is also a weapon.",
		events: [{ year: 642, label: 'Takes Daeya Fortress with 10,000 troops.' }],
		aliases: ['Yunchung']
	},
	{
		id: 'gwanchang',
		gender: 'm',
		avatar: '/ch_gwanchang.png',
		name: 'Gwanchang',
		korean: '관창',
		hanja: '官昌',
		title: 'Hwarang of Hwangsanbeol',
		kingdom: 'silla',
		born: 645,
		died: 660,
		tagline: 'Sixteen at the Yellow Mountain — released once, and rode back.',
		quote: "Youth is not an excuse. It is a deadline.",
		arc: 'Son of general Kim Pumil. Captured charging the Baekje line alone, Gyebek unstrapped his helmet, marvelled at his age, and sent him home. He rode straight back. The second time, Gyebek sent back only his head — and the sight of it broke Silla’s hesitation. The yard never says it aloud, but Hwangsan rhymes with the first class: Bangul rides out first; Gwanchang rides out second and keeps the swear alone.',
		blade: 'Ring-pommel colt sword — a boy’s grip on a man’s edge; drawn twice at the Yellow Mountain.',
		events: [{ year: 660, label: 'Dies at Hwangsanbeol; the army charges in his name.' }],
		family: [{ id: 'pumil', role: 'Father' }],
		career: [
			{ title: 'Hwarang disciple', korean: '낭도', hanja: '郎徒', org: 'hwarang', from: 658, to: 660 },
			{ title: 'Hwarang', korean: '화랑', hanja: '花郎', org: 'hwarang', from: 660, to: 660 }
		],
		aliases: ['Gwanchang', '관창', '官昌', 'Kim Gwanchang']
	},
	{
		id: 'bangul',
		gender: 'm',
		avatar: '/ch_bangul.png',
		name: 'Bangul',
		korean: '반굴',
		hanja: '盤屈',
		title: "Yushin's nephew · Hwarang",
		kingdom: 'silla',
		born: 645,
		died: 660,
		bornApprox: true,
		tagline: 'Yushin’s nephew — first to ride alone into the Baekje line, the way Mugwan went quiet before Sadaham kept the vow.',
		quote: "Ride first. Someone has to.",
		events: [{ year: 660, label: 'Dies at Hwangsanbeol before Gwanchang.' }],
		career: [
			{ title: 'Hwarang', korean: '화랑', hanja: '花郎', org: 'hwarang', to: 660 }
		],
		aliases: ['Bangul', 'Banggul', '반굴', '金盤屈', 'Kim Bangul', 'Kim Banggul']
	},
	{
		id: 'chunbok',
		gender: 'm',
		avatar: '/ch_satek_chunbok.png',
		name: 'Satek Chunbok',
		korean: '사택천복',
		kingdom: 'baekje',
		clan: 'clan-satek',
		tagline: 'The young Satek who chose the king over his clan.',
		quote: "Say one name. Bring him back.",
		aliases: ['Satek Chunbok', 'Chunbok']
	},
	{
		id: 'heungsu',
		gender: 'm',
		name: 'Heungsu',
		korean: '흥수',
		hanja: '興首',
		kingdom: 'baekje',
		tagline: 'The exiled loyalist whose last advice arrived too late.',
		ideology: 'Exile Cassandra',
		ideologyNote: 'Sees the trap early; realism without a room willing to listen.',
		quote: "Warning a king is a temporary posting.",
		arc: 'One of the three loyalists with Sungchung and Gyebek. Exiled, he sent the same counsel Sungchung had died giving — hold the Baek river and the Tanhyeon pass — and the court debated it until both had already been crossed.',
		events: [{ year: 660, label: 'His warning is ignored; Sabi falls.' }],
		aliases: ['Heungsu']
	},
	{
		id: 'dochim',
		gender: 'm',
		name: 'Dochim',
		korean: '도침',
		hanja: '道琛',
		kingdom: 'baekje',
		avatar: '/ch_dochim.png',
		died: 661,
		tagline: 'Temple-trained, clan-ignored — the monk who raised an army from leftovers.',
		quote: 'Restore first. Argue later.',
		nature: 'BRA before it had a banner: a warrior-monk who recruits people the Eight Clans never counted. Soft voice, hard timetable.',
		arc: 'Rises with Boksin at Juryu — not from a Great Clan seat but from a monastery that taught him how to organise hunger. Builds the Baekje Restoration Army out of ferrywomen, clerks, novices, and hunters. Dies when Boksin decides the movement only needs one throat.',
		events: [
			{ year: 660, label: 'Rises with Boksin to restore Baekje.' },
			{ year: 661, label: 'Killed by Boksin in the movement’s first fracture.' }
		],
		career: [
			{ title: 'General', korean: '장군', hanja: '將軍', org: 'restorationarmy', from: 660, to: 661 }
		],
		aliases: ['Dochim']
	},
	{
		id: 'sangji',
		gender: 'm',
		name: 'Heukchi Sangji',
		korean: '흑치상지',
		hanja: '黑齒常之',
		kingdom: 'baekje',
		avatar: '/ch_hukchi_sangji.png',
		born: 630,
		died: 689,
		tagline: 'Held Imjon for the BRA — then won Tang’s wars until Tang invented a charge.',
		quote: 'Black-tooth loyalty cuts both ways.',
		nature: 'Frontier competence without Eight-Clan polish. Desire: a wall that holds. Wound: watching restoration eat itself. Voice: spare, soldierly, allergic to royal theatre.',
		arc: 'Rallied thirty thousand refugees at Imjon within ten days of Sabi’s fall — a BRA pillar who was never Satek or Yunbi enough for Sabi to have noticed him beforehand. When the army fractures he surrenders to Tang and spends the rest of his life winning their steppe wars — until a slander he does not survive.',
		events: [
			{ year: 660, label: 'Raises Imjon Fortress against the occupation.' },
			{ year: 663, label: 'Defects to Tang as the BRA collapses.' },
			{ year: 689, label: 'Dies imprisoned on a false charge in Luoyang.' }
		],
		career: [
			{ title: 'General of Imjon', korean: '장군', hanja: '將軍', org: 'restorationarmy', from: 661, to: 663 }
		],
		aliases: ['Hukchi Sangji', 'Heukchi Sangji']
	},
	{
		id: 'sateksangya',
		gender: 'm',
		name: 'Satek Sangya',
		korean: '사택상여',
		hanja: '沙宅相如',
		kingdom: 'baekje',
		clan: 'clan-satek',
		died: 663,
		tagline: 'Satek steel at the restoration table — berth money turned field general.',
		quote: 'Harbour credit buys one more wall.',
		nature: 'Not Eight-Clan theatre — Satek muscle who never held Elder Satek’s chair but held a gate. Desire: the house’s name on a victory scroll. Wound: watching restoration eat its captains. Voice: wharf-flat, no poetry.',
		arc: 'Fifth pillar of the Baekje Restoration Army’s founding captains — the Satek general who raises men the Great Clans never counted beside Boksin, Dochim, and Sangji. When Pung arrives he salutes the crown and keeps the harbour lanes open. After Boksin falls he refuses the king’s arithmetic, holds Imjon with Sangji’s stubbornness, and eventually surrenders to Tang when the White River prices the last chance.',
		events: [
			{ year: 660, label: 'Joins the BRA at Juryu with Boksin and Dochim.' },
			{ year: 661, label: 'Salutes King Pungjang; keeps Satek lanes feeding the host.' },
			{ year: 663, label: 'Refuses Pung’s camp; defects to Tang as the army collapses.' }
		],
		career: [
			{ title: 'General', korean: '장군', hanja: '將軍', org: 'restorationarmy', from: 660, to: 663 }
		],
		aliases: ['Satek Sangya', 'Sangya', '사택상여', '沙宅相如']
	},
	{
		id: 'sadaham',
		gender: 'm',
		avatar: '/ch_sadaham.png',
		name: 'Sadaham',
		korean: '사다함',
		hanja: '斯多含',
		title: 'God of the Hwarang',
		kingdom: 'silla',
		born: 547,
		died: 564,
		tagline: 'God of the Hwarang — First Class, conqueror of Gaya at fifteen, dead of grief at seventeen.',
		quote: "A Hwarang’s future is shorter than his song.",
		blade: 'Ring-pommel plum-blossom sword — Gaya taken at fifteen; hung up unpolished after Mugwan.',
		events: [
			{ year: 562, label: 'Leads the vanguard that takes Daegaya.' },
			{ year: 564, label: 'Dies mourning his sworn friend Mugwan.' }
		],
		sobriquets: ['God of the Hwarang'],
		career: [
			{ title: 'Hwarang', korean: '화랑', hanja: '花郎', org: 'hwarang', from: 560, to: 564 }
		],
		aliases: ['Sadaham', 'Kim Sadaham', '사다함', '斯多含', 'God of the Hwarang']
	},
	{
		id: 'mugwan',
		gender: 'm',
		avatar: '/ch_mugwan.png',
		name: 'Mugwan',
		korean: '무관랑',
		hanja: '武官郎',
		title: 'Hwarang of the First Class',
		kingdom: 'silla',
		born: 547,
		died: 563,
		bornApprox: true,
		tagline: 'Sadaham’s sworn friend of the First Class — died of illness; the vow outlived him by seven days.',
		quote: 'If I die first — you already know.',
		nature: 'The quieter half of the first class: less sung than Sadaham, equally bound. Samguk Sagi names him 무관랑 (武官郎); later mouths sometimes say Mugeun. The chronicle gives him almost no speeches and one death — illness after the year Great Gaya fell — and that is enough, because Sadaham followed.',
		arc: 'Sworn 사우 (死友) with Sadaham from boyhood. After the Gaya campaign he falls ill and dies. Sadaham takes no food for seven days and is dead at seventeen. The yard still tells the pair as the first class’s bill: a Hwarang who outlives his vow is only a boy with a nice coat.',
		blade: 'Ring-pommel companion sword — unnamed in the minutes; remembered because the other hung his up.',
		events: [
			{ year: 562, label: 'Rides the Gaya campaign with Sadaham.' },
			{ year: 563, label: 'Dies of illness; Sadaham follows within days.' }
		],
		career: [
			{ title: 'Hwarang', korean: '화랑', hanja: '花郎', org: 'hwarang', from: 560, to: 563 }
		],
		aliases: [
			'Mugwan',
			'Mugwanrang',
			'무관랑',
			'武官郎',
			'Mugeun',
			'무근',
			'Mugeunrang'
		]
	},
	{
		id: 'weizheng',
		gender: 'm',
		avatar: '/ch_wei_zheng.png',
		name: 'The Imperial Minister',
		korean: '위징',
		hanja: '魏徵',
		kingdom: 'tang',
		born: 580,
		died: 643,
		tagline: 'The minister who told the emperor the truth two hundred times and lived.',
		quote: "When I am gone, there will be no one left to tell you no.",
		arc: 'The mirror the emperor said he lost when the minister died. His death in 643 removes the last voice against the Goguryeo war.',
		events: [{ year: 643, label: 'Dies; the emperor mourns his living mirror.' }],
		career: [
			{ title: 'Minister', korean: '재상', hanja: '宰相', org: 'tangcourt', to: 643 }
		],
		aliases: ['Wei Zheng', 'the imperial minister', 'The Imperial Minister', 'the minister']
	},
	{
		id: 'xueliu',
		name: 'Lady Liu',
		korean: '유씨',
		hanja: '柳氏',
		kingdom: 'tang',
		gender: 'f',
		tagline: 'Told a farmer the Son of Heaven was calling — and sent him to history.',
		quote: "Talent needs its hour. This is the hour.",
		arc: 'Xue Rengui’s wife. When he meant to rebury his ancestors in quiet poverty, she named the hour: Taizong wanted fierce generals for Liaodong. Without her sentence there is no white coat, no ji, no eastern command.',
		events: [{ year: 644, label: 'Urges Xue Rengui to answer the muster for Liaodong.' }],
		aliases: ['Lady Liu', '柳氏', '유씨']
	},
	{
		id: 'xuerengui',
		gender: 'm',
		avatar: '/ch_xue_rengui.png',
		name: 'Xue Rengui',
		korean: '설인귀',
		hanja: '薛仁貴',
		kingdom: 'tang',
		born: 614,
		died: 683,
		title: 'White Tiger II',
		tagline: 'White-robed general — farmer, fangtian ji, Tang’s unsung eastern blade.',
		quote: "Keep a road under your feet — even in the east.",
		arc: 'Born poor at Longmen as Xue Li. His wife Liu sends him to Zhang Shigui’s muster when Taizong calls for Liaodong. At Stallion Mountain he wears white armour, wields the fangtian ji (the same heaven-halberd the storytellers give Lü Bu), and Taizong asks who the man in white is — then says gaining Xue matters more than gaining Liaodong. Captured once in the seventh invasion, he breaks a fortress cage before the Emperor arrives. Inherits the White Tiger title after Pang Xiaotai dies at the Snake River; as Protector-General of the East he takes Pyongyang in 668 and governs without spectacle. At Maeso in 675 he is Tang’s last great eastern commander — competent, sympathetic, and finally out of horses.',
		blade: 'No ring pommel at all — the fangtian ji, the storytellers’ heaven-halberd; the white coat is his crest.',
		events: [
			{ year: 644, label: 'Answers Taizong’s muster at his wife’s urging.' },
			{ year: 645, label: 'White armour & fangtian ji at Stallion Mountain; noticed by Taizong.' },
			{ year: 645, label: 'Captured inland; escapes before the Emperor reaches the fortress.' },
			{ year: 662, label: 'Named White Tiger II after Pang Xiaotai’s death.' },
			{ year: 668, label: 'Enters Pyongyang; Protector-General of the East.' },
			{ year: 675, label: 'Eastern command broken at Maeso — loses the horses, and the road.' }
		],
		sobriquets: [
			'White-Robed',
			'white-robed',
			'White-Robed General',
			'백포장군',
			'白袍将军',
			'백의',
			'White Coat'
		],
		career: [
			{ title: 'White Dragon', korean: '백룡', hanja: '白龍', org: 'fourdragons', from: 645, to: 662 },
			{ title: 'White Tiger II', korean: '백호', hanja: '白虎', org: 'fourbeasts', from: 662, to: 668 },
			{ title: 'Protector-General of the East', korean: '안동도호', hanja: '安東都護', org: 'tangexpedition', from: 668 }
		],
		aliases: [
			'Xue Rengui',
			'Xue Li',
			'薛禮',
			'White Tiger II',
			'백호 2세',
			'White Coat',
			'White-Robed',
			'White-Robed General',
			'백포장군',
			'白袍将军',
			'백의'
		]
	},
	{
		id: 'sudingfang',
		gender: 'm',
		avatar: '/ch_red_dragon.png',
		name: 'Red Dragon',
		korean: '소정방',
		hanja: '蘇定方',
		title: 'The Red Dragon',
		kingdom: 'tang',
		born: 592,
		died: 667,
		tagline: 'The Red Dragon: took three kingdoms’ capitals in one career.',
		quote: "Three capitals. One career.",
		arc: 'Breaker of the Western Turks, commander of the 660 seaborne invasion that ended Baekje in a single season. He failed only at Pyongyang — mired in snow at the Sasu while Yeon destroyed the supporting army.',
		events: [
			{ year: 660, label: 'Lands 130,000 men at the Geum estuary; Sabi falls.' },
			{ year: 662, label: 'Winters outside Pyongyang, and withdraws.' }
		],
		career: [
			{ title: 'Red Dragon', korean: '적룡', hanja: '赤龍', org: 'fourdragons', from: 645, to: 661 },
			{ title: 'Red Fowl', korean: '주작', hanja: '朱雀', org: 'fourbeasts', from: 661 }
		],
		aliases: ['Su Dingfang', 'Red Dragon', 'the Red Dragon', 'Red Fowl', 'the Red Fowl']
	},
	{
		id: 'lishiji',
		gender: 'm',
		avatar: '/ch_blue_dragon.png',
		name: 'Blue Dragon',
		korean: '이세적',
		hanja: '李世勣',
		title: 'The Blue Dragon',
		kingdom: 'tang',
		born: 594,
		died: 669,
		tagline: 'The Blue Dragon: the old marshal who finally took Pyongyang.',
		quote: "Siege is weather. Wait for the season.",
		events: [
			{ year: 645, label: 'Takes Liaodong Fortress under the emperor.' },
			{ year: 668, label: 'Commands the final campaign; Pyongyang falls.' }
		],
		career: [
			{ title: 'Blue Dragon', korean: '청룡', hanja: '青龍', org: 'fourdragons', from: 645 }
		],
		aliases: ['Li Shiji', 'Li Ji', 'Blue Dragon', 'the Blue Dragon']
	},
	{
		id: 'liurengui',
		gender: 'm',
		avatar: '/ch_black_dragon.png',
		name: 'Black Dragon',
		korean: '유인궤',
		hanja: '劉仁軌',
		title: 'The Black Dragon',
		kingdom: 'tang',
		born: 601,
		died: 685,
		tagline: 'The Black Dragon: burned four hundred eastern ships at the White River.',
		quote: "Hold what the others break.",
		events: [{ year: 663, label: 'Wins the naval battle of Baekgang.' }],
		career: [
			{ title: 'Black Dragon', korean: '흑룡', hanja: '黑龍', org: 'fourdragons', from: 645, to: 661 },
			{ title: 'Black Tortoise', korean: '현무', hanja: '玄武', org: 'fourbeasts', from: 661 }
		],
		aliases: ['Liu Rengui', 'Black Dragon', 'the Black Dragon', 'Black Tortoise', 'the Black Tortoise']
	},
	{
		id: 'pangxiaotai',
		gender: 'm',
		avatar: '/ch_white_dragon.png',
		name: 'White Tiger',
		korean: '방효태',
		title: 'The White Tiger',
		kingdom: 'tang',
		died: 662,
		tagline: 'The White Tiger, drowned at the Snake River with his thirteen sons.',
		quote: "The first tiger dies loud. The second learns.",
		events: [{ year: 662, label: 'His army is annihilated by Yeon at the Sasu.' }],
		career: [
			{ title: 'White Tiger', korean: '백호', hanja: '白虎', org: 'fourbeasts', from: 661 }
		],
		aliases: ['Pang Xiaotai', 'White Tiger', 'the White Tiger']
	},
	{
		id: 'saimei',
		name: 'The Eastern Empress',
		korean: '사이메이 천황',
		kingdom: 'yamato',
		gender: 'f',
		born: 594,
		died: 661,
		tagline: 'The empress who mobilised the East for Baekje — and died on the way.',
		quote: "The sea is also a border.",
		binyeo: 'Wave-lacquer island pin — an eastern kanzashi pointed west; she died wearing it toward the war.',
		events: [
			{ year: 660, label: 'Orders the fleet raised to restore Baekje.' },
			{ year: 661, label: 'Dies at Asakura palace, en route to the war.' }
		],
		career: [
			{ title: 'Empress', korean: '천황', hanja: '天皇', org: 'nation-yamato', from: 655 }
		],
		aliases: ['Empress Saimei', 'Saimei', 'the eastern empress', 'The Eastern Empress']
	},
	{
		id: 'tenji',
		gender: 'm',
		name: 'The Eastern Prince',
		korean: '덴지 천황',
		kingdom: 'yamato',
		born: 626,
		died: 672,
		tagline: 'Sent forty thousand men to the White River and lost them.',
		quote: "Watch western fires. Steal only the heat you need.",
		events: [
			{ year: 661, label: 'Takes up his mother’s war for Baekje.' },
			{ year: 663, label: 'The fleet burns at Baekgang; the East turns inward.' }
		],
		career: [
			{ title: 'Crown Prince', korean: '태자', hanja: '太子', org: 'nation-yamato', to: 668 },
			{ title: 'Emperor', korean: '천황', hanja: '天皇', org: 'nation-yamato', from: 668 }
		],
		aliases: ['Emperor Tenji', 'Naka-no-Ōe', 'Tenji', 'the eastern prince', 'The Eastern Prince']
	},
	{
		id: 'kuromaro',
		gender: 'm',
		name: 'The Eastern Scholar',
		korean: '다카무코노 구로마로',
		kingdom: 'yamato',
		died: 654,
		tagline: 'Yamato’s scholar of the continent, Chunchu’s host in the East.',
		quote: "Guide a guest who will outgrow guidance.",
		aliases: ['Takamuko no Kuromaro', 'Kuromaro', 'the eastern scholar', 'The Eastern Scholar']
	},
	{
		id: 'takutsu',
		gender: 'm',
		name: 'Echi no Takutsu',
		korean: '에치노 다쿠쓰',
		kingdom: 'yamato',
		died: 663,
		tagline: 'Died at the White River shouting Kudara’s name.',
		quote: "Loyalty does not ask whose map you die on.",
		events: [{ year: 663, label: 'Falls at Baekgang crying “Long live Kudara!”' }],
		aliases: ['Echi no Takutsu', 'Takutsu']
	},
	{
		id: 'gungye',
		gender: 'm',
		avatar: '/ch_gung_ye.png',
		name: 'Gung Ye',
		korean: '궁예',
		hanja: '弓裔',
		kingdom: 'goguryeo',
		born: 869,
		died: 918,
		tagline: 'One-eyed monk-king — founded Taebong from Goguryeo’s ashes.',
		quote: 'The mandate does not ask if you can see.',
		nature: 'Warrior-monk charisma with a dragon sash and a gold patch: prophecy as policy, violence as liturgy. Terrifying calm.',
		arc: 'Post-Samhan coda: a monk with one eye and a staff who names himself Son of Heaven, builds Taebong on Goguryeo nostalgia, and dies when the disciples he made decide they prefer a cleaner king. The chronicle visits him only as proof that the peninsula keeps inventing crowns after the maps say the work is finished.',
		events: [
			{ year: 901, label: 'Founds Taebong (Later Goguryeo) at Songak.' },
			{ year: 918, label: 'Overthrown and killed by his generals.' }
		],
		career: [
			{ title: 'King of Taebong', korean: '태봉왕', hanja: '泰封王', from: 901, to: 918 }
		],
		aliases: ['Gung Ye', 'Gungye', '궁예', '弓裔']
	},
	{
		id: 'yesikjin',
		gender: 'm',
		name: 'Ye Sikjin',
		korean: '예식진',
		hanja: '禰寔進',
		kingdom: 'baekje',
		born: 615,
		died: 672,
		tagline: 'The guardian of Bear Fortress who handed his king to the Tang.',
		quote: "Serving is not the same as believing.",
		arc: 'His tomb epitaph, dug up in Luoyang in 2006, confirmed what the histories implied: the man sheltering Euija at Ungjin surrendered him. He died a Tang general.',
		events: [{ year: 660, label: 'Surrenders Euija at Bear Fortress.' }],
		aliases: ['Ye Sikjin']
	},
	{
		id: 'yumjong',
		gender: 'm',
		avatar: '/ch_yumjong.png',
		name: 'Yumjong',
		korean: '염종',
		hanja: '染宗',
		kingdom: 'silla',
		died: 647,
		tagline: 'Bidam’s fellow conspirator at the Fortress of Radiance — the quieter name on the banner.',
		quote: 'Rebellion needs two names. Be the quieter one.',
		events: [{ year: 647, label: 'Rises with Bidam at Radiance; falls in the outer works on the ninth day.' }],
		aliases: ['Yumjong', 'Yeomjong', 'Yumjang']
	},
	{
		id: 'gusesa',
		gender: 'm',
		avatar: '/ch_commander_1.png',
		name: 'Yeon Gusesa',
		korean: '연구세사',
		kingdom: 'goguryeo',
		died: 642,
		tagline: 'Stone Haetae of Goryeo — Central Commander, Gesomun’s elder kinsman, first to name him traitor.',
		clan: 'clan-yeon',
		ideology: 'Old-guard Baekje nationalist',
		ideologyNote: 'Generation that still hears Geunchogo’s hurricane as destiny, not metaphor.',
		quote: "A Yeon name is already a warning.",
		nature: 'Chairs the Summit like a feast: soft voice, hard arithmetic. Tells his nephew to sit down — and is the first mouth to set the word traitor on Yeon’s name. Treats alarms as youthful noise until the noise becomes a massacre.',
		blade: 'Ring-pommel crow sword — haetae carved beneath the stamp; first of the Five to change hands.',
		swordImage: '/sword_crow.png',
		events: [{ year: 642, label: 'Killed at Yeon’s banquet; his crow-stamped blade becomes one of the Five.' }],
		sobriquets: ['Stone Haetae of Goryeo'],
		career: [
			{ title: 'Central Commander', korean: '대가', hanja: '大加', org: 'highsummit', to: 642 }
		],
		aliases: ['Yeon Gusesa', 'Gusesa', 'Lee Gaesa', 'Central Commander', 'Stone Haetae of Goryeo']
	},
	{
		id: 'northcmd',
		gender: 'm',
		avatar: '/ch_commander_2.png',
		name: 'Go Ul',
		korean: '고울',
		title: 'Northern Commander',
		kingdom: 'goguryeo',
		died: 642,
		tagline: 'Wants horses for the Mohe frost — not poems about Samhan.',
		ideology: 'Regional military hardliner',
		ideologyNote: 'March command as ideology — the frontier’s veto on capital softness.',
		quote: "Stop counting remounts. Start counting winters.",
		nature: 'Blunt frontier arithmetic. Sexually confident in the soldier’s way — present, not performative — and allergic to southern romance when his villages are burning.',
		blade: 'Ring-pommel crow sabre — Mohe-frost nicks in the edge; the Northern blade of the Five.',
		swordImage: '/sword_crow.png',
		events: [{ year: 642, label: 'Killed at Yeon’s banquet; Northern crow-blade taken.' }],
		career: [
			{ title: 'Northern Commander', korean: '대가', hanja: '大加', org: 'highsummit', to: 642 }
		],
		aliases: ['Go Ul', 'Northern Commander', 'the Northern Commander', '고울']
	},
	{
		id: 'southcmd',
		gender: 'm',
		avatar: '/ch_commander_3.png',
		name: 'Son Daeha',
		korean: '손대하',
		title: 'Southern Commander',
		kingdom: 'goguryeo',
		died: 642,
		tagline: 'Wants the next levy for Yushin’s passes — or stop talking Samhan.',
		ideology: 'Regional military pragmatist',
		ideologyNote: 'Southern command calculus — hold, trade, survive.',
		quote: "Send the levy — or stop naming Samhan.",
		nature: 'Competitive, sharp-tongued, sure of his own front. Treats Eastern tribal fighting as easy work and never forgives a room that starves his border for a slogan.',
		blade: 'Ring-pommel crow sword — grip worn smooth against Yushin’s passes; the Southern blade of the Five.',
		swordImage: '/sword_crow.png',
		events: [{ year: 642, label: 'Killed at Yeon’s banquet; Southern crow-blade taken.' }],
		career: [
			{ title: 'Southern Commander', korean: '대가', hanja: '大加', org: 'highsummit', to: 642 }
		],
		aliases: ['Son Daeha', 'Southern Commander', 'the Southern Commander', '손대하']
	},
	{
		id: 'westcmd',
		gender: 'm',
		avatar: '/ch_commander_4.png',
		name: 'Go Heumsong',
		korean: '고흠송',
		title: 'Western Commander',
		kingdom: 'goguryeo',
		died: 642,
		tagline: 'Wants timber for the Liao — not a southern adventure.',
		ideology: 'Regional military balancer',
		ideologyNote: 'Western march as hinge between tribute and defiance.',
		quote: "Strip the west, and you gift the Tang a road.",
		nature: 'Cautious about the Second Emperor without sharing Yeon’s urgency. Wants resources, not prophecies — and will not strip the Liao for a king’s peninsula dream.',
		blade: 'Ring-pommel crow sword — Liao timber-oil in the scabbard; the Western blade of the Five.',
		swordImage: '/sword_crow.png',
		events: [{ year: 642, label: 'Killed at Yeon’s banquet; Western crow-blade taken.' }],
		career: [
			{ title: 'Western Commander', korean: '대가', hanja: '大加', org: 'highsummit', to: 642 }
		],
		aliases: ['Go Heumsong', 'Western Commander', 'the Western Commander', '고흠송']
	},
	{
		id: 'dosuryu',
		gender: 'm',
		avatar: '/ch_dosuryu.png',
		name: 'Dosuryu',
		korean: '도수류',
		kingdom: 'goguryeo',
		title: 'Chancellor (대대로) under the Supreme Commander',
		clan: 'clan-yeon',
		tagline: 'Old Yeon friend — Chancellor after the massacre; issues the minutes the swords already wrote.',
		ideology: 'Hardline Yeon lieutenant',
		ideologyNote: 'Coups and grudges as executable policy — then proceduralised.',
		quote: 'Retrospective minutes. The best kind. They agree with what has already happened.',
		arc: 'Survives by being useful and honest in a language Yeon still understands. After the massacre he is seated as Chancellor (대대로) beside the new Supreme Commander (대막리지) — the smile that explains the sword was inevitable. When Yeon stops listening, the title remains and the friendship does not.',
		nature: 'An old friend of the Yeon house from before Gesomun’s fame. Yes-Minister talent in a red court: force first, stationery after. The High Summit may still “consult”; his minutes will show it already agreed.',
		career: [
			{ title: 'Chancellor', korean: '대대로', hanja: '大對盧', org: 'highsummit', from: 642 }
		],
		aliases: ['Dosuryu', 'Chancellor', '대대로', 'Grand Herald']
	},
	{
		id: 'jungto',
		name: 'Yeon Jungto',
		korean: '연정토',
		avatar: '/ch_yeon_jungto.png',
		kingdom: 'goguryeo',
		clan: 'clan-yeon',
		gender: 'm',
		tagline: 'Gesomun’s brother — raised Yeon Namgun and Yeon Namsan softer than the heir could afford.',
		quote: 'Keep the seal warm for the house.',
		nature: 'Uncle-politics: warmth with an exit. Loves the younger nephews enough to spoil them; loves survival enough to take twelve cities to Silla.',
		arc: 'While Gesomun drills Yeon Namseng as a second self, Jungto and his sister Sooyoung raise Yeon Namgun and Yeon Namsan in a hall where supper is allowed to be supper. After Yeon’s death that gentler house becomes a rumour the messengers can poison. In 666 he surrenders his southern territory to Silla — the uncle who taught softness choosing a soft landing.',
		events: [
			{ label: 'Raises Yeon Namgun and Yeon Namsan with his sister Sooyoung while Gesomun keeps Namseng.' },
			{ year: 666, label: 'Surrenders his southern territory to Silla.' }
		],
		family: [
			{ id: 'gesomun', role: 'Brother' },
			{ id: 'sooyoung', role: 'Sister' }
		],
		aliases: ['Yeon Jungto', 'Jungto']
	},
	{
		id: 'sooyoung',
		name: 'Yeon Sooyoung',
		korean: '연수영',
		avatar: '/ch_yeon_sooyoung.png',
		kingdom: 'goguryeo',
		gender: 'f',
		clan: 'clan-yeon',
		tagline: 'Gesomun and Jungto’s sister — the aunt who fed Yeon Namgun and Yeon Namsan when Gesomun only fed the heir rules.',
		quote: 'A boy can learn a blade after supper. He cannot unlearn hunger.',
		nature: 'Practical tenderness. Corrects posture less than Gesomun; corrects cruelty more.',
		arc: 'Sister to Gesomun and Jungto — a Yeon by blood, third of the three siblings. With her brother Jungto she raises the two younger Yeon sons — Yeon Namgun and Yeon Namsan — while Namseng stays under Gesomun’s strict roof. The split households look like logistics until messengers arrive with opposite death-wishes — then it looks like destiny with a return address nobody writes down.',
		binyeo: 'Warm copper pin — aunt-metal, not banner gold.',
		events: [{ label: 'Raises Yeon Namgun and Yeon Namsan beside Jungto’s southern hall.' }],
		family: [
			{ id: 'gesomun', role: 'Brother' },
			{ id: 'jungto', role: 'Brother' },
			{ id: 'namgun', role: 'Ward' },
			{ id: 'namsan', role: 'Ward' }
		],
		aliases: ['Yeon Sooyoung', 'Lady Sooyoung', 'Sooyoung', 'Suyoung', '수영', '연수영']
	},
	{
		id: 'shinsung',
		gender: 'm',
		avatar: '/ch_shinsung.png',
		name: 'Shinsung',
		korean: '신성',
		kingdom: 'goguryeo',
		tagline: 'Buddhist aristocracy’s quiet knife — the monk who opened Pyongyang from within.',
		quote: "A gate opens from the inside.",
		arc: 'Yeon tried to import Tang Taoism partly to starve the monk houses of prestige. The houses waited. When the brothers tore the kingdom, Shinsung opened what no army had opened — and proved Yeon’s fear had been aimed at the right profession.',
		events: [
			{ label: 'Watches Yeon’s Taoist experiment cool the temple halls.' },
			{ year: 668, label: 'Lets the Tang army into the fortress.' }
		],
		aliases: ['Shinsung']
	},
	{
		id: 'yuridora',
		gender: 'm',
		avatar: '/ch_yuri_dora.png',
		name: 'Yuri Dora',
		korean: '유리도라',
		kingdom: 'tamla',
		tagline: 'King of the orange island — first to name the Three Realms (삼계) for Gyebek.',
		quote: 'Tell the story until the mainland listens.',
		arc: 'Collector of stories and castaways. When Gyebek washes up, Yuri Dora feeds him Tamla’s myths in order — Big Star and Little Star first — and is the mouth that first frames the Three Realms (삼계) under Hwanin’s heaven as the larger map under which Samhan’s Great War looks small. History remains the chronicle’s spine; mythology arrives mostly through his island.',
		career: [
			{ title: 'King of Tamla', korean: '왕', hanja: '王', org: 'nation-tamla' }
		],
		aliases: ['Yuri Dora']
	},
	{
		id: 'jinpyung',
		gender: 'm',
		name: 'King Jinpyung',
		korean: '진평왕',
		hanja: '眞平王',
		kingdom: 'silla',
		born: 567,
		died: 632,
		clan: 'clan-gyeongju-kim',
		boneRank: 'Sacred Bone (성골)',
		tagline: 'Fifty-three years on the throne — and only daughters when the ledger closed.',
		quote: "A kingdom is a ledger. Keep it balanced.",
		arc: 'Longest reign in Silla’s annals. Kept the peninsula quiet while bone rank hardened into law; when he died without a son, the Harmony Council had to invent a queen rather than admit the covenant was broken.',
		events: [
			{ year: 579, label: 'Ascends the throne at twelve.' },
			{ year: 632, label: 'Dies after fifty-three years; Sunduk succeeds.' }
		],
		career: [
			{ title: 'King', korean: '진평왕', hanja: '眞平王', org: 'sillaroyal', from: 579, to: 632 }
		],
		family: [
			{ id: 'sunduk', role: 'Daughter' },
			{ id: 'jinduk', role: 'Granddaughter' },
			{ id: 'chunmyung', role: 'Daughter' },
			{ id: 'sunhwa', role: 'Daughter' }
		],
		aliases: ['King Jinpyung', 'Jinpyung', 'King Jinpyeong', 'Jinpyeong', '眞平王']
	},
	{
		id: 'chunmyung',
		avatar: '/ch_chunmyung.png',
		name: 'Princess Chunmyung',
		korean: '천명공주',
		kingdom: 'silla',
		gender: 'f',
		born: 580,
		bornApprox: true,
		clan: 'clan-gyeongju-kim',
		boneRank: 'Sacred Bone (성골)',
		tagline: 'Gave up her claim, and gave Silla its greatest king instead.',
		quote: "A throne traded is still a choice.",
		binyeo: 'Gold amethyst binyeo — purple orb in filigree, violet at the tip; kept in its box, claim and all.',
		binyeoImage: '/bn_chunmyung.png',
		events: [{ year: 603, label: 'Mother of Kim Chunchu.' }],
		aliases: ['Princess Chunmyung', 'Chunmyung']
	},
	{
		id: 'sunhwa',
		name: 'Princess Sunhwa',
		korean: '선화공주',
		hanja: '善花公主',
		kingdom: 'silla',
		gender: 'f',
		born: 580,
		bornApprox: true,
		clan: 'clan-gyeongju-kim',
		clans: ['clan-buyeo'],
		clanBy: { 'clan-buyeo': 'marriage' },
		boneRank: 'Sacred Bone (성골)',
		tagline: 'Married into Baekje — the legend Seodong sang into being.',
		quote: "A princess can still be a rumor.",
		arc: 'Daughter of Jinpyung; the Samguk yusa remembers her as the princess Seodong’s song fetched across the river — whether history or theatre, Baekje’s court still acts as if the marriage bought a decade of peace.',
		events: [
			{ year: 600, label: 'Legend: Seodong’s song reaches her at the well.' },
			{ year: 602, label: 'Marries King Mu of Baekje in the chronicle’s telling.' }
		],
		family: [{ id: 'jinpyung', role: 'Father' }],
		aliases: ['Princess Sunhwa', 'Princess Seonhwa', 'Sunhwa', 'Seonhwa', '善花公主']
	},
	{
		id: 'kingsung',
		gender: 'm',
		name: 'King Seong',
		korean: '성왕',
		hanja: '聖王',
		kingdom: 'baekje',
		born: 504,
		died: 554,
		clan: 'clan-buyeo',
		tagline: 'The sage king of Sabi, killed by a slave’s hand at Gwansanseong.',
		quote: "Holding on is sometimes the only victory.",
		arc: 'Moved the capital to Sabi and rebuilt Baekje’s golden age; retook the Han valley with Silla, and lost it to Silla’s betrayal within a year. Riding at night to his son’s relief, he was caught by Kim Muryeok’s troops, and a stable-slave named Dodo took his head.',
		events: [
			{ year: 538, label: 'Moves the capital to Sabi.' },
			{ year: 553, label: 'Betrayed by Jinheung over the Han valley.' },
			{ year: 554, label: 'Killed at Gwansanseong.' }
		],
		career: [
			{ title: 'King', korean: '성왕', hanja: '聖王', org: 'nation-baekje', from: 523 }
		],
		aliases: ['King Seong', 'King Sung']
	},
	{
		id: 'dodo',
		gender: 'm',
		avatar: '/ch_dodo.png',
		name: 'Dodo',
		korean: '도도',
		kingdom: 'silla',
		tagline: 'The slave who beheaded a king, as the rank system watched.',
		quote: "Be the name the record almost forgot — and remain.",
		events: [{ year: 554, label: 'Kills King Seong at Gwansanseong.' }],
		aliases: ['Dodo']
	},
	{
		id: 'jumong',
		gender: 'm',
		avatar: '/ch_jumong.png',
		name: 'Jumong',
		korean: '주몽',
		hanja: '朱蒙',
		entity: 'god',
		godTier: 'demigod',
		kingdom: 'goguryeo',
		born: -58,
		died: -19,
		clan: 'clan-go',
		title: 'Demigod founder of Goryeo',
		realm: { en: 'Jolbon founding', ko: '졸본' },
		tagline: 'Demigod — the archer who crossed the river on fish and turtles.',
		ideology: 'Founding unifier',
		ideologyNote: 'Mythic state-builder — loyalty forged by exile, bow, and a kingdom that did not exist yet.',
		quote: "From the first look — only you.",
		nature: 'Exile who becomes a maker; with Sosuno the nights run longer than the war talk. Charm of the bow, appetite of a man who has been hungry in more than one sense. Go-clan founder — the royal line Yeon Tabal’s hall will spend centuries arguing with.',
		arc: 'Born of a sunbeam and a river god’s daughter, hatched from an egg, hunted by his brothers — demigod enough that the chronicle keeps him among the Gods. He fled south from Daeso’s riders; at the water Haemosu blocked the fetch and whispered a claim into him, and the river’s creatures bridged the current. He prayed at the Jumong Cavern (국동대혈) for a kingdom of his own. At Jolbon he founded Goryeo — every kingdom in this story claims a piece of his shadow. History begins where the egg cracks; mythology only explains the crack.',
		blade: 'Ring-pommel crow bow-knife — three-legged crow scratched into the pommel by a river wife’s hand.',
		events: [
			{ year: -37, label: 'Crosses the river on turtles; prays at 국동대혈; founds Goryeo at Jolbon.' },
			{ year: -19, label: 'Dies; his son Yuri succeeds him.' }
		],
		career: [
			{ title: 'King of Goryeo', korean: '왕', hanja: '王', org: 'nation-goguryeo', from: -37 }
		],
		aliases: ['Jumong']
	},
	{
		id: 'onjo',
		gender: 'm',
		avatar: '/ch_onjo.png',
		name: 'Onjo',
		korean: '온조',
		hanja: '溫祚',
		kingdom: 'baekje',
		died: 28,
		clan: 'clan-buyeo',
		tagline: 'Jumong’s son who went south and named a kingdom for a hundred crossings.',
		quote: "South is also a beginning.",
		events: [{ year: -18, label: 'Founds Baekje at Wiryeseong.' }],
		career: [
			{ title: 'King', korean: '왕', hanja: '王', org: 'nation-baekje', from: -18 }
		],
		aliases: ['Onjo']
	},
	{
		id: 'biryu',
		gender: 'm',
		avatar: '/ch_biryu.png',
		name: 'Biryu',
		korean: '비류',
		kingdom: 'baekje',
		clan: 'clan-buyeo',
		tagline: 'Chose the salt marshes of Michuhol, and regretted it.',
		quote: "Wrong shores still make kingdoms.",
		aliases: ['Biryu']
	},
	{
		id: 'alpyung',
		gender: 'm',
		name: 'Alpyung',
		korean: '알평',
		hanja: '閼平',
		kingdom: 'silla',
		clan: 'clan-surabol-lee',
		title: 'Chief of Alcheon Yangsan-chon · Geupnyang-bu',
		tagline: 'First of the six — the Lee of Alcheon who found the egg at Najeong.',
		quote: 'Dig where the horse kneels. The country begins in the hole.',
		nature: 'Village chief of Alcheon Yangsan-chon (알천 양산촌), head of Geupnyang-bu (급량부). When the white horse bowed and cried at Najeong well in Yangsan, Alpyung was the one who ordered the earth opened — and the great egg lifted out. Surabol Lee (서라벌 이씨) begins here; modern registers call the house Gyeongju Lee (경주 이씨).',
		arc: 'One of the Founding Six Elders who raised the egg-born boy and installed him as king. His village and department survive in the bone-rank census two thousand years later — every True Bone noble who counts Lee blood still owes a fraction of their untouchable pride to the man who dug first.',
		events: [{ year: -57, label: 'With the five other chiefs, crowns Hyukgosé at Seorabeol.' }],
		career: [
			{ title: 'Village chief', korean: '촌장', hanja: '村長', org: 'foundingsix', from: -57, note: 'Alcheon Yangsan-chon · Geupnyang-bu' }
		],
		aliases: ['Lee Alpyung', 'Alpyung', '알평', '閼平']
	},
	{
		id: 'sobuldori',
		gender: 'm',
		name: 'Sobuldori',
		korean: '소벌도리',
		hanja: '蘇伐都利',
		kingdom: 'silla',
		clan: 'clan-surabol-choi',
		title: 'Chief of Dolsan Goheo-chon · Saryang-bu',
		tagline: 'The Choi of Dolsan — elder whose line still speaks in Surabol’s councils.',
		quote: 'A chief serves the boy he raised, not the myth he prefers.',
		nature: 'Village chief of Dolsan Goheo-chon (돌산 고허촌), head of Saryang-bu (사량부). Surabol Choi (서라벌 최씨) — modern Gyeongju Choi (경주 최씨). Alchun of the Hwarang counts him among his ancestors without ever making a speech of it; the chronicle only notes that the tiger-catcher’s courtesy is older than his liberalism.',
		arc: 'Founding elder of the Choi line that would become one of the six great houses of Seorabeol. When the six installed Hyukgosé, Sobuldori held the Saryang seat — horse, tribute, and the kind of practical loyalty that outlasts thrones.',
		events: [{ year: -57, label: 'Raises Hyukgosé with the five other chiefs.' }],
		career: [
			{ title: 'Village chief', korean: '촌장', hanja: '村長', org: 'foundingsix', from: -57, note: 'Dolsan Goheo-chon · Saryang-bu' }
		],
		aliases: ['Choi Sobuldori', 'Sobuldori', '소벌도리', '蘇伐都利']
	},
	{
		id: 'jibekho',
		gender: 'm',
		name: 'Jibekho',
		korean: '지백호',
		hanja: '支伯忽',
		kingdom: 'silla',
		clan: 'clan-surabol-jeong',
		title: 'Chief of Chuisan Jinji-chon · Bonpi-bu',
		tagline: 'The Jeong of Chuisan — Bonpi-bu and the census of who counts.',
		quote: 'Register the living before you praise the omen.',
		nature: 'Village chief of Chuisan Jinji-chon (취산 진지촌), head of Bonpi-bu (본피부) — the department that keeps lineage and rank. Surabol Jeong (서라벌 정씨); modern Gyeongju Jeong (경주 정씨).',
		arc: 'Founding elder whose Bonpi seat would later echo in every bone-rank argument — who is True Bone, who is head rank, who is not counted at all. He raised the egg-born king knowing the country would need a ledger as much as a crown.',
		events: [{ year: -57, label: 'One of six chiefs who crown Hyukgosé.' }],
		career: [
			{ title: 'Village chief', korean: '촌장', hanja: '村長', org: 'foundingsix', from: -57, note: 'Chuisan Jinji-chon · Bonpi-bu' }
		],
		aliases: ['Jung Jibekho', 'Jeong Jibekho', 'Jibekho', '지백호', '支伯忽']
	},
	{
		id: 'gurema',
		gender: 'm',
		name: 'Gurema',
		korean: '구례마',
		hanja: '仇禮摩',
		kingdom: 'silla',
		clan: 'clan-surabol-son',
		title: 'Chief of Musan Daesu-chon · Jeomnyang-bu',
		tagline: 'The Son of Musan — old hall, old horse, old pride.',
		quote: 'The oldest houses do not ask to be loved. They ask to be remembered.',
		nature: 'Village chief of Musan Daesu-chon (무산 대수촌), head of Jeomnyang-bu (점량부). Surabol Son (서라벌 손씨); modern Gyeongju Son (경주 손씨). The chronicle never states Bidam’s kinship outright — only implies it in the jaw, the black robe, and the way he treats Surabol as a country that must stay clean and his.',
		arc: 'Founding elder of the Son line. Musan’s hall would still be called one of Surabol’s oldest when Bidam and Yushin trade gyuku wins twelve centuries later — though Bidam’s blood is elder-founder, not Gaya. Gurema’s descendants wear True Bone purple and behave as if the founding covenant were a private inheritance.',
		events: [{ year: -57, label: 'Installs Hyukgosé with the five other village chiefs.' }],
		career: [
			{ title: 'Village chief', korean: '촌장', hanja: '村長', org: 'foundingsix', from: -57, note: 'Musan Daesu-chon · Jeomnyang-bu' }
		],
		aliases: ['Son Gurema', 'Gurema', '구례마', '仇禮摩']
	},
	{
		id: 'jita',
		gender: 'm',
		name: 'Jita',
		korean: '지타',
		hanja: '支陀',
		kingdom: 'silla',
		clan: 'clan-surabol-bae',
		title: 'Chief of Geumsan Gari-chon · Hangi-bu',
		tagline: 'The Bae of Geumsan — Hangi-bu and the hill forts.',
		quote: 'Gold mountain, iron gate — hold both.',
		nature: 'Village chief of Geumsan Gari-chon (금산 가리촌), head of Hangi-bu (한기부). Surabol Bae (서라벌 배씨); modern Gyeongju Bae (경주 배씨).',
		arc: 'Founding elder of the Bae house — one of six who presented the boy from Najeong to the six villages as their king. His Geumsan seat guarded the ridges above the young capital.',
		events: [{ year: -57, label: 'Crowns Hyukgosé with Alpyung, Sobuldori, Jibekho, Gurema, and Hojin.' }],
		career: [
			{ title: 'Village chief', korean: '촌장', hanja: '村長', org: 'foundingsix', from: -57, note: 'Geumsan Gari-chon · Hangi-bu' }
		],
		aliases: ['Bae Jita', 'Jita', '지타', '支陀']
	},
	{
		id: 'hojin',
		gender: 'm',
		name: 'Hojin',
		korean: '호진',
		hanja: '戶珍',
		kingdom: 'silla',
		clan: 'clan-surabol-seol',
		title: 'Chief of Myeonghwalsan Goya-chon · Seupbi-bu',
		tagline: 'The Seol of Myeonghwalsan — Seupbi-bu and the rites that bind six to one.',
		quote: 'Six hearths, one smoke — that is a kingdom.',
		nature: 'Village chief of Myeonghwalsan Goya-chon (명활산 고야촌), head of Seupbi-bu (습비부). Surabol Seol (서라벌 설씨); modern Gyeongju Seol (경주 설씨).',
		arc: 'Founding elder who kept the rites when the six villages became Seorabeol. Seupbi — the wet rites, the binding ceremonies — are his department’s echo in every later coronation the Harmony Council argues over.',
		events: [{ year: -57, label: 'One of six chiefs at Hyukgosé’s founding.' }],
		career: [
			{ title: 'Village chief', korean: '촌장', hanja: '村長', org: 'foundingsix', from: -57, note: 'Myeonghwalsan Goya-chon · Seupbi-bu' }
		],
		aliases: ['Seol Hojin', 'Hojin', '호진', '戶珍']
	},
	{
		id: 'hyukgose',
		gender: 'm',
		avatar: '/ch_hyukgose.png',
		name: 'Hyukgosé',
		korean: '혁거세',
		hanja: '赫居世',
		entity: 'god',
		godTier: 'demigod',
		kingdom: 'silla',
		born: -69,
		died: 4,
		boneRank: 'Sacred Bone (성골)',
		tagline: 'Born from the egg at Najeong — bright light ruling the world, not luck.',
		quote: 'One person to cherish, one person to serve — and the moon over Seorabeol is enough.',
		nature: 'Egg-born, not hall-born: the white horse knelt and cried at Najeong well in Yangsan; the Founding Six Elders dug where it stood and lifted a great egg; the shell opened on a beautiful boy already kingly in the face. Named Hyukgosé —赫居世, to rule with brightness — he was prodigy before policy: quick to learn, just in judgment, the land answering him as if it had been waiting. Crowned young — tradition says thirteen — he is founding king energy, not a passive omen. Sacred Bone by exception: no elder blood, no village chief for a father; the six raised and installed him, and later True Bone nobles would claim the elders’ descent as if founding privilege were a hereditary coat.',
		arc: 'The six village chiefs — Alpyung, Sobuldori, Jibekho, Gurema, Jita, Hojin — find the egg, raise the boy, and crown him first king of Seorabeol (-57). He governs long beside Alyoung, the dragon-born queen from Alyeongjeong well: two omen-children who recognize each other, desire and destiny in one marriage, co-founders not ornament. Together they teach the country its first grammar — one to cherish, one to serve — before law arrives in six ranks and six clans. Their joint reign sets the moon over Surabol as quiet sign; a son Namhae succeeds in the records though the chronicle’s lens jumps forward to later crowns. When Bone Rank hardens, Hyukgosé and Alyoung remain the sacred exception — egg and dragon — while Yushin’s Gaya Kim line enters as the outsider who out-loves the centre.',
		events: [
			{ year: -69, label: 'Born from the egg at Najeong well, Yangsan.' },
			{ year: -57, label: 'Crowned first ruler of Seorabeol by the Founding Six Elders.' },
			{ label: 'Long joint reign with Lady Alyoung; co-founds early Silla.' }
		],
		career: [
			{ title: 'King of Seorabeol', korean: '거서간', hanja: '居西干', org: 'sillaroyal', from: -57 }
		],
		aliases: ['Hyukgosé', 'Hyukgose', 'Hyeokgeose', 'Park Hyukgose', '박혁거세']
	},
	{
		id: 'alyoung',
		gender: 'f',
		avatar: '/ch_alyoung.png',
		name: 'Lady Alyoung',
		korean: '알영부인',
		hanja: '閼英夫人',
		entity: 'god',
		godTier: 'demigod',
		kingdom: 'silla',
		title: 'First queen of Seorabeol',
		boneRank: 'Sacred Bone (성골)',
		tagline: 'Born from a Chicken Dragon’s rib at Alyeongjeong — matched omen, matched will.',
		quote: 'Two births for one kingdom — egg and dragon, not alliance alone.',
		nature: 'Dragon-born parallel to the egg: at Alyeongjeong (알영정) well a Chicken Dragon (계룡) left its left rib in the earth, and from it Alyoung rose — extraordinary birth, not a later political match. As capable as Hyukgosé; co-founder queen who reads omens and rooms with the same speed. Sacred Bone by the same exception as her husband — well-born, not elder-descended — and the chronicle never lets her become scenery.',
		arc: 'She and Hyukgosé fall in love as two omen-children who know what the other is — marriage as desire and destiny, the sacred pair of early Silla. Beside him she co-rules Seorabeol through the long founding years: rites, villages, the six clans learning to answer one crown. The herald will joke that the country started in a kitchen — one from an egg, one from a chicken — and miss that both births were throne-sized. With Hyukgosé she sets the pattern later Sacred Bone queens will exhaust: holiness worn as duty, not decoration.',
		binyeo: 'Porcelain egg binyeo — blue-white glaze on a gold plum branch; the well-born mark beside the egg-born king.',
		binyeoImage: '/bn_alyoung.png',
		events: [
			{ label: 'Born from a Chicken Dragon at Alyeongjeong well.' },
			{ label: 'Marries Hyukgosé; co-founds Seorabeol through a long joint reign.' }
		],
		career: [
			{ title: 'Queen of Seorabeol', korean: '왕후', hanja: '王后', org: 'sillaroyal', from: -57 }
		],
		aliases: ['Lady Alyoung', 'Alyoung', '알영', 'Alyeong']
	},
	{
		id: 'dangun',
		avatar: '/ch_dangun.png',
		name: 'Dangun',
		korean: '단군',
		hanja: '檀君',
		entity: 'god',
		godTier: 'demigod',
		gender: 'm',
		kingdom: 'joseon',
		title: 'Grandson of Heaven · god-king of Asadal',
		realm: { en: 'Old Joseon', ko: '고조선' },
		tagline: 'Demigod — Grandson of Heaven; first earthly steward of the mandate.',
		quote: 'Heaven descends. Someone must stay and govern.',
		arc: 'Grandson of Heaven: Hwanin’s line through Hwanung and the Bear-Woman — demigod founder kept among the Gods. Where the Son of Heaven descends, Dangun stays — founding Asadal as the first court that speaks for heaven on earth, the way later crowns will claim a mandate they did not invent.',
		career: [
			{ title: 'God-king of Asadal', korean: '왕검', hanja: '王儉', org: 'nation-joseon' }
		],
		aliases: ['Dangun', 'Dangun Wanggeom', 'Grandson of Heaven']
	},
	{
		id: 'ugeo',
		gender: 'm',
		name: 'King Ugeo',
		korean: '우거왕',
		kingdom: 'joseon',
		died: -108,
		tagline: 'The last king of Old Joseon, betrayed from inside his own walls.',
		quote: 'A gate kept by traitors is already open.',
		events: [{ year: -108, label: 'Wanggeom falls to the Han; the Four Commanderies begin.' }],
		career: [
			{ title: 'King of Old Joseon', korean: '왕', hanja: '王', org: 'nation-joseon', to: -108 }
		],
		aliases: ['King Ugeo', 'Ugeo']
	},
	{
		id: 'kyunhwon',
		gender: 'm',
		avatar: '/ch_kyun_hwon.png',
		name: 'Kyun Hwon',
		korean: '견훤',
		hanja: '甄萱',
		kingdom: 'baekje',
		born: 867,
		died: 936,
		tagline: 'Three centuries later, the man who calls himself Baekje’s revenge.',
		quote: "Later kingdoms still steal earlier tricks.",
		events: [{ year: 900, label: 'Founds Later Baekje at Wansanju.' }],
		career: [
			{ title: 'King of Later Baekje', korean: '왕', hanja: '王', from: 900 }
		],
		aliases: ['Kyun Hwon']
	},
	{
		id: 'wanggun',
		gender: 'm',
		avatar: '/ch_wang_gun.png',
		name: 'Wang Geon',
		korean: '왕건',
		hanja: '王建',
		kingdom: 'joseon',
		born: 877,
		died: 943,
		tagline: 'The vision Yeon dies seeing: Goryeo, reborn under another man.',
		quote: 'Unify first. Explain after.',
		events: [{ year: 918, label: 'Founds Goryeo, heir to Goguryeo’s name.' }],
		career: [
			{ title: 'King of Goryeo', korean: '왕', hanja: '王', from: 918 }
		],
		aliases: ['Wang Gun', 'Wang Geon']
	},
	{
		id: 'gyeonggeunchogo',
		gender: 'm',
		avatar: '/ch_gunchogo.png',
		name: 'King Geunchogo',
		korean: '근초고왕',
		hanja: '近肖古王',
		kingdom: 'baekje',
		died: 375,
		tagline: 'The Hurricane — Baekje at high tide, a king of Goguryeo dead at his feet.',
		quote: "Wealth is a kind of weather. Ride it.",
		events: [
			{ year: 371, label: 'Kills King Gogugwon at Pyongyang.' },
			{ year: 372, label: 'Sends the Seven-Branched Sword to Wa.' }
		],
		career: [
			{ title: 'King', korean: '근초고왕', hanja: '近肖古王', org: 'nation-baekje', to: 375 }
		],
		aliases: ['King Geunchogo', 'Geunchogo', 'Gunchogo']
	},
	{
		id: 'dongchun',
		gender: 'm',
		name: 'King Dongcheon',
		korean: '동천왕',
		hanja: '東川王',
		kingdom: 'goguryeo',
		born: 209,
		died: 248,
		bornApprox: true,
		clan: 'clan-go',
		tagline: 'Took five thousand horse onto ground he never looked at — eighteen thousand lost by dusk.',
		quote: '…I did not look at the ground.',
		arc: 'Eleventh king of Goguryeo. When the Wei regent Guanqiu Jian marched in 244, Dongcheon answered with cavalry pride instead of scouts — the Yangmaek plain swallowed his host. Hwando burned; he fled east in borrowed robes while an officer walked out wearing the crown and died in his place.',
		events: [
			{ year: 209, label: 'Succeeds his father Sangno as king.' },
			{ year: 244, label: 'Loses the Yangmaek campaign to Wei; Hwando falls.' },
			{ year: 248, label: 'Dies; buried at Wanhang.' }
		],
		career: [
			{ title: 'King of Goguryeo', korean: '왕', hanja: '王', org: 'nation-goguryeo', from: 209, to: 248 }
		],
		aliases: ['King Dongcheon', 'Dongcheon', 'Dongchun', '동천왕', '東川王']
	},
	{
		id: 'gwanggaeto',
		gender: 'm',
		avatar: '/ch_gwanggaeto.png',
		name: 'Gwanggaeto the Great',
		korean: '광개토대왕',
		hanja: '廣開土大王',
		kingdom: 'goguryeo',
		born: 374,
		died: 413,
		tagline: 'The Conqueror — sixty-four fortresses, and a stele to list them.',
		quote: "Expand until the stele runs out of space.",
		events: [
			{ year: 391, label: 'Takes the throne at eighteen.' },
			{ year: 400, label: 'Rescues Silla from Wa with fifty thousand riders.' },
			{ year: 413, label: 'Dies at thirty-nine.' }
		],
		career: [
			{ title: 'King', korean: '태왕', hanja: '太王', org: 'nation-goguryeo', from: 391 }
		],
		aliases: ['Gwanggaeto']
	},
	{
		id: 'jomei',
		gender: 'm',
		name: 'King Jomei',
		korean: '조메이 천황',
		kingdom: 'yamato',
		born: 593,
		died: 641,
		tagline: 'Yamato’s king, watching the continent try a new fashion in queens.',
		quote: "An eastern king watches western weather.",
		career: [
			{ title: 'Emperor', korean: '천황', hanja: '天皇', org: 'nation-yamato', from: 629 }
		],
		aliases: ['King Jomei', 'Jomei']
	},
	{
		id: 'euljae',
		avatar: '/ch_eulje.png',
		name: 'Euljé',
		korean: '을제',
		kingdom: 'silla',
		gender: 'm',
		title: 'Premier (상대등) of the Harmony Council',
		tagline: 'The Premier who held the first chair the night six sleeves named a queen.',
		quote: 'Tonight the better option is a confession.',
		nature: 'Chairs by waiting for a better option — until Bidam forces him to admit there is none but Dukman. Steadies the early reign afterward with the fatigue of a man who has already lost an argument that saved the country.',
		arc: 'In 632 he withholds on the initial vote for a woman king, then yields on the final vote when Bidam leaves him no ghost to invent. Remains Premier into Sunduk’s first years.',
		career: [
			{ title: 'Premier', korean: '상대등', hanja: '上大等', org: 'harmonycouncil', from: 632, to: 645 }
		],
		aliases: ['Euljé', 'Eulje', '을제', 'Premier Euljé']
	},
	{
		id: 'supum',
		gender: 'm',
		avatar: '/ch_supum.png',
		name: 'Kim Supum',
		korean: '김수범',
		hanja: '金述品',
		title: 'Premier (상대등) of the Harmony Council',
		kingdom: 'silla',
		tagline: 'Succeeds Euljé in the first chair — the steadier hand while the yard’s old boys argue succession.',
		quote: 'The room must finish its vote before the country finishes its patience.',
		nature: 'A councillor who becomes premier by outlasting argument, not by winning one. Chairs the unanimity rule without treating it as theatre — which makes Bidam’s withheld hand feel louder than a shout.',
		arc: 'In 645 he takes the premier’s seat when Euljé steps down. Holds the council through the Seungman veto and into the season when Bidam raises men at Radiance. The chronicle names him less than the rebels; the grain ledger names him daily.',
		career: [
			{ title: 'Councillor', korean: '대등', hanja: '大等', org: 'harmonycouncil', from: 632, to: 645 },
			{ title: 'Premier', korean: '상대등', hanja: '上大等', org: 'harmonycouncil', from: 645, to: 647 }
		],
		aliases: ['Supum', 'Kim Supum', '수범', '述品', 'Premier Supum']
	},
	{
		id: 'murim',
		gender: 'm',
		name: 'Kim Murim',
		korean: '김무림',
		hanja: '金無林',
		kingdom: 'silla',
		clan: 'clan-gyeongju-kim',
		boneRank: 'True Bone (진골)',
		tagline: 'Harmony Councillor — one of the six sleeves in the Seungman vote.',
		quote: 'Raise your hand when the room has stopped pretending.',
		events: [{ year: 647, label: 'Raises his sleeve for Princess Seungman (Jinduk) against Bidam’s veto.' }],
		career: [
			{ title: 'Councillor', korean: '대등', hanja: '大等', org: 'harmonycouncil', from: 632 }
		],
		aliases: ['Murim', 'Kim Murim', '무림', '無林']
	},
	{
		id: 'imjong',
		gender: 'm',
		name: 'Kim Imjong',
		korean: '김임종',
		hanja: '金琳宗',
		kingdom: 'silla',
		clan: 'clan-gyeongju-kim',
		boneRank: 'True Bone (진골)',
		tagline: 'Harmony Councillor — counted among the six when Seungman’s name circled the room.',
		quote: 'Unanimity is a roof. One hole is rain.',
		events: [{ year: 647, label: 'Votes with the six for Seungman’s succession.' }],
		career: [
			{ title: 'Councillor', korean: '대등', hanja: '大等', org: 'harmonycouncil', from: 632 }
		],
		aliases: ['Imjong', 'Kim Imjong', '임종', '琳宗']
	},
	{
		id: 'suljong',
		gender: 'm',
		name: 'Kim Suljong',
		korean: '김술종',
		hanja: '金述宗',
		kingdom: 'silla',
		clan: 'clan-gyeongju-kim',
		boneRank: 'True Bone (진골)',
		tagline: 'Harmony Councillor — his sleeve rose with the others until one hand stayed down.',
		quote: 'I vote with the weather once it starts.',
		events: [{ year: 647, label: 'Among the six daedeung who raised for Seungman.' }],
		career: [
			{ title: 'Councillor', korean: '대등', hanja: '大等', org: 'harmonycouncil', from: 632 }
		],
		aliases: ['Suljong', 'Kim Suljong', '술종', '述宗']
	},
	{
		id: 'yumjang',
		gender: 'm',
		name: 'Kim Yumjang',
		korean: '김염장',
		hanja: '金染璋',
		kingdom: 'silla',
		clan: 'clan-gyeongju-kim',
		boneRank: 'True Bone (진골)',
		tagline: 'Harmony Councillor — not to be confused with Radiance’s Yumjong; the minutes never are.',
		quote: 'Same surname, different banner.',
		events: [{ year: 647, label: 'Sixth sleeve up for Seungman — not the rebel Yumjong of 647.' }],
		career: [
			{ title: 'Councillor', korean: '대등', hanja: '大等', org: 'harmonycouncil', from: 632 }
		],
		aliases: ['Yumjang', 'Kim Yumjang', '염장', '染璋']
	},
	{
		id: 'pumil',
		gender: 'm',
		avatar: '/ch_pumil.png',
		name: 'Kim Pumil',
		korean: '김품일',
		hanja: '金品日',
		kingdom: 'silla',
		title: 'General · minor Harmony Councillor',
		tagline: 'Right column at Hwangsan — Gwanchang’s father; a sleeve the council barely counts.',
		quote: 'My son’s face is as if he lived.',
		arc: 'A minor daedeung who held the southern road at the Yellow Mountain Fields. When Gwanchang’s head came back tied to the saddle, Pumil took it up by the hair — and the wet sleeve broke Silla’s hesitation harder than any speech.',
		events: [{ year: 660, label: 'Commands Silla’s right column at Hwangsanbeol.' }],
		family: [{ id: 'gwanchang', role: 'Son' }],
		career: [
			{ title: 'Councillor', korean: '대등', hanja: '大等', org: 'harmonycouncil', from: 640, note: 'minor seat' },
			{ title: 'General', korean: '장군', hanja: '將軍', from: 660, to: 660 }
		],
		aliases: ['Pumil', 'Kim Pumil', '품일', '品日']
	},
	{
		id: 'daedeung_stern',
		name: 'The Stern Councillor',
		korean: '엄한 대등',
		kingdom: 'silla',
		gender: 'm',
		boneRank: 'True Bone (진골)',
		tagline: 'Withholds for fear of foreign laughter — then rises rather than keep a fortress empty for pride.',
		quote: 'Do not thank me. I am only refusing a worse shame.',
		career: [
			{ title: 'Councillor', korean: '대등', hanja: '大等', org: 'harmonycouncil', from: 632 }
		],
		aliases: ['The Stern Councillor', 'Stern Councillor']
	},
	{
		id: 'daedeung_old',
		name: 'The Old Councillor',
		korean: '늙은 대등',
		kingdom: 'silla',
		gender: 'm',
		boneRank: 'True Bone (진골)',
		tagline: 'Guards the song cut for men’s shoulders — until he admits the egg never asked.',
		quote: 'I am not pleased. But I am not a liar.',
		career: [
			{ title: 'Councillor', korean: '대등', hanja: '大等', org: 'harmonycouncil', from: 632 }
		],
		aliases: ['The Old Councillor', 'Old Councillor']
	},
	{
		id: 'daedeung_fear',
		name: 'The Fearful Councillor',
		korean: '두려워하는 대등',
		kingdom: 'silla',
		gender: 'm',
		boneRank: 'True Bone (진골)',
		tagline: 'Raises first out of fear of an empty seat — and begs Bidam to move the rest.',
		quote: 'Bidam — make him move. I cannot.',
		career: [
			{ title: 'Councillor', korean: '대등', hanja: '大等', org: 'harmonycouncil', from: 632 }
		],
		aliases: ['The Fearful Councillor', 'Fearful Councillor']
	},

	// ————————————————————————— Baekje —————————————————————————
	{
		id: 'gyebek',
		gender: 'm',
		avatar: '/ch_gyebek.png',
		name: 'Gyebek',
		korean: '계백',
		hanja: '階伯',
		title: 'General of Baekje',
		kingdom: 'baekje',
		born: 620,
		died: 660,
		bornApprox: true,
		tagline: '“I will complete my duty.”',
		ideology: 'Apolitical soldier-ethic',
		ideologyNote: 'Duty without a platform; numbers and promises over factions and -isms.',
		quote: 'I will complete my duty.',
		firstLine: {
			en: 'Nineteen.',
			ko: '열아홉.'
		},
		lastLine: {
			en: 'Your Majesty… I have completed my duty.',
			ko: '폐하… 소신의 임무를 마쳤나이다.'
		},
		nature: 'Epitome of focus. Traumatic past, emotions suppressed or delayed, endlessly loyal, allergic to politics. He hears sentences at their exact width — misses jokes, misreads faces, trusts numbers because numbers do not lie. Euija’s soft spot and Euija’s pupil: taught the world’s dirt without ever learning to love the game. When the kingdom is already lost, focus is what remains — five thousand against the arithmetic of survival.',
		arc: 'Found half-drowned by a prince and named after a turtle, Gyebek has no clan and therefore no ceiling and no floor — passed over for command, then shipped to Tamla by the Eight Clans (Minister Satek reading the sealed order) while Euija is locked in mourning. Recalled only when the kingdom is already lost. He hears every sentence at its exact width: he does not catch a joke, cannot read a face, counts what he can count because numbers do not lie to him, and keeps a promise past the point where keeping it makes sense. It is what makes him unbearable at court and unbreakable in a field. He answers with five thousand men against fifty thousand, killing his own family first so that nothing can be used against him.',
		blade: 'Single-edged phoenix blade — curved like an eastern sword, phoenix on the ring pommel; one side only, as he is.',
		swordImage: '/sword_lotus.png',
		events: [
			{ year: 632, label: 'Named by the crown prince Euija.' },
			{ year: 655, label: 'Clans exile him to Tamla while Euija mourns; Euija learns and rages.' },
			{ year: 660, label: 'Recalled. Kills his family, marches with 5,000, dies at Hwangsanbeol — names Kangrim & Haewonmek from 「차사본풀이」.' }
		],
		sobriquets: [
			'Greatest Blade of Samhan',
			'Hundred-Victories Gyebek',
			'Hundred Victories',
			'백전불패 계백',
			'백전불패'
		],
		career: [
			{ title: 'General', korean: '달솔', hanja: '達率', org: 'ministersassembly', from: 660 }
		],
		aliases: [
			'Gyebek',
			'Hundred-Victories Gyebek',
			'Hundred-Victories',
			'Hundred Victories',
			'백전불패 계백',
			'백전불패'
		]
	},
	{
		id: 'kingmu',
		gender: 'm',
		avatar: '/ch_mu.png',
		name: 'King Mu',
		korean: '무왕',
		hanja: '武王',
		title: '30th Eraha of Baekje',
		kingdom: 'baekje',
		clan: 'clan-buyeo',
		born: 561,
		died: 641,
		bornApprox: true,
		tagline: 'Euija’s father; spent a long reign grinding against Silla.',
		quote: "Finish what I started — or do not wear my name.",
		arc: 'Long-reigning Baekje king before Euija’s catastrophe — the silhouette on the Buyeo chart, father of fifty sons and the war Silla never forgot.',
		events: [
			{ year: 600, label: 'Succeeds as 30th Eraha of Baekje.' },
			{ year: 636, label: 'Sends spies toward Silla; broken at Jade Gate Valley.' },
			{ year: 641, label: 'Dies; Euija takes the throne vowing to finish his war.' }
		],
		career: [
			{ title: 'King', korean: '무왕', hanja: '武王', org: 'nation-baekje', from: 600, note: '30th Eraha' }
		],
		aliases: ['King Mu', 'Mu of Baekje', '무왕']
	},
	{
		id: 'seongchung',
		gender: 'm',
		name: 'Sungchung',
		korean: '성충',
		kingdom: 'baekje',
		died: 656,
		tagline: 'Told the king the truth and starved in prison for it.',
		ideology: 'Constitutional royalist',
		ideologyNote: 'Warns kings against hollowing their own counsel and chanting grudges into foreign ears.',
		quote: "Truth spoken once is still a weapon.",
		events: [{ year: 656, label: 'Dies imprisoned, leaving instructions on how to defend Baekje.' }],
		aliases: ['Sungchung', 'Seongchung']
	},
	{
		id: 'yung',
		name: 'Prince Yung',
		korean: '부여융',
		kingdom: 'baekje',
		born: 615,
		bornApprox: true,
		gender: 'm',
		avatar: '/ch_yung.png',
		clan: 'clan-buyeo',
		clans: ['clan-satek'],
		clanBy: { 'clan-satek': 'blood' },
		tagline: 'First of the five — Satek’s eldest, stripped of the crown-prince mark.',
		quote: 'I was eldest. That used to be a strategy.',
		nature: 'Pride with the furniture removed. Mother’s house is Satek — tutors, berths, inevitability — until Euija decides that is the problem. Desire: the mark back, or at least respect. Wound: Euija choosing Hyo because Satek had already chosen Yung. Voice: short, cold, then suddenly too quiet. Not to be confused with Prince Yun (연 / 부여연) — different brother, different syllable.',
		arc: 'First of Euija’s five important princes (of fifty-odd): favoured eldest, Satek-maternal through and through, until Euija (and Eungo) cut the crown-prince mark and give it to Hyo. The rivalry with Hyo and the other brothers hardens through the wine years. At Sabi he kneels for Gotaso before Bupmin. At the White River he stands opposite Pung — Tang-side captive prince versus restoration king — the family feud finished in a river mouth.',
		events: [
			{ year: 655, label: 'Demoted from crown prince in favour of Hyo.' },
			{ year: 660, label: 'Surrenders at Sabi; cursed for Gotaso’s death.' },
			{ year: 663, label: 'Opposite Pung at the White River.' }
		],
		family: [
			{ id: 'euija', role: 'Father' },
			{ id: 'tae', role: 'Brother' },
			{ id: 'hyo', role: 'Brother' },
			{ id: 'yun', role: 'Brother' },
			{ id: 'pung', role: 'Brother' }
		],
		career: [
			{ title: 'Crown Prince', korean: '태자', hanja: '太子', org: 'nation-baekje', from: 632, to: 655 },
			{ title: 'Prince of Baekje', korean: '왕자', org: 'nation-baekje', from: 655 }
		],
		aliases: ['Prince Yung', 'Buyeo Yung', 'Yung', '부여융']
	},
	{
		id: 'tae',
		name: 'Prince Tae',
		korean: '부여태',
		hanja: '扶餘泰',
		kingdom: 'baekje',
		born: 616,
		bornApprox: true,
		gender: 'm',
		avatar: '/ch_tae.png',
		clan: 'clan-buyeo',
		clans: ['clan-jinmo'],
		clanBy: { 'clan-jinmo': 'blood' },
		tagline: 'Second of the five — Jinmo’s quiet claim beside Satek’s eldest.',
		quote: 'Eldest is a title. Second is a ledger.',
		nature: 'Second-son competence with Jinmo maternal arithmetic in his sleeves — prestige house, not the queen’s Satek. Desire: to be counted without needing Yung’s mark. Wound: always one year and one faction behind the favourite. Voice: dry, ledger-clean, allergic to sleeve poetry.',
		arc: 'Second of Euija’s five important princes (of fifty-odd). While Yung breathes Satek and Hyo waits in Eungo’s rooms, Tae is the Jinmo whisper: berths counted, tutors unpaid by the sleeve, a second son the Assembly already treats as a spare key. Seated with the forty-one in 655; flees with the court when Sabi cracks; disappears into Tang’s ledger the way second sons do when eldests become symbols.',
		events: [
			{ year: 632, label: 'Named among Euija’s five watched sons — Jinmo’s favourite arithmetic.' },
			{ year: 655, label: 'Seated over emptied clan chairs with his brothers.' },
			{ year: 660, label: 'Sabi falls; Tang’s lists keep his name a while, then not.' }
		],
		family: [
			{ id: 'euija', role: 'Father' },
			{ id: 'yung', role: 'Brother' },
			{ id: 'hyo', role: 'Brother' },
			{ id: 'yun', role: 'Brother' },
			{ id: 'pung', role: 'Brother' }
		],
		aliases: ['Prince Tae', 'Buyeo Tae', 'Tae', '부여태']
	},
	{
		id: 'yun',
		name: 'Prince Yun',
		korean: '부여연',
		hanja: '扶餘演',
		kingdom: 'baekje',
		born: 620,
		bornApprox: true,
		gender: 'm',
		avatar: '/ch_yun.png',
		clan: 'clan-buyeo',
		clans: ['clan-hae'],
		clanBy: { 'clan-hae': 'blood' },
		tagline: 'Fourth of the five — Hae salt; not Yung, not Yunbi, not Yeon Gesomun.',
		quote: 'Yun is 연 — a different syllable. Write it once.',
		nature: 'Fourth-son watchfulness with Hae maternal salt — coast house, not the Yunbi clan (연비 / 燕比; a different 연 compound), and never to be confused with Prince Yung (융). Korean is 연 (부여연 / 扶餘演), not 윤. English running name is Prince Yun or Buyeo Yun — never bare “Yeon,” and never Yeon Gesomun’s Goguryeo clan (연 / 淵). Desire: a chair that is not a typo for someone else’s feud. Wound: a name the street keeps mishearing. Voice: soft, exact, corrects spellings without raising volume.',
		arc: 'Fourth of Euija’s five important princes (of fifty-odd). Between Hyo’s sudden crown and Pung’s eastern parking, Prince Yun is the Hae-hooked middle weight: useful at harbours, easy to overlook in succession theatre, easy to confuse with Yung if you only hear the first consonant — and easy for lazy English to misfile under Yeon Gesomun’s house. The chronicle keeps him Baekje royal: Buyeo Yun / 부여연 — 연, not 융, not the misheard 윤; Hae maternal, not Yunbi (연비); not the Yeon (淵) of Pyongyang.',
		events: [
			{ year: 632, label: 'Named among the five — already correcting who he is not.' },
			{ year: 655, label: 'Seated with the sons; Hae loses another quiet claim.' },
			{ year: 660, label: 'Sabi falls; another prince into the captive arithmetic.' }
		],
		family: [
			{ id: 'euija', role: 'Father' },
			{ id: 'yung', role: 'Brother' },
			{ id: 'tae', role: 'Brother' },
			{ id: 'hyo', role: 'Brother' },
			{ id: 'pung', role: 'Brother' }
		],
		aliases: ['Prince Yun', 'Buyeo Yun', 'Yun', '부여연', '扶餘演']
	},
	{
		id: 'pung',
		name: 'Prince Pung',
		korean: '부여풍',
		title: 'King Pungjang of the Baekje Restoration Army',
		kingdom: 'baekje',
		born: 624,
		bornApprox: true,
		gender: 'm',
		avatar: '/ch_pung.png',
		clan: 'clan-buyeo',
		clans: ['clan-mokli'],
		clanBy: { 'clan-mokli': 'blood' },
		tagline: '“Blood remembers a country that forgot your face.”',
		quote: 'Chunchu, you wretch… how dare you, to His Majesty…!',
		firstLine: {
			en: 'Low ground it may be — but why should we not move?',
			ko: '낮은 땅일지언정 — 어찌 옮기지 않겠는가?'
		},
		lastLine: {
			en: 'Chunchu, you wretch… how dare you, to His Majesty…!',
			ko: '춘추 놈… 감히 폐하께…!'
		},
		nature: 'Exile polish over Baekje panic. Mother’s house whispers Mokli — timber, eastern berths, a clan that already looks across the water — before the court parks him in Yamato. Desire: to be more than a souvenir. Wound: the country that shipped him out and only wanted him back as a flag. Voice: formal, slightly foreign-accented royal, brittle when contradicted.',
		arc: 'Fifth of Euija’s five important princes (of fifty-odd). Seated among the sons over the Eight Clans, Mokli-maternal enough to make an eastern berth feel like destiny, then parked in Yamato long enough to forget Sabi’s smell. Returns as the only usable prince for the Baekje Restoration Army — crowned Pungjang over a ragtag host that is mostly not Eight-Clan. Executes Boksin, trusts too many sails, and meets Yung as an enemy at the White River: brothers who chose opposite salvations.',
		stages: [
			{
				id: 'prince',
				until: 661,
				name: 'Prince Pung',
				korean: '부여풍',
				title: 'Prince of Baekje',
				label: 'As Prince Pung',
				avatar: '/ch_pung.png'
			},
			{
				id: 'king',
				from: 661,
				name: 'King Pungjang',
				korean: '풍장왕',
				title: 'King Pungjang of the Baekje Restoration Army',
				label: 'As King Pungjang',
				avatar: '/ch_pungjang.png'
			}
		],
		events: [
			{ year: 655, label: 'Seated over emptied clan chairs with the other sons.' },
			{ year: 661, label: 'Returns from Yamato; crowned by the BRA.' },
			{ year: 663, label: 'Executes Boksin; loses everything at the White River opposite Yung.' }
		],
		family: [
			{ id: 'euija', role: 'Father' },
			{ id: 'yung', role: 'Brother' },
			{ id: 'tae', role: 'Brother' },
			{ id: 'hyo', role: 'Brother' },
			{ id: 'yun', role: 'Brother' }
		],
		career: [
			{ title: 'Prince of Baekje', korean: '왕자', org: 'nation-baekje', from: 655, to: 661 },
			{ title: 'King Pungjang', korean: '풍장왕', org: 'restorationarmy', from: 661, to: 663 }
		],
		aliases: ['King Pungjang', 'Prince Pung', 'Pung', 'Pungjang']
	},
	{
		id: 'boksin',
		name: 'Gwishil Boksin',
		korean: '귀실복신',
		kingdom: 'baekje',
		died: 663,
		gender: 'm',
		avatar: '/ch_gwisil_boksin.png',
		clan: 'clan-gwishil',
		tagline: 'BRA’s best general — raised the country twice, could not share the crown once.',
		quote: 'Raise the country twice if once was not enough.',
		nature: 'Competence jealous of theatre. Desire: credit equal to labour. Wound: crowning a Yamato guest who then wanted to move camp. Voice: blunt, managerial, lethal when polite.',
		arc: 'Not Eight-Clan furniture — Gwishil muscle who builds the Baekje Restoration Army with Dochim out of people Sabi ignored. Crowns Pung, resents Pung, kills Dochim, plots sickness, and dies on the king’s order — leaving the BRA one chance and no second brain.',
		events: [
			{ year: 660, label: 'Raises the BRA with Dochim after Sabi.' },
			{ year: 661, label: 'Kills Dochim; crowns Pungjang.' },
			{ year: 663, label: 'Executed by Pung after a failed sickbed plot.' }
		],
		career: [
			{ title: 'General', korean: '장군', hanja: '將軍', org: 'restorationarmy', from: 660, to: 663 }
		],
		aliases: ['Gwishil Bokshin', 'Boksin', 'Bokshin', 'Gwishil Boksin']
	},

	// ————————————————————————— Goguryeo —————————————————————————
	{
		id: 'yeongnyu',
		gender: 'm',
		avatar: '/ch_youngryu.png',
		name: 'King Youngryu',
		korean: '영류왕',
		title: '27th sovereign of Goguryeo',
		kingdom: 'goguryeo',
		clan: 'clan-go',
		born: 583,
		died: 642,
		bornApprox: true,
		tagline: 'Bought peace with tribute until his own commander cut him down.',
		ideology: 'Accommodationist realist',
		ideologyNote: 'Peace-through-tribute faction — survival over pride, until pride butchers the banquet.',
		quote: "Keeping a court alive is its own crime.",
		career: [
			{ title: 'King', korean: '영류왕', org: 'nation-goguryeo', from: 618 }
		],
		aliases: ['King Youngryu', 'Youngryu', 'Yeongnyu', 'King Yeongnyu']
	},
	{
		id: 'bojang',
		gender: 'm',
		avatar: '/ch_bojang.png',
		name: 'King Bojang',
		korean: '보장왕',
		title: '28th and last sovereign of Goguryeo',
		kingdom: 'goguryeo',
		clan: 'clan-go',
		died: 682,
		tagline: '“M-my name? My surname is Go—”',
		ideology: 'Puppet monarchism',
		ideologyNote: 'Crown as hollow legitimacy under a strongman’s weather.',
		quote: 'M-my name? My surname is Go—',
		firstLine: {
			en: 'M-my name? My surname is Go—',
			ko: '내— 내 이름은? 성은 고—'
		},
		lastLine: {
			en: 'M-my name? My surname is Go—',
			ko: '내— 내 이름은? 성은 고—'
		},
		career: [
			{ title: 'King', korean: '보장왕', org: 'nation-goguryeo', from: 642 }
		],
		aliases: ['King Bojang', 'Bojang']
	},
	{
		id: 'yangmanchun',
		gender: 'm',
		avatar: '/ch_guardian.png',
		name: 'The Guardian',
		korean: '안시성주',
		title: 'Guardian of Ansi Fortress',
		kingdom: 'goguryeo',
		born: 610,
		bornApprox: true,
		tagline: 'Wall that stopped an emperor — refused Yeon, refused Tang, held anyway.',
		quote: "You will never be crazier than we are.",
		arc: 'The chronicles never recorded his name; the people of Ansi simply called him the chief. He refuses to bow to the man who butchered the court, flies the old colours over his wall — and then defends that man’s kingdom against the greatest army on earth, handing Taizong the first defeat of his life. Only centuries later did writers give him a name: Yang Manchun.',
		blade: 'Nameless wall sword — ring pommel worn smooth, no crest at all; the fortress was the signature.',
		events: [{ year: 645, label: 'Holds Ansi against Taizong through a summer-long siege.' }],
		sobriquets: ['Guardian of Ansi', 'Wall that Stopped an Emperor'],
		career: [
			{ title: 'Guardian of Ansi', korean: '안시성주', from: 645 }
		],
		aliases: [
			'Commander Yang',
			'Yang Manchun',
			'the Guardian',
			'Guardian',
			'Guardian of Ansi',
			'Wall that Stopped an Emperor'
		]
	},
	{
		id: 'namseng',
		avatar: '/ch_yeon_namseng.png',
		name: 'Yeon Namseng',
		korean: '연남생',
		hanja: '淵男生',
		kingdom: 'goguryeo',
		born: 634,
		died: 679,
		gender: 'm',
		clan: 'clan-yeon',
		tagline: 'Namseng — 男生 — “a son is born”: the name his parents gave when the hall finally had an heir to name.',
		ideology: 'Collaborationist pragmatist',
		ideologyNote: 'Defects toward Tang to survive the house’s collapse — westernization as exit.',
		quote: 'After Gesomun, there is no one in Goryeo who can reach even his shadow.',
		firstLine: {
			en: 'Aw… that’s it? A big rock?',
			ko: '에이… 그게 다야? 큰 바위?'
		},
		lastLine: {
			en: 'At last… I set foot on Pyongyang’s ground—',
			ko: '드디어… 평양 땅에 발을—'
		},
		nature: 'Eldest-son rigidity with a child’s hunger for a father’s rare yes — and the weight of a name that means relief. Desire: to be the blade Gesomun forged. Wound: discovering the forge left no room for brothers, and that he was named for surviving what others did not. Voice: formal, then suddenly vicious when the mark is threatened.',
		blade: 'Ring-pommel crow sword — eldest of the sons’ stamp, kept to Gesomun’s whetstone; it kneels west in 666.',
		arc: 'Named Namseng — a son is born — in the year after the High Summit, when his mother’s hall had finally stopped waiting in silence. Personally raised under Gesomun’s roof — drills, knives, no soft supper — while Yeon Namgun and Yeon Namsan grow up with uncle Jungto and aunt Sooyoung. Succeeds as Supreme Commander; messengers arrive (return address implied, never spoken: Chunchu’s kind of poison) saying each brother wants the other dead. He rides west. The boy who would not kneel in 645 kneels in 666 to finish what the whisper started.',
		events: [
			{ year: 634, label: 'Born Namseng — “a son is born” — after years of quiet; Samsin midwifes beside their portrait in the Eastern hall.' },
			{ label: 'Raised under Gesomun’s strict roof — not Jungto’s.' },
			{ year: 665, label: 'Succeeds his father as Supreme Commander.' },
			{ year: 666, label: 'Ousted by his brothers; defects to the Emperor.' }
		],
		career: [
			{ title: 'Supreme Commander', korean: '대막리지', hanja: '大莫離支', org: 'highsummit', from: 665, to: 666 }
		],
		aliases: ['Yeon Namseng', 'Namseng', '연남생']
	},
	{
		id: 'namgun',
		avatar: '/ch_yeon_namgun.png',
		name: 'Yeon Namgun',
		korean: '연남건',
		hanja: '淵男建',
		kingdom: 'goguryeo',
		born: 637,
		bornApprox: true,
		gender: 'm',
		clan: 'clan-yeon',
		tagline: '“Goguryeo… never dies….!”',
		ideology: 'Hardline nationalist heir',
		ideologyNote: 'Inherits Yeon’s heat without Yeon’s control; purity without an institution.',
		quote: 'Goguryeo… never dies….!',
		firstLine: {
			en: 'Brother.',
			ko: '형.'
		},
		lastLine: {
			en: 'Goguryeo… never dies….!',
			ko: '고구려는… 죽지 않는다….!'
		},
		nature: 'Heat without the eldest’s patience. Desire: to prove Gesomun’s shadow can be worn by a second son. Wound: believing a messenger over a brother. Voice: loud, loyal, easily aimed.',
		blade: 'Ring-pommel crow sword — younger brother of the Five Blades’ stamp.',
		arc: 'Raised by Jungto and Sooyoung while Namseng ate Gesomun’s rules for supper. Takes his brother’s title after the whisper war; makes the last stand at Pyongyang; dies into a kingdom that mistook family logistics for destiny.',
		events: [
			{ label: 'Raised by Jungto and Sooyoung.' },
			{ year: 666, label: 'Seizes Namseng’s title after the poisoned messages.' },
			{ year: 668, label: 'Defends Pyongyang until the gates are opened from within.' }
		],
		career: [
			{ title: 'Supreme Commander', korean: '대막리지', hanja: '大莫離支', org: 'highsummit', from: 666, to: 668 }
		],
		aliases: ['Yeon Namgun', 'Namgun', '연남건']
	},
	{
		id: 'namsan',
		avatar: '/ch_yeon_namsan.png',
		name: 'Yeon Namsan',
		korean: '연남산',
		hanja: '淵男産',
		kingdom: 'goguryeo',
		born: 639,
		died: 701,
		gender: 'm',
		clan: 'clan-yeon',
		tagline: '“Brother…”',
		ideology: 'Opportunist junior',
		ideologyNote: 'Younger Yeon — alignment as weather, not doctrine.',
		quote: 'Brother…',
		firstLine: {
			en: 'Brother…',
			ko: '형…'
		},
		lastLine: {
			en: 'Brother…',
			ko: '형…'
		},
		nature: 'Youngest-child weather vane with a soft upbringing and a hard ending. Desire: not to be the one who decides. Wound: every decision still lands on him. Voice: quieter than Namgun, sharper when cornered. Person, not place: Yeon Namsan / 연남산 / 淵男産 — Gesomun’s third son. Never Mount Namsan (남산) above Surabol / Gyeongju, the Silla ridge of cypress and kite songs.',
		blade: 'Ring-pommel crow sword — youngest of the stamp, barely blooded; the crow looks back over its shoulder.',
		arc: 'Raised beside Yeon Namgun under Jungto and Sooyoung. Follows the hardline through the brothers’ coup, then surrenders the city when watching stops being a strategy. Survives longest — the soft hall’s last irony. Keep the full Yeon Namsan when the mountain is in the same chronicle.',
		events: [
			{ label: 'Raised by Jungto and Sooyoung beside Yeon Namgun.' },
			{ year: 668, label: 'Surrenders Pyongyang as the gates open from within.' }
		],
		aliases: ['Yeon Namsan', '연남산', '淵男産']
	},
	{
		id: 'munduk',
		gender: 'm',
		avatar: '/ch_ulchi_munduk.png',
		name: 'Ulchi Munduk',
		korean: '을지문덕',
		title: '“The Defender”',
		kingdom: 'goguryeo',
		tagline: 'Drowned a Sui army at the Salsu and wrote its general a poem about it.',
		quote: "Know when to stop — and make them follow you into the water.",
		events: [{ year: 612, label: 'Destroys the Sui host at the Great River.' }],
		career: [
			{ title: 'General', korean: '장군', hanja: '將軍', from: 612, to: 612 }
		],
		aliases: ['Ulchi Munduk', 'Munduk']
	},

	// ————————————————————————— Tang & beyond —————————————————————————
	{
		id: 'taizong',
		gender: 'm',
		avatar: '/ch_taizong.png',
		name: 'The Second Emperor',
		korean: '이세민',
		hanja: '李世民',
		title: 'Second Emperor of Tang (Taizong)',
		kingdom: 'tang',
		born: 598,
		died: 649,
		tagline: '“A woman king… those Samhan barbarians are at it again, aren’t they?”',
		ideology: 'Imperial universalist',
		ideologyNote: 'Civilizational revival of the Central Plain — the West that others are told to learn from.',
		quote: 'With all the armies under heaven, how was I humiliated by so small a barbarian land?',
		nature: 'Openly prefers a world run by decisive men; still the most competent person in any room he enters. Respected even by those he calls barbarian. Builds real friendship with Chunchu without ever forgetting who holds the silk. Sexually assured the way conquerors are — present, not crude.',
		arc: 'Murdered his brothers for the throne and then justified it by conquering the known world. Shows Chunchu what absolute obedience looks like and accidentally teaches Silla the grammar of Chinese absolutism. Goguryeo is the one page he cannot write: stopped at Ansi, he dies asking a friend to finish it.',
		blade: 'Straight Tang jian — twin edges, Khan-of-Heaven gold on the guard; the one page it never cut was Ansi.',
		events: [
			{ year: 626, label: 'Kills his brothers at the Xuanwu Gate and takes the throne.' },
			{ year: 645, label: 'Invades Goguryeo in person; is turned back at Ansi.' },
			{ year: 648, label: 'Grants Chunchu the alliance.' },
			{ year: 649, label: 'Dies; given a temple name.' }
		],
		sobriquets: [
			'Strongest Man Under Heaven',
			'Strongest Man in the World',
			'천하제일장사',
			'Khan of Heaven',
			'Heaven-Sent General'
		],
		career: [
			{ title: 'Emperor', korean: '황제', hanja: '皇帝', org: 'tangcourt', from: 626 }
		],
		aliases: [
			'The Second Emperor',
			'the Second Emperor',
			'Second Emperor',
			'Emperor Taizong',
			'Li Shimin',
			'Taizong',
			'이세민',
			'Strongest Man Under Heaven',
			'Strongest Man in the World',
			'천하제일장사',
			'Khan of Heaven',
			'Heaven-Sent General'
		]
	},
	{
		id: 'gaozong',
		gender: 'm',
		avatar: '/ch_gaozong.png',
		name: 'The Third Emperor',
		korean: '이치',
		hanja: '李治',
		title: 'Third Emperor of Tang (Gaozong)',
		kingdom: 'tang',
		born: 628,
		died: 683,
		tagline: 'Decent, earnest — filling shoes that were never made in his size.',
		ideology: 'Dynastic consolidator',
		ideologyNote: 'Softer heir of empire; keeps inconvenient friends and the furniture of power.',
		quote: "Finish the war you inherit.",
		nature: 'Less brilliant than his father, more willing to be loved. Sexually confident in the soft way of a man who has never had to take a room by force. Tries to rule as the Second Emperor’s son and as Zhi the gyuku friend — and the gap between those two men is the weather Wu learns to inhabit.',
		arc: 'As crown prince he rides and drinks with Kim Chunchu like a man who has finally been allowed a friend outside the palace wall. He becomes the Third Emperor without his father’s genius and with his father’s wars still open. He keeps promises, finishes what the Second Emperor could not, and slowly discovers that living up to a legend is a different skill from becoming one — and that the woman who finishes his sentences may be the better emperor.',
		stages: [
			{
				until: 649,
				name: 'Li Zhi',
				korean: '이치',
				title: 'Crown Prince of Tang',
				avatar: '/ch_gaozong.png'
			},
			{
				from: 649,
				name: 'The Third Emperor',
				korean: '이치',
				title: 'Third Emperor of Tang (Gaozong)',
				avatar: '/ch_gaozong.png'
			}
		],
		career: [
			{ title: 'Crown Prince', korean: '태자', hanja: '太子', org: 'tangcourt', to: 649 },
			{ title: 'Emperor', korean: '황제', hanja: '皇帝', org: 'tangcourt', from: 649 }
		],
		aliases: [
			'The Third Emperor',
			'the Third Emperor',
			'Third Emperor',
			'Emperor Gaozong',
			'Gaozong',
			'Li Zhi',
			'이치',
			'the young emperor',
			'The Young Emperor',
			'the crown prince',
			'Crown Prince'
		]
	},
	{
		id: 'wuzetian',
		avatar: '/ch_wu_zetian.png',
		name: 'Wu Zetian',
		korean: '무측천',
		hanja: '武則天',
		title: 'Empress of Tang',
		kingdom: 'tang',
		gender: 'f',
		born: 624,
		died: 705,
		tagline: 'The concubine who outlasted an emperor — and then wore the throne.',
		ideology: 'Meritocratic absolutist',
		ideologyNote: 'Power that finishes sentences; westernizes the palace from the inside out.',
		quote: 'Silence is the true mark of power…!',
		nature: 'Flirtation as logistics. Master of the glance, the aside, the smile that rearranges a banquet. Intensely interested in Silla’s woman king — not as gossip, as precedent. Liberal with cruelty, precise with legitimacy; can terrify a diplomat without raising her voice.',
		arc: 'Works the Second Emperor’s court from behind a screen, then the Third Emperor’s from beside the seal. Before Chunchu leaves Chang’an she asks how the woman king is doing — not the faction, her — and charges him with a message: never stand down; become a defiant woman; stay silent in strength, for silence is the true mark of power. Then she whispers one unrecorded sentence, waves flirtatiously as he scurries, and the Third Emperor calls from behind asking if she has been scaring the guests. Chunchu never again meets anyone who frightens him the same way. The wars that finish Goryeo happen in weather she increasingly owns. After the Third Emperor’s death she founds her own Zhou.',
		binyeo: 'Phoenix-cloud binyeo — gold thin as a threat.',
		events: [
			{ year: 640, label: 'Enters the palace as a young concubine under the Second Emperor.' },
			{
				year: 649,
				label: 'Corridor charge to Chunchu — Silence Is Power; one whispered name.'
			},
			{ year: 649, label: 'Still present when the Third Emperor rises — influence already thickening.' },
			{ year: 655, label: 'Named empress consort under the Third Emperor.' },
			{ year: 660, label: 'Baekje falls while she consolidates the inner court.' },
			{ year: 690, label: 'Takes the throne as emperor of her own Zhou.' }
		],
		career: [
			{ title: 'Concubine', korean: '재인', hanja: '才人', org: 'tangcourt', from: 640, to: 655 },
			{ title: 'Empress', korean: '황후', hanja: '皇后', org: 'tangcourt', from: 655, to: 690 },
			{ title: 'Emperor of Zhou', korean: '황제', hanja: '皇帝', org: 'tangcourt', from: 690 }
		],
		aliases: ['Wu Zetian', 'Empress Wu', '무측천', '武則天', 'the Empress Wu']
	},

	{
		id: 'west_ambassador',
		avatar: '/people/west_ambassador.png',
		name: 'Western Ambassador',
		korean: '서방 사신',
		title: 'Tang court voice',
		kingdom: 'tang',
		gender: 'm',
		tagline: 'China’s smile at the banquet — fond of hierarchy, fond of wine.',
		quote: "Even Samhan can learn which way to bow.",
		nature: 'Socially confident, a little smug, sexually self-assured without needing to prove it. Treats foreign tears as entertainment until they move policy.',
		arc: 'Toasts Taizong, needles Chunchu, and underestimates the woman behind the screen.',
		career: [
			{ title: 'Tang envoy', korean: '사신', hanja: '使臣', org: 'tangcourt' }
		],
		aliases: ['Western Ambassador', 'the Western Ambassador', '서방 사신']
	},
	{
		id: 'east_ambassador',
		avatar: '/people/east_ambassador.png',
		name: 'Eastern Ambassador',
		korean: '동방 사신',
		title: 'Yamato envoy at Chang’an',
		kingdom: 'yamato',
		gender: 'm',
		tagline: 'Japan’s careful smile — knows empresses exist, and watches Wu too long.',
		quote: "Power wears many sleeves.",
		nature: 'Refined, flirtatious in the soft register, politically cautious. More at ease with women on thrones than the Western table is — which does not make him safer.',
		arc: 'Shares the Tang banquet with Silla’s weeping prince and leaves having learned who in the room was actually dangerous.',
		career: [
			{ title: 'Yamato envoy', korean: '사신', hanja: '使臣', org: 'nation-yamato' }
		],
		aliases: ['Eastern Ambassador', 'the Eastern Ambassador', '동방 사신', 'Yamato envoy']
	},


	// ————————————————————————— Gaya —————————————————————————
	{
		id: 'muryuk',
		gender: 'm',
		avatar: '/ch_kim_muryuk.png',
		name: 'Kim Muryuk',
		korean: '김무력',
		kingdom: 'gaya',
		clan: 'clan-geumgwan-kim',
		tagline: 'Last prince of Golden Gaya — traded a kingdom so his blood could keep a sword.',
		quote: 'I loved you before I knew you.',
		arc: 'He surrenders Geumgwan so his line may live as True Bone. At the cavern lake his ghost tells his grandson what the surrender was for: not his own sake, but Yushin’s — love aimed at a boy who did not yet exist. Look at me. I am so, so proud of you.',
		blade: 'Ring-pommel fish sword — Gaya fish on the pommel; egg-and-iron mark still visible under the Silla polish.',
		swordImage: '/sword_fish.png',
		events: [
			{ year: 532, label: 'Golden Gaya surrenders to Silla.' },
			{ year: 647, label: 'Ghost in the cavern — “I loved you before I knew you.”' }
		],
		aliases: ['Kim Muryuk', 'Muryuk']
	},
	{
		id: 'seohyeon',
		gender: 'm',
		avatar: '/ch_kim_seohyun.png',
		name: 'Kim Seohyeon',
		korean: '김서현',
		kingdom: 'silla',
		clan: 'clan-geumgwan-kim',
		boneRank: 'True Bone (진골)',
		tagline: 'Yushin’s father — first Kim the steam loved (김 = steam).',
		ideology: 'Assimilationist loyalist',
		ideologyNote: 'Gaya into Silla — belonging proven by service, not blood argument.',
		quote: 'You are my son. You are Kim Yushin.',
		arc: 'Son of Muryuk; father of Yushin and Munhee. Loyal Silla patriot to the end — the middle generation that made the surrender into a household. In the steam beyond Surabol he is the first of the line: Narim, Golhwa, and Hyullé fall for him under the house rule that keeps only Kims — surname and steam, same sound — and every Kim who finds the lake afterward is heirloom. Before Radiance’s tenth day his ghost names the boy past every title: Sword of Silla, Last Prince of Gaya, and still — Kim Yushin. Your mother and I couldn’t be more proud.',
		blade: 'Ring-pommel fish sword — Gaya fish on the pommel; no crest louder than duty.',
		swordImage: '/sword_fish.png',
		events: [
			{ label: 'Finds the cavern lake; the goddesses love him first.' },
			{ label: 'Raises Yushin to serve a queen he will never meet.' },
			{ year: 647, label: 'Ghost in the cavern — “You are Kim Yushin.”' }
		],
		aliases: ['Kim Seohyeon', 'Seohyeon', '서현', 'Kim Seohyun']
	},
	{
		id: 'jinheung',
		gender: 'm',
		avatar: '/ch_jinheung.png',
		name: 'King Jinheung',
		korean: '진흥왕',
		title: '24th sovereign of Silla',
		kingdom: 'silla',
		born: 534,
		died: 576,
		clan: 'clan-gyeongju-kim',
		boneRank: 'Sacred Bone (성골)',
		tagline: 'The conqueror who betrayed an ally and doubled a kingdom.',
		quote: "Expand until the map runs out of room for trust.",
		events: [
			{ year: 553, label: 'Seizes the Han River from his ally Baekje.' },
			{ year: 554, label: 'Kills King Seong at Gwansanseong.' },
			{ year: 562, label: 'Conquers Daegaya.' }
		],
		sobriquets: ['the Crescent Moon', 'Crescent Moon', 'The Crescent Moon', '초승달'],
		career: [
			{ title: 'King', korean: '진흥왕', hanja: '眞興王', org: 'sillaroyal', from: 540 }
		],
		aliases: [
			'King Jinheung',
			'Jinheung',
			'the Crescent Moon',
			'Crescent Moon',
			'The Crescent Moon',
			'초승달'
		]
	}
];

// ————————————————————————— institutions, choruses & deities —————————————————————————
// Organizations (entity: 'organization'), systems (entity: 'concept'), speaking
// choruses without entity, and gods (entity: 'god'). Same hover / profile UI.
export const CONCEPTS: Person[] = [
	{
		id: 'haenyeo',
		name: 'The Divers',
		korean: '해녀',
		gender: 'f',
		kingdom: 'tamla',
		title: 'The women who work the seafloor of Tamla',
		tagline: 'Do not hold the breath. Push it out with singing.',
		quote: 'Do not hold the breath. Push it out with singing.',
		events: [
			{ label: 'Taught an exiled Baekje general to carry water and, badly, to sing.' }
		],
		aliases: ['haenyeo', 'the divers']
	},
	{
		id: 'courtmaid',
		avatar: '/ch_maid_1.png',
		name: 'The Court Maids',
		korean: '궁녀',
		gender: 'f',
		kingdom: 'baekje',
		title: 'Euija’s household',
		tagline: 'Two at first. Hundreds by the end. They never stop suggesting.',
		events: [
			{ year: 641, label: 'Two.' },
			{ year: 656, label: 'Hundreds — and the king has stopped arguing.' },
			{ year: 660, label: 'The Flower Cliffs.' }
		],
		aliases: ['court maid', 'court maids']
	},
	{
		id: 'shaman',
		avatar: '/ch_shaman.png',
		name: 'The Shaman',
		korean: '무당',
		gender: 'f',
		kingdom: 'baekje',
		title: 'Reader of the nine signs',
		tagline: 'Told Euija what the turtle meant — and did not live to hear him deny it.',
		quote: 'A sign ignored is still a sign.',
		binyeo: 'Bronze phoenix binyeo — rose-gold bird-head, magenta plume, ruby at the throat; nine signs read once, never twice.',
		binyeoImage: '/bn_shaman.png',
		events: [
			{ year: 659, label: 'Reads the nine omens and the turtle’s back; Euija cuts her down.' }
		],
		aliases: ['shaman', 'the shaman', '무당']
	},
	{
		id: 'sulmun',
		avatar: '/ch_sulmun.png',
		name: 'Sulmun',
		korean: '설문대할망',
		entity: 'god',
		godTier: 'III',
		gender: 'f',
		kingdom: 'tamla',
		title: 'Class III · Tamla — the Great Lady who made the island',
		realm: { en: 'Tamla · island-making', ko: '탐라 · 섬' },
		tagline: 'Class III of Tamla — piled the sea into a mountain, and drowned in a pot of porridge feeding her sons.',
		quote: 'They found ninety-nine. The collar was never finished.',
		nature:
			'Island-maker under Little Star’s 이승, not a realm-head. Enormous, practical, a little careless with aprons and cauldrons. Tamla remembers her before it remembers any continental king.',
		arc: 'Class III Tamla goddess — shrine particular under the living world, not Class I of 삼계. Before the island there is a woman: she scoops the seabed into Mount Halla; apron-holes become oreum; famine takes her in a porridge pot; ninety-nine rolls of silk are one short of a bridge to the mainland. Folk mouths still say Seolmundae / 설문대할망; the chronicle’s name is Sulmun.',
		events: [
			{ label: 'Scoops up Mount Halla; the holes in her apron leave 368 hills.' },
			{ label: 'Falls into the cauldron; her 500 sons eat, and then find her bones.' },
			{ label: 'Asks for 100 rolls of silk for a bridge to the mainland. They find 99.' }
		],
		aliases: [
			'Sulmun',
			'Seolmundae',
			'설문대할망',
			'설문대',
			'설문',
			'Great Lady of the Mountain',
			'the Great Lady'
		]
	},
	{
		id: 'jacheongbi',
		name: 'Jacheongbi',
		korean: '자청비',
		entity: 'god',
		godTier: 'III',
		gender: 'f',
		kingdom: 'tamla',
		title: 'Goddess of the five grains',
		realm: { en: 'Five grains', ko: '오곡' },
		tagline: 'Cut her hair to get into the room, then walked west to the flower field to get him back.',
		quote: 'Cut your hair if you must. Walk to the dead if you must.',
		arc: 'From 「세경본풀이」: she studies as a man beside Mun Doryeong, reveals herself at the parting stream, and when heaven kills the match she walks west — far enough that living maps end — into 서천꽃밭. Hallakgungi (할락궁이) keeps the resurrection flowers after his father Saradoryeong retired; she takes what she needs, rebuilds the boy bone by bone, and brings the five grains down to Tamla.',
		events: [
			{ label: 'Studies three years disguised as a man beside Mun Doryeong.' },
			{ label: 'Reveals herself at the parting stream.' },
			{ label: 'Fetches the resurrection flower from Hallakgungi’s Western Flower Field and revives him.' },
			{ label: 'Is given the five grains and sent down to plant them.' }
		],
		aliases: ['Jacheongbi']
	},
	{
		id: 'mundoryeong',
		name: 'Mun Doryeong',
		korean: '문도령',
		entity: 'god',
		godTier: 'III',
		gender: 'm',
		kingdom: 'tamla',
		title: 'The boy from the sky',
		realm: { en: 'Sky-born match', ko: '하늘 도령' },
		tagline: 'Sat beside her for three years and noticed on the last night.',
		quote: 'Notice on the last night — or lose her forever.',
		aliases: ['Mun Doryeong']
	},
	{
		id: 'gameunjang',
		name: 'Gameunjang-agi',
		korean: '가믄장아기',
		entity: 'god',
		godTier: 'III',
		gender: 'f',
		kingdom: 'tamla',
		title: 'Goddess of fortune',
		realm: { en: 'Fortune', ko: '운' },
		tagline: 'Said she lived on her own luck, and was thrown out of the house for it.',
		quote: 'Live on your own luck.',
		events: [
			{ label: 'Cast out; marries the youngest yam-digger and finds gold in his spoil heap.' },
			{ label: 'Holds a three-day beggars’ feast; her blind parents see again.' }
		],
		aliases: ['Gameunjang-agi', 'Gameunjang']
	},
	{
		id: 'baekjuto',
		name: 'Baekjuto',
		korean: '백주또',
		entity: 'god',
		godTier: 'III',
		gender: 'f',
		kingdom: 'tamla',
		title: 'Goddess of farming, of the Songdang shrine',
		realm: { en: 'Songdang farming', ko: '송당' },
		tagline: 'Came across the sea, married a hunter, and divorced him over an ox.',
		quote: 'An ox can end a marriage. A shrine can begin one.',
		aliases: ['Baekjuto']
	},
	{
		id: 'socheonguk',
		name: 'Socheon-guk',
		korean: '소천국',
		entity: 'god',
		godTier: 'III',
		gender: 'm',
		kingdom: 'tamla',
		title: 'God of the hunt',
		realm: { en: 'Hunt', ko: '사냥' },
		tagline: 'Ate the plough ox. Then ate somebody else’s.',
		quote: 'Hunt first. Apologize never.',
		aliases: ['Socheon-guk', 'Socheonguk']
	},
	{
		id: 'heavenearthking',
		avatar: '/ch_heaven_earth_king.png',
		name: 'Heaven–Earth King',
		korean: '천지왕',
		entity: 'god',
		godTier: 'I',
		gender: 'm',
		kingdom: 'tamla',
		title: 'Retired Class I — once ruled living and dead under Hwanin',
		realm: { en: 'Heaven–Earth (retired)', ko: '천지 · 은퇴' },
		tagline: 'Class I · retired — once governed all mortals, living and dead, under the Creator; left those two realms to his sons.',
		quote: 'I kept both sides of the ledger. You two can fight over which half.',
		nature:
			'Tamla cosmology’s Heaven–Earth King (천지왕): husband of Lady Chongmyeong, father of Big Star and Little Star. Dual-coded red and blue — living heat and orderly dark in one throne before he retires and the flower wager splits them. Heroic, loud, allergic to paperwork he already finished. Always under Hwanin’s heaven — steward of two mortal courts, never the Creator’s peer.',
		arc: '「천지왕본풀이」: Class I prior of mortals under the Big Man Upstairs — he once governed everyone who breathed and everyone who had stopped, one court for both halves of what later become two of the Three Realms. Heroic antics first; then he retires. Charge goes to his sons: elder Big Star, younger Little Star. They wager flowers for 이승; the cheat takes the warm side; the honest twin keeps 저승. Hallakgungi’s western field was never his chair. He does not reclaim the desk.',
		events: [
			{ label: 'Class I under Hwanin: rules all mortals — living and dead — as one charge.' },
			{ label: 'Retires; leaves the charge to Big Star and Little Star.' },
			{ label: 'Sons wager flowers for 이승; Little Star cheats; Big Star keeps 저승.' }
		],
		family: [
			{ id: 'daebyeol', role: 'Son' },
			{ id: 'sobyeol', role: 'Son' }
		],
		/* Dual accent: red + blue — see CHARACTER_COLORS / colorSecondary. */
		sobriquets: ['천지왕', 'Retired Class I', 'prior of mortals'],
		aliases: [
			'Heaven–Earth King',
			'Heaven Earth King',
			'Heaven\'s King',
			'천지왕',
			'Cheonjiwang',
			'Retired Heaven–Earth King'
		]
	},
	{
		id: 'daebyeol',
		avatar: '/ch_big_star.png',
		name: 'Big Star',
		korean: '대별왕',
		entity: 'god',
		godTier: 'I',
		gender: 'm',
		kingdom: 'underworld',
		title: 'Ruler of the Land of the Dead',
		realm: { en: 'Land of the Dead', ko: '저승' },
		tagline: 'Class I of 삼계 — inherited 저승 after Father retired; lost 이승 by honesty.',
		quote: 'Take the living world if you must. Leave me the minutes.',
		nature:
			'Elder twin of Little Star. 대인배 — magnanimous, wise, clear law, no appetite for cheating. Inherits half of Heaven–Earth King’s retired charge: rules 저승 as sovereign among the Three Realms — Paradise, the Ten Kings’ court, Hell nested within — while Yumla judges under his roof and Kangrim and Haewonmek fetch. Has made peace with the brother who cheated him.',
		arc: 'From 「천지왕본풀이」: Heaven–Earth King retires from ruling all mortals under Hwanin — living and dead — and leaves the charge to his sons. The twins wager flowers for 이승; Little Star swaps the blooms while Big Star sleeps; Big Star accepts the loss and takes 저승. Class I of 삼계. Retinue: Yumla, Kangrim, Haewonmek. Later he still helps his brother — shooting surplus suns and moons, silencing talking beasts — but leaves human wickedness to the cheat who wanted the warm side. First Tamla myth the island tells Gyebek — and the beat where Yuri Dora first names the Three Realms.',
		events: [
			{ label: 'Father (Heaven–Earth King) retires; sons inherit the mortal charge under Hwanin.' },
			{ label: 'Wagers flowers with Little Star for the living world; loses by swap.' },
			{ label: 'Takes 저승; keeps clear law among the dead.' },
			{ label: 'Shoots surplus suns and moons; leaves human vice to Little Star’s small law.' },
			{ year: 673, label: 'Comes himself for Kim Yushin — greatest man of the age — and offers any wish.' }
		],
		family: [
			{ id: 'heavenearthking', role: 'Father' },
			{ id: 'sobyeol', role: 'Brother' }
		],
		sobriquets: ['Daebyeolwang', '대벨왕', 'Elder Star'],
		career: [
			{ title: 'Ruler of the Land of the Dead', korean: '대별왕', org: 'four_divisions', note: '저승' }
		],
		aliases: [
			'Big Star',
			'Daebyeolwang',
			'Daebyeol',
			'대별왕',
			'대벨왕',
			'Elder Star'
		],
		stages: [
			{
				id: 'young',
				label: 'Before the wager',
				avatar: '/ch_big_star_young.png'
			}
		]
	},
	{
		id: 'sobyeol',
		avatar: '/ch_little_star.png',
		name: 'Little Star',
		korean: '소별왕',
		entity: 'god',
		godTier: 'I',
		gender: 'm',
		kingdom: 'tamla',
		title: 'Ruler of the Land of the Living',
		realm: { en: 'Land of the Living', ko: '이승' },
		tagline: 'Class I of 삼계 — cheated for the living world after Father retired; still cannot govern it cleanly.',
		quote: 'I wanted the warm side. I got the thieves too.',
		nature:
			'Younger twin. Used to be 소인배 — petty about the flower cheat — and has matured somewhat; made up with Big Star enough to still ask for help with suns and moons. Clever, hungry for 이승, bad at admitting why it stays messy. Inherits half of Heaven–Earth King’s retired charge after the flower swap; must ask Big Star to fix suns, moons, and speaking beasts — but not human crime. Retinue: Ibiga (sky), Haemosu (sun), Samsin (life).',
		arc: 'From 「천지왕본풀이」: after Heaven–Earth King retires under Hwanin’s heaven, he plants the withered flower, swaps it for his brother’s full bloom, and takes 이승. Class I: sovereign of the Land of the Living among the Three Realms. That is why the living world runs on thieves, quarrels, and bad hours — the cheat inherited the warm side. Tamla tells this first, before kinder island tales, so Gyebek will stop waiting for the world to behave.',
		events: [
			{ label: 'Father (Heaven–Earth King) retires; sons inherit the mortal charge under Hwanin.' },
			{ label: 'Swaps flowers while Big Star sleeps; takes 이승.' },
			{ label: 'Begs Big Star to restore sun, moon, and silence among beasts.' },
			{ label: 'Keeps the “small law” — human vice included.' }
		],
		family: [
			{ id: 'heavenearthking', role: 'Father' },
			{ id: 'daebyeol', role: 'Brother' }
		],
		sobriquets: ['Sobyeolwang', '소벨왕', 'Younger Star'],
		career: [
			{ title: 'Ruler of the Land of the Living', korean: '소별왕', org: 'four_divisions', note: '이승' }
		],
		aliases: [
			'Little Star',
			'Sobyeolwang',
			'Sobyeol',
			'소별왕',
			'소벨왕',
			'Younger Star'
		],
		stages: [
			{
				id: 'young',
				label: 'Before the wager',
				avatar: '/ch_little_star_young.png'
			}
		]
	},
	{
		id: 'yumla',
		avatar: '/ch_yumla.png',
		name: 'Yumla',
		korean: '염라대왕',
		hanja: '閻羅大王',
		entity: 'god',
		godTier: 'II',
		gender: 'm',
		kingdom: 'underworld',
		title: 'Judge of the Underworld',
		realm: { en: 'Judgment · Siwang Court', ko: '시왕국 · 심판' },
		tagline: 'Class II — judge within 저승, not its king. Big Star keeps the dark; Yumla keeps the minutes.',
		quote: "The living argue. We keep the sentence.",
		nature:
			'Death-god introversion under purple robes. Presides over the Ten Kings’ court (시왕국) under Big Star’s sovereignty — authoritative father figure on the bench, shy off it. Big crush on Samsin he almost never names. Once called Yama; elites still say Your Honour / His Honour of judgment. Heaven once sent Kangrim to arrest him; Kangrim stayed and serves the court’s fetch-work.',
		arc: 'Yumla judges the dead inside Big Star’s Land of the Dead — Paradise above, Hell below, Siwang in between. Class II: a broad office of judgment within 저승, not Class I sovereignty. Kangrim and Haewonmek address the office with court courtesy; the crow that scrambled the ledger is the closest the court comes to a foreign incident. At the Snake River his two best clerks fail to take Yeon Gesomun — so at the end he goes himself: a king for a king.',
		events: [
			{ label: 'Heaven sends Kangrim to arrest him; Kangrim stays as escort of judgment.' },
			{ label: 'Judges under Big Star while Samhan burns above.' },
			{ year: 665, label: 'Comes himself for Yeon Gesomun after Kangrim and Haewonmek fail at Salsu.' }
		],
		sobriquets: ['Judge of the Underworld', '염라', 'King Yama'],
		career: [
			{ title: 'Judge of the Underworld', korean: '염라대왕', hanja: '閻羅大王', org: 'four_divisions' }
		],
		aliases: [
			'Yumla',
			'King Yumla',
			'염라대왕',
			'염라',
			'King Yama',
			'Yama',
			'Judge of the Underworld',
			'Judge Yumla'
		]
	},
	{
		id: 'kangrim',
		avatar: '/ch_kangrim.png',
		name: 'Kangrim',
		korean: '강림',
		entity: 'god',
		godTier: 'III',
		gender: 'm',
		kingdom: 'underworld',
		title: 'Reaper · escort of judgment',
		realm: { en: 'Reaper roads', ko: '저승길' },
		tagline: '“One question, then we walk.”',
		ideology: 'Cynical underworld realist',
		ideologyNote: 'Death’s clerk — no party line but the invoice.',
		quote: 'One question, then we walk.',
		firstLine: {
			en: 'Lady Gotaso. One question, then we walk. When you chose forever — did you choose the man, or the vow?',
			ko: '고타소 부인. 질문 하나, 그리고 걷읍시다. 영원을 고를 때 — 사람을 골랐소, 맹세를 골랐소?'
		},
		lastLine: {
			en: 'Clean answer. His Majesty’s kingdom has room for men who told the truth late.',
			ko: '깨끗한 답이오. 폐하의 나라에는 늦게 진실을 말한 자의 자리도 있소.'
		},
		nature:
			'Most emotional and personable of the death gods — still introverted-dark office, but dry curiosity and brotherly warmth on the road. Fetches the dead for Yumla’s judgment under Big Star’s 저승 — ledger, one Question, loyalty without sermons. Works with Haewonmek; they bicker like brothers who share a crow. Ordinary mouths know only 저승사자. Royals, high bone, and death’s clerks know 강림.',
		arc: 'From 「차사본풀이」: heaven sent him to arrest Yumla; he stayed. Class III: a specific function — the fetch itself — under Yumla’s broader judgment. Across Samhan he collects with Haewonmek — Gotaso at Daeya who knew only the folk title, Bidam and Sunduk who knew his name, five thousand at Hwangsan who wave them in. He asks Kangrim’s Question; Haewonmek asks only for last words. Wet-nurse stories say 저승사자; palace rooms and Tamla’s last telling say Kangrim. The island tells him last — after every kinder Tamla tale — because once you have heard it, every ending changes key.',
		blade: 'Black iron death blade — ring pommel cold as ledger-ink; shown once, never drawn.',
		swordImage: '/sword_crysanthemum.png',
		events: [
			{ label: 'Sent to arrest Yumla; stays as escort of judgment under Big Star.' },
			{ year: 642, label: 'Collects Gotaso at Daeya — she knows only 저승사자; Haewonmek takes Pumsuk.' },
			{ year: 647, label: 'Two names in one night: Bidam and Sunduk — both know him as Kangrim.' },
			{ label: 'A crow scrambles his list — which is why nobody knows their hour.' },
			{ year: 660, label: 'At Hwangsan with Haewonmek; Gyebek names them both from 「차사본풀이」.' },
			{ year: 661, label: 'Chunchu declines both escorts and walks the underworld road himself.' },
			{ year: 662, label: 'With Haewonmek, fails to take Yeon Gesomun at the Snake River.' }
		],
		sobriquets: [
			'저승사자',
			'the underworld messenger',
			'Underworld Messenger',
			'the reaper'
		],
		career: [
			{ title: 'Fetch', korean: '차사', hanja: '差使', org: 'four_divisions', note: 'escort of judgment' }
		],
		aliases: [
			'Kangrim',
			'Gangnim',
			'강림',
			'저승사자',
			'the underworld messenger',
			'Underworld Messenger',
			'the reaper'
		]
	},
	{
		id: 'haewonmek',
		avatar: '/ch_haewonmek.png',
		name: 'Haewonmek',
		korean: '해원맥',
		entity: 'god',
		godTier: 'III',
		gender: 'm',
		kingdom: 'underworld',
		title: 'Reaper · second escort of judgment',
		realm: { en: 'Reaper roads', ko: '저승길' },
		tagline: 'The other 해 — younger, night-road, none of the chariot’s heat.',
		ideology: 'Playful underworld realist',
		ideologyNote: 'Death’s other clerk — jokes until the door, then silence.',
		quote: 'Kangrim asks the Question. I ask for last words. Neither of us bargains.',
		firstLine: {
			en: 'Any last words?',
			ko: '유언은?'
		},
		lastLine: {
			en: 'Any last words?',
			ko: '유언은?'
		},
		nature:
			'Dead silent. Kangrim’s partner on the fetch-roads — introverted, dark, minimal speech, a younger 해 who took the night-road while the other 해 still drives the day. His ask is simpler than Kangrim’s Question: Any last words? / 남길 말 있나? Common folk still say only 저승사자 — one office, two names elites know. When he must speak it is sharp, final, and a little grumpy; he does not soft-pad the hour.',
		arc: 'Second reaper beside Kangrim under Yumla’s judgment and Big Star’s 저승 — in 「차사본풀이」 the older reaper who once showed Kangrim the trail. Class III with Kangrim: the fetch itself, not the judge’s chair. Same 해 as the sun’s chariot; he walked the dark instead, and the sun still outranks him — once, at Jumong’s river, Haemosu sends him off and promises the boy later. At Daeya he takes Pumsuk (last words) while Kangrim takes Gotaso (the Question). At Hwangsan Gyebek names them both. With Kangrim he fails Gesomun at Salsu; Chunchu declines them both. Romanized Haewonmek throughout the chronicle (id stable: haewonmek).',
		blade: 'Black iron death blade — ring pommel cold as last words; shown once, never drawn.',
		swordImage: '/sword_crysanthemum.png',
		events: [
			{ year: -37, label: 'Comes for Jumong at the river; Haemosu sends him off.' },
			{ label: 'Walks the reaper roads with Kangrim after the crow scrambles the shared ledger.' },
			{ year: 642, label: 'Collects Pumsuk at Daeya — asks only for last words.' },
			{ year: 655, label: 'Collects Queen Satek with the same simple ask.' },
			{ year: 647, label: 'Collects Yumjong while Kangrim takes Bidam and Sunduk.' },
			{ year: 660, label: 'At Hwangsan with Kangrim; Gyebek names them from the Tamla myth.' },
			{ year: 661, label: 'Chunchu declines both; they follow at a polite distance for the paperwork.' },
			{ year: 662, label: 'Fails with Kangrim to take Yeon Gesomun at the Snake River.' }
		],
		sobriquets: ['저승사자', 'the second reaper', 'Second Reaper'],
		career: [
			{ title: 'Fetch', korean: '차사', hanja: '差使', org: 'four_divisions', note: 'second escort of judgment' }
		],
		aliases: [
			'Haewonmek',
			'Haewonmaek',
			'해원맥',
			'Haewon-maek',
			'저승사자',
			'the second reaper',
			'Second Reaper'
		]
	},
	{
		id: 'sara',
		avatar: '/ch_gardener.png',
		name: 'Hallakgungi',
		korean: '할락궁이',
		entity: 'god',
		godTier: 'I',
		gender: 'm',
		kingdom: 'other',
		title: 'Master of the Western Flower Field',
		realm: { en: 'Western Flower Field', ko: '서천꽃밭' },
		tagline: 'Class I of 삼계 — active flower-warden after Father Saradoryeong retired.',
		quote: 'Father kept the rows. I keep the gate.',
		nature:
			'Active flower-warden (꽃감관) of 서천꽃밭 — 할락궁이 / Hallakgungi. Son of Saradoryeong, who retired and left him the rows. Whimsical, always young — Peter Pan among office-gods — and lowkey the most powerful: resurrection and extinction flowers in the same rows. Hands Jacheongbi the resurrection blooms; later lends doom-flowers when heaven’s rebels need ending. Courteous, exact, unhurried. Older mouths still say “the gardener”; the island’s proper name is Hallakgungi. Stable id: `sara`. Alone among the Three Realms principals — no retinue on the chart.',
		arc: 'Third Realm’s master after his father’s retirement: travel west from 이승 far enough — past any Atlantic the poets invent — and you reach his field between living and dead. Bone-flesh-blood-breath-soul flowers grow beside the extinction bloom. Jacheongbi’s chain runs through his gate. Class I with Big Star and Little Star under Hwanin’s heaven — one court each of 삼계.',
		events: [
			{ label: 'Father Saradoryeong retires; Hallakgungi takes the Western Flower Field.' },
			{ label: 'Gives Jacheongbi the resurrection flowers for Mun Doryeong.' },
			{ label: 'Lends the extinction flower against heaven’s rebel host.' }
		],
		family: [{ id: 'saradoryeong', role: 'Father' }],
		sobriquets: ['할락궁이', 'Flower Warden', 'The Gardener'],
		career: [
			{ title: 'Master of the Western Flower Field', korean: '꽃감관', org: 'four_divisions', note: '서천꽃밭' }
		],
		aliases: [
			'Hallakgungi',
			'할락궁이',
			'The Gardener',
			'Gardener',
			'Sara',
			'사라'
		]
	},
	{
		id: 'saradoryeong',
		avatar: '/ch_gardener.png',
		name: 'Saradoryeong',
		korean: '사라도령',
		entity: 'god',
		godTier: 'I',
		gender: 'm',
		kingdom: 'other',
		title: 'Retired Class I — former master of the Western Flower Field',
		realm: { en: 'Western Flower Field (retired)', ko: '서천꽃밭 · 은퇴' },
		tagline: 'Class I · retired — left the flower rows to his son Hallakgungi.',
		quote: 'I counted every bloom. Counting is a younger man’s work now.',
		nature:
			'Prior flower-warden of 서천꽃밭 — 사라도령 / Saradoryeong (also 사라장자, 사라수대왕). Retired Class I; the active gate and the Jacheongbi chain belong to his son Hallakgungi. Exact, unhurried, finished with the ledger.',
		arc: 'Once Class I of the Western Flower Field among the Three Realms under Hwanin. He retires the way Heaven–Earth King retires — chair emptied on purpose — and Hallakgungi keeps resurrection and ruin in the same western rows. Island mouths still say his names as honorifics for the office; the living gate answers to the son.',
		events: [
			{ label: 'Keeps 서천꽃밭 as Class I among the Three Realms.' },
			{ label: 'Retires; leaves the field to Hallakgungi.' }
		],
		family: [{ id: 'sara', role: 'Son' }],
		sobriquets: ['사라장자', '사라수대왕', 'Sara Doryeong', 'Retired Gardener'],
		aliases: [
			'Saradoryeong',
			'Sara Doryeong',
			'사라도령',
			'사라장자',
			'사라수대왕',
			'Lord Sara',
			'Sara'
		]
	},
	{
		id: 'go_tamla',
		name: 'Prince Go',
		korean: '고을나',
		hanja: '高乙那',
		entity: 'god',
		godTier: 'demigod',
		gender: 'm',
		kingdom: 'tamla',
		title: 'Divine prince of Samseonghyeol · Go line',
		tagline: 'Demigod — rose from the three-surnames hollow, not from an egg.',
		quote: 'The island remembers who came up, not who hatched.',
		arc: 'One of Tamla’s three divine princes (삼신인) who emerge from Samseonghyeol. With Yang and Bu he shoots for a share of the island, marries a princess from the East Sea box, and founds the Go surname line the island still counts.',
		events: [
			{ label: 'Emerges from Samseonghyeol with Yang and Bu.' },
			{ label: 'Shoots for his third of the island; marries a princess from the sea-box.' }
		],
		aliases: ['Prince Go', '고을나', '高乙那', 'Go Eulna']
	},
	{
		id: 'yang_tamla',
		name: 'Prince Yang',
		korean: '양을나',
		hanja: '良乙那',
		entity: 'god',
		godTier: 'demigod',
		gender: 'm',
		kingdom: 'tamla',
		title: 'Divine prince of Samseonghyeol · Yang line',
		tagline: 'Demigod — first of the three to name the hollow sacred.',
		quote: 'Mark the ground that gave you. Then farm it.',
		arc: 'Elder voice among the three who rise from Samseonghyeol. Shares the arrow-division of Tamla, takes a princess and grain from the drifting box, and leaves the Yang surname on the island’s founding register.',
		events: [
			{ label: 'Emerges from Samseonghyeol with Go and Bu.' },
			{ label: 'Divides the island by arrow; marries at the pond.' }
		],
		aliases: ['Prince Yang', '양을나', '良乙那', 'Yang Eulna']
	},
	{
		id: 'bu_tamla',
		name: 'Prince Bu',
		korean: '부을나',
		hanja: '夫乙那',
		entity: 'god',
		godTier: 'demigod',
		gender: 'm',
		kingdom: 'tamla',
		title: 'Divine prince of Samseonghyeol · Bu line',
		tagline: 'Demigod — third from the well; calves, foals, and a third of the orange island.',
		quote: 'What arrives by sea in a box is still yours to keep.',
		arc: 'Youngest of the Samseonghyeol triad. Shoots for his share, marries the third princess, and helps open Tamla’s farming age when the sea-box yields livestock and the five grains.',
		events: [
			{ label: 'Emerges from Samseonghyeol with Yang and Go.' },
			{ label: 'Receives livestock and grain from the East Sea box.' }
		],
		aliases: ['Prince Bu', '부을나', '夫乙那', 'Bu Eulna']
	},
	{
		id: 'sanbangdeok',
		name: 'Sanbangdeok',
		korean: '산방덕',
		entity: 'god',
		godTier: 'III',
		gender: 'f',
		kingdom: 'tamla',
		title: 'The rock-goddess of Sanbang',
		realm: { en: 'Sanbang cliff', ko: '산방' },
		tagline: 'Loved a poor man, was wanted by an official, and went back into the cliff.',
		quote: "Better the cliff than the wrong official.",
		aliases: ['Sanbangdeok']
	},
	{
		id: 'bonerank',
		name: 'The Bone Rank System',
		korean: '골품제',
		hanja: '骨品制',
		entity: 'organization',
		kingdom: 'silla',
		title: 'Silla’s hereditary caste order',
		tagline: 'Birth decides everything — office, house width, and the colour of your robe.',
		arc: 'Silla’s answer to who may rule: Sacred Bone, then True Bone (purple 자색 robes, councillor ranks 1–5 — including Pajinchan, 4th), then six head ranks — scarlet 비색 (6-dupum), blue 청색 (5-dupum), yellow 황색 (4-dupum and below). Colour is census, not fashion. True Bone begins as the Founding Six Elders’ descendant lines — Lee, Choi, Jeong, Son, Bae, Seol — hereditary privilege above commoners; the egg-born king and dragon-born queen stay Sacred exception. It makes Dukman queen when Sacred Bone men run out; keeps Chunchu from the throne for decades; hands Daeya to purple Pumsuk while yellow sleeves die on the wall.',
		events: [
			{ year: 632, label: 'Only three Sacred Bone royals remain.' },
			{ year: 642, label: 'Yellow-sleeve resentment and purple command meet at Daeya.' },
			{ year: 654, label: 'The Sacred Bone line dies out; a True Bone takes the throne.' }
		],
		orgChart: [
			{ id: 'sunduk', role: '성골 · Sacred Bone', reportsTo: null },
			{ id: 'jinduk', role: '성골 · Sacred Bone', reportsTo: null },
			{ id: 'chunchu', role: '진골 · True Bone', reportsTo: 'sunduk' },
			{ id: 'yushin', role: '진골 · True Bone', reportsTo: 'sunduk' },
			{ id: 'munhee', role: '진골 · True Bone', reportsTo: 'chunchu' },
			{ id: 'munmu', role: '진골 · True Bone', reportsTo: 'chunchu' },
			{ id: 'pumsuk', role: '진골 · True Bone', reportsTo: 'sunduk' },
			{ id: 'gotaso', role: '진골 · True Bone', reportsTo: 'chunchu' }
		],
		aliases: [
			'Bone Rank System',
			'Bone Rank',
			'골품제',
			'골품',
			'purple robe',
			'자색',
			'비색',
			'청색',
			'황색'
		]
	},
	{
		id: 'foundingsix',
		name: 'The Founding Six Elders',
		korean: '신라 육촌 시조',
		hanja: '新羅六村始祖',
		entity: 'organization',
		kingdom: 'silla',
		title: 'The six village chiefs who raised the egg-born king',
		tagline: 'Alpyung, Sobuldori, Jibekho, Gurema, Jita, Hojin — six hearths, one crown.',
		nature: 'Not a council that votes but a covenant that dug: when the white horse knelt at Najeong, six chiefs opened the earth and raised the boy they named Hyukgosé. Their descendants become the True Bone (진골) nobility — hereditary, above commoners, founding-blood privilege worn like purple before purple had a number. The egg-born king and dragon-born queen stay Sacred exception; the six lines inherit the country’s untouchable aristocracy.',
		arc: 'Samguk Sagi’s six villages and six departments: Alcheon Yangsan-chon (Lee Alpyung, Geupnyang-bu); Dolsan Goheo-chon (Choi Sobuldori, Saryang-bu); Chuisan Jinji-chon (Jeong Jibekho, Bonpi-bu); Musan Daesu-chon (Son Gurema, Jeomnyang-bu); Geumsan Gari-chon (Bae Jita, Hangi-bu); Myeonghwalsan Goya-chon (Seol Hojin, Seupbi-bu). They install Hyukgosé at thirteen and teach Seorabeol that six clans may dominate politics so long as one crown holds the centre. Twelve centuries later Alchun counts Sobuldori, Bidam’s hall whispers Gurema, and Kim Yushin — Gaya Kim, not elder blood — is the odd sword inside True Bone Surabol.',
		events: [
			{ year: -69, label: 'Find the egg at Najeong well; raise Hyukgosé.' },
			{ year: -57, label: 'Crown Hyukgosé first king of Seorabeol.' },
			{ label: 'Six clans — Lee, Choi, Jeong, Son, Bae, Seol — inherit founding privilege as True Bone.' }
		],
		orgChart: [
			{ id: 'hyukgose', role: 'King · egg-born · installed by the six', reportsTo: null },
			{ id: 'alpyung', role: '알천 양산촌 · 급량부 · Surabol Lee', reportsTo: 'hyukgose' },
			{ id: 'sobuldori', role: '돌산 고허촌 · 사량부 · Surabol Choi', reportsTo: 'hyukgose' },
			{ id: 'jibekho', role: '취산 진지촌 · 본피부 · Surabol Jeong', reportsTo: 'hyukgose' },
			{ id: 'gurema', role: '무산 대수촌 · 점량부 · Surabol Son', reportsTo: 'hyukgose' },
			{ id: 'jita', role: '금산 가리촌 · 한기부 · Surabol Bae', reportsTo: 'hyukgose' },
			{ id: 'hojin', role: '명활산 고야촌 · 습비부 · Surabol Seol', reportsTo: 'hyukgose' }
		],
		aliases: [
			'foundingsix',
			'Founding Six Elders',
			'The Founding Six Elders',
			'신라 육촌 시조',
			'사로 육촌',
			'신라 6성',
			'Silla Six Elders'
		]
	},
	{
		id: 'sillaroyal',
		name: 'The Silla Royal Family',
		korean: '신라 왕실',
		hanja: '新羅王室',
		entity: 'organization',
		kingdom: 'silla',
		title: 'Sacred Bone crowns and True Bone heirs of Surabol',
		tagline: 'Egg-and-dragon founders, exhausted Sacred Bone queens, and the True Bone line that finished Samhan.',
		nature: 'Not one surname but one house argument across centuries: Hyukgosé and Alyoung by omen; later Surabol Kim by Alji; Sacred Bone when holiness still barred the throne from ordinary bone; True Bone when Chunchu broke the spell. Gotaso, Munhee, and Bupmin belong here as much as Sunduk — blood and marriage both count in Surabol’s ledger.',
		arc: 'From the Founding Six presenting the egg-born king to Jinpyung’s fifty-three-year reign and three Sacred Bone daughters; from Sunduk and Jinduk holding a holiness the country outgrew to Chunchu’s first True Bone crown and Munmu’s Samhan. The family page is the bone-rank story told as names instead of robe colours.',
		orgChart: [
			{ id: 'hyukgose', role: 'Founding king · egg-born · Sacred exception', reportsTo: null },
			{ id: 'alyoung', role: 'Founding queen · dragon-born · Sacred exception', reportsTo: 'hyukgose' },
			{ id: 'jinheung', role: '성골 · Sacred Bone · conqueror', reportsTo: null },
			{ id: 'jinpyung', role: '성골 · Sacred Bone · 53-year reign', reportsTo: null },
			{ id: 'sunduk', role: '성골 · Sacred Bone · queen', reportsTo: 'jinpyung' },
			{ id: 'jinduk', role: '성골 · Sacred Bone · queen', reportsTo: 'jinpyung' },
			{ id: 'chunmyung', role: '성골 · Sacred Bone · Chunchu’s mother', reportsTo: 'jinpyung' },
			{ id: 'chunchu', role: '진골 · True Bone · first True Bone king', reportsTo: 'chunmyung' },
			{ id: 'munhee', role: '진골 · True Bone · queen consort', reportsTo: 'chunchu' },
			{ id: 'gotaso', role: '진골 · True Bone · Chunchu’s daughter', reportsTo: 'chunchu' },
			{ id: 'munmu', role: '진골 · True Bone · King of Samhan', reportsTo: 'chunchu' }
		],
		aliases: [
			'Silla Royal Family',
			'Royal House of Silla',
			'신라 왕실',
			'Surabol royal house',
			'Sacred Bone house'
		]
	},
	{
		id: 'harmonycouncil',
		name: 'The Harmony Council',
		korean: '화백회의',
		hanja: '和白會議',
		entity: 'organization',
		kingdom: 'silla',
		title: 'Silla’s unanimous council of Councillors',
		tagline: 'Six Councillors (대등) under a Premier (상대등) — initial vote, deliberation, final vote.',
		nature: 'Each session: initial vote → deliberation → final vote. Unanimity or nothing; one withheld hand is a Harmony Veto. Yes-Minister courtesy wrapped around Iliad stakes — thrones, pride, and the turning of hands.',
		arc: 'Members are Councillors (대등); the first chair is Premier (상대등). In 632 six sleeves begin three-to-three on Dukman; Bidam wins deliberation until the final vote is six-to-none. In 645 Bidam alone breaks the initial vote for Seungman and the final vote cannot pass. In 654 Chunchu is enthroned when the holdout is laughed down. After the Chunchu Reforms the Council still meets; the Royal Secretariat ensures nothing of consequence waits for it.',
		events: [
			{ year: 632, label: 'Initial 3:3 → final 6:0 — Queen Sunduk named.' },
			{ year: 645, label: 'Supum succeeds Euljé as Premier; Bidam alone blocks Seungman.' },
			{ year: 651, label: 'Outflanked by the Royal Secretariat (집사부).' },
			{ year: 654, label: 'Enthrones Kim Chunchu as King Muyeol.' }
		],
		orgChart: [
			{ id: 'supum', role: '상대등 · Premier', reportsTo: null },
			{ id: 'yushin', role: '대등', reportsTo: 'supum' },
			{ id: 'alchun', role: '대등', reportsTo: 'supum' },
			{ id: 'murim', role: '대등', reportsTo: 'supum' },
			{ id: 'imjong', role: '대등', reportsTo: 'supum' },
			{ id: 'suljong', role: '대등', reportsTo: 'supum' },
			{ id: 'yumjang', role: '대등', reportsTo: 'supum' },
			{ id: 'bidam', role: '대등 · 645 veto', reportsTo: 'supum' },
			{ id: 'pumil', role: '대등 · minor', reportsTo: 'supum' }
		],
		aliases: [
			'Harmony Council',
			'화백회의',
			'Councillors',
			'대등',
			'Premier',
			'상대등'
		]
	},
	{
		id: 'hwarang',
		name: 'The Hwarang',
		korean: '화랑',
		hanja: '花郎',
		entity: 'organization',
		/* the one institution that speaks aloud in the chronicle, as a chorus of
		   young noblemen — so it needs a body on the stage */
		gender: 'm',
		kingdom: 'silla',
		title: 'The Flowering Knights',
		tagline: 'Boarding hall and officer factory of Silla’s noblemen — the class you slept in is the class you later vote with.',
		ideology: 'Martial aristocratic idealism',
		ideologyNote: 'Flower youth as elite virtue politics — loyalty, beauty, and steel as curriculum. The cohort outlives the yard: old boys staff the Harmony Council.',
		nature: 'A closed hall that sleeps six to a room, and an officer factory that feeds the state. Boys learn one another’s snores before one another’s ranks, then keep the class number for life — First Class, Class 51, Class 84 — the way a later age keeps a service number. One class a year: Class 1 entered in 560. Bidam is senior to Yushin, Yushin to Alchun; decades on they still say our class. Almost every Harmony Councillor first wore the headband. A Hwarang is expected to ride, recite, and look like the country worth dying for. Special forms — named cuts, paired drills, the 108 count — mark who trained in the yard and who merely wore a sword. On the gyuku field they measure one another with a jangsi before the court does.',
		arc: 'Silla’s training order for True Bone youth — part boarding school, part brotherhood, part cult of the officer. It incubates the men who later sit the Harmony Council, which is to say the Council is the yard with better chairs. It produces Yushin, Bidam, Alchun and Pumsuk: the man who saves the throne, the man who rebels against it, and the boy who loses Daeya. When two of them meet between camps, the country watches a private language of steel — and of class.',
		events: [
			{ year: 576, label: 'Formalised under King Jinheung.' },
			{ year: 632, label: 'The young knights pledge to Queen Sunduk.' },
			{ year: 660, label: 'Gwanchang and Bangul die at the Yellow Mountain Fields.' }
		],
		orgChart: [
			{ id: 'yushin', role: '국선 · Marshal · Class 51', reportsTo: null },
			{ id: 'bidam', role: '화랑 · Class 51', reportsTo: 'yushin' },
			{ id: 'alchun', role: '화랑 · Class 51', reportsTo: 'yushin' },
			{ id: 'pumsuk', role: '화랑 · Class 74', reportsTo: 'yushin' },
			{ id: 'sadaham', role: '화랑 · remembered · First Class', reportsTo: 'yushin' },
			{ id: 'jukji', role: '화랑 · Class 74', reportsTo: 'yushin' },
			{ id: '_hwarang-6', role: '화랑', reportsTo: 'yushin' },
			{ id: '_disc-bidam-1', role: '낭도 · disciple', reportsTo: 'bidam' },
			{ id: '_disc-bidam-2', role: '낭도 · disciple', reportsTo: 'bidam' },
			{ id: '_disc-bidam-3', role: '낭도 · disciple', reportsTo: 'bidam' },
			{ id: '_disc-bidam-4', role: '낭도 · disciple', reportsTo: 'bidam' },
			{ id: '_disc-alchun-1', role: '낭도 · disciple', reportsTo: 'alchun' },
			{ id: '_disc-alchun-2', role: '낭도 · disciple', reportsTo: 'alchun' },
			{ id: '_disc-alchun-3', role: '낭도 · disciple', reportsTo: 'alchun' },
			{ id: '_disc-alchun-4', role: '낭도 · disciple', reportsTo: 'alchun' },
			{ id: '_disc-pumsuk-1', role: '낭도 · disciple', reportsTo: 'pumsuk' },
			{ id: '_disc-pumsuk-2', role: '낭도 · disciple', reportsTo: 'pumsuk' },
			{ id: '_disc-pumsuk-3', role: '낭도 · disciple', reportsTo: 'pumsuk' },
			{ id: '_disc-pumsuk-4', role: '낭도 · disciple', reportsTo: 'pumsuk' },
			{ id: '_disc-sadaham-1', role: '낭도 · disciple', reportsTo: 'sadaham' },
			{ id: '_disc-sadaham-2', role: '낭도 · disciple', reportsTo: 'sadaham' },
			{ id: '_disc-sadaham-3', role: '낭도 · disciple', reportsTo: 'sadaham' },
			{ id: '_disc-sadaham-4', role: '낭도 · disciple', reportsTo: 'sadaham' },
			{ id: '_disc-jukji-1', role: '낭도 · disciple', reportsTo: 'jukji' },
			{ id: '_disc-jukji-2', role: '낭도 · disciple', reportsTo: 'jukji' },
			{ id: '_disc-jukji-3', role: '낭도 · disciple', reportsTo: 'jukji' },
			{ id: '_disc-jukji-4', role: '낭도 · disciple', reportsTo: 'jukji' },
			{ id: '_disc-h6-1', role: '낭도 · disciple', reportsTo: '_hwarang-6' },
			{ id: '_disc-h6-2', role: '낭도 · disciple', reportsTo: '_hwarang-6' },
			{ id: '_disc-h6-3', role: '낭도 · disciple', reportsTo: '_hwarang-6' },
			{ id: '_disc-h6-4', role: '낭도 · disciple', reportsTo: '_hwarang-6' }
		],
		aliases: ['Hwarang knights', 'Flower Knights', 'Hwarang']
	},
	{
		id: 'gyuku',
		name: 'Gyuku',
		korean: '격구',
		hanja: '擊毬',
		entity: 'concept',
		kingdom: 'silla',
		title: 'The horse-ball ranking',
		tagline: 'Jangsi, mogu, gumun — Surabol’s scoreboard with horses.',
		nature: 'Not a pastime. A ranking system. Handicaps argued like borders, with less honesty. The stick has a proper name — jangsi (杖匙 / 장시) — and men who call it a mere club are not invited to the better matches.',
		arc: 'Riders drive a wooden mogu (毛毬 / 모구 — the hair-ball, the wooden ball) through a gumun (毬門 / 구문) with a jangsi. The chronicles stack other names — tagu (打毬), gyuku-hui (擊毬戱), nongjang-hui (弄杖戱), gyeokbong (擊棒) — and the market still says gongchigi or jangchigi. A later age calls it polo and forgets the stick had a proper name. The sport will flourish loudest as a male-centred Dano game in late Goryeo; in this chronicle Surabol already uses it to decide who matters before the court does.',
		aliases: [
			'Gyuku',
			'격구',
			'擊毬',
			'Jangsi',
			'장시',
			'杖匙',
			'Mogu',
			'모구',
			'毛毬',
			'Gumun',
			'구문',
			'毬門',
			'Tagu',
			'타구',
			'打毬',
			'Gyuku-hui',
			'격구희',
			'Nongjang-hui',
			'농장희',
			'Gyeokbong',
			'격봉',
			'Gongchigi',
			'공치기',
			'Jangchigi',
			'장치기',
			'polo'
		]
	},
	{
		id: 'fiveprinciples',
		name: 'The Five Principles',
		korean: '세속오계',
		hanja: '世俗五戒',
		entity: 'concept',
		kingdom: 'silla',
		title: 'The Hwarang code',
		tagline: 'Loyalty, filial duty, faith between friends, no retreat, and mercy in killing.',
		arc: 'Five lines that read as virtues and function as a machine for producing dead teenagers. 임전무퇴 — never retreat — is the one the story keeps returning to: it is why Gwanchang rides back, why Gyebek kills his family, and why Baekje fights a war it has already lost.',
		aliases: ['Five Principles']
	},
	{
		id: 'greatheroes',
		name: 'The Great Heroes of Goguryeo',
		korean: '고구려 영웅',
		entity: 'concept',
		kingdom: 'goguryeo',
		title: 'The defenders in the Hall of Heroes',
		tagline: 'The short list of men who stopped an empire at the Liao.',
		arc: 'Goguryeo’s self-image in five or six names — Gwanggaeto who expanded it, Ulchi Munduk who drowned the Sui at the Salsu, Yang Manchun who held Ansi against Taizong. Yeon Gesomun spends his life auditioning for the list and Namseng inherits a kingdom that believes the list will always be added to.',
		events: [
			{ year: 612, label: 'Ulchi Munduk destroys the Sui at the Great River.' },
			{ year: 645, label: 'Yang Manchun is added after holding Ansi.' }
		],
		aliases: ['Great Heroes of Goguryeo', 'Great Heroes']
	},
	{
		id: 'sillatang',
		name: 'The Silla–Tang Alliance',
		korean: '나당연합',
		hanja: '羅唐同盟',
		entity: 'concept',
		kingdom: 'other',
		title: 'The bargain that unified Samhan',
		tagline: 'The alliance that destroyed two kingdoms, then had to be destroyed itself.',
		arc: 'Chunchu’s masterpiece and the charge his enemies never stop levelling at him. It ends Baekje in 660 and Goguryeo in 668, and then requires an eight-year war to expel the ally from the peninsula it was invited onto.',
		events: [
			{ year: 648, label: 'Sealed by Chunchu and Emperor Taizong.' },
			{ year: 660, label: 'Baekje falls.' },
			{ year: 668, label: 'Goguryeo falls.' },
			{ year: 676, label: 'Silla expels the Tang.' }
		],
		aliases: ['Silla-Tang alliance', 'Silla–Tang alliance', 'Chunchu Army']
	},
	{
		id: 'eightclans',
		name: 'The Eight Great Clans',
		korean: '대성팔족',
		hanja: '大姓八族',
		entity: 'organization',
		kingdom: 'baekje',
		title: 'The noble houses of Baekje',
		tagline: 'Eight families who own the king by owning his sons’ mothers.',
		ideology: 'Clan oligarchy',
		ideologyNote: 'Aristocratic veto politics — eight houses as a constitution of no.',
		arc: 'Jinmo, Satek, Yunbi, Mokli, Hae, Baek, Guk, Ahn — the houses that make Baekje’s kings and, through the Ministers’ Assembly on Deer Rock, unmake them. Their chart lives in the Assembly chamber, not as a separate parliament: eight benches facing the Buyeo throne across an aisle. Euija breaks the houses in 655 by seating forty-one of his own sons in their chairs.',
		events: [
			{ year: 632, label: 'Minister Satek’s house holds both the queen and the Prime Minister.' },
			{ year: 655, label: 'Euija purges the Assembly and installs his sons.' }
		],
		orgChart: [
			{ id: 'euija', role: 'Buyeo throne', reportsTo: null },
			{ id: 'clan-satek', role: '사택', reportsTo: 'euija' },
			{ id: 'clan-jinmo', role: '진모', reportsTo: 'euija' },
			{ id: 'clan-yunbi', role: '연비', reportsTo: 'euija' },
			{ id: 'clan-mokli', role: '목리', reportsTo: 'euija' },
			{ id: 'clan-hae', role: '해', reportsTo: 'euija' },
			{ id: 'clan-baek', role: '백', reportsTo: 'euija' },
			{ id: 'clan-guk', role: '국', reportsTo: 'euija' },
			{ id: 'clan-ahn', role: '안', reportsTo: 'euija' }
		],
		aliases: ['Eight Great Clans']
	},
	{
		id: 'ministersassembly',
		name: 'The Ministers’ Assembly',
		korean: '정사암회의',
		hanja: '政事巖會議',
		entity: 'organization',
		kingdom: 'baekje',
		title: 'Baekje’s majority cabinet on Deer Rock',
		tagline: 'Eight 좌평 four-and-four beside the aisle, eight 달솔 four-and-four on the outer benches — Premier on the aisle, King at the helm.',
		nature: 'Votes bought in pieces over lunch. Faster than Surabol’s unanimity, uglier, and proud of both. Deer Rock (정사암) sweats before a good decision — or before brine.',
		arc: 'Baekje’s Ministers’ Assembly settles by majority at Deer Rock: 좌평 and 달솔 count sleeves; the 상좌평 names the inevitable. Unlike Silla’s Harmony Council, a plurality of houses is enough — which is why street fights and harbour berths are politics by other means. Euija later packs the rock with his own sons and discovers a court with no rivals has no one left to tell him no.',
		events: [
			{ year: 632, label: 'Minister Satek holds queen and Prime Minister (상좌평).' },
			{ year: 655, label: 'Euija purges the Assembly and installs his sons.' }
		],
		orgChart: [
			{ id: 'euija', role: 'King · helm', reportsTo: null },
			{ id: 'ministersatek', role: '상좌평 · Premier', reportsTo: 'euija' },
			{ id: '_senior-1', role: '좌평 · Senior', reportsTo: 'ministersatek' },
			{ id: '_senior-2', role: '좌평 · Senior', reportsTo: 'ministersatek' },
			{ id: '_senior-3', role: '좌평 · Senior', reportsTo: 'ministersatek' },
			{ id: '_senior-4', role: '좌평 · Senior', reportsTo: 'ministersatek' },
			{ id: '_senior-5', role: '좌평 · Senior', reportsTo: 'ministersatek' },
			{ id: '_senior-6', role: '좌평 · Senior', reportsTo: 'ministersatek' },
			{ id: '_senior-7', role: '좌평 · Senior', reportsTo: 'ministersatek' },
			{ id: '_senior-8', role: '좌평 · Senior', reportsTo: 'ministersatek' },
			{ id: '_junior-1', role: '달솔 · Junior', reportsTo: 'ministersatek' },
			{ id: '_junior-2', role: '달솔 · Junior', reportsTo: 'ministersatek' },
			{ id: '_junior-3', role: '달솔 · Junior', reportsTo: 'ministersatek' },
			{ id: '_junior-4', role: '달솔 · Junior', reportsTo: 'ministersatek' },
			{ id: '_junior-5', role: '달솔 · Junior', reportsTo: 'ministersatek' },
			{ id: '_junior-6', role: '달솔 · Junior', reportsTo: 'ministersatek' },
			{ id: '_junior-7', role: '달솔 · Junior', reportsTo: 'ministersatek' },
			{ id: '_junior-8', role: '달솔 · Junior', reportsTo: 'ministersatek' }
		],
		aliases: [
			'Ministers’ Assembly',
			'정사암회의',
			'Deer Rock Assembly',
			'Senior Ministers',
			'좌평',
			'Junior Ministers',
			'달솔',
			'Prime Minister',
			'상좌평'
		]
	},
	{
		id: 'fiveblades',
		name: 'The Five Blades',
		korean: '오도',
		entity: 'concept',
		kingdom: 'goguryeo',
		title: 'Yeon Gesomun’s swords',
		tagline: 'Five ring-pommels across the back — four commanderies and a king, each crow-stamped.',
		arc: 'After the massacre of 642 Yeon takes the blades of the Southern, Northern, Western, and Central commanders — including his uncle Yeon Gusesa — and the king’s own sword, and wears them all. Every pommel carries the three-legged crow. They are the whole argument of his rule in one image: authority is not granted, it is carried — and the Yeon hall has always preferred carrying to asking.',
		events: [{ year: 642, label: 'Taken at the banquet, after clearing the Summit.' }],
		aliases: ['Five Blades']
	},
	{
		id: 'fairytales',
		name: 'Fairy Tales',
		korean: '설화',
		hanja: '說話',
		entity: 'concept',
		kingdom: 'other',
		title: 'Origin myths told as wonder-tales',
		tagline: 'Eggs, bears, aprons of earth — the chronicle’s Disney register, before the war rooms.',
		nature: 'The voice the story uses when it is still allowed to be a child: Hyukgosé’s egg, Ungnyeo’s cave, Sulmun scooping the sea into a mountain. Not history yet. A picture book that later ages have to live inside.',
		arc: 'Founder episodes and Tamla 본풀이 keep this register — whimsical, bright, a little cruel in the way fairy tales are. The war will not stay here. The music of those pages should still sound like a story being opened.',
		aliases: ['Fairy Tales', 'the fairy tales', '설화', '본풀이', 'origin tales']
	},
	{
		id: 'romance',
		name: 'Romance',
		korean: '연애담',
		entity: 'concept',
		kingdom: 'other',
		title: 'The chronicle’s love stories',
		tagline: 'Rain on ledgers, steam on stone, a tide table kept by two — K-drama without the helplessness.',
		nature: 'Not one couple: the register of wanting. Munmu and Jayi survive the war as partners. Chunchu and Munhee make a house. The cavern is hunger in another key. The music is the held sixth, the almost-kiss, the ballad that does not resolve on the first chorus.',
		arc: 'The series’ most successful romance is Jayi’s: she corrects Bupmin’s sums and later his kingdom. Other loves break, wait, or become policy. This entry is the tone of all of them — Melomance on a palace stair.',
		aliases: ['the romances', '연애담', 'love stories of the chronicle']
	},
	{
		id: 'highsummit',
		name: 'The High Summit',
		korean: '제가회의',
		hanja: '諸加會議',
		entity: 'organization',
		kingdom: 'goguryeo',
		title: 'Goguryeo’s council of Commanders',
		tagline: 'Commanders (대가) under a High Commander (막리지) — the king keeps the final vote.',
		nature: 'Consultation with a crown: all opinions equally valued until His Majesty finalises — then equally forgotten. After 642 the Supreme Commander (대막리지) makes the final vote a formality, with a Chancellor (대대로) to issue retrospective minutes.',
		arc: 'The Five Commanderies argue as Commanders (대가); the High Commander (막리지) is first sword; the king casts the last word. Yeon’s massacre replaces the old first chair with Supreme Commander (대막리지) and seats Dosuryu as Chancellor (대대로) — force first, procedure after.',
		events: [
			{ year: 642, label: 'Summit cleared at Yeon’s banquet; Supreme Commander created.' },
			{ year: 642, label: 'Dosuryu named Chancellor (대대로).' }
		],
		orgChart: [
			{ id: 'bojang', role: 'King', reportsTo: null },
			{ id: 'gesomun', role: '대막리지 · Supreme Commander', reportsTo: 'bojang' },
			{ id: 'dosuryu', role: '대대로 · Chancellor', reportsTo: 'gesomun' },
			{ id: 'northcmd', role: 'Northern 대가', reportsTo: 'gesomun' },
			{ id: 'southcmd', role: 'Southern 대가', reportsTo: 'gesomun' },
			{ id: 'westcmd', role: 'Western 대가', reportsTo: 'gesomun' },
			{ id: 'yangmanchun', role: 'Ansi guardian', reportsTo: 'gesomun' },
			{ id: 'namseng', role: 'Yeon heir', reportsTo: 'gesomun' },
			{ id: 'namgun', role: 'Yeon second', reportsTo: 'gesomun' },
			{ id: 'namsan', role: 'Yeon third', reportsTo: 'gesomun' }
		],
		aliases: [
			'High Summit',
			'제가회의',
			'Commanders',
			'대가',
			'High Commander',
			'막리지',
			'Supreme Commander',
			'대막리지',
			'Chancellor',
			'대대로'
		]
	},
	{
		id: 'royalsecretariat',
		name: 'The Royal Secretariat',
		korean: '집사부',
		hanja: '執事部',
		entity: 'organization',
		kingdom: 'silla',
		title: 'Chunchu’s instrument of direct rule',
		tagline: 'Never Enough — Tang’s three departments and six ministries, copied and exceeded: fourteen Silla ministries under one 시중.',
		ideology: 'Westernizing institutionalism',
		ideologyNote: 'Chunchu wanted to model Silla after Tang — then out-Tang Tang. Like two Koreas taking one ideology each to the extreme: Never Enough.',
		nature: 'The Chunchu Reforms in one building: preserve the Premier’s chair, empty it of consequences. Chang’an’s 三省六部 as blueprint; Surabol’s answer is 집사부 plus 병부, 창부, 예부 and ten 府 — fourteen ministries that never pretend to wait for six unanimous sleeves.',
		arc: 'Founded in 651 as 집사부 with Kim Jukji as first Royal Secretary (시중). Chunchu admired Tang’s machine and decided Surabol needed more of it — 집사부, 병부, 창부, 예부, and ten 府 beneath the 시중, fourteen ministries where Chang’an stops at six. The Harmony Council still meets; nothing of consequence waits. Enemies call it tyranny by Tuesday; Chunchu calls it Never Enough.',
		events: [
			{ year: 651, label: 'Established by Chunchu; Jukji named first Royal Secretary (시중); fourteen ministries seated.' },
			{ year: 654, label: 'Runs the kingdom under Muyeol while the Council adjourns on schedule.' }
		],
		orgChart: [
			{ id: 'chunchu', role: 'King', reportsTo: null },
			{ id: 'jukji', role: '시중 · Royal Secretary', reportsTo: 'chunchu' },
			{ id: '_min-jipsa', role: '집사부 · Secretariat', reportsTo: 'jukji' },
			{ id: '_min-byeong', role: '병부 · War', reportsTo: 'jukji' },
			{ id: '_min-chang', role: '창부 · Granary', reportsTo: 'jukji' },
			{ id: '_min-ye', role: '예부 · Rites', reportsTo: 'jukji' },
			{ id: '_min-jwa', role: '좌사부 · Left Secretariat', reportsTo: 'jukji' },
			{ id: '_min-u', role: '우사부 · Right Secretariat', reportsTo: 'jukji' },
			{ id: '_min-hyeong', role: '형부 · Justice', reportsTo: 'jukji' },
			{ id: '_min-gong', role: '공부 · Public Works', reportsTo: 'jukji' },
			{ id: '_min-si', role: '시부 · Markets', reportsTo: 'jukji' },
			{ id: '_min-hwa', role: '화부 · Treasury', reportsTo: 'jukji' },
			{ id: '_min-gongju', role: '공주부 · Public Granary', reportsTo: 'jukji' },
			{ id: '_min-naegwan', role: '내관부 · Inner Court', reportsTo: 'jukji' },
			{ id: '_min-oegwan', role: '외관부 · Outer Court', reportsTo: 'jukji' },
			{ id: '_min-taehak', role: '태학부 · Academy', reportsTo: 'jukji' }
		],
		aliases: [
			'Royal Secretariat',
			'執事部',
			'집사부',
			'Royal Secretary',
			'시중',
			'侍中',
			'Chunchu Reforms'
		]
	},
	{
		id: 'restorationarmy',
		name: 'Baekje Restoration Army',
		korean: '백제부흥군',
		hanja: '百濟復興軍',
		entity: 'organization',
		kingdom: 'baekje',
		title: 'The army that tried to un-fall Baekje',
		tagline: 'Pungjang’s banner over Juryu — five founding captains: Boksin, Dochim, Sangji, Sangya, and the crown Pung fetched from Yamato.',
		ideology: 'Restoration royalism',
		ideologyNote: 'Five founding members — Boksin and Dochim raise the host; Sangji holds Imjon; Satek Sangya feeds the lanes; Pungjang supplies the crown. A movement that eats its captains.',
		arc: 'After Sabi, Gwishil Boksin and the monk Dochim raise a host from people the Eight Clans never counted, with Heukchi Sangji at Imjon and Satek Sangya keeping harbour steel in the line. They fetch Prince Pung from Yamato and crown him Pungjang — five founding captains under one banner. Dochim dies to Boksin’s knife; Boksin dies to Pung’s order; Sangji and Sangya break last at the White River. Not a Great Clan parliament — a restoration that eats its captains.',
		events: [
			{ year: 660, label: 'Boksin, Dochim, Sangji, and Sangya raise the BRA after Sabi.' },
			{ year: 661, label: 'Pung returns; crowned Pungjang — the fifth founding seat filled.' },
			{ year: 661, label: 'Dochim killed; Sangji holds Imjon.' },
			{ year: 663, label: 'Boksin executed; Sangya and Sangji break; White River ends the army.' }
		],
		orgChart: [
			{ id: 'pung', role: 'King Pungjang · founding crown', reportsTo: null },
			{ id: 'boksin', role: 'General · Gwishil · co-founder', reportsTo: 'pung' },
			{ id: 'dochim', role: 'General · monk · co-founder', reportsTo: 'pung' },
			{ id: 'sangji', role: 'General · Imjon · co-founder', reportsTo: 'pung' },
			{ id: 'sateksangya', role: 'General · Satek · co-founder', reportsTo: 'pung' }
		],
		aliases: [
			'Baekje Restoration Army',
			'Restoration Army',
			'백제부흥군',
			'BRA',
			'Pungjang’s army'
		]
	},
	{
		id: 'tangcourt',
		name: 'The Tang Court',
		korean: '당 조정',
		hanja: '唐朝廷',
		entity: 'organization',
		kingdom: 'tang',
		title: 'Chang’an’s departments and throne',
		tagline: 'Emperor above Zhongshu legislative, Menxia examination, Shangshu executive.',
		arc: 'Taizong’s war rooms, Gaozong’s inheritance, Wu’s rising shadow — the court Silla steals grammar from and later has to expel from the peninsula.',
		orgChart: [
			{ id: 'taizong', role: 'Emperor', reportsTo: null },
			{ id: 'gaozong', role: 'Heir → Emperor', reportsTo: 'taizong' },
			{ id: 'wuzetian', role: 'Consort / power', reportsTo: 'gaozong' },
			{ id: 'weizheng', role: 'Minister', reportsTo: 'taizong' },
			{ id: 'lishiji', role: 'General', reportsTo: 'taizong' },
			{ id: 'sudingfang', role: 'Expedition commander', reportsTo: 'gaozong' },
			{ id: 'xuerengui', role: 'Eastern general', reportsTo: 'gaozong' }
		],
		aliases: ['Tang Court', 'Tang court', 'Chang’an court', '당 조정', '唐朝廷']
	},

	{
		id: 'tangexpedition',
		name: 'Tang Eastern Expedition',
		korean: '당 동정군',
		hanja: '唐東征軍',
		entity: 'organization',
		kingdom: 'tang',
		title: 'Expeditionary command against Samhan',
		tagline: 'Su Dingfang’s river fleet, Xue’s white coat, and the road that ends at Maeso.',
		arc: 'Not a standing ministry — the campaign stack Chang’an sends east: Su Dingfang at the Baek river, Xue Rengui inheriting the White Tiger title, Li Shiji’s earlier Liao roads. The court drafts; this command executes.',
		orgChart: [
			{ id: 'gaozong', role: 'Emperor', reportsTo: null },
			{ id: 'sudingfang', role: 'Baek-river commander', reportsTo: 'gaozong' },
			{ id: 'xuerengui', role: 'Eastern blade', reportsTo: 'gaozong' },
			{ id: 'lishiji', role: 'Liao campaign general', reportsTo: 'gaozong' }
		],
		aliases: ['Tang Eastern Expedition', 'Eastern Expedition', '당 동정군', 'Tang expedition']
	},
	{
		id: 'fourdragons',
		name: 'The Four Dragons',
		korean: '사룡',
		hanja: '四龍',
		entity: 'group',
		kingdom: 'tang',
		title: 'The Second Emperor’s dragon generals',
		tagline: 'White, Red, Blue, and Black Dragons — Taizong’s named blades for the Liao roads.',
		nature: 'Samhan learns banners, not names. Four dragon titles under the Second Emperor for the seventh invasion and every road that follows.',
		arc: 'Taizong’s Seventh Invasion of Goguryeo seats four dragon generals: White Dragon (Xue Rengui), Red Dragon (Su Dingfang), Blue Dragon (Li Shiji), Black Dragon (Liu Rengui). Only the Blue Dragon survives into the Third Emperor’s beast roster — the one general both courts could not afford to lose.',
		events: [
			{ year: 645, label: 'Four Dragons named for Taizong’s personal Goguryeo campaign.' },
			{ year: 649, label: 'Second Emperor dies; Blue Dragon serves on under Gaozong.' }
		],
		orgChart: [
			{ id: 'taizong', role: 'Second Emperor', reportsTo: null },
			{ id: 'xuerengui', role: 'White Dragon · 백룡', reportsTo: 'taizong' },
			{ id: 'sudingfang', role: 'Red Dragon · 적룡', reportsTo: 'taizong' },
			{ id: 'lishiji', role: 'Blue Dragon · 청룡', reportsTo: 'taizong' },
			{ id: 'liurengui', role: 'Black Dragon · 흑룡', reportsTo: 'taizong' }
		],
		aliases: ['Four Dragons', '사룡', '四龍', 'Taizong’s dragons']
	},
	{
		id: 'fourbeasts',
		name: 'The Four Beasts',
		korean: '사신',
		hanja: '四神',
		entity: 'group',
		kingdom: 'tang',
		title: 'The Third Emperor’s beast generals',
		tagline: 'White Tiger, Red Fowl, Blue Dragon, Black Tortoise — Gaozong’s inherited war machine.',
		nature: 'Same empire, new zodiac. The father’s dragons become the son’s beasts — and only the Blue Dragon answers both musters.',
		arc: 'Gaozong’s Eighth Invasion of Goguryeo inherits his father’s war and renames the roster: White Tiger (Pang Xiaotai), Red Fowl (Su Dingfang), Blue Dragon (Li Shiji), Black Tortoise (Liu Rengui). Li Shiji alone served under both the Four Dragons and the Four Beasts — the chronicle’s only shared blade between Second and Third Emperor campaigns.',
		events: [
			{ year: 661, label: 'Four Beasts named for the Eighth Invasion of Goguryeo.' },
			{ year: 662, label: 'White Tiger dies at the Snake River; Blue Dragon and Black Tortoise continue east.' }
		],
		orgChart: [
			{ id: 'gaozong', role: 'Third Emperor', reportsTo: null },
			{ id: 'pangxiaotai', role: 'White Tiger · 백호', reportsTo: 'gaozong' },
			{ id: 'sudingfang', role: 'Red Fowl · 주작', reportsTo: 'gaozong' },
			{ id: 'lishiji', role: 'Blue Dragon · 청룡 · survivor', reportsTo: 'gaozong' },
			{ id: 'liurengui', role: 'Black Tortoise · 현무', reportsTo: 'gaozong' }
		],
		aliases: ['Four Beasts', '사신', '四神', 'Gaozong’s beasts']
	},
	{
		id: 'four_divisions',
		name: 'The Three Realms',
		korean: '삼계',
		entity: 'organization',
		kingdom: 'other',
		title: 'Cosmology — three courts beneath Hwanin’s heaven',
		tagline: 'Three Realms under the Creator: 이승, 저승, 서천꽃밭 — Heaven is above, not a peer.',
		quote: 'West far enough, and even the living world ends.',
		nature:
			'Not a map of nations but of jurisdiction. Above: Hwanin (Class S) — Creator, Lord, King of Kings, the Big Man Upstairs. Class I gods each keep one of the Three Realms. Legacy id `four_divisions` kept for wiki links; preferred name is Three Realms / 삼계.',
		arc: 'The chronicle’s cosmology — Three Realms (삼계) — told first on Tamla when Yuri Dora names the structure for Gyebek:\n\nAbove: Hwanin / 환인 (Class S) — Creator; keeps 하늘나라 as his own court, not a peer realm. Mandate descends Hwanung → Dangun into the mortal domain.\n\n1. 이승 — Land of the Living, ruled by Little Star / 소별왕 (Class I). Retinue: Ibiga (sky), Haemosu (sun), Samsin (life). Yuhwa keeps the moon after death.\n2. 저승 — Land of the Dead, ruled by Big Star / 대별왕 (Class I). Within: Yumla’s judgment court; Kangrim and Haewonmek fetch.\n3. 서천꽃밭 — Western Flower Field, kept by Hallakgungi (할락궁이, Class I). Resurrection and ruin in the same rows.\n\nHeaven’s Court is not a fourth realm — it is Hwanin’s seat above 삼계. Tamla stays carefree about the Great War partly because it knows how much larger the world is than Samhan’s maps.',
		events: [
			{ label: 'Heaven–Earth King retires; Big Star and Little Star inherit living and dead under Hwanin.' },
			{ label: 'Yuri Dora first names 삼계 for Gyebek after the flower-wager myth.' },
			{ label: 'Big Star and Little Star divide 이승 and 저승 by a flower wager.' },
			{ label: 'Hwanin keeps Heaven above; Hallakgungi keeps the western flowers; Yumla judges inside 저승.' }
		],
		orgChart: [
			{ id: 'hwanin', role: 'Creator · Lord of Heaven · Class S', reportsTo: null },
			{ id: 'sobyeol', role: '이승 · Little Star · Class I', reportsTo: 'hwanin' },
			{ id: 'daebyeol', role: '저승 · Big Star · Class I', reportsTo: 'hwanin' },
			{ id: 'sara', role: '서천꽃밭 · Hallakgungi · Class I', reportsTo: 'hwanin' },
			{ id: 'ibiga', role: 'Sky · Ibiga', reportsTo: 'sobyeol' },
			{ id: 'haemosu', role: 'Sun · Haemosu', reportsTo: 'sobyeol' },
			{ id: 'yuhwa', role: 'Moon · Yuhwa', reportsTo: 'sobyeol' },
			{ id: 'samsin', role: 'Life · Samsin', reportsTo: 'sobyeol' },
			{ id: 'yumla', role: 'Judgment · Yumla', reportsTo: 'daebyeol' },
			{ id: 'kangrim', role: 'Fetch · Kangrim', reportsTo: 'daebyeol' },
			{ id: 'haewonmek', role: 'Fetch · Haewonmek', reportsTo: 'daebyeol' }
		],
		aliases: [
			'Three Realms',
			'The Three Realms',
			'삼계',
			'Four Realms',
			'The Four Realms',
			'Four Divisions',
			'The Four Divisions',
			'사계',
			'네 세계',
			'하늘나라 조정',
			'Heaven court',
			'cosmology',
			'worldview'
		]
	}
];

// ————————————————————————— groups (named ensembles) —————————————————————————
// `entity: 'group'` — named casts (trios, rosters, brotherhoods, realm places).
// Membership lives on the person/place via GROUPS_BY_ID; group pages reverse-look-up
// with `groupMembersOf` in wiki.ts. Display order can be pinned in GROUP_ROSTERS.
// Four Dragons / Four Beasts (in CONCEPTS) share this entity.
export const GROUPS: Person[] = [
	{
		id: 'caverngoddesses',
		name: 'The Three Cavern Goddesses',
		korean: '삼성여신',
		entity: 'group',
		kingdom: 'silla',
		title: 'Sisters of the steam cavern',
		tagline: 'Narim, Golhwa, and Hyullé — three goddesses of the cavern lake who keep only Kims.',
		arc: 'Eldest, youngest, and the quiet one between: the three sisters of the steam cavern beyond Surabol. They loved Kim Seohyeon first — surname and steam, same sound — and every Kim who finds the lake after him is heirloom.',
		aliases: ['Three Cavern Goddesses', 'The Three Cavern Goddesses', '삼성여신']
	},
	{
		id: 'eternalhwarang',
		name: 'The Three Eternal Hwarang',
		korean: '화랑삼웅',
		entity: 'group',
		kingdom: 'silla',
		title: 'The flower knights the age remembers',
		tagline: 'Yushin, Alchun, and Bidam — Class 51 (오십일기), the three Hwarang whose names outlast the order itself.',
		arc: 'Of all the flower knights Surabol raised, three names refuse to fade: Yushin the sword, Alchun the elder statesman, Bidam the rebel — Class 51, 오십일기. The order made many; the chronicle keeps these three.',
		aliases: ['Three Eternal Hwarang', 'The Three Eternal Hwarang', '화랑삼웅']
	},
	{
		id: 'gayakims',
		name: 'The Three Gaya Kims',
		korean: '가야삼김',
		entity: 'group',
		kingdom: 'gaya',
		title: 'Three generations from surrender to sword',
		tagline: 'Muryuk, Seohyeon, Yushin — grandfather, father, son: the Gaya line that became Silla’s blade.',
		arc: 'Muryuk traded a kingdom so his blood could keep a sword; Seohyeon made the surrender into a household; Yushin made the household into a legend. Three generations of Geumgwan Kims, from the last prince of Golden Gaya to the Sword of Silla.',
		aliases: ['Three Gaya Kims', 'The Three Gaya Kims', '가야삼김']
	},
	{
		id: 'sacredbones',
		name: 'The Three Sacred Bones',
		korean: '성골삼녀',
		entity: 'group',
		kingdom: 'silla',
		title: 'The last women of the Sacred Bone',
		tagline: 'Dukman, Seungman, Chunmyung — the three Sacred Bone women who closed the holy line.',
		arc: 'When the Sacred Bone ran out of men, it ran on women: Dukman took the throne, Seungman held it after her, and Chunmyung traded her claim for a son who would be king. Three cousins, one exhausted holiness.',
		aliases: ['Three Sacred Bones', 'The Three Sacred Bones', '성골삼녀']
	},
	{
		id: 'realmgods',
		name: 'The Three Realm Gods',
		korean: '삼계제신',
		entity: 'group',
		kingdom: 'other',
		title: 'Class I — one court each of the Three Realms',
		tagline: 'Hallakgungi, Big Star, Little Star — the three Class I gods who keep 서천꽃밭, 저승, and 이승.',
		arc: 'Beneath Hwanin’s heaven, three keepers split the world: Little Star rules the living, Big Star the dead, and Hallakgungi keeps the Western Flower Field between them. One court each of 삼계 — heaven’s ruler stays above, not among them.',
		aliases: ['Three Realm Gods', 'The Three Realm Gods', '삼계제신']
	},
	{
		id: 'fourrealms',
		name: 'The Four Realms',
		korean: '사계',
		hanja: '四界',
		entity: 'group',
		kingdom: 'other',
		title: '하늘나라, 이승, 저승, 서천꽃밭',
		tagline: 'The cosmological courts: Heaven above; Living World, Underworld, and Western Flower Field below.',
		arc: 'A group of places, not of gods — the encyclopedia’s four cosmological courts. The chronicle’s 삼계 are 이승, 저승, and 서천꽃밭; 하늘나라 sits above them and is not counted as a peer. The yearly 정자 is a meeting floor between the three lower courts, not a realm of its own. Flower Cliff is a drop inside the western field.',
		color: '#d4b86a',
		aliases: [
			'The Four Realms',
			'Four Realms places',
			'the cosmological places',
			'Realm places',
			'사계 장소'
		]
	},
	{
		id: 'lifegods',
		name: 'The Life Gods',
		korean: '이승삼신',
		entity: 'group',
		kingdom: 'other',
		title: 'Little Star’s retinue in the land of the living',
		tagline: 'Haemosu, Ibiga, Samsin — sun, sky, and life: the three gods who tend 이승.',
		arc: 'The living world runs on three offices under Little Star: Haemosu drives the sun, Ibiga keeps the sky, and Samsin hands out life itself. Where the reapers close doors, these three keep opening them.',
		aliases: ['Life Gods', 'The Life Gods', '이승삼신']
	},
	{
		id: 'grimreapers',
		name: 'The Grim Reapers',
		korean: '저승사자',
		entity: 'group',
		kingdom: 'underworld',
		title: 'The fetch-officers of the dead',
		tagline: 'Kangrim and Haewonmek — the two reapers who walk the living world to collect its dead.',
		arc: 'Big Star keeps the orderly dark; these two do the walking. Kangrim, the one the myths promoted, and Haewonmek, the partner on the road — the pair every death scene in the chronicle waits for.',
		aliases: ['Grim Reapers', 'The Grim Reapers', '저승사자']
	},
	{
		id: 'brafounders',
		name: 'BRA Founding Captains',
		korean: '부흥군 오장',
		hanja: '復興軍五將',
		entity: 'group',
		kingdom: 'baekje',
		title: 'The five who raised the restoration banner',
		tagline: 'Boksin, Dochim, Sangji, Sangya — and Pungjang’s crown fetched from Yamato.',
		arc: 'Not Eight-Clan furniture: four generals and a prince who turned refugees into a kingdom-that-almost-was. They share one banner, one fracture, and one river mouth.',
		aliases: ['BRA Founders', 'BRA Founding Captains', 'Five founding members', '부흥군 오장']
	},
	{
		id: 'fiveprinces',
		name: 'The Five Princes of Baekje',
		korean: '백제오자',
		entity: 'group',
		kingdom: 'baekje',
		title: 'Euija’s five important sons',
		tagline: 'Yung, Tae, Hyo, Yun, Pung — five princes of fifty-odd, and the feud that finished a kingdom.',
		arc: 'Euija fathered dozens; the chronicle needs five. Yung the demoted eldest, Tae the self-crowned, Hyo the chosen, Yun the quiet one, Pung the restoration king. Their rivalry outlives the court that made it — finished at the White River, brother opposite brother.',
		aliases: ['Five Princes of Baekje', 'The Five Princes of Baekje', '백제오자']
	},
	{
		id: 'fivecommanders',
		name: 'The Five Commanders of Goguryeo',
		korean: '고려오대가',
		entity: 'group',
		kingdom: 'goguryeo',
		title: 'The five 대가 of the Five Commanderies',
		tagline: 'East, Central, North, South, West — the five Commanders whose Summit ended at Yeon’s banquet.',
		arc: 'The Five Commanderies argue as Commanders (대가): Gesomun in the East, Gusesa at the Centre, Go Ul in the North, Son Daeha in the South, Go Heumsong in the West. In 642 the Eastern Commander butchers the other four at a banquet — and the five crow-stamped blades change hands.',
		events: [{ year: 642, label: 'Four of the five die at Yeon’s banquet; the Eastern Commander rules.' }],
		aliases: ['Five Commanders of Goguryeo', 'The Five Commanders of Goguryeo', '고려오대가']
	},
	{
		id: 'threefounders',
		name: 'The Three Founders',
		korean: '삼대시조',
		entity: 'group',
		kingdom: 'other',
		title: 'Founders of the Three Kingdoms',
		tagline: 'Hyukgosé, Jumong, Onjo — the three founders of Silla, Goguryeo, and Baekje.',
		arc: 'Three beginnings for three crowns: Hyukgosé hatched from the egg the Founding Six Elders dug at Najeong, Jumong shot his way out of Buyeo, and Onjo walked south from his mother’s second founding. Every war in the chronicle argues about what these three started.',
		aliases: ['Three Founders', 'The Three Founders', '삼대시조']
	},
	{
		id: 'greatwomen',
		name: 'The Three Great Women',
		korean: '삼대성녀',
		entity: 'group',
		kingdom: 'other',
		title: 'The founding mothers of the kingdoms',
		tagline: 'Alyoung, Sosuno, Heo — the three women at the root of Silla, Baekje, and Gaya.',
		arc: 'The founders get the eggs and the arrows; these three get the kingdoms to keep. Alyoung, born of a Chicken Dragon beside Silla’s first king; Sosuno, who founded one kingdom with her husband and another with her sons; Heo, who sailed in from a country nobody had heard of and kept her own name.',
		aliases: ['Three Great Women', 'The Three Great Women', '삼대성녀']
	}
];

// ————————————————————————— clans (blood houses) —————————————————————————
export const CLANS: Person[] = [
	{
		id: 'clan-yeon',
		name: 'Yeon',
		korean: '연씨',
		hanja: '淵氏',
		entity: 'clan',
		kingdom: 'goguryeo',
		title: 'Clan of Yeon Tabal → Gesomun',
		tagline: 'Salt, iron, and five blades — the hall that preferred carrying to asking.',
		arc: 'From Yeon Tabal’s Jolbon hospitality to Gesomun’s massacre and three quarreling sons. The house outranks ordinary Commanders once Supreme Commander exists; it cannot invent a succession that survives Gesomun’s sleep.',
		aliases: ['Yeon House', 'Yeon clan', '연씨', '淵氏', 'House of Yeon', 'The Yeon House']
	},
	{
		id: 'clan-gyeongju-kim',
		name: 'Surabol Kim',
		korean: '경주 김씨',
		hanja: '徐羅伐 金氏',
		entity: 'clan',
		kingdom: 'silla',
		title: 'Royal Kim line of Surabol (Alji)',
		tagline: 'The capital house that wears purple and argues over thrones in the same breath.',
		arc: 'Alji’s line and the Surabol Kims — Jinheung, Sunduk, Jinduk, Gotaso, Munmu’s royal house. Era identity is bon-gwan plus Kim; modern records call them Gyeongju Kim (경주 김씨). Distinct from the Gaya Kim line that entered through Golden Gaya’s surrender.',
		aliases: [
			'Surabol Kim',
			'Kim of Surabol',
			'Royal Silla Kim',
			'Gyeongju Kim',
			'경주 김씨',
			'Kim of Gyeongju',
			'慶州金氏'
		]
	},
	{
		id: 'clan-surabol-lee',
		name: 'Surabol Lee',
		korean: '경주 이씨',
		hanja: '徐羅伐 李氏',
		entity: 'clan',
		kingdom: 'silla',
		title: 'Lee line of Alcheon · Geupnyang-bu',
		tagline: 'Alpyung’s house — first dig at Najeong, first elder seat.',
		arc: 'Founding elder Alpyung of Alcheon Yangsan-chon (알천 양산촌), head of Geupnyang-bu (급량부). Era identity: Surabol Lee (서라벌 이씨); modern bon-gwan Gyeongju Lee (경주 이씨). True Bone by founding blood — one of the six lines the egg-born king raised.',
		aliases: ['Surabol Lee', 'Lee of Surabol', 'Gyeongju Lee', '경주 이씨', '이씨', '李氏']
	},
	{
		id: 'clan-surabol-choi',
		name: 'Surabol Choi',
		korean: '경주 최씨',
		hanja: '徐羅伐 崔氏',
		entity: 'clan',
		kingdom: 'silla',
		title: 'Choi line of Dolsan · Saryang-bu',
		tagline: 'Sobuldori’s house — Alchun’s ancestor, Saryang-bu and the older courtesy.',
		arc: 'Founding elder Sobuldori of Dolsan Goheo-chon (돌산 고허촌), head of Saryang-bu (사량부). Era: Surabol Choi (서라벌 최씨); modern Gyeongju Choi (경주 최씨). Alchun of the Hwarang descends this line — the chronicle names Sobuldori in the founding table and lets Alchun inherit the name without boasting.',
		aliases: ['Surabol Choi', 'Choi of Surabol', 'Gyeongju Choi', '경주 최씨', '최씨', '崔氏']
	},
	{
		id: 'clan-surabol-jeong',
		name: 'Surabol Jeong',
		korean: '경주 정씨',
		hanja: '徐羅伐 鄭氏',
		entity: 'clan',
		kingdom: 'silla',
		title: 'Jeong line of Chuisan · Bonpi-bu',
		tagline: 'Jibekho’s house — lineage, census, who counts as bone.',
		arc: 'Founding elder Jibekho of Chuisan Jinji-chon (취산 진지촌), head of Bonpi-bu (본피부). Era: Surabol Jeong (서라벌 정씨); modern Gyeongju Jeong (경주 정씨). The department that keeps registers echoes in every later bone-rank quarrel.',
		aliases: ['Surabol Jeong', 'Jeong of Surabol', 'Gyeongju Jeong', '경주 정씨', '정씨', '鄭氏', 'Jung clan']
	},
	{
		id: 'clan-surabol-son',
		name: 'Surabol Son',
		korean: '경주 손씨',
		hanja: '徐羅伐 孫氏',
		entity: 'clan',
		kingdom: 'silla',
		title: 'Son line of Musan · Jeomnyang-bu',
		tagline: 'Gurema’s house — Musan hall, oldest pride, Bidam’s implied blood.',
		arc: 'Founding elder Gurema of Musan Daesu-chon (무산 대수촌), head of Jeomnyang-bu (점량부). Era: Surabol Son (서라벌 손씨); modern Gyeongju Son (경주 손씨). Bidam’s black robe and old-hall steel read as this line — never stated, always implied.',
		aliases: ['Surabol Son', 'Son of Surabol', 'Gyeongju Son', '경주 손씨', '손씨', '孫氏']
	},
	{
		id: 'clan-surabol-bae',
		name: 'Surabol Bae',
		korean: '경주 배씨',
		hanja: '徐羅伐 裴氏',
		entity: 'clan',
		kingdom: 'silla',
		title: 'Bae line of Geumsan · Hangi-bu',
		tagline: 'Jita’s house — gold mountain, hill forts, Hangi-bu.',
		arc: 'Founding elder Jita of Geumsan Gari-chon (금산 가리촌), head of Hangi-bu (한기부). Era: Surabol Bae (서라벌 배씨); modern Gyeongju Bae (경주 배씨).',
		aliases: ['Surabol Bae', 'Bae of Surabol', 'Gyeongju Bae', '경주 배씨', '배씨', '裴氏']
	},
	{
		id: 'clan-surabol-seol',
		name: 'Surabol Seol',
		korean: '경주 설씨',
		hanja: '徐羅伐 薛氏',
		entity: 'clan',
		kingdom: 'silla',
		title: 'Seol line of Myeonghwalsan · Seupbi-bu',
		tagline: 'Hojin’s house — wet rites, six hearths bound to one smoke.',
		arc: 'Founding elder Hojin of Myeonghwalsan Goya-chon (명활산 고야촌), head of Seupbi-bu (습비부). Era: Surabol Seol (서라벌 설씨); modern Gyeongju Seol (경주 설씨).',
		aliases: ['Surabol Seol', 'Seol of Surabol', 'Gyeongju Seol', '경주 설씨', '설씨', '薛氏']
	},
	{
		id: 'clan-geumgwan-kim',
		name: 'Gaya Kim',
		korean: '김해 김씨 · 금관 김씨',
		hanja: '加耶 金氏',
		entity: 'clan',
		kingdom: 'gaya',
		title: 'Kim line from Golden Gaya (Suro)',
		tagline: 'Last princely blood of Gaya — Yushin’s edge inside Silla’s True Bone.',
		arc: 'The Kim surname that arrived when Golden Gaya fell. Suro and Queen Heo (by marriage), Ijinasi’s brother-line claim, Muryuk’s surrender, Seohyeon in the steam, Yushin and Munhee inside Silla’s True Bone — periphery loyalty that out-loves the centre without erasing the Gaya origin. Modern records split the name between Gimhae Kim (김해 김씨) and Geumgwan Kim (금관 김씨).',
		aliases: [
			'Gaya Kim',
			'Kim of Gaya',
			'Geumgwan Kim',
			'Kim · Geumgwan Gaya line',
			'김해 김씨',
			'금관 김씨',
			'金官金氏'
		]
	},
	{
		id: 'clan-buyeo',
		name: 'Buyeo',
		korean: '부여',
		hanja: '扶餘',
		entity: 'clan',
		kingdom: 'baekje',
		title: 'Royal house of Baekje',
		tagline: 'The kings’ surname — fifty sons, five who matter, one throne.',
		arc: 'Euija’s house and the princes who inherit or lose the mark: Yung, Tae, Hyo, Yun, Pung. Maternal Eight-Clan claims ride underneath the Buyeo name.',
		aliases: ['Buyeo royal house', 'Buyeo', '부여', '扶餘', 'Royal house of Baekje']
	},
	{
		id: 'clan-satek',
		name: 'Satek',
		korean: '사택',
		hanja: '沙宅',
		entity: 'clan',
		kingdom: 'baekje',
		title: 'One of the Eight Great Clans',
		tagline: 'Queen’s sleeve and Prime Minister’s chair — until Euija cuts both.',
		arc: 'Holds Queen Satek (Euija’s mother) and Minister Satek’s ministry in the same generation. Yung’s maternal claim. The purge of 655 empties their Deer Rock seats.',
		aliases: ['Satek', '사택', '沙宅', 'Satek clan']
	},
	{
		id: 'clan-yunbi',
		name: 'Yunbi',
		korean: '연비',
		hanja: '燕比',
		entity: 'clan',
		kingdom: 'baekje',
		title: 'One of the Eight Great Clans',
		tagline: 'Harbour arithmetic and a different 연 — never Yeon Gesomun’s house.',
		arc: 'Elder Yunbi and Lady Yunbi speak for berths and vetoes. Not Prince Yun’s Buyeo 연, not Goguryeo’s 淵.',
		aliases: ['Yunbi', '연비', '燕比', 'Yunbi clan']
	},
	{
		id: 'clan-jinmo',
		name: 'Jinmo',
		korean: '진모',
		hanja: '眞牟',
		entity: 'clan',
		kingdom: 'baekje',
		title: 'One of the Eight Great Clans',
		tagline: 'Prestige house — Prince Tae’s maternal whisper.',
		arc: 'Counted among the eight that seat and unseat kings. Tae is their quiet claim among Euija’s five.',
		aliases: ['Jinmo', '진모', '眞牟', 'Jinmo clan']
	},
	{
		id: 'clan-mokli',
		name: 'Mokli',
		korean: '목리',
		hanja: '木劦',
		entity: 'clan',
		kingdom: 'baekje',
		title: 'One of the Eight Great Clans',
		tagline: 'Timber and eastern berths — Pung’s maternal look across the water.',
		arc: 'The house that already faces Yamato before the court parks a prince there. Pungjang’s restoration wears their grain as much as Buyeo blood.',
		aliases: ['Mokli', '목리', 'Mokli clan']
	},
	{
		id: 'clan-hae',
		name: 'Hae',
		korean: '해',
		hanja: '解',
		entity: 'clan',
		kingdom: 'baekje',
		title: 'One of the Eight Great Clans',
		tagline: 'Coast salt — Prince Yun’s maternal hook.',
		arc: 'Harbour house among the eight. Easy to overlook in succession theatre; useful when ships matter.',
		aliases: ['Hae', '해', '解', 'Hae clan']
	},
	{
		id: 'clan-baek',
		name: 'Baek',
		korean: '백',
		hanja: '苩',
		entity: 'clan',
		kingdom: 'baekje',
		title: 'One of the Eight Great Clans',
		tagline: 'One of the eight sleeves on Deer Rock.',
		arc: 'Named with the Great Clans that own Assembly chairs before Euija seats his sons over them.',
		aliases: ['Baek', '백', 'Baek clan']
	},
	{
		id: 'clan-guk',
		name: 'Guk',
		korean: '국',
		hanja: '國',
		entity: 'clan',
		kingdom: 'baekje',
		title: 'One of the Eight Great Clans',
		tagline: 'One of the eight sleeves on Deer Rock.',
		arc: 'Named with the Great Clans; emptied with them in 655.',
		aliases: ['Guk', '국', 'Guk clan']
	},
	{
		id: 'clan-ahn',
		name: 'Ahn',
		korean: '안',
		hanja: '燕',
		entity: 'clan',
		kingdom: 'baekje',
		title: 'One of the Eight Great Clans',
		tagline: 'One of the eight sleeves on Deer Rock.',
		arc: 'Named with the Great Clans; emptied with them in 655.',
		aliases: ['Ahn', '안', 'Ahn clan']
	},
	{
		id: 'clan-gwishil',
		name: 'Gwishil',
		korean: '귀실',
		hanja: '鬼室',
		entity: 'clan',
		kingdom: 'baekje',
		title: 'House of Gwishil Boksin',
		tagline: 'Not Eight-Clan furniture — the muscle that builds the Restoration Army.',
		arc: 'Boksin’s surname. Frontier competence the Deer Rock houses never invited to lunch, then needed after Sabi.',
		aliases: ['Gwishil', '귀실', '鬼室', 'Gwishil clan']
	},
	{
		id: 'clan-go',
		name: 'Go',
		korean: '횡성 고씨 · 橫城 高氏',
		hanja: '高氏',
		entity: 'clan',
		kingdom: 'goguryeo',
		title: 'Royal Go house of Goguryeo',
		tagline: 'Jumong’s surname on the throne — until Yeon makes the crown a formality.',
		arc: 'The royal Go line Jumong founds and Youngryu and Bojang wear — Sosuno joins by marriage from the Yeon hall. Yeon’s Supreme Commander leaves the name on the lintel and empties it of command. Modern Joseon-era records attach the bon-gwan Hoengseong (횡성 고씨 / 橫城 高氏); in-period the house is simply Go.',
		aliases: ['Go', 'Go house', 'Go clan', 'Royal Go', '고씨', '高氏', '횡성 고씨', '橫城 高氏']
	}

];

// ————————————————————————— the nations —————————————————————————
export const NATIONS: Person[] = [
	{
		id: 'nation-silla',
		name: 'Silla',
		korean: '신라',
		hanja: '新羅',
		entity: 'nation',
		kingdom: 'silla',
		born: -57,
		died: 935,
		title: 'The Divine Country',
		photo: '/nations/silla.jpg',
		photoCredit: 'Cheomseongdae observatory, Gyeongju — built under Queen Seondeok (Wikimedia Commons)',
		tagline: 'The Divine Country — smallest of the three, and the one left standing.',
		ideology: 'Caste traditionalism → diplomatic modernizer',
		ideologyNote: 'Rigid bone rank that learns the West’s grammar to keep its own name on the lintel.',
		nature: 'Bone Rank sorts who may rule; the Harmony Council sorts who may act — and only when every noble agrees. Hwarang forge the boys who will either save the throne or rebel against it — elite of the elite, lettered and beautiful, with fighting forms the yards still name. Whoever wears the crown is understood to speak for the heavenly horse. Centralisation (Secretariat, Tang alliance) is always a fight with the old halls.',
		arc: 'Founded, the legend says, when a white horse left an egg under a blue sky before the chiefs of six clans — a kingdom that would keep the moon on its banners and love as its quiet engine. Silla is the furthest from the West, the last to take Buddhism, the most rigid in caste — and the one that learns diplomacy because it cannot win alone. Under Queen Seondeok it survives; under Muyeol and Munmu it allies with the Tang to destroy Baekje and Goryeo, then turns and expels the Tang itself. It rules the unified peninsula for two and a half more centuries.',
		events: [
			{ year: -57, label: 'Founded at Seorabeol by Hyukgosé, the legend says.' },
			{ year: 532, label: 'Absorbs Golden Gaya.' },
			{ year: 660, label: 'Destroys Baekje with the Tang.' },
			{ year: 668, label: 'Destroys Goguryeo.' },
			{ year: 676, label: 'Expels the Tang; unifies the peninsula below the Taedong.' },
			{ year: 935, label: 'Ends, absorbed into Goryeo.' }
		],
		sobriquets: ['the Divine Country', 'Land of the Rooster Forest'],
		aliases: [
			'Silla',
			'the Divine Country',
			'Divine Country',
			'Land of the Rooster Forest',
			'Rooster Forest'
		]
	},
	{
		id: 'nation-baekje',
		name: 'Baekje',
		korean: '백제',
		hanja: '百濟',
		entity: 'nation',
		kingdom: 'baekje',
		born: -18,
		died: 660,
		title: 'Land of the Heavenly Deer',
		photo: '/nations/baekje.jpg',
		photoCredit: 'Gilt-bronze Incense Burner of Baekje, National Treasure no. 287 (Wikimedia Commons)',
		tagline: 'Land of the Heavenly Deer — most refined of the three, teacher of the East.',
		ideology: 'Maritime aristocratic cosmopolitanism',
		ideologyNote: 'Sea-lane polish, clan vetoes, and a court that taught the islands manners.',
		nature: 'Eight Great Clans and a Ministers’ Assembly that can move on a plurality — faster than Silla, bloodier in the street. Royal Buyeo sits above a permanent Satek–Yunbi knife-fight; kings who purge the chairs inherit the emptiness. Of the three, Baekje sits closest to the eastern islands in manners: polished courts, sea-lane taste, a habit of teaching neighbours how a capital should look. The crown binds the heavenly deer — lose the crown, and the deer’s door closes.',
		arc: 'Founded by Onjo, a son of Jumong who came south when the throne of Goryeo went to another brother — settling where a heavenly deer showed the door between earth and the yellow sky, under stars the court would later read for loyalty. Baekje is the kingdom of the sea lanes: it gives the East writing, Buddhism and temple architects, and fights Silla for three centuries over the Han valley. Its court is owned by eight great clans, and its last king breaks the clans only to find he has broken the kingdom. It falls in 660; the Baekje Restoration Army (BRA) dies at the White River in 663.',
		events: [
			{ year: -18, label: 'Founded at Wiryeseong by Onjo.' },
			{ year: 371, label: 'Geunchogo kills the king of Goguryeo at Pyongyang.' },
			{ year: 538, label: 'Capital moves to Sabi.' },
			{ year: 660, label: 'Sabi falls to the Silla–Tang alliance.' },
			{ year: 663, label: 'The BRA fails at the White River.' }
		],
		sobriquets: ['Land of the Heavenly Deer', 'Land of the Lord Buddha'],
		aliases: [
			'Baekje',
			'Land of the Heavenly Deer',
			'Land of the Lord Buddha',
			'Heavenly Deer'
		]
	},
	{
		id: 'nation-goguryeo',
		name: 'Goguryeo',
		korean: '고구려',
		hanja: '高句麗',
		entity: 'nation',
		kingdom: 'goguryeo',
		born: -37,
		died: 668,
		title: 'Kingdom of Jumong',
		photo: '/nations/goguryeo.jpg',
		photoCredit: 'The Gwanggaeto Stele at Ji’an — erected 414 (Wikimedia Commons)',
		tagline: 'People of Jumong — the Five Tribes that broke the Sui and stalled the Tang.',
		ideology: 'Martial ethnostate',
		ideologyNote: 'Frontier power politics; 겨레 spoken as if it were a constitution.',
		nature: 'High Summit of regional commands; kings who pay tribute for another decade of quiet. After 642, a Supreme Commander and a Grand Herald speak for the 겨레 over a nephew-king — force in place of committee. The common tongue of the age is Goryeo; Yeon alone says Goguryeo, as if the longer name were a wall. Cold marches, sealed capital, will recited until it becomes weather — and the crown that binds the three-legged crow. Yeon hall versus Go hall is the private war under the public one.',
		arc: 'Founded by Jumong the archer under the three-legged crow of the sun — a red kingdom of will that would rather break than bend. Grown under Gwanggaeto into the great power of Northeast Asia, Goryeo spends its final century as the wall between the peninsula and two western empires: it destroys the Sui invasions, turns back Taizong at Ansi, and breaks army after army. What no emperor could do, succession did: after Yeon Gesomun dies his sons turn on each other, and in 668 his eldest guides the Tang army to Pyongyang. A shard of the crown walks north into the millet — and the sentence does not stop.',
		events: [
			{ year: -37, label: 'Founded at Jolbon by Jumong.' },
			{ year: 413, label: 'Gwanggaeto dies; his stele lists his conquests.' },
			{ year: 612, label: 'Destroys the Sui at the Salsu.' },
			{ year: 645, label: 'Turns back Taizong at Ansi.' },
			{ year: 668, label: 'Pyongyang falls to the Silla–Tang alliance.' },
			{ year: 698, label: 'Balhae rises — the sentence kept.' }
		],
		sobriquets: ['Kingdom of Jumong', 'People of Jumong', 'the Five Tribes'],
		aliases: [
			'Goguryeo',
			'Goryeo',
			'고려',
			'Kingdom of Jumong',
			'People of Jumong',
			'the Five Tribes',
			'Five Tribes'
		]
	},
	{
		id: 'nation-tang',
		name: 'Tang',
		korean: '당',
		hanja: '唐',
		entity: 'nation',
		kingdom: 'tang',
		born: 618,
		died: 907,
		title: 'The empire of the west',
		photo: '/nations/tang.jpg',
		photoCredit: 'Giant Wild Goose Pagoda, Chang’an — built 652 for Xuanzang’s scriptures (Wikimedia Commons)',
		tagline: 'The superpower next door — cosmopolitan, insatiable, and very patient.',
		ideology: 'Imperial civilizational universalism',
		ideologyNote: 'The West as self-appointed classroom for every smaller calendar.',
		nature: 'An empire that renames ministries around a taboo personal name and ships titled beasts instead of introductions. Investiture, hostages, and protectorates are how it turns allies into furniture.',
		arc: 'The dynasty that made Chang’an the largest city on earth. Under Taizong it subdues the steppe and calls its emperor Khan of Heaven; the one campaign it cannot finish is Goguryeo. Under Gaozong it succeeds at last — and then discovers its ally Silla will not hand over the peninsula it came for.',
		events: [
			{ year: 618, label: 'Founded from the wreck of the Sui.' },
			{ year: 630, label: 'Taizong breaks the Eastern Turks.' },
			{ year: 668, label: 'Takes Pyongyang — and claims the peninsula.' },
			{ year: 676, label: 'Pushed back out of Samhan by Silla.' }
		],
		aliases: ['Tang', 'the Tang']
	},
	{
		id: 'nation-joseon',
		name: 'Joseon',
		korean: '조선',
		hanja: '朝鮮',
		entity: 'nation',
		kingdom: 'joseon',
		born: -2333,
		died: -108,
		bornApprox: true,
		title: 'The first name of the mandate',
		tagline: 'Old Joseon — Asadal’s court, and the word later ages keep borrowing.',
		nature: 'Heaven’s mandate made into a capital: sandalwood, garlic, mugwort, and a king who stays when gods leave. The name outlives the walls — Goryeo and later crowns still answer to it in dream and stele.',
		arc: 'Founded in the mythic age by Dangun, grandson of Heaven. Old Joseon holds the northern plains until betrayal opens Wanggeom to the Han; the Four Commanderies follow. Centuries later Wang Geon raises Goryeo under Goguryeo’s shadow — and the chronicle still hears Joseon in the name of what endures.',
		events: [
			{ year: -2333, label: 'Dangun founds Asadal — so the legend dates it.' },
			{ year: -108, label: 'Wanggeom falls; Old Joseon ends.' },
			{ year: 918, label: 'Wang Geon founds Goryeo — the name’s long echo.' }
		],
		aliases: ['Joseon', 'Old Joseon', 'Gojoseon', '조선']
	},
	{
		id: 'nation-gaya',
		name: 'Gaya',
		korean: '가야',
		hanja: '加耶',
		entity: 'nation',
		kingdom: 'gaya',
		born: 42,
		died: 562,
		bornApprox: true,
		title: 'The iron confederacy',
		tagline: 'Not one crown — a league of iron harbours and hill courts, until Silla took the map.',
		ideology: 'Confederate iron polity',
		ideologyNote: 'League of courts — iron and ships first, unanimity never. Six is the song; more is the ground.',
		nature:
			'Gaya is a confederacy, not a single throne. The egg-song names six — Golden, Great, Lesser, Holy, Bright, Iron — but the older world grew from Byeonhan’s many small states along the Nakdong, and the mounds remember more polities than any tidy tablet. Early centuries answer from Garak / Golden Gaya at Gimhae; after the northern war around 400, the inland court at Great Gaya / Gara (Goryeong) gathers the late league. Iron, stoneware, and ships to Wa and Baekje are the shared grammar. “○○가야” is often a later label; contemporary mouths said Garak, Kara, Anra, Goja, Banpa. Six eggs are the chronicle’s mnemonic. The ground is a denser map.',
		arc: 'Tradition: in 42 six eggs hatch after Ibiga and the Lady of the Right View; Suro takes the shore, Ijinasi the larger hill; Queen Heo sails into Golden Gaya in 48. History’s harder outline: Byeonhan chiefdoms harden into Gaya city-states; Geumgwan leads the early iron age; Daegaya leads the late one; Ara / Anra talks when force fails. Geumgwan yields in 532 so its blood may keep a sword — Kim Yushin is that bargain’s grandson. Ara and the southern shore fold in the 550s; Great Gaya falls in 562 to Jinheung and Sadaham. The purple flag remains; the six places remain on the map; the seventh and tenth names haunt the footnotes.',
		events: [
			{ year: 42, label: 'Legend: six eggs; the confederacy’s founding song.' },
			{ year: 48, label: 'Legend: Queen Heo arrives at Golden Gaya / Garak.' },
			{ year: 300, label: 'From Byeonhan into early Gaya — Geumgwan as coastal centre.' },
			{ year: 400, label: 'Goguryeo’s southern war; the early centre wanes.' },
			{ year: 500, label: 'Late Gaya: Great Gaya / Gara gathers the inland league.' },
			{ year: 532, label: 'Golden Gaya / Geumgwan surrenders to Silla.' },
			{ year: 559, label: 'Ara / Anra and the southern courts fold under Silla.' },
			{ year: 562, label: 'Great Gaya falls; the confederacy ends.' }
		],
		sobriquets: ['the Iron Confederacy', 'Six Eggs', 'Kara', 'Imna'],
		aliases: [
			'Gaya',
			'가야',
			'加耶',
			'伽倻',
			'Kaya',
			'the Gaya confederacy',
			'Gaya confederacy',
			'the Iron Confederacy'
		]
	},
	{
		id: 'nation-yamato',
		name: 'Yamato',
		korean: '야마토',
		hanja: '大和',
		entity: 'nation',
		kingdom: 'yamato',
		title: 'The eastern court across the strait',
		tagline: 'Rising sun, cherry weather, and sea lanes that learn from the west.',
		nature: 'An island court that watches Samhan the way Samhan watches Tang — close enough to copy, far enough to choose. Hosts princes, sends swords, and measures loyalty in ships.',
		arc: 'Wa / Yamato sits east of Baekje’s teaching and Silla’s ambition. Emperors and princes in this chronicle watch continental fires and decide how much of the blaze to invite home.',
		aliases: ['Yamato', 'Wa', 'the East', '야마토']
	},
	{
		id: 'nation-tamla',
		name: 'Tamla',
		korean: '탐라',
		hanja: '耽羅',
		entity: 'nation',
		kingdom: 'tamla',
		title: 'The orange island',
		tagline: 'Island of three princes, five grains, and the myths that name the Three Realms.',
		nature:
			'An island polity off the southern sea — oranges, divers, and shrine roads that remember Sulmun before they remember any continental king. Three divine princes rise from Samseonghyeol; the living world and the dead are told here as courts, not metaphors — under Hwanin’s heaven.',
		arc: 'Tamla sits outside the three kingdoms’ calendar until the war washes men onto its shore. Then the island tells first things last: Heaven–Earth King’s retirement under the Creator, Big Star and Little Star, Hallakgungi’s western flowers, Kangrim’s ledger — so a Baekje general stranded among 해녀 will stop waiting for the world to behave.',
		events: [
			{ label: 'Legend: three princes emerge from Samseonghyeol and divide the island.' },
			{ label: 'Sulmun piles the sea into Halla; the apron-holes become hills.' },
			{ label: 'Jacheongbi brings the five grains down from the Western Flower Field.' },
			{ label: 'Gyebek hears 삼계 named on the island after the mainland has already burned.' }
		],
		sobriquets: ['the orange island', 'Island of the Three Princes'],
		aliases: ['Tamla', '탐라', '耽羅', 'Tamna', 'the orange island', 'Jeju']
	}
];

/**
 * Character accent symbolism (characters only — foreign Tang/Yamato keep kingdom
 * neutrals; Goguryeo stays in the red family). Applied onto Person.color via
 * `withProfileMeta`. Dual tones use colorSecondary (Heaven–Earth King).
 *
 * | id | meaning |
 * | hwanin | white — Creator / Heaven above the Three Realms |
 * | heavenearthking | red + blue (primary red, secondary blue) |
 * | daebyeol | blue — Big Star / 저승 order |
 * | sobyeol | red — Little Star / living heat |
 * | sara | light green — Hallakgungi / flower field |
 * | chunchu | magenta — Magenta Devil sleeve |
 * | yushin | darker hwarang blue (mature marshal) |
 * | bidam | near-black blue — nativist foil |
 * | muryuk | Gaya purple |
 * | seohyeon | bright Silla-aspiring blue |
 * | munmu | royal red — king for all |
 * | pumsuk | light hwarang blue (younger vs Yushin) |
 * | gotaso | light pink |
 * | munhee | pink (mother vs Gotaso) |
 * | gumilwife | desaturated mint (opposite Gotaso) |
 */
const CHARACTER_COLORS: Record<string, { color: string; colorSecondary?: string }> = {
	hwanin: { color: '#F4F1E8' },
	heavenearthking: { color: '#C30000', colorSecondary: '#3E79E4' },
	daebyeol: { color: '#3B6FBF' },
	sobyeol: { color: '#C94040' },
	sara: { color: '#8FBF8A' },
	heaven: { color: '#d4b86a' },
	living_world: { color: '#C94040' },
	western_flower_field: { color: '#8FBF8A' },
	chunchu: { color: '#D8258C' },
	yushin: { color: '#2A5FB8' },
	bidam: { color: '#141C2E' },
	muryuk: { color: '#8B5CF6' },
	seohyeon: { color: '#3E8EF0' },
	munmu: { color: '#C41E3A' },
	pumsuk: { color: '#7EB8F0' },
	gotaso: { color: '#F0A3C0' },
	munhee: { color: '#E07FA8' },
	gumilwife: { color: '#8AAFA0' }
};

/** Organization membership for major characters (merged onto Person.orgs). */
const ORGS_BY_ID: Record<string, string[]> = {
	// Silla — Hwarang / Council / Secretariat / Founding / Royal house
	chunchu: ['hwarang', 'harmonycouncil', 'royalsecretariat', 'bonerank', 'sillaroyal'],
	yushin: ['hwarang', 'harmonycouncil'],
	bidam: ['hwarang', 'harmonycouncil'],
	munmu: ['hwarang', 'royalsecretariat', 'bonerank', 'sillaroyal'],
	pumsuk: ['hwarang', 'bonerank'],
	jukji: ['hwarang', 'royalsecretariat'],
	alchun: ['hwarang', 'harmonycouncil'],
	supum: ['harmonycouncil'],
	murim: ['harmonycouncil'],
	imjong: ['harmonycouncil'],
	suljong: ['harmonycouncil'],
	yumjang: ['harmonycouncil'],
	pumil: ['harmonycouncil'],
	yumjong: ['harmonycouncil'],
	euljae: ['harmonycouncil'],
	sunduk: ['bonerank', 'sillaroyal'],
	jinduk: ['bonerank', 'sillaroyal'],
	munhee: ['bonerank', 'sillaroyal'],
	gotaso: ['bonerank', 'sillaroyal'],
	seohyeon: ['bonerank'],
	hyukgose: ['foundingsix', 'sillaroyal'],
	alyoung: ['sillaroyal'],
	alpyung: ['foundingsix'],
	sobuldori: ['foundingsix'],
	jibekho: ['foundingsix'],
	gurema: ['foundingsix'],
	jita: ['foundingsix'],
	hojin: ['foundingsix'],
	jinpyung: ['sillaroyal'],
	jinheung: ['sillaroyal'],
	chunmyung: ['sillaroyal'],
	inmun: ['sillaroyal'],
	gwanchang: ['hwarang'],
	bangul: ['hwarang'],
	sadaham: ['hwarang'],
	mugwan: ['hwarang'],
	// Baekje — assembly / eight-clan league / restoration
	euija: ['ministersassembly', 'eightclans'],
	eldersatek: ['eightclans', 'ministersassembly'],
	elderyunbi: ['eightclans', 'ministersassembly'],
	ministersatek: ['eightclans', 'ministersassembly'],
	queensatek: ['eightclans'],
	yung: ['eightclans'],
	tae: ['eightclans'],
	hyo: ['eightclans'],
	yun: ['eightclans'],
	pung: ['eightclans', 'restorationarmy'],
	boksin: ['restorationarmy'],
	dochim: ['restorationarmy'],
	sangji: ['restorationarmy'],
	sateksangya: ['restorationarmy'],
	ladysatek: ['eightclans', 'ministersassembly'],
	ministeryunbi: ['eightclans', 'ministersassembly'],
	// Goguryeo — High Summit (Yeon is a clan, not an org)
	gesomun: ['highsummit'],
	namseng: ['highsummit'],
	namgun: ['highsummit'],
	namsan: ['highsummit'],
	yeongnyu: ['highsummit'],
	bojang: ['highsummit'],
	yangmanchun: ['highsummit'],
	dosuryu: ['highsummit'],
	northcmd: ['highsummit'],
	southcmd: ['highsummit'],
	westcmd: ['highsummit'],
	// Tang court + eastern expedition (dragon/beast rosters moved to GROUPS_BY_ID)
	taizong: ['tangcourt'],
	gaozong: ['tangcourt', 'tangexpedition'],
	wuzetian: ['tangcourt'],
	xuerengui: ['tangcourt', 'tangexpedition'],
	weizheng: ['tangcourt'],
	sudingfang: ['tangcourt', 'tangexpedition'],
	lishiji: ['tangcourt', 'tangexpedition'],
	liurengui: ['tangcourt', 'tangexpedition'],
	// Three Realms cosmology (replaces Heaven’s Court org)
	hwanin: ['four_divisions'],
	hwanung: ['four_divisions'],
	sobyeol: ['four_divisions'],
	daebyeol: ['four_divisions'],
	sara: ['four_divisions'],
	ibiga: ['four_divisions'],
	haemosu: ['four_divisions'],
	yuhwa: ['four_divisions'],
	samsin: ['four_divisions'],
	yumla: ['four_divisions'],
	kangrim: ['four_divisions'],
	haewonmek: ['four_divisions'],
	/* Heaven–Earth King retired from mortal charge; not seated under Hwanin’s court. */
};

/** Group membership (named ensembles) — merged onto Person.groups. */
const GROUPS_BY_ID: Record<string, string[]> = {
	// Silla
	narim: ['caverngoddesses'],
	golhwa: ['caverngoddesses'],
	hyulle: ['caverngoddesses'],
	yushin: ['eternalhwarang', 'gayakims'],
	alchun: ['eternalhwarang'],
	bidam: ['eternalhwarang'],
	muryuk: ['gayakims'],
	seohyeon: ['gayakims'],
	sunduk: ['sacredbones'],
	jinduk: ['sacredbones'],
	chunmyung: ['sacredbones'],
	// Divine rosters
	sara: ['realmgods'],
	daebyeol: ['realmgods'],
	sobyeol: ['realmgods'],
	heaven: ['fourrealms'],
	living_world: ['fourrealms'],
	underworld: ['fourrealms'],
	western_flower_field: ['fourrealms'],
	haemosu: ['lifegods'],
	ibiga: ['lifegods'],
	samsin: ['lifegods'],
	kangrim: ['grimreapers'],
	haewonmek: ['grimreapers'],
	// Baekje — Euija’s five princes (birth order; wiki grid uses GROUP_ROSTERS)
	yung: ['fiveprinces'],
	tae: ['fiveprinces'],
	hyo: ['fiveprinces'],
	yun: ['fiveprinces'],
	pung: ['fiveprinces', 'brafounders'],
	boksin: ['brafounders'],
	dochim: ['brafounders'],
	sangji: ['brafounders'],
	sateksangya: ['brafounders'],
	// Goguryeo — the five 대가 of the Five Commanderies
	gesomun: ['fivecommanders'],
	gusesa: ['fivecommanders'],
	northcmd: ['fivecommanders'],
	southcmd: ['fivecommanders'],
	westcmd: ['fivecommanders'],
	// Founders and founding mothers
	hyukgose: ['threefounders'],
	alyoung: ['greatwomen'],
	alpyung: ['founders'],
	sobuldori: ['founders'],
	jibekho: ['founders'],
	gurema: ['founders'],
	jita: ['founders'],
	hojin: ['founders'],
	jumong: ['threefounders'],
	onjo: ['threefounders'],
	sosuno: ['greatwomen'],
	heohwangok: ['greatwomen'],
	// Tang dragon / beast rosters (moved from ORGS_BY_ID with the entity change)
	taizong: ['fourdragons'],
	gaozong: ['fourbeasts'],
	xuerengui: ['fourdragons'],
	sudingfang: ['fourdragons', 'fourbeasts'],
	lishiji: ['fourdragons', 'fourbeasts'],
	liurengui: ['fourdragons', 'fourbeasts'],
	pangxiaotai: ['fourbeasts']
};

/**
 * Canonical member order for named ensembles (wiki Members grid + card montage).
 * Membership still comes from GROUPS_BY_ID; omitted groups keep importance sort.
 */
export const GROUP_ROSTERS: Record<string, readonly string[]> = {
	// Birth order: demoted eldest → self-crowned 2nd → chosen 3rd → quiet 4th → youngest
	fiveprinces: ['yung', 'tae', 'hyo', 'yun', 'pung'],
	brafounders: ['boksin', 'dochim', 'sangji', 'sateksangya', 'pung'],
	// Heaven above, then the three courts of 삼계
	fourrealms: ['heaven', 'living_world', 'underworld', 'western_flower_field']
};

/** A distinct hue per profile, used for avatars, chips and the panel accent. */
const COLOR: Record<string, string> = {
	// leads
	chunchu: '#D8258C',
	gesomun: '#d0362f',
	yeonwife: '#c4787a',
	euija: '#e08a2e',
	// silla
	yushin: '#2A5FB8',
	sunduk: '#E8552B',
	jinduk: '#9d7bd0',
	munhee: '#E07FA8',
	munmu: '#C41E3A',
	jayi: '#e8a0bf',
	seonpum: '#7c6bb5',
	daeya_a: '#a16207',
	daeya_b: '#92744a',
	bidam: '#141C2E',
	gotaso: '#F0A3C0',
	pumsuk: '#7EB8F0',
	inmun: '#6fb0d8',
	alchun: '#8fb3e0',
	daedeung_stern: '#6b5b4a',
	daedeung_old: '#7a6a58',
	daedeung_fear: '#5c6b7a',
	jinheung: '#2f6fd4',
	// baekje
	gyebek: '#d9b13a',
	kingmu: '#b8862c',
	seongchung: '#c9a24d',
	yung: '#d4b45a',
	tae: '#cbb06a',
	hyo: '#c9a86a',
	yun: '#b8a86a',
	ungo: '#c9a0a8',
	pung: '#e6c76a',
	boksin: '#a8781f',
	sateksondung: '#a8842f',
	yunbihana: '#6f8f5c',
	sooyoung: '#b8787a',
	// goguryeo
	yeongnyu: '#a83b34',
	bojang: '#8f4a44',
	yangmanchun: '#e05a3c',
	namseng: '#c25a4e',
	namgun: '#9e3b32',
	namsan: '#d4776a',
	munduk: '#e0503f',
	// tang
	taizong: '#c97a2e',
	gaozong: '#b8935a',
	wuzetian: '#e879a6',
	west_ambassador: '#b45309',
	east_ambassador: '#6b8cae',
	// gaya
	muryuk: '#8B5CF6',
	gumil: '#6b7f9e',
	mochuk: '#7d8a99',
	// supporting cast
	jukjuk: '#3f9b6e',
	yunchung: '#c9932a',
	gwanchang: '#79b6f2',
	bangul: '#5e9dd8',
	sadaham: '#6fa8ff',
	mugwan: '#7aa0c8',
	chunbok: '#d4a94e',
	heungsu: '#b98f33',
	dochim: '#a06a28',
	sangji: '#8a6b1f',
	sateksangya: '#b8933f',
	ladysatek: '#d9b45e',
	ministeryunbi: '#7f9b6b',
	gungye: '#4a7c6f',
	galsa: '#6b8f4a',
	buyeojashin: '#9b2d2d',
	weizheng: '#9a7b4f',
	xuerengui: '#e8e3d5',
	xueliu: '#c4a484',
	sudingfang: '#d95f4b',
	lishiji: '#4b78c9',
	liurengui: '#4a4a52',
	pangxiaotai: '#c9c9c9',
	saimei: '#f090b0',
	tenji: '#e06a95',
	kuromaro: '#c77ba0',
	takutsu: '#b05575',
	yesikjin: '#a3813d',
	yumjong: '#8a68c9',
	supum: '#7f9fd0',
	pumil: '#6a8ab8',
	murim: '#8a7a6a',
	imjong: '#7a8a7a',
	suljong: '#8a6a7a',
	yumjang: '#7a7a9a',
	gusesa: '#b2554a',
	northcmd: '#6a8f6e',
	southcmd: '#c46b3a',
	westcmd: '#7a6b8a',
	dosuryu: '#c98578',
	goguard_a: '#b07068',
	goguard_b: '#9a5c55',
	narim: '#3d9e52',
	hyulle: '#2eb8c4',
	golhwa: '#e86820',
	steam_cavern: '#2eb8c4',
	jungto: '#ad6157',
	shinsung: '#8f7b70',
	yuridora: '#ff9a3d',
	jinpyung: '#5a86d6',
	chunmyung: '#d8a0e8',
	sunhwa: '#eeb8d2',
	kingsung: '#e5b83a',
	dodo: '#7f96b5',
	jumong: '#e8563f',
	onjo: '#f0c04a',
	biryu: '#d8b276',
	hyukgose: '#6f9fe8',
	alyoung: '#a8c8f0',
	alpyung: '#7a9e6b',
	sobuldori: '#5a8fc4',
	jibekho: '#8b7aa8',
	gurema: '#4a5568',
	jita: '#c9a86a',
	hojin: '#9aabb8',
	foundingsix: '#6f9fe0',
	sillaroyal: '#5a86d6',
	'clan-surabol-lee': '#7a9e6b',
	'clan-surabol-choi': '#5a8fc4',
	'clan-surabol-jeong': '#8b7aa8',
	'clan-surabol-son': '#4a5568',
	'clan-surabol-bae': '#c9a86a',
	'clan-surabol-seol': '#9aabb8',
	dangun: '#b8956a',
	ugeo: '#918878',
	kyunhwon: '#caa53d',
	wanggun: '#d16a5a',
	gyeonggeunchogo: '#eec052',
	gwanggaeto: '#e0442e',
	dongchun: '#8b4040',
	jomei: '#f2a0bb',
	euljae: '#7f9fd0',
	ladyye: '#d98fa8',
	yuri: '#e07a5f',
	hwarang: '#6f9fe0',
	gyuku: '#8a9e6b',
	gumilwife: '#8AAFA0',
	queensatek: '#d9b45e',
	eldersatek: '#b8933f',
	elderyunbi: '#7f9b6b',
	ministersatek: '#c2a24a',
	sosuno: '#e8a04a',
	yuhwa: '#8fc4e0',
	geumwa: '#a89a72',
	daeso: '#9b8f6a',
	yomyo: '#a3564a',
	bohee: '#c98fc0',
	haenyeo: '#6fa8a0',
	haemosu: '#f0b429',
	habek: '#2f8f7a',
	yeontabal: '#a97c4a',
	jomigon: '#8f9c8f',
	imja: '#b08d5a',
	courtmaid: '#c9a0a8',
	shaman: '#9f1239',
	suro: '#e0a33c',
	ijinasi: '#c084fc',
	heohwangok: '#d98fa8',
	ibiga: '#1e4d9c',
	samsin: '#e8b4c8',
	jeonggyeon: '#c084fc',
	hwanin: '#F4F1E8',
	hwanung: '#d4b86a',
	ungnyeo: '#c9b18f',
	sulmun: '#7f9c8b',
	jacheongbi: '#e879a6',
	mundoryeong: '#7dd3fc',
	gameunjang: '#e0a33c',
	baekjuto: '#c084fc',
	socheonguk: '#a16207',
	heavenearthking: '#C30000',
	fourdragons: '#2563eb',
	fourbeasts: '#b45309',
	'clan-yeon': '#a3232a',
	restorationarmy: '#e6a817',
	tangcourt: '#b45309',
	daebyeol: '#3B6FBF',
	sobyeol: '#C94040',
	yumla: '#7c3aed',
	kangrim: '#4a4a58',
	haewonmek: '#6b5b6e',
	sara: '#8FBF8A',
	creator: '#f5f0e6',
	go_tamla: '#e8a060',
	yang_tamla: '#f0c078',
	bu_tamla: '#d4894a',
	sanbangdeok: '#8fb3a8',
	four_divisions: '#d4b86a',
	fourrealms: '#d4b86a',
	heaven: '#d4b86a',
	living_world: '#C94040',
	western_flower_field: '#8FBF8A',
	seocheon: '#d4a0c8',
	herald: '#8d8d95',
	seohyeon: '#3E8EF0',
	daejoyoung: '#c45a4a',
	jukji: '#6a9e7a',
	ongunhae: '#8a6240',
	'rel-chunchu-ongunhae': '#8a6240',
	haesang: '#c4a35a',
	// relationships
	'rel-gotaso-pumsuk': '#f472b6',
	'rel-chunchu-munhee': '#e07fa8',
	'rel-munmu-jayi': '#e8a0bf',
	'rel-yushin-sunduk': '#4a8fe0',
	'rel-pumsuk-gumilwife': '#c98fb0',
	'rel-euija-maids': '#c9a0a8',
	'rel-haemosu-yuhwa': '#7fc4e8',
	'rel-jumong-sosuno': '#e8563f',
	'rel-suro-heo': '#e0a33c',
	'rel-ibiga-jeonggyeon': '#a78bfa',
	'rel-hwanung-ungnyeo': '#c9b18f',
	'rel-gesomun-gulgul': '#a3232a',
	gulgul: '#8b3a3a',
	'rel-jacheongbi-mundoryeong': '#e879a6',
	'rel-chunchu-euija': '#D8258C',
	'rel-chunchu-yushin': '#5b7fd0',
	'rel-sunduk-chunmyung': '#E8552B',
	'rel-chunchu-gotaso': '#D8258C',
	'rel-munhee-bohee': '#e07fa8',
	'rel-euija-gyebek': '#e08a2e',
	'rel-jumong-yuhwa': '#e8563f',
	'rel-onjo-sosuno': '#e8a04a',
	'rel-gesomun-chunchu': '#a3232a',
	'rel-hwanung-dangun': '#c9b18f',
	'rel-sunduk-bidam': '#9f1239',
	'rel-yushin-bidam': '#7b5cd6',
	'rel-sunduk-jinduk': '#E8552B',
	'rel-yushin-munhee': '#4a8fe0',
	'rel-chunchu-munmu': '#D8258C',
	'rel-gesomun-yeongnyu': '#a3232a',
	'rel-gesomun-bojang': '#d0362f',
	'rel-gesomun-namseng': '#c25a4e',
	'rel-namseng-namgun': '#9e3b32',
	'rel-euija-yung': '#e08a2e',
	'rel-euija-tae': '#e08a2e',
	'rel-euija-hyo': '#e08a2e',
	'rel-euija-yun': '#e08a2e',
	'rel-euija-pung': '#e08a2e',
	'rel-tae-hyo': '#c4ad6a',
	'rel-euija-queensatek': '#d9b45e',
	'rel-yung-hyo': '#c9a86a',
	'rel-tae-yun': '#b8a86a',
	'rel-yung-pung': '#e6c76a',
	'rel-satek-yunbi': '#a8781f',
	'rel-jijeok-hana': '#6f8f5c',
	'rel-jungto-sooyoung': '#b8787a',
	'rel-gesomun-jungto': '#b0524a',
	'rel-gesomun-sooyoung': '#c07a70',
	'rel-euija-ungo': '#c9a0a8',
	'rel-jumong-yuri': '#e8563f',
	'rel-haemosu-habek': '#7fc4e8',
	'rel-haemosu-haewonmek': '#9a7e4a',
	'rel-habek-yuhwa': '#8fc4e0',
	'rel-hwanin-hwanung': '#a89060',
	'rel-suro-ijinasi': '#e0a33c',
	'rel-taizong-gaozong': '#c97a2e',
	'rel-seonpum-jayi': '#e8a0bf',
	'rel-gesomun-yangmanchun': '#e05a3c',
	'rel-yushin-munmu': '#4a8fe0',
	'rel-yumla-kangrim': '#7c3aed',
	'rel-kangrim-haewonmek': '#4a4a58',
	'rel-daebyeol-sobyeol': '#3d2a4a',
	'rel-yumla-daebyeol': '#7c3aed',
	'rel-sara-jacheongbi': '#d4a0c8',
	'rel-tamla-princes': '#e8a060',
	'rel-taizong-xuerengui': '#e8e3d5'
};

/** Era / generation tag slugs used in the wiki. */
export const ERA_TAG_META: Record<string, { label: string; hint: string }> = {
	'gen-i': { label: 'Generation I', hint: 'Sunduk circle — elder present chronicle' },
	'gen-ii': { label: 'Generation II', hint: 'Chunchu / Euija / Yeon — the war generation' },
	'gen-iii': { label: 'Generation III', hint: 'Bupmin / Pung / Yeon’s sons — heirs of the war' },
	joseon: { label: 'Joseon', hint: 'Old Joseon / Dangun myth cycle' },
	founders: { label: 'Founders', hint: 'Egg-and-mandate founders of the kingdoms' },
	legends: { label: 'Legends', hint: 'Famous earlier kings and heroes' }
};

export const ERA_TAG_IDS = Object.keys(ERA_TAG_META);

/**
 * Generation / era tags by profile id. Merged onto PROFILES so wiki can filter
 * without repeating tags on every object literal.
 */
const TAGS_BY_ID: Record<string, string[]> = {
	// —— Generation I ——
	sunduk: ['gen-i'],
	jinduk: ['gen-i'],
	jinpyung: ['gen-i'],
	chunmyung: ['gen-i'],
	kingmu: ['gen-i'],
	gusesa: ['gen-i'],
	yeongnyu: ['gen-i'],
	muryuk: ['gen-i'],
	seohyeon: ['gen-i'],
	euljae: ['gen-i'],
	daedeung_stern: ['gen-i'],
	daedeung_old: ['gen-i'],
	daedeung_fear: ['gen-i'],
	queensatek: ['gen-i'],
	yeonwife: ['gen-i'],
	jomei: ['gen-i'],
	sunhwa: ['gen-i'],
	yeontabal: ['gen-i'],
	// —— Generation II ——
	chunchu: ['gen-ii'],
	ongunhae: ['gen-ii'],
	munhee: ['gen-ii'],
	bohee: ['gen-ii'],
	yushin: ['gen-ii'],
	bidam: ['gen-ii'],
	euija: ['gen-ii'],
	gesomun: ['gen-ii'],
	gotaso: ['gen-ii'],
	pumsuk: ['gen-ii'],
	gyebek: ['gen-ii'],
	taizong: ['gen-ii'],
	yangmanchun: ['gen-ii'],
	bojang: ['gen-ii'],
	alchun: ['gen-ii'],
	gumil: ['gen-ii'],
	gumilwife: ['gen-ii'],
	courtmaid: ['gen-ii'],
	shaman: ['gen-ii'],
	seongchung: ['gen-ii'],
	chunbok: ['gen-ii'],
	yesikjin: ['gen-ii'],
	gaozong: ['gen-ii'],
	xuerengui: ['gen-ii'],
	sudingfang: ['gen-ii'],
	dosuryu: ['gen-ii'],
	northcmd: ['gen-ii'],
	southcmd: ['gen-ii'],
	westcmd: ['gen-ii'],
	gulgul: ['gen-ii'],
	yunchung: ['gen-ii'],
	jukjuk: ['gen-ii'],
	daeya_a: ['gen-ii'],
	daeya_b: ['gen-ii'],
	heungsu: ['gen-ii'],
	dochim: ['gen-ii'],
	sangji: ['gen-ii'],
	sateksangya: ['gen-ii'],
	gungye: ['gen-iii'],
	yumjong: ['gen-ii'],
	supum: ['gen-ii'],
	pumil: ['gen-ii'],
	murim: ['gen-ii'],
	imjong: ['gen-ii'],
	suljong: ['gen-ii'],
	yumjang: ['gen-ii'],
	yomyo: ['gen-ii'],
	imja: ['gen-ii'],
	jungto: ['gen-ii'],
	shinsung: ['gen-ii'],
	yuridora: ['gen-ii'],
	dodo: ['gen-ii'],
	mochuk: ['gen-ii'],
	haesang: ['gen-ii'],
	jukji: ['gen-ii'],
	seonpum: ['gen-ii'],
	saimei: ['gen-ii'],
	tenji: ['gen-ii'],
	kuromaro: ['gen-ii'],
	takutsu: ['gen-ii'],
	weizheng: ['gen-ii'],
	xueliu: ['gen-ii'],
	lishiji: ['gen-ii'],
	liurengui: ['gen-ii'],
	pangxiaotai: ['gen-ii'],
	west_ambassador: ['gen-ii'],
	east_ambassador: ['gen-ii'],
	herald: ['gen-ii'],
	goguard_a: ['gen-ii'],
	goguard_b: ['gen-ii'],
	wuzetian: ['gen-ii'],
	boksin: ['gen-ii'],
	eldersatek: ['gen-ii'],
	ministersatek: ['gen-ii'],
	sateksondung: ['gen-ii'],
	elderyunbi: ['gen-ii'],
	yunbihana: ['gen-ii'],
	ladysatek: ['gen-ii'],
	ministeryunbi: ['gen-ii'],
	ungo: ['gen-ii'],
	sooyoung: ['gen-ii'],
	// —— Generation III ——
	munmu: ['gen-iii'],
	inmun: ['gen-iii'],
	jayi: ['gen-iii'],
	pung: ['gen-iii'],
	yung: ['gen-iii'],
	tae: ['gen-iii'],
	hyo: ['gen-iii'],
	yun: ['gen-iii'],
	namseng: ['gen-iii'],
	namgun: ['gen-iii'],
	namsan: ['gen-iii'],
	gwanchang: ['gen-iii'],
	bangul: ['gen-iii'],
	daejoyoung: ['gen-iii'],
	// —— Joseon cycle (mortal / earthly only — gods keep no era) ——
	ugeo: ['joseon'],
	// —— Founders (characters only; gods/nations/places omitted) ——
	hyukgose: ['founders'],
	alyoung: ['founders'],
	alpyung: ['founders'],
	sobuldori: ['founders'],
	jibekho: ['founders'],
	gurema: ['founders'],
	jita: ['founders'],
	hojin: ['founders'],
	sosuno: ['founders'],
	onjo: ['founders'],
	biryu: ['founders'],
	suro: ['founders'],
	ijinasi: ['founders'],
	heohwangok: ['founders'],
	ladyye: ['founders'],
	geumwa: ['founders'],
	daeso: ['founders'],
	galsa: ['founders'],
	buyeojashin: ['founders'],
	yuri: ['founders'],
	// —— Legends (famous earlier kings / heroes — characters only) ——
	gyeonggeunchogo: ['legends'],
	gwanggaeto: ['legends'],
	dongchun: ['legends'],
	munduk: ['legends'],
	sadaham: ['legends'],
	mugwan: ['legends'],
	kingsung: ['legends'],
	wanggun: ['legends'],
	kyunhwon: ['legends'],
	// —— Choruses without entity (still characters) ——
	haenyeo: ['gen-ii']
};

/**
 * One class per entry year. Class n = year − 559; Class 1 entered in 560
 * (Sadaham / Mugwan). Named `members` pin a person into a famous room
 * (Jukji with Pumsuk at 74, not the 635 / Class 76 his CV year would give).
 */
export const HWARANG_CLASS_EPOCH = 559;
export const HWARANG_FIRST_YEAR = 560;

const SINO_ONES = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'] as const;

function sinoKoreanNumeral(n: number): string {
	if (!Number.isInteger(n) || n < 1 || n > 99) return String(n);
	if (n < 10) return SINO_ONES[n];
	const tens = Math.floor(n / 10);
	const ones = n % 10;
	const tenPart = tens === 1 ? '십' : `${SINO_ONES[tens]}십`;
	return ones === 0 ? tenPart : `${tenPart}${SINO_ONES[ones]}`;
}

export function hwarangClassIndex(entryYear: number): number {
	return entryYear - HWARANG_CLASS_EPOCH;
}

export function hwarangClassLabel(index: number): string {
	return index === 1 ? 'First Class' : `Class ${index}`;
}

export function hwarangClassKorean(index: number): string {
	return index === 1 ? '제일기' : `${sinoKoreanNumeral(index)}기`;
}

/**
 * Chip colours by class index. First Class is a distinguished gold;
 * later named rooms keep their old jewel tones. Unlisted indices fall
 * back to `HWARANG_CLASS_FALLBACK` (never gold) — occupied years only.
 */
export const HWARANG_CLASS_COLORS: Record<number, string> = {
	1: '#e4c57a', // First Class / 제일기 — pale gold
	51: '#c9a05c', // Class 51 — amber bronze (Bidam, Yushin, Alchun)
	59: '#7e9a72', // Class 59 — celadon (Chunchu)
	74: '#6d8aa8', // Class 74 — muted lapis (Pumsuk, Jukji)
	84: '#5e9a8c', // Class 84 — malachite (Bupmin / Munmu)
	99: '#b56e5a' // Class 99 — garnet (Gwanchang, Bangul)
};

const HWARANG_CLASS_FALLBACK = [
	'#8a7355', // bronze
	'#6d7a6a', // moss
	'#7a6d82', // dusk purple
	'#8a6a5e', // terracotta
	'#5e7a7a', // slate teal
	'#8a7a5a' // khaki ochre
] as const;

export function hwarangClassColorByIndex(index: number): string {
	const pinned = HWARANG_CLASS_COLORS[index];
	if (pinned) return pinned;
	if (!Number.isFinite(index) || index < 1) return HWARANG_CLASS_FALLBACK[0];
	return HWARANG_CLASS_FALLBACK[(index - 2) % HWARANG_CLASS_FALLBACK.length];
}

export interface HwarangClass {
	id: string;
	label: string;
	korean?: string;
	color: string;
	/** Entry year. Class number = year − 559. */
	year: number;
	initiated?: number;
	members: string[];
}

function namedHwarangClass(c: Omit<HwarangClass, 'label' | 'korean' | 'color'>): HwarangClass {
	const index = hwarangClassIndex(c.year);
	return {
		...c,
		initiated: c.initiated ?? c.year,
		label: hwarangClassLabel(index),
		korean: hwarangClassKorean(index),
		color: hwarangClassColorByIndex(index)
	};
}

/** Occupied named rooms only — do not enumerate empty yearly classes. */
export const HWARANG_CLASSES: HwarangClass[] = [
	namedHwarangClass({
		id: 'first',
		year: 560,
		members: ['sadaham', 'mugwan']
	}),
	namedHwarangClass({
		id: 'yushin',
		year: 610,
		members: ['bidam', 'yushin', 'alchun']
	}),
	namedHwarangClass({
		id: 'chunchu',
		year: 618,
		members: ['chunchu']
	}),
	namedHwarangClass({
		id: 'pumsuk',
		year: 633,
		members: ['pumsuk', 'jukji']
	}),
	namedHwarangClass({
		id: 'bupmin',
		year: 643,
		members: ['munmu']
	}),
	namedHwarangClass({
		id: 'gwanchang',
		year: 658,
		members: ['gwanchang', 'bangul']
	})
];

const NON_HWARANG_ENTITIES = new Set<NonNullable<Person['entity']>>([
	'god',
	'concept',
	'organization',
	'group',
	'clan',
	'phrase',
	'nation',
	'relationship',
	'place'
]);

function isHwarangMember(p: Person): boolean {
	if (p.entity && NON_HWARANG_ENTITIES.has(p.entity)) return false;
	return p.orgs?.includes('hwarang') === true || p.career?.some((c) => c.org === 'hwarang') === true;
}

function classFromYear(year: number): { id: string; label: string; korean: string; color: string } {
	const index = hwarangClassIndex(year);
	return {
		id: String(year),
		label: hwarangClassLabel(index),
		korean: hwarangClassKorean(index),
		color: hwarangClassColorByIndex(index)
	};
}

function hwarangEntryYear(p: Person): number | undefined {
	return p.career?.find((c) => c.org === 'hwarang' && c.from != null)?.from;
}

export type HwarangClassRef = {
	id: string;
	label: string;
	korean?: string;
	initiated?: number;
	color: string;
};

function colorOfKlass(klass: { id: string; color?: string }): string {
	if (klass.color) return klass.color;
	const named = HWARANG_CLASSES.find((c) => c.id === klass.id);
	if (named?.color) return named.color;
	const year = named?.year ?? parseInt(klass.id, 10);
	if (Number.isFinite(year)) return hwarangClassColorByIndex(hwarangClassIndex(year));
	return HWARANG_CLASS_COLORS[1];
}

/** Named class first, then a yearly room from the Hwarang career start (occupied years only). */
export function hwarangClassOf(p: Person): HwarangClassRef | undefined {
	if (p.hwarangClass) {
		return p.hwarangClass.color
			? (p.hwarangClass as HwarangClassRef)
			: { ...p.hwarangClass, color: colorOfKlass(p.hwarangClass) };
	}
	if (!isHwarangMember(p)) return undefined;
	const named = HWARANG_CLASSES.find((c) => c.members.includes(p.id));
	if (named) {
		return {
			id: named.id,
			label: named.label,
			korean: named.korean,
			initiated: named.initiated,
			color: named.color
		};
	}
	const year = hwarangEntryYear(p);
	if (year == null) return undefined;
	return classFromYear(year);
}

/** Chip colour for a Hwarang member’s class — stable across wiki cards and PersonLayer. */
export function hwarangClassColor(p: Person): string | undefined {
	const klass = p.hwarangClass ?? hwarangClassOf(p);
	return klass ? colorOfKlass(klass) : undefined;
}

export type HwarangClassGroup = {
	id: string;
	label: string;
	korean?: string;
	initiated?: number;
	color?: string;
	members: Person[];
};

function classSortKey(id: string): number {
	const named = HWARANG_CLASSES.find((c) => c.id === id);
	if (named) return named.year;
	const year = parseInt(id, 10);
	return Number.isFinite(year) ? year : Number.POSITIVE_INFINITY;
}

/** Wiki roster: oldest class first; within a class, oldest member first (seniority). */
export function groupByHwarangClass(members: Person[]): HwarangClassGroup[] {
	const buckets = new Map<string, HwarangClassGroup>();
	for (const m of members) {
		const klass = m.hwarangClass ?? hwarangClassOf(m);
		const id = klass?.id ?? '_none';
		const named = HWARANG_CLASSES.find((c) => c.id === id);
		let group = buckets.get(id);
		if (!group) {
			group = {
				id,
				label: named?.label ?? klass?.label ?? 'Ungraded',
				korean: named?.korean ?? klass?.korean,
				initiated: klass?.initiated ?? named?.initiated,
				color: named?.color ?? (klass ? colorOfKlass(klass) : undefined),
				members: []
			};
			buckets.set(id, group);
		}
		group.members.push(m);
	}

	const groups = [...buckets.values()].sort((a, b) => {
		if (a.id === '_none') return 1;
		if (b.id === '_none') return -1;
		return classSortKey(a.id) - classSortKey(b.id);
	});
	for (const g of groups) {
		const named = HWARANG_CLASSES.find((c) => c.id === g.id);
		g.members.sort((a, b) => {
			if (named) {
				const ia = named.members.indexOf(a.id);
				const ib = named.members.indexOf(b.id);
				if (ia !== -1 && ib !== -1 && ia !== ib) return ia - ib;
				if (ia !== -1 && ib === -1) return -1;
				if (ia === -1 && ib !== -1) return 1;
			}
			const bornA = a.born ?? Number.POSITIVE_INFINITY;
			const bornB = b.born ?? Number.POSITIVE_INFINITY;
			if (bornA !== bornB) return bornA - bornB;
			return nameOf(a).localeCompare(nameOf(b));
		});
	}
	return groups;
}

/** Flat wiki roster: class order (First Class first), then seniority within a class. */
export function sortHwarangMembers(members: Person[]): Person[] {
	return groupByHwarangClass(members).flatMap((g) => g.members);
}

function withProfileMeta(p: Person): Person {
	const extraTags = TAGS_BY_ID[p.id];
	const extraOrgs = ORGS_BY_ID[p.id];
	const extraGroups = GROUPS_BY_ID[p.id];
	const accents = CHARACTER_COLORS[p.id];
	const persona = PERSONA_META[p.id];
	let next = p;
	if (extraTags?.length) {
		next = { ...next, tags: [...new Set([...(next.tags ?? []), ...extraTags])] };
	}
	if (extraOrgs?.length) {
		next = { ...next, orgs: [...new Set([...(next.orgs ?? []), ...extraOrgs])] };
	}
	if (extraGroups?.length) {
		next = { ...next, groups: [...new Set([...(next.groups ?? []), ...extraGroups])] };
	}
	const klass = hwarangClassOf(next);
	if (klass) next = { ...next, hwarangClass: klass };
	if (accents) {
		next = {
			...next,
			color: next.color ?? accents.color,
			...(accents.colorSecondary
				? { colorSecondary: next.colorSecondary ?? accents.colorSecondary }
				: {})
		};
	}
	if (persona) {
		const prompt = (next.llmPrompt ?? next.prompt ?? persona.prompt).trim();
		next = {
			...next,
			personality: next.personality?.length ? next.personality : persona.personality,
			prompt,
			llmPrompt: next.llmPrompt ?? prompt
		};
	} else if (next.llmPrompt?.trim() && !next.prompt?.trim()) {
		next = { ...next, prompt: next.llmPrompt.trim() };
	} else if (next.prompt?.trim() && !next.llmPrompt?.trim()) {
		next = { ...next, llmPrompt: next.prompt.trim() };
	}
	return next;
}

export const PROFILES: Person[] = [
	...PEOPLE,
	...PHRASES,
	...CONCEPTS,
	...GROUPS,
	...CLANS,
	...NATIONS,
	...RELATIONSHIPS,
	...PLACE_PROFILES,
	...SWORDS
].map(withProfileMeta);

/** The identifying colour for a profile (Person.color → COLOR table → kingdom). */
export function colorOf(p: Person): string {
	return p.color ?? COLOR[p.id] ?? KINGDOMS[p.kingdom].color;
}

/** Primary + optional secondary accent (dual-chip figures). */
export function accentColorsOf(p: Person): string[] {
	/** Relationship profiles show both partners’ kingdom/character colours. */
	if (p.entity === 'relationship' && p.between?.length) {
		const seen = new Set<string>();
		const out: string[] = [];
		for (const id of p.between) {
			const other = byId.get(id);
			const hex = other ? colorOf(other) : colorOf(p);
			if (seen.has(hex)) continue;
			seen.add(hex);
			out.push(hex);
		}
		if (out.length) return out;
	}
	const primary = colorOf(p);
	if (p.colorSecondary && p.colorSecondary !== primary) {
		return [primary, p.colorSecondary];
	}
	return [primary];
}

/** Native spoken language for subtitle dialogue (Tang → Chinese, Yamato → Japanese). */
export type SpeechLang = 'zh' | 'ja';

export function speechLangOf(p: Person | undefined | null): SpeechLang | null {
	if (!p) return null;
	if (p.kingdom === 'tang') return 'zh';
	if (p.kingdom === 'yamato') return 'ja';
	return null;
}

/** First Hangul syllable for empty avatar previews (falls back to a mid-dot). */
export function hangulInitial(p: Person): string {
	const k = p.korean?.trim();
	if (k) return [...k][0] ?? '·';
	return '·';
}

/** Unpainted cast: a silhouette in the right shape rather than a bare initial. */
const PLACEHOLDER: Record<'m' | 'f', string> = {
	m: '/ch_placeholder_m.png',
	f: '/ch_placeholder_f.png'
};

/** Three faces for Euija’s household — successive lines rotate by seed. */
const COURT_MAIDS = [
	'/ch_maid_1.png',
	'/ch_maid_2.png',
	'/ch_maid_3.png'
] as const;

/** The relationship chart already carries a gender for everyone it plots. */
const CHART_GENDER = new Map(CHART_NODES.map((n) => [n.id, n.gender]));

/**
 * Which silhouette this profile would stand in, or null when the record is not
 * a body at all — a kingdom, a bond, a place, or an institution like the Bone
 * Rank System. Those keep the initial tile, because a person-shaped shadow
 * would read as a claim the story never makes.
 */
export function genderOf(p: Person): 'm' | 'f' | null {
	if (p.gender) return p.gender;
	const charted = CHART_GENDER.get(p.id);
	if (charted) return charted;
	/* Gods and mortals get silhouettes; institutions / places / nations do not. */
	if (p.entity && p.entity !== 'god') return null;
	return 'm';
}

function hashPick(seed: string, n: number): number {
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
	return Math.abs(h) % n;
}

/**
 * Active life-stage for a year, or null when the base fields should be used
 * (no stages, or no year context — charts / late profiles).
 */
export function stageOf(p: Person, year: number | null | undefined): PersonStage | null {
	if (year == null || !p.stages?.length) return null;
	let hit: PersonStage | null = null;
	for (const s of p.stages) {
		if (s.from != null && year < s.from) continue;
		if (s.until != null && year >= s.until) continue;
		hit = s;
	}
	return hit;
}

/** Explicit stage by `id` — used when a block pins a look regardless of year. */
export function stageById(p: Person, look: string | null | undefined): PersonStage | null {
	if (!look || !p.stages?.length) return null;
	return p.stages.find((s) => s.id === look) ?? null;
}

/**
 * Resolve portrait / name stage: explicit `look` wins, then year bounds,
 * then null (base Person fields).
 */
export function resolveStage(
	p: Person,
	year?: number | null,
	look?: string | null
): PersonStage | null {
	return stageById(p, look) ?? stageOf(p, year);
}

/** Display name at a story year (prince vs king, childhood name vs reign title). */
export function nameOf(p: Person, year?: number | null, look?: string | null): string {
	return resolveStage(p, year, look)?.name ?? p.name;
}

export function titleOf(p: Person, year?: number | null, look?: string | null): string | undefined {
	return resolveStage(p, year, look)?.title ?? p.title;
}

export function koreanOf(p: Person, year?: number | null, look?: string | null): string | undefined {
	return resolveStage(p, year, look)?.korean ?? p.korean;
}

/**
 * The picture to show for a profile: its own portrait if it has been drawn,
 * otherwise the gendered placeholder. Null means fall back to `hangulInitial`.
 * Pass `seed` (e.g. the spoken line) so the court maids cycle faces instead of
 * always showing the same woman. Pass `year` to pick a stage portrait.
 */
export function avatarOf(
	p: Person,
	seed?: string,
	year?: number | null,
	look?: string | null
): string | null {
	if (p.id === 'courtmaid') {
		if (!seed) return staticAsset(COURT_MAIDS[0]);
		return staticAsset(COURT_MAIDS[hashPick(seed, COURT_MAIDS.length)]);
	}
	const staged = resolveStage(p, year, look)?.avatar;
	if (staged) return staticAsset(staged);
	if (p.avatar) return staticAsset(p.avatar);
	const g = genderOf(p);
	return g ? staticAsset(PLACEHOLDER[g]) : null;
}

/** All browsable looks for wiki — base portrait plus each stage with distinct art. */
export function stageGalleryOf(p: Person): { id: string | null; label: string; art: string | null }[] {
	const out: { id: string | null; label: string; art: string | null }[] = [
		{ id: null, label: p.name, art: avatarOf(p) }
	];
	if (!p.stages?.length) return out;
	for (const s of p.stages) {
		const label = s.label ?? s.name ?? s.title ?? s.id ?? 'Later';
		const art = s.avatar ? staticAsset(s.avatar) : avatarOf(p);
		if (out.some((row) => row.art === art && row.label === label)) continue;
		out.push({ id: s.id ?? null, label, art });
	}
	return out;
}

/** Nation / place photo on wiki detail (nation profiles). */
export function photoOf(p: Person): string | undefined {
	return p.photo ? (staticAsset(p.photo) ?? undefined) : undefined;
}

/** Binyeo prop illustration on character profiles. */
export function binyeoArtOf(p: Person): string | undefined {
	return p.binyeoImage ? (staticAsset(p.binyeoImage) ?? undefined) : undefined;
}

/** Ring-pommel sword illustration on character profiles. */
export function swordArtOf(p: Person): string | undefined {
	return p.swordImage ? (staticAsset(p.swordImage) ?? undefined) : undefined;
}

/** Kingdom flag chip for wiki / hover cards. */
export function kingdomFlag(kingdom: Person['kingdom']): string | undefined {
	const flag = KINGDOMS[kingdom]?.flag;
	return flag ? (staticAsset(flag) ?? undefined) : undefined;
}

/** True when the art is a gendered stand-in, not a painted likeness. */
export function isPlaceholderArt(src: string | null | undefined): boolean {
	if (!src) return false;
	const path = src.split('?')[0] ?? src;
	return path.includes('/placeholder_m.') || path.includes('/placeholder_f.');
}

export const byId = new Map(PROFILES.map((p) => [p.id, p]));
/** Legacy Creator stub id → Hwanin (Class S Creator is one entry). */
{
	const hwanin = byId.get('hwanin');
	if (hwanin) byId.set('creator', hwanin);
}
/** Legacy island-maker id → Sulmun (Class III Tamla). */
{
	const sulmun = byId.get('sulmun');
	if (sulmun) byId.set('seolmundae', sulmun);
}
/** Former nation id → the underworld place (저승 is a place, not a kingdom). */
{
	const underworld = byId.get('underworld');
	if (underworld) byId.set('nation-underworld', underworld);
}

/** Longest aliases first, so "King Euija" wins over "Euija". */
const ALIASES: { alias: string; id: string }[] = PROFILES.flatMap((p) =>
	p.aliases.map((alias) => ({ alias, id: p.id }))
).sort((a, b) => b.alias.length - a.alias.length);

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** One regex: any alias, optionally followed by a hardcoded "(42)" to swallow. */
const NAME_RE = new RegExp(
	`\\b(${ALIASES.map((a) => escape(a.alias)).join('|')})\\b(\\s*\\(\\d{1,3}\\))?`,
	'g'
);

/** First registrant wins on duplicate surface forms (avoids later profiles stealing “Yeon”). */
const aliasToId = new Map<string, string>();
for (const a of ALIASES) {
	if (!aliasToId.has(a.alias)) aliasToId.set(a.alias, a.id);
}

export function ageAt(p: Person, year: number | null): number | null {
	if (p.born == null || year == null) return null;
	const age = year - p.born;
	// don't print ages before birth or long after death
	if (age < 0) return null;
	if (p.died != null && year > p.died + 1) return null;
	return age;
}

function escapeHtml(s: string) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Wrap every known name in the prose with a person trigger, and regenerate the
 * parenthesised age from the person's birth year and the year of this entry.
 * Only text between tags is touched, so markup is never corrupted.
 */
export function linkPeople(html: string, year: number | null): string {
	return html.replace(/(<[^>]*>)|([^<]+)/g, (_m, tag: string, text: string) => {
		if (tag) return tag;
		return text.replace(NAME_RE, (match, alias: string) => {
			const id = aliasToId.get(alias);
			const p = id ? byId.get(id) : undefined;
			if (!p) return match;
			const age = ageAt(p, year);
			const label = age == null ? alias : `${alias} (${age})`;
			return `<button type="button" class="person" data-person="${p.id}">${escapeHtml(label)}</button>`;
		});
	});
}
