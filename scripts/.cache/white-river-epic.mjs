// White River (663) epic batch → manifest for add-image-slots.mjs + install-temp-art.mjs.
// Usage: node scripts/.cache/white-river-epic.mjs && node scripts/.cache/add-image-slots.mjs scripts/.cache/white-river-epic-manifest.json
import fs from 'node:fs';

const ENTRY = 'White River';
const OPEN =
	'HEEWON STYLE, cinematic edition. Minimal iconic 2:1 movie frame, composed for a 2:1 letterbox crop; nothing important at the top or bottom edge. The Baekgang of 663, where Tang, Silla, Baekje and Yamato meet in one water: mythic scale. FIGURES: bold Korean webtoon / anime, clean confident ink outlines, simplified expressive anime faces with big readable emotion, skin in flat cel tones with one shadow; NOT photoreal, no pores, no realistic skin. WORLD AND COSTUME: an old-master tenebrist oil canvas with tactile painted relief: loaded impasto strokes on silk folds, lacquer, beards, timber, wave crests and smoke, dry-brush drag along each fold, glazed umber-black darks, faint canvas grain. LIGHT: extreme chiaroscuro; at least sixty percent of the frame is crushed near-black; ONE practical light (fire, lantern, low sun break) sits close to the subject and rakes across the surfaces the camera sees, throwing a large cast shadow; tiny near-white highlights; round bokeh from embers and lanterns. LAYOUT: bold iconic composition, one graphic device, the subject on a third, vast negative space of black water, smoke or storm sky, an extreme angle (worm’s-eye, straight down, hard dutch, extreme close-up); never eye-level coverage, never even light.';
const MANGA = fs.readFileSync('scripts/.cache/manga-action.txt', 'utf8').trim();
const RIVER = 'place:baekgang';

