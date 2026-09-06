// Adds missing lust-forward chronicle slots + short bilingual anchors.
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		for (const en of ch.entries ?? []) {
			if (en.title === title) return en;
		}
	}
	throw new Error(`entry not found: ${title}`);
}

function insertAfterImage(entry, afterId, slot) {
	if (entry.images.some((im) => im.id === slot.id)) return;
	const i = entry.images.findIndex((im) => im.id === afterId);
	if (i < 0) throw new Error(`image ${afterId} missing in ${entry.title}`);
	entry.images.splice(i + 1, 0, slot);
}

function insertBlockAfterHtml(blocks, needle, block) {
	const i = blocks.findIndex((b) => typeof b.html === 'string' && b.html.includes(needle));
	if (i < 0) throw new Error(`block needle missing: ${needle}`);
	if (blocks.some((b) => b.html === block.html)) return;
	blocks.splice(i + 1, 0, block);
}

function flashback(entry, title) {
	const fb = entry.blocks.find((b) => b.kind === 'flashback' && b.title === title);
	if (!fb) throw new Error(`flashback missing: ${title}`);
	return fb;
}

const slot = (partial) => ({
	ratio: 1.778,
	nsfw: true,
	...partial
});

const gaya = findEntry('Gaya, the Lost Nations');
insertBlockAfterHtml(gaya.blocks, 'Two nights in a tent by the water', {
	kind: 'p',
	html: 'When he turns to the lamp she looks at the width of his back — muscle under purple-gold silk, a king’s body that the court never sees — and does not hide how that look sits on her mouth.',
	ko: '그가 등잔 쪽으로 돌아설 때, 그는 그 등의 너비를 본다 — 자줏빛 금사 아래의 근육, 조정이 보지 못하는 왕의 몸 — 그리고 그 시선이 제 입에 앉는 것을 숨기지 않는다.'
});
insertAfterImage(
	gaya,
	'suro-heo-tent',
	slot({
		id: 'heo-suro-back-lust',
		tone: '#7f1d1d',
		at: 'the width of his back',
		alt: 'Queen Heo flushed and lustful in the corner of the frame, eyes on King Suro’s muscular back filling the tent lamplight',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. UNIQUE LAYOUT: corner crop. Adult Queen Heo Hwangok (Indian South Asian, darker brown skin, navy-black hair, gold tiger-head hairpins, violet silk off one shoulder) occupies the lower-left corner — flushed cheeks, parted lips, hungry eye contact on his body, visibly turned on. Adult King Suro’s muscular back fills most of the frame: tan Korean skin, trapezius and wet-gold lamplight, purple-gold robe fallen to the waist, gold branch crown just in the upper edge. Painterly anime-adjacent cinema, not photoreal, not cartoon. Personal tent, skin-forward, not a vast hall, not tiny black silhouettes. No text, no watermark.',
		refs: ['/ch_heo.png', '/ch_suro.png']
	})
);

const jumong = findEntry('Jumong');
insertBlockAfterHtml(jumong.blocks, 'forgets to finish counting', {
	kind: 'p',
	html: 'She turns her face as if going back to the grain, proud, and still she stares at the line of his back. Heat climbs her throat. She hides it in the counting-voice, and the voice does not quite hold.',
	ko: '곡식을 세러 돌아가는 척 얼굴을 돌린다. 자존심이다. 그런데도 그의 등 선을 본다. 열이 목으로 오른다. 세는 목소리 안에 숨긴다. 목소리는 끝까지 버티지 못한다.'
});
insertAfterImage(
	jumong,
	'sosuno-shy-heat',
	slot({
		id: 'sosuno-hide-back',
		tone: '#e8a04a',
		at: 'the line of his back',
		alt: 'Proud Sosuno hiding a flush behind her hand, staring at Jumong’s muscular back filling the grain-hall frame',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. UNIQUE LAYOUT: vertical split. Left third: adult Sosuno (long black hair, red ribbon, dusty-rose tunic) hiding arousal — hand half over her mouth, averted proud chin, flushed cheek, eyes still locked on him. Right two-thirds: adult Jumong’s muscular back filling the frame, red robe open, red headband, wet morning light on trapezius and shoulder. She tries to hide it because she is proud. Painterly anime-adjacent cinema, not photoreal, not cartoon. Personal, skin-forward, not a vast valley, not tiny silhouettes. No text, no watermark.',
		refs: ['/ch_sosuno.png', '/ch_jumong.png']
	})
);

