// How well developed each relationship is, scored from the script.
// node scripts/relation-scores.mjs [--quiet]
//
// The script is cut into scenes; each scene is fingerprinted, and only scenes whose text changed since the
// last run are re-read (cache: scripts/.cache/relation-scenes.json). Every relationship is then re-totalled
// from its scenes and written to src/lib/data/relation-scores.json; relationships whose score moved are listed.
//
// Raw (0–100) = presence 20 + talk 25 + evolution 25 + grip 30, then curved (raw^2.2) so thin bonds sit low:
//   presence   scenes the two share (both speak or are named)
//   talk       exchanges (one answers the other) and the words in them
//   evolution  episodes and years the bond develops across, plus the profile's events
//   grip       the pair's dialogue: interruptions, questions, short lines up; AI-isms, telegram stacks,
//              unbroken speeches down (the house rules in .cursor/rules/story-script-style.mdc)
// Expected: what the bond can carry, from how many episodes the lesser of the two appears in. A minor
// character's bond scores low and still reads "appropriate"; a lead pair that rarely talks reads "underdeveloped".
import fs from 'node:fs';
import crypto from 'node:crypto';

const STORY = 'src/lib/data/story.json';
const OUT = 'src/lib/data/relation-scores.json';
const CACHE = 'scripts/.cache/relation-scenes.json';
const quiet = process.argv.includes('--quiet');

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const relSrc = fs.readFileSync('src/lib/relations.ts', 'utf8');
const peopleSrc = fs.readFileSync('src/lib/people.ts', 'utf8');

/* ——— who is who ——— */

/** relationship id → { between, events } */
const relations = new Map();
for (const m of relSrc.matchAll(/\bid: '(rel-[a-z0-9-]+)'([\s\S]*?)\n\t\}/g)) {
	const between = m[2].match(/between: \[([^\]]*)\]/)?.[1].match(/'([^']+)'/g)?.map((s) => s.slice(1, -1));
	if (!between || between.length < 2) continue;
	const events = (m[2].match(/events: \[([\s\S]*?)\n\t\t\]/)?.[1].match(/label:/g) ?? []).length;
	relations.set(m[1], { between, events });
}

