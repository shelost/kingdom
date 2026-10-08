/**
 * Chronicle entry header: the tag row (kingdom flags + episode kinds) and the
 * 등장인물 cast list under the title.
 */

import type { Block, Entry } from '$lib/story';
import { EPISODE_KIND_META, episodeKindsOf } from '$lib/episodeKinds';
import { FLAG_LABEL, flagOf, flagSrc } from '$lib/flags';
import { peopleOfSlot } from '$lib/imagePeople';
import { avatarOf, byId, colorOf, isPlaceholderArt, koreanOf, nameOf, wearsSquare } from '$lib/people';
import { standings } from '$lib/chat';

export type EntryTag = {
	key: string;
	label: string;
	ko: string;
	/** Flag image for a kingdom tag. */
	flag?: string;
	/** Material Symbols name for a kind tag. */
	icon?: string;
	color?: string;
};

export type CastMember = {
	id: string;
	name: string;
	ko?: string;
	avatar: string | null;
	/** The avatar is a stand-in silhouette, not a likeness. */
	silhouette: boolean;
	/** The monarch's (or chief god's) square frame. */
	square: boolean;
	color: string;
};

/** Kingdom flags from `badges` (emoji badges drop out), then the episode's kinds. */
export function entryTags(en: Entry): EntryTag[] {
	const tags: EntryTag[] = [];
	const seen = new Set<string>();
	for (const badge of en.badges ?? []) {
		const flag = flagOf(badge);
		if (!flag || seen.has(flag)) continue;
		seen.add(flag);
		tags.push({ key: `flag:${flag}`, ...FLAG_LABEL[flag], flag: flagSrc(flag) });
	}
	for (const kind of episodeKindsOf(en)) {
		const meta = EPISODE_KIND_META[kind];
		tags.push({ key: kind, label: meta.label, ko: meta.ko, icon: meta.icon, color: meta.color });
	}
	return tags;
}

/** Stock voices that speak in many episodes without being anyone's story. */
const STOCK = new Set(['courtmaid', 'herald', 'haenyeo', 'narrator', 'messenger']);
const STILL_WEIGHT = 2;
const MIN_SCORE = 2;

function scoreSpeakers(blocks: Block[], score: Map<string, number>) {
	for (const b of blocks) {
		if (b.kind === 'dialogue' && b.person) {
			score.set(b.person, (score.get(b.person) ?? 0) + Math.max(1, b.lines.length));
		} else if (b.kind === 'monologue' && b.person) {
			score.set(b.person, (score.get(b.person) ?? 0) + 1);
		} else if (b.kind === 'flashback') {
			scoreSpeakers(b.blocks, score);
		}
	}
}

function castIds(en: Entry, limit: number): string[] {
	if (en.cast?.length) return en.cast.slice(0, limit);
	const score = new Map<string, number>();
	scoreSpeakers(en.blocks, score);
	for (const slot of en.images) {
		for (const id of peopleOfSlot(slot.id, slot.people)) {
			score.set(id, (score.get(id) ?? 0) + STILL_WEIGHT);
		}
	}
	return [...score]
		.filter(([id, n]) => {
			if (n < MIN_SCORE || STOCK.has(id)) return false;
			const p = byId.get(id);
			return !!p && (!p.entity || p.entity === 'god');
		})
		.sort((a, b) => b[1] - a[1])
		.slice(0, limit)
		.map(([id]) => id);
}

/**
 * The few people an episode is about, named and painted as they first speak in
 * it: an heir under a living king is still the prince, a card's look holds.
 */
export function entryCast(en: Entry, year: number | null = null, limit = 5): CastMember[] {
	const out: CastMember[] = [];
	const standing = standings(en.blocks, year);
	for (const id of castIds(en, limit)) {
		const p = byId.get(id);
		if (!p) continue;
		const first = en.blocks.find(
			(b): b is Extract<Block, { kind: 'dialogue' }> => b.kind === 'dialogue' && b.person === id
		);
		const stood = first ? standing.get(first) : undefined;
		const look = first?.look ?? stood?.look;
		const art = avatarOf(p, id, year, look);
		out.push({
			id,
			name: nameOf(p, year, look),
			ko: koreanOf(p, year, look),
			avatar: art,
			silhouette: isPlaceholderArt(art),
			square: !stood?.heir && wearsSquare(p, year, look),
			color: colorOf(p)
		});
	}
	return out;
}
