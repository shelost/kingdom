/**
 * The known world's painted surface for the 3D map's wide views
 * (static/map-cosmos.json, built by scripts/build-cosmos-layer.mjs): sea and land,
 * each standing polity washed in its region's colour, and past Rome the myth band
 * (mist, then the Western Flower Fields, then the Underworld's dark) with the three
 * waters meeting at the pavilion. One canvas over COSMOS_FRAME, repainted only when
 * the standing polities change.
 */
import {
	AFRICA_LANDS,
	CIV_SPHERES,
	COSMOS_FRAME,
	COSMOS_LABELS,
	DEAD_DISC,
	DESERT_LANDS,
	HALF_DISC,
	JUNGLE_LANDS,
	LAND_ADDS,
	LIVING_DISC,
	MYTH_LABELS,
	ONE_NAME,
	SNOW_LANDS,
	TEN_HELLS,
	UNKNOWN_LANDS,
	WATER_CUTS,
	WEST_LANDS,
	ANSEO_NAME,
	PROTECTORATE_NAME,
	REGION_COLOR,
	SAMHAN_ISLES,
	SAMHAN_POLITIES,
	clipsFor,
	cosmosProject,
	crossroads,
	fishEye,
	fishPathData,
	fishScale,
	hellAt,
	fieldRivers,
	layoutSpots,
	lensPoint,
	lensTips,
	meadow,
	riverOfLife,
	projectionVer,
	regionOf,
	sheetRing,
	viewDiscs,
	type CosmosClip,
	type CosmosLabel,
	type CosmosLayout,
	type CosmosRegion,
	type CosmosScope,
	type Disc,
	type SheetBox
} from '$lib/cosmos';
import type { MapPalette } from '$lib/mapTerrain';
import { BORDER_SITES, borderLinesAt, GAYA_LEAGUES, holdingsAt, mapColor, settledYear, siteColor, type PolityId } from '$lib/borders';
import { MAP_VIEWBOX } from '$lib/places';
import { realmRuler, type RealmRuler } from '$lib/realmRulers';

type Row = [name: number, from: number, to: number, area: number, shape: number];
/** A polity's names; `h` its hanja and `g` its label tag, where Samhan named it on the map. */
type Name = { en: string; ko: string; r: CosmosRegion; h?: string; g?: string };

export interface CosmosData {
	source: string;
	names: Name[];
	shapes: string[];
	rows: Row[];
	land: string;
}

let loading: Promise<CosmosData> | null = null;

/** The known world, fetched once per page. */
export function loadCosmos(): Promise<CosmosData> {
	loading ??= fetch('/map-cosmos.json').then(async (r) => {
		if (!r.ok) throw new Error(`map-cosmos.json: ${r.status}`);
		const data = (await r.json()) as CosmosData;
		for (const n of data.names) n.r = regionOf(n.r);
		return data;
	});
	loading.catch(() => (loading = null));
	return loading;
}

/** Polities standing in `year`, largest first. */
export function standingAt(d: CosmosData, year: number): Row[] {
	return d.rows.filter((r) => r[1] <= year && year <= r[2]).sort((a, b) => b[3] - a[3]);
}

/** The dynasty under a region's label: its largest standing polity. */
export function dynastyAt(d: CosmosData, year: number, region: CosmosRegion): { en: string; ko: string } | null {
	const top = standingAt(d, year).find((r) => regionOf(d.names[r[0]].r) === region);
	return top ? d.names[top[0]] : null;
}

const centres = new Map<string, [number, number]>();
/** The middle of a shape's largest ring, in sheet units (area-weighted). */
function shapeCentre(d: string): [number, number] {
	let c = centres.get(d);
	if (c) return c;
	let best = { a: 0, x: 0, y: 0 };
	for (const ring of d.split('M').filter(Boolean)) {
		const [head, moves = ''] = ring.replace('z', '').split('l');
		let [x, y] = head.split(',').map(Number);
		const pts: [number, number][] = [[x, y]];
		for (const m of moves.trim().split(' ')) {
			if (!m) continue;
			const [dx, dy] = m.split(',').map(Number);
			x += dx;
			y += dy;
			pts.push([x, y]);
		}
		let a = 0;
		let cx = 0;
		let cy = 0;
		pts.forEach(([x0, y0], i) => {
			const [x1, y1] = pts[(i + 1) % pts.length];
			const cross = x0 * y1 - x1 * y0;
			a += cross;
			cx += (x0 + x1) * cross;
			cy += (y0 + y1) * cross;
		});
		if (Math.abs(a) > Math.abs(best.a)) best = { a, x: cx / (3 * a), y: cy / (3 * a) };
	}
	c = [best.x, best.y];
	centres.set(d, c);
	return c;
}

/** Each standing polity tagged `tag`, with its names and the middle of its land (sheet units). */
export function taggedAt(d: CosmosData, year: number, tag: string): { name: Name; at: [number, number] }[] {
	return standingAt(d, year)
		.filter((r) => d.names[r[0]].g === tag)
		.map((r) => ({ name: d.names[r[0]], at: shapeCentre(d.shapes[r[4]]) }));
}

export type CosmosLine = { key: string; han: string; ko: string; en: string; people?: boolean; protectorate?: boolean };

export type CosmosShown = {
	key: string;
	id: string;
	han: string;
	ko: string;
	en: string;
	/** Stable wiki / civilization id when the label opens a profile. */
	nation?: string;
	epithet?: CosmosLabel['epithet'];
	xy: [number, number];
	color?: string;
	sea?: boolean;
	realm?: boolean;
	myth?: boolean;
	home?: boolean;
	protectorate?: boolean;
	sub?: boolean;
	native?: string;
	/** Material Symbols name for a hell (replaces hanja). */
	icon?: string;
	/** Label tier below the peoples: biomes, rivers, oceans. */
	kind?: CosmosLabel['kind'];
	/** Text colour for a tiered label. */
	tint?: string;
	standing: { en: string; ko: string } | null;
	/** Who rules it this year, when the map asks for rulers. */
	ruler?: RealmRuler | null;
	lines: CosmosLine[];
};

/**
 * Names for one year and layout: civilizations, seas and the myth stations, never the
 * peoples inside a civilization. Protectorates ride under their host off the world frame.
 * With `rulers`, each civilization and each hell carries its ruler that year.
 */
export function labelsAt(
	d: CosmosData | null,
	year: number,
	scope: CosmosScope,
	layout: CosmosLayout,
	myth: boolean,
	rulers = false
): CosmosShown[] {
	const spots = layoutSpots(layout);
	const mythOn = myth && scope === 'cosmos';
	const live = [...COSMOS_LABELS, ...(mythOn ? MYTH_LABELS : [])].filter((l) => {
		const scopes = l.scopes ?? (l.people || l.sub ? (['sphere'] as const) : (['world', 'cosmos'] as const));
		if (!scopes.includes(scope)) return false;
		if (scope !== 'sphere' && (l.people || l.sub)) return false;
		if (l.years && !(l.years[0] <= year && year <= l.years[1])) return false;
		if (l.protectorate && scope === 'cosmos') return false;
		return true;
	});
	const placed = live.flatMap((l): CosmosShown[] => {
		const standing = d && l.dynasty && l.region ? dynastyAt(d, year, l.region) : null;
		/** Sphere: the court is the name (Tang, not Huaxia). */
		const asCourt = scope === 'sphere' && standing && l.dynasty;
		const base = {
			...l,
			han: asCourt ? '' : l.han,
			en: asCourt ? standing.en : l.en,
			ko: asCourt ? standing.ko : l.ko,
			native: scope === 'sphere' ? undefined : l.native,
			color: l.region ? REGION_COLOR[l.region] : undefined,
			standing: asCourt ? null : standing,
			ruler: rulers && l.region && l.nation ? realmRuler(l.nation, year) : null,
			myth: MYTH_LABELS.some((m) => m.id === l.id),
			lines: [] as CosmosLine[]
		};
		if (l.tag && scope === 'sphere') {
			/** People lines keep the tribe name; only the pin rides the tagged polity. */
			if (l.people) {
				const hit = d ? taggedAt(d, year, l.tag)[0] : null;
				const xy = hit?.at ?? (l.at ? cosmosProject(...l.at) : null);
				return xy ? [{ ...base, key: l.id, xy }] : [];
			}
			return d
				? taggedAt(d, year, l.tag).map((t, i) => ({
						...base,
						key: `${l.id}-${i}`,
						han: t.name.h ?? l.han,
						en: t.name.en,
						ko: t.name.ko,
						xy: t.at
					}))
				: l.at
					? [{ ...base, key: l.id, xy: cosmosProject(...l.at) }]
					: [];
		}
		if (l.tag && scope !== 'sphere') {
			/** World/cosmos: a tagged civilization (Tibet) stands once at its heart, not on every polity. */
			if (!l.at && !l.spot) {
				const hit = d ? taggedAt(d, year, l.tag)[0] : null;
				if (hit) return [{ ...base, key: l.id, xy: hit.at }];
			}
		}
		if (l.spot) return [{ ...base, key: l.id, xy: spots[l.spot] }];
		if (!l.at) return [];
		return [{ ...base, key: l.id, xy: cosmosProject(...l.at) }];
	});
	const hosts = new Map(placed.map((p) => [p.id, p]));
	const kept = placed.filter((p) => {
		const src = [...COSMOS_LABELS, ...MYTH_LABELS].find((l) => l.id === p.id || p.key.startsWith(`${l.id}-`));
		const host = src?.host ? hosts.get(src.host) : undefined;
		if (!host || !src?.protectorate) return true;
		if (Math.hypot(p.xy[0] - host.xy[0], p.xy[1] - host.xy[1]) < 1600) {
			host.lines.push({ key: p.key, han: p.han, ko: p.ko, en: p.en, protectorate: true });
			return false;
		}
		return true;
	});
	if (scope !== 'cosmos') return kept;
	/** Each hell, on the mirror of its living civilization. Its judge is its ruler. */
	const hells: CosmosShown[] = TEN_HELLS.map((h) => ({
		key: h.id,
		id: h.id,
		han: '',
		ko: h.hell.ko,
		en: h.hell.en,
		icon: h.icon,
		xy: hellAt(h),
		color: h.color,
		myth: true,
		standing: null,
		ruler: rulers ? { en: h.judge.en, ko: h.judge.ko } : null,
		lines: []
	}));
	return [...kept, ...hells];
}

