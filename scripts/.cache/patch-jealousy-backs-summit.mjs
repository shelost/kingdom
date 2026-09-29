import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(path, 'utf8'));
const jumong = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Jumong');
if (!jumong) throw new Error('Jumong missing');

const p = (html, ko, nsfw) => ({ kind: 'p', html, ko, ...(nsfw ? { nsfw: true } : {}) });
const d = (person, chip, en, lines, extra = {}) => ({
	kind: 'dialogue',
	person,
	chip,
	en,
	lines,
	...extra
});

const J = '#e8563f';
const S = '#e8a04a';
const T = '#a97c4a';

function findHtml(sub) {
	const i = jumong.blocks.findIndex((b) => typeof b.html === 'string' && b.html.includes(sub));
	if (i < 0) throw new Error(`missing html: ${sub}`);
	return i;
}

const iLaugh = findHtml('At the well three girls laugh too long');
const already = jumong.blocks[iLaugh + 1]?.en?.join?.('\n')?.includes('They’re funny');
if (!already) {
	jumong.blocks.splice(
		iLaugh + 1,
		0,
		p(
			'The three of them know how to stand. Teal, plum, saffron — dusty-rose is not the only silk in the valley. Even in hanbok they hitch a hip, let a sleeve fall, laugh like the bucket is a joke he is in. Sosuno has hunted since she could count. She does not hitch. She arrives like a muster. <b>They can do sexy. She can do eldest.</b>',
			'셋은 서는 법을 안다. 청록, 자두, 사프란 — 골짜기에 회분홍만 있는 게 아니다. 한복이어도 허리 한쪽으로, 소매 떨어지게, 두레박이 그 남자 농담인 것처럼 웃는다. 소서노는 셈할 줄 알 때부터 사냥했다. 허리를 안 꺾는다. 소집처럼 온다. <b>그들은 야한 걸 한다. 그녀는 맏딸을 한다.</b>'
		),
		d(
			'jumong',
			J,
			['They’re funny.', 'I didn’t say anything.', '…You’re scowling.'],
			['웃기네.', '난 말 안 했어.', '…너 찌푸리잖아.']
		),
		d(
			'sosuno',
			S,
			[
				'Stop enjoying it.',
				'Teal hairpin. Plum braid. Saffron laugh.',
				'I counted. I always count.',
				'This well’s ours.',
				'They can stand like that. I don’t. Next.'
			],
			[
				'즐기지 마.',
				'청록 비녀. 자두 땋은머리. 사프란 웃음.',
				'셌어. 맨날 세.',
				'이 우물 우리 거야.',
				'저렇게 설 수 있지. 난 못해. 다음.'
			]
		),
		d(
			undefined,
			'#c4a06a',
			['She’s scary.', 'He’s still looking though.'],
			['무섭다.', '근데 아직 보긴 보더라.'],
			{ speaker: '👧' }
		)
	);
}

const iTake = jumong.blocks.findIndex(
	(b) => b.person === 'sosuno' && b.en?.includes?.('Then take it.')
);
if (iTake < 0) throw new Error('Then take it missing');
if (!jumong.blocks[iTake + 1]?.html?.includes('She sticks it out anyway')) {
	jumong.blocks.splice(
		iTake + 1,
		0,
		p(
			'She tries what the well girls do. Turns her back. Sticks that tight little ass out like a hunt stance. It isn’t. Her shoulders are still a muster. The dusty-rose hitch is a beat late. She hates the delay. <b>She sticks it out anyway</b>',
			'우물 애들이 하던 걸 해 본다. 등을 돌린다. 그 작고 팽팽한 엉덩이를 사냥 자세처럼 내민다. 사냥이 아니다. 어깨는 아직 소집이다. 회분홍이 한 박자 늦다. 그 늦음이 싫다. <b>그래도 내민다</b>',
			true
		),
		d(
			'sosuno',
			S,
			[
				'Don’t you dare laugh.',
				'They do this. Teal. Saffron.',
				'I hunt. I don’t— this.',
				'Look at my back. That’s… that’s the picture.',
				'If it’s ugly, don’t tell me. I’ll hit you.'
			],
			[
				'웃지 마.',
				'저애들은 이렇게 하거든. 청록. 사프란.',
				'난 사냥해. 이런 건— 안 해.',
				'등 봐. 그게… 그게 그림이야.',
				'못생기면 말하지 마. 때릴 거야.'
			],
			{ nsfw: true }
		),
		d(
			'jumong',
			J,
			[
				'I’m not.',
				'Okay. A little.',
				'Do it again.',
				'That’s yours. Tight. I like the late hitch.'
			],
			['안 웃어.', '알겠어. 조금.', '또 해.', '네 거야. 팽팽해. 그 늦은 박자 좋아.'],
			{ nsfw: true }
		),
		d(
			'sosuno',
			S,
			['…Big idiot.', '그런 거 아니거든.', 'Come here. Before I stand up like a spear again.'],
			['…이 큰 바보.', '그런 거 아니거든.', '이리 와. 다시 창처럼 서기 전에.'],
			{ nsfw: true }
		)
	);
}

