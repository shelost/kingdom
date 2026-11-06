import * as THREE from 'three';
import { rng, type P2 } from './geo';
import { wallStations } from './fortress';
import {
	PART,
	piece,
	merge,
	blob,
	lathe,
	pleat,
	limb,
	rod,
	rigMaterial,
	contactMaterial,
	contactDisc,
	type Paint,
	type RigUniforms,
	type V3
} from './rig';

/**
 * Stylized period people for /stage: chunky toy-miniature bodies (a big head, big hands, rounded
 * cloth) in dress that follows the costume canon and the research boards.
 *
 * - Commoners in every Samhan kingdom wear undyed white hemp; colour belongs to rank.
 * - Men wear the jougwan (small black lacquered cap, two barred pheasant feathers), a cloth wrap
 *   or a bare topknot; women a short jeogori over a pleated chima, Goguryeo women a long bordered
 *   jacket and a striped hem (Ssangyeongchong), Goguryeo ladies the Susan-ri striped skirt.
 * - Soldiers wear steel-grey lamellar to the knee (Anak No. 3), the kingdom colour only in the
 *   cloth at sleeve, skirt and collar: Silla blue with the tall pointed helm, Baekje yellow with the
 *   round helm and red plume, Goguryeo red with red wing shoulder-flaps and a peaked plumed helm,
 *   Gaya purple with the cone helm, Tang vermilion with mingguang chest mirrors, Yamato red lacing
 *   and a white headband.
 * - Tang officials: futou cap, round-collar robe in rank colour, hu tablet. Yamato courtiers:
 *   Asuka black cap and long robe in the twelve-cap colours. Monks: grey or ochre robe and kasaya.
 */

export type Dress = 'silla' | 'baekje' | 'goguryeo' | 'gaya' | 'tamla' | 'tang' | 'yamato';
export type Role = 'man' | 'woman' | 'lady' | 'official' | 'guard' | 'archer' | 'monk' | 'rider';
/** A role in the site's dress, or in another kingdom's (Tang soldiers at Ansi). */
export type Who = Role | { role: Role; dress?: Dress };

type Helm = 'pointed' | 'peaked' | 'round' | 'cone' | 'tang' | 'band';
type Hat = 'jougwan' | 'gauze' | 'futou' | 'wa' | 'wrap' | 'knot';

type Kit = {
	/** Kingdom cloth: sleeves, skirt and collar under the lamellar, banners. */
	accent: string;
	/** Jacket and robe borders. */
	border: string;
	/** Official robe colours, highest rank first. */
	ranks: string[];
	/** Undyed hemp and ramie. */
	common: string[];
	/** The noblewoman's skirt: stripes where the kingdom wears them, else one colour per lady. */
	skirt: string[];
	helm: Helm;
	officialHat: Hat;
	manHats: Hat[];
	/** Lamellar lacing colour. */
	lace: string;
	wings: boolean;
	mirror: boolean;
	women: 'stripe' | 'plain' | 'tang' | 'wa';
	robe: 'korean' | 'round';
	tablet: boolean;
	/** Plume or tassel on helm and spear. */
	plume: string;
	/** Dotted cloth on trousers and long jackets (the Muyongchong dancers). */
	dots?: boolean;
};

const WHITES = ['#f4f1e8', '#efe9db', '#e9e2d0', '#f2eee4', '#e3d9c3', '#ebe5d6'];

const KITS: Record<Dress, Kit> = {
	silla: {
		accent: '#2A5FB8',
		border: '#2e3550',
		ranks: ['#6a3d9a', '#a3313c', '#2f5fa8', '#d1a43a'],
		common: WHITES,
		skirt: ['#b8443c', '#f1ede3', '#3f6fb0', '#6a3d9a'],
		helm: 'pointed',
		officialHat: 'jougwan',
		manHats: ['jougwan', 'knot', 'jougwan'],
		lace: '#3a404a',
		wings: false,
		mirror: false,
		women: 'plain',
		robe: 'korean',
		tablet: true,
		plume: '#2A5FB8'
	},
	baekje: {
		accent: '#d9b13a',
		border: '#6a3a2a',
		ranks: ['#6a3d9a', '#a3313c', '#2f6fa8'],
		common: WHITES,
		skirt: ['#d9b13a', '#f1ede3', '#a3313c', '#6a3d9a'],
		helm: 'round',
		officialHat: 'gauze',
		manHats: ['jougwan', 'knot', 'jougwan'],
		lace: '#7a2a22',
		wings: false,
		mirror: false,
		women: 'plain',
		robe: 'korean',
		tablet: false,
		plume: '#b3262e'
	},
	goguryeo: {
		accent: '#C30000',
		border: '#2a2420',
		ranks: ['#a3313c', '#c27a2c', '#2f3f6a'],
		common: WHITES,
		skirt: ['#c0413a', '#f1ede3', '#2f4f8a', '#d9a43a'],
		helm: 'peaked',
		officialHat: 'jougwan',
		manHats: ['jougwan', 'wrap', 'jougwan'],
		lace: '#8f1d1d',
		wings: true,
		mirror: false,
		women: 'stripe',
		robe: 'korean',
		tablet: false,
		plume: '#C30000',
		dots: true
	},
	gaya: {
		accent: '#8B5CF6',
		border: '#3a2a4a',
		ranks: ['#6a3d9a', '#a3313c', '#2f5fa8'],
		common: WHITES,
		skirt: ['#8B5CF6', '#f1ede3', '#a3313c'],
		helm: 'cone',
		officialHat: 'jougwan',
		manHats: ['jougwan', 'knot'],
		lace: '#4a3a60',
		wings: false,
		mirror: false,
		women: 'plain',
		robe: 'korean',
		tablet: false,
		plume: '#8B5CF6'
	},
	tamla: {
		accent: '#E07030',
		border: '#6a4a2a',
		ranks: ['#c86a2a', '#8a5a3a'],
		common: ['#f1ece0', '#e8dfcb', '#ddd0b4', '#efe8d8', '#d8c8a6'],
		skirt: ['#E07030', '#f1ede3'],
		helm: 'round',
		officialHat: 'wrap',
		manHats: ['wrap', 'knot'],
		lace: '#6a3a1a',
		wings: false,
		mirror: false,
		women: 'plain',
		robe: 'korean',
		tablet: false,
		plume: '#E07030'
	},
	tang: {
		accent: '#d8452b',
		border: '#1c1a1a',
		ranks: ['#5b2f8a', '#b3262e', '#2f7a4a', '#2e5d9a'],
		common: ['#efe9db', '#e2d6bc', '#d8c8a6', '#c9b08a', '#ece6d8'],
		skirt: ['#b3262e', '#2f7a4a', '#d1a43a', '#5b2f8a'],
		helm: 'tang',
		officialHat: 'futou',
		manHats: ['futou'],
		lace: '#7a2a22',
		wings: false,
		mirror: true,
		women: 'tang',
		robe: 'round',
		tablet: true,
		plume: '#d8452b'
	},
	yamato: {
		accent: '#c8322e',
		border: '#b3262e',
		ranks: ['#6a3d9a', '#2f5fa8', '#b3262e', '#d1a43a', '#f2efe6'],
		common: ['#f1ede3', '#e6dcc6', '#ddd2bb', '#ece6d8'],
		skirt: ['#b3262e', '#2f7a4a', '#f1ede3', '#d1a43a'],
		helm: 'band',
		officialHat: 'wa',
		manHats: ['wrap'],
		lace: '#b3262e',
		wings: false,
		mirror: false,
		women: 'wa',
		robe: 'round',
		tablet: true,
		plume: '#c8322e'
	}
};

