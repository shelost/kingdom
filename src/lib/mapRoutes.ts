/**
 * Journeys and troop movements, drawn on story maps (`routes` on a map block)
 * as animated dotted arrows by MapExcerpt.
 *
 * Points are place ids from places.ts or raw [x, y] sheet coordinates (the
 * 595×842 space of /map.svg) for fords, sea lanes and off-map starts. Every
 * troop movement cites the record behind it in `source`; character journeys
 * rest on the story itself.
 */

import { PLACES } from '$lib/places';
import { KINGDOMS, type Person } from '$lib/people';
import type { Pt } from '$lib/mapPaths';

export type RouteSide = Person['kingdom'] | 'sui';
export type RouteKind = 'journey' | 'attack' | 'retreat' | 'naval' | 'counter';

export type MapRoute = {
	id: string;
	label: string;
	ko?: string;
	year: number;
	side: RouteSide;
	kind: RouteKind;
	points: (string | Pt)[];
	/** overrides the side colour (a character's own hex for a personal journey) */
	color?: string;
	/** whose journey it is: the legend names the traveller instead of the side */
	who?: string;
	whoKo?: string;
	/** draw-in stagger: lower goes first */
	order?: number;
	/** crossed-swords marker at this place */
	battle?: string;
	/** which way a two-point route bows (default 1) */
	bend?: 1 | -1;
	note?: string;
	source?: string;
};

const SIDE_KO: Partial<Record<RouteSide, string>> = {
	silla: '신라',
	baekje: '백제',
	goguryeo: '고구려',
	buyeo: '부여',
	jolbon: '졸본',
	tang: '당',
	sui: '수',
	gaya: '가야',
	yamato: '왜',
	tamla: '탐라'
};

const SUI = { label: 'Sui', color: '#a16207' };

export function routeSide(side: RouteSide): { label: string; ko: string; color: string } {
	const k = side === 'sui' ? SUI : KINGDOMS[side];
	return { label: k.label, ko: SIDE_KO[side] ?? k.label, color: k.color };
}

/** Legend names and line style (dash pattern and width in screen px) per kind. */
export const ROUTE_KINDS: Record<RouteKind, { label: string; ko: string; dash: string; width: number }> = {
	attack: { label: 'Advance', ko: '진격로', dash: '9 5', width: 2.6 },
	counter: { label: 'Counterattack', ko: '반격로', dash: '9 5', width: 2.6 },
	naval: { label: 'By sea', ko: '해로', dash: '14 6', width: 2.4 },
	retreat: { label: 'Retreat', ko: '퇴각로', dash: '2 7', width: 2.2 },
	journey: { label: 'Journey', ko: '여정', dash: '0.1 6.5', width: 3.2 }
};

/** One full dash + gap: how far the dashes march per loop. */
export function dashPeriod(kind: RouteKind): number {
	return ROUTE_KINDS[kind].dash.split(' ').reduce((s, v) => s + Number(v), 0);
}

/** Personal journeys: the traveller's own colour (CHARACTER_COLORS) and legend name. */
const CHUNCHU = { color: '#D8258C', who: 'Chunchu', whoKo: '춘추' };
const JUMONG = { color: '#e8563f', who: 'Jumong', whoKo: '주몽' };

const ZZTJ = 'Zizhi Tongjian';
const SGSG = 'Samguk Sagi';

