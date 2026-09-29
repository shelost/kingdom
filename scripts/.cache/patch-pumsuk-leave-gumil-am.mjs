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

function blockText(b) {
	if (!b) return '';
	if (typeof b.html === 'string') return b.html;
	if (b.kind === 'dialogue') return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
	if (b.kind === 'day') return b.label ?? '';
	return '';
}

function upsertAfter(entry, slot, afterId) {
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) {
		Object.assign(entry.images[i], slot);
		return;
	}
	const after = afterId ? entry.images.findIndex((im) => im.id === afterId) : -1;
	if (after >= 0) entry.images.splice(after + 1, 0, slot);
	else entry.images.push(slot);
}

const daeya = findEntry('Daeya Fortress');
const chipM = '#c98fb0';
const chipG = '#9a7b5f';

const start = daeya.blocks.findIndex((b) =>
	blockText(b).includes('They do not stop until the lamp dies')
);
const end = daeya.blocks.findIndex((b) =>
	blockText(b).includes('That is the last thing they ever say to each other')
);
if (start < 0 || end < 0 || end < start) {
	throw new Error(`bad range start=${start} end=${end}`);
}

const newBlocks = [
	{
		kind: 'p',
		nsfw: true,
		html: '<b>They do not stop until the lamp dies.</b> Load after load inside her. Hanbok still on — just less of it. She is hoarse. For the first time in this fortress she is not the one running the room.',
		ko: '<b>등잔이 죽을 때까지 멈추지 않는다.</b> 그 안에, 한 번이 아니다. 한복은 아직 있다 — 다만 덜 있다. 목이 쉬었다. 이 성에서 처음으로 방을 운영하는 쪽이 아니다.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'Afterwards she is <b>on the worn pine</b>. Jeogori open. Chima a wreck. <b>White milk on the dirtied green</b> — on the boards, on the cheap sash, on her, catching the last of the lamp. She cannot sit up yet. She does not try.',
		ko: '끝나고 <b>낡은 마루 위에 있다</b>. 저고리는 열려 있다. 치마는 망가졌다. <b>때 묻은 초록 위에 흰 젖</b> — 마루에, 싼 끈에, 그녀에, 마지막 등잔에 잡힌다. 아직 일어나지 못한다. 하려고도 하지 않는다.'
	},
	{
		kind: 'p',
		html: 'He stands. The ice-blue is still clean. He does not look at her. He does not speak. <b>He leaves the feast without a word</b> — through the cheap screen, through the dark hall, back into the rank that will pretend this timber never happened. The lamps do not follow him. She stays on the floor.',
		ko: '일어선다. 얼음빛은 아직 깨끗하다. 그녀를 보지 않는다. 말하지 않는다. <b>말 없이 잔치를 나선다</b> — 싼 병풍을 지나, 어두운 전각을 지나, 이 나무가 없었다고 할 계급 속으로. 등잔은 따라가지 않는다. 그녀는 마루에 남는다.'
	},
	{
		kind: 'day',
		label: 'THE NEXT MORNING',
		ko: '다음날 아침'
	},
	{
		kind: 'p',
		html: 'Grey in the door-slit. The feast is a cold hall. <b>Gumil comes back from the stores</b> and finds his wife where the True Bone left her — dirtied green still open, last night still on the boards. He does not ask if she is hurt. He asks for the story.',
		ko: '문틈의 회색. 잔치는 차가운 전각이다. <b>검일이 창고에서 돌아와</b> 진골이 두고 간 자리에 아내를 본다 — 때 묻은 초록은 아직 열려 있고, 지난밤은 아직 마루에 있다. 다쳤느냐고 묻지 않는다. 이야기를 묻는다.'
	},
	{
		kind: 'dialogue',
		chip: chipG,
		person: 'gumil',
		lines: ['처음부터.', '다.', '빼지 말고.'],
		en: ['From the start.', 'All of it.', 'Don’t leave any out.']
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['등잔 줄.', '앉아. 자두.', '그다음엔… 마루야.'],
		en: ['The lamp-line.', 'Sit. The plum.', 'After that… the floor.']
	},
	{
		kind: 'dialogue',
		chip: chipG,
		person: 'gumil',
		lines: ['그다음.', '이름.', '몇 번.'],
		en: ['After that.', 'The name.', 'How many times.']
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'She tells it. The walk. The knot. The scream the screen did not hide. Load after load, and the clean silk that never stained. <b>He makes her say the leaving last</b> — that the boy stood up, did not look, and walked out of the feast as if the room were already empty.',
		ko: '말한다. 걸음. 매듭. 병풍이 가리지 못한 소리. 그 안에 몇 번, 그리고 더러워지지 않은 비단. <b>떠나는 것을 마지막에 말하게 한다</b> — 그 아이가 일어서서, 보지 않고, 방이 이미 빈 것처럼 잔치를 나갔다고.'
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['말은 없었어.', '그냥 나갔어.', '나는… 마루에 남았고.'],
		en: ['He didn’t speak.', 'He just left.', 'I… stayed on the floor.']
	},
	{
		kind: 'dialogue',
		chip: chipG,
		person: 'gumil',
		lines: ['반쪽이 낫다고.', '내 아이보다.', '그 말도 했어. 했어?'],
		en: ['A half is better.', 'Than mine.', 'You said that too. Did you.']
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['했어.', '이 성 사람들이 다 쓰레기니까요.', '당신 부하들도. 이 성벽도. 이 나라도.'],
		en: ['I did.', 'Because everyone in this fortress is trash.', 'Your men. These walls. This country.']
	},
	{
		kind: 'dialogue',
		chip: chipG,
		person: 'gumil',
		lines: ['…그래.', '그런데 너도 여기 있잖아.', '너도 <b>쓰레기</b>야.'],
		en: ['…Right.', 'But you are here too.', 'You are <b>trash</b> as well.']
	},
	{
		kind: 'p',
		html: '<b>They stand in the door-slit of morning</b> and do not touch. The heat from the feast is gone. What is left is the count of what she said, and the count of what he made her say, and a marriage that has already finished speaking.',
		ko: '<b>그들은 아침 문틈에 서서</b> 서로 닿지 않는다. 잔치의 열기는 없다. 남은 것은 그녀가 한 말의 셈과, 그가 말하게 한 말의 셈과, 이미 말하기를 끝낸 혼인이다.'
	},
	{
		kind: 'p',
		html: 'That is the last thing they ever say to each other.',
		ko: '두 사람이 서로에게 한 마지막 말이다.'
	}
];

