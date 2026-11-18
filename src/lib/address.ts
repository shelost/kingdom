/**
 * How people address each other in the chronicle.
 *
 * Silla borrowed Chinese 郞 / 娘 and kept them as youth titles; native endings
 * (-gan/-chan as full ranks, -agi, -ji) sit beside them. House rule:
 *   -rang / -nang  — unmarried aristocratic youth (Hwarang boys; noble girls)
 *   -buin          — married noblewoman
 *   -agi           — child / beloved young one
 *   -gong          — Harmony Council members only (대등 / 상대등), never a
 *                    generic “sir” for every old man
 * Full 17-rank words (Achan, Pajinchan…) attach whole — never bare “-chan”.
 * Formal English mouths use office titles: Councillor Bidam, Marshal Yushin.
 *
 * Dialogue writes the form in the line (Yushin-rang / 유신랑). The renderer
 * greys and italicises only the suffix.
 */

import { byId, koreanOf, nameOf, type CareerOffice, type Person } from '$lib/people';
import { speakerName } from '$lib/chat';

/** Single-syllable personal suffixes the renderer styles. */
export const HONORIFIC_EN = ['rang', 'nang', 'gong', 'agi', 'buin', 'ji'] as const;
export const HONORIFIC_KO = ['랑', '낭', '공', '아기', '부인', '지'] as const;

export type HonorificEn = (typeof HONORIFIC_EN)[number];
export type HonorificKo = (typeof HONORIFIC_KO)[number];

export type AddressForm = {
	/** Given name alone (Yushin / 유신). */
	given: string;
	/** Personal suffix when one applies (-rang / 랑). */
	suffix?: { en: HonorificEn; ko: HonorificKo };
	/** English office word spoken before the name (Councillor, Marshal…). */
	titleEn?: string;
	/** Korean office word (상대등, 장군…). */
	titleKo?: string;
};

const EN_SUFFIX_RE = new RegExp(`-(${HONORIFIC_EN.join('|')})(?![\\p{L}\\p{N}])`, 'giu');

/**
 * Hangul personal suffixes after a name stem.
 * - 공 must not steal 공주
 * - bare 지 is omitted (too many verb endings); English -ji still marks
 */
const KO_SUFFIX_RE = /(랑|낭|아기|부인)(?![가-힣])|(?<=[가-힣])공(?!주)/gu;

const GIVEN_STRIP_KO = /(랑|낭|공|아기|부인)$/u;
const GIVEN_STRIP_EN = /-(rang|nang|gong|agi|buin|ji)$/i;

/** Prefer a spoken court office over a Hwarang yard post when both cover the year. */
function officeWeight(c: CareerOffice): number {
	const t = c.title;
	if (/High Councillor|Supreme General|Marshal|대막리지|Grand/i.test(t)) return 5;
	if (/^Councillor\b|Minister|Commander|General|Pajinchan|Achan|Ichan/i.test(t)) return 4;
	if (/^Hwarang\b/i.test(t)) return 1;
	if (/disciple|낭도/i.test(t)) return 0;
	return 2;
}

function officeAt(p: Person, year?: number | null): CareerOffice | undefined {
	const list = p.career ?? [];
	if (!list.length) return undefined;
	const open =
		year == null
			? list
			: list.filter((c) => (c.from == null || year >= c.from) && (c.to == null || year <= c.to));
	if (!open.length) {
		return list.filter((c) => c.from != null && year != null && c.from <= year).at(-1);
	}
	return open.slice().sort((a, b) => officeWeight(b) - officeWeight(a))[0];
}

function onCouncil(p: Person, year?: number | null): boolean {
	const list = p.career ?? [];
	return list.some(
		(c) =>
			c.org === 'harmonycouncil' &&
			(year == null || ((c.from == null || year >= c.from) && (c.to == null || year <= c.to)))
	);
}

function isHwarang(p: Person, year?: number | null): boolean {
	if (p.hwarangClass) {
		const y0 = p.hwarangClass.initiated;
		if (year == null || y0 == null) return true;
		return year >= y0 && year < y0 + 20;
	}
	const list = p.career ?? [];
	return list.some(
		(c) =>
			/^Hwarang\b/i.test(c.title) &&
			(year == null || ((c.from == null || year >= c.from) && (c.to == null || year <= c.to)))
	);
}

function marriedWoman(p: Person, year?: number | null): boolean {
	if (p.gender !== 'f') return false;
	const office = officeAt(p, year);
	const title = office?.title ?? p.title ?? '';
	if (/\b(Queen|consort|夫人|왕후|비)\b/i.test(title)) return true;
	if ((p.korean ?? '').endsWith('부인') || /\bbuin\b/i.test(p.name ?? '')) return true;
	if ((p.family ?? []).some((f) => /^(Husband|Wife|Spouse|남편|아내)$/i.test(f.role))) return true;
	return (p.stages ?? []).some(
		(s) =>
			/\b(Queen|consort|wife|夫人|왕후)\b/i.test(`${s.title ?? ''} ${s.name}`) &&
			(year == null || ((s.from == null || year >= s.from) && (s.until == null || year < s.until)))
	);
}

