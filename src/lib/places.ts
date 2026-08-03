/**
 * Places on the Samhan map (three_kingdoms_map.svg, viewBox 0 0 595 842).
 *
 * Names and marker shapes follow the labelled map:
 *   ● fortress/city   ▲ mountain   ◆ river   ■ harbour   ◇ cavern
 * Coordinates were calibrated by sampling the map's own pixels, so each marker
 * sits inside the territory it belongs to. Identifications follow the
 * conventional ones (Samguk Sagi / namu.wiki): 대야성=합천, 황산벌=논산,
 * 안시성=요녕 해성, 살수=청천강, 백강·기벌포=금강 하구, 매소성=연천.
 *
 * Every place also doubles as a profile (entity: 'place') so the side panel,
 * prose links, and map can open the same record.
 */

import type { LifeEvent, Person } from '$lib/people';

export type PlaceKind = 'city' | 'mountain' | 'river' | 'harbor' | 'cave';

export const PLACE_KIND_LABEL: Record<PlaceKind, string> = {
	city: 'City / Fortress',
	mountain: 'Mountain',
	river: 'River',
	harbor: 'Harbour',
	cave: 'Cavern'
};

export interface Place {
	id: string;
	name: string;
	korean?: string;
	hanja?: string;
	x: number;
	y: number;
	kind: PlaceKind;
	/** whose land it is — drives the marker colour */
	side: 'silla' | 'baekje' | 'goguryeo' | 'tang' | 'gaya' | 'yamato' | 'tamla' | 'other';
	/** a royal capital: drawn with a gold ring and its Korean name shown */
	capital?: boolean;
	/** one line for the hover explainer / profile tagline */
	blurb: string;
	/** longer profile copy */
	arc?: string;
	/** profile portrait / location art */
	avatar?: string;
	title?: string;
	events?: LifeEvent[];
	aliases?: string[];
	/** draw the label to the left of the marker, to avoid collisions */
	labelLeft?: boolean;
	/** sits outside the map frame; not drawn as a permanent marker */
	offMap?: boolean;
}

