/**
 * The prologue as shadow boxes. Each scene is a stack of torn sheets in front of
 * one light, with the moving cut-outs that live on them.
 */
import { banner, birds, boat, chariot, flames, leaves, person, procession, reeds, smoke, snow, stars, sun, swell, tiger, type Who } from './actors';
import { BLEED, H, W, birch, blob, cloud, disc, ease, fillTo, fillUp, hall, jag, lane, peaks, pine, poly, ridge, span, town, yAt, type Pt } from './kit';
import type { PaperScene } from './render';

type Ctx = CanvasRenderingContext2D;

function moon(ctx: Ctx, x: number, y: number, r: number, body: string): void {
	ctx.fillStyle = body;
	ctx.shadowColor = body;
	ctx.shadowBlur = r * 0.45;
	ctx.beginPath();
	disc(ctx, x, y, r);
	ctx.fill();
	ctx.shadowBlur = 0;
	ctx.fillStyle = 'rgba(160,140,110,0.18)';
	ctx.beginPath();
	blob(ctx, x - r * 0.25, y - r * 0.2, r * 0.22, r * 0.17, 5);
	blob(ctx, x + r * 0.28, y + r * 0.26, r * 0.15, r * 0.12, 6);
	blob(ctx, x + r * 0.15, y - r * 0.33, r * 0.09, r * 0.08, 7);
	ctx.fill();
}

/* ── Back when tigers used to smoke ─────────────────────────────── */

const TIGER_CRAG: Pt[] = jag(
	[
		[360, 1200],
		[400, 880],
		[452, 740],
		[500, 690],
		[548, 640],
		[620, 612],
		[720, 603],
		[880, 600],
		[1010, 596],
		[1080, 604],
		[1150, 582],
		[1236, 590],
		[1214, 632],
		[1168, 668],
		[1196, 760],
		[1180, 880],
		[1240, 1200]
	],
	29,
	7
);

const tigers: PaperScene = {
	sky: ['#0a1222', '#1f2d47'],
	far: '#34445f',
	near: '#070b14',
	light: { x: 1420, y: 280, r: 760, color: '#f3e7c6', flicker: 0.04, power: 0.75 },
	cam: { from: [-70, 20, 1.02], to: [50, -16, 1.14] },
	back: (ctx, f) => {
		stars(ctx, f.t, 70, 3, 520);
		moon(ctx, 1420, 280, 150, '#f4ecd6');
	},
	sheets: [
		{ depth: 0.06, rim: 0.9, cut: (p) => fillTo(p, peaks(11, 760, [{ x: 200, h: 260, w: 260 }, { x: 820, h: 180, w: 200 }, { x: 1650, h: 300, w: 280 }])) },
		{ depth: 0.22, cut: (p) => fillTo(p, peaks(12, 820, [{ x: 500, h: 200, w: 240 }, { x: 1300, h: 150, w: 260 }, { x: 1950, h: 240, w: 220 }])) },
		{
			depth: 0.34,
			color: '#56647e',
			rim: 0.8,
			move: (f) => [Math.sin(f.t * 0.08) * 50, 0],
			cut: (p) => {
				cloud(p, -200, 720, 900, 90, 21);
				cloud(p, 900, 750, 1000, 80, 22);
			}
		},
		{
			depth: 0.55,
			cut: (p) => {
				fillTo(p, ridge(31, 900, 30));
				poly(p, TIGER_CRAG);
				pine(p, 500, 690, 340, 33, -0.25);
			},
			draw: (ctx, f) => {
				const bowl = tiger(ctx, 790, 601, 1.45, f.t, { coat: '#a95f27', stripe: '#120c08', eye: '#f2d27a', grain: f.grain });
				smoke(ctx, bowl[0], bowl[1], f.t, '#d9dde6', 380);
			}
		},
		{
			depth: 0.78,
			cut: (p) => fillTo(p, peaks(41, 1010, [{ x: 1600, h: 300, w: 300 }, { x: -50, h: 250, w: 260 }])),
			draw: (ctx, f) => {
				ctx.shadowColor = 'transparent';
				ctx.fillStyle = '#020409';
				ctx.beginPath();
				blob(ctx, 1600, 890, 92, 72, 44, 0.08);
				ctx.fill();
				ctx.fillStyle = '#231d19';
				ctx.beginPath();
				disc(ctx, 1600, 900, 36);
				disc(ctx, 1572, 870, 12);
				disc(ctx, 1628, 870, 12);
				ctx.fill();
				const blink = (f.t % 4.2) < 0.16 ? 0 : 1;
				ctx.fillStyle = `rgba(242,210,122,${0.85 * blink})`;
				ctx.shadowColor = '#f2d27a';
				ctx.shadowBlur = 8;
				ctx.beginPath();
				disc(ctx, 1588, 894, 3.2);
				disc(ctx, 1612, 894, 3.2);
				ctx.fill();
			}
		},
		{
			depth: 0.95,
			rim: 0.2,
			cut: (p) => {
				fillTo(p, ridge(53, 1020, 24));
				pine(p, 120, 1060, 520, 51, 0.15);
				pine(p, 1930, 1080, 460, 52, -0.2);
			}
		}
	]
};

