/**
 * Border timeline: who held which ground, year by year, 120 BCE – 700 CE.
 *
 * Borders here are not drawn. They are *derived*: every site below is a real
 * fortress, capital or valley with a dated list of holders, and each year the
 * map gives every site the land nearest to it (a Voronoi cell, capped at the
 * site's reach) in its holder's colour. A border only moves when a site
 * changes hands, so every change traces back to one dated row.
 *
 * Dates follow the Samguk Sagi with the conventional modern readings
 * (Korean textbook / 한국민족문화대백과): traditional founding dates are kept
 * as the chronicle tells them; early Silla annexation dates are the annals'
 * own and run early. A third `'?'` field marks a holding historians dispute
 * (drawn fainter). Negative years are BCE.
 */

import { Delaunay } from 'd3-delaunay';
import riversNe from './data/rivers-ne.json' with { type: 'json' };
import { MAP_TERRAIN } from './mapTerrain';

export type PolityId =
	| 'gojoseon'
	| 'jin'
	| 'china'
	| 'buyeo'
	| 'jolbon'
	| 'dongbuyeo'
	| 'galsa'
	| 'goguryeo'
	| 'baekje'
	| 'silla'
	| 'gaya'
	| 'mahan'
	| 'jinhan'
	| 'byeonhan'
	| 'okjeo'
	| 'dongye'
	| 'tamla'
	| 'usan'
	| 'wa'
	| 'emishi'
	| 'kumaso'
	| 'hayato'
	| 'balhae';

export const POLITIES: Record<PolityId, { label: string; korean: string; color: string }> = {
	gojoseon: { label: 'Old Joseon', korean: '고조선', color: '#2f7f8f' },
	jin: { label: 'Jin', korean: '진국', color: '#c9a25f' },
	china: { label: 'the West', korean: '서국', color: '#b45309' },
	buyeo: { label: 'Buyeo', korean: '부여', color: '#9b4a5a' },
	jolbon: { label: 'Buyeo', korean: '졸본부여', color: '#4a6741' },
	dongbuyeo: { label: 'Eastern Buyeo', korean: '동부여', color: '#5f7d4f' },
	galsa: { label: 'Galsa Buyeo', korean: '갈사부여', color: '#7a9363' },
	goguryeo: { label: 'Goguryeo', korean: '고구려', color: '#e94949' },
	baekje: { label: 'Baekje', korean: '백제', color: '#ffb900' },
	silla: { label: 'Silla', korean: '신라', color: '#3e79e4' },
	gaya: { label: 'Gaya', korean: '가야', color: '#8b5cf6' },
	mahan: { label: 'Mahan', korean: '마한', color: '#c9a66b' },
	jinhan: { label: 'Jinhan', korean: '진한', color: '#7fa7c9' },
	byeonhan: { label: 'Byunhan', korean: '변한', color: '#b9a3e8' },
	okjeo: { label: 'Okjeo', korean: '옥저', color: '#6e9f6a' },
	dongye: { label: 'Dongye', korean: '동예', color: '#4e9e8e' },
	tamla: { label: 'Tamla', korean: '탐라', color: '#f97316' },
	usan: { label: 'Usan', korean: '우산국', color: '#5fa8a0' },
	/** Yamato kingship — shades of this pink mark Emishi / Kumaso / Hayato beside it. */
	wa: { label: 'Yamato', korean: '야마토', color: '#ec4899' },
	emishi: { label: 'Emishi', korean: '에미시', color: '#f9a8d4' },
	kumaso: { label: 'Kumaso', korean: '구마소', color: '#9d174d' },
	hayato: { label: 'Hayato', korean: '하야토', color: '#db2777' },
	balhae: { label: 'Balhae', korean: '발해', color: '#6b8e23' }
};

/** The Chinese frontier changes dynasty, not colour. */
const CHINA_ERAS: [number, string, string][] = [
	[-999, 'Yan', '연'],
	[-222, 'Qin', '진'],
	[-206, 'Han', '한'],
	[220, 'Wei', '위'],
	[266, 'Jin', '진'],
	[337, 'Former Yan', '전연'],
	[370, 'Former Qin', '전진'],
	[384, 'Later Yan', '후연'],
	[409, 'Northern Yan', '북연'],
	[436, 'Northern Wei', '북위'],
	[534, 'Eastern Wei', '동위'],
	[550, 'Northern Qi', '북제'],
	[577, 'Northern Zhou', '북주'],
	[581, 'Sui', '수'],
	[618, 'Tang', '당']
];

/**
 * Wa writes its own name as Japan from 670, the year the Tang record the change.
 * Before that the map says Yamato kingship.
 */
export function polityName(id: PolityId, year: number): { label: string; korean: string } {
	if (id === 'wa') {
		if (year >= 670) return { label: 'Japan', korean: '일본' };
		return { label: 'Yamato kingship', korean: '야마토 왕권' };
	}
	if (id !== 'china') return POLITIES[id];
	const era = CHINA_ERAS.findLast(([from]) => from <= year) ?? CHINA_ERAS[0];
	return { label: era[1], korean: era[2] };
}

/** The earliest record: the Guanzi names Joseon as a trading partner of Qi. */
export const YEAR_MIN = -400;
export const YEAR_MAX = 800;

/** The span the chronicle itself covers, from Queen Sunduk's crowning to Final Ford. */
export const STORY_SPAN = { from: 632, to: 676 };

export function formatYear(year: number, ko = false): string {
	if (ko) return year < 0 ? `기원전 ${-year}년` : `${year}년`;
	return year < 0 ? `${-year} BCE` : `${year} CE`;
}

/**
 * Han commanderies, then the two Tang seats on former Samhan ground.
 * Each is its own shade of the Chinese orange so Lelang, Daifang and Xuantu
 * read as territories. A dark edge of that same shade marks the border.
 */
export const COMMANDERIES: Record<string, { korean: string; color: string }> = {
	Lelang: { korean: '낙랑군', color: '#c2410c' },
	Zhenfan: { korean: '진번군', color: '#9a3412' },
	Lintun: { korean: '임둔군', color: '#d97706' },
	Xuantu: { korean: '현도군', color: '#a16207' },
	Daifang: { korean: '대방군', color: '#ea580c' },
	Ungjin: { korean: '웅진도독부', color: '#c2410c' },
	Andong: { korean: '안동도호부', color: '#9a3412' }
};

/**
 * Peoples without a drawn border: northern band of Korea, and the Yamato fringe.
 * Labels only — each carries an animal / ground epithet and a culture line for the wiki.
 */
export interface MapTribe {
	id: string;
	en: string;
	ko: string;
	han?: string;
	/** Short epithet under the name: "stag tribes", "river tribes", … */
	epithet: { en: string; ko: string };
	/** One-line culture for the map hover / wiki tagline seed. */
	culture: string;
	lon: number;
	lat: number;
	from: number;
	to: number;
	/** `north` = Korea's northern fringe; `wa` = islands beyond Yamato. */
	band: 'north' | 'wa';
}

/** @deprecated use MapTribe */
export type NorthernTribe = MapTribe;

export const NORTHERN_TRIBES: MapTribe[] = [
	{
		id: 'xianbei',
		en: 'Xianbei',
		ko: '선비',
		han: '鮮卑',
		epithet: { en: 'horse tribes', ko: '말 부족' },
		culture: 'Felt tents and left-closing robes on the grass north of the Liao — the steppe roof before the Turks.',
		lon: 121.4,
		lat: 44.6,
		from: -220,
		to: 400,
		band: 'north'
	},
	{
		id: 'khitan',
		en: 'Khitan',
		ko: '거란',
		han: '契丹',
		epithet: { en: 'steppe tribes', ko: '초원 부족' },
		culture: 'Riders of the Shira Muren. Steal horses, sell them back, and keep the northern marches of Goguryeo awake.',
		lon: 124.2,
		lat: 44.8,
		from: 388,
		to: 800,
		band: 'north'
	},
	{
		id: 'suksin',
		en: 'Sukshin',
		ko: '숙신',
		han: '肅慎',
		epithet: { en: 'forest tribes', ko: '숲 부족' },
		culture: 'Arrow-poison hunters of the northeastern timber — earth-roofed houses, pigs where the steppe counts horses.',
		lon: 130.6,
		lat: 44.2,
		from: -300,
		to: 480,
		band: 'north'
	},
	{
		id: 'mohe',
		en: 'Malgal',
		ko: '말갈',
		han: '靺鞨',
		epithet: { en: 'river tribes', ko: '강 부족' },
		culture: 'Seven rivers of the northeast forest. The name the Sui books keep; later mouths say Mohe. Gulgul’s people.',
		lon: 129.2,
		lat: 43.7,
		from: 480,
		to: 800,
		band: 'north'
	},
	{
		id: 'emishi',
		en: 'Emishi',
		ko: '에미시',
		han: '蝦夷',
		epithet: { en: 'stag tribes', ko: '사슴 부족' },
		culture: 'Deer hunters of the northern islands. Yamato calls them Emishi; the wash covers their hills long before any court line does.',
		lon: 140.8,
		lat: 39.6,
		from: -400,
		to: 800,
		band: 'wa'
	},
	{
		id: 'kumaso',
		en: 'Kumaso',
		ko: '구마소',
		han: '熊襲',
		epithet: { en: 'bear tribes', ko: '곰 부족' },
		culture: 'Bear people of southern Kyushu. An older roof than Yamato’s; the chronicles write them down as they are driven in.',
		lon: 130.7,
		lat: 32.1,
		from: -400,
		to: 528,
		band: 'wa'
	},
	{
		id: 'hayato',
		en: 'Hayato',
		ko: '하야토',
		han: '隼人',
		epithet: { en: 'falcon tribes', ko: '매 부족' },
		culture: 'Falcon people of Osumi and Satsuma. Serve, rebel, and keep a southern tongue under Yamato’s rising sun.',
		lon: 130.9,
		lat: 31.4,
		from: -200,
		to: 721,
		band: 'wa'
	}
];

