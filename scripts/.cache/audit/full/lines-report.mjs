/**
 * Writes the "First and last lines" section of AUDIT.md from lines-before.json (+ lines.json and
 * `after` grades in lines-grades.json once the rewrite lands). Re-run after `node lines.mjs`.
 */
import fs from 'node:fs';

const here = new URL('.', import.meta.url).pathname;
const read = (f) => JSON.parse(fs.readFileSync(here + f, 'utf8'));
const before = read('lines-before.json');
const now = fs.existsSync(here + 'lines.json') ? read('lines.json') : before;
const grades = read('lines-grades.json');
const byN = (rows) => new Map(rows.map((r) => [r[0], r]));
const gb = byN(grades.before);
const ga = byN(grades.after ?? []);
const POINTS = { A: 4, B: 3, C: 2, D: 1, F: 0 };
const cut = (s = '', n = 90) => (s.length > n ? s.slice(0, n - 1) + '…' : s).replace(/\|/g, '/');

const tally = (map, col) => {
	const t = { A: 0, B: 0, C: 0, D: 0, F: 0 };
	for (const r of map.values()) t[r[col]]++;
	const gpa = [...map.values()].reduce((s, r) => s + POINTS[r[col]], 0) / (map.size || 1);
	return `${Object.entries(t).map(([k, v]) => `${k} ${v}`).join(' · ')} (average ${gpa.toFixed(2)} of 4)`;
};

const out = [
	'## First and last lines',
	'',
	grades.scale,
	'',
	`**Before the rewrite.** First lines: ${tally(gb, 1)}. Last lines: ${tally(gb, 3)}.`
];
if (ga.size) out.push(`**After the rewrite.** First lines: ${tally(ga, 1)}. Last lines: ${tally(ga, 3)}.`);
out.push('', '| # | Episode | First line | Grade | Closing card | Grade |', '|---|---|---|---|---|---|');
for (const r of now) {
	const b = gb.get(r.n);
	const a = ga.get(r.n);
	const grade = (i) => (a ? `${b[i]} → **${a[i]}**` : b[i]);
	out.push(`| ${r.n} | ${r.title} | ${cut(r.first?.en)} | ${grade(1)} | ${cut(r.last?.en)} | ${grade(3)} |`);
}
out.push('', '**Notes on the grades below C (before)**', '');
for (const r of gb.values())
	if ('CDF'.includes(r[1]) || 'CDF'.includes(r[3]))
		out.push(`- #${r[0]}: ${'CDF'.includes(r[1]) ? `first ${r[1]}, ${r[2]}` : ''}${'CDF'.includes(r[1]) && 'CDF'.includes(r[3]) ? ' ' : ''}${'CDF'.includes(r[3]) ? `last ${r[3]}, ${r[4]}` : ''}`);
out.push('');

const audit = fs.readFileSync(here + 'AUDIT.md', 'utf8');
const section = out.join('\n');
const re = /## First and last lines[\s\S]*?(?=\n## )/;
fs.writeFileSync(
	here + 'AUDIT.md',
	re.test(audit) ? audit.replace(re, section) : audit.replace('\n## Protect these', '\n' + section + '\n## Protect these')
);
console.log('AUDIT.md lines section:', now.length, 'episodes');

const CANVAS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/canvases/script-audit.canvas.tsx';
const rows = now.map((r) => {
	const b = gb.get(r.n);
	const a = ga.get(r.n) ?? b;
	return [r.n, cut(r.first?.en, 140), a[1], cut(r.last?.en, 140), a[3], [a[2], a[4]].join(' '), b[1], b[3]];
});
const block = [
	'// LINES:start',
	'const LINES: Line[] = [',
	...rows.map((r) => '  ' + JSON.stringify(r) + ','),
	'];',
	`const LINES_AFTER = ${ga.size > 0};`,
	'// LINES:end'
].join('\n');
const canvas = fs.readFileSync(CANVAS, 'utf8');
fs.writeFileSync(CANVAS, canvas.replace(/\/\/ LINES:start[\s\S]*?\/\/ LINES:end/, block));
console.log('canvas LINES:', rows.length);
