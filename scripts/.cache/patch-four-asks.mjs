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
	if (!en) throw new Error(`missing entry ${title}`);
	return en;
}

function insertAfterImage(images, afterId, slots) {
	const exist = new Set(images.map((im) => im.id));
	const fresh = slots.filter((s) => !exist.has(s.id));
	if (!fresh.length) return [];
	const i = images.findIndex((im) => im.id === afterId);
	if (i < 0) throw new Error(`missing slot ${afterId}`);
	images.splice(i + 1, 0, ...fresh);
	return fresh.map((s) => s.id);
}

function insertBlockAfter(blocks, htmlIncludes, block) {
	const i = blocks.findIndex((b) => (b.html ?? '').includes(htmlIncludes));
	if (i < 0) throw new Error(`missing block containing ${JSON.stringify(htmlIncludes)}`);
	const already = blocks.some(
		(b) => b.kind === block.kind && (b.html ?? '') === (block.html ?? '')
	);
	if (already) return false;
	blocks.splice(i + 1, 0, block);
	return true;
}

function insertBlockAfterDialogueEn(blocks, enIncludes, block) {
	const i = blocks.findIndex(
		(b) => b.kind === 'dialogue' && (b.en ?? []).some((line) => line.includes(enIncludes))
	);
	if (i < 0) throw new Error(`missing dialogue containing ${JSON.stringify(enIncludes)}`);
	const already = blocks.some(
		(b) => b.kind === block.kind && (b.html ?? '') === (block.html ?? '')
	);
	if (already) return false;
	blocks.splice(i + 1, 0, block);
	return true;
}

function rewrite(images, id, patch) {
	const im = images.find((x) => x.id === id);
	if (!im) throw new Error(`missing slot ${id}`);
	Object.assign(im, patch);
}

const added = [];
const cues = [];

const CH_YUSHIN = '/ch_kim_yushin.png';
const CH_GUARDIAN = '/ch_guardian.png';
const CH_GESOMUN = '/ch_yeon_gesomun.png';
const CH_GYEBEK = '/ch_gyebek.png';
const CH_HAEMOSU = '/ch_haemosu.png';
const CH_YUHWA = '/ch_yuhwa.png';
const CH_PUMSUK = '/ch_pumsuk.png';
const CH_YEHWA = '/ch_gumil_wife.png';

/* ── 1. Ring-pommel closes ─────────────────────────────────────────────── */

const yushin = findEntry('Kim Yushin');
if (
	insertBlockAfter(yushin.blocks, 'Blue Moon sends the Sword of Silla', {
		kind: 'p',
		html: 'The fish-ring sits in his palm. Hollow gold. Readable. He does not sheathe it to hide the Gaya in it.',
		ko: '어환이 손바닥에 있다. 빈 금고리. 읽힌다. 가야를 감추려고 집어넣지 않는다.'
	})
)
	cues.push('Kim Yushin: fish-ring palm');

added.push(
	...insertAfterImage(yushin.images, 'yushin-title', [
		{
			id: 'yushin-ring-hand',
			ratio: 1.333,
			tone: '#2A5FB8',
			at: 'The fish-ring sits in his palm',
			alt: 'Close: Kim Yushin’s hand filling the frame; Gaya fish-ring pommel readable as a hollow gold circle',
			prompt:
				'Minimal iconic 4:3 still. Kim Yushin, Confucian marshal. ONE geometric device: a low horizontal crop — his adult hand filling the lower two-thirds; the Gaya 환두대도 fish-ring pommel as a hollow gold circle occupying the center, fish motif inside the ring, fully readable. Face matches the attached portrait only as a beard-and-scar sliver at the top edge. Confucian blue #2A5FB8 as the single accent on silk sleeve and a thin rim on the ring. Striking silky court-military, few hues. Flat charcoal void. No army. No palace clutter. No clouds. No second sword. No text. No watermark. Graphic color-blocking, anime-painterly. NOT photoreal. NOT busy.',
			refs: [CH_YUSHIN],
			people: ['yushin']
		}
	])
);

