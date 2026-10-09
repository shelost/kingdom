// node scripts/.cache/emo/dump.mjs "<entry title>" [maxChars]
import { loadStory, textOf } from '../story-ops.mjs';
const [title, max = 260] = process.argv.slice(2);
const s = loadStory();
for (const c of s) for (const e of c.entries) {
  if (e.title !== title) continue;
  console.log(`== [${c.id}] ${e.title} year=${e.year}`);
  const imgs = e.images ?? [];
  const walk = (blocks, pre) => blocks.forEach((b, i) => {
    const t = textOf(b);
    const hits = imgs.filter((im) => im.at && t.includes(im.at)).map((im) => im.id);
    const en = b.kind === 'dialogue' ? (b.en ?? []).join(' / ') : (b.html ?? b.label ?? b.title ?? '');
    console.log(`${pre}${i} ${b.kind}${b.person ? ':' + b.person : ''}${b.style ? ' (' + b.style + ')' : ''} ${hits.length ? '[IMG ' + hits.join(',') + ']' : ''}\n   ${en.replace(/<[^>]+>/g, '').slice(0, +max)}`);
    if (b.kind === 'flashback' && b.blocks) walk(b.blocks, pre + i + '.');
  });
  walk(e.blocks, '');
  const orphan = imgs.filter((im) => !im.at || !JSON.stringify(e.blocks).includes(JSON.stringify(im.at).slice(1, -1)));
  if (orphan.length) console.log('ORPHAN', orphan.map((o) => o.id));
}
