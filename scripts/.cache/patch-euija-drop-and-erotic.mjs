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

const drop = ['nsfw-euija-wet-cling', 'nsfw-euija-plump-wet', 'nsfw-euija-compete-pose'];
const descent = findEntry('Euija’s Descent');
descent.images = descent.images.filter((im) => !drop.includes(im.id));
for (const id of drop) {
	const p = path.join(TEMP, `${id}.jpg`);
	if (fs.existsSync(p)) fs.rmSync(p);
}

const wine = descent.blocks.find((b) => b.html?.includes('Jackets hang off the shoulders'));
if (wine) {
	wine.html = 'Jackets hang off the shoulders. The chima rides low. The robe hangs open.';
	wine.ko = '저고리가 어깨에서 걸린다. 치마가 낮아진다. 도포가 열린다.';
}

const show = descent.blocks.find((b) => b.html?.includes('looking is the same as asking'));
if (show) {
	show.html = 'A hand finds the silk at her own lap. Fingers rest on an inner thigh. One knee up. A twist. They show off for him.';
	show.ko = '손이 제 무릎의 비단을 찾는다. 손가락이 허벅지 안쪽에 머문다. 한쪽 무릎을 세운다. 몸을 비튼다. 그를 위해 몸을 보인다.';
}

const e = '/ch_buyeo_euija.png';
const m1 = '/ch_maid_1.png';
const m2 = '/ch_maid_2.png';
const m3 = '/ch_maid_3.png';
const prompt =
	'Intimate cinematic still. REAL Baekje Sabi hall. Euija no headband, robe open. Maids hiked silk, thighs. Faces match attached portraits. Silk still on. No genitals. No text. No watermark.';

const installs = [
	{
		id: 'nsfw-euija-bare-brow',
		ratio: 1.778,
		at: 'The headband is gone',
		alt: 'Packed Sabi feast: Euija bare-browed, robe open, maids hiking mint silk on plump thighs'
	},
	{
		id: 'nsfw-euija-undone-brow',
		ratio: 0.75,
		at: 'The robe hangs off',
		alt: 'Close: Euija with no headband, robe slipping, a maid’s hiked thigh at his side'
	},
	{
		id: 'nsfw-euija-thigh-open',
		ratio: 1.778,
		at: 'hike the silk to the hip',
		alt: 'A maid’s knee up, mint hem at the hip, inner thigh; Euija undone at the silk'
	},
	{
		id: 'nsfw-euija-inner-show',
		ratio: 1.778,
		at: 'Inner thighs face him',
		alt: 'A row of maids hiking chima so inner thighs face bare-browed Euija'
	},
	{
		id: 'nsfw-euija-lap-lift',
		ratio: 0.75,
		at: 'A hem lifts',
		alt: 'Close: a maid lifts mint silk; plump thighs; Euija looking up, no headband'
	},
	{
		id: 'nsfw-euija-lap-silk',
		ratio: 1.778,
		at: 'A maid finds his lap',
		alt: 'A maid in Euija’s lap, chima bunched, robe open, no headband'
	},
	{
		id: 'nsfw-euija-mouth-silk',
		ratio: 1.778,
		at: 'His mouth finds the silk',
		alt: 'Euija bare-browed, robe off the shoulders, mouth in hiked mint silk between two maids'
	}
];

const after = descent.images.findIndex((im) => im.id === 'nsfw-euija-open-robe');
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

if (!descent.blocks.some((b) => b.html?.includes('The headband is gone'))) {
	const i = descent.blocks.findIndex((b) => b.html?.includes('The robe hangs open'));
	if (i < 0) throw new Error('missing robe paragraph');
	descent.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'The headband is gone. The robe hangs off. They hike the silk to the hip. Inner thighs face him. A hem lifts. A maid finds his lap. His mouth finds the silk.',
		ko: '머리띠가 없다. 도포가 벗겨진다. 비단을 허리까지 걷는다. 허벅지 안쪽이 그를 향한다. 자락이 들린다. 궁녀가 무릎을 찾는다. 입이 비단을 찾는다.'
	});
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
console.log(`dropped ${drop.join(', ')}; installed ${installs.length}`);