export const PLACES: Record<string, Place> = {
	// ————————————————————————— Goguryeo —————————————————————————
	pyongyang: {
		id: 'pyongyang',
		labelLeft: true,
		name: 'Pyongyang',
		korean: '평양성',
		x: 258,
		y: 505,
		kind: 'city',
		side: 'goguryeo',
		capital: true,
		blurb:
			'Goguryeo’s capital. Yeon Gesomun butchers the court here in 642; the walls hold every siege until they are opened from inside in 668.'
	},
	yodong: {
		id: 'yodong',
		labelLeft: true,
		name: 'Yodong',
		korean: '요동성',
		x: 167,
		y: 388,
		kind: 'city',
		side: 'goguryeo',
		blurb: 'The great western fortress guarding the Liao. Taizong storms it in the fifth month of 645.'
	},
	ansi: {
		id: 'ansi',
		labelLeft: true,
		name: 'Ansi',
		korean: '안시성',
		x: 148,
		y: 415,
		kind: 'city',
		side: 'goguryeo',
		blurb:
			'The fortress that stopped an emperor. Its commander — unnamed in the histories — held out through the summer of 645 and handed Taizong the first defeat of his life.'
	},
	central: {
		id: 'central',
		labelLeft: true,
		name: 'Central',
		korean: '중부',
		x: 272,
		y: 400,
		kind: 'city',
		side: 'goguryeo',
		blurb: 'Seat of the Central Commandery, one of Goguryeo’s Five. Its commander shouts Yeon down at the High Summit of 634.'
	},
	paektu: {
		id: 'paektu',
		labelLeft: true,
		name: 'Mt. Paektu',
		korean: '백두산',
		x: 318,
		y: 366,
		kind: 'mountain',
		side: 'goguryeo',
		blurb: 'The white-headed mountain at the roof of the peninsula — the sacred boundary of the northern world.'
	},
	jupil: {
		id: 'jupil',
		name: 'Mt. Jupil',
		korean: '주필산',
		x: 172,
		y: 400,
		kind: 'mountain',
		side: 'goguryeo',
		blurb:
			'Stallion Mountain. Taizong destroys a Goguryeo field army here in the sixth month of 645 — and rejoices at gaining a brave general rather than at the victory.'
	},
	salsu: {
		id: 'salsu',
		labelLeft: true,
		name: 'Great River',
		korean: '살수 (청천강)',
		x: 248,
		y: 487,
		kind: 'river',
		side: 'goguryeo',
		blurb: 'The Salsu. Ulchi Munduk drowned an entire Sui host here in 612 — and sent its general a poem about it afterwards.'
	},
	sasu: {
		id: 'sasu',
		name: 'Snake River',
		korean: '사수',
		x: 266,
		y: 519,
		kind: 'river',
		side: 'goguryeo',
		blurb:
			'Where Yeon Gesomun destroyed the White Tiger’s army in the second month of 662 — one of the great victories of Goguryeo’s last decade.'
	},
	seokmun: {
		id: 'seokmun',
		labelLeft: true,
		name: 'Stone Gate',
		korean: '석문',
		x: 278,
		y: 524,
		kind: 'river',
		side: 'goguryeo',
		blurb: 'Seokmun. Silla’s costly defeat in the eighth month of 672, early in the war to expel the Tang.'
	},
	jolbon: {
		id: 'jolbon',
		labelLeft: true,
		name: 'Jolbon',
		korean: '졸본 (환인)',
		x: 215,
		y: 370,
		kind: 'city',
		side: 'goguryeo',
		blurb: 'Where Jumong founded Goguryeo in 37 BCE, after the fish and turtles bridged the river for him.'
	},
	gungnae: {
		id: 'gungnae',
		name: 'Gungnae Fortress',
		korean: '국내성 (집안)',
		x: 228,
		y: 382,
		kind: 'city',
		side: 'goguryeo',
		blurb: 'The second capital, and the site of the Gwanggaeto Stele. Wei troops sacked it in 244.'
	},

	// ————————————————————————— Silla —————————————————————————
	surabol: {
		id: 'surabol',
		name: 'Surabol',
		korean: '서라벌 (경주)',
		x: 390,
		y: 630,
		kind: 'city',
		side: 'silla',
		capital: true,
		blurb:
			'Silla’s capital. Queen Sunduk is crowned here in 632, Bidam rebels at its Fortress of Radiance in 647, and Munmu is proclaimed King of Samhan here in 676.'
	},
	steam_cavern: {
		id: 'steam_cavern',
		name: 'Steam Cavern',
		korean: '김 동굴',
		hanja: '蒸洞窟',
		x: 368,
		y: 618,
		kind: 'cave',
		side: 'silla',
		labelLeft: true,
		avatar: '/places/steam_cavern.png',
		title: 'Yushin’s cavern lake in the hills',
		blurb:
			'A bowl of black water under stone — the only room in Silla where no one asks Kim Yushin for a victory.',
		arc: 'Between campaigns the marshal rides alone into the hills, strips at the rock lip, and bathes in cold steam. Narim, Golhwa and Hyullé are already waiting: mentors, tormentors, a comfort he will not name in any memorial. The lake does not require prayer. It requires honesty — about Baekje’s hurry, about Yeon’s door, about a queen whose title he still says even when naked. The histories keep the fortresses. This place keeps the man.',
		events: [
			{ label: 'Yushin first finds the three in the steam between border campaigns.' },
			{ year: 642, label: 'After Daeya he returns for quiet counsel before the road north.' },
			{ year: 647, label: 'The night before Bidam, he washes his face here for the capital to watch.' },
			{ year: 673, label: 'Old, between paperwork wars, he still takes the warm ledge Hyullé keeps.' }
		],
		aliases: [
			'Steam Cavern',
			'steam cavern',
			'cavern lake',
			'김 동굴',
			'동굴 호수',
			'Steam Cavern Lake'
		]
	},
	maeso: {
		id: 'maeso',
		labelLeft: true,
		name: 'Maeso',
		korean: '매소성 (연천)',
		x: 305,
		y: 538,
		kind: 'city',
		side: 'silla',
		blurb: 'Maeso Fortress. In the ninth month of 675 Silla broke a Tang army here and turned the Silla–Tang war.'
	},
	wirye: {
		id: 'wirye',
		name: 'Wirye',
		korean: '위례성 (서울)',
		x: 314,
		y: 562,
		kind: 'city',
		side: 'silla',
		blurb:
			'Baekje’s first capital, founded by Onjo — and by the 640s the contested Han valley that all three kingdoms had held in turn.'
	},
	danghang: {
		id: 'danghang',
		labelLeft: true,
		name: 'Danghang',
		korean: '당항성 (화성)',
		x: 298,
		y: 576,
		kind: 'harbor',
		side: 'silla',
		blurb:
			'Silla’s only harbour to Tang, Tianzhu and the western regions. Euija points at it on the map and tells Yeon exactly where to cut.'
	},
	daeya: {
		id: 'daeya',
		name: 'Daeya',
		korean: '대야성 (합천)',
		x: 336,
		y: 640,
		kind: 'city',
		side: 'silla',
		blurb:
			'The border fortress lost in the eighth month of 642. Chunchu’s daughter Gotaso died here, and the war that ends three kingdoms starts from it.'
	},
	gibeolpo: {
		id: 'gibeolpo',
		labelLeft: true,
		name: 'Strike Harbor',
		korean: '기벌포 (장항)',
		x: 287,
		y: 649,
		kind: 'harbor',
		side: 'silla',
		blurb:
			'Gibeolpo, at the mouth of the Geum. Seongchung died in prison begging Euija to hold it; in the eleventh month of 676 Silla’s victory here ended the Tang war.'
	},

	// ————————————————————————— Baekje —————————————————————————
	sabi: {
		id: 'sabi',
		labelLeft: true,
		name: 'Sabi',
		korean: '사비 (부여)',
		x: 305,
		y: 618,
		kind: 'city',
		side: 'baekje',
		capital: true,
		blurb:
			'Baekje’s last capital. Euija seats forty-one of his own sons in the Assembly here in 655, and the city falls to the Silla–Tang army in 660.'
	},
	hwangsan: {
		id: 'hwangsan',
		name: 'Yellow Mountain',
		korean: '황산벌 (논산)',
		x: 322,
		y: 600,
		kind: 'mountain',
		side: 'baekje',
		blurb:
			'Hwangsanbeol. Gyebek met fifty thousand with five thousand here in 660, having killed his own family first so nothing could be used against him.'
	},
	baekgang: {
		id: 'baekgang',
		labelLeft: true,
		name: 'White River',
		korean: '백강 (금강 하구)',
		x: 293,
		y: 631,
		kind: 'river',
		side: 'baekje',
		blurb:
			'The Baekgang. In the eighth month of 663 Tang, Silla, Baekje and Yamato fought here — the first time all four met in one battle — and four hundred eastern ships burned.'
	},
	ungjin: {
		id: 'ungjin',
		labelLeft: true,
		name: 'Bear Fortress',
		korean: '웅진성 (공주)',
		x: 313,
		y: 595,
		kind: 'city',
		side: 'baekje',
		blurb: 'Ungjin. Euija fled here when Sabi fell, and its guardian Ye Sikjin handed him to the Tang.'
	},
	juryu: {
		id: 'juryu',
		name: 'Juryu Fortress',
		korean: '주류성 (부안)',
		x: 301,
		y: 649,
		kind: 'city',
		side: 'baekje',
		blurb: 'Base of the Baekje restoration. Prince Pung moved off it against advice, had to move back, and executed Boksin here.'
	},
	imjon: {
		id: 'imjon',
		labelLeft: true,
		name: 'Imjon Fortress',
		korean: '임존성 (예산)',
		x: 293,
		y: 606,
		kind: 'city',
		side: 'baekje',
		blurb: 'Where Heukchi Sangji rallied thirty thousand within ten days of Sabi’s fall.'
	},
	gwansan: {
		id: 'gwansan',
		name: 'Gwansanseong',
		korean: '관산성 (옥천)',
		x: 330,
		y: 600,
		kind: 'city',
		side: 'baekje',
		blurb:
			'Where Jinheung’s betrayal ended: King Seong of Baekje was caught riding at night in 554, and a stable-slave named Dodo took his head.'
	},
	michuhol: {
		id: 'michuhol',
		labelLeft: true,
		name: 'Michuhol',
		korean: '미추홀 (인천)',
		x: 298,
		y: 551,
		kind: 'city',
		side: 'baekje',
		blurb: 'The salt marshes Biryu chose over his brother’s ground — and regretted.'
	},

	// ————————————————————————— Gaya, Tamla, beyond —————————————————————————
	geumgwan: {
		id: 'geumgwan',
		name: 'Golden Gaya',
		korean: '금관가야 (김해)',
		x: 385,
		y: 648,
		kind: 'city',
		side: 'gaya',
		blurb:
			'Founded in 42 by Suro, who hatched from one of six eggs. Its last prince surrendered to Silla in 532 — his grandson was Kim Yushin.'
	},
	daegaya: {
		id: 'daegaya',
		labelLeft: true,
		name: 'Great Gaya',
		korean: '대가야 (고령)',
		x: 368,
		y: 630,
		kind: 'city',
		side: 'gaya',
		blurb: 'The last Gaya kingdom, taken by Jinheung and the young Hwarang Sadaham in 562.'
	},
	mugun: {
		id: 'mugun',
		labelLeft: true,
		name: 'Mugun',
		korean: '무근 (탐라)',
		x: 288,
		y: 743,
		kind: 'city',
		side: 'tamla',
		capital: true,
		blurb:
			'The seat of Tamla, the island of oranges. Gyebek spent five years exiled here learning its stories, and in 662 the island changed sides.'
	},
	manchuria: {
		id: 'manchuria',
		name: 'The Eastern March',
		korean: '만주 동부',
		x: 300,
		y: 320,
		kind: 'mountain',
		side: 'goguryeo',
		blurb:
			'Yeon Gesomun’s frontier command — the snowbound outposts where he made the Eastern Commandery the safest in the kingdom, and the capital hated him for it.'
	},
	asadal: {
		id: 'asadal',
		labelLeft: true,
		name: 'Asadal',
		korean: '아사달',
		x: 246,
		y: 518,
		kind: 'city',
		side: 'other',
		blurb: 'Dangun’s city, and later Wanggeom — the capital of Old Joseon, which fell to the Han in 108 BCE.'
	},
	buyeo_north: {
		id: 'buyeo_north',
		name: 'Buyeo',
		korean: '부여',
		x: 280,
		y: 270,
		kind: 'city',
		side: 'other',
		blurb: 'The northern kingdom Jumong fled, and where Lady Ye raised his heir alone.'
	},
	changan: {
		id: 'changan',
		name: 'Chang’an',
		korean: '장안',
		x: 40,
		y: 470,
		kind: 'city',
		side: 'tang',
		offMap: true,
		blurb:
			'The Tang capital, largest city on earth. Chunchu wins his alliance here in 648; Euija dies here a prisoner in 660.'
	},
	asuka: {
		id: 'asuka',
		name: 'Asuka',
		korean: '아스카 (왜)',
		x: 500,
		y: 726,
		kind: 'city',
		side: 'yamato',
		offMap: true,
		blurb:
			'Yamato’s court. Chunchu came asking for troops in 647 and was refused; fifteen years later it sent forty thousand men to die for Baekje.'
	}
};

