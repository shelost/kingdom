#!/usr/bin/env node
/** Insert Hodong after Jolbon; Sound Kingdom + Park Jesang after Alji. Retarget closers. */
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';

const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (person, lines, en) => ({
	kind: 'dialogue',
	person,
	lines: Array.isArray(lines) ? lines : [lines],
	en: Array.isArray(en) ? en : [en]
});
const ds = (speaker, gender, chip, lines, en) => ({
	kind: 'dialogue',
	speaker,
	gender,
	chip,
	lines: Array.isArray(lines) ? lines : [lines],
	en: Array.isArray(en) ? en : [en]
});
const scene = (label, ko, extra = {}) => ({ kind: 'scene', label, ko, ...extra });
const card = (person, caption, ko, extra = {}) => ({ kind: 'card', person, caption, ko, ...extra });
const map = (year, places, caption, ko) => ({ kind: 'map', year, places, caption, ko });
const place = (id, html, ko) => ({ kind: 'place', place: id, html, ko });
const img = (id, at, alt, people, tone) => ({
	id,
	at,
	alt,
	people,
	tone,
	ratio: 2,
	nsfw: false,
	prompt: `HEEWON STYLE. Minimal iconic 2:1 still, composed for a 2:1 letterbox crop; nothing important at the top or bottom edge. ${alt} No text. No watermark.`
});