const SKIN = '#ecc6a1';
const HAIR = '#1d1712';
const LACQUER = '#18161a';
const STEEL = '#9aa3ad';
const STEEL_DK = '#66707b';
const SHOE = '#2a221c';
const STRAW = '#c9ad74';
const WOOD = '#6b4a2c';
const GOLD = '#d4a640';
const IVORY = '#efe6cf';
const SASH = '#2d261f';
const MONK = ['#8c8a84', '#9a7a4a', '#7d7f7a', '#a08458'];
const COATS = ['#7a3b22', '#8a4a2a', '#5b3a26', '#d9d4c8', '#2a2420', '#a0643a'];
const KASAYA = '#b07a2e';

/* ------------------------------------------------------------------ body plan (metres, faces +z) */

const HIP = 0.64;
const SH = 1.11;
const HEAD = 1.37;
const HR = 0.17;
const NECK: V3 = [0, 1.2, 0];

const col = (hex: string) => new THREE.Color(hex);

/** Two-colour zone paint: `a` where `test` holds, else `b`. */
function zone(test: (x: number, y: number, z: number) => boolean, a: string, b: string): Paint {
	const ca = col(a);
	const cb = col(b);
	return (x, y, z, out) => {
		out.copy(test(x, y, z) ? ca : cb);
	};
}

/** Left-over-right jacket closure, the dark band running from the right collar to the left hip. */
function closure(x: number, y: number, z: number, hem: number): boolean {
	return z > 0.04 && y > hem + 0.04 && y < 1.2 && Math.abs(x - (0.6 * (y - 0.8) - 0.03)) < 0.032;
}

type Parts = THREE.BufferGeometry[];

function headParts(p: Parts, o: { shaved?: boolean; hair?: 'knot' | 'bun' | 'high' | 'braid' | 'none' }): void {
	const H = { part: PART.head, pivot: NECK };
	p.push(piece(blob(HR, HR * 1.02, HR * 0.96, 0, HEAD, 0.01, 14), SKIN, { ...H, grad: 0.12 }));
	for (const s of [1, -1]) {
		p.push(piece(blob(0.022, 0.03, 0.012, s * 0.062, HEAD - 0.005, 0.158, 6), '#1c130d', { ...H, grad: 0 }));
		p.push(piece(blob(0.03, 0.04, 0.02, s * 0.168, HEAD - 0.01, 0, 6), SKIN, { ...H, grad: 0.1 }));
	}
	if (o.shaved) return;
	const cap = new THREE.SphereGeometry(HR * 1.05, 14, 8, 0, Math.PI * 2, 0, 1.3);
	cap.rotateX(-0.55);
	cap.translate(0, HEAD + 0.005, -0.006);
	p.push(piece(cap, HAIR, { ...H, grad: 0.1 }));
	const hair = o.hair ?? 'knot';
	if (hair === 'knot') p.push(piece(blob(0.06, 0.068, 0.06, 0, HEAD + HR + 0.02, -0.03, 8), HAIR, H));
	else if (hair === 'bun') {
		p.push(piece(blob(0.085, 0.075, 0.07, 0, HEAD + 0.03, -HR - 0.02, 8), HAIR, H));
		p.push(piece(rod(0.008, [-0.14, HEAD + 0.05, -HR - 0.02], [0.14, HEAD + 0.06, -HR - 0.02], 4), GOLD, H));
	} else if (hair === 'high') {
		p.push(piece(blob(0.08, 0.13, 0.08, 0, HEAD + HR + 0.08, -0.03, 8), HAIR, H));
		p.push(piece(blob(0.02, 0.02, 0.02, 0.06, HEAD + HR + 0.06, 0.04, 5), GOLD, H));
	} else if (hair === 'braid') {
		const t = new THREE.TorusGeometry(0.125, 0.042, 6, 14);
		t.rotateX(Math.PI / 2);
		t.translate(0, HEAD + 0.12, -0.015);
		p.push(piece(t, HAIR, H));
	}
}

const barred: Paint = (_x, y, _z, out) => {
	out.copy(Math.sin(y * 95) > 0.25 ? FEATHER_DK : FEATHER);
};
const FEATHER = col('#cfa96a');
const FEATHER_DK = col('#5a3b22');

function hatParts(p: Parts, hat: Hat): void {
	const H = { part: PART.head, pivot: NECK };
	const top = HEAD + HR;
	if (hat === 'jougwan') {
		const c = lathe([[0, 0], [0.09, 0], [0.092, 0.05], [0.078, 0.1], [0.05, 0.13], [0, 0.14]], 10);
		c.translate(0, top - 0.05, -0.015);
		p.push(piece(c, LACQUER, { ...H, grad: 0.1 }));
		for (const s of [1, -1]) {
			const f = blob(0.03, 0.21, 0.012, 0, 0, 0, 6);
			f.rotateZ(-s * 0.3);
			f.translate(s * 0.085, top + 0.2, -0.03);
			p.push(piece(f, barred, { ...H, grad: 0 }));
		}
	} else if (hat === 'gauze') {
		const c = lathe([[0, 0], [0.16, 0], [0.158, 0.06], [0.135, 0.14], [0.08, 0.19], [0, 0.2]], 12);
		c.translate(0, HEAD + 0.06, -0.01);
		p.push(piece(c, LACQUER, { ...H, grad: 0.12 }));
		for (const s of [1, -1]) {
			const leaf = blob(0.022, 0.075, 0.01, 0, 0, 0, 6);
			leaf.rotateZ(-s * 0.25);
			leaf.translate(s * 0.13, top + 0.08, 0.02);
			p.push(piece(leaf, '#dfe2ea', { ...H, grad: 0 }));
		}
	} else if (hat === 'futou') {
		const c = lathe([[0, 0], [0.18, 0], [0.176, 0.06], [0.14, 0.12], [0, 0.14]], 12);
		c.translate(0, HEAD + 0.05, -0.01);
		p.push(piece(c, LACQUER, { ...H, grad: 0.1 }));
		p.push(piece(blob(0.085, 0.095, 0.075, 0, top + 0.06, -0.06, 8), LACQUER, H));
		for (const s of [1, -1]) p.push(piece(limb(0.018, [s * 0.05, HEAD + 0.06, -0.17], [s * 0.08, HEAD - 0.2, -0.21], 5), LACQUER, H));
	} else if (hat === 'wa') {
		const c = lathe([[0, 0], [0.18, 0], [0.172, 0.08], [0.12, 0.18], [0.06, 0.24], [0, 0.25]], 12);
		c.translate(0, HEAD + 0.04, -0.015);
		p.push(piece(c, LACQUER, { ...H, grad: 0.12 }));
		p.push(piece(limb(0.02, [0, HEAD + 0.1, -0.17], [0, HEAD - 0.12, -0.2], 5), LACQUER, H));
	} else if (hat === 'wrap') {
		const t = new THREE.TorusGeometry(0.168, 0.036, 6, 16);
		t.rotateX(Math.PI / 2);
		t.translate(0, HEAD + 0.075, -0.005);
		p.push(piece(t, '#efe9dc', H));
		p.push(piece(blob(0.075, 0.07, 0.075, 0, top + 0.025, -0.03, 8), '#efe9dc', H));
	}
}

