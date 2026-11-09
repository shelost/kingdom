import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/lib/data/story.json';
const data = JSON.parse(readFileSync(path, 'utf8'));

function entry(title) {
	for (const ch of data) for (const e of ch.entries) if (e.title === title) return e;
	throw new Error(title);
}

const HEEWON =
	' HEEWON STYLE. Minimal iconic 2:1 still, composed for a 2:1 letterbox crop; nothing important at the top or bottom edge. Painted webtoon faces with bold ink line, watercolor-and-oil world, movie tenebrism, one hard key, crushed blacks. FACE ONLY from the attached portrait — invent a new dramatic body. No text. No watermark. Not photoreal. Match the look of hek-ten-regions / hek-yumla-named (prompt-style only, never a ref).';

const hekNew = [
	{
		id: 'hek-chariot-gift',
		ratio: 2,
		time: 'day',
		alt: 'Little Star gives the five-dragon chariot to Haemosu.',
		at: 'Little Star holds up his father’s five-dragon chariot.',
		people: ['sobyeol', 'haemosu'],
		refs: ['/ch_little_star.png', '/ch_haemosu.png', '/obj_haemosu_chariot.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 day still. LEFT face of the sheet = Little Star as Lord of the Living: white silk with red shoulder marks, FACE from attached. RIGHT = Haemosu: long white hair, open white robe, bare chest, FACE from attached. Between them the five-dragon gold chariot from the RIGHTMOST board of the sheet: gold open chariot, five dragons jade azure crimson gold white. Little Star holds the rail out; Haemosu reaches. ONE device: the chariot rail as a bright gold bar across the middle. #C94040 hard key on Little Star’s red marks; warm gold on the chariot — never a glow aura. High-key pale sky, crushed shadow under the hill.' +
			HEEWON
	},
	{
		id: 'hek-haemosu-sky',
		ratio: 2,
		time: 'day',
		alt: 'Haemosu takes the five-dragon chariot across the sky.',
		at: 'Haemosu takes the rail. The schedule finally has a name.',
		people: ['haemosu'],
		refs: ['/ch_haemosu.png', '/obj_haemosu_chariot.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 day still. Worm’s-eye from below. Haemosu, FACE from attached portrait, long white hair, white open robe, stands in the gold five-dragon chariot from the attached board, one hand on the rail, looking ahead. Five dragons pull ahead: jade, azure, crimson, gold, white. ONE device: the chariot floor as a gold wedge climbing the sky. Warm gold hard key, never a glow. Tiny earth ridge in lower third. No text.' +
			HEEWON
	},
	{
		id: 'hek-spirit-border',
		ratio: 2,
		time: 'dusk',
		alt: 'Little Star drives the spirits down and seats the worst at the border.',
		at: 'Then he drives the spirits out.',
		people: ['sobyeol'],
		refs: ['/ch_little_star.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 dusk still. Little Star, FACE from attached, white silk red marks, stands on a ridge pointing down a dark road. Pale ghost shapes tumble toward the dark edge — tiny, dissolving, not an army catalog. ONE device: the ridge as a hard diagonal splitting warm pale ground from black void. The most violent spirits as darker silhouettes at the border line. #C94040 hard key. Crushed blacks. No readable faces on the ghosts.' +
			HEEWON
	},
	{
		id: 'hek-flower-steal',
		ratio: 2,
		time: 'night',
		alt: 'Little Star swaps the flower basins while Big Star sleeps.',
		at: 'Little Star lies on his side and counts his brother’s breathing up to a hundred.',
		people: ['sobyeol', 'daebyeol'],
		refs: ['/ch_little_star_young.png', '/ch_big_star_young.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 night still. Two young brothers. LEFT of sheet = young Little Star in white with red, leaning over two silver basins, swapping an open flower into his own. RIGHT = young Big Star asleep in white with blue. ONE device: the two basins as silver discs on a dark floor. One open flower, one yellowing. #C94040 lamp key on the swap hand. Never a glow. Two distinct faces. Dutch angle.' +
			HEEWON
	},
	{
		id: 'hek-scale-line',
		ratio: 2,
		time: 'dusk',
		alt: 'Big Star hangs a scale; the light ones follow him down.',
		at: 'Then he hangs a scale from the sky.',
		people: ['daebyeol', 'sobyeol'],
		refs: ['/ch_big_star.png', '/ch_little_star.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 dusk still. Big Star, FACE from LEFT of sheet, black silk ice-blue sash, hangs a great scale from the sky. Little Star small behind him in white-red. A quiet line of pale light figures wait under the scale. ONE device: the scale as a black T dividing the sky. #3B6FBF hard key. Crushed blacks. No army catalog — a single line only.' +
			HEEWON
	},
	{
		id: 'hek-ten-kings-seat',
		ratio: 2,
		time: 'night',
		alt: 'Big Star and Yumla seat the Ten Kings over ten hells.',
		at: 'Ten of them take a court. The Ten Kings.',
		people: ['daebyeol', 'yumla'],
		refs: ['/ch_big_star.png', '/ch_yumla.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 night still. Big Star LEFT black silk blue sash, Yumla RIGHT grey beard black robe orange-red hem skull pin, both FACE from sheet. They face ten empty dark thrones in a shallow arc. ONE device: the arc of ten seats. Tiny worthy souls kneeling before the seats. #3B6FBF key + one orange-red accent on Yumla. No readable text. Monumental emptiness.' +
			HEEWON
	}
];

const gsNew = [
	{
		id: 'gs-birth-set',
		ratio: 2,
		time: 'night',
		alt: 'Samsin sets a red Life Flower on a sleeping mother.',
		at: 'She sets a red Life Flower on the belly. The baby cries.',
		people: ['samsin'],
		refs: ['/ch_samsin.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 night still. Intimate close. Samsin, FACE from attached: WHITE hair, blue jeogori, red chima, leans over a sleeping mother on a low mat and sets a red Life Flower on the belly. ONE device: the red flower as the only bright point. #e8b4c8 lamp catch on white hair and silk — never a glow. Timber room, crushed blacks. Dynamic lean, not a standing portrait.' +
			HEEWON
	},
	{
		id: 'gs-soul-cut',
		ratio: 2,
		time: 'night',
		alt: 'Kangrim cuts the soul cord; Gusamsin waits.',
		at: 'A pale soul cord still runs from navel to navel. Kangrim cuts it.',
		people: ['kangrim', 'yongnyeo'],
		refs: ['/ch_kangrim.png', '/ch_gusamsin.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 night still. LEFT Kangrim FACE from sheet, topknot no hat, cuts a pale soul cord with a short blade. RIGHT Gusamsin FACE from sheet, white braid, green eyes, dark dragon robe, waiting. A quiet child-soul between them. ONE device: the cord as a thin white line across black. #1a6a8a wet-floor catch. Never a glow. Two distinct faces.' +
			HEEWON
	},
	{
		id: 'gs-plant-gate',
		ratio: 2,
		time: 'day',
		alt: 'Samsin opens the palace gate and plants past the wall.',
		at: 'The beds reach the wall. She opens the gate.',
		people: ['samsin'],
		refs: ['/ch_samsin.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 day still. High-key pale sky. Samsin, FACE from attached, WHITE hair, blue jeogori, red chima, pushes open a timber palace gate and kneels to plant a Life Flower row beyond. ONE device: the open gate as a dark frame, the row a receding line. #e8b4c8 as real light on petals. Match hek-ten-regions energy: painterly world, drawn face, half the frame quiet.' +
			HEEWON
	},
	{
		id: 'gs-dragon-fail',
		ratio: 2,
		time: 'night',
		alt: 'A birth dies in the Dragon Lady’s hands.',
		at: 'A birth dies in the Dragon Lady’s hands. She does not put the child down.',
		people: ['yongnyeo'],
		refs: ['/ch_dragon_lady.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 night still. The Dragon Lady, FACE from attached: black braid, green eyes, pale blue dragon robe, stands in an under-sea hall holding a wrapped still infant close. Wet black pillars. ONE device: the hall as a receding black wedge. Eyes wet, jaw set — not pleading. #1a6a8a as wet-floor catch, never a glow. Intimate medium-close.' +
			HEEWON
	},
	{
		id: 'gs-blacken-open',
		ratio: 2,
		time: 'day',
		alt: 'The dragon’s flower blackens; the sky’s flower opens.',
		at: 'The dragon’s flower blackens on the stem. The sky’s flower opens on the stem.',
		people: ['samsin', 'yongnyeo', 'heavenearthking'],
		refs: ['/ch_sky_princess.png', '/ch_dragon_lady.png', '/ch_heaven_earth_king.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 still. Three distinct faces from the sheet: LEFT Sky Princess black hair gold flowers pale blue silk smiling at an OPEN flower; CENTRE Heaven–Earth King; RIGHT Dragon Lady green eyes watching a BLACKENED flower. ONE device: the table as a hard dark bar with two silver bowls. Open flower translucent pink; dead flower charcoal. #e8b4c8 key on the open bloom only. Never a glow. No clone faces.' +
			HEEWON
	},
	{
		id: 'gs-spent-flower',
		ratio: 2,
		time: 'dusk',
		alt: 'When the Life Flower is spent, the life is over.',
		at: 'It powers the soul from the first breath. When the flower is spent, the life is over.',
		people: ['samsin'],
		refs: ['/ch_samsin.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 dusk still. ECU of a Life Flower going colourless in Samsin’s white-haired hands — FACE of Samsin soft in bokeh behind, from attached portrait. Petals grey, stem thin. ONE device: the spent bloom filling the lower third. Soft dusk key #e8b4c8 fading. Never a glow. Quiet, monumental emptiness around the hands.' +
			HEEWON
	}
];

function addImages(e, items) {
	const have = new Set(e.images.map((i) => i.id));
	for (const im of items) {
		if (have.has(im.id)) {
			const idx = e.images.findIndex((i) => i.id === im.id);
			e.images[idx] = { ...e.images[idx], ...im };
		} else {
			e.images.push(im);
		}
		const hit = e.blocks.some(
			(b) =>
				(b.html && b.html.includes(im.at)) ||
				(b.en && b.en.some((l) => String(l).includes(im.at)))
		);
		if (!hit) {
			// try softer match
			const soft = e.blocks.some((b) => {
				const t = (b.html || '') + ' ' + (b.en || []).join(' ');
				return im.at.split('.').some((part) => part.length > 12 && t.includes(part.trim()));
			});
			if (!soft) console.warn('WARN at may miss', im.id, im.at.slice(0, 60));
		}
	}
}

// Fix HEK flower-steal at — find the actual line in story
const hek = entry('Heaven–Earth King');
const stealLine = hek.blocks.find(
	(b) => b.html && /counts his brother’s breathing|counts his brother's breathing|훔친|바꿔|swap|basins/i.test(b.html)
);
if (stealLine) {
	hekNew.find((i) => i.id === 'hek-flower-steal').at = stealLine.html.includes('Little Star')
		? stealLine.html.match(/[^.]+/)[0].trim() + '.'
		: stealLine.html.slice(0, 80);
	// better: use a unique short fragment from the real block
	const real = hek.blocks.find((b) => b.html && b.html.includes('basins'));
	if (real) {
		const frag = 'two silver basins';
		if (real.html.includes(frag)) hekNew.find((i) => i.id === 'hek-flower-steal').at = frag;
	}
	const sleep = hek.blocks.find((b) => b.html && /sleeps the way honest|honest men sleep/i.test(b.html));
	const swap = hek.blocks.find((b) => b.html && /swaps|바꾼|훔/i.test(b.html + (b.en || []).join('')));
	// Prefer a line that exists for the swap beat
	const night = hek.blocks.find(
		(b) => b.html && (b.html.includes('Little Star lies') || b.html.includes('소별이'))
	);
	if (night) hekNew.find((i) => i.id === 'hek-flower-steal').at = night.html.slice(0, 60);
}

const kings = hek.blocks.find((b) => b.html && b.html.includes('Ten Kings'));
if (kings) hekNew.find((i) => i.id === 'hek-ten-kings-seat').at = 'Ten of them take a court. The Ten Kings.';
const scale = hek.blocks.find((b) => b.html && b.html.includes('hangs a scale'));
if (scale) hekNew.find((i) => i.id === 'hek-scale-line').at = 'Then he hangs a scale from the sky.';

addImages(hek, hekNew);
addImages(entry('Goddess Supreme'), gsNew);

writeFileSync(path, JSON.stringify(data, null, '\t') + '\n');
console.log('hek added', hekNew.map((i) => i.id).join(', '));
console.log('gs added', gsNew.map((i) => i.id).join(', '));

// verify ats
for (const im of [...hekNew, ...gsNew]) {
	const e = [...data.flatMap((c) => c.entries)].find((x) =>
		x.images.some((i) => i.id === im.id)
	);
	const hit = e.blocks.some(
		(b) =>
			(b.html && b.html.includes(im.at)) ||
			(b.en && b.en.some((l) => String(l).includes(im.at)))
	);
	console.log(im.id, 'at ok?', hit, '|', im.at.slice(0, 50));
}
