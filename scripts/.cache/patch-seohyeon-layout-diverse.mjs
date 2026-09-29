/**
 * YEARS LATER: tease→quiet→pant→overcome arc + layout-diverse Intimate stills
 * (no centered-Seohyeon harem halo).
 */
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

const entry = findEntry('The First Kim');
const dayIdx = entry.blocks.findIndex((b) => b.kind === 'day' && b.label === 'YEARS LATER');
if (dayIdx < 0) throw new Error('YEARS LATER missing');

const golhwa = '/ch_golhwa.png';
const narim = '/ch_narim.png';
const hyulle = '/ch_hyullé.png';
const seo = '/ch_kim_seohyun.png';
const bnG = '/bn_golhwa.png';
const bnN = '/bn_narim.png';
const bnH = '/bn_hyulle.png';
const cave = '/pl_cave.png';

function insertAfter(includes, blocks) {
	const marker = blocks[0]?.html?.slice(0, 36) || blocks[0]?.en?.[0] || blocks[0]?.lines?.[0];
	if (marker && entry.blocks.some((b) => {
		const t = [b.html, ...(b.en ?? []), ...(b.lines ?? [])].filter(Boolean).join(' ');
		return t.includes(marker);
	})) {
		return false;
	}
	const i = entry.blocks.findIndex(
		(b, idx) => idx >= dayIdx && b.kind === 'p' && (b.html ?? '').includes(includes)
	);
	if (i < 0) throw new Error(`insertAfter miss: ${includes}`);
	entry.blocks.splice(i + 1, 0, ...blocks);
	return true;
}

// --- Tease → quiet → pant → overcome (Intimate only) ---
insertAfter('Golhwa climbs into his lap first', [
	{
		kind: 'p',
		html: 'They tease him first — centuries of hunger looking at grey temples as if age were a joke they could still tell out loud. Golhwa loudest. Narim cutting. Hyullé almost silent, which is worse.',
		ko: '먼저 놀린다 — 회색 관자놀이를 보고 수백 년 허기가 나이를 아직도 큰 소리로 말할 수 있는 농담처럼 여긴다. 골화가 제일 시끄럽다. 나림은 짧게 자른다. 휼레는 거의 말이 없고, 그게 더 나쁘다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#e86820',
		person: 'golhwa',
		en: ['Grey already?', 'Can that old body keep up with three of us?', 'Don’t break, First Kim—'],
		lines: ['벌써 세었어?', '그 늙은 몸으로 우리 셋을 감당하겠어?', '부러지지 마, 첫 김씨—'],
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#3d9e52',
		person: 'narim',
		en: ['The hill remembers a younger walk.', 'Tonight we will see what is left.'],
		lines: ['언덕은 더 젊은 걸음을 기억한다.', '오늘 밤, 뭐가 남았는지 보자.'],
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#2eb8c4',
		person: 'hyulle',
		en: ['…Hm.'],
		lines: ['…흠.'],
		nsfw: true
	},
	{
		kind: 'p',
		html: 'He takes it. Most receptive man in the steam — jaw quiet, hands already on wet hips — and does not argue with goddesses who have waited longer than bone-rank.',
		ko: '그는 받는다. 김 속에서 제일 잘 받아들이는 남자 — 턱은 고요하고, 손은 이미 젖은 허리에 — 골품보다 오래 기다린 여신들과 말다툼하지 않는다.',
		nsfw: true
	}
]);

insertAfter('Then she rides — and the quiet of the spring dies', [
	{
		kind: 'p',
		html: 'The jokes thin out. His arms are still iron under wet skin. Grey at the temples — and the spring learns the difference between old face and old strength. He holds her through a drop of hips that was supposed to mock him and does not ask permission to set the pace.',
		ko: '농담이 얇아진다. 젖은 피부 아래 팔은 아직도 쇠다. 관자놀이는 회색 — 그리고 샘은 늙은 얼굴과 늙은 힘의 차이를 배운다. 놀리려던 허리 낙폭을 그가 받아 안은 채, 속도를 정하는 데 허락을 묻지 않는다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#e86820',
		person: 'golhwa',
		en: ['Wait—', 'Your hands—'],
		lines: ['잠깐—', '손—'],
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#3d9e52',
		person: 'narim',
		en: ['…Still hard.'],
		lines: ['…아직 단단하구나.'],
		nsfw: true
	}
]);

