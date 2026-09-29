import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const STORY = 'src/lib/data/story.json';
const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const TEMP = 'static/temp';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function entries() {
	const out = [];
	for (const ch of story) for (const en of ch.entries ?? []) out.push(en);
	return out;
}

function findEntry(title) {
	const en = entries().find((e) => e.title === title);
	if (!en) throw new Error(`missing ${title}`);
	return en;
}

function byId(entry, id) {
	const im = entry.images.find((x) => x.id === id);
	if (!im) throw new Error(`missing slot ${id} on ${entry.title}`);
	return im;
}

function sipsJpeg(srcPng, destJpg) {
	if (!fs.existsSync(srcPng)) throw new Error(`missing ${srcPng}`);
	execFileSync(
		'sips',
		['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '1200', srcPng, '--out', destJpg],
		{ stdio: 'ignore' }
	);
	fs.rmSync(srcPng);
}

const remakes = [
	['euija-maid-hip', 'Euija’s hand on a maid’s hip over mint silk — slender Korean figure, some calf at the hem'],
	['euija-maid-grab', 'Euija’s hand on a maid’s backside over mint silk as she pours — elegant, not exaggerated'],
	['euija-maid-hem-pour', 'Side crop: a slim calf and a line of thigh as the mint hem rides while she pours'],
	['euija-maid-stair-hem', 'On a stair: slender thighs and an elegantly rounded backside under a hiked mint chima'],
	['euija-maid-thigh-close', 'Close: slender Korean thighs, mint hem lifted a little, still dressed'],
	['euija-maid-ass-hand', 'Euija grinning, gold headband, hand on an elegantly rounded backside over mint silk']
];

const early = findEntry('King Euija, the 31st Eraha');
const descent = findEntry('Euija’s Descent');

for (const [id, alt] of remakes) {
	const slot = [...early.images, ...descent.images].find((im) => im.id === id);
	if (!slot) throw new Error(`missing ${id}`);
	const src = path.join(ASSETS, `${id}-v2.png`);
	const dest = path.join(TEMP, `${id}-v2.jpg`);
	sipsJpeg(src, dest);
	slot.tempImage = `/temp/${id}-v2.jpg`;
	slot.alt = alt;
	slot.prompt =
		'Intimate cinematic still. Eye-level. Slender adult Korean maid in mint chima, modest hips, softly elegant thighs — not thick, not exaggerated. Faces match attached portraits. Dress on. No genitals. No text. No watermark.';
	const stale = path.join(TEMP, `${id}.jpg`);
	if (fs.existsSync(stale)) fs.rmSync(stale);
}

const e = '/ch_buyeo_euija.png';
const m1 = '/ch_maid_1.png';
const m2 = '/ch_maid_2.png';
const m3 = '/ch_maid_3.png';

const orgy = [
	{
		id: 'nsfw-euija-orgy-lamp',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'The feast is no longer a feast',
		alt: 'Lamp-feast: Euija reclined, robe open, three maids close around him',
		refs: [e, m1, m2, m3]
	},
	{
		id: 'nsfw-euija-disrobe',
		ratio: 1.778,
		tone: '#e08a2e',
		nsfw: true,
		at: 'He is half-undressed',
		alt: 'Euija’s wine-red robe open on the chest; silk tented at the hip; a maid at his knee',
		refs: [e, m1]
	},
	{
		id: 'nsfw-euija-maid-straddle',
		ratio: 0.75,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'Knees find laps',
		alt: 'A maid astride Euija’s lap, mint chima gathered, his robe open',
		refs: [e, m2]
	},
	{
		id: 'nsfw-euija-maid-behind',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'Robes open',
		alt: 'Euija close behind a maid at a low table, silk gathered at her hip',
		refs: [e, m3]
	},
	{
		id: 'nsfw-euija-maids-display',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'The maids show him their bodies',
		alt: 'Two maids pose in lamp-light; Euija watches, robe open at the throat',
		refs: [e, m1, m2]
	}
];

const after = descent.images.findIndex((im) => im.id === 'euija-maid-ass-hand');
for (const slot of orgy) {
	const i = descent.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) Object.assign(descent.images[i], slot);
	else descent.images.splice(after >= 0 ? after + 1 : descent.images.length, 0, slot);
}

if (!descent.blocks.some((b) => b.html?.includes('The feast is no longer a feast'))) {
	const i = descent.blocks.findIndex((b) => b.html?.includes('The hems keep time'));
	if (i < 0) throw new Error('missing hems paragraph');
	descent.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'The feast is no longer a feast. Robes open. Knees find laps. He is half-undressed and does not bother to hide what the wine has done to him. The maids show him their bodies the way other courts show tribute.',
		ko: '잔치는 이제 잔치가 아니다. 옷이 열린다. 무릎이 무릎을 찾는다. 그는 반쯤 벗은 채로, 술이 자기에게 한 일을 숨길 생각도 없다. 궁녀들은 다른 조정이 공물을 보이듯 몸을 보인다.'
	});
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched v2 temps + orgy slots');
