import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const entry = Object.values(story)
	.flatMap((ch) => ch.entries ?? [])
	.find((e) => e.title === 'Jumong');
if (!entry) throw new Error('Jumong entry missing');

const idx = (pred, label) => {
	const i = entry.blocks.findIndex(pred);
	if (i < 0) throw new Error('block not found: ' + label);
	return i;
};

const iStart = idx(
	(b) =>
		b.kind === 'dialogue' &&
		b.person === 'jumong' &&
		Array.isArray(b.en) &&
		b.en[0] === '….Oh.',
	'Oh tease'
);
const iEnd = idx(
	(b) =>
		b.kind === 'dialogue' &&
		b.person === 'jumong' &&
		Array.isArray(b.en) &&
		b.en[0] === 'Hey. Hey I’m here.',
	'hey I’m here'
);

const tease = [
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: [
			'….Oh.',
			'So how long has it been.',
			'The ditch. The loft. The first morning I was wet in your yard.',
			'Am I your type.',
			'Or is this why you keep putting me on the count.'
		],
		lines: [
			'….어.',
			'그래서 얼마나 된 거야.',
			'도랑. 다락. 네 마당에 젖어서 처음 온 그 아침.',
			'내가 취향이야.',
			'아니면 그래서 자꾸 점고에 올리는 거야.'
		]
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: [
			'Work.',
			'Worker. That’s the word.',
			'You hang off my porch that’s why I yelled.',
			'그런 거 아니거든.',
			'Don’t— don’t grin like you found something.'
		],
		lines: [
			'일이야.',
			'일꾼. 그게 단어야.',
			'우리 누대에 붙어 있으니까 소리 친 거야.',
			'그런 거 아니거든.',
			'뭐 찾은 것처럼 웃지 마.'
		]
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: [
			'Okay. Work.',
			'Then why are you furiously blushing.',
			'Ears. Throat. Whole face.',
			'That’s not a ledger.'
		],
		lines: [
			'알겠어. 일.',
			'그럼 왜 그렇게 빨개져.',
			'귀. 목. 얼굴 전부.',
			'장부가 아니거든.'
		]
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: [
			'Heat.',
			'Grain. Lamp. I ran.',
			'Shut up.',
			'I don’t— I don’t like you.',
			'그런 거 아니거든.'
		],
		lines: [
			'더워서.',
			'곡식. 등잔. 뛰었잖아.',
			'닥쳐.',
			'안— 안 좋아하거든.',
			'그런 거 아니거든.'
		]
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: [
			'Okay.',
			'Then I’m going.',
			'For real this time.',
			'You can have the porch. And the girls. And the count.'
		],
		lines: [
			'알겠어.',
			'그럼 가.',
			'이번엔 진짜.',
			'누대도. 애들도. 점고도. 네가 가져.'
		]
	},
	{
		kind: 'p',
		html: 'He turns for the pine. He actually walks this time. No bucket. No laugh. The well-grin is gone, which is worse. Dusty-rose is still standing with her mouth open.',
		ko: '소나무 쪽으로 돈다. 이번엔 진짜 걷는다. 두레박도 없고 웃음도 없다. 우물에서 하던 그 웃음이 없다. 그게 더 나쁘다. 회분홍은 아직 입 벌린 채로 서 있다.'
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: [
			'Wait— don’t— turn around.',
			'If you look I can’t—',
			'I wasn’t going to say it.'
		],
		lines: [
			'기다려— 돌아보지— 마.',
			'보면 말 못 해—',
			'말하려고 한 적 없어.'
		]
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: [
			'I’m not turned.',
			'I’m also not stopping.',
			'Say it or I’m south.'
		],
		lines: [
			'안 돌아봤어.',
			'그렇다고 서지도 않아.',
			'말하든가. 아니면 남쪽이야.'
		]
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: [
			'The first morning.',
			'You were wet. Father put you on my count.',
			'I didn’t put you down.',
			'Don’t grin. Don’t— I wanted you. From the first look.',
			'Every ditch. Every sack. The loft. Don’t make me twice.',
			'Big idiot.'
		],
		lines: [
			'첫 아침.',
			'젖어 있었어. 아버지가 내 점고에 넣었어.',
			'나는 안 내렸어.',
			'웃지 마. 하지— 너 원했어. 처음 본 그 눈부터.',
			'도랑마다. 가마니마다. 다락. 두 번은 시키지 마.',
			'이 큰 바보.'
		]
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: [
			'Okay. I’m here.',
			'Say the rest.',
			'What you want me to do to you.',
			'Not come here. After come here.'
		],
		lines: [
			'알겠어. 여기 있어.',
			'나머지를 말해.',
			'나한테 뭘 하라는 거야.',
			'이리 와, 말고. 그다음.'
		]
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: [
			'Come here. That’s it.',
			'Don’t—',
			'…Don’t be nice.',
			'Pin me. Like you’re mad I yelled.',
			'Fuck me like you hate me.',
			'There.',
			'Now come here before I take it back.'
		],
		lines: [
			'이리 와. 그게 다야.',
			'하지—',
			'…착하게 굴지 마.',
			'눌러. 내가 소리 친 게 화난 것처럼.',
			'미워하는 것처럼 박아.',
			'됐어.',
			'취소하기 전에 이리 와.'
		]
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: [
			'Hey. Hey I’m here.',
			'Look. Still here.',
			'You said it. I’m not taking it back for you.'
		],
		lines: [
			'야. 야 나 여기 있어.',
			'봐. 아직이야.',
			'네가 말했거든. 내가 대신 취소 안 해.'
		]
	}
];

