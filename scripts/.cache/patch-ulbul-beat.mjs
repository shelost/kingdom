/** Flatten Ulbul flashbacks into chronological order; expand the shoe beating, Bongsang's excess, and the hunt ambush. */
import { editStory } from './story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko, extra = {}) => ({ kind: 'scene', label, ko, ...extra });
const d = (person, en, lines, extra = {}) => ({ kind: 'dialogue', person, en, lines, ...extra });
const unnamed = (speaker, gender, chip, en, lines) => ({
	kind: 'dialogue',
	speaker,
	gender,
	chip,
	en,
	lines
});

const SHOE_AFTER = [
	p(
		'They take the salt. They take the afternoon out of his back.',
		'그들은 소금을 가져간다. 그의 등에서 오후를 가져간다.'
	),
	scene('The yard · that afternoon', '마당 · 그날 오후', { weather: 'day', year: 296 }),
	p(
		'The old woman does not look away. She stands with her arms folded, the shoe in one hand, and watches a prince of the house go into the dirt.',
		'할멈은 눈을 돌리지 않는다. 팔짱을 끼고, 신 한 짝을 들고, 전각의 왕자가 흙에 눕는 걸 본다.'
	),
	unnamed(
		'The old woman',
		'f',
		'#8a7a68',
		['That’s for a shoe.', 'Don’t look at me like that. I have a winter too.'],
		['신값이다.', '그런 눈으로 보지 마. 나도 겨울이 있어.']
	),
	p(
		'Commoners hold the sticks. Men who would have gone to their knees in a yard he does not own anymore. Jaemo is held back by two of them. He is still talking. Nobody is listening.',
		'막대기는 평민들이 든다. 그가 주인이던 마당이면 무릎을 꿇었을 사내들. 재모는 둘에게 붙들린다. 아직도 말한다. 듣는 사람은 없다.'
	),
	d(
		'jaemo',
		['Let go.', 'He didn’t— he didn’t take it.', 'That’s a hall hand. Look at his hands—'],
		['놔.', '안 훔쳤어. 안 훔쳤다고.', '전각 손이야. 손 봐—'],
		{ chip: '#c4a574' }
	),
	unnamed(
		'The magistrate',
		'm',
		'#5c564c',
		['Count.', 'When you lose count, we’re done.'],
		['세.', '세다 놓치면, 끝이다.']
	),
	p(
		'He counts. He has always counted. A prince of Goguryeo, blood in the packed earth, beaten by men who salt their pot with what they can take. That is as low as this one goes.',
		'그는 센다. 늘 셌다. 고구려의 왕자. 다진 흙에 피. 간을 맞출 소금이 필요해서 때리는 사내들. 이 사람은, 여기가 바닥이다.'
	),
	p(
		'He does not say a name. He does not say a house. He takes the sticks, and he goes.',
		'이름을 대지 않는다. 집을 대지 않는다. 맞고, 간다.'
	)
];

const SHOE_NIGHT = [
	p(
		'She smiles with her mouth only. He sleeps with the sack under his head, because that is what you do when a roof looks at you like a hole.',
		'그녀는 입으로만 웃는다. 그는 가마니를 베고 잔다. 지붕이 구멍처럼 볼 때는 그렇게 잔다.'
	),
	p(
		'In the dark she sits up. One shoe. Dry. She works it into the salt the way you hide a stone in rice. She lies down again. She does not sleep.',
		'어둠 속에서 그녀는 일어앉는다. 신 한 짝. 마른 것. 쌀에 돌을 숨기듯 소금 속에 넣는다. 다시 눕는다. 잠은 안 온다.'
	)
];

