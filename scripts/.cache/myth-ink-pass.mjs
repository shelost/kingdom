// Myth ink pass: myth beats → `style: "ink"`; the history around them (Hyukgose's crowning, Gulgul) stays Heewon.
// Usage: node scripts/.cache/myth-ink-pass.mjs → writes scripts/.cache/manifest-myth-ink.json and backs up retaken stills.
import fs from 'node:fs';

const OUT = 'scripts/.cache/manifest-myth-ink.json';
const PREV = 'scripts/.cache/prev-stills/myth-ink';

const ink = (id, entry, at, alt, scene, refs = [], extra = {}) => ({
	id,
	entry,
	at,
	alt,
	scene: `Ink painting of the myth. ${scene}`,
	refs,
	canon: false,
	style: 'ink',
	...extra
});

const items = [
	// Hyukgose — egg and heavenly horse in ink; the crowning by the six chiefs in Heewon style.
	ink('white-horse', 'Hyukgose', 'the horse knelt and cried', 'A white winged horse kneels crying beside Najeong well under a hanging shaft of light', 'Bird’s-eye from the pine crowns over Najeong well: a white winged horse kneels beside a round stone well-mouth in a small clearing, neck bent, crying up at the sky; the horse is left as blinding bare paper inside a ring of splashed black pine forest; one thin column of lightning-mist hangs straight down from the sky onto the well. Six tiny chiefs in wide-sleeved robes crouch at the forest edge. ONE device: the vertical shaft of light dropping into the circular well.'),
	ink('chunma-najeong-kneel', 'Hyukgose', 'like lightning that had forgotten to leave', 'The heavenly horse kneels in the grass under a jagged seam of light', 'Low worm’s-eye from the wet grass: the white heavenly horse, wings folded the way a bird folds them, kneels with its head bowed to the ground, enormous against a black storm sky of splashed ink; its body is bare paper carved out by a few calligraphic strokes; a jagged lightning seam of untouched paper hangs down behind it to the earth. Pines of Mount Yang as black masses at the frame edge. ONE device: the lightning seam.'),
	ink('chunma-rises', 'Hyukgose', 'gave a long neigh, and rose up', 'The heavenly horse leaps into the sky, leaving six chiefs with empty arms', 'Dutch angle, looking up from the wet field: the white heavenly horse leaps straight up into a whirl of black cloud, wings spread in dry-brush flying-white strokes, leaving a vertical streak of bare paper; at the bottom of the frame six tiny chiefs with their arms still out, holding nothing, and the dark round shape of the egg left in the grass where it knelt. ONE device: the vertical streak from the egg to the horse.'),
	ink('hyuk-ink-egg-open', 'Hyukgose', 'The shell opened on a boy', 'The great egg splits and a boy sits up inside it', 'Close: a great egg half-buried in freshly dug black earth splits open; the two curved halves of shell are planes of bare paper divided by one jagged black crack; inside, a small boy sits up, calm and kingly, eyes open, drawn in a few strokes; six pairs of hands in wide sleeves frozen at the frame edges; tiny birds and beasts dancing around the rim of the pit. The only colour is a pale translucent blue wash on the eggshell. ONE device: the black crack splitting the egg.', ['/ch_hyukgose.png']),
	ink('alyoung-chicken-dragon', 'Hyukgose', 'Alyeongjeong', 'A chicken-dragon coils at Alyeongjeong well; a baby girl comes from its rib', 'At the stone mouth of Alyeongjeong well, a gyeryong (chicken-dragon: rooster head and comb, long serpent-dragon body in dry-brush scales) coils around the well-mouth; from its left side a newborn girl emerges into a burst of bare paper light, wrapped in nothing but mist. Worm’s-eye from the well stones. ONE device: the dragon’s coil around the round well.', ['/ch_alyoung.png']),
	{
		id: 'hyukgose-six-chiefs-crown',
		entry: 'Hyukgose',
		after: 'hyukgose-eggshell-arc',
		at: 'crown as king while he is still a boy',
		alt: 'The six chiefs crown the thirteen-year-old Hyukgose on a riverbank mound at dusk',
		scene: 'History, not myth: the six village chiefs of Saro crown the boy king. Low three-quarter worm’s-eye on a packed-earth ritual mound above the Alcheon river at dusk, 57 BC: no palace yet, only thatch, timber and earth. The six chiefs in plain wide-sleeved robes and black jougwan stand in a half-ring; the eldest, white-bearded, raises the gold crown in both hands over a THIRTEEN-YEAR-OLD boy, Hyukgose, kneeling on a straw mat with his head up and unafraid (his face is a boy’s version of the attached portrait). A brazier just outside the frame at lower right rakes firelight up across the boy’s face, the chiefs’ sleeves and the raised gold; behind them the river and the six villages’ thatched roofs dissolve into blue dusk haze, small lamps as bokeh. ONE device: the half-ring of chiefs converging on the raised crown.',
		refs: ['/ch_hyukgose.png', '/ref_crown_silla.jpg', '/ref_hanbok_silla.png', '/hat_jougwan_types.png'],
		people: ['hyukgose'],
		canon: false
	},

	// Talhae
	ink('talhae-chest-tide', 'Talhae', 'a chest comes in on the tide at', 'A chest rides the tide into Ajinpo under a crying magpie', 'A heavy timber chest rides a towering ink swell into the cove at Ajinpo, the sea splashed black with claw-shaped crests of bare paper; a black magpie wheels and cries above it; the shore is a dry-brush strip with one tiny old woman holding a rope. ONE device: the long diagonal of the wave carrying the chest.'),
	ink('talhae-ink-dapana-egg', 'Talhae', 'was delivered of an egg', 'The queen of Dapana lays her egg in a chest at the night shore', 'Night shore of Dapana: a queen in layered robes kneels at the waterline, forehead pressed to a huge silk-wrapped egg lying inside an open chest among a few treasures; the chest lid is a black diagonal; the night sea is one solid mass of black ink and the moon a bare paper circle; far up the beach the king is a small black back walking away. ONE device: the open lid’s diagonal.'),
	ink('talhae-ink-hawk-falcon', 'Talhae', 'Talhae becomes a hawk, and Suro becomes an eagle', 'Hawk and eagle, sparrow and falcon spiral under the Gaya hall roof', 'Worm’s-eye up into the timber roof of the Golden Gaya hall: four raptors in mid-transformation spiral up under the black beams, a hawk pursued by an eagle and a sparrow pursued by a falcon, all in explosive flying-white brush, feathers bursting as ink spatter; on the floor at the bottom edge two empty robes collapse where two men stood. ONE device: the vortex of birds.'),

	// Alji — the gold box in the wood is myth; opening it at court stays Heewon.
	ink('alji-sirim-box', 'Alji', 'a small box of gold hanging from a branch', 'A small gold box hangs from a pine branch in Sirim; a white rooster crows beneath', 'Sirim wood at first light: one bent black pine branch crosses the frame; from it hangs a small box on a cord, the only colour a translucent gold wash; beneath it a white rooster on the roots crows upward, left as bare paper; far off at the wood’s edge a tiny Hogong with a lantern. Mist as untouched paper. ONE device: the hanging cord from branch to box.'),
	ink('alji-ink-night-rooster', 'Alji', 'a rooster crowing in the woods west of the city', 'At night a band of cloud hangs into Sirim wood and a rooster crows', 'Night over Sirim: a long band of cloud hangs straight down out of a black ink sky into the wood like a lowered scroll; at its foot, among black trunks, the small silhouette of a rooster crowing; the city’s roofs tiny and black in the far distance with one lit window. ONE device: the vertical cloud band.'),

	// Tamla myths (told to Gyebek; the frames stay Heewon).
	ink('great-lady-apron', 'Sulmun', 'She scoops the seabed up in her apron', 'The giantess Sulmun scoops the seabed into her apron', 'Worm’s-eye from the waterline: Seolmundae Halmang, a giantess so vast the sea reaches only her knee, bends to scoop the black seabed into her apron; mud and water stream from its hem as ink spatter; her loose hair whips in wild dry-brush; a tiny fishing boat at her ankle for scale. ONE device: the curved apron heavy with earth.', ['/ch_sulmun.png']),
	ink('seolmundae-cauldron', 'Sulmun', 'cauldron of porridge', 'A giant cauldron of porridge steams; a great sleeve slides into it', 'Bird’s-eye straight down into a colossal iron cauldron over a fire, the porridge a black whirl; a giant woman’s sleeve and hand slide down into it; steam rises as huge clouds of bare paper; around the rim tiny boys carry firewood, not yet looking. ONE device: the black circle of the cauldron.'),
	ink('youngest-sea-rock', 'Sulmun', 'The youngest walked into the sea', 'The youngest son stands in the sea as a lone rock; his brothers stand as stones on the mountain', 'One tall black sea stack stands alone in a white sea off the shore, a boy’s shape half-merged into the rock, facing away; behind, on the misty slope of Halla, hundreds of standing stones like weeping figures fade into bare paper. ONE device: the lone vertical rock against the horizon line.'),
	ink('seolmundae-ninety-nine', 'Sulmun', 'They found ninety-nine', 'Ninety-nine rolls of silk and a causeway that stops in open water', 'Sulmun sits on the shoulder of Halla, enormous, with an unfinished collar; at her feet ninety-nine rolls of white silk are stacked on the shore with one gap; from the beach a causeway of stones runs out into the black sea and stops short in open water. Bird’s-eye. ONE device: the broken causeway line ending in water.', ['/ch_sulmun.png']),
	ink('tp-ink-arrows', 'Three Princes', 'They each shoot an arrow', 'Three princes shoot three arrows to divide the island', 'Bird’s-eye over Tamla: three divine princes on a rise, each at full draw facing a different direction; three long arrows streak out as flying-white lines that divide the island into three; Mount Halla a black ink cone; the three holes of Samseonghyeol small in the ground below them. ONE device: the three diverging arrow lines.'),
	ink('east-sea-box', 'Three Princes', 'a box drifts from the East Sea', 'A box drifts in from the East Sea with three princesses inside', 'A sealed wooden box rides black swells toward the shore, its lid lifting; three princesses in layered silk rise from it with a messenger, a calf and a foal at their feet and sacks of the five grains; the box is a bare-paper square on the black sea. ONE device: the box against the horizon.'),
	ink('iron-chest-cast', 'Three Princes', 'put the boy in an iron chest', 'The hunting god and farming goddess push a locked iron chest into the sea', 'Night shore: the hunting god and the farming goddess push a black padlocked iron chest into the surf, their backs to the lens; a small fist pounds on the lid from inside; the sea is one black mass under a bare paper moon. ONE device: the chest’s square silhouette against the horizon line.', ['/ch_socheonguk.png', '/ch_baekjuto.png']),
	ink('ox-iron-chest-journey', 'Three Princes', 'It drifted for years', 'The iron chest bursts open on a foreign shore and a warrior steps out', 'On a foreign beach the iron chest lies burst open, barnacled from years at sea; a grown young warrior strides out of it with a spear, sea birds lifting around him; behind, an empty ink sea to the horizon. Low angle from the sand. ONE device: the burst lid’s diagonal.'),
	ink('sl-ink-serpent', 'Stone Lady', 'the serpent in the cave at Gimnyeong', 'A colossal serpent coils in the Gimnyeong cave as a young magistrate walks in', 'From deep inside the Gimnyeong lava cave looking out: a colossal serpent coiled in the black, its scales in dry-brush; a young magistrate with a drawn sword is a tiny silhouette in the bare paper daylight of the cave mouth; a girl in white bound at a stone altar between them. ONE device: the cave-mouth arch.'),
	ink('sanbangdeok-cliff', 'Stone Lady', 'She walks back into the cliff', 'Sanbangdeok walks back into the cliff of Sanbangsan', 'The sheer cliff of Sanbangsan is a wall of black ink filling the frame; a woman in white walks into the rock, half her body already stone, her trailing sleeve still silk; a spring trickles from the cliff foot as a thin bare-paper line; her husband lies small on the path below. ONE device: the cliff wall.', ['/ch_sanbangdeok.png']),
	ink('navel-string-life', 'Stone Lady', 'she found gold', 'Gameunjang finds gold in the spoil her husband threw away', 'A black hillside: three brothers dig yams, small; the youngest’s wife kneels at the spoil heap and lifts a stone that is gold, the only colour a translucent gold wash; the spoil heap runs down the frame as one diagonal. ONE device: the spoil-heap diagonal.', ['/ch_gameunjang.png']),
	ink('beggars-feast', 'Stone Lady', 'held a beggars', 'Gameunjang serves two blind beggars at her feast and their eyes open', 'A long courtyard of feast tables receding into mist; at the near end Gameunjang kneels to serve two old blind beggars, her parents; their eyes open as two points of bare paper in black ink faces. ONE device: the long table line receding.', ['/ch_gameunjang.png']),
	ink('gd-ink-flower-field', 'Gardener', 'found the flower field at the far end of the west', 'Hallakgungi follows his father down the rows of the western flower field', 'Where the living maps run out: rows of flowers run to the horizon in a vanishing point; a boy (Hallakgungi) walks down them behind his father Sara Doryeong; a gate at the near edge; the flowers in quick ink dabs, one row with a pale pink wash, the only colour. ONE device: the rows converging to the vanishing point.', ['/ch_saradoryeong.png']),
	ink('gd-ink-mother-bones', 'Gardener', 'found his mother’s bones', 'In a bamboo grove the boy lays flowers on his mother’s bones in order', 'A black bamboo grove: the boy kneels over a skeleton laid out on the ground and places five flowers on it in order, bone, flesh, blood, breath, soul; the bamboo stems are hard black verticals, the body a horizontal of bare paper. ONE device: verticals of bamboo against the one horizontal.'),
	ink('jacheongbi-bones', 'Gardener', 'bone by bone', 'Jacheongbi puts Mun Doryeong back together bone by bone', 'Jacheongbi kneels beside Mun Doryeong laid on bare paper ground, his body half bones and half flesh as she lays the flowers on him in order; a bundle of the five grains at her side; her short-cut hair in dry-brush. Bird’s-eye. ONE device: his body as the one horizontal.', ['/ch_jacheongbi.png', '/ch_mundoryeong.png']),
	ink('kr-ink-three-flowers', 'Kangrim', 'Three flowers on the water', 'Three flowers float on a dark pond above three drowned brothers', 'Three white flowers float in a line on black still water; beneath them the faint shapes of three drowned brothers in silk; at the bank a woman’s sleeve reaches down to pick them. ONE device: the three flowers in a line.'),
	ink('kr-ink-pond-bones', 'Kangrim', 'The pond dried. The bones came up.', 'Yumla stands on the dried pond as three skeletons rise', 'Worm’s-eye from the cracked bed of a dried pond: Yumla, king of the underworld, stands as a vast black mass of robes; three skeletons rise out of the mud before him; the magistrate’s men tiny on the bank. ONE device: the cracks radiating from his feet.', ['/ch_yumla.png']),

	// Other founding myths.
	ink('suro-ink-turtle-song', 'Suro', 'Turtle, turtle', 'A purple rope lowers a gold box onto Gujibong as the people sing', 'Gujibong peak: a ring of tiny villagers on the summit sing and dance; from a black sky a single rope hangs down to the ground with a wrapped box at its end; the only colour is a faint purple wash on the rope; the box is bare paper. ONE device: the vertical rope from heaven to the ring.'),
	ink('bear-tiger-cave', 'Dangun & Old Joseon', 'A bear and a tiger come to him', 'A bear and a tiger crouch in the cave with mugwort and garlic', 'Inside a cave: a bear and a tiger crouch in darkness with a bundle of mugwort and a pile of garlic between them; a single shaft of daylight from the cave mouth stops just short of them; the tiger’s head turns to the light, restless; the bear sits still. ONE device: the light shaft that does not reach them.'),
	ink('buyeo-ink-turtle-bridge', 'Buyeo', 'The river answers.', 'Fish and turtles rise to make a bridge for Jumong', 'Bird’s-eye over a wide black river: fish and turtles rise to form a curving bridge of shells; Jumong, clean-shaven, gallops across with three companions; on the far bank the pursuers’ horses rear at the water. ONE device: the curve of shells across the river.', ['/ch_jumong.png']),
	ink('haemosu-ink-five-dragons', 'Haemosu', 'five dragons in the yoke', 'Five dragons pull Haemosu’s chariot across the noon sky', 'Five dragons in one yoke pull a small chariot in a great arc across the sky; Haemosu stands in it, laughing; the dragons are huge black coils with flying-white whiskers; the Amnok river is a thin pale line far below. ONE device: the dragon arc across the sky.', ['/ch_haemosu.png']),

	// Commander Yeon — the Gulgul doorway (history; Heewon style).
	{
		id: 'cy-gulgul-stick',
		entry: 'Commander Yeon',
		after: 'nameless-boy',
		at: 'walks up until the stick touches his chest',
		alt: 'A Mohe boy holds a stick against Yeon Gesomun’s chest in a burnt doorway',
		scene: 'Worm’s-eye from beside a burnt doorway in a Mohe village at dusk in falling snow: a small Mohe boy with a shaved crown and two braids holds a stick against the breastplate of Yeon Gesomun, huge in red-edged armor and red cape, who has just dismounted; his red-bay horse Damul stands behind him. The stick touching his chest is the device, one short line between them. Ash and snow, a roofless charred timber frame, embers glowing under the snow at the lower right as the key light raking up across the boy’s face and the steel. No jougwan; Yeon wears no helmet.',
		people: ['gesomun', 'gulgul'],
		canon: { mounted: true, hat: false, with: ['place:yeon_east'] }
	},
	{
		id: 'cy-gulgul-wall',
		entry: 'Commander Yeon',
		at: 'the river frozen white below',
		alt: 'Yeon Gesomun on the north wall of Pyongyang, the grown Gulgul a step behind him',
		scene: 'Night, deep winter, the north wall of Pyongyang: over-the-shoulder from just behind the grown Gulgul, who stands one step behind Yeon Gesomun at the parapet; both in fur mantles over armor, breath steaming; below, the Taedong river frozen white runs as a long pale diagonal. One brazier on the wall walk is the key, lighting Yeon’s profile and beard. ONE device: the frozen river’s diagonal. Gulgul is a grown man here (thin moustache, short chin beard, weathered).',
		refs: ['/ch_yeon_gesomun.png', '/ch_dae_gulgul.png', '/pl_pyongyang_fortress.png', '/ref_hanbok_goguryeo.png'],
		people: ['gesomun', 'gulgul'],
		canon: false
	}
];

fs.mkdirSync(PREV, { recursive: true });
for (const it of items) {
	const src = `static/temp/${it.id}.jpg`;
	if (fs.existsSync(src) && !fs.existsSync(`${PREV}/${it.id}.jpg`)) fs.copyFileSync(src, `${PREV}/${it.id}.jpg`);
}
fs.writeFileSync(OUT, JSON.stringify(items, null, '\t') + '\n');
console.log(`${items.length} items → ${OUT}`);
