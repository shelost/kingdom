import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

function text(b) {
	if (!b) return '';
	if (typeof b.html === 'string') return b.html;
	if (b.kind === 'dialogue') return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
	return `${b.html ?? ''} ${b.ko ?? ''}`;
}

function slot(o) {
	return { ratio: 1.778, nsfw: false, ...o };
}

const hwang = findEntry('Yellow Mountain Fields');
const wait = hwang.blocks.find((b) => text(b).includes('Yellow Mountain Fields</b> first'));
if (wait && !text(wait).includes('Yellow lacquer holds the palisade')) {
	wait.html +=
		' <b>Yellow lacquer holds the palisade.</b> When the Sword arrives it is a tall black helm and a blue rim. <b>The tall Silla helm comes in at a gallop.</b> They meet in the dust. <b>Blue plume cuts yellow lacquer.</b>';
	wait.ko +=
		' <b>황칠이 목책을 지킨다.</b> 검이 올 때는 높은 검은 투구와 푸른 테다. <b>신라의 높은 투구가 달려 들어온다.</b> 먼지 속에서 만난다. <b>푸른 깃이 황칠을 가른다.</b>';
}

const gayaFall = findEntry('The Fall of Gaya');
const muryukP = gayaFall.blocks.find((b) => text(b).includes('Kim Muryuk</b>, prince of Golden Gaya'));
if (muryukP && !text(muryukP).includes('The tall Gaya cone still fights')) {
	muryukP.html +=
		' Before the hall, the field. <b>The tall Gaya cone still fights.</b>';
	muryukP.ko += ' 대청 전에 벌판이 있다. <b>가야의 높은 고깔이 아직 싸운다.</b>';
}

const betray = findEntry('Jinheung’s Betrayal');
const ambush = betray.blocks.find((b) => text(b).includes('Silla’s ambush is waiting'));
if (ambush && !text(ambush).includes('Muryuk’s cone cuts the night ridge')) {
	ambush.html += ' <b>Muryuk’s cone cuts the night ridge.</b>';
	ambush.ko += ' <b>무력의 고깔이 밤 능선을 가른다.</b>';
}

const massacre = findEntry('Yeon’s Massacre');
const fiveBlades = massacre.blocks.findIndex((b) => text(b).includes('Five Blades'));
if (fiveBlades >= 0 && !massacre.blocks.some((b) => text(b).includes('Red-wing chalgap fills the door'))) {
	massacre.blocks.splice(fiveBlades + 1, 0, {
		kind: 'p',
		html: 'The doorway is plates and red wings before it is a speech. <b>Red-wing chalgap fills the door.</b>',
		ko: '문이 말보다 먼저 찰갑과 붉은 날개다. <b>붉은 날개 찰갑이 문을 채운다.</b>'
	});
}

const ansi = findEntry('Ansi');
const wallFirst = ansi.blocks.find((b) => text(b).includes('The Second Emperor tries the wall first'));
if (wallFirst && !text(wallFirst).includes('Red wings on the parapet')) {
	wallFirst.html += ' <b>Red wings on the parapet.</b>';
	wallFirst.ko += ' <b>붉은 날개가 여장 위에 있다.</b>';
}

function insertSlots(entry, extras, afterId) {
	const have = new Set((entry.images ?? []).map((im) => im.id));
	const add = extras.filter((s) => !have.has(s.id));
	if (!add.length) return add;
	const after = afterId ? entry.images.findIndex((im) => im.id === afterId) : -1;
	entry.images.splice(after < 0 ? entry.images.length : after + 1, 0, ...add);
	return add;
}

const hwangSlots = [
	slot({
		id: 'gyebek-seq-palisade',
		tone: '#d9b13a',
		at: 'Yellow lacquer holds the palisade',
		alt: 'Worm’s-eye: Gyebek in Baekje yellow hwangchilgap holding the wooden palisade at Hwangsan',
		refs: ['/ch_gyebek.png', '/ar_kingdoms_diagram.jpg', '/pl_yellow_mountain.png'],
		people: ['gyebek']
	}),
	slot({
		id: 'yushin-seq-gallop',
		tone: '#2A5FB8',
		at: 'The tall Silla helm comes in at a gallop',
		alt: 'Dutch low: Yushin in tall black Silla lacquer helm, red plume, Confucian-blue rim, charging Hwangsan dust',
		refs: ['/ch_kim_yushin.png', '/ar_silla_gaya.jpg', '/pl_yellow_mountain.png'],
		people: ['yushin']
	}),
	slot({
		id: 'hwangsan-seq-clash',
		tone: '#d9b13a',
		at: 'Blue plume cuts yellow lacquer',
		alt: 'OTS clash: Silla tall black helm vs Baekje yellow hwangchil at Hwangsan',
		refs: ['/ch_kim_yushin.png', '/ch_gyebek.png', '/ar_kingdoms_diagram.jpg', '/ar_silla_gaya.jpg'],
		people: ['yushin', 'gyebek']
	})
];

const muryukSlots = [
	slot({
		id: 'muryuk-seq-ridge',
		tone: '#8B5CF6',
		at: 'Muryuk’s cone cuts the night ridge',
		alt: 'Dutch night: Muryuk in tall Gaya conical helmet, dark lamellar, purple cloak, Gwansanseong ridge',
		refs: ['/ch_kim_muryuk.png', '/ar_silla_gaya.jpg'],
		people: ['muryuk']
	})
];

const gayaSlots = [
	slot({
		id: 'muryuk-seq-cone-fight',
		tone: '#8B5CF6',
		at: 'The tall Gaya cone still fights',
		alt: 'Worm’s-eye: Muryuk’s unique tall Gaya helmet filling the sky, last fight before surrender',
		refs: ['/ch_kim_muryuk.png', '/ar_silla_gaya.jpg'],
		people: ['muryuk']
	})
];

const ansiSlots = [
	slot({
		id: 'yangmanchun-seq-wings',
		tone: '#C30000',
		at: 'Red wings on the parapet',
		alt: 'Worm’s-eye Ansi wall: Yang Manchun in Goguryeo red-wing chalgap, yellow lamellar bands',
		refs: ['/ch_guardian.png', '/ar_silla_goguryeo.jpg', '/ar_kingdoms_diagram.jpg', '/pl_ansi.png'],
		people: ['yangmanchun']
	})
];

const gesomunSlots = [
	slot({
		id: 'gesomun-seq-wings',
		tone: '#d0362f',
		at: 'Red-wing chalgap fills the door',
		alt: 'Dutch / worm’s-eye: Gesomun in Goguryeo red-wing armor, five pommels, filling a fortress door',
		refs: ['/ch_yeon_gesomun.png', '/ar_silla_goguryeo.jpg', '/ar_kingdoms_diagram.jpg', '/pl_pyongyang_fortress.png'],
		people: ['gesomun']
	})
];

console.log('hwang', insertSlots(hwang, hwangSlots, 'hwangsan-wide').map((s) => s.id).join(','));
console.log('betray', insertSlots(betray, muryukSlots, 'north-star-poster').map((s) => s.id).join(','));
console.log('gaya', insertSlots(gayaFall, gayaSlots, 'gaya-surrender').map((s) => s.id).join(','));
console.log('ansi', insertSlots(ansi, ansiSlots, 'ansi-wide').map((s) => s.id).join(','));
console.log('gesomun', insertSlots(massacre, gesomunSlots, 'gesomun-title').map((s) => s.id).join(','));

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
