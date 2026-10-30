/**
 * The one right-click menu on images in edit mode: Star, Download, Set as thumbnail, Full width,
 * Move, Original shape, Hide and Remove.
 * Views that know more (cue id, sequence index, gallery cell) open it with
 * their own target; any other `storyImg` falls back to the window handler.
 * Reference boards (portraits, places, binyeo…) never get the menu.
 */
import { editUi, permanentlyDeleteImage } from '$lib/editUi.svelte';
import { isReferenceImage } from '$lib/imageStars';
import { cueSlotOf, isStarred, starKey } from '$lib/imageStarsUi.svelte';
import { isThumbnail, setThumbnail } from '$lib/thumbnail.svelte';
import { setCueHidden } from '$lib/hiddenCues.svelte';
import { lineNear, sayOf, type Say } from '$lib/comicSay';
import { commitCrop, cueLayoutOf, cueMove, setCueSay, setCueWide } from '$lib/cueLayout.svelte';

/** Shape chips on the edit menu. `null` is the picture's own frame. */
export const CUE_SHAPES: { label: string; ratio: number | null }[] = [
	{ label: '2:1', ratio: 2 },
	{ label: '16:9', ratio: 16 / 9 },
	{ label: '4:3', ratio: 4 / 3 },
	{ label: '1:1', ratio: 1 },
	{ label: '3:4', ratio: 0.75 }
];

export type ImageMenuTarget = {
	/** Header line: slot id, file name, "Still 2 of 5". */
	label: string;
	/** Original site path (`data-src`). Empty disables Download. */
	src?: string;
	/** Empty disables Star. */
	starKey: string;
	/** Omit to disable Remove; `removeHint` says why. */
	remove?: () => unknown;
	removeHint?: string;
	/** Omit to disable "Set as thumbnail" — only chronicle cues belong to an episode. */
	thumbnail?: () => unknown;
	/** Already the episode's thumbnail. */
	isThumbnail?: boolean;
	/** Omit to disable "Set as poster" — arc and chapter alternates only. */
	poster?: () => unknown;
	/** Already the poster on this title page. */
	isPoster?: boolean;
	/** Omit to disable Hide — only chronicle cues can be hidden from it. */
	hide?: () => unknown;
	/** Script mode: stands alone at full width rather than in the masonry. */
	wide?: boolean;
	/** Omit to disable Full width — only chronicle cues have a place in the script. */
	toggleWide?: () => unknown;
	/** Omit to disable Move; the next block clicked receives the cue. */
	move?: () => unknown;
	/** Omit when the frame keeps the picture's own shape. */
	resetCrop?: () => unknown;
	/** Current display shape, so a chip can show which ratio is on. */
	crop?: number;
	/** Set a shape. `null` restores the picture's own. */
	setShape?: (ratio: number | null) => unknown;
	/** Put the still back in the two-column grid. */
	pair?: () => unknown;
	/** 'on' is a written balloon, 'off' is silenced, 'auto' is guessed in comic mode. */
	balloon?: 'on' | 'off' | 'auto';
	/** Write, edit, or clear the comic balloon. */
	setBalloon?: (mode: 'on' | 'edit' | 'off') => unknown;
};

function askBalloon(current: Say | undefined): Say | false | null {
	const en = window.prompt('Balloon, in English. Empty turns it off.', current?.en ?? '');
	if (en == null) return null;
	if (!en.trim()) return false;
	const ko = window.prompt('Balloon, in Korean.', current?.ko ?? '');
	if (ko == null) return null;
	return { en: en.trim(), ...(ko.trim() ? { ko: ko.trim() } : {}), ...(current?.person ? { person: current.person } : {}) };
}

export const imageMenu = $state({
	target: null as ImageMenuTarget | null,
	x: 0,
	y: 0
});

/** Open at the pointer. No-op outside edit mode, so the browser menu stays. */
export function openImageMenu(e: MouseEvent, target: ImageMenuTarget): boolean {
	if (!editUi.enabled) return false;
	e.preventDefault();
	e.stopPropagation();
	imageMenu.target = target;
	imageMenu.x = e.clientX;
	imageMenu.y = e.clientY;
	return true;
}

export function closeImageMenu() {
	imageMenu.target = null;
}

