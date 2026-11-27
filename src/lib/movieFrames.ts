import { displayArtOf } from '$lib/cueArt';
import { MOVIE_CUTS, type MovieMove } from '$lib/movieCuts';
import type { Block, Entry } from '$lib/story';

/** One card in the full-screen cut of an episode. */
export interface MovieFrame {
	kind: 'line' | 'title' | 'map';
	en: string;
	ko: string;
	/** Still held under this card. Titles keep the previous one, dimmed. */
	src?: string;
	person?: string;
	look?: string;
	speaker?: string;
	year?: number;
	hold: number;
	/** How the camera crosses this still. */
	move?: MovieMove;
	/** A map card of the land itself, without the later kingdoms painted on. */
	relief?: boolean;
}

function plain(html: string | undefined): string {
	if (!html) return '';
	return html
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&#39;|&apos;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/\s+/g, ' ')
		.trim();
}

function holdFor(text: string): number {
	return Math.min(7, Math.max(1.7, 1.15 + text.length / 32));
}

function textOf(b: Block): string {
	switch (b.kind) {
		case 'p':
		case 'cite':
		case 'moral':
		case 'monologue':
		case 'quote':
			return `${b.html} ${b.ko ?? ''}`;
		case 'dialogue':
		case 'verse':
			return [...b.lines, ...(b.en ?? [])].join(' ');
		case 'scene':
		case 'story':
		case 'section':
			return `${b.label} ${b.ko ?? ''}`;
		case 'map':
			return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
		case 'place':
			return `${b.html ?? ''} ${b.ko ?? ''}`;
		default:
			return '';
	}
}

function flatten(blocks: Block[]): Block[] {
	const out: Block[] = [];
	for (const b of blocks) {
		if (b.kind === 'flashback') out.push(...flatten(b.blocks));
		else out.push(b);
	}
	return out;
}

function srcOf(entry: Entry, id: string): string | undefined {
	const slot = entry.images?.find((s) => s.id === id);
	return slot ? displayArtOf(slot) : undefined;
}

function artOfLine(entry: Entry, still: string | undefined): string | undefined {
	if (!still) return undefined;
	if (still.startsWith('/')) return still;
	return srcOf(entry, still);
}

/**
 * A written film when this episode has one. Otherwise the manuscript,
 * one card per line, with the still that line was written against.
 * File cards, diagrams and tables stay on the page. They are not spoken.
 */
export function movieFrames(entry: Entry): MovieFrame[] {
	const cut = MOVIE_CUTS[entry.title];
	if (cut) {
		return cut.map((line) => ({
			kind: line.kind ?? 'line',
			en: line.en,
			ko: line.ko,
			src: artOfLine(entry, line.still),
			person: line.person,
			look: line.look,
			hold: line.hold ?? holdFor(line.en || line.ko),
			move: line.move,
			relief: line.relief,
			year: line.year
		}));
	}
	return manuscriptFrames(entry);
}

function manuscriptFrames(entry: Entry): MovieFrame[] {
	const blocks = flatten(entry.blocks);
	const texts = blocks.map((b) => textOf(b).toLowerCase());
	const stillAt = new Map<number, string>();
	for (const slot of entry.images ?? []) {
		const at = slot.at?.trim().toLowerCase();
		if (!at) continue;
		const src = displayArtOf(slot);
		if (!src) continue;
		const i = texts.findIndex((t) => t.includes(at));
		if (i >= 0 && !stillAt.has(i)) stillAt.set(i, src);
	}

	const frames: MovieFrame[] = [];
	let src: string | undefined;
	for (let i = 0; i < blocks.length; i++) {
		const next = stillAt.get(i);
		if (next) src = next;
		const b = blocks[i];
		if (b.kind === 'scene' || b.kind === 'section' || b.kind === 'story') {
			const jump = b.kind === 'scene' ? b.jump : undefined;
			const en = [jump?.en, b.label].filter(Boolean).join(' ');
			const ko = [jump?.ko, b.ko].filter(Boolean).join(' ');
			if (en || ko) frames.push({ kind: 'title', en, ko, src, hold: 2.2 });
			continue;
		}
		if (b.kind === 'map') {
			const en = b.caption || b.title || 'Samhan';
			const ko = b.ko || '';
			frames.push({ kind: 'map', en, ko, year: b.year, hold: 6.5 });
			continue;
		}
		if (b.kind === 'p' || b.kind === 'quote' || b.kind === 'place' || b.kind === 'moral' || b.kind === 'monologue') {
			const en = plain(b.html);
			const ko = plain(b.ko);
			if (en || ko) frames.push({ kind: 'line', en, ko, src, hold: holdFor(en || ko) });
			continue;
		}
		if (b.kind === 'dialogue' || b.kind === 'verse') {
			const n = Math.max(b.lines.length, b.en?.length ?? 0);
			for (let li = 0; li < n; li++) {
				const en = (b.en?.[li] ?? '').trim();
				const ko = (b.lines[li] ?? '').trim();
				if (!en && !ko) continue;
				frames.push({
					kind: 'line',
					en: en || ko,
					ko,
					src,
					person: b.person,
					look: b.kind === 'dialogue' ? b.look : undefined,
					speaker: b.kind === 'dialogue' ? b.speaker : undefined,
					hold: holdFor(en || ko)
				});
			}
		}
	}
	return frames;
}
