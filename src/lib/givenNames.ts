/**
 * The names monarchs were born with, for the cards that write their reign title:
 * 김덕만 beneath 선덕여왕. Listed in `data/given-names.json` by person id; a record
 * whose reign stage renamed it falls back to its own birth name.
 *
 * Wiki profiles invert the card: birth name is the hero, royal name sits small above.
 */
import GIVEN from '$lib/data/given-names.json';
import { fullName, personName, sameName } from '$lib/names';
import { nameOf, type Person } from '$lib/people';

export interface GivenName {
	korean?: string;
	hanja?: string;
	english?: string;
}

const LISTED: Record<string, { korean: string; hanja?: string; english: string }> = GIVEN;

const REIGN_NAME =
	/^(?:(?:First|Second|Third|Fourth)\s+)?(?:King|Queen|Emperor|Empress|Khagan|Heavenly Sovereign)\b/i;

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
		(s) => !!s.name && REIGN_NAME.test(s.name) && s.name !== birth.english && !s.lookOnly
	);
	if (reignStage?.name) {
		return { english: reignStage.name, korean: reignStage.korean, hanja: reignStage.hanja };
	}
	if (REIGN_NAME.test(p.name) && p.name !== birth.english) {
		return {
			english: p.name,
			korean: p.korean !== birth.korean ? p.korean : undefined,
			hanja: p.hanja && p.hanja !== birth.hanja ? p.hanja : undefined
		};
	}
	return undefined;
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
