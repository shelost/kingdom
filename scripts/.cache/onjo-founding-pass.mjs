// Onjo joins The Fall of Euija (after Nine Omens); founding myths get their own TOC kind;
// the old Commander Yeon stills stop tagging Gyebek in the image-people sidecar.
import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';
const PEOPLE = 'src/lib/data/image-people.json';
const BACKUP = 'scripts/.cache/prev-stills/story.pre-onjo-move.json';
if (!fs.existsSync(BACKUP)) fs.copyFileSync(FILE, BACKUP);
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const onjoChapter = story.findIndex((c) => c.id === 'onjo');
if (onjoChapter >= 0) {
	const [chapter] = story.splice(onjoChapter, 1);
	const fall = story.find((c) => c.id === 'fall-of-euija');
	const at = fall.entries.findIndex((e) => e.title === 'Nine Omens');
	fall.entries.splice(at + 1, 0, ...chapter.entries);
}

const FOUNDING = {
	'Dangun & Old Joseon': ['founding', 'love'],
	Jolbon: ['founding', 'love'],
	Onjo: ['founding', 'love'],
	Hyukgose: ['founding', 'coronation'],
	Talhae: ['founding'],
	Alji: ['founding'],
	Suro: ['founding', 'love'],
	'Three Princes': ['founding']
};
for (const e of story.flatMap((c) => c.entries)) if (FOUNDING[e.title]) e.kinds = FOUNDING[e.title];

fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');

const people = JSON.parse(fs.readFileSync(PEOPLE, 'utf8'));
for (const id of ['spike-heads', 'nameless-boy', 'battlefield-corpses', 'sunset-rider']) {
	if (people[id]) people[id] = people[id].filter((p) => p !== 'gyebek');
}
fs.writeFileSync(PEOPLE, JSON.stringify(people, null, '\t') + '\n');

console.log(story.map((c) => `${c.id}:${c.entries.length}`).join(' '));
