// Scene stills in the intro-card look (painted webtoon), for the new story beats.
//   node scripts/.cache/scene-stills/build.mjs prompts <group> [id…]  → refs sheet + prompt file per still
//   node scripts/.cache/scene-stills/build.mjs slots <group>          → image slots on the entries (locked write)
//   node scripts/.cache/scene-stills/build.mjs todo <group>           → stills that can be generated and are not installed
//   node scripts/.cache/scene-stills/build.mjs install <group>        → assets/<id>.jpg → static/temp/<id>.jpg (2:1) + tempImage
// A group is scripts/.cache/scene-stills/<group>.json:
//   [{ "id", "entry": "<entry title>", "at": "<fragment of the block it sits beside>", "alt", "scene",
//      "people"?: ["muryuk", "gulgul:young"], "with"?: ["place:daegaya", "dress:silla"], "sword"?: true, "battle"?: true,
//      "time"?: "night" | "day",      (time sets the ground: black at night, white by day)
//      "action"?: true,               (battle beat: BATTLE_ACTION — fire, armies, motion, faces acting, real sea)
//      "manga"?: true,                (hunt/duel beat: MANGA_ACTION — speed lines, faces acting; not fleet grammar)
//      "style"?: "moment",            (white-void hwarang ECU: MOMENT_OPEN/TAIL, face only, no place boards)
//      "hat"?: false,                 (no jougwan: indoors undressed, bathing, sleeping)
//      "style"?: "ink",               (myth beat: scene + faces + HEEWON_MYTH_INK, no webtoon frame)
//      "style"?: "webtoon",          (intro-card webtoon: identity from the sheet, NEVER photoreal skin)
//      "style"?: "still-life",        (no people: a place or object as metaphor, painted watercolor-and-oil)
//      "silhouette"?: true,           (still-life that allows one faceless shadow-figure as part of the place)
//      "erotic"?: true,               (still-life whose metaphor reads openly as sex, still no nudity or anatomy)
//      "refs"?: ["/research/…jpg"], "refsNote"?: "…",    (object boards placed on the sheet after the faces)
//      "faces"?: { "yushin": "scripts/.cache/refs-small/head_kim_yushin.jpg" },   (head-only crop of the canon portrait, when its armour or sword would leak)
//      "parallel"?: "coronation",     (parallel set across episodes; written to the slot)
//      "layout"?: "<item id>",        (that still, installed or generated, leads the sheet: copy its composition and poses exactly)
//      "spirits"?: ["jinpyung"] }]    (faces on the sheet for ancestral spirits in the frame; not added to the slot's people)
// A still whose named people lack a ch_* portrait stays a placeholder slot carrying its prompt.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildCanon } from '../../visual-canon.mjs';
import { HOUSE_RATIO, cropArgs, imageSize } from '../../crop-ratio.mjs';
import { ASSETS, RING_SWORD, brief, personBlocks } from '../rel-tenebrist.mjs';
import { BATTLE_ACTION, MANGA_ACTION, MOMENT_OPEN, MOMENT_TAIL, SCENE_OPEN, SCENE_TAIL, WEBTOON_SCENE_OPEN, WEBTOON_SCENE_TAIL, groundOf } from '../intro-stills/style.mjs';
import { editStory, loadStory } from '../story-ops.mjs';
import { HEEWON_MYTH_INK } from '../../../src/lib/promptHouse.ts';

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
// Canon boards that ride on the sheet's second row, one of each kind, with how the prompt names them.
const BOARD_KINDS = [
	{ test: /^\/pl_/, max: 2, note: (b) => `place board ${b.replace(/^\/|\.\w+$/g, '')} (keep this exact architecture and ground)` },
	{ test: /^\/ref_hanbok_/, note: () => 'costume chart (cut and shape only; ignore its labels, poses and faces)' },
	{ test: /^\/hat_jougwan_types/, note: () => 'jougwan feather-cap board (shape only, ignore labels)' },
	{ test: /^\/bn_/, max: 2, note: (b) => `binyeo board ${b.replace(/^\/bn_|\.\w+$/g, '')} (her hair ornament exactly; not clothing)` },
	{ test: /^\/(ref_crown_|crown_)/, note: () => 'crown reference (shape only)' }
];
// Canon lines the scene prompt carries whole: banner colours and ship designs with their true sizes.
// Flags stay words only: a flag board on the sheet gets painted onto the wrong side's ships, and the Tang one gets lettered.
const CANON_LINES = /^(Kingdom banners|SHIPS:)/;
// Figure-free stills (a place or an object carrying the beat by metaphor): the painted world without the webtoon figure frame.
const STILL_LIFE_SUBJECT = {
	empty: 'PAINTED STILL — no people, no figures, no faces, no hands anywhere in the frame; the place or object IS the subject.',
	silhouette:
		'PAINTED STILL — no faces and no recognisable person: the only figure is one anonymous dark silhouette, a shadow-shape against the light that belongs to the place; the place or object IS the subject.'
};
const STILL_LIFE =
	'A 2:1 movie frame composed for a 2:1 letterbox crop (nothing important at the top or bottom edge). Hand-painted WATERCOLOR-AND-OIL: granulated wet-in-wet washes and broken-colour dabs for sky, water and stone, dry-brush texture, soft bleeding edges and a faint paper grain; oil glazes deepen the darks and a touch of impasto lands on the single brightest highlight. Romantic-painting layout: one bold shape, at least half the frame quiet negative space, distant detail dissolving into haze. Film tenebrism: one hard directional key (sun, moon or lamp) against big dark masses, a thin edge of real light along the subject, painted bokeh from small real lights. Beautiful, luminous, painterly. NOT photoreal, NOT 3D, NOT a cartoon. No text. No watermark.';
