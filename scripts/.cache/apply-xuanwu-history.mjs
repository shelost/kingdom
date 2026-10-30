import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (person, en, lines, extra = {}) => ({
	kind: 'dialogue',
	person,
	en,
	lines,
	...extra
});

const INTRO_EN =
	'The Ministry of War can’t find him a general, so Chunchu tries the historians. Chu Suiliang receives him among the shelves. He once refused to let the emperor read his own diary. Then he helped compile it for him. Everyone in Chang’an knows how this emperor got the throne: at a palace gate, over two dead brothers. Nobody in Chang’an says it.';
const INTRO_KO =
	'병부가 장수를 찾아 주지 못하자 춘추는 사관들을 찾아간다. 저수량이 서가 사이에서 그를 맞는다. 한때 황제가 제 일기를 읽지 못하게 막은 사람이다. 그러고는 그 일기를 손수 엮어 바쳤다. 장안 사람이면 누구나 이 황제가 어떻게 보위에 올랐는지 안다. 궁궐 문 하나에서, 죽은 형제 둘을 넘어서. 장안에서 그 말을 하는 사람은 없다.';

const afterJin = [
	d(
		'chunchu',
		['May I see the fourth day.'],
		['초나흘, 한번 봐도 되겠습니까.'],
		{ chip: '#D8258C', look: 'ambassador' }
	),
	p(
		'Chu does not move for a long time. Then he takes a volume down, as if it were any other year.',
		'저수량은 한동안 움직이지 않는다. 그러고는 아무 해나 집듯 책 하나를 내린다.'
	),
	p(
		'The fourth day is in it. The paper is not blank. The First Prince meant to kill him. The other brother was in on it. The Second Prince did what the Duke of Zhou did, when the house was at stake, and the house stood.',
		'초나흘이 들어 있다. 종이는 비어 있지 않다. 일황자가 그를 죽이려 했다. 다른 아우도 함께였다. 이황자는 주공(周公)이 한 일을 했다. 집안이 위태로울 때. 집안은 섰다.'
	),
	d(
		'chunchu',
		['That isn’t nothing.'],
		['그건 아무 일도 아닌 게 아닌데요.'],
		{ chip: '#D8258C', look: 'ambassador' }
	),
	d(
		'chusuiliang',
		['Nothing happened at the gate.', 'This is what happened in the book.'],
		['문 앞에선 아무 일도 없었습니다.', '책 안에서 일어난 일은 이거고요.'],
		{
			chip: '#8c7a5b',
			zh: ['門前什麼事也沒有。', '書裡發生的，是這個。'],
			zhLatn: ['Mén qián shénme shì yě méiyǒu.', 'Shū lǐ fāshēng de, shì zhège.']
		}
	),
	p(
		'You know this trick. Leave the fourth day out. Or leave it in, and change the verb.',
		'이 수작은 당신도 안다. 초나흘을 빼 버리거나. 남겨 두고 동사만 바꾸거나.'
	)
];

const atDesk = [
	d(
		'taizong',
		['They showed you a gate.'],
		['문을 보여 주더냐.'],
		{
			chip: '#c97a2e',
			zh: ['他們給你看了那座門。'],
			zhLatn: ['Tāmen gěi nǐ kàn le nà zuò mén.']
		}
	),
	d(
		'chunchu',
		['A very fine gate, Majesty.'],
		['아주 훌륭한 문이었습니다, 폐하.'],
		{ chip: '#D8258C', look: 'ambassador' }
	),
	d(
		'taizong',
		[
			'And a page. The Duke of Zhou killed his brothers so the house would stand. I told them to write that I did the same.',
			'Now I did.'
		],
		[
			'페이지도 봤겠지. 주공은 아우를 죽여 집안을 세웠다. 짐도 그리 했다고 쓰라 했다.',
			'이제 그리 한 것이다.'
		],
		{
			chip: '#c97a2e',
			zh: [
				'還有一頁。周公誅兄弟以安周。朕令其書朕亦如是。',
				'如今便是。'
			],
			zhLatn: [
				'Hái yǒu yì yè. Zhōugōng zhū xiōngdì yǐ ān Zhōu. Zhèn lìng qí shū zhèn yì rúshì.',
				'Rújīn biàn shì.'
			]
		}
	),
	d(
		'chunchu',
		['…And if the page is wrong?'],
		['…만일 그 페이지가 틀렸다면요?'],
		{ chip: '#D8258C', look: 'ambassador' }
	),
	d(
		'taizong',
		['Print it again.'],
		['다시 새기거라.'],
		{
			chip: '#c97a2e',
			zh: ['再刻便是。'],
			zhLatn: ['Zài kè biàn shì.']
		}
	)
];

