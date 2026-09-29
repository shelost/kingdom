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

function blockText(b) {
	if (!b) return '';
	if (typeof b.html === 'string') return b.html;
	if (b.kind === 'dialogue') return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
	return '';
}

function insertAfter(entry, needle, blocks) {
	const mark = blocks.find((b) => b.html);
	if (mark?.html && entry.blocks.some((x) => x.html === mark.html)) return;
	const i = entry.blocks.findIndex((b) => blockText(b).includes(needle));
	if (i < 0) throw new Error(`${entry.title}: missing needle «${needle}»`);
	entry.blocks.splice(i + 1, 0, ...blocks);
}

function upsertImage(entry, slot, afterId) {
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) {
		Object.assign(entry.images[i], slot);
		return;
	}
	const after = afterId ? entry.images.findIndex((im) => im.id === afterId) : -1;
	if (after >= 0) entry.images.splice(after + 1, 0, slot);
	else entry.images.push(slot);
}

const daeya = findEntry('Daeya Fortress');

insertAfter(daeya, 'a smirk he is not meant to see', [
	{
		kind: 'p',
		nsfw: true,
		html: 'She does not start with her hands. She starts with a plum from the feast tray, as if she were still at the table. <b>She puts it in her mouth the way she wants him to watch.</b> Juice on the lower lip. Thirty-one, and she has never once rushed a man who was already lost.',
		ko: '손은 나중에다. 잔치 쟁반의 자두부터다. 아직 상에 있는 척. <b>그가 보게 하려고 입에 넣는다.</b> 아랫입술에 즙. 서른하나. 이미 끝난 사내를 재촉한 적은 없다.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'The silk slips because she lets it. <b>She does not look away from the fruit.</b> He makes that sound again — the one that is not a word.',
		ko: '비단은 그녀가 풀어서 흘러내린다. <b>과일에선 눈을 떼지 않는다.</b> 그가 또 그 소리를 낸다 — 단어가 아닌 그 소리.'
	}
]);

const slots = [
	{
		id: 'nsfw-yehwa-fruit-lips',
		ratio: 0.5625,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'She puts it in her mouth the way she wants him to watch',
		alt: 'Maehwa close — dark plum at her tongue, juice, green jeogori open, lamp on the chest',
		refs: ['/ch_gumil_wife.png', '/bn_gumil_wife.png'],
		people: ['gumilwife'],
		prompt:
			'Intimate cinematic 9:16 close. Adult Maehwa sucking a dark plum. Face and garments match attached portrait; wood-sprig binyeo. Teal-sage #8AAFA0 rim. Dramatic lamp. No text. No watermark.'
	},
	{
		id: 'nsfw-yehwa-fruit-lounge',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'already lost',
		alt: 'Maehwa lounging on dark timber — persimmon at her mouth, jeogori open, ochre chima hiked',
		refs: ['/ch_gumil_wife.png', '/bn_gumil_wife.png'],
		people: ['gumilwife'],
		prompt:
			'Intimate cinematic 16:9. Adult Maehwa lounging, persimmon. Face and garments match attached portrait; wood-sprig binyeo. Dramatic lamp. No text. No watermark.'
	},
	{
		id: 'nsfw-yehwa-fruit-lookback',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'She does not look away from the fruit',
		alt: 'Split: Maehwa’s back and hip in green silk; close, a plum at her mouth',
		refs: ['/ch_gumil_wife.png', '/bn_gumil_wife.png'],
		people: ['gumilwife'],
		prompt:
			'Intimate cinematic 16:9. Adult Maehwa look-back and plum. Face and garments match attached portrait; wood-sprig binyeo. Dramatic lamp. No text. No watermark.'
	},
	{
		id: 'nsfw-yehwa-fruit-low',
		ratio: 0.5625,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'He makes that sound again',
		alt: 'Worm’s-eye: Maehwa towers, plum in her mouth, one lamp over her bun',
		refs: ['/ch_gumil_wife.png', '/bn_gumil_wife.png'],
		people: ['gumilwife'],
		prompt:
			'Intimate cinematic 9:16 worm’s-eye. Adult Maehwa, plum in mouth. Face and garments match attached portrait; wood-sprig binyeo. Dramatic lamp. No text. No watermark.'
	},
	{
		id: 'nsfw-yehwa-sash-hip',
		ratio: 0.75,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'the hip the yard has been staring',
		alt: 'Maehwa on one hip — red sash as a bar, ochre chima tight, fruit at her teeth',
		refs: ['/ch_gumil_wife.png', '/bn_gumil_wife.png'],
		people: ['gumilwife'],
		prompt:
			'Intimate cinematic 3:4. Adult Maehwa hip and red sash, fruit at teeth. Face and garments match attached portrait; wood-sprig binyeo. Dramatic lamp. No text. No watermark.'
	},
	{
		id: 'nsfw-yehwa-lamp-split',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'One lamp, and',
		alt: 'Maehwa split by the lamp-seam — gold on the left, charcoal on the right, plum at her mouth',
		refs: ['/ch_gumil_wife.png', '/bn_gumil_wife.png'],
		people: ['gumilwife'],
		prompt:
			'Intimate cinematic 16:9. Adult Maehwa, lamp-seam split, plum. Face and garments match attached portrait; wood-sprig binyeo. No text. No watermark.'
	}
];

let after = 'nsfw-yehwa-shadow-body';
for (const slot of slots) {
	upsertImage(daeya, slot, after);
	after = slot.id;
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched yehwa fruit stills');
