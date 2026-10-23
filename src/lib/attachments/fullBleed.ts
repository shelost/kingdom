import type { Attachment } from 'svelte/attachments';

/** How long the fit keeps tracking after a layout transition starts (the TOC slide), in ms. */
const TRACK_MS = 700;

/**
 * Stretch a block to the window's full width from wherever its column sits.
 * Writes `--bleed-left` (the margin that pulls it to the window's left edge)
 * and `--bleed-w` (the window width without the scrollbar); the element's CSS
 * uses them with its own fallbacks for the server render.
 */
export const fullBleed: Attachment<HTMLElement> = (node) => {
	const parent = node.parentElement;
	if (!parent) return;
	let raf = 0;
	let until = 0;

	const fit = () => {
		raf = 0;
		const left = parent.getBoundingClientRect().left;
		node.style.setProperty('--bleed-left', `${(-left).toFixed(1)}px`);
		node.style.setProperty('--bleed-w', `${document.documentElement.clientWidth}px`);
		if (performance.now() < until) raf = requestAnimationFrame(fit);
	};
	const schedule = () => {
		if (!raf) raf = requestAnimationFrame(fit);
	};
	/* Only a transition on an ancestor (a padding or inset easing) can move the column. */
	const track = (e: Event) => {
		if (!(e.target instanceof Element) || !e.target.contains(node)) return;
		until = performance.now() + TRACK_MS;
		schedule();
	};

	fit();
	const ro = new ResizeObserver(schedule);
	ro.observe(parent);
	ro.observe(document.documentElement);
	addEventListener('resize', schedule);
	document.addEventListener('transitionrun', track);

	return () => {
		if (raf) cancelAnimationFrame(raf);
		ro.disconnect();
		removeEventListener('resize', schedule);
		document.removeEventListener('transitionrun', track);
		node.style.removeProperty('--bleed-left');
		node.style.removeProperty('--bleed-w');
	};
};
