// node scripts/episode-tracker.mjs [--full] [--canvas]
// Episode quality + length tracker: the A/B/C completeness audit in
// scripts/.cache/audit/episode-audit.md joined with live metrics from
// src/lib/data/story.json.
//   (default)  compact summary for the end of every agent response
//   --full     every episode as a markdown table
//   --canvas   rewrite the Cursor canvas (tables, rankings, full audit notes)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const AUDIT = 'scripts/.cache/audit/episode-audit.md';
const CANVAS = path.join(
	os.homedir(),
	'.cursor/projects/Users-heewon-Documents-GitHub-kingdom/canvases/episode-tracker.canvas.tsx'
);
const args = new Set(process.argv.slice(2));

/** Below this an episode reads as a fragment; above the upper bound it drags. */
const SHORT = 800;
const LONG = 6000;

/** Audit titles that were renamed in the book since the audit ran. */
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

/** Edit distance, for titles whose spelling drifted by a letter or two. */
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

/* ————— the audit: one record per `### n. Title (year)` section ————— */
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

/** Each audit record goes to one episode: exact (or aliased) titles first, then near spellings among the rest. */
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

/* ————— live metrics from the book ————— */
const strip = (s) => String(s ?? '').replace(/<[^>]+>/g, ' ');
const words = (s) => s.split(/\s+/).filter(Boolean).length;

function measure(blocks, acc = { narration: 0, dialogue: 0, lines: 0, quotes: 0, flash: 0 }) {
	for (const b of blocks ?? []) {
		if (b.kind === 'quote') acc.quotes++;
		else if (b.kind === 'flashback') acc.flash++;
		if (b.blocks) measure(b.blocks, acc);
		if (b.kind === 'dialogue' && Array.isArray(b.en)) {
			acc.dialogue += words(b.en.join(' '));
			acc.lines += b.en.length;
		} else if (b.kind !== 'quote' && (b.html || b.text)) {
			acc.narration += words(strip(b.html || b.text));
		}
	}
	return acc;
}

const rows = [];
story.forEach((c) =>
	c.entries.forEach((e) => {
		if (e.hidden) return;
		const m = measure(e.blocks);
		const total = m.narration + m.dialogue;
		const images = (e.images ?? []).length;
		const a = auditFor(e.title);
		rows.push({
			n: rows.length,
			arc: c.title,
			title: e.title,
			ko: e.subtitle ?? '',
			year: String(e.year ?? ''),
			words: total,
			dialoguePct: total ? Math.round((m.dialogue / total) * 100) : 0,
			lines: m.lines,
			quotes: m.quotes,
			images,
			stillsPerK: total ? Math.round((images / total) * 10000) / 10 : 0,
			grade: a?.grade ?? '–',
			audit: a
				? {
						no: a.auditNo,
						title: a.auditTitle,
						want: a.want ?? '',
						conflict: a.conflict ?? '',
						shape: a.shape ?? '',
						problem: a.problem ?? '',
						suggestion: a.suggestion ?? ''
					}
				: null
		});
	})
);

const flag = (r) => (r.words < SHORT ? 'short' : r.words > LONG ? 'long' : '');
const total = rows.reduce((s, r) => s + r.words, 0);
const median = [...rows].sort((a, b) => a.words - b.words)[rows.length >> 1].words;
const count = (g) => rows.filter((r) => r.grade === g).length;

if (args.has('--full')) {
	console.log('| # | Episode | Grade | Words | Dialogue | Stills | Flag |');
	console.log('|---|---|---|---|---|---|---|');
	for (const r of rows)
		console.log(`| ${r.n} | ${r.title} | ${r.grade} | ${r.words} | ${r.dialoguePct}% | ${r.images} | ${flag(r)} |`);
}

const cs = rows.filter((r) => r.grade === 'C');
const short = rows.filter((r) => r.words < SHORT).sort((a, b) => a.words - b.words);
const long = rows.filter((r) => r.words > LONG).sort((a, b) => b.words - a.words);
const list = (rs) => rs.map((r) => `${r.n} ${r.title} (${r.words}w)`).join(', ') || 'none';

console.log(`Episodes: ${rows.length} · ${total.toLocaleString('en-US')} words · median ${median}w`);
console.log(`Grades: A ${count('A')} · B ${count('B')} · C ${count('C')} · ungraded ${count('–')}`);
console.log(`C (needs work): ${list(cs)}`);
console.log(`Short (<${SHORT}w): ${list(short)}`);
console.log(`Long (>${LONG}w): ${list(long)}`);

