import fs from 'fs';
const chs = JSON.parse(fs.readFileSync('src/lib/data/story.json','utf8'));
const [title, from='0', to='12'] = process.argv.slice(2);
const e = chs.flatMap(c=>c.entries).find(e=>e.title===title);
const show=(b,p)=>{const t=b.html??b.label??b.title??b.caption??(b.en||b.lines||[]).join(' / ')??''; console.log(`#${p} ${b.kind}${b.person?'('+b.person+')':''}${b.places?'['+b.places+']':''}: ${String(t).slice(0,230)}`); };
e.blocks.forEach((b,i)=>{ if(i<+from||i>+to) return; show(b,i); if(b.blocks) b.blocks.forEach((c,j)=>show(c,i+'.'+j)); });
