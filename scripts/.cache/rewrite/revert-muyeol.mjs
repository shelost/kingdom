/**
 * One-shot: Muyul->Muyeol, Tehwa->Taehwa, Jun (轉)->Jeon (轉).
 * Display text + episode ids only. Asset filenames (ch_muyeol.png etc.),
 * image ids/paths, place ids, aliases skipped.
 * Episode-id changes handled via reading.svelte.ts aliases (separate edit).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const rel = (p) => path.join(ROOT, p);

const RULES = [
	[/\bMuyul\b/g, 'Muyeol'],
	[/\bTehwa\b/g, 'Taehwa'],
	[/\bJun \(轉\)/g, 'Jeon (轉)'],
	[/chunchu-era-jun/g, 'chunchu-era-jeon']
];

const apply = (s) => {
	let out = s;
	for (const [re, to] of RULES) out = out.replace(re, to);
	return out;
};

const SKIP_KEYS = new Set([
	'prompt', 'refs', 'src', 'tempImage', 'thumbnail', 'thumbnailLayer', 'source', 'credit',
	'url', 'id', 'people', 'person', 'place', 'still', 'aliases', 'look', 'icon', 'image',
	'file', 'filename', 'ja', 'zh', 'native', 'nativeLang', 'where', 'chip', 'kind', 'tone',
	'music', 'style', 'art', 'license'
]);

function walk(x, key) {
	if (typeof x === 'string') {
		if (SKIP_KEYS.has(key) || /Latn$/.test(key ?? '')) return x;
		return apply(x);
	}
	if (Array.isArray(x)) return x.map((v) => walk(v, key));
	if (x && typeof x === 'object') {
		const out = {};
		for (const [k, v] of Object.entries(x)) out[k] = SKIP_KEYS.has(k) || /Latn$/.test(k) ? v : walk(v, k);
		return out;
	}
	return x;
}

const JSON_FILES = [
	'src/lib/data/story.json',
	'src/lib/data/hidden-widgets.json',
	'src/lib/data/line-stars.json',
	'src/lib/data/image-grades.json',
	'src/lib/data/research-images.json',
	...fs
		.readdirSync(rel('src/lib/data/battles'))
		.filter((f) => f.endsWith('.json'))
		.map((f) => `src/lib/data/battles/${f}`)
];

const CODE_FILES = [
	'src/lib/people.ts',
	'src/lib/relations.ts',
	'src/lib/tocTree.ts',
	'src/lib/phrases.ts',
	'src/lib/places.ts',
	'src/lib/borders.ts',
	'src/lib/mapRoutes.ts',
	'src/lib/personaMeta.ts',
	'src/lib/movieSequences.ts',
	'src/lib/reading.svelte.ts'
];

const ASSET_LINE = /\/temp\/|\/img_|\/pl_|\/ch_|\/bn_|\/sw_|\/obj_|\/ref_|\.png|\.jpg|https?:|^\s*import\b|aliases\s*:/;
let n = 0;
for (const f of JSON_FILES) {
	const raw = fs.readFileSync(rel(f), 'utf8');
	const next = JSON.stringify(walk(JSON.parse(raw), null), null, '\t') + '\n';
	if (next !== raw) {
		fs.writeFileSync(rel(f), next);
		n++;
		console.log('wrote', f);
	}
}
for (const f of CODE_FILES) {
	const raw = fs.readFileSync(rel(f), 'utf8');
	const next = raw
		.split('\n')
		.map((line) => {
			if (ASSET_LINE.test(line)) {
				return line.replace(/chunchu-era-jun/g, 'chunchu-era-jeon').replace(/chunchu-era-king-muyul/g, 'chunchu-era-king-muyeol');
			}
			return apply(line).replace(/chunchu-era-king-muyul/g, 'chunchu-era-king-muyeol');
		})
		.join('\n');
	if (next !== raw) {
		fs.writeFileSync(rel(f), next);
		n++;
		console.log('wrote', f);
	}
}
console.log(`done, ${n} files`);
