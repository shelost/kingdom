import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function entries() {
	const out = [];
	for (const ch of story) for (const en of ch.entries ?? []) out.push(en);
	return out;
}

const entry = entries().find((e) => e.title === 'Daeya Fortress');
if (!entry) throw new Error('missing Daeya Fortress');

function byId(id) {
	const im = entry.images.find((x) => x.id === id);
	if (!im) throw new Error(`missing slot ${id}`);
	return im;
}

const p = '/ch_pumsuk.png';
const y = '/ch_gumil_wife.png';

const slots = [
	{
		id: 'pumsuk-yehwa-indifferent',
		ratio: 1.778,
		tone: '#7EB8F0',
		at: 'At first he does not look',
		alt: 'Feast lamp: Pumsuk looks past Yehwa at his cup — True Bone indifference',
		refs: [p, y],
		tempImage: '/temp/pumsuk-yehwa-indifferent.jpg'
	},
	{
		id: 'pumsuk-yehwa-notice',
		ratio: 1.778,
		tone: '#8AAFA0',
		at: 'Then the lamp finds the place',
		alt: 'The first crack — Pumsuk’s eyes drop to Yehwa’s hip in teal-sage silk',
		refs: [p, y],
		tempImage: '/temp/pumsuk-yehwa-notice.jpg'
	},
	{
		id: 'nsfw-pumsuk-yehwa-leave',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'She draws the teal silk closed',
		alt: 'Yehwa covers her throat and takes one step into the dark — a fake leaving',
		refs: [y, p],
		tempImage: '/temp/nsfw-pumsuk-yehwa-leave.jpg'
	},
	{
		id: 'nsfw-pumsuk-yehwa-ankle',
		ratio: 1.778,
		tone: '#7EB8F0',
		nsfw: true,
		at: 'He is on the floor before he knows',
		alt: 'Pumsuk bowed on the boards, one hand locked on Yehwa’s ankle',
		refs: [p, y],
		tempImage: '/temp/nsfw-pumsuk-yehwa-ankle.jpg'
	},
	{
		id: 'nsfw-pumsuk-yehwa-smirk',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'a smirk he is not meant to see',
		alt: 'Yehwa’s smirk over the shoulder — she has him — before she turns back',
		refs: [y],
		tempImage: '/temp/nsfw-pumsuk-yehwa-smirk.jpg'
	},
	{
		id: 'nsfw-pumsuk-yehwa-horndog',
		ratio: 1.778,
		tone: '#7EB8F0',
		nsfw: true,
		at: 'the manners torn off',
		alt: 'Pumsuk the horndog — ice-blue silk open, teal silk pulled from her shoulder, lust implied',
		refs: [p, y],
		tempImage: '/temp/nsfw-pumsuk-yehwa-horndog.jpg'
	}
];

const afterHalfShare = entry.images.findIndex((im) => im.id === 'pumsuk-half-share');
for (const slot of slots) {
	if (entry.images.some((im) => im.id === slot.id)) {
		Object.assign(byId(slot.id), slot);
	} else {
		entry.images.splice(afterHalfShare + 1, 0, slot);
	}
}

Object.assign(byId('nsfw-pumsuk-gumilwife-allure'), {
	at: 'Put that politeness… on my waist.',
	alt: 'Yehwa looking back — flushed allure, hip weight, teal silk; she is still leading'
});
Object.assign(byId('nsfw-pumsuk-gumilwife-overwhelm'), {
	at: 'I am the one shaking.',
	alt: 'Ecstasy — Pumsuk overwhelmed, eyes half-shut, Yehwa still at his throat'
});
Object.assign(byId('nsfw-pumsuk-yehwa-claim'), {
	at: 'Now he is the one who cannot stop',
	alt: 'Pumsuk the aggressor — pinning Yehwa, no more boy-politeness'
});

