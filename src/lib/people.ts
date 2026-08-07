/**
 * Cast of the chronicle.
 *
 * Ages shown in the prose are *derived* from `born` and the year of the entry
 * they appear in — the story text no longer carries hardcoded ages.
 * `aliases` are the surface forms that appear in the prose.
 */

import { RELATIONSHIPS, CHART_NODES } from '$lib/relations';
import { PLACE_PROFILES } from '$lib/places';

export interface LifeEvent {
	year?: number;
	label: string;
}

export type BondKind = 'love' | 'affair' | 'rival' | 'kin' | 'sworn' | 'mentor';

/**
 * A year-bounded face of the same person — prince vs king, childhood name vs
 * temple title. `from` inclusive, `until` exclusive. Omit either end for open.
 * Unset fields fall back to the person’s base `name` / `title` / `avatar`.
 */
export interface PersonStage {
	from?: number;
	until?: number;
	name?: string;
	korean?: string;
	title?: string;
	avatar?: string;
}

export interface Person {
	id: string;
	name: string; // display name
	korean?: string;
	hanja?: string;
	title?: string; // "King Muyeol of Silla"
	/** 'concept' = institutions/ideas; 'nation' = kingdoms; 'relationship' = an edge; 'place' = map site. */
	entity?: 'concept' | 'nation' | 'relationship' | 'place';
	kingdom:
		| 'silla'
		| 'baekje'
		| 'goguryeo'
		| 'tang'
		| 'gaya'
		| 'yamato'
		| 'tamla'
		| 'joseon'
		| 'underworld'
		| 'other';
	born?: number; // negative = BCE
	died?: number;
	bornApprox?: boolean;
	main?: boolean; // the three leads
	/**
	 * Which silhouette stands in when there is no portrait. Only needed for
	 * people the relationship chart does not already place (see `avatarOf`);
	 * on a `concept` it is also what marks the record as a body rather than
	 * an institution.
	 */
	gender?: 'm' | 'f';
	avatar?: string; // profile picture, e.g. "/people/chunchu.png"
	photo?: string; // real photograph (nations), e.g. "/nations/silla.jpg"
	photoCredit?: string;
	tagline: string; // one line, shown in the hover card
	/** Defining line shown large on the profile panel. */
	quote?: string;
	arc?: string; // character arc, shown in the panel
	/** Temperament / philosophy — how they move through politics and love. */
	nature?: string;
	/**
	 * Ring-pommel blade — unique for those who fight (or rarely do).
	 * Decoration read character the way a crest does.
	 */
	blade?: string;
	/** Unique binyeo — hairpin that hints at a woman’s station and nature. */
	binyeo?: string;
	events?: LifeEvent[];
	/** Year-scoped name / title / portrait overrides (prince → king, etc.). */
	stages?: PersonStage[];
	aliases: string[];
	/**
	 * Lived-in epithets (OP/Naruto-style). Shown in wiki/profile.
	 * Distinctive ones should also appear in `aliases` so prose links;
	 * disputed or ultra-generic titles stay here only to avoid false positives.
	 */
	sobriquets?: string[];
	/** For relationships: the two people this edge connects. */
	between?: [string, string];
	/** For relationships: the nature of the bond. */
	bond?: BondKind;
	/** Chart layout hint (people nodes that appear on the relationship graph). */
	chart?: { x: number; y: number };
}

export const KINGDOMS: Record<
	Person['kingdom'],
	{ label: string; color: string; flag?: string; icons?: string }
> = {
	silla: {
		label: 'Silla',
		color: '#3E79E4',
		flag: '/flag_silla.svg',
		icons: 'crown · heavenly horse · blue · moon · love'
	},
	baekje: {
		label: 'Baekje',
		color: '#FFCB51',
		flag: '/flag_baekje.svg',
		icons: 'crown · heavenly deer · yellow · stars · loyalty'
	},
	goguryeo: {
		label: 'Goguryeo',
		color: '#C30000',
		flag: '/flag_goguryeo.svg',
		icons: 'crown · three-legged crow · red · sun · will'
	},
	tang: { label: 'Tang', color: '#b45309', flag: '/flag_tang.svg', icons: 'dragon · gold · empire' },
	gaya: {
		label: 'Gaya',
		color: '#8b5cf6',
		flag: '/flag_gaya.svg',
		icons: 'six eggs · iron · purple'
	},
	yamato: {
		label: 'Yamato',
		color: '#ec4899',
		flag: '/flag_wa.svg',
		icons: 'rising sun · cherry · sea lanes'
	},
	tamla: {
		label: 'Tamla',
		color: '#f97316',
		flag: '/flag_tamla.svg',
		icons: 'oranges · island · three princes'
	},
	joseon: {
		label: 'Joseon',
		color: '#1a4d6d',
		icons: 'sandalwood · mandate · afterlife of the name'
	},
	underworld: {
		label: 'Underworld',
		color: '#5f5f6b',
		icons: 'ledger · crow · borders of the dead'
	},
	other: { label: '—', color: '#8a8a94' }
};

