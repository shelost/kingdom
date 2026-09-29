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
	'Intimate cinematic still. REAL Baekje Sabi hall. Wet silk slipping, plump thighs, Euija undone. Faces match attached portraits. Silk still on. No genitals. No text. No watermark.';

const installs = [
	{
		id: 'nsfw-euija-wet-cling',
		ratio: 1.778,
		at: 'Wine soaks the silk',
		alt: 'Sabi hall: wine-soaked silk clinging to plump thighs; Euija wrecked, headband slipping'
	},
	{
		id: 'nsfw-euija-plump-wet',
		ratio: 1.778,
		at: 'Plump thighs shine',
		alt: 'Low in a Sabi hall: wet mint silk on plump thighs, spilled wine, Euija reaching'
	},
	{
		id: 'nsfw-euija-off-shoulder',
		ratio: 1.778,
		at: 'Jackets hang off the shoulders',
		alt: 'Packed Sabi banquet: jeogori slipping, wet chima on hips, Euija laughing into silk'
	},
	{
		id: 'nsfw-euija-silk-wrap',
		ratio: 1.778,
		at: 'The chima rides low',
		alt: 'Many maids, jeogori hanging off, wet mint silk low on hips; Euija undone among them'
	},
	{
		id: 'nsfw-euija-face-hip',
		ratio: 1.778,
		at: 'His face finds a hip',
		alt: 'Euija on his knees, face pressed into wet mint silk at a maid’s hip'
	},
	{
		id: 'nsfw-euija-between',
		ratio: 1.778,
		at: 'He buries himself between them',
		alt: 'Euija buried between two wet maids, headband slipping, laughing'
	},
	{
		id: 'nsfw-euija-face-back',
		ratio: 0.75,
		at: 'wet silk at her back',
		alt: 'Close: Euija’s face pressed into wet mint silk at a maid’s backside'
	},
	{
		id: 'nsfw-euija-hanging-silk',
		ratio: 1.778,
		at: 'He goes face-first into the silk',
		alt: 'Euija face-first in wet silk at a hip; jeogori hanging off her shoulders'
	},
	{
		id: 'nsfw-euija-untied',
		ratio: 0.75,
		at: 'An untied goreum',
		alt: 'Close: jeogori untied, wet chima low; Euija pressed to the silk at her hip'
	},
	{
		id: 'nsfw-euija-open-robe',
		ratio: 1.778,
		at: 'The robe hangs open',
		alt: 'Euija between two maids, robe wide open, face in wet silk'
	},
	{
		id: 'nsfw-euija-wild-faces',
		ratio: 1.778,
		at: 'They gasp and laugh in his face',
		alt: 'Close faces: wrecked Euija and three maids gasping, laughing, biting a lip'
	}
];

const descent = findEntry('Euija’s Descent');
const after = descent.images.findIndex((im) => im.id === 'nsfw-euija-compete-pose');
let insertAt = after >= 0 ? after + 1 : descent.images.length;

for (const item of installs) {
	const src = path.join(ASSETS, `${item.id}.png`);
	const dest = path.join(TEMP, `${item.id}.jpg`);
	sipsJpeg(src, dest);

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

if (!descent.blocks.some((b) => b.html?.includes('Wine soaks the silk'))) {
	const i = descent.blocks.findIndex((b) => b.html?.includes('looking is the same as asking'));
	if (i < 0) throw new Error('missing show-off paragraph');
	descent.blocks.splice(
		i + 1,
		0,
		{
			kind: 'p',
			html: 'Wine soaks the silk until it clings. Plump thighs shine. Jackets hang off the shoulders. The chima rides low. The robe hangs open.',
			ko: '술이 비단을 적셔 몸에 붙는다. 허벅지가 빛난다. 저고리가 어깨에서 걸린다. 치마가 낮아진다. 도포가 열린다.'
		},
		{
			kind: 'p',
			html: 'His face finds a hip. He buries himself between them. He presses into the wet silk at her back. He goes face-first into the silk. An untied goreum. They gasp and laugh in his face.',
			ko: '얼굴이 허리를 찾는다. 그들 사이에 파묻힌다. 등쪽 젖은 비단에 얼굴을 민다. 비단 속으로 얼굴을 먼저 넣는다. 풀린 고름. 그의 얼굴 앞에서 헐떡이고 웃는다.'
		}
	);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
console.log(`installed ${installs.length} wet/undone slots`);
