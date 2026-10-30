// One-off: the Yellow Sea decoy, told in the right order — attack, wrong face, small boat, then the flashback.
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title.startsWith('Huangdi'));
const b = e.blocks;

const P = (html, ko) => ({ kind: 'p', html, ko });
const D = (person, en, lines) => ({ kind: 'dialogue', person, lines, en });
const S = (speaker, gender, en, lines) => ({ kind: 'dialogue', speaker, gender, lines, en });

const at = (i, frag) => {
	if (!JSON.stringify(b[i]).includes(frag)) throw new Error(`block ${i} lacks ${frag}`);
};
at(198, 'On Gunhae');
at(199, 'A day and a night out to sea');
at(200, 'ongunhae');
at(205, 'The patrol closes');
at(206, 'He reaches the home shore');

const CAPTAIN = 'The Goguryeo commander';

const attack = [
	{ kind: 'scene', label: 'The Yellow Sea', ko: '황해' },
	P('A day and a night out to sea, the wind goes wrong. Three hulls come up out of the haze behind them, and then three more. They are flat-bottomed and plank-built, with one square sail of woven matting each, two banks of oars, and a raised fighting deck at the stern. Red banners. Goguryeo has been watching this sea-road since Chunchu walked out of its prison.',
		'바다로 나온 지 하루 낮 하룻밤, 바람이 틀어진다. 안개 속에서 배 세 척이 올라오고, 또 세 척이 올라온다. 바닥이 평평한 널판 배다. 돗자리를 엮은 네모 돛 하나, 양쪽으로 늘어선 노, 고물에 높이 세운 싸움 다락. 붉은 깃발. 춘추가 고구려 감옥을 걸어 나온 그날부터, 고구려는 이 뱃길을 지켜보고 있었다.'),
	P('On the embassy ship’s stern deck sits a man in white and purple, the coat of a Silla envoy, the high feathered cap on his head. He sits high, where the mast makes a chair of shadow. He does not wave. He does not go below.',
		'사신선 고물 다락에는 흰 바탕에 자줏빛 단을 두른 신라 사신의 옷을 입고, 깃털 꽂은 높은 관을 쓴 사내가 앉아 있다. 돛대 그림자가 의자처럼 드리운 높은 자리다. 손을 흔들지 않는다. 아래로 내려가지도 않는다.'),
	P('The lead ship carries the commander. She stands at the stern rail in steel lamellar with red wings at the shoulders, a helm under one arm because she wants to see him herself.',
		'선두 배에 장수가 타고 있다. 그녀는 붉은 날개 어깨깃을 단 강철 비늘 갑옷 차림으로 고물 난간에 서 있다. 투구는 옆구리에 끼었다. 그 얼굴을 제 눈으로 보고 싶어서다.'),
	S(CAPTAIN, 'f', ['There. White and purple. That’s him.', 'Fire arrows. The sail first, then the deck.', '…Not the man. Not yet. I want him to watch it burn.'],
		['저기. 흰 옷에 자주. 저 자다.', '불화살. 돛 먼저, 그다음 갑판.', '……사람은 말고. 아직은. 타는 걸 보게 해.']),
	P('The sky fills. Fire arrows come over the water in sheets, hissing where they fall short. The matting sail of the embassy ship catches all at once and goes up like a torch. Silla sailors beat at the flames with wet cloaks. One climbs the stern ladder, shouting.',
		'하늘이 가득 찬다. 불화살이 물 위로 장막처럼 날아오고, 못 미친 것들은 물에 떨어져 쉭쉭 소리를 낸다. 사신선의 돗자리 돛이 한꺼번에 불붙어 횃불처럼 솟는다. 신라 사공들이 젖은 망토로 불을 두드린다. 한 사람이 고물 사다리를 기어오르며 소리친다.'),
	S('A Silla sailor', 'm', ['My lord— my lord, get below! Please!'], ['공— 공이시여, 아래로 내려가십시오! 제발!']),
	P('The man in the high cap does not answer. He sits very straight. An arrow stands in the rail beside his hand, burning, and he does not look at it.',
		'높은 관을 쓴 사내는 대답하지 않는다. 등을 꼿꼿이 세우고 앉아 있다. 그의 손 옆 난간에 불화살 하나가 꽂혀 타고 있는데, 그는 그쪽을 보지도 않는다.'),
	S(CAPTAIN, 'f', ['Ram her.'], ['들이받아.']),
	P('The lead ship comes in under oars and hits the embassy ship amidships. Timber screams. The burning mast comes down across the deck, and the ship rolls, slowly, the way a big thing does when it has decided, and goes over. Fire on the water. Then just smoke.',
		'선두 배가 노를 저어 들어와 사신선의 허리를 들이받는다. 널판이 비명을 지른다. 불붙은 돛대가 갑판을 가로질러 쓰러지고, 배가 천천히 기운다. 큰 것이 마음을 정했을 때 그러듯이. 그리고 뒤집힌다. 물 위에 불. 그다음엔 연기뿐.'),
	P('By noon they are wading the wreck. The commander goes from body to body herself. She finds the coat first, white and purple, floating face-down among the spars, the feathered cap still tied under the chin. She kneels in the water and turns him over.',
		'한낮이 되자 그들은 난파선 사이를 헤치고 다닌다. 장수가 직접 시신을 하나하나 살핀다. 옷부터 찾는다. 흰 바탕에 자주, 돛대 조각들 사이에 엎어져 떠 있다. 깃털 관은 아직 턱 끈에 매여 있다. 그녀는 물속에 무릎을 꿇고 그를 뒤집는다.'),
	P('It is a rounder face than the one in the reports. Heavier in the cheek. Bearded. Calm, the way faces are when their owner was expecting this.',
		'보고서에 적힌 얼굴보다 둥글다. 볼이 두툼하다. 수염이 있다. 이 일을 기다리던 사람의 얼굴처럼 평온하다.'),
	S(CAPTAIN, 'f', ['…No.', 'No, no, no— that’s not—', 'Kim Chunchu.', 'He walked out of our prison with a story about a rabbit. Now he walks off a burning ship in somebody else’s face.', '…Father is going to laugh at me. And then he’s going to stop laughing.'],
		['……아니야.', '아니, 아니, 아니— 이건—', '김춘추.', '토끼 이야기 하나로 우리 감옥을 걸어 나가더니, 이번엔 남의 얼굴을 쓰고 불타는 배에서 걸어 나갔어.', '……아버지가 날 비웃으시겠지. 그러다 웃음을 멈추시겠지.']),
	S('A Goguryeo marine', 'm', ['Commander. The body?'], ['장군. 시신은요?']),
	S(CAPTAIN, 'f', ['Bury him properly.', 'Whoever he was, he sat up there under our arrows for an hour and never once ducked.'],
		['제대로 묻어 줘.', '누구였든, 우리 화살 밑에서 한 시진을 앉아 있었어. 한 번도 고개를 숙이지 않고.']),
	{ kind: 'scene', label: 'The Small Boat', ko: '작은 배' },
	P('Far to the south, a fishing boat with a patched sail runs for home. Six oars. One of the rowers is wearing plain hemp and rowing badly, because nobody taught him, and because he keeps looking back at the smoke on the horizon.',
		'멀리 남쪽, 기운 돛을 단 고깃배 한 척이 집으로 달린다. 노 여섯. 노꾼 하나는 거친 삼베옷을 입고 서툴게 노를 젓는다. 배운 적이 없어서이고, 수평선의 연기를 자꾸 돌아보기 때문이다.')
];