export const PEOPLE: Person[] = [
	{
		id: 'bohee',
		name: 'Bohee',
		korean: '보희',
		kingdom: 'silla',
		title: 'Elder sister of Munhee',
		tagline: 'Dreamed she drowned the capital, and sold the dream for a silk skirt.',
		quote: "Silence is also a stitch.",
		events: [
			{ year: 625, label: 'Sells the dream. Declines to sew a nobleman’s coat.' }
		],
		aliases: ['Bohee']
	},
	{
		id: 'haemosu',
		avatar: '/people/haemosu.png',
		name: 'Haemosu',
		korean: '해모수',
		hanja: '解慕漱',
		kingdom: 'goguryeo',
		title: 'God of the sun',
		tagline: 'Drove the sun’s chariot every day of his life and stopped it exactly once.',
		quote: "I stop the chariot once. That once is enough.",
		arc: 'In the heavenly court he is the sun — not Lord of Heaven, not Son of Heaven, but the light that still answers desire. He crosses the sky on schedule until Yuhwa in the Amnok shallows breaks the schedule; Habek casts her out; Jumong is born of that heat.',
		events: [
			{ label: 'Sees Yuhwa in the shallows of the Ubal and comes down.' },
			{ label: 'Builds a copper room on the riverbank in an afternoon.' }
		],
		aliases: ['Haemosu']
	},
	{
		id: 'habek',
		name: 'Habek',
		korean: '하백',
		hanja: '河伯',
		kingdom: 'goguryeo',
		title: 'God of the Amnok River',
		tagline: 'Ruled a river the way kings rule borders — and cast out a daughter for crossing one.',
		quote: "The Amnok keeps its own court.",
		arc: 'River-god of the Amnok, father of Yuhwa. He keeps a court under the current — vassals of fish and turtle, borders of mist — and when the sun god takes his daughter he answers as a sovereign, not a peasant: exile, not negotiation. Jumong’s claim later runs through his blood whether Habek wills it or not.',
		events: [
			{ label: 'Casts Yuhwa out for loving Haemosu.' },
			{ label: 'His river later bridges Jumong’s flight on the backs of fish and turtles.' }
		],
		aliases: ['Habek', 'Habaek', '하백', '河伯']
	},
	{
		id: 'hwanin',
		name: 'Hwanin',
		korean: '환인',
		hanja: '桓因',
		kingdom: 'other',
		title: 'Lord of Heaven',
		tagline: 'The throne above every earthly court — and the father who sent a son down to farm.',
		quote: "Heaven rules by sending. Earth rules by staying.",
		arc: 'Lord of Heaven — the summit of the unspoken pantheon. He does not plough; he commissions. When the world below needs a steward of the mandate, he sends Hwanung, Son of Heaven, with three seals and three thousand, and the rest of history is what that descent costs.',
		events: [{ label: 'Sends Hwanung down under the sandalwood tree.' }],
		aliases: ['Hwanin', '환인', '桓因', 'Lord of Heaven']
	},
	{
		id: 'yeontabal',
		avatar: '/people/yeon_tabal.png',
		name: 'Yeon Tabal',
		korean: '연타발',
		kingdom: 'goguryeo',
		title: 'Chieftain of Jolbon',
		tagline: 'Suspicious of an exile — until that exile split his arrow.',
		quote: "Salt and iron before courtesy.",
		nature:
			'Speaks the way later Yeons will speak — short, hot, no patience for a Go prince who arrives with nothing but a bow. The Yeon clan’s river wealth against the royal Go claim starts here, implied in every weighing look he gives Jumong.',
		blade: 'Ring-pommel hunting sword — tiger-tooth guard, no court polish.',
		events: [
			{ label: 'Backs an exiled prince with salt, iron and his daughter.' },
			{ label: 'The Yeon hall’s register — blunt, loyal, hard to buy — passes down the blood.' }
		],
		aliases: ['Yeon Tabal', 'Tabal']
	},
	{
		id: 'jomigon',
		name: 'Jomi-gon',
		korean: '조미곤',
		kingdom: 'silla',
		title: 'Servant, prisoner, and the quietest weapon in the war',
		tagline: 'Sent back into Baekje as a household man, and spent eleven years being useful.',
		quote: "Usefulness is its own exile.",
		events: [
			{ year: 655, label: 'Returns to Sabi as steward to the minister Imja.' },
			{ year: 660, label: 'Imja’s silence becomes Silla’s door.' }
		],
		aliases: ['Jomi-gon', 'Jomigon']
	},
	{
		id: 'imja',
		name: 'Imja',
		korean: '임자',
		hanja: '任子',
		kingdom: 'baekje',
		title: 'Jwapyeong of Baekje',
		tagline: 'Was asked what becomes of his house when the country falls, and did not report the question.',
		quote: "Ask the question. Do not deliver the answer.",
		aliases: ['Imja']
	},
	{
		id: 'ibiga',
		avatar: '/people/ibiga.png',
		name: 'Ibiga',
		korean: '이비가',
		kingdom: 'gaya',
		title: 'God of the sky',
		tagline: 'Came down to a mountain ridge and could not take his hands back.',
		quote: "Desire is a kind of weather — it does not ask permission.",
		arc: 'God of the sky in the pantheon’s middle court — below Heaven’s lordship, beside the mountain’s claim. He descends to the Lady of the Right View’s ridge and cannot leave; Gaya’s eggs are born of that overnight sovereignty.',
		events: [{ label: 'Touches the Lady of the Right View; two sons are born of that night.' }],
		aliases: ['Ibiga'],
		chart: { x: 40, y: 520 }
	},
	{
		id: 'jeonggyeon',
		avatar: '/people/rightview.png',
		name: 'Lady of the Right View',
		korean: '정견모주',
		hanja: '正見母主',
		kingdom: 'gaya',
		title: 'Goddess of the mountain',
		tagline: 'Let the sky kneel on her ridge — and kept him until morning.',
		quote: "Nights when heaven kneels are not so common.",
		arc: 'Goddess of the mountain — the ridge that answers the sky. She receives Ibiga not as a guest but as a court receives a visiting power, and keeps him until morning; Suro and Ijinasi hatch from that night’s mandate.',
		events: [{ label: 'Mother of Suro and Ijinasi.' }],
		aliases: ['Lady of the Right View', 'Jeonggyeonmoju', 'Jeonggyeon', 'rightview'],
		chart: { x: 220, y: 520 }
	},
	{
		id: 'suro',
		avatar: '/people/suro.png',
		name: 'King Suro',
		korean: '수로왕',
		hanja: '首露王',
		kingdom: 'gaya',
		title: 'Founder of Golden Gaya',
		tagline: 'Came out of the first egg, and walked down to the beach himself.',
		quote: "Hunger is honest. Meet it yourself.",
		events: [
			{ year: 42, label: 'Hatches from the box of six eggs; founds Golden Gaya.' },
			{ year: 48, label: 'Meets a princess off a red-sailed ship and does not send a servant.' },
			{ label: 'Lets two of his ten sons carry her family name instead of his.' }
		],
		aliases: ['King Suro', 'Suro'],
		chart: { x: 40, y: 640 }
	},
	{
		id: 'ijinasi',
		avatar: '/people/ijinasi.png',
		name: 'King Ijinasi',
		korean: '이진아시왕',
		hanja: '伊珍阿豉王',
		kingdom: 'gaya',
		title: 'Founder of Great Gaya',
		gender: 'm',
		tagline: 'The other egg — Suro’s brother, who walked a different valley.',
		quote: "Six eggs. Six thrones. Take the larger hill.",
		nature: 'Twin-born of the mountain night with Suro; less charming, more territorial. Where Suro waits on a beach for a red sail, Ijinasi builds a court that will one day outlast Golden Gaya’s fame and still lose the war that matters.',
		events: [
			{ year: 42, label: 'Hatches among the six; founds Great Gaya.' }
		],
		aliases: ['King Ijinasi', 'Ijinasi', '이진아시']
	},
	{
		id: 'heohwangok',
		avatar: '/people/heo.png',
		name: 'Queen Heo',
		korean: '허황옥',
		hanja: '許黃玉',
		kingdom: 'gaya',
		title: 'First queen of Golden Gaya',
		tagline: 'Sailed in from a country nobody had heard of, and kept her own name.',
		quote: "Keep your own name across any sea.",
		events: [
			{ year: 48, label: 'Arrives by sea at sixteen; buries her silk trousers as an offering.' },
			{ label: 'Mother of ten sons; two of them take her surname.' }
		],
		aliases: ['Queen Heo', 'Heo Hwangok'],
		chart: { x: 220, y: 640 }
	},
	{
		id: 'hwanung',
		avatar: '/people/hwanung.png',
		name: 'Hwanung',
		korean: '환웅',
		hanja: '桓雄',
		kingdom: 'other',
		title: 'Son of Heaven',
		tagline: 'Sent down with the mandate — and could not rule until he had touched the earth.',
		quote: "A king must first touch the earth.",
		arc: 'Son of Heaven — Hwanin’s heir, sent below with three seals and three thousand. The gravity of the descent is the story: heaven’s word made flesh among garlic, mugwort, and a woman who used to be a bear. Their son Dangun inherits the mandate as earthly steward.',
		events: [{ label: 'Marries Ungnyeo under the sacred tree; fathers Dangun.' }],
		aliases: ['Hwanung', 'Son of Heaven'],
		chart: { x: 40, y: 760 }
	},
	{
		id: 'ungnyeo',
		avatar: '/people/ungnyeo.png',
		name: 'Ungnyeo',
		korean: '웅녀',
		hanja: '熊女',
		kingdom: 'other',
		title: 'The Bear-Woman',
		tagline: 'Twenty-one days of garlic and mugwort — then she waited to be seen.',
		quote: "Endure the dark. Become what the light can marry.",
		events: [{ label: 'Becomes a woman; stands under the tree until heaven marries her.' }],
		aliases: ['Ungnyeo', 'Bear-Woman', 'the Bear-Woman'],
		chart: { x: 220, y: 760 }
	},
	// ————————————————————————— the three leads —————————————————————————
	{
		id: 'chunchu',
		avatar: '/people/chunchu.png',
		name: 'King Muyeol',
		korean: '김춘추',
		hanja: '金春秋',
		title: 'King Muyeol, 29th of Silla',
		kingdom: 'silla',
		born: 603,
		died: 661,
		main: true,
		tagline: 'The most cunning man in Samhan — multilingual, lethal, and barely acquainted with his own commoners.',
		quote: "I am the goal. Everything else is scenery.",
		nature: 'The smartest and most wily: an opportunist who will say or become whatever the room requires, lethal when patient. Most steeped in Chinese letters, most international — he can meet Tang, Yamato, and Goryeo each in their own tongue, and sometimes still says Goguryeo because the chronicles taught him the older name. Also a sheltered ivory-tower elite: almost no opinion of commoners, almost no contact with them; Daeya’s resentment of the capital blindsides him completely. Reads international patterns decades ahead; packed with life-skills — geomancy, arms, charm. Best-looking of the leads, and the most social.',
		arc: 'Born a royal barred from the throne by Bone Rank, Chunchu becomes the cleverest man in rooms he is not allowed to rule — steeped in Chinese letters, fluent in every tongue the peninsula and its neighbours speak, able to forecast an alliance’s betrayal a generation out. He is also sheltered: he does not know what Surabol looks like from Daeya until it kills his daughter. Gotaso’s death turns wit into patience. He kneels in Pyongyang, sails to Yamato, wins Chang’an, founds the Royal Secretariat, and dies the first True Bone king — Baekje gone, Goryeo standing, the Tang already inside the door he opened.',
		blade: 'Ring-pommel court sword — imugi coiled on the grip; drawn rarely, remembered always.',
		stages: [
			{
				until: 654,
				name: 'Kim Chunchu',
				title: 'Prince of Silla'
			},
			{
				from: 654,
				name: 'King Muyeol',
				title: 'King Muyeol, 29th of Silla'
			}
		],
		events: [
			{ year: 632, label: 'Passed over for the throne; Dukman is crowned Queen Sunduk.' },
			{ year: 642, label: 'His daughter Gotaso dies at Daeya Fortress. He swears revenge.' },
			{ year: 642, label: 'Goes to Goryeo for troops; Yeon imprisons him, then lets him go.' },
			{ year: 647, label: 'Survives Bidam’s rebellion at Queen Sunduk’s side.' },
			{ year: 647, label: 'Sails to Yamato to ask for troops. Refused.' },
			{ year: 648, label: 'Wins the Silla–Tang alliance from Emperor Taizong.' },
			{ year: 651, label: 'Founds the Royal Secretariat, ruling around the Harmony Council.' },
			{ year: 654, label: 'Crowned King Muyeol — the first True Bone king.' },
			{ year: 660, label: 'Sabi falls. He makes Euija pour his wine.' },
			{ year: 661, label: 'Dies with the war unfinished.' }
		],
		sobriquets: ['the most cunning man in Samhan'],
		aliases: [
			'Prince Chunchu',
			'King Muyeol',
			'Kim Chunchu',
			'Muyeol',
			'Chunchu',
			'the most cunning man in Samhan'
		]
	},
	{
		id: 'gesomun',
		avatar: '/people/yeon_gesomun.png',
		name: 'Yeon Gesomun',
		korean: '연개소문',
		hanja: '淵蓋蘇文',
		title: 'Supreme Commander of Goguryeo',
		kingdom: 'goguryeo',
		born: 605,
		died: 665,
		bornApprox: true,
		main: true,
		tagline: 'The Eternal General — a patriot of the 겨레 who butchered a court to save a kingdom, and left it nothing that could outlive him.',
		quote: "No one is coming to save the 겨레. So I will.",
		nature: 'The simplest and most passionate of the three: a true patriot of the common people who despises elites, committees, and tribute paid for another decade of quiet. He speaks often of 겨레 — the folk, the kin-nation — and builds loyalty by heat rather than by book. Everyone else says Goryeo; he alone insists on Goguryeo, the old full name, as if shortening it were already surrender. Implied blood of Yeon Tabal’s hall: same blunt register, same refusal to be bought by a Go king’s courtesy. Tries to import Tang Taoism to starve the Buddhist monk aristocracy of prestige — a policy that fails to prevent a monk from opening Pyongyang. Charisma of the populist strongman — both the shelter he gives the marches and the massacre he calls rescue.',
		arc: 'A commander of the Eastern march who despises the capital: its tribute, its committees, its willingness to buy another decade with gold. The Yeon–Go rivalry that began when Tabal weighed an exile ends here as Yeon steel over a Go crown. In 642 he answers the court’s plan to kill him by killing all of it — the king, the commanders, hundreds of officials — and rules through a puppet on the throne. For twenty years he is proved right: he breaks Tang army after Tang army, and Taizong dies having failed against him. Once Kangrim almost collects him; Yeon walks away on will alone. But he builds nothing that can outlive him. He leaves three sons and no institution, and within a year of his death they are at each other’s throats and the eldest is guiding the Tang army to Pyongyang.',
		blade: 'The Five Blades — five ring-pommels taken from the commanders, each stamped with a three-legged crow.',
		events: [
			{ year: 634, label: 'Defies the High Summit at Pyongyang; the court marks him a traitor.' },
			{ year: 642, label: 'Massacres the court, kills King Yeongnyu, enthrones Bojang.' },
			{ year: 642, label: 'Imprisons Kim Chunchu, then releases him at Kim Yushin’s name.' },
			{ year: 645, label: 'Survives Taizong’s invasion; Ansi Fortress holds.' },
			{ year: 662, label: 'Destroys Pang Xiaotai’s army at the Snake River.' },
			{ year: 665, label: 'Dies in his sleep, telling his sons not to fight each other.' }
		],
		sobriquets: [
			'the Eternal General',
			'Red Sun of Pyongyang',
			'only real man left in Samhan'
		],
		aliases: [
			'Yeon Gesomun',
			'Commander Yeon',
			'Gesomun',
			'Yeon',
			'the Eternal General',
			'Eternal General',
			'Red Sun of Pyongyang'
		]
	},
	{
		id: 'yeonwife',
		name: "Yeon's Wife",
		korean: '연씨부인',
		gender: 'f',
		kingdom: 'goguryeo',
		tagline: 'Mother of Namseng, Namgun, and Namsan — the private ear Yeon still answers to after the knives.',
		quote: "Ask what the outside will call us — before the banquet cools.",
		arc: 'The histories leave her unnamed, which is how most wives of strongmen are written. She bears the three sons who will tear the kingdom after him, keeps the Yeon hall when the banquet hall is still wet, and asks the one question the Supreme Commander cannot answer with a sword: what the outside world will call them.',
		binyeo: 'Plain bronze crow-pin — march metal, not capital gold.',
		events: [
			{ year: 642, label: 'After the massacre, asks Yeon what foreign courts will say — and receives his answer.' }
		],
		aliases: ["Yeon's Wife", "Yeon’s wife", '연씨부인']
	},
	{
		id: 'gulgul',
		name: 'Gulgul',
		korean: '걸걸',
		hanja: '乞乞',
		title: 'Warden of the northern border',
		kingdom: 'goguryeo',
		tagline: 'A Mohe boy Yeon pulled from the snow — and later, Dae Joyoung’s father.',
		quote: "Loyalty needs no invitation.",
		arc: 'Yeon finds him young on a northern raid and brings him to Pyongyang. He is raised in the commander’s shadow, then sent back to the cold marches he came from. When Pyongyang falls he carries a broken piece of the crown into the Manchurian fields — and teaches his son the words Yeon would not let die.',
		blade: 'Border sabre — plain ring pommel, notch from a Liao winter.',
		events: [
			{ label: 'Taken in by Yeon as a boy.' },
			{ label: 'Posted to the northern border.' },
			{ year: 668, label: 'Flees north with a shard of the Goryeo crown.' },
			{ year: 698, label: 'His son founds Balhae on that shard’s memory.' }
		],
		aliases: ['Gulgul', 'Geolgeol']
	},
	{
		id: 'daejoyoung',
		name: 'Dae Joyoung',
		korean: '대조영',
		hanja: '大祚榮',
		title: 'Founder of Balhae',
		kingdom: 'goguryeo',
		tagline: 'The boy who repeated what the fields would not forget.',
		quote: "A crown in shards is still a crown.",
		arc: 'Son of Gulgul. Runs through Manchurian millet with a crown-shard against his ribs and a sentence in his mouth that outlives every wall.',
		events: [
			{ year: 668, label: 'Flees the fall with his father and a piece of the crown.' },
			{ year: 698, label: 'Founds Balhae — Goryeo’s afterlife under another name.' }
		],
		aliases: ['Dae Joyoung', 'Dae Jo-yeong', 'Joyoung', '대조영']
	},
	{
		id: 'euija',
		avatar: '/people/buyeo_euija.png',
		name: 'King Euija',
		korean: '부여의자',
		hanja: '扶餘義慈',
		title: 'King Euija, 31st Eraha of Baekje',
		kingdom: 'baekje',
		born: 600,
		died: 660,
		bornApprox: true,
		main: true,
		stages: [
			{
				until: 641,
				name: 'Buyeo Euija',
				title: 'Crown Prince of Baekje'
			},
			{
				from: 641,
				name: 'King Euija',
				title: 'King Euija, 31st Eraha of Baekje'
			}
		],
		tagline: 'Realpolitik in a crown — cynical, calculating, and soft only for the boy he named.',
		quote: "Find what they fear. Weave it into a story.",
		nature: 'Palace-bred realpolitik: cynical, calculating, and liberal with appetite — a prince who learned early that people are clay shaped by their rooms. He disdains the common folk for how easily a story moves them, and insists they need both a narrative and a leader. His soft spot is Gyebek — whom he sees as unstained by politics, a victim of environment rather than a player — and he teaches Gyebek and Gesomun the dirty grammar of courts throughout their alliances. Most calculating of the three kings; closest in method to classic realpolitik, and the most openly sensual of the leads. Baekje’s eastward manners sit easy on him — the polished court that taught the islands how to look at a king.',
		arc: 'Palace-raised into cynicism, Euija learns early that a kingdom is a story its people agree on — and that commoners will follow whoever narrates their fear. He is the most calculating of the age: he teaches Gyebek and Gesomun how courts actually work, keeps a soft spot for Gyebek as the one man unstained by the game, and indulges appetite the way only a prince who never had to wait can. He takes Daeya, humiliates Silla, purges the Great Clans, seats his own sons — then the story eats him. With no rivals left he seals the palace, exiles the truth-teller, starves the other, and dies in Chang’an screaming Chunchu’s name.',
		blade: 'Ring-pommel tiger sword — gold tiger on the pommel; worn for ceremony more than blood.',
		events: [
			{ year: 632, label: 'Crown prince; slips out of the palace and names a nameless boy Gyebek.' },
			{ year: 641, label: 'King Mu dies. Euija takes the throne vowing to finish his war.' },
			{ year: 642, label: 'Takes Daeya Fortress, killing Chunchu’s daughter.' },
			{ year: 642, label: 'Goes in disguise to Goryeo to bargain with Yeon Gesomun.' },
			{ year: 655, label: 'Purges the Ministers’ Assembly, seating 41 of his own sons.' },
			{ year: 656, label: 'Imprisons Seongchung, who starves to death warning him.' },
			{ year: 659, label: 'The nine omens. He jumps the White River and shouts for Gyebek.' },
			{ year: 660, label: 'Sabi falls; he is captured at Bear Fortress and shipped to Tang.' },
			{ year: 660, label: 'Dies in Chang’an.' }
		],
		sobriquets: ['Righteous and Merciful', 'Thirty-first Eraha'],
		aliases: [
			'King Euija',
			'Prince Euija',
			'Buyeo Euija',
			'Euija',
			'Thirty-first Eraha',
			'31st Eraha'
		]
	},

	// ————————————————————————— Silla —————————————————————————
	{
		id: 'yushin',
		avatar: '/people/kim_yushin.png',
		name: 'Kim Yushin',
		korean: '김유신',
		hanja: '金庾信',
		title: 'Marshal of Silla',
		kingdom: 'silla',
		born: 595,
		died: 673,
		tagline: 'Sword of the Divine Country — Gaya’s last son, Silla’s marshal, Dukman’s quiet devotion.',
		quote: "Love is strategy that does not ask to be thanked.",
		nature: 'The patriotism paradox: a man of the periphery — Gaya’s last princely blood — who becomes Silla’s most loyal sword, the model old-stock soldier and general. Stoic, still human; the older brother everyone wants. Deeply romantic, and in love with Dukman in a way he never makes cheap. Lifelong sparring brother to Bidam at 108–108 — the confrontation at Radiance hurts because the score was always even, and the blood never was. Hwarang to the bone: elite-trained, beautiful in the way the order demands, with forms the yard still names after him.',
		arc: 'Grandson of the prince who surrendered Golden Gaya, Yushin is True Bone by grant — forever the man from the edge who out-loves the centre. Bidam names him foreigner at Radiance; the cavern lake answers with his father and grandfather’s ghosts, who remind him that loyalty and love are the only soil that counts. He becomes the model soldier of old stock: stoic, human, the older brother the kingdom wants — and he loves Queen Dukman with a romantic constancy he never performs for the court. Marshal and head of the Hwarang, he trains Chunchu’s son Bupmin in the Five Principles after Daeya; conqueror of forty fortresses, the name that opens Yeon’s prison door; he marries his sister to Chunchu, holds Sunduk as she dies, faces Gyebek at the Yellow Mountain, and outlives almost everyone he swore himself to.',
		blade: 'Ring-pommel dragon sword — coiled dragon on the pommel, Silla blue in the fuller.',
		events: [
			{ year: 632, label: 'Pledges himself to Queen Sunduk “until the end.”' },
			{ year: 642, label: 'Marches on Baekje to avenge Daeya.' },
			{ year: 643, label: 'Trains Bupmin among the Hwarang — marshal of the flower youth.' },
			{ year: 647, label: 'Puts down Bidam’s rebellion; holds Sunduk as she dies.' },
			{ year: 660, label: 'Faces Gyebek at the Yellow Mountain Fields.' },
			{ year: 673, label: 'Dies, the war against Tang still unwon.' }
		],
		sobriquets: [
			'Greatest Blade of Samhan',
			'Sword of the Divine Country',
			'Last Son of Gaya'
		],
		aliases: [
			'Marshal Yushin',
			'Kim Yushin',
			'Yushin',
			'Sword of the Divine Country',
			'Last Son of Gaya'
		]
	},
	{
		id: 'sunduk',
		avatar: '/people/dukman.png',
		name: 'Queen Sunduk',
		korean: '선덕여왕',
		hanja: '善德女王',
		title: '27th sovereign of Silla',
		kingdom: 'silla',
		born: 595,
		died: 647,
		bornApprox: true,
		tagline: 'The first queen — kindness and virtue, ruling a kingdom that doubted both.',
		quote: "Kindness is not weakness. It is the harder blade.",
		nature: 'Queen who reads people the way others read stars. Soft power as the harder blade; holds Yushin’s devotion without making a spectacle of it. Their bond is romantic and physical in the refined register of the chronicle — never crude, never cold. The crown she wears is not only gold: it is the right to speak for the heavenly horse.',
		arc: 'Chosen because the Sacred Bone line had run out of men, Dukman rules for fifteen years under a permanent question mark: whether a woman can govern at all. She answers it by outlasting it, and dies in the middle of a rebellion raised on exactly that slogan.',
		binyeo: 'Silver moon binyeo — slender, unostentatious, sharp as kindness.',
		stages: [
			{
				until: 632,
				name: 'Princess Dukman',
				korean: '덕만공주',
				title: 'Sacred Bone princess of Silla'
			},
			{
				from: 632,
				name: 'Queen Sunduk',
				korean: '선덕여왕',
				title: '27th sovereign of Silla'
			}
		],
		events: [
			{ year: 632, label: 'Crowned the first Queen of Silla.' },
			{ year: 642, label: 'Loses Daeya; sends Chunchu abroad for help.' },
			{ year: 647, label: 'Dies as Bidam besieges the capital.' }
		],
		aliases: ['Queen Sunduk', 'Princess Dukman', 'Sunduk', 'Dukman']
	},
	{
		id: 'jinduk',
		avatar: '/people/seungman.png',
		name: 'Queen Jinduk',
		korean: '진덕여왕',
		title: '28th sovereign of Silla',
		kingdom: 'silla',
		born: 600,
		died: 654,
		bornApprox: true,
		tagline: 'The last Sacred Bone — Chunchu’s aunt on the throne, and a crown that no longer rules.',
		quote: "The bloodline ends with me. The country does not.",
		nature: 'Sunduk’s cousin; Chunchu’s aunt in the way the house counts kin. She wears the crown; he wears the hours. A kind woman who knows she is a bridge, not a destination — and who lets the bridge do its work without making a speech about it.',
		arc: 'Crowned after Bidam and Sunduk die in the same season. For seven years the Harmony Council still meets, and nothing of consequence leaves the room until Chunchu’s Secretariat has already sealed it. When she dies the Sacred Bone ends; the country continues under the nephew who had already been running it.',
		binyeo: 'Jade lotus binyeo — Sacred Bone quiet, no need to shout.',
		stages: [
			{
				until: 647,
				name: 'Princess Seungman',
				korean: '승만공주',
				title: 'Sacred Bone princess of Silla'
			},
			{
				from: 647,
				name: 'Queen Jinduk',
				korean: '진덕여왕',
				title: '28th sovereign of Silla'
			}
		],
		events: [
			{ year: 647, label: 'Crowned after Sunduk’s death.' },
			{ year: 651, label: 'Watches the Royal Secretariat make the Council ornamental.' },
			{ year: 654, label: 'Dies; the Sacred Bone line is extinct.' }
		],
		aliases: ['Queen Jinduk', 'Princess Seungman', 'Kim Seungman', 'Jinduk', 'Seungman']
	},
	{
		id: 'munhee',
		avatar: '/people/munhee.png',
		name: 'Munhee',
		korean: '문희',
		title: 'Queen Munmyung',
		kingdom: 'silla',
		born: 610,
		died: 681,
		bornApprox: true,
		tagline: 'Beginning and end — Yushin’s sister, Chunchu’s wife, mother of the king for all.',
		quote: "Sew the life you mean to keep.",
		nature: 'The household half of Chunchu’s politics: she packs the bags for every country he tries to save them with. Their marriage is affectionate and hungry in equal measure — tasteful, never coy about wanting. Related to almost every Silla name that matters — sister of the marshal, wife of the diplomat-king, mother of Munmu, aunt-by-marriage to a generation of True Bone. The story opens on her hair and closes on her watching a son wear a broken northern crown.',
		binyeo: 'Golden dragon binyeo — Yushin’s house in miniature, heavy enough to announce a noblewoman.',
		events: [
			{ year: 632, label: 'A young noblewoman with three small children — Bupmin among them.' },
			{ year: 641, label: 'Buys a dream; sews a coat; marries Chunchu.' },
			{ year: 642, label: 'Holds the house when Gotaso dies.' },
			{ year: 654, label: 'Becomes queen consort under Muyeol.' },
			{ year: 661, label: 'Pays the rest at Chunchu’s deathbed.' },
			{ year: 676, label: 'Lives to see her son crowned King of Samhan.' }
		],
		aliases: ['Queen Munmyung', 'Munhee']
	},
	{
		id: 'munmu',
		avatar: '/people/kim_bupmin.png',
		name: 'King Munmu',
		korean: '문무왕',
		hanja: '文武王',
		title: '30th sovereign of Silla',
		kingdom: 'silla',
		born: 626,
		died: 681,
		tagline: 'The audience’s eyes — a boy who wanted a king for all, and became one.',
		quote: "Build the country you needed at six.",
		nature: 'Unsung true main character: he does not bend the age the way Chunchu, Yeon, or Euija do, but he is the one the chronicle lets you stand beside — watching a sister die, watching a father invent a country, learning the war from the wrong end of the map, and finishing the sentence he stole as a child.',
		arc: 'As a boy Bupmin takes the words “a king for all” into his own mouth. He watches Gotaso not come home. Under Marshal Yushin he joins the Hwarang — horse, bow, the Five Principles — and learns to see the country through the flower youth’s loyalty before he ever wears a crown. He grows up in Chunchu’s shadow and Munhee’s packing lists. He inherits a half-won war and an alliance that wants the peninsula as furniture. He commands, waits, and finally expels the Tang — the road his father cleared as far as Baekje, walked to the end of Samhan on his own feet.',
		blade: 'Ring-pommel sea-dragon sword — forged for a king who asked to become a dragon in the strait.',
		stages: [
			{
				until: 661,
				name: 'Bupmin',
				korean: '법민',
				title: 'Prince of Silla',
				avatar: '/people/kim_bupmin.png'
			},
			{
				from: 661,
				name: 'King Munmu',
				korean: '문무왕',
				title: '30th sovereign of Silla',
				avatar: '/people/kim_bupmin.png'
			}
		],
		events: [
			{ year: 632, label: 'At six, claims the dream of a king for all.' },
			{ year: 642, label: 'Watches the house break when Gotaso dies.' },
			{ year: 643, label: 'Trains as Hwarang under Marshal Yushin.' },
			{ year: 661, label: 'Takes the throne, vowing to unify Samhan.' },
			{ year: 668, label: 'Pyongyang falls; Goguryeo ends.' },
			{ year: 676, label: 'Expels the Tang; becomes King of Samhan.' }
		],
		sobriquets: ['King for All', 'Dragon of the East Sea'],
		aliases: ['King Munmu', 'Bupmin', 'Munmu', 'Dragon of the East Sea']
	},
	{
		id: 'jukji',
		name: 'Kim Jukji',
		korean: '김죽지',
		hanja: '金竹旨',
		title: 'First Chancellor (侍中) of the Royal Secretariat',
		kingdom: 'silla',
		born: 620,
		bornApprox: true,
		tagline: 'True Bone, young Hwarang, Chunchu’s confidante — the first 시중.',
		quote: 'The Council still meets. The seals no longer wait for it.',
		nature: 'Young enough to think a new office is elegant; old enough in the yard to know elegance is a weapon. Loyal to Chunchu the way a Hwarang is loyal to a form — precisely, without needing to be asked twice.',
		blade: 'Ring-pommel bamboo sword — light, fast, named for the virtue of bending without breaking.',
		events: [
			{ year: 651, label: 'Named first 시중 of the Royal Secretariat.' },
			{ year: 654, label: 'Keeps the seals moving under King Muyeol.' }
		],
		aliases: ['Kim Jukji', 'Jukji', '죽지', 'Chancellor Jukji', '侍中']
	},
	{
		id: 'haesang',
		name: 'Haesang',
		korean: '해상',
		title: 'Silla merchant of the southern roads',
		kingdom: 'silla',
		tagline: 'Brings the horizon home — spices, scriptures, and stories told without swagger.',
		quote: 'I sell what the road allows. I tell what the road taught me.',
		nature: 'A recurring face in Surabol markets and harbour inns: respectful of every shore he names — Funan’s harbours, the Ganges ports, Sogdian caravans, Persian glass. Never a lecture; always a tale with the salt still on it. Ordinary people like him. Nobles pretend they do not listen, and listen.',
		events: [
			{ label: 'Trades through Danghang toward the southern seas.' },
			{ label: 'Carries news of India, the steppe roads, and the western markets — carefully, as guest.' }
		],
		aliases: ['Haesang', 'the merchant', 'Merchant Haesang', '해상']
	},
	{
		id: 'bidam',
		avatar: '/people/bidam.png',
		name: 'Bidam',
		korean: '비담',
		title: 'High Councillor of Silla',
		kingdom: 'silla',
		born: 605,
		died: 647,
		bornApprox: true,
		tagline: 'The Second Blade of Samhan — Legend of the Hwarang, still tied 108–108 with Yushin.',
		quote: "Sacred blood is not a petition — it is a claim.",
		nature: 'Born to one of Surabol’s oldest houses; Yushin’s foil and brother-in-arms from the Hwarang yard, where their duel count never leaves 108–108. Begins as the young liberal who stands for Dukman against a unanimous room’s misogyny; hardens into a conservative, then a radical revolutionary nativist — opposing Chunchu’s centralising Secretariat and any cosying up to Tang. Loves the sacred country and increasingly hates the people and outsiders he thinks are selling it. The quarrel with Yushin is intimate because it is ancient: first blood versus assimilated Gaya steel. Hwarang-perfect: educated, beautiful, lethal — and certain the sacred country owes him the last word.',
		arc: 'At thirteen he is the newest voice on the Harmony Council and the only one brave enough to force unanimity toward a clever woman. He and Kim Yushin spar to a lifelong draw — one hundred and eight apiece — old Surabol hall against Gaya grant-bone. Named High Councillor in 645, he alone vetoes Seungman as heir and opens a rift that will not close. By 647 he flies a burning kite over Radiance to claim heaven’s vote, then meets Yushin in the forms they learned as boys; Yushin destroys him, and the queen he once raised dies in the same season.',
		blade: 'Ring-pommel heavenly-horse sword — white horse rearing on the pommel, old-hall steel.',
		events: [
			{ year: 632, label: 'As a young Hwarang, stands for Dukman in the unanimous Council.' },
			{ year: 645, label: 'Named High Councillor; alone blocks Seungman as successor.' },
			{ year: 647, label: 'Rebels at the Fortress of Radiance; is destroyed by Yushin.' }
		],
		sobriquets: ['The Second Blade of Samhan', 'Legend of the Hwarang'],
		aliases: [
			'Councillor Bidam',
			'Bidam',
			'The Second Blade of Samhan',
			'Second Blade of Samhan',
			'Legend of the Hwarang'
		]
	},
	{
		id: 'gotaso',
		avatar: '/people/gotaso.png',
		name: 'Gotaso',
		korean: '고타소',
		kingdom: 'silla',
		born: 625,
		died: 642,
		bornApprox: true,
		tagline: 'A love-obsessed girl of sixteen. Her father would burn kingdoms to bring her home.',
		quote: "Forever is a promise you keep in one season.",
		arc: 'She falls the way teenagers fall — completely, loudly, without a second thought. When she is taken, Chunchu goes quiet. When she marries, she believes in forever. Daeya ends both.',
		events: [
			{ year: 641, label: 'Taken; rescued; marries Pumsuk; moves to Daeya.' },
			{ year: 642, label: 'Dies when Daeya falls.' }
		],
		aliases: ['Princess Gotaso', 'Gotaso']
	},
	{
		id: 'pumsuk',
		avatar: '/people/pumsuk.png',
		name: 'Kim Pumsuk',
		korean: '김품석',
		title: 'Guardian of Daeya Fortress',
		kingdom: 'silla',
		born: 618,
		died: 642,
		bornApprox: true,
		tagline: 'A Surabol noble boy — still startled by a woman who isn’t.',
		quote: "A fortress falls from the inside first.",
		arc: 'Capital-bred, True Bone, given a fortress for his rank. Gotaso loves him with her whole chest. At Daeya he meets Geomil’s wife and discovers how little of the world Surabol prepared him for.',
		events: [
			{ year: 641, label: 'Marries Gotaso, swearing to protect her with his life.' },
			{ year: 642, label: 'Loses Daeya after betrayal; kills his wife and himself.' }
		],
		aliases: ['Hwarang Pumsuk', 'Kim Pumsuk', 'Pumsuk']
	},
	{
		id: 'gumil',
		name: 'Geomil',
		korean: '검일',
		kingdom: 'silla',
		died: 660,
		tagline: 'The officer whose grudge opened the gates of Daeya.',
		quote: "A grudge is a key. Use it once.",
		arc: 'Humiliated by Pumsuk over his own wife, Geomil betrays Daeya to Baekje — the small private injury that costs Silla a fortress, costs Chunchu a daughter, and starts a war. Muyeol executes him at Sabi eighteen years later.',
		events: [
			{ year: 642, label: 'Betrays Daeya Fortress with Mochuk.' },
			{ year: 660, label: 'Executed by King Muyeol.' }
		],
		aliases: ['Geomil', 'Gumil']
	},
	{
		id: 'mochuk',
		name: 'Mochuk',
		korean: '모척',
		kingdom: 'silla',
		died: 660,
		tagline: 'Geomil’s fellow traitor at Daeya.',
		quote: "Treason is only treason if you lose.",
		aliases: ['Mochuk']
	},
	{
		id: 'inmun',
		name: 'Kim Inmun',
		korean: '김인문',
		kingdom: 'silla',
		born: 629,
		died: 694,
		tagline: 'Chunchu’s second son; Silla’s long-serving hostage-diplomat in Tang.',
		quote: "Become necessary, or become forgotten.",
		aliases: ['Kim Inmun', 'Inmun']
	},
	{
		id: 'alchun',
		name: 'Alchun',
		korean: '알천',
		kingdom: 'silla',
		born: 605,
		bornApprox: true,
		tagline: 'Hwarang, councillor, and the man who stood aside for Chunchu.',
		quote: "Yield the chair. Keep the country.",
		aliases: ['Alchun']
	},

	// ————————————————————————— supporting cast (researched) —————————————————————————
	{
		id: 'ladyye',
		name: 'Lady Ye',
		korean: '예씨부인',
		kingdom: 'goguryeo',
		tagline: 'Jumong’s first wife, who raised his heir alone in Buyeo.',
		quote: "A broken sword can still raise a king.",
		aliases: ['Lady Ye']
	},
	{
		id: 'yuri',
		name: 'King Yuri',
		korean: '유리왕',
		hanja: '琉璃王',
		kingdom: 'goguryeo',
		died: 18,
		tagline: 'Found the broken sword under the pine, and took his father’s throne.',
		quote: "What a father hides, a son digs up.",
		events: [{ year: -19, label: 'Succeeds Jumong; Onjo and Biryu go south.' }],
		aliases: ['King Yuri']
	},
	{
		id: 'gumilwife',
		avatar: '/people/gumil_wife.png',
		name: 'Geomil’s Wife',
		korean: '검일의 아내',
		kingdom: 'silla',
		tagline: 'A commoner woman at a border feast — and the spark that burns down three kingdoms.',
		quote: "Put the sound into my mouth — then listen.",
		arc: 'She has no name in the histories and no rank worth recording, which is precisely the point. A drunk True Bone takes her because he can; her husband opens the gates of Daeya in return. Everything that follows — Gotaso’s death, Chunchu’s revenge, the Tang alliance, the fall of Baekje and Goryeo — runs back through a woman the system did not consider a person.',
		binyeo: 'Wooden nine-tailed-fox binyeo — cheap timber, carved clever; seduction without gold.',
		events: [{ year: 642, label: 'Taken by Pumsuk at the Daeya feast; her husband betrays the fortress.' }],
		aliases: ['Geomil’s wife', 'Gumil’s wife']
	},
	{
		id: 'queensatek',
		name: 'Queen Satek',
		korean: '사택왕후',
		kingdom: 'baekje',
		died: 655,
		tagline: 'Euija’s mother, and the Satek clan’s hold on the throne.',
		quote: "Mourning can still be a faction.",
		arc: 'While she lived, the most powerful clan in Baekje had the king’s ear through his own mother. Her death in 655 releases Euija — and begins the purge that hollows out his court.',
		events: [{ year: 655, label: 'Dies; Euija enters mourning, and the Satek fear what comes after.' }],
		aliases: ['Queen Satek']
	},
	{
		id: 'eldersatek',
		avatar: '/people/satek_elder.png',
		name: 'Elder Satek',
		korean: '사택 원로',
		kingdom: 'baekje',
		tagline: 'The clan’s memory, and its instinct for survival.',
		quote: "Clan memory outlives kings.",
		aliases: ['Elder Satek']
	},
	{
		id: 'elderyunbi',
		avatar: '/people/yunbi_elder.png',
		name: 'Elder Yunbi',
		korean: '연비 원로',
		kingdom: 'baekje',
		gender: 'm',
		tagline: 'Four hundred years in, and still called a guest by the wrong houses.',
		quote: 'We do not hold the sleeve. We hold the arm.',
		aliases: ['Elder Yunbi', 'Yunbi', 'the Yunbi']
	},
	{
		id: 'ministersatek',
		name: 'Minister Satek',
		korean: '사택 재상',
		kingdom: 'baekje',
		tagline: 'Prime Minister by clan right, not by merit.',
		quote: "Hold the seal. Let the seal hold you.",
		aliases: ['Minister Satek']
	},
	{
		id: 'sosuno',
		avatar: '/people/sosuno.png',
		gender: 'f',
		name: 'Sosuno',
		korean: '소서노',
		kingdom: 'baekje',
		tagline: 'Founded one kingdom with her husband, then walked south and founded another with her sons.',
		quote: "The bow wins the night. The road wins the rest.",
		nature: 'Love first, alliance second — hunger that founds kingdoms. With Jumong, desire is spoken in glances and grain porches, never as thesis.',
		arc: 'Daughter of Yeon Tabal; she falls for Jumong before the alliance is spoken, and her father’s suspicion breaks on an archery contest. She gives Jumong the tribes that make Goryeo. When his first son arrives from Buyeo and takes the succession, she does not fight for it — she takes Onjo and Biryu south and builds Baekje instead.',
		binyeo: 'Amber river binyeo — Tabal wealth worn as warmth, not display.',
		events: [
			{ year: -37, label: 'Helps Jumong found Goryeo at Jolbon.' },
			{ year: -18, label: 'Leads her sons south; Baekje is founded.' }
		],
		aliases: ['Sosuno']
	},
	{
		id: 'yuhwa',
		avatar: '/people/yuhwa.png',
		name: 'Lady Yuhwa',
		korean: '유화부인',
		kingdom: 'goguryeo',
		tagline: 'A river god’s daughter, cast out for loving the sun.',
		quote: "Heaven left. I keep what it left in me.",
		binyeo: 'River-pearl binyeo — cool to the touch, never quite dry.',
		aliases: ['Lady Yuhwa', 'Yuhwa']
	},
	{
		id: 'geumwa',
		name: 'King Geumwa',
		korean: '금와왕',
		kingdom: 'other',
		tagline: 'Took in the exiled Yuhwa, and raised the boy who would outgrow his kingdom.',
		quote: "Shelter what heaven abandons.",
		aliases: ['King Geumwa', 'Geumwa']
	},
	{
		id: 'daeso',
		name: 'Daeso',
		korean: '대소',
		kingdom: 'other',
		died: 22,
		tagline: 'Geumwa’s son, who could not bear being outshot by a foundling.',
		quote: "Never be outshot by a foundling.",
		aliases: ['Daeso']
	},
	{
		id: 'yomyo',
		name: 'Yomyo',
		korean: '요묘',
		kingdom: 'goguryeo',
		tagline: 'The general who opened Pyongyang’s gates alongside the monk Shinsung.',
		quote: "Open what others lock.",
		events: [{ year: 668, label: 'Opens the fortress gates to the Tang.' }],
		aliases: ['Yomyo']
	},
	{
		id: 'herald',
		name: 'The Herald',
		korean: '전령',
		kingdom: 'other',
		tagline: 'Whoever has to carry the news, and say it out loud.',
		quote: "Someone must say it out loud.",
		arc: 'Not one person but a role — the rider who reaches Surabol with Daeya’s fall, the man who bursts into Yeon’s quarters, the voice that must tell a king what he does not want to hear.',
		aliases: ['The Herald']
	},
	{
		id: 'goguard_a',
		name: 'Gate Guard',
		korean: '문지기',
		kingdom: 'goguryeo',
		tagline: 'One of the two men outside Yeon’s door — comedy until the blood.',
		quote: "Funny until it isn’t — then stand.",
		aliases: ['Gate Guard', 'Goguryeo guard']
	},
	{
		id: 'goguard_b',
		name: 'Junior Guard',
		korean: '병졸',
		kingdom: 'goguryeo',
		tagline: 'The other man outside the door. Easily surprised.',
		quote: "Be surprised once. Learn forever.",
		aliases: ['Junior Guard']
	},
	{
		id: 'narim',
		avatar: '/people/narim.png',
		name: 'Narim',
		korean: '나림',
		hanja: '奈林',
		kingdom: 'silla',
		entity: 'concept',
		gender: 'f',
		tagline: 'The eldest of the three — forest patience, dry counsel, and the hunger she usually hides.',
		quote: 'Counsel first. Hunger second — usually.',
		arc: 'Yushin’s steam-cavern comfort is not a shrine; it is three playful, slightly dangerous water-women who already know when he will arrive undressed. Narim is the mature sister: she lets Golhwa tease, steadies Hyullé, and still delivers the advice he actually came for — then, once, sends the younger two away and tries to keep him with her mouth instead of counsel, until they catch her at it.',
		aliases: ['Narim', '나림', 'Forest Goddess']
	},
	{
		id: 'hyulle',
		avatar: '/people/hyulle.png',
		name: 'Hyullé',
		korean: '휠레',
		hanja: '穴禮',
		kingdom: 'silla',
		entity: 'concept',
		gender: 'f',
		tagline: 'Quiet at the water’s edge — and secretly the one who loves him most.',
		quote: 'Love quietly. Stay longest.',
		arc: 'She speaks least. When she does, it is almost apology. Of the three she is the shy one — which is why Yushin misses that she watches him longest after the others look away, and why catching Narim with him hurts more than Golhwa’s loud jealousy: steam was supposed to be shared.',
		aliases: ['Hyullé', 'Hyulle', 'Hyeolrye', '휠레', '혈례', 'Cavern Goddess']
	},
	{
		id: 'golhwa',
		avatar: '/people/golhwa.png',
		name: 'Golhwa',
		korean: '골화',
		hanja: '骨火',
		kingdom: 'silla',
		entity: 'concept',
		gender: 'f',
		tagline: 'Youngest — heat first, counsel second, never sorry for either.',
		quote: 'Heat first. Counsel sharp. Never sorry.',
		arc: 'She is the forward one: she names the queen to watch him flinch, mocks “Her Majesty” at a naked lake, and asks him to stay as if the war could wait. Under the mockery the counsel is sharp. She wants him in the water with them — and hates most when Narim eats first. She also wants him alive.',
		aliases: ['Golhwa', '골화', 'Fire Goddess']
	},
	{
		id: 'jukjuk',
		name: 'Jukjuk',
		korean: '죽죽',
		hanja: '竹竹',
		kingdom: 'silla',
		died: 642,
		tagline: 'Named “bamboo” by his father — break, never bend.',
		quote: 'Break. Never bend.',
		arc: 'A local officer of Daeya, sahji rank. When Pumsuk chose surrender, Jukjuk refused: his father had named him after bamboo so that he would wither in the cold before bending. He held the ruined fortress with Yongseok and died fighting.',
		events: [{ year: 642, label: 'Dies defending Daeya after Pumsuk’s surrender.' }],
		aliases: ['Jukjuk']
	},
	{
		id: 'yunchung',
		name: 'Yunchung',
		korean: '윤충',
		hanja: '允忠',
		kingdom: 'baekje',
		tagline: 'The general Euija trusted with ten thousand men and Daeya.',
		quote: "Plain speech is also a weapon.",
		events: [{ year: 642, label: 'Takes Daeya Fortress with 10,000 troops.' }],
		aliases: ['Yunchung']
	},
	{
		id: 'gwanchang',
		name: 'Gwanchang',
		korean: '관창',
		hanja: '官昌',
		kingdom: 'silla',
		born: 645,
		died: 660,
		tagline: 'Sixteen at the Yellow Mountain — released once, and rode back.',
		quote: "Youth is not an excuse. It is a deadline.",
		arc: 'Son of general Kim Pumil. Captured charging the Baekje line alone, Gyebek unstrapped his helmet, marvelled at his age, and sent him home. He rode straight back. The second time, Gyebek sent back only his head — and the sight of it broke Silla’s hesitation.',
		events: [{ year: 660, label: 'Dies at Hwangsanbeol; the army charges in his name.' }],
		aliases: ['Gwanchang']
	},
	{
		id: 'banggul',
		name: 'Banggul',
		korean: '반굴',
		kingdom: 'silla',
		died: 660,
		tagline: 'Yushin’s nephew, first to ride alone into the Baekje line.',
		quote: "Ride first. Someone has to.",
		events: [{ year: 660, label: 'Dies at Hwangsanbeol before Gwanchang.' }],
		aliases: ['Bangul', 'Banggul']
	},
	{
		id: 'chunbok',
		name: 'Satek Chunbok',
		korean: '사택천복',
		kingdom: 'baekje',
		tagline: 'The young Satek who chose the king over his clan.',
		quote: "Say one name. Bring him back.",
		aliases: ['Satek Chunbok', 'Chunbok']
	},
	{
		id: 'heungsu',
		name: 'Heungsu',
		korean: '흥수',
		hanja: '興首',
		kingdom: 'baekje',
		tagline: 'The exiled loyalist whose last advice arrived too late.',
		quote: "Warning a king is a temporary posting.",
		arc: 'One of the three loyalists with Seongchung and Gyebek. Exiled, he sent the same counsel Seongchung had died giving — hold the Baek river and the Tanhyeon pass — and the court debated it until both had already been crossed.',
		events: [{ year: 660, label: 'His warning is ignored; Sabi falls.' }],
		aliases: ['Heungsu']
	},
	{
		id: 'dochim',
		name: 'Dochim',
		korean: '도침',
		hanja: '道琛',
		kingdom: 'baekje',
		died: 661,
		tagline: 'The warrior-monk who raised the restoration at Juryu Fortress.',
		quote: "Restore first. Argue later.",
		events: [{ year: 660, label: 'Rises with Boksin to restore Baekje.' },
			{ year: 661, label: 'Killed by Boksin in the movement’s first fracture.' }],
		aliases: ['Dochim']
	},
	{
		id: 'sangji',
		name: 'Heukchi Sangji',
		korean: '흑치상지',
		hanja: '黑齒常之',
		kingdom: 'baekje',
		born: 630,
		died: 689,
		tagline: 'Held Imjon Fortress for the restoration — then became a Tang general.',
		quote: "Black-tooth loyalty cuts both ways.",
		arc: 'Rallied thirty thousand refugees at Imjon within ten days of Sabi’s fall. When the restoration ate itself he surrendered to the Tang, and spent the rest of his life winning their wars on the steppe — until a slander he did not survive.',
		events: [
			{ year: 660, label: 'Raises Imjon Fortress against the occupation.' },
			{ year: 663, label: 'Defects to Tang as the restoration collapses.' },
			{ year: 689, label: 'Dies imprisoned on a false charge in Luoyang.' }
		],
		aliases: ['Hukchi Sangji', 'Heukchi Sangji']
	},
	{
		id: 'sadaham',
		name: 'Sadaham',
		korean: '사다함',
		hanja: '斯多含',
		kingdom: 'silla',
		born: 547,
		died: 564,
		tagline: 'God of the Hwarang — conqueror of Gaya at fifteen, dead of grief at seventeen.',
		quote: "A Hwarang’s future is shorter than his song.",
		events: [
			{ year: 562, label: 'Leads the vanguard that takes Daegaya.' },
			{ year: 564, label: 'Dies mourning his sworn friend Mugwanrang.' }
		],
		sobriquets: ['God of the Hwarang'],
		aliases: ['Sadaham', 'God of the Hwarang']
	},
	{
		id: 'weizheng',
		name: 'The Imperial Minister',
		korean: '위징',
		hanja: '魏徵',
		kingdom: 'tang',
		born: 580,
		died: 643,
		tagline: 'The minister who told the emperor the truth two hundred times and lived.',
		quote: "When I am gone, there will be no one left to tell you no.",
		arc: 'The mirror the emperor said he lost when the minister died. His death in 643 removes the last voice against the Goguryeo war.',
		events: [{ year: 643, label: 'Dies; the emperor mourns his living mirror.' }],
		aliases: ['Wei Zheng', 'the imperial minister', 'The Imperial Minister', 'the minister']
	},
	{
		id: 'xueliu',
		name: 'Lady Liu',
		korean: '유씨',
		hanja: '柳氏',
		kingdom: 'tang',
		gender: 'f',
		tagline: 'Told a farmer the Son of Heaven was calling — and sent him to history.',
		quote: "Talent needs its hour. This is the hour.",
		arc: 'Xue Rengui’s wife. When he meant to rebury his ancestors in quiet poverty, she named the hour: Taizong wanted fierce generals for Liaodong. Without her sentence there is no white coat, no ji, no eastern command.',
		events: [{ year: 644, label: 'Urges Xue Rengui to answer the muster for Liaodong.' }],
		aliases: ['Lady Liu', '柳氏', '유씨']
	},
	{
		id: 'xuerengui',
		avatar: '/people/xue_rengui.png',
		name: 'Xue Rengui',
		korean: '설인귀',
		hanja: '薛仁貴',
		kingdom: 'tang',
		born: 614,
		died: 683,
		title: 'White Tiger II',
		tagline: 'Farmer, white armour, fangtian ji — Tang’s unsung eastern blade.',
		quote: "Keep a road under your feet — even in the east.",
		arc: 'Born poor at Longmen as Xue Li. His wife Liu sends him to Zhang Shigui’s muster when Taizong calls for Liaodong. At Stallion Mountain he wears white armour, wields the fangtian ji (the same heaven-halberd the storytellers give Lü Bu), and Taizong asks who the man in white is — then says gaining Xue matters more than gaining Liaodong. Captured once in the seventh invasion, he breaks a fortress cage before the Emperor arrives. Inherits the White Tiger title after Pang Xiaotai dies at the Snake River; as Protector-General of the East he takes Pyongyang in 668 and governs without spectacle. At Maeso in 675 he is Tang’s last great eastern commander — competent, sympathetic, and finally out of horses.',
		events: [
			{ year: 644, label: 'Answers Taizong’s muster at his wife’s urging.' },
			{ year: 645, label: 'White armour & fangtian ji at Stallion Mountain; noticed by Taizong.' },
			{ year: 645, label: 'Captured inland; escapes before the Emperor reaches the fortress.' },
			{ year: 662, label: 'Named White Tiger II after Pang Xiaotai’s death.' },
			{ year: 668, label: 'Enters Pyongyang; Protector-General of the East.' },
			{ year: 675, label: 'Eastern command broken at Maeso — loses the horses, and the road.' }
		],
		aliases: ['Xue Rengui', 'Xue Li', '薛禮', 'White Tiger II', '백호 2세', 'White Coat']
	},
	{
		id: 'sudingfang',
		avatar: '/people/red_dragon.png',
		name: 'Red Dragon',
		korean: '소정방',
		hanja: '蘇定方',
		title: 'The Red Dragon',
		kingdom: 'tang',
		born: 592,
		died: 667,
		tagline: 'The Red Dragon: took three kingdoms’ capitals in one career.',
		quote: "Three capitals. One career.",
		arc: 'Breaker of the Western Turks, commander of the 660 seaborne invasion that ended Baekje in a single season. He failed only at Pyongyang — mired in snow at the Sasu while Yeon destroyed the supporting army.',
		events: [
			{ year: 660, label: 'Lands 130,000 men at the Geum estuary; Sabi falls.' },
			{ year: 662, label: 'Winters outside Pyongyang, and withdraws.' }
		],
		aliases: ['Su Dingfang', 'Red Dragon', 'the Red Dragon', 'Red Fowl', 'the Red Fowl']
	},
	{
		id: 'lishiji',
		avatar: '/people/blue_dragon.png',
		name: 'Blue Dragon',
		korean: '이세적',
		hanja: '李世勣',
		title: 'The Blue Dragon',
		kingdom: 'tang',
		born: 594,
		died: 669,
		tagline: 'The Blue Dragon: the old marshal who finally took Pyongyang.',
		quote: "Siege is weather. Wait for the season.",
		events: [
			{ year: 645, label: 'Takes Liaodong Fortress under the emperor.' },
			{ year: 668, label: 'Commands the final campaign; Pyongyang falls.' }
		],
		aliases: ['Li Shiji', 'Li Ji', 'Blue Dragon', 'the Blue Dragon']
	},
	{
		id: 'liurengui',
		avatar: '/people/black_dragon.png',
		name: 'Black Dragon',
		korean: '유인궤',
		hanja: '劉仁軌',
		title: 'The Black Dragon',
		kingdom: 'tang',
		born: 601,
		died: 685,
		tagline: 'The Black Dragon: burned four hundred eastern ships at the White River.',
		quote: "Hold what the others break.",
		events: [{ year: 663, label: 'Wins the naval battle of Baekgang.' }],
		aliases: ['Liu Rengui', 'Black Dragon', 'the Black Dragon', 'Black Tortoise', 'the Black Tortoise']
	},
	{
		id: 'pangxiaotai',
		avatar: '/people/white_dragon.png',
		name: 'White Tiger',
		korean: '방효태',
		title: 'The White Tiger',
		kingdom: 'tang',
		died: 662,
		tagline: 'The White Tiger, drowned at the Snake River with his thirteen sons.',
		quote: "The first tiger dies loud. The second learns.",
		events: [{ year: 662, label: 'His army is annihilated by Yeon at the Sasu.' }],
		aliases: ['Pang Xiaotai', 'White Tiger', 'the White Tiger']
	},
	{
		id: 'saimei',
		name: 'The Eastern Empress',
		korean: '사이메이 천황',
		kingdom: 'yamato',
		gender: 'f',
		born: 594,
		died: 661,
		tagline: 'The empress who mobilised the East for Baekje — and died on the way.',
		quote: "The sea is also a border.",
		events: [
			{ year: 660, label: 'Orders the fleet raised to restore Baekje.' },
			{ year: 661, label: 'Dies at Asakura palace, en route to the war.' }
		],
		aliases: ['Empress Saimei', 'Saimei', 'the eastern empress', 'The Eastern Empress']
	},
	{
		id: 'tenji',
		name: 'The Eastern Prince',
		korean: '덴지 천황',
		kingdom: 'yamato',
		born: 626,
		died: 672,
		tagline: 'Sent forty thousand men to the White River and lost them.',
		quote: "Watch western fires. Steal only the heat you need.",
		events: [
			{ year: 661, label: 'Takes up his mother’s war for Baekje.' },
			{ year: 663, label: 'The fleet burns at Baekgang; the East turns inward.' }
		],
		aliases: ['Emperor Tenji', 'Naka-no-Ōe', 'Tenji', 'the eastern prince', 'The Eastern Prince']
	},
	{
		id: 'kuromaro',
		name: 'The Eastern Scholar',
		korean: '다카무코노 구로마로',
		kingdom: 'yamato',
		died: 654,
		tagline: 'Yamato’s scholar of the continent, Chunchu’s host in the East.',
		quote: "Guide a guest who will outgrow guidance.",
		aliases: ['Takamuko no Kuromaro', 'Kuromaro', 'the eastern scholar', 'The Eastern Scholar']
	},
	{
		id: 'takutsu',
		name: 'Echi no Takutsu',
		korean: '에치노 다쿠쓰',
		kingdom: 'yamato',
		died: 663,
		tagline: 'Died at the White River shouting Kudara’s name.',
		quote: "Loyalty does not ask whose map you die on.",
		events: [{ year: 663, label: 'Falls at Baekgang crying “Long live Kudara!”' }],
		aliases: ['Echi no Takutsu', 'Takutsu']
	},
	{
		id: 'yesikjin',
		name: 'Ye Sikjin',
		korean: '예식진',
		hanja: '禰寔進',
		kingdom: 'baekje',
		born: 615,
		died: 672,
		tagline: 'The guardian of Bear Fortress who handed his king to the Tang.',
		quote: "Serving is not the same as believing.",
		arc: 'His tomb epitaph, dug up in Luoyang in 2006, confirmed what the histories implied: the man sheltering Euija at Ungjin surrendered him. He died a Tang general.',
		events: [{ year: 660, label: 'Surrenders Euija at Bear Fortress.' }],
		aliases: ['Ye Sikjin']
	},
	{
		id: 'yeomjong',
		name: 'Yeomjong',
		korean: '염종',
		kingdom: 'silla',
		died: 647,
		tagline: 'Bidam’s fellow conspirator at the Fortress of Radiance.',
		quote: "Rebellion needs two names. Be the quieter one.",
		events: [{ year: 647, label: 'Rises with Bidam; dies with him.' }],
		aliases: ['Yumjong', 'Yeomjong', 'Yumjang']
	},
	{
		id: 'gusesa',
		avatar: '/people/commander_1.png',
		name: 'Yeon Gusesa',
		korean: '연구세사',
		kingdom: 'goguryeo',
		died: 642,
		tagline: 'Stone Haetae of Goryeo — Central Commander at the High Summit, Gesomun’s elder kinsman.',
		quote: "A Yeon name is already a warning.",
		nature: 'Chairs the Summit like a feast: soft voice, hard arithmetic. Treats his nephew’s alarms as youthful noise until the noise becomes a massacre.',
		events: [{ year: 642, label: 'Killed at Yeon’s banquet; his crow-stamped blade becomes one of the Five.' }],
		sobriquets: ['Stone Haetae of Goryeo'],
		aliases: ['Yeon Gusesa', 'Gusesa', 'Central Commander', 'Stone Haetae of Goryeo']
	},
	{
		id: 'leegaesa',
		name: 'Lee Gaesa',
		korean: '이가사',
		kingdom: 'goguryeo',
		died: 642,
		tagline: 'Summit mouthpiece who first branded Yeon a traitor — dies with that word unfinished.',
		quote: "Carry the message. Arrive anyway.",
		nature: 'Not a commandery banner, but the court’s knife-word: first to float traitor across the Summit table. Loyal to procedure until procedure cannot save him.',
		events: [{ year: 642, label: 'Killed at the banquet; Yeon takes his blade with the name he gave.' }],
		aliases: ['Lee Gaesa', 'Commander Lee']
	},
	{
		id: 'northcmd',
		avatar: '/people/commander_2.png',
		name: 'Go Ul',
		korean: '고울',
		title: 'Northern Commander',
		kingdom: 'goguryeo',
		died: 642,
		tagline: 'Wants horses for the Mohe frost — not poems about Samhan.',
		quote: "Stop counting remounts. Start counting winters.",
		nature: 'Blunt frontier arithmetic. Sexually confident in the soldier’s way — present, not performative — and allergic to southern romance when his villages are burning.',
		events: [{ year: 642, label: 'Killed at Yeon’s banquet; Northern crow-blade taken.' }],
		aliases: ['Go Ul', 'Northern Commander', 'the Northern Commander', '고울']
	},
	{
		id: 'southcmd',
		avatar: '/people/commander_3.png',
		name: 'Son Daeha',
		korean: '손대하',
		title: 'Southern Commander',
		kingdom: 'goguryeo',
		died: 642,
		tagline: 'Wants the next levy for Yushin’s passes — or stop talking Samhan.',
		quote: "Send the levy — or stop naming Samhan.",
		nature: 'Competitive, sharp-tongued, sure of his own front. Treats Eastern tribal fighting as easy work and never forgives a room that starves his border for a slogan.',
		events: [{ year: 642, label: 'Killed at Yeon’s banquet; Southern crow-blade taken.' }],
		aliases: ['Son Daeha', 'Southern Commander', 'the Southern Commander', '손대하']
	},
	{
		id: 'westcmd',
		avatar: '/people/commander_4.png',
		name: 'Go Heumsong',
		korean: '고흠송',
		title: 'Western Commander',
		kingdom: 'goguryeo',
		died: 642,
		tagline: 'Wants timber for the Liao — not a southern adventure.',
		quote: "Strip the west, and you gift the Tang a road.",
		nature: 'Cautious about the Second Emperor without sharing Yeon’s urgency. Wants resources, not prophecies — and will not strip the Liao for a king’s peninsula dream.',
		events: [{ year: 642, label: 'Killed at Yeon’s banquet; Western crow-blade taken.' }],
		aliases: ['Go Heumsong', 'Western Commander', 'the Western Commander', '고흠송']
	},
	{
		id: 'dosuryu',
		avatar: '/people/dosuryu.png',
		name: 'Dosuryu',
		korean: '도수류',
		kingdom: 'goguryeo',
		tagline: 'Old Yeon friend — Grand Herald after the massacre, one of the few Yeon still hears.',
		quote: "If you stop listening, I am only a herald.",
		arc: 'Survives by being useful and by being honest in a language Yeon still understands. After the massacre he becomes Grand Herald and stays close enough to say no. When Yeon stops listening, the title remains and the friendship does not.',
		nature: 'An old friend of the Yeon house from before Gesomun’s fame. Named Grand Herald after the 642 banquet — a post invented so the 겨레 can be addressed by a voice that is not the puppet throne. Offers advice the younger Yeon actually takes, sometimes; the court learns to fear his door as well as the commander’s.',
		aliases: ['Dosuryu']
	},
	{
		id: 'jungto',
		name: 'Yeon Jungto',
		korean: '연정토',
		kingdom: 'goguryeo',
		tagline: 'Gesomun’s brother, who took twelve cities over to Silla.',
		quote: "Keep the seal warm for the house.",
		events: [{ year: 666, label: 'Surrenders his southern territory to Silla.' }],
		aliases: ['Yeon Jungto', 'Jungto']
	},
	{
		id: 'shinsung',
		name: 'Shinsung',
		korean: '신성',
		kingdom: 'goguryeo',
		tagline: 'Buddhist aristocracy’s quiet knife — the monk who opened Pyongyang from within.',
		quote: "A gate opens from the inside.",
		arc: 'Yeon tried to import Tang Taoism partly to starve the monk houses of prestige. The houses waited. When the brothers tore the kingdom, Shinsung opened what no army had opened — and proved Yeon’s fear had been aimed at the right profession.',
		events: [
			{ label: 'Watches Yeon’s Taoist experiment cool the temple halls.' },
			{ year: 668, label: 'Lets the Tang army into the fortress.' }
		],
		aliases: ['Shinsung']
	},
	{
		id: 'yuridora',
		avatar: '/people/yuri_dora.png',
		name: 'Yuri Dora',
		korean: '유리도라',
		kingdom: 'tamla',
		tagline: 'King of the island of oranges, collector of stories and castaways.',
		quote: "Tell the story until the mainland listens.",
		aliases: ['Yuri Dora']
	},
	{
		id: 'jinpyung',
		name: 'King Jinpyung',
		korean: '진평왕',
		hanja: '眞平王',
		kingdom: 'silla',
		born: 567,
		died: 632,
		tagline: 'Fifty-three years on the throne, and only daughters.',
		quote: "A kingdom is a ledger. Keep it balanced.",
		events: [{ year: 632, label: 'Dies; the Council must invent a queen.' }],
		aliases: ['King Jinpyung', 'Jinpyung']
	},
	{
		id: 'chunmyung',
		avatar: '/people/chunmyung.png',
		name: 'Princess Chunmyung',
		korean: '천명공주',
		kingdom: 'silla',
		gender: 'f',
		tagline: 'Gave up her claim, and gave Silla its greatest king instead.',
		quote: "A throne traded is still a choice.",
		events: [{ year: 603, label: 'Mother of Kim Chunchu.' }],
		aliases: ['Princess Chunmyung', 'Chunmyung']
	},
	{
		id: 'sunhwa',
		name: 'Princess Sunhwa',
		korean: '선화공주',
		kingdom: 'silla',
		gender: 'f',
		tagline: 'Married into Baekje — the legend Seodong sang into being.',
		quote: "A princess can still be a rumor.",
		aliases: ['Princess Sunhwa', 'Princess Seonhwa', 'Sunhwa', 'Seonhwa']
	},
	{
		id: 'kingsung',
		name: 'King Seong',
		korean: '성왕',
		hanja: '聖王',
		kingdom: 'baekje',
		born: 504,
		died: 554,
		tagline: 'The sage king of Sabi, killed by a slave’s hand at Gwansanseong.',
		quote: "Holding on is sometimes the only victory.",
		arc: 'Moved the capital to Sabi and rebuilt Baekje’s golden age; retook the Han valley with Silla, and lost it to Silla’s betrayal within a year. Riding at night to his son’s relief, he was caught by Kim Muryeok’s troops, and a stable-slave named Dodo took his head.',
		events: [
			{ year: 538, label: 'Moves the capital to Sabi.' },
			{ year: 553, label: 'Betrayed by Jinheung over the Han valley.' },
			{ year: 554, label: 'Killed at Gwansanseong.' }
		],
		aliases: ['King Seong', 'King Sung']
	},
	{
		id: 'dodo',
		name: 'Dodo',
		korean: '도도',
		kingdom: 'silla',
		tagline: 'The slave who beheaded a king, as the rank system watched.',
		quote: "Be the name the record almost forgot — and remain.",
		events: [{ year: 554, label: 'Kills King Seong at Gwansanseong.' }],
		aliases: ['Dodo']
	},
	{
		id: 'jumong',
		avatar: '/people/jumong.png',
		name: 'Jumong',
		korean: '주몽',
		hanja: '朱蒙',
		kingdom: 'goguryeo',
		born: -58,
		died: -19,
		tagline: 'The archer who crossed the river on the backs of fish and turtles.',
		quote: "From the first look — only you.",
		nature: 'Exile who becomes a maker; with Sosuno the nights run longer than the war talk. Charm of the bow, appetite of a man who has been hungry in more than one sense. Go-clan founder — the royal line Yeon Tabal’s hall will spend centuries arguing with.',
		arc: 'Born of a sunbeam and a river god’s daughter, hatched from an egg, hunted by his brothers. He fled south, and the river’s creatures bridged the water for him. At Jolbon he founded Goryeo — every kingdom in this story claims a piece of his shadow.',
		blade: 'Ring-pommel crow bow-knife — three-legged crow scratched into the pommel by a river wife’s hand.',
		events: [
			{ year: -37, label: 'Founds Goryeo at Jolbon.' },
			{ year: -19, label: 'Dies; his son Yuri succeeds him.' }
		],
		aliases: ['Jumong']
	},
	{
		id: 'onjo',
		name: 'Onjo',
		korean: '온조',
		hanja: '溫祚',
		kingdom: 'baekje',
		died: 28,
		tagline: 'Jumong’s son who went south and named a kingdom for a hundred crossings.',
		quote: "South is also a beginning.",
		events: [{ year: -18, label: 'Founds Baekje at Wiryeseong.' }],
		aliases: ['Onjo']
	},
	{
		id: 'biryu',
		name: 'Biryu',
		korean: '비류',
		kingdom: 'baekje',
		tagline: 'Chose the salt marshes of Michuhol, and regretted it.',
		quote: "Wrong shores still make kingdoms.",
		aliases: ['Biryu']
	},
	{
		id: 'hyukgose',
		name: 'Hyeokgeose',
		korean: '혁거세',
		hanja: '赫居世',
		kingdom: 'silla',
		born: -69,
		died: 4,
		tagline: 'Born from the egg a white horse left kneeling in the forest.',
		quote: "Hatch into the throne you were left.",
		events: [{ year: -57, label: 'Crowned first ruler of Seorabeol.' }],
		aliases: ['Hyukgosé', 'Hyukgose', 'Hyeokgeose']
	},
	{
		id: 'dangun',
		name: 'Dangun',
		korean: '단군',
		hanja: '檀君',
		kingdom: 'joseon',
		title: 'Grandson of Heaven',
		tagline: 'Grandson of Heaven — first earthly steward of the heavenly mandate.',
		quote: 'Heaven descends. Someone must stay and govern.',
		arc: 'Grandson of Heaven: Hwanin’s line through Hwanung and the Bear-Woman. Where the Son of Heaven descends, Dangun stays — founding Asadal as the first court that speaks for heaven on earth, the way later crowns will claim a mandate they did not invent.',
		aliases: ['Dangun', 'Dangun Wanggeom', 'Grandson of Heaven']
	},
	{
		id: 'ugeo',
		name: 'King Ugeo',
		korean: '우거왕',
		kingdom: 'joseon',
		died: -108,
		tagline: 'The last king of Old Joseon, betrayed from inside his own walls.',
		quote: 'A gate kept by traitors is already open.',
		events: [{ year: -108, label: 'Wanggeom falls to the Han; the Four Commanderies begin.' }],
		aliases: ['King Ugeo', 'Ugeo']
	},
	{
		id: 'kyunhwon',
		name: 'Kyun Hwon',
		korean: '견훤',
		hanja: '甄萱',
		kingdom: 'baekje',
		born: 867,
		died: 936,
		tagline: 'Three centuries later, the man who calls himself Baekje’s revenge.',
		quote: "Later kingdoms still steal earlier tricks.",
		events: [{ year: 900, label: 'Founds Later Baekje at Wansanju.' }],
		aliases: ['Kyun Hwon']
	},
	{
		id: 'wanggun',
		name: 'Wang Geon',
		korean: '왕건',
		hanja: '王建',
		kingdom: 'joseon',
		born: 877,
		died: 943,
		tagline: 'The vision Yeon dies seeing: Goryeo, reborn under another man.',
		quote: 'Unify first. Explain after.',
		events: [{ year: 918, label: 'Founds Goryeo, heir to Goguryeo’s name.' }],
		aliases: ['Wang Gun', 'Wang Geon']
	},
	{
		id: 'gyeonggeunchogo',
		name: 'King Geunchogo',
		korean: '근초고왕',
		hanja: '近肖古王',
		kingdom: 'baekje',
		died: 375,
		tagline: 'The Hurricane — Baekje at high tide, a king of Goguryeo dead at his feet.',
		quote: "Wealth is a kind of weather. Ride it.",
		events: [
			{ year: 371, label: 'Kills King Gogugwon at Pyongyang.' },
			{ year: 372, label: 'Sends the Seven-Branched Sword to Wa.' }
		],
		aliases: ['King Geunchogo', 'Geunchogo', 'Gunchogo']
	},
	{
		id: 'gwanggaeto',
		name: 'Gwanggaeto the Great',
		korean: '광개토대왕',
		hanja: '廣開土大王',
		kingdom: 'goguryeo',
		born: 374,
		died: 413,
		tagline: 'The Conqueror — sixty-four fortresses, and a stele to list them.',
		quote: "Expand until the stele runs out of space.",
		events: [
			{ year: 391, label: 'Takes the throne at eighteen.' },
			{ year: 400, label: 'Rescues Silla from Wa with fifty thousand riders.' },
			{ year: 413, label: 'Dies at thirty-nine.' }
		],
		aliases: ['Gwanggaeto']
	},
	{
		id: 'jomei',
		name: 'King Jomei',
		korean: '조메이 천황',
		kingdom: 'yamato',
		born: 593,
		died: 641,
		tagline: 'Yamato’s king, watching the continent try a new fashion in queens.',
		quote: "An eastern king watches western weather.",
		aliases: ['King Jomei', 'Jomei']
	},
	{
		id: 'euljae',
		name: 'Euljé',
		korean: '을제',
		kingdom: 'silla',
		tagline: 'The High Councillor who steadied Queen Sunduk’s first years.',
		quote: "Stand where the map is thin.",
		aliases: ['Euljé']
	},

	// ————————————————————————— Baekje —————————————————————————
	{
		id: 'gyebek',
		avatar: '/people/gyebek.png',
		name: 'Gyebek',
		korean: '계백',
		hanja: '階伯',
		title: 'General of Baekje',
		kingdom: 'baekje',
		born: 620,
		died: 660,
		bornApprox: true,
		tagline: 'Hundred-Victories Gyebek — Euija’s named boy, allergic to the game that raised him.',
		quote: "Focus is the only loyalty left.",
		nature: 'Epitome of focus. Traumatic past, emotions suppressed or delayed, endlessly loyal, allergic to politics. He hears sentences at their exact width — misses jokes, misreads faces, trusts numbers because numbers do not lie. Euija’s soft spot and Euija’s pupil: taught the world’s dirt without ever learning to love the game. When the kingdom is already lost, focus is what remains — five thousand against the arithmetic of survival.',
		arc: 'Found half-drowned by a prince and named after a turtle, Gyebek has no clan and therefore no ceiling and no floor — passed over for command, exiled to an island, recalled only when the kingdom is already lost. He hears every sentence at its exact width: he does not catch a joke, cannot read a face, counts what he can count because numbers do not lie to him, and keeps a promise past the point where keeping it makes sense. It is what makes him unbearable at court and unbreakable in a field. He answers with five thousand men against fifty thousand, killing his own family first so that nothing can be used against him.',
		blade: 'Single-edged phoenix blade — curved like an eastern sword, phoenix on the ring pommel; one side only, as he is.',
		events: [
			{ year: 632, label: 'Named by the crown prince Euija.' },
			{ year: 655, label: 'Exiled to Tamla; five years of stories, and the only place being exactly himself costs nothing.' },
			{ year: 660, label: 'Recalled. Kills his family, marches with 5,000, dies at Hwangsanbeol.' }
		],
		sobriquets: ['Greatest Blade of Samhan', 'Hundred-Victories Gyebek'],
		aliases: ['Gyebek', 'Hundred-Victories Gyebek', 'Hundred-Victories']
	},
	{
		id: 'kingmu',
		name: 'King Mu',
		korean: '무왕',
		title: '30th Eraha of Baekje',
		kingdom: 'baekje',
		born: 561,
		died: 641,
		bornApprox: true,
		tagline: 'Euija’s father; spent a long reign grinding against Silla.',
		quote: "Finish what I started — or do not wear my name.",
		aliases: ['King Mu', 'Seodong', '서동']
	},
	{
		id: 'seongchung',
		name: 'Seongchung',
		korean: '성충',
		kingdom: 'baekje',
		died: 656,
		tagline: 'Told the king the truth and starved in prison for it.',
		quote: "Truth spoken once is still a weapon.",
		events: [{ year: 656, label: 'Dies imprisoned, leaving instructions on how to defend Baekje.' }],
		aliases: ['Sungchung', 'Seongchung']
	},
	{
		id: 'pung',
		name: 'Prince Pung',
		korean: '부여풍',
		title: 'King Pungjang of the Restoration',
		kingdom: 'baekje',
		born: 624,
		bornApprox: true,
		tagline: 'Twenty years a guest in the East, then a king with no kingdom.',
		quote: "Blood remembers a country that forgot your face.",
		events: [
			{ year: 661, label: 'Returns from Yamato, crowned by the Restoration Society.' },
			{ year: 663, label: 'Executes Boksin; loses everything at the White River.' }
		],
		aliases: ['King Pungjang', 'Prince Pung', 'Pung']
	},
	{
		id: 'boksin',
		name: 'Gwishil Boksin',
		korean: '귀실복신',
		kingdom: 'baekje',
		died: 663,
		tagline: 'The Restoration’s best general, killed by the king he crowned.',
		quote: "Raise the country twice if once was not enough.",
		aliases: ['Gwishil Bokshin', 'Boksin', 'Bokshin']
	},

	// ————————————————————————— Goguryeo —————————————————————————
	{
		id: 'yeongnyu',
		name: 'King Yeongnyu',
		korean: '영류왕',
		title: '27th sovereign of Goguryeo',
		kingdom: 'goguryeo',
		born: 583,
		died: 642,
		bornApprox: true,
		tagline: 'Bought peace with tribute until his own commander cut him down.',
		quote: "Keeping a court alive is its own crime.",
		aliases: ['King Youngryu', 'Youngryu', 'Yeongnyu']
	},
	{
		id: 'bojang',
		name: 'King Bojang',
		korean: '보장왕',
		title: '28th and last sovereign of Goguryeo',
		kingdom: 'goguryeo',
		died: 682,
		tagline: 'A nephew put on a throne by the man who emptied it.',
		quote: "Wear the crown. Let someone else wear the power.",
		aliases: ['King Bojang', 'Bojang']
	},
	{
		id: 'yangmanchun',
		avatar: '/people/guardian.png',
		name: 'The Guardian',
		korean: '안시성주',
		title: 'Guardian of Ansi Fortress',
		kingdom: 'goguryeo',
		born: 610,
		bornApprox: true,
		tagline: 'Wall that stopped an emperor — refused Yeon, refused Tang, held anyway.',
		quote: "You will never be crazier than we are.",
		arc: 'The chronicles never recorded his name; the people of Ansi simply called him the chief. He refuses to bow to the man who butchered the court, flies the old colours over his wall — and then defends that man’s kingdom against the greatest army on earth, handing Taizong the first defeat of his life. Only centuries later did writers give him a name: Yang Manchun.',
		events: [{ year: 645, label: 'Holds Ansi against Taizong through a summer-long siege.' }],
		sobriquets: ['Guardian of Ansi', 'Wall that Stopped an Emperor'],
		aliases: [
			'Commander Yang',
			'Yang Manchun',
			'the Guardian',
			'Guardian',
			'Guardian of Ansi',
			'Wall that Stopped an Emperor'
		]
	},
	{
		id: 'namseng',
		avatar: '/people/yeon_namseng.png',
		name: 'Yeon Namseng',
		korean: '연남생',
		kingdom: 'goguryeo',
		born: 634,
		died: 679,
		tagline: 'Gesomun’s heir, who lost his brothers and guided the Tang home.',
		quote: "Birth order is not a strategy — until it is.",
		events: [
			{ year: 665, label: 'Succeeds his father as Supreme Commander.' },
			{ year: 666, label: 'Ousted by his brothers; defects to the Emperor.' }
		],
		aliases: ['Yeon Namseng', 'Namseng']
	},
	{
		id: 'namgun',
		avatar: '/people/yeon_namgun.png',
		name: 'Yeon Namgun',
		korean: '연남건',
		kingdom: 'goguryeo',
		born: 637,
		bornApprox: true,
		tagline: 'Took his brother’s title and made the last stand at Pyongyang.',
		quote: "Goguryeo never dies.",
		blade: 'Ring-pommel crow sword — younger brother of the Five Blades’ stamp.',
		events: [{ year: 668, label: 'Defends Pyongyang until the gates are opened from within.' }],
		aliases: ['Yeon Namgun', 'Namgun']
	},
	{
		id: 'namsan',
		avatar: '/people/yeon_namsan.png',
		name: 'Yeon Namsan',
		korean: '연남산',
		kingdom: 'goguryeo',
		born: 639,
		died: 701,
		tagline: 'The youngest brother, who surrendered the city.',
		quote: "Watching is also a kind of loyalty.",
		aliases: ['Yeon Namsan', 'Namsan']
	},
	{
		id: 'munduk',
		name: 'Ulchi Munduk',
		korean: '을지문덕',
		title: '“The Defender”',
		kingdom: 'goguryeo',
		tagline: 'Drowned a Sui army at the Salsu and wrote its general a poem about it.',
		quote: "Know when to stop — and make them follow you into the water.",
		events: [{ year: 612, label: 'Destroys the Sui host at the Great River.' }],
		aliases: ['Ulchi Munduk', 'Munduk']
	},

	// ————————————————————————— Tang & beyond —————————————————————————
	{
		id: 'taizong',
		avatar: '/people/taizong.png',
		name: 'The Second Emperor',
		korean: '이세민',
		hanja: '李世民',
		title: 'Second Emperor of Tang (Taizong)',
		kingdom: 'tang',
		born: 598,
		died: 649,
		tagline: 'Khan of Heaven — chauvinist, magnetic, terrifyingly good at his job.',
		quote: "A throne is not a feast. It is a blade with a seat attached.",
		nature: 'Openly prefers a world run by decisive men; still the most competent person in any room he enters. Respected even by those he calls barbarian. Builds real friendship with Chunchu without ever forgetting who holds the silk. Sexually assured the way conquerors are — present, not crude.',
		arc: 'Murdered his brothers for the throne and then justified it by conquering the known world. Shows Chunchu what absolute obedience looks like and accidentally teaches Silla the grammar of Chinese absolutism. Goguryeo is the one page he cannot write: stopped at Ansi, he dies asking a friend to finish it.',
		events: [
			{ year: 626, label: 'Kills his brothers at the Xuanwu Gate and takes the throne.' },
			{ year: 645, label: 'Invades Goguryeo in person; is turned back at Ansi.' },
			{ year: 648, label: 'Grants Chunchu the alliance.' },
			{ year: 649, label: 'Dies; given a temple name.' }
		],
		aliases: ['The Second Emperor', 'the Second Emperor', 'Second Emperor', 'Emperor Taizong', 'Li Shimin', 'Taizong', '이세민']
	},
	{
		id: 'gaozong',
		avatar: '/people/gaozong.png',
		name: 'The Third Emperor',
		korean: '이치',
		hanja: '李治',
		title: 'Third Emperor of Tang (Gaozong)',
		kingdom: 'tang',
		born: 628,
		died: 683,
		tagline: 'Decent, earnest — filling shoes that were never made in his size.',
		quote: "Finish the war you inherit.",
		nature: 'Less brilliant than his father, more willing to be loved. Sexually confident in the soft way of a man who has never had to take a room by force. Tries to rule as the Second Emperor’s son and as Zhi the gyuku friend — and the gap between those two men is the weather Wu learns to inhabit.',
		arc: 'As crown prince he rides and drinks with Kim Chunchu like a man who has finally been allowed a friend outside the palace wall. He becomes the Third Emperor without his father’s genius and with his father’s wars still open. He keeps promises, finishes what the Second Emperor could not, and slowly discovers that living up to a legend is a different skill from becoming one — and that the woman who finishes his sentences may be the better emperor.',
		stages: [
			{
				until: 649,
				name: 'Li Zhi',
				korean: '이치',
				title: 'Crown Prince of Tang',
				avatar: '/people/gaozong.png'
			},
			{
				from: 649,
				name: 'The Third Emperor',
				korean: '이치',
				title: 'Third Emperor of Tang (Gaozong)',
				avatar: '/people/gaozong.png'
			}
		],
		aliases: [
			'The Third Emperor',
			'the Third Emperor',
			'Third Emperor',
			'Emperor Gaozong',
			'Gaozong',
			'Li Zhi',
			'이치',
			'the young emperor',
			'The Young Emperor',
			'the crown prince',
			'Crown Prince'
		]
	},
	{
		id: 'wuzetian',
		avatar: '/people/wu_zetian.png',
		name: 'Wu Zetian',
		korean: '무측천',
		hanja: '武則天',
		title: 'Empress of Tang',
		kingdom: 'tang',
		gender: 'f',
		born: 624,
		died: 705,
		tagline: 'The concubine who outlasted an emperor — and then wore the throne.',
		quote: "I do not borrow a reign. I keep it.",
		nature: 'Flirtation as logistics. Master of the glance, the aside, the smile that rearranges a banquet. Intensely interested in Silla’s woman king — not as gossip, as precedent. Liberal with cruelty, precise with legitimacy; can terrify a diplomat without raising her voice.',
		arc: 'Works the Second Emperor’s court from behind a screen, then the Third Emperor’s from beside the seal. Whispers one sentence into Chunchu’s ear before he leaves Chang’an and smiles; he never again meets anyone who frightens him the same way. The wars that finish Goryeo happen in weather she increasingly owns. After the Third Emperor’s death she founds her own Zhou.',
		binyeo: 'Phoenix-cloud binyeo — gold thin as a threat.',
		events: [
			{ year: 640, label: 'Enters the palace as a young concubine under the Second Emperor.' },
			{ year: 649, label: 'Measures Chunchu in a corridor before he leaves Chang’an.' },
			{ year: 649, label: 'Still present when the Third Emperor rises — influence already thickening.' },
			{ year: 655, label: 'Named empress consort under the Third Emperor.' },
			{ year: 660, label: 'Baekje falls while she consolidates the inner court.' },
			{ year: 690, label: 'Takes the throne as emperor of her own Zhou.' }
		],
		aliases: ['Wu Zetian', 'Empress Wu', '무측천', '武則天', 'the Empress Wu']
	},

	{
		id: 'west_ambassador',
		avatar: '/people/west_ambassador.png',
		name: 'Western Ambassador',
		korean: '서방 사신',
		title: 'Tang court voice',
		kingdom: 'tang',
		gender: 'm',
		tagline: 'China’s smile at the banquet — fond of hierarchy, fond of wine.',
		quote: "Even Samhan can learn which way to bow.",
		nature: 'Socially confident, a little smug, sexually self-assured without needing to prove it. Treats foreign tears as entertainment until they move policy.',
		arc: 'Toasts Taizong, needles Chunchu, and underestimates the woman behind the screen.',
		aliases: ['Western Ambassador', 'the Western Ambassador', '서방 사신']
	},
	{
		id: 'east_ambassador',
		avatar: '/people/east_ambassador.png',
		name: 'Eastern Ambassador',
		korean: '동방 사신',
		title: 'Yamato envoy at Chang’an',
		kingdom: 'yamato',
		gender: 'm',
		tagline: 'Japan’s careful smile — knows empresses exist, and watches Wu too long.',
		quote: "Power wears many sleeves.",
		nature: 'Refined, flirtatious in the soft register, politically cautious. More at ease with women on thrones than the Western table is — which does not make him safer.',
		arc: 'Shares the Tang banquet with Silla’s weeping prince and leaves having learned who in the room was actually dangerous.',
		aliases: ['Eastern Ambassador', 'the Eastern Ambassador', '동방 사신', 'Yamato envoy']
	},


	// ————————————————————————— Gaya —————————————————————————
	{
		id: 'muryuk',
		name: 'Kim Muryuk',
		korean: '김무력',
		kingdom: 'gaya',
		tagline: 'Last prince of Golden Gaya — traded a kingdom so his blood could keep a sword.',
		quote: "A man’s loyalty is the only soil that counts.",
		arc: 'He surrenders Geumgwan so his line may live as True Bone. At the cavern lake his ghost tells his grandson what the surrender was for: not blood purity — love kept, and a country kept with it.',
		blade: 'Ring-pommel Gaya iron — egg-and-iron mark still visible under the Silla polish.',
		events: [{ year: 532, label: 'Golden Gaya surrenders to Silla.' }],
		aliases: ['Kim Muryuk', 'Muryuk']
	},
	{
		id: 'seohyeon',
		name: 'Kim Seohyeon',
		korean: '김서현',
		kingdom: 'silla',
		tagline: 'Yushin’s father — Gaya blood that chose Silla every morning.',
		quote: "Love the country that let you keep your name.",
		arc: 'Son of Muryuk; father of Yushin and Munhee. Loyal Silla patriot to the end — the middle generation that made the surrender into a household.',
		blade: 'Ring-pommel plain sword — no crest louder than duty.',
		events: [{ label: 'Raises Yushin to serve a queen he will never meet.' }],
		aliases: ['Kim Seohyeon', 'Seohyeon', '서현']
	},
	{
		id: 'jinheung',
		name: 'King Jinheung',
		korean: '진흥왕',
		title: '24th sovereign of Silla',
		kingdom: 'silla',
		born: 534,
		died: 576,
		tagline: 'The conqueror who betrayed an ally and doubled a kingdom.',
		quote: "Expand until the map runs out of room for trust.",
		events: [
			{ year: 553, label: 'Seizes the Han River from his ally Baekje.' },
			{ year: 554, label: 'Kills King Seong at Gwansanseong.' },
			{ year: 562, label: 'Conquers Daegaya.' }
		],
		aliases: ['Jinheung']
	}
];

