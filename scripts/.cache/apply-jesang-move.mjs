#!/usr/bin/env node
/** Move Jesang after Munhee; rewrite Jesang / Sound / Hodong; split Gwanggaeto. */
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (person, lines, en) => ({
	kind: 'dialogue',
	person,
	lines: [].concat(lines),
	en: [].concat(en)
});
const ds = (speaker, gender, chip, lines, en) => ({
	kind: 'dialogue',
	speaker,
	gender,
	chip,
	lines: [].concat(lines),
	en: [].concat(en)
});
const scene = (label, ko, extra = {}) => ({ kind: 'scene', label, ko, ...extra });
const card = (person, caption, ko, extra = {}) => ({ kind: 'card', person, caption, ko, ...extra });
const map = (year, places, caption, ko) => ({ kind: 'map', year, places, caption, ko });
const place = (id, html, ko) => ({ kind: 'place', place: id, html, ko });

const jesangBlocks = [
	p('There was only one man the king could send. They had decided that as boys.', '임금이 보낼 수 있는 사람은 하나였다. 그 결정은 소년일 때 이미 나 있었다.'),
	scene('The South Shore', '남쪽 나루', {
		jump: { year: 408, en: 'Ten Winters Before…', ko: '십 년 전…' }
	}),
	p('Two boys on a wet boat. One will be king. The other already knows which oar is his.', '젖은 배 위의 소년 둘. 하나는 왕이 된다. 다른 하나는 이미 제 노를 안다.'),
	card('jesang', 'Park of the south shore. He talks like a hall, and rows like a boat.', '남쪽 나루의 박씨. 말은 대청처럼 하고, 노는 배처럼 젓는다.'),
	d('nulji', ['제상.', '내가 언제 사람을 보내야 하면.'], ['Jesang.', 'If I ever have to send someone.']),
	d('jesang', ['그러면 나 보내.', '말만 말고.'], ['Then send me.', 'Don’t send a speech.']),
	d('nulji', ['형이 북에 있어.', '아우가 섬에 있어.', '나는— 나는 여기 있어.'], ['The older one is in the north.', 'The younger is on the island.', 'I’m— I’m here.']),
	d('jesang', ['알아.', '그래서 노를 젓는 거야.'], ['I know.', 'That’s why I’m rowing.']),
	p('They do not shake on it. A shake would make it a vow. It is already worse than a vow.', '악수하지 않는다. 악수하면 맹세가 된다. 이미 맹세보다 더한 것이다.'),
	d('nulji', ['제상아.', '다른 사람은 안 돼.'], ['Jesang.', 'It can’t be anybody else.']),
	d('jesang', ['안 시켜도 알아.'], ['You don’t have to ask.']),
	scene('The Thin Hour', '얇은 시각', {
		jump: { year: 418, en: 'Ten Winters Later…', ko: '십 년 뒤…' }
	}),
	map(
		418,
		['surabol', 'gungnae', 'usan'],
		'Silla has a king and no brothers in the house. The brothers are still paying for a word their father wrote.',
		'신라에 임금은 있고 집 안에 아우가 없다. 아우는 아직, 아버지가 쓴 글자의 값을 내고 있다.'
	),
	card('nulji', 'The boy on the boat is kan now. He still has only one man.', '배 위의 소년이 이제 간이다. 사람은 아직도 하나다.'),
	p('The horsemen who saved the capital never quite left. They took two princes north and one across the sea, and called it rent. Nulji has been walking the hall since the lamps went.', '도성을 구한 기병들은 끝내 다 가지 않았다. 왕자 둘을 북으로, 하나를 바다 너머로 데려가고, 그걸 세라 불렀다. 등잔이 꺼진 뒤로 눌지가 대청을 걷는다.'),
	d(
		'nulji',
		['제상아.', '북에 하나.', '섬에 하나.', '의자만 남았어.'],
		['Jesang.', 'The north has one.', 'The island has the other.', 'I have a chair.']
	),
	d('jesang', ['내가 가.'], ['I’ll go.']),
	d('nulji', ['이유는 가져오지 마.', '사람만.'], ['Don’t bring me a reason.', 'Just the people.']),
	d('jesang', ['북이 먼저야.', '섬은 그다음.'], ['The north first.', 'The island after.']),
	d('nulji', ['그사이에 집 들르지 마.', '들르면 내가— 내가 잡아 둘까 봐.'], ['Don’t stop at your house between.', 'If you stop I might— I might keep you.']),
	d('nulji', ['네가 안 가면 내가 가.'], ['If you don’t go, I will.']),
	d('jesang', ['가면 안 돼.', '의자가 비면 섬이 알아.'], ['You can’t.', 'If the chair is empty, the island knows.']),
	d('nulji', ['……그래.', '그럼 너야.'], ['…Right.', 'Then it’s you.']),
	p('He does not say if. He says after. That is the old sentence, grown up.', '만일이라고 하지 않는다. 그다음이라고 한다. 예전의 문장이, 어른이 된 것이다.'),
	scene('The Gate', '문'),
	card('chisul', 'His wife. Unfinished sentences. Holds the children and the door.', '아내. 문장이 안 끝나는 사람. 아이와 문을 잡는다.'),
	d('chisul', ['언제.', '언제요.', '북이 언제야.'], ['When.', 'When.', 'When is the north.']),
	d('jesang', ['지금.', '북쪽 다음이 섬이야.'], ['Now.', 'After the north is the island.']),
	d('chisul', ['오늘은— 오늘은 문 안에.', '애들이— 애들이 아직—'], ['Today— today inside the door.', 'The children— the children are still—']),
	d('jesang', ['들어가면 남아.', '남으면 두 번째 아이가 섬에 남아.'], ['If I come in, I stay.', 'If I stay, the second boy stays on the island.']),
	d('chisul', ['그럼 남아.', '안 남아?', '남아.'], ['Then stay.', 'You’re not staying?', 'Stay.']),
	d('jesang', ['다른 아이가 아직 섬에 있어.', '그건 예전에 말한 거야. 배 위에서.'], ['The other boy is still on an island.', 'We said that already. On a boat.']),
	p('She does not finish the next sentence. He is already on the road. The door stays open a long time, which does not help.', '다음 문장을 못 끝낸다. 그는 이미 길 위에 있다. 문은 오래 열려 있다. 도움이 되지는 않는다.'),
	scene('The Northern Hall', '북쪽 대청'),
	card('jangsu', 'Gwanggaeto’s son. Grants a favour the way weather grants rain.', '광개토의 아들. 비가 내리듯 은혜를 내린다.'),
	p('Jesang does not kneel first. He sits the way a man sits when he has already decided the ending, and only needs the room to catch up.', '제상은 먼저 무릎 꿇지 않는다. 결말을 이미 고른 사람이 앉는 방식으로 앉는다. 방이 따라오기만 하면 된다.'),
	d('jangsu', ['신라 사람이 또 왔군.', '지난번엔 종이라고 써 왔지.'], ['Another Silla man.', 'Last time they wrote servant.']),
	d(
		'jesang',
		['그 글자를 쓴 사람은 죽었소.', '값을 내는 사람은 아직 열두 살이오.', '대왕께서는 이미 지붕이 많으시지. 아이 하나가 더한다고, 지붕이 높아지진 않소.'],
		[
			'The man who wrote that word is dead.',
			'The one still paying for it was twelve.',
			'You already have many roofs, Great King. One boy does not make them taller.'
		]
	),
	d('jangsu', ['말은 잘하는군.', '그래서 왔나. 말을 하러.'], ['You talk well.', 'Is that why you came. To talk.']),
	d(
		'jesang',
		['말을 하러 왔소.', '칼을 차고 온 사내는 이미 많이 보셨을 테니.', '아이는 이미 값을 냈소. 열 해. 그 값은 충분하오.'],
		[
			'Yes. To talk.',
			'You’ve already seen plenty of men who came with swords.',
			'The boy has paid. Ten winters. That is enough rent.'
		]
	),
	d('jangsu', ['혼자 왔군.'], ['You came alone.']),
	d('jesang', ['군사가 필요한 대청은 이미 거절한 대청이오.'], ['A hall that needs an army has already said no.']),
	d('jangsu', ['거절하면.'], ['And if I say no.']),
	d('jesang', ['그러면 빈손으로 섬에 가오.', '아이는 계속 값을 내고.', '그건 대왕의 거절보다 더 나쁜 거절이오.'], ['Then I go to the island with nothing.', 'The boy still pays.', 'That is a worse no than yours.']),
	p('Jangsu laughs, once, the way a large country laughs when it has been surprised in its own hall.', '장수가 한 번 웃는다. 제 대청에서 놀란 큰 나라가 웃는 방식으로.'),
	d('jangsu', ['잘 물은 물음도 물음이오.', '데려가시오.', '그 다음은 안 묻겠소.'], ['A well-made ask is still an ask.', 'Take him.', 'I will not ask what is next.']),
	d('jesang', ['다음이 있소.', '그건 이쪽 일이오.'], ['There is a next.', 'That one is ours.']),
	card('bokho', 'The older hostage. Tired the way a held boy gets tired.', '형 인질. 붙들린 아이가 지치는 방식으로 지쳐 있다.'),
	d('bokho', ['집에 들르지 않을 거요.', '얼굴이 그래요.'], ['You’re not stopping at your gate.', 'Your face says it.']),
	d('jesang', ['들어가면 안 나옵니다.', '공은 먼저 가시오.'], ['If I go in, I don’t come back out.', 'You go first.']),
	d('bokho', ['아우를 먼저 했어야—'], ['You should have gone for the younger—']),
	d('jesang', ['북이 가깝소.', '섬은 멀고.', '가까운 것부터 걷소.'], ['The north is close.', 'The island is far.', 'You walk the close one first.']),
	p('Bokho goes south. Jesang does not. He walks past his own gate as if it were someone else’s.', '복호는 남으로 간다. 제상은 안 간다. 제 문을 남의 문처럼 지나간다.'),
	scene('불지지', '불지지'),
	p('She runs. The children run. The boat is already a mark on the water.', '달린다. 아이들도 달린다. 배는 이미 물 위의 점이다.'),
	d('chisul', ['안 돌아봤어.', '안 돌아봤잖아—', '제상!'], ['You didn’t even turn.', 'You didn’t even—', 'Jesang!']),
	p('Her legs will not stand. The sand has them. Two relatives take her under the arms. She stretches her legs and will not get up. Later they name that sand. They call it 불지지 — the place she would not stand.', '다리가 안 선다. 모래가 잡는다. 친척 둘이 겨드랑이를 받친다. 그녀는 다리를 뻗고 일어서지 않는다. 나중에 그 모래에 이름을 붙인다. 불지지. 일어서지 않은 곳.'),
	d('jesang', ['모래야.', '일어서.', '아이들은— 아이들 먼저.'], ['It’s the sand.', 'Stand up.', 'The children— the children first.']),
	d('chisul', ['그다음.', '그다음이 언제야.', '섬 다음이 언제야.'], ['After.', 'When is after.', 'When is after the island.']),
	p('He does not answer. Answering would be stopping. The oars take him. She sits in the wet until the mark is gone.', '대답하지 않는다. 대답이 멈춤이니까. 노가 데려간다. 그녀는 점이 없어질 때까지 물에 앉아 있다.'),
	scene('The Chair', '의자'),
	p('Bokho reaches Surabol. The man who fetched him is already salt.', '복호가 서라벌에 닿는다. 데려온 사람은 이미 소금이다.'),
	d('bokho', ['제 문도 안 들렀소.', '모래에서 아내가— 아내가 못 일어섰소.'], ['He did not even stop at his own gate.', 'On the sand his wife— she could not stand.']),
	d('nulji', ['알겠소……', '그의 이름이 영원히 기억되게 하겠소.'], ['Very well…', 'I’ll make sure his name is remembered for all time.']),
	p('He says it too early. The second boat has not left yet.', '너무 일찍 말한다. 두 번째 배는 아직 안 떴다.'),
	scene('The Island', '섬'),
	p('Wa takes a tired Silla lord the way a net takes a fish that swims in on purpose.', '왜는 지친 신라 벼슬을 받는다. 일부러 들어온 물고기를 그물이 받듯.'),
	ds(
		'The Wa king',
		'm',
		'#6a7a8a',
		['신라 사람이, 제 임금이 지겹다.', '편리하군.', '낚시는 할 줄 아오?'],
		['A Silla man, tired of his king.', 'Convenient.', 'Can you fish.']
	),
	d('jesang', ['기다리는 게 지겨웠소.', '낚시는— 배웁니다.'], ['I was tired of waiting.', 'Fishing— I will learn.']),
	p('He fishes. Not one night. Days. The younger prince is in the boat, because a hostage who fishes is still a hostage, just wetter.', '고기를 잡는다. 하룻밤이 아니다. 며칠이다. 어린 왕자가 배에 있다. 낚시하는 인질도 인질이다. 다만 더 젖을 뿐.'),
	card('miseheun', 'The Wa hostage. Wants to stay with the man who came for him.', '왜의 인질. 데리러 온 사람 곁에 있고 싶어 한다.'),
	d('miseheun', ['형님은요.', '형은 갔대요.'], ['My brother.', 'They say he went home.']),
	d('jesang', ['갔소.', '공은 아직이오.'], ['He did.', 'You haven’t.']),
	d('miseheun', ['그럼 나도.', '같이요.'], ['Then me too.', 'Together.']),
	p('On the third morning the water is empty enough. Jesang looks at the small boat tied astern.', '사흘째 아침, 물이 비기에 충분하다. 제상이 고물에 맨 작은 배를 본다.'),
	d('jesang', ['작은 배요.', '오늘 밤.'], ['The small boat.', 'Tonight.']),
	d('miseheun', ['그럼 같이요.', '같이 가요. 지금.'], ['Then we both go.', 'We both go. Now.']),
	d('jesang', ['둘 다 빠지면 둘 다 못 가요.', '공은 작은 배를.'], ['If two leave, neither gets home.', 'You take the small boat.']),
	d(
		'miseheun',
		['저들 배를 빼앗아요.', '군사를 모아 돌아가.', '끝내요.'],
		['We take their ships.', 'We go back with an army.', 'We end it.']
	),
	d('jesang', ['안 되오.', '공은 그 자리에 있어야 하오. 아우가 볼 수 있는 자리.'], ['No.', 'You stay where you are. Where your brother can see you.']),
	d('miseheun', ['저들이 당신을—', '태울 거예요.'], ['They’ll burn you—', 'They burn people.']),
	d('jesang', ['그러면 나를 태우오. 공은 안 되오.'], ['Then they burn me. Not you.']),
	d('jesang', ['옷을 주시오.'], ['Give me the coat.']),
	d('miseheun', ['그 옷은 무거워요.'], ['That coat is heavy.']),
	d('jesang', ['그래서 제가 입소.'], ['Then I will wear it.']),
	d('miseheun', ['안 돼요, 제상! 당신은……', '그래선 안 돼요……'], ['No, Jesang! You cannot…', 'You must not…']),
	d(
		'jesang',
		[
			'미사흔공……',
			'공께서는 큰 운명을 지닌 분이시오……! 저는 그저 종일 뿐이오.',
			'공의 충직한 신하로서 제 이름 석 자를 이야기에 올릴 수 있다면, 그것으로 족하오.'
		],
		[
			'Lord Miseheun…',
			'You are a man with a great fate…! I am just a servant.',
			'If I can place the three letters of my name onto the stories as your loyal servant, that will be enough for me.'
		]
	),
	p('Miseheun has been a hostage since he was small enough to lift. He has nothing to say to this. His eyes go first.', '미사흔은 안아 올릴 때부터 인질이었다. 그런 그가 이 말 앞에서는 할 말이 없다. 눈이 먼저 무너진다.'),
	d('miseheun', ['그럼 안 가요.'], ['Then I’m not going.']),
	d('jesang', ['가오.', '위에서 다시 만납시다. 늦지 않으리다.'], ['You are.', 'We’ll meet again, up there. I won’t be late.']),
	p('The small boat takes the prince. Jesang keeps fishing. From the other deck, nothing has happened yet.', '작은 배가 왕자를 가져간다. 제상은 계속 낚시를 한다. 저쪽 갑판에서 보면, 아직 아무 일도 없다.'),
	scene('The Fire', '불'),
	p('They notice late. Late is still too soon for him.', '늦게 알아챈다. 늦어도 그에게는 아직 이르다.'),
	ds('The Wa king', 'm', '#6a7a8a', ['앉으시오.', '신하로.', '의자까지 내겠소.'], ['Sit.', 'As a minister.', 'We will even give you a chair.']),
	p('They tie him to the post. The fire takes the hem first. He does not sit. He looks up, and he uses the whole of his air.', '기둥에 묶는다. 불이 먼저 옷자락을 가져간다. 그는 앉지 않는다. 하늘을 보고, 숨을 다 쓴다.'),
	d('jesang', ['왜의 신하가 되느니—', '신라의 개가 되리다!'], ['I’d rather be a minister of Wa—', 'I’d rather be a dog of Silla!']),
	p('The sky does not answer. It does not have to. The island heard him.', '하늘은 대답하지 않는다. 할 필요도 없다. 섬이 들었다.'),
	d(
		'kangrim',
		['어라하. 종이여.', '질문 하나 하고, 갑시다.', '왕자 둘을 데려왔소. 섬에 남았소. 어느 쪽이었소. 종이었소, 아우였소?'],
		['Eraha. Servant.', 'One question, then we walk.', 'You brought both princes home. You stayed on the island. Which were you — a servant, or a brother?']
	),
	d('jesang', ['개요.', '문이 일이었소.'], ['A dog.', 'The gate was the job.']),
	scene('Chisullyeong', '치술령'),
	place('chisullyeong', 'A shore ridge. East is water. East is Wa.', '나루 능선. 동쪽이 물이다. 동쪽이 왜다.'),
	p('She looks east until looking is all that’s left. The girls look because she looks.', '동쪽으로 본다. 보는 일만 남을 때까지. 딸들은 그녀가 보니까 본다.'),
	d('chisul', ['불지지에서…', '일어서라고 했지.', '그다음이 이거야.'], ['At Buljiji…', 'He said stand up.', 'After is this.']),
	ds('The elder daughter', 'f', '#c9a070', ['엄마.', '내려가자.'], ['Mother.', 'Let’s go down.']),
	d('chisul', ['내려가면 안 보여.', '보여야— 보여야 와.'], ['If we go down we can’t see.', 'He has to see— he has to come.']),
	p('The ridge keeps her. Later they will say stone. Later than that, a bird. The daughters wait until there is nothing left to wait with.', '능선이 그녀를 지킨다. 나중엔 돌이라 할 것이다. 그보다 나중엔 새. 딸들은 기다릴 것이 없을 때까지 기다린다.'),
	scene('The Name', '이름'),
	p('Miseheun comes home on the small boat. Nulji marries him to Jesang’s second daughter. He names the dead man Deachan, which is a tall chair for a man who would not sit.', '미사흔이 작은 배로 온다. 눌지가 그를 제상의 둘째 딸과 혼인시킨다. 죽은 사람을 대아찬이라 부른다. 앉지 않은 사람에게는 높은 자리다.'),
	d('miseheun', ['제가 배를 탔어요.', '옷은— 옷은 그가 입었어요.'], ['I took the boat.', 'The coat— he wore the coat.']),
	d('nulji', ['타라고 한 거요.', '이름은 내가 기억하오.'], ['He meant you to.', 'I remember the name.']),
	p(
		'<b>The prince who oiled a rusty hinge now sits where his father sat…!</b>',
		'<b>녹슨 경첩에 기름을 치던 태자가, 이제 아버지가 앉던 자리에 앉는다…!</b>'
	)
];

