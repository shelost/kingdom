/**
 * Final Goryeo border, 938, after Tamla.
 * Coastline is Natural Earth 1:10m in the sheet projection.
 * The northern line is the late-Taejo frontier: the Cheongcheon (reached 928,
 * held through Taejo's last years) across to Yeongheung. The Yalu is a later border.
 * Liaodong, west of the Amnok, is Liao. The peninsula north of the line is open.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';

const land10m = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/land-10m.json', import.meta.url)));

const PX = [308.0639, 41.7308, 0.6657, -0.1233, -0.1548, 0.1738];
const PY = [507.4412, -0.6506, -51.5349, -0.1756, -0.0447, 0.1223];

function project(lon, lat) {
	const u = lon - 127;
	const v = lat - 38;
	const f = [1, u, v, u * u, u * v, v * v];
	const dot = (c) => f.reduce((s, t, i) => s + t * c[i], 0);
	return [dot(PX), dot(PY)];
}

/** Cheongcheon mouth, up the river, then across to the coast at Yeongheung. */
const BORDER = [
	[124.85, 39.72],
	[125.2, 39.67],
	[125.55, 39.66],
	[125.9, 39.7],
	[126.25, 39.76],
	[126.6, 39.74],
	[126.95, 39.66],
	[127.3, 39.58],
	[127.75, 39.58]
];

const GORYEO = [
	...BORDER,
	[129.6, 39.58],
	[129.6, 34.95],
	[128.9, 34.65],
	[128.9, 32.85],
	[124.7, 32.85],
	[124.7, 39.72]
];

/** West of the Amnok: Liaodong. The river is the edge, not a ruled box. */
const LIAO = [
	[120.2, 38.4],
	[124.25, 39.85],
	[124.85, 40.35],
	[125.45, 40.75],
	[126.15, 41.25],
	[126.15, 43.6],
	[120.2, 43.6]
];

const AMNOK = [
	[124.3, 39.92],
	[124.85, 40.35],
	[125.45, 40.75],
	[126.15, 41.25],
	[126.9, 41.55]
];

const WINDOW = [120.4, 32.55, 130.4, 43.8];

function clipPoly(points, inside, cut) {
	if (!points.length) return [];
	const out = [];
	let prev = points[points.length - 1];
	let prevIn = inside(prev);
	for (const cur of points) {
		const curIn = inside(cur);
		if (curIn) {
			if (!prevIn) out.push(cut(prev, cur));
			out.push(cur);
		} else if (prevIn) out.push(cut(prev, cur));
		prev = cur;
		prevIn = curIn;
	}
	return out;
}

function clipRect(ring, [minLon, minLat, maxLon, maxLat]) {
	const xAt = (a, b, x) => {
		const t = (x - a[0]) / (b[0] - a[0] || 1e-9);
		return [x, a[1] + t * (b[1] - a[1])];
	};
	const yAt = (a, b, y) => {
		const t = (y - a[1]) / (b[1] - a[1] || 1e-9);
		return [a[0] + t * (b[0] - a[0]), y];
	};
	let pts = ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1] ? ring.slice(0, -1) : ring.slice();
	pts = clipPoly(pts, (p) => p[0] >= minLon, (a, b) => xAt(a, b, minLon));
	pts = clipPoly(pts, (p) => p[0] <= maxLon, (a, b) => xAt(a, b, maxLon));
	pts = clipPoly(pts, (p) => p[1] >= minLat, (a, b) => yAt(a, b, minLat));
	pts = clipPoly(pts, (p) => p[1] <= maxLat, (a, b) => yAt(a, b, maxLat));
	return pts;
}

function pathOf(rings, close = true) {
	let d = '';
	for (const ring of rings) {
		if (ring.length < (close ? 3 : 2)) continue;
		const pts = ring.map(([lon, lat]) => project(lon, lat));
		d += `M${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L')}${close ? 'Z' : ''}`;
	}
	return d;
}

const world = feature(land10m, land10m.objects.land);
const rings = [];
for (const f of world.features) {
	const g = f.geometry;
	const polys = g.type === 'MultiPolygon' ? g.coordinates : g.type === 'Polygon' ? [g.coordinates] : [];
	for (const poly of polys) {
		for (const ring of poly) {
			let hit = false;
			for (let i = 0; i < ring.length; i += 8) {
				const [lon, lat] = ring[i];
				if (lon >= WINDOW[0] && lon <= WINDOW[2] && lat >= WINDOW[1] && lat <= WINDOW[3]) {
					hit = true;
					break;
				}
			}
			if (!hit) continue;
			const clipped = clipRect(ring, WINDOW);
			if (clipped.length >= 3) rings.push(clipped);
		}
	}
}