const ansi = findEntry('Ansi');
if (
	insertBlockAfterDialogueEn(ansi.blocks, 'and that is enough', {
		kind: 'p',
		html: 'The ring at his hip is Goguryeo iron — a hollow circle the same red as the wall.',
		ko: '허리의 환두는 고구려 쇠다. 빈 고리. 성벽과 같은 붉은빛.'
	})
)
	cues.push('Ansi: hip ring');

added.push(
	...insertAfterImage(ansi.images, 'yangmanchun-corner-stamp', [
		{
			id: 'yangmanchun-ring-hip',
			ratio: 1.333,
			tone: '#e05a3c',
			at: 'The ring at his hip',
			alt: 'Close: Yang Manchun’s hip — Goguryeo 환두대도 ring hanging readable at the belt, terracotta accent',
			prompt:
				'Minimal iconic 4:3 still. Yang Manchun, Ansi guardian. ONE geometric device: a hip-strip crop — belt as a hard horizontal bar; the 환두대도 ring pommel hanging as a hollow iron circle at the hip, fully readable, not a cap. Face matches the attached portrait only as a bearded helmet sliver at the top edge. Terracotta #e05a3c as the plane and the single accent on the ring rim. Striking silky Goguryeo court-military, crimson sash, few hues. Flat charcoal void. No army. No wall catalog. No palace clutter. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly. NOT photoreal. NOT busy.',
			refs: [CH_GUARDIAN],
			people: ['yangmanchun']
		}
	])
);

const massacre = findEntry('Yeon’s Massacre');
added.push(
	...insertAfterImage(massacre.images, 'five-blades', [
		{
			id: 'gesomun-rings-cross',
			ratio: 1.333,
			tone: '#d0362f',
			at: 'Five ring-pommels. Five crows.',
			alt: 'Close: two crow-stamped 환두대도 rings crossing — Yeon Gesomun’s grip, hollow circles readable',
			prompt:
				'Minimal iconic 4:3 still. Yeon Gesomun, Supreme Commander. ONE geometric device: two Goguryeo 환두대도 ring pommels as overlapping hollow circles crossing like an X, crow stamps readable inside the rings, not a five-sword catalog. Face matches the attached portrait only as a thick-beard sliver at the top. Blood-red #d0362f as the single accent on one ring’s rim. Striking silky Goguryeo lamellar, few hues. Flat charcoal void. No army. No banquet clutter. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly. NOT photoreal. NOT busy.',
			refs: [CH_GESOMUN],
			people: ['gesomun']
		}
	])
);

const hwangsan = findEntry('Yellow Mountain Fields');
if (
	insertBlockAfterDialogueEn(hwangsan.blocks, 'Men of Baekje', {
		kind: 'p',
		html: 'Gyebek kneels. He plants the phoenix ring in the yellow dust and keeps his hand on it. Gyebek stands when the dust has learned the shape.',
		ko: '계백은 무릎을 꿇는다. 봉환을 노란 먼지에 꽂고 손을 그 위에 둔다. 먼지가 그 모양을 기억하면, 계백은 선다.'
	})
)
	cues.push('Yellow Mountain: phoenix ring planted');

added.push(
	...insertAfterImage(hwangsan.images, 'gyebek-prayer', [
		{
			id: 'gyebek-ring-plant',
			ratio: 1.333,
			tone: '#d9b13a',
			at: 'plants the phoenix ring',
			alt: 'Close: Gyebek’s hand on a planted phoenix-ring 환두대도 — hollow gold circle readable in yellow dust',
			prompt:
				'Minimal iconic 4:3 still. Gyebek, last general of Baekje. ONE geometric device: a planted 환두대도 phoenix-ring as a hollow gold circle standing in a thin yellow-dust strip; his adult hand gripping the ring, fully readable lotus-phoenix inside. Face matches the attached portrait only as a gold-headband sliver at the top. Yellow #d9b13a as the plane. Striking silky Baekje court-military, few hues. Flat charcoal void. No army. No field catalog. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly. NOT photoreal. NOT busy.',
			refs: [CH_GYEBEK],
			people: ['gyebek']
		}
	])
);

