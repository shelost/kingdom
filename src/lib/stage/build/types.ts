import type * as THREE from 'three';

/**
 * How sure we are of a thing's shape and place. `placed`: a real thing whose spot or form we
 * reconstructed; `fictional`: invented for the chronicle (from its boards or its story).
 */
export type LabelStatus = 'survey' | 'standing' | 'excavated' | 'recorded' | 'placed' | 'fictional';

/** Scene layers the page can switch without a rebuild. */
export type Layers = {
	/** Trees, ground cover and the painted canopy on the ground. */
	nature: boolean;
	/** Sway in trees, grass and reeds. */
	wind: boolean;
	/** The cloud sea and the sky clouds. */
	clouds: boolean;
	mist: boolean;
	birds: boolean;
	/** Lantern glow and the lamp lights. */
	lamps: boolean;
	/** Ripples drifting on the water. */
	water: boolean;
};

export const DEFAULT_LAYERS: Layers = { nature: true, wind: true, clouds: true, mist: true, birds: true, lamps: true, water: true };

export type Label = {
	id: string;
	en: string;
	ko: string;
	at: [number, number, number];
	status: LabelStatus;
	note?: string;
	/** Shown only from this camera view (the costume lineup's names). */
	view?: string;
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

/** The hour as a blend between two presets, `t` of the way from `a` to `b`. */
export type LightMix = { a: LightPreset; b: LightPreset; t: number };

/** A number per preset, blended at the hour. */
export function blend(mix: LightMix, f: (id: LightPreset) => number): number {
	return f(mix.a) * (1 - mix.t) + f(mix.b) * mix.t;
}

/** How much of one preset is in the hour, 0..1. */
export function weight(mix: LightMix, id: LightPreset): number {
	return blend(mix, (p) => (p === id ? 1 : 0));
}

/** A colour per preset, blended at the hour into `out`. */
export function blendColor(mix: LightMix, f: (id: LightPreset) => string, out: THREE.Color): THREE.Color {
	const a = out.set(f(mix.a));
	const r = a.r, g = a.g, bl = a.b;
	out.set(f(mix.b));
	return out.setRGB(r + (out.r - r) * mix.t, g + (out.g - g) * mix.t, bl + (out.b - bl) * mix.t);
}

/** What drifts in a site's air besides the wind-blown leaves: snow, spring petals, or a realm's glowing motes. */
export type Weather = { snow?: boolean; petals?: boolean; motes?: string; /** Colour of the lamp lights (blue in the underworld). */ lamp?: string };

/** Otherworld sky: a painted gradient instead of the sun, and the motes that drift in it. */
export type Realm = { top: string; bottom: string; fog: string; fogNear: number; fogFar: number; motes?: string; sun?: string; sunI?: number; hemi?: string };

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
	/** Land height (cheap: a grid sample), for anything placed on the site later. */
	height: (x: number, z: number) => number;
	/** Water surface at a point, or null on land. */
	water: (x: number, z: number) => number | null;
	/** Set on otherworld sites: their own sky in place of the hour. */
	realm?: Realm;
	weather: Weather;
	setLight(light: LightMix): void;
	/** The sky environment, for reflections on water. */
	setEnv(tex: THREE.Texture | null): void;
	/** Show or hide the crowd and the boats without rebuilding the site. */
	setLife(flags: { people: boolean; boats: boolean }): void;
	/** Show or hide scene layers and still the wind or the water, instantly. */
	setLayers(layers: Layers): void;
	/** Seconds since the build, for wind, water and mist; `dt` drives the rise and grow animations. */
	tick(t: number, dt: number): void;
	/** Play the site rising out of the ground. Returns the seconds it takes. */
	rise(): number;
	/** True while the site is still rising (the scene holds the shadow map until it stands). */
	rising: boolean;
	dispose(): void;
};

/** What the page can ask of a running stage. */
export type StageApi = { capture(width?: number): string | null };
