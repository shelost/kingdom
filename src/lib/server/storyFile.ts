import fs from 'node:fs/promises';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { armSkipChronicleHmr } from '$lib/server/chronicleHmr';

/** story.json as the dev edit APIs see it: loose records, written back key-for-key. */
export type StorySlot = Record<string, unknown> & { id?: unknown };
export type StoryEntry = Record<string, unknown> & { images?: StorySlot[] };
export type StoryChapter = Record<string, unknown> & { entries?: StoryEntry[] };

const STORY_FILE = path.resolve('src/lib/data/story.json');

/**
 * Read story.json, let `edit` change the entry that owns `slotId`, write it back.
 * The page already patched its own state, so the write skips the chronicle HMR.
 */
export async function editSlotOwner(
	slotId: string,
	edit: (entry: StoryEntry, slot: StorySlot) => StoryEntry | void
): Promise<void> {
	if (!dev) error(403, 'Edits only save in local dev, where story.json is on disk');
	const story = JSON.parse(await fs.readFile(STORY_FILE, 'utf-8')) as StoryChapter[];
	if (!Array.isArray(story)) error(500, 'story.json is not an array');

	for (const ch of story) {
		const entries = ch.entries ?? [];
		for (let i = 0; i < entries.length; i++) {
			const slot = entries[i].images?.find((s) => s.id === slotId);
			if (!slot) continue;
			entries[i] = edit(entries[i], slot) ?? entries[i];
			armSkipChronicleHmr();
			await fs.writeFile(STORY_FILE, JSON.stringify(story, null, '\t') + '\n');
			return;
		}
	}
	error(404, `No episode owns the cue “${slotId}”`);
}

/** Parse `{ slotId, ...rest }` from a JSON body, or 400. */
export async function readSlotBody(request: Request): Promise<{ slotId: string } & Record<string, unknown>> {
	const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
	const slotId = typeof body?.slotId === 'string' ? body.slotId.trim() : '';
	if (!slotId) error(400, 'Expected { slotId }');
	return { ...body, slotId };
}
