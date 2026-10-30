import { readFileSync, writeFileSync } from 'fs';

const FILE = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(FILE, 'utf8'));

const P = (html, ko) => ({ kind: 'p', html, ko });
const D = (person, chip, en, lines) => ({ kind: 'dialogue', person, chip, en, lines });

let hc = null;
let bh = null;
for (const ch of story) {
	for (const e of ch.entries ?? []) {
		if (e.title === 'Harmony Council') hc = e;
		if (e.title === 'Bihyung') bh = e;
	}
}
if (!hc) throw new Error('no Harmony Council');
if (!bh) throw new Error('no Bihyung');

const night = hc.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Night Before');
if (night < 0) throw new Error('no Night Before');

const death = [
	P('One night earlier, he is still breathing.', '하룻밤 전, 그는 아직 숨을 쉰다.'),
	{ kind: 'scene', label: "The King's Room", ko: '임금의 침소' },
	P(
		'One lamp. An old king in the bed. Three women around it. By the screen, a man who should not be this quiet.',
		'등잔 하나. 침상 위엔 늙은 임금. 그 둘레에 여자 셋. 병풍 곁엔, 이토록 조용하면 안 되는 사내 하나.'
	),
	P(
		'His daughters Dukman and Chunmyung. Their cousin Sungman. That is who is left.',
		'딸은 덕만과 천명. 사촌은 승만. 남은 사람이 이 셋이다.'
	),
	P(
		'Yongsu is there because he married Chunmyung. Clerk of this house. The king’s son-in-law.',
		'용수는 천명의 남편이라 와 있다. 이 집의 서기. 임금의 사위.'
	),
	P(
		'He looks worse than the daughters do. He is Chunchu’s father. You’ll meet the two of them properly in Bihyung. Not tonight.',
		'딸들보다 상한 얼굴이다. 춘추의 아버지다. 그 둘의 일은 비형에서 제대로 본다. 오늘 밤은 아니다.'
	),
	{
		kind: 'card',
		person: 'yongsu',
		caption: 'Son-in-law. Clerk. Husband to Chunmyung. In any other room he talks to the rafters. Not this one.',
		ko: '사위. 서기. 천명의 남편. 다른 방에선 서까래에 대고 말한다. 이 방에선 아니다.'
	},
	D('jinpyung', '#5a86d6', ['Come here. All three of you.'], ['이리 오너라. 셋이 다.']),
	P('They come. He looks at them the way a man looks at a ledger he is closing.', '셋이 온다. 그는 장부를 덮는 사람처럼 셋을 본다.'),
	D(
		'jinpyung',
		'#5a86d6',
		['I am the last of the men.', 'After me, this house is yours.', 'Your era now.'],
		['내가 남자로는 마지막이다.', '나 다음엔 이 집이 너희 것이다.', '이제 너희 세상이다.']
	),
	P('He finds Chunmyung first.', '먼저 천명을 찾는다.'),
	D(
		'jinpyung',
		'#5a86d6',
		['Your boy can count.', 'Don’t let this room teach him not to.'],
		['네 아이는 셈을 한다.', '이 방이 그걸 빼앗게 두지 마라.']
	),
	D('chunmyung', '#d8a0e8', ['Father—'], ['아버지—']),
	P('He has already turned to Sungman.', '이미 승만 쪽으로 고개를 돌렸다.'),
	D(
		'jinpyung',
		'#5a86d6',
		['You don’t want it.', 'That’s why they’ll come to you, when they’re tired of wanting.'],
		['네가 원하지 않는 줄 안다.', '그래서 나중에 네게 온다. 원하는 데 지치면.']
	),
	D('jinduk', '#9d7bd0', ['Uncle.'], ['숙부.']),
	P('He looks past her. At the man by the screen.', '그는 조카를 지나, 병풍 곁의 사내를 본다.'),
	D('jinpyung', '#5a86d6', ['Yongsu.', 'Come here.'], ['용수.', '이리 오너라.']),
	P('Yongsu comes. He does not talk to the dark. He takes the hand.', '용수가 온다. 어둠에 대고 말하지 않는다. 그 손을 잡는다.'),
	D(
		'jinpyung',
		'#5a86d6',
		['The books stay with you. Until she asks.', 'You kept it.'],
		['장부는 네가 맡아라. 저 아이가 물을 때까지.', '지켰구나.']
	),
	P('Yongsu nods once. He is not a man who nods in front of people.', '용수가 한 번 끄덕인다. 남 앞에선 끄덕이지 않는 사람이다.'),
	P('Then Dukman. Last.', '그리고 덕만. 마지막이다.'),
	D('jinpyung', '#5a86d6', ['Dukman.', 'Come closer.'], ['덕만아.', '가까이 오너라.']),
	D('sunduk', '#E8552B', ['Father.'], ['아버지.']),
	D('jinpyung', '#5a86d6', ['Afraid?'], ['겁나느냐?']),
	D('sunduk', '#E8552B', ['…Yes.'], ['…예.']),
	D('jinpyung', '#5a86d6', ['Good. The other kind make a mess.'], ['좋다. 안 겁내는 쪽이 일을 망친다.']),
	P(
		'He looks at her a long time. She looks back. Nobody else is in that look.',
		'그는 오래 딸을 본다. 딸도 본다. 그 눈엔 다른 사람이 없다.'
	),
	D('jinpyung', '#5a86d6', ['I was eleven.', "You're not.", "You'll do."], ['나는 열하나였다.', '너는 아니다.', '너는 된다.']),
	P('She does not answer. She does not look away.', '대답하지 않는다. 눈을 피하지도 않는다.'),
	P(
		'He asks if the lamp has oil. It does. Then he doesn’t ask anything else.',
		'등잔에 기름이 남았느냐고 묻는다. 남았다. 그 다음엔 아무것도 묻지 않는다.'
	),
	{
		kind: 'card',
		person: 'jinpyung',
		tab: 'epitaph',
		caption: 'King Jinpyung. Fifty-three years. He asked short questions, and listened to the whole answer.',
		ko: '진평왕. 쉰세 해. 짧은 물음을 던지고, 대답은 끝까지 들었다.'
	},
	D(
		'chunmyung',
		'#d8a0e8',
		['He got old in this house.', 'With his name. That’s all I— that’s all I wanted.'],
		['이 집에서 늙었어.', '이름도 그대로. 내가— 내가 바란 게 그거였어.']
	),
	P('Yongsu is still holding the hand.', '용수는 그 손을 아직 잡고 있다.'),
	D('jinduk', '#9d7bd0', ['Dukman. They’ll sit tonight.'], ['덕만 언니. 오늘 밤 화백이 앉는대요.']),
	D('sunduk', '#E8552B', ['I know.'], ['알아.']),
	P('The lamp burns down. That night the pavilion lights.', '등잔이 잦아든다. 그날 밤, 정자에 불이 켜진다.')
];

