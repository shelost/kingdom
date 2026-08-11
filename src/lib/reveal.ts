/**
 * Svelte action: fade+lift an element in as it enters the viewport.
 *
 * Progressive enhancement — the hidden state is applied from JS, never from the
 * stylesheet, so if scripting is unavailable the content renders as normal.
 * A watchdog guarantees the page can never be left invisible: if the observer
 * has not reported anything shortly after the first element is observed, the
 * effect is abandoned and everything is shown.
 *
 * Pass `{ y: 0 }` (fade only) on any `position: sticky` element — a transform
 * creates a containing block and breaks stickiness for the whole animation.
 */

type Item = { show: () => void };

export type RevealParam = number | { delay?: number; y?: number };

const pending = new Set<Item>();
let observerAlive = false;
let watchdog: ReturnType<typeof setTimeout> | undefined;

/** Called the first time any observer callback fires — proof that IO works. */
function markAlive() {
	if (observerAlive) return;
	observerAlive = true;
	clearTimeout(watchdog);
}

function armWatchdog() {
	if (watchdog !== undefined || observerAlive) return;
	watchdog = setTimeout(() => {
		if (observerAlive) return;
		// IntersectionObserver never reported — reveal everything rather than
		// leaving the reader with a blank page.
		for (const item of pending) item.show();
		pending.clear();
	}, 1500);
}

function normalize(param: RevealParam = 0): { delay: number; y: number } {
	if (typeof param === 'number') return { delay: param, y: 18 };
	return { delay: param.delay ?? 0, y: param.y ?? 18 };
}

export function reveal(node: HTMLElement, param: RevealParam = 0) {
	const { delay, y } = normalize(param);
	const reduced =
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Nothing to animate — leave the element exactly as authored.
	if (reduced || typeof IntersectionObserver === 'undefined') return {};

	/* Short enough that a paragraph is readable by the time the eye lands on
	   it — a long fade reads as "the page is broken" mid-scroll. */
	const DURATION = 480;
	const ease = `${DURATION}ms cubic-bezier(0.22,0.61,0.36,1)`;
	node.style.opacity = '0';
	if (y === 0) {
		node.style.transition = `opacity ${ease} ${delay}ms`;
	} else {
		node.style.transform = `translateY(${y}px)`;
		node.style.transition =
			`opacity ${ease} ${delay}ms,` + `transform ${ease} ${delay}ms`;
	}

	let shown = false;
	const show = () => {
		if (shown) return;
		shown = true;
		node.style.opacity = '';
		if (y !== 0) node.style.transform = '';
		// drop the inline transition once it has played, so hover styles are free
		setTimeout(() => (node.style.transition = ''), DURATION + delay);
	};

	const item: Item = { show };
	pending.add(item);

	const io = new IntersectionObserver(
		(entries) => {
			markAlive();
			for (const e of entries) {
				if (e.isIntersecting) {
					show();
					pending.delete(item);
					io.disconnect();
				}
			}
		},
		{ rootMargin: '0px 0px -6% 0px', threshold: 0.05 }
	);

	io.observe(node);
	armWatchdog();

	return {
		destroy() {
			io.disconnect();
			pending.delete(item);
		}
	};
}
