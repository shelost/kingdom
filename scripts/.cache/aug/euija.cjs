// Prince Euija as a self-contained story: the lazy prince, the clans' yard, the diving
// boy with no name, the stolen crown and the deer, and a name read out on the sand.
// Moves Mu's "learn their names" exchange (and its stills) here from Eight Great Clans,
// and bridges that episode's tournament to the same day.
// node scripts/.cache/aug/euija.cjs [--dry]
const { ep, log, insertAfter, remove, finish } = require('./lib.cjs');

const T = 'Prince Euija';
const E8 = 'Eight Great Clans';
const say = (person, en, ko, extra = {}) => ({ kind: 'dialogue', person, en, lines: ko, ...extra });
const crowd = (en, ko) => ({ kind: 'dialogue', chip: '#8a8a94', speaker: '🗣', en, lines: ko });
const father = (en, ko) => ({ kind: 'dialogue', chip: '#a39a88', speaker: '👨', gender: 'm', en, lines: ko });
const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });

const e = ep(T);
const B = e.blocks.slice();
const text = (b) => [b.html, ...(b.en ?? [])].filter(Boolean).join(' ');
/** The original block whose English starts with `start`, so a moved line keeps its stills. */
const old = (start, from = B) => {
	const b = from.find((x) => text(x).startsWith(start) || x.title === start);
	if (!b) throw new Error(`no block “${start}”`);
	return b;
};

// The Mu–Euija exchange and its stills come over from Eight Great Clans.
const e8 = ep(E8);
const muCite = remove(E8, (b) => b.kind === 'cite' && /King Mu \(71\)/.test(b.html));
const muGreet = remove(E8, (b) => b.kind === 'dialogue' && b.person === 'kingmu' && /Lord Yunbi… an honour to/.test(b.en.join(' ')));
const euijaNoInterest = remove(E8, (b) => b.kind === 'dialogue' && b.person === 'euija' && /no interest in these clan quarrels/.test(b.en.join(' ')));
const muNames = remove(E8, (b) => b.kind === 'dialogue' && b.person === 'kingmu' && /learn their names anyway/.test(b.en.join(' ')));
const movedStills = ['king-mu', 'clan-yunbi', 'rel-mu-euija'];
for (const id of movedStills) {
	const i = e8.images.findIndex((x) => x.id === id);
	if (i < 0) throw new Error(`no still ${id}`);
	e.images.push(...e8.images.splice(i, 1));
}
log.push(`  stills ${movedStills.join(', ')} → ${T}`);

const opening = {
	...old('Thirty-two is late'),
	html: 'In five days, Prince Euija becomes Crown Prince Euija. Thirty-two is late for it. By the time his father gets around to it, Euija has more than fifteen sons, and the clans have had years to decide which ones they own.',
	ko: '닷새 뒤, 의자왕자는 의자태자가 된다. 서른둘이면 늦다. 아버지가 겨우 결심했을 때, 의자에겐 이미 아들이 열다섯 넘게 있다. 가문들은 그중 누구를 제 것으로 할지 정할 시간이 넉넉했다.'
};

const nameEn = ['Now you’ll need a name as well.', 'Gye, for Utmost. Bek, for Nobility.', 'How about — “Gyebek”?', 'Gyebek… a name only for men of the utmost nobility.'];
const nameKo = ['이제 이름도 있어야겠지.', '계는 지극함이요, 백은 고귀함이라.', '“계백”. 어떠냐?', '계백… 지극히 고귀한 사내에게만 어울리는 이름이지.'];

const EN = {
	father: ['Run away… forget me, forget all of this!', 'Your name too. Forget it. The name is what they are hunting.'],
	jinmo: ['Do you know who my father is, you little peasant twat?'],
	idiot: 'Hey, look at that idiot! Jumping into the freezing river, haha!',
	why: 'Why do you do all of this?',
	purpose: 'Gyebek, would you like to serve a higher purpose?'
};
const KO = {
	father: ['도망쳐라… 나를 잊어라, 이 모든 걸 잊어!', '이름도. 잊어버려. 저놈들이 쫓는 건 이름이다.'],
	jinmo: ['우리 아버지가 누군지 알아, 이 천한 놈아?'],
	idiot: '야, 저 바보 좀 봐! 그 차가운 강에 뛰어드네, 하하!',
	why: '왜 이런 짓을 하는 게냐?',
	purpose: '계백, 더 큰 뜻을 섬겨 보겠느냐?'
};

