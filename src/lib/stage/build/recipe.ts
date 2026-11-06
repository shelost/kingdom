import { fbm, noise, smoothstep, distanceToPath, chaikin, resample, type Bounds, type P2 } from './geo';
import { at, hall, tower, court, ribbon, flat, stoneWall, rampart, gateOnWall, type Builder, type HallSpec, type Mat, type PaletteOptions, type TreeKind } from './kit';
import type { Ground } from './terrain';
import { lerp, mountainField, pick, riverStrip, startSite, assemble, bankCover, scatterCover, scatterTrees, Footprints, type Mountain, type RangeOpts, type AssembleOpts, type SiteFrame } from './common';
import { crag, munru, banners, wallBanners, wallTorches, outwardOf, hamlet, type MunruSpec } from './fortress';
import type { MistLayer } from './nature';
import type { LifeSpec } from './life';
import type { Folk } from './people';
import type { Realm, SiteBuild, View, Weather } from './types';

/*
 * A site as data. The newer grounds (the Goguryeo corner fortresses, the old kingdoms and the
 * myth realms) share one ground recipe: a plain with mountain ranges, crag hills (optionally
 * levelled into a yard), rivers carved into it and an optional sea, then walls with gate
 * pavilions, walled courts of halls, villages, forest and ground cover. Each site adds what
 * makes it itself through `extra`.
 */

export type Hill = { x: number; z: number; rx: number; rz: number; h: number; seed?: number; power?: number; /** Levels the hill into a yard at this height above the plain. */ top?: number };

/** Path runs downstream (the water shader flows along it). */
export type River = { path: P2[]; half: number; water: number; bed: number; /** Painted water colour (needs `water.painted`). */ color?: string };

export type Look = {
	fields: string[];
	forest: string[];
	rock: string;
	bed: string;
	bank: string;
	/** A levelled yard. */
	top?: string;
	/** The beach where the sea comes in. */
	sand?: string;
	/** Painted forest canopy on the slopes, 0..1. */
	canopy?: number;
	/** Custom colour: return a hex to override the recipe's choice. */
	paint?: (x: number, z: number, y: number, slope: number, n: number) => string | null;
};

export type WallSpec = {
	ring: P2[];
	kind?: 'stone' | 'earth';
	h: number;
	t?: number;
	mat?: Mat;
	cloth: Mat;
	every?: number;
	gates: { near: P2; munru?: MunruSpec; half?: number }[];
	torches?: number;
};

export type CourtSpec = {
	x: number;
	z: number;
	w: number;
	d: number;
	/** Yard height; the ground at the centre otherwise. */
	y?: number;
	gate?: 's' | 'n' | 'e' | 'w';
	pave?: Mat | false;
	main: HallSpec;
	/** A second storey on the main hall. */
	upper?: HallSpec;
	/** Side halls facing the yard. */
	wings?: HallSpec;
	label?: { id: string; en: string; ko: string; status: 'placed' | 'fictional' | 'recorded' | 'excavated'; note?: string };
};

export type RecipeCtx = SiteFrame & {
	g: Ground;
	/** Mountains plus hills above the plain. */
	rise(x: number, z: number): number;
	/** Distance to the nearest river centreline. */
	riverD(x: number, z: number): number;
	/** Open ground: off the walls, roads, rivers and every placed footprint. */
	clear(x: number, z: number, pad?: number): boolean;
	taken: Footprints;
	walls: WallSpec[];
	/** A road on the ground; kept clear of trees and houses. */
	road(path: P2[], width?: number): P2[];
	plain: number;
};

