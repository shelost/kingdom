#!/usr/bin/env node
/**
 * static/map-cosmos.json: the known world around Samhan for the 3D map's widest
 * view, in the sheet's units through the projection of src/lib/cosmos.ts.
 *
 * - Polities: Cliopatria (Seshat Global History Databank; Chalstrey, Bennett & Mutch,
 *   CC BY 4.0), read from the marble repo's simplified copy. Kept: the years the stage
 *   shows (the Han age, and 400–760), states of 40,000 km² and up, sorted into the
 *   regions Samhan named (the Western Court, Wa, the Northern Plains, India, Persia,
 *   Rome, the Southern Sea). Korean polities stay with the sheet's own dated sites.
 * - Land: Natural Earth 1:50m (public domain) via world-atlas.
 *
 * Outlines thin with distance from the peninsula (Douglas–Peucker), and paths are
 * relative integer moves, so the file stays small.
 *
 *   node scripts/build-cosmos-layer.mjs [path/to/marble]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { cosmosProject } from '../src/lib/cosmos.ts';

const MARBLE = process.argv[2] ?? '../marble';
const DATA = `${MARBLE}/static/data`;
const OUT = 'static/map-cosmos.json';
/** Year spans the stage can open on. */
const SPANS = [
	[-60, 40],
	[400, 760]
];
const MIN_AREA = 40000;
/** Lon/lat clamp: west of the Atlantic is the mythic land (cosmos.ts WEST_LANDS); the Arctic coast is kept. */
const LON = [-40, 182];
const LAT = [-48, 82];
/** The peninsula, in sheet units: outlines are finest here. */
const HOME = [300, 500];

const KOREAN = new Set([
	'Gojoseon', 'Korean Jin', 'Byeonhan', 'Dongye', 'Jinhan', 'Mahan', 'Goguryeo', 'Dong-okjeo', 'Tamna',
	'Baekje', 'Silla', 'Unified Silla', 'Balhae', 'Hubaekje', 'Taebong', 'Goryeo', 'Buyeo'
]);
const AFRICA = /Axum|Kush|Makuria|Nobatia|Alodia|Vandal|Ptolemaic|Kharij/;
const STEPPE = /Xiongnu|Xianbei|Rouran|Göktürk|Türgesh|Turks$|Uyghur|Khaganate|Kyrgyz|Wusun|Yuezhi|Huns|Hunnic|Xionites|Kidarites|Hephthal|Khazar|Bulgaria|Tuyuhun|Great Yuan/;
const SEA = /Funan|Chenla|Ch[aá]mpa|Srivijaya|Tarumanagara|Pyu|Lavo|Haripu|Sunda|Galuh|Lý|Dvaravati/;
const ROME = /Roman|Byzantine|Judea|Ghassanid|Pontus|Cappadocia|Galatia|Thracian|Greek City|Bosporus|Nabataean/;
const PERSIA = /Sasanian|Parthian|Rashidun|Umayyad|Dabuyid|Balasagan|Lakhmid|Armenia|Iberia|Albania|Lazica|Georgia|Adiabene|Gordyene|Osroene|Sophene|Commagene|Himyar|Hadhramaut|Saba|Minae/;

/** The cosmological region a polity belongs to; null drops it. */
function regionOf(name, [lon, lat]) {
	if (KOREAN.has(name) || AFRICA.test(name)) return null;
	if (/Japan|Yamato/.test(name)) return 'wa';
	if (/^Tibet/.test(name)) return 'tibet';
	if (/Nanzhao/.test(name)) return 'other';
	if (STEPPE.test(name)) return 'nomads';
	if (name === 'Protectorate of the Western Regions') return 'hwa';
	if (SEA.test(name) || (lat < 22 && lon >= 92 && lon <= 135)) return 'sea';
	if (ROME.test(name)) return 'rome';
	if (PERSIA.test(name)) return 'persia';
	if (lon >= 97 && lon <= 135) return 'hwa';
	if (lon >= 60 && lon < 97 && lat < 37) return 'india';
	if (lon >= 35 && lon < 66 && lat >= 12) return 'persia';
	if (lon >= 19 && lon < 35 && lat >= 30 && lat < 46) return 'rome';
	return null;
}

