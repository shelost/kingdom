/**
 * Whether the reader has scrolled past the cover + blurb into the script.
 * Fixed story chrome (HUD, TOC toggle, relation card, edit link) waits on this.
 */
export const scriptUi = $state({
	inScript: false
});
