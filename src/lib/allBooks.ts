/**
 * Every volume, stacked as one shelf. Poses are stored under the `all` key so
 * the home shelves keep the positions they were packed with.
 */
import { BOOK_PARTS, VOLUMES, mountShelf, type BookVolume, type ShelfRow } from './books';
import { GODKING_ROWS, GODKING_VOLUMES } from './godKingBooks';
import { OURLAND_ROWS, OURLAND_VOLUMES } from './ourLandBooks';
import { REIGNMAKER_ROWS, REIGNMAKER_VOLUMES } from './reignmakerBooks';
import { SEED_ROWS, SEED_VOLUMES } from './seedBooks';

export type AllSection = { id: string; en: string; ko: string; rows: ShelfRow[]; volumes: BookVolume[] };

export const ALL_SECTIONS: AllSection[] = [
	{ id: 'chronicle', en: 'King for All', ko: '삼한왕검', rows: BOOK_PARTS, volumes: VOLUMES },
	{ id: 'godking', en: 'The God King', ko: '후삼제왕', rows: GODKING_ROWS, volumes: GODKING_VOLUMES },
	{ id: 'reignmaker', en: 'Kingmaker', ko: '태종대왕', rows: REIGNMAKER_ROWS, volumes: REIGNMAKER_VOLUMES },
	{ id: 'ourland', en: 'Breaking', ko: '대한사람', rows: OURLAND_ROWS, volumes: OURLAND_VOLUMES },
	{ id: 'seed', en: 'Seed', ko: '씨알소리', rows: SEED_ROWS, volumes: SEED_VOLUMES }
];

export const ALL_ROWS: ShelfRow[] = ALL_SECTIONS.flatMap((section) => section.rows);
export const ALL_VOLUMES = [...VOLUMES, ...GODKING_VOLUMES, ...REIGNMAKER_VOLUMES, ...OURLAND_VOLUMES, ...SEED_VOLUMES];

mountShelf('all', ALL_ROWS);
