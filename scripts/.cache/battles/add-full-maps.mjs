/**
 * One full, playable map per battle at the end of the last episode it appears in, just before the
 * bold next-episode card. In-script battle blocks stay as single-phase scenes. Re-running is a no-op.
 */
import { editStory, lists } from '../story-ops.mjs';

editStory((story) => {
	const entries = story.flatMap((c) => c.entries);
	const last = new Map();
	entries.forEach((e, n) => {
		for (const list of lists(e)) for (const b of list) if (b.kind === 'battle' && !b.full) last.set(b.battle, n);
	});
	let added = 0;
	for (const [battle, n] of last) {
		const e = entries[n];
		if (e.blocks.some((b) => b.kind === 'battle' && b.full && b.battle === battle)) continue;
		const card = e.blocks.length - 1;
		const closing = /^\s*<b>[\s\S]*<\/b>\s*$/.test(e.blocks[card]?.html ?? '');
		e.blocks.splice(closing ? card : e.blocks.length, 0, { kind: 'battle', battle, full: true });
		added++;
		console.log(`#${n + 1} ${e.title}: full ${battle}`);
	}
	console.log('added', added);
	return added ? undefined : false;
});