function helmParts(p: Parts, kit: Kit): void {
	const H = { part: PART.head, pivot: NECK };
	const base = HEAD + 0.04;
	const lam: Paint = (_x, y, _z, out) => {
		out.copy((y * 20) % 1 < 0.22 ? LACE_DARK : (y * 10) % 1 < 0.5 ? STEEL_C : STEEL_DK_C);
	};
	const guard = (lo: number, hi: number, flare: number) => {
		const g = lathe([[HR + 0.035 + flare, lo], [HR + 0.03, hi]], 10, Math.PI * 0.42, Math.PI * 1.16);
		g.translate(0, 0, -0.005);
		p.push(piece(g, lam, H));
	};
	if (kit.helm === 'band') {
		const t = new THREE.TorusGeometry(0.17, 0.03, 6, 16);
		t.rotateX(Math.PI / 2);
		t.translate(0, HEAD + 0.07, 0);
		p.push(piece(t, '#f4f1ea', H));
		p.push(piece(blob(0.06, 0.068, 0.06, 0, HEAD + HR + 0.02, -0.03, 8), HAIR, H));
		return;
	}
	let prof: [number, number][];
	if (kit.helm === 'pointed') prof = [[0, -0.001], [0.19, 0], [0.192, 0.06], [0.16, 0.2], [0.09, 0.33], [0.03, 0.43], [0, 0.45]];
	else if (kit.helm === 'peaked') prof = [[0, -0.001], [0.19, 0], [0.19, 0.07], [0.165, 0.16], [0.1, 0.24], [0.03, 0.29], [0, 0.3]];
	else if (kit.helm === 'cone') prof = [[0, -0.001], [0.19, 0], [0.188, 0.05], [0.13, 0.25], [0.05, 0.47], [0, 0.52]];
	else if (kit.helm === 'tang') prof = [[0, -0.001], [0.195, 0], [0.19, 0.08], [0.16, 0.17], [0.08, 0.24], [0, 0.26]];
	else prof = [[0, -0.001], [0.192, 0], [0.19, 0.08], [0.165, 0.16], [0.1, 0.22], [0, 0.245]];
	const helm = lathe(prof, 12);
	helm.translate(0, base, -0.005);
	p.push(piece(helm, STEEL, { ...H, grad: 0.3 }));
	const brow = new THREE.TorusGeometry(0.192, 0.018, 4, 16);
	brow.rotateX(Math.PI / 2);
	brow.translate(0, base + 0.01, -0.005);
	p.push(piece(brow, kit.helm === 'tang' ? GOLD : STEEL_DK, H));
	const tip = base + prof[prof.length - 1][1];
	if (kit.helm === 'tang') {
		guard(HEAD - 0.16, base + 0.02, 0.07);
		p.push(piece(rod(0.012, [0, tip - 0.02, -0.005], [0, tip + 0.12, -0.005], 4), GOLD, H));
		p.push(piece(blob(0.04, 0.06, 0.04, 0, tip + 0.13, -0.005, 6), kit.plume, H));
	} else {
		guard(HEAD - 0.12, base + 0.02, 0.03);
		if (kit.helm === 'peaked' || kit.helm === 'round') {
			p.push(piece(rod(0.01, [0, tip - 0.02, -0.005], [0, tip + 0.08, -0.005], 4), STEEL_DK, H));
			const plume = blob(0.045, 0.11, 0.045, 0, 0, 0, 6);
			plume.rotateX(-0.5);
			plume.translate(0, tip + 0.13, -0.05);
			p.push(piece(plume, kit.plume, H));
		} else if (kit.helm === 'pointed') {
			p.push(piece(blob(0.03, 0.07, 0.03, 0, tip + 0.05, -0.01, 6), kit.plume, H));
		}
	}
}

const LACE_DARK = col('#3a3f47');
const STEEL_C = col(STEEL);
const STEEL_DK_C = col(STEEL_DK);

function legs(p: Parts, cloth: string | Paint, shoe: string, tint: number): void {
	for (const s of [1, -1]) {
		const L = { part: s > 0 ? PART.legL : PART.legR, pivot: [s * 0.09, HIP, 0] as V3 };
		p.push(piece(limb(0.088, [s * 0.09, HIP, 0], [s * 0.1, 0.14, 0.01], 8, 0.064), cloth, { ...L, tint }));
		p.push(piece(blob(0.068, 0.052, 0.115, s * 0.1, 0.05, 0.04, 8), shoe, { ...L, grad: 0.1 }));
	}
}

function boots(p: Parts, cloth: string): void {
	for (const s of [1, -1]) {
		const L = { part: s > 0 ? PART.legL : PART.legR, pivot: [s * 0.09, HIP, 0] as V3 };
		p.push(piece(limb(0.085, [s * 0.09, HIP, 0], [s * 0.1, 0.36, 0.01], 8, 0.07), cloth, L));
		p.push(piece(limb(0.072, [s * 0.1, 0.4, 0.01], [s * 0.1, 0.1, 0.02], 8, 0.064), SHOE, L));
		p.push(piece(blob(0.07, 0.055, 0.12, s * 0.1, 0.05, 0.045, 8), SHOE, { ...L, grad: 0.1 }));
	}
}

/** Swinging arms with cuffs and big hands; `still` keeps them by the sides. */
function arms(p: Parts, sleeve: string | Paint, tint: number | ((x: number, y: number, z: number) => number), o: { still?: boolean; wide?: boolean; skip?: -1 | 1 } = {}): void {
	for (const s of [1, -1]) {
		if (o.skip === s) continue;
		const A = { part: o.still ? PART.body : s > 0 ? PART.armL : PART.armR, pivot: [s * 0.215, SH, 0] as V3 };
		p.push(piece(limb(0.068, [s * 0.215, SH, 0], [s * 0.27, 0.76, 0.03], 8, o.wide ? 0.11 : 0.074), sleeve, { ...A, tint }));
		p.push(piece(blob(0.06, 0.066, 0.06, s * 0.28, 0.7, 0.04, 8), SKIN, { ...A, grad: 0.1 }));
	}
}

/** Arms folded forward to the hands at the chest (officials, monks), with an optional tablet. */
function claspedArms(p: Parts, sleeve: string, tint: number, o: { tablet?: boolean; beads?: boolean; prayer?: boolean }): void {
	const hand: V3 = o.prayer ? [0, 1.0, 0.22] : [0, 0.86, 0.24];
	for (const s of [1, -1]) {
		p.push(piece(limb(0.068, [s * 0.215, SH, 0], [s * 0.06, hand[1] + 0.02, hand[2] - 0.04], 8, 0.125), sleeve, { tint }));
	}
	p.push(piece(blob(0.075, o.prayer ? 0.1 : 0.065, 0.06, ...hand, 8), SKIN, { grad: 0.1 }));
	if (o.tablet) {
		const t = new THREE.BoxGeometry(0.075, 0.34, 0.018);
		t.rotateX(-0.25);
		t.translate(0, hand[1] + 0.15, hand[2] + 0.05);
		p.push(piece(t, IVORY, { grad: 0.1 }));
	}
	if (o.beads) {
		const b = new THREE.TorusGeometry(0.07, 0.012, 4, 14);
		b.translate(0, hand[1] - 0.1, hand[2] + 0.02);
		p.push(piece(b, '#3a2418', { grad: 0 }));
	}
}

