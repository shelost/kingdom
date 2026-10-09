// Seohyun: the romance with heat. Manmyung leads, the shed nights come before the posting,
// and the unwed pregnancy becomes the city's scandal. Tags the episode as a love story.
// node scripts/.cache/aug/seohyun.cjs [--dry]
const { ep, log, insertAfter, finish } = require('./lib.cjs');

const T = 'Seohyun';
const say = (person, en, ko) => ({ kind: 'dialogue', person, en, lines: ko });
const p = (html, ko) => ({ kind: 'p', html, ko });

// 1. The bar comes up. The mulberry shed, before any posting.
insertAfter(T, (b) => b.kind === 'dialogue' && b.person === 'manmyung' && b.en.join(' ') === 'Liar.', [
	p(
		'Then she lifts the bar. Nobody on that street has seen a Sacred Bone daughter lift her own bar, either.',
		'그러고는 그녀가 빗장을 올린다. 그 거리에서 성골 집 딸이 제 손으로 빗장을 올리는 것도 본 사람은 없다.'
	),
	say(
		'manmyung',
		['Come in.', 'Not the front, idiot. The mulberry shed. Nobody goes in there after dark.'],
		['들어와요.', '앞문 말고요, 바보. 뽕나무 헛간. 해 지면 아무도 안 가요.']
	),
	say(
		'seohyeon',
		['Agassi, I— your father— if anyone—', 'There are rules for this. I don’t know them, but there are—'],
		['아가씨, 저— 아버님께서— 누가 보기라도—', '이런 데도 법도가 있을 텐데요. 저는 모르지만, 분명히—']
	),
	say(
		'manmyung',
		['Then they’ll have something to talk about besides your horse.'],
		['그럼 말 얘기 말고 다른 얘깃거리가 생기겠네요.']
	),
	p(
		'The shed smells of leaves and silkworms. She has his collar open before he has finished apologising for it. He is a careful man, and she is not a careful woman, and somewhere past midnight he stops being careful too.',
		'헛간에서는 뽕잎과 누에 냄새가 난다. 그가 사과를 다 하기도 전에 그녀는 그의 옷깃을 풀어 놓았다. 그는 조심스러운 사내고, 그녀는 조심 같은 건 모르는 여자다. 자정이 지난 어디쯤에서 그도 조심을 그만둔다.'
	),
	say(
		'seohyeon',
		['That was— I should have— a go-between, a proper—', 'Your father should have been asked first.'],
		['방금 그건— 제가 먼저— 중매라도, 제대로—', '아버님께 먼저 여쭸어야 했는데.']
	),
	say(
		'manmyung',
		['Shh. You talk a lot for a man with no shirt on.', 'Same hour tomorrow. Bring the horse, so it looks like an errand.'],
		['쉿. 웃통 벗은 남자치고 말이 너무 많아요.', '내일 같은 시간. 말도 데려와요. 심부름 온 것처럼 보이게.']
	),
	p(
		'He comes the next night, and the next. A go-between would have taken a season. They do not have a season. Some nights they barely have the walk up from the lane.',
		'그는 다음 날 밤에도, 그다음 날 밤에도 온다. 중매를 넣었으면 한 철은 걸렸을 것이다. 그들에겐 한 철이 없다. 어떤 밤엔 골목에서 올라오는 길조차 길다.'
	)
]);

// 2. In her father's hall she takes the blame, and the credit.
insertAfter(T, /I need until he leaves for Manno/, [
	say(
		'manmyung',
		['It was me, you know. Not him. He’d still be apologising to the horse.', 'I lifted the bar. Every night.'],
		['저였어요, 아시죠. 그 사람 말고. 그 사람은 아직도 말한테 사과하고 있었을걸요.', '빗장은 제가 올렸어요. 매일 밤.']
	),
	say('sukhuljong', ['Take her to the back house.'], ['뒷집에 넣어라.'])
]);

// 3. Out of the drain and into his arms, before the horses.
insertAfter(T, /Tonight it knows exactly where it’s going/, [
	p(
		'She kisses him before he can get her on the horse. Hard, in the rain, with drain-mud on her chin and both hands in his hair. The horses wait like men who have seen this before.',
		'그가 그녀를 말에 올리기도 전에 그녀가 입을 맞춘다. 빗속에서, 세게, 턱에 도랑 진흙을 묻힌 채 두 손을 그의 머리칼에 넣고. 말 두 마리는 이런 걸 전에도 본 사내들처럼 기다린다.'
	),
	say('manmyung', ['…There. Now we can go.'], ['…됐어요. 이제 가요.'])
]);

// 4. Manno: one door that shuts.
insertAfter(T, (b) => b.kind === 'p' && /Neither of them learns to cook/.test(b.html), [
	p(
		'The county house has one room with a door that shuts. The clerks learn not to knock before noon.',
		'관아에는 문이 닫히는 방이 하나 있다. 아전들은 정오 전에는 그 문을 두드리지 않는 법을 배운다.'
	)
]);

// 5. With child and unwed: Surabol's favourite story.
insertAfter(T, (b) => b.kind === 'p' && /She is with child by spring/.test(b.html), [
	p(
		'Word reaches Surabol before the spring rains do. A Sacred Bone daughter, with child, in a county house, and no wedding anyone was invited to. The city has been waiting for exactly this. Three banquets in a row talk about nothing else.',
		'소문은 봄비보다 먼저 서라벌에 닿는다. 성골 집 딸이 아이를 뱄다. 시골 관아에서. 누구도 초대받은 적 없는 혼례로. 서라벌은 바로 이걸 기다리고 있었다. 연회 세 번이 내리 그 얘기뿐이다.'
	),
	say(
		'seohyeon',
		['They’re saying things in Surabol. About you. About— there was no wedding, and now—'],
		['서라벌에서 말들이 많답니다. 당신에 대해. 그— 혼례도 없었는데, 이제—']
	),
	say(
		'manmyung',
		['Let them. They’re only saying what we did.', 'And we did it very well.'],
		['하라고 해요. 우리가 한 걸 말하는 것뿐인데.', '그것도 아주 잘했고요.']
	)
]);

const e = ep(T);
e.kinds = [...new Set([...(e.kinds ?? []), 'love'])];
e.badges = ['💕', ...(e.badges ?? []).filter((b) => b !== '💕')];
log.push(`  ${T} kinds: ${e.kinds.join(', ')}; badges: ${e.badges.join(' ')}`);

finish();
