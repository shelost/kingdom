/**
 * The known world as Samhan saw it, in the sheet's own units. Inside the sheet's
 * home the projection is the sheet's fit (`project`), so the relief, the outer land
 * and the world layer all line up; farther out it is an even lon/lat grid.
 *
 * Nine civilizations, not dynasties. Near Lands (옆나라) are Samhan, Wa, Hwa and
 * the Northern Nomads. Far Lands (먼나라) are Tibet, India, Persia/Daesik, Rome
 * and the Southern Seas. 이승 and 저승 are the living world and the underworld,
 * not that political split. Goguryeo, Baekje, Silla and Gaya are parts of Samhan.
 * Turks, Khitan and Jurchen are peoples of the Northern Nomads. India's accurate
 * heartland is modern India + Pakistan + Bangladesh. Each civilization has a
 * definite heartland and a softer reach; the reach grows fuzzier farther from Samhan.
 *
 * The map is two semi-attached discs: 이승 and 저승 overlap in a green lens, and
 * that lens is the Western Flower Fields. Washes are static envelopes (the year
 * does not move a civilization's edge). The gold line round Samhan is painted
 * from one fixed year so the slider does not walk it. Pure maths and tables,
 * no DOM: scripts/build-cosmos-layer.mjs imports it.
 */
import { project } from './borders.ts';

type Pt = [number, number];
type LonLat = [number, number];

/**
 * Near Korea the projection is the sheet's own quadratic fit (`project`), so the
 * relief, the borders and the gold line agree. Far from it that quadratic bends
 * (Europe tilts north, the Arctic tears), so it blends into the fit's linearisation
 * at Korea: an even lon/lat grid, the same scale and orientation as the sheet.
 * Rome, Persia and India then keep their true size relative to home.
 */
const HOME_LL: LonLat = [127, 38];
/** Degrees from Korea where the blend starts and ends. */
const BLEND = [12, 30] as const;
const D = 0.01;
const [J0x, J0y] = project(HOME_LL[0], HOME_LL[1]);
const JAC = (() => {
	const [ex, ey] = project(HOME_LL[0] + D, HOME_LL[1]);
	const [wx, wy] = project(HOME_LL[0] - D, HOME_LL[1]);
	const [nx, ny] = project(HOME_LL[0], HOME_LL[1] + D);
	const [sx, sy] = project(HOME_LL[0], HOME_LL[1] - D);
	return { xu: (ex - wx) / (2 * D), yu: (ey - wy) / (2 * D), xv: (nx - sx) / (2 * D), yv: (ny - sy) / (2 * D) };
})();

/** Bump with any change to the projection: paint caches and the bake key on it. */
export const PROJECTION_VER = 'grid-1';

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/** Real (or virtual) lon/lat → sheet units. */
export function cosmosProject(lon: number, lat: number): Pt {
	const u = lon - HOME_LL[0];
	const v = lat - HOME_LL[1];
	const gx = J0x + JAC.xu * u + JAC.xv * v;
	const gy = J0y + JAC.yu * u + JAC.yv * v;
	const w = 1 - smooth((Math.hypot(u, v) - BLEND[0]) / (BLEND[1] - BLEND[0]));
	if (w <= 0) return [gx, gy];
	const [px, py] = project(lon, lat);
	return [px * w + gx * (1 - w), py * w + gy * (1 - w)];
}

/* —————————————— the two worlds —————————————— */

/** Sheet-space disc. `x` east, `y` south, same units as `cosmosProject`. */
export type Disc = { x: number; y: number; r: number };

/** Axis-aligned sheet box (paint frame, camera frame). */
export type SheetBox = { x: number; y: number; w: number; h: number };

/**
 * 이승: Iberia to Japan on the even grid. The west rim stops about one Atlantic past
 * Iberia, so the mythic western land and the three rivers fit before the lens.
 * North is endless snow, south is open sea; Australia is cut.
 */
export const LIVING_DISC: Disc = { x: -2733, y: 700, r: 4234 };

/**
 * 저승, overlapping 이승 by a narrow lens (about 1000 units): the Western Heavens.
 */
export const DEAD_DISC: Disc = { x: -9767, y: 700, r: 3800 };

/**
 * One circle split on that lens. West of the seam is 저승, east is 이승.
 */
export const HALF_DISC: Disc = { x: -6450, y: 700, r: 7400 };

export type CosmosLayout = 'circles' | 'halves';

export const COSMOS_LAYOUTS: { id: CosmosLayout; en: string; ko: string }[] = [
	{ id: 'circles', en: 'Two circles', ko: '두 원' },
	{ id: 'halves', en: 'Halves', ko: '반원' }
];

export type MythSpot = 'road' | 'pavilion' | 'heavens' | 'flowers' | 'court' | 'springs' | 'living' | 'dead' | 'samdo' | 'hells' | 'baek' | 'hwang' | 'jeok';

/** The Western Flower Fields: a meadow inside the Western Heavens lens, north of its middle. */
export function meadow(): { x: number; y: number; rx: number; ry: number } {
	const [x, y] = lensPoint();
	const { north, south } = lensTips();
	const half = (south[1] - north[1]) / 2;
	return { x, y: y - half * 0.22, rx: 300, ry: half * 0.3 };
}

/**
 * Centre of the lens where the two discs overlap (the radical axis on the line
 * of centres). The Western Flower Fields sit here.
 */
export function lensPoint(a: Disc = LIVING_DISC, b: Disc = DEAD_DISC): [number, number] {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	const dist = Math.hypot(dx, dy) || 1;
	const along = (dist * dist + b.r * b.r - a.r * a.r) / (2 * dist);
	return [b.x + (dx / dist) * along, b.y + (dy / dist) * along];
}

/**
 * The two tips of the flower-field lens, where the discs cross.
 * North is the smaller sheet y.
 */
export function lensTips(a: Disc = LIVING_DISC, b: Disc = DEAD_DISC): { north: [number, number]; south: [number, number] } {
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	const dist = Math.hypot(dx, dy) || 1;
	const ux = dx / dist;
	const uy = dy / dist;
	const along = (dist * dist + a.r * a.r - b.r * b.r) / (2 * dist);
	const h = Math.sqrt(Math.max(0, a.r * a.r - along * along));
	const mx = a.x + ux * along;
	const my = a.y + uy * along;
	const px = -uy;
	const py = ux;
	const north: [number, number] = [mx + px * h, my + py * h];
	const south: [number, number] = [mx - px * h, my - py * h];
	return north[1] <= south[1] ? { north, south } : { north: south, south: north };
}

/** One river bowed around the flower-field lens. Angles are canvas angles (y south). */
export type FieldRiver = {
	id: 'baek' | 'hwang' | 'jeok' | 'samdo';
	disc: Disc;
	r: number;
	a0: number;
	a1: number;
	ccw: boolean;
	/** Where the name stands, clear of the stroke. */
	at: [number, number];
};

