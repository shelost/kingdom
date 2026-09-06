import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function entries() {
	const out = [];
	for (const ch of story) for (const en of ch.entries ?? []) out.push(en);
	return out;
}

const entry = entries().find((e) => e.title === 'Bidam’s Rebellion');
if (!entry) throw new Error('missing Bidam’s Rebellion');

function byId(id) {
	const im = entry.images.find((x) => x.id === id);
	if (!im) throw new Error(`missing slot ${id}`);
	return im;
}

const refs = ['/ch_bidam_old.png', '/ch_kim_yushin.png'];

Object.assign(byId('bidam-pavilion-rain'), {
	tone: '#141C2E',
	at: 'a small pavilion goes up',
	alt: 'Tiny open 정자 under a half moon — Bidam and Yushin on the floor at a low wooden table, empty night sky',
	refs,
	prompt:
		'Minimal iconic 16:9 poster. Bidam and Kim Yushin, tea debate. ONE geometric device: a tiny open Korean wooden pavilion (정자) as a dark-wood stamp in the lower third — four posts, simple tiled roof; inside, a Korean-style LOW wooden table, NO chairs, both sitting on the floor. A HALF MOON as a hard pale semicircle in a vast flat night-navy void #141C2E. Faces match attached portraits. Bidam silky near-black hanbok, 108 beads, sitting not lotus. Yushin Confucian-blue #2A5FB8 silk, kneeling. Two celadon cups. Flat night sky, no clouds. No army. No camps. No trees. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.'
});

Object.assign(byId('bidam-blood-inevitable'), {
	tone: '#141C2E',
	at: 'Blood is inevitable.',
	alt: 'Across a low wooden table under a half moon — Bidam leaning in, Yushin kneeling, empty night behind the open 정자',
	refs,
	prompt:
		'Minimal iconic 16:9 CLOSE still. Bidam and Kim Yushin across a Korean LOW wooden tea table, no chairs, sitting on the floor. ONE geometric device: the table as a hard dark-wood HORIZONTAL BAR. A HALF MOON as a pale hard semicircle through the open pavilion side. Flat navy void #141C2E. Faces match attached portraits. Bidam silver-grey hair, thin mustache, silky black hanbok. Yushin beard, scar, Confucian-blue #2A5FB8 silk, kneeling. Two celadon cups. No army. No camps. No clouds. No trees. No text. No watermark.'
});

Object.assign(byId('bidam-yushin-two-laws'), {
	tone: '#141C2E',
	at: 'Tang sends institutions. India sends…',
	alt: 'Pavilion eave as a lid, low table under a half moon — Bidam and Yushin on the floor, empty night',
	refs,
	prompt:
		'Minimal iconic 16:9 poster. Bidam and Kim Yushin, two laws over tea. ONE geometric device: the pavilion roof as a thin dark HORIZONTAL LID; a Korean LOW wooden table; a HALF MOON as a pale hard semicircle in empty night. Both sit on the floor, NO chairs. Flat night-navy #141C2E. Faces match attached portraits. Bidam sitting not lotus. Yushin kneeling. Two celadon cups. No army. No camps. No clouds. No trees. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.'
});

const extras = [
	{
		id: 'bidam-pavilion-draft',
		ratio: 1.778,
		tone: '#141C2E',
		at: 'Same low table under the half moon',
		alt: 'Two pavilion posts, a low table, a half moon cropped by the eave — Bidam with a draft, Yushin kneeling',
		prompt:
			'Minimal iconic 16:9 poster. Bidam and Kim Yushin, a rumoured draft over tea. ONE geometric device: two pavilion posts as hard dark VERTICALS; a Korean LOW wooden table as a low strip; a HALF MOON cropped by the top edge. Both sit on the floor, NO chairs. Flat night-navy #141C2E. Faces match attached portraits. Bidam holding pale paper, sitting not lotus. Yushin Confucian-blue #2A5FB8 silk, kneeling. Two celadon cups. No army. No clouds. No trees. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
		refs,
		tempImage: '/temp/bidam-pavilion-draft.jpg'
	},
	{
		id: 'bidam-pavilion-empty',
		ratio: 1.778,
		tone: '#141C2E',
		at: 'Yushin does not come to the pavilion',
		alt: 'Tiny empty 정자 under a huge half moon — Bidam alone, one cup steaming, empty night sky',
		prompt:
			'Minimal iconic 16:9 poster. Bidam alone after Yushin does not come. ONE geometric device: a tiny empty 정자 as a dark-wood stamp in the lower-left third; one LOW wooden table, NO chairs; two celadon cups, one steaming. A HALF MOON as a huge hard pale semicircle in a vast flat night-navy void #141C2E. Face matches attached portrait. Bidam silky near-black hanbok, 108 beads, sitting not lotus. No army. No camps. No trees. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
		refs: ['/ch_bidam_old.png'],
		tempImage: '/temp/bidam-pavilion-empty.jpg'
	}
];

for (const slot of extras) {
	if (!entry.images.some((im) => im.id === slot.id)) {
		entry.images.push(slot);
	} else {
		Object.assign(byId(slot.id), slot);
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched pavilion debate slots');
