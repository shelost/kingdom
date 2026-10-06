/**
 * Give Scenes-page frames that never had a chronicle slot one, from a placement
 * plan: [{ scene, file, episode, anchor, desc }]. Root `static/scene_*` files go
 * in `src`, `static/temp/*` files in `tempImage`. Backs up story.json first.
 * Usage: node scripts/.cache/restore-scene-frames.mjs <plan.json> [--dry]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const STORY = path.resolve('src/lib/data/story.json');
const BACKUP = path.resolve('scripts/.cache/prev-stills/story.pre-scene-frames-restore.json');
const planPath = process.argv[2];
const dry = process.argv.includes('--dry');
if (!planPath) throw new Error('usage: restore-scene-frames.mjs <plan.json> [--dry]');

const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
const prompts = fs.existsSync('/tmp/frame-prompts.json') ? JSON.parse(fs.readFileSync('/tmp/frame-prompts.json', 'utf8')) : {};
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const entries = new Map();
const ids = new Set();
for (const ch of story) {
	for (const e of ch.entries ?? []) {
		if (!entries.has(e.title)) entries.set(e.title, e);
		for (const im of e.images ?? []) ids.add(im.id);
	}
}

function ratioOf(file) {
	const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
	const w = Number(out.match(/pixelWidth: (\d+)/)?.[1]);
	const h = Number(out.match(/pixelHeight: (\d+)/)?.[1]);
	return w && h ? Math.round((w / h) * 1000) / 1000 : 2;
}

const STYLE_SENTENCE = /^(\d+:\d+|minimal|intimate|extreme|epic|grand|original|traditional|korean webtoon|painterly|white paper|off-white|no pasted|no faces|story:|dramatic|composed|face only|match the|style|cinematic|webtoon|not |mise-en-sc|lens|lighting|light|chiaroscuro|dutch|one hard|crushed|use |if |do not|never|ignore|keep )/i;
function sceneSentence(prompt) {
	let s = prompt ?? '';
	for (const cut of ['CANON —', 'HEEWON STYLE: a Korean', 'EVERY FRAME A PAINTING', 'MANGA ACTION FRAME', 'Same film stock']) {
		const i = s.indexOf(cut, 20);
		if (i > 0) s = s.slice(0, i);
	}
	return s.replace(/^HEEWON STYLE\.?\s*/i, '');
}

function altOf(item) {
	if (item.alt) return item.alt;
	const text = sceneSentence(prompts[item.file] ?? item.desc).replace(/\s+/g, ' ');
	const sentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
	const pick = sentences.find((s) => s.length > 25 && !STYLE_SENTENCE.test(s) && !/\bwrong\b|\bonly if\b/i.test(s)) ?? sentences.find((s) => /Story:/.test(s))?.replace(/^.*?Story:\s*/, '');
	const alt = (pick ?? '').replace(/^ONE (graphic )?device:\s*/i, '').replace(/#[0-9a-f]{6}/gi, '').replace(/\s+/g, ' ').trim();
	return alt ? (alt.length > 170 ? `${alt.slice(0, 167).replace(/\s+\S*$/, '')}…` : alt) : `${item.scene.replace(/-/g, ' ')} — scene still`;
}

function idOf(file) {
	const base = path.basename(file).replace(/\.(png|jpe?g|webp)$/i, '').replace(/_/g, '-').toLowerCase();
	let id = base.startsWith('scene-') ? base : `scene-${base}`;
	for (let n = 2; ids.has(id); n++) id = `${base}-${n}`;
	ids.add(id);
	return id;
}

const added = [];
const skipped = [];
for (const item of plan) {
	const entry = entries.get(item.episode);
	const disk = path.resolve('static' + item.file);
	if (!entry || !item.anchor || !fs.existsSync(disk)) {
		skipped.push(`${item.file} (${!entry ? 'no episode' : !item.anchor ? 'no anchor' : 'missing file'})`);
		continue;
	}
	const slot = {
		id: idOf(item.file),
		ratio: ratioOf(disk),
		...(item.file.startsWith('/temp/') ? { tempImage: item.file } : { src: item.file }),
		alt: altOf(item),
		at: item.anchor,
		...(prompts[item.file] ? { prompt: prompts[item.file] } : {})
	};
	entry.images ??= [];
	let at = -1;
	entry.images.forEach((im, i) => {
		if (im.at === item.anchor) at = i;
	});
	entry.images.splice(at < 0 ? entry.images.length : at + 1, 0, slot);
	added.push(`${item.episode} ← ${slot.id}`);
}

console.log(`added ${added.length}, skipped ${skipped.length}`);
if (skipped.length) console.log(skipped.join('\n'));
if (!dry) {
	fs.mkdirSync(path.dirname(BACKUP), { recursive: true });
	if (!fs.existsSync(BACKUP)) fs.copyFileSync(STORY, BACKUP);
	fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
	console.log(`wrote story.json (backup ${path.relative(process.cwd(), BACKUP)})`);
}
