import * as THREE from 'three';
import { fbm, noise, smoothstep, type Bounds } from './geo';
import { at, type Builder } from './kit';
import { type Ground } from './terrain';
import { mountainField, startSite, assemble, scatterTrees } from './common';
import { snowColor, cloudSea } from './fortress';
import type { BuildOptions, SiteBuild, View } from './types';

/*
 * Mt. Pektu (백두산). A white volcanic cone standing out of a cloud sea, Heaven Lake
 * in the crater, and one birch on the south rim. The `fall` camera and the sky
 * chariot share one line: the car sits partway from `FALL_POS` toward the birch,
 * so a film dolly along that view rushes the lens past the chariot and down onto
 * the rim. The chariot is heaven's car for this descent — open, gold and white —
 * and not the five-dragon car on Haemosu's isle.
 */

const RIM = 470;
const LAKE = 446;
const CRATER = 210;
const CLOUD = 205;
/** South rim, where the birch stands. +z is south. */
const BIRCH_X = 32;
const BIRCH_Z = CRATER + 16;

/**
 * The dive. The film's fall shot uses these numbers.
 * The camera sits well south of the cone and only a little above the line of
 * sight, so the upper frame is sky and the white head is the thing ahead.
 * The chariot is close to the lens (CHARIOT_T). A film dolly must stay under
 * that fraction or the lens flies through the car.
 */
const FALL_POS: [number, number, number] = [36, 760, 1480];
const FALL_TARGET: [number, number, number] = [BIRCH_X, RIM + 24, BIRCH_Z];
const CHARIOT_T = 0.2;
const CHARIOT_SCALE = 7;

const NEAR: Bounds = { minX: -1500, maxX: 1500, minZ: -1400, maxZ: 1500 };

const ranges = mountainField([
	{ x: -4600, z: -3000, rx: 1900, rz: 1500, h: 260, seed: 2.2 },
	{ x: 4800, z: -1800, rx: 1700, rz: 1600, h: 230, seed: 3.4 },
	{ x: -3800, z: 3600, rx: 1800, rz: 1400, h: 170, seed: 4.6 },
	{ x: 4100, z: 4000, rx: 1900, rz: 1500, h: 190, seed: 5.8 },
	{ x: 180, z: -5400, rx: 2500, rz: 1300, h: 210, seed: 6.1 }
]);

function cone(x: number, z: number): number {
	const d = Math.hypot(x * 0.94, z);
	const n = fbm(x / 240, z / 240, 3);
	if (d <= CRATER) {
		const t = d / CRATER;
		const floor = LAKE - 26;
		return floor + (RIM - floor) * Math.pow(t, 1.85) + n * 1.4 * t;
	}
	const u = Math.min(1, (d - CRATER) / 980);
	const flank = RIM * Math.pow(1 - u, 1.55);
	return Math.max(0, flank + n * 8 * smoothstep(0.04, 0.4, u));
}

function makeGround(): Ground {
	const height = (x: number, z: number) => ranges(x, z) * 0.35 + cone(x, z);
	const color = (x: number, z: number, y: number, slope: number): string => {
		const d = Math.hypot(x * 0.94, z);
		const n = noise(x / 23, z / 23);
		if (d < CRATER * 0.72 && y < LAKE + 1) return n > 0 ? '#3e4a58' : '#2e3844';
		if (d < CRATER + 8 && slope > 0.32) return n > 0 ? '#6e6a64' : '#5a564f';
		if (y > RIM - 110) return n > 0 ? '#f4f7fb' : '#e3e9f0';
		return snowColor(slope, n);
	};
	const cover = (x: number, z: number, y: number, slope: number): number => {
		const d = Math.hypot(x, z);
		if (d < CRATER + 24 || slope > 0.7 || y > RIM - 40) return 0;
		return y > CLOUD ? 0.35 : 0.15;
	};
	return { height, color, cover };
}

function mix3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
	return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Local +z points along the dive, nose down toward the birch. */
function diveMatrix(from: [number, number, number], to: [number, number, number], scale: number): THREE.Matrix4 {
	const dx = to[0] - from[0];
	const dy = to[1] - from[1];
	const dz = to[2] - from[2];
	const horiz = Math.hypot(dx, dz) || 1;
	const yaw = Math.atan2(dx, dz);
	const pitch = Math.atan2(-dy, horiz);
	const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
	return new THREE.Matrix4().compose(new THREE.Vector3(from[0], from[1], from[2]), q, new THREE.Vector3(scale, scale, scale));
}

