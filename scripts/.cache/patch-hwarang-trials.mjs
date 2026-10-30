// Hwarang yard trials: group games, nangdo vs hwarang, unique strengths.
import { openStory, p, insertAfter, guard, text } from './story-edit.mjs';

const { entry, say, save } = openStory();
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const nam = (speaker, lines, en) => ({
	kind: 'dialogue',
	chip: '#6b7280',
	speaker,
	gender: 'm',
	lines,
	en
});
const sayLook = (person, look, lines, en) => ({ ...say(person, lines, en), look });

function replaceHtml(list, needle, html, ko) {
	const i = list.findIndex((b) => text(b).includes(needle));
	if (i < 0) throw new Error(`replace miss: ${needle}`);
	list[i] = { ...list[i], html, ko };
}

function replaceEn(list, needle, en, lines) {
	const i = list.findIndex((b) => text(b).includes(needle));
	if (i < 0) throw new Error(`replace en miss: ${needle}`);
	list[i] = { ...list[i], en, lines };
}

// ── Bupmin: bells + keep-away ──────────────────────────────────────────────
const bupmin = entry('Bupmin');
guard(bupmin, 'Each of you who wears a hwarang’s headband');

replaceHtml(
	bupmin.blocks,
	'The Hwarang train under the Marshal: horse, bow, verse',
	'The Hwarang train under the Marshal: horse, bow, verse, and a horse-ball game a lazier age will call polo. None of that is the hard part.',
	'화랑은 국선 밑에서 말과 활과 시와, 나중 세상 사람들이 폴로라고 부를 말 공 경기를 익힌다. 어려운 건 그게 아니다.'
);