// ————————————————————————— institutions & ideas —————————————————————————
// Not people: the systems the characters are trapped inside. They get the same
// hover card and profile panel, because in this story they behave like actors.
export const CONCEPTS: Person[] = [
	{
		id: 'haenyeo',
		name: 'The Divers',
		korean: '해녀',
		entity: 'concept',
		gender: 'f',
		kingdom: 'tamla',
		title: 'The women who work the seafloor of Tamla',
		tagline: 'Do not hold the breath. Push it out with singing.',
		quote: 'Do not hold the breath. Push it out with singing.',
		events: [
			{ label: 'Taught an exiled Baekje general to carry water and, badly, to sing.' }
		],
		aliases: ['haenyeo', 'the divers']
	},
	{
		id: 'courtmaid',
		avatar: '/people/maid_1.png',
		name: 'The Court Maids',
		korean: '궁녀',
		entity: 'concept',
		gender: 'f',
		kingdom: 'baekje',
		title: 'Euija’s household',
		tagline: 'Two at first. Hundreds by the end. They never stop suggesting.',
		events: [
			{ year: 641, label: 'Two.' },
			{ year: 656, label: 'Hundreds — and the king has stopped arguing.' },
			{ year: 660, label: 'The Flower Cliffs.' }
		],
		aliases: ['court maid', 'court maids']
	},
	{
		id: 'shaman',
		avatar: '/people/shaman.png',
		name: 'The Shaman',
		korean: '무당',
		entity: 'concept',
		gender: 'f',
		kingdom: 'baekje',
		title: 'Reader of the nine signs',
		tagline: 'Told Euija what the turtle meant — and did not live to hear him deny it.',
		quote: 'A sign ignored is still a sign.',
		events: [
			{ year: 659, label: 'Reads the nine omens and the turtle’s back; Euija cuts her down.' }
		],
		aliases: ['shaman', 'the shaman', '무당']
	},
	{
		id: 'seolmundae',
		name: 'Seolmundae',
		korean: '설문대할망',
		entity: 'concept',
		gender: 'f',
		kingdom: 'tamla',
		title: 'The Great Lady who made the island',
		tagline: 'Piled the sea into a mountain, and drowned in a pot of porridge feeding her sons.',
		events: [
			{ label: 'Scoops up Mount Halla; the holes in her apron leave 368 hills.' },
			{ label: 'Falls into the cauldron; her 500 sons eat, and then find her bones.' },
			{ label: 'Asks for 100 rolls of silk for a bridge to the mainland. They find 99.' }
		],
		aliases: ['Seolmundae', 'Great Lady of the Mountain']
	},
	{
		id: 'jacheongbi',
		name: 'Jacheongbi',
		korean: '자청비',
		entity: 'concept',
		kingdom: 'tamla',
		title: 'Goddess of the five grains',
		tagline: 'Cut her hair to get into the room, then walked to the underworld to get him back.',
		quote: 'Cut your hair if you must. Walk to the dead if you must.',
		events: [
			{ label: 'Studies three years disguised as a man beside Mun Doryeong.' },
			{ label: 'Reveals herself at the parting stream.' },
			{ label: 'Fetches the resurrection flower from the Western Field and revives him.' },
			{ label: 'Is given the five grains and sent down to plant them.' }
		],
		aliases: ['Jacheongbi']
	},
	{
		id: 'mundoryeong',
		name: 'Mun Doryeong',
		korean: '문도령',
		entity: 'concept',
		kingdom: 'tamla',
		title: 'The boy from the sky',
		tagline: 'Sat beside her for three years and noticed on the last night.',
		quote: 'Notice on the last night — or lose her forever.',
		aliases: ['Mun Doryeong']
	},
	{
		id: 'gameunjang',
		name: 'Gameunjang-agi',
		korean: '가믄장아기',
		entity: 'concept',
		gender: 'f',
		kingdom: 'tamla',
		title: 'Goddess of fortune',
		tagline: 'Said she lived on her own luck, and was thrown out of the house for it.',
		quote: 'Live on your own luck.',
		events: [
			{ label: 'Cast out; marries the youngest yam-digger and finds gold in his spoil heap.' },
			{ label: 'Holds a three-day beggars’ feast; her blind parents see again.' }
		],
		aliases: ['Gameunjang-agi', 'Gameunjang']
	},
	{
		id: 'baekjuto',
		name: 'Baekjuto',
		korean: '백주또',
		entity: 'concept',
		gender: 'f',
		kingdom: 'tamla',
		title: 'Goddess of farming, of the Songdang shrine',
		tagline: 'Came across the sea, married a hunter, and divorced him over an ox.',
		quote: 'An ox can end a marriage. A shrine can begin one.',
		aliases: ['Baekjuto']
	},
	{
		id: 'socheonguk',
		name: 'Socheon-guk',
		korean: '소천국',
		entity: 'concept',
		gender: 'm',
		kingdom: 'tamla',
		title: 'God of the hunt',
		tagline: 'Ate the plough ox. Then ate somebody else’s.',
		quote: 'Hunt first. Apologize never.',
		aliases: ['Socheon-guk', 'Socheonguk']
	},
	{
		id: 'yumla',
		name: 'King Yumla',
		korean: '염라대왕',
		hanja: '閻羅大王',
		entity: 'concept',
		gender: 'm',
		kingdom: 'underworld',
		title: 'King of the underworld kingdom',
		tagline: 'Sovereign of the dead — court, ledger, and borders no living map admits.',
		quote: "The living argue. We keep minutes.",
		nature: 'A king with a kingdom parallel to Silla, Baekje, and Goguryeo: loyalty, borders, a court that runs on time. Once called Yama; here he is His Majesty of the underworld. Heaven once sent Kangrim to arrest him; Kangrim stayed and serves.',
		arc: 'King Yumla rules the underworld as its own kingdom — not a metaphor for death but a polity of the dead, with sovereignty and a messenger corps. Kangrim addresses him as Your Majesty; the crow that scrambled the ledger is the closest the kingdom comes to a foreign incident.',
		events: [
			{ label: 'Heaven sends Kangrim to arrest him; Kangrim stays as escort.' },
			{ label: 'Keeps the borders of the dead while Samhan burns above.' }
		],
		aliases: ['King Yumla', 'Yumla', '염라대왕', '염라', 'King Yama', 'Yama', 'King of the Dead']
	},
	{
		id: 'kangrim',
		avatar: '/people/kangrim.png',
		name: 'Kangrim',
		korean: '강림',
		entity: 'concept',
		gender: 'm',
		kingdom: 'underworld',
		title: 'Escort of His Majesty’s underworld kingdom',
		tagline: 'Messenger of King Yumla — one question at the threshold, then the walk.',
		quote: "I do not punish. I collect — for His Majesty.",
		nature: 'Dry, curious, never cruel. Serves King Yumla of the underworld kingdom as a marshal serves a throne: ledger, borders of the dead, loyalty without sermons. Appears at death with a single question about the choice that made the life. A crow scrambled his ledger, which is why hours are unclear. Impressed by dedication; surprised by honesty; tipped his hat once to a man rude enough to refuse him.',
		arc: 'Heaven sent him to arrest King Yumla; he stayed as escort and learned the underworld was a kingdom — court, sovereignty, minutes kept better than Surabol’s. Across Samhan he collects queens, rebels, marshals, and a girl at Daeya who did not know his face, always for His Majesty. The island tells his full story last — after every kinder Tamla tale — because once you have heard it, every ending changes key.',
		events: [
			{ label: 'Sent to arrest King Yumla; stays and serves His Majesty.' },
			{ year: 642, label: 'Collects Gotaso at Daeya — she does not know him.' },
			{ year: 647, label: 'Two names in one night: Bidam and Sunduk.' },
			{ label: 'A crow scrambles his list — which is why nobody knows their hour.' },
			{ year: 660, label: 'At Hwangsan, five thousand wave up at him.' },
			{ year: 662, label: 'Yeon Gesomun looks at him and walks away.' }
		],
		aliases: ['Kangrim', 'Gangnim', '강림', 'the reaper']
	},
	{
		id: 'sanbangdeok',
		name: 'Sanbangdeok',
		korean: '산방덕',
		entity: 'concept',
		kingdom: 'tamla',
		title: 'The rock-goddess of Sanbang',
		tagline: 'Loved a poor man, was wanted by an official, and went back into the cliff.',
		quote: "Better the cliff than the wrong official.",
		aliases: ['Sanbangdeok']
	},
	{
		id: 'bonerank',
		name: 'The Bone Rank System',
		korean: '골품제',
		hanja: '骨品制',
		entity: 'concept',
		kingdom: 'silla',
		title: 'Silla’s hereditary caste order',
		tagline: 'Birth decides everything — office, dress, the size of your house.',
		arc: 'Silla’s answer to the question of who may rule: Sacred Bone at the top, then True Bone, then six grades of commoner. It gives the kingdom four centuries of stability and, in the end, the reason it cannot promote its best people. It makes Dukman queen because no man of the right blood is left; it keeps Chunchu from the throne for thirty years; it hands a border fortress to Pumsuk because he is a Noble, and Daeya falls.',
		events: [
			{ year: 632, label: 'Only three Sacred Bone royals remain.' },
			{ year: 654, label: 'The Sacred Bone line dies out; a True Bone takes the throne.' }
		],
		aliases: ['Bone Rank System', 'Bone Rank']
	},
	{
		id: 'harmonycouncil',
		name: 'The Harmony Council',
		korean: '화백회의',
		hanja: '和白會議',
		entity: 'concept',
		kingdom: 'silla',
		title: 'The ruling council of Silla’s nobles',
		tagline: 'Unanimity or nothing — one hand down stops a queen, an heir, or a war.',
		arc: 'Silla’s aristocratic assembly decides by full agreement: a single objection is a veto. It crowns Dukman in 632 when Bidam forces the room; fails to name Seungman in 645 when Bidam alone withholds his hand; enthrones Chunchu in 654 when the holdout is laughed down. That physics is exactly what Chunchu builds the Royal Secretariat to route around.',
		events: [
			{ year: 632, label: 'Debates the succession and crowns Queen Sunduk.' },
			{ year: 645, label: 'Selects Bidam as High Councillor.' },
			{ year: 654, label: 'Enthrones Kim Chunchu as King Muyeol.' }
		],
		aliases: ['Harmony Council']
	},
	{
		id: 'hwarang',
		name: 'The Hwarang',
		korean: '화랑',
		hanja: '花郎',
		entity: 'concept',
		/* the one institution that speaks aloud in the chronicle, as a chorus of
		   young noblemen — so it needs a body on the stage */
		gender: 'm',
		kingdom: 'silla',
		title: 'The Flowering Knights',
		tagline: 'Elite of the elite — trained, lettered, beautiful, and armed with forms no common soldier knows.',
		nature: 'Alumni never stop saying the word. A Hwarang is expected to ride, recite, and look like the country worth dying for. Special forms — named cuts, paired drills, the 108 count — mark who trained in the yard and who merely wore a sword.',
		arc: 'Silla’s training order for noble youth — part officer academy, part brotherhood, part cult. It produces Yushin, Bidam, Alchun and Pumsuk, which is to say it produces both the man who saves the throne and the man who rebels against it, and the boy who loses Daeya. When two of them meet between camps, the country watches a private language of steel.',
		events: [
			{ year: 576, label: 'Formalised under King Jinheung.' },
			{ year: 632, label: 'The young knights pledge to Queen Sunduk.' },
			{ year: 660, label: 'Gwanchang and Banggul die at the Yellow Mountain Fields.' }
		],
		aliases: ['Hwarang knights', 'Flower Knights', 'Hwarang']
	},
	{
		id: 'fiveprinciples',
		name: 'The Five Principles',
		korean: '세속오계',
		hanja: '世俗五戒',
		entity: 'concept',
		kingdom: 'silla',
		title: 'The Hwarang code',
		tagline: 'Loyalty, filial duty, faith between friends, no retreat, and mercy in killing.',
		arc: 'Five lines that read as virtues and function as a machine for producing dead teenagers. 임전무퇴 — never retreat — is the one the story keeps returning to: it is why Gwanchang rides back, why Gyebek kills his family, and why Baekje fights a war it has already lost.',
		aliases: ['Five Principles']
	},
	{
		id: 'greatheroes',
		name: 'The Great Heroes of Goguryeo',
		korean: '고구려 영웅',
		entity: 'concept',
		kingdom: 'goguryeo',
		title: 'The defenders in the Hall of Heroes',
		tagline: 'The short list of men who stopped an empire at the Liao.',
		arc: 'Goguryeo’s self-image in five or six names — Gwanggaeto who expanded it, Ulchi Munduk who drowned the Sui at the Salsu, Yang Manchun who held Ansi against Taizong. Yeon Gesomun spends his life auditioning for the list and Namseng inherits a kingdom that believes the list will always be added to.',
		events: [
			{ year: 612, label: 'Ulchi Munduk destroys the Sui at the Great River.' },
			{ year: 645, label: 'Yang Manchun is added after holding Ansi.' }
		],
		aliases: ['Great Heroes of Goguryeo', 'Great Heroes']
	},
	{
		id: 'eightclans',
		name: 'The Eight Great Clans',
		korean: '대성팔족',
		hanja: '大姓八族',
		entity: 'concept',
		kingdom: 'baekje',
		title: 'The noble houses of Baekje',
		tagline: 'Eight families who own the king by owning his sons.',
		arc: 'Jinmo, Satek, Yunbi, Mokli, Hae, Baek, Guk, Ahn — the houses that make Baekje’s kings and, through the Ministers’ Assembly, unmake them. Euija breaks them in 655 by seating forty-one of his own sons in their chairs, and discovers that a court with no rivals is also a court with no one left to tell him the truth.',
		events: [
			{ year: 632, label: 'The Satek clan holds both the queen and the prime minister.' },
			{ year: 655, label: 'Euija purges the Assembly and installs his sons.' }
		],
		aliases: ['Eight Great Clans']
	},
	{
		id: 'ministersassembly',
		name: 'The Ministers’ Assembly',
		korean: '정사암회의',
		entity: 'concept',
		kingdom: 'baekje',
		title: 'Baekje’s council of nobles',
		tagline: 'Where the Eight Clans fought for the king’s ear, until there was no one left to fight.',
		aliases: ['Ministers’ Assembly']
	},
	{
		id: 'fiveblades',
		name: 'The Five Blades',
		korean: '오도',
		entity: 'concept',
		kingdom: 'goguryeo',
		title: 'Yeon Gesomun’s swords',
		tagline: 'Five ring-pommels across the back — each crow-stamped, each once a commander’s.',
		arc: 'After the massacre of 642 Yeon takes a sword for each of the commanders he killed and wears them all. Every pommel carries the three-legged crow. They are the whole argument of his rule in one image: authority is not granted, it is carried — and the Yeon hall has always preferred carrying to asking.',
		events: [{ year: 642, label: 'Taken at the banquet, after killing the other commanders.' }],
		aliases: ['Five Blades']
	},
	{
		id: 'highsummit',
		name: 'The High Summit',
		korean: '제가회의',
		entity: 'concept',
		kingdom: 'goguryeo',
		title: 'The council of the Five Commanderies',
		tagline: 'Where Goguryeo debated whether to pay the Tang or fight them.',
		aliases: ['High Summit']
	},
	{
		id: 'royalsecretariat',
		name: 'The Royal Secretariat',
		korean: '집사부',
		hanja: '執事部',
		entity: 'concept',
		kingdom: 'silla',
		title: 'Chunchu’s instrument of direct rule',
		tagline: 'Petition, seal, courier — under a Chancellor (侍中) who does not wait for unanimity.',
		nature: 'Copied from the heat Chunchu felt in Chang’an: one centre, one will. The Harmony Council still meets and is not abolished — it is merely ornamental. Enemies say he is in love with the emperor. Friends say he is in love with speed.',
		arc: 'Founded in 651 with Kim Jukji as first 시중. The old halls keep their chairs; the seals stop asking those chairs for permission.',
		events: [
			{ year: 651, label: 'Established by Chunchu; Jukji named first Chancellor.' },
			{ year: 654, label: 'Runs the kingdom under Muyeol while the Council adjourns on schedule.' }
		],
		aliases: ['Royal Secretariat', '執事部', '집사부']
	},
	{
		id: 'sillatang',
		name: 'The Silla–Tang Alliance',
		korean: '나당연합',
		hanja: '羅唐同盟',
		entity: 'concept',
		kingdom: 'other',
		title: 'The bargain that unified Samhan',
		tagline: 'The alliance that destroyed two kingdoms, then had to be destroyed itself.',
		arc: 'Chunchu’s masterpiece and the charge his enemies never stop levelling at him. It ends Baekje in 660 and Goguryeo in 668, and then requires an eight-year war to expel the ally from the peninsula it was invited onto.',
		events: [
			{ year: 648, label: 'Sealed by Chunchu and Emperor Taizong.' },
			{ year: 660, label: 'Baekje falls.' },
			{ year: 668, label: 'Goguryeo falls.' },
			{ year: 676, label: 'Silla expels the Tang.' }
		],
		aliases: ['Silla-Tang alliance', 'Silla–Tang alliance', 'Chunchu Army']
	}
];


