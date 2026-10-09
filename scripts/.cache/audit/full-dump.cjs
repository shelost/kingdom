// Read-only: prints the whole book in reading order as plain text for an audit.
// node scripts/.cache/audit/full-dump.cjs  →  scripts/.cache/audit/full/{ep/NN-slug.txt, slice-K.txt, first-seen.txt, stats.txt}
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../../..');
const story = require(path.join(ROOT, 'src/lib/data/story.json'));
const OUT = path.join(__dirname, 'full');
fs.mkdirSync(path.join(OUT, 'ep'), { recursive: true });

// id → display name and aliases, scraped from people.ts (two-tab fields of each record).
const NAMES = new Map();
const ALIASES = new Map();
{
	let id = null;
	for (const line of fs.readFileSync(path.join(ROOT, 'src/lib/people.ts'), 'utf8').split('\n')) {
		let m = line.match(/^\t\tid: '([^']+)'/);
		if (m) { id = m[1]; continue; }
		m = line.match(/^\t\tname: (['"])(.+?)\1,?$/);
		if (m && id && !NAMES.has(id)) NAMES.set(id, m[2]);
		m = line.match(/^\t\taliases: \[(.*)\]/);
		if (m && id) ALIASES.set(id, [...m[1].matchAll(/(['"])(.+?)\1/g)].map((x) => x[2]));
	}
}
const nameOf = (id) => NAMES.get(id) ?? id;

const decode = (s) =>
	String(s ?? '')
		.replace(/<\s*b\s*>/gi, '**').replace(/<\s*\/\s*b\s*>/gi, '**')
		.replace(/<\s*(i|em)\s*>/gi, '_').replace(/<\s*\/\s*(i|em)\s*>/gi, '_')
		.replace(/<br\s*\/?>/gi, ' / ')
		.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
		.replace(/\s+/g, ' ')
		.trim();

function render(b) {
	switch (b.kind) {
		case 'p': return `¶ ${decode(b.html)}`;
		case 'dialogue': {
			// The reader shows the person's name whenever there is one; `speaker` is only the fallback label.
			const who = b.person ? nameOf(b.person) : b.speaker || '?';
			return `${who}: ${(b.en ?? b.lines ?? []).map(decode).join(' / ')}`;
		}
		case 'monologue': return `(monologue) ${nameOf(b.person)}: ${decode(b.html)}`;
		case 'scene': return `── SCENE: ${b.label} ──`;
		case 'day': return `══ DAY: ${b.label} ══`;
		case 'quote': return `❝QUOTE${b.source ? ` (${decode(b.source)})` : ''}${b.person ? ` [${nameOf(b.person)}]` : ''}: ${decode(b.html)}❞`;
		case 'card': return `[CARD ${nameOf(b.person)}${b.role ? ` — ${decode(b.role)}` : ''}${b.caption ? `: ${decode(b.caption)}` : ''}]`;
		case 'term': return `[TERM ${b.term ?? ''}${b.hanja ? ` (${b.hanja})` : ''}: ${decode(b.html)}]`;
		case 'map': return `[MAP ${b.year ?? ''}${b.title ? ` ${decode(b.title)}` : ''}: ${decode(b.caption)}]`;
		case 'place': return `[PLACE ${b.place}: ${decode(b.html)}]`;
		case 'table': return `[TABLE ${(b.head ?? []).map(decode).join(' | ')} — ${(b.rows ?? []).length} rows: ${(b.rows ?? []).slice(0, 8).map((r) => (Array.isArray(r) ? r : Object.values(r)).map(decode).join(' | ')).join(' // ')}]`;
		case 'diagram': return `[DIAGRAM ${b.diagram}${b.step ? `:${b.step}` : ''}${b.title ? ` ${decode(b.title)}` : ''}${b.caption ? ` — ${decode(b.caption)}` : ''}]`;
		case 'hanja': return `[HANJA ${(b.chars ?? []).map((c) => c.char).join('')}${b.note ? `: ${decode(b.note)}` : ''}]`;
		case 'cite': return `[CITE ${decode(b.html)}]`;
		case 'verse': return `[VERSE ${(b.lines ?? []).map((l) => decode(typeof l === 'string' ? l : l.en ?? l.html ?? l.text)).join(' / ')}]`;
		case 'oath': case 'edict': case 'poem': case 'covenant':
			return `[${b.kind.toUpperCase()}${b.title ? ` ${decode(b.title)}` : ''}${b.person ? ` [${nameOf(b.person)}]` : ''}${b.source ? ` (${decode(b.source)})` : ''}: ${decode(b.html)}]`;
		case 'formation': return `[FORMATION ${decode(b.title)}${b.note ? `: ${decode(b.note)}` : ''}]`;
		case 'chengyu': return `[IDIOM ${b.hanja}: ${decode(b.html)}]`;
		case 'moral': return `[MORAL ${decode(b.label)}: ${decode(b.html)}]`;
		case 'omens': return `[OMENS ${decode(b.title)}: ${(b.omens ?? []).map((o) => decode(o.en ?? o.html ?? o.label ?? JSON.stringify(o))).join(' / ')}]`;
		case 'wed': return `[WEDDING ${(b.couple ?? []).map(nameOf).join(' + ')}]`;
		default: return `[${b.kind}]`;
	}
}

const words = (t) => t.split(/\s+/).filter(Boolean).length;
const slug = (t) => t.normalize('NFKD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').toLowerCase();

// Slices for parallel readers: [first, last] episode ordinals, inclusive.
const SLICES = [[1, 9], [10, 20], [21, 30], [31, 39], [40, 47], [48, 55], [56, 71], [72, 77], [78, 98]];

const firstSpoke = new Map();
const firstCard = new Map();
const firstNamed = new Map();
const statLines = [];
const slices = SLICES.map(() => []);
const corpusSoFar = [];
let n = 0;

story.forEach((ch, ci) => {
	ch.entries.forEach((e, ei) => {
		n++;
		const head = `\n=================================================================\n#${n} ${e.title}  (${e.year}${e.sub ? ' ' + e.sub : ''})${e.flash || e.flashback ? '  [FLASHBACK EPISODE]' : ''}\nArc: ${ch.part ? ch.part + ' — ' + (ch.partTitle ?? '') + ' / ' : ''}${ch.title}${e.place ? ' · place: ' + e.place : ''}${e.tone ? ' · tone: ' + e.tone : ''}\n${e.logline ? 'Logline: ' + e.logline.en + '\n' : ''}=================================================================`;
		const lines = [head];
		let w = 0, dlg = 0, prose = 0, records = 0;
		const walk = (blocks, prefix, depth) =>
			blocks.forEach((b, i) => {
				const idx = prefix + i;
				const text = render(b);
				if (b.kind === 'flashback') {
					lines.push(`${'    '.repeat(depth)}[${idx}] ▼ FLASHBACK ${b.year ?? ''} ${b.title ?? ''}`);
					walk(b.blocks ?? [], `${idx}.`, depth + 1);
					lines.push(`${'    '.repeat(depth)}[${idx}] ▲ end flashback`);
					return;
				}
				lines.push(`${'    '.repeat(depth)}[${idx}] ${text}`);
				const tw = words(text);
				w += tw;
				if (b.kind === 'dialogue' || b.kind === 'monologue') dlg += tw;
				else if (b.kind === 'p') prose += tw;
				else records += tw;
				const where = `#${n} ${e.title} [${idx}]`;
				if ((b.kind === 'dialogue' || b.kind === 'monologue') && b.person && !firstSpoke.has(b.person)) firstSpoke.set(b.person, where);
				if (b.kind === 'card' && b.person && !firstCard.has(b.person)) firstCard.set(b.person, where);
				for (const [id, nm] of NAMES) {
					if (firstNamed.has(id)) continue;
					const keys = [nm, ...(ALIASES.get(id) ?? [])].filter((k) => k && k.length > 2);
					const plainText = text.replace(/^[^:]*?: /, (m) => (b.kind === 'dialogue' ? '' : m));
					if (keys.some((k) => new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(plainText))) firstNamed.set(id, where);
				}
			});
		walk(e.blocks, '', 0);
		const body = lines.join('\n') + '\n';
		fs.writeFileSync(path.join(OUT, 'ep', `${String(n).padStart(2, '0')}-${slug(e.title)}.txt`), body);
		const s = SLICES.findIndex(([a, z]) => n >= a && n <= z);
		slices[s].push(body);
		statLines.push(`#${String(n).padStart(2)} ${(e.flash || e.flashback) ? 'F' : ' '} ${e.title.padEnd(28)} words ${String(w).padStart(5)} | dialogue ${Math.round((100 * dlg) / Math.max(w, 1))}% narration ${Math.round((100 * prose) / Math.max(w, 1))}% records ${Math.round((100 * records) / Math.max(w, 1))}%`);
	});
});

slices.forEach((parts, k) => fs.writeFileSync(path.join(OUT, `slice-${k + 1}.txt`), parts.join('')));
fs.writeFileSync(path.join(OUT, 'stats.txt'), statLines.join('\n') + '\n');

// Who speaks before the book has named or carded them.
const rows = [];
for (const [id, spoke] of firstSpoke) {
	const named = firstNamed.get(id);
	const card = firstCard.get(id);
	const ord = (w) => (w ? +w.match(/^#(\d+)/)[1] : Infinity);
	const blk = (w) => (w ? w.match(/\[([\d.]+)\]$/)[1] : '');
	const sameSpot = named === spoke || (ord(named) === ord(spoke) && blk(named) === blk(spoke));
	const flag = !named || ord(named) > ord(spoke) || sameSpot ? 'COLD' : '';
	rows.push(`${flag.padEnd(4)} ${nameOf(id).padEnd(24)} spoke ${spoke.padEnd(44)} named ${named ?? '-'}${card ? ` | card ${card}` : ''}`);
}
rows.sort((a, b) => +a.match(/spoke #(\d+)/)[1] - +b.match(/spoke #(\d+)/)[1]);
fs.writeFileSync(path.join(OUT, 'first-seen.txt'), rows.join('\n') + '\n');
console.log(`${n} episodes → ${OUT}`);
