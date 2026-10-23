import type { BookMode } from '$lib/books';

/** Live shelf/display toggle. Read inside the Threlte canvas; props through Canvas do not flush. */
export const bookView = $state({
	mode: 'shelf' as BookMode
});