function sash(p: Parts, y: number, r: number, color: string, knot = true): void {
	const t = new THREE.TorusGeometry(r, 0.03, 5, 16);
	t.rotateX(Math.PI / 2);
	t.scale(1, 1, 0.8);
	t.translate(0, y, 0);
	p.push(piece(t, color, { grad: 0.1 }));
	if (!knot) return;
	p.push(piece(blob(0.045, 0.04, 0.03, 0.09, y, r * 0.78, 6), color));
	p.push(piece(limb(0.022, [0.1, y - 0.02, r * 0.8], [0.12, y - 0.22, r * 0.84], 5), color));
}

/** Small dark dots set on a surface: `at(u, a)` maps a ring (0..1 down the cloth) and an angle to a point. */
function polka(p: Parts, color: string, rings: number, perRing: number, at: (u: number, a: number) => V3, o: { part?: number; pivot?: V3 } = {}): void {
	for (let i = 0; i < rings; i++) {
		const u = (i + 0.5) / rings;
		for (let k = 0; k < perRing; k++) {
			const a = ((k + (i % 2) * 0.5) / perRing) * Math.PI * 2;
			const [x, y, z] = at(u, a);
			p.push(piece(blob(0.017, 0.017, 0.017, x, y, z, 5), color, { ...o, grad: 0 }));
		}
	}
}

/** The jacket (jeogori), hem at `hem`; body takes the instance colour, the border stays dark. */
function jacket(p: Parts, hem: number, border: string, o: { wide?: number; tint?: boolean; color?: string } = {}): void {
	const w = o.wide ?? 0;
	const g = lathe([[0.205 + w, hem], [0.216 + w, hem + 0.05], [0.19, 0.74], [0.2, 0.9], [0.212, 1.0], [0.2, 1.09], [0.15, 1.16], [0.07, 1.21], [0, 1.22]], 14);
	g.scale(1, 1, 0.8);
	const edge = (x: number, y: number, z: number) => y < hem + 0.06 || closure(x, y, z, hem);
	p.push(piece(g, zone(edge, border, o.color ?? '#ffffff'), { grad: 0.18, tint: o.tint === false ? 0 : (x, y, z) => (edge(x, y, z) ? 0 : 1) }));
}

/** Pleated chima from the hem to `waist`; `paint` lays stripes, else the instance colour. */
function chima(p: Parts, waist: number, hemR: number, paint: Paint | null, tint: number): void {
	const g = lathe([[hemR, 0.0], [hemR + 0.006, 0.05], [hemR * 0.86, 0.3], [hemR * 0.66, 0.6], [0.19, waist - 0.1], [0.175, waist], [0, waist + 0.03]], 24);
	pleat(g, 20, 0.05, 0, waist - 0.1);
	g.scale(1, 1, 0.9);
	p.push(piece(g, paint ?? '#ffffff', { part: PART.skirt, pivot: [0, waist, 0], tint: paint ? 0 : tint, grad: 0.24 }));
	for (const s of [1, -1]) p.push(piece(blob(0.06, 0.04, 0.085, s * 0.08, 0.03, hemR * 0.82, 6), SHOE, { grad: 0.1 }));
}

/** Vertical stripes round a skirt (Susan-ri, Takamatsuzuka). */
function stripes(colors: string[], count: number, below = Infinity): Paint {
	const cs = colors.map(col);
	const plain = col('#f1ede3');
	return (x, y, z, out) => {
		if (y > below) {
			out.copy(plain);
			return;
		}
		const a = (Math.atan2(z, x) / (Math.PI * 2) + 1) * count;
		out.copy(cs[Math.floor(a) % cs.length]);
	};
}

/** Ankle-length robe (officials, monks, Tang and Yamato round collars). */
function robe(p: Parts, kit: Kit, o: { border: boolean; kasaya?: boolean; tint: number }): void {
	const g = lathe([[0.3, 0.02], [0.296, 0.08], [0.245, 0.4], [0.212, 0.72], [0.222, 0.95], [0.226, 1.03], [0.2, 1.12], [0.14, 1.19], [0.06, 1.23], [0, 1.24]], 16);
	pleat(g, 10, 0.03, 0.02, 0.6);
	g.scale(1, 1, 0.82);
	const edge = (x: number, y: number, z: number) => (o.border ? y < 0.1 || closure(x, y, z, 0.2) : kit.robe === 'round' && y > 1.17);
	const band = (x: number, y: number) => !!o.kasaya && Math.abs(y - (0.95 + x * 1.1)) < 0.11 && y > 0.45;
	const base = col('#ffffff');
	const cb = col(kit.border);
	const ck = col(KASAYA);
	const paint: Paint = (x, y, z, out) => {
		out.copy(band(x, y) ? ck : edge(x, y, z) ? cb : base);
	};
	p.push(piece(g, paint, { part: PART.skirt, pivot: [0, 0.8, 0], grad: 0.22, tint: (x, y, z) => (band(x, y) || edge(x, y, z) ? 0 : o.tint) }));
	for (const s of [1, -1]) p.push(piece(blob(0.062, 0.045, 0.1, s * 0.09, 0.035, 0.26, 6), SHOE, { grad: 0.1 }));
}

/** Knee-length steel lamellar with the kingdom cloth peeking out. */
function lamellar(p: Parts, kit: Kit): void {
	const lace = col(kit.lace);
	const paint: Paint = (x, y, z, out) => {
		const row = (y * 17) % 1;
		if (row < 0.16) {
			out.copy(lace);
			return;
		}
		const colN = Math.floor((Math.atan2(z, x) / Math.PI) * 14 + (Math.floor(y * 17) % 2) * 0.5);
		out.copy(colN % 2 ? STEEL_C : STEEL_DK_C).lerp(STEEL_C, 0.45);
	};
	const coat = lathe([[0.24, 0.34], [0.246, 0.4], [0.206, 0.73], [0.222, 0.95], [0.23, 1.04], [0.206, 1.12], [0.14, 1.19], [0.06, 1.225], [0, 1.23]], 16);
	coat.scale(1, 1, 0.82);
	p.push(piece(coat, paint, { grad: 0.25 }));
	const skirt = lathe([[0.236, 0.26], [0.244, 0.36]], 16);
	skirt.scale(1, 1, 0.84);
	p.push(piece(skirt, '#ffffff', { tint: 1, grad: 0.1 }));
	const collar = new THREE.TorusGeometry(0.11, 0.035, 5, 14);
	collar.rotateX(Math.PI / 2);
	collar.translate(0, 1.21, 0.0);
	p.push(piece(collar, '#ffffff', { tint: 1, grad: 0 }));
	sash(p, 0.74, 0.215, SASH, false);
	for (const s of [1, -1]) {
		if (kit.wings) {
			const w = blob(0.14, 0.034, 0.11, 0, 0, 0, 8);
			w.rotateZ(s * 0.55);
			w.translate(s * 0.28, 1.13, -0.01);
			p.push(piece(w, kit.accent, { grad: 0.15 }));
		}
		const sh = blob(kit.mirror ? 0.14 : 0.11, 0.075, 0.12, s * 0.205, 1.1, 0, 8);
		p.push(piece(sh, paint, { grad: 0.2 }));
		if (kit.mirror) p.push(piece(blob(0.075, 0.075, 0.022, s * 0.09, 0.98, 0.18, 10), '#e1e5ea', { grad: 0.05 }));
	}
}

