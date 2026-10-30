/** Hall returns between Bupmin wall tales + locked endings. */
import { editStory, entryOf } from './story-ops.mjs';

const Y = { kind: 'dialogue', person: 'yushin', chip: '#4a8fe0' };
const B = { kind: 'dialogue', person: 'munmu', chip: '#3fa9c9' };
const NEW = { kind: 'dialogue', speaker: 'A new Hwarang', gender: 'm', chip: '#6b7280' };

const p = (html, ko) => ({ kind: 'p', html, ko });
const dlg = (base, en, lines, extra = {}) => ({ ...base, en, lines, ...extra });

const bowlBlocks = [
	p(
		'The wells come up dry. The fields are dust. You can count the ribs on a dog in the lane.',
		'우물이 마른다. 밭은 먼지다. 골목 개 갈비가 보인다.'
	),
	p(
		'People sit with empty bowls at the storehouse door. They have been sitting since the last rain that wasn’t.',
		'창고 문 앞에 빈 그릇을 든 사람들이 앉아 있다. 비가 아니었던 마지막 비 때부터다.'
	),
	p(
		'Inside, two clerks at the counting board. Three keys. They have two.',
		'안에서는 서기 둘이 셈판 앞에 있다. 열쇠가 셋이다. 둘은 저들이 쥐고 있다.'
	),
	dlg(
		{ kind: 'dialogue', speaker: 'A clerk', gender: 'm' },
		['He has the third.', 'If he talks, we drink first.'],
		['셋째는 걔야.', '입 열면, 우리가 먼저 마셔.']
	),
	p(
		'Geomgun is in the door. He heard. He looks at the ledger as if the numbers had just arrived.',
		'검군이 문간에 있다. 들었다. 장부를 본다. 숫자가 방금 온 것처럼.'
	),
	dlg(
		{ kind: 'dialogue', speaker: 'A clerk', gender: 'm' },
		['You didn’t hear that.'],
		['못 들은 걸로 해.']
	),
	dlg({ kind: 'dialogue', person: 'geomgun' }, ['Hear what.'], ['뭘 말이오.']),
	p(
		'They fill two sleeves. They put a third sleeve in his hands. He holds it the way you hold a cup you did not ask for.',
		'소매 둘을 채운다. 세 번째를 그의 손에 쥐여 준다. 청하지 않은 잔을 받듯 든다.'
	),
	dlg(
		{ kind: 'dialogue', speaker: 'A clerk', gender: 'm' },
		['Just take it.', 'Who’s counting. The ledger’s already a lie.'],
		['그냥 퍼.', '누가 세어. 장부가 이미 거짓말이야.']
	),
	dlg({ kind: 'dialogue', person: 'geomgun' }, ['It’s the king’s grain.'], ['임금의 곡식이오.']),
	dlg(
		{ kind: 'dialogue', speaker: 'A clerk', gender: 'm' },
		['Then you’re already late.', 'We saved you a cup. For the one who talks.'],
		['그러면 이미 늦었어.', '잔은 남겨 뒀지. 입 열 놈 몫이야.']
	),
	p(
		'A second bowl. Dark. Not grain. It sits on the counting board like it belongs there.',
		'사발이 하나 더 있다. 어둡다. 곡식이 아니다. 셈판 위에, 원래 있던 것처럼 놓여 있다.'
	),
	p(
		'He counts the board again. He counts it wrong on purpose. Nobody is fooled. That was not the point.',
		'셈판을 다시 센다. 일부러 틀린다. 속는 사람은 없다. 그게 목적이 아니었다.'
	),
	p(
		'In the door, a hwarang who should not be in a storehouse at this hour. Geunrang. He has a horse at the pine. He has had it there since dusk.',
		'문간에, 이 시각에 창고에 있으면 안 되는 화랑이 있다. 근랑이다. 소나무에 말을 대 뒀다. 해 질 녘부터.'
	),
	dlg(
		{ kind: 'dialogue', speaker: 'Geunrang', gender: 'm' },
		['Report them.', 'Or run. I can have you at the river before they miss the key.'],
		['고발하든지.', '아니면 뛰어. 열쇠 찾기 전에 강까지 데려다 줄 수 있어.']
	),
	dlg({ kind: 'dialogue', person: 'geomgun' }, ['I can’t do either.'], ['둘 다 못 하오.']),
	dlg(
		{ kind: 'dialogue', speaker: 'Geunrang', gender: 'm' },
		['You can. You’re choosing not to.'],
		['할 수 있어. 안 하는 거야.']
	),
	p(
		'He empties the first sleeve back into the bin. Then the second. Grain runs over his wrists. He does not look at the clerks.',
		'먼저 소매 하나를 빈에 도로 비운다. 그다음 하나. 쌀이 손목을 넘어 흐른다. 서기들은 보지 않는다.'
	),
	dlg({ kind: 'dialogue', speaker: 'A clerk', gender: 'm' }, ['Then this.'], ['그러면 이거.']),
	p(
		'They put the dark cup in both his hands. Somebody has warmed it. That is a kindness, of a kind.',
		'어두운 잔을 두 손에 쥐여 준다. 누군가 데워 놨다. 그런 종류의 친절이다.'
	),
	p('The storehouse goes. The clerks go. There is only the cup.', '창고가 사라진다. 서기들이 사라진다. 잔만 남는다.'),
	p(
		'He sits. Cross-legged, the way a monk sits when the count is done. Both hands on the cup. Eyes open.',
		'앉는다. 책상다리. 셈을 끝낸 스님이 앉듯. 두 손이 잔 위에 있다. 눈은 떠 있다.'
	),
	p('He drinks. It tastes like metal, then like nothing.', '마신다. 쇠 맛이다. 그다음엔 아무 맛도 없다.'),
	dlg(
		{ kind: 'dialogue', speaker: 'Geunrang', gender: 'm' },
		['Geomgun—', 'Spit it. Spit it—'],
		['검군—', '뱉어. 뱉으라니까—']
	),
	p(
		'The bowl stays in his lap. He does not fall. The breath just stops being a problem. Geunrang is still talking.',
		'사발은 무릎 위에 있다. 쓰러지지 않는다. 숨이, 그냥, 문제가 아니게 된다. 근랑은 아직 말하고 있다.'
	)
];

