/**
 * What kind of scene a still or a run of script is: read from its words, so
 * every still and scene animates without hand-tagging. A still's own `motion`
 * always wins (`$lib/stillMotion`); a plate's or entry's `weather` always wins
 * over the words (`SceneWeather`).
 */
import type { Block, ImageSlot, Moment, Sky, Weather } from '$lib/story';
import { isPlate } from '$lib/story';

export type Mood = 'battle' | 'duel' | 'romance' | 'grief' | 'fire' | 'storm' | 'snow' | 'night' | 'calm';

/** How a scene's script arrives: only the moods that read differently as text. `impact` is a massacre. */
export type TextMood = 'battle' | 'romance' | 'grief' | 'impact' | 'calm';

export type SceneMood = { text: TextMood; weather?: Weather; moment?: Moment };

const WORDS: Record<Exclude<Mood, 'calm'>, RegExp> = {
	duel: /\b(duel|swords?|blades?|hilt|parr(y|ies|ied)|slash(es|ed)?|stab(s|bed)?|lunge[sd]?|single combat|cuts? (him|her) down)\b/gi,
	battle:
		/\b(battles?|armies|army|charge[sd]?|cavalry|siege|soldiers|troops|spears?|arrows?|archers?|banners?|fleets?|warships?|ramparts?|ladders|assault|melee|vanguard|war|clash(es)?|riders|horsemen|sortie|volley)\b/gi,
	romance:
		/\b(kiss(es|ed|ing)?|lovers?|embrace[sd]?|blush(es|ed|ing)?|flirt(s|ed|ing)?|bride|wedding|caress(es|ed)?|desire|naked|bath(es|ing)?|bedchamber|lips|thighs?|seduc\w*|romance|wanting)\b/gi,
	grief: /\b(mourn\w*|grief|griev\w*|weep(s|ing)?|wept|tears|funeral|tomb|graves?|corpses?|dies|died|dying|death|pyre|buried|bury|body home)\b/gi,
	fire: /\b(fires?|flames?|burn(s|ing|ed)?|blaze|embers?|torch(es)?|braziers?|smoke)\b/gi,
	storm: /\b(storms?|rain|thunder|lightning|downpour|tide|waves|gale)\b/gi,
	snow: /\b(snow|winter|frozen|frost|ice|blizzard)\b/gi,
	night: /\b(night|moon|stars?|lanterns?|midnight|starlight)\b/gi
};

/** Tie-break order: the more dramatic reading wins. */
const ORDER: Exclude<Mood, 'calm'>[] = ['romance', 'duel', 'battle', 'fire', 'grief', 'storm', 'snow', 'night'];

function hits(text: string, mood: Exclude<Mood, 'calm'>): number {
	return text.match(WORDS[mood])?.length ?? 0;
}

/** The strongest mood in a piece of text; `calm` below `min` hits. */
export function moodOf(text: string, min = 1): Mood {
	let best: Mood = 'calm';
	let score = min - 1;
	for (const m of ORDER) {
		const n = hits(text, m);
		if (n > score) {
			best = m;
			score = n;
		}
	}
	return best;
}

/** A still's mood, from its id, alt text and anchor line, once they say it twice. Intimate cue art is romance. */
export function stillMood(slot: Pick<ImageSlot, 'id' | 'alt' | 'at' | 'nsfw'>): Mood {
	if (slot.nsfw) return 'romance';
	return moodOf([slot.id.replace(/[-_]/g, ' '), slot.alt ?? '', slot.at ?? ''].join(' '), 2);
}

function plain(b: Block): string {
	if (b.kind === 'p') return b.html;
	if (b.kind === 'dialogue') return (b.en ?? b.lines).join(' ');
	return '';
}

/**
 * Words that put weather in the sky, stricter than the moods: "two winters ago"
 * is not snow, and a council arguing about the war is not a battle on fire.
 */
const SKY = {
	rain: /\b(rain\w*|downpour|drizzle|thunder\w*|storms?)\b/gi,
	snow: /\b(snow\w*|frozen|frost\w*|blizzard|sleet)\b/gi,
	embers:
		/\b(fires?|flames?|burn(s|ing|ed|t)?|blaze|embers?|smoke|charge[sd]?|clash(es)?|melee|volley|sortie|cavalry|siege|ladders|ramparts?|spears?|arrows?|archers?|shields?|horsemen|riders|vanguard|swords?|blades?|lances?|hooves)\b/gi
};

type Scores = Record<Exclude<Mood, 'calm'>, number> & Record<keyof typeof SKY, number>;

/**
 * Weather a scene's own words call for, each with the hits it needs before it
 * counts. Love and sex are never guessed (a wedding list or a stripped prisoner
 * would read as romance): those skies come only from a tag on the line.
 */
