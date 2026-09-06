// Ground lust/crowd slots as wide place expositions. Keep a minority of unique closes.
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const byId = new Map();
const byTitle = new Map();
for (const ch of story) {
	for (const en of ch.entries ?? []) {
		byTitle.set(en.title, en);
		for (const im of en.images ?? []) byId.set(im.id, im);
	}
}

function set(id, patch) {
	const im = byId.get(id);
	if (!im) throw new Error(`missing slot ${id}`);
	Object.assign(im, patch);
	im.nsfw = true;
	im.ratio = im.ratio || 1.778;
}

const WIDE =
	'Wide cinematic EXPOSITION still, 16:9. ICONIC / MINIMAL EPIC. Camera far back. Tiny distant figures only — no readable faces, no huge heads, no intimate close, no centered couple portraits, no flushed anime two-shot. Hard color planes grounded in a REAL recognizable place. White haze, wet reflective ground. Monochrome plus ONE symbolic accent — the color plane IS the person. Flat kingdom sky, no clouds. Period hanbok silhouettes (wide sleeves, jeogori/chima). Lust implied only by distance, pose, and color. Somewhat realistic, painterly, grounded. No readable text, no watermark.';

set('yehwa-daeya-stares', {
	alt: 'Wide Daeya courtyard: tiny men facing one teal-sage #8AAFA0 figure; grey stone gate',
	prompt: `${WIDE} PLACE: Daeya fortress courtyard — tan stone gatehouse, grey crenelated walls, wet black yard. UNIQUE LAYOUT: high worm’s-eye of the yard. A crowd of tiny men all facing one way. ONE accent: a single teal-sage #8AAFA0 woman-shape (Yehwa) — S-curve implied by the silhouette, hip weight in the stance.`,
	refs: ['/ch_gumil_wife.png', '/pl_daeya_fortress.png', '/ch_placeholder_m.png']
});

set('hwarang-female-fans', {
	alt: 'Wide Surabol training yard: tiny women along a fence; flat Confucian-blue #2A5FB8 sky',
	prompt: `${WIDE} PLACE: Silla Surabol Hwarang yard — pale dust field, timber fence, palace roofs far back. UNIQUE LAYOUT: low fence-strip across the bottom. Tiny women fawning along the rail toward tiny youths on the field. Flat Silla-blue #2A5FB8 sky, no clouds. ONE accent: a single white flower on the fence. No crescent halo.`,
	refs: [
		'/ch_kim_yushin_hwarang.png',
		'/ch_chunchu_hwarang.png',
		'/ch_maid_1.png',
		'/pl_eastern_palace.png'
	]
});

set('yushin-fans-sunduk-only', {
	alt: 'Wide Eastern Palace court: ribbon of tiny fans; vermilion queen-shaft; one blue speck turned only to her',
	prompt: `${WIDE} PLACE: Silla Eastern Palace courtyard — stone yard, dark tiled roofs, Confucian-blue #2A5FB8 wall plane. UNIQUE LAYOUT: ribbon of tiny women along the wet floor. ONE accent: a pale vermilion shaft containing a tiny queen-figure. A single tiny blue #2A5FB8 speck stands turned wholly toward her, not toward the crowd. No lotus.`,
	refs: ['/ch_kim_yushin.png', '/ch_dukman.png', '/ch_sunduk.png', '/pl_eastern_palace.png']
});

set('euija-maids-two', {
	alt: 'Wide Sabi palace: wine-red hall, exactly two tiny maid-figures; one gold-yellow headband spark',
	prompt: `${WIDE} PLACE: Baekje Sabi palace — blue-tiled roofs in the far haze, wine-red inner hall, wet black floor. UNIQUE LAYOUT: empty wine-red wall, two tiny maid-figures only, silk silhouettes. ONE accent: gold-yellow headband spark of the king.`,
	refs: ['/ch_buyeo_euija.png', '/ch_maid_1.png', '/ch_maid_2.png', '/pl_sabi_palace.png']
});