const wrap = (a: number) => {
	const t = a % (Math.PI * 2);
	return t < 0 ? t + Math.PI * 2 : t;
};

/**
 * The short bow of `disc` between the lens tips, on `side` of the chord,
 * widened a little so the stroke wraps the tips of the fields.
 */
function fieldBow(disc: Disc, side: 'east' | 'west', widen: number): { a0: number; a1: number; ccw: boolean } {
	const { north, south } = lensTips();
	const aN = Math.atan2(north[1] - disc.y, north[0] - disc.x);
	const aS = Math.atan2(south[1] - disc.y, south[0] - disc.x);
	const sweeps = [
		{ ccw: false, sweep: wrap(aS - aN) },
		{ ccw: true, sweep: wrap(aN - aS) }
	];
	let pick = sweeps[0];
	let best = -Infinity;
	for (const s of sweeps) {
		const mid = s.ccw ? aN - s.sweep / 2 : aN + s.sweep / 2;
		const score = (side === 'east' ? 1 : -1) * Math.cos(mid);
		if (score > best) {
			best = score;
			pick = s;
		}
	}
	const dir = pick.ccw ? -1 : 1;
	return { a0: aN - dir * widen, a1: aN + dir * (pick.sweep + widen), ccw: pick.ccw };
}

/** Point on a bow, `t` from the north tip toward the south tip. */
function bowAt(disc: Disc, r: number, bow: { a0: number; a1: number; ccw: boolean }, t: number): [number, number] {
	const dir = bow.ccw ? -1 : 1;
	const span = dir * (bow.a1 - bow.a0);
	const a = bow.a0 + dir * span * t;
	return [disc.x + Math.cos(a) * r, disc.y + Math.sin(a) * r];
}

/**
 * Rivers around the Western Flower Fields.
 * From 이승, three waters approach the eastern lip of the lens, outermost first:
 * White, then Yellow, then Red against the fields. 황강 is that yellow water.
 * 황천, the Yellow Springs, stays a place deep in 저승 and is not this river.
 * From 저승, one Samdo bows along the western lip.
 */
export function fieldRivers(): FieldRiver[] {
	const east = fieldBow(DEAD_DISC, 'east', 0.22);
	const west = fieldBow(LIVING_DISC, 'west', 0.22);
	/** Spread north→south so White / Yellow / Red never sit on top of each other. */
	const living: { id: FieldRiver['id']; out: number; t: number; push: number }[] = [
		{ id: 'baek', out: 470, t: 0.22, push: 150 },
		{ id: 'hwang', out: 310, t: 0.5, push: 150 },
		{ id: 'jeok', out: 150, t: 0.78, push: 150 }
	];
	const rows: FieldRiver[] = living.map((row) => {
		const r = DEAD_DISC.r + row.out;
		const [x, y] = bowAt(DEAD_DISC, r, east, row.t);
		return { id: row.id, disc: DEAD_DISC, r, ...east, at: [x + row.push, y] };
	});
	const sr = LIVING_DISC.r + 220;
	const [sx, sy] = bowAt(LIVING_DISC, sr, west, 0.5);
	rows.push({ id: 'samdo', disc: LIVING_DISC, r: sr, ...west, at: [sx - 220, sy] });
	return rows;
}

/** Where the cosmic names stand, in sheet units. The map only draws `circles`. */
export function layoutSpots(layout: CosmosLayout): Record<MythSpot, [number, number]> {
	const flower = lensPoint();
	const dead = DEAD_DISC;
	const river = Object.fromEntries(fieldRivers().map((r) => [r.id, r.at])) as Record<FieldRiver['id'], [number, number]>;
	const shared = {
		/** The lens's name near its north tip; the meadow's name on the meadow. */
		heavens: [flower[0], lensTips().north[1] + 520] as [number, number],
		flowers: [meadow().x, meadow().y] as [number, number],
		samdo: river.samdo,
		baek: river.baek,
		hwang: river.hwang,
		jeok: river.jeok,
		pavilion: [flower[0], flower[1] + 640] as [number, number],
		court: [dead.x + 180, dead.y] as [number, number]
	};
	if (layout === 'halves') {
		return {
			...shared,
			living: [300, -1700],
			dead: [dead.x - 700, dead.y + 800],
			hells: [dead.x - 40, dead.y + 80],
			road: [flower[0] - 980, flower[1]],
			springs: [dead.x - 1100, dead.y + 260]
		};
	}
	/** Flowers in the overlap; Samdo stands on the dead lip, the three waters on the living lip. */
	return {
		...shared,
		/** Each world's name stands well above its own circle, clear of the rim. */
		living: [LIVING_DISC.x + 420, LIVING_DISC.y - LIVING_DISC.r - 160],
		dead: [dead.x - 420, dead.y - dead.r - 160],
		hells: [dead.x - 40, dead.y + 80],
		road: [river.samdo[0] - 280, river.samdo[1]],
		springs: [dead.x, dead.y + dead.r * 0.6]
	};
}

/** Tight box around the discs (padded). Two circles is wide; halves is square. */
export function discsBox(discs: Disc[], pad = 1.06): SheetBox {
	let x0 = Infinity;
	let y0 = Infinity;
	let x1 = -Infinity;
	let y1 = -Infinity;
	for (const d of discs) {
		x0 = Math.min(x0, d.x - d.r);
		y0 = Math.min(y0, d.y - d.r);
		x1 = Math.max(x1, d.x + d.r);
		y1 = Math.max(y1, d.y + d.r);
	}
	const cx = (x0 + x1) / 2;
	const cy = (y0 + y1) / 2;
	const w = (x1 - x0) * pad;
	const h = (y1 - y0) * pad;
	return { x: cx - w / 2, y: cy - h / 2, w, h };
}

/** The active silhouette: one disc (halves), or the two breasts (circles). */
export const viewDiscs = (layout: CosmosLayout): Disc[] => (layout === 'halves' ? [HALF_DISC] : [LIVING_DISC, DEAD_DISC]);

/** @deprecated Prefer `viewDiscs`; kept for call sites that want a single framing disc. */
export const viewDisc = (layout: CosmosLayout): Disc =>
	layout === 'halves' ? HALF_DISC : { x: (LIVING_DISC.x + DEAD_DISC.x) / 2, y: (LIVING_DISC.y + DEAD_DISC.y) / 2, r: (LIVING_DISC.r + DEAD_DISC.r) * 0.92 };

/** Heaven hangs over the mountain at the head of the peninsula. */
export const SKY_AT: LonLat = [128.08, 42.0];

/** Off-sheet stage sites, at their real coordinates. */
export const ABROAD_AT: Record<string, LonLat> = {
	changan: [108.94, 34.27],
	asuka: [135.82, 34.47]
};

/* —————————————— regions —————————————— */

export type CosmosRegion = 'samhan' | 'hwa' | 'wa' | 'nomads' | 'tibet' | 'india' | 'persia' | 'rome' | 'sea' | 'other';

