#!/usr/bin/env node
/**
 * Merge research proposals (scripts/.cache/quotes/part-*.json) into src/lib/data/story.json.
 *   node scripts/.cache/merge-quotes.mjs            → dry run, prints the report
 *   node scripts/.cache/merge-quotes.mjs --write    → atomic write
 *   node scripts/.cache/merge-quotes.mjs --only part-1
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, STORY, loadStory, saveStory, personIds as loadPersonIds, find, entryOf, makeInserter, emptyEpisodes } from './story-ops.mjs';

const DIR = path.join(ROOT, 'scripts/.cache/quotes');
const WRITE = process.argv.includes('--write');
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;

const story = loadStory();
const personIds = loadPersonIds();

const QUOTE_KEYS = ['kind', 'html', 'ko', 'hanja', 'source', 'person', 'style', 'event', 'native', 'nativeLang', 'nativeLatn', 'to', 'notes'];
const STYLES = new Set(['annal', 'myth', 'stele', 'tomb', 'sutra', 'shaman', 'letter']);

const report = [];
const warn = (msg) => report.push('  ! ' + msg);

export function cleanQuote(q, where, ids = personIds, onWarn = warn) {
	const out = {};
	const src = { ...q };
	if (src.kind === 'letter') {
		src.kind = 'quote';
		src.style = 'letter';
		if (!src.person && src.from) src.person = src.from;
	}
	for (const k of QUOTE_KEYS) if (src[k] !== undefined && src[k] !== '') out[k] = src[k];
	out.kind = 'quote';
	// Letters may name a correspondent with no profile; the card prints the label.
	if (out.style === 'letter') {
		if (!ids.has(out.person ?? '') && src.fromName) out.person = src.fromName;
		if (!ids.has(out.to ?? '') && src.toName) out.to = src.toName;
	} else {
		if (out.person && !ids.has(out.person)) {
			onWarn(`${where}: unknown person "${out.person}" dropped`);
			delete out.person;
		}
		delete out.to;
	}
	if (out.style && !STYLES.has(out.style)) {
		onWarn(`${where}: unknown style "${out.style}" dropped`);
		delete out.style;
	}
	if (!out.html || !out.source) onWarn(`${where}: quote missing html/source`);
	return out;
}

function cleanBlock(b, where) {
	if (b.kind === 'quote' || b.kind === 'letter') return cleanQuote(b, where);
	if (b.person && !personIds.has(b.person)) warn(`${where}: scene block speaker "${b.person}" not in people.ts`);
	return b;
}

function run() {
	const files = fs
		.readdirSync(DIR)
		.filter((f) => /^part-\d+\.json$/.test(f) && (!only || f.startsWith(only)))
		.sort();

	let added = 0;
	let fixed = 0;
	let scenes = 0;

	for (const file of files) {
		const data = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
		report.push(`\n== ${file}`);
		for (const ep of data.episodes ?? []) {
			const entry = entryOf(story, ep.chapter, ep.title);
			const tag = `${ep.chapter} › ${ep.title}`;
			if (!entry) {
				warn(`${tag}: entry not found`);
				continue;
			}
			report.push(`${tag}`);

			for (const fx of ep.fix ?? []) {
				const hits = find(entry, fx.match, (b) => b.kind === 'quote');
				if (hits.length !== 1) {
					warn(`${tag}: fix match found ${hits.length}× — "${fx.match.slice(0, 50)}"`);
					continue;
				}
				const { list, i, b } = hits[0];
				if (fx.action === 'trim') {
					for (const k of ['hanja', 'ko', 'html']) if (fx.quote?.[k] !== undefined) b[k] = fx.quote[k];
					report.push(`  ~ trimmed: ${fx.why ?? ''}`);
				} else if (fx.action === 'remove') {
					list.splice(i, 1);
					report.push(`  - removed: ${fx.why ?? ''}`);
				} else if (fx.action === 'move') {
					list.splice(i, 1);
					const dest = find(entry, fx.after);
					if (dest.length !== 1) {
						list.splice(i, 0, b);
						warn(`${tag}: move target found ${dest.length}× — "${fx.after?.slice(0, 50)}"`);
						continue;
					}
					dest[0].list.splice(dest[0].i + 1, 0, b);
					report.push(`  > moved: ${fx.why ?? ''}`);
				}
				fixed++;
			}

			const insert = makeInserter(entry);
			const tryInsert = (after, blocks, label) => {
				const res = insert(after, blocks);
				if (res !== true) warn(`${tag}: ${label} anchor found ${res}× — "${after?.slice(0, 50)}"`);
				return res === true;
			};

			for (const sc of ep.scenes ?? []) {
				const blocks = sc.blocks.map((b, k) => cleanBlock(b, `${tag} scene#${k}`));
				if (tryInsert(sc.after, blocks, 'scene')) {
					scenes += blocks.length;
					report.push(`  + scene (${blocks.length} blocks): ${sc.why ?? ''}`);
				}
			}

			for (const ad of ep.add ?? []) {
				const q = cleanQuote(ad.quote, tag);
				if (tryInsert(ad.after, [q], 'quote')) {
					added++;
					report.push(`  + ${q.style ? `[${q.style}] ` : ''}${q.source.slice(0, 70)}${q.event ? `  ⟂${q.event}` : ''}`);
				}
			}
		}
		if (data.newPeople?.length) report.push(`  newPeople: ${data.newPeople.map((p) => p.id).join(', ')}`);
	}

	const empty = emptyEpisodes(story);
	console.log(report.join('\n'));
	console.log(`\nadded ${added} quotes, ${scenes} scene blocks, ${fixed} fixes. Episodes still without a quote: ${empty.length}`);
	if (empty.length) console.log('  ' + empty.join('\n  '));

	if (WRITE) {
		saveStory(story);
		console.log('\nwrote', path.relative(ROOT, STORY));
	} else {
		console.log('\n(dry run — pass --write to apply)');
	}
}

if (process.argv[1] === new URL(import.meta.url).pathname) run();
