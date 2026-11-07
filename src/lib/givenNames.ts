/**
 * The names monarchs were born with, for the cards that write their reign title:
 * 김덕만 beneath 선덕여왕. Listed in `data/given-names.json` by person id; a record
 * whose reign stage renamed it falls back to its own birth name.
 *
 * Wiki profiles invert the card: birth name is the hero, royal name sits small above.
 */
import GIVEN from '$lib/data/given-names.json';
import { fullName, personName, sameName } from '$lib/names';
import { isMonarch, koreanOf, nameOf, titleOf, type Person } from '$lib/people';

export interface GivenName {
	korean?: string;
	hanja?: string;
	english?: string;
}

const LISTED: Record<string, { korean: string; hanja?: string; english: string }> = GIVEN;

const REIGN_NAME =
	/^(?:(?:First|Second|Third|Fourth)\s+)?(?:King|Queen|Emperor|Empress|Khagan|Heavenly Sovereign)\b/i;
/** Silla's older king-words, worn after the personal name (Pasa Isagum, Nulji Isagum). */
const SILLA_RANK = /\s+(Isagum|Isageum|Maripgan|Chachaung)$/i;

/**
 * Surnames the chronicle actually uses, English → Korean. Only these count as a
 * family name: "The", "Red", "Daeya" or "Cow" at the front of a name never do.
 */
const SURNAMES: Record<string, string> = {
	Kim: '김',
	Park: '박',
	Suk: '석',
	Heo: '허',
	Yeon: '연',
	Go: '고',
	Hae: '해',
	Buyeo: '부여',
	Satek: '사택',
	Yunbi: '연비',
	Jinmo: '진모',
	Mokli: '목리',
	Baek: '백',
	Guk: '국',
	Ahn: '안',
	Gwishil: '귀실',
	Hukchi: '흑치',
	Ulchi: '을지',
	Choi: '최',
	Lee: '이',
	Jeong: '정',
	Son: '손',
	Bae: '배',
	Seol: '설',
	Sul: '설',
	Dae: '대',
	On: '온',
	Sun: '선',
	Ye: '예',
	Gung: '궁',
	Kyun: '견',
	Wang: '왕',
	Xue: '설',
	Chu: '저',
	Zhang: '장',
	Sima: '사마',
	Gongsun: '공손',
	Wu: '무'
};

/** Blood-house id → its surname, for people whose display name is the given name alone. */
const CLAN_SURNAME: Record<string, string> = {
	'clan-gyeongju-kim': 'Kim',
	'clan-geumgwan-kim': 'Kim',
	'clan-park': 'Park',
	'clan-yeon': 'Yeon',
	'clan-go': 'Go',
	'clan-buyeo': 'Buyeo',
	'clan-satek': 'Satek',
	'clan-gwishil': 'Gwishil',
	'clan-yunbi': 'Yunbi',
	'clan-jinmo': 'Jinmo',
	'clan-mokli': 'Mokli',
	'clan-hae': 'Hae',
	'clan-baek': 'Baek',
	'clan-guk': 'Guk',
	'clan-ahn': 'Ahn',
	'clan-surabol-lee': 'Lee',
	'clan-surabol-choi': 'Choi',
	'clan-surabol-jeong': 'Jeong',
	'clan-surabol-son': 'Son',
	'clan-surabol-bae': 'Bae',
	'clan-surabol-seol': 'Seol'
};

/** A rank worn in front of a name ("Princess Chunmyung"), with its Korean. */
const LEAD_TITLES: [RegExp, string, string][] = [
	[/^Crown Prince\s+/, 'Crown Prince', '태자'],
	[/^Princess\s+/, 'Princess', '공주'],
	[/^Prince\s+/, 'Prince', '왕자'],
	[/^Queen\s+/, 'Queen', '왕후'],
	[/^King\s+/, 'King', '왕'],
	[/^Empress\s+/, 'Empress', '황후'],
	[/^Emperor\s+/, 'Emperor', '황제'],
	[/^Galmunwang\s+/, 'Galmunwang', '갈문왕'],
	[/^Lady\s+/, 'Lady', '부인'],
	[/^Lord\s+/, 'Lord', '공'],
	[/^Elder\s+/, 'Elder', '어른'],
	[/^Minister\s+/, 'Minister', '좌평'],
	[/^Grandma\s+/, 'Grandma', '할멈']
];

/** A rank worn after a name: Silla's old king-words, a Kan, "the Great". */
const TAIL_TITLE = /\s+(Isagum|Isageum|Maripgan|Chachaung|Kan|the Great)$/;

/** The same ranks as Korean suffixes, stripped only when the English carried one. */
const KO_TITLE_TAIL = /\s*(갈문왕|공주|왕자|태자|부인|왕후|태후|황후|대왕|천황|이사금|마립간|차차웅|왕|간)$/u;
/** Silla's spaced king-words come off even when the English is bare (눌지 이사금). */
const KO_SPACED_TAIL = /\s+(이사금|마립간|차차웅)$/u;

