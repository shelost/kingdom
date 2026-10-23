import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { editSlotOwner, readSlotBody } from '$lib/server/storyFile';
import { CROP_MAX, CROP_MIN, WIDTH_MAX, WIDTH_MIN } from '$lib/story';

function focusOf(value: unknown): { x: number; y: number } | null | undefined {
	if (value == null) return null;
	if (typeof value !== 'object') return undefined;
	const x = Number((value as { x?: unknown }).x);
	const y = Number((value as { y?: unknown }).y);
	if (![x, y].every((n) => Number.isFinite(n) && n >= 0 && n <= 100)) return undefined;
	return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

function sayOf(value: unknown): { en?: string; ko?: string; person?: string } | false | null | undefined {
	if (value === false) return false;
	if (value == null) return null;
	if (typeof value !== 'object') return undefined;
	const raw = value as { en?: unknown; ko?: unknown; person?: unknown };
	const en = typeof raw.en === 'string' ? raw.en.trim() : undefined;
	const ko = typeof raw.ko === 'string' ? raw.ko.trim() : undefined;
	const person = typeof raw.person === 'string' ? raw.person.trim() : undefined;
	if (!en && !ko) return undefined;
	return { ...(en ? { en } : {}), ...(ko ? { ko } : {}), ...(person ? { person } : {}) };
}

/**
 * POST { slotId, at?, wide?, crop?, focus?, say? } — where a cue sits and how it shows.
 * `wide` takes it out of the masonry. `crop` fixes its shape (null: the picture's own).
 * `width` is the fraction of the column (null: the row decides again).
 * `focus` slides the crop window. `say` letters a balloon (`false` keeps it quiet, null guesses).
 */
export const POST: RequestHandler = async ({ request }) => {
	const body = await readSlotBody(request);
	const at = typeof body.at === 'string' ? body.at.trim() : undefined;
	if (body.at !== undefined && !at) error(400, 'Expected a non-empty `at`');
	const crop = body.crop == null ? null : Number(body.crop);
	if (crop != null && !(Number.isFinite(crop) && crop >= CROP_MIN && crop <= CROP_MAX))
		error(400, `Expected crop between ${CROP_MIN} and ${CROP_MAX}`);
	const width = body.width == null ? null : Number(body.width);
	if ('width' in body && width != null && !(Number.isFinite(width) && width >= WIDTH_MIN && width <= WIDTH_MAX))
		error(400, `Expected width between ${WIDTH_MIN} and ${WIDTH_MAX}`);
	const focus = 'focus' in body ? focusOf(body.focus) : undefined;
	if ('focus' in body && focus === undefined) error(400, 'Expected focus { x, y } from 0 to 100, or null');
	const say = 'say' in body ? sayOf(body.say) : undefined;
	if ('say' in body && say === undefined) error(400, 'Expected say { en?, ko? }, false, or null');

	await editSlotOwner(body.slotId, (_entry, slot) => {
		if (at) slot.at = at;
		if ('wide' in body) {
			if (body.wide === true) slot.wide = true;
			else delete slot.wide;
		}
		if ('crop' in body) {
			if (crop != null) slot.crop = Math.round(crop * 1000) / 1000;
			else delete slot.crop;
		}
		if ('width' in body) {
			if (width != null) slot.width = Math.round(width * 1000) / 1000;
			else delete slot.width;
		}
		if (focus !== undefined) {
			if (focus) slot.focus = focus;
			else delete slot.focus;
		}
		if (say !== undefined) {
			if (say) slot.say = say;
			else if (say === false) slot.say = false;
			else delete slot.say;
		}
	});
	return json({ ok: true, slotId: body.slotId });
};
