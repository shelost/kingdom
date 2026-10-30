import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));

function find(entries, title) {
	for (const e of entries || []) {
		if (e.title === title) return e;
		const hit = find(e.entries, title) || find(e.chapters, title);
		if (hit) return hit;
	}
}
function walkTop(obj, title) {
	if (Array.isArray(obj)) return find(obj, title);
	for (const k of Object.keys(obj)) {
		if (Array.isArray(obj[k])) {
			const h = find(obj[k], title);
			if (h) return h;
		}
	}
}
function walkBlocks(blocks, fn) {
	for (const b of blocks || []) {
		fn(b);
		if (b.blocks) walkBlocks(b.blocks, fn);
	}
}
function insertAfter(blocks, pred, items) {
	const i = blocks.findIndex(pred);
	if (i < 0) return false;
	blocks.splice(i + 1, 0, ...items);
	return true;
}
function replaceHtml(blocks, oldHtml, next) {
	let n = 0;
	walkBlocks(blocks, (b) => {
		if (b.html === oldHtml) {
			Object.assign(b, next);
			n++;
		}
	});
	return n;
}

const queen = walkTop(story, 'Queen Sunduk');
if (!queen) throw new Error('Queen Sunduk not found');

replaceHtml(
	queen.blocks,
	'Chunchu looks back at the hills. He made a country up there once, with Yushin, when he was nine and the stars were still negotiable. Neither of them tells it the same way twice.',
	{
		html: 'Chunchu looks back at the hills. He made a country up there once, with Yushin, the week he first tied the headband. A millstone, a pear, a planet. Neither of them tells it the same way twice.',
		ko: '춘추가 뒤의 언덕들을 돌아본다. 저기서 한번 나라를 만든 적이 있다. 유신과 함께, 머리띠를 처음 맨 그 주. 맷돌, 배 하나, 행성 하나. 둘 다 그 이야기를 할 때마다 조금씩 다르게 한다.'
	}
);

walkBlocks(queen.blocks, (b) => {
	if (b.kind === 'flashback' && b.title === 'the east star') {
		b.year = '618';
		if (b.blocks?.[0]?.html?.startsWith('Two boys on a hill')) {
			b.blocks.splice(0, 1, {
				kind: 'p',
				html: 'Class 59’s first week. A millstone with a rope through it. A fifteen-year-old who will not stop. On the ninth circuit a young hwarang in blue is cutting through the yard on his way to somewhere else. He is not the marshal. He sits on the wall for one pear.',
				ko: '오십구기 첫 주. 구멍에 밧줄 꿴 맷돌. 멈추지 않는 열다섯. 아홉 바퀴째, 푸른 옷의 젊은 화랑 하나가 어디론가 가던 길에 마당을 가로지른다. 도감이 아니다. 배 하나 먹으려고 담에 앉는다.'
			},
			{
				kind: 'p',
				html: 'He tosses the core. The boy’s hands are full of rope. It hits him in the chest, and he sits down on the stone because there is nowhere else.',
				ko: '그는 배 심을 던진다. 소년의 손은 밧줄로 가득하다. 가슴에 맞는다. 달리 앉을 데가 없어서 맷돌 위에 앉는다.'
			},
			{
				kind: 'dialogue',
				person: 'yushin',
				look: 'hwarang',
				lines: ['아홉 바퀴군.'],
				en: ['That’s nine.']
			},
			{
				kind: 'dialogue',
				person: 'chunchu',
				look: 'hwarang',
				lines: ['압니다. 세고 있어요.'],
				en: ['I know. I’m counting.']
			},
			{
				kind: 'dialogue',
				person: 'yushin',
				look: 'hwarang',
				lines: ['도감은 네 바퀴째에 자러 갔네.', '김유신이다. 오십일기.'],
				en: ['The Marshal went to bed after four.', 'Kim Yushin. Class 51.']
			},
			{
				kind: 'p',
				html: 'That night they lie on the hill above the same yard. The pear is still in the story. The sky is the rest of it.',
				ko: '그날 밤 둘은 그 마당 위 언덕에 드러눕는다. 배는 아직 이야기에 남아 있다. 나머지는 하늘이다.'
			});
		}
	}
});
console.log('Queen Sunduk: first meet is 618 millstone, then the star.');

