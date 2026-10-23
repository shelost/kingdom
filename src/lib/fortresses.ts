/**
 * Fortresses that appear in more than one battle, drawn from one outline so the same
 * place always looks the same. A battle names the model and where it stands
 * (`{ "kind": "town", "model": "pyongyang", "at": [x, y], "size": 140 }`); the loader
 * expands it into the town ground and its wall circuit, scaled so `size` is the
 * circuit's half-width in sheet units.
 *
 * Outlines are in units of that half-width, centred on the circuit, y south.
 */
import type { Pt } from '$lib/mapPaths';

export type FortressModel = {
	/** The wall circuit, closed. */
	wall: Pt[];
	/** The ground inside it. */
	town: Pt[];
	/** Where the main gate stands, for battles that place one. */
	gate: Pt;
	note: string;
};

export const FORTRESS_MODELS: Record<string, FortressModel> = {
	pyongyang: {
		wall: [
			[-0.77, 0.72],
			[-1, 0.09],
			[-0.77, -0.48],
			[-0.06, -0.77],
			[0.69, -0.55],
			[1, 0.09],
			[0.73, 0.63],
			[-0.06, 0.77],
			[-0.77, 0.72]
		],
		town: [
			[-0.69, 0.63],
			[-0.89, 0.09],
			[-0.69, -0.41],
			[-0.06, -0.66],
			[0.6, -0.47],
			[0.87, 0.09],
			[0.64, 0.55],
			[-0.06, 0.67]
		],
		gate: [-0.02, 0.76],
		note: 'Goguryeo Pyongyang: one stone circuit on the Taedong bend, the river below its south wall, the main gate facing it.'
	}
};

type ModelItem = { kind: string; model: string; at: Pt; size?: number; [k: string]: unknown };

const place = (pts: Pt[], at: Pt, size: number): Pt[] => pts.map(([u, v]) => [Math.round(at[0] + u * size), Math.round(at[1] + v * size)]);

/** A terrain item with a `model` becomes its town ground and its wall; anything else passes through. */
export function expandModel<T>(t: T): T[] {
	const m = t as unknown as ModelItem;
	const model = m.model ? FORTRESS_MODELS[m.model] : undefined;
	if (!model) return [t];
	const { model: _, at, size = 120, kind: __, ...rest } = m;
	const town = { ...rest, kind: 'town', points: place(model.town, at, size) };
	const wall = { kind: 'wall', points: place(model.wall, at, size), width: Math.max(3, Math.round(size / 28)) };
	return [town as unknown as T, wall as unknown as T];
}
