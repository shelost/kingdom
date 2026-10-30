import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));

function findEntry(title) {
	for (const a of story)
		for (const e of a.entries || []) if (e.title === title) return e;
	throw new Error('entry not found: ' + title);
}

function ix(blocks, pred, msg) {
	const i = blocks.findIndex(pred);
	if (i < 0) throw new Error(msg || 'block not found');
	return i;
}

function insertBefore(blocks, pred, items, msg) {
	blocks.splice(ix(blocks, pred, msg), 0, ...items);
}

function insertAfter(blocks, pred, items, msg) {
	blocks.splice(ix(blocks, pred, msg) + 1, 0, ...items);
}

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const section = (label, ko) => ({ kind: 'section', label, ko });
const fb = (year, title, blocks) => ({ kind: 'flashback', year, title, blocks });
function d(person, en, lines, extra = {}) {
	return { kind: 'dialogue', person, en, lines, ...extra };
}
function sp(speaker, gender, en, lines, extra = {}) {
	return { kind: 'dialogue', speaker, gender, en, lines, ...extra };
}

const YU = { look: 'hwarang', chip: '#4a8fe0' };
const CH = { look: 'hwarang', chip: '#D8258C' };
const BI = { look: 'hwarang', chip: '#141C2E' };

// ─── Bupmin: yard/wall sections + a flashback on every mural ───
{
	const e = findEntry('Bupmin');
	const b = e.blocks;

	insertBefore(b, (x) => x.kind === 'scene' && x.label === 'Flowering Youth', [
		section('The Yard', '연무장')
	]);
	insertBefore(b, (x) => x.kind === 'scene' && x.label === 'The Long Wall', [
		section('The Wall', '벽')
	]);

	insertAfter(
		b,
		(x) =>
			x.kind === 'dialogue' &&
			x.person === 'yushin' &&
			Array.isArray(x.en) &&
			x.en[0] === 'He died for not taking it.',
		[
			fb('562', 'the bowl', [
				p(
					'A famine year. The storehouse door is the only light. Two clerks have already filled their sleeves.',
					'흉년이다. 창고 문이 유일한 빛이다. 서기 둘은 이미 소매를 채웠다.'
				),
				sp('A clerk', 'm', ['Just take it.', 'Who’s counting.'], ['그냥 퍼.', '누가 세어.']),
				sp('Geomgun', 'm', ['It’s the king’s grain.'], ['임금의 곡식이오.']),
				sp(
					'Geunrang',
					'm',
					['Report them.', 'Or run. I can have a horse at the pine.'],
					['고발하든지.', '아니면 뛰어. 소나무에 말 대 줄 수 있어.']
				),
				sp('Geomgun', 'm', ['I can’t do either.'], ['둘 다 못 하오.']),
				p(
					'He empties the bowl back into the bin. The clerks do not wait for the second no.',
					'사발을 빈에 도로 비운다. 서기들은 두 번째 거절을 기다리지 않는다.'
				),
				sp('Geunrang', 'm', ['Geomgun—'], ['검군—']),
				p('The bowl hits the floor. It does not break. He does.', '사발이 바닥에 떨어진다. 깨지지는 않는다. 그는 깨진다.')
			])
		]
	);

	insertAfter(
		b,
		(x) =>
			x.kind === 'dialogue' &&
			x.person === 'yushin' &&
			Array.isArray(x.en) &&
			x.en[0] === 'Later.',
		[
			fb('561', 'the hand', [
				p(
					'A night yard. No crown. An old man, and a boy who has been asking since dusk.',
					'밤 마당. 관은 없다. 늙은이, 그리고 해 질 녘부터 빌고 있는 아이.'
				),
				sp('The boy', 'm', ['Father. Send me.', 'If you don’t, I’ll go anyway.'], [
					'아버지. 보내 주소.',
					'안 보내 주셔도, 갈 겁니다.'
				]),
				sp('Guriji', 'm', ['Sit down.'], ['앉아라.']),
				p('The boy does not sit. The hand finds his head anyway.', '아이는 앉지 않는다. 손은 그래도 머리를 찾는다.'),
				sp(
					'Guriji',
					'm',
					['Go.', 'If you can still call me father when you get back.'],
					['가거라.', '가서도 나를 아버지라 부를 수 있으면.']
				),
				sp('The boy', 'm', ['I will.'], ['부를 겁니다.']),
				p(
					'The gate is already open. The horse is already saddled. That is how you know the father had decided before the asking started.',
					'문은 이미 열려 있다. 말은 이미 안장이 얹혀 있다. 그래서 안다. 아버지는 빌기 전에 이미 정했다는 것을.'
				)
			])
		]
	);

	insertAfter(
		b,
		(x) =>
			x.kind === 'dialogue' &&
			x.person === 'yushin' &&
			Array.isArray(x.en) &&
			x.en.includes('If that gets funny later, laugh then.'),
		[
			fb('611', 'the tiger', [
				p(
					'Mount Nam. A tiger that has already decided the order. Three boys who have not.',
					'남산. 순서를 이미 정한 호랑이 한 마리. 아직 정하지 못한 소년 셋.'
				),
				d('bidam', ['What if we talk to it.', 'Everything listens, once.'], ['말을 걸어 보는 게 어떻소.', '한 번은, 다 듣거든.'], BI),
				d('yushin', ['The sword is faster.'], ['칼이 더 빠르다.'], YU),
				d('alchun', ['Oi.', 'Both of you shut up.'], ['야.', '둘 다 입 다물어.']),
				p(
					'Alchun goes in with nothing in his hands. The round one gets his arms round the neck. The sword never has to finish the sentence.',
					'알천이 빈손으로 들어간다. 동글한 아이가 목을 끌어안는다. 칼은 문장을 끝낼 필요가 없어진다.'
				),
				d('bidam', ['…I was going to count the beads first.'], ['……염주부터 세려고 했소.'], BI),
				d('yushin', ['Count later.', 'He’s heavy.'], ['나중에 세게.', '무겁다.'], YU),
				d('alchun', ['You’re welcome, by the way.'], ['참고로, 고맙다는 말은 내가 먼저 안 한다.'])
			])
		]
	);

	insertAfter(
		b,
		(x) =>
			x.kind === 'p' &&
			typeof x.html === 'string' &&
			x.html.includes('looks at the arrows for a long time'),
		[
			fb('611', 'the arrows', [
				p(
					'A monk’s room. Two young men who have already lost a season, asking for rules a layman could keep.',
					'스님의 방. 한 철을 이미 잃은 젊은이 둘. 속인이 지킬 만한 계율을 청한다.'
				),
				sp(
					'Gwisan',
					'm',
					['We need something we can keep.', 'Not a sutra. A rule.'],
					['지킬 수 있는 게 필요합니다.', '경이 아니라. 계율.']
				),
				sp(
					'Wongwang',
					'm',
					['Five.', 'Serve the sovereign. Serve your parents. Trust a friend. Never retreat. Choose when you kill.'],
					['다섯이네.', '사군이충. 사친이효. 교우이신. 임전무퇴. 살생유택.']
				),
				sp('Chuhang', 'm', ['The fourth will be the hard one.'], ['넷째가 제일 어렵겠군.']),
				sp('Wongwang', 'm', ['Then keep it first.'], ['그럼 그걸 먼저 지키게.']),
				p(
					'The next year, a fort in the western hills. The horse is still standing. The men are not going to.',
					'이듬해, 서쪽 산의 성. 말은 아직 서 있다. 사람들은 서지 못할 것이다.'
				),
				sp('Gwisan', 'm', ['The horse. Father first.'], ['말. 아버지부터.']),
				sp('Chuhang', 'm', ['We can still—'], ['아직—']),
				sp('Gwisan', 'm', ['No.'], ['안 된다.']),
				p(
					'They do not take the gap in the wall. The arrows find that out for them.',
					'벽의 틈으로 빠지지 않는다. 화살이 그걸 대신 알아낸다.'
				)
			])
		]
	);

	insertAfter(
		b,
		(x) =>
			x.kind === 'dialogue' &&
			x.person === 'yushin' &&
			Array.isArray(x.en) &&
			x.en.includes('That is the fifth precept. Choosing.'),
		[
			fb('618', 'the deer', [
				p(
					'Class 59’s first month. A yard game. One deer before sundown.',
					'오십구기 첫 달. 연무장 놀이. 해 지기 전에 사슴 한 마리.'
				),
				sp(
					'The Yard Marshal',
					'm',
					['One deer before sundown.', 'Walking does not count.'],
					['해 지기 전에 사슴 한 마리다.', '걷는 건 안 된다.']
				),
				p(
					'Most boys come back with blood on the saddle. One dumps a fawn at the line and looks around for the laugh.',
					'대부분은 안장에 피 묻히고 돌아온다. 하나는 새끼를 선에 내려놓고 웃음을 찾는다.'
				),
				p(
					'Last through the gate: a magenta sleeve, and a deer still walking. A plum blossom tied on one horn. The rope is loose. The deer does not seem to mind.',
					'문으로 마지막. 자홍빛 소매, 그리고 아직 걷는 사슴. 한쪽 뿔에 매화 한 송이. 고삐는 헐겁다. 사슴은 별로 신경 쓰지 않는 얼굴이다.'
				),
				sp('The Yard Marshal', 'm', ['Doesn’t count.', 'Kill it.'], ['안 된다.', '죽여.']),
				d(
					'chunchu',
					['If I kill it now, sir, it’s just late.', 'If I don’t, it’s a deer.'],
					['지금 죽이면, 늦은 사슴입니다.', '안 죽이면 사슴입니다.'],
					CH
				),
				p(
					'The judges shout. On the wall, a young hwarang in blue is eating a pear. He is not the marshal. He has been watching the rope, not the horn.',
					'심판들이 소리를 지른다. 담 위, 푸른 옷의 젊은 화랑이 배를 먹고 있다. 도감이 아니다. 뿔이 아니라 고삐를 보고 있었다.'
				),
				d(
					'yushin',
					['The game said bring a deer.', 'It did not say kill one.'],
					['놀이가 사슴을 내라 했지.', '죽이라 하진 않았네.'],
					YU
				),
				p(
					'The deer eats the blossom off its own horn. The Marshal has to give it to him. The man on the wall does not look at the deer. He looks at the boy.',
					'사슴이 제 뿔에서 꽃을 뜯어 먹는다. 도감은 줄 수밖에 없다. 담 위의 사람은 사슴을 보지 않는다. 소년을 본다.'
				)
			])
		]
	);

	insertAfter(
		b,
		(x) =>
			x.kind === 'dialogue' &&
			x.person === 'yushin' &&
			Array.isArray(x.en) &&
			x.en.some((s) => String(s).includes('hangs in this bay twice')),
		[
			fb('628', 'the wine', [
				p(
					'A raider camp in the western hills. Forty swords. One jar.',
					'서쪽 산의 약탈꾼 진채. 칼 마흔. 동이 하나.'
				),
				sp('A Baekje raider', 'm', ['Just the one of you.'], ['혼자야.']),
				d(
					'chunchu',
					['The wine was too heavy to come alone.'],
					['술이 혼자 오기엔 무겁소.'],
					CH
				),
				p(
					'By midnight every sword is on the ground. By dawn they ask to walk behind him. He lets them.',
					'밤이 되기 전에 칼은 전부 땅바닥에 있다. 새벽이 되면 따라가겠다고 지들이 조른다. 그는 따른다.'
				)
			])
		]
	);

	insertAfter(
		b,
		(x) =>
			x.kind === 'p' &&
			typeof x.html === 'string' &&
			x.html.startsWith('Under them, no battle.'),
		[
			fb('561', 'the river stone', [
				p(
					'A grey river. Two thirteen-year-olds. One stone. The knife is too big for the hand using it.',
					'잿빛 강. 열세 살 둘. 돌 하나. 칼이 쓰는 손에 비해 크다.'
				),
				sp('The boy', 'm', ['Like this?'], ['이렇게?']),
				sp('The other boy', 'm', ['That’s upside down.'], ['거꾸로다.']),
				sp('The boy', 'm', ['A stone hasn’t got a down.'], ['돌은 방향이 없어.']),
				p(
					'He keeps scratching. The other one watches him do it badly, and does not take the knife away.',
					'계속 긁는다. 다른 아이는 그걸 서툴게 하는 걸 보고만 있고, 칼을 빼앗지 않는다.'
				)
			])
		]
	);
}

