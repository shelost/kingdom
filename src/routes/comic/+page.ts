import { comicById, DEFAULT_COMIC_ID } from '$lib/comic';

export function load({ url }) {
	const id = url.searchParams.get('story') ?? DEFAULT_COMIC_ID;
	const story = comicById.get(id) ?? comicById.get(DEFAULT_COMIC_ID)!;
	const raw = Number.parseInt(url.searchParams.get('p') ?? '1', 10);
	const max = story.pages.length;
	const page = Number.isFinite(raw) ? Math.min(max, Math.max(1, raw)) : 1;
	return { storyId: story.id, page };
}