function spear(p: Parts, kit: Kit, s: number): void {
	const x = s * 0.31;
	p.push(piece(rod(0.02, [x, 0.03, 0.12], [x, 2.75, 0.12], 5), WOOD, { grad: 0.1 }));
	p.push(piece(blob(0.028, 0.14, 0.012, x, 2.88, 0.12, 6), '#c9ced4', { grad: 0 }));
	p.push(piece(blob(0.04, 0.06, 0.04, x, 2.72, 0.12, 6), kit.plume, { grad: 0 }));
	p.push(piece(limb(0.068, [s * 0.215, SH, 0], [x, 0.98, 0.1], 8, 0.074), '#ffffff', { tint: 1 }));
	p.push(piece(blob(0.062, 0.068, 0.062, x, 0.95, 0.12, 8), SKIN, { grad: 0.1 }));
}

function bow(p: Parts, s: number): void {
	const x = s * 0.33;
	const arc = new THREE.TorusGeometry(0.62, 0.018, 4, 18, Math.PI * 0.85);
	arc.rotateZ(Math.PI / 2 - Math.PI * 0.425);
	arc.rotateY(Math.PI / 2);
	arc.translate(x - s * 0.0, 0.95, -0.3);
	p.push(piece(arc, '#4a2e1c', { grad: 0 }));
	p.push(piece(limb(0.068, [s * 0.215, SH, 0], [x, 0.95, 0.12], 8, 0.074), '#ffffff', { tint: 1 }));
	p.push(piece(blob(0.062, 0.068, 0.062, x, 0.95, 0.15, 8), SKIN, { grad: 0.1 }));
	const q = lathe([[0.055, 0], [0.06, 0.05], [0.06, 0.5], [0, 0.5]], 8);
	q.rotateZ(-0.35 * s);
	q.translate(-s * 0.12, 0.72, -0.22);
	p.push(piece(q, '#5a3b26', { grad: 0.15 }));
	for (const k of [-1, 0, 1]) p.push(piece(blob(0.015, 0.05, 0.015, -s * 0.12 + k * 0.025 - s * 0.2, 1.3, -0.22, 4), '#efe6d0', { grad: 0 }));
}

/* ------------------------------------------------------------------ archetypes */

/** How many hat variants a role has in a dress. */
function variants(role: Role, kit: Kit): number {
	if (role === 'man') return kit.manHats.length;
	if (role === 'lady' && kit.women !== 'stripe' && kit.women !== 'wa') return kit.skirt.length;
	return 1;
}

function figureParts(role: Role, dress: Dress, v: number): Parts {
	const kit = KITS[dress];
	const p: Parts = [];
	if (role === 'man') {
		legs(p, '#ffffff', STRAW, 1);
		if (kit.dots) {
			for (const s of [1, -1]) {
				polka(p, kit.border, 4, 6, (u, a) => {
					const r = 0.09 - 0.022 * u;
					return [s * (0.09 + 0.01 * u) + Math.sin(a) * r, HIP - 0.08 - u * 0.38, 0.005 * u + Math.cos(a) * r];
				}, { part: s > 0 ? PART.legL : PART.legR, pivot: [s * 0.09, HIP, 0] });
			}
		}
		jacket(p, 0.44, kit.border);
		sash(p, 0.75, 0.2, SASH);
		arms(p, zone((_x, y) => y < 0.81, kit.border, '#ffffff'), (_x, y) => (y < 0.81 ? 0 : 1));
		const hat = kit.manHats[v % kit.manHats.length];
		headParts(p, { hair: hat === 'knot' || hat === 'jougwan' ? 'knot' : 'none' });
		hatParts(p, hat);
	} else if (role === 'woman' || role === 'lady') {
		const lady = role === 'lady';
		if (kit.women === 'tang') {
			chima(p, 1.0, lady ? 0.38 : 0.34, null, 1);
			const bodice = lathe([[0.2, 0.96], [0.205, 1.0], [0.21, 1.06], [0.19, 1.12], [0.13, 1.18], [0.05, 1.21], [0, 1.22]], 14);
			bodice.scale(1, 1, 0.8);
			p.push(piece(bodice, lady ? kit.skirt[1] : '#efe6d4', { grad: 0.15 }));
			const shawl = new THREE.TorusGeometry(0.24, 0.03, 5, 16, Math.PI * 1.2);
			shawl.rotateX(Math.PI / 2 - 0.5);
			shawl.rotateY(Math.PI * 0.9);
			shawl.translate(0, 1.08, -0.02);
			p.push(piece(shawl, lady ? '#e7c66a' : '#d9cfb9', { grad: 0.1 }));
			arms(p, lady ? kit.skirt[2] : '#efe6d4', 0, { wide: true });
			headParts(p, { hair: 'high' });
		} else {
			const long = kit.women === 'stripe' || kit.women === 'wa';
			const hem = long ? 0.5 : 0.66;
			let skirt: Paint | null = null;
			if (lady && long) skirt = stripes(kit.skirt, 22);
			else if (!lady && kit.women === 'stripe') skirt = stripes([kit.skirt[0], '#f1ede3', kit.skirt[2]], 22, 0.14);
			else if (lady) skirt = zone(() => true, kit.skirt[v % kit.skirt.length], '#000000');
			chima(p, long ? 0.86 : 0.92, lady ? 0.4 : 0.34, skirt, 1);
			jacket(p, hem, kit.border, { wide: long ? 0.02 : 0 });
			if (kit.dots && long) {
				polka(p, kit.border, 4, 12, (u, a) => {
					const r = 0.214 - 0.012 * u;
					return [Math.sin(a) * r, 0.96 - u * (0.96 - hem - 0.1), Math.cos(a) * r * 0.8];
				});
			}
			sash(p, long ? 0.76 : 0.8, 0.2, lady ? kit.border : SASH);
			arms(p, zone((_x, y) => y < 0.81, kit.border, '#ffffff'), (_x, y) => (y < 0.81 ? 0 : 1), { wide: lady });
			headParts(p, { hair: dress === 'goguryeo' ? 'braid' : 'bun' });
		}
	} else if (role === 'official') {
		robe(p, kit, { border: kit.robe === 'korean', tint: 1 });
		sash(p, 0.76, 0.22, kit.robe === 'round' ? '#1c1a1a' : kit.border, kit.robe === 'korean');
		if (kit.robe === 'round') for (const a of [-0.9, -0.3, 0.3, 0.9]) p.push(piece(blob(0.022, 0.022, 0.012, Math.sin(a) * 0.2, 0.76, Math.cos(a) * 0.17, 5), GOLD, { grad: 0 }));
		claspedArms(p, '#ffffff', 1, { tablet: kit.tablet });
		headParts(p, { hair: kit.officialHat === 'jougwan' ? 'knot' : 'none' });
		hatParts(p, kit.officialHat);
	} else if (role === 'monk') {
		robe(p, kit, { border: false, kasaya: true, tint: 1 });
		claspedArms(p, '#ffffff', 1, { prayer: true, beads: true });
		headParts(p, { shaved: true });
	} else if (role === 'guard' || role === 'archer') {
		boots(p, kit.robe === 'round' ? '#3c3430' : '#4c443c');
		lamellar(p, kit);
		const s = -1;
		if (role === 'guard') {
			arms(p, '#ffffff', 1, { skip: s });
			spear(p, kit, s);
		} else {
			arms(p, '#ffffff', 1, { skip: 1 });
			bow(p, 1);
		}
		headParts(p, { hair: 'none' });
		helmParts(p, kit);
	} else {
		riderParts(p, kit);
	}
	return p;
}

