/**
 * Every top-level page, in nav order. The pill nav, the phone tab bar and the
 * chronicle drawer all read this list. `tab` pages sit in the phone tab bar;
 * the rest live behind its More sheet.
 */
export const SITE_LINKS = [
	{ href: '/', label: 'Chronicle', icon: 'auto_stories', tab: true },
	{ href: '/wiki', label: 'Wiki', icon: 'menu_book', tab: true },
	{ href: '/characters', label: 'Characters', icon: 'hub', tab: true },
	{ href: '/map', label: 'Map', icon: 'map', tab: false },
	{ href: '/music', label: 'Music', icon: 'music_note', tab: false },
	{ href: '/scenes', label: 'Scenes', icon: 'album', tab: true },
	{ href: '/grade', label: 'Grade', icon: 'grading', tab: false }
] as const;

export type SiteLink = (typeof SITE_LINKS)[number];

/** `resolved` is the href after base path resolution, so a deployed base still matches. */
export function isSiteLinkActive(link: SiteLink, path: string, resolved: string): boolean {
	if (link.href === '/') return path === '/' || path === resolved;
	return path === link.href || path === resolved || path.startsWith(`${link.href}/`);
}

/** Pages that carry the phone tab bar. The chronicle has its own drawer; tools stay bare. */
export function hasTabBar(path: string): boolean {
	return SITE_LINKS.some((link) => link.href !== '/' && isSiteLinkActive(link, path, link.href));
}
