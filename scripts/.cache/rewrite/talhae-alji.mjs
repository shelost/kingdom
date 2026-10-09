/**
 * Flesh-out of the Silla founding myths after Hyukgose: Talhae (Dapana, the Suro contest, Aejin, Toham's horn cup,
 * the Crescent House, the rice-cake tooth count, the first vote) and Alji (the box, the pine-scented cup, Talhae's
 * death, the Pasa vote, Michu, Hwabaek). Keeps every anchored block, both first-line hooks and both closing cards.
 * Run: `node scripts/.cache/rewrite/talhae-alji.mjs` (`DRY=1` to test). Idempotent: skips when the markers exist.
 */
import { editStory, textOf } from '../story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
const CARD = (person, caption, ko) => ({ kind: 'card', person, caption, ko });

const CHIP = {
	talhae: '#5a7fa8',
	hogong: '#a8894a',
	suro: '#8B5CF6',
	aejin: '#8d8d95',
	namhae: '#7f9c8a',
	yuri_isageum: '#7aa6d6',
	alji: '#d4a72c',
	kangrim: '#5f5f6b',
	michu: '#c9a43a'
};
const D = (person, en, ko) => ({ kind: 'dialogue', person, chip: CHIP[person] ?? '#8a8a94', lines: ko, en });
const S = (speaker, chip, en, ko, gender = 'm') => ({ kind: 'dialogue', speaker, gender, chip, lines: ko, en });

const LEE = (en, ko) => S('Elder Lee', '#7a9e6b', en, ko);
const CHOI = (en, ko) => S('Elder Choi', '#5a8fc4', en, ko);
const JEONG = (en, ko) => S('Elder Jeong', '#9a8f7a', en, ko);

function pick(e, frag, kind) {
	const b = e.blocks.find((x) => (!kind || x.kind === kind) && textOf(x).includes(frag));
	if (!b) throw new Error(`${e.title}: no block with “${frag}”`);
	return b;
}