/** Wash colours. China and Japan match the sheet's own frontier colours. */
export const REGION_COLOR: Record<CosmosRegion, string> = {
	samhan: '#e2b657',
	hwa: '#b45309',
	wa: '#ec4899',
	nomads: '#5e5240',
	tibet: '#8a4a5c',
	india: '#c9a227',
	persia: '#2f8f83',
	rome: '#7b4fa0',
	sea: '#3f7f9e',
	other: '#6f6354'
};

/**
 * Civilizations Samhan knew by one name whatever dynasty ruled them: one wash,
 * no inner borders. Nomads, Tibet, India, Persia/Daesik and Rome are each one.
 */
export const ONE_NAME: ReadonlySet<CosmosRegion> = new Set(['nomads', 'tibet', 'india', 'persia', 'rome']);

/** The baked world file still says `steppe` for the nomad band. */
export const regionOf = (r: string): CosmosRegion => (r === 'steppe' ? 'nomads' : (r as CosmosRegion));

export type CosmosLabel = {
	id: string;
	/** The region the label names (its colour; with `dynasty`, its largest standing polity's name). */
	region?: CosmosRegion;
	han: string;
	en: string;
	ko: string;
	/** Stable civilization id for the wiki. Defaults to `id` when the label does not switch with the year. */
	nation?: string;
	/** A second name, under the first. Korean reading, then hanja, then the English. */
	epithet?: { han?: string; ko?: string; en: string };
	/** A people of a civilization, drawn as a line under that civilization, never as its own nation. */
	people?: boolean;
	/** The Samhan label: the one civilization the three kingdoms belong to. */
	home?: boolean;
	/** Placed by `layoutSpots` rather than by longitude. */
	spot?: MythSpot;
	/** Where the label stands; a tagged label stands on its polity instead. */
	at?: LonLat;
	/** Seas read as water, not as a country. */
	sea?: boolean;
	/** Show the standing dynasty under the name (the courts change dynasties; Persia, India and Rome do not). */
	dynasty?: boolean;
	/** Stand on each standing polity the data tags with this, named by it. */
	tag?: string;
	/** Within reach of this label, ride on it as a line instead of standing apart. */
	host?: string;
	/** Years shown, both ends included. */
	years?: [number, number];
	/** A protectorate: the court's reach, not its land. */
	protectorate?: boolean;
	/** One of the two worlds (이승, 저승): the faintest, widest names on the map. */
	realm?: boolean;
	/** A people inside a civilization: drawn, smaller than the parent name. */
	sub?: boolean;
	/** The name in that civilization's own script. A quiet line under the Korean. */
	native?: string;
};

/**
 * The names on the wide map. An attested name added here (with `years` when it only
 * held for a while) appears; a `tag` label follows its polity through the data.
 */
export const COSMOS_LABELS: CosmosLabel[] = [
	{
		id: 'hwa',
		nation: 'hwa',
		region: 'hwa',
		han: '華',
		ko: '화',
		en: 'China',
		at: [108, 32.5]
	},
	/** 왜 — Wa. The civilization wash covers Hokkaido; the Yamato state does not yet. */
	{ id: 'japan-wa', nation: 'wa', region: 'wa', han: '倭', ko: '왜', en: 'Japan', at: [138.5, 36.5] },
	{
		id: 'northern-nomads',
		nation: 'northern-nomads',
		region: 'nomads',
		han: '',
		ko: '북적',
		en: 'Northern Nomads',
		native: '𐱅𐰇𐰼𐰚',
		at: [112, 47.2]
	},
	{ id: 'samhan', nation: 'samhan', region: 'samhan', han: '韓', ko: '한', en: 'Samhan', at: [127.4, 36.6], home: true },
	{ id: 'tubo', nation: 'tubo', region: 'tibet', han: '', ko: '토번', en: 'Tibet', native: 'བོད', tag: 'tibet' },
	{ id: 'anseo', region: 'hwa', han: '安西都護府', en: 'Anseo Protectorate', ko: '안서도호부', at: [83, 41.2], years: [640, 790], protectorate: true },
	{ id: 'anbuk', region: 'hwa', han: '安北都護府', en: 'Anbuk Protectorate', ko: '안북도호부', at: [103.5, 46.5], years: [647, 686], protectorate: true, host: 'northern-nomads' },
	{ id: 'seonu', region: 'hwa', han: '單于都護府', en: 'Seonu Protectorate', ko: '선우도호부', at: [111.5, 41.4], years: [663, 698], protectorate: true, host: 'northern-nomads' },
	{ id: 'andong', region: 'hwa', han: '安東都護府', en: 'Andong Protectorate', ko: '안동도호부', at: [122.6, 42.2], years: [668, 756], protectorate: true },
	{ id: 'annam', region: 'hwa', han: '安南都護府', en: 'Annam Protectorate', ko: '안남도호부', at: [105.8, 21.2], years: [679, 866], protectorate: true },
	{ id: 'cheonchuk', nation: 'cheonchuk', region: 'india', han: '', ko: '천축', en: 'India', native: 'भारतम्', at: [78, 22] },
	{ id: 'persia', nation: 'persia', region: 'persia', han: '', ko: '파사', en: 'Persia', native: 'پارس', at: [56, 30], years: [-3000, 650] },
	{
		id: 'daesik',
		nation: 'persia',
		region: 'persia',
		han: '',
		ko: '대식',
		en: 'Daesik',
		native: 'الخلافة',
		epithet: { ko: '칼리파', en: 'The Caliphate' },
		at: [52, 26],
		years: [651, 9000]
	},
	/** Stand over Anatolia / the Balkans so the name stays east of the flower lens. Greek only in EN. */
	{ id: 'bullim', nation: 'bullim', region: 'rome', han: '', ko: '불림', en: 'Ῥώμη', at: [28, 46] },
	{
		id: 'southern-seas',
		nation: 'southern-seas',
		region: 'sea',
		han: '',
		ko: '남양',
		en: 'Southern Seas',
		native: 'दक्षिणसागर',
		at: [112, 4]
	},
	{ id: 'yizhou', region: 'sea', han: '', ko: '이주', en: 'Yizhou', native: 'इयु', at: [121.1, 23.7], sub: true },
	{ id: 'funan', region: 'sea', han: '', ko: '부남', en: 'Funan', native: 'फुनान', at: [105.4, 11], sub: true },
	{ id: 'champa', region: 'sea', han: '', ko: '임읍', en: 'Champa', native: 'चम्पा', at: [108.8, 14.4], sub: true },
	{ id: 'chenla', region: 'sea', han: '', ko: '진랍', en: 'Chenla', native: 'ចេនឡា', at: [104.2, 13], sub: true },
	{ id: 'langkasuka', region: 'sea', han: '', ko: '낭아수', en: 'Langkasuka', native: 'लङ्कासुका', at: [101, 6.6], sub: true },
	{ id: 'barus', region: 'sea', han: '', ko: '바루스', en: 'Barus', native: 'बरुस', at: [98.4, 2.1], sub: true },
	{ id: 'malayu', region: 'sea', han: '', ko: '말라유', en: 'Malayu', native: 'ملايو', at: [103.2, -1.6], sub: true },
	{ id: 'srivijaya', region: 'sea', han: '', ko: '실리불서', en: 'Srivijaya', native: 'श्रीविजय', at: [104.8, -3.1], sub: true },
	{ id: 'suvarna', region: 'sea', han: '', ko: '금주', en: 'Sumatra', native: 'सुवर्णद्वीप', at: [101.2, -0.6], sub: true },
	{ id: 'shepo', region: 'sea', han: '', ko: '사바', en: 'Java', native: 'यवद्वीप', at: [110.6, -7.5], sub: true },
	{ id: 'iseung', nation: 'iseung', han: '', ko: '이승', en: 'Life Realm', spot: 'living', realm: true },
	{ id: 'jeoseung', nation: 'jeoseung', han: '', ko: '저승', en: 'Death Realm', spot: 'dead', realm: true }
];

