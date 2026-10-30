// Builds the manifest for every episode's missing opening and closing stills: the opening line, and the
// final scene (the last story block before the next-episode card), each with its cast and place.
// Usage: node scripts/.cache/bookend-manifest.mjs > /tmp/bookends.json
//        then node scripts/.cache/add-image-slots.mjs /tmp/bookends.json
import fs from 'node:fs';
import { bookends, anchoredAt } from './bookend-audit.mjs';

const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const peopleSrc = fs.readFileSync('src/lib/people.ts', 'utf8');
const placesSrc = fs.readFileSync('src/lib/places.ts', 'utf8');

/** Myth episodes paint in Joseon sumi ink. */
const INK = new Set(['Heaven–Earth King', 'Sulmun', 'Three Princes', 'Stone Lady', 'Gardener', 'Jachungbi', 'Kangrim', 'Three Realms', 'Dangun & Old Joseon']);

/** name → person id, from each person's name and aliases (only names of 4+ letters, longest first). */
const names = [];
for (const m of peopleSrc.matchAll(/\bid: '([a-z0-9_-]+)',\s*name: '([^']+)'([\s\S]{0,4000}?)\n\t\}/g)) {
	const [, id, name, rest] = m;
	if (id.startsWith('clan-') || id.startsWith('grp-')) continue;
	const aliases = rest.match(/aliases: \[([^\]]*)\]/)?.[1].match(/'([^']+)'/g)?.map((a) => a.slice(1, -1)) ?? [];
	for (const n of [name, ...aliases]) if (/^[A-Z][\w’' -]{3,}$/.test(n)) names.push([n, id]);
}
names.sort((a, b) => b[0].length - a[0].length);
const portrait = new Set(fs.readdirSync('static').filter((f) => f.startsWith('ch_')));
const hasFace = (id) => [...portrait].some((f) => f.includes(id.replace(/-/g, '_')));

const plain = (t) => (t ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const textOf = (b) => plain(b.kind === 'dialogue' ? (b.en ?? b.lines ?? []).join(' ') : b.html);

function castOf(blocks) {
	const ids = [];
	for (const b of blocks) {
		if (b.person) ids.push(b.person);
		const t = textOf(b);
		for (const [n, id] of names) if (new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(t)) ids.push(id);
	}
	return [...new Set(ids)].filter(hasFace).slice(0, 3);
}

/** An anchor: the block's first words, long enough to be unique in the episode. */
function anchor(e, i) {
	const b = e.blocks[i];
	const raw = b.kind === 'dialogue' ? (b.en ?? b.lines ?? [])[0] ?? '' : b.html ?? '';
	const rawOf = (x) => [x.html, ...(x.en ?? []), ...(x.lines ?? [])].filter(Boolean).join(' ').toLowerCase();
	for (const seg of raw.split(/<[^>]+>/)) {
		const words = seg.trim().split(/\s+/);
		for (let n = 3; n <= Math.min(words.length, 14); n++) {
			const at = words.slice(0, n).join(' ');
			if (at.length < 14) continue;
			if (e.blocks.findIndex((x) => rawOf(x).includes(at.toLowerCase())) === i) return at;
		}
	}
	return null;
}

const slug = (t) => t.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 32);
const placeName = (id) => placesSrc.match(new RegExp(`\\b${id}: \\{ id: '${id}', name: '([^']+)'`))?.[1];

const out = [];
for (const ch of story) {
	for (const e of ch.entries ?? []) {
		const { first, last } = bookends(e);
		const where = e.place ? placeName(e.place) : undefined;
		const ink = INK.has(e.title);
		for (const [kind, i, ctx] of [
			['open', first, e.blocks.slice(first, first + 3)],
			['close', last, e.blocks.slice(Math.max(0, last - 2), last + 1)]
		]) {
			if (i < 0 || anchoredAt(e, i).length) continue;
			const at = anchor(e, i);
			if (!at) continue;
			const line = textOf(e.blocks[i]);
			const context = ctx.map(textOf).join(' ');
			const people = castOf(ctx);
			const role =
				kind === 'open'
					? 'OPENING STILL of the episode: the first image the reader sees, staging its first line.'
					: 'CLOSING STILL of the episode: the final scene of this story as it ends (not the next episode).';
			out.push({
				id: `${slug(e.title)}-${kind}`,
				entry: e.title,
				at,
				alt: line.slice(0, 140),
				scene: `${role} The line: “${line.slice(0, 400)}” Context: ${context.slice(0, 600)}${where ? ` Place: ${where}.` : ''} ${kind === 'open' ? 'A wide or medium establishing frame that hooks.' : 'A quiet, resonant final frame; leave space around the subject.'}`,
				people,
				...(ink ? { style: 'ink', canon: false } : {}),
				...(e.place && !ink ? { canon: { with: [`place:${e.place}`] } } : {})
			});
		}
	}
}
console.log(JSON.stringify(out, null, '\t'));
