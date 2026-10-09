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

const DIR = 'scripts/.cache/intro-stills';
const SHEET = 'scripts/.cache/posters/sheet.py';

const OPEN = `HEEWON STYLE — a KOREAN WEBTOON character-introduction splash PAINTED like a premium digital painting, the look of a dramatic manhwa cover. A 2:1 movie frame composed for a 2:1 letterbox crop (nothing important at the top or bottom edge). MEDIUM CLOSE SHOT of ONE character — waist-up or seated — the face large and razor-sharp, placed off-centre on a third with breathing room on the side they look toward, seen from a dramatic camera angle (low three-quarter, worm's-eye or over-the-shoulder), never a flat straight-on catalogue pose. THE FACE is drawn exactly like the attached character sheet: the same clean confident ink linework and manhwa face design (eye shape, brows, nose, jaw, hairline and hair), recognisably that character, wearing the same clothes. EVERYTHING ELSE IS PAINTED: visible textured brushwork — loose digital-paint strokes and dry-brush, charcoal-like hatching that follow every fold of the silk and every plate of armour, the shadows built from layered strokes, the brightest ridges laid in with single confident strokes, a faint paper-and-canvas grain; at the edges of the garments the linework breaks into loose sketchy strokes. NOT flat cel-shading, NOT smooth airbrushed gradients, NOT a clean vector look, NOT photoreal, NOT 3D.`;

const TAIL = `BACKGROUND AND LIGHT (painterly tenebrism): the background IS the place and the moment of the scene — open sky if they are in the sky, the hall if they are in a hall, the gate, the river, the snow — painted loosely in atmospheric brushwork (drifting smoke, cloud, haze, mist, falling snow, embers) in the scene's own colours, soft and out of focus, with a faint bokeh of small lights; it has colour, weather and depth — never a flat black void, never a detailed set, never a crowd. ONE hard directional key light that belongs to the place (a brazier, a lamp, the sun through cloud, a torch, moonlight) rakes across the face and clothes from the side or from below, modelling them in high contrast with deep painted shadows and a thin edge of the same light along the silhouette. The character's colour lives in that light and in the atmosphere around them — never a glow aura or halo. The FACIAL EXPRESSION and BODY LANGUAGE carry the line they are about to say. Face and clothes from the sheet; a new pose, never the sheet's stance. ONLY THIS ONE PERSON is the subject — anyone else is at most a dark out-of-focus shape at the frame edge, dressed in period clothing of their own court (Korean, Tang or Yamato), never European dress. No text, no speech bubbles, no panel borders, no watermark.`;

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