const DEBAUCHERY = [
	scene('The inner hall · a long night', '내전 · 긴 밤', { weather: 'night', year: 292 }),
	p(
		'The cups do not go back to the kitchen. Neither do the women. A new screen, then another, gold thread a country cannot eat.',
		'잔은 부엌으로 안 돌아간다. 여인들도. 병풍이 하나 더, 또 하나. 나라가 못 먹는 금실.'
	),
	p(
		'He laughs with his mouth open. Someone pours. Someone sits closer than a minister is allowed. The lamp is still going at dawn, and the roof is already a plan.',
		'입을 열고 웃는다. 누가 따른다. 누가, 대신에게 허락된 거리보다 가까이 앉는다. 새벽에도 등은 켜 있고, 지붕은 이미 계획이다.'
	),
	d(
		'bongsang',
		['More.', 'If they can see the roof they forget the ditch.', 'Pour.'],
		['더.', '지붕을 보면 도랑은 잊는다.', '따라.'],
		{ chip: '#6e2a2a' }
	),
	unnamed(
		'A woman of the inner rooms',
		'f',
		'#a07070',
		['Majesty. The outer hall is still waiting.', 'Changjori again.'],
		['전하. 바깥은 아직 기다려요.', '창조리예요. 또.']
	),
	d(
		'bongsang',
		['Tomorrow.', 'Tell him the roof comes first.'],
		['내일.', '지붕이 먼저라고 해.'],
		{ chip: '#6e2a2a' }
	)
];

const PALACE_FAMINE = [
	scene('The new roof · a hungry month', '새 지붕 · 굶는 달', { weather: 'day', year: 300 }),
	p(
		'Upriver the scaffolds go up a second time. A pavilion on a pavilion. Red pillars. A pond that was a field last year. The king wants the water where he can see it from the cup.',
		'강 위로는 비계가 두 번째 올라간다. 전각 위의 전각. 붉은 기둥. 작년에 밭이던 못. 임금은 잔에서 물이 보이게 하고 싶다.'
	),
	p(
		'Downriver a woman holds a child who has stopped asking. The ditch has learned their names. The new roof has not.',
		'강 아래로는, 더 이상 보채지 않는 아이를 안은 여인. 도랑은 이름을 외웠다. 새 지붕은 아니다.'
	),
	d(
		'bongsang',
		['Higher.', 'If the people look up they are not looking at me.', 'Wine. The white one.'],
		['더 높게.', '위를 보면 나는 안 본다.', '술. 흰 거.'],
		{ chip: '#6e2a2a' }
	),
	unnamed(
		'A builder',
		'm',
		'#6b5a48',
		['Majesty. The beam isn’t coming.', 'The men haven’t eaten.'],
		['전하. 보가 안 옵니다.', '사람들이 못 먹었습니다.']
	),
	d(
		'bongsang',
		['Then they can look at the roof while they wait.', 'A hungry man still has eyes.'],
		['기다리는 동안 지붕을 보라 해.', '굶어도 눈은 있잖아.'],
		{ chip: '#6e2a2a' }
	)
];

