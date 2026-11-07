/**
 * Sites on the 3D stage. Geometry lives in `$lib/stage/build/*` (metres, +x east, +z south).
 * Outlines come from survey where we have it (Wolseong: OpenStreetMap); halls whose sites
 * are only recorded in the annals are placed, and each label says which is which.
 */

import { KINGDOMS } from '$lib/people';
import type { LabelStatus, LightPreset } from './build/types';

export type StageSiteId =
	| 'moon'
	| 'sabi'
	| 'pyongyang'
	| 'ansi'
	| 'daeya'
	| 'chek'
	| 'wirye'
	| 'mugun'
	| 'daming'
	| 'asuka'
	| 'yodong'
	| 'geumgwan'
	| 'buyeo'
	| 'jolbon'
	| 'nakrang'
	| 'threerealms'
	| 'flowerfield'
	| 'underworld'
	| 'skypalace';

export type StageSite = {
	id: StageSiteId;
	/** Built enough to orbit. */
	ready: boolean;
	en: string;
	ko: string;
	/** Whose banner flies over it in the site's year: a KINGDOMS key, or a realm. */
	flag: SiteFlagId;
	/** Sidebar group. */
	group: 'goguryeo' | 'kingdoms' | 'abroad' | 'realms';
	/** A myth place with no hour: the time-of-day slider is off and the scene keeps the realm's own light. */
	timeless?: boolean;
	place: string;
	years: string;
	refs: { src: string; caption: string }[];
	/** Short lines under the view. */
	facts: string[];
	/** Moments the model can show; the last is the default unless `defaultYear` names one. `flag` overrides the site's banner in that era. */
	eras: { year: number; en: string; ko: string; flag?: SiteFlagId }[];
	defaultYear?: number;
	/** Credit line for survey data drawn into the model. */
	credit?: string;
	/** The light the board was painted in, set when the site opens. */
	light?: LightPreset;
	/** How much of the model stands on evidence, in one line. */
	basis: { kind: 'historical' | 'mixed' | 'fictional'; note: string };
};

export const STATUS_LEGEND: { id: LabelStatus; en: string; ko: string }[] = [
	{ id: 'survey', en: 'Outline from survey', ko: '측량' },
	{ id: 'standing', en: 'Still standing', ko: '현존' },
	{ id: 'excavated', en: 'Excavated', ko: '발굴' },
	{ id: 'recorded', en: 'In the annals; site placed', ko: '기록' },
	{ id: 'placed', en: 'Placed by us', ko: '추정' },
	{ id: 'fictional', en: 'Invented for the chronicle', ko: '창작' }
];

/** Realm banners, which no kingdom table holds. */
const REALM_COLORS = {
	underworld: { color: '#2eb8c4', en: 'The Underworld' },
	realms: { color: '#7d6bd6', en: 'The Three Realms' },
	heaven: { color: '#f2c14e', en: 'Heaven' },
	flowers: { color: '#8fbf8a', en: 'The Western Flower Field' },
	han: { color: '#6b5a3a', en: 'Han commandery' }
} satisfies Record<string, { color: string; en: string }>;

export type SiteFlagId = keyof typeof KINGDOMS | keyof typeof REALM_COLORS;

const isRealmFlag = (f: SiteFlagId): f is keyof typeof REALM_COLORS => f in REALM_COLORS;

/** The era a year falls in: the latest era at or before it, else the first. */
export function eraOf(s: StageSite, year: number): StageSite['eras'][number] {
	let best = s.eras[0];
	for (const e of s.eras) if (e.year <= year && e.year >= best.year) best = e;
	return best;
}

/** The banner a site flies in the sidebar: a flag board where one exists, else a colour swatch. An era may fly another kingdom's. */
export function siteFlag(s: StageSite, year?: number): { src?: string; color: string; name: string } {
	const flag = (year === undefined ? undefined : eraOf(s, year).flag) ?? s.flag;
	if (isRealmFlag(flag)) return { color: REALM_COLORS[flag].color, name: REALM_COLORS[flag].en };
	const k = KINGDOMS[flag];
	return { src: k.flag, color: k.color, name: k.label };
}

