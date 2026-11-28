/**
 * Lay a film out in seconds. Everything on screen is a pure function of the
 * clock, so the slider can drop anywhere and the speed can change mid-line.
 */
import type { Beat, FilmScene, FilmSet, Film, Fx, Transition, Visual } from './types';

export type Cue = { i: number; scene: number; beat: Beat; t0: number; t1: number };

/** One stretch of picture. `tin` is how long its entrance takes. */
export type Shot = {
	i: number;
	scene: number;
	visual: Visual;
	set: FilmSet;
	t0: number;
	t1: number;
	enter: Transition;
	tin: number;
	memory: boolean;
	/** The effects of the beat that brought this picture in. */
	fx?: Fx[];
};

export type SceneMark = { i: number; id: string; label: string; ko?: string; t0: number; t1: number };

export type Timeline = { cues: Cue[]; shots: Shot[]; scenes: SceneMark[]; duration: number };

/** Seconds each entrance takes. `travel` dips one 3D site to black and raises the next. */
export const TRANSITION_TIME: Record<Transition, number> = {
	cut: 0,
	fade: 1.1,
	flash: 0.7,
	wake: 3,
	ink: 1.4,
	iris: 1.1,
	fly: 2.6,
	travel: 2.2,
	door: 1.5
};

/** How much of an entrance plays before the scene's first words. */
const LEAD: Record<Transition, number> = {
	cut: 0,
	fade: 0.5,
	flash: 0.5,
	wake: 1,
	ink: 0.8,
	iris: 0.7,
	fly: 1,
	travel: 1.2,
	door: 1
};

/** A subtitle stays up until the next one, but not this much longer than its own reading time. */
const LINGER = 2.6;

/** Seconds a line stays up: time to read it after it floats in. */
export function holdOf(beat: Beat): number {
	if (beat.hold != null) return beat.hold;
	const text = beat.en || beat.ko;
	if (beat.kind === 'title') return text ? 2.4 : 0.6;
	if (!text) return 2.6;
	const base = beat.kind === 'card' ? 1.6 : 1.4;
	return Math.min(8, Math.max(2, base + text.length / 21));
}

/** The 3D site a picture stands in, if any. */
export function siteAt(v: Visual, set: FilmSet): string | null {
	if (v.kind !== 'stage') return null;
	return v.site ?? (set.kind === 'stage' ? set.site : null);
}

/**
 * A cut inside a scene: the stage camera flies between angles (or dips to another site),
 * the map's own camera carries one map shot into the next, everything else dissolves.
 */
function innerEnter(prev: Visual | undefined, prevSet: FilmSet | undefined, next: Visual, set: FilmSet): Transition {
	if (!prev || !prevSet) return 'fade';
	if (prev.kind === 'stage' && next.kind === 'stage') return siteAt(prev, prevSet) === siteAt(next, set) ? 'fly' : 'travel';
	if (prev.kind === 'peninsula' && next.kind === 'peninsula') return 'cut';
	if (prev.kind === 'road' && next.kind === 'road') return 'cut';
	return 'fade';
}

const INNER_TIME: Partial<Record<Transition, number>> = { fly: 1.8, fade: 0.9 };

const spoken = (beat: Beat) => !!(beat.en || beat.ko);

export function layout(film: Film): Timeline {
	const cues: Cue[] = [];
	const shots: Shot[] = [];
	const scenes: SceneMark[] = [];
	let t = 0;
	film.scenes.forEach((scene: FilmScene, si) => {
		const start = t;
		const tin = TRANSITION_TIME[scene.enter];
		t += Math.min(tin, LEAD[scene.enter]);
		scene.beats.forEach((beat, bi) => {
			let hold = holdOf(beat);
			if (beat.visual) {
				const first = bi === 0;
				const last = shots.at(-1);
				const auto = innerEnter(last?.visual, last?.set, beat.visual, scene.set);
				const enter = first ? scene.enter : (beat.enter ?? auto);
				const inner = beat.enter ? TRANSITION_TIME[enter] : (INNER_TIME[enter] ?? TRANSITION_TIME[enter]);
				// a long move inside a scene gets the time it needs before the next line cuts it off
				if (!first) hold = Math.max(hold, inner * 0.9);
				const t0 = first ? start : t;
				if (last) last.t1 = t0;
				shots.push({
					i: shots.length,
					scene: si,
					visual: beat.visual,
					set: scene.set,
					t0,
					t1: t0 + hold,
					enter,
					tin: first ? tin : inner,
					memory: scene.memory,
					fx: beat.fx
				});
			}
			if (spoken(beat)) cues.push({ i: cues.length, scene: si, beat, t0: t, t1: t + hold });
			t += hold;
		});
		const last = shots.at(-1);
		if (last) last.t1 = t;
		scenes.push({ i: si, id: scene.id, label: scene.label, ko: scene.ko, t0: start, t1: t });
	});
	// pictures without words no longer blank the subtitle: a line holds until the next one starts
	cues.forEach((cue, i) => {
		if (cue.beat.kind === 'title') return;
		const next = cues[i + 1]?.t0 ?? t;
		cue.t1 = Math.max(cue.t1, Math.min(next, cue.t1 + LINGER));
	});
	return { cues, shots, scenes, duration: t };
}

/** The last item whose `t0` is at or before `t`. */
export function indexAt<T extends { t0: number }>(list: T[], t: number): number {
	let lo = 0;
	let hi = list.length - 1;
	if (hi < 0) return -1;
	if (t < list[0].t0) return 0;
	while (lo < hi) {
		const mid = (lo + hi + 1) >> 1;
		if (list[mid].t0 <= t) lo = mid;
		else hi = mid - 1;
	}
	return lo;
}

/** 0…1 through a span. */
export function progress(t: number, t0: number, t1: number): number {
	return t1 > t0 ? Math.min(1, Math.max(0, (t - t0) / (t1 - t0))) : 1;
}

export const smooth = (k: number) => k * k * (3 - 2 * k);
export const easeInOut = (k: number) => (k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2);
