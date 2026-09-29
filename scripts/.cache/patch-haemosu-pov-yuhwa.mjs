/**
 * Add Haemosu-POV Yuhwa stills (camera from the chariot / his eyeline).
 * Wire story slots, image-people, and Amnok movie sequences.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const PEOPLE_JSON = path.join(ROOT, 'src/lib/data/image-people.json');
const SEQ = path.join(ROOT, 'src/lib/movieSequences.ts');
const HOUSE = JSON.parse(
	fs.readFileSync(path.join(ROOT, 'src/lib/data/image-prompt-house.json'), 'utf8')
);
const SUFFIX = HOUSE.suffix;

const RIVER =
	'AMNOK RIVER DRESS: wet ice-blue #8fc4e0 silky jeogori+chima matching the attached portrait — NOT Buyeo court yellow. Hair ornament matches attached binyeo. FACE from attached /ch_yuhwa.png. ONE Yuhwa only — never clone, never invent a second sister face.';
const CHARIOT =
	'CHARIOT LOCK: five PLAYFUL dragons PULL the gold wheeled sun-chariot FROM THE FRONT — traces and yoke ahead of the rail, not coiled on the floor, not sitting on the wheels. Same two spoked wheels, open floor, curved rail. Foreground may show gold METAL RAIL + Haemosu white sleeve / silver-white hair edge only.';
const POV =
	'CAMERA is HAEMOSU’S EYE: HIGH, looking STRAIGHT DOWN or steep three-quarter down at her. She looks UP at the lens. He is not the subject — she is. No standing portrait clone.';

const slots = [
	{
		id: 'jumong-haemosu-pov-yuhwa-only',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Then he looks down and the hour breaks.',
		alt: 'From the gold rail: only Yuhwa in the Amnok looking straight up, ice-blue wet silk',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png', '/pl_white_river.png', '/obj_haemosu_chariot.png'],
		prompt: `Minimal iconic 16:9 still. CINEMATOGRAPHY: bird’s-eye from inside the gold sun-chariot. LENS: shallow DOF, rack-focus, long gold key. Mise-en-scène: LOCKED real Amnok — gold-flat water, wet stones, dark timber bank, natural cloudy sky. ${POV} ONE device: gold METAL RAIL as a hard top-edge bar; ONE adult Yuhwa waist-deep in the river, looking STRAIGHT UP, wet ice-blue #8fc4e0 silk clinging, chin lifted, wanting mouth, flush. ${RIVER} Haemosu only as a white-silk sleeve and silver-white hair at the rail — FACE suggestion from attached, not a second portrait. Gold #f0b429 as a hard sun-plane on the water, never a body-halo. Sisters gone. No army. No text. No watermark. ${CHARIOT} ${SUFFIX}`
	},
	{
		id: 'jumong-haemosu-pov-yuhwa-face',
		ratio: 0.75,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'He forgets the hour on her face',
		alt: 'Steep high ECU: Yuhwa’s face looking up from the Amnok — wet, flush, wanting',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_white_river.png', '/obj_haemosu_chariot.png'],
		prompt: `Intimate cinematic 3:4. CINEMATOGRAPHY: steep high ECU, camera almost above her. LENS: shallow DOF, creamy river bokeh, rack to her eyes. Mise-en-scène: real Amnok water as crushed dark around her face. ${POV} ONE device: her wet face as an ice-blue #8fc4e0 diamond filling the frame; gold rail a thin crescent at the top. Yuhwa looking UP — open or bitten mouth, flush, blown dark pupils, wet dark hair, binyeo matching attached. ${RIVER} Gold #f0b429 as a slit-key on wet cheek, never a halo. No army. No text. No watermark. ${CHARIOT} ${SUFFIX}`
	},
	{
		id: 'jumong-haemosu-pov-yuhwa-shoulders',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'looks down at all of her, wet',
		alt: 'From above: Yuhwa’s wet shoulders and hiked ice-blue, looking up from the Amnok',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png', '/pl_white_river.png', '/obj_haemosu_chariot.png'],
		prompt: `Intimate cinematic 16:9. CINEMATOGRAPHY: high three-quarter looking down. LENS: shallow DOF, wet bokeh, chiaroscuro. Mise-en-scène: LOCKED Amnok shallows. ${POV} ONE device: her wet shoulders and collarbones as a pale ice-blue #8fc4e0 wedge; silk slipped off one shoulder, chima hiked at the hip, skin-forward, wanting look UP. ${RIVER} Foreground: gold rail + one white sleeve. Gold #f0b429 as a hard plane on wet skin, never a body-halo. Adult, cinematic, no genitals as subject. No army. No text. No watermark. ${CHARIOT} ${SUFFIX}`
	},
	{
		id: 'jumong-haemosu-pov-yuhwa-stay',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Yuhwa is the only one who does not run',
		alt: 'OTS gold rail: two wakes already gone; Yuhwa stays and looks up',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png', '/pl_white_river.png', '/obj_haemosu_chariot.png'],
		prompt: `Minimal iconic 16:9 still. CINEMATOGRAPHY: over-shoulder from the gold chariot rail. LENS: rack-focus — sharp rail, her midground, wakes melting to bokeh. Mise-en-scène: SAME locked Amnok. ${POV} ONE device: two white wakes cutting the water; ONE wet Yuhwa remaining, looking UP, ice-blue #8fc4e0. ${RIVER} Haemosu leaning: silver-white hair, white silk, FACE from attached at the edge only. Gold #f0b429 light-plane on the water. Natural sky. No army. No text. No watermark. ${CHARIOT} ${SUFFIX}`
	},
	{
		id: 'jumong-haemosu-pov-yuhwa-wash',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'She rinses the river from her hair',
		alt: 'From the rail: Yuhwa rinses wet hair, looks back and up over her shoulder',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_white_river.png', '/obj_haemosu_chariot.png'],
		prompt: `Intimate cinematic 16:9. CINEMATOGRAPHY: high bird’s-eye three-quarter. LENS: shallow DOF, drip-bokeh, rack to her look-back. Mise-en-scène: LOCKED Amnok, wet stones. ${POV} ONE device: her wet back as a vertical ice-blue #8fc4e0 column; she rinses long dark hair and looks OVER HER SHOULDER UP at the lens — wanting, flush, not a polite smile. ${RIVER} Gold rail a thin top stamp. Gold #f0b429 as a hard key on wet hair, never a halo. No army. No text. No watermark. ${CHARIOT} ${SUFFIX}`
	},
	{
		id: 'jumong-haemosu-pov-yuhwa-kneel',
		ratio: 0.75,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Yuhwa kneels in the shallows',
		alt: 'Steep high: Yuhwa kneeling in the Amnok, chin up toward the chariot',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_white_river.png', '/obj_haemosu_chariot.png'],
		prompt: `Intimate cinematic 3:4. CINEMATOGRAPHY: steep high looking down on a kneel. LENS: shallow DOF, wet bokeh. Mise-en-scène: LOCKED Amnok shallows. ${POV} ONE Yuhwa kneeling waist-deep, wet hair over one shoulder, chin UP, mouth already wanting, ice-blue #8fc4e0 silk hiked. ${RIVER} ONE device: her kneeling body as a pale diamond in dark water; gold wheel-rim a thin arc at the top. Gold #f0b429 slit-key. No army. No text. No watermark. ${CHARIOT} ${SUFFIX}`
	},
	{
		id: 'jumong-haemosu-pov-chin-want',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Chin up, mouth already wanting.',
		alt: 'From high: Yuhwa chin lifted, wanting mouth, ice-blue wet silk, gold rail edge',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_white_river.png', '/obj_haemosu_chariot.png'],
		prompt: `Intimate cinematic 16:9. CINEMATOGRAPHY: high dutch ECU on chin and mouth. LENS: shallow DOF, rack to the mouth. Mise-en-scène: Amnok water crushed dark. ${POV} ONE Yuhwa — chin STRAIGHT UP at the sun-god, bitten or open mouth, flush, drool-hint, dark pupils, wet silk. ${RIVER} ONE device: gold rail as a hard diagonal at the top; ice-blue #8fc4e0 as the face-plane. Gold #f0b429 key on wet lip, never a halo. No army. No text. No watermark. ${CHARIOT} ${SUFFIX}`
	},
	{
		id: 'jumong-haemosu-pov-wades-her',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'He wades close. She does not run.',
		alt: 'Haemosu’s eyeline in the shallows: Yuhwa stays, wet ice-blue, looking at him',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png', '/pl_white_river.png'],
		prompt: `Intimate cinematic 16:9. CINEMATOGRAPHY: over-shoulder from Haemosu wading — HIS eyeline, slightly above hers. LENS: shallow DOF, wet bokeh, rack to her face. Mise-en-scène: SAME Amnok bank, water to the thighs. ${POV} Foreground: his white wet silk shoulder and silver-white hair only. Midground: ONE Yuhwa who does not step back — wet ice-blue #8fc4e0 at the hips, wanting look at the lens. ${RIVER} ONE device: a hard gold #f0b429 sun-bar on the water between them — light-plane, never body-halo. FACE from attached portraits. No army. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-haemosu-pov-rack-her',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Then he looks down and the hour breaks.',
		alt: 'From the floor: three wet specks rack-focus onto Yuhwa looking up',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png', '/pl_white_river.png', '/obj_haemosu_chariot.png'],
		prompt: `Minimal iconic 16:9 still. CINEMATOGRAPHY: bird’s-eye from the chariot floor, RACK FOCUS. LENS: two sister-specks melt to creamy bokeh; Yuhwa SNAPS sharp in the midground looking UP. Mise-en-scène: LOCKED Amnok ribbon. ${POV} ONE device: gold spoked WHEEL RIM as a foreground arc. ONE readable Yuhwa only — wet ice-blue #8fc4e0, chin up. ${RIVER} Do not invent sister faces — they are out-of-focus wakes. Gold #f0b429 as the water-plane. Haemosu sleeve at the edge. No army. No text. No watermark. ${CHARIOT} ${SUFFIX}`
	},
	{
		id: 'jumong-haemosu-pov-hike-rail',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'She draws the wet silk higher',
		alt: 'From the rail: Yuhwa hikes wet ice-blue and looks up, wanting',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_white_river.png', '/obj_haemosu_chariot.png'],
		prompt: `Intimate cinematic 16:9. CINEMATOGRAPHY: high dutch from the gold rail. LENS: shallow DOF, wet bokeh. Mise-en-scène: LOCKED Amnok dusk-gold water. ${POV} ONE Yuhwa drawing wet ice-blue #8fc4e0 silk higher at the hip — skin-forward, hiked chima, looking UP, flush, bitten mouth. ${RIVER} ONE device: the hiked silk as a hard ice-blue wedge; gold rail a top bar. Gold #f0b429 as a dusk plane, never a halo. Adult cinematic, no genitals as subject. No army. No text. No watermark. ${CHARIOT} ${SUFFIX}`
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
for (const slot of slots) {
	people[slot.id] = slot.people;
}
fs.writeFileSync(PEOPLE_JSON, JSON.stringify(people, null, '\t') + '\n');

let seq = fs.readFileSync(SEQ, 'utf8');
seq = seq.replace(/id: 'nsfw-haemosu-copper-ecu'/g, "id: 'nsfw-jumong-haemosu-copper-ecu'");

const inserts = [
	{
		after: "{ id: 'jumong-haemosu-heart-yuhwa-chin', role: 'chin straight up', angle: 'worm’s-eye ECU', at: 'Then he looks down and the hour breaks' }",
		lines: [
			"{ id: 'jumong-haemosu-pov-yuhwa-only', role: 'only her from the rail', angle: 'bird’s-eye rail', at: 'Then he looks down and the hour breaks' }",
			"{ id: 'jumong-haemosu-pov-yuhwa-face', role: 'her face from high', angle: 'steep high ECU', at: 'He forgets the hour on her face' }",
			"{ id: 'jumong-haemosu-pov-rack-her', role: 'rack onto her', angle: 'bird’s-eye rack', at: 'Then he looks down and the hour breaks' }"
		]
	},
	{
		after: "{ id: 'jumong-yuhwa-only-stays', role: 'she does not run', angle: 'worm’s-eye shallows', at: 'Yuhwa is the only one who does not run' }",
		lines: [
			"{ id: 'jumong-haemosu-pov-yuhwa-stay', role: 'stay from his rail', angle: 'OTS rail', at: 'Yuhwa is the only one who does not run' }"
		]
	},
	{
		after: "{ id: 'jumong-haemosu-wades-close-her', role: 'wades close', angle: 'dutch two-shot', at: 'He wades close. She does not run.' }",
		lines: [
			"{ id: 'jumong-haemosu-pov-wades-her', role: 'his eyeline as he wades', angle: 'OTS eyeline', at: 'He wades close. She does not run.' }"
		]
	}
];

function insertAfter(src, after, lines) {
	if (src.includes(lines[0])) return src;
	if (!src.includes(after)) {
		console.warn('anchor missing', after.slice(0, 80));
		return src;
	}
	return src.split(after).join(`${after},\n\t\t\t${lines.join(',\n\t\t\t')}`);
}

for (const block of inserts) {
	seq = insertAfter(seq, block.after, block.lines);
}

// Extra unique shots that appear once in haemosu-yuhwa-amnok
const extraOnce = [
	{
		after: "{ id: 'jumong-yuhwa-amnok-kneel-look', role: 'kneel look-up', angle: 'intimate worm’s-eye', at: 'Yuhwa kneels in the shallows' }",
		lines: [
			"{ id: 'jumong-haemosu-pov-yuhwa-kneel', role: 'kneel from high', angle: 'steep high kneel', at: 'Yuhwa kneels in the shallows' }",
			"{ id: 'jumong-haemosu-pov-yuhwa-shoulders', role: 'shoulders from above', angle: 'high three-quarter', at: 'looks down at all of her, wet' }",
			"{ id: 'jumong-haemosu-pov-yuhwa-wash', role: 'rinse from the rail', angle: 'bird’s-eye look-back', at: 'She rinses the river from her hair' }",
			"{ id: 'jumong-haemosu-pov-chin-want', role: 'chin from his height', angle: 'high dutch ECU', at: 'Chin up, mouth already wanting' }",
			"{ id: 'jumong-haemosu-pov-hike-rail', role: 'hike from the rail', angle: 'high dutch', at: 'She draws the wet silk higher' }"
		]
	}
];
for (const block of extraOnce) {
	seq = insertAfter(seq, block.after, block.lines);
}

fs.writeFileSync(SEQ, seq);

const manifest = slots.map(({ id, alt, prompt }) => ({ id, alt, prompt }));
fs.writeFileSync(
	path.join(ROOT, 'scripts/.cache/haemosu-pov-yuhwa-install.json'),
	JSON.stringify(manifest, null, '\t') + '\n'
);

console.log(JSON.stringify({ added, total: slots.length }, null, 2));
