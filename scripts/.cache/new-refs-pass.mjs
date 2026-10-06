// Stills for the new portraits: Yunchung (Yunchung, Siege of Daeya), King Euija, Chunchu's envoy look, Lady Yeon, Sumyung Jangja.
// Adds their visual canon, then writes scripts/.cache/manifest-new-refs.json for add-image-slots.mjs → GenerateImage → install-temp-art.mjs.
import fs from 'node:fs';

const CANON = 'src/lib/data/visual-canon.json';
const MANIFEST = 'scripts/.cache/manifest-new-refs.json';

const raw = fs.readFileSync(CANON, 'utf8');
const canon = JSON.parse(raw);
Object.assign(canon.characters, {
	yunchung: {
		look: 'Hard-bitten Baekje frontier general in his forties: full black beard, heavy scowling brows, a band of red war-paint smeared across both eyes, long black hair falling from under a dented round steel helm with a cracked crown and a short red-black plume knob.',
		dress: 'Grey steel lamellar with red-edged shoulder guards over an ochre-yellow robe, a broad red sash with a round bronze boss, red-and-black striped bracers; a ring-pommel sword in a red-lacquered scabbard.',
		demeanor: 'Plain speech is also a weapon: says the ugly thing without a cushion under it, and does exactly what he says he will.',
		armor: 'baekje',
		hat: false
	},
	yeonwife: {
		look: 'Composed Goguryeo noblewoman in her thirties: black hair braided and coiled up with a cluster of red silk flowers at the crown, loose strands at the cheeks, calm narrow eyes, small red mouth.',
		dress: 'Wide-sleeved cream-buff robe with rust-red crossed collar and sleeve bands, a rust-red shawl over the arms, a long black sash.',
		demeanor: 'Quiet and precise; saves the hard questions for when the lamps are low.'
	},
	sumyeongjangja: {
		look: 'Smug old rich man: long loose black hair, a long grey-green beard, half-lidded blank contemptuous eyes, a sour turned-down mouth.',
		dress: 'Wide-sleeved white robe with an olive-gold collar band, a gold cord sash with a hanging tassel, a dark red under-sleeve.',
		demeanor: 'Rich the way a flood is wet; counts his storehouses the way other men pray.',
		hat: false
	}
});
fs.writeFileSync(CANON, JSON.stringify(canon, null, '\t') + (raw.endsWith('\n') ? '\n' : ''));

const FRAME = 'Composed for a 2:1 letterbox crop; nothing important at the top or bottom edge.';
const STILL = `HEEWON STYLE. Minimal iconic 2:1 movie still. ${FRAME}`;
const NIGHT = `HEEWON STYLE. Minimal iconic 2:1 movie still, interior at night = old-master tenebrist canvas. ${FRAME}`;
const SABI = 'The king’s winter chamber in the Sabi palace: dark timber pillars, plank floor, a low lacquered table, one bronze brazier.';
const DAEYA = `HEEWON STYLE battle frame. ${FRAME} The siege of Daeya Fortress, autumn 642: the real stone seongmun of the attached Daeya board — weathered grey block walls, crenellations, a curved giwa gate pavilion, heavy iron-bossed timber doors — above a valley road. Baekje banners yellow, Silla banners blue, their marks illegible brush strokes.`;