export type Recipe = {
	name: string;
	seed: number;
	near: Bounds;
	cell?: number;
	far?: number;
	plain: number;
	/** Gentle roll on the plain, metres. */
	roll?: number;
	mountains: Mountain[];
	range?: RangeOpts;
	hills?: Hill[];
	rivers?: River[];
	/** Sea where `mask` > 0 (1 = open water), sunk to `floor` under the `level` surface. */
	sea?: { level: number; floor: number; mask: (x: number, z: number) => number; box: Bounds; color?: string };
	look: Look;
	palette?: PaletteOptions;
	walls?: (c: RecipeCtx) => WallSpec[];
	courts?: CourtSpec[];
	hamlets?: { x: number; z: number; r: number; n: number; thatch: number; trees?: TreeKind[] }[];
	trees?: { n: number; kinds: TreeKind[]; h?: [number, number]; min?: number };
	grass?: { n: number; box: Bounds; ok?: (x: number, z: number) => boolean };
	/** Runs after the ground and walls, before trees fill the gaps. */
	extra?: (c: RecipeCtx) => void;
	views: (c: RecipeCtx) => View[];
	mist?: MistLayer[];
	center: [number, number];
	radius: number;
	haze: string;
	water?: AssembleOpts['water'];
	realm?: Realm;
	weather?: Weather;
	life?: (c: RecipeCtx) => LifeSpec;
	/** A costume lineup of the site's dress, with its own camera. */
	wardrobe?: (c: RecipeCtx) => AssembleOpts['wardrobe'];
};

/** Guards along every wall walk of a recipe site, `top` metres up on stone walls. */
export function garrison(c: RecipeCtx, folk: Folk, top: number, every: number): void {
	for (const w of c.walls) {
		const out = outwardOf(w.ring);
		folk.wall(w.ring, w.kind === 'earth' ? w.h * 0.85 : top, every, { closed: true, outward: out, t: w.t ?? 4.6 });
	}
}

function hillAt(h: Hill, x: number, z: number): number {
	const y = crag(x, z, h.x, h.z, h.rx, h.rz, h.h, h.seed ?? 1, h.power ?? 0.75);
	return h.top !== undefined && y > h.top ? h.top + (y - h.top) * 0.06 : y;
}

/** A walled court with a main hall on its axis and side halls facing the yard. */
function placeCourt(b: Builder, c: CourtSpec, y: number): number {
	court(b, c.x, c.z, c.w, c.d, y, { gate: c.gate ?? 's', pave: c.pave ?? 'earth' });
	const m = at(c.x, y, c.z - c.d * 0.14);
	const ridge = c.upper ? tower(b, m, c.main, c.upper).ridge : hall(b, m, c.main).ridge;
	if (c.wings) {
		for (const side of [-1, 1]) hall(b, at(c.x + side * c.w * 0.32, y, c.z + c.d * 0.1, side * (Math.PI / 2)), c.wings);
	}
	b.lampPost(c.x - 6, y, c.z + c.d * 0.12);
	b.lampPost(c.x + 6, y, c.z + c.d * 0.12);
	return ridge;
}