function put(b: Builder, mat: 'gold' | 'white' | 'wood' | 'dark' | 'cloud' | 'stone' | 'green' | 'lawn', geo: THREE.BufferGeometry, local: THREE.Matrix4, world: THREE.Matrix4): void {
	b.push(mat, geo, world.clone().multiply(local));
}

/** Open sky chariot on the dive line. Built facing +z, then aimed down the fall. */
function skyChariot(b: Builder, world: THREE.Matrix4): void {
	const bed = new THREE.BoxGeometry(6.2, 0.45, 11);
	put(b, 'gold', bed, at(0, 0, 0), world);
	put(b, 'wood', new THREE.BoxGeometry(5.2, 0.18, 9.4), at(0, 0.28, -0.2), world);
	// rails
	for (const x of [-2.7, 2.7]) {
		put(b, 'gold', new THREE.BoxGeometry(0.18, 0.7, 10.2), at(x, 0.7, 0), world);
	}
	put(b, 'gold', new THREE.BoxGeometry(5.6, 0.7, 0.18), at(0, 0.7, -5.2), world);
	// canopy: four posts and a pale roof, open at the front
	for (const [x, z] of [[-2.2, -3.2], [2.2, -3.2], [-2.2, 1.2], [2.2, 1.2]] as [number, number][]) {
		put(b, 'gold', new THREE.BoxGeometry(0.16, 3.1, 0.16), at(x, 2.1, z), world);
	}
	put(b, 'white', new THREE.BoxGeometry(5.4, 0.16, 5.6), at(0, 3.7, -1), world);
	// the man, at the back of the car where the chase camera sees him: gold cloak, pale head
	put(b, 'gold', new THREE.BoxGeometry(1.15, 2.2, 0.55), at(0, 1.8, -4.4), world);
	put(b, 'white', new THREE.SphereGeometry(0.42, 10, 8), at(0, 3.15, -4.35), world);
	put(b, 'gold', new THREE.BoxGeometry(0.28, 1.15, 0.28), at(-0.9, 2, -4.1), world);
	put(b, 'gold', new THREE.BoxGeometry(0.28, 1.15, 0.28), at(0.9, 2, -4.1), world);
	for (const x of [-3.15, 3.15]) {
		for (const z of [-3.1, 3.2]) {
			const wheel = new THREE.CylinderGeometry(1.35, 1.35, 0.22, 14);
			wheel.rotateZ(Math.PI / 2);
			put(b, 'dark', wheel, at(x, -0.15, z), world);
		}
	}
}

/** The one tree on the rim: white bark, a dark dash, a green crown. */
function sacredBirch(b: Builder, x: number, y: number, z: number): void {
	const h = 22;
	put(b, 'white', new THREE.CylinderGeometry(0.42, 0.85, h, 8), at(x, y + h * 0.46, z), new THREE.Matrix4());
	for (let i = 0; i < 6; i++) {
		put(b, 'dark', new THREE.BoxGeometry(0.1, 0.32, 0.05), at(x + 0.62, y + 3.2 + i * 2.5, z), new THREE.Matrix4());
	}
	put(b, 'green', new THREE.IcosahedronGeometry(6.5, 1), at(x, y + h * 0.78, z), new THREE.Matrix4());
	put(b, 'lawn', new THREE.IcosahedronGeometry(4.2, 0), at(x + 2.4, y + h * 0.62, z + 1.6), new THREE.Matrix4());
	put(b, 'green', new THREE.IcosahedronGeometry(3.4, 0), at(x - 2.1, y + h * 0.7, z - 1.2), new THREE.Matrix4());
	// stones at the roots
	for (let i = 0; i < 8; i++) {
		const a = (i / 8) * Math.PI * 2;
		put(b, 'stone', new THREE.BoxGeometry(0.7, 0.45, 0.55), at(x + Math.cos(a) * 3.2, y + 0.2, z + Math.sin(a) * 3.2, a), new THREE.Matrix4());
	}
	// the man, arrived: gold cloak at the tree, facing the lake
	put(b, 'gold', new THREE.BoxGeometry(0.55, 1.15, 0.32), at(x + 1.4, y + 0.85, z + 1.6), new THREE.Matrix4());
	put(b, 'white', new THREE.SphereGeometry(0.18, 8, 6), at(x + 1.4, y + 1.55, z + 1.6), new THREE.Matrix4());
}

