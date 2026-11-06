import { fbm, noise, ridged, smoothstep, distanceToPath, rect, type P2, type Bounds } from './geo';
import { at, hall, stoneWall, tents, gateOnWall } from './kit';
import { bump, type Ground } from './terrain';
import { mountainField, pick, startSite, assemble, scatterTrees, scatterCover } from './common';
import { munru, wallBanners, banners, bastions, crag, cloudSea, outwardOf, redKeep, crestRing, hamlet, camp } from './fortress';
import type { BuildOptions, SiteBuild, View } from './types';

/*
 * Ansi (안시성), in the usual identification the Yingchengzi mountain fortress at Haicheng: a
 * horseshoe of ridges round a valley that opens to the east, stone walls along the crests and a
 * gate across the valley mouth. In 645 Taizong's army heaps an earthen mound against the
 * south-east wall for sixty days; the mound slumps onto the wall and the defenders take it.
 * The summit command post, red halls above a sea of cloud, is the chronicle board's.
 */

const PLAIN = 10;
const R = 470;
const WALL_H = 7;
const SUMMIT = { x: -R + 10, z: -30, w: 96, d: 68 };
/** Where the Tang mound meets the wall: the bearing from the valley centre, south-east. */
const MOUND_BEARING = 0.82;

/**
 * The valley the Tang came up: from the plain far to the east-south-east, narrowing to the gate.
 * The Qianshan foothills close in on every other side.
 */
const APPROACH: P2[] = [
	[R + 60, 60],
	[1000, 420],
	[1700, 900],
	[3200, 1500],
	[6500, 2600]
];

/** 1 on the approach valley floor, 0 in the hills; the valley widens toward the plain. */
function approach(x: number, z: number): number {
	const d = distanceToPath(APPROACH, x, z);
	const w = 260 + Math.max(0, x - R) * 0.22;
	return 1 - smoothstep(w * 0.55, w, d);
}

const range = mountainField(
	[
		{ x: -1700, z: -1300, rx: 1500, rz: 1300, h: 300, seed: 1.5 },
		{ x: -1800, z: 1300, rx: 1500, rz: 1300, h: 270, seed: 2.7 },
		{ x: 300, z: -1900, rx: 1900, rz: 1100, h: 330, seed: 3.2 },
		{ x: 900, z: 1900, rx: 1500, rz: 900, h: 260, seed: 3.9 },
		{ x: 2400, z: -300, rx: 1300, rz: 1100, h: 280, seed: 4.1 },
		{ x: -4400, z: 0, rx: 2600, rz: 3400, h: 520, seed: 4.6 },
		{ x: 2600, z: 3600, rx: 2600, rz: 1300, h: 360, seed: 5.8 }
	],
	{ scale: 900, horizon: { x: 300, z: 300, r: 2600, h: 420 }, seed: 6.45 }
);

/** The hills around the horseshoe, opened along the approach valley. */
function mountains(x: number, z: number): number {
	const near = smoothstep(R + 120, R + 520, Math.hypot(x - 30, z));
	return range(x, z) * near * (1 - approach(x, z) * 0.92);
}

function ridges(x: number, z: number): number {
	const r = Math.hypot(x, z);
	const th = Math.atan2(z, x);
	const east = Math.cos(th);
	const crestH = 150 + 30 * noise(th * 2.2 + 3, 0.7) - 104 * smoothstep(0.72, 0.97, east) + 34 * Math.max(0, -east) ** 2;
	const w = r < R ? 190 : 300;
	const ridge = crestH * Math.exp(-(((r - R) / w) ** 2));
	const floor = bump(x, z, 80, 0, 560, 430) * 26;
	const summit = crag(x, z, SUMMIT.x, SUMMIT.z, 230, 200, 60, 2.2, 0.8);
	const rough = 0.82 + 0.36 * ridged(x / 150, z / 150, 4);
	return (Math.max(ridge, floor) + summit) * rough;
}

/** The summit is cut level at the lowest point of its rectangle. */
const SUMMIT_Y = (() => {
	let lo = Infinity;
	for (let i = 0; i <= 8; i++) for (let j = 0; j <= 6; j++) lo = Math.min(lo, ridges(SUMMIT.x - SUMMIT.w / 2 + (SUMMIT.w * i) / 8, SUMMIT.z - SUMMIT.d / 2 + (SUMMIT.d * j) / 6));
	return lo - 1;
})();

