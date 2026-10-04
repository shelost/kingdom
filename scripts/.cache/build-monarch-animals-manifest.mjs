// Builds monarch-animals-manifest.json: two poster stills per ruler with their nation's guardian animal.
import { writeFileSync } from 'node:fs';

const OPEN =
	'HEEWON STYLE MOVIE POSTER key art, 2:1 letterbox, composed so nothing important touches the top or bottom edge; crowns, antlers, wings and heads stay well inside the central band; no title, no lettering.';
const STYLE =
	'STYLE: HEEWON STYLE, more painterly, with hints of Korean ink painting — Korean webtoon figures (clean ink linework, simplified expressive faces matching the attached portrait, watercolor-washed) inside a hand-painted world of watercolor and oil with traditional sumukhwa ink: splashed-ink storm clouds, bold dry calligraphic brush strokes in manes, fur, feathers, robes and grass, ink bleeding into wet wash, small ink splatters and drips near the frame edges, patches of bare rice paper where the edges dissolve; oil glazes only deepen the darks, a touch of impasto on the brightest highlight. Movie-poster key art: bold iconic silhouette, the two subjects large and close, one dramatic low angle, one bright break of light behind them, big dark masses, few hues plus one accent, film-poster drama but NO text, NO title, NO credits, NO logo, NO seal stamp. Not photoreal, not 3D. No glow aura, no halo, no emissive outline — the accent colour is real light. One of each named person. No watermark.';
const WINGLESS =
	'CHUNMA HAS NO WINGS: a wingless white heavenly horse, bare white back and shoulders, nothing feathered anywhere; it rides the air on curling cloud-and-flame streamers trailing from its legs.';

const S = (...parts) => [OPEN, ...parts, STYLE].join(' ');

