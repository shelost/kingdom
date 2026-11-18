import { readFileSync } from 'node:fs';
const story = JSON.parse(readFileSync(new URL('../../src/lib/data/story.json', import.meta.url), 'utf8'));
const entry = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Muryuk');
const from = Number(process.argv[2] ?? 57);
const to = Number(process.argv[3] ?? 116);
for (let i = from; i <= to && i < entry.blocks.length; i++) {
	const b = entry.blocks[i];
	if (b.kind === 'dialogue') {
		console.log('\n#' + i, 'D', b.person || b.speaker);
		(b.en ?? []).forEach((l, n) => console.log('  EN', l));
		(b.lines ?? []).forEach((l) => console.log('  KO', l));
	} else if (b.kind === 'p') {
		console.log('\n#' + i, 'P');
		console.log('  EN', (b.html ?? '').replace(/<[^>]+>/g, ''));
		console.log('  KO', (b.ko ?? '').replace(/<[^>]+>/g, ''));
	} else {
		console.log('\n#' + i, b.kind, b.label ?? '', b.ko ?? '');
	}
}
