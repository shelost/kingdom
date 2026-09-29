import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function entries() {
	const out = [];
	for (const ch of story) for (const en of ch.entries ?? []) out.push(en);
	return out;
}

function findEntry(title) {
	const en = entries().find((e) => e.title === title);
	if (!en) throw new Error(`missing entry ${title}`);
	return en;
}

function upsertAfter(images, afterId, slots) {
	for (const slot of slots) {
		const i = images.findIndex((im) => im.id === slot.id);
		if (i >= 0) Object.assign(images[i], slot);
		else {
			const at = images.findIndex((im) => im.id === afterId);
			images.splice(at >= 0 ? at + 1 : images.length, 0, slot);
		}
	}
}

const e = '/ch_buyeo_euija.png';
const m1 = '/ch_maid_1.png';
const m2 = '/ch_maid_2.png';
const m3 = '/ch_maid_3.png';

const early = findEntry('King Euija, the 31st Eraha');
upsertAfter(early.images, 'euija-poster', [
	{
		id: 'euija-maid-hip',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'Two court maids attend him',
		alt: 'Euija’s hand on a maid’s thick hip — mint chima stretched over a heavy ass, thigh meat at the hem',
		refs: [e, m1]
	},
	{
		id: 'euija-maid-grab',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'between our knees',
		alt: 'Euija grabs a handful of thick ass over mint silk as she pours — hem up on a heavy thigh',
		refs: [e, m2]
	},
	{
		id: 'euija-maid-hem-pour',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'He counts the hem',
		alt: 'Low crop: thick calf and thigh as the mint hem rides up while she pours',
		refs: [m1, e]
	}
]);

if (!early.blocks.some((b) => b.html?.includes('He counts the hem'))) {
	const i = early.blocks.findIndex((b) => b.html?.includes('Two court maids attend him'));
	if (i < 0) throw new Error('missing Two court maids paragraph');
	early.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'He counts the hem the way other kings count tribute — mint silk, the weight of a hip, how far the slit travels when she pours.',
		ko: '그는 다른 왕이 공물을 세듯 단을 센다 — 민트 비단, 엉덩이 무게, 따를 때 슬릿이 어디까지 열리는지.'
	});
}

const descent = findEntry('Euija’s Descent');
upsertAfter(descent.images, 'euija-court-maids', [
	{
		id: 'euija-maid-stair-hem',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'The hems keep time',
		alt: 'Looking up a stair: thick thighs and a heavy ass under a hiked mint chima',
		refs: [m3, e]
	},
	{
		id: 'euija-maid-thigh-close',
		ratio: 0.75,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'the hips answer first',
		alt: 'Close: thick thighs and a heavy ass — mint hem pulled aside, still dressed',
		refs: [m3, e]
	},
	{
		id: 'euija-maid-ass-hand',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'who is bold enough to speak',
		alt: 'Euija grinning, gold headband, hand buried in a thick ass over taut mint silk',
		refs: [e, m1]
	}
]);

if (!descent.blocks.some((b) => b.html?.includes('The hems keep time'))) {
	const i = descent.blocks.findIndex((b) => b.html?.includes('Hundreds, by now'));
	if (i < 0) throw new Error('missing Hundreds paragraph');
	descent.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'The hems keep time. Long court silk opens when they climb a stair, when they pour, when they pretend not to notice his hand.',
		ko: '단이 박자를 맞춘다. 긴 궁중 비단은 계단을 오를 때, 따를 때, 그의 손을 못 본 척할 때 열린다.'
	});
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched Euija maid thick-thigh slots');
