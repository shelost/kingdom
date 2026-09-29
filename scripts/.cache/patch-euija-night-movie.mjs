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
	'Cinematic live-action NIGHT movie still. Dramatic light. Realistic cinema, not cartoon. Euija no headband. Hiked silk. No blood. Faces match attached portraits. Silk still on. No genitals. No text. No watermark.';

const installs = [
	{
		id: 'nsfw-euija-night-rain',
		ratio: 1.778,
		at: 'Rain on the night veranda',
		alt: 'Night rain veranda: moon and one lamp in the wet floor, Euija pulling a laughing maid close'
	},
	{
		id: 'nsfw-euija-night-shaft',
		ratio: 1.778,
		at: 'A shaft of lamp in the dark',
		alt: 'Night hall: one vertical lamp-shaft, a maid’s hiked thigh lit, Euija’s hand on the silk'
	},
	{
		id: 'nsfw-euija-night-track',
		ratio: 1.778,
		at: 'the night corridor',
		alt: 'Night corridor tracking: two maids hiking silk toward camera, Euija grinning behind'
	},
	{
		id: 'nsfw-euija-night-close',
		ratio: 1.778,
		at: 'Moon on one side of his face',
		alt: 'Night close: moon on Euija’s face, warm lamp on hiked silk at a thigh'
	}
];

const descent = findEntry('Euija’s Descent');
const after = descent.images.findIndex((im) => im.id === 'nsfw-euija-laugh-close');
let insertAt = after >= 0 ? after + 1 : descent.images.length;

for (const item of installs) {
	sipsJpeg(path.join(ASSETS, `${item.id}.png`), path.join(TEMP, `${item.id}.jpg`));
	const slot = {
		id: item.id,
		ratio: item.ratio,
		tone: '#0f172a',
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

if (!descent.blocks.some((b) => b.html?.includes('Rain on the night veranda'))) {
	const i = descent.blocks.findIndex((b) => b.html?.includes('They laugh into the lamp'));
	if (i < 0) throw new Error('missing laugh paragraph');
	descent.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'Rain on the night veranda. A shaft of lamp in the dark. They take the night corridor. Moon on one side of his face.',
		ko: '밤 누마루에 비가 온다. 어둠 속 등 한 줄기. 밤 복도를 간다. 달빛이 얼굴 한쪽에만 있다.'
	});
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
console.log(`installed ${installs.length} night-movie slots`);
