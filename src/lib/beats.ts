import { isPlate, type Block, type Entry, type ImageSlot } from '$lib/story';
import { widgetText } from '$lib/widgets';

/**
 * A beat is a run of blocks plus the artwork that belongs beside it.
 *
 * Images carry an `at` fragment naming the block they should appear against.
 * Everything from that block up to the next anchor renders in the same row as
 * the art, so text and image always start level and can never overlap. Several
 * images sharing an anchor simply stack inside that row.
 *
 * `story` / `day` / `scene` plates also force a cut: TOC jumps land on the plate,
 * so it must not trail the previous scene’s stacked art (same class of bug as
 * flashback art sitting above the mini-band). A scene right under a story
 * header rides in the story’s beat, so the two headers read as one.
 */
export interface Beat {
	blocks: Block[];
	images: ImageSlot[];
}

/** Text of a block, for matching an anchor fragment against. */
function textOf(b: Block): string {
	switch (b.kind) {
		case 'p':
		case 'cite':
		case 'moral':
		case 'monologue':
		case 'quote':
			return b.html + ' ' + (b.ko ?? '');
		case 'dialogue':
			return [...b.lines, ...(b.en ?? [])].join(' ');
		case 'verse':
			return [...b.lines, ...(b.en ?? [])].join(' ');
		case 'hanja':
			return b.chars.map((c) => c.char + c.gloss).join(' ') + ' ' + [b.name, b.note, b.after].filter(Boolean).join(' ');
		case 'map':
			return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
		case 'card':
			return [b.write, b.sub, b.role, b.caption, b.ko].filter(Boolean).join(' ');
		case 'term':
			return [b.hanja, b.reading, b.term, b.html, b.ko].filter(Boolean).join(' ');
		case 'flashback':
			return (
				(b.title ?? '') +
				' ' +
				(b.year ?? '') +
				' ' +
				b.blocks.map(textOf).join(' ')
			);
		case 'table':
			return [...b.head, ...b.rows.flat()].join(' ');
		case 'diagram':
			return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
		case 'day':
		case 'scene':
		case 'story':
			return [b.label, b.ko].filter(Boolean).join(' ');
		case 'formation':
			return [b.title, b.note].filter(Boolean).join(' ');
		default:
			return widgetText(b);
	}
}

/** Index of the first block an `at` fragment lands on, or -1. */
function anchoredIndex(blocks: Block[], at: string): number {
	const needle = at.trim().toLowerCase();
	return blocks.findIndex((b) => textOf(b).toLowerCase().includes(needle));
}

/**
 * Top-level index of `block` in `blocks`: the block itself, the flashback that
 * holds it, or (for a filtered copy of the script) the first block with its text.
 */
export function blockIndexOf(blocks: Block[], block: Block): number {
	const holds = (b: Block): boolean => b === block || (b.kind === 'flashback' && b.blocks.some(holds));
	const i = blocks.findIndex(holds);
	if (i >= 0) return i;
	const text = textOf(block);
	return blocks.findIndex((b) => b.kind === block.kind && textOf(b) === text);
}

/** Shortest anchor worth writing; shorter phrases drift onto other blocks as the script changes. */
const MIN_ANCHOR = 14;
/** Longest phrase tried from any one starting word. */
const MAX_ANCHOR_WORDS = 14;

/**
 * An `at` fragment that lands on `blocks[index]` and nothing before it: the
 * shortest tag-free run of the block's own words, from its opening outward.
 * Null when every phrase also occurs earlier (a block that repeats one above it).
 */
export function anchorFor(blocks: Block[], index: number): string | null {
	const block = blocks[index];
	if (!block) return null;
	const segments = textOf(block)
		.split(/<[^>]*>/)
		.map((s) => s.replace(/\s+/g, ' ').trim())
		.filter((s) => s.length >= 4);
	for (const seg of segments) {
		const words = seg.split(' ');
		for (let start = 0; start < words.length; start++) {
			const last = Math.min(words.length, start + MAX_ANCHOR_WORDS);
			for (let end = start + 1; end <= last; end++) {
				const phrase = words.slice(start, end).join(' ');
				if (phrase.length < Math.min(MIN_ANCHOR, seg.length)) continue;
				if (anchoredIndex(blocks, phrase) === index) return phrase;
			}
		}
	}
	for (const seg of segments) if (anchoredIndex(blocks, seg) === index) return seg;
	return null;
}

/** Accepts a full entry or a flashback slice (`blocks` + `images` only). */
export function buildBeats(entry: Pick<Entry, 'blocks' | 'images'>): Beat[] {
	const images = entry.images ?? [];
	const blocks = entry.blocks ?? [];

	// no art, or no anchors at all: one beat, art stacked at the top
	if (!images.some((im) => im.at)) {
		return [{ blocks, images }];
	}

	// resolve each anchor to the first block that contains it
	const anchored = new Map<number, ImageSlot[]>();
	const opening: ImageSlot[] = [];

	for (const im of images) {
		if (!im.at) {
			opening.push(im);
			continue;
		}
		const i = anchoredIndex(blocks, im.at);
		if (i < 0) opening.push(im); // anchor no longer present — keep the art
		else {
			const list = anchored.get(i);
			if (list) list.push(im);
			else anchored.set(i, [im]);
		}
	}

	// Plates always begin a beat so prior-scene art cannot stack above them.
	const cutSet = new Set<number>(anchored.keys());
	for (let i = 0; i < blocks.length; i++) {
		if (isPlate(blocks[i]) && blocks[i - 1]?.kind !== 'story' && blocks[i - 1]?.kind !== 'section')
			cutSet.add(i);
		// A flashback with art rides alone, so its stills interleave with its own blocks.
		if (blocks[i].kind === 'flashback' && anchored.has(i) && i + 1 < blocks.length) cutSet.add(i + 1);
	}

	const starts = [...cutSet].sort((a, b) => a - b);
	const beats: Beat[] = [];

	// everything before the first cut opens the entry
	const firstStart = starts[0] ?? blocks.length;
	if (firstStart > 0 || opening.length) {
		beats.push({ blocks: blocks.slice(0, firstStart), images: opening });
	}

	starts.forEach((start, k) => {
		const end = starts[k + 1] ?? blocks.length;
		beats.push({
			blocks: blocks.slice(start, end),
			images: anchored.get(start) ?? []
		});
	});

	return beats;
}
