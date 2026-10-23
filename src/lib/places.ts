/**
 * Places on the Samhan map (three_kingdoms_map.svg, viewBox 0 0 595 842).
 *
 * Names and marker shapes follow the labelled map:
 *   ● fortress/city   ▲ mountain   ◆ river   ■ harbour   ◇ cavern
 * Coordinates are real longitude/latitude projected onto the sheet through the
 * map's three printed capital rings (Pyongyang, Sabi, Gyungju), so the
 * coastline and the markers agree. Identifications follow the
 * conventional ones (Samguk Sagi / namu.wiki): 대야성=합천, 황산벌=논산,
 * 안시성=요녕 해성, 살수=청천강, 백강·기벌포=금강 하구, 매소성=연천.
 *
 * Every place also doubles as a profile (entity: 'place') so the side panel,
 * prose links, and map can open the same record.
 */

import type { LifeEvent, Person } from '$lib/people';
import type { Pt } from '$lib/mapPaths';
import { project } from './borders.ts';
import riversNe from './data/rivers-ne.json' with { type: 'json' };

export type PlaceKind = 'city' | 'mountain' | 'river' | 'harbor' | 'cave' | 'realm';

export const PLACE_KIND_LABEL: Record<PlaceKind, string> = {
	city: 'City / Fortress',
	mountain: 'Mountain',
	river: 'River',
	harbor: 'Harbour',
	cave: 'Cavern',
	realm: 'Realm'
};

