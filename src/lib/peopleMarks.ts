/** The ten peoples, each with one mark on the map. Keyed by civilization nation id. */
export type PeopleMarkId =
	| 'taegeuk'
	| 'chrysanthemum'
	| 'taiji'
	| 'om'
	| 'eagle'
	| 'wolf'
	| 'faravahar'
	| 'kufic'
	| 'sail'
	| 'knot';

export const PEOPLE_MARK: Partial<Record<string, PeopleMarkId>> = {
	samhan: 'taegeuk',
	wa: 'chrysanthemum',
	hwa: 'taiji',
	cheonchuk: 'om',
	bullim: 'eagle',
	'northern-nomads': 'wolf',
	persia: 'faravahar',
	daesik: 'kufic',
	'southern-seas': 'sail',
	tubo: 'knot'
};
