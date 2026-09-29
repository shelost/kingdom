import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const PEOPLE = 'src/lib/data/image-people.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const imagePeople = JSON.parse(fs.readFileSync(PEOPLE, 'utf8'));

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

function insertAfter(images, afterId, slots) {
	const exist = new Set(images.map((im) => im.id));
	const fresh = slots.filter((s) => !exist.has(s.id));
	if (!fresh.length) return [];
	const i = images.findIndex((im) => im.id === afterId);
	if (i < 0) throw new Error(`missing slot ${afterId}`);
	images.splice(i + 1, 0, ...fresh);
	return fresh.map((s) => s.id);
}

function findBlockIndex(blocks, needle) {
	return blocks.findIndex((b) => {
		if (typeof b.html === 'string' && b.html.includes(needle)) return true;
		if (Array.isArray(b.en) && b.en.some((s) => s.includes(needle))) return true;
		if (Array.isArray(b.lines) && b.lines.some((s) => s.includes(needle))) return true;
		if (b.kind === 'day' && (b.label?.includes(needle) || b.ko?.includes(needle))) return true;
		if (b.kind === 'flashback' && b.title?.includes(needle)) return true;
		return false;
	});
}

function insertBlockAfterHtml(blocks, needle, newBlocks) {
	const i = findBlockIndex(blocks, needle);
	if (i < 0) throw new Error(`missing block containing: ${needle}`);
	blocks.splice(i + 1, 0, ...newBlocks);
}

function rewriteHtml(blocks, needle, html, ko) {
	const i = findBlockIndex(blocks, needle);
	if (i < 0) throw new Error(`missing block containing: ${needle}`);
	if (html) blocks[i].html = html;
	if (ko) blocks[i].ko = ko;
}

const log = [];

// ── 1. On Gunhae sacrifice ──────────────────────────────────────────────
const gunhae = findEntry('Death of the Second Emperor');
log.push(
	...insertAfter(gunhae.images, 'ongunhae-high-cap', [
		{
			id: 'ongunhae-sacrifice',
			ratio: 1.778,
			tone: '#8a6240',
			at: 'The patrol closes',
			alt: 'Tiny On Gunhae in the high cap on a lone deck; a second hull closes across a vast Yellow Sea',
			prompt:
				'Minimal iconic 16:9 poster. On Gunhae, attendant decoy. ONE geometric device: the high cap as a hard black triangle occupying the upper third; below it a tiny embassy deck on a vast real Yellow Sea. Face matches the attached portrait only as a tiny likeness under the cap. Bronze-brown #8a6240 as the single accent on the great coat. Striking silky Tang-gift court coat, few hues. Natural sea and weather sky. A second tiny patrol hull closing from the left edge. Monumental emptiness. No army catalog. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
			refs: ['/ch_on_gunhae.png'],
			people: ['ongunhae']
		}
	])
);

