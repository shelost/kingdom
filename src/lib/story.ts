// Types for the story data. The content itself lives in ./data/story.json
// and is edited visually at /edit (dev only) or by hand in the JSON file.

export interface ImageSlot {
	id: string; // future filename, e.g. "sunduk-crown"
	ratio: number; // width / height of the strip
	tone?: string; // placeholder background hint
}

export type Block =
	| { kind: 'p'; html: string }
	// `en` is the English rendering of `lines`, index-for-index
	| { kind: 'dialogue'; chip: string; lines: string[]; en?: string[]; speaker?: string; person?: string }
	| { kind: 'cite'; html: string } // "• 👑 King Mu (51) of Baekje"
	| { kind: 'verse'; color: string; lines: string[] }
	| { kind: 'table'; head: string[]; rows: string[][]; colors?: string[] }
	| { kind: 'hanja'; chars: { char: string; gloss: string }[]; after?: string }
	// A mini-flashback that interrupts an entry mid-scroll.
	| { kind: 'flashback'; year?: string; title?: string; blocks: Block[] };

export interface Entry {
	year: string;
	sub?: string; // "February", "???"
	flash?: boolean; // renders on a tinted band — a flashback to an earlier era
	flashTone?: string; // band color; defaults to grey (founding myths use kingdom colors)
	accent?: string; // episode title color — battle entries use red
	title: string; // "Queen Sunduk"
	subtitle?: string; // "선덕여왕"
	badges?: string[]; // emoji / flag chips under the title
	music?: string; // track name — shows in the player tag while this entry is read
	images: ImageSlot[];
	blocks: Block[];
}

export interface Chapter {
	id: string;
	part?: string; // "Part I" — renders a full title page before this chapter
	partTitle?: string; // "The Three Kingdoms"
	partKorean?: string; // "삼국시대"
	partHanja?: string; // "三國時代"
	title: string; // "The King of Samhan"
	hanja?: string; // "三韓王儉"
	korean?: string; // "삼한왕검"
	range: string; // "632–642"
	entries: Entry[];
}

import raw from './data/story.json';

export const chapters = raw as unknown as Chapter[];
