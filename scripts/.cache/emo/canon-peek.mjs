import { buildCanon } from '../../visual-canon.mjs';
const specs = process.argv.slice(2);
for (const spec of specs) {
  const [y, ...ids] = spec.split(' ');
  try {
    const c = buildCanon(ids, { year: +y });
    console.log(`== ${spec}\n  ${c.refs.join(' ')}\n  ${(c.text.match(/(?:^|\| )[A-Z][A-Z ’'\-]+ — /g) || []).join('')}`);
  } catch (e) { console.log(`== ${spec} ERR ${e.message}`); }
}
