// Three acts: Jukji / Premier / Chunmyung.
// Revenue office grows with each reform. Family at the stream house.
import { openStory, p, insertAfter, insertBefore } from './story-edit.mjs';

const { entry, say, save } = openStory();
const sec = entry('Royal Secretariat');

const premier = (lines, en) => ({ ...say('jukji', lines, en), look: 'premier' });
const bupmin = (lines, en) => ({ ...say('munmu', lines, en), look: 'hwarang' });

function relabel(from, to, ko) {
	const b = sec.blocks.find((x) => x.kind === 'section' && x.label === from);
	if (!b) throw new Error(`missing section ${from}`);
	b.label = to;
	b.ko = ko;
}

function dropSection(label) {
	const i = sec.blocks.findIndex((x) => x.kind === 'section' && x.label === label);
	if (i < 0) throw new Error(`missing section ${label}`);
	sec.blocks.splice(i, 1);
}

relabel('Dosalseong', 'Jukji', '죽지');
dropSection('The Name');
dropSection('The Plan');

if (!sec.blocks.some((b) => b.kind === 'section' && b.label === 'Premier')) {
	insertBefore(sec, 'Surabol · 650', [{ kind: 'section', label: 'Premier', ko: '중시' }]);
}

dropSection('The Secretariat');
dropSection('The Answer');
dropSection('The Riders');
dropSection('The Stream');

if (!sec.blocks.some((b) => b.kind === 'section' && b.label === 'Chunmyung')) {
	insertBefore(sec, 'The House by the Stream · that night', [
		{ kind: 'section', label: 'Chunmyung', ko: '천명' }
	]);
}

if (!JSON.stringify(sec.blocks).includes('They carry the table in themselves')) {
	insertAfter(sec, 'Nobody has ever asked them before.', [
		{ kind: 'scene', label: 'The Rice Room', ko: '쌀 방' },
		p(
			'The Revenue Office is a room at the back of the palace, by the latrines, with one paper window and a floor that has been rice for so long it still smells of it. No shelves. Silla does not keep paper on a wall. It keeps paper in a chest, and the chest on the floor, and a man on a mat in front of it.',
			'품주는 궁 뒤편, 뒷간 옆 방이다. 창호 하나. 너무 오래 쌀을 두어서 아직도 쌀 냄새 나는 바닥. 선반은 없다. 신라는 종이를 벽에 두지 않는다. 궤에 넣고, 궤는 바닥에 두고, 그 앞에 자리 깔고 앉는다.'
		),
		p(
			'They carry the table in themselves. A low writing table, knee-high, the kind a clerk kneels at. Jukji has the front. Chunchu has the back, and is already talking.',
			'상을 직접 들고 들어온다. 무릎 높이 서안. 서리가 꿇고 앉는 상. 앞을 죽지가 든다. 뒤를 춘추가 들고, 벌써 말을 시작한다.'
		),
		say(
			'chunchu',
			['저쪽. 창호 밑이 아니라. 등잔 닿는 데.', '벽에 기대지 말게. 벽은 젖어 있어.'],
			['There. Not under the window. Where the lamp reaches.', 'Don’t put it against the wall. The wall sweats.']
		),
		premier(
			['벽이 젖어 있습니다, 나리.', '궤는 문 옆입니다. 장부는 궤에 넣습니다. 선반은 안 됩니다.'],
			['The wall is wet, my lord.', 'The chest by the door. Books go in the chest. No shelves.']
		)
	]);
}

if (!JSON.stringify(sec.blocks).includes('A second lamp, a second mat')) {
	insertAfter(sec, 'Adding up is the Revenue Office’s job.', [
		p(
			'A second lamp, a second mat, a peg driven into the post for the courier’s bridle. Jukji measures the floor with his own foot and pretends he is not pleased. The chest by the door will not shut. They leave it open. That is the renovation.',
			'등잔이 하나 늘고, 자리가 하나 늘고, 기둥에 파발 고삐 걸 말뚝을 박는다. 죽지가 제 발로 바닥을 재며, 내심 좋아하지 않는 척한다. 문 옆 궤는 닫히지 않는다. 그냥 열어 둔다. 그게 공사다.'
		)
	]);
}

if (!JSON.stringify(sec.blocks).includes('They carry the tables down the corridor themselves')) {
	insertAfter(sec, 'He practices the sentence the way other men practice a sword form.', [
		p(
			'They carry the tables down the corridor themselves. Three low tables. Two chests. A folding screen the queen’s women were throwing out, plain hemp, no peonies. Clerks follow with the mats rolled under their arms, like men moving house, which is what this is.',
			'상을 직접 복도로 들고 간다. 낮은 상 셋. 궤 둘. 여왕 처소에서 버리려던 병풍, 모시뿐, 모란은 없다. 서리들이 자리를 겨드랑이에 말고 따라온다. 이사하는 사람들처럼. 이사가 맞다.'
		),
		premier(
			['곁채가 더 넓습니다. 일하기엔.', '삼촌들이 변칙이라 부를 겁니다.'],
			['The side hall is wider. For the work.', 'The uncles will call it irregular.']
		),
		say(
			'chunchu',
			['변칙이 넓으면, 그게 방이지.', '병풍은 저쪽. 뒷간 냄새 가리게.'],
			['If irregular is wider, that’s a room.', 'The screen there. It hides the latrines.']
		)
	]);
}

