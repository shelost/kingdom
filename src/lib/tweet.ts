/**
 * Tweet mode dresses each line of dialogue as a post: a handle that says who
 * they are this year, and a checkmark for where they stand.
 */
import { byId, isMonarch, titleOf, type Person } from './people';
import { fullName, officeAt } from './names';

/** FNV-1a, enough to turn a string into a stable seed. */
export function hash(text: string): number {
	let h = 0x811c9dc5;
	for (let i = 0; i < text.length; i++) {
		h ^= text.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return h >>> 0;
}

/** The throne's account, handed from one monarch to the next. */
const THRONE: Partial<Record<Person['kingdom'], string>> = {
	silla: 'SillaKing',
	baekje: 'Eraha',
	goguryeo: 'Taewang',
	tang: 'SonOfHeaven',
	gaya: 'GayaKing',
	buyeo: 'BuyeoKing',
	jolbon: 'JolbonKing',
	yamato: 'Okimi',
	tamla: 'TamlaKing',
	joseon: 'Dangun'
};

/** Personal handles, earliest first, each held from `from` to `until`. Checked before the throne. */
const OWN: Record<string, { handle: string; from?: number; until?: number }[]> = {
	chunchu: [{ handle: 'CrownPrince', until: 653 }],
	yushin: [{ handle: 'SwordOfSilla' }],
	gyebek: [{ handle: 'gyebek' }],
	gesomun: [{ handle: 'eolkasum' }, { handle: 'SupremeCommander', from: 642 }],
	pung: [{ handle: 'Eraha661', from: 661 }],
	bidam: [{ handle: 'abidharma' }],
	sadaham: [{ handle: 'sakridāgāmi' }],
	gumilwife: [{ handle: 'gumilwife53423' }],
	maehwa: [{ handle: 'gumilwife53423' }]
};

const TITLE_WORDS =
	/\b(King|Queen|Prince|Princess|Lady|Lord|General|Emperor|Empress|Duke|Crown|Consort|Grand|Master|Elder|Commander|Monk|Sir|Madam|Of|The)\b/gi;

function ownHandle(p: Person, year: number | null | undefined): string | undefined {
	const list = OWN[p.id];
	if (!list) return undefined;
	const live = list.filter(
		(h) =>
			(h.from == null || (year != null && year >= h.from)) && (h.until == null || year == null || year <= h.until)
	);
	return live.at(-1)?.handle;
}

/** `@kim_seungman`: the clan's surname, then the given name of that year. */
function nameHandle(p: Person, year: number | null | undefined, look?: string | null): string {
	const name = fullName(p, year, look)
		.english.replace(TITLE_WORDS, ' ')
		.normalize('NFKD')
		.replace(/[^\w\s-]/g, '')
		.trim()
		.toLowerCase()
		.split(/[\s-]+/)
		.filter(Boolean);
	const surname = p.clan?.split('-').at(-1);
	if (surname && !name.includes(surname) && surname !== 'royal') name.unshift(surname);
	return name.join('_') || p.id;
}

/** `monarch` overrides the record, for an heir whose predecessor is still in the room. */
export function handleOf(
	p: Person,
	year: number | null | undefined,
	look?: string | null,
	monarch = isMonarch(p, year, look)
): string {
	const own = ownHandle(p, year);
	if (own) return `@${own}`;
	if (monarch && THRONE[p.kingdom]) return `@${THRONE[p.kingdom]}`;
	if (/Crown Prince/.test(officeAt(p, year)?.title ?? titleOf(p, year, look) ?? '')) return '@CrownPrince';
	return `@${nameHandle(p, year, look)}`;
}

/** The checkmark: gold for a monarch, purple for Sacred Bone, blue for True Bone and noble clans, grey for officials. */
export type Badge = 'gold' | 'purple' | 'blue' | 'grey' | undefined;

const MINOR_OFFICE = /Hwarang|Prince|Princess|Envoy|Student|Novice/i;

export function badgeOf(
	p: Person,
	year: number | null | undefined,
	look?: string | null,
	monarch = isMonarch(p, year, look)
): Badge {
	if (monarch) return 'gold';
	if (/Sacred Bone/.test(p.boneRank ?? '')) return 'purple';
	if (/True Bone/.test(p.boneRank ?? '')) return 'blue';
	const office = officeAt(p, year);
	if (office && !MINOR_OFFICE.test(office.title)) return 'grey';
	if (p.clan || p.clans?.length || p.entity === 'god') return 'blue';
	return undefined;
}

/** Organisations that letter an affiliation tile beside the checkmark: a glyph on the house colour. */
const ORGS: Record<string, { glyph: string; color: string }> = {
	harmonycouncil: { glyph: '和', color: '#2A5FB8' },
	royalsecretariat: { glyph: '執', color: '#1f4f8f' },
	hwarang: { glyph: '花', color: '#c9487a' },
	highsummit: { glyph: '諸', color: '#b3261e' },
	fivetribes: { glyph: '五', color: '#8f2a22' },
	ministersassembly: { glyph: '政', color: '#b8901c' },
	eightclans: { glyph: '八', color: '#8a6418' },
	restorationarmy: { glyph: '復', color: '#9c6b12' },
	tangcourt: { glyph: '唐', color: '#a8231c' },
	foundingsix: { glyph: '六', color: '#3a7a5a' },
	fourdragons: { glyph: '龍', color: '#4a4a52' }
};

/** Boyhood orders: an affiliation only while it is held, never as an old-boy tie. */
const HELD_ONLY = new Set(['hwarang']);

export interface Affiliation {
	id: string;
	name: string;
	glyph: string;
	color: string;
}

/** The organisation a speaker posts for this year: the latest office held in one, else a standing membership. */
export function affiliationOf(p: Person, year: number | null | undefined): Affiliation | undefined {
	const held = (p.career ?? [])
		.filter(
			(c) =>
				c.org &&
				ORGS[c.org] &&
				(year == null || ((c.from == null || year >= c.from) && (c.to == null || year <= c.to)))
		)
		.sort((a, b) => (b.from ?? -Infinity) - (a.from ?? -Infinity))[0]?.org;
	const id = held ?? p.orgs?.find((o) => ORGS[o] && !HELD_ONLY.has(o));
	if (!id) return undefined;
	return { id, name: byId.get(id)?.name ?? id, ...ORGS[id] };
}
