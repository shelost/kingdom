import { fbm, noise, smoothstep, distanceToPath, chaikin, resample, rect, type P2, type Bounds } from './geo';
import { at, box, hall, tower, court, cloister, fence, gate, woodPagoda, ribbon, type Builder } from './kit';
import { bump, type Ground } from './terrain';
import { lerp, mountainField, pick, riverStrip, startSite, assemble, bankCover, scatterTrees, scatterCover } from './common';
import { hamlet } from './fortress';
import type { BuildOptions, Label, SiteBuild, View } from './types';

/*
 * Asuka (飛鳥), the Yamato court in the 640s. Origin at the Itabuki Palace site (Asuka-kyō,
 * stacked Okamoto / Itabuki / Kiyomihara palaces). The basin is small: Asuka-dera 700 m to the
 * north, Amakashi hill across the river to the north-west, Ishibutai to the south-east, wooded
 * hills on every side and Kagu, Unebi and Miminashi out on the plain beyond. Palace halls are
 * post-in-ground under cypress bark, as excavated; Asuka-dera, built by Baekje craftsmen, is the
 * tiled exception and the board's cloister.
 */

const PLAIN = 8;
const WATER = PLAIN - 1.6;
const BED = PLAIN - 3;

const RIVER: P2[] = [
	[1500, 2500],
	[820, 1520],
	[160, 820],
	[-190, 300],
	[-310, -220],
	[-450, -660],
	[-640, -1180],
	[-1060, -2160],
	[-1600, -3300]
];
const RIVER_HALF = 14;

const TEMPLE = { x: -40, z: -720 };
const AMAKASHI = { x: -780, z: -840 };
const ISHIBUTAI = { x: 640, z: 1160 };

const mountains = mountainField([
	{ x: 1500, z: -200, rx: 800, rz: 1900, h: 150, seed: 1.2 },
	{ x: 2600, z: 900, rx: 1400, rz: 2200, h: 320, seed: 2.4 },
	{ x: 300, z: 2100, rx: 1600, rz: 700, h: 190, seed: 3.6 },
	{ x: -1500, z: 900, rx: 900, rz: 1500, h: 130, seed: 4.1 },
	{ x: -2400, z: -400, rx: 900, rz: 1200, h: 110, seed: 5.3 },
	{ x: 900, z: 4200, rx: 4000, rz: 1600, h: 520, seed: 6.8 },
	{ x: 5200, z: -1800, rx: 2200, rz: 4200, h: 600, seed: 7.2 }
]);

/** Amakashi, Kagu, Unebi, Miminashi: low single hills on the plain. */
function hills(x: number, z: number): number {
	const a = bump(x, z, AMAKASHI.x, AMAKASHI.z, 270, 210) * 56;
	return Math.min(a, 46) + bump(x, z, 700, -2700, 520, 460) * 82 + bump(x, z, -3200, -2600, 620, 620) * 120 + bump(x, z, -1200, -4800, 460, 460) * 62;
}

/** Ishibutai: Soga no Umako's square mound, stepped. */
function mound(x: number, z: number): number {
	const d = Math.max(Math.abs(x - ISHIBUTAI.x), Math.abs(z - ISHIBUTAI.z));
	return d < 44 ? lerp(9, 0, smoothstep(14, 44, d)) : 0;
}

const riverDistance = (x: number, z: number) => distanceToPath(RIVER, x, z);

