import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(path, 'utf8'));
const jumong = story.flatMap((c) => c.entries).find((e) => e.title === 'Jumong');
const onjo = story.flatMap((c) => c.entries).find((e) => e.title === 'Onjo');
if (!jumong || !onjo) throw new Error('entries missing');

const p = (html, ko, nsfw) => ({ kind: 'p', html, ko, ...(nsfw ? { nsfw: true } : {}) });
const d = (person, chip, en, lines, nsfw) => ({
	kind: 'dialogue',
	person,
	chip,
	en,
	lines,
	...(nsfw ? { nsfw: true } : {})
});

const T = '#a97c4a';
const J = '#e8563f';
const S = '#e8a04a';

const iRiver = jumong.blocks.findIndex((b) => b.en?.[0] === 'River dump you?');
if (iRiver < 0) throw new Error('tabal river missing');
const iWalk = jumong.blocks.findIndex(
	(b) => b.html?.includes('walks him the packed earth like a man showing a storeroom')
);
if (iWalk < 0) throw new Error('tabal walk missing');

jumong.blocks[iWalk] = p(
	'<b>Yeon Tabal</b> is the man the scouts meant. Crow-clan chieftain, largest roof in a valley of five that will not share a yard. He walks Jumong the packed earth like a storeroom shown to a thief — grain porch, well, pine — and keeps a spear-length. He has not decided if this wet one is a guest or a scout who got lost on purpose. <b>Tabal shows him the valley like a ledger.</b>',
	'<b>연타발</b>이 그 사람이다. 까마귀 족장. 마당을 안 나누는 지붕 다섯 중 제일 큰 집. 도둑에게 곳간 보여 주듯 다진 흙을 걷힌다 — 곡식 누대, 우물, 소나무 — 창 길이만큼 떨어진다. 이 젖은 자가 손님인지, 일부러 길을 잃은 척후인지 아직 안 정했다. <b>골짜기를 장부처럼 보여 준다.</b>'
);

const tabalTalk = [
	d(T === T ? 'yeontabal' : 'yeontabal', T, ['River dump you?', 'Or did someone send you.'], [
		'강이 뱉었냐.',
		'아니면 누가 보냈냐.'
	]),
	d('jumong', J, ['River.', 'I didn’t send me.'], ['강이요.', '절 보낸 사람은 없어요.']),
	d(
		'yeontabal',
		T,
		[
			'Han.',
			'Mohe. Khitan. The next roof over.',
			'You don’t talk like this valley.',
			'I do not want ash tracked into my hall.'
		],
		['한.', '말갈. 거란. 옆 지붕.', '이 골짜기 말이 아니다.', '내 마루에 재 끌어들이고 싶지 않다.']
	),
	d(
		'jumong',
		J,
		[
			'I don’t— I don’t know those names.',
			'North. They called it Buyeo. A river. Brothers. I ran.',
			'I don’t know where this is.',
			'If that’s a crime I can leave. I’m good at leaving.'
		],
		[
			'그 이름들은— 몰라요.',
			'북쪽이요. 부여라고 했어요. 강. 형들. 뛰었어요.',
			'여기가 어딘지 몰라요.',
			'죄면 갈게요. 가는 건 잘하거든요.'
		]
	),
	d(
		'yeontabal',
		T,
		['Jolbon.', 'Not Buyeo. Don’t say Buyeo like it still owns the pine.', 'Wipe that grin off.'],
		['졸본이다.', '부여 아니다. 소나무가 아직 그 나라인 것처럼 말하지 마.', '그 웃음을 치워.']
	)
];

jumong.blocks.splice(iRiver, 7, ...tabalTalk);

const iMillet = jumong.blocks.findIndex((b) => b.html?.includes('For a week Tabal uses him'));
if (iMillet < 0) throw new Error('millet week missing');

