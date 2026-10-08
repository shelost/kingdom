/**
 * Greedy label placement for map markers, in screen pixels.
 *
 * Each label tries spots around its marker (right, left, the diagonals, above,
 * below, then the same ring a little farther out) and takes the first that
 * stays inside the sheet without touching another label or any marker.
 * Capitals choose first, then the most crowded markers; a label with no free
 * spot comes back `null` and is only shown while its marker is hovered.
 */

export interface LabelItem {
	id: string;
	/** marker centre */
	x: number;
	y: number;
	/** marker radius */
	r: number;
	/** label box */
	w: number;
	h: number;
	/** higher places first (capitals) */
	priority?: number;
	/** a flag planted on the marker (MapFlag): kept clear, even of the marker's own label */
	flag?: FlagSize;
}

export type FlagSize = { w: number; h: number };

/** MapFlag's pole and cloth, in px, with the finial. */
export const FLAG_SIZE: Record<'xs' | 'sm' | 'md', FlagSize> = {
	xs: { w: 11, h: 15 },
	sm: { w: 14, h: 19 },
	md: { w: 20, h: 26 }
};

export type LabelSpot = { left: number; top: number } | null;

interface Box {
	left: number;
	top: number;
	right: number;
	bottom: number;
}

const GAP = 2;
const PAD = 1;
/** extra distance per ring, as a fraction of the label height */
const RINGS = [0, 0.5, 1, 1.6];
/** how far a marker counts as a neighbour when ranking crowding */
const CROWD_RADIUS = 48;

function candidates(it: LabelItem, ring: number): { left: number; top: number }[] {
	const { x, y, r, w, h } = it;
	const d = r + GAP + ring * h;
	const diag = r * 0.7 + GAP + ring * h;
	return [
		{ left: x + d, top: y - h / 2 },
		{ left: x - d - w, top: y - h / 2 },
		{ left: x + diag, top: y - diag - h },
		{ left: x + diag, top: y + diag },
		{ left: x - diag - w, top: y - diag - h },
		{ left: x - diag - w, top: y + diag },
		{ left: x - w / 2, top: y - d - h },
		{ left: x - w / 2, top: y + d },
		{ left: x + d, top: y - h },
		{ left: x + d, top: y },
		{ left: x - d - w, top: y - h },
		{ left: x - d - w, top: y }
	];
}

const hits = (a: Box, b: Box) =>
	a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

export function placeLabels(items: LabelItem[], width: number, height: number): Record<string, LabelSpot> {
	const markers = new Map<string, Box>(
		items.map(({ id, x, y, r }) => [id, { left: x - r - PAD, top: y - r - PAD, right: x + r + PAD, bottom: y + r + PAD }])
	);
	/** The flag's pole foot sits just above the marker's centre and the cloth flies to the right. */
	const flags: Box[] = items.flatMap(({ x, y, r, flag }) =>
		flag ? [{ left: x - PAD, top: y - r * 0.1 - flag.h - PAD, right: x + flag.w + PAD, bottom: y - r * 0.1 }] : []
	);
	const crowd = new Map(
		items.map((a) => [a.id, items.filter((b) => b !== a && Math.hypot(a.x - b.x, a.y - b.y) < CROWD_RADIUS).length])
	);
	const order = [...items].sort(
		(a, b) => (b.priority ?? 0) - (a.priority ?? 0) || crowd.get(b.id)! - crowd.get(a.id)!
	);

	const placed: Box[] = [];
	const out: Record<string, LabelSpot> = {};
	for (const it of order) {
		out[it.id] = null;
		search: for (const ring of RINGS) {
			for (const c of candidates(it, ring)) {
				const box = { left: c.left, top: c.top, right: c.left + it.w, bottom: c.top + it.h };
				if (box.left < 0 || box.top < 0 || box.right > width || box.bottom > height) continue;
				if (placed.some((p) => hits(box, p))) continue;
				if ([...markers].some(([id, m]) => id !== it.id && hits(box, m))) continue;
				if (flags.some((f) => hits(box, f))) continue;
				placed.push(box);
				out[it.id] = c;
				break search;
			}
		}
	}
	return out;
}
