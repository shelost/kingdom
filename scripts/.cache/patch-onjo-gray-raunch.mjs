import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(path, 'utf8'));
const onjo = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Onjo');
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

const enJoin = (b) => (b.en || []).join('\n');

const wellSosunoInvite = onjo.blocks.findIndex(
	(b) => b.person === 'sosuno' && enJoin(b).includes('If you compliment me I will scream')
);
if (wellSosunoInvite >= 0) {
	onjo.blocks[wellSosunoInvite] = d(
		'sosuno',
		S,
		['The boys are asleep.', 'One night.', 'Don’t look at me like that in the yard.', 'Chin up. Then inside.'],
		['애들 잤어.', '하룻밤.', '마당에서 그 눈으로 보지 마.', '턱 들고. 그다음 안으로.']
	);
}

const caravanPretty = onjo.blocks.findIndex(
	(b) => b.person === 'sosuno' && enJoin(b).includes('You’re still pretty')
);
if (caravanPretty >= 0) {
	onjo.blocks[caravanPretty] = d(
		'sosuno',
		S,
		['Don’t watch the road until we’re a speck.', 'Load what’s left.', 'I’m counting. Don’t help.', 'Go back to the well when we’re gone.'],
		['점 되기 전엔 길 보지 마.', '남은 거 실어.', '내가 세. 돕지 마.', '우리가 가면 우물로 가.']
	);
}

const wellP = onjo.blocks.findIndex(
	(b) => typeof b.html === 'string' && b.html.includes('When the hall has already chosen')
);
if (wellP >= 0) {
	onjo.blocks[wellP].html =
		'When the hall has already chosen, Sosuno does not fight it. Outside she is still first queen: chin up, dusty-rose under the court silk, counting carts like millet. Silver has come into the gache; it has come into his hair too. She does not mention it in the yard. Jumong finds her at the old well — same stone rim, same timber beam. Twenty winters. He is still grinning. She is calm enough to be mistaken for cold. <b>She is still pretending she came for water.</b>';
	onjo.blocks[wellP].ko =
		'대청이 이미 골랐을 때 소서노는 싸우지 않는다. 밖에서는 아직 첫 왕비다. 턱. 곤 아래 회분홍. 수레를 조처럼 센다. 가체에 은빛이 들었고, 그의 머리에도 들었다. 마당에서는 말 안 한다. 주몽이 옛 우물에서 찾는다 — 같은 돌 테, 같은 들보. 스무 겨울. 그는 아직 웃는다. 그녀는 차분해서 차갑게 보인다. <b>아직 물 뜨러 온 척한다.</b>';
}

const iLamp = onjo.blocks.findIndex((b) => b.html?.includes('grain lamp last night'));
if (iLamp < 0) throw new Error('lamp p missing');

onjo.blocks[iLamp] = p(
	'The door shuts and the queen-count drops off her like a sash. Same timber. Same lamp. Silver streaks in her gache, in the black of his hair — twenty winters written where the lamp can see. She is blushing before he has his robe off. Little Sosuno has been waiting with a book. <b>grain lamp last night</b>',
	'문이 닫히면 왕비의 셈이 띠처럼 떨어진다. 같은 나무. 같은 등잔. 가체에 은빛, 그의 검은 머리에도 — 스무 겨울이 등잔이 보는 곳에 적혀 있다. 곤을 벗기도 전에 얼굴이 붉다. 작은 소서노는 책을 들고 기다리고 있었다. <b>마지막 밤 곡식 등잔</b>',
	true
);

onjo.blocks[iLamp + 1] = p(
	'She ogles him the way she ogled the loft: heart in the eye, drool she tries to swallow, counting chest and back and that ass like millet she is not allowed to steal. Shy about it. Still doing it. <b>She still heart-eyes the meat</b>',
	'다락에서처럼 흘겨본다. 눈은 하트, 침은 삼키려다 실패, 가슴과 등과 그 엉덩이를 훔치면 안 되는 조처럼 센다. 부끄럽다. 그래도 한다. <b>아직 그 고기에 하트 눈이다</b>',
	true
);

onjo.blocks[iLamp + 2] = p(
	'Queen’s robe at the hip, nothing on the back. She looks over her shoulder scarlet — not the yard chin. The pose is filthy. The face is shy. Older. Gray in the gache. As hungry as the loft. <b>queen back last night</b>',
	'왕비 곤이 허리에만 있다. 등은 없다. 넘겨보는데 새빨갛다 — 마당의 턱이 아니다. 자세는 야하다. 얼굴은 수줍다. 나이. 가체의 은. 다락만큼 고프다. <b>마지막 밤 왕비의 등</b>',
	true
);

// king back is now +3 if we inserted... wait I replaced lamp, +1 was queen back, +2 was king back.
// I overwrote lamp, lamp+1 (queen back), need to check current +2