const soundBlocks = [
	p('Two small kings. One strip of dirt. They ask a third kan to count it.', '작은 왕 둘. 흙 한 줄. 세 번째 간에게 세어 달라 한다.'),
	scene('The Strip', '그 줄'),
	map(
		102,
		['sound_kingdom', 'siljik', 'apdok', 'surabol'],
		'Jinhan roofs, still arguing over a line you could spit across.',
		'진한의 지붕들. 침 넘어갈 줄을 놓고 아직 싸운다.'
	),
	place('sound_kingdom', 'The first character is sound. Tachu Kan’s small roof north of the capital.', '첫 글자가 소리. 도성 북쪽, 타추간의 작은 지붕.'),
	card('soundking', 'Tachu Kan. A guest is a guest. That is his whole law.', '타추간. 손님은 손님이다. 법이 그것이다.'),
	card('siljikking', 'Anil Kan of Straight Vale. Wants the strip because it is straight.', '실직의 아닐간. 곧으니까 제 줄이라 한다.'),
	d('soundking', ['이쪽이 소리요.', '물 흐르는 소리가 여기서 나.', '그러니까 여기요.'], ['This side sounds.', 'The water sounds from here.', 'So here.']),
	d('siljikking', ['물은 곧게 흐르오.', '곧은 쪽이 내 쪽이오.', '세지 마시오. 이미 셌소.'], ['Water runs straight.', 'Straight is mine.', 'Don’t count. I already did.']),
	card('pasa', 'Pasa Isageum. He lives next door. He does not like counting other people’s dirt.', '파사 이사금. 옆집에 산다. 남의 흙 세는 일이 싫다.'),
	d('pasa', ['내가 세면 한쪽이 원망하오.', '판관은 이웃에게나 맡기는 거요. 나는 옆집에 사오.', '금관의 수로왕은 늙었고, 아는 게 많소. 그를 부르겠소.'], ['If I count, one side hates me.', 'Judges are for neighbours. I live next door.', 'Suro of the Gold Hall is old, and knows a great deal. I’ll call him.']),
	card('suro', 'You know him. Hunger is honest. He still meets it himself.', '아는 사람이다. 배고픔은 정직하다. 아직 직접 만난다.'),
	d('suro', ['누구 흙이오.', '…밥은 있소?'], ['Whose dirt.', '…Is there food.']),
	d('soundking', ['우리 거요.', '저 사람 거요.', '세어 주시오.', '밥은— 밥은 있소.'], ['Ours.', 'His.', 'Count it.', 'Food— there is food.']),
	p('Suro eats first. Then he walks the strip. A ditch, a stone, a tree both halls claim.', '수로가 먼저 먹는다. 그다음 줄을 걷는다. 도랑, 돌, 양쪽 대청이 다 제 것이라 하는 나무.'),
	d('suro', ['이쪽은 소리가 나고.', '저쪽은 곧고.', '줄은 소리 쪽에 주오.'], ['This side sounds.', 'That side is straight.', 'The strip goes to the sound.']),
	d('siljikking', ['밥값 치르셨소.', '판결은 안 치렀소.'], ['You paid for the meal.', 'You did not pay for the judgement.']),
	scene('The Banquet', '잔치'),
	p('Pasa tells the six clans to feast Suro. Five send a high man. Hangibu sends a low one.', '파사가 여섯 부에 명하여 수로를 먹이라 한다. 다섯은 높은 사람을 보낸다. 한기부만 낮은 사람을 보낸다.'),
	ds('Hangibu’s host', 'm', '#8a8a7a', ['이 자리가—', '이 자리가 낮아서—'], ['This seat is—', 'This seat is low, so—']),
	d('suro', ['자리는 낮소.', '나는 안 낮소.', '탐하리.'], ['The seat is low.', 'I am not.', 'Tamhari.']),
	card('tamhari', 'Suro’s man. Does the ugly job. Does not dress it up.', '수로의 사람. 더러운 일을 한다. 꾸미지 않는다.'),
	d('tamhari', ['예.'], ['Yes.']),
	d('suro', ['한기부 우두머리.', '보제.', '그리고 돌아오너라.'], ['Hangibu’s head.', 'Boje.', 'Then come back.']),
	p('Tamhari does it in the yard, not in the hall. The hall is still pouring wine.', '탐하리는 마당에서 한다. 대청이 아니다. 대청은 아직 술을 따른다.'),
	ds('Boje', 'm', '#7a6a5a', ['잠깐—', '자리는— 자리가—'], ['Wait—', 'The seat— the seat—']),
	p('Suro goes home. Tamhari does not. He runs to the roof that just won the count.', '수로는 돌아간다. 탐하리는 안 돌아간다. 방금 줄을 받은 지붕으로 달린다.'),
	scene('Tachu Kan’s Door', '타추간의 문'),
	d('tamhari', ['숨겨 주시오.', '내가 한 일은— 시킨 일이오.'], ['Hide me.', 'What I did— I was told to.']),
	d('soundking', ['먹었으면 손님이야.', '손님은 안 내보낸다.'], ['If you ate here, you’re a guest.', 'I don’t send a guest out.']),
	d('pasa', ['종을 내놓으시오.', '타추간.'], ['Send the slave out.', 'Tachu Kan.']),
	d('soundking', ['내 상에서 먹었소.', '그런 건 안 내놓소.'], ['He ate at my table.', 'I don’t send that out.']),
	d('pasa', ['그러면 지붕을 가져가겠소.'], ['Then I take the roof.']),
	d('soundking', ['가져가시오.', '손님은 두고.'], ['Take it.', 'Leave the guest.']),
	p('Pasa does not come to the gate. He sends the roof over it. Tachu Kan bows with his people. Anil Kan looks at the empty hall.', '파사는 문에 오지 않는다. 지붕을 문 너머로 보낸다. 타추간이 무리와 함께 절한다. 아닐간이 빈 대청을 본다.'),
	d('siljikking', ['소리가 없으면 다음이 나요.', '그러니까 다음이 아니오.'], ['If Sound is gone, I am next.', 'So I am not next.']),
	p('Straight Vale bows. Held Watch bows. Silla is larger in the morning. The banquet is not.', '실직이 절한다. 압독이 절한다. 아침의 신라는 더 크다. 잔치는 아니다.'),
	scene('Usan', '우산', {
		jump: { year: 512, en: 'Four Hundred Years Later…', ko: '사백 년 뒤…' }
	}),
	map(512, ['usan', 'surabol'], 'An island past the east sea. It trusts its cliffs.', '동해 너머 섬. 벼랑을 믿는다.'),
	place('usan', 'Cliffs. Sea. A chief who has never had to bow.', '벼랑. 바다. 한 번도 절할 일 없던 추장.'),
	card('isabu', 'You’ve seen him. Gaya. The army that arrives after the white banner is his.', '본 적 있다. 가야. 흰 깃발 뒤에 도착하는 군대가 그의 것이다.'),
	d('isabu', ['벼랑은 안 절하오.', '이야기는 절하오.'], ['A cliff does not bow.', 'A story does.']),
	p('He beaches wooden lions. From the cliff they have shadows. Shadows are enough.', '나무 사자를 풀어 내린다. 벼랑에서 보면 그림자가 있다. 그림자면 충분하다.'),
	d('usanchief', ['저거 안 살았잖아.', '살았다고 하지 마.'], ['Those are not alive.', 'Don’t tell me they are.']),
	d('isabu', ['확인하고 싶소?'], ['Do you want to find out.']),
	d('usanchief', ['해마다 바치겠소.', '사자만… 도로 가져가시오.'], ['Tribute every year.', 'Just… take the lions back.']),
	d('isabu', ['사자는 남겨 두겠소.', '이야기가 필요하니까.'], ['The lions stay.', 'A story needs them.']),
	p(
		'<b>A letter will cross the sea. The man who writes it has already chosen the ending…!</b>',
		'<b>편지가 바다를 건넌다. 그 편지를 쓰는 자는 이미 결말을 골라 두었다…!</b>'
	)
];

