import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const STORY = 'src/lib/data/story.json';
const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const TEMP = 'static/temp';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
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

const e = '/ch_buyeo_euija.png';
const m1 = '/ch_maid_1.png';
const m2 = '/ch_maid_2.png';
const m3 = '/ch_maid_3.png';
const prompt =
	'Intimate cinematic still. REAL Baekje Sabi hall. Euija no headband, robe open. Maids hike silk high, thighs. Faces match attached portraits. Silk still on. No genitals. No text. No watermark.';

const installs = [
	{
		id: 'nsfw-euija-last-fold',
		ratio: 1.778,
		at: 'the last fold of silk',
		alt: 'Close: mint silk hiked to the last fold at the hip, inner thighs; Euija undone'
	},
	{
		id: 'nsfw-euija-along-thigh',
		ratio: 1.778,
		at: 'along a thigh',
		alt: 'Euija no headband, mouth in hiked mint silk along a plump thigh'
	},
	{
		id: 'nsfw-euija-navel-robe',
		ratio: 0.75,
		at: 'open to the navel',
		alt: 'Close: Euija no headband, robe open to the navel, a maid’s hiked thigh'
	},
	{
		id: 'nsfw-euija-hand-lap',
		ratio: 1.778,
		at: 'her hand on the silk at her lap',
		alt: 'A maid knee-up, hand on the silk at her lap, looking at undone Euija'
	},
	{
		id: 'nsfw-euija-elbows',
		ratio: 1.778,
		at: 'jeogori slipping off the shoulders',
		alt: 'Two maids, jeogori slipping, hems as high as they will go; Euija watching'
	}
];

const descent = findEntry('Euija’s Descent');
const after = descent.images.findIndex((im) => im.id === 'nsfw-euija-open-more');
let insertAt = after >= 0 ? after + 1 : descent.images.length;

for (const item of installs) {
	sipsJpeg(path.join(ASSETS, `${item.id}.png`), path.join(TEMP, `${item.id}.jpg`));
	const slot = {
		id: item.id,
		ratio: item.ratio,
		tone: '#7f1d1d',
		nsfw: true,
		at: item.at,
		alt: item.alt,
		refs: [e, m1, m2, m3],
		tempImage: `/temp/${item.id}.jpg`,
		prompt
	};
	const i = descent.images.findIndex((im) => im.id === item.id);
	if (i >= 0) Object.assign(descent.images[i], slot);
	else {
		descent.images.splice(insertAt, 0, slot);
		insertAt += 1;
	}
}

if (!descent.blocks.some((b) => b.html?.includes('the last fold of silk'))) {
	const i = descent.blocks.findIndex((b) => b.html?.includes('The robe hangs wider'));
	if (i < 0) throw new Error('missing wider paragraph');
	descent.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'They hike it to the last fold of silk. His mouth is along a thigh. The robe is open to the navel. Her hand on the silk at her lap. Jeogori slipping off the shoulders.',
		ko: '비단의 마지막 접힘까지 걷는다. 입이 허벅지를 따른다. 도포가 배꼽까지 열린다. 손이 제 무릎의 비단에 있다. 저고리가 어깨에서 미끄러진다.'
	});
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
console.log(`installed ${installs.length}`);
