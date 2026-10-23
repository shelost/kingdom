import { browser } from '$app/environment';
import { VOLUMES } from '$lib/books';
import { volumeCover } from '$lib/posters.svelte';

/** Start the Three shelf and cover bitmaps before the books page is in frame. */
export function preloadBooks() {
	if (!browser) return;
	void import('$lib/components/books/BooksCanvas.svelte');
	for (const volume of VOLUMES) {
		const src = volumeCover(volume.id);
		if (!src) continue;
		const img = new Image();
		img.src = src;
	}
}