set('euija-maids-compete', {
	alt: 'Wide Sabi inner court: overlapping rings of tiny maids; gold headband the only accent',
	prompt: `${WIDE} PLACE: Sabi palace inner court — wine-red pillars, wet black floor, palace roofs beyond the colonnade. UNIQUE LAYOUT: overlapping rings of tiny maid-figures, more than two, not yet a sea. ONE accent: gold-yellow headband at center.`,
	refs: ['/ch_buyeo_euija.png', '/ch_maid_1.png', '/ch_maid_2.png', '/ch_maid_3.png', '/pl_sabi_palace.png']
});

set('euija-maids-hundreds', {
	alt: 'Wide Sabi courtyard: a sea of tiny maids on a wine-red disc; one gold headband spark',
	prompt: `${WIDE} PLACE: Sabi palace great courtyard — recognizable blue-tile roofs and red gate in haze. UNIQUE LAYOUT: disc of tiny maid-figures on a reflective black floor against a wine-red wall plane. ONE accent: gold-yellow headband spark at center.`,
	refs: ['/ch_buyeo_euija.png', '/pl_sabi_palace.png']
});

set('euija-court-maids', {
	alt: 'Wide Sabi banquet hall: tiny maids around one gold-yellow speck; wine-red colonnade',
	prompt: `${WIDE} PLACE: Sabi palace banquet hall — wine-red columns, wet floor, lantern sparks far off. UNIQUE LAYOUT: a loose crowd of tiny maid-figures around one central speck. ONE accent: gold-yellow headband.`,
	refs: ['/ch_buyeo_euija.png', '/ch_maid_1.png', '/ch_maid_2.png', '/pl_sabi_palace.png']
});

set('euija-maid-wine-slit', {
	alt: 'Wide Sabi wine hall: tiny pouring maid at a long table; wine-red plane, gold headband spark',
	prompt: `${WIDE} PLACE: Sabi palace wine hall — long low tables, wine-red wall, wet black floor. UNIQUE LAYOUT: one tiny maid-figure mid-pour at the table, other tiny hems in a ring. ONE accent: gold-yellow headband at the far end. No faces.`,
	refs: ['/ch_maid_1.png', '/ch_buyeo_euija.png', '/pl_sabi_palace.png']
});

set('euija-gesomun-thigh', {
	alt: 'Wide Sabi map hall: tiny maid at a table; gold headband speck ignores the paper',
	prompt: `${WIDE} PLACE: Sabi palace map hall — long table, wine-red wall, palace colonnade. UNIQUE LAYOUT: two tiny figures at a distant table, one maid-silhouette stepping close. ONE accent: gold-yellow headband. No faces, no close crop.`,
	refs: ['/ch_maid_2.png', '/ch_buyeo_euija.png', '/pl_sabi_palace.png']
});

set('taizong-vast-harem', {
	alt: 'Wide Daming inner palace: forest of tiny women on a crimson plane; one yellow emperor shaft',
	prompt: `${WIDE} PLACE: Tang Daming palace inner court — stone foundation, tiled roofs, long ceremonial path. IGNORE any modern skyline. IGNORE clouds. Flat deep-blue sky. UNIQUE LAYOUT: forest of tiny women in stacked silk ranks receding into haze. Hard crimson wall plane. ONE accent: intense yellow emperor-light shaft with a single tiny standing speck. Tang gold #b45309 only as that shaft.`,
	refs: ['/ch_taizong.png', '/pl_daming_palace.png']
});

set('munhee-sewing-later', {
	alt: 'Wide Eastern Palace sewing hall: magenta #D8258C void; two tiny figures; one pink silk scrap',
	prompt: `${WIDE} PLACE: Silla Eastern Palace sewing room opening onto a stone courtyard — lattice, dark roofs beyond. UNIQUE LAYOUT: empty magenta #D8258C wall plane. Two tiny standing figures farther than the room should allow. ONE accent: a scrap of pink #E07FA8 silk on the wet floor.`,
	refs: ['/ch_munhee.png', '/ch_chunchu_hwarang.png', '/pl_eastern_palace.png']
});

set('sosuno-shy-heat', {
	alt: 'Wide Buyeo grain porch: tiny figure turning away on a hard dusty-rose plane; Goguryeo-red wall',
	prompt: `${WIDE} PLACE: Buyeo timber grain porch — heavy posts, pale dust yard, hard Goguryeo-red #C30000 wall. UNIQUE LAYOUT: low porch strip. One tiny widow-figure turning away. ONE accent: dusty-rose cloth at the rail.`,
	refs: ['/ch_sosuno.png', '/ch_jumong.png', '/img_sosuno_grain_porch.png']
});