hc.blocks = [...death, ...hc.blocks.slice(night)];

const fb = hc.blocks.find((b) => b.kind === 'flashback' && b.title?.includes('Three Counts'));
if (!fb) throw new Error('no Three Counts flashback');

fb.blocks = [
	{ kind: 'scene', label: 'The Same Pavilion', ko: '그 정자' },
	P(
		'Same pavilion. Same pond. Same brazier. Fifty-three winters before tonight, six sleeves sat here and unmade a king.',
		'같은 정자, 같은 연못, 같은 화로. 오늘 밤보다 쉰세 해 앞서, 여섯 소매가 여기 앉아 왕 하나를 끌어내렸다.'
	),
	P(
		'The king they are counting is one corridor away. Nobody invited him. In this room a king is not a guest. He is the question.',
		'그들이 세는 왕은 복도 하나 건너에 있다. 아무도 그를 부르지 않았다. 이 방에서 왕은 손님이 아니다. 안건이다.'
	),
	P(
		'Then they argue. A room that has already decided still likes to hear itself say why.',
		'그러고는 다툰다. 이미 마음을 정한 방도 왜 그런지 제 입으로 듣고 싶어 한다.'
	),
	P(
		'The brazier goes red, then blue. The first count goes on the cups: six pieces on the no side. Nobody needs to argue after that, and nobody does.',
		'화로가 붉었다가 푸르러진다. 첫 셈이 잔 옆에 놓인다. 여섯 말이 모두 아니오 쪽이다. 그 다음엔 따질 필요가 없고, 아무도 따지지 않는다.'
	),
	P(
		'The old councillor holds his piece a long time. Then it goes down with the others.',
		'늙은 대등은 나무 조각을 오래 쥐고 있다. 그러고는 다른 조각들 곁에 놓는다.'
	),
	P(
		'He stands through the deliberation, and through the final count. Six pieces stay where they are. The brazier stays blue. It is very quiet, for a thing that ends a reign.',
		'그는 선 채로 의논을 듣고, 마지막 셈을 본다. 여섯 말은 제자리에 있다. 화로는 푸른 채다. 한 임금의 치세가 끝나는 일치고는 아주 조용하다.'
	),
	{ kind: 'scene', label: 'The Corridor', ko: '복도' },
	P(
		'In the corridor a boy of eleven waits with his mother, in a robe hemmed that evening.',
		'복도엔 열한 살 소년이 어머니와 기다린다. 두루마기 단은 그날 저녁에 접어 올렸다.'
	),
	D('manho', '#8a7a68', ['Baekjung.'], ['백정아.']),
	D('jinpyung', '#5a86d6', ['Mother.'], ['엄마.']),
	D('manho', '#8a7a68', ['You’re the king now.'], ['이제 네가 왕이야.']),
	P(
		'He looks at her. She does not look away. He does not raise his voice. He learned that here.',
		'소년이 어머니를 본다. 어머니는 눈을 피하지 않는다. 그는 목소리를 높이지 않는다. 여기서 배운 것이다.'
	),
	P(
		'The lords bow to him on the way out. At the far end of the corridor the lamps go out one by one. Six sleeves file past. The house that woke up Sacred Bone goes to bed True Bone.',
		'나가던 대등들이 그에게 절한다. 복도 저 끝에서 등불이 하나씩 꺼진다. 소매 여섯이 줄지어 지나간다. 성골로 눈을 뜬 그 집은 진골로 잠든다.'
	)
];

