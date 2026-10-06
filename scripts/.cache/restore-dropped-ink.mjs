// Restores stills that commit 5c15ba4 dropped with the Jumong rewrite, when
// their art is still on disk and their `at` anchor still lands in an episode
// of the same chapter. Backs up story.json first.
// Usage: node scripts/.cache/restore-dropped-ink.mjs [--kind=ink|rest|all] [--dry]
//   ink  (default) ink / watercolor stills · rest  everything else · all  both
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const STORY = 'src/lib/data/story.json';
const DRY = process.argv.includes('--dry');
const KIND = process.argv.find((a) => a.startsWith('--kind='))?.slice(7) ?? 'ink';
const BACKUP = `scripts/.cache/prev-stills/story.pre-restore-${KIND}.json`;
const INK_ID = /ink|-wc-/;
const wanted = (id) => (KIND === 'all' ? true : KIND === 'rest' ? !INK_ID.test(id) : INK_ID.test(id));

const before = JSON.parse(execSync(`git show 5c15ba4^:${STORY}`, { maxBuffer: 1 << 28 }).toString());
const raw = fs.readFileSync(STORY, 'utf8');
const story = JSON.parse(raw);

const strip = (s) => (s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
function textOf(b) {
	switch (b?.kind) {
		case 'p':
		case 'cite':
		case 'moral':
		case 'monologue':
		case 'quote':
			return `${b.html} ${b.ko ?? ''}`;
		case 'dialogue':
			return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
		case 'verse':
			return (b.lines ?? []).join(' ');
		case 'flashback':
			return `${b.title ?? ''} ${b.year ?? ''} ${(b.blocks ?? []).map(textOf).join(' ')}`;
		case 'day':
		case 'scene':
			return [b.label, b.ko].filter(Boolean).join(' ');
		default:
			return '';
	}
}

const present = new Set();
for (const ch of story) for (const e of ch.entries ?? []) for (const im of e.images ?? []) present.add(im.id);

const artOf = (im) => (im.tempImage || im.src || `/temp/${im.id}.jpg`).split('?')[0];
const restored = [];
const skipped = { noFile: 0, noAnchor: 0, anchorGone: 0 };

for (const oldCh of before) {
	const ch = story.find((c) => c.id === oldCh.id);
	if (!ch) continue;
	const texts = (ch.entries ?? []).map((e) => (e.blocks ?? []).map((b) => strip(textOf(b)).toLowerCase()));
	for (const oldEntry of oldCh.entries ?? []) {
		for (const im of oldEntry.images ?? []) {
			if (present.has(im.id) || !wanted(im.id)) continue;
			if (!fs.existsSync(`static${artOf(im)}`)) { skipped.noFile++; continue; }
			if (!im.at?.trim()) { skipped.noAnchor++; continue; }
			const needle = im.at.trim().toLowerCase();
			const at = texts.findIndex((blocks) => blocks.some((t) => t.includes(needle)));
			if (at < 0) { skipped.anchorGone++; continue; }
			const entry = ch.entries[at];
			(entry.images ??= []).push(im);
			present.add(im.id);
			restored.push({ id: im.id, entry: entry.title, file: `static${artOf(im)}` });
		}
	}
}

const byEntry = {};
for (const r of restored) byEntry[r.entry] = (byEntry[r.entry] ?? 0) + 1;
console.log(JSON.stringify({ restored: restored.length, byEntry, skipped }, null, 1));

if (!DRY && restored.length) {
	fs.writeFileSync(BACKUP, raw);
	fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
	console.log(`backup → ${BACKUP}`);
}
