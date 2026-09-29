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
	'Cinematic 16:9 movie-scene film still. Packed Sabi party. Euija no headband, robe open. Maids hike silk as high as it will go, wine-wet thighs. Faces match attached portraits. Silk still on. No genitals. No text. No watermark.';

const installs = [
	{
		id: 'nsfw-euija-party-hike',
		ratio: 1.778,
		at: 'The party does not sit still',
		alt: 'Movie-wide Sabi party: hems as high as they will go, wine-wet thighs, Euija undone among them'
	},
	{
		id: 'nsfw-euija-wet-party',
		ratio: 1.778,
		at: 'Wine-wet silk clinging',
		alt: 'Packed wet banquet: clinging mint silk, hiked hems, Euija’s hands on the cloth'
	},
	{
		id: 'nsfw-euija-hands-thighs',
		ratio: 1.778,
		at: 'His hands on her thighs',
		alt: 'Close: Euija’s hands on a maid’s hiked wine-wet thighs, one knee high'
	},
	{
		id: 'nsfw-euija-knees-wide',
		ratio: 1.778,
		at: 'both knees up',
		alt: 'Two maids sitting both knees up, hems hiked, inner thighs, party lamps'
	},
	{
		id: 'nsfw-euija-twist-hike',
		ratio: 1.778,
		at: 'She twists at the waist',
		alt: 'A maid twisting back, hem at the last fold; Euija’s hands on the hiked silk'
	},
	{
		id: 'nsfw-euija-lap-hands2',
		ratio: 1.778,
		at: 'both knees up in his lap',
		alt: 'A maid in Euija’s lap, both knees up, wine-wet silk, his hands on her hips'
	}
];

const descent = findEntry('Euija’s Descent');
const after = descent.images.findIndex((im) => im.id === 'nsfw-euija-elbows');
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

if (!descent.blocks.some((b) => b.html?.includes('The party does not sit still'))) {
	const i = descent.blocks.findIndex((b) => b.html?.includes('the last fold of silk'));
	if (i < 0) throw new Error('missing last-fold paragraph');
	descent.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'The party does not sit still. Wine-wet silk clinging. His hands on her thighs. They sit with both knees up. She twists at the waist. One of them, both knees up in his lap.',
		ko: '잔치는 가만히 있지 않는다. 술에 젖은 비단이 붙는다. 손이 허벅지에 있다. 양쪽 무릎을 세우고 앉는다. 허리를 튼다. 하나는 양쪽 무릎을 세운 채 그의 무릎에 있다.'
	});
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
console.log(`installed ${installs.length} movie-party slots`);
