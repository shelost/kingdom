// Rewrites the Seohyun entry as spoken scenes, adding the record beats (Muryuk, dreams, naming, seven stars, Taeryeong, hwarang at fifteen, Daeyang).
// Usage: node scripts/.cache/rewrite-seohyun.mjs
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const BACKUP = 'scripts/.cache/seohyun-blocks.pre-rewrite.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const entry = story.flatMap((c) => c.entries).find((e) => e.title === 'Seohyun');
if (!entry) throw new Error('no Seohyun entry');
if (!fs.existsSync(BACKUP)) fs.writeFileSync(BACKUP, JSON.stringify(entry.blocks, null, '\t') + '\n');

const CHIP = {
	seohyeon: '#3E8EF0',
	manmyung: '#c98bb9',
	sukhuljong: '#6b5b4b',
	narim: '#5fad6e',
	golhwa: '#e86820',
	hyulle: '#2eb8c4',
	yushin: '#4a8fe0'
};
const EXTRA = '#7a7a82';
const BK41 = 'Samguk Sagi (三國史記) bk. 41, Biography of Kim Yushin, part 1';

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const say = (who, en, lines) =>
	who in CHIP
		? { kind: 'dialogue', person: who, chip: CHIP[who], en, lines }
		: { kind: 'dialogue', speaker: who, chip: who === 'The Hill' ? '#0e7490' : EXTRA, en, lines };
const quote = (hanja, html, ko, source = BK41) => ({ kind: 'quote', hanja, html, ko, source });

const old = entry.blocks;
const keepQuote = (i) => {
	if (old[i]?.kind !== 'quote') throw new Error(`block ${i} is not the expected quote`);
	return old[i];
};
const Q_MET = keepQuote(3);
const Q_LOCKED = keepQuote(14);
const Q_DREAMS = keepQuote(18);
const HILL = old[43];
if (HILL?.speaker !== 'The Hill') throw new Error('block 43 is not the Hill');

