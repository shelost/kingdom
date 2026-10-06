// Restores every dropped still whose art is still on disk, visible.
// History = every git version of story.json + scripts/.cache/prev-stills backups;
// each slot id takes its newest definition. Placement:
//   1. its `at` anchor lands in the same-titled episode, the same chapter, or (anchors ≥ 15
//      chars) anywhere → that episode, after its nearest old neighbour
//   2. anchor gone → beside its nearest old neighbour that is in the story now, taking that
//      neighbour's anchor so it plays in the same beat
//   art already used by a current slot (a rename) or no neighbour at all → skipped
// Usage: node scripts/.cache/restore-orphan-stills.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const STORY = 'src/lib/data/story.json';
const BACKUPS = 'scripts/.cache/prev-stills';
const BACKUP = `${BACKUPS}/story.pre-restore-orphans.json`;
const DRY = process.argv.includes('--dry');
const GLOBAL_ANCHOR_MIN = 15;

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

/* —— sources, newest first —— */
const sources = [];
for (const f of fs.readdirSync(BACKUPS)) {
	if (!/^story\.pre-.*\.json$/.test(f) || f === path.basename(BACKUP)) continue;
	const p = path.join(BACKUPS, f);
	sources.push({ label: f, time: fs.statSync(p).mtimeMs, load: () => fs.readFileSync(p, 'utf8') });
}
for (const line of execSync(`git log --format="%H %ct" -- ${STORY}`).toString().trim().split('\n')) {
	const [hash, ct] = line.split(' ');
	sources.push({
		label: hash.slice(0, 7),
		time: Number(ct) * 1000,
		load: () => execSync(`git show ${hash}:${STORY}`, { maxBuffer: 1 << 28 }).toString()
	});
}
sources.sort((a, b) => b.time - a.time);

/** id → newest definition, with the id order of the episode it sat in there */
const history = new Map();
for (const src of sources) {
	let chapters;
	try {
		chapters = JSON.parse(src.load());
	} catch {
		continue;
	}
	if (!Array.isArray(chapters)) continue;
	for (const ch of chapters) {
		for (const e of ch.entries ?? []) {
			const order = (e.images ?? []).map((s) => s?.id).filter(Boolean);
			for (const slot of e.images ?? []) {
				if (slot?.id && !history.has(slot.id)) {
					history.set(slot.id, { slot, chapterId: ch.id, title: e.title, order });
				}
			}
		}
	}
}

/* —— what the story already has —— */
const key = (p) => (p ?? '').split('?')[0].toLowerCase();
const usedArt = new Set();
/** id → current entry record */
const homeOf = new Map();
const entries = [];
for (const ch of story) {
	for (const e of ch.entries ?? []) {
		const rec = {
			chapterId: ch.id,
			entry: e,
			texts: (e.blocks ?? []).map((b) => strip(textOf(b)).toLowerCase())
		};
		entries.push(rec);
		for (const s of e.images ?? []) {
			homeOf.set(s.id, rec);
			if (s.tempImage) usedArt.add(key(s.tempImage));
			if (s.src) usedArt.add(key(s.src));
		}
	}
}

function artOf(slot) {
	for (const p of [slot.tempImage, slot.src, `/temp/${slot.id}.jpg`, `/temp/${slot.id}.png`]) {
		if (p && fs.existsSync(`static${key(p)}`)) return key(p);
	}
	return null;
}

function anchorHome(def) {
	const needle = def.slot.at?.trim().toLowerCase();
	if (!needle) return undefined;
	const hits = (list) => list.find((x) => x.texts.some((t) => t.includes(needle)));
	const sameTitle = entries.filter((x) => x.entry.title === def.title);
	return (
		hits(sameTitle.filter((x) => x.chapterId === def.chapterId)) ??
		hits(sameTitle) ??
		hits(entries.filter((x) => x.chapterId === def.chapterId)) ??
		(needle.length >= GLOBAL_ANCHOR_MIN ? hits(entries) : undefined)
	);
}

/** Nearest old neighbour now in the story: earlier ones first, then later. */
function neighbourOf(id, def, within) {
	const i = def.order.indexOf(id);
	const near = [];
	for (let d = 1; d < def.order.length; d++) {
		if (def.order[i - d]) near.push({ id: def.order[i - d], before: true });
		if (def.order[i + d]) near.push({ id: def.order[i + d], before: false });
	}
	near.sort((a, b) => Number(b.before) - Number(a.before));
	return near.find((n) => homeOf.has(n.id) && (!within || homeOf.get(n.id) === within));
}

function insert(rec, slot, id, def) {
	const images = (rec.entry.images ??= []);
	const n = neighbourOf(id, def, rec);
	const at = n ? images.findIndex((s) => s.id === n.id) : -1;
	if (at < 0) images.push(slot);
	else images.splice(n.before ? at + 1 : at, 0, slot);
	homeOf.set(id, rec);
}

const report = { anchored: 0, byNeighbour: 0, skipped: { noArt: 0, artInUse: 0, noNeighbour: 0 }, byEntry: {} };
const pending = [];

/* pass 1: anchors that still land */
for (const [id, def] of history) {
	if (homeOf.has(id)) continue;
	const art = artOf(def.slot);
	if (!art) { report.skipped.noArt++; continue; }
	if (usedArt.has(art)) { report.skipped.artInUse++; continue; }
	usedArt.add(art);
	const home = anchorHome(def);
	if (!home) { pending.push([id, def]); continue; }
	const slot = { ...def.slot };
	delete slot.hidden;
	insert(home, slot, id, def);
	report.anchored++;
	report.byEntry[home.entry.title] = (report.byEntry[home.entry.title] ?? 0) + 1;
}

/* pass 2: beside the nearest neighbour, in its beat — repeat so chains of cut beats resolve */
for (let progress = true; progress && pending.length; ) {
	progress = false;
	for (let k = pending.length - 1; k >= 0; k--) {
		const [id, def] = pending[k];
		const n = neighbourOf(id, def);
		if (!n) continue;
		const rec = homeOf.get(n.id);
		const anchor = rec.entry.images.find((s) => s.id === n.id)?.at;
		const slot = { ...def.slot };
		delete slot.hidden;
		if (anchor) slot.at = anchor;
		else delete slot.at;
		insert(rec, slot, id, def);
		pending.splice(k, 1);
		progress = true;
		report.byNeighbour++;
		report.byEntry[rec.entry.title] = (report.byEntry[rec.entry.title] ?? 0) + 1;
	}
}
report.skipped.noNeighbour = pending.length;

console.log(
	JSON.stringify(
		{ sources: sources.length, ...report, unplaced: pending.map(([id, d]) => `${d.title}: ${id}`).slice(0, 20) },
		null,
		1
	)
);

/* --inspect=Title lists what would land in that episode and where it came from */
const inspect = process.argv.find((a) => a.startsWith('--inspect='))?.slice(10);
if (inspect) {
	const before = new Set(JSON.parse(raw).flatMap((c) => (c.entries ?? []).flatMap((e) => (e.images ?? []).map((s) => s.id))));
	for (const rec of entries.filter((x) => x.entry.title === inspect)) {
		for (const s of rec.entry.images ?? []) {
			if (before.has(s.id)) continue;
			console.log(`${s.id}  [was: ${history.get(s.id)?.title}]  @ ${(s.at ?? '').slice(0, 50)}`);
		}
	}
}

if (!DRY && report.anchored + report.byNeighbour) {
	fs.writeFileSync(BACKUP, raw);
	fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
	console.log(`backup → ${BACKUP}`);
}
