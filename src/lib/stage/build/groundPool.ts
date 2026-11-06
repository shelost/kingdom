/**
 * Samples a site's ground grids across a few workers so switching sites doesn't freeze the page.
 * The scene builds with `withGrids(await prepareGround(...), () => buildSite(...))`;
 * a null answer (no workers, a failure, a timeout) means the build samples its own ground.
 */
import type { StageSiteId } from '../sites';
import type { BuildOptions } from './types';
import { joinBands, type GridBand, type GridData, type GridSpec } from './terrain';
import type { GroundJob, GroundReply } from './ground.worker';

const KEEP = 4;
const TIMEOUT_MS = 60_000;

type Pending = { resolve: (r: GroundReply | null) => void; timer: ReturnType<typeof setTimeout> };

let workers: Worker[] | null = null;
let rid = 0;
const pending = new Map<number, Pending>();
const cache = new Map<string, Promise<GridData[] | null>>();

function pool(): Worker[] {
	if (workers) return workers;
	if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') return (workers = []);
	const size = Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 4) - 2));
	workers = [];
	for (let i = 0; i < size; i++) {
		try {
			const w = new Worker(new URL('./ground.worker.ts', import.meta.url), { type: 'module' });
			w.onmessage = (e: MessageEvent<GroundReply>) => settle(e.data.rid, e.data);
			w.onerror = () => resetGroundPool();
			workers.push(w);
		} catch {
			break;
		}
	}
	return workers;
}

function settle(id: number, reply: GroundReply | null) {
	const job = pending.get(id);
	if (!job) return;
	pending.delete(id);
	clearTimeout(job.timer);
	job.resolve(reply);
}

function ask(w: Worker, job: Omit<GroundJob, 'rid'>): Promise<GroundReply | null> {
	const id = ++rid;
	return new Promise((resolve) => {
		pending.set(id, { resolve, timer: setTimeout(() => settle(id, null), TIMEOUT_MS) });
		w.postMessage({ ...job, rid: id } satisfies GroundJob);
	});
}

async function sample(id: StageSiteId, opts: BuildOptions): Promise<GridData[] | null> {
	const list = pool();
	if (!list.length) return null;
	const replies = await Promise.all(list.map((w, part) => ask(w, { id, opts, part, parts: list.length })));
	const parts: { specs: GridSpec[]; bands: GridBand[] }[] = [];
	for (const r of replies) {
		if (!r || 'error' in r) return null;
		parts.push(r);
	}
	const specs = parts[0].specs;
	if (parts.some((p) => p.bands.length !== specs.length)) return null;
	return specs.map((spec, g) => joinBands(spec, parts.map((p) => p.bands[g])));
}

/** The sampled ground for a site, shared by every caller asking for the same site, year and light. */
export function prepareGround(id: StageSiteId, opts: BuildOptions): Promise<GridData[] | null> {
	const key = `${id}|${opts.year}|${opts.light}`;
	const hit = cache.get(key);
	if (hit) {
		cache.delete(key);
		cache.set(key, hit);
		return hit;
	}
	const job = sample(id, opts).catch(() => null);
	cache.set(key, job);
	job.then((grids) => {
		if (!grids && cache.get(key) === job) cache.delete(key);
	});
	while (cache.size > KEEP) cache.delete(cache.keys().next().value!);
	return job;
}

/** Stop the workers and forget every sampled site (the build code changed, or a worker died). */
export function resetGroundPool(): void {
	for (const w of workers ?? []) w.terminate();
	workers = null;
	for (const id of [...pending.keys()]) settle(id, null);
	cache.clear();
}

if (import.meta.hot) {
	import.meta.hot.on('vite:beforeUpdate', (payload: { updates: { path: string }[] }) => {
		if (payload.updates.some((u) => u.path.includes('/stage/'))) resetGroundPool();
	});
}
