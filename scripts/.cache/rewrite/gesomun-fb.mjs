import { loadStory, lists } from '../story-ops.mjs';
let n = 0;
for (const c of loadStory())
	for (const e of c.entries) {
		n++;
		if (n !== 7 && n !== 99) continue;
		console.log(`=== #${n} ${e.title}`);
		for (const list of lists(e))
			list.forEach((b, i) => {
				if (b.kind === 'dialogue' && b.person === 'gesomun') console.log(i, JSON.stringify(b.lines), '|', JSON.stringify(b.en));
			});
	}
