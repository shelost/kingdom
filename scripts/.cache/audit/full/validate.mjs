/**
 * House-rule checks for a range of episodes: `node validate.mjs 40 46`.
 * Bilingual blocks, AD years in mortal mouths, the bold next-episode card, day headers, Muryuk's name before his reveal.
 */
import { loadStory, lists } from '../../story-ops.mjs';

const [lo = 1, hi = 999] = process.argv.slice(2).map(Number);
const DIVINE = new Set(['narim', 'golhwa', 'hyulle', 'kangrim', 'hwanin', 'hwanung', 'yuridora', 'sulmundae', 'ibiga']);
const strip = (s = '') => s.replace(/<[^>]+>/g, '').trim();
const problems = [];
let n = 0;

for (const c of loadStory())
	for (const e of c.entries) {
		n++;
		if (n < lo || n > hi) continue;
		const at = (msg) => problems.push(`#${n} ${e.title}: ${msg}`);
		for (const list of lists(e))
			list.forEach((b, i) => {
				if (b.kind === 'p' && (!strip(b.html) || !strip(b.ko))) at(`[${i}] p missing ${strip(b.html) ? 'ko' : 'html'}`);
				if (b.kind === 'dialogue') {
					if (!b.lines?.length || !b.en?.length || b.lines.length !== b.en.length)
						at(`[${i}] dialogue lines/en mismatch (${b.lines?.length}/${b.en?.length})`);
					if (!DIVINE.has(b.person) && b.en?.some((l) => /\b(?:in|of|since|by)\s+(?:AD\s*)?[1-7]\d{2}\b|\b[1-7]\d{2}\s*(?:AD|CE)\b/.test(l)))
						at(`[${i}] AD year in mortal dialogue (${b.person})`);
					if (n < 43 && b.person === 'muryuk' && b.look !== 'unnamed') at(`[${i}] Muryuk named before his episode`);
				}
				if (n < 43 && /Muryuk|무력/.test([b.html, b.ko, ...(b.en ?? []), ...(b.lines ?? [])].join(' ')) && b.kind !== 'quote')
					at(`[${i}] text names Muryuk before his episode`);
			});
		const last = e.blocks.at(-1);
		const card = last?.kind === 'p' && /^\s*<b>[\s\S]*<\/b>\s*$/.test(last.html ?? '');
		if (n < 98 && !card) at('does not end on a bold next-episode card');
		if (card && strip(last.html).split(/\s+/).length > 25) at(`closing card is ${strip(last.html).split(/\s+/).length} words`);
		if (card && !/^\s*<b>[\s\S]*<\/b>\s*$/.test(last.ko ?? '')) at('closing card Korean not bold');
	}

console.log(problems.length ? problems.join('\n') : `ok #${lo}–#${hi}`);
process.exitCode = problems.length ? 1 : 0;
