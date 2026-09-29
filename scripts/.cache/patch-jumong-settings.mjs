/**
 * Empty comic setting plates — night sky, well, forest, Buyeo, Jolbon.
 * node scripts/.cache/patch-jumong-settings.mjs
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

function bury(needle, htmlAdd, koAdd) {
	const i = findHtml(needle);
	if (i < 0) throw new Error(`missing html: ${needle}`);
	if (j.blocks[i].html.includes(htmlAdd.replace(/<\/?b>/g, ''))) return;
	j.blocks[i].html = j.blocks[i].html.replace(/\s*$/, ` ${htmlAdd}`);
	j.blocks[i].ko = j.blocks[i].ko.replace(/\s*$/, ` ${koAdd}`);
}

bury(
	'The Buyeo yard is a timber country',
	'<b>The Buyeo night is a sky.</b>',
	'<b>부여의 밤은 하늘이다.</b>'
);
bury(
	'The well is an accident she timed',
	'<b>The well holds the night.</b>',
	'<b>우물이 밤을 잡고 있다.</b>'
);
bury(
	'The Jolbon hall is a timber country',
	'<b>Jolbon roofs keep the stars.</b>',
	'<b>졸본 지붕이 별을 붙잡는다.</b>'
);

const slots = [
	{
		id: 'jumong-set-buyeo-night-sky',
		ratio: 1.778,
		nsfw: false,
		tone: '#1a2233',
		at: 'The Buyeo night is a sky',
		alt: 'Bird’s-eye night: empty Buyeo packed-earth yard, grey-giwa hall as a dark bar, palisade, star field, one moon',
		refs: ['/pl_buyeo_yard.png'],
		people: [],
		prompt: 'Empty Buyeo night sky. LOCK pl_buyeo_yard. No people.'
	},
	{
		id: 'jumong-set-buyeo-worm-eaves',
		ratio: 1.778,
		nsfw: false,
		tone: '#a89a72',
		at: 'The Buyeo yard is a timber country',
		alt: 'Worm’s-eye: grey-giwa eaves of the Buyeo hall against a crushed-black night sky, palisade teeth',
		refs: ['/pl_buyeo_yard.png'],
		people: [],
		prompt: 'Worm’s-eye Buyeo eaves vs night. LOCK pl_buyeo_yard. No people.'
	},
	{
		id: 'jumong-set-buyeo-stake-moon',
		ratio: 1.778,
		nsfw: false,
		tone: '#a89a72',
		at: 'The packed-earth yard tilts',
		alt: 'Dutch empty Buyeo yard: one mark-stake, moon as a hard plane, hall a distant dark bar',
		refs: ['/pl_buyeo_yard.png'],
		people: [],
		prompt: 'Empty stake + moon. LOCK pl_buyeo_yard. No people.'
	},
	{
		id: 'jumong-set-buyeo-river-night',
		ratio: 1.778,
		nsfw: false,
		tone: '#1a2233',
		at: 'The river-edge is a real bank',
		alt: 'Night river-edge: water in the foreground, Buyeo hall a distant dark bar beyond the palisade, stars',
		refs: ['/pl_buyeo_yard.png'],
		people: [],
		prompt: 'Night river, hall distant. LOCK pl_buyeo_yard. No people.'
	},
	{
		id: 'jumong-set-well-empty-night',
		ratio: 1.778,
		nsfw: false,
		tone: '#1a2233',
		at: 'The well holds the night',
		alt: 'Empty Jolbon well at night: round granite rim, timber beam, two buckets, grey-giwa hall, moon',
		refs: [],
		people: [],
		prompt: 'Empty Jolbon well night. Same rim beam buckets. No people.'
	},
	{
		id: 'jumong-set-well-worm-sky',
		ratio: 1.778,
		nsfw: false,
		tone: '#1a2233',
		at: 'The well holds the night',
		alt: 'Worm’s-eye from packed earth: granite well-rim and timber beam cutting a star field',
		refs: [],
		people: [],
		prompt: 'Worm’s-eye well-rim into stars. No people. Nobody in the shaft.'
	},
	{
		id: 'jumong-set-well-dutch-empty',
		ratio: 1.778,
		nsfw: false,
		tone: '#a97c4a',
		at: 'The well is an accident she timed',
		alt: 'Dutch empty well-yard: granite rim lower-third, grey-giwa hall as a dark bar, two buckets',
		refs: [],
		people: [],
		prompt: 'Dutch empty Jolbon well. Hall as dark bar. No people.'
	},
	{
		id: 'jumong-set-jolbon-empty-night',
		ratio: 1.778,
		nsfw: false,
		tone: '#1a2233',
		at: 'The Jolbon hall is a timber country',
		alt: 'Empty Jolbon night porch: grey-giwa eaves, one lamp-plane in the doorway, packed earth, no one',
		refs: [],
		people: [],
		prompt: 'Empty Jolbon porch night. Lamp in doorway. No people.'
	},
	{
		id: 'jumong-set-jolbon-roofs-stars',
		ratio: 1.778,
		nsfw: false,
		tone: '#1a2233',
		at: 'Jolbon roofs keep the stars',
		alt: 'Bird’s-eye night: Jolbon grey-giwa roofs as dark bars under a star field, packed-earth yard empty',
		refs: [],
		people: [],
		prompt: 'Bird’s-eye Jolbon roofs vs stars. No people.'
	},
	{
		id: 'jumong-set-jolbon-yard-moon',
		ratio: 1.778,
		nsfw: false,
		tone: '#1a2233',
		at: 'The hall is only torches',
		alt: 'Empty Jolbon packed-earth yard at moon, grey-giwa hall as a dark wedge, no figures',
		refs: [],
		people: [],
		prompt: 'Empty Jolbon yard moon. Hall as wedge. No people.'
	},
	{
		id: 'jumong-set-forest-empty',
		ratio: 1.778,
		nsfw: false,
		tone: '#1a2233',
		at: 'The pines are a net from above',
		alt: 'Aerial empty pine net: tall trunks as columns, dirt path, no runner',
		refs: [],
		people: [],
		prompt: 'Aerial pine net EMPTY. No red figure. No people.'
	},
	{
		id: 'jumong-set-forest-night-stars',
		ratio: 1.778,
		nsfw: false,
		tone: '#1a2233',
		at: 'The forest is a closing net',
		alt: 'Worm’s-eye pine trunks as columns cutting a star field, forest floor crushed black',
		refs: [],
		people: [],
		prompt: 'Worm’s-eye pines vs stars. Empty forest. No people.'
	},
	{
		id: 'jumong-set-forest-path-dutch',
		ratio: 1.778,
		nsfw: false,
		tone: '#1a2233',
		at: 'The pines are a net from above',
		alt: 'Dutch empty pine path: trunks as a closing net, one moonlight stamp on dirt',
		refs: [],
		people: [],
		prompt: 'Dutch empty pine path. No runner. No people.'
	},
	{
		id: 'jumong-set-pine-empty',
		ratio: 1.778,
		nsfw: false,
		tone: '#a97c4a',
		at: 'The pine is a hundred paces',
		alt: 'Empty Jolbon pine-yard dusk: one pine, grey-giwa hall corner, packed earth, no bodies',
		refs: [],
		people: [],
		prompt: 'Empty pine + giwa. No people.'
	}
];

for (const s of slots) ensureImage(s);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

let seq = fs.readFileSync(SEQ, 'utf8');

function insertAfter(anchorId, lines) {
	const needle = `{ id: '${anchorId}'`;
	const i = seq.indexOf(needle);
	if (i < 0) throw new Error(`seq missing ${anchorId}`);
	const end = seq.indexOf('\n', seq.indexOf('}', i));
	if (seq.includes(`id: '${lines[0].match(/id: '([^']+)'/)[1]}'`)) return;
	seq = seq.slice(0, end + 1) + lines.map((l) => `\n\t\t\t${l}`).join('') + seq.slice(end + 1);
}

insertAfter('jumong-seq-buyeo-wide', [
	"{ id: 'jumong-set-buyeo-night-sky', role: 'night sky', angle: 'bird’s-eye stars', at: 'The Buyeo night is a sky' },",
	"{ id: 'jumong-set-buyeo-worm-eaves', role: 'eaves vs sky', angle: 'worm’s-eye giwa', at: 'The Buyeo yard is a timber country' },",
	"{ id: 'jumong-set-buyeo-stake-moon', role: 'empty stake', angle: 'dutch moon', at: 'The packed-earth yard tilts' },"
]);
insertAfter('buyeo-seq-river-edge', [
	"{ id: 'jumong-set-buyeo-river-night', role: 'river night', angle: 'bank night', at: 'The river-edge is a real bank' },"
]);
insertAfter('jumong-seq-forest-wide', [
	"{ id: 'jumong-set-forest-empty', role: 'empty net', angle: 'aerial empty', at: 'The pines are a net from above' },",
	"{ id: 'jumong-set-forest-night-stars', role: 'pines vs stars', angle: 'worm’s-eye trunks', at: 'The forest is a closing net' },",
	"{ id: 'jumong-set-forest-path-dutch', role: 'empty path', angle: 'dutch path', at: 'The pines are a net from above' },"
]);
insertAfter('jumong-seq-jolbon-wide', [
	"{ id: 'jumong-set-jolbon-empty-night', role: 'empty porch', angle: 'dutch night porch', at: 'The Jolbon hall is a timber country' },",
	"{ id: 'jumong-set-jolbon-roofs-stars', role: 'roofs vs stars', angle: 'bird’s-eye night', at: 'Jolbon roofs keep the stars' },",
	"{ id: 'jumong-set-jolbon-yard-moon', role: 'empty moon yard', angle: 'dutch moon', at: 'The hall is only torches' },"
]);
insertAfter('jumong-seq-well-wide', [
	"{ id: 'jumong-set-well-empty-night', role: 'empty well night', angle: 'wide night', at: 'The well holds the night' },",
	"{ id: 'jumong-set-well-worm-sky', role: 'rim vs stars', angle: 'worm’s-eye rim', at: 'The well holds the night' },",
	"{ id: 'jumong-set-well-dutch-empty', role: 'empty well dutch', angle: 'dutch empty', at: 'The well is an accident she timed' },"
]);
insertAfter('jumong-seq-pine-wide', [
	"{ id: 'jumong-set-pine-empty', role: 'empty pine', angle: 'worm’s-eye empty', at: 'The pine is a hundred paces' },"
]);

fs.writeFileSync(SEQ, seq);
console.log('patched', slots.length, 'setting plates');
