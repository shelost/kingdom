/**
 * Three sisters bathing in the jumong-haemosu-pov-yuhwa-kneel paint:
 * dark circular water well, wet pale silk, look-up, no landscape postcard.
 * Very different cameras.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const PEOPLE_JSON = path.join(ROOT, 'src/lib/data/image-people.json');
const SEQ = path.join(ROOT, 'src/lib/movieSequences.ts');
const SUFFIX = JSON.parse(
	fs.readFileSync(path.join(ROOT, 'src/lib/data/image-prompt-house.json'), 'utf8')
).suffix;

const STYLE =
	'KNEEL-WELL LOCK (same paint as jumong-haemosu-pov-yuhwa-kneel): crushed-black circular water as a well/bowl, wet pale silk as the only plane, gold flecks in the dark, painterly, NO sky postcard, NO even daylight river, NO clothes-on-rocks catalog, NO standing lineup. Light is a hard gold #f0b429 slit-key, never a halo.';
const THREE =
	'THREE DISTINCT adult sisters, ONE of each, never clone Yuhwa. Yuhwa: ice-blue #8fc4e0, wave binyeo, FACE from /ch_yuhwa.png, looking UP, youngest. Hwahye: pale ice #a8d4e8, pearl pin, FACE from /ch_hwahye.png, eldest, curt. Wihye: teal #7eb8c8, loose wet hair, FACE from /ch_wihye.png, middle, almost a laugh. Wet silky hanbok still on, off-shoulder OK. Adult women.';

const slots = [
	{
		id: 'jumong-sisters-kneel-well',
		ratio: 0.75,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'naked in the Ubal',
		alt: 'Straight-down well: three sisters kneeling in crushed-black water, looking up',
		people: ['yuhwa', 'hwahye', 'wihye'],
		refs: [
			'/ch_yuhwa.png',
			'/bn_yuhwa.png',
			'/ch_hwahye.png',
			'/ch_wihye.png',
			'/temp/jumong-haemosu-pov-yuhwa-kneel.jpg'
		],
		prompt: `Intimate cinematic 3:4. STRICT bird’s-eye STRAIGHT DOWN into a dark circular water well. ${STYLE} ${THREE} ONE device: the well-rim as a gold-thin circle; three wet bodies as pale silk diamonds looking UP at the lens. Yuhwa center. No landscape. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-sisters-kneel-worm',
		ratio: 0.75,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Then he looks down and the hour breaks.',
		alt: 'Worm’s-eye from the black water: three faces looking down at us, wet pale silk',
		people: ['yuhwa', 'hwahye', 'wihye'],
		refs: [
			'/ch_yuhwa.png',
			'/bn_yuhwa.png',
			'/ch_hwahye.png',
			'/ch_wihye.png',
			'/temp/jumong-haemosu-pov-yuhwa-kneel.jpg'
		],
		prompt: `Intimate cinematic 3:4. WORM’S-EYE from INSIDE the crushed-black water looking UP — opposite of the kneel overhead. ${STYLE} ${THREE} Camera just under the surface. Three faces lean over us, wet pale silk, gold flecks. ONE device: the waterline as a hard dark oval. Distinct faces. No sky postcard. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-sisters-kneel-waterline',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Hwahye and Wihye leave their silk on the rocks',
		alt: 'Dutch waterline: three chins on crushed-black water, wet ice / pale / teal silk',
		people: ['yuhwa', 'hwahye', 'wihye'],
		refs: [
			'/ch_yuhwa.png',
			'/bn_yuhwa.png',
			'/ch_hwahye.png',
			'/ch_wihye.png',
			'/temp/jumong-haemosu-pov-yuhwa-kneel.jpg'
		],
		prompt: `Intimate cinematic 16:9. DUTCH waterline ECU — camera ON the black water, chins and collarbones only. ${STYLE} ${THREE} Faces in a falling diagonal. Yuhwa looking UP, Hwahye already turning, Wihye a laugh. ONE device: the waterline as a crushed-black bar. No riverbank. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-sisters-kneel-side',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'There are three of you',
		alt: 'Side profile in the well: three wet silk wedges in crushed-black water',
		people: ['yuhwa', 'hwahye', 'wihye'],
		refs: [
			'/ch_yuhwa.png',
			'/bn_yuhwa.png',
			'/ch_hwahye.png',
			'/ch_wihye.png',
			'/temp/jumong-haemosu-pov-yuhwa-kneel.jpg'
		],
		prompt: `Intimate cinematic 16:9. SIDE PROFILE, camera at the water, looking across. ${STYLE} ${THREE} Three kneeling bodies as pale silk wedges receding into crushed-black water. Yuhwa nearest, chin up; Hwahye mid; Wihye far. ONE device: a hard gold #f0b429 slit cutting the water horizontally. Distinct faces in profile. No postcard sky. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-sisters-kneel-ots',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Go. I’m here.',
		alt: 'OTS Yuhwa’s wet hair: Hwahye and Wihye in the dark well looking up',
		people: ['yuhwa', 'hwahye', 'wihye'],
		refs: [
			'/ch_yuhwa.png',
			'/bn_yuhwa.png',
			'/ch_hwahye.png',
			'/ch_wihye.png',
			'/temp/jumong-haemosu-pov-yuhwa-kneel.jpg'
		],
		prompt: `Intimate cinematic 16:9. OVER-SHOULDER from Yuhwa. ${STYLE} Foreground: back of Yuhwa’s wet dark hair, wave binyeo, ice-blue #8fc4e0 shoulder — no clone face. Midground: ONE Hwahye and ONE Wihye in the dark well, looking UP past her, distinct faces from attached. ${THREE} ONE device: her ice-blue shoulder as a foreground wedge. No landscape. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-sisters-kneel-under',
		ratio: 0.75,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Two wakes cut the shallows; Yuhwa stays',
		alt: 'From under the black well: two sisters diving, Yuhwa still a pale silk diamond looking up',
		people: ['yuhwa', 'hwahye', 'wihye'],
		refs: [
			'/ch_yuhwa.png',
			'/bn_yuhwa.png',
			'/ch_hwahye.png',
			'/ch_wihye.png',
			'/temp/jumong-haemosu-pov-yuhwa-kneel.jpg'
		],
		prompt: `Intimate cinematic 3:4. Camera UNDER the crushed-black water looking UP toward the gold-thin well-rim. ${STYLE} ${THREE} Hwahye and Wihye already diving as blurred teal/pale wakes. Yuhwa remains a sharp ice-blue #8fc4e0 diamond looking UP, FACE from attached. ONE device: the well-rim as a gold oval above. No landscape. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-sisters-kneel-dutch-high',
		ratio: 0.75,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Then he looks down and the hour breaks.',
		alt: 'Steep dutch from the well-rim: three looking up, not a straight-down clone',
		people: ['yuhwa', 'hwahye', 'wihye'],
		refs: [
			'/ch_yuhwa.png',
			'/bn_yuhwa.png',
			'/ch_hwahye.png',
			'/ch_wihye.png',
			'/temp/jumong-haemosu-pov-yuhwa-kneel.jpg'
		],
		prompt: `Intimate cinematic 3:4. STEEP DUTCH from the well-RIM — camera on the gold-thin circle, looking DOWN-ACROSS, not straight down, not worm’s-eye. ${STYLE} ${THREE} Three wet bodies on a tilted crushed-black disc. Yuhwa looking UP at us. ONE device: the rim as a broken gold arc. Distinct faces. No postcard. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-sisters-kneel-ecu-three',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'There are three of you',
		alt: 'Rack ECU: Yuhwa sharp looking up; two sister faces melt into the dark well',
		people: ['yuhwa', 'hwahye', 'wihye'],
		refs: [
			'/ch_yuhwa.png',
			'/bn_yuhwa.png',
			'/ch_hwahye.png',
			'/ch_wihye.png',
			'/temp/jumong-haemosu-pov-yuhwa-kneel.jpg'
		],
		prompt: `Intimate cinematic 16:9. RACK-FOCUS ECU inside the dark well. ${STYLE} ${THREE} Yuhwa SNAPS sharp looking UP, FACE from attached. Hwahye and Wihye are creamy bokeh faces only — still distinct, not Yuhwa clones. ONE device: her ice-blue #8fc4e0 face as a diamond in crushed black. No landscape. No army. No text. No watermark. ${SUFFIX}`
	}
];

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const jumong = story.find((c) => c.id === 'jumong')?.entries?.find((e) => e.title === 'Jumong');
if (!jumong) throw new Error('Jumong entry missing');

const have = new Set(jumong.images.map((im) => im.id));
const added = [];
for (const slot of slots) {
	if (have.has(slot.id)) continue;
	jumong.images.push(slot);
	have.add(slot.id);
	added.push(slot.id);
}
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

const people = JSON.parse(fs.readFileSync(PEOPLE_JSON, 'utf8'));
for (const slot of slots) people[slot.id] = slot.people;
fs.writeFileSync(PEOPLE_JSON, JSON.stringify(people, null, '\t') + '\n');

let seq = fs.readFileSync(SEQ, 'utf8');
const after =
	"{ id: 'jumong-yuhwa-sisters-bath', role: 'three bathing', angle: 'shallows wide', at: 'Hwahye and Wihye leave their silk on the rocks' }";
const lines = [
	"{ id: 'jumong-sisters-kneel-well', role: 'three in the well', angle: 'straight-down well', at: 'naked in the Ubal' }",
	"{ id: 'jumong-sisters-kneel-worm', role: 'from the black water', angle: 'worm’s-eye well', at: 'Then he looks down and the hour breaks' }",
	"{ id: 'jumong-sisters-kneel-waterline', role: 'chins on the water', angle: 'dutch waterline', at: 'Hwahye and Wihye leave their silk on the rocks' }",
	"{ id: 'jumong-sisters-kneel-side', role: 'three wedges', angle: 'side profile well', at: 'There are three of you' }",
	"{ id: 'jumong-sisters-kneel-ots', role: 'her OTS two sisters', angle: 'OTS well', at: 'Go. I’m here.' }",
	"{ id: 'jumong-sisters-kneel-under', role: 'under the well', angle: 'under-look-up', at: 'Two wakes cut the shallows; Yuhwa stays' }",
	"{ id: 'jumong-sisters-kneel-dutch-high', role: 'rim dutch', angle: 'steep dutch rim', at: 'Then he looks down and the hour breaks' }",
	"{ id: 'jumong-sisters-kneel-ecu-three', role: 'rack onto Yuhwa', angle: 'rack ECU well', at: 'There are three of you' }"
];
if (!seq.includes("id: 'jumong-sisters-kneel-well'")) {
	if (!seq.includes(after)) console.warn('anchor missing');
	else seq = seq.split(after).join(`${after},\n\t\t\t${lines.join(',\n\t\t\t')}`);
}
fs.writeFileSync(SEQ, seq);

fs.writeFileSync(
	path.join(ROOT, 'scripts/.cache/sisters-kneel-style-install.json'),
	JSON.stringify(
		slots.map(({ id, alt, prompt }) => ({ id, alt, prompt })),
		null,
		'\t'
	) + '\n'
);

console.log(JSON.stringify({ added, total: slots.length }, null, 2));
