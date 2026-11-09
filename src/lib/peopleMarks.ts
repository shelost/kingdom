/** The ten peoples, each with one mark on the map. Keyed by civilization nation id. */
export type PeopleMarkId =
	| 'taegeuk'
	| 'chrysanthemum'
	| 'dragon'
	| 'om'
	| 'eagle'
	| 'horse'
	| 'lion'
	| 'crescent'
	| 'sail'
	| 'knot';

export const PEOPLE_MARK: Partial<Record<string, PeopleMarkId>> = {
	samhan: 'taegeuk',
	wa: 'chrysanthemum',
	hwa: 'dragon',
	cheonchuk: 'om',
	bullim: 'eagle',
	'northern-nomads': 'horse',
	persia: 'lion',
	daesik: 'crescent',
	'southern-seas': 'sail',
	tubo: 'knot'
};
