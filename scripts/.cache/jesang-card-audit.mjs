import { readFileSync, existsSync } from 'fs';

const story = JSON.parse(readFileSync('src/lib/data/story.json', 'utf8'));
const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Park Jesang');
const slug = (s) =>
	s
		.normalize('NFKD')
		.toLowerCase()
		.replace(/['']/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

function walk(blocks, year, acc) {
	for (const b of blocks) {
		if (b.kind === 'card') {
			const key = `${b.person}${b.look ? `-${b.look}` : ''}--${slug(e.title)}`;
			acc.push({
				person: b.person,
				look: b.look,
				still: b.still,
				caption: b.caption,
				year,
				key
			});
		}
		if (b.kind === 'flashback' && b.blocks) walk(b.blocks, b.year ?? year, acc);
	}
}

const cards = [];
walk(e.blocks, e.year, cards);
for (const c of cards) {
	const p = c.still ? `static${c.still}` : `static/intro/${c.key}.jpg`;
	console.log((c.still ? 'STILL' : 'NONE'), c.key, 'file=' + (existsSync(p) ? 'yes' : 'no'), '|', c.caption);
}

console.log('\n--- first speakers ---');
const carded = new Set(cards.map((c) => c.person));
const seen = new Set();
for (const b of e.blocks) {
	if (b.kind === 'dialogue' && b.person && !seen.has(b.person)) {
		seen.add(b.person);
		console.log(carded.has(b.person) ? 'CARD' : 'NOCD', b.person, (b.en || [])[0]?.slice(0, 70));
	}
}
