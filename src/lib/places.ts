/**
 * Places on the Samhan map (three_kingdoms_map.svg, viewBox 0 0 595 842).
 *
 * Names and marker shapes follow the labelled map:
 *   ● fortress/city   ▲ mountain   ◆ river   ■ harbour   ◇ cavern
 * Coordinates are real longitude/latitude projected onto the sheet through the
 * map's three printed capital rings (Pyongyang, Sabi, Gyeongju), so the
 * coastline and the markers agree. Identifications follow the
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
	side: Person['kingdom'];
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
	/** more location boards of the same place, after the avatar */
	gallery?: string[];
	title?: string;
	events?: LifeEvent[];
	aliases?: string[];
	/** Lived-in epithets — mirrored onto the place profile’s sobriquets. */
	sobriquets?: string[];
	/** sits outside the map frame; not drawn as a permanent marker */
	offMap?: boolean;
}

export const PLACES: Record<string, Place> = {
	// ————————————————————————— Goguryeo —————————————————————————
	pyongyang: {
		id: 'pyongyang',
		name: 'Pyongyang',
		korean: '평양성',
		x: 258,
		y: 456,
		kind: 'city',
		side: 'goguryeo',
		capital: true,
		avatar: '/pl_pyongyang_city.png',
		gallery: ['/pl_pyongyang_fortress.png'],
		blurb:
			'Red Sun’s capital — Goguryeo’s seat. Yeon Gesomun butchers the court here in 642; the walls hold every siege until they are opened from inside in 668.',
		sobriquets: ['City of the Red Sun'],
		aliases: ['Pyongyang', '평양성', 'City of the Red Sun']
	},
	yodong: {
		id: 'yodong',
		name: 'Yodong',
		korean: '요동성',
		x: 153,
		y: 342,
		kind: 'city',
		side: 'goguryeo',
		avatar: '/pl_eastern.png',
		blurb: 'The great western fortress guarding the Liao. Taizong storms it in the fifth month of 645.',
		aliases: ['Yodong', '요동성', 'Eastern Fortress']
	},
	buyeo_fort: {
		id: 'buyeo_fort',
		name: 'Buyeo Fortress',
		korean: '부여성',
		x: 239,
		y: 179,
		kind: 'city',
		side: 'goguryeo',
		avatar: '/pl_yeon_fortress.png',
		blurb:
			'Yeon Gesomun’s home fortress, at the top of the thousand-li wall — snow, stone, one red munru above the cloud sea. As far from Pyongyang as an order can travel and still be obeyed. The steppe is the next thing north.',
		aliases: ['Buyeo Fortress', '부여성', 'Eastern Hall', 'Yeon fortress', '연씨 동부산성']
	},
	sinseong: {
		id: 'sinseong',
		name: 'New Fortress',
		korean: '신성 (무순)',
		x: 186,
		y: 310,
		kind: 'city',
		side: 'goguryeo',
		blurb:
			'The wall’s anchor on the northern road. In 645 the emperor’s cousin spends ten days under it and leaves with nothing.',
		aliases: ['New Fortress', '신성']
	},
	gaemo: {
		id: 'gaemo',
		name: 'Gaemo',
		korean: '개모성',
		x: 164,
		y: 319,
		kind: 'city',
		side: 'goguryeo',
		blurb:
			'The next fort down the line. It lasts a little over ten days in 645, and the seven hundred men Yeon sent to hold it ask to serve the emperor instead.',
		aliases: ['Gaemo', '개모성']
	},
	baegam: {
		id: 'baegam',
		name: 'White Rock',
		korean: '백암성',
		x: 163,
		y: 336,
		kind: 'city',
		side: 'goguryeo',
		blurb:
			'A cliff fort east of Yodong. Yeon’s riders break out and put a spear in a Tang general’s waist; the fort’s lord opens the gate anyway.',
		aliases: ['White Rock', 'White Rock Fortress', '백암성']
	},
	geonan: {
		id: 'geonan',
		name: 'Geonan',
		korean: '건안성',
		x: 118,
		y: 387,
		kind: 'city',
		side: 'goguryeo',
		blurb:
			'South of Ansi on the coast road. In 645 the emperor’s generals tell him to take it first. He goes to look at Ansi instead.',
		aliases: ['Geonan', '건안성']
	},
	bisa: {
		id: 'bisa',
		name: 'Bisa',
		korean: '비사성 (대련)',
		x: 93,
		y: 453,
		kind: 'city',
		side: 'goguryeo',
		blurb:
			'The last stone of the wall, on the cape where the land runs out. The Tang fleet comes at it from the sea in 645 and takes it in a month.',
		aliases: ['Bisa Fortress', '비사성']
	},
	liao: {
		id: 'liao',
		name: 'Liao River',
		korean: '요하',
		x: 127,
		y: 349,
		kind: 'river',
		side: 'goguryeo',
		cityId: 'yodong',
		blurb:
			'Two hundred li of marsh between the empire and the wall. A Sui host once went in up to the knee and came out as a song. In 645 the Tang lay a road across it, then tear the road up behind them.',
		aliases: ['Liao River', 'Liao marsh', '요하']
	},
	amnok: {
		id: 'amnok',
		name: 'Amnok River',
		korean: '압록강',
		x: 214,
		y: 394,
		kind: 'river',
		side: 'goguryeo',
		cityId: 'gungnae',
		avatar: '/pl_amnok_river.png',
		gallery: ['/pl_amnok_pavillion.png'],
		blurb:
			'Habaek’s river, with three daughters in it. The sun god crosses it on the same hour every day, until the day he looks down.',
		aliases: ['Amnok River', 'the Amnok', 'Amnok', '압록강']
	},
	hwando: {
		id: 'hwando',
		name: 'Hwando',
		korean: '환도산성',
		x: 275,
		y: 346,
		kind: 'city',
		side: 'goguryeo',
		blurb:
			'The mountain fort above Gungnae. It burns in 244, after a king picks a fight on ground he had not looked at.',
		aliases: ['Hwando', '환도산성']
	},
	ansi: {
		id: 'ansi',
		name: 'Ansi',
		korean: '안시성',
		x: 135,
		y: 364,
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
		name: 'Central',
		korean: '중부',
		x: 285,
		y: 405,
		kind: 'city',
		side: 'goguryeo',
		blurb: 'Seat of the Central Commandery, one of Goguryeo’s Five. High Commander Yeon Gusesa shouts Yeon down from that chair at the High Summit of 634.'
	},
	paektu: {
		id: 'paektu',
		name: 'Mt. Paektu',
		korean: '백두산',
		x: 358,
		y: 302,
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
		x: 144,
		y: 355,
		kind: 'mountain',
		side: 'goguryeo',
		cityId: 'ansi',
		blurb:
			'Stallion Mountain. Taizong destroys a Goguryeo field army here in the sixth month of 645 — and rejoices at gaining a brave general rather than at the victory.'
	},
	salsu: {
		id: 'salsu',
		name: 'Colossal River',
		korean: '살수 (청천강)',
		aliases: ['Colossal River', 'Salsu', '살수', 'Great River'],
		x: 251,
		y: 426,
		kind: 'river',
		side: 'goguryeo',
		cityId: 'pyongyang',
		blurb: 'The Salsu. Ulchi Munduk drowned an entire Sui host here in 612 — and sent its general a poem about it afterwards.'
	},
	sasu: {
		id: 'sasu',
		name: 'Snake River',
		korean: '사수',
		x: 267,
		y: 462,
		kind: 'river',
		side: 'goguryeo',
		cityId: 'pyongyang',
		avatar: '/pl_snake_river.png',
		blurb:
			'Where Yeon Gesomun destroyed the White Tiger’s army in the second month of 662 — one of the great victories of Goguryeo’s last decade.'
	},
	seokmun: {
		id: 'seokmun',
		name: 'Stone Gate',
		korean: '석문',
		x: 275,
		y: 487,
		kind: 'river',
		side: 'goguryeo',
		cityId: 'pyongyang',
		avatar: '/pl_stone_gate.png',
		blurb: 'Seokmun. Silla’s costly defeat in the eighth month of 672, early in the war to expel the Tang.'
	},
	jolbon: {
		id: 'jolbon',
		name: 'Jolbon',
		korean: '졸본 (환인)',
		hanja: '卒本',
		x: 244,
		y: 341,
		kind: 'cave',
		side: 'jolbon',
		avatar: '/pl_jumong_cave.png',
		gallery: ['/pl_jolbon.png'],
		title: 'Jumong Cavern — where the holy king prayed',
		blurb:
			'Every northern vow begins in the cave Jumong hollowed out — 국동대혈, where every Goguryeo heir renews the vow before blood.',
		arc: 'Before the tortoise-bridge and the founding, Jumong knelt in this hollow and asked heaven for a country that would outlast his brothers’ hatred. The cavern remembers the bow, the egg, the sun-line — and later kings come back not for scenery but for permission. Gesomun kneels here in the tenth month of 642, three nights after the banquet knives, and thanks the holy king for a direction; Yeon’s sons grow up hearing the story as weather you inherit. When Goguryeo falls, the cave does not. Later crowns still argue about who descended from the man who prayed here.',
		events: [
			{ year: -37, label: 'Jumong founds Goguryeo at Jolbon after the river gives way.' },
			{ year: -37, label: 'He prays in the cavern (국동대혈) for a kingdom of his own.' },
			{ year: 642, label: 'Gesomun prays here after the Pyongyang massacre.' }
		],
		aliases: ['Jolbon', 'Jumong Cavern', '국동대혈', 'Jumong Cave', '졸본']
	},
	pine_kingdom: {
		id: 'pine_kingdom',
		name: 'Pine Kingdom',
		korean: '소나무 나라',
		hanja: '松國',
		x: 250,
		y: 324,
		kind: 'city',
		side: 'jolbon',
		title: 'Song Yang’s pine roof',
		blurb:
			'Song Yang’s timber country beside Jolbon — pines, packed earth, one giwa hall. Jumong annexed the roof to get Oi, Mari, and Hyupbo back.',
		arc: 'The ridge path after Jumong’s river split does not run to Tabal’s yard. It runs here. Song Yang holds the three as guests who do not leave until King Jumong — Queen Sosuno on the rail — takes a single shaft in this packed-earth yard and yields both the friends and the country. The ledgers may write 松國; mouths say 소나무 나라. The name is not the later son’s.',
		events: [{ year: -37, label: 'Song Yang yields the pine roof; Jumong’s three friends return to Jolbon.' }],
		aliases: ['Pine Kingdom', '소나무 나라', '松國', 'Song Yang’s pine roof']
	},
	gungnae: {
		id: 'gungnae',
		name: 'Gungnae Fortress',
		korean: '국내성 (집안)',
		x: 279,
		y: 348,
		kind: 'city',
		side: 'goguryeo',
		blurb: 'The second capital, and the site of the Gwanggaeto Stele. Wei troops sacked it in 244.'
	},

	// ————————————————————————— Silla —————————————————————————
	surabol: {
		id: 'surabol',
		name: 'Surabol',
		korean: '서라벌 (경주)',
		x: 400,
		y: 618,
		kind: 'city',
		side: 'silla',
		capital: true,
		avatar: '/pl_eastern_palace.png',
		blurb:
			'Capital of the Divine Country. Queen Sunduk is crowned here in 632, Bidam rebels at its Fortress of Radiance in 647, and Munmu is proclaimed King of Samhan here in 676.',
		sobriquets: ['Capital of the Divine Country'],
		aliases: ['Surabol', '서라벌', 'Capital of the Divine Country']
	},
	radiance: {
		id: 'radiance',
		name: 'Radiance Fortress',
		korean: '명활성',
		x: 404,
		y: 617,
		kind: 'city',
		side: 'silla',
		avatar: '/pl_radiance_fortress.png',
		blurb:
			'The mountain fort just east of Surabol, close enough to see the palace roofs. In 647 Bidam raises his banners on its wall, and the capital watches him do it.',
		aliases: ['Radiance Fortress', 'Fortress of Radiance', 'Myeonghwal Fortress', '명활성']
	},
	nangbi: {
		id: 'nangbi',
		name: 'Nangbi Fortress',
		korean: '낭비성',
		x: 329,
		y: 577,
		kind: 'city',
		side: 'silla',
		blurb:
			'Where a young Kim Yushin rides into the Goguryeo line alone, three times, in 629. The horse under him that day carries him for eighteen years.',
		aliases: ['Nangbi Fortress', 'Nangbi', '낭비성']
	},
	steam_cavern: {
		id: 'steam_cavern',
		name: 'Steam Cavern',
		korean: '김 동굴',
		hanja: '蒸洞窟',
		x: 382,
		y: 606,
		kind: 'cave',
		side: 'silla',
		cityId: 'surabol',
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
		name: 'Maeso',
		korean: '매소성 (연천)',
		x: 313,
		y: 504,
		kind: 'city',
		side: 'silla',
		blurb: 'Maeso Fortress. In the ninth month of 675 Silla broke a Tang army here and turned the Silla–Tang war.'
	},
	wirye: {
		id: 'wirye',
		name: 'Wirye',
		korean: '위례성 (서울)',
		x: 313,
		y: 532,
		kind: 'city',
		side: 'silla',
		avatar: '/pl_wirye.png',
		blurb:
			'Baekje’s first capital, founded by Onjo — and by the 640s the contested Han valley that all three kingdoms had held in turn.'
	},
	danghang: {
		id: 'danghang',
		name: 'Danghang',
		korean: '당항성 (화성)',
		x: 301,
		y: 549,
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
		x: 356,
		y: 632,
		kind: 'city',
		side: 'silla',
		avatar: '/pl_daeya_fortress.png',
		blurb:
			'The border fortress lost in the eighth month of 642. Chunchu’s daughter Gotaso died here, and the war that ends three kingdoms starts from it.'
	},
	gibeolpo: {
		id: 'gibeolpo',
		name: 'Final Ford',
		korean: '기벌포 (장항)',
		aliases: ['Final Ford', 'Gibeolpo', '기벌포', 'Strike Harbor'],
		x: 292,
		y: 610,
		kind: 'harbor',
		side: 'silla',
		cityId: 'surabol',
		blurb:
			'Gibeolpo, at the mouth of the Geum. Seongchung died in prison begging Euija to hold it; in the eleventh month of 676 Silla’s victory here ended the Tang war.'
	},

	// ————————————————————————— Baekje —————————————————————————
	sabi: {
		id: 'sabi',
		name: 'Sabi',
		korean: '사비 (부여)',
		x: 305,
		y: 596,
		kind: 'city',
		side: 'baekje',
		capital: true,
		avatar: '/pl_sabi_palace.png',
		gallery: ['/pl_sabi_port.png'],
		blurb:
			'Capital of the Heavenly Deer. Euija seats forty-one of his own sons in the Assembly here in 655, and the city falls to the Silla–Tang army in 660.',
		sobriquets: ['Capital of the Heavenly Deer'],
		aliases: ['Sabi', '사비', 'Capital of the Heavenly Deer']
	},
	sabi_tourney: {
		id: 'sabi_tourney',
		name: 'Sabi tournament yard',
		korean: '사비 시합뜰',
		x: 305,
		y: 620,
		kind: 'city',
		side: 'baekje',
		cityId: 'sabi',
		offMap: true,
		avatar: '/pl_sabi_tourney.png',
		blurb:
			'Packed earth in front of the palace. Once a year the court chalks a white square; Euija’s five named sons step on in white, and the clans keep score from the hall bar.',
		aliases: ['Sabi tournament yard', '사비 시합뜰']
	},
	hwangsan: {
		id: 'hwangsan',
		name: 'Yellow Mountain',
		korean: '황산벌 (논산)',
		x: 313,
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
		name: 'White River',
		korean: '백강 (금강 하구)',
		x: 300,
		y: 614,
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
		name: 'Bear Fortress',
		korean: '웅진성 (공주)',
		x: 313,
		y: 587,
		kind: 'city',
		side: 'baekje',
		avatar: '/pl_bear_fortress.png',
		blurb: 'Ungjin. Euija fled here when Sabi fell, and its guardian Ye Sikjin handed him to the Tang.',
		aliases: ['Bear Fortress', 'Bear Ford', 'Ungjin', '웅진성']
	},
	chwiri: {
		id: 'chwiri',
		name: 'Mount Gain',
		korean: '취리산',
		x: 309,
		y: 601,
		kind: 'mountain',
		side: 'baekje',
		cityId: 'ungjin',
		offMap: true,
		blurb:
			'A hill outside Bear Ford. In 665 the empire makes the two men who rule the south swear to be brothers here. The clerks name it the Mountain Where One Goes for Gain.',
		aliases: ['Mount Gain', 'Mountain Where One Goes for Gain', '취리산']
	},
	juryu: {
		id: 'juryu',
		name: 'Juryu Fortress',
		korean: '주류성 (부안)',
		x: 297,
		y: 626,
		kind: 'city',
		side: 'baekje',
		blurb: 'Base of the Baekje restoration. Prince Pung moved off it against advice, had to move back, and executed Boksin here.'
	},
	imjon: {
		id: 'imjon',
		name: 'Imjon Fortress',
		korean: '임존성 (예산)',
		x: 302,
		y: 576,
		kind: 'city',
		side: 'baekje',
		blurb: 'Where Heukchi Sangji rallied thirty thousand within ten days of Sabi’s fall.'
	},
	gwansan: {
		id: 'gwansan',
		name: 'Gwansanseong',
		korean: '관산성 (옥천)',
		x: 332,
		y: 595,
		kind: 'city',
		side: 'baekje',
		blurb:
			'Where Jinheung’s betrayal ended: King Seong of Baekje was caught riding at night in 554, and a stable-slave named Dodo took his head.'
	},
	michuhol: {
		id: 'michuhol',
		name: 'Michuhol',
		korean: '미추홀 (인천)',
		x: 295,
		y: 536,
		kind: 'city',
		side: 'baekje',
		blurb: 'The salt marshes Biryu chose over his brother’s ground — and regretted.'
	},

	// ————————————————————————— Gaya, Tamla, beyond —————————————————————————
	geumgwan: {
		id: 'geumgwan',
		name: 'Golden Gaya',
		korean: '금관가야 (김해)',
		x: 386,
		y: 649,
		kind: 'city',
		side: 'gaya',
		blurb:
			'Founded in 42 by Suro, who hatched from one of six eggs. Its last prince surrendered to Silla in 532 — his grandson was Kim Yushin.'
	},
	daegaya: {
		id: 'daegaya',
		name: 'Great Gaya',
		korean: '대가야 (고령)',
		x: 360,
		y: 624,
		kind: 'city',
		side: 'gaya',
		blurb: 'The last Gaya kingdom, taken by Jinheung and the young Hwarang Sadaham in 562.'
	},
	mugun: {
		id: 'mugun',
		name: 'Mugun',
		korean: '무근 (탐라)',
		x: 287,
		y: 739,
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
		x: 330,
		y: 262,
		kind: 'mountain',
		side: 'goguryeo',
		cityId: 'central',
		blurb:
			'Yeon Gesomun’s frontier command — the snowbound outposts where he made the Eastern Commandery the safest in the kingdom, and the capital hated him for it.'
	},
	asadal: {
		id: 'asadal',
		name: 'Asadal',
		korean: '아사달',
		x: 239,
		y: 477,
		kind: 'city',
		side: 'other',
		avatar: '/pl_rock_politics.png',
		blurb: 'Dangun’s city, and later Wanggeom — the capital of Old Joseon, which fell to the Han in 108 BCE.'
	},
	buyeo_north: {
		id: 'buyeo_north',
		name: 'Buyeo',
		korean: '부여',
		x: 295,
		y: 208,
		kind: 'city',
		side: 'buyeo',
		capital: true,
		avatar: '/pl_buyeo_yard.png',
		gallery: ['/pl_northern_buyeo.png', '/pl_buyeo_palace.png', '/pl_yuhwa_hut.png'],
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
		gallery: ['/pl_daming.png', '/pl_daming_night.png'],
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

/** The whole sheet (`/map.svg`). */
export const MAP_VIEWBOX = { w: 595, h: 842 };

/** The part of the sheet the map shows: every marker, without the empty steppe and sea. */
export const MAP_VIEW = { x: 45, y: 150, w: 460, h: 620 };

/** The whole sheet's box (in % of the visible window), scaled and shifted so only `MAP_VIEW` shows. */
export const MAP_SHEET_BOX = {
	left: (-MAP_VIEW.x / MAP_VIEW.w) * 100,
	top: (-MAP_VIEW.y / MAP_VIEW.h) * 100,
	width: (MAP_VIEWBOX.w / MAP_VIEW.w) * 100,
	height: (MAP_VIEWBOX.h / MAP_VIEW.h) * 100
};

/** A walled site (…성) that is not a capital: drawn with the fortress glyph. */
export function isFortress(p: Place): boolean {
	return p.kind === 'city' && !p.capital && /성(?=$|[\s(])/.test(p.korean ?? '');
}

/** The map label: the glyph already says “fortress”. */
export function mapLabel(p: Place): string {
	return p.name.replace(/\s*\bFortress\b\s*/, ' ').trim();
}

/** Every location board of a place: its avatar, then its gallery. */
export function placeImages(p: Place): string[] {
	return [...(p.avatar ? [p.avatar] : []), ...(p.gallery ?? [])];
}

/** A line drawn through places on the map, in order. */
export interface MapLine {
	id: string;
	name: string;
	korean: string;
	side: Person['kingdom'];
	stops: string[];
}

export const MAP_LINES: MapLine[] = [
	{
		id: 'cheolli',
		name: 'The Thousand-li Wall',
		korean: '천리장성',
		side: 'goguryeo',
		stops: ['buyeo_fort', 'sinseong', 'gaemo', 'yodong', 'ansi', 'geonan', 'bisa']
	}
];

/** The place an episode is pinned to (`entry.place`), if it names one on the map. */
export function entryPlace(entry: { place?: string }): Place | null {
	return entry.place ? (PLACES[entry.place] ?? null) : null;
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
