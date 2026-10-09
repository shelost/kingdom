#!/usr/bin/env node
/**
 * Merge widget proposals (scripts/.cache/widgets/*.json) into src/lib/data/story.json.
 *   node scripts/.cache/merge-widgets.mjs                 → dry run over every proposal file
 *   node scripts/.cache/merge-widgets.mjs --only maps     → one file (maps|content|places|huangdi)
 *   node scripts/.cache/merge-widgets.mjs --write         → atomic write
 *
 * Op files ({ ops: [...] }): add · convert · notes · update-map · add-map.
 * Entry files ({ chapter, title, blocks, images, newImages?, removedImages? }) replace one entry.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, STORY, loadStory, saveStory, personIds as loadPersonIds, find, lists, textOf, entryOf, makeInserter } from './story-ops.mjs';
import { cleanQuote } from './merge-quotes.mjs';

const DIR = path.join(ROOT, 'scripts/.cache/widgets');
const WRITE = process.argv.includes('--write');
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;

const story = loadStory();
const personIds = loadPersonIds();
const report = [];
const warn = (msg) => report.push('  ! ' + msg);
const counts = {};
const bump = (k) => (counts[k] = (counts[k] ?? 0) + 1);

function clean(block, where) {
	if (block.kind === 'quote' || block.kind === 'letter') return cleanQuote(block, where, personIds, warn);
	for (const id of [block.person, ...(block.parties ?? [])].filter(Boolean))
		if (!personIds.has(id)) warn(`${where}: "${id}" not in people.ts`);
	if (block.kind === 'dialogue' && block.lines?.length !== block.en?.length) warn(`${where}: dialogue lines/en length mismatch`);
	return block;
}

const mapKey = (b) => [b.title, (b.places ?? []).join(',')].filter(Boolean).join(' \u0001 ');

function applyOp(op, entry, insert, tag) {
	const where = `${tag} ${op.op}`;
	switch (op.op) {
		case 'add':
		case 'add-map': {
			const res = insert(op.after, [clean(op.block, where)]);
			if (res !== true) return warn(`${where}: anchor found ${res}× — "${op.after?.slice(0, 50)}"`);
			report.push(`  + ${op.block.kind}: ${op.why ?? op.block.title ?? ''}`);
			return bump(op.op === 'add' ? `add ${op.block.kind}` : 'add-map');
		}
		case 'convert': {
			const hits = find(entry, op.match);
			if (hits.length !== 1) return warn(`${where}: match found ${hits.length}× — "${op.match?.slice(0, 50)}"`);
			const { list, i } = hits[0];
			list[i] = clean(op.block, where);
			report.push(`  ~ ${hits[0].b.kind} → ${op.block.kind}: ${op.why ?? ''}`);
			return bump(`convert → ${op.block.kind}`);
		}
		case 'notes': {
			const hits = find(entry, op.match, (b) => b.kind === 'quote');
			if (hits.length !== 1) return warn(`${where}: quote found ${hits.length}× — "${op.match?.slice(0, 50)}"`);
			const q = hits[0].b;
			// Footnote marks may only be added: the quoted words themselves never change.
			const strip = (s) => (s ?? '').replace(/<sup[^>]*>.*?<\/sup>|[*†‡§¹²³⁴⁵⁶⁷⁸⁹⁰]/g, '');
			for (const k of ['html', 'ko']) {
				if (op[k] === undefined) continue;
				if (strip(op[k]) !== strip(q[k])) {
					warn(`${where}: ${k} changes more than footnote marks — kept original`);
					continue;
				}
				q[k] = op[k];
			}
			q.notes = op.notes;
			report.push(`  * notes ×${op.notes?.length ?? 0}: ${op.why ?? ''}`);
			return bump('notes');
		}
		case 'update-map': {
			const hits = lists(entry)
				.flat()
				.filter((b) => b.kind === 'map' && mapKey(b).includes(op.match));
			if (hits.length !== 1) return warn(`${where}: map found ${hits.length}× — "${op.match?.slice(0, 50)}"`);
			Object.assign(hits[0], op.set);
			report.push(`  ~ map: ${Object.keys(op.set).join(', ')}`);
			return bump('update-map');
		}
		default:
			warn(`${where}: unknown op`);
	}
}

/** Anchors an image's `at` must hit in exactly one block. */
function imageAnchors(entry) {
	const all = lists(entry).flat();
	return (entry.images ?? []).filter((img) => img.at && all.filter((b) => textOf(b).includes(img.at)).length !== 1).map((img) => img.id);
}

function replaceEntry(data, file) {
	const entry = entryOf(story, data.chapter, data.title);
	const tag = `${data.chapter} › ${data.title}`;
	if (!entry) return warn(`${tag}: entry not found`);
	entry.blocks = data.blocks.map((b, k) => clean(b, `${tag} block#${k}`));
	const removed = new Set(data.removedImages ?? []);
	entry.images = [...(data.images ?? []), ...(data.newImages ?? [])].filter((img) => !removed.has(img.id));
	const loose = imageAnchors(entry);
	if (loose.length) warn(`${tag}: image anchors not unique/missing: ${loose.join(', ')}`);
	report.push(`  = replaced: ${entry.blocks.length} blocks, ${entry.images.length} images (${data.newImages?.length ?? 0} new, ${removed.size} removed)`);
	bump(`replace ${file}`);
}

function run() {
	const files = fs
		.readdirSync(DIR)
		.filter((f) => f.endsWith('.json') && (!only || f.startsWith(only)))
		.sort();
	for (const file of files) {
		const data = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
		report.push(`\n== ${file}`);
		if (Array.isArray(data.blocks)) {
			replaceEntry(data, file);
			continue;
		}
		const inserters = new Map();
		const before = new Map();
		for (const op of data.ops ?? []) {
			const entry = entryOf(story, op.chapter, op.title);
			const tag = `${op.chapter} › ${op.title}`;
			if (!entry) {
				warn(`${tag}: entry not found`);
				continue;
			}
			if (!inserters.has(entry)) {
				inserters.set(entry, makeInserter(entry));
				before.set(entry, new Set(imageAnchors(entry)));
			}
			applyOp(op, entry, inserters.get(entry), tag);
		}
		for (const entry of inserters.keys()) {
			const broken = imageAnchors(entry).filter((id) => !before.get(entry).has(id));
			if (broken.length) warn(`${entry.title}: new blocks broke image anchors: ${broken.join(', ')}`);
		}
	}

	console.log(report.join('\n'));
	console.log('\n' + Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join('\n'));
	if (WRITE) {
		saveStory(story);
		console.log('\nwrote', path.relative(ROOT, STORY));
	} else console.log('\n(dry run — pass --write to apply)');
}

run();
