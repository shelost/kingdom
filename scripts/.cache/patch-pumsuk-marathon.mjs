import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

function text(b) {
	if (!b) return '';
	if (typeof b.html === 'string') return b.html;
	if (b.kind === 'dialogue') return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
	if (b.kind === 'monologue') return `${b.html ?? ''} ${b.ko ?? ''}`;
	return '';
}

const daeya = findEntry('Daeya Fortress');
const chipM = '#c98fb0';
const chipP = '#7aa8d8';

const start = daeya.blocks.findIndex((b) =>
	text(b).includes('He does not last the courtesy of a first finish')
);
const end = daeya.blocks.findIndex((b) => text(b).includes('Afterwards she is'));
if (start < 0 || end < 0 || end <= start) {
	throw new Error(`bad range start=${start} end=${end}`);
}

const newBlocks = [
	{
		kind: 'p',
		nsfw: true,
		html: 'He does not last the courtesy of a first finish. He buries it — a stupid, young, endless amount — and keeps thrusting through it, wet now, louder, the milk already running down the inside of the ochre chima. She laughs into the scream. She thinks that is the shape of a night: one finish, then she thanks him, then he goes back to the feast. She starts to sit.',
		ko: '첫 번의 예의를 지키지 못한다. 묻는다 — 바보같고, 젊고, 끝이 없는 양 — 그리고 그 위로 계속 박는다. 이제 젖어 있고, 더 크고, 흰 젖이 이미 황토 치마 안으로 흐른다. 비명 속에서 웃는다. 밤의 모양이 그런 줄 안다: 한 번, 고맙다, 잔치로 돌아간다. 일어나려 한다.'
	},
	{
		kind: 'monologue',
		person: 'gumilwife',
		nsfw: true,
		html: 'I screamed. He stayed. I was going to thank him and send him back. I am sitting up. It is over. It is over.',
		ko: '소리쳤어. 남았어. 고맙다 하고 돌려보낼 거였어. 일어나. 끝이야. 끝이야.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'He does not go soft. He looks — open dirtied green, hiked ochre, milk already on the cheap sash — and the look is worse than the thrust. <b>He looks at her and is hard again.</b> Instant. A boy staring at a used body and wanting it more than the unused one. She sees it. Thirty-one. She has never been looked at like that after.',
		ko: '안 죽는다. 본다 — 열린 때 묻은 초록, 걷힌 황토, 싼 끈에 이미 흰 젖 — 그 눈이 박기보다 나쁘다. <b>보고, 다시 선다.</b> 즉시. 쓰인 몸을 보고 안 쓰인 몸보다 더 원하는 소년. 그녀가 본다. 서른하나. 그 다음에는 그렇게 보인 적이 없다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['끝난 줄— 벌써—?', '또— 하아, 어떻게—'],
		en: ['I thought you were— already—?', 'Again— haa, how—']
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['보면— 못 멈추겠소—', '이 몸이— 아—'],
		en: ['If I look— I can’t stop—', 'This body— ah—']
	},
	{
		kind: 'monologue',
		person: 'gumilwife',
		nsfw: true,
		html: 'I was going to send him back. He is looking at my chest like the lamp-line. Harder than the first time. If he looks again I am going to come from the looking.',
		ko: '돌려보낼 거였어. 등잔 줄 때처럼 가슴을 봐. 처음보다 더 서 있어. 또 보면 보는 것만으로 가겠어.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'He takes her again before she has sat up. The cheap post at her back. She meant to lead. She is not leading. <b>Already?</b> The word comes out as a laugh and then it is a scream. Ice-blue still clean. Dirtied green open as far as it will go. He is twenty-four and the looking did it — not wine, not rank. Her.',
		ko: '일어나기도 전에 다시 가진다. 싼 기둥이 등에. 이끌려고 했다. 이끌지 못한다. <b>벌써?</b> 웃음으로 나왔다가 비명이 된다. 얼음빛은 아직 깨끗하다. 때 묻은 초록이 열릴 수 있는 데까지 열려 있다. 스물넷. 술이 한 게 아니다. 계급이 한 게 아니다. 그 눈이 한 것이다. 그녀가.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['망가뜨려— 아악—', '누구 거야— 말해—'],
		en: ['Wreck me— ah—', 'Whose is it— say it—']
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['내 거요—', '조여— 아—'],
		en: ['Mine—', 'Tighten— ah—']
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'She asks it wrecked, like a prize she is handing over. <b>Whose is it.</b> The feast on the other side of the screen hears a poor woman give a True Bone the room.',
		ko: '망가진 채로 묻는다, 넘겨 주는 전리품처럼. <b>누구 거야.</b> 병풍 너머 잔치가 가난한 여자가 진골에게 방을 주는 소리를 듣는다.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'Second finish. She thinks that is the night. She is shaking. She tries to close the jeogori with a hand that does not work. He looks at the wreck of the ochre and the open green and the milk on the pine and <b>the look is the whole third round.</b>',
		ko: '두 번째. 이번이 밤인 줄 안다. 떤다. 안 되는 손으로 저고리를 여미려 한다. 망가진 황토와 열린 초록과 마루의 흰 젖을 보고, <b>그 눈이 세 번째 전부다.</b>'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['또—? 씨발— 보지 마—', '보면 또— 하아—'],
		en: ['Again—? Fuck— don’t look—', 'If you look you’ll— haa—']
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['봐서— 또 싸겠소—', '빼지— 마시오—'],
		en: ['Looking— I’m gonna again—', 'Don’t you— pull out—']
	},
	{
		kind: 'monologue',
		person: 'gumilwife',
		nsfw: true,
		html: 'I cannot send him back. He is looking again. I am wet from being looked at. I am not running this room.',
		ko: '못 돌려보내. 또 봐. 보이는 것만으로 젖어. 이 방을 운영하는 쪽이 아니야.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'Then she is down against the wall and he is over her, and the dirtied green is open as far as it will go without coming off. The ochre chima is a wreck at the hip. His silk is still clean. That is the insult of it. He folds her in half and drives harder than before — the anger still in it, the looking still in it — a boy ruining a room because her body will not let him finish for good. She is louder than the feast. She says the name again, wrecked, like a prize, and he punishes that too, and then he looks, and it starts again. <b>She loses the room.</b> She came to steal a noble lady’s husband and she is the one being owned — shaking, dripping, asking for the next one with her legs still open.',
		ko: '벽에 내려앉고 그가 위에 있다. 때 묻은 초록이, 벗지 않고 열릴 수 있는 데까지 열려 있다. 황토 치마는 허리에서 망가졌다. 그의 비단은 아직 깨끗하다. 그게 모욕이다. 반으로 접고 전보다 세게 박는다 — 화가 아직 들어 있고, 그 눈이 아직 들어 있고 — 이 몸이 끝나게 두지 않아서 방을 망가뜨리는 소년. 잔치보다 크다. 그 이름을 또 말한다, 망가진 채로, 전리품처럼, 그것도 벌하고, 그리고 보고, 또 시작한다. <b>방을 잃는다.</b> 진골 아씨 남편을 훔치러 온 여자가, 소유당한다 — 떨며, 흘리며, 다리가 아직 열린 채로 다음을 청한다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['네 거야— 네 거— 아악—', '채워— 착하지— 더—'],
		en: ['Yours— it’s yours— ah—', 'Fill me— good boy— more—']
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['또— 나오오—', '안 멈춰— 아—'],
		en: ['Again— I’m—', 'I can’t stop— ah—']
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'Every time she thinks the wick is the end, he looks. The hall from the other side of the torn screen is only two black shapes against one gold lamp — the cheap post knocking, the feast pretending the night has a clock. <b>The lamp keeps dying and he does not.</b>',
		ko: '심지가 끝인 줄 알 때마다, 본다. 찢어진 병풍 너머 전각은 금빛 등잔 하나 앞의 검은 그림자 둘뿐이다 — 싼 기둥이 울리고, 잔치는 밤에 시계가 있는 척한다. <b>등잔은 죽어 가는데 그는 안 죽는다.</b>'
	},
	{
		kind: 'p',
		nsfw: true,
		html: '<b>They do not stop until the lamp dies.</b> Load after load inside her — a third, a fourth, she loses the count, the last one leaking out as fast as he puts it in, white on the dirtied green, white on the worn pine, white on the frayed red sash. Hanbok still on — just less of it. The hall smells of sex. She is hoarse. He is shaking and still in her. For the first time in this fortress <b>she is not running the room anymore.</b>',
		ko: '<b>등잔이 죽을 때까지 멈추지 않는다.</b> 그 안에, 한 번이 아니다 — 세 번, 네 번, 세는 것을 잃고, 넣는 만큼 흘러나오고, 때 묻은 초록에 하얗고, 낡은 마루에 하얗고, 헐거운 붉은 끈에 하얗다. 한복은 아직 있다 — 다만 덜 있다. 전각에 그 냄새가 있다. 목이 쉬었다. 그는 떨면서 아직 그 안에 있다. 이 성에서 처음으로 <b>방을 운영하는 쪽이 아니다.</b>'
	},
	{
		kind: 'monologue',
		person: 'gumilwife',
		nsfw: true,
		html: 'I cannot sit up. He is still looking. If he looks again I will not survive it. I want him to look. I was going to ruin him. He ruined the room.',
		ko: '못 일어나. 아직 봐. 또 보면 못 버텨. 봐 줬으면 좋겠어. 그 아이를 망가뜨릴 거였어. 방을 망가뜨린 건 그 아이야.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['하아— 죽겠어—', '네 거였어— 남아 줘서—'],
		en: ['Haa— I’m wrecked—', 'It was yours— you stayed—']
	}
];