/** The Chinese frontier and the islands: dimmed on the Samhan frame, full on Ecumene+. */
const FOREIGN = new Set<PolityId>(['china', 'wa', 'emishi', 'kumaso', 'hayato']);

/** Mix a hex colour toward black (k < 0) or white (k > 0). */
export function shadeColor(hex: string, k: number): string {
	const n = parseInt(hex.slice(1), 16);
	const ch = [n >> 16, (n >> 8) & 255, n & 255].map((c) => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k));
	return '#' + ch.map((c) => c.toString(16).padStart(2, '0')).join('');
}

/** `near` = Samhan (foreign much darker); `wide` = Ecumene and out (full nation colour). */
export type MapColorMode = 'near' | 'wide';

/**
 * The colour a polity paints. On the Samhan frame China and Wa sit far back
 * (darker, so the peninsula's own states read first). On Ecumene and wider they
 * keep the nation colour. Rivals inside one nation (Wei / Shu / Wu, etc.) take
 * nearby shades via `rivalShade`, the same way Gaya statelets share purple.
 */
export function mapColor(id: PolityId, mode: MapColorMode = 'near'): string {
	const base = POLITIES[id].color;
	/** China stays the wash colour. A darker pass was painting Northern Yan as a second country. */
	if (id === 'china') return base;
	if (FOREIGN.has(id)) return mode === 'near' ? shadeColor(base, -0.58) : base;
	return shadeColor(base, 0.08);
}

/**
 * Gaya-like shade ladder for concurrent courts of one nation (Wei / Shu / Wu,
 * Northern Wei / Later Qin / Western Jin…). Index 0 = largest; keeps the base.
 * Steps are wide on purpose — a soft hash was reading as one orange block.
 */
const PEER_LADDER = [0, -0.4, 0.34, -0.58, 0.18, -0.28, 0.48, -0.48, 0.08, -0.2];

export function peerShade(base: string, index: number): string {
	return shadeColor(base, PEER_LADDER[((index % PEER_LADDER.length) + PEER_LADDER.length) % PEER_LADDER.length]!);
}

/** @deprecated use peerShade — kept for worldLayer's old tint path */
export function rivalShade(base: string, n: number): string {
	return peerShade(base, Math.abs(n) % PEER_LADDER.length);
}

/** [from year, holder (null = nobody's), '?' when disputed] */
type Hold = [number, PolityId | null, '?'?];

/** Gaya was a league of statelets, never one kingdom: each paints its own shade of purple. */
export type GayaLeague = 'gumgwan' | 'takgisun' | 'ara' | 'sogaya' | 'bihwa' | 'degaya' | 'sungsan' | 'goryung';

/** Neighbours alternate light and dark so the seams between statelets read. */
export const GAYA_LEAGUES: Record<GayaLeague, { label: string; korean: string; color: string }> = {
	gumgwan: { label: 'Gumgwan Gaya', korean: '금관가야', color: '#8b5cf6' },
	takgisun: { label: 'Takgisun', korean: '탁순국', color: '#c4b5fd' },
	ara: { label: 'Ara Gaya', korean: '아라가야', color: '#6d28d9' },
	sogaya: { label: 'Sogaya', korean: '소가야', color: '#d8b4fe' },
	bihwa: { label: 'Bihwa Gaya', korean: '비화가야', color: '#a78bfa' },
	degaya: { label: 'Degaya', korean: '대가야', color: '#5b21b6' },
	sungsan: { label: 'Sungsan Gaya', korean: '성산가야', color: '#c084fc' },
	goryung: { label: 'Goryung Gaya', korean: '고령가야', color: '#9333ea' }
};

interface SiteDef {
	id: string;
	name: string;
	lon: number;
	lat: number;
	/** reach in map units (~2 km each); default 44 */
	r?: number;
	/** dated commandery names while held by China ([from year, name or null]) */
	groups?: [number, string | null][];
	/** the Gaya statelet this ground belongs to while Gaya holds it */
	league?: GayaLeague;
	/** sheet position, for generated sites placed in sheet units rather than lon/lat */
	at?: Pt;
	h: Hold[];
}

