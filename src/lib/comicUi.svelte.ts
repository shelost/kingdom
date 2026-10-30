/**
 * Comic-reader chrome: ink (black-and-white) print toggle.
 */
import { browser } from '$app/environment';

const KEY = 'kingdom:comic-ink';

function load(): boolean {
	if (!browser) return false;
	try {
		return localStorage.getItem(KEY) === '1';
	} catch {
		return false;
	}
}

export const comicUi = $state({
	ink: load()
});

export function setComicInk(on: boolean) {
	comicUi.ink = on;
	if (!browser) return;
	try {
		localStorage.setItem(KEY, on ? '1' : '0');
	} catch {
		/* private mode */
	}
}
