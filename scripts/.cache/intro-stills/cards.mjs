// Every character card in story.json (flashback interiors included), with a stable key per card.
import fs from 'node:fs';

export const STORY = 'src/lib/data/story.json';

export const readStory = () => JSON.parse(fs.readFileSync(STORY, 'utf8'));
export const writeStory = (story) => fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

/** The story year the card renders with: a flashback's own year, else the entry's ("553–554" → 553; myth → null). */
export function yearOf(s) {
	const m = String(s ?? '').match(/-?\d+/);
	return m ? Number(m[0]) : null;
}

const slug = (s) =>
	s
		.normalize('NFKD')
		.toLowerCase()
		.replace(/[’']/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

/** `gesomun--commander-yeon`, `sosuno-queen--jolbon`: person, pinned look, episode. */
export const cardKey = ({ block, entry }) => `${block.person}${block.look ? `-${block.look}` : ''}--${slug(entry.title)}`;

/** Static path of a card's intro still. */
export const stillPath = (key) => `/intro/${key}.jpg`;

/** Yields `{ entry, blocks, index, block, year, flashback }` for every card, in reading order. */
export function* eachCard(story = readStory()) {
	for (const chapter of story)
		for (const entry of chapter.entries) {
			const walk = function* (blocks, year, flashback) {
				for (let index = 0; index < blocks.length; index++) {
					const block = blocks[index];
					if (block.kind === 'card') yield { entry, blocks, index, block, year, flashback };
					if (block.kind === 'flashback' && block.blocks)
						yield* walk(block.blocks, yearOf(block.year) ?? year, block.year ?? block.title ?? 'flashback');
				}
			};
			yield* walk(entry.blocks ?? [], yearOf(entry.year), null);
		}
}