const noName = old('No name');
const purge = {
	...noName,
	blocks: [
		noName.blocks[0],
		p(
			'Men come over the wall with torches and a list. Every name on the list is his family’s.',
			'횃불과 명단을 든 사내들이 담을 넘어온다. 명단의 이름은 모두 그의 집안 사람들이다.'
		),
		father(EN.father, KO.father),
		noName.blocks[1],
		p(
			'They hunt him for a season. He learns which ditches drain and which porters don’t ask questions.',
			'그들은 한 철 내내 그를 쫓는다. 그는 어느 도랑이 물이 빠지는지, 어느 짐꾼이 묻지 않는지 배운다.'
		),
		noName.blocks[2]
	]
};

e.blocks = [
	opening,
	old('', B.filter((b) => b.kind === 'map')),
	B.find((b) => b.kind === 'card' && b.person === 'euija'),
	old('…Fifteen?'),
	old('His Majesty has over fifty'),
	old('This is said admiringly'),
	old('In Sabi the clans read the stars'),
	B.find((b) => b.kind === 'place' && /The king lives here/.test(b.html)),

	scene('The Rear Garden', '후원'),
	p(
		'At mid-morning the prince is in the rear garden with a bow, a go board, a jar of wine and two court ladies, and he is winning at all four.',
		'한낮이 되기 전, 왕자는 후원에 있다. 활 하나, 바둑판 하나, 술 한 동이, 궁녀 둘. 넷 다 이기고 있다.'
	),
	p('The arrow goes in without his looking. He is already reaching for a stone.', '화살은 그가 보지도 않는 사이 과녁에 박힌다. 그는 벌써 바둑돌로 손을 뻗고 있다.'),
	old('Prince Euija (32)'),
	say(
		'euija',
		['Your move.', 'And if you shift my stone while I’m drinking, do it better than last time. If I’m going to be fooled, I want it done properly.'],
		['네 차례다.', '내가 마시는 동안 내 돌을 옮길 거면, 지난번보다 잘해라. 속을 거면 제대로 속고 싶구나.']
	),
	say('courtmaid', ['Your Highness moved it yourself, Your Highness.', 'Twice.'], ['왕자마마께서 직접 옮기셨잖아요.', '두 번이나요.']),
	muCite,
	say(
		'kingmu',
		['Up, boy.', 'The houses are showing off their wrestlers in the yard, and the man they’re wrestling for is busy with a jar.'],
		['일어나라, 이놈아.', '가문들이 마당에서 씨름꾼을 내보이는 날인데, 그 씨름의 주인 되실 분은 술독이랑 바쁘시구나.']
	),
	say('euija', ['I’m practising, Father. A crown prince should hit what he aims at.'], ['연습 중입니다, 아바마마. 태자란 겨냥한 걸 맞혀야지요.']),
	say(
		'kingmu',
		[
			'Then aim at the hall.',
			'You had the Analects by heart at seven. You beat my ministers at go at twelve.',
			'And you’ve spent twenty years making sure nobody asks you to do either again.'
		],
		['그럼 정전을 겨냥해라.', '일곱 살에 논어를 다 외웠지. 열두 살에 내 대신들을 바둑으로 이겼고.', '그 뒤 스무 해는 아무도 다시 시키지 못하게 하는 데 썼고.']
	),
	say(
		'euija',
		['Cleverness is an ox, Father.', 'Let the village see it, and by morning someone’s hitched it to his plough.'],
		['재주란 소 같은 겁니다, 아바마마.', '마을에 보여 주면, 아침이면 누가 제 쟁기에 매어 놓지요.']
	),
	say('kingmu', ['Today they hitch it.', 'Come.'], ['오늘 맨다.', '따라와라.']),

	scene('The Yard', '마당'),
	p(
		'On a crown prince’s day each of the eight houses puts a boy on the sand, and the crown prince puts one too. Five days early, the houses bring their boys to the palace yard to be looked at, the way you bring a horse to market. Eight boys in white. The ninth place is empty.',
		'태자 책봉 날이면 여덟 가문이 저마다 사내아이 하나를 모래판에 올리고, 태자도 하나를 올린다. 닷새 앞서 가문들은 제 아이들을 궁 마당에 데려와 보인다. 장에 말을 끌고 나오듯. 흰옷 입은 아이 여덟. 아홉째 자리는 비어 있다.'
	),
	say('kingmu', ['Your man for the sand.', 'Pick a son. Yung’s big enough to fall on somebody.'], ['모래판에 올릴 놈.', '아들 중에 골라라. 융이는 누구 위에 넘어질 만큼은 크다.']),
	old('The young princes grow up already spoken for'),
	say(
		'euija',
		['Yung wears a Satek ring. Hyo has a Yunbi tutor.', 'If I put a son on the sand, I’m only telling the yard which house I’ve lost to.'],
		['융이는 사택 반지를 끼고, 효는 연비 스승이 붙었습니다.', '아들을 올리면, 제가 어느 집에 졌는지 마당에 알려 주는 셈이지요.']
	),
	say(
		'kingmu',
		['Then find someone who isn’t anybody’s.', 'Five days. After that I pick for you, and you’ll hate who I pick.'],
		['그럼 누구 것도 아닌 놈을 찾아라.', '닷새 준다. 그다음엔 내가 고른다. 내가 고르면 넌 싫어할 게다.']
	),
	p('Two old men reach the prince before the king has finished speaking.', '임금의 말이 끝나기도 전에 노인 둘이 왕자에게 다가온다.'),
	muGreet,
	say(
		'eldersatek',
		['Your Highness. The whole river says it already.', 'Filial to his father, kind to his brothers. The Zengzi of the East of the Sea, they call you.'],
		['왕자마마. 온 강이 벌써 그리 말하옵니다.', '어버이께 효를 다하고 형제와 우애하시니, 해동증자라 부른다지요.']
	),
	say('elderyunbi', ['We said it first, on the coast road.', 'Satek heard it from us.'], ['저희가 먼저 했소. 해안 길에서.', '사택은 우리한테서 들은 거요.']),
	say('eldersatek', ['Satek hears everything from Yunbi.', 'Usually through a floorboard.'], ['사택은 연비 말을 다 듣소.', '대개 마룻바닥 너머로.']),
	B.find((b) => b.kind === 'quote' && /Zengzi of the East of the Sea/.test(b.html)),
	p(
		'The Zengzi of the East of the Sea was cheating at go an hour ago. He smiles at both of them like a man being sold his own horse.',
		'해동증자께서는 한 시진 전에 바둑에서 속임수를 쓰고 계셨다. 그는 두 노인에게 제 말을 사라고 권받는 사람처럼 웃는다.'
	),
	euijaNoInterest,
	muNames,
	say(
		'kingmu',
		[
			'You think I like them? I’ve buried three Satek elders, and I’d dance at a fourth.',
			'But a king rules the country he has, boy. Not the one he wants.',
			'Eight houses. Fifteen sons, sixteen by spring the way you carry on. Every son is a door some house will try to walk through.',
			'You’ll be father to the sons, and king to the doors.'
		],
		[
			'내가 저것들을 좋아하는 줄 아느냐? 사택 원로를 셋 묻었다. 넷째 장례엔 춤이라도 출 게다.',
			'허나 임금은 가진 나라를 다스리는 게다, 이놈아. 갖고 싶은 나라가 아니라.',
			'여덟 가문. 아들 열다섯. 네 하는 꼴을 보니 봄이면 열여섯이겠구나. 아들 하나하나가 어느 집이 밀고 들어올 문이다.',
			'넌 아들들한텐 아비가 되고, 문들한텐 임금이 되어야 한다.'
		]
	),
	say('euija', ['Sixteen is unkind, Father.', 'The lady from the Hae house says it’s twins.'], ['열여섯은 너무하십니다, 아바마마.', '해씨 댁 마님 말로는 쌍둥이랍니다.']),
	say('kingmu', ['…Gods help the Hae.'], ['…해씨 집안에 신의 가호를.']),

	scene('The White River', '백마강'),
	{
		...old('Euija sneaks out of the palace'),
		html: 'That night Euija sneaks out of the palace in a stable boy’s coat. He tells himself it is to explore the life of the common people. Mostly it is to avoid a list with an empty ninth line.',
		ko: '그날 밤 의자는 마구간지기 옷을 입고 궁을 몰래 빠져나간다. 백성의 삶을 살펴보려는 거라고 스스로 말한다. 사실은 아홉째 줄이 빈 명단을 피하려는 것이다.'
	},
	old('It is the <b>White River</b>'),
	B.find((b) => b.kind === 'place' && /Wide, slow/.test(b.html)),
	p(
		'On the landing a Jinmo boy is ordering four porters around a great gilt-bronze incense burner, wrapped in silk for the crown prince’s day. It is as tall as a child. There are mountains on the lid, and musicians, and a phoenix on top.',
		'선착장에서 진모 집 도령 하나가 짐꾼 넷을 부려 금동 대향로를 옮기고 있다. 태자 책봉 날에 올릴 것이라 비단에 싸여 있다. 아이 키만 하다. 뚜껑엔 산이 겹겹이고, 악사들이 있고, 꼭대기엔 봉황이 앉았다.'
	),
	p(
		'A barefoot boy with a basket of eels comes round the stack at a run. The Jinmo boy steps back into him. The burner goes over the rail. It does not float.',
		'장어 바구니를 든 맨발의 아이가 짐 더미를 돌아 뛰어온다. 진모 도령이 뒷걸음질 치다 그 아이와 부딪친다. 향로가 난간 너머로 넘어간다. 뜨지 않는다.'
	),
	say(
		'jinmoboy',
		['Do you know what that WAS?', 'My grandfather had it cast. It’s for the crown prince. It’s for the YARD—'],
		['너 저게 뭔지 알아?', '우리 할아버지가 부어 만드신 거야. 태자 저하께 올릴 거라고. 마당에 내놓을 거라고—']
	),
	say('jinmoboy', EN.jinmo, KO.jinmo),
	say('gyebek', ['No.'], ['모릅니다.']),
	say(
		'jinmoboy',
		['Jinmo. JINMO.', 'My father sits on the rock. I can have you thrown in after it, and nobody will even write it down.'],
		['진모. 진모라고.', '우리 아버지는 정사암에 앉으셔. 너 같은 건 저 뒤에 던져 넣어도, 아무도 적어 두지도 않아.']
	),
	p(
		'Nobody on the landing moves. The porters look at their feet. In Sabi a clan boy can say that sentence and mean it, and everyone on the landing knows the price of an eel boy to the nearest coin.',
		'선착장 위의 누구도 움직이지 않는다. 짐꾼들은 제 발만 본다. 사비에서는 가문 집 아이가 그런 말을 하고 진심일 수 있고, 선착장의 모두가 장어 파는 아이 값을 동전 한 닢까지 안다.'
	),
	say('gyebek', ['I will get it back.'], ['되찾아 오겠습니다.']),
	say(
		'jinmoboy',
		['…You?', 'Fine. Five days. If it isn’t on my doorstep in five days, I’ll have you killed in front of the whole street.'],
		['…네가?', '좋아. 닷새. 닷새 안에 우리 집 문 앞에 안 갖다 놓으면, 온 거리 앞에서 죽여 버릴 거야.']
	),
	say('gyebek', ['Five days.'], ['닷새. 알겠습니다.']),

	scene('The Diving Boy', '물에 드는 아이'),
	p(
		'There is an old willow on the bank with a rock wedged in its roots. Gyebek ties one end of a rope round the rock and the other round his ankle, so the river cannot keep him. Then he goes in.',
		'강둑에 늙은 버드나무가 있고, 그 뿌리 사이에 바위 하나가 박혀 있다. 계백은 밧줄 한쪽 끝을 바위에, 다른 끝을 제 발목에 묶는다. 강이 저를 데려가지 못하게. 그러고는 들어간다.'
	),
	old('The boy is going back into the water'),
	crowd(
		['That’s the eel boy. He’s been going in since dawn.', 'For the Jinmo burner? That’s in the mud with the catfish by now.', EN.idiot, 'Give him a day. The river’s patient.'],
		['저거 장어 파는 애잖아. 새벽부터 들어가고 있어.', '진모네 향로 건지려고? 그거 벌써 메기들이랑 뻘 속에 있지.', KO.idiot, '하루만 기다려 봐. 강은 급할 게 없어.']
	),
	p(
		'On the second day a young man in a stable boy’s coat stops at the back of the crowd. He stays longer than he means to.',
		'둘째 날, 마구간지기 옷을 입은 젊은 사내가 구경꾼들 맨 뒤에 멈춰 선다. 생각보다 오래 서 있는다.'
	),
	p(
		'In the palace, the crown prince-to-be has been missing for two days. King Mu has the city turned over, and says several things about his son that the herald is asked not to repeat.',
		'궁에서는 태자 될 사람이 이틀째 보이지 않는다. 무왕은 성안을 뒤집으라 명하고, 아들에 대해 몇 마디를 하는데, 전령은 그 말을 옮기지 말라는 당부를 받는다.'
	),
	say('kingmu', ['Start with the wine houses.', 'Then the other houses.'], ['술집부터 뒤져라.', '그다음엔 다른 집들도.']),
	p(
		'Gyebek does not eat. Nobody sees him sleep. Three days. Each time he comes up, the rock in the willow roots has shifted a finger’s width, and he reties the knot and goes back down.',
		'계백은 먹지 않는다. 자는 걸 본 사람도 없다. 사흘. 올라올 때마다 버드나무 뿌리 속 바위가 손가락 한 마디씩 밀려나 있고, 그는 매듭을 다시 묶고 도로 내려간다.'
	),

	scene('Night on the Bank', '강가의 밤'),
	p(
		'On the third night the crowd has gone home. Euija comes down the bank with rice balls in a leaf and a jar he has not opened, which for him is a sacrifice.',
		'셋째 날 밤, 구경꾼들은 모두 돌아갔다. 의자가 잎에 싼 주먹밥과 마개도 따지 않은 술병을 들고 둑을 내려온다. 그로서는 큰 희생이다.'
	),
	old('How many times have you gone in?'),
	old('Nineteen.'),
	old('…You were counting?'),
	old('At twenty I would not come back out'),
	say('euija', ['Eat.', `Then tell me. ${EN.why}`], ['먹어라.', `그리고 말해 봐. ${KO.why}`]),
	old('I gave my word.'),
	say(
		'euija',
		[
			'To a Jinmo brat who’ll have you killed either way?',
			'Run. Tonight. There is nothing for you in Sabi. There is nothing for you in all of Baekje.',
			'Nobody here will even notice you’re gone.'
		],
		['어차피 너를 죽일 진모 꼬맹이한테?', '도망가라. 오늘 밤. 사비엔 너한테 아무것도 없다. 백제 땅 어디에도 없어.', '네가 없어져도 여기선 아무도 모를 게다.']
	),
	say('gyebek', ['I gave my word.'], ['약조를 했습니다.']),
	p('He says it in exactly the same words, the way you set a stone back where it was.', '그는 똑같은 말을 똑같이 한다. 돌을 제자리에 도로 놓듯이.'),
	old('A fine young man… what is your name?'),
	old('I have… no name.'),
	old('…What? You think it makes sense to have no name'),
	p(
		'Gyebek does not answer. He goes back in. Far down, in the black, something catches the moon: a curve of gold.',
		'계백은 대답하지 않는다. 도로 들어간다. 저 아래, 캄캄한 데서 무언가가 달빛을 받는다. 금빛 곡선 하나.'
	),
	p(
		'Then the rock comes out of the willow roots. The willow, which has been leaning on that rock for a hundred years, comes after it. The rope goes taut, and the river takes the boy, the rock and the tree down together.',
		'그때 바위가 버드나무 뿌리에서 빠져나온다. 백 년을 그 바위에 기대 온 버드나무가 뒤따라 넘어간다. 밧줄이 팽팽해지고, 강은 아이와 바위와 나무를 한꺼번에 끌어내린다.'
	),
	say('euija', ['Hey— HEY—!'], ['야— 야!—']),
	p(
		'The crown prince-to-be of Baekje goes in after him in a stable boy’s coat, with a knife in his teeth. He finds the rope by feel and cuts it.',
		'백제의 태자 될 사람이 마구간지기 옷차림 그대로, 칼을 입에 문 채 뛰어든다. 손으로 더듬어 밧줄을 찾아 끊는다.'
	),
	p('They come up onto the mud together and lie there like two fish.', '둘은 함께 뻘 위로 올라와, 물고기 두 마리처럼 누워 있다.'),
	say('gyebek', ['…Thank you.'], ['…고맙습니다.']),
	p(
		'Then he gets up, picks up the cut end of the rope, and starts looking for another rock.',
		'그러고는 일어나, 끊긴 밧줄 끝을 집어 들고, 다른 바위를 찾기 시작한다.'
	),
	old('<b>Are you insane?!'),
	p(
		'Euija hits him once, properly, the way princes are not taught to. Gyebek goes down on the mud and stays there.',
		'의자가 그를 한 대 친다. 제대로. 왕자들이 배우지 않는 방식으로. 계백은 뻘 위로 쓰러져 그대로 있는다.'
	),
	p(
		'He lies with his eyes open, and the tears just come, without a sound, the way the river does.',
		'그는 눈을 뜬 채 누워 있고, 눈물이 그냥 흐른다. 소리도 없이. 강물처럼.'
	),
	old('It takes a while to get it out of him.'),
	purge,
	say('gyebek', ['No name. No house.', 'I have my word.', 'If I break it, I have nothing.'], ['이름도 없습니다. 집안도 없습니다.', '약조는 있습니다.', '그걸 어기면, 저는 아무것도 없습니다.']),
	p(
		'Euija says nothing. He has spent the week being called the Zengzi of the East of the Sea by men who would sell him by the pound, and he had settled it with himself that there were no honourable men left in Baekje. An eel boy with no name has just proved him wrong. It is humbling. He does not enjoy it.',
		'의자는 아무 말도 하지 않는다. 이번 주 내내 그를 근으로 달아 팔 사람들에게서 해동증자 소리를 들었고, 백제엔 더는 의로운 사내가 남지 않았다고 스스로 정리해 두었다. 이름 없는 장어 소년 하나가 방금 그게 틀렸다고 보여 주었다. 겸허해지는 일이다. 그는 그게 달갑지 않다.'
	),
	p(
		'Before dawn Gyebek goes in one more time, with no rope at all. He reaches the gold. He gets both arms round it. Halfway up, with the surface a body’s length away, his eyes close.',
		'동트기 전, 계백은 밧줄도 없이 한 번 더 들어간다. 금빛에 닿는다. 두 팔로 끌어안는다. 반쯤 올라왔을 때, 수면이 한 길 남짓 남은 곳에서, 그의 눈이 감긴다.'
	),
	p('Under the water, there is a flash of light.', '물속에서, 빛이 번쩍한다.'),

	scene('The Deer', '신록'),
	p(
		'On the bank the crown prince-to-be is wearing a crown he has no business wearing. He took it out of his father’s chest that afternoon, the way he has been taking things out of his father’s chest since he was six.',
		'둑 위에서, 태자 될 사람이 써서는 안 될 관을 쓰고 있다. 그날 오후 아버지의 함에서 꺼내 온 것이다. 여섯 살 때부터 아버지 함에서 이것저것 꺼내 오던 그 솜씨로.'
	),
	p(
		'Baekje’s crown is not only gold. Out of the river, through whatever door it opens, walks a pale stag with tall antlers, and across its back lies a boy with no name and a gilt-bronze incense burner in his arms.',
		'백제의 관은 금붙이만이 아니다. 그 관이 여는 어떤 문을 지나, 강물 속에서 뿔이 높은 흰 사슴 한 마리가 걸어 나온다. 그 등에는 이름 없는 아이가, 두 팔에 금동 대향로를 안은 채 엎드려 있다.'
	),
	p('Nobody else on the bank sees it. That is the point of going at night.', '둑 위의 다른 누구도 그걸 보지 못한다. 밤에 가는 이유가 그거다.'),

	scene('The Fifth Morning', '닷새째 아침'),
	p(
		'On the fifth morning Gyebek knocks at the Jinmo gate with the incense burner on his back, wrapped in his own shirt.',
		'닷새째 아침, 계백은 제 저고리로 싼 향로를 등에 지고 진모 집 대문을 두드린다.'
	),
	say('jinmoboy', ['That’s— how did you—', 'Nobody could— it’s twenty feet of river down there—'], ['그거— 어떻게—', '아무도 못— 거기 물 깊이가 스무 자야—']),
	say('gyebek', ['I said I would get it back.'], ['되찾아 오겠다고 했습니다.']),
	say('jinmoboy', ['…There’s mud in the mountains.'], ['…산에 뻘이 묻었잖아.']),
	say('gyebek', ['Yes.'], ['예.']),

	scene('The Sand', '모래판'),
	p(
		'The investiture takes less time than the wine did. A seal, a robe, and the whole hall bowing at once, like barley under wind.',
		'책봉은 술보다 짧게 끝난다. 인장 하나, 옷 한 벌, 그리고 온 전각이 한꺼번에 숙이는 절. 바람 맞은 보리밭처럼.'
	),
	old('Crown Prince.'),
	old('They complained first for thirty-two years'),
	p('Then the yard. The houses’ boys stand at the edge of the sand in white. The herald reads the board.', '그다음은 마당이다. 가문들의 아이들이 흰옷을 입고 모래판 가장자리에 선다. 전령이 판을 읽는다.'),
	say(
		'herald',
		['For the house of Satek…!', 'For the house of Yunbi…!', 'For the house of Jinmo…!', 'And for His Highness the Crown Prince—'],
		['사택가에서…!', '연비가에서…!', '진모가에서…!', '그리고 태자 저하를 대신하여—']
	),
	{
		kind: 'flashback',
		title: 'The edict · 왕명',
		blocks: [
			p('When he woke on the bank, the man in the stable boy’s coat was still wearing the crown.', '둑 위에서 눈을 떴을 때, 마구간지기 옷의 사내는 아직 관을 쓰고 있었다.'),
			say('euija', ['First, a surname.', 'How about… Buyeo?'], ['먼저 성부터.', '부여… 어떠냐?']),
			say('gyebek', ['Buyeo…', 'Is that not the royal surname? How can you…'], ['부여…', '그건 왕실의 성이 아닙니까? 어떻게…']),
			p('Behind him, in the reeds, the deer is standing.', '그의 뒤, 갈대숲에 그 사슴이 서 있다.'),
			say('euija', ['I’ll say it again.', 'Do you accept my royal edict…?'], ['다시 말하마.', '내 왕명을 받겠느냐…?']),
			p('Gyebek does not answer. He has never been given anything he did not have to pay back.', '계백은 대답하지 못한다. 갚지 않아도 되는 걸 받아 본 적이 없다.'),
			{ ...old('It’s the name of a great man.'), en: nameEn, lines: nameKo },
			say('euija', [EN.purpose], [KO.purpose]),
			old('…Do you like the name, or do you like me?'),
			old('…People don’t usually ask that.'),
			old('I have to ask, or I do not know.'),
			say('gyebek', ['Yes.'], ['예.'])
		]
	},
	say('herald', ['— Buyeo Gyebek!'], ['— 부여 계백!']),
	B.find((b) => b.kind === 'card' && b.person === 'gyebek'),
	B.find((b) => b.kind === 'hanja'),
	p(
		'The yard says the surname back to itself, louder each time. A royal name on an eel boy. At the edge of the sand the Jinmo boy goes the colour of his burner.',
		'마당이 그 성을 되뇐다. 한 번 할 때마다 더 크게. 장어 소년에게 왕실의 성이라니. 모래판 가장자리에서 진모 도령의 얼굴이 제 향로 빛이 된다.'
	),
	{
		kind: 'flashback',
		title: 'Five days · 닷새',
		blocks: [
			father([EN.father[0]], [KO.father[0]]),
			say('jinmoboy', EN.jinmo, KO.jinmo),
			crowd([EN.idiot], [KO.idiot]),
			say('euija', [EN.why], [KO.why]),
			say('euija', [EN.purpose], [KO.purpose])
		]
	},
	p('Gyebek looks back, and up, at the royal seats. The crown prince is already looking at him.', '계백이 뒤를, 위를, 왕실 자리를 올려다본다. 태자는 벌써 그를 보고 있다.'),
	p(
		'<b>Eight houses. Eight boys on the sand. And one with a borrowed name…!</b>',
		'<b>여덟 가문. 모래판의 아이 여덟. 그리고 이름을 빌린 아이 하나…!</b>'
	)
];
if (e.blocks.some((b) => !b)) throw new Error('a reused block was not found');
const dropped = B.filter((b) => !JSON.stringify(e.blocks).includes(JSON.stringify(b).slice(0, 80)));
log.push(`~ ${T}: ${B.length} → ${e.blocks.length} blocks; dropped: ${dropped.map((b) => text(b).replace(/<[^>]+>/g, '').slice(0, 50)).join(' | ')}`);

