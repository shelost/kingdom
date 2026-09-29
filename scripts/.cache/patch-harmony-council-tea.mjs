import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

function upsertImage(entry, slot, afterId) {
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) {
		Object.assign(entry.images[i], slot);
		return;
	}
	const after = afterId ? entry.images.findIndex((im) => im.id === afterId) : -1;
	if (after >= 0) entry.images.splice(after + 1, 0, slot);
	else entry.images.push(slot);
}

const ROOM =
	'SAME small Korean pavilion night: timber posts, giwa eaves, wooden floor, low 교자상, tea bowls, blue flame, heavy smoke, extreme chiaroscuro.';
const COAT =
	'Magenta/plum inner, silky white overcoat with faint dragon embroidery. Faces match attached portraits. Floor seating, equidistant.';

const sunduk = findEntry('Queen Sunduk');
const harmony = findEntry('The Harmony Council');

upsertImage(
	sunduk,
	{
		id: 'council-tea-wide',
		ratio: 1.778,
		tone: '#0a0c12',
		at: 'debate who the next king should be',
		alt: 'Night pavilion: six councillors on the floor around a low table, tea, blue flame, smoke',
		refs: ['/pl_eastern_palace.png', '/ch_bidam.png', '/ch_eulje.png', '/ch_alchun.png'],
		prompt: `Intimate cinematic 16:9 still. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-yushin-coat'
);

upsertImage(
	sunduk,
	{
		id: 'council-tea-overhead',
		ratio: 1.778,
		tone: '#0a0c12',
		at: 'Bone is the measure',
		alt: 'Top-down: low wooden table, tea bowls in a ring, blue flame, white dragon-coat shoulders',
		refs: ['/ch_bidam.png', '/ch_alchun.png'],
		prompt: `Intimate cinematic 16:9 top-down. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-tea-wide'
);

upsertImage(
	sunduk,
	{
		id: 'council-tea-worm',
		ratio: 1.778,
		tone: '#0a0c12',
		at: 'The bone has run out',
		alt: 'Worm’s-eye from the floor: table slab, towering blue flame, councillors looming',
		refs: ['/ch_bidam.png', '/ch_eulje.png'],
		prompt: `Intimate cinematic 16:9 worm’s-eye. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-tea-overhead'
);

upsertImage(
	sunduk,
	{
		id: 'council-tea-cups',
		ratio: 1.778,
		tone: '#3E79E4',
		at: 'cannot raise my hand',
		alt: 'Table close: tea bowls, a tense hand, blue flame, smoke on dark wood',
		refs: ['/ch_bidam.png'],
		prompt: `Intimate cinematic 16:9 table close. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-tea-worm'
);

upsertImage(
	sunduk,
	{
		id: 'council-tea-bidam',
		ratio: 0.5625,
		tone: '#141C2E',
		at: 'My lords have said one word',
		alt: 'Bidam close — mid-speech, tea bowl, blue flame on his jaw, dark pavilion',
		refs: ['/ch_bidam.png'],
		prompt: `Intimate cinematic 9:16 close. Bidam speaking. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-tea-cups'
);

upsertImage(
	sunduk,
	{
		id: 'council-tea-rise',
		ratio: 1.778,
		tone: '#141C2E',
		at: 'a Hwarang barely seated',
		alt: 'Bidam half-rises from the floor; tea bowls, blue flame, the others look up',
		refs: ['/ch_bidam.png'],
		prompt: `Intimate cinematic 16:9. Bidam rising. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-tea-bidam'
);

upsertImage(
	sunduk,
	{
		id: 'council-tea-across',
		ratio: 1.778,
		tone: '#0a0c12',
		at: 'Today is the country’s business',
		alt: 'Bidam and Yushin across the low table, tea and blue flame between them',
		refs: ['/ch_bidam.png', '/ch_kim_yushin.png'],
		prompt: `Intimate cinematic 16:9 two-shot. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-tea-rise'
);

upsertImage(
	sunduk,
	{
		id: 'council-tea-alchun',
		ratio: 1.778,
		tone: '#8fb3e0',
		at: 'Only your hand is left',
		alt: 'Alchun raises his hand in the dark pavilion — scar, tea, blue flame',
		refs: ['/ch_alchun.png', '/ch_bidam.png'],
		prompt: `Intimate cinematic 16:9. Alchun hand raised. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-tea-across'
);

upsertImage(
	sunduk,
	{
		id: 'council-tea-yushin',
		ratio: 0.5625,
		tone: '#2A5FB8',
		at: 'That is what deliberation is for',
		alt: 'Yushin seated on the floor — beard, clenched jaw, blue flame, council coat',
		refs: ['/ch_kim_yushin.png', '/ch_bidam.png'],
		prompt: `Intimate cinematic 9:16 close. Yushin, no armor. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-tea-alchun'
);

upsertImage(
	harmony,
	{
		id: 'council-tea-supum',
		ratio: 1.778,
		tone: '#0a0c12',
		at: 'still decide only by unanimity',
		alt: 'Premier Supum across the low table, tea and blue flame in a dark pavilion',
		refs: ['/ch_supum.png', '/ch_bidam.png'],
		prompt: `Intimate cinematic 16:9. Older Supum. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-supum-flame'
);

upsertImage(
	harmony,
	{
		id: 'council-tea-veto',
		ratio: 1.778,
		tone: '#141C2E',
		at: 'Five are up',
		alt: 'Five sleeves up around the blue flame; Bidam’s fist and a tea bowl stay down',
		refs: ['/ch_bidam.png'],
		prompt: `Intimate cinematic 16:9 table-edge veto. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-veto-blue'
);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched tea-pavilion council slots');
