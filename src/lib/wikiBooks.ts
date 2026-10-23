/**
 * One cloth volume per wiki category. Same VolumePreview object as /books,
 * with a slightly different face ratio and thickness so the shelf reads as a set.
 */
import { BOOK_RATIO } from '$lib/books';
import { avatarOf, PROFILES } from '$lib/people';
import { compareWikiEntries, hasRealAvatar, kindOf, type WikiKind } from '$lib/wiki';

export type WikiBookId = WikiKind | 'all';

export type WikiBookSpec = {
	id: WikiBookId;
	title: string;
	ko: string;
	spine: string;
	/** Cover height on the shelf (rem). */
	height: number;
	/** Cover width ÷ height. */
	ratio: number;
	/** Spine as a fraction of cover height. */
	thick: number;
	mark: string;
};

function book(
	id: WikiBookId,
	title: string,
	ko: string,
	spine: string,
	height: number,
	ratio: number,
	thick: number,
	mark: string
): WikiBookSpec {
	return { id, title, ko, spine, height, ratio, thick, mark };
}

/** Aspect and cloth per kind — not one cloned hardcover. */
export const WIKI_BOOKS: WikiBookSpec[] = [
	book('all', 'Wiki', '위키', '#16352c', 9.2, 0.71, 0.12, 'W'),
	book('character', 'Characters', '인물', '#2A5FB8', 8.4, BOOK_RATIO, 0.105, '人'),
	book('god', 'Gods', '신', '#C30000', 9.6, 0.53, 0.08, '神'),
	book('animal', 'Animals', '짐승', '#6b8f6a', 7.4, 0.85, 0.13, '馬'),
	book('city', 'Cities', '고을', '#c9a227', 7.8, 0.77, 0.12, '邑'),
	book('place', 'Places', '땅', '#3d6b4a', 7.6, 0.86, 0.1, '地'),
	book('nation', 'Nations', '나라', '#C41E3A', 9.4, 0.62, 0.15, '國'),
	book('phrase', 'Phrases', '말', '#ead8b0', 6.4, 0.65, 0.07, '言'),
	book('organization', 'Organizations', '조직', '#5C4A8C', 8.2, 0.74, 0.125, '制'),
	book('group', 'Groups', '무리', '#7EB8F0', 7.2, 0.72, 0.1, '衆'),
	book('clan', 'Clans', '씨족', '#8B5CF6', 8.8, 0.62, 0.135, '氏'),
	book('concept', 'Concepts', '개념', '#b8a36a', 6.8, 0.65, 0.075, '理'),
	book('sword', 'Swords', '칼', '#2c241c', 9.5, 0.47, 0.055, '劍'),
	book('instrument', 'Instruments', '악기', '#d4b86a', 7.0, 0.72, 0.09, '樂'),
	book('relationship', 'Relationships', '인연', '#D8258C', 6.6, 0.69, 0.07, '緣'),
	book('other', 'Other', '그 밖', '#3a2a1c', 7.4, 0.68, 0.09, '外')
];

const BY_ID = new Map(WIKI_BOOKS.map((b) => [b.id, b]));

export function wikiBookOf(id: WikiBookId): WikiBookSpec {
	return BY_ID.get(id) ?? WIKI_BOOKS[0]!;
}

/** Top-ranked real portrait / board for that kind; the collected volume stays cloth. */
export function wikiBookCover(id: WikiBookId): string | undefined {
	if (id === 'all') return undefined;
	const hit = PROFILES.filter((p) => kindOf(p) === id && hasRealAvatar(p)).sort(compareWikiEntries)[0];
	return hit ? (avatarOf(hit) ?? undefined) : undefined;
}

export function wikiBookCount(id: WikiBookId): number {
	if (id === 'all') return PROFILES.length;
	return PROFILES.filter((p) => kindOf(p) === id).length;
}
