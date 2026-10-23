// Character intro stills: one dark manhwa splash per character card (kind: 'card'), staged in the
// moment the card appears — the relationship boards' look, one character, a faint bokeh of the place.
//   node scripts/.cache/intro-stills/build.mjs <key…>            → refs sheet + prompt file per card
//   node scripts/.cache/intro-stills/build.mjs --todo            → keys with a scene and no still yet
//   node scripts/.cache/intro-stills/build.mjs --unwritten       → keys with no scene yet
//   node scripts/.cache/intro-stills/build.mjs --style webtoon <key…> → the bold-webtoon trial: prompts/webtoon/<key>.txt, output wt-<key>.jpg
//   node scripts/.cache/intro-stills/build.mjs --install <key…>  → assets/<key>.jpg → static/intro/<key>.jpg (2:1) + card.still
// Scenes live in scenes*.json beside this file: { "<key>": { "scene": "…", "sword"?: true, "with"?: ["place:ansi"] } }.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildCanon } from '../../visual-canon.mjs';
import { HOUSE_RATIO, cropArgs, imageSize } from '../../crop-ratio.mjs';
import { ASSETS, RING_SWORD, brief, personBlocks } from '../rel-tenebrist.mjs';
import { cardKey, eachCard, readStory, stillPath, writeStory } from './cards.mjs';
import { INTRO_OPEN, INTRO_TAIL, WEBTOON_INTRO_OPEN, WEBTOON_INTRO_TAIL, groundOf } from './style.mjs';

const DIR = 'scripts/.cache/intro-stills';
const SHEET = 'scripts/.cache/posters/sheet.py';

/** Each look: its open/tail, where prompts go, the output prefix, and an optional per-person design line. */
const STYLES = {
	house: { open: INTRO_OPEN, tail: INTRO_TAIL, dir: 'prompts', prefix: '', design: {} },
	webtoon: {
		open: WEBTOON_INTRO_OPEN,
		tail: WEBTOON_INTRO_TAIL,
		dir: 'prompts/webtoon',
		prefix: 'wt-',
		design: JSON.parse(fs.readFileSync(`${DIR}/webtoon/signatures.json`, 'utf8'))
	}
};

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

function build(key, card, s, style = STYLES.house) {
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
	const design = style.design[block.person] ? `DESIGN HOOKS for ${name}: ${style.design[block.person]}.` : '';
	const prompt = [style.open, s.scene, who, person ? brief(person) : '', design, place?.replace(/^CANON — /, '') ?? '', s.sword ? RING_SWORD : '', style.tail, groundOf(s.time)]
		.filter(Boolean)
		.join(' ');
	const file = `${DIR}/${style.dir}/${key}.txt`;
	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(file, prompt);
	return { key, sheet, prompt: file, output: `${style.prefix}${key}.jpg`, chars: prompt.length };
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
	const styled = args[0] === '--style';
	const style = styled ? STYLES[args[1]] : STYLES.house;
	if (!style) throw new Error(`unknown style ${args[1]}`);
	for (const key of styled ? args.slice(2) : args) {
		if (!all.has(key)) throw new Error(`unknown card ${key}`);
		if (!s[key]) throw new Error(`no scene for ${key}`);
		console.log(JSON.stringify(build(key, all.get(key), s[key], style)));
	}
}
