/**
 * Cast of the chronicle.
 *
 * Ages shown in the prose are *derived* from `born` and the year of the entry
 * they appear in — the story text no longer carries hardcoded ages.
 * `aliases` are the surface forms that appear in the prose.
 */

import { RELATIONSHIPS } from '$lib/relations';
import { PLACE_PROFILES } from '$lib/places';

export interface LifeEvent {
	year?: number;
	label: string;
}

export type BondKind = 'love' | 'affair' | 'rival' | 'kin' | 'sworn' | 'mentor';

export interface Person {
	id: string;
	name: string; // display name
	korean?: string;
	hanja?: string;
	title?: string; // "King Muyeol of Silla"
	/** 'concept' = institutions/ideas; 'nation' = kingdoms; 'relationship' = an edge; 'place' = map site. */
	entity?: 'concept' | 'nation' | 'relationship' | 'place';
	kingdom: 'silla' | 'baekje' | 'goguryeo' | 'tang' | 'gaya' | 'yamato' | 'tamla' | 'other';
	born?: number; // negative = BCE
	died?: number;
	bornApprox?: boolean;
	main?: boolean; // the three leads
	avatar?: string; // profile picture, e.g. "/people/chunchu.png"
	photo?: string; // real photograph (nations), e.g. "/nations/silla.jpg"
	photoCredit?: string;
	tagline: string; // one line, shown in the hover card
	arc?: string; // character arc, shown in the panel
	events?: LifeEvent[];
	aliases: string[];
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
		icons: 'white horse · blue · moon · love'
	},
	baekje: {
		label: 'Baekje',
		color: '#FFCB51',
		flag: '/flag_baekje.svg',
		icons: 'heavenly door · yellow · stars · loyalty'
	},
	goguryeo: {
		label: 'Goguryeo',
		color: '#C30000',
		flag: '/flag_goguryeo.svg',
		icons: 'three-legged crow · red · sun · will'
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
		title: 'Son of Heaven',
		tagline: 'Crossed the sky every day of his life and stopped the chariot exactly once.',
		events: [
			{ label: 'Sees Yuhwa in the shallows of the Ubal and comes down.' },
			{ label: 'Builds a copper room on the riverbank in an afternoon.' }
		],
		aliases: ['Haemosu']
	},
	{
		id: 'yeontabal',
		name: 'Yeon Tabal',
		korean: '연타발',
		kingdom: 'goguryeo',
		title: 'Chieftain of Jolbon',
		tagline: 'The richest man on the river. Founded a kingdom with a ledger.',
		events: [
			{ label: 'Backs an exiled prince with salt, iron and his daughter.' }
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
		aliases: ['Imja']
	},
	{
		id: 'ibiga',
		name: 'Ibiga',
		korean: '이비가',
		kingdom: 'gaya',
		title: 'Sky god of Gaya',
		tagline: 'Came down to a mountain ridge and could not take his hands back.',
		events: [{ label: 'Touches the Lady of the Right View; two sons are born of that night.' }],
		aliases: ['Ibiga'],
		chart: { x: 40, y: 520 }
	},
	{
		id: 'jeonggyeon',
		name: 'Lady of the Right View',
		korean: '정견모주',
		hanja: '正見母主',
		kingdom: 'gaya',
		title: 'Mountain goddess of Gaya',
		tagline: 'Let heaven kneel on her ridge — and kept him until morning.',
		events: [{ label: 'Mother of Suro and Ijinasi.' }],
		aliases: ['Lady of the Right View', 'Jeonggyeonmoju', 'Jeonggyeon'],
		chart: { x: 220, y: 520 }
	},
	{
		id: 'suro',
		name: 'King Suro',
		korean: '수로왕',
		hanja: '首露王',
		kingdom: 'gaya',
		title: 'Founder of Golden Gaya',
		tagline: 'Came out of the first egg, and walked down to the beach himself.',
		events: [
			{ year: 42, label: 'Hatches from the box of six eggs; founds Golden Gaya.' },
			{ year: 48, label: 'Meets a princess off a red-sailed ship and does not send a servant.' },
			{ label: 'Lets two of his ten sons carry her family name instead of his.' }
		],
		aliases: ['King Suro', 'Suro'],
		chart: { x: 40, y: 640 }
	},
	{
		id: 'heohwangok',
		name: 'Queen Heo',
		korean: '허황옥',
		hanja: '許黃玉',
		kingdom: 'gaya',
		title: 'First queen of Golden Gaya',
		tagline: 'Sailed in from a country nobody had heard of, and kept her own name.',
		events: [
			{ year: 48, label: 'Arrives by sea at sixteen; buries her silk trousers as an offering.' },
			{ label: 'Mother of ten sons; two of them take her surname.' }
		],
		aliases: ['Queen Heo', 'Heo Hwangok'],
		chart: { x: 220, y: 640 }
	},
	{
		id: 'hwanung',
		name: 'Hwanung',
		korean: '환웅',
		hanja: '桓雄',
		kingdom: 'other',
		title: 'Heavenly prince who came down to farm',
		tagline: 'Could not be a king until he had touched the bear-woman’s hand.',
		events: [{ label: 'Marries Ungnyeo under the sacred tree; fathers Dangun.' }],
		aliases: ['Hwanung'],
		chart: { x: 40, y: 760 }
	},
	{
		id: 'ungnyeo',
		name: 'Ungnyeo',
		korean: '웅녀',
		hanja: '熊女',
		kingdom: 'other',
		title: 'The Bear-Woman',
		tagline: 'Twenty-one days of garlic and mugwort — then she waited to be seen.',
		events: [{ label: 'Becomes a woman; stands under the tree until heaven marries her.' }],
		aliases: ['Ungnyeo', 'Bear-Woman', 'the Bear-Woman'],
		chart: { x: 220, y: 760 }
	},
	// ————————————————————————— the three leads —————————————————————————
	{
		id: 'chunchu',
		name: 'Kim Chunchu',
		korean: '김춘추',
		hanja: '金春秋',
		title: 'King Muyeol, 29th of Silla',
		kingdom: 'silla',
		born: 603,
		died: 661,
		main: true,
		tagline: 'The diplomat who traded a kingdom’s independence for its survival.',
		arc: 'Born a royal who could never be king — his father’s rank cost him the Sacred Bone — Chunchu spends his youth as the cleverest man in a room he is not allowed to rule. The murder of his daughter Gotaso at Daeya turns a political animal into a patient one: he walks into Goguryeo and is imprisoned, sails to Yamato and is refused, and finally kneels in Chang’an and gets what he wants. He becomes the first True Bone king of Silla and dies with Baekje destroyed and Goguryeo still standing — having bought unification at the price of inviting the Tang in, the charge his enemies fling at him to the very end.',
		events: [
			{ year: 632, label: 'Passed over for the throne; Dukman is crowned Queen Sunduk.' },
			{ year: 642, label: 'His daughter Gotaso dies at Daeya Fortress. He swears revenge.' },
			{ year: 642, label: 'Goes to Goguryeo for troops; Yeon imprisons him, then lets him go.' },
			{ year: 647, label: 'Survives Bidam’s rebellion at Queen Sunduk’s side.' },
			{ year: 647, label: 'Sails to Yamato to ask for troops. Refused.' },
			{ year: 648, label: 'Wins the Silla–Tang alliance from Emperor Taizong.' },
			{ year: 651, label: 'Founds the Royal Secretariat, ruling around the Harmony Council.' },
			{ year: 654, label: 'Crowned King Muyeol — the first True Bone king.' },
			{ year: 660, label: 'Sabi falls. He makes Euija pour his wine.' },
			{ year: 661, label: 'Dies with the war unfinished.' }
		],
		aliases: ['Prince Chunchu', 'King Muyeol', 'Kim Chunchu', 'Muyeol', 'Chunchu']
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
		tagline: 'The frontier general who butchered a court to save a kingdom — and doomed it.',
		arc: 'A commander of the Eastern march who despises the capital: its tribute, its committees, its willingness to buy another decade with gold. In 642 he answers the court’s plan to kill him by killing all of it — the king, the commanders, hundreds of officials — and rules through a puppet on the throne. For twenty years he is proved right: he breaks Tang army after Tang army, and Taizong dies having failed against him. But he builds nothing that can outlive him. He leaves three sons and no institution, and within a year of his death they are at each other’s throats and the eldest is guiding the Tang army to Pyongyang.',
		events: [
			{ year: 634, label: 'Defies the High Summit at Pyongyang; the court marks him a traitor.' },
			{ year: 642, label: 'Massacres the court, kills King Yeongnyu, enthrones Bojang.' },
			{ year: 642, label: 'Imprisons Kim Chunchu, then releases him at Kim Yushin’s name.' },
			{ year: 645, label: 'Survives Taizong’s invasion; Ansi Fortress holds.' },
			{ year: 662, label: 'Destroys Pang Xiaotai’s army at the Snake River.' },
			{ year: 665, label: 'Dies in his sleep, telling his sons not to fight each other.' }
		],
		aliases: ['Yeon Gesomun', 'Commander Yeon', 'Gesomun', 'Yeon']
	},
	{
		id: 'gulgul',
		name: 'Gulgul',
		korean: '걸걸',
		hanja: '乞乞',
		title: 'Warden of the northern border',
		kingdom: 'goguryeo',
		tagline: 'A Mohe boy Yeon pulled from the snow — and later, Dae Joyoung’s father.',
		arc: 'Yeon finds him young on a northern raid and brings him to Pyongyang. He is raised in the commander’s shadow, then sent back to the cold marches he came from. He appears at court rarely. The border knows him better than the capital does.',
		events: [
			{ label: 'Taken in by Yeon as a boy.' },
			{ label: 'Posted to the northern border.' }
		],
		aliases: ['Gulgul', 'Geolgeol']
	},
	{
		id: 'euija',
		avatar: '/people/buyeo_euija.png',
		name: 'Buyeo Euija',
		korean: '부여의자',
		hanja: '扶餘義慈',
		title: 'King Euija, 31st Eraha of Baekje',
		kingdom: 'baekje',
		born: 600,
		died: 660,
		bornApprox: true,
		main: true,
		tagline: 'The “Zengzi of the East” who won everything, then stopped listening.',
		arc: 'The model crown prince — dutiful enough that the court nicknamed him the Zengzi of the East — who understands earlier than anyone that a kingdom is a story its people agree on. He takes Daeya, humiliates Silla, purges the Great Clans that had ruled his father, and installs his own sons in their seats. Then the story eats him: with no rivals left to check him he seals himself in the palace, exiles the one man who tells him the truth, starves the other in prison, and reads the kingdom’s omens as slander. He dies a prisoner in Chang’an, screaming Chunchu’s name, asking someone in some later century to take his revenge for him.',
		events: [
			{ year: 632, label: 'Crown prince; slips out of the palace and names a nameless boy Gyebek.' },
			{ year: 641, label: 'King Mu dies. Euija takes the throne vowing to finish his war.' },
			{ year: 642, label: 'Takes Daeya Fortress, killing Chunchu’s daughter.' },
			{ year: 642, label: 'Goes in disguise to Goguryeo to bargain with Yeon Gesomun.' },
			{ year: 655, label: 'Purges the Ministers’ Assembly, seating 41 of his own sons.' },
			{ year: 656, label: 'Imprisons Seongchung, who starves to death warning him.' },
			{ year: 659, label: 'The nine omens. He calls them lies.' },
			{ year: 660, label: 'Sabi falls; he is captured at Bear Fortress and shipped to Tang.' },
			{ year: 660, label: 'Dies in Chang’an.' }
		],
		aliases: ['King Euija', 'Prince Euija', 'Buyeo Euija', 'Euija']
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
		tagline: 'Gaya’s last prince, made into Silla’s greatest sword.',
		arc: 'Grandson of the prince who surrendered Golden Gaya, Yushin is a True Bone by grant rather than by blood — and never allowed to forget it. He answers by becoming indispensable: leader of the Hwarang, conqueror of forty fortresses, the one name that makes Yeon Gesomun open a prison door. He marries his sister to Chunchu and his loyalty to Dukman, and outlives almost everyone he swore it to.',
		events: [
			{ year: 632, label: 'Pledges himself to Queen Sunduk “until the end.”' },
			{ year: 642, label: 'Marches on Baekje to avenge Daeya.' },
			{ year: 647, label: 'Puts down Bidam’s rebellion; holds Sunduk as she dies.' },
			{ year: 660, label: 'Faces Gyebek at the Yellow Mountain Fields.' },
			{ year: 673, label: 'Dies, the war against Tang still unwon.' }
		],
		aliases: ['Marshal Yushin', 'Kim Yushin', 'Yushin']
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
		arc: 'Chosen because the Sacred Bone line had run out of men, Dukman rules for fifteen years under a permanent question mark: whether a woman can govern at all. She answers it by outlasting it, and dies in the middle of a rebellion raised on exactly that slogan.',
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
		tagline: 'The last of the Sacred Bone; with her the bloodline ends.',
		events: [
			{ year: 647, label: 'Crowned after Sunduk’s death.' },
			{ year: 654, label: 'Dies; the Sacred Bone line is extinct.' }
		],
		aliases: ['Queen Jinduk', 'Princess Seungman', 'Kim Seungman', 'Jinduk', 'Seungman']
	},
	{
		id: 'munhee',
		name: 'Munhee',
		korean: '문희',
		title: 'Queen Munmyung',
		kingdom: 'silla',
		born: 610,
		died: 681,
		bornApprox: true,
		tagline: 'Yushin’s sister, Chunchu’s wife — mother of the king who finishes it.',
		events: [
			{ year: 632, label: 'A young noblewoman with three small children.' },
			{ year: 676, label: 'Lives to see her son crowned King of Samhan.' }
		],
		aliases: ['Queen Munmyung', 'Munhee']
	},
	{
		id: 'munmu',
		name: 'King Munmu',
		korean: '문무왕',
		hanja: '文武王',
		title: '30th sovereign of Silla',
		kingdom: 'silla',
		born: 626,
		died: 681,
		tagline: 'The son who finished his father’s war — and then threw out the Tang.',
		arc: 'Bupmin inherits a half-won war and the alliance that won it. He spends his reign discovering that the ally is the last enemy, and ends it as the first ruler of a single kingdom of Samhan.',
		events: [
			{ year: 661, label: 'Takes the throne, vowing to unify Samhan.' },
			{ year: 668, label: 'Pyongyang falls; Goguryeo ends.' },
			{ year: 676, label: 'Expels the Tang; becomes King of Samhan.' }
		],
		aliases: ['King Munmu', 'Bupmin', 'Munmu']
	},
	{
		id: 'bidam',
		name: 'Bidam',
		korean: '비담',
		title: 'High Councillor of Silla',
		kingdom: 'silla',
		born: 605,
		died: 647,
		bornApprox: true,
		tagline: 'The Hwarang who gave a boy his headband, and the queen a civil war.',
		arc: 'Bidam’s quarrel is not with women ruling but with Silla ruling itself badly — and with the outsiders, Yushin above all, whom he thinks will sell it. He raises the banner “a woman cannot govern well,” and dies as the queen he rebelled against does.',
		events: [
			{ year: 645, label: 'Named High Councillor.' },
			{ year: 647, label: 'Rebels at the Fortress of Radiance; is destroyed.' }
		],
		aliases: ['Councillor Bidam', 'Bidam']
	},
	{
		id: 'gotaso',
		name: 'Gotaso',
		korean: '고타소',
		kingdom: 'silla',
		born: 625,
		died: 642,
		bornApprox: true,
		tagline: 'A love-obsessed girl of sixteen. Her father would burn kingdoms to bring her home.',
		arc: 'She falls the way teenagers fall — completely, loudly, without a second thought. When she is taken, Chunchu goes quiet. When she marries, she believes in forever. Daeya ends both.',
		events: [
			{ year: 641, label: 'Taken; rescued; marries Pumsuk; moves to Daeya.' },
			{ year: 642, label: 'Dies when Daeya falls.' }
		],
		aliases: ['Princess Gotaso', 'Gotaso']
	},
	{
		id: 'pumsuk',
		name: 'Kim Pumsuk',
		korean: '김품석',
		title: 'Guardian of Daeya Fortress',
		kingdom: 'silla',
		born: 618,
		died: 642,
		bornApprox: true,
		tagline: 'A Surabol noble boy — still startled by a woman who isn’t.',
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
		aliases: ['Alchun']
	},

	// ————————————————————————— supporting cast (researched) —————————————————————————
	{
		id: 'ladyye',
		name: 'Lady Ye',
		korean: '예씨부인',
		kingdom: 'goguryeo',
		tagline: 'Jumong’s first wife, who raised his heir alone in Buyeo.',
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
		arc: 'She has no name in the histories and no rank worth recording, which is precisely the point. A drunk True Bone takes her because he can; her husband opens the gates of Daeya in return. Everything that follows — Gotaso’s death, Chunchu’s revenge, the Tang alliance, the fall of Baekje and Goguryeo — runs back through a woman the system did not consider a person.',
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
		arc: 'While she lived, the most powerful clan in Baekje had the king’s ear through his own mother. Her death in 655 releases Euija — and begins the purge that hollows out his court.',
		events: [{ year: 655, label: 'Dies; Euija enters mourning, and the Satek fear what comes after.' }],
		aliases: ['Queen Satek']
	},
	{
		id: 'eldersatek',
		name: 'Elder Satek',
		korean: '사택 원로',
		kingdom: 'baekje',
		tagline: 'The clan’s memory, and its instinct for survival.',
		aliases: ['Elder Satek']
	},
	{
		id: 'ministersatek',
		name: 'Minister Satek',
		korean: '사택 재상',
		kingdom: 'baekje',
		tagline: 'Prime Minister by clan right, not by merit.',
		aliases: ['Minister Satek']
	},
	{
		id: 'sosuno',
		name: 'Sosuno',
		korean: '소서노',
		kingdom: 'baekje',
		tagline: 'Founded one kingdom with her husband, then walked south and founded another with her sons.',
		arc: 'Daughter of the chieftain Yeon Tabal, she gives Jumong the tribes that make Goguryeo. When his first son arrives from Buyeo and takes the succession, she does not fight for it — she takes Onjo and Biryu south and builds Baekje instead.',
		events: [
			{ year: -37, label: 'Helps Jumong found Goguryeo at Jolbon.' },
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
		aliases: ['Lady Yuhwa', 'Yuhwa']
	},
	{
		id: 'geumwa',
		name: 'King Geumwa',
		korean: '금와왕',
		kingdom: 'other',
		tagline: 'Took in the exiled Yuhwa, and raised the boy who would outgrow his kingdom.',
		aliases: ['King Geumwa', 'Geumwa']
	},
	{
		id: 'daeso',
		name: 'Daeso',
		korean: '대소',
		kingdom: 'other',
		died: 22,
		tagline: 'Geumwa’s son, who could not bear being outshot by a foundling.',
		aliases: ['Daeso']
	},
	{
		id: 'yomyo',
		name: 'Yomyo',
		korean: '요묘',
		kingdom: 'goguryeo',
		tagline: 'The general who opened Pyongyang’s gates alongside the monk Shinsung.',
		events: [{ year: 668, label: 'Opens the fortress gates to the Tang.' }],
		aliases: ['Yomyo']
	},
	{
		id: 'herald',
		name: 'The Herald',
		korean: '전령',
		kingdom: 'other',
		tagline: 'Whoever has to carry the news, and say it out loud.',
		arc: 'Not one person but a role — the rider who reaches Surabol with Daeya’s fall, the man who bursts into Yeon’s quarters, the voice that must tell a king what he does not want to hear.',
		aliases: ['The Herald']
	},
	{
		id: 'goguard_a',
		name: 'Gate Guard',
		korean: '문지기',
		kingdom: 'goguryeo',
		tagline: 'One of the two men outside Yeon’s door — comedy until the blood.',
		aliases: ['Gate Guard', 'Goguryeo guard']
	},
	{
		id: 'goguard_b',
		name: 'Junior Guard',
		korean: '병졸',
		kingdom: 'goguryeo',
		tagline: 'The other man outside the door. Easily surprised.',
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
		tagline: 'The eldest of the three — forest, patience, and the dry remark after Golhwa overreaches.',
		arc: 'Yushin’s steam-cavern comfort is not a shrine; it is three women who already know when he will arrive undressed. Narim is the mature sister: she lets Golhwa tease, steadies Hyullé, and still delivers the advice he actually came for — then leaves before gratitude can become a habit.',
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
		tagline: 'Quiet at the water’s edge — and secretly the one who loves him most.',
		arc: 'She speaks least. When she does, it is almost apology. Of the three she is the shy one, which is why Yushin misses that she watches him longest after the others look away — and why Golhwa teases her for it when he has gone.',
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
		tagline: 'Youngest — heat first, counsel second, never sorry for either.',
		arc: 'She is the forward one: she names the queen to watch him flinch, mocks “Her Majesty” at a naked lake, and asks him to stay as if the war could wait. Under the mockery the counsel is sharp. She wants him in the water with them. She also wants him alive.',
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
		events: [{ year: 660, label: 'Dies at Hwangsanbeol before Gwanchang.' }],
		aliases: ['Bangul', 'Banggul']
	},
	{
		id: 'chunbok',
		name: 'Satek Chunbok',
		korean: '사택천복',
		kingdom: 'baekje',
		tagline: 'The young Satek who chose the king over his clan.',
		aliases: ['Satek Chunbok', 'Chunbok']
	},
	{
		id: 'heungsu',
		name: 'Heungsu',
		korean: '흥수',
		hanja: '興首',
		kingdom: 'baekje',
		tagline: 'The exiled loyalist whose last advice arrived too late.',
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
		tagline: 'The Hwarang ideal: conqueror of Gaya at fifteen, dead of grief at seventeen.',
		events: [
			{ year: 562, label: 'Leads the vanguard that takes Daegaya.' },
			{ year: 564, label: 'Dies mourning his sworn friend Mugwanrang.' }
		],
		aliases: ['Sadaham']
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
		tagline: 'Told a farmer the Son of Heaven was calling — and sent him to history.',
		arc: 'Xue Rengui’s wife. When he meant to rebury his ancestors in quiet poverty, she named the hour: Taizong wanted fierce generals for Liaodong. Without her sentence there is no white coat, no ji, no eastern command.',
		events: [{ year: 644, label: 'Urges Xue Rengui to answer the muster for Liaodong.' }],
		aliases: ['Lady Liu', '柳氏', '유씨']
	},
	{
		id: 'xuerengui',
		name: 'Xue Rengui',
		korean: '설인귀',
		hanja: '薛仁貴',
		kingdom: 'tang',
		born: 614,
		died: 683,
		title: 'White Tiger II',
		tagline: 'Farmer, white armour, fangtian ji — Tang’s unsung eastern blade.',
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
		name: 'Red Fowl',
		korean: '소정방',
		hanja: '蘇定方',
		title: 'The Red Fowl',
		kingdom: 'tang',
		born: 592,
		died: 667,
		tagline: 'The Red Fowl: took three kingdoms’ capitals in one career.',
		arc: 'Breaker of the Western Turks, commander of the 660 seaborne invasion that ended Baekje in a single season. He failed only at Pyongyang — mired in snow at the Sasu while Yeon destroyed the supporting army.',
		events: [
			{ year: 660, label: 'Lands 130,000 men at the Geum estuary; Sabi falls.' },
			{ year: 662, label: 'Winters outside Pyongyang, and withdraws.' }
		],
		aliases: ['Su Dingfang', 'Red Fowl', 'the Red Fowl']
	},
	{
		id: 'lishiji',
		name: 'Blue Dragon',
		korean: '이세적',
		hanja: '李世勣',
		title: 'The Blue Dragon',
		kingdom: 'tang',
		born: 594,
		died: 669,
		tagline: 'The Blue Dragon: the old marshal who finally took Pyongyang.',
		events: [
			{ year: 645, label: 'Takes Liaodong Fortress under the emperor.' },
			{ year: 668, label: 'Commands the final campaign; Pyongyang falls.' }
		],
		aliases: ['Li Shiji', 'Blue Dragon', 'the Blue Dragon']
	},
	{
		id: 'liurengui',
		name: 'Black Tortoise',
		korean: '유인궤',
		hanja: '劉仁軌',
		title: 'The Black Tortoise',
		kingdom: 'tang',
		born: 601,
		died: 685,
		tagline: 'The Black Tortoise: burned four hundred eastern ships at the White River.',
		events: [{ year: 663, label: 'Wins the naval battle of Baekgang.' }],
		aliases: ['Liu Rengui', 'Black Tortoise', 'the Black Tortoise']
	},
	{
		id: 'pangxiaotai',
		name: 'White Tiger',
		korean: '방효태',
		title: 'The White Tiger',
		kingdom: 'tang',
		died: 662,
		tagline: 'The White Tiger, drowned at the Snake River with his thirteen sons.',
		events: [{ year: 662, label: 'His army is annihilated by Yeon at the Sasu.' }],
		aliases: ['Pang Xiaotai', 'White Tiger', 'the White Tiger']
	},
	{
		id: 'saimei',
		name: 'The Eastern Empress',
		korean: '사이메이 천황',
		kingdom: 'yamato',
		born: 594,
		died: 661,
		tagline: 'The empress who mobilised the East for Baekje — and died on the way.',
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
		aliases: ['Takamuko no Kuromaro', 'Kuromaro', 'the eastern scholar', 'The Eastern Scholar']
	},
	{
		id: 'takutsu',
		name: 'Echi no Takutsu',
		korean: '에치노 다쿠쓰',
		kingdom: 'yamato',
		died: 663,
		tagline: 'Died at the White River shouting Kudara’s name.',
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
		events: [{ year: 647, label: 'Rises with Bidam; dies with him.' }],
		aliases: ['Yumjong', 'Yeomjong', 'Yumjang']
	},
	{
		id: 'gusesa',
		name: 'Yeon Gusesa',
		korean: '연구세사',
		kingdom: 'goguryeo',
		tagline: 'Central Commander at the High Summit — Gesomun’s elder kinsman.',
		aliases: ['Yeon Gusesa']
	},
	{
		id: 'leegaesa',
		name: 'Lee Gaesa',
		korean: '이가사',
		kingdom: 'goguryeo',
		tagline: 'The Summit voice that first called Yeon a traitor.',
		aliases: ['Lee Gaesa', 'Commander Lee']
	},
	{
		id: 'dosuryu',
		name: 'Dosuryu',
		korean: '도수류',
		kingdom: 'goguryeo',
		tagline: 'Yeon’s aide, brave enough to ask him why.',
		aliases: ['Dosuryu']
	},
	{
		id: 'jungto',
		name: 'Yeon Jungto',
		korean: '연정토',
		kingdom: 'goguryeo',
		tagline: 'Gesomun’s brother, who took twelve cities over to Silla.',
		events: [{ year: 666, label: 'Surrenders his southern territory to Silla.' }],
		aliases: ['Yeon Jungto', 'Jungto']
	},
	{
		id: 'shinsung',
		name: 'Shinsung',
		korean: '신성',
		kingdom: 'goguryeo',
		tagline: 'The monk who opened Pyongyang’s gates from within.',
		events: [{ year: 668, label: 'Lets the Tang army into the fortress.' }],
		aliases: ['Shinsung']
	},
	{
		id: 'yuridora',
		name: 'Yuri Dora',
		korean: '유리도라',
		kingdom: 'tamla',
		tagline: 'King of the island of oranges, collector of stories and castaways.',
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
		events: [{ year: 632, label: 'Dies; the Council must invent a queen.' }],
		aliases: ['King Jinpyung', 'Jinpyung']
	},
	{
		id: 'chunmyung',
		avatar: '/people/chunmyung.png',
		name: 'Princess Chunmyung',
		korean: '천명공주',
		kingdom: 'silla',
		tagline: 'Gave up her claim, and gave Silla its greatest king instead.',
		events: [{ year: 603, label: 'Mother of Kim Chunchu.' }],
		aliases: ['Princess Chunmyung', 'Chunmyung']
	},
	{
		id: 'sunhwa',
		name: 'Princess Sunhwa',
		korean: '선화공주',
		kingdom: 'silla',
		tagline: 'Married into Baekje — the legend Seodong sang into being.',
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
		arc: 'Born of a sunbeam and a river god’s daughter, hatched from an egg, hunted by his brothers. He fled south, and the river’s creatures bridged the water for him. At Jolbon he founded Goguryeo — every kingdom in this story claims a piece of his shadow.',
		events: [
			{ year: -37, label: 'Founds Goguryeo at Jolbon.' },
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
		events: [{ year: -18, label: 'Founds Baekje at Wiryeseong.' }],
		aliases: ['Onjo']
	},
	{
		id: 'biryu',
		name: 'Biryu',
		korean: '비류',
		kingdom: 'baekje',
		tagline: 'Chose the salt marshes of Michuhol, and regretted it.',
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
		events: [{ year: -57, label: 'Crowned first ruler of Seorabeol.' }],
		aliases: ['Hyukgosé', 'Hyukgose', 'Hyeokgeose']
	},
	{
		id: 'dangun',
		name: 'Dangun',
		korean: '단군',
		hanja: '檀君',
		kingdom: 'other',
		tagline: 'Son of heaven and the bear-woman; first king of the first Joseon.',
		aliases: ['Dangun']
	},
	{
		id: 'ugeo',
		name: 'King Ugeo',
		korean: '우거왕',
		kingdom: 'other',
		died: -108,
		tagline: 'The last king of Old Joseon, betrayed from inside his own walls.',
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
		events: [{ year: 900, label: 'Founds Later Baekje at Wansanju.' }],
		aliases: ['Kyun Hwon']
	},
	{
		id: 'wanggun',
		name: 'Wang Geon',
		korean: '왕건',
		hanja: '王建',
		kingdom: 'goguryeo',
		born: 877,
		died: 943,
		tagline: 'The vision Yeon dies seeing: Goryeo, reborn under another man.',
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
		aliases: ['King Jomei', 'Jomei']
	},
	{
		id: 'euljae',
		name: 'Euljé',
		korean: '을제',
		kingdom: 'silla',
		tagline: 'The High Councillor who steadied Queen Sunduk’s first years.',
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
		tagline: 'A nameless boy given a name, who gave it back at the Yellow Mountain.',
		arc: 'Found half-drowned by a prince and named after a turtle, Gyebek has no clan and therefore no ceiling and no floor — passed over for command, exiled to an island, recalled only when the kingdom is already lost. He hears every sentence at its exact width: he does not catch a joke, cannot read a face, counts what he can count because numbers do not lie to him, and keeps a promise past the point where keeping it makes sense. It is what makes him unbearable at court and unbreakable in a field. He answers with five thousand men against fifty thousand, killing his own family first so that nothing can be used against him.',
		events: [
			{ year: 632, label: 'Named by the crown prince Euija.' },
			{ year: 655, label: 'Exiled to Tamla; five years of stories, and the only place being exactly himself costs nothing.' },
			{ year: 660, label: 'Recalled. Kills his family, marches with 5,000, dies at Hwangsanbeol.' }
		],
		aliases: ['Gyebek']
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
		aliases: ['King Mu', 'Seodong', '서동']
	},
	{
		id: 'seongchung',
		name: 'Seongchung',
		korean: '성충',
		kingdom: 'baekje',
		died: 656,
		tagline: 'Told the king the truth and starved in prison for it.',
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
		aliases: ['King Bojang', 'Bojang']
	},
	{
		id: 'yangmanchun',
		name: 'The Guardian',
		korean: '안시성주',
		title: 'Guardian of Ansi Fortress',
		kingdom: 'goguryeo',
		born: 610,
		bornApprox: true,
		tagline: 'Refused Yeon, refused the Emperor, and held the wall anyway.',
		arc: 'The chronicles never recorded his name; the people of Ansi simply called him the chief. He refuses to bow to the man who butchered the court, flies the old colours over his wall — and then defends that man’s kingdom against the greatest army on earth, handing Taizong the first defeat of his life. Only centuries later did writers give him a name: Yang Manchun.',
		events: [{ year: 645, label: 'Holds Ansi against Taizong through a summer-long siege.' }],
		aliases: ['Commander Yang', 'Yang Manchun', 'the Guardian', 'Guardian']
	},
	{
		id: 'namseng',
		name: 'Yeon Namseng',
		korean: '연남생',
		kingdom: 'goguryeo',
		born: 634,
		died: 679,
		tagline: 'Gesomun’s heir, who lost his brothers and guided the Tang home.',
		events: [
			{ year: 665, label: 'Succeeds his father as Supreme Commander.' },
			{ year: 666, label: 'Ousted by his brothers; defects to the Emperor.' }
		],
		aliases: ['Yeon Namseng', 'Namseng']
	},
	{
		id: 'namgun',
		name: 'Yeon Namgun',
		korean: '연남건',
		kingdom: 'goguryeo',
		born: 637,
		bornApprox: true,
		tagline: 'Took his brother’s title and made the last stand at Pyongyang.',
		events: [{ year: 668, label: 'Defends Pyongyang until the gates are opened from within.' }],
		aliases: ['Yeon Namgun', 'Namgun']
	},
	{
		id: 'namsan',
		name: 'Yeon Namsan',
		korean: '연남산',
		kingdom: 'goguryeo',
		born: 639,
		died: 701,
		tagline: 'The youngest brother, who surrendered the city.',
		aliases: ['Yeon Namsan', 'Namsan']
	},
	{
		id: 'munduk',
		name: 'Ulchi Munduk',
		korean: '을지문덕',
		title: '“The Defender”',
		kingdom: 'goguryeo',
		tagline: 'Drowned a Sui army at the Salsu and wrote its general a poem about it.',
		events: [{ year: 612, label: 'Destroys the Sui host at the Great River.' }],
		aliases: ['Ulchi Munduk', 'Munduk']
	},

	// ————————————————————————— Tang & beyond —————————————————————————
	{
		id: 'taizong',
		avatar: '/people/taizong.png',
		name: 'The Emperor',
		korean: '이세민',
		hanja: '李世民',
		title: 'Emperor of Tang',
		kingdom: 'tang',
		born: 598,
		died: 649,
		tagline: 'Khan of Heaven. Beat everyone except a fortress in Liaodong.',
		arc: 'Murdered his brothers for the throne and then justified it by conquering the known world. Goguryeo is the one page he cannot write: he goes himself, is stopped at Ansi, and dies asking Chunchu to finish it for him.',
		events: [
			{ year: 626, label: 'Kills his brothers at the Xuanwu Gate and takes the throne.' },
			{ year: 645, label: 'Invades Goguryeo in person; is turned back at Ansi.' },
			{ year: 648, label: 'Grants Chunchu the alliance.' },
			{ year: 649, label: 'Dies; given a temple name.' }
		],
		aliases: ['Emperor Taizong', 'Li Shimin', 'Taizong', 'the emperor', 'The Emperor', 'the Emperor']
	},
	{
		id: 'gaozong',
		name: 'Li Zhi',
		korean: '이치',
		hanja: '李治',
		title: 'Emperor Gaozong of Tang',
		kingdom: 'tang',
		born: 628,
		died: 683,
		tagline: 'The younger brother Chunchu found in Chang’an — then the emperor who kept the promise.',
		arc: 'As crown prince he rides and drinks with Kim Chunchu like a man who has finally been allowed a friend outside the palace wall. When his father dies he becomes Gaozong; when Chunchu takes the Silla throne they write as brothers who ended up wearing the same kind of loneliness. He finishes the war Taizong could not — and then discovers his sworn friend’s kingdom will not hand him the peninsula.',
		aliases: [
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

	// ————————————————————————— Gaya —————————————————————————
	{
		id: 'muryuk',
		name: 'Kim Muryuk',
		korean: '김무력',
		kingdom: 'gaya',
		tagline: 'Traded a kingdom for his descendants’ rank. His grandson was Yushin.',
		events: [{ year: 532, label: 'Golden Gaya surrenders to Silla.' }],
		aliases: ['Kim Muryuk', 'Muryuk']
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
		kingdom: 'tamla',
		title: 'The women who work the seafloor of Tamla',
		tagline: 'Do not hold the breath. Push it out with singing.',
		events: [
			{ label: 'Taught an exiled Baekje general to carry water and, badly, to sing.' }
		],
		aliases: ['haenyeo', 'the divers']
	},
	{
		id: 'courtmaid',
		name: 'The Court Maids',
		korean: '궁녀',
		entity: 'concept',
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
		name: 'The Shaman',
		korean: '무당',
		entity: 'concept',
		kingdom: 'baekje',
		title: 'Reader of the nine signs',
		tagline: 'Told Euija what the turtle meant — and did not live to hear him deny it.',
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
		aliases: ['Mun Doryeong']
	},
	{
		id: 'gameunjang',
		name: 'Gameunjang-agi',
		korean: '가믄장아기',
		entity: 'concept',
		kingdom: 'tamla',
		title: 'Goddess of fortune',
		tagline: 'Said she lived on her own luck, and was thrown out of the house for it.',
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
		kingdom: 'tamla',
		title: 'Goddess of farming, of the Songdang shrine',
		tagline: 'Came across the sea, married a hunter, and divorced him over an ox.',
		aliases: ['Baekjuto']
	},
	{
		id: 'socheonguk',
		name: 'Socheon-guk',
		korean: '소천국',
		entity: 'concept',
		kingdom: 'tamla',
		title: 'God of the hunt',
		tagline: 'Ate the plough ox. Then ate somebody else’s.',
		aliases: ['Socheon-guk', 'Socheonguk']
	},
	{
		id: 'gangnim',
		name: 'Gangnim',
		korean: '강림',
		entity: 'concept',
		kingdom: 'tamla',
		title: 'The messenger who comes for you',
		tagline: 'Went down to arrest the King of the Dead and was kept.',
		events: [
			{ label: 'A crow scrambles his list — which is why nobody knows their hour.' }
		],
		aliases: ['Gangnim']
	},
	{
		id: 'sanbangdeok',
		name: 'Sanbangdeok',
		korean: '산방덕',
		entity: 'concept',
		kingdom: 'tamla',
		title: 'The rock-goddess of Sanbang',
		tagline: 'Loved a poor man, was wanted by an official, and went back into the cliff.',
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
		tagline: 'A council that decides by unanimity — and therefore decides very little.',
		arc: 'Silla’s aristocratic assembly, which chooses kings and can veto them. It elevates Dukman in 632 and Chunchu in 654, and its power is exactly what Chunchu spends his reign engineering around: the Royal Secretariat of 651 exists so the king can act without asking it.',
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
		kingdom: 'silla',
		title: 'The Flowering Knights',
		tagline: 'An elite corps of young noblemen, sworn to five principles.',
		arc: 'Silla’s training order for noble youth — part officer academy, part brotherhood, part cult. It produces Yushin, Bidam, Alchun and Pumsuk, which is to say it produces both the man who saves the throne and the man who rebels against it, and the boy who loses Daeya.',
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
		tagline: 'Five blades worn across the back — one for each commandery he replaced.',
		arc: 'After the massacre of 642 Yeon takes a sword for each of the commanders he killed and wears them all. They are the whole argument of his rule in one image: authority is not granted, it is carried.',
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
		entity: 'concept',
		kingdom: 'silla',
		title: 'Chunchu’s instrument of direct rule',
		tagline: 'An office that reports to the king alone — the Harmony Council’s quiet defeat.',
		events: [{ year: 651, label: 'Established by Chunchu.' }],
		aliases: ['Royal Secretariat']
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
		title: 'The kingdom of the sacred bone',
		photo: '/nations/silla.jpg',
		photoCredit: 'Cheomseongdae observatory, Gyeongju — built under Queen Seondeok (Wikimedia Commons)',
		tagline: 'The smallest of the three — and the one left standing.',
		arc: 'Founded, the legend says, when a white horse left an egg under a blue sky before the chiefs of six clans — a kingdom that would keep the moon on its banners and love as its quiet engine. Silla is the furthest from the West, the last to take Buddhism, the most rigid in caste — and the one that learns diplomacy because it cannot win alone. Under Queen Seondeok it survives; under Muyeol and Munmu it allies with the Tang to destroy Baekje and Goguryeo, then turns and expels the Tang itself. It rules the unified peninsula for two and a half more centuries.',
		events: [
			{ year: -57, label: 'Founded at Seorabeol by Hyeokgeose, the legend says.' },
			{ year: 532, label: 'Absorbs Golden Gaya.' },
			{ year: 660, label: 'Destroys Baekje with the Tang.' },
			{ year: 668, label: 'Destroys Goguryeo.' },
			{ year: 676, label: 'Expels the Tang; unifies the peninsula below the Taedong.' },
			{ year: 935, label: 'Ends, absorbed into Goryeo.' }
		],
		aliases: ['Silla']
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
		title: 'The kingdom of a hundred crossings',
		photo: '/nations/baekje.jpg',
		photoCredit: 'Gilt-bronze Incense Burner of Baekje, National Treasure no. 287 (Wikimedia Commons)',
		tagline: 'The most refined of the three — merchant, artist, and teacher of the East.',
		arc: 'Founded by Onjo, a son of Jumong who came south when the throne of Goguryeo went to another brother — settling where a heavenly deer showed the door between earth and the yellow sky, under stars the court would later read for loyalty. Baekje is the kingdom of the sea lanes: it gives the East writing, Buddhism and temple architects, and fights Silla for three centuries over the Han valley. Its court is owned by eight great clans, and its last king breaks the clans only to find he has broken the kingdom. It falls in 660; its restoration army dies at the White River in 663.',
		events: [
			{ year: -18, label: 'Founded at Wiryeseong by Onjo.' },
			{ year: 371, label: 'Geunchogo kills the king of Goguryeo at Pyongyang.' },
			{ year: 538, label: 'Capital moves to Sabi.' },
			{ year: 660, label: 'Sabi falls to the Silla–Tang alliance.' },
			{ year: 663, label: 'The restoration fails at the White River.' }
		],
		aliases: ['Baekje']
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
		title: 'The empire of the north',
		photo: '/nations/goguryeo.jpg',
		photoCredit: 'The Gwanggaeto Stele at Ji’an — erected 414 (Wikimedia Commons)',
		tagline: 'The shield of the peninsula: the kingdom that broke the Sui and stalled the Tang.',
		arc: 'Founded by Jumong the archer under the three-legged crow of the sun — a red kingdom of will that would rather break than bend. Grown under Gwanggaeto into the great power of Northeast Asia, Goguryeo spends its final century as the wall between the peninsula and two western empires: it destroys the Sui invasions, turns back Taizong at Ansi, and breaks army after army. What no emperor could do, succession did: after Yeon Gesomun dies his sons turn on each other, and in 668 his eldest guides the Tang to Pyongyang.',
		events: [
			{ year: -37, label: 'Founded at Jolbon by Jumong.' },
			{ year: 413, label: 'Gwanggaeto dies; his stele lists his conquests.' },
			{ year: 612, label: 'Destroys the Sui at the Salsu.' },
			{ year: 645, label: 'Turns back Taizong at Ansi.' },
			{ year: 668, label: 'Pyongyang falls to the Silla–Tang alliance.' }
		],
		aliases: ['Goguryeo']
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
		arc: 'The dynasty that made Chang’an the largest city on earth. Under Taizong it subdues the steppe and calls its emperor Khan of Heaven; the one campaign it cannot finish is Goguryeo. Under Gaozong it succeeds at last — and then discovers its ally Silla will not hand over the peninsula it came for.',
		events: [
			{ year: 618, label: 'Founded from the wreck of the Sui.' },
			{ year: 630, label: 'Taizong breaks the Eastern Turks.' },
			{ year: 668, label: 'Takes Pyongyang — and claims the peninsula.' },
			{ year: 676, label: 'Pushed back out of Samhan by Silla.' }
		],
		aliases: ['Tang', 'the Tang']
	}
];

/** A distinct hue per profile, used for avatars, chips and the panel accent. */
const COLOR: Record<string, string> = {
	// leads
	chunchu: '#D8258C',
	gesomun: '#d0362f',
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
	gangnim: '#5f5f6b',
	sanbangdeok: '#8fb3a8',
	herald: '#8d8d95',
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

/** First Hangul syllable for empty avatar previews (falls back to a mid-dot). */
export function hangulInitial(p: Person): string {
	const k = p.korean?.trim();
	if (k) return [...k][0] ?? '·';
	return '·';
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
