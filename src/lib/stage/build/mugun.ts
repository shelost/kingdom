import { fbm, noise, smoothstep, type P2, type Bounds } from './geo';
import { at, box, hall, tower, stoneWall, flat, ribbon } from './kit';
import { bump, type Ground } from './terrain';
import { lerp, mountainField, pick, startSite, assemble, scatterTrees, scatterCover } from './common';
import { wallBanners, outwardOf, hamlet, crag } from './fortress';
import type { BuildOptions, SiteBuild, View } from './types';

/*
 * Mugun (무근성), the seat of Tamla on the north shore of the island: a ring of black basalt laid
 * dry, thatched houses inside and out, a two-storey hall on a stone base, orange groves behind
 * windbreak walls, the sea on one side and Hallasan on the other. After the chronicle board;
 * the site is placed.
 */

const SEA = 0;
const FORT = { x: 0, z: 0, rx: 120, rz: 86 };
const WALL_H = 3.4;
/** Hallasan, far inland to the south-west. */
const HALLA = { x: -9000, z: -5000 };

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
	labels.push({ id: 'hall', en: 'Lord’s hall', ko: '성주청', at: [hx, hy + 4.2 + lord.ridge + 6, hz], status: 'placed', note: 'The board’s two-storey hall on a stone base' });
	labels.push({ id: 'wall', en: 'Mugun ring', ko: '무근성', at: [FORT.x - FORT.rx, g.height(FORT.x - FORT.rx, FORT.z) + 18, FORT.z], status: 'recorded', note: 'Black basalt laid dry, the island way' });

	// thatched houses inside the ring and in the village round it
	const inFort = (x: number, z: number) => Math.hypot((x - FORT.x) / (FORT.rx - 10), (z - FORT.z) / (FORT.rz - 10)) < 1;
	const clearOfHall = (x: number, z: number) => Math.abs(x - hx) > 26 || Math.abs(z - hz) > 22;
	hamlet(town, forest, g, rand, { x: FORT.x, z: FORT.z + 20, r: 80, n: 16, thatch: 1, ok: (x, z) => inFort(x, z) && clearOfHall(x, z) && Math.abs(x - gateS[0]) > 8, trees: ['citrus'] });
	const village = (x: number, z: number) => !inFort(x, z) && Math.hypot((x - FORT.x) / (FORT.rx + 70), (z - FORT.z) / (FORT.rz + 64)) > 1 && x < coast(z) - 70 && land(x, z) < 40;
	hamlet(town, forest, g, rand, { x: -200, z: 160, r: 160, n: 40, thatch: 1, ok: village, trees: ['citrus', 'broad'] });
	hamlet(town, forest, g, rand, { x: 220, z: -220, r: 130, n: 26, thatch: 1, ok: village, trees: ['citrus', 'broad'] });

	// orange groves inside low windbreak walls, fruit on every tree
	for (let k = 0; k < 22; k++) {
		const cx = -700 + rand() * 900;
		const cz = -500 + rand() * 1100;
		const w = 40 + rand() * 30;
		const d = 30 + rand() * 24;
		if (!village(cx, cz) || !village(cx + w / 2, cz + d / 2) || !village(cx - w / 2, cz - d / 2)) continue;
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
	scatterTrees(forest, g, { minX: -1300, maxX: 900, minZ: -1100, maxZ: 1000 }, 3200, rand, (x, z) => land(x, z) > 24 && x < coast(z) - 80 && !inFort(x, z), (r) => (r > 0.6 ? 'pine' : 'broad'), [6, 11]);
	scatterCover(cover, g, { minX: -600, maxX: 500, minZ: -500, maxZ: 600 }, 30000, rand, (x, z) => x < coast(z) - 45 && !(Math.abs(x - hx) < 17 && Math.abs(z - hz) < 13), 1.1);
	for (let k = 0; k < 2400; k++) {
		const x = -1200 + rand() * 1800;
		const z = -1000 + rand() * 1900;
		if (land(x, z) < 30 || x > coast(z) - 80) continue;
		cover.add(rand() > 0.3 ? 'shrub' : 'basalt', x, g.height(x, z) - 0.2, z, 0.9 + rand() * 1.2);
	}
	labels.push({ id: 'halla', en: 'Hallasan', ko: '한라산', at: [HALLA.x * 0.35, 900, HALLA.z * 0.35], status: 'survey' });

	const views: View[] = [
		{ id: 'board', en: 'Board view', ko: '그림 시점', pos: [-170, g.height(-170, 250) + 9, 250], target: [40, 10, -30], fov: 50 },
		{ id: 'hall', en: 'The lord’s hall', ko: '성주청', pos: [hx + 30, hy + 10, hz + 60], target: [hx, hy + 8, hz], fov: 48 },
		{ id: 'shore', en: 'From the shore', ko: '바닷가에서', pos: [coast(120) - 10, 4, 160], target: [0, 10, 0], fov: 44 },
		{ id: 'sea', en: 'From the sea', ko: '바다에서', pos: [900, 30, 300], target: [-200, 40, -200], fov: 42 },
		{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 1200, 300], target: [0, 0, 60], fov: 40 }
	];

	return assemble({
		...s,
		mist: {
			height: g.height,
			box: { minX: -4000, maxX: 3000, minZ: -4000, maxZ: 4000 },
			layers: [{ y: SEA + 1.2, opacity: 0.16 }]
		},
		views,
		center: [0, 0],
		radius: 700,
		haze: '#cfe0ea'
	});
}