// ── 2. Pyongyang final siege / Shinsung / brothers ──────────────────────
const finalStand = findEntry('The Final Stand');
log.push(
	...insertAfter(finalStand.images, 'final-three-dragons', [
		{
			id: 'pyongyang-last-ring',
			ratio: 1.778,
			tone: '#C30000',
			at: 'Supreme Commander <b>Yeon Namgun</b>',
			alt: 'Pyongyang’s red wall as a broken ring over the Taedong — one gap, winter river, tiny last stand',
			prompt:
				'Minimal iconic 16:9 poster. Final siege of Pyongyang, 668. ONE geometric device: a BROKEN RING of Goguryeo-red wall #C30000 — a hard circular rampart with one missing arc at the lower right. REAL Taedong River bend and winter hills inside/below the ring. Tiny silky red court-military specks on the remaining wall. Natural winter sky, haze, pale ice on water. Callback to an earlier triple-ring still: the ring is now broken. No army catalog. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
			refs: ['/pl_pyongyang_fortress.png'],
			people: ['namgun']
		},
		{
			id: 'shinsung-opens-gate',
			ratio: 0.5625,
			tone: '#8f7b70',
			at: 'He opens a gate',
			alt: 'A vertical gold slit through a red Pyongyang gate-plane; tiny monk Shinsung pushing from inside',
			prompt:
				'Minimal iconic 9:16 poster. Shinsung, the monk who opens Pyongyang. ONE geometric device: a VERTICAL SLIT of cold Tang-gold light cutting a Goguryeo-red #C30000 gate-plane from lintel to frost — the gate opening from inside. Tiny silky monk silhouette in taupe #8f7b70, wide sleeves, pushing the leaf. Face matches the attached portrait only as a tiny likeness. Real winter stone, snow-fog at the threshold. Callback to earlier ajar-gate stills: same slit, monk-taupe instead of omen-red. No army. No clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
			refs: ['/ch_shinsung.png', '/pl_pyongyang_fortress.png'],
			people: ['shinsung']
		},
		{
			id: 'namseng-namgun-wedge',
			ratio: 1.778,
			tone: '#C30000',
			at: 'At last… I set foot on Pyongyang’s ground—',
			alt: 'A red wall-wedge splits the frame: Namgun inside, Namseng outside on Pyongyang’s last ground',
			prompt:
				'Minimal iconic 16:9 poster. Namseng versus Namgun, final confrontation. ONE geometric device: a VERTICAL WEDGE of Goguryeo-red wall #C30000 splitting the frame — inner city left, outer river-ground right. Yeon Namgun a tiny silky red court-military figure on the inner face; Yeon Namseng a tiny dusty Tang-side figure on the outer face. Faces match the attached portraits only as small likenesses. REAL Pyongyang wall and Taedong edge. Natural winter sky. Callback to an earlier split-floor brothers still: now a wall-wedge, new color split red vs pale dust. No army catalog. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
			refs: ['/ch_yeon_namseng.png', '/ch_yeon_namgun.png', '/pl_pyongyang_fortress.png'],
			people: ['namseng', 'namgun']
		}
	])
);

// ── 3. Births ───────────────────────────────────────────────────────────
const wedding = findEntry('Gotaso’s Wedding');
const howTheyMet = wedding.blocks.find((b) => b.kind === 'flashback' && b.title === 'how they met');
if (!howTheyMet) throw new Error('missing how they met flashback');

if (!howTheyMet.blocks.some((b) => b.html?.includes('They will call him Bupmin'))) {
	howTheyMet.blocks.push({
		kind: 'p',
		html: 'Years later the same house keeps a different quiet. <b>Munhee</b> holds the boy against her collarbone. They will call him <b>Bupmin</b>. The lantern makes a low band of light across the bedding and leaves the rest of the rooms uncounted. <b>Chunchu</b> sits where a husband sits when he has not yet learned what the child will steal from him.',
		ko: '몇 해 뒤, 같은 집이 다른 고요를 지킨다. <b>문희</b>가 사내아이를 쇄골에 붙들고 있다. 이름을 <b>법민</b>이라 부를 것이다. 등불이 침구 위에 낮은 빛띠를 만들고, 나머지 방은 세지 않은 채로 둔다. <b>춘추</b>는, 이 아이가 자신에게서 무엇을 훔칠지 아직 모르는 남편이 앉는 자리에 앉는다.'
	});
}

if (!wedding.blocks.some((b) => b.kind === 'flashback' && b.title === 'the girl-child')) {
	insertBlockAfterHtml(wedding.blocks, 'the Queen watches her niece marry for love', [
		{
			kind: 'flashback',
			year: '626',
			title: 'the girl-child',
			blocks: [
				{
					kind: 'p',
					html: '<b>Munhee</b> does not watch the vows. She watches the doorway and remembers a different night in the same house: the girl-child arriving, pink silk already too sure of itself, Chunchu’s hand huge around a wrist that would never learn to be still. They named her <b>Gotaso</b> when the lantern-band was the same shape it is tonight.',
					ko: '<b>문희</b>는 서약을 보지 않는다. 문간을 본다. 같은 집의 다른 밤을 기억한다. 계집아이가 도착하던 밤. 분홍 비단이 벌써 제 일을 아는 밤. 춘추의 손이, 끝내 가만히 있는 법을 배우지 못할 손목을 크게 감싸던 밤. 등불의 띠가 오늘 밤과 같은 모양일 때, 이름을 <b>고타소</b>라 붙였다.'
				}
			]
		}
	]);
}

