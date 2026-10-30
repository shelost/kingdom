// One-shot follow-up: remaining Gumgwan/Ara display strings (at/alt/label/prose/dialogue only).
import fs from 'node:fs';
const SKIP = new Set(['prompt', 'refs', 'tempImage', 'src', 'thumbnail', 'id', 'hanja', 'source']);
const pairs = [
	['The king of Ara', 'The king of Bright Gaya'],
	['Gumgwan, the Golden Gaya palace', 'The Golden Gaya palace'],
	['Before dawn at Gumgwan: the Golden Gaya palace', 'Before dawn: the Golden Gaya palace'],
	['Gumgwan \u00b7 eight years later', 'Golden Gaya \u00b7 eight years later'],
	['drove Gumgwan to Surabol in a cart', 'drove Golden Gaya to Surabol in a cart'],
	['more spears than Gumgwan has people', 'more spears than Golden Gaya has people'],
	['Silla men lead the king of Gumgwan up the hill', 'Silla men lead the king of Golden Gaya up the hill'],
	['They give the old king of Gumgwan a seat on it', 'They give the old king of Golden Gaya a seat on it'],
	["Gumgwan\u2019s youngest, is it.", "Golden Gaya\u2019s youngest, is it."],
];
const fix = (o) => {
	if (Array.isArray(o)) { o.forEach(fix); return; }
	if (!o || typeof o !== 'object') return;
	for (const k of Object.keys(o)) {
		const v = o[k];
		if (typeof v === 'string' && !SKIP.has(k)) {
			let s = v;
			for (const [a, b] of pairs) if (s.includes(a)) s = s.split(a).join(b);
			if (s !== v) o[k] = s;
		} else fix(v);
	}
};
for (const f of ['src/lib/data/story.json']) {
	const t = fs.readFileSync(f, 'utf8'); const o = JSON.parse(t); fix(o);
	const out = JSON.stringify(o, null, '\t') + '\n';
	if (out !== t) { fs.writeFileSync(f, out); console.log('wrote', f); } else console.log('no change', f);
}
console.log('done');
