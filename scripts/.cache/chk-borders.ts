import { BORDER_SITES, BORDER_PEAKS, borderLinesAt, realmsAt, holdingsAt } from '../../src/lib/borders.ts';
let bad = 0;
for (const s of BORDER_SITES) for (let i = 1; i < s.h.length; i++) if (s.h[i][0] <= s.h[i - 1][0]) { bad++; console.log('order', s.id, JSON.stringify(s.h)); }
console.log('order problems', bad);
console.log(BORDER_PEAKS.map((p) => p.polity + ' ' + p.year).join(', '));
for (const y of [-250, -100, 0, 371, 568]) {
  const l = borderLinesAt(y);
  const r = realmsAt(y, holdingsAt(y));
  console.log(y, 'colors', l.borders.length, 'realms', r.map((x) => x.label).join(','));
}