function originalHref(src: string): string {
	const path = src.split('?')[0] ?? src;
	if (!path || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:') || path.startsWith('/')) {
		return path;
	}
	return `/${path}`;
}

function downloadName(src: string): string {
	const base = (src.split('?')[0] ?? src).split('/').pop() ?? 'image';
	return base.replace(/[^\w.-]+/g, '_') || 'image';
}

/** Save the original file, not the resized `?w=` / Vercel optimizer URL. */
export async function downloadImage(src: string) {
	const href = originalHref(src);
	if (!href || href.startsWith('data:')) return;
	const name = downloadName(href);
	try {
		const res = await fetch(href);
		if (!res.ok) throw new Error(String(res.status));
		const url = URL.createObjectURL(await res.blob());
		const a = document.createElement('a');
		a.href = url;
		a.download = name;
		a.rel = 'noopener';
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	} catch {
		const a = document.createElement('a');
		a.href = href;
		a.download = name;
		a.rel = 'noopener';
		a.target = '_blank';
		document.body.appendChild(a);
		a.click();
		a.remove();
	}
}

/**
 * A chronicle cue: Remove deletes the slot and its art; it can front its episode.
 * `src` is the picture clicked, so a temp stand-in shown beside its final can be the thumbnail.
 */
export function cueMenuTarget(slotId: string, src?: string): ImageMenuTarget {
	const { wide, crop, say } = cueLayoutOf(slotId);
	const draft = (): Say | undefined => (say && typeof say === 'object' ? say : (sayOf(slotId) ?? lineNear(slotId)));
	const locked = isStarred(slotId);
	return {
		label: slotId,
		src,
		starKey: slotId,
		remove: locked ? undefined : () => permanentlyDeleteImage({ kind: 'cue', slotId }),
		removeHint: locked ? 'Starred stills cannot be deleted' : undefined,
		thumbnail: () => setThumbnail(slotId, src),
		isThumbnail: isThumbnail(slotId, src),
		hide: () => setCueHidden(slotId, true),
		wide,
		toggleWide: () => setCueWide(slotId, !wide),
		pair: wide ? () => setCueWide(slotId, false) : undefined,
		move: () => {
			cueMove.slotId = slotId;
		},
		crop,
		setShape: (ratio) => commitCrop(slotId, ratio, crop),
		resetCrop: crop ? () => commitCrop(slotId, null, crop) : undefined,
		balloon: say === false ? 'off' : say ? 'on' : 'auto',
		setBalloon: (mode) => {
			if (mode === 'off') return setCueSay(slotId, false);
			if (mode === 'on') {
				const line = draft();
				if (!line) {
					window.alert('No spoken line sits near this still. Write one with Edit balloon.');
					return;
				}
				return setCueSay(slotId, line);
			}
			const next = askBalloon(draft());
			if (next == null) return;
			return setCueSay(slotId, next);
		}
	};
}

function fileLabel(src: string): string {
	return src.split('?')[0]?.split('/').pop() || src;
}

/** Any site path: the owning cue when there is one, else star-only. Null for references. */
export function srcMenuTarget(src: string): ImageMenuTarget | null {
	if (isReferenceImage(src)) return null;
	const slotId = cueSlotOf(src);
	if (slotId && !editUi.removedCueIds.has(slotId)) return cueMenuTarget(slotId, src);
	return {
		label: fileLabel(src),
		src,
		starKey: starKey(src),
		removeHint: 'Only chronicle cues can be removed here'
	};
}

function imageSrcAt(target: EventTarget | null): string {
	if (!(target instanceof Element)) return '';
	const img =
		target.closest('img[data-src]') ??
		target.closest('button, a, figure, li, [role="button"]')?.querySelector('img[data-src]');
	return img?.getAttribute('data-src') ?? '';
}

/**
 * Window-level fallback. Runs after component handlers, which already
 * `preventDefault`. Shift + right-click keeps the browser menu.
 */
export function onEditImageContextMenu(e: MouseEvent) {
	if (!editUi.enabled || e.defaultPrevented || e.shiftKey) return;
	const src = imageSrcAt(e.target);
	const target = src ? srcMenuTarget(src) : null;
	if (target) openImageMenu(e, target);
}