const gwYouth = [
	p('He is eighteen and already too big for the chair. The chair does not mention it.', '열여덟이다. 의자에는 이미 크다. 의자는 그 말을 하지 않는다.'),
	scene('The Boy', '소년', { jump: { year: 391, en: 'The Year He Sat…', ko: '앉은 해…' } }),
	ds('An old rider', 'm', '#8a4a44', ['태왕.', '북이 먼저요, 서가 먼저요.'], ['Tae Wang.', 'North first, or west.']),
	d('gwanggaeto', ['북.', '서는 글씨가 다르니까.', '글씨는 나중에.'], ['North.', 'The west writes in a different hand.', 'Letters later.']),
	scene('North', '북'),
	p('Khitan tents on a frozen river. He is still a boy in the shoulders. The tents do not care.', '언 강 위의 거란 천막. 어깨는 아직 아이다. 천막은 상관하지 않는다.'),
	d('gwanggaeto', ['천막을 세지 마라.', '강을 세어라.', '강이 우리 쪽이면 천막은 따라온다.'], ['Don’t count the tents.', 'Count the river.', 'If the river is ours, the tents come.']),
	ds('A Khitan rider', 'm', '#6a5a4a', ['아이가 왕이야.', '강은 안 들어.'], ['The king is a boy.', 'The river doesn’t listen.']),
	d('gwanggaeto', ['나는 아이다.', '강은 내 아이다.', '앉아.'], ['I am a boy.', 'The river is mine.', 'Sit.']),
	ds('A Khitan rider', 'm', '#6a5a4a', ['앉으면 끝이야.', '안 앉으면—'], ['If we sit, it’s over.', 'If we don’t—']),
	d('gwanggaeto', ['안 앉으면 강이 가져간다.', '선택은 그거다.'], ['If you don’t, the river takes you.', 'That’s the choice.']),
	p('The river listens. By spring the tents are Goguryeo’s, or they are ash. He does not stay to decide which.', '강은 듣는다. 봄이 되면 천막은 고구려 것이거나 재다. 어느 쪽인지 정하러 머물지 않는다.'),
	scene('West', '서'),
	p('The west is a wall and a different grammar. Yan writes. He rides.', '서는 성벽이고, 다른 문법이다. 연이 글을 쓴다. 그는 말을 탄다.'),
	d('gwanggaeto', ['글씨는 나중에라 했다.', '지금은 문이다.'], ['I said letters later.', 'This is a gate.']),
	ds('A Yan officer', 'm', '#a07040', ['태왕.', '문은 열 수 있습니다.', '다만— 이름만—'], ['Tae Wang.', 'The gate can open.', 'Only— the name—']),
	d('gwanggaeto', ['이름은 비석에 적겠다.', '문은 지금 연다.'], ['I’ll write the name on the stele.', 'The gate opens now.']),
	ds('A Yan officer', 'm', '#a07040', ['열면 서가 당신 것이 됩니다.', '닫으면 편지가 갑니다.'], ['If it opens, the west is yours.', 'If it stays shut, a letter goes.']),
	d('gwanggaeto', ['편지는 이미 늦었다.', '말이 먼저 왔다.'], ['The letter is already late.', 'The horse got here first.']),
	p('The west folds the way paper folds. He turns the horse south. That is the part everyone remembers.', '서는 종이 접히듯 접힌다. 그는 말을 남으로 돌린다. 다들 기억하는 대목은 그것이다.'),
	scene('South', '남'),
	p('South is a river and a king who still thinks the river is his.', '남은 강이고, 그 강이 제 것이라 여기는 임금이다.'),
	ds('A Baekje captain', 'm', '#d9b13a', ['물은 우리 쪽이오.', '말은 돌려 가시오.'], ['The water is ours.', 'Turn the horse.']),
	d('gwanggaeto', ['강은 문이다.', '문은 양쪽에서 열린다.', '네 말이 왜 내 물을 마시지.'], ['A river is a door.', 'Doors open from both sides.', 'Why is your horse drinking my water.']),
	ds('A Baekje captain', 'm', '#d9b13a', ['물이 먼저요, 성이 먼저요.'], ['The water first, or the fortress.']),
	d('gwanggaeto', ['성은 나중에.', '물은 지금.'], ['The fortress later.', 'The water now.']),
	p('Baekje keeps the hall. It loses the bank. He does not sit in their chair. He has a thinner roof to collect.', '백제는 대청을 지킨다. 강가는 잃는다. 그는 저들 의자에 앉지 않는다. 받을 지붕이 더 얇은 쪽이 있다.')
];

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function lastP(entry) {
	for (let i = entry.blocks.length - 1; i >= 0; i--) {
		if (entry.blocks[i].kind === 'p') return entry.blocks[i];
	}
	return null;
}

