import * as THREE from 'three';
import { noise, type P2 } from './geo';
import { at, box, cylinder, hall, gate, storeyed, painted, stoneLantern } from './kit';
import { buildRecipe } from './recipe';
import { plankBridge, PALACE_PAINT, LIFE_WATER, jangseung, hongsalmun } from './realms';
import { Folk } from './people';
import { Fleet } from './boats';
import type { BuildOptions, SiteBuild } from './types';

/*
 * The road west, before the flower field. The Three Way Path: the twelve passes, the White,
 * Yellow and Red waters, then the fork (right to Bliss, left to hell, the middle to Mujangsung's
 * spring on the shore of the Ocean of Life). Kangrim's road, the last of the seventy-eight, leaves
 * this fork's country and comes out on the south bank of the Gateway.
 */

/* ------------------------------------------------------------------ Three Way Path */

const TW = { plain: 20, water: 15, bed: 9, sea: 16, floor: -8, shore: -1150 };
/** The three living waters, outermost first, crossing the road north to south. */
const WATERS: { id: string; en: string; ko: string; x: number; color: string; note: string }[] = [
	{ id: 'baek', en: 'White River', ko: '백천', x: 1000, color: '#eef2f0', note: 'The first water a living soul meets on the road west' },
	{ id: 'hwang', en: 'Yellow River', ko: '황강', x: 760, color: '#e6bf4c', note: 'The middle water. Not the Yellow Springs, which lie deep among the dead' },
	{ id: 'jeok', en: 'Red River', ko: '적천', x: 520, color: '#c8423a', note: 'The last water before the fork' }
];
const riverPath = (x: number): P2[] => [
	[x + 260, -2600],
	[x + 90, -1200],
	[x - 40, -400],
	[x, 0],
	[x + 50, 500],
	[x - 60, 1300],
	[x - 220, 2600]
];
const FORK: P2 = [0, 0];
const BLISS: P2 = [-560, -1420];
const HELL: P2 = [-560, 1420];
const SPRING: P2 = [-1010, 90];
const lifeShore = (x: number, z: number) => (TW.shore - x + noise(z / 420, 3.1) * 140) / 70;

