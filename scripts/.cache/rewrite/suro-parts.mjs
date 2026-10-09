/**
 * #41 Suro rewrite: The Sky and the Mountain (Ibiga × Right View, two eggs) → Turtle Peak (the whole Gujiga,
 * six eggs, six founders, the league) → The Red Sail (the queen contest, Heo last, night walks, the son).
 * Keeps the DAY 2 return and the closing card. Run once: `node scripts/.cache/rewrite/suro-parts.mjs` (`DRY=1` to test).
 */
import { editStory, lists, textOf } from '../story-ops.mjs';

const P = (html, ko, extra = {}) => ({ kind: 'p', html, ko, ...extra });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
const S = (speaker, gender, chip, en, ko) => ({ kind: 'dialogue', chip, speaker, gender, lines: ko, en });

const MARK = 'The Sky and the Mountain';

/** Old image anchors that no longer exist in the new text → new fragment. Per-id overrides win. */
const REANCHOR = {
	'Queen Heo': 'steps down into the shallows',
	'She dies at a hundred': 'spent the last night on deck',
	'Inside you…': 'Two nights in a tent',
	'or have you already begun to take me.': 'or have you already begun to take me',
	'My country is gone. Only': 'the lamp is still lit when the boy arrives'
};
const REANCHOR_ID = { 'scene-suro-heo-goodbye-22': 'a red sail comes round the headland' };

const edit = (fn) =>
	editStory((s) => {
		const r = fn(s);
		if (process.env.DRY) console.log(r === false ? 'skip' : 'ok (dry)');
		return process.env.DRY ? false : r;
	});