entry.blocks.splice(iStart, iEnd - iStart + 1, ...tease);

const iMouth = idx(
	(b) =>
		b.kind === 'dialogue' &&
		b.person === 'sosuno' &&
		Array.isArray(b.en) &&
		b.en[0] === 'Then take it.',
	'then take it'
);

const virginInsert = [
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		nsfw: true,
		en: [
			'Then take it.',
			'Don’t put a price on it.',
			'Wait— wait.',
			'I’ve never—',
			'Don’t laugh. I hunt. I don’t— this.',
			'I already lost the count.'
		],
		lines: [
			'그럼 가져.',
			'값 매기지 마.',
			'잠깐— 잠깐.',
			'한 적 없어—',
			'웃지 마. 난 사냥해. 이런 건— 안 해.',
			'난 이미 셈 잃었거든.'
		]
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		nsfw: true,
		en: [
			'I’m not laughing.',
			'I’ve done this.',
			'You’re shaking. I’ve got you.'
		],
		lines: [
			'안 웃어.',
			'난 해 봤어.',
			'떨리잖아. 잡고 있어.'
		]
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		nsfw: true,
		en: [
			'Of course you have.',
			'How many.',
			'Don’t tell me. Tell me.',
			'Those well girls. Teal. Saffron. Did you—',
			'Don’t. I said don’t. I also— ah— I want to know.',
			'Hate me for asking. Then do it anyway.'
		],
		lines: [
			'그래. 당연히.',
			'몇 명.',
			'말하지 마. 말해.',
			'우물 년들. 청록. 사프란. 했어—',
			'하지 마. 하지 말랬잖아. 근데— 아— 알고 싶거든.',
			'물어본 거 미워해. 그래도 해.'
		]
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		nsfw: true,
		en: [
			'Not them.',
			'Not here.',
			'You wanted hate. You get my hands.',
			'Slow until it seats. Then I’m not nice.'
		],
		lines: [
			'저애들 아냐.',
			'여기선 아냐.',
			'미움 원했잖아. 내 손이야.',
			'들어갈 때까진 천천히. 그다음엔 착하지 않아.'
		]
	}
];

entry.blocks.splice(iMouth, 1, ...virginInsert);

const iFitTalk = idx(
	(b) =>
		b.kind === 'dialogue' &&
		b.person === 'sosuno' &&
		Array.isArray(b.en) &&
		b.en[0] === 'Wait— wait wait— too—',
	'fit talk'
);
const fit = entry.blocks[iFitTalk];
fit.en = [
	'Wait— wait wait— too—',
	'It won’t— ah— fit—',
	'You said you’ve done this— then why is it— this thick—',
	'Don’t pull out. Just— let me— grind—',
	'There— there— fuck— yes—'
];
fit.lines = [
	'잠깐— 잠깐잠깐— 너무—',
	'안— 아— 안 들어가—',
	'해 봤다며— 그럼 왜 이렇게— 두꺼워—',
	'빼지 마. 그냥— 내가— 비빌게—',
	'거기— 거기— 씨— 응—'
];

const iEasy = idx(
	(b) =>
		b.kind === 'dialogue' &&
		b.person === 'jumong' &&
		Array.isArray(b.en) &&
		b.en[0] === 'Hey. Easy—',
	'hey easy'
);
entry.blocks[iEasy].en = [
	'Hey. Easy—',
	'First time’s supposed to shake.',
	'I’ve got you. Slow.',
	'Then I hate-fuck you. Like you asked.'
];
entry.blocks[iEasy].lines = [
	'야. 천천히—',
	'처음이면 떠는 거야.',
	'잡고 있어. 천천히.',
	'그다음엔 네가 말한 대로 미워하면서 박아.'
];

const iNice = idx(
	(b) =>
		b.kind === 'dialogue' &&
		b.person === 'sosuno' &&
		Array.isArray(b.en) &&
		b.en[0] === 'I said don’t be nice—',
	'don’t be nice'
);
entry.blocks[iNice].en = [
	'I said don’t be nice—',
	'I want it to hurt a little— then— then I want to ride that stretch—',
	'Other girls already know this. I don’t. That’s— that’s why I’m wet—',
	'Other girls can look. Only I get this cock—'
];
entry.blocks[iNice].lines = [
	'착하게 굴 생각 마—',
	'조금 아팠으면 좋겠어— 그다음— 그 꽉 낀 거 타게—',
	'다른 년들은 이미 알잖아. 난 몰라. 그래서— 그래서 젖는 거야—',
	'다른 년들은 눈으로만. 이 자지는 나만—'
];

const turn = (entry.images ?? []).find((im) => im.id === 'jumong-seq-turn-leave');
if (turn) turn.at = 'He turns for the pine';

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched tease/confess + virgin grain');
