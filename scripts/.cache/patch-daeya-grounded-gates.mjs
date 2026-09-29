import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const STORY = 'src/lib/data/story.json';
const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const TEMP = 'static/temp';

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findSlot(id) {
	for (const ch of story) {
		for (const en of ch.entries ?? []) {
			const im = (en.images ?? []).find((x) => x.id === id);
			if (im) return im;
		}
	}
	throw new Error(`missing slot ${id}`);
}

function sipsJpeg(srcId, destId) {
	const src = path.join(ASSETS, `${srcId}.png`);
	if (!fs.existsSync(src)) throw new Error(`missing ${src}`);
	const dest = path.join(TEMP, `${destId}.jpg`);
	execFileSync(
		'sips',
		['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '1200', src, '--out', dest],
		{ stdio: 'ignore' }
	);
	fs.rmSync(src);
	return `/temp/${destId}.jpg`;
}

const updates = [
	{
		id: 'gumil-granary-burn',
		dest: 'gumil-granary-burn-v2',
		alt: 'Night Daeya yard: a real timber granary on posts burns through its grain-door; tiny yellow-sleeve Gumil with a torch',
		prompt:
			'Minimal iconic 16:9 poster. Gumil burns the Daeya granary. ONE device: fire as a hard orange column through the open door of a REAL Korean timber granary — raised storehouse, plank walls, giwa roof, not a monolith. Tiny yellow-sleeve figure, torch, lower third. Face suggestion of the attached portrait. PLACE: Daeya inner yard, stone crenelated wall, packed earth, moon-haze. #6b7f9e and fire #c9932a. Movie frame of this actual scene. No army. No brutalist slab. No text. No watermark.'
	},
	{
		id: 'mochuk-open-gates',
		dest: 'mochuk-open-gates-v2',
		alt: 'Night Daeya seongmun: stone wall, giwa munru, iron-studded timber leaf swinging; tiny yellow-sleeve Mochuk at the bar',
		prompt:
			'Minimal iconic 16:9 poster. Mochuk opens Daeya’s main gate. ONE device: one iron-studded timber door-leaf as a hard vertical split. REAL Korean seongmun — stone blocks, crenellations, curved giwa pavilion, packed-earth yard. Tiny yellow-sleeve figure. Moon-haze. #7d8a99; yellow sleeve the accent. Movie frame of this actual scene. No brutalist slab. No army. No text. No watermark.'
	},
	{
		id: 'yunchung-daeya-assault',
		dest: 'yunchung-daeya-assault-v2',
		alt: 'Night assault: fire-light as an orange wedge through Daeya’s real open seongmun — stone, giwa pavilion, timber doors',
		prompt:
			'Minimal iconic 16:9 poster. Yunchung’s night assault on Daeya. ONE device: fire-light as a hard orange wedge through the REAL open Korean gate — stone wall, giwa munru, iron-studded doors. Tiny figures on wet earth. Moon-haze. #c9932a. Movie frame of this actual scene. No magic beam. No army catalog. No text. No watermark.'
	}
];

for (const item of updates) {
	const slot = findSlot(item.id);
	const old = slot.tempImage;
	slot.tempImage = sipsJpeg(item.id, item.dest);
	slot.alt = item.alt;
	slot.prompt = item.prompt;
	if (old && old !== slot.tempImage) {
		const p = path.join('static', old.replace(/^\//, ''));
		if (fs.existsSync(p)) fs.rmSync(p);
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
console.log(updates.map((u) => u.dest).join(', '));
