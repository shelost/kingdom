import { readFileSync } from 'node:fs';
const story = JSON.parse(readFileSync(new URL('../../src/lib/data/story.json', import.meta.url), 'utf8'));
const entry = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Muryuk');
if (!entry) throw new Error('no entry');
console.log('year', entry.year, 'thumb', entry.thumbnail, 'images', (entry.images ?? []).length, 'blocks', entry.blocks.length);
console.log('--- IMAGES ---');
for (const im of entry.images ?? []) {
	console.log([im.id, im.at ?? '', (im.alt ?? '').slice(0, 90)].join(' | '));
}
console.log('--- BLOCKS ---');
entry.blocks.forEach((b, i) => {
	if (b.kind === 'scene' || b.kind === 'day' || b.kind === 'jump') {
		console.log(i, b.kind, b.label ?? b.en ?? '', b.ko ?? '');
		return;
	}
	if (b.kind === 'dialogue') {
		const who = b.person || b.speaker || '?';
		const line = (b.en ?? b.lines ?? [])[0] ?? '';
		console.log(i, 'D', who, String(line).slice(0, 110));
		return;
	}
	if (b.kind === 'p') {
		console.log(i, 'P', String(b.html ?? '').replace(/<[^>]+>/g, '').slice(0, 140));
	}
});
