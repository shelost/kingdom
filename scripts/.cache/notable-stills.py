"""Builds notable-stills-manifest.json (Gyebek's general-killer, statue replicas, Secretariat, Exile, Talhae, Alji, Seohyun)."""
import json

OUT = 'scripts/.cache/notable-stills-manifest.json'
CROP = 'Composed for a 2:1 letterbox crop; nothing important at the top or bottom edge.'
STATUE = ('Painted replica of the attached statue still (composition and statue design only): repaint it as a tenebrist, '
          'high-contrast old-master oil painting, the statue’s face re-sculpted from the attached character portrait so the '
          'cast features are clearly that man. ')

items = []


def add(entry, sid, at, alt, scene, people=(), canon=None, refs=(), tone=None):
    item = {'id': sid, 'entry': entry, 'at': at, 'alt': alt, 'scene': f'{scene} {CROP}'}
    if tone:
        item['tone'] = tone
    if people:
        item['people'] = list(people)
    if canon is not None:
        item['canon'] = canon
    if refs:
        item['refs'] = list(refs)
    items.append(item)


def chain(entry, first_after, specs):
    after = first_after
    for spec in specs:
        add(entry, **spec)
        items[-1]['after'] = after
        after = spec['sid']


# Gyebek's general-killer: Gomanari ride-and-cut
SIG = {'year': 648, 'battle': True, 'mounted': True, 'with': ['flag:silla']}
SILLA_GENERAL = 'a Silla general in steel lamellar with a tall pointed jonghyeongju helm, blue cloth peeking at the collar, on a chestnut horse'
chain('Gyebek’s Exile', 'yunbi-clan-2', [
    dict(sid='gyebek-sig-ridge', at='goes looking for the general', tone='#d9b13a', people=['gyebek'], canon=SIG,
         alt='Far wide at storm dusk: a Silla general and his escort on a low rise look the wrong way while a tiny black rider streaks toward them across the empty field, a single line of dust behind him',
         scene=f'Far wide from low in dry autumn stubble at storm dusk. On a low rise on the right third, {SILLA_GENERAL}, with four mounted escorts and limp blue banners on poles, all looking the wrong way toward smoke on the horizon. Across the vast empty field from the left, a tiny black horse and rider streak toward them flat out, one long thin plume of dust trailing behind like a drawn line. ONE device: that dust-line diagonal across the empty field. Half the frame granulated storm sky; one low cloud-break rakes gold across the stubble and catches the dust line. Dark out-of-focus grass heads in the foreground.'),
    dict(sid='gyebek-sig-tuck', at='rides him flat along the neck like a thrown knife', tone='#d9b13a', people=['gyebek'], canon=SIG,
         alt='Tracking at hoof height: Gyebek folded flat along Gomanari’s neck at full gallop, the reverse-gripped blade laid back along his forearm, the ground a blur',
         scene='Low tracking shot at hoof height, the camera racing alongside. Gyebek folded flat and aerodynamic along Gomanari’s neck, cheek almost on the streaming black mane, rider and horse one long low line like a thrown knife. His right hand holds the ring-pommel sword in reverse grip: small ring above his thumb, straight blade laid flat back along his forearm and the horse’s flank, edge out. Gomanari at full stretch, all four hooves off the ground, ears pinned, neck level, mane and tail streaming flat. The ground is a horizontal motion blur of stubble and flung clods. ONE device: that long horizontal line of horse and rider against the blur. A low sun from the side rakes across his steel lamellar, the yellow cloth at his collar and the black horse’s muscle. A blurred grass stalk whips past in the foreground. Gyebek’s eyes narrow and fixed ahead, grim, not smiling.'),
    dict(sid='gyebek-sig-turn', at='starts to turn his horse', tone='#d9b13a', people=['gyebek'], canon=SIG,
         alt='Over the Silla general’s shoulder as he hauls his horse around: Gyebek on the black horse, low and foreshortened, already filling the gap',
         scene=f'Over-the-shoulder from behind {SILLA_GENERAL}: his tall pointed helm and blue collar dark and out of focus fill the left foreground, his gauntlet hauling the rein as the chestnut twists its head. In the sharp midground, coming straight at the lens out of gold dust, Gyebek low on the black horse Gomanari, foreshortened, the horse’s head and chest huge, his face just above the mane, eyes locked on the general. ONE device: the gap between the general’s shoulder and the chestnut’s twisting neck framing the black rider. Storm dusk, one low shaft from the side, dust bokeh glittering.'),
    dict(sid='gyebek-sig-cut', at='One cut on the pass.', tone='#d9b13a', people=['gyebek'], canon=SIG,
         alt='The instant the horses cross: Gyebek snaps one backhand draw-cut and is already past, a bright arc hanging in the air, the Silla general’s plumed helm spinning away',
         scene=f'Side-on at the instant the two horses cross, frozen like a samurai iai cut. Gyebek on the black Gomanari passes left to right at full gallop, already a length beyond, his right arm snapped outward in a backhand draw-cut, the reverse-gripped straight ring-pommel sword extended to the side. A single thin bright arc of light hangs in the air behind the blade. ONE device: that bright crescent of the cut slicing across the frame. On the right, {SILLA_GENERAL} rears away, the general slumping back out of frame, his tall plumed helm spinning in the air, blue plume flying. No blood, no gore, no severed body. Background a dark storm wash with one gold break; flung dust blurs in the foreground. Gyebek’s face calm and grim; he does not look back.'),
    dict(sid='gyebek-sig-riderless', at='a speck on the far ridge', tone='#d9b13a', people=['gyebek'], canon=SIG,
         alt='A riderless Silla horse and an empty plumed helm in the stubble; far off on the ridge, the black horse crests and is gone',
         scene='Low wide. In the sharp foreground on the left third, a riderless Silla chestnut horse with an empty saddle and a dragging rein, its blue saddle-cloth catching the last light, looking back over its shoulder. On the stubble before it lies a tall pointed Silla helm with a blue plume, empty. Four Silla escorts in the midground sit frozen with swords half drawn, too late. Far away on the far ridge on the right third, against one pale storm break, the tiny black silhouette of Gyebek on Gomanari crests and vanishes, a thin dust trail behind. ONE device: the long empty field between the riderless horse and the speck.'),
    dict(sid='gyebek-sig-frozen', at='nobody left to tell it what to do', tone='#2A5FB8', canon={'year': 648, 'with': ['flag:silla']},
         alt='Crane shot down on a halted Silla column: ranks of tiny soldiers under blue banners standing still around one empty ring and a riderless horse',
         scene='High crane shot looking down on a Silla army column halted in a stubble field at dusk: ranks of tiny soldiers with blue banners standing still, every head turned the same way. In the centre of the column, a small ring of empty ground around one riderless chestnut horse. ONE device: that empty ring in the ranks. Long raking shadows from one low gold break; the rest storm-dark slate. No Baekje rider in frame, only a faint dust trail leaving the top right of the field.'),
])