const gotaso = findEntry('Gotaso’s Wedding');
const howTheyMet = flashback(gotaso, 'how they met');
insertBlockAfterHtml(howTheyMet.blocks, 'needing nothing sewn', {
	kind: 'p',
	html: 'On a later visit she stands behind him, needle forgotten, staring at the breadth of his shoulders as if the coat were only an excuse to keep looking. Magenta silk has slipped. She does not tell him to cover it.',
	ko: '나중의 방문에서 그는 그의 뒤에 선다. 바늘은 잊혀 있다. 어깨의 넓이를 본다. 옷은 계속 보기 위한 핑계일 뿐인 것처럼. 자홍색 비단이 미끄러져 있다. 가리라고 말하지 않는다.'
});
insertAfterImage(
	gotaso,
	'munhee-sewing-later',
	slot({
		id: 'munhee-chunchu-back',
		tone: '#D8258C',
		at: 'the breadth of his shoulders',
		alt: 'Munhee flushed and lustful behind Chunchu, eyes on his muscular back, magenta robe open, sewing forgotten',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. UNIQUE LAYOUT: low strip. Adult Kim Chunchu’s muscular back fills the upper frame — magenta Hwarang robe open, pale skin, shoulder blades, #D8258C silk. Below: young adult Munhee (pink silk, #E07FA8) looking up, flushed, parted lips, needle idle in her fingers, visibly turned on by his body. Painterly anime-adjacent cinema, not photoreal, not cartoon. Personal sewing-room, skin-forward, not a vast court, not tiny silhouettes. No text, no watermark.',
		refs: ['/ch_munhee.png', '/ch_chunchu_hwarang.png', '/pl_eastern_palace.png']
	})
);
insertBlockAfterHtml(gotaso.blocks, 'so she looks at all of it', {
	kind: 'p',
	html: 'Color rises along her throat. She keeps her mouth closed so the breath will not give her away. He does not turn. That is the only mercy left in the room.',
	ko: '빛이 목선을 따라 오른다. 숨이 자기를 팔지 못하게 입을 다문다. 그는 돌아보지 않는다. 그 방에 남은 유일한 자비다.'
});
insertAfterImage(
	gotaso,
	'sunduk-regret-love',
	slot({
		id: 'sunduk-yushin-flush',
		tone: '#2A5FB8',
		at: 'Color rises along her throat',
		alt: 'Queen Sunduk flushed, parted lips, eyes on Marshal Yushin’s neck and back — readable lust, still a queen',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. UNIQUE LAYOUT: corner crop. Queen Sunduk / Dukman (vermilion-blue royal silk, adult) fills the lower-right corner: flushed throat, parted lips, lowered lashes, breath held, readable lust that stays queenly, not crude. Marshal Kim Yushin’s neck and muscular shoulder fill the rest of the frame — Confucian blue #2A5FB8 coat, he stands, clean martial back, he does not look at her yet. Painterly anime-adjacent cinema, not photoreal, not cartoon. Empty wedding hall as soft bokeh only. Personal, skin-forward, not a vast empty hall of tiny figures, not silhouettes. No lotus, no beads. No text, no watermark.',
		refs: ['/ch_dukman.png', '/ch_sunduk.png', '/ch_kim_yushin.png', '/pl_eastern_palace.png']
	})
);

