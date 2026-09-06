/**
 * One-shot (re-runnable) tagger: slot id → people.ts character/god ids.
 * Writes `src/lib/data/image-people.json`. Gallery membership reads that file
 * at runtime — it does not re-guess from alt/refs on each page load.
 *
 * Signals (high → low):
 *   1. Slot id kebab/underscore tokens matching a person id
 *   2. `/ch_*.png` (and stage avatars) in `refs`, skipped when an entry
 *      copy-pastes the same refs onto most of its stills
 *   3. Character names / aliases in `alt` (who is in the picture)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const STOP_ALIASES = new Set(
	[
		'king',
		'queen',
		'lord',
		'lady',
		'prince',
		'princess',
		'general',
		'marshal',
		'the',
		'son',
		'daughter',
		'emperor',
		'empress',
		'court',
		'silla',
		'baekje',
		'goguryeo',
		'gaya',
		'tang',
		'heaven',
		'earth'
	].map((s) => s.toLowerCase())
);

function escapeRe(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parsePeople() {
	const src = readFileSync(join(root, 'src/lib/people.ts'), 'utf8');
	const start = src.indexOf('export const PEOPLE');
	const end = src.indexOf('export const CONCEPTS');
	if (start < 0 || end < 0) throw new Error('Could not slice PEOPLE from people.ts');
	const body = src.slice(start, end);

	/** @type {{ id: string, name: string, korean: string, aliases: string[], avatars: string[] }[]} */
	const people = [];
	/** @type {typeof people[0] | null} */
	let current = null;
	let aliasBuf = null;

	const flushAlias = () => {
		if (!current || aliasBuf == null) return;
		current.aliases = [...aliasBuf.matchAll(/'((?:\\'|[^'])*)'/g)].map((m) =>
			m[1].replace(/\\'/g, "'")
		);
		aliasBuf = null;
	};

	for (const line of body.split('\n')) {
		const idm = line.match(/^\t\tid: '([^']+)',?\s*$/);
		if (idm) {
			flushAlias();
			current = {
				id: idm[1],
				name: '',
				korean: '',
				aliases: [],
				avatars: []
			};
			people.push(current);
			continue;
		}
		if (!current) continue;

		if (aliasBuf != null) {
			aliasBuf += line;
			if (line.includes(']')) flushAlias();
			continue;
		}

		const av = line.match(/avatar:\s*'([^']+)'/);
		if (av) current.avatars.push(av[1]);

		const nm = line.match(/^\t\tname:\s*'((?:\\'|[^'])*)'/);
		if (nm) current.name = nm[1].replace(/\\'/g, "'");

		const ko = line.match(/^\t\tkorean:\s*'((?:\\'|[^'])*)'/);
		if (ko) current.korean = ko[1].replace(/\\'/g, "'");

		const alOne = line.match(/aliases:\s*\[([^\]]*)\]/);
		if (alOne) {
			current.aliases = [...alOne[1].matchAll(/'((?:\\'|[^'])*)'/g)].map((m) =>
				m[1].replace(/\\'/g, "'")
			);
			continue;
		}
		if (/aliases:\s*\[/.test(line) && !line.includes(']')) {
			aliasBuf = line;
		}
	}
	flushAlias();
	return people;
}

function normPath(raw) {
	const t = String(raw ?? '')
		.trim()
		.split('?')[0]
		.toLowerCase();
	if (!t) return '';
	return t.startsWith('/') ? t : `/${t}`;
}

function fileStem(path) {
	const file = path.split('/').pop() ?? '';
	return file.replace(/\.[^.]+$/, '');
}

function buildArtIndex(people) {
	/** @type {Map<string, string>} */
	const index = new Map();
	const add = (key, id) => {
		if (!key || index.has(key)) return;
		index.set(key, id);
	};
	for (const p of people) {
		add(p.id, p.id);
		add(`/ch_${p.id}.png`, p.id);
		add(`ch_${p.id}`, p.id);
		for (const raw of p.avatars) {
			const path = normPath(raw);
			if (!path) continue;
			add(path, p.id);
			const stem = fileStem(path);
			add(stem, p.id);
			add(`/${stem}`, p.id);
			if (stem.startsWith('ch_')) {
				const rest = stem.slice(3);
				add(rest, p.id);
				add(rest.replace(/_/g, '-'), p.id);
			}
		}
	}
	return index;
}

function idsForRef(index, raw) {
	const path = normPath(raw);
	if (!path) return [];
	const out = new Set();
	const hit = index.get(path);
	if (hit) out.add(hit);
	const stem = fileStem(path);
	if (stem) {
		const fromStem = index.get(stem) ?? index.get(`/${stem}`);
		if (fromStem) out.add(fromStem);
		if (stem.startsWith('ch_')) {
			const rest = stem.slice(3);
			const fromRest = index.get(rest) ?? index.get(rest.replace(/_/g, '-'));
			if (fromRest) out.add(fromRest);
		}
	}
	return [...out];
}

function aliasList(people) {
	/** @type {{ alias: string, id: string, re: RegExp }[]} */
	const rows = [];
	for (const p of people) {
		const names = [p.name, p.korean, p.id.replace(/-/g, ' '), ...p.aliases].filter(Boolean);
		for (const alias of names) {
			const t = alias.trim();
			if (t.length < 3) continue;
			if (STOP_ALIASES.has(t.toLowerCase())) continue;
			if (/^the /i.test(t) && t.length < 8) continue;
			rows.push({
				alias: t,
				id: p.id,
				re: new RegExp(`(?:^|[^\\p{L}\\p{N}])${escapeRe(t)}(?:$|[^\\p{L}\\p{N}])`, 'iu')
			});
		}
	}
	rows.sort((a, b) => b.alias.length - a.alias.length);
	return rows;
}

function tokenIds(peopleByIdLen, slotId) {
	const out = [];
	for (const p of peopleByIdLen) {
		if (p.id.length < 3) continue;
		const re = new RegExp(`(?:^|[-_])${escapeRe(p.id)}(?:[-_]|$)`, 'i');
		if (re.test(slotId)) out.push(p.id);
	}
	return out;
}

function nameIds(aliases, text) {
	if (!text?.trim()) return [];
	const out = [];
	const seen = new Set();
	for (const row of aliases) {
		if (seen.has(row.id)) continue;
		if (row.re.test(text)) {
			out.push(row.id);
			seen.add(row.id);
		}
	}
	return out;
}

function refsKey(refs) {
	return (refs ?? [])
		.filter((r) => typeof r === 'string' && r.trim())
		.map((r) => normPath(r))
		.sort()
		.join('|');
}

function boilerplateRefKeys(entry) {
	const slots = entry.images ?? [];
	if (slots.length < 3) return new Set();
	/** @type {Map<string, number>} */
	const counts = new Map();
	for (const slot of slots) {
		const key = refsKey(slot.refs);
		if (!key) continue;
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	const skip = new Set();
	for (const [key, n] of counts) {
		if (n >= Math.max(3, Math.ceil(slots.length * 0.55))) skip.add(key);
	}
	return skip;
}

const people = parsePeople();
const artIndex = buildArtIndex(people);
const aliases = aliasList(people);
const peopleByIdLen = [...people].sort((a, b) => b.id.length - a.id.length);

const story = JSON.parse(readFileSync(join(root, 'src/lib/data/story.json'), 'utf8'));

/** @type {Record<string, string[]>} */
const out = {};
let slots = 0;
let tagged = 0;

for (const ch of story) {
	for (const entry of ch.entries ?? []) {
		const skipRefs = boilerplateRefKeys(entry);
		for (const slot of entry.images ?? []) {
			if (!slot?.id) continue;
			slots += 1;
			const ids = new Set();
			for (const id of tokenIds(peopleByIdLen, slot.id)) ids.add(id);
			for (const id of nameIds(aliases, slot.alt ?? '')) ids.add(id);

			const key = refsKey(slot.refs);
			if (key && !skipRefs.has(key)) {
				for (const raw of slot.refs) {
					if (typeof raw !== 'string') continue;
					if (/\.(png|jpe?g|webp)$/i.test(raw) && !/\/ch_/i.test(raw) && !/\/people\//i.test(raw)) {
						continue;
					}
					for (const id of idsForRef(artIndex, raw)) ids.add(id);
				}
			}

			if (!ids.size) continue;
			tagged += 1;
			out[slot.id] = [...ids].sort();
		}
	}
}

const dest = join(root, 'src/lib/data/image-people.json');
writeFileSync(dest, `${JSON.stringify(out, null, '\t')}\n`);

const counts = {};
for (const ids of Object.values(out)) {
	for (const id of ids) counts[id] = (counts[id] ?? 0) + 1;
}
const top = Object.entries(counts)
	.sort((a, b) => b[1] - a[1])
	.slice(0, 20)
	.map(([id, n]) => `${id}:${n}`)
	.join(', ');

console.log(`slots=${slots} tagged=${tagged} people-with-stills=${Object.keys(counts).length}`);
console.log(`top ${top}`);
console.log(`wrote ${dest}`);
