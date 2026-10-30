import { existsSync, readFileSync } from 'fs';

const people = readFileSync('src/lib/people.ts', 'utf8');
const places = readFileSync('src/lib/places.ts', 'utf8');
const story = JSON.parse(readFileSync('src/lib/data/story.json', 'utf8'));

const needPeople = [
	"id: 'ogan'",
	"id: 'maryeo'",
	"id: 'tenattendants'",
	"id: 'nineheadmen'",
	"id: 'fivechieftains'",
	"name: 'The Six Elders'",
	"name: 'Bihyungnang'"
];
const needPlaces = [
	"id: 'nakrang'",
	"id: 'okjeo'",
	"id: 'sound_kingdom'",
	"id: 'siljik'",
	"id: 'apdok'",
	"id: 'dongye'",
	"id: 'usan'",
	"name: 'Pine Kingdom'",
	"name: 'Sound Kingdom'",
	"name: 'Straight Vale'",
	"name: 'Held Watch'",
	"name: 'Wet Fields'"
];

for (const s of needPeople) {
	if (!people.includes(s)) console.error('missing people', s);
}
for (const s of needPlaces) {
	if (!places.includes(s)) console.error('missing places', s);
}

const titles = story.flatMap((c) => c.entries.map((e) => e.title));
for (const t of ['Bihyungnang', 'Kim Yongsu']) {
	if (!titles.includes(t)) console.error('missing story title', t);
}
if (titles.includes('Bihyung') || titles.includes('Yongsu')) console.error('old titles still present');

const ids = ['grp_foundingsix.jpg', 'grp_tenattendants.jpg', 'grp_nineheadmen.jpg', 'grp_fivechieftains.jpg'];
for (const f of ids) {
	if (!existsSync('static/' + f)) console.error('missing art', f);
}

console.log('ok', titles.includes('Bihyungnang'), titles.includes('Kim Yongsu'));
