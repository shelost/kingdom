/**
 * The film medium: an episode staged as scenes of dialogue, each in a place the
 * camera can move through (a 3D stage site, Kangrim's road on the cosmos, or
 * the painted stills), with effects drawn over the frame and transitions that
 * carry the viewer from one place to the next.
 */
import type { StageSiteId } from '$lib/stage/sites';
import type { StageStyle } from '$lib/stage/post';
import type { PaperId } from './paper/scenes';

export type FxId =
	| 'scent'
	| 'petals'
	| 'embers'
	| 'snow'
	| 'rain'
	| 'motes'
	| 'wisps'
	| 'cloud'
	| 'fog'
	| 'foxfire'
	| 'flicker'
	| 'heartbeat'
	| 'speed'
	| 'stars';

/** One effect over the frame. `at` is the emitter, 0…1 across and down the frame. */
export type Fx = { id: FxId; color?: string; at?: [number, number]; amount?: number };

/** How the camera crosses a still. `orbit` tips the plate in perspective so it reads as a turning body. */
export type PlateMove = 'push' | 'pull' | 'left' | 'right' | 'rise' | 'still' | 'orbit';

/** Where a peninsula shot looks. `wide` is the whole coast; the others close in. */
export type MapFocus = 'wide' | 'north' | 'southeast' | 'southwest';

/** A camera on the 3D stage: a site view (or a labelled feature), then a drift over the shot. */
export type StageShot = {
	/** Site view id; `*` takes the site's views in turn. */
	view?: string;
	/** Frame a labelled feature instead of a view. */
	label?: string;
	/** Fraction of the way toward the target travelled over the shot; negative pulls back. */
	dolly?: number;
	/** Degrees swung round the target over the shot. */
	orbit?: number;
	/** Height gained over the shot, as a fraction of the distance to the target. */
	rise?: number;
	fov?: number;
};

/** Where a scene is staged. */
export type FilmSet =
	| {
			kind: 'stage';
			site: StageSiteId;
			year?: number;
			hour?: number;
			look?: StageStyle;
			people?: boolean;
			/** Coverage the camera cuts back to between stills. */
			shots: StageShot[];
	  }
	| { kind: 'road'; step: string }
	| { kind: 'still' };

export type Transition = 'cut' | 'fade' | 'flash' | 'wake' | 'ink' | 'iris' | 'fly' | 'travel' | 'door';

/** What fills the frame for one stretch of the film. A still named only by `id` takes its art from the episode. */
export type Visual =
	| { kind: 'still'; src: string; id?: string; move: PlateMove }
	/** A cut-paper shadow box drawn live from the film clock. */
	| { kind: 'paper'; scene: PaperId }
	/** `site` and `hour` override the scene's set, so one scene can travel. */
	| { kind: 'stage'; shot: StageShot; year?: number; site?: StageSiteId; hour?: number; people?: boolean }
	| { kind: 'road'; step: string }
	/** Painted peninsula, no kingdom colours. `arrows` draw on `'draw'` and stay on `'hold'`. */
	| { kind: 'peninsula'; year?: number; focus: MapFocus; arrows?: 'draw' | 'hold'; mark?: string }
	/** The coloured Three Kingdoms sheet. Only at the end of the geography. */
	| { kind: 'samhan'; year?: number; mark?: string }
	| { kind: 'black' };

export type Beat = {
	/** `line` is spoken; `card` is a short narrator card; `title` names the scene. */
	kind: 'line' | 'card' | 'title';
	en: string;
	ko: string;
	person?: string;
	speaker?: string;
	look?: string;
	/** Absent: the previous picture carries on under this beat. */
	visual?: Visual;
	/** How this beat's picture comes in, when it is not the scene's first. */
	enter?: Transition;
	hold?: number;
	fx?: Fx[];
};

/** A beat written by hand in a script: a card unless it names a speaker. */
export type ScriptBeat = Omit<Beat, 'kind'> & { kind?: Beat['kind'] };

export type FilmScene = {
	id: string;
	label: string;
	ko?: string;
	set: FilmSet;
	enter: Transition;
	fx: Fx[];
	/** Inside a flashback: the picture drains toward memory. */
	memory: boolean;
	beats: Beat[];
};

export type Film = { title: string; ko?: string; year: number; look: StageStyle; scenes: FilmScene[] };

/** A director's note for one scene of the story. */
export type SceneScript = {
	/** The story's scene label; `@open` is everything before the first scene. */
	scene: string;
	set?: FilmSet;
	enter?: Transition;
	fx?: Fx[];
	/** The picture under the scene title, if not the set's first shot. */
	open?: Visual;
	/** Short cards before the dialogue, standing in for the narration. */
	cards?: ScriptBeat[];
	/** Direction for single lines, matched on a fragment of the English; `before` plays ahead of the line. */
	at?: { line: string; visual?: Visual; fx?: Fx[]; before?: ScriptBeat[] }[];
	/** Cards after the last line. */
	end?: ScriptBeat[];
	/** Replace the scene's beats outright. */
	beats?: ScriptBeat[];
	skip?: boolean;
	/** Keep only the first N spoken lines. */
	limit?: number;
};

/** A scene written outright, for a film that does not follow the text. */
export type CutScene = { label: string; ko?: string; set?: FilmSet; enter?: Transition; fx?: Fx[]; memory?: boolean; beats: ScriptBeat[] };

export type FilmScript = {
	look?: StageStyle;
	scenes: SceneScript[];
	/** Replaces the drafted film with these scenes. */
	cut?: CutScene[];
};
