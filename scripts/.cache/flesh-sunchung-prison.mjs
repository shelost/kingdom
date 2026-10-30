#!/usr/bin/env node
/** Visceral prison arc + Ungo in the shrinking circle. */
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
	if (!hit) throw new Error(`missing ${title}`);
	return hit;
}
function idx(blocks, pred, label) {
	const i = blocks.findIndex(pred);
	if (i < 0) throw new Error(`not found: ${label}`);
	return i;
}

const CHIP_SUN = '#9fb4c9';
const CHIP_WATCH = '#8a8680';
const CHIP_UNGO = '#c9a0a8';
const CHIP_EUI = '#e08a2e';

const cellBlocks = [
	{ kind: 'scene', label: 'The cell', ko: '옥', year: 656 },
	{
		kind: 'p',
		html: 'They take the vermilion at the door. What they leave him is undyed white. Common hemp. It was never cut for a councillor.',
		ko: '문간에서 주홍색을 벗긴다. 남겨 주는 건 물들이지 않은 흰색이다. 평민의 삼베. 좌평을 위해 자른 옷이 아니다.'
	},
	{
		kind: 'p',
		html: 'A week. He can still sit. He asks for rice. Nobody answers.',
		ko: '일주일. 아직 앉을 수 있다. 쌀을 청한다. 대답하는 사람은 없다.'
	},
	{
		kind: 'p',
		html: 'The feast is on the other side of the wall. Somebody laughs. A cup hits a table, and the sound comes through the plaster as if the plaster were paper.',
		ko: '잔치는 벽 너머다. 누가 웃는다. 잔이 상에 부딪히고, 그 소리가 회벽을 종이처럼 뚫고 온다.'
	},
	{
		kind: 'p',
		html: 'Two weeks. The hemp shows the ribs when the lamp hits. He coughs into the sleeve and the sleeve comes away pink.',
		ko: '이주. 등잔 빛에 삼베 아래로 갈비가 보인다. 소매에 기침을 하고, 소매가 분홍으로 젖는다.'
	},
	{
		kind: 'p',
		html: 'He stops asking for rice. Asking is a conversation, and nobody is having one.',
		ko: '쌀을 청하는 일을 그만둔다. 청하는 것은 대화고, 대화를 하는 사람은 없다.'
	},
	{
		kind: 'p',
		html: 'Fever. Sweat on the white. He still sits up when the watch comes.',
		ko: '열이 난다. 흰 옷이 땀에 젖는다. 옥졸이 오면 그래도 일어앉는다.'
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
		html: 'The watch puts his back to the door. Sunchung writes. The hand shakes. He names the pass the soldiers call Tanhyun. He starts the river mouth they call Final Ford. The characters lean.',
		ko: '옥졸은 문에 등을 댄다. 성충이 적는다. 손이 떤다. 군졸들이 탄현이라 부르는 고개를 적는다. 기벌포라 부르는 강어귀를 적기 시작한다. 획이 기운다.'
	},
	{ kind: 'p', html: 'The ink dies mid-character.', ko: '획 중간에 먹이 끊긴다.' },
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
		html: 'The lamp swims. He looks at his left hand anyway.',
		ko: '등잔이 흔들린다. 그래도 왼손을 본다.'
	},
	{
		kind: 'p',
		html: 'He splits the skin at the base of the thumb. The last two names go down red. He is still speaking to a king who is not in the room.',
		ko: '엄지 밑을 짼다. 마지막 두 이름이 붉게 내려간다. 방에 없는 임금에게 아직도 말하고 있다.'
	},
	{
		kind: 'dialogue',
		chip: CHIP_SUN,
		person: 'seongchung',
		lines: ['…가져가시오. 전각에. 단지 밑이든, 어디든—'],
		en: ['…Take it. To the hall. Under a jar, anywhere—']
	},
	{
		kind: 'dialogue',
		chip: CHIP_WATCH,
		speaker: 'The night watch',
		gender: 'm',
		lines: ['나으리. 편지는 넣겠소. 밥은—'],
		en: ['Sir. The letter I’ll put in. Rice I—']
	},
	{
		kind: 'dialogue',
		chip: CHIP_SUN,
		person: 'seongchung',
		lines: ['편지면 됩니다. 폐하께.'],
		en: ['The letter is enough. For His Majesty.']
	},
	{
		kind: 'p',
		html: 'A guard takes the paper. The footsteps stop in the hall. Then they come back empty. Somebody sets something heavy down on the other side of the wall, and nobody comes to read it aloud.',
		ko: '파수가 종이를 가져간다. 발소리가 전각에서 멈춘다. 빈손으로 돌아온다. 벽 너머에서 누가 무거운 것을 내려놓고, 읽어 주는 사람은 없다.'
	},
	{
		kind: 'p',
		html: 'He lies down in the white. The cough does not come back. Morning. The watch does not open the door. He does not take the name back.',
		ko: '흰 옷 입고 눕는다. 기침이 다시 오지 않는다. 아침. 옥졸은 문을 열지 않는다. 그 이름은 거두지 않는다.'
	}
];

