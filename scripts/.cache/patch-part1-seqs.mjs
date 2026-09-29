import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function entry(title) {
	for (const ch of story) {
		const en = ch.entries?.find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(title);
}

function insertAfter(en, afterId, slots) {
	const i = en.images.findIndex((im) => im.id === afterId);
	if (i < 0) throw new Error(afterId);
	const exist = new Set(en.images.map((im) => im.id));
	const add = slots.filter((s) => !exist.has(s.id));
	en.images.splice(i + 1, 0, ...add);
	return add.map((s) => s.id);
}

const sunduk = entry('Queen Sunduk');
const clans = entry('The Eight Great Clans');
const summit = entry('The Summit');

const a = insertAfter(sunduk, 'sunduk-seq-bupmin-hill', [
	{
		id: 'family-seq-ride-wide',
		ratio: 1.778,
		tone: '#D8258C',
		at: 'Gotaso sits in front of him on the same horse',
		alt: 'Bird’s-eye: Chunchu and Gotaso on one horse, Bupmin following on another, Eastern Palace road as a pale ribbon',
		refs: ['/pl_eastern_palace.png', '/ch_chunchu_hwarang.png', '/ch_gotaso.png', '/ch_kim_bupmin.png'],
		people: ['chunchu', 'gotaso', 'munmu']
	},
	{
		id: 'family-seq-ride-close',
		ratio: 1.778,
		tone: '#D8258C',
		at: "That's a lawyer's horse, son.",
		alt: 'Dutch close: Chunchu laughing, Gotaso gripping the mane; travel coats, not court silk',
		refs: ['/ch_chunchu_hwarang.png', '/ch_gotaso.png'],
		people: ['chunchu', 'gotaso']
	},
	{
		id: 'moon-seq-hall-bird',
		ratio: 1.778,
		tone: '#E8552B',
		at: 'becomes the first Queen of Silla',
		alt: 'Bird’s-eye inside Moon Palace: empty timber hall, two colonnade planes, one vacant axis',
		refs: ['/pl_moon_palace.png'],
		people: []
	},
	{
		id: 'sunduk-seq-coronation-sym',
		ratio: 1.778,
		tone: '#E8552B',
		at: 'the Blue Moon of the Divine Country',
		alt: 'Symmetrical worm’s-eye: Queen Sunduk on the hall axis, vermilion silk, gold comb-crown, empty Moon Palace',
		refs: ['/pl_moon_palace.png', '/ch_sunduk.png', '/bn_sunduk.png'],
		people: ['sunduk']
	}
]);

const b = insertAfter(clans, 'gyebek-white-river', [
	{
		id: 'sabi-seq-hall-bird',
		ratio: 1.778,
		tone: '#FFCB51',
		at: 'Sabi from the White River',
		alt: 'Bird’s-eye inside Sabi palace: yellow timber, empty floor, one pagoda-light shaft',
		refs: ['/pl_sabi_palace.png']
	},
	{
		id: 'euija-seq-disguise-yard',
		ratio: 1.778,
		tone: '#e08a2e',
		at: 'Euija sneaks out of the palace',
		alt: 'Young Euija in commoner hemp, no beard, slipping a Sabi side yard — amber #e08a2e rim',
		refs: ['/ch_buyeo_euija.png', '/pl_sabi_palace.png'],
		people: ['euija']
	},
	{
		id: 'gyebek-seq-dive-wide',
		ratio: 1.778,
		tone: '#d9b13a',
		at: 'The boy is going back into the water',
		alt: 'Dutch wide White River: a tiny white-hanbok figure diving; empty water plane',
		refs: ['/pl_white_river.png', '/ch_gyebek.png'],
		people: ['gyebek']
	},
	{
		id: 'gyebek-seq-surface',
		ratio: 1.778,
		tone: '#d9b13a',
		at: 'Nineteen',
		alt: 'Dutch close: soaked Gyebek surfacing, white jeogori, short-medium hair, gasping; young Euija appalled on the bank',
		refs: ['/ch_gyebek.png', '/ch_buyeo_euija.png', '/pl_white_river.png'],
		people: ['gyebek', 'euija']
	},
	{
		id: 'gyebek-seq-name',
		ratio: 1.778,
		tone: '#e08a2e',
		at: 'How about — <Gyebek>?',
		alt: 'Two-shot bank: young clean-shaven Euija in hemp naming the soaked boy Gyebek — impressed and appalled',
		refs: ['/ch_buyeo_euija.png', '/ch_gyebek.png', '/pl_white_river.png'],
		people: ['euija', 'gyebek']
	},
	{
		id: 'gyebek-fb-burn',
		ratio: 1.778,
		tone: '#d9b13a',
		at: 'Silk burns faster than timber',
		alt: 'Iconic night: one burning house as an orange plane; tiny running child in noble silk',
		refs: ['/ch_gyebek.png'],
		people: ['gyebek']
	},
	{
		id: 'gyebek-fb-run',
		ratio: 1.778,
		tone: '#d9b13a',
		at: 'not say the name',
		alt: 'Dutch: boy in torn noble clothes running an empty Sabi alley, name swallowed into a sleeve',
		refs: ['/ch_gyebek.png'],
		people: ['gyebek']
	},
	{
		id: 'gyebek-fb-beg',
		ratio: 1.778,
		tone: '#d9b13a',
		at: 'The noble collar is dirty enough',
		alt: 'Lower-third: the same boy begging, dirty noble collar, empty packed-earth street',
		refs: ['/ch_gyebek.png'],
		people: ['gyebek']
	}
]);

const c = insertAfter(summit, 'sunset-rider', [
	{
		id: 'gesomun-seq-pyongyang-wide',
		ratio: 1.778,
		tone: '#C30000',
		at: 'He rides in at the red two-tier gate',
		alt: 'Bird’s-eye: Gesomun a tiny red-wing rider at Pyongyang’s red two-tier munru; empty stone ring',
		refs: ['/pl_pyongyang_fortress.png', '/ch_yeon_gesomun.png'],
		people: ['gesomun']
	},
	{
		id: 'gesomun-seq-pyongyang-gate',
		ratio: 1.778,
		tone: '#d0362f',
		at: 'Pyongyang already knows the sound of those hooves',
		alt: 'Worm’s-eye dutch: Gesomun mid-gallop under the red munru, grimace, red-wing cloth on grey steel',
		refs: ['/pl_pyongyang_fortress.png', '/ch_yeon_gesomun.png'],
		people: ['gesomun']
	},
	{
		id: 'pyongyang-seq-hall-bird',
		ratio: 1.778,
		tone: '#C30000',
		at: 'High Summit',
		alt: 'Bird’s-eye inside a Goguryeo hall: empty timber, one red plane, tiny figure on the axis',
		refs: ['/pl_pyongyang_fortress.png'],
		people: []
	}
]);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log([...a, ...b, ...c].join(', '));