const flashback = {
	kind: 'flashback',
	year: '649',
	title: 'the night before',
	blocks: [
		P('The night before, in the hold of the embassy ship, under one lamp. The patrol’s sails were already a smudge on the dusk.',
			'그 전날 밤, 사신선 짐칸, 등잔 하나 아래. 순찰선의 돛은 이미 해 질 녘 하늘에 얼룩처럼 번져 있었다.'),
		b[200],
		D('ongunhae', ['My lord. The small boat.'], ['공께서는 작은 배로.']),
		D('chunchu', ['…What small boat?'], ['……무슨 작은 배 말이오?']),
		D('ongunhae', ['The fisherman’s, tied astern. Give me the coat and the cap.', 'We are the same height. From their deck, a man in that cap is you.'],
			['고물에 매단 어부의 배입니다. 옷과 관을 제게 주십시오.', '저와 공은 키가 같습니다. 저들 배에서 보면, 저 관을 쓴 사람이 곧 공이십니다.']),
		D('chunchu', ['That cap is heavy.'], ['그 관은 무겁소.']),
		D('ongunhae', ['Then I will wear it.'], ['그래서 제가 씁니다.']),
		D('chunchu', ['No, Vice Admiral! You cannot…', 'You must not…'], ['안 되오, 부제독! 그대는……', '그래선 안 되오……']),
		D('ongunhae', ['Lord Chunchu…', 'You are a man with a great fate…! I am just a humble servant.', 'If I can place the three letters of my name onto the history books as your loyal servant, that will be enough for me.'],
			['춘추공……', '공께서는 큰 운명을 지닌 분이십니다……! 저는 그저 미천한 종일 뿐입니다.', '공의 충직한 신하로서 제 이름 석 자를 역사책에 올릴 수 있다면, 그것으로 족합니다.']),
		P('Chunchu has talked his way out of a Goguryeo prison and into a Tang emperor’s trust. He has nothing to say to this. His eyes go first.',
			'춘추는 말 한마디로 고구려 감옥을 빠져나왔고, 당 황제의 신임을 얻어 냈다. 그런 그가 이 말 앞에서는 할 말이 없다. 눈이 먼저 무너진다.'),
		D('chunchu', ['Very well…', 'I’ll make sure your name is remembered for all time.'], ['알겠소……', '그대의 이름이 영원히 기억되게 하겠소.']),
		P('He takes the cap off his own head with both hands, the way you hand over something that belongs to a temple, and sets it on On Gunhae’s. He ties the cords under the other man’s chin himself. Neither of them can do the knot the first time.',
			'그는 두 손으로 제 머리에서 관을 벗는다. 절에 바치는 물건을 건네듯이. 그리고 온군해의 머리에 씌운다. 턱 밑 끈도 손수 맨다. 둘 다 첫 번엔 매듭을 짓지 못한다.')
	]
};

const after = [
	P('On the fishing boat, the man at the next oar takes off his own coat and holds it out to the envoy without a word. Chunchu shakes his head. The man keeps holding it out until he takes it. Nobody on that boat has slept, and nobody will row slower than the man beside him.',
		'고깃배 위, 옆 노를 잡은 사내가 말없이 제 겉옷을 벗어 사신에게 내민다. 춘추가 고개를 젓는다. 사내는 받을 때까지 계속 내밀고 있다. 그 배에서 잠든 사람은 아무도 없고, 옆 사람보다 느리게 노를 젓는 사람도 없다.')
];

b.splice(198, 8, ...attack, flashback, ...after);

for (const im of e.images ?? []) {
	if (im.id === 'ongunhae-high-cap') {
		im.at = 'He sits high, where the mast makes a chair of shadow';
		im.alt = 'A man in the Silla envoy’s high cap sits exposed on the stern deck in a vast fogged sea';
	}
	if (im.id === 'ongunhae-sacrifice') {
		im.at = 'Three hulls come up out of the haze behind them';
		im.alt = 'A tiny embassy ship on the Yellow Sea as Goguryeo sails close in';
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('ok', b.length);
