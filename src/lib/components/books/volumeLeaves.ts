import type { BookVolume } from '$lib/books';
import { episodePosterSrc, volumeCover } from '$lib/posters.svelte';

/** One face of the open volume on /books. */
export type VolumeLeaf = {
	id: string;
	kind: 'cover' | 'title' | 'episode';
	heading: string;
	sub?: string;
	body?: string;
	meta?: string;
	/** Jump into /read from this leaf when set. */
	queryId?: string;
	poster?: string;
	cover?: string;
};

function lengthOf(words: number, minutes: number, ko: boolean): string {
	const step = words >= 500 ? 100 : 50;
	const n = (Math.round(words / step) * step).toLocaleString('en-US');
	return ko ? `약 ${n}단어 · ${minutes}분` : `~${n} words · ${minutes} min`;
}

/** Title leaf, then one leaf per episode — paired into spreads by the open book. */
export function leavesOf(volume: BookVolume, ko: boolean): VolumeLeaf[] {
	const cover = volumeCover(volume.id);
	const title = ko ? volume.ko || volume.title : volume.title;
	const second = ko ? volume.title : volume.ko;
	const blurb = ko ? volume.blurb.ko || volume.blurb.en : volume.blurb.en;
	const leaves: VolumeLeaf[] = [
		{
			id: `${volume.id}:cover`,
			kind: 'cover',
			heading: title,
			sub: second || undefined,
			cover,
			queryId: volume.queryId
		},
		{
			id: `${volume.id}:title`,
			kind: 'title',
			heading: title,
			sub: second || undefined,
			body: blurb || undefined,
			meta: `${volume.part} · ${volume.range} · ${volume.episodes}${ko ? '화' : volume.episodes === 1 ? ' episode' : ' episodes'}`,
			queryId: volume.queryId
		}
	];

	for (const chapter of volume.chapters) {
		const heading = ko ? chapter.ko || chapter.title : chapter.title;
		leaves.push({
			id: chapter.id,
			kind: 'episode',
			heading,
			sub: chapter.number,
			meta: `${chapter.year} · ${lengthOf(chapter.words, chapter.minutes, ko)}`,
			queryId: chapter.queryId,
			poster: episodePosterSrc(chapter.id)
		});
	}

	return leaves;
}

/** Spread index → left/right leaves (right may be empty on the last odd page). */
export function spreadOf(
	leaves: VolumeLeaf[],
	spread: number
): { left?: VolumeLeaf; right?: VolumeLeaf } {
	const i = Math.max(0, spread) * 2;
	return { left: leaves[i], right: leaves[i + 1] };
}

export function spreadCount(leaves: VolumeLeaf[]): number {
	return Math.max(1, Math.ceil(leaves.length / 2));
}

/** Prefer the right leaf's episode, then the left, then the volume start. */
export function continueQuery(
	leaves: VolumeLeaf[],
	spread: number,
	fallback: string
): string {
	const { left, right } = spreadOf(leaves, spread);
	return right?.queryId || left?.queryId || fallback;
}
