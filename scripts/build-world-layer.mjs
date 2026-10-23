#!/usr/bin/env node
/**
 * The world around the sheet, for zoomed-out maps:
 *
 * - static/map-world.json: every non-Korean polity Cliopatria (via the marble repo)
 *   draws between YEAR_MIN and YEAR_MAX within reach of the peninsula — the Chinese
 *   dynasties, the steppe khaganates, Yamato — projected with the sheet's own fit.
 *   Korean polities stay with the hand-dated sites in borders.ts.
 * - static/map-outer-land.svg: Natural Earth land, white on transparent, in MAP_OUTER,
 *   the luminance mask that clips those polities to the coast.
 * - src/lib/data/rivers-ne.json: Natural Earth 1:10m centerlines for the rivers the
 *   book names (lon/lat, source → mouth), plus the great rivers beyond the sheet.
 *
 *   node scripts/build-world-layer.mjs [path/to/marble]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { MAP_OUTER } from '../src/lib/places.ts';
import { YEAR_MAX, YEAR_MIN, project } from '../src/lib/borders.ts';

const MARBLE = process.argv[2] ?? '../marble';
const DATA = `${MARBLE}/static/data`;
const NE_RIVERS = 'scripts/.cache/ne/ne_10m_rivers_lake_centerlines.geojson';
/** lon/lat window, matching scripts/build-outer-land.mjs. */
const LON = [100, 150];
const LAT = [18, 58];
/** Drop points closer than this to the last kept one (sheet units). */
const STEP = 3;

/** Korean polities: the sites in borders.ts already date these, more finely. */
const KOREAN = new Set([
	'Gojoseon', 'Korean Jin', 'Byeonhan', 'Dongye', 'Jinhan', 'Mahan', 'Goguryeo', 'Dong-okjeo', 'Tamna',
	'Baekje', 'Silla', 'Unified Silla', 'Balhae', 'Hubaekje', 'Taebong', 'Goryeo', 'Buyeo'
]);

/** Book names (en, ko) where Cliopatria's or Wikidata's do not suit; the West and the East follow the book. */
const NAMES = {
	Qin: ['Qin', '진'], Yan: ['Yan', '연'], Qi: ['Qi', '제'], Zhao: ['Zhao', '조'], Wei: ['Wei', '위'], Han: ['Han', '한'],
	Chu: ['Chu', '초'], Song: ['Song', '송'], Lu: ['Lu', '노'], Zhongshan: ['Zhongshan', '중산'], Wey: ['Wey', '위'],
	'Qin Dynasty': ['Qin', '진'], 'Han Dynasty': ['Han', '한'], 'Xin Dynasty': ['Xin', '신'], 'Western Chu': ['Western Chu', '서초'],
	Xiongnu: ['Xiongnu', '흉노'], 'Southern Xiongnu': ['Southern Xiongnu', '남흉노'], Xianbei: ['Xianbei', '선비'],
	'Cao Cao': ['Cao Cao', '조조'], 'Cao Wei': ['Wei', '위'], 'Eastern Wu': ['Wu', '오'], 'Shu Han': ['Shu', '촉'],
	'Western Jin': ['Jin', '진'], 'Former Zhao': ['Former Zhao', '전조'], 'Later Zhao': ['Later Zhao', '후조'],
	'Former Yan': ['Former Yan', '전연'], 'Former Qin': ['Former Qin', '전진'], 'Later Yan': ['Later Yan', '후연'],
	'Western Yan': ['Western Yan', '서연'], 'Southern Yan': ['Southern Yan', '남연'], 'Northern Yan': ['Northern Yan', '북연'],
	'Later Qin': ['Later Qin', '후진'], 'Northern Wei': ['Northern Wei', '북위'], 'Rouran Khaganate': ['Rouran', '유연'],
	Xia: ['Xia', '하'], 'Liu Song Dynasty': ['Song', '송'], 'Southern Qi': ['Qi', '제'], 'Liang Dynasty': ['Liang', '양'],
	'Eastern Wei': ['Eastern Wei', '동위'], 'Western Wei': ['Western Wei', '서위'], 'Northern Qi': ['Northern Qi', '북제'],
	'Northern Zhou': ['Northern Zhou', '북주'], 'Chen Dynasty': ['Chen', '진'], 'Later Western Liang': ['Later Liang', '후량'],
	'Göktürk Khaganate': ['Göktürks', '돌궐'], 'Eastern Göktürks': ['Eastern Göktürks', '동돌궐'],
	'Sui Dynasty': ['the West', '서국'], 'Tang Dynasty': ['the West', '서국'], 'Gao Kaidao': ['Gao Kaidao', '고개도'],
	'Asuka Japan': ['the East', '동국'], 'Nara Japan': ['the East', '동국'], 'Heian Japan': ['the East', '동국'],
	'Türgesh': ['Türgesh', '돌기시'], 'Uyghur Khaganate': ['Uyghurs', '위구르'], Minyue: ['Minyue', '민월'], Nanyue: ['Nanyue', '남월']
};

