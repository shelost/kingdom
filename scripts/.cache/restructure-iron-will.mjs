// One-shot: Iron Will → Daeya (Not Even Human / Maehwa / Siege of Daeya), Yeon’s Massacre
// (Supreme Commander / Chunchu & Yeon / Euija & Yeon), Kim Yushin (Nangbi / Forty Fortresses /
// The Eastern Star); Onjo out of Jumong and Sosuno into its own side-story chapter.
// Usage: node scripts/.cache/restructure-iron-will.mjs
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const chapterOf = (id) => {
	const ch = story.find((c) => c.id === id);
	if (!ch) throw new Error(`missing chapter ${id}`);
	return ch;
};
const entryOf = (ch, title) => {
	const en = ch.entries.find((e) => e.title === title);
	if (!en) throw new Error(`${ch.id}: missing entry ${title}`);
	return en;
};
const indexOf = (blocks, test, what) => {
	const i = blocks.findIndex(test);
	if (i < 0) throw new Error(`missing block: ${what}`);
	return i;
};
const meta = (en) => Object.fromEntries(Object.entries(en).filter(([k]) => k !== 'blocks' && k !== 'images'));

/** Mirrors `textOf` in src/lib/beats.ts — what an image `at` anchor is matched against. */
function textOf(b) {
	switch (b.kind) {
		case 'dialogue':
			return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
		case 'verse':
			return (b.lines ?? []).join(' ');
		case 'flashback':
			return [b.title ?? '', b.year ?? '', ...(b.blocks ?? []).map(textOf)].join(' ');
		case 'table':
			return [...b.head, ...b.rows.flat()].join(' ');
		case 'day':
		case 'scene':
			return [b.label, b.ko].filter(Boolean).join(' ');
		default:
			return [b.html ?? '', b.ko ?? ''].join(' ');
	}
}

/** Split one entry's images across new entries by where each `at` anchor lands. */
function dealImages(source, targets, unanchored) {
	for (const t of targets) t.images = [];
	const texts = targets.map((t) => t.blocks.map(textOf).join(' ').toLowerCase());
	for (const img of source.images ?? []) {
		const needle = img.at?.trim().toLowerCase();
		let home = needle ? targets.find((_, i) => texts[i].includes(needle)) : null;
		if (!home) {
			const title =
				unanchored[img.id] ?? Object.entries(unanchored).find(([k]) => k.startsWith('/') && new RegExp(k.slice(1)).test(img.id))?.[1];
			home = targets.find((t) => t.title === title);
		}
		if (!home) {
			console.warn(`  ${img.id}: anchor not found, kept on ${targets[0].title}`);
			home = targets[0];
		}
		home.images.push(img);
	}
}

const iron = chapterOf('iron-will');

// ── Daeya ────────────────────────────────────────────────────────────────────
const daeya = entryOf(iron, 'Daeya Fortress');
const sleep = indexOf(daeya.blocks, (b) => b.kind === 'scene' && b.label === 'HE TRIES TO SLEEP', 'HE TRIES TO SLEEP');
const morning = indexOf(daeya.blocks, (b) => b.kind === 'day' && b.label === 'THE NEXT MORNING', 'THE NEXT MORNING');
const daeyaBase = meta(daeya);
const daeyaEntries = [
	{ ...daeyaBase, title: 'Not Even Human', subtitle: '흙만도 못한', blocks: daeya.blocks.slice(0, sleep) },
	{ ...daeyaBase, title: 'Maehwa', subtitle: '매화', blocks: daeya.blocks.slice(sleep, morning) },
	{ ...daeyaBase, title: 'Siege of Daeya', subtitle: '대야성', blocks: daeya.blocks.slice(morning) }
];
// Stale anchors (the art used to stack at the top of the old entry): route by slot id.
dealImages(daeya, daeyaEntries, {
	'nsfw-maehwa-goes-quiet': 'Maehwa',
	'golhwa-wink': 'Not Even Human',
	'yushin-cavern-tears': 'Not Even Human',
	'/gumil-yehwa|chunchu-revenge': 'Siege of Daeya',
	'/pumsuk|yehwa|maehwa|gumilwife': 'Maehwa'
});

// ── Yeon’s Massacre ─────────────────────────────────────────────────────────
const renames = [
	['Yeon’s Massacre', 'Supreme Commander', '대막리지'],
	['Chunchu & Gesomun', 'Chunchu & Yeon', '춘추와 연'],
	['Euija & Gesomun', 'Euija & Yeon', '의자와 연']
];
const massacreEntries = renames.map(([from, to, ko]) => ({ ...entryOf(iron, from), title: to, subtitle: ko }));

// ── Kim Yushin ──────────────────────────────────────────────────────────────
const yushin = entryOf(iron, 'Kim Yushin');
const fb = indexOf(yushin.blocks, (b) => b.kind === 'flashback' && b.title === 'Nangbi', 'Nangbi flashback');
const star = indexOf(
	yushin.blocks,
	(b) => b.kind === 'dialogue' && b.person === 'yushin' && b.en?.[0]?.startsWith('Well — is it enough now?'),
	'Eastern Star opening'
);
const yushinBase = meta(yushin);
const yushinEntries = [
	{
		year: yushin.blocks[fb].year,
		sub: 'flashback',
		flash: true,
		title: 'Nangbi',
		tone: yushinBase.tone,
		subtitle: '낭비성',
		badges: ['flag:silla', 'flag:goguryeo'],
		music: yushinBase.music,
		flashback: true,
		blocks: yushin.blocks[fb].blocks
	},
	{
		...yushinBase,
		title: 'Forty Fortresses',
		subtitle: '마흔 성',
		blocks: [...yushin.blocks.slice(0, fb), ...yushin.blocks.slice(fb + 1, star)]
	},
	{ ...yushinBase, title: 'The Eastern Star', subtitle: '동쪽 별', blocks: yushin.blocks.slice(star) }
];
dealImages(yushin, yushinEntries, { 'yushin-title': 'Forty Fortresses', 'five-heroes': 'The Eastern Star' });

iron.entries = [...daeyaEntries, ...massacreEntries, ...yushinEntries];

// ── Onjo: its own side story ────────────────────────────────────────────────
const jumong = chapterOf('jumong');
const onjo = entryOf(jumong, 'Onjo');
jumong.entries = jumong.entries.filter((e) => e !== onjo);
story.splice(story.indexOf(jumong) + 1, 0, {
	id: 'onjo',
	tone: onjo.tone,
	toneNote: 'Jumong’s first son walks in from Buyeo with half a sword, and Sosuno’s two boys go south to find a river of their own.',
	title: 'Onjo',
	hanja: '溫祚',
	korean: '온조',
	range: '18 BC',
	entries: [onjo]
});

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
for (const en of iron.entries) console.log(`${en.title}: ${en.blocks.length} blocks, ${en.images.length} images`);