/* ── 2. Haemosu / Yuhwa NSFW ───────────────────────────────────────────── */

const jumong = findEntry('Jumong');

if (
	insertBlockAfter(jumong.blocks, 'wet hair down her back', {
		kind: 'p',
		html: 'She washes her hair with her back to heaven, whole body wet, and looks over her shoulder as if the sun had a mouth.',
		ko: '그녀는 하늘을 등지고 머리를 감는다. 온몸이 젖어 있다. 해가 입이라도 가진 것처럼, 어깨 너머로 돌아본다.'
	})
)
	cues.push('Jumong: Yuhwa washes hair');

if (
	insertBlockAfter(jumong.blocks, 'draws her wet hair over one shoulder', {
		kind: 'p',
		html: 'From the river she looks far up — the chariot is a gold house, not a toy. From the rail he looks down at all of her, wet.',
		ko: '강에서 그녀는 멀리 올려다본다 — 수레가 금으로 된 집이지, 장난감이 아니다. 난간에서 그는 젖은 그녀 전부를 내려다본다.'
	})
)
	cues.push('Jumong: look up / look down');

const hySlots = [
	{
		id: 'yuhwa-wash-back',
		ratio: 0.75,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'washes her hair',
		alt: 'Yuhwa naked back to camera, whole body wet, washing her hair, looking over her shoulder',
		prompt:
			'Minimal iconic 3:4 still. Lady Yuhwa, adult river goddess. ONE geometric device: a wet-hair diagonal from the crown down her naked back. Camera behind her: entire adult body wet, unashamed, washing long dark hair with both hands, looking backwards over her shoulder at the unseen sun. Face matches the attached portrait. Pale-blue #8fc4e0 as the single wet-silk accent at the hips only; the rest is wet skin. Sexual, flirty, skin-forward, faces and back fill the frame. Flat charcoal-gold void. No sisters. No army. No palace clutter. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly. Adult/mature. NOT photoreal. NOT cartoon.',
		refs: [CH_YUHWA],
		people: ['yuhwa']
	},
	{
		id: 'yuhwa-worm-chariot',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: true,
		at: 'the chariot is a gold house',
		alt: 'Worm’s-eye from wet Yuhwa: Haemosu huge above in a gold five-dragon chariot, monumental emptiness',
		prompt:
			'Minimal iconic 16:9 poster. Haemosu, sun god, huge above. ONE geometric device: worm’s-eye from the river — a gold #f0b429 chariot-plane filling the upper sky as a house-sized stamp, five-dragon silhouette, not a close body. Yuhwa only as a wet pale-blue #8fc4e0 shoulder-speck at the extreme bottom. Face suggestion of the attached Haemosu portrait only as a tiny white-hair topknot. Living-world red/charcoal void. Flat kingdom sky, no clouds. Monumental emptiness. Tiny figures. No army. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental. NOT photoreal. NOT busy. NOT an intimate two-shot.',
		refs: [CH_HAEMOSU, CH_YUHWA],
		people: ['haemosu', 'yuhwa']
	},
	{
		id: 'haemosu-chariot-down',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'From the rail he looks down',
		alt: 'From Haemosu’s chariot: wet Yuhwa far below on a pale-blue river strip, gold rail as a hard arc',
		prompt:
			'Minimal iconic 16:9 poster. Haemosu’s view from the chariot. ONE geometric device: a gold #f0b429 chariot-rail as a hard arc cropped at the TOP; looking DOWN a vast charcoal void onto a pale-blue #8fc4e0 river-strip; wet Yuhwa a tiny luminous body on the strip, entire figure wet. Face suggestion of attached portraits only. Flat kingdom sky, no clouds. Monumental emptiness. No army. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental. NOT an intimate close. NOT photoreal.',
		refs: [CH_HAEMOSU, CH_YUHWA],
		people: ['haemosu', 'yuhwa']
	},
	{
		id: 'yuhwa-looks-up-wet',
		ratio: 0.75,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'She looks far up',
		alt: 'Intimate: wet Yuhwa’s face filling the frame, looking far up, throat a wet line, sexual tease',
		prompt:
			'Minimal iconic 3:4 still. Lady Yuhwa, adult river goddess, flirty and sexual. ONE geometric device: her wet face filling the frame, chin tilted far up, throat a wet vertical line. Face matches the attached portrait: long wet dark hair, knowing unashamed mouth, looking straight up at the huge unseen sun-god. Pale-blue #8fc4e0 as the single accent on wet skin and a slip of silk. Entire body wet. Skin-forward, breasts and collarbone in frame, not polite. Flat charcoal-gold void. No second person. No army. No palace clutter. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly. Adult/mature. NOT photoreal. NOT cartoon.',
		refs: [CH_YUHWA],
		people: ['yuhwa']
	},
	{
		id: 'haemosu-looks-down-wet',
		ratio: 0.75,
		tone: '#f0b429',
		nsfw: true,
		at: 'looks down at all of her, wet',
		alt: 'Haemosu’s intimate POV from the chariot: wet Yuhwa’s body filling the frame below, sexual, looking up',
		prompt:
			'Minimal iconic 3:4 still. Haemosu’s view looking down. Adult Lady Yuhwa filling the frame below, entire body wet, sexual, looking up at him. ONE geometric device: a gold #f0b429 chariot-rail sliver as a hard arc at the TOP edge only. Her face matches the attached portrait. Pale-blue #8fc4e0 wet skin, unashamed, skin-forward, not a tiny speck. Personal close. Flat charcoal void. No army. No river landscape catalog. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly. Adult/mature. Gods may be more realistic / numinous. NOT photoreal costume dump. NOT cartoon.',
		refs: [CH_YUHWA, CH_HAEMOSU],
		people: ['yuhwa', 'haemosu']
	},
	{
		id: 'haemosu-yuhwa-copper-skin',
		ratio: 0.75,
		tone: '#f0b429',
		nsfw: true,
		at: 'My back, too.',
		alt: 'Intimate copper-room sex: wet Yuhwa and Haemosu, skin-forward, gold heat, faces filling the frame',
		prompt:
			'Minimal iconic 3:4 still. Adult sun god Haemosu and adult river goddess Yuhwa, sexual, flirty for both. ONE geometric device: a copper-gold #f0b429 plane pressed to wet skin as a hard vertical at the left. Faces fill the frame, mouths close, her wet pale-blue #8fc4e0 body against his white-gold chest. Faces match the attached portraits: his silver-white topknot, her long wet dark hair. Skin-forward, desire, not polite glances. Flat charcoal-copper void. No furniture catalog. No army. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly. Adult/mature. Gods may be more numinous. NOT photoreal. NOT cartoon.',
		refs: [CH_HAEMOSU, CH_YUHWA],
		people: ['haemosu', 'yuhwa']
	}
];

