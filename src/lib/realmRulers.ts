/**
 * Who rules each civilization in a given year, for the map's ruler pills.
 * Samhan is read off the year's borders: while more than one Samhan crown stands,
 * the realm is divided, and finding it one ruler is what the chronicle is about.
 */
import { SAMHAN_POLITIES } from './cosmos.ts';
import { holdingsAt, polityName, type PolityId } from './borders.ts';

export type RealmRuler = { en: string; ko: string; divided?: boolean };

/** Accession year, then the name. A `null` name closes the table. */
type Reign = [from: number, en: string | null, ko?: string, divided?: boolean];

const SILLA: Reign[] = [
	[540, 'King Jinheung', '진흥왕'],
	[576, 'King Jinji', '진지왕'],
	[579, 'King Jinpyeong', '진평왕'],
	[632, 'Queen Sunduk', '선덕여왕'],
	[647, 'Queen Jinduk', '진덕여왕'],
	[654, 'King Muyeol', '무열왕'],
	[661, 'King Munmu', '문무왕'],
	[681, 'King Sinmun', '신문왕'],
	[692, 'King Hyoso', '효소왕'],
	[702, 'King Seongdeok', '성덕왕'],
	[737, 'King Hyoseong', '효성왕'],
	[742, 'King Gyeongdeok', '경덕왕'],
	[765, 'King Hyegong', '혜공왕'],
	[780, 'King Seondeok', '선덕왕'],
	[785, 'King Wonseong', '원성왕'],
	[799, null]
];

const GOGURYEO: Reign[] = [
	[590, 'King Yeongyang', '영양왕'],
	[618, 'King Yeongnyu', '영류왕'],
	[642, 'King Bojang', '보장왕'],
	[669, null]
];

const BAEKJE: Reign[] = [
	[554, 'King Wideok', '위덕왕'],
	[598, 'King Hye', '혜왕'],
	[599, 'King Beop', '법왕'],
	[600, 'King Mu', '무왕'],
	[641, 'King Euija', '의자왕'],
	[661, null]
];

const KINGS: Partial<Record<PolityId, Reign[]>> = { silla: SILLA, goguryeo: GOGURYEO, baekje: BAEKJE };

