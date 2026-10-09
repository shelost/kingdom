import fs from 'node:fs';
import { flat } from './invasion-lib.mjs';

const [file, from, to = from] = process.argv.slice(2);
const story = JSON.parse(fs.readFileSync(file, 'utf8'));
const all = story.flatMap((c) => c.entries);
const strip = (s) => (s ?? '').replace(/<[^>]+>/g, '');
for (let n = +from; n <= +to; n++) {
	const e = all[n - 1];
	console.log(`\n===== #${n} ${e.title} =====`);
	flat(e.blocks).forEach((b, i) => {
		const who = b.person ?? b.speaker ?? '';
		const t = b.kind === 'dialogue' ? b.en.join(' / ') : strip(b.html ?? b.caption ?? b.label ?? b.title ?? '');
		console.log(`[${i}] ${b.kind}${who ? ' ' + who : ''}: ${t}`);
	});
}
