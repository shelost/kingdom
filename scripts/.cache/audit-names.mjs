// node scripts/.cache/audit-names.mjs [minDistinct=6]
// Ranks narration paragraphs by how many distinct proper nouns a first-time reader meets.
import fs from 'node:fs';
const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const min = +(process.argv[2] ?? 6);
const strip = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const COMMON = new Set(
	'The A An And But Or If When Then There This That These Those He She It They We You I His Her Its Their Our My Your In On At Of For From To With By As Not No Nobody Everyone Someone Somewhere One Two Three Four Five Six Seven Eight Nine Ten Every Each Once Later Now Even Still Only So Yes After Before While Where Who What Why How Which Here Majesty Lord Lady King Queen Prince Princess General Marshal Emperor Commander Father Mother Brother Sister Son Daughter Uncle Unni Elder Heaven Sun Moon Spring Summer Autumn Winter Great Old New East West North South Northern Southern Eastern Western First Second Third Last Long Twenty Thirty Forty Fifty Hundred Thousand Mr Sir Highness'.split(
		' '
	)
);

const rows = [];
let n = 0;
for (const c of story)
	for (const e of c.entries) {
		const walk = (blocks) =>
			(blocks ?? []).forEach((b, i) => {
				if (b.blocks) walk(b.blocks);
				if (b.kind !== 'p') return;
				const t = strip(b.html);
				const names = new Set();
				for (const sent of t.split(/(?<=[.!?…])\s+/)) {
					const words = sent.split(/\s+/);
					words.forEach((w, wi) => {
						const m = w.replace(/^[“"‘'(—–-]+|[”"’',.;:!?)…—–-]+$/g, '').replace(/[’']s$/, '');
						if (wi === 0 || !/^[A-Z][a-zA-Z’'-]+$/.test(m) || COMMON.has(m)) return;
						names.add(m);
					});
				}
				const glosses = (t.match(/\([^)]*[\u3131-\uD79D\u4E00-\u9FFF][^)]*\)/g) || []).length;
				const words = t.split(/\s+/).length;
				const score = names.size + glosses * 1.5;
				if (score >= min) rows.push({ n, entry: e.title, block: i, words, names: [...names], glosses, score, text: t });
			});
		walk(e.blocks);
		n++;
	}

rows.sort((a, b) => b.score - a.score);
console.log(`${rows.length} paragraphs with ≥${min} distinct proper nouns`);
const byEntry = {};
for (const r of rows) byEntry[r.entry] = (byEntry[r.entry] ?? 0) + 1;
console.log('by entry:', Object.entries(byEntry).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(', '));
fs.writeFileSync('scripts/.cache/audit-names.json', JSON.stringify(rows, null, 1));
for (const r of rows.slice(0, 25)) console.log(`\n[${r.score}] #${r.n} ${r.entry} b${r.block} (${r.words}w) ${r.names.join(', ')}\n  ${r.text.slice(0, 260)}`);
