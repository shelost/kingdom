import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const bridge = {
	id: 'bh-ghost-bridge',
	ratio: 2,
	time: 'night',
	alt: 'A low granite bridge at night. A fox, a red mask, an old face and a woman peek from the stones, the ditch and the pine, while a young man in cream and blue walks the span.',
	people: ['yongsu', 'gildal', 'gwija_redmask', 'gwija_elder', 'gwija_mother']
};

const chariot = {
	id: 'haemosu-sun-chariot',
	ratio: 2,
	time: 'day',
	alt: 'Five dragons, jade, azure, crimson, gold and white, draw a gold chariot across the face of the sun. Haemosu stands in it, laughing, and looks down.',
	people: ['haemosu']
};

let n = 0;
for (const ch of story) {
	for (const en of ch.entries ?? []) {
		if (en.title === 'Bihyung' && en.subtitle === '비형랑') {
			en.thumbnail = bridge.id;
			en.images = en.images ?? [];
			if (!en.images.some((im) => im.id === bridge.id)) en.images.unshift(bridge);
			n++;
		}
		if (en.title === 'Haemosu' && en.subtitle === '해모수') {
			en.thumbnail = chariot.id;
			en.images = en.images ?? [];
			if (!en.images.some((im) => im.id === chariot.id)) en.images.unshift(chariot);
			n++;
		}
	}
}

if (n !== 2) {
	console.error(`expected 2 entries, touched ${n}`);
	process.exit(1);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('slots in, thumbnails pointed');