/* ── Heaven sent down a man ─────────────────────────────────────── */

const OBANG = ['#3e79e4', '#c8302c', '#e8c34a', '#f4efe2', '#2a2a2e'];

/** A wall of cloud: cumulus stacked down to the floor of the box, its ends torn and rounded. */
function cloudBank(p: Path2D, x: number, w: number, top: number, seed: number): void {
	for (let i = 0; i < 7; i++) {
		const inset = w * (i % 2 === 0 ? 0 : 0.05);
		cloud(p, x + inset, top + 170 + i * 140, w - inset * 2, 220 + i * 20, seed + i * 5);
	}
	poly(
		p,
		jag(
			[
				[x + w * 0.08, top + 900],
				[x + w * 0.92, top + 900],
				[x + w * 0.94, H + BLEED],
				[x + w * 0.06, H + BLEED]
			],
			seed + 40,
			16,
			24
		)
	);
}

const heaven: PaperScene = {
	sky: ['#f7dca0', '#e7a46a'],
	far: '#f6e5c4',
	near: '#9a5a48',
	light: { x: 1000, y: 160, r: 1000, color: '#fff2cc', power: 0.95 },
	cam: { from: [0, -60, 1.0], to: [0, 50, 1.1] },
	back: (ctx, f) => {
		ctx.fillStyle = 'rgba(255,248,220,0.16)';
		ctx.beginPath();
		for (let i = 0; i < 9; i++) {
			const a = Math.PI / 2 - 0.85 + i * 0.21 + Math.sin(f.t * 0.2 + i) * 0.02;
			poly(ctx, [
				[1000, 40],
				[1000 + Math.cos(a - 0.04) * 1600, 40 + Math.sin(a - 0.04) * 1600],
				[1000 + Math.cos(a + 0.04) * 1600, 40 + Math.sin(a + 0.04) * 1600]
			]);
		}
		ctx.fill();
	},
	sheets: [
		{
			depth: 0.04,
			color: '#d9b48c',
			rim: 1,
			cut: (p) => {
				cloud(p, 250, 340, 640, 80, 61);
				hall(p, 560, 300, 260, 200, 2);
				cloud(p, 1180, 310, 620, 70, 62);
				hall(p, 1450, 270, 200, 160, 2);
			}
		},
		{
			depth: 0.12,
			color: '#4d3f55',
			rim: 0.4,
			cut: (p) => fillTo(p, peaks(63, 1100, [{ x: 1000, h: 330, w: 260 }, { x: 400, h: 180, w: 240 }, { x: 1650, h: 200, w: 260 }])),
			draw: (ctx) => {
				ctx.shadowColor = 'transparent';
				ctx.fillStyle = '#f3efe6';
				ctx.beginPath();
				poly(ctx, [
					[1000, 772],
					[1068, 822],
					[1040, 814],
					[1012, 834],
					[982, 812],
					[934, 824]
				]);
				ctx.fill();
			}
		},
		{ depth: 0.4, color: '#fbf0dc', rim: 0.7, move: (f) => [-460 * ease(f.k), 0], cut: (p) => cloudBank(p, -500, 1520, 560, 71) },
		{ depth: 0.42, color: '#f8e9d0', rim: 0.7, move: (f) => [460 * ease(f.k), 0], cut: (p) => cloudBank(p, 980, 1540, 600, 73) },
		{
			depth: 0.62,
			draw: (ctx, f) => {
				const u = ease(f.k);
				const y = 140 + u * 560;
				const s = 0.85 + u * 0.75;
				const x = 1000 + Math.sin(f.t * 0.7) * 10;
				ctx.save();
				ctx.shadowColor = 'transparent';
				ctx.fillStyle = 'rgba(255,250,235,0.55)';
				ctx.beginPath();
				for (let i = 0; i < 7; i++) {
					const sx = x - 90 * s + i * 30 * s;
					const len = (120 + ((i * 37) % 80)) * s * (0.4 + u);
					poly(ctx, [
						[sx - 2, y - 60 * s],
						[sx + 2, y - 60 * s],
						[sx + 1, y - 60 * s - len],
						[sx - 1, y - 60 * s - len]
					]);
				}
				ctx.fill();
				ctx.restore();
				chariot(ctx, x, y, s, f.t, OBANG);
			}
		},
		{ depth: 0.86, color: '#f1dcbc', rim: 0.5, move: (f) => [-700 * ease(f.k), 0], cut: (p) => cloudBank(p, -700, 1300, 780, 75) },
		{ depth: 0.88, color: '#eed6b4', rim: 0.5, move: (f) => [700 * ease(f.k), 0], cut: (p) => cloudBank(p, 1400, 1300, 800, 77) }
	]
};