const hodong = {
	year: '-36–32',
	flash: true,
	flashTone: '#fdeaea',
	flashback: true,
	tone: 'conquest romance',
	subtitle: '호동',
	logline: {
		en: 'A drum that screams. A girl who loves a boy from the other side of it.',
		ko: '소리 지르는 북. 그 건너편 사내를 사랑한 소녀.'
	},
	badges: ['flag:goguryeo'],
	music: 'Founding',
	title: 'Hodong',
	place: 'nakrang',
	kinds: ['founding', 'love'],
	images: [
		img(
			'hodong-pine-yard',
			'The ridge had a king',
			'Packed-earth pine yard: Song Yang small under a giwa hall, Jumong mid-draw, Sosuno on the rail. ONE device: the hall axis.',
			['jumong', 'sosuno', 'songyang'],
			'#e8563f'
		),
		img(
			'hodong-one-shaft',
			'I came for three men',
			'Jumong looses one shaft across a pine yard. Song Yang’s arrow falls short. Friends waiting at the gate.',
			['jumong', 'songyang'],
			'#e8563f'
		),
		img(
			'hodong-wet-fields',
			'I found something',
			'Wet Fields marsh at dusk: Hodong and the princess at a stream, two-shot, one waterline.',
			['hodong', 'nakrangso'],
			'#d4563a'
		),
		img(
			'hodong-drum',
			'Smash the drum',
			'Night hall: the princess cuts a great drum skin, Choi Ri in the doorway, one lamp.',
			['nakrangso', 'choiri'],
			'#c9a06a'
		),
		img(
			'hodong-sword',
			'If I answer that',
			'Hodong falls on his sword in a dark Goguryeo hall. Daemusin frozen. ONE device: the blade as a hard line.',
			['hodong', 'daemusin'],
			'#C30000'
		)
	],
	blocks: [
		p('You saw the moon. I skipped the friends.', '달은 봤다. 벗들은 건너뛰었다.'),
		p('The three friends took the ridge. The ridge had a king.', '벗 셋이 능선을 잡았다. 능선에는 왕이 있었다.'),
		scene('Pine Kingdom', '소나무 나라'),
		map(
			-36,
			['pine_kingdom', 'jolbon'],
			'A pine roof beside a new country. The friends are under it.',
			'새 나라 옆의 소나무 지붕. 벗들이 그 아래 있다.'
		),
		place('pine_kingdom', 'Pines. Packed earth. One giwa hall. That is the whole country.', '소나무. 다진 흙. 기와 대청 하나. 나라가 그것이다.'),
		card('songyang', 'The pine king. He had the name first.', '소나무 나라의 왕. 이름은 그가 먼저였다.'),
		p(
			'Jumong comes as a king now. Sosuno walks the rail the way she used to walk a ledger. The three friends are in the yard, not quite guests, not quite allowed to leave.',
			'주몽은 이제 왕으로 온다. 소서노는 한때 장부를 걷던 방식으로 난간을 걷는다. 벗 셋이 마당에 있다. 손님도 아니고, 나가라는 말도 아직 없다.'
		),
		d('jumong', ['세 사람 데리러 왔소.', '나무는 가져가시오.'], ['I came for three men.', 'You can keep the trees.']),
		d(
			'songyang',
			['나무에 이름이 있소.', '당신이 알에서 나오기 전부터.'],
			['The trees have a name.', 'They had it before you hatched.']
		),
		d('sosuno', ['세 사람.', '이름 말고.'], ['The three.', 'Not the name.']),
		p('Song Yang looks at the rail. He looks at the exile who is somehow wearing a hall.', '송양이 난간을 본다. 대청을 걸친 망명자를 본다.'),
		d('songyang', ['한 발.', '내가 짧으면, 지붕은 당신 것이오.'], ['One shaft.', 'If mine falls short, the roof is yours.']),
		d('jumong', ['좋소.', '짧을 거요.'], ['Fine.', 'Yours will.']),
		p(
			'He grins when he says it. He is always like this until he isn’t. The string goes. Song Yang’s shaft kisses dirt. Jumong’s is in the post.',
			'그렇게 말하면서 웃는다. 늘 이렇다. 아닐 때까지. 시위가 간다. 송양의 화살은 흙을 문다. 주몽의 것은 기둥에 있다.'
		),
		d('oi', ['됐냐.', '갈게.'], ['That it?', 'We’re going.']),
		d('mari', ['문이 조용하면 그게 더 안 좋거든.'], ['If the gate’s quiet, that’s worse.']),
		d('hyupbo', ['지붕은 남겨.', '우리는 안 남겨.'], ['Leave the roof.', 'Don’t leave us.']),
		d(
			'songyang',
			['가져가시오.', '나무도.', '이름도. 이미 짧은 화살이오.'],
			['Take it.', 'The trees too.', 'The name. The shaft already was.']
		),
		p('One shaft. Three friends. A country with a new roof.', '화살 한 발. 벗 셋. 지붕이 하나 더 생긴 나라.'),
		p('That is how it starts. Not with a speech. With a man who will not miss.', '그렇게 시작한다. 연설이 아니다. 안 빗나가는 사내다.'),
		scene('Wet Fields', '옥저', {
			jump: { year: 32, en: 'Sixty-Eight Years Later…', ko: '육십팔 년 뒤…' }
		}),
		p('The Holy King is gone. His grandson hunts.', '성왕은 없다. 손자가 사냥한다.'),
		map(
			32,
			['okjeo', 'nakrang', 'gungnae'],
			'East-sea pantry, then a commandery that still drums.',
			'동해의 곳간, 그리고 아직 북을 치는 군현.'
		),
		card('daemusin', 'Yuri’s son. He hunts the way other kings sit.', '유리의 아들. 다른 왕들이 앉는 방식으로 사냥한다.'),
		d('daemusin', ['호동.', '저쪽이다.', '물고기가 아니라.'], ['Hodong.', 'That way.', 'Not the fish.']),
		d('hodong', ['아비가 물고기를 싫어해서요.', '알겠어요.'], ['Because you hate fish.', 'Got it.']),
		p('He grins. Jumong’s grin on a smaller face. Then he rides where he was not told.', '웃는다. 작은 얼굴의 주몽 웃음. 그러고는 가지 말라는 쪽으로 간다.'),
		place('okjeo', 'Marsh. Salt. Cloth. Villages, not a throne.', '늪. 소금. 베. 마을이지 왕좌가 아니다.'),
		scene('The Stream', '여울'),
		p('A girl is washing. She does not look up on purpose.', '소녀가 빨래를 한다. 일부러 안 올려다본다.'),
		card('hodong', 'Daemusin’s boy. Secondary hall. Primary trouble.', '대무신의 아들. 작은 전각. 큰 탈.'),
		d('nakrangso', ['여기 사람 아니죠.'], ['You’re not from here.']),
		d('hodong', ['사냥이요.'], ['Hunting.']),
		d('nakrangso', ['여기 물고기밖에 없는데요.'], ['There’s nothing here but fish.']),
		d('hodong', ['하나 찾았어요.'], ['I found something.']),
		p('She looks up. That is the mistake, if you want to call it that.', '그녀가 올려다본다. 실수라면 실수다.'),
		d('nakrangso', ['낙랑이에요.', '아버지는… 북을 믿어요.'], ['Nakrang.', 'My father… trusts a drum.']),
		d('hodong', ['북이요?'], ['A drum?']),
		d(
			'nakrangso',
			['적이 오면 혼자 울어요.', '그래서 아직 집이 있어요.'],
			['It screams when enemies come.', 'That’s why we still have a house.']
		),
		p('He marries her the way a hunt ends. Fast. Then he goes home, because a prince who stays is a hostage.', '사냥이 끝나듯 장가든다. 빠르다. 그러고는 집으로 간다. 머무는 왕자는 인질이니까.'),
		scene('The Letter', '편지', { jump: { year: 32, en: 'That Autumn…', ko: '그 가을…' } }),
		p('He writes one letter. You already know it is too much letter.', '편지를 한 통 쓴다. 이미 과한 편지인 줄 당신은 안다.'),
		d(
			'hodong',
			['북을 찢어.', '안 찢으면 안 데리러 가.'],
			['Smash the drum.', 'Or I will not take you.']
		),
		p('She reads it twice. The second time is not for the words.', '두 번 읽는다. 두 번째는 글자 때문이 아니다.'),
		d('nakrangso', ['이 짓 하면, 데리러 오는 거죠.', '말했잖아요.'], ['If I do this, you take me.', 'You said.']),
		scene('Nakrang', '낙랑'),
		place('nakrang', 'A commandery with one trick. The trick is a drum.', '재주 하나인 군현. 그 재주가 북이다.'),
		card('choiri', 'Her father. The trick is also his daughter.', '아버지. 재주는 딸이기도 하다.'),
		p('Night. She cuts the skin. The hall goes wrong-quiet.', '밤. 가죽을 벤다. 대청이 잘못 조용해진다.'),
		p('Choi Ri is in the doorway. He does not need to ask who. The silence already did.', '최리가 문간에 있다. 누구냐고 물을 필요가 없다. 고요가 이미 물었다.'),
		d('choiri', ['북이 안 울었다.', '그러니까 안다.'], ['The drum did not sound.', 'So I know who did.']),
		d('nakrangso', ['아버지—'], ['Father—']),
		p('He kills her. Not as a king. As a man who had one trick, and she was it.', '죽인다. 왕으로서가 아니다. 재주가 하나였고, 그게 딸이었던 사내로서.'),
		p('Goguryeo rides in on the silence. Daemusin takes the hall. The pantry, the drum, the roof. He does not take the girl. She is already on the floor.', '그 고요 위로 고구려가 들어온다. 대무신이 대청을 받는다. 곳간, 북, 지붕. 소녀는 못 받는다. 이미 마루에 있으니까.'),
		scene('The Queen’s Door', '왕비의 문'),
		p('That winter the first hall hates the second hall. This is not new. The new part is a story.', '그 겨울, 큰 전각이 작은 전각을 미워한다. 새삼스러울 것 없다. 새삼스러운 건 이야기다.'),
		ds(
			'The queen',
			'f',
			'#8a6a7a',
			['그 아이가 내 문에 왔소.', '임금께서 물을 일은, 그게 다가 아니오.'],
			['That boy came to my door.', 'That is not all you should ask.']
		),
		d('daemusin', ['호동.'], ['Hodong.']),
		d('hodong', ['답하면요.', '우리 어머니가 마루에 납니다.'], ['If I answer that.', 'My mother is on the floor.']),
		d('daemusin', ['답을 안 하면.', '네가 마루다.'], ['If you don’t.', 'You are.']),
		p('He looks at his father the way Jumong once looked at a bow that would not bend. Then he falls on his sword.', '아버지를 본다. 한때 주몽이 안 휘는 활을 보던 눈으로. 그러고는 칼 위로 쓰러진다.'),
		d(
			'kangrim',
			['어라하. 왕자여.', '질문 하나 하고, 갑시다.', '편지를 썼소. 칼 위에 쓰러졌소. 어느 쪽이었소. 그 아이의 남편이었소, 어머니 아들이었소?'],
			['Eraha. Prince.', 'One question, then we walk.', 'You wrote the letter. You fell on the sword. Which were you — her husband, or your mother’s son?']
		),
		d('hodong', ['아들.', '남편은… 북을 찢은 다음에야 되니까.'], ['The son.', 'Husband is… after she cuts the drum.']),
		p('Nakrang has a new roof. The hall is quieter.', '낙랑에 지붕이 하나 생긴다. 대청은 더 조용하다.'),
		p('Goguryeo keeps adding. You already know how large it gets.', '고구려는 계속 더한다. 얼마나 커지는지, 당신은 이미 안다.'),
		p(
			'<b>Back in Surabol, the queen is failing and the council must name who’s next. It only takes one hand to lock the door…!</b>',
			'<b>다시 서라벌. 여왕은 기울고, 화백은 다음 왕을 정해야 한다. 문을 잠그는 데는 손 하나면 충분하다…!</b>'
		)
	]
};

