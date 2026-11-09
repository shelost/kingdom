import { Region, rect, boundsOf, distanceToPath, type P2 } from './geo';
import { at, box, tents, court, pavedCourt, storeyed, hall, stoneLantern, type HallSpec } from './kit';
import { gridTown } from './common';
import { camp, bastions, cornerTowers, outwardOf } from './fortress';
import { buildRecipe, garrison } from './recipe';
import { reach } from './life';
import { Folk } from './people';
import type { BuildOptions, SiteBuild } from './types';

/*
 * Goguryeo's western corner fortress: Yodong faces west over the Liao. Buyeo Fortress is an era of
 * the Buyeo site, Hanseong an era of the Han Fortress; Chek (east) and Pyongyang (centre) have
 * their own builders.
 */

export const RED_HALL: HallSpec = { bays: [4, 4.6, 5, 4.6, 4], depth: [4, 4.4, 4], colH: 5, base: 1.4, steps: ['s'], roof: { chimi: true, tile: 'tileRed' } };
export const RED_WING: HallSpec = { bays: [3.4, 3.8, 3.8, 3.4], depth: [3, 3], colH: 3.6, base: 0.7, front: 'doors', back: 'red', sides: 'red', roof: { tile: 'tileRed' } };

/* ------------------------------------------------------------------ Yodong */

/*
 * Laid out after the Yodong Fortress mural (요동성총) and its museum model: a rectangular plain city
 * with an inner walled city in the south-west corner, single-storey corner towers, two-storey gate
 * towers east and west and a one-storey south gate (the board keeps its two-tier munru), bastions
 * with lookouts, a moat on the west, a small walled ward on the south-east, and a tower standing
 * outside the east gate. Inside the inner city stand a two-storey tiled hall and a three-storey
 * timber tower, read here as the shrine of Jumong the Tang annals record at Yodong in 645.
 */
const YD = { plain: 20, water: 16, bed: 9, wallH: 9, innerH: 7 };
const YD_RING = rect(0, -220, 1100, 820);
const YD_INNER = rect(-280, -50, 460, 360);
const YD_WARD = rect(720, 60, 200, 160);
const YD_MOAT: P2[] = [...rect(0, -220, 1190, 910), rect(0, -220, 1190, 910)[0]];
/** The Taizi, braided: a main channel and a side channel round a long sandbar, both running west. */
const TAIZI: P2[] = [
	[5200, -900],
	[3200, -260],
	[1700, 330],
	[700, 520],
	[-500, 560],
	[-1800, 720],
	[-3400, 1150],
	[-5600, 1600]
];
const TAIZI_SIDE: P2[] = [
	[1900, 340],
	[1100, 760],
	[100, 860],
	[-900, 820],
	[-1900, 760]
];
const YD_PALACE = { x: -300, z: -80 };
const YD_SHRINE = { x: -150, z: 50 };
const YD_GRANARY = { x: 300, z: -520, w: 380, d: 150 };
const YD_GATE = {
	south: [200, 190] as P2,
	west: [-550, -400] as P2,
	east: [550, -320] as P2,
	innerEast: [-50, -60] as P2,
	innerNorth: [-280, -230] as P2
};
const TWO_STOREY = { block: { w: 26, d: 12, h: YD.wallH + 2, arch: 5 }, storeys: 2 as const, red: true, bays: [3.6, 4.2, 4.6, 4.2, 3.6], depth: [3.4, 3.6], colH: 4 };

