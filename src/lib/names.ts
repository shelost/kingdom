import {
	KINGDOMS,
	isMonarch,
	koreanOf,
	nameOf,
	resolveStage,
	titleOf,
	type CareerOffice,
	type Person
} from '$lib/people';
import { rankOf } from '$lib/ranks';

/** Thin space: the small gap a name gets between surname and given name. */
export const NAME_GAP = '\u2009';

/** Two-character surnames, hanja → Korean reading. */
const COMPOUND_SURNAMES: Record<string, string> = {
	扶餘: '부여',
	夫餘: '부여',
	乙支: '을지',
	沙宅: '사택',
	黑齒: '흑치',
	燕比: '연비',
	南宮: '남궁',
	皇甫: '황보',
	諸葛: '제갈',
	鮮于: '선우',
	獨孤: '독고',
	長孫: '장손',
	尉遲: '울지',
	宇文: '우문',
	司馬: '사마',
	上官: '상관',
	歐陽: '구양',
	慕容: '모용',
	東方: '동방',
	西門: '서문'
};

/** A reign name or a title stays whole: 善德女王, 義慈王, 德曼公主. */
const TITLE_TAIL = /(皇帝|皇后|女王|大王|王后|王妃|公主|太子|夫人|母主|王|帝)$/u;
const ONLY_HAN = /^\p{Script=Han}+$/u;
const ONLY_HANGUL = /^[\uAC00-\uD7A3]+$/u;

export const isHanja = (s: string | undefined): s is string =>
	!!s && ONLY_HAN.test(s.replace(/\s/g, ''));

const bare = (s: string) => s.replace(/\s/g, '');

/**
 * Where a name breaks between surname and given name, or 0 when it reads as one
 * word: a conventional 1 + 1–2 name (金庾信), a reign title (善德女王), or a
 * single name (階伯).
 */
function surnameLength(hanja: string): number {
	const chars = Array.from(hanja);
	if (chars.length < 3 || TITLE_TAIL.test(hanja)) return 0;
	if (COMPOUND_SURNAMES[chars.slice(0, 2).join('')]) return 2;
	return chars.length >= 4 ? 1 : 0;
}

/**
 * A name split for display: 扶餘義慈 / 부여의자 → 扶餘 義慈 / 부여 의자,
 * 淵蓋蘇文 / 연개소문 → 淵 蓋蘇文 / 연 개소문. Conventional names stay whole.
 * The Korean is split at the same place only when it has one syllable per hanja.
 */
export function splitName(hanja: string | undefined, korean?: string): { hanja?: string; korean?: string } {
	const h = hanja ? bare(hanja) : undefined;
	const k = korean ? bare(korean) : undefined;
	const cut = h && ONLY_HAN.test(h) ? surnameLength(h) : 0;
	if (!cut) return { hanja: hanja?.trim(), korean: korean?.trim() };
	const hc = Array.from(h!);
	const kc = k ? Array.from(k) : [];
	const koMatches = !!k && ONLY_HANGUL.test(k) && kc.length === hc.length;
	return {
		hanja: hc.slice(0, cut).join('') + NAME_GAP + hc.slice(cut).join(''),
		korean: koMatches ? kc.slice(0, cut).join('') + NAME_GAP + kc.slice(cut).join('') : korean?.trim()
	};
}

/** The hanja half of `splitName`. */
export function spacedHanja(hanja: string, korean?: string): string {
	return splitName(hanja, korean).hanja ?? hanja;
}

export interface FullName {
	korean?: string;
	hanja?: string;
	english: string;
	/** The name they were born with, when this stage goes by a reign name or title (무열왕 → 김춘추). */
	birth?: { korean?: string; hanja?: string };
}

/**
 * A person's whole name at a story year / look, spaced for display. A stage that
 * renames them (무열왕) only borrows the person's hanja when it is the same name,
 * so a reign name never wears the birth name's characters.
 */
export function fullName(p: Person, year?: number | null, look?: string | null): FullName {
	const stage = resolveStage(p, year, look);
	const korean = koreanOf(p, year, look);
	const renamed = !!stage?.korean && stage.korean !== p.korean;
	const hanja = stage?.hanja ?? (renamed ? undefined : p.hanja);
	const name = personName(p, hanja, korean);
	const birth = renamed && p.korean ? personName(p, p.hanja, p.korean) : undefined;
	return { korean: name.korean, hanja: name.hanja, english: nameOf(p, year, look), birth };
}

