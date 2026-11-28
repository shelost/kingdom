/**
 * What the screen shows at one moment of a film. Pure: the player scrubs by
 * asking again, and the camera, the crossfade and the lids all follow.
 */
import { LIGHT_HOUR } from '$lib/stage/placeStage';
import { STAGE_SITES, type StageSiteId } from '$lib/stage/sites';
import type { StageStyle } from '$lib/stage/post';
import { cameraAt, exitPose, type Pose, type SiteFrame } from './camera';
import { indexAt, progress, smooth, type Cue, type Shot, type Timeline } from './timeline';
import type { Film, Fx, MapFocus, PlateMove } from './types';
import type { PaperId } from './paper/scenes';

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
};

export type MapShow = {
	mode: 'samhan' | 'road' | 'peninsula';
	step?: string;
	year: number;
	opacity: number;
	/** Where this shot finishes, and where the camera was when it started. */
	focus: MapFocus;
	from: MapFocus;
	arrows: 'draw' | 'hold' | false;
	mark?: string;
	/** 0…1 through the shot. The zoom, the arrows and the year all read this, so a scrub lands mid-move. */
	k: number;
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
	memory: boolean;
	blur: number;
	fx: Fx[];
	cue: Cue | null;
	label: string;
	ko?: string;
};

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

/** How open the incoming picture is, 0…1. */
function opened(shot: Shot, t: number, reduce: boolean): number {
	if (reduce || shot.tin <= 0 || shot.enter === 'cut') return 1;
	const u = progress(t, shot.t0, shot.t0 + shot.tin);
	if (shot.enter === 'travel') return smooth(progress(u, 0.62, 0.92));
	if (shot.enter === 'flash') return u < 0.42 ? 0 : 1;
	return smooth(u);
}

