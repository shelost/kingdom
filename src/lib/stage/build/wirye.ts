import { fbm, noise, smoothstep, distanceToPath, chaikin, resample, type P2, type Bounds } from './geo';
import { at, box, hall, gate, court, rampart, stoneWall, gateOnWall, type Cloth } from './kit';
import { bump, type Ground } from './terrain';
import { lerp, mountainField, pick, contourRing, riverStrip, gridTown, startSite, assemble, bankCover, scatterTrees, scatterCover } from './common';
import { munru, wallBanners, bastions, outwardOf, hamlet } from './fortress';
import { reach } from './life';
import { Folk, type Dress } from './people';
import type { BuildOptions, SiteBuild, View } from './types';

/*
 * The Han Fortress (한성), the seat on the Han that three kingdoms held in turn.
 *
 * - Baekje's Wirye (to 475): the oval earthen city on the flat bank (Pungnap) and the fort on the
 *   hill (Mongchon), with the chronicle board's tan wall, red two-tier gate and yellow banners.
 * - Goguryeo's Hanseong (475–552): Jangsu burns the river city; Goguryeo holds the hill fort
 *   (its pottery is found there) under red banners, and rings the ridge across the river with
 *   the Achasan redoubts.
 * - Silla's (from 553): blue banners on the hill fort, and Jinheung's tour stele on the northern peak.
 */

const PLAIN = 14;
const WATER = 6;
const BED = -2;
const WALL_H = 6;

const HAN: P2[] = [
	[6000, 520],
	[3000, 260],
	[1500, 90],
	[600, 10],
	[-400, 40],
	[-1600, 260],
	[-3200, 600],
	[-6000, 900]
];
const HAN_HALF = 280;
const BLUFF = { x: 620, z: -600 };
/** The oval earthen city on the south bank: centre, radii, rotation. */
const CITY = { x: -700, z: 790, rx: 640, rz: 230, rot: 0.12 };

const mountains = mountainField([
	{ x: 1500, z: -2500, rx: 1100, rz: 900, h: 560, seed: 1.4 },
	{ x: -900, z: -2300, rx: 1300, rz: 800, h: 300, seed: 2.9 },
	{ x: 3200, z: -1300, rx: 1300, rz: 1000, h: 380, seed: 3.3 },
	{ x: 2600, z: 2600, rx: 1700, rz: 1200, h: 340, seed: 4.4 },
	{ x: -2600, z: 3000, rx: 2000, rz: 1100, h: 300, seed: 5.1 },
	{ x: -5600, z: -2600, rx: 2800, rz: 2400, h: 640, seed: 6.2 },
	{ x: 6400, z: -3600, rx: 3200, rz: 2600, h: 820, seed: 7.7 }
]);

function bluff(x: number, z: number): number {
	const f = bump(x, z, BLUFF.x, BLUFF.z, 440, 330);
	return f > 0 ? Math.pow(f, 0.6) * 74 * (0.86 + 0.28 * fbm(x / 110, z / 110, 3)) : 0;
}

const han = (x: number, z: number) => distanceToPath(HAN, x, z);

/** Signed distance-ish measure: below 1 inside the oval city. */
function cityAt(x: number, z: number): number {
	const c = Math.cos(CITY.rot);
	const s = Math.sin(CITY.rot);
	const lx = (x - CITY.x) * c + (z - CITY.z) * s;
	const lz = -(x - CITY.x) * s + (z - CITY.z) * c;
	return Math.hypot(lx / CITY.rx, lz / CITY.rz);
}

function makeGround(): Ground {
	const height = (x: number, z: number) => {
		let y = PLAIN + fbm(x / 400, z / 400) * 1.4 + mountains(x, z) + bluff(x, z);
		const d = han(x, z);
		if (d < HAN_HALF + 120) y = Math.min(y, lerp(BED, PLAIN + 40, smoothstep(HAN_HALF - 40, HAN_HALF + 110, d)));
		return y;
	};
	const fields = ['#9cb35b', '#a8b862', '#93ac55', '#b4bb68', '#c2bf73'];
	const color = (x: number, z: number, y: number, slope: number): string => {
		const n = noise(x / 37, z / 37);
		if (han(x, z) < HAN_HALF + 26 && y < PLAIN - 1) return y < WATER ? '#8a8468' : '#d8cba2';
		const rise = mountains(x, z) + bluff(x, z);
		if (slope > 0.5) return pick(['#9a7f62', '#a98d6b', '#8c745a'], (n + 1) / 2);
		if (rise > 8) return pick(['#55703c', '#617a43', '#4d6838', '#6b844b'], (n + 1) / 2);
		if (cityAt(x, z) < 0.95) return n > 0.2 ? '#aaa679' : '#a19f70';
		if (slope < 0.06) {
			const cx = Math.floor((x + 13) / 52);
			const cz = Math.floor((z - 7) / 32);
			return pick(fields, Math.abs(Math.sin(cx * 12.9898 + cz * 78.233) * 43758.5453) % 1);
		}
		return n > 0 ? '#8aa858' : '#809f51';
	};
	const cover = (x: number, z: number, _y: number, slope: number): number => {
		const rise = mountains(x, z) + bluff(x, z);
		if (rise < 8 || slope > 0.5) return 0;
		if (bluff(x, z) > 46) return 0;
		return smoothstep(8, 40, rise);
	};
	return { height, color, cover };
}