/** Strip an already-baked honorific off a wiki given name (만명부인 → 만명). */
function bareGiven(name: string, lang: 'en' | 'ko'): string {
	if (lang === 'ko') return name.replace(GIVEN_STRIP_KO, '');
	return name.replace(GIVEN_STRIP_EN, '');
}

/** Map a career title to the English word mouths use in front of a name. */
function spokenTitle(office: CareerOffice | undefined): { en?: string; ko?: string } {
	if (!office) return {};
	const t = office.title;
	const ko = office.korean;
	if (/High Councillor/i.test(t)) return { en: 'High Councillor', ko: ko ?? '상대등' };
	if (/^Councillor\b/i.test(t) || /대등/.test(ko ?? '')) return { en: 'Councillor', ko: ko ?? '대등' };
	if (/Marshal|상장군|병부령|국선/i.test(t)) return { en: 'Marshal', ko: ko ?? '국선' };
	if (/Supreme Commander|대막리지|Grand Commander|Grand Supreme/i.test(t))
		return { en: 'Commander', ko: ko ?? office.korean ?? '대막리지' };
	if (/^Commander\b|도독|총관/i.test(t)) return { en: 'Commander', ko: ko ?? '도독' };
	if (/^General\b|장군/i.test(t)) return { en: 'General', ko: ko ?? '장군' };
	if (/Minister|좌평|Jwapyung|Premie/i.test(t)) return { en: 'Minister', ko: ko ?? '좌평' };
	if (/Pajinchan|파진찬/i.test(t)) return { en: 'Councillor', ko: ko ?? '파진찬' };
	if (/\bAchan\b|아찬/i.test(t)) return { en: 'Achan', ko: ko ?? '아찬' };
	if (/\bIchan\b|이찬/i.test(t)) return { en: 'Ichan', ko: ko ?? '이찬' };
	if (/Daesa|대사/i.test(t)) return { en: 'Daesa', ko: ko ?? '대사' };
	return {};
}

/**
 * The form another adult uses for this person in a given year.
 * A spoken office (Councillor, Marshal…) outranks the yard nickname;
 * council -gong is the adult personal form when no higher spoken title is needed.
 */
export function addressOf(p: Person, year?: number | null): AddressForm {
	const given = bareGiven(speakerName(p, year, null, 'en'), 'en');
	const age = p.born != null && year != null ? year - p.born : null;

	if (age != null && age < 12) {
		return { given, suffix: { en: 'agi', ko: '아기' } };
	}

	if (p.gender === 'f') {
		if (marriedWoman(p, year)) {
			return { given, suffix: { en: 'buin', ko: '부인' } };
		}
		if (p.kingdom === 'silla' || p.kingdom === 'gaya') {
			return { given, suffix: { en: 'nang', ko: '낭' } };
		}
		return { given };
	}

	const office = officeAt(p, year);
	const spoken = spokenTitle(office);
	if (spoken.en) {
		return { given, titleEn: spoken.en, titleKo: spoken.ko };
	}

	if (isHwarang(p, year) && (age == null || age < 30)) {
		return { given, suffix: { en: 'rang', ko: '랑' } };
	}

	if (onCouncil(p, year)) {
		return { given, suffix: { en: 'gong', ko: '공' } };
	}

	return { given };
}

export function addressOfId(id: string, year?: number | null): AddressForm | null {
	const p = byId.get(id);
	return p ? addressOf(p, year) : null;
}

/** English vocative: "Councillor Bidam", "Yushin-rang", or bare given. */
export function vocativeEn(p: Person, year?: number | null): string {
	const a = addressOf(p, year);
	if (a.titleEn) return `${a.titleEn} ${a.given}`;
	if (a.suffix) return `${a.given}-${a.suffix.en}`;
	return a.given;
}

/** Korean vocative: "상대등 비담", "유신랑", "비담공". */
export function vocativeKo(p: Person, year?: number | null): string {
	const a = addressOf(p, year);
	const given = bareGiven(speakerName(p, year, null, 'ko'), 'ko');
	if (a.titleKo) return `${a.titleKo} ${given}`;
	if (a.suffix) return `${given}${a.suffix.ko}`;
	return given;
}

/**
 * Wrap personal honorific suffixes so the dialogue CSS can grey them.
 * Safe on already-linked HTML: only text between tags is touched.
 */
export function markHonorifics(html: string): string {
	if (!html) return html;
	return html.replace(/(<[^>]*>)|([^<]+)/g, (chunk, tag: string | undefined, text: string | undefined) => {
		if (tag || !text) return chunk;
		let out = text.replace(EN_SUFFIX_RE, (m) => `<span class="hon">${m}</span>`);
		out = out.replace(KO_SUFFIX_RE, (m) => `<span class="hon">${m}</span>`);
		return out;
	});
}

/** Display helpers for docs / wiki. */
export function formLabel(a: AddressForm, lang: 'en' | 'ko'): string {
	if (lang === 'ko') {
		const given = bareGiven(a.given, 'ko');
		if (a.titleKo) return `${a.titleKo} ${given}`;
		if (a.suffix) return `${given}${a.suffix.ko}`;
		return given;
	}
	if (a.titleEn) return `${a.titleEn} ${a.given}`;
	if (a.suffix) return `${a.given}-${a.suffix.en}`;
	return a.given;
}

/** Re-export name helpers used by callers that already hold a Person. */
export { nameOf, koreanOf };
