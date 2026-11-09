import { Region, fbm, noise, smoothstep, distanceToPath, chaikin, resample, type P2, type Bounds } from './geo';
import { at, box, hall, gate, court, ribbon, stoneWall, gateOnWall, pavedCourt, cloister, rampart, drumPavilion, stoneLantern, type Builder, type Forest, type Town, type WallGap } from './kit';
import { bump, type Ground } from './terrain';
import { lerp, mountainField, pick, contourRing, riverStrip, gridTown, startSite, assemble, bankCover, scatterTrees, scatterCover, Footprints } from './common';
import { munru, wallBanners, wallTorches, banners, bastions, outwardOf, hamlet } from './fortress';
import { slope, terrace, que } from './tang';
import { Folk } from './people';
import type { BuildOptions, Label, SiteBuild, View } from './types';
import { reach } from './life';
import { BOTONG, BOTONG_HALF, DAEDONG, DAEDONG_HALF, MORAN, NAKRANG, NAKRANG_RING } from './daedong';

/*
 * Pyongyang, Goguryeo's last capital: Jangan Fortress (장안성), walled from 552, on the north
 * bank of the Daedong. Four walls share one long circuit: the north citadel on Moranbong, the
 * inner city with the palace on its hill, then the middle and outer cities on the flats down to
 * where the Botong meets the Daedong. The wall lines here are schematic; the board's red
 * two-tier munru is the inner city's south gate, on the street up to the palace yard.
 *
 * From 668 the city is the Tang's: the Andong Protectorate (안동도호부) is set down in front of
 * the old palace, a Tang yamen on a red rammed-earth terrace with grey hip roofs and que piers,
 * and the walls fly vermilion.
 */

const PLAIN = 12;
const WATER = 6;
const BED = 1;
const WALL_H = 9;

const PALACE = { x: 40, z: -520, w: 230, d: 280 };
const PALACE_Y = PLAIN + 34;
/** The Tang protectorate compound, south-west of the palace hill and west of the main street. */
const HQ = { x: -250, z: -150, w: 190, d: 170 };
const TANG_YEAR = 668;
/** Jangan stands from this year; before it the ground is the Han commandery of Nakrang. */
const FORTRESS = 640;

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

function hqOut(x: number, z: number): number {
	const px = Math.abs(x - HQ.x) - HQ.w / 2;
	const pz = Math.abs(z - HQ.z) - HQ.d / 2;
	return Math.hypot(Math.max(px, 0), Math.max(pz, 0));
}

const HQ_Y = PLAIN + mountains(HQ.x, HQ.z) + hills(HQ.x, HQ.z) + 0.5;

/** Ground for every era: the protectorate terrace pad stays so the land never rebuilds with the year. */
function makeGround(): Ground {
	const height = (x: number, z: number) => {
		let y = PLAIN + fbm(x / 420, z / 420) * 1.6 + mountains(x, z) + hills(x, z);
		const out = palaceOut(x, z);
		if (out < 40) y = lerp(PALACE_Y, y, smoothstep(4, 40, out));
		const hq = hqOut(x, z);
		if (hq < 40) y = lerp(HQ_Y, y, smoothstep(4, 40, hq));
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
		if (hqOut(x, z) < 2) return n > 0.1 ? '#b8ab8a' : '#aea183';
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
		if (rise < 26 || palaceOut(x, z) < 30 || hqOut(x, z) < 30) return 0;
		return slope > 0.55 ? 0.2 : smoothstep(26, 70, rise);
	};
	return { height, color, cover };
}

const NEAR: Bounds = { minX: -2000, maxX: 1800, minZ: -2300, maxZ: 2500 };

