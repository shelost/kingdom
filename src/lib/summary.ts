import { isPlate, type Block, type Entry } from './story';

export interface SummaryBullet {
	label: string;
	koLabel?: string;
	text: string;
	koText?: string;
}

const strip = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/** First sentence (or a short truncation) of a narration paragraph. */
const firstSentence = (text: string, max = 170): string => {
	const t = strip(text);
	if (!t) return '';
	const m = t.match(/^.*?[.!?…。！？](?=\s|$)/);
	const s = (m ? m[0] : t).trim();
	return s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s;
};

/**
 * One bullet per scene/day header: the scene label plus the opening beat
 * of its first narration paragraph. Capped so the accordion stays short.
 */
export function entryBullets(entry: Entry, max = 12): SummaryBullet[] {
	const out: SummaryBullet[] = [];
	const blocks: Block[] = entry.blocks;
	for (let i = 0; i < blocks.length && out.length < max; i++) {
		const b = blocks[i];
		if (b.kind !== 'scene' && b.kind !== 'day') continue;
		let text = '';
		let koText = '';
		for (let j = i + 1; j < blocks.length; j++) {
			const n = blocks[j];
			if (isPlate(n)) break;
			if (n.kind === 'p') {
				text = firstSentence(n.html);
				koText = n.ko ? firstSentence(n.ko) : '';
				break;
			}
			if (n.kind === 'dialogue') break;
		}
		out.push({ label: b.label, koLabel: b.ko, text, koText });
	}
	if (!out.length) {
		// No scene headers: fall back to the first narration paragraphs.
		for (const b of blocks) {
			if (out.length >= max) break;
			if (b.kind === 'p') out.push({ label: '', text: firstSentence(b.html), koText: b.ko ? firstSentence(b.ko) : '' });
		}
	}
	return out;
}