const NEAR: Bounds = { minX: -1700, maxX: 1700, minZ: -1500, maxZ: 1500 };

type Holder = { dress: Dress; cloth: Cloth; city: boolean; red: boolean };

function holder(year: number): Holder {
	if (year < 475) return { dress: 'baekje', cloth: 'yellow', city: true, red: true };
	if (year < 553) return { dress: 'goguryeo', cloth: 'wallRed', city: false, red: true };
	return { dress: 'silla', cloth: 'blue', city: false, red: false };
}

/** The Achasan redoubts (보루): small stone rings on the ridge north of the river, Goguryeo's. */
const REDOUBTS: P2[] = [
	[1250, -1250],
	[1560, -1480],
	[1880, -1340],
	[2150, -1560]
];
/** Bukhansan's peak to the north, where Jinheung set his stele. */
const STELE: P2 = [1500, -2500];

function redoubt(b: Parameters<typeof stoneWall>[0], g: Ground, x: number, z: number, r: number, cloth: Cloth): void {
	const ring: P2[] = [];
	for (let i = 0; i < 20; i++) {
		const a = (i / 20) * Math.PI * 2;
		ring.push([x + Math.cos(a) * r, z + Math.sin(a) * r * 0.8]);
	}
	const out = outwardOf(ring);
	stoneWall(b, ring, g.height, { h: 3.2, t: 2.6, closed: true, outward: out, gaps: [{ at: ring[5], half: 2.2 }], step: 3 });
	wallBanners(b, ring, g.height, cloth, 14, { h: 3.2, closed: true, outward: out });
	const y = g.height(x, z);
	hall(b, at(x, y, z), { bays: [3, 3.4, 3], depth: [3, 3], colH: 2.8, base: 0.4, roof: { tile: 'tileRed' } });
}

