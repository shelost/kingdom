/**
 * One-shot: Ungo's shaman channel during the Descent.
 *  - Corridor: the queen's calendar comes from the shaman's hut (access echo)
 *  - Queen's Rooms: memorials wait on the shaman's gate-days; Euija laughs
 *  - New final scene before the Nihon Shoki quote: after the first signs,
 *    Euija caves and visits the shaman at night ("amusement" cover, kept
 *    into Nine Omens). She tells him to send for Gyebek. He never does.
 * Guarded by marker strings.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const F = path.join(ROOT, 'src/lib/data/story.json');
const s = JSON.parse(fs.readFileSync(F, 'utf8'));

const P = (html, ko) => ({ kind: 'p', html, ko });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
const D = (person, chip, en, ko) => ({ kind: 'dialogue', chip, person, en, lines: ko });

const entry = (ch, title) => {
	const e = s.find((c) => c.id === ch).entries.find((e) => e.title === title);
	if (!e) throw new Error(`missing ${ch}/${title}`);
	return e;
};
const has = (e, marker) => JSON.stringify(e.blocks).includes(marker);
const idx = (e, t) => {
	const i = e.blocks.findIndex((b) => JSON.stringify(b).includes(t));
	if (i < 0) throw new Error(`anchor missing: ${t}`);
	return i;
};

const e = entry('fall-of-euija', 'Descent');

/* 1. Corridor: whose calendar the court keeps */
if (!has(e, 'Bow toward whoever decides')) {
	const at = idx(e, 'The queen hears it last, and laughs');
	e.blocks.splice(at + 1, 0,
		{
			kind: 'dialogue', chip: '#8a8a94',
			en: ['My aunt says the queen’s calendar comes from the shaman’s hut. Which basket moves, which waits — the mudang marks the days.'],
			lines: ['우리 이모가 그러는디, 왕후마마의 달력은 무당집에서 온댜. 어느 광주리가 가고 어느 게 기다리는지 — 무당이 날을 찍어 준댜.'],
			speaker: 'A Clerk', gender: 'm'
		},
		{
			kind: 'dialogue', chip: '#8a8a94',
			en: ['So the shaman rules now? Shall we bow toward the hut?'],
			lines: ['그럼 이제 무당이 다스리냐? 오두막 쪽으로 절할까?'],
			speaker: 'Another Clerk', gender: 'm'
		},
		{
			kind: 'dialogue', chip: '#8a8a94',
			en: ['Bow toward whoever decides who kneels, and when.'],
			lines: ['누가 언제 꿇는지를 정하는 쪽으로 절해라.'],
			speaker: 'A Clerk', gender: 'm'
		},
		P(
			'Nobody laughs at that one.',
			'그 말엔 아무도 안 웃는다.'
		)
	);
	console.log('descent: shaman calendar gossip');
} else console.log('descent: gossip already present');

/* 2. Queen's Rooms: the nine-day memorial */
if (!has(e, 'The basket stays where she put it')) {
	const at = idx(e, 'right-hand basket');
	e.blocks.splice(at + 1, 0,
		P(
			'Nine days one memorial has waited in the left basket. It asks for grain for the eastern forts.',
			'아흐레째 한 상소가 왼쪽 광주리에서 기다리고 있다. 동부 성들에 군량을 달라는 것이다.'
		),
		D('hyo', '#c9a86a',
			['That one has waited nine days.'],
			['그 상소는 아흐레째 기다리고 있어요.']
		),
		D('ungo', '#c9a0a8',
			['The gate day is bad. She says wait.'],
			['문 여는 날이 나쁘다. 그분이 기다리래.']
		),
		D('hyo', '#c9a86a',
			['Mother. Father says she is theatre.'],
			['어머님. 아버님은 그분이 구경거리라 하시는데.']
		),
		D('ungo', '#c9a0a8',
			['Your father says a great many things from inside a wine jar. The basket stays where she put it.'],
			['네 아버님은 술독 안에서 큰 말씀을 많이 하시지. 광주리는 그분이 둔 자리에 둔다.']
		),
		P(
			'He hears about the baskets, and laughs the way he laughs at his own jokes — first, and loudest. Theatre with a calendar. A mudang with a filing system. It does not occur to him to ask whose days the court is keeping, until the court starts keeping them without asking him.',
			'그는 광주리 얘기를 듣고 제가 짠 농담을 들을 때처럼 웃는다 — 먼저, 그리고 제일 크게. 달력 딸린 구경거리. 정리벽 있는 무당. 조정이 누구의 날을 지키는지 물을 생각은 못 한다. 조정이 그에게 묻지 않고 지키기 시작할 때까지는.'
		)
	);
	console.log('descent: nine-day memorial');
} else console.log('descent: memorial already present');

