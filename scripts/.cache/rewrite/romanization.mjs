/**
 * Simpler romanization pass: ㅓ / ㅡ → u, ㅐ → e (Seondeok → Sunduk, Gaesomun → Gesomun,
 * Gyebaek → Gyebek, Geunchogo → Gunchogo). The kingdoms Baekje, Goguryeo, Goryeo, Joseon,
 * Buyeo and the Yeon clan keep their spellings; ㅐ stays after h (Guhae, Haemosu) and at
 * the end of a word (Tae, Cheomseongdae → Chumsungdae).
 *
 * Touches reader-facing English only. Image prompts, citations, credits, lyrics, romaji and
 * pinyin, and `aliases:` lines (old spellings stay searchable) are left alone.
 *
 *   node scripts/.cache/rewrite/romanization.mjs --plan    print the word map
 *   node scripts/.cache/rewrite/romanization.mjs --write   apply it
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const rel = (p) => path.join(ROOT, p);

const KEEP = new Set([
	'Baekje', 'Goguryeo', 'Goryeo', 'Goryeosa', 'Joseon', 'Gojoseon', 'Buyeo', 'Dongbuyeo',
	'Yeon', 'Yeons', 'Euija', 'Seohyun', 'Seoul', 'Leeum', 'Kimae',
	// loanwords used as common nouns
	'Binyeo', 'Jeogori', 'Gayageum', 'Geomungo', 'Haegeum', 'Daegeum', 'Ssireum', 'Ssireumdo',
	// English / European words the dictionary misses
	'Georges', 'Raphael', 'Leonardo', 'Matteo', 'Massagetae', 'Pasargadae', 'Hebraeus',
	'Polyaenus', 'Cyropaedia', 'Phocaeans', 'Achaemenid', 'Gibeonites', 'Israelites', 'Neue',
	'Enfeoffment', 'Reunifier', 'Jaehyun', 'Deut', 'Dieu', 'Fleur', 'Odysseus', 'Perseus',
	'Neoclassical',
	// reverted by request: keep textbook spelling
	'Maehwa', 'Maeso', 'Maesocheon', 'Daeya', 'Daeyang', 'Seung', 'Muyeol', 'Taehwa', 'Jeon'
]);

const OVERRIDE = {
	Seorabeol: 'Surabol',
	Hyeokgeose: 'Hyukgosé',
	Hyukgose: 'Hyukgosé',
	Jeonggyeonmoju: 'Rightview',
	Jeonggyeon: 'Rightview'
};

const DICT = new Set(
	fs.readFileSync('/usr/share/dict/words', 'utf8').split('\n').map((w) => w.trim().toLowerCase())
);

const isEnglish = (w) =>
	DICT.has(w) || DICT.has(w.replace(/s$/, '')) || DICT.has(w.replace(/ies$/, 'y'));

const VOWELS = ['yae', 'yeo', 'wae', 'ae', 'ya', 'eo', 'ye', 'wa', 'oe', 'yo', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'a', 'e', 'o', 'u', 'i'];
const SIMPLE = { ae: 'e', yae: 'ye', wae: 'we', eo: 'u', yeo: 'yu', eu: 'u' };
const TARGET = /eo|ae|eu/;

function simplifyLower(w) {
	let out = '';
	let i = 0;
	while (i < w.length) {
		if (!/[aeiouwy]/.test(w[i])) {
			out += w[i++];
			continue;
		}
		let j = i;
		while (j < w.length && /[aeiouwy]/.test(w[j])) j++;
		const run = w.slice(i, j);
		let k = 0;
		while (k < run.length) {
			const v = VOWELS.find((x) => run.startsWith(x, k)) ?? run[k];
			const before = w.slice(0, i + k);
			const end = i + k + v.length === w.length;
			const keepAe = v === 'ae' && (end || (/h$/.test(before) && !/[cks]h$/.test(before)));
			out += keepAe ? v : (SIMPLE[v] ?? v);
			k += v.length;
		}
		i = j;
	}
	return out;
}

/** New spelling for one capitalized or all-caps word, or null when it stays. */
export function simplifyWord(word) {
	if (OVERRIDE[word]) return OVERRIDE[word];
	const caps = word.length > 2 && word === word.toUpperCase();
	const title = caps ? word[0] + word.slice(1).toLowerCase() : word;
	if (OVERRIDE[title]) return caps ? OVERRIDE[title].toUpperCase() : null;
	if (KEEP.has(title)) return null;
	const lower = title.toLowerCase();
	if (!TARGET.test(lower) || isEnglish(lower)) return null;
	const next = simplifyLower(lower);
	if (next === lower) return null;
	return caps ? next.toUpperCase() : next[0].toUpperCase() + next.slice(1);
}

