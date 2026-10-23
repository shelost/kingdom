/**
 * The 3D map's painted surface: the flat map's own sea and paper land, with the same
 * site washes, Gaya statelet shades, league seams and rivers BorderLayer draws as SVG,
 * painted onto one canvas over the MAP_TERRAIN window. The relief mesh wears it as its
 * texture (realm borders stand up as walls instead; see scenes/map/walls.ts).
 *
 * Everything that never changes (elevation, coastline, the land mask, the base sheet)
 * loads and paints once per page; a year change only repaints the wash.
 */
import { BORDER_SITES, borderLinesAt, holdingsAt, siteColor } from '$lib/borders';
import { MAP_VIEWBOX, RIVERS } from '$lib/places';
import { MAP_TERRAIN, type MapPalette } from '$lib/mapTerrain';

/** Pixels per sheet unit of the painted surface. */
const RES = 2.4;
const W = Math.round(MAP_TERRAIN.w * RES);
const H = Math.round(MAP_TERRAIN.h * RES);
/** The site washes paint at 1/BLUR of the surface and scale up: a soft edge for free. */
const BLUR = 4;

export interface MapGround {
	dem: Int16Array | null;
	/** 1 where a relief vertex sits on the sheet's land. */
	coast: Uint8Array;
	/** The sheet's land at surface resolution (white on transparent). */
	mask: HTMLCanvasElement;
}

function canvas(w: number, h: number): HTMLCanvasElement {
	const c = document.createElement('canvas');
	c.width = w;
	c.height = h;
	return c;
}

/** Draws the sheet's land image onto `ctx` with sheet units mapped by `k` px per unit, origin at the window corner. */
function drawLand(ctx: CanvasRenderingContext2D, land: HTMLImageElement, k: number, half = 0) {
	ctx.setTransform(k, 0, 0, k, -MAP_TERRAIN.x * k + half, -MAP_TERRAIN.y * k + half);
	ctx.drawImage(land, 0, 0, MAP_VIEWBOX.w, MAP_VIEWBOX.h);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

let ground: Promise<MapGround> | null = null;

/** Elevation, coastline grid and land mask, fetched and rasterised once per page. */
export function loadMapGround(): Promise<MapGround> {
	ground ??= Promise.all([
		fetch('/map-terrain.bin')
			.then((r) => (r.ok ? r.arrayBuffer() : null))
			.then((b) => (b ? new Int16Array(b) : null))
			.catch(() => null),
		loadImage('/map-land.svg?v=alpha')
	]).then(([dem, land]) => {
		const { nx, ny } = MAP_TERRAIN;
		const grid = canvas(nx, ny);
		const gc = grid.getContext('2d', { willReadFrequently: true })!;
		drawLand(gc, land, (nx - 1) / MAP_TERRAIN.w, 0.5);
		const px = gc.getImageData(0, 0, nx, ny).data;
		const coast = new Uint8Array(nx * ny);
		for (let i = 0; i < coast.length; i++) coast[i] = px[i * 4 + 3] >= 128 ? 1 : 0;
		const mask = canvas(W, H);
		drawLand(mask.getContext('2d')!, land, RES);
		return { dem, coast, mask };
	});
	ground.catch(() => (ground = null));
	return ground;
}

const paths = new Map<string, Path2D>();
const path2d = (d: string) => {
	let p = paths.get(d);
	if (!p) {
		p = new Path2D(d);
		paths.set(d, p);
	}
	return p;
};

const bases = new Map<string, HTMLCanvasElement>();
/** Sea and paper land, painted once per theme. */
function baseSheet(g: MapGround, pal: MapPalette): HTMLCanvasElement {
	const key = `${pal.sea}${pal.land}`;
	let base = bases.get(key);
	if (base) return base;
	base = canvas(W, H);
	const ctx = base.getContext('2d')!;
	const land = canvas(W, H);
	const lc = land.getContext('2d')!;
	lc.fillStyle = pal.land;
	lc.fillRect(0, 0, W, H);
	lc.globalCompositeOperation = 'destination-in';
	lc.drawImage(g.mask, 0, 0);
	ctx.fillStyle = pal.sea;
	ctx.fillRect(0, 0, W, H);
	ctx.drawImage(land, 0, 0);
	bases.set(key, base);
	return base;
}

const soft = { c: null as HTMLCanvasElement | null };
const wash = { c: null as HTMLCanvasElement | null };

/** Paints `year`'s surface onto `sheet` (sized here); `detail` off paints one colour per kingdom, as the flat map does. */
export function paintMapSurface(sheet: HTMLCanvasElement, year: number, g: MapGround, pal: MapPalette, rivers: boolean, detail = true) {
	if (sheet.width !== W || sheet.height !== H) {
		sheet.width = W;
		sheet.height = H;
	}
	const holdings = holdingsAt(year);

	// The site washes, small then scaled up, so neighbours bleed softly as the SVG blur does.
	soft.c ??= canvas(Math.round(W / BLUR), Math.round(H / BLUR));
	const sc = soft.c.getContext('2d')!;
	const k = RES / BLUR;
	sc.setTransform(1, 0, 0, 1, 0, 0);
	sc.clearRect(0, 0, soft.c.width, soft.c.height);
	sc.setTransform(k, 0, 0, k, -MAP_TERRAIN.x * k, -MAP_TERRAIN.y * k);
	sc.lineWidth = 1.5;
	sc.lineJoin = 'round';
	BORDER_SITES.forEach((site, i) => {
		const hold = holdings[i];
		if (!site.d || !hold.polity) return;
		const c = siteColor(site, hold, year, detail);
		sc.globalAlpha = detail && hold.disputed ? 0.7 : 1;
		sc.fillStyle = c;
		sc.strokeStyle = c;
		sc.fill(path2d(site.d));
		sc.stroke(path2d(site.d));
	});

	wash.c ??= canvas(W, H);
	const ctx = wash.c.getContext('2d')!;
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.globalCompositeOperation = 'source-over';
	ctx.clearRect(0, 0, W, H);
	ctx.globalAlpha = pal.wash;
	ctx.imageSmoothingQuality = 'high';
	ctx.drawImage(soft.c, 0, 0, W, H);

	ctx.setTransform(RES, 0, 0, RES, -MAP_TERRAIN.x * RES, -MAP_TERRAIN.y * RES);
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.globalAlpha = 0.16;
	BORDER_SITES.forEach((site, i) => {
		if (!detail || !site.d || !site.league || holdings[i].polity !== 'gaya') return;
		ctx.fillStyle = siteColor(site, holdings[i], year);
		ctx.fill(path2d(site.d));
	});
	if (rivers) {
		ctx.globalAlpha = 0.8;
		ctx.strokeStyle = pal.river;
		ctx.lineWidth = 0.8;
		for (const r of RIVERS) {
			ctx.beginPath();
			r.points.forEach(([x, y], n) => (n ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
			ctx.stroke();
		}
	}
	ctx.globalAlpha = 0.32;
	ctx.strokeStyle = pal.ink;
	ctx.lineWidth = 0.5;
	ctx.stroke(path2d(borderLinesAt(year, detail).seams));
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.globalAlpha = 1;
	ctx.globalCompositeOperation = 'destination-in';
	ctx.drawImage(g.mask, 0, 0);
	ctx.globalCompositeOperation = 'source-over';

	const out = sheet.getContext('2d')!;
	out.drawImage(baseSheet(g, pal), 0, 0);
	out.drawImage(wash.c, 0, 0);
}
