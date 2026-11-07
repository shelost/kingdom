/**
 * Full Kangrim west road: Samhan → Huaxia → Bukjeok → Tubo → Chunchuk →
 * Pasa → Bulim (no Yamato, no Namyang), three rivers, threefold path,
 * Mujangsung, 78 paths, gardener. Madness rises with distance from Korea.
 */
import { editStory } from './story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const d = (who, en, lines) => {
	const block = {
		kind: 'dialogue',
		en: Array.isArray(en) ? en : [en],
		lines: Array.isArray(lines) ? lines : [lines]
	};
	if (who.person) {
		block.person = who.person;
		if (who.look) block.look = who.look;
	} else {
		block.speaker = who.speaker;
		if (who.gender) block.gender = who.gender;
	}
	if (who.chip) block.chip = who.chip;
	return block;
};

const K = { person: 'kangrim', look: 'mortal', chip: '#4a4a58' };
const GATE = { speaker: 'Gate-god', gender: 'm', chip: '#6a6a58' };
const KITCHEN = { speaker: 'Kitchen-god', gender: 'm', chip: '#8a5a3a' };
const HOST = { speaker: 'A host on the road', gender: 'm', chip: '#8d8d95' };
const NOMAD = { speaker: 'A steppe rider', gender: 'm', chip: '#8B6914' };
const MONK = { speaker: 'Mujangsung', gender: 'm', chip: '#4a5a4a' };
const DOOR = { speaker: 'Gate-god', gender: 'm', chip: '#6a6a58' };
const G = { person: 'sara', look: 'field', chip: '#8FBF8A' };

