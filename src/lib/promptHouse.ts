/**
 * Living house suffix rebuilt from /grade keep/cut notes.
 * Appended to new stills so taste does not have to be retyped each call.
 */
import type { GradeAxes, GradeAxisId, GradeTagId, ImageGrade, ImageGradeStore } from '$lib/imageGrades';

export const COPY_CHIPS = [
	'one hard key / chiaroscuro',
	'high contrast, crushed blacks, not an even wash',
	'iconic one-device layout, not a standing lineup',
	'color symbolism: hex as hard key / bounce / specular in the dark — not a glow aura',
	'cinematography: dutch, worm’s-eye, bokeh, mise-en-scène',
	'sharp foreground / midground people / background giwa in bokeh',
	'Jumong grins, laughs, easy eyes — laid-back, not a grim founder',
	'dramatic pose — dutch, worm’s-eye, lower-third, not standing',
	'over-shoulder or from behind',
	'new pose, not the portrait stance',
	'movie insert (hands, cups, flame)',
	'round floor table, one flame',
	'real Korean place a camera could stand in',
	'one gesture in empty space',
	'two-shot across one lamp',
	'dynamic poses, mythology-scale layout'
] as const;

export const BAN_CHIPS = [
	'white / pale studio void as a room',
	'pasted portrait pose or clasped-hands clone',
	'copy-pasted reference as a fashion plate',
	'flat even-daylight postcard wide',
	'photoreal / 3D render',
	'rectangular conference table',
	'extra tables or extra braziers',
	'hwarang headband in council',
	'European crown / tiara',
	'even well-lit studio',
	'halo / bloom / glow aura / emissive skin around figures',
	'graphic poster / split-screen / black-triangle overlay',
	'photoreal live-action or 3D archviz',
	'busy extras crowding an iconic frame',
	'muddy same-hue wash on every figure',
	'symbol with no scene (floating crown, pinstripe sword)',
	'wrong Cheomseongdae (lighthouse / ziggurat)',
	'duplicate of the same named person in one still',
	'figure standing inside a well shaft',
	'Jumong as a grim statue / dead-eyed founder mask',
	'katana / tsuba / reversed handle-blade / oversized 환두대도 (must stay sw_bidam 1:3 hip sword)'
] as const;

