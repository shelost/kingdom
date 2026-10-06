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

export type PolityId =
	| 'gojoseon'
	| 'china'
	| 'buyeo'
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
	| 'balhae';

export const POLITIES: Record<PolityId, { label: string; korean: string; color: string }> = {
	gojoseon: { label: 'Old Joseon', korean: '고조선', color: '#2f7f8f' },
	china: { label: 'Han', korean: '한', color: '#b45309' },
	buyeo: { label: 'Buyeo', korean: '부여', color: '#9b4a5a' },
	goguryeo: { label: 'Goguryeo', korean: '고구려', color: '#e94949' },
	baekje: { label: 'Baekje', korean: '백제', color: '#ffb900' },
	silla: { label: 'Silla', korean: '신라', color: '#3e79e4' },
	gaya: { label: 'Gaya', korean: '가야', color: '#8b5cf6' },
	mahan: { label: 'Mahan', korean: '마한', color: '#c9a66b' },
	jinhan: { label: 'Jinhan', korean: '진한', color: '#7fa7c9' },
	byeonhan: { label: 'Byeonhan', korean: '변한', color: '#b9a3e8' },
	okjeo: { label: 'Okjeo', korean: '옥저', color: '#6e9f6a' },
	dongye: { label: 'Dongye', korean: '동예', color: '#4e9e8e' },
	tamla: { label: 'Tamla', korean: '탐라', color: '#f97316' },
	usan: { label: 'Usan', korean: '우산국', color: '#5fa8a0' },
	wa: { label: 'Wa', korean: '왜', color: '#ec4899' },
	balhae: { label: 'Balhae', korean: '발해', color: '#6b8e23' }
};

