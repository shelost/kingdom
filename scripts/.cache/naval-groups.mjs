// Writes the naval scene-still groups: White River retakes (663) and the Bisa sea fight (645).
//   node scripts/.cache/naval-groups.mjs && node scripts/.cache/scene-stills/build.mjs prompts scenes-wr-retake
import fs from 'node:fs';

const DIR = 'scripts/.cache/scene-stills';

// The baekgang-663 battle map, in words: every White River frame stands in this one estuary.
const WR =
	'PLACE (match the attached pl_white_river board and the battle map): the wide grey-brown mouth of the White River, low blue hills on both banks, tidal mudflats, shifting sandbars and reed beds. The Tang fleet of 170 dark tower-ships and warships lies anchored in ONE tight line across the narrow throat of the river, bows to the sea; the Yamato and Baekje boats come in from the open sea to the south-west, hundreds of small open rowing boats packed together.';
const WR_SCALE = 'Alongside, a Tang deck stands a man’s height above any Yamato boat; the Tang broadside is a wooden wall the Yamato boats break on. BANNERS BY SIDE: vermilion Tang banners fly ONLY on the dark Tang hulls; red Wa sunburst banners ONLY on the Yamato boats; Tang sails are plain deep red, no emblem; the Tang sun disc holds an abstract black smudge, never a readable character.';
const TANG_YAMATO = ['flag:tang', 'flag:yamato', 'ship:tang', 'ship:yamato', 'place:baekgang'];

// The bisa-645 battle map, in words.
const BISA =
	'PLACE (match the battle map): the end of the Liaodong cape in early summer — a steep dark ridge with grey cliffs on every side and a Goguryeo stone fortress wall along its crest, a narrow inlet under it, a wide grey bay opening south to the sea. The Tang fleet of five hundred hulls comes up from the south out of the sea haze; a handful of Goguryeo warships row out of the inlet to meet it.';
const BISA_SCALE = 'Alongside, the Tang deck stands two men higher than the Goguryeo deck. BANNERS BY SIDE: vermilion Tang banners fly ONLY on the dark Tang hulls; red three-legged-crow banners ONLY on the Goguryeo ships; Tang sails are plain deep red, no emblem; the Tang sun disc holds an abstract black smudge, never a readable character. Goguryeo men in steel lamellar with red shoulder-wings and pheasant-feather helm plumes; Tang men in steel lamellar with vermilion cloth and round chest discs.';
const TANG_GOGURYEO = ['flag:tang', 'flag:goguryeo', 'ship:tang', 'ship:goguryeo'];

const wr = (o) => ({ entry: 'White River', battle: true, with: TANG_YAMATO, ...o, scene: `${o.scene} ${WR} ${WR_SCALE}` });
const bisa = (o) => ({ entry: 'Yodong', year: 645, battle: true, action: true, with: TANG_GOGURYEO, ...o, scene: `${o.scene} ${BISA} ${BISA_SCALE}` });

