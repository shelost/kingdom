/**
 * Intimate-cue gate — tiny module so reading stacks do not import the
 * /images gallery graph (`storyImages` → inventory, people, places).
 */

import type { ImageSlot } from '$lib/story';

const NSFW_HINT =
	/skin-forward|close hungry kiss|passionate kiss|robe (off|slipping|open on the chest)|bare (shoulder|chest|back|buttock|ass|thigh)|mouths almost touching|mouth at .{0,40}throat|wet (white )?jeogori|openly sexual|overwhelmed with (lust|desire)|grabbing .{0,80}(ass|hip|buttock)/i;

export function isNsfwCueImage(slot: ImageSlot): boolean {
	if (slot.nsfw) return true;
	return NSFW_HINT.test(`${slot.prompt ?? ''} ${slot.alt ?? ''}`);
}
