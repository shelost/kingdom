// One-shot: strip remaining Maehwa-story NSFW slots (Gumil + Daeya entries).
import fs from 'node:fs';
const f = 'src/lib/data/story.json';
const s = JSON.parse(fs.readFileSync(f, 'utf8'));
const ch = s.find((c) => c.id === 'iron-will');
const removedIds = [];
const removedTemps = new Set();
for (const tt of ['Gumil', 'Siege of Daeya']) {
	const e = ch.entries.find((x) => x.title === tt);
	const cut = e.images.filter((im) => im.nsfw);
	e.images = e.images.filter((im) => !im.nsfw);
	for (const im of cut) {
		removedIds.push(im.id);
		if (im.tempImage) removedTemps.add(im.tempImage);
	}
	console.log(tt, 'cut:', cut.length, 'kept:', e.images.length);
}
fs.writeFileSync(f, JSON.stringify(s, null, '\t') + '\n');
fs.writeFileSync('/tmp/maehwa-temps-2.json', JSON.stringify({ ids: removedIds, temps: [...removedTemps] }));
console.log('total ids:', removedIds.length, 'temps:', removedTemps.size);
