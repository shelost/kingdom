/**
 * The world beyond the hand-dated sites: Cliopatria's Chinese dynasties, steppe
 * khaganates and Yamato (static/map-world.json, built by
 * scripts/build-world-layer.mjs from the marble repo), in sheet units. Loaded once,
 * the first time a map asks for it.
 */
import { browser } from '$app/environment';
import { mapColor } from '$lib/borders';

type WorldKind = 'west' | 'east' | 'steppe';
type WorldName = { en: string; ko: string; kind: WorldKind };
type WorldRow = { n: number; f: number; t: number; a: number; l: [number, number] | null; s: number };
type WorldData = { names: WorldName[]; shapes: string[]; rows: WorldRow[] };

export type WorldRealm = {
	key: string;
	d: string;
	color: string;
	en: string;
	ko: string;
	label: [number, number] | null;
	area: number;
	kind: WorldKind;
};

/** Cliopatria files these under the Chinese layer. They are not Chinese dynasties. */
const NOT_DYNASTY = new Set([
	'Funan',
	'Pyu City-States',
	'Chámpa',
	'Kamarupa Kingdom',
	'Early Lý',
	'Yenisei Kyrgyz',
	'Chenla',
	'Water Chenla',
	'Land Chenla',
	'Tibetan Empire',
	'Lavo Kingdom',
	'Haripuñjaya',
	'Nanzhao',
	'Khmer Empire',
	'Tuyuhun',
	'Âu Lạc',
	'Trưng sisters'
]);

const store = $state<{ data: WorldData | null }>({ data: null });
let loading: Promise<void> | null = null;

function load() {
	if (!browser || loading) return;
	loading = fetch('/map-world.json')
		.then((r) => (r.ok ? r.json() : null))
		.then((data: WorldData | null) => {
			store.data = data;
		})
		.catch(() => {
			loading = null;
		});
}

/** Darker than the peninsula's own states: the frontier and the islands sit back. */
const STEPPE = '#5e5240';

/** Neighbouring dynasties of one era each take a slightly different shade of the frontier's colour. */
function tint(base: string, n: number): string {
	const k = ((n * 37) % 9) / 9 - 0.45;
	const v = parseInt(base.slice(1), 16);
	const ch = [v >> 16, (v >> 8) & 255, v & 255].map((c) => Math.max(0, Math.min(255, Math.round(c * (1 + k * 0.35)))));
	return '#' + ch.map((c) => c.toString(16).padStart(2, '0')).join('');
}

const cache = new Map<number, WorldRealm[]>();

/** The chronicle file still says the West and the East. The map says the dynasty and the kingship. */
function courtTitle(en: string, ko: string, year: number): { en: string; ko: string } {
	if (en === 'the West') return year >= 618 ? { en: 'Tang', ko: '당' } : { en: 'Sui', ko: '수' };
	if (en === 'the East') return year >= 670 ? { en: 'Japan', ko: '일본' } : { en: 'Yamato kingship', ko: '야마토 왕권' };
	return { en, ko };
}

/** The polities standing in `year`, largest first. Empty until the file arrives. */
export function worldAt(year: number): WorldRealm[] {
	load();
	const data = store.data;
	if (!data) return [];
	const hit = cache.get(year);
	if (hit) return hit;
	const standing = data.rows.filter((r) => r.f <= year && year <= r.t);
	/* The largest Chinese state paints exactly the frontier's colour, so it meets the sites' own
	   ground without a seam; rivals in a divided age take nearby shades. */
	const main = standing
		.filter((r) => data.names[r.n].kind === 'west')
		.reduce<WorldRow | null>((best, r) => (!best || r.a > best.a ? r : best), null);
	const out = standing
		.map((r, i) => {
			const name = data.names[r.n];
			const base =
				name.kind === 'east' ? mapColor('wa', 'wide') : name.kind === 'steppe' ? STEPPE : mapColor('china', 'wide');
			const title = courtTitle(name.en, name.ko, year);
			return {
				key: `${r.n}:${r.f}:${i}`,
				d: data.shapes[r.s],
				color: name.kind === 'west' && r.n !== main?.n ? tint(base, r.n) : base,
				en: title.en,
				ko: title.ko,
				label: r.l,
				area: r.a,
				kind: name.kind
			};
		})
		.sort((a, b) => b.area - a.area);
	cache.set(year, out);
	return out;
}

/** True once the dynasty file has arrived. Reading it subscribes a paint effect to the load. */
export function worldLoaded(): boolean {
	load();
	return store.data != null;
}

/**
 * Chinese courts standing in `year`, largest first.
 * In 221–263 the dataset also files a "Han" beside Shu. That is Shu Han twice;
 * the map keeps Shu.
 */
export function chineseCourts(year: number): WorldRealm[] {
	const seen = new Set<string>();
	const rows: WorldRealm[] = [];
	for (const r of worldAt(year)) {
		if (r.kind !== 'west' || NOT_DYNASTY.has(r.en) || seen.has(r.en)) continue;
		seen.add(r.en);
		rows.push(r);
	}
	if (seen.has('Shu')) return rows.filter((r) => r.en !== 'Han');
	return rows;
}