/* ── He fell in love with a woman ───────────────────────────────── */

const LOVE_GROUND = ridge(81, 820, 18);

const love: PaperScene = {
	sky: ['#241a33', '#d98b5f'],
	far: '#7a5068',
	near: '#140d18',
	light: { x: 1000, y: 600, r: 760, color: '#ffd29a', power: 0.85 },
	cam: { from: [-50, 10, 1.0], to: [10, -20, 1.16] },
	back: (ctx, f) => sun(ctx, 1000, 640, 120, f.t, '#ffcf8a', 'rgba(255,214,150,0.22)'),
	sheets: [
		{ depth: 0.06, cut: (p) => fillTo(p, peaks(82, 720, [{ x: 300, h: 160, w: 260 }, { x: 1700, h: 200, w: 300 }])) },
		{ depth: 0.26, cut: (p) => fillTo(p, ridge(84, 760, 50, 0.7)) },
		{
			depth: 0.52,
			cut: (p) => {
				fillTo(p, LOVE_GROUND);
				birch(p, 1000, 812, 500, 83);
			},
			draw: (ctx, f) => {
				ctx.save();
				ctx.shadowColor = 'transparent';
				ctx.fillStyle = 'rgba(238,228,206,0.9)';
				ctx.beginPath();
				poly(ctx, [
					[992, 816],
					[1010, 816],
					[1004, 500],
					[994, 500]
				]);
				ctx.fill();
				ctx.fillStyle = f.color;
				ctx.beginPath();
				for (let i = 0; i < 9; i++) {
					const y = 790 - i * 34;
					poly(ctx, [
						[992, y],
						[1000 + (i % 2) * 6, y],
						[1000 + (i % 2) * 6, y - 4],
						[993, y - 4]
					]);
				}
				ctx.fill();
				ctx.restore();
				const u = span(f.k, 0, 0.78);
				const r = span(f.k, 0.72, 0.95);
				const moving = u < 0.999;
				const mx = 600 + 320 * u;
				const wx = 1400 - 320 * u;
				person(ctx, mx, yAt(LOVE_GROUND, mx), 2.3, { cap: 'feather', walk: moving ? f.t * 4.6 : undefined, reach: r, wind: 1 });
				person(ctx, wx, yAt(LOVE_GROUND, wx), 2.2, { skirt: true, walk: moving ? f.t * 4.6 + 1 : undefined, reach: r, dir: -1, wind: 1.5 });
			}
		},
		{ depth: 0.9, cut: (p) => fillTo(p, ridge(86, 990, 20)), draw: (ctx, f) => reeds(ctx, -200, 2200, 990, f.t, 90, 87, 90) }
	],
	front: (ctx, f) => leaves(ctx, f.t, 40, 9, ['#e9c46a', '#d98a3a', '#f4e1a6'])
};