const STILL_LIFE_TONE = {
	suggestive: 'Sensual and suggestive by shape and motion alone, never anatomical, never explicit.',
	erotic:
		'Openly erotic metaphor: the shapes, wetness, swelling, thrusting and release unmistakably read as bodies and sex, the way a frank erotic painting does — yet everything stays landscape and object, no nudity, no literal anatomy.'
};
const faceOf = (id, year) => buildCanon([id], { year }).refs.find((r) => /^\/ch_/.test(r) && !/placeholder/.test(r));
const installed = (id) => fs.existsSync(`${TEMP}/${id}.jpg`);

const layoutFileOf = (id) => [`${TEMP}/${id}.jpg`, path.join(ASSETS, `${id}.jpg`)].map((p) => path.resolve(p)).find((p) => fs.existsSync(p));
const PARALLEL_FRAME =
	'PARALLEL FRAME: the LAYOUT picture on the sheet is the master of a set of frames that recur across this story. Repaint ITS EXACT COMPOSITION: the same camera height, angle and lens, the same framing, the same number of figures in the same positions, sizes and poses, the same main shapes (gate, line, dais, table, waterline) in the same places, the same direction of the key light. Only the people, their faces and dress, the place and the hour change, so the two frames line up like a before-and-after. Ignore the layout picture\'s faces, clothes and colours.';

function prompt(item, year) {
	const people = item.people ?? [];
	const faces = [
		...people.map((id) => ({ id, face: item.faces?.[id] ? path.resolve(item.faces[id]) : faceOf(id, year) })),
		...(item.spirits ?? []).map((id) => ({ id, face: faceOf(id, year), spirit: true }))
	];
	const layout = item.layout ? layoutFileOf(item.layout) : null;
	const missing = [...faces.filter((f) => !f.face).map((f) => f.id), ...(item.layout && !layout ? [`layout:${item.layout}`] : [])];
	const canon = buildCanon([...people, ...(item.spirits ?? []), ...(item.with ?? [])], { year, sword: !!item.sword, battle: !!item.battle, ...(item.hat === false ? { hat: false } : {}) });
	const briefs = personBlocks(canon.text).map(brief);
	const blocks = canon.text.split(' | ').map((b) => b.replace(/^CANON — /, ''));
	const place = blocks.find((b) => /^PLACE /.test(b));
	const canonLines = blocks.filter((b) => CANON_LINES.test(b));
	const shown = faces.filter((f) => f.face);
	const ships = canon.refs.filter((r) => r.startsWith('/ship_'));
	const objects = [...(item.refs ?? []), ...ships];
	const sheetBoards = BOARD_KINDS.flatMap(({ test, max = 1 }) => canon.refs.filter((r) => test.test(r)).slice(0, max));
	const boards = item.style === 'moment' || item.style === 'webtoon' ? [...(item.refs ?? [])] : [...objects, ...sheetBoards];
	const boardNote = boards
		.map((b) => (objects.includes(b) ? `${b.replace(/^\/|\.\w+$/g, '')} (${item.refsNote ?? 'copy its exact shape'})` : BOARD_KINDS.find(({ test }) => test.test(b)).note(b)))
		.join(', ');
	const order = ['LEFT', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH'];
	const top = [
		...(layout ? ['LAYOUT picture (copy its composition, not its people)'] : []),
		...shown.map((f) => `face = ${f.id.split(':')[0]}${f.spirit ? ' (an ancestral spirit in the frame)' : ''}`)
	];
	const who = [
		top.length ? `REFERENCE SHEET. TOP ROW, left to right: ${top.map((t, i) => `${order[i] ?? `#${i + 1}`} ${t}`).join(', ')}.${shown.length ? (item.style === 'webtoon' ? ' Identity only (hair, clothes, bones); REDRAW as webtoon, never photographic skin.' : ' Copy each face exactly; give each person the dress the scene names.') : ''}` : 'REFERENCE SHEET.',
		boards.length ? `${shown.length ? 'SMALLER SECOND ROW' : 'TOP ROW'}, left to right: ${boardNote}.` : '',
		item.sword ? 'BOTTOM ROW: the only sword design.' : ''
	]
		.filter(Boolean)
		.join(' ');
	const text = (
		item.style === 'ink'
			? [item.scene, who, HEEWON_MYTH_INK]
			: item.style === 'webtoon'
				? [WEBTOON_SCENE_OPEN, item.scene, who, WEBTOON_SCENE_TAIL, groundOf(item.time)]
			: item.style === 'still-life'
				? [item.scene, STILL_LIFE_SUBJECT[item.silhouette ? 'silhouette' : 'empty'], STILL_LIFE_TONE[item.erotic ? 'erotic' : 'suggestive'], STILL_LIFE, groundOf(item.time)]
				: item.style === 'moment'
					? [MOMENT_OPEN, item.scene, who, MOMENT_TAIL]
					: [SCENE_OPEN, layout ? PARALLEL_FRAME : '', item.scene, item.manga ? MANGA_ACTION : '', item.action ? BATTLE_ACTION : '', who, ...briefs, place ?? '', ...canonLines, item.sword ? RING_SWORD : '', SCENE_TAIL, groundOf(item.time)]
	)
		.filter(Boolean)
		.join(' ');
	let sheet = null;
	if (!missing.length && (top.length || boards.length || item.sword)) {
		const faceRow = [...(layout ? [layout] : []), ...shown.map((f) => f.face)];
		const args = [SHEET, item.id, ...(faceRow.length ? [...faceRow, '--row'] : []), ...boards, ...(item.sword ? ['--sword'] : [])];
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
			if (item.parallel) slot.parallel = item.parallel;
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