/* —————————————— painting —————————————— */

const F = COSMOS_FRAME;

function canvas(w: number, h: number): HTMLCanvasElement {
	const c = document.createElement('canvas');
	c.width = w;
	c.height = h;
	return c;
}

const paths = new Map<string, Path2D>();
const rings = new Map<CosmosClip['ring'], Path2D>();
const outsides = new Map<CosmosClip['ring'], Path2D>();
let pathsVer = '';
/** Every cached path is in fish-eyed sheet units: drop them all when the fish-eye changes. */
function freshPaths() {
	const v = projectionVer();
	if (v === pathsVer) return;
	pathsVer = v;
	paths.clear();
	rings.clear();
	outsides.clear();
}

/** A flat sheet path (the bake, the Samhan sites) as a Path2D under the live fish-eye. */
const path2d = (d: string) => {
	freshPaths();
	let p = paths.get(d);
	if (!p) {
		p = new Path2D(fishPathData(d));
		paths.set(d, p);
	}
	return p;
};

/** How strongly a protectorate washes, against its court's own land. */
const REACH_WASH = 0.32;

const clipOf = (n: Name, year: number): CosmosClip | undefined =>
	clipsFor(year).find((c) => (c.name ? c.name.test(n.en) : c.region === regionOf(n.r)));

/** A clip ring as a closed sheet path. */
function ringPath(ring: CosmosClip['ring']): Path2D {
	freshPaths();
	let p = rings.get(ring);
	if (!p) {
		p = new Path2D();
		sheetRing(ring).forEach(([x, y], i) => (i ? p!.lineTo(x, y) : p!.moveTo(x, y)));
		p.closePath();
		rings.set(ring, p);
	}
	return p;
}

/** Everything but a ring: the frame with the ring cut out (fill or clip even-odd). */
function outsidePath(ring: CosmosClip['ring']): Path2D {
	freshPaths();
	let p = outsides.get(ring);
	if (!p) {
		p = new Path2D();
		p.rect(F.x - 50, F.y - 50, F.w + 100, F.h + 100);
		p.addPath(ringPath(ring));
		outsides.set(ring, p);
	}
	return p;
}

/** A protectorate: diagonal hatching and a dashed edge, past `ring` when set. */
function hatch(ctx: CanvasRenderingContext2D, p: Path2D, color: string, ring?: CosmosClip['ring']) {
	const SPACE = 46;
	ctx.save();
	ctx.clip(p);
	if (ring) ctx.clip(outsidePath(ring), 'evenodd');
	ctx.globalAlpha = 0.5;
	ctx.strokeStyle = color;
	ctx.lineWidth = 5;
	ctx.beginPath();
	for (let x = F.x - F.h; x < F.x + F.w; x += SPACE) {
		ctx.moveTo(x, F.y + F.h);
		ctx.lineTo(x + F.h, F.y);
	}
	ctx.stroke();
	ctx.globalAlpha = 0.85;
	ctx.lineWidth = 4;
	ctx.setLineDash([18, 12]);
	ctx.stroke(p);
	if (ring) ctx.stroke(ringPath(ring));
	ctx.restore();
}

/** Sheet units → canvas pixels at `k` px per unit. */
const toSheet = (ctx: CanvasRenderingContext2D, k: number) => ctx.setTransform(k, 0, 0, k, -F.x * k, -F.y * k);

/** A small seeded random, so the grain and petals land in the same places on every paint. */
function seeded(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return s / 4294967296;
	};
}

const lands = new Map<string, HTMLCanvasElement>();
/** Bump when WATER_CUTS / LAND_ADDS change so HMR does not keep a punched Atlantic. */
const LAND_MASK_VER = 11;
/** Sheet units the western land's edge is widened by, so no sliver of sea survives along the old coast. */
const WEST_SEAM = 70;
/** The land, white on transparent, per canvas width, under the live fish-eye. */
function landMask(d: CosmosData, w: number, h: number): HTMLCanvasElement {
	const key = `${LAND_MASK_VER}|${projectionVer()}|${w}|${d.land.length}`;
	let m = lands.get(key);
	if (m) return m;
	m = canvas(w, h);
	const ctx = m.getContext('2d')!;
	toSheet(ctx, w / F.w);
	ctx.fillStyle = '#fff';
	fillLand(ctx, d);
	lands.set(key, m);
	return m;
}

/** Baked land + the mythic additions − the cuts, in the context's current fill style and transform. */
function fillLand(ctx: CanvasRenderingContext2D, d: CosmosData) {
	ctx.fill(path2d(d.land));
	for (const ring of LAND_ADDS) ctx.fill(ringPath(ring));
	ctx.save();
	ctx.strokeStyle = ctx.fillStyle;
	ctx.lineJoin = 'round';
	ctx.lineWidth = WEST_SEAM;
	ctx.stroke(ringPath(WEST_LANDS));
	ctx.restore();
	ctx.globalCompositeOperation = 'destination-out';
	for (const ring of WATER_CUTS) ctx.fill(ringPath(ring));
	ctx.globalCompositeOperation = 'source-over';
}

function discPath(d: Disc): Path2D {
	const p = new Path2D();
	p.arc(d.x, d.y, d.r, 0, Math.PI * 2);
	return p;
}

/** West half of a disc, closed along the north–south diameter. */
function westHalf(d: Disc): Path2D {
	const p = new Path2D();
	p.arc(d.x, d.y, d.r, -Math.PI / 2, Math.PI / 2, true);
	p.closePath();
	return p;
}

/** East half: the living side of the halves layout, so a living wash does not paint 저승. */
function eastHalf(d: Disc): Path2D {
	const p = new Path2D();
	p.arc(d.x, d.y, d.r, -Math.PI / 2, Math.PI / 2, false);
	p.closePath();
	return p;
}

/* —————————————— civilization spheres —————————————— */

/** Sheet units per pixel of the sphere raster. Coarser when the living disc is huge. */
const SPHERE_RES = 10;

/** Living disc's square — recomputed so HMR / disc edits do not keep a stale raster. */
function sphereBox() {
	const x = LIVING_DISC.x - LIVING_DISC.r;
	const y = LIVING_DISC.y - LIVING_DISC.r;
	const n = Math.ceil((2 * LIVING_DISC.r) / SPHERE_RES);
	return { x, y, n, size: n * SPHERE_RES };
}

/** Living washes, Southern Seas water, the hells they mirror into, and the land's silhouette. */
type Spheres = {
	/** China and Japan: firm edges. */
	wash: HTMLCanvasElement;
	/** Everyone else: the farther, the fuzzier. */
	fuzzy: HTMLCanvasElement;
	/** Spheres washed again over the terrain (`over`). */
	over: HTMLCanvasElement;
	sea: HTMLCanvasElement;
	hells: HTMLCanvasElement;
	land: HTMLCanvasElement;
	/** The line round all ten peoples' lands (gold), and the same line for the Ten Hells (copper). */
	peoples: HTMLCanvasElement;
	/** Near Lands only — gold on the world frame. */
	near: HTMLCanvasElement;
	ten: HTMLCanvasElement;
	/** Land length + disc geometry — busts when the fold window or disc moves. */
	stamp: string;
};
let spheres: Spheres | null = null;

const sphereStamp = (d: CosmosData) =>
	`${d.land.length}|${LIVING_DISC.x},${LIVING_DISC.y},${LIVING_DISC.r}|${projectionVer()}|${LAND_MASK_VER}`;

