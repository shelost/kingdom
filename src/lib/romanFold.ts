/**
 * The chronicle spells ㅓ / ㅡ as `u` and ㅐ as `e` (Sunduk, Gesomun, Gunchogo), while readers
 * often type textbook romanization (Seondeok, Gaesomun, Geunchogo). Folding a lowercased search
 * term the same way lets either spelling find the page.
 */
export function foldRoman(term: string): string {
	return term.replace(/yeo/g, 'yu').replace(/eo|eu/g, 'u').replace(/ae/g, 'e');
}

/** Lowercased search terms to try: the term itself, plus its folded spelling when that differs. */
export function termVariants(term: string): string[] {
	const folded = foldRoman(term);
	return folded === term ? [term] : [term, folded];
}

/** Whether a lowercased haystack holds the term in either spelling. */
export function hasTerm(hay: string, term: string): boolean {
	return termVariants(term).some((t) => hay.includes(t));
}
