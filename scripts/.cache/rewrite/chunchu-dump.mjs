// Read-only: `node chunchu-dump.mjs 47 [55]` prints episodes with block paths, EN + KO, and image anchors.
import { loadStory } from '../story-ops.mjs';

const [lo, hi = lo] = process.argv.slice(2).map(Number);
const all = loadStory().flatMap((c) => c.entries.map((e) => ({ ...e, chapter: c.id })));
const strip = (s = '') => s.replace(/<[^>]+>/g, '');
const words = (blocks) =>
	blocks.reduce((n, b) => n + (b.kind === 'flashback' ? words(b.blocks ?? []) : strip([b.html, ...(b.en ?? [])].filter(Boolean).join(' ')).split(/\s+/).filter(Boolean).length), 0);

function render(b, path, out) {
	if (b.kind === 'p') out.push(`[${path}] ¶ ${strip(b.html)}\n      KO ${strip(b.ko)}`);
	else if (b.kind === 'dialogue')
		out.push(`[${path}] ${b.person}${b.look ? `(${b.look})` : ''}${b.speaker ? ` "${b.speaker}"` : ''}:\n` + b.en.map((l, i) => `      ${l}  ‖ ${b.lines[i]}`).join('\n'));
	else if (b.kind === 'flashback') {
		out.push(`[${path}] FLASHBACK ${b.label ?? ''} ${b.year ?? ''}`);
		(b.blocks ?? []).forEach((c, i) => render(c, `${path}.${i}`, out));
	} else {
		const { kind, ...rest } = b;
		out.push(`[${path}] <${kind}> ${JSON.stringify(rest).slice(0, 400)}`);
	}
}

for (let n = lo; n <= hi; n++) {
	const e = all[n - 1];
	const out = [`\n===== #${n} ${e.title} (${e.year}) [${e.chapter}] ${words(e.blocks)}w`, `logline: ${e.logline ?? ''}`, `subtitle: ${e.subtitle ?? ''}`];
	e.blocks.forEach((b, i) => render(b, String(i), out));
	for (const im of e.images ?? []) out.push(`  IMG ${im.id} @ ${im.at}`);
	console.log(out.join('\n'));
}
