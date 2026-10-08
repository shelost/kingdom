import type { Outline } from './types';

export const shahanshah: Outline = {
	slug: 'shahanshah',
	title: 'Shahanshah',
	ko: '샤한샤',
	hanja: '王中王',
	shelf: 'Persia and the Steppe',
	tagline: 'Cyrus the Great · King of Kings',
	era: 'Achaemenid Persia',
	years: 'c. 600–530 BC',
	accent: '#c9a24a',
	logline:
		'His grandfather ordered him killed at birth. A herdsman’s wife raised him instead. He grew up to take his grandfather’s empire, spare him, spare Croesus on a burning pyre, and walk into Babylon without a fight, and then he went one war too far.',
	opening: '“The king dreamed his daughter flooded Asia, which is the sort of dream a king should keep to himself.”',
	altTitles: [
		{ title: 'King of Kings', ko: '왕중왕', note: 'The literal translation. Clear for readers who don’t know the Persian.' },
		{ title: 'The Herdsman’s Son', ko: '목자의 아들', note: 'How the story starts. Fairy-tale register.' },
		{ title: 'The Anointed', ko: '기름 부음 받은 자', note: 'What Isaiah calls him. Ties into the biblical shelf.' },
		{ title: 'Call No Man Happy', ko: '솔론', note: 'The pyre scene’s lesson, and the shape of his life.' },
		{ title: 'Tomyris', ko: '토미리스', note: 'The last chapter’s queen. A title for the tragedy.' }
	],
	images: [
		{
			src: '/stories/shahanshah/poster.jpg',
			alt: 'Cyrus raises a gold falcon standard, seen from below, under a storm sky with Median horsemen behind',
			caption: 'Pasargadae. The herdsman’s son raises the falcon, and the Medes change sides.',
			year: '550 BC',
			kind: 'poster'
		},
		{
			src: '/stories/shahanshah/cassandane.jpg',
			alt: 'Cyrus and Cassandane lie together among purple cushions by lamplight',
			caption: 'Cassandane. The one person Cyrus never conquered; he married her instead.',
			kind: 'romance',
			nsfw: true
		},
		{
			src: '/stories/shahanshah/herdsman.jpg',
			alt: 'A herdsman’s wife clutches a baby wrapped in royal cloth as her husband pleads, a dog at their feet in a lamplit hut',
			caption: 'The swap. Spako has just lost her own child. She keeps the king’s grandson instead.',
			year: 'c. 600 BC',
			episode: 'The Swap',
		},
		{
			src: '/stories/shahanshah/game.jpg',
			alt: 'A ten-year-old Cyrus stands on a rock, staff in hand, as the village boys’ king, while a noble boy crosses his arms and refuses to bow',
			caption: 'The game. The herdsman’s boy is elected king by the village children, and orders the noble’s son punished.',
			year: 'c. 590 BC',
			episode: 'The Game',
		},
		{
			src: '/stories/shahanshah/croesus.jpg',
			alt: 'Cyrus raises his hand to stop the burning of Croesus on a pyre as sudden rain falls',
			caption: 'Sardis. Croesus on the pyre cries “Solon!” three times. Cyrus asks who that is.',
			year: '546 BC',
			episode: 'The Pyre',
		},
		{
			src: '/stories/shahanshah/entry.jpg',
			alt: 'Cyrus rides a white horse through the blue-glazed Ishtar Gate of Babylon as crowds wave palms',
			caption: 'Babylon. The gates open without a battle, and Cyrus takes Marduk by the hand.',
			year: '539 BC',
			episode: 'Without a Battle',
		}
	],
	synopsis: [
		'Astyages, king of the Medes, dreams twice about his daughter: she floods Asia, and then a vine grows from her womb and covers it. He marries her to a modest Persian and orders his trusted kinsman Harpagus to kill her baby. Harpagus passes the job to a herdsman. The herdsman’s wife has just given birth to a dead son, so they swap the bodies.',
		'Ten years later the herdsman’s boy is elected king in a village game and has a noble’s son whipped. Astyages sees his own face in the boy. He spares the child and punishes Harpagus by serving him his own son at dinner. Harpagus thanks the king for the meal. He waits twenty years.',
		'Cyrus grows up and takes back everything. Harpagus brings the Median army over to him, and Astyages is captured and spared. Croesus of Lydia, the richest man in the world, misreads an oracle and loses Sardis. On his pyre he calls the name of a Greek who warned him, and Cyrus, curious, puts the fire out. Babylon’s priests hate their absent king, and they open the gates. Cyrus enters as their god’s chosen man, writes it on a clay cylinder and sends the exiled Jews home to rebuild their temple. Their prophet calls him the anointed.',
		'Then, past sixty, he crosses the Jaxartes to conquer the Massagetae, on Croesus’s clever advice. He tricks the queen’s son with wine. The son kills himself. Queen Tomyris finds the King of Kings on the battlefield and puts his head in a skin full of blood: you wanted blood, drink your fill. His tomb at Pasargadae asks the reader not to begrudge him the small earth that covers him.'
	],
	quotes: [
		{
			text: 'I am Cyrus, king of the world, great king, legitimate king, king of Babylon, king of Sumer and Akkad, king of the four quarters.',
			who: 'Cyrus',
			source: 'The Cyrus Cylinder'
		},
		{
			text: 'If you make war on the Persians, you will destroy a great empire.',
			who: 'The oracle at Delphi, to Croesus',
			source: 'Herodotus 1.53'
		},
		{
			text: 'Call no man happy until he is dead.',
			who: 'Solon, remembered by Croesus on the pyre',
			source: 'Herodotus 1.32'
		},
		{
			text: 'Thus says the Lord to his anointed, to Cyrus, whose right hand I have grasped.',
			who: 'Isaiah 45:1'
		},
		{
			text: 'You who are insatiable for blood, I will give you your fill.',
			who: 'Tomyris, queen of the Massagetae',
			source: 'Herodotus 1.214'
		},
		{
			text: 'O man, whoever you are and wherever you come from, for I know you will come: I am Cyrus, who won the Persians their empire. Do not begrudge me this little earth that covers my body.',
			who: 'Inscription on his tomb at Pasargadae',
			source: 'Plutarch, Life of Alexander'
		}
	],
	cast: [
		{
			name: 'Cyrus',
			lead: true,
			ko: '키루스',
			epithet: 'Shahanshah, King of Kings',
			life: 'c. 600–530 BC',
			side: 'Persia',
			hex: '#c9a24a',
			want: 'To win in a way that leaves people glad he won. Then, older, simply to keep winning.',
			voice: 'Warm, curious, persuasive, likes a riddle and a feast. Asks questions of defeated kings. Grows grander.',
			line: '“Tell me who Solon is. Then we’ll see about the fire.”',
			arc: 'Herdsman’s boy, village king, rebel, conqueror of Media, Lydia and Babylon, liberator of exiles, a head in a wineskin.'
		},
		{
			name: 'Astyages',
			lead: true,
			ko: '아스티아게스',
			epithet: 'The King Who Dreamed',
			life: 'r. c. 585–550 BC',
			side: 'Media',
			hex: '#5a2a6a',
			want: 'To keep his throne from his own blood.',
			voice: 'Courtly, suspicious, cruel with a smile.',
			line: '“Harpagus. Did you enjoy the lamb?”',
			arc: 'Orders a baby killed, punishes the wrong man horribly, loses everything to the baby, lives out his life as his grandson’s guest.'
		},
		{
			name: 'Harpagus',
			lead: true,
			ko: '하르파고스',
			epithet: 'The King’s Meal',
			life: 'fl. 585–540 BC',
			side: 'Media, then Persia',
			hex: '#8a3a2a',
			want: 'Revenge, served cold, and then a quiet life.',
			voice: 'Courteous, controlled, terrifying in his patience.',
			line: '“Whatever the king does is pleasing to me.”',
			arc: 'Spares the baby, eats his son, writes a letter inside a hare, hands Media to Cyrus, conquers Ionia.'
		},
		{
			name: 'Spako',
			ko: '스파코',
			epithet: 'The Herdsman’s Wife',
			life: 'fl. c. 600 BC',
			side: 'Media',
			hex: '#a07a5a',
			want: 'A living child.',
			voice: 'Fierce, earthy, practical.',
			line: '“Put our boy in the royal clothes. They want a dead prince. They’ll get one.”',
			arc: 'Raises Cyrus. Her name means “bitch” in Median, which is why Persians later said a dog nursed him.'
		},
		{
			name: 'Mitradates',
			ko: '미트라다테스',
			epithet: 'The Herdsman',
			life: 'fl. c. 600 BC',
			side: 'Media',
			hex: '#7a6a4a',
			want: 'Not to be killed.',
			voice: 'Frightened, honest, kind.',
			line: '“He told me to leave it on the mountain. He didn’t say which baby.”',
			arc: 'The foster father who confesses under threat of torture.'
		},
		{
			name: 'Mandane',
			ko: '만다네',
			epithet: 'The Daughter of the Dream',
			life: 'fl. c. 600 BC',
			side: 'Media',
			hex: '#c46a8a',
			want: 'Her son.',
			voice: 'Gentle, grieving, then incandescent.',
			line: '“My father dreamed of me and then he took my child.”',
			arc: 'Mourns a son for ten years and gets him back.'
		},
		{
			name: 'Croesus',
			ko: '크로이소스',
			epithet: 'Richest Man in the World',
			life: 'c. 595–after 546 BC',
			side: 'Lydia, then Persia',
			hex: '#d9b13a',
			want: 'To be told he’s happy.',
			voice: 'Charming, vain, then wise in a slightly irritating way.',
			line: '“They aren’t looting my city any more, Cyrus. They’re looting yours.”',
			arc: 'Asks the oracle, destroys an empire (his own), calls Solon from the pyre, becomes Cyrus’s adviser and gives the advice that kills him.'
		},
		{
			name: 'Cassandane',
			ko: '카산다네',
			epithet: 'The Queen He Mourned',
			life: '?–c. 538 BC',
			side: 'Persia',
			hex: '#8ab0c0',
			want: 'For him to stay the boy from the village.',
			voice: 'Dry, loving, sees through him.',
			line: '“King of the four quarters. Take your boots off in my tent.”',
			arc: 'His wife. When she dies, the empire mourns for six days.'
		},
		{
			name: 'Nabonidus',
			ko: '나보니두스',
			epithet: 'The Absent King',
			life: 'r. 556–539 BC',
			side: 'Babylon',
			hex: '#3a4a8a',
			want: 'To restore the moon god in the desert, and be left alone.',
			voice: 'Scholarly, obsessive, archaeologist of his own empire.',
			line: '“I was digging. What do you mean, the festival?”',
			arc: 'Spends ten years at an oasis in Arabia, skips the New Year rites, and loses Babylon’s priests.'
		},
		{
			name: 'Belshazzar',
			ko: '벨사살',
			epithet: 'The Feast Prince',
			life: '?–539 BC',
			side: 'Babylon',
			hex: '#6a3a8a',
			want: 'One good party.',
			voice: 'Bored, proud, drunk.',
			line: '“Bring the cups from the Jews’ temple. They’re prettier.”',
			arc: 'Regent of Babylon; in Daniel, the writing on the wall.'
		},
		{
			name: 'Tomyris',
			ko: '토미리스',
			epithet: 'Queen of the Massagetae',
			life: 'fl. 530 BC',
			side: 'Massagetae',
			hex: '#b5452f',
			want: 'Her son back, and then his killer.',
			voice: 'Plain, contemptuous of tricks, a steppe queen’s directness.',
			line: '“Give me my son and go home with a third of your army, and I’ll call it even.”',
			arc: 'Refuses his marriage offer, loses her son to wine, kills the King of Kings.'
		},
		{
			name: 'Spargapises',
			ko: '스파르가피세스',
			epithet: 'The Queen’s Son',
			life: '?–530 BC',
			side: 'Massagetae',
			hex: '#a0603a',
			want: 'To win his first battle.',
			voice: 'Young, brave, ashamed.',
			line: '“Untie my hands. Please. Just my hands.”',
			arc: 'Captured drunk; asks to be untied, and kills himself.'
		}
	],
	bonds: [
		{
			a: 'Cyrus',
			b: 'Harpagus',
			kind: 'The man who should have killed him',
			body: 'Harpagus spared him by passing the job down. He paid for it with his own son at a banquet. He spends twenty years waiting, then sends Cyrus the letter in the hare. Cyrus owes him everything and is slightly afraid of him. Their scenes are polite to the point of menace, two men who know exactly what the other one has survived.'
		},
		{
			a: 'Cyrus',
			b: 'Astyages',
			kind: 'Grandson and grandfather',
			body: 'The old man ordered him exposed, then spared him for looking like family. When Cyrus wins, he keeps Astyages at court for the rest of his life. They eat together. The book should let the reader wonder whether that is mercy or the longest revenge in the story.'
		},
		{
			a: 'Cyrus',
			b: 'Croesus',
			kind: 'The defeated adviser',
			body: 'He puts out the fire because Croesus says something interesting. For sixteen years the richest man in the world is his conversation partner, always clever and usually right. His last piece of advice, the wine trap, is the one that kills Cyrus.'
		},
		{
			a: 'Cyrus',
			b: 'Tomyris',
			kind: 'The queen he underestimated',
			body: 'He proposes marriage to take her country; she sees through it. He tricks her son; she warns him plainly. Every one of his old virtues (curiosity, generosity, patience) is missing in this last chapter. She is the mirror he doesn’t look in.'
		},
		{
			a: 'Cyrus',
			b: 'Spako',
			kind: 'The mother who chose him',
			body: 'A herdsman’s wife who had just buried her own baby. Cyrus calls her mother long after he knows. The dog story is what the Persians tell to make it a miracle; the book prefers her.'
		}
	],
	parts: [
		{
			id: 'boy',
			title: 'The Herdsman’s Son',
			ko: '목자의 아들',
			years: 'c. 600–590 BC',
			summary: 'Fairy tale with teeth. A dream, a swap, a game and a terrible dinner.',
			episodes: [
				{
					title: 'Two Dreams',
					ko: '두 개의 꿈',
					year: 'c. 600 BC',
					hook: 'King Astyages dreamed his daughter flooded Asia, so he married her to a Persian.',
					beats: [
						'The magi interpret: her son will rule in your place. The king picks a son-in-law from the Persians, a mild vassal people.',
						'Mandane is pregnant. He dreams again: a vine from her womb covers all of Asia.',
						'He brings her home and waits.',
						'When the baby is born he calls Harpagus. “Take it and kill it. Bury it as you like.”'
					],
					next: 'Harpagus doesn’t want blood on his hands. He knows a herdsman…!'
				},
				{
					title: 'The Swap',
					ko: '바꿔치기',
					year: 'c. 600 BC',
					hook: 'The herdsman came home with a baby in gold cloth, and his wife had just buried hers.',
					beats: [
						'Harpagus orders the herdsman Mitradates to leave the baby on the mountain.',
						'At home, Spako has given birth to a stillborn son.',
						'She takes the living baby and dresses the dead one in the royal clothes. Mitradates leaves that on the mountain.',
						'Harpagus’s men come to check. They find a dead baby in royal cloth and bury it.'
					],
					next: 'Ten years later, the village children are playing king…!'
				},
				{
					title: 'The Game',
					ko: '왕 놀이',
					year: 'c. 590 BC',
					hook: 'The village boys elected the herdsman’s son king, and he took it very seriously.',
					beats: [
						'He appoints guards, builders and a messenger. The son of the noble Artembares refuses to obey.',
						'The boy king has him held down and whipped.',
						'Artembares complains to Astyages. The herdsman and his son are summoned.',
						'The boy answers the king like a king. Astyages looks at his face and goes very quiet.'
					],
					next: 'The herdsman confesses. Harpagus is invited to dinner…!'
				},
				{
					title: 'Harpagus’s Dinner',
					ko: '하르파고스의 만찬',
					year: 'c. 590 BC',
					hook: 'The king forgave Harpagus, and asked him to send his son to play with the boy.',
					beats: [
						'Mitradates confesses under threat of torture. Harpagus tells the truth too.',
						'Astyages says he’s glad: the boy lives, the gods are satisfied. Send your son over, and come to a feast tonight.',
						'At the feast Harpagus eats well. After, a covered basket: his son’s head, hands and feet.',
						'“Do you know what animal you ate?” “I do. Whatever the king does is pleasing.” He carries the remains home.'
					],
					next: 'The magi say the dream is fulfilled: the boy was king, in a game. Send him to Persia…!'
				}
			]
		},
		{
			id: 'hare',
			title: 'The Hare',
			ko: '토끼',
			years: '553–550 BC',
			summary: 'A letter in a hare, a day of thorns and a day of feasting, and an army that changes sides.',
			episodes: [
				{
					title: 'The Letter in the Hare',
					ko: '토끼 속의 편지',
					year: '553 BC',
					hook: 'Harpagus sent Cyrus a hare, and told the messenger to say Cyrus should open it alone.',
					beats: [
						'Cyrus, grown, rules the Persian tribes as his father’s heir.',
						'A hunter brings a hare with its belly sewn up. Inside is a letter: revolt, and the Median nobles will come over. I will.',
						'He reads it twice. He knows what Harpagus ate.',
						'He burns the letter and calls the clans.'
					],
					next: 'Persians don’t like change. He has a way to show them…!'
				},
				{
					title: 'Thorns and Feast',
					ko: '가시와 잔치',
					year: '553 BC',
					hook: 'Cyrus made the Persians clear a field of thorns all day, and the next day he threw them a party.',
					beats: [
						'Day one: every man brings a sickle and clears a field of thorns in the sun.',
						'Day two: he slaughters his father’s flocks and serves wine and bread on the grass.',
						'“Which day did you prefer?” “There’s no comparison.”',
						'“Follow me, and every day is the second day. Stay, and you clear thorns for the Medes.” They follow.'
					],
					next: 'Astyages sends his army against the rebels. He chooses Harpagus to lead it…!'
				},
				{
					title: 'Defection',
					ko: '변절',
					year: '552–550 BC',
					hook: 'Astyages put Harpagus in charge of the army, which tells you everything about Astyages.',
					beats: [
						'Half the Median army goes over to Cyrus in the first battle. The rest run.',
						'Astyages impales the magi who told him the dream was fulfilled, arms the old men and boys, and marches himself.',
						'Near Pasargadae, the Persians break and flee. Their women meet them on the hill and lift their skirts: “Do you want to crawl back in?” (Later tradition.) They turn.',
						'Astyages is captured. Harpagus comes to his tent to mock him. The old king: “You gave a kingdom to a Persian for one dinner. You are the stupidest and most wicked man alive.”'
					],
					next: 'Cyrus spares his grandfather. In the west, the richest man in the world is consulting an oracle…!'
				}
			]
		},
		{
			id: 'croesus',
			title: 'Solon',
			ko: '솔론',
			years: '547–546 BC',
			summary: 'A rich king misreads a prophecy and is saved from the fire by a story.',
			episodes: [
				{
					title: 'A Great Empire',
					ko: '거대한 제국',
					year: '547 BC',
					hook: 'The oracle told Croesus that if he attacked Persia he would destroy a great empire, and he never asked which one.',
					beats: [
						'Croesus is so rich he has tested every oracle in the Greek world and settled on Delphi.',
						'Years ago, Solon of Athens visited and refused to call Croesus the happiest man alive: “Count no man happy until he is dead.”',
						'Croesus crosses the Halys. Indecisive battle at Pteria. It’s autumn; he goes home and disbands his army.',
						'Cyrus doesn’t go home.'
					],
					next: 'Lydia has the best cavalry in the world. Cyrus has camels…!'
				},
				{
					title: 'Camels',
					ko: '낙타',
					year: '546 BC',
					hook: 'Lydian horses had never smelled a camel, so Cyrus put camels in his front line.',
					beats: [
						'Harpagus’s idea: unload the baggage camels, put riders on them, send them first.',
						'The Lydian horses bolt. The Lydians dismount and fight bravely on foot. It doesn’t matter.',
						'Sardis is besieged fourteen days. A Persian soldier sees a Lydian climb down a cliff for a fallen helmet, and climbs up the same way.',
						'The city falls. A mute son of Croesus, seeing a Persian about to kill his father, speaks for the first time: “Don’t kill Croesus!”'
					],
					next: 'Croesus is chained on a pyre…!'
				},
				{
					title: 'The Pyre',
					ko: '화형대',
					year: '546 BC',
					hook: 'On the pyre, with the fire lit, Croesus shouted the name of a Greek three times.',
					beats: [
						'Fourteen Lydian boys and their king are chained on the wood.',
						'“Solon! Solon! Solon!” Cyrus has interpreters ask who that is.',
						'Croesus tells the story: a man who wouldn’t call me happy. Cyrus thinks of his own life, of thorns and feasts and dinners.',
						'He orders the fire put out. It’s too late; it won’t go out. Croesus prays to Apollo, and from a clear sky a storm puts it out.'
					],
					next: 'The richest man in the world has a new job…!'
				},
				{
					title: 'Whose City',
					ko: '누구의 도시',
					year: '546 BC',
					hook: 'Croesus watched the Persians loot Sardis and pointed out it was no longer his city.',
					beats: [
						'“What are they doing?” “Sacking your city.” “Not mine. Yours. They’re carrying off your money.”',
						'Cyrus stops the looting and makes him an adviser.',
						'Croesus sends his chains to Delphi to ask Apollo if he’s ashamed. Apollo: you should have asked which empire.',
						'Plant: Croesus is always right in a way that costs someone else.'
					],
					next: 'The Greek cities of Ionia want to surrender now. Cyrus has a story about a flute…!'
				}
			]
		},
		{
			id: 'babylon',
			title: 'Babylon',
			ko: '바빌론',
			years: '545–538 BC',
			summary: 'The fluteplayer, a river punished, a feast with writing on the wall and the gates opened from the inside.',
			episodes: [
				{
					title: 'The Fluteplayer',
					ko: '피리 부는 사람',
					year: '545 BC',
					hook: 'The Ionian Greeks offered to submit, and Cyrus told them a story about fish.',
					beats: [
						'A man played the flute to the fish, hoping they would come out and dance. They didn’t. He netted them, and as they flopped on the shore he said: “Stop dancing. You wouldn’t dance when I played.”',
						'Harpagus conquers Ionia with siege mounds, one city at a time.',
						'The Phocaeans sail away to the west rather than surrender; the Teians too.',
						'Cyrus turns east, to the Bactrians and Sakas, for five years.'
					],
					next: 'A sacred white horse drowns in the Gyndes…!'
				},
				{
					title: 'The Gyndes',
					ko: '긴데스 강',
					year: '539 BC',
					hook: 'A river drowned one of Cyrus’s sacred white horses, so he punished the river.',
					beats: [
						'Marching on Babylon, a white horse plunges into the Gyndes and is swept away.',
						'Cyrus swears to make the river so weak a woman could cross it without wetting her knees.',
						'The army spends the summer digging three hundred and sixty channels.',
						'The narrator: the first sign that his anger can be larger than his reason.'
					],
					next: 'In Babylon, the prince is hosting a party…!'
				},
				{
					title: 'The Writing on the Wall',
					ko: '벽의 글씨',
					year: '539 BC',
					hook: 'Belshazzar drank from the Jerusalem temple cups, and a hand came out of the wall and wrote.',
					beats: [
						'King Nabonidus has spent ten years in the Arabian desert. The priests of Marduk are furious; the New Year rite hasn’t been held.',
						'His son Belshazzar holds a feast, using the gold vessels taken from Jerusalem.',
						'A hand writes on the plaster. A Jewish exile, Daniel, reads it: numbered, weighed, divided (Daniel 5; legend).',
						'Cross-shelf plant: the cups taken in Kings, Part 6. They are about to go home.'
					],
					next: 'That night, Cyrus’s men walk in…!'
				},
				{
					title: 'Without a Battle',
					ko: '싸움 없이',
					year: '539 BC',
					hook: 'Babylon had the highest walls in the world, and someone opened the gate.',
					beats: [
						'After a battle at Opis, Sippar falls without a fight. Gubaru enters Babylon without a battle (Babylonian chronicle). Herodotus says the river was lowered and the army walked up the riverbed during a festival.',
						'Cyrus enters seventeen days later. Green branches are spread before him.',
						'He takes the hand of Marduk’s statue at the New Year rite. He had the clay cylinder written in Marduk’s voice: the god chose Cyrus.',
						'Nabonidus is spared and exiled.'
					],
					next: 'The Jews in Babylon have a petition…!'
				},
				{
					title: 'Go Home',
					ko: '돌아가라',
					year: '538 BC',
					hook: 'Cyrus told the exiles they could go home, and gave them back their cups.',
					beats: [
						'An edict: the God of heaven has charged me to build him a house in Jerusalem. Whoever wants to go may go.',
						'The temple vessels are counted out to Sheshbazzar. Five thousand four hundred gold and silver pieces.',
						'Isaiah: “his anointed, Cyrus, whose right hand I hold.” A foreign king in the Hebrew scriptures, called messiah.',
						'Cassandane dies. The empire mourns six days. Cyrus is quieter after that.'
					],
					death: 'Cassandane',
					next: 'He is over sixty. North of the Jaxartes there is a queen…!'
				}
			]
		},
		{
			id: 'tomyris',
			title: 'Tomyris',
			ko: '토미리스',
			years: '530 BC',
			summary: 'The last campaign: a marriage refused, a trap with wine, a son’s shame and a skin full of blood.',
			episodes: [
				{
					title: 'The Proposal',
					ko: '청혼',
					year: '530 BC',
					hook: 'Cyrus offered to marry the queen of the Massagetae, and she knew he was proposing to her country.',
					beats: [
						'Tomyris refuses. He bridges the Araxes.',
						'She sends word: stop. Or if you must fight, I’ll fall back three days and you cross; or you fall back and I will.',
						'Croesus advises: cross, then leave a camp full of wine and food, and let them find it. Nomads don’t know wine.',
						'Cyrus dreams that young Darius has wings shadowing Asia and Europe. He sends his son Cambyses home with Croesus.'
					],
					next: 'The camp is laid out like a feast…!'
				},
				{
					title: 'The Wine',
					ko: '포도주',
					year: '530 BC',
					hook: 'The Massagetae found a camp full of wine, which they had never tasted.',
					beats: [
						'A third of the queen’s army, under her son Spargapises, takes the bait camp.',
						'They eat and drink and fall asleep. The Persians come back.',
						'Spargapises wakes up a prisoner. He asks to be untied. Cyrus agrees.',
						'He kills himself with the first free hand.'
					],
					death: 'Spargapises',
					next: 'Tomyris has a message for Cyrus…!'
				},
				{
					title: 'Your Fill',
					ko: '배불리',
					year: '530 BC',
					hook: 'Tomyris told him she would give him his fill of blood, and she was the only one who ever kept a promise like that.',
					beats: [
						'Her message: you beat my son with a drug, not a fight. Leave now, or I swear by the sun I will give you your fill.',
						'The fiercest battle Herodotus ever heard of. Most of the Persians die. So does Cyrus.',
						'She has a skin filled with human blood and pushes his head into it.',
						'Kangrim, if the series shares him: “Were you the herdsman’s son, or the King of Kings?” Cyrus: “Ask Spako.”'
					],
					death: 'Cyrus',
					next: 'Two hundred years later, a Macedonian comes to read his tomb…!'
				},
				{
					title: 'Pasargadae',
					ko: '파사르가다에',
					year: '324 BC',
					hook: 'Alexander found the tomb looted, and had it restored, and read the inscription twice.',
					beats: [
						'A small stone house on six steps, in a garden.',
						'Robbers have broken in. Alexander has the tomb restored and the robbers punished.',
						'The inscription: do not begrudge me this little earth.',
						'The narrator: other versions say Cyrus died in bed, surrounded by his sons. The book chooses the queen, and tells you so.'
					],
					next: 'THE END. His son Cambyses will go to Egypt, and a man called Darius has already had wings in a dream…!'
				}
			]
		}
	],
	themes: [
		{
			title: 'Mercy as strategy',
			body: [
				'Astyages, Croesus, Nabonidus and the Jews are all spared. Cyrus’s mercy is genuine and also brilliant policy. The book lets both be true until the last chapter, where he forgets both.'
			]
		},
		{
			title: 'Dreams and readers',
			body: [
				'Every disaster starts with a misread sign: the vine, the oracle, the hand on the wall, the winged Darius. The kings who ask what it means are spared; the ones who decide too quickly are destroyed.'
			]
		},
		{
			title: 'Call no man happy',
			body: [
				'Solon’s line hangs over the whole book. Cyrus is the happiest man alive for thirty years, and the story isn’t finished.'
			]
		},
		{
			title: 'Who gets to tell it',
			body: [
				'The Greeks (Herodotus, Xenophon), the Babylonians (the Cylinder, the Chronicle) and the Hebrews (Isaiah, Ezra) each have their own Cyrus. The narrator lets them disagree on the page.'
			]
		}
	],
	arcs: [
		{
			who: 'Cyrus',
			steps: ['Swapped', 'Village king', 'Thorns and feast', 'Spares the grandfather', 'Puts out the fire', 'Opens the gate', 'Sends them home', 'Punishes a river', 'The wine trap', 'Your fill'],
			mirror: 'Jumong and Hyukgose in Samhan: the exposed child who becomes a founder.'
		},
		{
			who: 'Harpagus',
			steps: ['Passes the order down', 'Eats his son', 'The hare', 'Turns the army', 'Mocks the old king'],
			mirror: 'Gyeon Hwon in Reignmaker: a grievance carried for decades.'
		},
		{
			who: 'Croesus',
			steps: ['Asks the oracle', 'Disbands his army', 'Solon on the pyre', 'Whose city', 'The wine trap'],
			mirror: 'Fan Zeng in A Match for Ten Thousand: the brilliant adviser whose advice is fatal.'
		}
	],
	plants: [
		{ plant: 'Spako’s name means “dog”.', payoff: 'The Persian legend that a dog nursed Cyrus.' },
		{ plant: 'Harpagus says “whatever the king does is pleasing.”', payoff: 'He hands Astyages’s army to Cyrus.' },
		{ plant: 'Solon refuses to call Croesus happy.', payoff: 'The pyre; and Cyrus’s own end.' },
		{ plant: 'Croesus is always right in a way that costs someone else.', payoff: 'The wine trap.' },
		{ plant: 'The Jerusalem cups at Belshazzar’s feast.', payoff: 'Counted out and sent home.' },
		{ plant: 'Cyrus punishes the Gyndes for a horse.', payoff: 'He punishes Tomyris’s son for a battle.' },
		{ plant: 'The dream of winged Darius.', payoff: 'The next-episode card.' }
	],
	timeline: [
		{ year: 'c. 600 BC', text: 'Cyrus born (date uncertain).' },
		{ year: '559 BC', text: 'Cyrus becomes king of Anshan (Persia).' },
		{ year: '553 BC', text: 'Revolt against Media begins.' },
		{ year: '550 BC', text: 'Astyages captured; Ecbatana taken.' },
		{ year: '547 BC', text: 'Battle of Pteria.' },
		{ year: '546 BC', text: 'Thymbra; Sardis falls.' },
		{ year: '545–540 BC', text: 'Harpagus conquers Ionia; Cyrus campaigns in the east.' },
		{ year: '539 BC', text: 'Opis; Babylon taken without a battle.' },
		{ year: '538 BC', text: 'Edict allowing the Jews to return.' },
		{ year: '530 BC', text: 'Cyrus killed fighting the Massagetae (Herodotus).' },
		{ year: '324 BC', text: 'Alexander restores the tomb at Pasargadae.' }
	],
	sources: [
		{ title: 'Herodotus, Histories, Book 1 (c. 430 BC)', body: ['The dreams, the swap, the game, the dinner, the hare, Croesus, the Gyndes, Babylon, Tomyris. The narrative spine.'] },
		{ title: 'Xenophon, Cyropaedia (c. 370 BC)', body: ['An idealised novel of Cyrus as the perfect ruler. Use for his voice and his court, not his facts. Has him die in bed.'] },
		{ title: 'The Cyrus Cylinder and the Nabonidus Chronicle', body: ['Babylonian documents: Cyrus as Marduk’s chosen king, Babylon taken without a battle.'] },
		{ title: 'Isaiah 44–45, Ezra 1, Daniel 5', body: ['Cyrus as the anointed liberator; the edict; the writing on the wall.'] },
		{ title: 'Ctesias, Nicolaus of Damascus, Polyaenus', body: ['Alternative birth stories (Cyrus as son of a bandit), and the Persian women at Pasargadae.'] }
	],
	research: [
		{
			title: 'Medes and Persians',
			body: [
				'Two related Iranian peoples. The Medes ruled from Ecbatana; the Persians were vassals in the south-west (Fars), around Anshan. Cyrus’s conquest was a revolution inside the family.'
			]
		},
		{
			title: 'Religion',
			body: [
				'Iranian worship of Ahura Mazda and the sacred fire, the magi as priests and dream-readers. Cyrus is tolerant in practice: he restores Marduk, sends Yahweh’s cups home and leaves local gods alone.'
			]
		},
		{
			title: 'Dress and look (production)',
			body: [
				'Early Persian dress: long robes, trousers, soft caps or tall felt hats, beards curled, earrings and torques. Median riding coats. Lydian gold and electrum. Babylon in blue glazed brick with gold animals. Massagetae in bronze and leather on the steppe.'
			]
		}
	],
	places: [
		{ name: 'Ecbatana', now: 'Hamadan, Iran', note: 'The Median capital.' },
		{ name: 'Pasargadae', now: 'Fars, Iran', note: 'Cyrus’s capital and tomb.' },
		{ name: 'Sardis', now: 'Sart, Turkey', note: 'Croesus’s capital.' },
		{ name: 'Babylon', now: 'Hillah, Iraq', note: 'Taken without a battle.' },
		{ name: 'Gyndes', now: 'Diyala River, Iraq', note: 'The punished river.' },
		{ name: 'Araxes / Jaxartes', now: 'Syr Darya (likely)', note: 'Where he crosses to the Massagetae.' }
	],
	contested: [
		'How Cyrus died. Herodotus says killed by Tomyris; Xenophon says in bed; Ctesias says in battle against the Derbices.',
		'The birth story is a folk tale shared with Sargon, Moses and Romulus.',
		'Whether Babylon fell by riverbed (Herodotus) or opened its gates (the Chronicle).',
		'The writing on the wall is from Daniel, a later text; Belshazzar was real but regent, not king.',
		'Whether the Cyrus Cylinder is a declaration of rights (modern claim) or standard Mesopotamian royal propaganda (most scholars).'
	],
	invented: ['All dialogue except quoted lines.', 'The Kangrim question, if shared.', 'Cyrus calling Spako mother after he knows.'],
	production: [
		{ title: 'Portraits', body: ['Need: Cyrus (boy, young king, old king), Astyages, Harpagus, Spako, Mitradates, Mandane, Croesus, Cassandane, Nabonidus, Belshazzar, Tomyris, Spargapises.'] },
		{ title: 'Look', body: ['Palette: Persian gold and sky blue, Median purple, Lydian gold, Babylon lapis. Signature objects: the hare, the basket, the pyre, the camels, the cylinder, the Jerusalem cups, the wineskin.'] }
	]
};