const munhee = walkTop(story, 'Munhee');
if (!munhee) throw new Error('Munhee not found');

replaceHtml(
	munhee.blocks,
	'At the top of the hill, on the ninth, a young man in an officer’s coat is sitting on the wall eating a pear.',
	{
		html: 'At the top of the hill, on the ninth, a young hwarang in blue is cutting through on his way to somewhere else. He is not the marshal. He sits on the wall for one pear.',
		ko: '아홉 바퀴째, 언덕 꼭대기. 푸른 옷의 젊은 화랑 하나가 어디론가 가던 길에 마당을 가로지른다. 도감이 아니다. 배 하나 먹으려고 담에 앉는다.'
	}
);

if (
	insertAfter(
		munhee.blocks,
		(b) =>
			b.html ===
			'At the top of the hill, on the ninth, a young hwarang in blue is cutting through on his way to somewhere else. He is not the marshal. He sits on the wall for one pear.',
		[
			{
				kind: 'p',
				html: 'He tosses the core without looking. Chunchu’s hands are on the rope. It hits him square, and that is how they meet.',
				ko: '그는 보지도 않고 배 심을 던진다. 춘추의 손은 밧줄에 있다. 정면으로 맞는다. 그렇게 처음 만난다.'
			}
		]
	)
)
	console.log('Munhee: pear-core hit.');

walkBlocks(munhee.blocks, (b) => {
	if (
		b.person === 'chunchu' &&
		b.en?.[0] === '…You’re the one from the hill. Years ago. You told me my star was a planet.'
	) {
		b.lines = ['…누구세요.'];
		b.en = ['…Who are you.'];
	}
	if (b.person === 'yushin' && b.en?.[0] === 'It is a planet.') {
		b.lines = ['김유신이다.', '오십일기.'];
		b.en = ['Kim Yushin.', 'Class 51.'];
	}
	if (b.person === 'yushin') b.look = 'hwarang';
	if (
		b.html ===
		'Yushin looks at him. Then, for the first time in Class 59’s memory, the General laughs.'
	) {
		b.html = 'Yushin looks at him. Then, for the first time in Class 59’s memory, the man on the wall laughs.';
		b.ko = '유신이 그를 본다. 그러고는, 오십구기가 기억하는 한 처음으로, 담 위의 사내가 웃는다.';
	}
});
console.log('Munhee: first meet, not a reunion.');

const yongsu = walkTop(story, 'Yongsu');
if (yongsu) {
	replaceHtml(
		yongsu.blocks,
		'That autumn the watch reports that the goblin’s whelp gave the moon verse for his whole class and made the Yard Marshal laugh. The steward has the watchman repeat it four times, then tells it to the stream.',
		{
			html: 'That autumn the watch reports that the goblin’s whelp dragged the millstone nine times and got hit by a pear. A Class 51 man on the wall, passing through. The steward has the watchman repeat it four times, then tells it to the stream.',
			ko: '그해 가을 순라꾼이 소식을 전한다. 도깨비 새끼가 맷돌을 아홉 바퀴 끌고, 배를 맞았다고. 담 위의 오십일기, 지나가던 길. 청지기는 순라꾼한테 네 번을 다시 말하게 하고, 그걸 개울한테 들려준다.'
		}
	);
	console.log('Yongsu: pear cameo on Class 59 morning.');
}

const jinhung = walkTop(story, 'Jinhung, the Cloud');
if (!jinhung) throw new Error('Jinhung not found');

walkBlocks(jinhung.blocks, (b) => {
	if (b.en?.[0] === 'Sadaham, Majesty. Thirteen. He’s made three of them cry already.') {
		b.lines = ['김씨입니다, 전하. 열셋인데, 벌써 셋을 울렸습니다.'];
		b.en = ['A Kim, Majesty. Thirteen. He’s made three of them cry already.'];
	}
});

