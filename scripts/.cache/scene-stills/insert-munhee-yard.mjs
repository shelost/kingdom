import { editStory, makeInserter } from '../story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const d = (person, lines, en) => ({ kind: 'dialogue', ...(person ? { person } : {}), lines, en });

const well = [
	scene('The circle · the third week', '둘레 · 셋째 주'),
	p(
		'They play a game the yard calls the well. One boy stands in the middle. The ring shoves until he falls. Whoever lasts longest eats first. For a week, every evening, the ghost goes in. He lasts about as long as his name.',
		'연무장은 그 놀이를 우물이라고 부른다. 한 명이 가운데 선다. 둘레가 밀어 넘어뜨린다. 제일 오래 선 놈이 먼저 먹는다. 일주일 동안 저녁마다 귀신이 들어간다. 이름이 끝나는 만큼만 선다.'
	),
	d(null, ['귀신아.', '오래 서 봐.'], ['Ghost.', 'Stay up.']),
	d('chunchu', ['서는 건 쉬운데.', '미는 쪽이 여덟이야.'], ['Standing’s easy.', 'There are eight of you pushing.']),
	p(
		'He is on his back before the sentence ends. On the way past, a sandal finds the poem folded in his sleeve. He picks it up. He smooths it. He does not look up to see whose sandal.',
		'문장이 끝나기도 전에 그는 등을 대고 있다. 지나가는 샌들 하나가 소매에 접어 둔 시를 밟는다. 그는 집어 든다. 펴서 문지른다. 누구 샌들인지 보려고 고개를 들지는 않는다.'
	)
];

const polo = [
	scene('The gyuku field · the next fifth day', '격구장 · 다음 닷새째'),
	p(
		'Gyuku is a stick, a ball, and eight horses who have already decided you are in the way. Chunchu has never sat a horse that wanted to be somewhere else. Yushin scores before Chunchu has found which end is his.',
		'격구는 막대기와 공, 그리고 이미 네가 방해라고 정한 말 여덟이다. 춘추는 다른 데로 가고 싶은 말에 앉아 본 적이 없다. 춘추가 어느 쪽이 자기 쪽인지 찾기 전에 유신이 점수를 낸다.'
	),
	d('yushin', ['저쪽.'], ['That end.']),
	d('chunchu', ['알고 있습니다, 선배님.', '말이 모릅니다.'], ['I know, sir.', 'The horse doesn’t.']),
	p(
		'He falls twice. The second time he stays down long enough to watch how Yushin turns. Not the horse. The other rider’s eyes. On the third run he does not chase the ball. He rides at the boy about to pass it, and says, very politely, that the boy’s girth is loose. The boy looks down. The ball is gone. Yushin has it, and a look that is not quite anger.',
		'그는 두 번 떨어진다. 두 번째는 누워 있는 김에 유신이 어떻게 도는지 본다. 말이 아니다. 상대의 눈이다. 세 번째에는 공을 쫓지 않는다. 곧 패스할 소년 쪽으로 말을 몰며, 아주 공손하게, 뱃대가 풀렸다고 말한다. 소년이 내려다본다. 공은 없다. 유신 손에 있다. 유신의 얼굴은 화가 아닌 것도 같다.'
	),
	d('yushin', ['고삐는 멀쩡했다.'], ['The girth was fine.']),
	d('chunchu', ['맞아요.', '근데 봤잖아요.'], ['It was.', 'He looked, though.']),
	d('yushin', ['…봤지.'], ['…He did.']),
	p(
		'They play until the light goes. Yushin wins. Chunchu keeps the fouls in his head the way other boys keep the score, and on the way in he is talking, and Yushin is answering. The yard has not heard that much out of the General in a month. After that it is every fifth day. The horses learn Chunchu’s name before the class does.',
		'빛이 질 때까지 한다. 유신이 이긴다. 춘추는 다른 소년들이 점수를 세듯 반칙을 머리에 담아 두고, 들어오는 길에도 말하고, 유신은 받아 준다. 연무장이 한 달 동안 장군에게서 그렇게 많은 말을 들은 적이 없다. 그 뒤로 닷새마다다. 오십구기보다 말이 먼저 춘추의 이름을 익힌다.'
	)
];

