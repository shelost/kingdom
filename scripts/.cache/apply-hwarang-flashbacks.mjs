import { editStory, find, lists } from './story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const D = ({ person, speaker, gender = 'm', en, lines, look, chip }) => {
	const b = { kind: 'dialogue', en, lines };
	if (person) b.person = person;
	if (speaker) {
		b.speaker = speaker;
		b.gender = gender;
	}
	if (look) b.look = look;
	if (chip) b.chip = chip;
	return b;
};

const BOWL = [
	P(
		'A famine year. The storehouse door is the only light. Two clerks have already filled their sleeves.',
		'흉년이다. 창고 문이 유일한 빛이다. 서기 둘은 이미 소매를 채웠다.'
	),
	D({
		speaker: 'A clerk',
		en: ['Just take it.', 'Who’s counting.'],
		lines: ['그냥 퍼.', '누가 세어.']
	}),
	D({
		person: 'geomgun',
		en: ['It’s the king’s grain.'],
		lines: ['임금의 곡식이오.']
	}),
	D({
		speaker: 'A clerk',
		en: ['Then you’re already late.', 'We saved you a cup. For the one who talks.'],
		lines: ['그러면 이미 늦었어.', '잔은 남겨 뒀지. 입 열 놈 몫이야.']
	}),
	P('A second bowl. Dark. Not grain.', '사발이 하나 더 있다. 어둡다. 곡식이 아니다.'),
	D({
		speaker: 'Geunrang',
		en: ['Report them.', 'Or run. I can have a horse at the pine.'],
		lines: ['고발하든지.', '아니면 뛰어. 소나무에 말 대 줄 수 있어.']
	}),
	D({
		person: 'geomgun',
		en: ['I can’t do either.'],
		lines: ['둘 다 못 하오.']
	}),
	P('He empties the grain bowl back into the bin.', '곡식 사발을 빈에 도로 비운다.'),
	D({
		speaker: 'A clerk',
		en: ['Then this.'],
		lines: ['그럼 이거.']
	}),
	P('They put the dark cup in both his hands.', '어두운 잔을 두 손에 쥐여 준다.'),
	P('The storehouse goes. The clerks go. There is only the cup.', '창고가 사라진다. 서기들도 사라진다. 잔만 남는다.'),
	P('He drinks.', '마신다.'),
	D({
		speaker: 'Geunrang',
		en: ['Geomgun—'],
		lines: ['검군—']
	}),
	P('The bowl hits the floor. It does not break. He does.', '사발이 바닥에 떨어진다. 깨지지는 않는다. 그는 깨진다.')
];

const HAND = [
	P(
		'A night yard. No crown. An old man, and a boy who has been asking since dusk.',
		'밤 마당. 관은 없다. 늙은이, 그리고 해 질 녘부터 빌고 있는 아이.'
	),
	P(
		'The father has not answered. The lamp has burned down twice. The boy has not sat.',
		'아버지는 아직 대답하지 않았다. 등잔이 두 번 사그라들었다. 아이는 앉지 않았다.'
	),
	D({
		speaker: 'The boy',
		en: ['Father. Send me.', 'If you don’t, I’ll go anyway.'],
		lines: ['아버지. 보내 주소.', '안 보내 주셔도, 갈 겁니다.']
	}),
	P('The yard goes. There is only the boy’s face.', '마당이 사라진다. 아이 얼굴만 남는다.'),
	D({
		speaker: 'Guriji',
		en: ['Sit down.'],
		lines: ['앉아라.']
	}),
	P('The boy does not sit. The hand finds his head anyway.', '아이는 앉지 않는다. 손은 그래도 머리를 찾는다.'),
	D({
		speaker: 'Guriji',
		en: ['Go.', 'If you can still call me father when you get back.'],
		lines: ['가거라.', '가서도 나를 아버지라 부를 수 있으면.']
	}),
	D({
		speaker: 'The boy',
		en: ['I will.'],
		lines: ['부를 겁니다.']
	}),
	P(
		'The gate is already open. The horse is already saddled. That is how you know the father had decided before the asking started.',
		'문은 이미 열려 있다. 말은 이미 안장이 얹혀 있다. 그래서 안다. 아버지는 빌기 전에 이미 정했다는 것을.'
	)
];