log.push(
	...insertAfter(wedding.images, 'pyre-smoke-signal', [
		{
			id: 'bupmin-birth-lantern',
			ratio: 1.778,
			tone: '#C41E3A',
			at: 'They will call him Bupmin',
			alt: 'Intimate domestic: Munhee and newborn Bupmin in a low lantern-band; Chunchu at the edge',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Bupmin’s birth. NOT epic void. ONE geometric device: a low horizontal LANTERN-BAND across the lower third — warm bedding and two faces in that band; the rest dim domestic charcoal, a real inner room. Munhee holds a swaddled newborn boy. Face matches the attached Munhee portrait. Chunchu a magenta #D8258C sleeve-edge at the far left only. Infant wrap in Munmu crimson #C41E3A as the single accent. Striking silky hanbok, few hues. Tender, skin-forward, real adult proportions. No army. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly.',
			refs: ['/ch_munhee.png', '/ch_chunchu.png'],
			people: ['munhee', 'chunchu', 'munmu']
		},
		{
			id: 'gotaso-birth-lantern',
			ratio: 1.778,
			tone: '#F0A3C0',
			at: 'the girl-child arriving',
			alt: 'Intimate domestic callback: Munhee and newborn Gotaso in the same lantern-band, pink wrap',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Gotaso’s birth. PARALLEL CALLBACK to a brother-birth still: SAME low horizontal LANTERN-BAND across the lower third; different child, different color. NOT epic void. Munhee holds a swaddled newborn girl. Face matches the attached Munhee portrait. Chunchu a magenta #D8258C sleeve-edge at the far left only. Infant wrap in Gotaso pink #F0A3C0 as the single accent. Striking silky hanbok, few hues. Tender, skin-forward, real adult proportions. No army. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly.',
			refs: ['/ch_munhee.png', '/ch_chunchu.png', '/ch_gotaso.png'],
			people: ['munhee', 'chunchu', 'gotaso']
		}
	])
);

// ── 4. Chunchu walking to the afterlife ─────────────────────────────────
const death = findEntry('The Death of Kim Chunchu');
log.push(
	...insertAfter(death.images, 'chunchu-deathbed', [
		{
			id: 'chunchu-afterlife-walk',
			ratio: 1.778,
			tone: '#D8258C',
			at: 'I am… just going to keep walking west',
			alt: 'Tiny Chunchu walks alone into a magenta underworld road — monumental emptiness, no escort',
			prompt:
				'Minimal iconic 16:9 poster. Kim Chunchu walks to the afterlife ALONE. ONE geometric device: a MAGENTA RIBBON of road receding into a flat charcoal-rose underworld void — the ribbon is the whole composition. Tiny silky hanbok figure walking AWAY from camera, by himself, no psychopomp, no family. Face matches the attached portrait only as a tiny likeness. Chunchu magenta #D8258C as the plane and the single accent. Otherworld: symbolic flat color, no naturalistic sun or moon weather. Monumental emptiness. Callback to an earlier long-road still of a father carrying a child: same road-ribbon, now empty of the child. No army. No clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
			refs: ['/ch_chunchu.png', '/pl_underworld.png'],
			people: ['chunchu']
		},
		{
			id: 'chunchu-west-road',
			ratio: 1.778,
			tone: '#D8258C',
			at: 'Walk, Spring-and-Autumn',
			alt: 'A broken arc of pale underworld light; tiny Chunchu walks through it alone, magenta hem',
			prompt:
				'Minimal iconic 16:9 poster. Kim Chunchu, Spring-and-Autumn, walking west alone. ONE geometric device: a BROKEN ARC of pale underworld light as a doorway in the upper half; tiny silky figure in the lower third stepping through, by himself. Face matches the attached portrait only as a tiny likeness. Magenta #D8258C as the single accent on the hem. Otherworld symbolic flat charcoal. No Kangrim. No second walker. Monumental emptiness. No clouds as kingdom weather. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
			refs: ['/ch_chunchu.png', '/pl_underworld.png'],
			people: ['chunchu']
		}
	])
);

