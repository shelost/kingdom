import type { Attachment } from 'svelte/attachments';

/**
 * Mirrors whether the node is on screen into `data-in-view` ("true" / "false"),
 * so CSS can hold animations nobody can see. Without IntersectionObserver the
 * attribute never appears and the animations simply run.
 */
export function inView(rootMargin = '0px'): Attachment<HTMLElement> {
	return (node) => {
		if (typeof IntersectionObserver === 'undefined') return;
		const io = new IntersectionObserver(
			([e]) => {
				node.dataset.inView = e.isIntersecting ? 'true' : 'false';
			},
			{ rootMargin }
		);
		io.observe(node);
		return () => {
			io.disconnect();
			delete node.dataset.inView;
		};
	};
}
