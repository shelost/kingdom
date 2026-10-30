// The Wanggum's Guest (673): Munmu's night in the steam cavern — Sunduk, Yushin, the two lines of hands,
// the four founders, the man in white — and Suro's rites at the mound.
//   node scripts/.cache/rewrite/wanggum-guest.mjs
import { editStory } from '../story-ops.mjs';

const TITLE = "The Wanggum's Guest";

const CHIP = {
	munmu: '#C41E3A',
	sunduk: '#E8552B',
	yushin: '#4a8fe0',
	narim: '#5fad6e',
	golhwa: '#e0783a',
	hyulle: '#6ec4c9',
	chunchu: '#D8258C',
	suro: '#e0a33c',
	heohwangok: '#d98fa8',
	hyukgose: '#6f9fe8',
	alyoung: '#a8c8f0',
	dangun: '#b8956a',
	munhee: '#e07fa8',
	daeto: '#8a8f9e'
};

const scene = (label, ko, extra = {}) => ({ kind: 'scene', label, ko, ...extra });
const p = (html, ko, extra = {}) => ({ kind: 'p', html, ko, ...extra });
const say = (person, en, lines, extra = {}) => ({ kind: 'dialogue', person, chip: CHIP[person], en, lines, ...extra });
const extra = (speaker, chip, en, lines) => ({ kind: 'dialogue', speaker, chip, en, lines });

const MINISTER = ['True Bone minister', '#8d8d95'];