/* ── He ruled as the Wanggum ────────────────────────────────────── */

const WANG_HILLS = ridge(92, 800, 16, 0.6);
const WANG_PEAK = peaks(93, 1000, [{ x: 1000, h: 420, w: 170 }], 8);
const WANG_NEAR = ridge(94, 930, 18, 0.6);

function bowers(ctx: Ctx, line: Pt[], t: number, from: number, to: number, step: number, s: number, gapA: number, gapB: number): void {
	for (let x = from, i = 0; x <= to; x += step, i++) {
		if (x > gapA && x < gapB) continue;
		const bow = (Math.sin(t * 1.6 - i * 0.45) * 0.5 + 0.5) * 0.8;
		person(ctx, x, yAt(line, x), s, { bow, dir: x < 1000 ? 1 : -1, cap: 'knot' });
	}
}

const wanggum: PaperScene = {
	sky: ['#1b1531', '#e2894f'],
	far: '#7b4a52',
	near: '#0f0a12',
	light: { x: 1000, y: 640, r: 900, color: '#ffc97a', rise: 260, power: 0.95 },
	cam: { from: [0, 50, 1.0], to: [0, -30, 1.12] },
	back: (ctx, f) => sun(ctx, 1000, 640 - 260 * ease(f.k), 140, f.t, '#ffd58e', 'rgba(255,205,130,0.35)', 20),
	sheets: [
		{ depth: 0.08, cut: (p) => fillTo(p, peaks(91, 760, [{ x: 250, h: 200, w: 260 }, { x: 1750, h: 220, w: 280 }])) },
		{ depth: 0.3, cut: (p) => fillTo(p, WANG_HILLS), draw: (ctx, f) => bowers(ctx, WANG_HILLS, f.t, 120, 1880, 80, 0.8, 820, 1180) },
		{
			depth: 0.55,
			cut: (p) => fillTo(p, WANG_PEAK),
			draw: (ctx, f) => person(ctx, 1000, yAt(WANG_PEAK, 1000) + 4, 2.0, { cap: 'crown', lift: span(f.k, 0.3, 0.7), wind: 1.5 })
		},
		{ depth: 0.85, cut: (p) => fillTo(p, WANG_NEAR), draw: (ctx, f) => bowers(ctx, WANG_NEAR, f.t + 0.7, 40, 1960, 110, 1.6, 700, 1300) }
	]
};

/* ── Then… invasion! ────────────────────────────────────────────── */

const WAR_RIDGE: Pt[] = ridge(111, 0, 22).map(([x, y]) => [x, y + 520 + (x / W) * 300] as Pt);

