// node scripts/episode-story.mjs
// Merge the plot audit + first appearances + hand notes → src/lib/data/episode-story.json
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const AUDIT = 'scripts/.cache/audit/episode-audit.md';
const NOTES = 'src/lib/data/episode-story-notes.json';
const OUT = 'src/lib/data/episode-story.json';

const ALIASES = {
	gwanggaetothegreatking: 'gwanggetothegreatking',
	jinheungthecloud: 'jinhungthecloud',
	heungsu: 'hungsu',
	gyeol結: 'gyul結',
	mountgain: 'prosperitymountain',
	sungchung: 'sunchung',
	grandacademy: 'academy',
	thewanggeomsguest: 'munmu',
	thewanggumsguest: 'munmu',
	thekingforall: 'wanggum'
};

const norm = (s) =>
	String(s ?? '')
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^\p{L}\p{N}]+/gu, '');

function distance(a, b) {
	const d = Array.from({ length: b.length + 1 }, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		let prev = d[0];
		d[0] = i;
		for (let j = 1; j <= b.length; j++) {
			const t = d[j];
			d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
			prev = t;
		}
	}
	return d[b.length];
}

const FIELDS = {
	'Protagonist / want': 'want',
	Conflict: 'conflict',
	Shape: 'shape',
	Grade: 'grade',
	Problem: 'problem',
	Suggestion: 'suggestion'
};

const audits = [];
if (fs.existsSync(AUDIT)) {
	let cur = null;
	for (const line of fs.readFileSync(AUDIT, 'utf8').split('\n')) {
		const h = line.match(/^###\s+(\d+[a-z]*)\.\s+(.+?)\s*(?:\(([^)]*)\))?\s*(\[[^\]]*\])?\s*$/i);
		if (h) {
			cur = { auditNo: Number.parseInt(h[1], 10), auditTitle: h[2], auditYear: h[3] ?? '', key: norm(h[2]) };
			audits.push(cur);
			continue;
		}
		if (/^#{1,3}\s/.test(line)) cur = null;
		const f = cur && line.match(/^-\s+\*\*(.+?):\*\*\s*(.*)$/);
		if (f && FIELDS[f[1]]) cur[FIELDS[f[1]]] = f[2].trim();
	}
}

const used = new Set();
const keyOf = (a) => ALIASES[a.key] ?? a.key;
const exactAudit = new Map(audits.map((a) => [keyOf(a), a]));
const titleKeys = new Set(story.flatMap((c) => c.entries.map((e) => norm(e.title))));

function auditFor(title) {
	const key = norm(title);
	const exact = exactAudit.get(key);
	if (exact) return exact;
	let best = null;
	let bestD = Infinity;
	for (const a of audits) {
		if (titleKeys.has(keyOf(a)) || used.has(a)) continue;
		const d = distance(keyOf(a), key);
		if (d < bestD) [best, bestD] = [a, d];
	}
	if (!best || bestD > Math.max(2, Math.floor(key.length * 0.15))) return null;
	used.add(best);
	return best;
}

function walkPeople(blocks, into) {
	for (const b of blocks ?? []) {
		if (typeof b.person === 'string') into.add(b.person);
		if (Array.isArray(b.people)) for (const id of b.people) if (typeof id === 'string') into.add(id);
		if (typeof b.place === 'string') into.add(`place:${b.place}`);
		if (b.kind === 'place' && typeof b.place === 'string') into.add(`place:${b.place}`);
		if (b.blocks) walkPeople(b.blocks, into);
	}
}

const people = require('../src/lib/data/portraits.json');
const skipEntity = new Set();
// portraits.json is faces only — we filter against live people in episodeStory.ts.
void people;
void skipEntity;

const seen = new Set();
const notes = fs.existsSync(NOTES) ? JSON.parse(fs.readFileSync(NOTES, 'utf8')) : { boxes: [], episodes: {} };
const episodes = {};
let n = 0;

for (const ch of story) {
	for (const entry of ch.entries ?? []) {
		if (entry.hidden) continue;
		const ids = new Set();
		walkPeople(entry.blocks, ids);
		for (const im of entry.images ?? []) {
			if (Array.isArray(im.people)) for (const id of im.people) ids.add(id);
		}
		const fresh = [];
		const freshPlaces = [];
		for (const id of ids) {
			if (seen.has(id)) continue;
			seen.add(id);
			if (id.startsWith('place:')) freshPlaces.push(id.slice(6));
			else fresh.push(id);
		}
		const a = auditFor(entry.title);
		const overlay = notes.episodes?.[entry.title] ?? notes.episodes?.[`${ch.id}::${entry.title}`] ?? {};
		const shape = overlay.development ?? a?.shape ?? '';
		const beats = String(shape)
			.split(/\s*\/\s*/)
			.map((s) => s.trim())
			.filter(Boolean);
		episodes[`${ch.id}::${entry.title}`] = {
			n,
			id: `${ch.id}::${entry.title}`,
			title: entry.title,
			want: overlay.want ?? a?.want ?? '',
			conflict: overlay.conflict ?? a?.conflict ?? '',
			development: overlay.development ?? (beats.length > 2 ? beats.slice(0, -1).join(' · ') : shape),
			climax: overlay.climax ?? (beats.length > 1 ? beats.at(-1) : ''),
			resolution: overlay.resolution ?? '',
			aPlot: overlay.aPlot ?? '',
			bPlot: overlay.bPlot ?? '',
			themes: overlay.themes ?? [],
			concepts: overlay.concepts ?? [],
			plant: overlay.plant ?? [],
			pay: overlay.pay ?? [],
			hold: overlay.hold ?? [],
			introduced: fresh,
			places: freshPlaces,
			problem: a?.problem ?? '',
			events: overlay.events ?? []
		};
		n++;
	}
}

const out = {
	generated: new Date().toISOString().slice(0, 16).replace('T', ' '),
	boxes: notes.boxes ?? [],
	episodes
};
fs.writeFileSync(OUT, JSON.stringify(out, null, '\t') + '\n');
console.log(`episode-story: ${n} episodes · ${out.boxes.length} boxes → ${OUT}`);
