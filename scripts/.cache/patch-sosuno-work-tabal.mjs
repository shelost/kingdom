import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const entry = Object.values(story)
	.flatMap((ch) => ch.entries ?? [])
	.find((e) => e.title === 'Jumong');
if (!entry) throw new Error('Jumong entry missing');

const idx = (pred) => {
	const i = entry.blocks.findIndex(pred);
	if (i < 0) throw new Error('block not found: ' + pred);
	return i;
};

const iUp = idx((b) => b.kind === 'scene' && b.label === 'Upstairs');
const iOd = idx((b) => b.kind === 'scene' && b.label === 'Other Daughters');
const upstairs = entry.blocks.splice(iUp, iOd - iUp);

const loftP = upstairs.find((b) => b.kind === 'p' && String(b.html).includes('She ogles him from the loft'));
if (loftP) {
	loftP.html =
		'She does not stay in the yard. Chin still up, loft stairs two at a time like a woman with grain to count. The window faces the millet. Shirt off. Red silk knotted at the hip. A back doing work she assigned. Downstairs he is inventory. Up here the inventory has a laugh, and Little Sosuno will not shut up about it. <b>She ogles him from the loft.</b>';
	loftP.ko =
		'마당에 안 남는다. 턱은 올라가 있고, 곡식 세는 여자처럼 다락 계단을 두 칸씩 오른다. 창이 조밭을 본다. 저고리 벗음. 붉은 비단을 허리에. 자기가 시킨 일. 아래에서는 재고다. 위에서는 그 재고가 웃고, 작은 소서노가 그걸 안 끊는다. <b>다락에서 그를 빤다.</b>';
}

const ogleTalk = upstairs.find((b) => b.kind === 'dialogue' && Array.isArray(b.en) && b.en[0] === 'Look at that back—');
if (ogleTalk) {
	ogleTalk.en = [
		'Look at that back—',
		'하— no. Don’t look. You’re looking.',
		'You like him. Don’t you.',
		'음… stupid. He’s just… work.',
		'Mine to count. That’s all. That’s—'
	];
	ogleTalk.lines = [
		'등 봐—',
		'하— 아니. 보지 마. 보고 있잖아.',
		'좋아하잖아. 그 바보.',
		'음… 바보야. 그냥… 일이야.',
		'내가 세는 거야. 그게 다야. 그게—'
	];
}

const littleTalk = upstairs.find(
	(b) => b.kind === 'dialogue' && Array.isArray(b.en) && b.en[0]?.startsWith('Little Sosuno')
);
if (littleTalk) {
	littleTalk.en = [
		'Little Sosuno… you’re hungry today aren’t you…',
		'I don’t blame you…. 음! look at him…',
		'Those big— 흐읍— chest…. back….',
		'You pulled him off teal for a ditch. Liar.',
		'Ah— 뚝. Wait. Wait—',
		'Out there working shirtless… I want— 하아—'
	];
	littleTalk.lines = [
		'작은 소서노야… 오늘 배고프지…',
		'이해해…. 음! 저 놈 봐봐…',
		'그 근육— 흐읍— 가슴…. 등….',
		'청록이한테서 빼서 도랑 시켰지. 거짓말쟁이야.',
		'아— 뚝. 잠깐. 잠깐—',
		'저고리 벗고 일하네… 그거— 하아—'
	];
}

const stay = entry.blocks.find(
	(b) => b.kind === 'dialogue' && b.person === 'yeontabal' && Array.isArray(b.en) && b.en.includes('Stay anyway.')
);
if (stay) {
	stay.en = [
		'The millet likes you. I don’t.',
		'Stay anyway.',
		'Worker. Sosuno’s count.',
		'Shed stays the shed.',
		"He's Sosuno's worker"
	];
	stay.lines = [
		'조는 너를 좋아한다. 나는 아니다.',
		'그래도 남아.',
		'일꾼이다. 소서노 셈.',
		'헛간은 헛간이다.',
		'소서노 일꾼이다'
	];
}

