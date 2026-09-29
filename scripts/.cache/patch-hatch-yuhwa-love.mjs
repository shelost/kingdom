import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const HOUSE =
	'EVERY FRAME A PAINTING: compose as a master canvas — one geometry or one body owns the frame; light is the plot; negative space is ink; not coverage, not a tourist postcard, not a game-map. 2D animated cel-painterly cinema, not photoreal, not live-action, not 3D CGI. Same film stock: anamorphic movie frame, shallow DOF, creamy bokeh, rack-focus, film grain. A CAMERA in a real Korean place — NEVER a graphic poster, split-screen collage, 3D archviz, black-triangle overlay, spotlight cone deleting the landscape, or neon outline. NO halo, bloom, glow, rim-aura, or god-ray envelope around people — light is a plane or a hard key. FACE AND GARMENTS from the attached portrait — NEVER copy the portrait stance. Invent a new DRAMATIC body. Black pupils, dark Korean irises — NOT blue. HIGH CONTRAST chiaroscuro. ICONIC MINIMAL. Hex is lighting / a plane / one accent. No army. No readable text. No watermark.';

function findJumong() {
	for (const ch of Object.values(story)) {
		for (const en of ch.entries ?? []) {
			if (en.title === 'Jumong') return en;
		}
	}
	throw new Error('Jumong entry not found');
}

const entry = findJumong();
const byId = new Map(entry.images.map((im) => [im.id, im]));

function upsert(im) {
	const prev = byId.get(im.id);
	if (prev) Object.assign(prev, im);
	else {
		entry.images.push(im);
		byId.set(im.id, im);
	}
}

const hatchPrompt =
	'Intimate 3:4 painterly cinema still, NOT photoreal product shot. ECU timber floor, broken pale eggshell. A REAL HUMAN NEWBORN infant boy, wet, tiny fists — NOT miniature adult, NOT teen, NO goatee, NO red headband. Family resemblance only to attached Jumong. Yuhwa ice-blue court silk sleeve. ONE device: red #e8563f seam in the shell split. Black pupils. ' +
	HOUSE;