const iSummit = findHtml('the first summit of the five tribes');
jumong.blocks[iSummit] = p(
	'After the marriage the five tribes gather on Tabal’s packed-earth yard — <b>the first summit of the five tribes</b>. Bear, tiger, crow, wolf, boar: five fires, five roofs that hate sharing a yard. They come in on the packed earth, sit in a ring the ditches never allowed, and do the thing they hate more than a feud. They agree. <b>The five tribes vote.</b>',
	'혼인 뒤에 다섯 부족이 연타발의 다진 흙 마당에 모인다 — <b>오부 초대 회의</b>. 곰, 호랑이, 까마귀, 늑대, 멧돼지: 불 다섯, 마당을 안 나누던 지붕 다섯. 다진 흙으로 들어와, 도랑이 못 하게 하던 고리에 앉고, 원한보다 싫은 일을 한다. 합의. <b>다섯 부족이 뽑는다.</b>'
);

if (!jumong.blocks.some((b) => b.html?.includes('They sit in a ring the yard can hold'))) {
	jumong.blocks.splice(
		iSummit + 1,
		0,
		p(
			'<b>They sit in a ring the yard can hold</b> — not a hall of chairs, mats on dirt, giwa behind, smoke going straight. Tabal does not speechify. He counts heads the way he counts millet. Jumong stands in the lower third of his own country and grins like the pine still might miss.',
			'<b>마당이 받는 고리에 앉는다</b> — 의자 대청이 아니다. 흙 위 자리, 뒤의 기와, 곧게 가는 연기. 연타발은 연설 안 한다. 조 세듯 머리를 센다. 주몽은 제 나라의 아래쪽에 서서, 소나무가 아직 빗나갈 수 있다는 듯이 웃는다.'
		),
		d(
			undefined,
			'#6b5a48',
			['Crow roof votes.', 'Bear. Tiger. Wolf.', 'Boar last. Always last.', '…King, then. The archer.'],
			['까마귀 지붕이 뽑소.', '곰. 호랑이. 늑대.', '멧돼지가 마지막. 늘 마지막.', '…왕이면, 그 활잡이.'],
			{ speaker: '🗣' }
		)
	);
}

const iCord = findHtml('Tabal sets a vermilion cord');
jumong.blocks[iCord] = p(
	'No Tang drums. No empty gold hall. The ceremony is the yard: <b>Tabal sets a vermilion cord</b> on his son-in-law’s brow the way a man sets a tool on a workbench — then a dusty-rose sash on his daughter’s shoulder, same wind, same dirt. They stand together in front of the five fires. Not a portrait. A count. <b>The five fires take the same wind</b>. Sosuno’s chin is up; her hand finds his sleeve and drops it. <b>first queen of a country that still smells like millet</b>. <b>the largest kingdom in Samhan</b> is a later map. Tonight the map is five roofs answering one name.',
	'당의 북은 없다. 빈 금빛 대청도 없다. 예식이 마당이다. <b>연타발이 사위의 이마에 주홍 끈을 올린다</b> — 연장 올려두듯 — 그다음 딸의 어깨에 회분홍 띠. 같은 바람, 같은 흙. 불 다섯 앞에 둘이 선다. 초상화가 아니다. 셈이다. <b>불 다섯이 같은 바람을 먹는다</b>. 소서노는 턱을 든다. 소매를 잡았다가 놓는다. <b>아직 조 냄새 나는 나라의 첫 왕비</b>. <b>삼한에서 가장 큰 나라</b>는 나중의 지도다. 오늘 밤의 지도는 이름 하나에 대답하는 지붕 다섯.'
);

