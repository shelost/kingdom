import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const PEOPLE = 'src/lib/data/image-people.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const imagePeople = JSON.parse(fs.readFileSync(PEOPLE, 'utf8'));

const EMPTY = new Set([
	'nsfw-samsin-jeongja-yumla',
	'seohyeon-pool-back',
	'golhwa-lean-firstkim',
	'narim-steam-seohyeon',
	'yushin-pool-back',
	'golhwa-inspect-yushin',
	'narim-kiss-yushin',
	'hyulle-watch-yushin',
	'yushin-return-pool'
]);

const FIRST_KIM_AT = {
	'seohyeon-cavern-wide': 'The robe falls',
	'seohyeon-robe-falls': 'The robe falls',
	'seohyeon-naked-enter': 'The robe falls',
	'goddesses-heart-stare': 'They have never seen a Kim',
	'golhwa-drool-hearts': 'They have never seen a Kim',
	'hyulle-shy-hearts': 'They have never seen a Kim',
	'narim-hunger-hearts': 'They have never seen a Kim',
	'seohyeon-their-gaze': 'They have never seen a Kim'
};

let removed = 0;
for (const ch of story) {
	for (const en of ch.entries ?? []) {
		const before = en.images?.length ?? 0;
		en.images = (en.images ?? []).filter((im) => !EMPTY.has(im.id));
		removed += before - en.images.length;
		for (const im of en.images) {
			if (FIRST_KIM_AT[im.id]) im.at = FIRST_KIM_AT[im.id];
		}
	}
}

for (const id of EMPTY) delete imagePeople[id];

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
fs.writeFileSync(PEOPLE, JSON.stringify(imagePeople, null, '\t') + '\n');
console.log(`removed ${removed} empty slots; retargeted First Kim ats`);