/** Names a person is called in narration (4+ letters), longest first so "Kim Yushin" wins over "Kim". */
const names = [];
for (const m of peopleSrc.matchAll(/\bid: '([a-z0-9_-]+)',\s*name: '([^']+)'([\s\S]{0,4000}?)\n\t\}/g)) {
	const [, id, name, rest] = m;
	const aliases = rest.match(/aliases: \[([^\]]*)\]/)?.[1].match(/'([^']+)'/g)?.map((a) => a.slice(1, -1)) ?? [];
	for (const n of [name, ...aliases]) if (/^[A-Z][\w’' -]{3,}$/.test(n) && !/ & /.test(n)) names.push([n, id]);
}
names.sort((a, b) => b[0].length - a[0].length);
const nameRes = names.map(([n, id]) => [new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`), id]);

/* ——— scenes ——— */

const plain = (t) => (t ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const HEADER = new Set(['scene', 'day', 'story']);

/** Each episode's blocks, flashbacks unfolded, cut at every scene/day/story header. */
function scenesOf(entry) {
	const flat = [];
	const walk = (bs) => bs.forEach((b) => (b.kind === 'flashback' ? walk(b.blocks ?? []) : flat.push(b)));
	walk(entry.blocks ?? []);
	const scenes = [[]];
	for (const b of flat) {
		if (HEADER.has(b.kind) && scenes.at(-1).length) scenes.push([]);
		scenes.at(-1).push(b);
	}
	return scenes.filter((s) => s.length);
}

const AI_ISMS = [
	/\bit(?:’s|'s| is) not [^.?!]{1,60}[.?!]\s*it(?:’s|'s| is)\b/i,
	/\bnot because [^.?!]{1,80} but because\b/i,
	/\bthat is not \w+\.\s*that is \w+/i,
	/\b(tapestry|testament to|delve|in the grand scheme|a dance of)\b/i
];
const TELEGRAM = /^(?:[A-Z][\w’']*\.\s+){2,}[A-Z][\w’']*\.$/;
const sentences = (t) => (t.match(/[^.?!…]+[.?!…]+/g) ?? [t]).length;

/** Everything one scene says about every pair in it. */
function readScene(blocks) {
	const present = new Set();
	const speakers = [];
	for (const b of blocks) {
		const t = plain(b.kind === 'dialogue' ? (b.en ?? []).join(' ') : b.html);
		if (b.kind === 'dialogue' && b.person) {
			present.add(b.person);
			speakers.push({ person: b.person, lines: (b.en ?? b.lines ?? []).map(plain).filter(Boolean) });
		} else if (b.kind === 'p' || b.kind === 'monologue') {
			speakers.push(null);
		}
		for (const [re, id] of nameRes) if (re.test(t)) present.add(id);
	}
	/** pair key "a|b" → exchange stats for the two talking to each other */
	const pairs = {};
	const key = (a, b) => [a, b].sort().join('|');
	let prev = null;
	let gap = 0;
	for (const s of speakers) {
		if (!s) {
			if (++gap > 1) prev = null;
			continue;
		}
		gap = 0;
		if (prev && prev.person !== s.person) {
			const k = key(prev.person, s.person);
			const p = (pairs[k] ??= { exchanges: 0, words: 0, lines: 0, interrupts: 0, questions: 0, short: 0, ai: 0, telegrams: 0, speeches: 0, flagged: [] });
			p.exchanges++;
			for (const turn of p.exchanges === 1 ? [prev, s] : [s]) {
				const whole = turn.lines.join(' ');
				if (turn.lines.length > 3 && sentences(whole) > 4) p.speeches++;
				for (const line of turn.lines) {
					const w = line.split(/\s+/).length;
					p.words += w;
					p.lines++;
					if (/[—–]\s*$|…|\.\.\./.test(line)) p.interrupts++;
					if (/\?/.test(line)) p.questions++;
					if (w <= 6) p.short++;
					if (TELEGRAM.test(line)) p.telegrams++;
					if (AI_ISMS.some((re) => re.test(line))) {
						p.ai++;
						if (p.flagged.length < 3) p.flagged.push(line.slice(0, 140));
					}
				}
			}
		}
		prev = s;
	}
	return { present: [...present], speakers: [...new Set(speakers.filter(Boolean).map((s) => s.person))], pairs };
}

/* ——— incremental read ——— */

const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const nextCache = {};
let reread = 0;
/** scene records: { episode, year, present, pairs } */
const records = [];
for (const ch of story) {
	for (const entry of ch.entries ?? []) {
		scenesOf(entry).forEach((blocks, i) => {
			const hash = crypto.createHash('sha1').update(JSON.stringify(blocks)).digest('hex').slice(0, 16);
			const id = `${entry.title}#${i}`;
			const hit = cache[id]?.hash === hash ? cache[id] : null;
			const read = hit ?? { hash, ...readScene(blocks) };
			if (!hit) reread++;
			nextCache[id] = read;
			records.push({ episode: entry.title, year: Number.parseInt(String(entry.year), 10), ...read });
		});
	}
}
fs.mkdirSync('scripts/.cache', { recursive: true });
fs.writeFileSync(CACHE, JSON.stringify(nextCache));

/* ——— totals per relationship ——— */

/** person → episodes they speak or are named in */
const personEpisodes = new Map();
for (const r of records) for (const id of r.present) (personEpisodes.get(id) ?? personEpisodes.set(id, new Set()).get(id)).add(r.episode);
const episodeOrder = [...new Set(records.map((r) => r.episode))];

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const logShare = (x, full) => clamp01(Math.log2(1 + x) / Math.log2(1 + full));