edit((story) => {
	const entries = story.flatMap((c) => c.entries);
	const e = entries[40];
	if (e.title !== 'Suro') throw new Error(`#41 is ${e.title}`);
	if (e.blocks.some((b) => b.kind === 'scene' && b.label === MARK)) return false;

	const chips = {};
	for (const x of entries)
		for (const b of x.blocks) if (b.kind === 'dialogue' && b.person && b.chip && !chips[b.person]) chips[b.person] = b.chip;
	const D = (person, en, ko) => ({ kind: 'dialogue', chip: chips[person] ?? '#8a8a94', person, lines: ko, en });

	const keep = (pred, what) => {
		const b = e.blocks.find(pred);
		if (!b) throw new Error(`missing ${what}`);
		return b;
	};
	const card = (id) => keep((b) => b.kind === 'card' && b.person === id, `card ${id}`);
	const quoteSuro = keep((b) => b.kind === 'quote' && b.hanja?.startsWith('身長九尺'), 'Suro quote');
	const quoteSong = keep((b) => b.kind === 'quote' && b.hanja?.startsWith('龜何龜何'), 'Gujiga quote');
	const diagram = keep((b) => b.kind === 'diagram' && b.diagram === 'gaya-league', 'diagram');
	const placeGeumgwan = keep((b) => b.kind === 'place' && b.place === 'geumgwan', 'place geumgwan');
	const wed = keep((b) => b.kind === 'wed', 'wed');
	const dayAt = e.blocks.findIndex((b) => b.kind === 'day' && b.label === 'DAY 2');
	if (dayAt < 0) throw new Error('no DAY 2');
	const tail = e.blocks.slice(dayAt);

	const SKY = '#1e4d9c';
	const GREY = '#8a8a94';

	/* ───────────── Part one: The Sky and the Mountain ───────────── */
	const partOne = [
		e.blocks[0],
		SCENE(MARK, '하늘과 산'),
		P(
			'<b>Ibiga</b> keeps the sky the way other gods keep a hall. Cloud is his body. The living world is a map he does not usually read. Then he looks down.',
			'<b>이비가</b>는 다른 신들이 전각을 지키듯 하늘을 지킨다. 구름이 그의 몸이다. 이승은 평소 잘 펼쳐 보지 않는 지도다. 그러다 내려다본다.'
		),
		card('ibiga'),
		P(
			'On her mountain, the Lady of the Right View is on watch. At first she is only the ridge: jade stone, mist, a shape the hill has not admitted to. The mountain is a woman before it has a face. Then a face comes out of the stone. She is guarding the mountain as if it were a country. She does not look up. Cloud comes down to the ridge anyway.',
			'산 위에서 <b>정견모주</b>가 지킨다. 처음엔 그냥 능선이다. 옥빛 돌, 안개, 산이 아직 인정하지 않은 모양. 산은 얼굴이 생기기 전부터 여자다. 그러다 돌에서 얼굴이 나온다. 나라를 지키듯 산을 지킨다. 올려다보지 않는다. 그래도 구름은 능선으로 내려온다.'
		),
		card('jeonggyeon'),
		P(
			'He has been flying lower every day for a month. The pines noticed before she did. The crows noticed before the pines.',
			'그는 한 달 내내 날마다 조금씩 낮게 날았다. 그녀보다 소나무가 먼저 눈치챘다. 소나무보다 까마귀가 먼저.'
		),
		D(
			'ibiga',
			['That ridge…', 'That woman.', 'I’ve flown over this mountain a thousand times. Since when does it look back?'],
			['저 능선…', '저 여자.', '이 산 위를 천 번은 날았는데. 언제부터 산이 나를 쳐다봤지?']
		),
		D(
			'jeonggyeon',
			['Since you started flying low enough to knock the crows off my pines.', 'Land or leave, sky.'],
			['네가 내 소나무에서 까마귀를 떨굴 만큼 낮게 날기 시작한 뒤부터.', '내려앉든지 가든지 하거라, 하늘아.']
		),
		P(
			'Love arrives the way weather does. It does not ask. He falls before he lands. The sky comes down to touch the mountain, and does not leave.',
			'사랑은 날씨처럼 온다. 묻지 않는다. 그는 내려앉기 전에 먼저 떨어진다. 하늘이 산에 닿으러 내려오고, 떠나지 않는다.'
		),
		D(
			'ibiga',
			['Mountain.', 'Your shoulder’s warmer than cloud. I was told mountains were cold.'],
			['산아.', '네 어깨가 구름보다 따뜻하구나. 산은 차갑다고 들었는데.']
		),
		D(
			'jeonggyeon',
			['Told by whom. Other mountains?', 'Why has heaven come down. To look? Or to touch.', 'If to touch… kneel first.'],
			['누구한테. 다른 산들한테?', '하늘이 왜 내려왔느냐. 구경이냐. 만지려고냐.', '만지려거든… 무릎부터 꿇거라.']
		),
		D(
			'ibiga',
			['To touch.', 'I looked… and could not hold back.', 'And look. Already kneeling. I’m quick.'],
			['만지려고.', '보다가… 참을 수가 없어서.', '봐. 벌써 꿇었어. 내가 좀 빠르거든.']
		),
		D(
			'jeonggyeon',
			['You’re loud, is what you are.', '…Then closer.', 'Ridges don’t keep guests long. I’ll make an exception.'],
			['시끄러운 거겠지.', '…그럼 더 가까이.', '능선은 손님을 오래 붙잡지 않는다. 이번만 봐주마.']
		),
		D(
			'ibiga',
			['Your name’s Right View, isn’t it.', 'The longer I look at you, the less right my thoughts get.'],
			['네 이름이 정견이랬지. 바르게 본다고.', '오래 볼수록 생각이 하나도 안 바르구나.']
		),
		D(
			'jeonggyeon',
			['Then stay wrongful.', 'Nights when heaven kneels on a mountain are not so common.'],
			['그럼 그른 채로 있거라.', '하늘이 산 위에 무릎 꿇는 밤은 그리 흔치 않으니.']
		),
		P(
			'Cloud covers the ridge. What happens under it is not for the song.',
			'구름이 능선을 덮는다. 그 아래 일은 노래가 다룰 몫이 아니다.'
		),
		P(
			'Down in the valley, a farmer waits for dusk to bring his ox in. Dusk is in no hurry. He naps, wakes, and the shadow of his fence post hasn’t moved a finger. The cocks crow at nothing, then give up. A grandmother hangs the washing, and it dries, and she hangs it again. Nobody looks up. Some things in the sky you don’t stare at.',
			'아래 골짜기에서 농부가 소를 들이려고 해 질 녘을 기다린다. 해 질 녘은 서두르지 않는다. 낮잠을 자고 깨도 울타리 말뚝 그림자가 손가락 하나만큼도 움직이지 않았다. 닭들이 아무것도 아닌 데 대고 울다가 그만둔다. 할머니가 빨래를 넌다. 마른다. 또 넌다. 아무도 올려다보지 않는다. 하늘 일 중에는 빤히 쳐다보면 안 되는 것도 있다.'
		),
		D(
			'jeonggyeon',
			['…You’re still here.', 'The valley will notice.'],
			['…아직 있네.', '골짜기가 눈치챌 거다.']
		),
		D(
			'ibiga',
			['Let it.', 'Let it stay afternoon a little longer.', 'Your neck, here. Is it always this warm, or is that me?'],
			['눈치채라 그래.', '오후가 조금만 더 가게 두자.', '네 목, 여기. 원래 이렇게 따뜻해, 아니면 나 때문이야?']
		),
		D(
			'jeonggyeon',
			['Don’t flatter yourself.', '…Don’t stop, either.'],
			['우쭐대지 마라.', '…멈추지도 말고.']
		),
		P(
			'He holds her with one arm. The other is cloud. The ridge is still a mountain. The mountain is still a woman. She does not look up. She doesn’t have to.',
			'한 팔로 그녀를 안는다. 다른 팔은 구름이다. 능선은 여전히 산이고, 산은 여전히 여자다. 그녀는 올려다보지 않는다. 그럴 필요가 없다.'
		),
		P(
			'On the seventh morning, the farmer’s ox comes home in a perfectly ordinary dusk, and nobody in the valley mentions the week. By morning the ridge remembers two gods who would not let go. From that heat come eggs. Two of them, warm as hearthstones, cupped in her lap.',
			'이레째 되던 날, 농부의 소가 아주 평범한 해 질 녘에 집으로 돌아오고, 골짜기의 누구도 그 한 주 이야기를 꺼내지 않는다. 아침이 되면 능선은 놓지 않던 두 신을 기억한다. 그 열기에서 알이 나온다. 둘. 아궁이 돌처럼 따뜻한 알 둘이 그녀의 무릎에 안겨 있다.'
		),
		D('ibiga', ['Two!', '…Mine?'], ['둘이다!', '…내 거야?']),
		D(
			'jeonggyeon',
			['Whose else. The crows’?', 'Take them down, sky. Somewhere people will have to sing for them.'],
			['그럼 누구 거냐. 까마귀 거냐?', '데려가거라, 하늘아. 사람들이 노래 불러야 받을 수 있는 데로.']
		),
		P(
			'He takes them down. He knows the way to the turtle-shaped hill above the southern coast rather well, it turns out. He doesn’t say why. She doesn’t ask. There are other mountains on this coast, and other rivers, and one or two of them have had a funny look about them all spring.',
			'그는 알을 데리고 내려간다. 남쪽 바닷가 위 거북 모양 언덕으로 가는 길을 의외로 잘 안다. 왜인지는 말하지 않는다. 그녀도 묻지 않는다. 이 바닷가엔 다른 산들도, 다른 강들도 있고, 그중 한둘은 봄 내내 표정이 묘했다.'
		)
	];

	/* ───────────── Part two: Turtle Peak ───────────── */
	const partTwo = [
		SCENE('Turtle Peak', '구지봉'),
		P(
			'Down on the coast, nobody saw any of this. They remember a very long afternoon, and they don’t talk about it.',
			'바닷가 사람들은 이 일을 아무도 보지 못했다. 아주 긴 오후 하나를 기억할 뿐이고, 그 얘기는 하지 않는다.'
		),
		P(
			'The coast has nine chiefs and no king. Nine chiefs means nine opinions about every boundary stone, so mostly they argue. Each spring, on washing day, they bring their people down to the stream to scrub off the winter.',
			'바닷가엔 추장이 아홉이고 임금은 없다. 추장이 아홉이면 경계석 하나에도 의견이 아홉이라, 대개는 싸운다. 봄마다 몸 씻는 날이 오면 사람들을 이끌고 냇가로 내려가 겨울 때를 벗긴다.'
		),
		P(
			'This spring, a voice comes down from the peak above the stream, the one shaped like a turtle lying in the sun.',
			'올봄엔 냇가 위 봉우리에서 목소리가 들려온다. 볕에 엎드린 거북처럼 생긴 그 봉우리다.'
		),
		S('A voice on the peak', 'm', SKY, ['Anybody down there?'], ['거기 누구 있나?']),
		S('The eldest chief', 'm', GREY, ['…We’re here.', 'Who’s asking?'], ['…여기 있소.', '누가 묻는 거요?']),
		S('A voice on the peak', 'm', SKY, ['Where’s this, then?'], ['여긴 어디지?']),
		S(
			'The eldest chief',
			'm',
			GREY,
			['Guji. Turtle Peak.', '…You don’t know where you are?'],
			['구지요. 거북봉.', '…어딘지도 모르고 거기 있소?']
		),
		S(
			'A voice on the peak',
			'm',
			SKY,
			[
				'Heaven wants a country here, and a king for it. He’s coming down. You’ll like him. Good-looking boy.',
				'Dig at the top. Everybody take a handful of earth. Then sing, and dance. Loudly. Don’t be shy.'
			],
			[
				'하늘이 여기다 나라를 세우고 임금을 앉히라 하신다. 그 임금이 내려간다. 마음에 들 거야. 잘생겼거든.',
				'꼭대기를 파라. 다들 흙 한 줌씩 쥐고. 그리고 노래하고 춤춰라. 크게. 부끄러워 말고.'
			]
		),
		P(
			'The voice is easy and a little amused. It sounds like it has been somewhere warm for a week.',
			'목소리는 느긋하고 조금 재미있어하는 투다. 한 주쯤 어딘가 따뜻한 데 있다 온 목소리 같다.'
		),
		S(
			'A villager',
			'm',
			GREY,
			['Sing what?', 'He wants us to tell the turtle to stick its head out or we’ll roast it.', '…We’re threatening the mountain?'],
			['뭘 불러?', '거북한테 머리 내밀라고, 안 그러면 구워 먹겠다고 하래.', '…우리가 산을 협박한다고?']
		),
		S('The eldest chief', 'm', GREY, ['Sing it nicely.'], ['곱게 불러.']),
		P(
			'This is how a coast with nine chiefs learns to sing a song to call for a new king: badly at first, then louder, with a few hundred people stamping on a hill and promising to eat it.',
			'추장 아홉 둔 바닷가가 새 임금을 부르는 노래를 배우는 방식이 이렇다. 처음엔 엉망으로, 그다음엔 더 크게. 사람 수백이 언덕을 쿵쿵 밟으며 언덕을 먹어 버리겠다고 다짐한다.'
		),
		quoteSong,
		P(
			'A purple rope comes down out of the sky and touches the ground. At its end, wrapped in red cloth, sits a gold box. They unwrap the cloth on a box of six eggs, round and gold as the sun.',
			'하늘에서 자줏빛 줄이 내려와 땅에 닿는다. 줄 끝에 붉은 보자기로 싼 금빛 상자가 있다. 보자기를 풀자 해처럼 둥글고 누런 알 여섯이 든 상자가 나온다.'
		),
		S('The eldest chief', 'm', GREY, ['…Eggs?'], ['…알?']),
		S('A villager', 'm', GREY, ['Six. In a box. From the sky.'], ['여섯이요. 상자에. 하늘에서.']),
		S(
			'The eldest chief',
			'm',
			GREY,
			['I can see it’s from the sky. I’m asking why it’s eggs.'],
			['하늘에서 온 건 나도 보여. 왜 하필 알이냐고 묻는 거다.']
		),
		P(
			'Nobody in Samhan finds this as strange as you’d think. Goguryeo’s founder came out of an egg too, and you saw how that went. Six more, then. Two of them you’ve already met, sort of, on a ridge, in a long afternoon. The other four? The sky is wide. It gets around.',
			'삼한 사람들은 이걸 생각만큼 이상하게 여기지 않는다. 고구려 시조도 알에서 나왔고, 그게 어떻게 됐는지는 보셨다. 그럼 여섯 더. 그중 둘은 이미 만났다. 말하자면 그렇다. 능선 위에서, 긴 오후에. 나머지 넷은? 하늘은 넓다. 여기저기 잘 다닌다.'
		),
		P(
			'The eldest chief carries the box home and sets it on a table, and nobody sleeps. By morning the eggs are boys. Within a fortnight the boys are taller than the chiefs, which the chiefs take personally.',
			'맏추장이 상자를 집에 들고 가 상 위에 올려 둔다. 아무도 잠을 못 잔다. 아침이 되자 알은 사내아이가 되어 있다. 보름이 못 돼 아이들은 추장들보다 키가 커지고, 추장들은 그걸 섭섭하게 여긴다.'
		),
		card('suro'),
		quoteSuro,
		P(
			'The first one out is <b>Suro</b>. He looks at the sea, and keeps looking, like a man expecting a delivery.',
			'맨 먼저 나온 아이가 <b>수로</b>다. 바다를 본다. 계속 본다. 뭔가 배달 올 걸 기다리는 사람처럼.'
		),
		P(
			'Half a breath behind him comes his twin from the ridge. He looks at the mountains instead, and you can watch him measuring them. He will be <b>Ijinasi</b>, and the hills of Great Gaya will be his.',
			'숨 반 박자 늦게 능선에서 온 쌍둥이가 나온다. 그는 바다 대신 산을 본다. 산의 치수를 재고 있는 게 보인다. 그가 <b>이진아시</b>가 되고, 대가야의 산들이 그의 것이 된다.'
		),
		D(
			'ijinasi',
			['Six eggs. Six thrones.', 'Take the larger hill. …Fine. I’ll take it.'],
			['알 여섯. 왕좌 여섯.', '큰 언덕을 가져라. …됐다. 내가 가진다.']
		),
		D('suro', ['…Take it.', 'I want… the sea.'], ['…가지시오.', '과인은… 바다요.']),
		P(
			'The other four have their own ideas. One takes Ara, and wants a horse before he can walk; his people will one day put armour on their horses. One takes the little Goryeong Gaya far up the river, and is so quiet his brothers forget to invite him to things.',
			'나머지 넷도 다 제 생각이 있다. 하나는 아라를 가진다. 걷기도 전에 말부터 찾더니, 그 나라 사람들은 훗날 말에게까지 갑옷을 입힌다. 하나는 강을 한참 거슬러 올라간 작은 고령가야를 가진다. 어찌나 조용한지 형제들이 모일 때마다 부르는 걸 잊는다.'
		),
		P(
			'One takes Seongsan, the hill nearest the neighbours, and spends his life staring at them over the wall. The last takes Sogaya, a bay full of boats, and smells of salt before he is a week old.',
			'하나는 이웃과 가장 가까운 언덕 성산을 가진다. 평생 담 너머 이웃을 노려본다. 막내는 배가 가득한 만, 소가야를 가진다. 태어난 지 이레도 안 돼 소금 냄새가 난다.'
		),
		P(
			'Six boys, six kings before their voices break. Suro’s harbour becomes Golden Gaya. They do not crown one brother above the rest. They meet, they argue, they sell iron.',
			'사내아이 여섯이 목소리가 굵어지기도 전에 임금 여섯이 된다. 수로의 포구는 금관가야가 된다. 형제 중 누구 하나를 나머지 위에 앉히지 않는다. 모이고, 다투고, 쇠를 판다.'
		),
		P(
			'So Gaya doesn’t have a crown. It has a league of iron harbours, six of them, give or take. No one king can lock the vote. Surabol would find that exhausting.',
			'그래서 가야에는 왕관이 없다. 쇠의 항구들이 맺은 연맹이 있다. 대략 여섯. 어느 한 임금도 표를 잠글 수 없다. 서라벌이라면 진이 빠졌을 것이다.'
		),
		diagram,
		placeGeumgwan
	];

	/* ───────────── Part three: The Red Sail ───────────── */
	const partThree = [
		SCENE('The Red Sail', '붉은 돛'),
		P(
			'Six years go by. Suro has a palace, a harbour and a market. He does not have a wife, and the nine chiefs have opinions about that too.',
			'여섯 해가 지난다. 수로에겐 궁궐도, 포구도, 장터도 있다. 아내만 없다. 아홉 추장은 이 일에도 의견이 있다.'
		),
		S(
			'The eldest chief',
			'm',
			GREY,
			['Majesty. My brother’s girl is sixteen. Good teeth. She can count to a thousand.'],
			['전하. 제 아우의 딸이 열여섯입니다. 이가 고르고요. 천까지 셉니다.']
		),
		S('A younger chief', 'm', GREY, ['Mine counts to a thousand backwards.'], ['제 딸은 천부터 거꾸로 셉니다.']),
		D(
			'suro',
			[
				'Heaven put me here… in a box.',
				'Heaven can find me a wife.',
				'…Still. Post a notice. Every road, every pier. Whoever wants to be queen… let her come.'
			],
			['하늘이 과인을… 상자에 담아 내려보냈소.', '아내도 하늘이 찾아 주겠지.', '…그래도. 방을 붙이시오. 길마다, 나루마다. 왕비가 되고 싶은 이는… 오라 하시오.']
		),
		S('The eldest chief', 'm', GREY, ['From where, Majesty?'], ['어디서 말입니까, 전하?']),
		D('suro', ['Anywhere.', '…Not the village. If it can be helped.'], ['어디서든.', '…동네만 아니면. 될 수 있으면.']),
		P(
			'The notice goes up on every road and every pier. Then the women come.',
			'방이 길마다, 나루마다 붙는다. 그리고 여자들이 온다.'
		),
		P(
			'The first rides down from Goguryeo on a horse she has clearly taken from someone important. Dotted skirt, sleeves tied back, a bow across her shoulders. She shoots an arrow into the welcome post, so they know she’s here.',
			'첫째는 고구려에서 말을 타고 내려온다. 누가 봐도 꽤 높은 사람한테서 끌고 온 말이다. 점박이 치마, 질끈 동여맨 소매, 어깨에 걸친 활. 도착했다는 걸 알리려고 환영 기둥에 화살을 박는다.'
		),
		P(
			'From Dongye on the east coast comes a woman in a spotted sealskin cloak, with a dowry of short bows and a long story about her village’s tiger god. Her people never marry inside their own clan, she explains. She has run out of clans.',
			'동해안 동예에서는 점박이 바다표범 가죽 망토를 두른 여자가 온다. 혼수로 짧은 활을 싸 오고, 마을 호랑이 신 이야기를 길게 늘어놓는다. 자기네는 같은 씨족끼리 절대 혼인하지 않는단다. 씨족이 다 떨어졌단다.'
		),
		P(
			'From Okjeo comes a girl who was sent to live in her future husband’s house at ten, as is their custom. She has come to say she’d like to try a different husband. She brings salted fish. A great deal of salted fish.',
			'옥저에서는 열 살에 제 풍습대로 장래 신랑 집에 보내져 자란 처녀가 온다. 신랑을 바꿔 보고 싶어서 왔단다. 소금에 절인 생선을 들고 왔다. 아주 많이.'
		),
		P(
			'From Nangnang, the Han commandery up north, comes a lady in a lacquered palanquin. A maid walks in front of her holding up a bronze mirror, so she can keep checking.',
			'북쪽 한나라 군현 낙랑에서는 옻칠한 가마를 탄 귀부인이 온다. 시녀 하나가 앞장서 걸으며 청동 거울을 들어 준다. 계속 들여다볼 수 있게.'
		),
		P(
			'From Mahan in the west comes a chief’s daughter wearing more jade beads than skin. In Mahan beads count for more than gold. She can’t turn her head quickly.',
			'서쪽 마한에서는 살갗보다 옥구슬이 더 많이 보이는 추장의 딸이 온다. 마한에선 구슬이 금보다 귀하다. 고개를 빨리 돌리지 못한다.'
		),
		S(
			'The eldest chief',
			'm',
			GREY,
			['Majesty. The Nangnang lady wants to know which one is the king.'],
			['전하. 낙랑 아씨가 누가 임금이냐고 묻습니다.']
		),
		D('suro', ['…Tell her. The man on the rock.'], ['…말하시오. 바위 위에 선 사내라고.']),
		S('The eldest chief', 'm', GREY, ['That’s me, Majesty.'], ['그건 저입니다, 전하.']),
		D('suro', ['Yes.'], ['그렇소.']),
		P(
			'Every morning of the contest, Suro goes down to the beach in a plain coat and stands in the crowd. A king can’t think on a dais. Everyone keeps looking at him.',
			'겨루는 내내 아침마다 수로는 수수한 두루마기를 걸치고 바닷가에 내려가 구경꾼 틈에 선다. 임금은 단 위에서 생각을 못 한다. 다들 쳐다보니까.'
		),
		P(
			'From Jinhan, next door, comes a silk-weaver’s daughter with mulberry-stained fingers, who spends the whole contest inspecting the other women’s hems.',
			'바로 옆 진한에서는 손가락이 뽕물에 든 비단 짜는 집 딸이 온다. 겨루는 내내 다른 여자들 옷단만 살핀다.'
		),
		P(
			'From the Byeonhan villages up the river, practically family, comes a smith’s daughter with tattooed forearms. She brings an iron ingot for a dowry and asks where the forge is.',
			'강 위쪽 변한 마을에서는, 거의 집안사람이나 다름없는, 팔뚝에 문신한 대장장이 딸이 온다. 혼수로 쇳덩이를 들고 와서 대장간이 어디냐고 묻는다.'
		),
		P(
			'From across the strait comes a Wa priestess with comma-shaped jade at her throat and red paint on her cheeks. She says she has dreamed of this beach, and will not say what happened in the dream.',
			'바다 건너 왜에서는 목에 굽은 옥을 걸고 볼에 붉은 칠을 한 무녀가 온다. 이 바닷가 꿈을 꾸었단다. 꿈에서 무슨 일이 있었는지는 말하지 않는다.'
		),
		P(
			'From Han China, by way of three boats and a long apology, comes a magistrate’s niece in sleeves that sweep the floor. She has never seen the sea before, and is sick in it twice.',
			'한나라에서는 배 세 척과 긴 사과를 거쳐 고을 수령의 조카딸이 온다. 소매가 바닥을 쓴다. 바다를 처음 본다. 그 바다에 두 번 토한다.'
		),
		P(
			'From Tamla, the island to the south, comes a diver who rows herself across, swims the last stretch because the boat is too slow, and walks up the beach wringing out her hair.',
			'남쪽 섬 탐라에서는 해녀 하나가 혼자 노를 저어 건너온다. 배가 느려 터져서 마지막 물길은 헤엄쳐 오고, 머리를 비틀어 짜며 해변을 걸어 올라온다.'
		),
		P(
			'On the last afternoon, when the chiefs have nearly agreed on the Mahan beads, a red sail comes round the headland from the southwest.',
			'마지막 날 오후, 추장들이 마한의 구슬로 거의 뜻을 모았을 때, 남서쪽 곶을 돌아 붉은 돛 하나가 나타난다.'
		),
		P(
			'She arrives on a red-sailed ship, the last of them and from farthest away. With her come a brother, two old servants and their wives, and a chest nobody is allowed to touch. She is twenty-one, and built like nowhere on this coast. She has spent the last night on deck, and it shows only in her eyes.',
			'그녀는 붉은 돛을 단 배를 타고 온다. 가장 늦게, 가장 먼 데서. 오라비 하나, 늙은 종 둘과 그 아내들, 그리고 아무도 손대지 못하는 궤짝 하나를 데리고. 스물하나, 이 해안 어디에도 없는 몸이다. 지난밤을 갑판에서 꼬박 새웠는데, 그게 눈에만 드러난다.'
		),
		P(
			'She steps down into the shallows before anyone can carry her. Suro is in the crowd, four rows back, behind a fish seller. He came to judge a contest. He sees one woman, and love hits him before protocol can stand up.',
			'누가 안아 내리기도 전에 얕은 물로 내려선다. 수로는 구경꾼 틈, 넷째 줄, 생선 장수 뒤에 있다. 겨루기를 판가름하러 왔다. 여자 하나를 보고, 예법이 일어서기도 전에 사랑에 맞는다.'
		),
		D('suro', ['…Who.', 'Who is that.'], ['…누구.', '저건 누구요.']),
		S(
			'A fish seller',
			'f',
			GREY,
			['Late, is who. Isn’t it over?', '…Sir? You’re standing on my fish.'],
			['늦은 사람이지 누구긴. 끝난 거 아니었어?', '…저기요? 내 생선 밟고 계신데.']
		),
		card('heohwangok'),
		P(
			'She does not go to the palace. The chiefs send men to fetch her, and she sends them back: she doesn’t follow strangers, however nicely dressed. Instead she climbs the hill above the beach, takes off her silk trousers and offers them to the mountain spirit. Half the coast watches. Suro watches as if the rite were meant for him alone.',
			'그녀는 궁으로 가지 않는다. 추장들이 사람을 보내 모셔 오려 하자 돌려보낸다. 아무리 잘 차려입었어도 낯선 이를 따라가진 않는단다. 대신 해변 위 언덕에 올라 비단 바지를 벗어 산신께 바친다. 바닷가 사람 절반이 지켜본다. 수로는 그 제사가 자기 하나만을 위한 것인 양 지켜본다.'
		),
		S('Her brother', 'm', GREY, ['Sister. They’ll talk.'], ['누이. 사람들이 말할 거요.']),
		D(
			'heohwangok',
			['They’re talking already.', 'Let them talk about something worth it.'],
			['이미 하고 있어요.', '기왕이면 말할 거리가 되는 걸로 하게 두세요.']
		),
		P(
			'That night he walks down to her fire without the crown. He tells himself it is diplomacy.',
			'그날 밤 그는 관을 벗고 그녀의 모닥불로 내려간다. 외교라고 스스로에게 말한다.'
		),
		D('heohwangok', ['You’re the man who stood on the fish.'], ['생선 밟고 서 계시던 분이네요.']),
		D('suro', ['…I— I am—'], ['…과인은— 과인이—']),
		D(
			'heohwangok',
			['The king. I know.', 'Kings always think a plain coat works. You stood like you owned the beach.'],
			['임금님이시죠. 알아요.', '임금들은 수수한 옷만 입으면 되는 줄 알더라고요. 해변이 다 제 것인 양 서 계셨어요.']
		),
		D('suro', ['…I do own the beach.'], ['…해변은 과인 것이 맞소.']),
		D('heohwangok', ['There. You see?'], ['그것 보세요.']),
		D('suro', ['Walk.', '…Would you walk. With me.'], ['걸읍시다.', '…걷겠소. 과인과.']),
		D(
			'heohwangok',
			[
				'Have you come to fetch me… or have you already begun to take me?',
				'With your eyes, I mean.',
				'Walk slower. I’ve been on a boat two months. The ground is still moving.'
			],
			['저를 모시러 오셨어요… 아니면 벌써 가져가시는 중이세요?', '눈으로요.', '천천히 걸으세요. 두 달을 배 위에 있었어요. 땅이 아직 흔들려요.']
		),
		P(
			'They walk the tide line. Her brother follows at a polite distance, then at a less polite one.',
			'둘은 물때 자국을 따라 걷는다. 오라비가 점잖은 거리를 두고 따라오다가, 덜 점잖은 거리로 물러난다.'
		),
		D('suro', ['Why. Why come so far.'], ['어째서. 어째서 그리 먼 데서 왔소.']),
		D(
			'heohwangok',
			[
				'My father dreamed a god told him there was a king across the sea with no wife.',
				'He woke my mother to tell her. She’d dreamed the same thing. That settled it.',
				'A loud god, apparently. Very pleased with himself. Do you know him?'
			],
			['아버지 꿈에 신이 나와서, 바다 건너에 아내 없는 임금이 있다고 했대요.', '어머니를 깨워서 얘기했더니, 어머니도 똑같은 꿈을 꿨대요. 그걸로 끝났죠.', '목소리 큰 신이었대요. 자기 자신한테 아주 흡족한. 아는 분이에요?']
		),
		D('suro', ['…Possibly.', 'And— the dream. Was it lying?'], ['…아마도.', '그래서— 그 꿈. 거짓이었소?']),
		D('heohwangok', ['Too early to say. Ask me tomorrow.'], ['아직 몰라요. 내일 물어보세요.']),
		P(
			'The second night he comes earlier. She already has the fire going, which he decides not to mention.',
			'이튿날 밤 그는 더 일찍 온다. 그녀는 이미 불을 피워 두었다. 그는 그 얘기는 하지 않기로 한다.'
		),
		D('heohwangok', ['Say it. Ayuta.'], ['해 보세요. 아유타.']),
		D('suro', ['A-yu—'], ['아-유—']),
		D(
			'heohwangok',
			['Ta. Tongue on your teeth.', '…Closer. Yes.', 'Terrible. Again.'],
			['타. 혀를 이에 대고요.', '…더 가까이. 그렇지.', '형편없어요. 다시.']
		),
		D('suro', ['…Your river. Tell me your river.'], ['…그대의 강. 그대의 강을 말해 주시오.']),
		D(
			'heohwangok',
			[
				'Brown. Warm. At festival we set lamps on it, thousands, and they float off and nobody knows where.',
				'Maybe here.'
			],
			['누렇고, 따뜻해요. 축제 때 등불을 띄워요. 수천 개. 떠내려가는데, 어디로 가는지는 아무도 몰라요.', '여기로 오는지도 모르죠.']
		),
		D('suro', ['…One came here.'], ['…하나는 여기 왔소.']),
		D(
			'heohwangok',
			['Majesty, that was dreadful.', '…Say another one.'],
			['전하, 그건 정말 별로였어요.', '…하나 더 해 보세요.']
		),
		P(
			'Somewhere between the tide line and the tent, the walk stops being a walk. Her brother, who has followed at a polite distance for two nights, turns around and goes to bed. Two nights in a tent by the water, before anyone may say marriage, and the lamp on the hill burns late.',
			'물때 자국과 천막 사이 어디쯤에서 산책은 산책이기를 그만둔다. 이틀 밤을 점잖은 거리에서 따라오던 오라비는 돌아서서 자러 간다. 혼인이라는 말이 나오기 전, 물가 천막에서의 이틀 밤. 언덕 위 등잔은 늦도록 꺼지지 않는다.'
		),
		P(
			'She turns, and he sees the curve of her hip catching lamp through the silk. He is kissing the throat he will marry before anyone has told him he may. Later she lies watching the width of his back while he trims the wick, and doesn’t hide what it does to her mouth.',
			'그녀가 몸을 돌리자 비단 너머로 등잔불을 받은 허리선이 보인다. 그는 누가 허락하기도 전에 장차 혼인할 목에 입을 맞추고 있다. 나중에 그가 심지를 다듬는 동안, 그녀는 누운 채 그의 넓은 등을 바라보고, 그게 제 입가에 어떻게 번지는지 감추지 않는다.'
		),
		D('heohwangok', ['Slowly.', 'The way you said my name. Again.'], ['천천히요.', '아까 제 이름 부르던 대로요. 다시.']),
		D(
			'suro',
			['…At this rate I will learn the language.', 'Or I won’t.', 'I will fall apart first.'],
			['…이러다간 과인이 그대 말을 배우겠소.', '아니면 못 배우거나.', '먼저 무너지겠지.']
		),
		D(
			'heohwangok',
			['Then fall.', 'I’ll put you back together. I’m good with my hands.'],
			['그럼 무너지세요.', '제가 다시 맞춰 드릴게요. 손재주가 좋거든요.']
		),
		D('suro', ['…It is morning.', 'I cannot… take my hands away.'], ['…아침이오.', '손을… 뗄 수가 없소.']),
		D(
			'heohwangok',
			['Then don’t. Your ministers can wait outside. They seem good at it.'],
			['그럼 떼지 마세요. 대신들은 밖에서 기다리면 돼요. 잘하시던데요.']
		),
		D('suro', ['…The ministers are outside.', 'Before I go in… once more.'], ['…대신들이 밖에 있소.', '들어가기 전에… 한 번만 더.']),
		D('heohwangok', ['Once?', 'What a modest king.'], ['한 번요?', '참 겸손한 임금님이시네.']),
		D('suro', ['Not modest.', '…Holding on. Barely.'], ['겸손한 게 아니오.', '…버티는 거요. 겨우.']),
		D(
			'heohwangok',
			[
				'And you still haven’t asked me.',
				'To marry you, Majesty. Properly. In daylight. In front of everyone who sent men to fetch me.'
			],
			['그리고 아직 안 물어보셨어요.', '혼인하자고요, 전하. 제대로요. 대낮에. 저 모셔 오라고 사람 보낸 분들 다 보는 앞에서.']
		),
		P(
			'In the timber court of Golden Gaya she presents herself that same morning. No servant speaks for her. She gives her own name, Heo Hwang-ok, and her own country. The chiefs who backed the Mahan beads study their feet. Suro is off the dais before protocol can stand. He comes down with one arm out, the same hold the sky once used on a ridge.',
			'바로 그날 아침, 금관가야의 나무 조정에 그녀가 스스로 선다. 대신 말해 주는 종은 없다. 제 이름, 허황옥, 그리고 제 나라를 제 입으로 댄다. 마한 구슬을 밀던 추장들은 제 발끝만 본다. 수로는 예법이 일어서기도 전에 단에서 내려와 있다. 한 팔을 내밀며 내려온다. 언젠가 하늘이 능선에 쓰던 그 안음이다.'
		),
		D('suro', ['…Will you.'], ['…하겠소.']),
		D('heohwangok', ['Yes. Now say it so they can hear.'], ['네. 이제 다들 들리게 말씀하세요.']),
		D('suro', ['Will you be… my queen.'], ['과인의… 왕비가 되어 주겠소.']),
		D('heohwangok', ['There. That wasn’t so hard.'], ['거봐요. 그렇게 어렵지 않잖아요.']),
		wed,
		P(
			'She becomes the first queen of Golden Gaya. They will be married a hundred and fifty years. The record is firm about this, and entirely untroubled by it.',
			'그녀는 금관가야의 첫 왕비가 된다. 둘은 백오십 년을 부부로 살 것이다. 기록은 이 대목에서 단호하고, 조금도 개의치 않는다.'
		),
		P(
			'In the second spring, the lamp is still lit when the boy arrives. He comes out loud, like his father’s side of the family, and looks around the room with her eyes.',
			'두 번째 봄, 등잔이 아직 켜져 있을 때 사내아이가 태어난다. 아버지 쪽 집안을 닮아 우렁차게 나오고, 엄마의 눈으로 방 안을 둘러본다.'
		),
		D(
			'heohwangok',
			['Look at him.', 'He has my father’s nose. Poor thing.', '…Don’t look at me. I’m allowed to cry. I crossed a sea for this.'],
			['좀 보세요.', '우리 아버지 코를 닮았네. 불쌍하게.', '…쳐다보지 마세요. 울어도 돼요. 이거 하나 보자고 바다를 건넜는데.']
		),
		D('suro', ['He has… everything.', 'His name. What name.'], ['다… 가졌소.', '이름. 무슨 이름을.']),
		D(
			'heohwangok',
			['You name this one. Later two of them get my name. Promise.'],
			['이 아이는 전하가 지으세요. 나중에 둘은 제 성을 주시고요. 약속해요.']
		),
		D('suro', ['…Two. Yours. Promised.', 'Geodeung.'], ['…둘. 그대 성으로. 약속하오.', '거등.']),
		D('heohwangok', ['Geodeung.', '…Ugly. I love it.'], ['거등.', '…못생긴 이름. 좋아요.']),
		P(
			'Half this coast, half a warm brown river nobody here has seen. Kingdoms will come and go on this shore. The eyes keep turning up anyway, a generation here and there, like a word nobody can quite translate.',
			'반은 이 바닷가, 반은 여기 누구도 본 적 없는 누렇고 따뜻한 강. 이 해안에서 나라들은 생겼다 사라질 것이다. 그래도 그 눈은 한 대 걸러 한 번씩 다시 나타난다. 아무도 똑바로 옮기지 못하는 낱말처럼.'
		)
	];

	e.blocks = [...partOne, ...partTwo, ...partThree, ...tail];

	const strip = (s) => s.replace(/<[^>]+>/g, '');
	const hay = lists(e).flat().map((b) => strip(textOf(b))).join('\n');
	const missing = [];
	for (const im of e.images ?? []) {
		if (REANCHOR_ID[im.id]) im.at = REANCHOR_ID[im.id];
		if (!im.at || hay.includes(strip(im.at))) continue;
		const next = REANCHOR[im.at];
		if (!next || !hay.includes(next)) missing.push(`${im.id} :: ${im.at}`);
		else im.at = next;
	}
	if (missing.length) throw new Error(`unanchored images:\n${missing.join('\n')}`);
	return true;
});