const explainer = p(
	'The chronicler can say what mouths will not. Jolbon is older-fashioned than northern Buyeo: five tribes named for animals — bear, tiger, crow, wolf, boar — and the crow roof is Tabal’s, the largest. They are a branch of Joseon people who came south years ago and forgot the common root; some winters they cut each other, some they cut Han columns, some they cut Mohe and Khitan who think the pine is empty. Tabal has not offered a mat. He has offered a test. <b>Shed. You hunt, you eat.</b>',
	'입은 안 하고 사관이 한다. 졸본은 북쪽 부여보다 옛것이다. 짐승 이름 다섯 부족 — 곰, 호랑이, 까마귀, 늑대, 멧돼지 — 그중 제일 큰 까마귀 지붕이 연타발의 것. 옛 조선 사람들이 남쪽으로 내려와 뿌리를 잊었다. 어떤 겨울엔 서로를 베고, 어떤 겨울엔 한의 줄을 베고, 어떤 겨울엔 소나무가 비었다고 오는 말갈과 거란을 벤다. 연타발은 자리를 안 줬다. 시험을 줬다. <b>헛간. 사냥하면 밥.</b>'
);

const shed = [
	d('yeontabal', T, ['Shed. You hunt, you eat.', 'My daughter. You look, I dig a ditch.'], [
		'헛간. 사냥하면 밥.',
		'내 딸. 보면 도랑 판다.'
	]),
	d('jumong', J, ['Shed. Hunt. Got it.', 'I wasn’t going to look.'], [
		'헛간. 사냥. 알겠어요.',
		'볼 생각 없었어요.'
	]),
	d('yeontabal', T, ['You were.', 'Don’t.'], ['하고 있었다.', '하지 마.'])
];

jumong.blocks.splice(iMillet, 0, explainer, ...shed);

const iWell = jumong.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Well');
const iFeast = jumong.blocks.findIndex(
	(b, i) => i > iWell && b.html?.includes('They do not make it to a feast. The grain-room lamp')
);
if (iWell < 0 || iFeast < 0) throw new Error(`well ${iWell} feast ${iFeast}`);