// ── 5–6. Munmu cave / best of both / Dangun / Bupmin undress ────────────
const wang = findEntry("The Wanggeom's Guest");
const bothIdx = gunhae; // dummy to satisfy linter if unused — removed below
void bothIdx;

const daeya = findEntry('Daeya Fortress');
const bothSlot = daeya.images.find((im) => im.id === 'best_of_both_01');
if (!bothSlot) throw new Error('missing best_of_both_01');
daeya.images = daeya.images.filter((im) => im.id !== 'best_of_both_01');

Object.assign(bothSlot, {
	ratio: 1.778,
	tone: '#C41E3A',
	at: 'best of both',
	alt: 'Munmu at the cave mouth — dusk cliff behind, cyan steam ahead, the first time he enters',
	prompt:
		'Minimal iconic 16:9 poster. King Munmu first entering the steam cavern. ONE geometric device: a WARM CAVE-MOUTH WEDGE of cyan steam cutting a dusk cliff-plane; tiny silky figure at the threshold, not yet inside the first lake scene. Face matches the attached Munmu portrait only as a small likeness. Munmu crimson #C41E3A as the single accent on the robe. REAL mountain path, natural dusk sky. Striking silky court hanbok, few hues. Monumental emptiness. No army. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
	refs: ['/ch_munmu.png', '/pl_cave.png'],
	people: ['munmu']
});
delete bothSlot.src;
delete bothSlot.tempImage;

const wangInsertAt = wang.images.findIndex((im) => im.id === 'munmu-dangun-cavern');
if (wangInsertAt < 0) throw new Error('missing munmu-dangun-cavern');
if (!wang.images.some((im) => im.id === 'best_of_both_01')) {
	wang.images.splice(wangInsertAt, 0, bothSlot);
	log.push('best_of_both_01');
}

rewriteHtml(
	daeya.blocks,
	'He takes the <b>best of both</b>',
	'He refuses the fork they keep drawing for him. Gaya blood or Silla marshal. Fortress count or cavern counsel. He rides from the cliff-fortress with the horse still smelling of the border, shaves at the cave mouth because the sisters keep that rule, and sits where the dark water meets the bright valley — three faint spirits at his back, a kingdom that still doubts his loyalty ahead.',
	'사람들이 그어 놓은 갈림길을 고르지 않는다. 가야의 피인가, 신라의 원수인가. 성의 숫자인가, 동굴의 조언인가. 국경 냄새 남은 말을 타고 절벽 성에서 내려와, 셋이 지키는 규칙대로 동굴 입구에서 면도를 하고, 검은 물이 밝은 골짜기를 만나는 자리에 앉는다 — 등 뒤에는 희미한 세 신령, 앞에는 아직도 그의 충성을 의심하는 나라.'
);

const bothDay = daeya.blocks.find((b) => b.kind === 'day' && b.label === 'BEST OF BOTH');
if (bothDay) {
	bothDay.label = 'BOTH ROADS';
	bothDay.ko = '두 길';
}

if (!wang.blocks.some((b) => b.html?.includes('best of both'))) {
	insertBlockAfterHtml(wang.blocks, 'Munmu rides alone into the hills', [
		{
			kind: 'p',
			html: 'He takes the <b>best of both</b> — the uncle’s steam, which no minutes recorded, and the first king’s name, which every stone still does. This is the entrance. The lake has not yet named the stranger on the water.',
			ko: '그는 <b>양쪽의 최선</b>을 취한다 — 아무도 기록하지 않은 외숙의 김, 그리고 돌마다 아직 적고 있는 첫 임금의 이름. 여기는 입구다. 호수는 아직 물 위의 낯선 이의 이름을 대지 않았다.'
		}
	]);
}

