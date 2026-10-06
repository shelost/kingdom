// BRA intro stills, ink-poster pass (benchmark: mu-sinrok-pagoda): webtoon figures in a
// splashed-sumi world, one accent colour each. Swaps the earlier print/tenebrist head and
// scene for the ink head + scene, keeps each slot's CANON + house suffix.
// Writes manifest-bra-ink.json for install-temp-art.mjs.
import fs from 'node:fs';

const SRC = 'scripts/.cache/manifest-bra-redo.json';
const OUT = 'scripts/.cache/manifest-bra-ink.json';

const INK =
	'HEEWON STYLE MOVIE POSTER key art, 2:1 letterbox, composed so nothing important touches the top or bottom edge; no title, no lettering. ' +
	'STYLE: HEEWON STYLE, painterly, with Korean ink painting — Korean webtoon figures (clean ink linework, simplified expressive webtoon faces matching the attached portrait, watercolor-washed; NOT realistic, NOT photoreal, NOT 3D, no skin pores) inside a hand-painted world of traditional sumukhwa ink and watercolor: huge splashed-ink blots and storm clouds, bold dry calligraphic brush strokes in fur, robes, smoke, waves and stone, ink bleeding into wet wash, flung ink splatters, blots and drips near the frame edges, patches of bare warm rice paper where the edges dissolve. ' +
	'Limited palette: sepia, ink black and bare paper plus ONE accent colour. ' +
	'Movie-poster drama: bold iconic silhouette, subject large and close, one dramatic low angle, one bright break of light behind, big dark ink masses. ' +
	'No glow aura, no halo. NO text, NO glyphs, NO seal stamp. No watermark.';

const SCENES = {
	'bra-intro-abe':
		'Blizzard night in the forests of Koshi, worm’s-eye from the snow. A gigantic rearing black bear painted as one splashed-ink blot, dry-brush fur bristling, white claws raised, broken arrows in its hide; Abe no Hirafu locked chest to chest under it, arm hooked round its neck, a short straight knife driving up, roaring with laughter. Snow as flung paper-white flecks; one moon-break behind them. ACCENT: his red cape (#c8463c) whipping out in one bold red wash.',
	'bra-intro-takutsu':
		'Asuka at dawn, worm’s-eye from the ridge rocks. Echi no Takutsu at full draw of a tall Yamato longbow, white headband tails streaming, quiver on his back, no sword in frame; below him in pale ink wash the Asuka-dera pagoda and the round Yamato hills dissolving into paper mist; a brown kite in quick dry-brush; the bow a black calligraphic arc against one dawn break. ACCENT: his orange-red robe, a faint rose (#b05575) in the dawn.',
	'bra-intro-dochim':
		'A Baekje mountain temple at dusk, worm’s-eye. The rock-cut Buddha triad with the Baekje smile in grey ink wash and dry-brush stone, the Jeongnimsa pagoda a dark vertical, incense as calligraphic ink ribbons. Dochim mid-spin in front, whirling his gilt ringed staff, kasaya flaring in a wheel of wet brush strokes, 108 beads whipping like an ink splash, wearing the same serene smile as the stone Buddhas. ACCENT: the red-orange kasaya.',
	'bra-intro-sangji':
		'Imjon fortress at night, extreme worm’s-eye up a dry-brush stone stair. Heukchi Sangji strides toward the lens, boot huge in the foreground, spear on his shoulder, torch in his fist, ring-pommel sword at his hip; the valley behind a river of torches winding up the black ink mountain, smoke as splashed-ink clouds. ACCENT: torch orange.',
	'bra-intro-sangya':
		'The Satek harbour at sunset, worm’s-eye up a mountain of rice bales in dry-brush ink. Lord Satek Sangya on top, one foot up, fanning blank tally slips like a card dealer while square-holed coins arc through the air, eyes on his open ledger, sly smile; open rowing boats and giwa warehouses dissolving into paper behind; one low sunset break. ACCENT: gold (coins, gilt noble crown, sunset).',
	'bra-intro-boksin':
		'The Juryu wall at a stormy dawn, worm’s-eye from the wall walk. Gwisil Boksin leaning back, one boot on the battlement, swinging a huge plain yellow banner on a red shaft, the banner one enormous wet yellow brush-stroke bleeding into the paper; shouting; the gate pavilion and ridges in pale wash behind one dawn break. ACCENT: banner yellow.',
	'bra-intro-pung':
		'Storm at sea off the Baekje coast, low dutch angle. The carved prow of an open oared war-boat (no mast, no rigging) pitching into a towering splashed-ink wave with dry-brush claw foam and white spray; Prince Pung on the prow clamping the black silk crown on his head, the other arm flung toward the homeland, grinning big with eyes a beat less sure; homeland mountains a pale shape under one light break. ACCENT: his red silk robe in bold wet strokes.'
};

const items = JSON.parse(fs.readFileSync(SRC, 'utf8'))
	.filter((it) => SCENES[it.id])
	.map((it) => {
		const tail = it.prompt.slice(it.prompt.indexOf('CANON —'));
		return { id: it.id, alt: it.alt, ratio: it.ratio ?? 2, prompt: `${INK} ${SCENES[it.id]} ${tail}` };
	});

fs.writeFileSync(OUT, JSON.stringify(items, null, '\t') + '\n');
console.log(`wrote ${items.length} → ${OUT}`);
