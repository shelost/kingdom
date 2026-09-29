import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

let entry;
for (const ch of story) {
	for (const en of ch.entries ?? []) {
		if (en.title === 'Jumong') {
			entry = en;
			break;
		}
	}
	if (entry) break;
}
if (!entry) throw new Error('Jumong entry not found');

const slots = [
	{
		id: 'jumong-night-run-dutch',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'He runs until the pines smear',
		alt: 'Dutch night pines: Jumong mid-stride running, scared, clean-shaven red silk, trunks as a tilted cage',
		refs: ['/ch_jumong.png', '/temp/jumong-set-forest-path-dutch.jpg'],
		people: ['jumong'],
		prompt:
			'Dutch night pine path. Jumong CLEAN-SHAVEN mid-stride RUN, scared open mouth, red #e8563f silk + red headband from portrait. ONE device: trunks as a tilted cage. LOCK forest dirt path. No gods. No army catalog. No mustache. No text.'
	},
	{
		id: 'jumong-night-run-aerial',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'The pines are a net from above',
		alt: 'Aerial crane: pine canopy as a net, tiny red Jumong running the dirt floor',
		refs: ['/ch_jumong.png', '/temp/jumong-set-forest-empty.jpg'],
		people: ['jumong'],
		prompt:
			'Aerial crane night. Pine canopy NET. Tiny crimson #e8563f Jumong running the dirt. CLEAN-SHAVEN. FACE suggestion from portrait only. No army catalog. No gods. No text.'
	},
	{
		id: 'jumong-night-run-ots',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'The net is spears in the dark',
		alt: 'OTS anonymous spear-hafts: Jumong a red smear running away down the pine path',
		refs: ['/ch_jumong.png', '/temp/jumong-set-forest-path-dutch.jpg'],
		people: ['jumong'],
		prompt:
			'Over-shoulder night. Foreground: anonymous spear-hafts only, NO faces, not Jumong clones. Midground: Jumong running away, CLEAN-SHAVEN red #e8563f. ONE device: spear-hafts as bars. No named soldiers. No gods. No text.'
	},
	{
		id: 'jumong-night-army-net',
		ratio: 1.778,
		nsfw: false,
		tone: '#1a2233',
		at: 'The forest is a closing net',
		alt: 'Bird’s-eye pine net: tiny anonymous spear-dots closing, one red gap',
		refs: ['/ch_jumong.png', '/temp/jumong-set-forest-empty.jpg'],
		people: ['jumong'],
		prompt:
			'Bird’s-eye night. Pine canopy as a closing NET. Tiny anonymous spear-dots, NO faces. One tiny red #e8563f stamp in the gap. No army catalog. No named people. No gods. No text.'
	},
	{
		id: 'jumong-night-army-points',
		ratio: 1.778,
		nsfw: false,
		tone: '#1a2233',
		at: 'The net is spears in the dark',
		alt: 'Low dutch: iron spear-points only in crushed pine dark, red lower-third blur ahead',
		refs: ['/temp/jumong-set-forest-night-stars.jpg'],
		people: [],
		prompt:
			'Low dutch night. ONLY spear-points as a black-iron row in crushed pine dark. Jumong a red #e8563f lower-third blur ahead, no readable face. NO face dump. Tiny anonymous silhouettes. No gods. No text.'
	},
	{
		id: 'jumong-night-trip',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'A root. He goes down.',
		alt: 'Dutch: Jumong mid-trip, toe on a root, body pitching, scared open mouth, clean-shaven',
		refs: ['/ch_jumong.png', '/temp/jumong-set-forest-path-dutch.jpg'],
		people: ['jumong'],
		prompt:
			'Dutch night dirt. Jumong CLEAN-SHAVEN mid-TRIP, toe catching a root, body pitching forward, scared open mouth. Red #e8563f silk. ONE device: root as a dark trip-bar. No gods. No mustache. No text.'
	},
	{
		id: 'jumong-night-face-dirt',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'His cheek is in the grit',
		alt: 'ECU: Jumong’s clean-shaven cheek smashed in grit, one eye squeezed, wrecked',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt:
			'Intimate ECU night. Jumong CLEAN-SHAVEN cheek smashed in grit/mud, one eye squeezed, wrecked. Red #e8563f as a dirt-stamped accent. FACE from portrait, no mustache. No gods. Eyeline in dirt. No text.'
	},
	{
		id: 'jumong-night-eyes-roll',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'His eyes roll',
		alt: 'ECU Jumong: eyes rolling back, about to die, mouth slack, rain grit, clean-shaven',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt:
			'ECU night. Jumong CLEAN-SHAVEN, eyes rolling back, about-to-die, mouth slack, rain grit. Expressive, not serene. Red #e8563f. FACE from portrait, no mustache. No gods in frame. No text.'
	},
	{
		id: 'jumong-night-unconscious',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'The day is almost collected',
		alt: 'Low: face-down crimson Jumong slack on wet stones, bow a pace off, river a black bar',
		refs: ['/ch_jumong.png', '/pl_white_river.png'],
		people: ['jumong'],
		prompt:
			'Low night. Face-down slack Jumong, CLEAN-SHAVEN, crimson #e8563f, bow a pace off. River as a black bar. LOCK pl_white_river banks/reeds/hills only — NO boats, NO pier. Eyes shut. No gods. No text.'
	},
	{
		id: 'jumong-night-reaper-over',
		ratio: 1.778,
		nsfw: false,
		tone: '#6b5b6e',
		at: 'He does not see who comes for it',
		alt: 'Haewonmek crouched over face-down unconscious Jumong; gat brim a black bar; Jumong eyes shut in mud',
		refs: ['/ch_haewonmek.png', '/ch_jumong.png', '/pl_white_river.png'],
		people: ['haewonmek', 'jumong'],
		prompt:
			'Low two-shot night rain. Haewonmek over UNCONSCIOUS face-down Jumong. Jumong eyes SHUT in mud, FACE in dirt — he does NOT look at the gat, does NOT see the reaper. Camera sees black gat, mouth-band, cobalt sash. ONE device: gat brim as a black bar over the body. Jumong CLEAN-SHAVEN #e8563f. NO boats. NO eye contact. No text.'
	},
	{
		id: 'jumong-night-gold-plane-arrive',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'Then a flash, as if dawn had forgotten',
		alt: 'Gold light-plane cuts rain; chariot stamp; Jumong face-down eyes shut; Haewonmek mid-strike',
		refs: [
			'/ch_haemosu.png',
			'/ch_haewonmek.png',
			'/ch_jumong.png',
			'/obj_haemosu_chariot.png',
			'/pl_white_river.png'
		],
		people: ['haemosu', 'haewonmek', 'jumong'],
		prompt:
			'Dutch night. Gold #f0b429 LIGHT-PLANE (never body-halo) tears the rain. SAME five-dragon wheeled chariot as a stamp. Jumong FACE-DOWN, eyes shut, eyeline dirt — he does NOT see Haemosu or Haewonmek. Haewonmek mid-strike over him. Mortal painterly vs divine more-present. NO halo. NO boats. No text.'
	},
	{
		id: 'jumong-night-wrist-unconscious',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'A hand closes on Haewonmek’s wrist',
		alt: 'Haemosu gold-plane wrist-stop; Jumong still face-down, eyes on grit, not looking at either god',
		refs: ['/ch_haemosu.png', '/ch_haewonmek.png', '/ch_jumong.png', '/pl_white_river.png'],
		people: ['haemosu', 'haewonmek', 'jumong'],
		prompt:
			'Dutch mid. Haemosu locks Haewonmek’s wrist. Gold #f0b429 as a LIGHT-PLANE only, NEVER body-halo. Jumong still face-down / eyes on grit — he does NOT look at either god, does NOT reach, no eye contact. Mortal painterly Jumong vs divine gods. CLEAN-SHAVEN. NO boats. No text.'
	},
	{
		id: 'jumong-night-whisper-behind',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'Jumong cannot see him',
		alt: 'Haemosu at Jumong’s ear from behind; Jumong stares at empty dark river, confused, not turning',
		refs: ['/ch_haemosu.png', '/ch_jumong.png', '/pl_white_river.png'],
		people: ['haemosu', 'jumong'],
		prompt:
			'Close two-shot night. Haemosu at the EAR FROM BEHIND. Jumong’s face toward EMPTY dark / river, confused, NOT turning, NOT looking at the gold man. Gold #f0b429 as a thin plane on Haemosu only, NEVER body-halo. Jumong CLEAN-SHAVEN #e8563f. HARD RULE: Jumong does not see the gods. NO boats. No text.'
	},
	{
		id: 'jumong-night-whisper-grit',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'The idea arrives as breath',
		alt: 'ECU Jumong: eyes on grit and empty dark, confused, mouth parted; Haemosu lips only at the ear edge',
		refs: ['/ch_jumong.png', '/ch_haemosu.png'],
		people: ['jumong', 'haemosu'],
		prompt:
			'ECU Jumong night. Eyes on grit / empty dark, confused, mouth parted. Haemosu lips at the EAR EDGE of frame or bokeh behind — Jumong does NOT turn, does NOT look at him. CLEAN-SHAVEN. Red #e8563f. Gold as a sliver-plane, no halo. HARD RULE: Jumong does not see the gods. No text.'
	},
	{
		id: 'jumong-night-inspire-forward',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'The idea arrives as breath',
		alt: 'Jumong’s face changing fear-to-idea while looking down at the black river, not aside at any god',
		refs: ['/ch_jumong.png', '/pl_white_river.png'],
		people: ['jumong'],
		prompt:
			'Close dutch night. Jumong’s FACE CHANGES — fear to idea — looking FORWARD/DOWN at the black river, NOT aside at a god. CLEAN-SHAVEN. Red #e8563f. Gods absent or only far rear bokeh. HARD RULE: Jumong does not see the gods; eyeline is water. LOCK banks only, NO boats. No text.'
	},
	{
		id: 'jumong-night-inspire-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'The idea arrives as breath',
		alt: 'ECU Jumong: pupils, the idea arriving, looking down at water, not at a god',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt:
			'ECU night. Jumong CLEAN-SHAVEN, the idea arriving in the eyes, looking DOWN at water, not aside. Red #e8563f. No god in frame. HARD RULE: eyeline away from Haemosu and Haewonmek. No mustache. No text.'
	},
	{
		id: 'jumong-night-shout-worm',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'Make way for me!',
		alt: 'Worm’s-eye: Jumong’s open mouth shouting at the night ford, river as a black plane',
		refs: ['/ch_jumong.png', '/pl_white_river.png', '/temp/jumong-turtle-night.jpg'],
		people: ['jumong'],
		prompt:
			'Worm’s-eye night. Jumong CLEAN-SHAVEN open mouth shouting at the FORD, not at a father. River as a black plane. Red #e8563f. Gods only in far bokeh behind if present — Jumong eyeline is WATER. LOCK 자라 later; this beat is the shout at empty black water. NO boats. No text.'
	},
	{
		id: 'jumong-night-shout-dutch',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'Make way for me!',
		alt: 'Dutch toward the ford: Jumong shouting at the water, bow high; gods only tiny bokeh behind',
		refs: ['/ch_jumong.png', '/pl_white_river.png', '/temp/jumong-turtle-night.jpg'],
		people: ['jumong'],
		prompt:
			'Dutch toward water. Jumong CLEAN-SHAVEN shouting Make way at the FORD, bow high, looking at the river not at gods. Red #e8563f. Gods only tiny bokeh BEHIND if present. HARD RULE: Jumong does not see the gods. LOCK banks/reeds — NO boats NO pier. Dark water, spaced 자라 later. No text.'
	}
];

