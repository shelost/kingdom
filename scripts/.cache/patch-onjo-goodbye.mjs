import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(path, 'utf8'));
const onjo = story.flatMap((c) => c.entries).find((e) => e.title === 'Onjo');
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
const scene = (label, ko) => ({ kind: 'scene', label, ko });

const J = '#e8563f';
const S = '#e8a04a';

const iLeave = onjo.blocks.findIndex((b) => b.html?.includes('When Yuri becomes king'));
if (iLeave < 0) throw new Error('leave p missing');

const father = onjo.blocks.find((b) => b.en?.[0] === 'Father…!' && b.person === 'onjo');
if (father) father.person = 'yuri';

const insert = [
	scene('The Last Night', '마지막 밤'),
	p(
		'When Yuri takes the kingship, Sosuno does not fight the hall. She packs the dusty-rose. She packs Little Sosuno’s silence, which is not silent. Jumong finds her at the old well — same stone rim, same timber beam, two buckets that have outlived the argument. Twenty winters in the same yard. He is still grinning. She is still pretending she came for water.',
		'유리가 왕위를 받자 소서노는 대청과 싸우지 않는다. 회분홍을 갠다. 작은 소서노의 침묵도 갠다. 침묵이 아니다. 주몽이 옛 우물에서 찾는다 — 같은 돌 테, 같은 들보, 싸움을 이긴 두레박 둘. 같은 마당에서 스무 겨울. 그는 아직 웃는다. 그녀는 아직 물 뜨러 온 척한다.'
	),
	d('jumong', J, ['Hey.', 'You’re packed.', 'That’s… a lot of buckets for one road.'], [
		'야.',
		'쌌네.',
		'길 하나치곤 두레박이 많아.'
	]),
	d('sosuno', S, ['Not buckets.', 'Grain. Boys. Me.', 'Don’t— don’t make a speech. I’ll hit you.'], [
		'두레박 아니야.',
		'곡식. 애들. 나.',
		'연설하지 마. 때릴 거야.'
	]),
	d('jumong', J, ['Wasn’t going to.', 'Well’s still here.', 'I kept it. For you. Stupid, I know.'], [
		'안 하려고 했어.',
		'우물 아직 있어.',
		'남겨 뒀어. 너 때문에. 바보인 거 알아.'
	]),
	d('sosuno', S, ['Don’t be nice.', 'I’ll get stupid.', 'Yuri can have the chair. I’m not sitting in a footnote.', 'You know that. You always knew.'], [
		'착하게 굴지 마.',
		'바보 돼.',
		'의자는 유리가 가져. 난 각주로 안 앉아.',
		'알잖아. 처음부터 알았잖아.'
	]),
	d('jumong', J, ['Yeah.', 'South, then.', 'Take the glow. Leave me the well.', '…Come here. Please. One night. I’m still thirsty.'], [
		'응.',
		'그럼 남쪽.',
		'그 빛은 가져. 우물은 남겨.',
		'…이리 와. 제발. 하룻밤. 아직 목말라.'
	]),
	d('sosuno', S, ['Big idiot.', 'The boys are asleep.', 'If you compliment me I will scream.', '…That’s not a no.'], [
		'이 큰 바보.',
		'애들 잤어.',
		'칭찬하면 소리 지를 거야.',
		'…거절 아니야.'
	]),
	p(
		'They do not make it to a feast. They make it to the grain room that has been theirs since the first count. Older. Hungrier. The hide has been off for years and she is worse now, not better. <b>one last screaming night</b>',
		'잔치까지 안 간다. 첫 셈부터 둘이던 곡식방까지 간다. 나이 들었고, 더 고프다. 껍질은 몇 년 전에 벗었고 지금은 더 심하다. 나아진 게 아니다. <b>마지막 비명 밤</b>',
		true
	),
	d(
		'jumong',
		J,
		['Still you.', 'Still that mouth.', 'Look at you. Older. Sexier. Sorry. Not sorry.'],
		['아직 너야.', '그 입 아직.', '너 봐. 나이 들어. 더 섹시해. 미안. 안 미안.'],
		true
	),
	d(
		'sosuno',
		S,
		[
			'Don’t— ha— don’t say that I’ll—',
			'Little Sosuno listen— that’s him— that’s the noise— wet— god the wet—',
			'Still so big— Haemosu’s kid— fill it— fill her— she’s been waiting twenty winters—',
			'Those Buyeo girls can look. They don’t get this. This is mine. Say it’s mine—'
		],
		[
			'말하지— 하— 말하면 나—',
			'작은 소서노 들어— 저거 그거야— 그 소리— 젖은— 아 그 젖은 소리—',
			'아직 커— 해모수 아들— 채워— 얘를 채워— 스무 겨울 기다렸어—',
			'부여 년들은 보기만 해. 이건 못 가져. 내 거야. 내 거라 해—'
		],
		true
	),
	d('jumong', J, ['Yours.', 'Always was.', 'Scream it. Last time. Louder.'], ['네 거야.', '처음부터.', '질러. 마지막이야. 더 크게.'], true),
	d(
		'sosuno',
		S,
		[
			'I hate you I love you don’t you dare stop—',
			'DUMB BIG IDIOT— LAST— FILL—',
			'AHH— LITTLE SOSUNO’S— CUMMING— DON’T YOU LEAVE THE ROOM—'
		],
		['미워 사랑해 멈추지 마—', '이 멍청한 큰 바보야— 마지막— 채워—', '아아— 작은 소서노가— 가— 방에서 나가지 마—'],
		true
	),
	p(
		'After, she is scarlet at what she heard herself say. He kisses the place on her temple that used to hide in a sleeve. He says he heard. He is keeping both of them, even from a chair away. She melts. It is undignified. She lets it be.',
		'그 다음, 제 입이 한 말에 새빨개진다. 그는 예전에 소매로 숨기던 관자놀이에 입을 맞춘다. 들었다고 한다. 의자 멀리서도 둘 다 지킨다고 한다. 녹는다. 품위 없다. 그래도 된다.',
		true
	),
	d('sosuno', S, ['Don’t be nice.', 'I’ll get stupid.', '…I’m already stupid.', 'Keep the well. I’m taking the glow.'], [
		'착하게 굴지 마.',
		'바보 돼.',
		'…이미 바보야.',
		'우물은 가져. 빛은 내가 가져갈게.'
	]),
	d('jumong', J, ['Take it.', 'You’re beautiful.', 'Go found the other one. I’ll be here. Grinning. Like an idiot.'], [
		'가져.',
		'예쁘다.',
		'가서 다른 거 세워. 난 여기 있을게. 웃으면서. 바보처럼.'
	]),
	p(
		'Dawn. Onjo and Biryu take their mother south. She walks like a woman who has been thoroughly answered and will not explain it to a deer, a son, or a chronicle. <b>She carries the glow all the way to Baekje.</b> After wandering for a while, they find a <b>Heavenly Deer</b> at what the older priests will call a heavenly door — a threshold between the yellow earth and the starred sky — and decide to settle there. Loyalty, they say later, is what you owe the door that let you in.',
		'새벽. 온조와 비류가 어머니를 모시고 남쪽으로 간다. 제대로 대답받은 여자처럼 걷는다. 사슴에게도, 아들에게도, 편년에도 설명하지 않는다. <b>그 빛을 백제까지 가져간다.</b> 헤매다 <b>천록</b>을 만나니 — 뒷날 늙은 제사장들이 천문(天門), 누런 땅과 별 사이 문이라 부를 자리에서 — 그곳에 자리를 잡는다. 충성이란, 훗날 말하건대, 들어와 살게 해 준 문에 빚진 것이다.'
	)
];