const invasion: PaperScene = {
	sky: ['#14090b', '#5b1d18'],
	far: '#4a1f20',
	near: '#080405',
	light: { x: 1560, y: 640, r: 820, color: '#ff8a3d', flicker: 0.35, power: 0.95 },
	cam: { from: [-90, 0, 1.0], to: [70, 10, 1.12] },
	back: (ctx, f) => smoke(ctx, 1560, 560, f.t, '#2b1a1a', 520, 7),
	sheets: [
		{ depth: 0.06, cut: (p) => fillTo(p, peaks(101, 720, [{ x: 400, h: 160, w: 300 }, { x: 1300, h: 120, w: 260 }])) },
		{ depth: 0.22, draw: (ctx, f) => flames(ctx, 1320, 660, 520, 260, f.t, 3, 0.35 + 0.65 * ease(f.k)) },
		{
			depth: 0.28,
			cut: (p) => {
				town(p, 1300, 668, 560, 120, 5);
				fillTo(p, ridge(102, 690, 12));
			}
		},
		{
			depth: 0.55,
			cut: (p) => fillTo(p, WAR_RIDGE),
			draw: (ctx, f) => {
				procession(ctx, lane(WAR_RIDGE, -260, 1180, -2), 30, f.t, { s: 1.5, speed: 34, who: () => ({ cap: 'helm', spear: true }), seed: 9 });
				for (let i = 0; i < 3; i++) {
					const x = ((f.t * 34 + i * 480) % 1440) - 260;
					banner(ctx, x, yAt(WAR_RIDGE, x), 200, f.t + i, '#b3261e', 80);
				}
			}
		},
		{ depth: 0.9, cut: (p) => fillTo(p, ridge(104, 1000, 26)), draw: (ctx, f) => reeds(ctx, -200, 2200, 1000, f.t, 70, 105, 80) }
	]
};

/* ── The people fled in all directions ──────────────────────────── */

const FLEE_A = ridge(131, 600, 26, 0.8);
const FLEE_B = ridge(132, 690, 36, 0.8);
const FLEE_C = ridge(133, 800, 30, 0.8);
const FLEE_WHO = (i: number): Who => ({ pack: i % 2 === 0, skirt: i % 3 === 1, cap: 'knot' });

const refugees: PaperScene = {
	sky: ['#0b1120', '#26324c'],
	far: '#3a4762',
	near: '#0a0f1c',
	light: { x: 1000, y: 470, r: 640, color: '#ffb25e', flicker: 0.25, power: 0.9 },
	cam: { from: [0, -30, 1.0], to: [0, 20, 1.14] },
	back: (ctx, f) => stars(ctx, f.t, 60, 8, 420),
	sheets: [
		{ depth: 0.05, cut: (p) => fillTo(p, peaks(121, 560, [{ x: 300, h: 120, w: 260 }, { x: 1700, h: 140, w: 280 }])) },
		{ depth: 0.13, draw: (ctx, f) => flames(ctx, 820, 500, 360, 120, f.t, 7, 0.8) },
		{
			depth: 0.16,
			cut: (p) => {
				town(p, 760, 505, 480, 90, 9);
				fillTo(p, ridge(122, 510, 8));
			}
		},
		{
			depth: 0.32,
			color: '#9aa6bb',
			ink: '#1c2538',
			rim: 0.5,
			cut: (p) => fillTo(p, FLEE_A),
			draw: (ctx, f) => procession(ctx, lane(FLEE_A, 960, -220), 14, f.t, { s: 0.9, s1: 1.1, speed: 22, who: FLEE_WHO, seed: 31 })
		},
		{
			depth: 0.5,
			color: '#24304a',
			cut: (p) => {
				fillTo(p, FLEE_B);
				pine(p, 300, 720, 200, 134, 0.2);
				pine(p, 1700, 720, 220, 135, -0.2);
			},
			draw: (ctx, f) => procession(ctx, lane(FLEE_B, 1040, 2220), 12, f.t, { s: 1.2, s1: 1.4, speed: 26, who: FLEE_WHO, seed: 32 })
		},
		{
			depth: 0.68,
			color: '#c4ccd9',
			ink: '#121a2b',
			rim: 0.4,
			cut: (p) => fillTo(p, FLEE_C),
			draw: (ctx, f) => procession(ctx, lane(FLEE_C, 1000, -220), 10, f.t, { s: 1.5, s1: 2, speed: 30, who: FLEE_WHO, seed: 33 })
		},
		{
			depth: 0.9,
			color: '#0e1424',
			cut: (p) => {
				fillTo(p, peaks(136, 1010, [{ x: 60, h: 190, w: 300 }, { x: 1960, h: 170, w: 280 }, { x: 1000, h: 40, w: 500 }], 16));
				pine(p, 120, 880, 460, 137, 0.15);
				pine(p, 1900, 900, 420, 138, -0.2);
			}
		}
	],
	front: (ctx, f) => snow(ctx, f.t, 130, 4, 3)
};