export function buildWirye(opts: BuildOptions): SiteBuild {
	const who = holder(opts.year);
	const g = makeGround();
	const s = startSite('wirye', g, { near: NEAR, cell: 6, far: 22000, farCell: 110, center: [0, 0], seed: 18, palette: { redTiles: who.dress === 'goguryeo', lit: opts.light === 'night' } });
	const { b, forest, town, cover, labels, rand } = s;

	riverStrip(b, HAN, HAN_HALF * 2 + 60, WATER);

	// the bluff fort: a rammed-earth wall round the top, the red gate facing the river
	const ring = contourRing(g.height, BLUFF.x, BLUFF.z, PLAIN + 50, 600, 96);
	const out = outwardOf(ring);
	const south = ring.reduce((best, p) => (p[1] > best[1] ? p : best), ring[0]);
	const west = ring.reduce((best, p) => (p[0] < best[0] ? p : best), ring[0]);
	stoneWall(b, ring, g.height, { h: WALL_H, t: 4.4, closed: true, outward: out, gaps: [{ at: south, half: 13 }, { at: west, half: 7 }], step: 4, mat: 'earth' });
	bastions(b, ring, g.height, 60, { h: WALL_H, closed: true, outward: out, size: 7, mat: 'earth', lookout: 2, t: 4.4, skip: (x, z) => Math.hypot(x - south[0], z - south[1]) < 34 || Math.hypot(x - west[0], z - west[1]) < 16 });
	wallBanners(b, ring, g.height, who.cloth, 26, { h: WALL_H, closed: true, outward: out, skip: (x, z) => Math.hypot(x - south[0], z - south[1]) < 18 });
	const rot = gateOnWall(ring, south, { closed: true, outward: out }).rot;
	const gy = g.height(south[0], south[1]) - 0.6;
	const main = munru(b, at(south[0], gy, south[1], rot), {
		block: { w: 26, d: 11, h: WALL_H + 1.6, arch: 5, stone: 'courses' },
		storeys: 2,
		red: who.red,
		bays: [3.6, 4.2, 4.6, 4.2, 3.6],
		depth: [3.4, 3.4],
		colH: 4
	});
	munru(b, at(west[0], g.height(west[0], west[1]) - 0.4, west[1], gateOnWall(ring, west, { closed: true, outward: out }).rot), { block: { w: 14, d: 9, h: WALL_H + 0.6, arch: 3.6, stone: 'courses' }, bays: [3, 3.4, 3], depth: [2.8, 2.8], colH: 3.2 });
	const top = g.height(BLUFF.x, BLUFF.z);
	const yard = (x: number, z: number) => g.height(x, z) + 0.02;
	hall(b, at(BLUFF.x, yard(BLUFF.x, BLUFF.z - 30), BLUFF.z - 30), { bays: [3.6, 4, 4.4, 4, 3.6], depth: [3.4, 3.6, 3.4], colH: 4.2, base: 1.1, steps: ['s'], roof: { chimi: true } });
	for (const [dx, dz, r] of [
		[-60, 10, Math.PI / 2],
		[60, 0, -Math.PI / 2],
		[0, 50, Math.PI]
	] as [number, number, number][]) {
		const x = BLUFF.x + dx;
		const z = BLUFF.z + dz;
		hall(b, at(x, yard(x, z), z, r), { bays: [3.2, 3.6, 3.2], depth: [3, 3], colH: 3.4, base: 1.2, roof: { chimi: true } });
	}
	b.lampPost(south[0] - Math.sin(rot) * 14 + 6, yard(south[0], south[1] - 14), south[1] - Math.cos(rot) * 14);
	b.lampPost(south[0] - Math.sin(rot) * 14 - 6, yard(south[0], south[1] - 14), south[1] - Math.cos(rot) * 14);
	const fortNote: Partial<Record<Dress, string>> = {
		baekje: 'Mongchon: an excavated earthen fort on the hill. Its tan wall face here follows the board',
		goguryeo: 'Goguryeo held the hill fort after 475; its pottery and building traces are excavated here',
		silla: 'Silla’s after 553, the seat of its new Han province'
	};
	labels.push({ id: 'fort', en: 'The hill fort', ko: '몽촌토성', at: [BLUFF.x, top + 40, BLUFF.z], status: 'excavated', note: fortNote[who.dress] });
	labels.push({ id: 'gate', en: 'River gate', ko: '남문', at: [south[0], gy + main.ridge + 6, south[1]], status: 'fictional', note: 'The red two-tier gate is the chronicle board’s; Mongchon’s gates were openings in an earthen wall' });

	// the oval earthen city on the river flat, its four gates and the royal compound
	const oval: P2[] = [];
	for (let i = 0; i < 64; i++) {
		const a = (i / 64) * Math.PI * 2;
		const lx = Math.cos(a) * CITY.rx;
		const lz = Math.sin(a) * CITY.rz;
		const c = Math.cos(CITY.rot);
		const sn = Math.sin(CITY.rot);
		oval.push([CITY.x + lx * c - lz * sn, CITY.z + lx * sn + lz * c]);
	}
	const gateIdx = [0, 16, 32, 48];
	const cityGates = gateIdx.map((i) => oval[i]);
	rampart(
		b,
		oval,
		[
			[-20, 0.2],
			[-7, 7.5],
			[0, 9],
			[7, 7.5],
			[22, 0.2]
		],
		g.height,
		{ closed: true, gaps: cityGates.map((at) => ({ at, half: 10 })), step: 8, slope: 'rampart', top: 'path' }
	);
	if (who.city) {
		for (const [x, z] of cityGates) {
			gate(b, at(x, g.height(x, z), z, Math.atan2(x - CITY.x, z - CITY.z)), [3.4, 4, 3.4], [3, 3], 3.8, { base: 0.4, roof: { chimi: true } });
		}
		court(b, CITY.x + 80, CITY.z - 20, 150, 110, PLAIN + 0.3, { gate: 's', pave: 'gravel' });
		const royal = hall(b, at(CITY.x + 80, PLAIN + 0.3, CITY.z - 34), { bays: [4, 4.4, 4.8, 4.4, 4], depth: [3.8, 4.2, 3.8], colH: 5, base: 1.4, tiers: 2, steps: ['s'], roof: { chimi: true } });
		hall(b, at(CITY.x - 160, PLAIN + 0.3, CITY.z + 10), { bays: [3.6, 4, 3.6], depth: [3.6, 3.6], colH: 4, base: 1, roof: { kind: 'pyramid', h: 4.2 } });
		labels.push({ id: 'city', en: 'River-flat city', ko: '풍납토성', at: [CITY.x, PLAIN + 40, CITY.z], status: 'excavated', note: 'An oval rammed-earth ring on the flat bank; the halls inside are placed' });
		labels.push({ id: 'royal', en: 'Royal hall', ko: '왕궁', at: [CITY.x + 80, PLAIN + royal.ridge + 8, CITY.z - 34], status: 'placed' });
	} else {
		// burnt in 475: the bare stylobate of the royal hall, scorched posts, the ring's gates gone
		const y = PLAIN + 0.3;
		box(b, 'stone', at(CITY.x + 80, y, CITY.z - 34), 0, 0.5, 0, 30, 1, 20, { bevel: 0.12 });
		for (let i = 0; i < 6; i++) box(b, 'dark', at(CITY.x + 80, y + 1, CITY.z - 34), -11 + i * 4.4, 0.9 + (i % 3) * 0.4, 7, 0.5, 1.8 + (i % 3) * 0.8, 0.5);
		labels.push({ id: 'city', en: 'The burnt city', ko: '풍납토성 터', at: [CITY.x, PLAIN + 40, CITY.z], status: 'excavated', note: 'Jangsu took and burned the river-flat city in 475; only the ring and a village remain' });
	}
	const ovalClear = (x: number, z: number, pad: number) => distanceToPath(oval, x, z, true) > pad;
	gridTown(
		town,
		g.height,
		rand,
		{ minX: CITY.x - CITY.rx, maxX: CITY.x + CITY.rx, minZ: CITY.z - CITY.rz - 80, maxZ: CITY.z + CITY.rz + 80 },
		90,
		(x, z) => cityAt(x, z) < 0.9 && ovalClear(x, z, 26) && !(Math.abs(x - CITY.x - 80) < 90 && Math.abs(z - CITY.z + 20) < 70) && Math.hypot(x - CITY.x + 160, z - CITY.z - 10) > 30,
		who.city ? { density: 0.62, thatch: 0.7 } : { density: 0.18, thatch: 0.95 }
	);

	if (who.dress === 'goguryeo') {
		for (const [x, z] of REDOUBTS) redoubt(b, g, x, z, 26, 'wallRed');
		labels.push({ id: 'achasan', en: 'Achasan redoubts', ko: '아차산 보루', at: [REDOUBTS[1][0], g.height(REDOUBTS[1][0], REDOUBTS[1][1]) + 30, REDOUBTS[1][1]], status: 'excavated', note: 'Goguryeo’s small stone forts on the ridge across the Han, excavated with their barracks and iron' });
	}
	if (who.dress === 'silla') {
		const [sx, sz] = STELE;
		const y = g.height(sx, sz);
		box(b, 'stone', at(sx, y, sz), 0, 0.3, 0, 3.4, 0.6, 1.6, { bevel: 0.1 });
		box(b, 'courses', at(sx, y + 0.6, sz), 0, 0.85, 0, 0.9, 1.7, 0.22);
		labels.push({ id: 'stele', en: 'Jinheung’s stele', ko: '북한산 진흥왕 순수비', at: [sx, y + 30, sz], status: 'standing', note: 'Set on the peak when the king toured his new land on the Han, around 555; the stone stands in the National Museum now' });
	}

	// the villages of the board, along both banks, and willows at the water
	const bankOk = (x: number, z: number) => han(x, z) > HAN_HALF + 60 && bluff(x, z) < 4 && mountains(x, z) < 10 && cityAt(x, z) > 1.15;
	hamlet(town, forest, g, rand, { x: -560, z: -470, r: 150, n: 34, thatch: 0.5, ok: bankOk });
	hamlet(town, forest, g, rand, { x: -1200, z: -330, r: 120, n: 24, thatch: 0.6, ok: bankOk });
	hamlet(town, forest, g, rand, { x: 900, z: 520, r: 140, n: 30, thatch: 0.5, ok: bankOk });
	hamlet(town, forest, g, rand, { x: 220, z: 520, r: 110, n: 20, thatch: 0.6, ok: bankOk });
	for (const [x, z] of resample(chaikin(HAN, 2, false), 22, false)) {
		for (const side of [1, -1]) {
			if (rand() > 0.55) continue;
			const px = x + side * (HAN_HALF + 34 + rand() * 30);
			const pz = z + (rand() - 0.5) * 30;
			if (han(px, pz) < HAN_HALF + 26 || bluff(px, pz) > 6 || cityAt(px, pz) < 1.1) continue;
			forest.add('willow', px, g.height(px, pz), pz, 8 + rand() * 4);
		}
	}
	const offWall = (x: number, z: number) => distanceToPath(ring, x, z, true) > 12;
	scatterTrees(forest, g, NEAR, 9000, rand, (x, z) => mountains(x, z) + bluff(x, z) > 8 && offWall(x, z) && bluff(x, z) < 46 && han(x, z) > HAN_HALF + 20, (r) => (r > 0.55 ? 'pine' : r > 0.2 ? 'broad' : 'zelkova'), [8, 14]);
	bankCover(cover, g, HAN, WATER, rand, { from: HAN_HALF - 20, to: HAN_HALF + 50, step: 4, grass: (x, z) => bluff(x, z) < 4 });
	scatterCover(cover, g, { minX: BLUFF.x - 220, maxX: BLUFF.x + 220, minZ: BLUFF.z - 200, maxZ: BLUFF.z + 200 }, 14000, rand, (x, z) => offWall(x, z) && bluff(x, z) > 44, 1);
	scatterCover(cover, g, { minX: -1300, maxX: 1300, minZ: -800, maxZ: 900 }, 16000, rand, (x, z) => bankOk(x, z) || (cityAt(x, z) < 0.9 && ovalClear(x, z, 26)), 1);

	labels.push({ id: 'han', en: 'Han River', ko: '한강', at: [-300, WATER + 10, 40], status: 'survey' });

	const views: View[] = [
		{ id: 'board', en: 'Board view', ko: '그림 시점', pos: [-420, WATER + 9, 150], target: [560, PLAIN + 52, -440], fov: 42 },
		{ id: 'gate', en: 'River gate', ko: '남문', pos: [south[0] - 40, g.height(south[0] - 40, south[1] + 60) + 4, south[1] + 60], target: [south[0], gy + 10, south[1]], fov: 46 },
		{ id: 'city', en: 'Earthen city', ko: '풍납토성', pos: [CITY.x + 500, 120, CITY.z + 520], target: [CITY.x, PLAIN, CITY.z], fov: 42 },
		{ id: 'fort', en: 'Fort yard', ko: '성 안', pos: [BLUFF.x + 120, top + 40, BLUFF.z + 90], target: [BLUFF.x, top, BLUFF.z - 20], fov: 46 },
		{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 2800, 400], target: [0, 0, 100], fov: 40 }
	];

	const folk = new Folk(who.dress, g.height, 18 + opts.year);
	folk.wall(ring, WALL_H - 1, 30, { closed: true, outward: out, t: 4.4, skip: (x, z) => Math.hypot(x - south[0], z - south[1]) < 18 });
	folk.gate(south[0], south[1], rot, { half: 6, out: 6 });
	folk.audience(BLUFF.x, BLUFF.z - 30, 0, { y: yard(BLUFF.x, BLUFF.z - 30), near: 10, far: 30, n: 3 });
	if (who.dress === 'goguryeo') {
		folk.knot(['cavalry', 'cavalry', 'rider'], south[0] + 40, south[1] + 90, 20, 6);
		for (const [x, z] of REDOUBTS) folk.knot(['guard', 'archer'], x, z, 10, 3);
	}
	if (who.dress === 'silla') folk.knot(['hwarang', 'hwarang', 'guard'], BLUFF.x + 30, BLUFF.z + 20, 14, 5, { y: yard(BLUFF.x + 30, BLUFF.z + 20) });

	return assemble({
		...s,
		life: {
			kingdom: who.dress,
			walk: [
				[south[0], south[1] + 200],
				[south[0], south[1] + 40],
				south,
				[BLUFF.x, BLUFF.z - 10]
			],
			door: [BLUFF.x, BLUFF.z - 30],
			river: reach(HAN, 0, 40, 2000),
			bank: HAN_HALF + 20,
			waterY: WATER + 0.3,
			height: g.height,
			seed: 18,
			people: who.city ? 26 : 16,
			boats: 4,
			boat: 1,
			folk
		},
		mist: {
			height: g.height,
			box: { minX: -6000, maxX: 6000, minZ: -6000, maxZ: 6000 },
			layers: [
				{ y: WATER + 1.4, opacity: 0.34 },
				{ y: PLAIN + 3, opacity: 0.16 },
				{ y: PLAIN + 14, opacity: 0.07 }
			]
		},
		views,
		center: [0, 100],
		radius: 1200,
		haze: '#d6d2d8'
	});
}
