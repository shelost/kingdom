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
	LAND_ADDS,
	LIVING_DISC,
	MYTH_LABELS,
	ONE_NAME,
	SNOW_LANDS,
	STEPPE_LANDS,
	EAST_MIST_ARC,
	EAST_MYTH_LANDS,
	HIMALAYA_LANDS,
	PASSES_RANGE,
	BLACK_SEA_FILL,
	CASPIAN_FILL,
	PANGAEA_LAND,
	PANGAEA_FILLS,
	TETHYS_WATER,
	TEN_HELLS,
	UNKNOWN_LANDS,
	WATER_CUTS,
	WEST_LANDS,
	GULF_LAND,
	TYRRHENIAN_LAND,
	discsAt,
	ANSEO_NAME,
	PROTECTORATE_NAME,
	REGION_COLOR,
	SAMHAN_ISLES,
	SAMHAN_POLITIES,
	clipsFor,
	cosmosProject,
	cosmosSplitOf,
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
import { MAP_VIEWBOX, RIVERS } from '$lib/places';
import { realmKeeper, realmRuler, type RealmRuler } from '$lib/realmRulers';
import { PEOPLE_MARK, type PeopleMarkId } from '$lib/peopleMarks';

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
	/** One of the ten peoples: its mark sits above the name. */
	mark?: PeopleMarkId;
	lines: CosmosLine[];
	/** Stands on the underworld's dark ground, which stays dark in light mode too. */
	night?: boolean;
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
	/** Cosmos gets every myth station; world may show eastern myth-countries only (their scopes). */
	const mythOn = myth && (scope === 'cosmos' || scope === 'world');
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
			ruler: rulers
				? l.realm && l.nation
					? realmKeeper(l.nation)
					: l.region && l.nation && !l.people && !l.sub && !l.protectorate
						? realmRuler(l.nation, year)
						: null
				: null,
			mark: l.nation && !l.people && !l.sub && !l.protectorate ? PEOPLE_MARK[l.nation] : undefined,
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
	const split = cosmosSplitOf();
	const { living, dead } = discsAt(split);
	/** Beginning: one circle — keep living-world names; hells and the lens wait for the split. */
	const mythOpen = split > 0.18;
	const opened = mythOpen
		? kept
		: kept.filter((l) => {
				if (!l.myth && !l.icon) return true;
				const spot = [...MYTH_LABELS, ...COSMOS_LABELS].find((m) => m.id === l.id)?.spot;
				return !spot || spot === 'living' || spot === 'peoples';
			});
	/** Each hell, on the mirror of its living civilization. Its judge is its ruler. */
	const hells: CosmosShown[] = mythOpen
		? TEN_HELLS.map((h) => ({
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
				ruler: rulers
					? {
							en: h.judge.en,
							ko: h.judge.ko,
							faces: [{ person: h.id === 'hell-yumla' ? 'yumla' : undefined, en: h.judge.en, ko: h.judge.ko }]
						}
					: null,
				lines: []
			}))
		: [];
	const inDisc = ([x, y]: [number, number], d: Disc) => Math.hypot(x - d.x, y - d.y) < d.r;
	return [...opened, ...hells].map((l) => ({ ...l, night: inDisc(l.xy, dead) && !inDisc(l.xy, living) }));
}

/** Which cosmos sheet a name belongs to. Realms stay up whichever sheet is off. */
export type CosmosSheets = { peoples: boolean; nature: boolean; myth: boolean };

export function labelOn(l: CosmosShown, sheets: CosmosSheets): boolean {
	if (l.kind) return sheets.nature;
	if (l.realm) return true;
	if (l.mark) return sheets.peoples;
	if (l.myth || l.icon) return sheets.myth;
	return true;
}

/* —————————————— names that fit —————————————— */

/** Words packed greedily into lines of at most `max` characters; a longer word keeps its own line. */
function wrapWords(text: string, max: number): string[] {
	const out: string[] = [];
	for (const word of text.split(' ').filter(Boolean)) {
		const last = out.length - 1;
		if (last >= 0 && out[last].length + 1 + word.length <= max) out[last] += ` ${word}`;
		else out.push(word);
	}
	return out;
}

/** The lines a name's title is set in: realms never break, hells one word a line, the rest short lines. */
export function nameLines(main: string, o: { realm?: boolean; icon?: string; ko: boolean }): string[] {
	if (o.realm) return [main];
	if (o.icon) return main.split(' ');
	return wrapWords(main, o.ko ? 5 : 10);
}

/** An epithet's lines under the title. */
export const epithetLines = (text: string, ko: boolean) => wrapWords(text, ko ? 7 : 14);

/** The title's size in em, as CosmosName sets each tier. */
function titleEm(l: CosmosShown, ko: boolean): number {
	if (l.realm) return ko ? 2.2 : 1.7;
	if (l.mark) return ko ? 1.48 : 1.18;
	if (l.kind === 'ocean') return 0.44;
	if (l.kind === 'river') return 0.5;
	if (l.kind === 'biome') return 0.56;
	if (l.icon) return ko ? 0.95 : 0.62;
	const base = ko ? 1.05 : 0.78;
	if (l.myth) return base * 0.78;
	if (l.sea) return base * 1.1;
	if (l.home) return ko ? base * 1.2 : 0.95;
	if (l.sub) return base * 0.92;
	return base;
}

/**
 * A name's box in pixels at base size `base` (the label's font size), estimated from its
 * lines and tier: generous, so near misses still part.
 */
