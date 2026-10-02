// Prints an entry's blocks with their index paths, for locating insertion points.
// Usage: node scripts/.cache/dump-entry.mjs "<entry title>" [from] [to] [width]
import fs from 'node:fs';

const [title, from = '0', to = '9999', width = '260'] = process.argv.slice(2);
const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const entry = story.flatMap((c) => c.entries ?? []).find((e) => e.title === title);
if (!entry) throw new Error(`missing entry ${title}`);

const strip = (s) => String(s ?? '').replace(/<[^>]+>/g, '');

function walk(blocks, prefix) {
	blocks.forEach((b, i) => {
		const top = prefix ? Number(prefix.split('.')[0]) : i;
		if (top < Number(from) || top > Number(to)) return;
		const path = prefix + i;
		const who = b.person ? `${b.person}${b.chip ? `(${b.chip})` : ''}` : '';
		const text =
			b.kind === 'dialogue'
				? (b.en ?? b.lines).join(' / ')
				: b.kind === 'flashback'
					? `[${b.year ?? ''} ${b.title ?? ''}]`
					: strip(b.html ?? b.label ?? '');
		console.log(`${path} ${b.kind} ${who} ${strip(text).slice(0, Number(width))}`);
		if (b.blocks) walk(b.blocks, `${path}.`);
	});
}

walk(entry.blocks, '');
console.log(`images: ${entry.images.length}, year ${entry.year}`);
