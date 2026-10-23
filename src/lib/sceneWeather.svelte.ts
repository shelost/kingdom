/**
 * The weather of whatever scene sits on the reading line, for the full-screen
 * layer (`SceneWeather.svelte`). Every script block carries its scene's weather
 * (`weatherMark`); one shared observer watches the middle fifth of the screen
 * and the last block to cross it sets the sky. In a massacre, each new line
 * that crosses it also throws a splatter and a red flash (`hit`); a line with a
 * `moment` (love at first sight, a reaper's arrival) fires it once.
 */
import type { Attachment } from 'svelte/attachments';
import type { Moment, Weather } from '$lib/story';
import type { SceneMood } from '$lib/sceneMood';
import { animating } from '$lib/motionUi.svelte';

export type Splat = { id: number; x: number; y: number; r: number; s: number };

/** At most one splatter this often, however fast the reader scrolls. */
const SPLAT_GAP_MS = 700;
/** How long a splatter stays (its CSS animation). */
const SPLAT_MS = 2600;
/** Splatters on screen at once. */
const SPLAT_MAX = 6;
/** How long a moment plays (its longest CSS animation). */
const MOMENT_MS: Record<Moment, number> = { 'first-sight': 3200, death: 3600 };

export const weatherUi = $state<{
	current: Weather | undefined;
	splats: Splat[];
	hit: number;
	moment: { kind: Moment; id: number } | undefined;
}>({
	current: undefined,
	splats: [],
	hit: 0,
	moment: undefined
});

const marks = new WeakMap<Element, SceneMood | undefined>();
/** Lines whose moment has played on this visit. */
const fired = new WeakSet<Element>();
let io: IntersectionObserver | undefined;
/** Blocks inside the band right now; the furthest down the script sets the sky. */
const inBand = new Set<Element>();
let lastNode: Element | undefined;
let lastSplat = 0;
let nextId = 0;

/** Edge-weighted spot: splatter lands near the frame, not over the line being read. */
function edge(): number {
	const v = Math.random() * 0.14;
	return Math.random() < 0.5 ? v : 1 - v;
}

function splatter() {
	const now = performance.now();
	if (now - lastSplat < SPLAT_GAP_MS) return;
	lastSplat = now;
	const id = ++nextId;
	weatherUi.splats = [
		...weatherUi.splats.slice(1 - SPLAT_MAX),
		{ id, x: edge() * 100, y: Math.random() * 100, r: Math.random() * 360, s: 0.7 + Math.random() * 0.8 }
	];
	weatherUi.hit = id;
	setTimeout(() => (weatherUi.splats = weatherUi.splats.filter((s) => s.id !== id)), SPLAT_MS);
}

function play(kind: Moment) {
	const id = ++nextId;
	weatherUi.moment = { kind, id };
	setTimeout(() => {
		if (weatherUi.moment?.id === id) weatherUi.moment = undefined;
	}, MOMENT_MS[kind]);
}

function observer(): IntersectionObserver {
	io ??= new IntersectionObserver(
		(entries) => {
			const arrived: Element[] = [];
			for (const e of entries) {
				if (e.isIntersecting) {
					inBand.add(e.target);
					arrived.push(e.target);
				} else inBand.delete(e.target);
			}
			if (!arrived.length) return;
			lastNode = [...inBand].reduce((a, b) =>
				a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? b : a
			);
			weatherUi.current = marks.get(lastNode)?.weather;
			if (!animating()) return;
			if (arrived.some((n) => marks.get(n)?.weather === 'blood')) splatter();
			for (const n of arrived) {
				const moment = marks.get(n)?.moment;
				if (!moment || fired.has(n)) continue;
				fired.add(n);
				play(moment);
			}
		},
		{ rootMargin: '-40% 0px -40% 0px' }
	);
	return io;
}

/** Attachment: this block's sky (none clears it) and any moment it fires, from its scene mood. */
export function weatherMark(mood: SceneMood | undefined): Attachment<HTMLElement> {
	return (node) => {
		if (typeof IntersectionObserver === 'undefined') return;
		marks.set(node, mood);
		if (mood?.weather) node.dataset.weather = mood.weather;
		const obs = observer();
		obs.observe(node);
		return () => {
			obs.unobserve(node);
			inBand.delete(node);
			marks.delete(node);
			delete node.dataset.weather;
			if (lastNode === node) {
				lastNode = undefined;
				weatherUi.current = undefined;
			}
		};
	};
}