insertAfter(bupmin, 'Worse. Same class.', [
	scene('The picking', '뽑기'),
	p(
		'On the second morning the Marshal hangs three wooden bells on the split pine. He does not explain. He never explains.',
		'이튿날 아침, 국선이 갈라진 소나무에 나무 방울 셋을 걸어 둔다. 설명은 없다. 원래 없다.'
	),
	say('yushin', ['화랑 머리띠 한 사람마다.', '따라올 사람을 데려가게. 방울 하나. 그림자 저 기둥에 닿기 전에.', '빈손으로 오면 서서 먹네.'], [
		'Each of you who wears a hwarang’s headband.',
		'Take whoever will follow you. One bell. Before the shadow hits that post.',
		'Empty hands eat standing.'
	]),
	p(
		'A hwarang is the one they name. Nangdo are whoever goes with him. Some bands are two. One senior has twenty-two, which the yard thinks is showing off. The hall chart says four. The chart has never been to this yard.',
		'화랑은 이름 불린 사람이다. 낭도는 따라가는 사람이다. 어떤 무리는 둘이다. 선배 하나는 스물둘을 거느렸고, 연무장은 그걸 잘난 척이라고 한다. 전각 그림에는 넷이라고 적혀 있다. 그 그림은 이 마당에 와 본 적이 없다.'
	),
	p(
		'The new hwarang of Class 82 call names. Boys peel off. Pumsuk ends up with nine, and apologises to each of them. Bupmin stands in the middle of the packed earth and names nobody, because he assumed they would come.',
		'팔십이기의 새 화랑들이 이름을 부른다. 아이들이 빠진다. 품석은 아홉을 데려가고, 한 사람마다 미안하다고 한다. 법민은 다진 흙 한가운데 서서 아무도 부르지 않는다. 올 줄 알았으니까.'
	),
	nam('A bigger Nangdo', ['난 안 가.', '왕자 물 떠 주는 거 안 해.'], ['Not me.', 'I’m not carrying a prince’s water.']),
	nam('A small Nangdo', ['…나 갈게.', '어차피 맨 뒤였는데.'], ['…I’ll go.', 'I was going to be last anyway.']),
	say('munmu', ['안 해도 돼—'], ['You don’t have to—']),
	nam('A small Nangdo', ['알아.', '그래서 하는 거야.'], ['I know.', 'That’s why.']),
	say('pumsuk', ['저하, 제 낭도 둘은— 괜찮으시면—'], ['Your Highness, two of mine, if you— if that’s—']),
	say('munmu', ['괜찮아요.', '저 할 수 있어요.'], ['I don’t need yours.', 'I can do it.']),
	p(
		'He runs at the pine the way a boy runs at a problem he has already solved in his head. Yushin does not even set his feet. Bupmin is on his back in the dust, looking at the sky, and the bell has not moved.',
		'머리로 이미 이긴 문제를 향해 달리듯, 소나무를 향해 달린다. 유신은 발도 안 디딘다. 법민은 먼지 바닥에 누워 하늘을 보고 있고, 방울은 그대로다.'
	),
	say('yushin', ['시간일세.'], ['Time.']),
	p(
		'The small nangdo is still where Bupmin left him. Halfway. Holding nothing.',
		'작은 낭도는 법민이 두고 온 자리에 그대로 있다. 중간. 손에 든 건 없다.'
	),
	say(
		'yushin',
		['서서 먹게.', '저들 다 먹은 뒤에 — 자네 둘. 다시. 내가 그만하라 할 때까지.'],
		['Eat standing.', 'After they finish — you two. Again. Until I say.']
	),
	say('munmu', ['삼촌—'], ['Uncle—']),
	say(
		'yushin',
		[
			'국선이네.',
			'이 마당에서 나는 삼촌이 아니네. 자네도 자네 아버지 이름이 아니네.',
			'화랑인데 낭도가 먼지 속에 잊어버린 아이 하나일세.',
			'일어나게.'
		],
		[
			'Marshal.',
			'On this yard I am not your uncle. And you are not your father’s name.',
			'You are a hwarang whose nangdo is one boy you forgot in the dust.',
			'Get up.'
		]
	),
	scene('The bells, again', '방울, 다시'),
	p(
		'Dusk. Same pine. Same two of them. The small nangdo has been thinking, which is more than anyone asked of him.',
		'해 질 녘. 같은 소나무. 같은 둘. 작은 낭도는 생각하고 있었다. 누가 시킨 건 아닌데.'
	),
	nam('A small Nangdo', ['돌아가면—'], ['If we go around—']),
	say('munmu', ['돌아갈 시간 없어.'], ['There’s no time to go around.']),
	p(
		'There is. He doesn’t take it. Yushin takes the bell down himself when the shadow hits the post, and looks at his sister’s son the way he looks at a saddle tied wrong.',
		'있다. 안 간다. 그림자가 기둥에 닿자 유신이 방울을 직접 내린다. 그리고 여동생의 아들을 본다. 매듭이 잘못된 안장을 볼 때처럼.'
	),
	say(
		'yushin',
		['소나무. 안 보일 때까지.', '둘 다. 저 아이는 서 있었네. 혼자 뛰는 거 아니네.'],
		['The pine. Until you can’t see it.', 'Both of you. He stood there. You don’t get to run it alone.']
	)
]);

