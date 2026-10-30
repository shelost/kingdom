// Dates the scene plates the timeline could not place. `jump` = the printed year on an exact
// leap ("Eight Years Later…"); `quiet` = a silent `year` for vague leaps and plateless scenes.
import { editStory } from './story-ops.mjs';

const DATES = {
	Muryuk: [
		['The Golden Gaya palace', 'quiet', 524],
		['Golden Gaya · eight years later', 'jump', 532],
		['The Gaya house gate · that spring', 'quiet', 533],
		['The Harmony Council · some years on', 'quiet', 540],
		['Surabol · the years after', 'quiet', 541],
		['The Night Road', 'quiet', 554],
		['Great Gaya · 562', 'jump', 562],
		['Surabol, the Gaya house · the next spring', 'quiet', 563],
		['Surabol, the Gaya house · eight years after Great Gaya', 'jump', 570]
	],
	Seohyun: [
		['The Gaya house · twenty years after Gwansan', 'jump', 574],
		['Surabol, the palace gyuku field · by night', 'quiet', 583],
		['Surabol · ten years later', 'jump', 593],
		['Manno', 'quiet', 594],
		['Manno · the cart from Surabol', 'quiet', 595],
		['Fifteen', 'quiet', 609],
		['Surabol, the hwarang yard gate · Class 51’s first morning', 'quiet', 610],
		['Surabol · the torn coat', 'quiet', 625],
		['Nangbi · the rise behind the trenches', 'quiet', 629]
	],
	Jolbon: [['The Moon', 'jump', -24]],
	Suro: [['The Red Sail', 'jump', 48]],
	Jahee: [['The Coronation Year', 'jump', 654]],
	Hyukgosé: [['Alyung Well', 'jump', -53]],
	Alji: [['Gyerim · ten springs later', 'jump', 75]],
	'The King for All': [
		['Five Summers Later', 'jump', 681],
		['The Tablet', 'jump', 692]
	]
};

editStory((story) => {
	const entries = story.flatMap((c) => c.entries);
	for (const [title, dates] of Object.entries(DATES)) {
		const entry = entries.find((e) => e.title === title);
		if (!entry) throw new Error(`no entry ${title}`);
		for (const [label, how, year] of dates) {
			const b = entry.blocks.find((x) => (x.kind === 'scene' || x.kind === 'day') && x.label === label);
			if (!b) throw new Error(`${title}: no scene "${label}"`);
			if (how === 'jump') {
				if (!b.jump) throw new Error(`${title}: "${label}" has no jump plate`);
				b.jump = { year, ...b.jump };
			} else b.year = year;
		}
	}
});
console.log('dated', Object.values(DATES).flat().length, 'plates');