/** A Goguryeo-style mounted rider (Muyongchong): short jacket, feather cap, a small sturdy horse. */
function riderParts(p: Parts, kit: Kit): void {
	const coat = { tint: 1, grad: 0.25 };
	p.push(piece(blob(0.3, 0.33, 0.78, 0, 1.12, 0, 12), '#ffffff', coat));
	const neck = limb(0.15, [0, 1.25, 0.55], [0, 1.66, 0.92], 8, 0.11);
	p.push(piece(neck, '#ffffff', { ...coat, part: PART.head, pivot: [0, 1.3, 0.6] }));
	const head = blob(0.1, 0.12, 0.27, 0, 0, 0, 10);
	head.rotateX(0.75);
	head.translate(0, 1.6, 1.08);
	p.push(piece(head, '#ffffff', { ...coat, part: PART.head, pivot: [0, 1.3, 0.6] }));
	const mane = blob(0.04, 0.1, 0.3, 0, 0, 0, 6);
	mane.rotateX(-0.78);
	mane.translate(0, 1.66, 0.74);
	p.push(piece(mane, '#1f1915', { part: PART.head, pivot: [0, 1.3, 0.6], grad: 0 }));
	for (const s of [1, -1]) p.push(piece(blob(0.025, 0.05, 0.02, s * 0.05, 1.8, 0.92, 5), '#1f1915', { part: PART.head, pivot: [0, 1.3, 0.6], grad: 0 }));
	p.push(piece(limb(0.055, [0, 1.25, -0.74], [0, 0.65, -0.92], 6, 0.035), '#1f1915', { grad: 0 }));
	const legsAt: [number, number, number][] = [
		[0.15, 0.5, 1],
		[-0.15, 0.5, 2],
		[0.15, -0.5, 2],
		[-0.15, -0.5, 1]
	];
	for (const [x, z, part] of legsAt) {
		const L = { part, pivot: [x, 0.98, z] as V3 };
		p.push(piece(limb(0.075, [x, 0.98, z], [x, 0.14, z + 0.03], 8, 0.05), '#ffffff', { ...L, ...coat }));
		p.push(piece(blob(0.06, 0.05, 0.07, x, 0.05, z + 0.04, 6), '#1f1915', { ...L, grad: 0 }));
	}
	p.push(piece(blob(0.26, 0.08, 0.3, 0, 1.43, 0.02, 10), '#7a2a22', { grad: 0.15 }));
	p.push(piece(blob(0.31, 0.03, 0.42, 0, 1.38, 0.0, 10), kit.accent, { grad: 0.1 }));
	const lift = 1.42 - 0.62;
	const torso = lathe([[0.2, 0.0], [0.205, 0.05], [0.19, 0.28], [0.2, 0.44], [0.15, 0.53], [0.07, 0.58], [0, 0.59]], 12);
	torso.scale(1, 1, 0.8);
	torso.translate(0, 0.62 + lift, 0);
	p.push(piece(torso, zone((_x, y) => y < 0.66 + lift, kit.border, '#efe9db'), { grad: 0.18 }));
	for (const s of [1, -1]) {
		p.push(piece(limb(0.085, [s * 0.12, 1.45, 0.05], [s * 0.31, 1.22, 0.28], 8, 0.07), '#efe9db', {}));
		p.push(piece(limb(0.065, [s * 0.32, 1.2, 0.28], [s * 0.3, 0.92, 0.18], 8, 0.06), SHOE, {}));
		p.push(piece(limb(0.065, [s * 0.215, SH + lift - 0.02, 0], [s * 0.14, 1.55, 0.36], 8, 0.07), '#efe9db', {}));
		p.push(piece(blob(0.058, 0.062, 0.058, s * 0.12, 1.53, 0.42, 8), SKIN, { grad: 0.1 }));
	}
	const up: Parts = [];
	headParts(up, { hair: 'knot' });
	hatParts(up, 'jougwan');
	for (const g of up) {
		g.translate(0, lift - 0.02, 0);
		const rig = g.getAttribute('aRig');
		for (let i = 0; i < rig.count; i++) rig.setXYZW(i, PART.head, 0, NECK[1] + lift, 0);
		p.push(g);
	}
}

/**
 * One merged figure. `still` bakes `cloth` into the tinted regions and freezes the joints, for
 * crews merged into a hull.
 */
export function figureGeometry(role: Role, dress: Dress, o: { variant?: number; still?: boolean; cloth?: string } = {}): THREE.BufferGeometry {
	const g = merge(figureParts(role, dress, o.variant ?? 0));
	if (o.still) {
		const c = col(o.cloth ?? KITS[dress].common[0]);
		const color = g.getAttribute('color');
		const tint = g.getAttribute('aTint');
		const rig = g.getAttribute('aRig');
		for (let i = 0; i < color.count; i++) {
			const t = tint.getX(i);
			if (t > 0) color.setXYZ(i, color.getX(i) * (1 - t + t * c.r), color.getY(i) * (1 - t + t * c.g), color.getZ(i) * (1 - t + t * c.b));
			tint.setX(i, 0);
			rig.setX(i, PART.body);
		}
	}
	return g;
}

/** The kingdom cloth colour (banners and sails). */
export function accentOf(dress: Dress): string {
	return KITS[dress].accent;
}

/* ------------------------------------------------------------------ paths */

export type Course = { cum: number[]; pts: P2[] };

export function course(pts: P2[]): Course {
	const cum = [0];
	for (let i = 1; i < pts.length; i++) {
		cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
	}
	return { cum, pts };
}

/** Point and heading `u` (0..1, wrapping) of the way along a course. */
export function along(c: Course, u: number): { x: number; z: number; yaw: number } {
	const L = c.cum[c.cum.length - 1] || 1;
	const d = (((u % 1) + 1) % 1) * L;
	let i = 1;
	while (i < c.cum.length - 1 && c.cum[i] < d) i++;
	const a = c.pts[i - 1];
	const b = c.pts[i] ?? a;
	const span = c.cum[i] - c.cum[i - 1] || 1;
	const t = (d - c.cum[i - 1]) / span;
	return {
		x: a[0] + (b[0] - a[0]) * t,
		z: a[1] + (b[1] - a[1]) * t,
		yaw: Math.atan2(b[0] - a[0], b[1] - a[1])
	};
}

/* ------------------------------------------------------------------ the collector */

type Slot = { key: string; role: Role; dress: Dress; v: number; m: THREE.Matrix4; folk: [number, number, number, number]; cloth: THREE.Color; x: number; z: number };

type Walker = {
	slot: Slot;
	c: Course;
	len: number;
	d: number;
	speed: number;
	lane: number;
	closed: boolean;
	dir: 1 | -1;
	y: (x: number, z: number) => number;
	scale: number;
	from?: P2;
	delay: number;
	mesh?: THREE.InstancedMesh;
	index: number;
};