function outsideSummit(x: number, z: number): number {
	const dx = Math.abs(x - SUMMIT.x) - SUMMIT.w / 2;
	const dz = Math.abs(z - SUMMIT.z) - SUMMIT.d / 2;
	return Math.hypot(Math.max(dx, 0), Math.max(dz, 0));
}

function hills(x: number, z: number): number {
	const h = ridges(x, z);
	return outsideSummit(x, z) < 40 ? Math.min(h, SUMMIT_Y) : h;
}

const CREST = crestRing(hills, 30, 0, 120, R - 220, R + 160);

/** The Tang mound: a ramp of rammed earth from the plain up to the wall top. */
const MOUND = (() => {
	const dx = Math.cos(MOUND_BEARING);
	const dz = Math.sin(MOUND_BEARING);
	const wall = CREST.reduce((best, p) => (p[0] * dx + p[1] * dz > best[0] * dx + best[1] * dz ? p : best), CREST[0]);
	const top = hills(wall[0], wall[1]) + WALL_H - 1;
	return { x: wall[0] + dx * 120, z: wall[1] + dz * 120, dx, dz, top, wall };
})();

function mound(x: number, z: number): number {
	const lx = x - MOUND.x;
	const lz = z - MOUND.z;
	const along = lx * MOUND.dx + lz * MOUND.dz;
	const across = -lx * MOUND.dz + lz * MOUND.dx;
	const f = bump(along, across, 0, 0, 135, 70);
	return f > 0 ? Math.min(1, f * 1.7) * (MOUND.top - PLAIN) * (1 - smoothstep(-40, 130, along) * 0.75) : 0;
}

/** The Tang camp: on the approach valley floor, beyond bowshot of the gate. */
const CAMP = { x: 1350, z: 660, w: 380, d: 230, rot: Math.atan2(480, 700) };

function inCamp(x: number, z: number, pad = 20): boolean {
	const dx = x - CAMP.x;
	const dz = z - CAMP.z;
	const u = dx * Math.cos(CAMP.rot) + dz * Math.sin(CAMP.rot);
	const v = -dx * Math.sin(CAMP.rot) + dz * Math.cos(CAMP.rot);
	return Math.abs(u) < CAMP.w / 2 + pad && Math.abs(v) < CAMP.d / 2 + pad;
}

function makeGround(): Ground {
	const height = (x: number, z: number) => PLAIN + fbm(x / 400, z / 400) * 2 + mountains(x, z) + Math.max(hills(x, z), mound(x, z));
	const color = (x: number, z: number, y: number, slope: number): string => {
		const n = noise(x / 90, z / 90);
		if (outsideSummit(x, z) < 1) return n > 0 ? '#bdb296' : '#b3a98d';
		if (mound(x, z) > Math.max(1, hills(x, z))) return n > 0 ? '#c4a87c' : '#b89c72';
		if (slope > 0.62) return pick(['#8a857a', '#968f82', '#7e796f'], (n + 1) / 2);
		if (slope > 0.45) return n > 0 ? '#7f8a62' : '#76815b';
		if (inCamp(x, z, 0)) return n > 0 ? '#b9b07c' : '#b0a774';
		const rise = hills(x, z) + mountains(x, z);
		// greener in the hollows, olive and drier toward the crests
		if (rise > 160) return pick(['#5f7b45', '#66814a', '#58743f'], (n + 1) / 2);
		if (rise > 20) return pick(['#4f7a3c', '#578443', '#4a7339'], (n + 1) / 2);
		return y < PLAIN + 3 ? (n > 0 ? '#a7c068' : '#9fb862') : n > 0 ? '#8fb05a' : '#87a853';
	};
	const cover = (x: number, z: number, y: number, slope: number): number => {
		if (outsideSummit(x, z) < 10 || slope > 0.55 || mound(x, z) > 1 || inCamp(x, z)) return 0;
		const rise = hills(x, z) + mountains(x, z);
		// the woods thin out toward the bare crests of the higher ranges
		return smoothstep(20, 80, rise) * (1 - smoothstep(PLAIN + 260, PLAIN + 420, y) * 0.7) * (1 - slope);
	};
	return { height, color, cover };
}

const NEAR: Bounds = { minX: -1200, maxX: 1900, minZ: -1100, maxZ: 1900 };

