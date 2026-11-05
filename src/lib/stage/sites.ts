/**
 * Sites on the 3D stage. Geometry lives in `$lib/stage/build/*` (metres, +x east, +z south).
 * Outlines come from survey where we have it (Wolseong: OpenStreetMap); halls whose sites
 * are only recorded in the annals are placed, and each label says which is which.
 */

import type { LightPreset } from './build/types';

export type StageSiteId = 'moon' | 'sabi' | 'pyongyang' | 'ansi' | 'daeya' | 'chek' | 'wirye' | 'mugun' | 'daming' | 'asuka';

export type StageSite = {
	id: StageSiteId;
	/** Built enough to orbit. */
	ready: boolean;
	en: string;
	ko: string;
	place: string;
	years: string;
	refs: { src: string; caption: string }[];
	/** Short lines under the view. */
	facts: string[];
	/** Moments the model can show; the last is the default unless `defaultYear` names one. */
	eras: { year: number; en: string; ko: string }[];
	defaultYear?: number;
	/** Credit line for survey data drawn into the model. */
	credit?: string;
	/** The light the board was painted in, set when the site opens. */
	light?: LightPreset;
};

export const STATUS_LEGEND: { id: 'survey' | 'standing' | 'excavated' | 'recorded' | 'placed'; en: string; ko: string }[] = [
	{ id: 'survey', en: 'Outline from survey', ko: '측량' },
	{ id: 'standing', en: 'Still standing', ko: '현존' },
	{ id: 'excavated', en: 'Excavated', ko: '발굴' },
	{ id: 'recorded', en: 'In the annals; site placed', ko: '기록' },
	{ id: 'placed', en: 'Placed by us', ko: '추정' }
];