/** Stations on the road west. Placed by `layoutSpots`. Hidden when those places are markers. */
export const MYTH_LABELS: CosmosLabel[] = [
	{ id: 'western-heavens', nation: 'western-heavens', han: '西天', ko: '서천', en: 'Western Heavens', spot: 'heavens', realm: true },
	{ id: 'flower-fields', nation: 'flower-fields', han: '西天花田', ko: '서천꽃밭', en: 'Western Flower Fields', spot: 'flowers' },
	/** The three waters of the living approach, outermost first. 황강 is not the Yellow Springs. */
	{ id: 'baek', nation: 'baek', han: '白川', ko: '백천', en: 'White River', spot: 'baek' },
	{ id: 'hwang-river', nation: 'hwang-river', han: '黃江', ko: '황강', en: 'Yellow River', spot: 'hwang' },
	{ id: 'jeok', nation: 'jeok', han: '赤川', ko: '적천', en: 'Red River', spot: 'jeok' },
	{ id: 'samdo', nation: 'samdo', han: '三途川', ko: '삼도천', en: 'Samdo River', spot: 'samdo' },
	{ id: 'yellow-springs', nation: 'yellow-springs', han: '黃泉', ko: '황천', en: 'The Yellow Springs', spot: 'springs' }
];

/** Persia before the conquest: the plateau and Mesopotamia. */
export const PERSIA_LANDS: LonLat[] = [
	[42, 37], [46, 39.5], [52, 38.5], [58, 36.5], [63, 32], [63, 26], [58, 25], [52, 26.5], [46, 30], [43, 33], [42, 35.5]
];

/** Daesik after 651: one caliphate, Arabia through Iran. Egypt and the Maghreb stay out. */
export const DAESIK_LANDS: LonLat[] = [
	[34, 36.5], [36, 31], [34.5, 26], [36, 16], [43, 12.8], [50, 14], [56, 22], [62, 26], [66, 32], [64, 38], [56, 40.5], [48, 41], [40, 39], [36, 37.5]
];

/* —————————————— civilization spheres —————————————— */

/**
 * A civilization's sphere. Its generous `core` seeds it; every known land pixel
 * then belongs to the nearest core within `reach` degrees, so neighbours share a
 * border and nothing is left between them. Only land is painted, except for a
 * seafaring sphere, whose core's water is its own too.
 */
export type CivSphere = {
	/** The label id this sphere belongs to. */
	id: string;
	region: CosmosRegion;
	core: LonLat[];
	/** Degrees past the core's own land the sphere may spread over land. */
	reach: number;
	/** Seafaring: the core's water belongs to the sphere. */
	sea?: boolean;
	/** Holds its land against neighbours but is not washed (the gold line is Samhan's edge). */
	quiet?: boolean;
};

/** Goguryeo's Liaodong and the Buyeo plain down to Tamla: no neighbour's wash crosses it. */
export const SAMHAN_CORE: LonLat[] = [
	[121.8, 40.6], [122.3, 41.8], [123.5, 43.2], [125.5, 44.3], [127.5, 44.5], [129.5, 44], [131, 43],
	[130.8, 42.4], [130, 40], [129.6, 37], [129.5, 35], [128, 34.2], [126, 33], [124.5, 34], [124.5, 37.5],
	[124, 39.4], [122.5, 39], [121, 38.8]
];

/**
 * Japan civilization: Kyushu, Shikoku, Honshu and Hokkaido. Hokkaido is inside the
 * civilizational wash; the Yamato / Wa *state* of this story's years still stops
 * short of it (Cliopatria borders), so the Emishi north is wash without a state line.
 */
const WA_CORE: LonLat[] = [
	[129.5, 31], [129.6, 33.6], [131, 34.6], [133, 35.7], [136, 36.3], [137, 37.6], [139.5, 38.6],
	[140, 40.5], [141.4, 41.5], [141.8, 43.2], [145.2, 44.2], [145.5, 45.5], [143.2, 45.6],
	[141.2, 45.4], [140.2, 44.2], [139.6, 42.8], [140.2, 41.4], [142.2, 39.5], [141, 37],
	[140.9, 35.5], [139.9, 34.8], [138.5, 34.5], [136.8, 33.4], [135, 33.4], [132.8, 32.6],
	[131.5, 31], [130.5, 30.8]
];

/** China proper from the Gansu corridor to the coast, and Annam down to the Ngang pass. */
const HWA_CORE: LonLat[] = [
	[93.5, 39.8], [97, 40.5], [100, 41.2], [104, 41.6], [108, 41.2], [111, 41.5], [114, 41.3], [117, 41],
	[119.5, 41.2], [121.3, 40.9], [121.3, 39.6], [122.8, 38.5], [123, 35], [122.5, 30.5], [121, 26.5],
	[118, 23.5], [114.5, 21.3], [111, 20], [110.5, 18], [108.5, 18], [106.5, 18.3], [105.5, 19.5],
	[104, 21.5], [103, 22.6], [101.5, 22.6], [100, 24.3], [99, 26.5], [100.5, 28.5], [102, 30.5],
	[102.5, 32.5], [101.5, 34.5], [99.5, 36.5], [97, 38.5]
];

/** The plateau, Kham and the Himalayan wall. */
const TIBET_CORE: LonLat[] = [
	[72.5, 36.5], [75.5, 37.2], [79, 36.2], [84, 36.3], [89, 36.6], [94, 36.8], [98, 37.5], [101, 36.3],
	[102, 33.8], [101.5, 31], [100, 28.3], [98.8, 26.5], [97.5, 27.5], [95.5, 28.2], [92, 27.3], [89, 27.3],
	[86, 27.6], [83, 28.6], [80.5, 29.8], [78.5, 31.3], [76.5, 33], [74, 34.8]
];

/**
 * Greater India heartland ≈ modern India + Pakistan + Bangladesh (and the near
 * Himalayan wall). Sri Lanka stays in the civilizational reach via `reach`.
 */