# Statue replicas
add('Yellow Mountain Fields', 'statue-gyebek-field', 'The Yellow Mountain keeps the dust.',
    'Painted: the bronze Gyebek on his plinth alone on the dark Yellow Mountain field, a single votive lamp at his feet, one blood-orange break raking the cast lamellar',
    STATUE + 'The same bronze Gyebek on a stone pedestal, alone on the dark Hwangsanbeol grass: steel-lamellar armor cast in bronze, scarf and sash knotted, the ring-pommel sword held point-down in his right hand. Worm’s-eye from the dry grass at the foot of the plinth, the statue towering on the left third against a storm-dusk sky. One low blood-orange cloud-break rakes across the bronze from the side, so the cast plates, cloth folds and knuckles stand up in hard highlights and fall into black. A single small votive oil lamp burns on the plinth step in the sharp foreground, the nearest light, throwing the statue’s shadow up the stone. Green-black patina, worn gold on the edges; 75% of the frame deep shadow.',
    people=['gyebek'], canon={'year': 660, 'sword': True}, refs=['/scene_gyebek-who-am-i_15.jpg'], tone='#d9b13a')
add('Yellow Mountain Fields', 'statue-gyebek-gomanari', 'goes south toward the ferry it was named for',
    'Painted: a bronze equestrian of Gyebek folded along Gomanari’s neck at full gallop, on a plinth by the night ferry at Gomanaru, river mist and one lantern',
    'A bronze equestrian monument by the old Gomanaru ferry landing on the Geum river at night: Gyebek cast in his signature ride, folded flat along Gomanari’s neck at full gallop, the reverse-gripped ring-pommel sword laid back along his forearm, the bronze horse at full stretch with only one hoof touching the granite plinth, mane cast streaming flat. The bronze face is sculpted from the attached portrait. Low three-quarter from the riverbank reeds, the monument on the right third, black river and mist filling the left half, a moored ferry boat dark in the haze. One stone lantern on the landing beside the plinth is the key, raking up the horse’s chest and the rider’s plates in hard warm highlights against inky black; a thin cold moon-break grazes the far edge. Tenebrist, high contrast, painterly oil over watercolor wash.',
    people=['gyebek'], canon={'year': 660, 'sword': True, 'with': ['gomanari']}, tone='#d9b13a')
