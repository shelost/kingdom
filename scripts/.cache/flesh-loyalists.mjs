#!/usr/bin/env node
/**
 * Flesh Sunchung + Hungsu from Samguk Sagi / Yusa without restaging
 * Descent / King Euija 656 (belt, Kangrim, dying-memorial quote).
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

const sunchung = findEntry('Sunchung');
const hungsu = findEntry('Hungsu');

sunchung.logline = {
	en: 'He asked for one word, and a wine jar sat on it. Four years later the king goes looking.',
	ko: '그는 한 말씀을 청했고, 술 단지가 그 위에 앉았다. 네 해 뒤에야 왕이 찾는다.'
};
sunchung.subtitle = sunchung.subtitle || '성충';

const hook = {
	kind: 'p',
	html: 'He asked for one word, and a wine jar sat on it.',
	ko: '그는 한 말씀을 청했다. 술 단지가 그 위에 앉았다.'
};

const farewell = {
	kind: 'flashback',
	year: '656',
	title: 'The last lamp · the night Hungsu left',
	blocks: [
		{
			kind: 'scene',
			label: 'Sabi colonnade',
			ko: '사비 회랑',
			year: 656,
			jump: { year: 656, en: 'Four Years Earlier…', ko: '사 년 전…' }
		},
		{
			kind: 'p',
			html: 'The posting paper is already in Hungsu’s sleeve. Sunchung walks him as far as the last lamp on the colonnade. Past that lamp the road is just a road.',
			ko: '부임장이 이미 흥수의 소매 안에 있다. 성충은 회랑의 마지막 등잔까지 그를 배웅한다. 그 등잔을 지나면 길은 그냥 길이다.'
		},
		{
			kind: 'dialogue',
			person: 'seongchung',
			lines: [
				'아직은— 아직은 가지 마시오. 형님이 떠나면, 밀물을 말할 사람이 없어지오.'
			],
			en: ['Don’t— don’t go yet. If you leave, there is nobody left who will say the tide.']
		},
		{
			kind: 'dialogue',
			person: 'heungsu',
			lines: ['형은 남으슈. 내가 못 하믄 형이 적으슈.'],
			en: ['You stay. You write it if I can’t.']
		},
		{
			kind: 'dialogue',
			person: 'seongchung',
			lines: ['고개하고… 강어귀요. 저들이 오면—'],
			en: ['The pass. And the river mouth. If they come—']
		},
		{
			kind: 'dialogue',
			person: 'heungsu',
			lines: [
				'침현. 기벌포. 아오. 오늘 아침에도 그렸슈.',
				'형은 문장 끝내고 죽으슈. 굶어 죽기 전에.'
			],
			en: [
				'Chimhyun. Final Ford. I know. I drew them this morning.',
				'Finish the sentence before you starve.'
			]
		},
		{
			kind: 'p',
			html: 'Hungsu smiles when he says the ugly thing, which is how you know he means it. He goes south to a county that isn’t on anyone’s map. Sunchung goes back to a hall that has already stopped listening.',
			ko: '흥수는 험한 말을 할 때 웃는다. 진심일 때의 버릇이다. 그는 아무도 지도에 안 그리는 고을로 내려가고, 성충은 이미 귀를 닫은 전각으로 돌아간다.'
		}
	]
};

const cell = {
	kind: 'flashback',
	year: '656',
	title: 'The cell · third month',
	blocks: [
		{
			kind: 'scene',
			label: 'The cell',
			ko: '옥',
			year: 656,
			jump: { year: 656, en: 'The Same Year…', ko: '그해…' }
		},
		{
			kind: 'p',
			html: 'The feast is on the other side of the wall. Somebody laughs. A cup hits a table, and the sound comes through the plaster as if the plaster were paper.',
			ko: '잔치는 벽 너머다. 누가 웃는다. 잔이 상에 부딪히고, 그 소리가 회벽을 종이처럼 뚫고 온다.'
		},
		{
			kind: 'p',
			html: 'They took his belt at the door. The last sheet they left him is already creased from being folded and unfolded. His hand is slower than it used to be.',
			ko: '허리띠는 문간에서 빼앗겼다. 남겨 둔 종이 한 장은 접었다 폈다 해서 이미 구겨져 있다. 손은 예전보다 느리다.'
		},
		{
			kind: 'p',
			html: 'He names the pass the soldiers call Tanhyun, and the river mouth they call Final Ford. He does not name a troop count. He does not name a year. One word, and then to be allowed to die. That is all he asks.',
			ko: '군졸들이 탄현이라 부르는 고개, 기벌포라 부르는 강어귀를 적는다. 병력 숫자는 안 적는다. 해도 안 적는다. 한 말씀, 그리고 죽게 해 달라는 것. 그게 다다.'
		},
		{
			kind: 'dialogue',
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

const courier = {
	kind: 'dialogue',
	person: 'euija',
	lines: [
		'고마미지. 과인이 보낸 그 사람. 누가 달려라.',
		'지금이다. 사택 병력이 오기 전이 아니라. 지금.'
	],
	en: [
		'Gomamiji. The man I posted. Somebody ride.',
		'Now. Not after the levies. Now.'
	]
};

const chunbokStall = {
	kind: 'dialogue',
	person: 'chunbok',
	lines: ['폐하, 폐하께서도 잘 아시다시피 사택의 병력이—'],
	en: ['Majesty, as Your Majesty well knows, the Satek levies—']
};

if (!sunchung.blocks[0] || !/He asked for one word/.test(sunchung.blocks[0].html || '')) {
	sunchung.blocks.unshift(hook);
}

const afterMarket = idx(
	sunchung.blocks,
	(b) => /Two armies are coming for the capital/.test(b.html || ''),
	'Sunchung market'
);
if (!sunchung.blocks.some((b) => b.title === farewell.title)) {
	sunchung.blocks.splice(afterMarket + 1, 0, farewell);
}

const letterScene = idx(
	sunchung.blocks,
	(b) => b.kind === 'scene' && b.ko === '편지',
	'Sunchung letter scene'
);
if (!sunchung.blocks.some((b) => b.title === cell.title)) {
	sunchung.blocks.splice(letterScene, 0, cell);
}

const hungsuName = idx(
	sunchung.blocks,
	(b) =>
		b.kind === 'dialogue' &&
		Array.isArray(b.en) &&
		b.en.some((l) => /…Hungsu/.test(l)),
	'Sunchung Hungsu name'
);
if (!sunchung.blocks.some((b) => Array.isArray(b.en) && b.en[0] === 'Gomamiji. The man I posted. Somebody ride.')) {
	sunchung.blocks.splice(hungsuName + 1, 0, chunbokStall, courier);
}

const twoPapers = {
	kind: 'p',
	html: 'Euija has two papers in his hands. One is stained from a jar. One is Hungsu’s, still dusty from the road. He holds them side by side, the way a man holds two cups he does not want to drink.',
	ko: '의자의 양손에 종이가 두 장이다. 하나는 단지에 얼룩졌고, 하나는 흥수의 것으로, 아직 길먼지다. 마시고 싶지 않은 잔 두 개를 들듯, 나란히 든다.'
};

const sleeve = {
	kind: 'p',
	html: 'He folds Sunchung’s paper and puts it back in his sleeve. He will still have it when there is no sleeve left.',
	ko: '성충의 종이를 접어 다시 소매에 넣는다. 소매가 없어진 뒤에도 그 종이는 남아 있을 것이다.'
};

const clerkNight = {
	kind: 'scene',
	label: 'Gomamiji yard',
	ko: '고마미지 마당',
	year: 660
};

const clerkTalk = {
	kind: 'dialogue',
	person: 'heungsu',
	lines: ['편지 왔소?'],
	en: ['Any letter.']
};

const clerkAns = {
	kind: 'dialogue',
	person: 'courtmaid',
	lines: ['없습니다, 나으리. 열흘입니다.'],
	en: ['None, sir. Ten days.']
};

const clerkTalk2 = {
	kind: 'dialogue',
	person: 'heungsu',
	lines: ['…한 번은 물었지. 두 번은 안 물어도 되는 법이오.'],
	en: ['…He asked once. A king doesn’t ask twice.']
};

const children = {
	kind: 'p',
	html: 'Children walk the notch he calls Tanhyun, because it is the dry part of the yard. He does not tell them to get off it. Nobody is coming to look at it.',
	ko: '아이들이 그가 탄현이라 부르는 홈을 밟고 다닌다. 마당에서 마른 곳이니까. 내려오라고 하지 않는다. 그걸 보러 올 사람은 없다.'
};

const afterSabi = idx(
	hungsu.blocks,
	(b) => /The answer comes back to Sabi/.test(b.html || ''),
	'Hungsu Sabi return'
);
if (!hungsu.blocks.some((b) => /two papers in his hands/.test(b.html || ''))) {
	hungsu.blocks.splice(afterSabi + 1, 0, twoPapers);
}

const soItIs = idx(
	hungsu.blocks,
	(b) => b.kind === 'dialogue' && Array.isArray(b.en) && b.en[0] === 'So it is.',
	'So it is'
);
if (!hungsu.blocks.some((b) => /puts it back in his sleeve/.test(b.html || ''))) {
	hungsu.blocks.splice(soItIs + 1, 0, sleeve);
}

const eleven = idx(
	hungsu.blocks,
	(b) => /No second courier comes to Gomamiji/.test(b.html || ''),
	'eleven mornings'
);
if (!hungsu.blocks.some((b) => Array.isArray(b.en) && b.en[0] === 'Any letter.')) {
	hungsu.blocks.splice(eleven, 0, clerkNight, clerkTalk, clerkAns, clerkTalk2, children);
}

writeFileSync(PATH, JSON.stringify(data, null, '\t') + '\n');
console.log('Sunchung blocks', sunchung.blocks.length);
console.log('Hungsu blocks', hungsu.blocks.length);