/** Every civilization but Samhan, by label nation id. */
const REALMS: Record<string, Reign[]> = {
	hwa: [
		[581, 'Emperor Wen of Sui', '수 문제'],
		[604, 'Emperor Yang of Sui', '수 양제'],
		[618, 'Emperor Gaozu', '당 고조'],
		[626, 'Emperor Taizong', '당 태종'],
		[649, 'Emperor Gaozong', '당 고종'],
		[684, 'Empress Wu (regent)', '측천무후 (섭정)'],
		[690, 'Empress Wu Zetian', '측천무후'],
		[705, 'Emperor Zhongzong', '당 중종'],
		[710, 'Emperor Ruizong', '당 예종'],
		[712, 'Emperor Xuanzong', '당 현종'],
		[757, null]
	],
	wa: [
		[593, 'Empress Suiko', '스이코'],
		[629, 'Emperor Jomei', '조메이'],
		[642, 'Empress Kōgyoku', '고교쿠'],
		[645, 'Emperor Kōtoku', '고토쿠'],
		[655, 'Empress Saimei', '사이메이'],
		[661, 'Emperor Tenji', '덴지'],
		[672, 'Emperor Tenmu', '덴무'],
		[686, 'Empress Jitō', '지토'],
		[697, 'Emperor Monmu', '몬무'],
		[707, 'Empress Genmei', '겐메이'],
		[715, 'Empress Genshō', '겐쇼'],
		[724, 'Emperor Shōmu', '쇼무'],
		[750, null]
	],
	'northern-nomads': [
		[603, 'Qimin Khagan', '계민 가한'],
		[609, 'Shibi Khagan', '시필 가한'],
		[619, 'Chuluo Khagan', '처라 가한'],
		[620, 'Illig Khagan', '힐리 가한'],
		[630, 'Under Tang rule', '당의 지배'],
		[682, 'Ilterish Khagan', '일테리시 카간'],
		[692, 'Qapaghan Khagan', '카파간 카간'],
		[716, 'Bilge Khagan', '빌게 카간'],
		[735, null]
	],
	tubo: [
		[618, 'Songtsen Gampo', '송첸캄포'],
		[650, 'Mangsong Mangtsen', '망송망첸'],
		[677, 'Tridu Songtsen', '티두송첸'],
		[704, 'Tride Tsuktsen', '티데축첸'],
		[755, null]
	],
	cheonchuk: [
		[606, 'Harsha (North India)', '계일왕 (북천축)'],
		[647, 'Divided', '분열', true],
		[800, null]
	],
	persia: [
		[590, 'Khosrow II', '호스로 2세'],
		[628, 'Civil war', '내전', true],
		[632, 'Yazdegerd III', '야즈데게르드 3세'],
		[651, 'Caliph Uthman', '칼리파 우스만'],
		[656, 'Caliph Ali', '칼리파 알리'],
		[661, 'Caliph Muawiya', '칼리파 무아위야'],
		[680, 'Caliph Yazid', '칼리파 야지드'],
		[683, 'Civil war', '내전', true],
		[685, 'Caliph Abd al-Malik', '칼리파 압둘말리크'],
		[705, 'Caliph al-Walid', '칼리파 왈리드'],
		[715, null]
	],
	bullim: [
		[582, 'Emperor Maurice', '마우리키우스 황제'],
		[602, 'Emperor Phocas', '포카스 황제'],
		[610, 'Emperor Heraclius', '헤라클리우스 황제'],
		[641, 'Emperor Constans II', '콘스탄스 2세'],
		[668, 'Emperor Constantine IV', '콘스탄티누스 4세'],
		[685, 'Emperor Justinian II', '유스티니아누스 2세'],
		[695, 'Emperor Leontios', '레온티오스 황제'],
		[698, 'Emperor Tiberios III', '티베리오스 3세'],
		[705, 'Emperor Justinian II', '유스티니아누스 2세'],
		[711, 'Emperor Philippikos', '필리피코스 황제'],
		[713, 'Emperor Anastasios II', '아나스타시오스 2세'],
		[715, 'Emperor Theodosios III', '테오도시오스 3세'],
		[717, 'Emperor Leo III', '레오 3세'],
		[741, null]
	],
	'southern-seas': [
		[-3000, 'Many harbour kings', '여러 항구의 왕들', true],
		[9000, null]
	]
};

function reignAt(list: Reign[], year: number): RealmRuler | null {
	let hit: Reign | null = null;
	for (const r of list) if (r[0] <= year) hit = r;
	if (!hit || !hit[1]) return null;
	return { en: hit[1], ko: hit[2] ?? hit[1], divided: hit[3] };
}

/** Island vassals do not split the realm. */
const VASSALS = new Set(['tamla', 'usan']);
const ORDER = ['goguryeo', 'baekje', 'silla', 'gaya'];

/** Samhan's crowns this year: one ruler, or the realm named divided with each crown. */
function samhanRuler(year: number): RealmRuler | null {
	const crowns = [...new Set(holdingsAt(year).map((h) => h.polity))].filter(
		(p): p is PolityId => !!p && SAMHAN_POLITIES.has(p) && !VASSALS.has(p)
	);
	if (!crowns.length) return null;
	crowns.sort((a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99));
	const named = crowns.map((p) => {
		const king = KINGS[p] ? reignAt(KINGS[p], year) : null;
		const name = polityName(p, year);
		return king ?? { en: name.label, ko: name.korean };
	});
	if (named.length === 1) return named[0];
	return {
		en: `Divided: ${named.map((n) => n.en).join(' · ')}`,
		ko: `분열: ${named.map((n) => n.ko).join(' · ')}`,
		divided: true
	};
}

/** The ruler of a civilization (label `nation` id) in `year`, or null where unknown. */
export function realmRuler(nation: string, year: number): RealmRuler | null {
	if (nation === 'samhan') return samhanRuler(year);
	const list = REALMS[nation];
	return list ? reignAt(list, year) : null;
}
