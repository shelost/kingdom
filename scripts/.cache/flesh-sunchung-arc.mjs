#!/usr/bin/env node
/**
 * Sunchung personal arc: Yunchung, drunk Euija, starve, night watch, blood letter.
 * Do not restage Descent (belt / Kangrim / dying-memorial quote).
 */
import { readFileSync, writeFileSync } from 'node:fs';

const PATH = new URL('../../src/lib/data/story.json', import.meta.url);
const data = JSON.parse(readFileSync(PATH, 'utf8'));

function walk(nodes, fn) {
	for (const n of nodes || []) {
		fn(n);
		walk(n.chapters, fn);
		walk(n.entries, fn);
		walk(n.parts, fn);
	}
}

function findEntry(title) {
	let hit;
	walk(data, (n) => {
		if (n.title === title && Array.isArray(n.blocks)) hit = n;
	});
	if (!hit) throw new Error(`missing entry ${title}`);
	return hit;
}

function idx(blocks, pred, label) {
	const i = blocks.findIndex(pred);
	if (i < 0) throw new Error(`not found: ${label}`);
	return i;
}

const CHIP_SUN = '#9fb4c9';
const CHIP_YUN = '#c9932a';
const CHIP_EUI = '#e08a2e';
const CHIP_WATCH = '#8a8680';
const CHIP_MAID = '#c9a0a8';
const CHIP_CLERK = '#7d7568';
const CHIP_HUNG = '#b98f33';

const sunchung = findEntry('Sunchung');
const hungsu = findEntry('Hungsu');

const wharf = {
	kind: 'flashback',
	year: '642',
	title: 'The Sabi wharf · the autumn Daeya fell',
	blocks: [
		{
			kind: 'scene',
			label: 'Sabi wharf',
			ko: '사비 나루',
			year: 642,
			jump: { year: 642, en: 'Eighteen Years Earlier…', ko: '열여덟 해 전…' }
		},
		{
			kind: 'p',
			html: 'Eighteen autumns back, two brothers stood on the Sabi wharf and watched a boat unload heads. The younger had taken Daeya. The elder had told the king not to try.',
			ko: '열여덟 해 전 가을, 두 형제가 사비 나루에 서서 배에서 머리들이 내려지는 것을 보았다. 아우는 대야를 떨어뜨렸다. 형은 임금에게 하지 말라고 했었다.'
		},
		{
			kind: 'dialogue',
			chip: CHIP_YUN,
			person: 'yunchung',
			lines: ['잘했다 한마디는 해 주시오, 형님. 다들 하는데.'],
			en: ['You could say well done, hyung. Everybody else has.']
		},
		{
			kind: 'dialogue',
			chip: CHIP_SUN,
			person: 'seongchung',
			lines: ['저건 누구 거냐. 저 옻칠 상자.'],
			en: ['Whose is that? The lacquer box.']
		},
		{
			kind: 'dialogue',
			chip: CHIP_YUN,
			person: 'yunchung',
			lines: ['성주 아내요. 춘추의 딸. 임금께서 이야기를 원하셨소.'],
			en: ['The governor’s wife. Chunchu’s daughter. The king wanted a story.']
		},
		{
			kind: 'dialogue',
			chip: CHIP_SUN,
			person: 'seongchung',
			lines: ['그럼 잘했다, 아우야. 신라한테도 이야기를 하나 줬구나.'],
			en: ['Then well done, little brother. You’ve given Silla one too.']
		},
		{
			kind: 'dialogue',
			chip: CHIP_YUN,
			person: 'yunchung',
			lines: ['이야기. 형은 맨날 그렇게만 말하오. 사람처럼 잘했다 하시오.'],
			en: ['A story. You always talk like that. Say well done like a person.']
		},
		{
			kind: 'dialogue',
			chip: CHIP_SUN,
			person: 'seongchung',
			lines: ['그 이야기 받으러 다시 오면. 고개만은 기억해.'],
			en: ['When they come back for that story. Remember the pass.']
		},
		{
			kind: 'dialogue',
			chip: CHIP_YUN,
			person: 'yunchung',
			lines: ['다시 안 옵니다, 형님. 내가 성을 떨어뜨렸소.'],
			en: ['They’re not coming back, hyung. I took the fortress.']
		},
		{
			kind: 'p',
			html: 'Yunchung laughed. He thought a grudge was a thing you could settle with ten thousand men. His brother spent the rest of his life reading tides, waiting for this one to come in.',
			ko: '윤충은 웃었다. 원한은 만 명이면 정리되는 거라고 여겼다. 형은 남은 평생 물때를 읽으며 이 물이 들어오기를 기다렸다.'
		}
	]
};

