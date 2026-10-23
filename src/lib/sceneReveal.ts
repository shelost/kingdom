/**
 * The script arrives as it scrolls in, in the manner of its scene: battle
 * lines snap in (a shouted one shakes), romance blooms out of a blur, grief
 * fades in slowly, a massacre slams in red, anything else rises gently.
 * Scene plates wipe in.
 *
 * Progressive enhancement, as in `reveal`: the hidden state is a class set from
 * JS, only while the reader's "Animated" setting is on. One shared observer
 * watches every line, and a watchdog shows everything if it never reports.
 */
import type { Attachment } from 'svelte/attachments';
import { animating } from '$lib/motionUi.svelte';
import type { TextMood } from '$lib/sceneMood';
import './sceneReveal.css';

/** Longer than the slowest entrance (grief, 1.6s), so nothing is cut short. */
const SETTLE_MS = 2000;

const shows = new Map<Element, () => void>();
let io: IntersectionObserver | null = null;
let alive = false;
let watchdog: ReturnType<typeof setTimeout> | undefined;

function observer(): IntersectionObserver {
	io ??= new IntersectionObserver(
		(entries) => {
			alive = true;
			clearTimeout(watchdog);
			for (const e of entries) {
				if (!e.isIntersecting) continue;
				shows.get(e.target)?.();
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
	);
	return io;
}

function armWatchdog() {
	if (alive || watchdog !== undefined) return;
	watchdog = setTimeout(() => {
		if (alive) return;
		for (const show of [...shows.values()]) show();
	}, 1500);
}

/** Attachment: hide the node until it scrolls in, then play its mood's entrance once. */
export function sceneReveal(mood: TextMood): Attachment<HTMLElement> {
	return (node) => {
		if (!animating() || typeof IntersectionObserver === 'undefined') return;
		node.dataset.reveal = mood;
		if ((mood === 'battle' || mood === 'impact') && /!/.test(node.textContent ?? '')) node.dataset.shout = '';
		node.classList.add('sr-pending');
		let settle: ReturnType<typeof setTimeout> | undefined;
		const clear = () => {
			node.classList.remove('sr-pending', 'sr-in');
			delete node.dataset.reveal;
			delete node.dataset.shout;
		};
		const show = () => {
			shows.delete(node);
			io?.unobserve(node);
			node.classList.replace('sr-pending', 'sr-in');
			/* Once played, hand the node back to its own styles (cinema's speaking line has transitions). */
			settle = setTimeout(clear, SETTLE_MS);
		};
		shows.set(node, show);
		observer().observe(node);
		armWatchdog();
		return () => {
			clearTimeout(settle);
			shows.delete(node);
			io?.unobserve(node);
			clear();
		};
	};
}