const five = story.find((a) => a.id === 'five-principles');
const sillaArc = story.find((a) => a.id === 'silla-tang-war');
const three = story.find((a) => a.id === 'three-kingdoms');
const goguryeo = story.find((a) => a.id === 'goguryeo-tang-war');
if (!five || !sillaArc || !three || !goguryeo) throw new Error('arcs missing');

const jesangIdx = sillaArc.entries.findIndex((e) => e.title === 'Park Jesang');
if (jesangIdx < 0) throw new Error('Jesang not in silla-tang-war — already moved?');
const [jesang] = sillaArc.entries.splice(jesangIdx, 1);
jesang.year = '408–418';
jesang.flash = true;
jesang.flashback = true;
jesang.flashTone = jesang.flashTone ?? '#dbe9f8';
jesang.blocks = jesangBlocks;
const munheeIdx = five.entries.findIndex((e) => e.title === 'Munhee');
if (munheeIdx < 0) throw new Error('Munhee missing');
const munheeClose = lastP(five.entries[munheeIdx]);
munheeClose.html = '<b>Once, at Silla’s thinnest hour, there was only one man the king could send…!</b>';
munheeClose.ko = '<b>한때, 신라가 가장 얇았을 때, 임금이 보낼 수 있는 사람은 하나였다…!</b>';
five.entries.splice(munheeIdx + 1, 0, jesang);

