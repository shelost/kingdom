/**
 * The record behind a `quote` block, read off its `source` line: "Samguk Sagi (三國史記) bk. 5, …".
 * Every book, stone and recitation the chronicle cites has its own seal, so a reader can tell
 * at a glance whose testimony this is and which country wrote it down.
 */

/** How the record was kept — drives the card's material (paper, stone rubbing, epitaph, sutra…). */
export type RecordKind = 'annal' | 'myth' | 'stele' | 'tomb' | 'sutra' | 'shaman' | 'letter' | 'stage';

/** Who wrote it down. */
export type RecordNation = 'korea' | 'china' | 'japan' | 'jeju' | 'india';

export type SealShape = 'square' | 'round' | 'oval' | 'tall' | 'wide' | 'lozenge';

export type RecordSeal = {
	/** Characters cut into the seal, read in columns right to left. */
	text: string;
	shape: SealShape;
	/** Ink colour of the seal paste. */
	color: string;
	/** `intaglio`: the characters are cut away (paper-coloured text on ink). `relief`: inked characters inside an inked border. */
	cut: 'intaglio' | 'relief';
	/** A second ruled border inside the first. */
	double?: boolean;
	/** Resting tilt in degrees — each stamp lands a little differently. */
	tilt: number;
};

export type RecordBook = {
	/** Romanized title before the parenthesis — "Samguk Sagi". */
	name: string;
	/** Korean title. */
	ko?: string;
	/** Null when the source names no title the seal can carry. */
	seal: RecordSeal | null;
	/** Everything after the title — book, chapter, edition. */
	detail: string;
	kind: RecordKind;
	nation: RecordNation | null;
	/** "Korean record · Goryeo, 1145" — who kept it and when. */
	origin?: string;
};

type BookDef = {
	match: RegExp;
	ko?: string;
	kind: RecordKind;
	nation: RecordNation;
	origin: string;
	seal: Omit<RecordSeal, 'text'> & { text?: string };
};

const VERMILION = '#b8302a';
const CINNABAR = '#c8442c';
const CRIMSON = '#9e1f2c';
const OXBLOOD = '#7c1d1d';
const PERSIMMON = '#cf5a2a';
const CHALK = '#d9d1c1';
const SAFFRON = '#c98a1a';
const JADE = '#1f7a72';

