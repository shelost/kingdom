// Episode quality dashboard.
// node scripts/episode-scores.mjs [--quiet]
//
// Each episode is fingerprinted. Only episodes whose blocks or stills changed since the last run are
// re-measured (cache: scripts/.cache/episode-scores.json, which holds raw stats only). Scores are then
// re-derived for every episode from those stats, so a change to the curve below applies everywhere
// without re-reading the book. Output: src/lib/data/episode-scores.json, read by /dashboard.
//
// Counts (words, scenes, speakers, stills) stay facts. They never enter the composite.
// Only story metrics enter the composite (entertainment value):
//   pacing         scene lengths near 300–650 words, some variation, narration and talk taking turns
//   entertainment  dialogue share, questions, interruptions, distinct speakers, a short opening, a bold closer, stills
//   balance        narration / dialogue / stills / widgets against a spoken scene with a frame every few hundred words
//   completeness   the plot-audit grade, blended with how the dialogue is built (grip) — beginning, middle, end
// Craft scores are shown and not counted:
//   human          the inverse of AI tells per thousand words
//   accuracy       chronicle discipline: quoted sources up; AD years in mouths, king numbers, glosses down
import fs from 'node:fs';
import crypto from 'node:crypto';

const STORY = 'src/lib/data/story.json';
const AUDIT = 'scripts/.cache/audit/episode-audit.md';
const NOTES = 'src/lib/data/episode-story-notes.json';
const OUT = 'src/lib/data/episode-scores.json';
const CACHE = 'scripts/.cache/episode-scores.json';
const VERSION = 4;
const quiet = process.argv.includes('--quiet');

const METRICS = ['pacing', 'entertainment', 'balance', 'completeness', 'human', 'accuracy'];
const COUNTED = ['pacing', 'entertainment', 'balance', 'completeness'];
const WEIGHTS = { pacing: 18, entertainment: 24, balance: 14, completeness: 28, human: 0, accuracy: 0 };
const CURVE = 2.2;

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const notes = fs.existsSync(NOTES) ? JSON.parse(fs.readFileSync(NOTES, 'utf8')) : { episodes: {} };
const plain = (t) =>
	String(t ?? '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&[a-z#0-9]+;/gi, ' ')
		.replace(/\s+/g, ' ')
		.trim();
const words = (t) => (t ? t.split(/\s+/).filter(Boolean).length : 0);
const clamp = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));
const hashOf = (v) => crypto.createHash('sha1').update(JSON.stringify(v)).digest('hex').slice(0, 16);
const round1 = (n) => Math.round(n * 10) / 10;

/** 100 inside [lo, hi]; falls to 0 across `span` on either side. */
function band(x, lo, hi, span) {
	if (x >= lo && x <= hi) return 100;
	const d = x < lo ? lo - x : x - hi;
	return clamp(100 * (1 - d / span));
}
const curve = (raw) => (raw == null ? null : Math.round(100 * (clamp(raw) / 100) ** CURVE));

const norm = (s) =>
	String(s ?? '')
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^\p{L}\p{N}]+/gu, '');

const ALIASES = {
	gwanggaetothegreatking: 'gwanggetothegreatking',
	jinheungthecloud: 'jinhungthecloud',
	heungsu: 'hungsu',
	gyeol結: 'gyul結',
	mountgain: 'prosperitymountain',
	sungchung: 'sunchung',
	grandacademy: 'academy'
};

/** Raw (pre-curve) quality points per audit grade. */
const GRADE = { A: 97, B: 80, C: 52 };

