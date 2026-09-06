// Taizong visual bible: silhouette until Ansi face, then Chunchu in light.
// Only mutates image slots on Taizong-bearing entries.
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const AMBER = '#c97a2e';
const MAGENTA = '#D8258C';

function entries() {
	const out = [];
	for (const ch of story) {
		for (const en of ch.entries ?? []) out.push(en);
	}
	return out;
}

function findEntry(title) {
	const en = entries().find((e) => e.title === title);
	if (!en) throw new Error(`missing entry ${title}`);
	return en;
}

function slotMap() {
	const m = new Map();
	for (const en of entries()) {
		for (const im of en.images ?? []) m.set(im.id, im);
	}
	return m;
}

function insertAfter(images, afterId, slots) {
	const exist = new Set(images.map((im) => im.id));
	const fresh = slots.filter((s) => !exist.has(s.id));
	if (!fresh.length) return [];
	const i = images.findIndex((im) => im.id === afterId);
	if (i < 0) throw new Error(`missing slot ${afterId}`);
	images.splice(i + 1, 0, ...fresh);
	return fresh.map((s) => s.id);
}

function dropSrc(im) {
	delete im.src;
}

const shadow = (device) =>
	`Minimal iconic 16:9 poster. Taizong, Second Emperor of Tang. ONE geometric device: ${device} Silhouette only — no readable face, encased in darkness. Face stays in shadow. Emperor-amber ${AMBER} as the single yellow shaft or plane. Striking silky Tang court-military, few hues, wide sleeves, mianliu or futou as a hard black hat-shape. Worm’s-eye, from below, far away: tiny distant figure in monumental emptiness. Flat charcoal void. No army. No palace clutter. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly, monumental. IGNORE modern skyline. IGNORE clouds.`;

const shadow916 = (device) =>
	`Minimal iconic 9:16 poster. Taizong, Second Emperor of Tang. ONE geometric device: ${device} Silhouette only — no readable face, encased in darkness. Face stays in shadow. Emperor-amber ${AMBER} as the single yellow shaft or plane. Striking silky Tang court-military, few hues, wide sleeves, mianliu as a hard black hat-shape. Worm’s-eye, from below, far away: tiny distant figure in monumental emptiness. Flat charcoal void. No army. No palace clutter. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.`;

const twoShot = (device) =>
	`Minimal iconic 16:9 poster. Taizong and Kim Chunchu, two men alone. ONE geometric device: ${device} Faces match the attached portraits. Taizong fully in warm light, smiling, informal — he likes this man. Two small figures, vast empty plane, lots of negative space. Magenta ${MAGENTA} silky Silla hanbok versus emperor-amber ${AMBER} silky Tang court. Few hues, premium sheen. Flat pale-gold void, no clouds. No court crowd. No kowtow. No palace clutter. No army. No text. No watermark. Graphic color-blocking, anime-painterly, monumental. IGNORE modern skyline. IGNORE clouds.`;

const byId = slotMap();
const patched = [];

function set(id, fields) {
	const im = byId.get(id);
	if (!im) throw new Error(`missing slot ${id}`);
	const drop = fields.src === null;
	const rest = { ...fields };
	delete rest.src;
	Object.assign(im, rest);
	if (drop) dropSrc(im);
	patched.push(id);
}

// ── Pre-Ansi: silhouette / yellow shaft ──────────────────────────────────

set('taizong-throne-majesty', {
	src: null,
	ratio: 0.5625,
	tone: AMBER,
	alt: 'Worm’s-eye stair-wedge of amber light; tiny Taizong silhouette at the apex — no face',
	prompt: shadow916(
		'looking UP a hard triangular stair-wedge of amber light receding into a charcoal void; one tiny emperor-silhouette at the apex, not filling the frame.'
	),
	refs: ['/pl_daming_palace.png']
});

set('taizong-portrait', {
	src: null,
	ratio: 1.778,
	tone: AMBER,
	alt: 'Inverted crown-stamp: huge black mianliu filling the top; tiny yellow-rimmed silhouette far below',
	prompt: shadow(
		'an inverted stamp — a huge black mianliu-crown shape filling the upper two-thirds like a seal pressed down; one tiny yellow-rimmed robe-silhouette far below on a wet black floor.'
	),
	refs: ['/pl_daming_palace.png']
});

