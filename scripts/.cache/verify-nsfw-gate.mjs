/**
 * Throwaway audit for the Intimate-scenes script gate.
 *  - dialogue en/lines index parity across the whole file
 *  - images whose `at` anchor only matches nsfw blocks (would jump to entry top)
 *  - the five new stills: file on disk, `at` phrase present in the entry
 */
import fs from 'node:fs';

const chapters = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));

function textOf(b) {
	switch (b.kind) {
		case 'p':
		case 'cite':
		case 'moral':
		case 'monologue':
		case 'quote':
			return b.html + ' ' + (b.ko ?? '');
		case 'dialogue':
			return [...b.lines, ...(b.en ?? [])].join(' ');
		case 'verse':
			return b.lines.join(' ');
		case 'hanja':
			return b.chars.map((c) => c.char + c.gloss).join(' ') + ' ' + (b.after ?? '');
		case 'flashback':
			return (b.title ?? '') + ' ' + (b.year ?? '') + ' ' + b.blocks.map(textOf).join(' ');
		case 'table':
			return [...b.head, ...b.rows.flat()].join(' ');
		case 'diagram':
			return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
		case 'day':
		case 'scene':
			return [b.label, b.ko].filter(Boolean).join(' ');
		case 'formation':
			return [b.title, b.note].filter(Boolean).join(' ');
		default:
			return '';
	}
}

const parity = [];
const anchorLost = [];
const anchorMissing = [];

function walkParity(entryTitle, blocks, path) {
	blocks.forEach((b, i) => {
		if (b.kind === 'dialogue') {
			const lens = {
				lines: b.lines?.length ?? 0,
				en: b.en?.length ?? 0,
				zh: b.zh?.length ?? 0,
				zhLatn: b.zhLatn?.length ?? 0,
				ja: b.ja?.length ?? 0,
				jaLatn: b.jaLatn?.length ?? 0
			};
			const present = Object.entries(lens).filter(([, n]) => n > 0);
			const base = lens.lines;
			const bad = present.filter(([, n]) => n !== base);
			if (base && bad.length)
				parity.push({ entry: entryTitle, at: `${path}[${i}]`, chip: b.chip, lens });
		}
		if (b.kind === 'flashback') walkParity(entryTitle, b.blocks ?? [], `${path}[${i}].blocks`);
	});
}

for (const ch of chapters) {
	for (const e of ch.entries ?? []) {
		walkParity(e.title, e.blocks ?? [], 'blocks');

		const blocks = e.blocks ?? [];
		for (const im of e.images ?? []) {
			if (!im.at) continue;
			const hit = blocks.find((b) => textOf(b).includes(im.at));
			if (!hit) {
				anchorMissing.push({ entry: e.title, slot: im.id, at: im.at });
			} else if (hit.nsfw && !im.nsfw) {
				// safe-for-work art anchored to an explicit block: with the gate off the
				// anchor block is gone and this still slides to the top of the entry
				anchorLost.push({ entry: e.title, slot: im.id, at: im.at });
			}
		}
	}
}

console.log('=== dialogue line-count mismatches ===');
if (!parity.length) console.log('none');
for (const p of parity) console.log(JSON.stringify(p));

console.log('\n=== image `at` anchors that match no block ===');
if (!anchorMissing.length) console.log('none');
for (const p of anchorMissing) console.log(`${p.entry} :: ${p.slot} :: "${p.at}"`);

console.log('\n=== sfw art anchored to an nsfw block (drifts to top when gate is off) ===');
if (!anchorLost.length) console.log('none');
for (const p of anchorLost) console.log(`${p.entry} :: ${p.slot} :: "${p.at}"`);

const NEW = [
	'narim-silk-appeal',
	'golhwa-wade-close',
	'hyulle-thighs-claim',
	'seohyeon-wont-stand',
	'goddesses-stake-him'
];
console.log('\n=== five new stills ===');
for (const id of NEW) {
	let found = null;
	for (const ch of chapters)
		for (const e of ch.entries ?? [])
			for (const im of e.images ?? []) if (im.id === id) found = { e, im };
	const onDisk = fs.existsSync(`static/temp/${id}.jpg`);
	if (!found) {
		console.log(`${id}: NO SLOT IN story.json (file on disk: ${onDisk})`);
		continue;
	}
	const { e, im } = found;
	const anchorOk = im.at ? (e.blocks ?? []).some((b) => textOf(b).includes(im.at)) : 'no-at';
	console.log(
		`${id}: entry="${e.title}" disk=${onDisk} tempImage=${im.tempImage ?? '—'} nsfw=${im.nsfw ?? false} at=${JSON.stringify(im.at ?? null)} anchorMatches=${anchorOk}`
	);
}
