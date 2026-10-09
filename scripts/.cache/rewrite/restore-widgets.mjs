/**
 * Puts back widget blocks the rewrite removed, from the last pre-rewrite backup.
 * `node restore-widgets.mjs [--apply] [--kinds quote,chengyu,…]`: dry run by default.
 * Each missing widget goes right after the nearest block that preceded it in the backup and still exists.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, editStory, loadStory, lists, textOf } from '../story-ops.mjs';

const BACKUP = path.join(ROOT, 'scripts/.cache/prev-stills/story.before-euija-install.json');
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const kindsArg = args[args.indexOf('--kinds') + 1];
const WIDGETS = new Set(['quote', 'edict', 'covenant', 'omens', 'oath', 'poem', 'chengyu', 'term', 'hanja', 'diagram', 'table', 'formation', 'verse']);
const kinds = args.includes('--kinds') ? new Set(kindsArg.split(',')) : WIDGETS;

const sig = (b) =>
	b.kind + '|' + (b.hanja ?? '') + '|' + (b.source ?? '') + '|' + (b.term ?? '') + '|' + (b.diagram ?? '') + (b.step ?? '') + '|' + (b.title ?? '') + '|' + JSON.stringify(b.head ?? b.chars ?? b.lines ?? '');

function plan(story) {
	const backup = JSON.parse(fs.readFileSync(BACKUP, 'utf8'));
	const now = story.flatMap((c) => c.entries.map((e) => ({ c: c.id, e })));
	const before = backup.flatMap((c) => c.entries.map((e) => ({ c: c.id, e })));
	const moves = [];
	before.forEach(({ c, e: old }, n) => {
		const cur = now.find((x) => x.c === c && x.e.title === old.e?.title) ?? now.find((x) => x.c === c && x.e.title === old.title);
		if (!cur) return;
		const have = new Set(lists(cur.e).flatMap((l) => l.map(sig)));
		const texts = new Map();
		for (const l of lists(cur.e)) l.forEach((b) => texts.set(textOf(b), { list: l, b }));
		for (const list of lists(old)) {
			list.forEach((b, i) => {
				if (!kinds.has(b.kind) || have.has(sig(b))) return;
				let anchor = null;
				for (let k = i - 1; k >= 0 && !anchor; k--) anchor = texts.get(textOf(list[k])) ?? null;
				moves.push({ n: n + 1, title: old.title, block: b, anchor });
			});
		}
	});
	return moves;
}

if (args.includes('--export')) {
	const story = loadStory();
	const chapterOf = new Map(story.flatMap((c) => c.entries.map((e) => [e, c.id])));
	const entries = story.flatMap((c) => c.entries);
	const out = plan(story).map((m) => {
		const e = entries.find((x) => x.title === m.title) ?? entries[m.n - 1];
		const after = m.anchor ? textOf(m.anchor.b).replace(/<[^>]+>/g, '').split(' \u0001 ')[0].slice(0, 120) : null;
		return { chapterId: chapterOf.get(e), entryTitle: e.title, after, block: m.block };
	});
	fs.writeFileSync(path.join(ROOT, 'src/lib/data/hidden-widgets.json'), JSON.stringify(out, null, '\t') + '\n');
	console.log('exported', out.length, 'hidden widgets');
} else if (!apply) {
	const moves = plan(loadStory());
	const by = {};
	for (const m of moves) by[m.block.kind] = (by[m.block.kind] ?? 0) + 1;
	const eps = {};
	for (const m of moves) eps[`#${m.n} ${m.title}`] = (eps[`#${m.n} ${m.title}`] ?? 0) + 1;
	console.log('missing widgets by kind:', by);
	console.log('without a surviving anchor (would go after block 0):', moves.filter((m) => !m.anchor).length);
	console.log(Object.entries(eps).map(([k, v]) => `${k}: ${v}`).join('\n'));
} else {
	editStory((story) => {
		const moves = plan(story);
		const after = new Map();
		for (const m of moves) {
			const list = m.anchor?.list ?? story.flatMap((c) => c.entries)[m.n - 1].blocks;
			const prev = after.get(m.anchor?.b) ?? m.anchor?.b;
			const at = prev ? list.indexOf(prev) + 1 : 1;
			list.splice(at, 0, m.block);
			if (m.anchor) after.set(m.anchor.b, m.block);
		}
		console.log('restored', moves.length);
	});
}
