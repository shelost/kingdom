import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function entries() {
	const out = [];
	for (const ch of story) for (const en of ch.entries ?? []) out.push(en);
	return out;
}

function findEntry(title) {
	const en = entries().find((e) => e.title === title);
	if (!en) throw new Error(`missing ${title}`);
	return en;
}

function byId(images, id) {
	const im = images.find((x) => x.id === id);
	if (!im) throw new Error(`missing slot ${id}`);
	return im;
}

const REMOVE = new Set([
	'steam-cavern-intimacy',
	'lovers-parting-war',
	'emotional-closeness-comfort'
]);

const daeya = findEntry('Daeya Fortress');
daeya.images = daeya.images.filter((im) => !REMOVE.has(im.id));

const yushinNude =
	'Adult Kim Yushin NAKED from the waist up — waterline at the navel, no robe, no sash on the chest. MUSCULAR, slightly dark / tanned wet skin, defined shoulders and chest. Face matches the attached Yushin portrait: full black beard and mustache, high ponytail with a Confucian-blue #2A5FB8 ribbon. WAIST-UP CROP ONLY — no genitals, no hips below the waterline. Cyan steam cavern matching the attached cave. Painterly anime-adjacent. Adult/mature. No text. No watermark.';

const chunchuNude =
	'Adult Kim Chunchu NAKED from the waist up — waterline at the navel. PALE wet skin, regular scholar physique, not a warrior body, soft chest, no heavy muscle. Face matches the attached Chunchu portrait: shoulder-length dark hair with a side sweep, light stubble. WAIST-UP CROP ONLY — no genitals. Cyan steam cavern matching the attached cave. Magenta #D8258C silk only as a discarded robe at the water edge. Painterly anime-adjacent. Adult/mature. No text. No watermark.';

const cave = '/pl_cave.png';
const y = '/ch_kim_yushin.png';
const c = '/ch_chunchu.png';
const n = '/ch_narim.png';
const g = '/ch_golhwa.png';
const h = '/ch_hyullé.png';

Object.assign(byId(daeya.images, 'steam_01'), {
	refs: [y, cave],
	prompt: `Cinematic still, 16:9. Steam cavern arrival. ${yushinNude} He stands at the rock lip, already stripped, steam rising. No army. No clouds.`
});

Object.assign(byId(daeya.images, 'steam_02'), {
	refs: [n, g, h, cave],
	prompt:
		'Cinematic still, 16:9. Three steam-cavern sisters on a far wet rock: Narim olive chima, Golhwa orange-red, Hyullé pale blue, white wet jeogori. Faces match attached portraits, glowing eyes. Painterly. Cyan cavern matching the attached cave. No men. No text. No watermark.'
});

Object.assign(byId(daeya.images, 'steam_03'), {
	nsfw: true,
	refs: [y, n, cave],
	alt: 'Narim close in steam with naked waist-up Yushin — muscular, slightly dark, water at the navel',
	prompt: `Intimate cinematic still, 16:9. ${yushinNude} Painterly Narim in wet olive silk leans in, face matches attached portrait. Faces and bare chest only. No text. No watermark.`
});

Object.assign(byId(daeya.images, 'steam_04'), {
	nsfw: true,
	refs: [y, n, g, h, cave],
	alt: 'Caught in steam — naked waist-up muscular Yushin, three sisters tearing the mist',
	prompt: `Intimate cinematic still, 16:9. ${yushinNude} Narim, Golhwa, and Hyullé in wet silk, faces match attached portraits. No text. No watermark.`
});

Object.assign(byId(daeya.images, 'yushin-lake-goddess-lust'), {
	nsfw: true,
	refs: [y, n, g, h, cave],
	alt: 'Yushin’s naked muscular tanned back fills the steam — waist-up, waterline at the navel',
	prompt: `Intimate cinematic CLOSE-UP, 16:9. From behind. ${yushinNude} Three goddesses only at the edges in wet silk. Camera on his wet muscle. No cloth at the hip. No text. No watermark.`
});

