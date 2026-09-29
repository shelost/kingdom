import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const PEOPLE = 'src/lib/data/image-people.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const imagePeople = JSON.parse(fs.readFileSync(PEOPLE, 'utf8'));

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

const samsin = '/ch_samsin.png';
const yumla = '/ch_yumla.png';
const pavilion = '/pl_three_realms_pavillion.png';
const cave = '/pl_cave.png';
const seohyeon = '/ch_kim_seohyun.png';
const yushin = '/ch_kim_yushin.png';
const narim = '/ch_narim.png';
const golhwa = '/ch_golhwa.png';
const hyulle = '/ch_hyullé.png';

const BODY =
	'elegantly plump thighs and hips — birth-goddess figure, soft S-curve, not skinny, not heavy — she is showing off';

insertAfter(findEntry('Birth of Namseng'), 'samsin-open-desire', [
	{
		id: 'nsfw-samsin-hall-lookback',
		ratio: 1.778,
		tone: '#e8b4c8',
		nsfw: true,
		at: 'I will open the breath.',
		alt: 'Samsin in a lantern Goguryeo birth-hall, looking back, hiked red chima, plump thighs, hanging portrait',
		prompt: `Intimate cinematic CLOSE-UP still, 16:9. REAL Goguryeo timber birth-chamber a camera could stand in: oil lanterns, dark posts, wooden floor, a hanging portrait rectangle. Goddess Samsin looking BACK over the shoulder, hiked red chima, ${BODY}. Face matches the attached portrait: white hair, swirl binyeo, red lipstick, cream jeogori. Blush-pink #e8b4c8. Striking silky hanbok. Dim lantern. Modest: no breasts, no nipples. ONE woman. No army. No clutter. No text. No watermark. Graphic color-blocking, anime-painterly.`,
		refs: [samsin],
		people: ['samsin']
	},
	{
		id: 'nsfw-samsin-hall-thighs',
		ratio: 1.778,
		tone: '#e8b4c8',
		nsfw: true,
		at: 'I will open the breath.',
		alt: 'Samsin seated on the birth-hall floor — plump thighs filling the lantern light, hiked silk, mature laugh',
		prompt: `Intimate cinematic CLOSE-UP still, 16:9. REAL timber birth-chamber: lantern, wooden floor, dark post. Goddess Samsin seated, one knee up, hiked red chima, ${BODY} filling the lower frame. Face matches the attached portrait. Blush-pink #e8b4c8. Striking silky hanbok. Dim lantern. Modest: no breasts, no nipples. ONE woman. No text. No watermark. Graphic color-blocking, anime-painterly.`,
		refs: [samsin],
		people: ['samsin']
	}
]);

insertAfter(findEntry('Annual Meeting of the Three Realms'), 'nsfw-samsin-kangrim-lookaway', [
	{
		id: 'nsfw-samsin-jeongja-lookback',
		ratio: 1.778,
		tone: '#e8b4c8',
		nsfw: true,
		at: 'H-hey, Samsin',
		alt: 'Samsin at the real red-pillar 정자 rail — looking back, hiked chima, plump hips, giwa eaves',
		prompt: `Intimate cinematic CLOSE-UP still, 16:9. REAL Korean wooden 정자 — attach the pavilion: red pillars, giwa tiles, timber rail, raised floor. Goddess Samsin looking BACK at the rail, hiked red chima, ${BODY}. Face matches the attached portrait. Blush-pink #e8b4c8. Striking silky hanbok. Not a flat color void. Modest: no breasts, no nipples. ONE woman. No text. No watermark. Graphic color-blocking, anime-painterly.`,
		refs: [pavilion, samsin],
		people: ['samsin']
	},
	{
		id: 'nsfw-samsin-jeongja-yumla',
		ratio: 1.778,
		tone: '#7c3aed',
		nsfw: true,
		at: 'H-hey, Samsin',
		alt: 'Samsin showing off at the 정자 rail; Yumla scarlet on the real floorboards, purple robe, cannot look at her hips',
		prompt: `Intimate cinematic CLOSE-UP still, 16:9. REAL Korean 정자: red pillars, timber floor, giwa eaves — attach the pavilion. Adult Samsin showing off, hiked red chima, ${BODY}, looking back laughing. Adult Yumla, grey beard, purple robe, face flushed scarlet, sitting on the floorboards looking at her hips not her eyes. Faces match the attached portraits. Clothed. Modest: no breasts, no nipples, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.`,
		refs: [pavilion, samsin, yumla],
		people: ['samsin', 'yumla']
	},
	{
		id: 'nsfw-samsin-jeongja-sit',
		ratio: 0.75,
		tone: '#e8b4c8',
		nsfw: true,
		at: 'H-hey, Samsin',
		alt: 'Samsin sitting wrong on the 정자 floor — plump thighs, hiked silk, red pillar behind her',
		prompt: `Intimate cinematic CLOSE-UP still, 3:4. REAL 정자 floor and one red pillar. Goddess Samsin sitting with one knee up, hiked red chima, ${BODY}. Face matches the attached portrait. Blush-pink #e8b4c8. Striking silky hanbok. Modest: no breasts, no nipples. ONE woman. No text. No watermark. Graphic color-blocking, anime-painterly.`,
		refs: [pavilion, samsin],
		people: ['samsin']
	}
]);

