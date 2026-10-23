/**
 * Still motion: the prologue's opening myth beats, three founding stills and
 * seven emotion beats, and every other still by its scene mood (`slotMotion`).
 * Plays only while the reader's "Animated" setting is on (`$lib/motionUi`).
 *
 * A still with `motion` gets a camera move on its image and an overlay layer
 * (petals, leaves, smoke, snow, embers, coins, rain, feathers, a crack, mist,
 * a light sweep) that plays
 * each time it scrolls into view and resets when it leaves, so scrolling back
 * replays it. The emotion's one-word card (`EmotionWord`) reads its colour from
 * the same table, so a word and its still always agree.
 *
 * The hidden state is never applied without JS: overlays are created by the
 * attachment, and with reduced motion the frame shows its settled state.
 */

import type { Attachment } from 'svelte/attachments';
import type { Emotion, ImageSlot, StillMotion, Weather } from '$lib/story';
import { feather } from '$lib/feather';
import { animating } from '$lib/motionUi.svelte';
import { stillMood, type Mood } from '$lib/sceneMood';
import './stillMotion.css';

type Particle =
	| 'petal'
	| 'leaf'
	| 'spark'
	| 'ember'
	| 'coin'
	| 'rain'
	| 'feather'
	| 'star'
	| 'smoke'
	| 'snow'
	| 'blood'
	| 'heart'
	| 'ash'
	| 'mote';
type Extra = 'glow' | 'slash' | 'crack' | 'sweep' | 'break' | 'flash' | 'mist' | 'aura' | 'drip' | 'shade';

/**
 * Which plane of the full-screen weather an extra paints on. `front` sits over
 * the script, so only edge effects go there; everything else (particles, haze,
 * lightning) is `back`, behind the text, which it can never cover.
 */
export type Plane = 'back' | 'front';
const FRONT = new Set<Extra>(['aura', 'shade']);

interface MotionSpec {
	/** The beat's colour: overlay light, particles, and the word card. */
	tint: string;
	particles?: { kind: Particle; count: number }[];
	extras: Extra[];
}

export const MOTIONS: Record<StillMotion, MotionSpec> = {
	love: { tint: '#ff6b8b', particles: [{ kind: 'petal', count: 14 }], extras: ['glow'] },
	revenge: { tint: '#7aa7ff', particles: [{ kind: 'spark', count: 16 }], extras: ['slash'] },
	betrayal: { tint: '#9be27a', extras: ['crack', 'flash'] },
	greed: { tint: '#f2b83b', particles: [{ kind: 'coin', count: 14 }], extras: ['sweep'] },
	loyalty: { tint: '#e9e2c8', particles: [{ kind: 'rain', count: 28 }], extras: ['break'] },
	pride: { tint: '#ff8a3d', particles: [{ kind: 'feather', count: 9 }], extras: ['glow'] },
	rage: { tint: '#ff3b30', particles: [{ kind: 'ember', count: 22 }], extras: ['flash'] },
	tigers: { tint: '#e86820', particles: [{ kind: 'smoke', count: 10 }], extras: ['mist'] },
	heaven: { tint: '#f2dc9a', particles: [{ kind: 'star', count: 10 }], extras: ['break'] },
	birch: { tint: '#e3c27a', particles: [{ kind: 'leaf', count: 14 }], extras: ['glow'] },
	wanggum: { tint: '#d9b46a', extras: ['glow', 'sweep'] },
	invasion: { tint: '#ff3b30', particles: [{ kind: 'rain', count: 34 }], extras: ['flash'] },
	refugees: { tint: '#ff8a3d', particles: [{ kind: 'snow', count: 30 }], extras: [] },
	samhan: { tint: '#e9e2c8', extras: ['mist'] },
	generation: { tint: '#fff2c8', particles: [{ kind: 'star', count: 14 }], extras: ['break'] },
	goguryeo: { tint: '#e0412f', particles: [{ kind: 'ember', count: 12 }], extras: ['glow'] },
	silla: { tint: '#e9cf7a', particles: [{ kind: 'star', count: 12 }], extras: ['glow'] },
	baekje: { tint: '#f3d27a', particles: [{ kind: 'feather', count: 6 }], extras: ['sweep'] },
	battle: { tint: '#ff5a36', particles: [{ kind: 'ember', count: 18 }], extras: ['flash'] },
	duel: { tint: '#cfe0ff', particles: [{ kind: 'spark', count: 12 }], extras: ['slash'] },
	romance: { tint: '#ff8fab', particles: [{ kind: 'petal', count: 10 }], extras: ['glow'] },
	grief: { tint: '#9fb4d0', particles: [{ kind: 'rain', count: 22 }], extras: ['mist'] },
	fire: { tint: '#ff8a3d', particles: [{ kind: 'ember', count: 22 }], extras: ['glow'] },
	storm: { tint: '#dfe8ff', particles: [{ kind: 'rain', count: 34 }], extras: ['flash'] },
	snow: { tint: '#e8eef8', particles: [{ kind: 'snow', count: 30 }], extras: ['mist'] },
	night: { tint: '#f2dc9a', particles: [{ kind: 'star', count: 12 }], extras: ['break'] },
	drift: { tint: '#ffffff', extras: [] }
};