const INDIA_CORE: LonLat[] = [
	[61.2, 25.1], [62.5, 28.2], [66.5, 30.2], [69.5, 31.5], [71.2, 33.8], [73.2, 36.2], [74.8, 37],
	[77.5, 35.5], [79.2, 32.8], [81, 30.5], [83.5, 29.2], [86.5, 28.2], [88.8, 27.8], [91.2, 27.2],
	[92.6, 26.5], [92.5, 24.8], [91.8, 22.8], [91.5, 21.2], [90.2, 21.8], [88.5, 21.6], [87, 20.8],
	[85, 19.5], [82.5, 16.5], [80.5, 13.2], [79.5, 10.5], [78.2, 8.2], [77.5, 8], [76.2, 10],
	[74.5, 13.5], [73.2, 16.5], [72.5, 19.5], [71.2, 21.2], [69.5, 22.8], [67.2, 24], [64.5, 24.8],
	[62.5, 24.6]
];

/** Southern Seas: mainland Southeast Asia south of Annam, the straits, the islands, Taiwan, and their seas. */
const NAMYANG_CORE: LonLat[] = [
	[93.5, 20], [96, 22], [99, 21.8], [101.8, 21.6], [103.5, 20.8], [105.4, 19.4], [106.8, 18.1],
	[108.2, 17], [110, 17.5], [113, 16], [117, 19], [120.5, 21.8], [121.5, 25.4], [123.2, 25.3],
	[124.5, 21], [126.5, 14], [130, 8], [135, 3], [141, -2.5], [141, -9.5], [132, -10.5], [124, -11.8],
	[115, -10.5], [105, -8], [98, -2], [94, 4], [92.5, 8], [93, 13], [94, 16]
];

/** Greater Iran: Armenia, Mesopotamia, the plateau, Khorasan, Afghanistan and Transoxiana. */
const PERSIA_CORE: LonLat[] = [
	[38, 41.5], [41.5, 43], [45, 43], [48, 42.5], [50.5, 40.5], [53, 41], [56, 42.5], [60, 43.8],
	[64, 43.5], [68, 42.5], [71.5, 41.5], [73.5, 39.5], [74.5, 37], [72, 35.3], [71, 33], [69.5, 30.5],
	[67.5, 28], [66.5, 25.5], [62, 25.2], [57.5, 25.6], [54, 26.5], [51, 27.8], [49, 29.8], [48, 30.5],
	[46.5, 30.5], [44.5, 31.5], [42, 33.5], [40, 35.5], [38.5, 37], [37.5, 38.5]
];

/** Sasanian Arabia: the Gulf coast, Oman and (from the 570s) Yemen. */
const PERSIA_ARABIA_CORE: LonLat[] = [
	[47.5, 30], [50.2, 27.4], [51.6, 24.6], [54.2, 24.1], [56.3, 26.4], [59.8, 22.6], [58.2, 18.9],
	[55.2, 17], [52.2, 15.7], [48.6, 14], [45, 12.6], [43.2, 12.7], [42.7, 15.6], [43.3, 17.6],
	[46, 17.9], [50, 18.4], [53.6, 19.6], [55.6, 21.6], [51.4, 23.2], [49.8, 25.6], [47.6, 28.2]
];

/** Roman Arabia: Sinai, Arabia Petraea and the Ghassanid north Hejaz. */
const ROME_ARABIA_CORE: LonLat[] = [
	[32.4, 31.2], [34.2, 31.3], [35.6, 33], [37.5, 33.4], [39.6, 32.2], [40.6, 30.4], [39.4, 28.4],
	[38.2, 26.4], [36.6, 25.8], [35.2, 27.8], [34.5, 29.4], [32.6, 29.7]
];

/** Greater Rome: Iberia to Anatolia, the Levant, Egypt, and down the Red Sea toward Axum. */
const ROME_CORE: LonLat[] = [
	[-9.5, 36.5], [-9.5, 42], [-8, 43.8], [-2, 43.6], [1, 42.8], [3.2, 43.3], [6.5, 43.8], [7.5, 46],
	[10.5, 46.8], [13.8, 46.6], [16.5, 46.3], [19.5, 45.2], [22.5, 44.6], [27, 44.2], [28.6, 43],
	[29.5, 41.8], [32, 41.9], [35, 42.1], [38, 41.2], [39.5, 40.5], [39.5, 38.5], [38.5, 37], [37.2, 36.5],
	[36.6, 35], [35.8, 33.5], [35.5, 32], [35.1, 30], [34.5, 28], [34, 22], [38, 16], [42, 12],
	[44, 8], [43, 4], [40, 2], [37, 5], [34, 10], [32, 15], [31.5, 23.8], [30, 25.5], [29, 30],
	[25, 31.2], [20, 30.6], [15.5, 31.4], [11, 33], [10.2, 35.3], [8, 36.6], [3, 36.6], [-1, 35.4],
	[-5, 35.6], [-6, 35.5], [-8.5, 36.2]
];

/**
 * The Türk khaganate's steppe band at its height: the Black Sea steppe and the Volga,
 * the Kazakh grass, Dzungaria and the Tarim, the Altai, Mongolia up to Baikal, and
 * east to the Greater Khingan. Manchuria's forests stay outside it.
 */
const NOMAD_CORE: LonLat[] = [
	[28, 46.6], [30, 48.2], [33, 50.2], [38, 51.8], [44, 53.4], [50, 54.6], [56, 55], [62, 54.8],
	[68, 54.6], [74, 54.4], [80, 53.4], [85, 52.2], [89, 51.2], [94, 51.8], [99, 52.4], [104, 53.2],
	[109, 53.4], [113, 52.4], [117, 50.8], [120, 49.6], [122.2, 47.6], [122.4, 45.6], [121.2, 43.4],
	[118.5, 42.3], [114, 41.6], [108, 41.4], [101, 41.4], [96, 41.2], [92, 40.2], [88, 39], [84, 38.6],
	[80, 38], [76.5, 38.4], [74.5, 39.6], [72.5, 41.8], [68, 43.4], [64, 44.1], [60, 44.5], [56.5, 43.8],
	[53, 44.6], [50.5, 45.2], [47.5, 44.2], [45, 43.6], [42, 44.4], [39, 45.2], [36, 45.4], [33, 45.9],
	[30.5, 46.2]
];

