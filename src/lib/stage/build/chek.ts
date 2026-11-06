import { fbm, noise, smoothstep, distanceToSegment, rect, type P2, type Bounds } from './geo';
import { at, hall, stoneWall, ribbon } from './kit';
import { type Ground } from './terrain';
import { lerp, mountainField, startSite, assemble, scatterTrees } from './common';
import { munru, gateBlock, wallBanners, banners, bastions, crag, snowColor, cloudSea, outwardOf, redKeep } from './fortress';
import type { BuildOptions, SiteBuild, View } from './types';

/*
 * Chek Fortress (책성), the Yeon clan's home in the snow country of the Eastern Commandery.
 * Built from the two chronicle boards: a walled summit on a granite pinnacle above a sea of
 * cloud, with a red two-storey keep (pl_yeon_fortress), and the walled causeway climbing a ridge
 * to a red two-tier gate pavilion over a round arch (pl_chek_fortress). The site is placed.
 */

const TOP = 300;
const CLOUD = 175;
const WALL_H = 6.5;
/** The walled summit: centre, width, depth. */
const KEEP = { x: 0, z: 0, w: 150, d: 110 };
const SOUTH_Z = KEEP.z + KEEP.d / 2;
/** The ridge the causeway climbs, from the south wall down to the outer gate. */
const SPUR: [P2, P2] = [
	[0, SOUTH_Z],
	[30, 430]
];
const SPUR_DROP = 115;

const mountains = mountainField([
	{ x: -2600, z: -1800, rx: 1500, rz: 1200, h: 980, seed: 1.7 },
	{ x: -3900, z: 400, rx: 1300, rz: 1500, h: 860, seed: 2.1 },
	{ x: 2900, z: -2300, rx: 1600, rz: 1300, h: 1150, seed: 3.6 },
	{ x: 4200, z: 300, rx: 1300, rz: 1600, h: 900, seed: 4.2 },
	{ x: 300, z: -4600, rx: 2600, rz: 1400, h: 1300, seed: 5.3 },
	{ x: -1500, z: 4200, rx: 1700, rz: 1400, h: 640, seed: 6.8 },
	{ x: 2600, z: 4600, rx: 1800, rz: 1500, h: 720, seed: 7.4 },
	{ x: -7600, z: -2600, rx: 3200, rz: 2800, h: 1500, seed: 8.2 },
	{ x: 7400, z: -4200, rx: 3400, rz: 3000, h: 1700, seed: 9.9 }
]);

/** How far outside the summit rectangle a point is (0 inside). */
function outsideKeep(x: number, z: number): number {
	const dx = Math.abs(x - KEEP.x) - KEEP.w / 2;
	const dz = Math.abs(z - KEEP.z) - KEEP.d / 2;
	return Math.hypot(Math.max(dx, 0), Math.max(dz, 0));
}

/** Where along the spur a point lies (0 at the wall, 1 at the outer gate) and how far off it. */
function spurAt(x: number, z: number): { t: number; d: number } {
	const [a, b] = SPUR;
	const lx = b[0] - a[0];
	const lz = b[1] - a[1];
	const t = Math.min(1, Math.max(0, ((x - a[0]) * lx + (z - a[1]) * lz) / (lx * lx + lz * lz)));
	return { t, d: distanceToSegment(x, z, a, b) };
}

function pinnacle(x: number, z: number): number {
	// a granite tower, not a mesa: the summit is levelled only under the walls and drops away in
	// buttressed cliffs; lower crags shoulder it south-east and south-west
	let y = crag(x, z, 0, 10, 430, 380, 335, 1.9, 0.95) + crag(x, z, 120, 170, 200, 200, 190, 3.4, 0.85) + crag(x, z, -170, 120, 210, 190, 170, 4.1, 0.85);
	y = Math.min(y, TOP - 3 + fbm(x / 30, z / 30, 2) * 2);
	const rim = outsideKeep(x, z);
	if (rim < 40) y = lerp(TOP, y, smoothstep(8, 40, rim));
	const s = spurAt(x, z);
	const ridge = lerp(TOP - 1, TOP - SPUR_DROP, s.t) - (s.d / 16) ** 2 * 9;
	return Math.max(y, ridge);
}