/* 3. The Night Visit, before the hostile foreign quote */
if (!has(e, 'The Night Visit')) {
	const at = idx(e, 'Some say Baekje destroyed itself');
	e.blocks.splice(at, 0,
		SCENE('The Night Visit', '밤 방문'),
		P(
			'The foxes came that week — into the hall, onto the Premier’s desk. Ungo says tonight. Not tomorrow. The shaman keeps your hour, she says, the way she says Done. And for the first time in years Euija goes somewhere with no wine in him and no audience around him.',
			'여우가 그주에 왔다 — 전각 안으로, 상좌평 책상 위로. 은고가 오늘 밤이란다. 내일이 아니다. 그분이 폐하의 시간을 비워 두었단다, 됐다고 말하듯 말한다. 그리고 의자는 여러 해 만에 처음으로 술기운 없이, 구경꾼 없이 어딘가를 간다.'
		),
		D('euija', '#e08a2e',
			['…You.', '…No audience. Don’t make one.'],
			['…너.', '…구경꾼은 없다. 만들지도 마라.']
		),
		{
			kind: 'dialogue', chip: '#9f1239', person: 'shaman',
			en: ['<span style="color:#dc2626">Sit. She said you would come after the foxes. The lamp has been waiting longer than you have.</span>'],
			lines: ['<span style="color:#dc2626">앉으십시오. 여우 뒤에 오시리라 그분이 말씀하셨습니다. 등잔이 폐하보다 오래 기다렸습니다.</span>']
		},
		D('euija', '#e08a2e',
			['…I count. Nine hundred and seventy-two. Then I lose the place.', '…Tell me what the number is.'],
			['…나는 셈을 한다. 아홉백일흔둘. 그러고는 자리를 잃는다.', '…그 수가 뭔지 말해라.']
		),
		{
			kind: 'dialogue', chip: '#9f1239', person: 'shaman',
			en: ['<span style="color:#dc2626">The number is a door you will not open. Send for the general whose name you will not say.</span>'],
			lines: ['<span style="color:#dc2626">그 수는 폐하께서 열지 않으실 문입니다. 이름 부르지 않으시는 장군을 불러들이십시오.</span>']
		},
		D('euija', '#e08a2e',
			['…Amusement.', 'This was amusement.'],
			['…구경이었다.', '구경하러 온 거다.']
		),
		P(
			'He never sends for him. Chunbok will have to ask, months later, in front of witnesses, the way a careful man pays a small tax. The queen’s lamp is still burning when Euija gets back to his rooms. It was her hour. It was always her hour.',
			'그는 끝내 부르지 않는다. 춘복이 달들 뒤에 증인들 앞에서 묻게 될 것이다, 조심스러운 사내가 적은 세금을 내듯. 의자가 처소에 돌아오니 왕후의 등잔이 아직 타고 있다. 그녀의 시간이었다. 언제나 그녀의 시간이었다.'
		)
	);
	console.log('descent: The Night Visit');
} else console.log('descent: visit already present');

fs.writeFileSync(F, JSON.stringify(s, null, '\t') + '\n');
console.log('story.json written');