if (!wang.blocks.some((b) => b.html?.includes('crimson leaves his shoulders'))) {
	insertBlockAfterHtml(wang.blocks, 'He strips at the rock lip', [
		{
			kind: 'p',
			html: 'Crimson leaves his shoulders the way a soldier sheds a campaign coat. Steam takes the rest. He does not look up until the water has him.',
			ko: '진홍이 어깨에서 내린다. 병사가 군복을 벗듯. 나머진 김이 가져간다. 물이 그를 잡을 때까지 올려다보지 않는다.'
		}
	]);
}

log.push(
	...insertAfter(wang.images, 'best_of_both_01', [
		{
			id: 'bupmin-robe-falls',
			ratio: 1.778,
			tone: '#C41E3A',
			at: 'Crimson leaves his shoulders',
			nsfw: true,
			alt: 'Munmu from behind at the cave lip — crimson robe falling, muscular back, cyan steam',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. King Munmu undressing to enter the steam cavern. FROM BEHIND. ONE geometric device: the falling crimson robe as a hard diagonal silk plane off the left shoulder. Face matches the attached Munmu portrait in a nape-and-ear sliver. Muscular back, collarbones, sweat, dim cyan steam. Munmu crimson #C41E3A as the single accent on silk. Waist-up. No genitals. Dim attached cavern. Real adult proportions. Painterly anime-adjacent cinema. No text. No watermark.',
			refs: ['/ch_munmu.png', '/pl_cave.png'],
			people: ['munmu']
		},
		{
			id: 'munmu-cave-profile',
			ratio: 1.778,
			tone: '#C41E3A',
			at: 'The house rule is the same',
			nsfw: true,
			alt: 'Movie profile: naked Munmu in dim cave steam, sweat on the collarbone, crimson rim-light',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. King Munmu, naked in the steam cavern, STRICT PROFILE. Movie-like side angle. Face fills the left third. Face matches the attached Munmu portrait: clean-shaven Kim house, adult king. Sweat, skin texture, real adult proportions, dim cyan cave. Bare chest and shoulders, waist-up. Munmu crimson #C41E3A as a thin rim-light. Attached cavern. No second body. No genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
			refs: ['/ch_munmu.png', '/pl_cave.png'],
			people: ['munmu']
		},
		{
			id: 'munmu-cave-low',
			ratio: 0.75,
			tone: '#C41E3A',
			at: 'steps into water so black',
			nsfw: true,
			alt: 'Low movie angle: Munmu looking up from black water, bare shoulders, sandalwood light above',
			prompt:
				'Intimate cinematic CLOSE-UP still, 9:16. LOW ANGLE movie shot. King Munmu chest-deep in black cavern water, looking UP. Face matches the attached Munmu portrait. Bare shoulders and chest, sweat, real proportions, dim steam. A sandalwood-coloured light-plane above him, not a second nude body. Munmu crimson #C41E3A rim. Attached cave. Waist-up. No genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
			refs: ['/ch_munmu.png', '/ch_dangun.png', '/pl_cave.png'],
			people: ['munmu']
		},
		{
			id: 'dangun-over-shoulder',
			ratio: 1.778,
			tone: '#b8956a',
			at: 'a man stands on the water',
			nsfw: true,
			alt: 'Over Munmu’s shoulder: photoreal Dangun standing on black water in sandalwood light',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. OVER-SHOULDER movie angle from Munmu. Munmu is a bare nape and shoulder in the near foreground, crimson #C41E3A rim, not a nude two-shot of two bodies. Beyond: Dangun Wanggeom, photoreal as demigod, standing on black water as if it were a court floor, old robes, sandalwood #b8956a light. Face matches the attached Dangun portrait. Dim attached cavern, thin steam. Real proportions. Dangun clothed/numinous. No genitals. No text. No watermark.',
			refs: ['/ch_munmu.png', '/ch_dangun.png', '/pl_cave.png'],
			people: ['munmu', 'dangun']
		},
		{
			id: 'dangun-cave-numinous',
			ratio: 1.778,
			tone: '#b8956a',
			at: 'Wanggeom — not Sacred Bone',
			nsfw: true,
			alt: 'Dangun alone on the black lake — photoreal demigod, sandalwood light, thin steam',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Dangun Wanggeom ALONE, photoreal as demigod. ONE geometric device: a sandalwood #b8956a light-slab standing on black water, his body the plane. Face matches the attached Dangun portrait. Solo, numinous, real proportions, sweat-texture skin, thin steam, attached cavern. Bare torso acceptable, waist-up, no genitals, no second person. Dim. No text. No watermark. Graphic color-blocking with photoreal god presence.',
			refs: ['/ch_dangun.png', '/pl_cave.png'],
			people: ['dangun']
		}
	])
);