/** `splitName` for one person: gods and other entities keep their names whole (정견모주). */
export function personName(p: Person, hanja: string | undefined, korean?: string): { hanja?: string; korean?: string } {
	return p.entity ? { hanja: hanja?.trim(), korean: korean?.trim() } : splitName(hanja, korean);
}

/** Same characters, spacing ignored. */
export const sameName = (a: string | undefined, b: string | undefined) =>
	!!a && !!b && bare(a) === bare(b);

/** Hanja for a Korean reading only when it is the same name, syllable for character. */
export function hanjaFor(korean: string, hanja: string | undefined): string | undefined {
	if (!hanja) return undefined;
	return Array.from(bare(korean)).length === Array.from(bare(hanja)).length ? hanja : undefined;
}

const TITLE_GLYPHS: [RegExp, string][] = [
	[/(皇帝|황제)$/u, '皇帝'],
	[/(女王|여왕)$/u, '女王'],
	[/(大王|대왕)$/u, '大王'],
	[/(王后|왕후)$/u, '王后'],
	[/(公主|공주)$/u, '公主'],
	[/(太子|태자)$/u, '太子'],
	[/(王|왕)$/u, '王'],
	[/(帝)$/u, '帝']
];

/** The title a seal can carry for a stage name: 武烈王 → 王, 선덕여왕 → 女王. */
export function titleSeal(...names: (string | undefined)[]): string | undefined {
	for (const n of names) {
		if (!n) continue;
		const hit = TITLE_GLYPHS.find(([re]) => re.test(bare(n)));
		if (hit) return hit[1];
	}
	return undefined;
}

/** The office held in `year` (the latest begun, when several overlap). */
export function officeAt(p: Person, year: number | null | undefined): CareerOffice | undefined {
	if (year == null) return undefined;
	return (p.career ?? [])
		.filter((c) => (c.from == null || year >= c.from) && (c.to == null || year <= c.to))
		.sort((a, b) => (b.from ?? -Infinity) - (a.from ?? -Infinity))[0];
}

/**
 * The seal for a change of standing: a title in the new name (王, 女王), else the
 * hanja of the office newly taken (大莫離支) when it differs from the old one.
 */
export function promotionSeal(
	p: Person,
	after: { year: number | null | undefined; hanja?: string; korean?: string },
	beforeYear: number | null | undefined
): string | undefined {
	const named = titleSeal(after.hanja, after.korean);
	if (named) return named;
	const now = officeAt(p, after.year)?.hanja;
	const was = officeAt(p, beforeYear)?.hanja;
	return now && now !== was && Array.from(now).length <= 4 ? now : undefined;
}

/** On the dragon throne this year: an Emperor (or reigning Empress), not a consort. */
export function isEmperor(p: Person, year?: number | null, look?: string | null): boolean {
	const t = titleOf(p, year, look) ?? '';
	return /Emperor|Empress|皇帝/.test(t) && isMonarch(p, year, look);
}

/** One character for a person's standing, stamped in a card's corner. */
export interface RankGlyph {
	glyph: string;
	en: string;
	ko: string;
}

const g = (glyph: string, en: string, ko: string): RankGlyph => ({ glyph, en, ko });

