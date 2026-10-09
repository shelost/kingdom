/** First and last spoken/narrated line of every episode → lines.json + lines.txt. */
import fs from 'node:fs';
import { loadStory } from '../../story-ops.mjs';

const strip = (s = '') => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const say = (b) =>
	b.kind === 'p'
		? { kind: 'p', en: strip(b.html), ko: strip(b.ko), bold: /^\s*<b>[\s\S]*<\/b>\s*$/.test(b.html ?? '') }
		: b.kind === 'dialogue'
			? { kind: 'dialogue', who: b.person || b.speaker, en: strip((b.en ?? []).join(' / ')), ko: strip((b.lines ?? []).join(' / ')) }
			: b.kind === 'quote'
				? { kind: 'quote', en: strip(b.en ?? b.html), ko: strip(b.ko) }
				: null;

const out = [];
let n = 0;
for (const c of loadStory())
	for (const e of c.entries) {
		n++;
		const said = e.blocks.map(say).filter(Boolean);
		const first = said[0];
		const last = said.at(-1);
		const words = last ? last.en.split(/\s+/).filter(Boolean).length : 0;
		out.push({ n, chapter: c.id, title: e.title, year: e.year, first, last, lastWords: words });
	}

const here = new URL('.', import.meta.url).pathname;
fs.writeFileSync(here + 'lines.json', JSON.stringify(out, null, 1));
fs.writeFileSync(
	here + 'lines.txt',
	out
		.map(
			(r) =>
				`#${r.n} ${r.title} (${r.year})\n  FIRST [${r.first?.kind}${r.first?.who ? ':' + r.first.who : ''}] ${r.first?.en}\n  LAST  [${r.last?.kind}${r.last?.bold ? ' BOLD' : ''} ${r.lastWords}w] ${r.last?.en}`
		)
		.join('\n')
);
console.log(out.length, 'episodes; bold cards', out.filter((r) => r.last?.bold).length);
