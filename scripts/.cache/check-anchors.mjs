// node scripts/.cache/check-anchors.mjs <baseline.json> [current=src/lib/data/story.json]
// Lists image anchors that resolved in the baseline but no longer resolve (same match rule as beats.ts).
import fs from 'node:fs';
const [basePath, curPath = 'src/lib/data/story.json'] = process.argv.slice(2);
const load = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

const textOf = (b) => {
	switch (b.kind) {
		case 'p':
		case 'cite':
		case 'moral':
		case 'monologue':
		case 'quote':
			return b.html + ' ' + (b.ko ?? '');
		case 'dialogue':
			return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
		case 'verse':
			return (b.lines ?? []).join(' ');
		case 'hanja':
			return b.chars.map((c) => c.char + c.gloss).join(' ') + ' ' + (b.after ?? '');
		case 'flashback':
			return (b.title ?? '') + ' ' + (b.year ?? '') + ' ' + b.blocks.map(textOf).join(' ');
		case 'table':
			return [...b.head, ...b.rows.flat()].join(' ');
		case 'diagram':
			return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
		case 'day':
		case 'scene':
			return [b.label, b.ko].filter(Boolean).join(' ');
		case 'formation':
			return [b.title, b.note].filter(Boolean).join(' ');
		default:
			return '';
	}
};

function resolved(story) {
	const out = new Set();
	const visit = (holder, key) => {
		for (const im of holder.images ?? []) {
			if (!im.at) continue;
			const needle = im.at.trim().toLowerCase();
			if (holder.blocks.some((b) => textOf(b).toLowerCase().includes(needle))) out.add(`${key}::${im.id}`);
		}
		for (const b of holder.blocks ?? []) if (b.kind === 'flashback') visit(b, `${key}/${b.title}`);
	};
	for (const c of story) for (const e of c.entries) visit(e, e.title);
	return out;
}

const base = resolved(load(basePath));
const cur = resolved(load(curPath));
const lost = [...base].filter((k) => !cur.has(k.replace('Li Shimin, the 2nd Huangdi', 'Emperor')));
console.log(`resolved: baseline ${base.size}, now ${cur.size}; lost ${lost.length}`);
for (const k of lost) console.log('  ', k);
