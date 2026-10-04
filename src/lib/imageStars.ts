/**
 * Starred stills. Written by edit-mode right-click → /api/stars into
 * `src/lib/data/image-stars.json`. Keys are cue slot ids, or the file key
 * (`artAttachmentKey`) for stills that belong to no chronicle slot.
 */

export type ImageStarStore = {
	updatedAt: string;
	stars: string[];
};

export const EMPTY_STAR_STORE: ImageStarStore = { updatedAt: '', stars: [] };

/** Portrait / place / binyeo / object / sword / armor / hat / flag boards — never starrable. */
const REFERENCE_FILE = /^(ch|bn|pl|obj|sw|sword|ar|hat|flag|ref|st)_/i;
const REFERENCE_DIR = /(^|\/)(people|nations|refs)\//i;

export function isReferenceImage(src: string | null | undefined): boolean {
	const path = (src ?? '').split('?')[0]?.trim() ?? '';
	if (!path) return true;
	if (/\.svg$/i.test(path) || REFERENCE_DIR.test(path)) return true;
	return REFERENCE_FILE.test(path.split('/').pop() ?? '');
}

export function cleanStarStore(raw: unknown): ImageStarStore {
	if (!raw || typeof raw !== 'object') return { ...EMPTY_STAR_STORE, stars: [] };
	const v = raw as Partial<ImageStarStore>;
	const stars = Array.isArray(v.stars)
		? [...new Set(v.stars.filter((s): s is string => typeof s === 'string' && !!s.trim()).map((s) => s.trim()))]
		: [];
	stars.sort();
	return { updatedAt: typeof v.updatedAt === 'string' ? v.updatedAt : '', stars };
}

const LOCAL_KEY = 'kingdom:image-stars';

export function readLocalStars(): ImageStarStore | null {
	if (typeof localStorage === 'undefined') return null;
	try {
		const raw = localStorage.getItem(LOCAL_KEY);
		return raw ? cleanStarStore(JSON.parse(raw)) : null;
	} catch {
		return null;
	}
}

export function writeLocalStars(store: ImageStarStore) {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(LOCAL_KEY, JSON.stringify(store));
	} catch {
		/* private mode */
	}
}
