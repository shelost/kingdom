import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

let jumong;
for (const ch of story) {
	for (const en of ch.entries ?? []) {
		if (en.title === 'Jumong' && String(en.year) === '-37') jumong = en;
	}
}
if (!jumong) throw new Error('Jumong -37 entry not found');

const slots = [
	{
		id: 'haemosu-night-arrive',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'Jumong reaches the water alone',
		alt: 'Night rain Amnok: tiny crimson Jumong on near stones; gold chariot plane arriving',
		refs: ['/ch_jumong.png', '/ch_haemosu.png', '/pl_white_river.png', '/temp/haemosu-chariot-usual-run.jpg'],
		people: ['jumong', 'haemosu']
	},
	{
		id: 'haemosu-shaft-knock',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'the sun comes in as a body',
		alt: 'Gold light-plane knocks Haewonmek mid-flight; Jumong still watching the water',
		refs: ['/ch_haemosu.png', '/ch_haewonmek.png', '/ch_jumong.png', '/pl_white_river.png'],
		people: ['haemosu', 'haewonmek', 'jumong']
	},
	{
		id: 'haewonmek-pin-stones',
		ratio: 1.778,
		nsfw: false,
		tone: '#6b5b6e',
		at: 'The blow is coming down',
		alt: 'Haewonmek crouched over Jumong on wet stones, sword-arm raised, gat dripping',
		refs: ['/ch_haewonmek.png', '/ch_jumong.png', '/pl_white_river.png'],
		people: ['haewonmek', 'jumong']
	},
	{
		id: 'haemosu-wrist-close',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'A hand closes on Haewonmek’s wrist',
		alt: 'Close: Haemosu’s hand locks Haewonmek’s sword-wrist in the rain',
		refs: ['/ch_haemosu.png', '/ch_haewonmek.png'],
		people: ['haemosu', 'haewonmek']
	},
	{
		id: 'haewonmek-blocked-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#6b5b6e',
		at: 'The night is not your domain',
		alt: 'ECU Haewonmek: gat askew, black mouth-band, exasperated blocked glare',
		refs: ['/ch_haewonmek.png'],
		people: ['haewonmek']
	},
	{
		id: 'haemosu-heh-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'Do you really think the sun disappears at night',
		alt: 'ECU Haemosu: jolly sun-grin, no body-halo, gold as a light-plane',
		refs: ['/ch_haemosu.png'],
		people: ['haemosu']
	},
	{
		id: 'jumong-ford-call',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'Make way for me!',
		alt: 'Jumong clean-shaven shouting at the night river, bow high, crimson silk',
		refs: ['/ch_jumong.png', '/pl_white_river.png'],
		people: ['jumong']
	},
	{
		id: 'haemosu-boy-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: "That's my boy.",
		alt: 'ECU Haemosu: proud sun-grin looking off toward the ford',
		refs: ['/ch_haemosu.png'],
		people: ['haemosu']
	},
	{
		id: 'haewonmek-ledger-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#6b5b6e',
		at: 'You just robbed a ledger.',
		alt: 'ECU Haewonmek: gat askew, clerk-exasperated, robbed-ledger face',
		refs: ['/ch_haewonmek.png'],
		people: ['haewonmek']
	},
	{
		id: 'tabal-name-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#a97c4a',
		at: 'Name.',
		alt: 'ECU Tabal torch interrogation: Name.',
		refs: ['/ch_yeon_tabal.png', '/temp/jumong-seq-tabal-night-wide.jpg'],
		people: ['yeontabal']
	},
	{
		id: 'tabal-who-sent-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#a97c4a',
		at: 'So who sent you',
		alt: 'ECU Tabal: So who sent you — torch sweat, sour weigh',
		refs: ['/ch_yeon_tabal.png', '/temp/jumong-seq-tabal-night-wide.jpg'],
		people: ['yeontabal']
	},
	{
		id: 'tabal-millet-ecu',
		ratio: 1.778,
		nsfw: false,
		tone: '#a97c4a',
		at: 'The millet likes you. I don’t.',
		alt: 'ECU Tabal: The millet likes you. I don’t.',
		refs: ['/ch_yeon_tabal.png', '/temp/jumong-seq-tabal-night-wide.jpg'],
		people: ['yeontabal']
	},
	{
		id: 'crown-cord-tabal',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'Tabal sets a vermilion cord',
		alt: 'Dutch OTS: Tabal setting a vermilion cord on King Jumong’s brow, five fires behind',
		refs: ['/ch_yeon_tabal.png', '/ch_dongmyung.png', '/temp/jumong-seq-summit-wide.jpg'],
		people: ['yeontabal', 'jumong']
	},
	{
		id: 'crown-fires-dutch',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'The five fires take the same wind',
		alt: 'Dutch: five fire pits on the same packed-earth summit yard',
		refs: ['/temp/jumong-seq-summit-wide.jpg', '/ch_dongmyung.png'],
		people: ['jumong']
	},
	{
		id: 'crown-king-worm',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'the largest kingdom in Samhan',
		alt: 'Worm’s-eye: King Jumong newly corded, vermilion on brow, packed-earth yard',
		refs: ['/ch_dongmyung.png', '/temp/jumong-seq-summit-wide.jpg'],
		people: ['jumong']
	},
	{
		id: 'crown-queen-rail',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8a04a',
		at: 'first queen of a country that still smells like millet',
		alt: 'OTS rail: Queen Sosuno dusty-rose rim, chin up, five fires in the same yard',
		refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/temp/jumong-seq-summit-wide.jpg'],
		people: ['sosuno']
	},
	{
		id: 'jumong-seq-crown-yard',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'Tabal sets a vermilion cord',
		alt: 'Wide dusk: same packed-earth coronation yard, five fires, grey giwa hall bar',
		refs: ['/temp/jumong-seq-summit-wide.jpg', '/ch_dongmyung.png', '/ch_sosuno_queen.png', '/ch_yeon_tabal.png'],
		people: ['jumong', 'sosuno', 'yeontabal']
	}
];

const have = new Set((jumong.images ?? []).map((im) => im.id));
let added = 0;
for (const slot of slots) {
	if (have.has(slot.id)) continue;
	jumong.images.push(slot);
	have.add(slot.id);
	added++;
}

// Bury Tabal "Name." in the existing interrogation beat.
for (const b of jumong.blocks ?? []) {
	if (b.kind !== 'dialogue' || b.person !== 'yeontabal') continue;
	const en0 = b.en?.[0] ?? '';
	if (en0.includes('So who sent you') && !(b.en ?? []).some((l) => l === 'Name.')) {
		b.en = ['Name.', ...b.en];
		b.lines = ['이름.', ...(b.lines ?? [])];
	}
}

// Bury "Jumong reaches the water alone" is already bold in a p.
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`Jumong images now ${jumong.images.length}; added ${added}`);
