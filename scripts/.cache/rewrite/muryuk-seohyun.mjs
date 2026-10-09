/**
 * Muryuk + Seohyun flesh-out (chunchu-era, flashbacks inside Bidam's siege).
 * Muryuk: the painted wall with King Guhae, the training yard, the ford, the pines, the cart, the dais, the record, a son.
 * Seohyun: opens as his answer to Kangrim; the egg game, supper, the Severing and Daegaya seen by the boy,
 * Sukhuljong at the gate (twice), Muryuk's death holding Yushin, the yard-gate pep talk, Munhee's wedding, back to Day 9.
 * Idempotent: skips if the Muryuk entry already has Guhae's painted-wall line.
 */
import { editStory } from '../story-ops.mjs';

const MARKER = 'Everything the sun touches from here.';

const p = (html, ko) => ({ kind: 'p', html, ko });
const bold = (html, ko) => p(`<b>${html}</b>`, `<b>${ko}</b>`);
const say = (person, en, ko, extra = {}) => ({ kind: 'dialogue', person, lines: ko, en, ...extra });
const kneel = (person, en, ko) => say(person, en, ko, { speaker: '🙇' });
const king = (person, en, ko) => say(person, en, ko, { speaker: '👑' });
const extra = (speaker, en, ko, gender = 'm') => ({ kind: 'dialogue', chip: '#7f96b5', speaker, gender, lines: ko, en });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const card = (person, caption, ko, more = {}) => ({ kind: 'card', person, caption, ko, ...more });
const mono = (person, html, ko) => ({ kind: 'monologue', person, html, ko });

const english = (b) => [b.html, ...(b.en ?? []), b.label, b.caption].filter(Boolean).join(' ');

function picker(blocks, name) {
	const used = new Set();
	const get = (frag, from = 0) => {
		const i = blocks.findIndex((b, k) => k >= from && english(b).includes(frag));
		if (i < 0) throw new Error(`${name}: no block with “${frag}”`);
		used.add(i);
		return blocks[i];
	};
	const at = (frag) => {
		const i = blocks.findIndex((b) => english(b).includes(frag));
		if (i < 0) throw new Error(`${name}: no block with “${frag}”`);
		return i;
	};
	const range = (fromFrag, toFrag) => {
		const a = at(fromFrag);
		const z = blocks.findIndex((b, k) => k >= a && english(b).includes(toFrag));
		if (z < a) throw new Error(`${name}: bad range ${fromFrag} → ${toFrag}`);
		for (let k = a; k <= z; k++) used.add(k);
		return blocks.slice(a, z + 1);
	};
	const kind = (k, pred = () => true) => {
		const i = blocks.findIndex((b) => b.kind === k && pred(b));
		if (i < 0) throw new Error(`${name}: no ${k}`);
		used.add(i);
		return blocks[i];
	};
	return { get, range, kind, used };
}

const asGuhae = (b) => {
	delete b.speaker;
	delete b.gender;
	delete b.chip;
	b.person = 'guhae';
	return b;
};

const RECORD = {
	kind: 'quote',
	hanja: '十九年 金官國主金仇亥 與妃及三子 長曰奴宗 仲曰武德 季曰武力 以國帑寶物來降 王禮待之 授位上等 以本國爲食邑 子武力仕至角干',
	ko: '&lt;19년&gt;에 금관국(金官國)의 왕인 김구해(金仇亥)가 왕비와 세 명의 아들 즉 큰 아들인 노종(奴宗), 둘째 아들인 무덕(武德), 막내 아들인 무력(武力)을 데리고 나라의 창고에 있던 보물을 가지고 와서 항복하였다. 왕이 예(禮)로써 대접하고 상등(上等)의 벼슬을 주었으며, 본국을 식읍(食邑)으로 삼게 하였다. 아들인 무력은 벼슬이 각간(角干)에 이르렀다.',
	html: 'In the nineteenth year, Kim Guhae, king of Geumgwan, came with his queen and his three sons (the eldest Nojong, the second Mudeok, the youngest Muryuk), bringing the treasures from the kingdom’s storehouses, and surrendered. The king received him with courtesy, gave him the highest rank, and granted him his own country as his tax-estate. His son Muryuk rose in office to <i>gakgan</i>.',
	source: 'Samguk Sagi 4, Annals of Silla, Beopheung year 19'
};