const thirdMonth = {
	kind: 'flashback',
	year: '656',
	title: 'The third month · wine night',
	blocks: [
		{
			kind: 'scene',
			label: 'The Hall',
			ko: '전각',
			year: 656,
			jump: { year: 656, en: 'The Same Year…', ko: '그해…' }
		},
		{
			kind: 'p',
			html: 'The feast is already loud. He has been in the door long enough for his sleeves to dry.',
			ko: '잔치는 이미 시끄럽다. 소매가 마를 만큼 문간에 서 있었다.'
		},
		{
			kind: 'dialogue',
			chip: CHIP_SUN,
			person: 'seongchung',
			lines: ['폐하. 잔이— 오늘 밤만이라도—'],
			en: ['Majesty. The cups. If I may— just tonight—']
		},
		{
			kind: 'dialogue',
			chip: CHIP_EUI,
			person: 'euija',
			lines: ['흥수가 그 노래를 이미 불렀다. 너도 부임 연습이냐.'],
			en: ['Hungsu already sang me that song. You practicing for a posting too?']
		},
		{
			kind: 'dialogue',
			chip: CHIP_SUN,
			person: 'seongchung',
			lines: ['부임이 아니옵니다. 고개요. 저들이 넘으면—'],
			en: ['No posting, Majesty. The pass. If they come over—']
		},
		{
			kind: 'dialogue',
			chip: CHIP_EUI,
			person: 'euija',
			lines: [
				'누가 보냈느냐. 사택이냐. 진모냐. 집 이름을 대거라.',
				'세었다. 좋은 말이다. 너는 물을 세고 과인은 마시라 이거지.',
				'아우놈은 과인에게 성을 하나 바쳤다. 너는 날씨 보고를 들고 오는구나.',
				'끌어내거라. 잔 세는 서리는 안 본다.'
			],
			en: [
				'Who sent you. The Satek. The Jinmo. Say a house.',
				'Counted. There’s a word. You count water while I drink it.',
				'Your brother took me a fortress. You bring me a weather report.',
				'Get him out of my sight. I don’t want a clerk counting my cups.'
			]
		},
		{
			kind: 'p',
			html: 'They take him at the door. The belt comes off in the aisle. If you were in this hall that night, you already know. This is the yard.',
			ko: '문간에서 끌어낸다. 허리띠는 복도에서 벗겨진다. 그날 밤 이 전각에 있었다면, 이미 아는 일이다. 지금은 마당이다.'
		},
		{
			kind: 'scene',
			label: 'The yard',
			ko: '마당',
			year: 656
		},
		{
			kind: 'p',
			html: 'Yunchung is already in the yard. He will not go in.',
			ko: '윤충은 이미 마당에 있다. 안으로 들어가지 않는다.'
		},
		{
			kind: 'dialogue',
			chip: CHIP_SUN,
			person: 'seongchung',
			lines: ['윤아. 한 마디만.'],
			en: ['Yun-ah. One word.']
		},
		{
			kind: 'dialogue',
			chip: CHIP_YUN,
			person: 'yunchung',
			lines: ['만 명 데리고 대야를 떨어뜨렸소. 형님은 술 단지 하나를 나보고 떨어뜨리라는 거요.'],
			en: ['I took Daeya with ten thousand men. You’re asking me to knock over a wine jar.']
		},
		{
			kind: 'dialogue',
			chip: CHIP_SUN,
			person: 'seongchung',
			lines: ['방에 있어 달라는 거야. 그게 다야.'],
			en: ['I’m asking you to be in the room. That’s all.']
		},
		{
			kind: 'dialogue',
			chip: CHIP_YUN,
			person: 'yunchung',
			lines: ['형님이 물때를 맞으면, 내가 가서 막겠소. 지금은— 지금은 문 안에 못 들어가겠소.'],
			en: ['If you hit the tide, I’ll go hold it. Right now— I can’t go through that door.']
		},
		{
			kind: 'p',
			html: 'He looks at the door. He does not go in. The night watch takes Sunchung the other way.',
			ko: '문을 본다. 들어가지 않는다. 옥졸이 성충을 반대쪽으로 데려간다.'
		},
		{
			kind: 'scene',
			label: 'The cell',
			ko: '옥',
			year: 656
		},
		{
			kind: 'p',
			html: 'They do not feed him. Not as a sentence. As a habit.',
			ko: '밥을 안 준다. 형벌로가 아니다. 습관으로.'
		},
		{
			kind: 'p',
			html: 'The feast is on the other side of the wall. Somebody laughs. A cup hits a table, and the sound comes through the plaster as if the plaster were paper.',
			ko: '잔치는 벽 너머다. 누가 웃는다. 잔이 상에 부딪히고, 그 소리가 회벽을 종이처럼 뚫고 온다.'
		},
		{
			kind: 'p',
			html: 'A week, and the court robe hangs on him. Two, and he can count his own ribs when the lamp hits. He stops asking for rice. Asking is a conversation, and nobody is having one.',
			ko: '일주일, 관복이 몸에 걸린다. 이주, 등잔 빛에 제 갈비를 셀 수 있다. 쌀을 청하는 일을 그만둔다. 청하는 것은 대화고, 대화를 하는 사람은 없다.'
		},
		{
			kind: 'p',
			html: 'The night watch comes after the cups go quiet. One sheet. A small dish of ink.',
			ko: '잔 소리가 잦아든 뒤에 옥졸이 온다. 종이 한 장. 먹 종지 하나.'
		},
		{
			kind: 'dialogue',
			chip: CHIP_WATCH,
			speaker: 'The night watch',
			gender: 'm',
			lines: ['나으리. 밥은— 밥은 제가 못 넣어 드려요. 들키면—'],
			en: ['Sir. Rice I— I can’t put rice in. If they catch—']
		},
		{
			kind: 'dialogue',
			chip: CHIP_SUN,
			person: 'seongchung',
			lines: ['종이는.'],
			en: ['Paper.']
		},
		{
			kind: 'dialogue',
			chip: CHIP_WATCH,
			speaker: 'The night watch',
			gender: 'm',
			lines: ['종이는… 서기 방에서요. 먹이랑.'],
			en: ['Paper I… from the clerk’s room. And ink.']
		},
		{
			kind: 'p',
			html: 'The watch puts his back to the door. Sunchung writes. The hand is slower than it used to be. He names the pass the soldiers call Tanhyun. He starts the river mouth they call Final Ford.',
			ko: '옥졸은 문에 등을 댄다. 성충이 적는다. 손은 예전보다 느리다. 군졸들이 탄현이라 부르는 고개를 적는다. 기벌포라 부르는 강어귀를 적기 시작한다.'
		},
		{
			kind: 'p',
			html: 'The ink dies mid-character.',
			ko: '획 중간에 먹이 끊긴다.'
		},
		{
			kind: 'dialogue',
			chip: CHIP_SUN,
			person: 'seongchung',
			lines: ['먹이—'],
			en: ['The ink—']
		},
		{
			kind: 'dialogue',
			chip: CHIP_WATCH,
			speaker: 'The night watch',
			gender: 'm',
			lines: ['그게 다예요. 서기 놈이—'],
			en: ['That’s all there is. The clerk—']
		},
		{
			kind: 'p',
			html: 'Sunchung looks at his left hand. The watch looks at the door. Does not ask. Turns his back. He splits the skin at the base of the thumb. The last two names go down red.',
			ko: '성충은 왼손을 본다. 옥졸은 문을 본다. 묻지 않는다. 등을 돌린다. 엄지 밑을 짼다. 마지막 두 이름이 붉게 내려간다.'
		},
		{
			kind: 'dialogue',
			chip: CHIP_SUN,
			person: 'seongchung',
			lines: ['…가져가시오. 전각에. 단지 밑이든, 어디든—'],
			en: ['…Take it. To the hall. Under a jar, anywhere—']
		},
		{
			kind: 'p',
			html: 'A guard takes the paper. The footsteps stop in the hall. Then they come back empty. Somebody sets something heavy down on the other side of the wall, and nobody comes to read it aloud.',
			ko: '파수가 종이를 가져간다. 발소리가 전각에서 멈춘다. 빈손으로 돌아온다. 벽 너머에서 누가 무거운 것을 내려놓고, 읽어 주는 사람은 없다.'
		}
	]
};

