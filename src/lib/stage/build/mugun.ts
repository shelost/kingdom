import { SphereGeometry } from 'three';
import { fbm, noise, smoothstep, type P2, type Bounds } from './geo';
import { at, box, cylinder, hall, tower, stoneWall, flat, ribbon, type Builder, type Mat } from './kit';
import { bump, type Ground } from './terrain';
import { lerp, mountainField, pick, startSite, assemble, scatterTrees, scatterCover } from './common';
import { wallBanners, banners, outwardOf, hamlet, crag } from './fortress';
import type { BuildOptions, SiteBuild, View } from './types';

/*
 * Mugun (무근성), the seat of Tamla on the north shore of the island: a ring of black basalt laid
 * dry, thatched houses inside and out, a two-storey hall on a stone base, orange groves behind
 * windbreak walls, the sea on one side and Hallasan on the other. The myths of the volume sit
 * on the same ground: the three princes' well, the star brothers' flowers, Kangrim's house,
 * the magistrate's yard, and a port. After the chronicle board; the sites are placed.
 */

const SEA = 0;
const FORT = { x: 0, z: 0, rx: 120, rz: 86 };
const WALL_H = 3.4;
/** Hallasan, far inland to the south-west. */
const HALLA = { x: -9000, z: -5000 };
/** Samsunghyeol, inland and west of the ring. The real hole is in the old town; this set-back is placed. */
const WELL = { x: -540, z: 40 };
/** The flower wager. No shore on the island owns it; the beds are placed on open ground. */
const FLOWERS = { x: -640, z: -240 };
/** The house Kangrim leaves when the magistrate sends him down. */
const KANGRIM = { x: -320, z: -460 };
/** The magistrate's yard, where the gardener's mother waits the year out. */
const MAGISTRATE = { x: 60, z: -560 };

const KEEP = [WELL, FLOWERS, KANGRIM, MAGISTRATE];
function kept(x: number, z: number, r = 18): boolean {
	return KEEP.some((k) => Math.hypot(x - k.x, z - k.z) < (k === MAGISTRATE ? 26 : r));
}

/** The shoreline's x at a given z: the sea lies east of it. */
function coast(z: number): number {
	return 420 + 70 * Math.sin(z / 310) + 40 * fbm(z / 500, 3.3, 3);
}

const mountains = mountainField([
	{ x: -2600, z: -3000, rx: 2600, rz: 2000, h: 260, seed: 1.6 },
	{ x: -4200, z: 1800, rx: 2200, rz: 2200, h: 180, seed: 2.4 }
]);

function land(x: number, z: number): number {
	const halla = crag(x, z, HALLA.x, HALLA.z, 11000, 9000, 1900, 0.9, 1.25);
	const oreum = bump(x, z, -720, -640, 300, 280) * 105 + bump(x, z, 900, -2300, 340, 300) * 90;
	return 6 + (420 - x) * 0.012 + fbm(x / 300, z / 300) * 2 + mountains(x, z) + halla + oreum + bump(x, z, FORT.x, FORT.z, 280, 220) * 8;
}

function makeGround(): Ground {
	const height = (x: number, z: number) => {
		const c = coast(z);
		const y = land(x, z);
		if (x < c - 40) return y;
		const shore = smoothstep(c - 40, c + 10, x);
		const seabed = SEA - 1.5 - (x - c) * 0.05;
		return lerp(y, Math.min(SEA + 0.6, seabed), shore) + (x > c ? Math.min(0, seabed - SEA) * 0.4 : 0);
	};
	const color = (x: number, z: number, y: number, slope: number): string => {
		const n = noise(x / 23, z / 23);
		const c = coast(z);
		if (x > c - 50) return y < SEA ? '#7c8a80' : n > 0.3 ? '#3e3c3a' : '#e6d6a8';
		if (slope > 0.5) return n > 0 ? '#45433f' : '#55524c';
		if (Math.hypot((x - FORT.x) / FORT.rx, (z - FORT.z) / FORT.rz) < 0.96) return n > 0.1 ? '#a99f78' : '#9c936f';
		if (land(x, z) > 60) return pick(['#4f7a3b', '#5b8442', '#4a7238', '#68904c'], (n + 1) / 2);
		return pick(['#9cc25e', '#a6c865', '#8fba57', '#b6cf6c'], (n + 1) / 2);
	};
	const cover = (x: number, z: number, y: number, slope: number): number => {
		if (x > coast(z) - 60 || slope > 0.5) return 0;
		return y > 60 ? 0.6 : 0;
	};
	return { height, color, cover };
}

