import type { Episode, Outline, Person } from './types';

function ep(title: string, ko: string, year: string, hook: string, beats: string[], next: string): Episode {
	return { title, ko, year, hook, beats, next };
}

function who(p: Omit<Person, 'want' | 'voice' | 'line' | 'arc'> & Partial<Pick<Person, 'want' | 'voice' | 'line' | 'arc'>>): Person {
	return {
		want: p.want ?? '',
		voice: p.voice ?? '',
		line: p.line ?? '',
		arc: p.arc ?? '',
		...p
	};
}

export const reignmaker: Outline = {
	slug: 'reignmaker',
	title: 'Kingmaker',
	ko: '태종대왕',
	hanja: '太宗大王',
	shelf: 'Samhan',
	badge: 'Taejong',
	tagline: 'Yi Bang-won, from the house in Hamhung to Heonreung',
	era: 'Late Goryeo and early Joseon',
	years: '1367–1422',
	accent: '#8f2d2d',
	logline:
		'The fifth son of a general is the only one sent to the books. He passes the exam, kills the man who would not kneel, refuses a crown, takes it two years later, and spends the rest of his life removing every second power in the room, including the brothers of the woman who armed him. He dies in 1422, buried with her. His third son is already king.',
	opening: '“There were five sons in the general’s house, and only one of them could read the order that would kill the others.”',
	altTitles: [
		{ title: 'The Fifth Son', ko: '다섯째', note: 'The shelf’s first book. He is never the eldest, and he never forgets it.' },
		{ title: 'Sonjuk Bridge', ko: '선죽교', note: 'The night the Goryeo loyalist dies, and the night Bang-won becomes the plot.' },
		{ title: 'Two Nights', ko: '두 밤', note: '1398 and 1400. He clears the heir, then his own brother.' },
		{ title: 'The Retired King', ko: '상왕', note: 'He gives Sejong the crown and keeps the army until the last year.' }
	],
	images: [],
	synopsis: [
		'Yi Bang-won is born in 1367 in the private house at Gwiju, Hamhung, the fifth son of Yi Seong-gye and Lady Han, later Queen Sinui. The house is soldiers. His father sends this one to study, under Won Cheon-seok, near Gil Jae. In 1383 he passes the civil examination. No other son in the family can. In 1388 he is twenty-one and already inside his father’s turn at Wihwa.',
		'The same year he goes to Nanjing as secretary to Yi Saek, to ask Ming to keep a Goryeo king. In the spring of 1392 his father falls from a horse while hunting at Haeju. Jeong Mong-ju uses the sickbed. Bang-won has his father carried home overnight and sends Jo Yeong-gyu to Sonjuk Bridge. Jeong Mong-ju’s poem is the last Goryeo argument. In the seventh month Yi Seong-gye takes the throne. In the eighth, Bang-won is made Prince Jeongan and left off the merit list. Queen Sindeok and Jeong Do-jeon name the child Bang-seok heir.',
		'In 1394 Ming demands a prince. Bang-won goes, meets the Hongwu emperor, and comes home useful and still not the heir. In the eighth month of 1398 Jeong Do-jeon is about to abolish the princes’ private armies and send them at Liaodong. Queen Wongyeong, of the Yeoheung Min, hides weapons in the house after the disarmament order. On the twenty-sixth day Bang-won strikes with his full brothers Bang-ui and Bang-gan. Jeong Do-jeon, Nam Eun, and Bang-seok die. He refuses the crown and puts Bang-gwa up as Jeongjong. In 1400 Bang-gan and Bak Po come for him. He wins, is named heir, and in the eleventh month Jeongjong abdicates.',
		'As Taejong he does to everyone else what the first night did to him. Private armies go. The state council becomes the Uijeongbu. In 1401 he hangs the sinmungo, a drum any subject may strike, and Ming invests him, the first Joseon king to receive it. He moves the capital back to Hanyang. Around 1406 he kills Queen Wongyeong’s brothers. She armed him in 1398. Her clan will not be a second court. In 1418 he sets Yangnyeong aside, skips the son who prefers the temple, names the third son Chungnyeong, and abdicates as Sangwang while keeping the army. Officials who opposed the choice, and Sejong’s father-in-law Sim On, do not survive the year.',
		'Wongyeong dies in 1420. In the last year he loosens his grip. He dies on 30 May 1422 and is buried with her at Heonreung. The series ends on his death. Sejong’s alphabet is another reign.'
	],
	quotes: [
		{
			text: 'This body, dying and dying again, a hundred times over, white bones become dust, soul or not — that loyal heart toward my lord, can it ever fade?',
			who: 'Jeong Mong-ju',
			source: 'Dansimga, sung at the 1392 feast',
			original: '이 몸이 죽고 죽어 일백 번 고쳐 죽어 백골이 진토되어 넋이라도 있고 없고 임 향한 일편단심이야 가실 줄이 있으랴'
		}
	],
	cast: [
		who({
			name: 'Yi Bang-won',
			ko: '이방원',
			hanja: '李芳遠',
			epithet: 'the fifth son',
			life: '1367–1422',
			side: 'Joseon',
			hex: '#8f2d2d',
			lead: true,
			want: 'One throne, one army, and no second house that can say no.',
			voice: 'Short when he has decided. He quotes when he wants the room to hear that he studied.',
			line: 'I will not take it. Put my brother on it.',
			arc: 'From the examination to the tomb, he removes every rival the reign produces, including the family that made the first night possible.'
		}),
		who({
			name: 'Yi Seong-gye',
			ko: '이성계',
			hanja: '李成桂',
			epithet: 'the general',
			life: '1335–1408',
			side: 'Joseon',
			hex: '#3d4f3a',
			want: 'To stop an invasion he thinks will empty the country, and then to be left alone with the throne he was handed.',
			voice: 'A soldier’s plain speech. He does not enjoy the sentences his son finishes.',
			line: 'Four reasons. Then we turn.',
			arc: 'He makes the turn at Wihwa. His son makes the country, and the father spends the new reign in grief.'
		}),
		who({
			name: 'Queen Wongyeong',
			ko: '원경왕후',
			hanja: '元敬王后',
			epithet: 'the hidden weapons',
			life: '1365–1420',
			side: 'Joseon',
			hex: '#6a3a5a',
			want: 'Her husband’s house standing, and her own brothers alive inside it.',
			voice: 'She does not plead in public. The argument happens where the weapons were hidden.',
			line: 'I armed you. Remember who held them.',
			arc: 'She makes the first night possible and loses her brothers to the king that night produced.'
		}),
		who({
			name: 'Jeong Mong-ju',
			ko: '정몽주',
			hanja: '鄭夢周',
			epithet: 'a hundred deaths',
			life: '1337–1392',
			side: 'Goryeo',
			hex: '#1c3a5a',
			want: 'Goryeo, even after the horses have turned.',
			voice: 'A poem when a speech would be safer. One verse, and he sits down.',
			line: 'Can it ever fade?',
			arc: 'He is the last man who will not cross. Bang-won has him killed on the way home, and later, as king, rehabilitates the name.'
		}),
		who({
			name: 'Jeong Do-jeon',
			ko: '정도전',
			hanja: '鄭道傳',
			epithet: 'the writer of the state',
			life: '1342–1398',
			side: 'Joseon',
			hex: '#c4a35a',
			want: 'A king small enough to live inside the laws Jeong writes, and a child who can be taught them.',
			voice: 'Long, structural, sure the room will still be there when he finishes.',
			line: 'A king is the office. The man is replaceable.',
			arc: 'He builds Joseon for a child heir and dies on the night the fifth son disagrees.'
		}),
		who({
			name: 'Sejong',
			ko: '세종',
			hanja: '世宗',
			epithet: 'the third son',
			life: '1397–1450',
			side: 'Joseon',
			hex: '#2a5a3a',
			want: 'To be the king his father chose, and to outlive the choosing.',
			voice: 'Quiet, precise. He does not compete with the retired king in the room.',
			line: 'You named me. I heard you.',
			arc: 'He is crowned in 1418 because his father removes the brothers in front of him. This book ends before his own reign begins.'
		})
	],
	bonds: [
		{ a: 'Yi Bang-won', b: 'Yi Seong-gye', kind: 'father', body: 'The general makes the turn. The son makes the murders the general will not sign, and then takes the crown the general put down.' },
		{ a: 'Yi Bang-won', b: 'Queen Wongyeong', kind: 'marriage', body: 'She hides the weapons for the first night. He later kills her brothers so the Min clan cannot be a court of its own.' },
		{ a: 'Yi Bang-won', b: 'Jeong Mong-ju', kind: 'the bridge', body: 'The poem is a refusal. Bang-won’s answer is Jo Yeong-gyu, on the road home. As king he restores the dead man’s rank.' },
		{ a: 'Yi Bang-won', b: 'Sejong', kind: 'the third son', body: 'He skips the eldest and the temple-bound second and puts the crown on the reader. He keeps the army until the year he dies.' }
	],
	parts: [
		{
			id: 'fifth',
			title: 'The Fifth Son',
			ko: '다섯째',
			years: '1367–1388',
			summary: 'Hamhung, the books, the exam, and the island where his father turns.',
			episodes: [
				ep('Hamhung', '함흥', '1367', 'A general’s fifth son, born in a private house at Gwiju.', ['Lady Han.', 'A house of soldiers.', 'The boy who will be sent away from the horses.'], 'His father decides this one will read…!'),
				ep('The Books', '글', '1377', 'Won Cheon-seok gets the son nobody else in the family can spare.', ['Gil Jae in the same village.', 'Sungkyunkwan later.', 'A military house that wants one scholar.'], 'The examination is the proof…!'),
				ep('The Examination', '문과', '1383', 'He passes. The other sons cannot.', ['U’s ninth year.', 'The only civil graduate in the house.', 'A scholar with a general’s father.'], 'Four years later the army is on an island…!'),
				ep('Wihwa', '위화도', '1388', 'He is twenty-one, and the turn is already his father’s plan, which means it is his.', ['The Yalu.', 'Four reasons, said by the general.', 'The son who understands before the horses face south.'], 'Ming still has to be asked…!')
			]
		},
		{
			id: 'bridge',
			title: 'The Bridge',
			ko: '선죽교',
			years: '1388–1392',
			summary: 'Nanjing, a fall from a horse, a poem, and a crown he is not given.',
			episodes: [
				ep('Nanjing', '남경', '1388', 'He goes as Yi Saek’s secretary to ask Ming to keep a Goryeo king.', ['A real court.', 'He is there to protect a house he will later replace.', 'He comes home into the coup.'], 'His father goes hunting at Haeju…!'),
				ep('The Horse', '낙마', '1392', 'The general falls. Jeong Mong-ju does not wait for him to stand.', ['Haeju.', 'The sickbed as a weapon.', 'Bang-won has his father carried to Gaegyeong overnight.'], 'There is a bridge on the way home from the feast…!'),
				ep('Sonjuk Bridge', '선죽교', '1392', 'Jo Yeong-gyu finishes the poem.', ['The dansimga, sung where Bang-won can hear it.', 'No trial.', 'The head, and the bamboo.'], 'Now someone has to sit down…!'),
				ep('Prince Jeongan', '정안군', '1392', 'He makes his father king and is paid with a title and a closed door.', ['Seventh month, the throne. Eighth month, Prince Jeongan.', 'No founding merit.', 'Bang-seok, Queen Sindeok’s child, is the heir.'], 'Ming asks for a prince, and they send the one they can spare…!')
			]
		},
		{
			id: 'nights',
			title: 'Two Nights',
			ko: '두 밤',
			years: '1394–1400',
			summary: 'A second trip to Nanjing, two princely strifes, and a crown he takes on the second night.',
			episodes: [
				ep('The Envoy', '사신', '1394', 'Hongwu wants a prince in Nanjing. Bang-won goes and settles the quarrel.', ['Useful, and still not the heir.', 'He comes home to the same closed door.', 'Jeong Do-jeon is writing a state with a child on top of it.'], 'They are about to take the princes’ soldiers…!'),
				ep('The First Night', '무인', '1398', 'The twenty-sixth day of the eighth month. The private armies are the last thing he has.', ['Liaodong as the excuse.', 'Wongyeong hides the weapons after the disarmament order.', 'Jeong Do-jeon, Nam Eun, Bang-seok.'], 'He will not pick the crown up…!'),
				ep('The Refusal', '사양', '1398', 'Bang-gwa becomes Jeongjong. The capital drifts back toward Gaegyeong.', ['The older full brother.', 'Bang-won takes the army, not the name.', 'Their father puts the crown down and does not forgive the night.'], 'His own brother thinks the method is available…!'),
				ep('The Second Night', '박포', '1400', 'Bang-gan and Bak Po lose. In the eleventh month Jeongjong steps down.', ['The second strife.', 'Crown prince, then king, in one year.', 'Taejong.'], 'The armies that made him are the next thing he abolishes…!')
			]
		},
		{
			id: 'taejong',
			title: 'Taejong',
			ko: '태종',
			years: '1400–1418',
			summary: 'One army, one drum, his wife’s brothers, and the son he chooses.',
			episodes: [
				ep('The Armies', '사병', '1400', 'Private troops are abolished. The soldiers go to one office.', ['The Three Armies.', 'The Uijeongbu for the civil side.', 'A king who remembers being a prince with soldiers.'], 'He hangs a drum the people can hit…!'),
				ep('The Drum', '신문고', '1401', 'Anyone may strike it. The same year Ming sends the seal.', ['The first Joseon investiture that arrives.', 'Hanyang again, after Jeongjong’s Gaegyeong.', 'A reign that wants to be heard and obeyed.'], 'The woman who hid the weapons still has brothers…!'),
				ep('Her Brothers', '민씨', '1406', 'The Min clan armed the house. They will not be a second court.', ['She argues. The order is already out.', 'A marriage that survives the brothers.', 'He does this to the person who made 1398 possible.'], 'His eldest son is not the king he can leave it to…!'),
				ep('The Third Son', '충녕', '1418', 'Yangnyeong is removed. Chungnyeong is named. The father abdicates and stays armed.', ['Hyoryeong toward the temple.', 'Sejong, before he has done the thing he is famous for.', 'Sangwang, with the army.'], 'The men who argued with the choice are still in the government…!')
			]
		},
		{
			id: 'sangwang',
			title: 'The Retired King',
			ko: '상왕',
			years: '1418–1422',
			summary: 'He finishes the purge, buries his queen, and dies.',
			episodes: [
				ep('The Father-in-law', '심온', '1418', 'Sim On and the officials who fought the succession do not see the next year.', ['The purge is the last use of the method.', 'Sejong is king and not yet governing alone.', 'A retired king who still signs the deaths.'], 'She is still alive…!'),
				ep('Wongyeong', '원경', '1420', 'The queen who hid the weapons dies first.', ['He has the reign.', 'He does not have her.', 'Heonreung is already the plan.'], 'One more year, and he lets the army go…!'),
				ep('Heonreung', '헌릉', '1422', 'The thirtieth of May. He is buried with her.', ['The last year he loosens his hand.', 'Sejong is already the king.', 'The book ends on the father, not the alphabet.'], 'His son will make a country that can read. Not in this book…!')
			]
		}
	],
	themes: [
		{ title: 'The fifth', body: ['He is never the heir until he has removed the heirs. Every book is a door that was shut on him, and the night he opens it.'] },
		{ title: 'One of anything', body: ['Two armies, two courts, two sons, a wife’s clan. He keeps the one that answers to the throne and ends the other. The drum is the exception he allows: one voice, from below, that still has to go through him.'] }
	],
	arcs: [
		{ who: 'Yi Bang-won', steps: ['The examination', 'The bridge', 'The first night', 'The refusal', 'The reign', 'The tomb'], mirror: 'Jeong Mong-ju dies for refusing to change. Bang-won lives by changing the room until only his choice is left in it.' },
		{ who: 'Queen Wongyeong', steps: ['The weapons', 'The brothers', 'The tomb'], mirror: 'She is the ally the method cannot spare. The book buries them together anyway.' }
	],
	plants: [
		{ plant: 'He is the only son who passes the exam.', payoff: 'The envoy years, and the sentence he uses when a room of soldiers thinks he is only a prince.' },
		{ plant: 'Wongyeong hides the weapons after the disarmament order.', payoff: 'The Min brothers die by the hand she armed.' },
		{ plant: 'He refuses the crown in 1398.', payoff: 'He takes it in 1400, and the refusal becomes the story he tells about the first night.' }
	],
	timeline: [
		{ year: '1367', text: 'Born at Gwiju, Hamhung. Fifth son of Yi Seong-gye and Lady Han.' },
		{ year: '1383', text: 'Passes the civil examination.' },
		{ year: '1388', text: 'Wihwa. Secretary to Yi Saek’s embassy to Nanjing.' },
		{ year: '1392', text: 'The fall at Haeju. Sonjuk Bridge. Prince Jeongan. Bang-seok is named heir.' },
		{ year: '1394', text: 'Envoy to the Hongwu emperor.' },
		{ year: '1398', text: 'First strife, eighth month, twenty-sixth day. Jeongjong.' },
		{ year: '1400', text: 'Second strife. Taejong, eleventh month.' },
		{ year: '1401', text: 'Sinmungo. Ming investiture.' },
		{ year: '1418', text: 'Yangnyeong removed. Sejong crowned. Taejong abdicates as Sangwang.' },
		{ year: '1420', text: 'Queen Wongyeong dies.' },
		{ year: '1422', text: 'Dies on 30 May. Heonreung.' }
	],
	sources: [
		{
			title: 'Annals and the encyclopedia',
			body: [
				'The Joseon sillok from Taejo on, and the Encyclopedia of Korean Culture entry on Taejong (이방원, born Gongmin 16, died Sejong 4). The first strife is the eighth month of 1398, not 1389. The examination is 1383, U’s ninth year. The dansimga is the poem as received.'
			]
		}
	],
	research: [
		{
			title: 'What this book leaves out',
			body: [
				'The Red Turbans, Noguk, and Gongmin’s murder are his father’s world. Bang-won is born after them. They stay offstage. Sejong’s alphabet, hopae in detail, and the slave manumissions are the reign’s policy. This story keeps the ones that cost him a person.'
			]
		}
	],
	places: [
		{ name: 'Hamhung', ko: '함흥', now: 'Hamhung', note: 'Gwiju, the private house. Later called Gyeongheungjeon. The childhood.' },
		{ name: 'Sonjuk Bridge', ko: '선죽교', now: 'Kaesong', note: 'Where Jeong Mong-ju dies. The bamboo is the later story’s name for the spot.' },
		{ name: 'Hanyang', ko: '한양', now: 'Seoul', note: 'Jeong Do-jeon’s capital. Jeongjong leaves it. Taejong brings the court back.' },
		{ name: 'Heonreung', ko: '헌릉', now: 'Seocho, Seoul', note: 'Taejong and Wongyeong, together.' }
	],
	contested: [
		'How much of the 1398 disarmament crisis was Jeong Do-jeon’s Liaodong plan, and how much was Bang-won looking for the night. The book stages both: the armies were about to go, and he chose the night.',
		'Yangnyeong’s disgrace is partly his conduct and partly his father’s need for a different son. The camera does not pretend to know the ratio.'
	],
	invented: [
		'Private sentences between Bang-won and Wongyeong. The weapons in the house after the disarmament order are the received account. The line she says about them is not.',
		'The examination room, the night ride from Haeju, and the tomb conversation. The dates are the record. The talk is the book.'
	],
	production: [
		{
			title: 'Five acts, one life',
			body: [
				'The Fifth Son through 1388. The Bridge through the shut door of 1392. Two Nights, 1394 to the abdication of 1400. Taejong’s reign as subtraction. The Retired King, four years, ending at the tomb. Five volumes, one row.'
			]
		}
	]
};
