// Prince Euija, second pass: plainer storyteller narration (Rowling diction), distinct mouths,
// the grey-hood disguise, and stale stills (grey-shirt Euija, the slab palace) hidden.
// node scripts/.cache/aug/euija-voice.cjs [--dry]
const { ep, plain, log, finish } = require('./lib.cjs');

const T = 'Prince Euija';
const e = ep(T);
const old = e.blocks;

/** The one old block whose text matches, so structural blocks (map, card, quote, flashbacks) ride along untouched. */
function keep(re, kind) {
	const hits = old.filter((b) => (!kind || b.kind === kind) && re.test(plain(b)));
	if (hits.length !== 1) throw new Error(`keep ${re}: ${hits.length} matches`);
	return hits[0];
}
const kept = (kind) => {
	const hits = old.filter((b) => b.kind === kind);
	if (!hits.length) throw new Error(`no ${kind}`);
	return hits;
};

const P = (html, ko) => ({ kind: 'p', html, ko });
const D = (person, en, ko) => {
	if (en.length !== ko.length) throw new Error(`${person}: ${en.length} en vs ${ko.length} ko`);
	return { kind: 'dialogue', person, en, lines: ko };
};
const CROWD = (en, ko) => ({ kind: 'dialogue', chip: '#8a8a94', speaker: '🗣', en, lines: ko });
function scene(label) {
	const b = old.find((x) => x.kind === 'scene' && x.label === label);
	if (!b) throw new Error(`no scene ${label}`);
	return b;
}

const [mapBlock] = kept('map');
const [euijaCard, gyebekCard] = kept('card');
const [quote] = kept('quote');
const [hanja] = kept('hanja');
function flashback(title) {
	const b = old.find((x) => x.kind === 'flashback' && x.title?.startsWith(title));
	if (!b) throw new Error(`no flashback ${title}`);
	return b;
}
const noName = flashback('No name');
const edict = flashback('The edict');
const fiveDays = flashback('Five days');

edict.blocks[0] = P(
	'When he woke on the bank, the man in the grey hood was still wearing the crown.',
	'강가에서 눈을 떴을 때, 회색 두건의 사내는 아직 왕관을 쓰고 있었다.'
);

