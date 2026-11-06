import { fbm, noise, smoothstep, distanceToPath, chaikin, resample, rect, type P2, type Bounds } from './geo';
import { at, box, hall, court, ribbon, stoneWall, flat, skirt, gateOnWall } from './kit';
import { bump, type Ground } from './terrain';
import { lerp, mountainField, pick, contourRing, riverStrip, startSite, assemble, bankCover, scatterCover, scatterTrees } from './common';
import { munru, wallBanners, banners, outwardOf, hamlet } from './fortress';
import type { BuildOptions, SiteBuild, View } from './types';

/*
 * Daeya Fortress (대야성), Hapcheon: Silla's western bastion, built on the hill above the
 * Hwanggang in 562 and lost to Baekje in the eighth month of 642. The ring follows the hill's
 * contour; the main gate is the chronicle board's: an ochre dressed-stone block, one round arch,
 * blue leaves, a single-storey pavilion, blue banners along the wall.
 */

const PLAIN = 22;
const WATER = 18;
const BED = 14;
const HILL = { x: 0, z: -180 };
/** The summit is levelled to this height above the plain. */
const TOP = 58;
const WALL_H = 7;

const RIVER: P2[] = [
	[2800, -2300],
	[1600, -1350],
	[820, -620],
	[600, 40],
	[260, 520],
	[-480, 720],
	[-1400, 820],
	[-3200, 1400]
];
const RIVER_HALF = 75;

const mountains = mountainField([
	{ x: -1900, z: -1500, rx: 1300, rz: 1000, h: 210, seed: 1.3 },
	{ x: 900, z: -2600, rx: 1500, rz: 900, h: 260, seed: 2.6 },
	{ x: 2600, z: 900, rx: 1300, rz: 1500, h: 240, seed: 3.1 },
	{ x: -900, z: 2700, rx: 2000, rz: 900, h: 280, seed: 4.8 },
	{ x: -4800, z: 300, rx: 2200, rz: 2600, h: 520, seed: 5.2 },
	{ x: 4600, z: -3600, rx: 2600, rz: 2200, h: 640, seed: 6.4 },
	{ x: 800, z: 5600, rx: 3600, rz: 1600, h: 560, seed: 7.9 }
]);

function hillRaw(x: number, z: number): number {
	const h = bump(x, z, HILL.x, HILL.z, 430, 340) * 70 + bump(x, z, -170, -330, 260, 220) * 20 + bump(x, z, 220, -280, 200, 160) * 12;
	return h * (0.88 + 0.24 * fbm(x / 120, z / 120, 3));
}

/** The hill with its top levelled into a yard. */
function hill(x: number, z: number): number {
	const h = hillRaw(x, z);
	return h > TOP ? TOP + (h - TOP) * 0.06 : h;
}

const riverDistance = (x: number, z: number) => distanceToPath(RIVER, x, z);

function makeGround(): Ground {
	const height = (x: number, z: number) => {
		let y = PLAIN + fbm(x / 380, z / 380) * 1.4 + mountains(x, z) + hill(x, z);
		const dr = riverDistance(x, z);
		if (dr < RIVER_HALF + 110) y = Math.min(y, lerp(BED, PLAIN + 30, smoothstep(RIVER_HALF - 25, RIVER_HALF + 100, dr)));
		return y;
	};
	const fields = ['#93b35b', '#9db861', '#8aac55', '#a6bc68', '#b4c173'];
	const color = (x: number, z: number, y: number, slope: number): string => {
		const n = noise(x / 37, z / 37);
		if (riverDistance(x, z) < RIVER_HALF + 18 && y < PLAIN - 1) return y < WATER ? '#8a8468' : '#d2c8a4';
		const rise = mountains(x, z) + hill(x, z);
		if (hill(x, z) > TOP - 0.5) return n > 0.1 ? '#a69d78' : '#9c946f';
		if (rise > 5) {
			if (slope > 0.55) return '#8a8576';
			return pick(['#4c6d3b', '#57773f', '#45663a', '#5f8049'], (n + 1) / 2);
		}
		if (slope < 0.06) {
			const cx = Math.floor((x + 13) / 48);
			const cz = Math.floor((z - 7) / 30);
			return pick(fields, Math.abs(Math.sin(cx * 12.9898 + cz * 78.233) * 43758.5453) % 1);
		}
		return n > 0 ? '#86a858' : '#7c9f51';
	};
	const cover = (x: number, z: number, _y: number, slope: number): number => {
		const rise = mountains(x, z) + hill(x, z);
		if (rise < 5 || hill(x, z) > TOP - 4) return 0;
		return slope > 0.55 ? 0.2 : smoothstep(5, 30, rise);
	};
	return { height, color, cover };
}

