/** Magic Drum v2: thwarted gaemamusa approach → romance → condition → plan → final invasion. Princess unnamed. */
import { editStory, entryOf } from './story-ops.mjs';

const d = (person, lines, en, extra = {}) => ({ kind: 'dialogue', person, lines, en, ...extra });
const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko, extra = {}) => ({ kind: 'scene', label, ko, ...extra });
const card = (person, caption, ko) => ({ kind: 'card', person, caption, ko });
const place = (placeId, html, ko) => ({ kind: 'place', place: placeId, html, ko });

editStory((story) => {
	const e = entryOf(story, 'goguryeo-tang-war', 'Hodong');
	if (!e) throw new Error('Hodong missing');

	e.subtitle = '자명고';
	e.logline = {
		en: 'A drum that hears a secret march. A princess who cuts it for a boy. Two houses at war for the east.',
		ko: '몰래 오는 기병을 듣는 북. 사내를 위해 그 북을 벤 공주. 동쪽을 두고 싸우는 집 둘.'
	};
	e.tone = 'greek tragedy romance';
	e.place = 'nakrang';

	const wet = e.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Wet Fields');
	const start = wet >= 0 ? wet : e.blocks.findIndex((b) => (b.html || '').includes('Holy King is gone'));
	if (start < 0) throw new Error('Wet Fields missing');
	const head = e.blocks.slice(0, start);

	e.blocks = [
		...head,
		scene('The East', '동쪽', { weather: 'night', jump: { year: 32, en: 'Sixty-Eight Years Later…', ko: '육십팔 년 뒤…' } }),
		p(
			'Two houses want the same wet east. Goguryeo under a hunt-king. Nakrang under a drum.',
			'집 둘이 같은 동쪽을 원한다. 사냥왕 아래 고구려. 북 아래 낙랑.'
		),
		p(
			'Nakrang was not always a Choi roof. It rose when Koreans threw the Chinese Lelang commandery off this coast. The Choi clan kept what the rebellion won — and kept one trick that screams when enemies come.',
			'낙랑은 처음부터 최씨 집이 아니었다. 이 해안에서 한의 낙랑군을 밀어낸 사람들이 세웠다. 최씨가 그 지붕을 지켰다. 적이 오면 혼자 우는 재주도 함께.'
		),
		{
			kind: 'map',
			year: 32,
			places: ['okjeo', 'nakrang', 'gungnae'],
			caption: 'Goguryeo and Nakrang — rivals for the east-sea pantry.',
			ko: '고구려와 낙랑 — 동해 곳간을 두고 겨룬다.'
		},
		card('daemusin', 'Yuri’s son. He hunts roofs the way other kings sit.', '유리의 아들. 다른 왕들이 앉는 방식으로 지붕을 사냥한다.'),
		card('choiri', 'Choi of Nakrang. The drum is older than his temper.', '낙랑의 최씨. 북이 성미보다 오래됐다.'),

		scene('Secret Approach', '야습', { weather: 'night' }),
		p(
			'Night. Goguryeo sends gaemamusa — horses skirted in lamellar, riders plumed, spears upright — along a path that is supposed to be quiet.',
			'밤. 고구려가 개마무사를 보낸다 — 말까지 비늘갑옷, 투구에 깃, 창을 곧추세운 채. 고요해야 할 길로.'
		),
		p(
			'The path is not quiet. In Choi Ri’s hall the self-sounding drum wakes by itself. Jamyeonggo. No hand on the hide. The whole coast hears it.',
			'길은 고요하지 않다. 최리의 대청에서 자명고가 혼자 깬다. 손도 안 댔다. 해안이 다 듣는다.'
		),
		d(
			'choiri',
			['북이 운다.', '손 댄 사람 없다.', '오면 온다.'],
			['The drum is screaming.', 'Nobody touched it.', 'So they are coming.']
		),
		p(
			'Torches spill from Nakrang. The secret approach is a secret no longer. The gaemamusa break off before the gate. Spears turn. Dust eats the plume-line.',
			'낙랑에서 횃불이 쏟아진다. 야습은 야습이 아니게 된다. 개마무사가 문 앞에서 꺾인다. 창이 돈다. 먼지가 깃줄을 먹는다.'
		),
		d(
			'daemusin',
			['북이냐.', '북이다.', '호동.'],
			['A drum.', 'That drum.', 'Hodong.']
		),
		d(
			'hodong',
			['아비.'],
			['Father.']
		),
		d(
			'daemusin',
			['지붕을 못 열면, 사람을 열어라.', '저쪽이다.', '물고기 말고.'],
			['If the roof won’t open, open a person.', 'That way.', 'Not the fish.']
		),
		p(
			'He grins. Jumong’s grin under blue plates and a red sash. Then he rides where the failed march pointed — into the Wet Fields.',
			'웃는다. 푸른 비늘과 붉은 어깨끈 아래 주몽 웃음. 그러고는 실패한 야습이 가리킨 쪽으로 간다 — 옥저로.'
		),

		scene('The Stream', '여울', { weather: 'day' }),
		place('okjeo', 'Marsh. Salt. Cloth on poles. Villages, not a throne — and a border that just screamed.', '늪. 소금. 장대 위 베. 왕좌가 아닌 마을 — 그리고 방금 운 국경.'),
		p(
			'A girl is washing linen at the stream. She does not look up on purpose. He waits until not looking becomes work.',
			'소녀가 여울에서 빨래를 한다. 일부러 안 올려다본다. 안 보는 일이 일이 될 때까지 그는 기다린다.'
		),
		card('hodong', 'Daemusin’s boy. Secondary hall. Primary trouble.', '대무신의 아들. 작은 전각. 큰 탈.'),
		card('nakrangso', 'The Princess of Nakrang. No given name in the annal. None here either.', '낙랑공주. 사서에 이름 없다. 여기도 없다.'),
		d('nakrangso', ['여기 사람 아니죠.'], ['You’re not from here.']),
		d('hodong', ['사냥이요.', '아비가 보냈어요.', '북 때문에요.'], ['Hunting.', 'Father sent me.', 'Because of a drum.']),
		d(
			'nakrangso',
			['그 북이요.', '자명고.', '어젯밤… 들었어요?'],
			['That drum.', 'Jamyeonggo.', 'Last night… did you hear it?']
		),
		d(
			'hodong',
			['들었어요.', '그래서 왔어요.', '북이 일을 하는 집이 부러워요.'],
			['I heard.', 'That’s why I came.', 'I like a house where a drum does the work.']
		),
		d(
			'nakrangso',
			['웃지 마세요.', '그 북 때문에 아직 집이 있어요.', '올려다보면… 끝이에요.'],
			['Don’t laugh.', 'That drum is why we still have a house.', 'If I look up… it’s over.']
		),
		d(
			'hodong',
			['그럼 끝 아니에요.', '시작이죠.', '이름.'],
			['Then it’s not over.', 'It’s the start.', 'Name.']
		),
		d(
			'nakrangso',
			['없어요.', '공주요.', '그게 다예요.'],
			['I don’t have one.', 'Princess.', 'That’s all.']
		),
		d(
			'hodong',
			['호동.', '좋은 아이래요.', '이름만.'],
			['Hodong.', 'It means good boy.', 'Just the name.']
		),
		p(
			'She looks up. That is the mistake, if you want to call it that.',
			'그녀가 올려다본다. 실수라면 실수다.'
		),

		scene('Second Stream', '두 번째 여울', { weather: 'dusk' }),
		p(
			'He comes again. Marsh light. Salt on the wind. They are already a secret the drum cannot hear.',
			'또 온다. 늪빛. 바람의 소금. 둘은 이미 북이 못 듣는 비밀이다.'
		),
		d('nakrangso', ['또 왔네요.', '아비가 알면—'], ['You came again.', 'If Father knows—']),
		d('hodong', ['아비는 지붕만 알아요.', '나는 여울을 알아요.'], ['Father only knows roofs.', 'I know this stream.']),
		p(
			'He kisses her the way a hunt ends — too fast, then too careful. She cries into it. Not sad. The other kind.',
			'사냥이 끝나듯 입맞춘다 — 너무 빠르다가, 너무 조심스럽다. 그녀는 그 안에 운다. 슬픈 게 아니다. 다른 종류.'
		),
		d(
			'nakrangso',
			['호동.', '데려가요.', '북 이야기는 하지 말고.'],
			['Hodong.', 'Take me.', 'Don’t talk about the drum.']
		),
		d(
			'hodong',
			['결혼은…', '북이 없어진 다음에.', '그때만.'],
			['I marry you…', 'when the drum is gone.', 'Only then.']
		),
		d(
			'nakrangso',
			['뭐라고요.', '다시.', '뭐라고 했어요.'],
			['What.', 'Again.', 'What did you say.']
		),
		d(
			'hodong',
			['북을 없애.', '없으면 데리러 가.', '있으면…', '못 가.'],
			['End the drum.', 'Then I come for you.', 'If it’s still there…', 'I can’t.']
		),
		p(
			'She stares at him the way a person stares at a door that just locked from the inside. Then she runs. Marsh water up her chima. She does not look back.',
			'안에서 잠긴 문을 보듯 그를 본다. 그러고는 달린다. 치마에 늪물이 오른다. 뒤돌아보지 않는다.'
		),
		d(
			'nakrangso',
			['가지 마—', '아니.', '내가 가.', '집에…'],
			['Don’t—', 'No.', 'I’m going.', 'Home…']
		),
		p(
			'She goes back to Nakrang for a while. The drum hangs in the hall and does not explain anything.',
			'한동안 낙랑으로 돌아간다. 대청의 북은 아무것도 설명하지 않는다.'
		),

		scene('Both Houses', '두 집', { weather: 'night' }),
		p(
			'Secrets leak. They always do. Choi Ri hears a Goguryeo boy’s name in his daughter’s mouth. Daemusin hears a Choi girl in his.',
			'비밀은 샌다. 늘 샌다. 최리는 딸 입에서 고구려 아이 이름을 듣는다. 대무신은 아들의 입에서 최씨 소녀를 듣는다.'
		),
		d(
			'choiri',
			['그 아이.', '북을 묻던 아이.', '너한테 뭐라고 했느냐.'],
			['That boy.', 'The one who asked about the drum.', 'What did he say to you.']
		),
		d(
			'nakrangso',
			['아버지—', '사랑해요.', '그래서—'],
			['Father—', 'I love him.', 'So—']
		),
		d(
			'choiri',
			['사랑은 북을 못 연다.', '북은 이 집이다.', '그 아이 이름을 다시 꺼내지 마라.'],
			['Love doesn’t open a drum.', 'The drum is this house.', 'Don’t say his name again.']
		),
		d(
			'daemusin',
			['호동.', '최씨 딸이냐.', '북 있는 집.'],
			['Hodong.', 'A Choi girl.', 'The house with the drum.']
		),
		d(
			'hodong',
			['아비.', '데리러 가고 싶어요.', '북만 없으면—'],
			['Father.', 'I want to go get her.', 'If the drum weren’t—']
		),
		d(
			'queenwon',
			['작은 전각이 또 문을 엽니다.', '임금께서는 지붕을 원하시지요.'],
			['The second hall opens another door.', 'You wanted a roof, Majesty.']
		),
		d(
			'daemusin',
			['지붕을 원하지.', '북을 찢으면 열린다.', '누가 찢느냐.'],
			['I want the roof.', 'Cut the drum and it opens.', 'Who cuts it.']
		),
		p(
			'Daemusin looks at his boy the way a hunt looks at a trap. The plan is already there. Love is the bait.',
			'대무신이 아들을 본다. 사냥이 덫을 보듯. 계획은 이미 있다. 미끼는 사랑이다.'
		),
		d(
			'daemusin',
			['편지 써라.', '북을 없애라.', '그러면 데리러 간다.', '네 입으로.'],
			['Write the letter.', 'End the drum.', 'Then you come for her.', 'In your mouth.']
		),
		d(
			'hodong',
			['아비—', '그건…'],
			['Father—', 'That’s…']
		),
		d(
			'daemusin',
			['네가 이미 말한 거다.', '여울에서.', '다시 써.'],
			['You already said it.', 'At the stream.', 'Write it again.']
		),

		scene('The Letter', '편지', { weather: 'night' }),
		p(
			'He sits with a brush longer than a hunt. One lamp. The letter is the same knife he already put in her hands.',
			'사냥보다 오래 붓을 잡고 앉아 있다. 등잔 하나. 편지는 이미 그녀의 손에 쥐여 준 그 칼이다.'
		),
		d(
			'hodong',
			['북을 찢어.', '안 찢으면 안 데리러 가.', '…미안하다.', '그래도 찢어.'],
			['Smash the drum.', 'Or I will not take you.', '…I’m sorry.', 'Still. Smash it.']
		),
		p(
			'In Nakrang she reads it twice. The second time is not for the words. She has already heard them at the stream.',
			'낙랑에서 두 번 읽는다. 두 번째는 글자 때문이 아니다. 여울에서 이미 들었다.'
		),
		d(
			'nakrangso',
			['이 짓 하면, 데리러 오는 거죠.', '말했잖아요.', '두 번.'],
			['If I do this, you take me.', 'You said.', 'Twice.']
		),

		scene('Jamyeonggo', '자명고', { weather: 'night' }),
		place(
			'nakrang',
			'Night hall. One lamp. Jamyeonggo fills half the dark — the board’s barrel, crimson bands, mallet at its side.',
			'밤 대청. 등잔 하나. 자명고가 어둠의 반을 채운다 — 북통, 붉은 띠, 옆에 북채.'
		),
		d(
			'nakrangso',
			['미안해.', '북아.', '네가 울면 집이 살았어.', '오늘은… 내가 울게.'],
			['I’m sorry.', 'Drum.', 'When you screamed, the house lived.', 'Tonight… I’ll scream.']
		),
		p(
			'She cuts the skin. The blade catches. The hide sighs. The hall goes wrong-quiet.',
			'가죽을 벤다. 날이 걸린다. 가죽이 한숨을 쉰다. 대청이 잘못 조용해진다.'
		),
		p(
			'Choi Ri is in the doorway. He does not need to ask who. The silence already did.',
			'최리가 문간에 있다. 누구냐고 물을 필요가 없다. 고요가 이미 물었다.'
		),
		d(
			'choiri',
			['북이 안 울었다.', '그러니까 안다.'],
			['The drum did not sound.', 'So I know who did.']
		),
		d(
			'nakrangso',
			['아버지—', '데리러 온대요.', '사랑해서—'],
			['Father—', 'He’s coming for me.', 'Because I love—']
		),
		d(
			'choiri',
			['그래서 이 집을 열었구나.', '내 재주로.'],
			['So you opened this house.', 'With my trick.']
		),
		d(
			'nakrangso',
			['칼—', '내려요—', '아버지.'],
			['The sword—', 'Put it down—', 'Father.']
		),
		d(
			'choiri',
			['왕은 하나를 고른다.', '나는 집을 고른다.'],
			['A king picks one.', 'I pick the house.']
		),
		p(
			'He kills her. Not as a king. As a man who had one trick, and she was it.',
			'죽인다. 왕으로서가 아니다. 재주가 하나였고, 그게 딸이었던 사내로서.'
		),

		scene('The Silence', '고요', { weather: 'dawn' }),
		p(
			'Goguryeo rides the silence. Gaemamusa this time in daylight — plumes, barding, spears — through a gate that no longer has a throat.',
			'고구려가 그 고요를 탄다. 이번엔 낮의 개마무사 — 깃, 개마, 창 — 목구멍이 없는 문으로.'
		),
		p(
			'Daemusin takes the hall. The pantry, the drum, the roof. He does not take the girl. She is already on the floor.',
			'대무신이 대청을 받는다. 곳간, 북, 지붕. 공주는 못 받는다. 이미 마루에 있으니까.'
		),
		d('daemusin', ['호동.', '그 아이는.'], ['Hodong.', 'The girl.']),
		d(
			'hodong',
			['북을 찢었어요.', '내가 시켰어요.', '공주—'],
			['She cut it.', 'I asked.', 'Princess—']
		),
		p(
			'He goes to his knees in a conquered hall. The letter is still in her sleeve.',
			'정복된 대청에서 무릎을 꿇는다. 편지는 아직 소매에 있다.'
		),
		d(
			'hodong',
			['미안해.', '데리러 온다고—', '약속—'],
			['I’m sorry.', 'I said I’d come—', 'Promise—']
		),

		scene('The Queen’s Door', '왕비의 문', {
			weather: 'night',
			jump: { year: 32, en: 'That Winter…', ko: '그 겨울…' }
		}),
		p(
			'That winter the first hall hates the second hall. Queen Won brings a story to the door.',
			'그 겨울, 큰 전각이 작은 전각을 미워한다. 원왕후가 문으로 이야기를 가져온다.'
		),
		d(
			'queenwon',
			['그 아이가 내 문에 왔소.', '작은 전각의 어미가… 부추겼소.'],
			['That boy came to my door.', 'The mother in the second hall… put him up to it.']
		),
		d('daemusin', ['호동.', '답을 해.'], ['Hodong.', 'Answer.']),
		d(
			'hodong',
			['답하면요.', '우리 어머니가 마루에 납니다.'],
			['If I answer that.', 'My mother is on the floor.']
		),
		d(
			'daemusin',
			['답을 안 하면.', '네가 마루다.'],
			['If you don’t.', 'You are.']
		),
		d(
			'hodong',
			['그럼 나예요.', '어머니는 아니에요.'],
			['Then me.', 'Not her.']
		),
		p(
			'He looks at his father the way Jumong once looked at a bow that would not bend. Then he falls on his sword.',
			'아버지를 본다. 한때 주몽이 안 휘는 활을 보던 눈으로. 그러고는 칼 위로 쓰러진다.'
		),
		d(
			'kangrim',
			[
				'어라하. 왕자여.',
				'질문 하나 하고, 갑시다.',
				'편지를 썼소. 칼 위에 쓰러졌소. 어느 쪽이었소. 그 아이의 남편이었소, 어머니 아들이었소?'
			],
			[
				'Eraha. Prince.',
				'One question, then we walk.',
				'You wrote the letter. You fell on the sword. Which were you — her husband, or your mother’s son?'
			]
		),
		d(
			'hodong',
			['아들.', '남편은…', '북을 찢은 다음에야 되니까.'],
			['The son.', 'Husband is…', 'after she cuts the drum.']
		),
		p(
			'Nakrang has a new roof. Somewhere a cut drum hangs and remembers how to scream, and does not.',
			'낙랑에 지붕이 하나 생긴다. 어딘가 벤 북이 걸려, 우는 법을 기억하고, 울지 않는다.'
		),
		p(
			'<b>Back in Surabol, the queen is failing and the council must name who’s next. It only takes one hand to lock the door…!</b>',
			'<b>다시 서라벌. 여왕은 기울고, 화백은 다음 왕을 정해야 한다. 문을 잠그는 데는 손 하나면 충분하다…!</b>'
		)
	];

	console.log('blocks', e.blocks.length);
});
