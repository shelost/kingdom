/**
 * Jumong egg-ordeal action plates: kinetic discard (hurl / cliff / birds carry).
 * node scripts/.cache/patch-egg-ordeal-action.mjs
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

const SET = ['/pl_buyeo_yard.png', '/temp/egg-ordeal-hurl.jpg', '/temp/egg-ordeal-sty.jpg'];
const GEUMWA = ['/ch_geumwa.png', '/pl_buyeo_yard.png', '/temp/egg-ordeal-hurl.jpg'];

const slots = [
	{
		id: 'egg-ordeal-windup',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'He winds up',
		alt: 'Close dutch: Geumwa’s red-burgundy hand winding back, glossy pale egg leaving the palm, motion blur',
		refs: GEUMWA,
		people: ['geumwa'],
		prompt:
			'Dutch ECU wind-up. ONE Geumwa, red-burgundy sleeve flung back, not a standing clone. ONE glossy realistic pale egg just leaving the palm — wet specular, motion blur on fingers. Egg as the #8fc4e0 plane. #a89a72 dirt rim. LOCK pl_buyeo_yard packed earth bokeh, grey-giwa hall as dark bar. No clone kings. No gold plate. No text.'
	},
	{
		id: 'egg-ordeal-air',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'then hurls it',
		alt: 'Dutch motion: one glossy egg mid-air across the muted Buyeo yard, action lines, tiny Geumwa in the lower third',
		refs: GEUMWA,
		people: ['geumwa'],
		prompt:
			'Dutch motion-blur mid-air. ONE glossy realistic pale egg owns the frame as a bright #8fc4e0 oval — wet specular streak, action lines. MUTED crushed Buyeo yard. Tiny ONE Geumwa in the lower third after the throw, red-burgundy silk not gold. LOCK pl_buyeo_yard grey-giwa hall as dark bar. No clone kings. No text.'
	},
	{
		id: 'egg-ordeal-cast-cliff',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'He casts it off the palisade',
		alt: 'Worm’s-eye: glossy egg in air over a packed-earth palisade drop beside the Buyeo yard, tiny Geumwa mid-cast',
		refs: GEUMWA,
		people: ['geumwa'],
		prompt:
			'Worm’s-eye from below the palisade. ONE glossy realistic pale egg in mid-air over a packed-earth drop / timber palisade edge NEXT TO the Buyeo yard — same hall bar, same dusk, not a mountain. ONE device: the palisade as a dark horizontal cut. Tiny ONE Geumwa at the rim, mid-cast, red-burgundy. Egg as #8fc4e0 plane. MUTED drop, crushed blacks. No Chinese cliff. No clone. No text.'
	},
	{
		id: 'egg-ordeal-fall',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'The egg falls',
		alt: 'Aerial dutch: one glossy egg falling, specular streak over a muted packed-earth drop and palisade',
		refs: SET,
		people: [],
		prompt:
			'Aerial high dutch. ONE glossy realistic pale egg falling — wet specular streak as a white/#8fc4e0 slash through crushed dusk. MUTED packed-earth drop and timber palisade below, Buyeo hall as a dark stamp. Motion blur, action lines. Egg never cracks. No people. No mountain. No text.'
	},
	{
		id: 'egg-ordeal-land',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'It lands unhurt',
		alt: 'Worm’s-eye: glossy pale egg just landed on packed earth, dust burst, still unhurt and wet-specular',
		refs: SET,
		people: [],
		prompt:
			'Worm’s-eye land. ONE glossy realistic pale egg just hit packed earth — dust burst, still wet-specular, unhurt. #8fc4e0 egg-plane. MUTED Buyeo yard, grey-giwa hall as dark bar. #a89a72 dirt. No crack. No people. No text.'
	},
	{
		id: 'egg-ordeal-second-hurl',
		ratio: 1.778,
		tone: '#a89a72',
		at: 'He throws it again',
		alt: 'Dutch: Geumwa mid-second-throw, red-burgundy sleeve flung, glossy egg leaving the hand again',
		refs: GEUMWA,
		people: ['geumwa'],
		prompt:
			'Dutch second throw. ONE Geumwa mid-hurl, red-burgundy sleeve flung, verb pose not a portrait clone. ONE glossy realistic pale egg leaving the hand. #8fc4e0 egg-plane. #a89a72 dirt rim. LOCK pl_buyeo_yard packed earth, hall as dark bar. No gold plate. No clone kings. No text.'
	},
	{
		id: 'egg-ordeal-bounce',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'It bounces',
		alt: 'Dutch low: one glossy egg bouncing on packed earth, motion arc and dust, still unhurt',
		refs: SET,
		people: [],
		prompt:
			'Dutch low bounce. ONE glossy realistic pale egg bouncing on packed earth — motion arc, dust, still wet-specular, unhurt. #8fc4e0 egg-plane. MUTED Buyeo yard, hall as dark bar. ONE device: the bounce-arc. No people. No crack. No text.'
	},
	{
		id: 'egg-ordeal-birds-seize',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'Birds seize it',
		alt: 'Aerial: dark birds seize one glossy egg in talons and carry it off over the muted Buyeo yard',
		refs: SET,
		people: [],
		prompt:
			'Aerial seize. Dark birds SEIZE ONE glossy realistic pale egg in talons and carry it off — wing-arcs, motion lines, talons locked. Egg as the bright #8fc4e0 oval in claws. MUTED Buyeo yard far below, grey-giwa hall stamp. Birds carry; they do NOT peck it open. No white doves. No people. No text.'
	},
	{
		id: 'egg-ordeal-birds-flight',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'They carry it',
		alt: 'Dutch wing-storm: dark birds covering the glossy egg with wings while carrying it in flight over the palisade',
		refs: SET,
		people: [],
		prompt:
			'Dutch wing-storm in flight. Dark birds COVER the egg with wings WHILE carrying — wing-arc storm, motion. ONE glossy realistic pale egg still whole in the cluster as #8fc4e0 plane. MUTED sky, Buyeo palisade as a thin dark line below. They do NOT peck it open. No white-dove circle. No people. No text.'
	},
	{
		id: 'egg-ordeal-drop-door',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'Dropped back at her door',
		alt: 'Dutch doorstep: glossy egg dropped unhurt onto packed earth at a timber hatch-door, birds leaving in bokeh',
		refs: SET,
		people: [],
		prompt:
			'Dutch OTS doorstep. ONE glossy realistic pale egg dropped onto packed earth at a timber hatch-door — unhurt, wet specular, #8fc4e0 plane. MUTED Buyeo doorway, grey-giwa. Dark birds leaving as wing-stamps in upper bokeh. LOCK pl_buyeo_yard. No people. No crack. No text.'
	}
];

function upsert(slot) {
	const i = j.images.findIndex((im) => im.id === slot.id);
	if (i < 0) {
		j.images.push(slot);
		return 'added';
	}
	const prev = j.images[i];
	j.images[i] = {
		...prev,
		...slot,
		tempImage: prev.tempImage,
		src: prev.src
	};
	return 'updated';
}

const report = {};
for (const s of slots) report[s.id] = upsert(s);

const oldTaken = {
	html: 'Geumwa has the egg taken from her. <b>Dogs and pigs will not eat it.</b> The sty refuses the guest.',
	ko: '금와가 알을 빼앗아 간다. <b>개와 돼지가 먹지 않는다.</b> 외양간이 손님을 거절한다.'
};
const newTaken = {
	html: 'Geumwa has the egg taken from her. He winds up, then hurls it. <b>Dogs and pigs will not eat it.</b> The sty refuses the guest.',
	ko: '금와가 알을 빼앗아 간다. 팔을 젖히고, 던진다. <b>개와 돼지가 먹지 않는다.</b> 외양간이 손님을 거절한다.'
};

const oldBirds = {
	html: 'They leave it in the open field. <b>Birds cover it with their wings</b> instead of pecking. The yard goes quiet watching that.',
	ko: '들에 둔다. <b>새들이 쪼아 먹지 않고 날개로 덮는다.</b> 마당이 그걸 보고 조용해진다.'
};
const newBirds = {
	html: 'They leave it in the open field. Birds seize it. They carry it. <b>Birds cover it with their wings</b> instead of pecking. Dropped back at her door, the oval still whole. The yard goes quiet watching that.',
	ko: '들에 둔다. 새들이 낚아챈다. 가져간다. <b>새들이 쪼아 먹지 않고 날개로 덮는다.</b> 문 앞에 다시 떨어진다. 알은 그대로다. 마당이 그걸 보고 조용해진다.'
};

const cliffP = {
	kind: 'p',
	html: 'He casts it off the palisade. The egg falls and it lands unhurt, still glossy on the packed earth. He throws it again. It bounces.',
	ko: '목책 아래로 던진다. 알이 떨어지고 깨지지 않고 내려앉는다, 다진 흙 위에서 윤이 난다. 또 던진다. 튕긴다.'
};

let took = false;
let birds = false;
let cliff = false;
for (let i = 0; i < j.blocks.length; i++) {
	const b = j.blocks[i];
	if (b.kind === 'p' && b.html === oldTaken.html) {
		b.html = newTaken.html;
		b.ko = newTaken.ko;
		took = true;
		if (!j.blocks[i + 1] || j.blocks[i + 1].html !== cliffP.html) {
			j.blocks.splice(i + 1, 0, cliffP);
			cliff = true;
			i++;
		}
	}
	if (b.kind === 'p' && b.html === oldBirds.html) {
		b.html = newBirds.html;
		b.ko = newBirds.ko;
		birds = true;
	}
}

if (!took) throw new Error('taken/sty ordeal p not found');
if (!birds) throw new Error('birds ordeal p not found');

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

let seq = fs.readFileSync(SEQ, 'utf8');
const oldBlock = `{ id: 'egg-ordeal-recoil', role: 'omen — get rid of it', angle: 'dutch hall recoil', at: 'Geumwa has the egg taken from her' },
			{ id: 'egg-ordeal-hurl', role: 'hurled at the sty', angle: 'dutch motion hurl', at: 'Geumwa has the egg taken from her' },
			{ id: 'egg-ordeal-sty', role: 'sty refuses', angle: 'iconic stamp', at: 'Dogs and pigs will not eat it' },
			{ id: 'egg-ordeal-road', role: 'hooves part', angle: 'iconic road', at: 'Cattle and horses step around it' },
			{ id: 'egg-ordeal-road-worm', role: 'worm’s-eye egg', angle: 'worm’s-eye hooves', at: 'Cattle and horses step around it' },
			{ id: 'egg-ordeal-birds-dive', role: 'birds dive', angle: 'dutch dive', at: 'Birds cover it with their wings' },
			{ id: 'egg-ordeal-birds', role: 'wing-arc cover', angle: 'iconic wing-arc', at: 'Birds cover it with their wings' },
			{ id: 'egg-ordeal-axe', role: 'axe fails', angle: 'dutch mid-swing', at: 'The axe will not split the egg' },`;

const newBlock = `{ id: 'egg-ordeal-recoil', role: 'omen — get rid of it', angle: 'dutch hall recoil', at: 'Geumwa has the egg taken from her' },
			{ id: 'egg-ordeal-windup', role: 'wind-up — egg leaves the palm', angle: 'dutch ECU palm', at: 'He winds up' },
			{ id: 'egg-ordeal-hurl', role: 'hurled at the sty', angle: 'dutch motion hurl', at: 'Geumwa has the egg taken from her' },
			{ id: 'egg-ordeal-air', role: 'mid-air across the yard', angle: 'dutch motion blur', at: 'then hurls it' },
			{ id: 'egg-ordeal-cast-cliff', role: 'cast off the palisade', angle: 'worm’s-eye drop', at: 'He casts it off the palisade' },
			{ id: 'egg-ordeal-fall', role: 'falling streak', angle: 'aerial fall', at: 'The egg falls' },
			{ id: 'egg-ordeal-land', role: 'lands unhurt', angle: 'worm’s-eye dust', at: 'It lands unhurt' },
			{ id: 'egg-ordeal-sty', role: 'sty refuses', angle: 'iconic stamp', at: 'Dogs and pigs will not eat it' },
			{ id: 'egg-ordeal-road', role: 'hooves part', angle: 'iconic road', at: 'Cattle and horses step around it' },
			{ id: 'egg-ordeal-road-worm', role: 'worm’s-eye egg', angle: 'worm’s-eye hooves', at: 'Cattle and horses step around it' },
			{ id: 'egg-ordeal-second-hurl', role: 'throws again', angle: 'dutch second hurl', at: 'He throws it again' },
			{ id: 'egg-ordeal-bounce', role: 'bounce unhurt', angle: 'dutch bounce-arc', at: 'It bounces' },
			{ id: 'egg-ordeal-birds-seize', role: 'talons seize — carried off', angle: 'aerial carry', at: 'Birds seize it' },
			{ id: 'egg-ordeal-birds-dive', role: 'birds dive', angle: 'dutch dive', at: 'Birds cover it with their wings' },
			{ id: 'egg-ordeal-birds-flight', role: 'wing-storm in flight', angle: 'dutch wing-storm', at: 'They carry it' },
			{ id: 'egg-ordeal-birds', role: 'wing-arc cover', angle: 'iconic wing-arc', at: 'Birds cover it with their wings' },
			{ id: 'egg-ordeal-drop-door', role: 'dropped at her door', angle: 'dutch doorstep', at: 'Dropped back at her door' },
			{ id: 'egg-ordeal-axe', role: 'axe fails', angle: 'dutch mid-swing', at: 'The axe will not split the egg' },`;

if (!seq.includes(oldBlock)) {
	throw new Error('movieSequences egg block not found — film order may have drifted');
}
seq = seq.replace(oldBlock, newBlock);
fs.writeFileSync(SEQ, seq);

console.log(JSON.stringify({ slots: report, took, cliff, birds }, null, 2));