// ─── Munhee: the deer is how Yushin first notices him ───
{
	const e = findEntry('Munhee');
	const b = e.blocks;

	insertAfter(
		b,
		(x) =>
			x.kind === 'p' &&
			typeof x.html === 'string' &&
			x.html.startsWith('His father was right about the shoes.'),
		[
			scene('The yard · one deer before sundown', '연무장 · 해 지기 전의 사슴'),
			p(
				'A yard game, the first month. One deer before sundown. The Marshal says walking does not count.',
				'첫 달의 연무장 놀이. 해 지기 전에 사슴 한 마리. 도감은 걷는 건 안 된다 한다.'
			),
			sp(
				'The Yard Marshal',
				'm',
				['One deer before sundown.', 'Walking does not count.'],
				['해 지기 전에 사슴 한 마리다.', '걷는 건 안 된다.']
			),
			p(
				'Most of Class 59 come back with blood on the saddle. Heum dumps a fawn at the line and waits for the laugh. He gets it.',
				'오십구기 대부분은 안장에 피 묻히고 돌아온다. 흠이 새끼를 선에 내려놓고 웃음을 기다린다. 웃음을 받는다.'
			),
			sp('Heum', 'm', ['Goblin’s boy’s still out.', 'Probably talking to it.'], [
				'도깨비 녀석 아직이다.',
				'말하고 있겠지, 사슴이랑.'
			]),
			p(
				'Last through the gate: a magenta sleeve, and a deer still walking. A plum blossom tied on one horn. The rope is loose. The deer does not seem to mind.',
				'문으로 마지막. 자홍빛 소매, 그리고 아직 걷는 사슴. 한쪽 뿔에 매화 한 송이. 고삐는 헐겁다. 사슴은 별로 신경 쓰지 않는 얼굴이다.'
			),
			sp('The Yard Marshal', 'm', ['Doesn’t count.', 'Kill it.'], ['안 된다.', '죽여.']),
			d(
				'chunchu',
				['If I kill it now, sir, it’s just late.', 'If I don’t, it’s a deer.'],
				['지금 죽이면, 늦은 사슴입니다.', '안 죽이면 사슴입니다.'],
				CH
			),
			p(
				'The judges shout. On the wall, a young hwarang in blue is eating a pear. He is not the marshal. Class 51 left years ago, and the yard still runs drills under his name. He has been watching the rope, not the horn.',
				'심판들이 소리를 지른다. 담 위, 푸른 옷의 젊은 화랑이 배를 먹고 있다. 도감이 아니다. 오십일기는 몇 해 전에 나갔고, 연무장은 아직도 그 이름으로 훈련을 돌린다. 그는 뿔이 아니라 고삐를 보고 있었다.'
			),
			sp('The Yard Marshal', 'm', ['Sir. The game said kill—'], ['김 화랑. 놀이가 죽이라—']),
			d(
				'yushin',
				['The game said bring a deer.', 'It did not say kill one.'],
				['놀이가 사슴을 내라 했지.', '죽이라 하진 않았네.'],
				YU
			),
			p(
				'The deer eats the blossom off its own horn. The Marshal has to give it to him. That is the first time Kim Yushin looks at Kim Chunchu, and he does not look at the deer.',
				'사슴이 제 뿔에서 꽃을 뜯어 먹는다. 도감은 줄 수밖에 없다. 김유신이 김춘추를 처음 보는 순간이다. 사슴은 보지 않는다.'
			),
			d('yushin', ['Name.'], ['이름.'], YU),
			d('chunchu', ['Kim Chunchu, sir.'], ['김춘추입니다.'], CH),
			d(
				'yushin',
				['The deer is still walking.', 'Don’t lose that.'],
				['사슴이 아직 걷고 있네.', '그걸 잃지 말게.'],
				YU
			)
		]
	);

	const mill = b.find(
		(x) =>
			x.kind === 'p' &&
			typeof x.html === 'string' &&
			x.html.startsWith('At the top of the hill, on the ninth,')
	);
	if (!mill) throw new Error('Munhee millstone hill p missing');
	mill.html =
		'On the ninth, the same young hwarang in blue is on the wall again. He sits for one pear, the way he sat for the deer.';
	mill.ko = '아홉 바퀴째, 그 푸른 옷의 젊은 화랑이 또 담 위에 있다. 사슴 때처럼, 배 하나 먹으려고 앉는다.';

	const meet = b.find(
		(x) =>
			x.kind === 'p' &&
			typeof x.html === 'string' &&
			x.html.includes('and that is how they meet.')
	);
	if (!meet) throw new Error('Munhee meet p missing');
	meet.html =
		'He tosses the core without looking. Chunchu’s hands are on the rope. It hits him square. Second time this month the man on the wall has found him.';
	meet.ko =
		'그는 보지도 않고 배 심을 던진다. 춘추의 손은 밧줄에 있다. 정면으로 맞는다. 이번 달에 담 위의 사람이 그를 찾아낸 두 번째다.';

	const class51 = ix(
		b,
		(x) =>
			x.kind === 'dialogue' &&
			x.person === 'yushin' &&
			Array.isArray(x.en) &&
			x.en[0] === 'Kim Yushin.',
		'Munhee Class 51 line'
	);
	b.splice(class51 + 1, 0, d(
		'yushin',
		['The deer is still walking, they tell me.'],
		['사슴이 아직 걷고 있다더군.'],
		YU
	), d(
		'chunchu',
		['He ate the flower, sir. I could hardly argue.'],
		['꽃을 뜯어 먹었습니다. 더 보탤 말이 없었지요.'],
		CH
	));
}