add('The Death of Kim Yushin', 'statue-yushin-equestrian', 'crowned after he was dead',
    'Painted: the bronze equestrian Yushin, sword raised, horse rearing on its plinth, carved out of a storm by one break of gold light',
    STATUE + 'The same bronze equestrian Kim Yushin: the horse rearing on a granite plinth, Yushin in cast lamellar and pointed helm raising the ring-pommel sword overhead, beard and face sculpted from the attached portrait. Extreme worm’s-eye from the foot of the plinth, the monument climbing out of the lower right into a towering storm sky. Tenebrist: the sky mostly deep indigo-black cloud, one narrow gold break behind the raised blade, the hard key raking the horse’s chest, the rider’s plates and his upturned face from the side and dropping off to black; Silla blue #2A5FB8 only as a cold edge of sky-light on the bronze. Green-black patina, worn bright edges, painted with heavy impasto.',
    people=['yushin'], canon={'year': 673, 'sword': True}, refs=['/scene_yushin-sword_15.jpg'], tone='#2A5FB8')
add('The Death of Kim Yushin', 'statue-yushin-niche', 'He is buried at Geumsan with the honours of a king',
    'Painted: the granite Yushin standing in his rock niche, under-lit by one oil lamp set at his feet, half the carved face in black',
    STATUE + 'The same granite Kim Yushin carved standing in a rough rock niche, Seokguram-like: lamellar armor in stone, hand on the sword hilt at his hip, topknot and beard, the face carved from the attached portrait. Night. An oil lamp set on the niche floor at his feet, in the sharp foreground, is the only light: it under-lights the statue from below so the carved plates, knuckles and beard throw long shadows upward and half the stone face sinks into black; the niche walls recede at an angle so the statue’s shadow climbs the rock behind him. Gritty granite texture in thick impasto, a blue #2A5FB8 cast of moonlight only on the outer rim of the niche. Three planes: a dark blurred incense stick and offering bowl in the foreground, the statue sharp, the rock dissolving into black.',
    people=['yushin'], canon={'year': 673, 'sword': True}, refs=['/scene_yushin-sword_12.jpg'], tone='#2A5FB8')
add('The Death of Buyeo Euija', 'statue-euija-gilt', 'A man the court once called the Zengzi of the East.',
    'Painted: the gilt-bronze Euija on his lotus plinth in a black hall, one candle low at his feet lighting the gold crown flowers from below',
    STATUE + 'The same gilt-bronze King Euija standing on a lotus plinth in a dark museum-like hall: tall gold flower crown with hanging pendants, layered court robe cast in scaled bronze, hands at his sides, the face re-sculpted from the attached portrait — his loud royal grin softened into a proud, tired half-smile. Low three-quarter, the statue large on the left third. A single candle on the plinth step in the sharp foreground is the key, raking up across the gilding so every cast fold, scale and crown leaf stands up in burning gold highlights and falls into umber-black; the hall behind is 80% black with one far small statue dissolving in bokeh. Worn gilt over dark bronze, thick impasto on the brightest gold.',
    people=['euija'], canon={'year': 650}, refs=['/scene_euija-ambition_12.jpg'], tone='#d9b13a')

# The Royal Secretariat
MP = ['/pl_moon_palace.png']
SEC = 'The Royal Secretariat'
add(SEC, 'secretariat-seal-dutch', 'A seal.', 'Dutch angle in the side hall: Chunchu holds the small royal seal into the lamp’s pool while three clerks lean in behind him',
    'Dutch angle, low three-quarter, inside a small cleared side hall of the moon palace at night. Chunchu mid-turn toward three clerks, holding a small bronze royal seal up between two fingers close to the lens, the seal sharp in the foreground. A single oil lamp on the bare table below rakes up across his face and magenta silk; three clerks out of focus behind, one already lifting a brush. Timber pillars recede at an angle, his shadow climbing the wall. ONE device: the seal held into the lamp’s pool.',
    people=['chunchu'], refs=MP, tone='#D8258C')
