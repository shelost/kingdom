/**
 * Nation flag badges — SVG chips under episode titles, and on nation profiles.
 * Files live in /static/flag_*.svg.
 */

import { staticAsset } from '$lib/staticAsset.svelte';

export const FLAG_IDS = [
	'silla',
	'baekje',
	'goguryeo',
	'tang',
	'wa',
	'gaya',
	'tamla'
] as const;

export type FlagId = (typeof FLAG_IDS)[number];

/** badge token → flag id. Legacy emoji kingdom markers map here too. */
const TOKEN: Record<string, FlagId> = {
	'silla': 'silla',
	'baekje': 'baekje',
	'goguryeo': 'goguryeo',
	'tang': 'tang',
	'wa': 'wa',
	'yamato': 'wa',
	'gaya': 'gaya',
	'tamla': 'tamla',
	// legacy emoji / glyphs used as kingdom chips
	'🌙': 'silla',
	'🟡': 'baekje',
	'⚙️': 'goguryeo',
	'唐': 'tang',
	'🌸': 'wa',
	'🟣': 'gaya',
	'🟠': 'tamla'
};

export function flagSrc(id: FlagId): string {
	return staticAsset(`/flag_${id}.svg`) ?? `/flag_${id}.svg`;
}

/** If this badge string is a nation flag, return its id; else null. */
export function flagOf(badge: string): FlagId | null {
	const raw = badge.trim();
	if (!raw) return null;
	// explicit: flag:silla / @silla
	const m = raw.match(/^(?:flag:|@)([a-z]+)$/i);
	if (m) {
		const id = m[1].toLowerCase() as FlagId;
		return FLAG_IDS.includes(id) ? id : null;
	}
	return TOKEN[raw] ?? null;
}

export function isFlagBadge(badge: string): boolean {
	return flagOf(badge) != null;
}