// ————————————————————————— the nations —————————————————————————
export const NATIONS: Person[] = [
	{
		id: 'nation-silla',
		name: 'Silla',
		korean: '신라',
		hanja: '新羅',
		entity: 'nation',
		kingdom: 'silla',
		born: -57,
		died: 935,
		title: 'The Divine Country',
		photo: '/nations/silla.jpg',
		photoCredit: 'Cheomseongdae observatory, Gyeongju — built under Queen Seondeok (Wikimedia Commons)',
		tagline: 'The Divine Country — smallest of the three, and the one left standing.',
		nature: 'Bone Rank sorts who may rule; the Harmony Council sorts who may act — and only when every noble agrees. Hwarang forge the boys who will either save the throne or rebel against it — elite of the elite, lettered and beautiful, with fighting forms the yards still name. Whoever wears the crown is understood to speak for the heavenly horse. Centralisation (Secretariat, Tang alliance) is always a fight with the old halls.',
		arc: 'Founded, the legend says, when a white horse left an egg under a blue sky before the chiefs of six clans — a kingdom that would keep the moon on its banners and love as its quiet engine. Silla is the furthest from the West, the last to take Buddhism, the most rigid in caste — and the one that learns diplomacy because it cannot win alone. Under Queen Seondeok it survives; under Muyeol and Munmu it allies with the Tang to destroy Baekje and Goryeo, then turns and expels the Tang itself. It rules the unified peninsula for two and a half more centuries.',
		events: [
			{ year: -57, label: 'Founded at Seorabeol by Hyeokgeose, the legend says.' },
			{ year: 532, label: 'Absorbs Golden Gaya.' },
			{ year: 660, label: 'Destroys Baekje with the Tang.' },
			{ year: 668, label: 'Destroys Goguryeo.' },
			{ year: 676, label: 'Expels the Tang; unifies the peninsula below the Taedong.' },
			{ year: 935, label: 'Ends, absorbed into Goryeo.' }
		],
		sobriquets: ['the Divine Country', 'Land of the Rooster Forest'],
		aliases: [
			'Silla',
			'the Divine Country',
			'Divine Country',
			'Land of the Rooster Forest',
			'Rooster Forest'
		]
	},
	{
		id: 'nation-baekje',
		name: 'Baekje',
		korean: '백제',
		hanja: '百濟',
		entity: 'nation',
		kingdom: 'baekje',
		born: -18,
		died: 660,
		title: 'Land of the Heavenly Deer',
		photo: '/nations/baekje.jpg',
		photoCredit: 'Gilt-bronze Incense Burner of Baekje, National Treasure no. 287 (Wikimedia Commons)',
		tagline: 'Land of the Heavenly Deer — most refined of the three, teacher of the East.',
		nature: 'Eight Great Clans and a Ministers’ Assembly that can move on a plurality — faster than Silla, bloodier in the street. Royal Buyeo sits above a permanent Satek–Yunbi knife-fight; kings who purge the chairs inherit the emptiness. Of the three, Baekje sits closest to the eastern islands in manners: polished courts, sea-lane taste, a habit of teaching neighbours how a capital should look. The crown binds the heavenly deer — lose the crown, and the deer’s door closes.',
		arc: 'Founded by Onjo, a son of Jumong who came south when the throne of Goryeo went to another brother — settling where a heavenly deer showed the door between earth and the yellow sky, under stars the court would later read for loyalty. Baekje is the kingdom of the sea lanes: it gives the East writing, Buddhism and temple architects, and fights Silla for three centuries over the Han valley. Its court is owned by eight great clans, and its last king breaks the clans only to find he has broken the kingdom. It falls in 660; its restoration army dies at the White River in 663.',
		events: [
			{ year: -18, label: 'Founded at Wiryeseong by Onjo.' },
			{ year: 371, label: 'Geunchogo kills the king of Goguryeo at Pyongyang.' },
			{ year: 538, label: 'Capital moves to Sabi.' },
			{ year: 660, label: 'Sabi falls to the Silla–Tang alliance.' },
			{ year: 663, label: 'The restoration fails at the White River.' }
		],
		sobriquets: ['Land of the Heavenly Deer', 'Land of the Lord Buddha'],
		aliases: [
			'Baekje',
			'Land of the Heavenly Deer',
			'Land of the Lord Buddha',
			'Heavenly Deer'
		]
	},
	{
		id: 'nation-goguryeo',
		name: 'Goguryeo',
		korean: '고구려',
		hanja: '高句麗',
		entity: 'nation',
		kingdom: 'goguryeo',
		born: -37,
		died: 668,
		title: 'Kingdom of Jumong',
		photo: '/nations/goguryeo.jpg',
		photoCredit: 'The Gwanggaeto Stele at Ji’an — erected 414 (Wikimedia Commons)',
		tagline: 'People of Jumong — the Five Tribes that broke the Sui and stalled the Tang.',
		nature: 'High Summit of regional commands; kings who pay tribute for another decade of quiet. After 642, a Supreme Commander and a Grand Herald speak for the 겨레 over a nephew-king — force in place of committee. The common tongue of the age is Goryeo; Yeon alone says Goguryeo, as if the longer name were a wall. Cold marches, sealed capital, will recited until it becomes weather — and the crown that binds the three-legged crow. Yeon hall versus Go hall is the private war under the public one.',
		arc: 'Founded by Jumong the archer under the three-legged crow of the sun — a red kingdom of will that would rather break than bend. Grown under Gwanggaeto into the great power of Northeast Asia, Goryeo spends its final century as the wall between the peninsula and two western empires: it destroys the Sui invasions, turns back Taizong at Ansi, and breaks army after army. What no emperor could do, succession did: after Yeon Gesomun dies his sons turn on each other, and in 668 his eldest guides the Tang army to Pyongyang. A shard of the crown walks north into the millet — and the sentence does not stop.',
		events: [
			{ year: -37, label: 'Founded at Jolbon by Jumong.' },
			{ year: 413, label: 'Gwanggaeto dies; his stele lists his conquests.' },
			{ year: 612, label: 'Destroys the Sui at the Salsu.' },
			{ year: 645, label: 'Turns back Taizong at Ansi.' },
			{ year: 668, label: 'Pyongyang falls to the Silla–Tang alliance.' },
			{ year: 698, label: 'Balhae rises — the sentence kept.' }
		],
		sobriquets: ['Kingdom of Jumong', 'People of Jumong', 'the Five Tribes'],
		aliases: [
			'Goguryeo',
			'Goryeo',
			'고려',
			'Kingdom of Jumong',
			'People of Jumong',
			'the Five Tribes',
			'Five Tribes'
		]
	},
	{
		id: 'nation-tang',
		name: 'Tang',
		korean: '당',
		hanja: '唐',
		entity: 'nation',
		kingdom: 'tang',
		born: 618,
		died: 907,
		title: 'The empire of the west',
		photo: '/nations/tang.jpg',
		photoCredit: 'Giant Wild Goose Pagoda, Chang’an — built 652 for Xuanzang’s scriptures (Wikimedia Commons)',
		tagline: 'The superpower next door — cosmopolitan, insatiable, and very patient.',
		nature: 'An empire that renames ministries around a taboo personal name and ships titled beasts instead of introductions. Investiture, hostages, and protectorates are how it turns allies into furniture.',
		arc: 'The dynasty that made Chang’an the largest city on earth. Under Taizong it subdues the steppe and calls its emperor Khan of Heaven; the one campaign it cannot finish is Goguryeo. Under Gaozong it succeeds at last — and then discovers its ally Silla will not hand over the peninsula it came for.',
		events: [
			{ year: 618, label: 'Founded from the wreck of the Sui.' },
			{ year: 630, label: 'Taizong breaks the Eastern Turks.' },
			{ year: 668, label: 'Takes Pyongyang — and claims the peninsula.' },
			{ year: 676, label: 'Pushed back out of Samhan by Silla.' }
		],
		aliases: ['Tang', 'the Tang']
	},
	{
		id: 'nation-joseon',
		name: 'Joseon',
		korean: '조선',
		hanja: '朝鮮',
		entity: 'nation',
		kingdom: 'joseon',
		born: -2333,
		died: -108,
		bornApprox: true,
		title: 'The first name of the mandate',
		tagline: 'Old Joseon — Asadal’s court, and the word later ages keep borrowing.',
		nature: 'Heaven’s mandate made into a capital: sandalwood, garlic, mugwort, and a king who stays when gods leave. The name outlives the walls — Goryeo and later crowns still answer to it in dream and stele.',
		arc: 'Founded in the mythic age by Dangun, grandson of Heaven. Old Joseon holds the northern plains until betrayal opens Wanggeom to the Han; the Four Commanderies follow. Centuries later Wang Geon raises Goryeo under Goguryeo’s shadow — and the chronicle still hears Joseon in the name of what endures.',
		events: [
			{ year: -2333, label: 'Dangun founds Asadal — so the legend dates it.' },
			{ year: -108, label: 'Wanggeom falls; Old Joseon ends.' },
			{ year: 918, label: 'Wang Geon founds Goryeo — the name’s long echo.' }
		],
		aliases: ['Joseon', 'Old Joseon', 'Gojoseon', '조선']
	},
	{
		id: 'nation-yamato',
		name: 'Yamato',
		korean: '야마토',
		hanja: '大和',
		entity: 'nation',
		kingdom: 'yamato',
		title: 'The eastern court across the strait',
		tagline: 'Rising sun, cherry weather, and sea lanes that learn from the west.',
		nature: 'An island court that watches Samhan the way Samhan watches Tang — close enough to copy, far enough to choose. Hosts princes, sends swords, and measures loyalty in ships.',
		arc: 'Wa / Yamato sits east of Baekje’s teaching and Silla’s ambition. Emperors and princes in this chronicle watch continental fires and decide how much of the blaze to invite home.',
		aliases: ['Yamato', 'Wa', 'the East', '야마토']
	},
	{
		id: 'nation-underworld',
		name: 'Underworld',
		korean: '저승',
		entity: 'nation',
		kingdom: 'underworld',
		title: 'The kingdom of the dead',
		tagline: 'Court, ledger, and borders no living map admits.',
		nature: 'A polity parallel to Samhan: loyalty, minutes, a crow that can scramble a list. King Yumla rules; Kangrim collects.',
		arc: 'Not a metaphor but a kingdom — heaven once tried to arrest its sovereign and left an escort instead. While Surabol and Sabi burn, the underworld keeps time.',
		aliases: ['Underworld', 'the underworld', '저승']
	}
];

