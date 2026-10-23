/**
 * Who holds what, phase by phase, painted like a Risk board: each side's ground a
 * wash of its colour, deepening toward its frontier and ringed and seamed with a crisp
 * line. Ground belongs to the nearest force or held wall (a big force reaches further, a
 * routed one barely holds where it stands); ground nobody is near stays unpainted.
 *
 * Anchors carry keys, so a phase change can be painted in between: the same force slides
 * and swells, a new one grows out of nothing, a lost one shrinks away, and a captured
 * wall hands its ground from one colour to the other.
 */
import { FIELD, flagSites, heldBy, moundAt, unitSpots, type Battle } from '$lib/battles';
import type { Pt } from '$lib/mapPaths';

export type Anchor = { key: string; side: string; at: Pt; r: number };

/** Sheet units of ground a force holds beyond its own footprint. */
const REACH = 64;
/** A frame on the sheet to paint (sheet units) and its resolution (pixels per sheet unit). */
export type PaintFrame = { x: number; y: number; w: number; h: number; res: number };
/** The flat map: the sheet itself. */
const SHEET: PaintFrame = { x: 0, y: 0, w: FIELD.w, h: FIELD.h, res: 0.6 };

/** Every force on the field and every held wall at phase `index`, as a keyed centre and radius. */
export function territoryAnchors(b: Battle, index: number): Anchor[] {
	const phase = b.phases[Math.min(index, b.phases.length - 1)];
	const units = unitSpots(b, phase).map(({ unit, state, cx, cy, reach }) => ({
		key: `u:${unit.id}`,
		side: unit.side,
		at: [cx, cy] as Pt,
		r: state.routed ? reach * 0.3 : reach + 18
	}));
	const walls = flagSites(b).flatMap(({ i, t, at }) => {
		const side = heldBy(b, t, index);
		return side ? [{ key: `w:${i}:${side}`, side, at, r: t.kind === 'city' || t.kind === 'town' ? 46 : 30 }] : [];
	});
	const mounds = b.terrain.flatMap((t, i) => {
		if (t.kind !== 'mound') return [];
		const m = moundAt(b, t, index);
		return m.rise > 0 && m.hold ? [{ key: `m:${i}:${m.hold}`, side: m.hold, at: t.at, r: (t.r ?? 40) * m.rise }] : [];
	});
	return [...units, ...walls, ...mounds];
}

/**
 * Anchors part-way from `from` to `to` (`t` 0…1): shared keys slide and resize; a key only
 * in `to` grows from below the frontier, a key only in `from` sinks beneath it.
 */
export function blendAnchors(from: Anchor[], to: Anchor[], t: number): Anchor[] {
	if (t >= 1) return to;
	if (t <= 0) return from;
	const was = new Map(from.map((a) => [a.key, a]));
	const out: Anchor[] = [];
	const lerp = (a: number, c: number) => a + (c - a) * t;
	for (const a of to) {
		const f = was.get(a.key);
		was.delete(a.key);
		out.push(f ? { ...a, at: [lerp(f.at[0], a.at[0]), lerp(f.at[1], a.at[1])], r: lerp(f.r, a.r) } : { ...a, r: lerp(-REACH, a.r) });
	}
	for (const f of was.values()) out.push({ ...f, r: lerp(f.r, -REACH) });
	return out;
}

const rgb = (hex: string): [number, number, number] => {
	const h = hex.replace('#', '');
	const f = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
	return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16)) as [number, number, number];
};

/** A line `width` sheet units wide, anti-aliased by distance. */
const line = (dist: number, width: number) => Math.max(0, Math.min(1, 1 - Math.abs(dist) / width));

/**
 * Paints `anchors` onto `canvas` over `frame`, one colour per side in `order`. `light`
 * lowers the wash a little, since pale ground shows colour more.
 */
export function paintAnchors(
	canvas: HTMLCanvasElement,
	anchors: Anchor[],
	order: string[],
	colors: Map<string, string>,
	light = false,
	frame: PaintFrame = SHEET
) {
	const w = Math.round(frame.w * frame.res);
	const h = Math.round(frame.h * frame.res);
	if (canvas.width !== w) canvas.width = w;
	if (canvas.height !== h) canvas.height = h;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
	const img = ctx.createImageData(w, h);
	const sides = order.filter((s) => anchors.some((a) => a.side === s));
	const fill = sides.map((s) => rgb(colors.get(s) ?? '#8a8a94'));
	const edge = fill.map(([r, g, bl]) => [r + (255 - r) * 0.45, g + (255 - g) * 0.45, bl + (255 - bl) * 0.45]);
	const live = anchors.filter((a) => a.r > -REACH && sides.includes(a.side));
	const ax = Float64Array.from(live, (a) => a.at[0]);
	const ay = Float64Array.from(live, (a) => a.at[1]);
	const ar = Float64Array.from(live, (a) => a.r);
	const as = Int32Array.from(live, (a) => sides.indexOf(a.side));
	const wash = light ? 0.3 : 0.38;
	/** The wash deepens this much more toward the frontier, the way a Risk board's border glows. */
	const rim = light ? 0.22 : 0.26;
	const best = new Float64Array(sides.length);
	const px2sheet = 1 / frame.res;

	for (let py = 0; py < h; py++) {
		const y = frame.y + (py + 0.5) * px2sheet;
		for (let px = 0; px < w; px++) {
			const x = frame.x + (px + 0.5) * px2sheet;
			best.fill(Infinity);
			for (let k = 0; k < ar.length; k++) {
				const d = Math.hypot(x - ax[k], y - ay[k]) - ar[k];
				if (d < best[as[k]]) best[as[k]] = d;
			}
			let s1 = -1;
			let s2 = -1;
			for (let s = 0; s < sides.length; s++) {
				if (s1 < 0 || best[s] < best[s1]) {
					s2 = s1;
					s1 = s;
				} else if (s2 < 0 || best[s] < best[s2]) s2 = s;
			}
			if (s1 < 0) continue;
			const d1 = best[s1];
			if (d1 >= REACH + 3) continue;
			const d2 = s2 < 0 ? Infinity : best[s2];
			const border = Math.min(REACH - d1, d2 < Infinity ? (d2 - d1) / 2 : Infinity);
			const outline = line(d1 - REACH, 5.2);
			const seam = d2 < REACH ? line((d2 - d1) / 2, 6.4) : 0;
			const stroke = Math.max(outline, seam);
			const inside = d1 < REACH ? wash + rim * Math.max(0, 1 - border / 26) ** 2 : 0;
			const a = Math.max(inside, stroke * 0.95);
			if (a <= 0) continue;
			const c = stroke > 0.5 ? edge[s1] : fill[s1];
			const o = (py * w + px) * 4;
			img.data[o] = c[0];
			img.data[o + 1] = c[1];
			img.data[o + 2] = c[2];
			img.data[o + 3] = Math.round(Math.min(1, a) * 255);
		}
	}
	ctx.putImageData(img, 0, 0);
}

/** Paints phase `index` of `b` onto `canvas` (the flat map's sheet unless `frame` says otherwise). */
export function paintTerritory(canvas: HTMLCanvasElement, b: Battle, index: number, colors: Map<string, string>, light = false, frame: PaintFrame = SHEET) {
	paintAnchors(
		canvas,
		territoryAnchors(b, index),
		b.sides.map((s) => s.id),
		colors,
		light,
		frame
	);
}