const WORD = /(?<![\p{L}\p{N}_/.-])(?:[A-Z][a-z]+|[A-Z]{3,})(?![\p{L}\p{N}_/-]|\.(?:png|jpe?g|svg|webp))/gu;

const used = new Map();
function convertText(s) {
	return s.replace(WORD, (w) => {
		const n = simplifyWord(w);
		if (!n) return w;
		used.set(w, n);
		return n;
	});
}

/* ---------- JSON ---------- */

const SKIP_KEYS = new Set([
	'prompt', 'refs', 'src', 'tempImage', 'thumbnail', 'thumbnailLayer', 'source', 'credit', 'url',
	'id', 'people', 'person', 'chip', 'kind', 'tone', 'still', 'music', 'look', 'style', 'art',
	'ja', 'zh', 'native', 'nativeLang', 'where', 'note', 'keep', 'cut', 'tags', 'tagsWorked',
	'tagsFailed', 'file', 'filename', 'license', 'artistName'
]);

function walk(x, key, only) {
	if (typeof x === 'string') {
		if (only ? !only.has(key) : SKIP_KEYS.has(key) || /Latn$/.test(key ?? '')) return x;
		return convertText(x);
	}
	if (Array.isArray(x)) return x.map((v) => walk(v, key, only));
	if (x && typeof x === 'object') {
		const out = {};
		for (const [k, v] of Object.entries(x)) {
			if (!only && (SKIP_KEYS.has(k) || /Latn$/.test(k))) out[k] = v;
			else out[k] = walk(v, k, only);
		}
		return out;
	}
	return x;
}

const JSON_FILES = [
	['src/lib/data/story.json'],
	['src/lib/data/hidden-widgets.json'],
	['src/lib/data/given-names.json'],
	['src/lib/data/research-images.json'],
	['src/lib/data/line-stars.json', new Set(['entryTitle', 'en'])],
	['src/lib/data/image-grades.json', new Set(['entryTitle', 'chapterTitle', 'alt'])],
	...fs
		.readdirSync(rel('src/lib/data/battles'))
		.filter((f) => f.endsWith('.json'))
		.map((f) => [`src/lib/data/battles/${f}`])
];

/* ---------- TS / Svelte ---------- */

const SKIP_DIRS = ['src/lib/outlines/', 'src/lib/data/'];
const SKIP_FILES = new Set([
	'src/lib/promptHouse.ts', 'src/lib/recordBooks.ts', 'src/lib/scenes.ts',
	'src/lib/instruments.ts', 'src/lib/leitmotifs.ts'
]);
const SKIP_LINE = /^\s*(source|credit|url|prompt|aliases|match|license|refs)\s*:|https?:\/\/|\.cache\//;

function codeFiles(dir) {
	const out = [];
	for (const e of fs.readdirSync(rel(dir), { withFileTypes: true })) {
		const p = `${dir}/${e.name}`;
		if (e.isDirectory()) out.push(...codeFiles(p));
		else if (/\.(ts|svelte)$/.test(e.name)) out.push(p);
	}
	return out;
}

const CODE_FILES = codeFiles('src').filter(
	(f) => !SKIP_FILES.has(f) && !SKIP_DIRS.some((d) => f.startsWith(d))
);

function convertCode(text) {
	return text
		.split('\n')
		.map((line) => (SKIP_LINE.test(line) ? line : convertText(line)))
		.join('\n');
}

/* ---------- run ---------- */

const mode = process.argv[2];
const writes = [];

for (const [f, only] of JSON_FILES) {
	const raw = fs.readFileSync(rel(f), 'utf8');
	const next = JSON.stringify(walk(JSON.parse(raw), null, only), null, '\t') + '\n';
	if (next !== raw) writes.push([f, next]);
}
for (const f of CODE_FILES) {
	const raw = fs.readFileSync(rel(f), 'utf8');
	const next = convertCode(raw);
	if (next !== raw) writes.push([f, next]);
}

if (mode === '--plan') {
	for (const [a, b] of [...used].sort((x, y) => x[0].localeCompare(y[0]))) console.log(`${a} → ${b}`);
	console.log(`\n${used.size} words, ${writes.length} files`);
} else if (mode === '--write') {
	for (const [f, next] of writes) fs.writeFileSync(rel(f), next);
	console.log(`${used.size} words, wrote ${writes.length} files:\n${writes.map(([f]) => f).join('\n')}`);
} else {
	console.log('usage: --plan | --write');
}
