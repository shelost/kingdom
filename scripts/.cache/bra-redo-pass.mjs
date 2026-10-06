// BRA roll call redo: each intro in its own world as a painted hero print, plus Ginyu-style group poses centred on Pung.
// Adds the "twice more before supper" beat, then writes scripts/.cache/manifest-bra-redo.json.
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const MANIFEST = 'scripts/.cache/manifest-bra-redo.json';
const ENTRY = 'King Pungjang';

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const en = story.flatMap((ch) => ch.entries ?? []).find((e) => e.title === ENTRY);
if (!en) throw new Error(`missing entry ${ENTRY}`);

const encore = {
	kind: 'p',
	html: 'They try it twice more before supper. For the second, Boksin puts the king on a rock in the middle so that everyone is at least pointing at the same man, and Abe lifts Sangji off the ground to make the shape symmetrical, which nobody asked for and Sangji does not forgive. For the third, Dochim declines to stand, Sangya sits down on the rice, and the king, finally, gets the arms right, a beat after everyone else has stopped.',
	ko: '저녁 전까지 두 번 더 해 본다. 두 번째에는 복신이 왕을 한가운데 바위 위에 올려 세운다. 적어도 모두가 같은 사람을 가리키게 하려고. 아베는 모양을 맞추겠다며 상지를 땅에서 번쩍 들어 올린다. 아무도 부탁하지 않았고, 상지는 용서하지 않는다. 세 번째에는 도침이 일어서기를 사양하고, 상여는 쌀가마 위에 주저앉고, 왕은 마침내 팔 동작을 제대로 해낸다. 다들 멈추고 한 박자 뒤에.'
};
if (!en.blocks.some((b) => b.html === encore.html)) {
	const i = en.blocks.findIndex((b) => b.kind === 'p' && b.html?.startsWith('Boksin counts them in.'));
	if (i < 0) throw new Error('missing group-pose block');
	en.blocks.splice(i + 1, 0, encore);
}
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

const FRAME = 'Composed for a 2:1 letterbox crop; nothing important at the top or bottom edge.';
const PRINT = `HEEWON STYLE hero print: a Meiji musha-e warrior print in the manner of Tsukioka Yoshitoshi’s “Mirror of Famous Generals” and Utagawa Kuniyoshi, crossed with Korean minhwa colour and re-painted in the house watercolor-and-oil — bold calligraphic ink contours, flat saturated colour blocks, patterned textures (snow stipple, fur strokes, claw waves, petal and ember scatter), a violent diagonal composition that fills the frame edge to edge, the hero in an extreme dynamic pose; then painted over with granulated watercolour washes, paper grain and oil-glazed darks so it reads as a painting, not a flat print. Faces stay clean webtoon ink line matching the attached portrait. One accent colour per hero. ${FRAME} NO text cartouches, NO title boxes, NO calligraphy, NO seals, NO lettering of any kind.`;

const intro = (id, at, alt, scene, people, canon = {}) => ({ id, entry: ENTRY, at, alt, scene: `${PRINT} ${scene}`, people, canon });

