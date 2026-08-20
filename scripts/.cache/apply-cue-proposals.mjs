/**
 * Apply cue proposal files (alts / moves / new slots) to src/lib/data/story.json
 * using targeted string surgery — only the touched slot objects change bytes;
 * the rest of the file is untouched. Validates JSON.parse after every batch.
 *
 * Usage: node scripts/.cache/apply-cue-proposals.mjs <proposal.json> [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';

const STORY = 'src/lib/data/story.json';
const proposalPath = process.argv[2];
const dry = process.argv.includes('--dry');
if (!proposalPath) {
	console.error('usage: node apply-cue-proposals.mjs <proposal.json> [--dry]');
	process.exit(1);
}

const proposal = JSON.parse(fs.readFileSync(proposalPath, 'utf8'));
let raw = fs.readFileSync(STORY, 'utf8');

/* ————— helpers ————— */

/** Bounds of the JSON object that contains `"id": "<id>"` (a slot object). */
function slotBounds(text, id) {
	const needle = `"id": ${JSON.stringify(id)}`;
	const hit = text.indexOf(needle);
	if (hit < 0) return null;
	if (text.indexOf(needle, hit + 1) >= 0) throw new Error(`id not unique in file: ${id}`);
	// scan back to the opening brace of this object
	let open = text.lastIndexOf('{', hit);
	// brace-match forward from `open`, string-aware
	let depth = 0;
	let inStr = false;
	for (let i = open; i < text.length; i++) {
		const c = text[i];
		if (inStr) {
			if (c === '\\') i++;
			else if (c === '"') inStr = false;
			continue;
		}
		if (c === '"') inStr = true;
		else if (c === '{') depth++;
		else if (c === '}') {
			depth--;
			if (depth === 0) return { start: open, end: i + 1 };
		}
	}
	throw new Error(`unbalanced braces for id ${id}`);
}

/** Leading tab indent of the line that `pos` sits on. */
function indentAt(text, pos) {
	const lineStart = text.lastIndexOf('\n', pos) + 1;
	const m = text.slice(lineStart, pos + 1).match(/^\t*/);
	return m ? m[0] : '';
}

/** Serialize an object with tab indentation, shifted to `baseIndent`. */
function serialize(obj, baseIndent) {
	return JSON.stringify(obj, null, '\t')
		.split('\n')
		.map((line, i) => (i === 0 ? line : baseIndent + line))
		.join('\n');
}

/** Rebuild a slot object with `alt` set, preserving key order (alt after tone/ratio/id). */
function withAlt(slot, alt) {
	if ('alt' in slot) return { ...slot, alt };
	const out = {};
	const anchorKey = 'tone' in slot ? 'tone' : 'ratio' in slot ? 'ratio' : 'id';
	for (const [k, v] of Object.entries(slot)) {
		out[k] = v;
		if (k === anchorKey) out.alt = alt;
	}
	return out;
}

function replaceSlot(id, mutate) {
	const b = slotBounds(raw, id);
	if (!b) throw new Error(`slot not found: ${id}`);
	const indent = indentAt(raw, b.start);
	const slot = JSON.parse(raw.slice(b.start, b.end));
	const next = mutate(slot);
	raw = raw.slice(0, b.start) + serialize(next, indent) + raw.slice(b.end);
}

function parseOk(label) {
	try {
		JSON.parse(raw);
		return true;
	} catch (e) {
		console.error(`PARSE FAILED after ${label}: ${e.message}`);
		process.exit(1);
	}
}

/* ————— validation context ————— */

const story = JSON.parse(raw);
const allIds = new Set();
for (const ch of story) for (const e of ch.entries) for (const im of e.images ?? []) allIds.add(im.id);
const staticFiles = new Set(fs.readdirSync('static'));
const tempIds = new Set(
	fs.readdirSync('static/temp').map((f) => f.replace(/\.[a-z]+$/i, ''))
);

/** beats.ts textOf replica — which blocks an `at` fragment can anchor to. */
function textOf(b) {
	switch (b.kind) {
		case 'p':
		case 'cite':
			return b.html + ' ' + (b.ko ?? '');
		case 'dialogue':
			return [...b.lines, ...(b.en ?? [])].join(' ');
		case 'verse':
			return b.lines.join(' ');
		case 'hanja':
			return b.chars.map((c) => c.char + c.gloss).join(' ') + ' ' + (b.after ?? '');
		case 'flashback':
			return (b.title ?? '') + ' ' + (b.year ?? '');
		case 'table':
			return [...b.head, ...b.rows.flat()].join(' ');
		default:
			return '';
	}
}

function findEntry(chapterId, entryTitle) {
	const ch = story.find((c) => c.id === chapterId);
	if (!ch) return null;
	const entry = ch.entries.find((e) => e.title === entryTitle);
	return entry ?? null;
}

function anchorIndex(entry, at) {
	return entry.blocks.findIndex((b) => textOf(b).includes(at));
}

/* ————— apply: alts ————— */

let altCount = 0;
for (const { id, alt } of proposal.alts ?? []) {
	if (!allIds.has(id)) {
		console.error(`SKIP alt — unknown slot id: ${id}`);
		continue;
	}
	replaceSlot(id, (slot) => withAlt(slot, alt));
	altCount++;
}
parseOk('alts');
console.log(`alts applied: ${altCount}`);

