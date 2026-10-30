// Prologue pass: emotion cards + still motion, and the three silhouette founding stills.
//   node scripts/.cache/prologue-founding/apply.mjs
import { editStory } from '../story-ops.mjs';

const EMOTIONS = { 'Love.': 'love', 'Revenge.': 'revenge', 'Betrayal.': 'betrayal', 'Greed.': 'greed', 'Loyalty.': 'loyalty', 'Pride.': 'pride', 'Rage.': 'rage' };

const CAP =
	'Every figure wears the jougwan from the research page: a small black peaked jeolpung tied under the chin with TWO long barred pheasant tail feathers splayed upward in a V (reference: the Goguryeo feather-cap diagram).';
const STYLE =
	'Painterly Korean ink painting (sumukhwa) meets graphic film poster: splashed ink, dry-brush, hanji grain, hard flat black silhouettes against a luminous painted sky; no faces, no text, no seal, no watermark. 2:1.';

const FOUNDING = {
	'prologue-goguryeo': {
		motion: 'goguryeo',
		tempImage: '/temp/prologue-goguryeo-five-tribes.jpg',
		alt: 'Five feather-capped chieftains in silhouette on five black peaks, each in a different pose, around one blood-red sun; the tribal beasts loom in the crimson sky',
		prompt: `Symbolic poster still, the founding of Goguryeo. Five jagged black peaks like the points of a crown; on each summit ONE chieftain in black silhouette, five poses (spear raised, arms flung wide, kneeling, drawing a bow, holding a torch), all leaning toward ONE huge blood-red sun behind the middle peak. The five tribal totems (crow, horse, ox, boar, dog) loom as smoke in the sky. Crimson #c8322a and black, bone-white snow. ${CAP} ${STYLE}`
	},
	'prologue-silla': {
		motion: 'silla',
		tempImage: '/temp/prologue-silla-six-elders.jpg',
		alt: 'Six feather-capped elders in silhouette, three each side of a vast gold moon, raise the boy they chose on a white egg; a white horse kneels by the mound',
		prompt: `Symbolic poster still, the founding of Silla. A vast pale-gold moon on a deep Silla-blue night over a grassy mound on the plain; EXACTLY six elders in black silhouette, three each side, six poses (arms raised, bowing, leaning on a staff, kneeling palms up, pointing skyward, arms raised), all turned to the boy standing on a great white egg at the moon's centre; a white horse kneels by the mound; six gold stars, one over each elder. Blue #2a4fa8, gold #e9cf7a, black. ${CAP} ${STYLE}`
	},
	'prologue-baekje': {
		motion: 'baekje',
		ratio: 2,
		tempImage: '/temp/prologue-baekje-ten-attendants.jpg',
		alt: 'Ten feather-capped attendants in silhouette walk south along a golden tidal flat at dawn, each in a different pose, mirrored in the wet sand',
		prompt: `Symbolic poster still, the founding of Baekje. A golden dawn over the western sea; a curving tidal-flat path; TEN attendants in single file in black silhouette heading south, ten poses (carrying rice, leading a horse, a spear, a banner, a child, a seed jar, a bow, a staff, looking back, an arm raised), every one mirrored upside-down in the wet sand. Baekje gold #e2b23c to #f3d27a, indigo foreground, black. ${CAP} ${STYLE}`
	}
};

const STILL_MOTION = {
	'prologue-love': 'love',
	'prologue-revenge': 'revenge',
	'prologue-betrayal': 'betrayal',
	'prologue-greed': 'greed',
	'prologue-loyalty': 'loyalty',
	'prologue-pride': 'pride',
	'prologue-rage': 'rage'
};

const report = editStory((story) => {
	const chapter = story.find((c) => c.id === 'prologue-samhan');
	if (!chapter) throw new Error('prologue-samhan not found');
	const entry = chapter.entries[0];
	const done = { cards: 0, motions: 0, founding: 0 };
	for (const b of entry.blocks) {
		const emotion = b.kind === 'p' ? EMOTIONS[b.html] : undefined;
		if (emotion) {
			b.emotion = emotion;
			done.cards++;
		}
	}
	for (const img of entry.images) {
		if (STILL_MOTION[img.id]) {
			img.motion = STILL_MOTION[img.id];
			done.motions++;
		}
		const f = FOUNDING[img.id];
		if (f) {
			Object.assign(img, f);
			delete img.people;
			done.founding++;
		}
	}
	return done;
});

console.log(report);