const audits = new Map();
if (fs.existsSync(AUDIT)) {
	let title = '';
	for (const line of fs.readFileSync(AUDIT, 'utf8').split('\n')) {
		const h = line.match(/^###\s+\d+\.\s+(.+?)\s*(?:\([^)]*\))?\s*(?:\[[^\]]*\])?\s*$/);
		if (h) {
			title = ALIASES[norm(h[1])] ?? norm(h[1]);
			continue;
		}
		const g = title && line.match(/^-\s+\*\*Grade:\*\*\s*([ABC])/);
		if (g) audits.set(title, g[1]);
	}
}

/* ——— AI tells ——— */

/** Each hit costs its weight. Patterns follow the house bans in .cursor/rules/story-script-style.mdc plus common model prose. */
const AI_TELLS = [
	{ w: 3, re: /\b(?:it|this|that)(?:’s|'s| is| was) not (?:just |only |about )?[^.?!]{1,80}[.;,—–]\s*(?:it|this|that)(?:’s|'s| is| was)\b/i },
	{ w: 3, re: /\bnot because [^.?!]{1,80}\bbut because\b/i },
	{ w: 3, re: /\bthat is not \w+\.\s*that is \w+/i },
	{ w: 2, re: /\bnot (?:a|an|the) \w+[^.?!]{0,30}[,;—–]\s*(?:but )?(?:a|an|the) \w+/i },
	{ w: 2, re: /\bnot just\b|\bmore than just\b|\bnothing more than\b/i },
	{ w: 3, re: /\b(tapestry|testament to|delve|in the grand scheme|a dance of|it is worth noting|palpable|a symphony of|an unspoken|unspoken (?:pact|promise|rule|understanding))\b/i },
	{ w: 2, re: /\b(?:the weight of|the gravity of|the enormity of|a heavy silence|the silence (?:stretches|hangs|settles)|silence (?:stretches|hangs|settles|falls))\b/i },
	{ w: 2, re: /\b(?:a breath (?:he|she|they) didn['’]t know|let(?:s)? out a breath|for a long moment|a beat passes|a long beat|in that moment|something (?:shifts|changes|breaks) in)\b/i },
	{ w: 1, re: /\b(?:somehow|something like|the kind of \w+ that|almost as if|as if (?:to say|the))\b/i },
	{ w: 1, re: /\b(?:quietly|softly|gently)\b/i },
	{ w: 1, re: /\b(?:lingers?|echo(?:es)? (?:through|in))\b/i },
	{ w: 2, re: /\b(?:and (?:that|this) is (?:the|what|why|how))\b/i },
	{ w: 1, re: /\b(?:a reminder that|a promise that|a question (?:no one|nobody))\b/i }
];
/** "X, Y, and Z." closing a sentence: the model's tricolon. */
const TRICOLON = /\b\w+(?: \w+){0,3}, \w+(?: \w+){0,3},? and \w+(?: \w+){0,3}[.!]$/;
const TELEGRAM = /^(?:[A-Z][\w’']*\.\s+){2,}[A-Z][\w’']*\.$/;
const AD_YEAR = /\b(?:A\.?\s?D\.?|C\.?\s?E\.?|B\.?\s?C\.?)\b|\b(?:in|by|since|from|until)\s+\d{3,4}\b/i;
const KING_NO = /\(#\d+\)/;
const GLOSS = /\([^)]*[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af\u4e00-\u9fff][^)]*\)/;

const HEADER = new Set(['scene', 'day', 'story']);
const WIDGETS = new Set(['quote', 'card', 'hanja', 'term', 'map', 'diagram', 'formation', 'battle', 'table', 'verse', 'poem', 'chengyu', 'edict', 'covenant', 'omens', 'oath', 'place', 'moral', 'cite']);
const PLACES = new Set(['place', 'map', 'battle']);

function tellsIn(sentence, hits) {
	let cost = 0;
	for (const t of AI_TELLS) {
		if (t.re.test(sentence)) {
			cost += t.w;
			if (hits.length < 6) hits.push(sentence.trim().slice(0, 160));
		}
	}
	if (TRICOLON.test(sentence.trim())) cost += 1;
	return cost;
}

function flatten(blocks, out = [], counts = { flashbacks: 0 }) {
	for (const b of blocks ?? []) {
		if (b.kind === 'flashback') {
			counts.flashbacks++;
			flatten(b.blocks ?? [], out, counts);
		} else out.push(b);
	}
	return out;
}

/** Raw stats for one episode: everything countable, no judgement. Cached by fingerprint. */
function measure(entry) {
	const counts = { flashbacks: 0 };
	const flat = flatten(entry.blocks, [], counts);
	const scenes = [[]];
	for (const b of flat) {
		if (HEADER.has(b.kind) && scenes.at(-1).length) scenes.push([]);
		scenes.at(-1).push(b);
	}
	const sceneList = scenes.filter((s) => s.length);

	const s = {
		words: 0,
		narration: 0,
		dialogue: 0,
		koChars: 0,
		paragraphs: 0,
		dialogueBlocks: 0,
		lines: 0,
		questions: 0,
		interrupts: 0,
		shortLines: 0,
		speeches: 0,
		telegrams: 0,
		sentences: 0,
		sentenceCv: 0,
		longSentences: 0,
		emDashes: 0,
		aiCost: 0,
		aiHits: 0,
		adInMouth: 0,
		kingNos: 0,
		glosses: 0,
		quotes: 0,
		widgets: 0,
		flashbacks: counts.flashbacks,
		scenes: sceneList.length,
		days: 0,
		places: 0,
		speakers: 0,
		images: (entry.images ?? []).length,
		nsfwImages: (entry.images ?? []).filter((im) => im.nsfw).length,
		sequences: (entry.movieSequences ?? []).length,
		openerWords: 0,
		boldCloser: false,
		switches: 0,
		sceneWords: [],
		flagged: []
	};
	const speakers = new Set();
	const sentenceLens = [];
	let lastKind = '';

	for (const scene of sceneList) {
		let sw = 0;
		for (const b of scene) {
			if (b.kind === 'day') s.days++;
			if (PLACES.has(b.kind)) s.places++;
			if (b.kind === 'quote') s.quotes++;
			if (WIDGETS.has(b.kind)) s.widgets++;
			if (b.ko) s.koChars += plain(b.ko).replace(/\s/g, '').length;
			if (b.kind === 'dialogue' && Array.isArray(b.en)) {
				s.dialogueBlocks++;
				if (b.person) speakers.add(b.person);
				if (Array.isArray(b.lines)) s.koChars += b.lines.map(plain).join('').replace(/\s/g, '').length;
				const en = b.en.map(plain).filter(Boolean);
				const w = words(en.join(' '));
				s.dialogue += w;
				sw += w;
				s.lines += en.length;
				if (en.length > 3 && (en.join(' ').match(/[.?!]+/g) ?? []).length > 4) s.speeches++;
				for (const line of en) {
					const lw = words(line);
					if (lw <= 6) s.shortLines++;
					if (/\?/.test(line)) s.questions++;
					if (/[—–]\s*$|…|\.\.\./.test(line)) s.interrupts++;
					if (TELEGRAM.test(line)) s.telegrams++;
					if (AD_YEAR.test(line)) s.adInMouth++;
					s.aiCost += tellsIn(line, s.flagged);
				}
				if (lastKind && lastKind !== 'dialogue') s.switches++;
				lastKind = 'dialogue';
			} else if (b.kind !== 'quote' && (b.html || b.text)) {
				const t = plain(b.html || b.text);
				const w = words(t);
				if (!w) continue;
				if (b.kind === 'p') s.paragraphs++;
				s.narration += w;
				sw += w;
				if (KING_NO.test(t)) s.kingNos++;
				if (GLOSS.test(b.html || b.text || '')) s.glosses++;
				const dashes = (t.match(/—/g) ?? []).length;
				s.emDashes += dashes;
				if (dashes > 1) s.aiCost += dashes - 1;
				for (const sentence of t.match(/[^.?!…]+[.?!…]+["”’)]*/g) ?? [t]) {
					const sl = words(sentence);
					if (sl < 2) continue;
					sentenceLens.push(sl);
					if (sl > 30) {
						s.longSentences++;
						s.aiCost += 0.5;
					}
					s.aiCost += tellsIn(sentence, s.flagged);
				}
				if (lastKind && lastKind !== 'prose') s.switches++;
				lastKind = 'prose';
			}
		}
		s.sceneWords.push(sw);
	}

	s.words = s.narration + s.dialogue;
	s.speakers = speakers.size;
	s.sentences = sentenceLens.length;
	if (sentenceLens.length > 4) {
		const mean = sentenceLens.reduce((a, b) => a + b, 0) / sentenceLens.length;
		const sd = Math.sqrt(sentenceLens.reduce((a, l) => a + (l - mean) ** 2, 0) / sentenceLens.length);
		s.sentenceCv = round1(sd / mean);
	}
	s.aiHits = s.flagged.length;
	s.aiCost = round1(s.aiCost);
	const opener = flat.find((b) => b.kind === 'p');
	s.openerWords = words(plain(opener?.html));
	const closer = [...flat].reverse().find((b) => b.kind === 'p');
	s.boldCloser = !!closer && /^\s*<b>/.test(closer.html || '');
	const overlay = notes.episodes?.[entry.title] ?? notes.episodes?.[entry.id] ?? {};
	const arc = arcOf(entry.blocks ?? [], overlay);
	s.outline = arc.outline;
	s.beats = arc.beats;
	return s;
}

/* ——— length allocation + tension ——— */

function blockWords(b) {
	if (b.kind === 'dialogue' && Array.isArray(b.en)) return words(b.en.map(plain).filter(Boolean).join(' '));
	if (b.kind !== 'quote' && (b.html || b.text)) return words(plain(b.html || b.text));
	return 0;
}

function packNode(kind, label, ko, at = 0) {
	const n = { kind, label: String(label || '').trim() || kind, words: 0, at, kids: [] };
	if (ko) n.ko = ko;
	return n;
}

function compactNode(n) {
	const out = { kind: n.kind, label: n.label, words: n.words, at: n.at ?? 0 };
	if (n.ko) out.ko = n.ko;
	if (n.implicit) out.implicit = true;
	const kids = (n.kids ?? []).filter((k) => k.words > 0).map(compactNode);
	if (kids.length) out.kids = kids;
	return out;
}

function extrasOf(b) {
	const x = { dialogue: 0, questions: 0, interrupts: 0, battle: 0, place: 0 };
	if (b.kind === 'battle') x.battle = 1;
	if (PLACES.has(b.kind)) x.place = 1;
	if (b.kind === 'dialogue' && Array.isArray(b.en)) {
		const en = b.en.map(plain).filter(Boolean);
		x.dialogue = words(en.join(' '));
		for (const line of en) {
			if (/\?/.test(line)) x.questions++;
			if (/[—–]\s*$|…|\.\.\./.test(line)) x.interrupts++;
		}
	}
	return x;
}

const TENSION_HIGH =
	/\b(battle|war|duel|siege|assault|ambush|kill|killed|death|dies|fallen|fall of|pyre|blood|fire|drown|execution|last stand|charge|rebellion|coup|knife|weeps|unmask|cellar|reeds)\b/i;
const TENSION_MID =
	/\b(surrender|council|vote|throne|crown|wedding|kiss|oath|trial|betray|love|well|night|storm|letter|secret|dream|ghost|bridge)\b/i;
const TENSION_LOW = /\b(childhood|courtyard|garden|tea|breakfast|lesson|yard|school|morning|walk|room|supper)\b/i;

function tensionOf(beat, flags = {}) {
	if (flags.start) return 0;
	if (flags.climax) return 96;
	if (typeof flags.hint === 'number') return clamp(Math.round(flags.hint), 0, 100);
	let t = 16;
	const w = beat.words || 1;
	t += ((100 * (beat.dialogue || 0)) / w - 28) * 0.28;
	t += Math.min(18, (beat.questions || 0) * 2);
	t += Math.min(14, (beat.interrupts || 0) * 2.2);
	t += (beat.battle || 0) * 22;
	t += (beat.place || 0) * 3;
	if (beat.kind === 'flashback') t += 6;
	const label = beat.label || '';
	if (TENSION_HIGH.test(label)) t += 28;
	else if (TENSION_MID.test(label)) t += 12;
	else if (TENSION_LOW.test(label)) t -= 6;
	if (/†/.test(label)) t += 16;
	return Math.round(clamp(t, 0, 96));
}

function findScene(scenes, ev) {
	const key = norm(ev.scene || ev.at || ev.label || '');
	if (!key) return null;
	const hits = scenes.filter((s) => {
		const n = norm(s.label);
		return n === key || n.includes(key) || key.includes(n);
	});
	if (!hits.length) return null;
	return ev.last ? hits.at(-1) : hits[0];
}

function pickEvents(scenes, overlay) {
	const authored = overlay.events ?? [];
	if (authored.length) {
		const out = [];
		for (const ev of authored) {
			const hit = findScene(scenes, ev);
			if (!hit) continue;
			out.push({
				...hit,
				label: ev.label || hit.label,
				kind: 'event',
				climax: !!ev.climax,
				start: ev.tension === 0 || !!ev.start,
				hint: ev.tension
			});
		}
		return out;
	}
	const picked = [];
	const seen = new Set();
	const add = (s, extra = {}) => {
		if (!s) return;
		const id = `${s.at}:${s.label}`;
		const prev = picked.find((p) => `${p.at}:${p.label}` === id);
		if (prev) {
			Object.assign(prev, extra);
			return;
		}
		seen.add(id);
		picked.push({ ...s, kind: 'event', ...extra });
	};
	const byStory = new Map();
	for (const s of scenes) {
		const key = s.story || s.section || '';
		if (!byStory.has(key)) byStory.set(key, s);
	}
	for (const first of byStory.values()) add(first, { start: true });
	for (const s of scenes) {
		if (TENSION_HIGH.test(s.label) || /†/.test(s.label)) add(s);
	}
	const climaxText = String(overlay.climax || '');
	if (climaxText) {
		const hit =
			findScene(scenes, { scene: climaxText, last: true }) ||
			scenes.reduce((best, s) => {
				const score = TENSION_HIGH.test(s.label) ? s.at : -1;
				return score > (best?.at ?? -1) ? s : best;
			}, null);
		if (hit) add(hit, { climax: true });
	}
	if (scenes.length) add(scenes.at(-1));
	picked.sort((a, b) => a.at - b.at);
	if (picked.length <= 16) return picked;
	const keep = picked.filter((p) => p.start || p.climax);
	const rest = picked.filter((p) => !p.start && !p.climax);
	const budget = Math.max(0, 16 - keep.length);
	const step = rest.length / Math.max(1, budget);
	const sampled = rest.filter((_, i) => Math.floor(i / step) !== Math.floor((i - 1) / step)).slice(0, budget);
	return [...keep, ...sampled].sort((a, b) => a.at - b.at);
}

/** Section → story → scene. Stories live inside their section; a section with no story header is its own story. */
function arcOf(blocks, overlay = {}) {
	const root = packNode('root', '');
	let section = null;
	let story = null;
	let scene = null;
	const beats = [];
	let beat = null;
	let at = 0;

	function startBeat(kind, label, extra = {}) {
		if (beat && beat.words === 0) {
			beat.kind = kind;
			beat.label = label;
			Object.assign(beat, extra);
			return;
		}
		if (beat) beats.push(beat);
		beat = {
			kind,
			label,
			words: 0,
			at,
			dialogue: 0,
			questions: 0,
			interrupts: 0,
			battle: 0,
			place: 0,
			section: section?.label ?? '',
			story: story?.label ?? '',
			...extra
		};
	}

	function addWords(w, extra) {
		if (w && !scene && !story && !section) {
			scene = packNode('scene', 'Opening', undefined, at);
			root.kids.push(scene);
			if (!beat) startBeat('scene', 'Opening');
		}
		if (w) {
			root.words += w;
			if (section) section.words += w;
			if (story) story.words += w;
			if (scene) scene.words += w;
			if (!beat) startBeat(scene?.kind ?? 'scene', scene?.label ?? 'Opening');
			beat.words += w;
			at += w;
		}
		if (beat && extra) {
			beat.dialogue += extra.dialogue || 0;
			beat.questions += extra.questions || 0;
			beat.interrupts += extra.interrupts || 0;
			beat.battle += extra.battle || 0;
			beat.place += extra.place || 0;
		}
	}

	function feed(list) {
		for (const b of list ?? []) {
			if (b.kind === 'flashback') feed(b.blocks ?? []);
			else addWords(blockWords(b), extrasOf(b));
		}
	}

	function walk(list) {
		for (const b of list ?? []) {
			if (b.kind === 'section') {
				section = packNode('section', b.label, b.ko, at);
				scene = null;
				root.kids.push(section);
				story = packNode('story', section.label, section.ko, at);
				story.implicit = true;
				section.kids.push(story);
				continue;
			}
			if (b.kind === 'story') {
				if (story && story.implicit && story.words === 0 && section) {
					section.kids = section.kids.filter((k) => k !== story);
				}
				story = packNode('story', b.label, b.ko, at);
				(section || root).kids.push(story);
				scene = null;
				continue;
			}
			if (b.kind === 'scene' || b.kind === 'day') {
				scene = packNode(b.kind, b.label, b.ko, at);
				(story || section || root).kids.push(scene);
				startBeat(b.kind, scene.label);
				continue;
			}
			if (b.kind === 'flashback') {
				const hold = scene;
				const fb = packNode('flashback', b.title || 'Flashback', b.ko, at);
				(scene || story || section || root).kids.push(fb);
				startBeat('flashback', fb.label);
				scene = fb;
				feed(b.blocks ?? []);
				scene = hold;
				if (scene) scene.words += fb.words;
				startBeat(
					scene?.kind ?? 'scene',
					scene?.label ?? story?.label ?? section?.label ?? 'Opening'
				);
				continue;
			}
			addWords(blockWords(b), extrasOf(b));
		}
	}

	walk(blocks);
	if (beat) beats.push(beat);
	if (!root.kids.length && root.words) {
		const opening = packNode('scene', 'Opening', undefined, 0);
		opening.words = root.words;
		root.kids.push(opening);
	}

	const scenes = beats.filter((b) => b.words > 0 && (b.kind === 'scene' || b.kind === 'day' || b.kind === 'flashback'));
	const events = pickEvents(scenes, overlay);
	const used = new Set();
	const series = events.map((ev) => {
		const key = `${ev.at}:${ev.label}`;
		used.add(`${ev.at}`);
		return {
			label: ev.label,
			kind: ev.kind || 'event',
			words: ev.words,
			at: ev.at,
			tension: tensionOf(ev, { start: ev.start, climax: ev.climax, hint: ev.hint }),
			climax: !!ev.climax,
			start: !!ev.start
		};
	});
	if (!series.some((b) => b.climax) && series.length) {
		let peak = series[0];
		for (const b of series) {
			if (b.tension > peak.tension && !b.start) peak = b;
		}
		if (peak.tension >= 70) peak.climax = true;
	}
	void used;
	return { outline: root.kids.filter((k) => k.words > 0).map(compactNode), beats: series };
}

const READERS = ['A later class', 'Someone in the cheap seats', 'The desk', 'After the second cup', 'A clerk who stayed'];

function collect(nodes, kind, out = []) {
	for (const n of nodes ?? []) {
		if (n.kind === kind) out.push(n);
		collect(n.kids, kind, out);
	}
	return out;
}

function reviewsOf(title, outline, s, metrics, grade, composite) {
	const total = s.words || 1;
	const sections = collect(outline, 'section');
	const stories = collect(outline, 'story');
	const biggest = [...sections, ...stories].sort((a, b) => b.words - a.words)[0];
	const share = (n) => Math.round((100 * n.words) / total);
	const weakest = [...Object.entries(metrics)].filter(([, v]) => v != null).sort((a, b) => a[1] - b[1])[0];
	const pool = [];
	const add = (lean, text, weight) => {
		if (text) pool.push({ lean, text, weight });
	};

	if (grade === 'A') add('up', 'It finishes. Beginning, middle, end — and you actually care who walks out.', 9);
	if (grade === 'B') add('up', 'The bones of a story are here. One more turn of the screw and it would land.', 6);
	if (grade === 'C') add('down', 'A lecture with a name on it. Nobody wants anything yet.', 9);
	if (s.dialoguePct >= 38 && s.speakers >= 4)
		add('up', `The mouths do the walking. ${s.speakers} people talk, and they interrupt each other.`, 8);
	if (s.dialoguePct < 18) add('down', `The narrator is doing too much of the walking. ${s.dialoguePct}% talk is a chronicle, not a scene.`, 8);
	if (s.words < 800) add('down', 'A fragment. One scene pretending to be an episode.', 10);
	if (s.words > 6000) add('down', 'Long enough to live in. Also long enough to lose the thread.', 7);
	if (biggest && share(biggest) >= 45 && (sections.length > 1 || stories.length > 1))
		add('down', `${biggest.label} takes almost half the page. The rest of the life gets a corridor.`, 8);
	if (sections.length >= 2) {
		const parts = sections.map((n) => `${n.label} ${share(n)}%`).join(', ');
		add('up', `The life splits cleanly: ${parts}. You can feel the years change register.`, 8);
	}
	if (stories.length >= 4) add('up', `${stories.length} named stories, and you can point to each one afterwards.`, 5);
	if ((metrics.entertainment ?? 0) >= 55) add('up', 'Questions get answers. That is rarer than it should be.', 7);
	if ((metrics.entertainment ?? 0) < 28) add('down', "Nobody is trying to win a conversation. The air doesn't move.", 8);
	if ((metrics.human ?? 0) < 40) add('down', "The sentences know they're being watched.", 8);
	if ((metrics.human ?? 0) >= 70 && !s.aiHits) add('up', "It doesn't sound like a model covering itself.", 6);
	if ((s.grip ?? 0) >= 65) add('up', 'People cut each other off. That is a scene.', 7);
	if (s.telegrams > 2) add('down', 'Too many lines that could be an image caption.', 6);
	if (s.speeches > 3) add('down', 'Someone is reading a position paper. Interrupt them.', 7);
	if (s.wordsPerScene > 900) add('down', 'Scenes overstay. Cut sooner.', 6);
	if (s.scenes >= 6 && s.wordsPerScene >= 220 && s.wordsPerScene <= 520)
		add('up', "The cuts land. You always know which room you're in.", 6);
	if (s.openerWords && s.openerWords <= 8) add('up', 'It opens like a person talking, not a date stamp.', 5);
	if (s.speakers <= 1 && s.words > 600) add('down', 'A monologue with scenery. Give someone else a line.', 7);
	if (weakest && weakest[1] < 40 && composite >= 55)
		add('down', `${weakest[0][0].toUpperCase()}${weakest[0].slice(1)} is the leak. The rest of ${title} is holding.`, 5);
	if (grade === 'A' && (metrics.pacing ?? 100) < 40)
		add('down', 'The story is whole. The scenes still bunch, then starve.', 6);

	pool.sort((a, b) => b.weight - a.weight);
	const picked = [];
	const wantDown = composite < 58 || grade === 'C' ? 2 : 1;
	const wantUp = 3 - wantDown;
	for (const n of pool) {
		if (picked.length >= 3) break;
		const ups = picked.filter((p) => p.lean === 'up').length;
		const downs = picked.filter((p) => p.lean === 'down').length;
		if (n.lean === 'up' && ups >= wantUp) continue;
		if (n.lean === 'down' && downs >= wantDown) continue;
		if (picked.some((p) => p.text === n.text)) continue;
		picked.push(n);
	}
	if (!picked.some((p) => p.lean === 'down') && pool.find((p) => p.lean === 'down')) {
		const d = pool.find((p) => p.lean === 'down');
		if (picked.length >= 3) picked.pop();
		picked.push(d);
	}
	if (!picked.length) {
		picked.push({
			lean: composite >= 60 ? 'up' : 'down',
			text: composite >= 60 ? 'Solid work. It does what it came to do.' : 'Thin. Come back when someone wants something.'
		});
	}
	return picked.slice(0, 3).map((n, i) => ({ lean: n.lean, by: READERS[i % READERS.length], text: n.text }));
}

/** Curved scores from raw stats. Pure: re-run on every episode each time. */
function score(s, grade) {
	const total = s.words;
	const dialoguePct = total ? (100 * s.dialogue) / total : 0;
	const narrationPct = total ? 100 - dialoguePct : 0;
	const stillsPerK = total ? (1000 * s.images) / total : 0;
	const widgetsPerK = total ? (1000 * s.widgets) / total : 0;
	const n = s.scenes || 1;
	const meanScene = s.sceneWords.length ? s.sceneWords.reduce((a, b) => a + b, 0) / s.sceneWords.length : total;
	const sd = s.sceneWords.length ? Math.sqrt(s.sceneWords.reduce((a, w) => a + (w - meanScene) ** 2, 0) / s.sceneWords.length) : 0;
	const sceneCv = meanScene ? sd / meanScene : 0;
	const ratio = (k) => (s.lines ? s[k] / s.lines : 0);

	const pacing =
		0.5 * band(meanScene, 300, 650, 700) +
		0.25 * band(sceneCv, 0.3, 0.8, 0.8) +
		0.25 * band(total ? s.switches / Math.max(4, n * 2.5) : 0, 0.5, 1.3, 1);

	const hook = !s.openerWords ? 0 : s.openerWords <= 12 ? 100 : s.openerWords <= 22 ? 60 : 25;
	const entertainment =
		0.25 * band(dialoguePct, 35, 60, 35) +
		0.15 * band(100 * ratio('questions'), 18, 45, 30) +
		0.1 * band(100 * ratio('interrupts'), 10, 35, 25) +
		0.12 * band(s.speakers, 3, 9, 6) +
		0.12 * hook +
		0.1 * (s.boldCloser ? 100 : 0) +
		0.16 * band(stillsPerK, 3, 10, 8);

	const balance =
		0.4 * band(dialoguePct, 30, 55, 35) +
		0.3 * band(stillsPerK, 3, 9, 8) +
		0.3 * band(widgetsPerK, 0.8, 4, 4);

	let grip = null;
	if (s.lines >= 6) {
		grip = clamp(
			100 *
				(0.35 +
					0.7 * ratio('interrupts') +
					0.5 * ratio('questions') +
					0.3 * ratio('shortLines') -
					1.2 * ratio('telegrams') -
					0.6 * (s.speeches / Math.max(1, s.dialogueBlocks)))
		);
	}
	const completeness = grade ? 0.7 * GRADE[grade] + 0.3 * (grip ?? GRADE[grade]) : grip == null ? null : 0.85 * grip;

	/** Weighted tells per thousand words; ~0 is clean, 6+ reads machine-made. */
	const aiPerK = total ? (1000 * (s.aiCost + 1.5 * s.telegrams + 1.5 * s.speeches)) / total : 0;
	const uniform = s.sentences > 8 ? band(s.sentenceCv, 0.55, 2, 0.4) : 100;
	const human = clamp(100 * Math.exp(-aiPerK / 7)) * (0.8 + 0.2 * (uniform / 100));

	const accuracy = clamp(80 + Math.min(s.quotes, 3) * 5 - 15 * s.adInMouth - 10 * s.kingNos - 6 * s.glosses);

	const raw = { pacing, entertainment, balance, completeness, human, accuracy };
	const metrics = Object.fromEntries(METRICS.map((k) => [k, curve(raw[k])]));
	let weight = 0;
	let sum = 0;
	for (const k of COUNTED) {
		if (metrics[k] == null) continue;
		weight += WEIGHTS[k];
		sum += WEIGHTS[k] * metrics[k];
	}
	return {
		metrics,
		composite: weight ? Math.round(sum / weight) : 0,
		derived: {
			dialoguePct: Math.round(dialoguePct),
			narrationPct: Math.round(narrationPct),
			stillsPerK: round1(stillsPerK),
			widgetsPerK: round1(widgetsPerK),
			wordsPerScene: Math.round(total / n),
			aiPerK: round1(aiPerK),
			grip: grip == null ? null : Math.round(grip),
			minutes: Math.max(1, Math.round(total / 230))
		}
	};
}

/* ——— run ——— */

const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const fresh = cache.version === VERSION ? cache.episodes ?? {} : {};
const before = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { episodes: {} };
const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
const nextCache = {};
const episodes = {};
const remeasured = [];
const moved = [];

let n = 0;
for (const chapter of story) {
	for (const entry of chapter.entries ?? []) {
		const id = `${chapter.id}::${entry.title}`;
		const overlay = notes.episodes?.[entry.title] ?? {};
		const finger = hashOf({
			blocks: entry.blocks ?? [],
			images: (entry.images ?? []).map((im) => [im.id, !!im.nsfw]),
			seq: (entry.movieSequences ?? []).length,
			events: overlay.events ?? [],
			climax: overlay.climax ?? ''
		});
		const hit = fresh[id]?.finger === finger ? fresh[id].stats : null;
		const stats = hit ?? measure(entry);
		if (!hit) remeasured.push(entry.title);
		nextCache[id] = { finger, stats };
		const grade = audits.get(norm(entry.title)) ?? null;
		const { metrics, composite, derived } = score(stats, grade);
		const { sceneWords, flagged, outline, beats, ...counts } = stats;
		const merged = { ...counts, ...derived };
		const was = before.episodes?.[id];
		const changed = !was || was.composite !== composite || was.stats?.words !== counts.words;
		episodes[id] = {
			n,
			id,
			arc: chapter.title,
			chapter: chapter.id,
			title: entry.title,
			ko: entry.subtitle ?? '',
			year: String(entry.year ?? ''),
			grade,
			stats: merged,
			outline: outline ?? [],
			beats: beats ?? [],
			reviews: reviewsOf(entry.title, outline ?? [], merged, metrics, grade, composite),
			flagged,
			metrics,
			composite,
			updated: changed ? now : (was.updated ?? now)
		};
		if (was && was.composite !== composite) moved.push(`${entry.title} ${was.composite}→${composite}`);
		n++;
	}
}

/* Rank on every score so the page can show place as well as value. */
const list = Object.values(episodes);
for (const key of ['composite', ...METRICS]) {
	const val = (e) => (key === 'composite' ? e.composite : e.metrics[key] ?? -1);
	[...list].sort((a, b) => val(b) - val(a)).forEach((e, i) => ((e.ranks ??= {})[key] = i + 1));
}

const mean = (vals) => (vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0);
const avg = (key) => mean(list.map((e) => (key === 'composite' ? e.composite : e.metrics[key])).filter((v) => v != null));
const sumOf = (k) => list.reduce((a, e) => a + (e.stats[k] ?? 0), 0);
const grades = { A: 0, B: 0, C: 0, ungraded: 0 };
for (const e of list) grades[e.grade ?? 'ungraded']++;
const byMetric = Object.fromEntries(METRICS.map((k) => [k, avg(k)]));
const weakest = [...COUNTED].sort((a, b) => byMetric[a] - byMetric[b])[0];
const composites = list.map((e) => e.composite).sort((a, b) => a - b);

const arcs = [];
for (const chapter of story) {
	const rows = list.filter((e) => e.chapter === chapter.id);
	if (!rows.length) continue;
	arcs.push({
		id: chapter.id,
		title: chapter.title,
		episodes: rows.length,
		words: rows.reduce((a, e) => a + e.stats.words, 0),
		composite: mean(rows.map((e) => e.composite))
	});
}

const book = {
	episodes: list.length,
	composite: avg('composite'),
	median: composites[composites.length >> 1] ?? 0,
	spread: [composites[0] ?? 0, composites.at(-1) ?? 0],
	metrics: byMetric,
	weakest,
	grades,
	totals: Object.fromEntries(
		['words', 'narration', 'dialogue', 'koChars', 'lines', 'images', 'widgets', 'quotes', 'flashbacks', 'scenes', 'speakers', 'aiHits'].map((k) => [k, sumOf(k)])
	),
	arcs
};

fs.mkdirSync('scripts/.cache', { recursive: true });
fs.writeFileSync(CACHE, JSON.stringify({ version: VERSION, episodes: nextCache }));
fs.writeFileSync(
	OUT,
	JSON.stringify({ generated: now, metrics: METRICS, counted: COUNTED, weights: WEIGHTS, curve: CURVE, book, episodes }, null, '\t') + '\n'
);

if (!quiet || moved.length || remeasured.length) {
	console.log(
		`Dashboard: ${list.length} episodes · book ${book.composite} (range ${book.spread[0]}–${book.spread[1]}) · weakest ${weakest} ${byMetric[weakest]} · ${remeasured.length} re-read` +
			(moved.length ? ` · moved: ${moved.slice(0, 8).join(', ')}${moved.length > 8 ? ` +${moved.length - 8}` : ''}` : '')
	);
}