/** First match wins where cores overlap, so the smaller, firmer cores come first. */
export const CIV_SPHERES: CivSphere[] = [
	{ id: 'samhan', region: 'samhan', core: SAMHAN_CORE, reach: 1, quiet: true },
	{ id: 'japan-wa', region: 'wa', core: WA_CORE, reach: 0.6 },
	{ id: 'hwa', region: 'hwa', core: HWA_CORE, reach: 4 },
	{ id: 'tubo', region: 'tibet', core: TIBET_CORE, reach: 5 },
	{ id: 'cheonchuk', region: 'india', core: INDIA_CORE, reach: 4 },
	{ id: 'southern-seas', region: 'sea', core: NAMYANG_CORE, reach: 3, sea: true },
	{ id: 'persia', region: 'persia', core: PERSIA_CORE, reach: 5 },
	{ id: 'persia', region: 'persia', core: PERSIA_ARABIA_CORE, reach: 1.5 },
	{ id: 'bullim', region: 'rome', core: ROME_CORE, reach: 6 },
	{ id: 'bullim', region: 'rome', core: ROME_ARABIA_CORE, reach: 1.5 },
	{ id: 'northern-nomads', region: 'nomads', core: NOMAD_CORE, reach: 2.5 }
];

/**
 * The mythic west: Koreans knew no Atlantic. Just off the real coast from Norway to
 * the Cape, Europe and Africa run on as one land to the Western Heavens.
 */
export const WEST_LANDS: LonLat[] = [
	[-3, 72], [-6, 62], [-7, 52], [-5, 48.6], [-3, 46.2], [-7, 44.2], [-9.8, 43.2], [-10.2, 37],
	[-7.2, 33.2], [-10.4, 29.2], [-14.2, 26], [-17.4, 21], [-17.8, 14], [-15, 10], [-8, 4.4], [2, 4.4],
	[9, 3], [9.6, -2], [12, -6], [13, -12], [11.6, -18], [15, -28], [18, -35], [18, -90], [-220, -90],
	[-220, 160], [-3, 160]
];

/**
 * Lands no civilization claims: Arabia, western/southern Africa (not the Horn —
 * East Africa stays on the disc as land Rome and the seas can meet), the snowy
 * north, and Australia.
 */
export const UNKNOWN_LANDS: LonLat[][] = [
	[
		[37.6, 28.4], [41, 29.8], [45, 29.4], [47, 28.4], [49.2, 25.6], [50.6, 23.4], [54.6, 21.2],
		[55, 19.6], [52, 18.6], [48, 18.2], [45, 18.4], [43, 19.8], [40.4, 22.6], [38.6, 25.6]
	],
	[
		[-20, 27], [-8, 28], [0, 29], [10, 30], [19, 29.8], [25, 29], [28, 26], [30, 20], [28, 10],
		[25, 0], [20, -10], [15, -20], [20, -35], [-20, -40]
	],
	[
		[-30, 55], [-5, 56.5], [5, 57.5], [12, 55.5], [22, 55.5], [32, 56], [45, 57], [60, 57.5], [75, 56],
		[90, 55.5], [105, 54.5], [120, 54], [135, 53], [145, 51], [160, 50], [200, 50], [200, 160], [-30, 160]
	],
	WEST_LANDS
];

/** No man's sand: the Sahara and the Arabian desert. Unclaimed and unnamed. */
export const DESERT_LANDS: LonLat[][] = [
	[
		[-18, 28], [-8, 28.6], [0, 29.6], [10, 30.4], [19, 30.2], [25, 29.6], [28.5, 27], [31, 24],
		[33.5, 23.6], [36, 21], [38, 17.5], [34, 15.5], [25, 15], [15, 14.5], [5, 15], [-5, 15.5], [-17.5, 15.5]
	],
	[
		[34.8, 29.4], [37, 30.8], [40, 31.8], [43, 31], [46, 30], [48, 29.8], [50.5, 27], [56, 26.2],
		[59.8, 22.5], [57, 18], [52, 15.5], [45, 12.5], [43, 12.6], [42.5, 15], [39, 21], [36.5, 26], [34.8, 28]
	]
];

/** Jungle: Africa south of the Sahel, down to the Cape. Unclaimed and unnamed. */
export const JUNGLE_LANDS: LonLat[][] = [
	[
		[-18, 15.6], [-5, 15.6], [5, 15.1], [15, 14.6], [25, 15.1], [34, 15.6], [38, 17.5], [43, 12],
		[52, 12], [60, 0], [60, -40], [-20, -40]
	]
];

/** Snow: Scandinavia and the far north of Europe and Siberia. The Himalaya is height, not paint. */
export const SNOW_LANDS: LonLat[][] = [
	[
		[-12, 58], [-6, 56.8], [2, 57.2], [8, 57.6], [12, 56], [20, 56.2], [30, 56.8], [45, 57.6], [60, 57.2],
		[75, 56.2], [95, 55.2], [110, 54.4], [130, 54.2], [145, 52], [165, 55], [200, 60], [200, 160], [-20, 160]
	]
];

/** Yazdegerd dies in this year; after it the label is Daesik. The wash does not move. */
export const DAESIK_YEAR = 651;

/** The gold Samhan outline is painted for this year only, so the slider leaves it alone. */
export const SAMHAN_GOLD_YEAR = 642;

export const persiaRing = (year: number): LonLat[] => (year >= DAESIK_YEAR ? DAESIK_LANDS : PERSIA_LANDS);

/* —————————————— the ten hells (저승 as a mirrored mortal world) —————————————— */

/** Mid-China plains for the Fourth Court (오관 · 중원). Nested inside 화. */
export const JUNGWON_RING: LonLat[] = [
	[108, 36.5], [112, 37.2], [116, 36.8], [118, 34.5], [116.5, 32], [112, 31.2], [108.5, 32.5], [107.5, 34.8]
];

export type HellCourt = {
	/** 1–10, Yeomra is the fifth. */
	court: number;
	id: string;
	judge: { han: string; ko: string; en: string };
	hell: { ko: string; en: string };
	/** Material Symbols name drawn bold instead of hanja. */
	icon: string;
	/** The living sphere mirrored into this court (`CIV_SPHERES` id). */
	sphere?: string;
	/** A court inside a sphere instead of a whole one (중원 inside 화). */
	ring?: LonLat[];
	color: string;
	/** Where its name stands, before the mirror. */
	at: LonLat;
	/** Yumla's court is the brightest pit. */
	yumla?: boolean;
};

/**
 * Ten courts ↔ nine civilizations (+ 중원 inside 화).
 * Yeomra (Yumla, 5th) holds Samhan. Raging Winds (9th) holds the Southern Seas
 * (monsoon seafarers). Boiling Cauldrons (2nd) holds India — the seat that Winds
 * vacated when it moved to the seas.
 */