const items = [
	{
		id: 'yunchung-good-cushion',
		entry: 'Yunchung',
		at: 'No, the good cushion',
		alt: 'King Euija shoves the good cushion across the floor to General Yunchung, who has not yet decided to sit',
		scene: `${NIGHT} ${SABI} Low two-shot across the floor, worm’s-eye from beside the brazier set on the planks: King Euija leaning forward on one knee with a grin, shoving a thick embroidered silk cushion across the boards with one hand; General Yunchung standing stiff in his lamellar on the other side of the frame, helm tucked under one arm, looking down at the cushion as if it were a trap. The brazier between them is the one warm key, raking up across the king’s crimson silk and the grey plates; their shadows climb the pillars at an angle. Device: the cushion sliding across the empty floor between them.`,
		people: ['euija', 'yunchung'],
		canon: { with: ['place:sabi'] }
	},
	{
		id: 'yunchung-off-paper',
		entry: 'Yunchung',
		at: 'Off paper, the Rock does',
		alt: 'Close on Yunchung by the brazier as he tells the king who really rules Baekje',
		scene: `${NIGHT} ${SABI} Medium close, low three-quarter: General Yunchung seated on the good cushion at last, forearms on his knees, helm on the floor beside him, the red war-paint across his eyes catching the brazier light from below; flat, unblinking, saying the ugly thing plainly. In the soft dark foreground the blurred crimson shoulder and gold headband tail of the king. Bokeh of a far lamp. Device: the brazier glow cutting his face in half, the other half in umber shadow.`,
		people: ['yunchung', 'euija'],
		canon: { with: ['place:sabi'] }
	},
	{
		id: 'yunchung-daeya-autumn',
		entry: 'Yunchung',
		at: 'Daeya by autumn, Majesty.',
		alt: 'Yunchung walks out down the long hall while King Euija laughs on the dais behind him',
		scene: `${NIGHT} The Ministers’ Assembly hall in Sabi at dusk: a long dark timber hall with a red-lacquered pillar colonnade, a raised dais at the far end, one row of standing lamps. Low wide down the hall axis from the floor near the doors: General Yunchung in the near midground mid-stride toward the lens, helm on, hand on the scabbard at his hip, face set; far behind him on the dais King Euija throws his head back laughing, small and crimson in the lamp pool; the eight clan ministers as dark seated silhouettes along both sides. Device: the hall axis, the general walking out of it.`,
		people: ['yunchung', 'euija'],
		canon: { sword: true, with: ['place:sabi'] }
	},
	{
		id: 'yunchung-bright-sun',
		entry: 'Siege of Daeya',
		at: 'I swear it on that bright sun.',
		alt: 'Below the walls of Daeya, Yunchung raises his hand to the sun and swears; Pumsuk listens from the gate',
		style: 'battle',
		scene: `${DAEYA} Worm’s-eye from the trampled road below the gate: General Yunchung in the foreground on foot, helm on, one arm raised straight up at the pale sun breaking through smoke, his other hand on the hilt of his sheathed sword, the red war-paint across his eyes; behind him a thin line of Baekje yellow banners and spears in haze. High on the gate pavilion, tiny, the young Silla commander leaning over the parapet to listen. Device: the raised arm and the sun in one vertical line, the wall as a dark band across the frame.`,
		people: ['yunchung'],
		canon: { battle: true }
	},
	{
		id: 'yunchung-gate-ride',
		entry: 'Siege of Daeya',
		at: 'The approach road fills',
		alt: 'Yunchung rides through the opened gate of Daeya at the head of the Baekje column, the granary burning inside',
		style: 'battle',
		scene: `${DAEYA} Night. Low from inside the gate passage: the heavy timber leaf swung open, General Yunchung riding through the hongye arch straight at the lens on a dark horse, helm on, sword drawn low in one hand, the red war-paint across his eyes; behind him the approach road filling with a river of Baekje spearmen under yellow banners. To one side inside the walls the granary roof is already burning, its flat vermilion ribbon flames and orange-lit smoke rolling over the wall. Device: the dark arch framing the rider.`,
		people: ['yunchung'],
		canon: { battle: true, mounted: true }
	},
	{
		id: 'chunchu-envoy-stair',
		entry: 'Chunchu & Yeon',
		at: 'keeps him waiting on the stair',
		alt: 'Kim Chunchu, in envoy white, waits alone on the long stair below the red gate of Pyongyang',
		scene: `${STILL} Pyongyang, autumn 642: the red two-tier gate-tower and long stone stair of the attached Pyongyang board under a cold grey sky. Bird’s-eye from high on the gate: Kim Chunchu alone and small halfway up the vast empty stone stair in his white envoy robe with magenta bands, standing perfectly composed with his hands folded in his sleeves, looking up at the closed doors; his long shadow running down the steps; two Goguryeo spear-guards as tiny dark figures at the top. Device: the stair as a huge diagonal of grey steps with one white figure on it. Accent: magenta catching the one break of low sun.`,
		people: ['chunchu:ambassador'],
		canon: { with: ['place:pyongyang'] }
	},
	{
		id: 'chunchu-no-pride',
		entry: 'Chunchu & Yeon',
		at: 'I know no such thing as pride.',
		alt: 'Before the Supreme Commander, Chunchu smiles and says he knows no such thing as pride',
		scene: `${NIGHT} The Goguryeo audience hall in Pyongyang: dark red pillars, a plank floor, one row of tall bronze lamps. Over-the-shoulder from behind Yeon Gesomun looming huge and dark in the foreground (red cord topknot, red cape, a massive shoulder), down at Kim Chunchu who stands below him in his white envoy robe with magenta bands, chin up, a small amused smile, hands folded in his sleeves, unafraid. One lamp close beside Chunchu rakes his face and the white silk; Gesomun’s cast shadow falls across the floor and up Chunchu’s robe. Device: the shadow of the big man laid over the small white one.`,
		people: ['gesomun', 'chunchu:ambassador'],
		canon: { with: ['place:pyongyang'] }
	},
	{
		id: 'yeon-wife-promise',
		entry: 'Supreme Commander',
		at: 'Look at me. Promise me.',
		alt: 'In the quiet house, Gesomun takes his wife’s face in his hands and asks her to promise',
		scene: `${NIGHT} The Yeon house in Pyongyang late at night: a small timber room, a low table, one clay oil lamp on the floor. Intimate close two-shot, low and close: Yeon Gesomun out of armour in a dark charcoal robe, kneeling, his huge hands cupping his wife’s face; Lady Yeon kneeling opposite, her hands over his wrists, eyes lifted to him, worried and steady. The floor lamp rakes up across both faces and the rust-red silk; their shadows merge on the angled wall behind. Device: the hands around her face, the only bright shape in a dark room. No weapons in frame.`,
		people: ['gesomun', 'yeonwife'],
		canon: { hat: false }
	},
	{
		id: 'hek-ink-sumyung-boast',
		entry: 'Heaven–Earth King',
		at: 'There’s nobody under heaven who can touch me.',
		alt: 'Sumyung Jangja stands smug before his ninth storehouse as the noon sky goes black above him',
		style: 'ink',
		scene: `Joseon sumi ink myth frame. ${FRAME} Low angle: Sumyung Jangja, the smug rich man of the attached portrait (long grey beard, half-lidded contemptuous eyes, white robe, gold cord sash), standing with his chin up and arms folded in front of the tall timber door of his ninth storehouse, sure that nothing under heaven can touch him; above him the noon sky is a huge black ink mass swallowing the sun, a single bare-paper disc going dark; his kicking horse and his dog are tiny cowering ink shapes under the porch. Topknots, no brimmed hats. FULL-BLEED, no paper margin.`,
		people: ['sumyeongjangja'],
		canon: false,
		refs: ['/ch_sumyung.png']
	}
];

fs.writeFileSync(MANIFEST, JSON.stringify(items, null, '\t') + '\n');
console.log(`wrote ${items.length} manifest items`);
