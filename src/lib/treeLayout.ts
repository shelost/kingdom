/**
 * Horizontal arrangement for the Silla house tree.
 * Y stays on the year axis; these only rewrite x.
 *
 * Couples are rigid units (center-to-center PAIR). That is what stops
 * marriage buses from dipping across half the board: Biryun sits next to
 * Mishil, so the vow is a short bar, not a long U.
 *
 * `hand` — authored order, then couple-snap + de-overlap.
 * `packed` — barycenter children under their parents, then the same snap.
 * `blood` — columns by line.
 * `spine-*` — pin one named line to a straight vertical; units pack around it.
 */

export type Arrange =
	| 'hand'
	| 'packed'
	| 'blood'
	| 'spine-sacred'
	| 'spine-yongsu'
	| 'spine-muyeol'
	| 'spine-bidam'
	| 'spine-jinduk'
	| 'spine-gaya';

export type LineBand = 'primary' | 'secondary' | 'tertiary' | 'gaya' | 'other';

export const SPINES: Record<
	Extract<Arrange, `spine-${string}`>,
	{ keys: string[]; ko: string; en: string }
> = {
	'spine-sacred': {
		keys: ['jijeung', 'beopheung', 'jiso', 'jinhung', 'dongnyun', 'jinpyung', 'sunduk'],
		ko: '적통',
		en: 'Sacred'
	},
	'spine-yongsu': {
		keys: ['jinhung', 'jinji', 'yongsu', 'chunchu'],
		ko: '용수',
		en: 'Yongsu'
	},
	'spine-muyeol': {
		keys: ['chunchu', 'munmu', 'sinmun'],
		ko: '무열',
		en: 'Muyeol'
	},
	'spine-bidam': {
		keys: ['jinhung', 'biryun', 'bidam'],
		ko: '비담',
		en: 'Bidam'
	},
	'spine-jinduk': {
		keys: ['dongnyun', 'gukban', 'jinduk'],
		ko: '진덕',
		en: 'Jinduk'
	},
	'spine-gaya': {
		keys: ['guhae', 'muryuk', 'seohyeon', 'yushin'],
		ko: '가야',
		en: 'Gaya'
	}
};

/** Center-to-center inside a marriage. Wide enough that labels do not kiss. */
const PAIR = 94;
/** Minimum gap between neighbouring units of similar year. */
const UNIT = 112;
const MIN_X = 90;
const SPINE_X = 520;
/** Birth-year window for treating two people as the same row. */
const SAME_ROW = 10;

const BAND_X: Record<LineBand, number> = {
	primary: 200,
	secondary: 430,
	tertiary: 640,
	gaya: 900,
	other: 760
};

export type LayoutPerson = { key: string; x: number; g: number };

function add(map: Map<string, string[]>, k: string, v: string) {
	const arr = map.get(k);
	if (arr) {
		if (!arr.includes(v)) arr.push(v);
	} else map.set(k, [v]);
}

function kinMaps(
	marriages: { a: string; b: string; children: string[] }[],
	descent: [string, string][]
) {
	const parents = new Map<string, string[]>();
	const kids = new Map<string, string[]>();
	const spouses: [string, string][] = [];
	const spouse = new Map<string, string[]>();
	for (const m of marriages) {
		spouses.push([m.a, m.b]);
		add(spouse, m.a, m.b);
		add(spouse, m.b, m.a);
		for (const c of m.children) {
			add(parents, c, m.a);
			add(parents, c, m.b);
			add(kids, m.a, c);
			add(kids, m.b, c);
		}
	}
	for (const [p, c] of descent) {
		add(parents, c, p);
		add(kids, p, c);
	}
	return { parents, kids, spouses, spouse };
}

function find(parent: Map<string, string>, k: string): string {
	let cur = k;
	while (parent.get(cur) && parent.get(cur) !== cur) {
		const p = parent.get(cur)!;
		parent.set(cur, parent.get(p) ?? p);
		cur = parent.get(cur) ?? p;
	}
	parent.set(k, cur);
	return cur;
}