/** The sidebar thumbnail: the site's first board. */
export function siteThumb(s: StageSite): string | undefined {
	return s.refs[0]?.src;
}

export const SITE_GROUPS: { id: StageSite['group']; en: string; ko: string }[] = [
	{ id: 'goguryeo', en: 'Goguryeo’s fortresses', ko: '고구려 성' },
	{ id: 'kingdoms', en: 'Kingdoms', ko: '나라' },
	{ id: 'abroad', en: 'Abroad', ko: '바다 건너' },
	{ id: 'realms', en: 'Realms', ko: '신화' }
];

export const BASIS_LABEL: Record<StageSite['basis']['kind'], { en: string; ko: string }> = {
	historical: { en: 'Historical', ko: '사실' },
	mixed: { en: 'Historical frame, placed halls', ko: '사실 + 추정' },
	fictional: { en: 'Mostly invented', ko: '대부분 창작' }
};

export const STAGE_SITES: StageSite[] = [
	{
		id: 'moon',
		ready: true,
		flag: 'silla',
		group: 'kingdoms',
		basis: { kind: 'mixed', note: 'Rampart, moats, Wolji, bridges and tombs follow survey and excavation; the halls inside the crescent are placed.' },
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
			'The crescent is real: an earthen rampart, longer east–west than north–south, south wall against the bend of the Southern Stream (Namcheon, 남천). The stream is the natural moat. North, west, and east had dug moats.',
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
		flag: 'baekje',
		group: 'kingdoms',
		basis: { kind: 'mixed', note: 'River, Busosan and the Gwanbuk-ri finds are real; the palace layout over them is ours.' },
		en: 'Sabi',
		ko: '사비',
		place: 'Buyeo — Busosanseong on the hill, Gwanbuk-ri palace on the flat',
		years: 'Capital 538–660',
		refs: [{ src: '/pl_sabi_palace.png', caption: 'Chronicle board — Sabi palace' }],
		facts: [
			'King Seong moves the Baekje capital from Ungjin to Sabi in 538. The city falls in 660.',
			'The defended height is Busosanseong, a mountain fortress on the north side of the plain. The palace buildings archaeologists can point to are at Gwanbuk-ri, on the flat ground south of that hill: corridors, large halls, stone drains. Timber is gone.',
			'The White River (백강) is this water at the mouth, pale and wide. At the palace it is still the Baengma (Geum), running south and west. Jeongnimsa’s stone pagoda is the survivor in the city. At Gwanbuk-ri the dig found a big hall platform, a square lotus pond and timber storage pits; the courts, gates and gardens around them are placed.',
			'Naseong, the outer earthen wall around the capital, is not modelled yet.'
		],
		eras: [{ year: 640, en: '640 · Mu', ko: '640 · 무왕' }]
	},
	{
		id: 'pyongyang',
		ready: true,
		flag: 'goguryeo',
		group: 'goguryeo',
		basis: { kind: 'mixed', note: 'The four-city circuit and the rivers are real but drawn schematically; the palace and the board’s munru are placed or invented.' },
		en: 'Pyongyang',
		ko: '평양',
		place: 'Jangan Fortress — four walls on the north bank of Blaze Creek',
		years: 'Capital from 427; Jangan walled from 552, the court inside from 586',
		refs: [{ src: '/pl_pyongyang_fortress.png', caption: 'Chronicle board — red munru fortress' }],
		facts: [
			'Jangsu moves the Goguryeo capital from Gungnae to Pyongyang in 427. Jangan Fortress is begun in 552 and the court moves inside in 586; inscribed wall stones record the work in between.',
			'One long circuit holds four cities: the north citadel on Moranbong, the inner city with the palace, and the middle and outer cities on the flats down to where the Botong meets Blaze Creek (패수, the Daedong at this bank). The outer city was laid out on a street grid.',
			'The wall lines here are schematic and the palace inside the inner city is placed, after the walled compound and axis of Anhak. The board’s red two-tier munru stands on the citadel rim above the river.',
			'In the chronicle the city stands on conquered Nakrang: the old earthen wall still runs, slumped and breached, through the middle city, and Nakrang’s drum stands slit and unroofed in the palace front yard.',
			'In the ninth month of 668 Pyongyang falls to Li Ji and the Silla army. The Tang seat the Protectorate General to Pacify the East (안동도호부) here under Xue Rengui. In that era a Chinese-style compound stands in front of the old castle: red rammed-earth terrace, que towers, white walls, grey tiles with owl-tail ridges.'
		],
		eras: [
			{ year: 640, en: '640 · Yeongnyu', ko: '640 · 영류왕' },
			{ year: 668, en: '668 · the Tang protectorate', ko: '668 · 안동도호부', flag: 'tang' }
		],
		defaultYear: 640
	},
	{
		id: 'ansi',
		ready: true,
		flag: 'goguryeo',
		group: 'goguryeo',
		basis: { kind: 'mixed', note: 'A horseshoe of walled ridges in the Qianshan foothills, as at Yingchengzi; the summit halls are the board’s invention.' },
		en: 'Ansi',
		ko: '안시성',
		place: 'Mountain fortress — Yingchengzi, Haicheng, in the usual identification',
		years: 'Siege 645',
		refs: [{ src: '/pl_ansi.png', caption: 'Chronicle board — Ansi' }],
		facts: [
			'In 645 Taizong’s army sits under Ansi for some three months and leaves without it. The commander is unnamed in the histories this chronicle uses.',
			'The usual identification is the Yingchengzi fortress at Haicheng: stone walls along a horseshoe of ridges round a valley, a gate where the valley opens.',
			'For sixty days the Tang heap an earthen mound against the south-east wall. It slumps onto the wall, the defenders take it, and the Tang never win it back.',
			'The usual identification puts Ansi in the Qianshan foothills, ridges on every side but the valley mouth. The red command halls on the summit, above a sea of cloud, are the board’s invention.'
		],
		eras: [{ year: 645, en: '645 · the siege', ko: '645 · 안시성 싸움' }]
	},
	{
		id: 'daeya',
		ready: true,
		flag: 'silla',
		group: 'kingdoms',
		basis: { kind: 'mixed', note: 'The fortress, its hill and the siege of 642 are real; the gate follows the board and the halls are placed.' },
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
		flag: 'goguryeo',
		group: 'goguryeo',
		basis: { kind: 'fictional', note: 'Chekseong is real, but this pinnacle, keep and causeway are invented from the boards.' },
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
		flag: 'baekje',
		group: 'kingdoms',
		basis: { kind: 'mixed', note: 'Both excavated walls are real; the red gate is the board’s and the halls are placed.' },
		en: 'Han Fortress',
		ko: '한성',
		place: 'The Han — an oval earthen city on the flat, a fort on the hill, held by three kingdoms in turn',
		years: 'Baekje’s Wirye to 475; Goguryeo’s Hanseong to 551; Silla’s from 553',
		refs: [{ src: '/pl_wirye.png', caption: 'Chronicle board — Wirye above the river' }],
		facts: [
			'Onjo founds Baekje at Wirye in the annals’ count. The Han-river capital stands until 475, when Goguryeo takes it and King Gaero dies.',
			'Two excavated walls answer to the name: Pungnap, an oval of rammed earth some 3.5 km round on the flat bank, and Mongchon, an earthen fort on the hills to the south-east.',
			'Goguryeo keeps the Han as its southern seat. Its pottery is dug up in Mongchon, and its small stone redoubts ring the Achasan ridge across the river.',
			'In 551 Silla and Baekje take the river back together; two years later Silla turns on Baekje and keeps all of it. Jinheung tours the new land and sets a stele on Bukhansan.',
			'The bluff fort carries the board’s tan wall and two-tier gate; the banners change with the holder: Baekje yellow, Goguryeo red, Silla blue. The halls inside both walls are placed.'
		],
		eras: [
			{ year: 470, en: '470 · Baekje’s Wirye', ko: '470 · 백제 위례성', flag: 'baekje' },
			{ year: 500, en: '500 · Goguryeo’s Hanseong', ko: '500 · 고구려 한성', flag: 'goguryeo' },
			{ year: 640, en: '640 · Silla’s Han', ko: '640 · 신라의 한강', flag: 'silla' }
		],
		defaultYear: 470,
		light: 'golden'
	},
	{
		id: 'mugun',
		ready: true,
		flag: 'tamla',
		group: 'kingdoms',
		basis: { kind: 'fictional', note: 'Tamla’s seat on the north shore is real; this fortress, its layout and the lord’s hall are invented.' },
		en: 'Mugun',
		ko: '무근성',
		place: 'Tamla — the island seat on the north shore',
		years: 'Tamla submits to Silla 662',
		refs: [{ src: '/pl_mugun_fortress.png', caption: 'Chronicle board — Mugun by the sea' }],
		facts: [
			'Mugunseong, “the old fortress”, is the name that survives in Jeju’s old town for Tamla’s first wall.',
			'Tamla sends envoys to Baekje; after Baekje falls, its lord submits to Silla in 662. In the chronicle Gyebek spends five years here in exile.',
			'Black basalt laid dry, thatched houses, orange groves behind windbreak walls, Hallasan inland. The ring, its layout and the lord’s hall follow the board and are invented.',
			'The myths sit on the same shore: the three princes’ well inland of the ring, the star brothers’ two flowers, Kangrim’s old house, the magistrate’s yard, and a port where the boats leave.'
		],
		eras: [{ year: 655, en: '655 · Tamla', ko: '655 · 탐라' }]
	},
	{
		id: 'daming',
		ready: true,
		flag: 'tang',
		group: 'abroad',
		basis: { kind: 'historical', note: 'Walls, gates, terraces and halls follow the excavation reports in round numbers.' },
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
		flag: 'yamato',
		group: 'abroad',
		basis: { kind: 'historical', note: 'Palace, temple and the Soga hill follow the excavations; Asuka-dera’s cloister colours follow the board.' },
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
	},
	{
		id: 'yodong',
		ready: true,
		flag: 'goguryeo',
		group: 'goguryeo',
		basis: { kind: 'mixed', note: 'A walled plain city on the Taizi above the Liao flats, as at Liaoyang; the cliff munru follows the board.' },
		en: 'Yodong',
		ko: '요동성',
		place: 'Liaoyang — the walled city on the Taizi, guarding the crossing of the Liao',
		years: 'Goguryeo from 404; falls to Taizong 645',
		refs: [{ src: '/pl_yodong_fortress.png', caption: 'Chronicle board — the red munru above the braided river' }],
		facts: [
			'Yodong is the great fortress that faces west across the Liao, the first wall any army out of China has to break. The Sui break on it three times.',
			'It stands where Liaoyang stands now: flat ground on the Taizi, a braided river of sandbars and channels, the mountains of the east behind.',
			'In 645 Taizong fills its moat, rams the walls and fires the town in a south wind. The red two-tier munru on the bluff is the board’s.'
		],
		eras: [{ year: 645, en: '645 · the siege', ko: '645 · 요동성 전투' }]
	},
	{
		id: 'geumgwan',
		ready: true,
		flag: 'gaya',
		group: 'kingdoms',
		basis: { kind: 'mixed', note: 'Gimhae, Gujibong and the old bay are real; the palace follows the board.' },
		en: 'Golden Gaya',
		ko: '금관가야',
		place: 'Gimhae — the palace by the bay under Gujibong',
		years: 'Suro’s line to 532',
		refs: [{ src: '/pl_gaya_palace.png', caption: 'Chronicle board — the Gaya palace' }],
		facts: [
			'Suro comes down on Gujibong in a golden box, and Heo Hwang-ok sails in under a red sail. Golden Gaya is the iron kingdom of the south coast.',
			'Its last king, Guhae, surrenders to Silla in 532. His great-grandson is Kim Yushin.',
			'The bay reached far inland then. Walled courts, corner towers and the mist off the water follow the board.'
		],
		eras: [{ year: 530, en: '530 · Guhae', ko: '530 · 구해왕' }]
	},
	{
		id: 'buyeo',
		ready: true,
		flag: 'buyeo',
		group: 'kingdoms',
		basis: { kind: 'fictional', note: 'Buyeo’s plain is real; the rock and the hill palace follow the boards.' },
		en: 'Buyeo',
		ko: '부여',
		place: 'The northern kingdom — a town on a great rock above a winding river; later Goguryeo’s Buyeo Fortress',
		years: 'The age of Geumwa and Daeso; Goguryeo’s northern seat from 494, the wall begun 631',
		refs: [
			{ src: '/pl_northern_buyeo.png', caption: 'Chronicle board — the rock town' },
			{ src: '/pl_buyeo_palace.png', caption: 'Chronicle board — the palace on the hill' }
		],
		facts: [
			'Buyeo is the old kingdom of the north plain, older than Goguryeo and proud of it. Its lords wear white at home.',
			'Geumwa finds Yuhwa by the river here, and Jumong grows up in his yard.',
			'The rock, the town on its slopes and the tile-and-thatch palace follow the boards.',
			'Goguryeo takes the last of Buyeo in 494 and builds Buyeo Fortress on the old capital: one of the four great corner fortresses, keeping the north steppe at the head of the thousand-li wall.',
			'In that era the rock gets a stone ring under red banners, an earthen outer ring at its foot, and the long wall leaving east and south with a beacon every half kilometre. Its line is schematic.'
		],
		eras: [
			{ year: -40, en: 'Geumwa’s court', ko: '금와왕' },
			{ year: 640, en: '640 · Buyeo Fortress', ko: '640 · 고구려 부여성', flag: 'goguryeo' }
		],
		defaultYear: -40
	},
	{
		id: 'jolbon',
		ready: true,
		flag: 'jolbon',
		group: 'kingdoms',
		basis: { kind: 'mixed', note: 'Onyeosan above the Hun river is the usual site; the town under it is placed.' },
		en: 'Jolbon',
		ko: '졸본',
		place: 'Onyeosan — the flat-topped cliff above the Hun river',
		years: 'Jumong’s first seat',
		refs: [{ src: '/pl_jolbon.png', caption: 'Chronicle board — the cliff mesa' }],
		facts: [
			'Jumong rides south out of Buyeo and stops where Sosuno’s people already live. Goguryeo starts here.',
			'The usual site is Onyeosan at Huanren: a flat-topped mountain ringed by cliffs, with the Hun river below.',
			'The town in the valley and the walls on the rim are placed.'
		],
		eras: [{ year: -37, en: 'Jumong’s founding', ko: '동명성왕' }]
	},
	{
		id: 'nakrang',
		ready: true,
		flag: 'han',
		group: 'kingdoms',
		basis: { kind: 'mixed', note: 'A Han earthen city is real but was excavated on the south bank; the chronicle sets it on the north bank, under the later Pyongyang. The drum pavilion is the board’s.' },
		en: 'Nakrang',
		ko: '낙랑',
		place: 'The north bank of the Daedong — a Han earthen city with a drum that sounds by itself',
		years: 'Until Hodong’s raid',
		refs: [{ src: '/pl_magic_drum.png', caption: 'Chronicle board — the drum that warns' }],
		facts: [
			'Nakrang is the old Han commandery on the flats below Moranbong. Goguryeo will build Pyongyang on top of it.',
			'Its drum beats by itself when an enemy comes. The princess cuts it for Prince Hodong, and the city falls.',
			'The rammed-earth wall follows the excavated Han city at Tosŏng-ri, moved to the north bank for the story; the drum, its stand and the hall behind follow the board.'
		],
		eras: [{ year: 32, en: 'Hodong and the princess', ko: '호동왕자와 낙랑공주' }],
		light: 'night'
	},
	{
		id: 'threerealms',
		ready: true,
		flag: 'realms',
		group: 'realms',
		timeless: true,
		basis: { kind: 'fictional', note: 'A myth place: the pavilion where the three realms meet.' },
		en: 'Three Realms Pavilion',
		ko: '삼계정자',
		place: 'An islet where three waters meet: the living, the dead and the flower field',
		years: 'Once a year',
		refs: [{ src: '/pl_three_realms_pavillion.png', caption: 'Chronicle board — the yearly pavilion' }],
		facts: [
			'A small pavilion that belongs to none of the three courts. The gods meet here once a year.',
			'Three rivers run into one pool around it, each its own colour. The servants arrive first.'
		],
		eras: [{ year: 600, en: 'The yearly meeting', ko: '연례 회의' }]
	},
	{
		id: 'flowerfield',
		ready: true,
		flag: 'flowers',
		group: 'realms',
		timeless: true,
		basis: { kind: 'fictional', note: 'A myth place: Hallakgungi’s rows.' },
		en: 'Western Flower Field',
		ko: '서천꽃밭',
		place: 'Far enough west that living maps end — a small walled garden of named flowers',
		years: 'Always in bloom',
		refs: [{ src: '/pl_western_flower_field.png', caption: 'Chronicle board — the flower field' }],
		facts: [
			'The Gardener’s realm. Flowers that raise the dead grow in the same rows as the flower that ends a family.',
			'The beds follow the Jeju song of Hallakgungi (이공본풀이): bone-, flesh-, blood-, breath- and soul-reviving flowers, the laughing, fighting and weeping flowers, the flower of ruin, and the flower of rebirth.',
			'Hallakgungi keeps the gate. Past the walls the field runs on into mist.'
		],
		eras: [{ year: 600, en: 'Hallakgungi’s rows', ko: '할락궁이의 꽃밭' }],
		light: 'day'
	},
	{
		id: 'underworld',
		ready: true,
		flag: 'underworld',
		group: 'realms',
		timeless: true,
		basis: { kind: 'fictional', note: 'A myth place: Big Star’s court, built as a Korean temple-palace in the dark, after the Ten Kings paintings.' },
		en: 'The Underworld',
		ko: '저승',
		place: 'Big Star’s court — a temple-palace past the River of Three Crossings',
		years: 'Keeps its own time',
		refs: [{ src: '/pl_underworld.png', caption: 'Chronicle board — the land of the dead' }],
		facts: [
			'Big Star’s realm: judgment, the ledger, and borders no living map admits.',
			'The dead cross the Samdo (삼도천) three ways: the good by the bridge, the middling by the ford, the wicked through the deep. An old ferryman takes a coin.',
			'Inside: the one-pillar gate, the Four Heavenly Kings, the Ten Kings’ halls round the judgment court, Jijang’s hall for those still waiting, the karma mirror and the scales.',
			'Look for the envoy’s rice table at the gate: three bowls and three pairs of straw shoes, laid out so the messengers go easy on whoever they came for.',
			'A navy valley lit from below by a lake that glows, and by lotus lanterns down every path. Yumla judges; Kangrim collects.'
		],
		eras: [{ year: 600, en: 'Big Star’s court', ko: '대별왕의 저승' }],
		light: 'night'
	},
	{
		id: 'skypalace',
		ready: true,
		flag: 'heaven',
		group: 'realms',
		timeless: true,
		basis: { kind: 'fictional', note: 'A myth place: the courts of the sky gods, each on its own floating isle.' },
		en: 'Sky Palace',
		ko: '하늘궁',
		place: 'The sky gods’ palaces on islands of rock above a sea of cloud, joined by sky bridges',
		years: 'After the flower wager',
		refs: [{ src: '/pl_western.png', caption: 'Chronicle board — the court in the sky' }],
		facts: [
			'Little Star won the living world by swapping flowers, and keeps his house above it in the clouds.',
			'His neighbours each keep their own isle: Haemosu’s sun court with the stable of his five-dragon chariot, Ibiga’s cloud court, Samsin Halmi’s birth garden where a flower is planted for every child, and the Sky Lord’s high white hall above them all.',
			'Sky bridges join the isles in a ring and to the centre; the cloud sea lies below.'
		],
		eras: [{ year: 600, en: 'Little Star’s court', ko: '소별왕의 하늘궁' }],
		light: 'golden'
	}
];

/** Old site ids that now open an era of a merged site. */
export const SITE_ALIASES: Record<string, { site: StageSiteId; year: number }> = {
	buyeofort: { site: 'buyeo', year: 640 },
	hansung: { site: 'wirye', year: 640 }
};
