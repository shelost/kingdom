/**
 * Folds each battle ledger block into the map of the same battle as `numbers`,
 * tagging rows with the side they count. Idempotent. `node fold-ledgers.mjs [--dry]`
 */
import { loadStory, saveStory, lists } from './story-ops.mjs';

const FOLDS = [
	{
		entry: 'Colossal River',
		ledger: 'Counting the Sui army',
		map: (b) => b.caption?.startsWith('Nine armies over the Liao'),
		sides: { 'The whole host': 'sui', 'The nine armies that crossed the Liao': 'sui', 'Back at the Liaodong fortress': 'sui' }
	},
	{
		entry: 'Ansi',
		ledger: 'The 645 campaign, two ledgers',
		map: (b) => b.title === 'The Seventh Invasion, start to finish',
		sides: {
			'Goguryeo relief army': 'goguryeo',
			'Dead at Stallion Mountain': 'goguryeo',
			'Surrendered with the two commanders': 'goguryeo',
			'Horses taken': 'goguryeo',
			'The earth mound at Ansi': 'tang'
		}
	},
	{
		entry: 'White River',
		ledger: 'Counting the ships',
		map: (b) => b.title === 'Four banners, one river mouth',
		sides: {
			'Tang warships in line at the river mouth': 'tang',
			'Ships burned': 'yamato',
			'Yamato ships waiting at the landing': 'yamato',
			'Yamato troops sent': 'yamato',
			'Yamato fleet that took the Baekje prince home the year before': 'yamato'
		}
	},
	{
		entry: 'Maeso',
		ledger: 'Who won at Maeso',
		map: (b) => b.caption?.startsWith('Horses by sea'),
		sides: { 'Li Jinxing’s army': 'tang', 'War horses taken': 'silla', 'Battles with Tang that year': 'silla' }
	}
];

const dry = process.argv.includes('--dry');
const story = loadStory();
for (const f of FOLDS) {
	const entry = story.flatMap((c) => c.entries).find((e) => e.title === f.entry);
	if (!entry) throw new Error(`no entry ${f.entry}`);
	let ledgerAt, map;
	for (const list of lists(entry))
		list.forEach((b, i) => {
			if (b.kind === 'ledger' && b.title === f.ledger) ledgerAt = { list, i, b };
			if (b.kind === 'map' && f.map(b)) map = b;
		});
	if (!map) throw new Error(`no map in ${f.entry}`);
	if (!ledgerAt) {
		console.log(`${f.entry}: already folded (${map.numbers ? 'numbers present' : 'NO numbers'})`);
		continue;
	}
	const { kind: _kind, ...data } = ledgerAt.b;
	data.rows = data.rows.map((r) => {
		const side = f.sides[r.label];
		if (!side) console.log(`  ${f.entry}: no side for "${r.label}"`);
		const { label, ko, values, ...rest } = r;
		return side ? { label, ko, side, values, ...rest } : r;
	});
	map.numbers = data;
	ledgerAt.list.splice(ledgerAt.i, 1);
	console.log(`${f.entry}: "${f.ledger}" (block #${ledgerAt.i}) → map "${map.title ?? map.caption}" — ${data.rows.length} rows`);
}
if (!dry) saveStory(story);
console.log(dry ? '(dry run)' : 'saved');