/** Rings filled in sheet units on the sphere raster, read back as a 0/1 mask. */
function rasterMask(fill: (c: CanvasRenderingContext2D) => void): Uint8Array {
	const sb = sphereBox();
	const c = canvas(sb.n, sb.n);
	const ctx = c.getContext('2d', { willReadFrequently: true })!;
	ctx.setTransform(1 / SPHERE_RES, 0, 0, 1 / SPHERE_RES, -sb.x / SPHERE_RES, -sb.y / SPHERE_RES);
	ctx.fillStyle = '#fff';
	fill(ctx);
	const px = ctx.getImageData(0, 0, sb.n, sb.n).data;
	const out = new Uint8Array(sb.n * sb.n);
	for (let i = 0; i < out.length; i++) out[i] = px[i * 4 + 3] >= 128 ? 1 : 0;
	return out;
}

/** Sheet units per degree at a ring's middle. The fold stretches the east, so reach is measured locally. */
function unitsPerDegree(ring: CosmosClip['ring']): number {
	const lon = ring.reduce((s, p) => s + p[0], 0) / ring.length;
	const lat = ring.reduce((s, p) => s + p[1], 0) / ring.length;
	const [x, y] = cosmosProject(lon, lat);
	const [ex, ey] = cosmosProject(lon + 1, lat);
	const [nx, ny] = cosmosProject(lon, lat + 1);
	return (Math.hypot(ex - x, ey - y) + Math.hypot(nx - x, ny - y)) / 2;
}

const rgbOf = (hex: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];

/** An owner raster as a canvas: each owner index painted in its colour, `null` left clear. */
function ownerCanvas(owner: Int16Array, colors: ([number, number, number] | null)[]): HTMLCanvasElement {
	const sb = sphereBox();
	const c = canvas(sb.n, sb.n);
	const ctx = c.getContext('2d')!;
	const img = ctx.createImageData(sb.n, sb.n);
	const px = img.data;
	for (let i = 0; i < owner.length; i++) {
		const rgb = owner[i] >= 0 ? colors[owner[i]] : null;
		if (!rgb) continue;
		px[i * 4] = rgb[0];
		px[i * 4 + 1] = rgb[1];
		px[i * 4 + 2] = rgb[2];
		px[i * 4 + 3] = 255;
	}
	ctx.putImageData(img, 0, 0);
	return c;
}

/**
 * Every known land pixel goes to the nearest civilization core within that core's reach,
 * so neighbours meet and nothing is left between them. Earlier spheres win ties. The
 * unknown lands stay unclaimed; Namyang alone also owns the water inside its core.
 */
function sphereRasters(d: CosmosData): Spheres {
	const stamp = sphereStamp(d);
	if (spheres?.stamp === stamp) return spheres;
	const sb = sphereBox();
	const n = sb.n * sb.n;
	const land = rasterMask((c) => fillLand(c, d));
	const unknown = rasterMask((c) => {
		for (const ring of UNKNOWN_LANDS) c.fill(ringPath(ring));
	});
	const best = new Float32Array(n).fill(Infinity);
	const owner = new Int16Array(n).fill(-1);
	const seaOwner = new Int16Array(n).fill(-1);
	CIV_SPHERES.forEach((s, k) => {
		const core = rasterMask((c) => c.fill(ringPath(s.core)));
		const seed = new Uint8Array(n);
		for (let i = 0; i < n; i++) seed[i] = core[i] && (land[i] || s.sea) ? 1 : 0;
		const dist = distanceField(seed, sb.n, sb.n);
		const cap = (s.reach * unitsPerDegree(s.core)) / SPHERE_RES;
		for (let i = 0; i < n; i++) {
			if (dist[i] > cap) continue;
			if (land[i]) {
				if (!unknown[i] && dist[i] < best[i]) {
					best[i] = dist[i];
					owner[i] = k;
				}
			} else if (s.sea && core[i] && seaOwner[i] < 0) seaOwner[i] = k;
		}
	});
	const courts = new Map(TEN_HELLS.map((h) => [h.sphere, h.color]));
	const shore = new Int16Array(n).fill(-1);
	for (let i = 0; i < n; i++) if (land[i]) shore[i] = 0;
	const claimed = new Uint8Array(n);
	for (let i = 0; i < n; i++) claimed[i] = owner[i] >= 0 || seaOwner[i] >= 0 ? 1 : 0;
	const nearClaimed = new Uint8Array(n);
	CIV_SPHERES.forEach((s, k) => {
		if (!NEAR_IDS.has(s.id)) return;
		for (let i = 0; i < n; i++) if (owner[i] === k || (s.sea && seaOwner[i] === k)) nearClaimed[i] = 1;
	});
	const border = envelopeLine(claimed, sb.n, PEOPLES_GAP / SPHERE_RES);
	const nearBorder = envelopeLine(nearClaimed, sb.n, NEAR_GAP / SPHERE_RES);
	spheres = {
		stamp,
		wash: ownerCanvas(owner, CIV_SPHERES.map((s) => (s.quiet || !CRISP.has(s.region) ? null : rgbOf(REGION_COLOR[s.region])))),
		fuzzy: ownerCanvas(owner, CIV_SPHERES.map((s) => (s.quiet || CRISP.has(s.region) ? null : rgbOf(REGION_COLOR[s.region])))),
		over: ownerCanvas(owner, CIV_SPHERES.map((s) => (s.over ? rgbOf(REGION_COLOR[s.region]) : null))),
		sea: ownerCanvas(seaOwner, CIV_SPHERES.map((s) => (s.sea ? rgbOf(REGION_COLOR[s.region]) : null))),
		hells: ownerCanvas(owner, CIV_SPHERES.map((s) => (courts.has(s.id) ? rgbOf(courts.get(s.id)!) : null))),
		land: ownerCanvas(shore, [rgbOf('#2c2433')]),
		peoples: alphaCanvas(border, sb.n, [242, 200, 92]),
		near: alphaCanvas(nearBorder, sb.n, [242, 200, 92]),
		ten: alphaCanvas(border, sb.n, [214, 96, 60])
	};
	return spheres;
}

/** How far the Ten Peoples' line stands off their lands, before bays are closed (sheet units). */
const PEOPLES_GAP = 280;
/** Near Lands ring — tighter than the ten. */
const NEAR_GAP = 160;
/** Sphere ids that are Near Lands (옆나라). */
const NEAR_IDS = new Set(['samhan', 'japan-wa', 'hwa', 'northern-nomads']);

/**
 * A soft line round everything `seed` covers: grown by `gap` pixels so straits and
 * islands join, holes filled, then shrunk back by half so the bays close. Returns
 * each pixel's line alpha (a thin core plus an outward glow).
 */
function envelopeLine(seed: Uint8Array, n: number, gap: number): Float32Array {
	const grown = distanceField(seed, n, n);
	const outside = new Uint8Array(n * n);
	const stack: number[] = [];
	const visit = (i: number) => {
		if (!outside[i] && grown[i] > gap) {
			outside[i] = 1;
			stack.push(i);
		}
	};
	for (let i = 0; i < n; i++) {
		visit(i);
		visit((n - 1) * n + i);
		visit(i * n);
		visit(i * n + n - 1);
	}
	while (stack.length) {
		const i = stack.pop()!;
		const x = i % n;
		if (x > 0) visit(i - 1);
		if (x < n - 1) visit(i + 1);
		if (i >= n) visit(i - n);
		if (i < n * (n - 1)) visit(i + n);
	}
	const depth = distanceField(outside, n, n);
	const at = gap / 2;
	const alpha = new Float32Array(n * n);
	for (let i = 0; i < alpha.length; i++) {
		const u = depth[i] - at;
		const core = Math.min(1, Math.max(0, 1.4 - Math.abs(u)));
		const halo = u < 0 ? 0.32 * Math.exp(-((u / (gap * 0.22)) ** 2)) : 0.14 * Math.exp(-((u / 3) ** 2));
		alpha[i] = Math.max(core, halo);
	}
	return alpha;
}

/** An alpha raster in one colour. */
function alphaCanvas(alpha: Float32Array, n: number, [r, g, b]: [number, number, number]): HTMLCanvasElement {
	const c = canvas(n, n);
	const ctx = c.getContext('2d')!;
	const img = ctx.createImageData(n, n);
	const px = img.data;
	for (let i = 0; i < alpha.length; i++) {
		if (alpha[i] < 0.004) continue;
		px[i * 4] = r;
		px[i * 4 + 1] = g;
		px[i * 4 + 2] = b;
		px[i * 4 + 3] = alpha[i] * 255;
	}
	ctx.putImageData(img, 0, 0);
	return c;
}

/** Civilizations whose edge Samhan knew exactly: China, Japan (and Samhan itself, drawn in state colours). */
const CRISP: ReadonlySet<CosmosRegion> = new Set(['samhan', 'hwa', 'wa']);

/** A sphere raster laid on a context already in sheet units, softened by `blur` canvas pixels. */
function drawSpheres(ctx: CanvasRenderingContext2D, img: HTMLCanvasElement, alpha: number, blur: number) {
	const sb = sphereBox();
	ctx.save();
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = 'high';
	ctx.filter = blur > 0 ? `blur(${blur}px)` : 'none';
	ctx.globalAlpha = alpha;
	ctx.drawImage(img, sb.x, sb.y, sb.size, sb.size);
	ctx.restore();
}

