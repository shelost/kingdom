import { EP_QUERY, VIEW_QUERY, resolveEpisodeIndex } from '$lib/reading.svelte';

/**
 * Resolve `?ep=` before the first render, on the server too, so a refresh
 * paints that episode instead of flashing the foreword until mount.
 */
export function load({ url }) {
	const ep = url.searchParams.get(EP_QUERY);
	return {
		episodeIndex: ep && url.searchParams.get(VIEW_QUERY) !== 'full' ? resolveEpisodeIndex(ep) : -1
	};
}