/** The Chinese frontier changes dynasty, not colour. */
const CHINA_ERAS: [number, string, string][] = [
	[-999, 'Han', '한'],
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

/** Wa starts calling itself Nihon with the Taihō code. */
const JAPAN_FROM = 701;

export function polityName(id: PolityId, year: number): { label: string; korean: string } {
	if (id === 'wa' && year >= JAPAN_FROM) return { label: 'Japan', korean: '일본' };
	if (id !== 'china') return POLITIES[id];
	const era = CHINA_ERAS.findLast(([from]) => from <= year) ?? CHINA_ERAS[0];
	return { label: era[1], korean: era[2] };
}

export const YEAR_MIN = -200;
export const YEAR_MAX = 800;

/** The span the chronicle itself covers, from Queen Seondeok's crowning to Gibeolpo. */
export const STORY_SPAN = { from: 632, to: 676 };

export function formatYear(year: number): string {
	return year < 0 ? `${-year} BCE` : `${year} CE`;
}

/** [from year, holder (null = nobody's), '?' when disputed] */
type Hold = [number, PolityId | null, '?'?];

interface SiteDef {
	id: string;
	name: string;
	lon: number;
	lat: number;
	/** reach in map units (~2 km each); default 44 */
	r?: number;
	/** dated commandery names while held by China ([from year, name or null]) */
	groups?: [number, string | null][];
	h: Hold[];
}

/** The settlement of 676 leaves the north to nobody the annals name until Balhae. */
const SITE_DEFS: SiteDef[] = [
	// ——— Liaoxi: always the Chinese side ———
	{ id: 'liucheng', name: 'Liucheng', lon: 120.45, lat: 41.57, r: 81, h: [[-999, 'china']] },
	{ id: 'jinzhou', name: 'Jinzhou', lon: 121.13, lat: 41.1, r: 62, h: [[-999, 'china']] },

	// ——— Liaodong: Chinese commanderies until Gwanggaeto, Goguryeo to 668, Tang after ———
	{
		id: 'xiangping',
		name: 'Yodong (Liaoyang)',
		lon: 123.17,
		lat: 41.27,
		r: 59,
		h: [[-999, 'china'], [404, 'goguryeo'], [668, 'china']]
	},
	{ id: 'ansi', name: 'Ansi', lon: 122.69, lat: 40.82, h: [[-999, 'china'], [404, 'goguryeo'], [668, 'china']] },
	{ id: 'geonan', name: 'Geonan', lon: 122.35, lat: 40.4, h: [[-999, 'china'], [404, 'goguryeo'], [668, 'china']] },
	{
		id: 'bisa',
		name: 'Bisa',
		lon: 121.88,
		lat: 39.05,
		h: [[-999, 'china'], [404, 'goguryeo', '?'], [668, 'china']]
	},
	{ id: 'zhuanghe', name: 'Zhuanghe', lon: 122.96, lat: 39.7, h: [[-999, 'china'], [404, 'goguryeo', '?'], [668, 'china']] },
	{ id: 'gaemo', name: 'Gaemo', lon: 123.4, lat: 41.6, h: [[-999, 'china'], [404, 'goguryeo'], [668, 'china']] },
	{
		id: 'sinseong',
		name: 'New Fortress (Fushun)',
		lon: 123.95,
		lat: 41.88,
		groups: [[107, 'Xuantu']], h: [[-999, 'china'], [404, 'goguryeo'], [668, 'china']]
	},
	{
		id: 'xianping',
		name: 'Xi’anping (Yalu mouth)',
		lon: 124.38,
		lat: 40.12,
		h: [[-999, 'china'], [311, 'goguryeo'], [668, 'china'], [676, null]]
	},
	{
		id: 'kaiyuan',
		name: 'Kaiyuan',
		lon: 124.0,
		lat: 42.55,
		r: 59,
		h: [[-999, 'buyeo', '?'], [346, 'china', '?'], [404, 'goguryeo'], [668, 'china'], [676, null], [720, 'balhae', '?']]
	},

	// ——— Buyeo and the northern plain ———
	{
		id: 'buyeo_fort',
		name: 'Buyeo Fortress (Nong’an)',
		lon: 125.17,
		lat: 44.43,
		r: 76,
		h: [[-999, 'buyeo'], [494, 'goguryeo'], [668, null], [720, 'balhae', '?']]
	},
	{
		id: 'buyeo_jilin',
		name: 'Buyeo (Jilin)',
		lon: 126.55,
		lat: 43.85,
		r: 76,
		h: [[-999, 'buyeo'], [494, 'goguryeo'], [668, null], [720, 'balhae', '?']]
	},
	{
		id: 'liuhe',
		name: 'Liuhe',
		lon: 125.6,
		lat: 42.5,
		r: 59,
		h: [[-999, 'buyeo', '?'], [300, 'goguryeo', '?'], [668, null], [720, 'balhae', '?']]
	},
	{
		id: 'dunhua',
		name: 'Dongmo Mountain (Dunhua)',
		lon: 128.23,
		lat: 43.37,
		r: 76,
		h: [[-999, null], [410, 'goguryeo', '?'], [668, null], [698, 'balhae']]
	},
	{
		id: 'yanji',
		name: 'North Okjeo (Yanji)',
		lon: 129.5,
		lat: 42.9,
		r: 62,
		h: [[-999, 'okjeo'], [56, 'goguryeo'], [668, null], [698, 'balhae', '?'], [720, 'balhae']]
	},
	{
		id: 'hunchun',
		name: 'Chaekseong (Hunchun)',
		lon: 130.36,
		lat: 42.86,
		r: 54,
		h: [[-999, 'okjeo'], [56, 'goguryeo'], [668, null], [698, 'balhae', '?'], [720, 'balhae']]
	},

	// ——— the Goguryeo heartland ———
	{
		id: 'jolbon',
		name: 'Jolbon (Huanren)',
		lon: 125.36,
		lat: 41.27,
		groups: [[-75, 'Xuantu']], h: [[-999, null], [-75, 'china', '?'], [-37, 'goguryeo'], [668, 'china'], [676, null], [720, 'balhae', '?']]
	},
	{
		id: 'gungnae',
		name: 'Gungnae (Ji’an)',
		lon: 126.19,
		lat: 41.13,
		h: [[-999, null], [-37, 'goguryeo'], [668, 'china'], [676, null], [720, 'balhae', '?']]
	},
	{
		id: 'tonghua',
		name: 'Tonghua',
		lon: 125.94,
		lat: 41.72,
		groups: [[-75, 'Xuantu']], h: [[-999, null], [-75, 'china', '?'], [-37, 'goguryeo'], [668, null], [720, 'balhae', '?']]
	},
	{ id: 'kanggye', name: 'Kanggye', lon: 126.6, lat: 40.97, h: [[-999, null], [-37, 'goguryeo'], [668, null], [720, 'balhae', '?']] },
	{
		id: 'changbai',
		name: 'Under Mount Paektu',
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
		groups: [[-108, 'Lelang']], h: [[-999, 'gojoseon'], [-108, 'china'], [313, 'goguryeo'], [668, 'silla', '?'], [735, 'silla']]
	},
	{
		id: 'anju',
		name: 'Anju (Salsu)',
		lon: 125.66,
		lat: 39.6,
		groups: [[-108, 'Lelang']], h: [[-999, 'gojoseon'], [-108, 'china'], [313, 'goguryeo'], [668, null]]
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
		groups: [[-108, 'Lelang'], [204, 'Daifang']], h: [[-999, 'gojoseon'], [-108, 'china'], [314, 'goguryeo'], [668, 'silla', '?'], [735, 'silla']]
	},
	{
		id: 'haeju',
		name: 'Haeju',
		lon: 125.7,
		lat: 38.04,
		groups: [[-108, 'Zhenfan'], [-82, 'Lelang'], [204, 'Daifang']], h: [[-999, 'gojoseon', '?'], [-108, 'china'], [314, 'goguryeo'], [369, 'baekje', '?'], [392, 'goguryeo'], [668, 'silla', '?'], [735, 'silla']]
	},
	{
		id: 'kaesong',
		name: 'Kaesong',
		lon: 126.55,
		lat: 37.97,
		groups: [[-108, 'Zhenfan']], h: [[-999, 'gojoseon', '?'], [-108, 'china', '?'], [-82, null], [250, 'baekje', '?'], [396, 'goguryeo'], [668, 'silla']]
	},

	// ——— the east coast: Okjeo and Dongye ———
	{
		id: 'hamhung',
		name: 'Okjeo (Hamhung)',
		lon: 127.53,
		lat: 39.92,
		r: 54,
		groups: [[-107, 'Xuantu']], h: [[-999, 'okjeo'], [-107, 'china'], [-75, 'okjeo'], [56, 'goguryeo'], [668, null], [730, 'balhae', '?']]
	},
	{
		id: 'bukcheong',
		name: 'Bukcheong',
		lon: 128.33,
		lat: 40.4,
		r: 54,
		groups: [[-107, 'Xuantu']], h: [[-999, 'okjeo'], [-107, 'china'], [-75, 'okjeo'], [56, 'goguryeo'], [668, null], [730, 'balhae', '?']]
	},
	{
		id: 'anbyeon',
		name: 'Biyeolhol (Anbyeon)',
		lon: 127.55,
		lat: 39.03,
		groups: [[-108, 'Lintun']], h: [[-999, 'dongye'], [-108, 'china', '?'], [-82, 'dongye'], [100, 'goguryeo', '?'], [556, 'silla'], [568, 'goguryeo'], [668, null], [721, 'silla', '?']]
	},
	{
		id: 'chuncheon',
		name: 'Chuncheon',
		lon: 127.73,
		lat: 37.88,
		h: [[-999, 'dongye', '?'], [400, 'goguryeo', '?'], [551, 'silla']]
	},
	{
		id: 'gangneung',
		name: 'Hasla (Gangneung)',
		lon: 128.9,
		lat: 37.75,
		groups: [[-108, 'Lintun']], h: [[-999, 'dongye'], [-108, 'china', '?'], [-82, 'dongye'], [400, 'goguryeo', '?'], [505, 'silla']]
	},
	{
		id: 'samcheok',
		name: 'Siljik (Samcheok)',
		lon: 129.17,
		lat: 37.45,
		h: [[-999, 'dongye'], [400, 'silla', '?'], [468, 'goguryeo'], [505, 'silla']]
	},
	{ id: 'uljin', name: 'Uljin', lon: 129.4, lat: 36.99, h: [[-999, 'dongye', '?'], [400, 'silla', '?']] },
	{ id: 'ulleung', name: 'Usan (Ulleung)', lon: 130.86, lat: 37.5, r: 12, h: [[-999, 'usan'], [512, 'silla']] },

	// ——— the Han river: Baekje’s cradle, everyone’s prize ———
	{
		id: 'wirye',
		name: 'Wirye / Hanseong',
		lon: 127.12,
		lat: 37.52,
		h: [[-999, 'mahan'], [-18, 'baekje'], [475, 'goguryeo'], [551, 'baekje'], [553, 'silla']]
	},
	{
		id: 'michuhol',
		name: 'Michuhol',
		lon: 126.7,
		lat: 37.45,
		h: [[-999, 'mahan'], [-18, 'baekje'], [475, 'goguryeo'], [551, 'baekje'], [553, 'silla']]
	},
	{
		id: 'paju',
		name: 'Chiljung (Paju)',
		lon: 126.78,
		lat: 37.76,
		h: [[-999, 'mahan', '?'], [-18, 'baekje'], [396, 'goguryeo'], [553, 'silla']]
	},
	{
		id: 'maeso',
		name: 'Maeso (Yeoncheon)',
		lon: 127.07,
		lat: 38.1,
		h: [[-999, null], [250, 'baekje', '?'], [396, 'goguryeo'], [668, 'silla']]
	},
	{
		id: 'danghang',
		name: 'Danghang (Hwaseong)',
		lon: 126.8,
		lat: 37.2,
		h: [[-999, 'mahan'], [250, 'baekje'], [475, 'goguryeo', '?'], [551, 'baekje'], [553, 'silla']]
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
		name: 'Jeokseong (Danyang)',
		lon: 128.37,
		lat: 36.98,
		h: [[-999, null], [470, 'goguryeo'], [550, 'silla']]
	},

	// ——— Mahan’s heartland, absorbed by Baekje ———
	{
		id: 'cheonan',
		name: 'Mokji (Cheonan)',
		lon: 127.15,
		lat: 36.8,
		h: [[-999, 'mahan'], [250, 'baekje', '?'], [660, 'china'], [671, 'silla']]
	},
	{
		id: 'cheongju',
		name: 'Nangbi (Cheongju)',
		lon: 127.49,
		lat: 36.64,
		h: [[-999, 'mahan'], [300, 'baekje', '?'], [475, 'goguryeo', '?'], [629, 'silla']]
	},
	{
		id: 'ungjin',
		name: 'Ungjin (Gongju)',
		lon: 127.12,
		lat: 36.46,
		h: [[-999, 'mahan'], [300, 'baekje'], [660, 'china'], [671, 'silla']]
	},
	{
		id: 'sabi',
		name: 'Sabi (Buyeo)',
		lon: 126.91,
		lat: 36.28,
		h: [[-999, 'mahan'], [300, 'baekje'], [660, 'china'], [671, 'silla']]
	},
	{
		id: 'juryu',
		name: 'Juryu',
		lon: 126.7,
		lat: 36.1,
		h: [[-999, 'mahan'], [300, 'baekje'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'daejeon',
		name: 'Daejeon',
		lon: 127.38,
		lat: 36.35,
		h: [[-999, 'mahan'], [300, 'baekje'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'iksan',
		name: 'Iksan',
		lon: 126.95,
		lat: 35.95,
		h: [[-999, 'mahan'], [369, 'baekje'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'jeonju',
		name: 'Wansan (Jeonju)',
		lon: 127.15,
		lat: 35.82,
		h: [[-999, 'mahan'], [369, 'baekje'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'gochang',
		name: 'Gochang',
		lon: 126.7,
		lat: 35.43,
		h: [[-999, 'mahan'], [369, 'baekje'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'gwangju',
		name: 'Gwangju',
		lon: 126.85,
		lat: 35.15,
		h: [[-999, 'mahan'], [369, 'baekje'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'naju',
		name: 'Yeongsan river (Naju)',
		lon: 126.7,
		lat: 34.95,
		h: [[-999, 'mahan'], [369, 'baekje', '?'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'haenam',
		name: 'Haenam',
		lon: 126.6,
		lat: 34.57,
		h: [[-999, 'mahan'], [369, 'baekje', '?'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'suncheon',
		name: 'Suncheon',
		lon: 127.48,
		lat: 34.95,
		h: [[-999, 'mahan'], [369, 'baekje', '?'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'namwon',
		name: 'Gimun (Namwon)',
		lon: 127.39,
		lat: 35.41,
		h: [[-999, 'mahan'], [369, 'gaya', '?'], [513, 'baekje'], [663, 'china'], [671, 'silla']]
	},

	// ——— the Sobaek line: where Silla climbs west ———
	{
		id: 'boeun',
		name: 'Samnyeon (Boeun)',
		lon: 127.73,
		lat: 36.49,
		h: [[-999, 'mahan', '?'], [300, 'baekje', '?'], [470, 'silla']]
	},
	{
		id: 'okcheon',
		name: 'Gwansan (Okcheon)',
		lon: 127.57,
		lat: 36.3,
		h: [[-999, 'mahan', '?'], [300, 'baekje', '?'], [500, 'silla', '?']]
	},

	// ——— Byeonhan, then the Gaya leagues ———
	{
		id: 'gimhae',
		name: 'Geumgwan Gaya (Gimhae)',
		lon: 128.88,
		lat: 35.23,
		h: [[-999, 'byeonhan'], [42, 'gaya'], [532, 'silla']]
	},
	{
		id: 'changwon',
		name: 'Takgisun (Changwon)',
		lon: 128.68,
		lat: 35.23,
		h: [[-999, 'byeonhan'], [42, 'gaya'], [532, 'silla', '?']]
	},
	{
		id: 'busan',
		name: 'Geochilsan (Busan)',
		lon: 129.08,
		lat: 35.2,
		h: [[-999, 'byeonhan', '?'], [42, 'gaya', '?'], [400, 'silla', '?']]
	},
	{
		id: 'haman',
		name: 'Ara Gaya (Haman)',
		lon: 128.41,
		lat: 35.27,
		h: [[-999, 'byeonhan'], [42, 'gaya'], [559, 'silla', '?']]
	},
	{
		id: 'goseong',
		name: 'Sogaya (Goseong)',
		lon: 128.32,
		lat: 34.97,
		h: [[-999, 'byeonhan'], [42, 'gaya'], [562, 'silla']]
	},
	{
		id: 'changnyeong',
		name: 'Bihwa (Changnyeong)',
		lon: 128.49,
		lat: 35.54,
		h: [[-999, 'byeonhan'], [42, 'gaya'], [555, 'silla']]
	},
	{
		id: 'goryeong',
		name: 'Daegaya (Goryeong)',
		lon: 128.26,
		lat: 35.73,
		h: [[-999, 'byeonhan'], [42, 'gaya'], [562, 'silla']]
	},
	{
		id: 'hapcheon',
		name: 'Daeya (Hapcheon)',
		lon: 128.17,
		lat: 35.57,
		h: [[-999, 'byeonhan'], [42, 'gaya'], [562, 'silla'], [642, 'baekje'], [660, 'silla']]
	},
	{
		id: 'geochang',
		name: 'Geochang',
		lon: 127.91,
		lat: 35.69,
		h: [[-999, 'byeonhan', '?'], [42, 'gaya'], [562, 'silla'], [642, 'baekje', '?'], [660, 'silla']]
	},
	{
		id: 'jinju',
		name: 'Jinju',
		lon: 128.08,
		lat: 35.18,
		h: [[-999, 'byeonhan'], [42, 'gaya'], [562, 'silla'], [642, 'baekje', '?'], [660, 'silla']]
	},
	{
		id: 'hadong',
		name: 'Daesa (Hadong)',
		lon: 127.75,
		lat: 35.07,
		h: [[-999, 'byeonhan', '?'], [42, 'gaya'], [529, 'baekje'], [663, 'china'], [671, 'silla']]
	},
	{
		id: 'seongju',
		name: 'Seongsan Gaya (Seongju)',
		lon: 128.28,
		lat: 35.92,
		h: [[-999, 'byeonhan'], [42, 'gaya'], [500, 'silla', '?']]
	},
	{
		id: 'hamchang',
		name: 'Goryeong Gaya (Hamchang)',
		lon: 128.18,
		lat: 36.57,
		h: [[-999, 'jinhan', '?'], [42, 'gaya', '?'], [500, 'silla', '?']]
	},

	// ——— Jinhan: the twelve statelets Saro swallows ———
	{ id: 'gyeongju', name: 'Saro (Gyeongju)', lon: 129.21, lat: 35.84, h: [[-999, 'jinhan'], [-57, 'silla']] },
	{ id: 'pohang', name: 'Eumjeupbeol (Pohang)', lon: 129.35, lat: 36.02, h: [[-999, 'jinhan'], [102, 'silla']] },
	{ id: 'ulsan', name: 'Ulsan', lon: 129.31, lat: 35.54, h: [[-999, 'jinhan'], [100, 'silla', '?']] },
	{ id: 'gyeongsan', name: 'Apdok (Gyeongsan)', lon: 128.74, lat: 35.82, h: [[-999, 'jinhan'], [102, 'silla']] },
	{ id: 'uiseong', name: 'Jomun (Uiseong)', lon: 128.7, lat: 36.35, h: [[-999, 'jinhan'], [185, 'silla']] },
	{ id: 'yeongcheon', name: 'Golbeol (Yeongcheon)', lon: 128.94, lat: 35.97, h: [[-999, 'jinhan'], [236, 'silla']] },
	{ id: 'sangju', name: 'Sabeol (Sangju)', lon: 128.16, lat: 36.41, h: [[-999, 'jinhan'], [249, 'silla']] },
	{ id: 'daegu', name: 'Dalgubeol (Daegu)', lon: 128.6, lat: 35.87, h: [[-999, 'jinhan'], [261, 'silla']] },
	{ id: 'cheongdo', name: 'Iseo (Cheongdo)', lon: 128.73, lat: 35.65, h: [[-999, 'jinhan'], [297, 'silla']] },
	{ id: 'andong', name: 'Andong', lon: 128.73, lat: 36.57, h: [[-999, 'jinhan'], [300, 'silla', '?']] },
	{ id: 'yeongju', name: 'Yeongju', lon: 128.6, lat: 36.82, h: [[-999, 'jinhan', '?'], [400, 'silla', '?']] },

	// ——— the islands ———
	{ id: 'jeju', name: 'Tamla (Jeju)', lon: 126.53, lat: 33.4, r: 26, h: [[-999, 'tamla']] },
	{ id: 'tsushima', name: 'Tsushima', lon: 129.3, lat: 34.4, r: 18, h: [[-999, 'wa']] },
	{ id: 'kyushu', name: 'Tsukushi (Kyushu)', lon: 130.4, lat: 33.6, r: 62, h: [[-999, 'wa']] }
];

/** One dated change on the slider. */
export interface BorderEvent {
	year: number;
	en: string;
	ko: string;
}

export const BORDER_EVENTS: BorderEvent[] = [
	{ year: -194, en: 'Wiman, an exile from Yan, takes the throne of Old Joseon.', ko: '위만이 고조선의 왕위를 차지한다.' },
	{
		year: -108,
		en: 'The Han take Old Joseon: Lelang, Zhenfan, Lintun and Xuantu.',
		ko: '한이 고조선을 무너뜨리고 낙랑·진번·임둔·현도를 둔다.'
	},
	{ year: -82, en: 'The Han give up Zhenfan and Lintun.', ko: '한이 진번군과 임둔군을 폐지한다.' },
	{ year: -75, en: 'Xuantu is pushed out of Okjeo, west over the mountains.', ko: '현도군이 옥저에서 서쪽으로 밀려난다.' },
	{ year: -57, en: 'Saro, the later Silla, is founded (by its own count).', ko: '사로국, 훗날의 신라가 선다.' },
	{ year: -37, en: 'Jumong founds Goguryeo at Jolbon.', ko: '주몽이 졸본에서 고구려를 세운다.' },
	{ year: -18, en: 'Onjo founds Baekje at Wirye.', ko: '온조가 위례에서 백제를 세운다.' },
	{ year: 42, en: 'Suro founds Geumgwan Gaya; Byeonhan becomes the Gaya league.', ko: '수로가 금관가야를 세운다.' },
	{ year: 56, en: 'Goguryeo swallows East Okjeo.', ko: '고구려가 동옥저를 병합한다.' },
	{ year: 249, en: 'Silla takes Sabeol; Jinhan is nearly gone.', ko: '신라가 사벌국을 병합한다.' },
	{ year: 311, en: 'Goguryeo takes the Yalu mouth.', ko: '고구려가 서안평을 차지한다.' },
	{ year: 313, en: 'Goguryeo ends Lelang. Daifang falls a year later.', ko: '고구려가 낙랑을 몰아낸다.' },
	{ year: 346, en: 'Former Yan sacks Buyeo.', ko: '전연이 부여를 친다.' },
	{ year: 369, en: 'Baekje subdues the last Mahan statelets.', ko: '백제가 마한의 남은 나라들을 복속한다.' },
	{ year: 396, en: 'Gwanggaeto takes fifty-eight Baekje fortresses.', ko: '광개토왕이 백제의 58성을 빼앗는다.' },
	{ year: 404, en: 'Goguryeo seizes Liaodong.', ko: '고구려가 요동을 차지한다.' },
	{ year: 475, en: 'Hanseong falls. Baekje flees south to Ungjin.', ko: '한성 함락. 백제가 웅진으로 옮긴다.' },
	{ year: 494, en: 'Buyeo submits to Goguryeo.', ko: '부여가 고구려에 항복한다.' },
	{ year: 512, en: 'Silla takes Usan.', ko: '신라가 우산국을 복속한다.' },
	{ year: 532, en: 'Geumgwan Gaya surrenders to Silla.', ko: '금관가야가 신라에 항복한다.' },
	{ year: 551, en: 'Baekje and Silla take back the Han river.', ko: '백제와 신라가 한강을 되찾는다.' },
	{ year: 553, en: 'Silla turns on Baekje and keeps the Han river.', ko: '신라가 백제의 한강 하류를 빼앗는다.' },
	{ year: 562, en: 'Daegaya falls. Gaya is gone.', ko: '대가야 멸망.' },
	{ year: 629, en: 'Silla takes Nangbi.', ko: '신라가 낭비성을 빼앗는다.' },
	{ year: 642, en: 'Daeya falls to Baekje.', ko: '대야성이 백제에 떨어진다.' },
	{ year: 660, en: 'Sabi falls. Baekje is gone; Tang holds its ground.', ko: '사비 함락. 백제 멸망.' },
	{ year: 663, en: 'White River. The restoration ends.', ko: '백강 전투. 부흥군이 무너진다.' },
	{ year: 668, en: 'Pyongyang falls. Goguryeo is gone.', ko: '평양 함락. 고구려 멸망.' },
	{ year: 671, en: 'Silla takes Sabi from the Tang.', ko: '신라가 사비를 차지한다.' },
	{ year: 676, en: 'Gibeolpo. Tang pulls back to Liaodong.', ko: '기벌포 전투. 당이 요동으로 물러난다.' },
	{ year: 698, en: 'Dae Jo-yeong founds Balhae.', ko: '대조영이 발해를 세운다.' },
	{ year: 720, en: 'Balhae takes the old Goguryeo north and Buyeo’s plain.', ko: '발해가 옛 고구려 북방과 부여 땅을 차지한다.' },
	{ year: 735, en: 'The Tang grant Silla everything south of the Taedong.', ko: '당이 대동강 이남을 신라 땅으로 인정한다.' }
];

/** A kingdom at its height: drawn as a coloured mark under the slider. */
export interface BorderPeak {
	polity: PolityId;
	year: number;
	en: string;
}

export const BORDER_PEAKS: BorderPeak[] = [
	{ polity: 'gojoseon', year: -120, en: 'Old Joseon at its height: Ugeo bars the southern states from the Han.' },
	{ polity: 'buyeo', year: 49, en: 'Buyeo at its height: the Han’s favoured ally in the north.' },
	{ polity: 'baekje', year: 371, en: 'Baekje at its height: Geunchogo kills Goguryeo’s king at Pyongyang.' },
	{ polity: 'gaya', year: 399, en: 'Gaya at its height: the iron league, a year before Gwanggaeto marches south.' },
	{ polity: 'goguryeo', year: 475, en: 'Goguryeo at its height: Jangsu takes Hanseong.' },
	{ polity: 'silla', year: 676, en: 'Silla at its height: the Tang are driven out.' },
	{ polity: 'balhae', year: 762, en: 'Balhae at its height: the Tang call it a kingdom.' }
];

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

const DEFAULT_REACH = 44;
const CIRCLE_SIDES = 28;

/** Sutherland–Hodgman: a convex Voronoi cell cut by a convex polygon (the reach circle). */
function clipConvex(subject: Pt[], clipper: Pt[]): Pt[] {
	let out = subject;
	for (let i = 0; i < clipper.length && out.length; i++) {
		const a = clipper[i];
		const b = clipper[(i + 1) % clipper.length];
		const inside = (p: Pt) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= 0;
		const cross = (p: Pt, q: Pt): Pt => {
			const d1 = [q[0] - p[0], q[1] - p[1]];
			const d2 = [b[0] - a[0], b[1] - a[1]];
			const t = ((a[0] - p[0]) * d2[1] - (a[1] - p[1]) * d2[0]) / (d1[0] * d2[1] - d1[1] * d2[0]);
			return [p[0] + t * d1[0], p[1] + t * d1[1]];
		};
		const input = out;
		out = [];
		for (let j = 0; j < input.length; j++) {
			const p = input[j];
			const q = input[(j + 1) % input.length];
			if (inside(q)) {
				if (!inside(p)) out.push(cross(p, q));
				out.push(q);
			} else if (inside(p)) {
				out.push(cross(p, q));
			}
		}
	}
	return out;
}

function circle([cx, cy]: Pt, r: number): Pt[] {
	return Array.from({ length: CIRCLE_SIDES }, (_, i) => {
		const a = (i / CIRCLE_SIDES) * Math.PI * 2;
		return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as Pt;
	});
}

export interface BorderSite {
	id: string;
	name: string;
	x: number;
	y: number;
	groups?: [number, string | null][];
	h: Hold[];
	/** the site's land: its Voronoi cell inside its reach, as an SVG path */
	d: string;
	/** Delaunay neighbours whose reaches overlap this one */
	near: number[];
}

function buildSites(): BorderSite[] {
	const pts = SITE_DEFS.map((s) => project(s.lon, s.lat));
	const delaunay = Delaunay.from(pts);
	const voronoi = delaunay.voronoi([-200, -200, 795, 1042]);
	const reach = SITE_DEFS.map((s) => s.r ?? DEFAULT_REACH);
	return SITE_DEFS.map((s, i) => {
		const ring = (voronoi.cellPolygon(i) as Pt[]).slice(0, -1);
		const cell = clipConvex(ring, circle(pts[i], reach[i]));
		const d = cell.length ? `M${cell.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}Z` : '';
		const near = [...delaunay.neighbors(i)].filter(
			(j) => Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) < reach[i] + reach[j]
		);
		return { id: s.id, name: s.name, x: pts[i][0], y: pts[i][1], groups: s.groups, h: s.h, d, near };
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

/** After Liaodong falls the commandery names are history; later Chinese ground takes the dynasty’s. */
const COMMANDERY_END = 404;

/** The commandery a site belongs to in `year`, if any. */
function commanderyAt(site: BorderSite, year: number): string | null {
	if (year >= COMMANDERY_END) return null;
	return site.groups?.findLast(([from]) => from <= year)?.[1] ?? null;
}

export interface BorderRealm {
	key: string;
	polity: PolityId;
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
export function realmsAt(year: number, holdings: Holding[]): BorderRealm[] {
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
		named.add(polity);
		const name = polityName(polity, year);
		realms.push({
			key: `${polity}:${BORDER_SITES[sites[0]].id}`,
			polity,
			...name,
			...centre(sites),
			size: sites.length,
			minor: sites.length < MINOR_RUN
		});
	}

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
			label: name,
			korean: '',
			...centre(members),
			size: members.length,
			minor: true
		});
	}
	return realms;
}