/** The Andong Protectorate: a Tang yamen facing south, its terrace hall inside a cloister, que piers at the gate. */
function protectorate(b: Builder, labels: Label[]): void {
	const top = HQ_Y + 3.2;
	const hallZ = HQ.z - 22;
	const front = hallZ + 32;
	const gz = HQ.z + HQ.d / 2;
	terrace(b, { x: HQ.x, z: hallZ, w: 110, d: 64 }, top, (x, z) => z > front - 2 && Math.abs(x - HQ.x) < 5, HQ_Y);
	slope(b, 'wallRed', HQ.x, 8.4, front, top, front + 16, HQ_Y, HQ_Y - 1);
	slope(b, 'stone', HQ.x, 7.6, front, top + 0.25, front + 16, HQ_Y + 0.25, HQ_Y);
	const main = hall(b, at(HQ.x, top + 0.24, hallZ), { bays: [4.6, 5, 5.4, 5.8, 5.4, 5, 4.6], depth: [5, 5.4, 5], colH: 6.4, base: 1.4, tiers: 1, front: 'doors', back: 'wall', sides: 'wall', steps: ['s'], roof: { kind: 'hip', chimi: true } });
	for (const sx of [1, -1]) {
		hall(b, at(HQ.x + sx * 66, HQ_Y, HQ.z + 30, sx > 0 ? -Math.PI / 2 : Math.PI / 2), { bays: Array(7).fill(3.8), depth: [3.6, 3.6], colH: 4.2, base: 0.9, front: 'doors', back: 'wall', sides: 'wall', roof: { kind: 'hip' } });
	}
	cloister(b, HQ.x, HQ.z, HQ.w, HQ.d, HQ_Y, { gate: { bays: [4, 4.6, 4], depth: [4, 4], colH: 4.6, twoStorey: true }, width: 6, colH: 3.8, corners: true });
	const walk = gz - front - 16;
	box(b, 'paving', at(HQ.x, HQ_Y, front + 16 + walk / 2), 0, 0.08, 0, 10, 0.12, walk);
	for (const sx of [1, -1]) {
		que(b, HQ.x + sx * 30, HQ_Y, gz + 22, 13, 9.5, 9, 1);
		b.lampPost(HQ.x + sx * 9, HQ_Y + 0.1, gz + 10);
		b.lampPost(HQ.x + sx * 9, top + 0.24, front - 4);
	}
	banners(b, [-18, -12, 12, 18].map((dx) => [HQ.x + dx, HQ_Y, gz + 34] as [number, number, number]), 'vermilion', 9);
	labels.push({ id: 'protectorate', en: 'Andong Protectorate', ko: '안동도호부', at: [HQ.x, top + main.ridge + 8, hallZ], status: 'recorded', note: 'The Tang put the protectorate of the east in Pyongyang in 668. Its buildings are not known; this one follows a Tang yamen on a red terrace', era: { from: TANG_YEAR } });
}

/**
 * Nakrang, the Han commandery: an earthen city on the flats where the middle city will stand,
 * a Han hall and the drum that beats by itself. The chronicle sets the excavated south-bank city
 * here, under the later fortress.
 */