insertAfter(findEntry('The First Kim'), 'seohyeon-their-gaze', [
	{
		id: 'seohyeon-pool-back',
		ratio: 1.778,
		tone: '#3E8EF0',
		nsfw: true,
		at: 'the first Kim the steam loved',
		alt: 'Seohyeon waist-up in the glowing cavern pool from behind — wet muscle, cyan water, no robe',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. FROM BEHIND. Adult Kim Seohyeon in the REAL attached steam-cavern pool: glowing cyan water, wet stone. Waist-up, waterline at the navel, no robe, wet muscular back, dark beard sliver at the nape. Face matches the attached portrait. Athletic not bodybuilder. No genitals. Dim cave. Painterly anime-adjacent. No text. No watermark.',
		refs: [seohyeon, cave],
		people: ['seohyeon']
	},
	{
		id: 'golhwa-lean-firstkim',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'the first Kim the steam loved',
		alt: 'Golhwa leaning off the wet cavern rock toward Seohyeon’s back — ember flush, open mouth, cyan water',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. REAL steam cavern: wet rock, glowing cyan pool. Golhwa leaning forward off the rock, orange-red wet silk, coral-flame pin, flushed, mouth open, looking at a man’s wet back at the waterline. Face matches the attached Golhwa portrait. Seohyeon FROM BEHIND only as a nape-and-shoulder sliver, dark beard, no robe, waist-up. Faces match attached portraits. Modest: no breasts, no nipples, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [golhwa, seohyeon, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'narim-steam-seohyeon',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'the first Kim the steam loved',
		alt: 'Narim close in cavern steam — olive silk, flushed, mouths almost touching Seohyeon’s bearded profile',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. REAL steam cavern, cyan mist, wet stone. Narim in wet olive silk, jade binyeo, mature, flushed, mouths almost touching. Kim Seohyeon waist-up profile, dark beard, wet chest, no robe. Faces match the attached portraits. Close hungry almost-kiss. Modest: no breasts, no nipples, no genitals. Not a nude two-shot. Dim cave. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [narim, seohyeon, cave],
		people: ['narim', 'seohyeon']
	}
]);

insertAfter(findEntry('Daeya Fortress'), 'yushin-lake-goddess-lust', [
	{
		id: 'yushin-pool-back',
		ratio: 1.778,
		tone: '#2A5FB8',
		nsfw: true,
		at: 'He’s naked. We can be honest.',
		alt: 'Yushin waist-up in the cavern pool from behind — wet marshal back, cyan water, no robe',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. FROM BEHIND. Adult Kim Yushin in the REAL attached steam-cavern pool. Waist-up, waterline at the navel, no robe, wet muscular back. Face matches the attached manhwa portrait in a beard-and-nape sliver. Athletic not bodybuilder. Wet loose hair. NO ribbon. Dim cave. No genitals. Painterly anime-adjacent. No text. No watermark.',
		refs: [yushin, cave],
		people: ['yushin']
	},
	{
		id: 'golhwa-inspect-yushin',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'The water is not the only thing that can burn',
		alt: 'Golhwa at the cavern waterline — ember eyes, wet silk, inspecting Yushin’s back like quality control',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. REAL steam cavern, glowing cyan pool. Golhwa at the waterline, orange-red wet silk, coral-flame pin, looking down Yushin’s wet back, hungry smirk. Face matches attached Golhwa portrait. Yushin FROM BEHIND, waist-up, no robe, beard sliver. Faces match attached portraits. Modest: no breasts, no nipples, no genitals. Dim cave. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [golhwa, yushin, cave],
		people: ['golhwa', 'yushin']
	},
	{
		id: 'narim-kiss-yushin',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'I am not water',
		alt: 'Narim kissing Yushin in cavern steam — olive wet silk, his beard, the younger two already sent away',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. REAL steam cavern. Close kiss: Narim in wet olive silk, jade binyeo, mature, flushed; Kim Yushin waist-up, full beard, wet chest, no robe. Faces match the attached portraits. Mouths locked. Modest: no breasts, no nipples, no genitals. Not a nude two-shot. Dim cyan cave. He stands, he does not sit in lotus. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [narim, yushin, cave],
		people: ['narim', 'yushin']
	},
	{
		id: 'hyulle-watch-yushin',
		ratio: 1.778,
		tone: '#2eb8c4',
		nsfw: true,
		at: 'He came to rest.',
		alt: 'Hyullé on the warm cavern ledge — cyan eyes, shy flush, watching Yushin in the pool after the others look away',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. REAL steam cavern, warm stone ledge. Hyullé in pale cyan wet silk, teal wave binyeo, shy, flushed, watching off-frame. Face matches attached portrait. Far left: Yushin in the glowing pool FROM BEHIND, waist-up sliver. Modest: no breasts, no nipples, no genitals. Dim cave. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [hyulle, yushin, cave],
		people: ['hyulle', 'yushin']
	}
]);

insertAfter(findEntry('Kim Yushin'), 'steam_05', [
	{
		id: 'yushin-return-pool',
		ratio: 1.778,
		tone: '#2A5FB8',
		nsfw: true,
		at: 'Between campaigns he still goes alone to the cavern lake',
		alt: 'Between campaigns: Yushin in the cavern pool from behind, three sisters on the far wet rock',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. REAL attached steam cavern. FROM BEHIND: adult Kim Yushin waist-up in cyan pool, no robe, wet muscular back, beard nape sliver. Far rock: three small sisters in wet silk — olive, orange, cyan. Faces match attached portraits. Athletic not bodybuilder. NO ribbon. Dim cave. No genitals. Painterly anime-adjacent. No text. No watermark.',
		refs: [yushin, narim, golhwa, hyulle, cave],
		people: ['yushin', 'narim', 'golhwa', 'hyulle']
	}
]);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
fs.writeFileSync(PEOPLE, JSON.stringify(imagePeople, null, '\t') + '\n');
console.log('grounded nsfw slots inserted');
