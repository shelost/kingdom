import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const PEOPLE = 'src/lib/data/image-people.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const imagePeople = JSON.parse(fs.readFileSync(PEOPLE, 'utf8'));

function renameStrings(node) {
	if (typeof node === 'string') {
		return node.replaceAll('Yehwa', 'Maehwa').replaceAll('예화', '매화');
	}
	if (Array.isArray(node)) {
		for (let i = 0; i < node.length; i++) node[i] = renameStrings(node[i]);
		return node;
	}
	if (node && typeof node === 'object') {
		for (const [k, v] of Object.entries(node)) {
			if (k === 'id') continue;
			node[k] = renameStrings(v);
		}
	}
	return node;
}

renameStrings(story);

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

function insertAfter(entry, afterId, slots) {
	const after = entry.images.findIndex((im) => im.id === afterId);
	if (after < 0) throw new Error(`missing ${afterId} in ${entry.title}`);
	for (const slot of slots) {
		const i = entry.images.findIndex((im) => im.id === slot.id);
		if (i >= 0) Object.assign(entry.images[i], slot);
	}
	const missing = slots.filter((s) => !entry.images.some((im) => im.id === s.id));
	entry.images.splice(after + 1, 0, ...missing);
	for (const slot of slots) imagePeople[slot.id] = slot.people;
}

const pumsuk = '/ch_pumsuk.png';
const maehwa = '/ch_gumil_wife.png';
const daeya = '/pl_daeya_fortress.png';
const haemosu = '/ch_haemosu.png';
const yuhwa = '/ch_yuhwa.png';
const ibiga = '/ch_ibiga.png';
const rightview = '/ch_rightview.png';
const suro = '/ch_suro.png';
const heo = '/ch_heo.png';

insertAfter(findEntry('Daeya Fortress'), 'nsfw-pumsuk-yehwa-horndog', [
	{
		id: 'nsfw-pumsuk-heart-drool',
		ratio: 1.778,
		tone: '#7EB8F0',
		nsfw: true,
		at: 'the manners torn off',
		alt: 'Pumsuk’s ice-blue heart-pupils and a thread of drool — staring at Maehwa in the Daeya lamp-hall',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. REAL Daeya timber feast-hall: oil lamp, wooden posts, packed-earth floor. Adult Kim Pumsuk, blue crescent headband, ice-blue #7EB8F0 silk, HEART-shaped glowing pupils, a thread of DROOL at the open mouth, looking at Maehwa not at her eyes. Face matches the attached Pumsuk portrait. Maehwa a tan-skin sliver at the edge in teal-sage #8AAFA0 silk, wooden sprig pin. Faces match attached portraits. Clothed. Modest: no breasts, no nipples, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [pumsuk, maehwa, daeya],
		people: ['pumsuk', 'gumilwife']
	},
	{
		id: 'nsfw-pumsuk-lookdown-steam',
		ratio: 1.778,
		tone: '#7EB8F0',
		nsfw: true,
		at: 'the manners torn off',
		alt: 'Pumsuk looking DOWN her silk — ice-blue steam puffing from his nose, knuckles white on his cup',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. REAL Daeya lamp-hall. Adult Pumsuk looking DOWN, not at her face. ONE geometric device: a puff of ice-blue #7EB8F0 STEAM from his nose; knuckles white clutching a cup. Face matches attached portrait: crescent headband. Maehwa’s teal-sage hiked silk hip as a lower-frame plane. Faces match attached portraits. Clothed. Modest: no breasts, no nipples, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [pumsuk, maehwa, daeya],
		people: ['pumsuk', 'gumilwife']
	}
]);

