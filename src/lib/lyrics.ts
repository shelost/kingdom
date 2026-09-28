/**
 * Timed lyrics for /scenes — keyed by YouTube video id or local file stem
 * (e.g. `mu_little_fall_of_rain`). Data: `src/lib/data/lyrics/{id}.json`.
 */

export type LyricLine = {
	/** Seconds from track start (LRC clock). */
	t: number;
	/** The recording's line. */
	text: string;
	/** In-story line for this scene. Falls back to `text` when absent. */
	scene?: string;
};

export type LyricTrack = {
	id: string;
	source?: string;
	trackName?: string;
	artistName?: string;
	/**
	 * Seconds to add to each LRC timestamp to match the YouTube encode
	 * (e.g. MV cold open before the song’s LRC t=0).
	 */
	offset?: number;
	lines: LyricLine[];
};

const modules = import.meta.glob<{ default: LyricTrack }>('./data/lyrics/*.json', {
	eager: true
});

function normalize(track: LyricTrack): LyricTrack {
	const lines = [...(track.lines ?? [])]
		.filter((l) => l && Number.isFinite(l.t) && typeof l.text === 'string')
		.map((l) => {
			const text = l.text.trim();
			const scene = typeof l.scene === 'string' ? l.scene.trim() : '';
			return scene ? { t: Math.max(0, l.t), text, scene } : { t: Math.max(0, l.t), text };
		})
		.filter((l) => l.text.length > 0)
		.sort((a, b) => a.t - b.t);
	const offset = Number.isFinite(track.offset) ? Number(track.offset) : 0;
	return { ...track, offset, lines };
}

const BY_ID = new Map<string, LyricTrack>();
for (const [path, mod] of Object.entries(modules)) {
	const data = mod.default;
	if (!data?.id || !Array.isArray(data.lines) || data.lines.length === 0) continue;
	const track = normalize(data);
	BY_ID.set(data.id, track);
	const base = path.split('/').pop()?.replace(/\.json$/, '');
	if (base && base !== data.id) BY_ID.set(base, track);
}

export function lyricsForId(id: string | undefined | null): LyricTrack | null {
	if (!id) return null;
	return BY_ID.get(id) ?? null;
}

export function lyricsForYoutubeId(youtubeId: string | undefined | null): LyricTrack | null {
	return lyricsForId(youtubeId);
}

export function hasLyricsForId(id: string | undefined | null): boolean {
	return !!lyricsForId(id);
}

export function hasLyricsForYoutubeId(youtubeId: string | undefined | null): boolean {
	return hasLyricsForId(youtubeId);
}

/** Player clock → LRC clock. */
export function lyricTimeAt(playerSec: number, offset = 0): number {
	return playerSec - (Number.isFinite(offset) ? offset : 0);
}

/** LRC clock → player seek target. */
export function playerTimeForLyric(lineSec: number, offset = 0): number {
	return Math.max(0, lineSec + (Number.isFinite(offset) ? offset : 0));
}

/**
 * Index of the line active at player time `playerSec`.
 * Uses a small lead so the highlight lands with the vocal, not after it.
 */
export function activeLyricIndex(
	lines: readonly LyricLine[],
	playerSec: number,
	offset = 0
): number {
	if (!lines.length || !Number.isFinite(playerSec)) return -1;
	const t = lyricTimeAt(playerSec, offset) + 0.08;
	let lo = 0;
	let hi = lines.length - 1;
	let ans = -1;
	while (lo <= hi) {
		const mid = (lo + hi) >> 1;
		if (lines[mid].t <= t) {
			ans = mid;
			lo = mid + 1;
		} else {
			hi = mid - 1;
		}
	}
	return ans;
}

export function youtubeIdOfScene(scene: {
	audio: { kind: string; youtubeId?: string };
}): string | null {
	if (scene.audio.kind === 'youtube' && scene.audio.youtubeId) return scene.audio.youtubeId;
	return null;
}

/** Lyrics lookup key: YouTube id, or local file stem (`mu_little_fall_of_rain`). */
export function lyricsIdOfScene(scene: {
	audio: { kind: string; youtubeId?: string; file?: string };
}): string | null {
	if (scene.audio.kind === 'youtube' && scene.audio.youtubeId) return scene.audio.youtubeId;
	if (scene.audio.kind === 'file' && scene.audio.file) {
		const base = scene.audio.file.split('/').pop() ?? '';
		const stem = base.replace(/\.[^.]+$/, '');
		return stem || null;
	}
	return null;
}

export function lyricsForScene(scene: {
	audio: { kind: string; youtubeId?: string; file?: string };
}): LyricTrack | null {
	return lyricsForId(lyricsIdOfScene(scene));
}

export function hasLyricsForScene(scene: {
	audio: { kind: string; youtubeId?: string; file?: string };
}): boolean {
	return !!lyricsForScene(scene);
}
