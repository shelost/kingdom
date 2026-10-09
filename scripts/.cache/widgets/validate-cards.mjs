// node scripts/.cache/widgets/validate-cards.mjs → checks cards.json against story.json + people.ts
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadStory, entryOf, find, textOf } from '../story-ops.mjs';
import { loadPeople } from './load-people.mjs';

const file = path.join(ROOT, 'scripts/.cache/widgets/cards.json');
const { ops } = JSON.parse(fs.readFileSync(file, 'utf8'));
const story = loadStory();
const { byId } = await loadPeople({ ranks: false });
const errors = [];
const err = (i, op, msg) => errors.push(`#${i} ${op.title} (${op.block?.person ?? op.block?.kind}): ${msg}`);

const DIAGRAMS = new Set(
	[...fs.readFileSync(path.join(ROOT, 'src/lib/components/diagrams/registry.ts'), 'utf8').matchAll(/'([a-z0-9-]+)'\s*:/g)].map((m) => m[1])
);
const stageIds = (p) => new Set((p.stages ?? []).map((s) => s.id).filter(Boolean));

ops.forEach((op, i) => {
	const entry = entryOf(story, op.chapter, op.title);
	if (!entry) return err(i, op, `no entry ${op.chapter} › ${op.title}`);
	const frag = op.op === 'add' ? op.after : op.match;
	if (!frag || frag.length < 20) err(i, op, `fragment shorter than 20 chars: "${frag}"`);
	const hits = find(entry, frag);
	if (hits.length !== 1) err(i, op, `fragment found ${hits.length}×: "${frag}"`);
	if (op.op === 'convert' && hits[0]?.b.kind !== op.block.kind) err(i, op, `convert changes kind ${hits[0]?.b.kind} → ${op.block.kind}`);

	const b = op.block;
	if (b.kind === 'card') {
		const p = byId.get(b.person);
		if (!p) err(i, op, `unknown person "${b.person}"`);
		else
			for (const key of ['look', 'from'])
				if (b[key] && !stageIds(p).has(b[key])) err(i, op, `${key} "${b[key]}" is not a stage of ${b.person}`);
		if (b.from && !b.look) err(i, op, 'evolution without look');
	}
	if (b.kind === 'diagram' && !DIAGRAMS.has(b.diagram)) err(i, op, `unknown diagram "${b.diagram}"`);
	if ((b.kind === 'card' || b.kind === 'diagram') && !!b.caption !== !!b.ko) err(i, op, 'caption without ko (or ko without caption)');
	if (/\b(1[0-9]{3}|[2-9][0-9]{2})\b(?!\s*(?:li|men|horse))/.test(`${b.caption ?? ''}`)) err(i, op, `year-like number in caption: ${b.caption}`);

	if (op.op === 'add') {
		const text = textOf(b);
		for (const im of entry.images ?? [])
			if (im.at && text.includes(im.at)) err(i, op, `new text contains image anchor "${im.at}"`);
	}
});

// Two ops after the same anchor must not reorder unexpectedly: report the stacks.
const stacks = new Map();
for (const op of ops.filter((o) => o.op === 'add')) {
	const k = `${op.title} ⟂ ${op.after}`;
	stacks.set(k, [...(stacks.get(k) ?? []), op.block.person ?? op.block.kind]);
}
for (const [k, v] of stacks) if (v.length > 1) console.log(`stack: ${k} → ${v.join(', ')}`);

console.log(errors.length ? errors.join('\n') : `ok: ${ops.length} ops valid`);
process.exit(errors.length ? 1 : 0);