const odExtra = [
	{
		kind: 'p',
		html: 'Tabal put him on her ledger so the valley would stop calling him a guest. Worker. Her count. She uses it. When teal laughs too long she does not say mine. She says <b>That’s my worker</b> and takes his sleeve like a bucket handle.',
		ko: '손님이라는 말을 끊으려고 연타발이 그를 그녀의 장부에 올렸다. 일꾼. 그녀 셈. 그걸 쓴다. 청록이 너무 오래 웃으면 내 거라고 안 한다. <b>내 일꾼이야</b> 하고, 두레박 손잡이처럼 소매를 잡는다.'
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: [
			'That’s my worker.',
			'Sleeve. Ditch. Now.',
			'You can laugh at empty buckets. Not at him.'
		],
		lines: ['내 일꾼이야.', '소매. 도랑. 지금.', '빈 두레박 보고 웃든가. 그 놈은 안 돼.']
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['I was just—', 'They asked if I could hit a knot.', 'I said maybe.'],
		lines: ['그냥—', '매듭 맞히냐고 해서.', '아마, 그랬어.']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: [
			'You hit millet. You hit a boar.',
			'You do not hit their laugh.',
			'Father put you on my count. I count.',
			'Don’t smile at them'
		],
		lines: [
			'조 맞히고. 멧돼지 맞히고.',
			'그 웃음은 맞히지 마.',
			'아버지가 내 셈에 올렸어. 내가 세.',
			'그애들한테 웃지 마'
		]
	},
	{
		kind: 'dialogue',
		chip: '#c4a06a',
		speaker: '👧',
		en: ['She owns the exile now?', 'Scary. Kind of hot though.'],
		lines: ['이제 망명객 저 애 거야?', '무섭다. 근데 좀 멋있긴.']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: ['The roof owns him.', 'I count the roof.', 'Next.'],
		lines: ['지붕이 가져.', '지붕은 내가 세.', '다음.']
	}
];

const workScene = [
	{ kind: 'scene', label: 'Her Count', ko: '그녀의 셈' },
	{
		kind: 'p',
		html: 'She works him like a tool she did not ask for and will not give back. Ditch. Sacks. Rope. Chin up. Stern. He grins at the dirt anyway. <b>Ditch. Now.</b>',
		ko: '안 달라고 한 연장처럼 굴린다. 안 내놓는다. 도랑. 가마니. 줄. 턱. 매섭다. 그는 흙 보고도 웃는다. <b>도랑. 지금.</b>'
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: ['Ditch. Now.', 'Straight. If it’s crooked I make you dig it twice.', 'Don’t grin at the mud.'],
		lines: ['도랑. 지금.', '곧게. 비뚤면 두 번 파.', '진흙 보고 웃지 마.']
	},
	{
		kind: 'p',
		html: 'He digs. She stands over the cut like a hunt. Dusty-rose does not hitch. The yard learns the new rule: the exile lifts, the eldest points. <b>She makes him wring the rope</b>',
		ko: '판다. 그녀는 사냥처럼 그 홈 위에 선다. 회분홍은 안 꺾인다. 마당이 새 규칙을 배운다. 망명객이 들고, 맏딸이 가리킨다. <b>줄은 짜게 한다</b>'
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: [
			'Count the sacks. Don’t grin.',
			'West porch. All of them.',
			'If you drop one I count it off your supper.'
		],
		lines: ['가마니 세. 웃지 마.', '서쪽 누대. 다.', '하나 떨어뜨리면 저녁에서 깎아.']
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['Yes boss.', 'You’re pretty when you’re counting.', 'Sorry. Working. See? Working.'],
		lines: ['예 대장.', '세는 거 예쁘다.', '미안. 일하는 중. 봐. 일해.']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: ['하—!?', 'Count.', 'Don’t talk.'],
		lines: ['하—!?', '세.', '말 하지 마.']
	},
	{
		kind: 'p',
		html: 'By dusk his red is grey with millet dust and she still has not said thank you. The loft stairs are right there. She takes them like accounts. <b>The ledger was a cover</b>',
		ko: '해 질 녘이면 붉은 옷이 조 가루로 잿빛이고, 고맙다는 말은 아직 없다. 다락 계단이 바로 있다. 장부처럼 오른다. <b>장부는 핑계였다</b>'
	}
];

const iWell = idx((b) => b.kind === 'scene' && b.label === 'The Well');
entry.blocks.splice(iWell, 0, ...odExtra, ...workScene, ...upstairs);

const shameP = idx((b) => b.kind === 'p' && String(b.html).includes('He goes for water'));
entry.blocks[shameP].html =
	'He goes for water. The door shuts. She lasts three breaths. Then she slides down the sacks with both palms over her mouth, scarlet, furious at a word he already left. Beautiful. Little Sosuno. She mouths idiot at the timber until the latch lifts. He comes back. They do not make it to two beds. <b>They sleep in the granary</b>';
entry.blocks[shameP].ko =
	'물을 뜨러 간다. 문이 닫힌다. 숨 세 번. 그다음 가마니를 타고 주저앉아 두 손으로 입을 막는다. 새빨개지고, 두고 간 그 단어들이 밉다. 예쁘다. 작은 소서노. 빗장이 들릴 때까지 들보를 향해 바보라고 입만 움직인다. 돌아온다. 이불 둘까지 못 간다. <b>곡간에 잠든다</b>';

