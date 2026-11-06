import { Region, fbm, noise, smoothstep, distanceToPath, chaikin, resample, type P2, type Bounds } from './geo';
import { at, hall, gate, court, ribbon, stoneWall, gateOnWall, pavedCourt } from './kit';
import { bump, type Ground } from './terrain';
import { lerp, mountainField, pick, contourRing, riverStrip, gridTown, startSite, assemble, bankCover, scatterTrees, scatterCover } from './common';
import { munru, wallBanners, bastions, outwardOf } from './fortress';
import type { BuildOptions, SiteBuild, View } from './types';
import { reach } from './life';

/*
 * Pyongyang, Goguryeo's last capital: Jangan Fortress (장안성), walled from 552, on the north
 * bank of the Daedong. Four walls share one long circuit: the north citadel on Moranbong, the
 * inner city with the palace on its hill, then the middle and outer cities on the flats down to
 * where the Botong meets the Daedong. The wall lines here are schematic; the board's red
 * two-tier munru stands on the citadel's south-east rim above the river cliff.
 */

const PLAIN = 12;
const WATER = 6;
const BED = 1;
const WALL_H = 9;

const DAEDONG: P2[] = [
	[2900, -3400],
	[1800, -2300],
	[1260, -1500],
	[1120, -700],
	[1060, 100],
	[800, 900],
	[120, 1750],
	[-900, 2500],
	[-2400, 3000],
	[-4600, 3300]
];
const DAEDONG_HALF = 200;
const BOTONG: P2[] = [
	[-3000, -2300],
	[-2050, -1350],
	[-1700, -300],
	[-1640, 700],
	[-1780, 1700],
	[-2150, 2780]
];
const BOTONG_HALF = 42;

const MORAN = { x: 640, z: -1460 };
const PALACE = { x: 40, z: -520, w: 230, d: 280 };
const PALACE_Y = PLAIN + 34;

const INNER: P2[] = [
	[560, -1140],
	[780, -720],
	[760, -250],
	[600, 140],
	[150, 190],
	[-350, 130],
	[-580, -300],
	[-450, -820],
	[-40, -1120],
	[300, -1230]
];
const MIDDLE: P2[] = [
	[600, 140],
	[420, 700],
	[-300, 830],
	[-900, 760],
	[-780, 260],
	[-350, 130]
];
const OUTER: P2[] = [
	[420, 700],
	[-80, 1430],
	[-880, 1990],
	[-1420, 1790],
	[-1480, 1100],
	[-900, 760]
];
const middleCity = new Region([...MIDDLE, [150, 190]]);
const outerCity = new Region([...OUTER, [-300, 830]]);

const mountains = mountainField([
	{ x: 2600, z: -2400, rx: 1500, rz: 1300, h: 260, seed: 1.2 },
	{ x: -400, z: -3000, rx: 1800, rz: 900, h: 220, seed: 2.5 },
	{ x: 4600, z: -4600, rx: 2600, rz: 2200, h: 520, seed: 3.8 },
	{ x: 3600, z: 2600, rx: 2200, rz: 1700, h: 300, seed: 4.1 },
	{ x: -4200, z: -1800, rx: 2400, rz: 2600, h: 380, seed: 5.6 },
	{ x: -800, z: 6200, rx: 4200, rz: 2000, h: 460, seed: 6.3 }
]);

function hills(x: number, z: number): number {
	const h = bump(x, z, MORAN.x, MORAN.z, 560, 440) * 96 + bump(x, z, 80, -560, 700, 560) * 48 + bump(x, z, -320, -900, 380, 300) * 22;
	return h * (0.86 + 0.28 * fbm(x / 130, z / 130, 3));
}

const daedong = (x: number, z: number) => distanceToPath(DAEDONG, x, z);
const botong = (x: number, z: number) => distanceToPath(BOTONG, x, z);

function palaceOut(x: number, z: number): number {
	const px = Math.abs(x - PALACE.x) - PALACE.w / 2;
	const pz = Math.abs(z - PALACE.z) - PALACE.d / 2;
	return Math.hypot(Math.max(px, 0), Math.max(pz, 0));
}

