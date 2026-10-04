// Tang guardian stills redone as dark, intimidating Chinese ink painting; only the Second Emperor stays a colour webtoon figure.
import { readFileSync, writeFileSync } from 'node:fs';

const OPEN =
	'HEEWON STYLE MOVIE POSTER key art, 2:1 letterbox, composed so nothing important touches the top or bottom edge; heads and the dragon’s head stay inside the central band; no title, no lettering.';
const INK =
	'TANG RENDER: predominantly DARK and INTIMIDATING Chinese ink painting (shuimohua) on rice paper — heavy black and grey ink washes, wet-on-wet ink bleeding, splashed ink smoke and storm, dry calligraphic brush strokes for roofs, columns, robes and cloud, ink splatters and drips at the frame edges, bare paper only where the edges dissolve; the gold ink-brush dragon is the main colour in the dark, with a few small vermilion and flame accents.';
const TAIZONG_COLOUR =
	'THE ONE EXCEPTION: the Second Emperor himself is a full-colour Korean webtoon figure — clean ink linework, drawn face matching the attached portrait, warm skin, imperial yellow robe-cape over black brocade, black futou — a coloured man inside an ink empire; nothing else in the frame is in full colour.';
const GAOZONG_INK =
	'Every figure, the Third Emperor included, is ink-painted in the same black-and-grey wash with only a thin wash of dull yellow on his robe; no full-colour figure in the frame.';
const STYLE =
	'Movie-poster key art: bold iconic silhouette, big dark masses, one bright break of light, NO text, NO title, NO credits, NO logo, NO seal stamp, no calligraphy characters. Not photoreal, not 3D, not a realistic scaled dragon. No glow aura, no halo — the accent is real light. One of each named person. No watermark.';
const S = (scene, figures) => [OPEN, scene, INK, figures, STYLE].join(' ');

const prev = [
	...JSON.parse(readFileSync(new URL('./guardians-manifest.json', import.meta.url))),
	...JSON.parse(readFileSync(new URL('./monarch-animals-manifest.json', import.meta.url)))
];
const base = (id) => {
	const { scene, prompt, refs, ...rest } = prev.find((i) => i.id === id);
	return rest;
};

const items = [
	{
		...base('guardian-taizong-huanglong'),
		alt: 'Ink-painted poster: the gold dragon coils out of black storm ink around the Second Emperor on the Hanyuan terrace, his hand resting on its snout',
		scene: S(
			'Night on the top terrace of the Hanyuan Hall at the Daming Palace, the palace roofs below dissolving into black ink. Low angle. TWO SUBJECTS: a human-scale emperor AND a huge dragon. INTERACTION: the gold Tang dragon Huanglong (gold ink-brush dragon from the attached board, three claws) pours out of a black ink storm in one great S around and behind the Second Emperor and lowers its huge head right beside him, jaws closed, whiskers drifting like brush strokes; the emperor stands at the balustrade scowling toward the east, one hand resting flat on the dragon’s snout. One lamp-fire key (#c97a2e) from below catches his gold thread, his beard and the dragon’s jaw; everything else is ink-black.',
			TAIZONG_COLOUR
		)
	},
	{
		...base('taizong-huanglong-audience'),
		alt: 'Ink-painted poster: the Second Emperor in colour on a black ink dais, the gold dragon coiled around the throne and an ink-wash envoy kneeling far below',
		scene: S(
			'Night in the Daming Palace hall: columns and lattice doors as towering black ink strokes, small flame points in the dark, a black ink-wash floor with wet reflections, incense smoke as grey wash. Low angle from the floor. TWO SUBJECTS: a human-scale emperor AND a huge dragon. INTERACTION: the Second Emperor sits on the dais leaning on one elbow; the gold Tang dragon Huanglong (gold ink-brush dragon from the attached board, three claws) coils around the back and sides of the throne and rests its huge head on the throne arm beside him; he lays his palm on its brow-ridge without looking, his eyes on a tiny kneeling envoy far below, the envoy only a few strokes of grey ink. One gold lamp key (#c97a2e) on his face, his hand and the dragon’s scales.',
			TAIZONG_COLOUR
		)
	},
	{
		...base('taizong-huanglong-death'),
		alt: 'Ink-painted poster: the dying Second Emperor, still in colour, lifts his hand and the gold dragon lowers its head through black ink gauze to meet it',
		scene: S(
			'Night in a summer palace bedchamber: gauze curtains as pale grey washes, the bed and the room sinking into black ink, one lamp. High three-quarter angle over the bed. TWO SUBJECTS: a dying man AND a huge dragon. INTERACTION: the dying Second Emperor lies propped on pillows, grey and gaunt, cap removed, and lifts one thin hand; the gold Tang dragon Huanglong (gold ink-brush dragon from the attached board, three claws) has wound its body around the bed frame and lowers its huge head through the gauze, snout pressed into his palm, eyes half-closed. Its coils fill the black around the bed. The single lamp (#c97a2e) catches his face, his hand and the dragon’s muzzle.',
			TAIZONG_COLOUR
		)
	},
	{
		...base('gaozong-huanglong-war'),
		alt: 'Ink-painted poster: the Third Emperor, in grey ink wash, points east from a palace terrace as the gold dragon spirals up out of a black ink storm',
		scene: S(
			'Storm dusk on a high terrace of the Daming Palace: balustrades and owl-tail roof ridges as black calligraphic strokes, a sky of splashed black ink. Worm’s-eye from the terrace floor. TWO SUBJECTS: a human-scale emperor AND a huge dragon. INTERACTION: the Third Emperor, young and uncertain, stands at the balustrade with his arm thrown out pointing east; the gold Tang dragon Huanglong (gold ink-brush dragon from the attached board, three claws) spirals up past him into the black storm, its body curling once loosely around his outstretched arm before it uncoils skyward, its head turned east along his pointing hand. One gold break in the storm (#b8935a) catches his face, his arm and the dragon’s coils.',
			GAOZONG_INK
		)
	},
	{
		...base('gaozong-huanglong-euija'),
		alt: 'Ink-painted poster: the Third Emperor, in grey ink wash, rests his hand on the gold dragon coiled at his feet as a tiny prisoner kneels in the far doorway',
		scene: S(
			'Night in the Daming Palace hall: a black ink screen behind the dais, red lanterns as small vermilion dabs, smoke as grey wash, a black reflective floor. Low angle up the dais steps. TWO SUBJECTS: a human-scale emperor AND a huge dragon. INTERACTION: the Third Emperor sits forward on the dais, one hand resting on the head of the gold Tang dragon Huanglong (gold ink-brush dragon from the attached board, three claws), which lies coiled down the steps with its huge chin on his knee; both look down the long black hall toward a tiny prisoner kneeling in a pale slot of doorway light. He looks almost kind. One gold lantern key (#b8935a) on his face, his hand and the dragon’s head.',
			GAOZONG_INK
		)
	}
];

writeFileSync(new URL('./tang-ink-manifest.json', import.meta.url), JSON.stringify(items, null, '\t') + '\n');
console.log(items.length, 'items');