// Eight Great Clans: the tournament is the crown prince's day, and Gyebek's bout pays it off.
const grid = e8.blocks.find((b) => b.kind === 'p' && /^Once a year, the court chalks/.test(b.html));
grid.html = grid.html.replace('Once a year, the court chalks', 'On the crown prince’s day, the court chalks');
grid.ko = grid.ko.replace('해마다 한 번, 궁은', '태자 책봉 날, 궁은');
log.push(`~ ${E8}: the grid is the crown prince’s day`);
insertAfter(E8, (b) => b.kind === 'dialogue' && b.person === 'elderyunbi' && /still count wrong when it is their sleeve/.test(b.en.join(' ')), [
	p(
		'Last on the sand: the Jinmo boy, and the crown prince’s nobody. The Jinmo boy has spent five days telling the steps what he will do to a peasant. He gets his grip. Gyebek gets the same grip. Then Gyebek simply does not let go, the way he did not let go of a rope, and the Jinmo boy runs out of breath first.',
		'모래판의 마지막 판. 진모 도령, 그리고 태자의 이름 없던 아이. 진모 도령은 닷새 내내 천한 놈을 어떻게 해 주겠다고 계단에 떠벌렸다. 그가 샅바를 잡는다. 계백도 똑같이 잡는다. 그러고는 그냥 놓지 않는다. 밧줄을 놓지 않던 것처럼. 숨이 먼저 떨어지는 쪽은 진모 도령이다.'
	),
	p(
		'Sand takes a Jinmo shoulder. On the royal steps, a crown prince with no interest in clan quarrels is on his feet.',
		'모래가 진모의 어깨를 받는다. 왕실 계단 위에서, 가문 싸움엔 관심 없다던 태자가 벌떡 일어서 있다.'
	)
]);

finish();