function nameBox(l: CosmosShown, ko: boolean, base: number): [number, number] {
	const em = titleEm(l, ko) * base;
	const main = ko ? l.ko : l.en;
	const lines = nameLines(main, { realm: l.realm, icon: l.icon, ko });
	/** Hangul runs about a full em a glyph; the serif Latin about three quarters, wider when tracked. */
	const glyph = ko ? 1 : l.kind === 'ocean' ? 0.95 : l.kind === 'biome' ? 0.84 : 0.74;
	let w = Math.max(...lines.map((s) => s.length)) * em * glyph;
	let h = lines.length * em * 1.1;
	if (l.icon) h += base * 1.1;
	else if (l.native && !l.sub) h += base * 1.15;
	if (l.epithet) h += base * 0.7 * epithetLines((ko ? l.epithet.ko : l.epithet.en) ?? '', ko).length;
	if (l.mark) {
		h += base * 1.55;
		w = Math.max(w, base * 1.8);
	}
	if (l.standing) h += base * 0.7;
	if (l.ruler) {
		h += base * (l.ruler.faces?.length ? 2.4 : 1.1);
		if (l.ruler.faces && l.ruler.faces.length > 1) w = Math.max(w, l.ruler.faces.length * base * 1.8);
	}
	h += l.lines.length * base * 0.7;
	return [w + 6, h + 4];
}

/**
 * Who keeps their place when names crowd: realms, the home peninsula, the ten peoples,
 * hells, then the smaller myth stations (the twelve passes and the rest), seas, biomes.
 */
function nameRank(l: CosmosShown): number {
	if (l.realm) return 0;
	if (l.home) return 1;
	if (l.mark) return 2;
	if (l.icon) return 3;
	if (l.myth) return 4;
	if (l.sea) return 5;
	if (l.kind) return 6;
	return 3;
}

/**
 * Keys of the names that fit on screen at `at` (pixels), set at font size `base`: in rank
 * order, a name keeps its place unless it overlaps one already kept. The hidden ones come
 * back as the reader zooms in.
 */
export function uncrowded(
	shown: CosmosShown[],
	at: (l: CosmosShown) => [number, number] | null,
	ko: boolean,
	base: number
): Set<string> {
	const order = shown.map((l, i) => ({ l, i, r: nameRank(l) })).sort((a, b) => a.r - b.r || a.i - b.i);
	const kept: [number, number, number, number][] = [];
	const keys = new Set<string>();
	for (const { l } of order) {
		const p = at(l);
		if (!p) continue;
		const [w, h] = nameBox(l, ko, base);
		const box: [number, number, number, number] = [p[0] - w / 2, p[1] - h / 2, p[0] + w / 2, p[1] + h / 2];
		if (kept.some((k) => box[0] < k[2] && box[2] > k[0] && box[1] < k[3] && box[3] > k[1])) continue;
		kept.push(box);
		keys.add(l.key);
	}
	return keys;
}

/* —————————————— painting —————————————— */

/** The frame of the paint in progress: each scope paints its own sheet (`scopeFrame`). */
let F: SheetBox = COSMOS_FRAME;
/** A rect past every frame, for even-odd cuts that must not depend on the frame being painted. */
const EVERYWHERE: SheetBox = { x: COSMOS_FRAME.x - 4000, y: COSMOS_FRAME.y - 4000, w: COSMOS_FRAME.w + 8000, h: COSMOS_FRAME.h + 8000 };

function canvas(w: number, h: number): HTMLCanvasElement {
	const c = document.createElement('canvas');
	c.width = w;
	c.height = h;
	return c;
}

const scratches = new Map<string, HTMLCanvasElement>();
/**
 * A full-size working layer, blank and with a fresh context state, reused per `role`:
 * the browser frees canvas memory lazily, so a new layer per paint piles up until the
 * GPU process gives out.
 */
function scratch(role: string, w: number, h: number): HTMLCanvasElement {
	let c = scratches.get(role);
	if (!c) {
		c = document.createElement('canvas');
		scratches.set(role, c);
	}
	c.width = w;
	c.height = h;
	return c;
}
/** Hand every working layer's memory back once a paint is done. */
function releaseScratch() {
	for (const c of scratches.values()) {
		c.width = 0;
		c.height = 0;
	}
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
		p.rect(EVERYWHERE.x, EVERYWHERE.y, EVERYWHERE.w, EVERYWHERE.h);
		p.addPath(ringPath(ring));
		outsides.set(ring, p);
	}
	return p;
}

