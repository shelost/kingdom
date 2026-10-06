// Baekje crowns + unified battle look: White River retakes (HEEWON_BATTLE), Abe/Takutsu, King Pungjang, Satek nobles, Colossal River.
// Writes scripts/.cache/manifest-baekje-crowns.json for add-image-slots.mjs → GenerateImage → install-temp-art.mjs.
import fs from 'node:fs';

const FRAME = 'Composed for a 2:1 letterbox crop; nothing important at the top or bottom edge.';
const WR = `HEEWON STYLE battle frame. ${FRAME} The Battle of the White River (Baekgang), late summer 663: the wide muddy Geum estuary of the attached pl_white_river board — tidal flats, reed banks, low grey hills on both shores.`;
const WR_WITH = ['place:baekgang'];
const SALSU = `HEEWON STYLE battle frame. ${FRAME} The Battle of the Colossal River (Salsu), summer 612: a broad shallow river over pale gravel bars between low pine hills in northern Goguryeo. Sui banners are dull gold and black, Goguryeo banners red, their marks illegible brush strokes.`;
const STILL = `HEEWON STYLE. Minimal iconic 2:1 movie still. ${FRAME}`;
const JURYU = 'Juryu Fortress: a rough Baekje mountain fortress of piled grey stone on a pine ridge above the western sea, timber gate-house with a plain giwa roof.';

const wr = (id, at, alt, scene, extra = {}) => ({
	id,
	entry: 'White River',
	at,
	alt,
	style: 'battle',
	scene: `${WR} ${scene}`,
	...extra,
	canon: { ...(extra.canon ?? {}), with: [...WR_WITH, ...(extra.canon?.with ?? [])] }
});