/** Same-year marriage clusters (polygamy is one row: Sado–Jinhung–Sobi). */
function snapCouples(
	x: Map<string, number>,
	spouses: [string, string][],
	_years: Map<string, number>,
	pinned: Set<string>
) {
	const parent = new Map<string, string>();
	const link = (a: string, b: string) => {
		const pa = find(parent, a);
		const pb = find(parent, b);
		if (pa !== pb) parent.set(pa, pb);
	};
	for (const [a, b] of spouses) {
		if (!x.has(a) || !x.has(b)) continue;
		if (!parent.has(a)) parent.set(a, a);
		if (!parent.has(b)) parent.set(b, b);
		link(a, b);
	}
	const groups = new Map<string, string[]>();
	for (const k of parent.keys()) {
		if (!x.has(k)) continue;
		add(groups, find(parent, k), k);
	}
	for (const keys of groups.values()) {
		if (keys.length < 2) continue;
		keys.sort((a, b) => x.get(a)! - x.get(b)!);
		const pin = keys.find((k) => pinned.has(k));
		const origin = pin
			? x.get(pin)! - keys.indexOf(pin) * PAIR
			: keys.reduce((s, k) => s + x.get(k)!, 0) / keys.length - ((keys.length - 1) / 2) * PAIR;
		keys.forEach((k, i) => {
			if (pinned.has(k)) return;
			x.set(k, origin + i * PAIR);
		});
	}
}

/** Sit unmarried children under the couple (or parent) midpoint, spaced UNIT. */
function seatChildren(
	x: Map<string, number>,
	marriages: { a: string; b: string; children: string[] }[],
	descent: [string, string][],
	pinned: Set<string>
) {
	for (const m of marriages) {
		if (!x.has(m.a) || !x.has(m.b)) continue;
		const mid = (x.get(m.a)! + x.get(m.b)!) / 2;
		const kids = m.children.filter((c) => x.has(c) && !pinned.has(c));
		const n = kids.length;
		kids.forEach((c, i) => {
			x.set(c, mid + (i - (n - 1) / 2) * UNIT);
		});
	}
	const byParent = new Map<string, string[]>();
	for (const [p, c] of descent) {
		if (pinned.has(c) || !x.has(c)) continue;
		add(byParent, p, c);
	}
	for (const [p, kids] of byParent) {
		if (!x.has(p)) continue;
		const px = x.get(p)!;
		kids.forEach((c, i) => {
			if (pinned.has(c)) return;
			x.set(c, px + (i - (kids.length - 1) / 2) * UNIT);
		});
	}
}

type Unit = { keys: string[]; left: number; right: number; year: number };

function unitsOf(
	x: Map<string, number>,
	list: LayoutPerson[],
	years: Map<string, number>,
	spouse: Map<string, string[]>
): Unit[] {
	const seen = new Set<string>();
	const out: Unit[] = [];
	for (const n of list) {
		if (seen.has(n.key) || !x.has(n.key)) continue;
		const mates = (spouse.get(n.key) ?? []).filter((s) => x.has(s));
		const row = [n.key, ...mates].filter((k) => {
			if (seen.has(k)) return false;
			const ya = years.get(n.key) ?? 0;
			const yb = years.get(k) ?? 0;
			return k === n.key || Math.abs(ya - yb) <= SAME_ROW;
		});
		const uniq = [...new Set(row)];
		uniq.sort((a, b) => x.get(a)! - x.get(b)!);
		for (const k of uniq) seen.add(k);
		const xl = x.get(uniq[0])!;
		const xr = x.get(uniq[uniq.length - 1])!;
		out.push({
			keys: uniq,
			left: xl,
			right: xr,
			year: Math.min(...uniq.map((k) => years.get(k) ?? 0))
		});
	}
	return out;
}

function resolveUnits(
	x: Map<string, number>,
	list: LayoutPerson[],
	years: Map<string, number>,
	spouse: Map<string, string>,
	pinned: Set<string>,
	px = 7
) {
	for (let pass = 0; pass < 14; pass++) {
		const units = unitsOf(x, list, years, spouse);
		units.sort((a, b) => a.left - b.left);
		for (let i = 1; i < units.length; i++) {
			const a = units[i - 1];
			const b = units[i];
			if (Math.abs(a.year - b.year) * px > 96) continue;
			const need = UNIT - (b.left - a.right);
			if (need <= 0) continue;
			const aPin = a.keys.some((k) => pinned.has(k));
			const bPin = b.keys.some((k) => pinned.has(k));
			if (aPin && bPin) continue;
			const shiftA = aPin ? 0 : bPin ? -need : -need / 2;
			const shiftB = bPin ? 0 : aPin ? need : need / 2;
			for (const k of a.keys) x.set(k, x.get(k)! + shiftA);
			for (const k of b.keys) x.set(k, x.get(k)! + shiftB);
		}
	}
	let min = Infinity;
	for (const v of x.values()) if (v < min) min = v;
	const pad = MIN_X - min;
	if (pad > 0) for (const k of x.keys()) x.set(k, x.get(k)! + pad);
}