const well = [
	jumong.blocks[iWell],
	p(
		'The well is always the same well: round stone rim, one timber beam, hemp rope, two buckets on packed earth, grey giwa hall behind, grain porch left. Nobody stands in the shaft. She is already there, chin up, and there are two Jolbon girls still holding steam like they were invited. Sosuno looks at them. They go. Then she looks at him like he is late to a count he did not know he was on. <b>The well is an accident she timed.</b>',
		'우물은 늘 그 우물이다. 둥근 돌 테, 들보 하나, 삼 줄, 다진 흙 위 두레박 둘, 뒤의 회색 기와, 왼쪽 곡식 누대. 아무도 우물 안에 안 선다. 그녀는 이미 있다. 턱. 졸본 계집 둘이 아직 김을 들고 있는 게, 초대한 사람처럼. 소서노가 본다. 간다. 그다음 그를 본다. 자기가 모르는 셈에 늦은 사람처럼. <b>우물은 그녀가 맞춘 우연이다.</b>'
	),
	d('sosuno', S, ['You. Rope.', 'If you came to smile at them, they’re gone.', 'Pull or don’t.'], [
		'너. 줄.',
		'그애들한테 웃으러 왔으면, 갔어.',
		'당기든가 말든가.'
	]),
	d('jumong', J, ['I came for water.', 'You keep doing that.'], ['물 뜨러 왔어.', '맨날 그래.']),
	d('sosuno', S, ['Doing what.', 'Talking doesn’t fill it.', 'Don’t look at my face.'], [
		'뭘.',
		'말로 안 차.',
		'얼굴 보지 마.'
	]),
	p(
		'He does not grin this time. The rope waits. He doesn’t. <b>You keep chasing them off.</b>',
		'이번엔 안 웃는다. 줄은 기다린다. 그는 아니다. <b>자꾸 쫓아내잖아.</b>'
	),
	d(
		'jumong',
		J,
		[
			'Why are you like this.',
			'Rude. In the way. Every time I try to do a thing.',
			'The well girls. That chieftain’s kid. You told her I talk to millet.',
			'I can’t even say hi without you arriving with a bucket like a spear.'
		],
		[
			'왜 그래.',
			'무례하고. 길에 있고. 내가 뭐만 하면.',
			'우물 애들. 그 족장 딸. 조한테 말 건다고 했지.',
			'안녕만 해도 두레박을 창처럼 들고 오잖아.'
		]
	),
	d(
		'sosuno',
		S,
		['하!? You— you talk like that at my well?', 'Rude. You’re the rude one.', 'Who asked you to hi anyone.'],
		['하!? 우리 우물에서— 그렇게 말해?', '무례한 건 너야.', '누구한테 안녕 하래.']
	),
	d(
		'jumong',
		J,
		[
			'Okay.',
			'Then I won’t.',
			'I’ll go. South. Tonight if that’s easier.',
			'You can have the well. And the girls. And the count.'
		],
		['알겠어.', '그럼 안 할게.', '갈게. 남쪽. 그게 편하면 오늘 밤.', '우물 가져. 애들. 셈.']
	),
	p(
		'She does not raise her voice. That is worse. The second bucket is empty and she looks at it like it might save her. <b>Wait—</b>',
		'목소리를 안 높인다. 그게 더 싫다. 둘째 두레박이 비어 있고, 그게 자기를 구해 줄 것처럼 본다. <b>잠깐—</b>'
	),
	d(
		'sosuno',
		S,
		[
			'Wait— that’s not—',
			'The second bucket isn’t full.',
			'Father’s count is at dusk. If you’re not in the shed he yells at me.',
			'The west millet. You hit the boar. If you go the cousins will dig the ditch crooked.',
			'And— and the path south is stupid in the dark. You don’t know it.',
			'That’s all. Reasons. Not—',
			'…Sosuno.',
			'There. Now you have to stay to remember it. Big idiot.'
		],
		[
			'잠깐— 그게 아니라—',
			'둘째 두레박 안 찼어.',
			'아버지 점고가 해 질 때야. 헛간에 없으면 나한테 소리 질러.',
			'서쪽 조. 멧돼지 맞혔잖아. 가면 사촌들이 도랑을 비뚤게 파.',
			'그리고— 그리고 남쪽 길은 밤에 바보야. 너 모르잖아.',
			'그게 다야. 이유. 그런 거—',
			'…소서노야.',
			'됐어. 기억하려면 남아야 해. 이 큰 바보.'
		]
	),
	d('jumong', J, ['Sosuno.', 'Cute name.', 'You could’ve just said stay.'], [
		'소서노.',
		'이름 귀엽네.',
		'그냥 남으라고 해도 됐거든.'
	]),
	p(
		'He does not wait for her to finish being brave. Packed earth, the rim, the beam. <b>He kisses her at the well-beam.</b>',
		'그녀가 용감한 척을 끝낼 때까지 안 기다린다. 다진 흙, 테, 들보. <b>우물 들보에서 입을 맞춘다.</b>'
	),
	d('sosuno', S, ['You—', 'How dare you.', 'My father’s well—', '…Don’t grin. If you grin I—'], [
		'너—',
		'어떻게 감히.',
		'아버지 우물에서—',
		'…웃지 마. 웃으면 나—'
	]),
	d('jumong', J, ['You kissed back.', 'Just saying.'], ['너도 따라왔거든.', '참고로.']),
	d('sosuno', S, ['Did not.', 'Surprise.', '…The second bucket still isn’t full.'], [
		'안 했어.',
		'놀라서.',
		'…둘째 두레박 아직 안 찼어.'
	])
];

jumong.blocks.splice(iWell, iFeast - iWell, ...well);