const games = [
	scene('The yard · the games', '연무장 · 놀이'),
	p(
		'The Marshal still will not let him hold a spear for long. The class will. They want to see the goblin lose.',
		'도감은 아직도 그에게 창을 오래 쥐게 하지 않는다. 기는 쥐게 한다. 도깨비가 지는 걸 보고 싶어서다.'
	),
	p(
		'Archery first. The bow is too heavy, and everybody knows it, including him. The range sits in a cut of wind off the pond. The strong boys loose into it and curse the berm. He waits for the lull, and he looses sitting down, which is against the rule and also against his shoulder. Three arrows. The straw man’s throat, twice, and the knot of its belt.',
		'먼저 활이다. 활이 너무 무겁다. 그를 포함해 모두가 안다. 사정은 못에서 갈라져 나오는 바람 속에 있다. 힘 있는 소년들은 그 바람에 쏘고 둔덕을 욕한다. 그는 바람이 죽는 때를 기다렸다가, 앉아서 쏜다. 규칙에도 어긋나고 어깨에도 어긋난다. 화살 셋. 짚 인형의 목, 두 번, 그리고 띠 매듭.'
	),
	d(null, ['앉아 쏘면 무효다.'], ['Sitting doesn’t count.']),
	d('chunchu', ['적도 앉아 있습니까, 도감님?'], ['Do the enemy sit, sir?']),
	p(
		'The Marshal says it again, louder. The straw man does not appeal. That night they put him back in the well. Eight boys. One ghost. He does not plant his feet. He tells each of the two biggest, quietly, that the other has promised to let him fall. They grab each other. The ring forgets him. He is still standing when the supper bell goes, brushing dust off a sleeve, and the boy who stepped on his poem is the one who laughs first.',
		'도감이 더 크게 한 번 더 말한다. 짚 인형은 항소하지 않는다. 그날 밤 그를 다시 우물에 넣는다. 소년 여덟. 귀신 하나. 그는 발을 박지 않는다. 제일 큰 둘에게, 작게, 상대가 자기를 넘어뜨리게 두겠다고 약속했다고 말한다. 둘이 서로를 붙잡는다. 둘레는 그를 잊는다. 저녁 종이 울릴 때까지 그는 서 있다. 소매의 먼지를 털면서. 그의 시를 밟았던 소년이 제일 먼저 웃는다.'
	),
	d(null, ['…귀신 새끼.'], ['…Ghost.']),
	d('chunchu', ['밥 먼저 먹어도 되지?'], ['So I eat first?']),
	p(
		'Sword drill is worse for everyone else. He cannot stop a cut. He can name it. Left. High. Your foot. The boy across from him starts listening, which is how you lose a drill, and by the end of the month half the pairs want the ghost calling theirs. The Marshal calls it cheating. The pairs call it useful.',
		'칼 훈련은 다른 사람들에게 더 나쁘다. 그는 베기를 막지 못한다. 이름을 붙일 수는 있다. 왼쪽. 위. 발. 맞은편 소년이 듣기 시작한다. 훈련을 지는 방법이 그것이다. 달이 끝날 때쯤 짝의 절반이 귀신에게 자기 것을 불러 달라고 한다. 도감은 속임수라 한다. 짝들은 쓸모 있다고 한다.'
	)
];

const wall = [
	scene('The long wall · that spring', '긴 벽 · 그해 봄'),
	p(
		'The Hwarang hall has a wall nobody is allowed to lean on. It runs the length of the yard under its own little roof, and it is painted from end to end with boys the country has already decided to remember. Class 59 has never asked for a panel. In the spring, they ask.',
		'화랑 전각에는 기대는 것이 금지된 벽이 있다. 연무장 길이만큼 이어지고, 제 지붕을 이고, 나라가 이미 기억하기로 한 소년들로 끝에서 끝까지 그려져 있다. 오십구기는 한 번도 한 칸을 청한 적이 없다. 봄에, 청한다.'
	),
	p(
		'The painter wants a battle. They don’t have one. They have a millstone, a tally, a verse, and a thin boy in magenta who keeps winning things he is not built to win. The painter sighs and paints that. Practice swords in a ring on the ground. One boy on the stone in the middle, lip split, smiling as if he has already heard the joke. The boys who threw his shoes in the pond hold the lamp.',
		'화공은 전투를 원한다. 전투는 없다. 맷돌이 있고, 장부가 있고, 시가 있고, 제 몸으로 이길 수 없는 것들을 계속 이기는 자홍빛 옷의 마른 소년이 있다. 화공이 한숨을 쉬고 그걸 그린다. 연습용 목검이 땅 위에 둘레를 이룬다. 가운데 돌 위에 소년 하나, 입술은 터졌고, 농담을 이미 들은 사람처럼 웃는다. 그의 신발을 못에 던지던 소년들이 등을 든다.'
	),
	p(
		'Chunchu comes late. He stands where he can see it and not be in it. Yushin is already there, arms folded, reading the wall the way he reads a line of men.',
		'춘추는 늦게 온다. 보이되 들어가지 않는 자리에 선다. 유신은 이미 거기 있다. 팔짱을 낀 채, 진열을 읽듯 벽을 읽고 있다.'
	),
	d('yushin', ['네가 청한 게 아니구나.'], ['You didn’t ask for this.']),
	d(
		'chunchu',
		['청하면 안 그려 주더라고요, 선배님.', '그래서 청하지 않았습니다.'],
		['If you ask, they won’t paint you, sir.', 'So I didn’t ask.']
	),
	d('yushin', ['…영리하군.'], ['…Clever.']),
	d('chunchu', ['도감님 말씀으로는 겁쟁이의 칼입니다.'], ['The Marshal says clever is a coward’s sword.']),
	d('yushin', ['도감은 벽에 안 올라.'], ['The Marshal isn’t on the wall.']),
	p(
		'He does not say he is proud. He stands there until the paint is too dark to add anything, which from him is the same thing. Years from now the bright panel by the gate will be a different afternoon. This is the one under it. This is the first time they let a painter start.',
		'그는 자랑스럽다고 말하지 않는다. 덧그릴 수 없을 만큼 어두워질 때까지 거기 서 있다. 그에게 그건 같은 말이다. 몇 해 뒤 문 옆의 밝은 칸은 다른 오후가 될 것이다. 이건 그 아래 칸이다. 화공에게 시작하라고 한 것은 이번이 처음이다.'
	)
];

editStory((story) => {
	const entry = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Munhee');
	const insert = makeInserter(entry);
	const jobs = [
		['nobody can work out why it isn’t working.', well],
		['아니. 아주 잘했네. 그러니까 하지 말라는 거야.', polo],
		['boys will forgive almost anything for rice.', games],
		['The number has gone up.', wall]
	];
	for (const [anchor, blocks] of jobs) {
		const ok = insert(anchor, blocks);
		if (ok !== true) throw new Error('anchor ' + ok + ' ' + anchor);
		console.log('inserted', blocks.length, 'after', anchor.slice(0, 40));
	}
});
