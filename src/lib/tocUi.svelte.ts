/**
 * Shared TOC open state — the story layout owns the shell shift;
 * Toc.svelte binds into this so chrome and reading column stay in sync.
 */
export const tocUi = $state({
	open: false
});

/** Desktop layout settle for jump-after-close (matches --toc-duration). */
export const TOC_DURATION_MS = 140;

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