const slots = [
	{
		id: 'jumong-buyeo-hatch',
		prompt: hatchPrompt,
		alt: 'Painterly ECU: wet newborn boy in broken pale shell on timber; Yuhwa ice-blue sleeve; red #e8563f seam'
	},
	{
		id: 'jumong-buyeo-hatch-worm',
		prompt:
			'Minimal iconic 3:4. Worm’s-eye from inside broken eggshell. Wet NEWBORN looking up — baby not adult Jumong. Yuhwa ice-blue silk above. ONE device: red #e8563f seam. Black pupils. ' +
			HOUSE,
		alt: 'Worm’s-eye from shell: wet newborn looking up; Yuhwa ice-blue silk; red seam'
	},
	{
		id: 'jumong-buyeo-hatch-hold',
		prompt:
			'Intimate 3:4 OTS. Yuhwa kneeling holding a wet newborn; ice-blue sleeve as roof-plane; shell shards bokeh; Buyeo timber. Black pupils. ' +
			HOUSE,
		alt: 'OTS: Yuhwa in ice-blue court silk holding a wet newborn; shell pieces on timber'
	},
	{
		id: 'yuhwa-sunshaft-timber',
		prompt:
			'Minimal iconic 3:4. Dutch timber interior, Buyeo yard beyond. ONE device: hard gold sun-SHAFT as a plane through the window-bar — not a halo. Yuhwa ice-blue court silk. Geumwa burgundy doorway stamp. Black pupils. ' +
			HOUSE,
		alt: 'Dutch Buyeo timber: gold sun-plane cutting dark; Yuhwa in ice-blue in the cut'
	},
	{
		id: 'jumong-buyeo-boys-young',
		prompt:
			'Minimal iconic 16:9. Bird’s-eye dusk LOCK pl_buyeo_yard. Three small BOYS at one mark-stake. Jumong red #e8563f grin. Daeso too close. Galsa delayed. Hall as dark bar. Black pupils. ' +
			HOUSE,
		alt: 'Bird’s-eye dusk: same Buyeo square, three boys at one mark-stake, giwa hall as a dark bar'
	},
	{
		id: 'jumong-buyeo-youths',
		prompt:
			'Minimal iconic 16:9. Dutch low dusk SAME Buyeo yard. Three youths: Jumong full-draw grinning, Daeso too close, Galsa looking at dirt. Stake as vertical. Black pupils. ' +
			HOUSE,
		alt: 'Dutch dusk same Buyeo yard: three youths, Jumong mid-draw grinning'
	},
	{
		id: 'jumong-buyeo-boys-worm',
		ratio: 0.75,
		nsfw: false,
		tone: '#e8563f',
		at: 'They are boys first',
		people: ['jumong', 'daeso', 'galsa'],
		refs: ['/pl_buyeo_yard.png', '/ch_jumong.png', '/ch_daeso.png', '/ch_galsa.png'],
		prompt:
			'Minimal iconic 3:4. Worm’s-eye packed earth looking up. LOCK pl_buyeo_yard. Three small boys, mark-stake vertical, hall bar above. Jumong #e8563f. Black pupils. ' +
			HOUSE,
		alt: 'Worm’s-eye Buyeo yard: three boys at the stake, giwa hall a dark bar above'
	},
	{
		id: 'haemosu-falls-three',
		prompt:
			'Minimal iconic 16:9. Bird’s-eye from the five-dragon gold sun-chariot. Three river-daughters; Hwahye and Wihye dive; Yuhwa looks up. Wheel-rim as arc. Black pupils. ' +
			HOUSE,
		alt: 'Bird’s-eye from the gold chariot: three river-daughters in the Amnok'
	},
	{
		id: 'yuhwa-only-stays',
		prompt:
			'Minimal iconic 3:4. Worm’s-eye Amnok. Yuhwa standing looking up; sisters as wakes; chariot a tiny house in the sky. Ice-blue #8fc4e0 water-plane. Black pupils. ' +
			HOUSE,
		alt: 'Worm’s-eye Amnok: Yuhwa looking up; two sister-wakes; gold chariot tiny in the sky'
	},
	{
		id: 'habek-court-wide',
		prompt:
			'Minimal iconic 16:9. Bird’s-eye Amnok bank. Mist as a hard court-plane. Tiny Habek and Yuhwa. Copper hut stamp. Teal #2f8f7a rim. Black pupils. ' +
			HOUSE,
		alt: 'Bird’s-eye Amnok: mist as a dais, tiny Habek and Yuhwa, copper room a warm stamp'
	},
	{
		id: 'habek-exile-dutch',
		prompt:
			'Minimal iconic 3:4. Dutch Amnok bank. Habek pointing the current as a border; Yuhwa ice-blue mid-turn leaving. River as diagonal. Black pupils. ' +
			HOUSE,
		alt: 'Dutch Amnok: Habek pointing the current; Yuhwa ice-blue leaving'
	},
	{
		id: 'habek-exile-ots',
		prompt:
			'Minimal iconic 16:9. OTS Habek shoulder; Yuhwa walking wet sand. Path as a wedge. Black pupils. ' +
			HOUSE,
		alt: 'OTS Habek: Yuhwa walking the wet sand, copper hut bokeh'
	},
	{
		id: 'jumong-friends-split-wide',
		prompt:
			'Minimal iconic 16:9. Aerial dusk pines. Path-fork as a Y. Tiny red Jumong toward water; three earth-tone friends turning the ridge. No turtle bridge. Black pupils. ' +
			HOUSE,
		alt: 'Aerial dusk pines: tiny red Jumong toward water; three friends turning the ridge'
	},
	{
		id: 'jumong-friends-split-ots',
		prompt:
			'Minimal iconic 3:4. OTS Jumong red shoulder grinning; three friends already on the ridge. Pine trunks as verticals. Black pupils. ' +
			HOUSE,
		alt: 'OTS Jumong’s red shoulder; three friends already on the ridge path'
	},
	{
		id: 'jumong-friends-jolbon',
		prompt:
			'Minimal iconic 16:9. Dutch dusk Jolbon gate. Three muddy friends arriving; Jumong a small red grin in the yard. Gate as dark rectangle. Black pupils. ' +
			HOUSE,
		alt: 'Dutch dusk Jolbon gate: three muddy friends; Jumong a small red grin'
	},
	{
		id: 'songyang-yard-wide',
		prompt:
			'Minimal iconic 16:9. Bird’s-eye Jolbon archery yard, giwa hall bar, two tiny archers, one mark-stake. #c4a35a and #e8563f. Black pupils. ' +
			HOUSE,
		alt: 'Bird’s-eye Jolbon packed-earth yard: giwa hall bar, two tiny archers, one mark-stake'
	},
	{
		id: 'jumong-songyang-draw',
		prompt:
			'Minimal iconic 16:9. Worm’s-eye Jumong full-draw grinning; Song Yang pine-ochre too close to the stake. Bow as black arc. Black pupils. ' +
			HOUSE,
		alt: 'Worm’s-eye: Jumong full-draw grinning; Song Yang a pine-ochre stamp at the stake'
	},
	{
		id: 'songyang-shot-short',
		prompt:
			'Minimal iconic 3:4. Dutch ECU Song Yang after an honest short shot. Failed arrow as horizontal. Black pupils. ' +
			HOUSE,
		alt: 'Dutch ECU: Song Yang after the shot, honest miss, pine-ochre silk'
	},
	{
		id: 'jumong-songyang-win',
		prompt:
			'Minimal iconic 16:9. OTS Song Yang yielding; Jumong tiny red at the far mark. Empty packed earth as plane. Black pupils. ' +
			HOUSE,
		alt: 'OTS: Song Yang yielding; Jumong tiny red at the far mark; giwa hall a dark bar'
	},
	{
		id: 'jumong-founding-dawn-wide',
		prompt:
			'Minimal iconic 16:9. Bird’s-eye dawn Jolbon courtyard, five fire-pits, tiny king in red. Hall as dark wedge. Black pupils. ' +
			HOUSE,
		alt: 'Bird’s-eye dawn: Jolbon timber courtyard, five cold fire-pits, tiny king in red'
	},
	{
		id: 'jumong-cave-dawn-ots',
		prompt:
			'Minimal iconic 3:4. OTS kneeling Jumong; hard dawn gold plane through the cavern mouth; Haemosu in the seam. Mortal/divine split. Black pupils. ' +
			HOUSE,
		alt: 'OTS Jumong kneeling: cavern mouth, hard dawn gold plane, Haemosu in the seam'
	},
	{
		id: 'jumong-king-queen-timber',
		prompt:
			'Minimal iconic 16:9. Worm’s-eye Jolbon hall: King Dongmyung and Queen Sosuno, empty packed earth as a dark wedge. Two accents #e8563f and #e8a04a. Black pupils. ' +
			HOUSE,
		alt: 'Worm’s-eye Jolbon hall: King Dongmyung and Queen Sosuno, vermilion posts, empty packed earth'
	},
	{
		id: 'jumong-death-bow',
		prompt:
			'Minimal iconic 3:4. Dutch empty Jolbon yard: bow as a hard red line on packed earth; king a small lower-third stamp. Black pupils. ' +
			HOUSE,
		alt: 'Dutch empty Jolbon yard: bow on packed earth as a hard red line'
	},
	{
		id: 'sosuno-seq-love-void',
		prompt:
			'Minimal iconic 16:9 crushed BLACK void. Sosuno lower third, stern cracking to want, dusty-rose #e8a04a. Jumong MUST be in frame as a tiny red #e8563f grin. Black pupils. ' +
			HOUSE,
		alt: 'Crushed-black void: Sosuno lower-third cracking to want; Jumong a tiny red grin',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong']
	},
	{
		id: 'sosuno-seq-love-ecu',
		prompt:
			'Minimal iconic 3:4 ECU Sosuno eyes/mouth, blown black pupils, dusty-rose rim. Jumong’s red grin in the pupil or bokeh. FACE from ch_sosuno. ' +
			HOUSE,
		alt: 'ECU Sosuno eyes and mouth, black pupils blown; Jumong a red reflection',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong']
	},
	{
		id: 'sosuno-seq-think-void',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8a04a',
		at: 'In her head the ledger is not grain',
		people: ['sosuno', 'jumong'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		prompt:
			'Minimal iconic 16:9 crushed BLACK void. Sosuno blush, bitten lip, Little Sosuno in her head. Jumong a red #e8563f grin in the void. Dusty-rose vs red planes. Black pupils. SFW. ' +
			HOUSE,
		alt: 'Black void: Sosuno’s lustful internal look; Jumong a red grin, person-as-hex'
	},
	{
		id: 'sosuno-seq-snap-chin',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8a04a',
		at: "It's not like that. Worker.",
		people: ['sosuno', 'jumong'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		prompt:
			'Minimal iconic 16:9. Low dutch Jolbon yard. Sosuno snaps back: chin up, cold, dusty-rose, pointing a ditch. Jumong tiny red worker. Black pupils. ' +
			HOUSE,
		alt: 'Dutch yard: Sosuno chin-up again, pointing the ditch; Jumong a tiny red worker'
	},
	{
		id: 'sosuno-seq-hunt-wide',
		prompt:
			'Minimal iconic 16:9. Worm’s-eye. Sosuno chin-up running the hunt, dusty-rose, pointing spear-count. Tiny ranks. Arm as diagonal. Black pupils. ' +
			HOUSE,
		alt: 'Worm’s-eye: Sosuno poster-scale on packed earth, spear-count, chin up'
	}
];

for (const s of slots) upsert(s);

const snapP = {
	kind: 'p',
	html: "Then the chin slams back into place like a gate-bar. Girl-boss face. Spear-count. <b>It's not like that. Worker.</b> She hates how close the other voice got.",
	ko: '그러다 턱이 빗장처럼 다시 올라간다. 맏딸 얼굴. 창 점고. <b>그런 거 아니거든. 일꾼.</b> 다른 목소리가 얼마나 가까웠는지가 싫다.'
};
const snapDlg = {
	kind: 'dialogue',
	person: 'sosuno',
	chip: '#e8a04a',
	en: [
		"It's not like that. Worker.",
		"He's a worker. Mine.",
		'Ditch. The west line is still short.',
		"Don't look at me like I cracked."
	],
	lines: [
		'그런 거 아니거든.',
		'일꾼이야. 내 일꾼.',
		'도랑. 서쪽은 아직 모자라.',
		'내가 금 간 것처럼 보지 마.'
	]
};

const idx = entry.blocks.findIndex(
	(b) =>
		b.kind === 'dialogue' &&
		b.person === 'yeontabal' &&
		Array.isArray(b.en) &&
		b.en[0] === 'Sosuno.' &&
		b.en[1] === 'The line.'
);
if (idx < 0) throw new Error('insert point not found');
const already = entry.blocks.some(
	(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes("It's not like that. Worker.")
);
if (!already) entry.blocks.splice(idx, 0, snapP, snapDlg);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched Jumong images + snap-back beat; images now', entry.images.length);