const daeya = findEntry('Daeya Fortress');
insertAfterImage(
	daeya,
	'golhwa-wink',
	slot({
		id: 'yushin-lake-goddess-lust',
		tone: '#0e7490',
		at: 'He’s naked. We can be honest.',
		alt: 'Topless Yushin’s wet muscular back filling the steam; Golhwa, Narim, and Hyullé flushed and lustful, wet silk, eyes on his body',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. UNIQUE LAYOUT: worm’s-eye from the waterline. Adult Kim Yushin is the muscular-back hero: topless solo, wet trapezius filling most of the frame, Confucian marshal, clean-shaven, blue-ribbon topknot, #2A5FB8 wet cloth at the hip only, standing in a cyan steam cavern lake. Three adult water-spirit goddesses clustered at the edges in wet silk off the shoulder — Narim olive-green, Golhwa orange-red, Hyullé pale blue — flushed, parted lips, glowing eyes on his body, visibly turned on and lustful. Painterly anime-adjacent cinema, goddesses more numinous. Personal, skin-forward, not a vast empty cavern of tiny figures, not black silhouettes. No lotus. No readable text, no watermark.',
		refs: [
			'/ch_kim_yushin.png',
			'/ch_golhwa.png',
			'/ch_narim.png',
			'/ch_hyullé.png',
			'/pl_cave.png'
		]
	})
);
insertAfterImage(
	daeya,
	'pumsuk-lust-desire',
	slot({
		id: 'yehwa-daeya-stares',
		tone: '#9a7b5f',
		at: 'every eye in it finds first',
		alt: 'Daeya fortress as a hard stone plane; tiny men staring; Yehwa the one warm accent for her figure',
		prompt:
			'Minimal vast epic cinematic still, 16:9. UNIQUE LAYOUT: high worm’s-eye of a fortress courtyard. Hard color planes: cold grey stone wall, white haze, wet black floor. Tiny figures only — a crowd of tiny men all facing one way. ONE symbolic accent: a single teal-and-warm woman-shape (Yehwa) whose figure is the only warm color in the frame. No faces readable, no anime close-ups, no intimate skin, no blending with close portraits. Monumental emptiness. No text, no watermark.',
		refs: ['/ch_gumil_wife.png', '/pl_daeya_fortress.png', '/ch_placeholder_m.png']
	})
);

const euijaEarly = findEntry('King Euija, the 31st Eraha');
insertAfterImage(
	euijaEarly,
	'euija-poster',
	slot({
		id: 'euija-maids-two',
		tone: '#7f1d1d',
		at: 'Two court maids attend him',
		alt: 'King Euija between two court maids in close lamplight — they fawn, flushed, competing for his attention',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. UNIQUE LAYOUT: tight three-shot, faces fill the frame. Adult King Euija (gold-yellow headband, beard, deep-red robe open on the chest) between two adult court maids in cream-yellow jeogori and mint-green chima. They are flushed, parted lips, fawning, pressed close, wet silk off the shoulder. Wine-red lamplight. Painterly anime-adjacent cinema, not photoreal, not cartoon. Personal court, not a vast palace of tiny figures, not silhouettes. No text, no watermark.',
		refs: ['/ch_buyeo_euija.png', '/ch_maid_1.png', '/ch_maid_2.png', '/pl_sabi_palace.png']
	})
);

const euijaLate = findEntry('Euija’s Descent');
insertAfterImage(
	euijaLate,
	'euija-court-maids',
	slot({
		id: 'euija-maids-compete',
		tone: '#7f1d1d',
		at: 'who is bold enough to speak',
		alt: 'A close cluster of court maids competing for Euija — flushed, fawning, more faces than before crowding the frame',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. UNIQUE LAYOUT: overlapping ribbon of faces. Five or six adult Baekje court maids crowding in, cream and mint silk, flushed, parted lips, competing for one man’s attention. Adult King Euija’s gold-yellow headband and open red robe only at the center edge. More women than a pair — a growing crowd pressed close. Painterly anime-adjacent cinema, not photoreal, not cartoon. Personal, skin-forward, not tiny figures in a huge empty palace, not silhouettes. No text, no watermark.',
		refs: [
			'/ch_buyeo_euija.png',
			'/ch_maid_1.png',
			'/ch_maid_2.png',
			'/ch_maid_3.png',
			'/pl_sabi_palace.png'
		]
	})
);
insertAfterImage(
	euijaLate,
	'euija-maids-compete',
	slot({
		id: 'euija-maids-hundreds',
		tone: '#7f1d1d',
		at: 'Nobody keeps the roll',
		alt: 'Hundreds of tiny maids in a wine-red Sabi hall; one gold-yellow headband accent for the king',
		prompt:
			'Minimal vast epic cinematic still, 16:9. UNIQUE LAYOUT: disc of tiny figures on a reflective black floor. Hard color planes: wine-red wall, white haze. Tiny figures only — a vast crowd of maids fawning in rings. ONE symbolic accent: a single gold-yellow headband spark at the center (King Euija). No faces, no anime close-ups, no intimate skin, no blending with close portraits. Monumental emptiness. No text, no watermark.',
		refs: ['/ch_buyeo_euija.png', '/pl_sabi_palace.png']
	})
);