function findEntry(title) {
	for (const ch of story) {
		for (const e of ch.entries ?? []) if (e.title === title) return e;
	}
	return null;
}

const en = findEntry('Li Shimin');
if (!en) throw new Error('Li Shimin not found');
const b = en.blocks;

const intro = b.find(
	(x) =>
		x.kind === 'p' &&
		typeof x.html === 'string' &&
		x.html.includes('Chu Suiliang receives him among the shelves')
);
if (!intro) throw new Error('History Office intro not found');
intro.html = INTRO_EN;
intro.ko = INTRO_KO;

const jinIdx = b.findIndex(
	(x) =>
		x.kind === 'dialogue' &&
		x.person === 'chusuiliang' &&
		Array.isArray(x.en) &&
		x.en.some((line) => String(line).includes('that Jin is gone'))
);
if (jinIdx < 0) throw new Error('Jin-is-gone line not found');
const fifthIdx = b.findIndex(
	(x, i) =>
		i > jinIdx &&
		x.kind === 'dialogue' &&
		x.person === 'chunchu' &&
		Array.isArray(x.en) &&
		x.en.some((line) => String(line).includes('I’ll take the fifth'))
);
if (fifthIdx < 0) throw new Error('take-the-fifth line not found');
if (b[jinIdx + 1]?.en?.[0] === 'May I see the fourth day.') {
	console.log('shelf beats already present');
} else {
	b.splice(fifthIdx, 0, ...afterJin);
	console.log('inserted shelf beats at', fifthIdx);
}

const waterIdx = b.findIndex(
	(x) =>
		x.kind === 'dialogue' &&
		x.person === 'taizong' &&
		Array.isArray(x.en) &&
		x.en.some((line) => String(line).includes('Your uncles are passengers'))
);
if (waterIdx < 0) throw new Error('passengers line not found');
if (b[waterIdx + 1]?.en?.[0] === 'They showed you a gate.') {
	console.log('desk beats already present');
} else {
	b.splice(waterIdx + 1, 0, ...atDesk);
	console.log('inserted desk beats after', waterIdx);
}

const brush = b.find(
	(x) =>
		x.kind === 'p' &&
		typeof x.html === 'string' &&
		x.html.includes('watching the brush in the emperor’s hand')
);
if (!brush) throw new Error('brush paragraph not found');
brush.html =
	'The emperor shakes his head, still smiling, and goes back to his memorials. Chunchu says nothing more. He is watching the brush in the emperor’s hand: one man, one brush, and at the far end of it a province three months away, and a fourth day that will stay as this man said it. Nobody in this palace will ever meet in a room to vote that hand off the paper. He cannot stop looking at it, the way a poor man looks at a jade he will never afford, and he does not let one particle of it reach his face.';
brush.ko =
	'황제는 여전히 웃으며 고개를 젓고, 상소문으로 돌아간다. 춘추는 더 말하지 않는다. 그는 황제 손에 들린 붓을 보고 있다. 사람 하나, 붓 하나, 그리고 그 붓 끝 저편에 석 달 길의 고을. 그리고 이 사람이 말한 대로 남을 초나흘. 이 궁에서는 누구도 한 방에 모여 저 손을 종이에서 표결로 떼어 내지 못할 것이다. 평생 살 수 없는 옥을 바라보는 가난한 사람처럼 춘추는 거기서 눈을 떼지 못하고, 그 마음을 얼굴에는 티끌만큼도 올리지 않는다.';

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('wrote story.json');