function makeGround(): Ground {
	const height = (x: number, z: number) => {
		let y = PLAIN + fbm(x / 420, z / 420) * 1.6 + mountains(x, z) + hills(x, z);
		const out = palaceOut(x, z);
		if (out < 40) y = lerp(PALACE_Y, y, smoothstep(4, 40, out));
		const dd = daedong(x, z);
		if (dd < DAEDONG_HALF + 120) y = Math.min(y, lerp(BED, PLAIN + 40, smoothstep(DAEDONG_HALF - 30, DAEDONG_HALF + 110, dd)));
		const db = botong(x, z);
		if (db < BOTONG_HALF + 60) y = Math.min(y, lerp(BED + 2, PLAIN + 10, smoothstep(BOTONG_HALF - 12, BOTONG_HALF + 55, db)));
		return y;
	};
	const fields = ['#93b35b', '#9db861', '#8aac55', '#a6bc68', '#b4c173'];
	const color = (x: number, z: number, y: number, slope: number): string => {
		const n = noise(x / 37, z / 37);
		if ((daedong(x, z) < DAEDONG_HALF + 20 || botong(x, z) < BOTONG_HALF + 8) && y < PLAIN - 1) return y < WATER ? '#8a8468' : '#d2c8a4';
		if (palaceOut(x, z) < 2) return n > 0.1 ? '#a8a07c' : '#9f9774';
		const rise = mountains(x, z) + hills(x, z);
		if (slope > 0.55) return pick(['#7d786c', '#8a8576', '#6f6a60'], (n + 1) / 2);
		if (rise > 26) return pick(['#4c6d3b', '#57773f', '#45663a', '#5f8049'], (n + 1) / 2);
		if (middleCity.contains(x, z) || outerCity.contains(x, z)) return n > 0.2 ? '#a5a679' : '#9ca46f';
		if (slope < 0.06) {
			const cx = Math.floor((x + 13) / 54);
			const cz = Math.floor((z - 7) / 34);
			return pick(fields, Math.abs(Math.sin(cx * 12.9898 + cz * 78.233) * 43758.5453) % 1);
		}
		return n > 0 ? '#86a858' : '#7c9f51';
	};
	const cover = (x: number, z: number, _y: number, slope: number): number => {
		const rise = mountains(x, z) + hills(x, z);
		if (rise < 26 || palaceOut(x, z) < 30) return 0;
		return slope > 0.55 ? 0.2 : smoothstep(26, 70, rise);
	};
	return { height, color, cover };
}

const NEAR: Bounds = { minX: -2000, maxX: 1800, minZ: -2300, maxZ: 2500 };

