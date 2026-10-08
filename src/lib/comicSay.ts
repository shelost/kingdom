/**
 * Comic mode letters a short line of dialogue into the still that shows its
 * speaker: a white balloon over the picture. A still qualifies when its `at`
 * anchor falls inside a dialogue block, the speaker is in the picture, and the
 * picture is about that speaker (alone in it, or named for talking: a scream,
 * a whisper, a close-up). A slot's own `say` overrides the guess.
 */
import { chapters, type Block, type ImageSlot } from './story';
import { peopleOfSlot } from './imagePeople';

export interface Say {
	en?: string;
	ko?: string;
	person?: string;
}

/** Balloons are for short lines; a speech stays in the script. */
const MAX_CHARS = 110;
const SPEAKING =
	/scream|shout|yell|laugh|whisper|mad|cry|weep|jealous|sneer|grin|smirk|plead|beg|roar|snap|tease|taunt|ecu|close|face|speak|say|talk|order|command|curse|accus|demand|ask|answer|retort|vow|swear/i;
const NOT_A_SCENE = /map|crest|flag|chart|board/i;

type Dialogue = Extract<Block, { kind: 'dialogue' }>;

/** Plain text of a line, without markup or a leading stage direction. */
function letter(lines: string[] | undefined): string | undefined {
	const text = (lines ?? [])
		.join(' ')
		.replace(/<[^>]+>/g, '')
		.replace(/^\s*\([^)]*\)\s*/, '')
		.trim();
	return text && text.length <= MAX_CHARS ? text : undefined;
}

function guess(slot: ImageSlot, block: Dialogue): Say | undefined {
	const person = block.person;
	if (!person || NOT_A_SCENE.test(slot.id)) return undefined;
	const people = peopleOfSlot(slot.id, slot.people);
	if (!people.includes(person)) return undefined;
	if (people.length > 1 && !SPEAKING.test(`${slot.id} ${slot.alt ?? ''}`)) return undefined;
	const en = letter(block.en);
	const ko = letter(block.lines);
	return en || ko ? { en, ko, person } : undefined;
}

function dialogueText(b: Dialogue) {
	return [...(b.en ?? []), ...b.lines].join('\n');
}

/** Slot id → its balloon, read once across the whole chronicle. */
const SAYS = new Map<string, Say>();
for (const chapter of chapters) {
	for (const entry of chapter.entries) {
		const images = entry.images ?? [];
		const used = new Set<string>();
		for (const slot of images) {
			if (slot.say === false) used.add(slot.id);
			else if (slot.say) {
				SAYS.set(slot.id, slot.say);
				used.add(slot.id);
			}
		}
		const walk = (blocks: Block[]) => {
			for (const b of blocks) {
				if (b.kind === 'flashback') walk(b.blocks);
				if (b.kind !== 'dialogue') continue;
				const text = dialogueText(b);
				for (const slot of images) {
					if (!slot.at || used.has(slot.id) || !text.includes(slot.at)) continue;
					const say = guess(slot, b);
					if (!say) continue;
					SAYS.set(slot.id, say);
					used.add(slot.id);
					break;
				}
			}
		};
		walk(entry.blocks);
	}
}

export function sayOf(slotId: string): Say | undefined {
	return SAYS.get(slotId);
}

/** The shortest-fitting single spoken line of a block, skipping grunts. */
function oneLine(b: Dialogue): Say | undefined {
	if (!b.person) return undefined;
	for (let i = 0; i < b.lines.length; i++) {
		const en = letter(b.en?.[i] ? [b.en[i]] : undefined);
		const ko = letter([b.lines[i]]);
		if ((en ?? ko ?? '').length >= 12) return { en, ko, person: b.person };
	}
	return undefined;
}

function blockText(b: Block): string {
	if (b.kind === 'dialogue') return dialogueText(b);
	if (b.kind === 'p') return `${b.html}\n${b.ko ?? ''}`;
	return '';
}

function flatten(blocks: Block[]): Block[] {
	return blocks.flatMap((b) => (b.kind === 'flashback' ? flatten(b.blocks) : [b]));
}

/** Slot id → the line nearest its moment, filled on first ask. */
const NEAR = new Map<string, Say | null>();

/**
 * A line to float over a still out of context (the title wall): its balloon if
 * it has one, else the closest spoken line to its anchor in the same episode,
 * looking ahead first, else the episode's first line that fits.
 */
export function lineNear(slotId: string): Say | undefined {
	if (!NEAR.size) {
		for (const chapter of chapters) {
			for (const entry of chapter.entries) {
				const blocks = flatten(entry.blocks);
				const lines = blocks.map((b) => (b.kind === 'dialogue' ? oneLine(b) : undefined));
				const first = lines.find(Boolean);
				for (const slot of entry.images ?? []) {
					const own = SAYS.get(slot.id);
					const at = slot.at ? blocks.findIndex((b) => blockText(b).includes(slot.at!)) : -1;
					let near: Say | undefined;
					if (at >= 0) {
						for (let d = 0; d < blocks.length && !near; d++) near = lines[at + d] ?? lines[at - d];
					}
					NEAR.set(slot.id, own ?? near ?? first ?? null);
				}
			}
		}
	}
	return NEAR.get(slotId) ?? undefined;
}