const sunchung = findEntry('Sunchung');
const fb = sunchung.blocks.find((b) => b.title === 'The third month · wine night');
if (!fb) throw new Error('wine night flashback missing');
const cellI = idx(fb.blocks, (b) => b.kind === 'scene' && (b.label === 'The cell' || b.ko === '옥'), 'cell scene');
fb.blocks.splice(cellI, fb.blocks.length - cellI, ...cellBlocks);

if (!fb.blocks.some((b) => b.kind === 'card' && b.person === 'seongchung')) {
	fb.blocks.splice(1, 0, {
		kind: 'card',
		person: 'seongchung',
		caption: 'The minister who asked for one word, and wrote it in the cell when the hall would not hear it.',
		ko: '한 말씀을 청한 좌평. 전각이 듣지 않자 옥에서 적어 보냈다.'
	});
}

const takeI = idx(
	fb.blocks,
	(b) => /They take him at the door/.test(b.html || ''),
	'take at door'
);
if (!fb.blocks.some((b) => /The queen does not stand/.test(b.html || ''))) {
	fb.blocks.splice(takeI, 0, {
		kind: 'p',
		html: 'He looks at the far table. The queen does not stand. The circle has already dropped him.',
		ko: '먼 상을 본다. 왕후는 일어나지 않는다. 그 자리는 이미 그를 뺀 자리다.'
	}, {
		kind: 'dialogue',
		chip: CHIP_UNGO,
		person: 'ungo',
		lines: ['문.'],
		en: ['The door.']
	});
}

const hallP = idx(
	sunchung.blocks,
	(b) => /Euija holds court for the first time in three years/.test(b.html || ''),
	'660 hall'
);
if (!sunchung.blocks.some((b) => /The circle has gotten that small/.test(b.html || ''))) {
	sunchung.blocks.splice(hallP + 1, 0, {
		kind: 'p',
		html: 'The queen is the only person he looks at before he starts. The circle has gotten that small.',
		ko: '시작하기 전에 그가 보는 사람은 왕후뿐이다. 그 자리가 그렇게 작아졌다.'
	}, {
		kind: 'dialogue',
		chip: CHIP_UNGO,
		person: 'ungo',
		lines: ['배. 오늘.'],
		en: ['The boat. Today.']
	});
}

const coup = findEntry('Coup');
const lookI = idx(coup.blocks, (b) => /Look at the room while it still looks like this/.test(b.html || ''), 'look at the room');
if (!coup.blocks.some((b) => /The queen is not on a bench/.test(b.html || ''))) {
	coup.blocks.splice(lookI + 1, 0, {
		kind: 'p',
		html: 'The queen is not on a bench. She is behind the screen at the king’s left, which is not a bench, and that is the point. He looks at the screen once. Then he smiles at the eight houses.',
		ko: '왕후는 자리에 없다. 임금 왼쪽 병풍 뒤다. 자리는 아니고, 그게 요지다. 병풍을 한 번 본다. 그리고 여덟 집을 향해 웃는다.'
	});
}

const omens = findEntry('Nine Omens');
const bladeI = idx(omens.blocks, (b) => /The blade is out before the last word cools/.test(b.html || ''), 'shaman cut');
if (!omens.blocks.some((b) => b.person === 'ungo' && /거북이면/.test((b.lines || []).join('')))) {
	omens.blocks.splice(bladeI + 1, 0, {
		kind: 'p',
		html: 'The queen is in the doorway. She does not come in.',
		ko: '왕후는 문간에 있다. 들어오지는 않는다.'
	}, {
		kind: 'dialogue',
		chip: CHIP_UNGO,
		person: 'ungo',
		lines: ['거북이면 됐소.'],
		en: ['The turtle was enough.']
	}, {
		kind: 'dialogue',
		chip: CHIP_EUI,
		person: 'euija',
		lines: ['당신이 가져왔지.'],
		en: ['You brought it.']
	}, {
		kind: 'dialogue',
		chip: CHIP_UNGO,
		person: 'ungo',
		lines: ['점 볼 사람을 고르라 하셨소. 골랐소.'],
		en: ['You asked who should read it. I picked her.']
	});
}

const thinSlot = (sunchung.images || []).find((im) => im.id === 'sunchung-thin');
if (thinSlot) {
	thinSlot.at = 'The hemp shows the ribs';
	thinSlot.alt =
		'Webtoon close in the cell: gaunt Sunchung in undyed white hemp, ribs showing in the lamp, fever sweat, no court robe';
}
let deathSlot = (sunchung.images || []).find((im) => im.id === 'sunchung-death');
if (!deathSlot) {
	sunchung.images.push({
		id: 'sunchung-death',
		ratio: 2,
		at: 'He lies down in the white.',
		alt: 'The cell after the letter leaves: Sunchung lying in undyed white hemp, still, the lamp burning down',
		people: ['seongchung']
	});
}

writeFileSync(PATH, JSON.stringify(data, null, '\t') + '\n');
console.log('ok', 'sunchung blocks', sunchung.blocks.length);