const NEAR: Bounds = { minX: -1500, maxX: 1500, minZ: -1400, maxZ: 1500 };

export function buildDaeya(_opts: BuildOptions): SiteBuild {
	const g = makeGround();
	const s = startSite('daeya', g, { near: NEAR, cell: 6, far: 20000, farCell: 110, center: [0, 0], seed: 562 });
	const { b, forest, town, cover, labels, rand } = s;
	const yard = PLAIN + TOP;

	riverStrip(b, RIVER, RIVER_HALF * 2 + 50, WATER);

	// the ring wall along the rim of the levelled top
	const ring = contourRing(g.height, HILL.x, HILL.z, yard - 3, 700, 110);
	const out = outwardOf(ring);
	const south = ring.reduce((best, p) => (p[1] > best[1] ? p : best), ring[0]);
	const north = ring.reduce((best, p) => (p[1] < best[1] ? p : best), ring[0]);
	const gate = { at: south, half: 13 };
	const back = { at: north, half: 7 };
	stoneWall(b, ring, g.height, { h: WALL_H, t: 4.6, closed: true, outward: out, gaps: [gate, back], step: 4 });

	// the main gate of the board
	const rot = gateOnWall(ring, south, { closed: true, outward: out }).rot;
	const gy = g.height(south[0], south[1]) - 0.6;
	const gm = at(south[0], gy, south[1], rot);
	const main = munru(b, gm, {
		block: { w: 26, d: 11, h: WALL_H + 1.4, arch: 5.2, stone: 'courses', doors: 'blue' },
		bays: [3.4, 3.8, 4.2, 3.8, 3.4],
		depth: [3, 3],
		colH: 3.6
	});
	const [fx, fz] = [Math.sin(rot), Math.cos(rot)];
	const [rx, rz] = [Math.cos(rot), -Math.sin(rot)];
	banners(
		b,
		[-11.5, 11.5].map((d) => [south[0] + rx * d - fx * 3.5, gy + main.base, south[1] + rz * d - fz * 3.5] as [number, number, number]),
		'blue',
		7,
		rot
	);
	wallBanners(b, ring, g.height, 'blue', 11, { h: WALL_H, closed: true, outward: out, skip: (x, z) => Math.hypot(x - south[0], z - south[1]) < 16 || Math.hypot(x - north[0], z - north[1]) < 10 });
	munru(b, at(north[0], g.height(north[0], north[1]) - 0.4, north[1], gateOnWall(ring, north, { closed: true, outward: out }).rot), {
		block: { w: 14, d: 9, h: WALL_H + 0.6, arch: 3.6, stone: 'courses' },
		bays: [3, 3.4, 3],
		depth: [2.8, 2.8],
		colH: 3.2
	});

	// the road from the river town up to the gate
	const road: P2[] = [
		[south[0] - fx * 6, south[1] - fz * 6],
		[south[0] + fx * 60, south[1] + fz * 60],
		[south[0] - 60, south[1] + 170],
		[-180, 420],
		[-360, 560]
	];
	const roadLine = resample(chaikin(road, 2, false), 4, false);
	b.push('path', ribbon(roadLine, 6, (x, z) => g.height(x, z) + 0.12));
	const onRoad = (x: number, z: number, pad: number) => distanceToPath(roadLine, x, z) < 3 + pad;

	// inside: the commander's court, the granary, barracks and a well-pond
	const inside = (x: number, z: number) => hill(x, z) > TOP - 0.5;
	court(b, HILL.x, HILL.z - 30, 64, 46, yard, { gate: 's', pave: 'earth' });
	const cmd = hall(b, at(HILL.x, yard, HILL.z - 40), { bays: [3.4, 3.8, 4.2, 3.8, 3.4], depth: [3.4, 3.6, 3.4], colH: 4.2, base: 1.1, steps: ['s'], roof: { chimi: true } });
	labels.push({ id: 'command', en: 'Commander’s hall', ko: '성주 청사', at: [HILL.x, yard + cmd.ridge + 6, HILL.z - 40], status: 'placed', note: 'Where Kim Pumseok held the fortress in 642' });
	const granary: [number, number] = [HILL.x + 78, HILL.z + 12];
	for (let k = 0; k < 4; k++) {
		hall(b, at(granary[0] - 8 + (k % 2) * 18, yard, granary[1] - 16 + Math.floor(k / 2) * 20, Math.PI / 2), {
			bays: [3, 3, 3, 3],
			depth: [2.8, 2.8],
			colH: 2.6,
			base: 0.4,
			posts: 1.5,
			front: 'wall',
			roof: { kind: 'hip', h: 2.6 }
		});
	}
	labels.push({ id: 'granary', en: 'Granary', ko: '창고', at: [granary[0], yard + 14, granary[1]], status: 'recorded', note: 'Geomil set it alight in the eighth month of 642, and the fortress opened to Baekje' });
	for (let k = 0; k < 3; k++) {
		hall(b, at(HILL.x - 84, yard, HILL.z - 30 + k * 22), { bays: Array(6).fill(3), depth: [3, 3], colH: 3, base: 0.5 });
	}
	labels.push({ id: 'barracks', en: 'Barracks', ko: '병영', at: [HILL.x - 84, yard + 12, HILL.z - 8], status: 'placed', note: 'A garrison had to sleep somewhere; the plan is ours' });
	const pond = rect(HILL.x - 30, HILL.z + 50, 14, 10);
	b.push('courses', skirt(pond, yard - 1.6, yard + 0.3));
	b.push('water', flat(pond, yard - 0.5));
	b.lampPost(south[0] - fx * 16 + rx * 5, yard, south[1] - fz * 16 + rz * 5);
	b.lampPost(south[0] - fx * 16 - rx * 5, yard, south[1] - fz * 16 - rz * 5);
	box(b, 'wood', at(HILL.x, yard, HILL.z + 10), 0, 6, 0, 0.3, 12, 0.3);
	banners(b, [[HILL.x, yard + 4, HILL.z + 10]], 'blue', 8.5);

	labels.push({ id: 'gate', en: 'South gate', ko: '남문', at: [south[0], gy + main.ridge + 5, south[1]], status: 'fictional', note: 'The ochre arched block, blue leaves and pavilion are the chronicle board’s design' });
	labels.push({ id: 'wall', en: 'Daeya Fortress', ko: '대야성', at: [north[0], yard + 26, north[1]], status: 'recorded', note: 'Built 562; its hill above the Hwanggang at Hapcheon is known, but this ring follows the contour, not a survey' });
	labels.push({ id: 'hwanggang', en: 'Hwanggang', ko: '황강', at: [640, PLAIN + 8, 60], status: 'placed' });

	// the town on the flats between the hill and the river
	const flatOk = (x: number, z: number) => hill(x, z) < 3 && mountains(x, z) < 4 && riverDistance(x, z) > RIVER_HALF + 70 && !onRoad(x, z, 6);
	hamlet(town, forest, g, rand, { x: -330, z: 470, r: 170, n: 70, thatch: 0.7, ok: flatOk });
	hamlet(town, forest, g, rand, { x: 120, z: 330, r: 110, n: 28, thatch: 0.8, ok: flatOk });
	hamlet(town, forest, g, rand, { x: -760, z: 260, r: 120, n: 26, thatch: 0.85, ok: flatOk });

	// the great trees that frame the gate on the board, then forest down every slope
	for (const side of [1, -1]) {
		for (let k = 0; k < 7; k++) {
			const d = 30 + k * 9 + rand() * 6;
			const off = side * (14 + rand() * 14);
			const x = south[0] + fx * d + rx * off;
			const z = south[1] + fz * d + rz * off;
			if (onRoad(x, z, 2)) continue;
			forest.add(k < 3 ? 'zelkova' : 'broad', x, g.height(x, z), z, 13 + rand() * 6);
		}
	}
	const wallClear = (x: number, z: number) => distanceToPath(ring, x, z, true) > 12;
	scatterTrees(forest, g, NEAR, 9000, rand, (x, z) => mountains(x, z) + hill(x, z) > 6 && !inside(x, z) && wallClear(x, z) && !onRoad(x, z, 3) && riverDistance(x, z) > RIVER_HALF + 20, (r) => (r > 0.4 ? 'broad' : 'pine'), [8, 15]);
	for (const [x, z] of resample(chaikin(RIVER, 2, false), 20, false)) {
		for (const side of [1, -1]) {
			if (rand() > 0.5) continue;
			const px = x + side * (RIVER_HALF + 30 + rand() * 30);
			const pz = z + (rand() - 0.5) * 30;
			if (riverDistance(px, pz) < RIVER_HALF + 22 || hill(px, pz) > 4) continue;
			forest.add('willow', px, g.height(px, pz), pz, 8 + rand() * 4);
		}
	}

	// grass in the yard and up the approach, reeds along the river
	const yardBox: Bounds = { minX: HILL.x - 260, maxX: HILL.x + 260, minZ: HILL.z - 220, maxZ: HILL.z + 300 };
	scatterCover(cover, g, yardBox, 26000, rand, (x, z) => !onRoad(x, z, 0.5) && distanceToPath(ring, x, z, true) > 4 && (inside(x, z) ? rand() > 0.4 : hill(x, z) > 2), 1);
	bankCover(cover, g, RIVER, WATER, rand, { from: RIVER_HALF - 12, to: RIVER_HALF + 40, step: 4 });

	const views: View[] = [
		{ id: 'board', en: 'Board view', ko: '그림 시점', pos: [south[0] + fx * 52, g.height(south[0] + fx * 52, south[1] + fz * 52) + 2.2, south[1] + fz * 52], target: [south[0], gy + 9, south[1]], fov: 50 },
		{ id: 'wall', en: 'On the wall', ko: '성벽 위', pos: [south[0] - rx * 60 - fx * 4, yard + 8, south[1] - rz * 60 - fz * 4], target: [south[0], gy + 9, south[1]], fov: 46 },
		{ id: 'yard', en: 'The yard', ko: '성 안', pos: [granary[0] + 40, yard + 18, granary[1] + 80], target: [HILL.x, yard, HILL.z - 20], fov: 44 },
		{ id: 'river', en: 'From the river', ko: '황강에서', pos: [520, PLAIN + 10, 640], target: [HILL.x, yard + 10, HILL.z], fov: 40 },
		{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 1500, 260], target: [0, 0, 0], fov: 40 }
	];

	return assemble({
		...s,
		mist: {
			height: g.height,
			box: { minX: -5000, maxX: 5000, minZ: -5000, maxZ: 5000 },
			layers: [
				{ y: WATER + 1.4, opacity: 0.3 },
				{ y: PLAIN + 4, opacity: 0.14 }
			]
		},
		views,
		center: [0, 80],
		radius: 760,
		haze: '#c6d4e0'
	});
}
