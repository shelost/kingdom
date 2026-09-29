import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));

function chapter(id) {
	const ch = story.find((c) => c.id === id);
	if (!ch) throw new Error(`missing chapter ${id}`);
	return ch;
}

function entry(ch, title) {
	const en = ch.entries.find((e) => e.title === title);
	if (!en) throw new Error(`missing entry ${ch.id} / ${title}`);
	return en;
}

function scene(label, ko) {
	return { kind: 'scene', label, ko };
}

function insertAt(blocks, i, block) {
	blocks.splice(i, 0, block);
}

function findHtml(blocks, needle) {
	return blocks.findIndex((b) => typeof b.html === 'string' && b.html.includes(needle));
}

function findLabel(blocks, kind, label) {
	return blocks.findIndex((b) => b.kind === kind && b.label === label);
}

function prependIfAbsent(blocks, label, ko) {
	if (blocks.some((b) => (b.kind === 'scene' || b.kind === 'day') && b.label === label)) return;
	blocks.unshift(scene(label, ko));
}

function insertBeforeHtml(blocks, needle, label, ko) {
	if (blocks.some((b) => (b.kind === 'scene' || b.kind === 'day') && b.label === label)) return;
	const i = findHtml(blocks, needle);
	if (i < 0) throw new Error(`needle not found: ${needle}`);
	insertAt(blocks, i, scene(label, ko));
}

// ——— Chunchu era ———
const chunchu = chapter('chunchu-era');
const hwarang = entry(chunchu, 'The Flower Youth');
hwarang.title = 'The Hwarang';
hwarang.subtitle = '화랑';
prependIfAbsent(hwarang.blocks, 'Flowering Youth', '화랑의 꽃');
insertBeforeHtml(
	hwarang.blocks,
	'Through the remaining years of Queen Sunduk',
	'The Next King',
	'다음 임금'
);

const emperor = entry(chunchu, 'Silla-Tang Alliance');
emperor.title = 'The Emperor';
emperor.subtitle = '황제';
prependIfAbsent(emperor.blocks, 'Shimin & Chunchu', '세민과 춘추');

const second = entry(chunchu, 'Death of the Second Emperor');
prependIfAbsent(second.blocks, 'Zhi & Chunchu', '치와 춘추');
const gunhae = findLabel(second.blocks, 'day', 'ON GUNHAE');
if (gunhae >= 0) {
	second.blocks[gunhae] = scene('On Gunhae', '온군해');
}

// ——— Fall of Baekje: White River moves here ———
const fall = chapter('fall-of-baekje');
const final = chapter('final-stand');
const whiteIdx = final.entries.findIndex((e) => e.title === 'White River');
if (whiteIdx < 0) throw new Error('White River missing');
const [whiteRiver] = final.entries.splice(whiteIdx, 1);
const restIdx = fall.entries.findIndex((e) => e.title === 'Baekje Restoration Society');
if (restIdx < 0) throw new Error('Restoration missing');
fall.entries.splice(restIdx + 1, 0, whiteRiver);

// ——— Final Stand ———
const pyong = entry(final, 'Pyongyang Fortress');
pyong.title = 'Pyongyang';
pyong.subtitle = '평양';

const snake = entry(final, 'Snake River');
const sonDays = new Set([
	'THIRTEEN · TWELVE',
	'ELEVEN',
	'TEN · NINE',
	'EIGHT',
	'SEVEN',
	'SIX · FIVE · FOUR',
	'THREE',
	'TWO',
	'ONE'
]);
snake.blocks = snake.blocks.filter((b) => !(b.kind === 'day' && sonDays.has(b.label)));
const tiger = findLabel(snake.blocks, 'day', 'THE TIGER');
if (tiger < 0) throw new Error('THE TIGER missing');
snake.blocks[tiger] = scene('The White Tiger', '백호');
const quoteIdx = snake.blocks.findIndex(
	(b) => b.kind === 'quote' && typeof b.html === 'string' && b.html.includes('thirteen sons')
);
if (quoteIdx < 0) throw new Error('thirteen sons quote missing');
if (!snake.blocks.some((b) => b.kind === 'scene' && b.label === 'Thirteen Sons')) {
	insertAt(snake.blocks, quoteIdx + 1, scene('Thirteen Sons', '열세 아들'));
}
insertBeforeHtml(
	snake.blocks,
	'In the worst hour of the fighting',
	'Yumla Defied',
	'염라를 거역하다'
);

const gesomun = entry(final, 'The Death of Yeon Gesomun');
prependIfAbsent(gesomun.blocks, 'King Yumla', '염라대왕');

const coup = entry(final, 'The Brothers’ Coup');
insertBeforeHtml(coup.blocks, 'Namseng rides west', 'Defection of Yeon Namseng', '연남생의 투항');

const last = entry(final, 'The Final Stand');
last.title = 'Pyongyang, A';
last.subtitle = '평양성 함락';
const lastBlocks = last.blocks;
const namgunStart = findHtml(lastBlocks, 'Supreme Commander <b>Yeon Namgun</b>');
const dragons = findHtml(lastBlocks, 'The <b>Blue Dragon</b>');
const shinsung = findHtml(lastBlocks, 'The monk aristocracy Yeon tried to starve');
if (namgunStart !== 0 || dragons < 0 || shinsung < 0) {
	throw new Error(`668 split unexpected: ${namgunStart} ${dragons} ${shinsung}`);
}
const lastStand = lastBlocks.slice(namgunStart, dragons);
const ninthBody = lastBlocks.slice(dragons, shinsung);
const afterBetrayal = lastBlocks.slice(shinsung);
last.blocks = [
	scene('The Ninth Invasion', '제9차 침공'),
	...ninthBody,
	scene('Betrayal from Inside', '안에서 열린 문'),
	...afterBetrayal.slice(0, 2),
	scene('Last Words', '유언'),
	...lastStand,
	...afterBetrayal.slice(2)
];

// ——— Silla–Tang war ———
const war = chapter('silla-tang-war');
const prot = entry(war, 'Goguryeo Revival Society');
prot.title = 'The Protectorate';
prot.subtitle = '안동도호부';

const maeso = entry(war, 'Maeso Fortress');
prependIfAbsent(maeso.blocks, 'Maeso Fortress', '매소성');

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('ok', {
	chunchu: chunchu.entries.map((e) => e.title),
	fall: fall.entries.map((e) => e.title),
	final: final.entries.map((e) => e.title),
	war: war.entries.map((e) => e.title)
});