/* ── Five tribes in the northern mountains ──────────────────────── */

const TRIBE_FAR = peaks(141, 900, [{ x: 260, h: 380, w: 170 }, { x: 1740, h: 400, w: 170 }], 10);
const TRIBE_MID = peaks(142, 960, [{ x: 640, h: 360, w: 160 }, { x: 1360, h: 380, w: 160 }], 10);
const TRIBE_NEAR = peaks(143, 1100, [{ x: 1000, h: 470, w: 190 }], 10);

function chief(ctx: Ctx, line: Pt[], x: number, s: number, f: { t: number; k: number }, i: number): void {
	const y = yAt(line, x) + 3;
	banner(ctx, x + 26 * s, y, 120 * s, f.t + i, '#c8302c', 50 * s);
	person(ctx, x, y, s, { cap: 'feather', lift: span(f.k, 0.08 + i * 0.13, 0.24 + i * 0.13), wind: 1.5 });
}

function mist(seed: number, y: number): (p: Path2D) => void {
	return (p) => {
		for (let i = 0; i < 4; i++) cloud(p, -300 + i * 650, y + (i % 2) * 30, 700, 70, seed + i);
	};
}

const tribes: PaperScene = {
	sky: ['#1c1a2a', '#c45a3c'],
	far: '#6a3b44',
	near: '#0d0a10',
	light: { x: 1000, y: 560, r: 820, color: '#ff9a6a', power: 0.9 },
	cam: { from: [0, 40, 1.0], to: [0, -20, 1.14] },
	back: (ctx, f) => {
		ctx.fillStyle = '#1a1016';
		birds(ctx, f.t, 9, 3, 160, 40, 1.2);
	},
	sheets: [
		{ depth: 0.05, cut: (p) => fillTo(p, peaks(144, 700, [{ x: 600, h: 140, w: 300 }, { x: 1400, h: 160, w: 300 }])) },
		{
			depth: 0.24,
			cut: (p) => fillTo(p, TRIBE_FAR),
			draw: (ctx, f) => {
				chief(ctx, TRIBE_FAR, 260, 0.9, f, 0);
				chief(ctx, TRIBE_FAR, 1740, 0.9, f, 1);
			}
		},
		{ depth: 0.36, color: '#e6b39c', rim: 0.3, move: (f) => [Math.sin(f.t * 0.1) * 60, 0], cut: mist(145, 760) },
		{
			depth: 0.5,
			cut: (p) => fillTo(p, TRIBE_MID),
			draw: (ctx, f) => {
				chief(ctx, TRIBE_MID, 640, 1.2, f, 2);
				chief(ctx, TRIBE_MID, 1360, 1.2, f, 3);
			}
		},
		{ depth: 0.62, color: '#d49a86', rim: 0.3, move: (f) => [Math.sin(f.t * 0.12 + 2) * -70, 0], cut: mist(146, 860) },
		{ depth: 0.76, cut: (p) => fillTo(p, TRIBE_NEAR), draw: (ctx, f) => chief(ctx, TRIBE_NEAR, 1000, 1.7, f, 4) },
		{ depth: 0.93, cut: (p) => fillTo(p, ridge(147, 1030, 28)) }
	]
};

/* ── Six elders in the southeastern plain ───────────────────────── */

const ELDER_MOUND = peaks(151, 900, [{ x: 1000, h: 200, w: 440 }], 6);
const ELDERS = [640, 760, 880, 1120, 1240, 1360];

