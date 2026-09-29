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

const descent = findEntry('Euija’s Descent');
const e = '/ch_buyeo_euija.png';
const m1 = '/ch_maid_1.png';
const m2 = '/ch_maid_2.png';
const m3 = '/ch_maid_3.png';

const slots = [
	{
		id: 'nsfw-euija-harem-crowd',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'a harem so packed',
		alt: 'Packed Sabi chamber: a dozen maids crowd the couch around Euija',
		refs: [e, m1, m2, m3]
	},
	{
		id: 'nsfw-euija-harem-kneel',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'They kneel in ranks',
		alt: 'Euija among a kneeling harem — many mint hems, gold headband',
		refs: [e, m1, m2, m3]
	},
	{
		id: 'nsfw-euija-lap-two',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'two at a time',
		alt: 'Two maids on Euija — one across his lap, one at his chest, robe open',
		refs: [e, m1, m3]
	},
	{
		id: 'nsfw-euija-maids-undress',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'They loosen the silk',
		alt: 'Maids loosening jeogori and chima in lamp-light while Euija watches',
		refs: [e, m1, m2]
	},
	{
		id: 'nsfw-euija-tent-pants',
		ratio: 0.75,
		tone: '#e08a2e',
		nsfw: true,
		at: 'the dark trousers tell it first',
		alt: 'Euija standing, robe open, flushed — visibly aroused in dark court trousers',
		refs: [e]
	}
];

const after = descent.images.findIndex((im) => im.id === 'nsfw-euija-orgy-lamp');
for (const slot of slots) {
	const i = descent.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) Object.assign(descent.images[i], slot);
	else descent.images.splice(after >= 0 ? after + 1 : descent.images.length, 0, slot);
}

Object.assign(
	descent.images.find((im) => im.id === 'nsfw-euija-orgy-lamp'),
	{
		alt: 'Packed lamp-feast: Euija reclined, many maids piled close around him',
		at: 'The feast is no longer a feast'
	}
);

if (!descent.blocks.some((b) => b.html?.includes('a harem so packed'))) {
	const i = descent.blocks.findIndex((b) => b.html?.includes('The feast is no longer a feast'));
	if (i < 0) throw new Error('missing feast paragraph');
	descent.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'The stories say three thousand. The room is not that. It is still too many — a harem so packed the lamp never finds a wall. They kneel in ranks. They loosen the silk. They climb into his lap two at a time. He does not hide what the wine has done; the dark trousers tell it first.',
		ko: '전설은 삼천이라 한다. 이 방은 그게 아니다. 그래도 너무 많다 — 등이 벽을 찾지 못할 만큼 들어찬 후궁. 열 지어 무릎을 꿇는다. 비단을 푼다. 둘씩 무릎에 오른다. 술이 자기에게 한 일을 숨기지 않는다. 검은 바지가 먼저 말한다.'
	});
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched harem slots');
