/** Boat-spot, Changjori begging, younger Changjori watching Dalga and Dolgo. */
import { editStory, find, makeInserter } from './story-ops.mjs';

function d(person, lines, en, extra = {}) {
	return { kind: 'dialogue', person, lines, en, ...extra };
}
function p(html, ko) {
	return { kind: 'p', html, ko };
}
function scene(label, ko, weather = 'dusk') {
	return { kind: 'scene', label, ko, weather };
}
function speaker(name, gender, chip, lines, en) {
	return { kind: 'dialogue', speaker: name, gender, chip, lines, en };
}

function setTalk(entry, fragment, lines, en, extra = {}) {
	const hits = find(entry, fragment, (b) => b.kind === 'dialogue' && (!extra.who || b.person === extra.who));
	if (hits.length !== 1) throw new Error(`talk ${fragment}: ${hits.length}`);
	const { who, ...rest } = extra;
	Object.assign(hits[0].b, { lines, en, ...rest });
}

function setP(entry, fragment, html, ko) {
	const hits = find(entry, fragment, (b) => b.kind === 'p');
	if (hits.length !== 1) throw new Error(`p ${fragment}: ${hits.length}`);
	Object.assign(hits[0].b, { html, ko });
}

editStory((story) => {
	const mich = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'King Micheon');
	if (!mich) throw new Error('missing');
	const ins = makeInserter(mich);

	/* Dalga — why a successful general dies, and a younger Changjori watches */
	ins('장화에 먼지를 묻히고 성에서 들어온다.', [
		p(
			'The lower yard says his name before it remembers to bow to the chair. He took a fort last harvest. The country still talks like that is the whole government.',
			'아래 마당은 의자 앞에 절할 줄을 기억하기 전에 그의 이름을 먼저 부른다. 지난 가을, 성을 하나 땄다. 나라는 그게 정부 전부인 것처럼 말한다.'
		),
		speaker(
			'A man in the yard',
			'm',
			'#6b5344',
			['장군 왔다.', '야. 숙신 성, 그분이 막았잖아. 이름 먼저—'],
			['The general’s back.', 'Hey. That fort. He held it. Say the name first—']
		),
		speaker(
			'Another',
			'm',
			'#7a6550',
			['새 임금이 있어.', '알아. 그래도 이름이… 먼저 나와.'],
			['There’s a new king.', 'I know. The name still comes out first.']
		),
		d(
			'dalga',
			['그만.', '벽이야. 벽이 일을 한 거지.', '나 세워 두지 마.'],
			['Stop.', 'It’s a wall. The wall did the work.', 'Don’t stand me up.'],
			{ chip: '#7a2e2e' }
		),
		d(
			'changjori',
			['장군. 마당이… 이렇게 많습니다.', '장부에 적어야 합니까. 이 숫자.'],
			['General. The yard is… this full.', 'Do I write this down. This number.'],
			{ chip: '#8a7048' }
		),
		d(
			'dalga',
			['적지 마.', '적으면 남아.'],
			['Don’t write it.', 'If you write it, it stays.'],
			{ chip: '#7a2e2e' }
		)
	]);

	ins('…예.', [
		scene('A corridor · the next day', '복도 · 다음날', 'night'),
		p(
			'Changjori is in the doorway with the ledger he was told not to keep. Two men. A door that should have been a door. The general reaches for the staff and does not make it.',
			'창조리는 적지 말라는 장부를 든 채 문간에 있다. 사내 둘. 문이어야 할 문. 장군이 지팡이에 손을 뻗고, 닿지 못한다.'
		),
		d(
			'changjori',
			['장군— 문—', '잠깐, 문 열면—'],
			['General— the door—', 'Wait, if I open it—'],
			{ chip: '#8a7048' }
		),
		p(
			'He does not open it. The staff hits the floor. He picks it up afterwards and does not know why.',
			'열지 않는다. 지팡이가 바닥에 떨어진다. 나중에 집어 들고, 왜 집었는지 모른다.'
		)
	]);

	setP(
		mich,
		'인기 있던 숙부가 복도에서 죽는다.',
		'That spring the country mourns a general. The king drinks. Changjori stands in a corridor with a staff that is not his.',
		'그 봄, 나라는 장수를 애도한다. 임금은 마신다. 창조리는 자기 것이 아닌 지팡이를 들고 복도에 선다.'
	);

	setP(
		mich,
		'웃음을 받던 아우.',
		'Then the brother they smile at.',
		'그다음, 웃음을 받던 아우.'
	);

	/* Dolgo — why a popular official dies, Changjori waits outside */
	ins('웃음을 받던 아우.', [
		scene('The outer hall · a popular official', '바깥 전각 · 인기 있던 관리', 'dusk'),
		p(
			'People wait for the brother who still comes out. Grain. A judgment. A smile they do not give the closed door. He does not wear a crown. That is, as it turns out, the whole problem.',
			'아직 나오는 아우를 사람들이 기다린다. 곡식. 판결. 닫힌 문에는 안 주는 웃음. 왕관이 없다. 알고 보니 그게 전부였다.'
		),
		speaker(
			'A clerk',
			'm',
			'#6b5a48',
			['왕자님 나오시면 곡식 여쭤 봐.', '임금은… 오늘도 안 나오시잖아.'],
			['When the prince comes out, ask him about the grain.', 'The king isn’t coming out. Again.']
		),
		speaker(
			'A woman with a bundle',
			'f',
			'#8a7060',
			['그분이 들으시면 돼.', '웃어 주시잖아. 그걸로 돼.'],
			['If he hears it, that’s enough.', 'He smiles. That’s enough.']
		),
		d(
			'dolgo',
			['줄 서. 하나씩.', '웃지 마. 일만 하자.'],
			['Line up. One at a time.', 'Don’t smile. Just the work.'],
			{ chip: '#9a5348' }
		),
		d(
			'bongsang',
			['저거 봐.', '웃고 있잖아.', '왕관도 없는데.'],
			['Look at that.', 'They’re smiling.', 'He doesn’t even wear a crown.'],
			{ chip: '#6e2a2a' }
		),
		d(
			'changjori',
			['전하. 나오는 관리한테 웃는 겁니다.', '그게… 일이라서요.'],
			['Majesty. They’re smiling at the official who still comes out.', 'That’s… because he does the work.'],
			{ chip: '#8a7048' }
		),
		d(
			'bongsang',
			['그게 더 나빠.', '내일 잔. 집 전체가 마셔.'],
			['That’s worse.', 'Cup tomorrow. The whole house drinks.'],
			{ chip: '#6e2a2a' }
		)
	]);

	ins('집 전체가 마시라는 명을 받았다.', [
		scene('Outside the house · that night', '그 집 밖 · 그날 밤', 'night'),
		p(
			'Changjori is told to wait. He waits. Through the timber he hears a house sit down. He hears a cup. He does not go in.',
			'창조리는 기다리라는 말을 듣는다. 기다린다. 나무 너머로 한 집이 앉는 소리가 난다. 잔 소리가 난다. 들어가지 않는다.'
		),
		d(
			'changjori',
			['열면—', '아니. 열면 나도 마셔야지.', '…그냥 있어.'],
			['If I open it—', 'No. If I open it I drink too.', '…Stay.'],
			{ chip: '#8a7048' }
		)
	]);

	/* Boat spot — Sou sees him before anyone speaks */
	ins('비류 · 같은 주', [
		p(
			'From the bank the boat is a dark stroke. Two court men. One points. The man in the boat is tying a sack and does not look up, which is how they know.',
			'둑에서 보면 배는 검은 획이다. 궁 사내 둘. 하나가 가리킨다. 배 안의 사내는 가마니를 묶고 고개를 들지 않는다. 그래서 안다.'
		),
		d(
			'sou',
			['잠깐.', '손. 저 손.', '걸어 봐. 아니, 묶는 거. 그거.'],
			['Wait.', 'The hands. Those hands.', 'Walk— no. The tying. That.'],
			{ chip: '#6a7868' }
		),
		d(
			'jobul',
			['손 가진 사람 많소.', '소금 배는 더 많고.'],
			['A lot of men have hands.', 'Salt boats, even more.'],
			{ chip: '#7a7068' }
		),
		d(
			'sou',
			['개구리보다 작을 때 봤어요.', '걸음이 그 걸음이에요. 배 위에서도.'],
			['I saw him when he was smaller than a frog.', 'That’s the walk. Even on a boat.'],
			{ chip: '#6a7868' }
		)
	]);

	/* Iconic deny / beg — keep the Sagi line exact, then Changjori spends the two deaths */
	setTalk(
		mich,
		'일어나지 마시오.',
		['일어나지 마시오.', '그 비단, 버리는 거요. 진흙이오.', '나는 야인이오. 방금 말했소. 왕 아니오.'],
		['Don’t get up.', 'That silk’s ruined. That’s mud.', 'I’m a man of the fields. I just said. Not a king.'],
		{ who: 'micheon' }
	);
	setTalk(
		mich,
		'그래서 왔습니다.',
		[
			'그래서 왔습니다.',
			'복도에 있었어요. 숙부가 지팡이 짚으려다 못 짚었어요. 나는 문 안 열었어요.',
			'아버지도 봤어요. 잔. 집 밖에서 그냥 있었어요.',
			'이번엔 못 그래요. 돌아와 주시오. 왕으로.',
			'제발. 무릎 아프니까. 농담이 아니라.'
		],
		[
			'That’s why I came.',
			'I was in the corridor. Your uncle went for the staff and missed. I didn’t open the door.',
			'I watched your father too. The cup. I just stood outside.',
			'I can’t do that again. Come back. As king.',
			'Please. My knees hurt. That’s not a joke.'
		],
		{ who: 'changjori' }
	);
	ins('농담이 아니라.', [
		d(
			'micheon',
			['말했소.', '야인이오. 왕 아니오.', '국상은 진흙에 앉아서 뭘 보겠다는 거요.'],
			['I said.', 'A man of the fields. Not a king.', 'What are you looking at, from the mud.'],
			{ chip: '#C30000', look: 'exile' }
		),
		d(
			'changjori',
			['봤어요. 두 번이나.', '세 번째는 내가 무릎으로 보는 겁니다.', '소금 파시던 분한테 왕 해 달라 하는 거예요. 내가.', '일어나면 안 돼요. 일어나면 또 문 닫아요.'],
			['I looked. Twice.', 'The third time I’m looking from my knees.', 'I am asking a salt seller to be king. I am.', 'Don’t get up. If you get up I close the door again.'],
			{ chip: '#8a7048' }
		)
	]);

	/* the next block used to say the same funeral twice */
	setP(
		mich,
		'나라는 장수를 애도한다. 임금은 마신다. 첫해다.',
		'That is the first year. A popular general, a closed door, a man in a corridor who will remember the staff.',
		'첫해다. 인기 있던 장수, 닫힌 문, 지팡이를 기억할 복도의 사내.'
	);

	return { ok: true };
});
