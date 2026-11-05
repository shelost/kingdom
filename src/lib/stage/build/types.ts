import type * as THREE from 'three';

/** How sure we are of a thing's shape and place. */
export type LabelStatus = 'survey' | 'standing' | 'excavated' | 'recorded' | 'placed';

export type Label = {
	id: string;
	en: string;
	ko: string;
	at: [number, number, number];
	status: LabelStatus;
	note?: string;
};

export type View = {
	id: string;
	en: string;
	ko: string;
	pos: [number, number, number];
	target: [number, number, number];
	fov?: number;
};

export type LightPreset = 'dawn' | 'day' | 'golden' | 'night';

/** Balanced keeps 60 fps on a laptop; cinematic is for stills and recorded passes. */
export type Quality = 'balanced' | 'cinematic';

export type BuildOptions = { year: number; light: LightPreset };

export type SiteBuild = {
	root: THREE.Group;
	labels: Label[];
	views: View[];
	/** Plan centre and radius that the sun's shadow box must cover. */
	center: [number, number];
	radius: number;
	/** Haze colour for day light; the scene tints it for other presets. */
	haze: string;
	/** Lantern positions; the scene parks its few real lights on the nearest ones. */
	lamps: [number, number, number][];
	setLight(light: LightPreset): void;
	/** The sky environment, for reflections on water. */
	setEnv(tex: THREE.Texture | null): void;
	/** Seconds since the build, for wind, water and mist. */
	tick(t: number): void;
	dispose(): void;
};

/** What the page can ask of a running stage. */
export type StageApi = { capture(width?: number): string | null };
