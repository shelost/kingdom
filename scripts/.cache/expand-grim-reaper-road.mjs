/**
 * Expand Grim Reaper: Kangrim's mortal life + the west-road walk through the
 * nine peoples' Far Lands, then the pond jump into the flower field.
 * Run: node scripts/.cache/expand-grim-reaper-road.mjs
 */
import { editStory } from './story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const d = (who, en, lines) => {
	const block = {
		kind: 'dialogue',
		en: Array.isArray(en) ? en : [en],
		lines: Array.isArray(lines) ? lines : [lines]
	};
	if (who.person) {
		block.person = who.person;
		if (who.look) block.look = who.look;
	} else {
		block.speaker = who.speaker;
		if (who.gender) block.gender = who.gender;
	}
	if (who.chip) block.chip = who.chip;
	return block;
};

const K = { person: 'kangrim', look: 'mortal', chip: '#4a4a58' };
const WIFE = { speaker: 'His Wife', gender: 'f', chip: '#c4a574' };
const GATE = { speaker: 'Gate-god', gender: 'm', chip: '#6a6a58' };
const KITCHEN = { speaker: 'Kitchen-god', gender: 'm', chip: '#8a5a3a' };
const HOST = { speaker: 'A host on the road', gender: 'm', chip: '#8d8d95' };
const MONK = { speaker: 'Mujangsung', gender: 'm', chip: '#4a5a4a' };

