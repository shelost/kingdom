import { isFlashEntry, type Entry } from '$lib/story';
import type { EpisodeKind } from '$lib/episodeKindMeta';

export { EPISODE_KIND_META, type EpisodeKind } from '$lib/episodeKindMeta';

const WAR_KINDS = new Set<EpisodeKind>(['battle', 'siege', 'naval']);

/** A battle, a siege or a fight at sea: Hybrid breaks it as news. */
export function isWarEntry(en: Entry): boolean {
	return !!en.kinds?.some((k) => WAR_KINDS.has(k));
}

/** Icons after an episode title. Flashback is derived from `flash` / `flashback`, never stored. */
export function episodeKindsOf(en: Entry): EpisodeKind[] {
	const stored = (en.kinds ?? []).filter((k) => k !== 'flashback');
	return isFlashEntry(en) ? ['flashback', ...stored] : stored;
}