/** First match wins — specific stones before the generic epitaph rule. */
const BOOKS: BookDef[] = [
	{
		match: /三國史記|Samguk Sagi/,
		ko: '삼국사기',
		kind: 'annal',
		nation: 'korea',
		origin: 'Goryeo court history, 1145',
		seal: { shape: 'square', color: VERMILION, cut: 'intaglio', tilt: -3 }
	},
	{
		match: /三國遺事|Samguk Yusa/,
		ko: '삼국유사',
		kind: 'myth',
		nation: 'korea',
		origin: 'the monk Iryeon’s tales, c. 1281',
		seal: { shape: 'round', color: PERSIMMON, cut: 'relief', tilt: 4 }
	},
	{
		match: /高麗史|Goryeosa/,
		ko: '고려사',
		kind: 'annal',
		nation: 'korea',
		origin: 'Joseon court history, 1451',
		seal: { shape: 'square', color: OXBLOOD, cut: 'intaglio', double: true, tilt: 2 }
	},
	{
		match: /耽羅志|Tamnaji/,
		ko: '탐라지',
		kind: 'annal',
		nation: 'jeju',
		origin: 'Jeju gazetteer, 1653',
		seal: { shape: 'tall', color: JADE, cut: 'relief', tilt: -2 }
	},
	{
		match: /日本書紀|Nihon Shoki/,
		ko: '일본서기',
		kind: 'annal',
		nation: 'japan',
		origin: 'Yamato court chronicle, 720',
		seal: { shape: 'oval', color: CRIMSON, cut: 'intaglio', tilt: -5 }
	},
	{
		match: /續日本紀|Shoku Nihongi/,
		ko: '속일본기',
		kind: 'annal',
		nation: 'japan',
		origin: 'Nara court chronicle, 797',
		seal: { shape: 'oval', color: CRIMSON, cut: 'relief', tilt: 3 }
	},
	{
		match: /舊唐書|Jiu Tangshu/,
		ko: '구당서',
		kind: 'annal',
		nation: 'china',
		origin: 'Later Jin court history, 945',
		seal: { shape: 'square', color: CRIMSON, cut: 'intaglio', double: true, tilt: 1 }
	},
	{
		match: /新唐書|Xin Tangshu/,
		ko: '신당서',
		kind: 'annal',
		nation: 'china',
		origin: 'Song court history, 1060',
		seal: { shape: 'square', color: CRIMSON, cut: 'relief', double: true, tilt: -1 }
	},
	{
		match: /資治通鑑|Zizhi Tongjian/,
		ko: '자치통감',
		kind: 'annal',
		nation: 'china',
		origin: 'Sima Guang’s mirror for rulers, 1084',
		seal: { shape: 'tall', color: CINNABAR, cut: 'intaglio', tilt: 2 }
	},
	{
		match: /隋書|Sui Shu/,
		ko: '수서',
		kind: 'annal',
		nation: 'china',
		origin: 'Tang court history, 636',
		seal: { shape: 'square', color: CINNABAR, cut: 'relief', tilt: -4 }
	},
	{
		match: /北史|Bei Shi/,
		ko: '북사',
		kind: 'annal',
		nation: 'china',
		origin: 'Tang court history, 659',
		seal: { shape: 'wide', color: CINNABAR, cut: 'relief', tilt: 3 }
	},
	{
		match: /魏書|Wei Shu/,
		ko: '위서',
		kind: 'annal',
		nation: 'china',
		origin: 'Northern Qi court history, 554',
		seal: { shape: 'wide', color: OXBLOOD, cut: 'intaglio', tilt: -2 }
	},
	{
		match: /三國志|Sanguo Zhi/,
		ko: '삼국지',
		kind: 'annal',
		nation: 'china',
		origin: 'Chen Shou’s history, c. 290',
		seal: { shape: 'square', color: OXBLOOD, cut: 'relief', tilt: 4 }
	},
	{
		match: /後漢書|Hou Hanshu/,
		ko: '후한서',
		kind: 'annal',
		nation: 'china',
		origin: 'Fan Ye’s history, 445',
		seal: { shape: 'tall', color: OXBLOOD, cut: 'relief', tilt: -3 }
	},
	{
		match: /史記|Shiji/,
		ko: '사기',
		kind: 'annal',
		nation: 'china',
		origin: 'Sima Qian’s history, c. 91 BC',
		seal: { shape: 'round', color: OXBLOOD, cut: 'intaglio', tilt: 0 }
	},
	{
		match: /唐會要|Tang Huiyao/,
		ko: '당회요',
		kind: 'annal',
		nation: 'china',
		origin: 'Tang institutions, 961',
		seal: { shape: 'tall', color: CRIMSON, cut: 'relief', double: true, tilt: 1 }
	},
	{
		match: /冊府元龜|册府元龜|Cefu Yuangui/,
		ko: '책부원귀',
		kind: 'annal',
		nation: 'china',
		origin: 'Song imperial compendium, 1013',
		seal: { shape: 'square', color: VERMILION, cut: 'relief', double: true, tilt: 2 }
	},
	{
		match: /通典|Tongdian/,
		ko: '통전',
		kind: 'annal',
		nation: 'china',
		origin: 'Du You’s institutions, 801',
		seal: { shape: 'wide', color: CRIMSON, cut: 'intaglio', tilt: -1 }
	},
	{
		match: /廣開土王|Gwanggaeto/,
		ko: '광개토왕릉비',
		kind: 'stele',
		nation: 'korea',
		origin: 'Goguryeo stone, 414',
		seal: { text: '好太王碑', shape: 'square', color: CHALK, cut: 'intaglio', double: true, tilt: 0 }
	},
	{
		match: /平百濟|ping Baekje|pacification of Baekje/i,
		ko: '대당평백제국비명',
		kind: 'stele',
		nation: 'china',
		origin: 'Tang stone at Sabi, 660',
		seal: { text: '平百濟碑', shape: 'tall', color: CHALK, cut: 'intaglio', tilt: 1 }
	},
	{
		match: /劉仁願|Liu Renyuan/,
		ko: '유인원기공비',
		kind: 'stele',
		nation: 'china',
		origin: 'Tang stone at Sabi, 663',
		seal: { text: '紀功碑', shape: 'tall', color: CHALK, cut: 'relief', tilt: -1 }
	},
	{
		match: /砂宅智積|Sataek/,
		ko: '사택지적비',
		kind: 'stele',
		nation: 'korea',
		origin: 'Baekje stone, 654',
		seal: { text: '智積碑', shape: 'wide', color: CHALK, cut: 'relief', tilt: 2 }
	},
	{
		match: /眞興|真興|Jinheung Stele/,
		ko: '진흥왕순수비',
		kind: 'stele',
		nation: 'korea',
		origin: 'Silla stone, 560s',
		seal: { text: '巡狩碑', shape: 'tall', color: CHALK, cut: 'intaglio', double: true, tilt: -2 }
	},
	{
		match: /赤城碑|Jeokseong/,
		ko: '단양적성비',
		kind: 'stele',
		nation: 'korea',
		origin: 'Silla stone, c. 550',
		seal: { text: '赤城碑', shape: 'square', color: CHALK, cut: 'relief', tilt: 3 }
	},
	{
		match: /壬申誓記石|Imsin Oath/,
		ko: '임신서기석',
		kind: 'stele',
		nation: 'korea',
		origin: 'Silla oath stone, 552 or 612',
		seal: { text: '誓記石', shape: 'round', color: CHALK, cut: 'intaglio', tilt: 0 }
	},
	{
		match: /文武王陵碑|Munmu Stele/,
		ko: '문무왕릉비',
		kind: 'stele',
		nation: 'korea',
		origin: 'Silla stone, 682',
		seal: { text: '文武碑', shape: 'square', color: CHALK, cut: 'intaglio', tilt: -1 }
	},
	{
		match: /中原高句麗碑|Chungju Goguryeo/,
		ko: '충주고구려비',
		kind: 'stele',
		nation: 'korea',
		origin: 'Goguryeo stone, 5th c.',
		seal: { text: '高麗碑', shape: 'tall', color: CHALK, cut: 'relief', double: true, tilt: 1 }
	},
	{
		match: /墓誌|epitaph/i,
		kind: 'tomb',
		nation: 'china',
		origin: 'tomb stone in Tang soil',
		seal: { shape: 'tall', color: OXBLOOD, cut: 'intaglio', double: true, tilt: 0 }
	},
	{
		match: /蓮華經|法華|Lotus Sutra/,
		ko: '묘법연화경',
		kind: 'sutra',
		nation: 'india',
		origin: 'Kumārajīva’s Chinese, 406, from the Sanskrit',
		seal: { text: '法華', shape: 'round', color: SAFFRON, cut: 'intaglio', double: true, tilt: 0 }
	},
	{
		match: /本풀이|본풀이|Bonpuri/i,
		kind: 'shaman',
		nation: 'jeju',
		origin: 'Jeju simbang recitation',
		seal: { text: '본풀이', shape: 'round', color: JADE, cut: 'intaglio', tilt: -4 }
	},
	{
		match: /京劇|Jingju/,
		ko: '경극',
		kind: 'stage',
		nation: 'china',
		origin: 'Peking opera stage',
		seal: { text: '京劇', shape: 'lozenge', color: CINNABAR, cut: 'intaglio', tilt: 0 }
	}
];