// ── 8. Steam cavern — Yushin & Chunchu undressing ───────────────────────
if (!daeya.blocks.some((b) => b.html?.includes('The marshal’s robe falls'))) {
	insertBlockAfterHtml(daeya.blocks, 'rides alone to a small cavern lake', [
		{
			kind: 'p',
			html: 'The marshal’s robe falls at the rock lip before the steam has a name for him. Confucian blue on wet stone. He does not look up; looking up would be a request.',
			ko: '원수의 도포가 바위 끝에서 내린다. 김이 아직 그의 이름을 부르기 전에. 유교의 푸른빛이 젖은 돌 위에 있다. 올려다보지 않는다. 올려다보는 것은 청이 되니까.'
		}
	]);
}

if (!daeya.blocks.some((b) => b.html?.includes('Magenta silk leaves his shoulders'))) {
	insertBlockAfterHtml(daeya.blocks, 'At the mouth he borrows a razor', [
		{
			kind: 'p',
			html: 'Magenta silk leaves his shoulders in a mess of dignity. The scholar-prince has never undressed for a lake that talks back.',
			ko: '자홍 비단이 어깨에서 내린다. 체면이 헝클어진 채로. 학자 왕자는, 되받아 말하는 호수를 위해 옷을 벗어 본 적이 없다.'
		}
	]);
}

log.push(
	...insertAfter(daeya.images, 'steam_01', [
		{
			id: 'yushin-robe-falls',
			ratio: 1.778,
			tone: '#2A5FB8',
			at: 'The marshal’s robe falls',
			nsfw: true,
			alt: 'Yushin from behind at the cavern lip — Confucian-blue robe falling, muscular back, cyan steam',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Kim Yushin undressing to enter the steam cavern. FROM BEHIND. ONE geometric device: the falling robe as a hard Confucian-blue #2A5FB8 silk diagonal. Face matches the attached manhwa portrait in a beard-and-scar sliver at the nape. Athletic muscular back, not bodybuilder. Wet loose hair. NO ribbon. NO headband. Dim attached cavern, cyan steam. Waist-up. No genitals. Real adult proportions. Painterly anime-adjacent cinema. No text. No watermark.',
			refs: ['/ch_kim_yushin.png', '/pl_cave.png'],
			people: ['yushin']
		}
	])
);

log.push(
	...insertAfter(daeya.images, 'marshal_steam_01', [
		{
			id: 'chunchu-robe-falls',
			ratio: 1.778,
			tone: '#D8258C',
			at: 'Magenta silk leaves his shoulders',
			nsfw: true,
			alt: 'Chunchu three-quarter at the cave mouth — magenta robe falling, pale scholar’s back, cyan steam',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Kim Chunchu undressing to enter the steam cavern. THREE-QUARTER from behind. ONE geometric device: magenta #D8258C silk falling as a hard ribbon off one shoulder. Face matches the attached portrait: pale scholar-prince, not Yushin. Pale back, collarbones, dim cyan steam from the attached cave. Waist-up. No genitals. Real adult proportions. Painterly anime-adjacent cinema. No text. No watermark.',
			refs: ['/ch_chunchu.png', '/pl_cave.png'],
			people: ['chunchu']
		}
	])
);

