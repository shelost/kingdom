import { editStory } from './story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const d = (who, en, lines) => {
	const block = { kind: 'dialogue', en: Array.isArray(en) ? en : [en], lines: Array.isArray(lines) ? lines : [lines] };
	if (who.person) block.person = who.person;
	else {
		block.speaker = who.speaker;
		if (who.gender) block.gender = who.gender;
	}
	if (who.chip) block.chip = who.chip;
	return block;
};

const SARA = { person: 'saradoryeong', chip: '#5f5a52' };
const WON = { person: 'wongang', chip: '#e85a32' };
const BOY = { person: 'sara', chip: '#8FBF8A' };
const VOICE = { speaker: 'A Voice', gender: 'm', chip: '#C30000' };
const RICH = { speaker: 'The Rich Man', gender: 'm', chip: '#8a7a3a' };
const GIRL = { speaker: 'The Youngest', gender: 'f', chip: '#c4a574' };

editStory((story) => {
	const en = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Hallakgungi');
	if (!en) throw new Error('Hallakgungi not found');

	const milletAt = en.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Millet Field');
	if (milletAt < 0) throw new Error('Millet Field not found');
	const millet = en.blocks.slice(milletAt);
	const last = millet[millet.length - 1];
	if (last?.kind === 'p' && last.html?.includes('<b>')) {
		last.html =
			'<b>The island keeps one story for last. It is about the one who comes for you, and the crow that lost his book…!</b>';
		last.ko =
			'<b>섬은 이야기 하나를 맨 끝까지 아껴 둔다. 당신을 데리러 오는 자, 그리고 그의 책을 잃어버린 까마귀 이야기다…!</b>';
	}

	en.logline = {
		en: 'Heaven called the first gardener west. He left a wife carrying, and the boy who grew up in that house learned what flowers are for.',
		ko: '하늘이 첫 꽃감관을 서쪽으로 불렀다. 그는 아이 밴 아내를 두고 갔고, 그 집에서 자란 아들은 꽃이 무엇을 하는 줄 알게 된다.'
	};

	const myth = [
		p(
			'You know the smile. The young gardener’s. This is the night it started costing.',
			'그 웃음, 알지. 젊은 꽃감관의 것. 값이 붙기 시작한 밤이다.'
		),
		scene('Sara’s Yard', '사라의 마당'),
		p(
			'They had a house at the edge of the bamboo. She was carrying. He was counting seeds. That is what he does when he does not want to think.',
			'대숲 끝에 집이 하나 있었다. 아내는 아이를 배고 있었다. 그는 씨앗을 세고 있었다. 생각하기 싫을 때 하는 일이다.'
		),
		p(
			'Then something older than the two suns spoke from above the roof. It does not give a name. It never does.',
			'그때 지붕 위에서, 두 해보다 오래된 것이 말했다. 이름은 대지 않는다. 한 번도 댄 적이 없다.'
		),
		d(VOICE, ['The west field is empty.', 'Keep it.'], ['서쪽 밭이 비었다.', '지켜라.']),
		d(SARA, ['…Now?', 'She’s— she’s carrying.'], ['…지금이우꽈.', '아내는— 아이 배고 이서.']),
		d(VOICE, ['The field does not wait.'], ['밭은 기다리지 않는다.']),
		p('He looks at her. She already has her sandals on.', '그는 아내를 본다. 아내는 이미 신을 신고 있다.'),
		d(WON, ['Go.', 'The field won’t.'], ['가라.', '밭은 안 기다려.']),
		d(SARA, ['Together—'], ['같이—']),
		d(
			WON,
			['I can’t keep up. Not like this.', 'Sell me in as a servant.', 'I’ll wait here.'],
			['배 부른디 못 따라가.', '나가 종으로 들어가커라.', '이디서 기다리켜.']
		),
		p(
			'He hates that sentence. He does it anyway. At the gate she snaps her comb in half and puts one piece in his sleeve.',
			'그 말이 싫다. 그래도 한다. 문간에서 아내는 빗을 반으로 꺾어 한쪽을 그의 소매에 넣는다.'
		),
		d(WON, ['Half. Yours, mine.', 'You’ll know it when it fits.'], ['이거 반. 느 반, 내 반.', '맞춰 보면 알지.']),
		d(SARA, ['Wait for me here.'], ['이디서 기다리라.']),
		d(WON, ['When?'], ['언제마씸?']),
		d(SARA, ['…I’ll come back.'], ['…돌아오마.']),
		p('He does not say how long. Heaven did not tell him.', '얼마나 걸릴지는 말하지 않는다. 하늘이 안 가르쳐 줬으니까.'),

		scene('The Rich Man’s House', '부잣집'),
		p(
			'The house that buys her is a thousand-year house. The kind that keeps dogs older than the roof. The man who owns it looks at her the way he looks at land.',
			'아내를 산 집은 천 년을 먹은 집이다. 지붕보다 늙은 개를 키우는 집. 주인은 땅을 보듯 아내를 본다.'
		),
		d(RICH, ['After the child.', 'I’m not a monster.'], ['아이 낳은 다음에.', '내가 짐승은 아니지.']),
		d(WON, ['No.'], ['싫수다.']),
		p('He laughs, as if no is a season that will pass.', '그는 웃는다. 싫다는 말이 지나가는 계절인 것처럼.'),
		p(
			'Her son is born in the servant room. She names him <b>Hallakgungi</b>. The rich man does not bother with a name. He has work.',
			'아들은 종방에서 태어난다. 그녀는 이름을 <b>할락궁이</b>라 붙인다. 부자는 이름 따윈 관심 없다. 시킬 일이 있으니까.'
		),
		{
			kind: 'card',
			person: 'sara',
			caption: 'Hallakgungi. Born a servant, and he means to find his father.',
			ko: '할락궁이. 종으로 태어났고, 아버지를 찾아갈 작정이다.',
			still: '/intro/sara--gardener.jpg'
		},
		p(
			'She says no for fifteen years. Through the mill, the beans, the yard, the night knocks. The boy grows up in that house. He learns the sound of a latch that does not open.',
			'그녀는 열다섯 해 동안 싫다 한다. 방앗간, 콩볶는 일, 마당, 밤의 노크를 다 겪으면서. 아들은 그 집에서 자란다. 열리지 않는 빗장 소리를 익힌다.'
		),
		d(RICH, ['Fifteen years.', 'Still no?'], ['열다섯 해다.', '아직도 싫다냐.']),
		d(WON, ['I said no.'], ['싫다 했주.']),
		p(
			'The boy is old enough, by then, to want a name that is not servant. He asks. She will not give it. So he does a cruel thing. You should know that, before you like his smile.',
			'그때쯤 아들은 종이 아닌 이름을 알고 싶어 한다. 묻는다. 어머니는 안 가르쳐 준다. 그래서 그는 잔인한 짓을 한다. 그 웃음을 좋아하기 전에, 이건 알아 둬야 한다.'
		),
		p(
			'She is roasting beans. He hides the stirring stick. She reaches into the pan with her hand. The beans will burn. They do. On her.',
			'어머니는 콩을 볶고 있다. 아들은 젓개 막대를 숨긴다. 콩이 탈까 봐 어머니는 맨손으로 냄비에 손을 넣는다. 그리고 탄다. 손이.'
		),
		d(WON, ['—Ah.'], ['—아.']),
		d(BOY, ['Mother.', 'Who’s my father.'], ['어멍.', '아방이 누구여.']),
		p('She looks at her hand. Then at him. He does not look away.', '그녀는 손을 본다. 그다음 아들을. 아들은 눈을 피하지 않는다.'),
		d(WON, ['West. Past where the roads stop.'], ['서쪽. 길 끝나는 디 너머.']),
		d(BOY, ['Come with me.'], ['같이 가.']),
		d(WON, ['Go tonight. Don’t come back for me.'], ['오늘 밤 가라. 나 데리러 오지 말라.']),
		d(BOY, ['Mother—'], ['어멍—']),
		d(
			WON,
			[
				'I’d slow you down. I slowed him down too.',
				'Three buckwheat cakes. The dogs eat the cakes, not you.',
				'If the water comes, keep walking. Knee. Waist. Neck. Don’t look back.'
			],
			[
				'나가 느 발 잡을 거라. 느 아방 발도 잡았주.',
				'메밀떡 세 개. 개는 떡을 먹지 널 안 먹지.',
				'물 오거든 그냥 걸어. 무릎이든 허리든 목이든. 뒤돌아보지 말고.'
			]
		),
		p(
			'She puts the other half of the comb in his hand. Hers is already gone from her hair.',
			'그녀는 빗의 나머지 반쪽을 아들의 손에 쥐여 준다. 머리에 꽂혀 있던 것은 이미 없다.'
		),
		p(
			'He goes west that night. In the morning the rich man finds the boy gone. He does not look for the boy.',
			'아들은 그날 밤 서쪽으로 떠난다. 아침에 부자는 아이가 없어진 걸 안다. 아이를 찾지는 않는다.'
		),

		scene('The West Road', '서쪽 길'),
		p(
			'The dogs are older than the roof, as promised. He throws the cakes without looking. He is good at not looking, already.',
			'개는 약속대로 지붕보다 늙었다. 아들은 떡을 던지고 보지 않는다. 안 보는 일은 벌써 잘한다.'
		),
		p(
			'The first water comes to his knees. The second to his waist. The third to his neck. He keeps walking, because she said to. He does not yet know what an oath sounds like when it is already spent.',
			'첫 물은 무릎까지 온다. 둘째는 허리. 셋째는 목. 그냥 걷는다. 가라 했으니까. 이미 쓰인 맹세가 어떤 소리인지는, 아직은 모른다.'
		),

		scene('The Flower Field', '서천꽃밭'),
		p(
			'The living maps run out. Rows of flowers run on anyway, to a gate. A man is standing in it with a basket on his hip, counting. That is what he does when he does not want to think.',
			'산 사람의 지도가 끝난다. 꽃 고랑은 그래도 문으로 이어진다. 문간에 남자 하나가 서서 허리에 바구니를 걸고 수를 세고 있다. 생각하기 싫을 때 하는 일이다.'
		),
		p(
			'The boy holds up his half of the comb. The man’s sleeve already has the other.',
			'아들이 빗 반쪽을 내민다. 남자의 소매에 이미 다른 쪽이 있다.'
		),
		d(SARA, ['You have her chin.'], ['느 어멍 턱을 닮았구나.']),
		d(
			BOY,
			['She waited fifteen years.', 'You didn’t say how long.'],
			['어멍은 열다섯 해를 기다렸어.', '얼마나 걸린다고 말을 안 했잖아.']
		),
		d(SARA, ['…No.'], ['…그래.']),
		p(
			'He takes the boy down the rows. Here, the flowers that put back bone, and flesh, and blood, and breath, and the soul last of all. Over there, the ones that laugh a man to death. The ones that make a house fight itself. At the end of the row, the one that ends a line altogether.',
			'그는 아들을 데리고 고랑을 걷는다. 여기는 뼈를, 살을, 피를, 숨을, 맨 마지막으로 넋을 되살리는 꽃. 저쪽은 사람을 웃다 죽게 하는 꽃. 한 집안이 저희끼리 싸우게 하는 꽃. 고랑 맨 끝에는 한 핏줄을 아주 끊어 버리는 꽃.'
		),
		d(SARA, ['Mind the end of the row. Don’t touch that one.'], ['고랑 끝은 조심해라. 그건 만지지 마라.']),
		d(BOY, ['The water. Knee, waist, neck.', 'What was that.'], ['물. 무릎, 허리, 목.', '그게 뭐여.']),
		d(
			SARA,
			[
				'Those weren’t directions.',
				'They were the oaths she swore while she was lying.',
				'She’d die in that water. To keep you.',
				'The water already came.'
			],
			['방향이 아니다.', '느 어멍이 거짓말하면서 건 맹세다.', '그 물로 죽겠다고. 널 지키려고.', '그 물은 이미 왔다.']
		),
		p('The boy looks at the end of the row. Then he takes from both.', '아들은 고랑 끝을 본다. 그리고 양쪽에서 다 꺾는다.'),
		d(SARA, ['That—'], ['그거—']),
		d(BOY, ['She waited fifteen years.', 'So did I.'], ['어멍은 열다섯 해를 기다렸어.', '나도.']),

		scene('The Party', '잔치'),
		p(
			'He goes back to the thousand-year house and holds a little party. He is polite about it. He even smiles, a little, for the first time you would recognise.',
			'아들은 그 천 년 집으로 돌아가 작은 잔치를 연다. 공손하게. 그리고 처음으로, 네가 알아볼 만한 웃음을 조금 짓는다.'
		),
		p(
			'The laughing flower first. The household cannot stop. They laugh until they cannot stand. Then they laugh on the floor. Then they do not laugh, because they cannot.',
			'먼저 웃음꽃. 집안이 멈추지 못한다. 서지 못할 때까지 웃고, 바닥에 엎드려서도 웃고, 그다음엔 웃지 않는다. 못 하니까.'
		),
		p(
			'The fighting flower next. Brothers find the knives they had been saving for the boy. They do not save them for the boy.',
			'다음은 싸움꽃. 형제가 아이 주려고 아껴 둔 칼을 찾는다. 아이 주지는 않는다.'
		),
		p(
			'Last, the one from the end of the row. A line ends. The dogs go quiet.',
			'마지막은 고랑 끝의 꽃. 한 핏줄이 끊긴다. 개들이 잠잠해진다.'
		),
		p(
			'He keeps the youngest daughter. He needs a witness, not another flower.',
			'막내딸만 남겨 둔다. 증인이 필요하지, 꽃이 하나 더 필요한 게 아니니까.'
		),
		d(BOY, ['My mother.', 'Where did he put her.'], ['어멍.', '어디다 뒀어.']),
		d(GIRL, ['The bamboo.', 'He threw her in the bamboo.'], ['대숲이요.', '대숲에 던졌어요.']),
		p(
			'He finds the bones in the grove and puts her back together in order. Bone. Flesh. Blood. Breath. Soul last of all, because that is the one that hurts if you rush it.',
			'대숲에서 뼈를 찾아, 순서대로 맞춘다. 뼈. 살. 피. 숨. 넋은 맨 마지막. 서두르면 아픈 게 그거라서.'
		),
		d(WON, ['A spring sleep.', 'I slept a long time.'], ['봄잠이라.', '오래도 잤다.']),
		d(BOY, ['…Mother.'], ['…어멍.']),
		d(WON, ['Your father.'], ['느 아방은.']),
		d(BOY, ['He’s at the gate.', 'He’s not coming.'], ['문간에 있어.', '안 와.']),
		p(
			'The father kept the gate until the boy was ready for it. Then he retired. In heaven that is the same as vanishing. He does not go home with them. He already used his going-home on the night he left.',
			'아버지는 아들이 문을 맡을 만해질 때까지 지키다가 물러난다. 하늘에서 물러난다는 건 사라지는 것과 같다. 함께 돌아가지 않는다. 돌아가는 일은, 떠나던 밤에 이미 썼으니까.'
		),
		p(
			'Afterwards the son keeps the field. The island calls him the Gardener when it does not want to say his name, which is most of the time. The flowers that bring you back and the flowers that end you grow in the same rows. He is the only one who knows which is which in the dark.',
			'그 뒤로 아들이 꽃밭을 지킨다. 섬은 그 이름을 입에 올리기 싫을 때 그를 꽃감관이라 부르는데, 대개 그렇다. 되살리는 꽃과 끝장내는 꽃이 같은 고랑에서 자라고, 어둠 속에서 어느 게 어느 것인지 아는 이는 그 하나뿐이다.'
		),
		p(
			'The smile stays. That is the part people like. They do not ask what he had to pick to learn it.',
			'웃음은 남는다. 사람들이 좋아하는 부분이다. 그걸 배우려면 무엇을 꺾어야 했는지는, 묻지 않는다.'
		)
	];

	en.blocks = [...myth, ...millet];
	en.thumbnail = 'hlk-call';
	const keep = new Set([
		'hlk-wait-here',
		'hlk-go-tonight',
		'hlk-call',
		'hlk-comb',
		'hlk-knock',
		'hlk-beans',
		'hlk-dogs',
		'hlk-waters',
		'hlk-comb-match',
		'hlk-ruin-row',
		'hlk-laugh-party',
		'hlk-bones',
		'hlk-spring-sleep',
		'hlk-smile',
		'gardener-close'
	]);
	en.images = (en.images ?? []).filter((im) => keep.has(im.id));
	return true;
});