/** Geometry and owned materials are freed with the site (`disposeTree`). */
export type FolkBuild = {
	group: THREE.Group;
	/** `show` 0..1 pops the crowd in; `cam` (if known) culls clusters out of sight range. */
	tick(t: number, dt: number, show: number, cam: THREE.Vector3 | null): void;
};

/** Metres beyond which a cluster of figures is not drawn (a figure is under a pixel). */
const FAR = 520;
const FAR_SHADOW = 260;

const tmpQ = new THREE.Quaternion();
const tmpP = new THREE.Vector3();
const tmpS = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

/**
 * Collects a site's people while it is built (like Forest and Town), then makes one instanced
 * mesh per figure type. Standing figures are placed once and idle in the shader; walkers are
 * moved along their paths each frame and stride in the shader.
 */
export class Folk {
	private slots: Slot[] = [];
	private walkers: Walker[] = [];
	private rand: () => number;

	constructor(
		readonly dress: Dress,
		readonly height: (x: number, z: number) => number,
		seed = 1
	) {
		this.rand = rng(seed * 7 + 3);
	}

	get count(): number {
		return this.slots.length;
	}

	private slot(who: Who, x: number, y: number, z: number, yaw: number, o: { scale?: number; gait?: number; cadence?: number; delay?: number; cloth?: string } = {}): Slot {
		const role = typeof who === 'string' ? who : who.role;
		const dress = (typeof who === 'string' ? undefined : who.dress) ?? this.dress;
		const kit = KITS[dress];
		const r = this.rand;
		const v = Math.floor(r() * variants(role, kit));
		const s = (o.scale ?? 1) * (role === 'woman' || role === 'lady' ? 0.95 : 1) * (0.95 + r() * 0.1);
		const m = new THREE.Matrix4().compose(tmpP.set(x, y, z), tmpQ.setFromAxisAngle(UP, yaw), tmpS.set(s, s, s));
		let cloth: string;
		if (o.cloth) cloth = o.cloth;
		else if (role === 'official' || role === 'lady') cloth = kit.ranks[Math.min(kit.ranks.length - 1, Math.floor(r() * r() * kit.ranks.length * 1.4))];
		else if (role === 'guard' || role === 'archer') cloth = kit.accent;
		else if (role === 'monk') cloth = MONK[Math.floor(r() * MONK.length)];
		else if (role === 'rider') cloth = COATS[Math.floor(r() * COATS.length)];
		else cloth = kit.common[Math.floor(r() * kit.common.length)];
		const slot: Slot = {
			key: `${role}:${dress}:${v}`,
			role,
			dress,
			v,
			m,
			folk: [r() * Math.PI * 2, o.gait ?? 0, o.cadence ?? 0, o.delay ?? r()],
			cloth: new THREE.Color(cloth),
			x,
			z
		};
		this.slots.push(slot);
		return slot;
	}

	/** One figure idling at a spot; `y` overrides the ground (a wall walk, a terrace, a deck). */
	stand(who: Who, x: number, z: number, yaw: number, o: { y?: number; scale?: number; cloth?: string } = {}): void {
		this.slot(who, x, o.y ?? this.height(x, z), z, yaw, o);
	}

	/** `n` figures evenly in a line from a to b, all facing `yaw` (officials at audience, a gate guard). */
	row(who: Who, a: P2, b: P2, n: number, yaw: number, o: { y?: number; cloth?: string } = {}): void {
		for (let i = 0; i < n; i++) {
			const t = n === 1 ? 0.5 : i / (n - 1);
			const x = a[0] + (b[0] - a[0]) * t;
			const z = a[1] + (b[1] - a[1]) * t;
			this.stand(who, x, z, yaw + (this.rand() - 0.5) * 0.1, o);
		}
	}

	/** A loose knot of `n` idling figures within `r` of (x, z), turned toward `face` (or each other). */
	knot(whos: Who[], x: number, z: number, r: number, n: number, o: { y?: number; face?: P2 } = {}): void {
		for (let i = 0; i < n; i++) {
			const a = this.rand() * Math.PI * 2;
			const d = Math.sqrt(this.rand()) * r;
			const px = x + Math.cos(a) * d;
			const pz = z + Math.sin(a) * d;
			const f = o.face ?? [x, z];
			const yaw = Math.atan2(f[0] - px, f[1] - pz) + (this.rand() - 0.5) * 0.8;
			this.stand(whos[i % whos.length], px, pz, yaw, { y: o.y });
		}
	}

	/**
	 * Guards on a wall walk every `every` metres, facing out over the parapet. `top` is the walk's
	 * height above the ground at the wall line (the wall height less the parapet).
	 */
	wall(path: P2[], top: number, every: number, o: { closed?: boolean; outward?: 1 | -1; skip?: (x: number, z: number) => boolean; t?: number; who?: Who[] } = {}): void {
		const inset = (o.t ?? 5) / 2 - 1.1;
		const whos = o.who ?? ['guard', 'guard', 'archer'];
		wallStations(path, every, { h: top, closed: o.closed, outward: o.outward, skip: o.skip }).forEach((s, i) => {
			const x = s.x + s.nx * inset;
			const z = s.z + s.nz * inset;
			this.stand(whos[i % whos.length], x, z, Math.atan2(s.nx, s.nz) + (this.rand() - 0.5) * 0.5, { y: this.height(s.x, s.z) + top });
		});
	}

	/**
	 * An audience in a court whose hall stands at (x, z) facing `rot` (0 = south): officials in two
	 * lines facing each other down the axis from `near` to `far` metres in front of the hall, a
	 * guard at each line's foot. The way a drama blocks a throne court.
	 */
	audience(x: number, z: number, rot: number, o: { y?: number; gap?: number; near?: number; far?: number; n?: number; who?: Who } = {}): void {
		const gap = o.gap ?? 9;
		const near = o.near ?? 10;
		const far = o.far ?? 40;
		const n = o.n ?? 6;
		const fx = Math.sin(rot);
		const fz = Math.cos(rot);
		const pt = (side: number, d: number): P2 => [x + fx * d + fz * side * gap, z + fz * d - fx * side * gap];
		for (const side of [1, -1]) {
			this.row(o.who ?? 'official', pt(side, near), pt(side, far), n, rot + (side * Math.PI) / 2 + Math.PI, { y: o.y });
			const [gx, gz] = pt(side * 1.3, far + 5);
			this.stand('guard', gx, gz, rot + Math.PI, { y: o.y });
		}
	}

	/** Two guards flanking a gate at (x, z) that faces out along `rot`. */
	gate(x: number, z: number, rot: number, o: { half?: number; out?: number; who?: Who; y?: number } = {}): void {
		const half = o.half ?? 4;
		const out = o.out ?? 3;
		const fx = Math.sin(rot);
		const fz = Math.cos(rot);
		for (const side of [1, -1]) {
			const gx = x + fx * out + fz * side * half;
			const gz = z + fz * out - fx * side * half;
			this.stand(o.who ?? 'guard', gx, gz, rot, { y: o.y });
		}
	}

