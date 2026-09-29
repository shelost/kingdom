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

function upsert(images, afterId, slots) {
	for (const slot of slots) {
		const i = images.findIndex((im) => im.id === slot.id);
		if (i >= 0) Object.assign(images[i], slot);
		else {
			const at = images.findIndex((im) => im.id === afterId);
			images.splice(at >= 0 ? at + 1 : images.length, 0, slot);
		}
	}
}

function sipsTo(srcName, outId) {
	const source = path.join(ASSETS, srcName);
	if (!fs.existsSync(source)) throw new Error(`missing ${source}`);
	const out = path.join(TEMP, `${outId}.jpg`);
	execFileSync(
		'sips',
		['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '1200', source, '--out', out],
		{ stdio: 'ignore' }
	);
	fs.rmSync(source);
	return `/temp/${outId}.jpg`;
}

const maidV2 = [
	['euija-maid-hip-v2.png', 'euija-maid-hip-v2'],
	['euija-maid-grab-v2.png', 'euija-maid-grab-v2'],
	['euija-maid-hem-pour-v2.png', 'euija-maid-hem-pour-v2'],
	['euija-maid-stair-hem-v2.png', 'euija-maid-stair-hem-v2'],
	['euija-maid-thigh-close-v2.png', 'euija-maid-thigh-close-v2'],
	['euija-maid-ass-hand-v2.png', 'euija-maid-ass-hand-v2']
];

const maidTemps = {};
for (const [src, id] of maidV2) maidTemps[id] = sipsTo(src, id);

const orgySrc = [
	'nsfw-euija-orgy-undone.png',
	'nsfw-euija-orgy-show.png',
	'nsfw-euija-orgy-lap.png',
	'nsfw-euija-orgy-behind.png',
	'nsfw-euija-orgy-erect.png',
	'nsfw-euija-orgy-pile.png'
];
const orgyTemps = {};
for (const src of orgySrc) {
	const id = src.replace(/\.png$/, '');
	orgyTemps[id] = sipsTo(src, id);
}

const e = '/ch_buyeo_euija.png';
const m1 = '/ch_maid_1.png';
const m2 = '/ch_maid_2.png';
const m3 = '/ch_maid_3.png';

const early = findEntry('King Euija, the 31st Eraha');
const hip = early.images.find((im) => im.id === 'euija-maid-hip');
const grab = early.images.find((im) => im.id === 'euija-maid-grab');
const pour = early.images.find((im) => im.id === 'euija-maid-hem-pour');
if (!hip || !grab || !pour) throw new Error('missing early maid slots');
Object.assign(hip, {
	alt: 'Euija’s hand on a maid’s hip — slim Korean figure, mint silk, some calf',
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. Faces match attached portraits. Slim adult Korean maid, narrow waist, elegant modest hips. Not thick. No text. No watermark.',
	tempImage: maidTemps['euija-maid-hip-v2']
});
Object.assign(grab, {
	alt: 'Euija’s hand on a maid’s backside over mint silk as she pours — slim thigh at the hem',
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. Faces match attached portraits. Slim Korean figure. Not thick. No text. No watermark.',
	tempImage: maidTemps['euija-maid-grab-v2']
});
Object.assign(pour, {
	alt: 'Low crop: slim calf and thigh as the mint hem rides while she pours',
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. Slim Korean calf and thigh. Not thick. No text. No watermark.',
	tempImage: maidTemps['euija-maid-hem-pour-v2']
});

const descent = findEntry('Euija’s Descent');
const stair = descent.images.find((im) => im.id === 'euija-maid-stair-hem');
const thigh = descent.images.find((im) => im.id === 'euija-maid-thigh-close');
const ass = descent.images.find((im) => im.id === 'euija-maid-ass-hand');
if (!stair || !thigh || !ass) throw new Error('missing descent maid slots');
Object.assign(stair, {
	alt: 'Looking up a stair: slim thighs and an elegant hip under a hiked mint chima',
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. Slim Korean legs. Not thick. No text. No watermark.',
	tempImage: maidTemps['euija-maid-stair-hem-v2']
});
Object.assign(thigh, {
	alt: 'Close: slim thighs and an elegant hip — mint hem pulled aside, still dressed',
	prompt:
		'Intimate cinematic CLOSE-UP, 9:16. Slim Korean thighs. Not thick. No text. No watermark.',
	tempImage: maidTemps['euija-maid-thigh-close-v2']
});
Object.assign(ass, {
	alt: 'Euija grinning, gold headband, hand on an elegant backside over mint silk',
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. Slim Korean figure. Faces match attached portraits. Not thick. No text. No watermark.',
	tempImage: maidTemps['euija-maid-ass-hand-v2']
});

upsert(descent.images, 'euija-maid-ass-hand', [
	{
		id: 'nsfw-euija-orgy-undone',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'The nights stop pretending',
		alt: 'Euija half-undone — wine-red robe open, gold headband, two maids leaning in',
		refs: [e, m1, m2],
		tempImage: orgyTemps['nsfw-euija-orgy-undone']
	},
	{
		id: 'nsfw-euija-orgy-show',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'Silk comes off a shoulder',
		alt: 'Three maids showing bodies — jeogori open, hems at the hip, Euija watching',
		refs: [m1, m2, m3, e],
		tempImage: orgyTemps['nsfw-euija-orgy-show']
	},
	{
		id: 'nsfw-euija-orgy-lap',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'A maid straddles his lap',
		alt: 'A maid astride Euija’s lap — chima hiked, faces close, intercourse implied',
		refs: [e, m2],
		tempImage: orgyTemps['nsfw-euija-orgy-lap']
	},
	{
		id: 'nsfw-euija-orgy-behind',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'another kneels ahead',
		alt: 'Euija behind a kneeling maid — silk rucked, grip on her hip, implied',
		refs: [e, m3],
		tempImage: orgyTemps['nsfw-euija-orgy-behind']
	},
	{
		id: 'nsfw-euija-orgy-erect',
		ratio: 0.75,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'He sits half-undone',
		alt: 'Euija sitting back, robe open, a maid at his side — the silk at the hip is not modest',
		refs: [e, m1],
		tempImage: orgyTemps['nsfw-euija-orgy-erect']
	},
	{
		id: 'nsfw-euija-orgy-pile',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'the pile does not empty',
		alt: 'Orgy pile — Euija in the middle, three maids, silk off, heat, positions implied',
		refs: [e, m1, m2, m3],
		tempImage: orgyTemps['nsfw-euija-orgy-pile']
	}
]);

if (!descent.blocks.some((b) => b.html?.includes('The nights stop pretending'))) {
	const i = descent.blocks.findIndex((b) => b.html?.includes('The hems keep time'));
	if (i < 0) throw new Error('missing hems paragraph');
	descent.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'The nights stop pretending they are a feast. Silk comes off a shoulder, then a hip. A maid straddles his lap; another kneels ahead of him on the boards; a third waits with the wine. He sits half-undone — wine-red robe open to the navel, gold headband still on — and the silk at the hip is not modest. The chronicle does not draw the rest. It draws the heat, the positions, the way the pile does not empty.',
		ko: '밤은 더 이상 연회인 척하지 않는다. 비단이 어깨에서, 이어 엉덩이에서 벗어진다. 궁녀 하나가 무릎에 앉고, 하나는 마루에 무릎을 꿇고, 하나는 술을 들고 기다린다. 그는 반쯤 풀린 채 앉아 있다 — 포도주빛 도포가 배꼽까지 열리고, 금빛 머리띠만은 여전하다 — 그리고 허리의 비단은 겸손하지 않다. 이 기록은 나머지를 그리지 않는다. 열과, 자세와, 그 무더기가 비지 않는 방식만 그린다.'
	});
}

for (const old of [
	'euija-maid-hip.jpg',
	'euija-maid-grab.jpg',
	'euija-maid-hem-pour.jpg',
	'euija-maid-stair-hem.jpg',
	'euija-maid-thigh-close.jpg',
	'euija-maid-ass-hand.jpg'
]) {
	const p = path.join(TEMP, old);
	if (fs.existsSync(p)) fs.rmSync(p);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
console.log('installed slim v2 maids + descent orgy stills');
