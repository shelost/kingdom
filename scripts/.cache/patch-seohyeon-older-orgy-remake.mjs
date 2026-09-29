/**
 * Remake YEARS LATER art to actually read as a foursome orgy:
 * naked Seohyeon, multi-body riding, cave-wall sex silhouettes, milk-spent aftermath.
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
const triadRefs = [golhwa, narim, hyulle, bnG, bnN, bnH, seo, cave];
const triadPeople = ['golhwa', 'narim', 'hyulle', 'seohyeon'];

// Insert wall-silhouette + milk-spent prose before final afterglow
const afterglowIdx = entry.blocks.findIndex(
	(b, i) => i >= dayIdx && b.kind === 'p' && (b.html ?? '').includes('Afterwards they tremble in the steam')
);
if (afterglowIdx < 0) throw new Error('afterglow p missing');

const insertBlocks = [
	{
		kind: 'p',
		html: 'The wet cave wall keeps a second show. Ember light throws their bodies as shadow puppets on stone — one silhouette on hands and knees, another mounting from behind; a straddling pile; tangled four-body outlines so clear a stranger would know the pose without seeing skin. The wall is filthier than the water.',
		ko: '젖은 동굴 벽이 두 번째 공연을 한다. 불씨 빛이 몸을 돌 위 그림자놀이로 던진다 — 손과 무릎의 실루엣, 뒤에서 올라타는 실루엣; 올라탄 더미; 피부 없이도 자세를 알 네 몸 윤곽. 벽이 물보다 더럽다.',
		nsfw: true
	},
	{
		kind: 'p',
		html: 'They take turns astride him until the spring forgets who started. Full hips, legs spread, fallen silk as the only cover. Mouths on mouths. Hands on wet muscle. He stays naked under them — grey temples, bare chest, no headband — and the night keeps riding.',
		ko: '누가 시작했는지 샘이 잊을 때까지 번갈아 탄다. 풍만한 허리, 벌린 다리, 덮개로는 떨어진 비단뿐. 입에 입. 젖은 근육에 손. 그는 그 아래에서 계속 벗은 채다 — 회색 관자놀이, 맨가슴, 머리띠 없음 — 밤은 계속 탄다.',
		nsfw: true
	},
	{
		kind: 'p',
		html: 'Dawn finds them passed out in the black bowl. Three goddesses limp with spent heat — messy hair, hiked hems, open jeogoris — pearlescent drips and white fluid sheen on stomachs and inner thighs, spent glaze catching the last steam. He is still bare under the pile. Milk of the night everywhere the silk failed to cover. Nobody speaks. Nobody can.',
		ko: '새벽이 검은 사발에서 기절한 그들을 찾는다. 여신 셋이 다 쓴 열기로 축 늘어져 — 헝클어진 머리, 걷힌 단, 벌어진 저고리 — 배와 허벅지 안쪽에 진주빛 방울과 흰 액의 광택, 마지막 김에 잡히는 잔광. 그는 더미 아래에서 아직 벗었다. 비단이 못 가린 곳에 밤의 젖이 있다. 말이 없다. 할 수도 없다.',
		nsfw: true
	}
];

// Avoid double-insert if re-run
const already = entry.blocks.some(
	(b) => b.kind === 'p' && (b.html ?? '').includes('The wet cave wall keeps a second show')
);
if (!already) {
	entry.blocks.splice(afterglowIdx, 0, ...insertBlocks);
}

const MAN_NAKED =
	'He is fully unclothed bathing body: wet muscular older East Asian male torso, abs, shoulders, arms accentuated, grey temples, wet loose hair, NO headband, NO ribbon, NO hanbok, NO court silk, NO armor. FACE ONLY from attached Seohyeon portrait aged. Bright-blue #3E8EF0 rim on wet skin.';

const GODDESS_LESS =
	'Goddesses wear almost nothing of house silk left: white jeogoris fallen open or off shoulders, chima hiked high around hips as thin bunched cover only, mostly bare wet skin, full hips, spread thighs, wet silk clinging. Faces and binyeo match attached portraits when visible.';

const slots = [
	{
		id: 'seohyeon-older-orgy-tangle',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'Four bodies in the black bowl',
		alt: 'Foursome tangle: three hiked-silk goddesses + naked older Seohyeon overlapping — hands mouths riding',
		prompt: `Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. manhwa panel, erotic comic framing, heavy blush, heart pupils, sweat drop, climax expression. Wild adult foursome in black spring: THREE luminous goddesses + ONE painterly older naked man tangled together — overlapping limbs, hands on wet skin, mouths close, at least one goddess seated astride him. ${GODDESS_LESS} Coral ember #e86820, leaf #3d9e52, teal #2eb8c4 accents. ${MAN_NAKED} Dim attached cavern. Multi-body orgy readable at a glance. Waist-up-to-hips framing. Tasteful silk cover only, no explicit genitals. No text. No watermark.`,
		refs: triadRefs,
		people: triadPeople
	},
	{
		id: 'seohyeon-older-ride-pile',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'They take turns astride him',
		alt: 'Riding pile: goddess astride naked older Seohyeon while sisters press in — hiked silk, wet muscle',
		prompt: `Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. manhwa panel, erotic comic framing, heavy blush, heart pupils, sweat drop, climax expression. Clear RIDING orgy: luminous adult goddess seated astride a painterly older naked man in black spring, hips pressed, legs spread, chima hiked high; two sister goddesses pressed close kissing and touching, overlapping. ${GODDESS_LESS} ${MAN_NAKED} Accentuate his wet muscular chest and shoulders under them. Ember/leaf/teal auras. Dim attached cavern. Orgy-readable multi-body. Waist-up. Tasteful silk cover, no explicit genitals. No text. No watermark.`,
		refs: triadRefs,
		people: triadPeople
	},
	{
		id: 'seohyeon-older-orgy-kiss-ride',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'Two kissing while one rides',
		alt: 'Orgy: one goddess rides naked older Seohyeon while two kiss — tangled wet silk and muscle',
		prompt: `Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. manhwa panel, erotic comic framing, heavy blush, heart pupils, sweat drop. Adult orgy beat: one luminous goddess straddling / seated astride painterly older NAKED man (hips pressed, hiked chima), while two other goddesses kiss mouth-to-mouth beside them, hands on his bare wet chest and shoulders. ${GODDESS_LESS} ${MAN_NAKED} Four bodies visible. Dim attached cavern. Orgy-readable. Waist-up. Tasteful silk cover, no explicit genitals. No text. No watermark.`,
		refs: triadRefs,
		people: triadPeople
	},
	{
		id: 'seohyeon-older-orgy-pile',
		ratio: 1.778,
		tone: '#3E8EF0',
		nsfw: true,
		at: 'Steam turns the four into one silhouette pile',
		alt: 'Dense orgy pile in steam: three goddesses tangled on naked older Seohyeon — skin and hiked silk',
		prompt: `Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. Dense multi-body orgy pile in cavern steam: three luminous goddesses tangled over and around a painterly older NAKED man — straddling legs, pressed chests, overlapping arms, mouths near skin. ${GODDESS_LESS} ${MAN_NAKED} His wet muscular body must read clearly under the pile. Coral/leaf/teal accents. Dim attached cavern. Orgy-readable, not a soft fog abstract. Waist-up. Tasteful, no explicit genitals. No text. No watermark.`,
		refs: triadRefs,
		people: triadPeople
	},
	{
		id: 'seohyeon-older-wall-doggy',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'shadow puppets on stone',
		alt: 'Cave-wall shadow puppet: doggy-style mounting pose silhouette on wet stone',
		prompt:
			'Wide cinematic cavern still, 16:9. ICONIC / MINIMAL EPIC. Magical aura, anime-painterly cavern spirit, not photoreal. ONE geometric device: a vast wet black cave wall as a hard plane lit by a single ember shaft #e86820. On the wall: clear dark SHADOW-PUPPET silhouettes of two adult figures in an unmistakable hands-and-knees mounting pose from behind — readable porn pose body language as shadow only, plush hip curve in outline, no faces, no skin detail, no anatomy. Optional tiny real steam figures blurred far below. Monumental stone emptiness. No text. No watermark. Graphic color-blocking.',
		refs: [cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-wall-straddle',
		ratio: 1.778,
		tone: '#2eb8c4',
		nsfw: true,
		at: 'a straddling pile',
		alt: 'Cave-wall shadow: straddling sex-pose silhouette pile on wet stone',
		prompt:
			'Wide cinematic cavern still, 16:9. ICONIC / MINIMAL EPIC. Magical aura, anime-painterly. ONE geometric device: wet cave wall as hard plane, cyan water-light #2eb8c4 shaft. Large dark shadow-puppet silhouettes: one adult figure seated astride another — clear straddling sex-pose body language, full-hip outline, no faces, no skin detail. Shadow only. Dim stone. No text. No watermark. Graphic anime-painterly.',
		refs: [cave],
		people: ['hyulle', 'seohyeon']
	},
	{
		id: 'seohyeon-older-wall-orgy',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'tangled four-body outlines',
		alt: 'Cave-wall shadow: four tangled adult silhouettes in orgy poses on stone',
		prompt:
			'Wide cinematic cavern still, 16:9. ICONIC / MINIMAL EPIC. Magical aura, anime-painterly. ONE geometric device: wet cave wall plane with leaf-green #3d9e52 rim light. Dark shadow-puppet silhouettes of FOUR adult figures tangled — straddling, pressing, hands-and-knees outline among them — readable orgy pose cluster as shadow only, no faces, no skin detail. Monumental stone. No text. No watermark. Graphic color-blocking.',
		refs: [cave],
		people: triadPeople
	},
	{
		id: 'seohyeon-older-milk-spent',
		ratio: 1.778,
		tone: '#3E8EF0',
		nsfw: true,
		at: 'Dawn finds them passed out',
		alt: 'Aftermath: three goddesses passed out on naked older Seohyeon — pearlescent drips, spent glaze',
		prompt: `Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. Aftermath orgy: three luminous goddesses passed out / limp asleep tangled on a painterly older NAKED man in black spring — messy hair, hiked fallen silk, open jeogoris, legs still loosely spread. Pearlescent drips and white fluid sheen / spent glaze on stomachs, skin, and inner thighs catching steam light. Soft spent faces. Faces match attached portraits when visible. ${MAN_NAKED} Dim attached cavern. Waist-up. Tasteful implication, no explicit genitals. No text. No watermark.`,
		refs: triadRefs,
		people: triadPeople
	},
	{
		id: 'seohyeon-older-afterglow',
		ratio: 1.778,
		tone: '#3E8EF0',
		nsfw: true,
		at: 'Afterwards they tremble in the steam',
		alt: 'Afterglow orgy: naked older Seohyeon under three spent goddesses — pearlescent sheen, hiked silk',
		prompt: `Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. Aftermath mood: painterly older NAKED East Asian man grey temples under three spent luminous goddesses trembling against him — Golhwa legs still open hiked coral silk, Hyullé wrecked teal, Narim breathless leaf. Pearlescent sheen on skin and thighs. ${GODDESS_LESS} ${MAN_NAKED} Dim attached cavern. Multi-body readable. Waist-up. Tasteful. No text. No watermark.`,
		refs: triadRefs,
		people: triadPeople
	},
	{
		id: 'seohyeon-older-climax-duo',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'They finish together',
		alt: 'Simultaneous climax: Golhwa astride naked older Seohyeon — climax faces, hiked chima, wet muscle',
		prompt: `Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. manhwa panel, erotic comic framing, heavy blush, heart pupils, sweat drop, climax expression. Luminous adult goddess Golhwa seated astride painterly older NAKED man — both mid-climax mouths open, hips pressed, coral chima hiked high as thin cover, jeogori fallen open, legs spread, wet silk. Face matches Golhwa portrait; coral-flame binyeo. ${MAN_NAKED} Accentuate his wet muscular chest and arms holding her. Ember #e86820. Dim cavern. Waist-up. Tasteful silk cover, no explicit genitals. No text. No watermark.`,
		refs: [golhwa, bnG, seo, cave],
		people: ['golhwa', 'seohyeon']
	},
	{
		id: 'seohyeon-older-sisters-join',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'The sisters leave their rock',
		alt: 'Sisters joining the ride: three goddesses climbing onto naked older Seohyeon mid-act',
		prompt: `Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. manhwa panel, erotic comic framing, heavy blush, sweat drop. Orgy join beat: Golhwa already astride naked older man; Narim and Hyullé climbing onto them from the rock — hands on his bare wet chest, mouths near, hiked/open silk, legs parting. ${GODDESS_LESS} ${MAN_NAKED} Four bodies beginning to tangle. Dim cavern. Orgy-readable. Waist-up. Tasteful. No text. No watermark.`,
		refs: triadRefs,
		people: triadPeople
	}
];

function upsert(slot) {
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) Object.assign(entry.images[i], slot);
	else {
		const after = entry.images.findIndex((im) => im.id === 'seohyeon-older-afterglow');
		entry.images.splice(after >= 0 ? after : entry.images.length, 0, slot);
	}
	imagePeople[slot.id] = slot.people;
}

for (const slot of slots) upsert(slot);

// Retarget weak duo/face slots toward orgy-adjacent anchors still in prose
const atUpdates = {
	'seohyeon-older-orgy-faces': 'Steam turns the four into one silhouette pile',
	'seohyeon-older-narim-fail': 'the eldest fails into it',
	'seohyeon-older-hyulle-climb': 'Hyullé’s knees finally part enough to climb',
	'seohyeon-older-possessive': 'Possessive even wrecked',
	'seohyeon-older-spent': 'She collapses on his wet chest'
};
for (const im of entry.images) {
	if (atUpdates[im.id]) im.at = atUpdates[im.id];
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
fs.writeFileSync(PEOPLE, JSON.stringify(imagePeople, null, '\t') + '\n');

const missing = [];
for (const im of entry.images) {
	if (!im.id?.startsWith('seohyeon-older')) continue;
	if (!im.at) continue;
	const hit = entry.blocks.some((b) => {
		const t = [b.html, b.ko, ...(b.lines ?? []), ...(b.en ?? []), b.label].filter(Boolean).join(' ');
		return t.includes(im.at);
	});
	if (!hit) missing.push(`${im.id} -> ${im.at}`);
}
console.log('upserted', slots.map((s) => s.id).join(', '));
if (missing.length) {
	console.error('ANCHOR MISS', missing);
	process.exit(1);
}
console.log('anchors ok');