insertAfter('Hips pressed together in the water', [
	{
		kind: 'p',
		html: 'Lines give way to breath. No more census of his years — only the sound of three goddesses learning they miscounted the man under them. Muscle that should have softened doesn’t. Stamina that should have thinned doesn’t. He moves them when he wants them moved.',
		ko: '말이 숨으로 바뀐다. 더 이상 나이를 세지 않는다 — 자기 아래 남자를 잘못 센 여신 셋의 숨소리만. 물러졌어야 할 근육이 안 물러진다. 얇아졌어야 할 스태미나가 안 얇아진다. 그가 옮기고 싶을 때 그들을 옮긴다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#e86820',
		person: 'golhwa',
		en: ['Hah—', 'Hah—', 'Fuck—'],
		lines: ['하아—', '하아—', '씨—'],
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#3d9e52',
		person: 'narim',
		en: ['Ah—', 'Ah—'],
		lines: ['아—', '아—'],
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#2eb8c4',
		person: 'hyulle',
		en: ['…Nn—'],
		lines: ['…응—'],
		nsfw: true
	}
]);

insertAfter('They finish together', [
	{
		kind: 'p',
		html: 'Overcome. Not polite. The tease is gone — burned out of their mouths. Virile strength at old age holds them through the break: he comes with her and keeps them from falling wrong, grey hair wet against coral silk, and Golhwa’s loud cruelty collapses into wrecked pleasure she cannot dress as a joke.',
		ko: '압도. 공손하지 않다. 놀림은 사라졌다 — 입에서 타 버렸다. 노년의 정력이 무너지는 순간에도 붙잡는다: 함께 싸며 잘못 쓰러지지 않게 붙들고, 회색 머리가 산호 비단에 젖고, 골화의 시끄러운 잔인함은 농담으로 꾸밀 수 없는 무너진 쾌락이 된다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#e86820',
		person: 'golhwa',
		en: ['I—', 'I can’t—', 'Daddy—!'],
		lines: ['나—', '안 돼—', '오빠—!'],
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#3d9e52',
		person: 'narim',
		en: ['Forgive—', 'the eldest was wrong—'],
		lines: ['용서해—', '언니가 틀렸어—'],
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#2eb8c4',
		person: 'hyulle',
		en: ['…Ah—!'],
		lines: ['…아—!'],
		nsfw: true
	}
]);

// Layout / lookback anchors for diverse stills
insertAfter('They take turns astride him until the spring forgets who started', [
	{
		kind: 'p',
		html: 'She looks back over her shoulder while he stays behind her in the black bowl — arched back, hiked coral silk, climax flush catching ember light. The spring sees her face, not a polite court portrait.',
		ko: '검은 사발에서 그가 뒤에 있는 동안 그녀는 어깨 너머로 돌아본다 — 활처럼 휜 등, 걷힌 산호빛 비단, 불씨 빛에 잡히는 절정 홍조. 샘은 공손한 초상이 아니라 그 얼굴을 본다.',
		nsfw: true
	}
]);

insertAfter('Two kissing while one rides', [
	{
		kind: 'p',
		html: 'Sister mouths find sister mouths in the steam — open, wet, tongues brief and hungry — while the ride under them does not stop.',
		ko: '김 속에서 언니의 입이 언니의 입을 찾는다 — 벌어진 채, 젖은 채, 짧고 배고픈 혀 — 그 아래의 타기는 멈추지 않는다.',
		nsfw: true
	}
]);

insertAfter('shadow puppets on stone', [
	{
		kind: 'p',
		html: 'Another wall shows them in side profile only — arched back, close behind, hip curve as a single black stamp on wet stone.',
		ko: '다른 벽은 옆모습만 보여 준다 — 활처럼 휜 등, 바로 뒤, 젖은 돌 위 검은 도장 같은 엉덩이 곡선.',
		nsfw: true
	}
]);

insertAfter('They finish again — not one climax, a chain', [
	{
		kind: 'p',
		html: 'Once the frame drops to her face over his bare chest only — stacked close, no room for the other sisters in the crop — the cavern feels smaller than their mouths.',
		ko: '프레임이 맨가슴 위 그녀의 얼굴만으로 줄어들면 — 쌓인 근접, 다른 언니가 들어갈 자리 없음 — 동굴이 입보다 작아진다.',
		nsfw: true
	}
]);