const afterBowl = [
	p(
		'The lamp comes back. The storehouse is paint. A boy has his mouth open and has forgotten to close it.',
		'등불이 돌아온다. 창고는 그림이다. 한 아이가 입을 벌린 채, 다무는 걸 잊고 있다.'
	),
	dlg(NEW, ['He just… sat there.', 'And drank it.'], ['저 사람이 그냥… 앉아 갖고.', '마셨습니꺼.']),
	dlg(Y, ['Keep walking.'], ['계속 걸어라.']),
	p(
		'They walk on. The lamp swings at his side. Their shadows climb the wall ahead of them, larger than the boys, stepping over a painted bowl.',
		'다시 걷는다. 장군 곁에서 등불이 흔들린다. 그림자 예순이 앞질러 벽을 타고 오른다. 아이보다 큰 그림자가 그린 사발을 성큼성큼 넘는다.'
	),
	p(
		'He lifts the lamp to the second bay. A night yard comes out of the black. An old man, one hand on a boy’s head. No crown. No horse. Just a gate, and leave being asked for.',
		'장군이 둘째 칸에 등불을 들어 올린다. 어둠 속에서 밤 마당이 떠오른다. 늙은이, 아이 머리에 손 하나. 관도 없고 말도 없다. 문 하나, 그리고 떠남을 청하는 일.'
	)
];

const afterHand = [
	p('The gate is paint again. Yushin is already moving.', '문은 다시 그림이다. 유신은 이미 걷고 있다.'),
	dlg(NEW, ['Did that boy come back?'], ['그 아이는 돌아왔습니꺼.']),
	dlg(Y, ['Later.'], ['나중에.']),
	p(
		'They walk on. The lamp swings. Shadows step over a painted hand.',
		'다시 걷는다. 등불이 흔들린다. 그림자가 그린 손을 넘는다.'
	)
];

