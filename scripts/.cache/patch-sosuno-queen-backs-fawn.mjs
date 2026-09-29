/**
 * Wire ch_sosuno_queen + ch_dongmyung; naked-back POV NSFW slots (prompts ready);
 * expand other-daughters fawning stills; deepen queen dual-voice + no-concubines.
 * Draw Things may be down — NSFW slots get prompts/at only.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(path, 'utf8'));
const jumong = story.flatMap((c) => c.entries).find((e) => e.title === 'Jumong');
const onjo = story.flatMap((c) => c.entries).find((e) => e.title === 'Onjo');
if (!jumong) throw new Error('Jumong missing');
if (!onjo) throw new Error('Onjo missing');

const p = (html, ko, nsfw) => ({ kind: 'p', html, ko, ...(nsfw ? { nsfw: true } : {}) });
const d = (person, chip, en, lines, nsfw) => ({
	kind: 'dialogue',
	person,
	chip,
	en,
	lines,
	...(nsfw ? { nsfw: true } : {})
});

const J = '#e8563f';
const S = '#e8a04a';

function enJoin(b) {
	return (b.en || []).join('\n');
}

function upsertImage(entry, slot) {
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) entry.images[i] = { ...entry.images[i], ...slot };
	else entry.images.push(slot);
}

function patchRefs(entry, id, refs, extra = {}) {
	const im = entry.images.find((x) => x.id === id);
	if (!im) throw new Error('missing image ' + id);
	im.refs = refs;
	Object.assign(im, extra);
}

// --- Wire queen / Dongmyung portraits on founding + summit + royal ---
patchRefs(
	jumong,
	'jumong-seq-royal-pair',
	['/ch_dongmyung.png', '/ch_sosuno_queen.png', '/bn_sosuno.png'],
	{
		alt: 'Worm’s-eye: King Dongmyung and Queen Sosuno — new royal portraits, vermilion pillar',
		prompt:
			'Minimal iconic 16:9 WORM’S-EYE. King Dongmyung FACE AND GARMENTS from attached ch_dongmyung (gold crown, red dragon robe #e8563f, blue panel) — not the young exile portrait. Queen Sosuno FACE AND GARMENTS from attached ch_sosuno_queen (royal gache, crimson dragon robe, jade belt) — NOT dusty-rose village silk, NOT gold-washed. ONE device: vermilion pillar bisecting. Real Jolbon timber hall. High contrast chiaroscuro. Cel-painterly anime-adjacent. No army. No text. No watermark.'
	}
);
patchRefs(
	jumong,
	'jumong-seq-summit-crown',
	['/ch_dongmyung.png', '/ch_yeon_tabal.png'],
	{
		alt: 'Tabal sets vermilion cord on Dongmyung’s brow — king portrait',
		prompt:
			'Minimal iconic 16:9 DUTCH OTS. Vermilion cord crowning. FACE AND GARMENTS from attached ch_dongmyung for Jumong-as-king (gold crown language / red court). Tabal FACE from ch_yeon_tabal. ONE device: the cord as a hard red line. Packed-earth yard. #e8563f accent. Cel-painterly. No text. No watermark.'
	}
);
patchRefs(
	jumong,
	'jumong-seq-summit-queen',
	['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_dongmyung.png'],
	{
		alt: 'Queen Sosuno at the rail — royal portrait, five fires answering',
		prompt:
			'Minimal iconic 16:9 DUTCH. Queen Sosuno at the rail FACE AND GARMENTS from attached ch_sosuno_queen (gache, crimson dragon robe, jade) — stern girlboss chin, not blush. Jumong a tiny #e8563f figure from ch_dongmyung in lower third. ONE device: rail as a hard horizontal. Five fire stamps. #e8a04a rim only. Cel-painterly. No text. No watermark.'
	}
);
patchRefs(jumong, 'jumong-seq-king', ['/ch_dongmyung.png'], {
	prompt:
		'Minimal iconic 16:9. First king Dongmyung FACE AND GARMENTS from attached ch_dongmyung. #e8563f as plane/accent. Dramatic pose not portrait clone. Cel-painterly. No text. No watermark.'
});
patchRefs(jumong, 'jumong-seq-king-vote', ['/ch_dongmyung.png', '/ch_yeon_tabal.png'], {
	prompt:
		'Minimal iconic 16:9. Vote crown: Dongmyung FACE from ch_dongmyung, Tabal from ch_yeon_tabal. #e8563f. Cel-painterly. No text.'
});

// New showcase stills using the new portraits
upsertImage(jumong, {
	id: 'dongmyung-seq-hall-wide',
	ratio: 1.778,
	tone: J,
	nsfw: false,
	at: 'the largest kingdom in Samhan',
	alt: 'Wide: King Dongmyung alone in empty Jolbon hall — gold crown, red dragon robe',
	refs: ['/ch_dongmyung.png'],
	people: ['jumong'],
	prompt:
		'Minimal iconic 16:9 WIDE dutch. REAL Jolbon timber hall, grey giwa, packed earth. King Dongmyung mid-stride lower-third FACE AND GARMENTS from attached ch_dongmyung — gold crown, red dragon robe #e8563f, blue panel, black sleeves. ONE device: the empty hall as a dark wedge. High contrast chiaroscuro, long shadows. Not even daylight. Not a portrait clone. Cel-painterly anime-adjacent. No army. No text. No watermark.'
});
upsertImage(jumong, {
	id: 'sosuno-seq-queen-hall',
	ratio: 1.778,
	tone: S,
	nsfw: false,
	at: 'first queen of a country that still smells like millet',
	alt: 'Dutch: Queen Sosuno stern at the hall threshold — royal gache, crimson robe',
	refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png'],
	people: ['sosuno'],
	prompt:
		'Minimal iconic 16:9 DUTCH. Queen Sosuno poster-scale at hall threshold FACE AND GARMENTS from attached ch_sosuno_queen — stern girlboss, shuttered eyes, chin up, royal gache + crimson dragon robe. ONE device: the threshold as a hard vertical. #e8a04a rim only — do not gold-wash. Empty negative space. High contrast. Cel-painterly. No text. No watermark.'
});
upsertImage(jumong, {
	id: 'jumong-seq-royal-pair-new',
	ratio: 1.778,
	tone: J,
	nsfw: false,
	at: 'first queen of a country that still smells like millet',
	alt: 'Two-shot: Dongmyung and Queen Sosuno — dual royal portraits against crushed black hall',
	refs: ['/ch_dongmyung.png', '/ch_sosuno_queen.png', '/bn_sosuno.png'],
	people: ['jumong', 'sosuno'],
	prompt:
		'Minimal iconic 16:9 two-shot DUTCH. King Dongmyung FACE/GARMENTS from ch_dongmyung; Queen Sosuno FACE/GARMENTS from ch_sosuno_queen. Two color planes: his #e8563f red robe vs her crimson/jade — not matching clones. ONE device: a single hard light-seam between them. Real timber hall. Dramatic bodies mid-turn, not standing fashion plates. Cel-painterly. No text. No watermark.'
});

// --- Onjo wiring ---
patchRefs(
	onjo,
	'onjo-seq-goodbye-well',
	['/ch_dongmyung.png', '/ch_sosuno_queen.png', '/bn_sosuno.png'],
	{
		alt: 'Dutch dusk: older King Dongmyung and Queen Sosuno at the Jolbon well, packed bags',
		prompt:
			'Dutch dusk locked Jolbon well goodbye. Older King Dongmyung FACE/GARMENTS from ch_dongmyung; Queen Sosuno FACE/GARMENTS from ch_sosuno_queen — twenty winters, stern then soft. Packed bags as ONE device. #e8563f and #e8a04a dual accents. Cel-painterly. No text. No watermark.'
	}
);
patchRefs(
	onjo,
	'sosuno-seq-glow-south',
	['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_onjo.png', '/ch_biryu.png'],
	{
		alt: 'Wide dawn road: Queen Sosuno and two sons walking south',
		prompt:
			'Dutch wide dawn south road. Queen Sosuno FACE/GARMENTS from ch_sosuno_queen leading; tiny Onjo and Biryu from attached. ONE device: the road as a pale ribbon. #e8a04a rim. Cel-painterly. No text.'
	}
);
upsertImage(onjo, {
	id: 'onjo-seq-queen-king-rail',
	ratio: 1.778,
	tone: S,
	nsfw: false,
	at: 'Yuri can have the chair',
	alt: 'OTS: Queen Sosuno cold at the rail; Dongmyung a small red figure at the well',
	refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_dongmyung.png'],
	people: ['sosuno', 'jumong'],
	prompt:
		'Minimal iconic 16:9 OTS. Queen Sosuno cold shoulder/FACE sliver from ch_sosuno_queen. King Dongmyung small at the well from ch_dongmyung. ONE device: her shoulder as the frame edge. Dusk. Cel-painterly. No text. No watermark.'
});

// --- Naked-back POV NSFW slots (prompts ready; no tempImage until Draw Things) ---
const nakedBacks = [
	{
		id: 'nsfw-sosuno-pov-his-back',
		at: 'the back is the picture',
		alt: 'Her POV: Jumong’s naked muscular back filling frame, grain-room lamp, she looks over his shoulder',
		prompt:
			'Intimate CLOSE 16:9 erotic manhwa. HER POV looking at HIS naked back — Jumong’s wet muscular bare back fills 70%, red #e8563f skin-key, headband off, no hanbok. Sosuno FACE peek over his shoulder from ch_sosuno + bn_sosuno — bitten mouth, heavy blush, wanting. Locked grain loft timber. ONE device: his spine as a hard vertical. Explicit nude back, sex-adjacent cling. No text. No watermark.'
	},
	{
		id: 'nsfw-jumong-pov-her-back',
		at: 'The first time is the grain room',
		alt: 'His POV: Sosuno’s naked back and hiked hips, looking back over her shoulder',
		prompt:
			'Intimate CLOSE 16:9 erotic manhwa. HIS POV looking at HER naked back — Sosuno bare back, dusty-rose fallen to hips, looking back over shoulder, filthy pleasure face. FACE from ch_sosuno + bn. Jumong’s hand #e8563f on her waist at frame edge. Grain sacks. ONE device: her bare spine curve. Explicit nude back, over-shoulder. No text. No watermark.'
	},
	{
		id: 'nsfw-grain-ots-his-back',
		at: 'She ogles him from the loft',
		alt: 'OTS: Sosuno’s cheek against Jumong’s bare shoulder; his naked back to camera',
		prompt:
			'Intimate OTS 16:9. Sosuno cheek pressed to Jumong’s bare shoulder, eyes blown, drool; HIS naked back to camera as a #e8563f plane. FACE from ch_sosuno + bn; back anatomy Jumong. Grain loft. ONE device: shoulder blade as a hard plane. Explicit nude male back. No text. No watermark.'
	},
	{
		id: 'nsfw-grain-ots-her-back',
		at: 'Queen out there. Here I’m— ah— your dirty little—',
		alt: 'OTS: Jumong’s red-rimmed eye; Sosuno’s naked back arched riding away from camera',
		prompt:
			'Intimate OTS 16:9 reverse cowgirl. Jumong FACE sliver from ch_jumong enjoying; Sosuno’s naked arched back to camera, dusty-rose gone, riding, looking back filthy. FACE from ch_sosuno when she turns. #e8a04a and #e8563f dual accents. Grain timber. Explicit sex, nude female back. No text. No watermark.'
	},
	{
		id: 'nsfw-loft-backs-embrace',
		at: 'The marriage is real hunger first',
		alt: 'Two-shot from behind: both naked backs embracing in loft shadow',
		prompt:
			'Intimate two-shot 16:9 from behind. Jumong and Sosuno embracing — both naked backs visible, her dusty-rose puddled, his red silk gone, her face turning to his neck. FACE suggestion from ch_sosuno + ch_jumong when visible. #e8563f and #e8a04a rim. Grain loft lamp. ONE device: two spine curves as parallel lines. Explicit nude backs. No text. No watermark.'
	}
];
for (const slot of nakedBacks) {
	upsertImage(jumong, {
		...slot,
		ratio: 1.778,
		tone: S,
		nsfw: true,
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong']
	});
}

// Refresh empty NSFW prompts to stay ready + slightly sharper
for (const id of [
	'nsfw-sosuno-grind-fit',
	'nsfw-sosuno-creampie-drip',
	'nsfw-sosuno-queen-slut',
	'nsfw-sosuno-only-mine'
]) {
	const im = jumong.images.find((x) => x.id === id);
	if (!im) throw new Error('missing ' + id);
	// keep prompts; ensure no stale tempImage
	delete im.tempImage;
}

upsertImage(jumong, {
	id: 'nsfw-sosuno-queen-slut',
	ratio: 1.778,
	tone: S,
	nsfw: true,
	at: 'Queen out there. Here I’m— ah— your dirty little—',
	alt: 'Intimate: first queen Sosuno riding/grinding Jumong behind the door',
	prompt:
		'Intimate CLOSE 16:9. Contrast beat: Sosuno riding Jumong reverse, dusty-rose fallen, vermilion cord still in her fist, filthy pleasure face. FACE from ch_sosuno + bn_sosuno; Jumong from ch_jumong. #e8a04a and #e8563f as dual accents. Grain timber. Explicit sex, grinding ass. Manhwa panel, heavy blush, climax expression. No text. No watermark.',
	refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
	people: ['sosuno', 'jumong']
});
upsertImage(jumong, {
	id: 'nsfw-sosuno-only-mine',
	ratio: 1.778,
	tone: S,
	nsfw: true,
	at: 'Only I get to fuck the king—',
	alt: 'Intimate ECU: Sosuno dirty-talk face — jealous, wrecked, claiming Jumong',
	prompt:
		'Intimate ECU 16:9 manhwa. Sosuno face filling frame — open mouth, drool, heavy blush, blown pupils, whispering filthy jealousy. FACE from ch_sosuno + bn_sosuno. Jumong’s shoulder #e8563f behind. #e8a04a rim. Grain loft shadow. No text. No watermark.',
	refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
	people: ['sosuno']
});

// --- Fawning / jealousy cinematic stills (SFW-leaning; GenerateImage) ---
const fawnSlots = [
	{
		id: 'jumong-seq-fawn-yard',
		at: 'She finds a flaw every time',
		alt: 'Wide Jolbon yard: Jumong grinning; three anonymous women in teal / plum / saffron silk, distinct hair, leaning in',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt:
			'Minimal iconic 16:9 WIDE dutch. SAME Jolbon packed-earth yard, grey giwa, timber porch. Jumong mid-grin FACE from ch_jumong, red #e8563f silk, enjoying the attention — easy eyes, not grim. THREE anonymous women (NOT Sosuno clones): (1) teal jeogori, high twin buns; (2) plum chima, long loose braid; (3) saffron wrap, short bob with side pin. Distinct faces, ages ~young adult. Fawning lean-in. ONE device: the porch beam as a hard horizontal. High contrast chiaroscuro. Tiny figures / lower-third energy for the women cluster. Cel-painterly anime-adjacent. No army. No text. No watermark.'
	},
	{
		id: 'jumong-seq-fawn-ots',
		at: 'She finds a flaw every time',
		alt: 'OTS: a saffron sleeve and laugh; Jumong red grin enjoying it',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt:
			'Minimal iconic 16:9 OTS. Anonymous woman’s saffron sleeve + half-face laugh in sharp foreground; Jumong midground FACE from ch_jumong grinning, enjoying, #e8563f rim. ONE device: her sleeve as the frame edge. Jolbon well bokeh. Cel-painterly. No text. No watermark.'
	},
	{
		id: 'jumong-seq-fawn-close',
		at: 'She finds a flaw every time',
		alt: 'Close dutch: Jumong easy smile; teal-bun girl and plum-braid girl crowding',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt:
			'Minimal iconic 16:9 CLOSE dutch. Jumong FACE from ch_jumong laid-back grin filling left. Two anonymous women crowding right — teal twin-buns + plum long braid — different faces, not Sosuno. ONE device: a water-bucket rim as a dark arc. #e8563f accent. Shallow DOF. Cel-painterly. No text. No watermark.'
	},
	{
		id: 'jumong-seq-fawn-dutch',
		at: 'At the well three girls laugh too long',
		alt: 'Dutch well: three different-colored silks fawning; Jumong mid-laugh',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt:
			'Minimal iconic 16:9 DUTCH. REAL Jolbon well-circle. Jumong mid-laugh FACE from ch_jumong. Three women in teal / plum / saffron distinct hairstyles fawning. ONE device: well-circle stamp. High contrast. Cel-painterly. No text. No watermark.'
	},
	{
		id: 'sosuno-seq-jealous-dutch',
		at: 'She finds a flaw every time',
		alt: 'Dutch: Sosuno dusty-rose chin-up wedge cutting between Jumong and the fawning cluster',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		nsfw: false,
		prompt:
			'Minimal iconic 16:9 DUTCH. Sosuno dusty-rose FACE from ch_sosuno + bn, stern jealous chin up, stepping between. Jumong grin behind from ch_jumong. Anonymous fawning women tiny in lower third (teal/plum). ONE device: her body as a dusty-rose wedge. #e8a04a rim. Cel-painterly. No text. No watermark.'
	},
	{
		id: 'sosuno-seq-jealous-ecu',
		at: 'Don’t smile at them',
		alt: 'ECU: Sosuno jealous glare — shuttered eyes, ears red, not blush-cute',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['sosuno'],
		nsfw: false,
		prompt:
			'Minimal iconic 16:9 ECU. Sosuno jealous command face FACE from ch_sosuno + bn — shuttered eyes, chin up, ears red, not cute smile. Dusty-rose #e8a04a rim. ONE device: her eye as the frame. Cel-painterly. No text. No watermark.'
	},
	{
		id: 'nsfw-sosuno-jealous-heat',
		at: 'Only I get to fuck the king—',
		alt: 'Intimate: Sosuno pinning Jumong after chasing porch girls — filthy jealous mouth',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		nsfw: true,
		prompt:
			'Intimate CLOSE 16:9 manhwa. Sosuno pinning Jumong against grain timber after jealousy — hiked dusty-rose, open mouth, drool, heavy blush, whispering filthy claim. FACE from ch_sosuno + bn; Jumong from ch_jumong. #e8a04a and #e8563f. Explicit heat, skin-forward. No text. No watermark.'
	}
];
for (const slot of fawnSlots) {
	upsertImage(jumong, {
		ratio: 1.778,
		tone: slot.nsfw ? S : J,
		nsfw: !!slot.nsfw,
		...slot
	});
}

// --- Dual-voice script: public girlboss + filthy private + no concubines ---
const iBehind = jumong.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Behind the Door');
if (iBehind < 0) throw new Error('Behind the Door missing');

// Replace the first NSFW dialogue after Behind the Door with richer dual + jealousy
const iQueenDirty = jumong.blocks.findIndex(
	(b) => b.nsfw && b.person === 'sosuno' && enJoin(b).includes('Queen out there')
);
if (iQueenDirty < 0) throw new Error('queen dirty dialogue missing');
jumong.blocks[iQueenDirty] = d(
	'sosuno',
	S,
	[
		'Queen out there. Here I’m— ah— your dirty little bookworm—',
		'Grind— wait— let me— seat it— fuck it’s big—',
		'That bitch at the porch was looking at you. The teal one. I saw.',
		'Those porch girls. The well ones. The chieftain’s kid.',
		'They can starve. Only I get to fuck the king—'
	],
	[
		'밖에선 왕비. 여기선— 아— 네 더러운 책벌레—',
		'비벼— 잠깐— 자리— 씨 커—',
		'저 년 누대에서 너 봤어. 청록 저고리. 봤거든.',
		'누대 년들. 우물 것들. 그 족장 딸.',
		'굶기든가. 왕 따먹는 건 나뿐이야—'
	],
	true
);

const iOnlyMine = jumong.blocks.findIndex(
	(b) => b.nsfw && b.person === 'sosuno' && enJoin(b).includes('Don’t call me queen')
);
if (iOnlyMine < 0) throw new Error('little sosuno dirty missing');
jumong.blocks[iOnlyMine] = d(
	'sosuno',
	S,
	[
		'Don’t call me queen when you’re in me—',
		'Call me— Little Sosuno— no don’t— ah she likes it—',
		'Promise me— ha— my little sosuno is the only pussy you’re cumming for, daddy—',
		'No side halls. No concubines. I forbid it. Say it—',
		'Cum in. Don’t pull out. I want to feel it drip—',
		'Fill me till it runs down my thighs. That’s my crown—'
	],
	[
		'안에 있을 때 왕비라고 하지 마—',
		'작은 소서노라고— 아니 하지 마— 아 얘 좋아하거든—',
		'약속해— 하— 네 정액 받는 보지 작은 소서노뿐이라고, 아빠—',
		'곁방 없어. 후궁 없어. 내가 금해. 말해—',
		'안에 싸. 빼지 마. 흘러내리는 거 느끼고 싶어—',
		'허벅지로 흐를 때까지 채워. 그게 내 관이야—'
	],
	true
);

const iJumongHey = jumong.blocks.findIndex(
	(b) => b.nsfw && b.person === 'jumong' && enJoin(b).includes('You’re the queen')
);
if (iJumongHey >= 0) {
	jumong.blocks[iJumongHey] = d(
		'jumong',
		J,
		[
			'Hey—',
			'You’re the queen.',
			'Also— god— look at you talking.',
			'Only you. No halls. I heard.'
		],
		['야—', '왕비잖아.', '그리고— 진짜— 말하는 거 봐.', '너뿐이야. 곁방 없어. 들었어.'],
		true
	);
}

// Public stern after summit cord — before Behind the Door
const iPublicLook = jumong.blocks.findIndex(
	(b) => !b.nsfw && b.person === 'sosuno' && enJoin(b).includes('Don’t look at me like that in front of them')
);
if (iPublicLook >= 0) {
	jumong.blocks[iPublicLook] = d(
		'sosuno',
		S,
		[
			'Don’t look at me like that in front of them.',
			'I’m counting the fires.',
			'And if any hall offers you a second girl — send them to me. I’ll break the count.',
			'…You can look later. Behind the door.'
		],
		[
			'그들 앞에서 그 눈으로 보지 마.',
			'불 세는 중이니까.',
			'어느 대청이든 둘째 계집 들이면 — 나한테 보내. 셈을 부숴 줄게.',
			'…나중에 봐. 문 안에서.'
		]
	);
}

// Narration beat reinforcing dual + no concubines
const iOutsideQueen = jumong.blocks.findIndex(
	(b) => b.nsfw && typeof b.html === 'string' && b.html.includes('Outside she is first queen of Goguryeo')
);
if (iOutsideQueen >= 0) {
	jumong.blocks[iOutsideQueen] = p(
		'Outside she is first queen of Goguryeo — cord, rail, five fires answering, chin up, the harsh girlboss who forbids a second hall. Inside the grain room again, the dusty-rose hits the floor and she is still the dirtiest bookworm in the valley for her dream man. She backs onto him and works that tight little ass in a grind until the stretch makes her swear. <b>The marriage is real hunger first</b>',
		'밖에서는 고구려의 첫 왕비다 — 끈, 난간, 대답하는 불 다섯, 턱 들고, 곁방 금하는 매정한 여왕. 다시 곡식방 안에서는 회분홍이 바닥에 떨어지고, 꿈에 그리던 사내 앞에서는 골짜기에서 제일 야한 책벌레다. 뒤로 올라타 그 꽉 낀 엉덩이를 비벼 넣는다. 늘어나는 게 욕이 나오게. <b>혼인은 먼저 진짜 허기다</b>',
		true
	);
}

// Other daughters: add Jumong enjoying + Sosuno jealous line
const iWellThree = jumong.blocks.findIndex(
	(b) => typeof b.html === 'string' && b.html.includes('At the well three girls laugh too long')
);
if (iWellThree >= 0 && !jumong.blocks[iWellThree + 1]?.en?.join?.('\n')?.includes('They’re funny')) {
	jumong.blocks.splice(
		iWellThree + 1,
		0,
		d(
			'jumong',
			J,
			['They’re funny.', 'I didn’t say anything.', '…You’re scowling.'],
			['웃기네.', '난 말 안 했어.', '…너 찌푸리잖아.']
		),
		d(
			'sosuno',
			S,
			[
				'Stop enjoying it.',
				'Teal hairpin. Plum braid. Saffron laugh.',
				'I counted. I always count.',
				'This well’s ours.'
			],
			['즐기지 마.', '청록 비녀. 자두 땋은머리. 사프란 웃음.', '셌어. 맨날 세.', '이 우물 우리 거야.']
		)
	);
}

// --- Onjo-era dual voice ---
const iYuriChair = onjo.blocks.findIndex(
	(b) => b.person === 'sosuno' && enJoin(b).includes('Yuri can have the chair')
);
if (iYuriChair >= 0) {
	onjo.blocks[iYuriChair] = d(
		'sosuno',
		S,
		[
			'Don’t be nice.',
			'I’ll get stupid.',
			'Yuri can have the chair. I’m not sitting in a footnote.',
			'And don’t you dare take a hall girl after I walk. I forbade it when you were crowned. Still forbidden.',
			'You know that. You always knew.'
		],
		[
			'착하게 굴지 마.',
			'바보 돼.',
			'의자는 유리가 가져. 난 각주로 안 앉아.',
			'내가 간 뒤에 곁방 들이지 마. 왕 됐을 때 금했어. 아직 금이야.',
			'알잖아. 처음부터 알았잖아.'
		]
	);
}

const iLastNightSosuno = onjo.blocks.findIndex(
	(b) => b.nsfw && b.person === 'sosuno' && enJoin(b).includes('Little Sosuno listen')
);
if (iLastNightSosuno >= 0) {
	onjo.blocks[iLastNightSosuno] = d(
		'sosuno',
		S,
		[
			'Don’t— ha— don’t say sexy I’ll—',
			'Little Sosuno listen— that’s him— that’s the noise— wet— god the wet— twenty winters and still that slap—',
			'Look at you. Chest. Back. That ass. That man meat. Still. Still.',
			'Promise— only this pussy— only Little Sosuno— no concubine ever— daddy say it—',
			'Take it and destroy my tight little ass. Beat her up. Beat up Little Sosuno till she’s dripping and there’s nothing left—'
		],
		[
			'말하지— 하— 섹시하다고 하면 나—',
			'작은 소서노 들어— 저거 그거야— 그 소리— 젖은— 아 그 젖은 소리— 스무 겨울인데 그 철썩 아직—',
			'봐봐. 가슴. 등. 그 엉덩이. 그 고기. 아직. 아직.',
			'약속— 이 보지만— 작은 소서노만— 후궁은 영원히 없어— 아빠 말해—',
			'가져와서 내 꽉 끼는 엉덩이 박살내. 두들겨 패. 작은 소서노 패. 질질 흐르고 아무것도 안 남게—'
		],
		true
	);
}

upsertImage(onjo, {
	id: 'nsfw-onjo-backs-last',
	ratio: 1.778,
	tone: S,
	nsfw: true,
	at: 'one last screaming night',
	alt: 'OTS last night: her naked back against him; his looking at hers',
	refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
	people: ['sosuno', 'jumong'],
	prompt:
		'Intimate OTS 16:9 last night grain room. Sosuno naked back arched, looking over shoulder filthy; Jumong behind FACE from ch_jumong watching her back. FACE from ch_sosuno + bn. #e8a04a #e8563f. Explicit nude back POV. No text. No watermark.'
});

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('patched Jumong + Onjo');
console.log(
	'new/updated slots:',
	[
		...nakedBacks.map((s) => s.id),
		...fawnSlots.map((s) => s.id),
		'dongmyung-seq-hall-wide',
		'sosuno-seq-queen-hall',
		'jumong-seq-royal-pair-new',
		'onjo-seq-queen-king-rail',
		'nsfw-onjo-backs-last'
	].join(', ')
);