const items = [
	// White River retakes — one battle look.
	wr('white-river-aerial', 'White River', 'Dawn over the White River mouth: the Tang tower-ships moored in one dark wall across the channel, the Yamato boats small on the sea beyond',
		'High three-quarter view from a headland at grey dawn: the Tang fleet of tall multi-storey tower-ships moored in ONE long dark line across the channel like a wall, vermilion banners hanging; far out on the slate sea a scatter of small open Yamato war-boats with white-and-red pennants; one thin smoke column already rising from a hulk burned yesterday; gulls. Device: the dark horizontal wall of hulls cutting the estuary in two; the upper half is pale cream sky and slow smoke.',
		{ canon: { with: ['flag:tang', 'flag:yamato'] } }),
	wr('wr-four-banners', 'for the first time the West, Samhan, and the East meet in one mouth of water', 'Four kingdoms’ banners strung along one waterline at the White River mouth',
		'Low over the water: in the dark foreground the prow of a Baekje war-boat under a long yellow banner and a Yamato boat under white-and-red pennants; across the water the Tang wall of tower-ships under vermilion; on the far shore a thin line of Silla blue banners along the ridge. Device: the waterline across the middle with four colours strung along it, big smoke-and-cloud sky above.',
		{ canon: { with: ['flag:tang', 'flag:yamato', 'flag:baekje', 'flag:silla'] } }),
	wr('wr-wa-vanguard', 'They row straight at the Tang line on the evening water', 'The Yamato vanguard rows hard at the Tang line on the evening water',
		'Worm’s-eye from the wave-tops on the evening of the twenty-seventh: a pack of open Yamato war-boats driving toward the Tang tower-ships, rows of oars flashing in unison, the men small dark silhouettes, white-and-red pennants streaming; a claw-crested wave in the foreground; the Tang hulls ahead black against an orange-cream evening sky. Device: the boats as a spearhead pointed at the wall.',
		{ canon: { with: ['flag:tang', 'flag:yamato'] } }),
	wr('wr-tide-turn', 'the current turning against them', 'The current turns against the Yamato boats and drives them back toward the Tang hulls',
		'Over the shoulder of a Yamato steersman at the stern of an open war-boat: his oarsmen straining as the tide reverses, the water drawn into a great diagonal of Hokusai claw-waves pushing the boats sideways and back; ahead the Tang tower-ships wait, perfectly still, and the first smoke climbs. Device: the diagonal of the current across the frame.',
		{ canon: { with: ['flag:tang', 'flag:yamato'] } }),
	wr('wr-fire-arrows', 'arrows wrapped for flame', 'Tang archers on a tower-ship loose fire arrows into the packed Yamato boats',
		'From the upper gallery of a Tang tower-ship: a rank of archers in dark silhouette loosing fire arrows; the arrows trail long arcs of flat vermilion ribbon-flame over the water and drop into the packed Yamato boats below, where sails catch. Device: the parallel arcs of fire. Archers small and drawn, no readable banner.',
		{ canon: { with: ['flag:tang', 'flag:yamato'] } }),
	wr('naval-fire', 'Four hundred eastern ships do not sink so much as', 'Four hundred eastern ships burn together and fill the sky with smoke',
		'Vast wide from low over the water: the whole Yamato fleet locked hull to hull and burning, three enormous sculpted smoke columns towering into the sky lit orange from underneath, flame ribbons running deck to deck, the water reflecting red-orange; in the dark foreground a small rowboat of survivors and swimmers in silhouette; seabirds wheeling. Device: the three smoke columns standing like pillars.',
		{ canon: { with: ['flag:yamato'] } }),
	wr('baekgang-envelop', 'they swing shut from left and right around the Yamato centre', 'The Tang wings swing shut from left and right and crush the Yamato centre',
		'Low angle from the water inside the trap: tall Tang tower-ship hulls closing in from the left and the right edges of the frame like two leaves of a door, their oars biting; the Yamato boats crushed in the narrowing gap between, oars snapping, men climbing; a sliver of pale smoke-sky between the two dark hulls. Device: the two converging hulls.',
		{ canon: { with: ['flag:tang', 'flag:yamato'] } }),
	wr('wr-tortoise-ring', 'a door with two leaves', 'From above, the Tang fleet closes in a ring around the Yamato centre',
		'Bird’s-eye from high in the smoke: the Tang tower-ships drawn in a tightening ring around a knot of burning Yamato boats, wakes curving, smoke streaming sideways across the frame in scroll-cloud curls; the water slate and teal with foam lines. Device: the ring of hulls. Painted, never a map.',
		{ canon: { with: ['flag:tang', 'flag:yamato'] } }),
	wr('wr-armor-drown', 'go into the water in their armour', 'Yamato soldiers leap from a burning boat into the sea in their armour',
		'Close on the waterline: soldiers in lamellar leaping from a burning boat into heaving Hokusai waves, foam claws closing over helmets, one hand reaching up out of the water; the burning hull above them dark against orange smoke. Device: the waterline cutting the frame. No gore.',
		{ canon: { with: ['flag:yamato'] } }),
	wr('baekgang-line-hold', 'has already learned the river’s grammar', 'The Tang line holds the narrow mouth of the White River over the sandbars',
		'Before the battle, low tide: the Tang tower-ships anchored in a rigid line across the narrowest channel, exactly where the sandbars end; mudflats shining in the foreground with a lone wading heron; reed banks; a few Yamato sails tiny on the horizon. Device: the line of hulls on the edge of the pale sand. Calm before smoke: cream sky, slate water.',
		{ canon: { with: ['flag:tang'] } }),
	wr('naval-clash', 'Chunchu, you wretch… how dare you, to His Majesty…!', 'King Pungjang at the stern of his ship shouts across the burning water at the Silla banners',
		'From the stern of the king’s ship amid the burning fleet: King Pungjang in his Baekje royal red robe and crown gripping the rail with both hands, leaning out and shouting across the smoke toward the far shore, where a thin line of Silla blue banners stands on the ridge; burning hulls between them. Over-shoulder from behind his oarsman, then his face in three-quarter. Device: the stern rail as a diagonal.',
		{ people: ['pung'], canon: { with: ['flag:silla', 'flag:baekje'] } }),
	wr('wr-silla-charge', 'I want Silla in the first line.', 'King Munmu leads the Silla cavalry across the mudflats into the Baekje shore guard',
		'Silla horsemen charge across the shining mudflats at the Baekje shore guard, spray and mud flung from the hooves, blue banners streaming; King Munmu at the point on a dark horse, sword raised; behind them the smoke of the burning fleet rising over the estuary. Low foreshortened view from the mud as the lead horse comes at the lens. Device: the charge as one diagonal wedge.',
		{ people: ['munmu'], canon: { battle: true, with: ['flag:baekje'] } }),
	wr('takutsu-last-stand', 'Baekje must survive….', 'Echi no Takutsu fights alone on the last unburnt planks of his burning ship',
		'Echi no Takutsu alone on the last unburnt planks of his burning ship, white headband tails streaming, his straight sword low in one hand, Tang boarders closing as dark silhouettes from both sides; flame ribbons climbing the mast behind him and smoke towering. Low dutch angle from the deck, Takutsu large in the midground. Device: the burning mast as a vertical behind him.',
		{ people: ['takutsu'], canon: { battle: true, with: ['flag:tang'] } }),
	wr('takutsu-kinshi-prow', 'Echi no Takutsu among the captains', 'Echi no Takutsu at the prow draws his bow as the golden kite lands on its tip, the fleet behind him in the mist',
		'Dawn on the sea approach, mist: Echi no Takutsu at the prow of his war-boat drawing his longbow, and the golden kite of the attached obj_golden_kite board landing on the upper tip of the bow, wings spread; behind him the Yamato fleet as small silhouettes dissolving into the pale mist. Worm’s-eye from the deck. Device: the bow-stave as a tall arc.',
		{ people: ['takutsu'], refs: ['/obj_golden_kite.png'], canon: { with: ['flag:yamato'] } }),
	wr('takutsu-kinshi-fire', 'Land of the Heavenly Deer', 'Echi no Takutsu roars amid the burning ships with the golden kite on his raised fist',
		'Echi no Takutsu on a burning deck, head thrown back, roaring, one fist raised high with the golden kite of the attached obj_golden_kite board perched on it, wings open; burning hulls, flame ribbons and towering smoke around him, the water red-orange. Low dutch angle from the deck. Device: the raised arm as a vertical line into the smoke.',
		{ people: ['takutsu'], refs: ['/obj_golden_kite.png'], canon: { battle: true, with: ['flag:yamato'] } }),

	// White River — Abe no Hirafu.
	{ id: 'wr-abe-council', entry: 'White River', after: 'wr-first-sight', at: 'Abe no Hirafu does most of the talking', alt: 'Night council on the king’s ship: Abe no Hirafu laughs over the lamp while King Pungjang leans away',
		scene: `${STILL} Night on the deck of the king’s ship at the White River mouth, ONE open bronze oil dish-lamp on a plank table on the deck. Low two-shot across the lamp: Abe no Hirafu looming over the table, laughing, one fist thumping a rolled chart; King Pungjang across from him in his Baekje royal robe and crown, leaning away, half in shadow. Background: dark water, the Tang fleet’s fires as a row of bokeh discs. Device: the lamp between them.`,
		people: ['abe', 'pung'], canon: { with: ['place:baekgang'] } },
	wr('wr-abe-rear', 'The first charge hits a wall of hulls', 'From the rear of the fleet Abe no Hirafu watches the first charge hit the wall of Tang hulls',
		'Over Abe no Hirafu’s shoulder at the stern of his rear-guard ship: his wolf-fur mantle and red cape whipping in the foreground; far ahead the Yamato vanguard boats slam into the wall of Tang tower-ships and the first smoke columns rise. Abe’s face in profile, grin gone, jaw set. Device: the long empty stretch of water between the rear and the wall.',
		{ people: ['abe'], canon: { battle: true, with: ['flag:tang'] } }),
	wr('wr-abe-turns', 'He turns them for home', 'Abe no Hirafu hauls a half-armoured swimmer out of the sea as his ship turns for home',
		'Abe no Hirafu leaning over the gunwale of his ship, hauling a half-armoured swimmer out of the red-orange water by the wrist; his crew behind him heaving the steering oar round, other swimmers clinging to the hull; behind them the burning fleet and three smoke columns. Low from the water at the hull. Device: the arm-to-arm line from Abe down to the swimmer.',
		{ people: ['abe'], canon: { battle: true, with: ['flag:yamato'] } }),

	// King Pungjang in Baekje royal dress.
	{ id: 'pungjang-crowned', entry: 'King Pungjang', after: 'five-loyalists', at: 'is welcomed as the leader of the Revival Society and crowned as', alt: 'In the hall at Juryu, Gwishil Boksin lowers the black-and-gold Baekje crown onto Pung’s head',
		scene: `${STILL} ${JURYU} Inside its rough stone hall at night, ONE brazier on the floor in the foreground. Worm’s-eye past the brazier: Pung, in the red royal robe of a Baekje king, kneeling upright with his eyes closed; Gwishil Boksin standing over him in steel lamellar, lowering the black silk cap with twin gold flame ornaments onto Pung’s topknot with both hands; behind them, in the dark, refugees and soldiers kneeling as silhouettes. The crown’s gold catches the brazier. Device: the crown held at the apex of a pyramid of arms.`,
		people: ['pung', 'boksin'], canon: { hat: false } },
	{ id: 'pungjang-pisong', entry: 'King Pungjang', after: 'gwisil-bokshin', at: 'This Juryu lies far from farmland', alt: 'King Pungjang, crowned, points south across the map toward Pisong while Takutsu shakes his head',
		scene: `${STILL} ${JURYU} Inside its stone hall by day-dark, one oil lamp on the floor beside a silk map spread on the flagstones. Low three-quarter from the floor: King Pungjang in his Baekje royal robe and crown, standing, pointing down at the map toward the south; Echi no Takutsu kneeling opposite on one knee, hand flat on the map, shaking his head; the lamp lights both faces from below. Device: the map as a pale rectangle between them.`,
		people: ['pung', 'takutsu'] },
	{ id: 'pungjang-wall', entry: 'King Pungjang', after: 'pungjang-pisong', at: 'The men move once, move back', alt: 'King Pungjang alone on the wall of Juryu watches his men trudge back up the mountain road',
		scene: `${STILL} ${JURYU} Dusk, storm clouds over the western sea. Far wide: King Pungjang tiny in the lower third on the rough stone parapet, in his red Baekje royal robe and crown, looking down; below him a thin column of soldiers and carts trudging back up the switchback mountain road to the gate. Half the frame granulated storm sky with one cloud-break of low gold light on his crown. Device: the switchback road as a zigzag climbing to him.`,
		people: ['pung'] },

	// Satek nobles in great-clan crowns.
	{ id: 'satek-crowns-steps', entry: 'Eight Great Clans', after: 'clan-satek', at: 'The Satek clan is currently the most powerful', alt: 'Elder Satek and Minister Satek in gilt noble crowns on the timber steps of the Sabi hall',
		scene: `${STILL} Sabi palace at dusk, as the attached pl_sabi_palace board. Low three-quarter from the foot of the timber hall steps: Elder Satek seated on the top step, both hands on his knees, Minister Satek standing one step below at his shoulder; both wear the tall gilt-bronze noble crown, catching the low gold sun; behind them the dark hall doors; below, out of focus in the foreground, the chalked grid of the tourney yard. Device: the stair diagonal climbing to the two crowns.`,
		people: ['eldersatek', 'ministersatek'], canon: { with: ['place:sabi'] } },
	{ id: 'satek-berths', entry: 'Eight Great Clans', after: 'satek-crowns-steps', at: 'Blood cools. A winter anchorage does not.', alt: 'Elder Satek in his gilt crown at the end of a winter pier, the clan’s ships berthed in rows',
		scene: `${STILL} Blue hour at a winter anchorage on the White River below Sabi (attached pl_sabi_port board): Elder Satek at the end of a long timber pier, hands clasped behind his back, in the tall gilt-bronze noble crown and a heavy dark robe; on both sides Baekje trading ships berthed in neat rows with furled sails; one lantern on a pier post beside him lights the crown and his beard. Over-shoulder from behind and to the side. Device: the pier as a line into the water.`,
		people: ['eldersatek'], refs: ['/pl_sabi_port.png'] },
	{ id: 'satek-rally', entry: 'Coup', after: 'euija-coup-satek-stare', at: 'Satek calling in four generations of favors', alt: 'The Satek lords in their gilt crowns lean over one lamp to rally the clans',
		scene: `${STILL} Night in the Satek clan hall at Sabi: a low lacquered table, ONE oil lamp on it. Minister Satek at the head, scarred face lit from below, leaning forward on his fists; three older Satek lords leaning in along the sides. Every man wears the tall gilt-bronze noble crown, gold catching the lamp; their shadows climb the plaster wall behind. Low angle from the end of the table. Device: the table as a dark wedge toward the lamp.`,
		people: ['ministersatek'], canon: { with: ['noble:baekje'] } },

	// Colossal River.
	{ id: 'salsu-sui-host', entry: 'Colossal River', after: 'salsu-flashback', at: 'Emperor Yang of Sui invades Goguryeo in the year 612.', alt: 'The endless Sui host crosses the Liao on pontoon bridges while Ulchi Munduk watches from a ridge',
		style: 'battle',
		scene: `${SALSU} The Sui host crossing the Liao River on three long pontoon bridges: a sea of spears and gold-and-black banners under towering dust clouds lit orange by the low sun, columns stretching to the horizon. In the dark foreground on a pine ridge, Ulchi Munduk on horseback, small, watching. Device: the three bridges as long diagonals across the water.`,
		people: ['munduk'], canon: { battle: true, mounted: true } },
	{ id: 'munduk-seven-retreats', entry: 'Colossal River', after: 'munduk-banner', at: 'He surrenders seven times on the way south', alt: 'Goguryeo riders wheel away across the plain, drawing the long Sui column south toward the river',
		style: 'battle',
		scene: `${SALSU} Bird’s-eye from high above an autumn plain: a small band of Goguryeo riders with red banners wheeling away at a gallop, and behind them the long Sui column snaking after through its own dust; far ahead a silver ribbon of river. Seven faint dust trails curve across the plain. Device: the S-curve of the pursuit toward the river.`,
		canon: { with: ['flag:goguryeo'] } },
	{ id: 'munduk-poem', entry: 'Colossal River', after: 'salsu-ford-ribbon', at: 'know it is enough, and I pray you stop.', alt: 'Ulchi Munduk writes his four-line poem to the Sui general by one lamp in his camp',
		scene: `${STILL} Night in a Goguryeo field tent: ONE oil lamp on the ground beside a strip of silk. Worm’s-eye past the lamp: Ulchi Munduk sitting cross-legged in his lamellar with the helm set beside him, brush poised, the faintest smile, writing four short lines on the silk — the characters as illegible brush marks. Lamp from below lights the steel plates and his face; the tent wall behind, his shadow huge on it. Device: the white silk strip as a pale line in the dark.`,
		people: ['munduk'], canon: { hat: false } },
	{ id: 'salsu-midstream', entry: 'Colossal River', after: 'munduk-poem', at: 'decisively defeats the Western Army', alt: 'Halfway across the Salsu, the Sui army is struck from behind by Goguryeo cavalry led by Ulchi Munduk',
		style: 'battle',
		scene: `${SALSU} The Sui army caught halfway across the river, men waist-deep with spears and banners raised; on the near bank Goguryeo cavalry crash into their rear, water exploding into Hokusai foam claws around the horses; Ulchi Munduk on horseback at the crest of the bank, spear lowered, red scarf flying. Low foreshortened view from the water. Device: the river as a broad band across the frame, the Sui host trapped in it.`,
		people: ['munduk'], canon: { battle: true, mounted: true, with: ['flag:goguryeo'] } }
];

fs.writeFileSync('scripts/.cache/manifest-baekje-crowns.json', JSON.stringify(items, null, '\t') + '\n');
console.log(items.length, 'items');