const TIGER = [
	P(
		'Mount Nam. A tiger that has already decided the order. Three boys who have not.',
		'남산. 순서를 이미 정한 호랑이 한 마리. 아직 정하지 못한 소년 셋.'
	),
	P('It is in the path. There is no second path.', '길에 있다. 다른 길은 없다.'),
	D({
		person: 'bidam',
		en: ['What if we talk to it.', 'Everything listens, once.'],
		lines: ['말을 걸어 보는 게 어떻소.', '한 번은, 다 듣거든.'],
		look: 'hwarang',
		chip: '#141C2E'
	}),
	D({
		person: 'yushin',
		en: ['The sword is faster.'],
		lines: ['칼이 더 빠르다.'],
		look: 'hwarang',
		chip: '#4a8fe0'
	}),
	D({
		person: 'alchun',
		en: ['Oi.', 'Both of you shut up.'],
		lines: ['야.', '둘 다 입 다물어.'],
		look: 'hwarang'
	}),
	P(
		'Alchun looks at the tiger the way he looks at a meal he has already started.',
		'알천이 호랑이를 본다. 이미 한술 뜬 밥을 보듯.'
	),
	P('The mountain goes. There is only his face.', '산이 사라진다. 그 얼굴만 남는다.'),
	P('Alchun goes in with nothing in his hands.', '알천이 빈손으로 들어간다.'),
	P('The sword goes still in Yushin’s hand.', '유신의 손에서 칼이 멈춘다.'),
	P('The beads go still.', '염주가 멈춘다.'),
	P(
		'The round one gets his arms round the neck. The sword never has to finish the sentence.',
		'동글한 아이가 목을 끌어안는다. 칼은 문장을 끝낼 필요가 없어진다.'
	),
	D({
		person: 'bidam',
		en: ['…I was going to count the beads first.'],
		lines: ['……염주부터 세려고 했소.'],
		look: 'hwarang',
		chip: '#141C2E'
	}),
	D({
		person: 'yushin',
		en: ['Count later.', 'He’s heavy.'],
		lines: ['나중에 세게.', '무겁다.'],
		look: 'hwarang',
		chip: '#4a8fe0'
	}),
	D({
		person: 'alchun',
		en: ['You’re welcome.'],
		lines: ['고맙다는 말은 내가 먼저 안 한다.'],
		look: 'hwarang'
	})
];

const ARROWS = [
	P(
		'A monk’s room. Two young men who have already lost a season, asking for rules a layman could keep.',
		'스님의 방. 한 철을 이미 잃은 젊은이 둘. 속인이 지킬 만한 계율을 청한다.'
	),
	D({
		person: 'gwisan',
		en: ['We need something we can keep.', 'Not a sutra. A rule.'],
		lines: ['지킬 수 있는 게 필요합니다.', '경이 아니라. 계율.']
	}),
	D({
		speaker: 'Wongwang',
		en: [
			'Five.',
			'Serve the sovereign. Serve your parents. Trust a friend. Never retreat. Choose when you kill.'
		],
		lines: ['다섯이네.', '사군이충. 사친이효. 교우이신. 임전무퇴. 살생유택.']
	}),
	D({
		person: 'chuhang',
		en: ['The fourth will be the hard one.'],
		lines: ['넷째가 제일 어렵겠군.']
	}),
	D({
		speaker: 'Wongwang',
		en: ['Then keep it first.'],
		lines: ['그럼 그걸 먼저 지키게.']
	}),
	P('They bow. They do not ask what happens if they fail it.', '절한다. 못 지키면 어떻게 되는지는 묻지 않는다.'),
	P(
		'The next year, a fort in the western hills. A pine draw. A patrol coming home.',
		'이듬해, 서쪽 산의 성. 소나무 골짜기. 돌아오는 순찰.'
	),
	P('Then the trees shoot.', '그때 나무가 쏜다.'),
	P(
		'Men go down in the first breath. The horse screams and stays up. Gwisan takes an arrow in the side and stays up too.',
		'첫 숨에 사람들이 쓰러진다. 말은 울고도 서 있다. 귀산도 옆구리에 화살을 받고 서 있다.'
	),
	P(
		'A gap opens in the wall. The ones who can still run take it.',
		'벽에 틈이 생긴다. 아직 뛸 수 있는 자들은 그곳으로 빠진다.'
	),
	D({
		person: 'chuhang',
		en: ['Gwisan—', 'We can still—'],
		lines: ['귀산—', '아직—']
	}),
	P(
		'Gwisan is on one knee. The arrow is still in him. His father is on foot beside the horse.',
		'귀산이 한 무릎을 꿇는다. 화살은 아직 박혀 있다. 아버지는 말 곁에, 걸어 있다.'
	),
	D({
		speaker: 'Gwisan’s father',
		en: ['Get on. Both of you. Now.'],
		lines: ['올라타라. 둘 다. 지금.']
	}),
	P('The hills go. There is only his face.', '산이 사라진다. 그 얼굴만 남는다.'),
	D({
		person: 'gwisan',
		en: ['The horse. Father first.'],
		lines: ['말. 아버지부터.']
	}),
	D({
		speaker: 'Gwisan’s father',
		en: ['I am not asking.'],
		lines: ['묻는 게 아니다.']
	}),
	D({
		person: 'gwisan',
		en: ['No.'],
		lines: ['안 된다.']
	}),
	P(
		'He boosts his father into the saddle. The horse goes through the gap without them.',
		'아버지를 안장에 밀어 올린다. 말은 둘 없이 틈으로 빠진다.'
	),
	P('The gap goes. There is only Chuhang’s face.', '틈이 사라진다. 추항의 얼굴만 남는다.'),
	D({
		person: 'chuhang',
		en: ['Then I’m not going either.'],
		lines: ['그럼 나도 안 가.']
	}),
	P(
		'They do not take the gap in the wall. The arrows find that out for them.',
		'벽의 틈으로 빠지지 않는다. 화살이 그걸 대신 알아낸다.'
	)
];

