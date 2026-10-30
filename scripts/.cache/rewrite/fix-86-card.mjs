// Brothers' Coup: a narration block landed after the bold next-episode card; put the card last again.
import { editStory } from '../story-ops.mjs';
const isCard = (b) => b?.kind === 'p' && /^\s*<b>[\s\S]*<\/b>\s*$/.test(b.html ?? '');
editStory((story) => {
	const e = story.flatMap((c) => c.entries).find((x) => x.title === 'Brothers’ Coup');
	const i = e.blocks.findLastIndex(isCard);
	if (i < 0 || i === e.blocks.length - 1) return false;
	const [card] = e.blocks.splice(i, 1);
	e.blocks.push(card);
	console.log('moved card to end');
});