/* —————————————— terrain —————————————— */

/** A four-point sparkle. */
function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
	ctx.beginPath();
	ctx.moveTo(x, y - r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.quadraticCurveTo(x, y, x, y + r);
	ctx.quadraticCurveTo(x, y, x - r, y);
	ctx.quadraticCurveTo(x, y, x, y - r);
	ctx.fill();
}

/** A game-board terrain: a flat base, piled shapes lit from above, a crisp edge, optional sparkles. */
type Terrain = {
	rings: CosmosClip['ring'][];
	seed: number;
	base: string;
	/** Lit top, middle and underside of each pile. */
	lit: [string, string, string];
	shadow: string;
	edge: string;
	shape: 'drift' | 'dune' | 'canopy';
	/** Piles per sheet unit² of the ring's box. */
	density: number;
	sparkle?: boolean;
	/** Feather the ring's edge this far (sheet units) instead of stroking it, so neighbours bleed. */
	soft?: number;
};

const TERRAINS: Terrain[] = [
	{
		rings: SNOW_LANDS,
		seed: 41,
		base: '#f2f8ff',
		lit: ['#ffffff', '#f1f7fe', '#c2daf2'],
		shadow: 'rgba(120,160,205,0.35)',
		edge: '#8db6e2',
		shape: 'drift',
		density: 1 / 9000,
		sparkle: true
	},
	{
		rings: DESERT_LANDS,
		seed: 53,
		base: '#ecc983',
		lit: ['#fbe7b4', '#efcc86', '#c99a52'],
		shadow: 'rgba(150,100,40,0.35)',
		edge: '#c2914a',
		shape: 'dune',
		density: 1 / 6000,
		soft: 120
	},
	{
		rings: JUNGLE_LANDS,
		seed: 67,
		base: '#3f8a3c',
		lit: ['#86c95a', '#4f9c40', '#2a6a2c'],
		shadow: 'rgba(16,50,20,0.45)',
		edge: '#25592a',
		shape: 'canopy',
		density: 1 / 3600,
		soft: 120
	}
];

/** One pile: a snow drift, a crescent dune, or a cluster of three tree crowns. */
function pile(s: CanvasRenderingContext2D, t: Terrain, x: number, y: number, r: number) {
	const blob = (cx: number, cy: number, rx: number, ry: number) => {
		const g = s.createLinearGradient(cx, cy - ry, cx, cy + ry);
		g.addColorStop(0, t.lit[0]);
		g.addColorStop(0.5, t.lit[1]);
		g.addColorStop(1, t.lit[2]);
		s.fillStyle = g;
		s.beginPath();
		s.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
		s.fill();
	};
	s.fillStyle = t.shadow;
	s.beginPath();
	s.ellipse(x + (t.shape === 'dune' ? r * 0.35 : 0), y + r * 0.32, r * 1.4, r * 0.8, 0, 0, Math.PI * 2);
	s.fill();
	if (t.shape === 'drift') blob(x, y, r * 1.35, r * 0.82);
	else if (t.shape === 'dune') {
		blob(x, y, r * 1.7, r * 0.5);
		s.strokeStyle = t.lit[0];
		s.lineWidth = Math.max(1.5, r * 0.12);
		s.beginPath();
		s.ellipse(x, y + r * 0.1, r * 1.5, r * 0.42, 0, Math.PI * 1.08, Math.PI * 1.92);
		s.stroke();
	} else {
		blob(x - r * 0.55, y + r * 0.1, r * 0.7, r * 0.66);
		blob(x + r * 0.55, y + r * 0.12, r * 0.7, r * 0.64);
		blob(x, y - r * 0.25, r * 0.78, r * 0.72);
	}
}

/** The terrains, painted as a game board draws them and masked to the land. */
function paintTerrain(ctx: CanvasRenderingContext2D, mask: HTMLCanvasElement, w: number, h: number, k: number) {
	const layer = canvas(w, h);
	const ls = layer.getContext('2d')!;
	toSheet(ls, k);
	const probe = canvas(1, 1).getContext('2d')!;
	ls.lineJoin = 'round';
	ls.lineCap = 'round';
	for (const t of TERRAINS) {
		const rand = seeded(t.seed);
		const flakes: [number, number, number][] = [];
		const own = t.soft ? canvas(w, h) : layer;
		const s = own.getContext('2d')!;
		if (t.soft) {
			toSheet(s, k);
			s.lineJoin = 'round';
			s.lineCap = 'round';
		}
		for (const ring of t.rings) {
			const p = ringPath(ring);
			const pts = sheetRing(ring);
			const xs = pts.map((q) => q[0]);
			const ys = pts.map((q) => q[1]);
			const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
			const area = (x1 - x0) * (y1 - y0);
			const big = Math.min(26, Math.sqrt(area) / 28);
			s.fillStyle = t.base;
			s.fill(p);
			if (t.soft) {
				s.strokeStyle = t.base;
				s.lineWidth = t.soft * 2;
				s.stroke(p);
			}
			const piles: [number, number, number][] = [];
			for (let i = 0, tries = Math.min(2400, Math.round(area * t.density)); i < tries; i++) {
				const x = x0 + rand() * (x1 - x0);
				const y = y0 + rand() * (y1 - y0);
				if (!probe.isPointInPath(p, x, y)) continue;
				piles.push([x, y, big * (0.3 + rand() * 0.7)]);
				if (t.sparkle && rand() < 0.22) flakes.push([x + (rand() - 0.5) * big, y - big * 0.4, big * (0.12 + rand() * 0.14)]);
			}
			piles.sort((a, b) => a[1] - b[1]);
			for (const [x, y, r] of piles) pile(s, t, x, y, r);
			if (t.soft) continue;
			s.save();
			s.globalAlpha = 0.35;
			s.strokeStyle = t.edge;
			s.lineWidth = Math.max(2, big * 0.14);
			s.stroke(p);
			s.restore();
		}
		s.fillStyle = '#ffffff';
		for (const [x, y, r] of flakes) sparkle(s, x, y, r);
		if (!t.soft) continue;
		const feather = canvas(w, h);
		const f = feather.getContext('2d')!;
		toSheet(f, k);
		f.filter = `blur(${Math.max(2, Math.round(k * t.soft))}px)`;
		f.fillStyle = '#fff';
		for (const ring of t.rings) f.fill(ringPath(ring));
		s.setTransform(1, 0, 0, 1, 0, 0);
		s.globalCompositeOperation = 'destination-in';
		s.drawImage(feather, 0, 0);
		ls.setTransform(1, 0, 0, 1, 0, 0);
		ls.drawImage(own, 0, 0);
		toSheet(ls, k);
	}
	ls.setTransform(1, 0, 0, 1, 0, 0);
	ls.globalCompositeOperation = 'destination-in';
	ls.drawImage(mask, 0, 0);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.save();
	ctx.globalAlpha = 0.5;
	ctx.drawImage(layer, 0, 0);
	ctx.restore();
}

/** One animated speck over a biome: falling snow, drifting sand, a firefly in the jungle. */
export type BiomeMote = { key: string; kind: 'snow' | 'sand' | 'leaf'; xy: [number, number]; delay: number; dur: number };

const inRing = (ring: CosmosClip['ring'], lon: number, lat: number) => {
	let inside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const [xi, yi] = ring[i];
		const [xj, yj] = ring[j];
		if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
};

let motes: BiomeMote[] | null = null;

/** Seeded specks inside each biome ring (and inside 이승), sampled in lon/lat so they stay on land. */
export function biomeMotes(): BiomeMote[] {
	if (motes) return motes;
	const plan: { kind: BiomeMote['kind']; rings: CosmosClip['ring'][]; n: number; box: [number, number, number, number]; ok?: (lon: number, lat: number) => boolean }[] = [
		{ kind: 'snow', rings: SNOW_LANDS, n: 40, box: [-40, 170, 55, 80] },
		{ kind: 'sand', rings: DESERT_LANDS, n: 22, box: [-40, 60, 11, 34] },
		{ kind: 'leaf', rings: JUNGLE_LANDS, n: 22, box: [-40, 52, -34, 14], ok: (lon) => lon < 40 }
	];
	const rand = seeded(83);
	const out: BiomeMote[] = [];
	for (const p of plan) {
		let made = 0;
		for (let tries = 0; made < p.n && tries < p.n * 40; tries++) {
			const lon = p.box[0] + rand() * (p.box[1] - p.box[0]);
			const lat = p.box[2] + rand() * (p.box[3] - p.box[2]);
			if (!p.rings.some((r) => inRing(r, lon, lat)) || (p.ok && !p.ok(lon, lat))) continue;
			const xy = cosmosProject(lon, lat);
			if (Math.hypot(xy[0] - LIVING_DISC.x, xy[1] - LIVING_DISC.y) > LIVING_DISC.r * 0.86) continue;
			out.push({ key: `${p.kind}-${made}`, kind: p.kind, xy, delay: rand() * 6, dur: 3.5 + rand() * 3.5 });
			made++;
		}
	}
	return (motes = out);
}

