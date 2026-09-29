import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function entry(title) {
	for (const ch of story) {
		const en = ch.entries?.find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing entry ${title}`);
}

function insertAfter(en, afterId, slots) {
	const i = en.images.findIndex((im) => im.id === afterId);
	if (i < 0) throw new Error(`missing slot ${afterId}`);
	const exist = new Set(en.images.map((im) => im.id));
	const add = slots.filter((s) => !exist.has(s.id));
	en.images.splice(i + 1, 0, ...add);
	return add.map((s) => s.id);
}

const sunduk = entry('Queen Sunduk');
const gotaso = entry('Gotaso’s Wedding');

const a = insertAfter(sunduk, 'seorabeol-panorama', [
	{
		id: 'sunduk-seq-palace-wide',
		ratio: 1.778,
		tone: '#E07FA8',
		at: 'getting her hair done',
		alt: 'Dutch wide dusk: Eastern Palace pond and giwa; tiny figures in the lower third; timber melting into bokeh',
		refs: ['/pl_eastern_palace.png', '/ch_munhee.png'],
		people: ['munhee']
	},
	{
		id: 'sunduk-seq-munhee-hair',
		ratio: 1.778,
		tone: '#E07FA8',
		at: 'Totally unfit for a Noble woman',
		alt: 'Dutch OTS: sharp comb in the foreground, Munhee midground having her hair done, palace timber in creamy bokeh',
		refs: ['/ch_munhee.png', '/bn_munhee.png', '/pl_eastern_palace.png'],
		people: ['munhee']
	},
	{
		id: 'sunduk-seq-chunchu-prep',
		ratio: 1.778,
		tone: '#D8258C',
		at: 'the most cunning man in Samhan',
		alt: 'Dutch mid-stride: Chunchu in magenta silk, Bupmin a sharp foreground sleeve, Eastern Palace colonnade in bokeh',
		refs: ['/ch_chunchu.png', '/ch_kim_bupmin.png', '/pl_eastern_palace.png'],
		people: ['chunchu', 'munmu']
	},
	{
		id: 'sunduk-seq-bupmin-hill',
		ratio: 1.778,
		tone: '#C41E3A',
		at: 'the hill where adults invent countries',
		alt: 'Wide worm’s-eye: small Bupmin on a hill; Chunchu and Yushin tiny in the midground; Surabol giwa as bokeh',
		refs: ['/ch_kim_bupmin.png'],
		people: ['munmu']
	}
]);

const b = insertAfter(sunduk, 'east-star-hill', [
	{
		id: 'east-seq-hill-wide',
		ratio: 1.778,
		tone: '#2A5FB8',
		at: 'Two boys on a hill above Surabol',
		alt: 'Dutch wide night: two tiny boys on a hill; Seorabeol rooftops creamy bokeh; one planet as a hard shaft',
		refs: ['/ch_chunchu.png', '/ch_kim_yushin.png'],
		people: ['chunchu', 'yushin']
	},
	{
		id: 'east-seq-point',
		ratio: 1.778,
		tone: '#D8258C',
		at: 'That star, in the east',
		alt: 'Dutch two-shot: Chunchu pointing, Yushin beside him; sharp grass foreground; city lights bokeh',
		refs: ['/ch_chunchu.png', '/ch_kim_yushin.png'],
		people: ['chunchu', 'yushin']
	},
	{
		id: 'east-seq-planet',
		ratio: 1.778,
		tone: '#2A5FB8',
		at: 'That is a planet, not a star',
		alt: 'OTS rack-focus: Yushin’s Confucian-blue shoulder sharp; the east planet snapping into focus in bokeh sky',
		refs: ['/ch_kim_yushin.png', '/ch_chunchu.png'],
		people: ['yushin', 'chunchu']
	},
	{
		id: 'east-seq-vow',
		ratio: 1.778,
		tone: '#D8258C',
		at: 'Let us make Samhan one country',
		alt: 'Dutch low two-shot: boys lying on the hill, vowing; magenta and marshal-blue rims; rooftops melted in bokeh',
		refs: ['/ch_chunchu.png', '/ch_kim_yushin.png'],
		people: ['chunchu', 'yushin']
	}
]);

const c = insertAfter(gotaso, 'gotaso-wedding-wide', [
	{
		id: 'gotaso-seq-market-wide',
		ratio: 1.778,
		tone: '#F0A3C0',
		at: 'goes out to the lantern market',
		alt: 'Dutch wide Surabol lantern street: timber shops, packed earth; Gotaso a tiny pink figure; lanterns as bokeh orbs',
		refs: ['/ch_gotaso.png', '/bn_gotaso.png', '/pl_eastern_palace.png'],
		people: ['gotaso']
	},
	{
		id: 'gotaso-seq-ford',
		ratio: 1.778,
		tone: '#D8258C',
		at: 'They find the road on the second night',
		alt: 'Dutch low night ford: Chunchu mid-stride in stained magenta; river and timber in crushed black bokeh',
		refs: ['/ch_chunchu.png', '/ch_kim_yushin.png'],
		people: ['chunchu', 'yushin']
	},
	{
		id: 'gotaso-seq-wipe',
		ratio: 1.778,
		tone: '#D8258C',
		at: 'wipes his hands on the grass',
		alt: 'ECU rack-focus: Chunchu’s stained hands wiping grass in the sharp foreground; his face soft in bokeh',
		refs: ['/ch_chunchu.png'],
		people: ['chunchu']
	},
	{
		id: 'gotaso-seq-nineteen',
		ratio: 1.778,
		tone: '#F0A3C0',
		at: 'It is nineteen li',
		alt: 'Dutch tracking wide: Chunchu carrying Gotaso on the dawn road; Yushin a tiny blue escort in creamy mist bokeh',
		refs: ['/ch_chunchu.png', '/ch_gotaso.png'],
		people: ['chunchu', 'gotaso']
	}
]);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('inserted', [...a, ...b, ...c].join(', '));
