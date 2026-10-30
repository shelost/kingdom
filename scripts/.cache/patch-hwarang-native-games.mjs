// Replace the Naruto bell-steal with Hwarang army drills (the throat, 봉수, 격구 편).
import { openStory, indexOf, text } from './story-edit.mjs';

const { entry, save } = openStory();

function set(e, needle, patch, list = e.blocks) {
	const i = list.findIndex((b) => text(b).includes(needle));
	if (i < 0) throw new Error(`${e.title}: miss ${needle}`);
	Object.assign(list[i], patch);
}

const bupmin = entry('Bupmin');

set(bupmin, 'three wooden bells on the split pine', {
	html: 'On the second morning the Marshal puts older nangdo in the throat between the split pine and the fence. A mock pass. He does not explain. He never explains.',
	ko: '이튿날 아침, 국선이 갈라진 소나무와 울타리 사이 목에 선배 낭도들을 세운다. 가짜 고개. 설명은 없다. 원래 없다.'
});

set(bupmin, 'Each of you who wears a hwarang’s headband.', {
	en: [
		'Each of you who wears a hwarang’s headband.',
		'Take whoever will follow you. Get one man through that gap to the river. Before the shadow hits that post.',
		'Nobody through eats standing.'
	],
	lines: [
		'화랑 머리띠 한 사람마다.',
		'따라올 사람을 데려가게. 저 틈으로 한 명만 강가까지 보내. 그림자 저 기둥에 닿기 전에.',
		'못 보내면 서서 먹네.'
	]
});

set(bupmin, 'He runs at the pine the way a boy runs at a problem', {
	html: 'He runs at the gap the way a boy runs at a problem he has already solved in his head. The seniors in the throat do not even set their feet. Bupmin is on his back in the dust, looking at the sky, and nobody is through.',
	ko: '머리로 이미 이긴 문제를 향해 달리듯, 목을 향해 달린다. 목에 선 선배들은 발도 안 디딘다. 법민은 먼지 바닥에 누워 하늘을 보고 있고, 아무도 못 빠져나갔다.'
});

set(bupmin, 'The bells, again', {
	label: 'The throat, again',
	ko: '목, 다시'
});

set(bupmin, 'Yushin takes the bell down himself', {
	html: 'There is. He doesn’t take it. Yushin calls time when the shadow hits the post, and looks at his sister’s son the way he looks at a saddle tied wrong. The seniors are still in the gap. Nobody is through.',
	ko: '있다. 안 간다. 그림자가 기둥에 닿자 유신이 시간을 부른다. 그리고 여동생의 아들을 본다. 매듭이 잘못된 안장을 볼 때처럼. 선배들은 아직 목에 서 있다. 아무도 못 빠져나갔다.'
});

set(bupmin, 'Keep-away', {
	label: 'Gyuku, two sides',
	ko: '격구, 두 편'
});

set(bupmin, 'Gyuku keep-away. Pumsuk’s nine against Bupmin’s three.', {
	html: 'A month on, he has three nangdo. The small one, and two who got tired of waiting for a cooler band. They play gyuku the way the yard always plays it: two 편, one leather ball, posts at either end of the dust. Pumsuk’s nine against Bupmin’s three. The ball hates everyone equally.',
	ko: '한 달이 지나니 낭도가 셋이다. 작은 아이, 그리고 더 멋있는 무리를 기다리다 지친 둘. 격구는 연무장이 늘 하던 대로다. 두 편, 가죽 공 하나, 먼지 양쪽 끝의 기둥. 품석의 아홉 대 법민의 셋. 공은 모두를 똑같이 미워한다.'
});

set(bupmin, 'On the first night of every class, the Marshal walks', {
	html: 'When a class has been a month on the yard, the Marshal walks the new boys down it with one lamp. He starts at the gate and walks backwards through time. He has never explained why.',
	ko: '한 기가 연무장에서 한 달을 보내고 나면, 국선이 등불 하나로 새 아이들을 그 벽을 따라 걷힌다. 문에서 시작해 시간을 거꾸로 걷는다. 이유는 한 번도 말한 적이 없다.'
});

const munhee = entry('Munhee');

set(munhee, 'The yard · the hill flags', {
	label: 'The yard · the hill beacons',
	ko: '연무장 · 언덕 봉수'
});

set(munhee, 'four flags on the hill and tells the hwarang to bring them down', {
	html: 'In the third month the yard puts four unlit practice beacons on the hill — iron baskets of kindling, the kind a ridge uses to talk to the next ridge — and tells each hwarang to light his own and keep it lit. You may kick another band’s fire out. Each hwarang takes his nangdo. The Marshal looks at Chunchu, who has none, and at five boys nobody else called, and solves both problems at once.',
	ko: '셋째 달에 연무장은 언덕에 연습 봉수 넷을 올려 둔다. 쇠우리에 불쏘시개. 능선이 다음 능선에게 말 거는 그것이다. 화랑마다 제 불을 살리고 지키라 한다. 다른 무리 불은 차서 꺼도 된다. 화랑마다 자기 낭도를 데려간다. 장수는 낭도 없는 춘추를 보고, 아무도 안 부른 아이 다섯을 보고, 둘 다 한 번에 처리한다.'
});

set(munhee, 'Cowardly is sweating for a flag that’s already gone.', {
	en: ['That’s arithmetic.', 'Cowardly is sweating for a fire that’s already out.'],
	lines: ['셈이야.', '비겁한 건, 이미 꺼진 불 때문에 땀 흘리는 거지.']
});

set(munhee, 'come back with two flags and a third they weren’t supposed to be able to reach', {
	html: 'The other bands take the front path in a beautiful, stupid crowd. Chunchu’s five come back with two beacons still burning and a third they weren’t supposed to be able to light. He didn’t climb. He sat on a rock and counted.',
	ko: '다른 무리들은 앞길로 곱게, 멍청하게 몰려간다. 춘추의 다섯은 봉수 둘을 살려 두고 오고, 닿을 수 없어야 할 셋째까지 살려 둔다. 그는 안 올라갔다. 바위 위에 앉아 세었다.'
});

save();
console.log('native games: throat, beacons, gyuku 편');