const elders: PaperScene = {
	sky: ['#0b1626', '#1f3550'],
	far: '#3a5068',
	near: '#081018',
	light: { x: 1000, y: 470, r: 760, color: '#f4d27a', rise: 120, power: 0.9 },
	cam: { from: [40, 30, 1.0], to: [-30, -20, 1.14] },
	back: (ctx, f) => {
		stars(ctx, f.t, 50, 15, 380);
		moon(ctx, 1000, 470 - 120 * ease(f.k), 230, '#f2cf73');
	},
	sheets: [
		{ depth: 0.06, cut: (p) => fillTo(p, ridge(152, 720, 20, 0.6)) },
		{
			depth: 0.28,
			cut: (p) => {
				fillTo(p, ridge(153, 790, 40, 0.7));
				pine(p, 200, 800, 260, 154, 0.2);
				birch(p, 330, 800, 220, 155);
				pine(p, 1720, 800, 280, 156, -0.2);
				birch(p, 1840, 800, 200, 157);
			}
		},
		{
			depth: 0.55,
			cut: (p) => fillTo(p, ELDER_MOUND),
			draw: (ctx, f) => {
				const s = 1.5;
				ELDERS.forEach((x, i) => {
					const dir = x < 1000 ? 1 : -1;
					const y = yAt(ELDER_MOUND, x) + 3;
					person(ctx, x, y, s, { cap: 'feather', torch: true, dir, wind: 1 });
					const lit = span(f.k, 0.08 + i * 0.1, 0.18 + i * 0.1);
					if (lit > 0.01) flames(ctx, x + dir * 22 * s - 8 * s, y - 70 * s, 16 * s, 34 * s, f.t, 160 + i, lit);
				});
				const egg = span(f.k, 0.72, 1);
				if (egg > 0.01) {
					ctx.save();
					ctx.fillStyle = `rgba(255,244,200,${egg})`;
					ctx.shadowColor = '#fff4c8';
					ctx.shadowBlur = 40 * egg;
					ctx.beginPath();
					disc(ctx, 1000, yAt(ELDER_MOUND, 1000) - 14, 10 + 4 * egg);
					ctx.fill();
					ctx.restore();
				}
			}
		},
		{ depth: 0.9, cut: (p) => fillTo(p, ridge(158, 985, 20)), draw: (ctx, f) => reeds(ctx, -200, 2200, 985, f.t, 110, 159, 110) }
	]
};

/* ── Ten attendants down the southwestern coast ─────────────────── */

const SHORE = ridge(171, 790, 14, 0.5);

const attendants: PaperScene = {
	sky: ['#f1c88c', '#9db0c4'],
	far: '#a7b6c6',
	near: '#26303e',
	light: { x: 1450, y: 380, r: 820, color: '#ffe0a0', power: 0.85 },
	cam: { from: [-80, 0, 1.0], to: [60, -10, 1.12] },
	back: (ctx, f) => {
		sun(ctx, 1450, 380, 90, f.t, '#ffe7b0', 'rgba(255,230,170,0.3)');
		ctx.fillStyle = '#4a5160';
		birds(ctx, f.t, 6, 12, 220, 30, 0.9);
	},
	sheets: [
		{ depth: 0.05, cut: (p) => fillTo(p, peaks(172, 640, [{ x: 300, h: 70, w: 120 }, { x: 900, h: 50, w: 90 }, { x: 1700, h: 90, w: 140 }], 4)) },
		{ depth: 0.16, draw: (ctx, f) => swell(ctx, 650, f.t, '#8aa1b7', 7, 120, 20) },
		{
			depth: 0.26,
			draw: (ctx, f) => {
				boat(ctx, 520, 690, 0.9, f.t, '#e8dcc2');
				boat(ctx, 1250, 700, 0.7, f.t + 2, '#e8dcc2');
				swell(ctx, 708, f.t, '#6f879f', 9, 100, -26);
			}
		},
		{
			depth: 0.45,
			cut: (p) => {
				fillTo(p, peaks(173, 900, [{ x: 1880, h: 320, w: 260 }], 8));
				pine(p, 1800, 640, 160, 174, -0.2);
			}
		},
		{
			depth: 0.6,
			color: '#5d6676',
			cut: (p) => fillTo(p, SHORE),
			draw: (ctx, f) =>
				procession(ctx, lane(SHORE, -220, 1720), 10, f.t, {
					s: 1.6,
					speed: 30,
					who: (i) => ({ cap: 'feather', pack: true, wind: 1 + (i % 2) }),
					seed: 41
				})
		},
		{
			depth: 0.9,
			cut: (p) => {
				fillTo(p, ridge(175, 1010, 22));
				for (let i = 0; i < 5; i++) poly(p, [[i * 120 - 60, 1020], [i * 120 + 10, 960 - (i % 2) * 30], [i * 120 + 70, 1020]]);
			},
			draw: (ctx, f) => reeds(ctx, 1300, 2200, 1010, f.t, 40, 176, 90)
		}
	]
};