export function buildAnsi(_opts: BuildOptions): SiteBuild {
	const g = makeGround();
	const s = startSite('ansi', g, { near: NEAR, cell: 6, far: 22000, farCell: 100, center: [300, 300], seed: 645 });
	const { p, root, b, forest, town, cover, labels, rand } = s;

	// the crest wall, open where the summit citadel and the valley gate take over
	const east = CREST.reduce((best, pt) => (pt[0] > best[0] ? pt : best), CREST[0]);
	const out = outwardOf(CREST);
	const summitC: P2 = [SUMMIT.x, SUMMIT.z];
	const nearSummit = (x: number, z: number) => outsideSummit(x, z) < 26;
	const nearGate = (x: number, z: number) => Math.hypot(x - east[0], z - east[1]) < 26;
	stoneWall(b, CREST, g.height, { h: WALL_H, t: 5, closed: true, outward: out, gaps: [{ at: summitC, half: 70 }, { at: east, half: 13 }], step: 4 });
	bastions(b, CREST, g.height, 64, { h: WALL_H, closed: true, outward: out, size: 8, lookout: 3, skip: (x, z) => nearSummit(x, z) || nearGate(x, z) || Math.hypot(x - MOUND.wall[0], z - MOUND.wall[1]) < 30 });
	wallBanners(b, CREST, g.height, 'wallRed', 36, { h: WALL_H, closed: true, outward: out, skip: (x, z) => nearSummit(x, z) || nearGate(x, z) });

	// the valley gate, across the mouth of the horseshoe
	const gRot = gateOnWall(CREST, east, { closed: true, outward: out }).rot;
	const gy = g.height(east[0], east[1]) - 0.5;
	const gate = munru(b, at(east[0], gy, east[1], gRot), { block: { w: 26, d: 12, h: WALL_H + 1.6, arch: 5 }, storeys: 2, red: true, bays: [3.4, 4, 4.4, 4, 3.4], depth: [3.2, 3.2], colH: 3.8 });
	labels.push({ id: 'gate', en: 'Valley gate', ko: '성문', at: [east[0], gy + gate.ridge + 6, east[1]], status: 'placed', note: 'Where the valley opens east; the gate form is the boards’ red munru' });

	// the summit citadel of the board
	const ring = rect(SUMMIT.x, SUMMIT.z, SUMMIT.w, SUMMIT.d);
	const rOut = outwardOf(ring);
	stoneWall(b, ring, g.height, { h: WALL_H - 1, t: 4, closed: true, outward: rOut, gaps: [{ at: [SUMMIT.x + SUMMIT.w / 2, SUMMIT.z], half: 5 }], step: 3 });
	bastions(b, ring, g.height, 30, { h: WALL_H - 1, closed: true, outward: rOut, size: 6, lookout: 2, t: 4 });
	const keep = redKeep(b, SUMMIT.x, SUMMIT_Y, SUMMIT.z - 6, [
		[-34, -2, Math.PI / 2],
		[34, -4, -Math.PI / 2],
		[-26, 22, Math.PI],
		[26, 22, Math.PI]
	]);
	banners(b, [[SUMMIT.x + 18, SUMMIT_Y, SUMMIT.z + 26]], 'wallRed', 10);
	labels.push({ id: 'command', en: 'Summit command post', ko: '장대', at: [SUMMIT.x, SUMMIT_Y + keep + 8, SUMMIT.z - 6], status: 'fictional', note: 'The board’s red halls; a lookout platform on the high point is likely, these halls are invented' });
	labels.push({ id: 'wall', en: 'Ridge wall', ko: '성벽', at: [CREST[30][0], g.height(CREST[30][0], CREST[30][1]) + 24, CREST[30][1]], status: 'excavated', note: 'Stone walls along the crests of a horseshoe of hills (Yingchengzi, Haicheng)' });

	// the Tang mound and the camp on the plain
	labels.push({ id: 'mound', en: 'Tang earthen mound', ko: '당군 토산', at: [MOUND.x, MOUND.top + 14, MOUND.z], status: 'recorded', note: 'Sixty days of rammed earth; it slumped onto the wall and Ansi took it' });
	root.add(tents(p, camp(b, g, rand, { ...CAMP, cloth: 'vermilion' })));
	labels.push({ id: 'camp', en: 'Tang camp', ko: '당군 진영', at: [CAMP.x, g.height(CAMP.x, CAMP.z) + 30, CAMP.z], status: 'placed', note: 'The histories put Taizong’s host under the walls for some three months; the camp layout is ours' });

	// the town inside the valley, its granaries, and the forest on the slopes
	const inValley = (x: number, z: number) => Math.hypot(x - 60, z) < R - 200 && hills(x, z) < 50;
	hamlet(town, forest, g, rand, { x: 60, z: 20, r: 190, n: 80, thatch: 0.55, ok: inValley });
	for (let k = 0; k < 4; k++) {
		const x = -130 + k * 22;
		const z = -150;
		hall(b, at(x, g.height(x, z), z), { bays: [3, 3, 3, 3], depth: [2.8, 2.8], colH: 2.6, base: 0.5, posts: 1.4, front: 'wall', roof: { kind: 'hip', h: 2.6 } });
	}
	const offWall = (x: number, z: number) => distanceToPath(CREST, x, z, true) > 14 && outsideSummit(x, z) > 18;
	scatterTrees(forest, g, NEAR, 12000, rand, (x, z) => offWall(x, z) && hills(x, z) + mountains(x, z) > 24 && mound(x, z) < 1 && !inCamp(x, z) && !nearGate(x, z), (r) => (r > 0.45 ? 'pine' : 'broad'), [8, 14]);
	for (let k = 0; k < 14000; k++) {
		const x = -R - 160 + rand() * (2 * R + 400);
		const z = -R - 160 + rand() * (2 * R + 320);
		if (!offWall(x, z)) continue;
		const y = g.height(x, z);
		const steep = Math.abs(g.height(x + 2, z) - y) + Math.abs(g.height(x, z + 2) - y);
		if (steep > 2) cover.add('rock', x, y - 0.3, z, 1.4 + rand() * 2.6);
		else if (hills(x, z) > 20 && rand() > 0.4) cover.add('shrub', x, y - 0.1, z, 0.8 + rand() * 0.8);
	}
	scatterCover(cover, g, { minX: -300, maxX: 420, minZ: -320, maxZ: 320 }, 14000, rand, inValley, 1);

	// the sea of cloud in the valleys of the range, open over the approach and the camp
	root.add(cloudSea(p, rand, { cx: 0, cz: 0, r0: R + 420, r1: 9000, y: PLAIN + 70, height: g.height, puffs: 90, open: (x, z) => approach(x, z) }));

	const sx = SUMMIT.x;
	const views: View[] = [
		{ id: 'board', en: 'Board view', ko: '그림 시점', pos: [sx + 160, SUMMIT_Y + 40, SUMMIT.z + 720], target: [sx, SUMMIT_Y + 4, SUMMIT.z], fov: 38 },
		{ id: 'summit', en: 'The summit', ko: '장대', pos: [sx + 70, SUMMIT_Y + 22, SUMMIT.z + 60], target: [sx, SUMMIT_Y + 6, SUMMIT.z - 6], fov: 48 },
		{ id: 'mound', en: 'The mound', ko: '토산', pos: [MOUND.x + MOUND.dz * 260 + MOUND.dx * 120, MOUND.top + 30, MOUND.z - MOUND.dx * 260 + MOUND.dz * 120], target: [MOUND.wall[0], MOUND.top, MOUND.wall[1]], fov: 44 },
		{ id: 'camp', en: 'From the Tang camp', ko: '당군 진영에서', pos: [CAMP.x + 260, g.height(CAMP.x + 260, CAMP.z + 200) + 60, CAMP.z + 200], target: [300, 60, 180], fov: 42 },
		{ id: 'gate', en: 'Valley gate', ko: '성문', pos: [east[0] + 120, g.height(east[0] + 120, east[1] + 20) + 6, east[1] + 20], target: [east[0], gy + 8, east[1]], fov: 44 },
		{ id: 'plan', en: 'Plan', ko: '평면', pos: [300, 2600, 700], target: [300, 0, 300], fov: 40 }
	];

	return assemble({
		...s,
		mist: {
			height: g.height,
			box: { minX: -4000, maxX: 4500, minZ: -4000, maxZ: 4500 },
			layers: [
				{ y: PLAIN + 3, opacity: 0.22 },
				{ y: PLAIN + 40, opacity: 0.12 }
			]
		},
		views,
		center: [200, 250],
		radius: 1100,
		haze: '#cdd6df'
	});
}
