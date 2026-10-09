// node scripts/.cache/widgets/card-scan.mjs → existing card blocks + speaker stats per person (reading order)
import fs from 'node:fs';
const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const walk = (blocks, fn, path = '') =>
	blocks.forEach((b, i) => {
		fn(b, path + i);
		if (b.kind === 'flashback') walk(b.blocks, fn, path + i + '.');
	});
const cards = [];
const speak = new Map(); // id -> { eps:Set, first }
let n = 0;
for (const c of story)
	for (const e of c.entries) {
		n++;
		walk(e.blocks, (b, p) => {
			if (b.kind === 'card') cards.push(`${n} ${c.id} › ${e.title} [${e.year}] #${p}: ${b.person} look=${b.look ?? ''} from=${b.from ?? ''} tab=${b.tab ?? ''} write=${b.write ?? ''} | ${b.caption ?? ''}`);
			const who = b.kind === 'dialogue' || b.kind === 'monologue' ? b.person : null;
			if (who) {
				const s = speak.get(who) ?? { eps: new Set(), first: `${n} ${c.id} › ${e.title} [${e.year}] #${p}` };
				s.eps.add(n);
				speak.set(who, s);
			}
		});
	}
console.log('== CARDS', cards.length);
cards.forEach((l) => console.log(l));
console.log('== SPEAKERS (eps, first)');
[...speak].sort((a, b) => b[1].eps.size - a[1].eps.size).forEach(([id, s]) => console.log(id, s.eps.size, s.first));