/** A distinct hue per profile, used for avatars, chips and the panel accent. */
const COLOR: Record<string, string> = {
	// leads
	chunchu: '#D8258C',
	gesomun: '#d0362f',
	yeonwife: '#c4787a',
	euija: '#e08a2e',
	// silla
	yushin: '#4a8fe0',
	sunduk: '#E8552B',
	jinduk: '#9d7bd0',
	munhee: '#e07fa8',
	munmu: '#3fa9c9',
	bidam: '#7b5cd6',
	gotaso: '#f0a3c0',
	pumsuk: '#5b7fd0',
	inmun: '#6fb0d8',
	alchun: '#8fb3e0',
	jinheung: '#2f6fd4',
	// baekje
	gyebek: '#d9b13a',
	kingmu: '#b8862c',
	seongchung: '#c9a24d',
	pung: '#e6c76a',
	boksin: '#a8781f',
	// goguryeo
	yeongnyu: '#a83b34',
	bojang: '#8f4a44',
	yangmanchun: '#e05a3c',
	namseng: '#c25a4e',
	namgun: '#9e3b32',
	namsan: '#d4776a',
	munduk: '#e0503f',
	// tang
	taizong: '#c97a2e',
	gaozong: '#b8935a',
	wuzetian: '#e879a6',
	west_ambassador: '#b45309',
	east_ambassador: '#6b8cae',
	// gaya
	muryuk: '#9b6fd8',
	gumil: '#6b7f9e',
	mochuk: '#7d8a99',
	// supporting cast
	jukjuk: '#3f9b6e',
	yunchung: '#c9932a',
	gwanchang: '#79b6f2',
	banggul: '#5e9dd8',
	chunbok: '#d4a94e',
	heungsu: '#b98f33',
	dochim: '#a06a28',
	sangji: '#8a6b1f',
	sadaham: '#6fa8ff',
	weizheng: '#9a7b4f',
	xuerengui: '#e8e3d5',
	xueliu: '#c4a484',
	sudingfang: '#d95f4b',
	lishiji: '#4b78c9',
	liurengui: '#4a4a52',
	pangxiaotai: '#c9c9c9',
	saimei: '#f090b0',
	tenji: '#e06a95',
	kuromaro: '#c77ba0',
	takutsu: '#b05575',
	yesikjin: '#a3813d',
	yeomjong: '#8a68c9',
	gusesa: '#b2554a',
	leegaesa: '#96473e',
	northcmd: '#6a8f6e',
	southcmd: '#c46b3a',
	westcmd: '#7a6b8a',
	dosuryu: '#c98578',
	goguard_a: '#b07068',
	goguard_b: '#9a5c55',
	narim: '#5fad6e',
	hyulle: '#6ec4c9',
	golhwa: '#e0783a',
	steam_cavern: '#6ec4c9',
	jungto: '#ad6157',
	shinsung: '#8f7b70',
	yuridora: '#ff9a3d',
	jinpyung: '#5a86d6',
	chunmyung: '#d8a0e8',
	sunhwa: '#eeb8d2',
	kingsung: '#e5b83a',
	dodo: '#7f96b5',
	jumong: '#e8563f',
	onjo: '#f0c04a',
	biryu: '#d8b276',
	hyukgose: '#6f9fe8',
	dangun: '#c9b18f',
	ugeo: '#918878',
	kyunhwon: '#caa53d',
	wanggun: '#d16a5a',
	gyeonggeunchogo: '#eec052',
	gwanggaeto: '#e0442e',
	jomei: '#f2a0bb',
	euljae: '#7f9fd0',
	ladyye: '#d98fa8',
	yuri: '#e07a5f',
	hwarang: '#6f9fe0',
	gumilwife: '#c98fb0',
	queensatek: '#d9b45e',
	eldersatek: '#b8933f',
	elderyunbi: '#7f9b6b',
	ministersatek: '#c2a24a',
	sosuno: '#e8a04a',
	yuhwa: '#8fc4e0',
	geumwa: '#a89a72',
	daeso: '#9b8f6a',
	yomyo: '#a3564a',
	bohee: '#c98fc0',
	haenyeo: '#6fa8a0',
	haemosu: '#7fc4e8',
	yeontabal: '#a97c4a',
	jomigon: '#8f9c8f',
	imja: '#b08d5a',
	courtmaid: '#c9a0a8',
	shaman: '#9f1239',
	suro: '#e0a33c',
	ijinasi: '#c084fc',
	heohwangok: '#d98fa8',
	ibiga: '#7c6cf0',
	jeonggyeon: '#c084fc',
	hwanung: '#a89060',
	ungnyeo: '#c9b18f',
	seolmundae: '#7f9c8b',
	jacheongbi: '#e879a6',
	mundoryeong: '#7dd3fc',
	gameunjang: '#e0a33c',
	baekjuto: '#c084fc',
	socheonguk: '#a16207',
	kangrim: '#5f5f6b',
	sanbangdeok: '#8fb3a8',
	herald: '#8d8d95',
	seohyeon: '#7a8fc4',
	daejoyoung: '#c45a4a',
	jukji: '#6a9e7a',
	haesang: '#c4a35a',
	// relationships
	'rel-gotaso-pumsuk': '#f472b6',
	'rel-chunchu-munhee': '#e07fa8',
	'rel-yushin-sunduk': '#4a8fe0',
	'rel-pumsuk-gumilwife': '#c98fb0',
	'rel-euija-maids': '#c9a0a8',
	'rel-haemosu-yuhwa': '#7fc4e8',
	'rel-jumong-sosuno': '#e8563f',
	'rel-suro-heo': '#e0a33c',
	'rel-ibiga-jeonggyeon': '#a78bfa',
	'rel-hwanung-ungnyeo': '#c9b18f',
	'rel-gesomun-gulgul': '#a3232a',
	gulgul: '#8b3a3a',
	'rel-jacheongbi-mundoryeong': '#e879a6',
	'rel-chunchu-euija': '#D8258C',
	'rel-chunchu-yushin': '#5b7fd0',
	'rel-sunduk-chunmyung': '#E8552B',
	'rel-chunchu-gotaso': '#D8258C',
	'rel-munhee-bohee': '#e07fa8',
	'rel-euija-gyebek': '#e08a2e',
	'rel-jumong-yuhwa': '#e8563f',
	'rel-onjo-sosuno': '#e8a04a',
	'rel-gesomun-chunchu': '#a3232a',
	'rel-hwanung-dangun': '#c9b18f',
	'rel-sunduk-bidam': '#9f1239'
};