export const TEN_HELLS: HellCourt[] = [
	{
		court: 1,
		id: 'hell-jingwang',
		judge: { han: '秦廣大王', ko: '진광대왕', en: 'King Jingwang' },
		hell: { ko: '도산지옥', en: 'Mountain Knives' },
		icon: 'swords',
		sphere: 'japan-wa',
		color: '#c45a78',
		at: [140, 38.5]
	},
	{
		court: 2,
		id: 'hell-chogang',
		judge: { han: '初江大王', ko: '초강대왕', en: 'King Chogang' },
		hell: { ko: '화탕지옥', en: 'Boiling Cauldrons' },
		icon: 'skillet',
		sphere: 'cheonchuk',
		color: '#d06030',
		at: [78, 22]
	},
	{
		court: 3,
		id: 'hell-songje',
		judge: { han: '宋帝大王', ko: '송제대왕', en: 'King Songje' },
		hell: { ko: '한빙지옥', en: 'Freezing Ice' },
		icon: 'ac_unit',
		sphere: 'tubo',
		color: '#7a9ec8',
		at: [86, 32.5]
	},
	{
		court: 4,
		id: 'hell-ogwan',
		judge: { han: '五官大王', ko: '오관대왕', en: 'King Ogwan' },
		hell: { ko: '검수지옥', en: 'Blade Trees' },
		icon: 'forest',
		ring: JUNGWON_RING,
		color: '#a06028',
		at: [114, 34.5]
	},
	{
		court: 5,
		id: 'hell-yumla',
		judge: { han: '閻羅大王', ko: '염라대왕', en: 'King Yumla' },
		hell: { ko: '발설지옥', en: 'Tongue Plowing' },
		icon: 'record_voice_over',
		sphere: 'samhan',
		color: '#e8b24a',
		at: [127, 40],
		yumla: true
	},
	{
		court: 6,
		id: 'hell-byeonseong',
		judge: { han: '變成大王', ko: '변성대왕', en: 'King Byeonseong' },
		hell: { ko: '독사지옥', en: 'Venomous Snakes' },
		icon: 'pest_control',
		sphere: 'persia',
		color: '#2a8a78',
		at: [55, 32]
	},
	{
		court: 7,
		id: 'hell-taesan',
		judge: { han: '泰山大王', ko: '태산대왕', en: 'King Taesan' },
		hell: { ko: '거해지옥', en: 'Large Saws' },
		icon: 'carpenter',
		sphere: 'hwa',
		color: '#b45309',
		at: [103.5, 26]
	},
	{
		court: 8,
		id: 'hell-pyeongdeung',
		judge: { han: '平等大王', ko: '평등대왕', en: 'King Pyeongdeung' },
		hell: { ko: '철상지옥', en: 'Scorching Ironbeds' },
		icon: 'hotel',
		sphere: 'bullim',
		color: '#7b4fa0',
		at: [29, 39]
	},
	{
		court: 9,
		id: 'hell-dosi',
		judge: { han: '都市大王', ko: '도시대왕', en: 'King Dosi' },
		hell: { ko: '풍도지옥', en: 'Raging Winds' },
		icon: 'air',
		sphere: 'southern-seas',
		color: '#3f7f9e',
		at: [110, -1]
	},
	{
		court: 10,
		id: 'hell-odo',
		judge: { han: '五道轉輪大王', ko: '오도전륜대왕', en: 'King Odo Jeonryun' },
		hell: { ko: '흑암지옥', en: 'Pitch Darkness' },
		icon: 'dark_mode',
		sphere: 'northern-nomads',
		color: '#3a3430',
		at: [100, 47.5]
	}
];

/** Horizontal mirror of a living-world sheet point into 저승, scaled to its disc. */
export function flipToDead(x: number, y: number): [number, number] {
	const scale = DEAD_DISC.r / LIVING_DISC.r;
	return [DEAD_DISC.x - (x - LIVING_DISC.x) * scale, DEAD_DISC.y + (y - LIVING_DISC.y) * scale];
}

/** Where a court's name stands in 저승: the mirror of its own civilization. */
export const hellAt = (h: HellCourt): [number, number] => flipToDead(...cosmosProject(...h.at));

/* —————————————— coast corrections (painted over the baked land) —————————————— */

/** The north never ends: past the Arctic coast the snow runs on to the rim. */
export const NORTH_SNOW: LonLat[] = [
	[-40, 64], [-4, 63.2], [6, 64.4], [14, 67.4], [24, 69.6], [34, 67.2], [42, 66.4], [60, 67.8],
	[80, 68.4], [110, 69], [140, 68.2], [170, 64.8], [220, 64], [220, 160], [-40, 160]
];

/** Australia is past the known south; New Guinea and Timor stay. */
export const AUSTRALIA_WATER: LonLat[] = [
	[108, -13.2], [124, -13.8], [129, -11.6], [132, -11.2], [136.6, -11.6], [141.2, -10.9], [142.8, -10.9],
	[146.4, -13.6], [165, -20], [165, -60], [108, -60]
];

/** Sea of Okhotsk, between the mainland and Kamchatka. */
export const OKHOTSK_WATER: LonLat[] = [
	[142.4, 54.4], [145.2, 59.2], [150.4, 59.6], [155.2, 57.6], [157.4, 54.2],
	[156.2, 50.8], [152.4, 48.2], [147.6, 47.4], [144.6, 49.6], [142.8, 52.4]
];

/** Kamchatka, added so the peninsula stays land after the Okhotsk cut. */
export const KAMCHATKA_LAND: LonLat[] = [
	[156.2, 51.0], [158.4, 53.0], [159.8, 55.6], [162.0, 58.8], [163.6, 61.0],
	[162.0, 61.8], [159.6, 59.4], [158.0, 56.2], [156.4, 53.0], [155.6, 51.2]
];

export const WATER_CUTS: LonLat[][] = [AUSTRALIA_WATER, OKHOTSK_WATER];
export const LAND_ADDS: LonLat[][] = [WEST_LANDS, NORTH_SNOW, KAMCHATKA_LAND];

/** How high the Sky Palace hangs over the mountain, per scope (world units). */
export const SKY_HEIGHT = { samhan: 1.5, sphere: 3.4, world: 6.2, cosmos: 7.5 } as const;

/* —————————————— scopes —————————————— */

/**
 * Nested frames of the same painted sheet, nearer to farther:
 * Samhan (peninsula) → Sphere (Hua & Wa, with Indonesia) → World (이승) → Cosmos (이승+저승).
 * Switching a chip only reframes; the paint does not change.
 */
export type CosmosScope = 'samhan' | 'sphere' | 'world' | 'cosmos';

export const COSMOS_SCOPES: { id: CosmosScope; en: string; ko: string; icon: string }[] = [
	{ id: 'samhan', en: 'Samhan', ko: '삼한', icon: 'landscape' },
	{ id: 'sphere', en: 'Sphere', ko: '구', icon: 'travel_explore' },
	{ id: 'world', en: 'World', ko: '이승', icon: 'public' },
	{ id: 'cosmos', en: 'Cosmos', ko: '천하', icon: 'nights_stay' }
];

