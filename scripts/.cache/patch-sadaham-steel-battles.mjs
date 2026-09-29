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

function text(b) {
	if (!b) return '';
	if (typeof b.html === 'string') return b.html;
	if (b.kind === 'dialogue') return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
	return `${b.html ?? ''} ${b.ko ?? ''}`;
}

function slot(o) {
	return { ratio: 1.778, nsfw: false, ...o };
}

function insertSlots(entry, extras, afterId) {
	const have = new Set((entry.images ?? []).map((im) => im.id));
	const add = extras.filter((s) => !have.has(s.id));
	if (!add.length) return add;
	const after = afterId ? entry.images.findIndex((im) => im.id === afterId) : -1;
	entry.images.splice(after < 0 ? entry.images.length : after + 1, 0, ...add);
	return add;
}

function upsertPrompt(entry, id, patch) {
	const im = (entry.images ?? []).find((x) => x.id === id);
	if (!im) return;
	Object.assign(im, patch);
}

const HOUSE =
	'Painterly anime-adjacent cinema, not photoreal. FACE ONLY from attached portrait — new dramatic body, never a standing clone. HIGH CONTRAST tenebrism, one hard key, crushed black. ONE named geometric device. BATTLE ARMOR: metallic GRAY steel lamellar; cloth peeks in character hex. No army. No text. No watermark.';

const gayaFall = findEntry('The Fall of Gaya');
const flower = findEntry('The Flower Youth');
const betray = findEntry('Jinheung’s Betrayal');
const hwang = findEntry('Yellow Mountain Fields');
const massacre = findEntry('Yeon’s Massacre');
const ansi = findEntry('Ansi');

const moon = gayaFall.blocks.findIndex((b) => text(b).includes('conquers Gaya in the year 562'));
if (moon >= 0 && !gayaFall.blocks.some((b) => text(b).includes('The gate didn'))) {
	gayaFall.blocks.splice(
		moon + 1,
		0,
		{
			kind: 'dialogue',
			person: 'sadaham',
			chip: '#6fa8ff',
			en: ['They said too young.', 'The gate didn’t.'],
			lines: ['너무 어리다고 했다.', '문은 안 그랬다.']
		},
		{
			kind: 'dialogue',
			person: 'mugwan',
			chip: '#7aa0c8',
			en: ['Don’t die first.'],
			lines: ['먼저 죽지 마.']
		},
		{
			kind: 'dialogue',
			person: 'sadaham',
			chip: '#6fa8ff',
			en: ['Then keep up.'],
			lines: ['그럼 따라와.']
		},
		{
			kind: 'p',
			html: 'The vanguard thought otherwise. After the city fell he opened the prize-cages and kept only Alcheon dirt. <b>Take the land. Leave the people.</b>',
			ko: '선봉은 그렇지 않았다. 성이 떨어진 뒤 상으로 받은 우리를 열고 알천의 박토만 받았다. <b>땅은 가져라. 사람은 놔둬라.</b>'
		},
		{
			kind: 'dialogue',
			person: 'sadaham',
			chip: '#6fa8ff',
			en: ['Alcheon dirt.', 'That’s enough.'],
			lines: ['알천 흙이다.', '그거면 된다.']
		}
	);
}

insertSlots(
	gayaFall,
	[
		slot({
			id: 'gaya-seq-fortress-night',
			tone: '#8B5CF6',
			at: 'For five hundred years the people of Gaya lived by iron',
			alt: 'Night wide: Gaya mountain seongmun, stone and giwa, one purple iron-spark accent, tiny figures',
			refs: ['/pl_daeya_fortress.png'],
			people: [],
			prompt: ''
		}),
		slot({
			id: 'sadaham-seq-vanguard',
			tone: '#6fa8ff',
			at: 'They said too young.',
			alt: 'Dutch charge: fifteen-year-old Sadaham in steel lamellar, ice-blue cloth peek, Silla pointed helm',
			refs: ['/ch_sadaham.png', '/ar_lamellar_steel.png', '/ar_silla_gaya.jpg'],
			people: ['sadaham'],
			prompt: ''
		}),
		slot({
			id: 'sadaham-seq-gate',
			tone: '#6fa8ff',
			at: 'The gate didn’t.',
			alt: 'Worm’s-eye: Sadaham at Gaya timber seongmun doors, steel plates, ice-blue sash',
			refs: ['/ch_sadaham.png', '/ar_lamellar_steel.png', '/ar_silla_gaya.jpg', '/pl_daeya_fortress.png'],
			people: ['sadaham'],
			prompt: ''
		}),
		slot({
			id: 'sadaham-seq-free',
			tone: '#6fa8ff',
			at: 'Take the land. Leave the people.',
			alt: 'Lower-third: Sadaham opening prize-cages in an empty night yard, ice-blue rim',
			refs: ['/ch_sadaham.png', '/ar_lamellar_steel.png'],
			people: ['sadaham'],
			prompt: ''
		})
	],
	'gaya-surrender'
);