const iKing = onjo.blocks.findIndex((b) => b.html?.includes('king back last night'));
if (iKing >= 0) {
	onjo.blocks[iKing] = p(
		'His turn: king’s back to the lamp, muscle she has counted for twenty winters, silver at the nape she wants to put her mouth on. She drools. She hides it in his shoulder. <b>king back last night</b>',
		'그 차례. 등잔을 받은 왕의 등. 스무 겨울 세어 온 근육. 목덜미의 은빛에 입을 대고 싶다. 침이 고인다. 어깨에 숨긴다. <b>마지막 밤 왕의 등</b>',
		true
	);
}

if (!onjo.blocks.some((b) => b.html?.includes('She remembers every time this room'))) {
	const iAfterKing = onjo.blocks.findIndex((b) => b.html?.includes('king back last night'));
	onjo.blocks.splice(
		iAfterKing + 1,
		0,
		p(
			'<b>She remembers every time this room</b> — the first hitch that was a beat late. The loft window. The night after the cord. The nights she told him not to look at her back and then stuck it out anyway. Twenty years of the same slap, the same idiot grin, the same book she dies of after. Little Sosuno has kept the minutes.',
			'<b>이 방에서 했던 걸 다 기억한다</b> — 한 박자 늦던 첫 허리. 다락 창. 끈 올린 다음 밤. 등 보지 말라고 하고는 내밀던 밤들. 스무 해의 같은 철썩, 같은 바보 웃음, 듣고 나면 죽어가던 같은 책. 작은 소서노가 회의록을 남겨 두었다.',
			true
		)
	);
}

const iJumongStill = onjo.blocks.findIndex(
	(b) => b.nsfw && b.person === 'jumong' && enJoin(b).includes('Scream it like the first time')
);
if (iJumongStill >= 0) {
	onjo.blocks[iJumongStill] = d(
		'jumong',
		J,
		[
			'Still you.',
			'Gray looks good. Sorry. Not sorry.',
			'You’re drooling. I like it.',
			'Scream it like the first time.'
		],
		['아직 너야.', '은빛 예쁘다. 미안. 안 미안.', '침 고이잖아. 좋아.', '처음처럼 질러.'],
		true
	);
}

const iSosunoOgle = onjo.blocks.findIndex(
	(b) => b.nsfw && b.person === 'sosuno' && enJoin(b).includes('Look at you. Chest')
);
if (iSosunoOgle >= 0) {
	onjo.blocks[iSosunoOgle] = d(
		'sosuno',
		S,
		[
			'Don’t— ha— don’t look at my back I’ll—',
			'I’m not— in the yard I’m not— don’t you dare tell the ten—',
			'Little Sosuno listen— that’s him— that’s the noise— wet— twenty winters and still that slap—',
			'I remember— the loft— the first grind— the night after they tied the cord— every time—',
			'Look at you. Chest. Back. That ass. That man meat. Gray in it. Still. Still.',
			'Heart in my stupid eye— I’m drooling— don’t laugh— I’m shy— I’m a queen and I’m dripping—'
		],
		[
			'보지— 하— 내 등 보지 마 나—',
			'마당에선 안 이래— 열 사람한테 말하지 마—',
			'작은 소서노 들어— 저거 그거야— 그 소리— 젖은— 스무 겨울인데 그 철썩 아직—',
			'기억나— 다락— 첫 비빔— 끈 올린 다음 밤— 매번—',
			'봐봐. 가슴. 등. 그 엉덩이. 그 고기. 은빛도. 아직. 아직.',
			'눈에 하트 들어— 침 고여— 웃지 마— 부끄러워— 왕빈데 흐르고 있잖아—'
		],
		true
	);
}

function slot(im) {
	return {
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: true,
		id: im.id,
		at: im.at,
		alt: im.alt,
		refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_dongmyung.png'],
		people: ['sosuno', 'jumong'],
		prompt: im.prompt
	};
}

const extra = [
	slot({
		id: 'nsfw-onjo-ogle-body',
		at: 'She still heart-eyes the meat',
		alt: 'ECU: older Sosuno blushing, heart-eyes, drooling at Jumong’s body; gray streaks',
		prompt: 'ogle body gray'
	}),
	slot({
		id: 'nsfw-onjo-queen-back-shy',
		at: 'queen back last night',
		alt: 'OTS: older queen bare back, gray in gache, looking over shoulder scarlet-shy',
		prompt: 'shy queen back gray'
	}),
	slot({
		id: 'nsfw-onjo-queen-pose',
		at: 'She remembers every time this room',
		alt: 'Dutch: older Sosuno shy sexy pose on sacks, gray streaks, robe at hips',
		prompt: 'shy sexy pose gray'
	}),
	slot({
		id: 'nsfw-onjo-queen-back-dutch',
		at: 'Don’t— ha— don’t look at my back',
		alt: 'Dutch backshot: older queen, silver in hair, shy look-back',
		prompt: 'dutch shy back gray'
	})
];

const have = new Set((onjo.images ?? []).map((i) => i.id));
for (const im of extra) {
	if (have.has(im.id)) Object.assign(onjo.images.find((i) => i.id === im.id), im);
	else onjo.images.push(im);
}

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('onjo last night patched', extra.map((e) => e.id).join(', '));
