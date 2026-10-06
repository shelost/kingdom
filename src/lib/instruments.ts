/**
 * Instruments of the chronicle — each one is a wiki profile
 * (`entity: 'instrument'`), the same way `animals.ts` turns horses into profiles.
 *
 * `board` is the object board in `static/obj_*` (also a GenerateImage ref);
 * `cover` is the story still where someone plays it. Stills attach to an
 * instrument when they ref its board, or name it in the slot id or alt
 * (see `buildBoardSceneIndex` in `wikiScenes.ts`).
 */

import type { LifeEvent, Person } from '$lib/people';

interface InstrumentDef {
	id: string;
	name: string;
	ko: string;
	hanja?: string;
	/** Other names that identify it in a still id / alt (`pipa`, `konghou`). */
	altNames?: string[];
	kingdom: Person['kingdom'];
	/** Real light of the instrument — its wood or lacquer. */
	color: string;
	title: string;
	board: string;
	/** Story still used as the card and hero art. */
	cover?: string;
	/** Build line beside the board. */
	build: string;
	tagline: string;
	arc: string;
	/** Person ids who play it in the chronicle (most prominent first). */
	players: string[];
	events?: LifeEvent[];
}

const INSTRUMENT_DEFS: InstrumentDef[] = [
	{
		id: 'gayageum',
		name: 'Gayageum',
		ko: '가야금',
		hanja: '伽倻琴',
		kingdom: 'gaya',
		color: '#C9A46A',
		title: 'Twelve-string zither of Gaya',
		board: '/obj_gayageum.jpg',
		cover: '/scene_sunduk_gayageum.png',
		build: 'Long hollow paulownia board, twelve silk strings on movable bridges, ram’s-horn tail at the foot; played across the lap.',
		tagline: 'Gaya’s twelve strings, one for each month — the country did not outlast its instrument.',
		arc: 'King Gasil of Gaya looked at the Chinese zheng and decided a country with its own language ought to have its own strings. He had one built, twelve strings for the twelve months, and set the court musician Ureuk to write twelve songs for it, one for each district. When Gaya began to come apart, Ureuk took the instrument and his pupil and walked over to Silla, where King Jinheung heard him play at Nangseong and gave him three students and a house. His ministers said the music of a fallen country was unlucky. Jinheung said Gaya had fallen because of its king, not its songs, and kept the zither. In the palace at Seorabeol, Sunduk plays it in the lamplight when nobody important is in the room.',
		players: ['sunduk'],
		events: [
			{ year: 551, label: 'Ureuk plays for King Jinheung at Nangseong; the gayageum comes to Silla.' },
			{ year: 562, label: 'Daegaya falls. The instrument stays in Silla.' }
		]
	},
	{
		id: 'geomungo',
		name: 'Geomungo',
		ko: '거문고',
		hanja: '玄琴',
		kingdom: 'goguryeo',
		color: '#3A2A1E',
		title: 'Six-string black crane zither of Goguryeo',
		board: '/obj_geomungo.jpg',
		cover: '/scene_dosuryu_geomungo.png',
		build: 'Dark paulownia body, six silk strings over sixteen high frets and three movable bridges; struck with a short bamboo pick.',
		tagline: 'Built from a Chinese qin nobody could play, and named for the black crane that came to dance.',
		arc: 'The Jin court sent Goguryeo a seven-string qin and no one who knew how to play it. The prime minister Wang Sanak kept its shape and changed everything else: six strings, high frets, and a bamboo pick to strike them like a drum. The first time he played the new instrument a black crane came down into the courtyard and danced, so it was called hyeonhakgeum, the black crane zither, until the crane dropped out of the name. It is the heaviest sound in the country and the most stubborn, which is why old generals like it. Dosuryu keeps one under the eaves and plays it alone, bent over the strings, with his beard in the way.',
		players: ['dosuryu'],
		events: [{ label: 'Wang Sanak rebuilds the Jin seven-string qin; a black crane comes to dance.' }]
	},
	{
		id: 'daegeum',
		name: 'Daegeum',
		ko: '대금',
		hanja: '大笒',
		altNames: ['transverse flute'],
		kingdom: 'silla',
		color: '#9C8A4A',
		title: 'Great bamboo flute of Silla',
		board: '/obj_daegeum.png',
		cover: '/scene_chunchu_daegeum.png',
		build: 'Long yellow bamboo flute held sideways, six finger-holes and a reed-membrane hole that makes the low notes buzz.',
		tagline: 'The largest of Silla’s three bamboos — and, in the legend, the flute that calms ten thousand waves.',
		arc: 'Silla counts three bamboos, the great, middle and small flutes, and the great one is the voice that carries over a battlefield or a funeral. A thin skin of reed membrane over one hole makes the low notes buzz, so the flute sounds as if it is arguing with itself. Later Silla will tell a story about a bamboo that floated in from the sea in two halves, joined at night, and was cut into the flute Manpasikjeok: play it and enemies withdraw, sickness lifts, and the waves lie down. Chunchu plays one the way he does everything, in a dark corridor, with the timing worked out in advance.',
		players: ['chunchu', 'gumilwife'],
		events: [{ year: 682, label: 'Legend of Manpasikjeok, the flute that calms ten thousand waves.' }]
	},
	{
		id: 'wolgeum',
		name: 'Wolgeum',
		ko: '월금',
		hanja: '月琴',
		altNames: ['moon lute', 'ruan'],
		kingdom: 'goguryeo',
		color: '#B8864B',
		title: 'Round moon lute',
		board: '/obj_wolgeum.png',
		cover: '/scene_bidam_wolgeum.png',
		build: 'Round flat soundbox like a full moon, a long fretted neck with four strings and four tuning pegs.',
		tagline: 'A full moon on a stick — painted on the walls of Goguryeo tombs and played in the dark of Silla halls.',
		arc: 'The round lute came east along the same roads as the Buddhist sutras and ended up painted on the walls of Goguryeo tombs, where musicians in long sleeves play it for the dead. The body is a full moon, which is where the name comes from, and the sound is drier and quicker than the zithers. Bidam plays one alone at night in an empty hall, cross-legged, in the one shaft of light: the only person in Silla who can make a Goguryeo lute sound like a sutra.',
		players: ['bidam']
	},
	{
		id: 'gonghu',
		name: 'Gonghu',
		ko: '공후',
		hanja: '箜篌',
		altNames: ['konghou', 'harp'],
		kingdom: 'baekje',
		color: '#7A3B22',
		title: 'Dragon-headed harp of Baekje',
		board: '/obj_gonghu.png',
		cover: '/scene_euija_gonghu.png',
		build: 'Tall curved soundbox ending in a carved dragon head, twenty-odd strings dropping to a footed base; played upright, with both hands.',
		tagline: 'The harp Yamato called the Baekje zither — and the one instrument Euija is quiet for.',
		arc: 'The vertical harp came from the far west by way of China and found a home in Baekje, which played it so often that the Yamato court, receiving one, simply called it kudaragoto, the Baekje zither; one still sits in the imperial storehouse at Nara. The tall frame ends in a dragon head and the strings fall from it like rain. In Chang’an the Empress Wu sits behind a screen with a konghou in her arm and lets the frame do the talking. In Sabi, at night, in an empty palace yard, King Euija plays the gonghu by one small lamp, and for once says nothing at all.',
		players: ['euija', 'wuzetian'],
		events: [{ label: 'Baekje musicians bring the gonghu to Yamato, where it is called kudaragoto.' }]
	},
	{
		id: 'bipa',
		name: 'Bipa',
		ko: '비파',
		hanja: '琵琶',
		altNames: ['pipa'],
		kingdom: 'tang',
		color: '#C08A4A',
		title: 'Pear-bodied lute',
		board: '/obj_bipa.png',
		cover: '/scene_xue-lady-liu_39.jpg',
		build: 'Pear-shaped wooden body, four strings over a short fretted neck with a bent-back pegbox; held upright on the knee.',
		tagline: 'The Tang court’s lute; Silla built its own five-string cousin and counted it among the three strings.',
		arc: 'In Chang’an the pear-shaped lute is everywhere: in the palace, the wine shops, the poems about wine shops. Silla took the shape, gave it five strings and a straight neck, and called it the hyangbipa, the native lute, one of the three strings of Silla music beside the gayageum and the geomungo. Lady Liu plays the Tang four-string kind for Xue Rengui, upright on her knee, while he is away being famous.',
		players: ['xueliu'],
		events: [{ label: 'Silla’s five-string hyangbipa joins the gayageum and geomungo as the three strings (삼현).' }]
	},
	{
		id: 'haegeum',
		name: 'Haegeum',
		ko: '해금',
		hanja: '奚琴',
		kingdom: 'other',
		color: '#8A5A3A',
		title: 'Two-string fiddle',
		board: '/obj_haegeum.jpg',
		build: 'Small bamboo-and-wood soundbox on a tall neck, two silk strings, a horsehair bow threaded between them.',
		tagline: 'The fiddle that has not reached the peninsula yet — in this chronicle, only the soundtrack plays it.',
		arc: 'A small soundbox, a tall neck, two silk strings and a bow threaded between them so that it can never be taken away. It belongs to the Xi people of the northern steppe, whose name it carries, and it will not cross into Korea until Goryeo, four centuries after everyone in this chronicle is dead. Until then it lives only in the score, where it does the crying the characters are too proud to do.',
		players: []
	}
];

/** Profile id for an instrument — prefixed so it never collides with a person id. */
export function instrumentProfileId(id: string): string {
	return `instrument-${id}`;
}

function toInstrumentPerson(def: InstrumentDef): Person {
	return {
		id: instrumentProfileId(def.id),
		name: def.name,
		korean: def.ko,
		hanja: def.hanja,
		entity: 'instrument',
		kingdom: def.kingdom,
		color: def.color,
		title: def.title,
		tagline: def.tagline,
		arc: def.arc,
		events: def.events,
		owners: def.players,
		ownersLabel: 'Played by',
		avatar: def.cover ?? def.board,
		objectImage: def.board,
		object: def.build,
		aliases: [...new Set([def.name, def.ko, ...(def.hanja ? [def.hanja] : [])])]
	};
}

export const INSTRUMENT_INDEX: { profileId: string; boards: string[]; names: string[] }[] =
	INSTRUMENT_DEFS.map((def) => ({
		profileId: instrumentProfileId(def.id),
		boards: [def.board],
		names: [def.name, ...(def.altNames ?? [])]
	}));

export const INSTRUMENTS: Person[] = INSTRUMENT_DEFS.map(toInstrumentPerson);