/** Markers drawn permanently on the map (off-map sites are omitted). */
export const MAP_MARKERS = Object.values(PLACES).filter((p) => !p.offMap);

/** entry title → place id. Titles are unique across the story. */
export const ENTRY_PLACE: Record<string, string> = {
	// Part I
	'Queen Sunduk': 'surabol',
	'Jinheung, The Crescent Moon': 'gwansan',
	'The Eight Great Clans': 'sabi',
	'Gunchogo, The Hurricane': 'pyongyang',
	'The Summit': 'pyongyang',
	'Gwanggaeto, The Conqueror': 'surabol',
	'Gotaso’s Wedding': 'surabol',
	'Yeon’s Three Sons': 'gungnae',
	'King Euija, the 31st Eraha': 'sabi',
	'Jinheung’s Betrayal': 'gwansan',
	'Daeya Fortress': 'daeya',
	'Steam, Again': 'steam_cavern',
	'Yeon’s Massacre': 'pyongyang',
	'Chunchu & Gesomun': 'pyongyang',
	'Euija & Gesomun': 'pyongyang',
	'Kim Yushin': 'steam_cavern',
	'Li Shimin, the 2nd Huangdi': 'changan',
	// Part II
	'Emperor of the West': 'changan',
	'Great River': 'salsu',
	'Eastern Fortress': 'yodong',
	'Stallion Mountain': 'jupil',
	'Boiling River': 'gungnae',
	'Jumong': 'jolbon',
	'Ansi': 'ansi',
	'The Harmony Council': 'surabol',
	'Chunchu Goes to the East': 'asuka',
	'Bidam’s Rebellion': 'surabol',
	'Gaya, the Lost Nations': 'geumgwan',
	'The Fall of Gaya': 'daegaya',
	'Silla-Tang Alliance': 'changan',
	'Death of Taizong': 'changan',
	'King Muyeol': 'surabol',
	'Hyukgose': 'surabol',
	// Part III
	'Gyebek’s Exile': 'mugun',
	'Tamla, the Island of Oranges': 'mugun',
	'Euija’s Coup': 'sabi',
	'Euija’s Descent': 'sabi',
	'The Nine Plagues': 'sabi',
	'The Three Loyalists': 'sabi',
	'Onjo': 'michuhol',
	'Dangun & Old Joseon': 'asadal',
	'Yellow Mountain Fields': 'hwangsan',
	'Sabi Palace': 'ungjin',
	'The Death of Buyeo Euija': 'changan',
	'The Seven Branched Sword': 'sabi',
	'The Death of Kim Chunchu': 'surabol',
	'Baekje Restoration Society': 'juryu',
	'The Four Beasts': 'changan',
	'Gija & Wiman': 'asadal',
	'Pyongyang Fortress': 'pyongyang',
	'Snake River': 'sasu',
	'The Surrender of Tamla': 'mugun',
	'White River': 'baekgang',
	'The Death of Yeon Gesomun': 'pyongyang',
	'The Brothers’ Coup': 'pyongyang',
	'The Final Stand': 'pyongyang',
	'The Fall of Joseon': 'asadal',
	'Goguryeo Revival Society': 'surabol',
	'Stone Gate': 'seokmun',
	'The Lake Remembers': 'steam_cavern',
	'The Death of Kim Yushin': 'surabol',
	'Maeso Fortress': 'maeso',
	'Strike Harbor': 'gibeolpo',
	'The King for All': 'surabol',
	'Unified Silla': 'surabol',
	'Balhae': 'jolbon'
};

export function placeFor(entryTitle: string): Place | null {
	const id = ENTRY_PLACE[entryTitle];
	return id ? (PLACES[id] ?? null) : null;
}

/** Bridge: every map place is also a side-panel profile. */
export function toPlacePerson(p: Place): Person {
	const aliases = p.aliases?.length
		? p.aliases
		: [p.name, ...(p.korean ? [p.korean.split(/[\s(]/)[0]] : [])].filter(Boolean);

	return {
		id: p.id,
		name: p.name,
		korean: p.korean,
		hanja: p.hanja,
		title: p.title ?? PLACE_KIND_LABEL[p.kind],
		entity: 'place',
		kingdom: p.side,
		avatar: p.avatar,
		tagline: p.blurb,
		arc: p.arc,
		events: p.events,
		aliases
	};
}

export const PLACE_PROFILES: Person[] = Object.values(PLACES).map(toPlacePerson);