function nakrangCity(b: Builder, town: Town, forest: Forest, g: Ground, labels: Label[], rand: () => number): Folk {
	const x = NAKRANG.x;
	const z = NAKRANG.z;
	const out = outwardOf(NAKRANG_RING);
	const gates = [
		{ near: [x, z + 380] as P2, block: { w: 20, d: 10, h: 7, arch: 4.6 }, bays: [3.4, 4, 3.4], depth: [3.2, 3.2], colH: 3.8 },
		{ near: [x, z - 380] as P2, block: { w: 18, d: 9, h: 6.6, arch: 4 }, bays: [3.2, 3.8, 3.2], depth: [3, 3], colH: 3.4 }
	];
	const placed = gates.map((gt) => gateOnWall(NAKRANG_RING, gt.near, { closed: true, outward: out }));
	rampart(
		b,
		NAKRANG_RING,
		[
			[-16, 0.4],
			[-5.6, 6.8],
			[0, 8],
			[5.6, 6.8],
			[19, 0.4]
		],
		g.height,
		{ closed: true, gaps: placed.map((gt) => ({ at: gt.at, half: 12 })), outward: out, step: 8, slope: 'rampart', top: 'path' }
	);
	placed.forEach((gt, i) => {
		const spec = gates[i];
		const gy = g.height(gt.at[0], gt.at[1]) - 0.6;
		const made = munru(b, at(gt.at[0], gy, gt.at[1], gt.rot), { block: spec.block, bays: spec.bays, depth: spec.depth, colH: spec.colH });
		const [fx, fz] = [Math.sin(gt.rot), Math.cos(gt.rot)];
		const [rx, rz] = [Math.cos(gt.rot), -Math.sin(gt.rot)];
		banners(
			b,
			[-7, 7].map((d) => [gt.at[0] + rx * d - fx * 3.5, gy + made.base, gt.at[1] + rz * d - fz * 3.5] as [number, number, number]),
			'vermilion',
			7,
			gt.rot
		);
	});
	const nearGate = (px: number, pz: number) => placed.some((gt) => Math.hypot(px - gt.at[0], pz - gt.at[1]) < 18);
	wallBanners(b, NAKRANG_RING, g.height, 'vermilion', 36, { h: 5, closed: true, outward: out, skip: nearGate });
	wallTorches(b, NAKRANG_RING, g.height, 40, { h: 8, closed: true, outward: out, t: 4.5, skip: nearGate });

	const yamenZ = z - 90;
	const y = g.height(x, yamenZ);
	court(b, x, yamenZ, 180, 120, y, { gate: 's', pave: 'paving' });
	const hallRidge = hall(b, at(x, y, yamenZ - 16), { bays: [4.2, 4.8, 5.2, 4.8, 4.2], depth: [4.2, 4.6, 4.2], colH: 5.4, base: 1.8, tiers: 2, steps: ['s'], roof: { chimi: false } }).ridge;
	for (const side of [-1, 1]) hall(b, at(x + side * 58, y, yamenZ + 12, side * (Math.PI / 2)), { bays: [3.4, 3.8, 3.8, 3.4], depth: [3, 3], colH: 3.6, base: 0.8 });
	b.lampPost(x - 6, y, yamenZ + 14);
	b.lampPost(x + 6, y, yamenZ + 14);

	const drumZ = z + 40;
	const dy = g.height(x, drumZ);
	const ridge = drumPavilion(b, x, dy, drumZ);
	for (const sx of [-1, 1]) stoneLantern(b, x + sx * 11, dy, drumZ + 10, 1.2);
	const street = resample(chaikin([[x, z + 385], [x, drumZ + 20], [x, yamenZ + 50]], 2, false), 5, false);
	b.push('path', ribbon(street, 8, (px, pz) => g.height(px, pz) + 0.12));

	const taken = new Footprints();
	taken.add(x, drumZ, 30, 30);
	taken.add(x, yamenZ, 186, 126);
	const inside = (px: number, pz: number) => Math.hypot(px - x, pz - z) < NAKRANG.r - 28 && g.height(px, pz) < PLAIN + 16;
	hamlet(town, forest, g, rand, { x: x - 30, z: z + 140, r: 140, n: 18, thatch: 0.25, taken, ok: inside });
	hamlet(town, forest, g, rand, { x: x + 160, z: z + 150, r: 110, n: 12, thatch: 0.35, taken, ok: inside });
	hamlet(town, forest, g, rand, { x: -900, z: 960, r: 180, n: 12, thatch: 0.95, ok: (px, pz) => g.height(px, pz) < PLAIN + 10 });

	labels.push({ id: 'yamen', en: 'Commandery hall', ko: '낙랑 태수부', at: [x, y + hallRidge + 7, yamenZ - 16], status: 'placed', era: { to: FORTRESS }, note: 'A Han hall on the flats. The excavated city is on the south bank; the chronicle sets it here, where Pyongyang will be built' });
	labels.push({ id: 'drum-whole', en: 'The drum that warns', ko: '자명고', at: [x, dy + ridge * 0.45, drumZ], status: 'fictional', era: { to: FORTRESS }, note: 'It beats by itself when an enemy comes. The princess cuts it for Hodong' });
	labels.push({ id: 'nakrang-city', en: 'Nakrang', ko: '낙랑', at: [x - NAKRANG.r, g.height(x - NAKRANG.r, z) + 14, z], status: 'placed', era: { to: FORTRESS }, note: 'The commandery before the fortress: an earthen wall, thatch and tile inside, the hill behind still empty' });

	const folk = new Folk('tang', g.height, 32);
	folk.gate(x, drumZ + 9, 0, { half: 5 });
	folk.audience(x, yamenZ - 22, 0, { near: 12, far: 36, n: 5 });
	folk.knot(['official', 'guard', 'man', 'woman'], x + 30, z + 70, 18, 7);
	return folk;
}