export const PLACE_KIND_LABEL_KO: Record<PlaceKind, string> = {
	city: '도성 · 성',
	mountain: '산',
	river: '강',
	harbor: '항구',
	cave: '동굴',
	realm: '세계'
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
	/** first year the city stands (negative = BCE); unset = always on the map */
	founded?: number;
	/** last year it stands as a city */
	fell?: number;
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
		founded: -108,
		name: 'Pyongyang',
		korean: '평양성',
		hanja: '平壤城',
		x: 258,
		y: 456,
		kind: 'city',
		side: 'goguryeo',
		capital: true,
		avatar: '/pl_pyongyang_city.png',
		gallery: ['/pl_pyongyang_fortress.png', '/pl_taehak.png'],
		blurb:
			'Red Sun’s capital — Goguryeo’s seat. Yeon Gesomun butchers the court here in 642; the walls hold every siege until they are opened from inside in 668.',
		sobriquets: ['City of the Red Sun'],
		aliases: ['Pyongyang', '평양성', 'City of the Red Sun']
	},
	taehak: {
		id: 'taehak',
		name: 'The Tehak',
		korean: '태학',
		hanja: '太學',
		x: 258,
		y: 456,
		kind: 'city',
		side: 'goguryeo',
		cityId: 'pyongyang',
		offMap: true,
		avatar: '/pl_taehak.png',
		blurb:
			'Goguryeo’s Grand Academy on its walled hill above Pyongyang, where the noble sons learn the Analects in the morning and, until Yeon pays its debts, the sutras after lunch.',
		aliases: ['The Tehak', 'Tehak', 'Taehak', '태학', 'Grand Academy']
	},
	yodong: {
		id: 'yodong',
		founded: -282,
		name: 'Yodong',
		korean: '요동성',
		hanja: '遼東城',
		x: 153,
		y: 342,
		kind: 'city',
		side: 'goguryeo',
		avatar: '/pl_yodong_fortress.png',
		blurb: 'The great western fortress guarding the Liao. Taizong storms it in the fifth month of 645.',
		aliases: ['Yodong', '요동성', 'Eastern Fortress']
	},
	buyeo_fort: {
		id: 'buyeo_fort',
		founded: 410,
		name: 'Buyeo Fortress',
		korean: '부여성',
		x: 239,
		y: 179,
		kind: 'city',
		side: 'goguryeo',
		blurb:
			'The northern end of the thousand-li wall, on the old Buyeo plain. The steppe is the next thing north. Xue Rengui takes it in the second month of 668.',
		aliases: ['Buyeo Fortress', '부여성']
	},
	chek_fort: {
		id: 'chek_fort',
		founded: 98,
		name: 'Chek Fortress',
		korean: '책성',
		hanja: '柵城',
		x: 452,
		y: 254,
		kind: 'city',
		side: 'goguryeo',
		avatar: '/pl_yeon_fortress.png',
		blurb:
			'The Yeon home fortress, seat of the Eastern Commandery, by the mouth of the Duman — snow, stone, one red munru above the cloud sea. As far from Pyongyang as an order can travel and still be obeyed. The Mohe are the next thing east.',
		aliases: ['Chek Fortress', '책성', 'Eastern Hall', 'Yeon fortress', '연씨 동부산성']
	},
	sinseong: {
		id: 'sinseong',
		founded: 276,
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
		founded: 404,
		name: 'Gemo',
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
		founded: 404,
		name: 'White Rock',
		korean: '백암성',
		x: 163,
		y: 336,
		kind: 'city',
		side: 'goguryeo',
		blurb:
			'A cliff fort east of Yodong. Yeon’s riders break out and put a spear in the Western general’s waist; the fort’s lord opens the gate anyway.',
		aliases: ['White Rock', 'White Rock Fortress', '백암성']
	},
	geonan: {
		id: 'geonan',
		founded: 404,
		name: 'Gunan',
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
		founded: 404,
		name: 'Bisa',
		korean: '비사성 (대련)',
		x: 93,
		y: 453,
		kind: 'city',
		side: 'goguryeo',
		blurb:
			'The last stone of the wall, on the cape where the land runs out. The Western fleet comes at it from the sea in 645 and takes it in a month.',
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
			'Two hundred li of marsh between the empire and the wall. The Western host once went in up to the knee and came out as a song. In 645 the West lay a road across it, then tear the road up behind them.',
		aliases: ['Liao River', 'Liao marsh', '요하']
	},
	amnok: {
		id: 'amnok',
		name: 'Amnok River',
		korean: '압록강',
		hanja: '鴨綠江',
		x: 214,
		y: 394,
		kind: 'river',
		side: 'goguryeo',
		cityId: 'gungnae',
		avatar: '/pl_amnok_river.png',
		gallery: ['/pl_amnok_pavillion.png'],
		blurb:
			'Habek’s river, with three daughters in it. The sun god crosses it on the same hour every day, until the day he looks down.',
		aliases: ['Amnok River', 'the Amnok', 'Amnok', '압록강']
	},
	hwando: {
		id: 'hwando',
		founded: 198,
		name: 'Hwando',
		korean: '환도산성',
		hanja: '丸都山城',
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
		founded: 404,
		name: 'Ansi',
		korean: '안시성',
		hanja: '安市城',
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
		founded: -37,
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
		name: 'Mt. Pektu',
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
		name: 'Stallion Mountain',
		korean: '주필산',
		hanja: '駐蹕山',
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
		hanja: '薩水',
		aliases: ['Colossal River', 'Salsu', '살수', 'Great River'],
		x: 251,
		y: 426,
		kind: 'river',
		side: 'goguryeo',
		cityId: 'pyongyang',
		blurb: 'The Salsu. Ulchi Munduk drowned an entire Western host here in 612 — and sent its general a poem about it afterwards.'
	},
	sasu: {
		id: 'sasu',
		name: 'Snake River',
		korean: '사수',
		hanja: '蛇水',
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
		hanja: '石門',
		x: 275,
		y: 487,
		kind: 'river',
		side: 'goguryeo',
		cityId: 'pyongyang',
		avatar: '/pl_stone_gate.png',
		blurb: 'Sukmun. Silla’s costly defeat in the eighth month of 672, early in the war to expel the West.'
	},
	jolbon: {
		id: 'jolbon',
		founded: -37,
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
		founded: -100,
		fell: -36,
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
		founded: 3,
		name: 'Gungnae Fortress',
		korean: '국내성 (집안)',
		hanja: '國內城',
		x: 279,
		y: 348,
		kind: 'city',
		side: 'goguryeo',
		blurb: 'The second capital, and the site of the Gwanggeto Stele. Wei troops sacked it in 244.'
	},

	// ————————————————————————— Silla —————————————————————————
	surabol: {
		id: 'surabol',
		founded: -57,
		name: 'Surabol',
		korean: '서라벌 (경주)',
		hanja: '徐羅伐',
		x: 400,
		y: 618,
		kind: 'city',
		side: 'silla',
		capital: true,
		avatar: '/pl_eastern_palace.png',
		gallery: ['/pl_silla_mansion.png', '/pl_yellow_dragon_pagoda.png'],
		blurb:
			'Capital of the Divine Country. Queen Sunduk is crowned here in 632, Bidam rebels at its Fortress of Radiance in 647, and Munmu is proclaimed King of Samhan here in 676.',
		sobriquets: ['Capital of the Divine Country'],
		aliases: ['Surabol', '서라벌', 'Capital of the Divine Country']
	},
	jade_gate_valley: {
		id: 'jade_gate_valley',
		name: 'Jade Gate Valley',
		korean: '옥문곡 (여근곡)',
		hanja: '玉門谷',
		x: 388,
		y: 614,
		kind: 'mountain',
		side: 'silla',
		cityId: 'surabol',
		avatar: '/pl_jade_gate_valley.png',
		blurb:
			'A fold in the hills west of Surabol with a polite name. In the winter of 636 Baekje’s Uso hid five hundred armoured men here to take a hill fort from behind; Alchun and Bidam rode in first and brought him down off his rock.',
		aliases: ['Jade Gate Valley', '옥문곡', '여근곡', 'Okmun-gok', 'Yeogeun-gok']
	},
	radiance: {
		id: 'radiance',
		founded: 405,
		name: 'Radiance Fortress',
		korean: '명활성',
		hanja: '明活城',
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
		founded: 450,
		name: 'Nangbi Fortress',
		korean: '낭비성',
		hanja: '娘臂城',
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
		korean: '골화천',
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
		arc: 'Kim Seohyun found it first: naked, clean-shaven, and only men surnamed Kim — 김, the same sound as steam. Narim, Golhwa and Hyullé loved him; every later Kim is heirloom. Between campaigns Yushin rides alone, strips at the rock lip, and bathes in cold steam while the three wait — mentors, tormentors, beautiful predators who give real counsel. But the lake is not only goddesses: when the steam thins, Muryuk and Seohyun stand on the shelf, and once even Dangun walked the water for a king who did not know his name. The lake does not require prayer. It requires honesty. The histories keep the fortresses. This place keeps the men.',
		events: [
			{ label: 'Seohyun finds the lake; the three goddesses love the first Kim.' },
			{ label: 'Yushin first finds the three in the steam; Narim sends the younger two away and is caught kissing him.' },
			{ year: 642, label: 'After Daeya he returns for quiet counsel before the road north.' },
			{ year: 647, label: 'Ninth morning of Radiance: King Suro’s ghost, then Muryuk, then Seohyun a few hours dead; “You are Kim Yushin.”' },
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
		founded: 475,
		name: 'Maeso',
		korean: '매소성 (연천)',
		hanja: '買肖城',
		x: 313,
		y: 504,
		kind: 'city',
		side: 'silla',
		blurb: 'Maeso Fortress. In the ninth month of 675 Silla broke the Western army here and turned the Silla–Western war.'
	},
	wirye: {
		id: 'wirye',
		founded: -18,
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
		founded: 400,
		name: 'Danghang Fortress',
		korean: '당항성 (화성)',
		hanja: '党項城',
		x: 301,
		y: 549,
		kind: 'harbor',
		side: 'silla',
		cityId: 'wirye',
		blurb:
			'Silla’s only harbour to the West, Tianzhu and the western regions. Euija points at it on the map and tells Yeon exactly where to cut.'
	},
	daeya: {
		id: 'daeya',
		founded: 562,
		name: 'Daeya',
		korean: '대야성 (합천)',
		hanja: '大耶城',
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
		hanja: '伎伐浦',
		aliases: ['Final Ford', 'Gibeolpo', '기벌포', 'Strike Harbor'],
		x: 292,
		y: 610,
		kind: 'harbor',
		side: 'silla',
		cityId: 'sabi',
		avatar: '/pl_final_ford.png',
		blurb:
			'Final Ford, at the mouth of the Geum. Sunchung died in prison begging Euija to hold it; in the eleventh month of 676 Silla’s victory here ended the Western war.'
	},

	// ————————————————————————— Baekje —————————————————————————
	sabi: {
		id: 'sabi',
		founded: 538,
		name: 'Sabi',
		korean: '사비 (부여)',
		hanja: '泗沘',
		x: 305,
		y: 596,
		kind: 'city',
		side: 'baekje',
		capital: true,
		avatar: '/pl_sabi_palace.png',
		gallery: ['/pl_sabi_port.png', '/pl_baekje_satek_mansion.png', '/pl_baekje_yunbi_mansion.png'],
		blurb:
			'Capital of the Heavenly Deer. Euija seats forty-one of his own sons in the Assembly here in 655, and the city falls to the Silla–Western army in 660.',
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
		hanja: '黃山伐',
		x: 313,
		y: 600,
		kind: 'mountain',
		side: 'baekje',
		cityId: 'sabi',
		avatar: '/pl_yellow_mountain.png',
		blurb:
			'Field of the disputed blade — Yellow Mountain, where Hundred-Victories Gyebek met fifty thousand with five thousand in 660, having killed his own family first so nothing could be used against him.',
		sobriquets: ['Field of the Disputed Blade'],
		aliases: ['Yellow Mountain', 'Hwangsanbeol', '황산벌', 'Field of the Disputed Blade']
	},
	baekgang: {
		id: 'baekgang',
		name: 'White River',
		korean: '백강 (금강 하구)',
		hanja: '白江',
		x: 300,
		y: 614,
		kind: 'river',
		side: 'baekje',
		cityId: 'sabi',
		avatar: '/pl_white_river.png',
		blurb:
			'Mouth where four fleets burned — the Bekgang. In the eighth month of 663 the West, Silla, Baekje and the East fought here — the first time all four met in one battle — and four hundred eastern ships burned.',
		sobriquets: ['Mouth Where Four Fleets Burned'],
		aliases: ['White River', 'Baekgang', '백강', 'Mouth Where Four Fleets Burned']
	},
	ungjin: {
		id: 'ungjin',
		founded: 475,
		name: 'Bear Fortress',
		korean: '웅진성 (공주)',
		hanja: '熊津城',
		x: 313,
		y: 587,
		kind: 'city',
		side: 'baekje',
		avatar: '/pl_bear_fortress.png',
		blurb: 'Ungjin. Euija fled here when Sabi fell, and its guardian Ye Sikjin handed him to the West.',
		aliases: ['Bear Fortress', 'Bear Ford', 'Ungjin', '웅진성']
	},
	chwiri: {
		id: 'chwiri',
		name: 'Prosperity Mountain',
		korean: '취리산',
		hanja: '就利山',
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
		founded: 500,
		name: 'Juryu Fortress',
		korean: '주류성 (부안)',
		hanja: '周留城',
		x: 297,
		y: 626,
		kind: 'city',
		side: 'baekje',
		blurb: 'Base of the Baekje restoration. Prince Pung moved off it against advice, had to move back, and executed Boksin here.'
	},
	imjon: {
		id: 'imjon',
		founded: 500,
		name: 'Imjon Fortress',
		korean: '임존성 (예산)',
		x: 302,
		y: 576,
		kind: 'city',
		side: 'baekje',
		blurb: 'Where Hukchi Sangji rallied thirty thousand within ten days of Sabi’s fall.'
	},
	gwansan: {
		id: 'gwansan',
		founded: 500,
		name: 'Gwansan Fortress',
		korean: '관산성 (옥천)',
		hanja: '管山城',
		x: 332,
		y: 595,
		kind: 'city',
		side: 'baekje',
		blurb:
			'Where Jinhung’s betrayal ended: King Sung of Baekje was caught riding at night in 554, and a stable-slave named Dodo took his head.'
	},
	michuhol: {
		id: 'michuhol',
		founded: -18,
		fell: 10,
		name: 'Michuhol',
		korean: '미추홀 (인천)',
		hanja: '彌鄒忽',
		x: 295,
		y: 536,
		kind: 'city',
		side: 'baekje',
		blurb: 'The salt marshes Biryu chose over his brother’s ground — and regretted.'
	},

	// ————————————————————————— Gaya, Tamla, beyond —————————————————————————
	geumgwan: {
		id: 'geumgwan',
		founded: 42,
		fell: 532,
		name: 'Golden Gaya',
		korean: '금관가야 (김해)',
		hanja: '金官加耶',
		x: 386,
		y: 649,
		kind: 'city',
		side: 'gaya',
		avatar: '/pl_gaya_palace.png',
		gallery: ['/pl_gaya_huts.png'],
		blurb:
			'Founded in 42 by Suro, who hatched from one of six eggs. Its last prince surrendered to Silla in 532 — his grandson was Kim Yushin.'
	},
	daegaya: {
		id: 'daegaya',
		founded: 42,
		fell: 562,
		name: 'Great Gaya',
		korean: '대가야 (고령)',
		hanja: '大加耶',
		x: 360,
		y: 624,
		kind: 'city',
		side: 'gaya',
		blurb: 'The last Gaya kingdom, taken by Jinhung and the young Hwarang Sadaham in 562.'
	},
	ara: {
		id: 'ara',
		founded: 42,
		fell: 560,
		name: 'Bright Gaya',
		korean: '아라가야 (함안)',
		hanja: '阿羅加耶',
		x: 366,
		y: 647,
		kind: 'city',
		side: 'gaya',
		blurb: 'The horse Gaya on the bend of the Nam River, whose riders armoured their horses before most of Samhan armoured its men.',
		aliases: ['Ara Gaya', 'Ara', '아라가야'],
	},
	goryeonggaya: {
		id: 'goryeonggaya',
		founded: 42,
		fell: 562,
		name: 'Goryung Gaya',
		korean: '고령가야 (함창)',
		hanja: '古寧加耶',
		x: 356,
		y: 582,
		kind: 'city',
		side: 'gaya',
		blurb: 'The quiet Gaya, far up the Nakdong. Not the town called Goryung today; that one was Great Gaya’s.',
		aliases: ['Goryeong Gaya', '고령가야'],
	},
	seongsan: {
		id: 'seongsan',
		founded: 42,
		fell: 562,
		name: 'Holy Gaya',
		korean: '성산가야 (성주)',
		hanja: '星山加耶',
		x: 361,
		y: 614,
		kind: 'city',
		side: 'gaya',
		blurb: 'The Gaya nearest the eastern neighbours, and the first to watch them over the wall.',
		aliases: ['Seongsan Gaya', 'Seongsan', '성산가야'],
	},
	sogaya: {
		id: 'sogaya',
		founded: 42,
		fell: 562,
		name: 'Little Gaya',
		korean: '소가야 (고성)',
		hanja: '小加耶',
		x: 362,
		y: 662,
		kind: 'city',
		side: 'gaya',
		blurb: 'A bay full of boats on the southern sea, trading with the islands and the Easterners across the strait.',
		aliases: ['Sogaya', 'Little Gaya', '소가야'],
	},
	mugun: {
		id: 'mugun',
		name: 'Mugun',
		korean: '무근 (탐라)',
		hanja: '耽羅',
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
		founded: -400,
		fell: -108,
		name: 'Asadal',
		korean: '아사달',
		hanja: '阿斯達',
		x: 239,
		y: 477,
		kind: 'city',
		side: 'other',
		avatar: '/pl_rock_politics.png',
		blurb: 'Dangun’s city, and later Wanggum — the capital of Old Joseon, which fell to the Han in 108 BCE.'
	},
	buyeo_north: {
		id: 'buyeo_north',
		founded: -200,
		fell: 494,
		name: 'Buyeo',
		korean: '부여',
		hanja: '夫餘',
		x: 295,
		y: 208,
		kind: 'city',
		side: 'buyeo',
		capital: true,
		avatar: '/pl_buyeo_yard.png',
		gallery: ['/pl_northern_buyeo.png', '/pl_buyeo_palace.png', '/pl_yuhwa_hut.png'],
		blurb: 'The northern kingdom Jumong fled, and where Lady Ye raised his heir alone.'
	},
	western_wall: {
		id: 'western_wall',
		name: 'The Western Wall',
		korean: '천리장성',
		hanja: '千里長城',
		x: 140,
		y: 360,
		kind: 'city',
		side: 'goguryeo',
		offMap: true,
		title: 'The Great Wall of Korea',
		blurb: 'A thousand li of forts from the northern marches to the sea, built so the West has to knock on every door.',
		arc: 'Three summers after the West flattened Goguryeo’s pile of enemy bones, Goguryeo got the message and started building. Sixteen years of it. Not one long rampart like the West’s own wall, but a chain: hill forts on every road east of the Liao, each one close enough to see the next one’s beacon. Yeon Gaesomun runs the works before he runs the country, and he walks it with a plumb line. When the Western emperor finally comes, he has to take the forts one at a time. He gets as far as Ansi.',
		aliases: ['Western Wall', 'Thousand-li Wall', 'Great Wall of Korea', '천리장성', '서쪽 장성'],
		sobriquets: ['The Great Wall of Korea']
	},
	changan: {
		id: 'changan',
		name: 'Chang’an',
		korean: '장안',
		hanja: '長安',
		x: 40,
		y: 470,
		kind: 'city',
		side: 'tang',
		avatar: '/pl_daming_palace.png',
		gallery: ['/pl_daming.png', '/pl_daming_night.png'],
		offMap: true,
		blurb:
			'the Western capital, largest city on earth. Chunchu wins his alliance here in 648; Euija dies here a prisoner in 660.'
	},

	// ———————— Roads in: invasion ports, fords and passes (route maps only) ————————
	yingzhou: {
		id: 'yingzhou',
		name: 'Yingzhou',
		korean: '영주 (유성)',
		hanja: '營州',
		x: 38,
		y: 323,
		kind: 'city',
		side: 'tang',
		offMap: true,
		blurb: 'The empire’s last walled town before the Liao — old Liucheng. Every army out of the West musters here, and every army that comes back limps through it.',
		aliases: ['Yingzhou', 'Liucheng', '영주', '유성', '營州']
	},
	tongding: {
		id: 'tongding',
		name: 'Tongding',
		korean: '통정진',
		hanja: '通定鎮',
		x: 141,
		y: 305,
		kind: 'river',
		side: 'tang',
		offMap: true,
		blurb: 'A garrison on the upper Liao with an unwatched ford. In the fourth month of 645 the Blue Dragon turns north in the night and crosses here.',
		aliases: ['Tongding', '통정진', '通定鎮']
	},
	huaiyuan: {
		id: 'huaiyuan',
		name: 'Huaiyuan',
		korean: '회원진',
		hanja: '懷遠鎮',
		x: 127,
		y: 329,
		kind: 'city',
		side: 'tang',
		offMap: true,
		blurb: 'The middle road over the Liao. The West show their banners here in 645 so Goguryeo will watch it; the emperor’s own column crosses the marsh beside it.',
		aliases: ['Huaiyuan', '회원진', '懷遠鎮']
	},
	ogol: {
		id: 'ogol',
		name: 'Ogol',
		korean: '오골성 (봉성)',
		hanja: '烏骨城',
		x: 189,
		y: 383,
		kind: 'city',
		side: 'goguryeo',
		offMap: true,
		blurb: 'Crow-Bone Fortress, on the mountain road from the Amnok to Ansi. Goguryeo’s relief armies come down this road in 645.',
		aliases: ['Ogol', 'Ogol Fortress', '오골성', '烏骨城']
	},
	laizhou: {
		id: 'laizhou',
		name: 'Laizhou',
		korean: '내주 (동래)',
		hanja: '萊州',
		x: 6,
		y: 545,
		kind: 'harbor',
		side: 'tang',
		offMap: true,
		blurb: 'Donglai, the Shandong port the fleets sail from. The West put to sea here in 612, the West with five hundred hulls in 645.',
		aliases: ['Laizhou', 'Donglai', '내주', '동래', '萊州']
	},
	dengzhou: {
		id: 'dengzhou',
		name: 'Dengzhou',
		korean: '등주',
		hanja: '登州',
		x: 42,
		y: 515,
		kind: 'harbor',
		side: 'tang',
		offMap: true,
		blurb: 'The harbour on the tip of Shandong where Silla envoys step ashore for the long road to Chang’an.',
		aliases: ['Dengzhou', '등주', '登州']
	},
	chengshan: {
		id: 'chengshan',
		name: 'Chengshan',
		korean: '성산',
		hanja: '成山',
		x: 121,
		y: 538,
		kind: 'harbor',
		side: 'tang',
		offMap: true,
		blurb: 'The easternmost cape of Shandong, where the land points at Samhan. Su Dingfang’s fleet pushes off from it in 660.',
		aliases: ['Chengshan', 'Cape Chengshan', '성산', '成山']
	},
	deokmul: {
		id: 'deokmul',
		name: 'Dukmul Island',
		korean: '덕물도 (덕적도)',
		hanja: '德物島',
		x: 272,
		y: 548,
		kind: 'harbor',
		side: 'silla',
		offMap: true,
		blurb: 'A small island off the Han estuary. In the sixth month of Western 68 fleet anchors here, and a Silla prince is rowed out to be told the date.',
		aliases: ['Deokmul Island', 'Deokmul', '덕물도', '德物島']
	},
	geumdol: {
		id: 'geumdol',
		name: 'Gumdol Fortress',
		korean: '금돌성 (상주)',
		hanja: '今突城',
		x: 351,
		y: 588,
		kind: 'city',
		side: 'silla',
		offMap: true,
		blurb: 'The hill fort where King Muyeol stops in 660 and hands the field to his son and Yushin.',
		aliases: ['Geumdol Fortress', 'Geumdol', '금돌성', '今突城']
	},
	tanhyeon: {
		id: 'tanhyeon',
		name: 'Charcoal Pass',
		korean: '탄현',
		hanja: '炭峴',
		x: 328,
		y: 595,
		kind: 'mountain',
		side: 'baekje',
		offMap: true,
		blurb: 'The pass on Baekje’s eastern door. Sunchung begged from prison that it be held; in 660 the Silla army walks through it unopposed.',
		aliases: ['Charcoal Pass', 'Tanhyeon', '탄현', '炭峴']
	},
	cheonseong: {
		id: 'cheonseong',
		name: 'Chun Fortress',
		korean: '천성',
		hanja: '泉城',
		x: 295,
		y: 519,
		kind: 'harbor',
		side: 'silla',
		offMap: true,
		blurb: 'A beach where the Imjin meets the Han. Xue Rengui lands his horses here in the ninth month of 675, and Munhun waits until the boats are empty.',
		aliases: ['Cheonseong', '천성', '泉城']
	},
	tsukushi: {
		id: 'tsukushi',
		name: 'Tsukushi',
		korean: '쓰쿠시 (나노쓰)',
		hanja: '筑紫',
		x: 451,
		y: 733,
		kind: 'harbor',
		side: 'yamato',
		offMap: true,
		blurb: 'the East’s harbour on the strait, where the relief fleets for Baekje load in 661–663.',
		aliases: ['Tsukushi', 'Nanotsu', '쓰쿠시', '筑紫']
	},

	cheomseongdae: {
		id: 'cheomseongdae',
		name: 'Chumsungdae',
		korean: '첨성대',
		hanja: '瞻星臺',
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
		hanja: '漢拏山',
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
		hanja: '飛鳥',
		x: 500,
		y: 726,
		kind: 'city',
		side: 'yamato',
		offMap: true,
		avatar: '/pl_asuka.png',
		blurb:
			'the East’s court. Chunchu came asking for troops in 647 and was refused; fifteen years later it sent forty thousand men to die for Baekje.'
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
		hanja: '冥府',
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
			'Jusung',
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
		blurb: 'Hannim’s seat above 삼계 — not a peer of the three courts below.',
		arc: '하늘나라 is the Creator’s own court, not a fourth Samhan kingdom and not a fourth peer of 삼계. Sons and seals go down from here; Living, Dead, and Western Flower Field keep house below. The yearly 정자 does not need Hannim present for the meeting to count.',
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
		arc: '이승 is one court of 삼계 under Hannim’s heaven. After Heaven–Earth King retired, the twins wagered flowers; Little Star swapped blooms and took the warm side — which is why thieves and bad hours live under his small law. Ibiga, Haemosu, and Samsin tend sky, sun, and birth here. Not Tamla the island and not a Samhan map.',
		sobriquets: ['Land of the Living', '이승'],
		aliases: [
			'Living World',
			'the living world',
			'Land of the Living',
			'이승',
			'Isung'
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
		arc: '서천꽃밭 is the third court of 삼계: travel west from 이승 far enough and living maps end. Hallakgungi (할락궁이) keeps the gate after Father Saradoryung retired. Resurrection blooms sit beside the extinction flower; Jachungbi’s chain runs through this gate. Flower Cliff is a drop at the field’s edge, not the field itself. Not a kingdom — a court among the Three Realms under Hannim.',
		sobriquets: ['서천꽃밭', 'Hallakgungi’s rows', 'the western field'],
		aliases: [
			'Western Flower Field',
			'the Western Flower Field',
			'서천꽃밭',
			'Suchun',
			'West Field',
			'western flower field'
		]
	},

	mannogun: {
		id: 'mannogun',
		name: 'Manno',
		korean: '만노',
		hanja: '萬弩',
		x: 348,
		y: 548,
		kind: 'city',
		side: 'silla',
		offMap: true,
		avatar: '/pl_mannogun.png',
		title: 'County of the first Kim house',
		blurb: 'A wooden wall, a granary, a leaking office — where Manmyung and Seohyun keep house, and Yushin is born.',
		arc: 'North of Surabol, a county that changes hands faster than the clerks can write. She learns the granary. He learns the hills. The one room with a door that shuts is theirs.',
		events: [
			{ year: 594, label: 'They ride north after the lightning.' },
			{ year: 595, label: 'Yushin born — seven stars on his back.' }
		],
		aliases: ['Manno', 'Mannogun', '만노', '만노군', '萬弩']
	},
	locked_room: {
		id: 'locked_room',
		name: 'The Locked Room',
		korean: '별채',
		x: 393,
		y: 627,
		kind: 'cave',
		side: 'silla',
		cityId: 'surabol',
		offMap: true,
		avatar: '/pl_locked_room.png',
		title: 'Suulbu’s house apart',
		blurb: 'The room her father locked. Lightning takes the door. She crawls out through the drain.',
		arc: 'Prince Suulbu shuts his daughter in the house apart rather than see her marry a Gaya boy. On the last night the sky picks the door. The cousins run. Manmyung goes out on her elbows, in good silk, in the mud.',
		events: [{ label: 'Lightning hits the door; she walks out to the lane.' }],
		aliases: ['The Locked Room', 'the locked room', '별채', 'Suulbu’s house']
	},
	ghost_bridge: {
		id: 'ghost_bridge',
		name: 'Ghost Bridge',
		korean: '귀교',
		hanja: '鬼橋',
		x: 386,
		y: 626,
		kind: 'river',
		side: 'silla',
		cityId: 'surabol',
		offMap: true,
		avatar: '/pl_ghost_bridge.png',
		title: 'Stone bridge over Hwangcheon',
		blurb: 'West of the Moon Palace, over the Hwangcheon ditch — a bridge of dressed stones that nobody remembers ordering.',
		arc: 'Samguk Yusa: Jinpyung tells the boy who talks to the dark to put a bridge on the north ditch of Sinwonsa (or the deep channel east of Hwangcheon). The stones are dressed in one night. The capital calls it 귀교. Later ages look for it southwest of Oreung, in Sinwonpyeong. In this house Yongsu walks the same stream after midnight, and Chunmyung married into that weather.',
		events: [{ year: 612, label: 'By morning the stones are there. The servants say goblins.' }],
		aliases: ['Ghost Bridge', '귀교', '鬼橋', 'Gwigyo', 'Sinwon Bridge', '신원교']
	},
	eastern_harbor: {
		id: 'eastern_harbor',
		name: 'Eastern Harbour',
		korean: '동항',
		x: 418,
		y: 622,
		kind: 'harbor',
		side: 'silla',
		cityId: 'surabol',
		offMap: true,
		avatar: '/pl_eastern_harbor.png',
		title: 'Where the grass turns to sand',
		blurb: 'The east-sea quay beyond Surabol — Chunchu rides here with Bupmin; the ledgers later marry Bupmin to Jahee.',
		arc: 'An open field, then sand, then a flat silver sea. The boy on the lawyer’s horse recites pirate victories. Years on, ocean-trade sums are kept on this same quay.',
		events: [{ year: 632, label: 'Coronation morning: father and son ride until the grass gives out.' }],
		aliases: ['Eastern Harbour', 'Eastern Harbor', '동항', 'east harbour', 'Gampo']
	},
	jolbon_well: {
		id: 'jolbon_well',
		name: 'The Well',
		korean: '졸본 우물',
		x: 245,
		y: 342,
		kind: 'cave',
		side: 'jolbon',
		cityId: 'jolbon',
		offMap: true,
		avatar: '/temp/jumong-set-well-day-empty.jpg',
		title: 'Jumong and Sosuno’s yard',
		blurb: 'A packed-earth well-yard — the ledger and the longing start at the rim.',
		arc: 'They stand on the packed earth at the rim. Nobody stands in the shaft. She prices a kingdom. He cannot count grain for looking at her.',
		aliases: ['The Well', 'Jolbon well', '졸본 우물', 'the well']
	},
	wolji: {
		id: 'wolji',
		name: 'Wolji',
		korean: '월지',
		hanja: '月池',
		x: 394,
		y: 626,
		kind: 'cave',
		side: 'silla',
		cityId: 'surabol',
		offMap: true,
		avatar: '/pl_wolji.png',
		title: 'Moon pond of the palace',
		blurb: 'The pond by Wolseong — colonnades, still water, the one walk Yushin and Sunduk are allowed.',
		arc: 'Not the later banquet halls of Imhaejeon. The moon pond as a court already uses it: a sheet of water under giwa, a colonnade ranked by bone, a lantern he does not knock on.',
		aliases: ['Wolji', '월지', '月池', 'Anapji', '안압지', 'Moon Pond']
	},
	hwarang_yard: {
		id: 'hwarang_yard',
		name: 'Hwarang Yard',
		korean: '화랑 연무장',
		x: 390,
		y: 630,
		kind: 'cave',
		side: 'silla',
		cityId: 'surabol',
		offMap: true,
		avatar: '/pl_hwarang_yard.png',
		gallery: ['/pl_hwarang_gate.png'],
		title: 'Dueling grounds under the Moon Palace',
		blurb: 'Packed earth, a painted wall, a gate nobody’s father should walk them to. Yushin and Bidam meet here. The count ends here.',
		arc: 'Class 51’s first morning starts at the gate. The yard keeps the score at 108–108 until Radiance makes it blood. Bidam’s head comes back to this dirt.',
		events: [
			{ year: 610, label: 'Class 51’s first morning. The count starts.' },
			{ year: 618, label: 'Class 59: a pear core, a millstone rope.' },
			{ year: 647, label: 'The score breaks.' }
		],
		aliases: ['Hwarang Yard', 'Hwarang yard', '화랑 연무장', '연무장', 'dueling grounds']
	},
	hwarang_gate: {
		id: 'hwarang_gate',
		name: 'Hwarang Gate',
		korean: '화랑 연무장 문',
		x: 389,
		y: 631,
		kind: 'cave',
		side: 'silla',
		cityId: 'surabol',
		offMap: true,
		avatar: '/pl_hwarang_gate.png',
		title: 'The yard’s timber gate',
		blurb: 'Biryun walks Bidam this far and no further. Chunchu asks three times not to be walked. The gate lets them in.',
		aliases: ['Hwarang Gate', 'Hwarang yard gate', '화랑 연무장 문', '연무장 문']
	}
};

/** Markers drawn permanently on the map (off-map sites are omitted). */
/** Whether a place stands in `year` (always, for places without dates). */
export const standsIn = (p: Place, year: number) => (p.founded ?? -Infinity) <= year && year <= (p.fell ?? Infinity);

export const MAP_MARKERS = Object.values(PLACES).filter((p) => !p.offMap);

/** The whole sheet (`/map.svg`). */
export const MAP_VIEWBOX = { w: 595, h: 842 };

/**
 * The land around the sheet (`/map-outer.svg`, Natural Earth in the sheet's own
 * projection, built by scripts/build-outer-land.mjs): Chang'an to Nara, so a
 * wide frame never ends on the sheet's edge.
 */
export const MAP_OUTER = { x: -700, y: -250, w: 1700, h: 1400 };

/** The part of the sheet the map shows: every marker, without the empty steppe and sea. */
export const MAP_VIEW = { x: 45, y: 150, w: 460, h: 620 };

/** A box in sheet units, as % of the `MAP_VIEW` window it is laid out against. */
function boxInView(r: { x: number; y: number; w: number; h: number }) {
	return {
		left: ((r.x - MAP_VIEW.x) / MAP_VIEW.w) * 100,
		top: ((r.y - MAP_VIEW.y) / MAP_VIEW.h) * 100,
		width: (r.w / MAP_VIEW.w) * 100,
		height: (r.h / MAP_VIEW.h) * 100
	};
}

/** The whole sheet's box (in % of the visible window), scaled and shifted so only `MAP_VIEW` shows. */
export const MAP_SHEET_BOX = boxInView({ x: 0, y: 0, ...MAP_VIEWBOX });

/** `MAP_OUTER`'s box in the same frame. */
export const MAP_OUTER_BOX = boxInView(MAP_OUTER);

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
	/** the place profile the line opens */
	place?: string;
	/** [begun, finished]: on a dated map the line grows stop by stop between these years */
	built?: [number, number];
}

