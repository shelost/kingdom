/**
 * The flags that fly over the maps and the battle fields: the banner over a border
 * polity, a place in a given year, or a battle side. A holder with no flag in the
 * chronicle (Han, Wei, Sui, the rebels) flies plain cloth in its colour.
 */
import { flagOf, flagSrc } from '$lib/flags';
import { POLITIES, placeHolding, polityName, type PolityId } from '$lib/borders';
import type { Battle } from '$lib/battles';

export interface Banner {
	/** The flag image (SVG), or null for plain cloth. */
	src: string | null;
	color: string;
	label: string;
	/** Changes exactly when the banner does, so a swap can animate. */
	key: string;
}

/** The Chinese frontier flies Tang's banner only once there is a Tang. */
const TANG_FROM = 618;

export function polityBanner(id: PolityId, year: number): Banner {
	const flag = id === 'china' ? (year >= TANG_FROM ? 'tang' : null) : flagOf(id);
	const src = flag ? flagSrc(flag) : null;
	return { src, color: POLITIES[id].color, label: polityName(id, year).label, key: src ?? id };
}

/** The banner over whoever holds the ground at sheet point `at` in `year`; null on unheld ground. */
export function placeBanner(at: { x: number; y: number }, year: number): Banner | null {
	const hold = placeHolding(at.x, at.y, year);
	return hold?.polity ? polityBanner(hold.polity, year) : null;
}

/** A battle side's banner: its kingdom's flag, or plain cloth in the colour it wears on the field. */
export function sideBanner(b: Battle, sideId: string | undefined, color: string): Banner | null {
	if (!sideId) return null;
	const side = b.sides.find((s) => s.id === sideId);
	const flag = side?.kingdom ? flagOf(side.kingdom) : null;
	const src = flag ? flagSrc(flag) : null;
	return { src, color, label: side?.name ?? sideId, key: src ?? `${sideId}:${color}` };
}

/** The raster twin of a flag: WebGL textures want pixels, not SVG. */
export const flagTexture = (src: string) => src.replace(/\.svg(?=\?|$)/, '.png');
