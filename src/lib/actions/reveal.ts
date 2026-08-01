// Scroll-reveal: fades (and optionally lifts) an element in the first time
// it enters the viewport. `y: 0` animates opacity only — use that on any
// ancestor of a position:sticky element, since a transform would break it.
export interface RevealOptions {
	delay?: number; // ms
	y?: number; // px of lift; 0 = fade only
}

export function reveal(node: HTMLElement, opts: RevealOptions = {}) {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const y = opts.y ?? 26;
	if (opts.delay) node.style.transitionDelay = `${opts.delay}ms`;
	if (y === 0) {
		node.classList.add('reveal-fade');
	} else {
		node.style.setProperty('--reveal-y', `${y}px`);
		node.classList.add('reveal');
	}

	const io = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.classList.add('is-visible');
				io.disconnect();
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.03 }
	);
	io.observe(node);

	return { destroy: () => io.disconnect() };
}
