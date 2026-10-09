import { editStory, textOf } from '../story-ops.mjs';

export const P = (html, ko, extra = {}) => ({ kind: 'p', html, ko, ...extra });
export const S = (label, ko) => ({ kind: 'scene', label, ko });
export const N = (speaker, chip, en, ko) => ({ kind: 'dialogue', speaker, chip, en, lines: ko });

function chipOf(story, person) {
	for (const c of story) for (const e of c.entries) for (const b of e.blocks) if (b.kind === 'dialogue' && b.person === person && b.chip) return b.chip;
	throw new Error(`no chip for ${person}`);
}

/** Patch episode `n` once: skip when `marker` text is already in the entry. */
export function patch(n, marker, fn) {
	const done = editStory((story) => {
		const e = story.flatMap((c) => c.entries)[n - 1];
		if (e.blocks.some((b) => JSON.stringify(b).includes(marker))) return false;
		const at = (i, frag) => {
			const b = e.blocks[i];
			if (!b || !textOf(b).includes(frag)) throw new Error(`#${n} [${i}] expected “${frag}”, got “${b && textOf(b).slice(0, 80)}”`);
			return b;
		};
		const D = (person, en, ko, extra = {}) => ({ kind: 'dialogue', person, chip: chipOf(story, person), en, lines: ko, ...extra });
		const anchor = (id, frag) => {
			const im = e.images.find((x) => x.id === id);
			if (!im) throw new Error(`#${n} no image ${id}`);
			im.at = frag;
		};
		fn({ e, at, D, anchor });
		return true;
	});
	console.log(`#${n} ${done === false ? 'already patched' : 'patched'}`);
}
