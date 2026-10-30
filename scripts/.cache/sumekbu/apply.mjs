// Rewrite Jinhung around three battles, Queen Buyeo, and Suulbu;
// patch The Severing (Baekje view) and Muryuk (loyalty at the ditch).
import { editStory, entryOf } from '../story-ops.mjs';

const clone = (x) => JSON.parse(JSON.stringify(x));
const P = (html, ko) => ({ kind: 'p', html, ko });
const D = (person, en, ko, extra = {}) => ({
	kind: 'dialogue',
	person,
	lines: Array.isArray(ko) ? ko : [ko],
	en: Array.isArray(en) ? en : [en],
	...extra
});
const SP = (speaker, en, ko, extra = {}) => ({
	kind: 'dialogue',
	speaker,
	lines: Array.isArray(ko) ? ko : [ko],
	en: Array.isArray(en) ? en : [en],
	...extra
});
const S = (label, ko, extra = {}) => ({ kind: 'scene', label, ko, ...extra });
const STORY = (label, ko) => ({ kind: 'story', label, ko });
const CARD = (person, caption, ko, extra = {}) => ({ kind: 'card', person, caption, ko, ...extra });
const DIAG = (diagram, step, title, caption, ko) => ({ kind: 'diagram', diagram, step, title, caption, ko });
const BATTLE = (battle, phase) => ({ kind: 'battle', battle, phase });

