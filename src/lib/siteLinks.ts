/** The chronicle reader. `/` is the hub that leads into it and every other page. */
export const READ_PATH = '/read';

/** Sections of the pill's ⋯ menu, in order. */
export const LINK_GROUPS = [
	{ id: 'read', en: 'Read', ko: '읽기' },
	{ id: 'explore', en: 'Explore', ko: '둘러보기' },
	{ id: 'media', en: 'Sound & scenes', ko: '소리와 장면' },
	{ id: 'studio', en: 'Studio', ko: '작업실' }
] as const;

export type LinkGroup = (typeof LINK_GROUPS)[number]['id'];

/**
 * Every top-level page, in nav order. The pill nav, its ⋯ menu, the phone tab bar
 * and the chronicle drawer all read this list. `tab` pages sit in the phone tab bar;
 * the rest live behind its More sheet. `group` files a page in the ⋯ menu.
 */
export const SITE_LINKS = [
	{ href: '/', label: 'Home', ko: '홈', icon: 'home', tab: true, group: 'explore' },
	{ href: READ_PATH, label: 'Read', ko: '읽기', icon: 'auto_stories', tab: false, group: 'read' },
	{ href: '/books', label: 'Library', ko: '서가', icon: 'library_books', tab: true, group: 'read' },
	{ href: '/stories', label: 'Stories', ko: '이야기', icon: 'history_edu', tab: false, group: 'read' },
	{ href: '/timeline', label: 'Timeline', ko: '연표', icon: 'view_timeline', tab: false, group: 'read' },
	{ href: '/tree', label: 'Family tree', ko: '가계도', icon: 'account_tree', tab: false, group: 'explore' },
	{ href: '/wiki', label: 'Wiki', ko: '위키', icon: 'menu_book', tab: true, group: 'explore' },
	{ href: '/images', label: 'Images', ko: '그림', icon: 'photo_library', tab: true, group: 'media' },
	{ href: '/comic', label: 'Comic', ko: '만화', icon: 'view_quilt', tab: false, group: 'read' },
	{ href: '/quotes', label: 'Quotes', ko: '명언', icon: 'format_quote', tab: false, group: 'read' },
	{ href: '/about', label: 'About', ko: '소개', icon: 'info', tab: false, group: 'explore' },
	{ href: '/guide', label: 'Guide', ko: '안내', icon: 'article', tab: false, group: 'explore' },
	{ href: '/research', label: 'Research', ko: '사료 연구', icon: 'museum', tab: false, group: 'explore' },
	{ href: '/characters', label: 'Characters', ko: '인물 관계도', icon: 'hub', tab: false, group: 'explore' },
	{ href: '/map', label: 'Map', ko: '지도', icon: 'map', tab: false, group: 'explore' },
	{ href: '/stage', label: '3D', ko: '3D', icon: 'view_in_ar', tab: false, group: 'explore' },
	{ href: '/music', label: 'Music', ko: '음악', icon: 'music_note', tab: false, group: 'media' },
	{ href: '/scenes', label: 'Scenes', ko: '장면', icon: 'album', tab: false, group: 'media' },
	{ href: '/widgets', label: 'Widgets', ko: '위젯', icon: 'widgets', tab: false, group: 'studio' },
	{ href: '/grade', label: 'Grade', ko: '평가', icon: 'grading', tab: false, group: 'studio' },
	{ href: '/dashboard', label: 'Dashboard', ko: '대시보드', icon: 'monitoring', tab: false, group: 'studio' },
	{ href: '/directory', label: 'Directory', ko: '전체 목록', icon: 'list_alt', tab: false, group: 'studio' }
] as const satisfies readonly {
	href: string;
	label: string;
	ko: string;
	icon: string;
	tab: boolean;
	group: LinkGroup;
}[];

export type SiteLink = (typeof SITE_LINKS)[number];

/**
 * Floating pill nav, left → right:
 * Library · Home · Wiki · Images · Map · 3D, then the ⋯ menu.
 * (Chapters + Volumes merged into Library; World is merged into Home.)
 */
const PILL_HREFS: readonly SiteLink['href'][] = ['/books', '/', '/wiki', '/images', '/map', '/stage'];

export const PILL_LINKS: SiteLink[] = PILL_HREFS.map((href) => SITE_LINKS.find((link) => link.href === href)!);

/** Every page the pill leaves out, grouped for its ⋯ menu. */
export const MENU_SECTIONS = LINK_GROUPS.map((group) => ({
	...group,
	links: SITE_LINKS.filter((link) => link.group === group.id && !PILL_HREFS.includes(link.href))
})).filter((section) => section.links.length > 0);

/** `resolved` is the href after base path resolution, so a deployed base still matches. */
export function isSiteLinkActive(link: { href: string }, path: string, resolved: string): boolean {
	if (link.href === '/') return path === '/' || path === resolved;
	return path === link.href || path === resolved || path.startsWith(`${link.href}/`);
}

/** Pages that carry the phone tab bar. The chronicle has its own drawer; tools stay bare. */
export function hasTabBar(path: string): boolean {
	return SITE_LINKS.some((link) => link.href !== READ_PATH && isSiteLinkActive(link, path, link.href));
}
