// Shared helpers for one-off story.json insert scripts: block builders, text anchors, rerun guards.
import fs from 'node:fs';
import { hexFor } from '../visual-canon.mjs';

export const STORY = 'src/lib/data/story.json';
const UNNAMED_CHIP = '#8d8d95';

export const text = (b) => [b.html, b.label, ...(b.en ?? []), ...(b.lines ?? [])].join(' ');

export const p = (html, ko) => ({ kind: 'p', html, ko });
export const quote = (html, ko, hanja, source) => ({ kind: 'quote', html, ko, hanja, source });
export const flashback = (year, title, blocks) => ({ kind: 'flashback', year: String(year), title, blocks });
/** Dialogue from someone with no profile (groom, officer). */
export const voice = (lines, en) => ({ kind: 'dialogue', chip: UNNAMED_CHIP, lines, en });

export function openStory() {
	const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
	const entries = story.flatMap((c) => c.entries ?? []);
	const chipCounts = new Map();
	const walk = (blocks) => {
		for (const b of blocks) {
			if (b.kind === 'dialogue' && b.person && b.chip) {
				const m = chipCounts.get(b.person) ?? new Map();
				m.set(b.chip, (m.get(b.chip) ?? 0) + 1);
				chipCounts.set(b.person, m);
			}
			if (b.blocks) walk(b.blocks);
		}
	};
	walk(entries.flatMap((e) => e.blocks ?? []));

	/** The chip a person already speaks with most often, else their people.ts hex. */
	const chipFor = (person) => {
		const m = chipCounts.get(person);
		if (m) return [...m].sort((a, b) => b[1] - a[1])[0][0];
		return hexFor(person) ?? UNNAMED_CHIP;
	};
	const say = (person, lines, en) => ({ kind: 'dialogue', chip: chipFor(person), person, lines, en });

	function entry(title) {
		const e = entries.find((x) => x.title === title);
		if (!e) throw new Error(`missing entry ${title}`);
		return e;
	}

	const save = () => fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
	return { story, entries, entry, chipFor, say, save };
}

export function indexOf(e, needle) {
	const i = e.blocks.findIndex((b) => text(b).includes(needle));
	if (i < 0) throw new Error(`${e.title}: anchor not found: ${needle}`);
	return i;
}

export function insertAfter(e, needle, blocks) {
	e.blocks.splice(indexOf(e, needle) + 1, 0, ...blocks);
}

export function insertBefore(e, needle, blocks) {
	e.blocks.splice(indexOf(e, needle), 0, ...blocks);
}

export function guard(e, marker) {
	if (JSON.stringify(e.blocks).includes(marker)) throw new Error(`${e.title}: already inserted (${marker})`);
}