/** “Heewon style”: anime render × Romanticist canvas layout × film tenebrism. Leads every house suffix. */
export const HEEWON_STYLE =
	'HEEWON STYLE: a Korean WEBTOON figure painted into a European OLD-MASTER canvas, composed like a Romanticist master painting. FIGURES are webtoon / anime: clean digital-ink linework, simplified webtoon faces with expressive eyes, shaded in soft watercolor washes and translucent oil glazes instead of flat cel fill — no skin pores, no photographic detail, not photoreal, not 3D. THE WORLD is painted with European old-master technique — Renaissance and Baroque oil (Titian, Rembrandt, Tiepolo, Turner): visible broken-colour brushwork, skies scumbled from short loaded dabs, layered glazes in the darks, sfumato edges, a touch of impasto on the brightest highlights — over watercolor wet-in-wet blooms, pigment granulation and faint paper grain; edges of the frame dissolve into paint. BACKGROUND AND FOREGROUND are a high-contrast Renaissance / Baroque TENEBRIST OIL PAINTING in their own right (Caravaggio, Georges de La Tour, Rembrandt, late Titian): a warm umber-to-black ground; walls, timber, stone, drapery, tables and the dark foreground shapes modelled in glazed oil and pulled out of the darkness by the one candle, lamp or window, with soft sfumato falloff into black — the webtoon figures are set INTO that old-master oil space, lit by the same key and sharing its shadows, never pasted onto a flat backdrop. LAYOUT is Romanticism (Delacroix, Géricault, Friedrich, Goya, Turner): heroic diagonal or pyramid composition, small figures against a sublime storm sky or vast field, extreme foreshortening (worm’s-eye from the dirt or straight down from above), one break in the clouds or one shaft as the key. LIGHT is movie tenebrism at full strength (Caravaggio, Rembrandt, night-interior cinema): an extreme value range — inky blacks right beside small near-white highlights, almost no middle grey; 70–80% of the frame in deep painted shadow (oil-glazed umber, indigo and black); ONE hard directional key (a lamp, a single cloud-break, a low sun shaft, firelight) carves the subject out of the dark. Form is modelled: the key wraps around cheekbones, armor plates, horse muscle and silk folds, then falls off at a hard terminator; a thin edge of that same real light grazes the far side of the silhouette to lift it off the background (never a glow outline); long raking shadows. Default hour is dusk, night, storm or pre-dawn — never flat overcast, never even daylight, never a bright open sky filling the frame. DEPTH is three planes in every still: a dark out-of-focus FOREGROUND shape near the lens (shoulder, rein, post, grass, smoke) framing the shot; the subject razor-sharp in the MIDGROUND; the BACKGROUND melting into soft wash and atmospheric haze, with round painted BOKEH discs wherever small lights sit behind the subject (lamps, torches, embers, sparks, rain, wet highlights). Shallow depth of field, overlapping shapes and receding haze so the frame goes back in space — never flat, never every plane in equal focus. SEPARATION: subject and background never share a value — a lit figure against a background pushed two steps darker, or a near-black silhouette against the one bright break; foreground shapes almost black; the eye lands on the subject first. COLOR SYMBOLISM reads at a glance: each kingdom\'s colour lives in its banners and cloth (Silla blue, Baekje yellow, Goguryeo red, Tang vermilion and gold), each named person\'s hex in the key light on them, and the rest of the frame stays desaturated umber, slate and black so those few colours sing. FACES stay drawn: match the attached portrait\'s line weight, eye shape and simplification exactly — if a face starts to read as a photograph, flatten it back to ink line and wash; extras are drawn the same way, never photographic. HORSES are drawn to be admired: the whole body readable, arched neck, deep chest, round haunch, clean legs in a true gait, muscle modelled by the key with a bright edge along the topline.';

/** Canon from the Jumong remake batch (high contrast, one device, dramatic pose, hex as real-light accent). */
const HOUSE_BASE =
	HEEWON_STYLE +
	' 2D animated cel-painterly cinema, not photoreal, not live-action, not 3D CGI. Same film stock every still: a CAMERA in a real Korean place — anamorphic 2:1 movie frame, shallow DOF, creamy bokeh, rack-focus, film grain, crushed blacks, ONE hard key, long shadows, tenebrism. MOVIE FRAME of the scene a DP could stand in — NEVER a graphic poster, split-screen collage, 3D architectural visualization, black-triangle overlay, spotlight cone deleting the landscape, or neon outline. NO halo, bloom, glow aura, rim-aura, emissive skin, or god-ray envelope around people — character hex is the color of REAL LIGHT in the dark (key bounce, specular on silk/armor/wet stone, a lamp, a shaft, a floor reflection), never a body halo, never magic outline, never neon-painting the figure. FACE ONLY from the attached portrait — silk/hanbok may match; NEVER copy the portrait stance, clasped hands, 3/4 fashion lineup, or a standing clone. Invent a new DRAMATIC body every still (mid-stride, kneel, full-draw, turn, tumble, lean, count, dutch, worm’s-eye, lower-third). CINEMATOGRAPHY: name the shot — dutch angle, worm’s-eye, crane, over-shoulder, rack focus, shallow DOF / bokeh, chiaroscuro, mise-en-scène, long-shadow key. HIGH CONTRAST: crushed blacks + one hard key / long shadows / tenebrism — not even daylight wash, not a flat tourist postcard. ICONIC MINIMAL means one architectural device a lens can see (road, column, waterline, gate, hall axis) plus empty negative space — not deleting the world. COLOR SYMBOLISM: hex tints the hard key / catchlight / bounce — NEVER a glow aura, NEVER recolor the attached portrait’s garments (Sosuno stays dusty-rose hanbok, Geumwa stays red-burgundy court silk, not gold paint). FACE AND CLOTHES match the attached ch_*.png. One of each named person — NEVER clone or duplicate a character. People stand on packed earth at a well RIM — NEVER inside the well shaft. Jumong is fun-loving and laid-back: grin, laugh, wink, easy eyes — not a grim founder mask. BATTLE ARMOR: metallic GRAY steel lamellar (attached steel-armor ref); cloth peeks in the character hex — not gold-painted plate, not glowing armor, not a standing armor catalog. RING-POMMEL SWORDS: one-handed hip 환두대도 from attached sw_bidam.png — handle:blade 1:3; order is RING (pommel at heel of fist) → short grip → thin gold collar → long blade → point. Never reverse handle and blade. Never a tsuba disc in the middle. Never taller than the person. sword_*.png is a pommel ECU only — do not attach it on full-blade stills. Ignore swords on face portraits. Two people = two garment-true figures against crushed black. Real Korean architecture or a locked dark room. No army. No readable text. No watermark.';