const HUNT_NEW = [
	p(
		'The king takes his ministers into the hills to kill something smaller than a famine. Husan. Autumn. Beaters in the trees. You have seen this kind of party. A gathering. A signal. Later a man in Pyongyang will throw a banquet and drop the screens. This one uses a hat.',
		'임금은 대신들을 언덕으로 데려가, 기근보다는 작은 것을 죽이러 간다. 후산. 가을. 나무 사이에 몰이꾼. 이런 자리, 보신 적 있다. 모임. 신호. 나중에 평양의 사내가 잔치를 열고 병풍을 떨어뜨린다. 이건 모자를 쓴다.'
	),
	p(
		'Changjori waits until the beaters are far enough that a shout would sound like sport. Then he takes a green branch from his sleeve and puts it in his cap.',
		'창조리는 몰이꾼들이 멀어져, 고함이 사냥 소리처럼 들릴 때까지 기다린다. 그리고 소매에서 푸른 가지를 꺼내 관에 꽂는다.'
	),
	d(
		'changjori',
		['Whoever is of one mind with me.', 'A branch in the cap.', 'Now.'],
		['나와 마음을 같이하는 자는.', '갓에 가지를 꽂아라.', '지금.'],
		{ chip: '#8a7048' }
	),
	unnamed(
		'A minister',
		'm',
		'#7a6a58',
		['Prime minister. That’s a branch.', 'On a hunt.'],
		['국상. 그거… 가지요.', '사냥에.']
	),
	d(
		'changjori',
		['Now.', 'Put it in. Or ride down and explain to the ditch.'],
		['지금이오.', '꽂으시오. 아니면 내려가서 도랑에 설명하시오.'],
		{ chip: '#8a7048' }
	),
	p(
		'One green. Then another. Then the slope is a field of branches, and it is not pretty, and everyone understands it at the same time. The ones who will not put a branch in do not get a chance to ride.',
		'초록 하나. 그다음. 그리고 언덕이 가지로 가득하고, 예쁘지 않고, 모두가 동시에 알아차린다. 가지를 안 꽂을 자들은, 말을 돌릴 틈이 없다.'
	),
	p(
		'They close. Not a ring of leaves. A ring of men. Horses at the throat of the path. The king’s whip is up. A follower takes the whip. Another takes the reins. Swords come out because a hunt is still a hunt, and this one has turned.',
		'좁혀 온다. 잎의 고리가 아니다. 사람의 고리다. 길목을 말이 막는다. 임금의 채찍이 올라간다. 따르는 자가 채찍을 받는다. 다른 자가 고삐를 받는다. 칼이 나온다. 사냥은 사냥이니까. 이건 이제 다른 사냥이다.'
	),
	d(
		'bongsang',
		['Changjori.', 'That hat.', 'You put a stick in a hat and you think that’s a country.'],
		['창조리.', '그 모자.', '갓에 막대기 꽂고 나라가 되는 줄 알아.'],
		{ chip: '#6e2a2a' }
	),
	d(
		'changjori',
		['The country already left the hat.', 'Majesty. Get down.'],
		['나라는 이미 모자를 떠났소.', '전하. 내리시오.'],
		{ chip: '#8a7048' }
	),
	d(
		'bongsang',
		['My brother had a son.', 'Tell him to keep selling salt.', 'Kingship is for a man who knows how to look at a roof.'],
		['내 아우, 아들 있었지.', '그 애한테 소금이나 팔라 그래.', '왕 노릇은 지붕 볼 줄 아는 사람이 하는 거야.'],
		{ chip: '#6e2a2a' }
	),
	d(
		'changjori',
		['That’s why we sent for him.', 'Walk.'],
		['그래서 모셨습니다.', '걷으시오.'],
		{ chip: '#8a7048' }
	),
	d(
		'bongsang',
		['…Boys.', 'Come with me. Stand by the door.'],
		['…아들.', '따라와. 문 앞에서 서 있어.'],
		{ chip: '#6e2a2a' }
	),
	p(
		'He laughs once, the way he laughed at Changjori, and it does not come out right. They do not wait for him to finish it. They take the horse. They take the path. They walk him to a side room and put soldiers at the door.',
		'창조리에게 웃던 대로 한 번 웃는데, 제대로 안 나온다. 끝까지 기다려 주지 않는다. 말을 가져간다. 길을 가져간다. 별실로 걷게 하고 문에 병사를 세운다.'
	)
];

function spliceAfter(list, fragment, insert, { replace = 0 } = {}) {
	const i = list.findIndex((b) => [b.html, b.ko, b.label, ...(b.en ?? []), ...(b.lines ?? [])].join(' ').includes(fragment));
	if (i < 0) throw new Error(`missing ${fragment}`);
	list.splice(i + 1, replace, ...insert);
	return i;
}

function replaceRange(list, startFrag, endFrag, insert) {
	const a = list.findIndex((b) => [b.html, b.label, ...(b.en ?? [])].join(' ').includes(startFrag));
	const b = list.findIndex((x, i) => i >= a && [x.html, x.label, ...(x.en ?? [])].join(' ').includes(endFrag));
	if (a < 0 || b < 0) throw new Error(`range ${startFrag} → ${endFrag} (${a},${b})`);
	list.splice(a, b - a + 1, ...insert);
}

