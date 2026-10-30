import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const D = (person, chip, en, lines) => ({ kind: 'dialogue', person, chip, en, lines });
const P = (html, ko) => ({ kind: 'p', html, ko });

const JP = '#5a86d6';
const CM = '#d8a0e8';
const SD = '#E8552B';
const JD = '#9d7bd0';
const CC = '#D8258C';

const deathBeats = [
	P('He finds Chunmyung first. The eldest.', '먼저 천명을 찾는다. 맏딸이다.'),
	D('jinpyung', JP, ['Chunmyung.', 'Look at you.', 'I am proud of the woman you became.'], [
		'천명아.',
		'잘 됐다.',
		'네가 된 여자가 자랑스럽다.'
	]),
	D('chunmyung', CM, ['Father—'], ['아버지—']),
	P('He has already looked past her. At the man by the screen.', '이미 딸을 지나, 병풍 곁의 사내를 본다.'),
	D('jinpyung', JP, ['Yongsu.', 'Come here.'], ['용수.', '이리 오너라.']),
	P('Yongsu comes. He does not talk to the dark. He takes the hand.', '용수가 온다. 어둠에 대고 말하지 않는다. 그 손을 잡는다.'),
	D(
		'jinpyung',
		JP,
		[
			'The years. Thank you for those.',
			'You took care of my daughter. That’s a son-in-law.'
		],
		['그 세월, 고맙다.', '내 딸을 돌봤구나. 그게 사위다.']
	),
	P(
		'Yongsu’s mouth is a little open, the way it is when he has run out of rafters.',
		'용수의 입이 조금 벌어져 있다. 서까래에 댈 말이 떨어졌을 때의 그 얼굴이다.'
	),
	D(
		'jinpyung',
		JP,
		['And the boy. Chunchu.', 'He’s going to do things.', 'I am proud of him too.'],
		['그리고 그 아이. 춘추.', '저 아이는 일을 할 거다.', '그 아이도 자랑스럽다.']
	),
	D('chunmyung', CM, ['Father. He’s late. He’s always—'], ['아버지. 그 앤 늦어요. 맨날—']),
	D(
		'jinpyung',
		JP,
		['Your boy can count.', 'Don’t let this room teach him not to.'],
		['네 아이는 셈을 한다.', '이 방이 그걸 빼앗게 두지 마라.']
	),
	P(
		'They look at each other. That is the conversation.',
		'둘이 눈을 맞춘다. 그게 대화다.'
	),
	D(
		'jinpyung',
		JP,
		['The books stay with you. Until she asks.', 'You kept it.', 'I asked you two things, once. You did both.'],
		['장부는 네가 맡아라. 저 아이가 물을 때까지.', '지켰구나.', '내가 예전에 둘을 물었다. 둘 다 했다.']
	),
	P('Yongsu nods once. He is not a man who nods in front of people.', '용수가 한 번 끄덕인다. 남 앞에선 끄덕이지 않는 사람이다.'),
	P('He has already turned to Sungman. The niece.', '이미 승만 쪽으로 고개를 돌렸다. 조카다.'),
	D(
		'jinpyung',
		JP,
		[
			'Sungman.',
			'Stand up.',
			'Don’t lean on this house. Don’t lean on me.',
			'The world will talk. Let it.',
			'You have your own back. That’s enough.'
		],
		[
			'승만아.',
			'똑바로 서라.',
			'이 집에 기대지 마라. 나한테도.',
			'세상은 말할 거다. 말하게 둬라.',
			'네 등은 네 것이다. 그걸로 된다.'
		]
	),
	D('jinduk', JD, ['Uncle.'], ['숙부.']),
	P('That’s the one he wanted. He lets it sit.', '그게 듣고 싶었던 말이다. 그대로 둔다.'),
	P('Then Dukman. Last. The one who is about to sit.', '그리고 덕만. 마지막이다. 이제 앉을 아이다.'),
	D('jinpyung', JP, ['Dukman.', 'Come closer.'], ['덕만아.', '가까이 오너라.']),
	D('sunduk', SD, ['Father.'], ['아버지.']),
	D('jinpyung', JP, ['Afraid?'], ['겁나느냐?']),
	D('sunduk', SD, ['…Yes.'], ['…예.']),
	D('jinpyung', JP, ['Good. The other kind make a mess.'], ['좋다. 안 겁내는 쪽이 일을 망친다.']),
	P('He looks at her a long time. She looks back. Nobody else is in that look.', '그는 오래 딸을 본다. 딸도 본다. 그 눈엔 다른 사람이 없다.'),
	D(
		'jinpyung',
		JP,
		[
			'I know what’s coming.',
			'They’ll count the skirt. They’ll talk.',
			'I’m not worried.',
			'You’ll be a good king.',
			'Keep the good men close. The other kind, far.',
			'I was eleven.',
			"You're not.",
			"You'll do."
		],
		[
			'무슨 일이 올지 안다.',
			'치마를 셀 거다. 말할 거다.',
			'나는 걱정 안 한다.',
			'너는 좋은 임금이 된다.',
			'좋은 사람은 가까이. 아닌 사람은 멀리.',
			'나는 열하나였다.',
			'너는 아니다.',
			'너는 된다.'
		]
	),
	P('She does not answer. She does not look away.', '대답하지 않는다. 눈을 피하지도 않는다.')
];

const cheekBeats = [
	P(
		'Chunmyung has his left cheek between two fingers. Sungman has the right. Dukman is not above it.',
		'천명이 왼쪽 볼을 두 손가락으로 집는다. 승만이 오른쪽을 집는다. 덕만도 빠지지 않는다.'
	),
	P(
		'He is twenty-nine. He has two children. He looks like a boy being fed.',
		'스물아홉이다. 자식이 둘이다. 밥 얻어먹는 아이 얼굴이다.'
	)
];

let found = false;
for (const ch of story) {
	for (const e of ch.entries ?? []) {
		if (e.title !== 'Harmony Council') continue;
		found = true;
		const b = e.blocks;
		const start = b.findIndex(
			(x) => x.kind === 'p' && x.html === 'He finds Chunmyung first.'
		);
		const end = b.findIndex(
			(x) => x.kind === 'p' && x.html === 'She does not answer. She does not look away.'
		);
		if (start < 0 || end < 0) throw new Error(`death slice not found start=${start} end=${end}`);
		b.splice(start, end - start + 1, ...deathBeats);

		const jindukHand = b.findIndex(
			(x) =>
				x.kind === 'dialogue' &&
				x.person === 'jinduk' &&
				Array.isArray(x.lines) &&
				x.lines.includes('그렇게 조그맸던 얘가 벌써 이렇게 늠름하게 됬을 줄이야~~')
		);
		if (jindukHand < 0) throw new Error('handwritten Jinduk line not found');
		b.splice(jindukHand + 1, 0, ...cheekBeats);
		console.log('Harmony Council blocks now', b.length, 'death@', start, 'cheek after', jindukHand);
	}
}
if (!found) throw new Error('Harmony Council not found');

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('wrote story.json');
