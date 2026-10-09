// Read-only: `node dialect-01-14-dump.mjs` prints every block of #1–#14 with path, speaker kingdom and image anchors.
import fs from 'node:fs';
import path from 'node:path';
import { loadStory, ROOT } from '../story-ops.mjs';

const [lo = 1, hi = 14] = process.argv.slice(2).map(Number);
const src = fs.readFileSync(path.join(ROOT, 'src/lib/people.ts'), 'utf8');
const ids = [...src.matchAll(/^\t\tid:\s*'([^']+)'/gm)];
const kingdom = new Map();
ids.forEach((m, i) => {
	const k = src.slice(m.index, ids[i + 1]?.index ?? src.length).match(/\bkingdom:\s*'([^']+)'/)?.[1];
	if (k && !kingdom.has(m[1])) kingdom.set(m[1], k);
});
const strip = (s = '') => s.replace(/<[^>]+>/g, '');

function render(b, p, out) {
	if (b.kind === 'p') out.push(`[${p}] ¶ ${strip(b.html).slice(0, 200)}`);
	else if (b.kind === 'dialogue')
		out.push(
			`[${p}] ${b.person ?? '-'}{${kingdom.get(b.person) ?? '?'}}${b.look ? `(${b.look})` : ''}${b.speaker ? ` "${b.speaker}"` : ''}:\n` +
				b.en.map((l, i) => `   ${i}| ${l}\n    | ${b.lines[i]}`).join('\n')
		);
	else if (b.kind === 'flashback') {
		out.push(`[${p}] FLASHBACK ${b.label ?? ''} ${b.year ?? ''}`);
		(b.blocks ?? []).forEach((c, i) => render(c, `${p}.${i}`, out));
	} else out.push(`[${p}] <${b.kind}> ${strip(b.label ?? b.html ?? '').slice(0, 80)}`);
}

loadStory()
	.flatMap((c) => c.entries)
	.forEach((e, k) => {
		if (k + 1 < lo || k + 1 > hi) return;
		const out = [`\n######## #${k + 1} ${e.title} (${e.year})`];
		e.blocks.forEach((b, i) => render(b, String(i), out));
		for (const im of e.images ?? []) if (im.at) out.push(`  @${im.id}: ${im.at}`);
		console.log(out.join('\n'));
	});