const NATION_LABEL: Record<RecordNation, string> = {
	korea: 'Korean record',
	china: 'Chinese record',
	japan: 'Japanese record',
	jeju: 'Jeju record',
	india: 'Indian sutra'
};

/**
 * Position in a run of quotes that testify to the same incident.
 * `key` is the run's first block — shared by every card of the run, across beats,
 * so the Stack / Compare switch holds for the whole group.
 */
export type Testimony = {
	index: number;
	count: number;
	nations: (RecordNation | null)[];
	sources: string[];
	key: object;
	stance?: 'agree' | 'differ';
	claim?: string;
	claimKo?: string;
};

export function nationLabel(n: RecordNation | null): string | null {
	return n ? NATION_LABEL[n] : null;
}

const NATION_KO: Record<RecordNation, string> = {
	korea: '한국 기록',
	china: '중국 기록',
	japan: '일본 기록',
	jeju: '제주 기록',
	india: '인도 경전'
};

export function nationLabelKo(n: RecordNation | null): string | null {
	return n ? NATION_KO[n] : null;
}

const SEAL_MAX = 6;
/** The original title in parentheses — hanja, hangul, or both ("천지왕본풀이"). */
const ORIG_TITLE = /\(([\u3400-\u9fff\uac00-\ud7a3《》\s]+?)(?:,[^)]*)?\)/;

function sealText(title: string): string {
	return title.length > SEAL_MAX ? title.slice(-4) : title;
}

export function recordBook(source: string): RecordBook {
	// The book named first wins: a trailing "cf. Samguk Sagi" must not relabel the source.
	let def: (typeof BOOKS)[number] | undefined;
	let at = Infinity;
	for (const b of BOOKS) {
		const i = source.search(b.match);
		if (i >= 0 && i < at) [def, at] = [b, i];
	}
	const m = source.match(ORIG_TITLE);
	const title = m ? m[1].replace(/[《》\s]/g, '') : '';
	const name = m && m.index !== undefined ? source.slice(0, m.index).trim() : source;
	const detail =
		m && m.index !== undefined
			? source
					.slice(m.index + m[0].length)
					.replace(/^[\s,;:·—–-]+/, '')
					.trim()
			: '';
	const text = def?.seal.text ?? (title ? sealText(title) : '');
	const seal: RecordSeal | null = text
		? {
				shape: def?.seal.shape ?? 'square',
				color: def?.seal.color ?? VERMILION,
				cut: def?.seal.cut ?? 'intaglio',
				double: def?.seal.double,
				tilt: def?.seal.tilt ?? -3,
				text
			}
		: null;
	return {
		name,
		ko: def?.ko,
		seal,
		detail,
		kind: def?.kind ?? 'annal',
		nation: def?.nation ?? null,
		origin: def?.origin
	};
}
