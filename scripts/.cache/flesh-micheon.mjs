#!/usr/bin/env node
/**
 * King Micheon: prince → hired pond → seven years of salt → the shoe → the reeds → Lelang.
 * Emotion first. The commanderies are the payoff, not the lecture.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const PATH = new URL('../../src/lib/data/story.json', import.meta.url);
const data = JSON.parse(readFileSync(PATH, 'utf8'));

function walk(nodes, fn) {
	for (const n of nodes || []) {
		fn(n);
		walk(n.chapters, fn);
		walk(n.entries, fn);
		walk(n.parts, fn);
	}
}

function findEntry(title) {
	let hit;
	walk(data, (n) => {
		if (n.title === title && Array.isArray(n.blocks)) hit = n;
	});
	if (!hit) throw new Error(`missing entry ${title}`);
	return hit;
}

const M = '#C30000';
const J = '#c4a574';
const C = '#8a7048';
const B = '#6e2a2a';
const Z = '#8a9aaa';
const D = '#9a5348';
const E = '#6b5a48';
const JB = '#7a7068';
const S = '#6a7868';
const OLD = '#8a7a68';
const MAG = '#5c564c';
const RID = '#5c4a42';

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko, extra = {}) => ({ kind: 'scene', label, ko, ...extra });
const section = (label, ko) => ({ kind: 'section', label, ko });
const card = (caption, ko) => ({
	kind: 'card',
	person: 'micheon',
	look: 'exile',
	caption,
	ko
});

function say(person, lines, en, extra = {}) {
	const chip =
		person === 'micheon'
			? M
			: person === 'jaemo'
				? J
				: person === 'changjori'
					? C
					: person === 'bongsang'
						? B
						: person === 'zhangtong'
							? Z
							: person === 'dolgo'
								? D
								: person === 'eummo'
									? E
									: person === 'jobul'
										? JB
										: person === 'sou'
											? S
											: extra.chip;
	const out = { kind: 'dialogue', person, chip, lines, en, ...extra };
	delete out.chip; // re-set below so extra.chip can override
	out.chip = extra.chip ?? chip;
	if (person === 'micheon' && extra.look !== undefined) out.look = extra.look;
	else if (person === 'micheon') out.look = extra.king ? 'king' : 'exile';
	delete out.king;
	return out;
}

function voice(speaker, gender, chip, lines, en) {
	return { kind: 'dialogue', speaker, gender, chip, lines, en };
}

const entry = findEntry('King Micheon');

entry.logline = {
	en: 'A prince throws stones at frogs so a stranger can sleep. They find him seven years later, selling salt.',
	ko: '왕손은 남이 자게 하려고 개구리에게 돌을 던진다. 일곱 해 뒤, 사람들은 소금을 팔고 있는 그를 찾는다.'
};
entry.toneNote =
	'A boy who had a name, then a year of wood, then seven years of salt, then a hat with a reed in it.';
entry.cast = ['micheon', 'jaemo', 'eummo', 'changjori', 'jobul', 'sou', 'bongsang', 'dolgo', 'zhangtong'];
entry.kinds = ['founding', 'coup'];

entry.blocks = [
	p('The frogs were the problem.', '문제는 개구리였다.'),
	p(
		'Not the king. The frogs. A boy stands in a pond to his knees and throws stones at the dark, because a man he has never met wants to sleep.',
		'임금이 아니었다. 개구리였다. 소년은 연못에 무릎까지 잠긴 채 어둠을 향해 돌을 던진다. 한 번도 본 적 없는 사내가 자고 싶어 해서.'
	),
	card(
		'He has not used his name since the night his father told him to stop.',
		'아버지가 그만두라 한 밤 이후로, 그는 제 이름을 쓰지 않는다.'
	),
	scene('The pond · a water-house village', '연못 · 수실촌', { weather: 'night' }),
	say('eummo', ['아직 운다.', '기와. 돌. 더 가져와.'], ['They’re still at it.', 'Tiles. Stones. Fetch more.']),
	say(
		'micheon',
		['주무시면, 원래 안 들릴 텐데요.'],
		['If you were asleep, you wouldn’t hear them.']
	),
	say('eummo', ['다시 해 봐.', '방금 거, 재미있더라.', '던지라면 던져. 잠은 내가 잔다.'], [
		'Say that again.',
		'That was funny.',
		'I said throw. I’m the one who sleeps.'
	]),
	p(
		'He does not say it again. He throws until his shoulder shakes. The tiles skip. The frogs go under and come up somewhere else, which is what frogs do, and what kings do, and he is not thinking about kings.',
		'그는 다시 말하지 않는다. 어깨가 떨릴 때까지 던진다. 기와가 물 위를 뛴다. 개구리는 들어갔다가 다른 데서 올라온다. 개구리가 원래 그렇고, 임금이 원래 그렇고, 그는 임금 생각을 하지 않는다.'
	),
	p(
		'In the morning the man who owns the pond sends him for wood. He does not ask a name. It is the only kindness in the house, and it is an accident.',
		'아침이 되면 연못의 주인은 나무를 해 오라 한다. 이름은 묻지 않는다. 그 집의 유일한 친절이고, 실수다.'
	),
	say('eummo', ['낮에도 쉬지 마.', '손 봐. 전각에서 온 손이야.', '너는 뭐냐.'], [
		'Don’t rest in the day either.',
		'Look at those hands. Hall hands.',
		'What are you.'
	]),
	say('micheon', ['아무도 아닙니다.', '그래서 값이 쌉니다.'], ['Nobody.', 'That’s why I’m cheap.']),
	say('eummo', ['값싼 놈이 말을 길게 하네.', '나무. 해 질 때까지.'], [
		'Cheap, and he talks.',
		'Wood. Until the light goes.'
	]),
	p(
		'He goes. You would think a boy who had a window this time last year would cry about it. He does not. He counts the loads, because counting is a thing you can finish.',
		'그는 간다. 작년 이맘때 창문이 있던 아이라면 울 줄 안다. 울지 않는다. 짐을 센다. 세는 일은 끝낼 수 있으니까.'
	),
	{
		kind: 'flashback',
		year: '293',
		title: 'The night he was told to lie',
		blocks: [
			scene('A doorway · the inner rooms', '문간 · 내전', { weather: 'night' }),
			p(
				'His name is Eulbul. That morning he still had it. A room. A window on a yard people bowed in. A father the rooms went quiet for, which is a kind of love, and a kind of problem.',
				'이름은 을불이다. 그날 아침까지는 그 이름이 있었다. 방. 사람들이 절하는 마당이 보이는 창. 들어서면 방이 조용해지는 아버지. 사랑의 일종이고, 문제의 일종이다.'
			),
			p(
				'The uncle wears the crown now. Last spring he killed the uncle everyone liked. In the autumn he comes for the brother they smile at.',
				'왕관은 이제 큰아버지가 쓰고 있다. 지난봄, 다들 좋아하던 숙부를 죽였다. 가을이 되자 웃음을 받던 아우를 찾는다.'
			),
			p(
				'The father stands in a doorway and will not come in. That is how Eulbul knows it is already over.',
				'아버지가 문간에 선 채 들어오지 않는다. 을불은 그걸로 이미 끝났음을 안다.'
			),
			say(
				'dolgo',
				['이름 꺼내지 마.', '한 번 물으면 모른다고 해.', '두 번 물으면, 더 잘 둘러대.', '강으로 가. 소금 있는 데로.'],
				[
					'Don’t use your name.',
					'If they ask once, you don’t know it.',
					'If they ask twice, lie better.',
					'Go to the river. Where the salt is.'
				]
			),
			say('micheon', ['아버지—', '같이—'], ['Father—', 'Come with—']),
			say('dolgo', ['가.', '을불아. 가.'], ['Go.', 'Eulbul. Go.']),
			p(
				'That is the last of him. The boy runs. He does not look back, because looking back is how you get a second name, and he is trying to have none.',
				'그게 아버지의 마지막이다. 소년은 달린다. 뒤돌아보지 않는다. 뒤돌아보면 이름이 하나 더 붙으니까. 그는 이름을 없애려는 중이다.'
			)
		]
	},
	p(
		'He stays a year. Wood in the day. Stones at night. He gets good at missing the frogs and still keeping them down, which is a skill no one will ever thank him for.',
		'그는 일 년을 있는다. 낮에는 나무. 밤에는 돌. 개구리는 맞히지 않으면서도 잠잠하게 하는 재주가 는다. 아무도 고마워하지 않을 재주다.'
	),
	scene('The gate · a year on', '사립 · 일 년 뒤', { weather: 'dusk' }),
	say('micheon', ['나무, 그만할 거요.', '더 던질 기와가 없소.'], [
		'I’m done with the wood.',
		'I’m out of tiles to throw.'
	]),
	say('eummo', ['개구리는 남을 거다.', '어디 가든 손 봐. 전각 손이야.', '가.'], [
		'The frogs will still be here.',
		'Wherever you go, look at those hands. Hall hands.',
		'Go.'
	]),
	p(
		'He goes down to the water. There is a boat. There is a man in it who talks before he asks.',
		'그는 물가로 내려간다. 배가 있다. 배 안에, 묻기 전에 먼저 떠드는 사내가 있다.'
	),
	say('micheon', ['배 있소?'], ['Do you have a boat.']),
	say('jaemo', ['배는 있어.', '너는 뭐냐. 팔 봐. 가마니보다 가벼워 보이는데.'], [
		'I’ve got a boat.',
		'What are you. Look at those arms. Lighter than a sack.'
	]),
	say('micheon', ['개구리보단 무거워.'], ['Heavier than a frog.']),
	say(
		'jaemo',
		['말투는 가볍네.', '타. 이름은 나중에.', '소금은 정직해. 사람은 아니야.'],
		['The mouth isn’t.', 'Get in. Name later.', 'Salt is honest. People aren’t.']
	),
	p(
		'He gets in. He does not give a name. Jaemo does not wait for one. That is the beginning of seven years, and neither of them knows it, which is the only way seven years ever start.',
		'그는 탄다. 이름은 대지 않는다. 재모는 기다리지 않는다. 일곱 해의 시작이다. 둘 다 모른다. 일곱 해는 원래 그렇게 시작된다.'
	),
	section('The Salt', '소금'),
	scene('The salt boat · the Amnok', '소금배 · 압록', { weather: 'day', year: 294 }),
	p(
		'They sell down the river. Jaemo talks. Eulbul ties the sacks the way he was shown, and counts them twice, and lets the villages think he is nobody’s son. For a while it works. Salt is a good place to hide. Everybody wants some, and nobody wants to know you.',
		'그들은 강을 따라 판다. 재모가 떠든다. 을불은 배운 대로 가마니를 묶고, 두 번 세고, 마을이 그를 누구의 아들도 아니라고 믿게 둔다. 한동안은 된다. 소금은 숨기 좋은 자리다. 누구나 찾고, 아무도 너를 알고 싶어 하지 않는다.'
	),
	say(
		'jaemo',
		['되, 이렇게. 가득. 가득이 아니면 다음 집이 알아.', '너는 왜 두 번 세냐.', '한 번이면 돼. 나는 정직하거든.'],
		[
			'The measure, like this. Full. If it isn’t, the next house knows.',
			'Why do you count twice.',
			'Once is enough. I’m honest, see.'
		]
	),
	say('micheon', ['한 번 틀린 적 있어.', '두 번째가 맞더라.'], [
		'I got it wrong once.',
		'The second time was right.'
	]),
	say('jaemo', ['전각에서 왔구나.', '전각 놈들은 다 두 번 세더라.', '이름. 오늘은 되나.'], [
		'You came from a hall.',
		'Hall men always count twice.',
		'A name. Is today the day.'
	]),
	say('micheon', ['내일.'], ['Tomorrow.']),
	p(
		'Tomorrow does not come. Jaemo stops asking. That is how you keep a person. Eulbul learns the price of a bowl, a sack, a night under someone else’s roof. Kings do not get that education. The river keeps the ledger.',
		'내일은 오지 않는다. 재모는 묻기를 그만둔다. 사람을 붙드는 방식이다. 을불은 한 되, 한 말, 남의 지붕 아래 하룻밤의 값을 배운다. 임금은 그 교육을 받지 못한다. 강이 장부를 쥔다.'
	),
	scene('A winter bank', '겨울 둑', { weather: 'night' }),
	p(
		'A man who used to bow to his father walks past on the bank and does not slow down. Eulbul watches the back of him go. He does not call out. Calling out is a name.',
		'아버지에게 절하던 사내가 둑 위로 지나가며 발걸음을 늦추지 않는다. 을불은 그 등을 본다. 부르지 않는다. 부르는 것은 이름이다.'
	),
	say('jaemo', ['아는 놈이야?', '아는 놈이면 소금 더 받아.'], [
		'You know him?',
		'If you know him, charge extra.'
	]),
	say('micheon', ['몰라.', '소금은 같애.'], ['No.', 'Salt is salt.']),
	say('jaemo', ['너는 이상해.', '그래서 내가 좋아.'], ['You’re strange.', 'That’s why I like you.']),
	section('The Shoe', '신'),
	scene('A house on the east bank', '강 동쪽 집', { weather: 'night' }),
	p(
		'They put in at a village on the east bank and sleep under a roof that smells of fish and old cloth. The woman who owns it looks at the sacks the way a cat looks at a hole.',
		'강 동쪽 마을에 대고, 생선과 낡은 베 냄새 나는 지붕 아래 잔다. 집 할멈은 구멍을 보는 고양이처럼 가마니를 본다.'
	),
	voice('The old woman', 'f', OLD, ['한 말만 더 줘.', '재워 줬잖아. 네가 가면 나는 뭘로 간을 맞추니.'], [
		'One more sack.',
		'I gave you a bed. When you go, what am I supposed to salt the pot with.'
	]),
	say('micheon', ['한 되를 드렸소.', '한 말은 옆집 몫이오.'], [
		'I gave you a bowl.',
		'A sack belongs to the next house.'
	]),
	p(
		'She smiles with her mouth only. He sleeps. In the morning his sack is heavier by one shoe.',
		'그녀는 입으로만 웃는다. 그는 잔다. 아침에 그의 가마니는 신 한 짝만큼 무거워져 있다.'
	),
	p(
		'He does not know. He shoulders it and walks. Behind him, a voice that has been waiting all night starts to run.',
		'그는 모른다. 메고 걷는다. 뒤에서, 밤샘 기다리던 목소리가 달리기 시작한다.'
	),
	voice('The old woman', 'f', OLD, ['도둑놈.', '내 신 내놔.', '재— 재 불러. 저 놈이 내 신을 숨겼어.'], [
		'Thief.',
		'Give me my shoe.',
		'The magistrate — call him. That one hid my shoe.'
	]),
	p(
		'They open the sack in the yard. There it is. One shoe, dry, nested in the salt like it has always lived there. Jaemo makes a sound that is not a word.',
		'마당에서 가마니를 푼다. 있다. 신 한 짝, 마른 채로, 원래 거기 살던 것처럼 소금 속에 앉아 있다. 재모가 단어가 아닌 소리를 낸다.'
	),
	voice('The magistrate', 'm', MAG, ['풀어.', '신값이다. 소금으로 쳐.', '맞고 가.'], [
		'Open it.',
		'That’s the price of a shoe. We’ll take it in salt.',
		'Then you take the sticks, and you go.'
	]),
	say('jaemo', ['그 신, 우리 배에 없었어.', '내가 묶었어. 내가 알아.', '이 놈은 도둑이 아니야.'], [
		'That shoe was never in our boat.',
		'I tied the sack. I know.',
		'This one isn’t a thief.'
	]),
	voice('The magistrate', 'm', MAG, ['네가 알았으면 네가 맞아.', '줄 서.'], [
		'If you knew, then you take them.',
		'Get in line.'
	]),
	say('micheon', ['내가 맞을게.', '소금은, 있는 만큼만.'], [
		'I’ll take them.',
		'The salt — only what’s left.'
	]),
	p(
		'They take the salt. They take the afternoon out of his back. He counts while it happens, because counting is a thing you can finish. Jaemo swears for the whole walk to the boat.',
		'그들은 소금을 가져간다. 그의 등에서 오후를 가져간다. 그는 맞는 동안에도 센다. 세는 일은 끝낼 수 있으니까. 재모는 배까지 가는 내내 욕을 한다.'
	),
	say('jaemo', ['왜 말을 안 해.', '네가 안 훔쳤어. 내가 봤어.', '전각 손이야, 그 할멈이 그걸 몰라?'], [
		'Why didn’t you say it.',
		'You didn’t steal it. I saw.',
		'Hall hands. She didn’t see that?'
	]),
	say(
		'micheon',
		['봐도 안 됐어.', '아버지는 두 번 물으면 더 잘 둘러대라 했어.', '세 번째는 안 가르치셨어.'],
		['Seeing it didn’t help.', 'My father said if they ask twice, lie better.', 'He never got to the third time.']
	),
	p(
		'After that the villages know his face. Not as a prince. As the boy who stole a shoe. He gets thin. The sun takes the rest.',
		'그 뒤로 마을은 그의 얼굴을 안다. 왕손으로가 아니다. 신을 훔친 애로. 그는 야윈다. 해가 나머지를 가져간다.'
	),
	scene('The sacks · a later year', '가마니 · 그 뒤의 해', { weather: 'dusk' }),
	p(
		'Two riders come down the bank with a description. A thin young man. Talks like a hall. Might answer to a name nobody is supposed to say.',
		'기마 둘이 설명을 들고 둑으로 내려온다. 야윈 젊은이. 전각처럼 말한다. 꺼내서는 안 되는 이름에 돌아볼지도 모른다.'
	),
	voice('The rider', 'm', RID, ['소금장수.', '을불. 그 이름, 들어 봤나.', '왕손이다. 죽으면 상 있다.'], [
		'Salt man.',
		'Eulbul. That name. You heard it?',
		'A king’s grandson. There’s a price if he’s dead.'
	]),
	say('jaemo', ['나는 소금을 팔아.', '사람은 안 팔아.', '그 이름, 물고기 이름 같네.'], [
		'I sell salt.',
		'I don’t sell people.',
		'That name. Sounds like a fish.'
	]),
	p(
		'Eulbul is under the sacks. He does not breathe until the hooves go. When he comes up, Jaemo is looking at the river, not at him, which is another kindness that is not an accident.',
		'을불은 가마니 아래 있다. 발굽이 멀어질 때까지 숨을 안 쉰다. 올라오자 재모는 그가 아니라 강을 보고 있다. 이번 친절은 실수가 아니다.'
	),
	say('micheon', ['또 올 거야.'], ['They’ll come again.']),
	say('jaemo', ['그럼 딴 데 팔지.', '너는 내일도 내일이야?', '됐다. 묻지 마.', '이름, 내가 먼저 말하려고 했어. 됐어.'], [
		'Then we sell somewhere else.',
		'You still tomorrow?',
		'Forget it. Don’t ask.',
		'The name. I was going to say mine first. Forget it.'
	]),
	p(
		'You would think seven years of that would sand a person down to nothing. It sands the name off. The person stays, and learns the price of everything.',
		'일곱 해면 사람이 닳아 없어질 줄 안다. 닳아 없어지는 것은 이름이다. 사람은 남는다. 그리고 모든 것의 값을 배운다.'
	),
	scene('The palace · a hungry year', '궁 · 굶주린 해', {
		weather: 'night',
		jump: { en: 'Seven Years Later…', ko: '칠 년 뒤…', year: 300 }
	}),
	p(
		'The king is building a roof. The country is not eating. He has called every soul over fifteen to make the palace beautiful, because a beautiful king, he says, steadies the stomach.',
		'임금이 지붕을 올리고 있다. 나라는 먹지 못하고 있다. 그는 열다섯이 넘은 모든 사람을 불러 궁을 아름답게 하라 한다. 아름다운 임금을 보면, 배가 덜 고프다고 한다.'
	),
	say('bongsang', ['궁이 초라하면 백성이 불안해한다.', '지붕을 갈아라. 열다섯이 넘으면 다 나와.'], [
		'A shabby palace makes the people nervous.',
		'Replace the roof. Everyone over fifteen. Out.'
	]),
	say('changjori', ['전하. 올해 지붕은 못 먹습니다.', '곳간이 바닥입니다. 사람은 있고, 밥이 없습니다.'], [
		'Majesty. A roof cannot be eaten this year.',
		'The granary is down to the floor. We have the people. We don’t have the rice.'
	]),
	say(
		'bongsang',
		['밥은 네가 해라.', '나는 우러러볼 것을 만든다.', '아름다운 임금을 본 백성은 덜 배고프다.', '간하다 죽고 싶으냐.'],
		[
			'The rice is your job.',
			'I make the thing they look up at.',
			'A people who can see their king are less hungry.',
			'Would you like to die of advising me.'
		]
	),
	p(
		'Changjori bows. In the corridor he stops two men, one from the north, one from the east, and does not raise his voice.',
		'창조리는 절한다. 복도에서 북쪽 사람 하나, 동쪽 사람 하나를 세우고, 목소리를 높이지 않는다.'
	),
	say(
		'changjori',
		[
			'산과 들을 보시오.',
			'비류 쪽이다. 소금을 파는 애다.',
			'왕손이다. 죽지 않았으면.',
			'찾으면, 짧게 말하지 마시오. 나는 짧게 하라는 말을 못 참겠소.'
		],
		[
			'Search the hills and the fields.',
			'On the Biryu. A boy selling salt.',
			'A king’s grandson. If he isn’t dead.',
			'When you find him, don’t make it short. I can’t bear a short version.'
		]
	),
	scene('The Biryu · the same week', '비류 · 같은 주', { weather: 'dusk' }),
	p(
		'Two men stand on the bank with court shoes in the mud. The man in the boat is older than the boy they were sent to find, and burned down to the wrists. He does not look up.',
		'두 사내가 진흙에 궁 신을 담근 채 둑에 선다. 배 안의 사내는, 찾으러 온 소년보다 늙었고, 손목까지 타 있다. 그는 고개를 들지 않는다.'
	),
	say('sou', ['을불 도련님.'], ['Master Eulbul.']),
	say('micheon', ['소금값이면 말하시오.'], ['If it’s about the price of salt, say so.']),
	say(
		'sou',
		['돌고의 아드님이십니다.', '궁에서 뵈었습니다. 그때는… 개구리보다 작으셨습니다.', '걸음은 그대로입니다.'],
		[
			'Prince Dolgo’s son.',
			'I saw you in the palace. You were… smaller than a frog.',
			'The walk is the same.'
		]
	),
	say('micheon', ['돌고는 죽었소.', '그 아들도 죽었소.', '나는 야인이오. 다시 보시오.'], [
		'Dolgo is dead.',
		'So is his son.',
		'I’m a man of the fields. Look again.'
	]),
	say('jobul', ['다시 봤습니다.', '그래서 왔습니다.'], ['We looked again.', 'That’s why we came.']),
	say(
		'jobul',
		[
			'지금 임금이 임금답지 못합니다.',
			'국상께서 전하라 했습니다. 왕손이면 오라. 사람답고, 사람을 아끼면 오라.',
			'짧게 하라 했는데, 안 잘랐습니다.'
		],
		[
			'The king is not being a king.',
			'The prime minister told us to say this. If you are the grandson, come. If you are a person, and you spare people, come.',
			'He asked us to make it shorter. We wouldn’t cut it.'
		]
	),
	p(
		'The river hits the boat. Eulbul watches the sack at his feet, the way you watch a thing that has already betrayed you once.',
		'강물이 배를 친다. 을불은 발치의 가마니를 본다. 한 번 배신한 물건을 보듯이.'
	),
	say('micheon', ['…신발값은 받으셨소?'], ['…Did they get the price of the shoe.']),
	say('sou', ['예?'], ['Sorry?']),
	say('micheon', ['됐소.', '배는 두고 가겠소.', '재모한테는… 내일 오라 하거라. 내일은 진짜로.'], [
		'Never mind.',
		'I’ll leave the boat.',
		'Tell Jaemo… come tomorrow. Tomorrow for real.'
	]),
	p(
		'He hides in the prime minister’s house, south of the ridge, which is the first roof in seven years that is not a joke. Changjori pours wine and then does not drink it. His hands are not steady enough to be royal about.',
		'그는 능선 남쪽, 국상의 집에 숨는다. 일곱 해 만에 농담이 아닌 지붕이다. 창조리가 술을 따르고, 마시지는 않는다. 손이 점잖을 만큼 가만히 있지 않다.'
	),
	say('changjori', ['무서우면 말하시오.', '나도 무서우니까. 순서만 정합시다.'], [
		'If you’re afraid, say so.',
		'I am too. Let’s just decide the order.'
	]),
	say('micheon', ['저는 지붕을 지을 줄 모릅니다.'], ['I don’t know how to build a roof.']),
	say('changjori', ['그래서 모신 거요.', '지붕은 이미 너무 많습니다.', '반역자를 만들러 온 게 아니오. 왕을 찾으러 온 거요.'], [
		'That’s why I sent for you.',
		'We already have too much roof.',
		'I didn’t come to make a traitor. I came to find a king.'
	]),
	section('The Hunt', '사냥'),
	scene('The hunt · that autumn', '사냥 · 그해 가을', { weather: 'day' }),
	p(
		'The king takes his ministers into the hills to kill something smaller than a famine. Changjori waits until the beaters are far enough that a shout would sound like sport. Then he puts a reed in his hat.',
		'임금은 대신들을 언덕으로 데려가, 기근보다는 작은 것을 죽이러 간다. 창조리는 몰이꾼들이 멀어져, 고함이 사냥 소리처럼 들릴 때까지 기다린다. 그리고 모자 위에 갈대를 꽂는다.'
	),
	say('changjori', ['나만큼 지친 사람은.', '이렇게 하게.'], [
		'Anyone as tired as I am.',
		'Do this.'
	]),
	p(
		'One hat. Then the next. Then the clearing is full of foolish green, and it is not funny anymore, and everyone understands it at the same time.',
		'모자 하나. 그다음. 그리고 빈터는 우스운 초록으로 가득하고, 더 이상 우습지 않고, 모두가 동시에 알아차린다.'
	),
	say('bongsang', ['창조리.', '네 모자가 우습구나.'], ['Changjori.', 'Your hat is ridiculous.']),
	say('changjori', ['다들 같은 농담을 했습니다, 전하.'], ['They all made the same joke, Majesty.']),
	say(
		'bongsang',
		['내 아우에게 아들이 있었지.', '소금이나 팔라고 해 둬라.', '왕 노릇은 지붕을 볼 줄 아는 사람이 한다.'],
		[
			'My brother had a son.',
			'Tell him to keep selling salt.',
			'Kingship is for a man who knows how to look at a roof.'
		]
	),
	say('changjori', ['그래서 모셨습니다.'], ['That’s why we sent for him.']),
	p(
		'The king looks at the reeds, and then at the sky, as if the sky had also agreed without telling him. He does not ride back. His sons stay with him. By morning the lodge is a quiet room, and Changjori does not let anyone write down what the room looked like.',
		'임금은 갈대를 보고, 하늘을 본다. 하늘도 자기 몰래 동의한 것처럼. 그는 말을 돌려 내려가지 않는다. 아들들도 그와 함께 있는다. 아침이 되면 산막은 조용한 방이고, 창조리는 그 방이 어땠는지 아무도 적지 못하게 한다.'
	),
	p(
		'They put the crown on the salt seller before the hats are thrown away. They call him Micheon. He still turns if you say the other name softly. Jaemo always says it softly, and Jaemo is not in the hall. Halls, he has explained, are where shoes get stolen.',
		'그들은 모자를 버리기도 전에 소금장수에게 왕관을 씌운다. 미천이라 부른다. 다른 이름을 낮추어 부르면 그는 아직 돌아본다. 재모는 언제나 낮추어 부르고, 재모는 전각에 없다. 전각은, 그의 설명으로는, 신이 훔쳐지는 곳이다.'
	),
	scene('The western gate · thirteen years later', '서쪽 성문 · 십삼 년 뒤', {
		weather: 'dusk',
		jump: { en: 'Thirteen Years Later…', ko: '십삼 년 뒤…', year: 313 }
	}),
	{
		kind: 'map',
		year: 313,
		from: 300,
		places: ['gungnae', 'amnok', 'pyongyang'],
		riverNames: true,
		caption: 'The river he sold salt on, and the city that taxed the hand that sold it.',
		ko: '그가 소금을 팔던 강, 그리고 그 손을 세금 매기던 성.'
	},
	p(
		'There is a city on that river that has been Chinese longer than anyone in his house has worn a crown. Seals. Granaries. A market that buys Goguryeo salt and taxes the wrist that weighed it. The letters home ride through a harbor. Micheon takes the harbor, and the letters stop.',
		'그 강가에, 이 집안이 왕관을 쓰기 전부터 중국이었던 성이 있다. 인장. 곳간. 고구려 소금을 사면서, 저울 든 손목에 세금을 매기는 시장. 본국으로 가는 편지는 포구를 지난다. 미천이 포구를 취하자, 편지가 끊긴다.'
	),
	p(
		'The city waits a winter. Then another. The man who holds it for a court that no longer writes comes out to the gate, because nobody is coming from the other direction.',
		'성은 겨울을 기다린다. 한 번 더. 더 이상 편지를 쓰지 않는 조정을 대신해 성을 쥐고 있던 사내가 성문 밖으로 나온다. 다른 쪽에서는 아무도 오지 않으니까.'
	),
	say(
		'zhangtong',
		['이 인장은 진나라 황제의 것입니다.', '황제는 답을 하지 않습니다. 삼 년째입니다.'],
		['This seal belongs to the emperor of Jin.', 'The emperor does not answer. It has been three years.']
	),
	say(
		'micheon',
		['저도 답을 못 받아 봤소.', '더 짧았소.', '더 아팠소.'],
		['I’ve gone without an answer.', 'Mine was shorter.', 'It hurt more.'],
		{ king: true }
	),
	say(
		'zhangtong',
		[
			'성 안의 사람들은 제 백성입니다.',
			'걷게 해 주십시오. 서쪽 기마족이 받겠습니다.',
			'남는 사람은 가게를 지키게 해 주십시오. 저는 이 사람들을 불태우지 않겠습니다. 왕께서도 그러지 마십시오.'
		],
		[
			'The people in this city are mine.',
			'Let them walk. The horsemen in the west will take them.',
			'Let the ones who stay keep their shops. I will not burn them. Don’t you burn them either.'
		]
	),
	p(
		'Micheon looks at the gate, not at the seal. He has stood at gates where a man with a brush decided what his back was worth. He is not in a hurry to be that man.',
		'미천은 인장이 아니라 성문을 본다. 그는 붓을 든 사내가 그의 등의 값을 정하던 문 앞에 서 본 적이 있다. 그 사내가 될 생각은 급하지 않다.'
	),
	say(
		'micheon',
		['걷는 사람은 걷게 하시오.', '남는 사람은 내 사람이오.', '세금은 내일이오. 소금값은 오늘이고.'],
		['Whoever wants to walk, walks.', 'Whoever stays is mine.', 'Tax is tomorrow. The price of salt is today.'],
		{ king: true }
	),
	p(
		'They walk. Not all of them. The ones who want the western road go with their governor. The ones who stay open the shops, because a shop that opens is a vote.',
		'그들은 걷는다. 전부가 아니다. 서쪽 길을 원하는 사람들은 총관과 함께 간다. 남는 사람들은 가게를 연다. 문을 여는 가게는 표다.'
	),
	p(
		'In the market a man is shorting a measure, on purpose, with the concentration of a priest. He does not bow. He does not know which of the muddy officers used to tie his sacks.',
		'시장에서 한 사내가 일부러 되를 덜 담고 있다. 사제처럼 집중해서. 그는 절하지 않는다. 진흙투성이 장교 중 누가 예전에 제 가마니를 묶었는지 모른다.'
	),
	say(
		'jaemo',
		['도련님.', '아니. 이제 뭐라고 부르냐.', '신 도둑은 아니지. 그거 하나는 알지.'],
		['Young master.', 'No. What do I call you now.', 'Not a shoe thief. I know that much.']
	),
	say('micheon', ['그 말 하지 마.', '그 되. 아직도 덜 담지.'], ['Don’t.', 'That measure. You still short it.'], {
		king: true
	}),
	say(
		'jaemo',
		['덜 담아야 정확하지.', '왕한테는 특히.', '왕들은 가득 찬 되를 못 견뎌. 경험이 그래.'],
		['Short is how it stays honest.', 'Especially for a king.', 'Kings can’t bear a full measure. Experience.']
	),
	say('micheon', ['꽉 채워.', '값은 내가 낸다.'], ['Fill it.', 'I’ll pay.'], { king: true }),
	p(
		'He pays. Full measure. The sister city folds the next summer, and the last Chinese seal on the peninsula goes into a box nobody opens. He will die a king. The boy in the pond does not die at all. That one is still counting sacks, and he is better at it than the men who were born under a roof.',
		'그는 값을 치른다. 가득 채워서. 이듬해 여름, 형제뻘 되는 성이 접히고, 반도의 마지막 중국 인장은 아무도 열지 않는 상자에 들어간다. 그는 왕으로 죽을 것이다. 연못의 소년은 죽지 않는다. 그 아이는 아직 가마니를 세고 있고, 지붕 아래에서 태어난 자들보다 그걸 잘한다.'
	),
	p(
		'<b>West of the river, a fortress still thinks it will last the winter…!</b>',
		'<b>강 서쪽의 한 성은, 아직 겨울을 넘길 줄 안다…!</b>'
	)
];

writeFileSync(PATH, JSON.stringify(data, null, '\t') + '\n');
console.log('ok King Micheon', entry.blocks.length, 'blocks');