daeya.blocks.splice(start, end - start, ...newBlocks);

const morning = daeya.blocks.find(
	(b) => b.kind === 'p' && text(b).includes('He makes her say the leaving last')
);
if (!morning) throw new Error('missing morning recount');
morning.html =
	'She tells it. The walk. The knot. The scream the screen did not hide. She thought it was over after the first, and after the second, and it was not — he looked at her and it started again, load after load, and the clean silk that never stained. She tells him she said the wife’s name, and that is when the boy got angry, and that is when she liked it most — stealing a noble lady’s husband out loud. She tells him by the lamp she was the one being owned. <b>He makes her say the leaving last</b> — that the boy stood up, did not look, and walked out of the feast as if the room were already empty.';
morning.ko =
	'말한다. 걸음. 매듭. 병풍이 가리지 못한 소리. 첫 번 다음에 끝난 줄 알았고, 두 번째 다음에도, 아니었다 — 그 아이가 봐서 또 시작됐고, 그 안에 몇 번, 그리고 더러워지지 않은 비단. 아내 이름을 말했다고 하고, 그때 그 아이가 화났다고 하고, 그때가 제일 좋았다고 한다 — 진골 아씨 남편을 소리 내어 훔친 것. 등잔 옆에서는 소유당한 쪽이 자기였다고 한다. <b>떠나는 것을 마지막에 말하게 한다</b> — 그 아이가 일어서서, 보지 않고, 방이 이미 빈 것처럼 잔치를 나갔다고.';