function talhae(e) {
	const old = (frag, kind) => pick(e, frag, kind);
	const hook = e.blocks[0];
	const card = e.blocks.find((b) => b.kind === 'card' && b.person === 'talhae');
	if (!card) throw new Error('Talhae card missing');
	const nineFeet = old('身長九尺', 'quote');
	const gourdQuote = old('瓠公者', 'quote');
	const ministerQuote = old('拜瓠公爲大輔', 'quote');
	const closing = e.blocks.at(-1);
	if (!/^\s*<b>/.test(closing.html)) throw new Error('Talhae closing card moved');

	const fish = old('You’re not a fish.');
	Object.assign(fish, { person: 'aejin', chip: CHIP.aejin });
	delete fish.speaker;

	return [
		hook,
		SCENE('Dapana, a thousand li beyond Wa', '다파나, 왜 너머 천 리'),
		old('was delivered of an egg'),
		P(
			'The night she lets it go, she talks to the egg the whole way down to the water, the way mothers talk to things that can’t answer yet.',
			'알을 놓아 보내던 밤, 왕비는 물가로 내려가는 내내 알에게 말을 건다. 아직 대답 못 하는 것에게 어미들이 늘 그러듯.'
		),
		S(
			'The Queen of Dapana',
			'#b88aa8',
			['Hush. …No, that’s me. I’m the one making the noise.', 'Go wherever you’re wanted. Somebody will want you.', 'Make a house first. Then a country. In that order, if you can manage it.'],
			['쉿. …아, 나구나. 시끄러운 건 나네.', '너를 반기는 데로 가. 누군가는 반길 거야.', '집부터 이루고, 나라는 그다음에. 될 수 있으면 그 순서로.'],
			'f'
		),
		P(
			'The books say a red dragon swims out behind the chest as far as the open sea, so that nobody can bring it back. Nobody wrote down what the king did that night. The queen stood on the beach until there was nothing left to look at.',
			'사서는 붉은 용 한 마리가 궤짝 뒤를 따라 먼바다까지 헤엄쳐 나갔다고 한다. 아무도 도로 끌고 오지 못하게. 그날 밤 왕이 무엇을 했는지는 아무도 적지 않았다. 왕비는 더 바라볼 것이 남지 않을 때까지 바닷가에 서 있었다.'
		),

		SCENE('Golden Gaya', '금관가야'),
		{
			kind: 'map',
			year: 42,
			places: ['geumgwan', 'surabol'],
			caption: 'Two beaches, one chest, and two kingdoms that each tell it to their own credit.',
			ko: '바닷가 둘, 궤짝 하나, 그리고 그 이야기를 저마다 제 자랑으로 하는 나라 둘.'
		},
		P(
			'It reaches Gaya first. Silla’s chronicle says King Suro came down to the beach with drums, and the whole town shouted at the chest to make it stay. It didn’t. Silla tells that part with a perfectly straight face.',
			'궤짝은 먼저 가야에 닿는다. 신라의 기록에 따르면 수로왕이 북을 치며 바닷가로 내려왔고, 온 고을이 궤짝더러 머물라고 소리쳤다. 궤짝은 머물지 않았다. 신라는 이 대목을 아주 진지한 얼굴로 전한다.'
		),
		P(
			'The dates don’t work, by the way. Gaya puts him on its beach a lifetime later, as a grown man. Nobody in either kingdom has ever let that spoil a good story.',
			'덧붙이자면 연대가 맞지 않는다. 가야는 한 사람 평생쯤 뒤에, 다 큰 사내로 그를 제 바닷가에 올려놓는다. 두 나라 누구도 그런 일로 좋은 이야기를 망친 적은 없다.'
		),
		old('Gaya tells it differently'),
		card,
		nineFeet,
		P(
			'That is Silla’s book. Gaya’s makes him three feet tall, with a head a foot around. You can guess whose hall he lost in.',
			'그건 신라의 책이다. 가야의 책에서 그는 키가 석 자에 머리 둘레가 한 자다. 누구네 전각에서 졌는지 짐작이 갈 것이다.'
		),
		old('I’ve come for your throne.'),
		old('…Heaven gave it to me.'),
		D('suro', ['And the people. I can’t… give you the people.', 'They aren’t a chair.'], ['그리고 백성은. 백성을… 그대에게 줄 수는 없소.', '백성은 의자가 아니오.']),
		D(
			'talhae',
			['Then let’s not fight like farmers. Arts, Majesty.', 'Whoever is better at being something else.'],
			['그럼 농사꾼처럼 싸우지는 맙시다. 술법으로 하지요, 폐하.', '누가 딴것이 되는 데 더 능한지.']
		),
		D('suro', ['…Something else?'], ['…딴것?']),
		P(
			'So they fight the way kings fight in that country. Talhae becomes a hawk, and Suro becomes an eagle.',
			'그래서 둘은 그 나라에서 왕들이 겨루는 방식으로 겨룬다. 탈해가 매가 되자 수로는 독수리가 된다.'
		),
		P(
			'The hawk goes for the rafters. The eagle is already there. For one beat its talons close around the hawk’s back, hard enough to feel the bones, and then they open.',
			'매가 서까래로 내닫는다. 독수리가 이미 거기 있다. 한순간 발톱이 매의 등을 움켜쥔다. 뼈가 느껴질 만큼 세게. 그리고 펴진다.'
		),
		P(
			'Talhae becomes a sparrow, small enough to hide in a lattice. Suro becomes a falcon, which is the bird that eats sparrows. It drops on him once and misses by the width of a feather, on purpose.',
			'탈해가 참새가 된다. 창살 틈에 숨을 만큼 작다. 수로는 새매가 된다. 참새를 잡아먹는 새다. 새매가 한 번 내리꽂히고, 깃털 하나 너비로 빗나간다. 일부러.'
		),
		P(
			'When Talhae is a man again he is standing in the middle of the hall with feathers on his shoulders. He is breathing hard, and he bows.',
			'탈해가 다시 사람이 되었을 때 그는 어깨에 깃털을 얹은 채 전각 한가운데 서 있다. 숨이 거칠다. 그리고 절을 한다.'
		),
		D('talhae', ['…That was a falcon.', 'You had me twice. Why didn’t you—'], ['…새매였군.', '두 번이나 잡았잖소. 왜—']),
		D(
			'suro',
			['I don’t… like it. The killing.', 'And you looked hungry. Are you— there’s food.'],
			['과인은… 싫소. 죽이는 거.', '그리고 그대, 배고파 보였소. 혹시— 먹을 게 있소만.']
		),
		D('talhae', ['Ha. No. No, thank you.', 'I’ll find a country with a smaller king.'], ['하. 아니, 됐소. 고맙소만.', '왕이 좀 작은 나라를 찾아보지.']),
		P(
			'He walks straight out of the hall and down to the ferry, toward the lane the Han ships use. Suro, who has just spared him twice, sends five hundred ships after him. Mercy is one thing. A man who can turn into a sparrow, loose on your own coast, is another.',
			'그는 곧장 전각을 나와 나루로 내려간다. 한나라 배들이 다니는 뱃길 쪽이다. 방금 그를 두 번 살려 준 수로가 그 뒤로 배 오백 척을 보낸다. 자비는 자비고, 참새로 변하는 사내를 제 바닷가에 풀어 두는 건 또 다른 일이다.'
		),
		P(
			'The ships chase him to the edge of another king’s water and turn back. Gaya’s chronicle lets him go there, small and dripping and grinning. Silla picks up the story with a baby.',
			'배들은 다른 임금의 바다 끝까지 그를 쫓다가 돌아선다. 가야의 기록은 거기서 그를 놓아준다. 작고, 흠뻑 젖고, 씩 웃는 채로. 신라는 아기 하나로 이야기를 이어받는다.'
		),

		old('Ajinpo', 'scene'),
		P(
			'Either way, the chest goes on. At Ajinpo an old woman sees magpies wheeling over a rock that was never in that sea. She rows out, hauls the chest in with a rope and opens it, and there is a little boy inside, sitting among the treasure as if it were his luggage.',
			'어느 쪽이든 궤짝은 계속 간다. 아진포의 한 노파가, 그 바다에 있은 적 없는 바위 위로 까치들이 맴도는 것을 본다. 노를 저어 나가 밧줄로 궤짝을 끌어올려 열어 보니, 안에 사내아이 하나가 보물 사이에 짐 보따리라도 되는 듯 앉아 있다.'
		),
		CARD('aejin', 'Aejin. Her son fishes for the king. Today she has caught something better.', '아진의선. 아들은 임금의 고기를 잡는다. 오늘 그녀는 그보다 나은 것을 낚았다.'),
		fish,
		old('Is this the country?'),
		D('aejin', ['What country?'], ['무슨 나라?']),
		D('talhae', ['The one I’m supposed to make. Mother said.'], ['제가 세우기로 한 나라요. 어머니가 그랬어요.']),
		D('aejin', ['…Make it after supper.'], ['…저녁 먹고 세워라.']),
		old('the one who got loose'),
		D('aejin', ['Those bones aren’t for nets. Go and learn something.'], ['그 뼈대는 그물 당기라고 생긴 게 아니다. 가서 뭐라도 배워.']),
		D('talhae', ['I’ve learned where the fish are.'], ['고기 있는 데는 다 배웠는데요.']),
		D('aejin', ['Then learn where the land is. Fish don’t leave you a house.'], ['그럼 땅 있는 데를 배워. 고기는 집을 남겨 주지 않아.']),
		P(
			'He grows nine cheok tall and fishes to feed her, and never once complains about it. He keeps the chest by his bed long after he has outgrown it. And he studies, the way she told him to. Geography, mostly the part about where the good ground is.',
			'그는 아홉 자로 자라고, 고기를 낚아 노파를 먹이며 한 번도 싫은 내색을 하지 않는다. 궤짝은 몸이 훌쩍 커 버린 뒤에도 머리맡에 둔다. 그리고 노파 말대로 공부를 한다. 지리를. 주로 좋은 땅이 어디 있는지에 관한 부분을.'
		),

		SCENE('Mount Toham', '토함산'),
		P(
			'When he is grown he climbs Mount Toham, the high ridge east of the city, with two servants and a walking stick. On top he piles up a little stone hut and sits in it for seven days, looking down at Surabol like a man reading a menu.',
			'다 자라자 그는 지팡이 하나와 종 둘을 데리고 도성 동쪽 높은 등성이, 토함산에 오른다. 꼭대기에 돌을 쌓아 작은 움막을 짓고, 이레 동안 그 안에 앉아 서라벌을 내려다본다. 차림표 읽는 사람처럼.'
		),
		P(
			'On the way down he sends a servant called Baegui for water. Baegui is thirsty too, and the spring is a long way from his master, so he drinks first.',
			'내려오는 길에 그는 백의라는 종을 물 뜨러 보낸다. 백의도 목이 마르고, 샘은 주인에게서 멀다. 그래서 먼저 마신다.'
		),
		P('When he comes back, the horn cup is stuck to his mouth. He tugs. It doesn’t move.', '돌아온 백의의 입에 뿔잔이 붙어 있다. 잡아당긴다. 꿈쩍도 않는다.'),
		D('talhae', ['Something wrong with the water?'], ['물에 무슨 문제라도 있나?']),
		S('Baegui', '#8a8a94', ['Mmf— mm— mmmf.'], ['읍— 으— 읍.']),
		D(
			'talhae',
			['Drank first, did you.', 'Say you won’t again. Near or far. Say it and mean it.'],
			['먼저 마셨구나.', '다시는 안 그러겠다고 해. 가까운 데서든 먼 데서든. 진심으로.']
		),
		S('Baegui', '#8a8a94', ['Nnever— mmf— never again, master, near or far—'], ['다시는— 읍— 다시는 안 그럽니다, 나리, 가깝든 멀든—']),
		P(
			'The cup drops off into his hand. Baegui never cheats his master again, the chronicle says, and Talhae keeps the cup. A man who means to live among liars can use one.',
			'잔이 툭 떨어져 손에 들린다. 사서는 백의가 다시는 주인을 속이지 않았다고 한다. 그리고 탈해는 그 잔을 간직한다. 거짓말쟁이들 사이에서 살 작정인 사내에게는 쓸모가 있다.'
		),
		old('Looking over the city'),
		gourdQuote,

		SCENE('The Crescent House', '반월의 집'),
		old('Talhae does not have a house. He has a plan.'),
		old('I have lived in that house thirty years!'),
		old('Dig by the gate'),
		old('black and convincing'),
		old('…You buried those last night.'),
		e.blocks[e.blocks.indexOf(old('…You buried those last night.')) + 1],
		old('every king of Silla lives in a stolen house'),
		P('His mother told him to make a house first. She never said whose.', '어머니는 집부터 이루라고 했다. 누구 집인지는 말하지 않았다.'),

		SCENE('King Namhae’s hall', '남해왕의 궁'),
		P(
			'The egg-king’s son is on the throne now, and he hears about the young man who won a house with a sack of charcoal.',
			'이제 왕좌에는 알에서 난 임금의 아들이 앉아 있다. 그는 숯 한 자루로 집을 따낸 젊은이 이야기를 듣는다.'
		),
		CARD('namhae', 'King Namhae. The egg-king’s son, and a shaman. He reads an omen in every bird, and this one came with a magpie.', '남해왕. 알에서 난 임금의 아들이자 무당. 새마다 징조를 읽는데, 이번 건 까치를 달고 왔다.'),
		D(
			'namhae',
			['A boy from a chest. Who wins lawsuits with charcoal.', '…Marry him to my eldest.', 'I’d rather have that one inside the family than outside the gate.'],
			['궤짝에서 나온 놈이, 숯으로 송사를 이겨.', '…큰딸을 그에게 주어라.', '저런 놈은 문밖보다 집 안에 두는 게 낫다.']
		),
		P(
			'So the con man marries a princess. For twenty years the shaman-king keeps him close, listens to him, and watches him the way you watch weather.',
			'그래서 사기꾼은 공주와 혼인한다. 그 뒤 스무 해 동안 무당 임금은 그를 곁에 두고, 그의 말을 듣고, 날씨 보듯 그를 지켜본다.'
		),
		P(
			'When Namhae is dying he calls in his son Yuri and his son-in-law Talhae, and says the thing a careful man says when he can’t decide.',
			'남해는 죽어 가며 아들 유리와 사위 탈해를 불러들인다. 그리고 신중한 사람이 결정을 못 할 때 하는 말을 한다.'
		),
		D('namhae', ['Park or Seok. I don’t mind which.', 'The elder of you. Let the elder have it.'], ['박이든 석이든. 어느 쪽이든 상관없다.', '둘 중 나이 많은 쪽. 나이 많은 쪽이 맡아라.']),
		P(
			'Then he dies, which leaves two men at a bedside working out who is older. Neither of them knows his own birthday. One of them came out of an egg in a box.',
			'그러고는 숨을 거둔다. 침상 곁에는 누가 더 나이가 많은지 따져야 하는 두 사내가 남는다. 둘 다 제 생일을 모른다. 하나는 궤짝 속 알에서 나왔다.'
		),
		CARD('yuri_isageum', 'Yuri. The egg-king’s grandson. Kind, shy, and much harder to fool than he looks.', '유리. 알에서 난 임금의 손자. 다정하고, 수줍고, 보기보다 훨씬 속이기 어렵다.'),
		D(
			'yuri_isageum',
			['You’re older. Probably. And you’re cleverer. Definitely.', 'Take it, brother. I mean it.'],
			['형님이 더 많으시오. 아마도. 그리고 더 영리하시고. 그건 확실하고.', '가져가시오, 형님. 진심이오.']
		),
		D(
			'talhae',
			['Kind. Very kind.', 'But the throne isn’t for ordinary men, and I hear a wise man has more teeth.', 'Somebody bring a rice cake.'],
			['고맙소. 참 고맙소.', '허나 왕좌는 범인이 앉을 자리가 아니오. 듣자니 슬기로운 사람은 이가 많다더군.', '누가 떡 좀 가져오시오.']
		),
		P(
			'They each bite the same rice cake. The six villages send their headmen to count, because somebody has to and nobody trusts the family. The old headman whose village keeps the lineages holds the cake up to the lamp.',
			'둘이 같은 떡을 한 입씩 문다. 여섯 마을에서 촌장들이 와서 센다. 누군가는 세야 하고, 집안사람은 아무도 못 믿으니까. 족보를 맡은 마을의 늙은 촌장이 떡을 등불에 비춰 든다.'
		),
		S(
			'The Lineage Keeper',
			'#9a8f7a',
			['Prince Talhae… eleven. Hm. Some of these might be the same tooth twice.', 'Prince Yuri. Fourteen.', '…Prince Yuri has more teeth.'],
			['탈해 왕자… 열하나. 흠. 몇 개는 같은 이를 두 번 센 것 같기도 하고.', '유리 왕자. 열넷.', '…유리 왕자의 이가 더 많소.']
		),
		P(
			'Talhae, who has been a hawk and a sparrow, turns out to have a surprising amount of trouble biting a rice cake. Nobody remarks on it. Yuri looks at him for a long moment, and doesn’t either.',
			'매도 되고 참새도 되었던 탈해가, 떡 한 입 무는 데에는 뜻밖에 애를 먹는다. 아무도 그 말을 꺼내지 않는다. 유리는 한참 그를 바라보다가, 역시 아무 말도 하지 않는다.'
		),
		P(
			'So the kings of Silla are called Isageum from then on: tooth-marks. As far as anyone knows, it is the only royal title in the world named after a bite of rice cake.',
			'그래서 그 뒤로 신라의 임금은 이사금이라 불린다. 잇금, 이 자국이다. 아는 한, 떡 한 입에서 이름을 딴 임금 칭호는 세상에 이것 하나뿐이다.'
		),
		P(
			'Yuri turns out to be a good king, and does one thing nobody remembers and everybody uses. He gives the six old valleys surnames. The grandsons of the men who dug up the egg become the Lees and the Chois and four more. A village with a surname has decided to stay.',
			'유리는 좋은 임금이 된다. 그리고 아무도 기억하지 않지만 모두가 쓰는 일을 하나 한다. 여섯 옛 골짜기에 성을 내린다. 알을 파낸 사내들의 손자들이 이씨가 되고, 최씨가 되고, 넷이 더 된다. 성을 얻은 마을은 눌러살기로 작정한 마을이다.'
		),

		SCENE('Surabol · 57', '서라벌 · 57년'),
		P(
			'Thirty-three years later Yuri is dying, and his brother-in-law sits with him. Talhae is past sixty now, still tall, still cheerful, still in the stolen house.',
			'서른세 해 뒤, 유리가 죽어 간다. 매형이 그 곁을 지킨다. 탈해는 이제 예순이 넘었다. 여전히 키가 크고, 여전히 쾌활하고, 여전히 훔친 집에 산다.'
		),
		D('yuri_isageum', ['My boys are good boys.', 'That isn’t the same thing, is it.'], ['우리 애들은 착한 애들이오.', '그게 같은 건 아니지, 그렇소?']),
		D('talhae', ['They’re young.'], ['아직 어리잖소.']),
		D('yuri_isageum', ['Thirty years ago. The rice cake.', 'You bit soft. Didn’t you.'], ['삼십 년 전. 그 떡.', '살살 물었지, 형님. 그렇지?']),
		D('talhae', ['Prove it.'], ['증명해 보시오.']),
		P(
			'Yuri laughs, and it hurts him. Before morning he has named Talhae king and passed over both his sons. Then he is dead, and nobody in Surabol knows whether a dead king’s word is enough.',
			'유리가 웃는다. 웃으니 아프다. 아침이 오기 전에 그는 두 아들을 제쳐 두고 탈해를 임금으로 지목한다. 그리고 숨을 거둔다. 서라벌의 누구도 죽은 임금의 말 한마디로 충분한지 모른다.'
		),
		P(
			'There is no rule for this. The first king came out of the ground, and the next two were sons. This one came in a chest, married in, and is not Park on any side. So the six houses do the only thing they can think of. They send for their old men and shut the door.',
			'이럴 때 쓰는 법이 없다. 첫 임금은 땅에서 나왔고, 다음 둘은 아들이었다. 이번 사람은 궤짝에 실려 와 장가로 들어왔고, 어느 쪽으로 봐도 박씨가 아니다. 그래서 여섯 집안은 생각나는 유일한 일을 한다. 집안 어른들을 불러 모으고, 문을 닫는다.'
		),
		LEE(
			['Our grandfathers dug a king out of a field. A horse knelt. There was light.', 'What have we got? A magpie and a man who stole a house.'],
			['우리 할아버지들은 들판에서 임금을 파냈소. 말이 무릎을 꿇었고, 빛이 있었소.', '우리한테 뭐가 있소? 까치 한 마리하고, 남의 집 훔친 사내 하나.']
		),
		CHOI(['And twenty years of him being right about everything. Don’t leave that part out.'], ['그리고 스무 해 동안 하는 말마다 맞았던 사내지. 그건 빼먹지 마쇼.']),
		LEE(['Yuri had sons.'], ['유리 임금께 아들이 있소.']),
		CHOI(['Yuri had sons, and Yuri said no. You were there.'], ['아들 있지. 그리고 유리 임금이 아니라 했지. 당신도 거기 있었잖소.']),
		P(
			'The old man who counted the teeth is here too, thirty years older and a Jeong now. He has been to the Han commandery in the north, which makes him the only man in the room who has seen how a real empire does this.',
			'이를 세던 그 노인도 와 있다. 서른 해 더 늙었고, 이제는 정씨다. 북쪽 한나라 군현에 다녀온 적이 있어서, 진짜 제국이 이런 일을 어떻게 하는지 본 사람은 방 안에 그 하나뿐이다.'
		),
		JEONG(
			['You know the Han emperor died this spring.', 'His son had the seal before the body was cold. Nobody sat on a floor. Nobody counted anything.'],
			['올봄에 한나라 황제가 죽은 거 아시오.', '몸이 식기도 전에 아들이 옥새를 쥐었소. 아무도 마루에 둘러앉지 않았소. 아무도 아무것도 세지 않았고.']
		),
		CHOI(['Good for the Han.', 'Nobody asked the Han when our grandfathers dug up a gourd, either.'], ['한나라 좋겠수.', '우리 할아버지들이 박 파낼 때도 한나라한테 묻진 않았소.']),
		JEONG(
			['That was an omen. This would be— what would this be? Six men deciding?', 'If that’s allowed, anything’s allowed.'],
			['그건 징조였소. 이건— 이건 뭐요? 여섯이서 정한다고?', '그게 된다면 뭐든 되는 거요.']
		),
		CHOI(['Then let’s find out. Sleeves up if you’ll have him.'], ['그럼 해 봅시다. 저 사람 받을 거면 소매 드쇼.']),
		P(
			'Nobody has ever done this before, so nobody knows how high to hold a sleeve. Four go up, at four different heights. Two stay in laps.',
			'아무도 해 본 적이 없으니, 소매를 얼마나 높이 드는지도 아무도 모른다. 넷이 올라간다. 높이가 다 다르다. 둘은 무릎 위에 그대로 있다.'
		),
		CHOI(['Four. So he’s king.'], ['넷이네. 그럼 임금이오.']),
		LEE(['Of four valleys.'], ['네 골짜기의 임금이지.']),
		P(
			'Nobody says anything for a while. Everyone in the room can count to six, and everyone knows what happens when two old men go home angry to their own hills.',
			'한동안 아무도 말이 없다. 방 안의 누구나 여섯까지는 셀 줄 안다. 늙은이 둘이 화난 채 제 언덕으로 돌아가면 무슨 일이 생기는지도 누구나 안다.'
		),
		CHOI(['…Right. Then nobody goes home.'], ['…그렇지. 그럼 아무도 집에 못 가오.']),
		P(
			'Outside in the yard, Talhae sits on the step. Hogong stands next to him, because he is old and from Wa and nobody offered him a seat on the floor either.',
			'밖, 마당. 탈해는 섬돌에 앉아 있고 호공은 그 곁에 서 있다. 늙었고 왜에서 왔으니, 그에게도 마루에 앉으라는 사람이 없었다.'
		),
		D('talhae', ['How long do they usually take?'], ['보통 얼마나 걸리오?']),
		D(
			'hogong',
			['Usually? They’ve never done it.', 'The first one was dug up. The rest were sons. This is— I don’t know what this is, my lord.'],
			['보통이라니요. 해 본 적이 없소.', '첫 임금은 파낸 거고, 나머지는 아들이었소. 이건— 이게 뭔지 나도 모르겠소, 나리.']
		),
		D('talhae', ['Then they’ll take all night.'], ['그럼 밤새겠군.']),
		P(
			'They take all night. Somewhere before dawn the Lee elder stops arguing about the horse and starts arguing about terms.',
			'밤을 꼬박 새운다. 동트기 전 어느 무렵, 이씨 어른이 말 이야기를 그만두고 조건 이야기를 시작한다.'
		),
		LEE(
			['Then it’s a loan.', 'He wears it. When he dies it doesn’t go to his sons. It comes back here. To this floor.'],
			['그럼 빌려주는 거요.', '저 사람이 쓰시오. 죽으면 아들한테 가는 게 아니라 여기로 돌아오오. 이 마루로.']
		),
		JEONG(['And then we do this again? Every time?'], ['그럼 또 이걸 하자는 거요? 매번?']),
		CHOI(['Every time. Look at how they keep arriving.', 'Egg, chest. Next one’ll come down out of a tree.'], ['매번. 저 양반들 오는 꼴을 보쇼.', '알, 궤짝. 다음 놈은 나무에서 내려올 거요.']),
		JEONG(['And if the Han hear we pick our kings by a show of sleeves?'], ['우리가 소매 들어 임금을 고른다는 소리를 한나라가 들으면?']),
		CHOI(['Then they’ll laugh.', 'Let them laugh in Han.'], ['웃겠지.', '웃으라 하쇼. 한나라 말로.']),
		P(
			'When the sun comes up there are six sleeves in the air, all at roughly the same height. It is the first time the six houses have agreed on anything since the egg.',
			'해가 뜰 때 소매 여섯이 올라가 있다. 높이도 대충 비슷하다. 알 이후로 여섯 집안이 무엇에든 뜻을 모은 건 이것이 처음이다.'
		),
		P(
			'They open the door. Talhae is still on the step. He stands, walks in, and before he goes anywhere near the throne he bows to the six old men on the floor. Every king of Silla after him will make the same bow, and most of them will mind.',
			'문을 연다. 탈해는 아직 섬돌에 있다. 그는 일어나 안으로 들어서고, 왕좌 근처에 가기도 전에 마루에 앉은 여섯 노인에게 먼저 절한다. 그 뒤 신라의 모든 임금이 같은 절을 하게 되고, 대개는 그게 못마땅할 것이다.'
		),
		D(
			'talhae',
			['Gentlemen. I’ve been a hawk, a sparrow, a fisherman and a thief.', 'Chosen is new.'],
			['어르신들. 나는 매도 되어 봤고, 참새도, 어부도, 도둑도 되어 봤소.', '뽑힌 건 처음이오.']
		),
		CHOI(['Don’t get used to it. It’s on loan.'], ['익숙해지진 마쇼. 빌려준 거니까.']),
		P(
			'So Talhae is king at sixty-two, and one of the first things he does is make Hogong his chief minister, which is either an apology or the best joke in the annals.',
			'그렇게 탈해는 예순둘에 임금이 된다. 그가 맨 먼저 한 일 가운데 하나는 호공을 대보로 삼은 것이다. 사과이거나, 아니면 사서 전체에서 가장 좋은 농담이거나.'
		),
		ministerQuote,
		old('…Grand Minister.'),
		old('I could use a man like that.'),
		old('I knew it. You did bury them.'),
		e.blocks[e.blocks.indexOf(old('I knew it. You did bury them.')) + 1],
		old('The Moon Palace', 'scene'),
		old('Seven hundred years later, King Muyeol'),
		old('Nobody is digging, Your Majesty.'),
		closing
	];
}