const flower = findEntry('The Flower Youth');
insertBlockAfterHtml(flower.blocks, 'he can hear a lie drop a shoulder at fifty paces', {
	kind: 'p',
	html: 'Girls crowd the fence of the yard the way other towns crowd a market — not for the ball, for the Hwarang. They pretend they came for the verse.',
	ko: '소녀들이 연무장 울타리에 모인다. 다른 고을이 장터에 몰리듯 — 공 때문이 아니라, 화랑 때문에. 노래 들으러 왔다고 한다.'
});
insertAfterImage(
	flower,
	'bupmin-hwarang-yard',
	slot({
		id: 'hwarang-female-fans',
		tone: '#2A5FB8',
		at: 'crowd the fence of the yard',
		alt: 'Tiny female fans along a Hwarang yard fence; one Confucian-blue accent for the marshal’s line',
		prompt:
			'Minimal vast epic cinematic still, 16:9. UNIQUE LAYOUT: low fence-strip across the bottom. Hard color planes: flat Silla-blue #2A5FB8 sky (no clouds), pale dust yard. Tiny figures only — a crowd of tiny women fawning along a fence, facing tiny Hwarang youths on the field. ONE symbolic accent: a single white flower on the fence. No faces, no anime close-ups, no crescent-halo, no court kowtow, no intimate skin. Monumental emptiness. No text, no watermark.',
		refs: [
			'/ch_kim_yushin_hwarang.png',
			'/ch_chunchu_hwarang.png',
			'/ch_maid_1.png',
			'/ch_maid_2.png',
			'/pl_eastern.png'
		]
	})
);

const sunduk = findEntry('Queen Sunduk');
insertBlockAfterHtml(sunduk.blocks, 'unusually close with Princess Dukman', {
	kind: 'p',
	html: 'The capital’s daughters follow the Sword of Silla the way moths follow a lamp. He does not look at them. He looks only at the Queen, and that is the entire map of it.',
	ko: '도읍의 딸들이 신라의 도검을 따른다. 나방이 등을 따르듯. 그는 그들을 보지 않는다. 여왕만 본다. 지도는 그게 전부다.'
});
insertAfterImage(
	sunduk,
	'yushin-sword-vertical',
	slot({
		id: 'yushin-fans-sunduk-only',
		tone: '#2A5FB8',
		at: 'He looks only at the Queen',
		alt: 'Tiny women fawning toward Yushin; he and the Queen stand in one blue-white shaft, his attention only on her',
		prompt:
			'Minimal vast epic cinematic still, 16:9. UNIQUE LAYOUT: ribbon of tiny women along a dark floor, two figures isolated in one shaft. Hard color planes: Confucian blue #2A5FB8 wall, white haze. Tiny figures only — a crowd of tiny female fans leaning toward the marshal. ONE symbolic accent: a single pale shaft of light containing two tiny standing figures, the man turned wholly toward the queen, not toward the crowd. No faces, no anime close-ups, no lotus, no crescent-halo, no intimate skin. Monumental emptiness. No text, no watermark.',
		refs: [
			'/ch_kim_yushin.png',
			'/ch_dukman.png',
			'/ch_sunduk.png',
			'/ch_maid_1.png',
			'/pl_eastern_palace.png'
		]
	})
);

const west = findEntry('Emperor of the West');
insertBlockAfterHtml(west.blocks, 'resides in the Palace', {
	kind: 'p',
	html: 'The inner palace is a country of its own — so many women the hall cannot hold them all at once, silk stacked like tribute, a very large harem that moves when he moves.',
	ko: '내전은 그 자체로 나라다 — 대전이 한 번에 담지 못할 만큼 많은 여인, 공물처럼 쌓인 비단, 그가 움직이면 함께 움직이는 아주 큰 후궁.'
});
insertAfterImage(
	west,
	'taizong-portrait',
	slot({
		id: 'taizong-vast-harem',
		tone: '#b91c1c',
		at: 'The inner palace is a country',
		alt: 'Vast Tang harem as tiny figures on a crimson plane; one yellow emperor-light shaft',
		prompt:
			'Minimal vast epic cinematic still, 16:9. UNIQUE LAYOUT: forest of tiny figures receding into haze. Hard color planes: deep CRIMSON wall, wet black reflective floor. Tiny figures only — a very large harem of tiny women in stacked silk ranks. ONE symbolic accent: an intense YELLOW emperor-light shaft with a single tiny standing speck. No faces, no anime close-ups, no intimate skin, no blending with close portraits. Monumental emptiness. No readable text, no watermark.',
		refs: ['/ch_taizong.png', '/pl_daming_palace.png']
	})
);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched lust stills');