const lockRefs = ['/ch_gumil_wife.png', '/bn_gumil_wife.png', '/ch_pumsuk.png'];
const newImages = [
	{
		id: 'pumsuk-more-01-look',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'He looks at her and is hard again',
		alt: 'After the first finish: he stares at her open dirtied green and the look is instant',
		refs: lockRefs,
		people: ['pumsuk', 'gumilwife'],
		prompt:
			'Intimate cinematic 16:9. LOCKED Daeya feast-hall. CARAVAGGIO. He looks. Instant. No text. No watermark.'
	},
	{
		id: 'pumsuk-more-02-already',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'Already?',
		alt: 'Her face: shocked, aroused, already?— he is hard again and she cannot hide it',
		refs: lockRefs,
		people: ['gumilwife', 'pumsuk'],
		prompt:
			'Intimate cinematic 16:9. LOCKED hall. CARAVAGGIO. Already? No text. No watermark.'
	},
	{
		id: 'pumsuk-more-03-whose',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'Whose is it',
		alt: 'She is being owned — wrecked face over the cheap post, asking whose',
		refs: lockRefs,
		people: ['gumilwife', 'pumsuk'],
		prompt:
			'Intimate cinematic 16:9. LOCKED hall. CARAVAGGIO. Whose is it. No text. No watermark.'
	},
	{
		id: 'pumsuk-more-04-third',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'the look is the whole third round',
		alt: 'Second recovery: he looks at the wreck of ochre and green and is hard again',
		refs: lockRefs,
		people: ['pumsuk', 'gumilwife'],
		prompt:
			'Intimate cinematic 16:9. LOCKED hall. CARAVAGGIO. The look is the third round. No text. No watermark.'
	},
	{
		id: 'pumsuk-more-05-night',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'The lamp keeps dying and he does not',
		alt: 'Iconic: two black hanbok silhouettes against one dying gold lamp — the night has no clock',
		refs: lockRefs,
		people: ['pumsuk', 'gumilwife'],
		prompt:
			'Minimal iconic 16:9. Indoor night-black Daeya hall. Two silhouettes. One lamp. No text. No watermark.'
	},
	{
		id: 'pumsuk-more-06-owned',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'she is not running the room anymore',
		alt: 'Spent on the pine — she is owned, hoarse, still being looked at',
		refs: lockRefs,
		people: ['gumilwife', 'pumsuk'],
		prompt:
			'Intimate cinematic 16:9. LOCKED hall. CARAVAGGIO. She is not running the room. No text. No watermark.'
	}
];

const afterMilk = daeya.images.findIndex((im) => im.id === 'pumsuk-hc-13-milk');
if (afterMilk < 0) throw new Error('missing pumsuk-hc-13-milk');
const have = new Set(daeya.images.map((im) => im.id));
const inject = newImages.filter((im) => !have.has(im.id));
daeya.images.splice(afterMilk + 1, 0, ...inject);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`marathon: replaced ${end - start} blocks with ${newBlocks.length}; images +${inject.length}`);