const iBehind = jumong.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Behind the Door');
const iMarry = jumong.blocks.findIndex(
	(b, i) => i > iBehind && b.html?.includes('The marriage is real hunger first')
);
if (iBehind < 0 || iMarry < 0) throw new Error('behind door');
jumong.blocks.splice(
	iMarry + 1,
	0,
	p(
		'Royal silk hits the floor the way dusty-rose used to. Camera would be behind her: the queen’s naked back filling the frame, side breast, gache still in, looking over her shoulder at the man who just got a cord. <b>her royal back is the picture</b>',
		'왕실 비단이 예전 회분홍처럼 바닥에 떨어진다. 카메라가 등 뒤에 있다면: 왕비의 벗은 등이 화면을 채우고, 옆가슴, 가체는 아직, 끈 받은 사내를 넘겨본다. <b>왕비의 등이 그림이다</b>',
		true
	),
	p(
		'Then the reverse: his naked back as the plane, crown-cord still catching the lamp, her mouth at his shoulder, greedy. <b>his royal back is the picture</b>',
		'그다음 반대. 그의 벗은 등이 면이고, 왕끈이 등잔을 받고, 그녀의 입이 어깨에 있다. 욕심. <b>왕의 등이 그림이다</b>',
		true
	)
);

const iLast = onjo.blocks.findIndex((b) => b.html?.includes('one last screaming night'));
if (iLast < 0) throw new Error('last night');
onjo.blocks.splice(
	iLast + 1,
	0,
	p(
		'Queen’s robe at the hip, nothing on the back. She looks over her shoulder the way she did at the well, older, worse. <b>queen back last night</b>',
		'왕비 곤이 허리에만 있다. 등은 없다. 우물에서처럼 넘겨본다. 나이 들었고, 더 심하다. <b>마지막 밤 왕비의 등</b>',
		true
	),
	p(
		'His turn: king’s back to the lamp, muscle she has counted for twenty winters, her nails. <b>king back last night</b>',
		'그 차례. 등잔을 받은 왕의 등. 스무 겨울 세어 온 근육. 손톱. <b>마지막 밤 왕의 등</b>',
		true
	)
);

const royalQueen = {
	id: 'nsfw-royal-queen-back',
	ratio: 0.75,
	tone: '#e8a04a',
	nsfw: true,
	at: 'her royal back is the picture',
	alt: 'From behind: Queen Sosuno’s naked back filling the frame, side breast, looking over her shoulder at Dongmyung',
	refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_dongmyung.png'],
	people: ['sosuno', 'jumong'],
	prompt: ''
};
const royalKing = {
	id: 'nsfw-royal-king-back',
	ratio: 0.75,
	tone: '#e8563f',
	nsfw: true,
	at: 'his royal back is the picture',
	alt: 'From behind: King Dongmyung’s naked back filling the frame; Queen Sosuno’s mouth at his shoulder',
	refs: ['/ch_dongmyung.png', '/ch_sosuno_queen.png', '/bn_sosuno.png'],
	people: ['jumong', 'sosuno'],
	prompt: ''
};
const onjoQB = {
	id: 'nsfw-onjo-queen-back',
	ratio: 0.75,
	tone: '#e8a04a',
	nsfw: true,
	at: 'queen back last night',
	alt: 'Last night: Queen Sosuno’s naked back, older, looking over her shoulder',
	refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_dongmyung.png'],
	people: ['sosuno', 'jumong'],
	prompt: ''
};
const onjoKB = {
	id: 'nsfw-onjo-king-back',
	ratio: 0.75,
	tone: '#e8563f',
	nsfw: true,
	at: 'king back last night',
	alt: 'Last night: King Dongmyung’s naked back to the lamp; Sosuno’s nails',
	refs: ['/ch_dongmyung.png', '/ch_sosuno_queen.png', '/bn_sosuno.png'],
	people: ['jumong', 'sosuno'],
	prompt: ''
};

const iQslut = jumong.images.findIndex((im) => im.id === 'nsfw-sosuno-queen-slut');
if (iQslut < 0) throw new Error('queen slut slot');
jumong.images.splice(iQslut + 1, 0, royalQueen, royalKing);

const iOnjoBack = onjo.images.findIndex((im) => im.id === 'nsfw-onjo-backs-last');
if (iOnjoBack < 0) throw new Error('onjo back slot');
onjo.images[iOnjoBack].refs = ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_dongmyung.png'];
onjo.images[iOnjoBack].at = 'one last screaming night';
onjo.images.splice(iOnjoBack + 1, 0, onjoQB, onjoKB);

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('patched tabal, well, royal/onjo slots');
