// Three Realms: sequential summit. Kangrim’s first year. Names vs titles.
import { openStory, p } from './story-edit.mjs';

const { entry, say, save } = openStory();
const e = entry('Three Realms');

e.logline = {
	en: "Kangrim’s first summit. Three rivers, a pavilion past any year, and a question he should not ask.",
	ko: "강림의 첫 회의. 강 셋, 해를 모르는 정자, 그리고 묻지 말았어야 할 질문."
};

const quote = {
	kind: 'quote',
	html: '“Seeing the Western Flower Field — what flower is this?” “The flower that gives back speech. This one, the flower that brings blood back. The flower that brings flesh back, the one for the organs and bowels, the flower that brings bones back.”',
	ko: '“서천꽃밭 구경 가서 보니, 이 꽃은 무슨 꽃입니까?” “말하게 할 꽃, 이 꽃은 피 오를 꽃, 살 오를 꽃, 오장육부 오를 꽃, 뼈 오를 꽃이로다.”',
	source:
		'Segyeong Bonpuri (세경본풀이) recited by Lee Seung-sun (이승순), recorded by Gang Jeong-sik, Gang So-jeon and Song Jeong-hui, 2011 — Sanggari, Aewol-eup (Hanguk Gubimunhak Daegye, rev. ed.)',
	style: 'shaman',
	native:
		'“서천꼿밧 구경간 요 꼿은 미신 꼿입네까?” “말 ᄀᆞᆯ을 꼿, 이 꼿은 피 오를 꼿, ᄉᆞᆯ 오를 꼿 오장육부 오를 꼿 뻬 오를 꼿이로다.”',
	nativeLang: 'ko-jeju'
};