export const PROFILES: Person[] = [
	...PEOPLE,
	...CONCEPTS,
	...NATIONS,
	...RELATIONSHIPS,
	...PLACE_PROFILES
];

/** The identifying colour for a profile. */
export function colorOf(p: Person): string {
	return COLOR[p.id] ?? KINGDOMS[p.kingdom].color;
}

/** Native spoken language for subtitle dialogue (Tang → Chinese, Yamato → Japanese). */
export type SpeechLang = 'zh' | 'ja';

export function speechLangOf(p: Person | undefined | null): SpeechLang | null {
	if (!p) return null;
	if (p.kingdom === 'tang') return 'zh';
	if (p.kingdom === 'yamato') return 'ja';
	return null;
}

/** First Hangul syllable for empty avatar previews (falls back to a mid-dot). */
export function hangulInitial(p: Person): string {
	const k = p.korean?.trim();
	if (k) return [...k][0] ?? '·';
	return '·';
}

/** Unpainted cast: a silhouette in the right shape rather than a bare initial. */
const PLACEHOLDER: Record<'m' | 'f', string> = {
	m: '/people/placeholder_m.png',
	f: '/people/placeholder_f.png'
};

/** Three faces for Euija’s household — successive lines rotate by seed. */
const COURT_MAIDS = [
	'/people/maid_1.png',
	'/people/maid_2.png',
	'/people/maid_3.png'
] as const;