const NOTE_TO_COPY: Array<[RegExp, string]> = [
	[/contrast|lighting|movie poster|chiaroscuro|hard key/i, 'one hard key / chiaroscuro, movie-poster contrast'],
	[/close up movie|movie style|cinematograph|dutch|bokeh|mise.?en.?sc/i, 'cinematography: named angle, bokeh, mise-en-scène'],
	[/iconic, simple|memorable|good iconography/i, 'one gesture in empty space — iconic and simple'],
	[/3d depth|good 3d/i, 'real spatial depth, objects receding'],
	[/good layout|alternate poses|background/i, 'new camera pose in a real place, not a portrait paste'],
	[/round|overhead|color symbolism/i, 'color symbolism: hex as hard key / bounce / specular — not a glow aura'],
	[/dynamic pose|mythology.?like|mythology-scale|mytholog/i, 'dramatic poses in a mythology-scale one-device layout']
];

const NOTE_TO_BAN: Array<[RegExp, string]> = [
	[/white bac|unrealistic setting|pale|too well lit|studio/i, 'no white or pale studio void as a room'],
	[/council should be round|weird color/i, 'Harmony Council is one round floor table in a dark pavilion'],
	[/repetitive character|copy paste|identical to the reference|copy pasted/i, 'no pasted portrait pose — new body every still'],
	[/wrong crowns|european/i, 'Silla tree-antler crown only — no European tiara'],
	[/too realistic|photoreal|3d/i, 'not photoreal, not 3D render'],
	[/glow|halo|bloom|god.?ray|rim.?aura|emissive/i, 'no glow aura, halo, bloom, or emissive skin around figures'],
	[/not iconic|too busy|clutter|not minimal/i, 'iconic minimal — one device, empty frame, lower-third'],
	[/wrong clothes|headband|teal/i, 'correct house dress; no hwarang headband in council'],
	[/two tables/i, 'one locked table — no extra braziers'],
	[/cheomseongda|no context|wrong image and no context/i, 'real bottle-shaped Cheomseongdae plus a story beat'],
	[/too simple and flat|what is this|doensnt make|doesn.t make|too flat/i, 'no floating logo — still must be a movie frame of the scene'],
	[/copy pasted reference|copy.pasted|just standing|fashion plate/i, 'no copy-pasted reference pose — new dynamic body'],
	[/even daylight|tourist postcard|flat wide/i, 'no even-wash postcard — high contrast, one device'],
	[/not grounded|out of context|yellow/i, 'earth places stay real buildings, not color-plane furniture'],
	[/too anime|wrong character reference/i, 'correct face ref, painterly cinema, not chibi'],
	[/boring/i, 'new angle and harder light — not a talking-head clone'],
	[/wrong ages/i, 'correct ages in two-shots']
];

export type PromptHouse = {
	updatedAt: string;
	suffix: string;
	copy: string[];
	ban: string[];
};

