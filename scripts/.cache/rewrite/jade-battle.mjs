// Jade Gate Valley: the first battle of the story, told through the valley's shape.
import { editStory, textOf } from '../story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, lines) => ({ kind: 'dialogue', person, lines, en });
const extra = (speaker, chip, en, lines) => ({ kind: 'dialogue', chip, speaker, gender: 'm', lines, en });
const BOY = ['A Hwarang of Class 77', '#7fa7c9'];

const GEOGRAPHY = [
	p(
		'Here is the valley, since you will need it. Two long ridges run down off the hill and almost meet. Where they almost meet is the mouth: a throat of rock three men wide, and the only road out.',
		'골짜기 생김새를 알아 두자. 쓸 데가 있으니까. 긴 능선 둘이 산에서 흘러내려 거의 맞닿는다. 거의 맞닿는 그 자리가 어귀다. 사내 셋이 나란히 겨우 지나는 바위 목, 그리고 밖으로 나가는 유일한 길.'
	),
	p(
		'Inside the throat the ground opens into a bowl. At the bottom of the bowl is a spring that never freezes, and all winter the fog comes off it like breath. The far end climbs steep and white to the hill fort. That is the back door Uso means to use at dawn.',
		'목을 지나면 땅이 사발처럼 벌어진다. 사발 바닥엔 겨울에도 얼지 않는 샘이 있고, 겨우내 거기서 입김처럼 안개가 피어오른다. 맞은편 끝은 가파르고 하얗게 산성까지 치솟는다. 우소가 새벽에 쓰려는 뒷문이 거기다.'
	),
	p(
		'Five hundred men are asleep at the bottom of a cup. Bidam draws the cup in the snow with one finger: two long lines, a narrow gap, a round hollow, a dot for the spring. The boys look at the drawing. Then at each other. One of them makes a noise through his nose.',
		'사내 오백이 잔 밑바닥에서 자고 있다. 비담이 손가락 하나로 눈 위에 그 잔을 그린다. 긴 줄 둘, 좁은 틈, 둥근 우묵, 샘 자리에 점 하나. 아이들이 그림을 본다. 그러고는 서로를 본다. 하나가 코로 이상한 소리를 낸다.'
	),
	say('alchun', ['Don’t laugh.', '…You either, Bidam.'], ['웃지 마라.', '…니도 웃지 마라, 비담.']),
	say('bidam', ['I didn’t draw it. Heaven made it this way.', 'There’s a reason they call it the Jade Gate.'], ['내가 그린 게 아니다. 하늘이 이리 빚었지.', '옥문이라 부르는 데는 다 까닭이 있는 법이다.']),
	p(
		'The army comes up the road behind them, two thousand men breathing smoke, in no mood for a speech. Bidam gives them the plan in the time it takes to tie a sandal.',
		'뒤쪽 길로 군사가 올라온다. 입김을 연기처럼 뿜는 이천이다. 연설 들을 기분은 아니다. 비담은 짚신 끈 하나 묶을 동안에 계획을 다 말한다.'
	),
	say(
		'bidam',
		['The army plugs the mouth. Spears, three deep. Nobody comes out of that gate.', 'Every man on the ridges carries two torches. Light them on my mark. Not before.'],
		['군사는 어귀를 막는다. 창 세 겹. 그 문으로는 아무도 못 나온다.', '능선에 선 자는 횃불을 둘씩 든다. 내 신호에 켜라. 그 전엔 안 된다.']
	),
	say('alchun', ['Two each? There’s two thousand of us.', '…Oh. So we look like four.'], ['둘씩? 이천인데.', '…아. 사천으로 보이라꼬.']),
	say('bidam', ['And the valley echoes. One drum sounds like ten.', 'From down there, we are ten thousand.'], ['그리고 골짜기가 메아리를 쳐 준다. 북 하나가 열로 들리지.', '저 밑에서 보면 만이다.'])
];

