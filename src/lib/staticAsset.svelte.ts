/**
 * Cache-bust root-relative static assets (`/ch_…`, `/pl_…`, `/bn_…`, flags, …).
 *
 * Browsers key image caches on URL. Replacing a file on disk leaves the path
 * unchanged, so `<img src="/ch_foo.png">` can keep showing the old bytes
 * until the URL changes. Append `?v=` so swaps invalidate cleanly.
 *
 * In dev, a Vite plugin bumps `staticAssetCache.rev` when files under `static/`
 * change so open pages pick up new art without a hard refresh.
 */

export const staticAssetCache = $state({
	rev: String(import.meta.env.VITE_STATIC_ASSET_REV ?? '1')
});

if (import.meta.hot) {
	import.meta.hot.on('static-asset-change', () => {
		staticAssetCache.rev = String(Date.now());
	});
}

/** Append a cache-busting query param to root-relative static asset paths. */
export function staticAsset(path: string | null | undefined): string | null {
	if (!path) return null;
	if (!path.startsWith('/') || path.startsWith('//')) return path;

	const q = path.indexOf('?');
	const base = q === -1 ? path : path.slice(0, q);
	const params = new URLSearchParams(q === -1 ? undefined : path.slice(q + 1));
	params.set('v', staticAssetCache.rev);
	return `${base}?${params}`;
}
