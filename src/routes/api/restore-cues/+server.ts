import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { editSlots } from '$lib/server/storyFile';

/** POST { slotIds } — put unanchored stills back at the opening of their entry. */
export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json().catch(() => null)) as { slotIds?: unknown } | null;
	const slotIds = Array.isArray(body?.slotIds)
		? body.slotIds.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
		: [];
	if (!slotIds.length) error(400, 'Expected { slotIds }');
	const n = await editSlots(slotIds, (_entry, slot) => {
		slot.restored = true;
	});
	return json({ ok: true, n });
};