added.push(...insertAfterImage(jumong.images, 'yuhwa-bath-tease', hySlots));

/* ── 3. Yehwa / Pumsuk heat + mandatory back-press closer ──────────────── */

const daeya = findEntry('Daeya Fortress');

rewrite(daeya.images, 'nsfw-pumsuk-yehwa-horndog', {
	ratio: 0.75,
	nsfw: true,
	alt: 'Pumsuk the horndog — ice-blue silk open, Yehwa’s teal silk torn from the breast, lust not implied',
	prompt:
		'Minimal iconic 3:4 still. Adult Pumsuk and adult Yehwa, Geomil’s wife. ONE geometric device: torn teal-sage #8AAFA0 silk as a hard diagonal off her breast. Faces fill the frame. Faces match the attached portraits: his blue crescent headband, messy dark hair, flushed horndog mouth; her tan skin, wooden sprig pin, knowing heat. Ice-blue #7EB8F0 as his open silk. Skin-forward, desire, breasts, wet mouths — match the heat of forbidden desire, not a polite glance. Flat charcoal-lamp void. No bedroom catalog. No army. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly. Adult/mature. NOT photoreal. NOT cartoon.',
	refs: [CH_PUMSUK, CH_YEHWA],
	people: ['pumsuk', 'gumilwife']
});

