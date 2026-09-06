// Four beats: Ansi helmet-face, Samsin-as-one, Gotaso love, Haemosu epic mythos.
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function entries() {
	const out = [];
	for (const ch of story) {
		for (const en of ch.entries ?? []) out.push(en);
	}
	return out;
}

function findEntry(title) {
	const en = entries().find((e) => e.title === title);
	if (!en) throw new Error(`missing entry ${title}`);
	return en;
}

function insertAfter(images, afterId, slots) {
	const i = images.findIndex((im) => im.id === afterId);
	if (i < 0) throw new Error(`missing slot ${afterId}`);
	const exist = new Set(images.map((im) => im.id));
	const fresh = slots.filter((s) => !exist.has(s.id));
	images.splice(i + 1, 0, ...fresh);
	return fresh.map((s) => s.id);
}

function setSlot(images, id, patch) {
	const im = images.find((s) => s.id === id);
	if (!im) throw new Error(`missing slot ${id}`);
	Object.assign(im, patch);
}

function findBlockIndex(blocks, needle) {
	return blocks.findIndex((b) => {
		if (typeof b.html === 'string' && b.html.includes(needle)) return true;
		if (Array.isArray(b.en) && b.en.some((s) => s.includes(needle))) return true;
		if (Array.isArray(b.lines) && b.lines.some((s) => s.includes(needle))) return true;
		return false;
	});
}

function insertBlockAfterHtml(blocks, needle, newBlocks) {
	const i = findBlockIndex(blocks, needle);
	if (i < 0) throw new Error(`missing block containing: ${needle}`);
	blocks.splice(i + 1, 0, ...newBlocks);
}

const log = [];

// ── 1. Ansi: helmet thrown off, first face ──────────────────────────────
const ansi = findEntry('Ansi');

setSlot(ansi.images, 'taizong-ansi-face', {
	ratio: 0.5625,
	tone: '#c97a2e',
	at: 'the lacquered bowl leaves his head',
	alt: 'Dramatic close-up: Taizong’s first readable face as the siege-helmet leaves the frame — sweat, yellow camp light, real proportions.',
	prompt:
		'Intimate cinematic CLOSE-UP still, 9:16. Taizong, Second Emperor of Tang — first readable face. ONE geometric device: a lacquered Tang siege-helmet leaving the TOP edge as a hard black bowl, still in motion, while the face FILLS the frame beneath it. Face matches the attached portrait: square jaw, full black beard and mustache, stern eyes, late-forties. Sweat on the brow and lip. Yellow camp-light #c97a2e as the single accent on wet skin. Bare head — the helmet is gone, no futou. Striking silky Tang campaign cloth at the throat only, few hues. Real adult proportions. Flat charcoal void. No army. No palace clutter. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
	refs: ['/ch_taizong.png']
});

const assaultNeedle = 'The Second Emperor has the officer beheaded and orders three days of assault.';
const assault = ansi.blocks.find((b) => b.kind === 'p' && b.html?.startsWith(assaultNeedle));
if (!assault) throw new Error('missing Ansi assault paragraph');
assault.html =
	'The Second Emperor has the officer beheaded and orders three days of assault.';
assault.ko =
	'황제는 그 장수의 목을 베고 사흘간의 총공격을 명한다.';

insertBlockAfterHtml(ansi.blocks, assaultNeedle, [
	{
		kind: 'p',
		html: 'On the second day an arrow finds the helmet. Whether it was the wall or a stone the size of a cooking-pot, the lacquered bowl leaves his head and rings once on packed earth, then keeps rolling. Sweat. Yellow camp light. For the first time the face is simply there.',
		ko: '이튿날 화살이 투구를 찾는다. 성벽이었는지, 솥만 한 돌이었는지, 옻칠한 바가 정수리에서 벗겨져 다진 흙 위에서 한 번 울리고는 계속 굴러간다. 땀. 노란 진중 불. 처음으로, 얼굴이 그냥 있다.'
	},
	{
		kind: 'p',
		html: 'Then the cold comes early, the grass on the plain gives out, and there is nothing to feed the horses.',
		ko: '그러나 추위가 일찍 왔고, 벌판의 풀이 다했으며, 말을 먹일 것이 없었다.'
	}
]);
log.push('ansi: taizong-ansi-face retargeted + helmet prose');

// ── 2. Samsin is one midwife ────────────────────────────────────────────
const namseng = findEntry('Birth of Namseng');

