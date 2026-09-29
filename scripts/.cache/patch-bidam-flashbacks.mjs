import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const raw = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title, year) {
	for (const ch of raw) {
		for (const en of ch.entries ?? []) {
			if (en.title === title && String(en.year) === String(year)) return en;
		}
	}
	throw new Error(`missing ${title} ${year}`);
}

const img = (o) => o;

const councilImgs = [
	img({
		id: 'bidam-father-first-day',
		ratio: 1.778,
		tone: '#141C2E',
		at: 'righteous traitor',
		alt: 'Young Bidam kneeling on packed earth; his father stoops, beads in the sleeve, navy hall behind',
		people: ['bidam', 'sukwon'],
		refs: ['/ch_bidam_hwarang.png', '/ch_bidam_old.png'],
		prompt: ''
	}),
	img({
		id: 'bidam-defends-yushin',
		ratio: 1.778,
		tone: '#2A5FB8',
		at: "the Gaya boy's mouth",
		alt: 'Young Bidam steps between yard bullies and Yushin; beads vs a standing blue sleeve',
		people: ['bidam', 'yushin'],
		refs: ['/ch_bidam_hwarang.png', '/ch_kim_yushin_hwarang.png'],
		prompt: ''
	})
];

const rebelImgs = [
	img({
		id: 'chunchu-sends-bupmin',
		ratio: 1.778,
		tone: '#D8258C',
		at: 'send Bupmin to the steam',
		alt: 'Chunchu mid-stride in Wolseong, magenta rim, sending twenty-one-year-old Bupmin with a jar',
		people: ['chunchu', 'munmu'],
		refs: ['/ch_chunchu.png', '/ch_bupmin_hwarang.png'],
		prompt: ''
	}),
	img({
		id: 'goddesses-meet-bupmin',
		ratio: 1.778,
		tone: '#C41E3A',
		at: 'He is the best of both',
		alt: 'Three photoreal goddesses in steam meeting painterly Bupmin, twenty-one, jar at the lip',
		people: ['munmu', 'narim', 'golhwa', 'hyulle'],
		refs: [
			'/ch_bupmin_hwarang.png',
			'/ch_narim.png',
			'/ch_golhwa.png',
			'/ch_hyullé.png',
			'/bn_narim.png',
			'/bn_golhwa.png',
			'/bn_hyulle.png',
			'/pl_cave.png'
		],
		prompt: ''
	}),
	img({
		id: 'yushin-stalls-bidam',
		ratio: 1.778,
		tone: '#2A5FB8',
		at: 'keep him talking',
		alt: 'Night pavilion: Yushin leaning in, stalling; Bidam with beads; navy vs Confucian blue',
		people: ['yushin', 'bidam'],
		refs: ['/ch_kim_yushin.png', '/ch_bidam.png'],
		prompt: ''
	}),
	img({
		id: 'bupmin-splash-bidam',
		ratio: 1.778,
		tone: '#C41E3A',
		at: 'splash the water',
		alt: 'Bupmin behind Bidam at the 정자, jar tipping, water as a hard diagonal',
		people: ['munmu', 'bidam', 'yushin'],
		refs: ['/ch_bupmin_hwarang.png', '/ch_bidam.png', '/ch_kim_yushin.png'],
		prompt: ''
	}),
	img({
		id: 'water-does-nothing',
		ratio: 1.778,
		tone: '#141C2E',
		at: "why isn't it doing anything",
		alt: 'ECU: water beads on Bidam’s face, no vision, beads still, navy void',
		people: ['bidam', 'munmu'],
		refs: ['/ch_bidam.png', '/ch_bupmin_hwarang.png'],
		prompt: ''
	}),
	img({
		id: 'bidam-laugh-monologue',
		ratio: 0.75,
		tone: '#141C2E',
		at: 'HAHAHAHAHA',
		alt: 'Worm’s-eye: Bidam laughing, mouth open, navy plane, gold beads as the one accent',
		people: ['bidam'],
		refs: ['/ch_bidam.png'],
		prompt: ''
	})
];