const slots = [
	{
		id: 'seohyeon-older-tease',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'They tease him first',
		alt: 'Corner crop: Golhwa teasing smirk at older Seohyeon — grey temples, before the jokes die',
		prompt: 'Corner-crop tease duo. Golhwa wicked smirk. Older bare Seohyeon. Ember. Magical aura. No text. No watermark.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-overcome',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'Overcome. Not polite',
		alt: 'Over-shoulder: Golhwa wrecked pleasure face, older Seohyeon holding her — virility at old age',
		prompt: 'Over-shoulder overcome duo. Golhwa wrecked climax face. Older bare Seohyeon arms. Ember. Magical aura. No text. No watermark.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-kiss',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'She kisses him like she has been waiting decades',
		alt: 'Extreme close: Golhwa and older Seohyeon deep French kiss — mouths open, faces fill frame',
		prompt: 'Extreme close French kiss. Faces fill frame. Magical aura. No text. No watermark.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-hips',
		ratio: 0.5625,
		tone: '#e86820',
		nsfw: true,
		at: 'Hips pressed together in the water',
		alt: "Worm's-eye: Golhwa above older Seohyeon in black spring",
		prompt: "Worm's-eye 9:16. Golhwa above bare older Seohyeon. Magical aura. No text. No watermark.",
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-narim-alone',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'Narim’s breath goes late on his lined cheek',
		alt: 'One-on-one: Narim alone with older Seohyeon — side crop',
		prompt: 'Narim one-on-one side crop. Leaf. Magical aura. No text. No watermark.',
		refs: [narim, bnN, seo, cave],
		people: ['narim', 'seohyeon']
	},
	{
		id: 'seohyeon-older-hyulle-alone',
		ratio: 1.778,
		tone: '#2eb8c4',
		nsfw: true,
		at: 'Hyullé’s knees finally part enough to climb',
		alt: 'One-on-one: Hyullé alone climbing onto older Seohyeon',
		prompt: 'Hyullé one-on-one. Teal. Magical aura. No text. No watermark.',
		refs: [hyulle, bnH, seo, cave],
		people: ['hyulle', 'seohyeon']
	},
	{
		id: 'seohyeon-older-pov-doggy',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'She looks back over her shoulder while he stays behind her',
		alt: 'Over-shoulder lookback: Golhwa toward camera, older Seohyeon behind',
		prompt: 'Over-shoulder lookback duo. Magical aura. No text. No watermark.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-sister-kiss',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'Sister mouths find sister mouths in the steam',
		alt: 'Extreme close: Golhwa and Hyullé deep French kiss',
		prompt: 'Goddess-goddess French kiss close. Magical aura. No text. No watermark.',
		refs: [golhwa, hyulle, bnG, bnH, cave],
		people: ['golhwa', 'hyulle']
	},
	{
		id: 'seohyeon-older-ontop-stack',
		ratio: 0.5625,
		tone: '#e86820',
		nsfw: true,
		at: 'Once the frame drops to her face over his bare chest only',
		alt: 'Stacked vertical: Golhwa over bare older Seohyeon chest',
		prompt: '9:16 stacked her-on-top. Magical aura. No text. No watermark.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-corner-ride',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'They take turns astride him until the spring forgets who started',
		alt: 'Corner crop: Golhwa astride older Seohyeon — vast steam empty right',
		prompt: 'Corner-crop ride duo. Magical aura. No text. No watermark.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-wall-side',
		ratio: 1.778,
		tone: '#2eb8c4',
		nsfw: true,
		at: 'Another wall shows them in side profile only',
		alt: 'Cave-wall shadow: side-profile intimate silhouettes',
		prompt: 'Cave-wall side-profile shadows. Cyan. pl_cave. No text. No watermark.',
		refs: [cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-ride',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'She seats herself on him in the black bowl',
		alt: 'Duo ride: Golhwa against naked older Seohyeon',
		prompt: 'Duo ride. Magical aura. No text. No watermark.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-straddle',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'Golhwa climbs into his lap first',
		alt: 'Duo straddle into lap',
		prompt: 'Duo straddle. Magical aura. No text. No watermark.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-climax-duo',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'They finish together',
		alt: 'Duo climax astride',
		prompt: 'Duo climax. Magical aura. No text. No watermark.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-wall-doggy',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'shadow puppets on stone',
		alt: 'Cave-wall shadow: hands-and-knees silhouette',
		prompt: 'Wall doggy shadow. Ember. pl_cave. No text. No watermark.',
		refs: [cave, golhwa, seo],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-wall-straddle',
		ratio: 1.778,
		tone: '#2eb8c4',
		nsfw: true,
		at: 'a straddling pile',
		alt: 'Cave-wall straddling silhouette',
		prompt: 'Wall straddle shadow. Cyan. No text. No watermark.',
		refs: [cave],
		people: ['hyulle', 'seohyeon']
	},
	{
		id: 'seohyeon-older-wall-orgy',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'tangled four-body outlines',
		alt: 'Cave-wall tangled multi-body silhouettes',
		prompt: 'Wall tangled shadows. Leaf. No text. No watermark.',
		refs: [cave],
		people: ['golhwa', 'narim', 'hyulle', 'seohyeon']
	},
	// Retarget old center-halo slots → diverse layouts (clear duplicate ats below)
	{
		id: 'seohyeon-older-orgy-tangle',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'She looks back over her shoulder while he stays behind her',
		alt: 'Over-shoulder lookback (replaces centered tangle halo)',
		prompt: 'Lookback duo.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-ride-pile',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'They take turns astride him until the spring forgets who started',
		alt: 'Corner-crop ride (replaces centered ride-pile halo)',
		prompt: 'Corner ride.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-orgy-pile',
		ratio: 0.5625,
		tone: '#e86820',
		nsfw: true,
		at: 'Once the frame drops to her face over his bare chest only',
		alt: 'Stacked vertical her-on-top (replaces centered orgy-pile halo)',
		prompt: 'Stack vertical.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-orgy-faces',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'Sister mouths find sister mouths in the steam',
		alt: 'Sister French kiss (replaces centered orgy-faces halo)',
		prompt: 'Sister kiss.',
		refs: [golhwa, hyulle, bnG, bnH, cave],
		people: ['golhwa', 'hyulle']
	},
	{
		id: 'seohyeon-older-orgy-kiss-ride',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'Two kissing while one rides',
		alt: 'Deep French kiss faces fill frame (replaces soft kiss-ride halo)',
		prompt: 'French kiss close.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-sisters-join',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'The sisters leave their rock',
		alt: 'Narim one-on-one join (replaces centered sisters-join halo)',
		prompt: 'Narim alone join.',
		refs: [narim, bnN, seo, cave],
		people: ['narim', 'seohyeon']
	},
	{
		id: 'seohyeon-older-narim-fail',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'the eldest fails into it',
		alt: 'Narim one-on-one — elder composure failing',
		prompt: 'Narim alone.',
		refs: [narim, bnN, seo, cave],
		people: ['narim', 'seohyeon']
	},
	{
		id: 'seohyeon-older-hyulle-climb',
		ratio: 1.778,
		tone: '#2eb8c4',
		nsfw: true,
		at: 'Hyullé’s knees finally part enough to climb',
		alt: 'Hyullé one-on-one climb',
		prompt: 'Hyullé alone.',
		refs: [hyulle, bnH, seo, cave],
		people: ['hyulle', 'seohyeon']
	},
	{
		id: 'seohyeon-older-close',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'Narim’s breath goes late on his lined cheek',
		alt: 'Narim cheek-close one-on-one',
		prompt: 'Narim close.',
		refs: [narim, bnN, seo, cave],
		people: ['narim', 'seohyeon']
	},
	{
		id: 'seohyeon-older-hyulle-press',
		ratio: 1.778,
		tone: '#2eb8c4',
		nsfw: true,
		at: 'Hyullé watches with her knees still pressed',
		alt: 'Hyullé shy one-on-one press',
		prompt: 'Hyullé press.',
		refs: [hyulle, bnH, seo, cave],
		people: ['hyulle', 'seohyeon']
	}
];

function upsert(slot) {
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) Object.assign(entry.images[i], slot);
	else entry.images.push(slot);
	imagePeople[slot.id] = slot.people;
}

