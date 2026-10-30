import { readFileSync } from 'fs';

const title = process.argv[2];
if (!title) throw new Error('usage: dump-ep.mjs <title>');
const story = JSON.parse(readFileSync('src/lib/data/story.json', 'utf8'));
const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === title);
if (!e) throw new Error('not found: ' + title);

function dump(blocks, indent = 0) {
	const pad = '  '.repeat(indent);
	for (const [i, b] of blocks.entries()) {
		if (b.kind === 'p') {
			console.log(`${pad}[${i}] p  ${(b.html || '').replace(/<[^>]+>/g, '').slice(0, 160)}`);
		} else if (b.kind === 'dialogue') {
			const who = b.person || b.speaker || '?';
			console.log(`${pad}[${i}] dlg ${who}: ${(b.en || []).join(' / ').slice(0, 140)}`);
		} else if (b.kind === 'scene') {
			console.log(`${pad}[${i}] SCENE ${b.label} ${b.ko || ''}`);
		} else if (b.kind === 'section') {
			console.log(`${pad}[${i}] SECTION ${b.label}`);
		} else if (b.kind === 'card') {
			console.log(`${pad}[${i}] CARD ${b.person} | ${(b.caption || '').slice(0, 80)}`);
		} else if (b.kind === 'place') {
			console.log(`${pad}[${i}] PLACE ${b.place}`);
		} else if (b.kind === 'quote') {
			console.log(`${pad}[${i}] QUOTE ${(b.html || '').slice(0, 80)}`);
		} else if (b.kind === 'flashback') {
			console.log(`${pad}[${i}] FLASHBACK ${b.title || b.year || ''}`);
			dump(b.blocks || [], indent + 1);
		} else {
			console.log(`${pad}[${i}] ${b.kind}`);
		}
	}
}

console.log('TITLE', e.title, e.subtitle, 'blocks', e.blocks.length, 'images', (e.images || []).length);
dump(e.blocks);
