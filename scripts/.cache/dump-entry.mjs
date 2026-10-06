// node scripts/.cache/dump-entry.mjs "<title>" [from] [to] [width]
import fs from 'node:fs';
const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const [title, from = '0', to = '9999', width = '120'] = process.argv.slice(2);
const en = story.flatMap((c) => c.entries.map((e) => ({ ...e, ch: c.id }))).find((e) => e.title === title);
if (!en) throw new Error(`no entry ${title}`);
const strip = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const textOf = (b) =>
	strip(b.html || b.label || b.title || (b.en || []).join(' / ') || b.text || (b.blocks ? `[${b.blocks.length} blocks]` : ''));
const { blocks, images, ...meta } = en;
console.log(JSON.stringify(meta));
blocks.forEach((b, i) => {
	if (i < +from || i > +to) return;
	console.log(i, b.kind, b.person || b.speaker || '', textOf(b).slice(0, +width));
});
console.log('images:', images.map((im) => `${im.id}@${(im.at || '').slice(0, 40)}`).join(' | '));