const DEER = [
	P('Class 59’s first month. A yard game. One deer before sundown.', '오십구기 첫 달. 연무장 놀이. 해 지기 전에 사슴 한 마리.'),
	D({
		speaker: 'The Yard Marshal',
		en: ['One deer before sundown.', 'Walking does not count.'],
		lines: ['해 지기 전에 사슴 한 마리다.', '걷는 건 안 된다.']
	}),
	P(
		'Most boys come back with blood on the saddle. One dumps a fawn at the line and looks around for the laugh.',
		'대부분은 안장에 피 묻히고 돌아온다. 하나는 새끼를 선에 내려놓고 웃음을 찾는다.'
	),
	P(
		'In the pines, a magenta sleeve. The deer is still walking. Chunchu has the rope. He has not drawn.',
		'소나무 사이, 자홍빛 소매. 사슴은 아직 걷고 있다. 춘추가 고삐를 쥐고 있다. 칼은 아직이다.'
	),
	P('The yard goes. There is only his face.', '연무장이 사라진다. 그 얼굴만 남는다.'),
	P(
		'He ties a plum blossom on one horn. The rope is loose. The deer does not seem to mind.',
		'한쪽 뿔에 매화 한 송이를 맨다. 고삐는 헐겁다. 사슴은 별로 신경 쓰지 않는 얼굴이다.'
	),
	P(
		'Last through the gate: a magenta sleeve, and a deer still walking.',
		'문으로 마지막. 자홍빛 소매, 그리고 아직 걷는 사슴.'
	),
	D({
		speaker: 'The Yard Marshal',
		en: ['Doesn’t count.', 'Kill it.'],
		lines: ['안 된다.', '죽여.']
	}),
	D({
		person: 'chunchu',
		en: ['If I kill it now, sir, it’s just late.', 'If I don’t, it’s a deer.'],
		lines: ['지금 죽이면, 늦은 사슴입니다.', '안 죽이면 사슴입니다.'],
		look: 'hwarang',
		chip: '#D8258C'
	}),
	P(
		'The judges shout. On the wall, a young hwarang in blue is eating a pear. He is not the marshal. He has been watching the rope, not the horn.',
		'심판들이 소리를 지른다. 담 위, 푸른 옷의 젊은 화랑이 배를 먹고 있다. 도감이 아니다. 뿔이 아니라 고삐를 보고 있었다.'
	),
	D({
		person: 'yushin',
		en: ['The game said bring a deer.', 'It did not say kill one.'],
		lines: ['놀이가 사슴을 내라 했지.', '죽이라 하진 않았네.'],
		look: 'hwarang',
		chip: '#4a8fe0'
	}),
	P(
		'The deer eats the blossom off its own horn. The Marshal has to give it to him. The man on the wall does not look at the deer. He looks at the boy.',
		'사슴이 제 뿔에서 꽃을 뜯어 먹는다. 도감은 줄 수밖에 없다. 담 위의 사람은 사슴을 보지 않는다. 소년을 본다.'
	)
];

const WINE = [
	P('A raider camp in the western hills. Forty swords. One jar.', '서쪽 산의 약탈꾼 진채. 칼 마흔. 동이 하나.'),
	D({
		speaker: 'A Baekje raider',
		en: ['Just the one of you.'],
		lines: ['혼자야.']
	}),
	D({
		person: 'chunchu',
		en: ['The wine was too heavy to come alone.'],
		lines: ['술이 혼자 오기엔 무겁소.'],
		look: 'hwarang',
		chip: '#D8258C'
	}),
	P('He sits. He pours. He does not reach for a sword.', '앉는다. 따른다. 칼에는 손을 대지 않는다.'),
	P(
		'They laugh first. Then they drink. Then they laugh at the right things.',
		'처음엔 그를 보고 웃는다. 그다음엔 마신다. 그다음엔 제대로 된 데에 웃는다.'
	),
	P(
		'By midnight every sword is on the ground. By dawn they ask to walk behind him. He lets them.',
		'밤이 되기 전에 칼은 전부 땅바닥에 있다. 새벽이 되면 따라가겠다고 지들이 조른다. 그는 따른다.'
	)
];

