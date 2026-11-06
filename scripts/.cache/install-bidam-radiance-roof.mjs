// Install Bidam-on-Radiance-roof stills into Seung and crop them to 2:1.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { cropArgs, HOUSE_RATIO } from '../crop-ratio.mjs';

const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const TEMP = 'static/temp';

const STILLS = [
	{
		id: 'bidam-radiance-roof-wide',
		at: 'The Fortress of Radiance',
		alt: 'Night: 3D-stage radiance camera, Bidam human-scale on the munru roof under a huge blue moon',
		tone: '#141C2E',
		role: 'Radiance roof wide',
		angle: 'low three-quarter from glacis'
	},
	{
		id: 'bidam-radiance-roof-look',
		at: 'Bidam walks the rampart',
		alt: 'Crane-in: Bidam on the Radiance roof, chin up in defiance, huge blue moon behind him',
		tone: '#0d1b2a',
		role: 'Radiance roof look',
		angle: 'crane-in three-quarter'
	},
	{
		id: 'bidam-radiance-roof-ots',
		at: 'Look at them come down the valley road',
		alt: 'Over-shoulder from Bidam on the Radiance roof, looking at the Moon Palace under a huge blue moon',
		tone: '#141C2E',
		role: 'Radiance roof OTS',
		angle: 'over-shoulder'
	}
];

const PROMPT =
	'HEEWON STYLE painted like bidam-defiance: oil-glazed volume, one hard moonlight key, crushed shadow, visible brushwork — not flat cel, not Ghibli, not daylight. 2:1 letterbox. CAMERA LOCKED to the 3D moon-stage radiance view: from the glacis road looking UP at the two-storey Radiance munru. NIGHT. A HUGE BLUE FULL MOON. Bidam HUMAN SCALE ON the giwa, navy #141C2E, BLACK headband, 108 beads, chin lifted, FACE from /ch_bidam.png. Looking west at the Moon Palace. No army. No text. No watermark.';

const REFS = ['/ch_bidam.png', '/temp/bidam_defiance_upward.png', '/pl_radiance_fortress.png'];

for (const still of STILLS) {
	const src = `${ASSETS}/${still.id}.jpg`;
	const dest = `${TEMP}/${still.id}.jpg`;
	if (!existsSync(src)) throw new Error(`missing ${src}`);
	copyFileSync(src, dest);
	const crop = cropArgs(dest, HOUSE_RATIO);
	if (crop.length) execFileSync('sips', [...crop, dest], { stdio: 'inherit' });
	console.log('cropped', dest);
}

const storyPath = 'src/lib/data/story.json';
let storyRaw = readFileSync(storyPath, 'utf8');
if (!storyRaw.includes('"bidam-radiance-roof-wide"')) {
	const slots = STILLS.map(
		(s) => `					{
						"id": "${s.id}",
						"ratio": 2,
						"tone": "${s.tone}",
						"at": "${s.at}",
						"alt": "${s.alt}",
						"people": [
							"bidam"
						],
						"refs": [
							"/ch_bidam.png",
							"/temp/bidam_defiance_upward.png",
							"/pl_radiance_fortress.png"
						],
						"prompt": ${JSON.stringify(PROMPT)},
						"tempImage": "/temp/${s.id}.jpg"
					}`
	).join(',\n');
	const marker = '"tempImage": "/temp/radiance-exposition-wide.jpg"\n					},';
	if (!storyRaw.includes(marker)) throw new Error('story marker missing');
	storyRaw = storyRaw.replace(marker, `${marker}\n${slots},`);
	storyRaw = storyRaw.replace(
		'"thumbnail": "radiance-exposition-wide"',
		'"thumbnail": "bidam-radiance-roof-wide"'
	);
	writeFileSync(storyPath, storyRaw);
	console.log('story patched');
}

const peoplePath = 'src/lib/data/image-people.json';
let peopleRaw = readFileSync(peoplePath, 'utf8');
if (!peopleRaw.includes('"bidam-radiance-roof-wide"')) {
	peopleRaw = peopleRaw.replace(
		'"bidam-radiance-muster": [\n    "bidam"\n  ],',
		`"bidam-radiance-muster": [
    "bidam"
  ],
  "bidam-radiance-roof-wide": [
    "bidam"
  ],
  "bidam-radiance-roof-look": [
    "bidam"
  ],
  "bidam-radiance-roof-ots": [
    "bidam"
  ],`
	);
	writeFileSync(peoplePath, peopleRaw);
	console.log('image-people patched');
}

const stars = JSON.parse(readFileSync('src/lib/data/image-stars.json', 'utf8'));
const starSet = new Set(stars.stars);
for (const s of STILLS) starSet.add(s.id);
stars.stars = [...starSet].sort();
stars.updatedAt = new Date().toISOString();
writeFileSync('src/lib/data/image-stars.json', JSON.stringify(stars, null, '\t') + '\n');

const seqPath = 'src/lib/movieSequences.ts';
let seq = readFileSync(seqPath, 'utf8');
const needle = `{ id: 'radiance-exposition-wide', role: 'Radiance wide', angle: 'exposition', at: 'Fortress of Radiance' },`;
const extra = STILLS.map(
	(s) => `\t\t\t{ id: '${s.id}', role: '${s.role}', angle: '${s.angle}', at: '${s.at}' },`
).join('\n');
if (!seq.includes('bidam-radiance-roof-wide')) {
	if (!seq.includes(needle)) throw new Error('movieSequences needle missing');
	seq = seq.replace(needle, `${needle}\n${extra}`);
	writeFileSync(seqPath, seq);
	console.log('movieSequences patched');
}

writeFileSync(
	'scripts/.cache/bidam-radiance-roof-manifest.json',
	JSON.stringify(
		{
			place: 'Radiance Fortress roof → Moon Palace (Wolseong)',
			camera: 'low three-quarter from the moon-stage radiance view (glacis road, looking up)',
			time: 'night',
			style: 'bidam-defiance',
			stills: STILLS
		},
		null,
		'\t'
	) + '\n'
);
