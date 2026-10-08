import type { Attachment } from 'svelte/attachments';

/**
 * Attachment: run `enter` once, the first time the element scrolls into view.
 * Without IntersectionObserver it runs straight away, so nothing is left hidden.
 */
export function onceInView(
	enter: (node: HTMLElement) => void | (() => void),
	{ threshold = 0.35, rootMargin = '0px 0px -10% 0px' }: IntersectionObserverInit = {}
): Attachment<HTMLElement> {
	return (node) => {
		let cleanup: void | (() => void);
		if (typeof IntersectionObserver === 'undefined') {
			cleanup = enter(node);
			return () => cleanup?.();
		}
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				io.disconnect();
				cleanup = enter(node);
			},
			{ threshold, rootMargin }
		);
		io.observe(node);
		return () => {
			io.disconnect();
			cleanup?.();
		};
	};
}

export function prefersReducedMotion(): boolean {
	return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