const sound = {
	year: '102–512',
	flash: true,
	flashTone: '#dbe9f8',
	flashback: true,
	tone: 'border judgement',
	subtitle: '음즙벌',
	logline: {
		en: 'Two small kings. One strip of dirt. They ask a third king to count it.',
		ko: '작은 왕 둘. 흙 한 줄. 세 번째 왕에게 세어 달라 한다.'
	},
	badges: ['flag:silla', 'flag:gaya'],
	title: 'Sound Kingdom',
	place: 'sound_kingdom',
	kinds: ['founding'],
	images: [
		img(
			'sound-suro-strip',
			'Two small kings',
			'Suro walking a dirt strip between two small halls, hungry, honest, dusk. ONE device: the strip as a hard line.',
			['suro', 'soundking', 'siljikking'],
			'#e0a33c'
		),
		img(
			'sound-pasa-gate',
			'Judges are for neighbours',
			'Pasa at a timber gate, Sound Kingdom burning behind, one hard key. Not an army catalog.',
			['pasa', 'soundking'],
			'#c4a35a'
		),
		img(
			'usan-wooden-lions',
			'A cliff does not bow',
			'Usan cliff and sea: Isabu’s ships beach wooden lions, island chief on the rock. ONE device: the cliff wall.',
			['isabu', 'usanchief'],
			'#5a7aa8'
		)
	],
	blocks: [
		p('Two small kings. One strip of dirt. They ask a third king to count it.', '작은 왕 둘. 흙 한 줄. 세 번째 왕에게 세어 달라 한다.'),
		scene('The Strip', '그 줄'),
		map(
			102,
			['sound_kingdom', 'siljik', 'apdok', 'surabol'],
			'Jinhan roofs, still arguing over a line you could spit across.',
			'진한의 지붕들. 침 넘어갈 줄을 놓고 아직 싸운다.'
		),
		place('sound_kingdom', 'The first character is sound. A small roof north of the capital.', '첫 글자가 소리. 도성 북쪽의 작은 지붕.'),
		card('suro', 'You know him. Hunger is honest. He still meets it himself.', '아는 사람이다. 배고픔은 정직하다. 아직 직접 만난다.'),
		d('suro', ['누구 흙이오.'], ['Whose dirt.']),
		d('soundking', ['우리 거요.', '저 사람 거요.', '세어 주시오.'], ['Ours.', 'His.', 'Count it.']),
		d('siljikking', ['세면 내 줄이오.', '안 세면 전쟁이고.'], ['If you count, it’s mine.', 'If you don’t, it’s war.']),
		p('Suro walks the strip. He does not enjoy being a judge. He enjoys being asked.', '수로가 그 줄을 걷는다. 심판이 좋아서가 아니다. 물어 봐서가 좋다.'),
		d(
			'suro',
			['이쪽은 소리가 나고.', '저쪽은 곧고.', '줄은… 줄이오.'],
			['This side sounds.', 'That side is straight.', 'The strip is… a strip.']
		),
		d('soundking', ['그래서요.'], ['So.']),
		d('suro', ['소리 쪽에 주오.', '곧은 쪽은 이미 곧으니까.'], ['To the sound.', 'The straight side is already straight.']),
		p('Straight Vale hates the sentence. Sound Kingdom loves it. Neither of them owns the morning after.', '실직은 그 판결이 싫다. 음즙벌은 좋다. 이튿날 아침은 둘 다 못 가진다.'),
		scene('Next Door', '옆집'),
		card('pasa', 'Silla’s king. He lives next door. He does not like judges.', '신라 임금. 옆집에 산다. 심판이 싫다.'),
		d('pasa', ['심판은 이웃이나 하는 거요.', '나는 옆집이오.'], ['Judges are for neighbours.', 'I live next door.']),
		p('He takes Sound Kingdom anyway. The strip does not get a vote.', '그래도 음즙벌을 먹는다. 줄은 투표권이 없다.'),
		d('soundking', ['세어 준다고 했소.', '세었잖소.'], ['You said you would count it.', 'You counted.']),
		d('suro', ['세었소.', '안 들었소.'], ['I counted.', 'He didn’t listen.']),
		p('Straight Vale looks at the empty roof. Held Watch looks at Straight Vale.', '실직이 빈 지붕을 본다. 압독이 실직을 본다.'),
		d('siljikking', ['소리가 없으면 다음이 나요.', '그러니까 다음이 아니오.'], ['If Sound is gone, I am next.', 'So I am not next.']),
		p('They bow. Silla is larger in the morning. The deal is not.', '절한다. 아침의 신라는 더 크다. 약속은 아니다.'),
		scene('Usan', '우산', {
			jump: { year: 512, en: 'Four Hundred Years Later…', ko: '사백 년 뒤…' }
		}),
		map(512, ['usan', 'surabol'], 'An island past the east sea. It trusts its cliffs.', '동해 너머 섬. 벼랑을 믿는다.'),
		place('usan', 'Cliffs. Sea. A chief who has never had to bow.', '벼랑. 바다. 한 번도 절할 일 없던 추장.'),
		card('isabu', 'You’ve seen him. Gaya, later. The army that arrives after the white banner is his.', '본 적 있다. 가야, 나중이다. 흰 깃발 뒤에 도착하는 군대가 그의 것이다.'),
		d('isabu', ['벼랑은 안 절하오.', '이야기는 절하오.'], ['A cliff does not bow.', 'A story does.']),
		p('He beaches wooden lions. Paint, timber, teeth that do not chew. From the cliff they look alive.', '나무 사자를 풀어 내린다. 칠, 나무, 안 씹는 이빨. 벼랑에서 보면 살았다.'),
		d('usanchief', ['저거 안 살았잖아.', '살았다고 하지 마.'], ['Those are not alive.', 'Don’t tell me they are.']),
		d('isabu', ['확인하고 싶소?'], ['Do you want to find out.']),
		p('The island bows. Tribute every year after. Silla has a sea now, and a story that walks off a ship.', '섬이 절한다. 그 뒤로 해마다 바친다. 신라에 바다가 생긴다. 배에서 내려오는 이야기도.'),
		p(
			'<b>Before those lions, two princes were already rent. One man went to fetch them…!</b>',
			'<b>그 사자들보다 먼저, 왕자 둘이 이미 세였다. 데리러 간 사람은 하나였다…!</b>'
		)
	]
};

