// Flesh-out pass "baekje-bond": the Euija–Gyebek promise, the five princes, the three loyalists, Gomanari.
// Idempotent: each episode is skipped once its marker text exists.
import { editStory, textOf, lists } from '../story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const D = (person, en, ko) => ({ kind: 'dialogue', person, en, lines: ko });
const SC = (label, ko) => ({ kind: 'scene', label, ko });
const CARD = (person, caption, ko, look) => ({ kind: 'card', person, ...(look ? { look } : {}), caption, ko });

function entry(story, chap, title) {
	const e = story.find((c) => c.id === chap)?.entries.find((x) => x.title === title);
	if (!e) throw new Error(`no entry ${chap} / ${title}`);
	return e;
}

function has(e, frag) {
	return lists(e).some((list) => list.some((b) => textOf(b).includes(frag)));
}

/** The one block (in any list of the entry) containing `frag`, with its list and index. */
function pick(e, frag, kind) {
	const hits = [];
	for (const list of lists(e))
		list.forEach((b, i) => {
			if ((!kind || b.kind === kind) && textOf(b).includes(frag)) hits.push({ list, i, b });
		});
	if (hits.length !== 1) throw new Error(`${e.title}: "${frag}" has ${hits.length} hits`);
	return hits[0];
}

function after(e, frag, blocks, kind) {
	const { list, i } = pick(e, frag, kind);
	list.splice(i + 1, 0, ...blocks);
}

function episode(chap, title, marker, fn) {
	editStory((story) => {
		const e = entry(story, chap, title);
		if (has(e, marker)) {
			console.log(`${title}: already done`);
			return false;
		}
		fn(e);
		console.log(`${title}: patched`);
	});
}

