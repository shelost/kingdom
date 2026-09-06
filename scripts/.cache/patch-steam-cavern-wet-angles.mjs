import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function entries() {
	const out = [];
	for (const ch of story) for (const en of ch.entries ?? []) out.push(en);
	return out;
}

function byId(images, id) {
	const im = images.find((x) => x.id === id);
	if (!im) throw new Error(`missing slot ${id}`);
	return im;
}

const cave = '/pl_cave.png';
const yu = '/ch_kim_yushin.png';
const ch = '/ch_chunchu.png';
const n = '/ch_narim.png';
const g = '/ch_golhwa.png';
const h = '/ch_hyullé.png';

const daeya = entries().find((e) => e.title === 'Daeya Fortress');
if (!daeya) throw new Error('missing Daeya Fortress');
const yushinEntry = entries().find((e) => e.title === 'Kim Yushin');
if (!yushinEntry) throw new Error('missing Kim Yushin');

const slots = {
	steam_01: { entry: daeya, refs: [yu, cave] },
	steam_03: { entry: daeya, nsfw: true, refs: [yu, n, cave] },
	steam_04: { entry: daeya, nsfw: true, refs: [yu, n, g, h, cave] },
	'yushin-lake-goddess-lust': { entry: daeya, nsfw: true, refs: [yu, n, cave] },
	best_of_both_02: { entry: daeya, nsfw: true, refs: [yu, n, g, h, cave] },
	best_of_both_03: { entry: daeya, nsfw: true, refs: [yu, n, g, h, cave] },
	marshal_steam_02: { entry: daeya, nsfw: true, refs: [ch, n, g, h, cave] },
	marshal_steam_03: { entry: daeya, nsfw: true, refs: [ch, n, cave] },
	steam_again_02: { entry: daeya, nsfw: true, refs: [yu, n, h, cave] },
	steam_again_03: { entry: daeya, nsfw: true, refs: [yu, cave] },
	steam_05: { entry: yushinEntry, nsfw: true, refs: [yu, n, g, h, cave] }
};

for (const [id, spec] of Object.entries(slots)) {
	const im = byId(spec.entry.images, id);
	delete im.src;
	im.refs = spec.refs;
	if (spec.nsfw) im.nsfw = true;
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched refs', Object.keys(slots).join(', '));