export function buildPaektu(_opts: BuildOptions): SiteBuild {
	const g = makeGround();
	const s = startSite('paektu', g, { near: NEAR, cell: 8, far: 18000, farCell: 85, center: [0, 40], seed: 73, palette: { snow: 0.9 } });
	const { p, root, b, forest, cover, labels, rand } = s;

	const lake = new THREE.CircleGeometry(CRATER * 0.7, 64);
	lake.rotateX(-Math.PI / 2);
	b.push('water', lake, at(0, LAKE, 0));

	const by = g.height(BIRCH_X, BIRCH_Z);
	sacredBirch(b, BIRCH_X, by, BIRCH_Z);

	const chariotAt = mix3(FALL_POS, FALL_TARGET, CHARIOT_T);
	skyChariot(b, diveMatrix(chariotAt, FALL_TARGET, CHARIOT_SCALE));

	// cloud banks off the dive line, up in the sky, so the fall reads as a tunnel
	for (let i = 0; i < 8; i++) {
		const t = 0.28 + (i % 4) * 0.08;
		const side = i < 4 ? -1 : 1;
		const p3 = mix3(FALL_POS, FALL_TARGET, t);
		const puff = new THREE.SphereGeometry(28 + (i % 3) * 16, 8, 6);
		b.push('cloud', puff, at(p3[0] + side * (180 + (i % 3) * 40), p3[1] + 80, p3[2]));
	}

	scatterTrees(
		forest,
		g,
		NEAR,
		4200,
		rand,
		(x, z) => {
			const d = Math.hypot(x, z);
			const y = g.height(x, z);
			return d > CRATER + 50 && y > CLOUD - 20 && y < RIM - 130;
		},
		() => 'pine',
		[7, 13]
	);
	for (let k = 0; k < 2400; k++) {
		const x = -900 + rand() * 1800;
		const z = -800 + rand() * 1700;
		const d = Math.hypot(x, z);
		if (d < CRATER + 30) continue;
		const y = g.height(x, z);
		if (y < CLOUD || y > RIM - 20) continue;
		const steep = Math.abs(g.height(x + 3, z) - y) + Math.abs(g.height(x, z + 3) - y);
		if (steep < 1.2 && rand() > 0.4) continue;
		cover.add(steep > 2.4 ? 'rock' : 'shrub', x, y - 0.2, z, steep > 2.4 ? 1.4 + rand() * 2 : 0.6 + rand());
	}

	root.add(cloudSea(p, rand, { cx: 0, cz: 40, r0: 280, r1: 8000, y: CLOUD, height: g.height, puffs: 140, open: (x, z) => smoothstep(CLOUD + 30, CLOUD + 140, g.height(x, z)) }));

	labels.push({ id: 'birch', en: 'The birch', ko: '신단수', at: [BIRCH_X, by + 16, BIRCH_Z], status: 'fictional', note: 'The one tree on the south rim, where the chariot comes down' });
	labels.push({ id: 'lake', en: 'Heaven Lake', ko: '천지', at: [0, LAKE + 4, 0], status: 'placed', note: 'The crater lake on the white head' });
	labels.push({ id: 'head', en: 'The white head', ko: '백두', at: [0, RIM + 8, -CRATER], status: 'placed', note: 'The north rim of the crater' });

	const views: View[] = [
		{ id: 'fall', en: 'The fall', ko: '하강', pos: FALL_POS, target: FALL_TARGET, fov: 34 },
		{ id: 'rim', en: 'The birch', ko: '신단수', pos: [BIRCH_X, by + 4, BIRCH_Z + 26], target: [BIRCH_X, by + 9, BIRCH_Z - 6], fov: 38 },
		{ id: 'lake', en: 'Heaven Lake', ko: '천지', pos: [-40, LAKE + 6, -30], target: [BIRCH_X, by + 10, BIRCH_Z], fov: 46 },
		{ id: 'below', en: 'From the clouds', ko: '구름 아래', pos: [80, CLOUD + 40, 720], target: [0, RIM, 0], fov: 42 },
		{ id: 'board', en: 'The white head', ko: '백두산', pos: [640, RIM + 180, 860], target: [0, RIM - 20, 20], fov: 40 },
		{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 1600, 80], target: [0, 0, 40], fov: 38 }
	];

	return assemble({
		...s,
		mist: {
			height: g.height,
			box: { minX: -2800, maxX: 2800, minZ: -2800, maxZ: 2800 },
			layers: [
				{ y: CLOUD - 8, opacity: 0.42 },
				{ y: CLOUD + 22, opacity: 0.16 }
			]
		},
		views,
		center: [0, 80],
		radius: 640,
		haze: '#d5e0ea',
		water: { color: '#1c4e62', roughness: 0.18, metalness: 0.35 },
		weather: { snow: true }
	});
}