for (const slot of slots) upsert(slot);

const prefer = new Set([
	'seohyeon-older-tease',
	'seohyeon-older-overcome',
	'seohyeon-older-pov-doggy',
	'seohyeon-older-corner-ride',
	'seohyeon-older-ontop-stack',
	'seohyeon-older-sister-kiss',
	'seohyeon-older-narim-alone',
	'seohyeon-older-hyulle-alone',
	'seohyeon-older-wall-side',
	'seohyeon-older-kiss',
	'seohyeon-older-hips',
	'seohyeon-older-ride',
	'seohyeon-older-climax-duo',
	'seohyeon-older-straddle',
	'seohyeon-older-wall-doggy',
	'seohyeon-older-wall-straddle',
	'seohyeon-older-wall-orgy'
]);
const seenAt = new Map();
for (const im of entry.images) {
	if (!im.id?.startsWith('seohyeon-older') || !im.at) continue;
	if (!seenAt.has(im.at)) {
		seenAt.set(im.at, im.id);
		continue;
	}
	const first = seenAt.get(im.at);
	if (prefer.has(im.id) && !prefer.has(first)) {
		const other = entry.images.find((x) => x.id === first);
		if (other) delete other.at;
		seenAt.set(im.at, im.id);
	} else if (!prefer.has(im.id)) {
		delete im.at;
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
fs.writeFileSync(PEOPLE, JSON.stringify(imagePeople, null, '\t') + '\n');

const missing = [];
for (const im of entry.images) {
	if (!im.id?.startsWith('seohyeon-older') || !im.at) continue;
	const hit = entry.blocks.some((b) => {
		const t = [b.html, b.ko, ...(b.lines ?? []), ...(b.en ?? []), b.label].filter(Boolean).join(' ');
		return t.includes(im.at);
	});
	if (!hit) missing.push(`${im.id} -> ${im.at}`);
}
console.log('upserted', slots.length, 'slots');
if (missing.length) {
	console.error('ANCHOR MISS', missing);
	process.exit(1);
}
console.log('anchors ok');
