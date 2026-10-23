/**
 * Message bubbles arrive one after another, like a chat coming in. Each
 * dialogue's bubbles stagger, and dialogues that come on screen together queue
 * behind each other instead of landing at once.
 *
 * Most bubbles pop up from their tail the same way; a line's tone picks its own
 * entrance, as iMessage effects do (`data-tone` on the `.msg`): a shout swells
 * huge and settles, a shout in a battle or massacre slams down, a trailing
 * whisper drifts in, a line in parentheses clears like invisible ink.
 *
 * Progressive enhancement, as in `reveal`: the hidden state is a class set from
 * JS, only while the reader's "Animated" setting is on.
 */
import type { Attachment } from 'svelte/attachments';
import { animating } from '$lib/motionUi.svelte';

export type BubbleTone = 'pop' | 'loud' | 'slam' | 'gentle' | 'ink';

/** Gap between two bubbles, in ms. */
const STEP = 160;
/** How much longer than a plain pop each tone holds the queue, in ms. */
const HOLD: Record<BubbleTone, number> = { pop: 0, loud: 520, slam: 380, gentle: 360, ink: 900 };
/** Longest a dialogue waits in the queue, so a jump never leaves bubbles blank for long. */
const MAX_WAIT = 480;
/** Scenes loud enough that a shout lands as a slam. */
const VIOLENT = new Set(['embers', 'storm', 'blood']);

let io: IntersectionObserver | null = null;
/** When the queue is free for the next bubble (performance.now() time). */
let freeAt = 0;

/** A line's tone, from its words and the weather of its scene. */
export function toneOf(text: string, weather?: string): BubbleTone {
	const t = text.trim();
	if (!t) return 'pop';
	if (/^[(（][^()（）]*[)）]$/.test(t)) return 'ink';
	const shout = /!{2,}|！{2,}/.test(t) || /\b[A-Z]{4,}\b/.test(t) || (/[!！]/.test(t) && t.length <= 28);
	if (shout) return weather && VIOLENT.has(weather) && t.length <= 40 ? 'slam' : 'loud';
	if (/^(…|\.\.\.)|(…|\.\.\.)$/.test(t) && t.length <= 60) return 'gentle';
	return 'pop';
}

function arrive(entries: IntersectionObserverEntry[]) {
	const hits = entries
		.filter((e) => e.isIntersecting)
		.map((e) => e.target as HTMLElement)
		.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
	const now = performance.now();
	for (const el of hits) {
		io?.unobserve(el);
		const start = Math.min(Math.max(now, freeAt), now + MAX_WAIT);
		let at = start - now;
		for (const m of el.querySelectorAll<HTMLElement>('.msg')) {
			const lead = m.querySelector('.lead') ?? m;
			const tone = toneOf(lead.textContent ?? '', el.dataset.sky);
			m.dataset.tone = tone;
			m.style.setProperty('--float-delay', `${at}ms`);
			at += STEP + HOLD[tone];
		}
		freeAt = now + Math.max(at, STEP);
		el.classList.add('float-in');
	}
}

export const floatIn: Attachment<HTMLElement> = (node) => {
	if (typeof IntersectionObserver === 'undefined' || !animating()) return;
	io ??= new IntersectionObserver(arrive, { rootMargin: '0px 0px -8% 0px' });
	node.classList.add('float-pending');
	io.observe(node);
	return () => {
		io?.unobserve(node);
		node.classList.remove('float-pending', 'float-in');
		for (const m of node.querySelectorAll<HTMLElement>('.msg')) delete m.dataset.tone;
	};
};