e.blocks = [
	{ kind: 'section', label: 'The Pavilion', ko: '정자' },
	{ kind: 'scene', label: 'Three Rivers', ko: '세 강' },
	p(
		'Kangrim has never been to this meeting.',
		'강림은 이 회의에 처음이다.'
	),
	p(
		'Once a year the gods hold a meeting. Kangrim is late to this one, because of a yard in Baekje.',
		'해마다 한 번 신들이 회의를 연다. 올해 강림은 늦는다. 백제의 어느 마당 때문이다.'
	),
	p(
		'The annual meeting is a small pavilion: four posts, a raised floor, clouds for a yard. It sits past any map. No sun. No year. Three rivers find it anyway.',
		'해마다 여는 그 회의 자리는 작은 정자다. 기둥 넷, 높인 마루, 마당 삼은 구름. 지도 너머에 있다. 해도 없고, 해도 없다. 강 셋이 그래도 찾아온다.'
	),
	p(
		'One river comes up vermilion, from the living world. One comes up blue, from the dead. One comes up sage, from the flower field. They meet under the floor and do not mix.',
		'하나는 이승에서 올라오는 주홍빛이다. 하나는 저승에서 올라오는 푸른빛이다. 하나는 꽃밭에서 올라오는 쑥빛이다. 마루 밑에서 만나고, 섞이지는 않는다.'
	),
	{
		kind: 'place',
		place: 'realms_pavilion',
		html: 'Four posts, clouds for a yard, and very strict seating.',
		ko: '기둥 넷, 구름 마당, 그리고 아주 엄격한 자리 배치.'
	},
	{
		kind: 'diagram',
		diagram: 'pantheon',
		step: 'courts',
		title: 'The Three Realms · 삼계',
		caption: 'Hannim above; Living, Dead, and Western Flower Field below. Heaven is not a fourth peer realm.',
		ko: '한님이 위에 있고, 이승·저승·서천꽃밭이 아래에 있다. 하늘나라는 네 번째 계가 아니다.'
	},
	p(
		'Living, dead and western rows all fit if nobody stretches.',
		'이승과 저승과 서천 자리가 모두 들어간다. 아무도 다리를 뻗지 않는다면.'
	),

	{ kind: 'section', label: 'The Road', ko: '길' },
	{ kind: 'scene', label: 'The Blue Bank', ko: '푸른 언덕' },
	p(
		'Haewonmek is already on the blue bank. He does not look impressed.',
		'해원맥은 이미 푸른 언덕에 서 있다. 감동한 얼굴은 아니다.'
	),
	say('kangrim', ['처음이오.'], ['This is the first time.']),
	say('haewonmek', ['알아.', '강물은 마시지 마.'], ['I know.', 'Don’t drink the river.']),
	say('kangrim', ['어느 쪽이 우리 쪽이오.'], ['Which one is ours.']),
	say('haewonmek', ['파란 거. 저승 물.', '헷갈리지 마.'], ['The blue. Dead’s water.', 'Don’t mix them up.']),
	say('kangrim', ['붉은 쪽은.'], ['And the red.']),
	say('haewonmek', ['이승. 그 사람 거.'], ['Living. His.']),
	say('kangrim', ['누구.'], ['Whose.']),
	say(
		'haewonmek',
		['소별왕. 그게 이름이야.', '일은 이승임금이지. 일에는 절하지 마.'],
		['Little Star. That’s the name.', 'The job is Lord of the Living. Don’t bow to the job.']
	),
	say('kangrim', ['초록은.'], ['The green.']),
	say(
		'haewonmek',
		['꽃밭. 할락궁이.', '일은 꽃감관이야. 그 일은 좋아해.'],
		['Flower field. Hallakgungi.', 'The job is Gardener. He likes the job.']
	),
	p(
		'They walk the last spit of earth. The pavilion is empty. Before the principals sit — servants first.',
		'흙 끝으로 걸어간다. 정자는 비어 있다. 본존들이 앉기 전 — 시종들 먼저.'
	),
	say(
		'kangrim',
		['증기. 강. 산.', '흙에 있는 것들은 왜 안 걸어오오.'],
		['The steam. The river. The mountain.', 'Why isn’t anyone from the dirt walking.']
	),
	say('haewonmek', ['현지야. 남아.', '흙은 그 사람 일이지.'], ['Locals stay.', 'Dirt is his.']),
	say('kangrim', ['소별왕.'], ['Little Star’s.']),
	say(
		'haewonmek',
		['장부에 쓸 땐 이승임금.', '이름은 소별왕이야. 일도 이름도 둘 다 싫어해.'],
		['Lord of the Living, if you’re writing it down.', 'The name is Little Star. He hates the title almost as much as the work.']
	),
	say('kangrim', ['그럼 우리는.'], ['So we go up.']),
	say(
		'haewonmek',
		['이등은 먼저 떠들어.', '일등은 앉아.', '우리는 서.'],
		['Class two talks first.', 'Class one sits.', 'We stand.']
	),

	{ kind: 'section', label: 'Class II', ko: '이등' },
	{ kind: 'scene', label: 'The Rail', ko: '난간' },
	p(
		'The living river arrives louder. Gold silk, blue sky-silk, a red chima. The Three Realms under the Big Man Upstairs still gossip like any court.',
		'이승 강이 더 시끄럽게 도착한다. 금빛 비단, 하늘빛 비단, 붉은 치마. 위에 계신 어른 아래 삼계도, 여느 조정처럼 수다를 떤다.'
	),
	say('kangrim', ['금빛.'], ['The gold one.']),
	say('haewonmek', ['해. 해모수. 이등.', '기대지 않게 해.'], ['Sun. Haemosu. Class two.', 'Don’t let him lean on you.']),
	say('haemosu', ['아, 강림이…. 늘 그렇게 젊어 보이는군, 응?'], ['Ah, Kangrim…. Looking as young as ever, eh?']),
	say('kangrim', ['닥쳐, 해. 오늘 아침이 길었다.'], ['Shut it, sun. I’ve had a long morning.']),
	p(
		'Yumla comes up the blue behind them, already looking at his sleeves. He sees the red chima first.',
		'염라가 푸른 강으로 뒤따라 오른다. 벌써 소매만 보고 있다. 붉은 치마를 먼저 본다.'
	),
	say('yumla', ['ㅎ-헤이, 삼신…'], ['H-hey, Samsin.']),
	say('samsin', ['어머, 염라! 오랜만이네. 저승은 요즘 어때?'], ["Oh, long time no see, Yumla! How's the Underworld these days?"]),
	say('yumla', ['그… 알지. 죽은 사람들 천지야.'], ['Y-you know… full of dead people.']),
	say('kangrim', ['흰머리.'], ['The white hair.']),
	say('haewonmek', ['삼신. 낳는 일. 이등. 그것도 그 사람 밑.'], ['Samsin. Birth. Class two. Also his.']),
	say('kangrim', ['저 판관은.'], ['And the judge.']),
	say(
		'haewonmek',
		['염라. 우리 쪽 이등.', '대별왕이 앉으면 같이 앉아. 너는 아니야.'],
		['Yumla. Class two on our side.', 'He sits when Big Star sits. You don’t.']
	),
	p(
		'Then the midwife and the sun find the same rail. The rest of the pavilion develops a sudden, devout interest in clouds.',
		'그러고 산파와 태양이 같은 난간을 찾는다. 정자의 나머지는 갑자기, 경건하게, 구름에 관심이 생긴다.'
	),
	say(
		'samsin',
		['야, 해모수.', '염라 얼굴 봤어? 보랏빛으로 타더라.', '치마 조금만 올렸는데.'],
		['Hey, Haemosu.', 'Did you see Yumla’s face? Went straight purple.', 'And I barely hiked the skirt.']
	),
	{
		...say(
			'haemosu',
			['조금? 수레에서도 느껴지던데.', '이 정자에서 우리보다 배고픈 애 있어? 하나라도.'],
			['Barely? I felt that from the chariot.', 'Anyone in this pavilion hungrier than us? Name one.']
		),
		nsfw: true
	},
	{
		...say(
			'samsin',
			[
				'이비가? 날씨로 튕기지.',
				'강림이는 공책만 보고. 염라는 내가 숨만 쉬어도 보라색.',
				'우리 둘만 진짜로 더운 거야.',
				'남자든 뭐든 — 너랑은 이런 수다 가능해서 좋아.'
			],
			[
				'Ibiga? He flirts with weather.',
				'Kangrim stares at his notebook. Yumla goes purple if I breathe.',
				'We’re the only ones actually hot in here.',
				'Man or not — I like that I can gossip like this with you.'
			]
		),
		nsfw: true
	},
	p(
		'Ibiga is already on the rail, looking at a cloud as if it had insulted him. He does not come over.',
		'이비가는 이미 난간에 있다. 구름이 자신을 모욕한 것처럼 보고 있다. 건너오지는 않는다.'
	),
	say(
		'kangrim',
		['…명부에 적을 말이 없다.', '없는 게 맞다.'],
		['…Nothing for the ledger.', 'And that’s correct.']
	),

	{ kind: 'section', label: 'Class I', ko: '일등' },
	{ kind: 'scene', label: 'The Lintel', ko: '처마' },
	p(
		'The sage river is last, and quiet. Then the principals duck the lintel — Hallakgungi alone, up the sage, Big Star with his dark court, Little Star with sky and sun and birth.',
		'쑥빛 강이 마지막이고, 조용하다. 그러고 본존들이 처마를 숙여 들어온다 — 할락궁이는 혼자, 쑥빛으로. 대별왕은 어두운 조정과 함께. 소별왕은 하늘과 태양과 출산과 함께.'
	),
	say('kangrim', ['저 아이.'], ['The boy.']),
	say(
		'haewonmek',
		['할락궁이.', '꽃감관이라 부르지 마. 지가 먼저 말하기 전엔.'],
		['Hallakgungi.', 'Don’t call him gardener unless he does.']
	),
	say('kangrim', ['검은 비단.'], ['The black silk.']),
	say(
		'haewonmek',
		['대별왕.', '길에서는 저승임금. 이 방에선 대별왕.'],
		['Big Star.', 'Lord of the Dead when you’re on a road. Big Star when you’re in this room.']
	),
	say('kangrim', ['흰 쪽은.'], ['And the white.']),
	say('haewonmek', ['소별왕. 아까 말했잖아.', '앉아. 아니, 우리는 서.'], ['Little Star. I said.', 'Sit. No. We stand.']),
	p(
		'The pavilion was not built for three sovereignties. They sit anyway.',
		'그 정자는 세 주권을 위해 지어진 것이 아니다. 그래도 앉는다.'
	),
	p(
		'Hallakgungi takes the western mat, legs folded, already smiling. Big Star ducks because he has to. Little Star is already talking before his knees hit.',
		'할락궁이는 서쪽 자리에 앉는다. 다리 접고, 벌써 웃고. 대별왕은 숙여야 해서 숙인다. 소별왕은 무릎이 닿기도 전에 말을 시작한다.'
	),
	say(
		'sara',
		[
			'야, 소별왕… 위에 계신 어른이 아들 하나 이승으로 내려보냈다며?',
			'그 애 어떻게 됐냐?'
		],
		[
			'Hey Little Star… didn’t the Big Man Upstairs send his son down to the mortal domain a while back?',
			'Whatever happened to him?'
		]
	),
	say(
		'sobyeol',
		[
			'그 얘기가 나와서 말인데…',
			'이승에서 큰일이 벌어지고 있어.',
			'단군이 세운 나라를 다시 하나로 모으겠다는 소리가, 사람들 입에서 나오기 시작했어.'
		],
		[
			'Speaking of which…',
			'Big things are happening in the mortal realm.',
			"The mortals are starting to speak of reunifying Dangun's kingdom."
		]
	),
	say('daebyeol', ['…'], ['…']),
	say(
		'sara',
		[
			'저승 형은 또 조용하시네.',
			'꽃밭에선 부활이랑 멸망이 같은 이랑에 자라. 통일도 아마 비슷할걸.'
		],
		[
			'Elder brother of the dead goes quiet again.',
			'In my field, resurrection and ruin grow in the same rows. Reunification probably does too.'
		]
	),
	p(
		'Kangrim is still standing. Haewonmek does not look at him. That is the lesson.',
		'강림은 아직 서 있다. 해원맥은 그를 보지 않는다. 그게 수업이다.'
	),

	{ kind: 'section', label: 'The Question', ko: '질문' },
	{ kind: 'scene', label: 'A Swept Yard', ko: '쓸어 놓은 마당' },
	p(
		'Kangrim has not sat down. This morning he collected a woman and two children from a swept yard in Baekje. The girl asked if her father was coming too. Kangrim does not lie, so he said, “Later.” He has been thinking about the flower field ever since.',
		'강림은 아직 앉지 않았다. 오늘 아침 그는 백제의 쓸어 놓은 마당에서 여인 하나와 아이 둘을 거두었다. 계집아이가 아버지도 오느냐고 물었다. 강림은 거짓말을 하지 않는다. 그래서 “나중에.”라고 했다. 그 뒤로 내내 꽃밭 생각을 하고 있다.'
	),
	say('kangrim', ['나리.'], ['Sir.']),
	say('sara', ['응?'], ['Yes?']),
	say(
		'kangrim',
		['늘 궁금했습니다… 나리 밭에는 어떤 꽃들이 핍니까?'],
		["I've always been curious… what sorts of flowers grow in your fields?"]
	),
	say(
		'sara',
		[
			'하하… 뭐, 새 피를 돋우는 꽃, 새 살을 키우는 꽃, 새 뼈를 기르는 꽃…',
			'솔직히 이젠 다 기억도 안 나.',
			'왜 묻냐?'
		],
		[
			'Haha… well, there are those that regenerate new blood, grow new skin, grow new bones…',
			"To be honest, I can't even keep track of all of them anymore.",
			'Why do you ask?'
		]
	),
	quote,
	say(
		'kangrim',
		['그냥 궁금해서요… 그 꽃들을 한꺼번에 쓰면…', '죽은 사람을… 살리는 게 가능합니까?'],
		[
			'I was just curious… using all of these flowers at once…',
			'Is it… is it possible to resurrect a dead person?'
		]
	),
	p('Hallakgungi’s face hardens.', '할락궁이의 얼굴이 굳는다.'),
	say(
		'sara',
		['저승차사 강림. 무슨 질문이냐.', '나한테 할 말 있나?'],
		['Grim Reaper Kangrim. What is this line of questioning?', 'Do you have something you need to tell me?']
	),
	say('kangrim', ['아닙니다, 나리. 그저—'], ['No, sir. I was—']),
	say(
		'sara',
		[
			'질문에 답을 하자면. 가능하다.',
			'내가 해 봤다… 단 한 사람뿐.',
			'그러나 나는 인간 일에 끼어들지 않는다.'
		],
		[
			'Well, to answer your question. It is possible.',
			"I've done it… only for one person.",
			'But I do not get involved in mortal affairs.'
		]
	),
	say(
		'kangrim',
		['단 한 사람.', '…그 한 사람은 누가 정합니까?'],
		['Only one.', '…And who decides which one?']
	),
	say(
		'sara',
		[
			'내가. 기꺼이. 그리고 이미 정했지.',
			'꽃밭 규칙이야, 저승차사. 사람 하나 위해 꽃을 꺾으면 그 줄이 통째로 시들어. 앉아.'
		],
		[
			'I do. Cheerfully. And I already have.',
			'Rule of the field, reaper: pick a flower for one mortal and the whole row wilts. Sit down.'
		]
	),
	p(
		'Kangrim sits down at the end of the dead’s row. He opens his ledger to a page headed Yellow Mountain, and does not like how long it is.',
		'강림은 저승 줄 맨 끝에 앉는다. 장부를 펼치니 황산벌이라 적힌 쪽이 나온다. 그 길이가 마음에 들지 않는다.'
	),
	say('haewonmek', ['봐. 앉으래면 앉아.'], ['See. When they say sit, you sit.']),
	say(
		'sobyeol',
		[
			'이승은 내가 속여서 맡은 자리야.',
			'사람들이 서로 베는 것도… 내 작은 법이지.',
			'그래도 — 단군을 다시 부르면, 위에 계신 어른이 웃을까, 한숨을 쉴까.'
		],
		[
			'I cheated for the living world.',
			'Them cutting each other… that is my small law too.',
			'Still — when they call Dangun’s name again, does the Big Man Upstairs laugh, or sigh?'
		]
	),
	say(
		'daebyeol',
		['회의를 시작하자.', '산 자들의 이야기는… 안건 맨 마지막이다.'],
		['Let the meeting begin.', 'Business of the living… last item on the agenda.']
	),
	p(
		'<b>The minutes of that meeting never leave Heaven’s table. Down below, five thousand men are counting fifty thousand…!</b>',
		'<b>그 회의록은 하늘의 탁자를 떠나지 않는다. 저 아래에서는 오천이 오만을 세고 있다…!</b>'
	)
];

save();
console.log('Three Realms blocks', e.blocks.length);
