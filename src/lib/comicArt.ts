import { flattenStoryImages, type StoryCueImage } from '$lib/storyImages';

const ART = new Map<string, StoryCueImage>();
for (const im of flattenStoryImages()) {
	if (!ART.has(im.slot.id)) ART.set(im.slot.id, im);
}

export function comicArtOf(slot: string): StoryCueImage | undefined {
	return ART.get(slot);
}
