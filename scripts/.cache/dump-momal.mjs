import { readFileSync } from 'fs';

const story = JSON.parse(readFileSync('src/lib/data/story.json', 'utf8'));
const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Momal' || x.title === 'Park Jesang');
if (!e) throw new Error('not found');

function dump(blocks, indent = 0) {
	const pad = '  '.repeat(indent);
	for (const [i, b] of blocks.entries()) {
		if (b.kind === 'p') {
			console.log(`${pad}[${i}] p  ${b.html}`);
			if (b.ko) console.log(`${pad}     ko ${b.ko}`);
		} else if (b.kind === 'dialogue') {
			const who = b.person || b.speaker || '?';
			const en = (b.en || []).join(' / ');
			const ko = (b.lines || []).join(' / ');
			console.log(`${pad}[${i}] dlg ${who}: ${en}`);
			console.log(`${pad}      ko ${ko}`);
		} else if (b.kind === 'scene') {
			console.log(`${pad}[${i}] SCENE ${b.label} ${b.ko || ''} ${b.jump ? JSON.stringify(b.jump) : ''}`);
		} else if (b.kind === 'section') {
			console.log(`${pad}[${i}] SECTION ${b.label} ${b.ko || ''}`);
		} else if (b.kind === 'card') {
			console.log(`${pad}[${i}] CARD ${b.person} still=${b.still || ''} | ${b.caption}`);
		} else if (b.kind === 'place') {
			console.log(`${pad}[${i}] PLACE ${b.place} ${b.html || ''}`);
		} else if (b.kind === 'quote') {
			console.log(`${pad}[${i}] QUOTE ${(b.en || b.html || '').toString().slice(0, 80)}`);
		} else if (b.kind === 'flashback') {
			console.log(`${pad}[${i}] FLASHBACK ${b.year || ''} ${b.title || ''}`);
			dump(b.blocks || [], indent + 1);
		} else if (b.kind === 'map') {
			console.log(`${pad}[${i}] MAP ${b.place || b.id || ''}`);
		} else if (b.kind === 'day') {
			console.log(`${pad}[${i}] DAY ${b.label || b.html || ''}`);
		} else {
			console.log(`${pad}[${i}] ${b.kind} ${JSON.stringify(b).slice(0, 120)}`);
		}
	}
}

console.log('TITLE', e.title, e.subtitle, e.year, 'blocks', e.blocks.length, 'images', (e.images || []).length);
dump(e.blocks);
