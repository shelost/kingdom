/**
 * Finished sites, so leaving a model and coming back does not build it again.
 * Buyeo is keyed by year because the snow is baked into the ground. Every other
 * site only sinks and raises era layers, which `setYear` already does.
 */
import type { StageSiteId } from '../sites';
import type { BuildOptions, SiteBuild } from './types';

const KEEP = 3;

const kept = new Map<string, SiteBuild>();
let epoch = 0;

export function siteCacheKey(id: StageSiteId, opts: BuildOptions): string {
	return id === 'buyeo' ? `${id}|${opts.year}|${opts.light}` : `${id}|${opts.light}`;
}

/** A site parked earlier, taken out of the cache so only the live scene holds it. */
export function takeSite(key: string): SiteBuild | null {
	const hit = kept.get(key);
	if (!hit) return null;
	kept.delete(key);
	return hit;
}

/** Park a site that just left the scene. The oldest parked site is disposed past `KEEP`. */
export function parkSite(key: string, build: SiteBuild): void {
	const prev = kept.get(key);
	if (prev && prev !== build) prev.dispose();
	kept.delete(key);
	kept.set(key, build);
	while (kept.size > KEEP) {
		const oldest = kept.keys().next().value;
		if (oldest === undefined) break;
		kept.get(oldest)?.dispose();
		kept.delete(oldest);
	}
}

/** Bumped when the stage code reloads, so a live scene disposes instead of parking a stale build. */
export function siteCacheEpoch(): number {
	return epoch;
}

export function resetSiteCache(): void {
	epoch++;
	for (const build of kept.values()) build.dispose();
	kept.clear();
}

if (import.meta.hot) {
	import.meta.hot.on('vite:beforeUpdate', (payload: { updates: { path: string }[] }) => {
		if (payload.updates.some((u) => u.path.includes('/stage/'))) resetSiteCache();
	});
}