const afterMarket = idx(
	sunchung.blocks,
	(b) => /Two armies are coming for the capital/.test(b.html || ''),
	'Sunchung market'
);

const lampI = idx(
	sunchung.blocks,
	(b) => b.title === 'The last lamp · the night Hungsu left',
	'last lamp'
);
const lamp = sunchung.blocks[lampI];

const oldWharfI = sunchung.blocks.findIndex((b) => b.title === 'The Sabi wharf · the autumn Daeya fell');
if (oldWharfI >= 0) sunchung.blocks.splice(oldWharfI, 1);

const lampNow = idx(
	sunchung.blocks,
	(b) => b.title === 'The last lamp · the night Hungsu left',
	'last lamp after wharf cut'
);
sunchung.blocks.splice(lampNow, 1);

const cellI = sunchung.blocks.findIndex(
	(b) => b.title === 'The cell · third month' || b.title === 'The third month · wine night'
);
if (cellI >= 0) sunchung.blocks.splice(cellI, 1);

const marketNow = idx(
	sunchung.blocks,
	(b) => /Two armies are coming for the capital/.test(b.html || ''),
	'Sunchung market after cuts'
);
sunchung.blocks.splice(marketNow + 1, 0, wharf, lamp, thirdMonth);

const maidRead = idx(
	sunchung.blocks,
	(b) =>
		b.kind === 'dialogue' &&
		b.person === 'courtmaid' &&
		Array.isArray(b.en) &&
		b.en.some((l) => /Then just his name/.test(l)),
	'maid reads letter'
);
const maid = sunchung.blocks[maidRead];
if (!maid.en.some((l) => /different colour|different color/.test(l))) {
	maid.en.push('Majesty, the last two names. They’re a different colour. Darker. Like he ran out.');
	maid.lines.push('폐하, 맨 끝 두 이름요. 색이 달라요. 더 진해요. 떨어진 것처럼.');
}