// ─── Queen Sunduk east-star flashback: deer was first ───
{
	const e = findEntry('Queen Sunduk');
	const flash = e.blocks.find((x) => x.kind === 'flashback' && x.title === 'the east star');
	if (!flash) throw new Error('east star flashback missing');
	const fbBlocks = flash.blocks;
	const open = fbBlocks[0];
	if (!open || !String(open.html).startsWith('Class 59’s first week.'))
		throw new Error('east star open p drifted');
	open.html =
		'Class 59’s first week. After the deer. A millstone with a rope through it. A fifteen-year-old who will not stop. On the ninth circuit a young hwarang in blue is cutting through the yard on his way to somewhere else. He is not the marshal. He sits on the wall for one pear.';
	open.ko =
		'오십구기 첫 주. 사슴 다음이다. 구멍에 밧줄 꿴 맷돌. 멈추지 않는 열다섯. 아홉 바퀴째, 푸른 옷의 젊은 화랑 하나가 어디론가 가던 길에 마당을 가로지른다. 도감이 아니다. 배 하나 먹으려고 담에 앉는다.';

	const core = fbBlocks.find(
		(x) => x.kind === 'p' && x.html === 'He tosses the core. The boy’s hands are full of rope. It hits him in the chest, and he sits down on the stone because there is nowhere else.'
	);
	if (!core) throw new Error('east star core still-lock drifted');

	const class51 = ix(
		fbBlocks,
		(x) =>
			x.kind === 'dialogue' &&
			x.person === 'yushin' &&
			Array.isArray(x.en) &&
			x.en.includes('Kim Yushin. Class 51.'),
		'east star Class 51'
	);
	fbBlocks.splice(class51 + 1, 0, d(
		'yushin',
		['The deer is still walking, they tell me.'],
		['사슴이 아직 걷고 있다더군.'],
		{ look: 'hwarang', chip: '#8a8a94' }
	), d(
		'chunchu',
		['He ate the flower, sir. I could hardly argue.'],
		['꽃을 뜯어 먹었습니다. 더 보탤 말이 없었지요.'],
		{ look: 'hwarang', chip: '#8a8a94' }
	));
}