export function buildYodong(_opts: BuildOptions): SiteBuild {
	return buildRecipe({
		name: 'yodong',
		seed: 404,
		near: { minX: -2200, maxX: 2400, minZ: -1600, maxZ: 1700 },
		cell: 8,
		plain: YD.plain,
		roll: 1.2,
		palette: { redTiles: true },
		mountains: [
			{ x: 4600, z: -2200, rx: 2400, rz: 2600, h: 520, seed: 1.4 },
			{ x: 3400, z: 2800, rx: 2000, rz: 1800, h: 360, seed: 2.2 },
			{ x: 7600, z: 300, rx: 3200, rz: 3400, h: 900, seed: 3.1 },
			// Mashou (首山), the hill south-west of the city where Taizong pitched his command
			{ x: -3900, z: 2700, rx: 900, rz: 760, h: 180, seed: 5.2 }
		],
		// the bluff the board's munru stands on, at the south-east corner over the river
		hills: [{ x: 520, z: 140, rx: 220, rz: 140, h: 22, seed: 4.4, power: 1.1 }],
		rivers: [
			{ path: TAIZI, half: 140, water: YD.water, bed: YD.bed },
			{ path: TAIZI_SIDE, half: 55, water: YD.water, bed: YD.bed + 2 },
			{ path: YD_MOAT, half: 7, water: YD.water + 0.6, bed: YD.bed + 4 }
		],
		look: {
			fields: ['#a3ae68', '#b2b874', '#98a660', '#bdbd7e', '#a9b06c'],
			forest: ['#5b7341', '#66794a', '#526a3d'],
			rock: '#857e6e',
			bed: '#8f8a6c',
			bank: '#d8cfab'
		},
		walls: () => [
			{
				ring: YD_RING,
				h: YD.wallH,
				t: 6,
				mat: 'rampart',
				cloth: 'wallRed',
				every: 40,
				torches: 60,
				gates: [
					{ near: YD_GATE.south, munru: { block: { w: 28, d: 13, h: YD.wallH + 3, arch: 5 }, storeys: 2, red: true, bays: [3.8, 4.4, 4.8, 4.4, 3.8], depth: [3.6, 3.8, 3.6], colH: 4.4 } },
					{ near: YD_GATE.west, munru: TWO_STOREY },
					{ near: YD_GATE.east, munru: TWO_STOREY }
				]
			},
			{
				ring: YD_INNER,
				h: YD.innerH,
				t: 5,
				mat: 'rampart',
				cloth: 'wallRed',
				every: 36,
				torches: 50,
				gates: [
					{ near: YD_GATE.innerEast, munru: { block: { w: 20, d: 10, h: YD.innerH + 1, arch: 4 }, red: true, bays: [3.2, 3.8, 3.2], depth: [3, 3], colH: 3.6 } },
					{ near: YD_GATE.innerNorth, munru: { block: { w: 20, d: 10, h: YD.innerH + 1, arch: 4 }, red: true, bays: [3.2, 3.8, 3.2], depth: [3, 3], colH: 3.6 } }
				]
			},
			{
				ring: YD_WARD,
				h: YD.innerH,
				t: 5,
				mat: 'rampart',
				cloth: 'wallRed',
				every: 30,
				gates: [{ near: [820, 60], munru: { block: { w: 18, d: 10, h: YD.innerH + 1, arch: 4 }, red: true, bays: [3, 3.6, 3], depth: [2.8, 2.8], colH: 3.4 } }]
			}
		],
		courts: [
			{
				...YD_PALACE,
				w: 170,
				d: 140,
				pave: 'gravel',
				main: RED_HALL,
				upper: { bays: [3.6, 4.2, 4.2, 3.6], depth: [3.6, 3.6], colH: 4, front: 'doors', back: 'red', sides: 'red', roof: { chimi: true, tile: 'tileRed' } },
				wings: RED_WING,
				label: { id: 'yamen', en: 'Commander’s hall', ko: '성주 관아', status: 'recorded', note: 'The Yodong mural shows a two-storey tiled hall inside the inner city' }
			}
		],
		hamlets: [
			{ x: 1400, z: -700, r: 220, n: 18, thatch: 0.9 },
			{ x: -1300, z: 1300, r: 200, n: 14, thatch: 0.9 }
		],
		trees: { n: 6000, kinds: ['pine', 'broad', 'broad'], min: 18 },
		grass: { n: 14000, box: { minX: -1600, maxX: 1800, minZ: -1200, maxZ: 1200 } },
		extra: (c) => {
			const { b } = c;
			const y = (x: number, z: number) => c.g.height(x, z);
			// bastions on the outer wall, single-storey corner towers on both walls
			bastions(b, YD_RING, y, 92, { h: YD.wallH, closed: true, outward: outwardOf(YD_RING), size: 10, mat: 'rampart', lookout: 2, tile: 'tileRed', t: 6, skip: (x, z) => Object.values(YD_GATE).some(([gx, gz]) => Math.hypot(x - gx, z - gz) < 40) || YD_RING.some(([cx, cz]) => Math.hypot(x - cx, z - cz) < 40) });
			cornerTowers(b, YD_RING, y, { h: YD.wallH, size: 18, mat: 'rampart', tile: 'tileRed' });
			cornerTowers(b, YD_INNER, y, { h: YD.innerH, size: 13, mat: 'rampart', tile: 'tileRed' });
			cornerTowers(b, YD_WARD, y, { h: YD.innerH, size: 11, mat: 'rampart', tile: 'tileRed' });

			// streets: the east-west high street between the two-storey gates, the south gate street, the inner gates
			const high = c.road([[-600, YD_GATE.west[1]], [-280, -390], [180, -360], [600, YD_GATE.east[1]], [900, -380], [1400, -640]], 12);
			const south = c.road([[200, 240], [190, 0], [180, -360]], 11);
			const inner = c.road([[YD_GATE.innerEast[0] - 10, YD_GATE.innerEast[1]], [190, -60]], 8);
			const north = c.road([[YD_GATE.innerNorth[0], YD_GATE.innerNorth[1] - 10], [-280, -390]], 8);
			const streets = [high, south, inner, north];
			const offStreet = (x: number, z: number) => streets.every((s) => distanceToPath(s, x, z) > 9);

			// the shrine of Jumong: a three-storey timber tower on a paved court, a small offering hall behind
			const sy = y(YD_SHRINE.x, YD_SHRINE.z);
			court(b, YD_SHRINE.x, YD_SHRINE.z, 120, 110, sy, { gate: 'w', pave: 'gravel' });
			pavedCourt(b, YD_SHRINE.x, YD_SHRINE.z + 6, 30, 30, sy + 0.4);
			const shrine = storeyed(
				b,
				at(YD_SHRINE.x, sy + 0.4, YD_SHRINE.z + 6),
				{ bays: [3.4, 4, 3.4], depth: [3.4, 4, 3.4], colH: 4.6, base: 1.2, front: 'red', back: 'red', sides: 'red', steps: ['s', 'n', 'e', 'w'], roof: { tile: 'tileRed' } },
				[
					{ bays: [3, 3.6, 3], depth: [3, 3.6, 3], colH: 3.8, front: 'doors', back: 'red', sides: 'red', roof: { tile: 'tileRed' } },
					{ bays: [2.6, 3.2, 2.6], depth: [2.6, 3.2, 2.6], colH: 3.4, front: 'doors', back: 'red', sides: 'red', roof: { kind: 'pyramid', h: 5, finial: true, tile: 'tileRed' } }
				]
			);
			hall(b, at(YD_SHRINE.x, sy, YD_SHRINE.z - 36), { bays: [3.2, 3.8, 3.2], depth: [3, 3], colH: 3.6, base: 0.8, front: 'doors', back: 'red', sides: 'red', steps: ['s'], roof: { chimi: true, tile: 'tileRed' } });
			for (const sx of [-1, 1]) stoneLantern(b, YD_SHRINE.x + sx * 9, sy + 0.4, YD_SHRINE.z + 26);
			c.taken.add(YD_SHRINE.x, YD_SHRINE.z, 126, 116);
			c.labels.push({ id: 'shrine', en: 'Shrine of Jumong', ko: '주몽사', at: [YD_SHRINE.x, sy + shrine.ridge + 8, YD_SHRINE.z], status: 'recorded', note: 'The Tang annals of 645 record a shrine to Jumong inside Yodong, keeping a coat of mail said to have fallen from heaven; the mural shows a three-storey tower in the inner city' });

			// the granary ward: rows of raised storehouses behind a wall (half a million sacks of grain, 645)
			const G = YD_GRANARY;
			const gy = y(G.x, G.z);
			court(b, G.x, G.z, G.w, G.d, gy, { gate: 's', pave: 'earth' });
			for (let row = 0; row < 3; row++) {
				for (let k = 0; k < 11; k++) {
					const x = G.x - G.w / 2 + 26 + k * ((G.w - 52) / 10);
					const z = G.z - G.d / 2 + 30 + row * 42;
					c.town.put('store', x + (c.rand() - 0.5) * 3, y(x, z), z, (c.rand() - 0.5) * 0.08, 12 + c.rand() * 2, 9 + c.rand() * 1.5, 8 + c.rand() * 1.4);
				}
			}
			c.taken.add(G.x, G.z, G.w + 8, G.d + 8);
			c.labels.push({ id: 'granary', en: 'Granaries', ko: '창고', at: [G.x, gy + 24, G.z], status: 'recorded', note: 'When the city fell in 645 the Tang counted half a million sacks of grain inside' });

			// the tower outside the east gate, as the mural paints it
			const [tx, tz] = [690, -380];
			const ty = y(tx, tz);
			box(b, 'courses', at(tx, ty, tz), 0, 1.2, 0, 18, 2.4, 18);
			const watch = storeyed(
				b,
				at(tx, ty + 2.4, tz),
				{ bays: [3.4, 4, 3.4], depth: [3.4, 3.4], colH: 4.2, base: 0.4, front: 'red', back: 'red', sides: 'red', roof: { tile: 'tileRed' } },
				[{ bays: [3, 3.4, 3], depth: [3, 3], colH: 3.4, front: 'open', back: 'open', sides: 'open', roof: { chimi: true, tile: 'tileRed' } }]
			);
			c.taken.add(tx, tz, 24, 24);
			c.labels.push({ id: 'east-tower', en: 'Tower outside the east gate', ko: '동문 밖 누각', at: [tx, ty + watch.ridge + 8, tz], status: 'recorded', note: 'The mural paints a storeyed building standing outside the east gate' });

			// households: walled tile compounds in the inner city, a looser mix of tile and thatch in the outer
			const outer = new Region(rect(0, -220, 1060, 780));
			const innerCity = new Region(rect(-280, -50, 430, 330));
			const innerBand = new Region(rect(-280, -50, 500, 400));
			gridTown(c.town, c.g.height, c.rand, { minX: -540, maxX: 540, minZ: -620, maxZ: 180 }, 96, (x, z) => outer.contains(x, z) && !innerBand.contains(x, z) && c.clear(x, z, 6) && offStreet(x, z), { density: 0.74, thatch: 0.6, forest: c.forest, trees: ['broad', 'zelkova', 'willow'] });
			gridTown(c.town, c.g.height, c.rand, boundsOf(YD_INNER), 84, (x, z) => innerCity.contains(x, z) && c.clear(x, z, 5) && offStreet(x, z), { density: 0.86, thatch: 0.2, forest: c.forest, trees: ['zelkova', 'pine'], plot: [18, 40] });

			// timber bridges over the moat at each outer gate
			for (const [x, z, rot] of [
				[200, 230, 0],
				[-597, YD_GATE.west[1], Math.PI / 2],
				[597, YD_GATE.east[1], Math.PI / 2]
			] as [number, number, number][]) {
				const by = YD.water + 1.6;
				box(b, 'wood', at(x, by, z, rot), 0, 0, 0, 9, 0.5, 34);
				for (const s of [1, -1]) box(b, 'wood', at(x, by, z, rot), s * 4.3, 0.7, 0, 0.25, 0.9, 34);
			}
			// Taizong's camp on the plain to the west, 645
			const list = camp(b, c.g, c.rand, { x: -1500, z: -260, w: 420, d: 300, rot: 0.08, cloth: 'vermilion', ok: (x, z) => c.clear(x, z, 4) });
			c.root.add(tents(c.p, list));
			c.labels.push({ id: 'inner', en: 'Inner city', ko: '내성', at: [-280, YD.plain + 30, -240], status: 'recorded', note: 'The mural draws an inner wall in the south-west corner of the city' });
			c.labels.push({ id: 'ward', en: 'South-east ward', ko: '동남 외곽성', at: [720, YD.plain + 40, 60], status: 'recorded', note: 'Small outer walls cling to the south and south-east of the mural city' });
			c.labels.push({ id: 'camp', en: 'Tang camp', ko: '당군 진영', at: [-1500, YD.plain + 30, -260], status: 'recorded', note: 'Taizong fills the moat and fires the town in a south wind, 645' });
			c.labels.push({ id: 'mashou', en: 'Mashou Hill', ko: '수산', at: [-3900, YD.plain + 220, 2700], status: 'recorded', note: 'The hill south-west of the city where Taizong set his command' });
			c.labels.push({ id: 'taizi', en: 'The Taizi', ko: '태자하', at: [600, YD.water + 18, 640], status: 'survey', note: 'A braided river of channels and sandbars; the Liao crossing lies west' });
		},
		views: (c) => [
			{ id: 'board', en: 'Over the braided river', ko: '갈래 강 위에서', pos: [420, YD.water + 24, 600], target: [200, YD.plain + 12, 190], fov: 42 },
			{ id: 'mural', en: 'The mural view', ko: '벽화 시점', pos: [900, YD.plain + 420, 900], target: [-60, YD.plain, -240], fov: 44 },
			{ id: 'city', en: 'Inside the walls', ko: '성안', pos: [-20, YD.plain + 60, 120], target: [YD_SHRINE.x, YD.plain + 10, YD_SHRINE.z], fov: 46 },
			{ id: 'camp', en: 'From the Tang camp', ko: '당군 진영에서', pos: [-1260, YD.plain + 24, -180], target: [YD_GATE.west[0], YD.plain + 10, YD_GATE.west[1]], fov: 40 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 3600, 600], target: [0, 0, 0], fov: 40 },
			{ id: 'east', en: 'From the eastern hills', ko: '동쪽 산에서', pos: [2600, c.g.height(2600, -400) + 60, -400], target: [0, YD.plain, -200], fov: 40 }
		],
		mist: [
			{ y: YD.water + 1.2, opacity: 0.26 },
			{ y: YD.plain + 6, opacity: 0.1 }
		],
		center: [0, 0],
		radius: 1500,
		haze: '#cfd6d8',
		water: { color: '#55705f', roughness: 0.3, metalness: 0.02 },
		life: (c) => {
			const folk = new Folk('goguryeo', c.g.height, 404);
			garrison(c, folk, YD.wallH - 1, 34);
			folk.audience(YD_PALACE.x, YD_PALACE.z - 34, 0, { near: 12, far: 38, n: 5 });
			return {
				kingdom: 'goguryeo',
				walk: [
					[200, 200],
					[190, 0],
					[190, -60],
					[YD_GATE.innerEast[0] - 10, YD_GATE.innerEast[1]],
					[YD_PALACE.x, YD_PALACE.z + 70]
				],
				door: [YD_PALACE.x, YD_PALACE.z - 20],
				river: reach(TAIZI, 0, 560, 1800),
				bank: 160,
				waterY: YD.water + 0.3,
				height: c.g.height,
				seed: 404,
				people: 30,
				boats: 4,
				boat: 1,
				folk
			};
		}
	});
}
