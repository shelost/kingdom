// node scripts/.cache/widgets/anchor.mjs "<title>" [index|fragment ...]
// Prints an entry's blocks (index, kind, text head) or checks fragments for uniqueness.
import { loadStory, lists, textOf, find } from '../story-ops.mjs';
const [title, ...args] = process.argv.slice(2);
const story = loadStory();
const hits = story.flatMap((c) => c.entries.filter((e) => e.title === title).map((e) => ({ c, e })));
if (hits.length !== 1) {
	console.log(`title "${title}" found ${hits.length}×`);
	if (!title) for (const c of story) console.log(c.id, '::', c.entries.map((e) => e.title).join(' | '));
	process.exit(0);
}
const { c, e } = hits[0];
const images = (e.images ?? []).map((im) => im.at).filter(Boolean);
console.log(`${c.id} › ${e.title}  (images at: ${images.map((a) => JSON.stringify(a)).join(', ')})`);
const show = (b, tag) => console.log(`${tag} [${b.kind}${b.person ? ':' + b.person : ''}] ${textOf(b).replace(/\s+/g, ' ').slice(0, 220)}`);
if (!args.length) {
	e.blocks.forEach((b, i) => {
		show(b, `#${i}`);
		if (b.kind === 'flashback') b.blocks.forEach((x, j) => show(x, `  #${i}.${j}`));
	});
}
for (const a of args) {
	if (/^\d+(\.\d+)?$/.test(a)) {
		const [i, j] = a.split('.').map(Number);
		const b = j == null ? e.blocks[i] : e.blocks[i].blocks[j];
		show(b, `#${a}`);
	} else {
		const h = find(e, a);
		console.log(`${h.length}× "${a}"`);
		h.forEach((x) => show(x.b, '   '));
	}
}