const indifferent = {
	kind: 'p',
	html: 'At first he does not look. True Bone boys are trained not to. He talks to the cup, to the rank, to the idea of a fortress. <b>Yehwa</b> is furniture the feast already owns.',
	ko: '처음엔 보지 않는다. 진골 소년은 보지 않도록 배운다. 잔에게, 품계에게, 성이라는 생각에 말을 건넨다. <b>예화</b>는 잔치가 이미 소유한 가구다.'
};

const notice = {
	kind: 'p',
	html: 'Then the lamp finds the place her chima pulls taut at the hip, and the training fails in one glance. He notices the body before he notices the woman.',
	ko: '그러다 등이 치마가 엉덩이에서 팽팽해지는 곳을 찾고, 그 훈련이 한 눈에 무너진다. 여자보다 몸을 먼저 본다.'
};

const feastNeedle = 'At the feast the wine finds Pumsuk first.';
const feastIdx = entry.blocks.findIndex((b) => b.kind === 'p' && b.html?.includes(feastNeedle));
if (feastIdx === -1) throw new Error('missing feast paragraph');
if (!entry.blocks.some((b) => b.html?.includes('At first he does not look'))) {
	entry.blocks.splice(feastIdx + 1, 0, indifferent, notice);
}

const leaveBlocks = [
	{
		kind: 'p',
		html: 'She draws the teal silk closed at her throat — a modest she never used — and stands as if the night were over. She takes one step toward the dark.',
		ko: '그녀는 청록 비단을 목에서 여민다 — 한 번도 쓰지 않던 정숙함으로 — 그리고 밤이 끝난 것처럼 일어선다. 어둠 쪽으로 한 걸음.'
	},
	{
		kind: 'dialogue',
		chip: '#c98fb0',
		person: 'gumilwife',
		lines: ['이만… 가 볼게요.', '장군님은 잔치에 남으셔야죠.'],
		en: ['I should… go.', 'You should stay with the feast, my lord.']
	},
	{
		kind: 'p',
		html: 'He is on the floor before he knows he has knelt. Forehead almost to the boards. His hand finds her ankle and holds.',
		ko: '무릎 꿇은 줄도 모르는데 이미 바닥에 있다. 이마가 마루에 닿을 듯. 손이 그녀의 발목을 찾아 붙든다.'
	},
	{
		kind: 'dialogue',
		chip: '#7aa8d8',
		person: 'pumsuk',
		lines: ['가지 마.', '가지 마시오.', '남아. — 남아 주시오.'],
		en: ['Don’t.', 'Don’t go.', 'Stay. — Please stay.']
	},
	{
		kind: 'p',
		html: 'We see what he cannot: a smirk he is not meant to see. Then she turns, and the silk opens again where she closed it.',
		ko: '그가 보면 안 되는 것을 우리는 본다: 미소. 그리고 그녀가 돌아선다. 여몄던 비단이 다시 열린다.'
	},
	{
		kind: 'p',
		html: 'What follows is not a kiss. It is a True Bone boy with the manners torn off — silk ripped at the shoulder, her laugh against his mouth, the feast a rumour on the other side of the screen. The chronicle does not draw the rest. It does not need to. Now he is the one who cannot stop.',
		ko: '그다음이 입맞춤이 아니다. 예절이 벗겨진 진골 소년이다 — 어깨에서 찢긴 비단, 그의 입에 닿는 그녀의 웃음, 병풍 너머로만 들리는 잔치. 이 기록은 나머지를 그리지 않는다. 그릴 필요가 없다. 이제는 그가 멈추지 못하는 쪽이다.'
	}
];

const hearNeedle = 'Where nobody hears.';
const hearIdx = entry.blocks.findIndex(
	(b) => b.kind === 'dialogue' && Array.isArray(b.en) && b.en.includes(hearNeedle)
);
if (hearIdx === -1) throw new Error('missing hear beat');
if (!entry.blocks.some((b) => b.html?.includes('She draws the teal silk closed'))) {
	entry.blocks.splice(hearIdx + 1, 0, ...leaveBlocks);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched Pumsuk–Yehwa progression');
