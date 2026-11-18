import { readFileSync } from 'node:fs';
const story = JSON.parse(readFileSync(new URL('../../src/lib/data/story.json', import.meta.url), 'utf8'));
const entries = story.flatMap((c) => c.entries ?? []);
const y = entries.find((e) => e.subtitle === '김용수' || e.title === 'No Ghosts' || e.tagline === 'No Ghosts');
console.log('TITLE', y?.title, y?.year, y?.tagline);
console.log('LOGLINE', y?.logline?.en);
console.log('---');
for (const b of y.blocks) {
  if (b.kind === 'scene' || b.kind === 'day' || b.kind === 'story') console.log('\n##', b.label || '');
  else if (b.html) console.log(b.html.replace(/<[^>]+>/g, '').slice(0, 400));
  else if (b.en) console.log((b.person || '') + ': ' + b.en.join(' / ').slice(0, 300));
  else if (b.hanja) console.log('QUOTE', b.hanja);
}
