/**
 * Rewrite one block of the script from a highlighted passage and a note.
 * The reader sends what was selected plus the text around it; `locateBlock`
 * finds that block in a fresh story.json, and the prompt below asks the model
 * for a replacement block of the same kind.
 */
import type { Block, Chapter } from '$lib/story';

/** Where a block sits: `[i]` at the top of the entry, `[i, j]` inside a flashback. */
export type BlockPath = [number] | [number, number];

const squash = (s: string) =>
	s
		.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.toLowerCase();

/** Every readable string on a block, English and Korean, as one line. */
export function blockText(b: Block): string {
	const v = b as Partial<Record<'html' | 'ko' | 'label' | 'caption', string>> & {
		en?: string[];
		lines?: string[];
	};
	return squash([v.html, v.ko, v.label, v.caption, ...(v.en ?? []), ...(v.lines ?? [])].filter(Boolean).join(' '));
}

/**
 * The block holding `selection`; `context` (the selected element's whole text)
 * breaks ties when the same words appear twice.
 */
export function locateBlock(blocks: Block[], selection: string, context = ''): BlockPath | null {
	const sel = squash(selection);
	const ctx = squash(context);
	if (!sel) return null;
	const hits: { path: BlockPath; text: string }[] = [];
	blocks.forEach((b, i) => {
		if (b.kind === 'flashback') {
			b.blocks.forEach((inner, j) => {
				const text = blockText(inner);
				if (text.includes(sel)) hits.push({ path: [i, j], text });
			});
			return;
		}
		const text = blockText(b);
		if (text.includes(sel)) hits.push({ path: [i], text });
	});
	if (hits.length <= 1) return hits[0]?.path ?? null;
	return (hits.find((h) => ctx && (h.text.includes(ctx) || ctx.includes(h.text))) ?? hits[0]).path;
}

export function blockAt(blocks: Block[], path: BlockPath): Block | undefined {
	const top = blocks[path[0]];
	if (path.length === 1) return top;
	return top?.kind === 'flashback' ? top.blocks[path[1]] : undefined;
}

export function setBlockAt(blocks: Block[], path: BlockPath, next: Block): boolean {
	if (path.length === 1) {
		if (!blocks[path[0]]) return false;
		blocks[path[0]] = next;
		return true;
	}
	const top = blocks[path[0]];
	if (top?.kind !== 'flashback' || !top.blocks[path[1]]) return false;
	top.blocks[path[1]] = next;
	return true;
}

export function findEntry(story: Chapter[], episodeId: string, idOf: (chapterId: string, title: string) => string) {
	for (const chapter of story)
		for (const entry of chapter.entries) if (idOf(chapter.id, entry.title) === episodeId) return entry;
	return undefined;
}

/** The house voice, short enough to send with every rewrite. */
export const REWRITE_SYSTEM = `You revise one block of "King for All", a bilingual (English + Korean) novel-script set in 7th-century Korea.

Voice:
- Narration is a warm, sly, omniscient storyteller in the manner of J. K. Rowling: plain short sentences, one surprising word or aside per paragraph, wit inside the sentence. Describe the story; never explain it, never decode a beat, never lecture. No textbook facts, glosses, office strings or AD years.
- Dialogue is what people actually say aloud to each other: interruptions, fragments, questions that get answers, subtext left unsaid. Never exposition, never a caption of the camera. Each speaker sounds like their own voice note, not like the narrator and not like each other.
- Korean is natural spoken Korean in the speaker's register (존댓말/반말 as the voice note says), never a calque of the English. Narration Korean is plain -다 register.

Rules:
- Return the SAME block kind with the same fields. Dialogue: "en" and "lines" arrays of equal length, index-for-index translations. Narration ("p"): "html" (English, inline <b>/<i> allowed) and "ko".
- Keep every other field (person, speaker, chip, etc.) exactly as given.
- If the block contains the protected phrase, keep that exact English phrase somewhere in the new English text.
- Change only what the note asks for; keep the beat, the facts and the length roughly the same unless told otherwise.

Reply with JSON only: {"block": { ...the full replacement block... }}`;

export function rewriteUserPrompt(opts: {
	block: Block;
	selection: string;
	note: string;
	voice?: string;
	speakerName?: string;
	protectedPhrase?: string;
}): string {
	return [
		`Block:\n${JSON.stringify(opts.block, null, 2)}`,
		`Highlighted passage: "${opts.selection}"`,
		opts.speakerName ? `Speaker: ${opts.speakerName}${opts.voice ? `\nVoice note: ${opts.voice}` : ''}` : '',
		opts.protectedPhrase ? `Protected phrase (an image is anchored to it): "${opts.protectedPhrase}"` : '',
		`Note from the author: ${opts.note || 'Make it read more naturally.'}`
	]
		.filter(Boolean)
		.join('\n\n');
}