add(SEC, 'secretariat-jukji-kneel', 'Then you are', 'Worm’s-eye: Jukji drops to one knee, fighting a grin, as Chunchu lays the seal-cord across his palms',
    'Worm’s-eye from the floorboards. Jukji, young True Bone Hwarang, kneels on one knee before the bare work table, head up, startled into a grin he is trying to suppress. Chunchu stands over him in the dark foreground, only his magenta sleeve and hand in frame, laying a silk seal-cord across Jukji’s open palms. One oil lamp on the floor beside the lens rakes up both of them; pillars recede, shadows climb the ceiling beams.',
    people=['jukji', 'chunchu'], refs=MP, tone='#D8258C')
add(SEC, 'secretariat-empty-council', 'before the Council finishes clearing its throat', 'Jukji leans over a sealed petition in the working hall; through the far door the Harmony Council is still arguing, small and bright',
    'Deep-focus shot through a doorway at night. In the sharp foreground a working desk with a stamped, tied petition packet and one lamp; Jukji leans on both fists over it, looking out at us. Through the far open door, across a dark courtyard, the Harmony Council hall glows: tiny old lords in polished chairs mid-argument, gesturing. ONE device: the door frame cropping the council into a small bright box in the black.',
    people=['jukji'], refs=MP, tone='#D8258C')
add(SEC, 'secretariat-courier', 'Petition. Seal. Courier.', 'Out through the moon-palace gate at blue dusk: one courier breaks into a gallop with the sealed packet on his back',
    'Low over-the-shoulder from inside the moon-palace gate at blue dusk. One courier on a bay horse breaks into a gallop out through the stone hongye arch, a sealed packet strapped across his back catching the single red lantern by the gate. Wet yard stones; the giwa munru above in silhouette against a storm sky with one pale break. ONE device: the dark arch framing the departing rider small in the lower third.',
    refs=MP, canon=False, tone='#D8258C')
add(SEC, 'secretariat-side-hall', 'Three clerks. One courier captain.', 'Chunchu, sleeves pushed back, shoves a bare banquet table into the middle of an empty side hall while his first three clerks hover in the doorway with lamps',
    'Wide and low in a small bare side hall of the moon palace at night. Chunchu alone pushes a long empty banquet table into the centre of the floor with both hands, sleeves pushed back, leaning his weight into it. In the doorway behind, three clerks and a courier captain stand holding lamps and bundles, uncertain. ONE device: the long bare table as a hard horizontal bar in the pool of light. One oil lamp set on the near table end in the foreground is the key, raking across the grain of the table and his magenta silk.',
    people=['chunchu'], refs=MP, tone='#D8258C')
add(SEC, 'secretariat-getting-it', 'Are you getting it?', 'Across the work table: Chunchu taps petition, seal and tally laid in a row and looks up at the youngest clerk, whose brush hovers',
    'Close two-shot across the work table at night. Chunchu leans over it, one finger tapping a tied petition; a bronze seal and a courier’s wooden tally lie beside it in one straight row under one lamp. He looks up from under his brows with a sly half-smile at the youngest clerk, whose brush hovers wide-eyed over a blank sheet. The lamp on the table rakes from below and the side; the other clerks melt into bokeh behind.',
    people=['chunchu'], refs=MP, tone='#D8258C')
add(SEC, 'secretariat-polished-chairs', 'in polished chairs', 'The Harmony Council at dawn: polished chairs, small stiff old lords, and a petition already sealed and lying in the one shaft of light',
    'Wide interior of the Harmony Council hall at pre-dawn: rows of polished lacquered chairs on a dark reflective floor; old council lords sit small and stiff in the far chairs, one asleep, one mid-speech with a raised hand. A single shaft from a high lattice window falls on the empty speaker’s table, where a petition already lies sealed and tied. ONE device: the shaft landing on the petition. 70% of the hall in umber dark.',
    refs=MP, canon=False, tone='#D8258C')