editStory((story) => {
	const ch = story.find((c) => c.id === 'chunchu-era');
	const M = ch.entries.find((e) => e.title === 'Muryuk');
	const S = ch.entries.find((e) => e.title === 'Seohyun');
	if (M.blocks.some((b) => english(b).includes(MARKER))) {
		console.log('muryuk-seohyun: already applied');
		return false;
	}
	const oldM = M.blocks;
	const oldS = S.blocks;
	const m = picker(oldM, 'Muryuk');
	const s = picker(oldS, 'Seohyun');

	/* ——— pieces taken from the old Muryuk ——— */
	const ironPeace = m.get('For five hundred years the people of Gaya lived by iron');
	const muryukCard = m.kind('card', (b) => b.person === 'muryuk');
	muryukCard.caption = 'The youngest prince. He believed every word on that wall.';
	muryukCard.ko = '막내 왕자. 그 벽의 말을 한 마디도 빼지 않고 믿었다.';
	const cartSlow = m.get('The cart is slow.');
	const faceFront = asGuhae(m.get('Face front, Muryuk.'));
	const remember = m.get('Somebody should remember what it looked like.');
	const quietly = asGuhae(m.get('Then remember it quietly.'));
	const riverBends = m.get('He keeps looking back until the river bends');
	const talksBack = m.get('He has never bought one that talks back.');
	const ride = m.get('In return you ride for me.');
	const evenSouth = m.kind('dialogue', (b) => b.person === 'muryuk' && b.en?.[0] === '…Even south.');
	const threeGen = m.get('Three generations later, his grandson');
	const day6 = m.range('DAY 6', 'Will the grandson of the cone helm come to tea');

	const ironMap = m.kind('map');
	const nightRoad = m.get('Twenty-two years later he is a Silla governor');
	const kingsSide = m.get('You have seen that night from the king’s side.');
	const grandRecord = m.kind('quote', (b) => (b.hanja ?? '').startsWith('祖武力'));
	const tenThousand = m.get('Ten thousand heads, says the record');
	const slaveKnife = m.get('the slave who did the cutting comes to his tent');
	const dodo = m.get('They said give it to the Gaya one.');
	const keepIt = m.get('A knife that’s done that once');
	const lastGateOpen = m.get('the Cloud King comes for what is left of Gaya');
	const vanguard = m.range('They said too young.', 'Then keep up.');
	const coneStill = m.get('The tall Gaya cone still fights. The men on Daegaya');
	const gateToCages = m.range('Those are my father’s helms.', 'It is the first Silla habit he has ever liked.');
	const cutRopeScene = m.get('The Cut Rope');
	const cutRopeOpen = m.get('That night the freed captives sleep in the Silla camp');
	const cutRope = m.range('You’re the Gaya one.', 'Neither of them knows how short a year can be.');

	nightRoad.html =
		'By the time Seohyun can sit a horse properly, his father is a Silla governor in a Gaya helm, because nobody has managed to make him take it off. One night on the Gwansan road, the King of Baekje rides into his ditch.';
	nightRoad.ko =
		'서현이 말을 제대로 탈 줄 알게 될 무렵, 아버지는 가야 투구를 쓴 신라 군주다. 아무도 그 투구를 벗기지 못했다. 관산성 길의 어느 밤, 백제 임금이 그의 도랑으로 말을 몰아 들어온다.';
	kingsSide.html =
		'You have seen that night from the king’s side. From the cone’s side it is shorter. A man who once knelt beside his father at a king’s feet sits another king on a camp stool and does not draw his sword. The slave does the rest.';
	kingsSide.ko =
		'그 밤은 임금 쪽에서 이미 보았다. 고깔 쪽에서 보면 더 짧다. 한때 아버지 곁에서 임금의 발치에 무릎 꿇었던 사내가 다른 임금을 호상에 앉히고, 칼을 뽑지 않는다. 나머지는 노비가 한다.';
	slaveKnife.html = 'That night the slave who did the cutting comes to his tent with the king’s knife, because nobody else will take it.';
	slaveKnife.ko = '그날 밤, 목을 벤 노비가 임금의 칼을 들고 그의 막사로 온다. 아무도 그 칼을 받으려 하지 않아서다.';
	tenThousand.html = 'Ten thousand heads, says the record, and makes him a hero. The lane says it too, all the way to the Gaya house. His father comes home, sets the helm on its stand, and does not eat for two days.';
	tenThousand.ko = '만 급이라고 기록은 말하고, 그를 영웅으로 만든다. 골목도 그렇게 말한다. 가야 집 앞까지 내내. 아버지는 집에 와서 투구를 받침대에 올려놓고, 이틀을 먹지 않는다.';
	lastGateOpen.html =
		'Eight years after Gwansan, the Cloud King comes for what is left of Gaya. He brings a boy-general, Sadaham. He brings Muryuk. Muryuk brings his son, to hold the horses and to see how it ends.';
	lastGateOpen.ko =
		'관산성으로부터 여덟 해 뒤, 구름왕이 남은 가야를 치러 온다. 소년 장수 사다함을 데리고. 그리고 무력을 데리고. 무력은 아들을 데려온다. 말을 잡게 하려고, 그리고 끝이 어떤지 보여 주려고.';
	coneStill.html = 'Seohyun sees it before anyone explains it. The men on Daegaya’s gate wear the same helm his father does.';
	coneStill.ko = '서현은 누가 설명해 주기도 전에 본다. 대가야 성문 위의 사내들은 아버지와 같은 투구를 썼다.';
	cutRopeOpen.html =
		'That night the freed captives sleep in the Silla camp, because they have nowhere else to sleep. Muryuk finds the boy-general sitting on a coil of the rope he cut, eating rice out of his helmet. Seohyun follows with the horses, because nobody has told him not to.';
	cutRopeOpen.ko =
		'그날 밤 풀려난 포로들은 신라 진영에서 잔다. 달리 잘 데가 없어서다. 무력은 소년 장수가 자기가 끊은 밧줄 더미 위에 앉아 투구에 담은 밥을 먹고 있는 것을 찾는다. 서현은 말을 끌고 따라간다. 따라오지 말라는 사람이 없어서다.';

	/* ——— pieces taken from the old Seohyun ——— */
	const hook = s.get('Before there is a Yushin there is a road');
	hook.html = 'Before there is a Yushin there is a road, and a man on it who should be looking where he is going.';
	hook.ko = '유신이 있기 전에 길이 있다. 그리고 그 길 위에, 앞을 보고 다녀야 할 사내가 하나 있다.';
	const map593 = s.kind('map');
	const lastPrince = s.get('Kim Seohyun is the son of Gaya’s last prince.');
	lastPrince.html =
		'Kim Seohyun is the son of Gaya’s last prince. In the capital, that’s the kind of fact people bring up just after he leaves the room. The family is True Bone now. The rank opens most doors in the capital. It opens the best ones least.';
	lastPrince.ko =
		'김서현은 가야 마지막 왕자의 아들이다. 도읍에서 그건 그가 방을 나서자마자 사람들이 꺼내는 종류의 사실이다. 이제 그 집안은 진골이다. 그 신분은 도읍의 문 대부분을 연다. 가장 좋은 문은 가장 덜 연다.';
	const polite = s.get('so used to being the Gaya boy in the room');
	polite.html =
		'He is polite, unmarried at an age when people have started to mention it, and so used to being the Gaya boy in the room that he apologises before anyone has accused him of anything. He sits a horse better than he sits a banquet.';
	polite.ko =
		'그는 예의 바르고, 장가 안 간 걸 사람들이 입에 올리기 시작한 나이이며, 방 안의 가야 녀석 노릇에 너무 익숙해서 누가 뭐라 하기도 전에 먼저 사과부터 한다. 연회 자리보다 말 등에 더 잘 앉는다.';
	const bestGate = s.get('The best gate on the street belongs to Sukhuljong');
	bestGate.html =
		'The best gate on the street still belongs to Sukhuljong. He is older now, and no fonder of the Gaya house. His daughter Manmyung is standing in it when Seohyun rides past. He looks. The histories, which don’t usually notice such things, record exactly how.';
	bestGate.ko =
		'그 거리에서 가장 좋은 대문은 여전히 숙흘종의 것이다. 그는 나이가 들었고, 가야 집을 좋아하게 되지도 않았다. 서현이 말을 타고 지날 때, 그의 딸 만명이 그 대문에 서 있다. 그가 쳐다본다. 이런 일을 좀처럼 적지 않는 사서가 그 눈길만은 정확히 적어 두었다.';
	const courtQuote = s.kind('quote', (b) => (b.hanja ?? '').startsWith('初，舒玄'));
	const courtship = s.range('The Gate', 'Surabol has a word for what the two of them did');
	const houseApartToName = s.range('The House Apart', 'Then say it louder.');
	const nameGateScene = s.get('The Name at the Gate');
	const nameGate = s.get('A few weeks after the birth he rides to Surabol');
	nameGate.html =
		'He takes his father home to Surabol to bury him. On the way back from the grave he stops at Sukhuljong’s gate and says the name, loudly, to a street that has stopped to listen. The gate does not open. A steward comes out instead.';
	nameGate.ko =
		'그는 아버지를 서라벌로 모셔 가 묻는다. 무덤에서 돌아오는 길에 숙흘종의 문 앞에 서서 그 이름을 크게 말한다. 거리가 걸음을 멈추고 듣는다. 문은 열리지 않는다. 대신 청지기가 나온다.';
	const steward = s.range('His lordship is unwell.', 'He won’t like it.');
	const springToQuestion = s.range('The Spring', 'He thinks of the gate. He thinks of a girl');
	const question = s.get('I have a son. A few weeks old.');
	question.en = [
		'I have a son. A few weeks old.',
		'My father said his name once, and died. My wife’s father won’t say it at all. I stood at his gate this morning and said it for him, and—',
		'I don’t know what to ask for him. I don’t know what you ask for a boy like that.'
	];
	question.lines = [
		'아들이 있소. 몇 주 됐소.',
		'내 아버지는 그 이름을 한 번 부르시고 돌아가셨소. 아내의 아버지는 아예 입에 올리지 않소. 오늘 아침 그 문 앞에서 내가 대신 불렀는데—',
		'그 애를 위해 뭘 물어야 할지 모르겠소. 그런 아이를 위해선 뭘 묻는 거요.'
	];
	const oracleToHome = s.range('Their eyes go solid', 'It hasn’t rained in a week.');
	const fifteen = s.range('Fifteen', 'Just let them see you.');
	const daeyang = s.range('Daeyang', 'She’d tell you better.');
	const rises = s.get('Seohyun rises the way a Gaya man rises');
	rises.html =
		'Seohyun rises the way a Gaya man rises in the capital. One rank at a time, each signed by someone who remembers the box. He takes hill forts from Goguryeo the way he courted his wife: the same road every day, slowly, until the other side stops pretending. By the end he is third rank in the kingdom. He governs the march that faces the enemy, from the fortress at Daeya.';
	rises.ko =
		'서현은 가야 사람이 도읍에서 오르는 방식으로 오른다. 한 계단씩, 매번 그 상자를 기억하는 누군가의 서명을 받으며. 고구려의 산성은 아내에게 구애하던 식으로 뺏는다. 날마다 같은 길로, 천천히, 저쪽이 시치미를 그만둘 때까지. 마지막엔 나라의 셋째 품계에 이른다. 그는 대야성에 앉아 적과 마주한 변경을 다스린다.';
	const histories = s.get('The histories do not record the year he died');
	const closing = s.get('Down Yushin goes, to the water');

	/* ——— MURYUK ——— */
	M.year = '532';
	M.place = 'geumgwan';
	M.logline = {
		en: 'A king promises his youngest son everything the sun touches. Then Silla comes shopping.',
		ko: '임금은 막내아들에게 해가 닿는 모든 것을 약속한다. 그러다 신라가 장을 보러 온다.'
	};
	M.blocks = [
		p('Kim Guhae promised his youngest son a kingdom. It seemed a safe promise. He had one.', '김구해는 막내아들에게 나라를 약속했다. 안전한 약속 같았다. 나라가 있었으니까.'),
		scene('Geumgwan, the Golden Gaya palace', '금관, 금관가야 왕궁'),
		{ kind: 'place', place: 'geumgwan', html: 'Six eggs, one harbour, and the best iron in Samhan. Everybody wants the iron.', ko: '알 여섯, 포구 하나, 그리고 삼한에서 제일 좋은 쇠. 다들 쇠를 원한다.' },
		p(
			'Before dawn the king lifts his youngest out of bed and carries him down the long hall in his sleeping clothes. The walls are painted from floor to rafters. In the dark they are only shapes. The king has timed this. He opens the east doors, and the sun does the rest.',
			'동트기 전, 임금이 막내를 잠자리에서 안아 들고 긴 전각을 걸어 내려간다. 아이는 아직 잠옷 차림이다. 벽은 바닥부터 서까래까지 그림인데, 어둠 속에선 그저 형체일 뿐이다. 임금은 이 시각을 맞춰 두었다. 동쪽 문을 열자, 나머지는 해가 한다.'
		),
		card('guhae', 'King of Golden Gaya. A generous man with a small country.', '금관가야의 임금. 작은 나라를 가진 후한 사내.'),
		say('guhae', ['Muryuk-a. Wake up. Look.', 'No, up. Higher. There.'], ['무력아. 일어나. 봐라.', '아니, 위. 더 위. 저기.']),
		say('muryuk', ['…There’s a man in the clouds.', 'Why is he upside down?'], ['…구름 속에 사람이 있어요.', '왜 거꾸로예요?']),
		say('guhae', ['He’s coming down. That’s Ibiga. The sky.', 'He saw a lady on a mountain once and forgot to go home.'], ['내려오시는 중이다. 저분이 이비가, 하늘이시다.', '산 위의 아씨를 한번 보시고는 집에 가는 걸 잊으셨지.']),
		say('muryuk', ['Why?'], ['왜요?']),
		say('guhae', ['You’ll understand when you’re older.', 'Or never, if you’re lucky. Next one.'], ['크면 알게 된다.', '운이 좋으면 평생 모르고. 다음.']),
		p(
			'The light crawls along the wall. Nine chiefs on a hilltop, singing. A purple rope coming down out of a cloud, and on the end of it a gold box.',
			'빛이 벽을 따라 기어간다. 산꼭대기에서 노래하는 추장 아홉. 구름에서 내려오는 보랏빛 줄, 그 끝에 매달린 금빛 상자.'
		),
		say('muryuk', ['Six eggs! And the first one’s Suro.', 'He walked down to the beach all by himself and waited for a ship with red sails.'], ['알 여섯! 첫 번째가 수로왕이고요.', '혼자서 바닷가까지 걸어 내려가서, 붉은 돛 단 배를 기다렸어요.']),
		say('guhae', ['You know this one.'], ['이건 아는구나.']),
		say('muryuk', ['Every New Year. Tell it anyway.'], ['설마다 들었어요. 그래도 해 주세요.']),
		say(
			'guhae',
			['Fine. The ship.', 'Queen Heo. She came from so far off that nobody here could say the name of her country.', 'She kept her own name. Two of her sons took it, and Suro let them.', 'Then their sons. And theirs. All the way down this wall—'],
			['좋다. 배.', '허왕후. 얼마나 먼 데서 오셨는지, 여기선 아무도 그 나라 이름을 제대로 말하지 못했다.', '당신 성을 지키셨지. 아들 둘이 그 성을 받았고, 수로왕은 그러라 하셨다.', '그리고 그 아들들. 또 그 아들들. 이 벽을 따라 쭉—']
		),
		say('muryuk', ['—to you.'], ['—아버지까지요.']),
		say('guhae', ['To me. And then?'], ['나까지. 그다음은?']),
		say('muryuk', ['…Then me?'], ['…그다음은 저요?']),
		p(
			'The sun reaches the end of the wall, where the plaster is still bare. The king sets the boy down on the threshold and turns him to face the harbour. Ships. Smoke from the iron sheds. The hills behind.',
			'해가 벽 끝에 닿는다. 거기는 아직 회벽이 비어 있다. 임금은 아이를 문턱에 내려놓고 포구 쪽으로 돌려세운다. 배들. 쇠 굽는 막의 연기. 그 뒤의 언덕들.'
		),
		say('guhae', [MARKER, 'The harbour, the iron, the hills. One day all of it is yours to look after.'], ['여기서 해가 닿는 건 전부다.', '포구도, 쇠도, 언덕도. 언젠가 저걸 다 네가 돌보게 된다.']),
		say('muryuk', ['All of it?', 'What about the brothers?'], ['전부요?', '형들은요?']),
		say('guhae', ['…I’ll find them some too.'], ['…형들 것도 찾아 주마.']),
		p('He has made the same promise to all three sons. Gaya is a small country, and its kings are generous with it.', '그는 세 아들 모두에게 같은 약속을 했다. 가야는 작은 나라고, 그 임금들은 나라 인심이 후하다.'),
		p(
			'Then he lifts his own helm off its stand, the tall Gaya cone with the iron plates, and sets it on the boy’s head. It comes down over his eyes.',
			'그러고는 받침대에서 제 투구를 내린다. 쇠 비늘을 단 높은 가야 고깔. 아이 머리에 씌우자 눈까지 푹 내려온다.'
		),
		say('muryuk', ['I can’t see anything.'], ['아무것도 안 보여요.']),
		say('guhae', ['You’ll grow into it.', 'And a king who can’t see has to listen. Not the worst habit.'], ['크면 맞는다.', '그리고 못 보는 임금은 들어야 하지. 나쁜 버릇은 아니다.']),
		p('His name was Muryuk.', '그의 이름은 무력이었다.'),
		muryukCard,
		scene('Geumgwan · eight years later', '금관 · 여덟 해 뒤'),
		p(
			'He grows into the helm. He learns the six eggs in order, the price of iron at the harbour, and which Silla lord takes his bribes in bolts of silk. Mostly he learns the sword, because somebody has to look after all of it, and his brothers prefer the ledgers.',
			'그는 투구에 맞게 자란다. 여섯 알의 차례를 외고, 포구의 쇳값을 배우고, 신라의 어느 대신이 비단 필로 뇌물을 받는지도 배운다. 무엇보다 칼을 배운다. 누군가는 저걸 다 돌봐야 하는데, 형들은 장부를 더 좋아하니까.'
		),
		p(
			'Every dawn the old arms-master knocks him down in the yard. Every dawn he is up again before the man has finished turning away.',
			'새벽마다 늙은 무술 사범이 마당에서 그를 쓰러뜨린다. 새벽마다 그는 사범이 등을 다 돌리기도 전에 다시 일어나 있다.'
		),
		extra('The arms-master', ['Again? Highness, the sun isn’t even up.', 'Your brothers are still asleep.'], ['또요? 저하, 해도 안 떴습니다.', '형님들은 아직 주무십니다.']),
		say('muryuk', ['Then let them sleep. I’ll be up.', 'Again.'], ['그럼 주무시라 하게. 내가 깨어 있으면 되지.', '다시.']),
		p(
			'On the gate tower the king watches with his hands behind his back and does not come down. Kings are not supposed to have favourites. He has one.',
			'성문 누각에서 임금이 뒷짐을 지고 지켜본다. 내려오지는 않는다. 임금은 편애하면 안 된다. 그에게는 하나 있다.'
		),
		ironPeace,
		{ kind: 'map', year: 532, from: 520, places: ['geumgwan', 'surabol'], caption: 'Baekje to the west. Silla to the north. A harbour of iron in between.', ko: '서쪽엔 백제. 북쪽엔 신라. 그 사이에 쇠의 포구.' },
		scene('The ford below Geumgwan · 532', '금관 아래 여울 · 532'),
		p(
			'Silla comes down the river in spring with more spears than Geumgwan has people. The king does the arithmetic first. His youngest son refuses to.',
			'봄, 신라가 금관의 백성보다 많은 창을 이끌고 강을 따라 내려온다. 임금이 먼저 셈을 한다. 막내아들은 셈하기를 거부한다.'
		),
		p(
			'By noon the Gaya line has broken on the riverbank. The tall Gaya cone still fights. Muryuk holds the ford with his father’s guard at his back, and the Silla men who come up the bank do not come up it twice.',
			'한낮이 되자 가야의 줄이 강둑에서 무너진다. 높은 가야 고깔은 아직 싸운다. 무력은 아버지의 호위들을 등에 두고 여울을 지키고, 둑을 오른 신라 군사들은 두 번 오르지 못한다.'
		),
		extra('A Silla spearman', ['The cone— stay off the cone! Go round him, go ROUND—', 'How many has he— that was Gyeom, he just did Gyeom—'], ['고깔— 고깔한테 붙지 마! 돌아가, 돌아서 가라고—', '몇 명째야— 저거 겸이잖아, 방금 겸이—']),
		p(
			'He stops counting somewhere past thirty. Then, up the slope behind him, his father’s standard goes down.',
			'서른을 넘긴 어디쯤에서 그는 세기를 그만둔다. 그때 등 뒤 비탈 위에서 아버지의 깃발이 쓰러진다.'
		),
		say('muryuk', ['Father—', 'Hold the ford. HOLD it. I’m going up.'], ['아버지—', '여울 지켜. 지키라고. 내가 올라간다.']),
		p(
			'Silla men lead the king of Geumgwan up the hill, to a stand of pines under a canopy. Muryuk cuts his way up after him. At the trees he is red to the elbow, and alone.',
			'신라 군사들이 금관의 임금을 언덕 위 소나무 숲, 차일 아래로 끌고 간다. 무력은 칼로 길을 내며 뒤쫓는다. 숲에 닿았을 때 그는 팔꿈치까지 피투성이고, 혼자다.'
		),
		scene('The pines above the ford', '여울 위 소나무 숲'),
		p(
			'He comes in behind a pine, close enough to hear, and stops. His father is not in chains. His father is on his knees, and talking.',
			'그는 소나무 뒤로 들어간다. 들릴 만큼 가깝다. 그리고 멈춘다. 아버지는 묶여 있지 않다. 아버지는 무릎을 꿇고, 말을 하고 있다.'
		),
		p('Under the canopy sits the king of Silla. He has bought harbours before.', '차일 아래에 신라 임금이 앉아 있다. 그는 포구를 사 본 적이 있다.'),
		card('beopheung', 'King of Silla. He could take Gaya. He would rather buy it.', '신라의 임금. 가야를 빼앗을 수도 있었다. 사는 쪽을 더 좋아한다.'),
		kneel('guhae', ['If we are to surrender, I have one condition…', 'Let my sons live in Silla without shame…'], ['항복해야 한다면, 조건이 하나 있습니다…', '제 아들들이 신라에서 부끄럽지 않게 살게 해 주십시오…']),
		king('beopheung', ['And what do you mean by that?'], ['그건 또 무슨 말인가?']),
		kneel(
			'guhae',
			['In Silla… I know a man’s blood decides everything…', 'Sacred Bone, True Bone… I know it all…', 'My youngest is down at the ford. He has been killing your men since morning.', 'I promised that boy a kingdom, Majesty.'],
			['신라에서는... 사람의 성분이 모든 걸 좌지우지한다고 알고 있습니다...', '성골, 진골... 이미 다 알고 있습니다...', '제 막내가 지금 저 아래 여울에 있습니다. 아침부터 폐하의 군사를 베고 있지요.', '그 아이에게 나라를 약속했습니다, 폐하.']
		),
		say('beopheung', ['Then you should have kept one.'], ['그럼 나라를 지켰어야지.']),
		kneel('guhae', ['Yes.', '…I can’t give him a kingdom now. So I am asking you for what is left.'], ['예.', '……이제 그 아이에게 나라를 줄 수는 없습니다. 그래서 남은 것을 청하는 겁니다.']),
		say('beopheung', ['Which is?'], ['남은 것이라.']),
		kneel(
			'guhae',
			['Don’t make him a prisoner. Don’t put his head on your gate.', 'And don’t make him a prince of nothing, bowing at your banquets for the bones.', 'Give him True Bone. Let him walk in your city with his head up.'],
			['포로로 만들지 마십시오. 그 머리를 폐하의 성문에 걸지 마십시오.', '아무것도 없는 왕자로, 폐하의 잔치에서 뼈다귀나 바라며 절하게 하지도 마십시오.', '그 아이에게 진골을 주십시오. 폐하의 도성에서 고개를 들고 걷게 해 주십시오.']
		),
		kneel(
			'guhae',
			['If my descendants — the sons and daughters of Suro and Heo — can take a worthy place…', 'then I too am ready to give Silla everything I have…'],
			['제 자손... 수로왕과 허왕후의 아들과 딸들이 좋은 자리에 자리잡을 수만 있다면...', '저 또한 가진 모든 것을 신라에 바칠 준비가 되어 있습니다...']
		),
		say('beopheung', ['You would trade a kingdom for one boy’s seat at dinner.'], ['아들 하나 앉을 자리에 나라를 내놓겠다는 건가.']),
		kneel('guhae', ['I would trade it for less.', 'Please don’t tell him that.'], ['그보다 덜 받고도 내놓겠습니다.', '그 아이한테는 말하지 말아 주십시오.']),
		p('Behind the pine, the boy who held the ford all morning cannot make a sound.', '소나무 뒤, 아침 내내 여울을 지킨 소년은 아무 소리도 내지 못한다.'),
		king('beopheung', ['Very well. Your descendants shall be raised as True Bones of Silla.'], ['알겠다. 너희 후손들은 신라의 진골로 추대해주마.']),
		kneel('guhae', ['Your grace is boundless… Your Majesty…!'], ['성은이 망극하옵니다... 폐하...!']),
		p(
			'He stands behind the pine with his sword in his hand and the helm strap wet under his chin. He makes no sound at all. A king who can’t see has to listen. He has listened.',
			'그는 칼을 쥔 채 소나무 뒤에 서 있다. 턱 밑 투구 끈이 젖어 있다. 아무 소리도 내지 않는다. 못 보는 임금은 들어야 한다. 그는 들었다.'
		),
		p(
			'Then he wipes the blade on the grass, goes round the long way, and walks into the clearing from the other side, as if he had only just arrived.',
			'그러고는 풀에 칼날을 닦고, 먼 길로 돌아, 방금 막 도착한 사람처럼 반대편에서 빈터로 걸어 들어간다.'
		),
		say('guhae', ['…Muryuk.'], ['……무력아.']),
		kneel('muryuk', ['Father.', '…I’ve come to surrender.'], ['아버지.', '……항복하러 왔습니다.']),
		p(
			'He lays his sword on the ground before the king of Silla and kneels beside his father. He never tells his father what he heard behind the pine. His father never asks.',
			'그는 신라 임금 앞 땅바닥에 칼을 내려놓고 아버지 곁에 무릎을 꿇는다. 소나무 뒤에서 무엇을 들었는지 그는 끝내 아버지에게 말하지 않는다. 아버지도 끝내 묻지 않는다.'
		),
		scene('The road to Surabol', '서라벌 가는 길'),
		p('He is the youngest of three sons in the cart, and the only one who looks back.', '수레에 탄 세 아들 중 막내이고, 뒤를 돌아보는 건 그 하나뿐이다.'),
		cartSlow,
		faceFront,
		remember,
		quietly,
		riverBends,
		scene('Surabol, the Moon Palace', '서라벌, 월성'),
		p(
			'In Surabol the treasury is counted, the crown is set on a cushion, and the three princes are lined up before the dais.',
			'서라벌에서 곳간이 셈해지고, 왕관은 방석 위에 놓이고, 세 왕자는 단 앞에 나란히 선다.'
		),
		talksBack,
		say('beopheung', ['So. You’re the ford.', 'How many of mine?'], ['그래. 자네가 그 여울이로군.', '내 군사를 몇이나 벴나?']),
		kneel('muryuk', ['Thirty-one, Majesty.', '…I lost count after that. I can start again for you, if you like.'], ['서른하나이옵니다, 폐하.', '……그다음부터는 세지 못했습니다. 원하시면 폐하를 위해 다시 세겠습니다.']),
		p('The court goes very quiet. The king laughs, once, like a man who has just been undercharged.', '조정이 쥐 죽은 듯 조용해진다. 임금이 한 번 웃는다. 값을 덜 치른 사람처럼.'),
		say('beopheung', ['Your father bought you a rank. I am buying a general.', 'Bought things stay bought.'], ['자네 아비는 자네에게 품계를 샀네. 나는 장수를 사겠네.', '산 물건은 무르지 않는 법이지.']),
		ride,
		evenSouth,
		say('beopheung', ['Swear it on something.'], ['무엇에든 걸고 맹세하게.']),
		kneel('muryuk', ['On my sons, Majesty.'], ['제 아들들을 걸겠습니다, 폐하.']),
		say('beopheung', ['You have sons?'], ['아들이 있나?']),
		say('muryuk', ['…Not yet.'], ['……아직은 없습니다.']),
		threeGen,
		scene('Surabol · the years after', '서라벌 · 그 뒤'),
		p(
			'He keeps the oath. For the rest of his life he rides north and west for Silla, and wherever the border itches, it stops. He marries a Silla woman who laughs at his accent exactly once. He never takes off the helm. One night, twenty-two years on, a king of Baekje will ride into his ditch. That night is for later.',
			'그는 맹세를 지킨다. 남은 평생 신라를 위해 북으로, 서로 말을 달리고, 국경이 가려운 곳마다 가려움이 멎는다. 그의 말씨를 딱 한 번 웃은 신라 여자와 혼인한다. 투구는 끝내 벗지 않는다. 스물두 해 뒤 어느 밤, 백제 임금 하나가 그의 도랑으로 말을 몰아 들어올 것이다. 그 밤은 나중 이야기다.'
		),
		RECORD,
		scene('Surabol, the Gaya house · some years later', '서라벌, 가야 집 · 몇 해 뒤'),
		p(
			'The birth takes all night. Muryuk spends it in the yard in full armour, because nobody told him what else a man wears to this.',
			'해산은 밤새 걸린다. 무력은 그 밤을 마당에서 보낸다. 갑옷을 다 갖춰 입은 채. 이럴 때 사내가 뭘 입는지 아무도 말해 주지 않아서.'
		),
		p(
			'At dawn the midwife brings out a boy, red and furious, and puts him in hands that have only ever held reins and swords.',
			'새벽에 산파가 시뻘겋게 성난 사내아이를 안고 나와, 고삐와 칼밖에 쥐어 본 적 없는 손에 건넨다.'
		),
		extra('Muryuk’s wife', ['Well? Say something to him.', 'He’s been waiting all night to hear you.'], ['뭐 해요? 뭐라고 말 좀 해 줘요.', '밤새 당신 목소리 기다렸을 텐데.'], 'f'),
		say('muryuk', ['……', '…You first.', 'He should hear Silla first.'], ['……', '……당신이 먼저 하시오.', '신라 말을 먼저 들어야지.']),
		p(
			'They name him Seohyun. The first voice he hears is his mother’s, in a Surabol accent. His father says nothing until the boy is asleep. Then he leans over the cradle and says something very quietly, in the accent of a harbour that isn’t there any more.',
			'아이 이름은 서현이라 짓는다. 아이가 처음 듣는 목소리는 서라벌 말씨의 어머니 목소리다. 아버지는 아이가 잠들 때까지 아무 말도 하지 않는다. 그러고는 요람 위로 몸을 숙여 아주 작게 무언가를 말한다. 이제는 없는 포구의 말씨로.'
		),
		...day6
	];

	/* ——— SEOHYUN ——— */
	S.logline = {
		en: 'Before there is a Yushin there is a road, and a man on it who should be looking where he is going.',
		ko: '유신이 있기 전에 길이 있다. 그리고 그 길 위에, 앞을 보고 다녀야 할 사내가 하나 있다.'
	};
	S.blocks = [
		mono('seohyeon', 'You want the whole of it? …Then I’ll start at the beginning, sir. I was never any good at the short version.', '다 들으시겠소? …그럼 처음부터 하겠소. 짧게 말하는 건 영 못했소.'),
		scene('Surabol, the lane by the Gaya house', '서라벌, 가야 집 앞 골목'),
		p('The children of Surabol have a game. One of them is the egg.', '서라벌 아이들에게는 놀이가 하나 있다. 한 명이 알을 맡는다.'),
		p('Today the egg is Seohyun. They sit him in a basket in the lane and tell him to hatch.', '오늘 알은 서현이다. 아이들은 그를 골목의 바구니에 앉혀 놓고 깨어나 보라고 한다.'),
		extra('A boy in the lane', ['Go on, hatch! Your whole family hatched.', 'Say something in egg. Say it like your father— go on—'], ['얼른, 깨 봐! 너네 집은 다 알에서 나왔다며.', '알 말로 뭐라고 해 봐. 너네 아버지처럼— 해 보라니까—']),
		extra('Another boy', ['Gaya, Gaya, came in a cart, sold the harbour, kept the—'], ['가야, 가야, 수레 타고 왔네, 포구 팔고, 남은 건—']),
		say('seohyeon', ['I’m not an egg.', '…I’m from here. I was born on this street. I was born right there.'], ['난 알 아니야.', '…나 여기 사람이야. 이 골목에서 태어났어. 바로 저기서.']),
		p('He climbs out of the basket and goes home the long way, so that nobody sees his face until it is dry.', '그는 바구니에서 기어 나와 먼 길로 집에 간다. 얼굴이 마를 때까지 아무도 못 보게.'),
		mono('seohyeon', 'I was seven before I understood Gaya was a place. Before that I thought it was something wrong with us.', '일곱 살이 되어서야 가야가 땅 이름이라는 걸 알았소. 그전엔 우리 집에 뭔가 잘못된 게 있는 줄 알았지.'),
		scene('The Gaya house · supper', '가야 집 · 저녁상'),
		p(
			'His father eats the way soldiers eat, fast and without talking. Every morning he still wears the helm out of the gate. Indoors it sits on a stand by the door and watches the room.',
			'아버지는 군인처럼 먹는다. 빠르게, 말없이. 아침마다 여전히 그 투구를 쓰고 대문을 나선다. 집 안에선 문 옆 받침대에 올라앉아 방을 지켜본다.'
		),
		say('seohyeon', ['Father. What’s Gaya?'], ['아버지. 가야가 뭐예요?']),
		p('The chopsticks stop. His mother looks at his father. His father looks at the helm.', '젓가락이 멈춘다. 어머니가 아버지를 본다. 아버지는 투구를 본다.'),
		say('muryuk', ['…A harbour.', 'Iron. Ships. Six eggs in a gold box on a purple rope.', 'It was ours. Now it’s Silla’s.', 'Eat your rice.'], ['……포구다.', '쇠. 배. 보랏빛 줄에 매달린 금 상자 속의 알 여섯.', '우리 것이었다. 이제는 신라 것이고.', '밥 먹어라.']),
		say('seohyeon', ['Did we hatch?'], ['우리도 알에서 나왔어요?']),
		say('muryuk', ['…Who said that.'], ['……누가 그러더냐.']),
		say('seohyeon', ['Everybody.'], ['다들요.']),
		say('muryuk', ['You were born in the back room. I stood in the yard all night in my armour, like a fool.', 'Nobody hatched. Eat.'], ['너는 뒷방에서 태어났다. 나는 밤새 갑옷 입고 마당에 서 있었고. 바보처럼.', '알에서 나온 놈은 없다. 먹어라.']),
		p(
			'That is the whole history of Gaya that Seohyun ever gets from his father. He asks twice more, years apart. Both times the chopsticks stop.',
			'서현이 아버지에게서 들은 가야의 역사는 그게 전부다. 몇 해 간격으로 두 번 더 묻는다. 두 번 다 젓가락이 멈춘다.'
		),
		p('Later, through the paper door, he hears them.', '나중에, 창호지 문 너머로 두 사람 목소리가 들린다.'),
		say('muryuk', ['Talk to him more. You.', '…Everything I say comes out of a harbour. He picks it up like burrs.'], ['애한테 말 좀 더 해 주시오. 당신이.', '……내 말은 다 포구에서 나오오. 애가 도깨비바늘처럼 묻혀 온단 말이오.']),
		extra('Muryuk’s wife', ['He’s your son. He can have your voice.'], ['당신 아들이잖아요. 당신 목소리 좀 닮으면 어때서요.'], 'f'),
		say('muryuk', ['He can have my rank.', 'Let him have your voice.'], ['내 품계는 가져가라 하시오.', '목소리는 당신 걸 주고.']),
		p('So Seohyun grows up talking like Surabol. Every year his father says a little less at supper.', '그래서 서현은 서라벌 말씨로 자란다. 아버지는 해마다 저녁상에서 말이 조금씩 준다.'),
		scene('The Gwansan road · 554', '관산성 길 · 554'),
		{ kind: 'place', place: 'gwansan', html: 'A fortress on a road. Kings should not ride it at night.', ko: '길 위의 성. 임금은 밤에 그 길을 달리면 안 된다.' },
		nightRoad,
		kingsSide,
		grandRecord,
		slaveKnife,
		dodo,
		keepIt,
		scene('Surabol · the homecoming', '서라벌 · 돌아온 날'),
		tenThousand,
		say('seohyeon', ['Father. They’re saying in the lane you caught a king.'], ['아버지. 골목에서 아버지가 임금을 잡았대요.']),
		say('muryuk', ['…I didn’t catch him. He rode into a ditch.'], ['……잡은 게 아니다. 제가 도랑에 빠진 거지.']),
		say('seohyeon', ['Did you cut his—'], ['그 임금 목을 아버지가—']),
		say('muryuk', ['No.'], ['아니.']),
		p(
			'On the second night the boy brings him rice, sits with the bowl until it goes cold, and carries it out again. Nobody in the lane makes him the egg that winter.',
			'둘째 날 밤, 아이가 밥을 들고 온다. 식을 때까지 그릇을 들고 앉아 있다가, 다시 들고 나간다. 그해 겨울, 골목에서 그를 알로 삼는 아이는 아무도 없다.'
		),
		scene('Surabol, the palace gyuku field · by night', '서라벌, 궁의 격구장 · 밤'),
		p(
			'Then Seohyun discovers gyuku: horses, sticks, a ball, and nobody asking where your grandfather came from. Soon after, he discovers that the palace field is empty after dark.',
			'그러다 서현은 격구를 알게 된다. 말, 막대, 공, 그리고 할아버지가 어디서 왔느냐고 묻는 사람이 없는 곳. 곧이어 궁의 격구장이 밤이면 텅 빈다는 것도 알게 된다.'
		),
		p(
			'He goes over the back wall when the house is asleep, borrows a horse from a stable that does not know it is lending one, and plays alone by moonlight against nobody. He wins every time.',
			'집이 잠들면 그는 뒷담을 넘는다. 빌려주는 줄도 모르는 마구간에서 말을 빌리고, 달빛 아래 아무도 없는 상대와 혼자 격구를 한다. 매번 이긴다.'
		),
		mono('seohyeon', 'On a horse in the dark, nobody could tell whose son I was. For me that was the whole game.', '어둠 속 말 위에선 아무도 내가 누구 아들인지 몰랐소. 나한텐 그게 놀이의 전부였소.'),
		scene('The Gaya house · the gate', '가야 집 · 대문'),
		p(
			'The stable belongs to Sukhuljong, the young king’s younger brother. He is young himself, and already talks about people the way old men talk about furniture. He comes to the Gaya house in person. He has never done that before. He will do it once more.',
			'그 마구간은 젊은 임금의 아우 숙흘종의 것이다. 그 자신도 젊은데, 벌써 늙은이가 가구 얘기하듯 사람 얘기를 한다. 그가 직접 가야 집을 찾아온다. 전에 한 번도 한 적 없는 일이다. 앞으로 한 번 더 하게 될 일이다.'
		),
		card('sukhuljong', 'The young king’s brother. Royal on every side, and he will tell you which.', '젊은 임금의 아우. 어느 쪽으로 따져도 왕족이고, 어느 쪽인지 일러 줄 사람이다.'),
		say('sukhuljong', ['Your boy was on the palace field last night.', 'On my horse.'], ['네 아들놈이 어젯밤 궁 격구장에 있었다.', '내 말을 타고.']),
		kneel('muryuk', ['…I will speak to him, my lord.'], ['……타이르겠습니다, 나리.']),
		say(
			'sukhuljong',
			['Speak to him in what?', 'Keep him in your yard. A yard is the right size for your house.', 'My brother gave you people a rank. He didn’t give you the city.'],
			['무슨 말로 타이르려고?', '마당에나 가둬 둬라. 너희 집엔 마당이 딱 맞는 크기다.', '형님께서 너희한테 품계를 주셨지. 도성을 주신 건 아니다.']
		),
		say('muryuk', ['Yes, my lord.'], ['예, 나리.']),
		p(
			'Seohyun watches from behind the gatepost. His father caught a king on the Gwansan road. Now he bows to a man half his age, and the bow is perfect.',
			'서현은 대문 기둥 뒤에서 지켜본다. 아버지는 관산성 길에서 임금을 잡은 사람이다. 그런 아버지가 나이 절반짜리 사내에게 절을 한다. 흠잡을 데 없는 절이다.'
		),
		say('seohyeon', ['Why didn’t you say anything?'], ['왜 아무 말도 안 했어요?']),
		say('muryuk', ['I said “yes, my lord.” That’s the whole speech.', '…Learn it. You’ll need it more than gyuku.'], ['‘예, 나리’ 했잖느냐. 할 말은 그게 전부다.', '……배워 둬라. 격구보다 쓸 데가 많을 거다.']),
		say('seohyeon', ['He called us “you people.”'], ['우리더러 ‘너희’라고 했잖아요.']),
		say('muryuk', ['Somebody paid a great deal so you could stand at that gate and be insulted by a prince.', 'Give the horse back.'], ['누군가 아주 큰 값을 치렀다. 네가 저 대문 앞에 서서 왕자한테 욕이라도 들을 수 있게.', '말은 돌려줘라.']),
		p('He gives the horse back. He goes on climbing the wall at night. He only gets better at it.', '말은 돌려준다. 밤마다 담 넘기는 그만두지 않는다. 더 잘하게 될 뿐이다.'),
		scene('Daegaya · 562', '대가야 · 562'),
		ironMap,
		lastGateOpen,
		mono('seohyeon', 'Sadaham was only a few years older than me. I’d have held his horse for nothing. I held my father’s instead.', '사다함은 나보다 고작 몇 살 많았소. 그 사람 말이라면 공짜로라도 잡았을 거요. 나는 아버지 말을 잡았소.'),
		...vanguard,
		coneStill,
		...gateToCages,
		cutRopeScene,
		cutRopeOpen,
		...cutRope,
		mono(
			'seohyeon',
			'My father looked back for thirty years and stopped that night. I decided that night I would never start. …I looked at clouds instead. It isn’t the same thing. I know that now.',
			'아버지는 서른 해를 뒤돌아보시다가 그날 밤 그만두셨소. 나는 그날 밤, 아예 시작하지 않기로 했소. …대신 구름을 봤지. 같은 게 아니라는 건, 이제 아오.'
		),
		scene('Surabol · thirty years later', '서라벌 · 서른 해 뒤'),
		hook,
		card('seohyeon', 'Muryuk’s son. Polite, careful, and about to stop being careful.', '무력의 아들. 예의 바르고 조심스럽고, 곧 조심을 그만둘 사내.'),
		lastPrince,
		polite,
		bestGate,
		card('manmyung', 'Sukhuljong’s daughter. She steps down off thresholds.', '숙흘종의 딸. 문턱에서 내려서는 여자.'),
		courtQuote,
		...courtship,
		scene('The Gaya house · the gate, again', '가야 집 · 다시 대문'),
		p(
			'Then Sukhuljong does the thing he has done once before. He goes to the Gaya house himself. Muryuk is very old now. He comes to the gate on a stick, in the helm.',
			'그러고는 숙흘종이 전에 한 번 했던 일을 한다. 직접 가야 집으로 간다. 무력은 이제 아주 늙었다. 지팡이를 짚고, 투구를 쓰고 대문으로 나온다.'
		),
		say('sukhuljong', ['Your boy.', 'Thirty years ago it was my horse. Now it’s my daughter.'], ['네 아들.', '서른 해 전엔 내 말이더니. 이번엔 내 딸이다.']),
		kneel('muryuk', ['…Yes, my lord.'], ['……예, 나리.']),
		say('sukhuljong', ['That’s all? Your son climbed into my house, and you say “yes, my lord”?'], ['그게 다냐? 네 아들이 내 집 담을 넘었는데 ‘예, 나리’?']),
		say('muryuk', ['…I have said it to your family for sixty years, my lord.', 'It is the only thing I say without an accent.'], ['……나리 댁에 예순 해를 해 온 말입니다.', '말씨 없이 하는 말은 그것뿐이라서요.']),
		say('sukhuljong', ['Rank is a coat, Muryuk. My brother lent you one.', 'You don’t get to sew it onto the skin. Not you, not your boy, not his.'], ['품계는 옷이다, 무력. 형님이 한 벌 빌려준 거고.', '그걸 살갗에 꿰매 붙일 수는 없다. 너도, 네 아들도, 그 아들도.']),
		p(
			'Muryuk bows. He holds it until the royal sedan chair has gone round the corner. Then he goes in and puts his hand on the helm on its stand, the way other men touch an altar.',
			'무력은 절을 한다. 왕족의 가마가 모퉁이를 돌아 사라질 때까지 허리를 펴지 않는다. 그러고는 안으로 들어가, 다른 사내들이 제단을 만지듯 받침대 위의 투구에 손을 얹는다.'
		),
		...houseApartToName,
		scene('Manno · the cart from Surabol', '만노 · 서라벌에서 온 수레'),
		p(
			'A letter goes south with the name. The answer comes north in a cart. Under four blankets and the helm, the cart has Muryuk in it.',
			'이름을 적은 편지가 남으로 간다. 답은 수레에 실려 북으로 온다. 담요 네 겹과 투구 아래, 수레 안에 무력이 있다.'
		),
		p(
			'The physicians told him not to travel. He told them he had come to Silla in a cart and could leave it in one. Ten days up the Goguryeo road, and he faces front the whole way.',
			'의원들은 길을 나서지 말라 했다. 그는 수레 타고 신라에 왔으니 수레 타고 떠나도 된다고 했다. 고구려 가는 길로 열흘. 가는 내내 그는 앞만 본다.'
		),
		say('seohyeon', ['Father— you shouldn’t have— the passes— who let you—'], ['아버지— 이러시면— 고개가— 누가 보내 드렸습니까—']),
		say('muryuk', ['……', 'Give him here.'], ['……', '이리 다오.']),
		p(
			'Manmyung lays the baby in his arms. The old man looks at him for a long time, the way he once looked back at a harbour. His mouth moves. Seohyun leans in.',
			'만명이 아기를 그의 품에 눕힌다. 노인은 오래도록 아기를 본다. 한때 포구를 돌아보던 그 눈으로. 입술이 움직인다. 서현이 몸을 숙인다.'
		),
		say('muryuk', ['…Yushin…'], ['……유신아……']),
		p('He says nothing else. The baby has hold of his finger, and keeps it.', '그는 더 말하지 않는다. 아기가 그의 손가락을 쥐고, 놓지 않는다.'),
		p(
			'Someone is standing in the doorway who did not come in by it. A man in black with a red book, polite as a clerk. He says the name three times and cuts something nobody else in the room can see.',
			'문간에 누군가 서 있다. 그 문으로 들어오지 않은 사람이다. 붉은 책을 든 검은 옷의 사내, 아전처럼 공손하다. 그는 이름을 세 번 부르고, 방 안의 누구도 볼 수 없는 무언가를 끊는다.'
		),
		say('kangrim', ['Kim Muryuk. Kim Muryuk. Kim Muryuk.', '…Your Highness. One question, then we walk.', 'Were you the last prince of Gaya, or the first grandfather of Silla?'], ['김무력. 김무력. 김무력.', '……저하. 질문 하나, 그리고 걷읍시다.', '가야의 마지막 왕자였소, 신라의 첫 할아버지였소?']),
		p('Nobody has called him Highness in sixty years. He doesn’t answer. He looks back, once, at the baby in his son’s arms.', '예순 해 동안 아무도 그를 저하라 부르지 않았다. 그는 대답하지 않는다. 아들 품의 아기를, 한 번, 돌아본다.'),
		say('kangrim', ['…Both, then. I’ll write both.', 'Come, Highness. You can face front now.'], ['……둘 다로군. 둘 다 적겠소.', '갑시다, 저하. 이제 앞을 보셔도 되오.']),
		mono('seohyeon', 'He held my son for one breath. I counted it. I never told anyone I counted it.', '아버지는 내 아들을 한 숨 동안 안으셨소. 나는 그 숨을 셌소. 셌다는 건 아무한테도 말한 적 없소.'),
		nameGateScene,
		nameGate,
		...steward,
		...springToQuestion,
		question,
		...oracleToHome,
		p(
			'Fatherhood does to him what thirty years of being the Gaya boy never did. He still apologises first. Now he finishes the sentence afterwards.',
			'아비가 된 일은 서른 해 가야 녀석 노릇이 못 한 일을 그에게 해 놓는다. 그는 여전히 사과부터 한다. 다만 이제는 그다음 말을 끝까지 한다.'
		),
		...fifteen,
		scene('Surabol, the hwarang yard gate · Class 51’s first morning', '서라벌, 화랑 연무장 문 · 오십일기의 첫 아침'),
		p(
			'Seohyun rides with him as far as the city, then as far as the yard, then as far as the yard gate and no further. Fathers are not allowed further.',
			'서현은 도성까지 같이 간다. 그다음엔 연무장까지, 그다음엔 연무장 문까지. 거기서 더는 안 간다. 아비들은 거기까지다.'
		),
		say('seohyeon', ['Yushin. Do you know where your name comes from.'], ['유신아. 네 이름이 어디서 왔는지 아느냐.']),
		say('yushin', ['The night you dreamed. And a scholar in an old book.', 'Mother tells it every New Year, Father.'], ['아버님이 꿈꾸신 밤입니다. 그리고 옛 책의 선비요.', '어머님께서 설마다 하시는 이야기입니다.']),
		say('seohyeon', ['Yu Xin. He served a court that wasn’t his own, and served it well.', 'That’s who you’re named for.'], ['유신. 제 것이 아닌 조정을 섬겼고, 잘 섬겼다.', '네 이름은 그 사람한테서 왔다.']),
		say('yushin', ['I thought I was named for a night.'], ['밤에서 온 이름인 줄 알았습니다.']),
		say('seohyeon', ['…That too.', 'In there they’ll tell you you’re not one of them. Mostly politely. Some won’t bother.', 'Don’t argue it. You can’t win that one with talk—'], ['……그것도 맞다.', '저 안에선 네가 자기들 사람이 아니라고 할 거다. 대개는 점잖게. 안 그러는 놈들도 있고.', '따지지 마라. 그건 말로 이길 싸움이 아니다—']),
		say('yushin', ['Then with what?'], ['그럼 무엇으로 이깁니까?']),
		say(
			'seohyeon',
			['…Loyalty is soil. You plant it where you’re standing, and you keep planting.', 'One day nobody can tell it was ever carried in from somewhere else.', 'Your grandfather knelt so you could stand at this gate. Stand properly.'],
			['……충성은 흙이다. 서 있는 자리에 심고, 계속 심는 거다.', '그러다 보면 어느 날, 그게 딴 데서 옮겨 온 흙이란 걸 아무도 모르게 된다.', '네 할아버지는 네가 이 문 앞에 서라고 무릎을 꿇으셨다. 똑바로 서라.']
		),
		say('seohyeon', ['Yushin. I—', '……'], ['유신아. 나는—', '……']),
		p('His hands go up to the headband again. Yushin catches them.', '그의 손이 또 머리띠로 올라간다. 유신이 그 손을 잡는다.'),
		say('yushin', ['Father. It’s straight. You did it three times.'], ['아버님. 똑바릅니다. 세 번이나 매셨잖습니까.']),
		say('seohyeon', ['…So I did.', 'Go on, then. Make us proud, son.'], ['……그랬지.', '가거라, 그럼. 우리를 자랑스럽게 해 다오, 아들아.']),
		p(
			'At the same gate, a quiet man is leaving a boy in a black headband without looking back. The two fathers pass in the lane and nod, the way men do who have just done the same hard thing badly. Neither knows the other’s name. Their sons will see to it that all Samhan does.',
			'같은 문 앞에서, 말수 적은 사내 하나가 검은 머리띠를 맨 소년을 두고 뒤도 안 돌아보고 떠난다. 두 아비는 골목에서 엇갈리며 고개를 끄덕인다. 똑같이 어려운 일을 똑같이 서툴게 막 끝낸 사내들끼리 하듯이. 서로 이름은 모른다. 그 아들들이 삼한 전체가 알게 해 줄 것이다.'
		),
		daeyang[0],
		map593,
		...daeyang.slice(1),
		scene('Daeya · a letter from Surabol', '대야성 · 서라벌에서 온 편지'),
		p('The letter comes in Yushin’s hand, which means it is short.', '편지는 유신의 글씨로 온다. 짧다는 뜻이다.'),
		say(
			'seohyeon',
			['“Munhee is with child and will not name the father. I am building a pyre in the gyuku yard at noon. Do not come.”', '…Do not come?'],
			['‘문희가 아이를 가졌는데 아비를 대지 않습니다. 정오에 격구 마당에 장작을 쌓겠습니다. 오지 마십시오.’', '……오지 말라고?']
		),
		say('manmyung', ['Give me that.', '…The gyuku yard. Who’s he been playing gyuku with all spring?'], ['이리 줘 봐요.', '……격구 마당이래요. 봄 내내 누구랑 격구를 했죠, 그 애가?']),
		say('seohyeon', ['The— Chunchu. The old king’s grandson.', 'The deposed one’s— Manmyung, that’s a king’s—'], ['그— 춘추. 선왕의 손자.', '폐위되신 분의— 여보, 그건 임금의—']),
		say('manmyung', ['Pregnant with an unknown man’s child… what a disgrace!'], ['누군지도 모를 사내의 아이를 배다니… 이 무슨 망신이냐!']),
		say('seohyeon', ['…That’s your father’s line.'], ['……장인어른 대사잖소.']),
		say('manmyung', ['I’ve waited thirty years to say it. Saddle the horses.'], ['이 말 해 보려고 서른 해를 기다렸어요. 말에 안장 얹어요.']),
		scene('Surabol · the wedding', '서라벌 · 혼례'),
		p(
			'They ride hard and still arrive after the smoke. What they arrive at is a wedding. The groom is the grandson of a king. The bride’s grandfather came to Surabol in a cart.',
			'둘은 말을 몰아 달리지만 연기가 걷힌 뒤에야 닿는다. 닿은 곳은 혼례다. 신랑은 임금의 손자다. 신부의 할아버지는 수레 타고 서라벌에 왔다.'
		),
		p(
			'At the feast Seohyun sits where the bride’s father sits, close to the dais, with royal Kims on every side. All night nobody calls him the Gaya one. Not where he can hear.',
			'잔치에서 서현은 신부 아버지 자리에 앉는다. 단 가까이, 사방이 왕족 김씨다. 밤새 아무도 그를 가야 사람이라 부르지 않는다. 적어도 그가 들리는 데서는.'
		),
		mono(
			'seohyeon',
			'My wife was a king’s niece. My daughter married a king’s grandson. Two generations running. Father, I thought. Look. It’s working.',
			'내 아내는 임금의 조카였소. 내 딸은 임금의 손자에게 시집갔소. 두 대를 내리. 아버지, 하고 생각했소. 보십시오. 되고 있습니다.'
		),
		p(
			'Across the hall sits Sukhuljong, very old now, carried in on a chair. He has not spoken to his son-in-law in thirty years. Halfway through the feast he sends his steward over with a cup.',
			'대청 건너편에 숙흘종이 앉아 있다. 이제 아주 늙어 의자에 실려 들어왔다. 사위와는 서른 해째 말을 섞지 않았다. 잔치가 한창일 때 그는 청지기를 시켜 잔 하나를 보낸다.'
		),
		extra('Sukhuljong’s steward', ['His lordship says the bride has her mother’s mouth.', 'He asked me to say it in exactly those words.'], ['나리께서 신부가 제 어미 입을 닮았다 하십니다.', '꼭 이 말 그대로 전하라 하셨습니다.']),
		say('seohyeon', ['…Tell him thank you.', 'No— tell him she does. Tell him exactly that.'], ['……고맙다고 전해 주시오.', '아니— 닮았다고 전해 주시오. 꼭 그 말 그대로.']),
		p(
			'He drinks half the cup. The other half he pours out at the edge of the step, the way you do for the dead, and says something under his breath in the accent he was raised not to have.',
			'그는 잔을 반만 마신다. 남은 반은 섬돌 가장자리에 붓는다. 죽은 이에게 하듯. 그리고 입속으로 무언가 중얼거린다. 갖지 않도록 길러진 그 말씨로.'
		),
		histories,
		{ kind: 'day', label: 'DAY 9', ko: '아홉째 날' },
		p(
			'Before light, Yushin walks out of the palace alone and takes the ridge road his father used to take. He has shaved.',
			'동트기 전, 유신은 홀로 궁을 나서 아버지가 다니던 능선 길로 접어든다. 면도는 하고 왔다.'
		),
		closing
	];

	const retired = (old, pk, name) =>
		old.forEach((b, i) => !pk.used.has(i) && console.log(`  retired ${name}[${i}] ${b.kind}: ${english(b).slice(0, 70)}`));
	retired(oldM, m, 'Muryuk');
	retired(oldS, s, 'Seohyun');

	/* ——— images: Daegaya stills follow their scenes into Seohyun ——— */
	const moveIds = new Set(
		M.images.filter((im) => ['They said too young.', 'Then keep up.', 'The gate didn’t.', 'Don’t die first.', 'Take the land. Leave the people.', 'Alcheon dirt.'].includes(im.at)).map((im) => im.id)
	);
	S.images = [...(S.images ?? []), ...M.images.filter((im) => moveIds.has(im.id))];
	M.images = M.images.filter((im) => !moveIds.has(im.id));
	for (const im of M.images) {
		if (im.id === 'gaya-surrender') {
			im.at = '…I’ve come to surrender.';
			if (im.alt) im.alt = im.alt.replace('Jinheung', 'Beopheung');
		}
		if (im.id === 'gaya-muryuk-surrender-dutch') im.at = 'On my sons, Majesty.';
	}

	/* ——— Nangbi: the yard gate is now the longer speech ——— */
	const nangbi = ch.entries.find((e) => e.title === 'Nangbi') ?? story.flatMap((c) => c.entries).find((e) => e.title === 'Nangbi');
	const crooked = nangbi?.blocks.find((b) => b.kind === 'p' && b.html?.includes('It is the most Kim Seohyun has ever said to his son about anything'));
	if (crooked) {
		crooked.html = crooked.html.replace(
			'It is the most Kim Seohyun has ever said to his son about anything, and Yushin will carry it longer than the helmet.',
			'By Kim Seohyun’s standards it is a speech, and Yushin will carry it longer than the helmet.'
		);
		crooked.ko = crooked.ko.replace('김서현이 아들에게 무엇에 대해서든 해 준 말 중 가장 긴 말이다.', '김서현 기준으로는 연설이다.');
	}

	console.log(`muryuk-seohyun: Muryuk ${M.blocks.length} blocks, Seohyun ${S.blocks.length} blocks, moved ${moveIds.size} stills, Nangbi ${crooked ? 'patched' : 'untouched'}`);
	if (process.env.DRY) return false;
});

/* ——— touch-ups (safe to rerun) ——— */
editStory((story) => {
	const S = story.find((c) => c.id === 'chunchu-era').entries.find((e) => e.title === 'Seohyun');
	let changed = 0;
	const daeyang = S.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Daeyang');
	const map = S.blocks[daeyang + 1];
	if (map?.kind === 'map' && map.year !== 620) {
		map.year = 620;
		changed++;
	}
	const home = S.blocks.find((b) => b.kind === 'p' && b.html?.includes('she asks him where he has been all day'));
	if (home) {
		home.html = home.html.replace('she asks him where he has been all day', 'she asks him why he is a day late');
		home.ko = home.ko.replace('하루 종일 어디 있었느냐고', '왜 하루 늦었느냐고');
		changed++;
	}
	console.log(`touch-ups: ${changed}`);
	return changed > 0;
});
