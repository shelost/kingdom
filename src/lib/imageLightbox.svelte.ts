/**
 * Shared still viewer — /images, chronicle script, wiki gallery, cinema.
 * One overlay; callers pass a stack and a start index.
 */

export type LightboxItem = {
	src: string;
	alt: string;
	title: string;
	caption?: string;
	nsfw?: boolean;
	/** Chronicle episode DOM id (`chapterId-slug`) — “Open in chronicle”. */
	episodeId?: string;
};

export const imageLightbox = $state({
	open: false,
	items: [] as LightboxItem[],
	index: 0
});

export function openLightbox(items: LightboxItem[], index = 0) {
	const usable = items.filter((im) => im.src);
	if (!usable.length) return;
	imageLightbox.items = usable;
	imageLightbox.index = Math.max(0, Math.min(index, usable.length - 1));
	imageLightbox.open = true;
}

export function closeLightbox() {
	imageLightbox.open = false;
	imageLightbox.items = [];
	imageLightbox.index = 0;
}

export function stepLightbox(delta: number) {
	const n = imageLightbox.items.length;
	if (n < 2) return;
	imageLightbox.index = (imageLightbox.index + delta + n) % n;
}

export function currentLightboxItem(): LightboxItem | null {
	if (!imageLightbox.open) return null;
	return imageLightbox.items[imageLightbox.index] ?? null;
}