insertAfter(
	jinhung.blocks,
	(b) => b.person === 'sadaham' && b.en?.[0] === 'I’ll go.',
	[
		{
			kind: 'p',
			html: 'The king throws a lacquer cup at him. It is not a good throw. The boy is still on one knee. The cup hits the headband, comes back, and sits the king down on his own step.',
			ko: '왕이 그에게 옻칠 잔을 던진다. 던지기를 잘하지 못한다. 소년은 아직 한쪽 무릎을 꿇고 있다. 잔이 머리띠에 맞고 돌아와, 왕을 제 섬돌에 앉힌다.'
		},
		{
			kind: 'dialogue',
			person: 'jinheung',
			lines: ['데려가라.', '테이블을 던지기 전에.'],
			en: ['Take him.', 'Before I throw the table.']
		},
		{
			kind: 'p',
			html: 'A Park girl on the porch laughs once, then covers her mouth. Nobody asks her name.',
			ko: '툇마루의 박씨 계집아이 하나가 한 번 웃고, 입을 가린다. 이름을 묻는 사람은 없다.'
		}
	]
);

replaceHtml(
	jinhung.blocks,
	'At the edge of the square a general in a cone helm watches, and does not stop him. The king on the far ridge does not stop him either. Gaya, as a name, is over.',
	{
		html: 'At the edge of the square a general in a cone helm watches, and does not stop him. The last rope snaps, whips, and sits the general in the mud. The boy does not look sorry. The king on the far ridge laughs once, the same laugh as the cup. Gaya, as a name, is over.',
		ko: '광장 가장자리에서 고깔 투구의 장수가 보고, 말리지 않는다. 마지막 밧줄이 끊어지며 채찍처럼 돌아가, 장수를 진흙에 앉힌다. 소년은 미안해하지 않는다. 먼 능선의 임금이 한 번 웃는다. 잔 때와 같은 웃음. 가야라는 이름은, 여기까지다.'
	}
);
console.log('Jinhung: unnamed cup, unnamed rope.');

const sadaham = walkTop(story, 'Sadaham');
if (!sadaham) throw new Error('Sadaham not found');

walkBlocks(sadaham.blocks, (b) => {
	if (
		b.html ===
		'He does. And the day after. The old general leading the campaign once took an island by frightening it with wooden lions. He tells the king it will be quicker to bring the boy than to keep hearing him.'
	) {
		b.html =
			'The king throws a cup at his head. Sadaham is still on one knee. He does not mean to duck. The cup hits the headband, goes back, and the Cloud King sits down on his own step as if someone had pulled a chair out.';
		b.ko =
			'왕이 그의 머리에 잔을 던진다. 사다함은 아직 한쪽 무릎을 꿇고 있다. 피하려고 한 게 아니다. 잔이 머리띠에 맞고 돌아가고, 구름왕은 누가 의자를 뺀 것처럼 제 섬돌에 앉는다.';
	}
});
walkBlocks(sadaham.blocks, (b) => {
	if (b.person === 'jinheung' && b.en?.[0] === 'Fine. Take him.') {
		b.en = ['Take him.', 'Before I throw the table.'];
		b.lines = ['데려가라.', '테이블을 던지기 전에.'];
	}
});
insertAfter(
	sadaham.blocks,
	(b) => b.person === 'jinheung' && b.en?.[0] === 'Take him.',
	[
		{
			kind: 'dialogue',
			person: 'sadaham',
			en: ['…Majesty.'],
			lines: ['…전하.']
		},
		{
			kind: 'p',
			html: 'On the porch a Park girl laughs once and covers her mouth. He will ask her name on the way out. Mishil. She is a year younger than he is, and she is still laughing when he looks back.',
			ko: '툇마루에서 박씨 계집아이 하나가 한 번 웃고 입을 가린다. 나가면서 이름을 묻는다. 미실. 그보다 한 살 어리고, 그가 돌아봤을 때도 아직 웃고 있다.'
		}
	]
);