const road = [
	scene('The Road Down', '저승길'),
	p(
		'The gate-god and the kitchen-god put him on the road, because his wife had kept them fed.',
		'문신과 조왕이 길을 열어 준다. 아내가 먹여 줘서다.'
	),
	d(GATE, ['West.', 'Stay near the names you know as long as you can.'], ['서쪽.', '아는 이름 곁에 오래 있어라.']),
	d(
		KITCHEN,
		['The farther from your dirt, the thinner you get.', 'Eat. Fight only what you must.'],
		['흙에서 멀수록 야위다.', '먹어라. 싸울 것만 싸워라.']
	),
	d(K, ['Harvest is a date.', 'I intend to keep it.'], ['가을걷이는 날짜요.', '지킬 생각이오.']),

	scene('Leaving the Three Hans', '삼한을 떠나며'),
	p(
		'He leaves Samhan still whole. The Three Hans are under his feet. The air smells like the post scratched for harvest. He can still hear dogs that know his name.',
		'삼한을 떠날 때 그는 아직 온전하다. 삼한이 발 아래 있다. 공기에서 가을걷이 기둥이 긁힌 냄새가 난다. 제 이름을 아는 개 소리가 아직 들린다.'
	),
	p(
		'Hallakgungi’s road was hunger and beatings from the first step. Kangrim’s begins with size and manners. That will not last. Distance from the ancestral dirt is its own fever.',
		'할락궁이의 길은 첫걸음부터 배고픔과 매였다. 강림의 길은 덩치와 예절로 시작한다. 오래가지 않는다. 조상 흙에서 멀어지는 것 자체가 열이다.'
	),

	scene('The Western Empire', '서쪽 제국'),
	p(
		'First the Western Empire. Huaxia. Mile-posts. Inns. A stuck axle on the road — he lifts it before anyone asks. They feed him. He leaves before dawn.',
		'먼저 서쪽 제국. 화하. 이정표. 객점. 길에 박힌 수레축 — 묻기 전에 든다. 밥을 준다. 새벽에 떠난다.'
	),
	d(
		HOST,
		['Sit.', 'You look like you could lift the roof.', 'We will not ask.'],
		['앉게.', '지붕도 들 것 같네.', '부탁은 안 하겠네.']
	),
	d(K, ['A bowl is enough.'], ['그릇 하나면 되오.']),
	p(
		'Bandits try him at a ford. He breaks two arms and does not take their coin. He is still polite. Korea is only a few hundred li behind him. He can still taste it.',
		'여울에서 산적이 덤빈다. 팔 둘을 꺾고 돈은 안 가져간다. 아직 공손하다. 한국이 수백 리 뒤에 있다. 아직 그 맛이 난다.'
	),

	scene('The Northern Nomads', '북적'),
	p(
		'North of the empire, the Bukjeok steppe. Felt. Horses. A rider shares meat if Kangrim will hold a restive stallion. He holds it. They call him brother for a night.',
		'제국 북쪽, 북적 초원. 펠트. 말. 사내가 사나운 씨를 잡아 주면 고기를 나눈다. 잡는다. 하룻밤 형이라 부른다.'
	),
	d(NOMAD, ['Heavy hands.', 'Good.'], ['손 무겁네.', '좋다.']),
	p(
		'At dawn another band wants the horse. He fights them in the dust until they stop. He does not smile after. The steppe is farther from the scratched post than the inns were.',
		'새벽에 다른 무리가 말을 탐낸다. 먼지가 멎을 때까지 싸운다. 그 뒤엔 웃지 않는다. 초원은 객점보다 긁힌 기둥에서 멀다.'
	),

	scene('The Land of Air', '바람의 땅'),
	p(
		'Around the Land of Air. Tubo’s ice roof. He does not climb it. He goes around, as the advice said. The wind at the edge strips the fat from his face.',
		'바람의 땅을 돈다. 토번의 얼음 지붕. 오르지 않는다. 돌라고 했으니 돈다. 가장자리 바람이 얼굴의 살을 벗긴다.'
	),
	p(
		'A caravan offers salt. He takes it. A man laughs at his Korean name — Kangrim hits him once, hard enough that the laugh ends, soft enough that the man keeps his teeth. He apologises without meaning it. Something in him has started counting how far home is.',
		'대상이 소금을 준다. 받는다. 사내가 한국 이름을 비웃는다 — 강림이 한 대 친다. 웃음이 끊길 만큼, 이는 남을 만큼. 미안하다 말하고 뜻은 없다. 무언가가 집까지 거리를 세기 시작했다.'
	),

	scene('The Land of Earth', '대지의 땅'),
	p(
		'Around the Land of Earth. Chunchuk’s long plains. Monks share a joke he only half has. He laughs at the half. That night he dreams of the harvest post and wakes with his fists closed.',
		'대지의 땅을 돈다. 천축의 긴 들. 승려가 반도 모르는 말로 농담을 한다. 아는 반쪽만 웃는다. 그날 밤 가을걷이 기둥을 꿈꾼다. 주먹을 쥐고 깬다.'
	),
	p(
		'Road-thieves again. He does not break arms this time. He breaks the fight until nobody stands, and keeps walking before anyone can thank him. His bowl hand shakes when he eats. Distance is a fever now.',
		'또 길 도둑. 이번엔 팔을 안 꺾는다. 아무도 안 일어설 때까지 싸움을 꺾고, 고맙다는 말 나오기 전에 걷는다. 밥 담는 손이 떤다. 거리가 이제 열이다.'
	),

	scene('The Land of Fire', '불의 땅'),
	p(
		'Through the Land of Fire. Pasa. Oil. Horse. A fire-temple yard — a boy asks him to hold a rope while men raise a beam. He holds it. They feed him. He eats too fast.',
		'불의 땅을 지난다. 파사. 기름. 말. 불의 사당 마당 — 아이가 줄을 잡아 달라 한다. 잡는다. 밥을 준다. 너무 빨리 먹는다.'
	),
	p(
		'That evening a quarrel over a water jar turns into knives. Kangrim should walk away. He does not. When it is over he is breathing like a dog and the jar is unbroken in his hand. He does not remember deciding to fight.',
		'저녁, 물항아리 다툼이 칼로 번진다. 강림은 비켜야 한다. 안 비킨다. 끝나고 나면 개처럼 숨이 차고, 항아리는 제 손에 깨지지 않은 채다. 싸우기로 한 기억이 없다.'
	),
	d(K, ['…Harvest.'], ['…가을걷이.']),
	p(
		'He says it to nobody. The word sounds thinner this far west.',
		'아무도 아닌 이에게 말한다. 이만큼 서쪽에서는 그 말이 야위다.'
	),

	scene('The Land of Water', '물의 땅'),
	p(
		'Through the Land of Water. Bulim. Salt coast. Glass. A fisherman points west with his chin. Kangrim almost hits him for pointing. He stops his own hand an inch from the man’s face.',
		'물의 땅을 지난다. 불림. 소금 바닷가. 유리. 어부가 턱으로 서쪽을 가리킨다. 가리켰다고 칠 뻔한다. 제 손을 그 얼굴 한 치 앞에서 멈춘다.'
	),
	p(
		'He is drained. The strongman the village measured by rice-sacks is a raw nerve in a large body. He sleeps badly. He dreams of dogs that no longer know his name. Japan is east of home; he did not go there. The southern seas are south; he did not go there. West was the fever, and west is what he took.',
		'소진됐다. 마을이 쌀가마로 재던 장사가, 큰 몸 안의 날선 신경이다. 잠이 나쁘다. 제 이름을 모르는 개를 꾼다. 왜는 집의 동쪽이다. 안 갔다. 남양은 남쪽이다. 안 갔다. 서쪽이 열이었고, 서쪽을 골랐다.'
	),
	p(
		'In a harbour alley three men decide he looks rich enough. He leaves them on the stones and does not check if they breathe. Later he sits on the pier and shakes until the salt air hurts his teeth.',
		'항구 골목에서 셋이 그를 넉넉해 보인다고 본다. 돌 위에 두고, 숨 쉬는지는 안 본다. 나중에 부두에 앉아, 이빨이 아플 때까지 떤다.'
	),

	scene('The Three Rivers', '세 강'),
	p(
		'Past the last harbour the living map softens into water. Three rivers. White first.',
		'마지막 항구 너머, 산 지도가 물로 묽어진다. 강이 셋. 먼저 백천.'
	),
	p(
		'The White River is cold and shallow enough to shame him. He fords it cursing under his breath, as if the cold were a person.',
		'백천은 차갑고, 얕아서 오히려 창피하다. 여울을 건너며 낮은 소리로 욕한다. 추위가 사람인 것처럼.'
	),
	p(
		'The Yellow River is deeper. Midstream something pulls at his ankle — weed, or a hand that is not a hand. He kicks free and crawls out on the far bank with mud in his mouth.',
		'황강은 더 깊다. 한가운데서 발목을 잡아끈다 — 풀인지, 손이 아닌 손인지. 차 버리고 건너편에 기어 오른다. 입에 진흙.'
	),
	p(
		'The Red River is last. He does not ford it clean. He fights the current as if it owed him money, and comes out looking like a man who has been in a war that only water saw.',
		'적천이 마지막이다. 깨끗이 건너지 못한다. 돈이 빚진 것처럼 여울과 싸우고, 물만 본 전쟁을 치른 사내처럼 나온다.'
	),

	scene('The Threefold Path', '세 갈래 길'),
	p(
		'Then the road splits three ways. Right, they say, is paradise. Left is hell. The middle is Seocheon — the Western Flower Field.',
		'길이 셋으로 갈라진다. 오른쪽은 극락이라 한다. 왼쪽은 지옥. 가운데가 서천 — 서천꽃밭.'
	),
	d(K, ['Middle.'], ['가운데.']),
	p(
		'He almost takes the left, for a second, because anger likes a short road. He does not. A man sent for a judge still has one job.',
		'잠깐, 왼쪽을 고를 뻔한다. 분노는 짧은 길을 좋아해서. 안 고른다. 판관을 데리러 온 사내에겐 아직 일거리가 하나다.'
	),

	scene('Mujangsung', '무장승'),
	p(
		'On the middle path: a spring, and an armed monk who has been waiting longer than any harvest calendar.',
		'가운데 길에 약수가 있다. 어떤 가을걷이 달력보다 오래 기다린 무장한 승려.'
	),
	d(
		MONK,
		['Drink.', 'Then walk.', 'Three thousand li. Do not count them out loud.'],
		['마셔라.', '그리고 걸어라.', '삼천 리. 소리 내어 세지 마라.']
	),
	d(K, ['Will the date keep?'], ['날짜는 지키겠소?']),
	d(MONK, ['That is not my spring.'], ['그건 내 약이 아니다.']),
	p(
		'Kangrim drinks. His hands want to take the monk’s staff. He puts them in the water instead until they go numb.',
		'강림이 마신다. 손이 승려의 지팡이를 탐낸다. 대신 물에 넣어 감각이 없을 때까지 둔다.'
	),

	scene('Three Thousand Li', '삼천 리'),
	p(
		'Three thousand li is a sentence you say in one breath and a walk you do while forgetting your own face. He sleeps under wagons. He lifts what other men cannot. He also hits a man who only asked the hour.',
		'삼천 리는 한 숨에 말하는 문장이고, 제 얼굴을 잊으며 걷는 길이다. 수레 밑에서 잔다. 남이 못 드는 것을 든다. 시각만 물은 사내도 친다.'
	),
	p(
		'He apologises after. The apology sounds like a foreign language. Home is so far that manners have to be translated back into his mouth.',
		'뒤에 사과한다. 사과가 외국어처럼 들린다. 집이 너무 멀어서, 예절을 입에 도로 번역해야 한다.'
	),

	scene('The Seventy-Eight Paths', '일흔여덟갈래길'),
	p(
		'Past the counted road the world forks again — not three ways. Seventy-eight.',
		'센 길 너머, 세계가 또 갈라진다. 셋이 아니다. 일흔여덟.'
	),
	p(
		'Kangrim stands at the mouth of them and weeps the way the cha사 song says a living man weeps when the map runs out of mercy. He does not know which path is the underworld’s. He only knows none of them smell like Korea.',
		'강림은 그 어귀에 서서, 차사 노래가 말하듯, 지도가 자비를 잃을 때 산 사람이 우는 방식으로 운다. 어느 길이 저승인지 모른다. 아는 건, 하나도 한국 냄새가 안 난다는 것뿐이다.'
	),
	d(
		DOOR,
		['I told you each road once.', 'The one you want does not love you back.', 'Take it anyway.'],
		['길마다 한 번씩 일러 줬다.', '네가 원하는 길은 너를 사랑하지 않는다.', '그래도 가라.']
	),
	p(
		'He takes the road the gate-god names. He is almost empty. What is left of him is the job, and a date he can no longer picture on a post.',
		'문신이 댄 길로 들어간다. 거의 비었다. 남은 건 일거리와, 기둥 위에서 더는 그릴 수 없는 날짜다.'
	),

	scene('The Last Pond', '마지막 못'),
	p(
		'At the end of that path: a pond that does not belong to any empire.',
		'그 길의 끝에, 어느 제국에도 속하지 않는 못이 있다.'
	),
	p(
		'He looks at it a long time. Harvest is a date. This is not.',
		'오래 본다. 가을걷이는 날짜가 있다. 이건 없다.'
	),
	p('He shuts his eyes and jumps.', '눈을 감고 뛰어든다.'),

	scene('The Flower Field', '꽃밭'),
	p(
		'The fall does not end at a gate. It ends in flowers.',
		'추락은 문에서 끝나지 않는다. 꽃에서 끝난다.'
	),
	p(
		'The road west is a flower field. It runs until the colour runs out. Kangrim lands hard enough to hurt, which means he is still a body.',
		'서쪽 길은 꽃밭이다. 색이 다할 때까지 간다. 강림은 아플 만큼 세게 落地한다. 아직 몸이라는 뜻이다.'
	),
	p(
		'A young man is already in the rows. He has a hoe. He does not give a name. Kangrim’s first instinct is to take the hoe away from him.',
		'젊은 사내가 이미 이랑에 있다. 호미를 들었다. 이름은 안 댄다. 강림의 첫 본능은 그 호미를 빼앗는 것이다.'
	),
	d(G, ["Don't ask my name.", "And don't take the hoe.", "You're loud enough already."], [
		'이름 묻지 마.',
		'호미도 빼앗지 마.',
		'충분히 시끄러워.'
	]),
	d(K, ['I’m going down. Not back.'], ['내려가는 길이오. 돌아가는 길이 아니오.']),
	d(G, ['Everyone says that in this field.'], ['이 밭에선 다 그렇게 말해.']),
	p(
		'The gardener looks at him the way you look at a fever that walked in on two feet. Then he cuts three flowers.',
		'정원사는 두 발로 걸어 들어온 열을 보듯 그를 본다. 그리고 꽃 셋을 꺾는다.'
	),
	d(
		G,
		[
			'Three. Don’t mix them up.',
			'This one holds a belt.',
			'This one keeps a judge from saying your name today.',
			'This one you don’t spend. It’s the way back.',
			'You’re farther from home than you think. Don’t spend the third proving it.'
		],
		[
			'셋이야. 섞지 마.',
			'이건 띠를 붙잡아.',
			'이건 판관이 오늘 네 이름을 못 부르게 해.',
			'이건 쓰지 마. 돌아가는 길이야.',
			'집보다 멀어. 셋째로 그걸 증명하지 마.'
		]
	),
	p('He puts the three in his sash. His hands are steadier holding flowers than they were holding knives.', '셋은 띠 속에 넣는다. 칼을 들 때보다 꽃을 들 때 손이 덜 떤다.')
];

editStory((story) => {
	const en = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Grim Reaper');
	if (!en) throw new Error('Grim Reaper missing');

	const roadAt = en.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Road Down');
	const afterFlower = en.blocks.findIndex(
		(b, i) => i > roadAt && b.kind === 'scene' && b.label === 'The Belt'
	);
	if (roadAt < 0 || afterFlower < 0) throw new Error(`range ${roadAt} ${afterFlower}`);

	en.blocks.splice(roadAt, afterFlower - roadAt, ...road);
	console.log('rewrote road →', en.blocks.length, 'blocks; scenes:', en.blocks.filter((b) => b.kind === 'scene').map((b) => b.label).join(' | '));
});