export function buildRecipe(r: Recipe): SiteBuild {
	const mountains = mountainField(r.mountains, r.range);
	const hills = r.hills ?? [];
	// rivers are carved and painted along a smoothed course, so the control points read as bends
	const rivers = (r.rivers ?? []).map((rv) => ({ ...rv, path: chaikin(rv.path, 3, false) }));
	const hillSum = (x: number, z: number) => hills.reduce((s, h) => s + hillAt(h, x, z), 0);
	const rise = (x: number, z: number) => mountains(x, z) + hillSum(x, z);
	const riverD = (x: number, z: number) => rivers.reduce((d, rv) => Math.min(d, distanceToPath(rv.path, x, z) - rv.half), Infinity);
	const roll = r.roll ?? 1.4;

	const height = (x: number, z: number) => {
		let y = r.plain + fbm(x / 380, z / 380) * roll + rise(x, z);
		for (const rv of rivers) {
			const d = distanceToPath(rv.path, x, z);
			if (d < rv.half + 110) y = Math.min(y, lerp(rv.bed, r.plain + 30, smoothstep(rv.half - 25, rv.half + 100, d)));
		}
		if (r.sea) {
			const m = r.sea.mask(x, z);
			if (m > 0) y = lerp(y, r.sea.floor, smoothstep(0, 1, m));
		}
		return y;
	};
	const L = r.look;
	const color = (x: number, z: number, y: number, slope: number): string => {
		const n = noise(x / 37, z / 37);
		const custom = L.paint?.(x, z, y, slope, n);
		if (custom) return custom;
		if (r.sea && r.sea.mask(x, z) > -0.08 && y < r.sea.level + 2.5) return L.sand ?? L.bank;
		if (riverD(x, z) < 18 && y < r.plain - 1) return rivers.some((rv) => y < rv.water) ? L.bed : L.bank;
		const up = rise(x, z);
		if (L.top && hills.some((h) => h.top !== undefined && hillAt(h, x, z) > h.top - 0.5)) return L.top;
		if (up > 5) return slope > 0.55 ? L.rock : pick(L.forest, (n + 1) / 2);
		if (slope < 0.06) {
			const cx = Math.floor((x + 13) / 48);
			const cz = Math.floor((z - 7) / 30);
			return pick(L.fields, Math.abs(Math.sin(cx * 12.9898 + cz * 78.233) * 43758.5453) % 1);
		}
		return pick(L.fields, (n + 1) / 2);
	};
	const coverK = L.canopy ?? 1;
	const cover = (x: number, z: number, _y: number, slope: number) => {
		const up = rise(x, z);
		if (up < 5 || hills.some((h) => h.top !== undefined && hillAt(h, x, z) > h.top - 4)) return 0;
		return (slope > 0.55 ? 0.2 : smoothstep(5, 30, up)) * coverK;
	};
	const g: Ground = { height, color, cover };

	const s = startSite(r.name, g, { near: r.near, cell: r.cell ?? 6, far: r.far ?? 20000, farCell: 110, center: r.center, seed: r.seed, palette: r.palette });
	const { b } = s;

	for (const rv of rivers) {
		if (rv.color) b.pushColored('water', ribbon(chaikin(rv.path, 2, false), rv.half * 2 + 50, () => rv.water), rv.color);
		else riverStrip(b, rv.path, rv.half * 2 + 50, rv.water);
	}
	if (r.sea) {
		const sb = r.sea.box;
		const outline: P2[] = [
			[sb.minX, sb.minZ],
			[sb.maxX, sb.minZ],
			[sb.maxX, sb.maxZ],
			[sb.minX, sb.maxZ]
		];
		b.push('water', flat(outline, r.sea.level));
	}

	const taken = new Footprints();
	const roads: { line: P2[]; w: number }[] = [];
	const ctx: RecipeCtx = {
		...s,
		g,
		rise,
		riverD,
		taken,
		walls: [],
		plain: r.plain,
		road(path, width = 6) {
			const line = resample(chaikin(path, 2, false), 4, false);
			b.push('path', ribbon(line, width, (x, z) => height(x, z) + 0.12));
			roads.push({ line, w: width });
			return line;
		},
		clear(x, z, pad = 0) {
			if (taken.inside(x, z, pad)) return false;
			if (riverD(x, z) < 20 + pad) return false;
			if (r.sea && r.sea.mask(x, z) > -0.05) return false;
			for (const w of ctx.walls) if (distanceToPath(w.ring, x, z, true) < 10 + pad) return false;
			for (const rd of roads) if (distanceToPath(rd.line, x, z) < rd.w / 2 + 1 + pad) return false;
			return true;
		}
	};

	/* ---------------------------------------------------------- walls and gates */

	ctx.walls = r.walls?.(ctx) ?? [];
	for (const w of ctx.walls) {
		const out = outwardOf(w.ring);
		const gates = w.gates.map((gt) => gateOnWall(w.ring, gt.near, { closed: true, outward: out }));
		const gaps = gates.map((gt, i) => ({ at: gt.at, half: w.gates[i].half ?? 11 }));
		if (w.kind === 'earth') {
			rampart(
				b,
				w.ring,
				[
					[-w.h * 2.2, 0.2],
					[-w.h * 0.7, w.h * 0.85],
					[0, w.h],
					[w.h * 0.7, w.h * 0.85],
					[w.h * 2.4, 0.2]
				],
				height,
				{ closed: true, gaps, outward: out, step: 8, slope: 'rampart', top: 'path' }
			);
		} else stoneWall(b, w.ring, height, { h: w.h, t: w.t ?? 4.6, closed: true, outward: out, gaps, step: 4, mat: w.mat });
		gates.forEach((gt, i) => {
			const spec = w.gates[i].munru;
			if (!spec) return;
			const gy = height(gt.at[0], gt.at[1]) - 0.6;
			const made = munru(b, at(gt.at[0], gy, gt.at[1], gt.rot), spec);
			const [fx, fz] = [Math.sin(gt.rot), Math.cos(gt.rot)];
			const [rx, rz] = [Math.cos(gt.rot), -Math.sin(gt.rot)];
			const half = (spec.block?.w ?? 16) / 2 - 1.5;
			banners(
				b,
				[-half, half].map((d) => [gt.at[0] + rx * d - fx * 3.5, gy + made.base, gt.at[1] + rz * d - fz * 3.5] as [number, number, number]),
				w.cloth,
				7,
				gt.rot
			);
			taken.add(gt.at[0], gt.at[1], 30, 30);
		});
		const nearGate = (x: number, z: number) => gates.some((gt) => Math.hypot(x - gt.at[0], z - gt.at[1]) < 18);
		wallBanners(b, w.ring, height, w.cloth, w.every ?? 26, { h: w.kind === 'earth' ? w.h * 0.6 : w.h, closed: true, outward: out, skip: nearGate });
		if (w.torches) wallTorches(b, w.ring, height, w.torches, { h: w.h, closed: true, outward: out, t: 4.5, skip: nearGate });
	}

	/* ---------------------------------------------------------- courts and halls */

	for (const c of r.courts ?? []) {
		const y = c.y ?? height(c.x, c.z);
		const ridge = placeCourt(b, c, y);
		taken.add(c.x, c.z, c.w + 6, c.d + 6);
		if (c.label) s.labels.push({ ...c.label, at: [c.x, y + ridge + 7, c.z - c.d * 0.14] });
	}

	r.extra?.(ctx);
	const dress = r.wardrobe?.(ctx);
	if (dress) taken.add(dress.x, dress.z, 26, 26);

	/* ---------------------------------------------------------- villages, forest, grass */

	for (const h of r.hamlets ?? []) {
		hamlet(s.town, s.forest, g, s.rand, { ...h, ok: (x, z) => rise(x, z) < 6 && ctx.clear(x, z, 4), taken });
	}
	if (r.trees) {
		const t = r.trees;
		scatterTrees(s.forest, g, r.near, t.n, s.rand, (x, z) => rise(x, z) > (t.min ?? 6) && ctx.clear(x, z, 2), (k) => pick(t.kinds, k), t.h ?? [8, 15]);
	}
	for (const rv of rivers) {
		if (rv.color) continue;
		bankCover(s.cover, g, rv.path, rv.water, s.rand, { from: rv.half - 12, to: rv.half + 40, step: 5, skip: (x, z) => taken.inside(x, z, 2) });
		for (const [x, z] of resample(chaikin(rv.path, 2, false), 24, false)) {
			for (const side of [1, -1]) {
				if (s.rand() > 0.45) continue;
				const px = x + side * (rv.half + 32 + s.rand() * 30);
				const pz = z + (s.rand() - 0.5) * 30;
				if (!ctx.clear(px, pz, 4) || rise(px, pz) > 6) continue;
				s.forest.add('willow', px, height(px, pz), pz, 8 + s.rand() * 4);
			}
		}
	}
	if (r.grass) {
		const gr = r.grass;
		scatterCover(s.cover, g, gr.box, gr.n, s.rand, (x, z) => ctx.clear(x, z, 0.5) && (gr.ok?.(x, z) ?? true), 1);
	}

	return assemble({
		...s,
		mist: r.mist ? { height, box: { minX: -6000, maxX: 6000, minZ: -6000, maxZ: 6000 }, layers: r.mist } : undefined,
		views: r.views(ctx),
		center: r.center,
		radius: r.radius,
		haze: r.haze,
		water: r.water,
		realm: r.realm,
		weather: r.weather,
		life: r.life?.(ctx),
		wardrobe: dress
	});
}