export const EMPTY_PROMPT_HOUSE: PromptHouse = {
	updatedAt: '',
	suffix: HOUSE_BASE,
	copy: [],
	ban: []
};

export function layoutOfPrompt(prompt?: string): 'intimate' | 'iconic' | undefined {
	if (!prompt) return undefined;
	const p = prompt.toLowerCase();
	if (p.includes('minimal iconic') || p.includes('iconic minimal') || p.includes('iconic 9:16')) {
		return 'iconic';
	}
	if (p.includes('intimate') || p.includes('close-up') || p.includes('close up')) return 'intimate';
	return undefined;
}

function clip(s: string, max = 90): string {
	const t = s.replace(/\s+/g, ' ').trim();
	if (t.length <= max) return t;
	return `${t.slice(0, max - 1).trim()}…`;
}

function mapLines(text: string, pairs: Array<[RegExp, string]>): string[] {
	const out: string[] = [];
	for (const [re, line] of pairs) {
		if (re.test(text) && !out.includes(line)) out.push(line);
	}
	return out;
}

function pushUnique(list: string[], line: string) {
	const n = clip(line);
	if (!n) return;
	if (list.some((x) => x.toLowerCase() === n.toLowerCase())) return;
	list.push(n);
}

const AXIS_COPY: Record<GradeAxisId, string> = {
	style: 'painterly anime-adjacent cinema, not photoreal, not 3D',
	realism: 'real Korean place a camera could stand in — stone, timber, giwa, packed earth',
	layout: 'one geometric device, dramatic pose (dutch / worm’s-eye / lower-third), not a standing portrait',
	iconography: 'one named geometric device divides the frame',
	iconic: 'monumental emptiness — tiny or lower-third, not a tourist postcard',
	minimalism: 'no army catalog, no palace clutter, few hues',
	pose: 'new dramatic body every still — mid-stride, kneel, full-draw, not a clone',
	face: 'readable expression — want, grimace, flush — not a serene portrait',
	angle: 'named cinematography: dutch, worm’s-eye, OTS, ECU, bokeh',
	colors: 'few hues; hex tints real light (key/bounce/specular), not a glow aura or costume swap',
	lighting: 'one hard key / chiaroscuro, movie-poster contrast'
};

const AXIS_BAN: Record<GradeAxisId, string> = {
	style: 'not photoreal, not 3D render, not chibi',
	realism: 'earth places stay real buildings, not a white void or color-plane furniture',
	layout: 'no pasted portrait stance — invent a new body and camera',
	iconography: 'no floating logo — the still must be a movie frame of the scene',
	iconic: 'no even-wash postcard wide',
	minimalism: 'no army catalog, no furniture dump',
	pose: 'no copy-pasted reference as a fashion plate',
	face: 'no polite-smile beauty plate',
	angle: 'no default eye-level standing shot',
	colors: 'few hues only — no gold-wash, no body halo, no neon figure',
	lighting: 'no even well-lit studio, no pale white room-as-void'
};

const AXIS_TAG: Record<GradeAxisId, GradeTagId> = {
	style: 'pose',
	realism: 'setting',
	layout: 'composition',
	iconography: 'composition',
	iconic: 'composition',
	minimalism: 'composition',
	pose: 'pose',
	face: 'likeness',
	angle: 'composition',
	colors: 'color',
	lighting: 'lighting'
};

const SKIP_RAW = /^(my image|wrong image|what is this|ok|good|bad|nice)$/i;

export type GradeEval = {
	keep: string;
	cut: string;
	tagsWorked: GradeTagId[];
	tagsFailed: GradeTagId[];
};

