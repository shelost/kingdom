// Scene stills in the intro-card look (painted webtoon), for the new story beats.
//   node scripts/.cache/scene-stills/build.mjs prompts <group> [id…]  → refs sheet + prompt file per still
//   node scripts/.cache/scene-stills/build.mjs slots <group>          → image slots on the entries (locked write)
//   node scripts/.cache/scene-stills/build.mjs todo <group>           → stills that can be generated and are not installed
//   node scripts/.cache/scene-stills/build.mjs install <group>        → assets/<id>.jpg → static/temp/<id>.jpg (2:1) + tempImage
// A group is scripts/.cache/scene-stills/<group>.json:
//   [{ "id", "entry": "<entry title>", "at": "<fragment of the block it sits beside>", "alt", "scene",
//      "people"?: ["muryuk", "gulgul:young"], "with"?: ["place:daegaya", "dress:silla"], "sword"?: true, "battle"?: true }]
// A still whose named people lack a ch_* portrait stays a placeholder slot carrying its prompt.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildCanon } from '../../visual-canon.mjs';
import { HOUSE_RATIO, cropArgs, imageSize } from '../../crop-ratio.mjs';
import { ASSETS, RING_SWORD, brief, personBlocks } from '../rel-tenebrist.mjs';
import { SCENE_OPEN, SCENE_TAIL } from '../intro-stills/style.mjs';
import { editStory, loadStory } from '../story-ops.mjs';

const DIR = 'scripts/.cache/scene-stills';
const SHEET = 'scripts/.cache/posters/sheet.py';
const TEMP = 'static/temp';
const QUALITY = '72';
const MAX_EDGE = 1200;

const group = (name) => JSON.parse(fs.readFileSync(`${DIR}/${name}.json`, 'utf8'));
const entries = (story) => story.flatMap((c) => c.entries ?? []);
const yearOf = (y) => {
	const n = parseInt(String(y ?? '').replace(/[^\d-]/g, ''), 10);
	return Number.isFinite(n) ? n : undefined;
};
const faceOf = (id, year) => buildCanon([id], { year }).refs.find((r) => /^\/ch_/.test(r) && !/placeholder/.test(r));
const installed = (id) => fs.existsSync(`${TEMP}/${id}.jpg`);

function prompt(item, year) {
	const people = item.people ?? [];
	const faces = people.map((id) => ({ id, face: faceOf(id, year) }));
	const missing = faces.filter((f) => !f.face).map((f) => f.id);
	const canon = buildCanon([...people, ...(item.with ?? [])], { year, sword: !!item.sword, battle: !!item.battle });
	const briefs = personBlocks(canon.text).map(brief);
	const place = canon.text.split(' | ').find((b) => /^(CANON — )?PLACE /.test(b))?.replace(/^CANON — /, '');
	const shown = faces.filter((f) => f.face);
	const who = shown.length
		? `CHARACTER SHEET, left to right: ${shown.map((f, i) => `${['LEFT', 'SECOND', 'THIRD', 'FOURTH'][i] ?? `#${i + 1}`} face = ${f.id.split(':')[0]}`).join(', ')}${item.sword ? '; its bottom row is the only sword design' : ''}. Copy each face exactly; give each person the dress the scene names.`
		: '';
	const text = [SCENE_OPEN, item.scene, who, ...briefs, place ?? '', item.sword ? RING_SWORD : '', SCENE_TAIL].filter(Boolean).join(' ');
	let sheet = null;
	if (!missing.length && shown.length) {
		const args = [SHEET, item.id, ...shown.map((f) => f.face), ...(item.sword ? ['--sword'] : [])];
		sheet = execFileSync('python3', args, { encoding: 'utf8' }).trim().split('\n').pop();
	}
	return { text, sheet, missing };
}

function prompts(name, ids) {
	const story = loadStory();
	const byTitle = new Map(entries(story).map((e) => [e.title, e]));
	fs.mkdirSync(`${DIR}/prompts`, { recursive: true });
	for (const item of group(name)) {
		if (ids.length && !ids.includes(item.id)) continue;
		const entry = byTitle.get(item.entry);
		if (!entry) throw new Error(`${item.id}: no entry titled ${item.entry}`);
		const { text, sheet, missing } = prompt(item, item.year ?? yearOf(entry.year));
		const file = `${DIR}/prompts/${item.id}.txt`;
		fs.writeFileSync(file, text);
		console.log(JSON.stringify({ id: item.id, placeholder: missing.length > 0, missing, sheet, prompt: file, output: `${item.id}.jpg` }));
	}
}

function slots(name) {
	const items = group(name);
	editStory((story) => {
		const byTitle = new Map(entries(story).map((e) => [e.title, e]));
		for (const item of items) {
			const entry = byTitle.get(item.entry);
			if (!entry) throw new Error(`${item.id}: no entry titled ${item.entry}`);
			const file = `${DIR}/prompts/${item.id}.txt`;
			const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : item.scene;
			const placeholder = (item.people ?? []).some((id) => !faceOf(id, item.year ?? yearOf(entry.year)));
			entry.images ??= [];
			let slot = entry.images.find((im) => im.id === item.id);
			if (!slot) entry.images.push((slot = { id: item.id, ratio: 2 }));
			Object.assign(slot, { at: item.at, alt: item.alt, prompt: text });
			if (item.people?.length) slot.people = item.people.map((id) => id.split(':')[0]);
			if (placeholder && !slot.tempImage) slot.isPlaceholder = true;
		}
	});
	console.log(`slots: ${items.length} in ${name}`);
}

function install(name) {
	const done = [];
	for (const item of group(name)) {
		const src = ['jpg', 'png', 'jpeg'].map((x) => path.join(ASSETS, `${item.id}.${x}`)).find((f) => fs.existsSync(f));
		if (!src) continue;
		const out = `${TEMP}/${item.id}.jpg`;
		execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', QUALITY, ...cropArgs(src, HOUSE_RATIO), src, '--out', out], { stdio: 'ignore' });
		const { w, h } = imageSize(out);
		if (Math.max(w, h) > MAX_EDGE) execFileSync('sips', ['-s', 'formatOptions', QUALITY, '-Z', String(MAX_EDGE), out], { stdio: 'ignore' });
		fs.rmSync(src);
		done.push(item.id);
	}
	editStory((story) => {
		const slotsById = new Map(entries(story).flatMap((e) => e.images ?? []).map((im) => [im.id, im]));
		for (const id of done) {
			const slot = slotsById.get(id);
			if (!slot) continue;
			slot.tempImage = `/temp/${id}.jpg`;
			slot.ratio = HOUSE_RATIO;
			delete slot.isPlaceholder;
		}
		return done.length > 0;
	});
	if (done.length) execFileSync(process.execPath, ['scripts/sync-temp-deploy.mjs'], { stdio: 'inherit' });
	console.log(`installed ${done.length}: ${done.join(', ')}`);
}

function todo(name) {
	const story = loadStory();
	const byTitle = new Map(entries(story).map((e) => [e.title, e]));
	for (const item of group(name)) {
		if (installed(item.id)) continue;
		const year = item.year ?? yearOf(byTitle.get(item.entry)?.year);
		if ((item.people ?? []).some((id) => !faceOf(id, year))) continue;
		console.log(item.id);
	}
}

const [cmd, name, ...rest] = process.argv.slice(2);
if (!name) throw new Error('usage: build.mjs prompts|slots|todo|install <group> [id…]');
const run = { prompts: () => prompts(name, rest), slots: () => slots(name), todo: () => todo(name), install: () => install(name) }[cmd];
if (!run) throw new Error(`unknown command ${cmd}`);
run();
