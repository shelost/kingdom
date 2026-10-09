// node scripts/.cache/aug/dump.cjs "Title" [from] [to]
const s = require('../../../src/lib/data/story.json');
const E = {};
s.forEach((c) => c.entries.forEach((e) => (E[e.title] = e)));
const [t, a = 0, b = 9999] = process.argv.slice(2);
const e = E[t];
if (!e) { console.log('no entry', t); process.exit(1); }
console.log('=====', t, e.year, e.place, e.flash ? 'FLASH' : '');
const txt = (x) =>
	x.kind === 'dialogue' ? (x.person || x.speaker) + ': ' + (x.en || x.lines).join(' / ')
	: x.html ? x.html
	: x.kind === 'hanja' ? 'HANJA ' + x.chars.map((c) => c.char).join('')
	: x.kind === 'flashback' ? 'FLASHBACK ' + x.year + ' ' + (x.title || '') + ' [' + x.blocks.length + ']'
	: JSON.stringify(x);
e.blocks.slice(+a, +b).forEach((x, i) => {
	console.log(+a + i, x.kind, txt(x).replace(/<[^>]+>/g, '').slice(0, +(process.env.W||300)));
	if (x.kind === 'flashback') x.blocks.forEach((y, j) => console.log('   ', j, y.kind, txt(y).replace(/<[^>]+>/g, '').slice(0, +(process.env.W||220))));
});