add(SEC, 'secretariat-market-joke', 'Our prince is in love with the emperor', 'Night market: a storyteller on a crate mimes a lovesick prince bowing to a paper Tang crown; at the dark edge, Chunchu listens under a hood and does not smile',
    'Night market street in Surabol, paper lanterns overhead. A storyteller on an upturned crate mimes a lovesick prince bowing to a paper Tang crown on a stick, a small crowd laughing in warm bokeh behind him. In the sharp dark foreground at the frame edge, Chunchu half-hidden under a hooded cloak listens in profile, not smiling, not correcting, one lantern catching his cheek in magenta-warm light.',
    people=['chunchu'], tone='#D8258C')
add(SEC, 'secretariat-munhee', 'a door that opens when he knocks', 'Munhee, packing a travel chest by lamplight, looks back over her shoulder with a dry little smile',
    'Medium close in a lamp-lit chamber at night. Munhee kneels at an open travel chest folding silk, and looks back over her shoulder with a dry little smile, mid-sentence. Behind her an open door frames a dark corridor. One oil lamp on the floor beside the chest rakes across her silk folds and the chest’s brass corners; her shadow climbs the screen wall at an angle.',
    people=['munhee'], tone='#D8258C')

# Gyebek's Exile and the clan truce
EX = 'Gyebek’s Exile'
add(EX, 'exile-queen-bier', 'Euija begins the traditional mourning period.', 'The mourning hall: Euija kneels in hemp at the foot of his mother’s bier while an official’s sleeve lifts the royal seal box away at the frame edge',
    'Night mourning hall in Sabi. Queen Satek lies in state under white hemp on a bier, censers smoking. Euija kneels at its foot in coarse undyed hemp mourning clothes over his court robe, a straw cord on his head, bowed but eyes open and furious at the floor. At the frame edge, an official’s sleeve lifts the lacquered royal seal box from its stand and carries it out of the light. One lamp at the foot of the bier rakes across Euija and the hemp folds; the hall dissolves into black.',
    people=['euija'], canon={'year': 655}, tone='#d9b13a')
add(EX, 'exile-gate-count', 'counted twice at the gate by both sides', 'A monastery gate at night in rain: two clan retinues face each other while two stewards count the men aloud on raised fingers',
    'A mountain monastery gate at night in rain, real timber gate with a giwa roof and iron-bossed doors. Under it two clan retinues stand in facing lines, one house in dark teal sashes, the other in rust-red. Two stewards with lanterns walk the lines counting men on raised fingers, each counting the other side. ONE device: the gate’s dark doorway splitting the two lines. Lanterns are the only key; rain streaks catch the light; wet stone steps reflect it.',
    canon=False, tone='#8a6a3a')
add(EX, 'exile-lantern-festival', 'died at the lantern festival', 'Last year’s lantern festival: a fallen lantern burns on the stones of a Sabi street as two clan youths’ retinues break apart',
    'Flashback mood: lantern festival night on a Sabi street a year earlier. Paper lotus lanterns overhead; in the street two young clan retinues have just broken apart from a brawl, one lantern fallen and burning on the stones in the sharp foreground, its fire the key. A young man in teal silk is down on one knee clutching his side; across from him a youth in rust-red stares at his own empty hand. Crowds flee into warm bokeh. No gore.',
    canon=False, tone='#8a6a3a')
add(EX, 'exile-footprints', 'a second set of footprints behind the monastery screen', 'Behind the screen: a servant’s lamp, held to the floor, finds a second set of small careful footprints in the dust',
    'Low close shot behind a paper monastery screen at night. A servant’s hand holds a lamp near the floorboards, revealing a second set of small, careful footprints in the dust leading to a narrow back door left ajar. Through the translucent screen, the blurred silhouettes of two old clan elders at wine. ONE device: the line of footprints crossing the pool of lamplight into black. No writing on the screen.',
    canon=False, tone='#8a6a3a')
add(EX, 'exile-shape-of-fight', 'arranged by habit into the shape of a fight', 'Bird’s-eye on the monastery yard: two knots of retainers standing apart on wet flagstones, arranged without meaning to into two facing wedges',
    'Bird’s-eye straight down on a monastery courtyard at night after rain. Two clusters of retainers stand apart on wet flagstones, unconsciously arranged as two facing wedges, torches in a few hands, long shadows reaching toward each other. One lit lattice window of the hall throws a single bar of warm light across the gap between them. ONE device: that bar of light lying in the empty strip between the two wedges.',
    canon=False, tone='#8a6a3a')