const RETAKES = [
	wr({
		id: 'baekgang-line-hold',
		at: 'The Black Tortoise has already',
		alt: 'The Tang line holds the narrow mouth of the White River over the sandbars',
		time: 'day',
		scene: 'Morning before the battle, low over the water from a sandbar at the waterline, wet reeds blurred in the foreground. The Tang line fills the frame as one long dark wall of anchored tower-ships across the river throat, hull after hull receding into haze, crossbowmen small along every bulwark, red banners snapping in a hard sea wind, anchor cables taut and dripping. Far out on the bright sea the first specks of the Yamato boats. Tension, not calm: men on the nearest deck pointing out to sea, an officer shouting down the line.'
	}),
	wr({
		id: 'wr-wa-vanguard',
		at: 'row straight at the Western line on the evening water',
		alt: 'The Yamato vanguard rows hard at the Tang line on the evening water',
		action: true,
		time: 'night',
		scene: 'Evening, the twenty-seventh. Worm’s-eye from inside a Yamato boat among the rowers: a blurred oar blade and a straining forearm in the foreground; the boat packed with men in red-laced Yamato armour rowing standing up, mouths open in a war cry, a captain at the bow with his sword pointed forward. Ahead, filling the top of the frame, the black wall of Tang hulls lit by a low red sunset, crossbow bolts already streaking down. Other Yamato boats either side throwing spray, the sea gold and black.'
	}),
	wr({
		id: 'wr-abe-rear',
		at: 'The first charge hits a wall of hulls',
		alt: 'From the rear of the fleet Abe no Hirafu watches the first charge hit the wall of the Tang hulls',
		people: ['abe'],
		action: true,
		time: 'day',
		scene: 'Over-the-shoulder from the stern of Abe no Hirafu’s ship at the rear of the Yamato fleet: his armoured shoulder and grizzled profile sharp on the left third, jaw clenched, eyes narrowed, one hand white-knuckled on the stern post. Ahead across a sea packed with hundreds of small Yamato boats, the first wave smashes into the Tang wall of hulls: boats stopping dead, oars snapping, grapnels flying, men toppling into the water, the first smoke rising.'
	}),
	wr({
		id: 'wr-tide-turn',
		at: 'the current turning against them',
		alt: 'The current turns against the Yamato boats and drives them back into each other',
		action: true,
		time: 'day',
		scene: 'High three-quarter from the rigging of a Tang tower-ship looking down: the ebb tide visibly running seaward in streaks of foam, shoving the packed Yamato boats back into one another — hulls grinding, oars tangling and snapping, men falling between boats, a boat tipping sideways. Rowers heave against the current with faces of panic and rage; a captain screams at them. In the foreground the dark Tang bulwark and a row of crossbowmen leaning over it, waiting.'
	}),
	wr({
		id: 'wr-fire-arrows',
		at: 'arrows wrapped for flame',
		alt: 'Tang archers on a tower-ship loose fire arrows into the packed Yamato boats',
		action: true,
		time: 'day',
		scene: 'On the high deck of a Tang tower-ship, low angle along the bulwark: a line of Tang archers in steel lamellar draws and looses at once, arrowheads wrapped in burning tow, a sergeant’s arm slashing down; the nearest archer large in the foreground at full draw, flame lighting his face from below. The volley arcs down in long streaks of fire onto the tight mass of Yamato boats far below the deck, sails and men already catching. Smoke rolling across the sun.'
	}),
	wr({
		id: 'naval-fire',
		at: 'Four hundred eastern ships do not sink so much as',
		alt: 'Four hundred Yamato boats burn together and fill the sky with smoke',
		action: true,
		time: 'day',
		scene: 'Wide but low, the camera just above the waves among burning wreckage, a charred spar burning in the foreground. Hundreds of Yamato boats packed hull to hull across the river mouth are burning together, one continuous field of fire; huge columns of black smoke climb and bend in the wind, blotting the sun into a red disc; men leap from the flames, swim, cling to oars; the sea is red with reflected fire. Beyond it, the dark unburnt line of Tang hulls stands untouched in the smoke.'
	}),
	wr({
		id: 'baekgang-envelop',
		at: 'they swing shut from left and right around the Eastern centre',
		alt: 'The Tang wings swing shut from left and right and crush the Yamato centre',
		action: true,
		time: 'day',
		scene: 'Steep bird’s-eye from the masthead of a Tang wing ship as it turns: its own red battened sail and rigging blurred huge in the foreground; below, the Tang wing ships swing in from left and right like two closing doors, oars churning white, their bows driving into the burning Yamato centre packed between them. Fire and smoke boil up from the trapped boats; tiny men swarm, fall and swim. The river mouth, sandbars and hills spread out behind as on the battle map.'
	}),
	wr({
		id: 'wr-tortoise-ring',
		at: 'a door with two leaves',
		alt: 'Seen from above, the Tang fleet closes in a ring around the Yamato centre',
		action: true,
		time: 'day',
		scene: 'Extreme high crane shot through drifting smoke: the Tang fleet has closed into a ring of dark hulls around the burning Yamato centre, oars locked, crossbow volleys streaking inward from every side; inside the ring, burning boats jammed together, the water red, swimmers everywhere. Smoke columns rise toward the camera so the view comes through gaps in them. The estuary, mudflats and hills of the battle map around the ring.'
	}),
	wr({
		id: 'naval-clash',
		at: 'you wear their coat on our river',
		alt: 'King Pungjang at the stern of his ship shouts across the burning water at the Tang flagship where his brother stands',
		people: ['pung'],
		with: [...TANG_YAMATO, 'ship:baekje', 'flag:baekje'],
		action: true,
		time: 'day',
		scene: 'Medium close, low angle at the stern of Pung’s Baekje ship (18 m, upswept golden prow, yellow banners): King Pung grips the stern rail and screams across the water, face contorted with betrayal and grief, tears and soot on his cheeks, burning planks and sparks whipping past him. Across the burning water behind him, out of focus, the towering dark hull of the Tang flagship, a lone figure in a crimson officer’s robe at its rail. Fire between them, his own soldiers ducking arrows around him.'
	}),
	wr({
		id: 'takutsu-kinshi-fire',
		at: 'Land of the Heavenly Deer',
		alt: 'Echi no Takutsu roars amid the burning ships with the golden kite on his raised fist',
		people: ['takutsu'],
		action: true,
		time: 'day',
		scene: 'Worm’s-eye from the burning deck of Takutsu’s Yamato boat: Echi no Takutsu, white headband, red-laced armour scorched, throws back his head and roars an oath to heaven, his raised armoured fist lifted high with a golden kite landing on it, wings spread. Flames climb the sail behind him, sparks spiral up into black smoke, his men around him lift their swords and shout with him. The dark Tang hull looms over the boat’s side.'
	}),
	wr({
		id: 'takutsu-last-stand',
		at: 'Baekje must survive….',
		alt: 'Echi no Takutsu fights alone on the last unburnt planks of his burning ship',
		people: ['takutsu'],
		sword: true,
		action: true,
		time: 'day',
		scene: 'Hard dutch angle on the stern of Takutsu’s burning Yamato boat, only a few planks left unburnt: Echi no Takutsu, bloodied, headband torn, cuts at Tang marines dropping onto the deck from the towering hull above, one already falling into the sea; his teeth bared, eyes wild. Fire on every side, the sail collapsing in flames behind him, embers driving across the frame, the Tang deck two men above him lined with crossbows.'
	}),
	wr({
		id: 'wr-armor-drown',
		at: 'go into the water in their armour',
		alt: 'Yamato soldiers leap from a burning boat into the sea in their armour',
		action: true,
		time: 'day',
		scene: 'Low at the waterline beside a burning Yamato boat: soldiers in heavy laced armour leap from the gunwale into the sea, one frozen mid-fall large in the foreground with terror on his face, another already sinking, an arm reaching up through red-lit water; others cling to floating oars. Fire roars along the boat, the Tang hull towering dark behind it with crossbowmen looking down.'
	}),
	wr({
		id: 'wr-abe-turns',
		at: 'He turns them for home',
		alt: 'Abe no Hirafu hauls a half-armoured swimmer out of the sea as his ship turns for home',
		people: ['abe'],
		action: true,
		time: 'day',
		scene: 'Close and low over the side of Abe no Hirafu’s Yamato boat as it heels hard round for home: Abe leans out and hauls a half-drowned soldier up over the gunwale by his armour straps, both faces straining, water pouring off them; his rowers heave behind him. Beyond, the whole river mouth burns under black smoke, swimmers reaching toward the boat.'
	}),
	wr({
		id: 'wr-pung-flight',
		at: 'He leaves behind his fleet, his allies, his capital on the hill, and his sword.',
		alt: 'Pung flees north in a small boat through the smoke, looking back at the burning fleet',
		people: ['pung'],
		action: true,
		time: 'day',
		scene: 'From the stern of a small 8 m boat slipping away through thick smoke, a handful of men rowing hard: King Pung crouched in the stern, crown gone, looking back over his shoulder, face hollow with shame and fear. Behind him the burning fleet fills the frame, the dark Tang hulls a wall in the smoke, fire reflected on the water. He is small in the boat; the boat is small on the river.'
	}),
	wr({
		id: 'wr-brothers-river',
		at: 'He was always better at being sent away than I was.',
		alt: 'The two brothers divided by a column of smoke: Yung on the Tang deck, Pung small in the fleeing boat',
		people: ['yung', 'pung'],
		time: 'day',
		scene: 'Split by one huge vertical column of black smoke down the middle of the frame. Left: Yung in a crimson Tang officer’s robe at the rail of the towering Tang flagship, medium shot, holding a worn ring-pommel sword, his face still and wet-eyed. Right, far below and far away: Pung in a small boat rowing north through the haze, a tiny figure looking back. Burning wreckage drifts on the water between them.'
	}),
	wr({
		id: 'wr-silla-charge',
		at: 'I want Silla in the first line.',
		alt: 'King Munmu leads the Silla cavalry across the mudflats into the Baekje shore guard',
		people: ['munmu'],
		with: ['flag:silla', 'flag:baekje', 'ship:baekje', 'place:baekgang'],
		sword: true,
		action: true,
		time: 'day',
		scene: 'Low and close at hoof level on the tidal mudflat: King Munmu in Silla steel lamellar charges straight at the lens at the head of the Silla cavalry, sword raised, mouth open in a shout, mud and water exploding from the hooves, blue banners streaming behind. Ahead, the Baekje horsemen in yellow brace in front of their beached boats (18 m golden hulls drawn up on the mud). Riders collide at the edge of frame.'
	}),
	wr({
		id: 'wr-yung-rail',
		at: 'I looked at my father.',
		alt: 'Over the Black Tortoise’s shoulder: Yung in a Tang officer’s robe at the rail, staring at an empty sea',
		people: ['liurengui', 'yung'],
		with: ['ship:tang', 'place:baekgang'],
		time: 'night',
		scene: 'Night on the Tang flagship, low over-the-shoulder: the Black Tortoise’s armoured shoulder and grey beard as a dark blurred mass at the left edge. Right third, sharp: Yung in a crimson Tang officer’s robe and black futou cap at the high rail beside one hanging iron lantern that lights the side of his face and his knuckles on the rail; his eyes on the black sea, the face giving nothing away. The rail runs out into an enormous dark sea; on the far horizon a faint string of red lanterns.'
	}),
	wr({
		id: 'wr-abe-council',
		at: 'Abe no Hirafu does most of the talking',
		alt: 'Night council on the king’s ship: Abe no Hirafu laughs over the lamp while King Pungjang leans away',
		people: ['abe', 'pung'],
		with: ['ship:baekje', 'ship:yamato', 'place:baekgang'],
		time: 'night',
		scene: 'Night council on the open deck of the king’s Baekje ship, one oil lamp on a chest between them throwing hard light up into faces. Abe no Hirafu leans in, laughing loudly, slapping the chest, his whole body forward; King Pung leans away from him, polite smile, eyes uneasy. Dark shapes of other captains at the edges, the black river beyond with small lanterns of the moored boats.'
	}),
	wr({
		id: 'wr-night-council',
		at: 'The tide turns before noon.',
		alt: 'Night council on deck: the king and the Yamato captains laugh around a lantern; Takutsu alone reads the tide',
		people: ['pung', 'takutsu'],
		with: ['ship:baekje', 'ship:yamato', 'place:baekgang'],
		time: 'night',
		scene: 'Night on deck, deep focus: in the background around one lantern, King Pung and the captains laughing and drinking, warm and blurred. Foreground right, sharp: Echi no Takutsu alone at the rail, turned away from them, crouched with one hand trailing in the black water to feel the current, eyes on the dark river mouth, grim and certain. Moon on the water, the line of Tang lanterns across the throat in the distance.'
	})
];