	/** Monks walking the circuit round a pagoda (or a hall) at (x, z), `r` metres out, plus a few at prayer. */
	circuit(x: number, z: number, r: number, n: number, o: { y?: number; still?: number } = {}): void {
		const loop: P2[] = [];
		for (let i = 0; i <= 16; i++) {
			const a = (i / 16) * Math.PI * 2;
			loop.push([x + Math.cos(a) * r, z + Math.sin(a) * r]);
		}
		loop[16] = loop[0];
		const y = o.y;
		this.walk(['monk'], loop, n, { lane: 0.6, closed: true, speed: 0.45, y: y == null ? undefined : () => y });
		const still = o.still ?? 2;
		for (let i = 0; i < still; i++) this.stand('monk', x + (i - (still - 1) / 2) * 1.6, z + r + 4, Math.PI, { y });
	}

	/**
	 * `n` walkers along a path: round and round a closed loop, or back and forth on an open one.
	 * `lane` spreads them across the road; `from` makes them run out of a door as the crowd appears.
	 */
	walk(whos: Who[], path: P2[], n: number, o: { lane?: number; closed?: boolean; y?: (x: number, z: number) => number; speed?: number; from?: P2 } = {}): void {
		if (path.length < 2 || n <= 0) return;
		const c = course(path);
		const len = c.cum[c.cum.length - 1] || 1;
		const closed = o.closed ?? Math.hypot(path[0][0] - path[path.length - 1][0], path[0][1] - path[path.length - 1][1]) < 1;
		const y = o.y ?? this.height;
		for (let i = 0; i < n; i++) {
			const who = whos[i % whos.length];
			const rider = (typeof who === 'string' ? who : who.role) === 'rider';
			const speed = (o.speed ?? (rider ? 1.5 : 0.75)) * (0.8 + this.rand() * 0.4);
			const cadence = (Math.PI * 2 * speed) / (rider ? 1.9 : 1.25);
			const p = along(c, this.rand());
			const delay = o.from ? -1 : this.rand();
			const slot = this.slot(who, p.x, y(p.x, p.z), p.z, p.yaw, { gait: 1, cadence, delay });
			const s = new THREE.Vector3();
			slot.m.decompose(tmpP, tmpQ, s);
			this.walkers.push({
				slot,
				c,
				len,
				d: this.rand() * len,
				speed,
				lane: (this.rand() - 0.5) * 2 * (o.lane ?? 1.5),
				closed,
				dir: this.rand() > 0.5 ? 1 : -1,
				y,
				scale: s.x,
				from: o.from,
				delay: this.rand(),
				index: 0
			});
		}
	}

	build(u: RigUniforms): FolkBuild {
		const group = new THREE.Group();
		group.name = 'folk';
		const byKey = new Map<string, Slot[]>();
		for (const s of this.slots) {
			const list = byKey.get(s.key);
			if (list) list.push(s);
			else byKey.set(s.key, [s]);
		}
		const mat = rigMaterial(u, 'folk', { figure: true });
		const shadowMat = contactMaterial(u, 0.42, true);
		const disc = contactDisc(0.34, 0.3);
		const riderDisc = contactDisc(0.45, 1.0);
		const meshes: { mesh: THREE.InstancedMesh; shadow: THREE.InstancedMesh; center: THREE.Vector3; radius: number }[] = [];
		const where = new Map<Slot, { mesh: THREE.InstancedMesh; index: number }>();
		for (const [key, list] of byKey) {
			const first = list[0];
			const geo = figureGeometry(first.role, first.dress, { variant: first.v });
			const n = list.length;
			const folk = new Float32Array(n * 4);
			const cloth = new Float32Array(n * 3);
			const mesh = new THREE.InstancedMesh(geo, mat, n);
			mesh.name = `folk-${key}`;
			list.forEach((s, i) => {
				mesh.setMatrixAt(i, s.m);
				folk.set(s.folk, i * 4);
				cloth[i * 3] = s.cloth.r;
				cloth[i * 3 + 1] = s.cloth.g;
				cloth[i * 3 + 2] = s.cloth.b;
				where.set(s, { mesh, index: i });
			});
			const aFolk = new THREE.InstancedBufferAttribute(folk, 4);
			geo.setAttribute('aFolk', aFolk);
			geo.setAttribute('aCloth', new THREE.InstancedBufferAttribute(cloth, 3));
			mesh.receiveShadow = true;
			mesh.castShadow = false;
			const sGeo = (first.role === 'rider' ? riderDisc : disc).clone();
			sGeo.setAttribute('aFolk', aFolk);
			const shadow = new THREE.InstancedMesh(sGeo, shadowMat, n);
			shadow.instanceMatrix = mesh.instanceMatrix;
			shadow.renderOrder = -1;
			// one bounding sphere for the cluster, covering every walker's path
			const box = new THREE.Box3();
			for (const s of list) box.expandByPoint(tmpP.set(s.x, s.m.elements[13], s.z));
			for (const w of this.walkers) if (list.includes(w.slot)) for (const [x, z] of w.c.pts) box.expandByPoint(tmpP.set(x, w.y(x, z), z));
			const sphere = box.getBoundingSphere(new THREE.Sphere());
			sphere.radius += 4;
			mesh.boundingSphere = sphere;
			shadow.boundingSphere = sphere.clone();
			group.add(mesh, shadow);
			meshes.push({ mesh, shadow, center: sphere.center, radius: sphere.radius });
		}
		for (const w of this.walkers) {
			const at = where.get(w.slot);
			if (at) {
				w.mesh = at.mesh;
				w.index = at.index;
			}
		}
		disc.dispose();
		riderDisc.dispose();

		const walkers = this.walkers;
		const m = new THREE.Matrix4();
		const ease = (k: number) => k * k * (3 - 2 * k);

		function stride(dt: number, show: number) {
			const dirty = new Set<THREE.InstancedMesh>();
			for (const w of walkers) {
				if (!w.mesh || !w.mesh.visible) continue;
				w.d += w.speed * dt * w.dir;
				if (w.closed) w.d = ((w.d % w.len) + w.len) % w.len;
				else if (w.d > w.len) {
					w.d = w.len - (w.d - w.len);
					w.dir = -1;
				} else if (w.d < 0) {
					w.d = -w.d;
					w.dir = 1;
				}
				const p = along(w.c, w.d / w.len);
				let x = p.x + Math.cos(p.yaw) * w.lane;
				let z = p.z - Math.sin(p.yaw) * w.lane;
				let yaw = p.yaw + (w.dir < 0 ? Math.PI : 0);
				let s = w.scale;
				if (w.from) {
					const k = Math.min(1, Math.max(0, show * 1.6 - w.delay * 0.6));
					if (k <= 0) s = 0.0001;
					else if (k < 1) {
						const e = ease(k);
						yaw = Math.atan2(x - w.from[0], z - w.from[1]);
						x = w.from[0] + (x - w.from[0]) * e;
						z = w.from[1] + (z - w.from[1]) * e;
						s *= Math.min(1, k * 6);
					}
				}
				m.compose(tmpP.set(x, w.y(x, z), z), tmpQ.setFromAxisAngle(UP, yaw), tmpS.set(s, s, s));
				w.mesh.setMatrixAt(w.index, m);
				dirty.add(w.mesh);
			}
			for (const mesh of dirty) mesh.instanceMatrix.needsUpdate = true;
		}

		return {
			group,
			tick(_t, dt, show, cam) {
				if (cam) {
					for (const c of meshes) {
						const d = cam.distanceTo(c.center) - c.radius;
						c.mesh.visible = d < FAR;
						c.shadow.visible = d < FAR_SHADOW;
					}
				}
				stride(dt, show);
			}
		};
	}
}
