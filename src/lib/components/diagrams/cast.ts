/**
 * Who sits where when a chart shows a scene. A diagram block's `cast` maps a seat id to
 * a `people` id, and the chart puts that person's face over the seat. A chart that
 * introduces an institution leaves `cast` out and keeps its titles.
 */
import { avatarOf, byId, koreanOf, nameOf, type Person } from '$lib/people';

export type Cast = Record<string, string>;

export interface Sitter {
	person: Person;
	img: string | null;
	ko?: string;
	en: string;
}

/** The person in `seat`, as they look in `year`; null for a seat the scene leaves unnamed. */
export function sitter(cast: Cast | undefined, seat: string, year?: number | null): Sitter | null {
	const id = cast?.[seat];
	const p = id ? byId.get(id) : undefined;
	if (!p) return null;
	return { person: p, img: avatarOf(p, undefined, year), ko: koreanOf(p, year), en: nameOf(p, year) };
}

/** True when `p` holds the office `korean` (상대등, 상좌평…) of `org` in `year`. */
export function holdsOffice(p: Person, org: string, korean: string, year?: number | null): boolean {
	if (year == null) return false;
	return !!p.career?.some(
		(c) => c.org === org && c.korean === korean && (c.from ?? -Infinity) <= year && year <= (c.to ?? Infinity)
	);
}