function makeGround(): Ground {
	const height = (x: number, z: number) => {
		let y = PLAIN + fbm(x / 300, z / 300) * 1.2 + mountains(x, z) + hills(x, z) + mound(x, z);
		const dr = riverDistance(x, z);
		if (dr < RIVER_HALF + 40) y = Math.min(y, lerp(BED, PLAIN + 6, smoothstep(RIVER_HALF - 6, RIVER_HALF + 36, dr)));
		return y;
	};
	const paddies = ['#86b25a', '#8fba61', '#7aa651', '#97bf6a', '#a4c473', '#7fae66'];
	const color = (x: number, z: number, y: number, slope: number): string => {
		const n = noise(x / 31, z / 31);
		if (riverDistance(x, z) < RIVER_HALF + 6 && y < PLAIN) return y < WATER ? '#7f7a62' : '#cbbf98';
		if (mound(x, z) > 0.5) return n > 0 ? '#6f9a48' : '#668f43';
		const rise = mountains(x, z) + hills(x, z);
		if (rise > 5) {
			if (slope > 0.55) return '#8a8576';
			return pick(['#46683a', '#517341', '#3f6036', '#5a7d47'], (n + 1) / 2);
		}
		if (Math.abs(x) < 85 && Math.abs(z) < 105) return n > 0.1 ? '#c9b48c' : '#c1ad86';
		if (Math.abs(x - TEMPLE.x) < 50 && Math.abs(z - TEMPLE.z) < 58) return n > 0.1 ? '#cdb994' : '#c4b08b';
		if (slope < 0.05) {
			const cx = Math.floor((x + 7) / 34);
			const cz = Math.floor((z - 3) / 22);
			const h = Math.abs(Math.sin(cx * 12.9898 + cz * 78.233) * 43758.5453) % 1;
			const lx = ((x + 7) % 34 + 34) % 34;
			const lz = ((z - 3) % 22 + 22) % 22;
			if (lx < 0.9 || lz < 0.9) return '#a99f73';
			return pick(paddies, h);
		}
		return n > 0 ? '#86a858' : '#7c9f51';
	};
	const cover = (x: number, z: number, _y: number, slope: number): number => {
		const rise = mountains(x, z) + hills(x, z);
		if (rise < 5) return 0;
		return slope > 0.55 ? 0.2 : smoothstep(5, 30, rise);
	};
	return { height, color, cover };
}

/* ------------------------------------------------------------------ Itabuki Palace */

function palace(b: Builder, labels: Label[]): void {
	const y = PLAIN + 0.4;
	const roof = { tile: 'bark' as const, chimi: false };
	court(b, 0, 0, 158, 197, y, { gate: 's', gateBays: [3.6, 4.2, 3.6], wallH: 3.2, pave: 'gravel', tile: 'bark' });
	const main = hall(b, at(0, y, -30), { bays: Array(8).fill(3.6), depth: [3, 3.4, 3.4, 3], colH: 4.2, base: 0.35, steps: ['s'], front: 'doors', back: 'wall', sides: 'wall', roof });
	labels.push({
		id: 'itabuki',
		en: 'Itabuki Palace',
		ko: '이타부키궁',
		at: [0, y + main.ridge + 6, -30],
		status: 'excavated',
		note: 'Post-in-ground halls under cypress bark. Here, in the sixth month of 645, while a memorial from the three Korean kingdoms was read, Soga no Iruka was cut down'
	});
	hall(b, at(0, y, -78), { bays: Array(7).fill(3.3), depth: [3, 3, 3], colH: 3.8, base: 0.3, front: 'doors', back: 'wall', sides: 'wall', roof });
	for (const sx of [1, -1]) {
		hall(b, at(sx * 52, y, -50, sx > 0 ? -Math.PI / 2 : Math.PI / 2), { bays: Array(6).fill(3), depth: [3, 3], colH: 3.4, base: 0.3, roof });
		hall(b, at(sx * 50, y, 40, sx > 0 ? -Math.PI / 2 : Math.PI / 2), { bays: Array(8).fill(3), depth: [3, 3], colH: 3.2, base: 0.3, roof });
	}
	// the stone-paved yard and the square stone-lined well found inside the inner court
	box(b, 'paving', at(0, y, 18), 0, 0.06, 0, 70, 0.1, 44);
	box(b, 'courses', at(-30, y, -96), 0, 0.4, 0, 4.4, 0.8, 4.4);
	box(b, 'dark', at(-30, y, -96), 0, 0.42, 0, 2.6, 0.82, 2.6);
	// outer court: offices of the court ranks south of the inner gate
	fence(b, [[-150, 99], [-150, 260], [150, 260], [150, 99]], () => y, 2.6);
	gate(b, at(0, y, 260), [3.4, 4, 3.4], [3, 3], 3.6, { roof: { tile: 'bark', chimi: false } });
	for (const sx of [1, -1]) {
		for (let k = 0; k < 2; k++) {
			hall(b, at(sx * 84, y, 140 + k * 60, sx > 0 ? -Math.PI / 2 : Math.PI / 2), { bays: Array(9).fill(3), depth: [3, 3], colH: 3.2, base: 0.3, roof });
		}
	}
}