/** The relationship chart already carries a gender for everyone it plots. */
const CHART_GENDER = new Map(CHART_NODES.map((n) => [n.id, n.gender]));

/**
 * Which silhouette this profile would stand in, or null when the record is not
 * a body at all — a kingdom, a bond, a place, or an institution like the Bone
 * Rank System. Those keep the initial tile, because a person-shaped shadow
 * would read as a claim the story never makes.
 */
export function genderOf(p: Person): 'm' | 'f' | null {
	if (p.gender) return p.gender;
	const charted = CHART_GENDER.get(p.id);
	if (charted) return charted;
	return p.entity ? null : 'm';
}

function hashPick(seed: string, n: number): number {
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
	return Math.abs(h) % n;
}

/**
 * Active life-stage for a year, or null when the base fields should be used
 * (no stages, or no year context — charts / late profiles).
 */
export function stageOf(p: Person, year: number | null | undefined): PersonStage | null {
	if (year == null || !p.stages?.length) return null;
	let hit: PersonStage | null = null;
	for (const s of p.stages) {
		if (s.from != null && year < s.from) continue;
		if (s.until != null && year >= s.until) continue;
		hit = s;
	}
	return hit;
}

/** Display name at a story year (prince vs king, childhood name vs reign title). */
export function nameOf(p: Person, year?: number | null): string {
	return stageOf(p, year)?.name ?? p.name;
}