const NEAR: Bounds = { minX: -1300, maxX: 900, minZ: -1100, maxZ: 1000 };

/** A dry-stone ring (or arc) of basalt, `wobble` breaking the line the way field walls run. */
function ellipse(cx: number, cz: number, rx: number, rz: number, a0: number, a1: number, n: number, wobble: number, seed: number): P2[] {
	const pts: P2[] = [];
	for (let i = 0; i < n; i++) {
		const a = a0 + ((a1 - a0) * i) / (a1 - a0 >= Math.PI * 2 ? n : n - 1);
		const k = 1 + wobble * noise(Math.cos(a) * 2 + seed, Math.sin(a) * 2 - seed);
		pts.push([cx + Math.cos(a) * rx * k, cz + Math.sin(a) * rz * k]);
	}
	return pts;
}

/** One planted bed: five stems, one colour. The two beds are the same height, so the swap can pass. */
function flowerBed(b: Builder, g: Ground, cx: number, cz: number, cloth: Mat): void {
	const y = g.height(cx, cz);
	box(b, 'earth', at(cx, y, cz), 0, 0.16, 0, 4.4, 0.32, 2.4);
	box(b, 'rock', at(cx, y + 0.12, cz - 1.25), 0, 0.16, 0, 4.6, 0.22, 0.2);
	box(b, 'rock', at(cx, y + 0.12, cz + 1.25), 0, 0.16, 0, 4.6, 0.22, 0.2);
	for (let i = 0; i < 5; i++) {
		const x = cx - 1.5 + i * 0.75;
		const h = 1.55;
		cylinder(b, 'green', at(x, y + 0.3 + h / 2, cz), 0, 0, 0, 0.045, 0.07, h, 6);
		b.push(cloth, new SphereGeometry(0.36, 10, 8), at(x, y + 0.3 + h + 0.12, cz));
	}
}

/** First x, walking east, where the ground has dropped to `y`. */
function waterline(g: Ground, z: number, y: number): number {
	const c = coast(z);
	let x = c - 30;
	while (x < c + 80 && g.height(x, z) > y) x += 1.5;
	return x;
}

/** A timber pier running east into the sea. It starts where the beach drops under the deck. */
function pier(b: Builder, g: Ground, z: number): void {
	const deck = SEA + 1.35;
	const x0 = waterline(g, z, deck - 0.15);
	const len = 26;
	box(b, 'wood', at(x0 + len / 2, deck, z), 0, 0.12, 0, len, 0.24, 3.2);
	for (let i = 0; i <= 5; i++) {
		const x = x0 + (len * i) / 5;
		for (const side of [-1.3, 1.3]) {
			box(b, 'wood', at(x, SEA + 0.35, z + side), 0, 0.85, 0, 0.28, 2, 0.28);
		}
	}
}