const afterMaid = sunchung.blocks[maidRead + 1];
if (
	!afterMaid ||
	!(Array.isArray(afterMaid.en) && afterMaid.en.some((l) => /Don’t tell me that|Don't tell me that/.test(l)))
) {
	sunchung.blocks.splice(maidRead + 1, 0, {
		kind: 'dialogue',
		chip: CHIP_EUI,
		person: 'euija',
		lines: ['됐다. 그 말은 하지 마라.'],
		en: ['Don’t. Don’t tell me that.']
	});
}

function walkHungsu(blocks, fn) {
	for (const b of blocks || []) {
		fn(b);
		walkHungsu(b.blocks, fn);
	}
}

walkHungsu(hungsu.blocks, (b) => {
	if (
		b.kind === 'dialogue' &&
		Array.isArray(b.en) &&
		b.en[0] === 'The councillor in Sabi. The one who— in the cell.'
	) {
		b.speaker = 'The clerk';
		b.gender = 'm';
		b.chip = CHIP_CLERK;
		if (!b.en.some((l) => /red/.test(l))) {
			b.en = [
				'The councillor in Sabi. The one who— in the cell.',
				'They said the last of the letter was red.',
				'…Was he someone you knew, sir?',
				'His brother didn’t come. That’s what they said on the boat.'
			];
			b.lines = [
				'사비의 그 좌평 나리요. 옥에서 그—',
				'마지막은— 마지막은 붉었다더이다.',
				'…나리께서 아시던 분이었지라우?',
				'아우분은 안 왔다더이다. 배에서 그렇게들 말했지라우.'
			];
		}
	}
});

writeFileSync(PATH, JSON.stringify(data, null, '\t') + '\n');
console.log('Sunchung blocks', sunchung.blocks.length);
console.log(
	'Sunchung titles',
	sunchung.blocks.filter((b) => b.title || b.label).map((b) => b.title || b.label)
);
console.log('ok');
