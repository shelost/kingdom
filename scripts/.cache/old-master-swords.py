"""Old-master sword stills: darkness, glistening steel, one named Renaissance/Baroque pose per beat."""
import json

OUT = 'scripts/.cache/old-master-swords-manifest.json'
CROP = 'Composed for a 2:1 letterbox crop; nothing important at the top or bottom edge.'
DARK = ('Encased in darkness: at least 80% of the frame is near-black umber void, the figures pulled out of it by one hard raking key. '
        'Old-master tenebrist canvas (Caravaggio, Georges de La Tour, Rembrandt): broken-colour oil brushwork, glazed umber-black darks, '
        'impasto on the brightest highlight, canvas grain; silk brushed in loaded strokes; only faces and hands keep clean webtoon ink line. '
        'The steel glistens: the key runs down every blade as one long white-hot streak with a tiny star-glint on the edge.')

# id, entry, after, tone, at, alt, people, canon, pose + scene
STILLS = [
    ('gesomun-perseus', 'Yeon’s Massacre', 'banquet-blood', '#d0362f',
     'he takes each commander’s blade himself',
     'Cellini’s Perseus in the banquet hall: Yeon on an overturned table, a commander’s ring-pommel sword raised high, his own crow blade lowered',
     ['gesomun'], {'year': 642, 'battle': True},
     'POSE: Cellini’s Perseus. Worm’s-eye from the wet floor of the Pyongyang banquet hall at night: Yeon Gesomun stands on an overturned lacquer banquet table, weight on one leg, head bowed as he looks down, right arm raising a captured commander’s ring-pommel sword high overhead, his own crow-ring sword hanging low in his left hand. At his feet the edge of a slumped commander’s silk sleeve and a spilled wine cup, no gore. One fallen oil lamp on the floor below him is the only key, raking up his red-wing lamellar and both blades; smoke drifts; the hall’s pillars dissolve into black.'),
    ('euija-gesomun-emmaus', 'Euija & Gesomun', 'yeon-threat', '#e08a2e',
     'Give me one reason I should not cut you down',
     'Caravaggio’s Supper at Emmaus: Euija flings both arms wide laughing, Gesomun leans in over the sword on the table',
     ['euija', 'gesomun'], {'year': 642, 'sword': True},
     'POSE: Caravaggio’s Supper at Emmaus. Low across a dark table in a closed Pyongyang room at night: a ring-pommel sword lies flat on the table between them, pointed at nothing. Right, Euija throws himself back in his chair with both arms flung wide, head tipped back, roaring with laughter. Left, Gesomun half-risen, leaning over the table on one fist beside the sword, glaring. One clay oil dish on the table edge is the only light, rakes across both faces from below and runs a bright streak down the blade; a wine jar and two cups catch it at the near edge; the walls are black.'),
    ('yushin-st-george', 'Kim Yushin', 'alchun-ready-restraint', '#2A5FB8',
     'Kim Yushin is the Greatest Blade of Samhan',
     'Donatello’s St George: Yushin square in the dark, sword point-down between his boots, both hands stacked on the ring',
     ['yushin'], {'year': 642, 'battle': True},
     'POSE: Donatello’s St George. Low worm’s-eye from the stone floor of a dark fortress gatehouse at night: Kim Yushin stands square in contrapposto, weight on one leg, head turned a little aside with a level stare, his ring-pommel sword point-down on the flagstone between his boots, both gauntleted hands stacked on the small ring. One narrow shaft from a high arrow-slit falls on him from the side and runs straight down the blade to the floor. Steel lamellar plates catch the key; blue cloth at the collar; the gatehouse arch dissolves into black.'),
    ('two-correct-answers', 'Kim Yushin', 'yushin-st-george', '#d9b13a',
     'a tavern argument with two correct answers',
     'Two Davids back to back across a black seam: Yushin calm and upright, Gyebek coiled in reverse grip',
     ['yushin', 'gyebek'], {'year': 642, 'sword': True},
     'POSE: two Davids, Michelangelo’s and Bernini’s, back to back. A dark split frame with one thin black vertical seam down the middle. Left: Kim Yushin as Michelangelo’s David, upright contrapposto, head turned left, his ring-pommel sword held forward-grip and low at his side, lit by a cold blue-white key from the left. Right: Gyebek as Bernini’s David, coiled low in a twisting crouch, head turned right, his straight ring-pommel blade held in reverse grip with the ring above his thumb and the steel lying back along his forearm, lit by a warm gold key from the right. The two never meet; both blades glisten; everything else black.'),
    ('yushin-jerome', 'Kim Yushin', 'yushin-dawn-vigil', '#2A5FB8',
     'After the twentieth, nobody was counting.',
     'La Tour’s Magdalene: Yushin alone by one candle, sword across his knees, a helm where the skull would be',
     ['yushin'], {'year': 642, 'sword': True},
     'POSE: Georges de La Tour’s Penitent Magdalene. Low three-quarter side view in a dark campaign tent: Kim Yushin sits on a stool, head bowed, chin on his fist, his drawn ring-pommel sword lying across his knees, a cloth in his other hand halfway down the blade. On the low table before him one candle and a dented steel helm where the skull would be in the painting. The candle is the only light: it carves his face and hands, and the blade throws a long bright streak back into the dark; his shadow climbs the tent wall behind.'),
    ('chunchu-ecce-homo', 'Chunchu & Gesomun', 'chunchu-prison', '#D8258C',
     'His left hand is a red glove.',
     'Caravaggio’s Ecce Homo: Chunchu presented between two attendants, bleeding hand lifted, face perfectly composed',
     ['chunchu', 'dosuryu'], {'year': 642},
     'POSE: Caravaggio’s Ecce Homo. Tight three-figure frame in a dark Pyongyang palace corridor at night: Chunchu stands between two attendants who grip his arms, his left hand lifted a little before him, red and dripping, his face calm and almost amused. Dosuryu leans in from the right edge in profile, hand on his sword hilt, the ring-pommel catching the light. One torch off frame left rakes hard across Chunchu’s face, the blood and Dosuryu’s blade; a guard’s spear tip glints in the black behind.'),
    ('yung-pieta', 'White River', 'takutsu-kinshi-fire', '#d4b45a',
     'Our father gave it to him the year they sent him east.',
     'The Pietà on the Tang flagship: Yung kneels with his brother’s worn ring-pommel sword laid across his lap',
     ['yung', 'liurengui'], {'year': 663, 'sword': True},
     'POSE: Michelangelo’s Pietà. Inside the dark hold of a Tang flagship at night: Buyeo Yung kneels on the deck boards, head bowed, his brother’s plain Baekje ring-pommel sword laid across his lap and forearms the way the Virgin holds the body, one hand under the blade and one on the worn ring. Behind him, half in shadow, Liu Rengui stands watching. Red-orange firelight from the burning river comes through a gap in the hull planks, rakes across Yung’s face and runs one long streak down the blade; everything else is black wet timber.'),
    ('boksin-palms', 'Baekje Restoration Society', 'boksin-executed', '#a8781f',
     'bound with a leather thong through the palms',
     'Caravaggio’s Martyrdom of St Matthew: Boksin on his knees, palms bound, spitting upward as the sword rises over him',
     ['boksin', 'pung'], {'year': 663, 'sword': True},
     'POSE: Caravaggio’s Martyrdom of Saint Matthew. A dark hall at Juryu fortress at night: General Boksin kneels on the floor, palms bound together with a leather thong, head thrown back, spitting up at the dais. Over him an executioner raises a ring-pommel sword two-thirds into the frame, the blade high and catching the light. Far back on the dais King Pung sits in shadow, half-turned away, only his hand on the throne arm lit. One brazier at floor level is the key, raking up Boksin’s face and the raised blade; the room is black. No gore.'),
    ('xue-calling', 'Stallion Mountain', 'xue-white-ridge', '#e8e3d5',
     'Blood on the crescent of the ji.',
     'Caravaggio’s Calling of St Matthew: the Emperor points out of the dark at the kneeling farmer in white',
     ['xuerengui', 'taizong', 'lishiji'], {'year': 645},
     'POSE: Caravaggio’s Calling of Saint Matthew. Inside the Emperor’s dark campaign pavilion at dusk: from the right, in shadow, the Second Emperor stretches out his arm and points across the frame; Li Shiji at his shoulder. Left, Xue Rengui kneels on one knee in dirt-streaked white armour, looking up, the fangtian ji upright in his fist, its crescent blade wet and glistening. A single hard shaft of low sun slants in through the open tent flap above the Emperor’s pointing hand and lands on Xue’s face and the ji; the rest of the pavilion is black.'),
    ('gesomun-lamentation', 'The Death of Yeon Gesomun', 'yeon-deathbed', '#d0362f',
     'That is precisely why I am telling you.',
     'Mantegna’s Lamentation: Gesomun dying, foreshortened from his feet, his crow swords on the wall above, his sons at the edge',
     ['gesomun', 'namseng', 'namgun'], {'year': 665, 'sword': True},
     'POSE: Mantegna’s Lamentation of Christ. Extreme foreshortening from the foot of the bed: Yeon Gesomun lies on his back on a low bed under a red coverlet, old now, the soles of his bare feet huge in the foreground, his head raised a little on the pillow, eyes open and hard. On the black wall above the bed his five crow-ring swords hang in their scabbards, two drawn a hand-width so the steel shows. At the left edge his sons Namseng and Namgun lean in, faces half lit. One oil lamp beside the pillow is the only light, raking along his body and up the bared steel; the room drowns in black.'),
    ('wonsul-gate', 'Stone Gate', 'seokmun-title', '#2A5FB8',
     'Another man’s son may retreat.',
     'Rembrandt’s Prodigal Son, refused: Wonsul kneels at his father’s shut gate offering his sword flat on both palms',
     [], {'year': 672, 'sword': True},
     'POSE: Rembrandt’s Return of the Prodigal Son, with no father in the doorway. Night outside a Silla noble house in Surabol: Wonsul, Yushin’s young son, kneels on the stone step before a shut timber gate with iron bosses, head bowed, in torn grey steel lamellar with blue cloth at the collar, holding his ring-pommel sword out flat on both upturned palms. Behind the gate’s lattice window above him one lamp burns, and the shadow of an old man stands behind the paper, turned away. The lamp rakes down across his bowed head and the offered blade; the street is black rain.'),
    ('munhun-rises', 'Maeso Fortress', 'maeso-map', '#2A5FB8',
     'When the last horse is off, Munhun stands up.',
     'Bernini’s David on the dune: Munhun twists up out of the grass, sword drawn, the Tang horses standing in the surf behind',
     [], {'year': 675, 'battle': True, 'with': ['flag:silla', 'flag:tang']},
     'POSE: Bernini’s David. Low worm’s-eye from the dune grass at dusk on the Cheonseong beach: the Silla general Munhun twists up out of the grass mid-coil, torso wound, jaw set, his ring-pommel sword drawn back over his shoulder ready to swing, grey steel lamellar with blue cloth at the collar, tall cone helm. Behind and below him, small, the empty Tang ships in the shallows and a line of unloaded horses standing in the surf. One last red sun break behind the boats rims his blade with a long glistening streak; the dune and sky are black-violet.'),
    ('chiljido-votive', 'The Seven Branched Sword', 'sword-forge', '#d9b13a',
     'It has never been sharpened.',
     'La Tour’s candle: a Baekje envoy holds the Seven-Branched Sword upright before his closed eyes, gold inlay glittering',
     [], {'year': 371},
     'POSE: Georges de La Tour’s candlelit devotion. Close three-quarter in a black room: a Baekje envoy in dark court silk and a black gauze cap holds the Seven-Branched Sword upright in both hands before his face, eyes closed. The relic: a straight iron central blade with three short curved branches alternating up each side, six branches in all, a column of gold-inlaid characters down the centre (illegible glints, no readable text). One candle on the table below is the only light: it lights his face and fingers from beneath and makes every branch and the gold inlay glitter; the room is black.'),
]

items = []
for sid, entry, after, tone, at, alt, people, canon, scene in STILLS:
    items.append({'id': sid, 'entry': entry, 'after': after, 'tone': tone, 'at': at, 'alt': alt,
                  'people': people, 'canon': canon,
                  'scene': f'HEEWON STYLE. {scene} {DARK} {CROP}'})
json.dump(items, open(OUT, 'w'), ensure_ascii=False, indent=1)
print(len(items), '->', OUT)