/**
 * Names Samhan used, by source name: [en, ko, hanja?, tag?]. A tag puts the polity's own
 * label on the map (src/lib/cosmos.ts COSMOS_LABELS); the rest name the dynasty under a
 * court's label, where a court's label shows one.
 */
const TURKS = ['The Turks', '돌궐', '突厥', 'turks'];
const NAMES = {
	'Han Dynasty': ['Han', '한'], 'Xin Dynasty': ['Xin', '신'], 'Northern Wei': ['Northern Wei', '북위'],
	'Liu Song Dynasty': ['Song', '송'], 'Southern Qi': ['Qi', '제'], 'Liang Dynasty': ['Liang', '양'],
	'Eastern Wei': ['Eastern Wei', '동위'], 'Western Wei': ['Western Wei', '서위'], 'Northern Qi': ['Northern Qi', '북제'],
	'Northern Zhou': ['Northern Zhou', '북주'], 'Chen Dynasty': ['Chen', '진'], 'Sui Dynasty': ['Sui', '수'], 'Tang Dynasty': ['Tang', '당'],
	'Asuka Japan': ['Yamato', '야마토'], 'Nara Japan': ['Yamato', '야마토'],
	Xiongnu: ['Xiongnu', '흉노'], 'Rouran Khaganate': ['Rouran', '유연'], 'Göktürk Khaganate': TURKS, Göktürks: TURKS, Turks: TURKS,
	'Eastern Göktürks': ['The Eastern Turks', '동돌궐', '東突厥', 'turks'], 'Western Göktürks': ['The Western Turks', '서돌궐', '西突厥', 'turks'],
	'Türgesh': ['Türgesh', '돌기시', '突騎施', 'turks'], Tibet: ['Tibet', '토번', '吐蕃', 'tibet'],
	'Gupta Empire': ['Gupta', '굽타'], "Harsha's Empire": ['Harsha', '하르샤'], 'Chalukya Dynasty': ['Chalukya', '찰루키아'],
	'Satavahana Dynasty': ['Satavahana', '사타바하나'],
	'Parthian Empire': ['Parthia', '파르티아'], 'Sasanian Empire': ['Sasanian', '사산'],
	'Rashidun Caliphate': ['the Caliphate', '칼리파국'], 'Umayyad Caliphate': ['the Caliphate', '칼리파국'],
	'Abbasid Caliphate': ['the Caliphate', '칼리파국'],
	'Roman Empire': ['Rome', '로마'], 'Eastern Roman Empire': ['Eastern Rome', '동로마'], 'Byzantine Empire': ['Eastern Rome', '동로마'],
	'Western Roman Empire': ['Western Rome', '서로마'],
	Funan: ['Funan', '부남'], Chenla: ['Chenla', '진랍'], Srivijaya: ['Srivijaya', '스리비자야'], 'Tibetan Empire': ['Tibet', '토번', '吐蕃', 'tibet']
};

/**
 * The source names the Second Turkic Khaganate's Mongolian heartland (682–744) "Türgesh",
 * the western tribes' name; on the Orkhon it is the Turks again.
 */
const sourceName = (name, [lon]) => (name === 'Türgesh' && lon > 90 ? 'Turks' : name);

const clampLL = ([lon, lat]) => [Math.min(Math.max(lon, LON[0]), LON[1]), Math.min(Math.max(lat, LAT[0]), LAT[1])];
const inReach = ([lon, lat]) => lon >= LON[0] - 8 && lon <= LON[1] && lat >= LAT[0] - 8 && lat <= LAT[1] + 8;

/** Tolerance in sheet units: fine by the peninsula, coarse at the world's edge. */
const tolAt = ([x, y]) => 0.9 + Math.hypot(x - HOME[0], y - HOME[1]) * 0.0042;

