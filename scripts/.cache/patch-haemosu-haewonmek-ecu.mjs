/**
 * Reaction ECU pack: Haemosu / Haewonmek expression sheet.
 * Does not touch coronation chiefs or confession-floor slots.
 * node scripts/.cache/patch-haemosu-haewonmek-ecu.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const SEQ = path.join(ROOT, 'src/lib/movieSequences.ts');

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const j = story[4].entries[5];
if (j.title !== 'Jumong') throw new Error(`expected Jumong, got ${j.title}`);

function ensureImage(slot) {
	const i = j.images.findIndex((im) => im.id === slot.id);
	if (i < 0) j.images.push(slot);
	else {
		const keep = j.images[i];
		j.images[i] = { ...keep, ...slot, tempImage: keep.tempImage };
	}
}

const RIVER = '/pl_white_river.png';
const CHARIOT = '/obj_haemosu_chariot.png';

const slots = [
	{
		id: 'haemosu-laugh-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'laughs like the job is done',
		alt: 'ECU Haemosu: open-mouth jolly laugh, silver-white hair, gold as a cheek plane',
		refs: ['/ch_haemosu.png', RIVER],
		people: ['haemosu']
	},
	{
		id: 'haemosu-wink-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'Do you really think the sun disappears at night',
		alt: 'ECU Haemosu: one-eye wink, sun-grin, gold cheek plane, night rain bokeh',
		refs: ['/ch_haemosu.png'],
		people: ['haemosu']
	},
	{
		id: 'haemosu-boy-open-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: "That's my boy.",
		alt: 'ECU Haemosu: open-mouth pride, looking off at the far bank, gold as a hard plane',
		refs: ['/ch_haemosu.png'],
		people: ['haemosu']
	},
	{
		id: 'haemosu-whisper-soft-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'Jumong cannot see him',
		alt: 'ECU Haemosu: half-lidded soft whisper, lips parted, gold as a thin cheek plane',
		refs: ['/ch_haemosu.png'],
		people: ['haemosu']
	},
	{
		id: 'haemosu-playful-anger-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'The night is not your domain',
		alt: 'ECU Haemosu: angry-playful contempt, teeth, looking at Haewonmek, gold plane',
		refs: ['/ch_haemosu.png', '/ch_haewonmek.png'],
		people: ['haemosu']
	},
	{
		id: 'haemosu-stunned-rail-ecu',
		ratio: 1.778,
		nsfw: true,
		tone: '#f0b429',
		at: 'Those thighs',
		alt: 'ECU Haemosu at the gold chariot rail: mouth open, blown pupils, stunned look-down',
		refs: ['/ch_haemosu.png', CHARIOT],
		people: ['haemosu']
	},
	{
		id: 'haemosu-tender-back-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'a red speck on the far dark',
		alt: 'ECU Haemosu: tender eyes looking off at Jumong’s back, soft mouth, gold plane',
		refs: ['/ch_haemosu.png'],
		people: ['haemosu']
	},
	{
		id: 'haemosu-feral-want-ecu',
		ratio: 1.778,
		nsfw: true,
		tone: '#f0b429',
		at: 'Those thighs',
		alt: 'ECU Haemosu: feral want at the rail, bitten mouth, flush, gold as a hard plane',
		refs: ['/ch_haemosu.png', CHARIOT],
		people: ['haemosu']
	},
	{
		id: 'haewonmek-cold-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#6b5b6e',
		at: 'Jumong does not see the reaper',
		alt: 'ECU Haewonmek arriving: half-lidded cold eyes over black mouth-band, gat brim a black bar',
		refs: ['/ch_haewonmek.png'],
		people: ['haewonmek']
	},
	{
		id: 'haewonmek-shock-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#6b5b6e',
		at: 'the sun comes in as a body',
		alt: 'ECU Haewonmek mid-strike shock: eyes blown wide, gat knocked, gold flash as a plane',
		refs: ['/ch_haewonmek.png'],
		people: ['haewonmek']
	},
	{
		id: 'haewonmek-pain-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#6b5b6e',
		at: 'A hand closes on Haewonmek’s wrist',
		alt: 'ECU Haewonmek: wince of pain, eyes squeezed, gat askew, wrist caught off-frame',
		refs: ['/ch_haewonmek.png'],
		people: ['haewonmek']
	},
	{
		id: 'haewonmek-disgust-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#6b5b6e',
		at: 'You just robbed a ledger.',
		alt: 'ECU Haewonmek: disgust, eyes narrowed down, mouth-band, gat brim cutting the frame',
		refs: ['/ch_haewonmek.png'],
		people: ['haewonmek']
	},
	{
		id: 'haewonmek-tired-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#6b5b6e',
		at: 'He is still mortal',
		alt: 'ECU Haewonmek: tired lids, gat askew, the look of a clerk who lost the argument',
		refs: ['/ch_haewonmek.png'],
		people: ['haewonmek']
	},
	{
		id: 'haewonmek-almost-smile-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#6b5b6e',
		at: 'a red speck on the far dark',
		alt: 'ECU Haewonmek: eyes crinkle toward a smile, then he shuts it down, watching the run',
		refs: ['/ch_haewonmek.png'],
		people: ['haewonmek']
	},
	{
		id: 'haemosu-haewonmek-ots-laugh',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'laughs like the job is done',
		alt: 'OTS two-shot: Haemosu laughing over Haewonmek’s gat brim; night river bokeh',
		refs: ['/ch_haemosu.png', '/ch_haewonmek.png', RIVER],
		people: ['haemosu', 'haewonmek']
	},
	{
		id: 'jumong-ford-fear-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'Make way for me!',
		alt: 'ECU Jumong at the night ford: clean-shaven, scared grin, red #e8563f, rain',
		refs: ['/ch_jumong.png', RIVER],
		people: ['jumong']
	}
];

for (const slot of slots) ensureImage(slot);

let seq = fs.readFileSync(SEQ, 'utf8');

function insertAfter(needle, insert, guardId) {
	if (seq.includes(`id: '${guardId}'`)) return;
	if (!seq.includes(needle)) throw new Error(`needle missing: ${needle}`);
	seq = seq.replace(needle, `${needle}\n${insert}`);
}

insertAfter(
	"{ id: 'haewonmek-seq-unseen', role: 'unseen dive', angle: 'OTS Jumong', at: 'Jumong does not see the reaper' },",
	"\t\t\t{ id: 'haewonmek-cold-ecu', role: 'cold approach', angle: 'ECU eyes', at: 'Jumong does not see the reaper' },",
	'haewonmek-cold-ecu'
);
insertAfter(
	"{ id: 'haemosu-shaft-knock', role: 'sun knocks', angle: 'dutch mid-flight', at: 'the sun comes in as a body' },",
	"\t\t\t{ id: 'haewonmek-shock-ecu', role: 'mid-strike shock', angle: 'ECU', at: 'the sun comes in as a body' },",
	'haewonmek-shock-ecu'
);
insertAfter(
	"{ id: 'haemosu-wrist-close', role: 'wrist lock', angle: 'close dutch', at: 'A hand closes on Haewonmek’s wrist' },",
	"\t\t\t{ id: 'haewonmek-pain-ecu', role: 'wrist pain', angle: 'ECU wince', at: 'A hand closes on Haewonmek’s wrist' },",
	'haewonmek-pain-ecu'
);
insertAfter(
	"{ id: 'haewonmek-blocked-ecu', role: 'blocked', angle: 'ECU gat askew', at: 'The night is not your domain' },",
	"\t\t\t{ id: 'haemosu-playful-anger-ecu', role: 'playful contempt', angle: 'ECU', at: 'The night is not your domain' },",
	'haemosu-playful-anger-ecu'
);
insertAfter(
	"{ id: 'haemosu-heh-ecu', role: 'heh', angle: 'ECU sun-grin', at: 'Do you really think the sun disappears at night' },",
	"\t\t\t{ id: 'haemosu-wink-ecu', role: 'wink', angle: 'ECU wink', at: 'Do you really think the sun disappears at night' },",
	'haemosu-wink-ecu'
);
insertAfter(
	"{ id: 'haemosu-whisper-ear', role: 'whisper', angle: 'two-shot rain', at: 'Jumong cannot see him' },",
	"\t\t\t{ id: 'haemosu-whisper-soft-ecu', role: 'soft whisper', angle: 'ECU lips', at: 'Jumong cannot see him' },",
	'haemosu-whisper-soft-ecu'
);
insertAfter(
	"{ id: 'jumong-ford-call', role: 'make way', angle: 'dutch shout', at: 'Make way for me!' },",
	"\t\t\t{ id: 'jumong-ford-fear-ecu', role: 'scared grin', angle: 'ECU Jumong', at: 'Make way for me!' },",
	'jumong-ford-fear-ecu'
);
insertAfter(
	"{ id: 'gods-watch-run', role: 'red speck', angle: 'bank two-shot', at: 'a red speck on the far dark' },",
	"\t\t\t{ id: 'haemosu-tender-back-ecu', role: 'tender look-off', angle: 'ECU', at: 'a red speck on the far dark' },\n\t\t\t{ id: 'haewonmek-almost-smile-ecu', role: 'refused smile', angle: 'ECU', at: 'a red speck on the far dark' },",
	'haemosu-tender-back-ecu'
);
insertAfter(
	"{ id: 'haemosu-jolly-haewonmek', role: 'job done', angle: 'two-shot night', at: 'laughs like the job is done' },",
	"\t\t\t{ id: 'haemosu-laugh-ecu', role: 'open laugh', angle: 'ECU', at: 'laughs like the job is done' },\n\t\t\t{ id: 'haemosu-haewonmek-ots-laugh', role: 'OTS laugh', angle: 'OTS two-shot', at: 'laughs like the job is done' },",
	'haemosu-laugh-ecu'
);
insertAfter(
	"{ id: 'haemosu-boy-ecu', role: 'proud', angle: 'ECU grin', at: \"That's my boy.\" },",
	"\t\t\t{ id: 'haemosu-boy-open-ecu', role: 'open-mouth pride', angle: 'ECU', at: \"That's my boy.\" },",
	'haemosu-boy-open-ecu'
);
insertAfter(
	"{ id: 'haewonmek-ledger-ecu', role: 'ledger', angle: 'ECU', at: 'You just robbed a ledger.' },",
	"\t\t\t{ id: 'haewonmek-disgust-ecu', role: 'disgust', angle: 'ECU', at: 'You just robbed a ledger.' },\n\t\t\t{ id: 'haewonmek-tired-ecu', role: 'tired clerk', angle: 'ECU', at: 'He is still mortal' },",
	'haewonmek-disgust-ecu'
);
insertAfter(
	"{ id: 'haemosu-sky-sisters', role: 'looks down', angle: 'from the chariot', at: 'Then he looks down and the hour breaks' },",
	"\t\t\t{ id: 'haemosu-stunned-rail-ecu', role: 'stunned rail', angle: 'ECU rail', at: 'Those thighs' },\n\t\t\t{ id: 'haemosu-feral-want-ecu', role: 'feral want', angle: 'ECU', at: 'Those thighs' },",
	'haemosu-stunned-rail-ecu'
);

fs.writeFileSync(SEQ, seq);
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`patched ${slots.length} ECU slots + sequences`);
