/**
 * What the screen shows at one moment of a film. Pure: the player scrubs by
 * asking again, and the camera, the crossfade and the lids all follow.
 *
 * Every picture lives on one of three layers (the 3D stage, the map, the
 * plates of stills and shadow boxes). A cut between layers is a dissolve: the
 * picture on top fades while the one beneath stays whole, so nothing else
 * shows through in between. A stage that has not built yet keeps the old
 * picture up until it can be seen.
 */
import { LIGHT_HOUR } from '$lib/stage/placeStage';
import { STAGE_SITES, type StageSiteId } from '$lib/stage/sites';
import type { StageStyle } from '$lib/stage/post';
import { cameraAt, exitPose, type Pose, type SiteFrame } from './camera';
import { descentFx, type MapShow, type Pt } from './mapPlan';
import { indexAt, progress, smooth, type Cue, type Shot, type Timeline } from './timeline';
import type { Film, Fx, MapFocus, PlateMove, Visual } from './types';
import type { PaperId } from './paper/scenes';

export type { MapShow } from './mapPlan';

export type PlateShow = {
	key: string;
	src: string;
	id?: string;
	/** A shadow box drawn live in place of the image. */
	paper?: PaperId;
	move: PlateMove;
	/** 0…1 through the shot, for the drift across the picture. */
	k: number;
	/** Film seconds, for the loops inside a shadow box. */
	t: number;
	opacity: number;
};

export type StageShow = {
	site: StageSiteId;
	year: number;
	hour: number;
	look: StageStyle;
	people: boolean;
	opacity: number;
	pose: Pose | null;
	/** 0…1 of the site risen out of the ground, on the film clock; null leaves the stage its own rise. */
	rise: number | null;
};

export type Show = {
	plates: PlateShow[];
	stage: StageShow | null;
	map: MapShow | null;
	/** 1: the lids are shut. 0: the eyes are open. */
	wake: number;
	ink: number;
	/** 0: the iris is shut. 1: the picture is clear. */
	iris: number;
	flash: number;
	/** The inverted impact frame of a hit. */
	impact: boolean;
	/** Pixels the frame is knocked off centre. */
	shake: Pt;
	/** 1: the picture has gone to black. */
	black: number;
	memory: boolean;
	blur: number;
	fx: Fx[];
	cue: Cue | null;
	label: string;
	ko?: string;
};

type Layer = 'stage' | 'map' | 'plate' | 'none';

/** Bottom to top, as the player stacks them. */
const DEPTH: Record<Layer, number> = { stage: 0, map: 1, plate: 2, none: 3 };

function layerOf(v: Visual): Layer {
	if (v.kind === 'stage') return 'stage';
	if (v.kind === 'peninsula' || v.kind === 'road' || v.kind === 'descent') return 'map';
	if (v.kind === 'still' || v.kind === 'paper') return 'plate';
	return 'none';
}

/** The map waits mounted under other pictures if it comes back within this many seconds. */
const MAP_KEEP = 40;
/** A stage starts building this long before its shot. */
const STAGE_AHEAD = 1.8;

const hourOf = (id: StageSiteId, given?: number) => given ?? LIGHT_HOUR[STAGE_SITES.find((s) => s.id === id)?.light ?? 'day'];

function spec(shot: Shot, film: Film) {
	const v = shot.visual;
	if (v.kind !== 'stage') return null;
	const set = shot.set.kind === 'stage' ? shot.set : null;
	const site = v.site ?? set?.site;
	if (!site) return null;
	const foreign = set != null && v.site != null && v.site !== set.site;
	return {
		site,
		year: v.year ?? set?.year ?? film.year,
		hour: hourOf(site, v.hour ?? (foreign ? undefined : set?.hour)),
		look: (foreign ? film.look : set?.look) ?? film.look,
		people: v.people ?? set?.people ?? false
	};
}

function plateOf(shot: Shot | undefined): { src: string; id?: string; paper?: PaperId; move: PlateMove } | null {
	const v = shot?.visual;
	if (v?.kind === 'paper') return { src: '', paper: v.scene, move: 'still' };
	if (v?.kind !== 'still' || !v.src) return null;
	return { src: v.src, id: v.id, move: v.move };
}