/** A protectorate: diagonal hatching and a dashed edge, past `ring` when set; `u` scales the strokes. */
function hatch(ctx: CanvasRenderingContext2D, p: Path2D, color: string, ring?: CosmosClip['ring'], u = 1) {
	const SPACE = 46 * u;
	ctx.save();
	ctx.clip(p);
	if (ring) ctx.clip(outsidePath(ring), 'evenodd');
	ctx.globalAlpha = 0.5;
	ctx.strokeStyle = color;
	ctx.lineWidth = 5 * u;
	ctx.beginPath();
	for (let x = F.x - F.h; x < F.x + F.w; x += SPACE) {
		ctx.moveTo(x, F.y + F.h);
		ctx.lineTo(x + F.h, F.y);
	}
	ctx.stroke();
	ctx.globalAlpha = 0.85;
	ctx.lineWidth = 4 * u;
	ctx.setLineDash([18 * u, 12 * u]);
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
const LAND_MASK_VER = 20;
/** Sheet units the western land's edge is widened by, so no sliver of sea survives along the old coast. */
const WEST_SEAM = 70;
/** The land, white on transparent, per frame and canvas width, under the live fish-eye. */
function landMask(d: CosmosData, w: number, h: number): HTMLCanvasElement {
	const key = `${LAND_MASK_VER}|${projectionVer()}|${F.x},${F.y},${F.w},${F.h}|${w}|${d.land.length}`;
	let m = lands.get(key);
	if (m) return m;
	if (lands.size > 1) lands.clear();
	m = canvas(w, h);
	const ctx = m.getContext('2d')!;
	toSheet(ctx, w / F.w);
	ctx.fillStyle = '#fff';
	fillLand(ctx, d);
	lands.set(key, m);
	return m;
}

/**
 * The painted land as a 0/1 grid of `nx` × `ny` samples over `box` (corner samples on
 * its edges), so a relief built on it rises exactly where the paint shows land.
 */
export function landRaster(d: CosmosData, box: SheetBox, nx: number, ny: number): Uint8Array {
	const c = canvas(nx, ny);
	const ctx = c.getContext('2d', { willReadFrequently: true })!;
	const kx = (nx - 1) / box.w;
	const ky = (ny - 1) / box.h;
	ctx.setTransform(kx, 0, 0, ky, -box.x * kx + 0.5, -box.y * ky + 0.5);
	ctx.fillStyle = '#fff';
	fillLand(ctx, d);
	const px = ctx.getImageData(0, 0, nx, ny).data;
	const out = new Uint8Array(nx * ny);
	for (let i = 0; i < out.length; i++) out[i] = px[i * 4 + 3] >= 128 ? 1 : 0;
	return out;
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
	ctx.stroke(ringPath(GULF_LAND));
	ctx.lineWidth = 140;
	ctx.stroke(ringPath(TYRRHENIAN_LAND));
	ctx.lineWidth = 48;
	ctx.stroke(ringPath(BLACK_SEA_FILL));
	ctx.stroke(ringPath(CASPIAN_FILL));
	ctx.restore();
	ctx.globalCompositeOperation = 'destination-out';
	for (const ring of WATER_CUTS) ctx.fill(ringPath(ring));
	ctx.globalCompositeOperation = 'source-over';
}

/** HEK's Pangaea: one joined landmass with a shallow Tethys bite. */
function fillPangaea(ctx: CanvasRenderingContext2D, d: CosmosData) {
	fillLand(ctx, d);
	ctx.fill(ringPath(PANGAEA_LAND));
	for (const ring of PANGAEA_FILLS) ctx.fill(ringPath(ring));
	ctx.save();
	ctx.strokeStyle = ctx.fillStyle;
	ctx.lineJoin = 'round';
	ctx.lineWidth = 120;
	ctx.stroke(ringPath(PANGAEA_LAND));
	ctx.restore();
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fill(ringPath(TETHYS_WATER));
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
	shape: 'drift' | 'dune' | 'canopy' | 'peak';
	/** Piles per sheet unit² of the ring's box. */
	density: number;
	/** Rings cut out of the fill (the North China Plain stays sand, not canopy). */
	holes?: CosmosClip['ring'][];
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
		sparkle: true,
		/** Soft southern lip — no hard tundra border. */
		soft: 160
	},
	{
		rings: STEPPE_LANDS,
		seed: 47,
		base: '#c4a86a',
		lit: ['#e0c88a', '#c4a86a', '#8a6e3c'],
		shadow: 'rgba(90,70,30,0.4)',
		edge: '#8a6e3c',
		shape: 'drift',
		density: 1 / 5000,
		soft: 90
	},
	{
		rings: DESERT_LANDS,
		seed: 53,
		base: '#ecc983',
		lit: ['#fbe7b4', '#efcc86', '#c99a52'],
		shadow: 'rgba(150,100,40,0.35)',
		edge: '#c2914a',
		shape: 'dune',
		density: 1 / 4800,
		soft: 120
	},
	{
		/** Twelve Mountain Passes — the western arc just before the three rivers. */
		rings: PASSES_RANGE,
		seed: 61,
		base: '#c8d0d8',
		lit: ['#f4f7fa', '#c5ced8', '#6a7686'],
		shadow: 'rgba(40,50,65,0.5)',
		edge: '#5a6878',
		shape: 'peak',
		density: 1 / 1400,
		sparkle: true
	},
	{
		/** Himalayan wall — snow peaks along Tobun's southern lip. */
		rings: HIMALAYA_LANDS,
		seed: 71,
		base: '#d8e4f0',
		lit: ['#ffffff', '#e8eef6', '#8a9bb0'],
		shadow: 'rgba(40,50,70,0.5)',
		edge: '#6a7a90',
		shape: 'peak',
		density: 1 / 1600,
		sparkle: true
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
	} else if (t.shape === 'peak') {
		/** Clash-of-Clans mountain: a sharp triangle with a snow cap. */
		s.fillStyle = t.lit[2];
		s.beginPath();
		s.moveTo(x - r * 1.1, y + r * 0.55);
		s.lineTo(x, y - r * 1.35);
		s.lineTo(x + r * 1.1, y + r * 0.55);
		s.closePath();
		s.fill();
		s.fillStyle = t.lit[0];
		s.beginPath();
		s.moveTo(x - r * 0.35, y - r * 0.35);
		s.lineTo(x, y - r * 1.35);
		s.lineTo(x + r * 0.35, y - r * 0.35);
		s.closePath();
		s.fill();
	} else {
		blob(x - r * 0.55, y + r * 0.1, r * 0.7, r * 0.66);
		blob(x + r * 0.55, y + r * 0.12, r * 0.7, r * 0.64);
		blob(x, y - r * 0.25, r * 0.78, r * 0.72);
	}
}

/** Cut rings out of a terrain layer (feathered) and leave the context in sheet space. */
function punchHoles(s: CanvasRenderingContext2D, holes: CosmosClip['ring'][] | undefined, w: number, h: number, k: number) {
	if (!holes?.length) return;
	const cut = scratch('plain-hole', w, h);
	const c = cut.getContext('2d')!;
	toSheet(c, k);
	c.filter = `blur(${Math.max(2, Math.round(k * 36))}px)`;
	c.fillStyle = '#fff';
	for (const ring of holes) c.fill(ringPath(ring));
	s.setTransform(1, 0, 0, 1, 0, 0);
	s.globalCompositeOperation = 'destination-out';
	s.drawImage(cut, 0, 0);
	s.globalCompositeOperation = 'source-over';
	toSheet(s, k);
}

