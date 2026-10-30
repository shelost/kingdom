import { editStory, entryOf } from './story-ops.mjs';

const CHIP = {
	suchun: '#8b1e2d',
	ilu: '#c45a3a',
	sobal: '#a84838',
	bongsang: '#6e2a2a'
};

function p(html, ko) {
	return { kind: 'p', html, ko };
}
function d(person, en, lines, extra = {}) {
	return { kind: 'dialogue', person, chip: CHIP[person], en, lines, ...extra };
}

const NEW = [
	p('They said they were sick.', '아프다고 했다.'),
	p('This is the house. Keep it. People will leave it.', '이 집이다. 봐 둬라. 사람들이 빠져나갈 테니까.'),
	{
		kind: 'diagram',
		diagram: 'goguryeo-house',
		step: 'house',
		title: 'The house · 고구려 왕실',
		caption: 'Suchun and his brothers on one row. Only his two sons hang under him. Dolgo’s boy at the end.',
		ko: '한 줄이 서천과 아우들. 아래는 서천의 아들 둘뿐이다. 맨 끝이 돌고의 아이.'
	},
	p(
		'Not sons. Younger brothers. The kind who still think a crown can move sideways.',
		'아들이 아니다. 아우다. 왕관이 옆으로도 간다고 아직 믿는 쪽.'
	),
	{
		kind: 'scene',
		label: 'The hot spring · a feast',
		ko: '온탕 · 잔치',
		weather: 'dusk',
		year: 286
	},
	p(
		'They take a fever as far as the king’s spring outside the walls. Steam. Drums. Wine that does not wait for a hall.',
		'열을 핑계로, 성 밖 임금의 온탕까지 간다. 김. 북. 전각을 기다리지 않는 술.'
	),
	p(
		'Outside the pools the party is already a country. Men and women in the water, silk around the hips or not even that. Someone is laughing so hard he swallows steam.',
		'탕 밖은 이미 나라다. 물에 남녀. 허리에 비단, 아니면 그것도 없다. 누가 김을 삼킬 만큼 웃는다.'
	),
	p(
		'Ilu pours for anyone who will sit. Sobal’s good eye is wet from the heat. The boy Saburu is on the bank with a cup he is not old enough to finish. He came because his father said watch.',
		'일우는 앉는 사람마다 따른다. 소발의 남은 눈은 김에 젖어 있다. 아이 상부는 둑에 앉아, 아직 다 못 마시는 잔을 든다. 아버지가 보라고 해서 왔다.'
	),
	{
		kind: 'card',
		person: 'bongsang',
		caption: 'Prince Saburu. He is supposed to be watching a party.',
		ko: '왕자 상부. 잔치를 보라고 나온 아이다.',
		look: 'prince',
		still: '/intro/bongsang-prince--ulbul.jpg'
	},
	{
		kind: 'scene',
		label: 'The side pool · the same steam',
		ko: '곁탕 · 같은 김',
		weather: 'dusk'
	},
	p(
		'They take a quieter pool. The drums cover them. That is the point of a loud spring.',
		'더 조용한 탕으로 간다. 북이 덮어 준다. 시끄러운 온탕의 쓸모가 그것이다.'
	),
	d(
		'ilu',
		['If hyung is gone.', 'It’s us.', 'Dalga can keep the wall. He likes walls.'],
		['형 없으면.', '우리야.', '달가는 벽이나 지켜. 벽을 좋아하잖아.']
	),
	d(
		'sobal',
		['The spring has to stay loud.', 'Inside has to be quiet.', 'Tonight, if the wine holds.'],
		['온탕은 계속 시끄러워야 해.', '안은 조용해야지.', '오늘. 술이 가면.']
	),
	d(
		'ilu',
		['Don’t say tonight out loud.', 'Say it into the steam.'],
		['오늘이라고 입 밖에 내지 마.', '김에다 말해.']
	),
	p(
		'A runner comes along the wet stone. He has a hall voice, and he is trying not to look at anyone’s chest.',
		'전령이 젖은 돌을 따라 온다. 전각 목소리다. 누구 가슴도 안 보려고 한다.'
	),
	{
		kind: 'dialogue',
		speaker: 'A runner',
		gender: 'm',
		chip: '#6b5344',
		en: [
			'Princes.',
			'His Majesty will seat you. Both. Chancellor.',
			'Now. He said now.'
		],
		lines: [
			'왕제들.',
			'전하께서 자리를 내리신다고. 둘 다. 재상.',
			'지금. 지금이라고 하셨습니다.'
		]
	},
	d(
		'sobal',
		['Chancellor.', 'Both of us?', 'Ha. Hyung got generous.'],
		['재상.', '둘 다?', '하. 형이 헤프다.']
	),
	d(
		'ilu',
		['Get dressed.', 'Don’t make a king wait for a promotion.', 'The spring can keep singing.'],
		['입어.', '승진 기다리게 하지 마.', '온탕은 계속 놀아.']
	),
	p(
		'They come out of the steam still laughing. Silk sticks. Someone at the pool cheers them the way you cheer a wedding.',
		'김에서 나오며 아직 웃는다. 비단이 붙는다. 탕의 누가, 혼인 보내는 소리로 환호한다.'
	),
	{
		kind: 'scene',
		label: 'The inner hall · the same night',
		ko: '내전 · 그날 밤',
		weather: 'night'
	},
	p(
		'The hall is quieter than the spring. That should have been the first warning. Suchun is already standing. He does not sit for a chair he is about to take back.',
		'전각은 온탕보다 조용하다. 그게 첫 경고였어야 한다. 서천은 이미 서 있다. 도로 거둘 자리에 앉지 않는다.'
	),
	{
		kind: 'card',
		person: 'suchun',
		caption: 'He offered them a chair. He had already counted the men behind it.',
		ko: '자리를 내렸다. 뒤에 세운 사내는 이미 세어 두었다.',
		still: '/intro/suchun--ulbul.jpg'
	},
	d(
		'suchun',
		['Come in.', 'You first.', 'Don’t drip on the floor.'],
		['들어와.', '네가 먼저.', '바닥에 물 흘리지 마.']
	),
	d(
		'ilu',
		['Hyung.', 'We came. The spring can wait.', 'Which chair—'],
		['형.', '왔어. 온탕은 기다려.', '어느 자리가—']
	),
	p(
		'The strong men step out of the dark they were told to be. No screens. No speech. Hands, then steel.',
		'장사들이, 있으라던 어둠에서 나온다. 병풍 없다. 연설 없다. 손, 그리고 쇠.'
	),
	d(
		'sobal',
		['Wait— hyung.', 'The chair. You said the chair—'],
		['잠깐— 형.', '자리. 자리 준다고—']
	),
	d(
		'suchun',
		['I said come.', 'I didn’t say sit.', 'Hold them.'],
		['오라 했다.', '앉으라 하진 않았다.', '잡아.']
	),
	p(
		'It is fast. Two brothers, two sets of hands. The floor learns a new color. Nobody in that hall is invited to be surprised.',
		'빠르다. 아우 둘, 손 두 쌍. 바닥이 새 색깔을 배운다. 그 전각에서 놀랄 허락을 받은 사람은 없다.'
	),
	{
		kind: 'scene',
		label: 'The spring again · the heads',
		ko: '다시 온탕 · 머리',
		weather: 'night'
	},
	p(
		'He walks back out to the steam with both heads. The drums miss a beat, then try to find it, then give up.',
		'머리 둘을 들고 김으로 다시 나온다. 북이 한 박자 놓친다. 찾으려다, 포기한다.'
	),
	p(
		'Men cover themselves who had not thought to. A woman laughs once, the wrong laugh, and puts her hand over her mouth. Wine keeps going into cups that nobody lifts.',
		'생각지도 않던 사람들이 몸을 가린다. 여자가 한 번 웃는다. 잘못된 웃음. 입을 막는다. 잔에는 술이 가는데, 드는 손은 없다.'
	),
	d(
		'suchun',
		['This is a plot.', 'Look at it.', 'Anyone else thirsty.'],
		['이게 모반이다.', '봐라.', '더 마실 사람.']
	),
	p(
		'The boy is still on the bank. He was told to watch. He does. He will wear the crown. He will never forget the steam, or the way a party goes quiet.',
		'아이는 아직 둑에 있다. 보라고 해서 본다. 왕관을 쓸 아이다. 김을, 잔치가 멈추는 법을, 잊지 않는다.'
	),
	{
		kind: 'card',
		person: 'bongsang',
		caption: 'Prince Saburu. He will wear the crown. He will never forget the heads.',
		ko: '왕자 상부. 왕관을 쓸 아이다. 머리를 잊지 않는다.',
		look: 'prince',
		still: '/intro/bongsang-prince--ulbul.jpg'
	},
	{
		kind: 'quote',
		html: 'In the spring of the seventeenth year the king’s younger brothers Ilu and Sobal plotted rebellion. Feigning illness they went to the hot spring, made sport without restraint with their faction, and spoke treason. The king summoned them, falsely promising to appoint them chancellor; when they arrived he ordered strong men to seize and execute them.',
		ko: '十七年 봄 2월, 왕의 아우 일우·소발 두 사람이 모반하였다. 병을 핑계로 온탕에 가서 무리와 절제 없이 즐기며 패역한 말을 하였다. 왕이 불러 재상을 내린다고 속이고, 이르자 장사에게 잡아 죽이라 하였다.',
		hanja: '十七年春二月，王弟逸友、素勃等二人謀叛，詐稱病往溫湯，與黨類戲樂無節，出言悖逆。王召之，僞許拜相，及其至，令力士執而誅之。',
		source: 'Samguk Sagi (三國史記) bk. 17, Goguryeo Annals, King Suchun',
		event: 'ilu-sobal-spring',
		stance: 'agree',
		claim: 'Ilu and Sobal were the king’s brothers. He lured them from the spring and killed them.',
		claimKo: '일우와 소발은 임금의 아우였다. 온탕에서 불러 죽였다.'
	},
	p('Family is the first knife. A king who forgets that, dies at supper.', '가족은 첫 칼이다. 그걸 잊은 임금은 저녁에 죽는다.'),
	{
		kind: 'diagram',
		diagram: 'goguryeo-house',
		step: 'banquet',
		title: 'After the spring · 온탕 다음',
		caption: 'Ilu and Sobal are gone. The boy on the bank is still in the steam.',
		ko: '일우와 소발이 빠졌다. 둑의 아이는 아직 김 속에 있다.'
	}
];