function petal(ctx: CanvasRenderingContext2D, at: [number, number], light: boolean, rx = 340, ry = 220) {
	const rand = seeded(17);
	const [cx, cy] = at;
	const colors = ['#e8a0b4', '#f4e6c8', '#c9b3e6', '#f2c14e', '#e86f6f'];
	for (let i = 0; i < 220; i++) {
		const a = rand() * Math.PI * 2;
		const r = Math.sqrt(rand());
		ctx.globalAlpha = (light ? 0.75 : 0.6) * (0.4 + rand() * 0.6);
		ctx.fillStyle = colors[i % colors.length];
		ctx.beginPath();
		ctx.ellipse(cx + Math.cos(a) * r * rx, cy + Math.sin(a) * r * ry, 6 * (0.5 + rand()), 4 * (0.4 + rand()), rand() * Math.PI, 0, Math.PI * 2);
		ctx.fill();
	}
}

function lamps(ctx: CanvasRenderingContext2D, at: [number, number], n: number, rx: number, ry: number) {
	const rand = seeded(29);
	const [cx, cy] = at;
	for (let i = 0; i < n; i++) {
		const a = rand() * Math.PI * 2;
		const r = Math.sqrt(rand());
		ctx.globalAlpha = 0.45 + rand() * 0.5;
		ctx.fillStyle = rand() > 0.3 ? '#f2c14e' : '#ffd98a';
		ctx.beginPath();
		ctx.arc(cx + Math.cos(a) * r * rx, cy + Math.sin(a) * r * ry, 2.2 + rand() * 2.4, 0, Math.PI * 2);
		ctx.fill();
	}
}

