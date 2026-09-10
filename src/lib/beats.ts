import type { Block, Entry, ImageSlot } from '$lib/story';

/**
 * A beat is a run of blocks plus the artwork that belongs beside it.
 *
 * Images carry an `at` fragment naming the block they should appear against.
 * Everything from that block up to the next anchor renders in the same row as
 * the art, so text and image always start level and can never overlap. Several
 * images sharing an anchor simply stack inside that row.
 *
 * `day` / `scene` plates also force a cut: TOC jumps land on the plate, so it
 * must not trail the previous scene’s stacked art (same class of bug as
 * flashback art sitting above the mini-band).
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
			return b.lines.join(' ');
		case 'hanja':
			return b.chars.map((c) => c.char + c.gloss).join(' ') + ' ' + (b.after ?? '');
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
			return [b.label, b.ko].filter(Boolean).join(' ');
		case 'formation':
			return [b.title, b.note].filter(Boolean).join(' ');
		default:
			return '';
	}
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
		const i = blocks.findIndex((b) => textOf(b).includes(im.at!));
		if (i < 0) opening.push(im); // anchor no longer present — keep the art
		else {
			const list = anchored.get(i);
			if (list) list.push(im);
			else anchored.set(i, [im]);
		}
	}

	// Day/scene plates always begin a beat so prior-scene art cannot stack above them.
	const cutSet = new Set<number>(anchored.keys());
	for (let i = 0; i < blocks.length; i++) {
		const b = blocks[i];
		if (b?.kind === 'day' || b?.kind === 'scene') cutSet.add(i);
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
