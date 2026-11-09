/**
 * How much of the map is in the view, in sheet units. The cosmos stays at its
 * painted resolution until the reader zooms; each threshold below brings the
 * next layer, the way a map adds streets as you come in.
 *
 *   region     the peninsula's high-res ground starts to cover the coarse sheet
 *   peninsula  kingdom names and rivers
 *   cities     capitals, and a pill on every city that has a stage model
 *   sites      the remaining towns and the land's own names
 *   model      a stage pill under the view opens its model
 */
import type { CosmosScope } from '$lib/cosmos';

export const LOD = {
	region: 4200,
	peninsula: 1800,
	cities: 900,
	sites: 520,
	model: 380
} as const;

/** 0 at the region threshold, 1 once the peninsula fills the view. */
export function insetAlpha(span: number): number {
	if (span >= LOD.region) return 0;
	if (span <= LOD.peninsula) return 1;
	return (LOD.region - span) / (LOD.region - LOD.peninsula);
}

export const showRealm = (scope: CosmosScope, span: number) => scope === 'samhan' || span < LOD.peninsula;
export const showRiver = (scope: CosmosScope, span: number) => scope === 'samhan' || span < LOD.peninsula;
/** Capitals arrive first; the rest of the towns wait until the view is closer. */
export const showPlace = (scope: CosmosScope, span: number, capital: boolean) =>
	scope === 'samhan' || span < (capital ? LOD.cities : LOD.sites);
/** Stage-model cities, as pills. */
export const showPill = (scope: CosmosScope, span: number) => scope === 'samhan' || span < LOD.cities;

/** Distance from the view's centre, in half-screens (0 at the middle, ~1 at a corner). */
export function screenDist(x: number, y: number, width: number, height: number): number {
	if (!width || !height) return Infinity;
	return Math.hypot((x / width) * 2 - 1, (y / height) * 2 - 1);
}

const MODEL_IN = 0.16;
const MODEL_OUT = 0.34;

/**
 * The stage model the view has come down on. `held` is the one already open:
 * it stays until the view pulls back or the pill leaves the middle.
 */
export function modelCandidate(held: string | null, points: { id: string; dist: number }[], span: number): string | null {
	if (held) {
		const still = points.find((p) => p.id === held);
		if (still && still.dist < MODEL_OUT && span < LOD.model * 1.6) return held;
		return null;
	}
	let best: { id: string; dist: number } | null = null;
	for (const p of points) if (!best || p.dist < best.dist) best = p;
	if (best && best.dist < MODEL_IN && span < LOD.model) return best.id;
	return null;
}

/** Names that fit: lower rank wins, the rest wait for a closer view. */
export function keepRoom(items: { key: string; at: [number, number] | null; w: number; h: number; rank: number }[]): Set<string> {
	const order = items.map((it, i) => ({ it, i })).sort((a, b) => a.it.rank - b.it.rank || a.i - b.i);
	const kept: [number, number, number, number][] = [];
	const keys = new Set<string>();
	for (const { it } of order) {
		if (!it.at) continue;
		const [x, y] = it.at;
		const box: [number, number, number, number] = [x - it.w / 2, y - it.h / 2, x + it.w / 2, y + it.h / 2];
		if (kept.some((k) => box[0] < k[2] && box[2] > k[0] && box[1] < k[3] && box[3] > k[1])) continue;
		kept.push(box);
		keys.add(it.key);
	}
	return keys;
}

/** Soften the rim of a close-up sheet so it melts into the coarser ground under it. */
export function featherInset(canvas: HTMLCanvasElement) {
	const c = canvas.getContext('2d');
	if (!c) return;
	const w = canvas.width;
	const h = canvas.height;
	const mx = w * 0.14;
	const my = h * 0.14;
	c.save();
	c.globalCompositeOperation = 'destination-in';
	const band = (x: number, y: number, dw: number, dh: number, x0: number, y0: number, x1: number, y1: number) => {
		const g = c.createLinearGradient(x0, y0, x1, y1);
		g.addColorStop(0, 'rgba(0,0,0,0)');
		g.addColorStop(1, 'rgba(0,0,0,1)');
		c.fillStyle = g;
		c.fillRect(x, y, dw, dh);
	};
	band(0, 0, mx, h, 0, 0, mx, 0);
	band(w - mx, 0, mx, h, w, 0, w - mx, 0);
	band(0, 0, w, my, 0, 0, 0, my);
	band(0, h - my, w, my, 0, h, 0, h - my);
	c.restore();
}
