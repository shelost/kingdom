/** Turns beats + cast into a cut list. Pure, so preview and recording draw the same frames. */

import type { Beats } from './beats';
import { rng } from '$lib/stage/build/geo';

export type IntroPerson = {
	id: string;
	name: string;
	weight: number;
	/** Base portrait first, then stage looks. */
	portraits: string[];
	stills: string[];
};

export type CutKind = 'slow' | 'fast' | 'hold' | 'logo';

export type Cut = {
	t: number;
	frame: number;
	person: string;
	kind: CutKind;
	/** 0..1 flash on the cut. */
	hit: number;
	/** Pan direction and push seed, -1..1. */
	dx: number;
	dy: number;
};

export type Plan = {
	frames: string[];
	cuts: Cut[];
	start: number;
	drop: number;
	/** The box starts closing. */
	logo: number;
	end: number;
};

export const HOLD = 0.55;
export const CLOSE = 0.9;
export const LOGO_TAIL = 2.6;
const FAST_FROM = 0.24;
const FAST_TO = 0.065;

/** Portrait first, then stills with the other looks mixed in, cycling. */
function sequence(p: IntroPerson): string[] {
	const extra = p.portraits.slice(1);
	const out = [p.portraits[0]];
	const step = extra.length ? Math.max(2, Math.floor(p.stills.length / extra.length)) : 0;
	let e = 0;
	p.stills.forEach((s, i) => {
		out.push(s);
		if (step && (i + 1) % step === 0 && e < extra.length) out.push(extra[e++]);
	});
	while (e < extra.length) out.push(extra[e++]);
	return out;
}

/** Split `n` slots across people by weight, in order; nobody gets zero while slots remain. */
function share(people: IntroPerson[], n: number): number[] {
	const total = people.reduce((s, p) => s + p.weight, 0) || 1;
	const counts = people.map((p) => Math.max(1, Math.floor((n * p.weight) / total)));
	let left = n - counts.reduce((a, b) => a + b, 0);
	for (let i = 0; left > 0; i = (i + 1) % people.length, left--) counts[i]++;
	for (let i = people.length - 1; left < 0 && i >= 0; i--) {
		while (counts[i] > 1 && left < 0) {
			counts[i]--;
			left++;
		}
	}
	return counts;
}

function nearest(onsets: number[], t: number, within: number): number | null {
	let best: number | null = null;
	for (let i = 0; i < onsets.length; i++) {
		const d = Math.abs(onsets[i] - t);
		if (d <= within && (best === null || d < Math.abs(onsets[best] - t))) best = i;
		if (onsets[i] > t + within) break;
	}
	return best;
}

function slowTimes(beats: Beats, start: number, drop: number, count: number): number[] {
	const span = drop - start;
	const out: number[] = [];
	for (let i = 0; i < count; i++) {
		const want = start + (span * i) / count;
		const k = i === 0 ? null : nearest(beats.onsets, want, Math.min(0.25, span / count / 3));
		out.push(k === null ? want : beats.onsets[k]);
	}
	return out;
}

/** Cuts shrink from FAST_FROM to FAST_TO seconds, snapping to onsets that land close. */
function fastTimes(beats: Beats, from: number, to: number): { t: number; hit: number }[] {
	const first = nearest(beats.onsets, from, 0.02);
	const out = [{ t: from, hit: first === null ? 1 : Math.max(0.6, beats.strength[first]) }];
	let t = from;
	while (true) {
		const u = (t - from) / (to - from);
		const gap = FAST_FROM + (FAST_TO - FAST_FROM) * Math.pow(u, 0.7);
		const k = nearest(beats.onsets, t + gap, gap * 0.4);
		const snap = k !== null && beats.onsets[k] > t + gap * 0.5 ? k : null;
		t = snap !== null ? beats.onsets[snap] : t + gap;
		if (t > to - FAST_TO * 0.5) break;
		out.push({ t, hit: snap !== null ? beats.strength[snap] : 0.1 });
	}
	return out;
}

export function plan(
	beats: Beats,
	opening: IntroPerson[],
	cast: IntroPerson[],
	finale: IntroPerson | null,
	opts: { start?: number; drop?: number; after?: number; seed?: number } = {}
): Plan {
	const rand = rng(opts.seed ?? 612);
	const start = opts.start ?? 0;
	const drop = Math.max(start + 1.5, opts.drop ?? beats.drop);
	const end = Math.min(beats.duration, drop + (opts.after ?? 13));
	const logo = end - LOGO_TAIL - CLOSE;
	const holdAt = logo - HOLD;

	const frames: string[] = [];
	const index = new Map<string, number>();
	const frameOf = (src: string) => {
		let i = index.get(src);
		if (i === undefined) {
			i = frames.push(src) - 1;
			index.set(src, i);
		}
		return i;
	};
	const cuts: Cut[] = [];
	const push = (t: number, src: string, person: string, kind: CutKind, hit: number) =>
		cuts.push({ t, frame: frameOf(src), person, kind, hit, dx: rand() * 2 - 1, dy: rand() * 2 - 1 });

	const slowCount = Math.min(opening.length * 3, Math.max(opening.length, Math.round((drop - start) / 0.9)));
	const slow = slowTimes(beats, start, drop, slowCount);
	let s = 0;
	share(opening, slow.length).forEach((n, i) => {
		const seq = sequence(opening[i]);
		for (let k = 0; k < n; k++) push(slow[s++], seq[k % seq.length], opening[i].id, 'slow', 0);
	});

	const fast = fastTimes(beats, drop, holdAt);
	const runners = finale ? [...cast, { ...finale, weight: finale.weight * 2 }] : cast;
	let f = 0;
	share(runners, fast.length).forEach((n, i) => {
		const seq = sequence(runners[i]);
		const isFinale = finale && i === runners.length - 1;
		for (let k = 0; k < n; k++) {
			const src = isFinale ? seq[(k + 1) % seq.length] : seq[k % seq.length];
			push(fast[f].t, src, runners[i].id, 'fast', fast[f].hit);
			f++;
		}
	});

	if (finale) push(holdAt, finale.portraits[0], finale.id, 'hold', 1);

	const everyone = [...opening, ...cast, ...(finale ? [finale] : [])];
	const pool = everyone.flatMap((p) => sequence(p).map((src) => ({ src, id: p.id })));
	for (let t = logo; t < logo + CLOSE && pool.length; t += FAST_TO) {
		const pick = pool[Math.floor(rand() * pool.length)];
		push(t, pick.src, pick.id, 'logo', 0.2);
	}

	return { frames, cuts, start, drop, logo, end };
}

/** Index of the cut showing at `t`, or -1 before the first. */
export function cutAt(cuts: Cut[], t: number): number {
	let lo = 0;
	let hi = cuts.length - 1;
	let found = -1;
	while (lo <= hi) {
		const mid = (lo + hi) >> 1;
		if (cuts[mid].t <= t) {
			found = mid;
			lo = mid + 1;
		} else hi = mid - 1;
	}
	return found;
}
