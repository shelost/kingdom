/**
 * Cue ids whose `static/temp/{id}.jpg` is a trivial sips re-encode of the
 * final `src` (seeded stand-in, not a real ref-based regeneration).
 * Rebuild: detect via scripts, then rewrite this file; remove ids as they
 * are properly regenerated.
 */
export const SEED_COPY_TEMP_IDS: ReadonlySet<string> = new Set([]);

export function isSeedCopyTempId(id: string): boolean {
	return SEED_COPY_TEMP_IDS.has(id);
}