e.blocks = [
	P(
		'In five days, Prince Euija becomes Crown Prince Euija. He is thirty-two, which is late for it. He has fifteen sons, which is early for everything else.',
		'닷새 뒤, 의자왕자는 의자태자가 된다. 서른둘이니 늦은 편이다. 아들은 열다섯이니, 다른 건 다 이른 편이다.'
	),
	mapBlock,
	euijaCard,
	D(
		'herald',
		['Fifteen, they say. Sixteen by spring.', 'His Majesty had fifty at that age. They say Samsin keeps a night shift just for Sabi — don’t repeat that.'],
		['열다섯이라더군. 봄이면 열여섯이고.', '전하께선 그 나이에 쉰이셨다네. 삼신할미가 사비 때문에 밤일을 따로 한다지 — 이건 못 들은 걸로 하게.']
	),
	P('This is said admiringly. It is that kind of court.', '감탄하며 하는 말이다. 그런 조정이다.'),
	keep(/The king lives here/, 'place'),

	scene('The Rear Garden'),
	P(
		'At mid-morning the prince is in the rear garden with a bow, a go board, a jar of wine and two court ladies, and he is winning at all four.',
		'한낮이 되기 전, 왕자는 후원에서 활과 바둑판과 술 단지와 궁녀 둘을 끼고 있다. 넷 다 이기는 중이다.'
	),
	P('The arrow goes in without his looking. He is already reaching for a stone.', '화살은 보지도 않고 꽂힌다. 그의 손은 벌써 바둑돌로 가 있다.'),
	keep(/^Prince Euija \(32\)/, 'cite'),
	D(
		'euija',
		['Your move.', 'And if you shift my stone while I drink, my lady, do it better than last time. If I’m to be cheated, I want a professional. Ha!', 'Pour.'],
		['네 차례다.', '내가 마시는 동안 돌을 옮길 거면 지난번보다는 잘해라. 속아도 장인한테 속고 싶구나. 하하!', '따라라.']
	),
	D(
		'courtmaid',
		['Your Highness moved it yourself—', '—twice—', '—and blamed the wind.'],
		['저하께서 직접 옮기셨는데요—', '—두 번이나요—', '—그러고는 바람 탓을 하셨지요.']
	),
	keep(/King Mu \(71\)/, 'cite'),
	P(
		'The ladies stop giggling all at once, the way sparrows stop when a hawk goes over.',
		'궁녀들의 웃음이 한꺼번에 뚝 그친다. 매가 지나갈 때 참새들이 그러듯이.'
	),
	D(
		'kingmu',
		['Up, boy.', 'The houses are parading their wrestlers in my yard, and the man they’re wrestling for is in a hedge with a jar.'],
		['일어나라, 이놈아.', '가문마다 씨름꾼을 내 마당에 끌고 와 자랑하는데, 그 씨름의 주인은 술 단지 끼고 덤불 속에 있구나.']
	),
	D('euija', ['I’m practising, Father. A crown prince ought to hit what he aims at.'], ['연습 중입니다, 아바마마. 태자라면 겨눈 데는 맞혀야지요.']),
	D(
		'kingmu',
		['Then aim at the hall.', 'Analects by heart at seven. My ministers beaten at go at twelve.', 'And twenty years since, making very sure nobody asks you to do either again.'],
		['그럼 대전을 겨눠라.', '일곱에 논어를 외웠지. 열둘에 내 대신들을 바둑으로 이겼고.', '그러고 이십 년을, 아무도 다시는 시키지 않게 애쓰며 보냈지.']
	),
	D(
		'euija',
		['Cleverness is an ox, Father.', 'Let the village see it, and by morning somebody’s hitched it to his plough.'],
		['영리함은 소 같은 겁니다, 아바마마.', '마을에 보이면, 아침엔 누가 벌써 제 쟁기에 매어 놓지요.']
	),
	D('kingmu', ['Today it gets hitched.', 'Bring the jar. You’ll want it.'], ['오늘 매인다.', '단지는 들고 와라. 필요할 게다.']),

	scene('The Yard'),
	P(
		'Five days before a crown prince is made, each of the eight houses brings a boy to the palace yard to be looked at, the way you bring a horse to market. On the day itself they wrestle. The crown prince puts up a boy too.',
		'태자를 세우기 닷새 전, 여덟 가문은 저마다 아이 하나를 궁 마당에 데려와 선보인다. 장에 말을 끌고 가듯이. 당일에는 그 아이들이 씨름을 한다. 태자도 아이 하나를 내세운다.'
	),
	P('Eight boys in white stand on the sand. The ninth place is empty, and everyone is looking at it.', '흰옷 입은 아이 여덟이 모래판에 서 있다. 아홉째 자리는 비어 있고, 모두가 그 자리를 보고 있다.'),
	D('kingmu', ['Your man for the sand.', 'Pick a son. Yung’s big enough to fall on somebody.'], ['모래판에 세울 네 사람.', '아들 하나 골라라. 융이는 누구 위에 넘어질 만큼은 크다.']),
	P(
		'His sons grow up already spoken for. Yung wears a Satek ring. Hyo has a Yunbi tutor. Little Pung has lovely handwriting and a Jinmo grandmother.',
		'그의 아들들은 이미 임자가 정해진 채 자란다. 융은 사택가 반지를 낀다. 효의 스승은 연비가 사람이다. 어린 풍은 글씨가 곱고, 할머니가 진모가다.'
	),
	D(
		'euija',
		['Put one of mine on the sand and I’m only telling the yard which house I’ve lost him to.'],
		['제 아들을 모래판에 세우면, 어느 가문에 빼앗겼는지 마당에 알리는 것뿐입니다.']
	),
	D(
		'kingmu',
		['Then find someone who isn’t anybody’s.', 'Five days. After that I pick for you, and you’ll hate who I pick.'],
		['그럼 누구 것도 아닌 놈을 찾아라.', '닷새다. 그 뒤엔 내가 고른다. 내가 고른 놈은 네가 싫어할 게다.']
	),
	P('Two old men reach the prince before the king has finished speaking.', '임금의 말이 끝나기도 전에 노인 둘이 왕자에게 닿는다.'),
	keep(/Lord Yunbi… an honour to—/, 'dialogue'),
	D(
		'eldersatek',
		['Highness. The tide is with you this week.', 'Up and down the river they say it. Filial to his father, kind to his brothers. The Zengzi of the East of the Sea.'],
		['저하. 이번 주 물때가 저하 편이오.', '강 위아래로 다들 그러지요. 아버지께 효성스럽고 형제에게 우애롭다고. 해동증자라고.']
	),
	D(
		'elderyunbi',
		['We said it first. On the coast road, into a headwind.', 'Satek heard it from us. He usually does. Through a floorboard.'],
		['우리가 먼저 했소. 바닷길에서, 맞바람 맞아 가며.', '사택은 우리한테서 들었소. 늘 그렇듯. 마룻바닥 너머로.']
	),
	D('eldersatek', ['Floorboards are cheap in Yunbi.', 'Everything is.'], ['연비가는 마룻바닥이 싸지요.', '다른 것도 다 싸고.']),
	quote,
	P(
		'The Zengzi of the East of the Sea was cheating at go an hour ago. He smiles at both of them like a man being sold his own horse.',
		'해동증자는 한 시진 전까지 바둑에서 속임수를 쓰고 있었다. 그는 제 말을 되사라는 소리를 듣는 사람처럼 두 노인에게 웃어 준다.'
	),
	P(
		'When they have bowed themselves away, he says what he thinks. His father has been trying to cure him of that for thirty-two years.',
		'노인들이 절을 하며 물러가자, 그는 속에 있는 말을 한다. 아버지가 서른두 해째 고치려고 애쓰는 버릇이다.'
	),
	keep(/I have no interest in these clan quarrels/, 'dialogue'),
	keep(/learn their names anyway/, 'dialogue'),
	D(
		'kingmu',
		['You think I like them? I’ve buried three Satek elders, and I’d dance at a fourth.', 'But a king rules the country he has, boy. Not the one he wants.', 'Fifteen sons—'],
		['내가 그놈들을 좋아하는 줄 아느냐? 사택 노인을 셋이나 묻었다. 넷째 땐 춤이라도 출 게다.', '허나 임금은 가진 나라를 다스리는 거다, 이놈아. 바라는 나라가 아니라.', '아들이 열다섯—']
	),
	D('euija', ['Sixteen by spring.', 'The lady of the Hae house says it’s twins.'], ['봄이면 열여섯입니다.', '해씨 부인 말로는 쌍둥이랍니다.']),
	D(
		'kingmu',
		['…Gods help the Hae.', 'Every son is a door, boy, and some house will try to walk through each one.', 'Be a father to the boys. Be a king to the doors.'],
		['…해씨 집안에 신의 가호를.', '아들 하나하나가 문이다, 이놈아. 어느 가문이든 그 문으로 걸어 들어오려 할 게다.', '아이들한텐 아비가 되고, 문들한텐 임금이 되거라.']
	),

	scene('The White River'),
	P(
		'That night Euija sneaks out of the palace in a grey hood and a grey robe. He tells himself it is to see how the common people live. Mostly it is to get away from a list with an empty ninth line.',
		'그날 밤 의자는 회색 두건에 회색 도포를 걸치고 궁을 빠져나간다. 백성이 어찌 사는지 보러 간다고 스스로에게 말한다. 실은 아홉째 줄이 빈 명단에서 도망치는 것이다.'
	),
	keep(/Wide, slow, and fought over/, 'place'),
	P(
		'On the landing a Jinmo boy is shouting at four porters and a great gilt-bronze incense burner. The burner is wrapped in silk for the crown prince’s day. It is as tall as a child, with mountains on the lid, musicians on the mountains, and a phoenix on top who looks as if he would rather be elsewhere.',
		'나루에서 진모가 아이 하나가 짐꾼 넷과 커다란 금동 향로에게 소리를 지르고 있다. 향로는 태자 책봉 날을 위해 비단에 싸여 있다. 아이 키만 하다. 뚜껑엔 산이, 산엔 악사들이, 꼭대기엔 어디 딴 데 가고 싶은 얼굴의 봉황이 있다.'
	),
	P(
		'A barefoot boy with a basket of eels comes round the stack at a run. The Jinmo boy steps back into him. The burner goes over the rail. It does not float.',
		'장어 바구니를 든 맨발의 아이가 짐 더미를 돌아 뛰어온다. 진모가 아이가 뒷걸음질 치다 부딪힌다. 향로가 난간 너머로 넘어간다. 뜨지 않는다.'
	),
	D(
		'jinmoboy',
		['Do you know what that WAS?', 'My grandfather had it cast! It’s for the crown prince! It’s for the YARD—'],
		['저게 뭔 줄 알아?!', '우리 할아버지가 부어 만든 거야! 태자 거라고! 마당에 놓을 거라고—']
	),
	D('jinmoboy', ['Do you know who my father is, you little peasant twat?'], ['우리 아버지가 누군지 알아, 이 천한 놈아?']),
	D('gyebek', ['No.'], ['모릅니다.']),
	D(
		'jinmoboy',
		['Jinmo. JINMO.', 'My father sits on the rock. I can have you thrown in after it, and nobody will even write it down.'],
		['진모. 진모라고!', '우리 아버지는 바위에 앉는 분이야. 너 같은 건 저거 따라 던져 넣어도 아무도 적지도 않아.']
	),
	P('Nobody on the landing moves. The porters find their feet very interesting.', '나루의 누구도 움직이지 않는다. 짐꾼들은 제 발등이 무척 흥미로운 모양이다.'),
	D('gyebek', ['I will get it back.'], ['되찾아 오겠습니다.']),
	D(
		'jinmoboy',
		['…You?', 'Fine. Five days. If it isn’t on my doorstep in five days, I’ll have you killed in front of the whole street.'],
		['…네가?', '좋아. 닷새. 닷새 안에 우리 집 문 앞에 없으면, 온 동네 앞에서 죽여 버릴 거야.']
	),
	D('gyebek', ['Five days.'], ['닷새.']),

	scene('The Diving Boy'),
	P(
		'There is an old willow on the bank with a rock wedged in its roots. Gyebek ties one end of a rope round the rock and the other round his ankle, so the river can’t keep him. Then he goes in.',
		'강둑에 늙은 버드나무가 있고, 그 뿌리에 바위 하나가 박혀 있다. 계백은 밧줄 한쪽을 바위에, 다른 쪽을 제 발목에 묶는다. 강이 그를 데려가지 못하게. 그리고 들어간다.'
	),
	P(
		'The boy is going back into the water. He has been at it since morning, and he is not a strong swimmer.',
		'아이가 또 물에 들어간다. 아침부터 저러고 있다. 헤엄을 잘 치는 아이도 아니다.'
	),
	CROWD(
		['That’s the eel boy. Been going in since dawn.', 'For the Jinmo pot? That’s down with the catfish by now.', 'Hey, look at that idiot! Jumping into the freezing river, haha!', 'Give it a day. The river’s got all the time in the world.'],
		['저거 장어 파는 애잖아. 새벽부터 들어가더라.', '진모네 향로 건지려고? 그거 벌써 메기들이랑 뻘 속에 있지.', '야, 저 바보 좀 봐! 그 차가운 강에 뛰어드네, 하하!', '하루만 기다려 봐. 강은 급할 게 없어.']
	),
	P('On the second day a man in a grey hood stops at the back of the crowd. He stays longer than he means to.', '이튿날, 회색 두건의 사내 하나가 구경꾼들 뒤에 멈춰 선다. 생각보다 오래 머문다.'),
	D('euija', ['What’s he after down there?'], ['저 아래서 뭘 찾는 게냐?']),
	CROWD(['The Jinmo pot. Five days, or they kill him.'], ['진모네 향로요. 닷새 안에 못 건지면 죽인대요.']),
	D('euija', ['Then why hasn’t he run?'], ['그럼 왜 아직 안 도망쳤느냐?']),
	CROWD(['Ask him yourself. He doesn’t talk.'], ['직접 물어보슈. 저 애는 말을 안 해요.']),
	P(
		'In the palace, the crown prince has been missing for two days. King Mu has the city turned over, and says several things about his son that the herald is asked not to write down.',
		'궁에서는 태자가 이틀째 보이지 않는다. 무왕은 성안을 뒤집어엎게 하고, 아들에 대해 전령이 받아 적지 말라는 말을 여럿 한다.'
	),
	D('kingmu', ['Start with the wine houses.', 'Then the other houses.'], ['술집부터 뒤져라.', '그다음엔 다른 집들.']),
	D('herald', ['The other— ah.', 'Yes, Majesty.'], ['다른 집이라 하심은— 아.', '예, 전하.']),
	P(
		'Gyebek does not eat. Nobody sees him sleep. Each time he comes up, the rock in the willow roots has shifted a finger’s width, and he reties the knot and goes back down.',
		'계백은 먹지 않는다. 자는 걸 본 사람도 없다. 올라올 때마다 버드나무 뿌리의 바위가 손가락 한 마디씩 밀려나 있고, 그는 매듭을 다시 묶고 또 내려간다.'
	),

	scene('Night on the Bank'),
	P(
		'On the third night the crowd has gone home. Euija comes down the bank with rice balls in a leaf and a jar he has not opened, which for him is a sacrifice.',
		'사흘째 밤, 구경꾼들은 집에 갔다. 의자가 잎에 싼 주먹밥과 뜯지 않은 술 단지를 들고 둑을 내려온다. 그에겐 그게 희생이다.'
	),
	keep(/^How many times have you gone in/, 'dialogue'),
	keep(/^Nineteen/, 'dialogue'),
	keep(/^…You were counting/, 'dialogue'),
	keep(/At twenty I would not come back out/, 'dialogue'),
	keep(/Why do you do all of this/, 'dialogue'),
	D('gyebek', ['I gave my word.'], ['약조를 했습니다.']),
	D(
		'euija',
		['To a Jinmo brat who’ll have you killed either way? Ha!', 'Run. Tonight. There’s nothing for you in Sabi. There’s nothing for you in all of Baekje.', 'Nobody here will even notice you’ve gone.'],
		['어차피 너를 죽일 진모가 꼬맹이한테? 하!', '도망쳐라. 오늘 밤. 사비엔 너를 위한 게 없다. 백제 어디에도 없다.', '네가 사라져도 여기선 아무도 모를 게다.']
	),
	D('gyebek', ['I gave my word.'], ['약조를 했습니다.']),
	P('He says it in exactly the same words, the way you set a stone back where it was.', '똑같은 말이다. 돌을 제자리에 도로 놓듯이.'),
	keep(/A fine young man… what is your name/, 'dialogue'),
	keep(/I have… no name/, 'dialogue'),
	keep(/You think it makes sense to have no name/, 'dialogue'),
	keep(/a curve of gold/, 'p'),
	keep(/Then the rock comes out of the willow roots/, 'p'),
	keep(/^Hey— HEY—/, 'dialogue'),
	P(
		'The crown prince of Baekje goes in after him in a grey robe, with a knife in his teeth. He finds the rope by feel and cuts it.',
		'백제의 태자가 회색 도포 차림으로 칼을 입에 물고 뒤따라 뛰어든다. 손끝으로 밧줄을 더듬어 찾아 끊는다.'
	),
	keep(/like two fish/, 'p'),
	keep(/^…Thank you/, 'dialogue'),
	keep(/starts looking for another rock/, 'p'),
	keep(/In that much of a hurry to stand before Yumla/, 'dialogue'),
	P(
		'Euija hits him once, properly, in a way princes are not taught. Gyebek goes down on the mud and stays there.',
		'의자가 한 대 친다. 제대로, 왕자들이 배우지 않는 방식으로. 계백은 뻘에 쓰러져 그대로 있다.'
	),
	keep(/the tears just come/, 'p'),
	keep(/It takes a while to get it out of him/, 'p'),
	noName,
	keep(/If I break it, I have nothing/, 'dialogue'),
	P(
		'Euija says nothing for a long time. All week he has been called the Zengzi of the East of the Sea by men who would sell him by the pound, and he had decided there were no honourable men left in Baekje. It is very annoying to be proved wrong about that on a mudbank, at night, by an eel boy.',
		'의자는 한참 말이 없다. 한 주 내내 그를 근으로 달아 팔 사람들한테 해동증자 소리를 들었다. 그래서 백제엔 이제 의로운 사람이 없다고 정해 두었다. 그걸 한밤중 뻘밭에서, 장어 파는 아이한테 틀렸다고 증명당하니 몹시 짜증 나는 일이다.'
	),
	keep(/Before dawn Gyebek goes in one more time/, 'p'),
	keep(/Under the water, there is a flash of light/, 'p'),

	scene('The Deer'),
	keep(/a crown he has no business wearing/, 'p'),
	P(
		'Out of the river, as if the water were a door, walks a pale stag with tall antlers. Across its back lies a boy with no name, both arms still locked round a gilt-bronze incense burner.',
		'강에서, 물이 문이라도 되는 듯, 뿔이 높은 하얀 사슴이 걸어 나온다. 그 등에 이름 없는 아이가 엎어져 있다. 두 팔은 아직도 금동 향로를 꽉 끌어안은 채다.'
	),
	P('Nobody else sees it. Nobody else is up.', '본 사람은 아무도 없다. 깨어 있는 사람이 없었으니까.'),

	scene('The Fifth Morning'),
	keep(/knocks at the Jinmo gate/, 'p'),
	keep(/it’s twenty feet of river/, 'dialogue'),
	keep(/^I said I would get it back/, 'dialogue'),
	keep(/There’s mud in the mountains/, 'dialogue'),
	D('gyebek', ['Yes.'], ['예.']),

	scene('The Sand'),
	keep(/like barley under wind/, 'p'),
	keep(/Now they have to bow to you first/, 'dialogue'),
	keep(/I’ll take the bow/, 'dialogue'),
	keep(/The herald reads the board/, 'p'),
	keep(/For the house of Satek/, 'dialogue'),
	edict,
	keep(/^— Buyeo Gyebek/, 'dialogue'),
	gyebekCard,
	hanja,
	keep(/A royal name on an eel boy/, 'p'),
	fiveDays,
	keep(/The crown prince is already looking at him/, 'p'),
	keep(/borrowed name/, 'p')
];
log.push(`~ ${T}: ${old.length} → ${e.blocks.length} blocks`);

/* Grey-shirt Euija, the red-robe night bank and the slab palace: kept on disk, out of the reader. */
const HIDE = ['rel-mu-euija', 'euija-seq-disguise-yard', 'gyebek-seq-dive-wide', 'gyebek-seq-name', 'gyebek-white-river', 'baekje-river-palace'];
const AT = {
	'baekje-river': 'Wide, slow, and fought over',
	'baekje-river-palace': 'Wide, slow, and fought over',
	'sabi-seq-hall-bird': 'The king lives here.'
};
for (const img of e.images) {
	if (HIDE.includes(img.id)) {
		img.hidden = true;
		log.push(`hide ${img.id}`);
	}
	if (AT[img.id]) {
		img.at = AT[img.id];
		log.push(`at ${img.id} → ${AT[img.id]}`);
	}
	if (img.refs) img.refs = img.refs.map((r) => (r === '/ch_euija_young.png' ? '/ch_buyeo_euija.png' : r));
}

finish();
