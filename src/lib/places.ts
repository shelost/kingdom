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

export type PlaceKind = 'city' | 'mountain' | 'river' | 'harbor' | 'cave' | 'realm';

export const PLACE_KIND_LABEL: Record<PlaceKind, string> = {
	city: 'City / Fortress',
	mountain: 'Mountain',
	river: 'River',
	harbor: 'Harbour',
	cave: 'Cavern',
	realm: 'Realm'
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
	side: 'silla' | 'baekje' | 'goguryeo' | 'tang' | 'gaya' | 'yamato' | 'tamla' | 'underworld' | 'other';
	/**
	 * Parent city / fortress when `kind !== 'city'`.
	 * Wiki: Place → City → Kingdom. Cities themselves omit this.
	 * Cosmological sites (저승, 하늘나라) leave it unset — no earthly city.
	 * A site inside a realm (Flower Cliff in 서천꽃밭) may point at that realm.
	 */
	cityId?: string;
	/** a royal capital: drawn with a gold ring and its Hangul name shown */
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
	/** Lived-in epithets — mirrored onto the place profile’s sobriquets. */
	sobriquets?: string[];
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
		avatar: '/pl_pyongyang_fortress.png',
		blurb:
			'Red Sun’s capital — Goguryeo’s seat. Yeon Gesomun butchers the court here in 642; the walls hold every siege until they are opened from inside in 668.',
		sobriquets: ['City of the Red Sun'],
		aliases: ['Pyongyang', '평양성', 'City of the Red Sun']
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
		avatar: '/pl_eastern.png',
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
		avatar: '/pl_ansi.png',
		blurb:
			'The wall that stopped an emperor. Its commander — unnamed in the histories — held out through the summer of 645 and handed Taizong the first defeat of his life.',
		sobriquets: ['Wall that Stopped an Emperor'],
		aliases: ['Ansi', '안시성']
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
		blurb: 'Seat of the Central Commandery, one of Goguryeo’s Five. High Commander Yeon Gusesa shouts Yeon down from that chair at the High Summit of 634.'
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
		cityId: 'jolbon',
		avatar: '/pl_baekdu.png',
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
		cityId: 'ansi',
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
		cityId: 'pyongyang',
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
		cityId: 'pyongyang',
		avatar: '/pl_snake_river.png',
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
		cityId: 'pyongyang',
		avatar: '/pl_stone_gate.png',
		blurb: 'Seokmun. Silla’s costly defeat in the eighth month of 672, early in the war to expel the Tang.'
	},
	jolbon: {
		id: 'jolbon',
		labelLeft: true,
		name: 'Jolbon',
		korean: '졸본 (환인)',
		hanja: '卒本',
		x: 215,
		y: 370,
		kind: 'cave',
		side: 'goguryeo',
		avatar: '/pl_jumong_cave.png',
		title: 'Jumong Cavern — where the holy king prayed',
		blurb:
			'Every northern vow begins in the cave Jumong hollowed out — 국동대혈, where every Goguryeo heir renews the vow before blood.',
		arc: 'Before the tortoise-bridge and the founding, Jumong knelt in this hollow and asked heaven for a country that would outlast his brothers’ hatred. The cavern remembers the bow, the egg, the sun-line — and later kings come back not for scenery but for permission. Gesomun renews his vow here in the tenth month of 642, hours before the banquet knives; Yeon’s sons grow up hearing the story as weather you inherit. When Goguryeo falls, the cave does not. Later crowns still argue about who descended from the man who prayed here.',
		events: [
			{ year: -37, label: 'Jumong founds Goguryeo at Jolbon after the river gives way.' },
			{ year: -37, label: 'He prays in the cavern (국동대혈) for a kingdom of his own.' },
			{ year: 642, label: 'Gesomun renews his vow here before the Pyongyang massacre.' }
		],
		aliases: ['Jolbon', 'Jumong Cavern', '국동대혈', 'Jumong Cave', '졸본']
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
		avatar: '/pl_eastern_palace.png',
		blurb:
			'Capital of the Divine Country. Queen Sunduk is crowned here in 632, Bidam rebels at its Fortress of Radiance in 647, and Munmu is proclaimed King of Samhan here in 676.',
		sobriquets: ['Capital of the Divine Country'],
		aliases: ['Surabol', '서라벌', 'Capital of the Divine Country']
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
		cityId: 'surabol',
		labelLeft: true,
		avatar: '/pl_cave.png',
		title: 'Yushin’s cavern lake in the hills',
		blurb:
			'김 — steam and surname in the same breath. A bowl of black water under stone — the only room in Silla where no one asks Kim Yushin for a victory, and where the dead Kims sometimes come back.',
		arc: 'Kim Seohyeon found it first: naked, clean-shaven, and only men surnamed Kim — 김, the same sound as steam. Narim, Golhwa and Hyullé loved him; every later Kim is heirloom. Between campaigns Yushin rides alone, strips at the rock lip, and bathes in cold steam while the three wait — mentors, tormentors, beautiful predators who give real counsel. But the lake is not only goddesses: when the steam thins, Muryuk and Seohyeon stand on the shelf, and once even Dangun walked the water for a king who did not know his name. The lake does not require prayer. It requires honesty. The histories keep the fortresses. This place keeps the men.',
		events: [
			{ label: 'Seohyeon finds the lake; the three goddesses love the first Kim.' },
			{ label: 'Yushin first finds the three in the steam; Narim sends the younger two away and is caught kissing him.' },
			{ year: 642, label: 'After Daeya he returns for quiet counsel before the road north.' },
			{ year: 647, label: 'Before Bidam’s tenth day — Seohyeon and Muryuk appear; “You are Kim Yushin.”' },
			{ year: 673, label: 'Old, between paperwork wars, his father and grandfather visit once more.' },
			{ year: 673, label: 'After Yushin’s death Munmu enters; Dangun names the wanggeom’s work.' }
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
		avatar: '/pl_wirye.png',
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
		cityId: 'wirye',
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
		avatar: '/pl_daeya_fortress.png',
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
		cityId: 'surabol',
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
		avatar: '/pl_sabi_palace.png',
		blurb:
			'Capital of the Heavenly Deer. Euija seats forty-one of his own sons in the Assembly here in 655, and the city falls to the Silla–Tang army in 660.',
		sobriquets: ['Capital of the Heavenly Deer'],
		aliases: ['Sabi', '사비', 'Capital of the Heavenly Deer']
	},
	hwangsan: {
		id: 'hwangsan',
		name: 'Yellow Mountain',
		korean: '황산벌 (논산)',
		x: 322,
		y: 600,
		kind: 'mountain',
		side: 'baekje',
		cityId: 'sabi',
		avatar: '/pl_yellow_mountain.png',
		blurb:
			'Field of the disputed blade — Hwangsanbeol, where Hundred-Victories Gyebek met fifty thousand with five thousand in 660, having killed his own family first so nothing could be used against him.',
		sobriquets: ['Field of the Disputed Blade'],
		aliases: ['Yellow Mountain', 'Hwangsanbeol', '황산벌', 'Field of the Disputed Blade']
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
		cityId: 'sabi',
		avatar: '/pl_white_river.png',
		blurb:
			'Mouth where four fleets burned — the Baekgang. In the eighth month of 663 Tang, Silla, Baekje and Yamato fought here — the first time all four met in one battle — and four hundred eastern ships burned.',
		sobriquets: ['Mouth Where Four Fleets Burned'],
		aliases: ['White River', 'Baekgang', '백강', 'Mouth Where Four Fleets Burned']
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
		avatar: '/pl_bear_fortress.png',
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
		avatar: '/pl_mugun_fortress.png',
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
		cityId: 'central',
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
		avatar: '/pl_rock_politics.png',
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
		avatar: '/pl_daming_palace.png',
		offMap: true,
		blurb:
			'The Tang capital, largest city on earth. Chunchu wins his alliance here in 648; Euija dies here a prisoner in 660.'
	},

	cheomseongdae: {
		id: 'cheomseongdae',
		name: 'Cheomseongdae',
		korean: '첨성대',
		x: 392,
		y: 628,
		kind: 'cave',
		side: 'silla',
		cityId: 'surabol',
		offMap: true,
		avatar: '/pl_observatory.png',
		title: 'Observatory of Surabol',
		blurb: 'Queen Sunduk’s star tower — where the Divine Country reads the sky that argues with Bone Rank.'
	},
	halla: {
		id: 'halla',
		name: 'Mount Halla',
		korean: '한라산',
		x: 290,
		y: 750,
		kind: 'mountain',
		side: 'tamla',
		cityId: 'mugun',
		offMap: true,
		avatar: '/pl_mount_halla.png',
		blurb: 'The island’s sacred peak — Sulmun’s apron-work; oreum holes still mark where earth spilled.'
	},
	samseonghyeol: {
		id: 'samseonghyeol',
		name: 'Three Princes’ Well',
		korean: '삼성혈',
		x: 286,
		y: 746,
		kind: 'cave',
		side: 'tamla',
		cityId: 'mugun',
		offMap: true,
		avatar: '/pl_three_princes_well.png',
		blurb: 'Where Go, Yang, and Bu rose from the ground — Tamla’s founding hole, not Gaya’s eggs.'
	},
	deer_rock: {
		id: 'deer_rock',
		name: 'Deer Rock',
		korean: '정사암',
		x: 307,
		y: 616,
		kind: 'cave',
		side: 'baekje',
		cityId: 'sabi',
		offMap: true,
		avatar: '/pl_deer_rock.png',
		title: 'Assembly stone of the Eight Clans',
		blurb: 'Where Baekje’s Great Clans sit and unseat kings — emptied when Euija seats his own sons over them.'
	},
	flower_cliff: {
		id: 'flower_cliff',
		name: 'Flower Cliff',
		korean: '꽃벼랑',
		x: 280,
		y: 400,
		kind: 'mountain',
		side: 'other',
		cityId: 'western_flower_field',
		offMap: true,
		avatar: '/pl_flower_cliff.png',
		blurb: 'A cliff-edge inside the Western Flower Field — not the field itself; Hallakgungi’s rows fall away here in story art.'
	},
	moon_palace: {
		id: 'moon_palace',
		name: 'Moon Palace',
		korean: '월궁',
		x: 395,
		y: 625,
		kind: 'cave',
		side: 'silla',
		cityId: 'surabol',
		offMap: true,
		avatar: '/pl_moon_palace.png',
		blurb: 'Surabol’s moonlit court rooms in chronicle art — Eastern Palace’s night face.'
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
		avatar: '/pl_asuka.png',
		blurb:
			'Yamato’s court. Chunchu came asking for troops in 647 and was refused; fifteen years later it sent forty thousand men to die for Baekje.'
	},
	realms_pavilion: {
		id: 'realms_pavilion',
		name: 'Three Realms Pavilion',
		korean: '삼계정자',
		hanja: '三界亭子',
		x: 298,
		y: 398,
		kind: 'cave',
		side: 'other',
		offMap: true,
		avatar: '/pl_three_realms_pavillion.png',
		title: 'The yearly 정자',
		blurb:
			'A small 정자 between 이승, 저승, and 서천꽃밭 — no larger than a fishing shelter, claimed by none of the three courts, where the Class I gods meet once a year.',
		arc: 'Not a palace and not a battlefield. Floorboards enough for gossip, tea, and the principals’ later seats. Servants arrive first. The Big Man Upstairs does not need to attend for the meeting to count.',
		aliases: ['Three Realms Pavilion', '삼계정자', 'Annual Meeting pavilion']
	},

	underworld: {
		id: 'underworld',
		name: 'Underworld',
		korean: '저승',
		x: 298,
		y: 820,
		kind: 'realm',
		side: 'underworld',
		offMap: true,
		avatar: '/pl_underworld.png',
		title: 'Land of the Dead',
		blurb: 'Big Star’s realm — judgment, ledger, and borders no living map admits.',
		arc: 'Paradise, the Siwang court, and Hell sit inside Big Star’s orderly dark: Yumla judges; Kangrim and Haewonmek collect; a crow can scramble a list. Not a metaphor and not a Samhan kingdom — Little Star took the living side by cheat; Big Star kept the minutes. Heaven once tried to arrest Yumla the judge and left two escorts instead. While Surabol and Sabi burn, 저승 keeps time.',
		sobriquets: ['Land of the Dead', 'Yumla’s court'],
		aliases: [
			'Underworld',
			'the underworld',
			'저승',
			'Land of the Dead',
			'Jeoseung',
			'Yumla’s court',
			'Yumla\'s court'
		]
	},

	heaven: {
		id: 'heaven',
		name: 'Heaven',
		korean: '하늘나라',
		hanja: '天界',
		x: 298,
		y: 36,
		kind: 'realm',
		side: 'other',
		offMap: true,
		avatar: '/pl_western.png',
		title: 'Court of the Creator',
		blurb: 'Hwanin’s seat above 삼계 — not a peer of the three courts below.',
		arc: '하늘나라 is the Creator’s own court, not a fourth Samhan kingdom and not a fourth peer of 삼계. Sons and seals go down from here; Living, Dead, and Western Flower Field keep house below. The yearly 정자 does not need Hwanin present for the meeting to count.',
		sobriquets: ['하늘나라', 'Heaven’s Court', 'Court of the Creator'],
		aliases: [
			'Heaven',
			'the heavens',
			'하늘나라',
			'Heaven’s Court',
			"Heaven's Court",
			'Court of Heaven',
			'Court of the Creator'
		]
	},

	living_world: {
		id: 'living_world',
		name: 'Living World',
		korean: '이승',
		x: 298,
		y: 420,
		kind: 'realm',
		side: 'other',
		offMap: true,
		title: 'Land of the Living',
		blurb: 'Little Star’s realm — warm, badly governed, and the side he cheated for.',
		arc: '이승 is one court of 삼계 under Hwanin’s heaven. After Heaven–Earth King retired, the twins wagered flowers; Little Star swapped blooms and took the warm side — which is why thieves and bad hours live under his small law. Ibiga, Haemosu, and Samsin tend sky, sun, and birth here. Not Tamla the island and not a Samhan map.',
		sobriquets: ['Land of the Living', '이승'],
		aliases: [
			'Living World',
			'the living world',
			'Land of the Living',
			'이승',
			'Iseung'
		]
	},

	western_flower_field: {
		id: 'western_flower_field',
		name: 'Western Flower Field',
		korean: '서천꽃밭',
		hanja: '西天花田',
		x: 48,
		y: 420,
		kind: 'realm',
		side: 'other',
		offMap: true,
		avatar: '/pl_western_flower_field.png',
		title: 'Hallakgungi’s rows',
		blurb: 'The Gardener’s realm — resurrection and extinction in the same western rows.',
		arc: '서천꽃밭 is the third court of 삼계: travel west from 이승 far enough and living maps end. Hallakgungi (할락궁이) keeps the gate after Father Saradoryeong retired. Resurrection blooms sit beside the extinction flower; Jacheongbi’s chain runs through this gate. Flower Cliff is a drop at the field’s edge, not the field itself. Not a kingdom — a court among the Three Realms under Hwanin.',
		sobriquets: ['서천꽃밭', 'Hallakgungi’s rows', 'the western field'],
		aliases: [
			'Western Flower Field',
			'the Western Flower Field',
			'서천꽃밭',
			'Seocheon',
			'West Field',
			'western flower field'
		]
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
	'Ocean Trade': 'sabi',
	'The Summit': 'pyongyang',
	'Gwanggaeto, The Conqueror': 'surabol',
	'Gotaso’s Wedding': 'surabol',
	'Yeon’s Three Sons': 'gungnae',
	'King Euija, the 31st Eraha': 'sabi',
	'Jinheung’s Betrayal': 'gwansan',
	'Daeya Fortress': 'daeya',
	Steam: 'steam_cavern',
	'Best of Both': 'steam_cavern',
	'The Marshal\u2019s Steam': 'steam_cavern',
	'Steam, Again': 'steam_cavern',
	'Yeon’s Massacre': 'pyongyang',
	'After the Knives': 'pyongyang',
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
	'Annual Meeting of the Three Realms': 'realms_pavilion',
	'The Girl Who Cut Her Hair': 'western_flower_field',
	'Ansi': 'ansi',
	'The Flower Youth': 'surabol',
	'The Harmony Council': 'surabol',
	'Chunchu Goes to the East': 'asuka',
	'Bidam’s Rebellion': 'surabol',
	'Gaya, the Lost Nations': 'geumgwan',
	'The Fall of Gaya': 'daegaya',
	'Silla-Tang Alliance': 'changan',
	'Death of Taizong': 'changan',
	'Death of the Second Emperor': 'changan',
	'On Gunhae': 'danghang',
	'King Muyeol': 'surabol',
	'Hyukgosé': 'surabol',
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
	"The Wanggeom's Guest": 'steam_cavern',
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
		placeKind: p.kind,
		cityId: p.cityId,
		kingdom: p.side,
		avatar: p.avatar,
		tagline: p.blurb,
		arc: p.arc,
		events: p.events,
		aliases,
		sobriquets: p.sobriquets
	};
}

export const PLACE_PROFILES: Person[] = Object.values(PLACES).map(toPlacePerson);