insertAfter(bupmin, 'That is the trouble with Gotaso, and also the best thing about her.', [
	scene('Keep-away', '뺏기'),
	p(
		'A month on, he has three nangdo. The small one, and two who got tired of waiting for a cooler band. Gyuku keep-away. Pumsuk’s nine against Bupmin’s three. The ball is a leather thing that hates everyone equally.',
		'한 달이 지나니 낭도가 셋이다. 작은 아이, 그리고 더 멋있는 무리를 기다리다 지친 둘. 격구로 공 뺏기. 품석의 아홉 대 법민의 셋. 공은 가죽인데, 모두를 똑같이 미워한다.'
	),
	say('pumsuk', ['미안— 미안합니다— 그건 제— 용서하십시오—'], ['Sorry— sorry— that’s my— forgive me—']),
	p(
		'He still scores. Bupmin takes the ball every time it comes near him, because a prince is supposed to. They lose seven to one. The one is an accident.',
		'그래도 넣는다. 공이 가까이 올 때마다 법민이 잡는다. 왕자면 그래야 하는 줄 알아서. 일곱 대 일. 그 일은 사고다.'
	),
	nam('A small Nangdo', ['선배.', '패스.'], ['Sunbae.', 'Pass.']),
	say('munmu', ['내가 잡았잖아.'], ['I had it.']),
	nam('A small Nangdo', ['잡았지.', '그다음엔 저 사람이 잡았잖아.'], ['You had it.', 'Then he had it.']),
	say('yushin', ['다시.'], ['Again.']),
	p(
		'Second game his hands don’t want to. He does it anyway. The small nangdo is where he said he would be. The ball goes. They don’t win. They score twice. Yushin does not praise anybody. He moves the post.',
		'두 번째 게임에선 손이 싫다고 한다. 그래도 한다. 작은 낭도는 약속한 자리에 있다. 공이 간다. 이기진 못한다. 두 점 넣는다. 유신은 아무도 칭찬하지 않는다. 기둥을 옮긴다.'
	),
	say('yushin', ['그게 무리일세.', '나 보지 말게. 저들을 보게.'], ['That’s a band.', 'Don’t look at me. Look at them.'])
]);

// ── Munhee: Chunchu captains leftovers ─────────────────────────────────────
const munhee = entry('Munhee');
guard(munhee, 'four flags on the hill');

insertAfter(munhee, 'boys will forgive almost anything for rice', [
	scene('The yard · the hill flags', '연무장 · 언덕 깃발'),
	p(
		'In the third month the yard puts four flags on the hill and tells the hwarang to bring them down. Each hwarang takes his nangdo. The Marshal looks at Chunchu, who has none, and at five boys nobody else called, and solves both problems at once.',
		'셋째 달에 연무장은 언덕에 깃발 넷을 꽂고 화랑더러 내려오라 한다. 화랑마다 자기 낭도를 데려간다. 장수는 낭도 없는 춘추를 보고, 아무도 안 부른 아이 다섯을 보고, 둘 다 한 번에 처리한다.'
	),
	nam('The Yard Marshal', ['도깨비 아들. 오늘 저 다섯은 네 낭도다.', '잃지 말도록.'], [
		'Goblin’s boy. Those five are yours for today.',
		'Try not to lose them.'
	]),
	nam('A leftover Nangdo', ['우리 저 사람 낭도 아닌데.'], ['We’re not his.']),
	say('chunchu', ['아무도 너희 낭도라 안 했어.', '숫자 셀 줄 아는 사람.'], [
		'Nobody said you were.',
		'Can any of you count.'
	]),
	nam('A leftover Nangdo', ['…뭐.'], ['…What.']),
	say(
		'chunchu',
		[
			'길. 세 개야. 다들 앞길로 달려. 마당에서 보이니까.',
			'둘은 도랑. 하나는 능선에 앉아서 실수처럼 보이게. 둘은 나랑, 길 잃은 척 걷고.'
		],
		[
			'Paths. There are three. They’ll all run the front one because it’s the one you can see from the yard.',
			'Two of you take the drainage. One of you sit on the skyline and look like a mistake. Two with me, walking, like we got lost.'
		]
	),
	nam('A leftover Nangdo', ['비겁하잖아.'], ['That’s cowardly.']),
	say('chunchu', ['셈이야.', '비겁한 건, 이미 없어진 깃발 때문에 땀 흘리는 거지.'], [
		'That’s arithmetic.',
		'Cowardly is sweating for a flag that’s already gone.'
	]),
	p(
		'The other bands take the front path in a beautiful, stupid crowd. Chunchu’s five come back with two flags and a third they weren’t supposed to be able to reach. He didn’t climb. He sat on a rock and counted.',
		'다른 무리들은 앞길로 곱게, 멍청하게 몰려간다. 춘추의 다섯은 깃발 둘을 들고 오고, 닿을 수 없어야 할 셋째까지 들고 온다. 그는 안 올라갔다. 바위 위에 앉아 세었다.'
	),
	nam('The Yard Marshal', ['너는 올라가지도 않았잖아.'], ['You didn’t even go up.']),
	say('chunchu', ['가야 할 만큼만 갔습니다, 장수.', '재봤거든요.'], [
		'I went exactly as far as I had to, sir.',
		'I measured.'
	]),
	p(
		'That night the five leftover boys move their mats. Not to the drain end. Next to it. Close enough to ask him what to do tomorrow.',
		'그날 밤 남은 아이 다섯이 자리를 옮긴다. 하수 끝이 아니다. 그 옆이다. 내일 뭘 할지 물을 수 있을 만큼 가깝게.'
	)
]);