/** The Tang garrison: guards on the protectorate gate and the inner wall, clerks at the hall. */
function occupation(g: Ground): Folk {
	const folk = new Folk('tang', g.height, TANG_YEAR);
	const gz = HQ.z + HQ.d / 2;
	folk.gate(HQ.x, gz, 0, { half: 6, out: 8 });
	folk.audience(HQ.x, HQ.z + 10, 0, { y: HQ_Y + 0.1, near: 8, far: 26, n: 3 });
	folk.wall(INNER, WALL_H - 1, 50, { closed: true, outward: outwardOf(INNER), t: 5.5 });
	folk.knot(['cavalry', 'rider', 'guard'], HQ.x + 70, gz + 60, 18, 5);
	return folk;
}

export function buildPyongyang(opts: BuildOptions): SiteBuild {
	const g = makeGround();
	const s = startSite('pyongyang', g, { near: NEAR, cell: 9, far: 24000, farCell: 120, center: [0, 200], seed: 552 });
	const { b, forest, town, cover, labels, rand } = s;

	riverStrip(b, DAEDONG, DAEDONG_HALF * 2 + 60, WATER);
	riverStrip(b, BOTONG, BOTONG_HALF * 2 + 20, WATER + 0.2);

	// before the fortress: the Han city on the flats, and nothing on the hills
	b.setEra(undefined, FORTRESS);
	town.setEra(undefined, FORTRESS);
	const nakrangFolk = nakrangCity(b, town, forest, g, labels, rand);
	b.setEra();
	town.setEra();

	b.setEra(FORTRESS);
	// the north citadel round Moranbong: its own enclosure, its own gate on the south-east rim
	const north = contourRing(g.height, MORAN.x, MORAN.z, PLAIN + 48, 760, 90);
	const nOut = outwardOf(north);
	const se = north.reduce((best, pt) => (pt[0] + pt[1] > best[0] + best[1] ? pt : best), north[0]);
	const nearSe = (x: number, z: number) => Math.hypot(x - se[0], z - se[1]) < 22;
	stoneWall(b, north, g.height, { h: WALL_H, t: 5.5, closed: true, outward: nOut, gaps: [{ at: se, half: 15 }], step: 5 });
	bastions(b, north, g.height, 70, { h: WALL_H, closed: true, outward: nOut, size: 9, lookout: 3, t: 5.5, skip: (x, z) => Math.hypot(x - se[0], z - se[1]) < 40 });
	b.setEra(FORTRESS, TANG_YEAR);
	wallBanners(b, north, g.height, 'wallRed', 42, { h: WALL_H, closed: true, outward: nOut, skip: nearSe });
	b.setEra(TANG_YEAR);
	wallBanners(b, north, g.height, 'vermilion', 42, { h: WALL_H, closed: true, outward: nOut, skip: nearSe });
	b.setEra(FORTRESS);
	const seRot = gateOnWall(north, se, { closed: true, outward: nOut }).rot;
	const seY = g.height(se[0], se[1]) - 2;
	const citadelGate = munru(b, at(se[0], seY, se[1], seRot), { block: { w: 22, d: 11, h: WALL_H + 2, arch: 3.4 }, storeys: 1, bays: [3.4, 4, 3.4], depth: [3.2, 3.2], colH: 3.6 });
	b.lampPost(se[0] - Math.sin(seRot) * 14, g.height(se[0] - Math.sin(seRot) * 14, se[1] - Math.cos(seRot) * 14), se[1] - Math.cos(seRot) * 14);
	labels.push({ id: 'citadel', en: 'North citadel gate', ko: '북성 문', at: [se[0], seY + citadelGate.ridge + 6, se[1]], status: 'placed', era: { from: FORTRESS }, note: 'The north citadel is a walled enclosure of its own; its gates open on the hill, not on the palace' });
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
	b.setEra(FORTRESS, TANG_YEAR);
	wallBanners(b, INNER, g.height, 'wallRed', 60, { h: WALL_H, closed: true, outward: iOut });
	b.setEra(TANG_YEAR);
	wallBanners(b, INNER, g.height, 'vermilion', 60, { h: WALL_H, closed: true, outward: iOut });
	b.setEra(FORTRESS);
	stoneWall(b, MIDDLE, g.height, { h: WALL_H - 1, t: 5, outward: -1, gaps, step: 5, extend: 6 });
	stoneWall(b, OUTER, g.height, { h: WALL_H - 1, t: 5, outward: -1, gaps, step: 5, extend: 6 });
	const route: P2[] = [[PALACE.x, PALACE.z], ...gates, [-1000, 2300]];
	const gateRot = (k: number) => Math.atan2(route[k + 2][0] - route[k][0], route[k + 2][1] - route[k][1]);
	for (const [k, [x, z]] of gates.entries()) {
		const y = g.height(x, z) - 0.6;
		if (k > 0) munru(b, at(x, y, z, gateRot(k)), { block: { w: 24, d: 11, h: WALL_H + 0.8, arch: 5 }, storeys: 1, bays: [3.4, 4, 4.4, 4, 3.4], depth: [3.2, 3.2], colH: 3.8 });
	}
	// the board's red two-tier munru: the inner city's south gate, on the street that runs up to the palace yard
	const [mx, mz] = gates[0];
	const mRot = gateRot(0);
	const mY = g.height(mx, mz) - 0.6;
	const board = munru(b, at(mx, mY, mz, mRot), { block: { w: 30, d: 14, h: WALL_H + 4, arch: 5 }, storeys: 2, red: true, bays: [3.8, 4.4, 4.8, 4.4, 3.8], depth: [3.6, 3.8, 3.6], colH: 4.4 });
	labels.push({ id: 'munru', en: 'Inner-city gate', ko: '내성 문루', at: [mx, mY + board.ridge + 6, mz], status: 'fictional', era: { from: FORTRESS }, note: 'The board’s red two-tier munru, set on the inner city’s south gate; through it the street climbs to the palace yard' });
	labels.push({ id: 'walls', en: 'Jangan walls', ko: '장안성', at: [-560, g.height(-560, -300) + 34, -300], status: 'recorded', era: { from: FORTRESS }, note: 'Walled from 552; inscribed stones date the work. The lines here are schematic' });

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
	// Nakrang's drum, kept where every rider through the gate must pass it: unroofed, slit, never mended
	const DRUM_Z = PALACE.z + 94;
	const drumTop = drumPavilion(b, PALACE.x, PALACE_Y, DRUM_Z, { roof: false, ripped: true, scale: 1.7, rot: -Math.PI / 2 });
	for (const sx of [1, -1]) stoneLantern(b, PALACE.x + sx * 13, PALACE_Y, DRUM_Z + 10, 1.2);
	labels.push({ id: 'drum', en: 'The ripped drum', ko: '찢어진 자명고', at: [PALACE.x, PALACE_Y + drumTop * 1.2, DRUM_Z], status: 'fictional', era: { from: FORTRESS }, note: 'Taken from Nakrang and set in the palace yard, slit side to the gate' });
	b.lampPost(PALACE.x - 8, PALACE_Y, PALACE.z + 128);
	b.lampPost(PALACE.x + 8, PALACE_Y, PALACE.z + 128);
	b.setEra(TANG_YEAR);
	protectorate(b, labels);
	b.setEra(FORTRESS);
	labels.push({ id: 'palace', en: 'Palace', ko: '왕궁', at: [PALACE.x, PALACE_Y + main.ridge + 6, PALACE.z - 10], status: 'placed', era: { from: FORTRESS }, note: 'The palace site inside Jangan is not fixed; the plan follows Anhak’s walled compound and axis' });

	// the main street from the palace gate through the middle and outer cities
	const street = resample(chaikin([[PALACE.x, PALACE.z + PALACE.d / 2 + 4], [100, 60], ...gates, [-1000, 2300]], 2, false), 5, false);
	b.push('path', ribbon(street, 14, (x, z) => g.height(x, z) + 0.12));
	const onStreet = (x: number, z: number, pad: number) => distanceToPath(street, x, z) < 7 + pad;
	const walls = [north, INNER, MIDDLE, OUTER];
	const clearOfWalls = (x: number, z: number, pad: number) => walls.every((w, i) => distanceToPath(w, x, z, i < 2) > pad);

	// Nakrang's old earthen wall, slumped and breached, running through the middle city
	const nkCuts: WallGap[] = resample(chaikin(NAKRANG_RING, 2, true), 4, true)
		.filter(([x, z]) => distanceToPath(street, x, z) < 3)
		.map((at) => ({ at, half: 16 }));
	for (const k of [2, 6, 11]) nkCuts.push({ at: NAKRANG_RING[k], half: 34 });
	rampart(
		b,
		NAKRANG_RING,
		[
			[-9, 0],
			[-2.5, 2.4],
			[0, 2.8],
			[2.5, 2.4],
			[9, 0]
		],
		g.height,
		{ closed: true, gaps: nkCuts, step: 8, slope: 'rampart', top: 'path' }
	);
	const nkWest = NAKRANG_RING.reduce((best, p) => (p[0] < best[0] ? p : best), NAKRANG_RING[0]);
	labels.push({ id: 'nakrang', en: 'Old Nakrang wall', ko: '낙랑 옛 토성', at: [nkWest[0], g.height(nkWest[0], nkWest[1]) + 12, nkWest[1]], status: 'placed', era: { from: FORTRESS }, note: 'The earthen wall of the commandery, slumped and breached, left standing through the middle city. The excavated Han city (Tosŏng-ri) lies across the river on the south bank' });

	// the outer city's street grid, a looser town in the middle city, officials' houses inside
	const cityOk = (x: number, z: number) =>
		!onStreet(x, z, 4) && clearOfWalls(x, z, 14) && daedong(x, z) > DAEDONG_HALF + 50 && botong(x, z) > BOTONG_HALF + 30 && hills(x, z) < 14 && palaceOut(x, z) > 30 && hqOut(x, z) > 30 && distanceToPath(NAKRANG_RING, x, z, true) > 16;
	town.setEra(FORTRESS);
	gridTown(town, g.height, rand, { minX: -1480, maxX: 420, minZ: 700, maxZ: 2000 }, 96, (x, z) => outerCity.contains(x, z) && cityOk(x, z), { density: 0.55, thatch: 0.6 });
	gridTown(town, g.height, rand, { minX: -900, maxX: 600, minZ: 130, maxZ: 830 }, 110, (x, z) => middleCity.contains(x, z) && cityOk(x, z), { density: 0.5, thatch: 0.4 });
	const innerCity = new Region(INNER);
	gridTown(town, g.height, rand, { minX: -580, maxX: 780, minZ: -1230, maxZ: 190 }, 130, (x, z) => innerCity.contains(x, z) && cityOk(x, z) && hills(x, z) < 40, { density: 0.35, thatch: 0.1 });
	town.setEra();
	b.setEra();

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
	scatterCover(cover, g, { minX: PALACE.x - 140, maxX: PALACE.x + 140, minZ: PALACE.z - 160, maxZ: PALACE.z + 240 }, 12000, rand, (x, z) => !onStreet(x, z, 1) && palaceOut(x, z) > 3 && hqOut(x, z) > 3, 1);
	scatterCover(cover, g, { minX: se[0] - 220, maxX: se[0] + 260, minZ: se[1] - 200, maxZ: se[1] + 260 }, 9000, rand, (x, z) => clearOfWalls(x, z, 5), 1.1);

	labels.push({
		id: 'daedong',
		en: 'Blaze Creek',
		ko: '패수',
		at: [1100, PLAIN + 10, -300],
		status: 'survey',
		note: 'The Daedong at the north bank. The Botong meets it below the outer city.'
	});

	const fx = Math.sin(mRot);
	const fz = Math.cos(mRot);
	const bx = mx + fx * 170 + fz * 40;
	const bz = mz + fz * 170 - fx * 40;
	const views: View[] = [
		{ id: 'commandery', en: 'The commandery', ko: '낙랑', pos: [NAKRANG.x + 70, PLAIN + 28, NAKRANG.z + 560], target: [NAKRANG.x, PLAIN + 8, NAKRANG.z + 40], fov: 44, era: { to: FORTRESS } },
		{ id: 'drum-whole', en: 'The drum', ko: '자명고', pos: [NAKRANG.x + 28, PLAIN + 7, NAKRANG.z + 52], target: [NAKRANG.x, PLAIN + 5.5, NAKRANG.z + 40], fov: 46, era: { to: FORTRESS } },
		{ id: 'board', en: 'Board view', ko: '그림 시점', pos: [bx, g.height(bx, bz) + 6, bz], target: [mx, mY + 14, mz], fov: 40, era: { from: FORTRESS } },
		{ id: 'drum', en: 'The ripped drum', ko: '찢어진 자명고', pos: [PALACE.x + 12, PALACE_Y + 3.5, DRUM_Z + 26], target: [PALACE.x, PALACE_Y + 6, DRUM_Z], fov: 48, era: { from: FORTRESS } },
		{ id: 'palace', en: 'Palace', ko: '왕궁', pos: [PALACE.x + 180, PALACE_Y + 70, PALACE.z + 280], target: [PALACE.x, PALACE_Y, PALACE.z - 10], fov: 42, era: { from: FORTRESS } },
		{ id: 'protectorate', en: 'Protectorate', ko: '도호부', pos: [HQ.x - 150, HQ_Y + 60, HQ.z + 260], target: [HQ.x, HQ_Y + 8, HQ.z], fov: 42, era: { from: TANG_YEAR } },
		{ id: 'river', en: 'From Blaze Creek', ko: '패수에서', pos: [1250, WATER + 14, -260], target: [MORAN.x, 60, MORAN.z + 200], fov: 42 },
		{ id: 'city', en: 'Outer city', ko: '외성', pos: [-200, 140, 2400], target: [-600, 0, 1300], fov: 44, era: { from: FORTRESS } },
		{ id: 'plan', en: 'Plan', ko: '평면', pos: [-200, 4200, 700], target: [-200, 0, 300], fov: 40 }
	];

	return assemble({
		...s,
		year: opts.year,
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
			people: 16,
			crowdEra: { from: FORTRESS },
			bands: [
				{ era: { to: FORTRESS }, folk: nakrangFolk },
				{ era: { from: TANG_YEAR }, folk: occupation(g) }
			],
			boats: 3,
			boat: 1
		}
	});
}