insertAfter(
	sadaham.blocks,
	(b) => b.html === 'The last rope comes off near sunset.',
	[
		{
			kind: 'p',
			html: 'The end of it snaps like a whip. The general in the cone helm is still standing too close. He sits down in the mud, hard, as if the rope had an opinion.',
			ko: '끝부분이 채찍처럼 튕긴다. 고깔 투구의 장수가 아직 너무 가까이 서 있다. 밧줄에 의견이 있기라도 한 듯, 진흙에 세게 앉는다.'
		},
		{
			kind: 'dialogue',
			person: 'sadaham',
			en: ['Sorry.', 'I was cutting.'],
			lines: ['죄송합니다.', '자르고 있었습니다.']
		},
		{
			kind: 'dialogue',
			person: 'muryuk',
			look: 'unnamed',
			en: ['I noticed.'],
			lines: ['알겠구마.']
		}
	]
);

if (
	insertAfter(
		sadaham.blocks,
		(b) => b.person === 'muryuk' && b.en?.[0] === 'Not the riding.',
		[
			{
				kind: 'p',
				html: 'The general is still sitting in the mud when he says it. He does not get up to say it. That is the first thing Sadaham likes about him.',
				ko: '그 말을 할 때도 장군은 아직 진흙에 앉아 있다. 일어나서 하지 않는다. 사다함이 그를 좋아하게 된 첫 번째 이유다.'
			}
		]
	)
)
	console.log('Sadaham: cup + rope + Mishil laugh.');

const muryuk = walkTop(story, 'Muryuk');
if (!muryuk) throw new Error('Muryuk not found');

insertAfter(
	muryuk.blocks,
	(b) =>
		b.html ===
		'The last rope comes off near sunset.',
	[
		{
			kind: 'p',
			html: 'The end of it comes back like a whip and sits him in the mud. The boy looks down, surprised, as if the rope had done it alone.',
			ko: '끝부분이 채찍처럼 돌아와 그를 진흙에 앉힌다. 소년이 내려다본다. 놀란 얼굴. 밧줄이 혼자 한 일인 것처럼.'
		},
		{
			kind: 'dialogue',
			person: 'sadaham',
			en: ['Sorry.', 'I was cutting.'],
			lines: ['죄송합니다.', '자르고 있었습니다.']
		},
		{
			kind: 'dialogue',
			person: 'muryuk',
			en: ['I noticed.'],
			lines: ['알겠구마.']
		}
	]
);

replaceHtml(
	muryuk.blocks,
	'Muryuk stays where he is, long enough to look like a man guarding prisoners. He isn’t guarding anything. He is thinking about a cart, and a wall a hand lower than the neighbours’, and a word he has spent thirty years saying like the name of a dog that bit him.',
	{
		html: 'Muryuk stays where he is — in the mud, now — long enough to look like a man guarding prisoners. He isn’t guarding anything. He is thinking about a cart, and a wall a hand lower than the neighbours’, and a word he has spent thirty years saying like the name of a dog that bit him.',
		ko: '무력은 그 자리에 앉아 있다. 이제는 진흙 위에. 포로를 지키는 사람처럼 보일 만큼 오래. 아무것도 지키고 있지 않다. 수레를 생각하고 있다. 이웃집보다 한 뼘 낮은 담을, 그리고 서른 해 동안 자기를 문 개 이름처럼 불러 온 한 낱말을.'
	}
);
console.log('Muryuk: rope from the dirt.');

const seohyun = walkTop(story, 'Seohyun');
if (seohyun) {
	replaceHtml(
		seohyun.blocks,
		'Manmyung lays the baby in his arms. The old man looks at him for a long time, the way he once looked back at a harbour. His mouth moves. Seohyun leans in.',
		{
			html: 'Manmyung lays the baby in his arms. The old man looks at him for a long time, the way he once looked at a boy who sat him in the mud with a rope and never quite said it right. His mouth moves. Seohyun leans in.',
			ko: '만명이 아기를 그의 품에 눕힌다. 노인은 오래도록 아기를 본다. 한때 밧줄로 자기를 진흙에 앉히고, 제대로 미안하단 소리를 못 했던 소년을 보던 그 눈으로. 입술이 움직인다. 서현이 몸을 숙인다.'
		}
	);
	console.log('Seohyun: rope memory on the baby.');
}

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('Wrote story.json');
