/**
 * Conventional comic-book pages built from chronicle stills.
 * Balloons and captions live in HTML — stills stay textless.
 */

import { CHUNCHU_DEER } from '$lib/data/comics/chunchu-deer';
import { JUMONG_SUN } from '$lib/data/comics/jumong-sun';

export type BalloonCorner = 'tl' | 'tr' | 'bl' | 'br' | 'tc' | 'bc';
export type BalloonKind = 'speech' | 'thought' | 'whisper' | 'shout';
export type ComicPageKind = 'page' | 'cover' | 'chapter';
export type ComicCaptionAt = 'top' | 'bottom';
export type ComicPanelShape = 'rect' | 'circle';

export interface ComicBalloon {
	person?: string;
	speaker?: string;
	/** people.ts stage id — pin Alchun to `councillor` so year 618 does not leak the hwarang boy. */
	look?: string;
	en: string;
	ko: string;
	corner: BalloonCorner;
	kind?: BalloonKind;
}

export interface ComicLine {
	en: string;
	ko: string;
}

export interface ComicNameCard {
	hangul: string;
	roman: string;
	role: ComicLine;
}

export interface ComicCaption extends ComicLine {
	at?: ComicCaptionAt;
	corner?: BalloonCorner;
}

export interface ComicPanel {
	id: string;
	/** Story image slot id. Missing art still lays out the panel. */
	slot: string;
	cols: 3 | 4 | 5 | 6 | 8 | 12;
	rows?: 1 | 2;
	shape?: ComicPanelShape;
	balloons?: ComicBalloon[];
	caption?: ComicLine;
	captionAt?: ComicCaptionAt;
	captions?: ComicCaption[];
	card?: ComicNameCard;
	sfx?: ComicLine;
}

export interface ComicPage {
	id: string;
	n: number;
	kind?: ComicPageKind;
	title?: ComicLine;
	/** Brush hangul on the cover / chapter splash — 주몽, 사슴. */
	logo?: string;
	kicker?: ComicLine;
	ground?: string;
	footer?: ComicLine;
	panels: ComicPanel[];
}

export interface ComicStory {
	id: string;
	title: ComicLine;
	/** Chronicle episode id (`chapterId-slug`) for the “read in the book” link. */
	episodeId: string;
	year: number;
	logline: ComicLine;
	pages: ComicPage[];
}

export const COMICS: ComicStory[] = [CHUNCHU_DEER, JUMONG_SUN];

export const comicById = new Map(COMICS.map((c) => [c.id, c]));

export const DEFAULT_COMIC_ID = CHUNCHU_DEER.id;