function makeGround(): Ground {
	const height = (x: number, z: number) => fbm(x / 500, z / 500) * 6 + mountains(x, z) + pinnacle(x, z);
	const color = (x: number, z: number, _y: number, slope: number): string => {
		const n = noise(x / 23, z / 23);
		if (outsideKeep(x, z) < 1) return n > 0 ? '#e9ecef' : '#dde1e6';
		return snowColor(slope, n);
	};
	const cover = (x: number, z: number, y: number, slope: number): number => {
		if (outsideKeep(x, z) < 12 || slope > 0.62) return 0;
		const peak = mountains(x, z);
		if (y > 120 && pinnacle(x, z) > 60) return 0.75;
		return peak > 40 && y < 900 ? 0.5 * smoothstep(40, 200, peak) : 0.1;
	};
	return { height, color, cover };
}

const NEAR: Bounds = { minX: -700, maxX: 700, minZ: -650, maxZ: 750 };

export function buildChek(_opts: BuildOptions): SiteBuild {
	const g = makeGround();
	const s = startSite('chek', g, { near: NEAR, cell: 4, far: 22000, farCell: 90, center: [0, 0], seed: 98, palette: { snow: 0.85 } });
	const { p, root, b, forest, cover, labels, rand } = s;

	// the summit wall, its corner bastions and the red banners
	const ring = rect(KEEP.x, KEEP.z, KEEP.w, KEEP.d);
	const out = outwardOf(ring);
	const gateAt: P2 = [0, SOUTH_Z];
	stoneWall(b, ring, g.height, { h: WALL_H, t: 4.4, closed: true, outward: out, gaps: [{ at: gateAt, half: 12 }], step: 3 });
	bastions(b, ring, g.height, 37, { h: WALL_H, closed: true, outward: out, size: 7, lookout: 2, t: 4.4, skip: (x, z) => Math.hypot(x - gateAt[0], z - gateAt[1]) < 26 });
	wallBanners(b, ring, g.height, 'wallRed', 19, { h: WALL_H, closed: true, outward: out, skip: (x, z) => Math.hypot(x - gateAt[0], z - gateAt[1]) < 18 });

	// the board's gate: a red two-tier pavilion on an arched block, flags on the parapet
	const gateRes = munru(b, at(gateAt[0], TOP - 0.4, gateAt[1]), {
		block: { w: 24, d: 12, h: WALL_H + 1.8, arch: 5 },
		storeys: 2,
		red: true,
		bays: [3.6, 4.2, 4.6, 4.2, 3.6],
		depth: [3.4, 3.6, 3.4],
		colH: 4
	});
	banners(b, [-10, -7, 7, 10].map((dx) => [gateAt[0] + dx, TOP + WALL_H + 1.4, gateAt[1] + 4] as [number, number, number]), 'wallRed', 6.5);

	// the keep (a red two-storey hall on a stone platform) and the red halls round the yard
	const keepZ = KEEP.z - 14;
	const keepRidge = redKeep(b, KEEP.x, TOP, keepZ, [
		[-52, -16, Math.PI / 2],
		[52, -16, -Math.PI / 2],
		[-50, 28, Math.PI / 2],
		[50, 28, -Math.PI / 2],
		[-30, 48, Math.PI],
		[32, 48, Math.PI]
	]);
	b.lampPost(gateAt[0] - 7, TOP, gateAt[1] - 10);
	b.lampPost(gateAt[0] + 7, TOP, gateAt[1] - 10);

	// the walled causeway down the ridge, a small gate halfway and the outer gate at its foot
	const [a, c] = SPUR;
	const len = Math.hypot(c[0] - a[0], c[1] - a[1]);
	const ux = (c[0] - a[0]) / len;
	const uz = (c[1] - a[1]) / len;
	const along = (d: number, side: number): P2 => [a[0] + ux * d + uz * side, a[1] + uz * d - ux * side];
	const inner = 150;
	for (const side of [5.5, -5.5]) {
		for (const [d0, d1] of [
			[14, inner - 6],
			[inner + 6, len - 8]
		]) {
			stoneWall(b, [along(d0, side), along(d1, side)], g.height, { h: 2.6, t: 1.4, outward: side > 0 ? 1 : -1, step: 3 });
		}
	}
	b.push('paving', ribbon([along(4, 0), along(len - 2, 0)], 9, (x, z) => g.height(x, z) + 0.08));
	const spurRot = Math.atan2(ux, uz);
	const [ix, iz] = along(inner, 0);
	const iy = g.height(ix, iz) - 0.3;
	const ib = gateBlock(b, at(ix, iy, iz, spurRot), { w: 14, d: 8, h: 6.2, arch: 3.6 });
	hall(b, at(ix, iy + ib, iz, spurRot), { bays: [3.4], depth: [3.4], colH: 2.8, base: 0.3, front: 'open', back: 'open', sides: 'open', roof: { kind: 'pyramid', h: 3.2, chimi: false } });
	banners(b, [[ix + 4, iy + ib, iz]], 'wallRed', 7, spurRot);
	const [ox, oz] = along(len - 4, 0);
	const oy = g.height(ox, oz) - 0.4;
	munru(b, at(ox, oy, oz, spurRot), { block: { w: 18, d: 9, h: 6.6, arch: 4 }, bays: [3.2, 3.8, 3.2], depth: [3, 3], colH: 3.4, red: true });

	labels.push({ id: 'keep', en: 'The Yeon keep', ko: '연씨 본성', at: [KEEP.x, TOP + keepRidge + 8, keepZ], status: 'fictional', note: 'Massing from the chronicle board; the Yeon home here is the chronicle’s' });
	labels.push({ id: 'gate', en: 'Summit gate', ko: '정문', at: [gateAt[0], TOP + gateRes.ridge + 5, gateAt[1]], status: 'fictional', note: 'Red two-tier pavilion on an arched block, after the board' });
	labels.push({ id: 'causeway', en: 'Ridge causeway', ko: '능선 길', at: [ix, iy + 18, iz], status: 'fictional', note: 'The walled causeway is the board’s' });

	// snow pines on every ledge of the pinnacle, sparse on the far slopes
	const offWalls = (x: number, z: number) => outsideKeep(x, z) > 14 && spurAt(x, z).d > 14;
	scatterTrees(forest, g, { minX: -460, maxX: 460, minZ: -420, maxZ: 520 }, 7000, rand, (x, z) => offWalls(x, z) && g.height(x, z) > CLOUD - 30 && g.height(x, z) < TOP - 4, () => 'pine', [7, 12]);
	scatterTrees(forest, g, NEAR, 3000, rand, (x, z) => offWalls(x, z) && g.height(x, z) < CLOUD - 30, () => 'pine', [9, 15]);
	for (let k = 0; k < 9000; k++) {
		const x = -460 + rand() * 920;
		const z = -420 + rand() * 940;
		if (!offWalls(x, z)) continue;
		const y = g.height(x, z);
		if (y < CLOUD - 40) continue;
		const steep = Math.abs(g.height(x + 2, z) - y) + Math.abs(g.height(x, z + 2) - y);
		cover.add(steep > 2.2 ? 'rock' : 'shrub', x, y - 0.2, z, steep > 2.2 ? 1.2 + rand() * 2.4 : 0.8 + rand() * 0.8);
	}

	// the sea of cloud the summit stands out of
	root.add(cloudSea(p, rand, { cx: 0, cz: 40, r0: 240, r1: 8000, y: CLOUD, height: g.height, puffs: 150 }));

	const [vx, vz] = along(len - 30, 0);
	const views: View[] = [
		{ id: 'board', en: 'Above the clouds', ko: '구름 위', pos: [520, TOP + 150, 760], target: [0, TOP - 10, 0], fov: 40 },
		{ id: 'gate', en: 'The causeway gate', ko: '능선의 문', pos: [vx - 6, g.height(vx, vz) + 3, vz], target: [gateAt[0], TOP + 12, gateAt[1]], fov: 46 },
		{ id: 'yard', en: 'The keep yard', ko: '본성 마당', pos: [KEEP.x + 40, TOP + 14, KEEP.z + 46], target: [KEEP.x, TOP + 8, keepZ], fov: 50 },
		{ id: 'cliff', en: 'Under the cliff', ko: '절벽 아래', pos: [-420, CLOUD + 20, -260], target: [0, TOP, 0], fov: 44 },
		{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 1500, 300], target: [0, 0, 60], fov: 40 }
	];

	return assemble({
		...s,
		mist: {
			height: g.height,
			box: { minX: -2600, maxX: 2600, minZ: -2600, maxZ: 2600 },
			layers: [
				{ y: CLOUD - 6, opacity: 0.4 },
				{ y: CLOUD + 18, opacity: 0.18 }
			]
		},
		views,
		center: [0, 120],
		radius: 520,
		haze: '#cfd8e2'
	});
}
