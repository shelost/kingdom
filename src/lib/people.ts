/**
 * Cast of the chronicle.
 *
 * Ages shown in the prose are *derived* from `born` and the year of the entry
 * they appear in — the story text no longer carries hardcoded ages.
 * `aliases` are the surface forms that appear in the prose.
 */

export interface LifeEvent {
	year: number;
	label: string;
}

export interface Person {
	id: string;
	name: string; // display name
	korean?: string;
	hanja?: string;
	title?: string; // "King Muyeol of Silla"
	/** 'concept' = institutions/ideas; 'nation' = the kingdoms themselves. */
	entity?: 'concept' | 'nation';
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
}

export const KINGDOMS: Record<Person['kingdom'], { label: string; color: string }> = {
	silla: { label: 'Silla', color: '#3E79E4' },
	baekje: { label: 'Baekje', color: '#FFCB51' },
	goguryeo: { label: 'Goguryeo', color: '#C30000' },
	tang: { label: 'Tang', color: '#b45309' },
	gaya: { label: 'Gaya', color: '#8b5cf6' },
	yamato: { label: 'Yamato', color: '#ec4899' },
	tamla: { label: 'Tamla', color: '#f97316' },
	other: { label: '—', color: '#8a8a94' }
};

export const PEOPLE: Person[] = [
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
		id: 'euija',
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
		arc: 'Bupmin inherits a half-won war and the alliance that won it. He spends his reign discovering that the ally is the last enemy, and ends it as the first ruler of a single Korean kingdom.',
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
		tagline: 'Chunchu’s daughter. Her death starts the war that ends three kingdoms.',
		events: [
			{ year: 641, label: 'Marries the Hwarang Pumsuk; moves to Daeya.' },
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
		tagline: 'Given a border fortress for his rank, not his skill.',
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

	// ————————————————————————— Baekje —————————————————————————
	{
		id: 'gyebek',
		name: 'Gyebek',
		korean: '계백',
		hanja: '階伯',
		title: 'General of Baekje',
		kingdom: 'baekje',
		born: 620,
		died: 660,
		bornApprox: true,
		tagline: 'A nameless boy given a name, who gave it back at the Yellow Mountain.',
		arc: 'Found half-drowned by a prince and named after a turtle, Gyebek has no clan and therefore no ceiling and no floor — passed over for command, exiled to an island, recalled only when the kingdom is already lost. He answers with five thousand men against fifty thousand, killing his own family first so that nothing can be used against him.',
		events: [
			{ year: 632, label: 'Named by the crown prince Euija.' },
			{ year: 655, label: 'Exiled to Tamla; spends five years among its people.' },
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
		aliases: ['King Mu']
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
		tagline: 'Twenty years a guest in Japan, then a king with no kingdom.',
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
		name: 'Yang Manchun',
		korean: '양만춘',
		title: 'Guardian of Ansi Fortress',
		kingdom: 'goguryeo',
		born: 610,
		bornApprox: true,
		tagline: 'Refused Yeon, refused the Emperor, and held the wall anyway.',
		arc: 'The chronicles never recorded his name — later ages gave him one. He defies the man who murdered the court and then defends that man’s kingdom against the greatest army in the world, and hands Taizong the first defeat of his life.',
		events: [{ year: 645, label: 'Holds Ansi against Taizong through a summer-long siege.' }],
		aliases: ['Commander Yang', 'Yang Manchun']
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
		name: 'Emperor Taizong',
		korean: '이세민',
		hanja: '李世民',
		title: 'Li Shimin, 2nd Huangdi of Tang',
		kingdom: 'tang',
		born: 598,
		died: 649,
		tagline: 'Khan of Heaven. Beat everyone except a fortress in Liaodong.',
		arc: 'Murdered his brothers for the throne and then justified it by conquering the known world. Goguryeo is the one page he cannot write: he goes himself, is stopped at Ansi, and dies asking Chunchu to finish it for him.',
		events: [
			{ year: 626, label: 'Kills his brothers at the Xuanwu Gate and takes the throne.' },
			{ year: 645, label: 'Invades Goguryeo in person; is turned back at Ansi.' },
			{ year: 648, label: 'Grants Chunchu the alliance.' },
			{ year: 649, label: 'Dies; given the temple name Taizong.' }
		],
		aliases: ['Emperor Taizong', 'Li Shimin', 'Taizong']
	},
	{
		id: 'gaozong',
		name: 'Emperor Gaozong',
		korean: '고종',
		title: '3rd Huangdi of Tang',
		kingdom: 'tang',
		born: 628,
		died: 683,
		tagline: 'Inherited his father’s unfinished war and actually won it.',
		aliases: ['Emperor Gaozong', 'Gaozong']
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
		title: 'The bargain that unified Korea',
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

/** A distinct hue per profile, used for avatars, chips and the panel accent. */
const COLOR: Record<string, string> = {
	// leads
	chunchu: '#e0b64a',
	gesomun: '#d0362f',
	euija: '#e08a2e',
	// silla
	yushin: '#4a8fe0',
	sunduk: '#c98bd8',
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
	mochuk: '#7d8a99'
};

export const PROFILES: Person[] = [...PEOPLE, ...CONCEPTS];

/** The identifying colour for a profile. */
export function colorOf(p: Person): string {
	return COLOR[p.id] ?? KINGDOMS[p.kingdom].color;
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
