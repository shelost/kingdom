import fs from 'node:fs';
import path from 'node:path';

const STORY = 'src/lib/data/story.json';
const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of Object.values(story)) {
		for (const en of ch.entries ?? []) {
			if (en.title === title) return en;
		}
	}
	throw new Error(`entry not found: ${title}`);
}

function hasSlot(entry, id) {
	return (entry.images ?? []).some((im) => im.id === id);
}

function addSlot(entry, slot) {
	if (hasSlot(entry, slot.id)) return false;
	entry.images = entry.images ?? [];
	entry.images.push(slot);
	return true;
}

// Redo busy Yuhwa interior with the new graphic moon-office still.
const yuhwaSrc = path.join(ASSETS, 'yuhwa-moon-office.png');
const yuhwaDst = path.join(ASSETS, 'yuhwa-moon-ascent.png');
if (fs.existsSync(yuhwaSrc) && !fs.existsSync(yuhwaDst)) {
	fs.copyFileSync(yuhwaSrc, yuhwaDst);
}

const added = [];

const dangun = findEntry('Dangun & Old Joseon');
if (
	addSlot(dangun, {
		id: 'hwanin-opens-sky',
		ratio: 1.778,
		tone: '#F4F1E8',
		at: 'Hwanin does not plough',
		alt: 'Hwanin as a monumental cream-white Creator, three seals falling to tiny bowing silhouettes',
		prompt:
			'Anime-painterly graphic still: Hwanin Creator as layout hero, cream-white #F4F1E8 halo and flat heaven field, three seals, tiny kowtow row. No clouds, no photoreal. No text.',
		refs: ['/ch_hwanin.png']
	})
)
	added.push('hwanin-opens-sky');
if (
	addSlot(dangun, {
		id: 'dangun-wanggeom',
		ratio: 1.778,
		tone: '#b8956a',
		at: 'first court that speaks for heaven',
		alt: 'Dangun Wanggeom as layout hero before a tiny Asadal hall, bronze-gold mandate shaft',
		prompt:
			'Anime-painterly graphic still: Dangun as layout hero, bear-fur mantle, bronze #b8956a rim, tiny hall. No clouds. No text.',
		refs: ['/ch_dangun.png', '/ch_hwanung.png']
	})
)
	added.push('dangun-wanggeom');
if (
	addSlot(dangun, {
		id: 'ungnyeo-cave-vigil',
		ratio: 1.778,
		tone: '#c9b18f',
		at: 'outlasted a tiger',
		alt: 'Ungnyeo as layout hero in a black cave-arch, cream-gold light, tiger leaving as a tiny silhouette',
		prompt:
			'Anime-painterly graphic still: Ungnyeo Bear-Woman as layout hero, cream #c9b18f plane, gold shaft, tiny tiger leaving. No cave clutter. No text.',
		refs: ['/ch_ungnyeo.png', '/ch_hwanung.png']
	})
)
	added.push('ungnyeo-cave-vigil');

const kangrim = findEntry('Kangrim');
if (
	addSlot(kangrim, {
		id: 'yumla-judgment',
		ratio: 1.778,
		tone: '#7c3aed',
		at: 'Yumla keeps the sentence',
		alt: 'Yumla on a purple-plane throne in a flat underworld void; a tiny soul kowtows in the aisle',
		prompt:
			'Anime-painterly graphic still: Yumla layout hero, purple #7c3aed plane, flat underworld void, no clouds. No text.',
		refs: ['/ch_yumla.png', '/ch_kangrim.png']
	})
)
	added.push('yumla-judgment');
if (
	addSlot(kangrim, {
		id: 'kangrim-red-book',
		ratio: 1.778,
		tone: '#4a4a58',
		at: 'I collect — for His Majesty.',
		alt: 'Kangrim as layout hero under a black gat, orange sleeves, open red ledger, flat underworld field',
		prompt:
			'Anime-painterly graphic still: Kangrim layout hero, red ledger, orange sleeves, flat charcoal underworld. No clouds. No text.',
		refs: ['/ch_kangrim.png']
	})
)
	added.push('kangrim-red-book');

const jacheongbi = findEntry('The Girl Who Cut Her Hair');
if (
	addSlot(jacheongbi, {
		id: 'hallakgungi-gate',
		ratio: 1.778,
		tone: '#8FBF8A',
		at: 'This gate answers to Hallakgungi now.',
		alt: 'Hallakgungi as layout hero under a simple gate in a flat sage-green flower-field void',
		prompt:
			'Anime-painterly graphic still: Hallakgungi layout hero, sage #8FBF8A flat Western Flower Field, no clouds. No text.',
		refs: ['/ch_gardener.png', '/ch_jacheongbi.png']
	})
)
	added.push('hallakgungi-gate');

const namseng = findEntry('Birth of Namseng');
if (
	addSlot(namseng, {
		id: 'samsin-life-office',
		ratio: 1.778,
		tone: '#e8b4c8',
		at: 'the three who open a birth',
		alt: 'Samsin as layout hero — white hair, blue-and-red hanbok, blush-pink plane, tiny household silhouettes',
		prompt:
			'Anime-painterly graphic still: Samsin layout hero, pink #e8b4c8 plane, blue-red chima. No room clutter. No text.',
		refs: ['/ch_samsin.png']
	})
)
	added.push('samsin-life-office');

