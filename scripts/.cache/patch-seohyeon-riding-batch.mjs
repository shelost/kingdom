/**
 * YEARS LATER: batch of goddess-riding-older-Seohyeon stills + unique Intimate ats.
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
	const marker = blocks[0]?.html?.slice(0, 40);
	if (
		marker &&
		entry.blocks.some((b) => (b.html ?? '').includes(marker))
	) {
		return false;
	}
	const i = entry.blocks.findIndex(
		(b, idx) => idx >= dayIdx && b.kind === 'p' && (b.html ?? '').includes(includes)
	);
	if (i < 0) throw new Error(`insertAfter miss: ${includes}`);
	entry.blocks.splice(i + 1, 0, ...blocks);
	return true;
}

// Unique riding / turn-taking prose for new ats (Intimate only)
insertAfter('She seats herself on him in the black bowl', [
	{
		kind: 'p',
		html: 'Sideways the ride reads clearer — coral hiked silk, bare older muscle under her, grey temples tipped back while she takes the depth she asked for.',
		ko: '옆에서 보면 타기가 더 분명하다 — 걷힌 산호 비단, 아래의 벗은 늙은 근육, 그녀가 청한 깊이로 앉는 동안 뒤로 젖혀진 회색 관자놀이.',
		nsfw: true
	}
]);

insertAfter('Then she rides — and the quiet of the spring dies', [
	{
		kind: 'p',
		html: 'From below she is a sky of ember heat — worm’s-eye on hiked coral hips and a climax face looking down at the man who was not supposed to keep up.',
		ko: '아래에서 보면 그녀는 불씨 열기의 하늘이다 — 걷힌 산호 허리와, 따라오지 못할 줄 알았던 남자를 내려다보는 절정 얼굴의 웜즈아이.',
		nsfw: true
	}
]);

insertAfter('The jokes thin out', [
	{
		kind: 'p',
		html: 'Over his shoulder her face fills the steam — still astride, still loud, watching him watch her while iron arms hold the pace.',
		ko: '그의 어깨 너머로 그녀의 얼굴이 김을 채운다 — 여전히 타고, 여전히 시끄럽고, 쇠 같은 팔이 속도를 잡는 동안 그를 바라본다.',
		nsfw: true
	},
	{
		kind: 'p',
		html: 'Face and hips in one crop: her open mouth, hiked coral, his wet bare chest — the old body answering under her.',
		ko: '얼굴과 허리가 한 프레임: 벌어진 입, 걷힌 산호, 그의 젖은 맨가슴 — 아래에서 대답하는 늙은 몸.',
		nsfw: true
	}
]);

insertAfter('Lines give way to breath', [
	{
		kind: 'p',
		html: 'Narim takes her turn astride him — leaf silk hiked, eldest composure cracked open mid-gasp, floating leaves shaking with her breath. The hill’s scolding voice does not finish a sentence.',
		ko: '나림이 번갈아 탄다 — 걷힌 잎빛 비단, 헐떡임 속에 갈라진 언니의 침착, 숨과 함께 떠는 뜬 잎. 언덕의 꾸짖는 목소리는 문장을 끝내지 못한다.',
		nsfw: true
	},
	{
		kind: 'p',
		html: 'Corner of the cavern: Narim still astride, elder face broken into pleasure against his grey temple — she did not expect the stamina either.',
		ko: '동굴 구석: 나림이 여전히 타고, 회색 관자놀이에 맞댄 언니 얼굴이 쾌락으로 부서진다 — 그도 스태미나를 예상하지 못했다.',
		nsfw: true
	}
]);

insertAfter('They take turns astride him until the spring forgets who started', [
	{
		kind: 'p',
		html: 'Hyullé’s turn: knees that started tight finally open enough to seat herself astride — teal silk hiked, gaze down, wrecked silence breaking only in breath against his wet chest.',
		ko: '휼레의 차례: 처음에 모였던 무릎이 겨우 벌어져 올라탄다 — 걷힌 청록 비단, 내린 시선, 젖은 가슴에 숨으로만 깨지는 무너진 침묵.',
		nsfw: true
	},
	{
		kind: 'p',
		html: 'Front view of Golhwa still claiming him between turns — coral astride, climax flush, the First Kim’s bare older frame under her like the joke never landed.',
		ko: '번갈아 타는 사이에도 골화가 앞에서 그를 차지한다 — 산호로 올라탄 채, 절정 홍조, 농담이 먹히지 않은 듯 아래의 첫 김씨 벗은 늙은 몸.',
		nsfw: true
	},
	{
		kind: 'p',
		html: 'Narim again after Golhwa — turn-taking without a census, leaf silk astride wet muscle, eldest gasp where the tease used to be.',
		ko: '골화 다음 다시 나림 — 인구조사 없는 교대, 젖은 근육 위 잎빛 비단, 놀림 있던 자리에 언니의 헐떡임.',
		nsfw: true
	}
]);

const slots = [
	{
		id: 'seohyeon-older-golhwa-ride-side',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'Sideways the ride reads clearer',
		alt: 'Side angle: Golhwa astride naked older Seohyeon — hiked coral, climax flush',
		prompt: 'Side astride Golhwa + bare older Seohyeon. Ember. Magical aura. No text. No watermark.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-golhwa-ride-worm',
		ratio: 0.5625,
		tone: '#e86820',
		nsfw: true,
		at: 'From below she is a sky of ember heat',
		alt: "Worm's-eye: Golhwa above naked older Seohyeon mid-ride",
		prompt: "Worm's-eye Golhwa astride. Ember. Magical aura. No text. No watermark.",
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-golhwa-ride-over',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'Over his shoulder her face fills the steam',
		alt: 'Over-shoulder: Golhwa astride facing him — climax face',
		prompt: 'Over-shoulder Golhwa astride. Ember. Magical aura. No text. No watermark.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-golhwa-ride-hips',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'Face and hips in one crop',
		alt: 'Face+hips crop: Golhwa riding naked older Seohyeon',
		prompt: 'Face and hips Golhwa ride. Ember. Magical aura. No text. No watermark.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-golhwa-ride-front',
		ratio: 0.5625,
		tone: '#e86820',
		nsfw: true,
		at: 'Front view of Golhwa still claiming him between turns',
		alt: 'Front/vertical: Golhwa astride naked older Seohyeon',
		prompt: 'Front Golhwa astride. Ember. Magical aura. No text. No watermark.',
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-narim-ride',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'Narim takes her turn astride him',
		alt: 'Narim astride naked older Seohyeon — elder composure cracked',
		prompt: 'Narim astride. Leaf. Magical aura. No text. No watermark.',
		refs: [narim, bnN, seo, cave],
		people: ['narim', 'seohyeon']
	},
	{
		id: 'seohyeon-older-narim-ride-side',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'Corner of the cavern: Narim still astride',
		alt: 'Corner: Narim astride naked older Seohyeon — elder pleasure break',
		prompt: 'Corner Narim astride. Leaf. Magical aura. No text. No watermark.',
		refs: [narim, bnN, seo, cave],
		people: ['narim', 'seohyeon']
	},
	{
		id: 'seohyeon-older-turn-narim',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'Narim again after Golhwa',
		alt: 'Turn-taking: Narim astride after Golhwa',
		prompt: 'Turn Narim astride. Leaf. Magical aura. No text. No watermark.',
		refs: [narim, bnN, seo, cave],
		people: ['narim', 'seohyeon']
	},
	{
		id: 'seohyeon-older-hyulle-ride',
		ratio: 1.778,
		tone: '#2eb8c4',
		nsfw: true,
		at: 'Hyullé’s turn: knees that started tight finally open enough to seat herself astride',
		alt: 'Hyullé riding naked older Seohyeon — shy wrecked downcast',
		prompt: 'Hyullé ride. Teal. Magical aura. No text. No watermark.',
		refs: [hyulle, bnH, seo, cave],
		people: ['hyulle', 'seohyeon']
	},
	{
		id: 'seohyeon-older-hyulle-ride-astride',
		ratio: 1.778,
		tone: '#2eb8c4',
		nsfw: true,
		at: 'teal silk hiked, gaze down, wrecked silence breaking only in breath',
		alt: 'Hyullé clearly astride naked older Seohyeon — teal hiked silk',
		prompt: 'Hyullé astride. Teal. Magical aura. No text. No watermark.',
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

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
fs.writeFileSync(PEOPLE, JSON.stringify(imagePeople, null, '\t') + '\n');

const missing = [];
for (const im of slots) {
	const hit = entry.blocks.some((b) => {
		const t = [b.html, b.ko, ...(b.lines ?? []), ...(b.en ?? [])].filter(Boolean).join(' ');
		return t.includes(im.at);
	});
	if (!hit) missing.push(`${im.id} -> ${im.at}`);
}
console.log('riding slots', slots.map((s) => s.id).join(', '));
if (missing.length) {
	console.error('ANCHOR MISS', missing);
	process.exit(1);
}
console.log('anchors ok');
