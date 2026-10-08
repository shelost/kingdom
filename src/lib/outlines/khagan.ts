import type { Outline } from './types';

export const khagan: Outline = {
	slug: 'khagan',
	title: 'Khagan',
	ko: '대칸',
	hanja: '大汗',
	shelf: 'Persia and the Steppe',
	tagline: 'The wars of Genghis Khan’s grandchildren, and the rise of Kublai',
	era: 'The Mongol Empire',
	years: '1227–1294',
	accent: '#3a6fb0',
	logline:
		'Genghis Khan leaves the largest empire in history to his family, and his family nearly destroys it fighting over the chair. A widow with four sons plays the long game. Her second son, the one who likes Chinese books, wins the war against his little brother and turns the steppe empire into China’s Yuan dynasty.',
	opening: '“Genghis Khan conquered the world from horseback. His grandchildren argued about it indoors.”',
	altTitles: [
		{ title: 'The Widow’s Sons', ko: '과부의 아들들', note: 'Sorghaghtani’s story. The first half’s engine.' },
		{ title: 'Two Kurultais', ko: '두 개의 쿠릴타이', note: '1260: two brothers elected the same spring.' },
		{ title: 'Great Yuan', ko: '대원', note: 'The new name. The title for the second half.' },
		{ title: 'Xanadu', ko: '상도', note: 'Kaiping, the summer capital. Famous, romantic.' },
		{ title: 'Then We Were Right', ko: '그때는 우리가 옳았다', note: 'Ariq Böke’s line at his surrender. The tragic title.' }
	],
	images: [
		{
			src: '/stories/khagan/poster.jpg',
			alt: 'Kublai on a dun pony on a near ridge, Ariq Böke small on the far ridge, lines of horsemen between them under a storm shaft',
			caption: 'Two ridges, one empire. Kublai and his little brother, each with an army behind him.',
			year: '1260',
			kind: 'poster'
		},
		{
			src: '/stories/khagan/chabi.jpg',
			alt: 'Chabi fastens a fur collar at Kublai’s throat inside a lamplit ger',
			caption: 'Chabi does up his collar and tells him what he doesn’t want to hear. He listens anyway.',
			year: '1259',
			kind: 'romance',
			episode: 'Chabi’s Letter',
		},
		{
			src: '/stories/khagan/mongke-court.jpg',
			alt: 'Möngke, lean and severe with a falcon on his glove, under the silver tree fountain at Karakorum, consorts in tall boqta headdresses around him',
			caption: 'Karakorum. Möngke under the silver tree that pours four drinks. He has wives; he would rather have the accounts.',
			year: '1254',
			episode: 'The Audit',
			nsfw: true
		},
		{
			src: '/stories/khagan/kublai-court.jpg',
			alt: 'Heavyset Kublai lounging by a moon window at Shangdu among Song Chinese consorts with a pipa, wine and a fan',
			caption: 'Shangdu. Kublai among the Song ladies. The steppe calls this going soft. Kublai calls it Tuesday.',
			year: '1275',
			episode: 'The Pleasure Dome',
			nsfw: true
		},
		{
			src: '/stories/khagan/hulegu-court.jpg',
			alt: 'Hulagu laughing with a split pomegranate under a turquoise iwan at Maragheh, Persian women with kohl-lined eyes playing harp and frame drum, pouring wine and dancing by a candlelit pool',
			caption: 'Maragheh. Hulagu in his new kingdom, as far from his brothers as a horse can go.',
			year: '1262',
			episode: 'Baghdad',
			nsfw: true
		},
		{
			src: '/stories/khagan/hulegu-dance.jpg',
			alt: 'A Persian dancer with hip-length black hair, henna and a coin belt turns in lattice lamplight before a seated khan',
			caption: 'The poets of Tabriz will call her the moon. She has heard it. She dances anyway.',
			year: '1262',
			episode: 'Baghdad',
			nsfw: true
		},
		{
			src: '/stories/khagan/batu-court.jpg',
			alt: 'Grey-braided Batu on a gold throne at Sarai, Rus’ women with ash-blonde braids and silver temple rings in short linen shifts, one dancing, Kipchak women in red felt beside them',
			caption: 'Sarai. Batu in the golden tent. Rus’ princes come here on their knees for a licence to rule.',
			year: '1250',
			episode: 'Güyük’s March',
			nsfw: true
		},
		{
			src: '/stories/khagan/batu-rus.jpg',
			alt: 'A Rus’ noblewoman with a long ash-blonde braid and silver temple rings sits on a white bearskin by a brazier, holding out a cup of mead',
			caption: 'Her husband sold Batu a city. She came with the bill of sale and has not decided yet whose side she is on.',
			year: '1250',
			episode: 'Güyük’s March',
			nsfw: true
		},
		{
			src: '/stories/khagan/ariq-court.jpg',
			alt: 'Ariq Böke bare-chested in a wolf-fur cloak in a ger, steppe consorts around him and a horsehead fiddle by the fire',
			caption: 'Karakorum. Ariq Böke keeps the old ways: felt, fire, the fiddle, and no Chinese books.',
			year: '1260',
			episode: 'Two Kurultais',
			nsfw: true
		},
		{
			src: '/stories/khagan/sorghaghtani.jpg',
			alt: 'Sorghaghtani Beki, in a tall jewelled headdress and crimson silk, raises a hand over a brazier as her four sons kneel around her in a ger',
			caption: 'The ger. Sorghaghtani tells her four sons the throne is theirs if they stay together.',
			year: '1251',
			episode: 'The Ger',
		},
		{
			src: '/stories/khagan/goryeo.jpg',
			alt: 'Kublai, in a blue and gold robe and fur hat, opens his arms in welcome to the Goryeo crown prince, who bows with clasped hands',
			caption: 'Liangchu. The Goryeo crown prince comes to Kublai instead of the dead khan. Kublai can’t believe his luck.',
			year: '1259',
			episode: 'The Prince of Goryeo',
		},
		{
			src: '/stories/khagan/two-khans.jpg',
			alt: 'Split frame: Kublai enthroned in a red-pillared hall on the left, Ariq Böke raised on white felt on the snowy steppe on the right, a white yak-tail standard between them',
			caption: 'Two kurultais. Kublai at Kaiping, Ariq Böke at Karakorum. Two Great Khans in one spring.',
			year: '1260',
			episode: 'Two Kurultais',
		},
		{
			src: '/stories/khagan/xiangyang.jpg',
			alt: 'A Persian engineer points as a counterweight trebuchet hurls a stone that shatters Xiangyang’s gate tower across the river',
			caption: 'Xiangyang. Five years of siege, ended by two Persian engineers and a very large stone.',
			year: '1273',
			episode: 'Xiangyang',
		}
	],
	synopsis: [
		'Genghis Khan dies in 1227 and leaves four sons, an empire and no rule for choosing the next khan except an assembly, the kurultai, where everyone must agree. His youngest son Tolui gets the home army and dies young, drinking a shaman’s water to take his brother’s sickness. Tolui’s widow, Sorghaghtani, a Christian princess of the Kerait, refuses to remarry into the ruling branch and raises four sons: Möngke, Kublai, Hulagu and Ariq Böke.',
		'For twenty years she waits while the Ögedeid branch drinks, quarrels and dies. Ögedei drinks himself to death. His widow runs the empire for five years. His son Güyük is elected and marches west to fight his cousin Batu; Sorghaghtani secretly warns Batu, and Güyük dies on the road. In 1251, with Batu’s backing, her eldest son Möngke is made Great Khan. The Ögedeids arrive with wagons full of weapons. A falconer looking for a lost camel stumbles on them. The purge is enormous, and the late khan’s widow is sewn into felt and drowned.',
		'Möngke sends his brothers out: Hulagu to Persia, where he sacks Baghdad, and Kublai to China, where he builds a city and listens to Confucians. Möngke dies besieging a Sichuan fortress. Kublai and the youngest brother, Ariq Böke, are each elected khan by a different assembly in the same spring. Kublai has the grain, the cities and the Chinese. Ariq has the heartland and the tradition. Kublai starves Karakorum, and Ariq surrenders: “Then we were right. Now you are.”',
		'Kublai names his dynasty Yuan and spends the rest of his life finishing the conquest of China. Along the way he makes a son-in-law of the Goryeo crown prince who came to him first. At Xiangyang his Persian engineers bring down the walls with counterweight trebuchets. At Yamen, a Song minister jumps into the sea with the child emperor on his back. Then the fleets to Japan sink, his wife Chabi dies, his heir dies, and the Khagan of the world grows old and fat in Xanadu.'
	],
	quotes: [
		{
			text: 'Goryeo is a country that even Tang Taizong could not conquer. Now its crown prince has come to me of his own will. This is heaven’s doing.',
			who: 'Kublai, 1259',
			source: 'Goryeosa'
		},
		{
			text: 'Then, we were right. Now, you are.',
			who: 'Ariq Böke, surrendering to Kublai',
			source: 'Rashid al-Din, Jami al-Tawarikh'
		},
		{
			text: 'Great indeed is the originating power of Qian.',
			who: 'The Yijing, source of the name Yuan',
			original: '大哉乾元'
		},
		{
			text: 'One can conquer the world on horseback, but one cannot rule it from horseback.',
			who: 'Yelü Chucai (attributed), to Ögedei',
			source: 'Yuanshi',
			original: '天下雖得之馬上 不可以馬上治'
		},
		{
			text: 'In Xanadu did Kubla Khan a stately pleasure-dome decree.',
			who: 'Samuel Taylor Coleridge, five centuries later'
		}
	],
	cast: [
		{
			name: 'Kublai',
			lead: true,
			ko: '쿠빌라이',
			epithet: 'Setsen Khan, the Wise',
			life: '1215–1294',
			side: 'Toluid, Yuan',
			hex: '#3a6fb0',
			look: 'Heavyset and broad, a round ruddy face, a drooping black mustache and a thin chin beard. Rides a stocky dun. Chinese silk under a Mongol fur hat; by the end, gout, a litter carried by four elephants, and a belly.',
			want: 'To be the khan who rules, not just the one who rides. Then simply to win.',
			voice: 'Big, warm, curious, patient, then imperious. Asks scholars questions and listens to the answers. Laughs from the belly.',
			line: '“My grandfather took the world. Someone has to collect the taxes.”',
			arc: 'Second son, governor of North China, audited and forgiven, besieger of Ezhou, elected khan, brother-killer by starvation, founder of the Yuan, grieving old man.'
		},
		{
			name: 'Sorghaghtani Beki',
			lead: true,
			ko: '소르칵타니 베키',
			epithet: 'The Widow',
			life: 'c. 1190–1252',
			side: 'Toluid (Kerait)',
			hex: '#b5452f',
			want: 'The throne for her sons, and for them to stay brothers.',
			voice: 'Quiet, devout, sly, never says anything she can be held to.',
			line: '“My sons are young. I would not dream of it.” (She is dreaming of nothing else.)',
			arc: 'Princess, widow, refuser of a khan’s proposal, secret ally of Batu, kingmaker. Dies a year after winning.'
		},
		{
			name: 'Möngke',
			lead: true,
			ko: '뭉케',
			epithet: 'The Stern',
			life: '1209–1259',
			side: 'Toluid',
			hex: '#5a5a7a',
			look: 'Lean, hard and weathered, a hawk nose, thin lips, a sparse beard. Plain dark felt and no jewels. A falcon on his glove, always. Sits a horse like he was born on it, which he was.',
			want: 'To rule exactly as Grandfather did.',
			voice: 'Laconic, austere, suspicious of luxury and of Kublai.',
			line: '“You’re building a city? Show me the accounts.”',
			arc: 'The eldest, Great Khan from 1251, purger of cousins, auditor of his brother, dead at the Fishing Town. The only brother everyone obeyed; the empire breaks the year he dies. He speaks several languages, sends envoys to the Pope and the Song, debates Buddhists against Christians against Muslims at Karakorum, and takes the census of the whole empire with his own eye on the numbers.'
		},
		{
			name: 'Ariq Böke',
			lead: true,
			ko: '아리크 부케',
			epithet: 'The Youngest',
			life: 'c. 1219–1266',
			side: 'Toluid',
			hex: '#8ab8d0',
			look: 'The youngest and the tallest: rangy, long-armed, wind-burned. Wild unbraided locks, sheepskin and wolf fur, a horn bow across his back. The only brother who still looks like the old pictures of Grandfather.',
			want: 'The steppe to stay the steppe. And to be khan, since he was left at home.',
			voice: 'Proud, brave, plain, traditional. Distrusts cities and people who read.',
			line: '“Grandfather slept in a ger. My brother sleeps in a palace with Chinese books.”',
			arc: 'The youngest, keeper of the hearth by custom, elected khan at Karakorum, starved out, forgiven, dead within two years.'
		},
		{
			name: 'Hulagu',
			ko: '훌레구',
			epithet: 'The Ilkhan',
			life: 'c. 1217–1265',
			side: 'Toluid, Ilkhanate',
			hex: '#a0603a',
			look: 'Bull-necked and barrel-chested, a scar through one eyebrow, braids looped behind the ears. Persian brocade over steel lamellar. Laughs loudly; kills on the same afternoon.',
			want: 'His own kingdom, a long way from his brothers.',
			voice: 'Fierce, jovial, theatrical.',
			line: '“The caliph said no Mongol may spill royal blood. So we used a carpet.”',
			arc: 'Sacker of Baghdad, backer of Kublai, at war with his cousin Berke. Leans Buddhist; his chief wife Doquz is a Nestorian Christian, and the Christians of the East pray for him as a new Constantine. Builds the observatory at Maragheh for Nasir al-Din Tusi. Loses to the Mamluks at Ain Jalut, which is the first time the Mongols lose, and which he isn’t present for.',
			lead: true
		},
		{
			name: 'Chabi',
			ko: '차비',
			epithet: 'The Empress Who Warned',
			life: 'c. 1225–1281',
			side: 'Yuan (Khongirad)',
			hex: '#c97aa0',
			want: 'Her husband on the throne and humble on it.',
			voice: 'Sharp, Buddhist, thrifty, funny. The person Kublai listens to most.',
			line: '“Your brother is raising troops. Come home now, and bring the army.”',
			arc: 'Sends the message that brings Kublai home in 1259; designs hats; dies and takes his good judgement with her.'
		},
		{
			name: 'Batu',
			ko: '바투',
			epithet: 'Lord of the Golden Horde',
			life: 'c. 1207–1255',
			side: 'Jochid',
			hex: '#d9b13a',
			look: 'Calm, broad-faced, braids gone grey early, a gold-trimmed fur cap. Sits very still in a tent of gold cloth. The Rus’ call him Sain Khan, the Good Khan, and mean it about half.',
			want: 'Never to bow to Güyük.',
			voice: 'Senior, jovial, dangerous, a long memory.',
			line: '“Güyük insulted me over a cup. I don’t forget cups.”',
			arc: 'The cousin, not a brother: Jochi’s son and Genghis’s eldest grandson. Conqueror of Russia and Hungary, founder of Sarai and the Golden Horde, the kingmaker who backs Möngke. Dies in 1255, before the brothers’ war; his brother Berke inherits the grudge.'
		},
		{
			name: 'Berke',
			ko: '베르케',
			epithet: 'The Muslim Khan',
			life: 'c. 1209–1266',
			side: 'Jochid, Golden Horde',
			hex: '#4f8a4a',
			look: 'Batu’s younger brother: heavy-lidded, thin beard, a white turban wound over a Mongol cap, prayer beads in the rein hand. Gout in one foot, like half his family.',
			want: 'Revenge for Baghdad, and the Caucasus pastures Hulagu took.',
			voice: 'Devout, aggrieved, grandly formal; speaks of God and grazing in the same sentence.',
			line: '“Mongols are killed by Mongol swords. If we had stayed together, we would have conquered the world.”',
			arc: 'The first Muslim khan of the line. Rules the Golden Horde from 1257, backs Ariq Böke, allies with the Mamluks of Egypt, and in 1262 fights his cousin Hulagu on the frozen Terek, where the ice breaks under Hulagu’s retreating men. The first open war of Mongol against Mongol.'
		},
		{
			name: 'Doquz Khatun',
			ko: '도쿠즈 카툰',
			epithet: 'The Christian Queen',
			life: '?–1265',
			side: 'Ilkhanate (Kerait)',
			hex: '#8a6fb0',
			look: 'Tall boqta headdress, a small gold cross on a cord, a portable felt church carried behind her camp on a cart.',
			want: 'Christians spared wherever Hulagu’s army goes.',
			voice: 'Gracious, firm, the one person who can say no to Hulagu before dinner.',
			line: '“Spare the churches. You can have the rest of the city.”',
			arc: 'Sorghaghtani’s niece and Hulagu’s chief wife. At Baghdad the Christians are spared at her word. Dies within months of her husband.'
		},
		{
			name: 'Güyük',
			ko: '구육',
			epithet: 'The Short Reign',
			life: '1206–1248',
			side: 'Ögedeid',
			hex: '#6a3a3a',
			want: 'To teach Batu a lesson.',
			voice: 'Sickly, proud, quick to insult.',
			line: '“That old woman Batu with his quiver…”',
			arc: 'Elected 1246, marches west against Batu, dies on the way.'
		},
		{
			name: 'Oghul Qaimish',
			ko: '오굴 카이미시',
			epithet: 'The Regent Who Talked to Spirits',
			life: '?–1252',
			side: 'Ögedeid',
			hex: '#4a3a5a',
			want: 'The throne for her sons.',
			voice: 'Haughty, mystic, contemptuous of the Toluids.',
			line: '“You were all promised: only Ögedei’s line. You swore.”',
			arc: 'Regent after Güyük; sewn in felt and drowned after the conspiracy.'
		},
		{
			name: 'Wang Jeon',
			ko: '왕전',
			hanja: '王倎',
			epithet: 'The Prince Who Came First (Wonjong)',
			life: '1219–1274',
			side: 'Goryeo',
			hex: '#2f8f83',
			want: 'For Goryeo to survive with its name and customs.',
			voice: 'Courteous, cautious, exhausted, very brave in a quiet way.',
			line: '“My father is dead too. We have something in common, Prince.”',
			arc: 'Sent to submit to Möngke after thirty years of war; meets Kublai instead; returns as king; his son marries Kublai’s daughter.'
		},
		{
			name: 'Liu Bingzhong',
			ko: '유병충',
			hanja: '劉秉忠',
			epithet: 'The Monk Who Drew Xanadu',
			life: '1216–1274',
			side: 'Yuan',
			hex: '#8a9a5a',
			want: 'To civilise the conqueror from inside.',
			voice: 'Mild Chan monk, mathematician, geomancer.',
			line: '“A capital is a sentence. This one will say: the khan stays.”',
			arc: 'Plans Kaiping and Dadu; proposes the name Yuan.'
		},
		{
			name: 'Kaidu',
			ko: '카이두',
			epithet: 'The Cousin Who Never Came',
			life: 'c. 1230–1301',
			side: 'Ögedeid',
			hex: '#5a4a2a',
			want: 'His grandfather Ögedei’s throne back.',
			voice: 'Wily, patient, steppe purist.',
			line: '“Tell the khan I am ill. I will be ill for forty years.”',
			arc: 'Refuses every summons, fights Kublai in Central Asia for the rest of his life.'
		},
		{
			name: 'Lu Xiufu',
			ko: '육수부',
			hanja: '陸秀夫',
			epithet: 'The Last Minister of Song',
			life: '1236–1279',
			side: 'Song',
			hex: '#c9b0a0',
			want: 'For the Song not to surrender.',
			voice: 'Grave, gentle, scholarly.',
			line: '“Your Majesty, the country is lost. A Son of Heaven should not be shamed.”',
			arc: 'Jumps into the sea at Yamen with the eight-year-old emperor on his back.'
		}
	],
	returning: [
		{
			title: 'The narrator',
			body: [
				'The house storyteller, who watched Goguryeo and Goryeo from the sky. He has a soft spot for the Goryeo prince and doesn’t hide it.'
			]
		},
		{
			title: 'Goryeo',
			body: [
				'Thirty years of Mongol invasions, the court on Ganghwa Island, then the prince’s meeting with Kublai, the son-in-law kings, the Sambyeolcho revolt and the joint fleets to Japan. The Korean thread runs under the whole second half.'
			]
		}
	],
	bonds: [
		{
			a: 'Kublai',
			b: 'Ariq Böke',
			kind: 'Two khans, one mother',
			body: 'The youngest brother keeps the hearth by custom, and the second brother keeps the cities. Each thinks he is defending what their mother built. Kublai doesn’t want to kill him and doesn’t have to; he cuts the grain road to Karakorum. At the surrender they embrace and both weep. Two years later Ariq is dead, and nobody asks how.'
		},
		{
			a: 'Kublai',
			b: 'Möngke',
			kind: 'The audit',
			body: 'The elder brother sends accountants to Kublai’s province and executes his officials. Advisers tell Kublai to rebel. Instead he rides to Möngke with his wife and children, and the brothers weep and drink. Kublai learns that humility can be a weapon. Möngke dies two years later, and Kublai never quite forgives him.'
		},
		{
			a: 'Sorghaghtani Beki',
			b: 'Kublai',
			kind: 'Mother and favourite',
			body: 'She gives him a Chinese appanage, Chinese tutors and her habit of tolerance. He inherits her patience and lacks her restraint. He outlives her by forty years and quotes her for all of them.'
		},
		{
			a: 'Kublai',
			b: 'Chabi',
			kind: 'The khan and the voice in his ear',
			body: 'She is the reason he comes home in 1259. She gives the Song empress dowager a dignified exile and talks him out of grabbing land for horse pasture. When she dies, he becomes the fat, drinking old man of Marco Polo’s book.'
		},
		{
			a: 'Kublai',
			b: 'Wang Jeon',
			kind: 'The first guest',
			body: 'Two princes on a summer road, each waiting to hear who will inherit. Kublai is delighted that Goryeo came to him first and never forgets it: Goryeo keeps its name, its customs and its kings, and its kings marry his daughters. The kindest relationship in the book is also the leash.'
		}
	],
	parts: [
		{
			id: 'widow',
			title: 'The Widow',
			ko: '과부',
			years: '1227–1241',
			summary: 'Genghis dies, a son dies in his brother’s place, and a widow says no to a khan.',
			episodes: [
				{
					title: 'Four Sons',
					ko: '네 아들',
					year: '1227–1229',
					hook: 'Genghis Khan died, and left the world to whichever son his family could agree on.',
					beats: [
						'Jochi, the eldest, is dead and his legitimacy doubted. Chagatai is too hot-tempered. Ögedei is easygoing and likes a drink. Tolui, the youngest, gets the home army.',
						'Two years of regency. The kurultai elects Ögedei, who drinks to it.',
						'Tolui’s wife, Sorghaghtani, a Kerait princess and a Nestorian Christian, watches who sits where.',
						'Plant: Ögedei promises the throne will stay in his line.'
					],
					next: 'Ögedei falls ill. A shaman has a cure…!'
				},
				{
					title: 'The Water',
					ko: '물',
					year: '1232',
					hook: 'The shamans washed the khan’s sickness into a cup, and Tolui drank it.',
					beats: [
						'Ögedei is dying in the field in China. The shamans say a kinsman must take the curse.',
						'Tolui drinks the water: “I’m drunk already. Look after my orphans, brother, my widow.”',
						'Ögedei recovers. Tolui dies (the Secret History; other sources say drink).',
						'Kangrim, if shared: “Were you a son of Genghis, or a brother?”'
					],
					death: 'Tolui',
					next: 'The khan wants to marry the widow to his son…!'
				},
				{
					title: 'The Refusal',
					ko: '거절',
					year: '1230s',
					hook: 'Ögedei offered Sorghaghtani his son Güyük, and she said her sons needed her more.',
					beats: [
						'Levirate custom: a widow marries into the family. Marrying Güyük would put her sons under him.',
						'She refuses so politely that Ögedei can’t be offended.',
						'She gives her sons tutors: Uighur, Persian, Chinese. Kublai gets the Chinese ones.',
						'She funds mosques, monasteries and churches. Everyone in her lands has a reason to like her.'
					],
					next: 'Ögedei is drinking more…!'
				}
			]
		},
		{
			id: 'throne',
			title: 'The Empty Throne',
			ko: '빈 옥좌',
			years: '1241–1252',
			summary: 'A feast insult, a march that ends in a grave, a lost camel and a purge.',
			episodes: [
				{
					title: 'The Cup',
					ko: '잔',
					year: '1240–1241',
					hook: 'At a feast in Russia, Batu drank first, and Güyük called him an old woman with a quiver.',
					beats: [
						'The great western campaign. Batu, the eldest grandson, leads; his cousins Güyük and Büri resent it.',
						'The insult at the feast. Ögedei recalls Güyük in a fury.',
						'Ögedei dies of drink that winter. The armies turn back from Hungary.',
						'His widow Töregene rules for five years and packs the court for her son.'
					],
					death: 'Ögedei',
					next: 'Güyük is elected. Batu doesn’t come…!'
				},
				{
					title: 'Güyük’s March',
					ko: '구육의 서진',
					year: '1246–1248',
					hook: 'Güyük marched west to visit his cousin, with an army, and Sorghaghtani sent a messenger faster.',
					beats: [
						'A papal envoy, Carpini, attends the election and is unimpressed.',
						'Güyük, ill and angry, leads an army toward Batu’s lands.',
						'Sorghaghtani sends a secret rider: he’s coming for you.',
						'Güyük dies on the road at Qum-Sengir. The record is careful not to say why.'
					],
					death: 'Güyük',
					next: 'Batu owes the widow. He calls a kurultai…!'
				},
				{
					title: 'The Ger',
					ko: '게르',
					year: '1251',
					hook: 'Sorghaghtani told her four sons the throne was theirs, if they didn’t fight over it.',
					beats: [
						'Batu backs Möngke. The Ögedeids refuse to come. Sorghaghtani holds the kurultai in the Toluid heartland anyway.',
						'In her ger she lays out the plan: Möngke is khan; the others serve him and each get a realm.',
						'Ariq, the youngest, sulks. Kublai watches him sulk.',
						'Möngke is raised on the white felt.'
					],
					next: 'A falconer loses a camel…!'
				},
				{
					title: 'The Lost Camel',
					ko: '잃어버린 낙타',
					year: '1251',
					hook: 'A falconer went looking for a stray camel and found a cart full of swords.',
					beats: [
						'The Ögedeid princes arrive to “congratulate” the new khan, with wagons.',
						'Kešig, a falconer, searching for a camel, finds the wagons full of weapons and a plan.',
						'He rides through the night. The Ögedeids are surrounded and disarmed.',
						'Möngke purges them: generals, princes, officials. Oghul Qaimish is stripped, sewn into felt and drowned. Sorghaghtani dies the next year.'
					],
					death: 'Sorghaghtani Beki',
					next: 'Four brothers, four roads…!'
				}
			]
		},
		{
			id: 'brothers',
			title: 'Four Roads',
			ko: '네 갈래 길',
			years: '1252–1259',
			summary: 'The brothers go out into the world. One builds a city, one destroys one, and the khan dies outside a fortress.',
			episodes: [
				{
					title: 'Kaiping',
					ko: '개평',
					year: '1252–1256',
					hook: 'Kublai built a city on the grass, which his brothers found very funny.',
					beats: [
						'Möngke gives Kublai North China. Kublai fills his camp with Confucians, Buddhist monks and Daoists.',
						'He conquers Dali in the far southwest, and spares the city on his advisers’ advice.',
						'Liu Bingzhong lays out Kaiping, later Shangdu, Xanadu: a Chinese city with a hunting park.',
						'Ariq hears and laughs. Möngke hears and doesn’t.'
					],
					next: 'Möngke sends accountants…!'
				},
				{
					title: 'The Audit',
					ko: '감사',
					year: '1257',
					hook: 'Möngke audited his brother’s province, and executed the bookkeepers.',
					beats: [
						'Accusations: Kublai keeps the taxes, Kublai is going native.',
						'His officials are tortured and killed. His advisers say: rebel.',
						'Liu Bingzhong says: go to him with your family.',
						'Kublai arrives at Möngke’s camp with Chabi and the children. The brothers embrace and cry. The audit stops.'
					],
					next: 'In Persia, Hulagu has reached Baghdad…!'
				},
				{
					title: 'Baghdad',
					ko: '바그다드',
					year: '1258',
					hook: 'The caliph refused to surrender because God would protect Baghdad, and Hulagu wanted to see.',
					beats: [
						'Hulagu destroys the Assassins’ castles and marches on the caliph.',
						'Baghdad falls after twelve days. The Tigris runs black with ink from the libraries (later tradition).',
						'The caliph is rolled in a carpet and trampled by horses, so no royal blood touches the ground.',
						'Hulagu’s Christian wife saves the city’s Christians. Berke, his Muslim cousin in the Golden Horde, swears revenge.'
					],
					next: 'Möngke is besieging a fortress on a cliff…!'
				},
				{
					title: 'Fishing Town',
					ko: '조어성',
					year: '1259',
					hook: 'Möngke couldn’t take a little fortress on a cliff in Sichuan, and it killed him.',
					beats: [
						'The Song’s Diaoyu fortress holds out for months.',
						'The khan falls ill (dysentery, or a wound; sources disagree) and dies in camp.',
						'In Europe and the Middle East, the news stops armies. Hulagu turns back; at Ain Jalut a reduced Mongol army will lose to the Mamluks.',
						'Kublai is besieging Ezhou on the Yangtze. He doesn’t know yet.'
					],
					death: 'Möngke',
					next: 'A rider from Chabi…!'
				}
			]
		},
		{
			id: 'two',
			title: 'Two Khans',
			ko: '두 칸',
			years: '1259–1264',
			summary: 'Two brothers, two elections, a war of grain, and a guest from Goryeo.',
			episodes: [
				{
					title: 'Chabi’s Letter',
					ko: '차비의 편지',
					year: '1259',
					hook: 'Chabi wrote that Ariq was raising troops, in a riddle about a big fish and small fish.',
					beats: [
						'Ariq’s officers are conscripting men in Kublai’s own lands. Chabi stalls them and sends a rider.',
						'The Song minister Jia Sidao offers tribute to make Kublai leave. Kublai takes it and goes.',
						'Jia Sidao will tell his court he won a great victory.',
						'Kublai rides north.'
					],
					next: 'On the road, a stranger is waiting…!'
				},
				{
					title: 'The Prince of Goryeo',
					ko: '고려의 태자',
					year: '1259',
					hook: 'The Goryeo crown prince set out to bow to one khan and found him dead, so he chose another.',
					beats: [
						'Thirty years of war have burned Goryeo. The court on Ganghwa Island sends Crown Prince Wang Jeon to submit.',
						'Möngke is dead. Wang Jeon must guess which brother will win. He turns south to meet Kublai.',
						'Kublai is delighted: “A country even Tang Taizong couldn’t conquer, and its prince comes to me.”',
						'He promises Goryeo can keep its customs. Wang Jeon’s father dies; Kublai sends him home as king.'
					],
					next: 'Two kurultais, one spring…!'
				},
				{
					title: 'Two Kurultais',
					ko: '두 쿠릴타이',
					year: '1260',
					hook: 'In May, Kublai was elected Great Khan. In June, so was his brother.',
					beats: [
						'Kublai’s assembly at Kaiping: his own supporters, the eastern princes. He takes a Chinese reign title.',
						'Ariq’s assembly at Karakorum: the old capital, the heartland, the Ögedeid and Chagataid princes.',
						'Both are legally irregular. Both are raised on felt.',
						'Hulagu sends support to Kublai. Berke backs Ariq. The empire has a civil war in every corner.'
					],
					next: 'Karakorum eats grain from China…!'
				},
				{
					title: 'Then We Were Right',
					ko: '그때는 우리가 옳았다',
					year: '1260–1264',
					hook: 'Kublai didn’t need to beat Ariq. He just stopped sending him food.',
					beats: [
						'Kublai blockades the grain caravans to Karakorum. Ariq wins battles and starves.',
						'His ally in Central Asia, Alghu, switches sides. Hulagu and Berke go to war, Mongol against Mongol.',
						'Ariq surrenders. Kublai, weeping: “Who was right?” “Then, we were. Now, you are.”',
						'He is held under guard and dies in 1266. Kangrim: “Were you the keeper of the hearth, or the brother who lost?”'
					],
					death: 'Ariq Böke',
					next: 'Kublai is khan of everyone. He wants a new name…!'
				}
			]
		},
		{
			id: 'yuan',
			title: 'Great Yuan',
			ko: '대원',
			years: '1271–1279',
			summary: 'A dynasty named from the Book of Changes, a siege broken by Persian science, and the end of the Song at sea.',
			episodes: [
				{
					title: 'The Name',
					ko: '국호',
					year: '1271',
					hook: 'Kublai named his dynasty after a line in the Book of Changes, which no Mongol could read.',
					beats: [
						'Da Yuan, the Great Origin. The first dynasty named for an idea, not a place.',
						'He builds Dadu, the Khan’s City, where Beijing is now.',
						'His son-in-law king in Goryeo is Wang Jeon’s son. Goryeo’s Sambyeolcho troops rebel and hold out on Jindo and Jeju.',
						'Kaidu refuses every summons and fights on in the west.'
					],
					next: 'Xiangyang has held out for four years…!'
				},
				{
					title: 'Xiangyang',
					ko: '양양',
					year: '1268–1273',
					hook: 'Two Persian engineers walked into Kublai’s camp with a better catapult.',
					beats: [
						'The twin Song cities of Xiangyang and Fancheng hold the Han River for five years.',
						'Ismail and Ala al-Din, sent by Hulagu’s son, build counterweight trebuchets.',
						'Fancheng falls first. Then a stone hits Xiangyang’s gate tower and the sound alone cracks the defenders.',
						'The general Lü Wenhuan surrenders. The Yangtze is open.'
					],
					next: 'Bayan of the Baarin goes down the Yangtze…!'
				},
				{
					title: 'Hangzhou',
					ko: '항주',
					year: '1276',
					hook: 'The Song empress dowager surrendered her capital, and Chabi made sure she was treated kindly.',
					beats: [
						'Bayan takes the Song capital almost without a fight.',
						'Empress Dowager Xie hands over the child emperor and the seals.',
						'At court Chabi weeps over the Song treasure: “This is how our own dynasty will end.” She sees the captives lodged with dignity.',
						'Loyalists flee south with two younger princes.'
					],
					next: 'The last Song court is on the sea…!'
				},
				{
					title: 'Yamen',
					ko: '애산',
					year: '1279',
					hook: 'Lu Xiufu put the child emperor on his back and walked into the sea.',
					beats: [
						'A thousand Song ships chained together at Yamen, off Guangdong.',
						'The Yuan fleet attacks; the Song line breaks.',
						'Lu Xiufu dresses the eight-year-old in court robes, ties him to his back and jumps.',
						'Kublai is emperor of all China, the first non-Chinese to rule it all.'
					],
					death: 'Lu Xiufu',
					next: 'There is an island in the sea he hasn’t taken…!'
				}
			]
		},
		{
			id: 'xanadu',
			title: 'Epilogue: Xanadu',
			ko: '에필로그: 상도',
			years: '1274–1294',
			summary: 'Divine winds, a dead wife, a dead son and an old man in a pleasure garden.',
			episodes: [
				{
					title: 'Kamikaze',
					ko: '신풍',
					year: '1274, 1281',
					hook: 'Kublai sent two fleets to Japan, and the sea sent both back.',
					beats: [
						'Goryeo builds the ships and supplies the sailors; Kim Bang-gyeong leads its men.',
						'1274: a storm. 1281: the largest fleet in history, and a typhoon.',
						'The Japanese call it the divine wind.',
						'Goryeo is exhausted. Chabi dies that year.'
					],
					death: 'Chabi',
					next: 'The old khan has one more loss coming…!'
				},
				{
					title: 'The Pleasure Dome',
					ko: '환락궁',
					year: '1285–1294',
					hook: 'Kublai outlived his wife, his heir and his appetite for anything but food.',
					beats: [
						'His son Zhenjin, raised by Confucians, dies at forty-two.',
						'Kublai drinks, eats, swells with gout, and hunts from a pavilion carried by four elephants.',
						'A Venetian claims to have served him. The narrator: maybe.',
						'He dies in Dadu at seventy-nine. Kangrim: “Were you a khan, or an emperor?” “Ask my mother which she wanted.”'
					],
					death: 'Kublai',
					next: 'THE END. The Yuan will last seventy-four more years. The seal goes north with them…!'
				}
			]
		}
	],
	themes: [
		{
			title: 'The steppe and the city',
			body: [
				'Ariq is the Mongol tradition, Kublai the empire that has to govern farmers. The book takes both seriously. Kublai wins because cities feed armies; something is lost when he does.'
			]
		},
		{
			title: 'Mothers and wives',
			body: [
				'Sorghaghtani wins the throne without ever claiming it. Töregene and Oghul Qaimish try to keep it and are destroyed. Chabi steers the winner. The real politics of the steppe empire happen in the women’s gers.'
			]
		},
		{
			title: 'Brothers',
			body: [
				'Four brothers who loved each other, as their mother asked, and one by one ended up fighting. The family is the empire, and the empire has no rules except the family.'
			]
		},
		{
			title: 'The small country',
			body: [
				'Goryeo survives by arriving first, being useful and marrying in. It is Wang Geon’s strategy from Reignmaker, used three centuries later on a bigger guest.'
			]
		}
	],
	arcs: [
		{
			who: 'Kublai',
			steps: ['Chinese tutors', 'Kaiping', 'The audit', 'Chabi’s letter', 'The Goryeo prince', 'Two kurultais', 'Starves his brother', 'Great Yuan', 'Xiangyang', 'Xanadu'],
			mirror: 'Liu Bang and Wang Geon: the listener who wins and grows grand.'
		},
		{
			who: 'Sorghaghtani',
			steps: ['Widowed', 'Refuses Güyük', 'Tutors for her sons', 'Warns Batu', 'The ger', 'Dies winning'],
			mirror: 'Dugu Qieluo in Founders: the wife who makes the dynasty.'
		},
		{
			who: 'Ariq Böke',
			steps: ['Left at home', 'Sulks in the ger', 'Elected at Karakorum', 'Starved', '“Then we were right”'],
			mirror: 'Xiang Yu: the purist who wins battles and loses the war.'
		}
	],
	plants: [
		{ plant: 'Ögedei promises the throne to his own line.', payoff: 'The wagons of weapons, and Kaidu’s forty-year war.' },
		{ plant: 'Güyük’s insult at the feast.', payoff: 'Batu backs the Toluids.' },
		{ plant: 'Kublai gets the Chinese tutors.', payoff: 'Kaiping, the audit, the name Yuan.' },
		{ plant: 'Ariq sulks at the ger in 1251.', payoff: 'The second kurultai.' },
		{ plant: 'Chabi’s letter in 1259.', payoff: 'Kublai reaches the north first.' },
		{ plant: 'Kublai promises Goryeo its customs.', payoff: 'Goryeo survives as a son-in-law kingdom.' },
		{ plant: 'Chabi weeps over the Song treasure.', payoff: 'The next-episode card: the Yuan goes north too.' }
	],
	timeline: [
		{ year: '1227', text: 'Genghis Khan dies.' },
		{ year: '1229', text: 'Ögedei elected.' },
		{ year: '1232', text: 'Tolui dies.' },
		{ year: '1241', text: 'Ögedei dies; Töregene regent.' },
		{ year: '1246', text: 'Güyük elected.' },
		{ year: '1248', text: 'Güyük dies marching west.' },
		{ year: '1251', text: 'Möngke elected; Ögedeid conspiracy and purge.' },
		{ year: '1252', text: 'Sorghaghtani dies.' },
		{ year: '1253', text: 'Kublai conquers Dali.' },
		{ year: '1256', text: 'Kaiping founded.' },
		{ year: '1257', text: 'Möngke’s audit of Kublai.' },
		{ year: '1258', text: 'Hulagu sacks Baghdad.' },
		{ year: '1259', text: 'Möngke dies; Kublai meets the Goryeo crown prince.' },
		{ year: '1260', text: 'Two kurultais; Ain Jalut.' },
		{ year: '1262', text: 'Berke and Hulagu fight on the Terek.' },
		{ year: '1264', text: 'Ariq Böke surrenders.' },
		{ year: '1271', text: 'Yuan proclaimed.' },
		{ year: '1273', text: 'Xiangyang surrenders.' },
		{ year: '1274', text: 'First invasion of Japan.' },
		{ year: '1276', text: 'Hangzhou surrenders.' },
		{ year: '1279', text: 'Yamen; the Song ends.' },
		{ year: '1281', text: 'Second invasion of Japan; Chabi dies.' },
		{ year: '1294', text: 'Kublai dies.' }
	],
	sources: [
		{ title: 'The Secret History of the Mongols (13th century)', body: ['The family’s own story, to Ögedei’s reign: Tolui’s water, the family quarrels.'] },
		{ title: 'Rashid al-Din, Jami al-Tawarikh (c. 1307)', body: ['The Ilkhanate’s history of the Mongols: Sorghaghtani, the 1251 conspiracy, Ariq Böke’s surrender.'] },
		{ title: 'Juvaini, History of the World Conqueror', body: ['Persian, contemporary, eyewitness to the 1251 kurultai.'] },
		{ title: 'Yuanshi (1370)', body: ['The Ming-compiled official Yuan history: Kublai, Chabi, Liu Bingzhong, Xiangyang.'] },
		{ title: 'Goryeosa', body: ['The 1259 meeting, the Goryeo marriages, the Sambyeolcho, the fleets to Japan.'] },
		{ title: 'Carpini, Rubruck, Marco Polo', body: ['European visitors: Güyük’s court, Möngke’s Karakorum, Kublai’s old age.'] }
	],
	research: [
		{
			title: 'Is there a real story here?',
			body: [
				'Yes, and it is a family drama the sources tell as one. Four real successions go wrong in a row, each with documented scenes. 1241–51: the Ögedeid line holds the throne, Güyük marches on Batu and dies on the road, and Sorghaghtani (who had warned Batu) gets her son elected. 1251: the Ögedeids arrive at the kurultai with wagons of weapons; a falconer finds them; seventy-seven princes and officers die in the purge. 1260–64: Möngke dies at Diaoyu and two brothers are elected in the same spring, then fight four years of real battles (Shimultai, Kaiping) until Kublai starves Karakorum and Ariq walks in to surrender. 1262: the cousins Berke and Hulagu fight on the Terek, the first Mongol-on-Mongol war, over Baghdad and grazing.',
				'Behind every one of these sits the same rule, that a khan needs every prince present to be legal, and the same woman, Sorghaghtani, who understood it best. The empire never reunites. That is the ending, and it is history, not a writers’ room.'
			]
		},
		{
			title: 'Who is who',
			body: [
				'Four brothers (Toluids): Möngke the eldest, the auditor; Kublai, the builder; Hulagu, the Ilkhan in Persia; Ariq Böke, the youngest, keeper of the homeland. Two cousins of the Jochid line: Batu, who founds the Golden Horde at Sarai and makes Möngke khan, and his brother Berke, who turns Muslim and goes to war with Hulagu. One cousin of the Ögedeid line, Kaidu, who never comes to a kurultai and fights Kublai for forty years.'
			]
		},
		{
			title: 'The kurultai',
			body: [
				'Mongol succession needs a great assembly of princes and generals. Anyone absent can claim it was illegitimate. This is the structural flaw behind every war in the book.'
			]
		},
		{
			title: 'The four lines',
			body: [
				'Jochids (Golden Horde, Russia), Chagataids (Central Asia), Ögedeids (the original khans, purged in 1251), Toluids (Möngke, Kublai, Hulagu, Ariq). By 1260 the empire is four khanates that only sometimes acknowledge the Great Khan.'
			]
		},
		{
			title: 'Dress and look (production)',
			body: [
				'Deels with right-side closure, fur hats in winter, women’s tall boqta headdresses, gers with felt and lattice, white yak-tail standards. Kublai’s court mixes Mongol dress with Chinese silk and architecture. Persian engineers in turbans; Goryeo officials in red robes and winged caps.'
			]
		}
	],
	places: [
		{ name: 'Karakorum', now: 'Kharkhorin, Mongolia', note: 'The old capital; Ariq’s base.' },
		{ name: 'Kaiping / Shangdu', now: 'Inner Mongolia', note: 'Xanadu; Kublai’s election.' },
		{ name: 'Dadu', now: 'Beijing', note: 'The Yuan capital.' },
		{ name: 'Diaoyu Fortress', now: 'Hechuan, Chongqing', note: 'Where Möngke dies.' },
		{ name: 'Ezhou', now: 'Wuhan', note: 'Kublai’s siege in 1259.' },
		{ name: 'Xiangyang', now: 'Xiangyang, Hubei', note: 'The five-year siege.' },
		{ name: 'Yamen', now: 'Jiangmen, Guangdong', note: 'The end of the Song.' },
		{ name: 'Ganghwa', now: 'Ganghwa Island', note: 'Goryeo’s refuge court.' }
	],
	contested: [
		'How Tolui died: the cup of water (Secret History) or drinking (Persian sources).',
		'Whether Güyük was poisoned.',
		'How Möngke died: disease or a wound.',
		'Whether Ariq Böke was poisoned.',
		'Whether Marco Polo was really at Kublai’s court.',
		'The Tigris running black with ink is a later image.'
	],
	invented: ['All dialogue except quoted lines.', 'The riddle in Chabi’s letter (she did warn him; the wording is ours).', 'Kangrim, if shared.'],
	production: [
		{ title: 'Portraits', body: ['Need: Kublai (young and old), Sorghaghtani, Möngke, Ariq Böke, Hulagu, Chabi, Batu, Güyük, Oghul Qaimish, Wang Jeon, Liu Bingzhong, Kaidu, Lu Xiufu.'] },
		{ title: 'Look', body: ['Palette: Toluid blue and red, Ögedeid black, Golden Horde gold, Song green-white. Signature objects: the white felt, the wagons, the carpet, the trebuchet, the boqta, Xanadu’s cane palace.'] }
	]
};