// ───────────────────────── Prince Euija: "I want to live"
episode('samhan', 'Prince Euija', 'You have your word. Now you have mine.', (e) => {
	const sons = pick(e, 'grow up already spoken for').b;
	sons.html =
		'His sons grow up already spoken for. Yung wears a Satek ring. Tae has a Jinmo grandmother. Little Pung has lovely handwriting and a Mokli tutor.';
	sons.ko = '그의 아들들은 이미 임자가 정해진 채 자란다. 융은 사택가 반지를 낀다. 태의 할머니는 진모가다. 어린 풍은 글씨가 곱고, 스승이 목리가 사람이다.';

	after(e, 'It is very annoying to be proved wrong', [
		D('euija', ['All right. Your word. That one belongs to the Jinmo brat.', 'What’s yours? What do you want?'], ['그래. 약조. 그건 진모가 꼬맹이 거고.', '네 건 뭐냐? 너는 뭘 원하느냐?']),
		D('gyebek', ['Nothing.'], ['없습니다.']),
		D(
			'euija',
			[
				'Ha! Nobody wants nothing. My father wants a boy on the sand. The Jinmo want their pot. I want this jar, and I’m not opening it, which is killing me.',
				'Do you want to die?'
			],
			['하! 아무것도 안 바라는 놈은 없다. 아버지는 모래판에 세울 아이를 원하고, 진모가는 향로를 원하고, 나는 이 술 단지를 원하는데 안 따고 있다. 죽을 맛이지.', '죽고 싶으냐?']
		),
		D('gyebek', ['No.'], ['아닙니다.']),
		D('euija', ['Run, then?'], ['그럼 도망치고 싶으냐?']),
		D('gyebek', ['No.'], ['아닙니다.']),
		D('euija', ['Back to the eels?'], ['장어 팔던 데로 돌아가고 싶으냐?']),
		D('gyebek', ['…No.'], ['…아닙니다.']),
		D(
			'euija',
			['No, no, no. That’s your whole life, isn’t it. Nobody ever asked you the other question.', 'I’m asking. Say it.'],
			['아니다, 아니다, 아니다. 평생 그 소리만 했구나. 다른 걸 물어본 놈이 아무도 없었지.', '내가 묻는다. 말해 봐.']
		),
		P(
			'The boy opens his mouth, and nothing comes. A man he loved told him to forget everything, and he did as he was told. He put the words away somewhere safe when he was small. He has not looked since.',
			'아이가 입을 연다. 아무 소리도 안 나온다. 사랑하던 사람이 다 잊으라 했고, 그는 시킨 대로 했다. 어릴 때 그 말들을 안전한 데 넣어 두었다. 그 뒤로 한 번도 꺼내 보지 않았다.'
		),
		D('gyebek', ['…I want to live.'], ['…살고 싶습니다.']),
		P('It comes out as a whisper. The second time, it doesn’t.', '속삭임으로 나온다. 두 번째는 아니다.'),
		D(
			'gyebek',
			['<b>I want to live…!</b>', 'Not in a ditch. Not without a name.', 'I want to be someone they have to write down…!'],
			['<b>살고 싶어요…!</b>', '도랑에서 말고. 이름도 없이 말고.', '저도… 누가 적어 둬야 하는 사람이 되고 싶어요…!']
		),
		P(
			'Euija stands. He is soaked to the waist, the hood is gone, and for once in his life he does not laugh first.',
			'의자가 일어선다. 허리까지 젖었고, 두건은 어디 갔는지 없다. 평생 처음으로, 그는 먼저 웃지 않는다.'
		),
		D(
			'euija',
			[
				'Good. Then live.',
				'And here’s mine. Whatever you could be, all of it, to the last inch — I’ll get you there.',
				'I’ll stand you where no house in Baekje can pretend not to see you. They’ll write you down whether they like it or not.',
				'You have your word. Now you have mine.'
			],
			[
				'됐다. 그럼 살아라.',
				'그리고 이건 내 거다. 네가 될 수 있는 것, 그 끝의 끝까지 — 내가 데려다 놓으마.',
				'백제 어느 가문도 못 본 척 못 할 자리에 세워 주마. 싫든 좋든 너를 적게 될 게다.',
				'너한텐 네 약조가 있지. 이제 내 약조도 있다.'
			]
		),
		D('gyebek', ['You are a man in a grey hood.'], ['회색 두건 쓰신 분이십니다.']),
		D('euija', ['Ha! Tonight I am.', 'Now leave the pot to the catfish.'], ['하! 오늘 밤은 그렇지.', '이제 향로는 메기들한테 맡겨 둬라.']),
		D('gyebek', ['No.'], ['아닙니다.']),
		D('euija', ['…Of course not.'], ['…그럼 그렇지.'])
	]);
});

