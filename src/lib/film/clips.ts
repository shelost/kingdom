/**
 * Stills that move: a short silent loop generated from the still, played over
 * it in the film. `clips.json` maps a still id to its file under `static/`.
 */
import { staticAsset } from '$lib/staticAsset.svelte';
import CLIPS from './clips.json';

const clips = CLIPS as Record<string, string>;

export function clipOf(id: string | undefined): string | null {
	const path = id ? clips[id] : undefined;
	return path ? staticAsset(path) : null;
}
