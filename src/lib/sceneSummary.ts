import { isPlate, scenesOf, type Block } from './story';

/** One stretch of an episode the summary card speaks for: the opening, a scene, or a titled flashback. */
export interface SummarySection {
	/** `episodeId` for the opening; otherwise the scene id the reader puts on `data-scene`. */
	key: string;
	title: string;
	blocks: Block[];
}

export interface SceneSummary {
	en: string;
	ko: string;
	/** Hash of the section text the summary was written from. */
	h?: string;
}

/**
 * Split an entry into summary sections. Text after a titled flashback goes back
 * to the scene it interrupted, which is what the card shows once the memory ends.
 */
export function summarySections(blocks: Block[], episodeId: string): SummarySection[] {
	const ids = scenesOf(blocks, episodeId);
	const opening: SummarySection = { key: episodeId, title: '', blocks: [] };
	const out: SummarySection[] = [opening];
	let outer = opening;
	let n = 0;
	for (const b of blocks) {
		if (isPlate(b)) {
			outer = { key: ids[n++].id, title: b.label, blocks: [] };
			out.push(outer);
		} else if (b.kind === 'flashback' && b.title) {
			out.push({ key: ids[n++].id, title: b.title, blocks: b.blocks });
		} else {
			outer.blocks.push(b);
		}
	}
	return out.filter((s) => s.blocks.length > 0);
}

const strip = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/** Plain English script of a section, for the summarizer. `nameOf` maps a person id to a display name. */
export function sectionText(blocks: Block[], nameOf: (id: string) => string = (id) => id): string {
	const lines: string[] = [];
	for (const b of blocks) {
		if (b.kind === 'p') lines.push(strip(b.html));
		else if (b.kind === 'dialogue') {
			const who = b.speaker ?? (b.person ? nameOf(b.person) : 'Someone');
			lines.push(`${who}: ${(b.en ?? b.lines).map(strip).join(' ')}`);
		} else if (b.kind === 'quote') lines.push(`(Record, ${b.source}) ${strip(b.html)}`);
		else if (b.kind === 'verse') lines.push((b.en ?? b.lines).join(' / '));
		else if (b.kind === 'flashback') lines.push(`(Memory${b.year ? `, ${b.year}` : ''}) ${sectionText(b.blocks, nameOf)}`);
	}
	return lines.filter(Boolean).join('\n');
}
