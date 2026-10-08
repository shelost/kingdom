import { KINGDOMS, kingdomFlag, type Person } from '$lib/people';
import type { Place } from '$lib/places';
import { rankOf } from '$lib/ranks';
import { realmColor } from '$lib/names';

/** What kind of being a card shows: the palette follows it before the realm. */
export type Being = 'god' | 'underworld' | 'demigod' | 'beast' | 'mortal';

/** Divine palettes: a god is gold on celestial paper, the dead's officers ash, demigods pearl. */
export const BEING_TONE: Record<Exclude<Being, 'mortal'>, string> = {
	god: '#b8892c',
	underworld: '#5b5f7a',
	demigod: '#4f8f9c',
	beast: '#6e7f3e'
};

export function beingOf(p: Person, year?: number | null): Being {
	if (p.entity === 'animal') return 'beast';
	if (p.godTier === 'demigod') return 'demigod';
	if (rankOf(p, year).metric !== 'divine') return 'mortal';
	return p.kingdom === 'underworld' ? 'underworld' : 'god';
}

/** The card's accent: a god's palette, else the realm's colour. */
export function toneOf(p: Person, year?: number | null): string {
	const being = beingOf(p, year);
	return being === 'mortal' ? realmColor(p) : BEING_TONE[being];
}

/** Samhan cards sit on hanji; the Tang and Yamato courts get their own surface. */
export type Culture = 'samhan' | 'tang' | 'yamato';

export function cultureOf(kingdom: Person['kingdom']): Culture {
	return kingdom === 'tang' ? 'tang' : kingdom === 'yamato' ? 'yamato' : 'samhan';
}

const pick = (lang: string, en: string, ko: string | undefined) => (lang === 'en' ? en : ko || en);

const NATION_KO: Partial<Record<Person['kingdom'], string>> = {
	silla: '신라',
	baekje: '백제',
	goguryeo: '고구려',
	buyeo: '부여',
	jolbon: '졸본',
	gaya: '가야',
	tang: '당',
	yamato: '왜',
	tamla: '탐라',
	joseon: '고조선',
	underworld: '저승'
};

/** A realm's name in the reader's language. */
export function nationName(kingdom: Person['kingdom'], lang: string): string {
	return pick(lang, KINGDOMS[kingdom]?.label ?? '', NATION_KO[kingdom]);
}

/** A realm's flag for a card corner, when the realm has one. */
export function nationFlag(kingdom: Person['kingdom'], lang: string): { src: string; label: string } | undefined {
	const src = kingdomFlag(kingdom);
	return src ? { src, label: nationName(kingdom, lang) } : undefined;
}

/** How a place looks on its card, whether `places.ts` says it or the name does. */
export type PlaceType =
	| 'capital'
	| 'fortress'
	| 'city'
	| 'palace'
	| 'monument'
	| 'river'
	| 'sea'
	| 'mountain'
	| 'cave'
	| 'otherworld';

export const PLACE_TYPE_LABEL: Record<PlaceType, { en: string; ko: string; glyph: string }> = {
	capital: { en: 'Capital', ko: '도읍', glyph: '都' },
	fortress: { en: 'Fortress', ko: '성', glyph: '城' },
	city: { en: 'City', ko: '도시', glyph: '邑' },
	palace: { en: 'Palace', ko: '궁', glyph: '宮' },
	monument: { en: 'Monument', ko: '대', glyph: '臺' },
	river: { en: 'River', ko: '강', glyph: '江' },
	sea: { en: 'Harbour & sea', ko: '포구 · 바다', glyph: '海' },
	mountain: { en: 'Mountain & field', ko: '산 · 벌', glyph: '山' },
	cave: { en: 'Cavern & shrine', ko: '동굴 · 성소', glyph: '洞' },
	otherworld: { en: 'Otherworld', ko: '저세상', glyph: '冥' }
};

const BARE = (s: string | undefined) => (s ?? '').replace(/\s*\(.*\)\s*/g, '').trim();

/**
 * The place's look. Order matters: the otherworld and capitals first, then what
 * the hanja and Korean say (城/성 a fortress, 宮/궁 a palace, 臺/대 a tower,
 * 江·水·河 a river, 浦·島/포 the sea, 山/산 a mountain), then `kind`.
 */
export function placeType(place: Place): PlaceType {
	const han = BARE(place.hanja);
	const ko = BARE(place.korean);
	if (place.kind === 'realm' || place.side === 'underworld' || (place.side === 'other' && place.kind !== 'city'))
		return 'otherworld';
	if (place.capital) return 'capital';
	if (/[宮殿]$/.test(han) || /궁$/.test(ko) || /palace/i.test(place.name)) return 'palace';
	if (/[臺塔]$/.test(han) || /tower|observatory/i.test(place.name)) return 'monument';
	if (place.kind === 'river' || /[江水河]$/.test(han)) return 'river';
	if (place.kind === 'harbor' || /[浦島港]$/.test(han) || /포$/.test(ko)) return 'sea';
	if (place.kind === 'mountain' || /[山峴]$/.test(han) || /산$/.test(ko)) return 'mountain';
	if (place.kind === 'cave') return 'cave';
	if (/[城鎮]$/.test(han) || /(성|진)$/.test(ko) || /fortress/i.test(place.name)) return 'fortress';
	return 'city';
}