editStory((story) => {
	const jh = entryOf(story, 'samhan', 'Jinhung, the Cloud');
	const sv = entryOf(story, 'five-principles', 'The Severing');
	const mu = entryOf(story, 'chunchu-era', 'Muryuk');
	if (!jh || !sv || !mu) throw new Error('missing entry');

	const O = (i) => {
		const b = jh.blocks[i];
		if (!b) throw new Error(`Jinhung[${i}] missing`);
		return clone(b);
	};
	const expect = (i, frag) => {
		const s = JSON.stringify(jh.blocks[i]);
		if (!s.includes(frag)) throw new Error(`Jinhung[${i}] drifted: expected ${frag}`);
	};
	expect(0, 'Cloud King');
	expect(8, 'Wherever he rides');
	expect(10, 'The First Yard');
	expect(24, 'Flower youths');
	expect(26, 'The Northern Ridge');
	expect(36, 'Near the end he shaves');
	expect(54, 'The rain fell on Baekje');

	jh.year = '540–576';
	jh.subtitle = '심맥부, <법운>';

	const b = [];

	// Crown.
	for (let i = 0; i <= 8; i++) b.push(O(i));

	b.push(
		P(
			'His name is Sumekbu. Of the Sukhuljong house, same as his brother. The court will call him Jinhung. He will answer to both, and to a third name at the end.',
			'그의 이름은 심맥부다. 숙흘종 집안의 심맥부. 아우와 같은 집이다. 조정은 그를 진흥이라 부를 것이다. 그는 둘 다에 대답한다. 끝에는 세 번째 이름에도.'
		)
	);

	// Brothers.
	b.push(STORY('The House', '집'));
	b.push(S('The Side Hall', '곁채'));
	b.push(
		P(
			'The crown still slides. The brother does not. Suulbu is a year younger and already talking like furniture.',
			'왕관은 아직 미끄러진다. 아우는 아니다. 수을부는 한 살 어리고, 이미 사람을 가구처럼 말한다.'
		)
	);
	b.push(CARD('sukhuljong', 'The brother who keeps the house. And, later, a great deal else.', '집을 보는 아우. 나중엔 집보다 많은 것을 본다.'));
	b.push(D('jinheung', ['Brother.'], ['아우.']));
	b.push(
		D('sukhuljong', ['You take the border.', 'I’ll keep the house.', 'Don’t look back.'], [
			'형은 바깥을 해.',
			'집은 내가 본다.',
			'돌아보지 마.'
		])
	);
	b.push(
		D('jinheung', ['I’m lucky.', 'To have a brother like you.'], ['다행이다.', '나한테 아우가 있어서.'])
	);
	b.push(
		P(
			'He means it. He will mean it for thirty years. The house his brother keeps gets very large. You will find out what that costs. Not in this episode.',
			'그는 진심으로 한다. 삼십 년 동안 진심으로 할 것이다. 아우가 보는 집은 아주 커진다. 그 값이 뭔지는 알게 된다. 이 회차에선 아니다.'
		)
	);

	// Gaya primer — first mention of the name.
	b.push(STORY('Gaya', '가야'));
	b.push(S('A Pile of Tribes', '나라 아닌 나라'));
	b.push(
		P(
			'There is a country that is not a country. It sits between the two bigger ones. People call it Gaya.',
			'나라 아닌 나라가 하나 있다. 더 큰 둘 사이에 끼어 있다. 사람들은 그걸 가야라 부른다.'
		)
	);
	b.push(
		P(
			'Not one throne. A pile of tribes who share iron and a name. Baekje and Silla have been arguing over whose pile it is since anyone can remember.',
			'왕좌는 하나가 아니다. 쇠와 이름만 나눠 가진 부족들의 무더기다. 백제와 신라는, 기억나는 한, 그 무더기가 누구 것인지 싸워 왔다.'
		)
	);
	b.push(
		DIAG(
			'gaya-league',
			'league',
			'Gaya · 가야',
			'Six courts, no single crown. The two bigger kingdoms have been shopping here for generations.',
			'여섯 조정, 왕관은 하나 없다. 더 큰 두 나라가 대를 이어 장을 보러 오는 곳.'
		)
	);
	b.push(
		P(
			'His father already ate the golden one. The rest of the pile is still sitting there. Waiting to be next, or pretending not to.',
			'아버지는 이미 금빛 하나를 먹었다. 나머지 무더기는 아직 앉아 있다. 다음이 되기를 기다리거나, 아닌 척하거나.'
		)
	);

	// Bald Mountain 551.
	b.push(STORY('Bald Mountain', '독성산성'));
	b.push(
		S('Bald Mountain', '독성산성', {
			jump: { year: 551, en: 'Eleven Years Later…', ko: '십일 년 뒤…' },
			year: 551
		})
	);
	b.push(
		P(
			'Eleven winters into the crown, the river is still someone else’s. Sung of Baekje sends a letter. Come take it with me.',
			'왕관을 쓴 지 십일 년, 강은 아직 남의 것이다. 백제의 성왕이 편지를 보낸다. 같이 찾으러 가자.'
		)
	);
	b.push(CARD('kingsung', 'Baekje’s king. He still believes in friends.', '백제의 임금. 아직은 벗을 믿는다.'));
	b.push(
		D('kingsung', ['Together, then.', 'If it isn’t Goguryeo, we have no fight.'], [
			'같이 갑시다.',
			'고구려만 아니면, 우리끼리 싸울 일은 없소.'
		])
	);
	b.push(D('jinheung', ['No fight.'], ['없겠지.']));
	b.push(
		P(
			'They take Bald Mountain. They take the river. Two banners on one bank. For an afternoon, Samhan has a rule again.',
			'독성산성을 뺀다. 강을 뺀다. 한 둑에 깃발 둘. 한나절 동안, 삼한에 규칙이 다시 생긴다.'
		)
	);
	b.push(
		P(
			'In the Silla line a tall cone helm does not cheer. He is used to watching other people’s banners go up.',
			'신라 줄에 높은 고깔 투구 하나가 환호하지 않는다. 남의 깃발이 올라가는 건, 그는 익숙하다.'
		)
	);
	b.push(
		D('kingsung', ['My daughter.', 'A sign. That we meant it.'], ['내 딸을 드리겠소.', '우정의 징표요. 진짜였다는.'])
	);
	b.push(D('jinheung', ['If it’s friendship…', 'All right.'], ['우정이면…', '됐소.']));

	// Queen Buyeo / the soft year.
	b.push(STORY('The Gift', '선물'));
	b.push(S('The Side Hall, again', '다시, 곁채'));
	b.push(
		P(
			'The gift is a girl. Then she is a wife. Then she is the only room he wants to be in.',
			'선물은 아이다. 그러다 아내가 된다. 그러다 그가 있고 싶은 유일한 방이 된다.'
		)
	);
	b.push(
		CARD('sobi', 'King Sung’s daughter. The gift that took.', '성왕의 딸. 먹혀 버린 선물.')
	);
	b.push(D('sobi', ['The river is outside.', 'I am in here.'], ['강은 창밖에 있어요.', '전 여기 있어요.']));
	b.push(D('jinheung', ['I know.'], ['알아.']));
	b.push(
		P(
			'He spends a year not looking at maps. Sung counted on that. That is the whole of the gift, from the father’s side.',
			'그는 일 년 동안 지도를 보지 않는다. 성왕은 그걸 셈에 넣었다. 아버지 쪽에서는, 선물의 전부가 그것이다.'
		)
	);
	b.push(D('sobi', ['You’re not going out again.'], ['오늘도 안 나가세요?']));
	b.push(D('jinheung', ['If I go out, you’re gone.'], ['나가면 네가 없어.']));
	b.push(D('sobi', ['You can look at me.', 'I am not the river.'], ['나를 봐도 돼요.', '강이 아니니까.']));
	b.push(
		P(
			'His brother keeps the house. And the river. Flags go up on the Han while the king is in her rooms. The king does not see them. He isn’t looking.',
			'아우는 집을 본다. 그리고 강을. 왕이 그 방에 있는 동안 한강에 깃발이 올라간다. 왕은 못 본다. 보고 있지 않으니까.'
		)
	);

	// Gwansan 554 — Baekje struck first, tearful order.
	b.push(STORY('Gwansan', '관산성'));
	b.push(
		S('The News', '소식', {
			jump: { year: 554, en: 'Three Years Later…', ko: '삼 년 뒤…' },
			year: 554
		})
	);
	b.push(
		P(
			'Then Baekje marches. First. On the fortress that opens Silla’s throat.',
			'그러다 백제가 진군한다. 먼저. 신라의 목을 여는 성으로.'
		)
	);
	b.push(
		P(
			'He reads the gift again. A daughter, to keep him in a room, while her father gathered horse.',
			'그는 선물을 다시 읽는다. 딸을 줘서 방에 묶어 두고, 그 사이 아버지는 군마를 모았다.'
		)
	);
	b.push(D('jinheung', ['He tricked me.'], ['속였구나.']));
	b.push(
		D('sukhuljong', ['He won.', 'You were in a room.', 'Give the order.'], [
			'속인 게 아니라 이긴 거지.',
			'형은 방에 있었고.',
			'명령만 내리십시오.'
		])
	);
	b.push(
		P(
			'He gives it. He does not give it dry-eyed. You have seen this night already, if you have been to Sabi. This is the other side of it.',
			'그는 명령을 내린다. 눈은 안 말리고. 사비에 가 본 사람은 이 밤을 이미 봤다. 이건 그 밤의 반대쪽이다.'
		)
	);
	b.push(S('The Ditch', '도랑'));
	b.push(BATTLE('gwansan-554', 'night'));
	b.push(
		P(
			'A slave asks for the head. A general in a cone helm says the name. The king on the ridge says yes, and his mouth is wet.',
			'종이 목을 달라 한다. 고깔 투구의 장수가 그 이름을 부른다. 능선 위 임금이 예, 하고, 입은 젖어 있다.'
		)
	);
	b.push(
		D('jinheung', ['Do it.', '…Do it.'], ['해.', '…해.'], { look: 'king' })
	);
	b.push(
		D('muryuk', ['Dodo.'], ['도도.'], { look: 'sinju' })
	);
	b.push(
		P(
			'He has just ordered a friend killed. A father-in-law. The man who gave him the only year he liked. He does not watch it dry. He rides home to a side hall that still smells like her lamp.',
			'벗을 죽이라 한 것이다. 장인이다. 그가 좋아한 유일한 해를 준 사람이다. 그는 마를 때까지 보지 않는다. 아직 그녀의 등잔 냄새 나는 곁채로 말을 돌린다.'
		)
	);
	b.push(S('The Lamp', '등잔'));
	b.push(D('sobi', ['Father.'], ['아버지가요.']));
	b.push(D('jinheung', ['I…', 'I told them to.'], ['내가…', '내가 시켰어.']));
	b.push(
		P(
			'She does not leave. There is nowhere left that is not his, or her father’s.',
			'그녀는 떠나지 않는다. 이제 그의 것도, 아버지 것도 아닌 곳은 없다.'
		)
	);

	// Hwarang — existing first yard, now after the ditch.
	b.push(
		P(
			'He does not trust a friend again. He fills a yard instead.',
			'그는 다시는 벗을 믿지 않는다. 그 대신 마당을 채운다.'
		)
	);
	const yard = O(10);
	yard.jump = { year: 560, en: 'Six Years Later…', ko: '육 년 뒤…' };
	yard.year = 560;
	b.push(yard);
	for (let i = 11; i <= 25; i++) b.push(O(i));

	// Great Gaya 562 — Sadaham named, cone unnamed.
	b.push(STORY('Great Gaya', '대가야'));
	b.push(
		S('The Last of the Pile', '무더기의 마지막', {
			jump: { year: 562, en: 'Two Years Later…', ko: '이 년 뒤…' },
			year: 562
		})
	);
	b.push(
		P(
			'The pile still has one court calling itself a kingdom. He sends the boy from the yard. The one who did not offer a hand.',
			'무더기엔 아직 나라라고 자처하는 조정이 하나 남았다. 그는 마당의 아이를 보낸다. 손을 내밀지 않던 아이.'
		)
	);
	b.push(BATTLE('daegaya-562', 'gate'));
	b.push(
		D('sadaham', ['I’ll go.', 'You can keep the older ones at home.'], ['내가 갈게.', '형들은 집에 두든가.'])
	);
	b.push(
		P(
			'Great Gaya sits on its ridge behind a timber gate. The boy is fifteen. He takes it in a rain. Then he cuts the ropes on the captives, because he felt like it.',
			'대가야는 나무 성문 뒤 능선에 앉아 있다. 아이는 열다섯이다. 비 속에서 성을 뺀다. 그리고 포로 묶은 줄을 자른다. 그러고 싶어서.'
		)
	);
	b.push(
		P(
			'At the edge of the square a general in a cone helm watches, and does not stop him. The king on the far ridge does not stop him either. Gaya, as a name, is over.',
			'광장 가장자리에서 고깔 투구의 장수가 보고, 말리지 않는다. 먼 능선의 임금도 말리지 않는다. 가야라는 이름은, 여기까지다.'
		)
	);

	// Stones, monk, fence — existing, Buyeo takes the robe with him.
	const ridge = O(26);
	ridge.jump = { year: 568, en: 'Six Years Later…', ko: '육 년 뒤…' };
	ridge.year = 568;
	b.push(ridge);
	for (let i = 27; i <= 35; i++) b.push(O(i));

	const shave = O(36);
	shave.html =
		'Near the end he shaves his head. The king of the four mountain stones puts on a monk’s robe and takes a new name: Dharma Cloud. Queen Buyeo goes into a nunnery beside him. The court keeps calling him Majesty. He keeps answering to the other thing.';
	shave.ko =
		'말년에 그는 머리를 깎는다. 네 산에 비석을 세운 왕이 승복을 입고 새 이름을 받는다. 법운, 법의 구름. 소비 부여씨가 그 곁 절로 들어간다. 조정은 계속 전하라 부른다. 그는 계속 다른 이름에 대답한다.';
	b.push(shave);
	for (let i = 37; i <= 53; i++) b.push(O(i));
	b.push(O(54));

	jh.blocks = b;

	// ————— The Severing: Baekje view —————
	const svText = (frag) => {
		const i = sv.blocks.findIndex((x) => JSON.stringify(x).includes(frag));
		if (i < 0) throw new Error(`Severing missing: ${frag}`);
		return i;
	};

	const iRiver = svText('Two kings take a river back together');
	sv.blocks[iRiver] = P(
		'Two kings take a river back together: Sung of Baekje and the Cloud King of Silla. Sung gives his daughter. Friendship, he calls it. Then Silla flags go up on the Han while the boy is in her rooms.',
		'두 임금이 함께 강을 되찾는다. 백제의 성왕과 신라의 구름왕. 성왕이 딸을 준다. 우정이라고 한다. 그러다 그 아이가 방에 있는 동안, 한강에 신라 깃발이 올라간다.'
	);

	const iCut = svText('King Sung feels the cut in the marrow');
	sv.blocks[iCut] = P(
		'King Sung feels the cut in the marrow. He has watched Gaya go this way. First the father ate the golden one. Then the son shopped the rest. He will not wait to be next. He calls in everyone who still owes him — the last Gaya houses, a boatload from the islands — and he marches first, on the fortress that opens Silla’s throat.',
		'성왕은 그 칼날을 골수로 느낀다. 가야가 이렇게 가는 걸 봤다. 아버지가 금빛 하나를 먹고, 아들이 나머지를 장 보러 다닌다. 다음은 기다리지 않겠다. 아직 빚진 이들을 모두 부른다. 가야의 남은 집안들, 섬에서 건너온 군사들. 그리고 먼저 진군한다. 신라의 목을 여는 성으로.'
	);

	const iGrand = svText('It starts with a river, and a friend');
	if (sv.blocks[iGrand].en) {
		sv.blocks[iGrand].en = [
			'Any grandmother? Hmph. Sit, then. Eat a chestnut. You’re mighty thin for marching.',
			'It starts with a river, and a friend. And a daughter. They always start with a friend.'
		];
		sv.blocks[iGrand].lines = [
			'아무 할미나? 흥. 앉어 봐. 밤 하나 먹구. 진군허기엔 너무 말랐어.',
			'강에서 시작혀. 그리구 친구. 그리구 딸. 이런 얘긴 늘 친구루 시작허지.'
		];
	}

	// Unname Muryuk on stills; pin the sinju look on his lines.
	for (const im of sv.images ?? []) {
		if (im.alt) im.alt = im.alt.replace(/\bKim Muryuk\b/g, 'A Silla general').replace(/\bMuryuk\b/g, 'a Silla general');
		if (im.at === 'A general of Silla' && im.alt) {
			im.alt = im.alt.replace(/a Silla general’s helm/i, 'a tall cone helm').replace(/Muryuk’s helm/g, 'a tall cone helm');
		}
	}
	for (const blk of sv.blocks) {
		if (blk.person === 'muryuk') blk.look = 'sinju';
	}

	// Humiliation beat: keep the slave, lean on the expansionist king.
	const iSlaveCut = svText('You. A slave.');
	sv.blocks[iSlaveCut] = D(
		'jinheung',
		[
			'You. A slave.',
			'He is a lord with a name.',
			'A slave does the cutting. So later mouths cannot forget it.'
		],
		['너, 종이제.', '저 사람은 이름 있는 임군이고.', '종이 베는 기다. 뒷사람이 입에서 못 잊게.']
	);

	const iAfterHead = svText('The ditch takes the head');
	sv.blocks[iAfterHead] = P(
		'The ditch takes the head. <b>Dodo</b> does the work the rank will not put on a general’s hands. A king of Baekje dies on a stool, at the hand of a slave, on a road that was not there at dusk. The record almost forgets the slave. Sabi does not forget the stool. That is the start of a long walk under someone else’s cloud.',
		'도랑이 목을 가져간다. <b>도도</b>가, 골품이 장수의 손에 올리지 않을 일을 한다. 백제의 임금이, 해 질 녘엔 없던 길에서, 종의 손에, 걸상에 앉아 죽는다. 기록은 노비를 거의 잊는다. 사비는 걸상을 잊지 않는다. 남의 구름 아래 긴 걸음이, 여기서 시작한다.'
	);

	// ————— Muryuk: Silla tonight —————
	const muI = (frag) => {
		const i = mu.blocks.findIndex((x) => JSON.stringify(x).includes(frag));
		if (i < 0) throw new Error(`Muryuk missing: ${frag}`);
		return i;
	};

	const iRide = muI('Muryuk rides the cut with Silla’s commission');
	mu.blocks[iRide] = P(
		'Muryuk rides the cut with Silla’s commission folded inside his helm. Military governor of Sinju. The title fits the way the cone never will, which is to say it pinches. Below him, on the west road, fifty Baekje horse ride into the Cloud King’s arithmetic.',
		'무력은 신라의 임명장을 투구 속에 접어 넣고 패인 길로 탄다. 신주 군주. 관직은 투구처럼 맞지 않는다. 꽉 낀다는 뜻이다. 아래 서쪽 길로 백제 기병 쉰이 구름왕의 셈 속으로 들어간다.'
	);

	const iFirst = muI('He is first down into the cut');
	mu.blocks[iFirst] = P(
		'He is first down into the cut, because the cone is the tallest thing on the ridge and hiding it is a habit he has not learned. The fallen king looks up and sees Gaya before he sees Silla. Muryuk has spent twenty-two years waiting to correct that.',
		'그는 맨 먼저 패인 길로 내려간다. 뿔투구가 능선에서 제일 크기 때문이다. 숨기는 버릇은 아직 못 배웠다. 쓰러진 임금이 올려다보고, 신라보다 먼저 가야를 본다. 무력은 그걸 고치려고 스물두 해를 기다렸다.'
	);

	const iName = muI('신주 군주 무력이다');
	mu.blocks[iName] = D('muryuk', ['Military governor of Sinju. Kim Muryuk.', 'Sit.'], [
		'신주 군주 김무력이오.',
		'앉으시오.'
	]);

	const iDodo = muI('They sit the king on a camp stool');
	mu.blocks[iDodo] = P(
		'They sit the king on a camp stool. A Silla slave asks for the head, and the king refuses the slave’s hand, and Muryuk says the slave’s name once, the way a door closes. Dodo. He will remember the name longer than the annals do.',
		'임금을 야전의자에 앉힌다. 신라 노비가 목을 달라 하고, 임금은 노비의 손을 거부하고, 무력은 노비의 이름을 한 번 부른다. 문 닫히듯. 도도. 연대기보다 오래 기억할 것이다.'
	);

	const iGayaTonight = muI('The king unfastens his own knife');
	mu.blocks[iGayaTonight] = P(
		'The king unfastens his own knife. Muryuk does not look away. Looking away is a habit of men who still think they are from somewhere else. He is Silla tonight. He is proving it on a Baekje neck, in a helm that will not admit it. That is the whole of the loyalty. It fits the way the cone never will.',
		'임금이 제 칼을 푼다. 무력은 눈을 돌리지 않는다. 눈 돌리기는 아직 다른 데서 왔다고 생각하는 놈들의 버릇이다. 오늘 밤 그는 신라다. 백제 목덜미 위에서 그걸 증명한다. 인정하지 않는 투구를 쓴 채로. 충성이란 게 그것이다. 투구처럼, 끝내 맞지는 않는다.'
	);
});

console.log('sumekbu apply: Jinhung rewritten, Severing + Muryuk patched');