add(EX, 'exile-name-offer', '…I already have one.', 'Elder Satek slides a tray of genealogy and an ancestral tablet across the floor; Gyebek kneels opposite and does not touch it',
    'Medium two-shot low on the floor of a clan chamber at night. Elder Satek kneels on the left, sliding a lacquered tray across the floorboards: rolled genealogy scrolls tied with cord, closed, and a small blank ancestral tablet. Gyebek kneels on the right, hands flat on his knees, not touching it, eyes on the tray, jaw set. An oil lamp on the floor between them is the key, raking up both faces from below; their shadows climb the screen walls on either side. No visible writing.',
    people=['eldersatek', 'gyebek'], canon={'year': 655}, tone='#d9b13a')
add(EX, 'exile-tent-arrow', 'The arrow comes through a tent wall', 'Inside the drill-ground tent: an arrow punches a star of light through the canvas; the taller man beside Gyebek falls, and Gyebek is already low',
    'Inside an army tent at the Ungjin drill ground at dusk. An arrow has just punched through the canvas wall, leaving a torn star of hard gold light. A tall officer beside Gyebek falls backward out of frame. Gyebek is already crouched low, hand on his sword hilt, eyes on the hole. A hanging lamp swings, throwing his shadow across the slanted canvas. No gore.',
    people=['gyebek'], canon={'year': 655, 'sword': True}, tone='#d9b13a')
add(EX, 'exile-watched-cooking', 'He stops eating food he has not watched being cooked.', 'In a smoky army kitchen at night, Gyebek sits on a low stool, arms folded, watching the cook stir',
    'An army kitchen at night, smoke under the rafters. Gyebek sits on a low stool, arms folded, unblinking, watching a nervous cook stir a pot over a brazier. The brazier fire is the key, raking up his face and the cook’s sweating profile; everything else falls into smoke and black, a few embers rising as bokeh.',
    people=['gyebek'], canon={'year': 655}, tone='#d9b13a')
add(EX, 'exile-seongchung', '…I don’t run.', 'Night colonnade: old Seongchung grips Gyebek’s forearm and urges him away; Gyebek looks down the dark corridor',
    'Night colonnade of the Sabi palace, pillars receding at an angle. Seongchung, the old minister, grips Gyebek’s forearm with both hands, leaning in, urging. Gyebek stands half turned away, looking down the dark corridor, unmoved. One hanging lantern between them is the key; their shadows run long down the floorboards.',
    people=['seongchung', 'gyebek'], canon={'year': 655}, tone='#d9b13a')
add(EX, 'exile-berth', 'Satek water at the berth', 'Grey dawn at the Sabi berth: Gyebek walks up the gangplank alone with nothing in his hands while Minister Satek watches from the quay, the seal pouch under his sleeve',
    'Sabi port at pre-dawn, river mist. Gyebek walks up a gangplank onto a small sailing ship alone, carrying nothing, his back to us; the captain at the rail looks away. On the quay in the foreground, Minister Satek stands in dark silk, one hand resting on a seal pouch under his sleeve, watching. One lantern on the quay post is the key; the ship and the far bank dissolve into grey wash.',
    people=['ministersatek', 'gyebek'], canon={'year': 655}, refs=['/pl_sabi_port.png'], tone='#d9b13a')

# Talhae
TA = 'Talhae'
add(TA, 'talhae-chest-tide', 'a chest comes in on the tide at', 'Dawn at Ajinpo: a lacquered chest bobs in the surf with a magpie flying low over it, crying',
    'Wide at storm dawn off the rocky shore of Ajinpo. A lacquered wooden chest bobs in dark surf, a single magpie flying low over it, crying, its black-and-white wings catching one low gold cloud-break. Half the frame granulated storm sky; black basalt rocks in the foreground out of focus. ONE device: the bright line of the breaking wave carrying the chest.',
    canon=False, tone='#3a6a8a')