function glowAt(ctx: CanvasRenderingContext2D, at: [number, number], color: string, r: number, alpha: number) {
	const [x, y] = at;
	const g = ctx.createRadialGradient(x, y, 0, x, y, r);
	g.addColorStop(0, color);
	g.addColorStop(1, 'transparent');
	ctx.globalAlpha = alpha;
	ctx.fillStyle = g;
	ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

/**
 * The four waters that hem the flower fields: three bows on the living lip,
 * one Samdo bow on the dead lip. Each follows the vesica, not a slash across it.
 * A blurred black band pads them first: crossing one is leaving a realm.
 * All of it fades out toward the lens tips: the waters are only there near the crossroads.
 */
function paintFieldRivers(target: CanvasRenderingContext2D, k: number) {
	const layer = canvas(target.canvas.width, target.canvas.height);
	const ctx = layer.getContext('2d')!;
	ctx.setTransform(target.getTransform());
	paintFieldWaters(ctx, k);
	const { north, south } = lensTips();
	const span = south[1] - north[1];
	const mid = Math.min(0.8, Math.max(0.2, (crossroads()[1] - north[1]) / span));
	const g = ctx.createLinearGradient(0, north[1], 0, south[1]);
	g.addColorStop(0, 'rgba(0,0,0,0)');
	g.addColorStop(Math.max(0, mid - 0.38), 'rgba(0,0,0,0)');
	g.addColorStop(mid - 0.1, 'rgba(0,0,0,1)');
	g.addColorStop(mid + 0.1, 'rgba(0,0,0,1)');
	g.addColorStop(Math.min(1, mid + 0.38), 'rgba(0,0,0,0)');
	g.addColorStop(1, 'rgba(0,0,0,0)');
	ctx.globalCompositeOperation = 'destination-in';
	ctx.globalAlpha = 1;
	ctx.fillStyle = g;
	ctx.fillRect(F.x - 50, F.y - 50, F.w + 100, F.h + 100);
	target.save();
	target.setTransform(1, 0, 0, 1, 0, 0);
	target.drawImage(layer, 0, 0);
	target.restore();
}

function paintFieldWaters(ctx: CanvasRenderingContext2D, k: number) {
	const ink: Record<string, { bed: string; core: string; width: number }> = {
		baek: { bed: '#8ea4b8', core: '#f7fbff', width: 38 },
		hwang: { bed: '#8a6a28', core: '#f2c14e', width: 38 },
		jeok: { bed: '#7a2430', core: '#e25b5b', width: 38 },
		samdo: { bed: '#10283c', core: '#9fd4f0', width: 48 }
	};
	ctx.save();
	ctx.lineCap = 'round';
	for (const river of fieldRivers()) {
		const home = river.id === 'samdo' ? DEAD_DISC : LIVING_DISC;
		const lens = river.id === 'samdo' ? LIVING_DISC : DEAD_DISC;
		const outside = new Path2D();
		outside.rect(F.x - 50, F.y - 50, F.w + 100, F.h + 100);
		outside.addPath(discPath(lens));
		ctx.save();
		ctx.clip(discPath(home));
		ctx.clip(outside, 'evenodd');
		ctx.filter = `blur(${Math.max(4, Math.round(k * 140))}px)`;
		ctx.beginPath();
		ctx.arc(river.disc.x, river.disc.y, river.r, river.a0, river.a1, river.ccw);
		ctx.strokeStyle = '#000';
		ctx.globalAlpha = 0.72;
		ctx.lineWidth = ink[river.id].width * 12;
		ctx.stroke();
		ctx.restore();
	}
	for (const river of fieldRivers()) {
		const look = ink[river.id];
		ctx.save();
		ctx.clip(discPath(river.id === 'samdo' ? DEAD_DISC : LIVING_DISC));
		ctx.beginPath();
		ctx.arc(river.disc.x, river.disc.y, river.r, river.a0, river.a1, river.ccw);
		ctx.strokeStyle = look.bed;
		ctx.globalAlpha = 0.92;
		ctx.lineWidth = look.width;
		ctx.stroke();
		ctx.strokeStyle = look.core;
		ctx.globalAlpha = 0.96;
		ctx.lineWidth = look.width * 0.42;
		ctx.stroke();
		ctx.restore();
	}
	const samdo = fieldRivers().find((r) => r.id === 'samdo')!;
	const dir = samdo.ccw ? -1 : 1;
	const span = dir * (samdo.a1 - samdo.a0);
	ctx.clip(discPath(DEAD_DISC));
	for (const [t, fill] of [
		[0.32, '#f4efe4'],
		[0.5, '#d7ecff'],
		[0.68, '#1a3c58']
	] as const) {
		const a = samdo.a0 + dir * span * t;
		ctx.globalAlpha = 0.95;
		ctx.fillStyle = fill;
		ctx.beginPath();
		ctx.arc(samdo.disc.x + Math.cos(a) * samdo.r, samdo.disc.y + Math.sin(a) * samdo.r, 11, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

/**
 * 저승 is the living world in a mirror (the same transform as `flipToDead`): the same
 * coasts in the dark, each civilization's sphere become its hell, 중원 its own court.
 */
function paintHells(ctx: CanvasRenderingContext2D, sp: Spheres, k: number) {
	const s = DEAD_DISC.r / LIVING_DISC.r;
	ctx.save();
	ctx.clip(discPath(DEAD_DISC));
	ctx.transform(-s, 0, 0, s, DEAD_DISC.x + LIVING_DISC.x * s, DEAD_DISC.y - LIVING_DISC.y * s);
	drawSpheres(ctx, sp.land, 0.92, 0);
	/** The tundra's mirror is 극락 (Bliss), the forest's 지옥 (Pain), the desert's 명부 (the Gateway). */
	ctx.save();
	ctx.filter = `blur(${Math.max(4, Math.round(k * 90))}px)`;
	for (const [rings, color, alpha] of [
		[SNOW_LANDS, '#9a8a62', 0.34],
		[[AFRICA_LANDS], '#8c1c12', 0.62],
		[DESERT_LANDS, '#5e4a72', 0.5]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.fillStyle = color;
		for (const ring of rings) ctx.fill(ringPath(ring));
	}
	ctx.restore();
	drawSpheres(ctx, sp.hells, 0.5, Math.max(2, Math.round(k * SPHERE_RES * 1.6)));
	drawSpheres(ctx, sp.ten, 0.95, 0);
	ctx.restore();
}

/** The gold line round the Ten Peoples, on 이승 — cosmos only. */
function paintPeoples(ctx: CanvasRenderingContext2D, sp: Spheres) {
	ctx.save();
	ctx.clip(discPath(LIVING_DISC));
	drawSpheres(ctx, sp.peoples, 0.95, 0);
	ctx.restore();
}

/** The gold line round the Near Lands — world frame. */
function paintNear(ctx: CanvasRenderingContext2D, sp: Spheres) {
	ctx.save();
	ctx.clip(discPath(LIVING_DISC));
	drawSpheres(ctx, sp.near, 0.95, 0);
	ctx.restore();
}

/** Path dots at the Threefold (life) and Seventy-Eight (death) stations. */
function paintPathDots(ctx: CanvasRenderingContext2D, layout: CosmosLayout) {
	const spots = layoutSpots(layout);
	const marks: { at: [number, number]; color: string; n: number }[] = [
		{ at: spots.threefold, color: '#f2c14e', n: 3 },
		{ at: spots.seventyEight, color: '#9fd4f0', n: 7 }
	];
	for (const m of marks) {
		const [cx, cy] = m.at;
		for (let i = 0; i < m.n; i++) {
			const a = -Math.PI / 2 + (i * Math.PI * 2) / m.n;
			const r = 28 + (i % 2) * 10;
			ctx.globalAlpha = 0.9;
			ctx.fillStyle = m.color;
			ctx.beginPath();
			ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 7, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
		ctx.fillStyle = m.color;
		ctx.beginPath();
		ctx.arc(cx, cy, 5, 0, Math.PI * 2);
		ctx.fill();
	}
}

/** 약수삼천리, the Life River: one bright water across the Western Heavens, through the fields. */
function paintRiverOfLife(ctx: CanvasRenderingContext2D) {
	const { y, x0, x1 } = riverOfLife();
	const p = new Path2D();
	const n = 24;
	for (let i = 0; i <= n; i++) {
		const x = x0 + ((x1 - x0) * i) / n;
		const yy = y + Math.sin((i / n) * Math.PI * 3) * 40;
		if (i) p.lineTo(x, yy);
		else p.moveTo(x, yy);
	}
	ctx.save();
	ctx.clip(discPath(LIVING_DISC));
	ctx.clip(discPath(DEAD_DISC));
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	for (const [color, width, alpha] of [
		['#5aa9c8', 70, 0.85],
		['#bff0ff', 30, 0.95],
		['#ffffff', 8, 0.9]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.stroke(p);
	}
	ctx.restore();
}

/**
 * The approach to the Western Heavens: the mythic western land (cosmos.ts WEST_LANDS)
 * is already in the land mask, so here it only brightens into the lens on the living
 * lip and dims into it on the dead lip.
 */
function paintApproach(ctx: CanvasRenderingContext2D, light: boolean) {
	const [x, y] = lensPoint();
	const reach = 1500;
	ctx.save();
	ctx.clip(discPath(LIVING_DISC));
	const lit = ctx.createLinearGradient(x + reach, 0, x, 0);
	lit.addColorStop(0, 'rgba(255,246,222,0)');
	lit.addColorStop(1, light ? 'rgba(255,246,222,0.55)' : 'rgba(250,236,200,0.38)');
	ctx.fillStyle = lit;
	ctx.fillRect(x, y - LIVING_DISC.r, reach, LIVING_DISC.r * 2);
	ctx.restore();
	ctx.save();
	ctx.clip(discPath(DEAD_DISC));
	const dim = ctx.createLinearGradient(x - reach, 0, x, 0);
	dim.addColorStop(0, 'rgba(180,200,230,0)');
	dim.addColorStop(1, 'rgba(180,200,230,0.22)');
	ctx.fillStyle = dim;
	ctx.fillRect(x - reach, y - DEAD_DISC.r, reach, DEAD_DISC.r * 2);
	ctx.restore();
}

/** The lens where the two discs overlap is the Western Heavens; the Flower Fields are a meadow inside it. */
function paintLens(ctx: CanvasRenderingContext2D, light: boolean) {
	const [x, y] = lensPoint();
	const { north, south } = lensTips();
	const half = (south[1] - north[1]) / 2;
	ctx.save();
	ctx.clip(discPath(LIVING_DISC));
	ctx.clip(discPath(DEAD_DISC));
	const sky = ctx.createRadialGradient(x, y, 0, x, y, half);
	sky.addColorStop(0, light ? '#fffaf0' : '#f6efd8');
	sky.addColorStop(0.55, light ? '#e9e2f2' : '#c9c3dc');
	sky.addColorStop(1, light ? '#b9c6dc' : '#7f8aa8');
	ctx.globalAlpha = 0.97;
	ctx.fillStyle = sky;
	ctx.fillRect(x - half, y - half, half * 2, half * 2);
	const m = meadow();
	ctx.save();
	ctx.beginPath();
	ctx.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, Math.PI * 2);
	ctx.clip();
	const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.ry);
	g.addColorStop(0, light ? '#cdeebd' : '#9fdc8e');
	g.addColorStop(0.7, light ? '#7dbe78' : '#4f9c5a');
	g.addColorStop(1, light ? '#5e9c62' : '#2f6f43');
	ctx.globalAlpha = 0.95;
	ctx.fillStyle = g;
	ctx.fillRect(m.x - m.rx, m.y - m.ry, m.rx * 2, m.ry * 2);
	petal(ctx, [m.x, m.y], light, m.rx * 0.9, m.ry * 0.9);
	ctx.restore();
	ctx.restore();
}

/**
 * 저승 fills its disc. The river and the ten hells sit west of the lens.
 * The lens itself is painted afterwards, green, over both discs.
 * Always re-enters sheet space: callers may have left the context in pixel space
 * (the land bridge ends on identity).
 */
function paintWorlds(ctx: CanvasRenderingContext2D, sp: Spheres, k: number, light: boolean, layout: CosmosLayout) {
	toSheet(ctx, k);
	const spots = layoutSpots(layout);
	if (layout === 'halves') {
		ctx.save();
		ctx.clip(discPath(HALF_DISC));
		const seam = HALF_DISC.x;
		const wash = ctx.createLinearGradient(seam - 1100, 0, seam + 520, 0);
		wash.addColorStop(0, light ? '#10182a' : '#05080f');
		wash.addColorStop(0.5, light ? '#1a2740' : '#0b1422');
		wash.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.globalAlpha = 0.9;
		ctx.fillStyle = wash;
		ctx.fill(westHalf(HALF_DISC));
		ctx.restore();
	} else {
		const dead = DEAD_DISC;
		ctx.save();
		ctx.clip(discPath(dead));
		const gr = ctx.createRadialGradient(dead.x, dead.y, dead.r * 0.08, dead.x, dead.y, dead.r);
		gr.addColorStop(0, light ? '#101828' : '#05080f');
		gr.addColorStop(0.62, light ? '#1a2740' : '#0c1624');
		gr.addColorStop(1, light ? '#243048' : '#121820');
		ctx.globalAlpha = 0.97;
		ctx.fillStyle = gr;
		ctx.fill(discPath(dead));
		ctx.restore();
	}
	paintHells(ctx, sp, k);
	glowAt(ctx, spots.springs, light ? '#1a2744' : '#061018', 340, 0.85);
	lamps(ctx, spots.springs, 48, 200, 140);
	ctx.globalAlpha = 1;
}

/** Keeps the active silhouette (one disc, or two semi-attached) and fades its rim. */
function discMask(ctx: CanvasRenderingContext2D, w: number, h: number, discs: Disc[], k: number) {
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	const mask = canvas(w, h);
	const m = mask.getContext('2d')!;
	for (const disc of discs) {
		const cx = (disc.x - F.x) * k;
		const cy = (disc.y - F.y) * k;
		const r = disc.r * k;
		/** Soft rim only in the outer eighth — land stays sharp through most of the disc. */
		const g = m.createRadialGradient(cx, cy, r * 0.88, cx, cy, r);
		g.addColorStop(0, 'rgba(0,0,0,1)');
		g.addColorStop(0.75, 'rgba(0,0,0,1)');
		g.addColorStop(1, 'rgba(0,0,0,0)');
		m.fillStyle = g;
		m.beginPath();
		m.arc(cx, cy, r, 0, Math.PI * 2);
		m.fill();
	}
	ctx.globalCompositeOperation = 'destination-in';
	ctx.globalAlpha = 1;
	ctx.drawImage(mask, 0, 0);
	ctx.globalCompositeOperation = 'source-over';
}

function grain(ctx: CanvasRenderingContext2D, w: number, h: number, light: boolean) {
	const rand = seeded(5);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.globalCompositeOperation = 'source-atop';
	/** Fine flecks, not tiles: the near frames show this canvas at about one pixel per pixel. */
	const n = Math.round((w * h) / 900);
	for (let i = 0; i < n; i++) {
		ctx.globalAlpha = 0.03 + rand() * 0.04;
		ctx.fillStyle = rand() > 0.5 ? (light ? '#fff' : '#3a332a') : light ? '#c8bca8' : '#000';
		const s = 1.5 + rand() * 4;
		ctx.fillRect(rand() * w, rand() * h, s, s * (0.3 + rand() * 0.5));
	}
	ctx.globalCompositeOperation = 'source-over';
	ctx.globalAlpha = 1;
}

const painted = new WeakMap<HTMLCanvasElement, string>();

/** The canvas height for a width, at the frame's aspect. */
export const cosmosHeight = (w: number) => Math.round((w * F.h) / F.w);

/**
 * Paints `year`'s known world onto `sheet` (sized here). Returns false when nothing
 * changed since the last paint (same polities, palette, scope and size).
 *
 * Sphere: a normal political map, Korea-centred, crisp borders, no disc cutoff.
 * World: living disc, Near Lands ring, Samhan one red, civilization washes.
 * Cosmos: both discs, Ten Peoples ring, rivers, hells, path dots.
 */
export function paintCosmos(
	sheet: HTMLCanvasElement,
	d: CosmosData,
	year: number,
	pal: MapPalette,
	light: boolean,
	width = 4096,
	layout: CosmosLayout = 'circles',
	scope: CosmosScope = 'cosmos'
): boolean {
	const w = width;
	const h = cosmosHeight(w);
	const standing = standingAt(d, year);
	const key = `v27|${LAND_MASK_VER}|${projectionVer()}|${w}|${layout}|${scope}|${year}|${LIVING_DISC.x},${LIVING_DISC.y},${LIVING_DISC.r}|${DEAD_DISC.x},${DEAD_DISC.r}|${pal.sea}|${standing.map((r) => r[0]).join(',')}`;
	if (painted.get(sheet) === key) return false;
	painted.set(sheet, key);
	if (sheet.width !== w || sheet.height !== h) {
		sheet.width = w;
		sheet.height = h;
	}
	const k = w / F.w;
	const mask = landMask(d, w, h);
	const ctx = sheet.getContext('2d')!;
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.globalAlpha = 1;
	ctx.globalCompositeOperation = 'source-over';
	ctx.clearRect(0, 0, w, h);
	/** Sea is a clear blue and land a warm sand, so the coast reads before any wash. */
	const sea = light ? '#8eafd4' : '#0a4e72';
	const ground = light ? '#f6f0e2' : '#e4d3b4';
	ctx.fillStyle = sea;
	ctx.fillRect(0, 0, w, h);

	const sp = sphereRasters(d);
	const sphereBlur = Math.max(2, Math.round(k * SPHERE_RES * 1.6));
	const myth = scope === 'cosmos';
	const livingOnly = scope === 'world' || myth;
	const livingClip = (c: CanvasRenderingContext2D) => {
		if (!livingOnly) return;
		c.clip(layout === 'halves' ? eastHalf(HALF_DISC) : discPath(LIVING_DISC));
	};
	/** Sphere: every border is crisp. World/cosmos: far lands stay soft. */
	const crispAll = scope === 'sphere';

	/** Namyang's water — world and cosmos. */
	if (scope !== 'sphere') {
		toSheet(ctx, k);
		ctx.save();
		livingClip(ctx);
		drawSpheres(ctx, sp.sea, light ? 0.24 : 0.3, sphereBlur * 5);
		ctx.restore();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	/** Land: civilization spheres (world/cosmos), then each standing state — cut to the coast. */
	const land = canvas(w, h);
	const lc = land.getContext('2d')!;
	lc.fillStyle = ground;
	lc.fillRect(0, 0, w, h);
	if (scope !== 'sphere') {
		toSheet(lc, k);
		lc.save();
		livingClip(lc);
		drawSpheres(lc, sp.fuzzy, light ? 0.4 : 0.48, sphereBlur * 6);
		drawSpheres(lc, sp.wash, light ? 0.44 : 0.52, Math.max(1, Math.round(sphereBlur * 0.4)));
		lc.restore();
		lc.setTransform(1, 0, 0, 1, 0, 0);
	}
	/** Firm edges at full resolution; the fog is blurred anyway, so a quarter will do. */
	const soft = canvas(w, h);
	const fog = canvas(Math.round(w / 4), Math.round(h / 4));
	for (const [c, ck] of [
		[soft, k],
		[fog, k / 4]
	] as const) {
		const x = c.getContext('2d')!;
		toSheet(x, ck);
		x.lineJoin = 'round';
		x.lineWidth = 4;
	}
	let sc = soft.getContext('2d')!;
	const reach: { p: Path2D; color: string; ring?: CosmosClip['ring'] }[] = [];
	const wash = (p: Path2D, alpha: number, cut?: (c: CanvasRenderingContext2D) => void) => {
		sc.save();
		cut?.(sc);
		sc.globalAlpha = alpha;
		sc.fill(p);
		sc.stroke(p);
		sc.restore();
	};
	for (const r of standing) {
		const n = d.names[r[0]];
		const region = regionOf(n.r);
		const c = REGION_COLOR[region];
		sc = (crispAll || CRISP.has(region) ? soft : fog).getContext('2d')!;
		sc.fillStyle = c;
		sc.strokeStyle = c;
		const p = path2d(d.shapes[r[4]]);
		const clip = clipOf(n, year);
		if (ANSEO_NAME.test(`${n.en}${n.ko ?? ''}`)) continue;
		if (PROTECTORATE_NAME.test(n.en)) {
			if (scope === 'cosmos') continue;
			wash(p, REACH_WASH);
			reach.push({ p, color: c });
		} else if (clip) {
			wash(p, 1, (cx) => cx.clip(ringPath(clip.ring)));
			if (clip.outside === 'protectorate' && scope !== 'cosmos') {
				wash(p, REACH_WASH, (cx) => cx.clip(outsidePath(clip.ring), 'evenodd'));
				reach.push({ p, color: c, ring: clip.ring });
			}
		} else wash(p, 1);
	}
	lc.globalAlpha = pal.wash * (crispAll ? 0.95 : 0.72);
	lc.imageSmoothingQuality = 'high';
	lc.drawImage(soft, 0, 0, w, h);
	if (!crispAll) {
		lc.save();
		lc.filter = `blur(${Math.max(4, Math.round(k * 60))}px)`;
		lc.globalAlpha = pal.wash * 0.6;
		lc.drawImage(fog, 0, 0, w, h);
		lc.restore();
	}
	lc.globalAlpha = 1;
	for (const x of reach) {
		toSheet(lc, k);
		hatch(lc, x.p, x.color, x.ring);
	}
	lc.setTransform(1, 0, 0, 1, 0, 0);
	lc.globalAlpha = 1;
	lc.globalCompositeOperation = 'destination-in';
	lc.drawImage(mask, 0, 0);
	ctx.drawImage(land, 0, 0);

	if (myth) {
		paintTerrain(ctx, mask, w, h, k);
		toSheet(ctx, k);
		ctx.save();
		livingClip(ctx);
		drawSpheres(ctx, sp.over, light ? 0.5 : 0.58, sphereBlur * 3);
		ctx.restore();
	}

	/** Year's own borders on top of the civilization wash, on a layer cut to the coast. */
	const holdings = holdingsAt(year);
	const fillPolities = new Set<string>([...SAMHAN_POLITIES, 'balhae']);
	const oneSamhan = scope === 'world' || myth;
	const edge = canvas(w, h);
	const ec = edge.getContext('2d')!;
	toSheet(ec, k);
	ec.lineJoin = 'round';
	ec.lineCap = 'round';
	ec.globalAlpha = light ? 0.92 : 0.96;
	BORDER_SITES.forEach((site, i) => {
		const hold = holdings[i];
		if (!site.d || !hold.polity || !fillPolities.has(hold.polity)) return;
		const c = oneSamhan ? REGION_COLOR.samhan : siteColor(site, hold, year, true);
		ec.fillStyle = c;
		ec.strokeStyle = c;
		ec.lineWidth = 3.2;
		ec.fill(path2d(site.d));
		ec.stroke(path2d(site.d));
	});
	if (!oneSamhan) {
		const samhanColors = new Set<string>([
			...[...fillPolities].map((id) => mapColor(id as PolityId)),
			...Object.values(GAYA_LEAGUES).map((g) => g.color)
		]);
		const samhanLines = borderLinesAt(year, true);
		ec.lineWidth = 6.5;
		ec.globalAlpha = light ? 0.92 : 0.97;
		for (const b of samhanLines.borders) {
			if (!samhanColors.has(b.color)) continue;
			ec.strokeStyle = b.color;
			ec.stroke(path2d(b.d));
		}
	}
	ec.strokeStyle = pal.ink;
	ec.lineWidth = crispAll ? 2.4 : 1.8;
	ec.globalAlpha = light ? 0.42 : 0.5;
	for (const r of standing) {
		const region = regionOf(d.names[r[0]].r);
		if (ANSEO_NAME.test(`${d.names[r[0]].en}${d.names[r[0]].ko ?? ''}`)) continue;
		if (crispAll || (CRISP.has(region) && !ONE_NAME.has(region))) ec.stroke(path2d(d.shapes[r[4]]));
	}
	/** The sites and the polity shapes run out to sea; only the coast is a border. */
	ec.setTransform(1, 0, 0, 1, 0, 0);
	ec.globalAlpha = 1;
	ec.globalCompositeOperation = 'destination-in';
	ec.drawImage(mask, 0, 0);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.globalAlpha = 1;
	ctx.drawImage(edge, 0, 0);

	if (scope === 'world') paintNear(ctx, sp);
	if (myth) {
		paintPeoples(ctx, sp);
		paintWorlds(ctx, sp, k, light, layout);
		paintApproach(ctx, light);
		paintLens(ctx, light);
		toSheet(ctx, k);
		paintRiverOfLife(ctx);
		paintFieldRivers(ctx, k);
		paintPathDots(ctx, layout);
	}
	grain(ctx, w, h, light);
	if (livingOnly) discMask(ctx, w, h, myth ? viewDiscs(layout) : [LIVING_DISC], k);
	return true;
}

/* —————————————— the gold line round Samhan —————————————— */

/** The Samhan sheet with room for the line and the eastern islets, in flat sheet units. */
const SAMHAN_FLAT: SheetBox = { x: -40, y: -40, w: MAP_VIEWBOX.w + 80, h: MAP_VIEWBOX.h + 80 };
/** Pixels per flat sheet unit of the line's canvas; the canvas keeps this pixel size under any fish-eye. */
const FLAT_RES = 1.6;

type LineFrame = { box: SheetBox; res: number; w: number; h: number; ver: string };
let lineFrame: LineFrame | null = null;

/** The overlay's frame under the live fish-eye: the warped Samhan sheet's bounds, at a constant pixel size. */
function frameOfLine(): LineFrame {
	const ver = projectionVer();
	if (lineFrame?.ver === ver) return lineFrame;
	const { x, y, w, h } = SAMHAN_FLAT;
	let x0 = Infinity;
	let y0 = Infinity;
	let x1 = -Infinity;
	let y1 = -Infinity;
	for (let i = 0; i <= 32; i++) {
		const t = i / 32;
		for (const [px, py] of [fishEye(x + w * t, y), fishEye(x + w * t, y + h), fishEye(x, y + h * t), fishEye(x + w, y + h * t)]) {
			x0 = Math.min(x0, px);
			y0 = Math.min(y0, py);
			x1 = Math.max(x1, px);
			y1 = Math.max(y1, py);
		}
	}
	const box = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
	const res = (FLAT_RES * SAMHAN_FLAT.w) / box.w;
	lineFrame = { box, res, w: Math.round(box.w * res), h: Math.round(box.h * res), ver };
	return lineFrame;
}

/** What the Samhan overlay paints over, in sheet units, under the live fish-eye. */
export const samhanBox = (): SheetBox => frameOfLine().box;

/** One pass of the exact squared distance transform (Felzenszwalb & Huttenlocher) over `n` samples. */
function edtPass(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
	const INF = 1e20;
	let k = 0;
	v[0] = 0;
	z[0] = -INF;
	z[1] = INF;
	for (let q = 1; q < n; q++) {
		let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
		while (s <= z[k]) {
			k--;
			s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
		}
		k++;
		v[k] = q;
		z[k] = s;
		z[k + 1] = INF;
	}
	k = 0;
	for (let q = 0; q < n; q++) {
		while (z[k + 1] < q) k++;
		d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
	}
}

/** Each pixel's distance, in pixels, to the nearest set pixel of `seed` (`w`×`h`). */
function distanceField(seed: Uint8Array, w: number, h: number): Float32Array {
	const n = Math.max(w, h);
	const f = new Float64Array(n);
	const dd = new Float64Array(n);
	const v = new Int32Array(n);
	const z = new Float64Array(n + 1);
	const g = new Float64Array(w * h);
	for (let i = 0; i < g.length; i++) g[i] = seed[i] ? 0 : 1e20;
	for (let x = 0; x < w; x++) {
		for (let y = 0; y < h; y++) f[y] = g[y * w + x];
		edtPass(f, h, dd, v, z);
		for (let y = 0; y < h; y++) g[y * w + x] = dd[y];
	}
	const dist = new Float32Array(w * h);
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) f[x] = g[y * w + x];
		edtPass(f, w, dd, v, z);
		for (let x = 0; x < w; x++) dist[y * w + x] = Math.sqrt(dd[x]);
	}
	return dist;
}

const reachOf = { key: '', dist: null as Float32Array | null };

/** A canvas sized to the overlay frame, transformed to sheet units. */
function lineCanvas(sheet: HTMLCanvasElement, lf: LineFrame): CanvasRenderingContext2D {
	if (sheet.width !== lf.w || sheet.height !== lf.h) {
		sheet.width = lf.w;
		sheet.height = lf.h;
	}
	const ctx = sheet.getContext('2d', { willReadFrequently: true })!;
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, lf.w, lf.h);
	ctx.setTransform(lf.res, 0, 0, lf.res, -lf.box.x * lf.res, -lf.box.y * lf.res);
	return ctx;
}

/** Every pixel's distance (sheet units) to Samhan's land in `year`: its kingdoms' sites on the coast, and the three islands. */
function samhanDistance(d: CosmosData, year: number): Float32Array {
	const lf = frameOfLine();
	const key = `${settledYear(year)}|${lf.ver}`;
	if (reachOf.key === key && reachOf.dist) return reachOf.dist;
	const ctx = lineCanvas(canvas(lf.w, lf.h), lf);
	ctx.fillStyle = '#fff';
	const holdings = holdingsAt(year);
	BORDER_SITES.forEach((s, i) => {
		const p = holdings[i].polity;
		if (s.d && p && SAMHAN_POLITIES.has(p)) ctx.fill(path2d(s.d));
	});
	ctx.globalCompositeOperation = 'destination-in';
	ctx.fill(path2d(d.land));
	ctx.globalCompositeOperation = 'source-over';
	const grow = fishScale();
	for (const isle of SAMHAN_ISLES) {
		const [x, y] = cosmosProject(...isle.at);
		ctx.save();
		ctx.beginPath();
		ctx.arc(x, y, isle.r * grow * 10, 0, Math.PI * 2);
		ctx.clip();
		ctx.fill(path2d(d.land));
		ctx.restore();
		ctx.beginPath();
		ctx.arc(x, y, isle.r * grow, 0, Math.PI * 2);
		ctx.fill();
	}
	const px = ctx.getImageData(0, 0, lf.w, lf.h).data;
	const seed = new Uint8Array(lf.w * lf.h);
	for (let i = 0; i < seed.length; i++) seed[i] = px[i * 4 + 3] >= 128 ? 1 : 0;
	const dist = distanceField(seed, lf.w, lf.h);
	for (let i = 0; i < dist.length; i++) dist[i] /= lf.res;
	reachOf.key = key;
	reachOf.dist = dist;
	return dist;
}

const lined = new WeakMap<HTMLCanvasElement, string>();

/**
 * High-res Samhan state fills for the overlay canvas (`samhanBox`), cut to the
 * coast, so the kingdoms' colours still read when the cosmos paint is coarse.
 */
export function paintSamhanStates(sheet: HTMLCanvasElement, d: CosmosData, year: number): void {
	const ctx = lineCanvas(sheet, frameOfLine());
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	const holdings = holdingsAt(year);
	const fillPolities = new Set<string>([...SAMHAN_POLITIES, 'balhae']);
	BORDER_SITES.forEach((site, i) => {
		const hold = holdings[i];
		if (!site.d || !hold.polity || !fillPolities.has(hold.polity)) return;
		const c = siteColor(site, hold, year, true);
		ctx.globalAlpha = 0.92;
		ctx.fillStyle = c;
		ctx.strokeStyle = c;
		ctx.lineWidth = 1.6;
		ctx.fill(path2d(site.d));
		ctx.stroke(path2d(site.d));
	});
	ctx.globalAlpha = 1;
	ctx.globalCompositeOperation = 'destination-in';
	ctx.fill(path2d(d.land));
	ctx.globalCompositeOperation = 'source-over';
}

/**
 * Paints the gold line round Samhan's land in `year` onto `sheet` (sized here): a band
 * `gap` off the coast and `width` wide, with a soft glow outward. Islands near enough
 * to each other or the coast share one line. Returns false when nothing changed.
 * Gap and width are for the flat peninsula; they grow with the fish-eye's magnification.
 */
export function paintSamhanLine(sheet: HTMLCanvasElement, d: CosmosData, year: number, line: { gap: number; width: number }, light: boolean): boolean {
	const lf = frameOfLine();
	const key = `${settledYear(year)}|${line.gap}|${line.width}|${light}|${lf.ver}`;
	if (lined.get(sheet) === key) return false;
	lined.set(sheet, key);
	const dist = samhanDistance(d, year);
	const ctx = lineCanvas(sheet, lf);
	const img = ctx.createImageData(lf.w, lf.h);
	const px = img.data;
	const [r, g, b] = light ? [158, 108, 14] : [242, 200, 92];
	const grow = fishScale();
	const mid = (line.gap + line.width / 2) * grow;
	const half = (line.width / 2) * grow;
	const glow = line.width * grow * 1.5;
	for (let i = 0; i < dist.length; i++) {
		const u = dist[i];
		if (u === 0) continue;
		const core = Math.min(1, Math.max(0, (half - Math.abs(u - mid)) * lf.res + 0.5));
		const halo = u > mid ? 0.3 * Math.exp(-(((u - mid) / glow) ** 2)) : 0.3 * (u / mid) ** 2;
		const a = Math.max(core, halo);
		if (a < 0.004) continue;
		px[i * 4] = r;
		px[i * 4 + 1] = g;
		px[i * 4 + 2] = b;
		px[i * 4 + 3] = a * 255;
	}
	ctx.putImageData(img, 0, 0);
	return true;
}

