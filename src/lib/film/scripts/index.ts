import type { FilmScript } from '../types';
import { TIGERS } from './tigers';

/** Hand direction, keyed by the episode title. Everything else is drafted from the text. */
export const FILM_SCRIPTS: Record<string, FilmScript> = {
	'Back When Tigers Smoked': TIGERS
};