add(TA, 'talhae-feathers', 'standing in the middle of the hall with feathers on his shoulders', 'In King Suro’s hall: Talhae, a man again, bows with feathers drifting off his shoulders; Suro on the throne, feathers settling, pale with relief',
    'Inside King Suro’s Gaya hall at night, torches on the pillars. Talhae, a man again, stands in the middle of the floor bowing with a lopsided grin, small brown sparrow feathers drifting off his shoulders. On the dais King Suro sits gripping the throne arms, falcon feathers still settling around him, pale with relief. One torch near Talhae rakes across him; the hall recedes at an angle into black.',
    people=['talhae', 'suro'], tone='#3a6a8a')
add(TA, 'talhae-old-woman', 'You’re not a fish.', 'On the Ajinpo shore an old fisherwoman opens the chest and finds a small boy sitting among the treasure, unbothered',
    'Low on the sand at dusk on the Ajinpo shore. An old fisherwoman kneels by an opened lacquered chest, rope still in her hand, peering in. Inside, among gold and folded silk, a small boy sits upright looking back up at her, completely unbothered. A magpie perches on the open lid. The low sun rakes across the gold and her weathered face; the sea is a dark wash behind.',
    canon=False, tone='#3a6a8a')
add(TA, 'talhae-whetstone', 'buries a whetstone and a sack of charcoal beside Hogong’s gate', 'Moonlit night: young Talhae crouches by Hogong’s gate scooping earth over a whetstone and a charcoal sack, grinning over his shoulder',
    'Night on a crescent-shaped rise above the river. Young Talhae crouches beside the timber gate of a minister’s house, scooping earth with his hands over a whetstone and a sack of charcoal, glancing back over his shoulder with a grin. A paper lantern hanging over the gate is the one warm key; cold moonlight on the giwa roof edge.',
    people=['talhae'], canon={'year': -10}, tone='#3a6a8a')
add(TA, 'talhae-prove-it', '…You buried those last night.', 'Morning at the gate: the dug hole, black whetstone and charcoal on the earth, old Hogong pointing in outrage, Talhae deadpan with folded arms',
    'Low morning sun at the minister’s gate. A magistrate’s men lean on spades beside a fresh hole; a whetstone and charcoal lie black on the dug earth in the sharp foreground. Old Hogong, gourd at his waist, points at Talhae in trembling outrage; Talhae stands with arms folded, deadpan. Long raking shadows across the yard.',
    people=['hogong', 'talhae'], canon={'year': -10}, tone='#3a6a8a')

# Alji
AL = 'Alji'
add(AL, 'alji-sirim-box', 'a small box of gold hanging from a branch', 'Dawn in Sirim wood: a small golden box hangs from a branch in the first shaft of light, a white rooster crowing beneath; Hogong stops with his useless lantern',
    'Dawn mist in the Sirim wood, tall dark trunks. A small golden box hangs from a low branch, catching the first low shaft of light; a white rooster beneath it crows at nothing. Old Hogong stops in his tracks on the path, holding a lantern he no longer needs. ONE device: the single shaft through the trees landing on the box.',
    people=['hogong'], canon={'year': 65}, tone='#c9a227')
add(AL, 'alji-box-open', 'I came in a box too', 'The old king Talhae crouches over the opened golden box, grinning; the small boy inside looks back at him as if the king were the strange one',
    'Inside the palace hall at morning, a shaft through a lattice. King Talhae, now old with a short grey beard, crouches on the floor beside the opened golden box, grinning down. Inside, a small boy in white silk sits upright, solemn and wide awake, looking back at him as if the king were the one who had turned up in a box. Courtiers blur in the dark background.',
    people=['talhae', 'alji'], canon={'year': 65}, tone='#c9a227')
add(AL, 'alji-steam', 'the steam says the same word every time it leaves the water', 'Under the hill: the empty steam cavern, one plume rising off black water into a crack of light',
    'Under a hill beyond the city: an empty steam cavern at night, black still water in a stone bowl, a single plume of steam lifting off the surface into one thin shaft falling through a crack above. A few drifting motes in the steam: one ember-orange, one cyan, one leaf-green. No figures. ONE device: the vertical plume in the shaft. 85% of the frame black wet stone.',
    canon={'with': ['place:steam_cavern']}, tone='#c9a227')