const MARK = [
	p(
		'The mark is one bell. On the left ridge a torch catches, then two, then a hundred, running along the crest like a lit fuse. The right ridge answers. Then the drums start, and the valley does the rest. It throws every beat back off both walls until all of Silla seems to be standing on the rim.',
		'신호는 종 한 번이다. 왼쪽 능선에 횃불 하나가 붙고, 둘이 붙고, 백이 붙어 도화선처럼 등성이를 따라 달린다. 오른쪽 능선이 받는다. 그다음 북이 울리고, 나머지는 골짜기가 한다. 북소리 하나하나를 양쪽 벽에서 되던져, 신라가 통째로 가장자리에 서 있는 것처럼 들리게 만든다.'
	),
	p(
		'At the bottom of the cup, five hundred men wake inside a ring of fire. Nobody down there can count it. The valley counts it for them, and the valley lies.',
		'잔 밑바닥에서 사내 오백이 불의 고리 한가운데서 깬다. 저 아래서는 아무도 그 수를 셀 수 없다. 골짜기가 대신 세어 준다. 그리고 골짜기는 거짓말을 한다.'
	)
];

const THROAT = [
	{ kind: 'scene', label: 'The Throat', ko: '목', weather: 'snow' },
	p(
		'Every Baekje soldier who can run runs the same way: downhill, toward the only road out. The fog off the spring rolls down with them. They come out of it at the throat three abreast, because the rock will not let anybody out any wider.',
		'달릴 수 있는 백제 군사는 모두 같은 쪽으로 달린다. 내리막으로, 하나뿐인 바깥길로. 샘에서 피어난 안개가 그들과 함께 굴러 내려간다. 그들은 셋씩 나란히 목에서 안개를 뚫고 나온다. 바위가 그보다 넓게는 아무도 내보내 주지 않으니까.'
	),
	p(
		'The throat is held by farm sons. They have never done this before. They hold their spears the way they hold a hoe, and behind them an old nangdo with one ear walks up and down saying the same two things.',
		'목을 지키는 건 농가 아들들이다. 이런 건 처음이다. 괭이 쥐듯 창을 쥐고 있다. 그 뒤에서 귀 하나 없는 늙은 낭도가 오락가락하며 같은 말 두 마디를 되풀이한다.'
	),
	extra('An Old Nangdo', '#9a8f7a', ['Spears down. Down. Butt in the dirt.', 'Watch the man in front. The one behind him is not your business.'], ['창 내리라. 내리라. 자루 땅에 박고.', '앞엣놈만 봐라. 뒤엣놈은 니 일 아이다.']),
	p(
		'The boy with the mended sleeve is in the front rank. He came back with the army and nobody sent him to the rear, because nobody noticed him, which is the story of his life so far. The first Baekje man out of the fog runs onto his spear. The boy does not let go. Forty farm sons see that he didn’t, and neither do they.',
		'소매 기운 아이가 맨 앞줄에 있다. 군사를 데리고 돌아왔는데 아무도 그를 뒤로 보내지 않았다. 아무도 그를 눈여겨보지 않았으니까. 지금까지 그의 인생이 대체로 그랬다. 안개에서 처음 튀어나온 백제 사내가 그의 창에 몸을 박는다. 아이는 놓지 않는다. 농가 아들 마흔이 그가 놓지 않는 걸 본다. 그들도 놓지 않는다.'
	),
	p(
		'The throat is three men wide. It stays three men wide all night, and nothing that goes into it comes out the other side.',
		'목은 사내 셋 너비다. 밤새 사내 셋 너비로 버틴다. 그리로 들어간 것은 무엇도 반대편으로 나오지 못한다.'
	),
	p(
		'Uso understands first. He stops running for the gate and starts shouting the other way, up the back wall, toward the door he came here to use.',
		'우소가 제일 먼저 알아챈다. 그는 문 쪽으로 달리기를 멈추고 반대쪽으로 고함치기 시작한다. 뒷벽 위로, 애초에 쓰려던 그 문 쪽으로.'
	),
	extra('Uso', '#b88a3a', ['Not the gate! Back! Up the back wall!'], ['문 말구! 뒤여, 뒤! 뒷벽으로 올라가유!']),
	p(
		'Two hundred men turn and claw up the back of the valley through snow to the thigh. Above them, along the lip, the wind has spent all winter building a long white cornice.',
		'사내 이백이 몸을 돌려 허벅지까지 차는 눈을 헤치며 골짜기 뒷벽을 기어오른다. 그 위, 가장자리를 따라, 바람이 겨우내 길고 하얀 눈처마를 쌓아 두었다.'
	),
	p(
		'The boy with the purple sleeve is lying beside it. He looks at the cornice. He looks at the men climbing. He looks along the ridge for somebody to ask, and there is nobody to ask, so he gets up and starts kicking.',
		'자색 소매 아이가 그 옆에 엎드려 있다. 눈처마를 본다. 기어오르는 사내들을 본다. 물어볼 사람을 찾아 능선을 훑는데, 물어볼 사람이 없다. 그래서 일어나 발로 차기 시작한다.'
	),
	extra(...BOY, ['Hey! Everybody kick! Together!'], ['야! 다 차라! 같이!']),
	p(
		'Five boys and a line of farm sons kick the rim of the valley off its own wall. The snow goes down the back slope in one long white sigh and takes the climbers with it, all the way to the bottom of the cup.',
		'아이 다섯과 농가 아들들이 한 줄로 서서 골짜기 가장자리를 제 벽에서 차 떨군다. 눈이 길고 하얀 한숨 한 번으로 뒷비탈을 쓸어내리며, 기어오르던 자들을 데리고 잔 밑바닥까지 내려간다.'
	),
	p('It is the first order the purple boy has ever given. Nobody tells him he was allowed to.', '자색 소매 아이가 생전 처음 내린 명령이다. 그래도 된다고 말해 주는 사람은 없다.')
];