// ───────────────────────── Eight Great Clans: five princes, three men nobody owns
episode('samhan', 'Eight Great Clans', 'One step below the elders sit the crown prince’s sons.', (e) => {
	after(e, 'The elders watch from the hall steps.', [
		P(
			'One step below the elders sit the crown prince’s sons. Each one sits on his mother’s side of the stair. If you know the houses, you can read the whole Assembly off that stair.',
			'원로들 한 칸 아래엔 태자의 아들들이 앉아 있다. 저마다 어머니 집안 쪽 섬돌에 앉는다. 집안을 알면, 그 섬돌만 봐도 정사암 회의가 다 읽힌다.'
		),
		CARD(
			'yung',
			'The eldest, at seventeen. Satek on his mother’s side, and on every other side they could arrange.',
			'열일곱, 맏이. 어머니 쪽으로 사택이고, 사택이 손쓸 수 있는 다른 쪽으로도 다 사택이다.'
		),
		D('yung', ['That’s one.', '…Father didn’t clap.'], ['하나.', '…아버지는 손뼉 안 치셨네.']),
		CARD(
			'tae',
			'Second son, sixteen. A Jinmo grandmother, and a score kept in his sleeve. The score is always right.',
			'둘째, 열여섯. 할머니가 진모가고, 소매 속에 점수를 적어 둔다. 그 점수는 늘 맞다.'
		),
		D('tae', ['Jinmo one. Satek one. Yunbi owes my grandmother a boat.'], ['진모 하나. 사택 하나. 연비는 우리 할머니한테 배 한 척 빚졌고.']),
		CARD(
			'hyo',
			'Third son, fifteen. No clan behind his chair, only his mother. The houses can’t decide whether that makes him nothing or dangerous.',
			'셋째, 열다섯. 의자 뒤에 가문이 없다. 어머니뿐이다. 가문들은 그게 아무것도 아니라는 뜻인지, 위험하다는 뜻인지 아직 못 정했다.'
		),
		D(
			'hyo',
			['When the eel boy comes on, are we allowed to cheer for Father’s man? Or is that— is that taking a side?'],
			['장어 파는 애 나오면, 아버지 사람한테 환호해도 되나? 아니면 그게— 편드는 건가?']
		),
		D('tae', ['Cheer quietly. It’s cheaper.'], ['조용히 해. 그게 싸.']),
		CARD('yun', 'Twelve. Hae on his mother’s side. Not Yung. He will tell you so.', '열둘. 어머니 쪽은 해씨. 융이 아니다. 본인이 그렇게 말해 줄 것이다.'),
		D('herald', ['Prince Yung, your cushion—'], ['융 왕자님, 방석을—']),
		D('yun', ['Yun. Yung is over there. He’s the one with the ring.'], ['연이다. 융 형님은 저쪽. 반지 낀 쪽.']),
		CARD(
			'pung',
			'Eight, the youngest who counts. Mokli on his mother’s side. Best handwriting in the palace, and nobody has found a use for it yet.',
			'여덟 살, 셈에 드는 막내. 어머니 쪽은 목리가. 궁에서 글씨가 제일 곱다. 그 쓸모를 아직 아무도 못 찾았다.',
			'prince'
		),
		P(
			'Pung has a strip of wood on his knees and a brush in his fist. He is copying down every name the herald reads, because nobody told him not to.',
			'풍은 무릎에 목간 한 조각을 올려 두고 붓을 쥐고 있다. 전령이 읽는 이름을 하나도 빠짐없이 받아 적는다. 하지 말라는 사람이 없었으니까.'
		)
	]);

	after(e, 'By dusk the white is grey with chalk and grit.', [
		P(
			'On his way off the sand, Gyebek passes the bottom step. The littlest prince holds up his strip of wood.',
			'모래판을 나서던 계백이 맨 아래 섬돌을 지난다. 제일 어린 왕자가 목간을 들어 보인다.'
		),
		D('gyebek', ['I cannot read.'], ['저는 글을 못 읽습니다.']),
		D('pung', ['It says you. Buyeo Gyebek. I wrote it the herald’s way, only neater.', 'Keep it. I’ll write another.'], ['너라고 쓰여 있어. 부여 계백. 전령이 읽은 대로 썼는데, 더 반듯하게.', '가져. 난 또 쓰면 돼.']),
		P(
			'Gyebek looks at the marks for a long time. Then he puts the wood inside his shirt, where the burner went, and bows to a boy of eight as if he were the king.',
			'계백은 그 획들을 오래 들여다본다. 그러고는 향로를 쌌던 저고리 안에 목간을 넣고, 여덟 살 아이에게 임금께 하듯 절한다.'
		),
		D('gyebek', ['…Thank you.'], ['…고맙습니다.'])
	]);

	after(e, 'have been at it for four generations.', [
		P(
			'Two men on the rock are not lords. They keep the Assembly honest, or try to. One keeps the tide tables. One keeps the maps.',
			'바위 위에 귀족이 아닌 사람이 둘 있다. 회의를 정직하게 붙들어 두는 사람들이다. 아니, 그러려고 애쓰는 사람들이다. 하나는 물때표를 맡고, 하나는 지도를 맡는다.'
		),
		CARD(
			'seongchung',
			'Keeps the tide tables for the berth votes. Has never once changed a number to please a lord, and sweats every time.',
			'선석 표결에 쓰는 물때표를 맡는다. 귀족 비위 맞추려고 숫자를 고친 적이 한 번도 없다. 그리고 그때마다 진땀을 뺀다.'
		),
		D('eldersatek', ['Clerk. The spring tide at the Satek berth.'], ['서기. 봄 사리 때 사택 선석 물 깊이.']),
		D(
			'seongchung',
			['Four hands at the low, my lord. Which is— forgive me— not enough for a winter hull, so if the vote is about wintering, then—'],
			['썰물에 네 뼘입니다, 대감. 그건— 송구하오나— 겨울 배를 대기엔 모자라니, 표결이 겨울 정박에 관한 것이라면, 그—']
		),
		D('eldersatek', ['Write five.'], ['다섯으로 적게.']),
		D('seongchung', ['I— the river says four, my lord. I can write it larger. It will still be four.'], ['저— 강이 넷이라 합니다, 대감. 크게 적을 수는 있습니다. 그래도 넷입니다.']),
		CARD(
			'heungsu',
			'Draws the river for men who have never got their feet wet. He is already tired of explaining it.',
			'발 한 번 안 적셔 본 사람들을 위해 강을 그린다. 설명하는 데 벌써 지쳤다.'
		),
		D('heungsu', ['He’s right. Here.', 'The sandbar. Vote whatever you like. Silt doesn’t come to meetings.'], ['맞습니다. 여기.', '모래톱입니다. 표결은 마음대로 하십시오. 뻘은 회의에 안 옵니다.']),
		P(
			'He scratches the river mouth into the packed earth with his stick, wider than it really is, so the lords at the back can see it. Elder Yunbi laughs out loud. Elder Satek writes four.',
			'그는 지팡이 끝으로 다져진 흙바닥에 강어귀를 긁어 그린다. 뒷줄 대감들도 보이게, 실제보다 넓게. 연비 어른이 소리 내어 웃는다. 사택 어른은 넷이라고 적는다.'
		)
	]);

	after(e, 'When the rock is empty, the crown prince is still sitting on it', [
		P(
			'Below the rock, the two clerks are rolling up the day’s maps. The crown prince whistles them over like a man calling dogs. They come anyway.',
			'바위 아래에서 서기 둘이 그날의 지도를 말고 있다. 태자가 개 부르듯 휘파람을 분다. 그래도 둘은 온다.'
		),
		D(
			'euija',
			['You. The tide.', 'Four hands. You could have written five and gone home with a Satek purse. Why didn’t you?'],
			['너. 물때.', '네 뼘. 다섯이라 적고 사택 돈주머니 들고 집에 갈 수도 있었지. 왜 안 그랬느냐?']
		),
		D(
			'seongchung',
			['Because in the eleventh month a hull sits down on that bar, Highness, and somebody asks who wrote five, and—'],
			['동짓달에 배 한 척이 그 모래톱에 주저앉으면, 저하, 누가 다섯이라 적었느냐 묻게 될 것이고, 그러면—']
		),
		D('euija', ['And it’s you.'], ['너로구나.']),
		D('seongchung', ['It is always the clerk.'], ['늘 서기입니다.']),
		D('euija', ['Ha! Everybody on this rock wants something. What do you want, tide man?'], ['하! 이 바위 위에선 다들 뭘 원하지. 너는 뭘 원하느냐, 물때쟁이?']),
		D(
			'seongchung',
			['…A king who hears a bad number and does something about it. Before the hull, Highness. Just the once would—'],
			['…나쁜 숫자를 듣고 뭔가 하시는 임금입니다. 배가 주저앉기 전에요, 저하. 딱 한 번이라도—']
		),
		D('euija', ['And you? The stick.'], ['너는? 지팡이.']),
		D('heungsu', ['Same as him.', 'Earlier.'], ['저 사람과 같습니다.', '좀 더 일찍요.']),
		P('Remember that answer. He will give it again, at the worst possible time.', '그 대답을 기억해 두시라. 그는 그 말을 한 번 더 하게 된다. 가장 나쁜 때에.')
	]);

	const buy = pick(e, 'They want to buy you, you know.').b;
	buy.en = ['They want to buy you, you know. All three of you. Both houses will bid all winter.'];
	buy.lines = ['저치들이 너희를 사려고 한다. 셋 다. 두 집안이 겨울 내내 값을 부를 거다.'];

	after(e, 'I am not for sale.', [
		D('seongchung', ['Nor— nor am I, Highness. I think. Nobody has actually offered.'], ['저— 저도 아닙니다, 저하. 아마도요. 아직 아무도 값을 안 불렀지만요.']),
		D('heungsu', ['They will.'], ['부를 겁니다.'])
	]);

	const frighten = pick(e, 'That’s what frightens them.').b;
	frighten.en[0] = 'Ha! Three men on this rock nobody owns. That’s what frightens them.';
	frighten.lines[0] = '하하! 이 바위 위에 누구 것도 아닌 사내가 셋. 그래서 저치들이 겁을 먹는 거다.';
});

