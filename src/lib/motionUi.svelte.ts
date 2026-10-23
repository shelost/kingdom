/**
 * The reader's "Animated" setting: stills play their camera move and overlay,
 * and the script arrives scene by scene as it scrolls in. On by default.
 * Mirrored onto `<html data-animated>` so stylesheets can follow it.
 */
import { browser } from '$app/environment';

const STORAGE_KEY = 'kingdom:animated';

export const motionUi = $state({ animated: true });

function apply(on: boolean) {
	motionUi.animated = on;
	if (browser) document.documentElement.dataset.animated = on ? 'on' : 'off';
}

export function setAnimated(on: boolean) {
	apply(on);
	try {
		localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
	} catch {
		/* private mode */
	}
}

export function loadAnimated() {
	let on = true;
	try {
		on = localStorage.getItem(STORAGE_KEY) !== '0';
	} catch {
		/* default on */
	}
	apply(on);
}

/** Motion is wanted: the setting is on and the system does not ask for less. */
export function animating(): boolean {
	const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
	return motionUi.animated && !reduced;
}