if (!JSON.stringify(sec.blocks).includes('They hang the board themselves')) {
	insertAfter(sec, 'Jukji had it painted himself.', [
		p(
			'They hang the board themselves. A plain wooden plaque, no gold, the kind a temple hangs over a kitchen. Jukji stands on a chest. Chunchu holds the cord. Neither of them looks at the letters until the last knot is tied.',
			'현판을 직접 단다. 금 없는 나무판. 절에서 부엌 위에 거는 것 같은. 죽지가 궤 위에 선다. 춘추가 끈을 잡는다. 마지막 매듭이 묶일 때까지 둘 다 글씨를 보지 않는다.'
		),
		say('chunchu', ['너무 높지 않게.', '읽는 사람이 고개를 숙이게.'], ['Not too high.', 'Make them bow to read it.']),
		premier(['예.', '…이제 방이 세 칸입니다.'], ['Yes.', '…The room is three bays now.'])
	]);
}

if (!JSON.stringify(sec.blocks).includes('Two rooms become one')) {
	insertAfter(sec, 'He decides not to ask.', [
		p(
			'They take the partition out of the side hall. Two rooms become one. The chests go along the new wall, and the courier pegs get a whole post of their own. Jukji walks the length of it once, counting, and does not smile.',
			'곁채의 칸막이를 뜯는다. 두 방이 하나가 된다. 궤는 새 벽을 따라 놓고, 파발 말뚝은 기둥 하나를 통째로 쓴다. 죽지가 한 번 걸어가며 세어 보고, 웃지 않는다.'
		)
	]);
}

if (!JSON.stringify(sec.blocks).includes('The whole house is in the room')) {
	insertAfter(sec, 'He has come straight from the side hall with ink on his fingers, and he hasn’t noticed.', [
		p(
			'The whole house is in the room. The queen stands by the window without her tablet. Munhee wrings a cloth into a basin she brought from home. Bupmin fills the door until his grandmother looks at him, and then he comes in. Yushin has not sat down. He will not sit down.',
			'온 집안이 그 방에 있다. 여왕은 홀 없이 창가에 선다. 문희는 집에서 가져온 대야에 수건을 짠다. 법민은 할머니가 볼 때까지 문간에 서 있다가 들어온다. 유신은 앉지 않았다. 앉지 않을 것이다.'
		),
		say('jinduk', ['왔어.', '홀은 두고 왔다.'], ['I came.', 'I left the tablet.']),
		say('chunmyung', ['오면 안 되지.', '온 동네가 떠들어.'], ['You shouldn’t have.', 'The street will talk.']),
		say('jinduk', ['떠들라지.'], ['Let it.']),
		say('munhee', ['물 미지근해요. 그렇게 보지 마세요.'], ['The water’s warm. Don’t look at me like that.']),
		say('chunmyung', ['안 봤다.'], ['I wasn’t.']),
		bupmin(['할아버지.'], ['Grandfather.']),
		say(
			'yongsu',
			['이리 와. 문간에 서 있기엔 키가 너무 크구나.'],
			['Come here. You’re too tall to lurk in the door.']
		),
		say('yushin', ['나는 밖에—'], ['I’ll wait out—']),
		say('chunchu', ['있어. 어머니가 곧 부를 테니.'], ['Stay. She’ll send for you anyway.'])
	]);
}

if (!JSON.stringify(sec.blocks).includes('Sleep. We’ll keep the door.')) {
	insertBefore(sec, 'Near dawn she reaches across the blanket without looking', [
		p(
			'Late. The queen sits on the mat. Munhee folds the cloth smaller than it needs to be. Bupmin has come in from the door. Yushin is still standing.',
			'밤이 깊다. 여왕은 자리에 앉는다. 문희는 수건을 필요 이상으로 작게 접는다. 법민은 문간에서 들어와 있다. 유신은 아직 서 있다.'
		),
		say('jinduk', ['자라.', '문은 우리가 볼게.'], ['Sleep.', 'We’ll keep the door.']),
		say('chunmyung', ['나라는 네가 봐라.', '문은 놔둬.'], ['You keep a country.', 'Leave the door.']),
		say('munhee', ['어머니.'], ['Mother.']),
		say('chunmyung', ['그만. 구겨지잖아.'], ['Don’t. You’ll wrinkle it.']),
		bupmin(['할머니.'], ['Grandmother.']),
		say('chunmyung', ['머리. 숙여.'], ['Your head. Down.']),
		say('yushin', ['마당에 있겠네.'], ['I’ll wait in the yard.']),
		say('yongsu', ['있어. 저 사람은 방이 꽉 찬 걸 좋아해.'], ['Stay. She likes a full room.'])
	]);
}

save();
console.log('three acts applied');