// ─── Park Jesang: Goguryeo / Wa + near-misses ───
{
	const e = findEntry('Park Jesang');
	const b = e.blocks;

	insertBefore(b, (x) => x.kind === 'scene' && x.label === 'The Northern Hall', [
		section('Goguryeo', '고구려')
	]);
	insertBefore(b, (x) => x.kind === 'scene' && x.label === 'The Island', [
		section('Wa', '왜')
	]);

	insertAfter(
		b,
		(x) =>
			x.kind === 'dialogue' &&
			x.person === 'jesang' &&
			Array.isArray(x.en) &&
			x.en[0] === 'Then I go to the island with nothing.',
		[
			sp(
				'A Goguryeo officer',
				'm',
				['Rent is rent, Tae Wang.', 'The boy stays.'],
				['세는 세입니다, 태왕.', '아이는 남습니다.']
			),
			p(
				'Jangsu walks to the window. The hall waits the way a large country waits: as if it has all the time, and might use none of it.',
				'장수가 창으로 간다. 전각은 큰 나라가 기다리듯 기다린다. 시간은 다 있는 것처럼, 하나도 안 쓸 것처럼.'
			),
			sp('A Goguryeo officer', 'm', ['Tae Wang.'], ['태왕.']),
			d('jangsu', ['I heard you.'], ['들었다.'])
		]
	);

	insertAfter(
		b,
		(x) =>
			x.kind === 'dialogue' &&
			x.person === 'jesang' &&
			Array.isArray(x.en) &&
			x.en[0] === 'There is a next.',
		[
			p(
				'At the outer gate a spear comes down across the road. The boy is already on the horse. Jesang is not, for one breath.',
				'바깥문에서 창이 길을 가로막는다. 아이는 이미 말 위에 있다. 제상은, 한 숨 동안, 아니다.'
			),
			sp(
				'A Goguryeo guard',
				'm',
				['The boy. You stay.'],
				['아이만. 당신은 남으시오.']
			),
			d(
				'jesang',
				['Your king sent the boy.', 'I am only asking the road.'],
				['왕이 보낸 건 아이요.', '나는 길을 묻는 사람이오.']
			),
			p(
				'The spear lifts a finger. Then it lifts. Jesang does not thank him. Thanking would be stopping.',
				'창이 한 치 들린다. 그리고 들린다. 제상은 고맙다 하지 않는다. 고맙다는 멈추는 일이다.'
			)
		]
	);

	insertAfter(
		b,
		(x) =>
			x.kind === 'p' &&
			typeof x.html === 'string' &&
			x.html.startsWith('On the third morning the water is empty enough.'),
		[
			p(
				'A Wa captain comes to the rail while they are still talking. Jesang keeps the line in the water. He talks about bait until the captain gets bored of fish.',
				'왜의 장수가 아직 말하는 중에 난간에 온다. 제상은 줄을 물에 둔 채로 둔다. 장수가 물고기 이야기에 질릴 때까지 밑밥 얘기를 한다.'
			),
			sp('A Wa captain', 'm', ['No fish today.'], ['오늘 고기가 없군.']),
			d('jesang', ['The bait was late.'], ['밑밥이 늦었소.']),
			sp('A Wa captain', 'm', ['You’re a talker.'], ['말 잘하는 사람이로군.']),
			d('jesang', ['It passes the time.'], ['시간이 가오.']),
			p(
				'The captain leaves. Footsteps go, come back a step, go. The small boat is still tied astern. Nobody has looked at it yet.',
				'장수가 떠난다. 발소리가 갔다가, 한 걸음 돌아왔다가, 간다. 작은 배는 아직 고물에 묶여 있다. 아직 아무도 그걸 보지 않았다.'
			)
		]
	);

	insertAfter(
		b,
		(x) =>
			x.kind === 'dialogue' &&
			x.person === 'jesang' &&
			Array.isArray(x.en) &&
			x.en[0] === 'If two leave, neither gets home.',
		[
			p(
				'Footsteps on the other deck. Both of them stop talking. The footsteps decide it was the wind, and go.',
				'다른 갑판의 발소리. 둘 다 말을 멈춘다. 발소리는 바람이었다고 정하고, 간다.'
			)
		]
	);
}