/** The settlement of 676 leaves the north to nobody the annals name until Balhae. */
const SITE_DEFS: SiteDef[] = [
	// ——— Liaoxi: always the Chinese side ———
	{ id: 'liucheng', name: 'Liucheng', lon: 120.45, lat: 41.57, r: 81, h: [[-999, null], [-282, 'china']] },
	{ id: 'jinzhou', name: 'Jinzhou', lon: 121.13, lat: 41.1, r: 62, h: [[-999, null], [-282, 'china']] },

	// ——— Liaodong: Chinese commanderies until Gwanggeto, Goguryeo to 668, Tang after ———
	{
		id: 'xiangping',
		name: 'Yodong (Liaoyang)',
		lon: 123.17,
		lat: 41.27,
		r: 59,
		h: [[-999, 'gojoseon', '?'], [-282, 'china'], [404, 'goguryeo'], [668, 'china']]
	},
	{ id: 'ansi', name: 'Ansi', lon: 122.69, lat: 40.82, h: [[-999, 'gojoseon', '?'], [-282, 'china'], [404, 'goguryeo'], [668, 'china']] },
	{ id: 'geonan', name: 'Gunan', lon: 122.35, lat: 40.4, h: [[-999, 'gojoseon', '?'], [-282, 'china'], [404, 'goguryeo'], [668, 'china']] },
	{
		id: 'bisa',
		name: 'Bisa',
		lon: 121.88,
		lat: 39.05,
		h: [[-999, 'gojoseon', '?'], [-282, 'china'], [404, 'goguryeo', '?'], [668, 'china']]
	},
	{ id: 'zhuanghe', name: 'Zhuanghe', lon: 122.96, lat: 39.7, h: [[-999, 'gojoseon', '?'], [-282, 'china'], [404, 'goguryeo', '?'], [668, 'china']] },
	{ id: 'gaemo', name: 'Gemo', lon: 123.4, lat: 41.6, h: [[-999, 'gojoseon', '?'], [-282, 'china'], [404, 'goguryeo'], [668, 'china']] },
	{
		id: 'sinseong',
		name: 'New Fortress (Fushun)',
		lon: 123.95,
		lat: 41.88,
		groups: [[-75, 'Xuantu']], h: [[-999, 'gojoseon', '?'], [-282, 'china'], [404, 'goguryeo'], [668, 'china']]
	},
	{
		id: 'xianping',
		name: 'Xi’anping (Amnok mouth)',
		lon: 124.38,
		lat: 40.12,
		h: [[-999, 'gojoseon', '?'], [-282, 'china'], [311, 'goguryeo'], [668, 'china'], [676, null]]
	},
	{
		id: 'kaiyuan',
		name: 'Kaiyuan',
		lon: 124.0,
		lat: 42.55,
		r: 59,
		h: [[-999, null], [-200, 'buyeo', '?'], [346, 'china', '?'], [404, 'goguryeo'], [668, 'china'], [676, null], [720, 'balhae', '?']]
	},

	// ——— Buyeo and the northern plain ———
	{
		id: 'buyeo_fort',
		name: 'Buyeo Fortress (Nong’an)',
		lon: 125.17,
		lat: 44.43,
		r: 76,
		h: [[-999, null], [-200, 'buyeo'], [494, 'goguryeo'], [668, null], [720, 'balhae', '?']]
	},
	{
		id: 'buyeo_jilin',
		name: 'Buyeo (Jilin)',
		lon: 126.55,
		lat: 43.85,
		r: 76,
		h: [[-999, null], [-200, 'buyeo'], [494, 'goguryeo'], [668, null], [720, 'balhae', '?']]
	},
	{
		id: 'liuhe',
		name: 'Liuhe',
		lon: 125.6,
		lat: 42.5,
		r: 59,
		h: [[-999, null], [-200, 'buyeo', '?'], [300, 'goguryeo', '?'], [668, null], [720, 'balhae', '?']]
	},
	{
		id: 'dunhua',
		name: 'Dongmo Mountain (Dunhua)',
		lon: 128.23,
		lat: 43.37,
		r: 62,
		h: [[-999, null], [-59, 'dongbuyeo', '?'], [410, 'goguryeo', '?'], [668, null], [698, 'balhae']]
	},
	{
		id: 'yanji',
		name: 'North Okjeo (Yanji)',
		lon: 129.5,
		lat: 42.9,
		r: 40,
		h: [[-999, null], [-200, 'okjeo'], [56, 'goguryeo'], [668, null], [698, 'balhae', '?'], [720, 'balhae']]
	},
	{
		id: 'hunchun',
		name: 'Chek Fortress (Hunchun)',
		lon: 130.36,
		lat: 42.86,
		r: 16,
		h: [[-999, null], [-200, 'okjeo'], [56, 'goguryeo'], [668, null], [698, 'balhae', '?'], [720, 'balhae']]
	},

	// ——— the Goguryeo heartland ———
	{
		id: 'jolbon',
		name: 'Buyeo (Jolbon / Huanren)',
		lon: 125.36,
		lat: 41.27,
		groups: [[-75, 'Xuantu']], h: [[-999, null], [-100, 'jolbon', '?'], [-75, 'china', '?'], [-37, 'goguryeo'], [668, 'china'], [676, null], [720, 'balhae', '?']]
	},
	{
		id: 'gungnae',
		name: 'Gungnae (Ji’an)',
		lon: 126.19,
		lat: 41.13,
		h: [[-999, null], [-100, 'jolbon', '?'], [-37, 'goguryeo'], [668, 'china'], [676, null], [720, 'balhae', '?']]
	},
	{
		id: 'tonghua',
		name: 'Tonghua',
		lon: 125.94,
		lat: 41.72,
		groups: [[-75, 'Xuantu']], h: [[-999, null], [-100, 'jolbon', '?'], [-75, 'china', '?'], [-37, 'goguryeo'], [668, null], [720, 'balhae', '?']]
	},
	{ id: 'kanggye', name: 'Kanggye', lon: 126.6, lat: 40.97, h: [[-999, null], [-100, 'jolbon', '?'], [-37, 'goguryeo'], [668, null], [720, 'balhae', '?']] },
	{
		id: 'changbai',
		name: 'Under Mount Pektu',
		lon: 128.2,
		lat: 41.4,
		r: 59,
		h: [[-999, null], [100, 'goguryeo', '?'], [668, null], [720, 'balhae', '?']]
	},

	// ——— the northwest: Old Joseon, then Lelang, then Goguryeo ———
	{
		id: 'pyongyang',
		name: 'Pyongyang',
		lon: 125.75,
		lat: 39.02,
		groups: [[-108, 'Lelang']], h: [[-999, 'gojoseon'], [-108, 'china'], [313, 'goguryeo'], [668, 'china'], [670, 'silla', '?'], [735, 'silla']]
	},
	{
		id: 'anju',
		name: 'Anju (Salsu)',
		lon: 125.66,
		lat: 39.6,
		groups: [[-108, 'Lelang']], h: [[-999, 'gojoseon'], [-108, 'china'], [313, 'goguryeo'], [668, 'china'], [670, null]]
	},
	{
		id: 'uiju',
		name: 'Uiju',
		lon: 124.6,
		lat: 40.2,
		h: [[-999, 'gojoseon', '?'], [-108, 'china'], [311, 'goguryeo'], [668, 'china'], [676, null]]
	},
	{
		id: 'sariwon',
		name: 'Daifang (Sariwon)',
		lon: 125.76,
		lat: 38.5,
		groups: [[-108, 'Lelang'], [204, 'Daifang']], h: [[-999, 'gojoseon'], [-108, 'china'], [314, 'goguryeo'], [371, 'baekje', '?'], [392, 'goguryeo'], [668, 'china'], [670, 'silla', '?'], [735, 'silla']]
	},
	{
		id: 'haeju',
		name: 'Haeju',
		lon: 125.7,
		lat: 38.04,
		groups: [[-108, 'Zhenfan'], [-82, 'Lelang'], [204, 'Daifang']], h: [[-999, 'gojoseon', '?'], [-108, 'china'], [314, 'goguryeo'], [369, 'baekje'], [392, 'goguryeo'], [668, 'china'], [670, 'silla', '?'], [735, 'silla']]
	},
	{
		id: 'kaesong',
		name: 'Kesong',
		lon: 126.55,
		lat: 37.97,
		groups: [[-108, 'Zhenfan']], h: [[-999, 'gojoseon', '?'], [-108, 'china', '?'], [-82, null], [250, 'baekje'], [396, 'goguryeo'], [553, 'silla', '?'], [668, 'silla']]
	},

	// ——— the east coast: Okjeo and Dongye ———
	{
		id: 'hamhung',
		name: 'Okjeo (Hamhung)',
		lon: 127.53,
		lat: 39.92,
		r: 54,
		groups: [[-107, 'Xuantu']], h: [[-999, null], [-200, 'okjeo'], [-107, 'china'], [-75, 'okjeo'], [56, 'goguryeo'], [556, 'silla'], [603, 'goguryeo'], [668, null], [730, 'balhae', '?']]
	},
	{
		id: 'bukcheong',
		name: 'Bukchung',
		lon: 128.33,
		lat: 40.4,
		r: 54,
		groups: [[-107, 'Xuantu']], h: [[-999, null], [-200, 'okjeo'], [-107, 'china'], [-75, 'okjeo'], [56, 'goguryeo'], [568, 'silla', '?'], [603, 'goguryeo'], [668, null], [730, 'balhae', '?']]
	},
	{
		id: 'anbyeon',
		name: 'Biyulhol (Anbyun)',
		lon: 127.55,
		lat: 39.03,
		groups: [[-108, 'Lintun']], h: [[-999, null], [-200, 'dongye'], [-108, 'china', '?'], [-82, 'dongye'], [100, 'goguryeo', '?'], [556, 'silla'], [603, 'goguryeo'], [668, null], [721, 'silla', '?']]
	},
	{
		id: 'chuncheon',
		name: 'Chunchun',
		lon: 127.73,
		lat: 37.88,
		h: [[-999, null], [-200, 'dongye', '?'], [400, 'goguryeo', '?'], [551, 'silla']]
	},
	{
		id: 'gangneung',
		name: 'Hasla (Gangnung)',
		lon: 128.9,
		lat: 37.75,
		groups: [[-108, 'Lintun']], h: [[-999, null], [-200, 'dongye'], [-108, 'china', '?'], [-82, 'dongye'], [400, 'goguryeo', '?'], [505, 'silla']]
	},
	{
		id: 'samcheok',
		name: 'Siljik (Samchuk)',
		lon: 129.17,
		lat: 37.45,
		h: [[-999, null], [-200, 'dongye'], [400, 'silla', '?'], [468, 'goguryeo'], [505, 'silla']]
	},
	{ id: 'uljin', name: 'Uljin', lon: 129.4, lat: 36.99, h: [[-999, null], [-200, 'dongye', '?'], [400, 'silla', '?']] },
	{ id: 'ulleung', name: 'Usan (Ullung)', lon: 130.86, lat: 37.5, r: 12, h: [[-999, null], [-100, 'usan', '?'], [512, 'silla']] },

	// ——— the Han river: Baekje’s cradle, everyone’s prize ———
	{
		id: 'wirye',
		name: 'Wirye / River Palace',
		lon: 127.12,
		lat: 37.52,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [-18, 'baekje'], [475, 'goguryeo'], [551, 'baekje'], [553, 'silla']]
	},
	{
		id: 'michuhol',
		name: 'Michuhol',
		lon: 126.7,
		lat: 37.45,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [-18, 'baekje'], [475, 'goguryeo'], [551, 'baekje'], [553, 'silla']]
	},
	{
		id: 'paju',
		name: 'Chiljung (Paju)',
		lon: 126.78,
		lat: 37.76,
		h: [[-999, null], [-300, 'jin', '?'], [-100, 'mahan', '?'], [-18, 'baekje'], [396, 'goguryeo'], [553, 'silla']]
	},
	{
		id: 'maeso',
		name: 'Maeso (Yunchun)',
		lon: 127.07,
		lat: 38.1,
		h: [[-999, null], [250, 'baekje', '?'], [396, 'goguryeo'], [553, 'silla', '?'], [668, 'silla']]
	},
	{
		id: 'danghang',
		name: 'Danghang Fortress (Hwasung)',
		lon: 126.8,
		lat: 37.2,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [250, 'baekje'], [475, 'goguryeo', '?'], [551, 'baekje'], [553, 'silla']]
	},
	{
		id: 'wonju',
		name: 'Wonju',
		lon: 127.95,
		lat: 37.34,
		h: [[-999, null], [250, 'baekje', '?'], [475, 'goguryeo'], [551, 'silla']]
	},
	{
		id: 'chungju',
		name: 'Gugwon (Chungju)',
		lon: 127.93,
		lat: 36.97,
		h: [[-999, null], [250, 'baekje', '?'], [470, 'goguryeo'], [550, 'silla']]
	},
	{
		id: 'danyang',
		name: 'Juk Fortress (Danyang)',
		lon: 128.37,
		lat: 36.98,
		h: [[-999, null], [470, 'goguryeo'], [550, 'silla']]
	},

	// ——— Mahan’s heartland, absorbed by Baekje ———
	{
		id: 'cheonan',
		name: 'Mokji (Chunan)',
		lon: 127.15,
		lat: 36.8,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [250, 'baekje', '?'], [660, 'china'], [671, 'silla']]
	},
	{
		id: 'cheongju',
		name: 'Nangbi (Chungju)',
		lon: 127.49,
		lat: 36.64,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [300, 'baekje', '?'], [475, 'goguryeo', '?'], [629, 'silla']]
	},
	{
		id: 'ungjin',
		name: 'Ungjin (Gongju)',
		lon: 127.12,
		lat: 36.46,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [300, 'baekje'], [660, 'china'], [671, 'silla']]
	},
	{
		id: 'sabi',
		name: 'Sabi (Buyeo)',
		lon: 126.91,
		lat: 36.28,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [300, 'baekje'], [660, 'china'], [671, 'silla']]
	},
	{
		id: 'juryu',
		name: 'Juryu',
		lon: 126.7,
		lat: 36.1,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [300, 'baekje'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'daejeon',
		name: 'Dejun',
		lon: 127.38,
		lat: 36.35,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [300, 'baekje'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'iksan',
		name: 'Iksan',
		lon: 126.95,
		lat: 35.95,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [369, 'baekje'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'jeonju',
		name: 'Wansan (Junju)',
		lon: 127.15,
		lat: 35.82,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [369, 'baekje'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'gochang',
		name: 'Gochang',
		lon: 126.7,
		lat: 35.43,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [369, 'baekje'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'gwangju',
		name: 'Gwangju',
		lon: 126.85,
		lat: 35.15,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [369, 'baekje'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'naju',
		name: 'Yungsan river (Naju)',
		lon: 126.7,
		lat: 34.95,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [369, 'baekje', '?'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'haenam',
		name: 'Haenam',
		lon: 126.6,
		lat: 34.57,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [369, 'baekje', '?'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'suncheon',
		name: 'Sunchun',
		lon: 127.48,
		lat: 34.95,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [369, 'baekje', '?'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'namwon',
		name: 'Gimun (Namwon)',
		lon: 127.39,
		lat: 35.41,
		h: [[-999, null], [-300, 'jin'], [-100, 'mahan'], [369, 'gaya', '?'], [513, 'baekje'], [663, 'china'], [671, 'silla']]
	},

	// ——— the Sobek line: where Silla climbs west ———
	{
		id: 'boeun',
		name: 'Samnyun (Boeun)',
		lon: 127.73,
		lat: 36.49,
		h: [[-999, null], [-300, 'jin', '?'], [-100, 'mahan', '?'], [300, 'baekje', '?'], [470, 'silla']]
	},
	{
		id: 'okcheon',
		name: 'Gwansan (Okchun)',
		lon: 127.57,
		lat: 36.3,
		h: [[-999, null], [-300, 'jin', '?'], [-100, 'mahan', '?'], [300, 'baekje', '?'], [500, 'silla', '?']]
	},

	// ——— Byunhan, then the Gaya leagues ———
	{
		id: 'gimhae',
		league: 'gumgwan',
		name: 'Gumgwan Gaya (Gimhae)',
		lon: 128.88,
		lat: 35.23,
		h: [[-999, null], [-300, 'jin'], [-100, 'byeonhan'], [42, 'gaya'], [532, 'silla']]
	},
	{
		id: 'changwon',
		league: 'takgisun',
		name: 'Takgisun (Changwon)',
		lon: 128.68,
		lat: 35.23,
		h: [[-999, null], [-300, 'jin'], [-100, 'byeonhan'], [42, 'gaya'], [532, 'silla', '?']]
	},
	{
		id: 'busan',
		league: 'gumgwan',
		name: 'Guchilsan (Busan)',
		lon: 129.08,
		lat: 35.2,
		h: [[-999, null], [-300, 'jin', '?'], [-100, 'byeonhan', '?'], [42, 'gaya', '?'], [400, 'silla', '?']]
	},
	{
		id: 'haman',
		league: 'ara',
		name: 'Ara Gaya (Haman)',
		lon: 128.41,
		lat: 35.27,
		h: [[-999, null], [-300, 'jin'], [-100, 'byeonhan'], [42, 'gaya'], [559, 'silla', '?']]
	},
	{
		id: 'goseong',
		league: 'sogaya',
		name: 'Sogaya (Gosung)',
		lon: 128.32,
		lat: 34.97,
		h: [[-999, null], [-300, 'jin'], [-100, 'byeonhan'], [42, 'gaya'], [562, 'silla']]
	},
	{
		id: 'changnyeong',
		league: 'bihwa',
		name: 'Bihwa (Changnyung)',
		lon: 128.49,
		lat: 35.54,
		h: [[-999, null], [-300, 'jin'], [-100, 'byeonhan'], [42, 'gaya'], [555, 'silla']]
	},
	{
		id: 'goryeong',
		league: 'degaya',
		name: 'Degaya (Goryung)',
		lon: 128.26,
		lat: 35.73,
		h: [[-999, null], [-300, 'jin'], [-100, 'byeonhan'], [42, 'gaya'], [562, 'silla']]
	},
	{
		id: 'hapcheon',
		league: 'degaya',
		name: 'Daeya (Hapchun)',
		lon: 128.17,
		lat: 35.57,
		h: [[-999, null], [-300, 'jin'], [-100, 'byeonhan'], [42, 'gaya'], [562, 'silla'], [642, 'baekje'], [660, 'silla']]
	},
	{
		id: 'geochang',
		league: 'degaya',
		name: 'Guchang',
		lon: 127.91,
		lat: 35.69,
		h: [[-999, null], [-300, 'jin', '?'], [-100, 'byeonhan', '?'], [42, 'gaya'], [562, 'silla'], [642, 'baekje', '?'], [660, 'silla']]
	},
	{
		id: 'jinju',
		league: 'sogaya',
		name: 'Jinju',
		lon: 128.08,
		lat: 35.18,
		h: [[-999, null], [-300, 'jin'], [-100, 'byeonhan'], [42, 'gaya'], [562, 'silla'], [642, 'baekje', '?'], [660, 'silla']]
	},
	{
		id: 'hadong',
		league: 'degaya',
		name: 'Desa (Hadong)',
		lon: 127.75,
		lat: 35.07,
		h: [[-999, null], [-300, 'jin', '?'], [-100, 'byeonhan', '?'], [42, 'gaya'], [529, 'baekje'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'seongju',
		league: 'sungsan',
		name: 'Sungsan Gaya (Sungju)',
		lon: 128.28,
		lat: 35.92,
		h: [[-999, null], [-300, 'jin'], [-100, 'byeonhan'], [42, 'gaya'], [500, 'silla', '?']]
	},
	{
		id: 'hamchang',
		league: 'goryung',
		name: 'Goryung Gaya (Hamchang)',
		lon: 128.18,
		lat: 36.57,
		h: [[-999, null], [-300, 'jin', '?'], [-100, 'jinhan', '?'], [42, 'gaya', '?'], [500, 'silla', '?']]
	},

	// ——— Jinhan: the twelve statelets Saro swallows ———
	{ id: 'gyeongju', name: 'Saro (Gyungju)', lon: 129.21, lat: 35.84, h: [[-999, null], [-300, 'jin'], [-100, 'jinhan'], [-57, 'silla']] },
	{ id: 'pohang', name: 'Umjupbul (Pohang)', lon: 129.35, lat: 36.02, h: [[-999, null], [-300, 'jin'], [-100, 'jinhan'], [102, 'silla']] },
	{ id: 'ulsan', name: 'Ulsan', lon: 129.31, lat: 35.54, h: [[-999, null], [-300, 'jin'], [-100, 'jinhan'], [100, 'silla', '?']] },
	{ id: 'gyeongsan', name: 'Apdok (Gyungsan)', lon: 128.74, lat: 35.82, h: [[-999, null], [-300, 'jin'], [-100, 'jinhan'], [102, 'silla']] },
	{ id: 'uiseong', name: 'Jomun (Uisung)', lon: 128.7, lat: 36.35, h: [[-999, null], [-300, 'jin'], [-100, 'jinhan'], [185, 'silla']] },
	{ id: 'yeongcheon', name: 'Golbul (Yungchun)', lon: 128.94, lat: 35.97, h: [[-999, null], [-300, 'jin'], [-100, 'jinhan'], [236, 'silla']] },
	{ id: 'sangju', name: 'Sabul (Sangju)', lon: 128.16, lat: 36.41, h: [[-999, null], [-300, 'jin'], [-100, 'jinhan'], [249, 'silla']] },
	{ id: 'daegu', name: 'Dalgubul (Degu)', lon: 128.6, lat: 35.87, h: [[-999, null], [-300, 'jin'], [-100, 'jinhan'], [261, 'silla']] },
	{ id: 'cheongdo', name: 'Isu (Chungdo)', lon: 128.73, lat: 35.65, h: [[-999, null], [-300, 'jin'], [-100, 'jinhan'], [297, 'silla']] },
	{ id: 'andong', name: 'Andong', lon: 128.73, lat: 36.57, h: [[-999, null], [-300, 'jin'], [-100, 'jinhan'], [300, 'silla', '?']] },
	{ id: 'yeongju', name: 'Yungju', lon: 128.6, lat: 36.82, h: [[-999, null], [-300, 'jin', '?'], [-100, 'jinhan', '?'], [400, 'silla', '?']] },

	// ——— the islands ———
	{ id: 'jeju', name: 'Tamla (Jeju)', lon: 126.53, lat: 33.4, r: 26, h: [[-999, 'tamla']] },
	{ id: 'galsa', name: 'Galsa', lon: 130.0, lat: 43.3, r: 18, h: [[-999, null], [-59, 'dongbuyeo', '?'], [22, 'galsa', '?'], [68, 'goguryeo', '?'], [668, null], [720, 'balhae', '?']] },
	{ id: 'tsushima', name: 'Tsushima', lon: 129.3, lat: 34.4, r: 28, h: [[-999, null], [-300, 'wa']] },
	/**
	 * Yamato kingship, grown to the coastline (reaches are in sheet units, ~50 per
	 * degree). Kinai from 100; western Honshu by 200; Shikoku by the Wei embassy
	 * generation (220); northern Kyushu from the Yayoi contact (-100). The east
	 * stays Emishi until the Kanto tombs (400) and Abe no Hirafu (658). Kumaso
	 * falls in 528, Hayato in 721. Northern Honshu stays Emishi.
	 */
	{ id: 'kyushu', name: 'Tsukushi (Kyushu)', lon: 130.55, lat: 33.55, r: 100, h: [[-999, null], [-100, 'wa']] },
	{
		id: 'kumaso_land',
		name: 'Kumaso (southern Kyushu)',
		lon: 130.75,
		lat: 32.05,
		r: 75,
		h: [[-999, 'kumaso'], [528, 'wa']]
	},
	{
		id: 'hayato_land',
		name: 'Hayato (Osumi)',
		lon: 130.95,
		lat: 31.35,
		r: 48,
		h: [[-999, 'hayato'], [721, 'wa']]
	},
	{
		id: 'yamato_kinai',
		name: 'Yamato (Kinai)',
		lon: 135.8,
		lat: 34.55,
		r: 90,
		h: [[-999, null], [100, 'wa']]
	},
	{
		id: 'izumo',
		name: 'Izumo',
		lon: 132.75,
		lat: 35.4,
		r: 70,
		h: [[-999, null], [200, 'wa']]
	},
	{
		id: 'chugoku',
		name: 'western Honshu',
		lon: 132.3,
		lat: 34.45,
		r: 80,
		h: [[-999, null], [200, 'wa']]
	},
	{
		id: 'shikoku',
		name: 'Shikoku',
		lon: 133.6,
		lat: 33.7,
		r: 75,
		h: [[-999, null], [220, 'wa']]
	},
	{
		id: 'chubu',
		name: 'Chubu',
		lon: 137.1,
		lat: 35.5,
		r: 80,
		h: [[-999, 'emishi'], [400, 'wa']]
	},
	{
		id: 'hokuriku',
		name: 'Hokuriku',
		lon: 137.2,
		lat: 36.9,
		r: 75,
		h: [[-999, 'emishi'], [658, 'wa', '?']]
	},
	{
		id: 'kanto',
		name: 'Kanto',
		lon: 139.45,
		lat: 36.05,
		r: 90,
		h: [[-999, 'emishi'], [400, 'wa']]
	},
	{
		id: 'mutsu_south',
		name: 'southern Mutsu',
		lon: 140.55,
		lat: 37.85,
		r: 85,
		h: [[-999, 'emishi'], [658, 'wa', '?']]
	},
	{
		id: 'mutsu_north',
		name: 'Emishi (northern Honshu)',
		lon: 141.05,
		lat: 39.55,
		r: 100,
		h: [[-999, 'emishi']]
	}
];

/** One dated change on the slider. */
export interface BorderEvent {
	year: number;
	en: string;
	ko: string;
}

export const BORDER_EVENTS: BorderEvent[] = [
	{ year: -700, en: 'The first record: the Guanzi names Joseon, trading furs with Qi.', ko: '《관자》에 조선이 처음 기록된다. 제나라와 모피를 교역한다.' },
	{ year: -300, en: 'Jin holds the south of the peninsula; Old Joseon the north.', ko: '진국이 한반도 남부를, 고조선이 북부를 차지한다.' },
	{ year: -282, en: 'Yan’s general Qin Kai drives Old Joseon east across the Liao.', ko: '연나라 장수 진개가 고조선을 요하 동쪽으로 밀어낸다.' },
	{ year: -222, en: 'Qin swallows Yan. The frontier changes masters.', ko: '진이 연을 멸한다.' },
	{ year: -194, en: 'Wiman, an exile from Yan, takes the throne of Old Joseon.', ko: '위만이 고조선의 왕위를 차지한다.' },
	{
		year: -108,
		en: 'The Han take Old Joseon: Lelang, Zhenfan, Lintun and Xuantu.',
		ko: '한이 고조선을 무너뜨리고 낙랑·진번·임둔·현도를 둔다.'
	},
	{ year: -100, en: 'Jin gives way to the three Han: Mahan, Jinhan and Byunhan.', ko: '진국이 마한·진한·변한의 삼한으로 나뉜다.' },
	{ year: -82, en: 'The Han give up Zhenfan and Lintun.', ko: '한이 진번군과 임둔군을 폐지한다.' },
	{ year: -75, en: 'Xuantu is pushed out of Okjeo, west over the mountains.', ko: '현도군이 옥저에서 서쪽으로 밀려난다.' },
	{ year: -59, en: 'Haeburu moves his court east to Gaseopwon: Eastern Buyeo.', ko: '해부루가 가섭원으로 옮겨 동부여를 세운다.' },
	{ year: -57, en: 'Saro, the later Silla, is founded (by its own count).', ko: '사로국, 훗날의 신라가 선다.' },
	{ year: -37, en: 'Jumong founds Goguryeo at Buyeo.', ko: '주몽이 졸본부여에서 고구려를 세운다.' },
	{ year: -18, en: 'Onjo founds Baekje at Wirye.', ko: '온조가 위례에서 백제를 세운다.' },
	{ year: 22, en: 'Goguryeo kills King Daeso. His brother founds Galsa Buyeo.', ko: '고구려가 대소왕을 죽이고, 그 아우가 갈사부여를 세운다.' },
	{ year: 42, en: 'Suro founds Gumgwan Gaya; Byunhan becomes the Gaya league.', ko: '수로가 금관가야를 세운다.' },
	{ year: 56, en: 'Goguryeo swallows East Okjeo.', ko: '고구려가 동옥저를 병합한다.' },
	{ year: 68, en: 'Galsa Buyeo surrenders to Goguryeo.', ko: '갈사부여가 고구려에 항복한다.' },
	{ year: 249, en: 'Silla takes Sabul; Jinhan is nearly gone.', ko: '신라가 사벌국을 병합한다.' },
	{ year: 311, en: 'Goguryeo takes the Amnok mouth.', ko: '고구려가 서안평을 차지한다.' },
	{ year: 313, en: 'Goguryeo ends Lelang. Daifang falls a year later.', ko: '고구려가 낙랑을 몰아낸다.' },
	{ year: 346, en: 'Former Yan sacks Buyeo.', ko: '전연이 부여를 친다.' },
	{ year: 369, en: 'Baekje subdues the last Mahan statelets.', ko: '백제가 마한의 남은 나라들을 복속한다.' },
	{ year: 396, en: 'Gwanggeto takes fifty-eight Baekje fortresses.', ko: '광개토왕이 백제의 58성을 빼앗는다.' },
	{ year: 404, en: 'Goguryeo seizes Liaodong.', ko: '고구려가 요동을 차지한다.' },
	{ year: 410, en: 'Gwanggeto takes Eastern Buyeo.', ko: '광개토왕이 동부여를 정벌한다.' },
	{ year: 475, en: 'The River Palace falls. Baekje flees south to Ungjin.', ko: '한성 함락. 백제가 웅진으로 옮긴다.' },
	{ year: 494, en: 'Buyeo submits to Goguryeo.', ko: '부여가 고구려에 항복한다.' },
	{ year: 512, en: 'Silla takes Usan.', ko: '신라가 우산국을 복속한다.' },
	{ year: 100, en: 'Yamato stands in the Kinai — the kingship that will take the islands.', ko: '야마토가 기내에 선다.' },
	{ year: 400, en: 'Yamato takes the Kanto; the Emishi frontier moves north.', ko: '야마토가 간토를 잡고 에미시 변경이 북으로 밀린다.' },
	{ year: 528, en: 'Yamato takes the last Kumaso roofs in southern Kyushu.', ko: '야마토가 규슈 남쪽의 구마소를 평정한다.' },
	{ year: 532, en: 'Gumgwan Gaya surrenders to Silla.', ko: '금관가야가 신라에 항복한다.' },
	{ year: 658, en: 'Abe no Hirafu sails north; southern Mutsu tips toward Yamato.', ko: '아베노 히라후가 북으로 항해한다. 무쓰 남쪽이 야마토 쪽으로 기운다.' },
	{ year: 721, en: 'Yamato breaks the Hayato; Osumi takes the court colour.', ko: '야마토가 하야토를 평정하고 오스미가 조정 색을 입는다.' },
	{ year: 551, en: 'Baekje and Silla take back the Han river.', ko: '백제와 신라가 한강을 되찾는다.' },
	{ year: 553, en: 'Silla turns on Baekje and keeps the Han river.', ko: '신라가 백제의 한강 하류를 빼앗는다.' },
	{ year: 562, en: 'Degaya falls. Gaya is gone.', ko: '대가야 멸망.' },
	{ year: 568, en: 'Jinhung raises his steles at Hwangcho and Maun passes.', ko: '진흥왕이 황초령비와 마운령비를 세운다.' },
	{ year: 603, en: 'Goguryeo takes back the northeast coast.', ko: '고구려가 동북 해안을 되찾는다.' },
	{ year: 629, en: 'Silla takes Nangbi.', ko: '신라가 낭비성을 빼앗는다.' },
	{ year: 631, en: 'Goguryeo begins the Western Wall after the Sui wars.', ko: '고구려가 천리장성을 쌓기 시작한다.' },
	{ year: 641, en: 'The Western Wall stands, a thousand li from Buyeo Fortress to the sea.', ko: '천리장성이 부여성에서 바다까지 완성된다.' },
	{ year: 642, en: 'Daeya falls to Baekje.', ko: '대야성이 백제에 떨어진다.' },
	{ year: 660, en: 'Sabi falls. Baekje is gone; the West holds its ground.', ko: '사비 함락. 백제 멸망.' },
	{ year: 663, en: 'White River. The restoration ends.', ko: '백강 전투. 부흥군이 무너진다.' },
	{ year: 668, en: 'Pyongyang falls. Goguryeo is gone.', ko: '평양 함락. 고구려 멸망.' },
	{ year: 670, en: 'The court takes a new name in its letter to Chang’an: Japan.', ko: '조정이 장안에 보내는 글에서 새 이름을 쓴다. 일본.' },
	{ year: 671, en: 'Silla takes Sabi from the West.', ko: '신라가 사비를 차지한다.' },
	{ year: 676, en: 'Final Ford. The West pulls back to Liaodong.', ko: '기벌포 전투. 서국이 요동으로 물러난다.' },
	{ year: 698, en: 'Dae Jo-yeong founds Balhae.', ko: '대조영이 발해를 세운다.' },
	{ year: 720, en: 'Balhae takes the old Goguryeo north and Buyeo’s plain.', ko: '발해가 옛 고구려 북방과 부여 땅을 차지한다.' },
	{ year: 735, en: 'The West grants Silla everything south of the Daedong.', ko: '서국이 대동강 이남을 신라 땅으로 인정한다.' }
];

/** A kingdom at its height: drawn as a coloured mark under the slider. */
export interface BorderPeak {
	polity: PolityId;
	year: number;
	en: string;
	ko: string;
}

export const BORDER_PEAKS: BorderPeak[] = [
	{ polity: 'gojoseon', year: -120, en: 'Old Joseon at its height: Ugu bars the southern states from the Han.', ko: '고조선의 전성기: 우거왕이 남쪽 나라들과 한의 길을 막는다.' },
	{ polity: 'buyeo', year: 49, en: 'Buyeo at its height: the Han’s favoured ally in the north.', ko: '부여의 전성기: 한의 총애를 받는 북방의 동맹.' },
	{ polity: 'baekje', year: 371, en: 'Baekje at its height: at Pyongyang, Goguryeo’s king dies by a stray arrow.', ko: '백제의 전성기: 평양에서 고구려 왕이 흐르는 화살에 맞는다.' },
	{ polity: 'gaya', year: 399, en: 'Gaya at its height: the iron league, a year before Gwanggeto marches south.', ko: '가야의 전성기: 광개토왕이 남하하기 한 해 전의 철의 연맹.' },
	{ polity: 'goguryeo', year: 475, en: 'Goguryeo at its height: Jangsu takes the River Palace.', ko: '고구려의 전성기: 장수왕이 한성을 빼앗는다.' },
	{ polity: 'silla', year: 568, en: 'Silla at its height under Jinhung: the Han river and the east coast to Maun Pass.', ko: '신라의 전성기: 진흥왕이 한강 유역과 마운령까지의 동해안을 차지한다.' },
	{ polity: 'china', year: 661, en: 'Tang’s farthest west: for a few years the roads past the Pamirs answer to Anxi. The steppe is already Anbei’s. Goguryeo is still standing.', ko: '당의 가장 먼 서쪽. 몇 해 동안 파미르 너머의 길이 안서에 대답한다. 초원은 이미 안북 것이고, 고구려는 아직 서 있다.' },
	{ polity: 'wa', year: 721, en: 'Japan at its height: the Hayato are broken and Osumi takes the court colour.', ko: '일본의 전성기: 하야토가 평정되고 오스미가 조정 색을 입는다.' },
	{ polity: 'balhae', year: 762, en: 'Balhae at its height: the West calls it a kingdom.', ko: '발해의 전성기: 서국이 발해를 나라로 부른다.' }
];

/**
 * Hegemonies, in the Chinese sense of 패권: one senior state among equals, for a
 * reign or two. The living war is not one of them.
 * 576–642 is the Three Kingdoms period. 642–676 is the Unification Wars.
 */
export interface BorderEra {
	from: number;
	to: number;
	en: string;
	ko: string;
	/** Chip colour on the timeline. */
	color: string;
	/** During a hegemony, this crown is the senior and may glow. */
	senior?: PolityId;
}

export const BORDER_ERAS: BorderEra[] = [
	/** Gojoseon on this map, until the Han take it in 108 BCE. */
	{ from: -400, to: -108, en: 'Early Age', ko: '상고', color: '#2f7f8f' },
	/** Lelang’s founding through the proto kingdoms, up to Geunchogo’s hegemony. */
	{ from: -108, to: 346, en: 'Proto-Samhan', ko: '원삼국', color: '#c9a25f' },
	/** Geunchogo 346–375; the chip runs to Gwanggaeto so the bar has no hole. */
	{ from: 346, to: 391, en: 'Baekje hegemony', ko: '백제 패권', color: '#ffb900', senior: 'baekje' },
	/** Gwanggaeto’s accession through Jangsu’s death. */
	{ from: 391, to: 491, en: 'Goguryeo hegemony', ko: '고구려 패권', color: '#e94949', senior: 'goguryeo' },
	/** The peer kingdoms, from Jangsu’s death until Jinheung takes the Han. */
	{ from: 491, to: 551, en: 'Three Kingdoms', ko: '삼국 시대', color: '#d4a24a' },
	/** Jinheung: the Han river in 551 through his death in 576. */
	{ from: 551, to: 576, en: 'Silla hegemony', ko: '신라 패권', color: '#3e79e4', senior: 'silla' },
	/** Peers again, until Daeya falls and the last war starts. */
	{ from: 576, to: 642, en: 'Three Kingdoms', ko: '삼국 시대', color: '#d4a24a' },
	/** Daeya and Yeon’s coup through Final Ford. */
	{ from: 642, to: 676, en: 'Unification Wars', ko: '통일 전쟁', color: '#c41e3a' },
	/** After the war. Balhae is founded in 698, inside this age. The map ends at 800. */
	{ from: 676, to: 800, en: 'Northern and Southern', ko: '남북국', color: '#6b8e23' }
];

/** Hegemonies and the peer ages after them share one visual width on the timeline. */
export const EQUAL_ERAS = new Set([
	'Baekje hegemony',
	'Goguryeo hegemony',
	'Silla hegemony',
	'Three Kingdoms',
	'Unification Wars',
	'Northern and Southern'
]);

/** The senior crown during a hegemony, or null in a peer age. */
export function hegemonAt(year: number): PolityId | null {
	return eraAt(year)?.senior ?? null;
}

/** The era a year falls in. The boundary year belongs to the era that starts there. */
export function eraAt(year: number): BorderEra | null {
	let hit: BorderEra | null = null;
	for (const e of BORDER_ERAS) {
		const end = e.to === BORDER_ERAS[BORDER_ERAS.length - 1].to ? e.to + 1 : e.to;
		if (year >= e.from && year < end) hit = e;
	}
	return hit;
}

/** The latest event at or before `year`. */
export function eventAt(year: number): BorderEvent | null {
	return BORDER_EVENTS.findLast((e) => e.year <= year) ?? null;
}

/* ——————————————————————— geometry ——————————————————————— */

type Pt = [number, number];

/**
 * Real lon/lat → sheet units. A quadratic fit through 22 places whose real
 * positions are known (the sheet's projection bends in the north, which an
 * affine fit misses by ~13 units); residuals are under 5 units everywhere.
 */
const PX = [308.0639, 41.7308, 0.6657, -0.1233, -0.1548, 0.1738];
const PY = [507.4412, -0.6506, -51.5349, -0.1756, -0.0447, 0.1223];

export function project(lon: number, lat: number): Pt {
	const u = lon - 127;
	const v = lat - 38;
	const f = [1, u, v, u * u, u * v, v * v];
	return [f.reduce((s, t, i) => s + t * PX[i], 0), f.reduce((s, t, i) => s + t * PY[i], 0)];
}

/** Northern tribes standing in `year`, as label points. No land, no border. */
export function tribesAt(year: number) {
	return NORTHERN_TRIBES.filter((t) => year >= t.from && year < t.to).map((t) => {
		const [x, y] = project(t.lon, t.lat);
		return { ...t, x, y };
	});
}

const DEFAULT_REACH = 44;
/** How softly neighbouring reaches fuse: frontiers melt into one line instead of meeting in notches. */
const FRONTIER_BLEND = 9;
/** The frontier's wander in sheet units: a drawn edge, not a compass arc. */
const FRONTIER_WOBBLE = 3.5;
/** Sample spacing along a cell edge while tracing the frontier. */
const FRONTIER_STEP = 5;

/** A smooth, deterministic wobble in −1…1 (skewed sines). */
function wobble(x: number, y: number): number {
	return (
		Math.sin(x * 0.083 + Math.sin(y * 0.051) * 1.7) * 0.55 +
		Math.sin(y * 0.097 - x * 0.041 + 1.3) * 0.3 +
		Math.sin((x + y) * 0.173 + 2.1) * 0.15
	);
}

/**
 * Negative on a realm's land, positive beyond it: a soft union (log-sum-exp) of the
 * nearby sites' reach circles, so overlapping reaches fuse into one smooth frontier.
 */
function landField(p: Pt, pts: Pt[], reach: number[], near: number[]): number {
	let sum = 0;
	for (const j of near) {
		const d = Math.hypot(p[0] - pts[j][0], p[1] - pts[j][1]) - reach[j];
		if (d < FRONTIER_BLEND * 6) sum += Math.exp(-d / FRONTIER_BLEND);
	}
	const soft = sum > 0 ? -FRONTIER_BLEND * Math.log(sum) : FRONTIER_BLEND * 6;
	return soft + FRONTIER_WOBBLE * wobble(p[0], p[1]);
}

/** Where the field crosses zero between a and b (one inside, one outside). */
function crossing(a: Pt, b: Pt, field: (p: Pt) => number): Pt {
	let lo = a;
	let hi = b;
	const loIn = field(a) <= 0;
	for (let k = 0; k < 9; k++) {
		const m: Pt = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2];
		if (field(m) <= 0 === loIn) lo = m;
		else hi = m;
	}
	return [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2];
}

/** A point of a cut cell: `e` is the Voronoi edge it lies on, −1 on the frontier. */
type CutPoint = { p: Pt; e: number };

/** A convex Voronoi cell cut to the land field: edge stretches inside stay straight, the rest follows the frontier. */
function cutCell(site: Pt, ring: Pt[], reach: number, field: (p: Pt) => number): CutPoint[] {
	const out: CutPoint[] = [];
	/** Inside this radius the site's own reach already holds the land, wobble and all. */
	const sure = reach - FRONTIER_WOBBLE - 0.5;
	const held = (p: Pt) => Math.hypot(p[0] - site[0], p[1] - site[1]) < sure;
	ring.forEach((a, e) => {
		const b = ring[(e + 1) % ring.length];
		if (held(a) && held(b)) return void out.push({ p: a, e });
		const m = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / FRONTIER_STEP));
		const at = (t: number): Pt => [a[0] + ((b[0] - a[0]) * t) / m, a[1] + ((b[1] - a[1]) * t) / m];
		let p = a;
		let pIn = field(a) <= 0;
		if (pIn) out.push({ p: a, e });
		for (let t = 1; t <= m; t++) {
			const q = at(t);
			const qIn = field(q) <= 0;
			if (pIn !== qIn) out.push({ p: crossing(p, q, field), e });
			if (!qIn) out.push({ p: crossing(site, q, field), e: -1 });
			p = q;
			pIn = qIn;
		}
	});
	return out;
}

/** A cut cell's sides: each straight Voronoi stretch with the site across it, each frontier run as one polyline (−1). */
function cellEdges(cell: CutPoint[], across: number[], fmt: (p: Pt) => string): { seg: string; across: number }[] {
	const out: { seg: string; across: number }[] = [];
	let run: Pt[] = [];
	const flush = () => {
		if (run.length > 1) out.push({ seg: `M${run.map(fmt).join('L')}`, across: -1 });
		run = [];
	};
	cell.forEach((x, k) => {
		const y = cell[(k + 1) % cell.length];
		if (x.e >= 0 && y.e >= 0) {
			flush();
			out.push({ seg: `M${fmt(x.p)}L${fmt(y.p)}`, across: across[x.e] });
		} else {
			if (!run.length) run.push(x.p);
			run.push(y.p);
		}
	});
	flush();
	return out;
}

export interface BorderSite {
	id: string;
	name: string;
	x: number;
	y: number;
	groups?: [number, string | null][];
	league?: GayaLeague;
	h: Hold[];
	/** how far the site's land reaches from it, in sheet units */
	r: number;
	/** the site's land: its Voronoi cell inside its reach, as an SVG path */
	d: string;
	/** Delaunay neighbours whose reaches overlap this one */
	near: number[];
	/** the cell's edges, each with the site across it (−1 along the frontier) */
	edges: { seg: string; across: number }[];
}

/** The neighbour whose bisector the segment a–b lies on, or −1 off every neighbour (the frontier). */
function acrossEdge(i: number, a: Pt, b: Pt, pts: Pt[], neighbours: number[]): number {
	const gap = (p: Pt, j: number) =>
		Math.abs(Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]) - Math.hypot(p[0] - pts[j][0], p[1] - pts[j][1]));
	return neighbours.find((j) => gap(a, j) < 0.5 && gap(b, j) < 0.5) ?? -1;
}

/** Sheet-unit spacing, bank offset and reach of the paired sites that pin a frontier to a river. */
const BANK_STEP = 10;
const BANK_OFFSET = 9;
const BANK_REACH = 18;

/**
 * Mirrored site pairs along a river's course (south of `north`): the west bank takes one
 * holder history, the east bank another, so the Voronoi seam between them is the river.
 */
function riverBanks(river: string, [south, north]: [number, number], west: Hold[], east: Hold[]): SiteDef[] {
	const course = (riversNe.book as unknown as Record<string, [number, number][]>)[river]
		.filter(([, lat]) => lat > south && lat <= north)
		.map(([lon, lat]) => project(lon, lat));
	const samples: Pt[] = [course[0]];
	let run = 0;
	for (let k = 1; k < course.length; k++) {
		run += Math.hypot(course[k][0] - course[k - 1][0], course[k][1] - course[k - 1][1]);
		if (run >= BANK_STEP) {
			samples.push(course[k]);
			run = 0;
		}
	}
	return samples.flatMap((p, k) => {
		const a = samples[Math.max(0, k - 1)];
		const b = samples[Math.min(samples.length - 1, k + 1)];
		const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
		let n: Pt = [(a[1] - b[1]) / len, (b[0] - a[0]) / len];
		if (n[0] > 0) n = [-n[0], -n[1]];
		const side = (s: number, h: Hold[], tag: string) => ({
			id: `${river}_${south}_${tag}_${k}`,
			name: `${river[0].toUpperCase()}${river.slice(1)} River`,
			lon: 0,
			lat: 0,
			at: [p[0] + n[0] * BANK_OFFSET * s, p[1] + n[1] * BANK_OFFSET * s] as Pt,
			r: BANK_REACH,
			h
		});
		return [side(1, west, 'w'), side(-1, east, 'e')];
	});
}

/** The lower Liao, Tieling to the sea: the line Tang and Goguryeo glare across. */
const LIAODONG_HOLD: Hold[] = [[-999, 'gojoseon', '?'], [-282, 'china'], [404, 'goguryeo'], [668, 'china']];
/** The upper Liao, Tieling to its head: Goguryeo's Western Wall faces the Khitan steppe, which no realm paints. */
const UPPER_LIAO_HOLD: Hold[] = [[-999, null], [-200, 'buyeo', '?'], [346, 'china', '?'], [404, 'goguryeo'], [668, 'china'], [676, null], [720, 'balhae', '?']];
const ALL_SITES: SiteDef[] = [
	...SITE_DEFS,
	...riverBanks('liao', [0, 42.35], [[-999, null], [-282, 'china']], LIAODONG_HOLD),
	...riverBanks('liao', [42.35, 90], [[-999, null]], UPPER_LIAO_HOLD)
];

function buildSites(): BorderSite[] {
	const pts = ALL_SITES.map((s) => s.at ?? project(s.lon, s.lat));
	const delaunay = Delaunay.from(pts);
	/** East edge clears northern Honshu; the old 795 cut Kanto and Mutsu off the map. */
	const voronoi = delaunay.voronoi([-200, -200, 1100, 1100]);
	const reach = ALL_SITES.map((s) => s.r ?? DEFAULT_REACH);
	const fmt = ([x, y]: Pt) => `${x.toFixed(1)},${y.toFixed(1)}`;
	/** The sites whose reach can still shape the frontier around each site. */
	const shaping = pts.map((p, i) =>
		pts.flatMap((q, j) => (Math.hypot(p[0] - q[0], p[1] - q[1]) < reach[i] + reach[j] + FRONTIER_BLEND * 8 ? [j] : []))
	);
	return ALL_SITES.map((s, i) => {
		const ring = (voronoi.cellPolygon(i) as Pt[]).slice(0, -1);
		const neighbours = [...delaunay.neighbors(i)];
		const cell = cutCell(pts[i], ring, reach[i], (p) => landField(p, pts, reach, shaping[i]));
		const d = cell.length ? `M${cell.map((c) => fmt(c.p)).join('L')}Z` : '';
		const near = neighbours.filter(
			(j) => Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) < reach[i] + reach[j]
		);
		const across = ring.map((a, k) => acrossEdge(i, a, ring[(k + 1) % ring.length], pts, neighbours));
		const edges = cellEdges(cell, across, fmt);
		return { id: s.id, name: s.name, x: pts[i][0], y: pts[i][1], groups: s.groups, league: s.league, h: s.h, r: reach[i], d, near, edges };
	});
}

export const BORDER_SITES: BorderSite[] = buildSites();

export interface Holding {
	polity: PolityId | null;
	disputed: boolean;
}

export function holderAt(site: BorderSite, year: number): Holding {
	const row = site.h.findLast(([from]) => from <= year);
	return { polity: row?.[1] ?? null, disputed: row?.[2] === '?' };
}

/** The colour a site's land paints: its holder's, its Gaya statelet's, or its Han commandery's. */
export function siteColor(
	site: BorderSite,
	hold: Holding,
	year: number,
	detail = true,
	mode: MapColorMode = 'near'
): string {
	if (!hold.polity) return 'transparent';
	if (!detail) return mapColor(hold.polity, mode);
	if (hold.polity === 'gaya' && site.league) return GAYA_LEAGUES[site.league].color;
	if (hold.polity === 'china') {
		const cmd = commanderyOf(site, year);
		if (cmd && COMMANDERIES[cmd]) return COMMANDERIES[cmd].color;
		return mapColor('china', mode);
	}
	return mapColor(hold.polity, mode);
}

/**
 * Years a holding actually changes. The timeline scrubs every frame, but the
 * wash only needs a new paint when one of these is crossed.
 */
const CHANGE_YEARS = [
	...new Set([
		...SITE_DEFS.flatMap((s) => s.h.map(([from]) => from)),
		...SITE_DEFS.flatMap((s) => (s.groups ?? []).map(([from]) => from)),
		404
	])
].sort(
	(a, b) => a - b
);

/** The latest holding-change year at or before `year`. */
export function settledYear(year: number): number {
	let lo = 0;
	let hi = CHANGE_YEARS.length - 1;
	let ans = CHANGE_YEARS[0];
	while (lo <= hi) {
		const mid = (lo + hi) >> 1;
		if (CHANGE_YEARS[mid] <= year) {
			ans = CHANGE_YEARS[mid];
			lo = mid + 1;
		} else hi = mid - 1;
	}
	return ans;
}

const holdingsCache = new Map<number, Holding[]>();

/** Who holds each site, cached by the settled year so a scrub does not rebuild it. */
export function holdingsAt(year: number): Holding[] {
	const settled = settledYear(year);
	let hit = holdingsCache.get(settled);
	if (!hit) {
		hit = BORDER_SITES.map((s) => holderAt(s, settled));
		holdingsCache.set(settled, hit);
	}
	return hit;
}

/** Leagues of statelets rather than one crown: their members keep a seam between them. */
const CONFEDERACIES = new Set<PolityId>(['gaya', 'mahan', 'jinhan', 'byeonhan', 'jin']);

export interface BorderLines {
	/** where the holder changes: every realm's outline, one path per colour, tinted like the realm */
	borders: { color: string; d: string; heavy?: boolean; thick?: boolean }[];
	/** between members of one confederacy (Gaya statelets, the Samhan leagues) */
	seams: string;
}

const linesCache = new Map<string, BorderLines>();

/**
 * Realm outlines and league seams for `year`. Every realm draws its own outline in its
 * own colour, so a shared border shows both neighbours' tints side by side; a Han
 * commandery counts as a realm of its own. With `detail` off, each kingdom is one colour
 * and the statelet seams go away. On the Samhan frame (`near`), China and Wa get a
 * thicker outline so the dimmed foreign wash still reads as a border.
 */
export function borderLinesAt(year: number, detail = true, mode: MapColorMode = 'near'): BorderLines {
	const settled = settledYear(year);
	const key = `${settled}:${detail ? 1 : 0}:${mode}`;
	const cached = linesCache.get(key);
	if (cached) return cached;
	const holdings = holdingsAt(settled);
	const realm = (i: number) => {
		const p = holdings[i].polity;
		if (!p) return null;
		if (!detail) return p;
		return p === 'china' ? `china:${commanderyAt(BORDER_SITES[i], settled) ?? ''}` : p;
	};
	const byColor = new Map<string, { color: string; heavy: boolean; thick: boolean; segs: string[] }>();
	const seams: string[] = [];
	BORDER_SITES.forEach((site, i) => {
		const own = realm(i);
		if (!own) return;
		const polity = holdings[i].polity!;
		const cmd = detail && polity === 'china' ? commanderyOf(site, settled) : null;
		const color = siteColor(site, holdings[i], settled, detail, mode);
		const outline = cmd ? shadeColor(color, -0.48) : detail && site.league && polity === 'gaya' ? mapColor('gaya', mode) : color;
		const thick = mode === 'near' && FOREIGN.has(polity) && !cmd;
		for (const { seg, across } of site.edges) {
			const other = across < 0 ? null : realm(across);
			/** The reach-cap of ordinary Chinese ground is a circle on the wash, not a frontier. */
			if (!cmd && polity === 'china' && across < 0) continue;
			if (other !== own) {
				const key = `${cmd ? 1 : 0}:${thick ? 1 : 0}:${outline}`;
				const row = byColor.get(key) ?? { color: outline, heavy: !!cmd, thick, segs: [] };
				row.segs.push(seg);
				byColor.set(key, row);
			} else if (detail && i < across && CONFEDERACIES.has(polity)) {
				const sameLeague = polity === 'gaya' && site.league === BORDER_SITES[across].league;
				if (!sameLeague) seams.push(seg);
			}
		}
	});
	const hit: BorderLines = {
		borders: [...byColor.values()].map((b) => ({
			color: b.color,
			d: b.segs.join(''),
			heavy: b.heavy || undefined,
			thick: b.thick || undefined
		})),
		seams: seams.join('')
	};
	linesCache.set(key, hit);
	return hit;
}

const siteCache = new Map<string, number>();

/** The site whose land covers sheet point (x, y): its nearest site, if within that site's reach; −1 on open ground. */
function siteAt(x: number, y: number): number {
	const key = `${x},${y}`;
	let hit = siteCache.get(key);
	if (hit === undefined) {
		let best = -1;
		let bd = Infinity;
		BORDER_SITES.forEach((s, i) => {
			const d = Math.hypot(s.x - x, s.y - y);
			if (d < bd) {
				bd = d;
				best = i;
			}
		});
		hit = best >= 0 && bd <= BORDER_SITES[best].r ? best : -1;
		siteCache.set(key, hit);
	}
	return hit;
}

/** Who holds the ground at sheet point (x, y) in `year`; null off every site's land. */
export function placeHolding(x: number, y: number, year: number): Holding | null {
	const i = siteAt(x, y);
	return i < 0 ? null : holdingsAt(year)[i];
}

/** After Liaodong falls the Han commandery names are history. Ungjin and Andong come later. */
const COMMANDERY_END = 404;

/**
 * The commandery a site belongs to in `year`, if China holds it.
 * The four Han commanderies (and Daifang) come from each site's `groups`.
 * Ungjin (660–671) and Andong (668–755) are the Tang seats: a site that
 * *becomes* Chinese in those years, not land China already held.
 */
export function commanderyOf(site: BorderSite, year: number): string | null {
	const named = site.groups?.findLast(([from]) => from <= year)?.[1] ?? null;
	if (named && year < COMMANDERY_END && COMMANDERIES[named] && named !== 'Ungjin' && named !== 'Andong') return named;
	const row = site.h.findLast(([from]) => from <= year);
	if (row?.[1] !== 'china') return null;
	if (row[0] >= 660 && row[0] < 668 && year < 672) return 'Ungjin';
	if (row[0] >= 668 && row[0] < 756 && year < 756) return 'Andong';
	return null;
}

/** @deprecated use commanderyOf */
function commanderyAt(site: BorderSite, year: number): string | null {
	return commanderyOf(site, year);
}

export interface BorderRealm {
	key: string;
	polity: PolityId;
	/** paint colour of the label (the commandery's own shade inside the Han frontier) */
	color: string;
	label: string;
	korean: string;
	x: number;
	y: number;
	size: number;
	/** a commandery inside the Chinese frontier, or a small outlier: drawn smaller */
	minor: boolean;
}

/** A run this small only gets a label when it is the polity's only ground. */
const MINOR_RUN = 3;

const centre = (sites: number[]) => ({
	x: sites.reduce((s, i) => s + BORDER_SITES[i].x, 0) / sites.length,
	y: sites.reduce((s, i) => s + BORDER_SITES[i].y, 0) / sites.length
});

/**
 * Each connected run of same-holder sites is one realm, labelled at its centre.
 * A polity's small detached runs (an island, a lone fort) stay unlabelled, and
 * commanderies inside the Han frontier get their own small names.
 */
export function realmsAt(year: number, holdings: Holding[], detail = true): BorderRealm[] {
	const runs: { polity: PolityId; sites: number[] }[] = [];
	const seen = new Set<number>();
	BORDER_SITES.forEach((_, start) => {
		const polity = holdings[start].polity;
		if (!polity || seen.has(start)) return;
		const run: number[] = [];
		const queue = [start];
		seen.add(start);
		while (queue.length) {
			const i = queue.pop()!;
			run.push(i);
			for (const j of BORDER_SITES[i].near) {
				if (!seen.has(j) && holdings[j].polity === polity) {
					seen.add(j);
					queue.push(j);
				}
			}
		}
		runs.push({ polity, sites: run });
	});

	const largest = new Map<PolityId, number>();
	for (const r of runs) largest.set(r.polity, Math.max(largest.get(r.polity) ?? 0, r.sites.length));

	const realms: BorderRealm[] = [];
	const named = new Set<PolityId>();
	for (const { polity, sites } of runs) {
		const isLargest = sites.length === largest.get(polity) && !named.has(polity);
		if (sites.length < MINOR_RUN && !isLargest) continue;
		/** One name for the kingship. The island tribes keep their epithet pills. */
		if ((polity === 'wa' || polity === 'emishi' || polity === 'kumaso' || polity === 'hayato') && !isLargest) continue;
		if (polity === 'emishi' || polity === 'kumaso' || polity === 'hayato') continue;
		named.add(polity);
		const name = polityName(polity, year);
		/** A commandery already has its own name. The country label sits on the ground that is not one. */
		const plain = sites.filter((i) => holdings[i].polity !== 'china' || !commanderyOf(BORDER_SITES[i], year));
		if (!plain.length) continue;
		/**
		 * When a commandery shares the run, put the country name on the western
		 * ground it still holds, and keep that name on the sheet.
		 */
		const onSheet = (i: number) => {
			const s = BORDER_SITES[i];
			return s.x >= MAP_TERRAIN.x && s.x <= MAP_TERRAIN.x + MAP_TERRAIN.w && s.y >= MAP_TERRAIN.y && s.y <= MAP_TERRAIN.y + MAP_TERRAIN.h;
		};
		const pool = plain.filter(onSheet);
		const pick = pool.length ? pool : plain;
		const kinai = polity === 'wa' ? plain.find((i) => BORDER_SITES[i].id === 'yamato_kinai') : undefined;
		const anchor = kinai != null
			? [kinai]
			: plain.length < sites.length
				? [pick.reduce((a, b) => (BORDER_SITES[a].x <= BORDER_SITES[b].x ? a : b))]
				: plain;
		realms.push({
			key: `${polity}:${BORDER_SITES[anchor[0]].id}`,
			polity,
			color: mapColor(polity),
			...name,
			...centre(anchor),
			size: plain.length,
			minor: plain.length < MINOR_RUN
		});
	}

	if (!detail) return realms;

	/* Commanderies are named wherever they sit, even cut off from the frontier (Xuantu in Okjeo). */
	const commanderies = new Map<string, number[]>();
	BORDER_SITES.forEach((site, i) => {
		const name = holdings[i].polity === 'china' ? commanderyAt(site, year) : null;
		if (name) commanderies.set(name, [...(commanderies.get(name) ?? []), i]);
	});
	for (const [name, members] of commanderies) {
		realms.push({
			key: `china:${name}`,
			polity: 'china',
			color: COMMANDERIES[name]?.color ?? mapColor('china'),
			label: name,
			korean: COMMANDERIES[name]?.korean ?? name,
			...centre(members),
			size: members.length,
			minor: true
		});
	}
	return realms;
}
