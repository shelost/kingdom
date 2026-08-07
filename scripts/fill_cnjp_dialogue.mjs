/**
 * Merge zh/zhLatn/ja/jaLatn subtitle fields into Tang / Yamato dialogue blocks.
 * Usage: node scripts/fill_cnjp_dialogue.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const storyPath = path.join(root, 'src/lib/data/story.json');
const trPath = path.join(root, 'scripts/cnjp_translations.json');
const peoplePath = path.join(root, 'src/lib/people.ts');

const story = JSON.parse(fs.readFileSync(storyPath, 'utf8'));
const TR = JSON.parse(fs.readFileSync(trPath, 'utf8'));
const peopleSrc = fs.readFileSync(peoplePath, 'utf8');

const kingdomById = new Map();
for (const chunk of peopleSrc.split(/^\t\{/m)) {
	const id = chunk.match(/id:\s*'([^']+)'/);
	const kingdom = chunk.match(/kingdom:\s*'([^']+)'/);
	if (id && kingdom) kingdomById.set(id[1], kingdom[1]);
}

let filledZh = 0;
let filledJa = 0;
let missing = [];

function applyBlock(b, meta) {
	if (b.kind === 'dialogue') {
		const k = kingdomById.get(b.person);
		if (k === 'tang' || k === 'yamato') {
			const n = Math.max((b.lines ?? []).length, (b.en ?? []).length);
			const native = [];
			const latn = [];
			let any = false;
			for (let j = 0; j < n; j++) {
				const key = `${meta.ch}|${meta.ei}|${meta.path}${meta.bi}|${j}`;
				const t = TR[key];
				if (!t) {
					missing.push(key);
					native.push('');
					latn.push('');
					continue;
				}
				any = true;
				if (k === 'tang') {
					native.push(t.zh ?? '');
					latn.push(t.zhLatn ?? '');
					if (t.zh) filledZh++;
				} else {
					native.push(t.ja ?? '');
					latn.push(t.jaLatn ?? '');
					if (t.ja) filledJa++;
				}
			}
			if (any) {
				if (k === 'tang') {
					b.zh = native;
					b.zhLatn = latn;
					delete b.ja;
					delete b.jaLatn;
				} else {
					b.ja = native;
					b.jaLatn = latn;
					delete b.zh;
					delete b.zhLatn;
				}
			}
		}
	}
	if (b.kind === 'flashback' && Array.isArray(b.blocks)) {
		b.blocks.forEach((nb, i) =>
			applyBlock(nb, { ...meta, path: `${meta.path}fb${meta.bi}.`, bi: i })
		);
	}
}

for (const ch of story) {
	ch.entries.forEach((en, ei) => {
		(en.blocks ?? []).forEach((b, bi) =>
			applyBlock(b, { ch: ch.id, ei, path: '', bi })
		);
	});
}

fs.writeFileSync(storyPath, JSON.stringify(story, null, '\t') + '\n');
console.log(`filled zh lines: ${filledZh}`);
console.log(`filled ja lines: ${filledJa}`);
console.log(`missing keys: ${missing.length}`);
if (missing.length) console.log(missing.slice(0, 20));
console.log(`translation keys: ${Object.keys(TR).length}`);
