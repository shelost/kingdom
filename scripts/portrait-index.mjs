// Every character portrait in static/ (`ch_*`), so profiles can show all of a character's looks,
// including the ones no stage links to (`ch_kim_yushin_old.png` beside `ch_kim_yushin.png`).
// node scripts/portrait-index.mjs [--quiet]   → src/lib/data/portraits.json (rewritten only when it changes)
import fs from 'node:fs';

const OUT = 'src/lib/data/portraits.json';
const files = fs
	.readdirSync('static')
	.filter((f) => /^ch_.+\.(png|jpe?g|webp)$/i.test(f))
	.sort();
const next = JSON.stringify(files, null, '\t') + '\n';
const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
if (next !== prev) fs.writeFileSync(OUT, next);
if (!process.argv.includes('--quiet') || next !== prev) console.log(`Portraits: ${files.length} indexed${next !== prev ? ' (updated)' : ''}`);
