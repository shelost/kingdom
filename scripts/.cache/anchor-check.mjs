/** Lists every images[].at that matches no block text in its entry. `node anchor-check.mjs > out.txt` */
import { loadStory, lists, textOf } from './story-ops.mjs';

const ledgerText = (l) =>
	[l.title, l.ko, ...l.rows.flatMap((r) => [r.label, r.ko, ...r.values.flatMap((v) => [v.value, v.note])])]
		.filter(Boolean)
		.join(' ');

function blockText(b) {
	if (b.kind === 'ledger') return ledgerText(b);
	if (b.kind === 'map') return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
	if (b.kind === 'table') return [...b.head, ...b.rows.flat()].join(' ');
	return textOf(b);
}

const strip = (s) => s.replace(/<[^>]+>/g, '');
const story = loadStory();
const broken = [];
for (const c of story)
	for (const e of c.entries) {
		const hay = lists(e)
			.flat()
			.map((b) => strip(blockText(b)))
			.join('\n');
		for (const im of e.images ?? []) if (im.at && !hay.includes(strip(im.at))) broken.push(`${c.id} › ${e.title} :: ${im.id} :: ${im.at}`);
	}
console.log(broken.join('\n'));
console.error(`${broken.length} unmatched anchors`);