export const MAP_ROUTES: MapRoute[] = [
	// ———————————————— 612 · Sui, the Colossal River ————————————————
	{
		id: 'sui612-liao',
		label: 'Nine armies',
		ko: '아홉 군단',
		year: 612,
		side: 'sui',
		kind: 'attack',
		points: [[4, 392], [70, 362], 'liao', 'yodong'],
		battle: 'yodong',
		order: 0,
		source: `Sui Shu 4 (Annals of Yangdi, Daye 8); ${ZZTJ} 181`
	},
	{
		id: 'sui612-yuwen',
		label: 'The 305,000',
		ko: '30만 5천',
		year: 612,
		side: 'sui',
		kind: 'attack',
		points: ['liao', [178, 386], 'amnok', 'salsu', [252, 443]],
		order: 1,
		note: 'Yu Wenshu and Yu Zhongwen cross the Amnok and halt thirty li from Pyongyang.',
		source: `Sui Shu 60–61 (Yu Zhongwen, Yu Wenshu); ${SGSG} 20 (Yeongyang 23)`
	},
	{
		id: 'sui612-lai',
		label: 'Lai Huer’s fleet',
		ko: '내호아 수군',
		year: 612,
		side: 'sui',
		kind: 'naval',
		points: ['laizhou', [70, 505], [165, 488], [232, 472], 'pyongyang'],
		battle: 'pyongyang',
		order: 1,
		source: `Sui Shu 64 (Lai Huer); ${ZZTJ} 181`
	},
	{
		id: 'sui612-retreat',
		label: 'Back to the Liao',
		ko: '요하로',
		year: 612,
		side: 'sui',
		kind: 'retreat',
		points: [[250, 440], 'salsu', [205, 400], [150, 354], [60, 352]],
		battle: 'salsu',
		order: 2,
		note: '305,000 crossed the Liao; 2,700 came back.',
		source: `${SGSG} 20 (Yeongyang 23); Sui Shu 81 (Goguryeo)`
	},

	// ———————————————— 645 · the Seventh Invasion ————————————————
	{
		id: 'tang645-liaodong',
		label: 'Blue Dragon',
		ko: '청룡',
		year: 645,
		side: 'tang',
		kind: 'attack',
		points: ['yingzhou', [100, 326], [120, 312], 'tongding', [168, 300], 'sinseong'],
		battle: 'sinseong',
		order: 0,
		note: 'Li Shiji shows his banners toward Huaiyuan, turns north and crosses the Liao at Tongding.',
		source: `${ZZTJ} 197 (Zhenguan 19, 4th month)`
	},
	{
		id: 'tang645-gaemo',
		label: 'Down the wall',
		ko: '성벽을 따라',
		year: 645,
		side: 'tang',
		kind: 'attack',
		points: ['sinseong', 'gaemo', 'yodong'],
		battle: 'gaemo',
		order: 1,
		source: `${ZZTJ} 197 (Zhenguan 19, 4th month: Gaimou taken)`
	},
	{
		id: 'tang645-main',
		label: 'Second Emperor',
		ko: '황제 본대',
		year: 645,
		side: 'tang',
		kind: 'attack',
		points: ['yingzhou', [80, 340], 'huaiyuan', [140, 346], 'yodong'],
		battle: 'yodong',
		order: 1,
		note: 'Across the Liao marsh on a road of earth, torn up behind the last wagon.',
		source: `${ZZTJ} 197 (Zhenguan 19, 5th month)`
	},
	{
		id: 'tang645-sea',
		label: 'Five hundred hulls',
		ko: '전함 오백 척',
		year: 645,
		side: 'tang',
		kind: 'naval',
		points: ['laizhou', [40, 508], [72, 478], 'bisa'],
		battle: 'bisa',
		order: 0,
		note: 'Zhang Liang, Pyongyang Route: 40,000 men, 500 warships out of Laizhou.',
		source: `${ZZTJ} 197 (Zhenguan 19, 1st and 5th months)`
	},
	{
		id: 'tang645-baegam',
		label: 'White Dragon',
		ko: '흰 용',
		year: 645,
		side: 'tang',
		kind: 'attack',
		points: ['yodong', [172, 350], 'baegam'],
		battle: 'baegam',
		order: 2,
		note: 'Qibi Heli takes a spear in the waist; the fort’s lord surrenders anyway.',
		source: `${ZZTJ} 198 (Zhenguan 19, 6th month)`
	},
	{
		id: 'tang645-geonan',
		label: 'The fleet turns north',
		ko: '수군, 북으로',
		year: 645,
		side: 'tang',
		kind: 'attack',
		points: ['bisa', [100, 420], 'geonan'],
		battle: 'geonan',
		order: 3,
		source: `${ZZTJ} 198 (Zhenguan 19: Zhang Liang below Geonan)`
	},
	{
		id: 'tang645-ansi',
		label: 'To Ansi',
		ko: '안시로',
		year: 645,
		side: 'tang',
		kind: 'attack',
		points: ['yodong', [150, 360], 'ansi'],
		battle: 'ansi',
		order: 3,
		source: `${ZZTJ} 198 (Zhenguan 19, 6th–9th months)`
	},
	{
		id: 'gog645-gungnae',
		label: 'Relief from Gungnae',
		ko: '국내성 구원군',
		year: 645,
		side: 'goguryeo',
		kind: 'counter',
		points: ['gungnae', [235, 322], [195, 332], 'yodong'],
		order: 1,
		note: '40,000 foot and horse from New Fortress and Gungnae, turned back by Li Daozong.',
		source: `${ZZTJ} 197 (Zhenguan 19, 5th month)`
	},
	{
		id: 'gog645-relief',
		label: 'Go Yeonsu · 150,000',
		ko: '고연수 15만',
		year: 645,
		side: 'goguryeo',
		kind: 'counter',
		points: ['pyongyang', [228, 410], 'ogol', [160, 372], 'jupil'],
		battle: 'jupil',
		order: 2,
		note: 'Go Yeonsu and Go Hyejin with Goguryeo and Mohe troops, marching to relieve Ansi.',
		source: `${ZZTJ} 198 (Zhenguan 19, 6th month); ${SGSG} 21 (Bojang 4)`
	},
	{
		id: 'tang645-retreat',
		label: 'Home through the marsh',
		ko: '늪을 건너 귀환',
		year: 645,
		side: 'tang',
		kind: 'retreat',
		points: ['ansi', [118, 346], 'huaiyuan', [80, 330], 'yingzhou'],
		order: 4,
		note: 'Ninth month: grass gone, snow on the Liao marsh.',
		source: `${ZZTJ} 198 (Zhenguan 19, 9th–10th months)`
	},
	{
		id: 'tang645-fleet-home',
		label: 'Fleet recalled',
		ko: '수군 철수',
		year: 645,
		side: 'tang',
		kind: 'retreat',
		points: ['geonan', [92, 432], [45, 500], 'laizhou'],
		order: 4,
		source: `${ZZTJ} 198 (Zhenguan 19)`
	},

	// ———————————————— 660 · the fall of Baekje ————————————————
	{
		id: 'tang660-crossing',
		label: '130,000 by sea',
		ko: '13만, 바다로',
		year: 660,
		side: 'tang',
		kind: 'naval',
		points: ['chengshan', [200, 535], 'deokmul'],
		order: 0,
		source: `${ZZTJ} 200 (Xianqing 5, 3rd month: from Chengshan); ${SGSG} 5 (Muyeol 7, 6th month)`
	},
	{
		id: 'silla660-deokmul',
		label: 'A hundred Silla ships',
		ko: '신라 배 백 척',
		year: 660,
		side: 'silla',
		kind: 'naval',
		points: ['wirye', [290, 540], 'deokmul'],
		order: 1,
		source: `${SGSG} 5 (Muyeol 7: Bupmin meets Su Dingfang at Deokmul Island)`
	},
	{
		id: 'tang660-gibeolpo',
		label: 'The Red Fowl',
		ko: '주작',
		year: 660,
		side: 'tang',
		kind: 'naval',
		points: ['deokmul', [268, 580], 'gibeolpo'],
		battle: 'gibeolpo',
		order: 0,
		source: `${ZZTJ} 200 (Xianqing 5); ${SGSG} 28 (Uija 20)`
	},
	{
		id: 'silla660-march',
		label: 'Fifty thousand',
		ko: '오만 대군',
		year: 660,
		side: 'silla',
		kind: 'attack',
		points: ['surabol', 'geumdol', 'tanhyeon', 'hwangsan'],
		battle: 'hwangsan',
		order: 0,
		note: 'Through Charcoal Pass, the door Seongchung begged them to hold.',
		source: `${SGSG} 5 (Muyeol 7, 7th month); ${SGSG} 47 (Gyebaek)`
	},
	{
		id: 'tang660-sabi',
		label: 'Up the river',
		ko: '강을 거슬러',
		year: 660,
		side: 'tang',
		kind: 'attack',
		points: ['gibeolpo', [299, 604], 'sabi'],
		battle: 'sabi',
		order: 1,
		source: `${ZZTJ} 200 (Xianqing 5); ${SGSG} 28 (Uija 20)`
	},
	{
		id: 'silla660-sabi',
		label: 'From the fields',
		ko: '들판에서',
		year: 660,
		side: 'silla',
		kind: 'attack',
		points: ['hwangsan', 'sabi'],
		order: 1,
		source: `${SGSG} 5 (Muyeol 7, 7th month)`
	},
	{
		id: 'euija660-flight',
		label: 'Euija’s night ride',
		ko: '의자의 밤길',
		year: 660,
		side: 'baekje',
		kind: 'journey',
		points: ['sabi', 'ungjin'],
		bend: -1,
		source: `${SGSG} 28 (Uija 20); the story`
	},

	// ———————————————— 661–662 · Pyongyang I, the Snake River ————————————————
	{
		id: 'tang661-sea',
		label: 'The Red Fowl, up the Taedong',
		ko: '주작, 대동강으로',
		year: 661,
		side: 'tang',
		kind: 'naval',
		points: ['laizhou', [110, 505], [190, 480], [232, 470], 'pyongyang'],
		battle: 'pyongyang',
		order: 0,
		source: `${ZZTJ} 200 (Longshuo 1, 8th month)`
	},
	{
		id: 'tang661-yalu',
		label: 'White Dragon over the ice',
		ko: '얼음 위의 흰 용',
		year: 661,
		side: 'tang',
		kind: 'attack',
		points: ['yingzhou', [95, 340], 'yodong', [185, 382], 'amnok'],
		battle: 'amnok',
		order: 1,
		source: `${ZZTJ} 200 (Longshuo 1, 9th month); ${SGSG} 22 (Bojang 20)`
	},
	{
		id: 'silla662-rice',
		label: 'Yushin’s rice carts',
		ko: '유신의 쌀 수레',
		year: 662,
		side: 'silla',
		kind: 'journey',
		points: ['surabol', [355, 560], [318, 520], [285, 488], 'pyongyang'],
		order: 0,
		source: `${SGSG} 6 (Munmu 2, 1st–2nd months); ${SGSG} 42 (Kim Yushin)`
	},
	{
		id: 'tang662-pang',
		label: 'White Tiger',
		ko: '백호',
		year: 662,
		side: 'tang',
		kind: 'naval',
		points: [[150, 500], [232, 472], 'sasu'],
		battle: 'sasu',
		order: 0,
		note: 'Pang Xiaotai and the Lingnan levy; he and his thirteen sons die on the Sasu.',
		source: `${ZZTJ} 200 (Longshuo 2, 2nd month)`
	},
	{
		id: 'gog662-yeon',
		label: 'Yeon Gesomun',
		ko: '연개소문',
		year: 662,
		side: 'goguryeo',
		kind: 'counter',
		points: ['pyongyang', [280, 446], 'sasu'],
		order: 1,
		source: `${ZZTJ} 200 (Longshuo 2); Xin Tangshu 220 (Goguryeo)`
	},

	// ———————————————— 663 · the White River ————————————————
	{
		id: 'tang663-sun',
		label: 'Sun Renshi · 7,000',
		ko: '손인사 7천',
		year: 663,
		side: 'tang',
		kind: 'naval',
		points: ['laizhou', [150, 560], [245, 575], 'gibeolpo', 'ungjin'],
		order: 0,
		source: `${ZZTJ} 201 (Longshuo 3: Zi, Qing, Lai and Hai troops cross to Ungjin)`
	},
	{
		id: 'silla663-land',
		label: 'Munmu and Yushin',
		ko: '문무와 유신',
		year: 663,
		side: 'silla',
		kind: 'attack',
		points: ['surabol', [356, 598], 'ungjin', [302, 606], 'juryu'],
		battle: 'juryu',
		order: 1,
		source: `${SGSG} 6 (Munmu 3); ${SGSG} 42 (Kim Yushin)`
	},
	{
		id: 'tang663-liu',
		label: 'Black Tortoise · 170 ships',
		ko: '현무 170척',
		year: 663,
		side: 'tang',
		kind: 'naval',
		points: ['ungjin', 'sabi', [295, 609], 'baekgang'],
		battle: 'baekgang',
		order: 1,
		note: 'Liu Rengui, Du Shuang and Buyeo Yung take the fleet down the Ungjin river.',
		source: `${ZZTJ} 201 (Longshuo 3, 8th–9th months); Jiu Tangshu 84 (Liu Rengui)`
	},
	{
		id: 'yamato663-fleet',
		label: 'The eastern fleet',
		ko: '동쪽 함대',
		year: 663,
		side: 'yamato',
		kind: 'naval',
		points: ['tsukushi', [385, 700], [315, 662], [285, 630], 'baekgang'],
		battle: 'baekgang',
		order: 2,
		source: 'Nihon Shoki 27 (Tenji 2, 8th month); Jiu Tangshu 84 (Liu Rengui)'
	},

	// ———————————————— 666–668 · the brothers, Pyongyang II ————————————————
	{
		id: 'namseng666-flight',
		label: 'Namseng to Gungnae',
		ko: '남생, 국내성으로',
		year: 666,
		side: 'goguryeo',
		kind: 'journey',
		points: ['pyongyang', [276, 400], 'gungnae'],
		order: 0,
		source: `${SGSG} 22 (Bojang 25); Jiu Tangshu 199 (Goguryeo)`
	},
	{
		id: 'namseng666-west',
		label: 'Over to the Tang',
		ko: '당으로',
		year: 666,
		side: 'goguryeo',
		kind: 'journey',
		points: ['gungnae', [215, 318], 'sinseong', [110, 315], 'yingzhou'],
		order: 1,
		source: `${SGSG} 22 (Bojang 25); ${ZZTJ} 201 (Qianfeng 1)`
	},
	{
		id: 'tang667-blue',
		label: 'Blue Dragon',
		ko: '청룡',
		year: 667,
		side: 'tang',
		kind: 'attack',
		points: ['yingzhou', [100, 318], 'tongding', [168, 300], 'sinseong'],
		battle: 'sinseong',
		order: 0,
		source: `${ZZTJ} 201 (Qianfeng 2, 9th month)`
	},
	{
		id: 'tang668-white',
		label: 'White Tiger',
		ko: '백호',
		year: 668,
		side: 'tang',
		kind: 'attack',
		points: ['sinseong', [222, 240], 'buyeo_fort'],
		battle: 'buyeo_fort',
		order: 1,
		note: 'Xue Rengui takes Buyeo Fortress in the second month.',
		source: `${ZZTJ} 201 (Zongzhang 1, 2nd month)`
	},
	{
		id: 'tang668-south',
		label: 'On to Pyongyang',
		ko: '평양으로',
		year: 668,
		side: 'tang',
		kind: 'attack',
		points: ['sinseong', [205, 365], 'amnok', [245, 428], 'pyongyang'],
		battle: 'pyongyang',
		order: 2,
		source: `${ZZTJ} 201 (Zongzhang 1, 9th month)`
	},
	{
		id: 'silla668-north',
		label: 'Silla from the south',
		ko: '남쪽의 신라',
		year: 668,
		side: 'silla',
		kind: 'attack',
		points: ['surabol', [350, 565], 'wirye', [288, 495], 'pyongyang'],
		order: 2,
		source: `${SGSG} 6 (Munmu 8, 6th–9th months)`
	},

	// ———————————————— 672–676 · the Silla–Tang war ————————————————
	{
		id: 'tang672-south',
		label: 'Gao Kan and the Mohe',
		ko: '고간과 말갈',
		year: 672,
		side: 'tang',
		kind: 'attack',
		points: ['pyongyang', [286, 478], 'seokmun'],
		battle: 'seokmun',
		order: 0,
		source: `${SGSG} 7 (Munmu 12, 8th month); ${ZZTJ} 202 (Xianheng 3)`
	},
	{
		id: 'silla672-chase',
		label: 'The chase',
		ko: '추격',
		year: 672,
		side: 'silla',
		kind: 'attack',
		points: [[300, 508], 'seokmun'],
		order: 1,
		source: `${SGSG} 7 (Munmu 12, 8th month)`
	},
	{
		id: 'tang675-xue',
		label: 'Xue Rengui lands',
		ko: '설인귀 상륙',
		year: 675,
		side: 'tang',
		kind: 'naval',
		points: [[150, 520], [245, 512], 'cheonseong'],
		battle: 'cheonseong',
		order: 0,
		source: `${SGSG} 7 (Munmu 15, 9th month)`
	},
	{
		id: 'tang675-li',
		label: 'Mohe horse',
		ko: '말갈 기병',
		year: 675,
		side: 'tang',
		kind: 'attack',
		points: [[290, 468], [305, 488], 'maeso'],
		battle: 'maeso',
		order: 1,
		note: 'Li Jinxing’s army at Maeso; Silla takes 30,380 horses.',
		source: `${SGSG} 7 (Munmu 15, 9th month)`
	},
	{
		id: 'tang676-withdraw',
		label: 'The protectorate leaves',
		ko: '도호부, 요동으로',
		year: 676,
		side: 'tang',
		kind: 'retreat',
		points: ['pyongyang', [205, 405], 'yodong'],
		order: 0,
		source: `${ZZTJ} 202 (Yifeng 1, 2nd month)`
	},
	{
		id: 'tang676-xue',
		label: 'Xue’s last fleet',
		ko: '설인귀의 마지막 함대',
		year: 676,
		side: 'tang',
		kind: 'naval',
		points: [[170, 600], [255, 612], 'gibeolpo'],
		battle: 'gibeolpo',
		order: 1,
		source: `${SGSG} 7 (Munmu 16, 11th month)`
	},
	{
		id: 'tang676-home',
		label: 'Heading west',
		ko: '서쪽으로',
		year: 676,
		side: 'tang',
		kind: 'retreat',
		points: ['gibeolpo', [220, 598], [110, 570]],
		order: 0,
		source: `${SGSG} 7 (Munmu 16, 11th month); the story`
	},

	// ———————————————— character journeys ————————————————
	{
		id: 'jumong-flight',
		label: 'Jumong runs',
		ko: '주몽의 도망',
		year: -37,
		side: 'goguryeo',
		kind: 'journey',
		...JUMONG,
		points: ['buyeo_north', [288, 240], [272, 268]],
		order: 0,
		note: 'Daeso’s riders behind him, a river ahead.',
		source: `${SGSG} 13 (Dongmyeong); the story`
	},
	{
		id: 'jumong-south',
		label: 'South to Jolbon',
		ko: '남으로, 졸본',
		year: -37,
		side: 'goguryeo',
		kind: 'journey',
		...JUMONG,
		points: [[272, 268], [262, 302], 'jolbon'],
		order: 1,
		note: 'Over the river on turtles’ backs.',
		source: `${SGSG} 13 (Dongmyeong); the story`
	},
	{
		id: 'chunchu642-north',
		label: 'Chunchu goes north',
		ko: '춘추, 북으로',
		year: 642,
		side: 'silla',
		kind: 'journey',
		...CHUNCHU,
		points: ['surabol', [370, 578], [338, 548], [300, 505], 'pyongyang'],
		order: 0,
		source: `${SGSG} 41 (Kim Yushin I); the story`
	},
	{
		id: 'yushin642-march',
		label: 'Yushin counts out men',
		ko: '유신의 결사대',
		year: 642,
		side: 'silla',
		kind: 'attack',
		points: ['surabol', [350, 562], [322, 530]],
		order: 0,
		source: `${SGSG} 41 (Kim Yushin I: ten thousand to the Han)`
	},
	{
		id: 'chunchu642-home',
		label: 'Released',
		ko: '풀려나다',
		year: 642,
		side: 'silla',
		kind: 'journey',
		...CHUNCHU,
		points: ['pyongyang', [292, 498], [318, 526]],
		order: 1,
		source: `${SGSG} 41 (Kim Yushin I); the story`
	},
	{
		id: 'chunchu648-tang',
		label: 'To Chang’an',
		ko: '장안으로',
		year: 648,
		side: 'silla',
		kind: 'journey',
		...CHUNCHU,
		points: ['surabol', [350, 565], 'danghang', [190, 540], 'dengzhou', [2, 498]],
		order: 0,
		source: `${SGSG} 5 (Jindeok 2); Jiu Tangshu 199 (Silla); the story`
	},
	{
		id: 'chunchu648-home',
		label: 'Home by sea',
		ko: '바닷길로 귀국',
		year: 648,
		side: 'silla',
		kind: 'journey',
		...CHUNCHU,
		points: ['dengzhou', [150, 532], [235, 540], 'danghang'],
		order: 0,
		note: 'A Goguryeo patrol boards; On Gunhae wears his master’s coat.',
		source: `${SGSG} 5 (Jindeok 2); the story`
	}
];

export const ROUTE_BY_ID: Record<string, MapRoute> = Object.fromEntries(MAP_ROUTES.map((r) => [r.id, r]));

/** A route's points as sheet coordinates (unknown place ids are dropped). */
export function routePoints(route: MapRoute): Pt[] {
	return route.points.flatMap((p): Pt[] => {
		if (typeof p !== 'string') return [p];
		const place = PLACES[p];
		return place ? [[place.x, place.y]] : [];
	});
}

/** Every place a route names: its stops and its battle. */
export function routePlaceIds(route: MapRoute): string[] {
	const ids = route.points.filter((p): p is string => typeof p === 'string');
	return route.battle ? [...ids, route.battle] : ids;
}

/** The legend entry a route falls under: its traveller, else its side. */
export function routeLegendLabel(route: MapRoute, ko: boolean): string {
	if (route.who) return ko ? (route.whoKo ?? route.who) : route.who;
	const side = routeSide(route.side);
	return ko ? side.ko : side.label;
}

/** The colour a route is drawn in. */
export function routeColor(route: MapRoute): string {
	return route.color ?? routeSide(route.side).color;
}
