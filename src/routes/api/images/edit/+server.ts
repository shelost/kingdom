import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import { isStillEditOp, type StillEditCapabilities, type StillEditRequest } from '$lib/stillEdit';
import { editStill, stillEditAvailable } from '$lib/server/stillEdit';

function capabilities(): StillEditCapabilities {
	if (!dev) {
		return { available: false, ops: [], reason: 'Still tools only run in local dev' };
	}
	if (!stillEditAvailable()) {
		return {
			available: false,
			ops: [],
			reason: 'Set FAL_KEY in .env (same key as Fal scripts)'
		};
	}
	return { available: true, ops: ['remove-bg', 'prompt-edit', 'expand'] };
}

export const GET: RequestHandler = async () => json(capabilities());

export const POST: RequestHandler = async ({ request }) => {
	const caps = capabilities();
	if (!caps.available) error(403, caps.reason ?? 'Still tools unavailable');

	let body: StillEditRequest;
	try {
		body = (await request.json()) as StillEditRequest;
	} catch {
		error(400, 'Expected JSON');
	}
	if (!body || typeof body.slotId !== 'string' || !isStillEditOp(body.op)) {
		error(400, 'Expected { slotId, op }');
	}
	try {
		const result = await editStill(body);
		return json(result);
	} catch (err) {
		const status = typeof (err as { status?: unknown }).status === 'number'
			? (err as { status: number }).status
			: 502;
		const message = err instanceof Error ? err.message : 'Still edit failed';
		error(status, message);
	}
};