insertAfter(findEntry('Jumong'), 'haemosu-stunned-close', [
	{
		id: 'nsfw-haemosu-heart-eyes',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: true,
		at: 'Those thighs',
		alt: 'Haemosu on the gold chariot rail — sun-gold heart-pupils, stunned, looking down at Yuhwa in the Amnok',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Adult Haemosu at the gold chariot rail, silver-white hair, white silk, sun-gold #f0b429 HEART-shaped pupils, mouth open, looking DOWN. Face matches the attached portrait. Far below: REAL Amnok shallows, wet stones, tiny Yuhwa in wet pale-blue #8fc4e0 silk. Natural cloudy sky. Modest: no breasts, no nipples, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [haemosu, yuhwa],
		people: ['haemosu', 'yuhwa']
	},
	{
		id: 'nsfw-haemosu-drool-shallows',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: true,
		at: 'Shall I pretend to blush',
		alt: 'Haemosu in the Amnok shallows — gold heart-eyes and drool, staring at Yuhwa’s wet silk',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. REAL Amnok shallows: wet stones, gold water, timber bank, natural sky. Adult Haemosu waist-up in the water, silver-white hair, white silk open, sun-gold HEART pupils, a thread of DROOL, looking at Yuhwa. Face matches attached Haemosu portrait. Adult Yuhwa in wet pale-blue #8fc4e0 silk, looking back, face matches attached Yuhwa portrait. Clothed wet silk. Modest: no breasts, no nipples, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [haemosu, yuhwa],
		people: ['haemosu', 'yuhwa']
	}
]);

insertAfter(findEntry('Gaya, the Lost Nations'), 'gaya-ridge-night', [
	{
		id: 'nsfw-ibiga-heart-ridge',
		ratio: 1.778,
		tone: '#1e4d9c',
		nsfw: true,
		at: 'the sky comes down to touch the mountain',
		alt: 'Ibiga on the Gaya ridge — cobalt heart-pupils, looking at the Lady of the Right View',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. REAL Korean mountain ridge at night: packed earth, dark timber, natural night sky. Adult Ibiga, jet-black hair, deep-blue #1e4d9c robe, HEART-shaped glowing cobalt pupils, looking at her. Face matches the attached Ibiga portrait. Lady of the Right View in jade-mist silk, face matches attached portrait, standing on the ridge. Ibiga may have sculptural cloud at the shoulder. Clothed. Modest: no breasts, no nipples, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [ibiga, rightview],
		people: ['ibiga', 'jeonggyeon']
	},
	{
		id: 'nsfw-ibiga-swallow-clutch',
		ratio: 1.778,
		tone: '#1e4d9c',
		nsfw: true,
		at: 'the sky comes down to touch the mountain',
		alt: 'Ibiga’s throat jumps — he swallows; knuckles white on blue silk; Right View’s ridge hip in frame',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. REAL mountain ridge, packed earth. Adult Ibiga, black hair, deep-blue robe, a visible SWALLOW at the throat, knuckles white CLUTCHING his own silk, flushed. Face matches attached portrait. ONE geometric device: the swallow as a hard shadow-stamp on the throat. Lady of the Right View a jade-silk hip sliver. Faces match attached portraits. Clothed. Modest: no breasts, no nipples, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [ibiga, rightview],
		people: ['ibiga', 'jeonggyeon']
	}
]);

insertAfter(findEntry('Gaya, the Lost Nations'), 'suro-heo-tent', [
	{
		id: 'nsfw-suro-heart-drool',
		ratio: 1.778,
		tone: '#e0a33c',
		nsfw: true,
		at: 'Two nights in a tent',
		alt: 'Suro in the lamp-tent — gold heart-pupils and drool, staring at Heo’s silk',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. REAL Gaya lamp-lit tent: timber poles, packed earth, oil lamp. Adult King Suro, gold branch crown, goatee, purple-gold silk, gold #e0a33c HEART-shaped pupils, a thread of DROOL, looking at Queen Heo. Face matches attached Suro portrait. Adult Queen Heo, gold tiger hairpins, violet silk, face matches attached Heo portrait. Clothed. Modest: no breasts, no nipples, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [suro, heo],
		people: ['suro', 'heohwangok']
	},
	{
		id: 'nsfw-suro-spark-eyes',
		ratio: 1.778,
		tone: '#e0a33c',
		nsfw: true,
		at: 'the curve of her hip catching lamp',
		alt: 'Suro’s eyes spark at the corners — flushed throat-stamp, Heo looking back in the tent lamp',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. REAL lamp-tent. Adult Suro, gold crown, SPARK-marks at the corners of the eyes, flushed throat as a hard gold STAMP. Face matches attached portrait. Looking at Queen Heo looking back, violet silk, tiger pins. Faces match attached portraits. Clothed. Modest: no breasts, no nipples, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [suro, heo],
		people: ['suro', 'heohwangok']
	}
]);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
fs.writeFileSync(PEOPLE, JSON.stringify(imagePeople, null, '\t') + '\n');
console.log('renamed Maehwa; inserted lust-device slots');
