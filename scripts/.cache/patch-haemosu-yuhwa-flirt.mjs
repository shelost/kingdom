/**
 * Flirt two-shots: Sosuno-grin grammar for Haemosu × Yuhwa in the Amnok.
 * OTS / faces fill the frame / easy grin — not look-down wides.
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

const RIVER =
	'AMNOK: wet ice-blue #8fc4e0 silky jeogori+chima matching attached Yuhwa portrait — NOT yellow court. Wave binyeo from attached. FACE from attached. Adult woman, not a child.';
const SUN =
	'Haemosu: silver-white topknot, white silky hanbok open at the chest as in the portrait, FACE from attached. Gold #f0b429 as a hard light-plane only — never a body-halo, never gold robes.';
const GRIN =
	'SOSUNO-GRIN GRAMMAR: intimate OTS conversation still. Foreground is ONLY the back of one head / wet hair / one shoulder. The facing person FILLS the frame with an easy flirtatious GRIN — readable eyes and mouth, not a serene portrait, not a standing clone. Shallow DOF, creamy river bokeh. ONE of each named person.';

const slots = [
	{
		id: 'jumong-yuhwa-pov-haemosu-grin',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: false,
		at: "Why didn't you run away",
		alt: 'Yuhwa’s POV: OTS wet ice-blue hair, Haemosu’s easy sun-grin filling the shallows',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_haemosu.png', '/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_white_river.png'],
		prompt: `Intimate cinematic 16:9. ${GRIN} CAMERA behind Yuhwa. Foreground LEFT: back of her wet dark hair, wave binyeo, one ice-blue #8fc4e0 shoulder — no face. Midground: ONE Haemosu leaning in the Amnok, EASY GRIN, greedy and fun, looking at her. ${SUN} ${RIVER} ONE device: her ice-blue shoulder as a hard foreground wedge; gold #f0b429 as the key on his cheek. Real wet stones, crushed shadow. No chariot dump. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-haemosu-pov-yuhwa-grin',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: false,
		at: 'oh, is that so',
		alt: 'Haemosu’s POV: OTS silver-white hair, Yuhwa’s flirty almost-grin filling the frame',
		people: ['haemosu', 'yuhwa'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png', '/pl_white_river.png'],
		prompt: `Intimate cinematic 16:9. ${GRIN} CAMERA behind Haemosu. Foreground LEFT: back of silver-white topknot and white silk shoulder — no face. Midground: ONE adult Yuhwa facing us, flirty almost-grin, hedge then dare, wet lashes, bitten then smiling mouth, flush. ${RIVER} ${SUN} ONE device: his white shoulder as a foreground bar; ice-blue #8fc4e0 as her face-plane. Real Amnok. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-yuhwa-pov-sun-grin',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: false,
		at: 'looking directly at the sun',
		alt: 'Yuhwa’s POV: OTS ice-blue sleeve, Haemosu teasing grin — you are looking at the sun',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_haemosu.png', '/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_white_river.png'],
		prompt: `Intimate cinematic 16:9. ${GRIN} CAMERA behind Yuhwa. Foreground: wet ice-blue sleeve and dark hair back. Midground: ONE Haemosu mid-tease, EASY GRIN, mouth mid-word, pointing a finger at her eyes or nodding, fun not lecturing. ${SUN} ${RIVER} ONE device: a hard gold #f0b429 slit-plane behind his shoulder — light, never a halo. Real Amnok shallows. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-haemosu-pov-like-grin',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: false,
		at: 'like what I see',
		alt: 'Haemosu’s POV: OTS white silk, Yuhwa flush-grin — I like what I see',
		people: ['haemosu', 'yuhwa'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png', '/pl_white_river.png'],
		prompt: `Intimate cinematic 16:9. ${GRIN} CAMERA behind Haemosu. Foreground: silver-white hair and white wet silk shoulder. Midground: ONE adult Yuhwa filling the frame, flush-grin, chin up, staring into him, wet ice-blue slipping one shoulder, wanting and amused. ${RIVER} ${SUN} ONE device: ice-blue #8fc4e0 as the cheek-plane; gold key on wet collarbone, never a halo. Real Amnok. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-yuhwa-haemosu-two-grin',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: false,
		at: 'He wades close. She does not run.',
		alt: 'Close two-shot: Haemosu easy grin, Yuhwa answering almost-smile, faces fill the shallows',
		people: ['haemosu', 'yuhwa'],
		refs: ['/ch_haemosu.png', '/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_white_river.png'],
		prompt: `Intimate cinematic 16:9 two-shot. Faces FILL the frame — Sosuno-grin closeness, not a wide. CINEMATOGRAPHY: dutch close two-shot in the Amnok. LENS: shallow DOF, wet bokeh. ONE Haemosu easy GRIN, leaning in, silver-white hair. ONE adult Yuhwa answering with an almost-smile, flush, wet ice-blue. ${SUN} ${RIVER} ONE device: a hard gold #f0b429 sun-bar on the water between their mouths. They look at EACH OTHER, not the camera. No standing clones. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-yuhwa-pov-wink-grin',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: false,
		at: 'He grins and leaves the rail',
		alt: 'Yuhwa’s POV in the water: OTS wet hair, Haemosu wading in with a wink-grin',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_haemosu.png', '/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_white_river.png'],
		prompt: `Intimate cinematic 16:9. ${GRIN} CAMERA behind Yuhwa in the shallows looking at him arriving. Foreground: back of wet dark hair and ice-blue shoulder. Midground: ONE Haemosu wading close, WINK-GRIN, easy sun-god, white silk wet, silver-white hair loose at the tips. ${SUN} ${RIVER} ONE device: her ice-blue hair as a vertical; gold #f0b429 key on his grin. Real Amnok. No chariot dump. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-haemosu-pov-no-reason',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: false,
		at: "didn't see any reason",
		alt: 'Haemosu’s POV: OTS white sleeve, Yuhwa hedge-then-grin — no reason to run',
		people: ['haemosu', 'yuhwa'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png', '/pl_white_river.png'],
		prompt: `Intimate cinematic 16:9. ${GRIN} CAMERA behind Haemosu. Foreground: white silk sleeve and silver-white hair. Midground: ONE adult Yuhwa, hedge then a small brave GRIN, wet mouth, looking at him, ice-blue #8fc4e0. ${RIVER} ${SUN} ONE device: his sleeve as a cream bar; her face the only sharp plane. Real Amnok. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-yuhwa-pov-bank-grin',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: false,
		at: 'This way. The bank.',
		alt: 'Look-back tease: Yuhwa over-shoulder grin; Haemosu’s easy answering grin in bokeh',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png', '/pl_white_river.png'],
		prompt: `Intimate cinematic 16:9. Close look-back two-beat. CINEMATOGRAPHY: dutch OTS as she turns toward the bank. LENS: rack-focus — her over-shoulder GRIN sharp, his answering easy grin creamy bokeh behind. ONE adult Yuhwa looking BACK over a wet ice-blue shoulder, flirty grin, wave binyeo. ONE Haemosu behind her in the shallows, leftover grin, silver-white hair. ${RIVER} ${SUN} ONE device: her turned shoulder as an ice-blue #8fc4e0 wedge. Real Amnok. No army. No text. No watermark. ${SUFFIX}`
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
const inserts = [
	{
		after: "{ id: 'jumong-haemosu-why-not-run', role: 'why stay', angle: 'dutch two-shot', at: \"Why didn't you run away\" }",
		lines: [
			"{ id: 'jumong-yuhwa-pov-haemosu-grin', role: 'her OTS his grin', angle: 'OTS grin', at: \"Why didn't you run away\" }"
		]
	},
	{
		after: "{ id: 'jumong-yuhwa-why-not-sun', role: 'why not', angle: 'dutch ECU', at: 'oh, is that so' }",
		lines: [
			"{ id: 'jumong-haemosu-pov-yuhwa-grin', role: 'his OTS her grin', angle: 'OTS grin', at: 'oh, is that so' }"
		]
	},
	{
		after: "{ id: 'jumong-haemosu-looking-at-sun', role: 'sun-stare warn', angle: 'OTS two-shot', at: 'looking directly at the sun' }",
		lines: [
			"{ id: 'jumong-yuhwa-pov-sun-grin', role: 'her OTS sun-tease grin', angle: 'OTS grin', at: 'looking directly at the sun' }"
		]
	},
	{
		after: "{ id: 'jumong-yuhwa-like-what-i-see', role: 'I like what I see', angle: 'intimate ECU', at: 'like what I see' }",
		lines: [
			"{ id: 'jumong-haemosu-pov-like-grin', role: 'his OTS her like-grin', angle: 'OTS grin', at: 'like what I see' }"
		]
	},
	{
		after: "{ id: 'jumong-haemosu-wades-close-her', role: 'wades close', angle: 'dutch two-shot', at: 'He wades close. She does not run.' }",
		lines: [
			"{ id: 'jumong-yuhwa-haemosu-two-grin', role: 'both grin close', angle: 'dutch two-shot', at: 'He wades close. She does not run.' }"
		]
	},
	{
		after: "{ id: 'jumong-haemosu-grin-comes-down', role: 'grin down', angle: 'ECU grin', at: 'He grins and leaves the rail' }",
		lines: [
			"{ id: 'jumong-yuhwa-pov-wink-grin', role: 'her OTS wink-grin', angle: 'OTS grin', at: 'He grins and leaves the rail' }"
		]
	},
	{
		after: "{ id: 'jumong-yuhwa-no-reason', role: 'no reason', angle: 'ECU', at: \"didn't see any reason\" }",
		lines: [
			"{ id: 'jumong-haemosu-pov-no-reason', role: 'his OTS her hedge-grin', angle: 'OTS grin', at: \"didn't see any reason\" }"
		]
	},
	{
		after: "{ id: 'jumong-yuhwa-leads-copper-back', role: 'she leads', angle: 'OTS look-back', at: 'This way. The bank.' }",
		lines: [
			"{ id: 'jumong-yuhwa-pov-bank-grin', role: 'look-back grin', angle: 'dutch look-back', at: 'This way. The bank.' }"
		]
	}
];

function insertAfter(src, after, lines) {
	if (src.includes(`id: '${lines[0].match(/id: '([^']+)'/)[1]}'`)) {
		// already present somewhere — still insert if this exact line missing
	}
	if (src.includes(lines[0])) return src;
	if (!src.includes(after)) {
		console.warn('anchor missing', after.slice(0, 90));
		return src;
	}
	return src.split(after).join(`${after},\n\t\t\t${lines.join(',\n\t\t\t')}`);
}

for (const block of inserts) seq = insertAfter(seq, block.after, block.lines);
fs.writeFileSync(SEQ, seq);

fs.writeFileSync(
	path.join(ROOT, 'scripts/.cache/haemosu-yuhwa-flirt-install.json'),
	JSON.stringify(
		slots.map(({ id, alt, prompt }) => ({ id, alt, prompt })),
		null,
		'\t'
	) + '\n'
);

console.log(JSON.stringify({ added, total: slots.length }, null, 2));