onjo.blocks = [...onjo.blocks.slice(0, iLeave), ...insert, ...onjo.blocks.slice(iLeave + 1)];

function upsert(slot) {
	const i = onjo.images.findIndex((im) => im.id === slot.id);
	const base = {
		ratio: 1.778,
		tone: slot.tone ?? '#e8a04a',
		nsfw: !!slot.nsfw,
		at: slot.at,
		alt: slot.alt,
		refs: slot.refs,
		people: slot.people,
		prompt: slot.prompt
	};
	if (i >= 0) onjo.images[i] = { ...onjo.images[i], ...base, id: slot.id };
	else onjo.images.push({ id: slot.id, ...base });
}

const chJ = '/ch_jumong.png';
const chS = '/ch_sosuno.png';
const bnS = '/bn_sosuno.png';
const note =
	'2D animated cel-painterly cinema, not photoreal. FACE from attached portraits; twenty winters older — same faces, mature bodies, not portrait clones. Sosuno dusty-rose NOT gold. Jumong red #e8563f. No text. No watermark.';

upsert({
	id: 'onjo-seq-goodbye-well',
	at: 'I kept it. For you.',
	alt: 'Dutch dusk: older Jumong and Sosuno at the SAME Jolbon well, packed bags, two buckets',
	people: ['jumong', 'sosuno'],
	refs: [chJ, chS, bnS],
	prompt: `Minimal iconic 16:9 still. DUTCH dusk. SAME Jolbon well: round granite rim, timber beam, two buckets on packed earth, grey giwa hall. Older Jumong and Sosuno at the rim, travel packs in lower third. FACE from attached. ${note} ONE device: the timber beam as a hard horizontal. High contrast, crushed blacks.`
});
upsert({
	id: 'nsfw-sosuno-last-night',
	nsfw: true,
	at: 'one last screaming night',
	alt: 'ECU: older Sosuno screaming pleasure, dusty-rose off the shoulder, grain-room lamp',
	people: ['sosuno'],
	refs: [chS, bnS],
	prompt: `Intimate 16:9 still. ECU. Mature Sosuno screaming, wrecked wanting face, heavy blush, FACE from attached, binyeo, dusty-rose off one shoulder. Grain-room timber bokeh, one lamp. ONE device: her open mouth center. Manhwa climax expression, sweat, not cute smile. ${note}`
});
upsert({
	id: 'sosuno-seq-glow-south',
	at: 'She carries the glow all the way to Baekje',
	alt: 'Wide dawn road: tiny Sosuno and two sons walking south, dusty-rose catching one hard key',
	people: ['sosuno', 'onjo', 'biryu'],
	refs: [chS, bnS, '/ch_onjo.png', '/ch_biryu.png'],
	prompt: `Minimal iconic 16:9 still. DUTCH WIDE dawn road, packed earth, pines, natural sky. Tiny figures lower-third: Sosuno in dusty-rose, two young men. FACE suggestions from attached. ONE device: a single dawn key-seam on her sleeve. #e8a04a rim only. Empty road, no army. ${note}`
});

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('Onjo last night inserted', insert.length, 'blocks');
