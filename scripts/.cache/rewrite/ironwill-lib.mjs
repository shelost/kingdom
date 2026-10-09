// Shared builders for the Iron Will rewrite (#21–#30). Used by ironwill.mjs.
import { editStory, lists, textOf } from '../story-ops.mjs';

export const CHIP = {
	gumil: '#9a7b5f',
	gumilwife: '#c98fb0',
	pumsuk: '#7aa8d8',
	gotaso: '#f472b6',
	mochuk: '#8f7f6a',
	jukjuk: '#6f8a5a',
	yunchung: '#c9932a',
	kangrim: '#5f5f6b',
	herald: '#8d8d95',
	munhee: '#e07fa8',
	chunchu: '#D8258C',
	yushin: '#4a8fe0',
	chunmyung: '#d8a0e8',
	munmu: '#3fa9c9',
	euija: '#e08a2e',
	gyebek: '#8a6f3f',
	gesomun: '#d0362f',
	dosuryu: '#c98578',
	sunduk: '#E8552B',
	taizong: '#c97a2e',
	weizheng: '#9a7b4f',
	chusuiliang: '#8c7a5b',
	crowd: '#8a8a94'
};

export const P = (html, ko, extra = {}) => ({ kind: 'p', html, ko, ...extra });
export const D = (person, en, ko, extra = {}) => {
	if (en.length !== ko.length) throw new Error(`dialogue mismatch for ${person}: ${en[0]}`);
	return { kind: 'dialogue', chip: CHIP[person] ?? CHIP.crowd, lines: ko, en, person, ...extra };
};
export const C = (speaker, en, ko) => {
	if (en.length !== ko.length) throw new Error(`crowd mismatch: ${en[0]}`);
	return { kind: 'dialogue', chip: CHIP.crowd, speaker, lines: ko, en };
};
export const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
export const CARD = (person, caption, ko) => ({ kind: 'card', person, caption, ko });
export const BOLD = (en, ko) => P(`<b>${en}</b>`, `<b>${ko}</b>`);

const strip = (s = '') => s.replace(/<[^>]+>/g, '');

function blockText(b) {
	if (b.kind === 'ledger')
		return [b.title, b.ko, ...b.rows.flatMap((r) => [r.label, r.ko, ...r.values.flatMap((v) => [v.value, v.note])])]
			.filter(Boolean)
			.join(' ');
	if (b.kind === 'map') return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
	if (b.kind === 'table') return [...b.head, ...b.rows.flat()].join(' ');
	return textOf(b);
}

export const hayOf = (entry) =>
	lists(entry)
		.flat()
		.map((b) => strip(blockText(b)))
		.join('\n');

/** Picks blocks out of a snapshot of the original entry by text fragment. */
export function picker(blocks) {
	const orig = structuredClone(blocks);
	return (frag, mod) => {
		let hits = orig.filter((b) => textOf(b).includes(frag));
		if (hits.length > 1) hits = hits.filter((b) => b.label === frag || b.html === frag);
		if (hits.length !== 1) throw new Error(`pick "${frag}": ${hits.length} hits`);
		const b = structuredClone(hits[0]);
		if (mod) mod(b);
		return b;
	};
}

/**
 * Re-anchor images after a rewrite. `byId` and `byAt` give explicit targets; anything whose
 * anchor no longer matches falls back to `fallback`. Retired markers and unanchored slots stay.
 * Every target must match the new text, or the edit aborts.
 */
export function reanchor(entry, { byId = {}, byAt = {}, fallback, force = () => false }) {
	const hay = hayOf(entry);
	const log = [];
	for (const im of entry.images ?? []) {
		if (!im.at || im.at.startsWith('__retired')) continue;
		let to = byId[im.id] ?? byAt[im.at];
		if (!to && (force(im) || !hay.includes(strip(im.at)))) to = fallback;
		if (!to || to === im.at) continue;
		if (!hay.includes(strip(to))) throw new Error(`${entry.title}: target "${to}" not in text (${im.id})`);
		log.push(`${im.id}: ${im.at} → ${to}`);
		im.at = to;
	}
	return log;
}

export function run(n, done, build) {
	return editStory((story) => {
		const e = story.flatMap((c) => c.entries)[n - 1];
		if (done(e)) {
			console.log(`#${n} ${e.title}: already applied`);
			return false;
		}
		const log = build(e, story);
		console.log(`#${n} ${e.title}: rewritten (${e.blocks.length} blocks)`);
		for (const l of log ?? []) console.log('   ', l);
	});
}