daeya.blocks.splice(start, end - start + 1, ...newBlocks);

for (const im of daeya.images) {
	if (/^pumsuk-dream-/.test(im.id)) im.at = '__retired_pumsuk_dream__';
}

const nightRefs = ['/ch_gumil_wife.png', '/bn_gumil_wife.png', '/ch_pumsuk.png'];
const morningRefs = ['/ch_gumil.png', '/ch_gumil_wife.png', '/bn_gumil_wife.png'];

upsertAfter(
	daeya,
	{
		id: 'pumsuk-hc-14-leave',
		ratio: 1.778,
		tone: '#7EB8F0',
		nsfw: true,
		at: 'He leaves the feast without a word',
		alt: 'He walks out of the dark feast in clean ice-blue; she stays on the worn pine behind him',
		refs: nightRefs,
		people: ['pumsuk', 'gumilwife'],
		prompt:
			'Intimate cinematic 16:9. LOCKED Daeya feast-hall night. CARAVAGGIO. He leaves without a word. No text. No watermark.'
	},
	'pumsuk-hc-13-milk'
);

const morning = [
	{
		id: 'gumil-am-01-door',
		at: 'Gumil comes back from the stores',
		alt: 'Grey morning: Gumil in the door-slit; Maehwa still on the boards in wrecked green'
	},
	{
		id: 'gumil-am-02-force',
		at: 'From the start',
		alt: 'Morning: he stands over her in the cold hall and makes her start at the beginning'
	},
	{
		id: 'gumil-am-03-tell',
		at: 'He makes her say the leaving last',
		alt: 'She tells it — wrecked, hoarse; his rust sleeve and orange cloth in the grey'
	}
];

let after = 'pumsuk-hc-14-leave';
for (const s of morning) {
	upsertAfter(
		daeya,
		{
			id: s.id,
			ratio: 1.778,
			tone: '#6b7f9e',
			nsfw: true,
			at: s.at,
			alt: s.alt,
			refs: morningRefs,
			people: ['gumil', 'gumilwife'],
			prompt:
				'Intimate cinematic 16:9. Same Daeya hall, grey morning. Gumil forces the story. No text. No watermark.'
		},
		after
	);
	after = s.id;
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`rewrote ${end - start + 1} → ${newBlocks.length} blocks; leave + morning slots`);
