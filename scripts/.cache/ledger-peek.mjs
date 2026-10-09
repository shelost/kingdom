import { loadStory, lists, textOf } from './story-ops.mjs';

const want = process.argv.slice(2);
const story = loadStory();
for (const c of story)
	for (const e of c.entries) {
		if (!want.includes(e.title)) continue;
		console.log(`\n=== ${c.id} › ${e.title}`);
		for (const list of lists(e))
			list.forEach((b, i) => {
				if (b.kind === 'ledger' || b.kind === 'map' || (b.kind === 'table' && e.title === 'Yodong')) console.log(`#${i}`, JSON.stringify(b, null, 1));
				else console.log(`#${i} ${b.kind}: ${textOf(b).slice(0, 90).replace(/\n/g, ' ')}`);
			});
		console.log('images:', JSON.stringify((e.images ?? []).map((im) => im.at)));
	}