editStory((story) => {
	const en = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Grim Reaper');
	if (!en) throw new Error('Grim Reaper missing');
	if (en.blocks.some((b) => b.kind === 'scene' && b.label === 'The West Road')) {
		console.log('already expanded');
		return false;
	}

	/* —— 1. Mortal life after the hall intro (block 9), before the shrine dialogue —— */
	const hallP = en.blocks.findIndex(
		(b) => b.kind === 'p' && (b.html || '').includes('The magistrate was called Gimchi')
	);
	if (hallP < 0) throw new Error('hall intro missing');

	const mortal = [
		scene('Kangrim', '강림'),
		p(
			'Before the red book, before the question, he is a living strongman. The village measures him by how much rice he can carry and how quietly he leaves a room when a fight is already over.',
			'붉은 책과 질문 이전, 그는 산 장사다. 마을은 그를, 쌀을 얼마나 지고 싸움이 끝난 방을 얼마나 조용히 나가는지로 잰다.'
		),
		p(
			'He wins at the yard. He loses at the ledger. The magistrate keeps him because the law sometimes needs a man who can open a door without opening a case.',
			'마당에서는 이기고, 장부에서는 진다. 원님이 그를 두는 건, 법이 가끔 사건을 열지 않고 문만 열 사람을 필요로 해서다.'
		),
		p(
			'His wife keeps two bowls at the gate — one for the gate-god, one for the kitchen-god — and a calendar scratched into the post for harvest. He promised her a date. He has never broken a date she could see.',
			'아내는 문간에 그릇을 둘 둔다. 문신용, 조왕용. 기둥엔 가을걷이 날이 긁혀 있다. 그는 아내에게 날짜를 약속했다. 아내가 볼 수 있는 날짜는 깨 본 적이 없다.'
		),
		d(
			WIFE,
			['You are large.', 'Stay large on this side of the road.'],
			['당신은 크네.', '길 이쪽에서 크게 있게.']
		),
		d(K, ['I am only going as far as the law goes.'], ['법이 가는 데까지만 가리다.'])
	];
	en.blocks.splice(hallP + 1, 0, ...mortal);

	/* —— 2. Replace the Road Down one-liner with the long walk, keep the jump —— */
	const roadAt = en.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Road Down');
	if (roadAt < 0) throw new Error('Road Down missing');
	const jumpAt = en.blocks.findIndex(
		(b, i) => i > roadAt && b.kind === 'p' && (b.html || '').includes('He shuts his eyes and jumps')
	);
	if (jumpAt < 0) throw new Error('jump block missing');

	const road = [
		scene('The Road Down', '저승길'),
		p(
			'The gate-god and the kitchen-god put him on the road, because his wife had kept them fed.',
			'문신과 조왕이 길을 열어 준다. 아내가 먹여 줘서다.'
		),
		d(GATE, ['West.', 'Do not ask us for a map. Ask the road.'], ['서쪽.', '지도는 묻지 마라. 길에 물어라.']),
		d(
			KITCHEN,
			['You are bigger than most who try this.', 'Eat when people offer. They will.'],
			['여기는 시도하는 자보다 네가 크다.', '주면 먹어라. 줄 거다.']
		),
		d(K, ['Harvest is a date.', 'I intend to keep it.'], ['가을걷이는 날짜요.', '지킬 생각이오.']),

		scene('The West Road', '서쪽 길'),
		p(
			'He walks. Hallakgungi’s road was hunger and beatings. Kangrim’s is different. He is large, and people like a large man who does not take more than a bowl.',
			'걷는다. 할락궁이의 길은 배고픔과 매였다. 강림의 길은 다르다. 그는 크고, 사람들은 그릇 이상 안 가져가는 큰 사내를 좋아한다.'
		),

		scene('The Western Empire', '서쪽 제국'),
		p(
			'First the Western Empire. Huaxia. Roads with mile-posts. Inns that already know how to feed a stranger who can move a cart when the axle sticks.',
			'먼저 서쪽 제국. 화하. 이정표 있는 길. 축이 막히면 수레를 밀어 줄 나그네를 먹일 줄 아는 객점.'
		),
		d(
			HOST,
			['Sit.', 'You look like you could lift the roof if we asked.', 'We will not ask.'],
			['앉게.', '부탁하면 지붕도 들 것 같네.', '부탁은 안 하겠네.']
		),
		d(K, ['A bowl is enough.', 'Thank you.'], ['그릇 하나면 되오.', '고맙소.']),
		p(
			'He leaves before dawn so nobody has to invent a reason to keep him. The empire is wide. He is polite. The road lets him through.',
			'새벽에 떠난다. 붙잡을 이유를 만들 필요 없게. 제국은 넓다. 그는 공손하다. 길이 그를 통과시킨다.'
		),

		scene('Air and Earth', '바람과 대지'),
		p(
			'Around the Land of Air and the Land of Earth — Tubo’s ice roof, Chunchuk’s long plains. He does not climb the roof. He does not cut across the plains. The advice said around, so he goes around, and the wind at the edge of the plateau is cold enough to remind him he is still alive.',
			'바람의 땅과 대지의 땅을 돈다. 토번의 얼음 지붕, 천축의 긴 들. 지붕은 안 오른다. 들은 가로지르지 않는다. 돌라고 했으니 돈다. 고원 가장자리의 바람은, 아직 살아 있다는 걸 상기시킬 만큼 차갑다.'
		),
		p(
			'A caravan shares salt. A monk shares a joke in a language Kangrim only half has. He laughs at the half he has. That is enough for a bed under a felt flap.',
			'대상이 소금을 나눈다. 승려가 강림이 반도 모르는 말로 농담을 한다. 아는 반쪽만 웃는다. 그걸로 펠트 천막 아래 잠자리가 생긴다.'
		),

		scene('Fire and Water', '불과 물'),
		p(
			'Through the Land of Fire, then the Land of Water. Pasa’s roads smell of oil and horse. Bulim’s coast smells of salt and something older than the inns.',
			'불의 땅을 지나고, 물의 땅을 지난다. 파사의 길은 기름과 말 냄새. 불림의 바닷가는 소금과, 객점보다 오래된 냄새.'
		),
		p(
			'In a fire-temple yard a boy asks him to hold a rope while men raise a beam. He holds it. They feed him. In a harbour a fisherman points west with a chin and does not ask his name. Kangrim does not offer one. Harvest is still a date on a post at home.',
			'불의 사당 마당에서 아이가 줄을 잡아 달라고 한다. 기둥이 올라가는 동안. 잡는다. 밥을 준다. 항구에서 어부가 턱으로 서쪽을 가리키고 이름은 묻지 않는다. 강림도 대지 않는다. 가을걷이는 아직 집 기둥의 날짜다.'
		),

		scene('The Threefold Path', '세 갈래 길'),
		p(
			'Then the living map quits being polite. The road splits three ways.',
			'그러다 산 지도가 공손하기를 그만둔다. 길이 셋으로 갈라진다.'
		),
		p(
			'Right, they say, is paradise. Left is hell. The middle is Seocheon — the Western Flower Field.',
			'오른쪽은 극락이라 한다. 왼쪽은 지옥. 가운데가 서천 — 서천꽃밭 가는 길.'
		),
		d(K, ['Middle.'], ['가운데.']),
		p(
			'He does not debate it. A man sent for a judge does not take the scenic route through heaven.',
			'따지지 않는다. 판관을 데리러 온 사내가 하늘 구경으로 돌아가지 않는다.'
		),

		scene('Mujangsung', '무장승'),
		p(
			'On the middle path: a spring, and an armed monk who has been waiting longer than any harvest calendar.',
			'가운데 길에 약수가 있다. 그리고 어떤 가을걷이 달력보다 오래 기다린 무장한 승려.'
		),
		d(
			MONK,
			['Drink.', 'Then walk.', 'Three thousand li. Do not count them out loud.'],
			['마셔라.', '그리고 걸어라.', '삼천 리. 소리 내어 세지 마라.']
		),
		d(K, ['Will the date keep?'], ['날짜는 지키겠소?']),
		d(MONK, ['That is not my spring.'], ['그건 내 약이 아니다.']),
		p(
			'Kangrim drinks. The water tastes like ordinary water that has decided to matter. He nods once, the way he nods at a closed case, and keeps walking.',
			'강림이 마신다. 물은, 중요해지기로 한 보통 물 맛이다. 닫힌 사건처럼 한 번 끄덕이고 또 걷는다.'
		),

		scene('Three Thousand Li', '삼천 리'),
		p(
			'Three thousand li is a sentence you say in one breath and a walk you do in many. He sleeps under wagons. He lifts what other men cannot. He learns the names of dogs that bark at smaller travellers and go quiet for him.',
			'삼천 리는 한 숨에 말하는 문장이고, 여러 날 걷는 길이다. 수레 밑에서 잔다. 남이 못 드는 것을 든다. 작은 길손에게 짖던 개들이 그에겐 조용해지는 이름을 배운다.'
		),
		p(
			'He does not suffer the way the gardener’s boy suffered. That is not virtue. That is size, and manners, and a wife’s two bowls buying him a road.',
			'정원사의 아이처럼 고생하지는 않는다. 미덕이 아니다. 덩치와 예절과, 아내의 그릇 둘이 길을 사 준 것이다.'
		),

		scene('The Last Pond', '마지막 못'),
		p(
			'At the end of the counted road there is a pond that does not belong to any empire. The gate-god’s west and the monk’s three thousand li both stop at its edge.',
			'센 길의 끝에, 어느 제국에도 속하지 않는 못이 있다. 문신의 서쪽과 승려의 삼천 리가 둘 다 그 가장자리에서 멈춘다.'
		),
		p(
			'He looks at the last pond a long time. Harvest is a date. This is not.',
			'마지막 못을 오래 본다. 가을걷이는 날짜가 있다. 이건 없다.'
		),
		p(
			'He shuts his eyes and jumps.',
			'눈을 감고 뛰어든다.'
		)
	];

	en.blocks.splice(roadAt, jumpAt - roadAt + 1, ...road);
	console.log('expanded Grim Reaper →', en.blocks.length, 'blocks');
});
