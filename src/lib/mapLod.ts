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
 *
 * Closer than the framed scope, a detail patch repaints just the ground under
 * the camera — sharper coasts, relief and borders, the way a map fills in.
 */
import type { CosmosScope, SheetBox } from '$lib/cosmos';

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

export type DetailPatch = {
	box: SheetBox;
	/** Samples along the patch's long side. */
	long: number;
	/** Paint canvas long side, in pixels. */
	paint: number;
};

/**
 * Sheet size of what the camera actually shows. The fit box is letterboxed to
 * the canvas, so a wide window sees more ground than `fit.w / zoom`.
 */
export function viewSheet(fit: SheetBox, k: number, canvasW: number, canvasH: number): { w: number; h: number } {
	const pad = 1.04;
	let hw = (fit.w / 2) * pad;
	let hh = (fit.h / 2) * pad;
	const aspect = canvasW > 0 && canvasH > 0 ? canvasW / canvasH : hw / Math.max(hh, 1);
	if (hw / hh > aspect) hh = hw / aspect;
	else hw = hh * aspect;
	const s = Math.max(k, 0.001);
	return { w: (hw * 2) / s, h: (hh * 2) / s };
}

/**
 * The ground under the camera once the reader has zoomed past the framed scope.
 * The box covers the whole view and snaps, so a small pan or zoom does not rebuild it.
 * Null while the frame still fits.
 */
export function detailPatch(
	fit: SheetBox,
	zoom: { k: number; x: number; y: number; r: number },
	view: { w: number; h: number }
): DetailPatch | null {
	const ratio = Math.min(view.w / Math.max(fit.w, 1), view.h / Math.max(fit.h, 1));
	if (ratio > 0.68) return null;
	const half = Math.max(zoom.k, 0.001);
	const dx = (zoom.x * view.w * half) / 2;
	const dy = (-zoom.y * view.h * half) / 2;
	const c = Math.cos(-zoom.r);
	const s = Math.sin(-zoom.r);
	const cx = fit.x + fit.w / 2 + dx * c - dy * s;
	const cy = fit.y + fit.h / 2 + dx * s + dy * c;
	const level = ratio > 0.22 ? 1 : ratio > 0.08 ? 2 : 3;
	/** Opaque cover, with air for the snap. Quantized so a zoom inside the step keeps the same patch. */
	const need = Math.max(view.w, view.h) * 1.55;
	const quantum = 1.4;
	const side = quantum ** Math.ceil(Math.log(Math.max(need, 1)) / Math.log(quantum));
	const step = side * 0.22;
	const qx = Math.round(cx / step) * step;
	const qy = Math.round(cy / step) * step;
	return {
		box: { x: qx - side / 2, y: qy - side / 2, w: side, h: side },
		/**
		 * A coarse grid (the old 192) triangulated the fish-eye into blobs: land
		 * smeared across a triangle and the coast tore. 480 keeps a cell under
		 * a few screen pixels even on the first zoom step.
		 */
		long: 480,
		paint: level === 1 ? 1536 : level === 2 ? 2048 : 2560
	};
}

/** 0 at the edge of the framed scope, 1 once the patch should cover the view. Samhan is always covered. */
export function detailAlpha(view: { w: number; h: number }, fit: SheetBox, scope: CosmosScope): number {
	if (scope === 'samhan') return 1;
	const ratio = Math.min(view.w / Math.max(fit.w, 1), view.h / Math.max(fit.h, 1));
	const far = 0.68;
	const near = 0.6;
	if (ratio >= far) return 0;
	if (ratio <= near) return 1;
	return (far - ratio) / (far - near);
}

export const showRealm = (scope: CosmosScope, span: number) => scope === 'samhan' || span < LOD.peninsula;
export const showRiver = (scope: CosmosScope, span: number) => scope === 'samhan' || span < LOD.peninsula;
/** Capitals arrive first; the rest of the towns wait until the view is closer. */
export const showPlace = (scope: CosmosScope, span: number, capital: boolean) =>
	scope === 'samhan' || span < (capital ? LOD.cities : LOD.sites);
/** Stage-model cities, as pills. */
export const showPill = (scope: CosmosScope, span: number) => scope === 'samhan' || span < LOD.cities;

/**
 * Sheet-unit nudge for a name that would sit on a small island.
 * The dot stays on the city; the pill moves.
 */
export const LABEL_NUDGE: Record<string, [number, number]> = {
	/** Just north of the dot, so the pill clears Tamla’s island without leaving the circle. */
	mugun: [20, -42]
};

export function labelNudge(id: string): [number, number] {
	return LABEL_NUDGE[id] ?? [0, 0];
}

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
	const mx = w * 0.22;
	const my = h * 0.22;
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
