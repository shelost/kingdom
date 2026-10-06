/**
 * Shared TOC open state — the story layout owns the shell shift;
 * Toc.svelte binds into this so chrome and reading column stay in sync.
 */
export const tocUi = $state({
	/** Closed until the reader lands on an episode (see `loadViewScope`). */
	open: false,
	/** True while a TOC / hash jump is in flight — keeps chrome from treating a remount as “left the script”. */
	jumping: false,
	/** Sidebar as a floating card with drop shadow. Default on. */
	floating: true
});

/** Below this width the drawer covers the page instead of pushing it. Keep in step with Toc.svelte's 820px rules. */
const TOC_OVERLAY_QUERY = '(max-width: 820px)';

export function tocOverlays(): boolean {
	return typeof matchMedia !== 'undefined' && matchMedia(TOC_OVERLAY_QUERY).matches;
}

/** Opens the TOC for the reader, except on a phone where it would cover the page. */
export function autoOpenToc() {
	if (!tocOverlays()) tocUi.open = true;
}

const TOC_FLOAT_KEY = 'kingdom:toc-float';

export function setTocFloating(on: boolean) {
	tocUi.floating = on;
	try {
		localStorage.setItem(TOC_FLOAT_KEY, on ? '1' : '0');
	} catch {
		/* private mode */
	}
}

export function loadTocFloating() {
	try {
		const v = localStorage.getItem(TOC_FLOAT_KEY);
		if (v === '0') tocUi.floating = false;
		else tocUi.floating = true;
	} catch {
		/* default on */
	}
}

let jumpGen = 0;

export function beginTocJump() {
	jumpGen += 1;
	tocUi.jumping = true;
	return jumpGen;
}

export function endTocJump(gen?: number) {
	if (gen !== undefined && gen !== jumpGen) return;
	tocUi.jumping = false;
	if (typeof window !== 'undefined') window.dispatchEvent(new Event('scroll'));
}

/** Desktop layout settle for jump-after-close (matches --toc-duration). */
export const TOC_DURATION_MS = 380;

/**
 * Scroll anchor for the TOC panel: the topmost visible item (`id`) and its
 * offset from the panel top (`delta`). Kept at module level so it survives
 * component destroy/recreate, and mirrored to sessionStorage so it survives
 * a page reload within the session.
 */
export type TocAnchor = { id: string; delta: number };

const TOC_ANCHOR_KEY = 'kingdom:toc-anchor';
let tocAnchor: TocAnchor | null = null;

export function saveTocAnchor(anchor: TocAnchor) {
	tocAnchor = anchor;
	try {
		sessionStorage.setItem(TOC_ANCHOR_KEY, JSON.stringify(anchor));
	} catch {
		/* storage unavailable — module cache still works */
	}
}

export function loadTocAnchor(): TocAnchor | null {
	if (tocAnchor) return tocAnchor;
	try {
		const raw = sessionStorage.getItem(TOC_ANCHOR_KEY);
		if (raw) {
			const parsed: unknown = JSON.parse(raw);
			if (
				parsed &&
				typeof parsed === 'object' &&
				typeof (parsed as TocAnchor).id === 'string' &&
				typeof (parsed as TocAnchor).delta === 'number'
			) {
				tocAnchor = parsed as TocAnchor;
			}
		}
	} catch {
		/* ignore malformed/unavailable storage */
	}
	return tocAnchor;
}
