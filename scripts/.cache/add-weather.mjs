// Full-screen weather (`SceneWeather`): set on whole episodes and on the plates whose
// scenes need a sky the words alone would not call. Idempotent.
import { editStory, find } from './story-ops.mjs';

/**
 * Episode title → weather for the whole episode, under any plate's. `clear` means
 * none and stops the words from calling one; `null` removes the tag.
 */
const EPISODES = {
	'Commander Yeon': 'snow',
	'Yeon’s Massacre': null,
	Balhae: 'snow',
	// Bidam's rebellion, one sky that only ever worsens: fire from the rising, rain from the sixth night.
	'Gi (起)': 'clear',
	'Seung (承)': 'embers',
	'Jeon (轉)': 'rain',
	'Gyul (結)': 'rain',
	'Queen Jinduk': 'clear',
	Haemosu: null,
	// Battles burn from the first line: one sky for the whole fight.
	'Yellow Mountain': 'embers',
	'Final Ford': 'embers',
	'Stallion Mountain': 'embers',
	'Boiling River': 'embers',
	'Colossal River': 'embers',
	'White River': 'embers',
	Yodong: 'embers',
	Nangbi: 'embers',
	'The Severing': 'embers',
	'Stone Gate': 'embers',
	Maeso: 'embers',
	'Gunchogo, the 13th': 'embers'
};

/**
 * Episode title → [text fragment, cue] on single lines: `weather` changes the sky
 * from that line to the end of its scene, `moment` fires once as it is read.
 */
const CUES = {
	'Yeon’s Massacre': [
		['Every door in the hall closes at once', { weather: 'blood' }],
		['In the aftermath, Yeon enthrones', { weather: 'clear' }]
	],
	Haemosu: [
		['Every day the sun crosses the sky on the same road', { weather: 'clear' }],
		['He falls in love and in lust in the same glance', { moment: 'first-sight' }],
		['Stop the chariot', { weather: 'love' }],
		['The copper room rises on the bank', { weather: 'heat' }],
		['Outside, the river goes on being a river', { weather: 'clear' }]
	],
	Suro: [['Who is that.', { moment: 'first-sight', weather: 'love' }]],
	Jolbon: [['Then the wet man is in the yard', { moment: 'first-sight', weather: 'love' }]],
	Seohyun: [['The first time, he looks and keeps riding', { moment: 'first-sight', weather: 'love' }]],
	Munhee: [['He has to take the coat off for her to mend it', { moment: 'first-sight', weather: 'love' }]],
	'Queen Jinduk': [['Outside, it starts to rain', { weather: 'rain' }]]
};

/** Episode title → [plate label, weather]; every plate with that label in the episode. `null` clears it (a story plate's weather would carry over its whole section). */
const PLATES = {
	'Gi (起)': [['The Rising', 'embers']],
	'Gyul (結)': [
		['The Cavern', null],
		['The cavern under the hill · before light', 'cavern'],
		['The cavern mouth · first light', 'cavern'],
		['DAY 10', 'storm'],
		['Between the Camps', 'storm'],
		['The Queen', 'rain'],
		['The Queen’s Bedside', 'rain'],
		['The Empty Pavilion', 'rain']
	],
	'Jeon (轉)': [
		['The Wait', null],
		['DAY 6', 'rain']
	],
	'Seung (承)': [
		['The Steam Cavern', 'cavern'],
		['Hunger', null]
	],
	'Harmony Council': [
		['Jade Gate Valley', 'snow'],
		['Two of Class 51', 'snow'],
		['The Rock', 'snow']
	],
	'Sima Yi': [
		['Liaodong · the rains', 'rain'],
		['The plain tent · nights', 'rain'],
		['The Siege', null]
	],
	'Pyongyang I': [
		['The Frozen River', 'snow'],
		['The Campfires', 'snow'],
		['The Rice', null]
	],
	'Snake River': [['The Rice Road', 'snow']],
	Nangbi: [
		['The Pyongyang Court', 'clear'],
		['The High Commander’s House', 'clear']
	],
	'Stone Gate': [['The Apology', 'clear']],
	Maeso: [['Surabol', 'clear']],
	Gotaso: [['The Palace Steps', 'rain']],
	Jolbon: [
		['Upstairs', 'heat'],
		['The Grain Room', 'heat'],
		['Dawn in the Cavern', 'cavern']
	],
	Seohyun: [
		['The Spring', 'cavern'],
		['Surabol · the wedding', 'love']
	],
	'Yellow Mountain': [['Yellow Mountain Fields', 'embers']],
	'Yeon’s Massacre': [['The Banquet', 'clear']],
	Ansi: [
		['Ansi · that winter', 'snow'],
		['The Retreat', 'snow'],
		['Ansi · summer 645', 'embers'],
		['The Earthen Mountain', 'embers']
	],
	'Pyongyang II': [
		['The Siege', 'embers'],
		['The Ninth Invasion', 'embers']
	],
	'Ungjin Commandery': [['The Fires', 'embers']],
	'Four Dragons': [['Longmen Field', 'embers']],
	Muryuk: [['The Battle of Golden Gaya', 'embers']],
	'Gwanggeto, the Great King': [['The Horsemen', 'embers']],
	'Forty Fortresses': [['The River Fort', 'embers']],
	Sabi: [
		['Falling Flower Rock', 'ash'],
		['The Fall', 'embers']
	],
	'Siege of Daeya': [
		['The Fall', 'ash'],
		['The Fire', 'embers']
	],
	Munhee: [['The Moon Palace · the archery range, after dark', 'clear']],
	'Huangdi (皇帝)': [
		['On Gunhae', 'storm'],
		['The Six Steeds', 'clear']
	]
};

const PLATE_KINDS = new Set(['scene', 'day', 'story']);

editStory((story) => {
	const entries = (story.chapters ?? story).flatMap((c) => c.entries ?? []);
	const missing = [];
	let changed = 0;
	for (const [title, weather] of Object.entries(EPISODES)) {
		const e = entries.find((x) => x.title === title);
		if (!e) missing.push(title);
		else if ((e.weather ?? null) !== weather) {
			if (weather) e.weather = weather;
			else delete e.weather;
			changed++;
		}
	}
	for (const [title, cues] of Object.entries(CUES)) {
		const e = entries.find((x) => x.title === title);
		if (!e) {
			missing.push(title);
			continue;
		}
		for (const [fragment, cue] of cues) {
			const hits = find(e, fragment, (b) => b.kind === 'p' || b.kind === 'dialogue');
			if (hits.length !== 1) {
				missing.push(`${title} › “${fragment}” (${hits.length} hits)`);
				continue;
			}
			const { b } = hits[0];
			for (const [k, v] of Object.entries(cue)) {
				if (b[k] === v) continue;
				b[k] = v;
				changed++;
			}
		}
	}
	for (const [title, plates] of Object.entries(PLATES)) {
		const e = entries.find((x) => x.title === title);
		if (!e) {
			missing.push(title);
			continue;
		}
		for (const [label, weather] of plates) {
			const hits = e.blocks.filter((b) => PLATE_KINDS.has(b.kind) && b.label === label);
			if (!hits.length) missing.push(`${title} › ${label}`);
			for (const b of hits) {
				if ((b.weather ?? null) === weather) continue;
				if (weather) b.weather = weather;
				else delete b.weather;
				changed++;
			}
		}
	}
	console.log(`weather: ${changed} set`);
	if (missing.length) console.log('missing:', missing.join(' | '));
	return changed > 0;
});