const items = [
	intro(
		'bra-intro-abe',
		'introduces himself to the fortress, the gulls',
		'Abe no Hirafu wrestles a rearing black bear in the snow of the cold north, knife in hand, arrows in its hide',
		'The cold north of Koshi in a blizzard, snow-heavy pines and white crags. Abe no Hirafu locked chest to chest with an enormous rearing black bear that fills two-thirds of the frame: the bear a towering mass of black fur strokes speckled with falling snowflakes, broken arrows standing out of its hide, claws hooked over Abe’s shoulder; Abe braced under it with one arm round its neck and a short straight knife driving up into its chest, wild black hair and beard flying, roaring with laughter; his grey wolf-fur mantle and red cape whipping; a spent bow and a fallen huntsman sprawled in the snow at the bottom corner. Snowflakes scattered over everything as flat white flecks. Accent: the red cape against black fur and white snow.',
		['abe']
	),
	intro(
		'bra-intro-takutsu',
		'bows to the sea he has just crossed',
		'Echi no Takutsu at full draw on a ridge above Asuka, the pagoda of Asuka-dera and the three Yamato hills in the morning mist below',
		'Asuka, Yamato, at dawn: below the ridge the five-storey wooden pagoda and vermilion-pillared grey-tiled halls of Asuka-dera rising out of morning mist, the three soft round Yamato hills beyond, flooded rice paddies like mirrors, a keyhole kofun mound in pine; 7th-century Asuka-period Japan, never Edo, no castles, no torii avenues. Echi no Takutsu on the ridge in a deep low stance at FULL DRAW of a tall Yamato longbow, bowstring at his cheek, aimed west across the frame, the long tails of his white headband streaming, his straight sword in its red-lacquered scabbard at the hip; a golden kite wheeling above the bow tip. Worm’s-eye three-quarter, the bow a great arc across the sky. Calm, sincere, unbending face. Accent: rose-red #b05575 in his robe catching the first sun.',
		['takutsu'],
		{ sword: true }
	),
	intro(
		'bra-intro-dochim',
		'introduces himself sitting down',
		'Dochim whirls his ringed staff before the smiling stone Buddhas and the pagoda of a Baekje temple',
		'A Baekje temple at dusk in the hills of Sabi: behind him a great cliff carved with the Baekje rock-cut Buddha triad, three serene round faces with the famous gentle Baekje smile, moss in the folds; to one side the slender five-storey stone pagoda of Jeongnimsa with its wide thin roof-slabs; incense smoke and falling ginkgo leaves; a row of small gilt-bronze Buddhas on a ledge catching the last light. Dochim in the foreground mid-spin, whirling his gilt ringed monk staff overhead so its rings fly out, red-orange kasaya and ochre robe flaring in a wheel around him, the 108 black beads whipping from his other wrist, and on his face the very same small serene smile as the stone Buddhas behind him. Low dutch angle. Accent: the red-orange kasaya against grey stone.',
		['dochim'],
		{ hat: false }
	),
	intro(
		'bra-intro-sangji',
		'is seven feet tall',
		'Heukchi Sangji climbs the ramparts of Imjon as a river of thirty thousand torches pours up the mountain behind him',
		'Imjon Fortress at night: a mountain fortress of piled grey stone snaking along a ridge, and behind it a river of thirty thousand torches pouring up the dark mountainside in a winding line of orange dots, banners of Baekje yellow among them. Heukchi Sangji, seven feet tall, in the foreground striding up the stone steps of the rampart toward the lens, worm’s-eye, his tall red plume and dark cape whipping back, the long gilt-headed spear carried in one fist like a walking staff, a ring-pommel sword sheathed at his hip; unsmiling, not posing, simply arriving, the whole torch river at his back. Accent: maroon robe and the gold spearhead lit by the torches.',
		['sangji']
	),
	intro(
		'bra-intro-sangya',
		'does not look up from the ledger',
		'Satek Sangya stands on a mountain of rice bales in the Satek harbour, flinging tally slips into the air while coins arc around him',
		'The Satek harbour on the Baekje coast at sunset: tall-masted Baekje cargo ships moored at a timber wharf, warehouses with giwa roofs, stacked rice bales, coiled rope and bundled arrows. Satek Sangya in the tall pointed openwork gilt-bronze noble cap standing on top of a mountain of straw rice bales, one foot up on the highest bale, flinging a fan of bamboo tally slips into the air with one hand like a gambler throwing cards, a string of square-holed bronze coins swinging in an arc from the other, his eyes still down on the long ledger tucked under his arm; gulls wheeling. Low dutch angle from the wharf. Accent: the gilt cap and the bronze coins catching the sunset.',
		['sateksangya']
	),
	intro(
		'bra-intro-boksin',
		'does the arms exactly as rehearsed',
		'Gwishil Boksin swings the great restoration banner on its red shaft from the wall of Juryu at dawn',
		'Juryu Fortress at dawn, the rough grey stone wall on its pine ridge above the western sea. Gwishil Boksin on top of the wall swinging the great restoration banner on its long red-lacquered shaft in a huge arc, the long warm-yellow silk banner unfurling across the whole sky behind him like a wave, the long topknot tail whipping from his bald head, scowl split into a ferocious grin, one foot up on the battlement; below him, tiny, the tally board propped against the wall and a crowd of ragged volunteers looking up. Extreme worm’s-eye. Accent: the yellow silk and the red shaft against a slate dawn sky.',
		['boksin']
	),
	intro(
		'bra-intro-pung',
		'and he ad-libs',
		'Pung at the prow of a Yamato ship arriving off the Baekje coast, one hand holding his new crown on against the wind',
		'At sea off the Baekje coast: the high curved prow of a Yamato war-ship plunging through Hokusai claw-crested waves, the Yamato fleet behind with white-and-red pennants, ahead the dark pine-ridged coast and the grey walls of Juryu. King Pungjang standing on the prow, half heroic and half seasick, one hand clamping his new Baekje crown to his head against the wind, the other flung out toward the coast in a grand gesture he is not sure of, red king’s robe and gold cord sash streaming, eyes darting sideways for approval. Low dutch angle from the deck. Accent: gold light on the twin flame ornaments of the crown.',
		['pung']
	),
	{
		id: 'bra-roll-call',
		entry: ENTRY,
		at: 'Takutsu and the admiral land it perfectly',
		alt: 'The first group pose: the Baekje Restoration Army strikes a formation around King Pungjang on the shingle, half of them getting it wrong',
		scene: `${PRINT} The shingle below Juryu at sunset, the sea behind, the fortress on its ridge. A Ginyu-style team pose in a symmetrical fan around the centre: King Pungjang dead centre, one beat late, arms going the wrong way; flanking him in mirror-image hero poses the huge bearded admiral in wolf-fur and red cape (left) and the slim young Yamato captain with white headband tails (right), both perfect; behind Pung the bald general with the long topknot tail sweeping a red-shafted yellow banner over everyone; at the far left the shaven monk in a red kasaya sitting cross-legged and doing only the hands; at the far right the stocky lord in the tall pointed gilt cap still counting a ledger; at the back the seven-foot general in black lamellar and red plume with arms folded, refusing. Low wide, the figures spread across the frame like a stage. Radial ink rays burst from the sun behind Pung. Topknots, no brimmed hats.`,
		people: ['pung'],
		canon: { with: ['dress:baekje'] }
	},
	{
		id: 'bra-pose-pyramid',
		entry: ENTRY,
		at: 'puts the king on a rock in the middle',
		alt: 'The second pose: Pung on a rock in the middle, everyone pointing at him, Abe hoisting a furious Sangji off the ground for symmetry',
		scene: `${PRINT} The same shingle below Juryu, storm clouds breaking. A towering pyramid formation: King Pungjang at the apex standing on a black sea-rock in the middle, arms raised in a V, crown on, beaming and unsure; every other member pointing at him from below. On the left the huge bearded admiral in wolf-fur and red cape has hoisted the seven-foot general in black lamellar and red plume clean off the ground onto his shoulders to match the height on the right, and the general, arms still folded, is glaring murder; on the right the young Yamato captain with white headband tails stands on a beached boat in a perfect mirrored pose; kneeling at the front the bald general with the long topknot tail presenting the king with both arms like a showman; the shaven monk in red kasaya sits on a rock at the foot, smiling, doing a mudra; the stocky lord in the tall pointed gilt cap points at the king with a ledger. Worm’s-eye from the pebbles. Radial ink rays. Topknots, no brimmed hats.`,
		people: ['pung'],
		canon: { with: ['dress:baekje'] }
	},
	{
		id: 'bra-pose-late',
		entry: ENTRY,
		at: 'the king, finally, gets the arms right',
		alt: 'The third pose: Pung alone finally nails it while the others sit around on the rice and the rocks',
		scene: `${PRINT} The shingle below Juryu in the last red light. King Pungjang alone in the centre of the frame in a perfect, heroic, full-body pose at last, arms and legs flung out like a hero print, robe flaring, crown gleaming, triumphant; around him the others have already stopped and sit about: the stocky lord in the gilt cap sitting on a pile of rice bales eating, the shaven monk in red kasaya cross-legged with beads, the seven-foot general leaning on his spear looking away, the huge bearded admiral lying back laughing, the young Yamato captain alone politely applauding, the bald general with the topknot tail facepalming with the tally board. Low wide. Radial ink rays converging on the king. Comic and a little sad. Topknots, no brimmed hats.`,
		people: ['pung'],
		canon: { with: ['dress:baekje'] }
	}
];

fs.writeFileSync(MANIFEST, JSON.stringify(items, null, '\t') + '\n');
console.log(`wrote ${items.length} manifest items`);