if (!jumong.blocks.some((b) => b.html?.includes('King and queen on packed earth'))) {
	const iAfterCord = jumong.blocks.findIndex(
		(b) => b.person === 'sosuno' && b.en?.includes?.('Don’t look at me like that in front of them.')
	);
	jumong.blocks.splice(
		iAfterCord,
		0,
		p(
			'<b>King and queen on packed earth</b> — grey giwa, five smoke columns, the hall a timber wedge. They face the ring, not a camera. He is still grinning. She is still pretending she came to count fires.',
			'<b>다진 흙 위의 왕과 왕비</b> — 회색 기와, 연기 다섯, 대청은 나무 쐐기. 고리를 본다. 카메라를 안 본다. 그는 아직 웃는다. 그녀는 아직 불 세러 온 척한다.'
		)
	);
}

function slot(im) {
	return {
		ratio: 1.778,
		tone: im.tone,
		nsfw: !!im.nsfw,
		id: im.id,
		at: im.at,
		alt: im.alt,
		refs: im.refs,
		people: im.people,
		prompt: im.prompt
	};
}

const newSlots = [
	slot({
		id: 'sosuno-seq-daughters-sexy',
		tone: '#c4a06a',
		at: 'They can do sexy. She can do eldest',
		alt: 'Dutch well: three anonymous Jolbon girls in teal plum saffron hanbok hitching hips; Sosuno a spear at the edge',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'daughters sexy vs eldest'
	}),
	slot({
		id: 'nsfw-sosuno-ass-out',
		tone: S,
		nsfw: true,
		at: 'She sticks it out anyway',
		alt: 'OTS grain room: Sosuno awkward, tight ass out, looking back over her shoulder',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'awkward ass out'
	}),
	slot({
		id: 'nsfw-sosuno-back-tight',
		tone: S,
		nsfw: true,
		at: 'Look at my back. That’s… that’s the picture',
		alt: 'ECU from behind: Sosuno’s tight little ass, dusty-rose hiked, grain sacks',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['sosuno'],
		prompt: 'tight ass ECU back'
	}),
	slot({
		id: 'nsfw-sosuno-back-dutch',
		tone: S,
		nsfw: true,
		at: 'the back is the picture',
		alt: 'Dutch: Sosuno naked back column, looking over shoulder, grain lamp',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'dutch naked back'
	}),
	slot({
		id: 'nsfw-sosuno-back-worm',
		tone: S,
		nsfw: true,
		at: 'That’s yours. Tight',
		alt: 'Worm’s-eye: Sosuno hips and back above the camera, Jumong looking',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'worm hip back'
	}),
	slot({
		id: 'jumong-seq-summit-ring',
		tone: '#a97c4a',
		at: 'They sit in a ring the yard can hold',
		alt: 'Bird’s-eye: five mats in a ring on Jolbon packed earth, five fires, giwa hall',
		refs: ['/ch_yeon_tabal.png', '/ch_dongmyung.png'],
		people: ['yeontabal', 'jumong'],
		prompt: 'summit ring'
	}),
	slot({
		id: 'jumong-seq-crown-pair',
		tone: J,
		at: 'King and queen on packed earth',
		alt: 'Wide: Dongmyung and Queen Sosuno facing five fires in a real Jolbon courtyard',
		refs: ['/ch_dongmyung.png', '/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_yeon_tabal.png'],
		people: ['jumong', 'sosuno', 'yeontabal'],
		prompt: 'normal pair coronation yard'
	})
];

const have = new Set((jumong.images ?? []).map((i) => i.id));
if (!jumong.images) jumong.images = [];
for (const im of newSlots) {
	if (have.has(im.id)) Object.assign(jumong.images.find((i) => i.id === im.id), im);
	else jumong.images.push(im);
}

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('ok', jumong.blocks.length, 'images', jumong.images.length);
