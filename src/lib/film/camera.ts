/**
 * Where the stage camera stands at any moment of the film: a shot is a site
 * view plus a drift, and the entrances (a flight across the same site, a climb
 * out of one place and a descent into the next, a push through a door) blend
 * one pose into the next. Pure math, so scrubbing moves the camera too.
 */
import type { Label, StageDrive, View } from '$lib/stage/build';
import type { StageShot } from './types';
import { easeInOut, progress, smooth, type Shot } from './timeline';

type V3 = [number, number, number];
export type Pose = { pos: V3; target: V3; fov: number };

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const mix = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

function turnY(v: V3, rad: number): V3 {
	const c = Math.cos(rad);
	const s = Math.sin(rad);
	return [v[0] * c - v[2] * s, v[1], v[0] * s + v[2] * c];
}

export type SiteFrame = { views: View[]; labels: Label[] };

/** The view a shot starts from. `*` takes the site's angles in turn (not the plan). */
function baseOf(shot: StageShot, frame: SiteFrame, n: number): Pose | null {
	if (shot.label) {
		const l = frame.labels.find((x) => x.id === shot.label);
		const ref = frame.views.find((v) => v.id === 'board') ?? frame.views[0];
		if (l && ref) {
			const aim: V3 = [l.at[0], l.at[1] - 3, l.at[2]];
			const back = sub(ref.pos as V3, ref.target as V3);
			const dist = Math.min(220, Math.max(60, len(back) * 0.12));
			const off = scale(back, dist / (len(back) || 1));
			if (off[1] < dist * 0.25) off[1] = dist * 0.3;
			return { pos: add(aim, off), target: aim, fov: shot.fov ?? 40 };
		}
	}
	const pool = frame.views.filter((v) => v.id !== 'plan');
	const v =
		(shot.view && shot.view !== '*' ? frame.views.find((x) => x.id === shot.view) : undefined) ??
		(pool.length ? pool[n % pool.length] : frame.views[0]);
	if (!v) return null;
	return { pos: [...v.pos] as V3, target: [...v.target] as V3, fov: shot.fov ?? v.fov ?? 40 };
}

/** The camera `k` of the way through a shot. */
export function shotPose(shot: StageShot, frame: SiteFrame, n: number, k: number): Pose | null {
	const base = baseOf(shot, frame, n);
	if (!base) return null;
	const e = smooth(Math.min(1, Math.max(0, k)));
	let off = sub(base.pos, base.target);
	const dist = len(off);
	off = turnY(off, (((shot.orbit ?? 0) * Math.PI) / 180) * (e - 0.5));
	off = scale(off, 1 - (shot.dolly ?? 0) * e);
	off[1] += dist * (shot.rise ?? 0) * e;
	return { pos: add(base.target, off), target: base.target, fov: base.fov };
}

/** A camera lifted straight up off a pose, for the climb out of a place. */
function lifted(p: Pose, by: number): Pose {
	const d = len(sub(p.pos, p.target));
	return { pos: add(p.pos, [0, d * by + 400, 0]), target: add(p.target, [0, d * by * 0.4, 0]), fov: p.fov };
}

/** A moving pose, written into the stage's drive. */
export function poseInto(drive: StageDrive, p: Pose): void {
	drive.on = true;
	drive.pos[0] = p.pos[0];
	drive.pos[1] = p.pos[1];
	drive.pos[2] = p.pos[2];
	drive.target[0] = p.target[0];
	drive.target[1] = p.target[1];
	drive.target[2] = p.target[2];
	drive.fov = p.fov;
}

/**
 * The stage camera at `t`. `prev` is the stage shot before this one (for a
 * flight across the same site). Travel rises out of one site as it goes dark
 * and settles into the next as it comes up.
 */
export function cameraAt(shot: Shot, prev: Shot | undefined, frame: SiteFrame, t: number, reduce: boolean): Pose | null {
	if (shot.visual.kind !== 'stage') return null;
	const k = progress(t, shot.t0, shot.t1);
	const now = shotPose(shot.visual.shot, frame, shot.i, k);
	if (!now || reduce || shot.tin <= 0) return now;
	const u = progress(t, shot.t0, shot.t0 + shot.tin);
	if (u >= 1) return now;
	if (shot.enter === 'travel') {
		const down = smooth(progress(u, 0.5, 1));
		return blendPose(lifted(now, 0.9), now, easeInOut(down));
	}
	if (shot.enter === 'fly' && prev?.visual.kind === 'stage') {
		const from = shotPose(prev.visual.shot, frame, prev.i, 1);
		if (!from) return now;
		const e = easeInOut(u);
		const p = blendPose(from, now, e);
		const hop = len(sub(from.pos, now.pos));
		p.pos[1] += Math.sin(Math.PI * e) * Math.min(260, hop * 0.22);
		return p;
	}
	return now;
}

/** The previous shot carried on past its end: the climb out of a site before travel, the push through a door. */
export function exitPose(prev: Shot, next: Shot, frame: SiteFrame, t: number): Pose | null {
	if (prev.visual.kind !== 'stage') return null;
	const end = shotPose(prev.visual.shot, frame, prev.i, 1);
	if (!end) return null;
	const u = progress(t, next.t0, next.t0 + next.tin);
	if (next.enter === 'travel') return blendPose(end, lifted(end, 0.9), easeInOut(progress(u, 0, 0.46)));
	if (next.enter === 'door') {
		const e = easeInOut(progress(u, 0, 0.6));
		return { pos: mix(end.pos, end.target, 0.85 * e), target: end.target, fov: end.fov - 8 * e };
	}
	return end;
}

function blendPose(a: Pose, b: Pose, k: number): Pose {
	return { pos: mix(a.pos, b.pos, k), target: mix(a.target, b.target, k), fov: a.fov + (b.fov - a.fov) * k };
}