export const STAGE_SITES: StageSite[] = [
	{
		id: 'moon',
		ready: true,
		en: 'Moon Palace',
		ko: '월성',
		place: 'Wolseong, Gyeongju — crescent earthen palace-fortress',
		years: 'Court from the 5th century; halls named through Unified Silla',
		refs: [
			{ src: '/pl_moon_palace.png', caption: 'Chronicle board — moonlit court' },
			{ src: '/pl_wolji.png', caption: 'Wolji / Donggung, east of the crescent' },
			{ src: '/pl_radiance_fortress.png', caption: 'Radiance Fortress (Myeonghwalseong) on the hill east of the city' },
			{ src: '/pl_ghost_bridge.png', caption: 'The Ghost Bridge (귀교) west of the crescent' }
		],
		facts: [
			'The crescent is real: an earthen rampart, longer east–west than north–south, south wall against the bend of Namcheon. The stream is the natural moat. North, west, and east had dug moats.',
			'Samguk Sagi gives the wall to Pasa in 101. Excavation (west wall, west gate) reads a 5th-century embankment, rebuilt in the 6th. Soji moves the court inside in 488. The year 101 is the annals’ claim, not the first soil the spade finds.',
			'Outside the north wall, five pond-moats run west to east (1호 to 5호). After those were filled, a stone-lined moat was built along the east wall and the east end of the north wall. The 1979 dig of the east gate found one bay across the front and two bays deep, with that stone moat outside.',
			'Jowonjeon is the main hall from Queen Jindeok’s 5th year (651), named in the manner of a Tang audience hall. Gangmujeon (677) and Sungnyejeon (698) are also in the middle-period notices. Their stones are not yet pinned to a published room plan, so the model places them as walled courts inside the surveyed rampart and marks them “placed”.',
			'Munmu, 674: a pond and hills inside the palace. 679: the East Palace beside Wolji (Anapji), three islands, Imhaejeon on the bank. Tiles from the pond carry 679 and 680. That water sits east of the crescent, not inside it.',
			'Woljeonggyo and Iljeonggyo cross Namcheon in Gyeongdeok’s reign (760) — later than the wall. The Joseon ice house on the modern park is not Silla and is left out.',
			'Timber language: packed-earth yard, low stone stylobate, wooden columns, grey giwa. Not yellow-glazed roofs, not a Joseon palace copy. Early buildings here were post-in-ground and raised storehouses; foundation-stone halls spread from the 6th century.',
			'Myeonghwalseong, the Radiance Fortress, rings the hill about 3.5 km east of the crescent: an earthen fort of 405, walled in stone in the 550s (a building stele of 551 was found on the wall). In 647 Bidam camps there and Yushin holds Wolseong across the field. The gate pavilion and torches follow the board.',
			'The Ghost Bridge (귀교) is a story: Samguk Yusa has Bihyung’s goblins lay it in one night in Jinpyeong’s reign, over the north ditch of Sinwonsa. Its site is not found; the model sets the board’s three-arched stone bridge on Namcheon west of the crescent.'
		],
		eras: [
			{ year: 500, en: 'c. 500 · Soji', ko: '500년경 · 소지왕' },
			{ year: 651, en: '651 · Jindeok', ko: '651 · 진덕왕' },
			{ year: 680, en: '680 · Munmu', ko: '680 · 문무왕' },
			{ year: 760, en: '760 · Gyeongdeok', ko: '760 · 경덕왕' }
		],
		defaultYear: 680,
		credit: 'Rampart, moats, Wolji, tombs, river: © OpenStreetMap contributors (ODbL)'
	},
	{
		id: 'sabi',
		ready: true,
		en: 'Sabi',
		ko: '사비',
		place: 'Buyeo — Busosanseong on the hill, Gwanbuk-ri palace on the flat',
		years: 'Capital 538–660',
		refs: [{ src: '/pl_sabi_palace.png', caption: 'Chronicle board — Sabi palace' }],
		facts: [
			'King Seong moves the Baekje capital from Ungjin to Sabi in 538. The city falls in 660.',
			'The defended height is Busosanseong, a mountain fortress on the north side of the plain. The palace buildings archaeologists can point to are at Gwanbuk-ri, on the flat ground south of that hill: corridors, large halls, stone drains. Timber is gone.',
			'The Baengma (Geum) runs to the south and west. Jeongnimsa’s stone pagoda is the survivor in the city; the palace in this model is massing only — hill, courts, river — until a measured plan is traced in.',
			'Naseong, the outer earthen wall around the capital, is not modelled yet.'
		],
		eras: [{ year: 640, en: '640 · Mu', ko: '640 · 무왕' }]
	},
	{
		id: 'pyongyang',
		ready: true,
		en: 'Pyongyang',
		ko: '평양',
		place: 'Jangan Fortress — four walls on the north bank of the Daedong',
		years: 'Capital from 427; Jangan walled from 552, the court inside from 586',
		refs: [{ src: '/pl_pyongyang_fortress.png', caption: 'Chronicle board — red munru fortress' }],
		facts: [
			'Jangsu moves the Goguryeo capital from Gungnae to Pyongyang in 427. Jangan Fortress is begun in 552 and the court moves inside in 586; inscribed wall stones record the work in between.',
			'One long circuit holds four cities: the north citadel on Moranbong, the inner city with the palace, and the middle and outer cities on the flats down to where the Botong meets the Daedong. The outer city was laid out on a street grid.',
			'The wall lines here are schematic and the palace inside the inner city is placed, after the walled compound and axis of Anhak. The board’s red two-tier munru stands on the citadel rim above the river.'
		],
		eras: [{ year: 640, en: '640 · Yeongnyu', ko: '640 · 영류왕' }]
	},
	{
		id: 'ansi',
		ready: true,
		en: 'Ansi',
		ko: '안시성',
		place: 'Mountain fortress — Yingchengzi, Haicheng, in the usual identification',
		years: 'Siege 645',
		refs: [{ src: '/pl_ansi.png', caption: 'Chronicle board — Ansi' }],
		facts: [
			'In 645 Taizong’s army sits under Ansi for some three months and leaves without it. The commander is unnamed in the histories this chronicle uses.',
			'The usual identification is the Yingchengzi fortress at Haicheng: stone walls along a horseshoe of ridges round a valley, a gate where the valley opens.',
			'For sixty days the Tang heap an earthen mound against the south-east wall. It slumps onto the wall, the defenders take it, and the Tang never win it back.',
			'The red command halls on the summit, above a sea of cloud, are the board’s and are placed.'
		],
		eras: [{ year: 645, en: '645 · the siege', ko: '645 · 안시성 싸움' }]
	},
	{
		id: 'daeya',
		ready: true,
		en: 'Daeya Fortress',
		ko: '대야성',
		place: 'Hapcheon — a stone ring on the hill above the Hwanggang',
		years: 'Built 562; lost to Baekje 642',
		refs: [{ src: '/pl_daeya_fortress.png', caption: 'Chronicle board — the south gate' }],
		facts: [
			'Silla walls the hill at Hapcheon in 562, after Daegaya falls, and makes it the western door of the kingdom.',
			'In the eighth month of 642 Baekje’s general Yunchung lays siege. Inside, the clerk Geomil, whose wife the commander Kim Pumseok had taken, burns the granary. The fortress opens; Pumseok and his wife Gotaso, Kim Chunchu’s daughter, die.',
			'The ring here follows the hilltop contour. The south gate is the board’s: an ochre dressed-stone block with one round arch, blue leaves and a single-storey pavilion, with Silla’s blue banners along the wall. The halls inside are placed.'
		],
		eras: [{ year: 642, en: '642 · the siege', ko: '642 · 대야성 함락' }]
	},
	{
		id: 'chek',
		ready: true,
		en: 'Yeon Fortress',
		ko: '책성',
		place: 'Chek Fortress — the Yeon home in the snow country of the east',
		years: 'Named in 98; the Yeon seat in the 640s',
		refs: [
			{ src: '/pl_yeon_fortress.png', caption: 'Chronicle board — the summit above the clouds' },
			{ src: '/pl_chek_fortress.png', caption: 'Chronicle board — the causeway gate' }
		],
		facts: [
			'Chekseong is Goguryeo’s eastern seat; King Taejo tours it in 98. It is usually placed near Hunchun on the lower Tumen.',
			'In the chronicle it is the Yeon clan’s home fortress, where Gesomun grows up.',
			'The model follows the two boards, not a survey: a walled summit with a red two-storey keep on a granite pinnacle above a sea of cloud, and a walled causeway climbing the ridge to a red two-tier gate.'
		],
		eras: [{ year: 642, en: '642 · the Yeon', ko: '642 · 연씨 가문' }]
	},
	{
		id: 'wirye',
		ready: true,
		en: 'Wirye',
		ko: '위례성',
		place: 'The Han — an oval earthen city on the flat, a fort on the hill',
		years: 'Baekje’s capital until 475',
		refs: [{ src: '/pl_wirye.png', caption: 'Chronicle board — Wirye above the river' }],
		facts: [
			'Onjo founds Baekje at Wirye in the annals’ count. The Han-river capital stands until 475, when Goguryeo takes it and King Gaero dies.',
			'Two excavated walls answer to the name: Pungnap, an oval of rammed earth some 3.5 km round on the flat bank, and Mongchon, an earthen fort on the hills to the south-east.',
			'The bluff fort here carries the board’s tan wall, red two-tier gate and Baekje’s yellow banners; the halls inside both walls are placed.'
		],
		eras: [{ year: 470, en: '470 · Gaero', ko: '470 · 개로왕' }],
		light: 'golden'
	},
	{
		id: 'mugun',
		ready: true,
		en: 'Mugun',
		ko: '무근성',
		place: 'Tamla — the island seat on the north shore',
		years: 'Tamla submits to Silla 662',
		refs: [{ src: '/pl_mugun_fortress.png', caption: 'Chronicle board — Mugun by the sea' }],
		facts: [
			'Mugunseong, “the old fortress”, is the name that survives in Jeju’s old town for Tamla’s first wall.',
			'Tamla sends envoys to Baekje; after Baekje falls, its lord submits to Silla in 662. In the chronicle Gyebek spends five years here in exile.',
			'Black basalt laid dry, thatched houses, orange groves behind windbreak walls, Hallasan inland. The layout follows the board and is placed.'
		],
		eras: [{ year: 655, en: '655 · Tamla', ko: '655 · 탐라' }]
	},
	{
		id: 'daming',
		ready: true,
		en: 'Daming Palace',
		ko: '대명궁',
		place: 'Chang’an — on Longshou plateau at the north-east edge of the city',
		years: 'Begun 634; the Tang court from 663',
		refs: [
			{ src: '/pl_daming.png', caption: 'Chronicle board — Hanyuan Hall and its towers' },
			{ src: '/pl_daming_night.png', caption: 'Chronicle board — Hanyuan by night' },
			{ src: '/pl_daming_palace.png', caption: 'Chronicle board — the approach' }
		],
		facts: [
			'Taizong begins a summer palace for his father in 634. Gaozong rebuilds it as the main court, and from 663 he and Empress Wu rule from here rather than from Taiji Palace in the city.',
			'Excavation fixes the frame: the south wall is the city’s north wall, Danfeng Gate has five passages, and Hanyuan Hall stands about 610 m north of it on red rammed-earth terraces about 76 × 42 m, with the Dragon Tail Way climbing to it and three-stepped que towers on brick-faced piers to either side.',
			'Xuanzheng Hall (the regular audience) and Zichen Hall (the inner audience) follow on the axis; Taiye Pond, with Penglai island, fills the rear court, and Linde Hall stands to its west.',
			'Chunchu’s audience in 648 and Euija’s death in 660 come before Hanyuan is finished; those scenes belong to Taiji Palace. Grey tiles with owl-tail ridges, vermilion columns, white walls: no yellow glaze, no Forbidden City.'
		],
		eras: [{ year: 663, en: '663 · Gaozong and Empress Wu', ko: '663 · 고종과 측천무후' }],
		light: 'night'
	},
	{
		id: 'asuka',
		ready: true,
		en: 'Asuka',
		ko: '아스카',
		place: 'Yamato — the small basin of the Asuka river, south of the three hills',
		years: 'The court’s home through most of the 7th century',
		refs: [{ src: '/pl_asuka.png', caption: 'Chronicle board — the Asuka court' }],
		facts: [
			'The palaces of Asuka stack on one site: Okamoto, then Itabuki (643), then Kiyomihara. They are post-in-ground halls under cypress bark inside roofed fences, with a stone-paved yard and a stone-lined well.',
			'In the sixth month of 645, while a memorial from the three Korean kingdoms is read in Itabuki’s main hall, Prince Naka no Ōe and Nakatomi no Kamatari cut down Soga no Iruka. His father Emishi burns his house on Amakashi hill the next day, and the court moves to Naniwa.',
			'Asuka-dera, the Soga temple, is the tiled exception: Baekje sent its temple builders, tile makers and pagoda master in 588. One pagoda, three golden halls round it, a cloister, and the Great Buddha that still sits in place.',
			'The board’s red-and-white cloister is read here as Asuka-dera’s; the palace keeps its excavated bark roofs.'
		],
		eras: [{ year: 645, en: '645 · the Isshi incident', ko: '645 · 을사의 변' }]
	}
];
