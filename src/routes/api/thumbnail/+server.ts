import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { editSlotOwner, readSlotBody, type StoryEntry } from '$lib/server/storyFile';

/** Same entry with `thumbnail` (+ `thumbnailLayer`) placed beside its titles, so the JSON stays readable. */
function withThumbnail(entry: StoryEntry, slotId: string, layer: 'temp' | undefined): StoryEntry {
	const anchor = 'thumbnail' in entry ? 'thumbnail' : 'subtitle' in entry ? 'subtitle' : 'title';
	const out: StoryEntry = {};
	const place = () => {
		out.thumbnail = slotId;
		if (layer) out.thumbnailLayer = layer;
	};
	for (const [k, v] of Object.entries(entry)) {
		if (k === 'thumbnail' || k === 'thumbnailLayer') {
			if (k === anchor) place();
			continue;
		}
		out[k] = v;
		if (k === anchor) place();
	}
	if (!('thumbnail' in out)) place();
	return out;
}

/** POST { slotId, layer? } — make that cue (or its temp stand-in) the representative still of its episode. */
export const POST: RequestHandler = async ({ request }) => {
	const { slotId, layer: rawLayer } = await readSlotBody(request);
	const layer = rawLayer === 'temp' ? 'temp' : undefined;
	await editSlotOwner(slotId, (entry) => withThumbnail(entry, slotId, layer));
	return json({ ok: true, slotId, layer });
};
