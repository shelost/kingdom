import { loadStory, lists } from '../story-ops.mjs';
let n = 0;
for (const c of loadStory())
	for (const e of c.entries) {
		n++;
		let shown = false;
		for (const list of lists(e))
			list.forEach((b, i) => {
				const txt = JSON.stringify(b);
				if (!/gulgul|굴굴|Gulgul/i.test(txt)) return;
				if (!shown) { console.log(`\n=== #${n} ${e.title} (year ${e.year})`); shown = true; }
				if (b.kind === 'dialogue') console.log(`[${i}] ${b.person}${b.lang ? ' lang=' + b.lang : ''}`, JSON.stringify(b.lines), '|', JSON.stringify(b.en), Object.keys(b).filter(k => !['kind','person','lines','en'].includes(k)).join(','));
				else console.log(`[${i}] ${b.kind}:`, (b.html ?? txt).slice(0, 300));
			});
	}