const fatherFlash = {
	kind: 'flashback',
	year: '610',
	title: 'The higher teaching · 아비달마',
	blocks: [
		{
			kind: 'p',
			html: 'Class 51’s first morning. Packed earth still dark. Bidam is sixteen. His father walks him as far as the yard gate and no further — Musan hall does not hover.',
			ko: '오십일기의 첫 아침. 다진 흙은 아직 어둡다. 비담은 열여섯. 아버지는 연무장 문까지만 걷는다. 무산 대청은 달라붙지 않는다.'
		},
		{
			kind: 'dialogue',
			chip: '#3d4654',
			person: 'sukwon',
			lines: ['비담아…', '네 이름 뜻을 아느냐.'],
			en: ['Bidam…', 'Do you know the meaning of your name.']
		},
		{
			kind: 'dialogue',
			chip: '#7b5cd6',
			person: 'bidam',
			look: 'hwarang',
			lines: [
				'예, 아버지…',
				'아비달마, 더 높은 가르침에서 따온 이름입니다. 그건—'
			],
			en: [
				'Yes, father…',
				'I was named after the Abhidharma, the higher teaching. It—'
			]
		},
		{
			kind: 'dialogue',
			chip: '#3d4654',
			person: 'sukwon',
			lines: [
				'그래… 더 높은 가르침.',
				'젊은이로서, 화랑으로서, 그걸 지키는 게 네 일이다.',
				'그리고 이걸 기억해라.',
				'아무도 그 진실에 동의하지 않아도… 그걸 입 밖에 내면 사람들이 너를 헐뜯고 비웃어도…',
				'너는 진실을 향해 걸어야 한다. 혼자라도. 다른 길은 없다.',
				'이런 말, 들어 봤을 거다. 이기면 임금, 지면 역적.',
				'성즉군왕 패즉역적.',
				'아들아… 나는 네가 불의한 임금보다, <b>의로운 역적</b>이 되기를 바란다.',
				'비담아… 내가 너를 사랑한다…!',
				'가서, 우리를 자랑스럽게 해다오, 아들아…!'
			],
			en: [
				'Yes… the higher teaching.',
				'And as a young man, and as a Hwarang, your duty is to uphold that.',
				'And remember this:',
				'Even if no one else agrees with the truth… even if speaking it out loud causes others to defame and mock you…',
				'You must always walk toward the truth, in isolation if you must. There is no other way.',
				'You may have heard the saying: upon victory, a king; upon defeat, a traitor.',
				'성즉군왕 패즉역적.',
				'Son… I need you to be a man who would rather be a <b>righteous traitor</b> than an unrighteous king.',
				'Bidam… I love you…!',
				'Go make us proud, son…!'
			]
		},
		{
			kind: 'p',
			html: 'He does not name the Gaya-born boy who will share the class. He only ties Bidam’s headband once, tight, and lets the gate take him.',
			ko: '같은 기수를 나눌 가야 난 아이는 이름 대지 않는다. 머리띠만 한 번, 팽팽히 매 주고, 문에 맡긴다.'
		}
	]
};

const defendFlash = {
	kind: 'flashback',
	year: '611',
	title: 'The Gaya boy’s mouth',
	blocks: [
		{
			kind: 'p',
			html: 'Same class — 오십일기. Bidam is a year older; Yushin still sounds like the surrender. Two 선배 from the class before them have him by the collar for the accent.',
			ko: '같은 기수 — 오십일기. 비담이 한 살 위고, 유신은 아직 항복한 나라 말투다. 한 기수 위 선배 둘이 억양 때문에 옷깃을 잡는다.'
		},
		{
			kind: 'dialogue',
			chip: '#6b7280',
			speaker: 'Hwarang',
			lines: ['야.', '입 다시 해 봐. 서라벌 말로.', '가야는 저기 없거든.'],
			en: ['Hey.', 'Say it again. In a Surabol mouth.', 'Gaya isn’t over here.']
		},
		{
			kind: 'dialogue',
			chip: '#4a8fe0',
			person: 'yushin',
			look: 'hwarang',
			lines: ['…다시 하겠습니다.', '형님.'],
			en: ['…I’ll say it again.', 'Hyungnim.']
		},
		{
			kind: 'p',
			html: 'Bidam is already between them. Beads knock once against the wrist. He does not recite a sutra. He takes the collar out of their hands.',
			ko: '비담은 이미 그 사이에 서 있다. 염주가 손목에 한 번 부딪친다. 경은 외지 않는다. 옷깃만 선배들 손에서 빼낸다.'
		},
		{
			kind: 'dialogue',
			chip: '#7b5cd6',
			person: 'bidam',
			look: 'hwarang',
			lines: [
				'오십일긴데.',
				'우리 기수 입을 갖고 놀지 마.',
				'머리띠.',
				'이거 하면 — 더 잡지 마.'
			],
			en: [
				'He’s Class 51.',
				'Don’t play with our class’s mouth.',
				'Headband.',
				'He wears this — you don’t grab him again.'
			]
		},
		{
			kind: 'dialogue',
			chip: '#4a8fe0',
			person: 'yushin',
			look: 'hwarang',
			lines: ['…왜.', '형님은 손씨인데.'],
			en: ['…Why.', 'You’re a Son.']
		},
		{
			kind: 'dialogue',
			chip: '#7b5cd6',
			person: 'bidam',
			look: 'hwarang',
			lines: ['알아.', '가서 일어서.', '점수는 내일.'],
			en: ['I know.', 'Go stand up.', 'Score’s tomorrow.']
		},
		{
			kind: 'p',
			html: 'The 선배 laugh anyway, later, where Bidam cannot hear. Yushin keeps the headband. The walk-alone does not wait for a crowd to agree.',
			ko: '선배들은 나중에, 비담이 안 듣는 곳에서, 그래도 웃는다. 유신은 머리띠를 지킨다. 혼자 걷는 일은 무리가 동의해 주기를 기다리지 않는다.'
		}
	]
};