/* ── A new generation arises to meet the age ────────────────────── */

const GEN_RIDGE = ridge(181, 760, 18, 0.5);
const SEVEN: { who: Who; hex: string }[] = [
	{ who: { cap: 'feather' }, hex: '#2A5FB8' },
	{ who: { cap: 'feather' }, hex: '#D8258C' },
	{ who: { cap: 'feather' }, hex: '#C41E3A' },
	{ who: { cap: 'feather' }, hex: '#3b4a7a' },
	{ who: { cap: 'helm', spear: true }, hex: '#d0362f' },
	{ who: { cap: 'crown' }, hex: '#e08a2e' },
	{ who: { cap: 'helm' }, hex: '#d9b13a' }
];

const generation: PaperScene = {
	sky: ['#060912', '#1b2238'],
	far: '#2c3550',
	near: '#05070d',
	light: { x: 1000, y: 560, r: 900, color: '#ffe6a0', rise: 180, power: 0.95 },
	cam: { from: [0, 40, 1.04], to: [0, -20, 1.16] },
	back: (ctx, f) => {
		stars(ctx, f.t, 90, 21, 520);
		sun(ctx, 1000, 560 - 180 * ease(f.k), 60, f.t, '#fff1c4', 'rgba(255,236,180,0.35)', 8);
	},
	sheets: [
		{ depth: 0.06, cut: (p) => fillTo(p, peaks(182, 700, [{ x: 400, h: 150, w: 300 }, { x: 1600, h: 170, w: 300 }])) },
		{ depth: 0.3, cut: (p) => fillTo(p, ridge(183, 730, 30, 0.6)) },
		{
			depth: 0.6,
			cut: (p) => fillTo(p, GEN_RIDGE),
			draw: (ctx, f) => {
				const above = new Path2D();
				fillUp(above, GEN_RIDGE);
				ctx.save();
				ctx.clip(above);
				const s = 2.7;
				SEVEN.forEach(({ who, hex }, i) => {
					const x = 580 + i * 140;
					const up = span(f.k, 0.04 + i * 0.09, 0.3 + i * 0.09);
					const y = yAt(GEN_RIDGE, x) + 3 + (1 - up) * 70 * s;
					ctx.fillStyle = f.color;
					person(ctx, x, y, s, { ...who, wind: 2, dir: i < 3 ? 1 : -1 });
					ctx.save();
					ctx.shadowColor = hex;
					ctx.shadowBlur = 6;
					ctx.fillStyle = hex;
					ctx.globalAlpha = 0.9 * up;
					ctx.beginPath();
					poly(ctx, [
						[x - 8.6 * s, y - 32 * s],
						[x + 8.6 * s, y - 32 * s],
						[x + 8.8 * s, y - 27.5 * s],
						[x - 8.8 * s, y - 27.5 * s]
					]);
					ctx.fill();
					ctx.restore();
				});
				ctx.restore();
			}
		},
		{ depth: 0.9, cut: (p) => fillTo(p, ridge(184, 1000, 26)) }
	]
};

export const PAPER = { tigers, heaven, love, wanggum, invasion, refugees, tribes, elders, attendants, generation } satisfies Record<string, PaperScene>;

export type PaperId = keyof typeof PAPER;