const have = new Set(entry.images.map((im) => im.id));
let added = 0;
for (const slot of slots) {
	if (have.has(slot.id)) continue;
	entry.images.push(slot);
	have.add(slot.id);
	added++;
}

const newP = {
	kind: 'p',
	html: 'He takes the river path alone. <b>The net is spears in the dark.</b> <b>He runs until the pines smear.</b> <b>A root. He goes down.</b> <b>His cheek is in the grit.</b> <b>His eyes roll.</b> <b>The day is almost collected.</b> <b>He does not see who comes for it.</b>',
	ko: '강길만 혼자 간다. <b>그물은 어둠 속 창끝이다.</b> <b>소나무가 한 줄로 번질 때까지 달린다.</b> <b>뿌리. 넘어진다.</b> <b>뺨이 흙에 박힌다.</b> <b>눈이 뒤집힌다.</b> <b>오늘이 거의 거둬진다.</b> <b>누가 오는지 보지 못한다.</b>'
};

const idx = entry.blocks.findIndex((b) => b.html?.includes('Jumong reaches the water alone'));
if (idx < 0) throw new Error('water paragraph not found');
const already = entry.blocks.some((b) => b.html?.includes('He runs until the pines smear'));
if (!already) entry.blocks.splice(idx, 0, newP);

const water = entry.blocks[already ? idx : idx + 1];
if (water?.html?.includes('Jumong reaches the water alone') && !water.html.includes('already down')) {
	water.html = water.html.replace(
		'<b>Jumong reaches the water alone.</b> Night.',
		'<b>Jumong reaches the water alone</b> — already down on the near stones. Night.'
	);
	water.ko = water.ko.replace(
		'<b>주몽만 물에 닿는다.</b> 밤.',
		'<b>주몽만 물에 닿는다</b> — 이미 가까운 쪽 돌 위에 쓰러져 있다. 밤.'
	);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`added ${added} slots; prose ${already ? 'already present' : 'inserted'} at ${idx}`);
