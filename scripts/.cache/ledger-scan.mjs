import { loadStory, lists } from './story-ops.mjs';

const story = loadStory();
for (const c of story)
	for (const e of c.entries)
		for (const list of lists(e))
			list.forEach((b, i) => {
				if (b.kind !== 'ledger' && b.kind !== 'table') return;
				const near = list
					.map((x, j) => ({ x, j }))
					.filter(({ x }) => x.kind === 'map')
					.map(({ x, j }) => `${j - i > 0 ? '+' : ''}${j - i}:${x.title ?? ''}|${(x.places ?? []).join(',')}|${(x.routes ?? []).join(',')}`);
				const head = b.kind === 'ledger' ? b.title : JSON.stringify(b).slice(0, 220);
				console.log(`${c.id} › ${e.title} [${e.slug ?? ''}] #${i} ${b.kind}: ${head}\n   maps: ${near.join('  ;  ') || 'NONE'}`);
			});
