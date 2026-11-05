// node scripts/.cache/stage-shot-save.mjs <cdp-result.json|-> <out.jpg>: decode a captured still.
import { readFileSync, writeFileSync } from 'node:fs';
const [src, out] = process.argv.slice(2);
const text = readFileSync(src === '-' ? 0 : src, 'utf8');
const m = text.match(/data:image\/jpeg;base64,([A-Za-z0-9+/=]+)/);
if (!m) throw new Error('no image in ' + src);
writeFileSync(out, Buffer.from(m[1], 'base64'));
console.log(out);