const afterTiger = [
	p(
		'The tiger is paint. Someone in the dark tries the laugh Alchun had, and cannot finish it.',
		'호랑이는 그림이다. 어둠 속에서 누군가 알천의 웃음을 흉내 내다가, 끝을 못 낸다.'
	),
	dlg(NEW, ['That was you in the path. Right.'], ['길에 선 거, 장군 맞제예.']),
	dlg(Y, ['I said keep walking.'], ['말했네. 걸어.']),
	p(
		'He lifts the lamp. Two young men come out of the black, running, arrows standing in them like reeds, and in the corner, painted small, a monk writing.',
		'등불을 들어 올린다. 어둠 속에서 청년 둘이 달려 나온다. 화살이 갈대처럼 꽂혀 있다. 귀퉁이엔 작게, 뭔가 쓰고 있는 스님 하나.'
	)
];

const afterArrows = [
	p('Nobody talks. The lamp makes a small sound when he walks.', '아무도 말을 안 한다. 걸을 때 등불이 작게 운다.'),
	dlg(B, ['Uncle—'], ['외숙—']),
	dlg(Y, ['Keep walking.'], ['계속 걸어라.']),
	p(
		'Bupmin looks at the arrows until the light leaves them.',
		'법민은 불빛이 떠날 때까지 화살을 본다.'
	)
];

const afterDeer = [
	p('A boy starts to laugh and bites it off.', '한 아이가 웃다가, 깨문다.'),
	p(
		'He lifts the lamp to the painting beside the deer. Still bright: a young man in magenta sits cross-legged at a campfire among forty Baekje raiders. All of them are laughing. Every sword is on the ground.',
		'사슴 옆 그림에 등불을 들어 올린다. 아직 선명하다. 자홍빛 옷의 젊은이가 백제 약탈꾼 마흔 틈에서 모닥불 앞에 책상다리로 앉아 있다. 다들 웃고 있다. 칼은 전부 땅바닥에 있다.'
	)
];

const afterWine = [
	p(
		'They have reached the end of the wall. Past the fifth bay the timber runs on, and the plaster is blank.',
		'벽 끝에 이른다. 다섯째 칸을 지나서도 나무는 이어지는데, 그 안의 회벽은 비어 있다.'
	)
];

const walkBack = [
	p(
		'He turns and walks them back the way they came. The lamp is lower now. The shadows go the other way, over the deer, over the arrows, over the tiger he would not look at.',
		'돌아서서 왔던 길을 되짚어 간다. 등불이 더 낮다. 그림자가 반대쪽으로 간다. 사슴을 지나, 화살을 지나, 보려 하지 않던 호랑이를 지나.'
	)
];

function afterFlashback(blocks, title, insert) {
	const i = blocks.findIndex((b) => b.kind === 'flashback' && b.title === title);
	if (i < 0) throw new Error(`no flashback ${title}`);
	blocks.splice(i + 1, 0, ...insert);
}

function replaceHtml(blocks, needle, next) {
	const i = blocks.findIndex((b) => b.html === needle || b.en?.join(' ') === needle);
	if (i < 0) throw new Error(`no block ${needle.slice(0, 40)}`);
	blocks.splice(i, 1, ...next);
}

function dropHtml(blocks, needle) {
	const i = blocks.findIndex((b) => b.html === needle);
	if (i < 0) throw new Error(`no drop ${needle.slice(0, 40)}`);
	blocks.splice(i, 1);
}

