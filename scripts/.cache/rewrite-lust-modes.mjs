// Reassign NSFW slot prompts: unique intimate crops vs minimal-epic. Same ids.
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const byId = new Map();
for (const ch of story) {
	for (const en of ch.entries ?? []) {
		for (const im of en.images ?? []) byId.set(im.id, im);
	}
}

function set(id, patch) {
	const im = byId.get(id);
	if (!im) throw new Error(`missing slot ${id}`);
	Object.assign(im, patch);
	im.nsfw = im.nsfw || true;
}

const EPIC =
	'Minimal vast epic cinematic still, 16:9. Tiny figures only. Hard flat color planes, white haze, wet black reflective floor, monumental emptiness. Monochrome plus ONE symbolic accent. NO faces, NO anime close-ups, NO centered couple, NO flushed portraits, NO intimate skin. Sex implied by distance and color only. Flat sky, no clouds. No readable text, no watermark.';

set('munhee-sewing-later', {
	alt: 'A later sewing visit as two tiny figures in a magenta hall; one pink silk accent',
	prompt: `${EPIC} UNIQUE LAYOUT: empty magenta #D8258C wall plane. Two tiny standing figures far apart, then closer than the room allows. ONE accent: a scrap of pink #E07FA8 silk on the floor.`
});
set('sosuno-shy-heat', {
	alt: 'Sosuno’s hidden heat as a tiny figure on a grain porch; one dusty-rose accent on a red plane',
	prompt: `${EPIC} UNIQUE LAYOUT: hard red wall, low porch strip. Tiny widow-figure turning away. ONE accent: dusty-rose cloth at the rail.`
});
set('jumong-sosuno-nights', {
	alt: 'Night heat as two tiny figures in a dark timber hall; one oil-lamp yellow shaft',
	prompt: `${EPIC} UNIQUE LAYOUT: near-black hall, crushed paper as a pale floor plane. Two tiny figures. ONE accent: a single oil-lamp yellow shaft.`
});
set('nsfw-pumsuk-gumilwife-surprise', {
	alt: 'Daeya chamber as a stone plane; two tiny figures, one teal-sage accent',
	prompt: `${EPIC} UNIQUE LAYOUT: cold grey fortress wall. Two tiny figures, one stepping toward the other. ONE accent: teal-sage #8AAFA0 silk. Pumsuk blue #7EB8F0 only as a thin rim.`
});
set('nsfw-pumsuk-gumilwife-pressed', {
	alt: 'Pressed closeness implied by two tiny figures in a teal disc of light on black',
	prompt: `${EPIC} UNIQUE LAYOUT: black void, one teal #8AAFA0 disc on the floor. Two tiny figures almost overlapping inside the disc. No faces.`
});
set('nsfw-pumsuk-gumilwife-hands', {
	alt: 'Hands implied as two tiny figures at a waist-high rail; ice-blue #7EB8F0 accent',
	prompt: `${EPIC} UNIQUE LAYOUT: low horizontal rail strip. Two tiny figures. ONE accent: ice-blue #7EB8F0 sash on the rail.`
});
set('nsfw-suro-heo-hungry', {
	alt: 'Hunger as a tiny king-speck facing a vast violet plane; one gold crown spark',
	prompt: `${EPIC} UNIQUE LAYOUT: hard violet wall. One tiny standing speck. ONE accent: a gold branch-crown spark.`
});
set('nsfw-suro-heo-obsession', {
	alt: 'Obsession as a single gold-tiger accent on an empty violet coast plane',
	prompt: `${EPIC} UNIQUE LAYOUT: dusk violet plane, no sea clutter. ONE accent: gold tiger-hairpin spark. Tiny figure optional.`
});
set('nsfw-suro-heo-devour', {
	alt: 'A lamp-lit tent as a yellow shaft on black; two tiny figures inside',
	prompt: `${EPIC} UNIQUE LAYOUT: black coast, one yellow lamp-shaft through tent silk. Two tiny figures. Purple-gold as the only warm plane.`
});
set('nsfw-suro-heo-cling', {
	alt: 'Clinging implied by two tiny figures against a purple-gold wall; one lamp accent',
	prompt: `${EPIC} UNIQUE LAYOUT: purple-gold wall plane, wet black floor. Two tiny figures close. ONE accent: a small gold lamp.`
});
set('nsfw-suro-heo-chamber', {
	alt: 'Royal chamber as monumental emptiness; one gold lamp shaft, two tiny figures',
	prompt: `${EPIC} UNIQUE LAYOUT: vast dark chamber, reflective floor. ONE yellow lamp shaft. Two tiny figures at the far end.`
});
set('haemosu-copper-room', {
	alt: 'Copper room as a hard metal plane; two tiny figures, one white sun-accent',
	prompt: `${EPIC} UNIQUE LAYOUT: glowing copper wall plane. Two tiny figures. ONE accent: a white-gold sun spark. No clouds.`
});
set('jumong_01', {
	alt: 'Ubal shallows as a flat gold-water plane; two tiny figures, one silver-white accent',
	prompt: `${EPIC} UNIQUE LAYOUT: hard gold water plane, no clouds. Two tiny figures. ONE accent: silver-white hair-spark of the sun god.`
});
set('gaya-ridge-night', {
	alt: 'Sky touching mountain as two color planes; one white cloud-shaft, two tiny figures',
	prompt: `${EPIC} UNIQUE LAYOUT: cobalt sky plane meeting a crimson mountain plane. Ibiga may have sculptural clouds. Two tiny figures. ONE accent: a single white cloud-shaft.`
});
set('three-youths-dukman', {
	alt: 'Three tiny Hwarang orbit one vermilion queen-speck on a navy-and-blue field',
	prompt: `${EPIC} UNIQUE LAYOUT: split navy #141C2E and Confucian blue #2A5FB8 floor. Three tiny standing youths. ONE accent: a vermilion queen-speck they all face.`
});
set('euija-maids-two', {
	alt: 'Early court: two tiny maid-figures in a wine-red Sabi hall; one gold headband accent',
	prompt: `${EPIC} UNIQUE LAYOUT: wine-red wall, wet black floor. Exactly two tiny maid-figures. ONE accent: gold-yellow headband spark of the king.`
});
set('euija-maids-compete', {
	alt: 'More tiny maids competing in rings; gold headband still the only accent',
	prompt: `${EPIC} UNIQUE LAYOUT: overlapping rings of tiny figures, more than two, not yet a sea. Wine-red plane. ONE accent: gold-yellow headband at center.`
});
set('heo-suro-back-lust', {
	alt: 'Queen Heo in a corner crop, flushed, eyes on King Suro’s muscular back filling the tent',
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. UNIQUE CROP: over-the-shoulder muscular back filling 80% of the frame — adult King Suro, tan skin, trapezius, purple-gold robe at the waist, gold branch crown at the top edge. Lower-left CORNER only: adult Queen Heo (Indian, darker skin, gold tiger hairpins, violet silk off the shoulder) flushed, parted lips, looking at HIS BACK not his face. NOT a centered two-shot, NOT face-to-face. Painterly anime-adjacent. Adult/mature. No readable text.'
});
set('sosuno-hide-back', {
	alt: 'Jumong’s muscular back fills the frame; Sosuno peeks from a post, hiding a flush',
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. UNIQUE CROP: over-the-shoulder. 80% adult Jumong muscular back — red robe open down the spine, red headband at the nape, wet morning light on trapezius. Far left EDGE only: adult Sosuno half-hidden behind timber, hand over mouth, proud, flushed, staring at his BACK. NOT face-to-face, NOT a centered couple. Painterly anime-adjacent. Adult/mature. No readable text.'
});
set('munhee-chunchu-back', {
	alt: 'Chunchu’s magenta-robed back as a low-strip wall; Munhee looks up from below, flushed',
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. UNIQUE CROP: low strip. Upper frame is adult Chunchu’s muscular back, magenta #D8258C robe open, shoulder blades. Bottom strip: young adult Munhee in pink #E07FA8, flushed, parted lips, idle needle, looking UP at his back. NOT face-to-face, NOT a centered two-shot. Painterly anime-adjacent. Adult/mature. No readable text.'
});
set('yushin-lake-goddess-lust', {
	alt: 'Yushin’s wet muscular back as a wall in steam; three goddesses at the waterline edges, flushed',
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. UNIQUE CROP: worm’s-eye from the waterline. Adult Kim Yushin TOPLESS SOLO — wet muscular BACK filling almost the whole frame, trapezius, clean-shaven nape, blue-ribbon topknot, wet #2A5FB8 cloth at the hip. Cyan steam cavern. Left and right EDGES only: three adult goddesses in wet silk off the shoulder (olive, orange, pale blue), flushed, parted lips, eyes on his BACK. NOT a frontal group, NOT a centered four-shot. Painterly, goddesses numinous. Adult/mature. No lotus. No readable text.'
});
set('sunduk-yushin-flush', {
	alt: 'Queen Sunduk’s flushed throat in a corner; Yushin’s neck and back fill the rest — he does not turn',
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. UNIQUE CROP: corner. Lower-right only: Queen Sunduk / Dukman, vermilion-blue silk, flushed throat, parted lips, breath held, queenly lust, eyes on his body. The rest of the frame: Marshal Yushin’s neck and muscular shoulder, Confucian blue #2A5FB8, he STANDS, he does not turn. NOT face-to-face, NOT a kiss two-shot. Painterly anime-adjacent. Adult/mature. No lotus. No readable text.'
});

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('rewrote modes for', [
	'munhee-sewing-later',
	'sosuno-shy-heat',
	'jumong-sosuno-nights',
	'nsfw-pumsuk-gumilwife-surprise',
	'nsfw-pumsuk-gumilwife-pressed',
	'nsfw-pumsuk-gumilwife-hands',
	'nsfw-suro-heo-hungry',
	'nsfw-suro-heo-obsession',
	'nsfw-suro-heo-devour',
	'nsfw-suro-heo-cling',
	'nsfw-suro-heo-chamber',
	'haemosu-copper-room',
	'jumong_01',
	'gaya-ridge-night',
	'three-youths-dukman',
	'euija-maids-two',
	'euija-maids-compete',
	'heo-suro-back-lust',
	'sosuno-hide-back',
	'munhee-chunchu-back',
	'yushin-lake-goddess-lust',
	'sunduk-yushin-flush'
].length, 'slots');
