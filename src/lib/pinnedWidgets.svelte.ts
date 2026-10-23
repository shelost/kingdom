/**
 * Wide immersion pins the chronicle's widgets (record cards, character cards,
 * poems, place cards…) in their own sticky panel to the right of the script.
 * The script keeps an invisible marker where each one used to sit, and the
 * panel shows a widget once the reader has passed its marker.
 */
import { MediaQuery } from 'svelte/reactivity';
import type { Attachment } from 'svelte/attachments';
import type { Block } from '$lib/story';
import { widgetKindOf } from '$lib/widgets';
import { reading } from '$lib/reading.svelte';

/** Must match the three-column `.entry` rule in `read/+page.svelte`. */
const wide = new MediaQuery('min-width: 1100px', false);
/** Must match the side-column `.entry` rule (the phone feed starts below it). */
const desktop = new MediaQuery('min-width: 821px', false);

/** Text-like kinds that read as part of the prose stay inline. */
const INLINE_KINDS = new Set<Block['kind']>(['verse', 'table', 'formation']);

export function pinsToPanel(b: Block): boolean {
	return widgetKindOf(b) !== null && !INLINE_KINDS.has(b.kind);
}

export function widgetsPinned(): boolean {
	return reading.mode === 'immersion' && wide.current;
}

/** Desktop immersion: the scenes panel's stills run as a rising track. */
export function stageTrack(): boolean {
	return reading.mode === 'immersion' && desktop.current;
}

const keys = new WeakMap<Block, string>();
let next = 0;

/** A stable key per block object, shared by the script's marker and the panel. */
export function widgetKey(b: Block): string {
	let k = keys.get(b);
	if (!k) {
		k = `w${++next}`;
		keys.set(b, k);
	}
	return k;
}

/** Same reading line as the sticky image reel (`ImageStack` BAND_MID). */
const READING_LINE = 0.4;

/**
 * Watches the markers matching `selector` inside the node's entry and reports
 * the ones whose top has crossed the reading line, in document order. Markers
 * re-rendered by a language or filter change are picked up again.
 */
export function watchReached(
	selector: string,
	onChange: (reached: HTMLElement[]) => void
): Attachment<HTMLElement> {
	return (node) => {
		const article = node.closest<HTMLElement>('article.entry');
		if (!article) return;
		let raf = 0;
		let last = '';
		const pick = () => {
			raf = 0;
			const line = innerHeight * READING_LINE;
			const reached = [...article.querySelectorAll<HTMLElement>(selector)].filter(
				(el) => el.getBoundingClientRect().top <= line
			);
			const sig = reached.map((el) => el.dataset.mark ?? '').join('|');
			if (sig === last) return;
			last = sig;
			onChange(reached);
		};
		const schedule = () => {
			if (!raf) raf = requestAnimationFrame(pick);
		};
		const mo = new MutationObserver(schedule);
		mo.observe(article, { childList: true, subtree: true });
		pick();
		addEventListener('scroll', schedule, { passive: true });
		addEventListener('resize', schedule);
		return () => {
			if (raf) cancelAnimationFrame(raf);
			mo.disconnect();
			removeEventListener('scroll', schedule);
			removeEventListener('resize', schedule);
		};
	};
}