function blocks(old) {
	const keep = (fragment) => {
		const b = old.find((x) => JSON.stringify(x).includes(fragment));
		if (!b) throw new Error(`missing block: ${fragment}`);
		return structuredClone(b);
	};
	return [
		// ── The Second Letter ──
		keep('The Second Letter'),
		keep('a letter falls out of a sleeve'),
		keep('It copied his letter to Xue Rengui'),
		keep('A softer word here and there'),
		keep('Copy this one.'),
		keep('It is his own death warrant.'),
		p(
			'By evening, three councillors have asked him, very politely, for one more apology to the West. A real one this time, with no fortress hidden behind it. The emperor, they remind him, still keeps the king’s younger brother in Chang’an. A house keeps a spare key the same way.',
			'저녁이 되자 대신 셋이 아주 공손하게, 서국에 사죄문을 한 번 더 올리자고 청한다. 이번엔 진짜로. 뒤에 성 하나 숨기지 않은 사죄문으로. 황제가 아직 왕의 아우를 장안에 두고 있다는 것도 일깨운다. 집에서 여벌 열쇠를 그렇게 둔다.'
		),
		extra(...MINISTER, ['Majesty. The marshal is buried.', 'If the West comes back in the spring, who holds the river?'], ['전하. 대장군은 묻혔습니다.', '봄에 서국이 다시 오면, 강은 누가 지킵니까?']),
		say('munmu', ['I heard the question.', 'Give me one night.'], ['물음은 들었소.', '하룻밤만 주시오.']),

		// ── The Steam Cavern ──
		keep('The Steam Cavern'),
		{ ...keep('That evening Munmu rides alone'), music: 'Counsel' },
		keep('He strips at the rock lip'),
		keep('Crimson leaves his shoulders'),
		keep('He is forty-seven, and a king'),
		keep('They smell him before they see him.'),
		keep('<b>best of both</b>'),
		keep('You’re still here.'),
		keep('You brought him. On your shoulders.'),
		keep('Narim cannot finish the sentence.'),
		keep('Hello. I’ll be quiet.'),
		keep('We are the mouths the hill uses.'),
		say(
			'munmu',
			['I came because he died.', '…And because they want me to write the West a real apology. Do I?'],
			['그가 죽어서 왔소.', '…그리고 서국에 진짜 사죄문을 쓰라 하오. 써야 하오?']
		),
		keep('Something goes out of the cave.'),
		keep('The west will take your name and call it peace.'),
		say('munmu', ['…That isn’t a yes or a no.'], ['…그건 예도 아니고 아니오도 아니오.']),
		p(
			'The eyes go out. All three go quiet at once, the way birds do before weather. Golhwa is looking past his shoulder at the ledge. Somebody is sitting there who was not sitting there a moment ago.',
			'눈빛이 꺼진다. 셋이 한꺼번에 조용해진다. 날씨가 바뀌기 전의 새들처럼. 골화가 그의 어깨 너머 바위 턱을 보고 있다. 방금 전까지 없던 누군가가 거기 앉아 있다.'
		),

		// ── The Queen on the Ledge ──
		scene('The Queen on the Ledge', '바위 턱의 여왕'),
		p(
			'She is sitting with her feet in the water, the way no queen is supposed to, looking up. There is no sky in here. She is looking anyway. Twenty-six years dead, and she still checks the weather first.',
			'그녀는 물에 발을 담그고 앉아 있다. 여왕이라면 하지 않을 자세로. 위를 올려다보며. 여기엔 하늘이 없다. 그래도 본다. 죽은 지 스물여섯 해, 그래도 날씨부터 본다.',
			{ music: 'Long Live the Queen' }
		),
		say('sunduk', ['No stars. I checked.', '…Bupmin-ah. You got tall.'], ['별이 없네. 봤다.', '…법민아. 많이 컸네.']),
		say('munmu', ['Your Majesty—', 'I was twenty-one. I was already tall.'], ['폐하—', '스물하나였습니다. 그때도 컸습니다.']),
		say(
			'sunduk',
			['You were twenty-one and you stood like a boy waiting to be told off.', 'Now you stand like a king waiting to be told off. That’s progress.'],
			['스물하나에 꾸중 기다리는 아이처럼 서 있었제.', '인자는 꾸중 기다리는 임금처럼 서 있네. 많이 늘었다.']
		),
		p(
			'He laughs. It comes out wrong, half a sob, and he puts it under the water before anyone can see. She sees. She lets him think she didn’t.',
			'그가 웃는다. 웃음이 잘못 나온다. 반은 울음이다. 누가 보기 전에 물속에 묻는다. 그녀는 본다. 못 본 척해 준다.'
		),
		say('sunduk', ['Your mother. Still writing packing lists?'], ['너그 어매는. 아직도 짐 목록 쓰나?']),
		say(
			'munmu',
			['She packed my saddlebags for the funeral. Twice. She put a winter coat in. It’s autumn.'],
			['장례 가는 안장 주머니를 두 번 싸셨습니다. 겨울 두루마기를 넣으셨어요. 가을인데.']
		),
		say('sunduk', ['She’s expecting a long winter. Is she right?'], ['겨울이 길 줄 아는 기라. 맞나?']),
		say('munmu', ['…She usually is.'], ['…대개는 맞으십니다.']),
		say('sunduk', ['And my tower. Does anyone still climb it?'], ['그라고 내 탑은. 아직 누가 올라가나?']),
		say('munmu', ['The astronomers. Every night.'], ['일관들이요. 밤마다.']),
		say('sunduk', ['Looking at the sky, or at the court?'], ['하늘을 보나, 조정을 보나?']),
		say('munmu', ['…Mostly the court.'], ['…대개 조정을요.']),
		say('sunduk', ['Ha. Good. Then I built it right.'], ['하. 됐다. 그라믄 제대로 지은 기다.']),
		say(
			'munmu',
			[
				'Majesty. They want me to apologise to the West. Properly. On my knees, in a letter, and mean it.',
				'My father would have written it and not meant a word. My uncle would have gone and stood on the river.',
				'I’m not either of them.'
			],
			['폐하. 서국에 사죄하라 합니다. 제대로. 글로 무릎 꿇고, 진심으로.', '아버지라면 써 놓고 한 글자도 진심이 아니셨을 겁니다. 외숙이라면 강에 나가 서 계셨을 거고요.', '저는 둘 다 아닙니다.']
		),
		say('sunduk', ['No. You’re worse. You mean things.', 'Who’s asking you to write it?'], ['그래. 니는 더 고약하다. 니는 말을 진심으로 하제.', '누가 쓰라 카드노?']),
		say('munmu', ['The council. The True Bone houses.'], ['화백입니다. 진골 집안들이요.']),
		say('sunduk', ['How many of them have ever been hungry?'], ['그 사람들 중에 배곯아 본 사람이 몇이고?']),
		p(
			'He does not answer. She was always very good at the question that ends the argument.',
			'그는 답하지 않는다. 그녀는 언제나 다툼을 끝내는 질문에 능했다.'
		),
		say(
			'sunduk',
			[
				'Your father told me what you said on the beach when you were six. About the people with no bones.',
				'“Those most. There’s more of them.” I wrote it down. I was going to use it on the council.'
			],
			['너그 아부지가 말해 주더라. 여섯 살에 바닷가에서 니가 한 말. 뼈 없는 사람들.', '‘그 사람들 제일 먼저. 그 사람들이 더 많으니까.’ 내가 적어 놨다. 화백에 써먹으려고.']
		),
		say('munmu', ['…Did you?'], ['…써먹으셨습니까?']),
		say('sunduk', ['I died first. Very rude of me.'], ['내가 먼저 죽었다. 참 무례하제.']),
		say(
			'sunduk',
			[
				'You have Baekje villages now. Goguryeo men walking south with nothing on their backs. What are they to you, Bupmin? Spoils, or people?',
				'Count them. Give their lords your ranks. Put their sons under your banners. A wall is cheaper when the men behind it are yours.'
			],
			[
				'인자 백제 마을이 니 끼다. 빈손으로 남쪽에 내려오는 고구려 사내들도. 그 사람들이 니한테 뭐고, 법민아. 전리품이가, 사람이가?',
				'세어라. 그 사람들 귀족한테 우리 관등을 줘라. 아들들은 니 깃발 아래 세우고. 성벽 뒤 사람이 내 사람이면, 성은 싸게 먹힌다.'
			]
		),
		p(
			'It is the plainest advice anyone has given him in years. He has heard it before. He said it himself, on a beach, at six.',
			'몇 해 만에 들은 가장 솔직한 충고다. 전에도 들은 말이다. 여섯 살에, 바닷가에서, 그가 직접 했다.'
		),

		// ── The Marshal ──
		scene('The Marshal', '대장군'),
		p(
			'The water moves on the far side of the pool, the way it moves when a man who knows the bottom wades in without looking.',
			'못 저편에서 물이 움직인다. 바닥을 아는 사내가 내려다보지도 않고 걸어 들어올 때처럼.'
		),
		p(
			'He is in the blue robe they buried him in two months ago. The hair is white. The back is straight again. He stops at the edge of the steam like a guest who has arrived early and is not sure he was invited.',
			'두 달 전 그를 묻을 때 입힌 푸른 옷이다. 머리는 하얗다. 허리는 다시 곧다. 그는 김의 가장자리에서 멈춘다. 너무 일찍 와서, 초대받았는지 자신 없는 손님처럼.'
		),
		p(
			'Hyullé makes a sound nobody in this cave has heard her make in fifty years.',
			'혈레가 오십 년 동안 이 동굴에서 아무도 들어 본 적 없는 소리를 낸다.'
		),
		say('hyulle', ['…You came back.'], ['…돌아오셨네요.']),
		say('yushin', ['…Hyullé.'], ['…혈레.']),
		p(
			'Just her name. In fifty years he never wasted a word in here, and he doesn’t now. She sits down in the water as if her knees went. Golhwa turns to the rock wall. Narim tells nobody in particular that the steam is very thick tonight. It isn’t.',
			'이름뿐이다. 오십 년 동안 그는 여기서 말 한마디 허투루 쓴 적이 없고, 지금도 그렇다. 혈레가 무릎이 풀린 듯 물속에 주저앉는다. 골화는 바위벽 쪽으로 돌아선다. 나림은 누구에게랄 것도 없이 오늘 밤 김이 아주 짙다고 말한다. 짙지 않다.'
		),
		say('yushin', ['Your Maj—'], ['폐—']),
		say('sunduk', ['We’re dead, Yushin. You can stop.'], ['우리 죽었다, 유신아. 인자 그만해도 된다.']),
		say('yushin', ['…Princess.'], ['…공주.']),
		say('sunduk', ['Close enough.'], ['그만하면 됐다.']),
		p(
			'Forty years he loved her and never once said so where it could be heard. He still doesn’t. He only stands a little closer than a subject should, and she lets him.',
			'마흔 해를 사랑하고도 남이 들을 수 있는 데서는 한 번도 말하지 않았다. 지금도 하지 않는다. 신하가 서야 할 자리보다 조금 가까이 설 뿐이고, 그녀는 그걸 내버려 둔다.'
		),
		say('munmu', ['…Oh.'], ['…아.']),
		say('sunduk', ['Your nephew just worked something out.'], ['니 조카가 방금 뭘 알아챘네.']),
		say('yushin', ['He was always slow on the left side.'], ['야는 원래 왼쪽이 느렸습니더.']),
		p('Munmu laughs, and this time it comes out right.', '문무가 웃는다. 이번엔 제대로 나온다.'),
		say(
			'munmu',
			['Uncle. At the house, I didn’t—', 'I had a whole speech. I said your name, and then the physicians—'],
			['외숙. 그 집에서, 제가 미처—', '드릴 말씀이 한가득이었는데. 이름만 부르고 나니 의원들이—']
		),
		say(
			'yushin',
			['You said my name. That was the whole speech.', '…And I don’t have to call you Majesty in here. I asked.'],
			['이름 불렀다 아이가. 그기 다였다.', '…여서는 전하 소리 안 해도 된다 카더라. 물어봤다.']
		),
		say('yushin', ['The boy.'], ['그 아이는.']),
		say('munmu', ['His mother wouldn’t open the gate. He went back up the hill.'], ['어머니가 대문을 안 열어 주셨습니다. 산으로 도로 올라갔어요.']),
		p(
			'Yushin is quiet for a long time. Then he asks the only question he has ever asked about his son.',
			'유신은 오래 말이 없다. 그러다 아들에 대해 그가 늘 묻던 단 하나의 질문을 한다.'
		),
		say('yushin', ['…Is he eating?'], ['…밥은 묵나?']),
		say('munmu', ['He will be. I’ll see to it.'], ['묵을 겁니다. 제가 챙기겠습니다.']),
		say('yushin', ['Good.'], ['됐다.']),
		say('munmu', ['Uncle. Do I write the apology?'], ['외숙. 사죄문, 써야 합니까?']),
		say(
			'yushin',
			['Write it. Your father wrote six. Paper is cheap. Horses aren’t.', 'They feed every horse across a sea. You feed boys at home. Make them come to you—'],
			['써라. 너그 아부지는 여섯 장 썼다. 종이는 싸다. 말은 안 싸다.', '저들은 말 한 마리 한 마리를 바다 건너 먹인다. 니는 집에서 아이들 먹이고. 오게 해라—']
		),
		say('munmu', ['We did that at Stone Gate. We won the morning—'], ['석문에서 그랬습니다. 아침은 이겼—']),
		say(
			'yushin',
			['And then you chased.', 'Don’t chase. Hold the river. Make the grass expensive. When it runs out, they go home.'],
			['그라고 쫓았제.', '쫓지 마라. 강을 지켜라. 풀을 비싸게 만들어라. 풀 떨어지믄, 저들은 집에 간다.']
		),
		say(
			'yushin',
			['Your mother asked me something at the well. I told her to ask them.', '…You ask them. You’re better at asking than I was.'],
			['너그 어매가 우물가에서 뭘 물었다. 저들한테 물어보라 캤다.', '…니가 물어봐라. 니가 나보다 잘 묻는다.']
		),
		say('munmu', ['Ask who?'], ['누구한테요?']),

		// ── The Hands ──
		scene('The Hands', '손'),
		p('Then they do a thing the dead in this water do not do.', '그때 그들이, 이 물의 죽은 이들이 하지 않는 일을 한다.', { music: 'Founding' }),
		p(
			'You may remember a son in this pool reaching for his father and catching steam. The dead here can’t be held. It turns out they can choose to lean.',
			'기억할지 모르겠다. 이 못에서 한 아들이 아버지를 안으려다 김을 안았다. 여기 죽은 이들은 붙잡을 수 없다. 알고 보니, 기댈 수는 있다. 그들이 원하면.'
		),
		p(
			'Sunduk sets her hand on his left shoulder. Yushin sets his on the right. They are warm. He feels both weights arrive, a queen’s and a marshal’s, his father’s side and his mother’s, and he does not dare move.',
			'선덕이 그의 왼쪽 어깨에 손을 얹는다. 유신이 오른쪽에 얹는다. 따뜻하다. 두 무게가 내려앉는 게 느껴진다. 여왕의 것과 대장군의 것. 아버지 쪽과 어머니 쪽. 그는 감히 움직이지 못한다.'
		),
		p(
			'Behind the queen, someone lays a hand on her shoulder. A magenta sleeve. A fox’s mouth, for once with nothing in it.',
			'여왕 뒤에서 누군가 그녀의 어깨에 손을 얹는다. 자홍빛 소매. 여우 같은 입. 이번만은 아무 말도 담지 않았다.'
		),
		say('munmu', ['…Father?'], ['…아버지?']),
		p(
			'Chunchu talked his way through three empires. Now he puts one finger to his lips, smiles, and tips his head forward: <i>not at me. Ahead.</i> It is the only time in his life, or after it, that he has been brief.',
			'춘추는 세 제국을 말로 건너온 사람이다. 지금은 손가락 하나를 입술에 대고, 웃고, 고개를 앞으로 까딱한다. <i>나 말고. 앞을 봐라.</i> 살아서도 죽어서도, 그가 짧게 말한 건 이때뿐이다.'
		),
		p(
			'Behind Yushin, a hand: a younger man in the night robe he died in. Behind him, a big man with a cone helm under his arm. Behind him, a king in plain clothes, the clothes of the day he handed over his country with the keys still warm.',
			'유신 뒤에도 손 하나. 죽던 밤의 잠옷 차림인 젊은 사내. 그 뒤에 고깔 투구를 옆구리에 낀 큰 사내. 그 뒤에 수수한 옷차림의 임금. 열쇠가 식기도 전에 나라를 넘긴 날의 옷이다.'
		),
		p('And then it doesn’t stop.', '그리고 멈추지 않는다.'),
		p(
			'On the left the hands go back through gold. Crowns with shivering leaves, then older gold, then bronze, then topknots with no crowns at all. Kims, and before the Kims other houses, and before them the first one. Strictly, his line does not run back to that first king. The hands don’t care. The line runs through the country, not the bone.',
			'왼쪽으로 손들이 금을 지나 거슬러 간다. 떨리는 금잎 왕관, 더 오래된 금, 청동, 그리고 왕관 없이 상투만 튼 머리들. 김씨, 김씨 전엔 다른 집안들, 그 전엔 맨 처음 한 사람. 엄밀히 따지면 그의 핏줄은 그 첫 임금까지 닿지 않는다. 손들은 상관하지 않는다. 그 줄은 뼈가 아니라 나라를 따라 흐른다.'
		),
		p(
			'On the right, nine kings of a kingdom that no longer exists, each with a palm on the next one’s shoulder, iron on their belts and river water in their hems. Fifteen generations. He counts them, because he can’t help it. He has his mother’s habits.',
			'오른쪽엔 이제는 없는 나라의 임금 아홉. 저마다 손바닥을 다음 사람 어깨에 얹고, 허리엔 쇠를, 옷자락엔 강물을 달았다. 열다섯 대. 그는 센다. 어쩔 수가 없다. 어머니 버릇이다.'
		),
		p(
			'The two lines bend away into the steam like the two banks of one river. At the far end of each, where the steam goes white, a couple stands side by side.',
			'두 줄이 한 강의 두 기슭처럼 김 속으로 휘어져 멀어진다. 각 줄의 맨 끝, 김이 하얘지는 곳에, 남녀 한 쌍씩이 나란히 서 있다.'
		),
		say('munmu', ['…Them.'], ['…저분들께.']),
		p(
			'All that weight comes down the lines, shoulder to shoulder, and lands on his. It should be unbearable. It is lighter than the crown.',
			'그 무게가 전부 어깨에서 어깨로 줄을 타고 내려와 그의 어깨에 닿는다. 견딜 수 없어야 마땅하다. 왕관보다 가볍다.'
		),
		p(
			'Then the near ones let go, one by one, the way lamps go out down a long hall. His father nods once. The queen squeezes. The marshal doesn’t squeeze; he taps twice, like a man checking a saddle girth. And then there are only four people in the water with him, and every one of them founded something.',
			'그러다 가까운 이들부터 하나씩 손을 뗀다. 긴 전각을 따라 등불이 꺼지듯. 아버지가 한 번 고개를 끄덕인다. 여왕이 꼭 쥔다. 대장군은 쥐지 않는다. 뱃대끈을 확인하듯 두 번 톡톡 친다. 이제 물속엔 그와 함께 넷만 남는다. 넷 다 무언가를 세운 사람들이다.'
		),

		// ── The Founders ──
		scene('The Founders', '시조'),
		p(
			'On his left, a young man too beautiful to be entirely a man, with a farmer’s hands. Beside him, a woman whose lips, the story goes, were a hen’s beak the day she was born, until somebody washed her in a stream.',
			'왼쪽엔 사람이라기엔 너무 아름다운 젊은 사내. 손은 농부의 손이다. 곁엔 태어나던 날 입술이 닭 부리였다는 여인. 누가 냇물에 씻겨 주기 전까지는.'
		),
		p(
			'On his right, purple silk and a little gold crown. If you have been here before, you have met him; he hums. Beside him, a woman from the far side of the sea, who buried her silk trousers on the beach so the sea god would know she meant to stay.',
			'오른쪽엔 보랏빛 비단과 작은 금관. 여기 와 본 적이 있다면 이미 만났다. 흥얼거리는 그 사람이다. 곁엔 바다 건너편에서 온 여인. 바다의 신이 제가 머물 작정임을 알도록 비단 바지를 바닷가에 묻은 사람.'
		),
		say(
			'suro',
			['Well! There he is. Fifteen of us it took to get to you, cariad, and look at the size of you.'],
			['허! 여기 있네. 그대한테 오는 데 우리가 열다섯이나 걸렸소. 보소, 덩치 좀.']
		),
		say('munmu', ['You’re— King Suro.'], ['당신은— 수로왕이십니까.']),
		say('suro', ['Am I? Who told you that?'], ['내가? 누가 그카더노?']),
		say('munmu', ['Everyone. The six golden eggs on the hill.'], ['다들요. 구지봉의 금알 여섯 개.']),
		say('suro', ['Six eggs! And they believed it!', '…It was true, mind. Still. They believed it.'], ['알 여섯 개라! 그걸 다 믿었다 카네!', '…참말이긴 했소. 그래도. 믿었다 카이.']),
		say('hyukgose', ['Mine was one egg. Nobody makes a song about one egg.'], ['나는 알 하나였소. 알 하나로는 노래를 안 지어 주더군.']),
		say('alyoung', ['They made one about the horse.'], ['말 노래는 지어 줬잖소.']),
		say('hyukgose', ['The horse left.'], ['말은 가 버렸소.']),
		say('heohwangok', ['Stand up straight. You are in front of four kings.'], ['허리 펴세요. 왕 넷 앞입니다.']),
		say('alyoung', ['Two kings. Two queens.'], ['왕 둘. 왕비 둘.']),
		say('heohwangok', ['I said what I said.'], ['제가 한 말 그대로입니다.']),
		say('munmu', ['Majesties. I’ll be plain. I’m not good at the other kind.'], ['폐하들. 솔직히 여쭙겠습니다. 다른 식으로는 잘 못 합니다.']),
		say('suro', ['Plain! Lovely. We’ll soon fix that.'], ['솔직히라! 좋소. 그건 우리가 금방 고쳐 주께.']),
		say(
			'munmu',
			['The West wants me to be their king of Silla. Their governor. My council wants me to say yes. The emperor keeps my brother in his house in case I say no.'],
			['서국은 저더러 저들의 신라왕이 되라 합니다. 저들의 도독이요. 화백은 그러라 하고요. 황제는 제가 싫다 할까 봐 아우를 제 집에 두고 있습니다.']
		),
		say('heohwangok', ['What will they call you, if you say yes?'], ['예 하면, 당신을 뭐라고 부릅니까?']),
		say('munmu', ['Area Commander of Gyerim. King of Silla, by the emperor’s grace.'], ['계림주대도독. 황제의 은혜로 신라왕.']),
		say('heohwangok', ['And now? What do they call you now?'], ['지금은요? 지금은 뭐라고 부릅니까?']),
		say('munmu', ['…The same.'], ['…같습니다.']),
		say(
			'heohwangok',
			[
				'Then they took your name already, and you did not notice.',
				'I crossed a whole sea and kept mine. Two of my sons carry it still. Keep your name. Answer to theirs when it is useful.'
			],
			['그럼 이미 이름을 가져갔네요. 당신은 몰랐고요.', '저는 바다를 통째로 건너고도 제 이름을 지켰습니다. 아들 둘이 아직 그 이름을 씁니다. 이름은 지키세요. 저들 이름엔, 쓸모 있을 때만 대답하고요.']
		),
		say('munmu', ['So I write the letter and don’t mean it. That’s my father’s way—'], ['그럼 써 놓고 진심은 아니라는— 그건 아버지 방식인데요—']),
		say('heohwangok', ['Did I say that?'], ['제가 그렇게 말했습니까?']),
		say(
			'suro',
			['She didn’t! She never does. A hundred and fifty years married, I got six straight answers off her. Best years of my life.'],
			['안 했소! 절대 안 하요. 백오십 년을 같이 살았는데 바른 대답은 여섯 번 들었소. 내 생에 제일 좋은 시절이었소.']
		),
		say('heohwangok', ['Seven.'], ['일곱 번이에요.']),
		say('suro', ['Now. My turn. Who sings at my mound these days?'], ['자. 내 차례. 요새 내 무덤에서는 누가 노래하요?']),
		say('munmu', ['…I don’t know. Nobody, I think. Gaya’s gone.'], ['…모르겠습니다. 아무도 안 하는 것 같습니다. 가야는 없어졌으니까요.']),
		say('suro', ['Gone! Gone where, then?'], ['없어졌다! 어디로 갔는데?']),
		say('munmu', ['Into Silla.'], ['신라로요.']),
		say('suro', ['Into you, more like. And has Silla sung, at my mound?'], ['그대 속으로 갔제. 신라는 노래했소, 내 무덤에서?']),
		say('munmu', ['No.'], ['아니요.']),
		say(
			'suro',
			['Hm! Not complaining, mind. Dead is very relaxing. Only—', 'Whose dead are they, now? Mine? Nobody’s?'],
			['흠! 불평하는 기 아이요. 죽으면 참 편하요. 다만—', '그 무덤들, 인자 누구네 죽은 이요? 내 끼요? 아무 끼도 아이요?']
		),
		p(
			'It is the game he played with the boy’s uncle on this same rock, over a sword. <i>Whose iron?</i> Munmu doesn’t know that. He only knows the question has a floor under it, and he is standing on it.',
			'이 바위에서, 칼 하나를 두고, 이 사내의 외숙과 했던 놀이다. <i>누구네 쇠?</i> 문무는 그걸 모른다. 다만 그 질문 밑에 바닥이 있고, 자기가 그 위에 서 있다는 것만 안다.'
		),
		say(
			'alyoung',
			['And Baekje’s mounds? And the ones up north? Your men have made a great many new ones lately.', 'Whose ancestors are those?'],
			['백제 무덤들은? 북쪽 무덤들은? 요새 그대 군사들이 새 무덤을 많이도 만들었지.', '그건 누구 조상이오?']
		),
		p('A long silence. The steam drips.', '긴 침묵. 김이 떨어진다.'),
		say('munmu', ['…Mine.'], ['…제 조상입니다.']),
		say('hyukgose', ['Faster than I was. It took me sixty years and a wife.'], ['나보다 빠르오. 나는 예순 해하고 아내 하나가 걸렸소.']),
		say('hyukgose', ['You’re leaning.', 'Like a seedling. All of you, one way. West.'], ['기울었소.', '모종처럼. 온몸이 한쪽으로. 서쪽으로.']),
		say('munmu', ['…Is that bad?'], ['…나쁜 겁니까?']),
		say(
			'hyukgose',
			['A seedling that leans to the light isn’t wrong. It just falls over in the first wind.', 'Roots first. Then lean wherever you like.'],
			['빛 쪽으로 기우는 모종이 틀린 건 아니오. 첫 바람에 넘어질 뿐이지.', '뿌리 먼저. 그다음엔 어디로 기울든 마음대로 하시오.']
		),
		say('alyoung', ['He means stand up straight. He always means stand up straight.'], ['허리 펴라는 소리요. 이 양반은 늘 허리 펴라는 소리요.']),
		say(
			'munmu',
			[
				'“One person to cherish, one person to serve.” That’s yours. Everyone in Surabol knows it.',
				'I know who I cherish. Who do I serve? I’m the king. Who does a king serve?'
			],
			['‘아낄 사람 하나, 섬길 사람 하나.’ 시조의 말씀입니다. 서라벌 사람 다 압니다.', '아낄 사람은 압니다. 섬길 사람은 누굽니까? 제가 왕입니다. 왕은 누구를 섬깁니까?']
		),
		p(
			'Hyukgose looks at his wife. Suro looks at the ceiling. The queen from the sea looks at Munmu with interest, the way you look at a man about to step on a rake.',
			'혁거세가 아내를 본다. 수로는 천장을 본다. 바다에서 온 왕비는 흥미롭다는 듯 문무를 본다. 갈퀴를 밟기 직전인 사람을 보듯이.'
		),
		say('hyukgose', ['Hm.', 'That one’s above my head.', 'Sounds like a job for someone higher up.'], ['흠.', '그건 내 머리 위 일이오.', '더 윗분이 하실 일 같소.']),
		say('munmu', ['Higher up?', 'Who could possibly be higher up than Park Hyukgose himself?'], ['윗분이요?', '박혁거세보다 더 윗분이 어디 계십니까?']),
		p(
			'Hyukgose smiles. It is a farmer’s smile, the one for a city man who has just asked where rice comes from. He takes his wife’s hand, and the two of them are not there.',
			'혁거세가 웃는다. 농부의 웃음이다. 쌀이 어디서 나오느냐고 막 물은 도성 사람에게 짓는 웃음. 그가 아내의 손을 잡고, 둘은 거기 없다.'
		),
		say('suro', ['Ooh. Him.', 'Mind your manners, bach. And don’t ask him anything straight. He hates that.'], ['허. 그 양반.', '예의 차리소. 그라고 그 양반한테는 곧이곧대로 묻지 마소. 그거 질색하요.']),
		say('heohwangok', ['He will not answer you. Listen anyway.'], ['대답은 안 하실 겁니다. 그래도 들으세요.']),
		p(
			'Then they are gone too, and Munmu is alone in the water, and the steam is going thin.',
			'그러고는 그들도 사라진다. 문무는 물속에 혼자다. 김이 옅어지고 있다.'
		),

		// ── The Man on the Water ──
		keep('The Man on the Water'),
		p(
			'The steam goes thin enough to see through, and a man stands on the water as if the lake were a court floor. White robes. Sandalwood-coloured light. A smell of birch bark and, faintly, garlic. A face that has outlived every kingdom on the map. The three go still on the rock. This visitor is not theirs.',
			'김이 투명할 만큼 옅어지고, 한 사내가 물 위에 서 있다. 마치 호수가 조정 바닥인 것처럼. 흰 옷. 박달나무 빛. 자작나무 껍질 냄새, 그리고 아주 희미하게, 마늘 냄새. 지도 위 모든 나라보다 오래 살아남은 얼굴. 셋이 바위에서 멈춘다. 이 손님은 그들의 것이 아니다.',
			{ music: 'Old Joseon' }
		),
		say(
			'dangun',
			['Six years old and loud on the sand:', '“Everyone listens when I rule the land.”', 'Forty-one years, a crown, and a war.', 'Who’s doing the listening now? And what for?'],
			['여섯 살, 모래밭에서 큰소리치던 아이,', '‘내가 임금 되면 다 내 말 들어야 해이.’', '마흔한 해, 왕관 하나, 전쟁 하나.', '지금 듣는 쪽은 누구고, 무얼 위해서냐?']
		),
		keep('Which court sent you.'),
		say(
			'dangun',
			['No court sent me. I wear no crown.', 'I came down a mountain, and I’ll go back down— no. Up. One forgets.'],
			['보낸 조정 없고, 쓴 관도 없다.', '산에서 내려왔고, 도로 내려— 아니, 올라간다. 깜빡하네.']
		),
		say('munmu', ['Then, sir, tell me plainly. Do I write the apology?'], ['그럼 어르신, 솔직히 말씀해 주십시오. 사죄문을 씁니까?']),
		say('dangun', ['Plain is a road for a king to walk.', 'I am the weather. Weather doesn’t talk.'], ['곧은 말은 임금이 걷는 길이고,', '나는 날씨다. 날씨는 말을 안 해.']),
		say('munmu', ['You’re talking now.'], ['지금 하고 계시잖습니까.']),
		say('dangun', ['Then listen faster.'], ['그럼 빨리 들어라.']),
		say('munmu', ['Will I win?'], ['이깁니까?']),
		say(
			'dangun',
			['That’s not mine to give, and not yours to keep.', 'Ask the man with the ledger, the night that you sleep.'],
			['그건 내가 줄 것도, 네가 쥘 것도 아니다.', '장부 든 사내한테 물어라. 네가 잠드는 밤에.']
		),
		say(
			'munmu',
			[
				'Sir. With respect. Tonight I’ve had riddles from a king who hums and a queen who counts her answers, and a farmer told me I’m a seedling.',
				'Could you just say it plainly? Once?'
			],
			['어르신. 외람되지만, 오늘 밤 흥얼거리는 왕한테 수수께끼를 듣고, 대답을 세는 왕비한테 듣고, 농부한테는 모종이란 소리를 들었습니다.', '한 번만, 그냥 솔직히 말씀해 주실 수 없습니까?']
		),
		say('dangun', ['Plain is for kings. I retired.'], ['곧은 말은 임금 몫이다. 나는 물러났다.']),
		p(
			'He looks past Munmu at the black water, as if a city were standing in it.',
			'그는 문무 너머 검은 물을 본다. 거기 성 하나가 서 있기라도 한 듯이.'
		),
		say(
			'dangun',
			[
				'Walls don’t fall. Doors are opened. You’ve heard.',
				'A city I knew held a year on its stones. Then a man inside said a word.',
				'So build me a house where the poorest one',
				'would bar the door with his own two hands. Then you’re done.'
			],
			['성은 안 무너진다. 문이 열리지. 들었제.', '내가 알던 성은 돌로 한 해를 버텼다. 그러다 안에서 누가 말 한마디 했제.', '그러니 제일 가난한 놈이', '제 두 손으로 빗장 지르는 집을 지어라. 그럼 끝이제.']
		),
		p(
			'Munmu thinks of a steady hand copying out its own death warrant. He thinks of three polite councillors and their spare key.',
			'문무는 제 사형 명령을 정서하던 차분한 손을 떠올린다. 공손한 대신 셋과 그들의 여벌 열쇠를 떠올린다.'
		),
		say(
			'munmu',
			['The emperor calls himself the Son of Heaven. If I bow to him, I bow to heaven. That’s what my council says.'],
			['황제는 스스로 천자라 합니다. 그에게 절하면 하늘에 절하는 거라고. 화백이 그럽니다.']
		),
		say(
			'dangun',
			['Heaven had one son that I know of.', 'He married a bear. Ask your mother how it went.', 'She tells it with extra garlic.'],
			['하늘 아들은 내가 아는 게 하나뿐이다.', '곰한테 장가갔다. 어땠는지는 너그 어매한테 물어봐라.', '마늘을 좀 더 넣어서 얘기하더라.']
		),
		say('munmu', ['…How do you know how my mother tells it?'], ['…어머니가 어떻게 얘기하시는지 어떻게 아십니까?']),
		say('dangun', ['I was in the room. I’m in most rooms. They’re mostly boring.'], ['그 방에 있었다. 웬만한 방엔 다 있다. 대개 지루하다.']),
		say('munmu', ['The farmer said you’d know. Who does a king serve?'], ['농부 양반이 어르신은 아실 거라 했습니다. 왕은 누구를 섬깁니까?']),
		say(
			'dangun',
			['Sacred Bone, True Bone, bone upon bone,', 'and under them all, the ones who have none.', 'You said it yourself with sand on your knees.', 'Serve the most. There are more of these.'],
			['성골 진골, 뼈 위에 뼈,', '그 밑에 다들, 뼈 없는 이들.', '무릎에 모래 묻히고 네가 한 말.', '많은 쪽을 섬겨라. 그쪽이 더 많다.']
		),
		say('munmu', ['That’s— I said that. I was six.'], ['그건— 제가 한 말입니다. 여섯 살 때.']),
		say('dangun', ['And you were right, and you were six. Now be right at forty-seven.'], ['맞았고, 여섯 살이었다. 인자 마흔일곱에 맞아 봐라.']),
		say(
			'dangun',
			[
				'Your father wanted a king of the bone. Your uncle wanted in.',
				'There is an older word than both. Not Sacred, not True. The one who stayed when heaven came down, and governed.',
				'Wanggum.'
			],
			['너그 아부지는 뼈의 임금을 원했다. 너그 외숙은 들어가고 싶어 했고.', '둘보다 오래된 말이 있다. 성골도 진골도 아닌. 하늘이 내려왔을 때 남아서 다스린 자.', '왕검.']
		),
		say('munmu', ['My name is Bupmin.'], ['제 이름은 법민입니다.']),
		say(
			'dangun',
			['Names are coats. That one was mine first.', 'It fits you better than it fit me. I was taller.'],
			['이름은 옷이다. 그건 원래 내 거였다.', '너한테 더 맞네. 나는 더 컸으니까.']
		),
		p(
			'Munmu stands in the water for a long moment with nothing left to ask. Then he does a thing his father never did and his uncle never needed to. He gives up.',
			'문무는 더 물을 것도 없이 한참 물속에 서 있다. 그러다 아버지는 한 번도 하지 않았고 외숙은 할 필요가 없었던 일을 한다. 내려놓는다.'
		),
		say('munmu', ['I don’t understand half of what you’ve said.', '…But you know better than I.'], ['말씀의 반도 못 알아듣겠습니다.', '…그래도 어르신이 저보다 잘 아시겠지요.']),
		say(
			'dangun',
			['Better than you? A little. Better than them? Not at all.', 'Ask them, Wanggum. Then do as you’re told.'],
			['너보다? 조금. 저들보다? 전혀.', '저들한테 물어라, 왕검아. 그라고 시키는 대로 해라.']
		),
		say('munmu', ['Them who?'], ['저들이 누굽니까?']),
		p(
			'The man in white does not answer. He looks down. So does Munmu.',
			'흰옷의 사내는 대답하지 않는다. 그는 아래를 본다. 문무도 본다.'
		),
		p(
			'The water has gone still as lacquer. It does not show his face. It shows faces. A Baekje woman in undyed white at a well. A Goguryeo boy walking south with a pot on his back. A Gaya fisherman mending a net. A Silla soldier with no rank, asleep against a wall. Thousands of them. More than there are of anyone else.',
			'물이 옻칠처럼 고요해졌다. 그의 얼굴은 비치지 않는다. 얼굴들이 비친다. 우물가의 물들이지 않은 흰옷 차림 백제 여인. 솥을 지고 남쪽으로 걷는 고구려 소년. 그물을 깁는 가야 어부. 벽에 기대 잠든, 품계 없는 신라 병사. 수천. 누구보다도 많다.'
		),
		p(
			'When he looks up, the man is gone, and the steam is only steam.',
			'고개를 들었을 때 사내는 없고, 김은 그저 김이다.'
		),
		keep('That was the hill. This is me.'),

		// ── Dawn ──
		scene('Dawn', '새벽'),
		p(
			'He comes out at first light with wet hair, wearing the winter coat his mother packed. It is cold enough for it after all.',
			'그는 첫새벽에 젖은 머리로 나온다. 어머니가 넣어 준 겨울 두루마기를 입고. 결국 그걸 입을 만큼 춥다.'
		),
		p(
			'He doesn’t ride home. He rides south-west, toward a river town that used to be a capital, and he doesn’t tell the escort why until the second day.',
			'그는 집으로 가지 않는다. 남서쪽으로, 한때 도읍이던 강가 마을로 말을 달린다. 호위에게는 이틀째가 되어서야 까닭을 말한다.'
		),

		// ── The Mound ──
		scene('The Mound', '무덤'),
		p(
			'The record says the king sent envoys to the old Gaya capital. He did. He also went.',
			'기록에는 왕이 옛 가야 도읍에 사신을 보냈다고 되어 있다. 보냈다. 직접 가기도 했다.',
			{ music: 'The Last of the Gaya' }
		),
		p(
			'Suro’s mound is a low green hill by the river. The grass is long. The stone table in front of it has a crack, and moss in the crack. Someone has been leaving barley on it anyway, a handful at a time, for a hundred and forty years.',
			'수로의 무덤은 강가의 낮고 푸른 언덕이다. 풀이 길게 자랐다. 앞의 돌상에는 금이 갔고, 금 사이에 이끼가 끼었다. 그래도 누군가가 백사십 년 동안 한 줌씩 보리를 올려 왔다.'
		),
		p(
			'Munmu kneels. In front of the whole escort, a king of Silla puts his forehead on the grass of a Gaya grave.',
			'문무가 무릎을 꿇는다. 호위 전체가 보는 앞에서, 신라의 왕이 가야 무덤의 풀에 이마를 댄다.'
		),
		extra(...MINISTER, ['Majesty— the royal shrine is for the royal line. He was— Gaya was—'], ['전하— 종묘는 왕실 계보를 위한 곳입니다. 저 사람은— 가야는—']),
		say(
			'munmu',
			[
				'He is my ancestor. Fifteen back, on my mother’s side. I counted. It took most of a night.',
				'And the next man on my council who starts a sentence with “Gaya was” can finish it in front of my mother.'
			],
			['내 조상이오. 어머니 쪽으로 열다섯 대 위. 세어 봤소. 밤을 거의 새웠소.', '그리고 다음에 화백에서 누가 ‘가야는’ 하고 말을 꺼내거든, 그 말은 내 어머니 앞에서 끝맺으시오.']
		),
		{
			kind: 'quote',
			person: 'munmu',
			hanja: '朕是伽耶國元君九代孫仇衡王之降于當國也……文明皇后寔生我者 玆故元君於幼冲人 乃爲十五代始祖也 所御國者已曾敗 所葬廟者今尙存 合于宗祧 續乃祀事',
			ko: '가야국 시조의 9대손 구형왕이 이 나라에 항복하였고…… 문명황후께서 실로 나를 낳으셨으니, 시조는 이 어린 사람에게 15대 시조가 된다. 다스리던 나라는 이미 무너졌으나 묻힌 사당은 지금도 남아 있으니, 종묘에 합하여 제사를 이어 가게 하라.',
			html: 'King Guhyeong, ninth in descent from the first lord of Gaya, came over to this country… and Queen Munmyeong truly bore me. So the first lord is, to this young man, a founding ancestor fifteen generations back. The kingdom he ruled has long since fallen, but the shrine where he lies still stands. Join it to the royal ancestral temple, and let its rites go on.',
			source: 'Samguk Yusa (三國遺事) bk. 2, Garak-guk gi (駕洛國記) — King Munmu’s edict on the rites of King Suro'
		},
		p(
			'He sets aside thirty plots of the best fields beside the mound to pay for the rites, and calls them the king’s fields, so nobody can sell them later without saying out loud whose they were. The record dates all this to the first year of his reign. Records like to make a man decisive early. Most good kings decide early and get round to it late.',
			'그는 무덤 곁의 가장 좋은 밭 서른 경을 떼어 제사 비용으로 삼고, 왕위전이라 부른다. 훗날 누가 팔아넘기려 해도 그게 누구 것이었는지 소리 내어 말하지 않고는 못 팔도록. 기록은 이 모든 일을 그가 즉위한 첫해로 적는다. 기록은 사람을 일찍부터 결단력 있게 만들기를 좋아한다. 좋은 임금은 대개 일찍 마음먹고, 늦게야 손을 쓴다.'
		),
		p(
			'When the barley is laid, an old woman in undyed white starts to sing. Too low, the way you sing something you were told never to sing in front of Silla men. A few of the escort know the words. Their grandmothers were Gaya.',
			'보리를 올리자 물들이지 않은 흰옷의 노파가 노래를 시작한다. 너무 낮게. 신라 사내들 앞에서는 절대 부르지 말라고 배운 노래를 부를 때처럼. 호위 몇이 가사를 안다. 그들의 할머니가 가야 사람이었다.'
		),
		extra('Old woman', '#b9ad96', ['Turtle, turtle, show your head.', 'If you won’t show it, we’ll roast you and eat you.'], ['거북아 거북아, 머리를 내어라.', '내놓지 않으면, 구워서 먹으리.']),
		p(
			'So that is how the rest goes. Somewhere, a king who hums has been wondering for a very long time. Munmu laughs on his knees in front of the True Bone, and does not explain.',
			'그 뒤는 그렇게 이어진다. 어딘가에서 흥얼거리는 임금 하나가 아주 오랫동안 궁금해했다. 문무는 진골들 앞에 무릎 꿇은 채 웃고, 설명하지 않는다.'
		),

		// ── Home ──
		scene('Home', '집'),
		p(
			'That winter, the old ranks of Baekje are written into Silla’s, man for man. It is the first time a conquered lord in this country has been handed a rank instead of a chain. The True Bone houses complain at length. Nobody opens a door.',
			'그 겨울, 백제의 옛 관등이 사람마다 신라 관등으로 옮겨 적힌다. 이 땅에서 정복당한 귀족이 쇠사슬 대신 관등을 받은 건 처음이다. 진골 집안들은 길게 불평한다. 아무도 문을 열지 않는다.',
			{ music: 'Unification' }
		),
		p(
			'He writes the West its apology too, in a lovely hand that isn’t Deto’s. He signs it with the name the emperor gave him. He keeps the other one.',
			'서국에 보낼 사죄문도 쓴다. 대토의 것이 아닌 고운 글씨로. 황제가 준 이름으로 서명한다. 다른 이름은 간직한다.'
		),
		p(
			'Every month a sack of rice goes up into the hills, to a man who farms badly. Nobody tells him who sends it. He knows.',
			'달마다 쌀 한 섬이 산으로 올라간다. 농사를 서툴게 짓는 사내에게. 누가 보내는지 아무도 말해 주지 않는다. 그는 안다.'
		),
		p(
			'His mother is standing by the well when he comes home. It is where she stands now.',
			'그가 집에 돌아오니 어머니가 우물가에 서 있다. 요즘 그녀가 서 있는 자리다.'
		),
		say('munhee', ['Your hair’s wet.'], ['머리가 젖었네.']),
		say('munmu', ['I was with family.'], ['식구들이랑 있었습니다.']),
		say('munhee', ['…Which ones?'], ['…어느 식구?']),
		say('munmu', ['All of them.'], ['다요.']),
		p('She waits. She has been waiting at this well since summer.', '그녀는 기다린다. 여름부터 이 우물가에서 기다려 왔다.'),
		say(
			'munmu',
			[
				'Mother. You asked him something here. He told me to ask them for you.',
				'I asked. It’s both. It was always both. They had their hands on each other’s shoulders all the way back.'
			],
			['어머니. 여기서 외숙께 뭘 물으셨지요. 저들한테 물어 달라 하셨답니다.', '물어봤습니다. 둘 다입니다. 처음부터 둘 다였어요. 맨 끝까지, 서로 어깨에 손을 얹고 있었습니다.']
		),
		p(
			'Munhee is sixty-seven, and nobody calls her little sister any more. She puts her face in her son’s wet hair and cries like one.',
			'문희는 예순일곱이고, 이제 그녀를 동생이라 불러 줄 사람은 없다. 그녀는 아들의 젖은 머리에 얼굴을 묻고, 막내 동생처럼 운다.'
		),
		p(
			'Nothing changes that a scribe could write down. He is still forty-seven. The West is still in the north. But for forty-seven years he has been somebody’s son and somebody’s nephew, the boy on the beach with his father’s dream in his mouth. Tonight he goes to bed with nobody’s hand on his shoulder, and he stands up straight anyway.',
			'사관이 적을 만한 건 아무것도 바뀌지 않는다. 그는 여전히 마흔일곱이다. 서국은 여전히 북쪽에 있다. 그러나 마흔일곱 해 동안 그는 누군가의 아들이었고 누군가의 조카였다. 아버지의 꿈을 입에 문 바닷가의 아이였다. 오늘 밤 그는 아무의 손도 어깨에 얹히지 않은 채 잠자리에 들고, 그래도 허리를 편다.'
		),
		p(
			'The dream was his father’s. The kingdom will be his. Somewhere above the weather, someone who has watched this family since before it had a name is pleased, and says nothing. The rhymes were his grandson’s idea.',
			'꿈은 아버지의 것이었다. 나라는 그의 것이 될 것이다. 날씨보다 높은 어딘가에서, 이 집안을 이름이 생기기도 전부터 지켜본 누군가가 흐뭇해하며 아무 말도 하지 않는다. 운율은 그 손자의 생각이었다.'
		),
		keep('The ship is here…!')
	];
}

