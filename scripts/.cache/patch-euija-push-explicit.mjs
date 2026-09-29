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
		id: 'nsfw-euija-hands-hem',
		ratio: 1.778,
		at: 'as high as it will go',
		alt: 'Three maids hike mint chima with both hands; Euija watches, no headband'
	},
	{
		id: 'nsfw-euija-two-hike',
		ratio: 1.778,
		at: 'Two of them hike together',
		alt: 'Two maids hiking silk, inner thighs toward bare-browed Euija'
	},
	{
		id: 'nsfw-euija-sit-spread',
		ratio: 1.778,
		at: 'They sit with knees up',
		alt: 'Two maids sitting knees up, hiked hems, inner thighs; Euija at the edge'
	},
	{
		id: 'nsfw-euija-knee-high',
		ratio: 0.75,
		at: 'One knee high',
		alt: 'Close: one knee high, mint silk bunched, a long thigh; Euija at the hem'
	},
	{
		id: 'nsfw-euija-pull-silk',
		ratio: 0.75,
		at: 'She pulls the silk up',
		alt: 'Close: a maid pulling mint silk up with both hands, Euija below'
	},
	{
		id: 'nsfw-euija-look-up',
		ratio: 1.778,
		at: 'He looks up the silk',
		alt: 'Euija looking up as a maid lifts mint silk over plump thighs'
	},
	{
		id: 'nsfw-euija-hip-mouth',
		ratio: 1.778,
		at: 'His mouth is at her hip',
		alt: 'Euija no headband, mouth in hiked mint silk at a maid’s hip'
	},
	{
		id: 'nsfw-euija-open-more',
		ratio: 1.778,
		at: 'The robe hangs wider',
		alt: 'Euija between two maids, no headband, robe hanging open, into the silk'
	}
];

const descent = findEntry('Euija’s Descent');
const after = descent.images.findIndex((im) => im.id === 'nsfw-euija-mouth-silk');
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

if (!descent.blocks.some((b) => b.html?.includes('as high as it will go'))) {
	const i = descent.blocks.findIndex((b) => b.html?.includes('His mouth finds the silk'));
	if (i < 0) throw new Error('missing mouth paragraph');
	descent.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'They hike it as high as it will go. Two of them hike together. They sit with knees up. One knee high. She pulls the silk up. He looks up the silk. His mouth is at her hip. The robe hangs wider.',
		ko: '더 이상 걷을 데가 없을 때까지 걷는다. 둘이 함께 걷는다. 무릎을 세우고 앉는다. 한쪽 무릎이 높다. 비단을 끌어올린다. 그는 비단을 올려다본다. 입이 허리에 있다. 도포가 더 벌어진다.'
	});
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
console.log(`installed ${installs.length} push-explicit slots`);