// ─── Gwanggaeto: North / West / South / East from the stele ───
{
	const e = findEntry('King Gwanggaeto');
	const b = e.blocks;

	const northI = ix(b, (x) => x.kind === 'scene' && x.label === 'North');
	b.splice(northI, 1, section('North', '북'), scene('The Frozen River', '언 강'));

	insertAfter(
		b,
		(x) =>
			x.kind === 'dialogue' &&
			x.person === 'gwanggaeto' &&
			Array.isArray(x.en) &&
			x.en.some((s) => String(s).includes('the river takes you')),
		[
			sp('A Goguryeo rider', 'm', ['The ice is talking, Tae Wang.'], ['얼음이 갈라집니다, 태왕.']),
			d('gwanggaeto', ['Let it talk.', 'We wait.'], ['말하라 해라.', '기다린다.'])
		]
	);

	insertAfter(
		b,
		(x) =>
			x.kind === 'p' &&
			typeof x.html === 'string' &&
			x.html.startsWith('The river listens.'),
		[
			p(
				'A rider comes in from farther north than the tents. He is not armed. He is carrying a letter that wants to be tribute.',
				'막사보다 더 북쪽에서 기병 하나가 들어온다. 무장은 없다. 조공이고 싶어 하는 편지를 들고 있다.'
			),
			sp('A northern envoy', 'm', ['We will send it.', 'If the king does not come farther.'], [
				'보내겠습니다.',
				'태왕께서 더 오시지 않는다면.'
			]),
			d('gwanggaeto', ['Keep the letter.', 'I was going west anyway.'], ['편지는 두어라.', '어차피 서로 간다.']),
			p(
				'North, then. Without sitting in anybody’s chair. He turns the horse.',
				'북은 그렇게 끝난다. 누구 의자에도 앉지 않고. 말을 돌린다.'
			)
		]
	);

	const westI = ix(b, (x) => x.kind === 'scene' && x.label === 'West');
	b.splice(westI, 1, section('West', '서'), scene('The Western Gate', '서쪽 문'));

	insertAfter(
		b,
		(x) =>
			x.kind === 'p' &&
			typeof x.html === 'string' &&
			x.html.startsWith('The west is a wall and a different grammar.'),
		[
			p(
				'Yan shuts the gate at dusk. They mean it. The letter he did not send sits in somebody else’s pocket, unwritten.',
				'연이 해 질 녘에 문을 닫는다. 진심이다. 보내지 않은 편지가, 쓰이지도 않은 채로, 다른 사람 주머니에 들어 있다.'
			)
		]
	);

	insertAfter(
		b,
		(x) =>
			x.kind === 'dialogue' &&
			x.person === 'gwanggaeto' &&
			Array.isArray(x.en) &&
			x.en[0] === 'The letter is already late.',
		[
			sp('A Yan officer', 'm', ['We close at dusk. We open when we open.'], [
				'해 지면 닫소. 열 때 엽니다.'
			]),
			d('gwanggaeto', ['Open it in the morning.'], ['아침에 열어.']),
			p(
				'He does not camp in front of the gate. He camps on three sides of it. Morning, the gate has a new opinion.',
				'문 앞에 진을 치지 않는다. 문 세 쪽에 친다. 아침이 되면 문이 생각이 바뀐다.'
			),
			sp('A Yan officer', 'm', ['Tae Wang. The west is—'], ['태왕. 서쪽은—']),
			d('gwanggaeto', ['Mine. I know.', 'South.'], ['내 거다. 안다.', '남.'])
		]
	);

	const southI = ix(b, (x) => x.kind === 'scene' && x.label === 'South');
	b.splice(
		southI,
		1,
		section('South', '남'),
		scene('The Cliff', '벼랑'),
		p(
			'The first southern fort sits on a cliff over the water. Twenty days. On the nineteenth the captain on the cliff offers the water if they leave the stone.',
			'남쪽 첫 성은 물 위 벼랑에 앉아 있다. 스무 날. 열아흐레째, 벼랑의 장수가 돌만 남겨 두면 물은 주겠다고 한다.'
		),
		sp('A Baekje captain', 'm', ['The water. Not the stone.'], ['물은 드리겠소. 돌은 못 드리오.']),
		d('gwanggaeto', ['I’ll take the water.', 'Then the stone.'], ['물은 받지.', '그다음 돌.']),
		p(
			'They take both. He does not stay to name the cliff. He has a thinner roof still to collect.',
			'둘 다 가져간다. 벼랑에 이름을 붙이고 있지는 않는다. 아직 더 얇은 지붕이 남았다.'
		),
		scene('The Southern Hall', '남쪽 전각')
	);

	insertAfter(
		b,
		(x) =>
			x.kind === 'p' &&
			typeof x.html === 'string' &&
			x.html.startsWith('Baekje keeps the hall.'),
		[
			p(
				'The southern king comes out of his own hall. He does not want to. He does. He puts his brother on a horse pointing north, and does not watch the horse leave.',
				'남쪽 왕이 제 전각에서 나온다. 나오고 싶지 않다. 나온다. 아우를 북쪽을 향한 말에 태우고, 말이 떠나는 것은 보지 않는다.'
			),
			sp('The southern king', 'm', ['The chair is yours.'], ['의자는 가져가시오.']),
			d('gwanggaeto', ['I didn’t come for the chair.'], ['의자 하러 온 게 아니다.'])
		]
	);

	const drown = b.find(
		(x) => x.kind === 'p' && x.html && x.html.startsWith('Silla is drowning. An army')
	);
	if (!drown) throw new Error('Gwanggaeto drowning still-lock drifted');

	insertBefore(b, (x) => x.kind === 'scene' && x.label === 'The Burning Capital', [
		section('East', '동')
	]);

	insertAfter(
		b,
		(x) =>
			x.kind === 'p' &&
			typeof x.html === 'string' &&
			x.html.startsWith('The Silla king stands on his own wall'),
		[
			p(
				'Sea-raiders on the roads. Southern sails with them. The king on the wall can count two enemies and has one letter left.',
				'길에 바다에서 온 자들. 남쪽 돛이 같이 있다. 벽 위의 왕은 적을 둘 셀 수 있고, 편지는 한 장 남았다.'
			)
		]
	);

	insertAfter(
		b,
		(x) =>
			x.kind === 'dialogue' &&
			x.person === 'gwanggaeto' &&
			Array.isArray(x.en) &&
			x.en.some((s) => String(s).includes('Fifty thousand of them')),
		[
			sp(
				'A Goguryeo officer',
				'm',
				['The East, or the south.', 'Which.'],
				['왜입니까, 백제입니까.', '어느 쪽입니까.']
			),
			d('gwanggaeto', ['Both.'], ['둘.'])
		]
	);

	const envoy = b.find(
		(x) => x.kind === 'p' && x.html && x.html.startsWith('His envoy rides north for nine days')
	);
	if (!envoy) throw new Error('Gwanggaeto envoy still-lock drifted');
	const horsemen = b.find(
		(x) =>
			x.kind === 'p' &&
			x.html === 'The horsemen come down out of the north like weather.'
	);
	if (!horsemen) throw new Error('Gwanggaeto horsemen still-lock drifted');
	const hostages = b.find(
		(x) => x.kind === 'p' && x.html && x.html.includes('crown princes go north as hostages')
	);
	if (!hostages) throw new Error('Gwanggaeto hostages still-lock drifted');
}