const kindOf = (name) =>
	/Japan|Yamato/.test(name) ? 'east' : /Xiongnu|Xianbei|Rouran|Göktürk|Türgesh|Uyghur|Khaganate/.test(name) ? 'steppe' : 'west';

const inWindow = ([lon, lat]) => lon >= LON[0] - 5 && lon <= LON[1] + 5 && lat >= LAT[0] - 5 && lat <= LAT[1] + 5;
const clampProject = ([lon, lat]) =>
	project(Math.min(Math.max(lon, LON[0]), LON[1]), Math.min(Math.max(lat, LAT[0]), LAT[1]));
const fmt = (n) => (Math.round(n * 10) / 10).toString();

function ringPath(ring, step = STEP) {
	if (!ring.some(inWindow)) return '';
	const pts = ring.map(clampProject);
	const kept = [pts[0]];
	for (const p of pts) {
		const q = kept[kept.length - 1];
		if (Math.hypot(p[0] - q[0], p[1] - q[1]) >= step) kept.push(p);
	}
	if (kept.length < 3) return '';
	return `M${kept.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join('L')}Z`;
}

const polygons = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);

/* —————————— polities —————————— */
if (!existsSync(`${DATA}/index.json`)) throw new Error(`marble data not found at ${DATA}`);
const index = JSON.parse(readFileSync(`${DATA}/index.json`, 'utf8'));
const names = [];
const nameIndex = new Map();
const rows = [];
/** Consecutive spans often repeat an outline: store each once. */
const shapes = [];
const shapeIndex = new Map();
for (const chunk of index.chunks) {
	if (chunk.to < YEAR_MIN || chunk.from > YEAR_MAX) continue;
	const topo = JSON.parse(readFileSync(`${DATA}/${chunk.file}`, 'utf8'));
	for (const f of feature(topo, topo.objects.rows).features) {
		const { p, f: from, t: to, a, l } = f.properties;
		const pol = index.polities[p];
		if (!pol || KOREAN.has(pol.name) || to < YEAR_MIN || from > YEAR_MAX) continue;
		const d = polygons(f.geometry).flatMap((rings) => rings.map((r) => ringPath(r))).join('');
		if (!d) continue;
		if (!nameIndex.has(pol.name)) {
			const [en, ko] = NAMES[pol.name] ?? [pol.name.replace(/ Dynasty$/, ''), pol.ko ?? pol.name];
			nameIndex.set(pol.name, names.length);
			names.push({ en, ko, kind: kindOf(pol.name) });
		}
		const [lx, ly] = l && inWindow(l) ? clampProject(l) : [null, null];
		if (!shapeIndex.has(d)) {
			shapeIndex.set(d, shapes.length);
			shapes.push(d);
		}
		rows.push({ n: nameIndex.get(pol.name), f: from, t: to, a: Math.round(a ?? 0), l: lx === null ? null : [+fmt(lx), +fmt(ly)], s: shapeIndex.get(d) });
	}
}
const out = JSON.stringify({ names, shapes, rows });
writeFileSync('static/map-world.json', out);
console.log(`map-world.json: ${names.length} polities, ${rows.length} rows, ${shapes.length} shapes, ${(out.length / 1024).toFixed(0)} KB`);