function band(u: number, a: number, b: number, c: number, d: number): number {
	return Math.min(smooth(progress(u, a, b)), 1 - smooth(progress(u, c, d)));
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
	const cue = cueAt >= 0 && t >= tl.cues[cueAt].t0 ? tl.cues[cueAt] : null;
	const scene = shot ? film.scenes[shot.scene] : undefined;
	const empty: Show = {
		plates: [],
		stage: null,
		map: null,
		wake: 0,
		ink: 0,
		iris: 1,
		flash: 0,
		memory: false,
		blur: 0,
		fx: [],
		cue: null,
		label: ''
	};
	if (!shot || !scene) return empty;

	const u = shot.tin > 0 ? progress(t, shot.t0, shot.t0 + shot.tin) : 1;
	const inn = opened(shot, t, reduce);
	const plates: PlateShow[] = [];
	const kOf = (s: Shot) => (reduce ? 0 : progress(t, s.t0, s.t1));

	const prevStill = plateOf(prev);
	if (prevStill && !reduce && shot.enter !== 'cut') {
		const leave =
			shot.enter === 'travel' ? 1 - smooth(progress(u, 0.04, 0.34)) : shot.enter === 'flash' ? (u < 0.42 ? 1 : 0) : 1 - inn;
		if (leave > 0.02) plates.push({ key: `out-${prev!.i}`, ...prevStill, k: 1, t, opacity: leave });
	}
	const curStill = plateOf(shot);
	if (curStill && inn > 0.02) plates.push({ key: `in-${shot.i}`, ...curStill, k: kOf(shot), t, opacity: inn });

	// The stage we should have built: the one the camera is in, or the next one waiting under a still.
	let mount = spec(shot, film);
	let stageOpacity = shot.visual.kind === 'stage' ? (shot.enter === 'travel' ? smooth(progress(u, 0.58, 0.86)) : inn) : 0;
	let poseMode: 'now' | 'exit' = 'now';
	const prevSpec = prev ? spec(prev, film) : null;
	if (!reduce && prevSpec && (shot.enter === 'travel' || shot.enter === 'door') && u < 0.5 && shot.visual.kind !== 'stage') {
		mount = prevSpec;
		stageOpacity = 1 - smooth(progress(u, shot.enter === 'door' ? 0.15 : 0.2, 0.48));
		poseMode = 'exit';
	} else if (!reduce && prevSpec && shot.enter === 'travel' && shot.visual.kind === 'stage' && u < 0.46) {
		mount = prevSpec;
		stageOpacity = 1 - smooth(progress(u, 0.22, 0.44));
		poseMode = 'exit';
	}
	const next = tl.shots[shot.i + 1];
	if (!mount && next && next.t0 - t < 1.6) {
		const pre = spec(next, film);
		if (pre) {
			mount = pre;
			stageOpacity = 0;
		}
	}

	let pose: Pose | null = null;
	if (mount && built && built.site === mount.site) {
		if (poseMode === 'exit' && prev) pose = exitPose(prev, shot, built.frame, t);
		else if (shot.visual.kind === 'stage') pose = cameraAt(shot, prev, built.frame, t, reduce);
		else if (next?.visual.kind === 'stage') pose = cameraAt(next, prev, built.frame, next.t0, true);
	}

	const destMap = shot.visual.kind === 'samhan' || shot.visual.kind === 'peninsula' || shot.visual.kind === 'road';
	let mapOpacity = 0;
	let map: MapShow | null = null;
	if (shot.enter === 'travel' && !reduce) {
		mapOpacity = destMap ? smooth(progress(u, 0.3, 0.62)) : band(u, 0.28, 0.44, 0.58, 0.74);
		if (mount && stageOpacity > 0 && !pose && u > 0.2 && u < 0.92) mapOpacity = Math.max(mapOpacity, 0.92);
	}
	if (destMap) mapOpacity = Math.max(mapOpacity, inn);
	if (mapOpacity > 0.02) {
		const k = reduce ? 1 : kOf(shot);
		const from: MapFocus = prev?.visual.kind === 'peninsula' ? prev.visual.focus : 'wide';
		if (shot.visual.kind === 'road') {
			map = { mode: 'road', step: shot.visual.step, year: film.year, opacity: mapOpacity, focus: 'wide', from, arrows: false, k };
		} else if (shot.visual.kind === 'peninsula') {
			map = {
				mode: 'peninsula',
				year: shot.visual.year ?? -108,
				opacity: mapOpacity,
				focus: shot.visual.focus,
				from,
				arrows: shot.visual.arrows ?? false,
				mark: shot.visual.mark,
				k
			};
		} else {
			map = {
				mode: 'samhan',
				year: shot.visual.kind === 'samhan' && shot.visual.year ? shot.visual.year : film.year,
				opacity: mapOpacity,
				focus: 'wide',
				from,
				arrows: false,
				mark: shot.visual.kind === 'samhan' ? shot.visual.mark : undefined,
				k
			};
		}
	}

	const fx = [...scene.fx];
	if (cue && cue.scene === shot.scene && cue.beat.fx) {
		for (const f of cue.beat.fx) if (!fx.some((x) => x.id === f.id)) fx.push(f);
	}

	const mark = tl.scenes[shot.scene];
	return {
		plates,
		stage: mount ? { ...mount, opacity: pose || stageOpacity === 0 ? stageOpacity : 0, pose } : null,
		map,
		wake: !reduce && shot.enter === 'wake' ? 1 - smooth(u) : 0,
		ink: !reduce && shot.enter === 'ink' ? 1 - smooth(u) : 0,
		iris: !reduce && shot.enter === 'iris' ? smooth(u) : 1,
		flash:
			reduce ? 0 : shot.enter === 'flash' ? Math.sin(Math.min(1, u) * Math.PI) : shot.enter === 'door' ? band(u, 0.42, 0.55, 0.7, 0.88) : 0,
		memory: shot.memory,
		blur: !reduce && shot.enter === 'wake' ? (1 - smooth(u)) * 14 : 0,
		fx,
		cue: cue && t + 0.05 >= cue.t0 ? cue : null,
		label: mark?.label ?? '',
		ko: mark?.ko
	};
}
