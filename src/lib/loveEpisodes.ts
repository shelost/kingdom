/**
 * Love-story episodes — the ten couples (excl. Jacheongbi & Mun Doryeong).
 * Pink dot in the TOC marks these entries.
 *
 * Couples → host episode:
 * - Hwanung & Ungnyeo → Dangun & Old Joseon
 * - Haemosu & Yuhwa → Jumong
 * - Jumong & Sosuno → Jumong
 * - Ibiga & Jeonggyeon → Suro
 * - Suro & Queen Heo → Suro
 * - Chunchu & Munhee → Queen Sunduk
 * - Yushin & Sunduk → Queen Sunduk
 * - Gotaso & Pumsuk → Gotaso’s Wedding
 * - Bupmin & Jahee → Harbour Ledgers
 * - Xue Rengui & Lady Liu → Longmen Field
 */

export const LOVE_EPISODE_IDS = new Set<string>([
	'fall-of-baekje-dangun-old-joseon',
	'jumong-jumong',
	'chunchu-era-suro',
	'samhan-queen-sunduk',
	'five-principles-gotasos-wedding',
	'chunchu-era-harbour-ledgers',
	'seventh-invasion-longmen-field'
]);

export function isLoveEpisode(entryId: string): boolean {
	return LOVE_EPISODE_IDS.has(entryId);
}