/** The full-screen layer over the script (`SceneWeather`): the same particles, many more of them. */
export const WEATHERS: Record<Weather, MotionSpec> = {
	embers: { tint: '#ff7a2e', particles: [{ kind: 'ember', count: 44 }], extras: ['glow'] },
	rain: { tint: '#b9cbe8', particles: [{ kind: 'rain', count: 90 }], extras: ['mist'] },
	storm: { tint: '#dfe8ff', particles: [{ kind: 'rain', count: 130 }], extras: ['mist', 'flash'] },
	snow: { tint: '#eef3fb', particles: [{ kind: 'snow', count: 70 }], extras: ['mist'] },
	blood: {
		tint: '#a3001b',
		particles: [
			{ kind: 'blood', count: 22 },
			{ kind: 'ash', count: 16 }
		],
		extras: ['aura', 'drip']
	},
	love: { tint: '#ff9fbf', particles: [{ kind: 'petal', count: 28 }], extras: ['glow'] },
	heat: {
		tint: '#ff6fae',
		particles: [
			{ kind: 'heart', count: 16 },
			{ kind: 'petal', count: 22 }
		],
		extras: ['aura', 'glow']
	},
	ash: { tint: '#b8b2aa', particles: [{ kind: 'ash', count: 54 }], extras: ['mist'] },
	mist: { tint: '#e9e2c8', particles: [{ kind: 'star', count: 10 }], extras: ['mist', 'glow'] },
	cavern: {
		tint: '#1f3f9e',
		particles: [
			{ kind: 'mote', count: 34 },
			{ kind: 'smoke', count: 8 }
		],
		extras: ['mist', 'aura']
	},
	beyond: { tint: '#bfe9ff', particles: [{ kind: 'mote', count: 26 }], extras: ['mist', 'shade'] }
};

/** Scene moods as still motions: a still with no words to go on still gets a slow camera drift. */
const BY_MOOD: Record<Mood, StillMotion> = {
	battle: 'battle',
	duel: 'duel',
	romance: 'romance',
	grief: 'grief',
	fire: 'fire',
	storm: 'storm',
	snow: 'snow',
	night: 'night',
	calm: 'drift'
};

/** The motion a still plays: its own `motion`, or one read off its words. */
export function slotMotion(slot: Pick<ImageSlot, 'id' | 'alt' | 'at' | 'nsfw' | 'motion'>): StillMotion {
	return slot.motion ?? BY_MOOD[stillMood(slot)];
}

export const EMOTIONS: readonly Emotion[] = ['love', 'revenge', 'betrayal', 'greed', 'loyalty', 'pride', 'rage'];

export function tintOf(motion: StillMotion): string {
	return MOTIONS[motion].tint;
}