/** How far the incoming picture has come in, 0…1, before any wait on the stage. */
function opened(shot: Shot, u: number, reduce: boolean): number {
	if (reduce || shot.tin <= 0 || shot.enter === 'cut') return 1;
	if (shot.enter === 'flash') return u < 0.42 ? 0 : 1;
	if (shot.enter === 'wake' || shot.enter === 'ink' || shot.enter === 'iris') return 1;
	if (shot.enter === 'travel') return smooth(progress(u, 0.52, 0.96));
	if (shot.enter === 'door') return smooth(progress(u, 0.5, 0.9));
	return smooth(u);
}

function band(u: number, a: number, b: number, c: number, d: number): number {
	return Math.min(smooth(progress(u, a, b)), 1 - smooth(progress(u, c, d)));
}

/** The focus the map camera was last at before shot `i`, so the next map shot eases on from there. */
function lastFocus(tl: Timeline, i: number): MapFocus {
	for (let j = i - 1; j >= 0; j--) {
		const v = tl.shots[j].visual;
		if (v.kind === 'peninsula') return v.focus;
		if (v.kind === 'road' || v.kind === 'descent') return 'wide';
	}
	return 'wide';
}

function mapOf(film: Film, tl: Timeline, shot: Shot, k: number, t: number, opacity: number, active: boolean): MapShow {
	const v = shot.visual;
	const base = {
		year: film.year,
		paint: 'none' as const,
		opacity,
		focus: 'wide' as const,
		from: 'wide' as const,
		arrows: false as const,
		k,
		t,
		secs: shot.t1 - shot.t0,
		active
	};
	if (v.kind === 'road') return { ...base, mode: 'road', step: v.step };
	if (v.kind === 'descent') return { ...base, mode: 'descent' };
	if (v.kind !== 'peninsula') return { ...base, mode: 'peninsula' };
	return {
		...base,
		mode: 'peninsula',
		year: v.year ?? film.year,
		paint: v.paint ?? 'none',
		lit: v.lit,
		focus: v.focus,
		from: lastFocus(tl, shot.i),
		arrows: v.arrows ?? false
	};
}

/** The nearest map shot ahead of `i` that starts within `ahead` seconds of `t`. */
function nextMap(tl: Timeline, i: number, t: number, ahead: number): Shot | null {
	for (let j = i + 1; j < tl.shots.length; j++) {
		const s = tl.shots[j];
		if (s.t0 - t > ahead) return null;
		if (layerOf(s.visual) === 'map') return s;
	}
	return null;
}