const jesang = {
	year: '418',
	flash: true,
	flashTone: '#dbe9f8',
	flashback: true,
	tone: 'loyal servant',
	subtitle: '박제상',
	logline: {
		en: 'There was only one man the king could send. He did not come home between the two jobs.',
		ko: '임금이 보낼 수 있는 사람은 하나였다. 그 사람은 두 일 사이에 집에 들르지 않았다.'
	},
	badges: ['flag:silla'],
	title: 'Park Jesang',
	place: 'surabol',
	kinds: ['love'],
	images: [
		img(
			'jesang-nulji-ask',
			'There was only one man',
			'Nulji’s dark hall: Jesang standing, not kneeling, the king asking from the dais. ONE lamp.',
			['nulji', 'jesang'],
			'#8B5A2B'
		),
		img(
			'jesang-sand',
			'You didn’t even turn',
			'Lady Chisul on wet sand, children behind, a boat already small. ONE device: the waterline.',
			['chisul', 'jesang'],
			'#c9a070'
		),
		img(
			'jesang-boat',
			'Then I will wear it',
			'Night fishing boat: Jesang putting on the prince’s coat, Miseheun reaching, one lantern. Intimate two-shot.',
			['jesang', 'miseheun'],
			'#8B5A2B'
		),
		img(
			'jesang-burn',
			'a dog of Silla',
			'Wa yard at night: Jesang standing unbowed, fire prepared, not a torture catalog. One hard key.',
			['jesang'],
			'#8B5A2B'
		),
		img(
			'chisul-ridge',
			'She looks east',
			'Chisullyeong ridge, woman and two small daughters looking at empty sea, Rückenfigur, wash-dissolved edges.',
			['chisul'],
			'#c9a070'
		)
	],
	blocks: [
		p('There was only one man the king could send.', '임금이 보낼 수 있는 사람은 하나였다.'),
		scene('The Thin Hour', '얇은 시각'),
		map(
			418,
			['surabol', 'gungnae', 'usan'],
			'Silla has a king and no brothers in the house. The brothers are the rent.',
			'신라에 임금은 있고 집 안에 아우가 없다. 아우가 세다.'
		),
		card('nulji', 'Naemul’s son. Two brothers gone. A chair that does not sleep.', '내물의 아들. 아우 둘 없고. 잠 안 자는 의자.'),
		d(
			'nulji',
			['고구려에 하나.', '왜에 하나.', '의자만 남았소.'],
			['Goguryeo has one.', 'Wa has the other.', 'I have a chair.']
		),
		card('jesang', 'Park of the south shore. He does not require a second instruction.', '남쪽 나루의 박씨. 두 번 시킬 필요 없는 사람.'),
		d('jesang', ['제가 가겠소.'], ['I can go.']),
		d('nulji', ['데려오시오.', '이유는 가져오지 말고.'], ['Bring them home.', 'Do not bring me a reason.']),
		d('jesang', ['북이 먼저요.', '섬은 그다음이오.'], ['The north first.', 'The island after.']),
		p('He does not say if. He says after.', '만일이라고 하지 않는다. 그다음이라고 한다.'),
		scene('The Gate', '문'),
		card('chisul', 'His wife. Unfinished sentences. Holds the children and the door.', '아내. 문장 이 안 끝나는 사람. 아이와 문을 잡는다.'),
		d('chisul', ['언제.', '언제요.'], ['When.', 'When.']),
		d('jesang', ['북쪽 다음.'], ['After the north.']),
		d('chisul', ['오늘은— 오늘은 문 안에.'], ['Today— today inside the door.']),
		d('jesang', ['들어가면 남아.'], ['If I come in, I stay.']),
		d('chisul', ['그럼 남아.'], ['Then stay.']),
		d('jesang', ['다른 아이가 아직 섬에 있어.'], ['The other boy is still on an island.']),
		p('She does not finish the next sentence. He is already on the road.', '다음 문장을 못 끝낸다. 그는 이미 길 위에 있다.'),
		scene('The Northern Hall', '북쪽 대청'),
		card('jangsu', 'Gwanggaeto’s son. Grants a favour the way weather grants rain.', '광개토의 아들. 비가 내리듯 은혜를 내린다.'),
		p('Jesang asks well. He does not threaten. He does not beg. He counts what the north already has, and what keeping a Silla boy adds.', '제상은 잘 묻는다. 협박하지 않는다. 빌지도 않는다. 북쪽이 이미 가진 것과, 신라 아이 하나가 더하는 것을 센다.'),
		d('jangsu', ['잘 물은 물음도 물음이오.', '데려가시오.'], ['A well-made ask is still an ask.', 'Take him.']),
		card('bokho', 'The older hostage. Tired the way a held boy gets tired.', '형 인질. 붙들린 아이가 지치는 방식으로 지쳐 있다.'),
		d('bokho', ['집에 들르지 않을 거요.', '얼굴이 그래요.'], ['You’re not stopping at your gate.', 'Your face says it.']),
		d('jesang', ['들어가면 안 나옵니다.'], ['If I go in, I don’t come back out.']),
		p('Bokho goes south. Jesang does not. He walks past his own gate as if it were someone else’s.', '복호는 남으로 간다. 제상은 안 간다. 제 문을 남의 문처럼 지나간다.'),
		scene('The Sand', '모래'),
		p('She runs. The children run. The boat is already a mark on the water.', '달린다. 아이들도 달린다. 배는 이미 물 위의 점이다.'),
		d('chisul', ['안 돌아봤어.', '안 돌아봤잖아—'], ['You didn’t even turn.', 'You didn’t even—']),
		p('Her legs will not stand. The sand has them. The story will name that later. Right now it is only a woman who cannot get up.', '다리가 안 선다. 모래가 잡는다. 이야기는 나중에 이름을 붙인다. 지금은 일어서지 못하는 여자일 뿐이다.'),
		d('jesang', ['모래야.', '일어서.', '아이들은— 아이들 먼저.'], ['It’s the sand.', 'Stand up.', 'The children— the children first.']),
		d('chisul', ['그다음.', '그다음이 언제야.'], ['After.', 'When is after.']),
		p('He does not answer. Answering would be stopping. The oars take him.', '대답하지 않는다. 대답이 멈춤이니까. 노가 데려간다.'),
		scene('The Chair', '의자'),
		p('Bokho reaches Surabol. The man who fetched him is already salt.', '복호가 서라벌에 닿는다. 데려온 사람은 이미 소금이다.'),
		d('bokho', ['제 문도 안 들렀소.'], ['He did not even stop at his own gate.']),
		d(
			'nulji',
			['알겠소……', '그의 이름이 영원히 기억되게 하겠소.'],
			['Very well…', 'I’ll make sure his name is remembered for all time.']
		),
		p('He says it too early. The second boat has not left yet.', '너무 일찍 말한다. 두 번째 배는 아직 안 떴다.'),
		scene('The Island', '섬'),
		p('Wa takes a tired Silla lord the way a net takes a fish that swims in on purpose.', '왜는 지친 신라 벼슬을 받는다. 일부러 들어온 물고기를 그물이 받듯.'),
		ds(
			'The Wa king',
			'm',
			'#6a7a8a',
			['신라 사람이, 제 임금이 지겹다.', '편리하군.'],
			['A Silla man, tired of his king.', 'Convenient.']
		),
		d('jesang', ['기다리는 게 지겨웠소.'], ['I was tired of waiting.']),
		p('He fishes. The younger prince is in the boat, because a hostage who fishes is still a hostage, just wetter.', '고기를 잡는다. 어린 왕자가 배에 있다. 낚시하는 인질도 인질이다. 다만 더 젖을 뿐.'),
		card('miseheun', 'The Wa hostage. Wants to stay with the man who came for him.', '왜의 인질. 데리러 온 사람 곁에 있고 싶어 한다.'),
		d('jesang', ['작은 배요.', '오늘 밤.'], ['The small boat.', 'Tonight.']),
		d('miseheun', ['그럼 같이요.', '같이 가요. 지금.'], ['Then we both go.', 'We both go. Now.']),
		d('jesang', ['둘 다 빠지면 둘 다 못 가요.', '공은 작은 배를.'], ['If two leave, neither gets home.', 'You take the small boat.']),
		d(
			'miseheun',
			['저들 배를 빼앗아요.', '군사를 모아 돌아가.', '끝내요.'],
			['We take their ships.', 'We go back with an army.', 'We end it.']
		),
		d('jesang', ['안 되오.', '공은 그 자리에 있어야 하오. 아우가 볼 수 있는 자리.'], ['No.', 'You stay where you are. Where your brother can see you.']),
		d('miseheun', ['저들이 당신을—'], ['They’ll burn you—']),
		d('jesang', ['그러면 나를 태우오. 공은 안 되오.'], ['Then they burn me. Not you.']),
		p('He holds out a hand for the coat. The prince’s Wa coat. From their deck, a man in that coat is still fishing.', '손을 내민다. 왕자의 왜 겉옷. 저들 배에서 보면, 그 옷을 입은 사람이 아직 낚시를 한다.'),
		d('jesang', ['옷을 주시오.'], ['Give me the coat.']),
		d('miseheun', ['그 옷은 무거워요.'], ['That coat is heavy.']),
		d('jesang', ['그래서 제가 입소.'], ['Then I will wear it.']),
		d('miseheun', ['안 돼요, 제상! 당신은……', '그래선 안 돼요……'], ['No, Jesang! You cannot…', 'You must not…']),
		d(
			'jesang',
			['미사흔공……', '공께서는 큰 운명을 지닌 분이시오……! 저는 그저 종일 뿐이오.', '공의 충직한 신하로서 제 이름 석 자를 이야기에 올릴 수 있다면, 그것으로 족하오.'],
			[
				'Lord Miseheun…',
				'You are a man with a great fate…! I am just a servant.',
				'If I can place the three letters of my name onto the stories as your loyal servant, that will be enough for me.'
			]
		),
		p('Miseheun has been a hostage since he was small enough to lift. He has nothing to say to this. His eyes go first.', '미사흔은 안아 올릴 때부터 인질이었다. 그런 그가 이 말 앞에서는 할 말이 없다. 눈이 먼저 무너진다.'),
		d('miseheun', ['그럼 안 가요.'], ['Then I’m not going.']),
		d('jesang', ['가오.'], ['You are.']),
		d('jesang', ['위에서 다시 만납시다. 늦지 않으리다.'], ['We’ll meet again, up there. I won’t be late.']),
		p('The small boat takes the prince. Jesang keeps fishing. From the other deck, nothing has happened yet.', '작은 배가 왕자를 가져간다. 제상은 계속 낚시를 한다. 저쪽 갑판에서 보면, 아직 아무 일도 없다.'),
		scene('The Offer', '자리'),
		p('They notice late. Late is still too soon for him.', '늦게 알아챈다. 늦어도 그에게는 아직 이르다.'),
		ds('The Wa king', 'm', '#6a7a8a', ['앉으시오.', '신하로.'], ['Sit.', 'As a minister.']),
		d('jesang', ['왜의 신하가 되느니, 신라의 개가 되리다.'], ['I’d rather be a dog of Silla than a minister of Wa.']),
		p('They burn him. He does not sit. That is the whole of it.', '태운다. 그는 앉지 않는다. 그게 전부다.'),
		d(
			'kangrim',
			['어라하. 종이여.', '질문 하나 하고, 갑시다.', '왕자 둘을 데려왔소. 섬에 남았소. 어느 쪽이었소. 종이었소, 아우였소?'],
			[
				'Eraha. Servant.',
				'One question, then we walk.',
				'You brought both princes home. You stayed on the island. Which were you — a servant, or a brother?'
			]
		),
		d('jesang', ['개요.', '문이 일이었소.'], ['A dog.', 'The gate was the job.']),
		scene('Chisullyeong', '치술령'),
		place('chisullyeong', 'A shore ridge. East is water. East is Wa.', '나루 능선. 동쪽이 물이다. 동쪽이 왜다.'),
		p('She looks east until looking is all that’s left.', '동쪽으로 본다. 보는 일만 남을 때까지.'),
		d('chisul', ['그다음이…', '그다음이 이거야.'], ['After is…', 'After is this.']),
		p('The ridge keeps her. Later they will say stone. Later than that, a bird. The daughters wait until there is nothing left to wait with.', '능선이 그녀를 지킨다. 나중엔 돌이라 할 것이다. 그보다 나중엔 새. 딸들은 기다릴 것이 없을 때까지 기다린다.'),
		scene('The Name', '이름'),
		p('Miseheun comes home on the small boat. Nulji marries him to Jesang’s second daughter. He names the dead man Deachan, which is a tall chair for a man who would not sit.', '미사흔이 작은 배로 온다. 눌지가 그를 제상의 둘째 딸과 혼인시킨다. 죽은 사람을 대아찬이라 부른다. 앉지 않은 사람에게는 높은 자리다.'),
		d('miseheun', ['제가 배를 탔어요.'], ['I took the boat.']),
		d('nulji', ['타라고 한 거요.'], ['He meant you to.']),
		p(
			'<b>A letter will cross the sea. The man who writes it has already chosen the ending…!</b>',
			'<b>편지가 바다를 건넌다. 그 편지를 쓰는 자는 이미 결말을 골라 두었다…!</b>'
		)
	]
};

