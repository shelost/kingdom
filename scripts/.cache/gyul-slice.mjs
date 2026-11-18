import { readFileSync } from 'node:fs';
const story = JSON.parse(readFileSync(new URL('../../src/lib/data/story.json', import.meta.url), 'utf8'));
const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Gyul');
console.log('images', e.images.map((i) => i.id + ' | ' + (i.at || '').slice(0, 60)).join('\n'));
console.log('---BLOCKS---');
for (const b of e.blocks) {
	if (b.kind === 'scene' || b.kind === 'day' || b.kind === 'story') console.log('\n##', b.kind, b.label || b.en || '');
	else if (b.html) console.log(b.html.replace(/<[^>]+>/g, '').slice(0, 280));
	else if (b.en) console.log((b.person || '') + ': ' + b.en.join(' / ').slice(0, 220));
}
