import { loadStory } from '../story-ops.mjs';

const [lo, hi = lo] = process.argv.slice(2).map(Number);
const all = loadStory().flatMap((c) => c.entries);
const show = (blocks, pad = '') =>
	blocks.forEach((b, i) => {
		const tag = `${pad}[${i}] ${b.kind}${b.person ? ':' + b.person : ''}${b.look ? '(' + b.look + ')' : ''}`;
		if (b.kind === 'p') console.log(`${tag}\n${pad}  EN ${b.html}\n${pad}  KO ${b.ko}`);
		else if (b.kind === 'dialogue') console.log(`${tag}\n${b.en.map((l, j) => `${pad}  EN ${l}\n${pad}  KO ${b.lines[j]}`).join('\n')}`);
		else if (b.kind === 'flashback') {
			console.log(`${tag} ${JSON.stringify({ ...b, blocks: undefined })}`);
			show(b.blocks, pad + '    ');
		} else console.log(`${tag} ${JSON.stringify(b).slice(0, 600)}`);
	});
for (let n = lo; n <= hi; n++) {
	const e = all[n - 1];
	const { blocks, images, ...meta } = e;
	console.log(`\n===== #${n} ${JSON.stringify(meta).slice(0, 800)}`);
	show(blocks);
	(images ?? []).forEach((im) => console.log(`  IMG ${im.id} @ ${JSON.stringify(im.at)}`));
}