function lastP(entry) {
	const blocks = entry.blocks;
	for (let i = blocks.length - 1; i >= 0; i--) {
		if (blocks[i].kind === 'p') return blocks[i];
	}
	return null;
}

function retarget(entry, html, ko) {
	const block = lastP(entry);
	if (!block) throw new Error(`no last p in ${entry.title}`);
	block.html = html;
	block.ko = ko;
}

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const goguryeo = story.find((a) => a.id === 'goguryeo-tang-war');
const sillaArc = story.find((a) => a.id === 'silla-tang-war');
if (!goguryeo || !sillaArc) throw new Error('arcs missing');

const jolbonIdx = goguryeo.entries.findIndex((e) => e.title === 'Jolbon');
const aljiIdx = sillaArc.entries.findIndex((e) => e.title === 'Alji');
if (jolbonIdx < 0 || aljiIdx < 0) throw new Error('slots missing');

if (goguryeo.entries.some((e) => e.title === 'Hodong')) {
	console.log('Hodong already present — skip insert, still retarget?');
} else {
	retarget(
		goguryeo.entries[jolbonIdx],
		'<b>The three friends took the ridge. The ridge had a king…!</b>',
		'<b>벗 셋이 능선을 잡았다. 능선에는 왕이 있었다…!</b>'
	);
	goguryeo.entries.splice(jolbonIdx + 1, 0, hodong);
}

if (sillaArc.entries.some((e) => e.title === 'Sound Kingdom')) {
	console.log('Sound Kingdom already present');
} else {
	retarget(
		sillaArc.entries[aljiIdx],
		'<b>Two small kings. One strip of dirt. They ask a third king to count it…!</b>',
		'<b>작은 왕 둘. 흙 한 줄. 세 번째 왕에게 세어 달라 한다…!</b>'
	);
	sillaArc.entries.splice(aljiIdx + 1, 0, sound, jesang);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('ok', {
	afterJolbon: goguryeo.entries.slice(jolbonIdx, jolbonIdx + 3).map((e) => e.title),
	afterAlji: sillaArc.entries.slice(aljiIdx, aljiIdx + 4).map((e) => e.title)
});
