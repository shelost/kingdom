/**
 * Shared still viewer — /images, chronicle script, wiki gallery, cinema.
 * One overlay; callers pass a stack and a start index.
 * Optional `from` (clicked thumb / button) enables GSAP Flip open/close.
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

export type LightboxOpenOpts = {
	/** Thumbnail or click target — Flip expands from this into the modal. */
	from?: EventTarget | HTMLElement | null;
};

export const imageLightbox = $state({
	open: false,
	items: [] as LightboxItem[],
	index: 0,
	/** Stable id shared by thumb + modal shot for Flip (`data-flip-id`). */
	flipId: '' as string,
	/** Element Flip should expand from / return to (usually the thumb `<img>`). */
	originEl: null as HTMLElement | null
});

/** Resolve a click target to the visible image used for Flip. */
export function lightboxOriginOf(target: EventTarget | HTMLElement | null | undefined) {
	if (!target || !(target instanceof HTMLElement)) return null;
	if (target instanceof HTMLImageElement) return target;
	return target.querySelector('img') ?? target;
}

export function openLightbox(
	items: LightboxItem[],
	index = 0,
	opts: LightboxOpenOpts | EventTarget | HTMLElement | null = {}
) {
	const usable = items.filter((im) => im.src);
	if (!usable.length) return;

	const from =
		opts instanceof HTMLElement || opts instanceof EventTarget || opts == null
			? opts
			: (opts.from ?? null);

	const i = Math.max(0, Math.min(index, usable.length - 1));
	imageLightbox.items = usable;
	imageLightbox.index = i;
	imageLightbox.flipId = usable[i]?.src ?? '';
	imageLightbox.originEl = lightboxOriginOf(from);
	imageLightbox.open = true;
}

export function closeLightbox() {
	imageLightbox.open = false;
	imageLightbox.items = [];
	imageLightbox.index = 0;
	imageLightbox.flipId = '';
	imageLightbox.originEl = null;
}

export function stepLightbox(delta: number) {
	const n = imageLightbox.items.length;
	if (n < 2) return;
	imageLightbox.index = (imageLightbox.index + delta + n) % n;
	imageLightbox.flipId = imageLightbox.items[imageLightbox.index]?.src ?? '';
	/* Stepping stays in the modal — no thumb Flip. */
	imageLightbox.originEl = null;
}

export function lightboxReduceMotion() {
	if (typeof window === 'undefined' || !window.matchMedia) return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