set('jumong-sosuno-nights', {
	alt: 'Wide timber night hall: two tiny figures; one oil-lamp yellow shaft',
	prompt: `${WIDE} PLACE: Buyeo timber night hall — crushed-paper floor plane, dark posts, no windows of sky. UNIQUE LAYOUT: near-black hall. Two tiny figures. ONE accent: a single oil-lamp yellow shaft.`,
	refs: ['/ch_jumong.png', '/ch_sosuno.png', '/img_jumong_sosuno_nights.png']
});

set('pumsuk-half-share', {
	alt: 'Wide Daeya feast yard: two tiny figures under lantern haze; one teal-sage #8AAFA0 accent',
	prompt: `${WIDE} PLACE: Daeya fortress feast courtyard — tan gate in haze, grey walls, wet black yard. UNIQUE LAYOUT: two tiny figures at a distant low table. ONE accent: teal-sage #8AAFA0 silk. Pumsuk ice-blue #7EB8F0 only as a thin rim.`,
	refs: ['/ch_pumsuk.png', '/ch_gumil_wife.png', '/pl_daeya_fortress.png']
});

set('nsfw-pumsuk-gumilwife-surprise', {
	alt: 'Wide Daeya chamber court: two tiny figures; teal-sage #8AAFA0 the only warm plane',
	prompt: `${WIDE} PLACE: Daeya inner fortress court — cold grey stone wall, wet floor, gate haze. UNIQUE LAYOUT: two tiny figures, one stepping toward the other. ONE accent: teal-sage #8AAFA0 silk.`,
	refs: ['/ch_pumsuk.png', '/ch_gumil_wife.png', '/pl_daeya_fortress.png']
});

set('nsfw-pumsuk-gumilwife-pressed', {
	alt: 'Wide Daeya night court: two tiny figures inside one teal #8AAFA0 disc',
	prompt: `${WIDE} PLACE: Daeya night courtyard — black stone, distant gate silhouette. UNIQUE LAYOUT: one teal #8AAFA0 disc on the wet floor. Two tiny figures almost overlapping inside the disc.`,
	refs: ['/ch_pumsuk.png', '/ch_gumil_wife.png', '/pl_daeya_fortress.png']
});

set('nsfw-pumsuk-gumilwife-hands', {
	alt: 'Wide Daeya wall-rail: two tiny figures; ice-blue #7EB8F0 sash accent',
	prompt: `${WIDE} PLACE: Daeya fortress wall walk — grey stone rail, tan gate far right. UNIQUE LAYOUT: low horizontal rail strip. Two tiny figures. ONE accent: ice-blue #7EB8F0 sash on the rail.`,
	refs: ['/ch_pumsuk.png', '/ch_gumil_wife.png', '/pl_daeya_fortress.png']
});

set('nsfw-pumsuk-gumilwife-overwhelm', {
	alt: 'Wide Daeya inner stone hall: two tiny figures; teal-sage plane, no faces',
	prompt: `${WIDE} PLACE: Daeya inner stone hall — grey blocks, wet floor, slit of courtyard light. UNIQUE LAYOUT: split grey wall. Two tiny figures at the far end. ONE accent: teal-sage #8AAFA0.`,
	refs: ['/ch_pumsuk.png', '/ch_gumil_wife.png', '/pl_daeya_fortress.png']
});