const sound = sillaArc.entries.find((e) => e.title === 'Sound Kingdom');
if (!sound) throw new Error('Sound Kingdom missing');
sound.flash = true;
sound.flashback = true;
sound.flashTone = sound.flashTone ?? '#dbe9f8';
sound.blocks = soundBlocks;

const hodong = goguryeo.entries.find((e) => e.title === 'Hodong');
if (hodong) {
	hodong.flash = true;
	hodong.flashback = true;
	hodong.flashTone = hodong.flashTone ?? '#fdeaea';
	const youth = [
		p('Before the drum, he is just a boy who grins like his grandfather.', '북보다 먼저, 그는 할아버지처럼 웃는 아이일 뿐이다.'),
		scene('The Second Hall', '작은 전각', { jump: { year: 22, en: 'Ten Winters Before the Drum…', ko: '북보다 십 년 전…' } }),
		d('daemusin', ['호동.', '활이 웃으면 안 돼.', '사람이 웃는 거야.'], ['Hodong.', 'The bow doesn’t grin.', 'The person does.']),
		d('hodong', ['그럼 내가 웃을게요.', '활은 그냥 활이고.'], ['Then I’ll grin.', 'The bow can just be a bow.']),
		d('daemusin', ['맞혀.', '그리고 웃지 마.', '웃으면 짐이 도망가.'], ['Hit it.', 'And don’t grin.', 'If you grin the game runs.']),
		d('hodong', ['도망가도 따라가요.', '그게 사냥 아니에요?'], ['If it runs I follow.', 'That’s the hunt, isn’t it.']),
		ds('The queen', 'f', '#8a6a7a', ['저 아이는 문을 너무 잘 열어요.', '임금께서 기억해 두시오.'], ['That boy opens doors too easily.', 'Remember that.']),
		d('daemusin', ['문은 나중에.', '지금은 사냥이다.'], ['Doors later.', 'This is a hunt.']),
		d('hodong', ['나중에가 언제예요.'], ['When is later.']),
		d('daemusin', ['네가 문을 열면.', '그때 이야기하자.'], ['When you open a door.', 'We’ll talk then.']),
		p('He opens one. You already know which.', '그는 문을 연다. 어느 문인지는 이미 안다.')
	];
	hodong.blocks.splice(0, 0, ...youth);
	const pine = hodong.blocks.find((b) => b.label === 'Pine Kingdom');
	if (pine && !pine.jump) pine.jump = { year: -36, en: 'The Friends, First…', ko: '벗들이, 먼저…' };
	const found = hodong.blocks.findIndex((b) => b.en && b.en.some((x) => /I found something/.test(x)));
	if (found >= 0) {
		hodong.blocks.splice(
			found + 1,
			0,
			d('nakrangso', ['뭐를요.', '물고기요, 사람이요.'], ['What.', 'A fish, or a person.']),
			d('hodong', ['사람.', '빨래하는.', '안 올려다보는.'], ['A person.', 'Washing.', 'Not looking up.']),
			d('nakrangso', ['올려다보면 끝이에요.', '우리 집은 그래요.'], ['If I look up, it’s over.', 'That’s how our house is.']),
			d('hodong', ['그럼 끝 아니에요.', '시작이죠.'], ['Then it’s not over.', 'It’s the start.'])
		);
	}
}

const gw = three.entries.find((e) => e.title === 'King Gwanggaeto');
if (!gw) throw new Error('Gwanggaeto missing');
gw.year = '391–400';
gw.flash = true;
gw.flashback = true;
gw.flashTone = gw.flashTone ?? '#fdeaea';
const drown = gw.blocks.findIndex((b) => b.html && /Silla is drowning/.test(b.html));
if (drown < 0) throw new Error('Gwanggaeto open missing');
gw.blocks.splice(drown, 0, ...gwYouth);

for (const arc of story) {
	for (const e of arc.entries || []) {
		for (const b of e.blocks || []) {
			if (typeof b.ko === 'string' && b.ko.includes('월궁')) b.ko = b.ko.replaceAll('월궁', '월성');
			if (typeof b.html === 'string' && b.html.includes('Moon Palace') && e.title !== 'Munhee') {
				/* leave English Moon Palace; Korean is 월성 */
			}
		}
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('ok', {
	afterMunhee: five.entries.slice(munheeIdx, munheeIdx + 3).map((e) => e.title),
	silla: sillaArc.entries.filter((e) => ['Alji', 'Sound Kingdom', 'Park Jesang', 'Xue Rengui'].includes(e.title)).map((e) => e.title)
});