export const MAP_LINES: MapLine[] = [
	{
		id: 'cheolli',
		name: 'The Western Wall',
		korean: '천리장성',
		side: 'goguryeo',
		place: 'western_wall',
		stops: ['buyeo_fort', 'sinseong', 'gaemo', 'yodong', 'ansi', 'geonan', 'bisa'],
		/* begun after the Sui wars; standing by the time Yeon takes power */
		built: [631, 641]
	}
];

/**
 * The great rivers, traced from real longitude/latitude (source to mouth) and
 * projected onto the sheet with the border fit, so each one ends where it
 * meets the sea. Names are the contemporary ones the chronicles use.
 */
export interface RiverLine {
	id: string;
	name: string;
	korean: string;
	side: Person['kingdom'];
	/** sheet coordinates, source → mouth */
	points: Pt[];
	/** where the river's name sits (a quiet stretch, off the channel) */
	labelAt: Pt;
}

type LonLat = [number, number];

/** Natural Earth 1:10m centerlines (scripts/build-world-layer.mjs) where it has the river; the drawn course otherwise. */
const DETAILED = riversNe.book as unknown as Record<string, LonLat[]>;

/** The detailed line, turned so it runs the same way as the drawn one (source → mouth). */
function detailedCourse(id: string, drawn: LonLat[]): LonLat[] {
	const line = DETAILED[id];
	if (!line?.length) return drawn;
	const mouth = drawn[drawn.length - 1];
	const gap = (p: LonLat) => Math.hypot(p[0] - mouth[0], p[1] - mouth[1]);
	return gap(line[0]) < gap(line[line.length - 1]) ? [...line].reverse() : line;
}