function alji(e) {
	const old = (frag, kind) => pick(e, frag, kind);
	const closing = e.blocks.at(-1);
	if (!/^\s*<b>/.test(closing.html)) throw new Error('Alji closing card moved');

	const boxOpen = old('I came in a box too');
	boxOpen.en = ['Well.', 'I came in a box too, you know. Mine’s in the next room. It’s bigger.'];
	boxOpen.lines = ['허.', '나도 궤짝 타고 왔다. 내 건 옆방에 있어. 더 크지.'];

	const offer = old('Do you want the chair?');
	const steam = old('the steam says the same word');

	return [
		e.blocks[0],
		SCENE('The Moon Palace · Talhae’s ninth spring', '월성 · 탈해 아홉 해 봄'),
		old('There’s a rooster in Sirim.'),
		old('Majesty, it’s a rooster.'),
		old('a small box of gold hanging from a branch'),
		old('looks at the king as if the king were the one'),
		boxOpen,
		old('瓠公還告', 'quote'),
		old('he is given the surname'),
		old('quick and easy to like'),

		SCENE('Gyerim · ten springs later', '계림 · 열 해 뒤 봄'),
		P(
			'The old king and the boy get on suspiciously well. Talhae teaches him to fish, and to lose a bet without the other man noticing. One evening he shows him the horn cup.',
			'늙은 임금과 아이는 수상할 만큼 죽이 잘 맞는다. 탈해는 아이에게 낚시를 가르친다. 상대가 눈치 못 채게 내기에서 지는 법도. 그리고 어느 저녁, 뿔잔을 보여 준다.'
		),
		D('talhae', ['It sticks to a liar’s lips. Go on. Tell me a lie.'], ['거짓말하는 놈 입술에 붙는 잔이다. 해 봐라. 거짓말 하나 해 봐.']),
		D('alji', ['…I don’t like fishing.'], ['……저는 낚시가 싫습니다.']),
		P('He drinks. The cup comes away clean. He turns it over and sniffs the rim.', '아이가 마신다. 잔이 말끔히 떨어진다. 아이는 잔을 뒤집어 보고, 전에 코를 대 본다.'),
		D('alji', ['It smells of pine.'], ['송진 냄새가 납니다.']),
		D('talhae', ['Everything on Toham smells of pine.', '…You do like fishing, don’t you.'], ['토함산에 있는 건 다 송진 냄새가 나.', '……너 낚시 좋아하지?']),
		D('alji', ['Very much, Majesty.'], ['아주 좋아합니다, 폐하.']),
		P('Neither of them mentions it again.', '둘 다 다시는 그 이야기를 꺼내지 않는다.'),
		offer,
		D('alji', ['…No, Majesty.', 'It isn’t yours to give. It goes back to the floor.'], ['……아니옵니다, 폐하.', '폐하께서 주실 수 있는 게 아니잖습니까. 마루로 돌아가는 것이지요.']),
		D('talhae', ['Ha! Who told you that?'], ['하! 누가 그러더냐?']),
		D('alji', ['You did, Majesty. Whenever there’s wine.'], ['폐하께서요. 약주만 드시면.']),
		D('talhae', ['…So you’ll pass.'], ['……그래서 마다하겠다?']),
		D('alji', ['I’ll wait.'], ['기다리겠습니다.']),
		D('talhae', ['How long?'], ['얼마나?']),
		D('alji', ['As long as it takes. Gold doesn’t rust, Majesty.'], ['걸리는 만큼요. 금은 녹슬지 않으니까요, 폐하.']),
		P(
			'Talhae writes his name down as heir anyway. He has never once taken no for an answer from someone he likes.',
			'탈해는 그래도 아이의 이름을 후사로 적어 둔다. 좋아하는 사람이 싫다고 해서 물러선 적이 평생 한 번도 없는 사내다.'
		),

		SCENE('The Moon Palace · Talhae’s last winter', '월성 · 탈해의 마지막 겨울'),
		P(
			'Talhae lives to be very old, in the house he stole, with the chest in the next room. One winter night a man in black is standing at the foot of the bed with a red book open, and Talhae, who has never been surprised by anything in his life, is.',
			'탈해는 아주 오래 산다. 훔친 집에서, 옆방에 궤짝을 둔 채. 어느 겨울밤, 검은 옷의 사내가 붉은 책을 펼쳐 들고 침상 발치에 서 있다. 평생 무엇에도 놀란 적 없는 탈해가, 놀란다.'
		),
		D(
			'kangrim',
			['Seok Talhae. Seok Talhae. Seok Talhae.', 'One question, then we walk.', 'Were you a prince of Dapana, or a fisherman’s boy from Ajinpo?'],
			['석탈해. 석탈해. 석탈해.', '질문 하나, 그리고 걷읍시다.', '다파나의 왕자였소, 아진포 어부 집 아이였소?']
		),
		D('talhae', ['…What does your book say?'], ['……그 책엔 뭐라고 적혀 있소?']),
		D('kangrim', ['It says Seok. The magpie’s name. The rest it leaves to you.'], ['석이라고 적혀 있소. 까치의 이름. 나머지는 그대에게 맡기고.']),
		D('talhae', ['Then put me down as hers.', 'The old woman’s. She made me study.'], ['그럼 그 할멈 아이라고 적으시오.', '나더러 공부하라고 한 사람이오.']),
		D('kangrim', ['Clean answer. Come. It’s a short walk, and nobody on it owns a house.'], ['깨끗한 답이오. 갑시다. 짧은 길이고, 그 길엔 집 가진 사람이 아무도 없소.']),
		P(
			'His bones have a longer road. Six hundred years on, a king of Silla will dream of an angry old man, dig him up, and measure him. He is exactly as tall as he said.',
			'그의 뼈는 더 먼 길을 간다. 육백 년 뒤, 신라의 어느 임금이 화난 노인 꿈을 꾸고 그를 파내어 재 본다. 그가 말한 키 그대로다.'
		),

		SCENE('The elders’ floor · that same winter', '어른들의 마루 · 그해 겨울'),
		P(
			'The six houses meet in the same room. The faces are new and the arguments are not. Somebody has set the dead king’s horn cup in the middle of the floor, and each man has a small wooden piece in front of him, because sleeves turned out to be hard to count by lamplight.',
			'여섯 집안이 같은 방에 모인다. 얼굴은 새것이고 다툼은 옛것이다. 누군가 죽은 임금의 뿔잔을 마루 한가운데 놓았고, 저마다 앞에 작은 나무패가 하나씩 있다. 등불 아래서는 소매를 세기가 어렵다는 걸 알았기 때문이다.'
		),
		JEONG(['Left of the cup is no. Right is yes.', 'They say it sticks to a liar’s lips, so nobody lie.'], ['잔 왼쪽은 아니오, 오른쪽은 예요.', '거짓말하는 입술에 붙는다니 다들 거짓말은 마시오.']),
		P(
			'Alji, fifteen now, sits by the wall where heirs sit. He looks at the cup and says nothing about pine.',
			'이제 열다섯인 알지는 후사가 앉는 벽 쪽 자리에 있다. 그는 잔을 바라보며 송진 이야기는 하지 않는다.'
		),
		LEE(['It comes back to the Park. That was the bargain.'], ['박씨에게 돌아오는 거요. 그게 약조였소.']),
		CHOI(['The bargain was it comes back to the floor.', '…Fine. Which Park?'], ['약조는 마루로 돌아온다는 거였소.', '…좋소. 어느 박씨?']),
		JEONG(['The eldest is Ilseong.'], ['맏이는 일성이오.']),
		CHOI(['The eldest is Ilseong. The cleverest is Pasa. And we’re the ones on the floor.'], ['맏이는 일성이지. 똑똑한 건 파사고. 그리고 마루에 앉은 건 우리요.']),
		JEONG(['In the Han, the eldest—'], ['한나라에서는 맏이가—']),
		LEE(['We know.'], ['알고 있소.']),
		JEONG(['And the box boy. The late king wrote his name.', 'Boy. Do you claim it?'], ['그리고 상자 아이. 선왕께서 이 아이 이름을 적으셨소.', '얘야. 받겠느냐?']),
		D('alji', ['No, sir.', 'It was on loan to him. It wasn’t his to leave.'], ['아니옵니다, 어르신.', '선왕께도 빌린 것이었습니다. 물려주실 수 있는 게 아니었지요.']),
		CHOI(['…Huh. The boy listens.'], ['…허. 저 녀석 귀가 밝네.']),
		P(
			'They raise Pasa over his elder brother, which no one in the Han would dream of doing. By morning all six pieces sit to the right of the cup. Nobody’s lips stick to anything.',
			'그들은 형을 제치고 파사를 세운다. 한나라에서라면 꿈도 못 꿀 일이다. 아침이 되자 나무패 여섯이 모두 잔 오른쪽에 놓여 있다. 누구 입술에도 아무것도 붙지 않는다.'
		),
		P(
			'So Alji never wears it, and by every account he never asks again. The crown goes on passing between the Parks and the Seoks, and every time it passes, the six houses pull up their mats. Nobody ever asks the Han.',
			'그래서 알지는 끝내 왕관을 쓰지 않고, 어느 기록을 보아도 다시는 청하지 않는다. 왕관은 박씨와 석씨 사이를 오가고, 오갈 때마다 여섯 집안이 자리를 당겨 앉는다. 한나라에 묻는 사람은 아무도 없다.'
		),

		SCENE('Surabol · 262', '서라벌 · 262년'),
		P(
			'Nearly two hundred years on, a Seok king dies without a son. The men on the floor are great-great-grandsons of the ones who raised Talhae, and they make the same three arguments in the same order. Their ledgers have run thin. The Parks have married into everything and have nobody left standing. The Seoks have one boy, and he really is a boy.',
			'이백 년 가까이 지나, 석씨 임금 하나가 아들 없이 죽는다. 마루에 앉은 사내들은 탈해를 세운 이들의 고손자들이고, 같은 세 가지 다툼을 같은 순서로 벌인다. 장부에 남은 이름이 얇다. 박씨는 온 데로 혼인해 들어가 서 있는 사람이 없다. 석씨에게는 아이 하나가 있는데, 정말로 아이다.'
		),
		JEONG(
			['There’s a Kim.', 'Seventh from the box. Married to a Seok princess. Steady. Nobody hates him.'],
			['김씨가 하나 있소.', '상자에서 일곱째. 석씨 공주에게 장가들었고. 듬직하오. 그를 미워하는 사람이 없소.']
		),
		LEE(['The box boy’s line? They’ve never worn it.'], ['상자 아이네 핏줄? 그 집은 왕관을 써 본 적이 없소.']),
		CHOI(['Neither had the chest, once.'], ['궤짝도 한때는 그랬지.']),
		P(
			'It takes them all night, the way it always does now. In the morning they send for a careful man named Michu, who has been told nothing and has assumed the worst.',
			'늘 그렇듯 밤을 새운다. 아침에 그들은 미추라는 신중한 사내를 부른다. 아무 말도 듣지 못했고, 그래서 최악을 짐작하고 온 사람이다.'
		),
		CARD('michu', 'Michu. Seventh from the golden box, and nobody’s enemy. That turns out to be the qualification.', '미추. 금빛 상자에서 일곱째, 누구의 적도 아닌 사내. 알고 보니 그게 자격이다.'),
		D('michu', ['…Why me?'], ['……왜 나요?']),
		CHOI(['Because you’re the one all six of us could stand.', 'Don’t let it go to your head.'], ['우리 여섯이 다 참아 줄 수 있는 사람이 당신뿐이라서.', '우쭐하진 마쇼.']),
		D('michu', ['And my sons?'], ['내 아들들은?']),
		JEONG(['Your sons come to the floor like everyone else’s.'], ['아드님들도 남들처럼 이 마루에 와야 하오.']),
		P(
			'So the first Kim wears the crown, seven generations after a rooster crowed at midnight. The Seoks take it back after him. The Kims get it back again, and that time they keep it.',
			'그렇게 첫 김씨가 왕관을 쓴다. 한밤중에 닭이 운 지 일곱 대 만이다. 그가 죽자 석씨가 도로 가져간다. 김씨가 다시 찾아오고, 이번에는 놓지 않는다.'
		),
		P(
			'Here is the trouble with a country that counts bones. The more carefully you count, the fewer you have. Every few generations a royal house runs short of sons who count, and the crown has to come from the floor instead. So no king of Silla can lean on the egg. He leans on the room.',
			'뼈를 세는 나라의 골칫거리는 이것이다. 꼼꼼히 셀수록 남는 게 적다. 몇 대마다 왕가는 셈에 드는 아들이 모자라고, 그러면 왕관은 마루에서 나와야 한다. 그래서 신라의 어느 임금도 알에 기댈 수 없다. 방에 기댄다.'
		),
		P(
			'By the time a Tang historian hears about it, the floor has a name. He writes it down the way you would write down a calf with two heads.',
			'당나라 사관이 이 이야기를 들을 무렵, 그 마루에는 이름이 붙어 있다. 사관은 머리 둘 달린 송아지 이야기를 받아 적듯 그것을 적는다.'
		),
		{
			kind: 'quote',
			hanja: '事必與衆議，號和白，一人異則罷。',
			html: 'Every matter must be put to the many. They call it Hwabaek. If one man differs, it is dropped.',
			ko: '일은 반드시 여럿과 의논한다. 이를 화백이라 부른다. 한 사람이라도 뜻이 다르면 그만둔다.',
			source: 'New Book of Tang (新唐書) bk. 220, Eastern Barbarians — Silla'
		},
		P(
			'The Kims of Surabol keep the crown a long time after that, and look down on a family from Gaya who have the same name for a different reason. Many generations on, one of them is a man named Chunchu.',
			'서라벌 김씨는 그 뒤로 오래 왕관을 지킨다. 그리고 다른 이유로 같은 성을 가진 가야 출신 집안을 내려다본다. 그로부터 여러 대 뒤, 그 가운데 하나가 춘추라는 사내다.'
		),
		steam,
		...e.blocks.slice(e.blocks.indexOf(old('Gyerim', 'scene'))),
	];
}

editStory((story) => {
	const ch = story.find((c) => c.id === 'chunchu-era');
	const t = ch.entries.find((x) => x.title === 'Talhae');
	const a = ch.entries.find((x) => x.title === 'Alji');
	const done = (e, label) => e.blocks.some((b) => b.kind === 'scene' && b.label === label);
	const out = [];
	if (!done(t, 'Mount Toham')) {
		t.blocks = talhae(t);
		out.push('Talhae');
	}
	if (!done(a, 'Surabol · 262')) {
		for (const b of a.blocks) if (b.kind === 'dialogue' && b.person === 'alji' && !b.chip) b.chip = CHIP.alji;
		a.blocks = alji(a);
		out.push('Alji');
	}
	for (const e of [t, a]) {
		const seen = new Set();
		for (const b of e.blocks) {
			if (!b) throw new Error(`${e.title}: undefined block`);
			if (seen.has(b)) throw new Error(`${e.title}: block used twice: ${textOf(b).slice(0, 60)}`);
			seen.add(b);
		}
	}
	console.log(out.length ? `rewrote ${out.join(', ')} (${t.blocks.length} / ${a.blocks.length} blocks)` : 'already done');
	if (process.env.DRY) return false;
	return out.length ? undefined : false;
});
