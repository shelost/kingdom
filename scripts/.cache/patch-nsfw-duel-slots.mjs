import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function entries() {
	const out = [];
	for (const ch of Object.values(story)) {
		for (const en of ch.entries ?? []) out.push(en);
	}
	return out;
}

function findEntry(title) {
	return entries().find((en) => en.title === title);
}

function insertAfter(images, afterId, slots) {
	const i = images.findIndex((im) => im.id === afterId);
	if (i < 0) throw new Error(`missing slot ${afterId}`);
	const exist = new Set(images.map((im) => im.id));
	const fresh = slots.filter((s) => !exist.has(s.id));
	images.splice(i + 1, 0, ...fresh);
	return fresh.map((s) => s.id);
}

const NSFW_EXISTING = [
	'pumsuk-half-share',
	'golhwa-wink',
	'suro-heo-tent',
	'heo-silk-trousers',
	'hyukgose-alyoung-love',
	'gaya-ridge-night',
	'jumong_01',
	'haemosu-copper-room',
	'jumong-sosuno-well',
	'jumong-sosuno-nights',
	'euija-court-maids'
];

for (const en of entries()) {
	for (const im of en.images ?? []) {
		if (NSFW_EXISTING.includes(im.id)) im.nsfw = true;
	}
}

const added = [];