editStory((story) => {
	const entry = entryOf(story, 'five-principles', 'Ulbul');
	if (!entry) throw new Error('Ulbul missing');
	const start = entry.blocks.findIndex((b) => b.html === 'They invited him to supper.' || b.html === 'They said they were sick.');
	const end = entry.blocks.findIndex((b) => b.diagram === 'goguryeo-house' && b.step === 'banquet');
	if (start < 0) throw new Error('start missing');
	if (end < 0) throw new Error('end missing');
	entry.blocks.splice(start, end - start + 1, ...NEW);

	for (const b of entry.blocks) {
		if (b.kind === 'card' && b.person === 'bongsang' && typeof b.caption === 'string' && b.caption.includes('who poured')) {
			b.caption = 'King Bongsang. He remembers the heads. He will not be walked out for.';
			b.ko = '봉상왕. 머리를 기억한다. 당해 나갈 생각은 없다.';
		}
	}

	const cups = (entry.images ?? []).find((im) => im.id === 'mich-banquet-cups');
	if (cups) {
		cups.at = 'The party is already a country.';
		cups.alt = 'Wide dusk: Goguryeo hot spring feast, steam and tiny laughing bodies, silk and bare shoulders';
	}
	const screens = (entry.images ?? []).find((im) => im.id === 'mich-screens-drop');
	if (screens) {
		screens.at = 'The strong men step out of the dark';
		screens.alt = 'Night hall: hidden strong men seize Ilu and Sobal as Suchun stands and does not sit';
	}
	const behead = (entry.images ?? []).find((im) => im.id === 'mich-behead');
	if (behead) {
		behead.at = 'He walks back out to the steam with both heads.';
		behead.alt = 'Suchun at the spring’s edge with two dark heads; the feast gone silent';
	}
	const pillar = (entry.images ?? []).find((im) => im.id === 'mich-pillar-boy');
	if (pillar) {
		pillar.at = 'The boy is still on the bank.';
		pillar.alt = 'Young Saburu on the wet bank, watching the heads come back through the steam';
	}

	console.log('replaced banquet', start, '→', end, 'with', NEW.length, 'blocks');
});