// ─── More episodes: top-level sections ───
function addSections(title, pairs) {
	const e = findEntry(title);
	for (const [pred, sec] of pairs) insertBefore(e.blocks, pred, [sec], title + ' section');
}

addSections('Harmony Council', [
	[(x) => x.kind === 'scene' && x.label === "The King's Room", section('The Death', '죽음')],
	[(x) => x.kind === 'scene' && x.label === 'The Night Before', section('The Vote', '표')]
]);

addSections('Jade Gate Valley', [
	[(x) => x.kind === 'scene' && x.label === 'The Yard', section('The Yard', '연무장')],
	[(x) => x.kind === 'scene' && x.label === 'Jade Gate Valley', section('The Valley', '옥문곡')]
]);

addSections('Five Tribes', [
	[(x) => x.kind === 'scene' && x.label === 'The Cart', section('The Road', '길')],
	[(x) => x.kind === 'scene' && x.label === 'Five Stones', section('The Stones', '다섯 돌')]
]);

addSections('Yonghwa Hyangdo', [
	[(x) => x.kind === 'scene' && x.label === 'The Window', section('The Spring', '샘')],
	[(x) => x.kind === 'scene' && x.label === 'The Moon Palace', section('The Campaign', '출정')]
]);

addSections('Eight Great Clans', [
	[(x) => x.kind === 'scene' && x.label === 'The Sand', section('The Sand', '모래')],
	[(x) => x.kind === 'scene' && x.label === 'The Assembly', section('The Assembly', '집정')]
]);

