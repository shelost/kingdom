import fs from 'fs';
const chs = JSON.parse(fs.readFileSync('src/lib/data/story.json','utf8'));
const pats = {
 title:/세속오계|Five Principles|five precepts|Wongwang|원광/i,
 loyal:/사군이충|事君以忠|loyalty to the (sovereign|king)|serve the (king|sovereign)/i,
 filial:/사친이효|事親以孝|filial/i,
 trust:/교우이신|交友以信|trust among friends|faith (with|among) friends/i,
 retreat:/임전무퇴|臨戰無退|no retreat|never retreat/i,
 kill:/살생유택|殺生有擇|needless killing|choosy about killing|discrimination in killing|kill with discrimination/i,
};
const texts = b => [b.html,b.ko,b.label,b.title,b.caption,b.note,...(b.lines||[]),...(b.en||[]),...(b.chars||[]).map(c=>c.char)].filter(x=>typeof x==='string');
for (const [k,re] of Object.entries(pats)) { console.log('\n== '+k); let n=0;
 chs.forEach(c=>c.entries.forEach(e=>{ const walk=(bs,p)=>bs.forEach((b,i)=>{ for(const t of texts(b)){const m=t.match(re); if(m&&n<8){n++; const j=t.indexOf(m[0]); console.log(`  [${c.id}] ${e.title} #${p}${i} ${b.kind}: …${t.slice(Math.max(0,j-80),j+90)}…`); break;}} if(b.blocks) walk(b.blocks,p+i+'.');}); walk(e.blocks||[],''); }));
}
const hb=[]; chs.forEach(c=>c.entries.forEach(e=>{const walk=bs=>bs.forEach(b=>{if(b.kind==='hanja') hb.push(`${e.title}: ${b.chars.map(x=>x.char).join('')} ${b.name||''}`); if(b.blocks) walk(b.blocks)}); walk(e.blocks||[])})); console.log('\nHANJA BLOCKS:',hb);