function tidy(
	x: Map<string, number>,
	list: LayoutPerson[],
	marriages: { a: string; b: string; children: string[] }[],
	descent: [string, string][],
	years: Map<string, number>,
	spouse: Map<string, string>,
	spouses: [string, string][],
	pinned: Set<string>
) {
	snapCouples(x, spouses, years, pinned);
	seatChildren(x, marriages, descent, pinned);
	snapCouples(x, spouses, years, pinned);
	resolveUnits(x, list, years, spouse, pinned);
}

function arrangeAroundSpine(
	list: LayoutPerson[],
	spine: string[],
	marriages: { a: string; b: string; children: string[] }[],
	descent: [string, string][],
	years: Map<string, number>,
	gaya: Set<string>
): Map<string, number> {
	const x = new Map(list.map((n) => [n.key, n.x]));
	const present = new Set(list.map((n) => n.key));
	const axis = spine.filter((k) => present.has(k));
	if (!axis.length) return x;

	const pinned = new Set(axis);
	for (const k of axis) x.set(k, SPINE_X);

	const { parents, kids, spouses, spouse } = kinMaps(marriages, descent);
	const placed = new Set(axis);

	for (const k of axis) {
		for (const s of spouse.get(k) ?? []) {
			if (pinned.has(s) || !present.has(s)) continue;
			x.set(s, SPINE_X + PAIR);
			placed.add(s);
		}
	}

	const order = [...list].sort((a, b) => (years.get(a.key) ?? 0) - (years.get(b.key) ?? 0));
	for (let pass = 0; pass < 10; pass++) {
		for (const n of order) {
			if (placed.has(n.key)) continue;
			const ps = (parents.get(n.key) ?? []).filter((p) => placed.has(p));
			if (!ps.length) continue;
			ps.sort((a, b) => Math.abs(x.get(a)! - SPINE_X) - Math.abs(x.get(b)! - SPINE_X));
			const parent = ps[0];
			const px = x.get(parent)!;
			const cadets = (kids.get(parent) ?? []).filter((c) => present.has(c) && !pinned.has(c));
			const idx = Math.max(0, cadets.indexOf(n.key));
			const side = pinned.has(parent) ? (gaya.has(n.key) ? 1 : -1) : px >= SPINE_X ? 1 : -1;
			x.set(n.key, px + side * UNIT * (1 + idx));
			placed.add(n.key);
		}
	}

	tidy(x, list, marriages, descent, years, spouse, spouses, pinned);
	for (const k of axis) x.set(k, SPINE_X);
	snapCouples(x, spouses, years, pinned);
	resolveUnits(x, list, years, spouse, pinned);
	for (const k of axis) x.set(k, SPINE_X);
	return x;
}

export function arrangeX(
	list: LayoutPerson[],
	mode: Arrange,
	marriages: { a: string; b: string; children: string[] }[],
	descent: [string, string][],
	years: Map<string, number>,
	band: Map<string, LineBand>,
	gaya: Set<string>
): Map<string, number> {
	const x = new Map(list.map((n) => [n.key, n.x]));
	const { parents, spouses, spouse } = kinMaps(marriages, descent);
	const pinned = new Set<string>();

	if (mode.startsWith('spine-')) {
		const def = SPINES[mode as keyof typeof SPINES];
		return arrangeAroundSpine(list, def?.keys ?? [], marriages, descent, years, gaya);
	}

	if (mode === 'blood') {
		for (const n of list) {
			const b = band.get(n.key) ?? 'other';
			x.set(n.key, BAND_X[b] + (n.g % 3) * 12 - 12);
		}
	} else if (mode === 'packed') {
		for (let pass = 0; pass < 8; pass++) {
			for (const n of list) {
				const ps = (parents.get(n.key) ?? []).filter((p) => x.has(p));
				if (!ps.length) continue;
				const avg = ps.reduce((s, p) => s + x.get(p)!, 0) / ps.length;
				x.set(n.key, x.get(n.key)! * 0.4 + avg * 0.6);
			}
		}
	}

	tidy(x, list, marriages, descent, years, spouse, spouses, pinned);
	return x;
}