const yushinI = hc.blocks.findIndex(
	(b) => b.kind === 'dialogue' && b.person === 'yushin' && (b.en || []).some((l) => l.includes('I have put questions'))
);
if (yushinI < 0) throw new Error('no Yushin deliberation speech');
hc.blocks[yushinI] = D(
	'yushin',
	'#4a8fe0',
	['I have put questions to her.', 'They were answered.'],
	['나는 그분에게 질문을 던져 봤소.', '답이 왔소.']
);

let casts = 0;
const walk = (blocks) => {
	for (const b of blocks ?? []) {
		if (b.cast && b.cast.s2 === 'yumjang') {
			b.cast.s2 = 'eulje';
			casts++;
		}
		if (b.blocks) walk(b.blocks);
	}
};
walk(hc.blocks);
if (casts < 2) throw new Error('expected two yumjang casts, got ' + casts);

const holdout = (bh.images ?? []).find((im) => im.id === 'bh-council-holdout');
if (!holdout) throw new Error('no bh-council-holdout');

const share = (id, at, alt, tempImage) => {
	hc.images ??= [];
	const i = hc.images.findIndex((im) => im.id === id);
	const slot = { id, ratio: 2, at, alt, tempImage };
	if (i >= 0) Object.assign(hc.images[i], slot);
	else hc.images.push(slot);
};

share(
	'hc-council-whose',
	'Then they argue.',
	'At the round council table a councillor speaks across the blue flame, the last wooden vote piece closed in an older man’s fist.',
	'/temp/bh-council-whose.jpg'
);
share(
	'hc-council-holdout',
	'The old councillor holds his piece a long time.',
	holdout.alt,
	holdout.tempImage
);

bh.images ??= [];
if (!bh.images.some((im) => im.id === 'bh-council-whose')) {
	const after = bh.images.findIndex((im) => im.id === 'bh-council-holdout');
	const slot = {
		id: 'bh-council-whose',
		ratio: 2,
		at: 'Shall we say whose?',
		alt: 'At the round council table a councillor speaks across the blue flame, the last wooden vote piece closed in an older man’s fist.',
		tempImage: '/temp/bh-council-whose.jpg'
	};
	if (after >= 0) bh.images.splice(after, 0, slot);
	else bh.images.push(slot);
}

writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
const cut = hc.blocks.findIndex((b) => b.label === 'The Night Before');
console.log('death blocks', cut);
console.log(
	hc.blocks
		.slice(0, cut)
		.map((b, i) => `${i} ${b.kind} ${b.person || b.tab || b.label || (b.html || '').slice(0, 64)}`)
		.join('\n')
);
console.log('--- flashback ---');
console.log(
	fb.blocks.map((b, i) => `${i} ${b.kind} ${b.person || b.label || (b.html || '').slice(0, 64)}`).join('\n')
);
console.log('casts yumjang→eulje:', casts);
console.log('yushin now:', hc.blocks[yushinI].en.join(' / '));