function score(rel) {
	const [a, b] = rel.between;
	const k = [a, b].sort().join('|');
	const shared = records.filter((r) => r.present.includes(a) && r.present.includes(b));
	const talk = { exchanges: 0, words: 0, lines: 0, interrupts: 0, questions: 0, short: 0, ai: 0, telegrams: 0, speeches: 0, flagged: [] };
	const talkedIn = new Set();
	for (const r of records) {
		const p = r.pairs[k];
		if (!p) continue;
		talkedIn.add(r.episode);
		for (const f of Object.keys(talk)) {
			if (f === 'flagged') talk.flagged.push(...p.flagged);
			else talk[f] += p[f];
		}
	}
	const episodes = [...new Set(shared.map((r) => r.episode))];
	const years = shared.map((r) => r.year).filter(Number.isFinite);
	const span = years.length ? Math.max(...years) - Math.min(...years) : 0;

	const presence = 20 * logShare(shared.length, 20);
	const talkPts = 25 * (0.5 * logShare(talk.exchanges, 80) + 0.5 * logShare(talk.words, 3000));
	const evolution = 25 * (0.6 * clamp01((talkedIn.size - 1) / 7) + 0.2 * clamp01(span / 20) + 0.2 * clamp01(rel.events / 5));
	let grip = null;
	if (talk.lines >= 4) {
		const r = (n) => n / talk.lines;
		const g = 0.45 + 0.6 * r(talk.interrupts) + 0.35 * r(talk.questions) + 0.25 * r(talk.short) - 1.5 * r(talk.ai) - 0.8 * r(talk.telegrams) - 0.3 * clamp01(talk.speeches / Math.max(1, talk.exchanges));
		grip = Math.round(100 * clamp01(g));
	}
	const raw = presence + talkPts + evolution + (grip == null ? 0 : (30 * grip) / 100);
	const total = Math.round(100 * (raw / 100) ** 2.2);
	/** What the lesser of the two can carry: a bond is as big as its smaller character's part. */
	const minEps = Math.min(personEpisodes.get(a)?.size ?? 0, personEpisodes.get(b)?.size ?? 0);
	const expected = Math.round(85 * clamp01(minEps / 16) ** 0.9);
	const fit = expected ? total / expected : total ? 1 : 0;
	const status = total >= 70 ? 'strong' : fit >= 0.75 ? 'appropriate' : fit >= 0.45 ? 'thin' : 'underdeveloped';
	/** Each episode they share, in story order: talk (they answer each other) › together › about (others name them both). */
	const kindOf = (ep) => {
		const rs = shared.filter((r) => r.episode === ep);
		if (rs.some((r) => r.pairs[k])) return 'talk';
		if (rs.some((r) => r.speakers?.includes(a) && r.speakers?.includes(b))) return 'together';
		return 'about';
	};
	const links = episodeOrder.filter((ep) => episodes.includes(ep)).map((ep) => ({ title: ep, kind: kindOf(ep) }));
	return {
		score: total,
		raw: Math.round(raw),
		expected,
		status,
		minEpisodes: minEps,
		links,
		parts: { presence: Math.round(presence), talk: Math.round(talkPts), evolution: Math.round(evolution), grip: grip == null ? 0 : Math.round((30 * grip) / 100) },
		grip,
		scenes: shared.length,
		exchanges: talk.exchanges,
		words: talk.words,
		lines: talk.lines,
		talkedIn: talkedIn.size,
		episodes,
		years: years.length ? [Math.min(...years), Math.max(...years)] : null,
		events: rel.events,
		interrupts: talk.interrupts,
		questions: talk.questions,
		shortLines: talk.short,
		aiisms: talk.ai,
		telegrams: talk.telegrams,
		speeches: talk.speeches,
		flagged: talk.flagged.slice(0, 3)
	};
}

const before = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')).scores ?? {} : {};
const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
const scores = {};
const moved = [];
for (const [id, rel] of relations) {
	const s = score(rel);
	const was = before[id];
	const changed = !was || was.score !== s.score || was.exchanges !== s.exchanges || was.scenes !== s.scenes;
	scores[id] = { ...s, updated: changed ? now : (was.updated ?? now) };
	if (was && was.score !== s.score) moved.push(`${id.replace(/^rel-/, '')} ${was.score}→${s.score}`);
}
fs.writeFileSync(OUT, JSON.stringify({ generated: now, scores }, null, '\t') + '\n');

if (!quiet || moved.length) {
	const all = Object.values(scores).map((s) => s.score);
	const avg = Math.round(all.reduce((a, b) => a + b, 0) / Math.max(1, all.length));
	console.log(
		`Relationships: ${relations.size} scored · avg ${avg} · ${reread} scene${reread === 1 ? '' : 's'} re-read` +
			(moved.length ? ` · moved: ${moved.slice(0, 8).join(', ')}${moved.length > 8 ? ` +${moved.length - 8}` : ''}` : '')
	);
}
