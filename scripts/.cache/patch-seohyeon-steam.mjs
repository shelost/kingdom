import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const PEOPLE = 'src/lib/data/image-people.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const imagePeople = JSON.parse(fs.readFileSync(PEOPLE, 'utf8'));

const seohyeon = '/ch_kim_seohyun.png';
const narim = '/ch_narim.png';
const golhwa = '/ch_golhwa.png';
const hyulle = '/ch_hyullé.png';
const cave = '/pl_cave.png';
const AT = 'the first Kim the steam loved';

const slots = [
	{
		id: 'seohyeon-cavern-wide',
		ratio: 1.778,
		tone: '#3E8EF0',
		nsfw: true,
		at: AT,
		alt: 'Wide steam cavern: tiny Seohyeon at the rock lip, three goddess specks on the far wet rock',
		prompt:
			'Minimal iconic 16:9 still. REAL Korean mountain steam-cavern — attach the cave: black water bowl, wet stone, cyan steam, timber-dark mouth. ONE geometric device: the cave-mouth as a cyan WEDGE. Tiny silky figure at the lip stripping, bright Silla-aspiring blue #3E8EF0 as the single accent. Three tiny goddess specks on the far rock — emerald, ember, cyan. Monumental emptiness. Natural cave dark, not a kingdom sky. No army. No clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
		refs: [cave, seohyeon, narim, golhwa, hyulle],
		people: ['seohyeon', 'narim', 'golhwa', 'hyulle']
	},
	{
		id: 'seohyeon-robe-falls',
		ratio: 1.778,
		tone: '#3E8EF0',
		nsfw: true,
		at: AT,
		alt: 'Seohyeon from behind at the cavern lip — bright blue robe falling, muscular back, going naked into cyan steam',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Adult Kim Seohyeon undressing at the steam-cavern lip. FROM BEHIND. ONE geometric device: falling bright-blue #3E8EF0 silk as a hard diagonal off one shoulder. Face matches the attached portrait in a nape-and-beard sliver only: dark beard, wet loose hair, NO headband, NO armor. Athletic muscular back, not a bodybuilder. Dim attached cavern, cyan steam. Waist-up. No genitals. No buttocks. Real adult proportions. Painterly anime-adjacent cinema. No text. No watermark.',
		refs: [seohyeon, cave],
		people: ['seohyeon']
	},
	{
		id: 'seohyeon-naked-enter',
		ratio: 1.778,
		tone: '#3E8EF0',
		nsfw: true,
		at: AT,
		alt: 'Naked Seohyeon walking into the steam from behind — waist-up, wet muscle, cyan curtain, no cloth left',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Adult Kim Seohyeon NAKED walking into steam. FROM BEHIND. ONE geometric device: a vertical CURTAIN of cyan steam he steps through. Face matches the attached portrait in a nape sliver: dark beard, wet loose hair, no headband, no armor, no robe. MUSCULAR wet back, waterline at the navel. WAIST-UP CROP ONLY. No genitals. No buttocks. Dim attached cavern. Bright blue #3E8EF0 only as a discarded robe on the rock at the edge. Painterly anime-adjacent. Adult/mature. No text. No watermark.',
		refs: [seohyeon, cave],
		people: ['seohyeon']
	},
	{
		id: 'goddesses-heart-stare',
		ratio: 1.778,
		tone: '#0e7490',
		nsfw: true,
		at: AT,
		alt: 'Three goddesses stare at the first Kim — heart-shaped pupils: Narim composed, Golhwa drooling, Hyullé shy behind a hand',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. THREE adult steam-cavern goddesses, faces fill the frame, staring off-camera at a naked man we do not see. ONE geometric device: a TRIPTYCH split of three faces. Heart-shaped glowing pupils in each eye color. Narim left: olive silk, jade binyeo, emerald #3d9e52 hearts, mature composed, flushed throat — trying not to look down. Golhwa center: orange-red silk, coral-flame pin, ember #e86820 hearts, mouth open, a thread of drool, leaning forward, heat first. Hyullé right: pale cyan silk, teal wave pin, cyan #2eb8c4 hearts, shy, one hand over her mouth, peeking. Faces match the attached portraits. Wet white jeogori. Dim attached cavern. Modest: no breasts, no nipples, no buttocks. No man in frame. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [narim, golhwa, hyulle, cave],
		people: ['narim', 'golhwa', 'hyulle']
	},
	{
		id: 'golhwa-drool-hearts',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: AT,
		alt: 'Golhwa fills the frame — ember heart-eyes, drooling, looking down, youngest heat first',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Golhwa the youngest steam-cavern goddess. ONE geometric device: a DIAGONAL of drool-shine on wet lip; ember #e86820 HEART-shaped pupils filling the eyes. Face matches the attached portrait: coral-flame binyeo, orange-red chima, white wet jeogori, knowing hungry smile gone slack, looking DOWN not at a face. Flushed, leaning, open mouth. Dim attached cavern, cyan mist. Modest: no breasts, no nipples, no buttocks. No man visible. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [golhwa, cave],
		people: ['golhwa']
	},
	{
		id: 'hyulle-shy-hearts',
		ratio: 1.778,
		tone: '#2eb8c4',
		nsfw: true,
		at: AT,
		alt: 'Hyullé peeking through her fingers — cyan heart-eyes, shy, secretly the one who loves him most',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Hyullé the quiet steam-cavern goddess. ONE geometric device: her HANDS as a STAMP over the lower face; cyan #2eb8c4 HEART-shaped pupils peeking above the fingers. Face matches the attached portrait: teal wave binyeo, pale blue chima, white wet jeogori, shy flush, looking despite herself. Dim attached cavern. Modest: no breasts, no nipples, no buttocks. No man visible. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [hyulle, cave],
		people: ['hyulle']
	},
	{
		id: 'narim-hunger-hearts',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: AT,
		alt: 'Narim still sitting like an eldest — emerald heart-eyes, flushed, counsel failing into hunger',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Narim the eldest steam-cavern goddess. ONE geometric device: EDGE-GAZE — she looks aside as if at counsel, but emerald #3d9e52 HEART-shaped pupils give her away. Face matches the attached portrait: jade branch binyeo, olive chima, white wet jeogori, mature, flushed throat, lips parted. Hunger second, failing. Dim attached cavern. Modest: no breasts, no nipples, no buttocks. No man visible. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [narim, cave],
		people: ['narim']
	},
	{
		id: 'seohyeon-their-gaze',
		ratio: 1.778,
		tone: '#3E8EF0',
		nsfw: true,
		at: AT,
		alt: 'His naked back fills the steam; three heart-eyed goddesses at the edge cannot look at his face',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. FROM BEHIND. Adult Kim Seohyeon NAKED, muscular wet back filling 70 percent, waterline at the navel, waist-up only. Face matches attached portrait in a nape-and-beard sliver. NO headband, NO robe. Bright blue #3E8EF0 discarded silk at the rock. Far right EDGE: three small goddess faces with glowing HEART-shaped pupils — emerald, ember, cyan — staring lower than his shoulders, mouths parted. Faces match attached portraits. Dim attached cavern. WAIST-UP. No genitals. No buttocks. Painterly anime-adjacent. No text. No watermark.',
		refs: [seohyeon, narim, golhwa, hyulle, cave],
		people: ['seohyeon', 'narim', 'golhwa', 'hyulle']
	}
];