// Stills whose anchor line was rewritten or cut.
const REANCHOR = {
	'dangun-cave-numinous': 'Names are coats.',
	'hyulle-near-him': 'Hello. I’ll be quiet.',
	'the-wanggums-guest-close': 'Somewhere above the weather'
};
const PEOPLE = { 'hyulle-near-him': ['hyulle', 'munmu'] };

editStory((story) => {
	const entry = story.flatMap((c) => c.entries ?? []).find((e) => e.title === TITLE);
	if (!entry) throw new Error(`no entry ${TITLE}`);
	entry.blocks = blocks(entry.blocks);
	entry.tone = 'ancestral vision';
	entry.logline = {
		en: 'The day after his uncle’s funeral, Munmu brings one question into the steam. Fifteen generations come to answer it, and the last one only speaks in rhyme.',
		ko: '외숙의 장례 이튿날, 문무는 질문 하나를 들고 김 속으로 들어간다. 열다섯 대가 답하러 오고, 마지막 한 사람은 운율로만 말한다.'
	};
	const text = (b) => [b.html, b.ko, b.label, ...(b.en ?? []), ...(b.lines ?? [])].filter(Boolean).join(' ');
	for (const im of entry.images ?? []) {
		if (REANCHOR[im.id]) im.at = REANCHOR[im.id];
		if (PEOPLE[im.id]) im.people = PEOPLE[im.id];
		if (im.at && !entry.blocks.some((b) => text(b).includes(im.at))) console.warn(`unanchored: ${im.id} → ${im.at}`);
	}
	console.log(`${TITLE}: ${entry.blocks.length} blocks`);
});
