// Lists story.json image slots that still render as prompt cards: no `src`, and no
// `tempImage` file actually on disk. For each one it also prints the surrounding prose
// and the avatar/place art nearby, so a generator run can be given real reference images
// instead of bare names.
import fs from 'node:fs';
import path from 'node:path';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

// person id -> reference art path, harvested from the profile modules rather than
// hardcoded, so renamed avatars follow along.
const refs = new Map();
for (const module of ['src/lib/people.ts', 'src/lib/places.ts']) {
	const source = fs.readFileSync(module, 'utf8');
	for (const match of source.matchAll(/id:\s*'([^']+)',\s*\n\s*avatar:\s*'([^']+)'/g)) {
		refs.set(match[1], match[2]);
	}
	for (const match of source.matchAll(/avatar:\s*'([^']+)',\s*\n\s*[\s\S]{0,200}?id:\s*'([^']+)'/g)) {
		if (!refs.has(match[2])) refs.set(match[2], match[1]);
	}
}

const text = (block) => {
	const parts = [block?.html, block?.title, block?.note, block?.caption];
	if (Array.isArray(block?.en)) parts.push(block.en.join(' '));
	if (Array.isArray(block?.lines) && !block?.en) parts.push(block.lines.join(' '));
	if (Array.isArray(block?.sides)) {
		for (const side of block.sides) {
			parts.push(side.name);
			for (const u of side.units ?? []) parts.push(`${u.label} ${u.sub ?? ''}`);
		}
	}
	if (Array.isArray(block?.items)) {
		for (const it of block.items)
			parts.push(typeof it === 'string' ? it : `${it.label ?? ''} ${it.text ?? ''}`);
	}
	return parts
		.filter((v) => typeof v === 'string')
		.join(' ')
		.replace(/<[^>]+>/g, '')
		.replace(/\s+/g, ' ')
		.trim();
};

const exists = (p) => fs.existsSync(path.join('static', p.replace(/^\//, '')));

let total = 0;
const out = [];

for (const ch of Object.values(story)) {
	const rows = [];
	for (const en of ch.entries ?? []) {
		const blocks = en.blocks ?? [];
		for (const im of en.images ?? []) {
			if (im.src) continue;
			if (im.tempImage && exists(im.tempImage)) continue;
			// Convention: install-temp-art writes static/temp/{id}.jpg
			if (exists(`/temp/${im.id}.jpg`) || exists(`/temp/${im.id}.png`)) continue;
			total++;

			const anchor = typeof im.at === 'string' && im.at.trim() ? im.at.trim() : null;
			const idx = anchor ? blocks.findIndex((b) => text(b).includes(anchor.slice(0, 40))) : -1;
			const near = idx >= 0 ? blocks.slice(Math.max(0, idx - 2), idx + 3) : blocks.slice(0, 5);

			// people speaking near the anchor first, then anyone else in the entry
			const nearIds = [];
			const entryIds = [];
			for (const b of blocks) if (b.person && !entryIds.includes(b.person)) entryIds.push(b.person);
			for (const b of near) if (b.person && !nearIds.includes(b.person)) nearIds.push(b.person);
			const ordered = [...nearIds, ...entryIds.filter((p) => !nearIds.includes(p))];
			const art = ordered
				.map((p) => [p, refs.get(p)])
				.filter(([, a]) => a && exists(a))
				.map(([p, a]) => `${p}=static${a}`);

			rows.push(
				`  ${im.id}  ratio=${im.ratio}  [${en.year ?? ''} ${en.title ?? ''}]\n` +
					`    refs: ${art.length ? art.join('  ') : '(none)'}\n` +
					`    ctx: ${near.map(text).filter(Boolean).join(' || ').slice(0, 1100)}`
			);
		}
	}
	if (rows.length) out.push(`\n=== ${ch.title ?? '?'}  (${rows.length} bare) ===\n${rows.join('\n')}`);
}

console.log(out.join('\n'));
console.log(`\nTOTAL BARE: ${total}`);