editStory((story) => {
	const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Ulbul');
	if (!e) throw new Error('no Ulbul');

	const fbI = e.blocks.findIndex((b) => b.kind === 'flashback');
	if (fbI < 0) throw new Error('no outer flashback');
	const banquet = e.blocks.slice(0, 19);
	const marketHook = e.blocks.slice(19, fbI);
	const fb = e.blocks[fbI];
	const after = e.blocks.slice(fbI + 1);

	const nestedI = fb.blocks.findIndex((b) => b.kind === 'flashback');
	if (nestedI < 0) throw new Error('no nested flashback');
	const nested = fb.blocks[nestedI];
	const history = [...fb.blocks.slice(0, nestedI), ...nested.blocks, ...fb.blocks.slice(nestedI + 1)];

	const crownScene = history.find((b) => b.kind === 'scene' && /first morning/.test(b.label ?? ''));
	if (crownScene) crownScene.jump = { year: 292, en: 'Six Years Later…', ko: '육 년 뒤…' };

	const runScene = history.find((b) => b.kind === 'scene' && /The yard · that morning/.test(b.label ?? ''));
	if (runScene) {
		runScene.jump = { year: 293, en: 'The Next Year…', ko: '그 다음 해…' };
		runScene.label = 'The yard · the morning he still is a prince';
		runScene.ko = '마당 · 아직 왕자이던 아침';
	}

	// Shoe: old woman plants it; then the beating after the salt is taken.
	replaceRange(history, 'She smiles with her mouth only', 'She smiles with her mouth only', SHOE_NIGHT);
	replaceRange(
		history,
		'They take the salt. They take the afternoon out of his back.',
		'They take the salt. They take the afternoon out of his back.',
		SHOE_AFTER
	);

	spliceAfter(history, 'There is no tomorrow. You hear me?', DEBAUCHERY);

	const famineI = after.findIndex((b) => (b.html ?? '').includes('Look down. That is how you see a famine'));
	const hallI = after.findIndex((b) => b.kind === 'scene' && /The hall · that night/.test(b.label ?? ''));
	const biryuI = after.findIndex((b) => b.kind === 'scene' && /Biryu/.test(b.label ?? ''));
	const huntI = after.findIndex((b) => b.kind === 'section' && b.label === 'The Hunt');
	if (famineI < 0 || hallI < 0 || biryuI < 0 || huntI < 0) throw new Error(`split ${famineI} ${hallI} ${biryuI} ${huntI}`);

	const marketContinue = after.slice(0, famineI);
	const starve = after.slice(famineI, hallI);
	const remonstrate = after.slice(hallI, biryuI);
	const kneel = after.slice(biryuI, huntI);
	const huntOn = after.slice(huntI);

	const yards = starve.find((b) => b.kind === 'scene' && /hungry year/.test(b.label ?? ''));
	if (yards) yards.jump = { year: 300, en: 'The Hungry Year…', ko: '굶는 해…' };

	spliceAfter(starve, 'It isn’t coming.', PALACE_FAMINE);

	replaceRange(
		huntOn,
		'The king takes his ministers into the hills',
		'A hunt uses a latch.',
		HUNT_NEW
	);

	const yearsLater = marketHook.find((b) => (b.html ?? '').startsWith('Years later'));
	if (yearsLater) {
		yearsLater.html = 'Downriver, under a fortress that is not his, a man walks to the market for salt.';
		yearsLater.ko = '강 아래, 자기 것이 아닌 산성 아래, 사내가 소금을 사러 장에 간다.';
	}
	const marketScene = marketHook.find((b) => b.kind === 'scene' && /market/.test(b.label ?? ''));
	if (marketScene) {
		marketScene.jump = { year: 300, en: 'The Same Hungry Year…', ko: '같은 굶는 해…' };
		marketScene.label = 'The market · under the fortress';
		marketScene.ko = '장 · 산성 아래';
	}

	e.blocks = [...banquet, ...history, ...starve, ...marketHook, ...marketContinue, ...remonstrate, ...kneel, ...huntOn];

	for (const im of e.images ?? []) {
		if (im.at === 'Whoever is of one mind with me.') im.at = 'Whoever is of one mind with me.';
		if (im.id === 'mich-reed-hats') {
			im.at = 'A branch in the cap.';
			im.alt = 'On the Husan slope: Goguryeo officials putting a green branch in their caps; Changjori first.';
		}
	}

	return true;
});

console.log('patched Ulbul chronological + shoe + debauchery + hunt');
