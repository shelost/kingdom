/** Pin the Ask transcript to the bottom while tokens stream, unless the reader scrolled up. */

const NEAR = 80;

export function nearAskBottom(el: HTMLElement, threshold = NEAR): boolean {
	return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
}

/** Sticky-bottom auto-scroll for the Ask log (`{@attach askAutoScroll}`). */
export function askAutoScroll(el: HTMLElement, onSticky?: (sticky: boolean) => void) {
	let sticky = true;
	let raf = 0;

	const setSticky = (next: boolean) => {
		if (sticky === next) return;
		sticky = next;
		onSticky?.(sticky);
	};

	const pin = (force = false) => {
		if (force) setSticky(true);
		if (!sticky) return;
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			raf = requestAnimationFrame(() => {
				el.scrollTop = el.scrollHeight;
			});
		});
	};

	const onScroll = () => {
		setSticky(nearAskBottom(el));
	};

	el.addEventListener('scroll', onScroll, { passive: true });
	const mo = new MutationObserver(() => pin());
	mo.observe(el, { childList: true, subtree: true, characterData: true });
	const ro = new ResizeObserver(() => pin());
	ro.observe(el);
	pin(true);

	return () => {
		cancelAnimationFrame(raf);
		el.removeEventListener('scroll', onScroll);
		mo.disconnect();
		ro.disconnect();
	};
}
