/**
 * Well talk reverse-shots, Sosuno-shadow shudder (no blush),
 * pre-king clean-shaven, missing Jumong-arc links.
 * node scripts/.cache/patch-jumong-talk-shadow.mjs
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

const shudder = j.blocks.findIndex(
	(b) => typeof b.html === 'string' && b.html.includes('A cold shudder up his back')
);
if (shudder < 0) throw new Error('shudder graf missing');
j.blocks[shudder] = {
	kind: 'p',
	html: 'Then a cold line runs up his back — not wind, not the well. <b>A Sosuno-shaped shadow stands behind him.</b> Empty-bucket silhouette. Chin. No face. <b>A cold shudder up his back.</b> The grin dies mid-face. <b>He turns.</b>',
	ko: '그러다 등줄기를 차가운 선이 탄다 — 바람도 아니고 우물도 아니다. <b>소서노 모양의 그림자가 등 뒤에 선다.</b> 빈 두레박 실루엣. 턱. 얼굴은 없다. <b>등줄기가 서늘하다.</b> 웃음이 얼굴 한가운데서 죽는다. <b>돌아본다.</b>'
};

const there = j.blocks.findIndex(
	(b) => typeof b.html === 'string' && b.html.includes('Sosuno is already there')
);
if (there < 0) throw new Error('already-there graf missing');
j.blocks[there] = {
	kind: 'p',
	html: '<b>Sosuno is already there.</b> Empty bucket she does not need. Chin up. No blush. Cold. She does not speak yet. She does not have to.',
	ko: '<b>소서노는 이미 있다.</b> 필요 없는 빈 두레박. 턱. 홍조 없다. 차갑다. 아직 말은 안 한다. 안 해도 된다.'
};

const slots = [
	{
		id: 'daughter-teal-talk-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#2aa89a',
		at: 'Hey big boy~',
		alt: 'ECU anonymous teal daughter talking at the well; fox-flirt, not Sosuno',
		refs: [],
		prompt: ''
	},
	{
		id: 'jumong-talk-funny-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'You’re— yeah. Funny. Too funny.',
		alt: 'ECU Jumong clean-shaven, easy laugh at the well, no mustache',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt: ''
	},
	{
		id: 'daughter-saffron-talk-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#d4a017',
		at: 'Ours is nicer. Stay.',
		alt: 'ECU anonymous saffron daughter inviting him to their well',
		refs: [],
		prompt: ''
	},
	{
		id: 'jumong-talk-bucket-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'Poor bucket.',
		alt: 'ECU Jumong clean-shaven answering the bucket joke, wink, no mustache',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt: ''
	},
	{
		id: 'daughter-plum-talk-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#c4a06a',
		at: 'Don’t look at Sosuno. Look at me.',
		alt: 'ECU anonymous plum daughter: don’t look at Sosuno, look at me',
		refs: [],
		prompt: ''
	},
	{
		id: 'jumong-cold-shudder',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'A Sosuno-shaped shadow stands behind him',
		alt: 'OTS Jumong back: Sosuno-shaped shadow (hanbok, binyeo, empty bucket) — no face, no blush',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt: ''
	},
	{
		id: 'jumong-turn-sosuno',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8a04a',
		at: 'The grin dies mid-face',
		alt: 'Dutch: Jumong mid-turn, clean-shaven; Sosuno cold chin-up, empty bucket, NO blush',
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt: ''
	},
	{
		id: 'sosuno-tsun-well-caught',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8a04a',
		at: 'Sosuno is already there',
		alt: 'ECU Sosuno cold tsundere: chin up, scowl, NO blush, empty bucket rim',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['sosuno'],
		prompt: ''
	},
	{
		id: 'jumong-carries-pine',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'carrying the pine he has torn up',
		alt: 'Worm’s-eye Buyeo yard: Jumong clean-shaven carrying the uprooted pine',
		refs: ['/ch_jumong.png', '/pl_buyeo_yard.png'],
		people: ['jumong'],
		prompt: ''
	},
	{
		id: 'yuhwa-leave-tonight',
		ratio: 1.778,
		nsfw: false,
		tone: '#8fc4e0',
		at: 'Leave Buyeo. Tonight.',
		alt: 'ECU Yuhwa ice-blue: pack, leave Buyeo tonight',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png'],
		people: ['yuhwa'],
		prompt: ''
	},
	{
		id: 'lady-ye-half-door',
		ratio: 1.778,
		nsfw: false,
		tone: '#d98fa8',
		at: 'Leave the door half if you go.',
		alt: 'Dutch lamp room: Lady Ye at a half-open timber door',
		refs: ['/ch_lady_ye.png', '/pl_buyeo_yard.png'],
		people: ['ladyye'],
		prompt: ''
	},
	{
		id: 'haemosu-thats-my-boy',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: "That's my boy.",
		alt: 'OTS gold chariot rail: Haemosu watching tiny Jumong on the living ford',
		refs: ['/ch_haemosu.png', '/pl_white_river.png'],
		people: ['haemosu', 'jumong'],
		prompt: ''
	},
	{
		id: 'jumong-scouts-hands',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'Down. It’s down.',
		alt: 'Dutch pine road: Jumong clean-shaven, hands up, bow on packed earth',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt: ''
	},
	{
		id: 'daeso-morning-slept',
		ratio: 1.778,
		nsfw: false,
		tone: '#9b8f6a',
		at: 'You slept.',
		alt: 'Dutch Buyeo colonnade dawn: Daeso too close; Jumong clean-shaven, grin thin',
		refs: ['/ch_daeso.png', '/ch_jumong.png', '/pl_buyeo_yard.png'],
		people: ['daeso', 'jumong'],
		prompt: ''
	}
];

for (const s of slots) ensureImage(s);

let seq = fs.readFileSync(SEQ, 'utf8');
const wellNeedle =
	"{ id: 'jumong-flirt-daughters', role: 'he flirts back', angle: 'dutch OTS wink', at: 'He flirts at the wrong well' },";
const wellInsert = `{ id: 'daughter-teal-talk-ecu', role: 'teal talks', angle: 'ECU', at: 'Hey big boy~' },
			{ id: 'jumong-talk-funny-ecu', role: 'he answers', angle: 'ECU', at: 'You’re— yeah. Funny. Too funny.' },
			{ id: 'daughter-saffron-talk-ecu', role: 'saffron talks', angle: 'ECU', at: 'Ours is nicer. Stay.' },
			{ id: 'jumong-talk-bucket-ecu', role: 'poor bucket', angle: 'ECU', at: 'Poor bucket.' },
			{ id: 'daughter-plum-talk-ecu', role: 'look at me', angle: 'ECU', at: 'Don’t look at Sosuno. Look at me.' },
			${wellNeedle}`;
if (!seq.includes("id: 'daughter-teal-talk-ecu'")) {
	if (!seq.includes(wellNeedle)) throw new Error('well needle missing');
	seq = seq.replace(wellNeedle, wellInsert);
}

seq = seq.replace(
	"at: 'A cold shudder up his back'",
	"at: 'A Sosuno-shaped shadow stands behind him'"
);

const buyeoNeedle =
	"{ id: 'jumong-buyeo-knife', role: 'assassination', angle: 'dutch blade-line', at: 'One night Jumong slips an assassination' },";
const buyeoInsert = `{ id: 'jumong-carries-pine', role: 'the tree walks in', angle: 'worm’s-eye pine', at: 'carrying the pine he has torn up' },
			{ id: 'yuhwa-leave-tonight', role: 'leave tonight', angle: 'ECU Yuhwa', at: 'Leave Buyeo. Tonight.' },
			{ id: 'lady-ye-half-door', role: 'half door', angle: 'dutch lamp', at: 'Leave the door half if you go.' },
			{ id: 'daeso-morning-slept', role: 'morning after', angle: 'dutch colonnade', at: 'You slept.' },
			${buyeoNeedle}`;
if (!seq.includes("id: 'jumong-carries-pine'")) {
	if (!seq.includes(buyeoNeedle)) throw new Error('buyeo needle missing');
	seq = seq.replace(buyeoNeedle, buyeoInsert);
}

const crossNeedle =
	"{ id: 'jumong-turtle-crossing-dutch', role: 'runs the shells', angle: 'dutch run', at: 'Jumong runs the wet backs' }";
const crossInsert = `{ id: 'haemosu-thats-my-boy', role: 'that’s my boy', angle: 'OTS rail', at: "That's my boy." },
			${crossNeedle}`;
if (!seq.includes("id: 'haemosu-thats-my-boy'")) {
	seq = seq.replace(crossNeedle, crossInsert);
}

const scoutNeedle =
	"{ id: 'jumong-seq-scouts-ots', role: 'spear OTS', angle: 'OTS', at: 'You’ll get Tabal' },";
const scoutInsert = `{ id: 'jumong-scouts-hands', role: 'hands up', angle: 'dutch', at: 'Down. It’s down.' },
			${scoutNeedle}`;
if (!seq.includes("id: 'jumong-scouts-hands'")) {
	seq = seq.replace(scoutNeedle, scoutInsert);
}

fs.writeFileSync(SEQ, seq);
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched talk / shadow / arc links');
