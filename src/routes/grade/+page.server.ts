import fs from 'node:fs';
import path from 'node:path';
import type { PageServerLoad } from './$types';

type Slot = { id?: string; prompt?: string };
type Entry = { images?: Slot[] };
type Chapter = { entries?: Entry[] };

/**
 * Runtime story.json is slimmed (no prompts) so Vite can load it. Grade still
 * needs the Midjourney text — read it from disk here only.
 */
export const load: PageServerLoad = async () => {
	const file = path.resolve('src/lib/data/story.json');
	const chapters = JSON.parse(fs.readFileSync(file, 'utf8')) as Chapter[];
	const prompts: Record<string, string> = {};
	for (const ch of chapters) {
		for (const en of ch.entries ?? []) {
			for (const im of en.images ?? []) {
				if (im.id && typeof im.prompt === 'string' && im.prompt.trim()) {
					prompts[im.id] = im.prompt;
				}
			}
		}
	}
	return { prompts };
};
