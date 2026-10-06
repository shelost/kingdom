// node scripts/.cache/apply-voice-report.mjs [--write]
// Applies voice-report.md rewrites to story.json by matching each "Before" text to its paragraph.
// Images whose `at` anchor would vanish are re-pointed at the opening words of the new text.
import fs from 'node:fs';
const FILE = 'src/lib/data/story.json';
const WRITE = process.argv.includes('--write');
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const BASE_TEXT = JSON.stringify(story).toLowerCase();
const report = fs.readFileSync('scripts/.cache/voice-report.md', 'utf8').split('\n');
const seqSrc = fs.readFileSync('src/lib/movieSequences.ts', 'utf8');
const seqAts = [...seqSrc.matchAll(/\bat:\s*'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]);

const strip = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const norm = (s) => strip(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…$|\.\.\.$/, '').trim();
const quoted = (line) => {
	const a = line.indexOf('"');
	const b = line.lastIndexOf('"');
	return a >= 0 && b > a ? line.slice(a + 1, b) : null;
};
const firstQuoted = (line) => line.match(/"((?:[^"])*)"/)?.[1] ?? null;

// ---- parse
const items = [];
let entry = null;
let cur = null;
for (const line of report) {
	const h = line.match(/^### (.+?) \(#(\d+)\)\s*$/);
	if (h) {
		entry = h[1];
		continue;
	}
	if (/^- \*\*b/.test(line)) {
		cur = { entry, head: line, before: null, en: null, ko: null, enLine: '' };
		items.push(cur);
		continue;
	}
	if (!cur) continue;
	if (/^\s+- Before:/.test(line)) cur.before = quoted(line);
	else if (/^\s+- After \(EN\):/.test(line)) {
		cur.enLine = line;
		cur.en = /cut the block/i.test(line) ? '__CUT__' : firstQuoted(line);
	} else if (/^\s+- After \(KO\):/.test(line)) cur.ko = /블록 삭제/.test(line) && !firstQuoted(line) ? '__CUT__' : firstQuoted(line);
}

// ---- locate
const entries = story.flatMap((c) => c.entries);
function* containers(holder) {
	yield holder;
	for (const b of holder.blocks ?? []) if (b.kind === 'flashback') yield* containers(b);
}
const results = { applied: [], skipped: [], repointed: [], seqRisk: [] };
const shotRepoints = [];
const blockText = (b) =>
	b.kind === 'dialogue'
		? [...(b.lines ?? []), ...(b.en ?? [])].join(' ')
		: b.kind === 'flashback'
			? [b.title, b.year, ...(b.blocks ?? []).map(blockText)].join(' ')
			: [b.html, b.ko, b.label, b.title, b.caption].filter(Boolean).join(' ');
const sameTitle = (a, b) => a.replace(/[‘’]/g, "'") === b.replace(/[‘’]/g, "'");

for (const it of items) {
	const tag = `${it.entry} ${it.head.slice(4, 30)}`;
	if (!it.en || !it.before) {
		results.skipped.push(`${tag} — no before/after (flag only)`);
		continue;
	}
	if (it.en !== '__CUT__' && !it.ko) {
		results.skipped.push(`${tag} — missing KO`);
		continue;
	}
	const e = entries.find((x) => sameTitle(x.title, it.entry));
	if (!e) {
		results.skipped.push(`${tag} — no entry`);
		continue;
	}
	const needle = norm(it.before).slice(0, 60);
	let hit = null;
	for (const box of containers(e))
		box.blocks.forEach((b, i) => {
			if (!hit && ['p', 'cite', 'moral'].includes(b.kind) && norm(b.html).includes(needle)) hit = { box, i, b };
		});
	if (!hit) {
		results.skipped.push(`${tag} — before not found: "${needle.slice(0, 50)}"`);
		continue;
	}
	const { box, i, b } = hit;
	const cut = it.en === '__CUT__';
	const firstIdx = (blocks, at) => blocks.findIndex((x) => blockText(x).toLowerCase().includes(at.trim().toLowerCase()));
	const after = cut ? box.blocks.filter((_, k) => k !== i) : box.blocks.map((x, k) => (k === i ? { ...x, html: it.en, ko: it.ko } : x));
	const imgs = (box.images ?? []).filter((im) => im.at && firstIdx(box.blocks, im.at) === i && firstIdx(after, im.at) !== i);
	if (cut && imgs.length) {
		results.skipped.push(`${tag} — cut would orphan ${imgs.map((x) => x.id)}`);
		continue;
	}
	if (cut) {
		box.blocks.splice(i, 1);
		results.applied.push(`${tag} (cut)`);
		continue;
	}
	if (imgs.length) {
		const words = it.en.split(/\s+/);
		let at = null;
		for (let n = 5; n <= Math.min(words.length, 12); n++) {
			const cand = words.slice(0, n).join(' ').replace(/[,;:—–-]+$/, '');
			const earlier = box.blocks.slice(0, i).some((x) => JSON.stringify(x).toLowerCase().includes(cand.toLowerCase()));
			if (!earlier) {
				at = cand;
				break;
			}
		}
		if (!at) {
			results.skipped.push(`${tag} — no unique anchor for ${imgs.map((x) => x.id)}`);
			continue;
		}
		for (const im of imgs) {
			results.repointed.push(`${it.entry}: ${im.id} "${im.at}" → "${at}"`);
			shotRepoints.push({ id: im.id, from: im.at, to: at });
			im.at = at;
		}
	}
	b.html = it.en;
	b.ko = it.ko;
	results.applied.push(tag);
}

console.log(`items ${items.length} · applied ${results.applied.length} · skipped ${results.skipped.length} · repointed ${results.repointed.length}`);
console.log('\nSKIPPED\n ' + results.skipped.join('\n '));
console.log('\nREPOINTED\n ' + results.repointed.join('\n '));
// movie shots share slot ids with images: follow the same repoint
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const q = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
let seqOut = seqSrc;
for (const r of shotRepoints) {
	const re = new RegExp(`(\\{ id: '${esc(r.id)}'[^\\n]*?\\bat: ')${esc(q(r.from))}(')`);
	seqOut = seqOut.replace(re, (_, a, b) => `${a}${q(r.to)}${b}`);
}
const allText = JSON.stringify(story).toLowerCase();
const has = (text, at) => text.includes(JSON.stringify(at.toLowerCase()).slice(1, -1));
for (const m of seqOut.matchAll(/\{ id: '([^']+)'[^\n]*?\bat: '((?:[^'\\]|\\.)*)'/g)) {
	const at = m[2].replace(/\\'/g, "'");
	if (!has(allText, at) && has(BASE_TEXT, at)) results.seqRisk.push(`${m[1]} at "${at}"`);
}
console.log('\nMOVIE SHOTS WITH NO MATCHING TEXT\n ' + results.seqRisk.join('\n '));
if (WRITE) {
	const backup = (src, dst) => fs.existsSync(dst) || fs.copyFileSync(src, dst);
	backup(FILE, 'scripts/.cache/prev-stills/story.pre-voice-report.json');
	backup('src/lib/movieSequences.ts', 'scripts/.cache/prev-stills/movieSequences.pre-voice-report.ts');
	fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
	fs.writeFileSync('src/lib/movieSequences.ts', seqOut);
	console.log('\nwritten');
}