const BISA_SHOTS = [
	bisa({
		id: 'bisa-fleet-dawn',
		at: 'Five hundred hulls leave the West’s coast',
		alt: 'Dawn: the Tang fleet comes up out of the sea haze toward the cliffs of Bisa',
		action: false,
		time: 'day',
		scene: 'Dawn, wide, the camera low on the bow of a Tang tower-ship: its dark carved prow and a soldier’s back in steel lamellar sharp in the foreground, spray bursting over the bow. Ahead and on every side, the fleet: dozens of red-sailed tower-ships and warships at true size, hulls lined with tiny soldiers, oars beating, receding into gold haze. On the horizon the dark cliff-ridge of Bisa with its fortress wall along the crest. Wind, spray and banners in motion; awe on the soldier’s half-turned face.'
	}),
	bisa({
		id: 'bisa-coast-ships',
		at: 'Below it, in the inlet, Goguryeo keeps a few warships',
		alt: 'A Goguryeo captain drives his warships out of the inlet at the Tang fleet',
		sword: true,
		time: 'day',
		scene: 'Low and close on the bow of a Goguryeo warship as it surges out of the inlet: a Goguryeo captain in steel lamellar with red shoulder-wings, one boot on the bow rail, sword pointing forward, screaming the order; behind him sixty men heave at the oars, archers stringing bows, red banners whipping. Ahead, out of the sea haze, the endless line of Tang tower-ships, each hull bigger than his. Spray, wind, the Bisa cliffs and fortress wall rising behind.'
	}),
	bisa({
		id: 'bisa-tower-wall',
		at: 'two men above its own',
		alt: 'A Goguryeo warship grinds alongside a Tang tower-ship; the arrows come down from above',
		time: 'day',
		scene: 'Worm’s-eye from the deck of the Goguryeo warship crushed alongside a Tang tower-ship: the Tang hull rises like a wooden wall filling the top half of the frame, its deck two men above, lined with Tang crossbowmen shooting straight down. Goguryeo marines hurl grapnels and climb the hull, one falling back, shields bristling with bolts, a fire pot shattering in flame on the Tang bulwark. The two hulls grind, oars snapping between them, water churning white.'
	}),
	bisa({
		id: 'bisa-coast-burning',
		at: 'The coast ships burn or run',
		alt: 'A Goguryeo warship burns under the Tang hulls as its men leap into the bay',
		time: 'day',
		scene: 'Low over the water: a Goguryeo warship burning from bow to stern, its cream battened sails on fire, red banners curling in the flames; its men leap into the bay, a wounded officer on the burning stern castle refusing to leave, face lit by fire, teeth gritted. Two Tang tower-ships tower beyond, untouched, crossbowmen at their rails. Black smoke drifts across the Bisa cliffs.'
	}),
	bisa({
		id: 'bisa-west-gate',
		at: 'first over the wall',
		alt: 'Night: Wang Wendu is the first man over the west gate of Bisa',
		with: ['flag:tang', 'flag:goguryeo', 'dress:goguryeo'],
		sword: true,
		time: 'night',
		scene: 'Night, worm’s-eye up the cliff at the west gate of Bisa: Tang soldiers climb a steep rock path and ladders against the stone wall under torchlight; at the top, a young Tang officer in steel lamellar heaves himself over the parapet, sword in hand, face fierce and terrified, a Goguryeo defender swinging a spear at him against the night sky. Torches, sparks, falling stones, men falling from ladders; far below, the dark bay with the Tang fleet’s lanterns.'
	})
];

fs.writeFileSync(`${DIR}/scenes-wr-retake.json`, JSON.stringify(RETAKES, null, '\t') + '\n');
fs.writeFileSync(`${DIR}/scenes-bisa-naval.json`, JSON.stringify(BISA_SHOTS, null, '\t') + '\n');
console.log(`wr ${RETAKES.length}, bisa ${BISA_SHOTS.length}`);
