// node scripts/.cache/widgets/first-entrance.mjs id1 id2 … → first alias mention + first spoken line, with context
import fs from 'node:fs';
import { loadPeople } from './load-people.mjs';
const { byId } = await loadPeople({ ranks: false });
const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const strip = (s) => String(s ?? '').replace(/<[^>]+>/g, '');
const txt = (b) => strip(b.html ?? b.label ?? b.title ?? b.caption ?? (b.en ?? b.lines ?? []).join(' / '));
const flat = [];
let n = 0;
for (const c of story)
	for (const e of c.entries) {
		n++;
		const walk = (blocks, pre) =>
			blocks.forEach((b, i) => {
				flat.push({ n, c: c.id, e, b, path: pre + i });
				if (b.kind === 'flashback') walk(b.blocks, pre + i + '.');
			});
		walk(e.blocks, '');
	}
const W = +(process.env.W || 160);
const show = (k, mark) => {
	const f = flat[k];
	return `   ${mark} #${f.path} ${f.b.kind}${f.b.person ? '(' + f.b.person + ')' : ''}: ${txt(f.b).slice(0, W)}`;
};
for (const id of process.argv.slice(2)) {
	const p = byId.get(id);
	const aliases = (p?.aliases ?? []).filter((a) => a.length > 2);
	const re = aliases.length ? new RegExp(`\\b(${aliases.map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`) : null;
	const mention = re ? flat.findIndex((f) => f.b.kind !== 'quote' && re.test(txt(f.b))) : -1;
	const speak = flat.findIndex((f) => f.b.person === id && (f.b.kind === 'dialogue' || f.b.kind === 'monologue'));
	console.log(`== ${id} (${p?.name}) aliases: ${aliases.slice(0, 6).join(', ')}`);
	for (const [label, k] of [['mention', mention], ['speaks', speak]]) {
		if (k < 0) continue;
		const f = flat[k];
		console.log(` ${label}: ep${f.n} ${f.c} › ${f.e.title} [${f.e.year}]`);
		for (let j = Math.max(0, k - 2); j <= Math.min(flat.length - 1, k + 1); j++) if (flat[j].e === f.e) console.log(show(j, j === k ? '>' : ' '));
	}
}