// ───────────────────────── King Euija: the chairs, Pung's slip, Gomanari
episode('five-principles', 'King Euija', 'The fastest horse in Samhan.', (e) => {
	const card = pick(e, 'The minister who asks the question', 'card').b;
	card.caption = 'Nine years on, the tide clerk sits on the rock. He still asks the question the king hoped nobody would.';
	card.ko = '아홉 해가 지나, 물때 서기는 바위 위에 앉아 있다. 아직도 임금이 아무도 묻지 않기를 바란 질문을 묻는다.';

	after(e, 'There are only so many chairs', [D('heungsu', ['Thirty-four.', 'I counted the chairs.'], ['서른넷입니다.', '의자를 세어 봤습니다.'])]);

	after(e, 'Nobody sends a prince he doesn’t mean to want back.', [
		P(
			'Pung bows and walks the length of the table to the door. It is a long table. At the far end, a man nobody has promoted gets up from his cushion.',
			'풍이 절하고 상을 따라 문까지 걸어간다. 긴 상이다. 저 끝에서, 아무도 승진시켜 주지 않은 사내 하나가 방석에서 일어난다.'
		),
		D('gyebek', ['Prince. I still have the wood.'], ['왕자님. 그 목간, 아직 가지고 있습니다.']),
		D('pung', ['…You still can’t read it.'], ['…아직도 못 읽으면서.']),
		D('gyebek', ['No. I know what it says.'], ['못 읽습니다. 무엇이 쓰였는지는 압니다.'])
	]);

	after(e, 'Pung least of all.', [
		SC('The royal stables · that night', '왕실 마구간 · 그날 밤'),
		P(
			'That night the promotions go up on the palace gate. Gyebek cannot read them. He holds Pung’s old strip of wood up beside the list and checks every name, shape by shape. None of them match.',
			'그날 밤 궁문에 승진 명단이 붙는다. 계백은 읽지 못한다. 그는 풍이 써 준 낡은 목간을 명단 옆에 대고, 이름을 하나하나 획의 모양으로 맞춰 본다. 맞는 것이 없다.'
		),
		P(
			'A groom finds him there. The king wants him at the stables. Now. It is the king’s favourite word.',
			'마부 하나가 그를 찾아온다. 임금께서 마구간으로 부르신다. 지금 당장. 임금이 제일 좋아하는 말이다.'
		),
		P(
			'The king is standing in the straw in his coronation silk, holding the halter of a black horse that will not keep still. It is tall and long in the back, black from nose to tail, and it looks at Gyebek the way Gyebek looks at everyone: straight, and without manners.',
			'임금은 즉위식 비단옷 차림으로 짚더미 위에 서서, 가만있지 않는 검은 말의 고삐를 쥐고 있다. 키가 크고 등이 길며, 코부터 꼬리까지 까맣다. 말은 계백이 누구에게나 그러듯 계백을 본다. 똑바로, 예의 없이.'
		),
		D(
			'euija',
			['There you are! They passed you over again. The houses wrote the list and I signed it. Don’t look at me like that.'],
			['왔구나! 또 밀렸더구나. 가문들이 쓰고 과인이 서명했다. 그런 눈으로 보지 마라.']
		),
		D('gyebek', ['I am not looking at you like anything.'], ['아무 눈으로도 안 봤습니다.']),
		D(
			'euija',
			[
				'Ha! No. You never do.',
				'So. Here. The fastest horse in Samhan. Bred at the bear ferry, at Gomanaru. My grooms swear nothing on four legs can catch him.',
				'They also swear the rock sweats.'
			],
			['하! 그렇지. 넌 늘 그렇지.', '그래서. 옜다. 삼한에서 제일 빠른 말이다. 곰나루에서 난 놈이야. 네 발 달린 것 중엔 저놈을 따라잡을 게 없다고 마부들이 맹세하더라.', '바위가 땀을 흘린다고도 맹세하는 놈들이지만.']
		),
		D('gyebek', ['Then I will time him.', 'What do I owe for him.'], ['그럼 제가 재 보겠습니다.', '값이 얼마입니까.']),
		D('euija', ['Nothing. It’s a gift.'], ['없다. 선물이다.']),
		D('gyebek', ['I do not know what to do with a gift.'], ['선물은 어찌해야 하는지 모릅니다.']),
		D(
			'euija',
			[
				'You ride it. That’s the whole trick.',
				'On the mud I said the last inch. You can’t get there on foot. Not on an army nag either, the way you sit one, like a sack of rice somebody’s angry at.'
			],
			['타면 된다. 그게 다야.', '그 뻘밭에서 끝의 끝까지라 했지. 걸어서는 못 간다. 군마로도 못 가. 네가 그거 타는 꼴이, 누가 화나서 던져 놓은 쌀가마니 같더라.']
		),
		P(
			'Gyebek says nothing. In his whole life he has been given exactly two things he did not have to pay back. Both came from this man.',
			'계백은 아무 말도 하지 않는다. 평생 갚지 않아도 되는 것을 받아 본 게 꼭 두 번이다. 둘 다 이 사람에게서였다.'
		),
		P(
			'He puts out his hand. The horse considers biting it, and doesn’t. Gyebek leans in and rests his forehead against the black neck. His lips move. He is counting to ten.',
			'그가 손을 내민다. 말은 물까 말까 하다가 물지 않는다. 계백은 몸을 기울여 검은 목덜미에 이마를 댄다. 입술이 움직인다. 열까지 세는 중이다.'
		),
		D('euija', ['What are you counting?'], ['뭘 세는 게냐?']),
		D('gyebek', ['Until I can talk.'], ['말할 수 있을 때까지입니다.']),
		P('Euija looks very hard at a saddle on the wall until he can, too.', '의자는 벽에 걸린 안장을 뚫어지게 본다. 저도 말할 수 있을 때까지.'),
		D(
			'euija',
			['Well? Name him. He came up from the ferry with no name, same as somebody I know.'],
			['그래서? 이름을 지어 줘라. 나루에서 이름도 없이 올라왔다. 내가 아는 누구처럼.']
		),
		D('gyebek', ['Gomanari. For the ferry.'], ['고마나리. 나루 이름을 따서.']),
		D('euija', ['That’s not a name, that’s a signpost.'], ['그건 이름이 아니라 이정표다.']),
		D('gyebek', ['It is where he is from. A name should say where you are from.', 'Mine does not.'], ['거기서 왔으니까요. 이름은 어디서 왔는지 말해 줘야 합니다.', '제 이름은 안 그럽니다.']),
		D(
			'euija',
			['…Yours says where you’re going.', 'Ride him to the ferry and back tomorrow. Learn on him. And then time him, you lunatic.'],
			['…네 이름은 어디로 가는지 말해 주지.', '내일 저놈 타고 나루까지 갔다 와라. 저놈한테 배워. 그리고 재 봐라, 이 미친놈아.']
		)
	]);
});

