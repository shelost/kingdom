#!/usr/bin/env node
/**
 * English keeps romanization to a minimum. Places with a meaning go by it
 * (Hwangsan → Yellow Mountain); fortresses keep their name and lose the
 * “-seong” (Gwansanseong → Gwansan Fortress).
 *
 * Rewrites reader-facing English in story.json and the wiki sources. Korean,
 * hanja, aliases (so old spellings still link), image prompts and record
 * sources are left alone.
 *
 *   node scripts/localize-en.mjs          # write
 *   node scripts/localize-en.mjs --dry    # count only
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DRY = process.argv.includes('--dry');

/**
 * A seat named for what its hanja means (月城 → the Moon Palace) takes an
 * article: “The” to open a sentence, “the” elsewhere, none after one already
 * there. A trailing “palace” and an old English gloss after it are absorbed.
 */
function palace(name, en, { gloss } = {}) {
	const word = `${name}(?![\\w-])`;
	return [
		[new RegExp(`\\b${name} palace\\b`, 'g'), name],
		...(gloss ? [[new RegExp(`(\\b${name}(?:</b>)?), ${gloss}`, 'g'), '$1']] : []),
		[new RegExp(`\\b([Tt]he (?:far |real )?)${word}`, 'g'), `$1${en}`],
		[new RegExp(`(^|[.!?]["”’]?\\s+|^["“])(<b>)?${word}`, 'gm'), `$1$2The ${en}`],
		[new RegExp(`\\b${word}`, 'g'), `the ${en}`]
	];
}

/** Longest first: “Hwangsanbeol” before “Hwangsan”, the glossed form before the bare one. */
export const GLOSSARY = [
	...palace('Wolseong', 'Moon Palace', { gloss: 'the Crescent Moon Fortress' }),
	...palace('Hanseong', 'River Palace'),
	...palace('Geumseong', 'Golden Palace'),
	[/\bHwangsanbeol\b/g, 'Yellow Mountain'],
	[/\bHwangsan\b/g, 'Yellow Mountain'],
	[/\bStallion Mountain \(Jupil\)/g, 'Stallion Mountain'],
	[/\bMt\. Jupil\b/g, 'Stallion Mountain'],
	[/\bJupil\b/g, 'Stallion Mountain'],
	[/\bGibeolpo\b/g, 'Final Ford'],
	[/\bGwansanseong\b/g, 'Gwansan Fortress'],
	[/\bDanghangseong\b/g, 'Danghang Fortress'],
	[/\bCheonseong\b/g, 'Cheon Fortress'],
	[/\bWiryeseong\b/g, 'Wirye Fortress'],
	[/\bNangseong\b/g, 'Nang Fortress'],
	[/\bChaekseong\b/g, 'Chaek Fortress'],
	[/\bJeokseong\b/g, 'Jeok Fortress'],
	[/\bSinseong\b/g, 'Sin Fortress']
];

/** JSON keys that are never English prose. */
const SKIP_KEYS = new Set([
	'ko', 'lines', 'hanja', 'zh', 'ja', 'zhLatn', 'jaLatn', 'mnc', 'korean', 'prompt', 'source',
	'aliases', 'id', 'person', 'music', 'tempImage', 'image', 'src', 'sub', 'write'
]);

/** TS lines that hold names in other scripts, link keys, or generator text. */
const SKIP_LINE = /\b(korean|hanja|aliases|prompt|match|id|titleKo):/;

const TS_FILES = [
	'src/lib/places.ts',
	'src/lib/people.ts',
	'src/lib/relations.ts',
	'src/lib/animals.ts',
	'src/lib/scenes.ts',
	'src/lib/movieSequences.ts',
	'src/lib/borders.ts',
	'src/lib/personaMeta.ts',
	'src/lib/instruments.ts',
	'src/lib/phrases.ts'
];

let total = 0;

function localize(text) {
	let out = text;
	for (const [re, en] of GLOSSARY) {
		total += out.match(re)?.length ?? 0;
		out = out.replace(re, en);
	}
	return out;
}

function walk(node, key) {
	if (Array.isArray(node)) return node.map((v) => walk(v, key));
	if (node && typeof node === 'object') {
		return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walk(v, k)]));
	}
	if (typeof node === 'string' && !SKIP_KEYS.has(key)) return localize(node);
	return node;
}

const storyPath = path.join(ROOT, 'src/lib/data/story.json');
const before = total;
const story = walk(JSON.parse(fs.readFileSync(storyPath, 'utf8')), '');
console.log(`story.json: ${total - before}`);
if (!DRY) fs.writeFileSync(storyPath, JSON.stringify(story, null, '\t') + '\n');

for (const rel of TS_FILES) {
	const file = path.join(ROOT, rel);
	if (!fs.existsSync(file)) continue;
	const start = total;
	const src = fs.readFileSync(file, 'utf8');
	const next = src
		.split('\n')
		.map((line) => (SKIP_LINE.test(line) ? line : localize(line)))
		.join('\n');
	if (total > start) {
		console.log(`${rel}: ${total - start}`);
		if (!DRY) fs.writeFileSync(file, next);
	}
}

console.log(`${DRY ? 'would replace' : 'replaced'} ${total}`);