setSlot(namseng.images, 'samsin-namseng-birth', {
	at: 'steps from the frame the way steam steps',
	alt: 'Samsin — one midwife goddess — steps glowing from a hanging portrait to lay a hand on the labouring mother',
	prompt:
		'Intimate cinematic CLOSE-UP still, 16:9. Goddess Samsin, ONE adult midwife, not a trio. ONE geometric device: a hanging portrait-plane as a hard rectangle at the left; she steps out of it like steam, one hand reaching into lantern dark. Face matches the attached portrait: white hair in an updo, cream jeogori, royal-blue chima, red sash, swirl binyeo. Blush-pink #e8b4c8 as the single accent. Striking silky hanbok, few hues. Dim birth-chamber light. Real adult proportions. ONE woman only. Flat charcoal void. No army. No palace clutter. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
	refs: ['/ch_samsin.png']
});

setSlot(namseng.images, 'samsin-life-office', {
	at: 'the midwife who opens a birth',
	alt: 'Samsin alone on a blush-pink plane — white hair, blue chima, red sash — one midwife, not three',
	prompt:
		'Minimal iconic 16:9 poster. Samsin, midwife goddess of the living world. ONE geometric device: a vertical ribbon of blush-pink #e8b4c8 silk as a hard plane down the right third; she stands small in the remaining void, one adult woman, not a trio. Face matches the attached portrait: white hair, cream jeogori, royal-blue chima, red sash. Striking silky hanbok, few hues. Flat charcoal void. No army. No palace clutter. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
	refs: ['/ch_samsin.png']
});

setSlot(namseng.images, 'samsin-open-desire', {
	at: 'midwife of the living world',
	nsfw: true,
	alt: 'Samsin, one adult midwife, outgoing and openly warm — flushed laughing face, pink silk at the collarbone',
	prompt:
		'Intimate cinematic CLOSE-UP still, 16:9. Goddess Samsin, ONE adult midwife — not three women. ONE geometric device: her laughing face filling the left two-thirds; a blush-pink #e8b4c8 plane as the rest. Face matches the attached portrait: white hair, cream jeogori, red sash. Flushed cheeks, open smile, silk at the collarbone, outgoing heat. Personal. Flat charcoal void. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly.',
	refs: ['/ch_samsin.png']
});

setSlot(namseng.images, 'samsin-cascade', {
	alt: 'Samsin as a single life-cascade — white hair, blue-and-red hanbok, blush-pink plane',
	prompt:
		'Minimal iconic 16:9 poster. Samsin, one midwife goddess. ONE geometric device: a diagonal blush-pink #e8b4c8 cascade-plane; ONE adult woman in white hair and blue-red hanbok standing on it, not a trio. Face matches the attached portrait. Flat charcoal void. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
	refs: ['/ch_samsin.png']
});

const birthOpen = namseng.blocks.find(
	(b) => b.kind === 'p' && b.html?.includes('the three who open a birth')
);
if (!birthOpen) throw new Error('missing Samsin opening p');
birthOpen.html =
	"The Summit’s dust has barely settled when the Eastern hall fills with a different sound. For years the corridor had stayed too quiet — a nursery prepared, then put away, then prepared again — until even the servants learned to walk softly past doors that opened on empty rooms. <b>Yeon’s wife</b> labours beside a hanging portrait of the <b>Samsin</b> — the midwife who opens a birth — and the paint seems to warm.";
birthOpen.ko =
	'제가회의의 먼지가 채 가시기 전, 동부 전각에 다른 소리가 찬다. 몇 해 동안 복도는 지나치게 고요했다 — 아이 방을 차려 두고, 다시 치우고, 또 차려 두는 — 하인들조차 텅 빈 방 앞을 조용히 지나가는 법을 배울 때까지. <b>연씨부인</b>이 <b>삼신</b> — 출산을 여는 산파 — 의 초상 곁에서 해산하고, 그림 물감이 따뜻해지는 듯하다.';

const birthStep = namseng.blocks.find(
	(b) => b.kind === 'p' && b.html?.includes('three as one, midwife')
);
if (!birthStep) throw new Error('missing Samsin step p');
birthStep.html =
	'The portrait does not stay paint. <b>Samsin</b> steps from the frame the way steam steps from a kettle — one midwife of the living world under Little Star — and lays a hand where mortal hands have failed.';
