/**
 * Insert `battle` blocks into story.json after anchor blocks.
 * `node insert.mjs <plan.json>` with plan: [{ episode, battle, phase, after: { kind?, text } }].
 * `text` matches the block's English (html / en[] / title / caption); the first match after the previous
 * insertion wins, so plans read top to bottom. Re-running skips blocks already present.
 */
import fs from 'node:fs';
import { editStory, lists } from '../story-ops.mjs';

const plan = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const strip = (s = '') => s.replace(/<[^>]+>/g, '');
const english = (b) => strip([b.html, b.title, b.caption, b.label, ...(b.en ?? [])].filter(Boolean).join(' '));

editStory((story) => {
	const entries = story.flatMap((c) => c.entries);
	const cursor = new Map();
	let added = 0;
	for (const step of plan) {
		const e = entries[step.episode - 1];
		const exists = lists(e).some((l) => l.some((b) => b.kind === 'battle' && b.battle === step.battle && b.phase === step.phase));
		if (exists) continue;
		let done = false;
		for (const list of lists(e)) {
			const from = cursor.get(list) ?? 0;
			const i = list.findIndex((b, k) => k >= from && (!step.after.kind || b.kind === step.after.kind) && english(b).includes(step.after.text));
			if (i < 0) continue;
			list.splice(i + 1, 0, { kind: 'battle', battle: step.battle, phase: step.phase });
			cursor.set(list, i + 2);
			done = true;
			added++;
			break;
		}
		if (!done) console.error(`#${step.episode} ${step.battle}/${step.phase}: anchor not found: ${step.after.text}`);
	}
	console.log('inserted', added);
	return added > 0 ? undefined : false;
});