const REWRITE = {
	'On the ridge, the five boys have forgotten to draw.': [
		'Then there is nothing left for the ridge to do but watch. The nangdo on the rim have stopped in a long ragged line, the way people stop at a fire.',
		'그다음엔 능선이 할 일이 구경밖에 없다. 가장자리의 낭도들이 길고 들쭉날쭉한 줄로 멈춰 선다. 사람들이 불구경할 때 멈추듯이.'
	],
	'Two thousand men find they have very little to do.': [
		'Two thousand men will tell this for the rest of their lives, and most will get the numbers wrong. The farm sons at the throat will remember that it was hard. Everyone on the ridge will remember that it looked easy.',
		'이천 군사는 남은 평생 이 얘기를 할 것이고, 대부분은 숫자를 틀리게 말할 것이다. 목을 지킨 농가 아들들은 그게 힘들었다고 기억할 것이다. 능선에 있던 이들은 모두 그게 쉬워 보였다고 기억할 것이다.'
	],
	'Uso climbs the biggest rock in the valley': [
		'Uso climbs the big rock beside the spring, at the very heart of the valley, with a bow and a full quiver, and holds it alone. He is good. Every arrow finds somebody. Then the quiver ends before the argument does.',
		'우소는 활과 가득 찬 화살통을 들고 골짜기 한복판, 샘 곁의 큰 바위에 올라가 혼자 버틴다. 솜씨가 좋다. 화살마다 누군가를 찾아간다. 그러다 화살이 먼저 바닥난다.'
	],
	'The boys of Class 77 ride home behind them in silence': [
		'The boys of Class 77 ride home behind them in silence, which for boys that age is a kind of prayer. Tomorrow on the ice they will try to move like that, and fall down, and try again. The boy with the mended sleeve rides with blood dried on it. He will not mend it this time.',
		'칠십칠기 아이들은 그 뒤를 따라 말없이 돌아간다. 그 나이 사내아이에게 말없음은 일종의 기도다. 내일 얼음판 위에서 아이들은 저렇게 움직여 보려다 넘어지고, 또 해 볼 것이다. 소매 기운 아이의 소매엔 피가 말라붙어 있다. 이번엔 꿰매지 않을 것이다.'
	]
};

editStory((story) => {
	const entry = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Jade Gate Valley');
	const b = entry.blocks;
	if (b.some((x) => x.html?.startsWith('Here is the valley, since you will need it.'))) return false;
	const at = (frag) => {
		const i = b.findIndex((x) => textOf(x).includes(frag));
		if (i < 0) throw new Error(`anchor not found: ${frag}`);
		return i;
	};
	for (const [frag, [html, ko]] of Object.entries(REWRITE)) Object.assign(b[at(frag)], { html, ko });
	b.splice(at('The army comes up the road behind them'), 1);
	b.splice(at('Below, the Baekje camp.') + 1, 0, ...GEOGRAPHY);
	b.splice(at('Two of Class 51') + 1, 0, ...MARK);
	b.splice(at('rides it straight into the next fire') + 1, 0, ...THROAT);
});
console.log('jade battle: done');
