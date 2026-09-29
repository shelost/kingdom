/**
 * Jumong egg-ordeal cinema: Geumwa tries to destroy the egg;
 * nature protects it; hatch unveil.
 * node scripts/.cache/patch-egg-ordeal-cinema.mjs
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

const SET = ['/pl_buyeo_yard.png'];
const GEUMWA = ['/ch_geumwa.png', '/pl_buyeo_yard.png'];
const YUHWA = ['/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_buyeo_yard.png'];

const slots = [
	{
		id: 'egg-ordeal-recoil',
		ratio: 1.778,
		tone: '#a89a72',
		at: 'Geumwa has the egg taken from her',
		alt: 'Dutch Buyeo hall: Geumwa recoiling from a glossy pale egg, red-burgundy sleeve flung, hall timber crushed black',
		refs: GEUMWA,
		people: ['geumwa'],
		prompt:
			'Dutch hall. ONE Geumwa recoiling, not a standing portrait. Glossy realistic pale egg as the white/#8fc4e0 plane. Red-burgundy court silk. #a89a72 dirt rim. LOCK pl_buyeo_yard doorway. Muted crushed timber. No clone kings. No text.'
	},
	{
		id: 'egg-ordeal-hurl',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'Geumwa has the egg taken from her',
		alt: 'Dutch motion: Geumwa mid-hurl, glossy egg flying toward the sty, action lines, muted Buyeo yard',
		refs: GEUMWA,
		people: ['geumwa'],
		prompt:
			'Dutch motion still. ONE Geumwa mid-hurl. Glossy realistic egg as flying oval, action lines, specular highlight. LOCK pl_buyeo_yard packed earth, grey-giwa hall as dark bar. #8fc4e0 egg-plane. Red-burgundy silk not gold. No clone. No text.'
	},
	{
		id: 'egg-ordeal-road-worm',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'Cattle and horses step around it',
		alt: 'Worm’s-eye: glossy egg huge in foreground; cattle and horse hooves parting around it; Buyeo packed earth',
		refs: SET,
		people: [],
		prompt:
			'Worm’s-eye iconic. Glossy realistic pale egg owns the lower frame as a hard white/#8fc4e0 plane. Hooves parting above, action lines. MUTED packed-earth road. LOCK pl_buyeo_yard hall as dark bar. No people. No cartoon egg. No text.'
	},
	{
		id: 'egg-ordeal-birds-dive',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'Birds cover it with their wings',
		alt: 'Dutch dusk field: dark birds diving toward one glossy egg, wing-arcs and action lines, muted Buyeo hall bar',
		refs: SET,
		people: [],
		prompt:
			'Dutch dusk dive. Dark birds diving, wing-arcs, action lines. ONE glossy realistic pale egg as the ice-blue #8fc4e0 stamp. MUTED field, crushed dusk, LOCK pl_buyeo_yard grey-giwa hall peek. No white-dove circle. No even daylight. No text.'
	},
	{
		id: 'egg-ordeal-axe',
		ratio: 1.778,
		tone: '#a89a72',
		at: 'The axe will not split the egg',
		alt: 'Dutch: Geumwa mid-swing, axe stopped on a glossy unhurt egg; Buyeo packed earth',
		refs: GEUMWA,
		people: ['geumwa'],
		prompt:
			'Dutch mid-swing. ONE Geumwa, axe verb-pose, not a standing clone. Glossy realistic egg unhurt as white plane. Spark on steel. Red-burgundy silk. #a89a72 rim. LOCK pl_buyeo_yard. Muted yard. No text.'
	},
	{
		id: 'egg-ordeal-axe-spark',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'The axe will not split the egg',
		alt: 'Close dutch: axe-edge spark on glossy unhurt shell; Geumwa recoiling in bokeh',
		refs: GEUMWA,
		people: ['geumwa'],
		prompt:
			'Close dutch ECU. Axe edge + spark on glossy realistic pale shell — egg unhurt, hard white/#8fc4e0 specular plane. ONE Geumwa recoiling in creamy bokeh. Red-burgundy sleeve. Muted crushed black. No gold plate. No text.'
	},
	{
		id: 'egg-ordeal-return',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'Yuhwa wraps it warm',
		alt: 'Intimate: Yuhwa’s ice-blue court-silk hands receiving the glossy egg; timber hatch-room',
		refs: YUHWA,
		people: ['yuhwa'],
		prompt:
			'Intimate close. ONE Yuhwa, ice-blue COURT silk not river wrap. Hands receiving ONE glossy realistic pale egg as #8fc4e0 plane. FACE and binyeo from attached. Doorway to Buyeo yard in bokeh. LOCK pl_buyeo_yard. No clone. No text.'
	},
	{
		id: 'egg-ordeal-crack',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'Then the shell goes',
		alt: 'Intimate dutch: glossy shell cracking, wet newborn boy unveiled, ice-blue sleeve at the edge',
		refs: YUHWA,
		people: ['yuhwa', 'jumong'],
		prompt:
			'Intimate dutch unveil. Glossy realistic pale shell cracking — wet newborn boy, not a painted doll. ONE Yuhwa ice-blue COURT silk sleeve at the edge. FACE/binyeo from attached. #8fc4e0 crack-plane. Timber hatch, muted. No adult Jumong face. No text.'
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

// Remake weak plates that fight the glossy-egg lock
const remakes = {
	'egg-ordeal-sty': {
		tone: '#8fc4e0',
		at: 'Dogs and pigs will not eat it',
		alt: 'Iconic muted sty: glossy pale egg center; dogs and pigs recoiling; Buyeo timber bokeh',
		refs: SET,
		people: [],
		prompt:
			'Iconic muted sty. ONE glossy realistic pale egg as the hard white/#8fc4e0 plane. Dogs and pigs recoiling, turning, action lines — they will not eat it. LOCK pl_buyeo_yard timber, grey-giwa hall as dark bar. Crushed dusk, few hues. No cartoon Easter egg. No even daylight. No text.'
	},
	'egg-ordeal-road': {
		tone: '#8fc4e0',
		at: 'Cattle and horses step around it',
		alt: 'Iconic packed-earth road: glossy egg; cattle and horses stepping around; hall as dark bar',
		refs: SET,
		people: [],
		prompt:
			'Iconic road. ONE glossy realistic pale egg as white/#8fc4e0 plane. Cattle and horses stepping around, hooves parting, action lines. LOCK pl_buyeo_yard packed earth, grey-giwa hall as dark bar. Muted dusk. No empty yard without beasts. No text.'
	},
	'egg-ordeal-birds': {
		tone: '#8fc4e0',
		at: 'Birds cover it with their wings',
		alt: 'Iconic dusk field: dark birds wing-arc covering one glossy egg; muted Buyeo hall peek',
		refs: SET,
		people: [],
		prompt:
			'Iconic dusk. ONE device: a WING-ARC covering. Dark birds (not white doves in a circle) cover ONE glossy realistic pale egg. #8fc4e0 egg-plane. MUTED field, crushed dusk, LOCK pl_buyeo_yard hall peek. No even green postcard. No text.'
	},
	'jumong-buyeo-hatch': {
		tone: '#8fc4e0',
		at: 'out of the egg comes a baby boy',
		alt: 'Intimate timber hatch: wet newborn boy beside cracked glossy shell, Yuhwa ice-blue court silk, doorway to Buyeo yard',
		refs: YUHWA,
		people: ['yuhwa', 'jumong'],
		prompt:
			'Intimate 16:9. Wet newborn boy, not a painted doll, beside cracked glossy realistic shell. ONE Yuhwa kneeling in ice-blue COURT silk (not river wrap). FACE and binyeo from attached. Doorway to Buyeo yard in bokeh. #8fc4e0 as plane not halo. LOCK pl_buyeo_yard. No adult Jumong face. No text.'
	},
	'jumong-buyeo-hatch-worm': {
		tone: '#e8563f',
		at: 'He looks up from the shell',
		alt: 'Worm’s-eye from the shell: wet newborn looking up; Yuhwa ice-blue court silk as the first roof; Buyeo doorway',
		refs: YUHWA,
		people: ['yuhwa', 'jumong'],
		prompt:
			'Worm’s-eye intimate. Wet newborn boy looking UP from broken glossy shell — living infant, not shards only. ONE Yuhwa above in ice-blue COURT silk as a sleeve-roof. FACE/binyeo from attached. Doorway to yard. Red #e8563f seam as plane not halo. No inverted fashion plate. No text.'
	},
	'jumong-buyeo-hatch-hold': {
		tone: '#8fc4e0',
		at: "Yuhwa’s ice-blue sleeve is the first roof",
		alt: 'Intimate OTS: Yuhwa in ice-blue court silk, sleeve as first roof over a wet newborn; Buyeo dusk in the doorway',
		refs: YUHWA,
		people: ['yuhwa', 'jumong'],
		prompt:
			'Intimate OTS. ONE Yuhwa in ice-blue COURT silk — sleeve as the first roof over a wet newborn. Not a bare back. Not river wrap. FACE and wave-binyeo from attached. Doorway to yard. #8fc4e0 sleeve-plane. LOCK pl_buyeo_yard. No clone. No text.'
	}
};

for (const [id, patch] of Object.entries(remakes)) {
	const i = j.images.findIndex((im) => im.id === id);
	if (i < 0) throw new Error(`missing remake target ${id}`);
	j.images[i] = { ...j.images[i], ...patch };
	report[id] = 'remake-meta';
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

let seq = fs.readFileSync(SEQ, 'utf8');
const oldBlock = `{ id: 'jumong-buyeo-egg', role: 'the egg', angle: 'dutch room', at: 'Yuhwa lays a great egg' },
			{ id: 'egg-ordeal-sty', role: 'sty refuses', angle: 'iconic stamp', at: 'Dogs and pigs will not eat it' },
			{ id: 'egg-ordeal-road', role: 'hooves part', angle: 'iconic road', at: 'Cattle and horses step around it' },
			{ id: 'egg-ordeal-birds', role: 'birds cover', angle: 'field wide', at: 'Birds cover it with their wings' },
			{ id: 'egg-ordeal-axe', role: 'axe fails', angle: 'dutch axe', at: 'The axe will not split the egg' },`;

const newBlock = `{ id: 'jumong-buyeo-egg', role: 'the egg', angle: 'dutch room', at: 'Yuhwa lays a great egg' },
			{ id: 'egg-ordeal-recoil', role: 'omen — get rid of it', angle: 'dutch hall recoil', at: 'Geumwa has the egg taken from her' },
			{ id: 'egg-ordeal-hurl', role: 'hurled at the sty', angle: 'dutch motion hurl', at: 'Geumwa has the egg taken from her' },
			{ id: 'egg-ordeal-sty', role: 'sty refuses', angle: 'iconic stamp', at: 'Dogs and pigs will not eat it' },
			{ id: 'egg-ordeal-road', role: 'hooves part', angle: 'iconic road', at: 'Cattle and horses step around it' },
			{ id: 'egg-ordeal-road-worm', role: 'worm’s-eye egg', angle: 'worm’s-eye hooves', at: 'Cattle and horses step around it' },
			{ id: 'egg-ordeal-birds-dive', role: 'birds dive', angle: 'dutch dive', at: 'Birds cover it with their wings' },
			{ id: 'egg-ordeal-birds', role: 'wing-arc cover', angle: 'iconic wing-arc', at: 'Birds cover it with their wings' },
			{ id: 'egg-ordeal-axe', role: 'axe fails', angle: 'dutch mid-swing', at: 'The axe will not split the egg' },
			{ id: 'egg-ordeal-axe-spark', role: 'spark — shell unhurt', angle: 'close dutch spark', at: 'The axe will not split the egg' },
			{ id: 'egg-ordeal-return', role: 'returned to Yuhwa', angle: 'intimate hands', at: 'Yuhwa wraps it warm' },`;

if (!seq.includes(oldBlock)) {
	throw new Error('movieSequences egg block not found — film order may have drifted');
}
seq = seq.replace(oldBlock, newBlock);

const hatchNeedle = `{ id: 'buyeo-seq-hatch-room-wide', role: 'hatch geography', angle: 'wide room+yard door', at: 'The hatch-room opens onto the yard' },
			{ id: 'jumong-buyeo-hatch', role: 'hatch', angle: 'close 16:9 seam', at: 'out of the egg comes a baby boy' },`;
const hatchInsert = `{ id: 'buyeo-seq-hatch-room-wide', role: 'hatch geography', angle: 'wide room+yard door', at: 'The hatch-room opens onto the yard' },
			{ id: 'egg-ordeal-crack', role: 'shell crack unveil', angle: 'intimate dutch crack', at: 'Then the shell goes' },
			{ id: 'jumong-buyeo-hatch', role: 'hatch', angle: 'close 16:9 seam', at: 'out of the egg comes a baby boy' },`;

if (!seq.includes(hatchNeedle)) {
	throw new Error('movieSequences hatch needle missing');
}
if (!seq.includes("id: 'egg-ordeal-crack'")) {
	seq = seq.replace(hatchNeedle, hatchInsert);
}

fs.writeFileSync(SEQ, seq);
console.log(JSON.stringify(report, null, 2));