/** Offices and callings that say more than blood, most telling first. */
const CALLING_GLYPHS: [RegExp, RankGlyph][] = [
	[/queen consort|empress consort|\bconsort\b|왕후|왕비|황후/i, g('后', 'Queen consort', '왕비')],
	[/concubine|talented lady|후궁/i, g('妃', 'Consort', '후궁')],
	[/crown prince|crown princess|\bheir\b|태자|세자/i, g('儲', 'Heir', '태자')],
	[/\b(?:monk|nun|abbot|priest)\b|승려|스님|법사/i, g('僧', 'Monk', '승려')],
	[/hwarang|화랑/i, g('花', 'Hwarang', '화랑')],
	[/envoy|ambassador|사신/i, g('使', 'Envoy', '사신')],
	[/jwapyeong|좌평/i, g('佐', 'Jwapyeong', '좌평')],
	[/supreme commander|mangniji|makriji|막리지|prime minister|chancellor|premier|sangdaedeung|상대등|great minister/i, g('相', 'First minister', '재상')],
	[/\bka\b|고추가|대가/i, g('加', 'Ka', '가')],
	[/general|commander|marshal|admiral|captain|guardian|warden|protector|dragon|tiger|fowl|tortoise|장군/i, g('將', 'General', '장수')],
	[/minister|councillor|counsellor|대신/i, g('臣', 'Minister', '신하')],
	[/slave|노비/i, g('奴', 'Slave', '노비')]
];

/** Royal kin rank below the bone they were born to. */
const KIN_GLYPHS: [RegExp, RankGlyph][] = [
	[/princess|공주/i, g('姬', 'Princess', '공주')],
	[/prince|왕자/i, g('君', 'Prince', '왕자')]
];

const BONE_GLYPHS: Record<string, RankGlyph> = {
	'Sacred Bone': g('聖', 'Sacred Bone', '성골'),
	'True Bone': g('眞', 'True Bone', '진골'),
	'Head Rank 6': g('六', 'Head Rank 6', '6두품'),
	'Head Rank 5': g('五', 'Head Rank 5', '5두품'),
	'Head Rank 4': g('四', 'Head Rank 4', '4두품'),
	Commoner: g('民', 'Commoner', '평민'),
	Slave: g('奴', 'Slave', '노비')
};

/**
 * The one character that says where a person stands this year: 神 for a god,
 * 帝 / 王 on a throne, then the office or calling (后 相 將 使 僧 花 …), then
 * Silla's bone (聖 眞 六), then royal kin (姬 君). Undefined when nothing is known.
 */
export function rankGlyph(p: Person, year?: number | null, look?: string | null): RankGlyph | undefined {
	if (p.entity === 'animal') return undefined;
	const rank = rankOf(p, year);
	if (rank.metric === 'divine') return g('神', 'God', '신');
	if (isEmperor(p, year, look)) return g('帝', 'Emperor', '황제');
	if (isMonarch(p, year, look)) return g('王', 'Sovereign', '군주');
	const held = year == null ? (p.career ?? []) : (p.career ?? []).filter((c) => (c.from == null || year >= c.from) && (c.to == null || year <= c.to));
	const text = [titleOf(p, year, look), rank.officeLabel, rank.officeKo, ...held.flatMap((c) => [c.title, c.korean])]
		.filter(Boolean)
		.join(' | ');
	const calling = CALLING_GLYPHS.find(([re]) => re.test(text))?.[1];
	if (calling) return calling;
	if (rank.metric === 'bone' && BONE_GLYPHS[rank.label]) return BONE_GLYPHS[rank.label];
	const kin = KIN_GLYPHS.find(([re]) => re.test(text))?.[1];
	if (kin) return kin;
	return p.godTier === 'demigod' ? g('神', 'Demigod', '반신') : undefined;
}

/** The person's realm colour from the shared kingdom table. */
export function realmColor(p: Person): string {
	return KINGDOMS[p.kingdom]?.color ?? KINGDOMS.other.color;
}

/**
 * A realm colour steeped into sumi (`share` of the realm), as a hex: the brushed
 * hanja's ink. A plain hex because the stroke writer cannot read `color-mix()`.
 */
export function realmInk(hex: string, share = 0.4, sumi = '#15120e'): string {
	const rgb = (h: string) => {
		const s = h.replace('#', '');
		const f = s.length === 3 ? [...s].map((c) => c + c).join('') : s.slice(0, 6);
		return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) || 0);
	};
	const a = rgb(hex);
	const b = rgb(sumi);
	return `#${a.map((v, i) => Math.round(v * share + b[i] * (1 - share)).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Place ids whose hanja only spell the native sound (徐羅伐 for 서라벌), or name
 * something else: the card shows no calligraphy for them.
 */
export const NATIVE_NAMES: ReadonlySet<string> = new Set(['surabol', 'asadal', 'michuhol', 'mugun']);