/* New character portraits join the profile galleries' index. */
try {
	const line = execFileSync('node', ['scripts/portrait-index.mjs', '--quiet'], { encoding: 'utf8' }).trim();
	if (line) console.log(line);
} catch {}

/* Relationship health rides along: only scenes that changed since the last run are re-read. */
try {
	const line = execFileSync('node', ['scripts/relation-scores.mjs', '--quiet'], { encoding: 'utf8' }).trim();
	if (line) console.log(line);
} catch (err) {
	console.log(`Relationships: scoring failed (${err.message.split('\n')[0]})`);
}

/* Episode dashboard: only episodes whose text or stills changed are re-scored. */
try {
	const line = execFileSync('node', ['scripts/episode-scores.mjs', '--quiet'], { encoding: 'utf8' }).trim();
	if (line) console.log(line);
} catch (err) {
	console.log(`Dashboard: scoring failed (${err.message.split('\n')[0]})`);
}

function writeCanvas() {
	const data = {
		generated: new Date().toISOString().slice(0, 10),
		short: SHORT,
		long: LONG,
		total,
		median,
		rows
	};
	const src = CANVAS_TEMPLATE.replace('__DATA__', () => JSON.stringify(data));
	fs.writeFileSync(CANVAS, src);
}

const CANVAS_TEMPLATE = `// Generated by scripts/episode-tracker.mjs --canvas. Do not edit by hand; rerun the script.
import {
	BarChart,
	Callout,
	CollapsibleSection,
	Divider,
	Grid,
	H1,
	H2,
	Pill,
	Row,
	Stack,
	Stat,
	Table,
	Text,
	useCanvasState,
	useHostTheme
} from 'cursor/canvas';

type Audit = { no: number; title: string; want: string; conflict: string; shape: string; problem: string; suggestion: string };
type Ep = {
	n: number; arc: string; title: string; ko: string; year: string; words: number; dialoguePct: number;
	lines: number; quotes: number; images: number; stillsPerK: number; grade: string; audit: Audit | null;
};
type Data = { generated: string; short: number; long: number; total: number; median: number; rows: Ep[] };

const DATA: Data = __DATA__;

const GRADE_RANK: Record<string, number> = { A: 0, B: 1, C: 2, '–': 3 };

const METRICS = [
	{ id: 'order', label: 'Reading order', sort: (a: Ep, b: Ep) => a.n - b.n },
	{ id: 'grade', label: 'Grade (worst first)', sort: (a: Ep, b: Ep) => GRADE_RANK[b.grade] - GRADE_RANK[a.grade] || a.words - b.words },
	{ id: 'short', label: 'Shortest', sort: (a: Ep, b: Ep) => a.words - b.words },
	{ id: 'long', label: 'Longest', sort: (a: Ep, b: Ep) => b.words - a.words },
	{ id: 'dialogue', label: 'Least dialogue', sort: (a: Ep, b: Ep) => a.dialoguePct - b.dialoguePct },
	{ id: 'quotes', label: 'Most quote blocks', sort: (a: Ep, b: Ep) => b.quotes - a.quotes || a.n - b.n },
	{ id: 'stills', label: 'Fewest stills / 1k words', sort: (a: Ep, b: Ep) => a.stillsPerK - b.stillsPerK }
] as const;

const GRADES = ['all', 'A', 'B', 'C', '–'] as const;

const tone = (g: string) => (g === 'A' ? 'success' : g === 'C' ? 'danger' : g === 'B' ? 'info' : 'neutral');
const lengthFlag = (w: number) => (w < DATA.short ? 'short' : w > DATA.long ? 'long' : '');

export default function EpisodeTracker() {
	const theme = useHostTheme();
	const [metric, setMetric] = useCanvasState<string>('metric', 'order');
	const [grade, setGrade] = useCanvasState<string>('grade', 'all');

	const rows = DATA.rows;
	const by = (g: string) => rows.filter((r) => r.grade === g).length;
	const sorter = METRICS.find((m) => m.id === metric) ?? METRICS[0];
	const shown = rows.filter((r) => grade === 'all' || r.grade === grade).sort(sorter.sort);
	const audited = shown.filter((r) => r.audit);

	const arcs = [...new Set(rows.map((r) => r.arc))];
	const arcWords = arcs.map((a) => rows.filter((r) => r.arc === a).reduce((s, r) => s + r.words, 0));

	return (
		<Stack gap={20}>
			<Stack gap={4}>
				<H1>Episode tracker</H1>
				<Text tone="secondary" size="small">
					Completeness grades from the episode audit: A a self-contained story (beginning, middle, end, you care) · B a turn
					with a missing act · C fragment or exposition. Craft nits stay in the notes; they do not demote a finished story.
					Generated {DATA.generated}. Rerun node scripts/episode-tracker.mjs --canvas to refresh.
				</Text>
			</Stack>

			<Grid columns={6} gap={12}>
				<Stat value={rows.length} label="Episodes" />
				<Stat value={DATA.total.toLocaleString('en-US')} label="Words (EN, no quotes)" />
				<Stat value={DATA.median} label="Median words" />
				<Stat value={by('A')} label="Grade A" tone="success" />
				<Stat value={by('C')} label="Grade C" tone="danger" />
				<Stat value={by('–')} label="Ungraded" tone="warning" />
			</Grid>

			<Callout tone="info" title="What A means">
				A finished story: someone wants something, the middle costs them, an ending lands, and you care. Queen Sunduk, Prince
				Euija, Bidam’s four (Gi / Seung / Jeon / Gyul), Bihyung, and Yongsu are the calibration. Craft problems stay in the
				audit notes; they do not demote a story that already coheres.
			</Callout>

			<Divider />

			<Stack gap={10}>
				<H2>Ranking</H2>
				<Row gap={6} wrap>
					{METRICS.map((m) => (
						<Pill key={m.id} active={metric === m.id} onClick={() => setMetric(m.id)}>
							{m.label}
						</Pill>
					))}
				</Row>
				<Row gap={6} wrap>
					{GRADES.map((g) => (
						<Pill key={g} size="sm" active={grade === g} onClick={() => setGrade(g)}>
							{g === 'all' ? 'All grades' : g === '–' ? 'Ungraded' : 'Grade ' + g}
						</Pill>
					))}
				</Row>
				<Table
					stickyHeader
					striped
					headers={['Rank', '#', 'Episode', 'Arc', 'Grade', 'Words', 'Dialogue', 'Quotes', 'Stills', 'Stills / 1k', 'Flag']}
					columnAlign={['right', 'right', 'left', 'left', 'center', 'right', 'right', 'right', 'right', 'right', 'left']}
					rowTone={shown.map((r) => tone(r.grade))}
					rows={shown.map((r, i) => [
						i + 1,
						r.n,
						<span key="t">
							{r.title}
							{r.ko ? <span style={{ color: theme.text.tertiary }}> · {r.ko}</span> : null}
						</span>,
						r.arc,
						r.grade,
						r.words.toLocaleString('en-US'),
						r.dialoguePct + '%',
						r.quotes,
						r.images,
						r.stillsPerK,
						lengthFlag(r.words)
					])}
				/>
				<Text tone="tertiary" size="small">
					Dialogue = share of words spoken in dialogue blocks. Short &lt; {DATA.short} words, long &gt; {DATA.long}.
				</Text>
			</Stack>

			<Stack gap={10}>
				<H2>Words by arc</H2>
				<BarChart
					categories={arcs}
					series={[{ name: 'Words (EN)', data: arcWords }]}
					height={220}
					horizontal
				/>
				<Text tone="tertiary" size="small">Source: story.json · English narration and dialogue, quote blocks excluded.</Text>
			</Stack>

			<Divider />

			<Stack gap={10}>
				<H2>Audit notes</H2>
				<Text tone="secondary" size="small">
					The original audit entries, in the ranking above. Ungraded episodes were added or renamed after the audit.
				</Text>
				{audited.map((r) => (
					<CollapsibleSection
						key={r.n}
						title={r.n + '. ' + r.title + (r.year ? ' (' + r.year + ')' : '')}
						trailing={<Text size="small" tone="secondary">{'Grade ' + r.grade + ' · ' + r.words + 'w'}</Text>}
					>
						<Stack gap={6}>
							<Text size="small"><b>Protagonist / want:</b> {r.audit!.want}</Text>
							<Text size="small"><b>Conflict:</b> {r.audit!.conflict}</Text>
							<Text size="small"><b>Shape:</b> {r.audit!.shape}</Text>
							<Text size="small"><b>Problem:</b> {r.audit!.problem}</Text>
							<Callout tone="info" title="Suggestion">{r.audit!.suggestion}</Callout>
						</Stack>
					</CollapsibleSection>
				))}
			</Stack>
		</Stack>
	);
}
`;

if (args.has('--canvas')) {
	writeCanvas();
	console.log(`Canvas written: ${CANVAS}`);
}
