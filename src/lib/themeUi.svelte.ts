/**
 * Site-wide light/dark theme. The inline script in app.html sets
 * data-theme on <html> before paint; this store picks that up on load,
 * and the nav toggle writes back through it (localStorage 'kingdom:theme').
 */
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'kingdom:theme';

function initialTheme(): Theme {
	if (!browser) return 'dark';
	return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export const themeUi = $state<{ theme: Theme }>({ theme: initialTheme() });

export function setTheme(theme: Theme) {
	themeUi.theme = theme;
	if (!browser) return;
	document.documentElement.dataset.theme = theme;
	try {
		localStorage.setItem(STORAGE_KEY, theme);
	} catch (_) {
		/* private mode — theme just won't persist */
	}
}

export function toggleTheme() {
	// Prefer the live DOM attribute (set by the boot script / last toggle)
	// so the button never flips against what the page is actually showing.
	const current =
		browser && document.documentElement.dataset.theme === 'light' ? 'light' : themeUi.theme;
	setTheme(current === 'dark' ? 'light' : 'dark');
}