rewrite(daeya.images, 'nsfw-pumsuk-yehwa-claim', {
	ratio: 0.75,
	nsfw: true,
	alt: 'Pumsuk pinning Yehwa — ice-blue and teal silk open, skin-forward, no more boy-politeness',
	prompt:
		'Minimal iconic 3:4 still. Adult Pumsuk the aggressor pinning adult Yehwa. ONE geometric device: his ice-blue #7EB8F0 sleeve as a hard bar across her tan chest. Faces fill the frame, mouths almost eating. Faces match the attached portraits: crescent headband, sprig pin. Teal-sage #8AAFA0 silk open. Skin-forward, breasts, sweat, forbidden heat — not a polite almost-kiss. Flat charcoal void. No furniture. No army. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly. Adult/mature. NOT photoreal. NOT cartoon.',
	refs: [CH_PUMSUK, CH_YEHWA],
	people: ['pumsuk', 'gumilwife']
});

rewrite(daeya.images, 'nsfw-pumsuk-yehwa-devotion', {
	ratio: 0.75,
	nsfw: true,
	alt: 'Close faces: Pumsuk flushed and hungry, Yehwa’s mouth parted, teal silk off the shoulder, lamp gold',
	prompt:
		'Minimal iconic 3:4 still. Adult Pumsuk and adult Yehwa, devotion as lust. ONE geometric device: two faces filling the frame, his brow against hers as a hard diagonal. Faces match the attached portraits. Ice-blue #7EB8F0 and teal-sage #8AAFA0. Skin-forward, wet mouths, her breast against his chest, not polite. Flat charcoal-lamp void. No army. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly. Adult/mature. NOT photoreal. NOT cartoon.',
	refs: [CH_PUMSUK, CH_YEHWA],
	people: ['pumsuk', 'gumilwife']
});

if (
	insertBlockAfterDialogueEn(daeya.blocks, 'A <b>half</b> is still more than mine', {
		kind: 'p',
		html: 'She turns. Her back finds his chest. He does not let the space return.',
		ko: '그녀는 돈다. 벗은 등이 그의 가슴에 닿는다. 그는 그 사이를 다시 비우지 않는다.'
	})
)
	cues.push('Daeya: back finds his chest');

added.push(
	...insertAfterImage(daeya.images, 'nsfw-pumsuk-yehwa-devotion', [
		{
			id: 'nsfw-pumsuk-yehwa-backpress',
			ratio: 0.75,
			tone: '#8AAFA0',
			nsfw: true,
			at: 'Her back finds his chest',
			alt: 'Final: Yehwa’s naked back to camera, side breasts showing, pressed to Pumsuk’s chest',
			prompt:
				'Minimal iconic 3:4 still. Adult Yehwa pressed up against adult Pumsuk’s chest. ONE geometric device: her naked back filling the frame as a vertical skin-plane; camera behind her. Side breasts showing at both edges. His ice-blue #7EB8F0 silk chest behind her, crescent headband visible over her shoulder. Face matches the attached Yehwa portrait looking back over one shoulder; his face matches the attached Pumsuk portrait as a flushed sliver. Teal-sage #8AAFA0 as a scrap of silk at the hip only. Skin-forward, sexual, wet, desire — the last beat, not a polite glance. Flat charcoal-lamp void. No bedroom catalog. No army. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly. Adult/mature. NOT photoreal. NOT cartoon.',
			refs: [CH_YEHWA, CH_PUMSUK],
			people: ['gumilwife', 'pumsuk']
		}
	])
);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`added slots: ${added.join(', ') || '(none new)'}`);
console.log(`cues: ${cues.join('; ') || '(already present)'}`);