export function buildThreefold(_opts: BuildOptions): SiteBuild {
	return buildRecipe({
		name: 'threefold',
		seed: 33,
		near: { minX: -1700, maxX: 3000, minZ: -1800, maxZ: 1800 },
		cell: 9,
		plain: TW.plain,
		roll: 2.2,
		mountains: [
			{ x: 2300, z: -1400, rx: 800, rz: 1000, h: 520, seed: 1.3 },
			{ x: 2300, z: 1400, rx: 800, rz: 1000, h: 480, seed: 2.7 },
			{ x: 3900, z: 0, rx: 1300, rz: 1800, h: 640, seed: 3.9 }
		],
		// the saddle the road climbs: the twelfth pass
		hills: [{ x: 2100, z: 0, rx: 720, rz: 320, h: 110, seed: 4.2, power: 0.9 }],
		rivers: WATERS.map((w) => ({ path: riverPath(w.x), half: 24, water: TW.water, bed: TW.bed, color: w.color })),
		sea: { level: TW.sea, floor: TW.floor, mask: lifeShore, box: { minX: -9000, maxX: TW.shore + 400, minZ: -9000, maxZ: 9000 }, color: LIFE_WATER },
		look: {
			fields: ['#a9b07c', '#b4b886', '#9faa74', '#bdbd8a'],
			forest: ['#4f6a46', '#58744c', '#486242'],
			rock: '#8a8478',
			bed: '#9a9282',
			bank: '#d8ceb2',
			sand: '#efe6d2',
			// the three biomes meet at the fork: tundra toward Bliss, desert toward the fields, forest toward hell
			paint: (x, z, _y, slope, n) => {
				if (x > 200 || slope > 0.2) return null;
				const lean = Math.abs(z) - Math.max(0, x + 200) * 0.6;
				if (z < -260 && lean > 0) return n > 0.1 ? '#e8eef2' : '#d4dee6';
				if (z > 260 && lean > 0) return n > 0 ? '#3f5a3a' : '#4a6640';
				if (x < -160) return n > 0.15 ? '#e2cfa2' : '#d6c08e';
				return null;
			}
		},
		trees: { n: 3200, kinds: ['pine', 'broad'], min: 18 },
		grass: { n: 9000, box: { minX: -400, maxX: 1800, minZ: -900, maxZ: 900 } },
		extra: (c) => {
			const y = (x: number, z: number) => c.g.height(x, z);
			// the road west over the passes, then the fork three ways
			const west = c.road([[2950, 0], [2400, 10], [2100, 0], [1500, -10], [1000, 0], [500, 0], FORK], 7);
			c.road([FORK, [-120, -160], [-320, -620], BLISS], 6);
			c.road([FORK, [-120, 160], [-320, 620], HELL], 6);
			c.road([FORK, [-500, 10], [TW.shore + 60, 0]], 6);
			// twelve gates on the climb (열두 대문), one at each pass
			const climb = west.filter(([x]) => x > 1250 && x < 2800);
			for (let k = 0; k < 12; k++) {
				const [gx, gz] = climb[Math.round((k / 11) * (climb.length - 1))];
				const gy = y(gx, gz);
				gate(c.b, at(gx, gy, gz, Math.PI / 2), [4.4], [1.4], 4.2, { base: 0.3, roof: { chimi: false } });
				c.taken.add(gx, gz, 12, 12);
			}
			// a plank bridge where the road crosses each water
			for (const w of WATERS) {
				plankBridge(c.b, [w.x + 40, 0], [w.x - 40, 0], TW.water + 2.4, 6, TW.bed);
				c.labels.push({ id: w.id, en: w.en, ko: w.ko, at: [w.x, TW.water + 14, 260], status: 'fictional', note: w.note });
			}
			// the fork: two guardian posts, a marker stone, an old zelkova
			const fy = y(FORK[0], FORK[1]);
			jangseung(c.b, 18, fy, -14, -Math.PI / 2, 1.3);
			jangseung(c.b, 18, fy, 14, -Math.PI / 2, 1.2);
			box(c.b, 'stone', at(-26, fy, 0, Math.PI / 2), 0, 1.4, 0, 2, 2.8, 0.6, { bevel: 0.1 });
			c.forest.add('zelkova', 30, fy, -36, 18);
			c.taken.add(0, 0, 60, 60);
			// Bliss: a white-and-gilt gate pavilion at the end of the right-hand road, on the cold ground
			const by = y(BLISS[0], BLISS[1]);
			const bliss = painted(c.b, PALACE_PAINT.hwanin, () =>
				storeyed(
					c.b,
					at(BLISS[0], by, BLISS[1], Math.PI * 0.85),
					{ bays: [3.6, 4.4, 3.6], depth: [3, 3], colH: 5, base: 1.2, front: 'open', back: 'open', sides: 'wall', steps: ['s', 'n'], gateLine: 1 },
					[{ bays: [3.4, 4, 3.4], depth: [2.8, 2.8], colH: 3.6, front: 'doors', back: 'doors', sides: 'wall', roof: { chimi: true } }]
				)
			);
			c.taken.add(BLISS[0], BLISS[1], 30, 30);
			// hell: a black gate behind a red arrow gate at the end of the left-hand road, braziers either side
			const hy = y(HELL[0], HELL[1]);
			const hell = painted(c.b, PALACE_PAINT.gateway, () =>
				storeyed(
					c.b,
					at(HELL[0], hy, HELL[1], Math.PI * 0.15),
					{ bays: [3.6, 4.4, 3.6], depth: [3, 3], colH: 5, base: 1.2, front: 'open', back: 'open', sides: 'wall', steps: ['s', 'n'], gateLine: 1 },
					[{ bays: [3.4, 4, 3.4], depth: [2.8, 2.8], colH: 3.6, front: 'windows', back: 'wall', sides: 'wall', roof: { chimi: true } }]
				)
			);
			hongsalmun(c.b, HELL[0] + 18, y(HELL[0] + 18, HELL[1] - 40), HELL[1] - 40, Math.PI * 0.15, 9, 8, 'wallRed');
			for (const side of [1, -1]) {
				const bx = HELL[0] + side * 12;
				const bz = HELL[1] - 22;
				cylinder(c.b, 'stone', at(bx, y(bx, bz), bz), 0, 0.7, 0, 0.9, 0.6, 1.4, 10);
				c.b.lamps.push([bx, y(bx, bz) + 1.8, bz]);
			}
			c.taken.add(HELL[0], HELL[1], 30, 70);
			// the forest closes in round the left-hand road
			for (let k = 0; k < 2600; k++) {
				const x = -1500 + c.rand() * 1900;
				const z = 380 + c.rand() * 1400;
				if (!c.clear(x, z, 3) || Math.abs(z) - Math.max(0, x + 200) * 0.6 < 0) continue;
				c.forest.add(c.rand() > 0.35 ? 'pine' : 'broad', x, y(x, z), z, 10 + c.rand() * 8);
			}
			// Mujangsung's spring by the shore: his hut, the stone-rimmed spring, water jars, a woodpile, a fire
			const [sx, sz] = SPRING;
			const sy = y(sx, sz);
			hall(c.b, at(sx - 26, y(sx - 26, sz + 20), sz + 20, Math.PI / 2), { bays: [3, 3.4, 3], depth: [2.8, 2.8], colH: 2.8, base: 0.5, front: 'doors', roof: { tile: 'thatch' } });
			for (let k = 0; k < 18; k++) {
				const a = (k / 18) * Math.PI * 2;
				box(c.b, 'stone', at(sx + Math.cos(a) * 6, sy, sz + Math.sin(a) * 6, -a), 0, 0.35, 0, 1, 0.8, 2.2);
			}
			c.b.pushColored('water', new THREE.CylinderGeometry(5.6, 5.6, 0.1, 24).translate(sx, sy + 0.3, sz), LIFE_WATER);
			for (let k = 0; k < 3; k++) cylinder(c.b, 'brick', at(sx + 12 + k * 1.8, sy, sz - 6), 0, 0.6, 0, 0.6, 0.45, 1.2, 12);
			for (let k = 0; k < 5; k++) box(c.b, 'wood', at(sx + 12, sy, sz + 8), 0, 0.3 + k * 0.5, 0, 3, 0.45, 1.6);
			cylinder(c.b, 'stone', at(sx - 10, sy, sz - 10), 0, 0.4, 0, 1.1, 0.9, 0.8, 10);
			c.b.lamps.push([sx - 10, sy + 1.4, sz - 10]);
			c.taken.add(sx - 8, sz + 6, 60, 50);
			// a jetty into the Ocean of Life where the middle road runs out
			plankBridge(c.b, [TW.shore + 40, 0], [TW.shore - 90, 0], TW.sea + 1.2, 4, TW.floor);
			stoneLantern(c.b, TW.shore + 50, y(TW.shore + 50, -6), -6, 1.1);
			c.labels.push({ id: 'passes', en: 'Twelve Mountain Passes', ko: '열두고개', at: [2100, y(2100, 0) + 40, 0], status: 'fictional', note: 'Twelve gates on the last climb west; the dead and the living both pass under them' });
			c.labels.push({ id: 'fork', en: 'Three Way Path', ko: '세갈래길', at: [0, fy + 30, 0], status: 'fictional', note: 'Right to paradise, left to hell, the middle to the flower field' });
			c.labels.push({ id: 'bliss', en: 'The road to Bliss', ko: '극락 가는 길', at: [BLISS[0], by + bliss.ridge + 8, BLISS[1]], status: 'fictional', note: 'The right hand, over the cold ground' });
			c.labels.push({ id: 'hell', en: 'The road to hell', ko: '지옥 가는 길', at: [HELL[0], hy + hell.ridge + 8, HELL[1]], status: 'fictional', note: 'The left hand, into the forest' });
			c.labels.push({ id: 'mujangsung', en: 'Mujangsung’s spring', ko: '무장승의 약수', at: [sx, sy + 18, sz], status: 'fictional', note: 'Three years of water, three of wood, three of fire, and then he gives it up' });
			c.labels.push({ id: 'yaksu', en: 'Ocean of Life', ko: '약수', at: [TW.shore - 400, TW.sea + 30, 300], status: 'fictional', note: 'Three thousand li of weak water to the flower field' });
		},
		views: (c) => [
			{ id: 'fork', en: 'At the fork', ko: '갈림길에서', pos: [80, TW.plain + 7, 6], target: [-300, TW.plain + 3, 0], fov: 56 },
			{ id: 'passes', en: 'From the last pass', ko: '마지막 고개에서', pos: [2140, c.g.height(2140, 0) + 12, 18], target: [500, TW.plain, 0], fov: 46 },
			{ id: 'rivers', en: 'The three waters', ko: '세 물', pos: [1200, TW.plain + 70, 300], target: [600, TW.water, -40], fov: 50 },
			{ id: 'spring', en: 'Mujangsung’s spring', ko: '무장승의 샘', pos: [SPRING[0] + 60, TW.plain + 10, SPRING[1] + 50], target: [SPRING[0] - 10, TW.plain + 2, SPRING[1]], fov: 48 },
			{ id: 'above', en: 'Over the road west', ko: '서쪽 길 위', pos: [1500, 900, 1500], target: [100, 0, 0], fov: 46 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [600, 4400, 400], target: [600, 0, 0], fov: 40 }
		],
		mist: [
			{ y: TW.water + 1.2, opacity: 0.22 },
			{ y: TW.plain + 8, opacity: 0.1 }
		],
		center: [500, 0],
		radius: 1500,
		haze: '#e9cfc0',
		water: { color: '#ffffff', roughness: 0.16, metalness: 0.04, painted: true },
		realm: { top: '#3b4a8a', bottom: '#f6c9a0', fog: '#e9cfc0', fogNear: 500, fogFar: 7000, motes: '#fff0c8', sun: '#ffd9a8', sunI: 2.2, hemi: '#dcd6f0', light: 'golden' },
		weather: { motes: '#fff0c8' },
		life: (c) => {
			const folk = new Folk('silla', c.g.height, 33);
			folk.stand('monk', SPRING[0] - 6, SPRING[1] + 8, Math.PI / 2);
			folk.stand('woman', 26, 4, -Math.PI / 2);
			const fleet = new Fleet(TW.sea + 0.05, 'silla', 33);
			fleet.moor('skiff', TW.shore - 70, 7, Math.PI / 2);
			return { kingdom: 'silla', walk: [[2700, 3], [0, 3], [TW.shore + 50, 3]], height: c.g.height, seed: 33, people: 6, folk, fleet };
		}
	});
}

