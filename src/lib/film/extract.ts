/**
 * Read an episode the way the film needs it: scene by scene, every spoken line,
 * and the stills each part of the text was painted against. Narration is not
 * spoken in the film; it only places the stills.
 */
import { displayArtOf } from '$lib/cueArt';
import { isVisibleCue } from '$lib/editUi.svelte';
import { nsfwAllowed } from '$lib/nsfwUi.svelte';
import type { Block, Entry } from '$lib/story';

export type RawLine = {
	en: string;
	ko: string;
	person?: string;
	speaker?: string;
	look?: string;
	/** Index of the dialogue block in the flattened episode. */
	block: number;
};

export type RawStill = { id: string; src: string; block: number };

export type RawScene = {
	/** The scene label, or `@open` for the blocks before the first scene. */
	label: string;
	ko?: string;
	year?: number;
	/** The last `place` block inside the scene. */
	place?: string;
	/** A Kangrim's-road diagram stop inside the scene. */
	road?: string;
	memory: boolean;
	first: number;
	last: number;
	lines: RawLine[];
	stills: RawStill[];
};

type Flat = { block: Block; memory: boolean };

function flatten(blocks: Block[], memory = false, out: Flat[] = []): Flat[] {
	for (const b of blocks) {
		if (b.kind === 'flashback') flatten(b.blocks, true, out);
		else out.push({ block: b, memory });
	}
	return out;
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

/** The text a still's `at` fragment can match inside a block. */
function textOf(b: Block): string {
	switch (b.kind) {
		case 'p':
		case 'cite':
		case 'moral':
		case 'monologue':
		case 'quote':
			return `${b.html} ${b.ko ?? ''}`;
		case 'dialogue':
			return [...b.lines, ...(b.en ?? [])].join(' ');
		case 'verse':
			return b.lines.join(' ');
		case 'scene':
		case 'story':
		case 'section':
			return `${b.label} ${b.ko ?? ''}`;
		case 'map':
			return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
		case 'diagram':
			return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
		case 'place':
			return `${b.html ?? ''} ${b.ko ?? ''}`;
		default:
			return '';
	}
}

/** Where each still lands: the first block whose text holds its `at` fragment. */
function placeStills(entry: Entry, flat: Flat[]): RawStill[] {
	const texts = flat.map((f) => plain(textOf(f.block)).toLowerCase());
	const out: RawStill[] = [];
	const seen = new Set<string>();
	for (const slot of entry.images ?? []) {
		if (!isVisibleCue(slot) || !nsfwAllowed(slot)) continue;
		const at = slot.at?.trim().toLowerCase();
		if (!at) continue;
		const src = displayArtOf(slot);
		if (!src || seen.has(src)) continue;
		const block = texts.findIndex((t) => t.includes(at));
		if (block < 0) continue;
		seen.add(src);
		out.push({ id: slot.id, src, block });
	}
	return out.sort((a, b) => a.block - b.block);
}

export function extractScenes(entry: Entry): RawScene[] {
	const flat = flatten(entry.blocks);
	const stills = placeStills(entry, flat);
	const scenes: RawScene[] = [];
	let cur: RawScene = { label: '@open', memory: false, first: 0, last: -1, lines: [], stills: [] };

	const close = (end: number) => {
		cur.last = end;
		cur.stills = stills.filter((s) => s.block >= cur.first && s.block <= end);
		if (cur.lines.length || cur.stills.length || cur.road) scenes.push(cur);
	};

	flat.forEach(({ block: b, memory }, i) => {
		if (b.kind === 'scene') {
			close(i - 1);
			cur = {
				label: b.label,
				ko: b.ko,
				year: b.jump?.year ?? b.year,
				place: b.jump?.place,
				memory,
				first: i,
				last: i,
				lines: [],
				stills: []
			};
			return;
		}
		if (memory) cur.memory = true;
		if (b.kind === 'place') cur.place = b.place;
		if (b.kind === 'diagram' && b.diagram === 'kangrim-road' && b.step) cur.road = b.step;
		if (b.kind !== 'dialogue') return;
		const n = Math.max(b.lines.length, b.en?.length ?? 0);
		for (let li = 0; li < n; li++) {
			const en = (b.en?.[li] ?? '').trim();
			const ko = (b.lines[li] ?? '').trim();
			if (!en && !ko) continue;
			cur.lines.push({ en: en || ko, ko, person: b.person, speaker: b.speaker, look: b.look, block: i });
		}
	});
	close(flat.length - 1);
	return scenes;
}
