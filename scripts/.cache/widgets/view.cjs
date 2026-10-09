// node view.cjs "<entry title>" [maxChars]
const s = require('../../../src/lib/data/story.json');
const [title, max = '220'] = process.argv.slice(2);
const n = +max;
for (const c of s)
	for (const e of c.entries) {
		if (e.title !== title) continue;
		console.log(`## ${c.id} › ${e.title} (${e.year})`);
		const walk = (bs, d) =>
			bs.forEach((b, i) => {
				const t =
					b.kind === 'dialogue'
						? `${b.person || b.speaker || b.chip}: ${(b.en || b.lines || []).join(' / ')}`
						: b.kind === 'flashback'
							? `FLASHBACK ${b.title || ''} ${b.year || ''}`
							: b.html || b.label || b.caption || (b.lines || []).join(' / ') || b.hanja || b.title || '';
				console.log(`[${d}${i}] ${b.kind}: ${String(t).replace(/\s+/g, ' ').slice(0, n)}`);
				if (b.blocks) walk(b.blocks, d + i + '.');
			});
		walk(e.blocks, '');
	}
