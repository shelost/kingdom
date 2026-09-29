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
	'Cinematic movie still. Varied light and angle. Fun, teasing, erotic. Clear wine sheen, no blood. Euija no headband. Hiked silk. Faces match attached portraits. Silk still on. No genitals. No text. No watermark.';

const installs = [
	{
		id: 'nsfw-euija-moon-lattice',
		ratio: 1.778,
		at: 'Moonlight through the lattice',
		alt: 'High angle, cool moonlight through changmun: Euija grinning, two maids hiking silk on the floor'
	},
	{
		id: 'nsfw-euija-side-lamp',
		ratio: 1.778,
		at: 'One lamp from the side',
		alt: 'Low along the floor: one hard lamp on a hiked thigh, Euija’s hand on the silk'
	},
	{
		id: 'nsfw-euija-over-shoulder',
		ratio: 1.778,
		at: 'Over her shoulder',
		alt: 'Over-the-shoulder: a maid’s hiked silk, Euija looking up at her, laughing'
	},
	{
		id: 'nsfw-euija-veranda-moon',
		ratio: 1.778,
		at: 'On the night veranda',
		alt: 'Wide night veranda: moonlight and one lamp, maids teasing, hems high, Euija laughing'
	},
	{
		id: 'nsfw-euija-pour-tease',
		ratio: 1.778,
		at: 'She pours clear wine down the silk',
		alt: 'Backlit dutch: a maid pours clear wine down hiked mint silk, Euija reaching, grinning'
	},
	{
		id: 'nsfw-euija-laugh-close',
		ratio: 1.778,
		at: 'They laugh into the lamp',
		alt: 'Close faces laughing, a wine-wet hiked thigh between them, Euija bare-browed'
	}
];

const descent = findEntry('Euija’s Descent');
const after = descent.images.findIndex((im) => im.id === 'nsfw-euija-lap-hands2');
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

const wetSrc = path.join(ASSETS, 'nsfw-euija-wet-party.png');
if (fs.existsSync(wetSrc)) {
	sipsJpeg(wetSrc, path.join(TEMP, 'nsfw-euija-wet-party.jpg'));
	const wet = descent.images.find((im) => im.id === 'nsfw-euija-wet-party');
	if (wet) {
		wet.alt = 'Fun Sabi banquet: clear wine-sheen, hiked hems, Euija laughing — no gore';
		wet.prompt = prompt;
	}
}

if (!descent.blocks.some((b) => b.html?.includes('Moonlight through the lattice'))) {
	const i = descent.blocks.findIndex((b) => b.html?.includes('The party does not sit still'));
	if (i < 0) throw new Error('missing party paragraph');
	descent.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'Moonlight through the lattice. One lamp from the side. Over her shoulder. On the night veranda. She pours clear wine down the silk. They laugh into the lamp.',
		ko: '창호로 달이 든다. 옆에서 등 하나. 어깨 너머로. 밤의 누마루에서. 맑은 술을 비단에 따른다. 등불 앞에서 웃는다.'
	});
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
console.log('installed movie-angle slots');