set('taizong-vast-harem', {
	ratio: 1.778,
	tone: '#b91c1c',
	nsfw: true,
	alt: 'Wide Daming inner palace: forest of tiny women on a crimson plane; one yellow emperor shaft — no faces',
	prompt: `Wide cinematic EXPOSITION still, 16:9. ICONIC / MINIMAL EPIC. Camera far back, worm’s-eye from below. Tiny distant figures only — no readable faces. Hard crimson wall plane, wet reflective floor. Forest of tiny women in stacked silk ranks receding into haze. ONE accent: intense yellow emperor-light shaft ${AMBER} with a single tiny standing speck of the emperor, encased in darkness. Flat charcoal void beyond the shaft, no clouds. No intimate close. No text. No watermark. PLACE: Tang Daming inner court. IGNORE modern skyline. IGNORE clouds.`,
	refs: ['/pl_daming_palace.png']
});

set('taizong-court', {
	src: null,
	ratio: 1.778,
	tone: AMBER,
	alt: 'Edge-needle: emperor as a black robe-mass at the left; a thin amber shaft standing far right — empty hall',
	prompt: shadow(
		'edge-needle — vast charcoal void; the emperor only as a black robe-mass cropped at the LEFT edge; a single thin amber shaft-needle standing far RIGHT in emptiness; no courtiers.'
	),
	refs: ['/pl_daming_palace.png']
});

set('taizong-far-plane', {
	ratio: 1.778,
	tone: AMBER,
	alt: 'Low-strip: a hard imperial-amber plane; one tiny far silhouette at the right — no readable face',
	prompt: shadow(
		'a low horizontal strip — the lower third a hard imperial-amber plane, the rest flat charcoal void; ONE tiny far silhouette at the far right of the amber strip, not a huge foreground figure.'
	),
	refs: ['/pl_daming_palace.png']
});

set('tang-map', {
	src: null,
	ratio: 1.778,
	tone: AMBER,
	alt: 'A hard amber map-rectangle on a wet black floor; tiny emperor-silhouette at the far edge — no face',
	prompt: shadow(
		'the empire as a hard amber rectangle stamped onto a vast wet black floor; one tiny emperor-silhouette standing at the far edge of the rectangle, looking down at it; no close-up, no readable map labels.'
	),
	refs: ['/pl_daming_palace.png']
});

set('taizong-door-slit', {
	ratio: 1.778,
	tone: '#7f1d1d',
	alt: 'Corner crop: a doorway slit of darkness; one yellow accent; Taizong only a crown-and-robe silhouette',
	prompt: shadow(
		'a severe corner crop — most of the frame a flat crimson-black void; a single vertical doorway slit at the far right, darkness inside, one thin amber accent along the jamb; the emperor only a tiny crown-and-robe silhouette inside the slit.'
	),
	refs: ['/pl_daming_palace.png']
});

set('four-riders', {
	src: null,
	ratio: 1.778,
	tone: AMBER,
	alt: 'Four tiny black rider-specks on an amber dust-wedge; worm’s-eye, no faces',
	prompt: shadow(
		'a hard amber dust-wedge receding from the bottom; four tiny black rider-specks on the wedge, one slightly brighter amber hem; worm’s-eye from below, far away; no readable faces, no army filling the frame.'
	),
	refs: []
});

set('yellow-general', {
	src: null,
	ratio: 1.778,
	tone: AMBER,
	alt: 'Horizontal spear-bar: tiny armored horse-silhouette on a black line; amber shaft from below — no face',
	prompt: shadow(
		'one hard black spear as a thin horizontal bar across the lower third; a tiny armored horse-and-rider silhouette standing on that line; an amber light-shaft rising from BELOW; no army, no clouds, no readable face.'
	),
	refs: []
});

set('taizong-son-of-heaven', {
	ratio: 1.778,
	tone: AMBER,
	alt: 'High hem-ribbon of amber silk across the upper third; tiny standing silhouette hanging from it — no kowtow',
	prompt: shadow(
		'a long silky amber hem-ribbon stretching across the UPPER third of a charcoal void; one tiny standing emperor-silhouette hanging from the ribbon like a seal; no envoy, no kowtow, no court.'
	),
	refs: ['/pl_daming_palace.png']
});

set('taizong-throne-shadow', {
	refs: []
});

set('taizong-empty-dais', {
	tone: AMBER,
	refs: []
});

set('tang-axis-palace', {
	refs: []
});

