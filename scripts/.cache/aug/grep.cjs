// node grep.cjs "regex" [title]
const s = require('../../../src/lib/data/story.json');
const [re, only] = process.argv.slice(2);
const R = new RegExp(re, 'i');
s.forEach((c) => c.entries.forEach((e) => {
	if (only && e.title !== only) return;
	const w = (bs, p) => bs.forEach((b, i) => {
		const own = { ...b }; delete own.blocks;
		const x = JSON.stringify(own);
		if (R.test(x)) console.log(`[${e.title}] ${p}${i} ${b.kind}${b.person ? ':' + b.person : ''} ${(b.html || (b.en || b.lines || []).join(' / ') || x).replace(/<[^>]+>/g, '').slice(0, +(process.env.W || 260))}`);
		if (b.blocks) w(b.blocks, p + i + '.');
	});
	w(e.blocks, '');
}));