const river = (
	id: string,
	name: string,
	korean: string,
	side: Person['kingdom'],
	course: LonLat[],
	label: LonLat
): RiverLine => ({
	id,
	name,
	korean,
	side,
	points: detailedCourse(id, course).map(([lon, lat]) => project(lon, lat)),
	labelAt: project(...label)
});

export const RIVERS: RiverLine[] = [
	river('amnok', 'Amnok River', '압록강', 'goguryeo', [
		[128.06, 41.99], [127.95, 41.75], [128.1, 41.45], [127.75, 41.42], [127.35, 41.6], [127.0, 41.75],
		[126.85, 41.55], [126.6, 41.35], [126.3, 41.15], [126.0, 40.95], [125.7, 40.82], [125.4, 40.65],
		[125.1, 40.5], [124.8, 40.35], [124.55, 40.2], [124.4, 40.08], [124.32, 39.9]
	], [125.5, 41.0]),
	river('duman', 'Duman River', '두만강', 'goguryeo', [
		[128.1, 42.0], [128.45, 42.05], [128.85, 42.08], [129.1, 42.2], [129.35, 42.35], [129.6, 42.42],
		[129.75, 42.55], [129.82, 42.75], [129.9, 42.98], [130.1, 42.9], [130.25, 42.72], [130.4, 42.55],
		[130.58, 42.4], [130.7, 42.29]
	], [129.3, 42.55]),
	river('liao', 'Liao River', '요하', 'goguryeo', [
		[123.9, 43.0], [123.7, 42.6], [123.4, 42.2], [123.0, 41.9], [122.6, 41.6], [122.3, 41.25],
		[122.2, 40.95], [122.25, 40.7]
	], [122.55, 41.85]),
	river('chongchon', 'Salsu River', '살수 (청천강)', 'goguryeo', [
		[127.0, 40.55], [126.75, 40.4], [126.45, 40.25], [126.2, 40.05], [125.95, 39.85], [125.75, 39.68],
		[125.55, 39.58], [125.4, 39.55]
	], [126.3, 40.0]),
	river('daedong', 'Daedong River', '대동강', 'goguryeo', [
		[127.05, 40.2], [126.85, 39.95], [126.6, 39.75], [126.35, 39.62], [126.1, 39.45], [125.95, 39.3],
		[125.85, 39.15], [125.75, 39.02], [125.6, 38.9], [125.45, 38.8], [125.3, 38.73], [125.15, 38.7]
	], [126.35, 39.45]),
	river('imjin', 'Imjin River', '임진강', 'goguryeo', [
		[127.45, 38.95], [127.3, 38.75], [127.15, 38.55], [127.05, 38.3], [126.95, 38.1], [126.9, 37.97],
		[126.75, 37.87], [126.68, 37.76]
	], [127.2, 38.4]),
	river('bukhan', 'North Han River', '북한강', 'silla', [
		[127.95, 38.55], [127.75, 38.3], [127.6, 38.1], [127.7, 37.9], [127.55, 37.75], [127.42, 37.6],
		[127.32, 37.53]
	], [127.75, 38.1]),
	river('han', 'Han River', '한강', 'silla', [
		[128.95, 37.2], [128.75, 37.35], [128.6, 37.4], [128.47, 37.3], [128.46, 37.13], [128.3, 37.0],
		[128.15, 36.98], [127.93, 36.99], [127.82, 37.12], [127.7, 37.25], [127.55, 37.4], [127.32, 37.53],
		[127.15, 37.55], [126.98, 37.52], [126.85, 37.58], [126.72, 37.65], [126.62, 37.73]
	], [127.6, 37.2]),
	river('baekgang', 'White River', '백강', 'baekje', [
		[127.52, 35.65], [127.55, 35.85], [127.6, 36.0], [127.68, 36.15], [127.6, 36.3], [127.45, 36.45],
		[127.3, 36.5], [127.12, 36.46], [127.0, 36.37], [126.91, 36.28], [126.92, 36.15], [126.8, 36.05],
		[126.7, 36.02], [126.6, 36.0]
	], [127.3, 36.2]),
	river('nakdong', 'Nakdong River', '낙동강', 'silla', [
		[129.05, 37.15], [128.95, 36.95], [128.75, 36.6], [128.5, 36.55], [128.3, 36.48], [128.25, 36.35],
		[128.35, 36.15], [128.4, 35.95], [128.45, 35.8], [128.4, 35.6], [128.45, 35.45], [128.6, 35.38],
		[128.78, 35.38], [128.95, 35.25], [128.95, 35.08]
	], [128.15, 35.95])
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