{
	const e = findEntry('The Morning Star');
	e.blocks.splice(0, 0, section('The Hill', '언덕'));
	insertBefore(e.blocks, (x) => x.kind === 'scene' && x.label === 'Deer Rock', [
		section('Deer Rock', '사슴바위')
	]);
	insertBefore(e.blocks, (x) => x.kind === 'scene' && x.label === 'The Sacred Cave', [
		section('The Cave', '굴')
	]);
}

addSections('King Euija', [
	[(x) => x.kind === 'scene' && x.label === 'The Morning After', section('The Rock', '바위')],
	[(x) => x.kind === 'scene' && x.label === 'The Princes', section('The Princes', '왕자들')]
]);

addSections('King Micheon', [
	[(x) => x.kind === 'scene' && x.label === 'The salt boat · the Amnok', section('The Salt', '소금')],
	[(x) => x.kind === 'scene' && x.label === 'The hunt · that autumn', section('The Hunt', '사냥')]
]);

addSections('The Revolt', [
	[(x) => x.kind === 'scene' && x.label === 'The Banquet', section('The Banquet', '잔치')],
	[(x) => x.kind === 'day' && x.label === 'AFTER THE KNIVES', section('After', '그 다음')]
]);

addSections('The Stele', [
	[(x) => x.kind === 'story' && x.label === 'Yeon Soryu', section('Yeon Soryu', '연소류')]
]);

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');

function countFb(title) {
	const e = findEntry(title);
	return e.blocks.filter((x) => x.kind === 'flashback').length;
}
function countSec(title) {
	const e = findEntry(title);
	return e.blocks.filter((x) => x.kind === 'section').map((x) => x.label).join(', ');
}

console.log('Bupmin flashbacks', countFb('Bupmin'), 'sections', countSec('Bupmin'));
console.log('Munhee sections', countSec('Munhee'), 'deer scene', findEntry('Munhee').blocks.some((x) => x.label === 'The yard · one deer before sundown'));
console.log('Jesang sections', countSec('Park Jesang'));
console.log('Gwanggaeto sections', countSec('King Gwanggaeto'));
console.log('Harmony', countSec('Harmony Council'));
console.log('Jade', countSec('Jade Gate Valley'));
console.log('Five Tribes', countSec('Five Tribes'));
console.log('Yonghwa', countSec('Yonghwa Hyangdo'));
console.log('Morning Star', countSec('The Morning Star'));
console.log('ok');