birthStep.ko =
	'초상은 그림으로 남지 않는다. <b>삼신</b>이 주전자에서 김이 오르듯 액자에서 내려온다 — 소별왕 아래 이승의 산파 하나 — 그리고 사람의 손이 닿지 못한 곳에 손을 얹는다.';

const birthDlg = namseng.blocks.find((b) => b.kind === 'dialogue' && b.person === 'samsin');
if (!birthDlg) throw new Error('missing Samsin dialogue');
birthDlg.lines = ['울지 마.', '숨은 내가 열어 줄게.', '이름은 — 너희가 지어.'];
birthDlg.en = ['Do not weep.', 'I will open the breath.', 'The name — that is yours to give.'];
log.push('namseng: samsin singular prose + slots');

// ── 3. Gotaso purely in love ────────────────────────────────────────────
const gotaso = findEntry('Gotaso’s Wedding');

log.push(
	'gotaso slots: ' +
		insertAfter(gotaso.images, 'gotaso-love-longing', [
			{
				id: 'gotaso-love-gaze',
				ratio: 0.5625,
				tone: '#F0A3C0',
				at: 'weather they have decided to live in',
				alt: 'Dim close: Gotaso’s face fills the frame, looking with unguarded love — pink silk, one blue sleeve-edge',
				prompt:
					'Intimate cinematic CLOSE-UP still, 9:16. Princess Gotaso, in love. ONE geometric device: her face filling the frame, cropped at the right edge; a thin ice-blue #7EB8F0 sleeve-strip of Pumsuk at the far left only. Face matches the attached Gotaso portrait: oval face, dark bun, gold-pink binyeo, soft mouth. Dim lantern. Emotion on the face — warmth, not politics. Pink #F0A3C0 as the plane. Striking silky hanbok, few hues. Real adult proportions. Flat charcoal void. No army. No palace clutter. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
				refs: ['/ch_gotaso.png', '/ch_pumsuk.png'],
				people: ['gotaso', 'pumsuk']
			},
			{
				id: 'gotaso-pumsuk-warmth',
				ratio: 1.778,
				tone: '#F0A3C0',
				at: 'is your mouth on the inside of my wrist',
				alt: 'Tender two-shot: Gotaso and Pumsuk close in dim light — forehead warmth, her wrist in his hands, not a feast',
				prompt:
					'Intimate cinematic CLOSE-UP still, 16:9. Princess Gotaso and Hwarang Pumsuk, purely in love. ONE geometric device: a low horizontal crop — two faces in the lower third, foreheads almost touching; the rest a dim charcoal void. Faces match the attached portraits: her oval face and pink-gold binyeo; his dark swept hair, blue headband with a white crescent, ice-blue robe. Her wrist in his hands. Warmth, not cynicism. Pink #F0A3C0 as the single accent on silk. Striking silky hanbok, few hues. Dim. Real adult proportions. Flat charcoal void. No army. No palace clutter. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
				refs: ['/ch_gotaso.png', '/ch_pumsuk.png'],
				people: ['gotaso', 'pumsuk']
			},
			{
				id: 'gotaso-love-courtyard',
				ratio: 1.778,
				tone: '#F0A3C0',
				at: 'The courtyard goes very large',
				alt: 'Elegant wide: two tiny hanbok figures under a flowering-tree plane in a vast empty pink dusk courtyard',
				prompt:
					'Minimal iconic 16:9 poster. Gotaso and Pumsuk, in love. ONE geometric device: a flowering-tree canopy as a hard horizontal plane across the upper third; two tiny hanbok silhouettes in the lower courtyard, far apart from the camera. Faces match the attached portraits only as tiny likeness, not huge heads. Pink #F0A3C0 dusk plane; one ice-blue #7EB8F0 accent on his robe. Striking silky hanbok, wide sleeves, few hues. Monumental emptiness. Flat charcoal-pink void. No army. No palace clutter. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
				refs: ['/ch_gotaso.png', '/ch_pumsuk.png'],
				people: ['gotaso', 'pumsuk']
			}
		]).join(', ')
);

insertBlockAfterHtml(gotaso.blocks, 'Fifteen is exactly when you are allowed to use it.', [
	{
		kind: 'p',
		html: 'She looks at him the way a person looks at weather they have decided to live in — not bargaining, not counting rooms. Just the face.',
		ko: '그녀는 그를, 살기로 한 날씨를 보듯 본다 — 흥정하지 않고, 방을 세지 않고. 그저 그 얼굴.'
	}
]);