/* ------------------------------------------------------------------ Asuka-dera */

function temple(b: Builder, labels: Label[]): void {
	const { x, z } = TEMPLE;
	const y = PLAIN + 0.5;
	cloister(b, x, z, 88, 104, y, { gate: { bays: [3.4, 3.8, 3.4], depth: [3.2, 3.2], colH: 4.2, twoStorey: true }, width: 5.4, colH: 3.6, corners: true });
	const top = woodPagoda(b, at(x, y, z + 8), 6.6, 5, 5.2);
	labels.push({ id: 'asukadera', en: 'Asuka-dera', ko: '아스카데라', at: [x, y + top + 4, z + 8], status: 'excavated', note: 'Founded 588 by the Soga with Baekje temple builders, tile makers and a pagoda master; one pagoda, three golden halls' });
	const north = tower(
		b,
		at(x, y, z - 28),
		{ bays: [3.4, 3.8, 4.2, 3.8, 3.4], depth: [3.4, 3.6, 3.4], colH: 4.6, base: 1.3, tiers: 2, steps: ['s'], front: 'doors', back: 'wall', sides: 'wall' },
		{ bays: [3, 3.4, 3.8, 3.4, 3], depth: [3, 3.2, 3], colH: 3.4, front: 'windows', back: 'wall', sides: 'windows', roof: { chimi: true } }
	);
	labels.push({ id: 'golden-hall', en: 'Central golden hall', ko: '중금당', at: [x, y + north.ridge + 5, z - 28], status: 'excavated', note: 'The Asuka Great Buddha (609) still sits on its first stone' });
	for (const sx of [1, -1]) {
		tower(
			b,
			at(x + sx * 31, y, z + 8, sx > 0 ? -Math.PI / 2 : Math.PI / 2),
			{ bays: [3, 3.4, 3], depth: [3, 3], colH: 4, base: 1.1, tiers: 2, steps: ['s'], front: 'doors', back: 'wall', sides: 'wall' },
			{ bays: [2.8, 3, 2.8], depth: [2.8, 2.8], colH: 3, front: 'windows', back: 'wall', sides: 'windows', roof: { chimi: true } }
		);
	}
	hall(b, at(x, y, z - 84), { bays: Array(8).fill(4), depth: [4, 4, 4], colH: 4.4, base: 1, front: 'doors', back: 'wall', sides: 'wall', roof: { chimi: true } });
	const yard = rect(x, z - 6, 210, 290);
	fence(b, [...yard, yard[0]], () => y - 0.3, 2.6);
	gate(b, at(x, y - 0.3, z - 6 + 145), [3.6, 4.2, 3.6], [3.2, 3.2], 4, { roof: { chimi: true } });
	gate(b, at(x - 105, y - 0.3, z - 6, Math.PI / 2), [3.6, 4.2, 3.6], [3.2, 3.2], 4, { roof: { chimi: true } });
	b.lampPost(x - 6, y - 0.3, z - 6 + 160);
	b.lampPost(x + 6, y - 0.3, z - 6 + 160);
}

/* ------------------------------------------------------------------ Amakashi */

function soga(b: Builder, g: Ground, labels: Label[]): void {
	const { x, z } = AMAKASHI;
	const y = g.height(x, z);
	const ring = rect(x, z, 74, 52);
	fence(b, [...ring, ring[0]], () => y, 3);
	gate(b, at(x, y, z + 26), [3, 3.6, 3], [2.8, 2.8], 3.4, { roof: { tile: 'bark', chimi: false } });
	hall(b, at(x, y, z - 6), { bays: Array(7).fill(3.4), depth: [3.2, 3.4, 3.2], colH: 3.8, base: 0.4, front: 'doors', back: 'wall', sides: 'wall', roof: { tile: 'bark' } });
	for (let k = 0; k < 2; k++) hall(b, at(x + 22, y, z - 10 + k * 14, Math.PI / 2), { bays: [3, 3, 3], depth: [2.6, 2.6], colH: 2.6, base: 0.3, posts: 1.2, front: 'wall', roof: { kind: 'gable', tile: 'thatch', h: 2.4 } });
	labels.push({ id: 'amakashi', en: 'Soga mansions, Amakashi hill', ko: '아마카시 언덕 소가 저택', at: [x, y + 18, z], status: 'recorded', note: 'In 644 Emishi and Iruka built houses on the hill, called them palace gates, and stocked them with arrows and fire-water' });
}