Object.assign(byId(daeya.images, 'best_of_both_02'), {
	nsfw: true,
	refs: [y, n, g, h, cave],
	alt: 'Naked waist-up Yushin in the sisters’ steam — muscular, slightly dark, counsel without a fortress',
	prompt: `Intimate cinematic still, 16:9. ${yushinNude} Three painterly sisters in wet silk. No text. No watermark.`
});

Object.assign(byId(daeya.images, 'best_of_both_03'), {
	nsfw: true,
	refs: [y, n, g, h, cave],
	alt: 'Naked waist-up Yushin meditating in shallow cave water, looking out the mouth — muscular, slightly dark',
	prompt: `Intimate cinematic still, 16:9. ${yushinNude} He sits in shallow water facing the bright cave mouth. Faint sisters in mist behind. No text. No watermark.`
});

Object.assign(byId(daeya.images, 'marshal_steam_01'), {
	refs: [c, cave],
	prompt:
		'Cinematic still, 16:9. Pale scholar-prince Kim Chunchu at the cave mouth, still clothed in magenta #D8258C, shaving by lantern before he strips. Face matches attached portrait. Warm cyan steam from the cave. Painterly. No text. No watermark.'
});

Object.assign(byId(daeya.images, 'marshal_steam_02'), {
	nsfw: true,
	refs: [c, n, g, h, cave],
	alt: 'Sisters pull pale regular-physique Chunchu into the pool — naked from the waist up, startled',
	prompt: `Intimate cinematic still, 16:9. ${chunchuNude} Three sisters in wet silk pull him in, laughing. Faces match attached portraits. He is startled. No magenta robe on his chest. No text. No watermark.`
});

Object.assign(byId(daeya.images, 'marshal_steam_03'), {
	nsfw: true,
	refs: [c, n, h, cave],
	alt: 'Pre-dawn: pale Chunchu still bare-chested at the pool, tying magenta silk — regular physique, waist-up',
	prompt: `Intimate cinematic still, 16:9. ${chunchuNude} He is tying a magenta #D8258C robe around his waist, chest still bare. One sister watches the path. No text. No watermark.`
});

Object.assign(byId(daeya.images, 'steam_again_01'), {
	refs: [y, cave],
	prompt:
		'Cinematic still, 16:9. Exhausted Kim Yushin in armor on a night road toward a glowing cave mouth. Face matches attached portrait. Not yet stripped. Painterly. Flat sky, no clouds. No text. No watermark.'
});

Object.assign(byId(daeya.images, 'steam_again_02'), {
	nsfw: true,
	refs: [y, n, h, cave],
	alt: 'Naked waist-up grieving Yushin in the pool — muscular, slightly dark — Narim warning, Hyullé on the ledge',
	prompt: `Intimate cinematic still, 16:9. ${yushinNude} Painterly Narim warns; Hyullé waits on a ledge. Faces match attached portraits. No text. No watermark.`
});

Object.assign(byId(daeya.images, 'steam_again_03'), {
	nsfw: true,
	refs: [y, n, g, h, cave],
	alt: 'Naked waist-up Yushin on the warm ledge — muscular, slightly dark, steam on bare shoulders',
	prompt: `Intimate cinematic still, 16:9. ${yushinNude} He sits on a warm stone ledge, head bowed, steam on bare chest. Faint sisters in mist. No text. No watermark.`
});

const yushinEntry = findEntry('Kim Yushin');
if (yushinEntry.images.some((im) => im.id === 'steam_05')) {
	Object.assign(byId(yushinEntry.images, 'steam_05'), {
		nsfw: true,
		refs: [y, n, g, h, cave],
		alt: 'Between campaigns — naked waist-up Yushin at the lip reaching for his robe, sisters watching',
		prompt: `Intimate cinematic still, 16:9. From behind. ${yushinNude} He reaches for a dark robe at the rock lip. Three sisters watch across the cyan lake. No text. No watermark.`
	});
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(
	'removed',
	[...REMOVE].join(', '),
	'| daeya steam count',
	daeya.images.filter((im) => /steam|cavern|lake-goddess|best_of_both|marshal_steam/.test(im.id)).length
);
