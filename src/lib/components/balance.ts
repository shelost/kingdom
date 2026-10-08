import type { Attachment } from 'svelte/attachments';

/**
 * Attachment: keeps an original and its translation from running lopsided side by side.
 * Both are measured in the side-by-side layout; when the translation is more than
 * `ratio` times as tall as the original (and longer by at least `slack` px), the node
 * gets `data-balance="band"` so its CSS can lay the original across the top and flow
 * the translation underneath. Re-measured whenever either side or the card resizes
 * (width, language switch, late fonts); the decision only depends on the side-by-side
 * heights, so toggling the layout cannot oscillate.
 */
export function balance(
	original: string,
	translation: string,
	{ ratio = 2, slack = 180 }: { ratio?: number; slack?: number } = {}
): Attachment<HTMLElement> {
	return (node) => {
		if (typeof ResizeObserver === 'undefined') return;
		let frame = 0;

		const measure = () => {
			const a = node.querySelector<HTMLElement>(original);
			const b = node.querySelector<HTMLElement>(translation);
			if (!a || !b) return;
			delete node.dataset.balance;
			const ha = a.offsetHeight;
			const hb = b.offsetHeight;
			if (ha > 0 && hb > ha * ratio && hb - ha > slack) node.dataset.balance = 'band';
		};

		const ro = new ResizeObserver(() => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(measure);
		});
		ro.observe(node);
		for (const sel of [original, translation]) {
			const el = node.querySelector(sel);
			if (el) ro.observe(el);
		}
		return () => {
			cancelAnimationFrame(frame);
			ro.disconnect();
			delete node.dataset.balance;
		};
	};
}
