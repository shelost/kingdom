// node scripts/.cache/audit-voice.mjs [top=40]
// Scores every entry for textbook signals in narration and dialogue.
import fs from 'node:fs';
const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const top = +(process.argv[2] ?? 40);
const strip = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const YEAR = /\b(?:[1-9]\d{2}|AD|BC|BCE|CE)\b/g;
const REGNAL = /\(#\d+\)|\b\d+(?:st|nd|rd|th) (?:king|ruler|of)\b/gi;
const GLOSS = /\([^)]*[\u3131-\uD79D\u4E00-\u9FFF][^)]*\)/g;
const LECTURE =
	/\b(reigned|took the throne|the kingdom of|commandery|dynasty|annexed|tributary|vassal|campaign(?:s)? against|basin|province|prefecture|garrison|era name|bone rank|title of|known as|which means|that is to say|in other words|historians?|records? (?:say|state)|Samguk|chronicle(?:r|s)? (?:say|record))\b/gi;

const flat = [];
story.forEach((c, ci) =>
	c.entries.forEach((e, ei) => {
		flat.push({ ...e, ch: `${ci}:${c.title}`, ei });
	})
);

const walk = (blocks, out) => {
	for (const b of blocks ?? []) {
		if (b.blocks) walk(b.blocks, out);
		if (b.kind === 'p') out.p.push(strip(b.html));
		else if (b.kind === 'dialogue') out.d.push({ who: b.person || b.speaker || '?', lines: (b.en || []).map(strip) });
	}
	return out;
};

const rows = flat.map((e) => {
	const { p, d } = walk(e.blocks, { p: [], d: [] });
	const narr = p.join(' ');
	const dl = d.flatMap((x) => x.lines.map((l) => ({ who: x.who, l })));
	const dtext = dl.map((x) => x.l).join(' ');
	const nw = narr.split(/\s+/).filter(Boolean).length;
	const dw = dtext.split(/\s+/).filter(Boolean).length;
	const c = (re, t) => (t.match(re) || []).length;
	const longLines = dl.filter((x) => x.l.split(/\s+/).length > 35);
	const dLect = dl.filter((x) => (x.l.match(LECTURE) || []).length || (x.l.match(YEAR) || []).length);
	const score =
		(c(YEAR, narr) * 2 + c(REGNAL, narr) * 4 + c(GLOSS, narr) * 1.5 + c(LECTURE, narr) * 2) / Math.max(nw / 100, 1) +
		(dLect.length * 4 + longLines.length * 3) / Math.max(dl.length / 10, 1);
	return {
		ch: e.ch,
		title: e.title,
		year: e.year,
		nw,
		dw,
		dLines: dl.length,
		years: c(YEAR, narr),
		regnal: c(REGNAL, narr),
		gloss: c(GLOSS, narr),
		lecture: c(LECTURE, narr),
		longLines: longLines.length,
		dLect: dLect.length,
		ratio: +(dw / Math.max(nw + dw, 1)).toFixed(2),
		score: +score.toFixed(1),
		sampleLong: longLines.slice(0, 2).map((x) => `${x.who}: ${x.l.slice(0, 220)}`),
		sampleLect: dLect.slice(0, 2).map((x) => `${x.who}: ${x.l.slice(0, 220)}`)
	};
});

const total = rows.reduce(
	(a, r) => ({ nw: a.nw + r.nw, dw: a.dw + r.dw, years: a.years + r.years, regnal: a.regnal + r.regnal, gloss: a.gloss + r.gloss }),
	{ nw: 0, dw: 0, years: 0, regnal: 0, gloss: 0 }
);
console.log('TOTAL', total, 'entries', rows.length);
for (const r of [...rows].sort((a, b) => b.score - a.score).slice(0, top)) {
	const { sampleLong, sampleLect, ...m } = r;
	console.log(JSON.stringify(m));
	for (const s of [...sampleLect, ...sampleLong]) console.log('   >', s);
}
