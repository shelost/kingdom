import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { editSlotOwner, readSlotBody } from '$lib/server/storyFile';

/** POST { slotId, hidden } — keep the cue and its art, but leave it out of the chronicle (or reinstate it). */
export const POST: RequestHandler = async ({ request }) => {
	const { slotId, hidden: rawHidden } = await readSlotBody(request);
	const hidden = rawHidden === true;
	await editSlotOwner(slotId, (_entry, slot) => {
		if (hidden) slot.hidden = true;
		else delete slot.hidden;
	});
	return json({ ok: true, slotId, hidden });
};