// ───────────────────────── Yunchung: "I'll send for you"
episode('five-principles', 'Yunchung', 'Then I will wait.', (e) => {
	after(e, 'The hall empties. Gyebek does not.', [
		D('gyebek', ['Majesty. You are saving me. For what.'], ['전하. 저를 아끼신다 하셨습니다. 무엇에 쓰시려고입니까.']),
		D(
			'euija',
			['Ha! For the day I need a man I can’t buy, and the houses have bought everybody else.'],
			['하! 내가 살 수 없는 사내가 필요한 날을 위해서지. 가문들이 다른 놈은 죄다 사 버린 날.']
		),
		D('gyebek', ['How will I know the day.'], ['그날인지 어찌 압니까.']),
		D('euija', ['I’ll send for you.'], ['내가 부르마.']),
		D('gyebek', ['Then I will wait.'], ['그럼 기다리겠습니다.'])
	]);
	const sev = pick(e, 'Majesty. The Severing.').b;
	sev.en[0] = 'And the Severing.';
	sev.lines[0] = '그리고 그 斷 말입니다.';
});

// ───────────────────────── Gyebek (fall-of-euija): the king's promise comes due
episode('fall-of-euija', 'Gyebek', 'Then you kept it.', (e) => {
	const { list, i } = pick(e, 'You don’t owe me this. The name was a gift.');
	if (!textOf(list[i + 1]).includes('I gave my word.')) throw new Error('Gyebek: reunion order changed');
	list.splice(
		i + 2,
		0,
		D(
			'euija',
			['…So did I. On the mud, with a knife in my belt. All of it, to the last inch.', 'And then I let them put you on an island.'],
			['…과인도 했다. 그 뻘밭에서, 칼을 허리에 찬 채로. 끝의 끝까지라고.', '그러고는 저놈들이 너를 섬에 보내게 뒀지.']
		),
		D('gyebek', ['Five thousand against fifty. Has anyone done it?'], ['오천으로 오만을. 해낸 사람이 있습니까.']),
		D('euija', ['…No.'], ['…없다.']),
		D('gyebek', ['Then you kept it.'], ['그럼 지키신 겁니다.'])
	);

	const yard = pick(e, 'a black horse at the post').b;
	yard.html = yard.html.replace(
		'Gomanari is named for the bear ferry where Gyebek learned to ride.',
		'Gomanari was a king’s gift, the night they passed him over.'
	);
	yard.ko = yard.ko.replace('고마나리. 그가 말 타는 법을 배운 곰나루에서 딴 이름이다.', '고마나리. 승진에서 밀린 그날 밤, 임금이 준 선물이다.');
});

// ───────────────────────── Yellow Mountain: the two promises in the last flashback
editStory((story) => {
	const e = entry(story, 'fall-of-baekje', 'Yellow Mountain');
	const fb = pick(e, 'A mudbank on the White River at night.').list;
	if (fb.some((b) => textOf(b).includes('Now you have mine.'))) {
		console.log('Yellow Mountain: already done');
		return false;
	}
	const i = fb.findIndex((b) => b.kind === 'dialogue' && b.person === 'gyebek' && b.en?.[0] === 'I gave my word.');
	if (i < 0) throw new Error('Yellow Mountain: flashback "I gave my word." not found');
	fb.splice(i + 1, 0, D('gyebek', ['…I want to live.'], ['…살고 싶습니다.']), D('euija', ['You have your word. Now you have mine.'], ['너한텐 네 약조가 있지. 이제 내 약조도 있다.']));
	console.log('Yellow Mountain: patched');
});