const entry = {
	year: '???',
	title: 'The First Kim',
	tone: 'mythic steam',
	subtitle: '첫 김',
	badges: ['flag:silla'],
	music: 'The Last of the Gaya',
	flash: true,
	flashback: true,
	images: slots,
	blocks: [
		{
			kind: 'p',
			html: 'Years before the marshal. <b>Kim Seohyeon</b> finds a bowl of black water under stone and does not know it has a rule yet. The robe falls because every man who enters here is naked. Steam, surname — 김 — the same sound, waiting for a first mouth to say it.',
			ko: '원수보다 몇 해 전. <b>김서현</b>이 돌 아래 검은 물의 사발을 찾고, 아직 법이 있는 줄 모른다. 도포가 내린다. 여기는 남자라면 벗으니까. 김, 성 — 같은 소리. 첫 입이 말해주기를 기다리고 있다.'
		},
		{
			kind: 'p',
			html: 'They have never seen a Kim. They fall in love before they finish looking at his face. <b>Golhwa</b> drools. <b>Hyullé</b> hides behind her hands and looks anyway. <b>Narim</b> sits like an eldest and her eyes go to hearts with the rest.',
			ko: '김을 본 적이 없다. 얼굴 보기를 마치기 전에 사랑에 빠진다. <b>골화</b>는 침을 흘린다. <b>혈레</b>는 손 뒤에 숨으면서도 본다. <b>나림</b>은 언니처럼 앉아 있는데, 눈만 나머지를 따라 하트가 된다.'
		}
	]
};

const iron = story.find((c) => c.id === 'iron-will');
if (!iron) throw new Error('missing iron-will');
if (!iron.entries.some((e) => e.title === entry.title)) {
	iron.entries.unshift(entry);
} else {
	const i = iron.entries.findIndex((e) => e.title === entry.title);
	iron.entries[i] = entry;
}

for (const slot of slots) {
	imagePeople[slot.id] = slot.people;
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
fs.writeFileSync(PEOPLE, JSON.stringify(imagePeople, null, '\t') + '\n');
console.log(`inserted ${entry.title} with ${slots.length} slots`);
