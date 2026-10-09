import fs from 'fs';
import { PLACES } from '../../../src/lib/places.ts';
const out = JSON.parse(fs.readFileSync('scripts/.cache/widgets/places.json','utf8'));
const chs = JSON.parse(fs.readFileSync('src/lib/data/story.json','utf8'));
const f = b => [b.html,b.ko,b.label,b.hanja,...(b.lines||[]),...(b.en||[])].filter(x=>typeof x==='string');
let bad = 0;
for (const o of [...out.ops, ...out.alternativeOps]) {
  const c = chs.find(c=>c.id===o.chapter); const e = c?.entries.find(e=>e.title===o.title);
  if (!e) { bad++; console.log('NO ENTRY', o.chapter, o.title); continue; }
  if (o.title.startsWith('Huangdi')) { bad++; console.log('HUANGDI'); }
  const hits=[]; const walk=(bs,p)=>bs.forEach((b,i)=>{ const n=f(b).reduce((n,t)=>n+t.split(o.after).length-1,0); if(n) hits.push([p+i,n,b]); if(b.blocks) walk(b.blocks,p+i+'.'); }); walk(e.blocks,'');
  const total = hits.reduce((s,h)=>s+h[1],0);
  if (total!==1 || o.after.length<20) { bad++; console.log('ANCHOR', total, o.after.length, o.title, JSON.stringify(o.after)); }
  if (o.block.kind==='place' && !PLACES[o.block.place]) { bad++; console.log('NO PLACE', o.block.place); }
  if (o.block.kind==='hanja' && o.block.chars.some(x=>!x.char||!x.gloss||!x.meaning)) { bad++; console.log('HANJA FIELDS'); }
  const h = hits[0]; console.log(`ok  ${o.title.padEnd(22)} #${h?.[0]} ${h?.[2].kind.padEnd(9)} → ${o.block.kind==='place'?o.block.place:o.block.ko}`);
}
console.log(bad ? `FAIL ${bad}` : 'ALL VALID', '| missingHanja', out.missingHanja.length);