/** The terrains, painted as a game board draws them and masked to the land. */
function paintTerrain(ctx: CanvasRenderingContext2D, mask: HTMLCanvasElement, w: number, h: number, k: number) {
	const layer = scratch('terrain', w, h);
	const ls = layer.getContext('2d')!;
	toSheet(ls, k);
	const probe = canvas(1, 1).getContext('2d')!;
	ls.lineJoin = 'round';
	ls.lineCap = 'round';
	for (const t of TERRAINS) {
		const rand = seeded(t.seed);
		const flakes: [number, number, number][] = [];
		const own = t.soft ? scratch('terrain-soft', w, h) : layer;
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
		punchHoles(s, t.holes, w, h, k);
		if (!t.soft) continue;
		const feather = scratch('feather', w, h);
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
	const plan: { kind: BiomeMote['kind']; rings: CosmosClip['ring'][]; n: number; box: [number, number, number, number] }[] = [
		{ kind: 'snow', rings: [...SNOW_LANDS, ...HIMALAYA_LANDS], n: 48, box: [-40, 170, 26, 80] },
		{ kind: 'sand', rings: [...DESERT_LANDS, ...STEPPE_LANDS], n: 28, box: [-40, 105, 11, 38] }
	];
	const rand = seeded(83);
	const out: BiomeMote[] = [];
	let seq = 0;
	for (const p of plan) {
		let made = 0;
		for (let tries = 0; made < p.n && tries < p.n * 40; tries++) {
			const lon = p.box[0] + rand() * (p.box[1] - p.box[0]);
			const lat = p.box[2] + rand() * (p.box[3] - p.box[2]);
			if (!p.rings.some((r) => inRing(r, lon, lat))) continue;
			const xy = cosmosProject(lon, lat);
			if (Math.hypot(xy[0] - LIVING_DISC.x, xy[1] - LIVING_DISC.y) > LIVING_DISC.r * 0.86) continue;
			out.push({ key: `${p.kind}-${seq++}`, kind: p.kind, xy, delay: rand() * 6, dur: 3.5 + rand() * 3.5 });
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
 * A blurred land pad (warm sand of 이승) sits under them first — full tip-to-tip on
 * both arcs — so the Western Heavens are hemmed by shore, not a black void.
 */
function paintFieldRivers(target: CanvasRenderingContext2D, k: number) {
	paintFieldWaters(target, k);
}

function paintFieldWaters(ctx: CanvasRenderingContext2D, k: number) {
	const { living, dead } = discsAt();
	/** 삼색천's three run thin, so together they span about the Samdo; the land pad keeps its own width. */
	const ink: Record<string, { bed: string; core: string; width: number; pad: number }> = {
		baek: { bed: '#8ea4b8', core: '#f7fbff', width: 12, pad: 228 },
		hwang: { bed: '#8a6a28', core: '#f2c14e', width: 12, pad: 228 },
		jeok: { bed: '#7a2430', core: '#e25b5b', width: 12, pad: 228 },
		samdo: { bed: '#10283c', core: '#9fd4f0', width: 48, pad: 288 }
	};
	ctx.save();
	ctx.lineCap = 'round';
	for (const river of fieldRivers()) {
		const home = river.id === 'samdo' ? dead : living;
		const lens = river.id === 'samdo' ? living : dead;
		const outside = new Path2D();
		outside.rect(EVERYWHERE.x, EVERYWHERE.y, EVERYWHERE.w, EVERYWHERE.h);
		outside.addPath(discPath(lens));
		ctx.save();
		ctx.clip(discPath(home));
		ctx.clip(outside, 'evenodd');
		ctx.filter = `blur(${Math.max(3, Math.round(k * 70))}px)`;
		ctx.beginPath();
		ctx.arc(river.disc.x, river.disc.y, river.r, river.a0, river.a1, river.ccw);
		/** Land pad — warm sand of 이승, not a black void around the Western Heavens. */
		ctx.strokeStyle = '#e8dcc4';
		ctx.globalAlpha = 0.92;
		ctx.lineWidth = ink[river.id].pad;
		ctx.stroke();
		ctx.restore();
	}
	for (const river of fieldRivers()) {
		const look = ink[river.id];
		ctx.save();
		ctx.clip(discPath(river.id === 'samdo' ? dead : living));
		ctx.beginPath();
		ctx.arc(river.disc.x, river.disc.y, river.r, river.a0, river.a1, river.ccw);
		ctx.strokeStyle = look.bed;
		ctx.globalAlpha = 0.92;
		ctx.lineWidth = look.width;
		ctx.stroke();
		ctx.strokeStyle = look.core;
		ctx.globalAlpha = 0.96;
		ctx.lineWidth = look.width * 0.5;
		ctx.stroke();
		ctx.restore();
	}
	const samdo = fieldRivers().find((r) => r.id === 'samdo')!;
	const dir = samdo.ccw ? -1 : 1;
	const span = dir * (samdo.a1 - samdo.a0);
	ctx.clip(discPath(dead));
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
	const { living, dead } = discsAt();
	const s = dead.r / living.r;
	ctx.save();
	ctx.clip(discPath(dead));
	ctx.transform(-s, 0, 0, s, dead.x + living.x * s, dead.y - living.y * s);
	drawSpheres(ctx, sp.land, 0.92, 0);
	/** The tundra's mirror is 극락 (Bliss), Africa's 지옥 (Pain), the desert's 명부 (the Gateway). */
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
	ctx.clip(discPath(discsAt().living));
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

/** Path / station dots: forks, Bifrost mouth, mountain passes, three-colored rivers. */
function paintPathDots(ctx: CanvasRenderingContext2D, layout: CosmosLayout) {
	const spots = layoutSpots(layout);
	const marks: { at: [number, number]; color: string; n: number }[] = [
		{ at: spots.threefold, color: '#f2c14e', n: 3 },
		{ at: spots.seventyEight, color: '#9fd4f0', n: 7 },
		{ at: spots.passes, color: '#c8d4e0', n: 1 },
		{ at: spots.coloredRivers, color: '#e25b5b', n: 1 }
	];
	for (const m of marks) {
		const [cx, cy] = m.at;
		for (let i = 0; i < m.n; i++) {
			const a = -Math.PI / 2 + (i * Math.PI * 2) / Math.max(1, m.n);
			const r = m.n === 1 ? 0 : 28 + (i % 2) * 10;
			ctx.globalAlpha = 0.9;
			ctx.fillStyle = m.color;
			ctx.beginPath();
			ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, m.n === 1 ? 9 : 7, 0, Math.PI * 2);
			ctx.fill();
		}
		if (m.n > 1) {
			ctx.globalAlpha = 1;
			ctx.fillStyle = m.color;
			ctx.beginPath();
			ctx.arc(cx, cy, 5, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}

/**
 * Ocean of Life: the whole Western Heavens lens except the flower-field meadow.
 * Same water language as the old Life River (cyan bed, bright core).
 */
function paintOceanOfLife(ctx: CanvasRenderingContext2D, light: boolean) {
	const { living, dead } = discsAt();
	const [x, y] = lensPoint(living, dead);
	const { north, south } = lensTips(living, dead);
	const half = (south[1] - north[1]) / 2;
	const m = meadow();
	ctx.save();
	ctx.clip(discPath(living));
	ctx.clip(discPath(dead));
	const sky = ctx.createRadialGradient(x, y, 0, x, y, half);
	sky.addColorStop(0, light ? '#c8eef8' : '#7ab8d0');
	sky.addColorStop(0.45, light ? '#7ec8e0' : '#3a8aaa');
	sky.addColorStop(1, light ? '#4a9ab8' : '#1e5a78');
	ctx.globalAlpha = 0.92;
	ctx.fillStyle = sky;
	ctx.fillRect(x - half, y - half, half * 2, half * 2);
	/** Soft ripple rings — keep the old river shimmer without a single stroke. */
	ctx.lineCap = 'round';
	for (const [color, width, alpha, scale] of [
		['#bff0ff', 18, 0.35, 0.55],
		['#ffffff', 6, 0.25, 0.38]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.beginPath();
		ctx.ellipse(x, y, half * scale, half * scale * 0.72, 0, 0, Math.PI * 2);
		ctx.stroke();
	}
	/** Punch the meadow back out so the flower fields stay land. */
	ctx.globalCompositeOperation = 'destination-out';
	ctx.globalAlpha = 1;
	ctx.beginPath();
	ctx.ellipse(m.x, m.y, m.rx * 1.05, m.ry * 1.05, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

/**
 * Eastern myth fringe: a soft mist arc past the Pacific, then five mountain lands
 * beyond it, each wrapped in mist. Drawn over the sea only — never written into the
 * land mask — so Wa, Kamchatka and the known coast stay exactly as they are.
 */
function paintEastMyth(ctx: CanvasRenderingContext2D, k: number, light: boolean) {
	ctx.save();
	ctx.clip(discPath(discsAt().living));
	/** Mist curtain — thick stroked arc, heavily blurred. */
	const mist = new Path2D();
	EAST_MIST_ARC.forEach((ll, i) => {
		const [x, y] = cosmosProject(...ll);
		if (i) mist.lineTo(x, y);
		else mist.moveTo(x, y);
	});
	ctx.save();
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.strokeStyle = light ? 'rgba(236, 244, 252, 0.9)' : 'rgba(180, 204, 228, 0.6)';
	ctx.lineWidth = 320;
	ctx.filter = `blur(${Math.max(12, Math.round(k * 130))}px)`;
	ctx.stroke(mist);
	ctx.lineWidth = 160;
	ctx.strokeStyle = light ? 'rgba(255, 255, 255, 0.75)' : 'rgba(210, 228, 245, 0.48)';
	ctx.stroke(mist);
	ctx.lineWidth = 70;
	ctx.strokeStyle = light ? 'rgba(255, 255, 255, 0.5)' : 'rgba(230, 240, 255, 0.34)';
	ctx.stroke(mist);
	ctx.restore();
	/** Mountain lands past the mist — stone bases, snow peaks, local mist. */
	const peak = { lit: ['#ffffff', '#e8eef6', '#6a7a90'] as const, shadow: 'rgba(40,50,70,0.55)' };
	const islands = EAST_MYTH_LANDS;
	for (const [i, land] of islands.entries()) {
		const pts = land.ring.map((ll) => cosmosProject(...ll));
		const xs = pts.map((p) => p[0]);
		const ys = pts.map((p) => p[1]);
		const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
		const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
		const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
		ctx.save();
		ctx.filter = `blur(${Math.max(3, Math.round(k * 40))}px)`;
		ctx.globalAlpha = light ? 0.78 : 0.62;
		ctx.fillStyle = land.fill;
		ctx.fill(ringPath(land.ring));
		ctx.filter = 'none';
		ctx.globalAlpha = light ? 0.88 : 0.75;
		const rand = seeded(91 + i * 17);
		for (let n = 0; n < 7; n++) {
			const px = cx + (rand() - 0.5) * span * 0.55;
			const py = cy + (rand() - 0.5) * span * 0.4;
			const r = span * (0.09 + rand() * 0.08);
			ctx.fillStyle = peak.shadow;
			ctx.beginPath();
			ctx.ellipse(px, py + r * 0.35, r * 1.15, r * 0.55, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = peak.lit[2];
			ctx.beginPath();
			ctx.moveTo(px - r * 1.15, py + r * 0.6);
			ctx.lineTo(px, py - r * 1.55);
			ctx.lineTo(px + r * 1.15, py + r * 0.6);
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle = peak.lit[0];
			ctx.beginPath();
			ctx.moveTo(px - r * 0.38, py - r * 0.35);
			ctx.lineTo(px, py - r * 1.55);
			ctx.lineTo(px + r * 0.38, py - r * 0.35);
			ctx.closePath();
			ctx.fill();
		}
		/** Local mist wrapping the peaks. */
		ctx.filter = `blur(${Math.max(8, Math.round(k * 90))}px)`;
		ctx.globalAlpha = light ? 0.55 : 0.4;
		ctx.fillStyle = light ? 'rgba(245, 250, 255, 0.95)' : 'rgba(200, 220, 240, 0.7)';
		ctx.beginPath();
		ctx.ellipse(cx, cy - span * 0.05, span * 0.55, span * 0.32, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
	ctx.restore();
}

/**
 * The approach to the Western Heavens: the mythic western land (cosmos.ts WEST_LANDS)
 * is already in the land mask, so here it only brightens into the lens on the living
 * lip and dims into it on the dead lip.
 */
function paintApproach(ctx: CanvasRenderingContext2D, light: boolean) {
	const { living, dead } = discsAt();
	const [x, y] = lensPoint(living, dead);
	const reach = 1500;
	ctx.save();
	ctx.clip(discPath(living));
	const lit = ctx.createLinearGradient(x + reach, 0, x, 0);
	lit.addColorStop(0, 'rgba(255,246,222,0)');
	lit.addColorStop(1, light ? 'rgba(255,246,222,0.55)' : 'rgba(250,236,200,0.38)');
	ctx.fillStyle = lit;
	ctx.fillRect(x, y - living.r, reach, living.r * 2);
	ctx.restore();
	ctx.save();
	ctx.clip(discPath(dead));
	const dim = ctx.createLinearGradient(x - reach, 0, x, 0);
	dim.addColorStop(0, 'rgba(180,200,230,0)');
	dim.addColorStop(1, 'rgba(180,200,230,0.22)');
	ctx.fillStyle = dim;
	ctx.fillRect(x - reach, y - dead.r, reach, dead.r * 2);
	ctx.restore();
}

/** Flower-field meadow only — the rest of the lens is the Ocean of Life. */
function paintLens(ctx: CanvasRenderingContext2D, light: boolean) {
	const { living, dead } = discsAt();
	const m = meadow();
	ctx.save();
	ctx.clip(discPath(living));
	ctx.clip(discPath(dead));
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
}

/**
 * 저승 fills its disc. The river and the ten hells sit west of the lens.
 * The lens itself is painted afterwards, green, over both discs.
 * Always re-enters sheet space: callers may have left the context in pixel space
 * (the land bridge ends on identity).
 */
function paintWorlds(
	ctx: CanvasRenderingContext2D,
	sp: Spheres,
	k: number,
	light: boolean,
	layout: CosmosLayout,
	washes = true,
	dead: Disc = DEAD_DISC,
	fade = 1
) {
	if (fade < 0.01) return;
	toSheet(ctx, k);
	const spots = layoutSpots(layout);
	ctx.save();
	ctx.globalAlpha = fade;
	if (layout === 'halves') {
		ctx.save();
		ctx.clip(discPath(HALF_DISC));
		const seam = HALF_DISC.x;
		const wash = ctx.createLinearGradient(seam - 1100, 0, seam + 520, 0);
		wash.addColorStop(0, light ? '#10182a' : '#05080f');
		wash.addColorStop(0.5, light ? '#1a2740' : '#0b1422');
		wash.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.globalAlpha = 0.9 * fade;
		ctx.fillStyle = wash;
		ctx.fill(westHalf(HALF_DISC));
		ctx.restore();
	} else {
		ctx.save();
		ctx.clip(discPath(dead));
		const gr = ctx.createRadialGradient(dead.x, dead.y, dead.r * 0.08, dead.x, dead.y, dead.r);
		gr.addColorStop(0, light ? '#101828' : '#05080f');
		gr.addColorStop(0.62, light ? '#1a2740' : '#0c1624');
		gr.addColorStop(1, light ? '#243048' : '#121820');
		ctx.globalAlpha = 0.97 * fade;
		ctx.fillStyle = gr;
		ctx.fill(discPath(dead));
		ctx.restore();
	}
	if (washes) {
		paintHells(ctx, sp, k);
		glowAt(ctx, spots.springs, light ? '#1a2744' : '#061018', 340, 0.85 * fade);
		lamps(ctx, spots.springs, 48, 200, 140);
	}
	ctx.restore();
	ctx.globalAlpha = 1;
}

/** Keeps the active silhouette (one disc, or two semi-attached) and fades its rim. */
function discMask(ctx: CanvasRenderingContext2D, w: number, h: number, discs: Disc[], k: number) {
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	const mask = scratch('disc', w, h);
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

/** The canvas height for a width, at a frame's aspect. */
export const paintHeight = (frame: SheetBox, w: number) => Math.round((w * frame.h) / frame.w);

/** The canvas width that gives a frame's long side `long` pixels. */
export const paintWidth = (frame: SheetBox, long: number) => (frame.w >= frame.h ? long : Math.round((long * frame.w) / frame.h));

/** The relief's own rasters over the frame (worldRelief.ts `reliefPaint`). */
export type ReliefLayers = { key: string; tint: HTMLCanvasElement; shade: HTMLCanvasElement };

export interface CosmosPaint {
	year: number;
	pal: MapPalette;
	light: boolean;
	/** Canvas width; the height follows the frame's aspect. */
	width: number;
	layout?: CosmosLayout;
	scope: CosmosScope;
	/** The sheet to paint (`scopeFrame(scope).frame`). */
	frame: SheetBox;
	/** Hypsometric tint and hillshade; without them the paint stays flat. */
	relief?: ReliefLayers | null;
	/** Hillshade strength: full on the flat map, softer on a lit mesh. */
	shade?: number;
	/** Samhan: the sheet's rivers. */
	rivers?: boolean;
	/**
	 * Civilization / Ten Peoples / Ten Hells colour washes. Off leaves bare land
	 * so topography and biomes read alone.
	 */
	washes?: boolean;
	/** Cosmos sheets. Peoples is the ten washes, nature the biomes and rivers, myth the fringe and the hells. */
	peoples?: boolean;
	nature?: boolean;
	mythic?: boolean;
	/**
	 * 0 = HEK's Beginning (one circle, Pangaea); 1 = the split cosmos.
	 * Defaults to the live `cosmosSplitOf()` so a tween can drive every paint.
	 */
	split?: number;
}

/**
 * Paints `year`'s known world over `o.frame` onto `sheet` (sized here). Returns false
 * when nothing changed since the last paint.
 *
 * Samhan: the peninsula close up — every site in its state colour, the sheet's borders,
 * seams and rivers, fine lines. Sphere: a political map, Korea-centred, crisp borders.
 * World: 이승's square, Near Lands ring, Samhan one red, civilization washes.
 * Cosmos: both discs, Ten Peoples ring, rivers, hells, path dots.
 */
export function paintCosmos(sheet: HTMLCanvasElement, d: CosmosData, o: CosmosPaint): boolean {
	const {
		year,
		pal,
		light,
		width: w,
		layout = 'circles',
		scope,
		frame,
		relief = null,
		shade = 1,
		rivers = false,
		washes = true,
		peoples = true,
		nature = true,
		mythic = true,
		split: splitOpt
	} = o;
	const split = splitOpt ?? cosmosSplitOf();
	const { living: liveDisc, dead: deadDisc } = discsAt(split);
	const h = paintHeight(frame, w);
	const standing = standingAt(d, year);
	const key = [
		'v38-beginning',
		LAND_MASK_VER,
		projectionVer(),
		`${frame.x},${frame.y},${frame.w},${frame.h}`,
		w,
		layout,
		scope,
		year,
		`${liveDisc.x},${deadDisc.x},${split.toFixed(3)}`,
		pal.sea,
		light,
		relief?.key ?? '',
		shade,
		rivers,
		washes,
		peoples,
		nature,
		mythic,
		standing.map((r) => r[0]).join(',')
	].join('|');
	if (painted.get(sheet) === key) return false;
	painted.set(sheet, key);
	F = frame;
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
	const near = scope === 'samhan' || scope === 'sphere';
	const myth = scope === 'cosmos';
	/** Line widths are in sheet units; the peninsula frame stands so close they must thin. */
	const u = scope === 'samhan' ? 0.28 : 1;
	/** Only the cosmos reveals 이승 as a disc; the world frame is its square. */
	const livingClip = (c: CanvasRenderingContext2D) => {
		if (!myth) return;
		c.clip(layout === 'halves' ? eastHalf(HALF_DISC) : discPath(liveDisc));
	};
	/** Pangaea weight: full in the Beginning, gone once the worlds have split. */
	const pangaea = myth ? Math.max(0, 1 - split) : 0;
	const mythFade = myth ? Math.max(0, (split - 0.12) / 0.88) : 1;
	/** Near frames: every border is crisp. World/cosmos: far lands stay soft. */
	const crispAll = near;

	/** Namyang's water — world and cosmos. */
	if (!near) {
		toSheet(ctx, k);
		ctx.save();
		livingClip(ctx);
		drawSpheres(ctx, sp.sea, light ? 0.24 : 0.3, sphereBlur * 5);
		ctx.restore();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	/** Land: civilization spheres (world/cosmos), then each standing state — cut to the coast. */
	const land = scratch('land', w, h);
	const lc = land.getContext('2d')!;
	lc.fillStyle = ground;
	lc.fillRect(0, 0, w, h);
	if (!near && washes && peoples) {
		toSheet(lc, k);
		lc.save();
		livingClip(lc);
		drawSpheres(lc, sp.fuzzy, light ? 0.4 : 0.48, sphereBlur * 6);
		drawSpheres(lc, sp.wash, light ? 0.44 : 0.52, Math.max(1, Math.round(sphereBlur * 0.4)));
		lc.restore();
		lc.setTransform(1, 0, 0, 1, 0, 0);
	}
	/** Firm edges at full resolution; the fog is blurred anyway, so a quarter will do. */
	const soft = scratch('soft', w, h);
	const fog = scratch('fog', Math.round(w / 4), Math.round(h / 4));
	const reach: { p: Path2D; color: string; ring?: CosmosClip['ring'] }[] = [];
	if (washes && peoples) {
		for (const [c, ck] of [
			[soft, k],
			[fog, k / 4]
		] as const) {
			const x = c.getContext('2d')!;
			toSheet(x, ck);
			x.lineJoin = 'round';
			x.lineWidth = 4 * u;
		}
		let sc = soft.getContext('2d')!;
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
				if (myth) continue;
				wash(p, REACH_WASH);
				reach.push({ p, color: c });
			} else if (clip) {
				wash(p, 1, (cx) => cx.clip(ringPath(clip.ring)));
				if (clip.outside === 'protectorate' && !myth) {
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
			hatch(lc, x.p, x.color, x.ring, u);
		}
		lc.setTransform(1, 0, 0, 1, 0, 0);
	}
	/** Land deepens slightly toward the Western Heavens — parchment going dusk. */
	if (!near) {
		toSheet(lc, k);
		lc.save();
		livingClip(lc);
		const dusk = lc.createLinearGradient(liveDisc.x + liveDisc.r * 0.35, 0, liveDisc.x - liveDisc.r * 0.85, 0);
		dusk.addColorStop(0, 'rgba(0,0,0,0)');
		dusk.addColorStop(0.4, 'rgba(0,0,0,0)');
		dusk.addColorStop(0.75, light ? 'rgba(72,52,32,0.1)' : 'rgba(40,28,18,0.16)');
		dusk.addColorStop(1, light ? 'rgba(58,40,24,0.22)' : 'rgba(28,18,10,0.32)');
		lc.globalCompositeOperation = 'source-atop';
		lc.fillStyle = dusk;
		lc.fillRect(liveDisc.x - liveDisc.r, liveDisc.y - liveDisc.r, liveDisc.r * 2, liveDisc.r * 2);
		lc.restore();
		lc.setTransform(1, 0, 0, 1, 0, 0);
	}
	lc.globalAlpha = 1;
	lc.globalCompositeOperation = 'destination-in';
	lc.drawImage(mask, 0, 0);
	ctx.drawImage(land, 0, 0);

	/** Beginning: Pangaea joins every inland sea into one landmass, then yields to the split coasts. */
	if (pangaea > 0.01) {
		const pan = scratch('pangaea', w, h);
		const pc = pan.getContext('2d')!;
		pc.fillStyle = ground;
		pc.fillRect(0, 0, w, h);
		toSheet(pc, k);
		pc.save();
		livingClip(pc);
		pc.fillStyle = light ? '#e8dcc0' : '#d4c4a4';
		fillPangaea(pc, d);
		pc.restore();
		pc.setTransform(1, 0, 0, 1, 0, 0);
		ctx.save();
		ctx.globalAlpha = pangaea;
		ctx.drawImage(pan, 0, 0);
		ctx.restore();
	}

	if (myth) {
		if (nature && split > 0.25) paintTerrain(ctx, mask, w, h, k);
		if (washes && peoples && mythFade > 0.05) {
			toSheet(ctx, k);
			ctx.save();
			livingClip(ctx);
			ctx.globalAlpha = mythFade;
			drawSpheres(ctx, sp.over, light ? 0.5 : 0.58, sphereBlur * 3);
			ctx.restore();
		}
	}

	/** Highlands and sea depth, under the borders so the lines stay crisp. */
	if (relief) {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.save();
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
		ctx.globalAlpha = light ? 0.9 : 0.8;
		ctx.drawImage(relief.tint, 0, 0, w, h);
		ctx.restore();
	}

	/** Year's own borders on top of the civilization wash, on a layer cut to the coast. */
	if (washes && peoples) {
		const holdings = holdingsAt(year);
		const fillPolities = new Set<string>([...SAMHAN_POLITIES, 'balhae']);
		/** The peninsula frame fills every site the sheet draws, Samhan or not. */
		const everySite = scope === 'samhan';
		const oneSamhan = scope === 'world' || myth;
		const edge = scratch('edge', w, h);
		const ec = edge.getContext('2d')!;
		toSheet(ec, k);
		ec.lineJoin = 'round';
		ec.lineCap = 'round';
		ec.globalAlpha = everySite ? 0.8 : light ? 0.92 : 0.96;
		BORDER_SITES.forEach((site, i) => {
			const hold = holdings[i];
			if (!site.d || !hold.polity || !(everySite || fillPolities.has(hold.polity))) return;
			const c = oneSamhan ? REGION_COLOR.samhan : siteColor(site, hold, year, true);
			ec.fillStyle = c;
			ec.strokeStyle = c;
			ec.lineWidth = 3.2 * u;
			ec.fill(path2d(site.d));
			ec.stroke(path2d(site.d));
		});
		if (!oneSamhan) {
			const samhanColors = new Set<string>([
				...[...fillPolities].map((id) => mapColor(id as PolityId)),
				...Object.values(GAYA_LEAGUES).map((g) => g.color)
			]);
			const samhanLines = borderLinesAt(year, true);
			ec.lineWidth = 6.5 * u;
			ec.globalAlpha = light ? 0.92 : 0.97;
			for (const b of samhanLines.borders) {
				if (!everySite && !samhanColors.has(b.color)) continue;
				ec.strokeStyle = b.color;
				ec.stroke(path2d(b.d));
			}
			if (everySite) {
				ec.strokeStyle = pal.ink;
				ec.lineWidth = 0.5;
				ec.globalAlpha = 0.32;
				ec.stroke(path2d(samhanLines.seams));
			}
		}
		ec.strokeStyle = pal.ink;
		ec.lineWidth = (crispAll ? 2.4 : 1.8) * u;
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
	}

	if (rivers && scope === 'samhan') {
		toSheet(ctx, k);
		ctx.save();
		ctx.globalAlpha = 0.85;
		ctx.strokeStyle = pal.river;
		ctx.lineWidth = 1.1;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		for (const r of RIVERS) {
			ctx.beginPath();
			r.points.forEach(([x, y], n) => {
				const [fx, fy] = fishEye(x, y);
				if (n) ctx.lineTo(fx, fy);
				else ctx.moveTo(fx, fy);
			});
			ctx.stroke();
		}
		ctx.restore();
	}

	if (scope === 'world') {
		toSheet(ctx, k);
		if (washes && peoples) paintNear(ctx, sp);
		if (mythic) paintEastMyth(ctx, k, light);
		if (nature) paintFieldRivers(ctx, k);
	}
	if (myth) {
		if (washes && peoples && mythFade > 0.05) paintPeoples(ctx, sp);
		paintWorlds(ctx, sp, k, light, layout, washes && mythic, deadDisc, mythFade);
		if (mythFade > 0.05) {
			ctx.save();
			ctx.globalAlpha = mythFade;
			paintApproach(ctx, light);
			toSheet(ctx, k);
			if (nature) paintOceanOfLife(ctx, light);
			paintLens(ctx, light);
			ctx.restore();
		}
		toSheet(ctx, k);
		if (mythic) paintEastMyth(ctx, k, light);
		if (nature && mythFade > 0.05) {
			ctx.save();
			ctx.globalAlpha = mythFade;
			paintFieldRivers(ctx, k);
			ctx.restore();
		}
		if (washes && mythic && mythFade > 0.2) paintPathDots(ctx, layout);
		/** The death disc's fill covers the tint. Lay the depth shade back on, outside the lens. */
		if (relief && mythFade > 0.05) {
			toSheet(ctx, k);
			ctx.save();
			const hole = new Path2D();
			hole.addPath(discPath(deadDisc));
			hole.addPath(discPath(liveDisc));
			ctx.clip(hole, 'evenodd');
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.globalAlpha = mythFade;
			ctx.drawImage(relief.tint, 0, 0, w, h);
			ctx.restore();
		}
	}
	/** The hillshade lies over everything, as the light would. */
	if (relief && shade > 0) {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.save();
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
		ctx.globalAlpha = Math.min(1, shade);
		ctx.drawImage(relief.shade, 0, 0, w, h);
		ctx.restore();
	}
	grain(ctx, w, h, light);
	if (myth) discMask(ctx, w, h, viewDiscs(layout, split), k);
	releaseScratch();
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

