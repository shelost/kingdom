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

export type WorldRealm = { key: string; d: string; color: string; en: string; ko: string; label: [number, number] | null; area: number };

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
			const base = name.kind === 'east' ? mapColor('wa') : name.kind === 'steppe' ? STEPPE : mapColor('china');
			return {
				key: `${r.n}:${r.f}:${i}`,
				d: data.shapes[r.s],
				color: name.kind === 'west' && r.n !== main?.n ? tint(base, r.n) : base,
				en: name.en,
				ko: name.ko,
				label: r.l,
				area: r.a
			};
		})
		.sort((a, b) => b.area - a.area);
	cache.set(year, out);
	return out;
}