// ── Sadaham: not strongest; nangdo gather ──────────────────────────────────
const sadaham = entry('Sadaham');
guard(sadaham, 'You’re not even good');

replaceHtml(
	sadaham.blocks,
	'He finds out flat on his back, with Sadaham’s wooden blade',
	'Mugwan is the best sword in his family. On the third morning he finds out that is not the same as the best sword in the yard. A bigger boy puts Sadaham on his back twice, and Sadaham laughs so loudly the yard master comes out to see who is dying.',
	'무관은 집안에서 칼을 제일 잘 쓴다. 그게 연무장에서 제일이라는 말은 아니라는 걸, 사흘째 아침에 알게 된다. 더 큰 아이가 사다함을 두 번 눕히는데, 사다함이 너무 크게 웃어서 연무장 장수가 누가 죽나 보러 나온다.'
);

insertAfter(sadaham, 'who is dying', [
	nam('A bigger Nangdo', ['이겼잖아. 앉아.'], ['I’ve won. Sit down.']),
	say('sadaham', ['알아. 이기고 나서 심심해지면 뭘 하는지 보고 싶어.', '오늘 밤 말 타. 길 비어.'], [
		'I know. I want to see what you do when you get bored of winning.',
		'Ride tonight. The road’s empty.'
	]),
	nam('A bigger Nangdo', ['…너는 칼도 별로잖아.'], ['…You’re not even good.']),
	say('sadaham', ['그거엔 약하지. 그래도 와.'], ['Not at that. Come anyway.'])
]);

replaceHtml(
	sadaham.blocks,
	'It goes on like that all spring. Sadaham rides at night',
	'The bigger boy comes. Two more come to watch him lose and stay for the road. Mugwan counts them, because someone has to. Three. Then seven. Then he stops counting where they sleep and starts counting who turns around when Sadaham says wait. It goes on like that all spring. Sadaham rides at night because the road is empty. He sings in the bath, badly, and makes the boys at the bottom of the list sing with him until they forget they are at the bottom. He gives his rice away, is hungry by noon, and doesn’t seem to mind. Mugwan keeps waiting for him to run out. He doesn’t.',
	'큰 아이가 온다. 지는 걸 보러 온 둘은 길 때문에 남는다. 무관이 센다. 누가 해야 하니까. 셋. 일곱. 그다음엔 어디서 자는지는 안 세고, 사다함이 기다리라고 하면 누가 돌아보는지 센다. 봄 내내 그렇다. 사다함은 길이 비었다고 밤에 말을 달린다. 목욕하면서 노래를 하는데, 못 부른다. 명단 맨 끝 아이들을 끌어다 같이 부르게 해서, 그 아이들이 자기가 끝인 걸 잊게 만든다. 자기 밥을 나눠 주고 점심때면 배가 고픈데, 상관도 안 하는 눈치다. 무관은 저게 언제 바닥나나 기다린다. 안 난다.'
);

insertAfter(sadaham, 'He thinks it might be everything', [
	p(
		'By the next spring the boys who eat his rice are a dozen. By the time he asks the king for Gaya they are forty, and they wait in the yard while he is on his knee in the hall, and the word for them is nangdo, which only means the ones who went.',
		'이듬해 봄이면 밥을 같이 먹는 아이가 열둘이다. 임금에게 가야를 청할 때면 마흔이고, 그가 전당에서 무릎 꿇는 동안 연무장에서 기다린다. 그들을 낭도라고 한다. 그냥, 따라간 사람들이라는 뜻이다.'
	)
]);

