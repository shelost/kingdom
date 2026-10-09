import fs from 'fs';
import { PLACES } from '../../../src/lib/places.ts';
const chs = JSON.parse(fs.readFileSync('src/lib/data/story.json','utf8'));
const texts = b => [b.html,b.ko,b.label,b.title,b.caption,...(b.lines||[]),...(b.en||[])].filter(x=>typeof x==='string');
const flat = [];
chs.forEach(c=>c.entries.forEach((e,ei)=>{ if(e.title.startsWith('Huangdi')) return; const walk=(bs,path)=>bs.forEach((b,i)=>{flat.push({ch:c.id,title:e.title,path:path+i,b}); if(b.blocks) walk(b.blocks,path+i+'.');}); walk(e.blocks||[],''); }));
const extra = { buyeo_north:['Buyeo'], central:[], heaven:['Heaven’s Court','Court of Heaven','하늘나라'], living_world:['이승','Living World'], changan:['Chang’an','Changan','장안'], cheomseongdae:['Cheomseongdae','첨성대'], halla:['Halla','한라'], mugun:['Mugun','무근'], asuka:['Asuka','아스카'], gungnae:['Gungnae','국내성'], wirye:['Wirye','위례'], danghang:['Danghang','당항'], daeya:['Daeya','대야'], maeso:['Maeso','매소'], juryu:['Juryu','주류성'], imjon:['Imjon','임존'], gwansan:['Gwansan','관산성'], michuhol:['Michuhol','미추홀'], geumgwan:['Golden Gaya','금관'], daegaya:['Great Gaya','대가야'], asadal:['Asadal','아사달'], paektu:['Paektu','백두'], jupil:['Jupil','주필'], sasu:['Snake River','사수'], seokmun:['Stone Gate','석문'], samseonghyeol:['Three Princes’ Well','삼성혈'], deer_rock:['Deer Rock','정사암'], flower_cliff:['Flower Cliff','꽃벼랑'], moon_palace:['Moon Palace','월궁'], manchuria:['Eastern March'], underworld:[], western_flower_field:[] };
const only = process.argv[2]?.split(',');
for (const p of Object.values(PLACES)) {
  if (only && !only.includes(p.id)) continue;
  let terms = [p.name, (p.korean||'').replace(/\s*\(.*\)/,''), ...(p.aliases||[]), ...(extra[p.id]||[])].filter(t=>t && t.length>1);
  if (p.id==='buyeo_north') terms=['Buyeo kingdom','North Buyeo','부여 땅',"Buyeo's",'Buyeo court','Buyeo yard'];
  if (p.id==='central') terms=[];
  terms=[...new Set(terms)];
  const re = new RegExp(terms.map(t=>/^[A-Za-z]/.test(t)?'\\b'+t.replace(/[.*+?^${}()|[\]\\’]/g,m=>m==='’'?"['’]":'\\'+m)+'\\b':t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'));
  const hits=[];
  for (const f of flat) { if(!terms.length) break; for (const t of texts(f.b)) { const m=t.match(re); if(m){ hits.push({...f, m:m[0], t}); break; } } if(hits.length>=3) break; }
  console.log(`\n=== ${p.id} (${terms.slice(0,4).join('/')})`);
  for (const h of hits) { const i=h.t.indexOf(h.m); console.log(`  [${h.ch}] ${h.title} #${h.path} ${h.b.kind}: …${h.t.slice(Math.max(0,i-90),i+80).replace(/\n/g,' ')}…`); }
}
