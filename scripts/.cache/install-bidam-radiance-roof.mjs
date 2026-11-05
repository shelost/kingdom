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
		alt: 'High three-quarter: Bidam on the Radiance munru roof, looking west at the crescent Moon Palace',
		tone: '#d8ddd0',
		role: 'Radiance roof wide',
		angle: 'high three-quarter'
	},
	{
		id: 'bidam-radiance-roof-look',
		at: 'Bidam walks the rampart',
		alt: 'Closer: Bidam on the Radiance roof ridge, face readable, Wolseong in the haze',
		tone: '#c9d0c4',
		role: 'Radiance roof look',
		angle: 'crane-in three-quarter'
	},
	{
		id: 'bidam-radiance-roof-ots',
		at: 'Look at them come down the valley road',
		alt: 'Over-shoulder from Bidam on the Radiance roof, looking at the crescent Moon Palace',
		tone: '#d4d8cc',
		role: 'Radiance roof OTS',
		angle: 'over-shoulder'
	}
];

const PROMPT =
	'HEEWON STYLE. Minimal iconic 2:1 still, composed for a 2:1 letterbox crop; nothing important at the top or bottom edge. HIGH THREE-QUARTER from the east, looking west: Bidam standing ON the grey giwa roof of the two-storey Radiance Fortress munru (white plaster, vermilion columns, pale stone wall), looking over the pine field at the distant crescent earthen Moon Palace (Wolseong). DAY GROUND: paper-white overcast sky, pale haze. FACE AND GARMENTS from /ch_bidam_old.png: silver-grey swept-back hair, thin mustache, faint smile, navy-black robe, white inner collar, BLACK headband, 108 beads. ONE device: Bidam’s dark vertical on the munru roof against the far crescent. Camera locked to the 3D moon-stage radiance view. No army. No text. No watermark.';

const REFS = ['/ch_bidam_old.png', '/pl_radiance_fortress.png'];

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
							"/ch_bidam_old.png",
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
			camera: 'high three-quarter from the moon-stage radiance view',
			stills: STILLS
		},
		null,
		'\t'
	) + '\n'
);