/** `keep` shots are already graded in; they stay out of the manifest so their slot and prompt are untouched. */
/** @type {Array<{ id: string, at: string, alt: string, scene: string, people?: string[], canon?: object, action?: boolean, keep?: boolean }>} */
const SHOTS = [
	{
		id: 'wr-four-banners',
		at: 'for the first time the West, Samhan, and the East meet in one mouth of water',
		alt: 'Crane shot at dawn over the Baekgang: four kingdoms’ banners converge on one river mouth',
		canon: { with: [RIVER, 'flag:tang', 'flag:silla', 'flag:baekje', 'flag:yamato'] },
		scene:
			'Night-black estuary from an extreme high crane in the last minute before dawn; terrain from the attached place board, but a new camera. ONE device: the river as a single luminous silver S-curve cutting a frame that is seventy percent black mud flat, black reed and black storm cloud. Along the curve, four kingdoms as four tiny points of coloured fire: across the narrow throat a tight dark line of Tang tower-ships with vermilion lanterns; on the east ridge a cluster of Silla-blue torches; on a far hill fortress a few yellow Baekje fires; and from the sea at the lower edge hundreds of small red Yamato lanterns riding in on the tide. One thin cold dawn crack on the horizon. Impasto on the wave crests. No figure larger than a grain of rice.'
	},
	{
		id: 'wr-tortoise-chart',
		at: 'has already learned the river’s grammar',
		alt: 'The Black Tortoise kneels over a silk chart of the river mouth by lamplight, weighing pebbles for ships',
		people: ['liurengui'],
		scene:
			'Interior night, the Tang flagship cabin. Worm’s-eye from the floor planks beside a bronze oil lamp set down near the lens, its flame sharp in the foreground. the Black Tortoise (attached portrait: grey beard, black futou cap, round steel chest discs, slate-green robe, vermilion cloak) kneels large in frame over a plain silk chart with no writing, a row of river pebbles laid across the river throat; he pinches one pebble between two fingers, eyes half-closed, a dry half-smile. The lamp rakes up across his beard, the chest discs and the slate-green silk folds. ONE device: his shadow climbs the curved, slanting hull wall behind him, and with the round chest discs and the plated hull ribs it reads as the huge shell-shadow of a tortoise. Seventy percent umber-black.'
	},
	{
		id: 'wr-yung-rail',
		at: 'I looked at my father.',
		alt: 'Over the Black Tortoise’s shoulder: Yung in a Tang officer’s robe at the rail, staring at an empty sea',
		people: ['liurengui', 'yung'],
		scene:
			'Night on the Tang flagship. Low over-the-shoulder: the Black Tortoise’s armoured shoulder and grey beard as a dark blurred mass at the left edge. Right third, razor sharp: Yung (attached portrait face; Tang officer’s crimson round-collared robe, black futou cap) at the rail beside one hanging iron lantern that lights only the side of his face and his white knuckles on the rail; his eyes on the black sea, the face giving nothing away. ONE device: the rail as one lit diagonal running from the lantern out into an enormous empty black sea and sky filling two thirds of the frame; on the far horizon the first faint string of red Yamato lanterns like low embers. His long shadow down the deck.'
	},
	{
		id: 'wr-silla-charge',
		at: 'I want Silla in the first line.',
		alt: 'Manga action: King Munmu leads the Silla cavalry over the mud flats into the Baekje shore guard',
		people: ['munmu'],
		canon: { battle: true, with: [RIVER, 'flag:baekje'] },
		action: true,
		scene:
			'Worm’s-eye from the mud under the hooves, dawn backlight. ONE device: the low sun break directly behind the charge, so the Silla cavalry wedge is a black silhouette mass against blinding gold spray filling the upper half. King Munmu (attached portrait face; helmed, Silla steel lamellar, red cloth) leads, the only rider lit: the sun edges his helm and the flung mud, and a hard side key from a burning beached Yamato hull at the frame edge rakes his shouting face and sword arm. Forehooves and mud flying at the lens. Sixty percent black silhouette.'
	},
	{
		id: 'wr-yushin-ridge',
		at: 'which is how old generals watch something they no longer need to do themselves',
		alt: 'Old Kim Yushin on his white horse on the ridge, reins loose, watching the shore camp break far below',
		people: ['yushin'],
		canon: { battle: true, with: [RIVER] },
		scene:
			'Friedrich Rückenfigur, extreme wide. Seventy percent of the frame is a towering black-indigo storm sky in granulated wash and glazed oil. ONE device: a single cloud-break shaft falling diagonally across the frame onto the shore far below, where tiny burning hulls glow on the mud flats. Lower-left third: old Kim Yushin (attached portrait) on his white horse on a black grass ridge, seen from behind and below, reins loose in one hand; the white horse is the one pale shape on the dark ridge and the shaft catches his Silla-blue cloth tails. Tiny, still, monumental.'
	},
	{
		id: 'wr-wa-vanguard',
		at: 'They row straight at the Tang line on the evening water',
		alt: 'From a Yamato boat at water level: oarsmen rowing standing up toward the wall of Tang tower-ships',
		canon: { with: [RIVER, 'flag:yamato', 'flag:tang'] },
		scene:
			'Extreme worm’s-eye from the waterline at sunset. ONE device: the Tang tower-ship line as a black cliff of timber filling the upper two thirds of the frame edge to edge, deck castles and VERMILION Tang banners only, against a dying red sun behind it. In the lower third, one small Yamato boat seen from just behind its stern, oarsmen rowing STANDING UP, black-lacquered cuirasses, white headbands; the single red-sun-on-white Yamato banner flies only from this small boat. The water between is a strip of molten copper. Silhouettes edged with the last red light; the nearest oarsmen’s gritted faces in profile, lit by sun bouncing off the water.'
	},
	{
		id: 'wr-first-sight',
		at: 'Watch their oars, not their faces.',
		alt: 'The Black Tortoise on the stern castle studies the first Yamato boats with a scholar’s curiosity',
		people: ['liurengui'],
		canon: { battle: true, with: [RIVER, 'flag:yamato'] },
		scene:
			'Film-noir half-face extreme close-up. the Black Tortoise (attached portrait) fills the right half of the frame in low three-quarter profile, leaning on the stern rail; the low red sunset key cuts across his face so half is lit (a narrowed, curious eye, one dry raised eyebrow, grey beard in impasto strands) and half is black. The left half is negative space: black hull and, far below and out of focus, small Yamato boats with standing rowers as tiny silhouettes and red banner bokeh on copper water. Expression: a scholar seeing a new script for the first time, amused curiosity, not fear.'
	},
	{
		id: 'wr-night-council',
		at: 'The tide turns before noon.',
		alt: 'Night council on deck: the king and the Yamato captains laugh around a lantern; Takutsu alone reads the tide',
		people: ['pung', 'takutsu'],
		canon: { with: [RIVER] },
		scene:
			'Night, worm’s-eye from the deck planks, a paper lantern set down near the lens. ONE device: the gunwale line. Foreground left, large and sharp: Echi no Takutsu (attached portrait) kneeling at the gunwale, turned away from everyone, hand trailing a rope into black water, face lit from below by the lantern, worried eyes on the silver tide lines. Background right, small and soft: King Pungjang (attached portrait) and a ring of Yamato captains huddled around a second lantern, laughing, their huge shadows thrown up across the sail. Seventy percent dark.'
	},
	{
		id: 'wr-tide-turn',
		at: 'the current turning against them',
		alt: 'Bird’s-eye: the ebb turns and shoves the disordered Yamato fleet against the unmoving Tang line',
		canon: { with: [RIVER, 'flag:tang', 'flag:yamato'] },
		scene:
			'Straight-down top view from very high, dark slate water at first light. ONE device: the ebb current painted as huge silver impasto brush strokes sweeping seaward and bending like the coils of a vast animal; at their tip hundreds of small Yamato boats jammed into a disordered crescent, each a tiny dark hull with a red lantern; across the throat the straight black line of Tang tower-ships with vermilion lantern points, unmoving. Seventy percent black-slate water as negative space. No individual figures.'
	},
	{
		id: 'wr-fire-arrows',
		at: 'arrows wrapped for flame',
		alt: 'Manga action: Tang archers loose a volley of burning arrows from a tower-ship',
		canon: { with: ['flag:tang'] },
		action: true,
		scene:
			'Night. Extreme foreshortening along a Tang ship rail, hard dutch tilt. The nearest Tang archer huge in the foreground at full draw, steel helm, mingguang armour with round chest discs, vermilion cloth, NO yellow robes; his face lit from just below by the burning arrowhead beside his cheek, the only light in the frame: gritted teeth, eyes slit. Behind him a diagonal row of archers, each lit only by his own small arrow fire, receding into black. Loosed arrows streak as fire lines across a black sky toward a distant cluster of sails. Seventy-five percent black.'
	},
	{
		id: 'wr-tortoise-ring',
		at: 'a door with two leaves',
		alt: 'Mythic aerial: the Tang wings close into a ring around the burning fleet, shaped like the shell of the Black Tortoise',
		canon: { with: [RIVER, 'flag:tang', 'flag:yamato'] },
		scene:
			'Night, mythic straight-down aerial. Seventy-five percent of the frame is black sea. ONE device: at the centre a tight ring of black Tang hulls, lit from inside by the blazing Yamato fleet trapped within it, a disc of fire; the ring of hulls and oar-banks reads as the plated shell of a colossal tortoise, the flagship its head; a long smoke column curls around the ring like the Xuanwu serpent, lit orange on its underside. The water near the fire runs cinnabar red, fading to black. Real ships and real smoke; the tortoise is only the shape, never a drawn animal, no paper border.'
	},
	{
		id: 'wr-armor-drown',
		keep: true,
		at: 'go into the water in their armour',
		alt: 'Underwater: Yamato soldiers in lacquered armour sink through red water beneath the burning fleet',
		scene:
			'Underwater, looking up from below. Yamato soldiers in black-lacquered iron cuirasses and white headbands sink slowly through red-stained water, arms drifting, one hand still reaching up; silver bubbles rise from their mouths. The surface above is a ceiling of fire: burning hulls and spars seen from below, orange light breaking into wavering shafts through the water. Silence and weight. Few hues: red-black water, orange fire, white bubbles. One sinking figure large in the foreground, others small and fading into the deep.'
	},
	{
		id: 'wr-takutsu-oath',
		keep: true,
		at: 'Long live Kudara',
		alt: 'Echi no Takutsu looks up to heaven and swears on the burning deck as the golden kite circles in the smoke',
		people: ['takutsu'],
		canon: { sword: true, with: ['kinshi'] },
		scene:
			'Worm’s-eye close-up from the burning deck: Echi no Takutsu looks straight up to heaven, swearing, teeth bared and gritted in fury, his white headband tails whipping in the fire-wind, sword gripped low at his side. Above him the burning sail and mast form a towering cathedral of flame; high in the smoke the golden kite circles once, wings spread, catching the firelight. The fire is the one hard key, raking up across his jaw and the black lacquer of his cuirass from below. Embers as bokeh.'
	},
	{
		id: 'wr-takutsu-last',
		at: 'until there is not enough deck left to fight on',
		alt: 'Takutsu fights on the shrinking deck of his burning ship, ringed by Tang hulls',
		people: ['takutsu'],
		canon: { sword: true, with: [RIVER, 'flag:tang'] },
		action: true,
		scene:
			'Night. Low dutch angle at water level. ONE device: the burning ship as a single tower of fire at the centre, the only light, its reflection a red column in black water, ringed by black Tang hull silhouettes. On the last unburned strip of the prow, Echi no Takutsu (attached portrait face, white headband, black-lacquered cuirass) in mid-cut, his straight ring-pommel sword foreshortened in the sweep, a Tang boarder falling back as a silhouette; firelight rakes his face and the lacquer. A huge black mass of smoke above. No gore.'
	},
	{
		id: 'wr-takutsu-headband',
		at: 'and there fell in battle',
		alt: 'Aftermath: Takutsu’s white headband floats on the red water among embers and a single golden feather',
		canon: { with: [RIVER, 'kinshi'] },
		scene:
			'Pre-dawn, almost black, camera at the water surface. ONE device: the white headband floating as a single bright S-curve on black-red water, lit by one last ember drifting beside it; a single gold-barred kite feather catches the same ember. Eighty percent of the frame is black water and black smoke; far behind, two thin smoke columns and the faint ribs of burned wooden hulls against a thin cold dawn crack. Impasto on the cloth folds and the ripples. No people.'
	},
	{
		id: 'wr-pung-flight',
		at: 'He leaves behind his fleet, his allies, his capital on the hill, and his sword.',
		alt: 'Pung flees north in a small boat through the smoke, looking back at the burning fleet',
		people: ['pung'],
		canon: { with: [RIVER] },
		scene:
			'Night. Low angle from the floorboards of a small boat. King Pungjang (attached portrait) large in frame, crown askew, twisted to look back over his shoulder; the burning river behind him is the one hard key, raking one side of his face and the gold crown ornament while the other side falls to black; empty open hands on his knees, a bare belt with nothing on it. ONE device: the black smoke corridor the boat flees into, narrowing to a dark point in the north. Rowers as dark silhouettes. Fire bokeh.'
	},
	{
		id: 'wr-brothers-river',
		at: 'He was always better at being sent away than I was.',
		alt: 'The two brothers divided by a column of smoke: Yung still on the Tang deck, Pung small in the fleeing boat',
		people: ['yung', 'pung'],
		canon: { with: [RIVER] },
		scene:
			'Dusk falling to night. ONE device: a vertical black smoke column dead centre splits the frame. Left third, close and low-angle: Yung (attached portrait face; Tang crimson robe, black futou cap) standing still on the Tang deck, holding a worn straight ring-pommel sword upright in both hands, lit by fire from below-right. Right third, far and tiny: Pung’s small boat on black water, one dot of lantern, rowing into slate haze. Firelight on the water at the base of the column is the only warm light; both men look toward the smoke, not at each other.'
	},
	{
		id: 'wr-sangji-wall',
		at: 'The north wall is the low one.',
		alt: 'Heukchi Sangji, now with the Tang, points his spear at the low north wall of Imjon he once built',
		people: ['sangji'],
		canon: { battle: true, with: ['flag:tang', 'dress:baekje'] },
		scene:
			'Stormy dusk at Imjon. Extreme worm’s-eye from the slope beneath. ONE device: Heukchi Sangji’s spear as one long diagonal from the lower-left corner to the low stretch of the stacked-stone north wall at upper right. Sangji (attached portrait face; black-lacquered lamellar, red-plumed helm) huge in the foreground, raked hard from the side by a torch held just outside frame; his face hard, no shame in it; a vermilion Tang banner behind him. The fortress wall and a few tiny yellow-bannered Baekje defenders stand black against a storm sky with one red break. Sixty-five percent dark.'
	},
	{
		id: 'wr-terye-lament',
		at: 'The name of Baekje ends today.',
		alt: 'Refugees on the road to Terye look back at the mountains of Baekje; an old man touches the earth',
		canon: { with: ['dress:baekje', 'flag:yamato'] },
		scene:
			'Last light on the road to Terye. Low angle from the earth. ONE device: the long horizon ridge line. Foreground, large: an old Baekje man in commoner dress kneeling with his palm pressed flat on the dark earth, lit by a hand lantern set down beside him, the only warm practical light; his anime face, wet with grief, turned up toward the misty black ridges of Baekje. Behind him, small on a ridge path, a thin line of refugee silhouettes with bundles walks toward a harbour where a few Yamato ship lanterns glow. Sixty-five percent dark indigo sky with one thin gold strip over the far mountains.'
	}
];

const manifest = SHOTS.filter((s) => !s.keep).map(({ action, scene, keep, ...s }) => ({
	entry: ENTRY,
	...s,
	scene: [OPEN, scene, action ? MANGA : ''].filter(Boolean).join(' ')
}));
fs.writeFileSync('scripts/.cache/white-river-epic-manifest.json', JSON.stringify(manifest, null, '\t') + '\n');
console.log(`${manifest.length} shots`);
