// Shared helpers for one-off story.json passes: find blocks by text, edit them,
// and report any still whose `at` anchor lost its text. Run a pass with `--dry` first.
const fs = require('fs');
const path = require('path');
const FILE = path.resolve(__dirname, '../../../src/lib/data/story.json');
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const entries = story.flatMap((c) => c.entries);
const ep = (title) => {
	const e = entries.find((x) => x.title === title);
	if (!e) throw new Error(`no episode ${title}`);
	return e;
};
const plain = (b) =>
	[b.html, b.ko, ...(b.en ?? []), ...(b.lines ?? []), b.caption, b.note, b.label]
		.filter(Boolean)
		.join(' ')
		.replace(/<[^>]+>/g, '');
/** Index of the first top-level block whose text matches `re` (or that `re(b)` accepts). */
function at(title, re, kind) {
	const e = ep(title);
	const i = e.blocks.findIndex((b) => (!kind || b.kind === kind) && (typeof re === 'function' ? re(b) : re.test(plain(b))));
	if (i < 0) throw new Error(`[${title}] nothing matches ${re}`);
	return i;
}
const log = [];
function insertAfter(title, re, blocks, kind) {
	const i = at(title, re, kind);
	ep(title).blocks.splice(i + 1, 0, ...blocks);
	log.push(`+ ${title} after ${i}: ${blocks.map((b) => b.kind).join(', ')}`);
}
function insertBefore(title, re, blocks, kind) {
	const i = at(title, re, kind);
	ep(title).blocks.splice(i, 0, ...blocks);
	log.push(`+ ${title} before ${i}: ${blocks.map((b) => b.kind).join(', ')}`);
}
function remove(title, re, kind) {
	const i = at(title, re, kind);
	const [b] = ep(title).blocks.splice(i, 1);
	log.push(`- ${title} ${i}: ${b.kind} ${plain(b).slice(0, 60)}`);
	return b;
}
function replace(title, re, block, kind) {
	const i = at(title, re, kind);
	const old = ep(title).blocks[i];
	ep(title).blocks[i] = block;
	log.push(`~ ${title} ${i}: ${old.kind} → ${block.kind}`);
	return old;
}
const isQuote = (re) => (b) => b.kind === 'quote' && re.test(plain(b));
const isDiagram = (id, step) => (b) => b.kind === 'diagram' && b.diagram === id && (!step || b.step === step);
const isHanja = (chars) => (b) => b.kind === 'hanja' && b.chars.map((c) => c.char).join('') === chars;

// Image anchors before any edit, so we can report the ones that lose their text.
const anchorText = (e) => {
	const out = [];
	const walk = (bs) => bs.forEach((b) => { out.push(plain(b)); if (b.blocks) walk(b.blocks); });
	walk(e.blocks);
	return out.join('\n');
};
const lostBefore = new Set();
for (const e of entries) {
	const text = anchorText(e);
	for (const img of e.images ?? []) if (img.at && !text.includes(img.at)) lostBefore.add(`${e.title}:${img.id}`);
}


const dry = process.argv.includes('--dry');

/** Print the log, report anchors that lost their text, and write unless `--dry`. */
function finish() {
	console.log(log.join('\n'));
	console.log(`\n${log.length} edits`);
	const lost = [];
	for (const e of entries) {
		const text = anchorText(e);
		for (const img of e.images ?? [])
			if (img.at && !text.includes(img.at) && !lostBefore.has(`${e.title}:${img.id}`)) lost.push(`${e.title}: ${img.id} at “${img.at}”`);
	}
	console.log(lost.length ? `\nimage anchors without text:\n${lost.join('\n')}` : '\nall image anchors still find their text');
	if (!dry) fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
}

module.exports = { story, entries, ep, plain, at, log, insertAfter, insertBefore, remove, replace, isQuote, isDiagram, isHanja, finish };
