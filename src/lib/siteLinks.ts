/** The chronicle reader. `/` is the hub that leads into it and every other page. */
export const READ_PATH = '/read';

/**
 * Every top-level page, in nav order. The pill nav, the phone tab bar and the
 * chronicle drawer all read this list. `tab` pages sit in the phone tab bar;
 * the rest live behind its More sheet.
 */
export const SITE_LINKS = [
	{ href: '/', label: 'Home', icon: 'home', tab: true },
	{ href: READ_PATH, label: 'Read', icon: 'auto_stories', tab: true },
	{ href: '/episodes', label: 'Episodes', icon: 'video_library', tab: true },
	{ href: '/wiki', label: 'Wiki', icon: 'menu_book', tab: true },
	{ href: '/images', label: 'Images', icon: 'photo_library', tab: true },
	{ href: '/about', label: 'About', icon: 'info', tab: false },
	{ href: '/research', label: 'Research', icon: 'museum', tab: false },
	{ href: '/characters', label: 'Characters', icon: 'hub', tab: false },
	{ href: '/map', label: 'Map', icon: 'map', tab: false },
	{ href: '/music', label: 'Music', icon: 'music_note', tab: false },
	{ href: '/scenes', label: 'Scenes', icon: 'album', tab: false },
	{ href: '/widgets', label: 'Widgets', icon: 'widgets', tab: false },
	{ href: '/grade', label: 'Grade', icon: 'grading', tab: false }
] as const;

export type SiteLink = (typeof SITE_LINKS)[number];

/** The featured pages in the floating pill nav, in order. */
export const PILL_LINKS = [
	{ href: '/', label: 'Home' },
	{ href: READ_PATH, label: 'Read' },
	{ href: '/episodes', label: 'Episodes' },
	{ href: '/wiki', label: 'Wiki' },
	{ href: '/images', label: 'Images' },
	{ href: '/about', label: 'About' }
] as const;

/** `resolved` is the href after base path resolution, so a deployed base still matches. */
export function isSiteLinkActive(link: { href: string }, path: string, resolved: string): boolean {
	if (link.href === '/') return path === '/' || path === resolved;
	return path === link.href || path === resolved || path.startsWith(`${link.href}/`);
}

/** Pages that carry the phone tab bar. The chronicle has its own drawer; tools stay bare. */
export function hasTabBar(path: string): boolean {
	return SITE_LINKS.some((link) => link.href !== READ_PATH && isSiteLinkActive(link, path, link.href));
}
