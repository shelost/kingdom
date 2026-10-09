import fs from 'fs';
const chs = JSON.parse(fs.readFileSync('src/lib/data/story.json','utf8'));
const [title, pat] = process.argv.slice(2); const re=new RegExp(pat,'i');
const e = chs.flatMap(c=>c.entries).find(e=>e.title===title);
const texts = b => [b.html,b.ko,b.label,b.title,b.caption,...(b.lines||[]),...(b.en||[])].filter(x=>typeof x==='string');
const walk=(bs,p)=>bs.forEach((b,i)=>{ const t=texts(b).find(t=>re.test(t)); if(t){const j=t.search(re); console.log(`  #${p}${i} ${b.kind}: …${t.slice(Math.max(0,j-120),j+120)}…`);} if(b.blocks) walk(b.blocks,p+i+'.'); });
console.log('== '+title+' /'+pat+'/'); walk(e.blocks,'');
