// Context for every character card (kind: 'card'), so each intro still can stage the moment
// the character walks in: the episode, the place, the narration around the card, and their
// first lines in that episode.
//   node scripts/.cache/intro-stills/dump.mjs > scripts/.cache/intro-stills/context.txt
import fs from 'node:fs';
import { hexFor } from '../../visual-canon.mjs';
import { cardKey, eachCard } from './cards.mjs';

/** Dialogue names its speaker by `person`, or only by the speaker's colour chip. */
const spokenBy = (b, id) =>
	b.kind === 'dialogue' && (b.person === id || (!b.person && b.chip?.toLowerCase() === hexFor(id)?.toLowerCase()));

const strip = (s = '') => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

function say(b) {
	if (b.kind === 'p') return `  [p] ${strip(b.html).slice(0, 420)}`;
	if (b.kind === 'dialogue') return `  [${b.chip}] ${(b.en?.length ? b.en : b.lines).join(' / ').slice(0, 300)}`;
	if (b.kind === 'place') return `  [place ${b.place}]`;
	if (b.kind === 'scene') return `  [scene] ${b.label}`;
	if (b.kind === 'card') return `  [card ${b.person}${b.look ? `:${b.look}` : ''}] ${strip(b.caption ?? '').slice(0, 200)}`;
	if (b.kind === 'quote') return `  [quote] ${strip(b.html).slice(0, 200)}`;
	return null;
}

const out = [];
for (const c of eachCard()) {
	const { entry, blocks, index, block } = c;
	const lastPlace = [...blocks.slice(0, index)].reverse().find((b) => b.kind === 'place');
	const lastScene = [...blocks.slice(0, index)].reverse().find((b) => b.kind === 'scene');
	const around = blocks
		.slice(Math.max(0, index - 3), index + 5)
		.map((b) => (b === block ? `  >>> CARD ${say(b).trim()}` : say(b)))
		.filter(Boolean);
	const lines = blocks
		.slice(index)
		.filter((b) => spokenBy(b, block.person))
		.slice(0, 3)
		.map((b) => `    "${(b.en?.length ? b.en : b.lines).join(' / ').slice(0, 240)}"`);
	out.push(
		[
			`### ${cardKey(c)}  (${entry.title}, ${entry.year ?? ''}${c.flashback ? `, flashback ${c.flashback}` : ''})`,
			`  person=${block.person} look=${block.look ?? ''} from=${block.from ?? ''} place=${lastPlace?.place ?? ''} scene=${lastScene?.label ?? ''}`,
			...around,
			lines.length ? '  FIRST LINES:' : '  FIRST LINES: (none)',
			...lines
		].join('\n')
	);
}
fs.writeFileSync('scripts/.cache/intro-stills/context.txt', out.join('\n\n') + '\n');
console.log(`${out.length} cards → scripts/.cache/intro-stills/context.txt`);
