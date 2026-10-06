import { chapters, entryId } from '$lib/story';

/**
 * Love-story episodes — entries whose `kinds` include `"love"` in story.json.
 * A heart marks them in the TOC and the episode switcher.
 */
export const LOVE_EPISODE_IDS = new Set<string>(
	chapters.flatMap((ch) =>
		ch.entries.filter((en) => en.kinds?.includes('love')).map((en) => entryId(ch.id, en.title))
	)
);

export function isLoveEpisode(id: string): boolean {
	return LOVE_EPISODE_IDS.has(id);
}
