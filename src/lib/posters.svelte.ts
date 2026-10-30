/**
 * One face file per Arc / Chapter id, shared by /books, /episodes, /read title
 * pages, and the TOC. Preview, then the cover pick, then the older poster pick.
 * "Set as cover" writes cover-picks.json and poster-picks.json together.
 * Episode posters (3:4 movie key art under the title) live in
 * episode-poster-catalog.json — separate from the 2:1 thumbnail still
 * in episode-thumb-catalog.json.
 */
import { resolve } from '$app/paths';
import { busyEdit } from '$lib/editUi.svelte';
import catalogFile from '$lib/data/poster-catalog.json';
import picksFile from '$lib/data/poster-picks.json';
import coverPicksFile from '$lib/data/cover-picks.json';
import episodeCatalogFile from '$lib/data/episode-poster-catalog.json';
import episodePicksFile from '$lib/data/episode-poster-picks.json';
import episodeThumbCatalogFile from '$lib/data/episode-thumb-catalog.json';
import episodeThumbPicksFile from '$lib/data/episode-thumb-picks.json';

const catalog = catalogFile as Record<string, string[]>;
const saved = picksFile as Record<string, string>;
const savedCovers = coverPicksFile as Record<string, string>;
const episodeCatalog = episodeCatalogFile as Record<string, string[]>;
const savedEpisodePosters = episodePicksFile as Record<string, string>;
const episodeThumbCatalog = episodeThumbCatalogFile as Record<string, string[]>;
const savedEpisodeThumbs = episodeThumbPicksFile as Record<string, string>;

/** Painted posters still live under retired `samhan-*` folder names. */
const LEGACY_POSTER_DIR: Record<string, string> = {
	'three-kingdoms-queen-sunduk': 'samhan-queen-sunduk',
	'three-kingdoms-harmony-council': 'samhan-harmony-council',
	'three-kingdoms-jade-gate-valley': 'samhan-jade-gate-valley',
	'three-kingdoms-king-jinheung': 'samhan-jinhung-the-cloud',
	'three-kingdoms-prince-euija': 'samhan-prince-euija',
	'three-kingdoms-eight-great-clans': 'samhan-eight-great-clans',
	'three-kingdoms-deer-rock-council': 'samhan-deer-rock',
	'three-kingdoms-king-geunchogo': 'samhan-gunchogo-the-13th',
	'three-kingdoms-commander-yeon': 'samhan-commander-yeon'
};

function episodePosterDir(eid: string): string {
	if (episodeCatalog[eid]) return eid;
	return LEGACY_POSTER_DIR[eid] ?? eid;
}

/** Picks made this session. The imported JSON does not update until reload. */
const session = $state<Record<string, string>>({});
const sessionCovers = $state<Record<string, string>>({});
const sessionEpisodePosters = $state<Record<string, string>>({});
const sessionEpisodeThumbs = $state<Record<string, string>>({});
/** Click-to-preview on /books; not written until "Set as cover". */
const preview = $state<Record<string, string>>({});
/** Bumped when a cover preview or pick changes, so volumeCover stays live. */
let coverTick = $state(0);

export function posterAlts(id: string): string[] {
	return catalog[id] ?? [];
}

export function posterPick(id: string): string | undefined {
	return faceFile(id);
}

export function posterSrc(id: string): string | undefined {
	const file = faceFile(id);
	return file ? `/posters/alts/${id}/${file}` : undefined;
}

export function episodePosterAlts(eid: string): string[] {
	const dir = episodePosterDir(eid);
	return episodeCatalog[eid] ?? episodeCatalog[dir] ?? [];
}

export function episodePosterPick(eid: string): string | undefined {
	const dir = episodePosterDir(eid);
	return (
		sessionEpisodePosters[eid] ??
		sessionEpisodePosters[dir] ??
		savedEpisodePosters[eid] ??
		savedEpisodePosters[dir] ??
		episodeCatalog[eid]?.[0] ??
		episodeCatalog[dir]?.[0]
	);
}

/** 3:4 movie poster under the episode thumbnail. Separate from the 2:1 still. */
export function episodePosterSrc(eid: string): string | undefined {
	const file = episodePosterPick(eid);
	if (!file) return undefined;
	return `/posters/episodes/${episodePosterDir(eid)}/${file}`;
}

/** Ensemble key art prefers `poster.jpg` over a single-face portrait pick. */
export function episodeEnsembleSrc(eid: string): string | undefined {
	const dir = episodePosterDir(eid);
	const alts = episodePosterAlts(eid);
	const file = alts.includes('poster.jpg') ? 'poster.jpg' : episodePosterPick(eid);
	return file ? `/posters/episodes/${dir}/${file}` : undefined;
}

export function episodeThumbAlts(eid: string): string[] {
	return episodeThumbCatalog[eid] ?? [];
}

export function episodeThumbPick(eid: string): string | undefined {
	return sessionEpisodeThumbs[eid] ?? savedEpisodeThumbs[eid] ?? episodeThumbCatalog[eid]?.[0];
}

/** Dedicated 2:1 list thumb. Separate from the 3:4 episode poster. */
export function episodeThumbSrc(eid: string): string | undefined {
	const file = episodeThumbPick(eid);
	return file ? `/posters/episodes/${eid}/${file}` : undefined;
}

function defaultCoverFile(id: string): string | undefined {
	const alts = posterAlts(id);
	if (alts.includes('story.jpg')) return 'story.jpg';
	if (alts.includes('manga.jpg')) return 'manga.jpg';
	return session[id] ?? saved[id] ?? alts[0];
}

/** Saved face, ignoring a live preview. Same file on the title page and /books. */
export function coverPick(id: string): string | undefined {
	return sessionCovers[id] ?? savedCovers[id] ?? session[id] ?? saved[id] ?? defaultCoverFile(id);
}

/** Alternate currently shown: a preview, else the shared cover pick. */
export function coverFile(id: string): string | undefined {
	return preview[id] ?? coverPick(id);
}

/** Preview → cover pick → poster pick → story / manga / first alt. */
function faceFile(id: string): string | undefined {
	void coverTick;
	return coverFile(id);
}

/** Same face as posterSrc — /books, /episodes, and the title page share this. */
export function volumeCover(id: string): string | undefined {
	return posterSrc(id);
}

export function isPoster(id: string, file: string): boolean {
	return isCover(id, file);
}

export function isCover(id: string, file: string): boolean {
	void coverTick;
	return coverPick(id) === file;
}

export function isCoverPreview(id: string, file: string): boolean {
	void coverTick;
	return preview[id] === file;
}

/** Show this alternate on the 3D book without writing. */
export function previewCover(id: string, file: string) {
	preview[id] = file;
	coverTick += 1;
}

/** Make this alternate the shared face. Writes cover-picks and poster-picks. */
export async function setCover(id: string, file: string): Promise<boolean> {
	const savedPick = await busyEdit<{ ok: true }>(
		`cover:${id}`,
		resolve('/api/cover'),
		{ id, file },
		'Cover failed'
	);
	if (!savedPick) return false;
	await busyEdit<{ ok: true }>(`poster:${id}`, resolve('/api/poster'), { id, file }, 'Poster failed');
	sessionCovers[id] = file;
	session[id] = file;
	delete preview[id];
	coverTick += 1;
	return true;
}

/** Same write as setCover — title-page "poster" and volume cover are one pick. */
export async function setPoster(id: string, file: string): Promise<boolean> {
	return setCover(id, file);
}
