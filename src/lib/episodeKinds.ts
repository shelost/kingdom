import { isFlashEntry, type Entry } from '$lib/story';
import {
	EPISODE_TITLE_TYPE_META,
	type EpisodeKind,
	type EpisodeTitleType
} from '$lib/episodeKindMeta';

export {
	EPISODE_KIND_META,
	EPISODE_TITLE_TYPE_META,
	type EpisodeKind,
	type EpisodeTitleType
} from '$lib/episodeKindMeta';

const WAR_KINDS = new Set<EpisodeKind>(['battle', 'siege', 'naval']);

/** A battle, a siege or a fight at sea: Hybrid breaks it as news. */
export function isWarEntry(en: Entry): boolean {
	return !!en.kinds?.some((k) => WAR_KINDS.has(k as EpisodeKind));
}

/** Tamla / steam-cavern myths are their own category — not flashbacks. */
export function isMythEntry(en: Pick<Entry, 'kinds'>): boolean {
	return !!en.kinds?.includes('myth');
}

/**
 * Memory episodes for greying titles under Details. Myths keep their own colour
 * even when the entry still carries `flash` for the reading band.
 */
export function isFlashbackTitle(en: Pick<Entry, 'flash' | 'flashback' | 'kinds'>): boolean {
	return isFlashEntry(en) && !isMythEntry(en);
}

/** Icons after an episode title. Flashback is derived from `flash` / `flashback`, never stored. */
export function episodeKindsOf(en: Entry): EpisodeKind[] {
	const stored = (en.kinds ?? []).filter((k) => k !== 'flashback') as EpisodeKind[];
	if (isFlashEntry(en) && !isMythEntry(en)) return ['flashback', ...stored];
	return stored;
}

/**
 * The single type mark next to the title: Person · Battle · King · Death · none.
 * King = coronation (무열왕). Death = a death episode (김춘추). Person = named after someone.
 */
export function episodeTitleTypeOf(en: Entry): EpisodeTitleType | null {
	const k = en.kinds ?? [];
	if (k.includes('death')) return 'death';
	if (k.includes('coronation')) return 'king';
	if (k.some((x) => WAR_KINDS.has(x as EpisodeKind))) return 'battle';
	if (k.includes('person')) return 'person';
	return null;
}

/** Secondary kind icons (right rail) — skips the kind already shown as the title type. */
export function episodeSideKindsOf(en: Entry): EpisodeKind[] {
	const title = episodeTitleTypeOf(en);
	const skip = new Set<EpisodeKind>();
	if (title === 'king') skip.add('coronation');
	if (title === 'battle') for (const w of WAR_KINDS) skip.add(w);
	if (title === 'person') skip.add('person');
	if (title === 'death') skip.add('death');
	return episodeKindsOf(en).filter((k) => !skip.has(k));
}

export function titleTypeMeta(type: EpisodeTitleType) {
	return EPISODE_TITLE_TYPE_META[type];
}
