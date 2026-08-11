/**
 * Shared TOC open state — the story layout owns the shell shift;
 * Toc.svelte binds into this so chrome and reading column stay in sync.
 */
export const tocUi = $state({
	open: false
});

/** Desktop layout settle for jump-after-close (matches --toc-duration). */
export const TOC_DURATION_MS = 140;