/* ------------------------------------------------------------------ build */

const NEAR: Bounds = { minX: -1400, maxX: 1300, minZ: -1600, maxZ: 1700 };

export function buildAsuka(_opts: BuildOptions): SiteBuild {
	const g = makeGround();
	const s = startSite('asuka', g, { near: NEAR, cell: 6, far: 24000, farCell: 120, center: [0, -300], seed: 645 });
	const { b, forest, town, cover, labels, rand } = s;

	riverStrip(b, RIVER, RIVER_HALF * 2 + 8, WATER);
	palace(b, labels);
	temple(b, labels);
	soga(b, g, labels);
	labels.push({ id: 'ishibutai', en: 'Ishibutai', ko: '이시부타이', at: [ISHIBUTAI.x, PLAIN + 22, ISHIBUTAI.z], status: 'standing', note: 'Soga no Umako’s tomb (626); the mound is gone now and the chamber stones stand bare' });
	labels.push({ id: 'asuka-river', en: 'Asuka River', ko: '아스카강', at: [-300, PLAIN + 8, -200], status: 'survey' });

	// the road between palace and temple
	const road = resample(chaikin([[0, 99], [0, 120], [10, -300], [-20, -560], [TEMPLE.x, TEMPLE.z + 160]], 2, false), 4, false);
	b.push('path', ribbon(road, 5, (x, z) => g.height(x, z) + 0.1));
	const onRoad = (x: number, z: number, pad: number) => distanceToPath(road, x, z) < 2.5 + pad;

	// the great zelkova west of the temple
	const tsuki: P2 = [TEMPLE.x - 140, TEMPLE.z + 10];
	forest.add('zelkova', tsuki[0], g.height(tsuki[0], tsuki[1]), tsuki[1], 26);
	labels.push({ id: 'tsuki', en: 'The great zelkova', ko: '느티나무 광장', at: [tsuki[0], PLAIN + 34, tsuki[1]], status: 'recorded', note: 'Where Nakatomi no Kamatari picked up Prince Naka no Ōe’s shoe at a kickball game' });

	// the dress lineup south of the tree, with room in front for its camera
	const dress: P2 = [tsuki[0] - 10, tsuki[1] + 34];

	// villages, paddies, groves
	const taken = (x: number, z: number, pad: number) =>
		(Math.abs(x) < 160 + pad && z > -110 - pad && z < 270 + pad) ||
		(Math.abs(x - dress[0]) < 16 + pad && z > dress[1] - 6 - pad && z < dress[1] + 24 + pad) ||
		(Math.abs(x - TEMPLE.x) < 110 + pad && Math.abs(z - TEMPLE.z + 6) < 150 + pad) ||
		Math.hypot(x - tsuki[0], z - tsuki[1]) < 24 + pad ||
		onRoad(x, z, pad);
	const flatOk = (x: number, z: number) => mountains(x, z) + hills(x, z) < 3 && riverDistance(x, z) > RIVER_HALF + 30 && mound(x, z) < 0.5 && !taken(x, z, 10);
	hamlet(town, forest, g, rand, { x: 330, z: -330, r: 140, n: 34, thatch: 0.92, ok: flatOk });
	hamlet(town, forest, g, rand, { x: -360, z: 420, r: 120, n: 22, thatch: 0.95, ok: flatOk });
	hamlet(town, forest, g, rand, { x: 420, z: 520, r: 130, n: 26, thatch: 0.92, ok: flatOk });
	hamlet(town, forest, g, rand, { x: -280, z: -1230, r: 120, n: 22, thatch: 0.9, ok: flatOk });

	scatterTrees(forest, g, NEAR, 9000, rand, (x, z) => mountains(x, z) + hills(x, z) > 6 && mound(x, z) < 0.5 && !(Math.abs(x - AMAKASHI.x) < 50 && Math.abs(z - AMAKASHI.z) < 40), (r) => (r > 0.6 ? 'broad' : r > 0.12 ? 'pine' : 'cherry'), [8, 15]);
	// blossom round the temple yard and along the road, as on the board
	scatterTrees(forest, g, { minX: TEMPLE.x - 200, maxX: TEMPLE.x + 200, minZ: TEMPLE.z - 200, maxZ: TEMPLE.z + 260 }, 260, rand, (x, z) => !taken(x, z, 4) && riverDistance(x, z) > RIVER_HALF + 12, (r) => (r > 0.35 ? 'cherry' : 'broad'), [6, 9]);
	for (const [x, z] of road) {
		if (rand() > 0.12) continue;
		const side = rand() > 0.5 ? 1 : -1;
		const px = x + side * (6 + rand() * 4);
		if (!taken(px, z, 1)) forest.add('cherry', px, g.height(px, z), z, 6 + rand() * 2.5);
	}
	for (const [x, z] of resample(chaikin(RIVER, 2, false), 16, false)) {
		for (const side of [1, -1]) {
			if (rand() > 0.45) continue;
			const px = x + side * (RIVER_HALF + 10 + rand() * 12);
			const pz = z + (rand() - 0.5) * 16;
			if (riverDistance(px, pz) < RIVER_HALF + 8 || hills(px, pz) > 4) continue;
			forest.add('willow', px, g.height(px, pz), pz, 7 + rand() * 3);
		}
	}

	bankCover(cover, g, RIVER, WATER, rand, { from: RIVER_HALF - 4, to: RIVER_HALF + 24, step: 3 });
	scatterCover(cover, g, { minX: -320, maxX: 260, minZ: -1000, maxZ: 320 }, 30000, rand, (x, z) => !onRoad(x, z, 0.5) && !(Math.abs(x) < 80 && Math.abs(z) < 100) && !(Math.abs(x - TEMPLE.x) < 46 && Math.abs(z - TEMPLE.z) < 54) && riverDistance(x, z) > RIVER_HALF + 4, 1);

	const views: View[] = [
		{ id: 'board', en: 'Board view', ko: '그림 시점', pos: [TEMPLE.x + 105, PLAIN + 34, TEMPLE.z + 135], target: [TEMPLE.x - 4, PLAIN + 9, TEMPLE.z - 6], fov: 46 },
		{ id: 'palace', en: 'Itabuki Palace', ko: '이타부키궁', pos: [-90, PLAIN + 30, 240], target: [0, PLAIN + 4, -20], fov: 44 },
		{ id: 'amakashi', en: 'From Amakashi', ko: '아마카시 언덕에서', pos: [AMAKASHI.x + 40, PLAIN + 58, AMAKASHI.z + 40], target: [TEMPLE.x, PLAIN + 14, TEMPLE.z + 40], fov: 46 },
		{ id: 'tsuki', en: 'The zelkova', ko: '느티나무', pos: [tsuki[0] - 30, PLAIN + 2, tsuki[1] + 60], target: [tsuki[0] + 40, PLAIN + 12, tsuki[1] - 20], fov: 50 },
		{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 2200, 0], target: [0, 0, -360], fov: 40 }
	];

	return assemble({
		...s,
		mist: {
			height: g.height,
			box: { minX: -4000, maxX: 4000, minZ: -4000, maxZ: 4000 },
			layers: [
				{ y: PLAIN + 1.2, opacity: 0.26 },
				{ y: PLAIN + 6, opacity: 0.12 }
			]
		},
		views,
		wardrobe: { dress: 'yamato', x: dress[0], z: dress[1], note: 'Asuka court caps and long robes in the twelve-cap colours; commoners in undyed hemp' },
		center: [0, -360],
		radius: 1000,
		haze: '#cfdbe4'
	});
}