const land = pathOf(rings);
const goryeo = pathOf([GORYEO]);
const liao = pathOf([LIAO]);
const frontier = pathOf([BORDER], false);
const amnok = pathOf([AMNOK], false);

const north = project(126.2, 41.15);
const south = project(126.5, 32.7);
const west = project(120.9, 40.2);
const east = project(129.45, 36.2);
const gutter = 250;
const frame = {
	x: west[0] - 10,
	y: north[1] - 46,
	w: east[0] - west[0] + 20 + gutter,
	h: south[1] - north[1] + 62
};

const label = (lon, lat, text, anchor = 'start') => {
	const [x, y] = project(lon, lat);
	return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}">${text}</text>`;
};

const legendX = east[0] + 14;
const legendY = north[1] + 24;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame.x.toFixed(1)} ${frame.y.toFixed(1)} ${frame.w.toFixed(1)} ${frame.h.toFixed(1)}">
<title>938 — Goryeo after Tamla. Northern line: the Cheongcheon to Yeongheung.</title>
<rect x="${frame.x.toFixed(1)}" y="${frame.y.toFixed(1)}" width="${frame.w.toFixed(1)}" height="${frame.h.toFixed(1)}" fill="#d6e0f2"/>
<text class="title" x="${(legendX).toFixed(1)}" y="${(frame.y + 28).toFixed(1)}">938</text>
<text class="sub" x="${(legendX).toFixed(1)}" y="${(frame.y + 46).toFixed(1)}">Goryeo, after Tamla</text>
<clipPath id="land"><path d="${land}"/></clipPath>
<clipPath id="goryeo"><path d="${goryeo}"/></clipPath>
<clipPath id="liao"><path d="${liao}"/></clipPath>
<g clip-path="url(#land)">
<rect x="${frame.x.toFixed(1)}" y="${frame.y.toFixed(1)}" width="${frame.w.toFixed(1)}" height="${frame.h.toFixed(1)}" fill="#f3eadc"/>
<g clip-path="url(#goryeo)"><rect x="${frame.x.toFixed(1)}" y="${frame.y.toFixed(1)}" width="${frame.w.toFixed(1)}" height="${frame.h.toFixed(1)}" fill="#9b2c2c"/></g>
<g clip-path="url(#liao)"><rect x="${frame.x.toFixed(1)}" y="${frame.y.toFixed(1)}" width="${frame.w.toFixed(1)}" height="${frame.h.toFixed(1)}" fill="#8a6232"/></g>
</g>
<path d="${land}" fill="none" stroke="#2a2420" stroke-width="0.7" stroke-linejoin="round"/>
<path d="${amnok}" fill="none" stroke="#2f6f9a" stroke-width="1.1" stroke-linecap="round"/>
<path d="${frontier}" fill="none" stroke="#1a120c" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
<g class="place" fill="#1a120c">
${label(126.57, 37.97, 'Gaegyeong')}
${label(125.75, 39.02, 'Seogyeong')}
${label(127.05, 35.72, 'Wansan')}
${label(129.22, 35.95, 'Seorabeol')}
${label(126.53, 33.42, 'Tamla')}
${label(125.35, 39.82, 'Cheongcheon')}
${label(127.85, 39.5, 'Yeongheung')}
${label(127.45, 40.15, 'the marches')}
</g>
<g class="legend" transform="translate(${legendX.toFixed(1)} ${legendY.toFixed(1)})">
<rect width="12" height="12" fill="#9b2c2c"/><text x="18" y="10">Goryeo</text>
<rect y="22" width="12" height="12" fill="#8a6232"/><text x="18" y="32">Liao</text>
<rect y="44" width="12" height="12" fill="#f3eadc" stroke="#2a2420" stroke-width="0.6"/><text x="18" y="54">open north</text>
<text class="note" y="84">Cheongcheon to Yeongheung.</text>
<text class="note" y="98">Held from 928 through</text>
<text class="note" y="112">the end of Taejo.</text>
<text class="note" y="126">The Yalu is later.</text>
<text class="note" y="140">Coast: Natural Earth 1:10m.</text>
</g>
<style>
text { font-family: Palatino, Georgia, serif; font-size: 11px; }
.title { font-size: 22px; font-weight: 700; }
.sub { font-size: 14px; }
.place { font-size: 11px; }
.legend text { font-size: 12px; }
.note { font-size: 10px; fill: #3a342c; }
</style>
</svg>
`;

const out = new URL('../static/maps/god-king/938.svg', import.meta.url);
writeFileSync(out, svg);
console.log({ rings: rings.length, land: land.length, frame });