/** Derive keep/cut/tags from overall + axis scores + one note. */
export function evaluateGrade(score: number, note: string, axes: GradeAxes = {}): GradeEval {
	const copy: string[] = [];
	const ban: string[] = [];
	const tagsWorked: GradeTagId[] = [];
	const tagsFailed: GradeTagId[] = [];
	const text = note.trim();

	for (const id of Object.keys(AXIS_COPY) as GradeAxisId[]) {
		const n = axes[id];
		if (typeof n !== 'number') continue;
		const tag = AXIS_TAG[id];
		if (n >= 8) {
			pushUnique(copy, AXIS_COPY[id]);
			if (!tagsWorked.includes(tag)) tagsWorked.push(tag);
		} else if (n <= 5) {
			pushUnique(ban, AXIS_BAN[id]);
			if (!tagsFailed.includes(tag)) tagsFailed.push(tag);
		}
	}

	if (text && score >= 7) {
		for (const line of mapLines(text, NOTE_TO_COPY)) pushUnique(copy, line);
	}
	if (text && score <= 6) {
		for (const line of mapLines(text, NOTE_TO_BAN)) pushUnique(ban, line);
	}

	if (text && !SKIP_RAW.test(text)) {
		if (score >= 8 && !copy.length) pushUnique(copy, text);
		if (score <= 5 && !ban.length) pushUnique(ban, text);
	}

	if (score >= 8 && !tagsWorked.length) tagsWorked.push('composition');
	if (score <= 5 && !tagsFailed.length) tagsFailed.push('composition');

	return {
		keep: copy.join('; '),
		cut: ban.join('; '),
		tagsWorked,
		tagsFailed
	};
}

export function enrichGrade(grade: ImageGrade): ImageGrade {
	const ev = evaluateGrade(grade.score, grade.note, grade.axes ?? {});
	const keep = ev.keep || grade.keep;
	const cut = ev.cut || grade.cut;
	const tagsWorked = ev.tagsWorked.length ? ev.tagsWorked : grade.tagsWorked;
	const tagsFailed = ev.tagsFailed.length ? ev.tagsFailed : grade.tagsFailed;
	return {
		...grade,
		keep,
		cut,
		tagsWorked,
		tagsFailed,
		tags: [...new Set([...grade.tags, ...tagsWorked, ...tagsFailed])]
	};
}

/** Prompt-ready copy/ban lines from one grade. */
export function lessonsFromGrade(g: ImageGrade): { copy: string[]; ban: string[] } {
	const ev = evaluateGrade(g.score, g.note, g.axes ?? {});
	const copy: string[] = [];
	const ban: string[] = [];
	if (g.keep) pushUnique(copy, g.keep);
	if (g.cut) pushUnique(ban, g.cut);
	for (const line of ev.keep.split(/;\s*/)) pushUnique(copy, line);
	for (const line of ev.cut.split(/;\s*/)) pushUnique(ban, line);
	return { copy, ban };
}

export function rebuildPromptHouse(store: ImageGradeStore): PromptHouse {
	const copy: string[] = [];
	const ban: string[] = [];
	const list = Object.values(store.grades).sort((a, b) =>
		(a.gradedAt < b.gradedAt ? 1 : a.gradedAt > b.gradedAt ? -1 : 0)
	);
	for (const g of list) {
		if (g.source === 'self') continue;
		const lesson = lessonsFromGrade(g);
		for (const line of lesson.copy) pushUnique(copy, line);
		for (const line of lesson.ban) pushUnique(ban, line);
	}
	const copyUse = copy.slice(0, 4);
	const banUse = ban.slice(0, 6);
	const parts = [HOUSE_BASE];
	if (copyUse.length) parts.push(`Copy: ${copyUse.join('; ')}.`);
	if (banUse.length) parts.push(`Never: ${banUse.join('; ')}.`);
	return {
		updatedAt: store.updatedAt || new Date().toISOString(),
		suffix: parts.join(' '),
		copy: copyUse,
		ban: banUse
	};
}

export function withHousePrompt(scene: string, house: PromptHouse | { suffix?: string } | null): string {
	const suffix = house?.suffix?.trim() ?? HOUSE_BASE;
	const base = scene.trim();
	if (!suffix) return base;
	if (base.includes(suffix) || suffix.includes(base)) return base;
	return `${base} ${suffix}`;
}
