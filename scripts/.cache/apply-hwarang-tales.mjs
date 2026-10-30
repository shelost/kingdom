import { editStory, lists, find } from './story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const dlg = (who, en, lines) => {
	const b = { kind: 'dialogue', en, lines };
	if (who.startsWith('@')) b.person = who.slice(1);
	else {
		b.speaker = who;
		b.gender = 'm';
	}
	return b;
};
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const place = (id) => ({ kind: 'place', place: id });

function flashOf(entry, title) {
	for (const list of lists(entry)) {
		const b = list.find((x) => x.kind === 'flashback' && x.title === title);
		if (b) return b;
	}
	return null;
}

function entryByTitle(story, title) {
	for (const c of story) {
		const e = (c.entries ?? []).find((x) => x.title === title);
		if (e) return e;
	}
	throw new Error('missing ' + title);
}

editStory((story) => {
	const bupmin = entryByTitle(story, 'Bupmin');

	for (const list of lists(bupmin)) {
		for (const b of list) {
			if (b.html) b.html = b.html.replaceAll('A small Disciples', 'A small Disciple').replaceAll('small disciples', 'small disciple');
			if (b.speaker === 'A small Disciples') b.speaker = 'A small Disciple';
			if (Array.isArray(b.en)) b.en = b.en.map((s) => s.replaceAll('A small Disciples', 'A small Disciple'));
		}
	}

	const yushinFourth = find(bupmin, 'Fourth. Never retreat.');
	if (yushinFourth.length !== 1) throw new Error('yushin fourth ' + yushinFourth.length);
	Object.assign(yushinFourth[0].b, {
		en: [
			'Fourth. Never retreat.',
			'Gwisan. Chuhang.',
			'They asked a monk for a rule a layman could keep. Then they thought they had won.'
		],
		lines: [
			'넷째다. 임전무퇴.',
			'귀산. 추항.',
			'둘이 스님을 찾아가 속인이 지킬 만한 계율을 청했다. 그다음엔, 이긴 줄 알았지.'
		]
	});

	const bowl = flashOf(bupmin, 'the bowl');
	if (!bowl) throw new Error('no bowl');
	bowl.blocks = [
		p(
			'A famine year. The storehouse sits at the end of a lane of empty bowls. You can smell the rice through the door, and that is the problem.',
			'흉년이다. 창고는 빈 그릇이 늘어선 골목 끝에 있다. 문틈으로 쌀 냄새가 난다. 그게 탈이다.'
		),
		p(
			'Two clerks have already filled their sleeves. Geomgun is the third key. He has not filled anything.',
			'서기 둘은 이미 소매를 채웠다. 검군은 열쇠를 가진 세 번째다. 아직 아무것도 안 채웠다.'
		),
		dlg('A clerk', ['Just take it.', 'Who’s counting. The ledger’s already a lie.'], ['그냥 퍼.', '누가 세어. 장부가 이미 거짓말이야.']),
		dlg('@geomgun', ['It’s the king’s grain.'], ['임금의 곡식이오.']),
		dlg(
			'A clerk',
			['Then you’re already late.', 'We saved you a cup. For the one who talks.'],
			['그러면 이미 늦었어.', '잔은 남겨 뒀지. 입 열 놈 몫이야.']
		),
		p('A second bowl. Dark. Not grain. It sits on the counting board like it belongs there.', '사발이 하나 더 있다. 어둡다. 곡식이 아니다. 셈판 위에, 원래 있던 것처럼 놓여 있다.'),
		p(
			'In the door, a hwarang who should not be in a storehouse at this hour. Geunrang. He has a horse at the pine. He has had it there since dusk.',
			'문간에, 이 시각에 창고에 있으면 안 되는 화랑이 있다. 근랑이다. 소나무에 말을 대 뒀다. 해 질 녘부터.'
		),
		dlg('Geunrang', ['Report them.', 'Or run. I can have you at the river before they miss the key.'], [
			'고발하든지.',
			'아니면 뛰어. 열쇠 찾기 전에 강까지 데려다 줄 수 있어.'
		]),
		dlg('@geomgun', ['I can’t do either.'], ['둘 다 못 하오.']),
		dlg('Geunrang', ['You can. You’re choosing not to.'], ['할 수 있어. 안 하는 거야.']),
		p(
			'He empties the first sleeve back into the bin. Then the second. Grain runs over his wrists. He does not look at the clerks.',
			'먼저 소매 하나를 빈에 도로 비운다. 그다음 하나. 쌀이 손목을 넘어 흐른다. 서기들은 보지 않는다.'
		),
		dlg('A clerk', ['Then this.'], ['그러면 이거.']),
		p('They put the dark cup in both his hands. Somebody has warmed it. That is a kindness, of a kind.', '어두운 잔을 두 손에 쥐여 준다. 누군가 데워 놨다. 그런 종류의 친절이다.'),
		p('The storehouse goes. The clerks go. There is only the cup.', '창고가 사라진다. 서기들이 사라진다. 잔만 남는다.'),
		p('He drinks. It tastes like metal, then like nothing.', '마신다. 쇠 맛이다. 그다음엔 아무 맛도 없다.'),
		dlg('Geunrang', ['Geomgun—', 'Spit it. Spit it—'], ['검군—', '뱉어. 뱉으라니까—']),
		p(
			'The bowl hits the floor. It does not break. He goes to his knees the way a sack goes, all at once, and Geunrang is not fast enough to catch the head.',
			'사발이 바닥에 떨어진다. 깨지지 않는다. 자루가 쓰러지듯, 한 번에 무릎을 꿇는다. 근랑의 손이 머리를 받기엔 늦다.'
		)
	];

	const hand = flashOf(bupmin, 'the hand');
	if (!hand) throw new Error('no hand');
	hand.blocks = [
		p(
			'A night yard. No crown. An old man who has already lost one war, and a boy who has been asking since dusk.',
			'밤 마당. 관은 없다. 전쟁을 하나 이미 진 늙은이, 그리고 해 질 녘부터 빌고 있는 아이.'
		),
		p(
			'The lamp has burned down twice. The boy has not sat. His pack is already tied. That is how you know this is not a first asking.',
			'등잔이 두 번 사그라들었다. 아이는 앉지 않았다. 짐은 이미 묶어 뒀다. 처음 비는 게 아니라는 걸, 그걸로 안다.'
		),
		dlg('The boy', ['Father. Send me.', 'If you don’t, I’ll go anyway.'], ['아버지. 보내 주소.', '안 보내 주셔도, 갈 겁니다.']),
		p('The yard goes. There is only the boy’s face.', '마당이 사라진다. 아이 얼굴만 남는다.'),
		dlg('Guriji', ['Sit down.'], ['앉아라.']),
		p('The boy does not sit. The hand finds his head anyway.', '아이는 앉지 않는다. 손은 그래도 머리를 찾는다.'),
		dlg(
			'Guriji',
			['You will not come back the boy I am sending.', 'If you can still call me father when you get back — go.'],
			['보내는 아이로 돌아오진 않을 거다.', '가서도 날 아버지라 부를 수 있으면 — 가거라.']
		),
		dlg('The boy', ['I will.'], ['부를 겁니다.']),
		p(
			'The gate is already open. The horse is already saddled. The old man had decided before the asking started, and made the boy do the work of asking anyway.',
			'문은 이미 열려 있다. 말은 이미 안장을 얹었다. 늙은이는 빌기 전에 정했고, 빌게 만든 것이다.'
		)
	];

	const arrows = flashOf(bupmin, 'the arrows');
	if (!arrows) throw new Error('no arrows');
	arrows.year = '602';
	arrows.blocks = [
		p(
			'A monk’s room at Gasilsan. Two young men who have already lost a season, asking for rules a layman could keep.',
			'가실사의 방. 한 철을 이미 잃은 젊은이 둘. 속인이 지킬 만한 계율을 청한다.'
		),
		dlg('@gwisan', ['We need something we can keep.', 'Not a sutra. A rule.'], ['지킬 수 있는 게 필요합니다.', '경이 아니라. 계율.']),
		dlg(
			'Wongwang',
			['Five.', 'Serve the sovereign. Serve your parents. Trust a friend. Never retreat. Choose when you kill.'],
			['다섯이네.', '사군이충. 사친이효. 교우이신. 임전무퇴. 살생유택.']
		),
		dlg('@chuhang', ['The fourth will be the hard one.'], ['넷째가 제일 어렵겠군.']),
		dlg('Wongwang', ['Then keep it first.'], ['그럼 그걸 먼저 지키게.']),
		p('They bow. They do not ask what happens if they fail it.', '절한다. 못 지키면 어떻게 되는지는 묻지 않는다.'),
		scene('Amak Fortress', '아막성'),
		place('amak'),
		p(
			'From above, the pass is a saddle between two hills. A stone ring sits on it. West of the ring, a wide high field. East, the road home.',
			'위에서 보면 고개는 두 언덕 사이의 안장이다. 그 위에 돌 고리가 앉아 있다. 고리 서쪽은 넓은 높은 들. 동쪽은 집으로 가는 길.'
		),
		p(
			'Baekje has come up that western field and put itself around the ring. The king is with them. He still likes to ride at the front. The court wishes he wouldn’t.',
			'백제가 서쪽 들을 올라와 고리를 둘러쌌다. 임금이 같이 왔다. 아직 맨 앞에서 타길 좋아한다. 조정은 그러지 말았으면 한다.'
		),
		p(
			'He is young for a king who already has a war. Yellow cloth under grey steel. He points at the gate the way a boy points at a game he means to win.',
			'전쟁을 이미 가진 임금치고는 젊다. 회색 강철 아래 노란 옷. 이기고 싶은 놀이를 가리키듯, 문을 가리킨다.'
		),
		dlg('@kingmu', ['That gate.', 'When it opens, we go through. When it doesn’t, we go over.'], [
			'저 문.',
			'열리면 들어가고. 안 열리면 넘어간다.'
		]),
		dlg('A Baekje captain', ['Majesty. The Silla relief is already on the east road.'], ['마마. 신라 구원병이 이미 동쪽 길에 있습니다.']),
		dlg('@kingmu', ['Good.', 'I didn’t come here to sit.'], ['좋아.', '앉으러 온 거 아니야.']),
		p(
			'Silla’s relief comes up the east road: five captains, and two junior officers who asked a monk for a rule. Gwisan’s father has the left. Gwisan and Chuhang ride behind him.',
			'신라 구원병이 동쪽 길로 올라온다. 장수 다섯, 그리고 스님에게 계율을 청한 하급 둘. 왼쪽은 귀산의 아비가 맡는다. 귀산과 추항은 그 뒤를 탄다.'
		),
		p(
			'The first fight is the one they will tell first. The ring holds. The yellow line breaks. Baekje goes back down the western field, in a hurry that looks like fear.',
			'첫 싸움이, 나중에 먼저 말하게 되는 싸움이다. 고리가 버틴다. 노란 줄이 끊어진다. 백제가 서쪽 들로 내려간다. 무서워 보이는 서두름으로.'
		),
		dlg('@chuhang', ['That’s it.', 'They’re running.'], ['끝났네.', '뛴다.']),
		dlg('Mueun', ['After them.', 'Don’t let them make the next hill.'], ['쫓아라.', '다음 언덕은 못 가게.']),
		dlg('@kingmu', ['Let them come.', 'The pond will do the rest.'], ['오게 해.', '연못이 나머질 한다.']),
		p(
			'Silla thinks it has won. You would have thought so too. The gate is still theirs. The field is empty of anyone who wants to stay. They go after the yellow, laughing, the way men laugh when a war has been shorter than breakfast.',
			'신라는 이긴 줄 안다. 너라도 그랬을 거다. 문은 아직 저희 것이다. 들에 남고 싶은 자는 없다. 노란 옷을 쫓아간다. 전쟁이 아침밥보다 짧았을 때 웃는, 그 웃음으로.'
		),
		p(
			'West of the pass a pond sits under pines. Cheonsan. The water is black and still. The trees are too quiet for a retreat.',
			'고개 서쪽에 소나무 아래 연못이 있다. 천산. 물은 검고 가만히 있다. 후퇴치곤 나무가 너무 조용하다.'
		),
		p('Gwisan is laughing at something Chuhang said. Then he is not.', '귀산이 추항이 한 말에 웃는다. 그다음엔 안 웃는다.'),
		p(
			'The arrow takes him in the side. He feels the hit before he hears the string. He stays up. The horse screams and stays up too.',
			'화살이 옆구리를 받는다. 시위 소리보다 맞는 걸 먼저 느낀다. 그래도 서 있다. 말도 울고도 서 있다.'
		),
		dlg('@chuhang', ['Gwisan—'], ['귀산—']),
		p(
			'Then the pines shoot. The whole wood. Men go down in the first breath. The pond was never empty. Baekje had only gone as far as the trees.',
			'그때 소나무가 쏜다. 숲 전체가. 첫 숨에 사람들이 쓰러진다. 연못은 원래 비어 있지 않았다. 백제는 나무까지만 간 것이다.'
		),
		p(
			'The king comes out of the pines himself, yellow under steel, already shouting for the next volley. He looks happy. He has been waiting for this part.',
			'임금이 소나무 사이에서 직접 나온다. 강철 아래 노란 옷. 이미 다음 줄을 소리친다. 즐거워 보인다. 이 대목을 기다리고 있었던 것이다.'
		),
		dlg('@kingmu', ['Now.', 'Take the ones who turn.'], ['이제.', '돌아서는 놈부터.']),
		p(
			'The ones who can still run, run. The east road is suddenly very far. A gap opens the way a mouth opens. They take it.',
			'아직 뛸 수 있는 자들은 뛴다. 동쪽 길이 갑자기 멀다. 입이 벌어지듯 틈이 생긴다. 그리로 빠진다.'
		),
		dlg('@chuhang', ['Gwisan—', 'We can still—'], ['귀산—', '아직—']),
		p(
			'Gwisan is on one knee. The arrow is still in him. His father is on foot beside the horse. A hook has found the old man’s belt. Two yellow sleeves are pulling.',
			'귀산이 한 무릎을 꿇는다. 화살은 아직 박혀 있다. 아버지는 말 곁에, 걸어 있다. 갈고리가 늙은이의 띠를 찾았다. 노란 소매 둘이 당기고 있다.'
		),
		dlg('Mueun', ['Get on. Both of you. Now.'], ['올라타라. 둘 다. 지금.']),
		p('The hills go. There is only his face.', '산이 사라진다. 그 얼굴만 남는다.'),
		dlg('@gwisan', ['I heard it from my teacher.', 'A man in the army does not retreat.', 'How could I dare run.'], [
			'스승께 들었소.',
			'군인이 되어 물러섬이 없어야 한다고.',
			'어찌 감히 달아나겠소.'
		]),
		dlg('@gwisan', ['The horse. Father first.'], ['말. 아버지부터.']),
		dlg('Mueun', ['I am not asking.'], ['묻는 게 아니다.']),
		dlg('@gwisan', ['No.'], ['안 됩니다.']),
		p(
			'He cuts the hook off the belt. He boosts his father into the saddle. The horse goes through the gap without them. The old man looks back once and does not forgive either of them.',
			'띠에서 갈고리를 벤다. 아버지를 안장에 올린다. 말은 둘 없이 틈으로 빠진다. 늙은이가 한 번 돌아본다. 둘 다 용서하지 않는다.'
		),
		p('The gap goes. There is only Chuhang’s face.', '틈이 사라진다. 추항의 얼굴만 남는다.'),
		dlg('@chuhang', ['Then I’m not going either.'], ['그럼 나도 안 가.']),
		p(
			'They turn back into the wood. A man in yellow comes at Gwisan with a spear. Gwisan takes the shaft, the way you take a doorbar, and puts the point through the man’s throat. The next one he does not see. The spear comes in under the first arrow and stays there.',
			'숲으로 다시 들어간다. 노란 옷이 창을 들고 귀산에게 온다. 귀산이 빗장 잡듯 자루를 잡고, 창날을 그 목에 넣는다. 다음 놈은 못 본다. 창이 첫 화살 아래로 들어와, 그대로 있다.'
		),
		p(
			'Chuhang is laughing. It is not a happy sound. He puts his blade into a horse’s chest and goes down with it, and gets up with somebody else’s blood in his mouth, and does not spit.',
			'추항이 웃는다. 기쁜 소리가 아니다. 칼날을 말 가슴에 넣고 같이 쓰러졌다가, 남의 피를 입에 물고 일어난다. 뱉지 않는다.'
		),
		p(
			'They do not take the gap. The arrows find that out for them. When it is over they are on the road, under a fallen horse, the way the wall will keep them. The monk in the corner has not started writing yet.',
			'틈으로 가지 않는다. 화살이 그걸 확인해 준다. 다 끝나자 둘은 길에 있다. 넘어진 말 아래, 벽이 남겨 둘 그 모양으로. 구석의 스님은 아직 쓰기 시작하지 않았다.'
		)
	];

	const wine = flashOf(bupmin, 'the wine');
	if (!wine) throw new Error('no wine');
	wine.blocks = [
		p(
			'A raider camp in the western hills. Two summers they have been taking Silla grain. Forty swords. One fire. One jar.',
			'서쪽 산의 약탈꾼 진채. 두 해 여름을 신라 곡식을 털었다. 칼 마흔. 불 하나. 동이 하나.'
		),
		p(
			'He walks in the way a man walks into a room he has already paid for. Magenta sleeve. No sword in the hand. The jar is heavy. He lets them see that.',
			'이미 값을 치른 방에 들어가듯 걸어 들어간다. 자홍 소매. 손엔 칼이 없다. 동이가 무겁다. 그게 보이게 든다.'
		),
		dlg('A Baekje raider', ['Just the one of you.', 'Search him.'], ['혼자야.', '뒤져.']),
		p('They search him. They find wine. They find a plum. They do not find a blade.', '몸을 뒤진다. 술이 나온다. 매화 하나. 칼은 안 나온다.'),
		dlg('@chunchu', ['The wine was too heavy to come alone.', 'I had to share it or waste it. I hate waste.'], [
			'술이 혼자 오기엔 무겁소.',
			'나눠 마시든가, 버리든가. 버리는 건 질색이오.'
		]),
		p('He sits. He pours. He does not reach for anything else.', '앉는다. 따른다. 다른 것엔 손을 대지 않는다.'),
		dlg('A Baekje raider', ['What’s the joke.'], ['뭐가 웃겨.']),
		dlg(
			'@chunchu',
			['No joke.', 'Your captain takes our grain. We take it back. This is cheaper.', 'Also, the wine is better than yours. That’s not a joke either.'],
			['농담 아니오.', '당신들 대장이 우리 곡식을 가져가오. 우린 도로 가져오고. 이게 더 싸오.', '게다가 이 술이 당신들 것보다 낫소. 그것도 농담이 아니오.']
		),
		p('They laugh first. Then they drink. Then they laugh at the right things.', '처음엔 그를 보고 웃는다. 그다음엔 마신다. 그다음엔 제대로 된 데에 웃는다.'),
		p(
			'One man reaches for the sword at his hip. The man next to him puts a hand on the wrist without looking. The fire pops. Nobody mentions it.',
			'한 놈이 허리 칼에 손을 가져간다. 옆 놈이 보지도 않고 그 손목을 잡는다. 불이 톡 튄다. 아무도 그 얘긴 안 한다.'
		),
		dlg('@chunchu', ['If you kill me, you have one night.', 'If you walk behind me, you have breakfast.', 'I know which one I would pick. I’m greedy that way.'], [
			'나를 죽이면 오늘 밤 하나요.',
			'내 뒤를 따라오면 아침이 있소.',
			'나라면 아침을 고르겠소. 욕심이 많아서.'
		]),
		p(
			'By midnight every sword is on the ground. By dawn they ask to walk behind him. He lets them. He leaves the jar.',
			'밤이 되기 전에 칼은 전부 땅바닥에 있다. 새벽이 되면 따라가겠다고 지들이 조른다. 그는 따른다. 동이는 놓고 간다.'
		)
	];

	const start = find(bupmin, 'At the very end, where the wall meets');
	const card = find(bupmin, 'The yard is new. The idea is newer.');
	if (start.length !== 1 || card.length !== 1) throw new Error(`sadaham cut ${start.length} ${card.length}`);
	{
		const { list, i } = start[0];
		const end = list.indexOf(card[0].b);
		if (end <= i) throw new Error('card before start');
		list.splice(i, end - i);
	}
	Object.assign(card[0].b, {
		html: '<b>The next bay is a boy the wall will not number. Ask the yard in the morning…!</b>',
		ko: '<b>다음 칸은, 벽이 번호를 안 매긴 아이다. 아침이 되면 마당에 물어봐라…!</b>'
	});

	const jukjuk = entryByTitle(story, 'Jukjuk');
	const hold = find(jukjuk, 'Then he is broken, exactly as promised');
	if (hold.length !== 1) throw new Error('jukjuk hold ' + hold.length);
	hold[0].b.html =
		'They come up the hill from the north gate, the way the garrison went down. He holds the inner gate until the sun is up, the bright one Yunchung swore on.';
	hold[0].b.ko =
		'수비대가 내려간 그 길로, 그들이 북문에서 언덕을 올라온다. 그는 해가 뜰 때까지 안문을 지킨다. 윤충이 걸고 맹세한 그 밝은 해가.';

	const afterHold = makeInsertAfter(jukjuk, hold[0].b);
	afterHold([
		p(
			'The first man over the stair has a spear already wet. Jukjuk meets him on the third step and puts him back down it. The man folds in the middle and does not unfold.',
			'계단을 올라오는 첫 놈의 창은 이미 젖어 있다. 죽죽이 세 번째 칸에서 만나, 도로 밀어 내린다. 그 놈은 허리가 접힌 채로, 펴지지 않는다.'
		),
		dlg('Yongsuk', ['Sir— left—'], ['나리— 왼쪽—']),
		p(
			'Yongsuk takes the next spear through the throat. He looks surprised, then annoyed, then he is on his back on the boards with the spear still in him, kicking once, and then not.',
			'다음 창을 용숙이 목으로 받는다. 놀란 얼굴, 그다음엔 짜증 난 얼굴, 그다음엔 창이 꽂힌 채로 마룻바닥에 누워 한 번 차고, 그만이다.'
		),
		dlg('@jukjuk', ['Stay down.', 'That’s an order you can keep.'], ['누워 있어.', '그 명령은 지킬 수 있겠다.']),
		p(
			'He does not look at Yongsuk again. He has the gate. A yellow sleeve comes in low and opens him under the ribs. Green cloth goes black. He stays standing. The next blow takes the hamstring. He stays standing on the other leg.',
			'용숙은 다시 보지 않는다. 문이 있다. 노란 소매가 낮게 들어와 갈비 아래를 연다. 초록 옷이 검어진다. 그래도 서 있다. 다음 칼이 오금을 가져간다. 다른 다리로 서 있다.'
		),
		dlg('@jukjuk', ['Break.', 'Never bend.'], ['꺾여라.', '굽지는 마라.']),
		p(
			'He says it to the door, or to the grove, or to nobody. Then a spear from behind finds the place between the plates, and he is broken, exactly as promised, and not bent. He remains on his feet a moment after that, the way bamboo does, and then he does not.',
			'문에 하는 말인지, 대숲에 하는 말인지, 아무에게도 아닌 말인지. 뒤에서 온 창이 판 사이를 찾는다. 약속대로 꺾인다. 굽지는 않는다. 그 뒤로도 한순간 서 있다. 대가 그러하듯. 그다음엔 아니다.'
		),
		p(
			'Ledger under one arm, crow-dark robe. He reads the name three times. Jukjuk. Jukjuk. Jukjuk.',
			'한쪽 팔에 장부, 까마귀색 도포. 이름을 세 번 읽는다. 죽죽. 죽죽. 죽죽.'
		),
		dlg(
			'@kangrim',
			['One question, then we walk.', 'Were you the wall, or the name.'],
			['질문 하나, 그리고 걷읍시다.', '담이었소, 이름이었소.']
		),
		dlg('@jukjuk', ['Ask the grove.', 'I held until I didn’t.'], ['대숲에 물으시오.', '들 수 있을 때까지 들었소.']),
		dlg('@kangrim', ['Clean enough.', 'Come.'], ['깨끗하오.', '갑시다.'])
	]);

	console.log('bupmin flashes + sadaham cut + jukjuk death');
});

function makeInsertAfter(entry, block) {
	return (blocks) => {
		for (const list of lists(entry)) {
			const i = list.indexOf(block);
			if (i >= 0) {
				list.splice(i + 1, 0, ...blocks);
				return;
			}
		}
		throw new Error('insert target missing');
	};
}