insertSlots(
	flower,
	[
		slot({
			id: 'sadaham-seq-mugwan-vow',
			tone: '#6fa8ff',
			at: 'If you die first, I will not eat.',
			alt: 'Two-shot under Hwarang eaves: Sadaham and Mugwan wrist-lock vow, ice-blue vs dusty rose',
			refs: ['/ch_sadaham.png', '/ch_mugwan.png'],
			people: ['sadaham', 'mugwan'],
			prompt: ''
		}),
		slot({
			id: 'sadaham-seq-seven-close',
			tone: '#6fa8ff',
			at: 'Sadaham did not take food for seven days',
			alt: 'ECU: Sadaham seventeen, wrecked, empty bowl sharp in the foreground',
			refs: ['/ch_sadaham.png', '/ch_mugwan.png'],
			people: ['sadaham', 'mugwan'],
			prompt: ''
		})
	],
	'sadaham-gaya-road'
);

upsertPrompt(gayaFall, 'muryuk-seq-cone-fight', {
	refs: ['/ch_kim_muryuk.png', '/ar_lamellar_steel.png', '/ar_silla_gaya.jpg'],
	alt: 'Worm’s-eye: Muryuk last fight, steel lamellar, tall Gaya cone, purple cloth peek, snarl'
});
upsertPrompt(betray, 'muryuk-seq-ridge', {
	refs: ['/ch_kim_muryuk.png', '/ar_lamellar_steel.png', '/ar_silla_gaya.jpg'],
	alt: 'Dutch night ridge: Muryuk mid-stride, steel plates, tall Gaya cone, purple rim, grimace'
});
upsertPrompt(hwang, 'gyebek-seq-palisade', {
	refs: ['/ch_gyebek.png', '/ar_lamellar_steel.png', '/ar_kingdoms_diagram.jpg', '/pl_yellow_mountain.png'],
	alt: 'Worm’s-eye dusk: Gyebek shouting at the palisade, steel lamellar, yellow cloth peek, red sash'
});
upsertPrompt(hwang, 'yushin-seq-gallop', {
	refs: ['/ch_kim_yushin.png', '/ar_lamellar_steel.png', '/ar_silla_gaya.jpg', '/pl_yellow_mountain.png'],
	alt: 'Dutch low gallop: Yushin, steel lamellar, tall Silla helm, Confucian-blue cloth peek, battle snarl'
});
upsertPrompt(hwang, 'hwangsan-seq-clash', {
	refs: [
		'/ch_kim_yushin.png',
		'/ch_gyebek.png',
		'/ar_lamellar_steel.png',
		'/ar_silla_gaya.jpg',
		'/ar_kingdoms_diagram.jpg'
	],
	alt: 'OTS clash: steel vs steel, blue cloth vs yellow cloth, two grimaces, crushed dusk'
});
upsertPrompt(massacre, 'gesomun-seq-wings', {
	refs: ['/ch_yeon_gesomun.png', '/ar_lamellar_steel.png', '/ar_silla_goguryeo.jpg', '/pl_pyongyang_fortress.png'],
	alt: 'Worm’s-eye doorway: Gesomun filling the frame, steel lamellar, red-wing cloth, shout'
});
upsertPrompt(ansi, 'yangmanchun-seq-wings', {
	refs: ['/ch_guardian.png', '/ar_lamellar_steel.png', '/ar_silla_goguryeo.jpg', '/pl_ansi.png'],
	alt: 'Worm’s-eye parapet: Yang Manchun, steel plates, red-wing accent, wind-snarl'
});

void HOUSE;

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched sadaham + steel battle slots');