const items = [
	// Silla — Chunma
	{
		id: 'guardian-sunduk-chunma',
		entry: 'Queen Sunduk',
		after: 'sunduk-seq-coronation-sym',
		at: 'becomes the first Queen of Silla',
		tone: '#E8552B',
		alt: 'Poster key art: Queen Sunduk on the night of her crowning lays her palm on the brow of the wingless white heavenly horse as it comes down out of the stars over Seorabeol',
		people: ['sunduk'],
		canon: { with: ['chunma', 'place:surabol'] },
		scene: S(
			'Night of the coronation above the giwa roofs of Seorabeol, a vast starry sky torn by splashed-ink cloud. Low angle from the palace yard stones. INTERACTION: the wingless white heavenly horse Chunma has come down out of the sky and lowers its long arched neck to her; Queen Sunduk, in her gold Silla tree-and-antler crown with jade comma pendants (the real Silla gold crown — upright tree-shaped prongs and antler prongs, not a fantasy orb or crescent), coral-red and white royal silk, reaches up and lays her open palm flat on its forehead, her chin lifted, a small fierce smile; its forelock falls across her fingers and its breath stirs her veil-pendants. Its hind legs still trail in curling cloud streamers above the roofline.',
			WINGLESS,
			'One warm torch key (#E8552B) from the lower left catches her crown, cheek and the horse’s muzzle; the rest is indigo night and ink. Dark eaves in the near foreground.'
		)
	},
	{
		id: 'sunduk-chunma-stars',
		entry: 'Queen Sunduk',
		at: 'In the capital they have already raised a tower to read the stars',
		tone: '#E8552B',
		alt: 'Poster key art: Queen Sunduk at the foot of Cheomseongdae points out a star while the white heavenly horse leans its head over her shoulder to look',
		people: ['sunduk'],
		canon: { with: ['chunma', 'place:cheomseongdae'] },
		scene: S(
			'Night field at Cheomseongdae: the real bottle-shaped stone observatory tower (stacked granite courses, square window halfway up, square well-frame top) rising as a dark vertical against a wheel of stars and ink cloud. Worm’s-eye from the grass. INTERACTION: Queen Sunduk stands close against the wingless white heavenly horse Chunma at the foot of the tower, one arm around its neck, the other pointing up at one bright star; the horse has laid its long head over her shoulder, cheek to her cheek, ears pricked, both of them looking up the line of her arm. She is laughing, explaining the sky to the one creature that has actually been up there.',
			WINGLESS,
			'One small lamp at the tower base throws a warm key (#E8552B) up across her face, her gold crown and the horse’s jaw; the rest is deep indigo and splashed ink. Dark grass strokes across the near foreground.'
		)
	},
	{
		id: 'sunduk-chunma-peony',
		entry: 'Queen Sunduk',
		at: 'He sends her a gift: a painting of peonies in three colours',
		tone: '#E8552B',
		alt: 'Poster key art: Queen Sunduk laughs in her peony garden as the white heavenly horse eats one of the scentless Tang peonies out of her hand',
		people: ['sunduk'],
		canon: { with: ['chunma'] },
		scene: S(
			'Dusk in a Silla palace garden after rain: a bed of red, purple and white peonies, a low tiled wall, a single gnarled pine. Close two-shot, low angle through the flowers. INTERACTION: Queen Sunduk crouches among the peonies in coral-red and white silk, gold crown, holding out a fat peony bloom in her palm; the wingless white heavenly horse Chunma bends its head down and takes the whole flower in its lips; she has thrown her head back laughing — no scent, no butterflies, and the horse does not care. A painted Tang scroll of peonies lies unrolled and forgotten on the wet stone beside her.',
			WINGLESS,
			'One low sun-break (#E8552B) through the storm cloud rakes across the petals, her face and the horse’s white muzzle; the garden falls into wet umber and ink. Blurred peony heads in the near foreground.'
		)
	},
	{
		id: 'jinduk-chunma-yard',
		entry: 'Bidam’s Rebellion',
		at: 'is crowned before the blood on the yard dries',
		tone: '#9d7bd0',
		alt: 'Poster key art: newly crowned Queen Jinduk steps barefoot onto the washed yard and the white heavenly horse kneels before her through the censer smoke',
		people: ['jinduk'],
		canon: { with: ['chunma', 'place:surabol'] },
		scene: S(
			'Grey dawn in the palace yard of Seorabeol, flagstones still wet where the blood was scrubbed, bronze censers trailing smoke. Low angle along the wet stones. INTERACTION: the wingless white heavenly horse Chunma kneels on its forelegs on the wet flagstones; Queen Jinduk, in her new gold Silla crown and violet-and-white royal silk, steps forward and rests both hands on its bowed head, her face grave and tired, accepting it. Their reflections lie together in the wet stone.',
			WINGLESS,
			'One pale violet dawn break (#9d7bd0) through the smoke catches her crown, her hands and the horse’s mane; the yard and the halls behind sink into slate and ink. Censer smoke as ink wash in the near foreground.'
		)
	},
	{
		id: 'jinduk-chunma-loom',
		entry: 'King Muyeol',
		at: 'For seven years the crown has sat on',
		tone: '#9d7bd0',
		alt: 'Poster key art: Queen Jinduk weaves her ode of peace into silk at a lamp-lit loom while the white heavenly horse watches over her shoulder through the open door',
		people: ['jinduk'],
		canon: { with: ['chunma'] },
		scene: S(
			'Night in a tenebrist Silla palace chamber: one oil lamp, a big wooden loom, a long length of silk with woven lines of verse, the timber door slid open onto a moonlit courtyard. Over-shoulder two-shot. INTERACTION: Queen Jinduk sits at the loom in violet-and-white silk and gold crown, shuttle in hand, mid-throw; the wingless white heavenly horse Chunma has pushed its head and long neck in through the open door and rests its chin on her shoulder, watching the shuttle; without looking she reaches back and scratches its jaw. The woven silk glows only where the lamp touches it.',
			WINGLESS,
			'The lamp is the only key (#9d7bd0 bounce off the silk): it catches her profile, the shuttle, the horse’s eye and muzzle; the room falls into umber-black. Loom frame as a dark foreground shape.'
		)
	},
	{
		id: 'muyeol-chunma-crowned',
		entry: 'King Muyeol',
		at: 'meets again to enthrone the next king',
		tone: '#D8258C',
		alt: 'Poster key art: Kim Chunchu, newly King Muyeol, walks down the palace stair at dawn with his hand in the white heavenly horse’s mane, talking to it like an old ally',
		people: ['chunchu'],
		canon: { year: 655, with: ['chunma', 'place:surabol'] },
		scene: S(
			'Dawn on the long stone stair of the Seorabeol palace, giwa roofs behind, one storm cloud splitting. Low angle up the stair diagonal. INTERACTION: King Muyeol (Kim Chunchu as king — royal crown and magenta-and-gold court robe, older, heavy-lidded clever eyes) walks down the steps beside the wingless white heavenly horse Chunma, one hand buried in its mane, leaning in to murmur something sly into its ear; the horse has turned its head toward him, one ear cocked as if it has heard this sort of thing from him before. Two subjects on the stair diagonal, the rest empty stone.',
			WINGLESS,
			'One magenta-gold sunrise break (#D8258C) from behind the roofs edges his crown, profile and the horse’s neck; the stair falls into blue-grey shadow and ink.'
		)
	},
	{
		id: 'muyeol-chunma-sabi',
		entry: 'Sabi Palace',
		at: 'finally arrives at the scene. He makes Euija pour',
		tone: '#D8258C',
		alt: 'Poster key art: King Muyeol rides the white heavenly horse through the smoke of fallen Sabi, reining it in at the broken gate',
		people: ['chunchu'],
		canon: { year: 660, mounted: false, with: ['chunma', 'place:sabi'] },
		scene: S(
			'Smoke-black dusk at the broken gate of Sabi on the Baengma river bluff; Baekje giwa halls burning low in the distance. Worm’s-eye from the ash. INTERACTION: King Muyeol rides bareback on the wingless white heavenly horse Chunma, reining it in hard at the gate; the horse rears half up, forelegs high, and he leans forward along its neck with one hand flat on its shoulder to steady it, his face grim and spent rather than triumphant. Cloud streamers off its hooves curl into the smoke.',
			WINGLESS,
			'Firelight from the burning halls (#D8258C magenta-orange) is the one key on his crown, face and the horse’s white chest; the gate and the sky are ink-black smoke. Ash flakes as painted bokeh.'
		)
	},
	{
		id: 'munmu-chunma-hill',
		entry: 'The King for All',
		at: 'stands where a six-year-old once stole a sentence',
		tone: '#C41E3A',
		alt: 'Poster key art: King Munmu grins on the hilltop where he once stole his childhood sentence, the white heavenly horse shoving its nose into his shoulder',
		people: ['munmu'],
		canon: { with: ['chunma', 'place:surabol'] },
		scene: S(
			'Late afternoon on a grass hill above Seorabeol, the war over, a huge clearing storm sky. Low heroic angle from the grass. INTERACTION: King Munmu, crimson robe with gold dragon embroidery, blue shoulder pieces, gold Silla crown, square jaw and goatee, stands with his arms folded and a cocky grin; the wingless white heavenly horse Chunma butts its nose hard into his shoulder, knocking him half a step, and he laughs and hooks an arm around its neck. Far below, the city roofs small in haze.',
			WINGLESS,
			'One crimson-gold sun-break (#C41E3A) behind them rims the crown, his grin and the horse’s mane; the hill falls into dark green-umber. Grass strokes in the near foreground.'
		)
	},
	{
		id: 'munmu-chunma-sea',
		entry: 'Strike Harbor',
		at: 'The last of it happens at the mouth of the Geum',
		tone: '#C41E3A',
		alt: 'Poster key art: King Munmu gallops the white heavenly horse through the surf at dawn as the last Tang sails leave the river mouth',
		people: ['munmu'],
		canon: { with: ['chunma'] },
		scene: S(
			'Dawn at a river mouth opening onto the sea, mudflats and surf, a few tiny Tang sails dissolving on the horizon. Low angle at the waterline. INTERACTION: King Munmu rides the wingless white heavenly horse Chunma at full gallop through the shallow surf, leaning low over its neck, both hands in its mane, crimson robe streaming, shouting with joy; spray explodes off its hooves and curls up into cloud streamers. Horse and king are one diagonal across the frame.',
			WINGLESS,
			'One low crimson sunrise (#C41E3A) behind the clouds catches the spray, his crown and the horse’s white flank; the sea and sky are ink and slate. Spray droplets as painted bokeh.'
		)
	},
	// Baekje — Sinrok
	{
		id: 'mu-sinrok-pond',
		entry: 'King Euija, the 31st Eraha',
		at: 'King Mu (80) is dead',
		tone: '#b8862c',
		alt: 'Poster key art: old King Mu feeds the white-gold guardian stag from his hand beside the palace pond at dusk',
		people: ['kingmu'],
		canon: { with: ['sinrok', 'place:sabi'] },
		scene: S(
			'Dusk at the great palace pond south of Sabi: still water, a small island with a willow, a pavilion roof, mist. Low angle at the water’s edge. INTERACTION: old King Mu, in his gold-and-crimson royal robe and crown, sits on a stone at the water’s edge and holds out a handful of grain; the tall pale white-gold stag Sinrok lowers its great antlered head and eats from his palm, its muzzle in his hand; he rests his other hand on its neck, smiling the quiet smile of a very old man who once won a princess with a song. Their reflections lie together in the pond.',
			'The stag is a solid painted animal — no glow, no luminous outline.',
			'One amber dusk break (#b8862c) catches his crown, his hand and the antler tips; the pond and willow fall into indigo and ink. Willow strokes in the near foreground.'
		)
	},
	{
		id: 'mu-sinrok-pagoda',
		entry: 'King Euija, the 31st Eraha',
		at: 'Before he was king, King Mu paid the children of Sabi to sing a song he had written himself.',
		tone: '#b8862c',
		alt: 'Poster key art: King Mu leans on the guardian stag at the foot of the great stone pagoda of Mireuksa as the evening bell sounds',
		people: ['kingmu'],
		canon: { with: ['sinrok'] },
		scene: S(
			'Evening at Mireuksa: the great Baekje STONE pagoda (many-tiered granite, wide low eaves, stone pillars) rising as a dark monumental vertical against a splashed-ink storm sky. Worm’s-eye from the temple ground. INTERACTION: King Mu, crowned, gold-and-crimson robe, walks with one arm over the shoulders of the white-gold stag Sinrok as if it were an old friend, leaning on it a little; the stag walks in step with him and turns its head back to look at him, antlers branching above both of them. A small temple bell in the frame’s edge.',
			'The stag is a solid painted animal — no glow, no luminous outline.',
			'One amber sun-break (#b8862c) through the clouds strikes the pagoda’s side, the king’s face and the stag’s antlers; the rest falls into ink.'
		)
	},
	{
		id: 'euija-sinrok-throne',
		entry: 'Euija’s Descent',
		at: 'The wine comes earlier each day',
		tone: '#e08a2e',
		alt: 'Poster key art: King Euija slumps drunk on his throne in the dark hall while the guardian stag stands behind him and lowers its head to his shoulder',
		people: ['euija'],
		canon: { with: ['sinrok'] },
		scene: S(
			'Night in the dark Sabi throne hall, tenebrist: red columns sinking into black, one brazier, an empty floor. Low dutch angle from the floor. INTERACTION: King Euija sprawls sideways on the throne, crimson robe loose, yellow-gold headband askew, a wine jar hanging from two fingers; the tall white-gold stag Sinrok stands behind the throne, its antlers rising above his head like a second crown, and lowers its muzzle to nudge his cheek; he leans his head against its face without opening his eyes, a bitter little smile. The two of them alone in the huge hall.',
			'The stag is a solid painted animal — no glow, no luminous outline.',
			'The brazier is the one key (#e08a2e): it catches his face, the jar, the stag’s muzzle and the antler tips; everything else is umber-black. Brazier sparks as painted bokeh.'
		)
	},
	{
		id: 'euija-sinrok-farewell',
		entry: 'Sabi Palace',
		at: 'leaves Sabi at night for',
		tone: '#e08a2e',
		alt: 'Poster key art: King Euija presses his forehead to the guardian stag on the dark river bluff before he flees Sabi for Bear Fortress',
		people: ['euija'],
		canon: { year: 659, with: ['sinrok', 'place:sabi'] },
		scene: S(
			'Night on the bluff above the Baengma River, Sabi’s roofs below glowing with distant fire, a road leading away into the dark hills. Low angle on the bluff edge. INTERACTION: King Euija, in a plain dark travelling cloak over his crimson robe, yellow-gold headband, presses his forehead against the white-gold stag Sinrok’s brow, both his hands on its antler bases, eyes shut; the stag stands perfectly still and does not follow. A few torches of his small escort wait tiny down the road.',
			'The stag is a solid painted animal — no glow, no luminous outline.',
			'Firelight from the city below (#e08a2e) is the one key, catching his cheek, his hands and the stag’s antlers; the sky is splashed-ink storm and the bluff is black.'
		)
	},
	// Goguryeo — Samjogo
	{
		id: 'youngryu-samjogo-banquet',
		entry: 'Yeon’s Massacre',
		at: 'is in attendance.',
		tone: '#a83b34',
		alt: 'Poster key art: old King Youngryu at the banquet feeds a morsel to the three-legged crow perched on the arm of his chair, unaware of the night ahead',
		people: ['yeongnyu'],
		canon: { with: ['samjogo', 'place:pyongyang'] },
		scene: S(
			'Night banquet hall in Pyongyang, tenebrist: red lacquer columns sinking into black, one long low table, lamp flames in a row. Close low angle at table height. INTERACTION: old King Youngryu, red-and-gold royal robe, crown, grey beard, sits at the head of the table and holds out a morsel of meat on his fingertips; the black three-legged crow Samjogo, perched on the carved arm of his chair (three legs gripping the wood — always exactly three), leans in and takes it from his fingers, its eye turned toward the dark doorway; the king smiles, fond and unaware. Behind them in the far dark, the doorway is only a black slot.',
			'One red lamp key (#a83b34) catches the king’s face and hand and the crow’s glossy feathers; everything else is umber and ink. Lamp flames as bokeh.'
		)
	},
	{
		id: 'youngryu-samjogo-summit',
		entry: 'The Summit',
		at: 'the king keeps the final vote',
		tone: '#a83b34',
		alt: 'Poster key art: King Youngryu on the summit dais lifts his wrist and the three-legged crow lands on it as the commanders wait below',
		people: ['yeongnyu'],
		canon: { with: ['samjogo'] },
		scene: S(
			'Dusk in a high stone council hall on a mountain summit, open on one side to a sea of ink clouds and a low red sun. Worm’s-eye from the floor below the dais. INTERACTION: King Youngryu stands on the dais in red-and-gold royal robe and crown, his arm lifted, and the black three-legged crow Samjogo is landing on his wrist, wings flared wide, three legs reaching for him (exactly three); he watches it with steady eyes. Below, a few commanders are only dark silhouettes at the frame edge.',
			'The low red sun (#a83b34) behind the crow is the one break of light, rimming its wings and the king’s raised arm; the hall is black stone.'
		)
	},
	{
		id: 'bojang-samjogo-hall',
		entry: 'Chunchu & Gesomun',
		at: 'makes his request — though the word',
		tone: '#8f4a44',
		alt: 'Poster key art: King Bojang alone in the empty throne hall at night timidly offers his hand to the three-legged crow perched on the throne',
		people: ['bojang'],
		canon: { with: ['samjogo'] },
		scene: S(
			'Night in the vast empty Pyongyang throne hall, tenebrist: a single shaft of moonlight from a high window falls on the empty throne. Low angle across the black floor. INTERACTION: young King Bojang, in royal robe and crown too heavy for him, stands below his own throne and holds out a trembling hand; the black three-legged crow Samjogo sits on the throne arm (three legs, exactly three), cocks its head, and steps one foot toward his fingers. His face is hopeful and afraid. The throne is bigger than both of them.',
			'The moonlight shaft is the one cold key, with a warm rust bounce (#8f4a44) off the throne lacquer onto his face and the crow’s feathers; the rest of the hall is black.'
		)
	},
	{
		id: 'bojang-samjogo-letter',
		entry: 'Chunchu & Gesomun',
		at: 'The letter goes to King Bojang rather than the',
		tone: '#8f4a44',
		alt: 'Poster key art: King Bojang reads a letter by lamplight while the three-legged crow on his shoulder peers at it with him',
		people: ['bojang'],
		canon: { with: ['samjogo'] },
		scene: S(
			'Night in a small tenebrist palace chamber: one oil lamp on a low table, a screen of dark paper behind. Tight two-shot from across the table. INTERACTION: King Bojang sits hunched over an unrolled letter, reading with his lips moving; the black three-legged crow Samjogo perches on his shoulder (three legs gripping his robe — exactly three) and leans its head down beside his cheek, one eye on the page, as if reading too. He tilts the page toward it without thinking.',
			'The lamp is the only key (#8f4a44 warm rust): it lights his face, the paper and the crow’s eye and beak; the room falls into black.'
		)
	},
	{
		id: 'gesomun-samjogo-river',
		entry: 'Snake River',
		at: 'drives into the',
		tone: '#d0362f',
		alt: 'Poster key art: Yeon Gesomun stands knee-deep in the freezing Snake River with two swords drawn as the three-legged crow dives screaming past his head',
		people: ['gesomun'],
		canon: { sword: true, with: ['samjogo'] },
		scene: S(
			'February dawn on the Snake River: black freezing water, ice at the banks, mist, a storm sky. Worm’s-eye from the waterline. INTERACTION: Yeon Gesomun stands knee-deep in the river in steel lamellar with red wing shoulder-flaps, a ring-pommel sword in each hand, four more fanned on his back, roaring; the black three-legged crow Samjogo dives past his head screaming, wings flung wide, three legs outstretched (exactly three) and he turns his face up toward it, mid-roar, as if it is his signal. Spray kicks up around his legs.',
			'One red sunrise break (#d0362f) through the cloud catches the crow’s spread wings, his face and the two blades; the river and sky are ink-black and slate.'
		)
	},
	{
		id: 'gesomun-samjogo-gate',
		entry: 'Pyongyang',
		at: 'sits on the ridge',
		tone: '#d0362f',
		alt: 'Poster key art: Yeon Gesomun stands on the red gate of Pyongyang at dusk with the three-legged crow on his shoulder, both staring west',
		people: ['gesomun'],
		canon: { sword: true, with: ['samjogo', 'place:pyongyang_fortress'] },
		scene: S(
			'Dusk on the ridge wall of Pyongyang: the red two-storey munru gate pavilion, grey stone ramparts, storm clouds. Low angle from the wall walk. INTERACTION: Yeon Gesomun stands on the parapet in red-and-black robes with his crow swords fanned on his back, one boot up on the stone, and the black three-legged crow Samjogo sits on his shoulder (three legs — exactly three) pressing its head against his cheek; he reaches up with two fingers and strokes its breast, both of them staring west at the coming storm.',
			'One red sunset break (#d0362f) under the cloud lights his face, the crow and the gate’s red timbers; the rest falls into ink.'
		)
	},
	// Tang — Huanglong
	{
		id: 'taizong-huanglong-audience',
		entry: 'The Emperor',
		at: 'approaches the Second Emperor and offers an alliance',
		tone: '#c97a2e',
		alt: 'Poster key art: the Second Emperor sits on the night dais with the golden dragon coiled around the throne, its head resting beside his hand',
		people: ['taizong'],
		canon: { with: ['huanglong', 'place:changan'] },
		scene: S(
			'Night in the Daming Palace hall, Chinese historical drama lighting: red columns, lattice doors backlit, many small flames, a black reflective floor, incense haze. Low angle from the floor of the hall. INTERACTION: the Second Emperor sits on the dais in his yellow dragon robe and black court cap, leaning on one elbow; the golden Tang dragon Huanglong coils around the back and sides of the throne, and its great head rests on the throne arm right beside his hand; he lays his palm on its brow-ridge without looking, the way a man rests his hand on his own dog, his eyes on a small kneeling envoy far below.',
			'One gold lamp key (#c97a2e) lights his face, his hand and the dragon’s scales; blue-green shadow and black floor everywhere else; flames as bokeh.'
		)
	},
	{
		id: 'taizong-huanglong-death',
		entry: 'Death of the Second Emperor',
		at: 'The emperor dies in the Cuiwei Palace in the seventh month.',
		tone: '#c97a2e',
		alt: 'Poster key art: the dying Second Emperor reaches up from his bed and the golden dragon lowers its head to his hand one last time',
		people: ['taizong'],
		canon: { year: 649, with: ['huanglong'] },
		scene: S(
			'Night in a summer palace bedchamber, too warm, silk the colour of late wheat, gauze curtains, one lamp. Top-down three-quarter angle over the bed. INTERACTION: the dying Second Emperor lies propped on pillows, grey and gaunt, and lifts one hand; the golden Tang dragon Huanglong has wound its body around the bed frame and lowers its great head through the gauze to meet his hand, its snout against his palm, eyes half-closed. Its coils fill the dark around the bed.',
			'The single lamp (#c97a2e) catches his face, his raised hand and the dragon’s muzzle and whiskers; the rest is wheat-gold silk sinking into black.'
		)
	},
	{
		id: 'gaozong-huanglong-war',
		entry: 'The Four Beasts',
		at: 'launches the Eighth Invasion of Goguryeo',
		tone: '#b8935a',
		alt: 'Poster key art: the Third Emperor stands on a palace terrace and points east while the golden dragon rises past him into the storm',
		people: ['gaozong'],
		canon: { with: ['huanglong', 'place:changan'] },
		scene: S(
			'Storm dusk on a high red rammed-earth terrace of the Daming Palace, white balustrades, grey tiled roofs with owl-tail ridges below. Worm’s-eye from the terrace floor. INTERACTION: the Third Emperor, young and uncertain in his father’s yellow dragon robe, stands at the balustrade with his arm thrown out pointing east; the golden Tang dragon Huanglong spirals up past him into the storm cloud, its body curling once around his outstretched arm before it uncoils skyward, its head turned east along his pointing hand. His face is set, trying to look like his father.',
			'One gold break in the storm (#b8935a) lights his face, his arm and the dragon’s rising coils; the sky is splashed ink.'
		)
	},
	{
		id: 'gaozong-huanglong-euija',
		entry: 'The Death of Buyeo Euija',
		at: 'is brought forth before the Third Emperor.',
		tone: '#b8935a',
		alt: 'Poster key art: the Third Emperor on his dais with the golden dragon coiled at his feet, its head on his knee, looking down the long hall',
		people: ['gaozong'],
		canon: { with: ['huanglong', 'place:changan'] },
		scene: S(
			'Night in the Daming Palace hall, Chinese historical drama lighting: a screen behind the dais, red lanterns, incense haze, black reflective floor. Low angle up the dais steps. INTERACTION: the Third Emperor sits forward on the dais in his yellow robe, one hand resting on the head of the golden Tang dragon Huanglong, which lies coiled on the dais steps at his feet with its chin on his knee, both of them looking down the long empty hall toward a tiny distant prisoner-shape in the doorway. He looks almost kind.',
			'One gold lantern key (#b8935a) on his face, his hand and the dragon’s head; blue-green shadow elsewhere, flames as bokeh.'
		)
	},
	// Buyeo — Gonyeon
	{
		id: 'geumwa-gonyeon-egg',
		entry: 'Jumong',
		at: 'Dogs and pigs will not eat it',
		tone: '#a89a72',
		alt: 'Poster key art: the brown horse Gonyeon stands over Yuhwa’s egg in the road while King Geumwa, holding its halter, stares down at the egg it will not step on',
		people: ['geumwa'],
		canon: { with: ['gonyeon'] },
		scene: S(
			'Dusk on a muddy Buyeo road between palisade fences, storm sky. Low angle at road level, the egg large in the foreground. INTERACTION: a great pale egg lies in the mud; the old chocolate-brown steppe horse Gonyeon stands straddling it, one hoof lifted carefully clear, head bowed to sniff the shell; King Geumwa, gold crown and red-burgundy court robe, holds its halter rope and leans down beside the horse’s head, frowning at the egg, his other hand on the horse’s neck as if asking it why it will not step. Far off, tiny cattle stepping around the road.',
			'One low gold break (#a89a72) rakes across the egg, the horse’s muzzle and the king’s face; the rest is ink and wet umber.'
		)
	},
	{
		id: 'geumwa-gonyeon-stable',
		entry: 'Jumong',
		at: 'Geumwa walks the stalls, picks the fattest for himself',
		tone: '#a89a72',
		alt: 'Poster key art: King Geumwa walks the lamp-lit stalls with his old brown horse Gonyeon nudging him from behind',
		people: ['geumwa'],
		canon: { with: ['gonyeon'] },
		scene: S(
			'Night in the long timber royal stable of Buyeo, tenebrist: posts and stalls receding into black, straw, one hanging lantern. Low angle down the stable aisle. INTERACTION: King Geumwa, gold crown and red-burgundy court robe, strolls down the aisle pointing at a fat glossy horse in a stall; behind him the old chocolate-brown steppe horse Gonyeon, loose and unhaltered, shoves its broad nose into the small of his back, and he half turns with a tired laugh, reaching back to rub its forehead.',
			'The lantern is the one key (#a89a72): it catches the king’s face, his hand, the gold frog charm and the old horse’s eye; straw dust floats as bokeh in the dark.'
		)
	},
	// Joseon — Gom
	{
		id: 'dangun-gom-asadal',
		entry: 'Dangun & Old Joseon',
		at: 'Their son is',
		tone: '#b8956a',
		alt: 'Poster key art: Dangun founds Asadal with one hand buried in the fur of the great bear that was his mother’s first shape',
		people: ['dangun'],
		canon: { with: ['gom', 'place:asadal'] },
		scene: S(
			'Dawn where a mountain meets a plain: one sacred sandalwood tree, a ring of standing stones, a first thatched hall, mist on the plain below. Low heroic angle from the grass. INTERACTION: Dangun stands beside the huge dark-brown bear, far taller than him on all fours, his hand buried deep in the fur of its shoulder hump; the bear turns its broad head and presses its nose to his chest, eyes half-closed, and he lowers his forehead to its brow. A founder and the shape his mother walked out of.',
			'One low gold sunrise (#b8956a) over the plain catches his face, the bear’s fur tips and the sandalwood leaves; mountain and sky are splashed ink.'
		)
	},
	{
		id: 'dangun-gom-taebaek',
		entry: 'Dangun & Old Joseon',
		at: 'holds through a siege',
		tone: '#b8956a',
		alt: 'Poster key art: Dangun rests against the sleeping great bear on the mountain summit at night, his hand on its head as campfires burn far below',
		people: ['dangun'],
		canon: { with: ['gom'] },
		scene: S(
			'Night on a bare mountain summit above a besieged valley: tiny enemy campfires scattered far below, a huge starry sky with ink cloud. Low angle across the rock. INTERACTION: Dangun sits with his back against the flank of the huge dark-brown bear lying curled on the summit; the bear has laid its great head across his lap, and he rests one hand on its brow, watching the fires below, calm. Its breath steams in the cold.',
			'One warm firelight bounce (#b8956a) from a small brazier at their feet lights his face, his hand and the bear’s muzzle; the rest is indigo and ink, the campfires below as bokeh.'
		)
	},
	// Tamla — Gwahama
	{
		id: 'yuridora-gwahama-oranges',
		entry: 'The Ox and the Iron Chest',
		at: 'Told while he is stacking oranges badly',
		tone: '#ff9a3d',
		alt: 'Poster key art: Yuri Dora laughs under the orange trees as his little white Jeju pony steals an orange off the top of his stack',
		people: ['yuridora'],
		canon: { year: 656, with: ['gwahama'] },
		scene: S(
			'Late afternoon in an orange grove on Tamla, black volcanic stone walls between the trees, wind off the sea, storm clouds breaking. Low angle under the branches. INTERACTION: Yuri Dora, King of the orange island, crouches over a lopsided pyramid of oranges, laughing; the small sturdy white Jeju pony, short enough to stand under the orange branches, has stretched its neck past his shoulder and is stealing the top orange in its teeth, and he grabs for it too late. Orange branches arch over both of them.',
			'One warm orange sun-break (#ff9a3d) through the leaves lights the fruit, his grin and the pony’s white face; the grove falls into deep green-umber and ink. Oranges and leaves blurred in the near foreground.'
		)
	},
	{
		id: 'yuridora-gwahama-shore',
		entry: 'Tamla, the Island of Oranges',
		at: 'This is the story of the kingdom of',
		tone: '#ff9a3d',
		alt: 'Poster key art: Yuri Dora sits on the black lava shore at sunset feeding his little white Jeju pony an orange, the island’s mountain behind them',
		people: ['yuridora'],
		canon: { year: 656, with: ['gwahama'] },
		scene: S(
			'Sunset on Tamla’s black lava-rock shore, surf foaming, the great volcano of the island rising behind in cloud. Low angle from the rocks. INTERACTION: Yuri Dora sits on a black rock peeling an orange and holds a segment out; the small white Jeju pony stands nose-down at his shoulder, taking it from his fingers, its thick white mane blowing; he leans his head against its neck, telling it a story.',
			'One low orange sun (#ff9a3d) on the horizon edges his face, the orange and the pony’s white mane; the rocks and sea are ink-black and slate.'
		)
	},
	// Yamato — Kinshi
	{
		id: 'takutsu-kinshi-prow',
		entry: 'White River',
		at: 'Echi no Takutsu among the captains',
		tone: '#b05575',
		alt: 'Poster key art: Echi no Takutsu at the prow of his ship draws his bow as the golden kite lands on its tip, the fleet behind him in the mist',
		people: ['takutsu'],
		canon: { with: ['kinshi'] },
		scene: S(
			'Dawn on the sea approach to the White River, mist, a line of tiny ships dissolving behind. Worm’s-eye from the deck. INTERACTION: Echi no Takutsu stands at the high prow of his ship in his Yamato armour and raises his longbow at full draw-length; the golden kite is landing on the upper tip of the bow, wings flared wide, talons closing on the wood, and he looks up at it with a fierce, believing grin.',
			'One gold sunrise break (#b05575 rose-gold bounce) through the mist lights the kite’s feathers, the bow and his face; sea and sky are ink and slate.'
		)
	},
	{
		id: 'takutsu-kinshi-fire',
		entry: 'White River',
		at: 'Land of the Heavenly Deer',
		tone: '#b05575',
		alt: 'Poster key art: Echi no Takutsu roars amid the burning ships with the golden kite on his raised fist',
		people: ['takutsu'],
		canon: { with: ['kinshi'] },
		scene: S(
			'Night on the burning White River: hulls on fire, smoke, red water. Low dutch angle from the deck. INTERACTION: Echi no Takutsu stands on a burning deck in Yamato armour, his right fist thrust up, roaring; the golden kite has landed on his raised fist, wings half-open, screaming with him. He will not stop. Fire behind them, sparks rising.',
			'Firelight (#b05575 rose-red) is the one key, edging his face, the kite’s gold feathers and his raised arm; the river and sky are smoke and ink. Sparks as painted bokeh.'
		)
	}
];

writeFileSync(new URL('./monarch-animals-manifest.json', import.meta.url), JSON.stringify(items, null, '\t') + '\n');
console.log(items.length, 'items');
