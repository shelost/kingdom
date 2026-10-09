#!/usr/bin/env node
/** Checks part-1.json: anchors unique per episode (same matcher as merge-quotes.mjs), hanja verbatim against cached sources. */
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.resolve(HERE, '../../..');
const story = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/lib/data/story.json'), 'utf8'));
const part = JSON.parse(fs.readFileSync(path.join(HERE, 'part-1.json'), 'utf8'));

const textOf = (b) => [b.html, b.ko, b.hanja, b.label, b.title, ...(b.lines ?? []), ...(b.en ?? [])].filter(Boolean).join(' \u0001 ');
function lists(entry) {
	const out = [entry.blocks];
	const walk = (blocks) => {
		for (const b of blocks) if (b.kind === 'flashback' && Array.isArray(b.blocks)) { out.push(b.blocks); walk(b.blocks); }
	};
	walk(entry.blocks);
	return out;
}
const find = (entry, frag, pred = () => true) => lists(entry).flatMap((l) => l.filter((b) => pred(b) && textOf(b).includes(frag)));
const anchorOk = (b) => b.kind === 'p' || b.kind === 'dialogue';

const norm = (s) => s.replace(/<ref[^>]*\/>|<ref[^>]*>.*?<\/ref>/gs, '').replace(/-\{|\}-/g, '').replace(/\([가-힣]\)/g, '').replace(/[\u200b\s]/g, '').replace(/[，。、；：「」『』！？・…“”"'〈〉{}|*（）()\[\]【】《》]/g, '');
const SRC = path.join(HERE, 'src');
const corpus = fs.readdirSync(SRC).filter((f) => f.endsWith('.txt')).map((f) => norm(fs.readFileSync(path.join(SRC, f), 'utf8'))).join('\n');
const WEB_ONLY = ['砂宅智積', '眞興太王巡狩管境', '公姓泉'];

let bad = 0;
const fail = (m) => { bad++; console.log('  ✗ ' + m); };

for (const ep of part.episodes) {
	const entry = story.find((c) => c.id === ep.chapter)?.entries.find((e) => e.title === ep.title);
	if (!entry) { fail(`${ep.chapter} › ${ep.title}: entry not found`); continue; }
	console.log(`${ep.chapter} › ${ep.title}`);
	for (const fx of ep.fix ?? []) {
		const hits = find(entry, fx.match, (b) => b.kind === 'quote');
		if (hits.length !== 1) fail(`fix match ${hits.length}× "${fx.match}"`);
	}
	for (const ad of ep.add ?? []) {
		if (ad.after.length < 20) fail(`after < 20 chars "${ad.after}"`);
		const hits = find(entry, ad.after);
		if (hits.length !== 1) fail(`after ${hits.length}× "${ad.after}"`);
		else if (!anchorOk(hits[0])) fail(`after lands on a ${hits[0].kind} block "${ad.after}"`);
		const h = ad.quote.hanja ?? '';
		const pieces = h.split(/……|…/).map(norm).filter(Boolean);
		const web = WEB_ONLY.some((w) => h.includes(w));
		for (const p of pieces) if (!web && !corpus.includes(p)) fail(`hanja not found in cache: ${p.slice(0, 30)}…`);
		if (h.length > 200) fail(`hanja ${h.length} chars`);
		for (const k of ['ko', 'html', 'source']) if (!ad.quote[k]) fail(`missing ${k}`);
	}
}
console.log(bad ? `\n${bad} problem(s)` : '\nall anchors unique, all cached hanja verbatim');
process.exit(bad ? 1 : 0);