editStory((story) => {
	const e = entryOf(story, 'five-principles', 'Bupmin');
	if (!e) throw new Error('no Bupmin');
	const top = e.blocks;

	replaceHtml(
		top,
		'The first bay is a storehouse door and a bowl. A painted boy holds the bowl in both hands. Another painted boy stands in the door and does not come in.',
		[
			p(
				'He lifts the lamp to the first bay. Out of the black comes a storehouse door and a bowl. A painted boy holds the bowl in both hands. Another painted boy stands in the door and does not come in.',
				'장군이 첫 칸에 등불을 들어 올린다. 어둠 속에서 창고 문과 사발이 떠오른다. 그린 소년 하나가 사발을 두 손으로 들고 있다. 다른 그린 소년이 문간에 서서, 들어오지 않는다.'
			)
		]
	);

	const bowl = top.find((b) => b.kind === 'flashback' && b.title === 'the bowl');
	bowl.blocks = bowlBlocks;

	afterFlashback(top, 'the bowl', afterBowl);
	dropHtml(
		top,
		'The second bay is a night yard. An old man, one hand on a boy’s head. No crown. No horse. Just a gate, and leave being asked for.'
	);

	afterFlashback(top, 'the hand', afterHand);

	afterFlashback(top, 'the tiger', afterTiger);
	dropHtml(
		top,
		'Then two young men under a fallen horse, arrows standing in them like reeds, and in the corner, painted small, a monk writing.'
	);

	const arrows = top.find((b) => b.kind === 'flashback' && b.title === 'the arrows');
	const turn = arrows.blocks.findIndex((b) => b.html === 'They turn back into the wood. A man in yellow comes at Gwisan with a spear. Gwisan takes the shaft, the way you take a doorbar, and puts the point through the man’s throat. The next one he does not see. The spear comes in under the first arrow and stays there.');
	if (turn < 0) throw new Error('no turn-back');
	arrows.blocks.splice(
		turn,
		arrows.blocks.length - turn,
		p('They turn back into the yellow line.', '노란 줄로 다시 들어간다.'),
		p('They run. Not for a gap. For the line.', '달린다. 틈이 아니다. 줄이다.'),
		p(
			'The first arrows find Gwisan. He keeps the legs going. Chuhang takes two in the back and does not turn around for them.',
			'첫 화살이 귀산을 찾는다. 다리는 계속 간다. 추항은 등에 둘을 받고, 돌아보지 않는다.'
		),
		p(
			'A blade goes into Gwisan’s side and stays. He does not take it out. He puts his own into the man who put it there.',
			'칼이 귀산 옆구리로 들어가, 그대로 있다. 빼지 않는다. 넣은 놈에게 제 칼을 넣는다.'
		),
		p(
			'They are still running when the road comes up to meet them. The wall will keep them that way: two boys going forward, the arrows already in.',
			'아직 달리고 있을 때 길이 올라와 만난다. 벽은 둘을 그렇게 남겨 둘 것이다. 앞으로 가는 아이 둘. 화살은 이미 들어 있다.'
		)
	);

	afterFlashback(top, 'the arrows', afterArrows);

	const deer = top.find((b) => b.kind === 'flashback' && b.title === 'the deer');
	deer.blocks.push(
		p(
			'He turns around. The deer follows. He carries the antlers across both arms, the way another boy would carry a head. They walk the road they came by. Alchun a step behind. The deer walks.',
			'돌아선다. 사슴이 따른다. 뿔을 두 팔에 가로로 든다. 다른 아이가 머리를 들듯. 왔던 길을 걷는다. 알천이 한 걸음 뒤. 사슴이 걷는다.'
		)
	);

	afterFlashback(top, 'the deer', afterDeer);
	dropHtml(
		top,
		'Beside the deer, still bright: a young man in magenta sits cross-legged at a campfire among forty Baekje raiders. All of them are laughing. Every sword is on the ground.'
	);

	afterFlashback(top, 'the wine', afterWine);

	const club = top.findIndex((b) => b.html === 'For the rest of the walk two boys carry Bupmin’s club box without being asked. It lasts until breakfast.');
	if (club < 0) throw new Error('no club box');
	top.splice(club, 0, ...walkBack);

	console.log('bupmin hall walk patched');
});