/** Douglas–Peucker on a closed ring: split at the point farthest from the start, so the chord is never zero. */
function simplify(pts) {
	if (pts.length < 4) return pts;
	const keep = new Uint8Array(pts.length);
	let split = 0;
	let reach = -1;
	pts.forEach(([x, y], i) => {
		const d = Math.hypot(x - pts[0][0], y - pts[0][1]);
		if (d > reach) {
			reach = d;
			split = i;
		}
	});
	keep[0] = keep[split] = keep[pts.length - 1] = 1;
	const stack = [
		[0, split],
		[split, pts.length - 1]
	];
	while (stack.length) {
		const [a, b] = stack.pop();
		const [ax, ay] = pts[a];
		const [bx, by] = pts[b];
		const len = Math.hypot(bx - ax, by - ay) || 1e-9;
		let far = -1;
		let best = 0;
		for (let i = a + 1; i < b; i++) {
			const [px, py] = pts[i];
			const d = Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / len;
			const excess = d - tolAt(pts[i]);
			if (excess > best) {
				best = excess;
				far = i;
			}
		}
		if (far > 0) {
			keep[far] = 1;
			stack.push([a, far], [far, b]);
		}
	}
	return pts.filter((_, i) => keep[i]);
}

/** One ring as relative integer moves ("M x,y l dx,dy …z"); empty when it thins to nothing. */
function ringPath(ring) {
	if (!ring.some(inReach)) return '';
	const pts = simplify(ring.map((p) => cosmosProject(...clampLL(p))).map(([x, y]) => [Math.round(x), Math.round(y)]));
	const out = [];
	let [px, py] = pts[0];
	for (let i = 1; i < pts.length; i++) {
		const [x, y] = pts[i];
		if (x === px && y === py) continue;
		out.push(`${x - px},${y - py}`);
		[px, py] = [x, y];
	}
	if (out.length < 2) return '';
	return `M${pts[0][0]},${pts[0][1]}l${out.join(' ')}z`;
}

const polygons = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);
const overlaps = (f, t) => SPANS.some(([a, b]) => t >= a && f <= b);

/* —————————— polities —————————— */
if (!existsSync(`${DATA}/index.json`)) throw new Error(`marble data not found at ${DATA}`);
const index = JSON.parse(readFileSync(`${DATA}/index.json`, 'utf8'));
const names = [];
const nameIndex = new Map();
const shapes = [];
const shapeIndex = new Map();
const rows = [];
for (const chunk of index.chunks) {
	if (!SPANS.some(([a, b]) => chunk.to >= a && chunk.from <= b)) continue;
	const topo = JSON.parse(readFileSync(`${DATA}/${chunk.file}`, 'utf8'));
	for (const f of feature(topo, topo.objects.rows).features) {
		const { p, f: from, t: to, a, l } = f.properties;
		const pol = index.polities[p];
		if (!pol || !l || (a ?? 0) < MIN_AREA || !overlaps(from, to)) continue;
		const name = sourceName(pol.name, l);
		const region = regionOf(name, l);
		if (!region) continue;
		const d = polygons(f.geometry)
			.flatMap((rings) => rings.map(ringPath))
			.join('');
		if (!d) continue;
		if (!nameIndex.has(name)) {
			const [en, ko, h, g] = NAMES[name] ?? [name.replace(/ Dynasty$/, ''), pol.ko ?? name];
			nameIndex.set(name, names.length);
			names.push({ en, ko, r: region, ...(h && { h }), ...(g && { g }) });
		}
		if (!shapeIndex.has(d)) {
			shapeIndex.set(d, shapes.length);
			shapes.push(d);
		}
		rows.push([nameIndex.get(name), from, to, Math.round(a / 1000), shapeIndex.get(d)]);
	}
}

/* —————————— land —————————— */
const landTopo = JSON.parse(readFileSync('node_modules/world-atlas/land-50m.json', 'utf8'));
const land = feature(landTopo, landTopo.objects.land)
	.features.flatMap((f) => polygons(f.geometry))
	.flatMap((rings) => rings.map(ringPath))
	.join('');

const out = JSON.stringify({
	source: 'Cliopatria v0.2.1 (Seshat Global History Databank, CC BY 4.0) · Natural Earth 1:50m land (public domain)',
	names,
	shapes,
	rows,
	land
});
writeFileSync(OUT, out);
console.log(
	`${OUT}: ${names.length} polities, ${rows.length} rows, ${shapes.length} shapes, land ${(land.length / 1024).toFixed(0)} KB, total ${(out.length / 1024).toFixed(0)} KB`
);
