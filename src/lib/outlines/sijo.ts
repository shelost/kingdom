import type { Outline } from './types';

export const sijo: Outline = {
	slug: 'sijo',
	title: 'Founders',
	ko: '시조',
	hanja: '始祖',
	shelf: 'China',
	tagline: 'Six dynasties, six founders, one cursed inheritance',
	era: 'Imperial China',
	years: '221 BC – 1644',
	accent: '#3fa07a',
	logline:
		'A jade seal carved for the First Emperor passes from hand to hand for eighteen hundred years. Every man who founds a dynasty must take it, find it or fake it. Each part is a new founder, a new genre and a new kind of luck, and the seal remembers all of them.',
	opening: '“Having received the mandate from Heaven, may he live long and prosper.” It was a lot to carve on a stone that small.',
	altTitles: [
		{ title: 'The Heirloom Seal', ko: '전국옥새', note: 'The object at the centre. Clear and concrete.' },
		{ title: 'Mandate', ko: '천명', note: 'The idea every founder claims. Short and grand.' },
		{ title: 'Received from Heaven', ko: '수명어천', note: 'The first four characters on the seal.' },
		{ title: 'The Chipped Corner', ko: '깨진 모서리', note: 'The flaw every heir inherits. The JoJo birthmark.' },
		{ title: 'Father-in-Law of Three Dynasties', ko: '삼대 국구', note: 'Dugu Xin, and the blood half of the inheritance.' }
	],
	images: [
		{
			src: '/stories/sijo/poster.jpg',
			alt: 'The jade Heirloom Seal in the foreground, six dynasty founders receding behind it in bold standing poses under one shaft of light',
			caption: 'The seal. Six founders, one stone, two thousand years of being passed hand to hand.',
			kind: 'poster'
		},
		{
			src: '/stories/sijo/oath.jpg',
			alt: 'A young wife holds her husband’s face in both hands as he swears by a red candle',
			caption: 'Yang Jian swears to Dugu Qieluo: no son by any other woman. He keeps it longer than anyone expected.',
			year: '566',
			kind: 'romance'
		},
		{
			src: '/stories/sijo/heshibi.jpg',
			alt: 'In a dark hall, the First Emperor raises the newly carved green jade seal over a kneeling minister and an open red box',
			caption: 'Xianyang. The seal is carved from He’s jade and lifted for the first time.',
			year: '221 BC'
		},
		{
			src: '/stories/sijo/dowager.jpg',
			alt: 'The old Dowager Wang hurls the jade seal across a red palace floor, the corner chipping off, as Wang Mang’s envoy cringes',
			caption: 'Chang’an. The old Dowager throws the seal at Wang Mang’s envoy, and a corner breaks off.',
			year: '9 AD'
		},
		{
			src: '/stories/sijo/xuanwu.jpg',
			alt: 'Li Shimin, in armour, draws his bow at the Xuanwu Gate as his brother rides toward him',
			caption: 'Xuanwu Gate. Li Shimin draws on his elder brother. The Dugu blood turns on itself.',
			year: '626',
			episode: 'Xuanwu Gate',
		},
		{
			src: '/stories/sijo/chenqiao.jpg',
			alt: 'Soldiers throw a yellow imperial robe over a sleeping general in a tent at Chenqiao',
			caption: 'Chenqiao. Zhao Kuangyin wakes up hung over, and his officers have dressed him as emperor.',
			year: '960',
			episode: 'Chenqiao',
		}
	],
	synopsis: [
		'A jade so good that a peasant lost both feet trying to prove it. A seal carved from it for the first man who called himself emperor, with eight characters promising heaven’s mandate and a long life. The First Emperor gets eleven years of the first and none of the second.',
		'Founders is a family saga where the family is the throne. Each part has a new founder, born far from it (a hostage, a farmer, a nobleman’s seventh daughter, a hung-over general, a beggar monk, a Jurchen chief’s eighth son) who has to win the mandate and then the seal that proves it. The seal is chipped by a furious old woman in the Han part, mended with gold, lost in a well, stolen, burned with the last Later Tang emperor in 936, and replaced by fakes. A Mongol herdsman finds the Yuan’s version in 1635, and it hands the mandate to the Manchus.',
		'The other inheritance is blood. One northern general, Dugu Xin, has seven daughters. One marries into the Northern Zhou, one becomes the mother of the Tang founder and one founds the Sui with her husband. Three dynasties are cousins. Their sons kill each other at gates and on rivers, and the series stops there to cross over with King for All: Li Shimin at the Xuanwu Gate, and a girl called Wu who will try to found a dynasty of her own.',
		'Like JoJo, every part changes genre. The Qin part is an assassination thriller, the Han a war romance, the Sui–Tang a family melodrama and the Song a heist comedy. The Ming is a rags-to-riches horror story and the Qing a frontier epic that ends in Korea, at Samjeondo, with a Joseon king on his knees.'
	],
	quotes: [
		{
			text: 'Having received the mandate from Heaven, may he live long and prosper.',
			who: 'The Heirloom Seal, inscription by Li Si',
			source: 'Han tradition',
			original: '受命於天 旣壽永昌'
		},
		{
			text: 'I am an old widow of the Han house. I’ll die with this seal. Take it and your clan will be wiped out!',
			who: 'Grand Empress Dowager Wang, before throwing it',
			source: 'Hanshu',
			original: '我漢家老寡婦 旦暮且死 欲與此璽俱葬 終不可得'
		},
		{
			text: 'For an official, Bearer of the Gold Mace. For a wife, Yin Lihua.',
			who: 'Liu Xiu, as a young farmer',
			source: 'Hou Hanshu',
			original: '仕宦當作執金吾 娶妻當得陰麗華'
		},
		{
			text: 'Someone else snoring beside my bed? I cannot sleep.',
			who: 'Zhao Kuangyin, on the southern kingdoms',
			source: 'Xu Zizhi Tongjian Changbian',
			original: '臥榻之側 豈容他人鼾睡'
		},
		{
			text: 'Build high walls, store up grain, and be slow to call yourself king.',
			who: 'Zhu Sheng, advising Zhu Yuanzhang',
			source: 'Mingshi',
			original: '高築牆 廣積糧 緩稱王'
		}
	],
	cast: [
		{
			name: 'Bian He',
			ko: '변화',
			hanja: '卞和',
			epithet: 'The Man Who Lost His Feet',
			life: '8th century BC (legend)',
			side: 'Chu',
			hex: '#7ab89a',
			want: 'For someone to look inside the stone.',
			voice: 'Gentle, obstinate, unbearably sincere.',
			line: '“I am not crying for my feet. I’m crying because they call a jewel a stone.”',
			arc: 'Prologue: presents raw jade to three kings; loses a foot to each of the first two; the third cuts it open.'
		},
		{
			name: 'Ying Zheng',
			lead: true,
			ko: '영정',
			hanja: '嬴政',
			epithet: 'The First Emperor',
			life: '259–210 BC',
			side: 'Qin',
			hex: '#1a1a1a',
			want: 'To end the wars, to end the old names, and not to die.',
			voice: 'Cold, exact, sudden flashes of a hostage boy’s fear. Speaks in decrees.',
			line: '“I am the first. The ones after me will be counted.”',
			arc: 'Hostage child, boy king, the man around the pillar, the unifier, the seeker of immortality, a corpse hidden under salted fish.'
		},
		{
			name: 'Li Si',
			ko: '이사',
			hanja: '李斯',
			epithet: 'The Granary Rat',
			life: 'c. 280–208 BC',
			side: 'Qin',
			hex: '#5a5a7a',
			want: 'To be the rat in the granary, not the one in the latrine.',
			voice: 'Brilliant, frightened, rationalising.',
			line: '“A man’s worth is where he stands. I chose the granary.”',
			arc: 'Writes the seal, the script and the book-burning; forges the will; is cut in half in the market.'
		},
		{
			name: 'Jing Ke',
			ko: '형가',
			hanja: '荊軻',
			epithet: 'The Assassin at the Yi',
			life: '?–227 BC',
			side: 'Yan',
			hex: '#7a9ab8',
			want: 'One clean act.',
			voice: 'Laconic, wine and music, a little vain.',
			line: '“The wind is cold on the Yi. A brave man leaves and does not come back.”',
			arc: 'Carries a map with a dagger rolled inside. Chases the king round a pillar.'
		},
		{
			name: 'Wang Zhengjun',
			ko: '왕정군',
			hanja: '王政君',
			epithet: 'The Old Widow of Han',
			life: '71 BC–13 AD',
			side: 'Han',
			hex: '#a65a4a',
			want: 'For her family to be safe and the Han to last. She finds out these are different wishes.',
			voice: 'Old, imperious, finally furious.',
			line: '“Here. Take it to him. Tell him an old woman broke it.”',
			arc: 'Empress for sixty years who raises her nephew Wang Mang, then throws the seal at his messenger.'
		},
		{
			name: 'Liu Xiu',
			lead: true,
			ko: '유수',
			hanja: '劉秀',
			epithet: 'Emperor Guangwu, the Restorer',
			life: '5 BC–57 AD',
			side: 'Han',
			hex: '#c9a24a',
			want: 'A farm, a good marriage and his brother not to get them all killed. Then the empire.',
			voice: 'Mild, cautious, warm, a farmer’s jokes. His men say he’s scared of everything except battle.',
			line: '“I was going to sell grain this year. Fine. Bring me a horse.”',
			arc: 'Farmer, reluctant rebel, the meteor at Kunyang, widower of his brother, emperor who marries for love on the second try.'
		},
		{
			name: 'Yin Lihua',
			ko: '음여화',
			hanja: '陰麗華',
			epithet: 'The Wife He Wanted',
			life: '5–64 AD',
			side: 'Han',
			hex: '#d48aa0',
			want: 'Him, and not to be the reason he loses.',
			voice: 'Gentle, wry, steady.',
			line: '“You wanted me before you wanted the world. I’ll wait my turn.”',
			arc: 'The girl he named at twenty; married, set aside for a political bride, empress at last.'
		},
		{
			name: 'Dugu Xin',
			ko: '독고신',
			hanja: '獨孤信',
			epithet: 'Father-in-Law of Three Dynasties',
			life: '503–557',
			side: 'Western Wei',
			hex: '#3fa07a',
			want: 'His daughters married well, and his hat on straight.',
			voice: 'Handsome, vain, jovial.',
			line: '“They tilt their hats like me now? Good. Let them copy my daughters’ husbands next.”',
			arc: 'The most handsome general in the north, forced to suicide; his seven daughters become the bloodline.'
		},
		{
			name: 'Dugu Qieluo',
			ko: '독고가라',
			hanja: '獨孤伽羅',
			epithet: 'The Second Sage',
			life: '544–602',
			side: 'Sui',
			hex: '#8ab8a0',
			want: 'One husband, no concubines, and an empire run properly.',
			voice: 'Sharp, moral, possessive, utterly sure.',
			line: '“Swear it. No other woman’s son. Not one.”',
			arc: 'Seventh daughter; makes her husband swear monogamy; co-rules the Sui; picks the wrong son.'
		},
		{
			name: 'Yang Jian',
			lead: true,
			ko: '양견',
			hanja: '楊堅',
			epithet: 'Emperor Wen of Sui',
			life: '541–604',
			side: 'Sui',
			hex: '#c46a2a',
			want: 'To reunite China, and not to be found out by his wife.',
			voice: 'Frugal, suspicious, henpecked and proud of it.',
			line: '“I am the Son of Heaven, and I am not free.”',
			arc: 'Northern Zhou regent, founder of the Sui, reunifier, dies with the wrong heir in the next room.'
		},
		{
			name: 'Li Shimin',
			lead: true,
			ko: '이세민',
			hanja: '李世民',
			epithet: 'Taizong of Tang (crossover)',
			life: '598–649',
			side: 'Tang',
			hex: '#d9a72a',
			portrait: '/ch_taizong.png',
			want: 'To be the son who founded it, not the second son.',
			voice: 'See King for All. Here, young, hot, a brilliant cavalry general who shoots first.',
			line: '“Brother. You should have stayed in bed.”',
			arc: 'Second son, true founder, kills two brothers at a gate. His later life is in King for All.'
		},
		{
			name: 'Wu Zhao',
			ko: '무조',
			hanja: '武曌',
			epithet: 'The Only Empress (crossover)',
			life: '624–705',
			side: 'Tang, then Zhou',
			hex: '#7a2a8a',
			portrait: '/ch_wu_zetian.png',
			want: 'To found a dynasty of her own.',
			voice: 'See King for All.',
			line: '“A whip, an iron mace and a dagger. If the horse won’t obey the first two, I cut its throat.”',
			arc: 'Cameo: the girl in Taizong’s stables who tames the lion horse. The only woman to found a dynasty. Not the subject of a part; the exception the seal can’t explain.'
		},
		{
			name: 'Zhao Kuangyin',
			ko: '조광윤',
			hanja: '趙匡胤',
			epithet: 'Emperor Taizu of Song',
			life: '927–976',
			side: 'Song',
			hex: '#d9c06a',
			want: 'To stop the coups, starting with his own.',
			voice: 'Jovial, a soldier’s drinking voice, cunning under the jokes.',
			line: '“Gentlemen. Have a drink. Let’s talk about your pensions.”',
			arc: 'Palace guard, the man in the yellow robe, the host who disarms his generals at dinner, dies by candle-shadow.'
		},
		{
			name: 'Zhao Guangyi',
			ko: '조광의',
			hanja: '趙光義',
			epithet: 'The Brother with the Axe',
			life: '939–997',
			side: 'Song',
			hex: '#8a7a3a',
			want: 'His brother’s chair.',
			voice: 'Patient, polite, blank.',
			line: '“Mother made him promise. I just reminded him.”',
			arc: 'Arranges the robe at Chenqiao, inherits the throne under suspicion.'
		},
		{
			name: 'Zhu Yuanzhang',
			lead: true,
			ko: '주원장',
			hanja: '朱元璋',
			epithet: 'The Hongwu Emperor',
			life: '1328–1398',
			side: 'Ming',
			hex: '#c41e1e',
			want: 'Never to be hungry again, and for nobody to look down on him.',
			voice: 'Coarse peasant wit, sudden rage, sincere tears for the poor. Never forgets a slight.',
			line: '“I buried my parents with no coffin. Now tell me again about your noble ancestors.”',
			arc: 'Orphan, beggar monk, rebel, the victor of Poyang Lake, the founder who kills his founders.'
		},
		{
			name: 'Empress Ma',
			ko: '마황후',
			hanja: '馬皇后',
			epithet: 'Big Feet Ma',
			life: '1332–1382',
			side: 'Ming',
			hex: '#d4a07a',
			want: 'For her husband to stay human.',
			voice: 'Plain, warm, brave, teases him.',
			line: '“You were a beggar. I fed you through the bars. Eat.”',
			arc: 'Smuggles him hot cakes in her shirt when he is jailed; restrains him for thirty years; after her death no one can.'
		},
		{
			name: 'Hong Taiji',
			ko: '홍타이지',
			hanja: '皇太極',
			epithet: 'Emperor Taizong of Qing',
			life: '1592–1643',
			side: 'Later Jin, then Qing',
			hex: '#3a5a9a',
			want: 'To turn his father’s raiding confederation into an empire with a name and a seal.',
			voice: 'Shrewd, bilingual, patient, likes Chinese books and Mongol horses.',
			line: '“The Yuan’s seal came to me from the steppe. Ask heaven why.”',
			arc: 'Eighth son of Nurhaci, renames the Jurchen as Manchu, receives the Yuan seal, proclaims Qing, invades Joseon.'
		}
	],
	returning: [
		{
			title: 'The seal',
			body: [
				'A character with no lines. Every part opens on it, with whoever holds it. It is chipped in the Han part and patched in gold; that gold patch is the series birthmark. Founders who never touch it (Zhao Kuangyin, Zhu Yuanzhang) are haunted by its absence.'
			]
		},
		{
			title: 'The narrator',
			body: [
				'The house storyteller, watching from above as he does in Samhan. He finds the mandate of heaven funny, since he is heaven, more or less. He has favourites (Liu Xiu, Empress Ma) and says so.'
			]
		},
		{
			title: 'Crossovers',
			body: [
				'Li Shimin and Wu Zhao come in from King for All with their portraits and voices. Liu Bang’s part is told in A Match for Ten Thousand; here he only receives the seal. Hong Taiji’s invasion of Joseon ties the last part back to the peninsula.'
			]
		}
	],
	bonds: [
		{
			a: 'Ying Zheng',
			b: 'Jing Ke',
			kind: 'The pillar',
			body: 'One short, perfect thriller scene. The map is unrolled, the dagger appears, the king’s sleeve tears, and they run round a pillar while the court watches unarmed. A doctor throws his medicine bag. The king finally remembers to draw the sword on his back.'
		},
		{
			a: 'Wang Zhengjun',
			b: 'Wang Mang',
			kind: 'Aunt and nephew',
			body: 'She raised him and promoted him. He was the most virtuous man at court. When he takes the throne, she understands she has been the instrument, and throws the only thing she still owns.'
		},
		{
			a: 'Liu Xiu',
			b: 'Yin Lihua',
			kind: 'The wife he named',
			body: 'A farm boy says out loud whom he wants to marry. He marries her, then must take a political bride to win the north, and Yin Lihua steps aside. Seventeen years later he makes her empress. The gentlest romance in the series.'
		},
		{
			a: 'Dugu Qieluo',
			b: 'Yang Jian',
			kind: 'The vow',
			body: 'He swears no other woman will bear his children. She rules beside him, and once kills a girl he slept with. He rides off alone into the mountains and an official has to talk him back. They are a real partnership and a real cage.'
		},
		{
			a: 'Zhu Yuanzhang',
			b: 'Empress Ma',
			kind: 'Hot cakes',
			body: 'When he is jailed as a young rebel, she burns her skin smuggling him hot cakes in her shirt. For thirty years she is the only person who can say no to him. When she dies, he stops listening to anyone, and the purges begin.'
		}
	],
	parts: [
		{
			id: 'stone',
			title: 'Prologue: He’s Jade',
			ko: '프롤로그: 화씨벽',
			years: '8th century BC (legend)',
			summary: 'The stone before the seal. A peasant who knew what was inside.',
			episodes: [
				{
					title: 'Three Kings',
					ko: '세 왕',
					year: 'legend',
					hook: 'Bian He brought a stone to the king, and the king cut off his left foot.',
					beats: [
						'A peasant of Chu finds raw jade in the hills and brings it to the king. The jeweller says: a stone. The king cuts off his left foot for lying.',
						'The next king: the same stone, the same jeweller, the right foot.',
						'Under the third king he sits at the foot of the hill weeping blood.',
						'The king has the stone cut. Inside is the most beautiful jade in the world.'
					],
					next: 'Five hundred years later, an emperor wants something to sign with…!'
				}
			]
		},
		{
			id: 'qin',
			title: 'Part I: The First',
			ko: '1부: 처음',
			years: '259–207 BC',
			summary: 'Thriller. A hostage boy becomes the first emperor, survives an assassin and carves the seal. He wants to live for ever and dies on the road.',
			episodes: [
				{
					title: 'Hostage',
					ko: '인질',
					year: '259–247 BC',
					hook: 'Ying Zheng was born a hostage, in the enemy’s capital, to a father who wasn’t there.',
					beats: [
						'Born in Handan, where his father is a hostage of Zhao. A merchant, Lü Buwei, has bought his father’s future.',
						'When Qin besieges Handan, the Zhao people want to kill the boy. His mother hides him.',
						'At thirteen he is king of Qin. Lü Buwei is regent, and his mother’s lover runs the palace.',
						'He learns to say nothing.'
					],
					next: 'At twenty-one he puts on the cap of manhood. Somebody tries a coup that same week…!'
				},
				{
					title: 'The Pillar',
					ko: '기둥',
					year: '227 BC',
					hook: 'The map was rolled very carefully, and the dagger was at the end of it.',
					beats: [
						'Jing Ke of Yan comes to present a map and a traitor’s head. At the Yi River his friend plays the zither: the wind is cold, a brave man does not return.',
						'In the hall, the map unrolls. Jing Ke grabs the king’s sleeve; it tears.',
						'Nobody in court may carry a weapon. The king runs round a pillar; his sword is too long to draw.',
						'Someone shouts “on your back!” He draws it over his shoulder and cuts Jing Ke down.'
					],
					death: 'Jing Ke',
					next: 'Six kingdoms fall in ten years. He needs a new word for himself…!'
				},
				{
					title: 'Received from Heaven',
					ko: '수명어천',
					year: '221 BC',
					hook: 'King was not big enough, so he invented emperor, and then he needed a seal.',
					beats: [
						'Qin unites the world. He takes the title huangdi and calls himself the First, so his heirs will be the second, the third, the ten-thousandth.',
						'He’s Jade, captured from Zhao, is carved into a seal. Li Si writes eight characters in his new script.',
						'Received the mandate from Heaven: may he live long and prosper.',
						'Plant: he reads the second half twice.'
					],
					next: 'The second half is harder…!'
				},
				{
					title: 'Salted Fish',
					ko: '절인 생선',
					year: '210–207 BC',
					hook: 'The First Emperor died in a carriage, and they piled fish around it so nobody would notice.',
					beats: [
						'Alchemists, islands of immortals, mercury pills. He tours the empire to be seen alive.',
						'He dies on the road. Li Si and the eunuch Zhao Gao hide it, forge his will and kill the heir.',
						'The carriage stinks in the summer heat; they cover it with salted fish.',
						'Zhao Gao brings a deer to court and calls it a horse. The ministers who say “deer” disappear. The last Qin king kills Zhao Gao and surrenders the seal to Liu Bang with a cord round his neck.'
					],
					death: 'Ying Zheng',
					next: 'The seal belongs to the Han for two hundred years, and then to an old woman…!'
				}
			]
		},
		{
			id: 'han',
			title: 'Part II: The Restorer',
			ko: '2부: 중흥',
			years: '9–57 AD',
			summary: 'War romance. The seal is broken by a widow, the Han falls to a saint, and a farmer who only wanted a wife wins it back.',
			episodes: [
				{
					title: 'The Chipped Corner',
					ko: '깨진 모서리',
					year: '9 AD',
					hook: 'The old Dowager Wang was very fond of her nephew, until he asked for the seal.',
					beats: [
						'Wang Mang is everything a Confucian minister should be: modest, generous, learned. He becomes regent, then acting emperor, then wants the real thing.',
						'He sends his cousin to ask the Grand Empress Dowager for the seal.',
						'She curses them both and throws it on the floor. A corner breaks off.',
						'Wang Mang has it mended with gold. The series birthmark.'
					],
					next: 'Wang Mang founds the Xin, the New. Nothing works…!'
				},
				{
					title: 'Yin Lihua',
					ko: '음여화',
					year: '22 AD',
					hook: 'Liu Xiu had two dreams: to be the officer with the gold mace, and to marry Yin Lihua.',
					beats: [
						'A distant Han cousin, he farms in Nanyang. His elder brother Liu Yan wants to restore the dynasty; Liu Xiu wants to sell grain.',
						'Famine, the Red Eyebrows, rebels everywhere. His brother rises. Liu Xiu rides out on an ox because he can’t afford a horse.',
						'The neighbours: “Even the careful one has joined. It must be serious.”',
						'He says her name out loud for the first time, to his friends.'
					],
					next: 'At Kunyang, Wang Mang sends four hundred thousand men and some tigers…!'
				},
				{
					title: 'Kunyang',
					ko: '곤양',
					year: '23 AD',
					hook: 'Wang Mang brought a giant and trained tigers to Kunyang. Liu Xiu brought three thousand men and a meteor.',
					beats: [
						'Trapped in a small town by a huge army with war animals. Liu Xiu slips out at night to fetch help.',
						'He comes back with three thousand and charges the centre.',
						'A meteor falls on the enemy camp; a storm sets the tigers loose. The river fills with Wang Mang’s soldiers.',
						'Wang Mang is killed in his palace later that year. The seal is cut from his belt.'
					],
					next: 'His brother has become too famous…!'
				},
				{
					title: 'Mourning Without Tears',
					ko: '울지 않는 상주',
					year: '23–36 AD',
					hook: 'The new emperor killed Liu Xiu’s brother, and Liu Xiu went to apologise.',
					beats: [
						'The rebel emperor Liu Xuan has Liu Yan executed out of jealousy.',
						'Liu Xiu rides straight to court, apologises for his brother, refuses to wear mourning and laughs at dinner. At night he weeps into his pillow.',
						'He marries Yin Lihua and is sent north, where he must marry Guo Shengtong, niece of a warlord, for an army.',
						'Twelve years of war. He takes the seal and the throne, and reunites the Han.'
					],
					death: 'Liu Yan',
					next: 'There are two wives and one empress’s chair…!'
				},
				{
					title: 'The Empress Chair',
					ko: '황후의 자리',
					year: '41–57 AD',
					hook: 'He gave the empress’s seal to the political wife, and kept the other one.',
					beats: [
						'Yin Lihua refuses to be empress first: Guo has a son and an army behind her.',
						'Seventeen years later, he deposes Guo, gently, and crowns Yin Lihua.',
						'He dies the restorer of the Han, having made very few enemies.',
						'Kangrim: “Were you an emperor, or a farmer who got lucky?” “Both. Please write farmer first.”'
					],
					death: 'Liu Xiu',
					next: 'Four hundred years later, in the north, a general has seven daughters…!'
				}
			]
		},
		{
			id: 'dugu',
			title: 'Part III: Seven Daughters',
			ko: '3부: 일곱 딸',
			years: '557–626',
			summary: 'Family melodrama. One father, three dynasties of in-laws. The seal passes between cousins and the blood starts killing itself.',
			episodes: [
				{
					title: 'The Tilted Hat',
					ko: '삐뚤어진 모자',
					year: '540s–557',
					hook: 'Dugu Xin came back from hunting with his hat tilted, and the next day every man in the city tilted his.',
					beats: [
						'The most handsome man in the northern army, a Xianbei-Chinese general. The tilted hat is history.',
						'He marries his daughters to the rising families: the eldest to the future Zhou emperor, the fourth to Li Bing, the seventh, Qieluo, to Yang Jian.',
						'A regent turns on him; he is forced to kill himself.',
						'The seven daughters at the funeral. The narrator counts the future emperors in the room and stops at five.'
					],
					death: 'Dugu Xin',
					next: 'The seventh daughter has a condition for her husband…!'
				},
				{
					title: 'No Other Woman',
					ko: '다른 여자는 없다',
					year: '581–589',
					hook: 'Dugu Qieluo made her husband swear never to have a child by another woman, and then made him emperor.',
					beats: [
						'Yang Jian is regent for a child emperor, his grandson by marriage. Qieluo: “You’re riding a tiger. You can’t get off.”',
						'He takes the throne as Sui. The seal passes. She sits beside him at court; they call them the Two Sages.',
						'He reunites China after three centuries by crossing the Yangtze.',
						'He sleeps with one palace girl. Qieluo has her killed. He rides into the hills alone, crying, “I am the Son of Heaven and I am not free.”'
					],
					next: 'Two sons, one heir. She picks the frugal one…!'
				},
				{
					title: 'The Frugal Son',
					ko: '검소한 아들',
					year: '600–604',
					hook: 'Yang Guang had only one wife and broken zithers covered in dust, and his mother believed every bit of it.',
					beats: [
						'The crown prince has concubines. The second son, Yang Guang, hides his and keeps old instruments with snapped strings.',
						'Qieluo has the heir deposed. Yang Guang becomes crown prince.',
						'She dies. Yang Jian falls ill. The new heir’s behaviour changes the day his mother is buried.',
						'Yang Jian dies with his son in the next room. The record is careful not to say how.'
					],
					death: 'Yang Jian',
					next: 'Yang Guang becomes the Sui’s second emperor, and its last. His cousin is watching…!'
				},
				{
					title: 'Cousins',
					ko: '사촌',
					year: '617–618',
					hook: 'Li Yuan’s mother was a Dugu sister. So was the dead emperor’s.',
					beats: [
						'Emperor Yang’s three failed wars against Goguryeo bleed the empire (crossover: the Salsu River, told from the losing side).',
						'Li Yuan, his cousin, rises at Taiyuan, pushed by his second son, Li Shimin.',
						'Emperor Yang is strangled in Jiangdu. Li Yuan founds the Tang and takes the seal.',
						'The Dugu blood now sits on its third throne.'
					],
					death: 'Emperor Yang',
					next: 'Li Shimin won the war. His elder brother is the heir…!'
				},
				{
					title: 'Xuanwu Gate',
					ko: '현무문',
					year: '626',
					hook: 'Li Shimin got to the gate first, which in that family was always the whole game.',
					beats: [
						'The crown prince and the third brother plot to kill Shimin. He hears of it.',
						'At dawn he waits inside the Xuanwu Gate. His brothers ride in. He shoots the crown prince himself.',
						'The old emperor is boating on a lake when the news comes. Within three days he abdicates.',
						'Crossover: the stable scene in King for All. A teenage girl named Wu tells Taizong how she would tame the lion horse.'
					],
					death: 'Li Jiancheng',
					next: 'The Tang lasts three hundred years. The seal outlasts it by a little…!'
				}
			]
		},
		{
			id: 'song',
			title: 'Part IV: The Yellow Robe',
			ko: '4부: 황포',
			years: '936–976',
			summary: 'Heist comedy. The seal is burned, a general is crowned while hung over, and his generals are retired over drinks.',
			episodes: [
				{
					title: 'The Tower',
					ko: '누각',
					year: '936',
					hook: 'The last Later Tang emperor climbed a tower with his family and the seal, and set it on fire.',
					beats: [
						'Fifty years, five dynasties, ten kingdoms. Every general is an emperor-in-waiting.',
						'Besieged in Luoyang, Li Congke climbs the Xuanwu tower with the seal and burns it.',
						'The seal is never seen again. The narrator: there will be several more of it.',
						'Plant: from now on every founder gets the mandate without the stone.'
					],
					next: 'At Chenqiao, a general goes to bed early…!'
				},
				{
					title: 'Chenqiao',
					ko: '진교',
					year: '960',
					hook: 'Zhao Kuangyin went to sleep a general and woke up in a yellow robe.',
					beats: [
						'The Later Zhou emperor is seven. The palace guard commander, Zhao Kuangyin, is sent north against the Khitan.',
						'At Chenqiao post station, the officers wake him and throw an emperor’s yellow robe over him. He is shocked. He may also have known.',
						'His brother Guangyi and his secretary Zhao Pu have arranged everything.',
						'He marches back; nobody in the capital is hurt; the boy emperor is pensioned.'
					],
					next: 'He knows exactly how he got the throne. So do his generals…!'
				},
				{
					title: 'A Cup of Wine',
					ko: '배주석병권',
					year: '961',
					hook: 'The emperor invited his generals to a drinking party and took away their armies.',
					beats: [
						'He sighs over wine: “Being emperor is worse than being a general. I can’t sleep.”',
						'Why? “Suppose your officers put a yellow robe on you.” The generals fall on their knees.',
						'His suggestion: retire rich. Buy land, raise singers, marry your children into my family.',
						'They resign the next morning. The Song will be a civil state; the narrator says so with a wince, thinking of the steppe.'
					],
					next: 'Someone else is snoring beside his bed…!'
				},
				{
					title: 'Candle Shadow',
					ko: '촉영부성',
					year: '976',
					hook: 'That night the servants saw the brothers’ shadows on the paper screen, and heard an axe.',
					beats: [
						'He reunites most of China kingdom by kingdom: “Who can sleep with someone else snoring beside the bed?”',
						'A snowy night. He drinks with Guangyi alone. Shadows; the sound of an axe striking something.',
						'By morning he is dead. Guangyi, not his son, is emperor.',
						'Kangrim: “Were you the man in the yellow robe, or the man who put it on?”'
					],
					death: 'Zhao Kuangyin',
					next: 'Four centuries later, a beggar monk is looking for the seal in the Gobi…!'
				}
			]
		},
		{
			id: 'ming',
			title: 'Part V: The Beggar',
			ko: '5부: 거지',
			years: '1344–1398',
			summary: 'Rags-to-riches turning to horror. The most humble founder in Chinese history kills almost everyone who helped him.',
			episodes: [
				{
					title: 'No Coffin',
					ko: '관 없이',
					year: '1344',
					hook: 'Zhu Chongba buried his father, mother and brother in one month, in their clothes.',
					beats: [
						'Plague and famine. The landlord won’t give the family a grave plot; a neighbour does.',
						'He enters a monastery to eat, and is sent out to beg within weeks.',
						'Three years on the roads of Huai. He learns the rebels’ songs: the Maitreya Buddha is coming, the Red Turbans will rise.',
						'Plant: he remembers the landlord’s face.'
					],
					next: 'A letter from a friend: join the Red Turbans…!'
				},
				{
					title: 'Hot Cakes',
					ko: '뜨거운 떡',
					year: '1352–1355',
					hook: 'When Zhu Yuanzhang was locked up and starving, Miss Ma brought him hot cakes inside her shirt.',
					beats: [
						'He joins Guo Zixing’s rebels, rises fast, marries Guo’s adopted daughter Ma.',
						'Accused of plotting, he is jailed without food. She smuggles cakes against her skin and burns herself.',
						'He renames himself Yuanzhang, “the sceptre that kills the Yuan”.',
						'He takes Nanjing.'
					],
					next: 'Chen Youliang has the biggest ships in the world…!'
				},
				{
					title: 'Poyang Lake',
					ko: '파양호',
					year: '1363',
					hook: 'Chen Youliang’s ships were three storeys high, so Zhu Yuanzhang set fire to the wind.',
					beats: [
						'The largest naval battle of the age, on a lake. Chen’s tower ships are chained together.',
						'Fire boats drift down on the wind. Zhu’s flagship runs aground and is nearly taken.',
						'Chen is killed by an arrow through the eye looking out of a porthole.',
						'Zhu founds the Ming in 1368 and drives the Yuan north. The Mongols take their seal with them.'
					],
					death: 'Chen Youliang',
					next: 'Empress Ma is the only one who can stop him…!'
				},
				{
					title: 'After Ma',
					ko: '마황후 이후',
					year: '1382–1398',
					hook: 'Empress Ma died, and the emperor stopped hearing the word no.',
					beats: [
						'On her deathbed she refuses medicine so the doctors won’t be punished if it fails.',
						'The purges: tens of thousands of officials, his own founding generals and their families. A minister grows a long beard so his collar hides his throat.',
						'He sends expeditions into the steppe to take back the seal. They never find it.',
						'Kangrim: “Were you a monk who ate, or an emperor who couldn’t stop?” He asks for his rice bowl.'
					],
					death: 'Zhu Yuanzhang',
					next: 'The seal is on the steppe. In the north, a Jurchen chief has seven grievances…!'
				}
			]
		},
		{
			id: 'qing',
			title: 'Part VI: The Seal from the Steppe',
			ko: '6부: 초원의 옥새',
			years: '1616–1644',
			summary: 'Frontier epic. The mandate rides in from outside the wall, through Mongolia, and passes through Korea on the way.',
			episodes: [
				{
					title: 'Seven Grievances',
					ko: '칠대한',
					year: '1616–1626',
					hook: 'Nurhaci listed seven grievances against the Ming, and the first was that they killed his father and grandfather.',
					beats: [
						'He unites the Jurchen with banners: eight colours of army, every household enrolled.',
						'He founds the Later Jin and beats a huge Ming army at Sarhu (a Joseon contingent under Gang Hong-rip surrenders; crossover).',
						'He dies after a cannon wound at Ningyuan.',
						'His eighth son Hong Taiji outmanoeuvres his brothers for the throne.'
					],
					death: 'Nurhaci',
					next: 'Hong Taiji needs Mongolia. Mongolia has the seal…!'
				},
				{
					title: 'The Herdsman',
					ko: '목동',
					year: '1635',
					hook: 'A goat wouldn’t stop digging at one spot, so the herdsman dug too.',
					beats: [
						'Legend: the Yuan seal, lost for two hundred years, is found by a herdsman whose goat would not eat for three days and kept pawing the ground.',
						'It passes to Ligdan Khan, the last great khan of the Chakhar. He dies of smallpox fleeing the Manchus.',
						'His widow and son surrender to Hong Taiji and present the Yuan seal.',
						'The narrator: not the First Emperor’s seal. But a mandate is what everyone agrees on, and everyone agreed.'
					],
					next: 'He has a seal. He needs a new name…!'
				},
				{
					title: 'Qing',
					ko: '청',
					year: '1636',
					hook: 'Hong Taiji renamed his people, his dynasty and himself in one year.',
					beats: [
						'The Jurchen become Manchu. The Later Jin becomes the Qing. Hong Taiji becomes emperor.',
						'The Joseon envoys at the ceremony refuse to bow. He lets them go home. He remembers.',
						'That winter he crosses the frozen Yalu.',
						'Plant: King Injo flees to Namhansanseong.'
					],
					next: 'Forty-seven days in a mountain fortress…!'
				},
				{
					title: 'Samjeondo',
					ko: '삼전도',
					year: '1637',
					hook: 'King Injo came down the mountain in blue, and bowed three times and touched his head to the ground nine times.',
					beats: [
						'Namhansanseong, deep winter. The court argues: fight and die, or kneel and live.',
						'Injo kneels at Samjeondo before Hong Taiji’s platform, nine times. The crown prince goes to Shenyang as a hostage.',
						'The narrator, who knows Samhan well, says nothing for a paragraph.',
						'Hong Taiji has a victory stele carved. The seal is pressed on the treaty.'
					],
					next: 'The Ming has seven years left. Hong Taiji has six…!'
				},
				{
					title: 'Shanhai Pass',
					ko: '산해관',
					year: '1643–1644',
					hook: 'Hong Taiji died a year short of Beijing, and it was a Ming general who opened the gate.',
					beats: [
						'Hong Taiji dies suddenly in Mukden. His five-year-old son is emperor; his brother Dorgon regent.',
						'A peasant rebel takes Beijing. The last Ming emperor hangs himself on Coal Hill.',
						'Wu Sangui, holding the Shanhai Pass, opens it to the Manchus.',
						'The seal enters the Forbidden City. Last image: the gold-patched corner of the First Emperor’s seal, in a display case, labelled as a copy.'
					],
					death: 'Hong Taiji',
					next: 'THE END. The seal will be found, lost, forged and found again. Heaven is patient…!'
				}
			]
		}
	],
	themes: [
		{
			title: 'Inheritance',
			body: [
				'Founders don’t inherit; that’s the point of them. Yet every one of them needs the dead to hand him something: a seal, a name, a blood tie, a grievance. The series is about the things that pass from one founder to the next without anyone deciding.'
			]
		},
		{
			title: 'The mandate as a story',
			body: [
				'Heaven’s mandate is proved after the fact. Whoever wins had it. The seal is the story made solid, which is why everyone fights over it and why a fake works almost as well.'
			]
		},
		{
			title: 'Brothers',
			body: [
				'The second son and the first: Shimin and Jiancheng, Yang Guang and Yang Yong, Zhao Kuangyin and Guangyi. The JoJo rhyme across the parts is a gate, a bedroom, a candle-lit screen.'
			]
		},
		{
			title: 'Wives',
			body: [
				'Every founder’s most important adviser is his wife: Qieluo, Yin Lihua, Ma. The ones who lose them get worse.'
			]
		}
	],
	arcs: [
		{
			who: 'The seal',
			steps: ['Bian He’s stone', 'Carved for the First', 'Surrendered to Liu Bang', 'Chipped by the Dowager', 'Cut from Wang Mang’s belt', 'Passed to Sui and Tang', 'Burned in 936', 'Reborn on the steppe'],
			mirror: 'The shard in King for All’s epilogue: something small that remembers a kingdom.'
		},
		{
			who: 'The Dugu blood',
			steps: ['Seven daughters', 'Zhou', 'Sui', 'Tang', 'The gate'],
			mirror: 'The Kim bloodline in Samhan and the cavern sisters who watch it.'
		},
		{
			who: 'The founder’s hunger',
			steps: ['Hostage', 'Farmer', 'Seventh daughter', 'Hung-over general', 'Beggar', 'Eighth son'],
			mirror: 'Each founder starts as the person least likely to sit on the throne.'
		}
	],
	plants: [
		{ plant: 'The First Emperor reads “may he live long” twice.', payoff: 'He dies on the road chasing immortality.' },
		{ plant: 'The Dowager’s chipped corner, patched in gold.', payoff: 'The last image, in the museum case.' },
		{ plant: 'Liu Xiu says Yin Lihua’s name at twenty.', payoff: 'He makes her empress at forty-six.' },
		{ plant: 'Qieluo trusts the son with the dusty zither.', payoff: 'He is the Sui’s last emperor.' },
		{ plant: 'The seal burns in 936.', payoff: 'Zhu Yuanzhang searches the steppe for it; Hong Taiji is handed a different one.' },
		{ plant: 'Joseon’s envoys refuse to bow in 1636.', payoff: 'Samjeondo.' }
	],
	timeline: [
		{ year: '259 BC', text: 'Ying Zheng born in Handan.' },
		{ year: '227 BC', text: 'Jing Ke’s attempt.' },
		{ year: '221 BC', text: 'Qin unites China; the seal is carved.' },
		{ year: '210 BC', text: 'The First Emperor dies.' },
		{ year: '206 BC', text: 'The last Qin king surrenders the seal to Liu Bang.' },
		{ year: '9 AD', text: 'Wang Mang takes the throne; the Dowager chips the seal.' },
		{ year: '23 AD', text: 'Kunyang; Wang Mang killed.' },
		{ year: '25 AD', text: 'Liu Xiu proclaimed emperor.' },
		{ year: '41 AD', text: 'Yin Lihua made empress.' },
		{ year: '557', text: 'Dugu Xin forced to suicide.' },
		{ year: '581', text: 'Yang Jian founds the Sui.' },
		{ year: '589', text: 'Sui reunites China.' },
		{ year: '604', text: 'Yang Jian dies.' },
		{ year: '618', text: 'Li Yuan founds the Tang.' },
		{ year: '626', text: 'Xuanwu Gate.' },
		{ year: '936', text: 'Li Congke burns himself and the seal.' },
		{ year: '960', text: 'Chenqiao; the Song founded.' },
		{ year: '976', text: 'Zhao Kuangyin dies.' },
		{ year: '1363', text: 'Poyang Lake.' },
		{ year: '1368', text: 'Ming founded; Yuan retreats north.' },
		{ year: '1382', text: 'Empress Ma dies.' },
		{ year: '1398', text: 'Zhu Yuanzhang dies.' },
		{ year: '1616', text: 'Nurhaci founds the Later Jin.' },
		{ year: '1635', text: 'Hong Taiji receives the Yuan seal.' },
		{ year: '1636', text: 'Qing proclaimed; invasion of Joseon.' },
		{ year: '1637', text: 'Samjeondo.' },
		{ year: '1644', text: 'The Qing enter Beijing.' }
	],
	sources: [
		{ title: 'Shiji', body: ['The First Emperor, Jing Ke, Li Si.'] },
		{ title: 'Hanshu and Hou Hanshu', body: ['The Dowager and the seal, Wang Mang, Liu Xiu, Yin Lihua.'] },
		{ title: 'Suishu, Jiu and Xin Tangshu, Zizhi Tongjian', body: ['The Dugu family, Yang Jian and Qieluo, Xuanwu Gate.'] },
		{ title: 'Songshi and Xu Zizhi Tongjian Changbian', body: ['Chenqiao, the cup of wine, the candle shadow (from Song miscellanies).'] },
		{ title: 'Mingshi', body: ['Zhu Yuanzhang, Empress Ma, Poyang Lake.'] },
		{ title: 'Qing Shilu and Joseon Wangjo Sillok', body: ['Hong Taiji, the Yuan seal, Namhansanseong and Samjeondo from both sides.'] }
	],
	research: [
		{
			title: 'The seal’s history',
			body: [
				'Han and later sources describe it as four inches square, with five intertwined dragons on top. After 936 every “Heirloom Seal” that surfaced was disputed. The Yuan used a different seal (制誥之寶), and that is the one the Chakhar handed to Hong Taiji.'
			]
		},
		{
			title: 'The mandate of heaven',
			body: [
				'Heaven grants the right to rule to the virtuous and withdraws it from the wicked. Disaster, famine and rebellion are signs of withdrawal. Success proves possession.'
			]
		}
	],
	places: [
		{ name: 'Xianyang', now: 'Xianyang, Shaanxi', note: 'The Qin capital.' },
		{ name: 'Chang’an', now: 'Xi’an', note: 'Han, Sui and Tang capital.' },
		{ name: 'Kunyang', now: 'Ye County, Henan', note: 'Liu Xiu’s miracle.' },
		{ name: 'Xuanwu Gate', now: 'Xi’an', note: 'North gate of the Tang palace.' },
		{ name: 'Chenqiao', now: 'Fengqiu, Henan', note: 'The yellow robe.' },
		{ name: 'Poyang Lake', now: 'Jiangxi', note: 'The naval battle.' },
		{ name: 'Mukden', now: 'Shenyang', note: 'Hong Taiji’s capital.' },
		{ name: 'Samjeondo', now: 'Songpa, Seoul', note: 'Injo’s submission.' }
	],
	contested: [
		'Whether the First Emperor’s seal ever really existed in the form described.',
		'Whether Li Shimin was pushed or planned the Xuanwu Gate.',
		'Whether Yang Guang killed his father.',
		'Whether Zhao Kuangyin staged his own surprise at Chenqiao.',
		'The candle shadow and the axe: anecdote, not record.',
		'The herdsman and the goat: legend.'
	],
	invented: [
		'All dialogue except quoted lines.',
		'The museum case at the end.',
		'The seal as a viewpoint presence that opens every part.'
	],
	production: [
		{
			title: 'Portraits',
			body: ['Have: Taizong (ch_taizong), Wu Zetian (ch_wu_zetian). Need every other cast member; each part should have its own look.']
		},
		{
			title: 'Look per part',
			body: [
				'Qin black and bronze; Han red and ochre; Sui–Tang white, gold and green glaze; Song pale yellow and celadon; Ming bright red; Qing blue and banner colours. The seal is the same green-white jade in every part, with the gold patch from Part II on.'
			]
		}
	]
};