const jumong = findEntry('Jumong');
added.push(
	...insertAfter(jumong.images, 'jumong_01', [
		{
			id: 'yuhwa-bath-tease',
			ratio: 1.778,
			tone: '#8fc4e0',
			at: 'Shall I pretend to blush',
			nsfw: true,
			alt: 'Yuhwa teasing from the Ubal shallows — wet hair over one shoulder, Haemosu awestruck above, gold light on wet skin',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Adult river goddess Lady Yuhwa (wet dark hair drawn over one shoulder, pale-blue #8fc4e0 silk abandoned, water at her breasts, knowing tease, looking straight up) filling the frame; adult sun god Haemosu (silver-white topknot, white robe open, gold #f0b429 light on his stunned face) close above her, awestruck, mouth parted. Wet collarbones, droplets, skin-forward. Personal river two-shot, not a tiny bather under a huge sky, not silhouettes. No text, no watermark.',
			refs: ['/ch_yuhwa.png', '/ch_haemosu.png']
		}
	])
);
added.push(
	...insertAfter(jumong.images, 'jumong-sosuno-well', [
		{
			id: 'sosuno-shy-heat',
			ratio: 1.778,
			tone: '#e8a04a',
			at: 'forgets to finish counting',
			nsfw: true,
			alt: 'Sosuno shy and flushed against Jumong — dusty-rose robe slipping, red ribbon, visibly aroused, eyes wide with awe',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Adult Sosuno (long black hair, red ribbon, dusty-rose #e8a04a tunic slipping off one shoulder) shy but visibly aroused — flushed chest, parted lips, eyes wide with love and awe — pressed close to adult Jumong (red headband, red #e8563f robe open at the throat). Her hands hesitate on his chest. Dawn well bokeh only. Skin and collarbones. Personal, not a vast valley, not silhouettes. No text, no watermark.',
			refs: ['/ch_sosuno.png', '/ch_jumong.png']
		}
	])
);

const gotaso = findEntry('Gotaso’s Wedding') ?? findEntry("Gotaso's Wedding");
added.push(
	...insertAfter(gotaso.images, 'gotaso-determination-forward', [
		{
			id: 'munhee-sewing-first',
			ratio: 1.778,
			tone: '#E07FA8',
			at: 'She sews it standing',
			nsfw: true,
			alt: 'Munhee sews Chunchu’s coat standing close — mouth near his pulse, pink silk, first charged visit',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Young adult Munhee (black bun, pink #E07FA8 jeogori loosened at the collar) sewing a torn coat-tie standing so close her breath is on young adult Chunchu’s (magenta #D8258C Hwarang robe, dusty from the yard) collarbone; needle paused, her mouth finding the place above his pulse. Tight two-shot, skin and throats. Personal sewing-room, not a vast hall, not silhouettes. No text, no watermark.',
			refs: ['/ch_munhee.png', '/ch_chunchu_hwarang.png']
		},
		{
			id: 'munhee-sewing-later',
			ratio: 1.778,
			tone: '#D8258C',
			at: 'needing nothing sewn',
			nsfw: true,
			alt: 'A later sewing visit — Munhee and Chunchu more physical, robes open, mouths at each other’s throats',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Same adults later: Munhee (pink #E07FA8 silk off both shoulders) and Chunchu (magenta #D8258C robe open on the chest) in a hungrier close — her mouth at his throat, his hand at her waist, forgotten needle and silk on the floor as bokeh. Flushed, skin-forward, more physical than the first visit. Personal, not a vast hall, not silhouettes. No text, no watermark.',
			refs: ['/ch_munhee.png', '/ch_chunchu_hwarang.png']
		}
	])
);

const bidam = findEntry('Bidam’s Rebellion') ?? findEntry("Bidam's Rebellion");
added.push(
	...insertAfter(bidam.images, 'hwarang-class', [
		{
			id: 'three-youths-dukman',
			ratio: 1.778,
			tone: '#E8552B',
			at: 'same impossible orbit around',
			nsfw: true,
			alt: 'Three vigorous Hwarang at twenty — Bidam, Yushin, Alchun — flushed with desire, Princess Dukman close between them',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Three vigorous adult Hwarang aged twenty in love with Princess Dukman: Bidam (navy #141C2E robe, Buddhist beads at the wrist), Yushin (Confucian marshal blue #2A5FB8, standing not lotus), Alchun (pale #8fb3e0). Faces and flushed throats fill the frame around adult Princess Dukman (orange-vermilion #E8552B silk slipping a shoulder). Desire, youth, skin, not a group poster, not a vast yard, not silhouettes. No text, no watermark.',
			refs: [
				'/ch_bidam_hwarang.png',
				'/ch_kim_yushin_hwarang.png',
				'/ch_alchun.png',
				'/ch_dukman.png'
			]
		}
	])
);
added.push(
	...insertAfter(bidam.images, 'flower-brush', [
		{
			id: 'bidam-yushin-duel-youth',
			ratio: 1.778,
			tone: '#141C2E',
			at: 'The yard after rain',
			alt: 'Worm’s-eye through crossed practice blades — two Hwarang at twenty, Bidam navy and Yushin blue, score unfinished',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Unique worm’s-eye: two crossed wooden practice blades as a V in the foreground; through them, two adult Hwarang aged twenty — Bidam (navy #141C2E, Buddhist beads at the wrist) and Yushin (Confucian blue #2A5FB8, standing stance) — flushed faces filling the upper frame after rain, mud on cheeks, score unfinished. Personal, not a vast empty yard, not silhouettes. No readable text, no watermark.',
			refs: [
				'/ch_bidam_hwarang.png',
				'/ch_kim_yushin_hwarang.png',
				'/img_bidam_06.png'
			]
		},
		{
			id: 'bidam-yushin-duel-prime',
			ratio: 1.778,
			tone: '#2A5FB8',
			at: 'only the old score again',
			alt: 'Vertical split navy / marshal-blue planes — two tiny prime-age figures lunging across the seam',
			prompt:
				'Iconic minimal epic still, 16:9. Unique vertical split: left plane navy void #141C2E, right plane Confucian marshal blue #2A5FB8. Two tiny adult figures in their prime lunge across the seam — Bidam left (navy, one gold lotus-bead spark), Yushin right (blue, one blank tablet gleam). Hard color planes, haze, reflective wet yard, monumental emptiness. Zoomed out, not close faces, not a blended hall. No readable text, no watermark.',
			refs: ['/ch_bidam.png', '/ch_kim_yushin.png', '/img_bidam_06.png']
		},
		{
			id: 'bidam-yushin-duel-later',
			ratio: 1.778,
			tone: '#1a1a1c',
			at: 'wants the score finished properly',
			alt: 'Low strip of two older duelists in haze — Bidam navy, Yushin blue, one gold bead, one blank tablet',
			prompt:
				'Iconic minimal epic still, 16:9. Unique low strip: the bottom fifth of the frame holds two small older men mid-duel on a reflective floor; the rest is monumental haze. Bidam navy #141C2E with one sutra-gold bead accent; Yushin Confucian blue #2A5FB8 with one blank tablet accent. Zoomed out, hard planes, no close faces, no clouds. No readable text, no watermark.',
			refs: ['/ch_bidam_old.png', '/ch_kim_yushin_old.png', '/img_bidam_06.png']
		}
	])
);

const wu = findEntry('Death of the Second Emperor');
added.push(
	...insertAfter(wu.images, 'wuzetian-screen', [
		{
			id: 'wuzetian-seduction',
			ratio: 1.778,
			tone: '#e879a6',
			at: 'Her name is not yet heavy',
			nsfw: true,
			alt: 'Wu Zetian fills the frame — pink-gold silk slipping, commanding seductive gaze, power in the skin',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Adult Wu Zetian fills the frame: dark high hair, #e879a6 pink-gold silk slipping off one shoulder, bare collarbone, a powerful seductive half-smile, eyes that already file the room. Skin-forward, personal, not a tiny figure behind a vast gold screen, not silhouettes. No text, no watermark.',
			refs: ['/ch_wu_zetian.png']
		}
	])
);

const samsin = findEntry('Birth of Namseng');
added.push(
	...insertAfter(samsin.images, 'samsin-life-office', [
		{
			id: 'samsin-open-desire',
			ratio: 1.778,
			tone: '#e8b4c8',
			at: 'three as one, midwife',
			nsfw: true,
			alt: 'Samsin three-as-one, outgoing and openly sexual — flushed skin, laughter, pink silk off the shoulders',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Goddess Samsin as three adult women moving as one, outgoing and openly sexual: white/blue/red hanbok loosened, #e8b4c8 pink silk off the shoulders, flushed laughing faces and collarbones filling the frame, confident desire. Personal, skin-forward, not a vast birthing hall, not silhouettes. No text, no watermark.',
			refs: ['/ch_samsin.png']
		}
	])
);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('added', added.filter(Boolean).join(', ') || '(all already present)');