const jumong = findEntry('Jumong');
if (
	addSlot(jumong, {
		id: 'haemosu-sun-hero',
		ratio: 1.778,
		tone: '#f0b429',
		at: 'looks down from the sky',
		alt: 'Haemosu as layout hero under a gold sun-disk halo, bow in hand, charcoal void',
		prompt:
			'Anime-painterly graphic still: Haemosu sun god layout hero, gold #f0b429 sun disk, no clouds. No text.',
		refs: ['/ch_haemosu.png', '/ch_yuhwa.png']
	})
)
	added.push('haemosu-sun-hero');

const daeya = findEntry('Daeya Fortress');
if (
	addSlot(daeya, {
		id: 'golhwa-steam-emblem',
		ratio: 1.778,
		tone: '#e86820',
		at: 'as if the mist owed her heat',
		alt: 'Golhwa as layout hero on a dark rock, ember-orange plane, steam as a flat cyan field',
		prompt:
			'Anime-painterly graphic still: Golhwa layout hero, orange #e86820, flat cyan steam plane, fully clothed. No text.',
		refs: ['/ch_golhwa.png']
	})
)
	added.push('golhwa-steam-emblem');

const gaya = findEntry('Gaya, the Lost Nations');
if (
	addSlot(gaya, {
		id: 'ibiga-sky-hero',
		ratio: 1.778,
		tone: '#1e4d9c',
		at: 'Before the sons, there is a night',
		alt: 'Ibiga as layout hero on a single black ridge-line, deep-blue sky-disk, flat indigo void',
		prompt:
			'Anime-painterly graphic still: Ibiga sky god layout hero, blue #1e4d9c, flat indigo, no clouds. No text.',
		refs: ['/ch_ibiga.png', '/ch_rightview.png']
	})
)
	added.push('ibiga-sky-hero');

const stars = findEntry('Big Star and Little Star');
if (
	addSlot(stars, {
		id: 'heavenearth-dual',
		ratio: 1.778,
		tone: '#C30000',
		at: 'There was Heaven–Earth King',
		alt: 'Heaven–Earth King on the seam of a hard red plane and a hard blue plane, twins tiny at his feet',
		prompt:
			'Anime-painterly graphic still: Heaven–Earth King dual red #C30000 / blue #3E79E4 planes. No clouds. No text.',
		refs: ['/ch_heaven_earth_king.png', '/ch_big_star.png', '/ch_little_star.png']
	})
)
	added.push('heavenearth-dual');
if (
	addSlot(stars, {
		id: 'daebyeol-dark-court',
		ratio: 1.778,
		tone: '#3B6FBF',
		at: 'From here — you two',
		alt: 'Big Star as layout hero, steel-blue halo, tiny underworld clerks in a bowing circle',
		prompt:
			'Anime-painterly graphic still: Daebyeol layout hero, blue #3B6FBF, flat underworld void. No clouds. No text.',
		refs: ['/ch_big_star.png', '/ch_yumla.png', '/ch_kangrim.png']
	})
)
	added.push('daebyeol-dark-court');
if (
	addSlot(stars, {
		id: 'sobyeol-living-heat',
		ratio: 1.778,
		tone: '#C94040',
		at: 'why the living world is so badly governed',
		alt: 'Little Star as layout hero under a red living-heat disk, tiny life-gods at his feet',
		prompt:
			'Anime-painterly graphic still: Sobyeol layout hero, red #C94040, no clouds. No text.',
		refs: ['/ch_little_star.png', '/ch_haemosu.png', '/ch_samsin.png']
	})
)
	added.push('sobyeol-living-heat');

const yushin = findEntry('Kim Yushin');
if (
	addSlot(yushin, {
		id: 'yushin-moon-marshal',
		ratio: 1.778,
		tone: '#2A5FB8',
		at: 'Kim Yushin is the Greatest Blade',
		alt: 'Yushin as layout hero under a silver crescent-moon halo, Hwarang bowing in a circle, hwarang-blue rim',
		prompt:
			'Anime-painterly graphic still: Yushin marshal under crescent moon, blue #2A5FB8, bowing Hwarang. No clouds. No text.',
		refs: ['/ch_kim_yushin.png']
	})
)
	added.push('yushin-moon-marshal');

const bidam = findEntry('Bidam’s Rebellion');
if (
	addSlot(bidam, {
		id: 'bidam-second-blade',
		ratio: 1.778,
		tone: '#141C2E',
		at: 'Second Blade of Samhan — and',
		alt: 'Bidam as layout hero on a geometric rampart, near-black blue night plane, rebel silhouettes below',
		prompt:
			'Anime-painterly graphic still: Bidam layout hero, near-black #141C2E, no army clutter. No text.',
		refs: ['/ch_bidam.png']
	})
)
	added.push('bidam-second-blade');

const west = findEntry('Emperor of the West');
if (
	addSlot(west, {
		id: 'taizong-son-of-heaven',
		ratio: 1.778,
		tone: '#c97a2e',
		at: 'The Heaven-Sent General',
		alt: 'Taizong as layout hero in imperial yellow light, crimson wall-plane, tiny magenta envoy kowtowing',
		prompt:
			'Anime-painterly graphic still: Taizong yellow #c97a2e hero, court blocking, no palace clutter. No text.',
		refs: ['/ch_taizong.png', '/ch_chunchu.png']
	})
)
	added.push('taizong-son-of-heaven');

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`added ${added.length} slots: ${added.join(', ')}`);