export function present(
	film: Film,
	tl: Timeline,
	t: number,
	built: { site: string; frame: SiteFrame } | null,
	reduce: boolean
): Show {
	const si = indexAt(tl.shots, t);
	const shot = si >= 0 ? tl.shots[si] : undefined;
	const prev = si > 0 ? tl.shots[si - 1] : undefined;
	const cueAt = indexAt(tl.cues, t);
	const cue = cueAt >= 0 && t >= tl.cues[cueAt].t0 && t < tl.cues[cueAt].t1 ? tl.cues[cueAt] : null;
	const scene = shot ? film.scenes[shot.scene] : undefined;
	const empty: Show = {
		plates: [],
		stage: null,
		map: null,
		wake: 0,
		ink: 0,
		iris: 1,
		flash: 0,
		impact: false,
		shake: [0, 0],
		black: 0,
		memory: false,
		blur: 0,
		fx: [],
		cue: null,
		label: ''
	};
	if (!shot || !scene) return empty;

	const kOf = (s: Shot) => (reduce ? 0 : progress(t, s.t0, s.t1));
	const u = shot.tin > 0 ? progress(t, shot.t0, shot.t0 + shot.tin) : 1;
	const into = layerOf(shot.visual);
	const from = prev && u < 1 && !reduce && shot.enter !== 'cut' ? layerOf(prev.visual) : 'none';

	// the stage this moment needs: the one in the shot, the one being left, or the next one building ahead
	const curSpec = spec(shot, film);
	const prevSpec = prev ? spec(prev, film) : null;
	const sameSite = curSpec && prevSpec && curSpec.site === prevSpec.site && curSpec.year === prevSpec.year;
	const posed = (site: string) => !!built && built.site === site;

	let inn = opened(shot, u, reduce);
	if (into === 'stage' && curSpec && !posed(curSpec.site)) inn = 0;
	// leaving one site for another: the old one goes dark first, then the new one comes up
	const dip = from === 'stage' && into === 'stage' && !sameSite;
	let leaving = 1;
	let arriving = inn;
	if (dip) leaving = 1 - smooth(progress(u, 0.06, 0.46));
	else if (from !== 'none' && from !== into && (into === 'none' || DEPTH[into] < DEPTH[from])) {
		// the new picture waits whole underneath while the old one fades off it
		leaving = 1 - inn;
		arriving = 1;
	}

	let stage: StageShow | null = null;
	const riseOf = (s: Shot) => (s.visual.kind === 'stage' && s.visual.shot.build ? (reduce ? 1 : smooth(progress(t, s.t0 + 0.15, s.t0 + 3.6))) : null);
	if (into === 'stage' && curSpec && !(dip && u < 0.5)) {
		const pose = posed(curSpec.site) ? cameraAt(shot, prev, built!.frame, t, reduce) : null;
		const opacity = dip ? (pose ? smooth(progress(u, 0.54, 0.96)) : 0) : pose ? (from === 'stage' ? 1 : arriving) : 0;
		stage = { ...curSpec, opacity, pose, rise: riseOf(shot) };
	} else if (from === 'stage' && prevSpec && prev) {
		const pose = posed(prevSpec.site) ? exitPose(prev, shot, built!.frame, t) : null;
		stage = { ...prevSpec, opacity: pose ? leaving : 0, pose, rise: null };
	} else {
		const next = tl.shots[shot.i + 1];
		const pre = next && next.t0 - t < STAGE_AHEAD ? spec(next, film) : null;
		if (pre && next) {
			const pose = posed(pre.site) ? cameraAt(next, shot, built!.frame, next.t0, true) : null;
			stage = { ...pre, opacity: 0, pose, rise: riseOf(next) == null ? null : 0 };
		}
	}

	const plates: PlateShow[] = [];
	const prevPlate = from === 'plate' ? plateOf(prev) : null;
	if (prevPlate && leaving > 0.01) plates.push({ key: `p-${prev!.i}`, ...prevPlate, k: 1, t, opacity: leaving });
	const curPlate = plateOf(shot);
	if (curPlate && arriving > 0.01) plates.push({ key: `p-${shot.i}`, ...curPlate, k: kOf(shot), t, opacity: arriving });

	let map: MapShow | null = null;
	if (into === 'map') map = mapOf(film, tl, shot, reduce ? 1 : kOf(shot), t, from === 'map' ? 1 : arriving, true);
	else if (from === 'map' && prev) map = mapOf(film, tl, prev, 1, t, leaving, true);
	else {
		const ahead = nextMap(tl, shot.i, t, MAP_KEEP);
		let back = false;
		for (let j = shot.i - 1; j >= 0 && t - tl.shots[j].t1 < MAP_KEEP; j--) {
			if (layerOf(tl.shots[j].visual) === 'map') {
				back = true;
				break;
			}
		}
		if (ahead && (back || ahead.t0 - t < 3)) map = mapOf(film, tl, ahead, 0, ahead.t0, 0, false);
	}

	let flash = reduce ? 0 : shot.enter === 'flash' ? Math.sin(Math.min(1, u) * Math.PI) : shot.enter === 'door' ? band(u, 0.38, 0.5, 0.62, 0.86) : 0;
	let blur = !reduce && shot.enter === 'wake' ? (1 - smooth(u)) * 14 : 0;
	let impact = false;
	let shake: Pt = [0, 0];
	let black = 0;
	if (shot.visual.kind === 'descent' && !reduce) {
		const d = descentFx(kOf(shot), t);
		flash = Math.max(flash, d.flash);
		impact = d.impact;
		shake = d.shake;
		blur = Math.max(blur, d.blur);
		black = d.black;
	}

	const fx = [...scene.fx];
	const add = (list?: Fx[]) => {
		for (const f of list ?? []) if (!fx.some((x) => x.id === f.id)) fx.push(f);
	};
	add(shot.fx);
	if (cue && cue.scene === shot.scene && cue.t0 >= shot.t0) add(cue.beat.fx);

	const mark = tl.scenes[shot.scene];
	return {
		plates,
		stage,
		map,
		wake: !reduce && shot.enter === 'wake' ? 1 - smooth(u) : 0,
		ink: !reduce && shot.enter === 'ink' ? 1 - smooth(u) : 0,
		iris: !reduce && shot.enter === 'iris' ? smooth(u) : 1,
		flash,
		impact,
		shake,
		black,
		memory: shot.memory,
		blur,
		fx,
		cue,
		label: mark?.label ?? '',
		ko: mark?.ko
	};
}