/* ————— apply: moves (new `at` anchors) ————— */

let moveCount = 0;
for (const mv of proposal.moves ?? []) {
	const entry = findEntry(mv.chapterId, mv.entryTitle);
	if (!entry) {
		console.error(`SKIP move ${mv.id} — entry not found: ${mv.chapterId} / ${mv.entryTitle}`);
		continue;
	}
	if (!(entry.images ?? []).some((im) => im.id === mv.id)) {
		console.error(`SKIP move ${mv.id} — slot not in entry ${mv.entryTitle}`);
		continue;
	}
	const idx = mv.newAt === null ? -2 : anchorIndex(entry, mv.newAt);
	if (mv.newAt !== null && idx < 0) {
		console.error(`SKIP move ${mv.id} — newAt does not match any block: ${JSON.stringify(mv.newAt)}`);
		continue;
	}
	replaceSlot(mv.id, (slot) => {
		if (mv.newAt === null) {
			const { at, ...rest } = slot;
			return rest;
		}
		if ('at' in slot) return { ...slot, at: mv.newAt };
		return { ...slot, at: mv.newAt };
	});
	moveCount++;
	console.log(`move ${mv.id} → block ${idx === -2 ? 'OPENING' : idx} — ${mv.reasoning}`);
}
parseOk('moves');
console.log(`moves applied: ${moveCount}`);

/* ————— apply: new slots ————— */

let newCount = 0;
for (const ns of proposal.newSlots ?? []) {
	const { chapterId, entryTitle, afterId, slot } = ns;
	const entry = findEntry(chapterId, entryTitle);
	if (!entry) {
		console.error(`SKIP new ${slot.id} — entry not found: ${chapterId} / ${entryTitle}`);
		continue;
	}
	if (allIds.has(slot.id) || tempIds.has(slot.id)) {
		console.error(`SKIP new ${slot.id} — id collides with existing slot or temp file`);
		continue;
	}
	if (slot.src || slot.tempImage) {
		console.error(`SKIP new ${slot.id} — must not carry src/tempImage`);
		continue;
	}
	if (slot.at) {
		const idx = anchorIndex(entry, slot.at);
		if (idx < 0) {
			console.error(`SKIP new ${slot.id} — at does not match any block: ${JSON.stringify(slot.at)}`);
			continue;
		}
	}
	for (const r of slot.refs ?? []) {
		const f = r.replace(/^\//, '');
		if (!staticFiles.has(f) && !fs.existsSync(path.join('static', f))) {
			console.error(`WARN new ${slot.id} — ref missing on disk, dropping: ${r}`);
			slot.refs = slot.refs.filter((x) => x !== r);
		}
	}
	if (slot.refs && !slot.refs.length) delete slot.refs;

	if (afterId) {
		if (!(entry.images ?? []).some((im) => im.id === afterId)) {
			console.error(`SKIP new ${slot.id} — afterId ${afterId} not in entry`);
			continue;
		}
		const b = slotBounds(raw, afterId);
		const indent = indentAt(raw, b.start);
		raw = raw.slice(0, b.end) + ',\n' + indent + serialize(slot, indent) + raw.slice(b.end);
	} else if ((entry.images ?? []).length) {
		const first = entry.images[0].id;
		const b = slotBounds(raw, first);
		const indent = indentAt(raw, b.start);
		raw = raw.slice(0, b.start) + serialize(slot, indent) + ',\n' + indent + raw.slice(b.start);
	} else {
		// entry without slots: fill its `"images": []` or add the property before `"blocks"`,
		// located via its unique title line at entry-prop indent
		const titleNeedle = `\t\t\t\t"title": ${JSON.stringify(entryTitle)}`;
		const tHit = raw.indexOf(titleNeedle);
		if (tHit < 0) {
			console.error(`SKIP new ${slot.id} — cannot locate entry title line for empty-images entry`);
			continue;
		}
		const blocksNeedle = '\t\t\t\t"blocks": [';
		const bHit = raw.indexOf(blocksNeedle, tHit);
		const imgNeedle = '"images": []';
		const iHit = raw.indexOf(imgNeedle, tHit);
		const indent = '\t\t\t\t\t';
		const arrayBody = `"images": [\n${indent}${serialize(slot, indent)}\n\t\t\t\t]`;
		if (iHit >= 0 && (bHit < 0 || iHit < bHit)) {
			raw = raw.slice(0, iHit) + arrayBody + raw.slice(iHit + imgNeedle.length);
		} else if (bHit >= 0) {
			raw = raw.slice(0, bHit) + `\t\t\t\t${arrayBody},\n` + raw.slice(bHit);
		} else {
			console.error(`SKIP new ${slot.id} — no images/blocks anchor near entry ${entryTitle}`);
			continue;
		}
	}
	allIds.add(slot.id);
	newCount++;
	console.log(`new ${slot.id} → ${chapterId} / ${entryTitle} (after ${afterId ?? 'START'})`);
}
parseOk('new slots');
console.log(`new slots applied: ${newCount}`);

if (dry) {
	console.log('(dry run — not writing)');
} else {
	fs.writeFileSync(STORY, raw);
	console.log('story.json written');
}
