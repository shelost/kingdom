import { loadStory } from '../story-ops.mjs';
const want = process.argv.slice(2).map(Number);
const full = process.env.FULL;
let n = 0;
const strip = (s = '') => s.replace(/<[^>]+>/g, '');
const show = (b, i, pad = '') => {
	if (b.kind === 'flashback') { console.log(`${pad}[${i}] FLASHBACK ${b.year ?? ''} ${b.title ?? ''}`); b.blocks.forEach((x, j) => show(x, j, pad + '    ')); return; }
	if (b.kind === 'dialogue') console.log(`${pad}[${i}] ${b.person}${b.look ? '/' + b.look : ''}${b.speaker ? ' "' + b.speaker + '"' : ''}: ${b.en.join(' / ').slice(0, full ? 9999 : 140)}`);
	else if (b.kind === 'p') console.log(`${pad}[${i}] p: ${strip(b.html).slice(0, full ? 9999 : 140)}`);
	else console.log(`${pad}[${i}] ${b.kind}: ${JSON.stringify(b).slice(0, full ? 400 : 140)}`);
};
for (const c of loadStory())
	for (const e of c.entries) {
		n++;
		if (!want.includes(n)) continue;
		console.log(`\n===== #${n} ${e.title} (${e.year}) id=${e.id} place=${e.place}`);
		e.blocks.forEach((b, i) => show(b, i));
		if (process.env.IMG) for (const im of e.images ?? []) console.log('  IMG', im.id, '@', JSON.stringify(im.at)?.slice(0, 80), im.src || im.tempImage || '(none)');
	}