const blocks = [
	p(
		'Before there is a Yushin there is a road, and a young man on it who should be looking where he is going.',
		'유신이 있기 전에 길이 있다. 그리고 그 길 위에, 앞을 보고 다녀야 할 젊은이가 하나 있다.'
	),
	p(
		'Kim Seohyeon is the son of the last prince of Golden Gaya, which in Surabol is the kind of fact people bring up just after he has left the room. His father Muryuk handed the kingdom over and then spent the rest of his life proving it had been a bargain: on the Gwansan road he took a king of Baekje, four of that king’s generals and ten thousand heads. The family is True Bone now. The rank opens most doors in the capital, and it opens the best ones least.',
		'김서현은 금관가야 마지막 왕자의 아들이다. 서라벌에서는 그가 방을 나서자마자 사람들이 꺼내는 종류의 사실이다. 아버지 무력은 나라를 넘겨주고 나서, 남은 평생을 그게 손해 보는 장사가 아니었음을 증명하는 데 썼다. 관산 길에서 백제 왕 하나와 그 왕의 장수 넷과 머리 만 개를 거두었다. 이제 집안은 진골이다. 그 품계로 도성의 문은 대부분 열린다. 가장 좋은 문일수록 덜 열릴 뿐.'
	),
	p(
		'He is young and polite and so used to being the Gaya boy in the room that he apologises before anyone has accused him of anything. He sits a horse better than he sits a banquet.',
		'그는 젊고 예의 바르며, 방 안의 가야 녀석 노릇에 너무 익숙해서 누가 뭐라 하기도 전에 먼저 사과부터 한다. 연회 자리보다 말 등에 더 잘 앉는다.'
	),
	p(
		'The best gate in the street belongs to <b>Sukhuljong</b>, younger brother of the great king Jinheung, royal on every side, and his daughter <b>Manmyung</b> is standing in it when Seohyeon rides past. He looks. The histories, which do not usually notice such things, record exactly how.',
		'그 거리에서 가장 좋은 문은 진흥대왕의 아우이자 사방이 왕족인 <b>숙흘종</b>의 것이다. 서현이 말을 타고 지나갈 때 그의 딸 <b>만명</b>이 그 문간에 서 있다. 그는 본다. 평소 그런 일에는 눈길도 주지 않는 사서가, 그가 어떻게 보았는지를 정확히 적어 두었다.'
	),
	Q_MET,

	scene('The Gate', '그 문'),
	p(
		'The first time, he looks and keeps riding and nearly puts his horse into a charcoal cart. The second time he has an errand ready at the far end of the street, which does not exist. By the third the errand has run out, and he is only a man on a horse going the wrong way slowly.',
		'처음엔 보고, 계속 가다가, 하마터면 말을 숯 수레에 처박을 뻔한다. 두 번째엔 거리 저 끝에 볼일이 있다는 핑계를 준비해 온다. 그런 볼일은 없다. 세 번째쯤 되자 핑계도 바닥나서, 그는 그냥 엉뚱한 방향으로 천천히 가는 말 탄 사내일 뿐이다.'
	),
	say('Manmyung’s maid', ['Agassi. It’s him again.', 'Same horse. Same— he’s pretending he isn’t looking.'], ['아가씨. 또 그 사람이에요.', '같은 말이에요. 같은— 안 보는 척해요.']),
	say('manmyung', ['He’s terrible at it.', 'Don’t look. …No, look. I want to see what he does.'], ['되게 못한다, 저거.', '보지 마. …아니, 봐. 뭐 하나 보게.']),
	p(
		'Then she does something nobody on that street has seen a Sacred Bone daughter do. She steps down off the threshold into the dust.',
		'그러고는 그 거리 누구도 성골 집 딸이 하는 걸 본 적 없는 일을 한다. 문턱에서 흙바닥으로 내려선다.'
	),
	say('manmyung', ['You’ve ridden past this gate three times today.', 'Is the road that bad, or are you lost?'], ['오늘만 이 문 앞을 세 번 지나가셨어요.', '길이 그렇게 험해요, 아니면 길을 잃으셨어요?']),
	say('seohyeon', ['I— the horse—', '…It’s lost. I’m only on it.'], ['저, 그게, 말이—', '…말이 길을 잃었소. 나는 타고 있을 뿐이고.']),
	say('manmyung', ['It looked fine the first time.', 'Nearly ate a charcoal cart. But fine.'], ['처음엔 멀쩡해 보이던데요.', '숯 수레를 먹을 뻔하긴 했지만. 멀쩡했어요.']),
	say(
		'seohyeon',
		['That was— the cart was in the wrong—', 'Kim Seohyeon. That’s— I should have said that first. Is it rude? I don’t know the rule for this.'],
		['그건— 수레가 엉뚱한 데—', '김서현이오. 그게— 그 말부터 했어야 했는데. 무례한 거요? 이럴 땐 법도를 모르겠소.']
	),
	say('manmyung', ['There isn’t one. That’s why it’s fun.', 'And I know who you are. Everyone on this street knows who you are.'], ['법도 같은 거 없어요. 그래서 재밌는 거고.', '그리고 누군지 알아요. 이 거리 사람은 다 알아요.']),
	say('seohyeon', ['…Ah.', 'The Gaya one.'], ['…아.', '가야 사람.']),
	say('manmyung', ['The one with the nice horse.', 'Then let it get lost again tomorrow. Same hour.'], ['말 좋은 사람.', '그럼 내일도 길 잃게 하세요. 같은 시각에.']),
	say('Manmyung’s maid', ['Agassi—!'], ['아가씨—!']),

	scene('Getting Lost', '길 잃기'),
	p(
		'It gets lost every day for a season. The maid starts timing her errands by it. The charcoal man learns to pull over. Nobody sends a matchmaker, because a matchmaker would have to walk into Sukhuljong’s hall and say the word <i>Gaya</i> out loud.',
		'말은 한 철 내내 날마다 길을 잃는다. 하녀는 심부름 시간을 거기에 맞추기 시작하고, 숯장수는 미리 비켜서는 법을 배운다. 아무도 중매쟁이를 보내지 않는다. 중매쟁이라면 숙흘종의 대청에 들어가 <i>가야</i>라는 말을 소리 내어 해야 할 테니까.'
	),
	p(
		'By the end of summer they have stopped pretending about the horse. He leaves it at the bottom of the lane and walks up, and she talks to him through the side gate with the bar still down, because a gate with the bar down is technically closed.',
		'여름이 끝날 무렵엔 둘 다 말 핑계를 그만둔다. 그는 말을 골목 아래에 매어 두고 걸어 올라오고, 그녀는 빗장을 지른 채로 쪽문 너머로 그와 이야기한다. 빗장이 걸려 있으면, 엄밀히 말해 문은 닫힌 것이니까.'
	),
	say('manmyung', ['You’re late.', 'The horse?'], ['늦었어요.', '말이요?']),
	say(
		'seohyeon',
		['The horse is fine. The horse is better than me.', 'They kept us at the Ministry. There’s talk of a posting.'],
		['말은 멀쩡하오. 나보다 낫소.', '병부에서 붙잡았소. 임지 얘기가 있소.']
	),
	say('manmyung', ['Where?'], ['어디요?']),
	say(
		'seohyeon',
		['They haven’t said. North, probably. They send Gaya men north.', 'Somewhere with a lot of Goguryeo and not much—'],
		['아직 말 안 했소. 아마 북쪽이겠지. 가야 사람은 북으로 보내니.', '고구려는 많고, 별로 없는 데—']
	),
	say('manmyung', ['Not much me.'], ['나는 별로 없고.']),
	say('seohyeon', ['…I was going to say not much rice.'], ['…쌀이 별로 없다고 하려 했소.']),
	say('manmyung', ['Liar.'], ['거짓말.']),
	p(
		'The posting comes in the autumn: governor of <b>Manno</b>, a county far up the Goguryeo road, a wooden wall and a granary and a great many hills that change hands. He comes to the side gate with the seal still in his sleeve.',
		'임지는 가을에 정해진다. 고구려로 가는 길 저 위쪽 고을 <b>만노</b>의 태수. 나무 성벽 하나, 곳간 하나, 그리고 주인이 자꾸 바뀌는 수많은 언덕. 그는 관인을 아직 소매에 넣은 채 쪽문으로 온다.'
	),
	say(
		'seohyeon',
		[
			'Manno.',
			'It’s— a long way. Ten days if the passes are open. The house is small. I haven’t seen it, but they said small, and the way they said it—',
			'I’m asking badly. I’m asking if you would—'
		],
		['만노라 하오.', '멀— 멀리 있소. 고개가 열려 있으면 열흘. 관사는 작소. 보진 못했지만 작다고 하더이다, 그 말투가 영—', '말을 엉망으로 하고 있소. 내 말은, 혹시 그대가—']
	),
	say('manmyung', ['Yes.'], ['네.']),
	say('seohyeon', ['—come with— I haven’t finished.'], ['—같이— 아직 말 안 끝났소.']),
	say('manmyung', ['Then finish. It’s still yes.'], ['그럼 끝내세요. 그래도 네예요.']),
	p(
		'The maid tells nobody. The charcoal man tells everybody. Her father knows by the next morning.',
		'하녀는 아무한테도 말하지 않는다. 숯장수는 모두에게 말한다. 이튿날 아침이면 그녀의 아버지가 안다.'
	),

	scene('Sukhuljong’s Hall', '숙흘종의 대청'),
	p(
		'Sukhuljong takes the news sitting down, the way he takes most things, without looking up from his cup. He is a king’s son and a king’s brother, and he has never once in his life been the one left standing.',
		'숙흘종은 대부분의 일을 받아들이듯 그 소식도 앉은 채로, 잔에서 눈도 떼지 않고 받는다. 그는 왕의 아들이고 왕의 아우이며, 평생 한 번도 서 있는 쪽이었던 적이 없다.'
	),
	say(
		'sukhuljong',
		['Muryuk’s boy.', 'The one whose father carried his country here in a box and set it on the floor in front of my brother.', 'Him?'],
		['무력이 아들놈.', '제 아비가 나라를 궤짝에 담아 와서 내 형님 앞 마루에 내려놓은 집.', '그놈이냐?']
	),
	say('manmyung', ['His father kept his sword, Father.', 'You keep a gate.'], ['그분 아버님은 칼을 지키셨어요, 아버지.', '아버지는 문을 지키시고요.']),
	say(
		'sukhuljong',
		['A Gaya chair in a Kim hall.', 'Every guest who came would sit on it just to hear it creak.', 'Then you can look at the gate from the inside.'],
		['김씨 대청에 가야 의자라.', '손님마다 삐걱대나 보려고 한 번씩 앉아 볼 게다.', '그럼 그 문을 안에서 실컷 보거라.']
	),
	say('manmyung', ['You can’t keep me in a room forever.'], ['평생 방에 가둬 두실 순 없어요.']),
	say('sukhuljong', ['I don’t need forever.', 'I need until he leaves for Manno.'], ['평생은 필요 없다.', '그놈이 만노로 떠날 때까지면 된다.']),
	p(
		'He shuts her in a house apart at the back of the compound and sets men on the door. Surabol has a word for what the two of them did, and it is not a polite one, and for a few weeks it is the only thing the city talks about.',
		'그는 딸을 집 뒤편 별채에 가두고 문에 사람을 세운다. 서라벌에는 두 사람이 한 짓을 가리키는 말이 있는데, 점잖은 말은 아니다. 몇 주 동안 도성은 그 이야기만 한다.'
	),

	scene('The House Apart', '별채'),
	p(
		'The guards are two cousins off one of Sukhuljong’s farms, chosen because they cannot be bribed and cannot read, and by the fourth night they have run out of things to say to each other.',
		'경비는 숙흘종네 농장에서 데려온 사촌 둘이다. 매수가 안 되고 글을 못 읽어서 뽑혔다. 나흘째 밤이 되자 서로 할 말이 바닥난다.'
	),
	say('First guard', ['You think he’ll come?'], ['올 것 같냐?']),
	say('Second guard', ['The Gaya one? He says sorry to his own horse.', 'He’s not coming over a wall.'], ['가야 놈? 그놈 제 말한테도 미안하다는 놈이야.', '담 넘어올 위인이 아니지.']),
	say('First guard', ['I heard he leaves for the north day after tomorrow. First light.'], ['모레 새벽에 북으로 떠난다던데.']),
	say('Second guard', ['Good. Then we go home.'], ['잘됐네. 그럼 우리도 집에 가고.']),
	p(
		'Inside, Manmyung has stopped eating to make a point and started again because the point was only hurting her. She has counted the boards in the ceiling. At the foot of the back wall, where the drain runs out, there is a gap, and she has been looking at it for three days the way her father looks at furniture.',
		'안에서 만명은 시위하느라 밥을 끊었다가, 그 시위가 저만 아프게 한다는 걸 알고 다시 먹기 시작했다. 천장 널빤지도 다 세어 보았다. 뒷담 아래, 도랑물이 빠져나가는 자리에 틈이 하나 있다. 그녀는 사흘째 그 틈을, 아버지가 가구를 보듯 쳐다보고 있다.'
	),
	p(
		'On the last night it storms. Lightning comes down on the door itself, and the guards do what men do when the sky picks out the house they are guarding, which is run. In the noise Manmyung goes out through a gap in the wall so low that she has to crawl, in her good silk, in the mud.',
		'마지막 밤, 폭풍이 친다. 벼락이 바로 그 문에 떨어지고, 하늘이 제가 지키는 집을 골라 내리치면 사람들이 하는 짓을 경비들도 한다. 도망친다. 그 소란 속에 만명은 담장 밑 틈으로 빠져나간다. 기어야 할 만큼 낮은 틈을, 좋은 비단옷을 입은 채, 진흙 속으로.'
	),
	say('Second guard', ['Heaven— it hit the door, it hit the DOOR—'], ['하늘이— 문을 쳤어, 문을 쳤다고—']),
	say('First guard', ['Leave it! It’s burning, leave the door, leave it—'], ['놔둬! 불붙었어, 문 놔둬, 놔두라고—']),
	Q_LOCKED,
	p(
		'He is at the bottom of the lane with two horses, because he has been there every one of the four nights, in case. He sees a shape come out of the drain on its elbows, stand up and walk toward him through the rain like a woman going to market.',
		'그는 말 두 마리를 데리고 골목 아래에 있다. 나흘 밤 내내, 혹시나 해서 거기 있었다. 웬 형체 하나가 팔꿈치로 도랑을 기어 나와 일어서더니, 장에 가는 여자처럼 빗속을 걸어 그에게 온다.'
	),
	say('manmyung', ['Don’t— don’t look at the dress.', 'Is the horse lost tonight?'], ['보지 마세요, 옷은—', '오늘 밤에도 말이 길을 잃었어요?']),
	say('seohyeon', ['You— the lightning— are you hurt? Your hands—'], ['그대— 벼락이— 다쳤소? 손이—']),
	say('manmyung', ['My hands are fine. Answer the question.'], ['손 멀쩡해요. 물은 거나 대답해요.']),
	say('seohyeon', ['…No.', 'Tonight it knows exactly where it’s going.'], ['…아니오.', '오늘 밤엔 어디로 가는지 똑똑히 알고 있소.']),
	p(
		'They ride north in the rain. Behind them, two cousins are trying to explain a door to Sukhuljong.',
		'둘은 빗속을 달려 북으로 간다. 뒤에서는 사촌 둘이 숙흘종에게 문 이야기를 해명하느라 애쓰고 있다.'
	),

	scene('Manno', '만노'),
	p(
		'Manno is a wooden wall, a granary, a county office with a leaking roof, and hills that have changed hands more often than the clerks can keep up with. Later it will be called Jincheon. She learns the granary. He learns the hills. Neither of them learns to cook, and by the second month the clerk’s wife has taken pity on them.',
		'만노는 나무 성벽 하나, 곳간 하나, 지붕 새는 관아 하나, 그리고 아전들이 따라잡지 못할 만큼 자주 주인이 바뀐 언덕들이다. 훗날 진천이라 불리게 될 곳이다. 그녀는 곳간을 익히고, 그는 언덕을 익힌다. 둘 다 밥 짓는 법은 못 익혀서, 두 달째부터는 아전의 아내가 딱하게 여겨 챙겨 준다.'
	),
	p(
		'He has a dream on a <i>gyeongjin</i> night and tells nobody for three weeks, because a Gaya man who dreams of stars coming down on him does not say so in a county office. Then, on a <i>sinchuk</i> night, she sits up in the dark and shakes him.',
		'그는 <i>경진</i>일 밤에 꿈을 꾸고 삼 주 동안 아무에게도 말하지 않는다. 별이 제게 내려오는 꿈을 꾼 가야 사내는 관아에서 그런 말을 하지 않는 법이다. 그러다 <i>신축</i>일 밤, 그녀가 어둠 속에서 벌떡 일어나 그를 흔든다.'
	),
	say(
		'manmyung',
		['Wake up. Wake up, I had— there was a boy.', 'In gold. Armour, all gold. He came in on a cloud, right into the hall, through the door like he owned the house. He looked at me.'],
		['일어나요. 일어나 봐요, 꿈에— 애가 있었어요.', '금빛으로. 갑옷이 온통 금빛. 구름을 타고 들어왔어요, 대청으로, 제집인 것처럼 문으로 쑥. 날 쳐다봤어요.']
	),
	say('seohyeon', ['…I had one too. Three weeks ago.', 'Two stars. A red one and a yellow one. They came down on me. Not on the house. On me.'], ['…나도 꿨소. 삼 주 전에.', '별 둘이오. 붉은 놈 하나, 누런 놈 하나. 내게 내려왔소. 집이 아니라. 내게.']),
	say('manmyung', ['Three weeks.', 'Stars fell on you and you didn’t tell me for three weeks.'], ['삼 주요.', '별이 떨어졌는데 삼 주 동안 말을 안 했어요?']),
	say('seohyeon', ['I thought it might be the soup.'], ['국 때문인 줄 알았소.']),
	say('manmyung', ['Pfft— the soup—', 'Come here, you. Come here.'], ['푸핫— 국—', '이리 와요, 당신. 이리 와.']),
	Q_DREAMS,
	p(
		'She is with child by spring. She is still with child the following spring, and the clerk’s wife, who has delivered half the county, stops coming to check and starts coming to stare.',
		'봄이 되자 그녀는 아이를 가진다. 그다음 봄에도 여전히 아이를 가진 채다. 고을 아이 절반을 받아 낸 아전의 아내는 살피러 오던 걸 그만두고 구경하러 오기 시작한다.'
	),
	say(
		'The clerk’s wife',
		['Twenty months, my lady.', 'I’ve had cows do it faster.', 'Either that child is something, or somebody counted wrong at the start, and I won’t say which. You’re the governor’s.'],
		['스무 달이에요, 마님.', '소도 이보단 빨라요.', '애가 보통이 아니거나, 처음부터 누가 셈을 틀렸거나. 어느 쪽인지는 말 안 해요. 사또댁이시니까.']
	),
	say('manmyung', ['Say it. I want to hear you say it.'], ['말해 봐요. 말하는 거 듣고 싶어요.']),
	say('The clerk’s wife', ['…The child’s something.'], ['…애가 보통이 아니에요.']),
	p(
		'In 595, the twelfth year of Geonbok, the boy is born in the county house at Manno. The clerk’s wife turns him over to wash him and stops with the cloth in her hand.',
		'595년, 건복 12년, 아이가 만노 관아에서 태어난다. 아전의 아내가 씻기려고 아이를 엎었다가, 천을 든 채로 멈춘다.'
	),
	say('The clerk’s wife', ['My lady. His back.', 'Look— there. There’s seven. Like someone pressed them in with a thumb.'], ['마님. 등이요.', '보세요— 여기. 일곱 개예요. 누가 엄지로 꾹꾹 찍은 것처럼.']),
	say('seohyeon', ['Seven what?'], ['일곱 개 뭐 말이오?']),
	say('The clerk’s wife', ['Stars, sir. The Dipper. On a baby.', 'I’m going to sit down.'], ['별이요, 나리. 북두칠성. 갓난애 등에.', '저 좀 앉을게요.']),
	quote(
		'庾信公以眞平王十七年乙卯生，稟精七曜，故背有七星文，又多神異。',
		'Lord Yushin was born in the <i>eulmyo</i> year, the seventeenth of King Jinpyeong. He was endowed with the essence of the Seven Luminaries, and so his back bore a pattern of seven stars; and there were many other wonders about him.',
		'유신공은 진평왕 17년 을묘에 태어났다. 칠요의 정기를 타고났으므로 등에 일곱 별 무늬가 있었고, 또 신이한 일이 많았다.',
		'Samguk Yusa (三國遺事) bk. 1, Marvels — Kim Yushin'
	),
	p('Naming him takes longer than carrying him did.', '이름 짓는 데는 품는 것보다 더 오래 걸린다.'),
	say('seohyeon', ['Gyeongjin.', 'I want to call him for the night I dreamed. That’s where he came from.'], ['경진.', '꿈꾼 그 밤 이름으로 부르고 싶소. 그 밤에서 왔으니.']),
	say('manmyung', ['You can’t name a child after a day.', 'Even I know that, and I ran away from all my tutors.'], ['날로 애 이름을 지을 순 없어요.', '선생님들한테서 죄다 도망친 나도 그건 알아요.']),
	say(
		'seohyeon',
		[
			'I know. I know.',
			'But <i>gyeong</i>, written down, looks like <i>yu</i>. And <i>jin</i>, said quickly, is nearly <i>sin</i>.',
			'And there was a man in the old books. A scholar. Yu Xin. A good man, they say.',
			'So it isn’t a day. It’s a scholar. Nobody can say anything.'
		],
		[
			'아오. 아오.',
			'그런데 <i>경</i>(庚)을 써 놓으면 <i>유</i>(庾)랑 닮았소. <i>진</i>(辰)은 빨리 말하면 <i>신</i>(信)이랑 거의 같고.',
			'그리고 옛 책에 그런 사람이 있었소. 선비요. 유신. 어진 사람이었다 하더이다.',
			'그러니 날이 아니라 선비 이름이오. 아무도 뭐라 못 하오.'
		]
	),
	say('manmyung', ['You’ve been working on this for months.'], ['이거 몇 달을 궁리했죠.']),
	say('seohyeon', ['…Twenty.'], ['…스무 달.']),
	quote(
		'及欲定名，謂夫人曰：「吾以庚辰夜吉夢得此兒，宜以爲名。然禮不以日月爲名，今庚與庾字相似，辰與信聲相近，況古之賢人有名庾信，盍以命之？」遂名庾信焉。',
		'When it came to choosing a name, he said to his wife: “I had a lucky dream on the <i>gyeongjin</i> night and got this child; it would be right to name him for it. But the rites do not allow a name from a day or a month. Now, <i>gyeong</i> 庚 resembles <i>yu</i> 庾 in writing, and <i>jin</i> 辰 is close to <i>sin</i> 信 in sound; what is more, there was a worthy of old named Yu Xin. Why not name him that?” So he was named Yushin.',
		'이름을 정하려 할 때 부인에게 말하기를, “내가 경진일 밤의 길한 꿈으로 이 아이를 얻었으니 마땅히 그것으로 이름을 지어야 하겠소. 그러나 예법에 날이나 달로 이름을 짓지 않으니, 지금 경(庚)은 유(庾)와 글자가 비슷하고 진(辰)은 신(信)과 소리가 가까우며, 하물며 옛 현인 가운데 유신이라 이름한 이가 있으니 어찌 그것으로 이름 짓지 않겠소?” 하여, 마침내 이름을 유신이라 하였다.'
	),
	p(
		'They bury the afterbirth on the high hill behind the county, the way you do with a child you mean to keep, and the hill keeps the name.',
		'그들은 아이의 태를 고을 뒤 높은 산에 묻는다. 꼭 붙들어 두고 싶은 아이에게 하듯이. 그리고 산이 그 이름을 지닌다.'
	),
	quote('初以庾信胎藏之高山，至今謂之胎靈山。', 'Yushin’s placenta was buried on a high hill, and to this day it is called Taeryeong, the Mountain of the Placenta Spirit.', '처음에 유신의 태를 높은 산에 묻었으므로, 지금까지 그 산을 태령산이라 부른다.'),
	say('manmyung', ['Yushin.', 'Say it to my father, next time you’re in Surabol. Say it at his gate.'], ['유신.', '다음에 서라벌에 가시거든 우리 아버지께 말씀하세요. 그 문 앞에서.']),
	say('seohyeon', ['…He won’t open it.'], ['…열어 주지 않으실 거요.']),
	say('manmyung', ['Then say it louder.'], ['그럼 더 크게 하세요.']),

	scene('The Name at the Gate', '문 앞의 이름'),
	p(
		'A few weeks after the birth he rides to Surabol and says the name at Sukhuljong’s gate, loudly, to a street that has stopped to listen. The gate does not open. A steward comes out instead.',
		'아이가 태어나고 몇 주 뒤 그는 서라벌로 가서, 숙흘종의 문 앞에서 그 이름을 크게 말한다. 거리가 걸음을 멈추고 듣는다. 문은 열리지 않는다. 대신 청지기가 나온다.'
	),
	say('Sukhuljong’s steward', ['His lordship is unwell.', 'He expects to be unwell for some years. He asked me to say it in exactly those words.'], ['나리께서 편찮으십니다.', '앞으로 몇 해는 편찮으실 것 같다 하십니다. 꼭 이 말 그대로 전하라 하셨습니다.']),
	say('seohyeon', ['Tell him—', 'Tell him the boy has his mother’s mouth.', 'He’ll know what that means.'], ['전해 주시오—', '아이가 제 어미 입을 닮았다고.', '무슨 뜻인지 아실 거요.']),
	say('Sukhuljong’s steward', ['…I’ll tell him, sir.', 'He won’t like it.'], ['…전하겠습니다, 나리.', '좋아하시진 않을 겁니다.']),

	scene('The Spring', '샘'),
	p(
		'He rides home the long way because he does not want to arrive yet. The road goes over a ridge beyond the city that nobody uses, and by noon he wants water more than he has ever wanted a shrine. When heat breathes out of the hillside he calls it a spring and gets down.',
		'그는 아직 도착하고 싶지 않아서 먼 길로 돌아간다. 길은 도성 너머 아무도 쓰지 않는 능선을 넘고, 한낮이 되자 그는 어느 사당보다도 물이 간절하다. 산허리에서 열기가 훅 뿜어져 나오자 그는 그것을 샘이라 부르고 말에서 내린다.'
	),
	p(
		'Under the hill three sisters keep the heat in the stone, the water in the dark and the moss on the roots: <b>Golhwa</b>, <b>Hyullé</b>, and <b>Narim</b>, the eldest, who also keeps the rules. They have gone centuries without a man coming down to them, and the hill has just told them about hooves on the road.',
		'언덕 아래에서 세 자매가 돌 속의 열기와 어둠 속의 물과 뿌리 위의 이끼를 지킨다. <b>골화</b>, <b>혈례</b>, 그리고 규칙까지 지키는 맏이 <b>나림</b>. 몇백 년째 사내 하나 내려온 적이 없는데, 방금 언덕이 길 위의 말발굽 소리를 일러 주었다.'
	),
	say('golhwa', ['Hooves! Unni. Unni, hooves. Someone stopped.'], ['말발굽! 언니. 언니, 말발굽. 누가 멈췄어.']),
	say('narim', ['Someone always stops. They drink, they piss in the stream, they leave.'], ['누군 늘 멈춰. 마시고, 개울에 오줌 누고, 가.']),
	say('hyulle', ['…This one’s crying a little.'], ['…이 사람, 조금 울어.']),
	say('golhwa', ['Crying? Let me see— move your elbow—'], ['운다고? 보자— 팔꿈치 좀 치워—']),
	say('golhwa', ['Fox. Let’s be a fox. Foxes are fun.'], ['여우. 여우 하자. 여우 재밌어.']),
	say('hyulle', ['A grandmother. Then he drinks and bows and goes, and nobody… nobody gets hurt.'], ['할머니. 그럼 마시고 절하고 가고, 아무도… 아무도 안 다쳐.']),
	say('narim', ['Try both. Then I pick.'], ['둘 다 해 봐. 그다음에 내가 골라.']),
	p(
		'They try both. The fox frightens the horse. The grandmother makes him kneel and offer her his waterskin with both hands, which is so polite that Golhwa groans out loud through the rock. Narim picks the last face herself: three young women in white jeogori over moss-green and ember and pale water-blue, sitting on the far rock as if they had always been there.',
		'둘 다 해 본다. 여우는 말을 놀라게 한다. 할머니에게는 그가 무릎을 꿇고 두 손으로 물주머니를 바치는데, 그게 하도 공손해서 골화가 바위 너머로 소리 내어 앓는다. 마지막 얼굴은 나림이 직접 고른다. 이끼빛과 불씨빛과 연한 물빛 치마 위에 흰 저고리를 입은 젊은 여자 셋이, 처음부터 거기 있었던 것처럼 건너편 바위에 앉아 있다.'
	),
	p(
		'He is still calling it a spring when the ground gives under his boot. He comes down through warm dark into a bowl of black water under stone and stands up coughing in a cloud of steam, soaked to the skin, his sword still somehow in his hand.',
		'그가 아직 샘이라고 부르고 있을 때 발밑의 땅이 꺼진다. 따뜻한 어둠을 지나 돌 아래 검은 물웅덩이로 떨어진 그는, 김이 자욱한 속에서 기침을 하며 일어선다. 흠뻑 젖은 채로, 어째선지 칼은 아직 손에 쥐고.'
	),
	say('seohyeon', ['Who— forgive me— who lives here?', 'I was looking for water. There was an old woman just now, up there—'], ['누구— 실례하오— 여기 누가 사시오?', '물을 찾고 있었소. 방금 위에 웬 노파가—']),
	say('hyulle', ['…That was me. Sorry.'], ['…그거 저예요. 죄송해요.']),
	say('narim', ['You found your water. All of it at once.', 'Put the sword down, please. You’ll cut the steam.'], ['물은 찾으셨네요. 한꺼번에 전부.', '칼 내려놓으세요. 김 베겠어요.']),
	say(
		'golhwa',
		['Hi. I’m Golhwa. That’s unni. That’s Hyullé, she won’t say hello unless you look at her first.', 'What’s your name? Say it slow.'],
		['안녕. 난 골화. 저긴 언니. 저긴 혈례, 먼저 쳐다봐 줘야 인사해.', '이름이 뭐야? 천천히 말해 봐.']
	),
	say('seohyeon', ['Kim. Kim Seohyeon.', 'Are you… I mean. People?'], ['김. 김서현이오.', '당신들은… 그러니까. 사람이오?']),
	p(
		'At the surname all three of them go quiet. <i>Kim</i> is the sound their own steam makes coming off the water, and nobody has ever said it to them as a name.',
		'성을 듣는 순간 셋 다 조용해진다. <i>김</i>은 그들의 물에서 피어오르는 김이 내는 바로 그 소리인데, 누구도 그것을 이름으로 그들에게 말해 준 적이 없다.'
	),
	say('golhwa', ['Kim.', 'Say it again. No, I heard you. It just… sticks.'], ['김.', '다시 말해 봐. 아니, 들었어. 그냥… 자꾸 붙어.']),
	say('narim', ['Kim.', '…Then the house rules apply. Golhwa. Chin.'], ['김.', '…그럼 집 규칙대로 해요. 골화. 턱.']),
	p(
		'Golhwa is across the pool before he can step back, a wet hand under his jaw, turning his face to the light like a horse trader.',
		'그가 물러서기도 전에 골화가 웅덩이를 건너와, 젖은 손으로 그의 턱을 받치고 말 장수처럼 얼굴을 빛 쪽으로 돌린다.'
	),
	say('golhwa', ['Smooth. Shaved this morning? For who— oh. For the gate. Poor thing.', 'Chin passes, unni.'], ['매끈해. 아침에 밀었네? 누구 보라고— 아. 그 문. 불쌍해라.', '턱 통과, 언니.']),
	say('narim', ['Second rule. Nobody stands in this water dressed.', 'The steam doesn’t talk to cloth.'], ['두 번째 규칙. 이 물엔 옷 입고 서 있는 사람 없어요.', '김은 옷이랑은 말 안 해요.']),
	say('seohyeon', ['I— I have a wife. She’s— we have a son, he’s—', 'I’m sorry. I should have said that first.'], ['나는— 아내가 있소. 그 사람이— 아들도 있소, 이제—', '미안하오. 그 말부터 했어야 했는데.']),
	say('golhwa', ['We didn’t ask about her.'], ['그 사람 얘긴 안 물어봤는데.']),
	say('hyulle', ['…You can turn around. We won’t— we won’t look.'], ['…돌아서셔도 돼요. 저희— 안 볼게요.']),
	say('golhwa', ['Speak for yourself.'], ['너나 그래.']),
	p(
		'He turns his back, takes off the wet clothes and folds them badly on a rock, because he does not know what else to do with his hands. Hyullé does not look, mostly. Golhwa does not pretend. Narim waits until he is in the water to the chest and then lets out a breath, which nobody remarks on.',
		'그는 등을 돌리고 젖은 옷을 벗어 바위 위에 서툴게 갠다. 손을 달리 어디 둘지 몰라서. 혈례는 대체로 안 본다. 골화는 안 보는 척도 안 한다. 나림은 그가 가슴께까지 물에 들어갈 때까지 기다렸다가 숨을 내쉬는데, 아무도 그 얘기는 하지 않는다.'
	),
	say('narim', ['Today we are the mouths the hill uses when it gets tired of being stone.', 'Ask it one thing, Kim. From the water. Once.'], ['오늘 저희는 언덕이 돌인 게 지겨울 때 쓰는 입이에요.', '하나만 물으세요, 김. 물속에서. 한 번.']),
	p('He thinks of the gate. He thinks of a girl crawling through a hole in a wall in her good silk.', '그는 그 문을 생각한다. 좋은 비단옷을 입고 담장 구멍으로 기어 나오던 여자를 생각한다.'),
	say(
		'seohyeon',
		['I have a son. A few weeks old.', 'My wife’s father won’t say his name. I stood at his gate this morning and said it for him, and—', 'I don’t know what to ask for him. I don’t know what you ask for a boy like that.'],
		['아들이 있소. 몇 주 됐소.', '아내의 아버지는 그 아이 이름을 입에 안 올리오. 오늘 아침 그 문 앞에서 내가 대신 불렀는데—', '그 애를 위해 뭘 물어야 할지 모르겠소. 그런 아이를 위해선 뭘 묻는 거요.']
	),
	p('Their eyes go solid, green and cyan and ember, and the cave stops being funny.', '그들의 눈이 통째로 물든다. 초록, 청록, 불씨. 동굴은 더 이상 우습지 않다.'),
	HILL,
	p('Narim puts a river stone in his hand, ordinary and grey and too warm for the cave.', '나림이 그의 손에 강돌 하나를 쥐여 준다. 평범한 회색 돌인데, 동굴에 있기엔 너무 따뜻하다.'),
	say('narim', ['Keep it in your sleeve.', 'When it’s warm, come back. Same road, same water. One question.', 'When you’re too old to climb, send the boy.'], ['소매에 넣어 두세요.', '따뜻해지면 다시 오세요. 같은 길, 같은 물. 질문 하나.', '오를 수 없을 만큼 늙으면, 그 아이를 보내세요.']),
	say('golhwa', ['Shaved.'], ['면도하고.']),
	say('seohyeon', ['…Can I tell his mother?'], ['…그 애 엄마한테 말해도 되겠소?']),
	say('golhwa', ['Tell her it was a spring.', 'Everybody says that.'], ['샘이었다고 해.', '다들 그렇게 말해.']),
	p(
		'He rides north with a stone in his sleeve that will not cool. At Manno, Manmyung is sitting up with the baby in the lamplight, and she asks him where he has been all day, and he tells her he found a spring.',
		'그는 식지 않는 돌을 소매에 넣고 북쪽으로 달린다. 만노에서는 만명이 등불 아래 아기를 안고 앉아 있다. 하루 종일 어디 있었느냐고 그녀가 묻자, 그는 샘을 찾았다고 말한다.'
	),
	say('manmyung', ['A spring.', '…You’re smiling like a man who found three.'], ['샘이요.', '…샘을 세 개쯤 찾은 사람처럼 웃고 계시네요.']),
	say('seohyeon', ['…It was a very good spring.'], ['…아주 좋은 샘이었소.']),
	say('manmyung', ['Mm.', 'Your hair’s wet. It hasn’t rained in a week.'], ['흠.', '머리가 젖었네요. 일주일째 비 한 방울 안 왔는데.']),

	scene('Fifteen', '열다섯'),
	p(
		'The boy grows up at the edge of things, in county houses on the Goguryeo road, with a younger brother, Heumsun, and two sisters the household calls by their baby names, A-hae and A-ji. They will grow up to be Bohui and Munhui and to cause a great deal of trouble over a skirt.',
		'아이는 변방에서, 고구려 길 위의 관사들에서 자란다. 남동생 흠순이 있고, 집에서 아명으로 부르는 누이 둘, 아해와 아지가 있다. 둘은 자라서 보희와 문희가 되고, 치마 한 벌을 두고 큰 소동을 일으키게 된다.'
	),
	p(
		'At fifteen he is made a hwarang, and the boys who follow him start calling themselves the Dragon-Flower Band. Seohyeon hears it from a clerk before he hears it from his son.',
		'열다섯에 그는 화랑이 되고, 그를 따르는 아이들은 스스로를 용화향도라 부르기 시작한다. 서현은 그 소식을 아들보다 아전에게서 먼저 듣는다.'
	),
	quote('公年十五歲爲花郞，時人洽然服從，號龍華香徒。', 'At fifteen the lord became a hwarang. The people of the time followed him gladly, and his band was called the Dragon-Flower Incense Band.', '공은 나이 열다섯에 화랑이 되었는데, 당시 사람들이 기꺼이 따랐으며 그 무리를 용화향도라 불렀다.'),
	p(
		'The morning Yushin leaves for Surabol, his father stops him at the gate of the county house to look at his headband.',
		'유신이 서라벌로 떠나는 아침, 아버지가 관사 문간에서 그를 세워 머리띠를 본다.'
	),
	say('seohyeon', ['You’ve got it on crooked.'], ['삐뚤게 맸구나.']),
	say('yushin', ['It’s fine, Father.'], ['괜찮습니다, 아버님.']),
	say('seohyeon', ['It’s crooked. Hold still.', 'In Surabol they’ll look at the headband before they look at you. They’ll look for anything.'], ['삐뚤다. 가만있어.', '서라벌에선 너보다 띠부터 볼 거다. 뭐든 찾으려고 볼 거야.']),
	say('yushin', ['Because we’re Gaya.'], ['가야 집안이라서요.']),
	say('seohyeon', ['…Because you’re new.', 'Mostly because you’re new.'], ['…새로 와서지.', '대개는, 새로 와서.']),
	p(
		'He reties it with both hands, too tight, and then does it a third time. Manmyung watches from the doorway and lets him.',
		'그는 두 손으로 다시 맨다. 너무 꽉. 그러고는 세 번째로 또 맨다. 만명은 문간에서 지켜보며 그냥 둔다.'
	),
	say('manmyung', ['Let him go. He’ll be late for his own band.'], ['보내 줘요. 제 무리한테 늦겠어요.']),
	say('yushin', ['Mother—'], ['어머님—']),
	say('manmyung', ['And stop at your grandfather’s gate on the way.', 'Don’t knock. Just let them see you.'], ['가는 길에 외할아버지 댁 문 앞에 들러.', '두드리진 말고. 그냥 보여 줘.']),

	scene('Daeyang', '대량주'),
	p(
		'Seohyeon rises the way a Gaya man rises in Surabol, one rank at a time, each one signed by someone who remembers the box. By the end he is a <i>sopan</i>, third rank in the kingdom, and Governor-General of Daeyang Province, the south-western march that faces Baekje, with its seat at Daeya Fortress. Yushin’s memorial stone will give his father a different name, Soyeon, and the historian, unable to decide between them, writes both down and moves on.',
		'서현은 가야 사내가 서라벌에서 오르는 방식대로 오른다. 한 계단씩, 그 궤짝을 기억하는 누군가의 서명을 받아 가며. 마지막엔 나라의 셋째 품계인 <i>소판</i>, 그리고 백제를 마주한 서남쪽 변경 대량주의 도독이 된다. 치소는 대야성이다. 훗날 유신의 비석은 그의 아버지를 소연이라는 다른 이름으로 적고, 사관은 어느 쪽인지 정하지 못해 둘 다 적어 두고 넘어간다.'
	),
	quote(
		'祖武力，爲新州道行軍摠管，嘗領兵獲百濟王及其將四人，斬首一萬餘級。父舒玄，官至蘇判大梁州都督安撫大梁州諸軍事。',
		'His grandfather Muryeok was Commander of the Army of the Sinju Circuit; he once led troops that captured the king of Baekje and four of his generals and took more than ten thousand heads. His father Seohyeon rose to the rank of Sopan, Governor-General of Daeyang Province and Pacifier of all the armies of Daeyang Province.',
		'할아버지 무력은 신주도 행군총관이 되어, 일찍이 군사를 거느리고 백제 왕과 그 장수 넷을 사로잡고 1만여 급의 목을 베었다. 아버지 서현은 벼슬이 소판 대량주도독 안무대량주제군사에 이르렀다.'
	),
	p(
		'In the evenings he walks the wall at Daeya. Baekje is a line of hills to the west that the sun goes down behind.',
		'저녁이면 그는 대야성 성벽을 걷는다. 백제는 서쪽으로 늘어선 언덕들이고, 해가 그 뒤로 진다.'
	),
	say('A Daeya officer', ['They say this wall can’t be taken, sir.'], ['이 성은 못 뺏는다들 합니다, 나리.']),
	say(
		'seohyeon',
		[
			'They say that about— every wall, I think. I’ve heard it about four.',
			'Just— keep the granary dry. And know whose hands the keys are in.',
			'My wife ran the granary at Manno. She’d tell you the same. She’d tell you better.'
		],
		['그런 말은— 성마다 다 하더이다. 내가 들은 것만 넷이오.', '그냥— 곳간이나 마르게 두시오. 열쇠가 누구 손에 있는지 알고.', '만노에선 아내가 곳간을 맡았소. 같은 말을 할 거요. 나보다 잘.']
	),
	p(
		'The histories do not record the year he died, only how high he got. He climbs the ridge beyond the city whenever the stone in his sleeve is warm, shaved every time, until the climb is too much for him, and then he sends the name. The boy with seven stars on his back finds the same water forty years after the gate, and the hill knows his walk before he does.',
		'사서는 그가 죽은 해를 적지 않았다. 얼마나 높이 올랐는지만 적었다. 그는 소매 속 돌이 따뜻해질 때마다 도성 너머 능선을 오른다. 매번 면도를 하고. 그러다 오르기 버거워지자 그 이름을 보낸다. 등에 일곱 별을 지닌 아이는 그 문 앞의 일로부터 사십 년 뒤 같은 물을 찾아내고, 언덕은 그보다 먼저 그의 걸음을 알아본다.'
	)
];

const raw = JSON.stringify(blocks);
const missing = (entry.images ?? []).filter((im) => im.at && !raw.includes(im.at));
if (missing.length) throw new Error(`image anchors lost: ${missing.map((m) => m.id).join(', ')}`);
for (const b of blocks) {
	if (b.kind === 'dialogue' && b.en.length !== b.lines.length) throw new Error(`en/ko length mismatch: ${b.en[0]}`);
	if (b.kind === 'p' && !b.ko) throw new Error(`p missing ko: ${b.html.slice(0, 40)}`);
}

entry.blocks = blocks;
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`Seohyun: ${old.length} -> ${blocks.length} blocks; backup at ${BACKUP}`);
