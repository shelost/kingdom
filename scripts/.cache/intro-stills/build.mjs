// Character intro stills: one dark manhwa splash per character card (kind: 'card'), staged in the
// moment the card appears — the relationship boards' look, one character, a faint bokeh of the place.
//   node scripts/.cache/intro-stills/build.mjs <key…>            → refs sheet + prompt file per card
//   node scripts/.cache/intro-stills/build.mjs --todo            → keys with a scene and no still yet
//   node scripts/.cache/intro-stills/build.mjs --unwritten       → keys with no scene yet
//   node scripts/.cache/intro-stills/build.mjs --install <key…>  → assets/<key>.jpg → static/intro/<key>.jpg (2:1) + card.still
// Scenes live in scenes*.json beside this file: { "<key>": { "scene": "…", "sword"?: true, "with"?: ["place:ansi"] } }.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildCanon } from '../../visual-canon.mjs';
import { HOUSE_RATIO, cropArgs, imageSize } from '../../crop-ratio.mjs';
import { ASSETS, RING_SWORD, brief, personBlocks } from '../rel-tenebrist.mjs';
import { cardKey, eachCard, readStory, stillPath, writeStory } from './cards.mjs';
import { INTRO_OPEN as OPEN, INTRO_TAIL as TAIL } from './style.mjs';

const DIR = 'scripts/.cache/intro-stills';
const SHEET = 'scripts/.cache/posters/sheet.py';

const scenes = () =>
	Object.assign(
		{},
		...fs
			.readdirSync(DIR)
			.filter((f) => /^scenes.*\.json$/.test(f))
			.sort()
			.map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')))
	);

const cards = () => new Map([...eachCard()].map((c) => [cardKey(c), c]));
const hasStill = (key) => fs.existsSync(`static${stillPath(key)}`);

function build(key, card, s) {
	const { block, year } = card;
	const id = block.look ? `${block.person}:${block.look}` : block.person;
	const canon = buildCanon([id, ...(s.with ?? [])], { year: year ?? undefined, sword: !!s.sword });
	const face = canon.refs.find((r) => /^\/ch_/.test(r) && !/placeholder/.test(r));
	const [person] = personBlocks(canon.text);
	const place = canon.text.split(' | ').find((b) => /^(CANON — )?PLACE /.test(b));
	const name = person?.split(' — ')[0].trim() ?? block.person;

	let sheet = null;
	if (face) {
		const args = [SHEET, key, face, ...(s.sword ? ['--sword'] : [])];
		sheet = execFileSync('python3', args, { encoding: 'utf8' }).trim().split('\n').pop();
	}
	const who = face
		? `CHARACTER SHEET (copy this face, hair and clothes exactly): the sheet shows ${name}${s.sword ? '; its bottom row is the only sword design' : ''}.`
		: `No character sheet: draw ${name} from the description below, in the same manhwa style.`;
	const prompt = [OPEN, s.scene, who, person ? brief(person) : '', place?.replace(/^CANON — /, '') ?? '', s.sword ? RING_SWORD : '', TAIL]
		.filter(Boolean)
		.join(' ');
	fs.mkdirSync(`${DIR}/prompts`, { recursive: true });
	fs.writeFileSync(`${DIR}/prompts/${key}.txt`, prompt);
	return { key, sheet, prompt: `${DIR}/prompts/${key}.txt`, output: `${key}.jpg`, chars: prompt.length };
}

/** GenerateImage output (assets/<key>.jpg) → centre-cropped 2:1 static/intro/<key>.jpg, and the card points at it. */
function install(keys) {
	const story = readStory();
	const byKey = new Map([...eachCard(story)].map((c) => [cardKey(c), c]));
	fs.mkdirSync('static/intro', { recursive: true });
	for (const key of keys) {
		const card = byKey.get(key);
		const src = `${ASSETS}/${key}.jpg`;
		if (!card || !fs.existsSync(src)) {
			console.log(key, card ? 'no generated image' : 'unknown card');
			continue;
		}
		const dest = `static${stillPath(key)}`;
		execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '85', ...cropArgs(src, HOUSE_RATIO), src, '--out', dest]);
		card.block.still = stillPath(key);
		console.log(key, '→', dest, imageSize(dest));
	}
	writeStory(story);
}

const args = process.argv.slice(2);
if (args[0] === '--install') install(args.slice(1));
else if (args[0] === '--todo' || args[0] === '--unwritten') {
	const s = scenes();
	const keys = [...cards().keys()].filter((k) => (args[0] === '--todo' ? s[k] && !hasStill(k) : !s[k]));
	console.log(keys.join('\n'));
} else {
	const all = cards();
	const s = scenes();
	for (const key of args) {
		if (!all.has(key)) throw new Error(`unknown card ${key}`);
		if (!s[key]) throw new Error(`no scene for ${key}`);
		console.log(JSON.stringify(build(key, all.get(key), s[key])));
	}
}