const INFERRED: { weather: Weather; min: number; score: (s: Scores) => number }[] = [
	{ weather: 'embers', min: 6, score: (s) => s.embers },
	{ weather: 'rain', min: 2, score: (s) => s.rain },
	{ weather: 'snow', min: 2, score: (s) => s.snow }
];

/** Speakers who are children in the chronicle: their scenes never take the sensual weather, even tagged. */
const MINORS = new Set(['gotaso']);

/** The death escorts: where one speaks, the world drains to the reapers' colour. */
const REAPERS = new Set(['kangrim', 'haewonmek', 'yumla']);
const REAPER_WORDS = /\b(reapers?|Kangrim|Haewonmek|Yumla)\b|저승/;

const isReaper = (b: Block) => b.kind === 'dialogue' && !!b.person && REAPERS.has(b.person);

function scoreScene(run: readonly Block[]): Scores {
	const words = run.map(plain).join(' ').replace(/<[^>]+>/g, '');
	return {
		...Object.fromEntries(ORDER.map((m) => [m, hits(words, m)])),
		...Object.fromEntries(Object.entries(SKY).map(([k, re]) => [k, words.match(re)?.length ?? 0]))
	} as Scores;
}

function inferWeather(s: Scores): Weather | undefined {
	let weather: Weather | undefined;
	let best = 0;
	for (const w of INFERRED) {
		const n = w.score(s);
		if (n >= w.min && n > best) {
			weather = w.weather;
			best = n;
		}
	}
	return weather;
}

function textMood(s: Scores): TextMood {
	const scores: [Exclude<TextMood, 'calm' | 'impact'>, number][] = [
		['romance', s.romance],
		['battle', s.battle + s.duel],
		['grief', s.grief]
	];
	let text: TextMood = 'calm';
	let top = 1;
	for (const [m, n] of scores) {
		if (n > top) {
			text = m;
			top = n;
		}
	}
	return text;
}

/** The block where a reaper enters: their first line, or the narration that brings them on just before it. */
function reaperEntrance(run: readonly Block[]): number {
	const first = run.findIndex(isReaper);
	if (first < 1) return first;
	const before = run[first - 1];
	return before.kind === 'p' && REAPER_WORDS.test(before.html) ? first - 1 : first;
}

const skyOf = (tag: Sky | undefined): Weather | undefined => (tag === 'clear' ? undefined : tag);

/**
 * One scene's blocks. The scene opens on `tag` (or, untagged, whatever its words
 * call for); a line's own `weather` changes the sky from there to the scene's
 * end, and a reaper's entrance turns it to `beyond` with a one-time `death`.
 */
function readScene(run: readonly Block[], tag: Sky | undefined, out: Map<Block, SceneMood>) {
	const s = scoreScene(run);
	const minor = run.some((b) => b.kind === 'dialogue' && !!b.person && MINORS.has(b.person));
	const text = textMood(s);
	const reaper = reaperEntrance(run);
	let weather = tag ? skyOf(tag) : inferWeather(s);
	run.forEach((b, i) => {
		let moment: Moment | undefined;
		if ((b.kind === 'p' || b.kind === 'dialogue') && b.weather) weather = skyOf(b.weather);
		if (i === reaper) {
			weather = 'beyond';
			moment = 'death';
		}
		if ((b.kind === 'p' || b.kind === 'dialogue') && b.moment) moment = b.moment;
		if (minor && (weather === 'heat' || weather === 'love')) weather = undefined;
		out.set(b, { text: weather === 'blood' ? 'impact' : text, weather, moment });
	});
}

/**
 * Each block's scene mood. A scene is the run of blocks between plates; its
 * script reads as battle, romance or grief once the words say so twice. Its
 * weather is the plate's, else its story's, else the episode's, else whatever
 * its words call for, and may change on any line (`readScene`). A flashback is
 * one block of the scene it interrupts: its inside keeps that scene's sky.
 */
export function sceneMoods(blocks: readonly Block[], episodeWeather?: Sky): Map<Block, SceneMood> {
	const out = new Map<Block, SceneMood>();
	let storyWeather: Sky | undefined;
	let run: Block[] = [];
	let runWeather: Sky | undefined;
	const close = () => {
		if (!run.length) return;
		readScene(run, runWeather ?? storyWeather ?? episodeWeather, out);
		run = [];
		runWeather = undefined;
	};
	for (const b of blocks) {
		if (isPlate(b)) {
			close();
			if (b.kind === 'section' || b.kind === 'story') storyWeather = b.weather;
			runWeather = b.weather;
		}
		run.push(b);
	}
	close();
	return out;
}