/* —————————— land mask —————————— */
const landTopo = JSON.parse(readFileSync('node_modules/world-atlas/land-50m.json', 'utf8'));
const land = feature(landTopo, landTopo.objects.land);
const landD = land.features.flatMap((f) => polygons(f.geometry)).flatMap((rings) => rings.map((r) => ringPath(r, 0.8))).join('');
const { x, y, w, h } = MAP_OUTER;
writeFileSync(
	'static/map-outer-land.svg',
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="none">` +
		`<path fill-rule="evenodd" fill="#fff" d="${landD}"/></svg>\n`
);
console.log(`map-outer-land.svg: ${(landD.length / 1024).toFixed(0)} KB of path`);

/* —————————— rivers —————————— */
if (existsSync(NE_RIVERS)) {
	const ne = JSON.parse(readFileSync(NE_RIVERS, 'utf8'));
	/** book river id ← Natural Earth names, joined source → mouth */
	const BOOK = { amnok: ['Yalu'], duman: ['Tumen'], liao: ['Liao'], han: ['Namhan', 'Han'], nakdong: ['Nakdong'] };
	/** Where each book river meets the sea, so every line runs source → mouth. */
	const MOUTH = { amnok: [124.35, 40.0], duman: [130.7, 42.3], liao: [122.15, 40.7], han: [126.6, 37.7], nakdong: [128.95, 35.1] };
	/** Book rivers are the peninsula's own; pieces outside it (China's Han) are other rivers. */
	const inBook = ([lon, lat]) => lon >= 120 && lon <= 132 && lat >= 33 && lat <= 46;
	const OUTER = ['Yellow', 'Luan', 'Daling', 'Di’er Songhua', 'Xiliao'];
	const lines = (name) =>
		ne.features
			.filter((f) => (f.properties.name_en ?? f.properties.name) === name)
			.flatMap((f) => (f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates))
			.filter((l) => l.some(inWindow));
	/** Chain a river's pieces into one line, growing from whichever end a piece touches; then round to ~100 m. */
	function chain(parts) {
		const left = parts.map((p) => [...p]);
		if (!left.length) return [];
		const gap = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
		let line = left.shift();
		while (left.length) {
			const head = line[0];
			const tail = line[line.length - 1];
			let best = { d: Infinity, i: 0, atTail: true, flip: false };
			left.forEach((p, i) => {
				const s = p[0];
				const e = p[p.length - 1];
				for (const c of [
					{ d: gap(s, tail), i, atTail: true, flip: false },
					{ d: gap(e, tail), i, atTail: true, flip: true },
					{ d: gap(e, head), i, atTail: false, flip: false },
					{ d: gap(s, head), i, atTail: false, flip: true }
				])
					if (c.d < best.d) best = c;
			});
			const piece = left.splice(best.i, 1)[0];
			const next = best.flip ? piece.reverse() : piece;
			line = best.atTail ? line.concat(next) : next.concat(line);
		}
		return line.map(([lon, lat]) => [Math.round(lon * 1000) / 1000, Math.round(lat * 1000) / 1000]);
	}
	const book = Object.fromEntries(
		Object.entries(BOOK)
			.map(([id, nm]) => {
				const line = chain(nm.flatMap(lines).filter((l) => l.every(inBook)));
				const m = MOUTH[id];
				const near = (p) => Math.hypot(p[0] - m[0], p[1] - m[1]);
				return [id, line.length && near(line[0]) < near(line[line.length - 1]) ? line.reverse() : line];
			})
			.filter(([, pts]) => pts.length > 1)
	);
	const outer = OUTER.flatMap((nm) =>
		lines(nm).map((l) => l.map(clampProject).map(([px, py]) => [+fmt(px), +fmt(py)]))
	);
	writeFileSync('src/lib/data/rivers-ne.json', JSON.stringify({ book, outer }));
	console.log(`rivers-ne.json: ${Object.keys(book).join(', ')} + ${outer.length} outer lines`);
} else {
	console.log(`skipped rivers: ${NE_RIVERS} missing`);
}