export function buildMugun(_opts: BuildOptions): SiteBuild {
	const g = makeGround();
	const s = startSite('mugun', g, { near: NEAR, cell: 4, far: 30000, farCell: 140, center: [0, 0], seed: 662 });
	const { b, forest, town, cover, labels, rand } = s;

	// the sea, the foam line and the basalt on the shore
	b.push('water', flat([[-200, -15000], [15000, -15000], [15000, 15000], [-200, 15000]], SEA));
	const shore: P2[] = [];
	for (let z = NEAR.minZ - 400; z <= NEAR.maxZ + 400; z += 12) shore.push([coast(z) + 6, z]);
	b.push('cloud', ribbon(shore, 3.5, () => SEA + 0.06));
	b.push('cloud', ribbon(shore.map(([x, z]) => [x + 22 + 6 * Math.sin(z / 40), z] as P2), 2, () => SEA + 0.05));
	for (let k = 0; k < 2600; k++) {
		const z = NEAR.minZ - 200 + rand() * (NEAR.maxZ - NEAR.minZ + 400);
		const x = coast(z) - 40 + rand() * 90;
		const y = g.height(x, z);
		if (y < SEA - 2.5) continue;
		cover.add('basalt', x, Math.max(y, SEA - 0.6) - 0.3, z, 0.8 + rand() * 2.6);
	}

	// the fort: an oval basalt ring, a lower outer arc in front, orange banners
	const ring = ellipse(FORT.x, FORT.z, FORT.rx, FORT.rz, 0, Math.PI * 2, 56, 0.06, 1.7);
	const out = outwardOf(ring);
	const gateS = ring.reduce((best, p) => (p[1] > best[1] ? p : best), ring[0]);
	const gateE = ring.reduce((best, p) => (p[0] > best[0] ? p : best), ring[0]);
	stoneWall(b, ring, g.height, { h: WALL_H, t: 2.6, closed: true, outward: out, gaps: [{ at: gateS, half: 4 }, { at: gateE, half: 4 }], step: 3, mat: 'rock', parapet: false });
	const outer = ellipse(FORT.x, FORT.z + 10, FORT.rx + 55, FORT.rz + 52, 0.15 * Math.PI, 0.95 * Math.PI, 30, 0.08, 3.1);
	stoneWall(b, outer, g.height, { h: 2.4, t: 1.8, outward: 1, gaps: [{ at: [gateS[0], gateS[1] + 50], half: 5 }], step: 3, mat: 'rock', parapet: false });
	wallBanners(b, ring, g.height, 'orange', 34, { h: WALL_H, closed: true, outward: out, pole: 5.5, skip: (x, z) => Math.hypot(x - gateS[0], z - gateS[1]) < 8 });
	for (const [x, z] of [gateS, gateE]) {
		const r = Math.atan2(x - FORT.x, z - FORT.z);
		for (const side of [1, -1]) {
			const px = x + Math.cos(r) * side * 5.5;
			const pz = z - Math.sin(r) * side * 5.5;
			box(b, 'rock', at(px, g.height(px, pz) - 0.5, pz, r), 0, (WALL_H + 1.4) / 2, 0, 3.2, WALL_H + 1.4, 3.2);
		}
	}

	// the hall of the lord of Tamla, two storeys on a dressed basalt base, and its side halls
	const hx = FORT.x + 10;
	const hz = FORT.z - 36;
	const hy = g.height(hx, hz);
	box(b, 'wallStone', at(hx, hy - 1, hz), 0, 2.6, 0, 30, 5.2, 22);
	const lord = tower(
		b,
		at(hx, hy + 4.2, hz),
		{ bays: [3.6, 4.2, 3.6], depth: [3.6, 3.6], colH: 4.2, base: 0.4, front: 'windows', back: 'wall', sides: 'wall', steps: [] },
		{ bays: [3.2, 3.8, 3.2], depth: [3.2, 3.2], colH: 3.4, front: 'doors', back: 'wall', sides: 'wall', roof: { chimi: true } }
	);
	box(b, 'stone', at(hx, hy, hz + 14), 0, 2, 0, 6, 4, 6);
	for (const [dx, dz, w] of [
		[-34, -26, 3],
		[40, -18, 2]
	] as [number, number, number][]) {
		const x = FORT.x + dx;
		const z = FORT.z + dz;
		hall(b, at(x, g.height(x, z), z), { bays: Array(w).fill(3.4), depth: [3, 3], colH: 3.2, base: 0.9, front: 'wall', sides: 'wall', roof: { chimi: true } });
	}
	b.lampPost(gateS[0] - 6, g.height(gateS[0] - 6, gateS[1] - 8), gateS[1] - 8);
	b.lampPost(gateS[0] + 6, g.height(gateS[0] + 6, gateS[1] - 8), gateS[1] - 8);
	labels.push({ id: 'hall', en: 'Lord’s hall', ko: '성주청', at: [hx, hy + 4.2 + lord.ridge + 6, hz], status: 'fictional', note: 'The board’s two-storey hall on a stone base; invented' });
	labels.push({ id: 'wall', en: 'Mugun ring', ko: '무근성', at: [FORT.x - FORT.rx, g.height(FORT.x - FORT.rx, FORT.z) + 18, FORT.z], status: 'fictional', note: 'The name Mugunseong survives in Jeju’s old town; this ring is invented. Black basalt laid dry, the island way' });

	// thatched houses inside the ring and in the village round it
	const inFort = (x: number, z: number) => Math.hypot((x - FORT.x) / (FORT.rx - 10), (z - FORT.z) / (FORT.rz - 10)) < 1;
	const clearOfHall = (x: number, z: number) => Math.abs(x - hx) > 26 || Math.abs(z - hz) > 22;
	hamlet(town, forest, g, rand, { x: FORT.x, z: FORT.z + 20, r: 80, n: 16, thatch: 1, ok: (x, z) => inFort(x, z) && clearOfHall(x, z) && Math.abs(x - gateS[0]) > 8, trees: ['citrus'] });
	const village = (x: number, z: number) => !inFort(x, z) && Math.hypot((x - FORT.x) / (FORT.rx + 70), (z - FORT.z) / (FORT.rz + 64)) > 1 && x < coast(z) - 70 && land(x, z) < 40;
	const open = (x: number, z: number) => village(x, z) && !kept(x, z);
	hamlet(town, forest, g, rand, { x: -200, z: 160, r: 160, n: 40, thatch: 1, ok: open, trees: ['citrus', 'broad'] });
	hamlet(town, forest, g, rand, { x: 220, z: -220, r: 130, n: 26, thatch: 1, ok: open, trees: ['citrus', 'broad'] });

	// orange groves inside low windbreak walls, fruit on every tree
	for (let k = 0; k < 22; k++) {
		const cx = -700 + rand() * 900;
		const cz = -500 + rand() * 1100;
		const w = 40 + rand() * 30;
		const d = 30 + rand() * 24;
		if (!open(cx, cz) || !open(cx + w / 2, cz + d / 2) || !open(cx - w / 2, cz - d / 2)) continue;
		if (Math.hypot(cx + 200, cz - 160) < 150 || Math.hypot(cx - 220, cz + 220) < 130) continue;
		const field: P2[] = [
			[cx - w / 2, cz - d / 2],
			[cx + w / 2, cz - d / 2],
			[cx + w / 2, cz + d / 2],
			[cx - w / 2, cz + d / 2]
		];
		stoneWall(b, field, g.height, { h: 1.3, t: 0.8, closed: true, step: 3, mat: 'rock', parapet: false, gaps: [{ at: [cx, cz + d / 2], half: 1.6 }] });
		for (let x = cx - w / 2 + 5; x < cx + w / 2 - 3; x += 6) {
			for (let z = cz - d / 2 + 5; z < cz + d / 2 - 3; z += 6) {
				const h = 3.6 + rand() * 1.4;
				const y = g.height(x, z);
				forest.add('citrus', x, y, z, h);
				for (let f = 0; f < 9; f++) {
					const a = rand() * Math.PI * 2;
					const e = -0.3 + rand() * 1.1;
					cover.add('fruit', x + Math.cos(a) * Math.cos(e) * h * 0.39, y + h * 0.62 + Math.sin(e) * h * 0.37, z + Math.sin(a) * Math.cos(e) * h * 0.39, 0.22 + rand() * 0.06);
				}
			}
		}
	}
	labels.push({ id: 'groves', en: 'Orange groves', ko: '귤밭', at: [-420, 30, 200], status: 'placed' });

	// the green cone behind, scrub on its flanks, grass everywhere the wind lets it
	scatterTrees(forest, g, { minX: -1300, maxX: 900, minZ: -1100, maxZ: 1000 }, 3200, rand, (x, z) => land(x, z) > 24 && x < coast(z) - 80 && !inFort(x, z) && !kept(x, z), (r) => (r > 0.6 ? 'pine' : 'broad'), [6, 11]);
	scatterCover(cover, g, { minX: -600, maxX: 500, minZ: -500, maxZ: 600 }, 30000, rand, (x, z) => x < coast(z) - 45 && !(Math.abs(x - hx) < 17 && Math.abs(z - hz) < 13) && !kept(x, z, 12), 1.1);
	for (let k = 0; k < 2400; k++) {
		const x = -1200 + rand() * 1800;
		const z = -1000 + rand() * 1900;
		if (land(x, z) < 30 || x > coast(z) - 80 || kept(x, z, 14)) continue;
		cover.add(rand() > 0.3 ? 'shrub' : 'basalt', x, g.height(x, z) - 0.2, z, 0.9 + rand() * 1.2);
	}
	labels.push({ id: 'halla', en: 'Hallasan', ko: '한라산', at: [HALLA.x * 0.35, 900, HALLA.z * 0.35], status: 'survey' });

	// the three princes' well: a basalt slab, three dark mouths with stone rims, a low wall
	const wy = g.height(WELL.x, WELL.z);
	const slabTop = wy + 0.55;
	box(b, 'rock', at(WELL.x, wy + 0.15, WELL.z), 0, 0.4, 0, 11, 0.8, 8.5);
	stoneWall(
		b,
		[
			[WELL.x - 9, WELL.z - 7.5],
			[WELL.x + 9, WELL.z - 7.5],
			[WELL.x + 9, WELL.z + 7.5],
			[WELL.x - 9, WELL.z + 7.5]
		],
		g.height,
		{ h: 1.5, t: 0.85, closed: true, step: 2.2, mat: 'rock', parapet: false, gaps: [{ at: [WELL.x, WELL.z + 7.5], half: 1.6 }] }
	);
	for (const [dx, dz] of [
		[0, -1.9],
		[-2.05, 1.2],
		[2.05, 1.2]
	] as [number, number][]) {
		const x = WELL.x + dx;
		const z = WELL.z + dz;
		box(b, 'dark', at(x, slabTop + 0.18, z), 0, 0.28, 0, 2.2, 0.36, 2.2);
		box(b, 'water', at(x, slabTop + 0.34, z), 0, 0.06, 0, 1.5, 0.08, 1.5);
		for (let i = 0; i < 8; i++) {
			const a = (i / 8) * Math.PI * 2;
			box(b, 'rock', at(x + Math.cos(a) * 1.7, slabTop + 0.28, z + Math.sin(a) * 1.7), 0, 0.4, 0, 0.6, 0.8, 0.6);
		}
	}
	labels.push({
		id: 'well',
		en: 'Three princes’ well',
		ko: '삼성혈',
		at: [WELL.x, wy + 8, WELL.z],
		status: 'placed',
		note: 'Where Go, Yang, and Bu climb out. The hole is real in the old town; this set-back is placed west of the ring.'
	});

	// two beds, the same height: Big Star grows the better flower, Little Star swaps them in the night
	flowerBed(b, g, FLOWERS.x - 3.4, FLOWERS.z, 'blue');
	flowerBed(b, g, FLOWERS.x + 3.4, FLOWERS.z, 'vermilion');
	const fy = g.height(FLOWERS.x, FLOWERS.z);
	box(b, 'thatch', at(FLOWERS.x, fy + 0.04, FLOWERS.z + 3.4), 0, 0.04, 0, 1.9, 0.07, 0.95);
	labels.push({
		id: 'flowers',
		en: 'The two flowers',
		ko: '두 송이',
		at: [FLOWERS.x, fy + 6, FLOWERS.z],
		status: 'fictional',
		note: 'Big Star’s blue bed and Little Star’s red one. He swaps the blooms while his brother sleeps, and takes the living world.'
	});

	// Kangrim's house, before the road down: a thatched yard and the red book he will carry
	const ky = g.height(KANGRIM.x, KANGRIM.z);
	box(b, 'earth', at(KANGRIM.x, ky - 0.02, KANGRIM.z + 5.5), 0, 0.1, 0, 11, 0.18, 8);
	hall(b, at(KANGRIM.x, ky, KANGRIM.z - 1.5), {
		bays: [3.2, 3.2],
		depth: [2.8, 2.8],
		colH: 2.7,
		base: 0.4,
		front: 'doors',
		back: 'wall',
		sides: 'wall',
		roof: { tile: 'thatch', chimi: false }
	});
	box(b, 'wood', at(KANGRIM.x + 4.4, ky, KANGRIM.z + 4.2), 0, 0.55, 0, 0.8, 1.1, 0.55);
	box(b, 'vermilion', at(KANGRIM.x + 4.4, ky + 1.14, KANGRIM.z + 4.2), 0, 0.045, 0, 0.42, 0.08, 0.56);
	forest.add('broad', KANGRIM.x - 6.5, ky, KANGRIM.z + 1, 7.5);
	labels.push({
		id: 'kangrim',
		en: 'Kangrim’s old house',
		ko: '강림의 옛집',
		at: [KANGRIM.x, ky + 9, KANGRIM.z],
		status: 'fictional',
		note: 'The living man’s house. The red book is already on the stand. He has not been sent down yet.'
	});

	// the magistrate's yard, a heavier gate than the village houses
	const my = g.height(MAGISTRATE.x, MAGISTRATE.z);
	stoneWall(
		b,
		[
			[MAGISTRATE.x - 16, MAGISTRATE.z - 12],
			[MAGISTRATE.x + 16, MAGISTRATE.z - 12],
			[MAGISTRATE.x + 16, MAGISTRATE.z + 14],
			[MAGISTRATE.x - 16, MAGISTRATE.z + 14]
		],
		g.height,
		{ h: 2.2, t: 1.05, closed: true, step: 3, mat: 'rock', parapet: false, gaps: [{ at: [MAGISTRATE.x, MAGISTRATE.z + 14], half: 2.1 }] }
	);
	hall(b, at(MAGISTRATE.x, my, MAGISTRATE.z - 2), {
		bays: [3.4, 3.6, 3.4],
		depth: [3.1, 3.1],
		colH: 3.2,
		base: 0.55,
		front: 'doors',
		back: 'wall',
		sides: 'wall',
		roof: { tile: 'thatch', chimi: false }
	});
	for (const side of [-1, 1]) {
		const px = MAGISTRATE.x + side * 2.3;
		const pz = MAGISTRATE.z + 14;
		box(b, 'timber', at(px, g.height(px, pz), pz), 0, 1.7, 0, 0.35, 3.4, 0.35);
	}
	box(b, 'timber', at(MAGISTRATE.x, g.height(MAGISTRATE.x, MAGISTRATE.z + 14) + 3.2, MAGISTRATE.z + 14), 0, 0.16, 0, 5.2, 0.28, 0.32);
	banners(b, [[MAGISTRATE.x + 7, my, MAGISTRATE.z + 6]], 'orange', 5.2);
	labels.push({
		id: 'magistrate',
		en: 'Magistrate’s house',
		ko: '원님의 집',
		at: [MAGISTRATE.x, my + 10, MAGISTRATE.z],
		status: 'fictional',
		note: 'The yard the gardener leaves, and the door the magistrate sends Kangrim through.'
	});

	// the port: a timber quay on posts, clear of the beach, two piers, a storehouse, the drifted chest
	const quayZ0 = -70;
	const quayZ1 = 110;
	const deck = SEA + 1.35;
	const quayWalk: P2[] = [];
	for (let z = quayZ0; z <= quayZ1; z += 6) {
		const x = waterline(g, z, deck - 0.1) + 2.6;
		box(b, 'wood', at(x, deck, z), 0, 0.11, 0, 4.6, 0.22, 6.2);
		box(b, 'wood', at(x - 1.8, SEA + 0.35, z), 0, 0.85, 0, 0.26, 2, 0.26);
		box(b, 'wood', at(x + 1.8, SEA + 0.35, z), 0, 0.85, 0, 0.26, 2, 0.26);
		quayWalk.push([x, z]);
	}
	for (const z of [-24, 58]) pier(b, g, z);
	const shedZ = -46;
	const shedX = waterline(g, shedZ, 4) - 16;
	hall(b, at(shedX, g.height(shedX, shedZ), shedZ, Math.PI / 2), {
		bays: [3.2, 3.2],
		depth: [2.8],
		colH: 2.8,
		base: 0.3,
		posts: 0.7,
		front: 'open',
		back: 'wall',
		sides: 'wall',
		roof: { tile: 'thatch', chimi: false }
	});
	banners(
		b,
		[
			[waterline(g, -55, deck) + 2.6, deck, -55],
			[waterline(g, 86, deck) + 2.6, deck, 86]
		],
		'orange',
		5
	);
	b.lampPost(waterline(g, -8, deck) + 2.6, deck, -8);
	b.lampPost(waterline(g, 40, deck) + 2.6, deck, 40);
	const landEnd = waterline(g, 0, 3);
	const road: P2[] = [];
	for (let i = 0; i <= 12; i++) {
		const t = i / 12;
		road.push([lerp(gateE[0] + 8, landEnd, t), lerp(gateE[1], 0, t)]);
	}
	b.push('path', ribbon(road, 3.4, (x, z) => g.height(x, z) + 0.06));
	const chestZ = 148;
	const chestX = waterline(g, chestZ, 0.55);
	const chestY = g.height(chestX, chestZ);
	box(b, 'wood', at(chestX, chestY + 0.5, chestZ, 0.4), 0, 0.45, 0, 2.4, 0.9, 1.3);
	box(b, 'dark', at(chestX, chestY + 1.35, chestZ, 0.4), 0, 0.08, 0, 2.55, 0.14, 1.45);
	labels.push({
		id: 'port',
		en: 'Port',
		ko: '포구',
		at: [coast(10) - 16, 12, 10],
		status: 'placed',
		note: 'The north-shore harbor. Island boats, plain orange sails. The road runs back to the east gate.'
	});
	labels.push({
		id: 'chest',
		en: 'The drifted chest',
		ko: '표류한 함',
		at: [chestX, chestY + 5, chestZ],
		status: 'fictional',
		note: 'The box that comes in on the waves, with the three princesses shut inside.'
	});

	const fairway: P2[] = [];
	for (let z = quayZ1; z >= quayZ0; z -= 18) fairway.push([waterline(g, z, 0) + 16, z]);

	const views: View[] = [
		{ id: 'board', en: 'Board view', ko: '그림 시점', pos: [-170, g.height(-170, 250) + 9, 250], target: [40, 10, -30], fov: 50 },
		{ id: 'hall', en: 'The lord’s hall', ko: '성주청', pos: [hx + 30, hy + 10, hz + 60], target: [hx, hy + 8, hz], fov: 48 },
		{ id: 'shore', en: 'From the shore', ko: '바닷가에서', pos: [coast(120) - 10, 4, 160], target: [0, 10, 0], fov: 44 },
		{ id: 'sea', en: 'From the sea', ko: '바다에서', pos: [900, 30, 300], target: [-200, 40, -200], fov: 42 },
		{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 1200, 300], target: [0, 0, 60], fov: 40 },
		{ id: 'well', en: 'The well', ko: '삼성혈', pos: [WELL.x + 6, wy + 16, WELL.z + 11], target: [WELL.x, wy + 0.6, WELL.z], fov: 36 },
		{ id: 'flowers', en: 'The two flowers', ko: '두 송이', pos: [FLOWERS.x + 11, fy + 3.2, FLOWERS.z + 9], target: [FLOWERS.x, fy + 1.4, FLOWERS.z], fov: 38 },
		{ id: 'kangrim', en: 'Kangrim’s house', ko: '강림의 옛집', pos: [KANGRIM.x + 14, ky + 4, KANGRIM.z + 12], target: [KANGRIM.x, ky + 2, KANGRIM.z], fov: 40 },
		{ id: 'magistrate', en: 'The magistrate', ko: '원님의 집', pos: [MAGISTRATE.x + 8, my + 6, MAGISTRATE.z + 28], target: [MAGISTRATE.x, my + 3, MAGISTRATE.z], fov: 42 },
		{ id: 'port', en: 'The port', ko: '포구', pos: [waterline(g, 30, 4) - 8, 8, 48], target: [waterline(g, -10, 0) + 10, 1.4, -16], fov: 46 }
	];

	return assemble({
		...s,
		mist: {
			height: g.height,
			box: { minX: -4000, maxX: 3000, minZ: -4000, maxZ: 4000 },
			layers: [{ y: SEA + 1.2, opacity: 0.16 }]
		},
		views,
		wardrobe: { dress: 'tamla', x: hx, z: hz + 21, note: 'Island hemp in undyed white and straw; the lord’s house in Tamla orange' },
		center: [0, 0],
		radius: 700,
		haze: '#cfe0ea',
		life: {
			kingdom: 'tamla',
			people: 10,
			boats: 3,
			boat: 1,
			walk: [
				[-26, 6],
				[34, 6],
				[34, 46],
				[-26, 46],
				[-26, 6]
			],
			river: fairway,
			bank: 44,
			waterY: SEA,
			height: (x, z) => {
				const h = g.height(x, z);
				return h < deck + 0.15 ? deck + 0.15 : h;
			},
			seed: 662
		}
	});
}