/** The sheet box around a lon/lat window, sampled along its edges (the fold bends straight lines). */
function boxOf(lon0: number, lon1: number, lat0: number, lat1: number): SheetBox {
	let x0 = Infinity;
	let x1 = -Infinity;
	let y0 = Infinity;
	let y1 = -Infinity;
	for (let i = 0; i <= 24; i++) {
		const lon = lon0 + ((lon1 - lon0) * i) / 24;
		const lat = lat0 + ((lat1 - lat0) * i) / 24;
		for (const [x, y] of [cosmosProject(lon, lat0), cosmosProject(lon, lat1), cosmosProject(lon0, lat), cosmosProject(lon1, lat)]) {
			x0 = Math.min(x0, x);
			x1 = Math.max(x1, x);
			y0 = Math.min(y0, y);
			y1 = Math.max(y1, y);
		}
	}
	return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** The square the world camera frames. Both layouts are circular silhouettes. */
export const viewBox = (layout: CosmosLayout): SheetBox => discsBox(viewDiscs(layout), 1.1);

/** The painted plane: the two discs, with a little margin. Pixels outside them are cleared. */
export const COSMOS_FRAME: SheetBox = discsBox([LIVING_DISC, DEAD_DISC], 1.04);

/** What each scope frames on the sheet. Samhan keeps the peninsula relief; the rest crop the same paint. */
export const SCOPE_BOX: Record<Exclude<CosmosScope, 'samhan'>, SheetBox> = {
	/** Hua, Wa, Han and the Northern Nomads — east far enough for Indonesia, south past the equator. */
	sphere: boxOf(95, 155, -8, 53),
	/** 이승 alone: the living disc. */
	world: discsBox([LIVING_DISC], 1.08),
	/** 이승 + 저승. */
	cosmos: viewBox('circles')
};

/** The camera's tilt per scope: farther out → more from above. Keep sphere flatter than before so East Asia doesn't fish-eye. */
export const SCOPE_VIEW: Record<CosmosScope, { az: number; el: number }> = {
	samhan: { az: 0, el: 0.84 },
	sphere: { az: 0, el: 0.72 },
	world: { az: 0.35, el: 0.55 },
	/** Lower and more oblique so the thick disc skirt, the basin and the flower hill read. */
	cosmos: { az: 0.62, el: 0.32 }
};

/* —————————————— a court's land and its reach —————————————— */

/**
 * Tang proper: the Ten Circuits of the Zhenguan years, from the Liao's west bank to
 * Dunhuang and Hainan, a hand-drawn approximation. Seaward points stand off the
 * coast, since only the polity's own edge is cut by it. Everything Tang holds past
 * this line is a protectorate (Anbuk, Seonu, Anseo, Andong, Annam).
 */
const TANG_PROPER: LonLat[] = [
	[93.5, 40.7], [95.5, 40.9], [97.8, 40.2], [99.8, 39.8], [101.8, 39.0], [103.5, 39.6], [105.8, 39.4], [106.6, 40.4],
	[107.4, 41.2], [109.8, 40.9], [111.3, 40.2], [113.2, 40.6], [114.9, 41.0], [116.6, 40.9], [118.6, 40.8], [120.0, 42.0],
	[121.6, 41.6], [121.2, 40.7], [120.6, 39.6], [120.3, 38.2], [123.2, 37.6], [123.4, 34.5], [122.8, 30.5], [121.6, 27.3],
	[120.1, 24.8], [117.8, 22.6], [114.5, 21.4], [111.8, 20.6], [111.6, 18.0], [108.4, 17.8], [108.0, 21.4], [106.8, 22.3],
	[105.6, 23.2], [104.1, 24.4], [103.0, 26.0], [102.3, 27.8], [102.1, 29.6], [102.6, 31.3], [103.3, 32.8], [102.8, 34.5],
	[101.4, 35.9], [100.6, 37.0], [99.6, 38.4], [97.8, 39.2], [95.6, 39.6], [93.5, 39.9]
];

export type CosmosClip = {
	/** Which standing polities it cuts: by data name, or a whole region. */
	name?: RegExp;
	region?: CosmosRegion;
	ring: LonLat[];
	/** What lies past the ring: a hatched protectorate, or nothing. */
	outside: 'protectorate' | 'drop';
};

export const COSMOS_CLIPS: CosmosClip[] = [{ name: /^(Tang|Zhou)$/, ring: TANG_PROPER, outside: 'protectorate' }];

/**
 * The year's shapes are the heartland, cut so they cannot wander out of that
 * civilization's reach. Persia's heartland is the empire or the caliphate;
 * Rome's is the standing Roman or Byzantine border, not a hand-drawn coast.
 */
export function clipsFor(year: number): CosmosClip[] {
	const persiaCore = persiaRing(year);
	return [
		...COSMOS_CLIPS,
		{ region: 'persia', ring: persiaCore, outside: 'drop' },
		{ region: 'nomads', ring: NOMAD_CORE, outside: 'drop' },
		{ region: 'rome', ring: ROME_CORE, outside: 'drop' },
		{ region: 'india', ring: INDIA_CORE, outside: 'drop' },
		{ region: 'tibet', ring: TIBET_CORE, outside: 'drop' }
	];
}

/** Polities that are a court's reach and nothing more: hatched whole. */
export const PROTECTORATE_NAME = /Protectorate/;

/** A lon/lat ring in sheet units, its edges sampled about every degree (the fold bends them). */
export function sheetRing(ring: LonLat[]): Pt[] {
	return ring.flatMap(([lon, lat], i) => {
		const [nlon, nlat] = ring[(i + 1) % ring.length];
		const n = Math.max(1, Math.ceil(Math.hypot(nlon - lon, nlat - lat)));
		return Array.from({ length: n }, (_, k) => cosmosProject(lon + ((nlon - lon) * k) / n, lat + ((nlat - lat) * k) / n));
	});
}

/* —————————————— the gold line round Samhan —————————————— */

/** The sheet's polities that are Samhan (Balhae and the West's commanderies are not). */
export const SAMHAN_POLITIES: ReadonlySet<string> = new Set([
	'gojoseon', 'jin', 'buyeo', 'jolbon', 'dongbuyeo', 'galsa', 'goguryeo', 'baekje', 'silla', 'gaya',
	'mahan', 'jinhan', 'byeonhan', 'okjeo', 'dongye', 'tamla', 'usan'
]);

/** Islands always inside the line, whoever holds them that year; `r` is the least they draw as, in sheet units. */
export const SAMHAN_ISLES: { id: string; han: string; en: string; ko: string; at: LonLat; r: number }[] = [
	{ id: 'tamla', han: '耽羅', en: 'Tamla', ko: '탐라', at: [126.55, 33.38], r: 3 },
	{ id: 'usan', han: '鬱陵島', en: 'Ulleungdo', ko: '울릉도', at: [130.87, 37.5], r: 1.6 },
	{ id: 'dokdo', han: '獨島', en: 'Dokdo', ko: '독도', at: [131.87, 37.24], r: 0.9 }
];

/** The line's gap off the coast and its width, in sheet units, per scope: wider the farther out. */
export const SAMHAN_LINE: Record<Exclude<CosmosScope, 'samhan'>, { gap: number; width: number }> = {
	sphere: { gap: 2.5, width: 4 },
	world: { gap: 4, width: 8 },
	cosmos: { gap: 5, width: 11 }
};