/** Court ranks read off the title line when the name carries none. */
const STYLE_RANK =
	/^(?:Crown\s+)?(?:Prince|Princess|Queen consort|Queen dowager|Galmunwang|Lord|Lady)\b/i;

const STYLE_RANK_KO: Record<string, string> = {
	'crown prince': '태자',
	prince: '왕자',
	princess: '공주',
	'queen consort': '왕후',
	'queen dowager': '태후',
	galmunwang: '갈문왕',
	lord: '공',
	lady: '부인'
};

interface WikiName {
	title?: { en: string; ko?: string };
	surname?: string;
	given: string;
	surnameKo?: string;
	givenKo: string;
}

/** Descriptive names stay whole: "The Herald", "A Dancing Girl", "Yeon's Wife". */
const isDescriptive = (s: string) => /^(?:The|A|An)\s/.test(s) || /^\S+['’]s\s/.test(s);

/** Peel a leading or trailing rank off an English name. */
function peelTitle(name: string): { rest: string; title?: { en: string; ko?: string } } {
	for (const [re, en, ko] of LEAD_TITLES) {
		if (!re.test(name)) continue;
		const rest = name.replace(re, '');
		if (/^\p{Lu}/u.test(rest)) return { rest, title: { en, ko } };
	}
	const tail = name.match(TAIL_TITLE);
	if (tail && tail.index) return { rest: name.slice(0, tail.index), title: { en: tail[1] } };
	return { rest: name };
}

/** One parse shared by the style line and the name row of a wiki tile. */
function wikiName(p: Person): WikiName {
	const base = birthNameOf(p)?.english ?? p.name;
	const koBase = birthNameOf(p)?.korean?.replace(/\s/g, '') ?? koreanOf(p) ?? '';
	if (p.entity && p.entity !== 'god') return { given: base, givenKo: koBase || base };
	if (isDescriptive(base)) return { given: base, givenKo: koBase || base };

	const peeled = peelTitle(base);
	const { rest } = peeled;
	/** A catalogued birth name carries no rank: read it off the display name, then its Korean. */
	const title = peeled.title ?? (birthNameOf(p) ? (peelTitle(p.name).title ?? koTitleOf(koreanOf(p))) : undefined);
	let ko = koBase.replace(KO_SPACED_TAIL, '');
	let titleKo = title?.ko;
	if (peeled.title) {
		const tail = ko.match(KO_TITLE_TAIL);
		if (tail && tail.index) {
			titleKo = tail[1];
			ko = ko.slice(0, tail.index);
		}
	}
	const named = title ? { en: title.en, ko: titleKo } : undefined;

	const parts = rest.split(/\s+/);
	const head = parts[0];
	const ownSurname = parts.length > 1 && SURNAMES[head] ? head : undefined;
	/** Japanese "Echi no Takutsu": the house name carries its "no". */
	const noForm = parts.length > 2 && parts[1] === 'no' && !ownSurname;

	if (ownSurname || noForm) {
		const cut = noForm ? 2 : 1;
		const surname = parts.slice(0, cut).join(' ');
		const given = parts.slice(cut).join(' ');
		const koSur = ownSurname ? SURNAMES[ownSurname] : undefined;
		if (koSur && ko.startsWith(koSur) && ko.length > koSur.length) {
			return { title: named, surname, given, surnameKo: koSur, givenKo: ko.slice(koSur.length).trim() };
		}
		const gap = ko.indexOf(' ');
		if (gap > 0) return { title: named, surname, given, surnameKo: ko.slice(0, gap), givenKo: ko.slice(gap + 1) };
		return { title: named, surname, given, givenKo: ko || given };
	}

	/** "Minister Satek": the house is all the English gives, the Korean keeps the given name (사택 지적). */
	const houseKo = SURNAMES[rest];
	if (houseKo && ko.startsWith(houseKo) && ko.length > houseKo.length) {
		return { title: named, given: rest, surnameKo: houseKo, givenKo: ko.slice(houseKo.length).trim() };
	}

	const clanSurname = (p.clan ? CLAN_SURNAME[p.clan] : undefined) ?? SURNAME_OF[p.id];
	if (clanSurname && !birthNameOf(p) && rest !== clanSurname) {
		const koSur = SURNAMES[clanSurname];
		/** 고국원왕 is Go + Gogugwon: keep the syllable when the given name itself opens with it. */
		const strip =
			koSur && ko.startsWith(koSur) && ko.length > koSur.length + 1 && !fold(rest).startsWith(fold(clanSurname));
		return {
			title: named,
			surname: clanSurname,
			given: rest,
			surnameKo: koSur,
			givenKo: (strip ? ko.slice(koSur.length).trim() : ko) || rest
		};
	}
	return { title: named, given: rest, givenKo: ko || rest };
}

const KO_RANK: Record<string, string> = {
	공주: 'Princess',
	왕자: 'Prince',
	태자: 'Crown Prince',
	부인: 'Lady',
	왕후: 'Queen'
};

/** 만명부인 → Lady: a rank written only in the Korean name. */
function koTitleOf(korean: string | undefined): { en: string; ko?: string } | undefined {
	const m = korean?.match(/(공주|왕자|태자|부인|왕후)$/u);
	return m ? { en: KO_RANK[m[1]], ko: m[1] } : undefined;
}

/** Surnames on record for people without a clan entry (the Park kings before Talhae). */
const SURNAME_OF: Record<string, string> = {
	namhae: 'Park',
	yuri_isageum: 'Park'
};

/** Compare names without case or accents (Hyukgosé = Hyukgose). */
const fold = (s: string) =>
	s
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase();

/** Birth name from the catalogue, when we have one. */
export function birthNameOf(p: Person): GivenName | undefined {
	const listed = LISTED[p.id];
	if (!listed) return undefined;
	return { ...personName(p, listed.hanja, listed.korean), english: listed.english };
}

/** Wiki list / profile hero: birth name when catalogued, else the usual display name. */
export function profileNameOf(
	p: Person,
	year?: number | null,
	look?: string | null
): string {
	return birthNameOf(p)?.english ?? nameOf(p, year, look);
}

/**
 * Temple / reign name for wiki headers (King Muyeol above Kim Chunchu). Prefers a
 * reign stage; otherwise the person's base English when it is already a reign title.
 */
export function royalNameOf(
	p: Person
): { english: string; korean?: string; hanja?: string } | undefined {
	const birth = birthNameOf(p);
	if (!birth?.english) return undefined;
	const reignStage = p.stages?.find(
		(s) =>
			!!s.name &&
			(REIGN_NAME.test(s.name) || SILLA_RANK.test(s.name)) &&
			s.name !== birth.english &&
			!s.lookOnly
	);
	if (reignStage?.name) {
		return { english: reignStage.name, korean: reignStage.korean, hanja: reignStage.hanja };
	}
	if (
		(REIGN_NAME.test(p.name) || SILLA_RANK.test(p.name)) &&
		fold(p.name) !== fold(birth.english)
	) {
		return {
			english: p.name,
			korean: p.korean !== birth.korean ? p.korean : undefined,
			hanja: p.hanja && p.hanja !== birth.hanja ? p.hanja : undefined
		};
	}
	return undefined;
}

/**
 * Line above the name on compressed wiki tiles: the reign name for anyone who
 * ever held the throne (King Muyeol over Kim Chunchu), else the rank the name
 * wears (Princess, Prince, Lady…), else a court rank from the title line.
 */
export function wikiStyleOf(p: Person, ko = false): string | undefined {
	if (p.entity && p.entity !== 'god') return undefined;
	const parsed = wikiName(p);
	if (isMonarch(p)) {
		const royal = royalNameOf(p);
		if (royal) return ko ? (royal.korean ?? koreanOf(p) ?? royal.english) : royal.english;
		const reign = p.name;
		const plain = [parsed.surname, parsed.given].filter(Boolean).join(' ');
		if (fold(reign) !== fold(plain) && fold(reign) !== fold(parsed.given)) return ko ? (koreanOf(p) ?? reign) : reign;
	}
	if (parsed.title) return ko ? (parsed.title.ko ?? parsed.title.en) : parsed.title.en;
	const m = titleOf(p)?.match(STYLE_RANK);
	if (!m) return undefined;
	const en = m[0].replace(/\s+/g, ' ').trim();
	if (p.name.toLowerCase().includes(en.toLowerCase())) return undefined;
	const label = en.charAt(0).toUpperCase() + en.slice(1);
	return ko ? (STYLE_RANK_KO[en.toLowerCase()] ?? label) : label;
}

/** Surname (drawn lighter) and given name for a compressed wiki tile. */
export function wikiNameParts(p: Person, ko = false): { surname?: string; given: string } {
	const n = wikiName(p);
	return ko ? { surname: n.surnameKo, given: n.givenKo } : { surname: n.surname, given: n.given };
}

/** The name `p` was born with, unless the plate already writes it (`shown`: the plate's Korean). */
export function givenName(
	p: Person,
	year: number | null | undefined,
	look: string | null | undefined,
	shown?: string
): GivenName | undefined {
	const listed = LISTED[p.id];
	const given: GivenName | undefined = listed
		? { ...personName(p, listed.hanja, listed.korean), english: listed.english }
		: fullName(p, year, look).birth;
	return given?.korean && !sameName(given.korean, shown) ? given : undefined;
}