/** Stable pseudo-random in [0, 1) so particle layouts do not jump between plays. */
function rand(seed: number): number {
	const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
	return x - Math.floor(x);
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function svg(viewBox: string, paths: { d: string; cls: string }[]): SVGSVGElement {
	const el = document.createElementNS(SVG_NS, 'svg');
	el.setAttribute('viewBox', viewBox);
	el.setAttribute('preserveAspectRatio', 'none');
	for (const p of paths) {
		const path = document.createElementNS(SVG_NS, 'path');
		path.setAttribute('d', p.d);
		path.setAttribute('class', p.cls);
		el.append(path);
	}
	return el;
}

const FEATHER = feather(12, 92, 0, 84);

/** A jagged fracture across the frame, as one path from edge to edge. */
const CRACK =
	'M-2,38L14,44L22,40L31,52L38,49L47,61L55,57L63,70L72,66L81,79L90,76L102,90M47,61L44,74L49,86M72,66L77,54L86,50';

function particleLayer(kind: Particle, count: number, seed = 0): HTMLElement {
	const layer = document.createElement('span');
	layer.className = `sm-particles sm-${kind}`;
	for (let n = 0; n < count; n++) {
		const i = n + seed;
		const p = document.createElement('i');
		p.style.setProperty('--x', `${(rand(i + 1) * 100).toFixed(1)}%`);
		p.style.setProperty('--y', `${(rand(i + 31) * 100).toFixed(1)}%`);
		p.style.setProperty('--d', `${(rand(i + 7) * 2.4).toFixed(2)}s`);
		p.style.setProperty('--s', (0.6 + rand(i + 13) * 0.9).toFixed(2));
		p.style.setProperty('--r', `${Math.round(rand(i + 19) * 360)}deg`);
		p.style.setProperty('--drift', `${((rand(i + 23) - 0.5) * 30).toFixed(1)}%`);
		if (kind === 'feather') {
			p.append(
				svg('0 0 24 100', [
					{ d: FEATHER.vane, cls: 'vane' },
					{ d: FEATHER.bars, cls: 'bars' },
					{ d: FEATHER.quill, cls: 'quill' }
				])
			);
		}
		layer.append(p);
	}
	return layer;
}

function extraLayer(extra: Extra): HTMLElement {
	const el = document.createElement('span');
	el.className = `sm-extra sm-${extra}`;
	if (extra === 'crack') el.append(svg('0 0 100 100', [{ d: CRACK, cls: 'crack' }]));
	if (extra === 'drip') {
		for (let i = 0; i < 9; i++) {
			const d = document.createElement('i');
			d.style.setProperty('--x', `${(4 + rand(i + 61) * 92).toFixed(1)}%`);
			d.style.setProperty('--d', `${(rand(i + 67) * 5).toFixed(2)}s`);
			d.style.setProperty('--s', (0.5 + rand(i + 71) * 1).toFixed(2));
			el.append(d);
		}
	}
	return el;
}

/**
 * One overlay of a spec's extras and particles; the caller sets `data-motion`
 * and `--sm-tint`. A `plane` keeps only what paints there (a still takes both).
 */
function overlayOf(spec: MotionSpec, plane?: Plane): HTMLElement {
	const overlay = document.createElement('span');
	overlay.className = 'sm-overlay';
	overlay.setAttribute('aria-hidden', 'true');
	for (const extra of spec.extras) {
		if (!plane || (plane === 'front') === FRONT.has(extra)) overlay.append(extraLayer(extra));
	}
	if (plane !== 'front') spec.particles?.forEach((p, i) => overlay.append(particleLayer(p.kind, p.count, i * 97)));
	return overlay;
}

/**
 * Attachment: toggles `data-play` while the node is on screen, and clears it
 * once the node has fully left, so the next visit plays again.
 */
export function playInView(threshold = 0.4): Attachment<HTMLElement> {
	return (node) => {
		if (!animating() || typeof IntersectionObserver === 'undefined') {
			node.dataset.play = 'settled';
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.intersectionRatio >= threshold) node.dataset.play = '';
					else if (!e.isIntersecting) delete node.dataset.play;
				}
			},
			{ threshold: [0, threshold] }
		);
		io.observe(node);
		return () => {
			io.disconnect();
			delete node.dataset.play;
		};
	};
}

/** Attachment for a still's frame: builds its overlay and plays it in view. No-op without a motion. */
export function stillMotion(motion: StillMotion | undefined): Attachment<HTMLElement> {
	return (node) => {
		if (!motion || !animating()) return;
		const spec = MOTIONS[motion];
		node.dataset.motion = motion;
		node.style.setProperty('--sm-tint', spec.tint);
		const overlay = overlayOf(spec);
		node.append(overlay);
		const stop = playInView(0.35)(node);
		return () => {
			stop?.();
			overlay.remove();
			delete node.dataset.motion;
			node.style.removeProperty('--sm-tint');
		};
	};
}

/** Attachment for one plane of the full-screen weather: builds that weather's overlay, always playing. */
export function weatherLayer(weather: Weather, plane: Plane): Attachment<HTMLElement> {
	return (node) => {
		const spec = WEATHERS[weather];
		node.dataset.motion = weather;
		node.dataset.play = '';
		node.style.setProperty('--sm-tint', spec.tint);
		const overlay = overlayOf(spec, plane);
		node.append(overlay);
		return () => overlay.remove();
	};
}