set('nsfw-pumsuk-gumilwife-allure', {
	alt: 'Female-gaze close: Yehwa’s S-curve and taut teal silk fill a corner crop; no two-shot',
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. FEMALE GAZE only. UNIQUE CROP: over-the-shoulder corner from behind. Adult Yehwa (tan skin, dark bun, wooden sprig hairpin, teal-sage #8AAFA0 silk pulled taut over the figure, hip weight, S-curve of the back). Camera on the figure under long court silk, hiked hem to the thigh at the lower edge only. Daeya lamp bokeh. NOT a face two-shot, NOT a centered couple, no second person in frame. Painterly anime-adjacent. Adult/mature. No readable text.',
	refs: ['/ch_gumil_wife.png', '/pl_daeya_fortress.png']
});

set('nsfw-suro-heo-hungry', {
	alt: 'Wide Gaya dusk coast: tiny king-speck facing a violet plane; one gold crown spark',
	prompt: `${WIDE} PLACE: Gaya coastal camp — low tents, dark ridge, violet dusk wall, no sea clutter. UNIQUE LAYOUT: hard violet plane. One tiny standing speck. ONE accent: a gold branch-crown spark. Gaya purple #8b5cf6 as the wall.`,
	refs: ['/ch_suro.png', '/ch_heo.png', '/img_gaya_ridge_night.png']
});

set('nsfw-suro-heo-obsession', {
	alt: 'Wide Gaya dusk ridge: empty violet coast; one gold tiger-hairpin spark',
	prompt: `${WIDE} PLACE: Gaya dusk ridge above water — recognizable dark mountain plane. UNIQUE LAYOUT: dusk violet coast, no clutter. ONE accent: gold tiger-hairpin spark. Tiny figure optional.`,
	refs: ['/ch_heo.png', '/img_gaya_ridge_night.png']
});

set('nsfw-suro-heo-devour', {
	alt: 'Wide Gaya night camp: yellow lamp-shaft through tent silk; two tiny figures',
	prompt: `${WIDE} PLACE: Gaya night camp on the coast — black ridge, one tent. UNIQUE LAYOUT: one yellow lamp-shaft through tent silk. Two tiny figures inside. Purple-gold as the only warm plane.`,
	refs: ['/ch_suro.png', '/ch_heo.png', '/img_gaya_ridge_night.png']
});

set('nsfw-suro-heo-cling', {
	alt: 'Wide Gaya purple-gold hall: two tiny figures against the wall; one lamp accent',
	prompt: `${WIDE} PLACE: Gaya royal hall — purple-gold #8b5cf6 wall, wet black floor, timber posts. UNIQUE LAYOUT: two tiny figures close at the far end. ONE accent: a small gold lamp.`,
	refs: ['/ch_suro.png', '/ch_heo.png', '/img_gaya_03.png']
});

set('nsfw-suro-heo-chamber', {
	alt: 'Wide Gaya chamber: monumental emptiness, one gold lamp shaft, two tiny figures',
	prompt: `${WIDE} PLACE: Gaya royal chamber opening to a dark court. UNIQUE LAYOUT: vast dark room, reflective floor. ONE yellow lamp shaft. Two tiny figures at the far end.`,
	refs: ['/ch_suro.png', '/ch_heo.png', '/img_gaya_04.png']
});

set('three-youths-dukman', {
	alt: 'Wide Surabol yard: three tiny Hwarang orbit one vermilion queen-speck on navy and Confucian blue',
	prompt: `${WIDE} PLACE: Silla Surabol palace yard — stone court, dark tiled roofs. UNIQUE LAYOUT: split navy #141C2E and Confucian blue #2A5FB8 floor. Three tiny standing youths. ONE accent: a vermilion queen-speck they all face. No crescent halo.`,
	refs: [
		'/ch_kim_yushin_hwarang.png',
		'/ch_chunchu_hwarang.png',
		'/ch_dukman.png',
		'/pl_eastern_palace.png'
	]
});

set('jumong_01', {
	alt: 'Wide Ubal shallows: hard gold-water plane; two tiny figures; one silver-white sun-accent',
	prompt: `${WIDE} PLACE: Ubal / Amnok shallows — flat gold water, dark timber bank, no clouds. UNIQUE LAYOUT: hard gold water plane. Two tiny figures. ONE accent: silver-white hair-spark of the sun god.`,
	refs: ['/ch_jumong.png', '/ch_yuhwa.png', '/pl_white_river.png']
});

set('gaya-ridge-night', {
	alt: 'Wide Gaya ridge: cobalt sky meeting a crimson mountain; one white cloud-shaft; two tiny figures',
	prompt: `${WIDE} PLACE: Gaya night ridge — recognizable dark mountain. UNIQUE LAYOUT: cobalt sky plane meeting a crimson mountain plane. Ibiga may have sculptural clouds (exception). Two tiny figures. ONE accent: a single white cloud-shaft.`,
	refs: ['/ch_suro.png', '/ch_heo.png', '/img_gaya_ridge_night.png']
});

set('haemosu-copper-room', {
	alt: 'Wide copper sun-room: hard metal plane; two tiny figures; one white-gold sun spark',
	prompt: `${WIDE} PLACE: Haemosu’s copper sun-room — glowing metal walls, reflective floor, no outdoor sky. UNIQUE LAYOUT: copper wall plane. Two tiny figures. ONE accent: a white-gold sun spark.`,
	refs: ['/ch_haemosu.png', '/ch_yuhwa.png', '/img_haemosu_copper_room.png']
});

set('sunduk-yushin-flush', {
	alt: 'Male-gaze close: Yushin’s neck and back fill the frame; Queen Sunduk a flushed corner viewer',
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. MALE GAZE only. UNIQUE CROP: corner. Most of the frame is Marshal Yushin from behind — neck, muscular shoulder, veined forearm, Confucian blue #2A5FB8 coat, he stands, he does not turn. Lower-right corner only: Queen Sunduk flushed throat, parted lips, breath held, looking at his back. Camera on his muscle. NOT face-to-face. Painterly. Adult/mature. No lotus. No readable text.',
	refs: ['/ch_dukman.png', '/ch_sunduk.png', '/ch_kim_yushin.png', '/pl_eastern_palace.png']
});

set('euija-maid-hem-pour', {
	alt: 'Female-gaze close: a maid’s long chima slit as she pours; calf and thigh catching wine-red lamplight',
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. FEMALE GAZE only. UNIQUE CROP: low strip from the knee. Adult Baekje court maid in cream-yellow jeogori and mint-green chima, wine-pour stretch, long dress hem hiked to the thigh, slit of a chima as she pours, calf and thigh catching lamplight. Camera on the leg under long court silk. King Euija gold-yellow headband only at the top edge, watching. NOT a centered face two-shot. Painterly anime-adjacent. Adult/mature. No readable text.',
	refs: ['/ch_maid_1.png', '/ch_buyeo_euija.png', '/pl_sabi_palace.png']
});

set('euija-maid-stair-hem', {
	alt: 'Female-gaze close: a maid on a stepped-up stair, long chima riding to the thigh',
	prompt:
		'Intimate cinematic CLOSE-UP, 16:9. FEMALE GAZE only. UNIQUE CROP: over-the-stair, looking up the hem. Adult court maid on a stepped-up stair, long dress hem hiked to the thigh, unintentional flash of leg, silk pulled taut over the figure, hip weight. Wine-red palace stair. Camera on calf and thigh. NOT a face two-shot. Painterly anime-adjacent. Adult/mature. No readable text.',
	refs: ['/ch_maid_3.png', '/pl_sabi_palace.png']
});

const death = byTitle.get('Death of the Second Emperor');
if (!death) throw new Error('Death of the Second Emperor missing');
if (!death.images.some((im) => im.id === 'gaozong-vast-harem')) {
	const after = death.images.findIndex((im) => im.id === 'wuzetian-seduction');
	if (after < 0) throw new Error('wuzetian-seduction missing');
	const slot = {
		ratio: 1.778,
		nsfw: true,
		id: 'gaozong-vast-harem',
		tone: '#b45309',
		at: 'the other women who must not be seen',
		alt: 'Wide Daming anteroom: forest of tiny waiting women; one Tang-gold #b45309 shaft',
		prompt: `${WIDE} PLACE: Tang Daming palace anteroom opening to the great court — stone foundation, tiled roofs, long path. IGNORE modern skyline. IGNORE clouds. Flat deep-blue sky. UNIQUE LAYOUT: forest of tiny waiting women in stacked silk ranks. Hard dark hall. ONE accent: Tang-gold #b45309 shaft with a single tiny standing speck (the new emperor).`,
		refs: ['/ch_gaozong.png', '/ch_wu_zetian.png', '/pl_daming_palace.png']
	};
	death.images.splice(after + 1, 0, slot);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched wide exposition prompts + gaozong-vast-harem');