export function titleOf(p: Person, year?: number | null): string | undefined {
	return stageOf(p, year)?.title ?? p.title;
}

export function koreanOf(p: Person, year?: number | null): string | undefined {
	return stageOf(p, year)?.korean ?? p.korean;
}

/**
 * The picture to show for a profile: its own portrait if it has been drawn,
 * otherwise the gendered placeholder. Null means fall back to `hangulInitial`.
 * Pass `seed` (e.g. the spoken line) so the court maids cycle faces instead of
 * always showing the same woman. Pass `year` to pick a stage portrait.
 */
export function avatarOf(p: Person, seed?: string, year?: number | null): string | null {
	if (p.id === 'courtmaid') {
		if (!seed) return COURT_MAIDS[0];
		return COURT_MAIDS[hashPick(seed, COURT_MAIDS.length)];
	}
	const staged = stageOf(p, year)?.avatar;
	if (staged) return staged;
	if (p.avatar) return p.avatar;
	const g = genderOf(p);
	return g ? PLACEHOLDER[g] : null;
}

/** True when the art is a gendered stand-in, not a painted likeness. */
export function isPlaceholderArt(src: string | null | undefined): boolean {
	return !!src && (src.includes('/placeholder_m.') || src.includes('/placeholder_f.'));
}

export const byId = new Map(PROFILES.map((p) => [p.id, p]));

/** Longest aliases first, so "King Euija" wins over "Euija". */
const ALIASES: { alias: string; id: string }[] = PROFILES.flatMap((p) =>
	p.aliases.map((alias) => ({ alias, id: p.id }))
).sort((a, b) => b.alias.length - a.alias.length);

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** One regex: any alias, optionally followed by a hardcoded "(42)" to swallow. */
const NAME_RE = new RegExp(
	`\\b(${ALIASES.map((a) => escape(a.alias)).join('|')})\\b(\\s*\\(\\d{1,3}\\))?`,
	'g'
);

const aliasToId = new Map(ALIASES.map((a) => [a.alias, a.id]));

export function ageAt(p: Person, year: number | null): number | null {
	if (p.born == null || year == null) return null;
	const age = year - p.born;
	// don't print ages before birth or long after death
	if (age < 0) return null;
	if (p.died != null && year > p.died + 1) return null;
	return age;
}

function escapeHtml(s: string) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Wrap every known name in the prose with a person trigger, and regenerate the
 * parenthesised age from the person's birth year and the year of this entry.
 * Only text between tags is touched, so markup is never corrupted.
 */
export function linkPeople(html: string, year: number | null): string {
	return html.replace(/(<[^>]*>)|([^<]+)/g, (_m, tag: string, text: string) => {
		if (tag) return tag;
		return text.replace(NAME_RE, (match, alias: string) => {
			const id = aliasToId.get(alias);
			const p = id ? byId.get(id) : undefined;
			if (!p) return match;
			const age = ageAt(p, year);
			const label = age == null ? alias : `${alias} (${age})`;
			return `<button type="button" class="person" data-person="${p.id}">${escapeHtml(label)}</button>`;
		});
	});
}