const iTabalP = idx((b) => b.kind === 'p' && String(b.html).includes('I am not pleased. I am also not blind.'));
entry.blocks.splice(
	iTabalP,
	2,
	{
		kind: 'p',
		html: 'Dawn in the grain room is a hard seam under the door. Two people, one dusty-rose, millet in their hair. Then a tiger-pelt fills the seam. <b>Tabal is in the doorway</b>',
		ko: '곡식방 새벽은 문 밑 빛 한 줄이다. 사람 둘, 회분홍 하나, 머리에 조. 그다음 호랑이 가죽이 그 줄을 메운다. <b>연타발이 문간에 있다</b>'
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['That’s— we were—', 'Counting.', 'Sacks. See? Sacks.'],
		lines: ['그게— 우린—', '세고 있었어요.', '가마니. 봐요. 가마니.']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: ['Inventory.', 'He fell. I— west count.', 'Don’t— Father—'],
		lines: ['재고요.', '넘어졌어요. 저— 서쪽 셈.', '아— 아버지—']
	},
	{
		kind: 'dialogue',
		person: 'yeontabal',
		chip: '#a97c4a',
		en: [
			'I am not pleased. I am also not blind.',
			'If you want to be my son-in-law',
			'you pass the tests.',
			'The pine is one.',
			'Hit, we talk. Miss, shed.'
		],
		lines: [
			'안 기쁘다. 눈은 있다.',
			'사위가 되고 싶으면',
			'시험 통과해라.',
			'소나무가 하나다.',
			'맞히면 이야기한다. 빗나가면 헛간.'
		]
	}
);

const newSlots = [
	{
		id: 'jumong-seq-hire',
		ratio: 1.778,
		tone: '#a97c4a',
		nsfw: false,
		at: "He's Sosuno's worker",
		alt: 'Dutch porch: Tabal pointing Jumong toward Sosuno’s ledger; she chin-up, he grinning',
		refs: ['/ch_yeon_tabal.png', '/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['yeontabal', 'jumong', 'sosuno'],
		prompt: 'EVERY FRAME A PAINTING. Dutch porch. Tabal assigns Jumong to Sosuno.'
	},
	{
		id: 'sosuno-seq-work-pull',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: false,
		at: 'That’s my worker',
		alt: 'Dutch well: Sosuno stern, grabbing Jumong’s red sleeve; teal girl a bokeh stamp',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'EVERY FRAME A PAINTING. Sosuno pulls Jumong from the well girls.'
	},
	{
		id: 'sosuno-seq-work-ditch',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: false,
		at: 'Ditch. Now.',
		alt: 'Worm’s-eye ditch: Jumong digging, Sosuno a stern dusty-rose stamp above the cut',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'EVERY FRAME A PAINTING. Stern Sosuno, Jumong in a ditch.'
	},
	{
		id: 'sosuno-seq-work-sacks',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: false,
		at: 'Count the sacks. Don’t grin.',
		alt: 'OTS grain porch: Sosuno pointing sacks, stern; Jumong hauling, grin',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'EVERY FRAME A PAINTING. Stern count, sacks.'
	},
	{
		id: 'sosuno-seq-work-stern-ecu',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: false,
		at: 'Don’t grin at the mud.',
		alt: 'ECU: Sosuno stern work-face, dusty-rose, crushed black bokeh',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['sosuno'],
		prompt: 'EVERY FRAME A PAINTING. ECU stern Sosuno.'
	},
	{
		id: 'sosuno-seq-work-rope',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: false,
		at: 'She makes him wring the rope',
		alt: 'Dutch well: Sosuno stern over the beam; Jumong wringing hemp, grinning',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'EVERY FRAME A PAINTING. Well rope, stern boss.'
	},
	{
		id: 'tabal-seq-dawn-door',
		ratio: 1.778,
		tone: '#a97c4a',
		nsfw: false,
		at: 'Tabal is in the doorway',
		alt: 'OTS dawn: Tabal’s tiger-pelt fills the grain-room door; two shy under dusty-rose',
		refs: ['/ch_yeon_tabal.png', '/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['yeontabal', 'sosuno', 'jumong'],
		prompt: 'EVERY FRAME A PAINTING. Tabal in the grain doorway at dawn.'
	},
	{
		id: 'jumong-seq-dawn-shy',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: false,
		at: 'They sleep in the granary',
		alt: 'Dutch low: two under one dusty-rose in the grain room, dawn seam, millet in hair',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'EVERY FRAME A PAINTING. Sleeping in the granary.'
	}
];

const have = new Set((entry.images ?? []).map((im) => im.id));
entry.images = entry.images ?? [];
for (const s of newSlots) {
	if (!have.has(s.id)) entry.images.push(s);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched Jumong order; slots', newSlots.map((s) => s.id).join(', '));