# Seohyun
SE = 'Seohyun'
add(SE, 'seohyun-third-pass', 'You’ve ridden past this gate three times today.', 'Long-shadow afternoon: Seohyeon rides past the great gate for the third time, looking sideways; Manmyung waits in its shadow, arms folded, hiding a smile',
    'Late afternoon in a Surabol street, long low shadows. Seohyeon on horseback passes a grand timber gate with iron bosses for the third time, looking sideways, the horse plodding. Manmyung stands in the gate’s shadow, arms folded, one eyebrow raised, hiding a smile. Low sun rakes along the street between them. ONE device: the gate’s dark doorway framing her.',
    people=['seohyeon', 'manmyung'], canon={'year': 593}, tone='#8B5CF6')
add(SE, 'seohyun-crawl', 'goes out through a gap in the wall so low that she has to crawl', 'Storm night: lightning strikes the guarded door; in the foreground Manmyung crawls through a low gap in the wall in her soaked good silk',
    'Night storm. In the background a lightning bolt strikes the door of a guarded house in a white flash, guards ducking. In the sharp foreground Manmyung crawls on hands and knees through a low gap at the base of an earth-and-stone wall, her good silk soaked and muddy, face set and determined, rain streaking. The lightning flash is the key, raking across her and the wet stones.',
    people=['manmyung'], canon={'year': 594}, tone='#8B5CF6')
add(SE, 'seohyun-ride-north', 'Tonight it knows exactly where it’s going.', 'In the rain, Manmyung up behind Seohyeon on one horse, riding north out of Surabol; she laughs into his back',
    'Low tracking shot on a muddy road out of Surabol at night in thinning rain. Seohyeon rides with Manmyung up behind him on one horse, her arms around his waist, her muddy silk trailing, laughing into his back; he looks ahead with a small fixed smile. One break in the storm clouds ahead lights the road. Behind them the city’s gate lanterns dissolve into bokeh.',
    people=['seohyeon', 'manmyung'], canon={'year': 594, 'mounted': True}, tone='#8B5CF6')
add(SE, 'seohyun-fall', 'his sword still somehow in his hand', 'Seohyeon stands up coughing in the steaming black pool, sword still in his hand; three young women watch from the far rock',
    'Magical cavern atmosphere, steam and motes, anime-painterly cavern spirit, not photoreal, no body halo. Seohyeon stands up coughing waist-deep in black steaming water, soaked to the skin in his travel clothes, sword still in hand, blinking. On the far wet rock three young women in white jeogori and character-colour chima watch him: Golhwa leaning forward, legs apart, grinning; Hyullé with knees pressed together looking aside; Narim upright and composed. A shaft from the hole he fell through is the key, lighting him; ember, cyan and leaf motes drift in the steam.',
    people=['seohyeon', 'golhwa', 'hyulle', 'narim'], canon={'year': 595, 'sword': True, 'with': ['place:steam_cavern']}, tone='#8B5CF6')
add(SE, 'seohyun-oracle', 'Their eyes go solid', 'The pronouncement: three faces in the steam, every eye solid green, cyan and ember, and Seohyeon small and still in the water below',
    'Oracle pronouncement. Low worm’s-eye from the water line: the three sisters loom on the rock above, their ENTIRE eyes solid glowing colour — Narim #3d9e52, Hyullé #2eb8c4, Golhwa #e86820 — the whole eye, eyes only, no body aura. Their faces are serious now. Seohyeon small and still in the steaming water in the lower foreground, back to us. Steam and motes; 80% of the frame dark wet stone.',
    people=['narim', 'hyulle', 'golhwa', 'seohyeon'], canon={'year': 595, 'with': ['place:steam_cavern']}, tone='#8B5CF6')
add(SE, 'seohyun-warm-stone', 'You’re smiling like a man who found three.', 'Lamplight at Manno: Manmyung sits up with the baby and squints at Seohyeon, who is smiling too much, the warm grey stone in his sleeve',
    'Night in a small governor’s house at Manno. Manmyung sits up on the floor quilt with the baby asleep on her arm, squinting at Seohyeon with suspicion and amusement; he kneels just inside the door, smiling too much, one hand on a warm grey river stone half-hidden in his sleeve. One oil lamp on the floor between them is the key; their shadows climb the screen wall.',
    people=['manmyung', 'seohyeon'], canon={'year': 595}, tone='#8B5CF6')

seen = set()
for i in items:
    assert i['id'] not in seen, i['id']
    seen.add(i['id'])
json.dump(items, open(OUT, 'w'), ensure_ascii=False, indent=1)
print(len(items), 'items ->', OUT)