replaceEn(
	sadaham.blocks,
	'The king picks one of us to lead, and the rest follow him up mountains',
	[
		'It’s boys. The king names a hwarang. The ones who follow him are nangdo. Could be two. Could be forty. Mine won’t shut up, so it’s forty.',
		'We ride, and we sing, and—'
	],
	[
		'사내애들이에요. 임금님이 화랑을 하나 고르면, 따라가는 사람들이 낭도예요. 둘일 수도 있고 마흔일 수도 있고. 제 낭도는 입을 안 다물어서, 마흔이에요.',
		'말 타고, 노래하고, 그리고—'
	]
);

insertAfter(sadaham, 'I’ll get the horses', [
	p(
		'Outside, forty nangdo are already holding the reins. Mugwan did not tell them to. They just heard the word going.',
		'바깥에선 낭도 마흔이 이미 고삐를 잡고 있다. 무관이 시킨 게 아니다. 간다는 말만 들었다.'
	)
]);

// Keep Mugwan-vs-Sadaham fourth-hit as the next morning — retie the leftover "Again." exchange
// The original "Again / You've won three times" still follows the new insert because
// we inserted after "who is dying", which is the NEW paragraph, not the old "Again" block.
// Wait: we replaced the first p, then insertAfter "who is dying" which is now THAT p.
// Then the old dialogue "Again" (Sadaham to Mugwan) still follows. That's confusing:
// bigger boy beat Sadaham, then Sadaham says "Again" to Mugwan?
// Need to insert a beat that Mugwan spars him after, or change the old Again lines.
replaceEn(sadaham.blocks, 'You’ve won. Three times.', ['You’ve won. Three times.'], ['세 번이잖아.']);
replaceEn(
	sadaham.blocks,
	'I want to see what you do on the fourth',
	['I know. I want to see what you do on the fourth.', 'You keep your elbow in like your father’s watching. He isn’t. Hit me like he isn’t.'],
	['알아. 네 번째는 뭘 하는지 보고 싶어.', '팔꿈치 붙이는 거, 아버지가 보는 것처럼 하잖아. 안 봐. 안 보는 것처럼 쳐.']
);

// The "Again" after bigger-boy scene currently still reads as Sadaham to Mugwan.
// Add a narrator bridge before it by replacing the first "Again." if it's still the old one...
// After insert, order is: new p (dying) → bigger dialogue → nam not even good → come anyway → OLD Again → You've won three times.
// That's jarring. Insert a p between come anyway and Again.

insertAfter(sadaham, 'Not at that. Come anyway.', [
	p(
		'Then he turns to Mugwan, who has been standing there trying not to look impressed, and puts the wooden blade in his hands.',
		'그다음엔 무관에게 돌아선다. 무관은 감탄하는 티를 안 내려고 서 있었다. 사다함이 목검을 그 손에 쥐여 준다.'
	)
]);

// ── Gi: three eternals as one nangdo band, then their own ───────────────────
const gi = entry('Gi (起)');
guard(gi, 'Practice drum. It’s locked');

const fb = gi.blocks.find((b) => b.kind === 'flashback' && (b.title || '').includes('Higher Teaching'));
if (!fb) throw new Error('Gi: Higher Teaching flashback missing');
const twoNoses = fb.blocks.findIndex((b) => text(b).includes('for the price of two noses'));
if (twoNoses < 0) throw new Error('Gi: two noses miss');

