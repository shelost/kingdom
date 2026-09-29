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
	'Intimate cinematic still. REAL Baekje Sabi hall: vermilion columns, yellow-ochre wood, lattice, oil lamps. Faces match attached portraits. Softly elegant Korean maids, not cartoon-thick. Dress on. No genitals. No text. No watermark.';

const installs = [
	{
		id: 'nsfw-euija-palace-feast',
		src: 'nsfw-euija-palace-feast.png',
		ratio: 1.778,
		at: 'They fill it',
		alt: 'Packed Sabi banquet: Euija among a dozen maids, hiked mint hems, vermilion columns'
	},
	{
		id: 'nsfw-euija-veranda-party',
		src: 'nsfw-euija-veranda-party.png',
		ratio: 1.778,
		at: 'The hall is Sabi',
		alt: 'Sabi veranda at night: Euija grinning, many maids showing thighs, giwa roofs beyond'
	},
	{
		id: 'nsfw-euija-pour-crowd',
		src: 'nsfw-euija-pour-crowd.png',
		ratio: 1.778,
		at: 'They toast until the lamps blur',
		alt: 'Crowded Sabi banquet: maids hike silk and pour while Euija reclines'
	},
	{
		id: 'nsfw-euija-thighs-party',
		src: 'nsfw-euija-thighs-party.png',
		ratio: 1.778,
		at: 'They hike the silk',
		alt: 'Low tables in a Sabi hall: many maids laughing, mint hems hiked on slender thighs'
	},
	{
		id: 'nsfw-euija-maids-backs',
		src: 'nsfw-euija-maids-backs-v2.png',
		ratio: 1.778,
		at: 'They turn their backs and laugh',
		alt: 'Sabi corridor: many maids looking back, mint silk hiked on rounded backsides'
	},
	{
		id: 'nsfw-euija-bend-row',
		src: 'nsfw-euija-bend-row.png',
		ratio: 1.778,
		at: 'They pour bent at the waist',
		alt: 'A row of maids bent over Sabi tables, silk tight on hips, looking back'
	},
	{
		id: 'nsfw-euija-column-laugh',
		src: 'nsfw-euija-column-laugh.png',
		ratio: 1.778,
		at: 'They crowd a column',
		alt: 'Euija laughing against a vermilion pillar, maids hiked and pouring around him'
	},
	{
		id: 'nsfw-euija-undress-hall',
		src: 'nsfw-euija-undress-hall.png',
		ratio: 1.778,
		at: 'Ribbons come undone',
		alt: 'Sabi hall: many maids untying goreum, jeogori slipping, thighs and hips in lamp-light'
	},
	{
		id: 'nsfw-euija-lap-hands',
		src: 'nsfw-euija-lap-hands.png',
		ratio: 1.778,
		at: 'A hand finds the silk at her own lap',
		alt: 'Maids around Euija, each with a hand pressed to the silk at her lap, showing off'
	},
	{
		id: 'nsfw-euija-inner-thigh',
		src: 'nsfw-euija-inner-thigh.png',
		ratio: 1.778,
		at: 'Fingers rest on an inner thigh',
		alt: 'Three maids reclining, hems hiked, fingers on the inner thigh, watching Euija'
	},
	{
		id: 'nsfw-euija-knee-hand',
		src: 'nsfw-euija-knee-hand.png',
		ratio: 0.75,
		at: 'One knee up',
		alt: 'Close: a maid on one knee, hem hiked, showing off for flushed Euija behind her'
	},
	{
		id: 'nsfw-euija-twist-pose',
		src: 'nsfw-euija-twist-pose.png',
		ratio: 1.778,
		at: 'A twist',
		alt: 'Four maids in show-off poses around standing Euija — twist, kneel, hem, backside'
	},
	{
		id: 'nsfw-euija-showoff',
		src: 'nsfw-euija-showoff.png',
		ratio: 1.778,
		at: 'They show off for him',
		alt: 'Packed Sabi hall: a crowd of maids lifting mint hems for reclining Euija'
	},
	{
		id: 'nsfw-euija-compete-pose',
		src: 'nsfw-euija-compete-pose.png',
		ratio: 1.778,
		at: 'looking is the same as asking',
		alt: 'Sabi veranda: maids in a ring around Euija, competing to be seen'
	}
];

const descent = findEntry('Euija’s Descent');
const after = descent.images.findIndex((im) => im.id === 'nsfw-euija-harem-crowd');
let insertAt = after >= 0 ? after + 1 : descent.images.length;

for (const item of installs) {
	const src = path.join(ASSETS, item.src);
	const destName = `${item.id}.jpg`;
	const dest = path.join(TEMP, destName);
	sipsJpeg(src, dest);

	const slot = {
		id: item.id,
		ratio: item.ratio,
		tone: '#7f1d1d',
		nsfw: true,
		at: item.at,
		alt: item.alt,
		refs: [e, m1, m2, m3],
		tempImage: `/temp/${destName}`,
		prompt
	};
	const i = descent.images.findIndex((im) => im.id === item.id);
	if (i >= 0) Object.assign(descent.images[i], slot);
	else {
		descent.images.splice(insertAt, 0, slot);
		insertAt += 1;
	}
}

const tentSrc = path.join(ASSETS, 'nsfw-euija-orgy-erect.png');
const tentDest = path.join(TEMP, 'nsfw-euija-tent-pants-v2.jpg');
if (fs.existsSync(tentSrc)) {
	sipsJpeg(tentSrc, tentDest);
	const tent = descent.images.find((im) => im.id === 'nsfw-euija-tent-pants');
	if (tent) {
		tent.tempImage = '/temp/nsfw-euija-tent-pants-v2.jpg';
		tent.alt = 'Euija reclined, robe open; a maid’s hands on the dark silk at his lap';
		tent.prompt = prompt;
	}
	const stale = path.join(TEMP, 'nsfw-euija-tent-pants.jpg');
	if (fs.existsSync(stale)) fs.rmSync(stale);
}

if (!descent.blocks.some((b) => b.html?.includes('The hall is Sabi'))) {
	const i = descent.blocks.findIndex((b) => b.html?.includes('the dark trousers tell it first'));
	if (i < 0) throw new Error('missing trousers paragraph');
	descent.blocks.splice(
		i + 1,
		0,
		{
			kind: 'p',
			html: 'The hall is Sabi: vermilion columns, yellow wood, lamps on a wet floor. They fill it. They hike the silk. They turn their backs and laugh. They pour bent at the waist. They crowd a column. Ribbons come undone. They toast until the lamps blur. They compete to be seen.',
			ko: '전각은 사비다. 주홍 기둥, 누런 나무, 젖은 마루 위의 등. 그들이 채운다. 비단을 걷어 올린다. 등을 돌리고 웃는다. 허리를 숙여 따른다. 기둥을 에워싼다. 고름이 풀린다. 등이 흐려질 때까지 잔을 친다. 보이려고 다툰다.'
		},
		{
			kind: 'p',
			html: 'A hand finds the silk at her own lap. Fingers rest on an inner thigh. One knee up. A twist. They show off for him until looking is the same as asking.',
			ko: '손이 제 무릎의 비단을 찾는다. 손가락이 허벅지 안쪽에 머문다. 한쪽 무릎을 세운다. 몸을 비튼다. 그를 위해 몸을 보인다. 보는 일이 청하는 일과 같아질 때까지.'
		}
	);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
console.log(`installed ${installs.length} palace/show-off slots`);
