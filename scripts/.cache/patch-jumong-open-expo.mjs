/**
 * First-act empty exposition — Amnok sky, shallows, copper, mist, Buyeo approach.
 * node scripts/.cache/patch-jumong-open-expo.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const SEQ = path.join(ROOT, 'src/lib/movieSequences.ts');

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const j = story[4].entries[5];
if (j.title !== 'Jumong') throw new Error(j.title);

function ensureImage(slot) {
	const i = j.images.findIndex((im) => im.id === slot.id);
	if (i < 0) j.images.push(slot);
	else Object.assign(j.images[i], slot);
}

function findHtml(s) {
	return j.blocks.findIndex((b) => typeof b.html === 'string' && b.html.includes(s));
}

{
	const i = findHtml('Then the Amnok flashes under the wheel');
	if (i >= 0 && !j.blocks[i].html.includes('<b>Then the Amnok flashes')) {
		j.blocks[i].html = j.blocks[i].html.replace(
			'Then the Amnok flashes under the wheel',
			'<b>Then the Amnok flashes under the wheel</b>'
		);
		j.blocks[i].ko = j.blocks[i].ko.replace('그러다 바퀴 아래 압록이 번쩍인다', '<b>그러다 바퀴 아래 압록이 번쩍인다</b>');
	}
}

function bury(needle, htmlAdd, koAdd) {
	const i = findHtml(needle);
	if (i < 0) throw new Error(`missing html: ${needle}`);
	const bare = htmlAdd.replace(/<\/?b>/g, '');
	if (j.blocks[i].html.includes(bare)) return;
	j.blocks[i].html = `${j.blocks[i].html} ${htmlAdd}`;
	j.blocks[i].ko = `${j.blocks[i].ko} ${koAdd}`;
}

bury('Usual run: five dragons', '<b>The sky is empty first.</b>', '<b>하늘이 먼저 비어 있다.</b>');
bury('Dusk on the Amnok is a low gold bar', '<b>The Amnok is empty water first.</b>', '<b>압록은 먼저 빈 물이다.</b>');
bury('The copper room rises on the bank like a kiln', '<b>The copper stands empty.</b>', '<b>구리는 빈 채로 선다.</b>');
bury('The Amnok keeps its own court', '<b>Mist is the dais.</b>', '<b>안개가 대다리다.</b>');
bury('The river-capital opens', '<b>The capital is a palisade from the river.</b>', '<b>수도는 강에서 보면 목책이다.</b>');
bury('The hatch-room opens onto the yard', '<b>The hatch-room is empty timber.</b>', '<b>부화방은 빈 나무다.</b>');

const slots = [
	{
		id: 'jumong-set-sky-noon-empty',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'The sky is empty first',
		alt: 'Wide noon sky: tiny gold five-dragon wheeled chariot as a stamp; Amnok a thin river far below; no close faces',
		refs: ['/pl_white_river.png'],
		people: [],
		prompt: 'Empty noon sky. Tiny locked chariot stamp. River far below. Zero close people.'
	},
	{
		id: 'jumong-set-amnok-dusk-empty',
		ratio: 1.778,
		nsfw: false,
		tone: '#8fc4e0',
		at: 'The Amnok is empty water first',
		alt: 'Empty Amnok dusk: real river shallows, wet stones, reeds, one gold bar on the water, no bathers',
		refs: ['/pl_white_river.png'],
		people: [],
		prompt: 'Empty Amnok dusk. Gold bar on water. Real shallows. No people. No palace pond.'
	},
	{
		id: 'jumong-set-amnok-shallows-stones',
		ratio: 1.778,
		nsfw: false,
		tone: '#8fc4e0',
		at: 'The Amnok is empty water first',
		alt: 'Worm’s-eye wet Amnok stones in the foreground; empty shallows; dusk sky; no bodies',
		refs: ['/pl_white_river.png'],
		people: [],
		prompt: 'Worm’s-eye wet stones. Empty shallows. No people.'
	},
	{
		id: 'jumong-set-amnok-silk-rocks',
		ratio: 1.778,
		nsfw: false,
		tone: '#8fc4e0',
		at: 'Hwahye and Wihye leave their silk on the rocks',
		alt: 'Empty Amnok bank: two silk heaps on wet rocks, empty water, no faces',
		refs: ['/pl_white_river.png'],
		people: [],
		prompt: 'Silk on rocks only. Empty water. No faces.'
	},
	{
		id: 'jumong-set-chariot-lookdown-empty',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'Then the Amnok flashes under the wheel',
		alt: 'From the chariot: gold rail and wheel rim in foreground; empty Amnok ribbon far below',
		refs: ['/pl_white_river.png'],
		people: [],
		prompt: 'Look-down from locked chariot. Empty river ribbon. No bathers.'
	},
	{
		id: 'jumong-set-copper-empty-wide',
		ratio: 1.778,
		nsfw: false,
		tone: '#c45a2a',
		at: 'The copper stands empty',
		alt: 'Empty copper kiln on the Amnok bank; tiny chariot in sky; no people',
		refs: ['/pl_white_river.png'],
		people: [],
		prompt: 'Empty copper kiln on bank. Tiny chariot. No people.'
	},
	{
		id: 'jumong-set-copper-door-empty',
		ratio: 1.778,
		nsfw: false,
		tone: '#c45a2a',
		at: 'The copper stands empty',
		alt: 'Worm’s-eye empty copper doorway: gold light-plane inside, bank and water behind, no bodies',
		refs: [],
		people: [],
		prompt: 'Empty copper doorway. Gold plane inside. No people.'
	},
	{
		id: 'jumong-set-habek-mist-empty',
		ratio: 1.778,
		nsfw: false,
		tone: '#3E79E4',
		at: 'Mist is the dais',
		alt: 'Bird’s-eye empty Habek mist-court: wet stone spit, mist as a plane, copper kiln stamp, no figures',
		refs: ['/pl_white_river.png'],
		people: [],
		prompt: 'Empty mist-court. Wet stones. Copper stamp. No people.'
	},
	{
		id: 'jumong-set-buyeo-approach',
		ratio: 1.778,
		nsfw: false,
		tone: '#a89a72',
		at: 'The capital is a palisade from the river',
		alt: 'Far bird’s-eye: thin river, Buyeo palisade and grey-giwa hall as a dark stamp, empty approach',
		refs: ['/pl_buyeo_yard.png'],
		people: [],
		prompt: 'Far approach: river + palisade capital. Empty. LOCK pl_buyeo_yard.'
	},
	{
		id: 'jumong-set-hatch-door-empty',
		ratio: 1.778,
		nsfw: false,
		tone: '#8fc4e0',
		at: 'The hatch-room is empty timber',
		alt: 'Empty Buyeo hatch-room: timber floor, doorway onto packed-earth yard and grey-giwa hall, no people',
		refs: ['/pl_buyeo_yard.png'],
		people: [],
		prompt: 'Empty hatch-room. Door onto yard. LOCK pl_buyeo_yard. No people.'
	},
	{
		id: 'jumong-set-egg-field-empty',
		ratio: 1.778,
		nsfw: false,
		tone: '#a89a72',
		at: 'Yuhwa lays a great egg',
		alt: 'Empty Buyeo dusk field outside the palisade: packed earth, grey-giwa hall peeking, no egg yet',
		refs: ['/pl_buyeo_yard.png'],
		people: [],
		prompt: 'Empty Buyeo field dusk. Hall peek. No people. No giant egg yet.'
	},
	{
		id: 'jumong-set-gate-empty',
		ratio: 1.778,
		nsfw: false,
		tone: '#a89a72',
		at: 'Iron-boss doors keep the river',
		alt: 'Empty outside Buyeo palisade: iron-boss timber doors, grey-giwa peeking, no guards',
		refs: ['/pl_buyeo_yard.png'],
		people: [],
		prompt: 'Empty palisade doors. No guards. LOCK pl_buyeo_yard.'
	}
];

for (const s of slots) ensureImage(s);
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

let seq = fs.readFileSync(SEQ, 'utf8');

function insertShots(afterLine, shots) {
	const already = shots.some((s) => seq.includes(`id: '${s.id}'`));
	if (already) return;
	const block = shots
		.map(
			(s) =>
				`\t\t\t{ id: '${s.id}', role: '${s.role}', angle: '${s.angle}', at: '${s.at}' },\n`
		)
		.join('');
	if (!seq.includes(afterLine)) throw new Error(`missing seq line:\n${afterLine}`);
	seq = seq.replace(afterLine, `${afterLine}\n${block.replace(/\n$/, '')}`);
}

insertShots(
	`\t\tshots: [\n\t\t\t{ id: 'haemosu-chariot-usual-run', role: 'usual sun-run', angle: 'wide sky dutch', at: 'Usual run: five dragons across the noon sky' },`,
	[
		{ id: 'jumong-set-sky-noon-empty', role: 'empty sky', angle: 'wide noon', at: 'The sky is empty first' },
		{ id: 'jumong-set-amnok-dusk-empty', role: 'empty dusk river', angle: 'wide dusk', at: 'The Amnok is empty water first' },
		{ id: 'jumong-set-amnok-shallows-stones', role: 'wet stones', angle: 'worm’s-eye bank', at: 'The Amnok is empty water first' },
		{ id: 'jumong-set-chariot-lookdown-empty', role: 'empty look-down', angle: 'from the rail', at: 'Then the Amnok flashes under the wheel' },
		{ id: 'jumong-set-amnok-silk-rocks', role: 'silk on rocks', angle: 'dutch bank', at: 'Hwahye and Wihye leave their silk on the rocks' }
	]
);

insertShots(
	`\t\t\t{ id: 'haemosu-copper-room', role: 'copper', angle: 'bank hut', at: 'He comes down. He builds a copper room' },`,
	[
		{ id: 'jumong-set-copper-empty-wide', role: 'empty kiln', angle: 'wide bank', at: 'The copper stands empty' },
		{ id: 'jumong-set-copper-door-empty', role: 'empty door', angle: 'worm’s-eye door', at: 'The copper stands empty' }
	]
);

insertShots(
	`\t\t\t{ id: 'habek-court-wide', role: 'river court', angle: 'bird’s-eye bank', at: 'The Amnok keeps its own court' },`,
	[{ id: 'jumong-set-habek-mist-empty', role: 'empty mist', angle: 'bird’s-eye mist', at: 'Mist is the dais' }]
);

insertShots(
	`\t\t\t{ id: 'yuhwa-amnok-dusk-expo', role: 'exposition dusk', angle: 'bird’s-eye wide', at: 'Dusk on the Amnok is a low gold bar' },`,
	[
		{ id: 'jumong-set-amnok-dusk-empty', role: 'empty dusk first', angle: 'wide dusk', at: 'The Amnok is empty water first' },
		{ id: 'jumong-set-sky-noon-empty', role: 'sky first', angle: 'wide noon', at: 'The sky is empty first' }
	]
);

insertShots(
	`\t\t\t{ id: 'yuhwa-copper-room-rise', role: 'copper kiln', angle: 'worm’s-eye bank', at: 'The copper room rises on the bank like a kiln' },`,
	[
		{ id: 'jumong-set-copper-empty-wide', role: 'empty kiln', angle: 'wide bank', at: 'The copper stands empty' },
		{ id: 'jumong-set-copper-door-empty', role: 'empty door', angle: 'worm’s-eye door', at: 'The copper stands empty' }
	]
);

insertShots(
	`\t\t\t{ id: 'buyeo-seq-capital-wide', role: 'exposition', angle: 'bird’s-eye river-capital', at: 'The river-capital opens' },`,
	[
		{ id: 'jumong-set-buyeo-approach', role: 'approach', angle: 'far bird’s-eye', at: 'The capital is a palisade from the river' },
		{ id: 'jumong-set-gate-empty', role: 'empty doors', angle: 'outside palisade', at: 'Iron-boss doors keep the river' }
	]
);

insertShots(
	`\t\t\t{ id: 'buyeo-seq-hatch-room-wide', role: 'hatch geography', angle: 'wide room+yard door', at: 'The hatch-room opens onto the yard' },`,
	[{ id: 'jumong-set-hatch-door-empty', role: 'empty hatch', angle: 'door onto yard', at: 'The hatch-room is empty timber' }]
);

insertShots(
	`\t\t\t{ id: 'egg-ordeal-sty', role: 'sty refuses', angle: 'iconic stamp', at: 'Dogs and pigs will not eat it' },`,
	[{ id: 'jumong-set-egg-field-empty', role: 'empty field', angle: 'dusk field', at: 'Yuhwa lays a great egg' }]
);

fs.writeFileSync(SEQ, seq);
console.log('patched', slots.length, 'open expo plates');