insertBlockAfterHtml(
	gotaso.blocks,
	'They meet again under the flowering trees behind the training ground',
	[
		{
			kind: 'p',
			html: 'Under the flowering trees they forget to be a princess and a Hwarang. The courtyard goes very large around two people who have not yet learned to be afraid of joy.',
			ko: '꽃나무 아래에서 그들은 공주와 화랑이기를 잊는다. 아직 기쁨을 두려워할 줄 모르는 두 사람 둘레로, 마당이 아주 커진다.'
		}
	]
);

// ── 4. Haemosu epic mythos ──────────────────────────────────────────────
const jumong = findEntry('Jumong');

log.push(
	'haemosu slots: ' +
		insertAfter(jumong.images, 'haemosu-sunrun', [
			{
				id: 'haemosu-gold-wedge',
				ratio: 1.778,
				tone: '#f0b429',
				at: 'keep the hour',
				alt: 'Gold wedge cutting a charcoal living-world; a tiny five-dragon chariot inside the wedge',
				prompt:
					'Minimal iconic 16:9 poster. Haemosu, sun god. ONE geometric device: a hard gold #f0b429 wedge from the upper-left, cutting a charcoal living-world; a tiny five-dragon sun-chariot inside the wedge, emblematic, not a close body. Face matches the attached portrait only as a tiny white-hair mark: silver-white topknot, white robe. Living-world red/charcoal. Flat kingdom sky, no clouds. Striking silky hanbok silhouette, wide sleeves. Monumental emptiness. No army. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
				refs: ['/ch_haemosu.png'],
				people: ['haemosu']
			},
			{
				id: 'haemosu-chariot-stamp',
				ratio: 1.778,
				tone: '#C94040',
				at: 'gold disc and five dragons',
				alt: 'Five-dragon chariot as a single gold stamp in the lower-right of a vast living-world red void',
				prompt:
					'Minimal iconic 16:9 poster. Haemosu, sun god. ONE geometric device: the five-dragon sun-chariot as a single gold #f0b429 stamp-seal in the lower-right corner; the rest a vast living-world red #C94040 plane. Tiny emblematic figure, white-hair topknot matching the attached portrait. Flat kingdom sky, no clouds. Striking silky white hanbok silhouette. Monumental emptiness. No army. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
				refs: ['/ch_haemosu.png'],
				people: ['haemosu']
			},
			{
				id: 'haemosu-wheel-arc',
				ratio: 1.778,
				tone: '#f0b429',
				at: 'the wheel cuts it',
				alt: 'Broken gold chariot-wheel as an incomplete arc at the right edge; tiny driver on a charcoal floor',
				prompt:
					'Minimal iconic 16:9 poster. Haemosu, sun god. ONE geometric device: a broken gold #f0b429 chariot-wheel as an incomplete arc cropped at the right edge; a tiny driver in the lower-left on a charcoal floor. Face matches the attached portrait only as a white-hair spark. Living-world red/charcoal. Flat kingdom sky, no clouds. Striking silky hanbok silhouette. Monumental emptiness. No army. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
				refs: ['/ch_haemosu.png'],
				people: ['haemosu']
			},
			{
				id: 'haemosu-path-strip',
				ratio: 1.778,
				tone: '#f0b429',
				at: 'stands in the chariot',
				alt: 'Low gold sun-path as a thin strip; tiny Haemosu standing in the chariot, living-world red above',
				prompt:
					'Minimal iconic 16:9 poster. Haemosu, sun god. ONE geometric device: a low gold #f0b429 sun-path as a thin horizontal strip across the bottom; tiny Haemosu standing in a five-dragon chariot on that strip; living-world red #C94040 filling the upper void. Face matches the attached portrait as a tiny white-hair topknot. Flat kingdom sky, no clouds. Striking silky white hanbok, wide sleeves. Monumental emptiness. No army. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
				refs: ['/ch_haemosu.png'],
				people: ['haemosu']
			}
		]).join(', ')
);

insertBlockAfterHtml(jumong.blocks, 'Haemosu</b>, god of the sun, looks down from the sky', [
	{
		kind: 'p',
		html: 'The sun-run is a gold disc and five dragons. He does not steer so much as keep the hour: a hard path across a living world that stays charcoal until the wheel cuts it.',
		ko: '해가 달리는 길은 금빛 원반과 용 다섯이다. 그는 부리기보다 시각을 지킨다. 숯빛으로 남아 있던 이승을, 바퀴가 베고 지나가는 단단한 길.'
	}
]);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(log.join('\n'));
