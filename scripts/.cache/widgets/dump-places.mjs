import { PLACES } from '../../../src/lib/places.ts';
for (const p of Object.values(PLACES)) console.log([p.id, p.name, p.korean||'', p.hanja||'-', p.kind, p.capital?'CAP':'', (p.aliases||[]).join('|')].join(' ; '));
