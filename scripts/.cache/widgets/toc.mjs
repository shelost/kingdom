import fs from 'fs';
const s = JSON.parse(fs.readFileSync('src/lib/data/story.json','utf8'));
const chs = Array.isArray(s) ? s : s.chapters;
let n=0;
for (const c of chs) { console.log('## '+(c.id||c.slug||c.title)); for (const e of c.entries) { const kinds={}; const walk=bs=>bs.forEach(b=>{kinds[b.kind]=(kinds[b.kind]||0)+1; if(b.blocks) walk(b.blocks)}); walk(e.blocks||[]); console.log(`  ${n++} [${e.year}] ${e.title}  place:${kinds.place||0} hanja:${kinds.hanja||0} map:${kinds.map||0}`);} }
