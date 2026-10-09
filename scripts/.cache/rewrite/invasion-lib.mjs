/** Block helpers for the invasion rewrite (#31–#39). Pure functions on an entry; call inside editStory. */
import { lists, textOf } from '../story-ops.mjs';

const strip = (s = '') => s.replace(/<[^>]+>/g, '');

function blockText(b) {
	if (b.kind === 'map') return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
	if (b.kind === 'table') return [...(b.head ?? []), ...(b.rows ?? []).flat()].join(' ');
	return textOf(b);
}

export function flat(blocks, out = []) {
	for (const b of blocks) {
		out.push(b);
		if (b.kind === 'flashback' && Array.isArray(b.blocks)) flat(b.blocks, out);
	}
	return out;
}

export function makeKit(story) {
	const chips = new Map();
	for (const c of story) for (const e of c.entries) for (const b of flat(e.blocks)) if (b.kind === 'dialogue' && b.person && b.chip && !chips.has(b.person)) chips.set(b.person, b.chip);

	const P = (html, ko) => ({ kind: 'p', html, ko });
	const CARD = (html, ko) => ({ kind: 'p', html: `<b>${html}</b>`, ko: `<b>${ko}</b>` });
	const S = (label, ko) => ({ kind: 'scene', label, ko });
	/** D('gesomun', en[], ko[], { look }) or D({ speaker: 'Rider' }, en[], ko[]) */
	const D = (who, en, ko, extra = {}) => {
		if (en.length !== ko.length) throw new Error(`dialogue length mismatch: ${en[0]}`);
		const b = { kind: 'dialogue' };
		if (typeof who === 'string') {
			b.person = who;
			b.chip = chips.get(who) ?? '#8d8d95';
		} else {
			Object.assign(b, who);
			b.chip ??= '#8d8d95';
		}
		return Object.assign(b, { lines: ko, en }, extra);
	};
	return { P, CARD, S, D };
}

/** Unique block whose text contains `frag` (and passes `pred`). Throws on 0 or >1 hits. */
export function get(e, frag, pred = () => true) {
	const hits = flat(e.blocks).filter((b) => pred(b) && strip(blockText(b)).includes(frag));
	if (hits.length !== 1) throw new Error(`get(${JSON.stringify(frag)}): ${hits.length} hits in ${e.title}`);
	return hits[0];
}

function locate(e, b) {
	for (const list of lists(e)) {
		const i = list.indexOf(b);
		if (i >= 0) return { list, i };
	}
	throw new Error('block not in entry');
}

const ref = (e, x) => (typeof x === 'string' ? get(e, x) : x);

export function del(e, ...xs) {
	for (const x of xs) {
		const { list, i } = locate(e, ref(e, x));
		list.splice(i, 1);
	}
}

export function after(e, x, ...blocks) {
	const { list, i } = locate(e, ref(e, x));
	list.splice(i + 1, 0, ...blocks);
	return blocks.at(-1);
}

export function before(e, x, ...blocks) {
	const { list, i } = locate(e, ref(e, x));
	list.splice(i, 0, ...blocks);
	return blocks.at(-1);
}

/** Replace text fields of a block in place (keeps the object, so anchors can re-point to it). */
export function set(e, x, props) {
	const b = ref(e, x);
	if (props.en || props.lines) {
		delete b.zh;
		delete b.zhLatn;
	}
	Object.assign(b, props);
	return b;
}

/** Move blocks (in the given order) to just after `target`. */
export function move(e, xs, target) {
	const bs = xs.map((x) => ref(e, x));
	const t = ref(e, target);
	for (const b of bs) {
		const { list, i } = locate(e, b);
		list.splice(i, 1);
	}
	after(e, t, ...bs);
	return bs.at(-1);
}

/** Unwrap a flashback block: its children take its place. */
export function unwrap(e, x) {
	const b = ref(e, x);
	const { list, i } = locate(e, b);
	list.splice(i, 1, ...b.blocks);
}

const CONTENT = new Set(['p', 'dialogue', 'quote', 'poem', 'edict']);
function fragment(b) {
	if (!CONTENT.has(b.kind)) return null;
	const t = strip(b.html ?? b.en?.[0] ?? '').trim();
	if (!t) return null;
	return t.split(/\s+/).slice(0, 6).join(' ');
}

/**
 * Run `mutate`, then re-point every image anchor that matched before and no longer matches
 * to the nearest surviving content block (itself first, if it survived with new text).
 * `overrides` maps an old `at` string to a new fragment (applied even to anchors that were already broken).
 */
export function withAnchors(e, mutate, overrides = {}) {
	const beforeList = flat(e.blocks);
	const owner = new Map();
	for (const im of e.images ?? []) {
		if (!im.at) continue;
		const a = strip(im.at);
		owner.set(im, beforeList.findIndex((b) => strip(blockText(b)).includes(a)));
	}
	mutate();
	const afterList = flat(e.blocks);
	const alive = new Set(afterList);
	const hay = afterList.map((b) => strip(blockText(b))).join('\n');
	let moved = 0;
	for (const im of e.images ?? []) {
		if (!im.at) continue;
		if (overrides[im.at]) {
			im.at = overrides[im.at];
			moved++;
			continue;
		}
		if (hay.includes(strip(im.at))) continue;
		const i = owner.get(im);
		if (i == null || i < 0) continue;
		search: for (let d = 0; d < beforeList.length; d++)
			for (const j of d ? [i + d, i - d] : [i]) {
				const b = beforeList[j];
				const f = b && alive.has(b) ? fragment(b) : null;
				if (f) {
					im.at = f;
					moved++;
					break search;
				}
			}
	}
	for (const im of e.images ?? []) if (im.at && overrides[im.at] === undefined && !hay.includes(strip(im.at)) && owner.get(im) >= 0) throw new Error(`anchor left broken: ${im.id}`);
	return moved;
}

export function words(e) {
	return flat(e.blocks)
		.map((b) => strip([b.html, b.caption, ...(b.en ?? [])].filter(Boolean).join(' ')))
		.join(' ')
		.split(/\s+/)
		.filter(Boolean).length;
}