set('taizong-floor-mirror', {
	refs: []
});

// ── Ansi: first face ─────────────────────────────────────────────────────

set('tang-retreat', {
	ratio: 1.778,
	tone: AMBER,
	alt: 'A thin black cavalry-ribbon turning from a red stone wall-bar; fading amber shaft — tiny silhouettes',
	prompt: shadow(
		'a red stone wall as a hard horizontal bar across the upper third; a thin black ribbon of tiny cavalry turning away along the wet floor; the amber shaft fading at the left edge; worm’s-eye, far away; no readable faces.'
	),
	refs: ['/pl_ansi.png']
});

const ansiFace = {
	id: 'taizong-ansi-face',
	ratio: 1.778,
	tone: AMBER,
	at: 'The Second Emperor tries the wall first',
	alt: 'First readable face: Taizong under Ansi’s black wall-bar, amber camp-shaft on the face, body in shadow',
	prompt: `Minimal iconic 16:9 poster. Taizong, Second Emperor of Tang — first readable face. ONE geometric device: a black stone fortress-wall as a hard horizontal bar across the upper two-thirds; worm’s-eye from BELOW the wall; the first readable face appearing in a yellow camp-shaft in the gap UNDER the wall. Face matches the attached portrait. Dramatic, not a casual portrait: face emerging from darkness, rest of the body still encased in shadow. Emperor-amber ${AMBER} as the single accent. Striking silky Tang campaign robe and armour, few hues. Flat charcoal void, no clouds. No army clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental. IGNORE clouds.`,
	refs: ['/ch_taizong.png', '/pl_ansi.png']
};

// ── Chunchu: fully in light, two-shots, negative space ───────────────────

set('bowing-envoys', {
	ratio: 1.778,
	tone: AMBER,
	at: 'approaches the Second Emperor',
	alt: 'Two small figures walking toward each other on a vast pale-gold empty hall — smiling, no kowtow',
	prompt: twoShot(
		'two tiny walking figures as small marks approaching each other across a vast pale-gold empty hall-plane; 80 percent negative space; they are far away, faces just readable, Taizong already smiling.'
	),
	refs: ['/ch_taizong.png', '/ch_chunchu.png', '/pl_daming_palace.png']
});

set('taizong-name-gift', {
	ratio: 1.778,
	tone: AMBER,
	alt: 'Two small standing figures at the far end of a huge empty cream-gold floor — Taizong smiling, informal',
	prompt: twoShot(
		'two small standing figures at the FAR end of a huge empty wet cream-gold floor-plane; the rest of the frame is empty light; Taizong smiling as he gives his name; informal warmth, not a throne-room.'
	),
	refs: ['/ch_taizong.png', '/ch_chunchu.png', '/pl_daming_palace.png']
});

const chunchuEmpty = {
	id: 'taizong-chunchu-empty',
	ratio: 1.778,
	tone: AMBER,
	at: 'Yes — there is something between us that fits.',
	alt: 'Asymmetric corner: two tiny smiling figures only in the lower-left of a vast empty pale-gold plane',
	prompt: twoShot(
		'asymmetric corner crop — two tiny smiling figures only in the lower-left corner; eighty percent of the frame a vast empty pale-gold plane; informal, alone, no furniture.'
	),
	refs: ['/ch_taizong.png', '/ch_chunchu.png', '/pl_daming_palace.png']
};

const chunchuAlone = {
	id: 'taizong-chunchu-alone',
	ratio: 1.778,
	tone: AMBER,
	at: 'You asked my name, did you not.',
	alt: 'Low bench-strip: two seated small figures on a silk bar; the rest empty warm gold — Taizong smiling',
	prompt: twoShot(
		'a single horizontal silk-bench as a thin bar across the bottom; two seated small figures on it, Taizong smiling, informal; the rest of the frame empty warm gold void.'
	),
	refs: ['/ch_taizong.png', '/ch_chunchu.png', '/pl_daming_palace.png']
};

const added = [];
added.push(...insertAfter(findEntry('Ansi').images, 'ansi-earthen-ramp', [ansiFace]));
added.push(
	...insertAfter(findEntry('Silla-Tang Alliance').images, 'taizong-name-gift', [
		chunchuEmpty,
		chunchuAlone
	])
);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched', patched.length, patched.join(', '));
console.log('added', added.length, added.join(', '));