export function buildPyongyang(_opts: BuildOptions): SiteBuild {
	const g = makeGround();
	const s = startSite('pyongyang', g, { near: NEAR, cell: 9, far: 24000, farCell: 120, center: [0, 200], seed: 552 });
	const { b, forest, town, cover, labels, rand } = s;

	riverStrip(b, DAEDONG, DAEDONG_HALF * 2 + 60, WATER);
	riverStrip(b, BOTONG, BOTONG_HALF * 2 + 20, WATER + 0.2);

	// the north citadel round Moranbong, and the board's munru on its south-east rim
	const north = contourRing(g.height, MORAN.x, MORAN.z, PLAIN + 48, 760, 90);
	const nOut = outwardOf(north);
	const se = north.reduce((best, pt) => (pt[0] + pt[1] > best[0] + best[1] ? pt : best), north[0]);
	stoneWall(b, north, g.height, { h: WALL_H, t: 5.5, closed: true, outward: nOut, gaps: [{ at: se, half: 15 }], step: 5 });
	bastions(b, north, g.height, 70, { h: WALL_H, closed: true, outward: nOut, size: 9, lookout: 3, t: 5.5, skip: (x, z) => Math.hypot(x - se[0], z - se[1]) < 40 });
	wallBanners(b, north, g.height, 'wallRed', 42, { h: WALL_H, closed: true, outward: nOut, skip: (x, z) => Math.hypot(x - se[0], z - se[1]) < 22 });
	const seRot = gateOnWall(north, se, { closed: true, outward: nOut }).rot;
	const seY = g.height(se[0], se[1]) - 2;
	const board = munru(b, at(se[0], seY, se[1], seRot), {
		block: { w: 30, d: 14, h: WALL_H + 4, arch: 3.4 },
		storeys: 2,
		red: true,
		bays: [3.8, 4.4, 4.8, 4.4, 3.8],
		depth: [3.6, 3.8, 3.6],
		colH: 4.4
	});
	b.lampPost(se[0] - Math.sin(seRot) * 14, g.height(se[0] - Math.sin(seRot) * 14, se[1] - Math.cos(seRot) * 14), se[1] - Math.cos(seRot) * 14);
	labels.push({ id: 'munru', en: 'Citadel gate', ko: '북성 문루', at: [se[0], seY + board.ridge + 6, se[1]], status: 'fictional', note: 'The board’s red two-tier munru, set on the rim above the river; Jangan’s real gates are not shown here' });
	labels.push({ id: 'moranbong', en: 'Moranbong', ko: '모란봉', at: [MORAN.x, g.height(MORAN.x, MORAN.z) + 40, MORAN.z], status: 'survey', note: 'The north citadel’s hill above Blaze Creek' });

	// the inner, middle and outer walls, with gates where the main road passes
	const gates: P2[] = [
		[150, 190],
		[-300, 830],
		[-880, 1990]
	];
	const gaps = gates.map((at) => ({ at, half: 12 }));
	const iOut = outwardOf(INNER);
	stoneWall(b, INNER, g.height, { h: WALL_H, t: 5.5, closed: true, outward: iOut, gaps, step: 5 });
	bastions(b, INNER, g.height, 90, { h: WALL_H, closed: true, outward: iOut, size: 9, lookout: 4, t: 5.5 });
	wallBanners(b, INNER, g.height, 'wallRed', 60, { h: WALL_H, closed: true, outward: iOut });
	stoneWall(b, MIDDLE, g.height, { h: WALL_H - 1, t: 5, outward: -1, gaps, step: 5, extend: 6 });
	stoneWall(b, OUTER, g.height, { h: WALL_H - 1, t: 5, outward: -1, gaps, step: 5, extend: 6 });
	const route: P2[] = [[PALACE.x, PALACE.z], ...gates, [-1000, 2300]];
	for (const [k, [x, z]] of gates.entries()) {
		const rot = Math.atan2(route[k + 2][0] - route[k][0], route[k + 2][1] - route[k][1]);
		const y = g.height(x, z) - 0.6;
		munru(b, at(x, y, z, rot), { block: { w: 24, d: 11, h: WALL_H + 0.8, arch: 5 }, storeys: k === 0 ? 2 : 1, red: k === 0, bays: [3.4, 4, 4.4, 4, 3.4], depth: [3.2, 3.2], colH: 3.8 });
	}
	labels.push({ id: 'walls', en: 'Jangan walls', ko: '장안성', at: [-560, g.height(-560, -300) + 34, -300], status: 'recorded', note: 'Walled from 552; inscribed stones date the work. The lines here are schematic' });

	// the palace on the inner-city hill: a walled compound, halls on a north–south axis
	court(b, PALACE.x, PALACE.z, PALACE.w, PALACE.d, PALACE_Y, { gate: 's', gateBays: [3.4, 4, 4.4, 4, 3.4], wallH: 3.6, pave: 'gravel' });
	const main = hall(b, at(PALACE.x, PALACE_Y, PALACE.z - 10), { bays: [4.4, 4.8, 5.2, 5.6, 5.2, 4.8, 4.4], depth: [4.4, 5, 5, 4.4], colH: 6, base: 2.2, tiers: 2, steps: ['s'], roof: { chimi: true, tile: 'tileRed' } });
	hall(b, at(PALACE.x, PALACE_Y, PALACE.z + 70), { bays: [3.8, 4.2, 4.6, 4.2, 3.8], depth: [3.6, 3.6], colH: 4.4, base: 1.2, front: 'open', back: 'open', sides: 'wall', steps: ['s', 'n'], gateLine: 1, roof: { chimi: true, tile: 'tileRed' } });
	hall(b, at(PALACE.x, PALACE_Y, PALACE.z - 90), { bays: Array(7).fill(3.8), depth: [3.4, 3.8, 3.4], colH: 4.4, base: 1.2, roof: { chimi: true, tile: 'tileRed' } });
	for (const sx of [1, -1]) {
		hall(b, at(PALACE.x + sx * 80, PALACE_Y, PALACE.z - 20, sx > 0 ? -Math.PI / 2 : Math.PI / 2), { bays: Array(7).fill(3.4), depth: [3, 3], colH: 3.6, base: 0.8, roof: { tile: 'tileRed' } });
	}
	gate(b, at(PALACE.x, PALACE_Y, PALACE.z + 118), [3.4, 4, 3.4], [3, 3], 3.8, { roof: { chimi: true, tile: 'tileRed' } });
	pavedCourt(b, PALACE.x, PALACE.z + 38, 60, 50, PALACE_Y, { axis: 4, ranks: 4, lanterns: true });
	pavedCourt(b, PALACE.x, PALACE.z + 96, 40, 36, PALACE_Y, { axis: 4, field: 'gravel' });
	b.lampPost(PALACE.x - 8, PALACE_Y, PALACE.z + 128);
	b.lampPost(PALACE.x + 8, PALACE_Y, PALACE.z + 128);
	labels.push({ id: 'palace', en: 'Palace', ko: '왕궁', at: [PALACE.x, PALACE_Y + main.ridge + 6, PALACE.z - 10], status: 'placed', note: 'The palace site inside Jangan is not fixed; the plan follows Anhak’s walled compound and axis' });

	// the main street from the palace gate through the middle and outer cities
	const street = resample(chaikin([[PALACE.x, PALACE.z + PALACE.d / 2 + 4], [100, 60], ...gates, [-1000, 2300]], 2, false), 5, false);
	b.push('path', ribbon(street, 14, (x, z) => g.height(x, z) + 0.12));
	const onStreet = (x: number, z: number, pad: number) => distanceToPath(street, x, z) < 7 + pad;
	const walls = [north, INNER, MIDDLE, OUTER];
	const clearOfWalls = (x: number, z: number, pad: number) => walls.every((w, i) => distanceToPath(w, x, z, i < 2) > pad);

	// the outer city's street grid, a looser town in the middle city, officials' houses inside
	const cityOk = (x: number, z: number) =>
		!onStreet(x, z, 4) && clearOfWalls(x, z, 14) && daedong(x, z) > DAEDONG_HALF + 50 && botong(x, z) > BOTONG_HALF + 30 && hills(x, z) < 14 && palaceOut(x, z) > 30;
	gridTown(town, g.height, rand, { minX: -1480, maxX: 420, minZ: 700, maxZ: 2000 }, 96, (x, z) => outerCity.contains(x, z) && cityOk(x, z), { density: 0.7, thatch: 0.55 });
	gridTown(town, g.height, rand, { minX: -900, maxX: 600, minZ: 130, maxZ: 830 }, 110, (x, z) => middleCity.contains(x, z) && cityOk(x, z), { density: 0.6, thatch: 0.3 });
	const innerCity = new Region(INNER);
	gridTown(town, g.height, rand, { minX: -580, maxX: 780, minZ: -1230, maxZ: 190 }, 130, (x, z) => innerCity.contains(x, z) && cityOk(x, z) && hills(x, z) < 40, { density: 0.35, thatch: 0.1 });

	// forest on the hills, willows along both rivers, grass and reeds on the banks
	scatterTrees(forest, g, NEAR, 9000, rand, (x, z) => mountains(x, z) + hills(x, z) > 24 && clearOfWalls(x, z, 10) && palaceOut(x, z) > 20 && daedong(x, z) > DAEDONG_HALF + 20, (r) => (r > 0.45 ? 'pine' : 'broad'), [9, 15]);
	for (const [path, half] of [
		[DAEDONG, DAEDONG_HALF],
		[BOTONG, BOTONG_HALF]
	] as [P2[], number][]) {
		for (const [x, z] of resample(chaikin(path, 2, false), 24, false)) {
			for (const side of [1, -1]) {
				if (rand() > 0.5) continue;
				const px = x + side * (half + 30 + rand() * 30);
				const pz = z + (rand() - 0.5) * 30;
				if (daedong(px, pz) < DAEDONG_HALF + 22 || botong(px, pz) < BOTONG_HALF + 14 || !clearOfWalls(px, pz, 8)) continue;
				forest.add('willow', px, g.height(px, pz), pz, 8 + rand() * 4);
			}
		}
	}
	bankCover(cover, g, DAEDONG, WATER, rand, { from: DAEDONG_HALF - 15, to: DAEDONG_HALF + 50, step: 5 });
	bankCover(cover, g, BOTONG, WATER, rand, { from: BOTONG_HALF - 8, to: BOTONG_HALF + 30, step: 5 });
	scatterCover(cover, g, { minX: PALACE.x - 140, maxX: PALACE.x + 140, minZ: PALACE.z - 160, maxZ: PALACE.z + 240 }, 12000, rand, (x, z) => !onStreet(x, z, 1) && palaceOut(x, z) > 3, 1);
	scatterCover(cover, g, { minX: se[0] - 220, maxX: se[0] + 260, minZ: se[1] - 200, maxZ: se[1] + 260 }, 9000, rand, (x, z) => clearOfWalls(x, z, 5), 1.1);

	labels.push({
		id: 'daedong',
		en: 'Blaze Creek',
		ko: '패수',
		at: [1100, PLAIN + 10, -300],
		status: 'survey',
		note: 'The Daedong at the north bank. The Botong meets it below the outer city.'
	});

	const fx = Math.sin(seRot);
	const fz = Math.cos(seRot);
	const bx = se[0] + fx * 170 + fz * 40;
	const bz = se[1] + fz * 170 - fx * 40;
	const views: View[] = [
		{ id: 'board', en: 'Board view', ko: '그림 시점', pos: [bx, g.height(bx, bz) + 6, bz], target: [se[0], seY + 14, se[1]], fov: 40 },
		{ id: 'palace', en: 'Palace', ko: '왕궁', pos: [PALACE.x + 180, PALACE_Y + 70, PALACE.z + 280], target: [PALACE.x, PALACE_Y, PALACE.z - 10], fov: 42 },
		{ id: 'river', en: 'From Blaze Creek', ko: '패수에서', pos: [1250, WATER + 14, -260], target: [MORAN.x, 60, MORAN.z + 200], fov: 42 },
		{ id: 'city', en: 'Outer city', ko: '외성', pos: [-200, 140, 2400], target: [-600, 0, 1300], fov: 44 },
		{ id: 'plan', en: 'Plan', ko: '평면', pos: [-200, 4200, 700], target: [-200, 0, 300], fov: 40 }
	];

	return assemble({
		...s,
		mist: {
			height: g.height,
			box: { minX: -6000, maxX: 6000, minZ: -6000, maxZ: 6000 },
			layers: [
				{ y: WATER + 1.4, opacity: 0.3 },
				{ y: PLAIN + 3, opacity: 0.15 },
				{ y: PLAIN + 12, opacity: 0.07 }
			]
		},
		views,
		wardrobe: {
			dress: 'goguryeo',
			x: PALACE.x - 30,
			z: PALACE.z + 82,
			note: 'After the tomb murals: dotted jackets and trousers, long bordered jackets, striped pleated skirts, feather caps'
		},
		center: [-100, 300],
		radius: 1800,
		haze: '#c6d3df',
		water: { color: '#3e5644', roughness: 0.32, metalness: 0.02, minSpan: 400 },
		life: {
			kingdom: 'goguryeo',
			walk: [
				[PALACE.x - 48, PALACE.z + 55],
				[PALACE.x + 48, PALACE.z + 55],
				[PALACE.x + 48, PALACE.z - 45],
				[PALACE.x - 48, PALACE.z - 45],
				[PALACE.x - 48, PALACE.z + 55]
			],
			river: reach(DAEDONG, 1000, -400, 1600),
			bank: DAEDONG_HALF + 36,
			waterY: WATER + 0.4,
			height: (x, z) =>
				Math.abs(x - PALACE.x) < PALACE.w / 2 && Math.abs(z - PALACE.z) < PALACE.d / 2 ? PALACE_Y + 0.15 : g.height(x, z),
			seed: 552,
			people: 18,
			boats: 3,
			boat: 1
		}
	});
}