const STONE = [
	P(
		'A grey river. Two thirteen-year-olds. One stone. The knife is too big for the hand using it.',
		'잿빛 강. 열세 살 둘. 돌 하나. 칼이 쓰는 손에 비해 크다.'
	),
	D({
		speaker: 'The boy',
		en: ['Like this?'],
		lines: ['이렇게?']
	}),
	D({
		speaker: 'The other boy',
		en: ['That’s upside down.'],
		lines: ['거꾸로다.']
	}),
	D({
		speaker: 'The boy',
		en: ['A stone hasn’t got a down.'],
		lines: ['돌은 방향이 없어.']
	}),
	P(
		'He keeps scratching. The other one watches him do it badly, and does not take the knife away.',
		'계속 긁는다. 다른 아이는 그걸 서툴게 하는 걸 보고만 있고, 칼을 빼앗지 않는다.'
	),
	P('The river goes. There is only the boy with the knife.', '강이 사라진다. 칼 든 아이만 남는다.'),
	D({
		speaker: 'The other boy',
		en: ['If I die first—', 'you already know.'],
		lines: ['내가 먼저 죽으면—', '너는 이미 알지.']
	}),
	P('He does not take the knife.', '칼을 빼앗지 않는다.'),
	D({
		speaker: 'The boy',
		en: ['Then don’t.'],
		lines: ['그럼 죽지 마.']
	}),
	P(
		'They put the stone in the river and let it sink. That is the whole swear.',
		'돌을 강에 넣고 가라앉힌다. 맹세는 그게 전부다.'
	)
];

function one(entry, frag, pred) {
	const hits = find(entry, frag, pred);
	if (hits.length !== 1) throw new Error(`${entry.title}: ${hits.length} hits for ${JSON.stringify(frag)}`);
	return hits[0];
}

function fb(entry, title) {
	for (const list of lists(entry)) {
		const b = list.find((x) => x.kind === 'flashback' && x.title === title);
		if (b) return b;
	}
	throw new Error(`${entry.title}: missing flashback ${title}`);
}

editStory((story) => {
	const bupmin = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Bupmin');
	const hwangsan = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Hwangsan Field');
	if (!bupmin || !hwangsan) throw new Error('missing Bupmin or Hwangsan Field');

	fb(bupmin, 'the bowl').blocks = BOWL;
	fb(bupmin, 'the hand').blocks = HAND;
	fb(bupmin, 'the tiger').blocks = TIGER;
	fb(bupmin, 'the arrows').blocks = ARROWS;
	fb(bupmin, 'the deer').blocks = DEER;
	fb(bupmin, 'the wine').blocks = WINE;
	fb(bupmin, 'the river stone').blocks = STONE;

	const emptied = one(bupmin, 'He emptied the bowl.', (b) => b.person === 'yushin');
	emptied.b.en = emptied.b.en.map((s) => (s === 'He emptied the bowl.' ? 'He emptied the bowl. Then he drank.' : s));
	emptied.b.lines = emptied.b.lines.map((s) => (s === '그 사발을 비웠다.' ? '그 사발을 비웠다. 그리고 마셨지.' : s));

	const died = one(bupmin, 'He died for not taking it.', (b) => b.person === 'yushin');
	const enI = died.b.en.indexOf('He died for not taking it.');
	const koI = died.b.lines.indexOf('안 집어 가서 죽었네.');
	if (enI < 0 || koI < 0) throw new Error('lecture cup line missing');
	died.b.en.splice(enI + 1, 0, 'And for the cup they put in his hands.');
	died.b.lines.splice(koI + 1, 0, '손에 쥐여 준 잔 때문에도.');

	const heard = one(hwangsan, 'I have heard you, Father.', (b) => b.person === 'bangul');
	heard.list.splice(heard.i + 1, 0,
		P(
			'He looks at the yellow field. Four times they have gone up it. Four times they have come down.',
			'노란 들판을 본다. 네 번 올라갔다. 네 번 내려왔다.'
		),
		P('The field goes. There is only his face.', '들판이 사라진다. 그 얼굴만 남는다.'),
		P('He does not look at his father again.', '아버지를 다시 보지 않는다.')
	);

	const well = one(hwangsan, 'Behind the Silla line there is a well');
	well.list.splice(well.i, 1,
		P(
			'Behind the Silla line there is a well, dug that morning for the horses. He scoops the water out with both hands and drinks.',
			'신라 대열 뒤에 그날 아침 말들을 위해 판 우물이 있다. 두 손으로 물을 떠 마신다.'
		),
		P('The well goes. There is only his face.', '우물이 사라진다. 그 얼굴만 남는다.'),
		P(
			'He rides back the way he came. Gyebek sent him home once. He comes back.',
			'왔던 길로 다시 달려간다. 계백은 그를 한 번 돌려보냈다. 그는 다시 온다.'
		)
	);

	console.log('ok');
});
