/**
 * Studio-logo intros, one per kingdom: a flip-book of portraits and stills cut to the song's
 * onsets, washed in the kingdom colour, closing into a box with the kingdom's own name.
 *
 * `opening` plays slowly under the song's build-up (founders and myth). `cast` flips fast after
 * the drop, in order. `finale` is the last face before the box closes.
 */

export type IntroCast = { id: string; weight?: number };

export type KingdomIntro = {
	id: string;
	/** The word in the box. */
	title: string;
	ko: string;
	color: string;
	/** Letter colour inside the box. */
	ink?: string;
	/** Tried in order; the first file that exists plays. */
	songs: string[];
	/** Seconds into the song where the intro starts. */
	start?: number;
	/** Seconds into the song where the beat drops. Detected from the audio when left out. */
	drop?: number;
	/** Seconds of fast flipping after the drop, logo included. */
	after?: number;
	opening: string[];
	cast: IntroCast[];
	finale: string;
};

const SONGS = ['/intros/all-caps.mp3', '/intros/all-caps.m4a'];

export const INTROS: KingdomIntro[] = [
	{
		id: 'goguryeo',
		title: 'GORYEO',
		ko: '고려',
		color: '#C30000',
		songs: [...SONGS, '/mu_goguryeo.mp3'],
		opening: ['haemosu', 'jumong', 'yeontabal', 'cowchief', 'pigchief', 'dogchief', 'horsechief'],
		cast: [
			{ id: 'yuri' },
			{ id: 'daemusin' },
			{ id: 'hodong' },
			{ id: 'micheon' },
			{ id: 'gogugwon' },
			{ id: 'gwanggaeto', weight: 2 },
			{ id: 'jangsu' },
			{ id: 'munduk', weight: 1.5 },
			{ id: 'yangmanchun', weight: 1.5 }
		],
		finale: 'gesomun'
	},
	{
		id: 'silla',
		title: 'SILLA',
		ko: '신라',
		color: '#2A5FB8',
		songs: [...SONGS, '/mu_chunchu.mp3'],
		opening: ['hyukgose', 'alyoung', 'hogong', 'talhae'],
		cast: [
			{ id: 'jesang' },
			{ id: 'jinheung', weight: 1.5 },
			{ id: 'sadaham' },
			{ id: 'seohyeon' },
			{ id: 'jinpyung' },
			{ id: 'sunduk', weight: 2 },
			{ id: 'bidam', weight: 2 },
			{ id: 'alchun' },
			{ id: 'chunchu', weight: 2 },
			{ id: 'munhee' },
			{ id: 'munmu', weight: 1.5 }
		],
		finale: 'yushin'
	},
	{
		id: 'baekje',
		title: 'BAEKJE',
		ko: '백제',
		color: '#d9b13a',
		ink: '#1a1206',
		songs: [...SONGS, '/mu_euija.mp3'],
		opening: ['sosuno', 'onjo', 'biryu'],
		cast: [
			{ id: 'eldersatek' },
			{ id: 'kingmu' },
			{ id: 'sobi', weight: 1.5 },
			{ id: 'euija', weight: 2 },
			{ id: 'seongchung' },
			{ id: 'heungsu' },
			{ id: 'yunchung' },
			{ id: 'boksin' },
			{ id: 'pung' }
		],
		finale: 'gyebek'
	},
	{
		id: 'gaya',
		title: 'GAYA',
		ko: '가야',
		color: '#8B5CF6',
		songs: [...SONGS, '/mu_gaya_love.mp3'],
		opening: ['ibiga', 'suro', 'heohwangok'],
		cast: [{ id: 'jeonggyeon' }, { id: 'guhae' }],
		finale: 'muryuk'
	}
];

export const introById = new Map(INTROS.map((i) => [i.id, i]));