fb.blocks.splice(twoNoses + 1, 0, ...[
	scene('The same band', '같은 무리'),
	p(
		'That afternoon the drum master does not make them hwarang. He makes them nangdo. The three of them, plus a boy who will not last the winter, go to a senior of an older class who already has eleven and does not look pleased about fourteen.',
		'그날 오후 북 장수는 그들을 화랑으로 만들지 않는다. 낭도로 만든다. 셋, 그리고 겨울을 못 넘길 아이 하나. 이미 열하나를 거느린 선배 화랑에게 가고, 열넷이 된 그 선배는 기뻐 보이지 않는다.'
	),
	nam(
		'A senior Hwarang',
		['너희 셋. 줄 서지 말게. 줄이 아니야. 내가 그만하라 할 때까지 내 낭도야.', '곳간. 연습 북. 잠겨 있어. 개. 도랑. 해 지기 전에 가져오게. 방법은 상관없네.'],
		[
			'You three. Don’t stand in a line. You’re not a line. You’re mine until I say otherwise.',
			'Storehouse. Practice drum. It’s locked. Dog. Ditch. Bring it before the light goes. I don’t care how.'
		]
	),
	scene('The storehouse', '곳간'),
	say('alchun', ['내가 찰게.'], ['I’ll kick it.']),
	sayLook(
		'bidam',
		'hwarang',
		['차지 마. 빗장은 안쪽에 있어. 처마 밑에 틈이 있어. 누구 어깨 위에 서면.', '그리고 개는 주먹밥을 좋아해, 알천. 너 두 개 있잖아.'],
		[
			'Don’t. The latch is on the inside. There’s a gap under the eaves if you stand on someone’s shoulders.',
			'Also the dog likes rice cakes, Alchun. You have two.'
		]
	),
	say('alchun', ['있었지.'], ['Had two.']),
	sayLook('yushin', 'hwarang', ['내가 도랑으로 갈게.', '누가 깊이나 봐야지.'], [
		'I’ll go in the ditch.',
		'Somebody has to see if it’s deep.'
	]),
	sayLook('bidam', 'hwarang', ['깊어. 그래서 도랑이야.'], ['It is deep. That’s why it’s a ditch.']),
	sayLook('yushin', 'hwarang', ['그럼 알지.'], ['Then I’ll know.']),
	p(
		'Alchun kicks the door anyway, once, because he can, and the door does not care. Bidam boosts him to the gap. Yushin is already in the ditch up to the chest, feeling for the latch-string with his eyes shut, because that is the kind of dark it is. They come back with the drum and a great deal of mud. The senior looks at them as if he has seen this before.',
		'알천은 그래도 문을 한 번 찬다. 되니까. 문은 상관없다. 비담이 그를 틈까지 올려 준다. 유신은 이미 도랑에 가슴까지 들어가, 눈을 감고 빗장 줄을 더듬는다. 그런 어둠이니까. 북과 진흙을 잔뜩 들고 돌아온다. 선배는 이런 걸 본 적 있다는 눈으로 본다.'
	),
	nam(
		'A senior Hwarang',
		['힘. 머리. 그리고 먼저 들어간 놈.', '나중에 제 무리 받으면 갈라지지 말게. 갈라지고 싶어질 거야. 다들 그래.'],
		['Strong. Smart. And the one who went in first.', 'Don’t split up when they give you your own. You’ll want to. Everyone does.']
	),
	p(
		'Three winters later they do. Alchun’s band is twenty by the second month, because boys like a door that opens. Bidam’s is seven, and he picked each of them with a question they hated. Yushin’s is four farm sons and a Gaya cousin nobody else called. The yard starts saying the Three Eternal Hwarang as a joke. Jokes get thinner.',
		'세 겨울이 지나면 갈라진다. 알천의 무리는 두 달 만에 스물이다. 문이 열리는 걸 아이들이 좋아하니까. 비담의 무리는 일곱이고, 싫어하는 질문으로 한 사람씩 골랐다. 유신의 무리는 농가 아들 넷과, 아무도 안 부른 가야 사촌 하나. 연무장은 삼대화랑이라고 농담처럼 부르기 시작한다. 농담은 얇아진다.'
	)
]);

save();
console.log('patched Bupmin, Munhee, Sadaham, Gi');
