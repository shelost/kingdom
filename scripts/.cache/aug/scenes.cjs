// Apply scene headers and bridge lines from scripts/.cache/audit/scenes-*.json.
// node scripts/.cache/aug/scenes.cjs [--dry]
const path = require('path');
const { ep, log, finish } = require('./lib.cjs');

const text = (b) =>
	(b.kind === 'dialogue'
		? (b.en ?? b.lines ?? []).join(' / ')
		: b.kind === 'flashback'
			? `FLASHBACK ${b.year} ${b.title ?? ''}`
			: (b.html ?? b.label ?? JSON.stringify(b))
	)
		.replace(/<[^>]+>/g, '')
		.trim();
const norm = (s) => s.replace(/\s+/g, ' ').trim();

function find(e, snippet) {
	const s = norm(snippet);
	const hits = e.blocks.filter((b) => norm(text(b)).startsWith(s));
	const loose = hits.length ? hits : e.blocks.filter((b) => norm(text(b)).includes(s));
	return loose.length === 1 ? loose[0] : null;
}

const isHeader = (b) => b && (b.kind === 'scene' || b.kind === 'day');
const reports = [1, 2, 3, 4, 5].map((n) => require(path.resolve(__dirname, `../audit/scenes-${n}.json`)));
const skipped = [];

// Resolve every target against the untouched episode first, then splice by reference.
const plan = [];
for (const r of reports) {
	for (const h of r.headers) {
		const e = ep(h.episode);
		const b = find(e, h.before);
		if (!b) skipped.push(`header ${h.episode}: “${h.before.slice(0, 50)}”`);
		else plan.push({ e, b, where: 'before', block: { kind: 'scene', label: h.label, ko: h.ko }, tag: `scene ${h.label}` });
	}
	for (const g of r.bridges) {
		const e = ep(g.episode);
		const b = find(e, g.after);
		if (!b) skipped.push(`bridge ${g.episode}: “${g.after.slice(0, 50)}”`);
		else plan.push({ e, b, where: 'after', block: { kind: 'p', html: g.en, ko: g.ko }, tag: `bridge “${g.en.slice(0, 40)}”` });
	}
}

for (const { e, b, where, block, tag } of plan) {
	const i = e.blocks.indexOf(b);
	const at = where === 'before' ? i : i + 1;
	if (block.kind === 'scene' && (at < 2 || isHeader(e.blocks[at - 1]) || isHeader(e.blocks[at]))) {
		skipped.push(`header ${e.title}: ${block.label} (next to a header or the opener)`);
		continue;
	}
	e.blocks.splice(at, 0, block);
	log.push(`+ ${e.title} @${at}: ${tag}`);
}

if (skipped.length) console.log(`skipped:\n${skipped.join('\n')}\n`);
finish();
