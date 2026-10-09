// node check.cjs → validates content.json against story.json
const fs = require('fs');
const path = require('path');
const story = require('../../../src/lib/data/story.json');

const content = JSON.parse(fs.readFileSync(path.join(__dirname, 'content.json'), 'utf8'));
const FIELDS = ['html', 'ko', 'hanja'];
const LISTS = ['lines', 'en'];

const texts = (blocks) =>
	blocks.flatMap((b) => [
		...FIELDS.map((f) => b[f]).filter((v) => typeof v === 'string'),
		...LISTS.flatMap((f) => (Array.isArray(b[f]) ? b[f] : [])),
		...(Array.isArray(b.blocks) ? texts(b.blocks) : [])
	]);

const count = (hay, needle) => {
	let n = 0;
	for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + 1)) n++;
	return n;
};

let bad = 0;
const tally = {};
for (const [i, op] of content.ops.entries()) {
	tally[op.op] = (tally[op.op] || 0) + 1;
	const where = `#${i} ${op.op} ${op.chapter} › ${op.title}`;
	const entry = story.find((c) => c.id === op.chapter)?.entries.find((e) => e.title === op.title);
	if (!entry) { console.log(`✗ ${where}: entry not found`); bad++; continue; }
	if (op.title === 'Huangdi (皇帝)') { console.log(`✗ ${where}: forbidden entry`); bad++; }
	const frag = op.op === 'add' ? op.after : op.match;
	if (!frag || (op.op === 'add' && frag.length < 20)) { console.log(`✗ ${where}: fragment missing or < 20 chars`); bad++; continue; }
	const n = texts(entry.blocks).reduce((s, t) => s + count(t, frag), 0);
	if (n !== 1) { console.log(`✗ ${where}: fragment occurs ${n}× — “${frag}”`); bad++; }
	const b = op.block;
	if (b && !b.html && !b.omens && !b.rows) { console.log(`✗ ${where}: block has no html`); bad++; }
	if (b && b.html && !b.ko) { console.log(`✗ ${where}: block missing ko`); bad++; }
	if (b && b.omens) b.omens.forEach((o, k) => { if (!o.ko || !o.html || !o.hanja) { console.log(`✗ ${where}: omen ${k} incomplete`); bad++; } });
	if (op.op === 'notes') {
		const quote = texts(entry.blocks) && entry.blocks.find((x) => x.html && x.html.includes(op.match));
		const strip = (s) => s.replace(/[*†‡]/g, '');
		if (strip(op.html) !== quote.html || strip(op.ko) !== quote.ko) { console.log(`✗ ${where}: html/ko differ beyond marks`); bad++; }
		for (const nt of op.notes) if (!op.html.includes(nt.mark) || !op.ko.includes(nt.mark) || !nt.ko) { console.log(`✗ ${where}: mark ${nt.mark} not placed in both`); bad++; }
	}
	const allNotes = op.notes || b?.notes || [];
	for (const nt of allNotes) if (b && (!b.html.includes(nt.mark) || !b.ko.includes(nt.mark))) { console.log(`✗ ${where}: block note ${nt.mark} unmarked`); bad++; }
}
console.log(tally, bad ? `${bad} problem(s)` : 'all ok');
process.exit(bad ? 1 : 0);
