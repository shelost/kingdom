/**
 * One-shot: revert Maehwa / Maeso / Daeya / Seung(承) to pre-simplification
 * spelling, and rename Mount Gain → Prosperity Mountain.
 *
 * Display text + `at` anchors only. Asset paths, image ids, place ids,
 * aliases (which keep both spellings for search) are left alone.
 * Episode-id changes are handled via reading.svelte.ts aliases (separate edit).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const rel = (p) => path.join(ROOT, p);

const RULES = [
	[/\bMehwa\b/g, 'Maehwa'],
	[/Mesochun/g, 'Maesocheon'],
	[/\bMeso\b/g, 'Maeso'],
	[/\bDeyang\b/g, 'Daeyang'],
	[/\bDeya\b/g, 'Daeya'],
	[/\bDEYA\b/g, 'DAEYA'],
	[/Sung \(承\)/g, 'Seung (承)'],
	[/chunchu-era-sung/g, 'chunchu-era-seung'],
	[/Mount Gain/g, 'Prosperity Mountain'],
	[/mount-gain/g, 'prosperity-mountain'],
	[/hill called Gain\b/g, 'hill called Prosperity Mountain']
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
	'music', 'style', 'art', 'file', 'license'
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
	'src/lib/animals.ts',
	'src/lib/components/MapTimelapse.svelte',
	'src/routes/map/+page.svelte'
];

const ASSET_LINE = /\/temp\/|\/img_|\/pl_|\/ch_|\/bn_|\/sw_|\/obj_|\.png|\.jpg|https?:|^\s*import\b|aliases\s*:/;
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
		.map((line) => (ASSET_LINE.test(line) ? line : apply(line)))
		.join('\n');
	if (next !== raw) {
		fs.writeFileSync(rel(f), next);
		n++;
		console.log('wrote', f);
	}
}
console.log(`done, ${n} files`);