// ── 9. Yushin–Doma ──────────────────────────────────────────────────────
const yushin = findEntry('Kim Yushin');
if (!yushin.blocks.some((b) => b.kind === 'flashback' && b.title === 'Doma')) {
	insertBlockAfterHtml(yushin.blocks, 'The fish-ring sits in his palm', [
		{
			kind: 'flashback',
			year: '613',
			title: 'Doma',
			blocks: [
				{
					kind: 'p',
					html: 'Before the marshal’s name, there was a Hwarang boy who kept the same yard hours. They called him <b>Doma</b>. He died on a northern road that did not bother to learn his other names.',
					ko: '원수라는 이름 전에, 같은 연무장 시간을 지키던 화랑 소년이 있었다. 이름을 <b>도마</b>라 불렀다. 북쪽 길에서 죽었다. 그 길은 그의 다른 이름을 배울 생각이 없었다.'
				},
				{
					kind: 'p',
					html: 'Yushin went to the grave alone. He stands until the grass has heard him. Confucian rank does not sit in lotus for a friend; it keeps the feet planted until the mound has been counted.',
					ko: '유신은 홀로 무덤에 갔다. 풀이 들을 때까지 서 있다. 유교의 품계는 벗을 위해 연꽃에 앉지 않는다. 봉분을 셀 때까지 발을 땅에 붙인다.'
				}
			]
		}
	]);
}

log.push(
	...insertAfter(yushin.images, 'yushin-ring-hand', [
		{
			id: 'yushin-doma-yard',
			ratio: 1.778,
			tone: '#2A5FB8',
			at: 'They called him Doma',
			alt: 'Two tiny Hwarang on an empty yard — one Confucian-blue plane, a stamp of friendship',
			prompt:
				'Minimal iconic 16:9 poster. Young Kim Yushin and his friend Doma. ONE geometric device: a hard RECTANGULAR STAMP of packed-earth yard occupying the lower half; two tiny silky Hwarang silhouettes standing on it, not kneeling. Yushin face matches the attached hwarang portrait only as a tiny likeness; the second boy is a back-view silhouette, no invented face. Confucian blue #2A5FB8 as the single accent plane. Striking silky hwarang dress, few hues. Monumental emptiness. He stands. No crescent halo. No army. No clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
			refs: ['/ch_kim_yushin_hwarang.png'],
			people: ['yushin']
		},
		{
			id: 'yushin-doma-grave',
			ratio: 1.778,
			tone: '#2A5FB8',
			at: 'He stands until the grass has heard him',
			alt: 'Yushin standing alone at a single grass mound — Confucian blue, empty field, he does not sit',
			prompt:
				'Minimal iconic 16:9 poster. Kim Yushin at Doma’s grave. ONE geometric device: a single grass tomb-mound as a low green STRIP across the lower third; Yushin a tiny standing silky figure at the left end of the strip — he STANDS, he does not sit in lotus. Face matches the attached portrait only as a tiny likeness. Confucian blue #2A5FB8 as the single accent on court-military silk. REAL empty field, natural overcast sky. Callback to an earlier quiet tomb-mound still: same low strip, marshal-blue instead of violet incense. Monumental emptiness. No army. No clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
			refs: ['/ch_kim_yushin.png'],
			people: ['yushin']
		}
	])
);

const peopleMap = {
	'ongunhae-sacrifice': ['ongunhae'],
	'pyongyang-last-ring': ['namgun'],
	'shinsung-opens-gate': ['shinsung'],
	'namseng-namgun-wedge': ['namseng', 'namgun'],
	'bupmin-birth-lantern': ['munhee', 'chunchu', 'munmu'],
	'gotaso-birth-lantern': ['munhee', 'chunchu', 'gotaso'],
	'chunchu-afterlife-walk': ['chunchu'],
	'chunchu-west-road': ['chunchu'],
	best_of_both_01: ['munmu'],
	'bupmin-robe-falls': ['munmu'],
	'munmu-cave-profile': ['munmu'],
	'munmu-cave-low': ['munmu'],
	'dangun-over-shoulder': ['munmu', 'dangun'],
	'dangun-cave-numinous': ['dangun'],
	'yushin-robe-falls': ['yushin'],
	'chunchu-robe-falls': ['chunchu'],
	'yushin-doma-yard': ['yushin'],
	'yushin-doma-grave': ['yushin']
};
Object.assign(imagePeople, peopleMap);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
fs.writeFileSync(PEOPLE, JSON.stringify(imagePeople, null, '\t') + '\n');
console.log('added/moved', [...new Set(log)].join(', '));
