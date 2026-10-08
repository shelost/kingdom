import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { EP_QUERY, VIEW_QUERY } from '$lib/reading.svelte';

/** Bookmarks from when the reader lived at `/` (`/?ep=jumong`) open the reader. */
export function load({ url }) {
	if (url.searchParams.has(EP_QUERY) || url.searchParams.has(VIEW_QUERY)) {
		redirect(307, `${resolve('/read')}${url.search}`);
	}
}
