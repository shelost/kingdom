// In Yongsu, each legend still plays first and its exact-layout reality twin right after it.
// The legend stills in Bihyung carry their twin in the corner; the funeral plays in both books.
import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const entries = story.flatMap((c) => c.entries);
const bh = entries.find((e) => e.title === 'Bihyung');
const ys = entries.find((e) => e.title === 'Yongsu');
const byId = (list, id) => list.find((m) => m.id === id);

// [legend still in Bihyung, anchor in Yongsu, reality twin in Yongsu]
const pairs = [
	['bh-tenth-night', 'On the tenth night nobody knocks.', 'ys-tenth-night-empty'],
	['bh-seven-days-cloud', 'So the lane gets its story', 'ys-no-cloud'],
	['bh-river-bridle', 'He comes at dusk in a groom’s borrowed coat', 'ys-hut-summons'],
	['bh-myth-reeds', 'He goes back through the culvert before the temple bell.', 'ys-reeds-real'],
	['bh-myth-spirit-market', 'The song will say he showed her a world of ghosts', 'ys-chunmyung-children'],
	['bh-myth-roof-lamps', 'The song will say he showed her a world of ghosts', 'ys-roof-lamps-real']
];

for (const [mythId, at, twinId] of pairs) {
	const myth = byId(bh.images, mythId);
	const twin = byId(ys.images, twinId);
	if (!myth || !twin) throw new Error('missing ' + (myth ? twinId : mythId));
	// drop any earlier copy of the legend still (e.g. km-m-*), then place legend → twin together
	ys.images = ys.images.filter((m) => m.tempImage !== myth.tempImage && m !== twin);
	const copy = { ...structuredClone(myth), id: 'ys-m-' + mythId.replace(/^bh-/, ''), at, alt: 'As the song tells it: ' + myth.alt.replace(/^(Legend|Myth):\s*/, '') };
	delete copy.inset;
	ys.images.push(copy, { ...twin, at });
	myth.inset = twin.tempImage;
}

// the funeral plays in the song too
const funeral = byId(ys.images, 'ys-jinheung-funeral');
bh.images = bh.images.filter((m) => m.id !== 'bh-jinheung-funeral');
bh.images.push({ ...structuredClone(funeral), id: 'bh-jinheung-funeral' });

fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
console.log('Yongsu images', ys.images.length, '· Bihyung images', bh.images.length);