const council = findEntry('The Harmony Council', '645');
council.images.push(...councilImgs);
{
	const i = council.blocks.findIndex(
		(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('The Council adjourns with no successor')
	);
	if (i < 0) throw new Error('veto adjourn missing');
	council.blocks.splice(i + 1, 0, fatherFlash, defendFlash);
}

const cavernBlocks = [
	{
		kind: 'p',
		html: 'Before the fourth night’s tea, Wolseong tries a quieter weapon. Chunchu sends <b>Bupmin (21)</b> to the steam — the water that shows a man’s inner conscience, the past that is driving his hand. Yushin is told only to <b>keep him talking</b>.',
		ko: '넷째 밤의 차 전에, 월성은 더 조용한 무기를 쓴다. 춘추가 <b>법민 (21)</b>을 김으로 보낸다 — 사람의 속마음과, 그 손을 움직이는 과거를 보여주는 물. 유신에게는 <b>말만 붙들어 두라</b>고만 한다.'
	},
	{
		kind: 'dialogue',
		chip: '#c084fc',
		person: 'chunchu',
		lines: [
			'법민.',
			'항아리 하나 가져가.',
			'샘은 네 외숙이 아는 곳이다. 네가 김씨니까 문이 열릴 거다.',
			'비담에게 그 물을 끼얹어라.'
		],
		en: [
			'Bupmin.',
			'Take a jar.',
			'The spring is a place your uncle knows. You’re a Kim — the door will open.',
			'Splash him.'
		]
	},
	{
		kind: 'dialogue',
		chip: '#C41E3A',
		person: 'munmu',
		look: 'hwarang',
		lines: ['아버지…', '그 물이, 사람을 어떻게…', '알겠습니다. 다녀오겠습니다.'],
		en: ['Father…', 'What does the water do to a man…', 'I understand. I’ll go.']
	},
	{
		kind: 'p',
		html: 'This is the first time the cavern goddesses meet Bupmin. He is twenty-one. He does not yet have a king’s name. He has a jar and Chunchu’s weather.',
		ko: '동굴 여신들이 법민을 만나는 첫날이다. 스물하나. 아직 왕의 이름은 없다. 항아리와, 춘추의 날씨만 있다.'
	},
	{
		kind: 'dialogue',
		chip: '#5fad6e',
		person: 'narim',
		lines: [
			'김이네.',
			'앉아. 아니 — 항아리부터.',
			'너는… <b>양쪽의 최선</b>이구나. 어깨는 가야, 입은 서라벌.'
		],
		en: [
			'A Kim.',
			'Sit. No — the jar first.',
			'You… you’re the <b>best of both</b>. Gaya in the shoulders. Surabol in the mouth.'
		]
	},
	{
		kind: 'dialogue',
		chip: '#e0783a',
		person: 'golhwa',
		lines: ['오.', '처음 보는 김인데. 둘 다야.', '물 가져가. 속마음이 묻거든. 트라우마든, 한이든.'],
		en: [
			'Oh.',
			'A Kim we haven’t had. He’s both.',
			'Take the water. Conscience sticks to it. Trauma. Grudge. Whatever’s driving the hand.'
		]
	},
	{
		kind: 'dialogue',
		chip: '#2eb8c4',
		person: 'hyulle',
		lines: ['…조심해.', '끼얹으면, 그 사람이 왜 그러는지가 보여.', '안 보이면… 그건 그것대로야.'],
		en: [
			'…Be careful.',
			'If you splash it, you see why he’s doing it.',
			'If you don’t see anything… that’s its own answer.'
		]
	},
	{
		kind: 'dialogue',
		chip: '#C41E3A',
		person: 'munmu',
		look: 'hwarang',
		lines: ['여신들…', '감사합니다. 전 그냥—', '물만 담아 가겠습니다.'],
		en: ['Goddesses…', 'Thank you. I was only—', 'I’ll just take the water.']
	},
	{
		kind: 'p',
		html: 'He fills the jar. He does not stay for the lake’s other lessons. He is <b>the best of both</b>, and he leaves because his father told him to.',
		ko: '항아리를 채운다. 호수의 다른 수업은 받지 않는다. 그는 <b>양쪽의 최선</b>이고, 아버지가 시키니까 돌아간다.'
	}
];

const splashBlocks = [
	{
		kind: 'p',
		html: 'Yushin does not close the argument. He asks again about the pass, about names, about harvests — anything that keeps Bidam’s back to the dark. Behind the 정자, Bupmin’s jar ticks once against a post.',
		ko: '유신은 논쟁을 닫지 않는다. 고개, 이름, 수확 — 비담의 등이 어둠을 향하게 붙들어 두는 것이면 된다. 정자 뒤에서 법민의 항아리가 기둥에 한 번 닿는다.'
	},
	{
		kind: 'dialogue',
		chip: '#4a8fe0',
		person: 'yushin',
		lines: [
			'비담.',
			'그 십 리 바깥 이야기, 한 번만 더.',
			'백성이 황제를 원치 않는다 — 그 말은, 어디서 들었소.'
		],
		en: [
			'Bidam.',
			'That ten-mile story. Once more.',
			'The people have no wish for an emperor — where did you hear that.'
		]
	},
	{
		kind: 'p',
		html: 'Bupmin comes from behind. The splash is ugly and precise — cavern water as a hard sheet across Bidam’s shoulders, beads and all.',
		ko: '법민이 뒤에서 온다. 끼얹는 일은 흉하고 정확하다 — 동굴 물이 비담의 어깨와 염주 위로 딱딱한 면처럼 떨어진다.'
	},
	{
		kind: 'dialogue',
		chip: '#7b5cd6',
		person: 'bidam',
		lines: ['하…', '이게 뭐지…'],
		en: ['Ha…', 'What is this…']
	},
	{
		kind: 'dialogue',
		chip: '#C41E3A',
		person: 'munmu',
		look: 'hwarang',
		lines: ['당신의 트라우마….', '유신 공… 왜 아무 일도 없는데…?'],
		en: ['Your trauma….', 'Yushin… why isn’t it doing anything…?']
	},
	{
		kind: 'p',
		html: 'Nothing rises. No childhood. No princess. No grudge-film in the steam. The water runs off the black robe as if it had mistaken a man for a wound. Chunchu, at the pavilion’s edge, does not move. The stoic act holds; the eyes do not.',
		ko: '아무것도 안 뜬다. 어린 시절도, 공주도, 김 속의 한 필름도. 물은 흑의를 타고 내린다. 사람을 상처로 착각한 것처럼. 정자 가장자리의 춘추는 움직이지 않는다. 담담한 연기는 유지된다. 눈만 아니다.'
	},
	{
		kind: 'dialogue',
		chip: '#c084fc',
		person: 'chunchu',
		lines: ['……'],
		en: ['……']
	},
	{
		kind: 'dialogue',
		chip: '#7b5cd6',
		person: 'bidam',
		lines: ['아… 하하…', '들어 본 적 있어… 이 물이지…?'],
		en: ['Oh… haha…', 'I’ve heard of this… this is that water, isn’t it…?']
	},
	{
		kind: 'dialogue',
		chip: '#7b5cd6',
		person: 'bidam',
		lines: ['하하하하하!'],
		en: ['HAHAHAHAHA!']
	},
	{
		kind: 'dialogue',
		chip: '#7b5cd6',
		person: 'bidam',
		lines: [
			'보라, 성골 계급의 오만함을!!',
			'정녕 내가 무슨 개인적 트라우마가 있어야 한다고 생각했느냐??',
			'그게 이 모든 일의 이유라고?',
			'공주를 미워해서? 여왕을?',
			'춘추 너를, 유신을 — 미워해서?',
			'한순간이라도… 단 일 초라도… 너희 생각이 그냥 형편없을 가능성…',
			'이 나라를 망치게 될 가능성…',
			'제정신인 사내라면 누구나 반대할 가능성… 생각해 본 적 있느냐?',
			'아니면 너희가 하는 일은 전부 옳고…',
			'누구든 반대하는 이유는 정신의 병 뿐이라고…',
			'화가 나고 비틀려서라고… 그렇게 오만하냐?',
			'하… 친구들, 오늘 밤 너희가 한 일이라곤 제 논리를 증명한 것뿐이다.',
			'어느 나라도 이끌 자격이 없다는 걸 스스로 증명했어.',
			'그러니… 친구들… 비키시지…!'
		],
		en: [
			'Behold, the arrogance of the sacred bone class!!',
			'You really thought I had to have some sort of personal trauma??',
			'That that was the reason I was doing all of this?',
			'That I hated the princess? The queen?',
			'That I hated you, Chunchu, or Yushin?',
			'Have you ever… even for a SECOND… considered the POSSIBILITY…',
			'that your ideas are simply terrible?',
			'That they’ll lead this nation to ruin?',
			'That ANY reasonable man would oppose them?',
			'Or are you so ARROGANT to assume… that EVERYTHING you lot do is correct…',
			'and that the ONLY reason for ANYONE to disagree… is because they were suffering some sort of mental disease? Because they were angry and bitter?',
			'Ha… well, my friends, I’m afraid all you’ve done tonight is prove your point.',
			'You’ve proven yourself to be unworthy of leading any country.',
			'So please… my friends… step aside…!'
		]
	},
	{
		kind: 'p',
		html: 'Alchun, arriving late with a lamp, goes pale. An officer asks whether to seize the jar. Nobody answers. Bidam is still laughing, and still alive, and the beads are still counting.',
		ko: '늦게 등을 들고 온 알천의 얼굴이 하얘진다. 장교 하나가 항아리를 빼앗을지 묻는다. 대답하는 사람이 없다. 비담은 아직 웃고, 아직 살아 있고, 염주는 아직 세고 있다.'
	}
];

const rebel = findEntry('Bidam’s Rebellion', '647');
rebel.images.push(...rebelImgs);
{
	const d4 = rebel.blocks.findIndex((b) => b.kind === 'day' && b.label === 'DAY 4');
	if (d4 < 0) throw new Error('DAY 4 missing');
	rebel.blocks.splice(d4, 0, ...cavernBlocks);
}
{
	const yushinOut = rebel.blocks.findIndex(
		(b) =>
			b.kind === 'dialogue' &&
			b.person === 'yushin' &&
			Array.isArray(b.en) &&
			b.en.some((l) => String(l).includes('last son of a conquered kingdom'))
	);
	if (yushinOut < 0) throw new Error('yushin outsider speech missing');
	rebel.blocks.splice(yushinOut + 1, 0, ...splashBlocks);
}

const wang = findEntry("The Wanggeom's Guest", '673');
for (const b of wang.blocks) {
	if (b.kind === 'p' && typeof b.html === 'string' && b.html.includes('He is the <b>best of both</b>')) {
		b.html =
			'He is the <b>best of both</b> — they said it first when he was twenty-one and the jar was still cold, and they say it again now that the uncle is ash. Gaya in the shoulders. Surabol in the mouth. A Kim they have not had as king. Fire comes off Golhwa’s skin. Water streams from Hyullé’s chin. A leaf turns in the steam around Narim and will not fall.';
		b.ko =
			'그는 <b>양쪽의 최선</b>이다 — 스물하나, 항아리가 아직 차가웠을 때 처음 말했고, 외숙이 재가 된 지금도 다시 말한다. 어깨는 가야. 입은 서라벌. 아직 임금으로는 가져 보지 못한 김. 골화의 살에서 불이 난다. 혈레의 턱에서 물이 내린다. 나림 주위 김에서 잎 하나가 돌고, 떨어지지 않는다.';
	}
}

fs.writeFileSync(STORY, JSON.stringify(raw, null, '\t') + '\n');
console.log('patched council images', council.images.length, 'blocks', council.blocks.length);
console.log('patched rebel images', rebel.images.length, 'blocks', rebel.blocks.length);
