/** Flesh Hodong / Jamyeonggo as Romeo–Juliet Greek tragedy. Keeps pine annex; rewrites Wet Fields → end. */
import { editStory, entryOf } from './story-ops.mjs';

function d(person, lines, en, extra = {}) {
	return { kind: 'dialogue', person, lines, en, ...extra };
}
function anon(speaker, gender, chip, lines, en) {
	return { kind: 'dialogue', speaker, gender, chip, lines, en };
}
function p(html, ko) {
	return { kind: 'p', html, ko };
}
function scene(label, ko, extra = {}) {
	return { kind: 'scene', label, ko, ...extra };
}
function card(person, caption, ko) {
	return { kind: 'card', person, caption, ko };
}
function place(placeId, html, ko) {
	return { kind: 'place', place: placeId, html, ko };
}

editStory((story) => {
	const e = entryOf(story, 'goguryeo-tang-war', 'Hodong');
	if (!e) throw new Error('Hodong missing');

	e.subtitle = '자명고';
	e.logline = {
		en: 'A drum that screams for the house. A girl who cuts it for a boy. Two houses. One silence. Everybody dies of love.',
		ko: '집을 위해 우는 북. 사내를 위해 그 북을 벤 소녀. 집 둘. 고요 하나. 사랑으로 다 죽는다.'
	};
	e.tone = 'greek tragedy romance';
	e.place = 'nakrang';

	const wet = e.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Wet Fields');
	if (wet < 0) throw new Error('Wet Fields missing');

	const tail = e.blocks.slice(0, wet);
	e.blocks = [
		...tail,
		scene('Wet Fields', '옥저', {
			weather: 'dusk',
			jump: { year: 32, en: 'Sixty-Eight Years Later…', ko: '육십팔 년 뒤…' }
		}),
		p(
			'The Holy King is gone. His grandson hunts the east the way other men hunt meat.',
			'성왕은 없다. 손자가 동쪽을 사냥한다. 다른 사내들이 고기를 잡듯.'
		),
		{
			kind: 'map',
			year: 32,
			places: ['okjeo', 'nakrang', 'gungnae'],
			caption: 'East-sea pantry. Then a commandery that still drums.',
			ko: '동해의 곳간. 그리고 아직 북을 치는 군현.'
		},
		card('daemusin', 'Yuri’s son. He hunts the way other kings sit.', '유리의 아들. 다른 왕들이 앉는 방식으로 사냥한다.'),
		d(
			'daemusin',
			['호동.', '저쪽이다.', '물고기 말고.', '지붕 있는 쪽.'],
			['Hodong.', 'That way.', 'Not the fish.', 'Where the roofs are.']
		),
		d(
			'hodong',
			['아비가 물고기를 싫어해서요.', '알겠어요.', '지붕은… 나중에요.'],
			['Because you hate fish.', 'Got it.', 'Roofs… later.']
		),
		d(
			'daemusin',
			['나중에가 언제냐.', '네가 웃을 때냐.'],
			['When is later.', 'When you grin.']
		),
		d('hodong', ['웃을 때요.', '그럼 지금이네요.'], ['When I grin.', 'So— now.']),
		p(
			'He grins. Jumong’s grin on a smaller face. Then he rides where he was not told, because that is how this house opens doors.',
			'웃는다. 작은 얼굴의 주몽 웃음. 그러고는 가지 말라는 쪽으로 간다. 이 집이 문을 여는 방식이니까.'
		),
		place('okjeo', 'Marsh. Salt. Cloth drying on poles. Villages, not a throne.', '늪. 소금. 장대에 말린 베. 마을이지 왕좌가 아니다.'),

		scene('The Stream', '여울', { weather: 'day' }),
		p(
			'A girl is washing linen at the stream. She does not look up on purpose. He waits until not looking becomes work.',
			'소녀가 여울에서 빨래를 한다. 일부러 안 올려다본다. 안 보는 일이 일이 될 때까지 그는 기다린다.'
		),
		card('hodong', 'Daemusin’s boy. Secondary hall. Primary trouble.', '대무신의 아들. 작은 전각. 큰 탈.'),
		d('nakrangso', ['여기 사람 아니죠.'], ['You’re not from here.']),
		d('hodong', ['사냥이요.', '아비가 보냈는데요.', '물고기는 싫대요.'], ['Hunting.', 'Father sent me.', 'He hates fish.']),
		d(
			'nakrangso',
			['여기 물고기밖에 없는데요.', '그리고 빨래.', '그리고 저를 안 보는 사람.'],
			['There’s nothing here but fish.', 'And washing.', 'And people who don’t look at me.']
		),
		d(
			'hodong',
			['하나 찾았어요.', '빨래하는.', '안 올려다보는.', '그게 제일 힘들어요.'],
			['I found something.', 'Washing.', 'Not looking up.', 'That’s the hard part.']
		),
		d(
			'nakrangso',
			['뭐를요.', '물고기요, 사람이요.', '말 잘하면 저 또 안 봐요.'],
			['What.', 'A fish, or a person.', 'Say it wrong and I stop looking.']
		),
		d(
			'hodong',
			['사람.', '낙소.', '이름 몰라도 그렇게 부를게요.', '올려다보면— 시작이에요.'],
			['A person.', 'Nakso.', 'I don’t know your name yet. I’ll call you that.', 'If you look up— that’s the start.']
		),
		d(
			'nakrangso',
			['올려다보면 끝이에요.', '우리 집은 그래요.', '끝이면… 시작이 없어요.'],
			['If I look up, it’s over.', 'That’s how our house is.', 'If it’s over… there’s no start.']
		),
		d(
			'hodong',
			['그럼 끝 아니에요.', '시작이죠.', '내가 끝이라고 안 하잖아요.'],
			['Then it’s not over.', 'It’s the start.', 'I’m not the one calling it over.']
		),
		p(
			'She looks up. That is the mistake, if you want to call it that. You already know you will.',
			'그녀가 올려다본다. 실수라면 실수다. 당신은 이미 그렇게 부를 줄 안다.'
		),
		card(
			'nakrangso',
			'Nakso. Unnamed in the annal. Named here, because a tragedy needs someone to call.',
			'낙소. 사서엔 이름 없다. 여기선 부른다. 비극엔 부를 이름이 필요하니까.'
		),
		d(
			'nakrangso',
			['낙랑이에요.', '아버지는… 북을 믿어요.', '웃지 마세요.'],
			['Nakrang.', 'My father… trusts a drum.', 'Don’t laugh.']
		),
		d(
			'hodong',
			['안 웃어요.', '북이요?', '북이 사람을 구해요?'],
			['I’m not.', 'A drum?', 'A drum keeps people?']
		),
		d(
			'nakrangso',
			['자명고예요.', '적이 오면 혼자 울어요.', '그래서 아직 집이 있어요.', '그래서 내가 빨래를 여기서 해요.'],
			['Jamyeonggo.', 'It screams when enemies come.', 'That’s why we still have a house.', 'That’s why I wash here.']
		),
		d(
			'hodong',
			['북이 일을 하는 집이 부러워요.', '우리 집은 사람이 울어요.', '대개 아비요.'],
			['I like a house where a drum does the work.', 'In ours, people scream.', 'Usually Father.']
		),
		d(
			'nakrangso',
			['…이름.', '당신 이름.'],
			['…Name.', 'Yours.']
		),
		d(
			'hodong',
			['호동.', '좋은 아이래요.', '이름만.'],
			['Hodong.', 'It means good boy.', 'Just the name.']
		),
		d(
			'nakrangso',
			['호동.', '여기 오면 안 돼요.', '와도…', '오면 또 와요.'],
			['Hodong.', 'You shouldn’t come here.', 'If you do…', 'Come again.']
		),
		p(
			'He comes again. Marsh light. Salt on the wind. She stops pretending not to look. You have seen this kind of party — two people who already know the ending and keep dancing.',
			'또 온다. 늪빛. 바람의 소금. 그녀는 안 보는 척을 그만둔다. 이런 잔치, 당신은 안다 — 끝을 알면서도 추는 춤.'
		),

		scene('Second Stream', '두 번째 여울', { weather: 'dusk' }),
		d(
			'nakrangso',
			['또 왔네요.', '아비가 알면—'],
			['You came again.', 'If Father knows—']
		),
		d(
			'hodong',
			['아비는 지붕만 알아요.', '나는 여울을 알아요.', '당신 손.'],
			['Father only knows roofs.', 'I know this stream.', 'Your hands.']
		),
		d(
			'nakrangso',
			['젖었어요.', '빨래예요.', '말고— 말고 그 눈.'],
			['They’re wet.', 'It’s washing.', 'Stop— stop looking like that.']
		),
		d(
			'hodong',
			['어떤 눈요.', '이 눈요?', '아니면—'],
			['Like what.', 'This?', 'Or—']
		),
		p(
			'He kisses her the way a hunt ends — too fast, then too careful. She cries into it. Not sad. The other kind. The kind that knows a door opened from the inside.',
			'사냥이 끝나듯 입맞춘다 — 너무 빠르다가, 너무 조심스럽다. 그녀는 그 안에 운다. 슬픈 게 아니다. 다른 종류. 안에서 문이 열린 줄 아는 종류.'
		),
		d(
			'nakrangso',
			['호동.', '이러면…', '집이…'],
			['Hodong.', 'If we…', 'The house…']
		),
		d(
			'hodong',
			['집은 나중에.', '지금은 당신.', '낙소.'],
			['House later.', 'You now.', 'Nakso.']
		),
		d(
			'nakrangso',
			['낙소라 부르지 마요.', '사서에 없는 이름이에요.', '부르면… 진짜가 돼요.'],
			['Don’t call me Nakso.', 'That name isn’t in any book.', 'If you say it… it becomes real.']
		),
		d(
			'hodong',
			['진짜예요.', '내가 불렀으니까.'],
			['It is real.', 'I said it.']
		),
		p(
			'She laughs through wet lashes. Then she says the stupid brave thing every tragedy needs.',
			'젖은 속눈썹으로 웃는다. 그러고는 비극이 필요로 하는, 그 어리석고 용감한 말을 한다.'
		),
		d(
			'nakrangso',
			['아버지한테 말해요.', '나… 데려가요.', '북 이야기는 하지 말고.'],
			['Tell my father.', 'Take me.', 'Don’t talk about the drum.']
		),

		scene('The Feast', '혼례', { weather: 'night' }),
		p(
			'He marries her the way a hunt ends. Fast. Choi Ri lets a foreign prince sit at his table, because the boy smiles like weather and the girl already said yes with her eyes.',
			'사냥이 끝나듯 장가든다. 빠르다. 최리는 외국 왕자를 상에 앉힌다. 그 아이가 날씨처럼 웃고, 소녀가 이미 눈으로 허락했으니까.'
		),
		card('choiri', 'Her father. The trick is also his daughter.', '아버지. 재주는 딸이기도 하다.'),
		place(
			'nakrang',
			'A commandery with one trick. The trick hangs in the hall and listens for enemies.',
			'재주 하나인 군현. 그 재주가 대청에 걸려 적을 듣는다.'
		),
		d(
			'choiri',
			['사위가 되면, 북 이야기는 그만하시오.', '북은 우리 집 일이오.', '자명고는— 내 딸보다 오래 이 집을 지켰소.'],
			['Once you are son-in-law, stop talking about the drum.', 'The drum is this house’s work.', 'Jamyeonggo— has kept this house longer than my girl.']
		),
		d(
			'hodong',
			['알겠어요.', '집은 안 가져가요.', '딸만.'],
			['Got it.', 'I’m not taking the house.', 'Just the daughter.']
		),
		d(
			'choiri',
			['딸은 가져가시오.', '북은 두고.', '둘 다 가져가면… 나는 왕이 아니오.'],
			['Take the daughter.', 'Leave the drum.', 'Take both… and I am no king.']
		),
		d(
			'nakrangso',
			['아버지.', '오늘은…', '웃어요.'],
			['Father.', 'Tonight…', 'Smile.']
		),
		d(
			'choiri',
			['웃고 있소.', '보이지 않소?', '등잔 뒤라서.'],
			['I am.', 'Don’t you see?', 'Behind the lamp.']
		),
		p(
			'He is not. You can see that from here. She pretends she cannot, because it is her wedding night, and pretending is a kind of love.',
			'아니다. 여기서도 보인다. 그녀는 못 본 척한다. 혼례밤이니까. 못 본 척도 사랑의 일종이다.'
		),
		d(
			'hodong',
			['낙소.', '울지 마.', '왜 울어.'],
			['Nakso.', 'Don’t cry.', 'Why are you crying.']
		),
		d(
			'nakrangso',
			['좋아서.', '그리고…', '무서워서.', '둘 다예요.'],
			['Because I’m happy.', 'And…', 'Because I’m scared.', 'Both.']
		),
		d(
			'hodong',
			['내가 데리러 올게.', '약속.', '북은 안 건드릴게.', '아비한테 약속했어.'],
			['I’ll come for you.', 'Promise.', 'I won’t touch the drum.', 'I promised your father.']
		),
		d(
			'nakrangso',
			['약속.', '그 말…', '두 번 해.'],
			['Promise.', 'Say it…', 'Again.']
		),
		d('hodong', ['데리러 올게.', '북은 안 건드릴게.'], ['I’ll come for you.', 'I won’t touch the drum.']),
		p(
			'Then he goes home, because a prince who stays is a hostage. She watches the road until it is only marsh. Her hands shake the way linen shakes on a pole.',
			'그러고는 집으로 간다. 머무는 왕자는 인질이니까. 그녀는 길이 늪만 남을 때까지 본다. 손이 떤다. 장대 위 베처럼.'
		),

		scene('The Road', '길', { weather: 'dusk' }),
		d(
			'nakrangso',
			['가지 마.', '하루만.', '하루만 더—'],
			['Don’t go.', 'One day.', 'One more day—']
		),
		d(
			'hodong',
			['하루 더면 인질이야.', '내가 와서 데려갈게.', '기다려.'],
			['One more day and I’m a hostage.', 'I’ll come back for you.', 'Wait.']
		),
		d(
			'nakrangso',
			['기다리면…', '북이 울면?', '네가 올 때 북이 울면?'],
			['If I wait…', 'And the drum screams?', 'If it screams when you come?']
		),
		d(
			'hodong',
			['그때는…', '내가 적이 아니야.', '당신이 알잖아.'],
			['Then…', 'I’m not an enemy.', 'You know that.']
		),
		d(
			'nakrangso',
			['북은 몰라.', '북은 소리만 나.', '사람 안 가려.'],
			['The drum doesn’t know.', 'It only makes sound.', 'It doesn’t pick people.']
		),
		p(
			'He mounts. She holds the rein one breath too long. When she lets go, something in both of them understands the shape of the ending and refuses to name it.',
			'말에 오른다. 그녀는 고삐를 한 숨 너무 오래 잡는다. 놓을 때, 둘 다 끝의 모양을 알고도 이름을 부르지 않는다.'
		),
		d('nakrangso', ['호동.', '돌아와.'], ['Hodong.', 'Come back.']),
		d('hodong', ['돌아와.', '데리러.', '울지 마— 야, 울지 마.'], ['Come back.', 'For you.', 'Don’t cry— hey. Don’t.']),
		p(
			'She cries anyway. Marsh birds lift. The road eats him. You have watched this kind of parting before. It never gets cheaper.',
			'그래도 운다. 늪새가 뜬다. 길이 그를 먹는다. 이런 이별, 전에 봤다. 싸진 적이 없다.'
		),

		scene('The Letter', '편지', {
			weather: 'night',
			jump: { year: 32, en: 'That Autumn…', ko: '그 가을…' }
		}),
		p(
			'He sits with a brush longer than a hunt. Daemusin finds him still sitting. The hall is dark except for one lamp — the kind that makes a boy look older than he is.',
			'사냥보다 오래 붓을 잡고 앉아 있다. 대무신이 그래도 앉아 있는 그를 찾는다. 대청은 등잔 하나. 아이를 나이 들어 보이게 하는 종류.'
		),
		d('daemusin', ['사냥이 글씨가 됐냐.', '얼굴이 왜 그 모양이냐.'], ['The hunt learned letters?', 'Why is your face like that.']),
		d(
			'hodong',
			['북이요.', '그 북만 없으면 집이 열려요.', '낙소가… 기다려요.'],
			['A drum.', 'Without that drum the house opens.', 'Nakso is… waiting.']
		),
		d(
			'daemusin',
			['북을 네가 찢을 거냐.', '아니면 시킬 거냐.', '말 조심해. 사위가 시킨 일은 사위의 일이다.'],
			['Will you cut it.', 'Or have it cut.', 'Careful. What a son-in-law orders is still his.']
		),
		d(
			'hodong',
			['데리러 가려면…', '아비가 지붕을 원하잖아요.', '북이 있으면 못 가요.'],
			['To go get her…', 'You want the roof.', 'With the drum I can’t.']
		),
		d(
			'daemusin',
			['내가 지붕을 원하지.', '네가 딸을 원하지.', '둘 다 가지려면 누가 무엇을 베느냐.'],
			['I want the roof.', 'You want the girl.', 'To have both — who cuts what.']
		),
		p(
			'He writes one letter. You already know it is too much letter. Greek tragedy starts like this: someone asks love to do the work of a knife.',
			'편지를 한 통 쓴다. 이미 과한 편지인 줄 당신은 안다. 그리스 비극은 이렇게 시작한다 — 사랑더러 칼 일을 시키면서.'
		),
		d(
			'hodong',
			['북을 찢어.', '안 찢으면 안 데리러 가.', '…미안하다.', '그래도 찢어.'],
			['Smash the drum.', 'Or I will not take you.', '…I’m sorry.', 'Still. Smash it.']
		),
		p(
			'He sits with the finished letter until the lamp dies. He does not rewrite it. Brave boys rarely do.',
			'등잔이 죽을 때까지 다 쓴 편지를 들고 앉아 있다. 다시 쓰지 않는다. 용감한 아이들은 대개 다시 안 쓴다.'
		),

		scene('Her Room', '그녀의 방', { weather: 'night' }),
		p(
			'She reads it twice. The first time for the words. The second time for the boy who wrote them with a shaking hand she can feel through the ink.',
			'두 번 읽는다. 첫 번째는 글자. 두 번째는, 잉크 너머로 느껴지는 떨리는 손을 가진 사내 때문에.'
		),
		d(
			'nakrangso',
			['북을 찢어.', '안 찢으면 안 데리러 가.', '…호동.', '그게 사랑이예요?', '그게?'],
			['Smash the drum.', 'Or I will not take you.', '…Hodong.', 'Is that love?', 'Is it?']
		),
		p(
			'She folds it. Unfolds it. Cries into the sleeve she washed at the stream the first day. The drum hangs in the hall below, listening to nothing, which is worse than listening to enemies.',
			'접었다 편다. 첫날 여울에서 빤 소매에 운다. 아래 대청의 북은 아무것도 듣지 않는다. 적을 듣는 것보다 그게 더 나쁘다.'
		),
		d(
			'nakrangso',
			['아버지.', '집이.', '북이.', '나.', '뭐를 남겨.'],
			['Father.', 'House.', 'Drum.', 'Me.', 'What do I keep.']
		),
		d(
			'nakrangso',
			['이 짓 하면, 데리러 오는 거죠.', '말했잖아요.', '약속.', '두 번 했잖아요.'],
			['If I do this, you take me.', 'You said.', 'Promise.', 'You said it twice.']
		),
		p(
			'She stands. Night holds its breath with her. Romeo asked Juliet to die for a name. This boy asked her to kill a sound.',
			'일어선다. 밤이 그녀와 숨을 참는다. 로미오는 줄리엣더러 이름 때문에 죽으라 했다. 이 사내는 소리 하나를 죽이라 했다.'
		),

		scene('Jamyeonggo', '자명고', { weather: 'night' }),
		place(
			'nakrang',
			'Night hall. One lamp. The self-sounding drum fills half the dark — hide stretched taut, a throat the house has trusted for a generation.',
			'밤 대청. 등잔 하나. 자명고가 어둠의 반을 채운다 — 팽팽한 가죽, 집이 한 세대 믿어 온 목구멍.'
		),
		d(
			'nakrangso',
			['미안해.', '북아.', '네가 울면 집이 살았어.', '오늘은… 내가 울게.'],
			['I’m sorry.', 'Drum.', 'When you screamed, the house lived.', 'Tonight… I’ll scream.']
		),
		p(
			'She cuts the skin. The blade catches. The hide sighs. The hall goes wrong-quiet — the kind of quiet that makes the walls lean in. A house that has always had a sound does not know what to do with none.',
			'가죽을 벤다. 날이 걸린다. 가죽이 한숨을 쉰다. 대청이 잘못 조용해진다 — 벽이 기울어 듣는 고요. 늘 소리가 있던 집은 없는 소리를 어떻게 해야 할지 모른다.'
		),
		p(
			'Choi Ri is in the doorway. He does not need to ask who. The silence already did.',
			'최리가 문간에 있다. 누구냐고 물을 필요가 없다. 고요가 이미 물었다.'
		),
		d(
			'choiri',
			['북이 안 울었다.', '그러니까 안다.', '낙소야.'],
			['The drum did not sound.', 'So I know who did.', 'Nakso.']
		),
		d(
			'nakrangso',
			['아버지—', '데리러 온대요.', '그래서—', '사랑해서—'],
			['Father—', 'He’s coming for me.', 'So—', 'Because I love—']
		),
		d(
			'choiri',
			['그래서 이 집을 열었구나.', '내 재주로.', '네 손으로.'],
			['So you opened this house.', 'With my trick.', 'With your hands.']
		),
		d(
			'nakrangso',
			['데려가요.', '저를.', '북은… 이미…', '아버지, 칼— 칼 내려요—'],
			['Take me.', 'Me.', 'The drum is… already…', 'Father, the knife— put it down—']
		),
		d(
			'choiri',
			['내려놓으면 누가 이 고요를 책임지느냐.', '사위냐.', '너냐.', '나냐.'],
			['If I put it down, who owns this silence.', 'Your husband.', 'You.', 'Me.']
		),
		d(
			'nakrangso',
			['나예요.', '나.', '아버지—', '사랑해요.', '아버지도.', '호동도.', '둘 다—'],
			['Me.', 'Me.', 'Father—', 'I love you.', 'You too.', 'Hodong too.', 'Both—']
		),
		d(
			'choiri',
			['둘 다는 안 된다.', '왕은 하나를 고른다.', '나는…', '집을 고른다.'],
			['You don’t get both.', 'A king picks one.', 'I…', 'Pick the house.']
		),
		p(
			'He kills her. Not as a king. As a man who had one trick, and she was it, and love made her cut it open. His hands shake after. Kings are not supposed to shake. He does anyway.',
			'죽인다. 왕으로서가 아니다. 재주가 하나였고, 그게 딸이었으며, 사랑이 그걸 가르게 한 사내로서. 그 다음 손이 떤다. 왕은 떨면 안 된다. 그래도 떤다.'
		),
		d(
			'choiri',
			['낙소야.', '미안하다.', '북이…', '안 울어서…'],
			['Nakso.', 'I’m sorry.', 'The drum…', 'Didn’t sound…']
		),
		p(
			'He holds her the way he held her when she was small enough to fit under the drum’s shadow. You are not supposed to cry at a conquest. Cry anyway. This is that kind of story.',
			'북 그늘 아래 들어가던 작을 적처럼 안고 있다. 정복에서 울면 안 된다. 그래도 울어라. 이런 이야기다.'
		),

		scene('The Silence', '고요', { weather: 'dawn' }),
		p(
			'Goguryeo rides in on the silence. Daemusin takes the hall. The pantry, the drum, the roof. He does not take the girl. She is already on the floor.',
			'그 고요 위로 고구려가 들어온다. 대무신이 대청을 받는다. 곳간, 북, 지붕. 소녀는 못 받는다. 이미 마루에 있으니까.'
		),
		d('daemusin', ['호동.', '그 아이는.'], ['Hodong.', 'The girl.']),
		d(
			'hodong',
			['북을 찢었어요.', '내가 시켰어요.', '내가—', '낙소.', '낙소야—'],
			['She cut it.', 'I asked.', 'I—', 'Nakso.', 'Nakso—']
		),
		p(
			'He goes to his knees in a conquered hall. He holds what is left of the promise. The letter is still in her sleeve. You can read the shake in the brush even from here.',
			'정복된 대청에서 무릎을 꿇는다. 약속의 남은 것을 안다. 편지는 아직 소매에 있다. 여기에서도 붓의 떨림이 읽힌다.'
		),
		d(
			'hodong',
			['미안해.', '미안해.', '데리러 온다고—', '약속—', '두 번—'],
			['I’m sorry.', 'I’m sorry.', 'I said I’d come—', 'Promise—', 'Twice—']
		),
		d(
			'daemusin',
			['일어나.', '지붕은 받았다.', '아이는…', '아이가 아니다.'],
			['Get up.', 'We have the roof.', 'The girl is…', 'Not a girl anymore.']
		),
		d(
			'hodong',
			['내 아내예요.', '이름 있어요.', '낙소.', '사서에 없어도—'],
			['My wife.', 'She has a name.', 'Nakso.', 'Even if no book—']
		),
		p(
			'Daemusin does not answer. A roof is a roof. A boy is something else. He puts a hand on his son’s shoulder and leaves it there too long, which is the closest this hunt-king gets to weeping in public.',
			'대무신은 대답하지 않는다. 지붕은 지붕이다. 아이는 다른 것이다. 아들의 어깨에 손을 올리고 너무 오래 둔다. 이 사냥왕이 사람들 앞에서 우는 일에 제일 가까운 것.'
		),

		scene('The Queen’s Door', '왕비의 문', {
			weather: 'night',
			jump: { year: 32, en: 'That Winter…', ko: '그 겨울…' }
		}),
		p(
			'That winter the first hall hates the second hall. This is not new. The new part is a story about a boy who came to a door he should not have.',
			'그 겨울, 큰 전각이 작은 전각을 미워한다. 새삼스러울 것 없다. 새삼스러운 건 이야기다 — 가면 안 될 문에 간 아이.'
		),
		anon(
			'The queen',
			'f',
			'#8a6a7a',
			['그 아이가 내 문에 왔소.', '임금께서 물을 일은, 그게 다가 아니오.', '작은 전각의 어미가… 부추겼소.'],
			['That boy came to my door.', 'That is not all you should ask.', 'The mother in the second hall… put him up to it.']
		),
		d('daemusin', ['호동.', '답을 해.', '지금.'], ['Hodong.', 'Answer.', 'Now.']),
		d(
			'hodong',
			['답하면요.', '우리 어머니가 마루에 납니다.', '낙소가 이미…', '또 한 사람을요?'],
			['If I answer that.', 'My mother is on the floor.', 'Nakso already…', 'One more person?']
		),
		d(
			'daemusin',
			['답을 안 하면.', '네가 마루다.', '아비로서 말한다.'],
			['If you don’t.', 'You are.', 'I say this as your father.']
		),
		d(
			'hodong',
			['그럼 나예요.', '어머니는 아니에요.', '낙소도…', '이미 아니고요.'],
			['Then me.', 'Not her.', 'Nakso…', 'Already isn’t.']
		),
		d(
			'daemusin',
			['호동.', '웃어 봐라.', '한 번만.'],
			['Hodong.', 'Grin.', 'Once.']
		),
		d(
			'hodong',
			['못 해요.', '여울에서…', '다 썼어요.'],
			['I can’t.', 'At the stream…', 'I used it up.']
		),
		p(
			'He looks at his father the way Jumong once looked at a bow that would not bend. Then he falls on his sword — clean, quiet, a boy finishing a letter he should never have sent.',
			'아버지를 본다. 한때 주몽이 안 휘는 활을 보던 눈으로. 그러고는 칼 위로 쓰러진다 — 깔끔하고, 고요하게. 보내지 말았어야 할 편지를 끝내는 아이처럼.'
		),
		d(
			'daemusin',
			['호동.', '호동아.', '일어나.', '지붕은…', '지붕은 됐으니까—'],
			['Hodong.', 'Hodong.', 'Get up.', 'The roof…', 'We already have the roof—']
		),
		p(
			'The hunt-king kneels. You are allowed to hate him a little for the letter he did not stop, and love him a little for the sound he makes now. Both are true.',
			'사냥왕이 무릎을 꿇는다. 막지 않은 편지 때문에 조금 미워해도 된다. 지금 내는 소리 때문에 조금 사랑해도 된다. 둘 다 참이다.'
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
			['아들.', '남편은…', '북을 찢은 다음에야 되니까.', '나는…', '글자만 보냈어.'],
			['The son.', 'Husband is…', 'after she cuts the drum.', 'I…', 'only sent words.']
		),
		p(
			'Nakrang has a new roof. The hall is quieter than any conquered hall should be. Somewhere a cut drum hangs and remembers how to scream, and does not.',
			'낙랑에 지붕이 하나 생긴다. 대청은 정복된 대청치고 너무 조용하다. 어딘가 벤 북이 걸려, 우는 법을 기억하고, 울지 않는다.'
		),
		p(
			'Goguryeo keeps adding. You already know how large it gets. You will not forget the girl who traded a scream for a promise.',
			'고구려는 계속 더한다. 얼마나 커지는지, 당신은 이미 안다. 약속을 위해 비명을 판 소녀는, 잊지 마라.'
		),
		p(
			'<b>Back in Surabol, the queen is failing and the council must name who’s next. It only takes one hand to lock the door…!</b>',
			'<b>다시 서라벌. 여왕은 기울고, 화백은 다음 왕을 정해야 한다. 문을 잠그는 데는 손 하나면 충분하다…!</b>'
		)
	];

	// Image slots — keep pine stills; replace romance/tragedy set
	const pine = (e.images || []).filter((i) => i.id.startsWith('hodong-pine') || i.id.startsWith('hodong-one'));
	e.images = [
		...pine,
		{
			id: 'hodong-stream-look',
			at: 'If I look up, it’s over',
			alt: 'Wet Fields stream: Nakso looks up at Hodong for the first time — intimate two-shot, waterline device, tears held back.',
			people: ['hodong', 'nakrangso'],
			tone: '#c9a06a',
			ratio: 2,
			time: 'day',
			nsfw: false,
			prompt: ''
		},
		{
			id: 'hodong-marsh-kiss',
			at: 'He kisses her the way a hunt ends',
			alt: 'Dusk marsh: Hodong kisses Nakso — skin-forward intimate, tears on lashes, one waterline.',
			people: ['hodong', 'nakrangso'],
			tone: '#d4563a',
			ratio: 2,
			time: 'dusk',
			nsfw: false,
			prompt: ''
		},
		{
			id: 'hodong-road-parting',
			at: 'Don’t go',
			alt: 'Marsh road dusk: Nakso holds the rein, crying; Hodong mounted — one road device, tears.',
			people: ['hodong', 'nakrangso'],
			tone: '#c9a06a',
			ratio: 2,
			time: 'dusk',
			nsfw: false,
			prompt: ''
		},
		{
			id: 'hodong-letter-lamp',
			at: 'Smash the drum',
			alt: 'Goguryeo night hall: Hodong writing by one lamp, Daemusin in doorway — letter as hard line.',
			people: ['hodong', 'daemusin'],
			tone: '#d4563a',
			ratio: 2,
			time: 'night',
			nsfw: false,
			prompt: ''
		},
		{
			id: 'hodong-letter-tears',
			at: 'Is that love?',
			alt: 'Nakso alone with the letter, crying into her sleeve — ECU face, one lamp, gold hex accent.',
			people: ['nakrangso'],
			tone: '#c9a06a',
			ratio: 2,
			time: 'night',
			nsfw: false,
			prompt: ''
		},
		{
			id: 'hodong-drum-cut',
			at: 'I’m sorry. Drum.',
			alt: 'Night hall: Nakso cuts Jamyeonggo skin mid-stroke, tears; huge drum fills frame — one lamp.',
			people: ['nakrangso'],
			tone: '#c9a06a',
			ratio: 2,
			time: 'night',
			nsfw: false,
			prompt: ''
		},
		{
			id: 'hodong-father-knife',
			at: 'I pick the house',
			alt: 'Greek tragedy: Choi Ri holds Nakso as he kills her — father tears, wrong-quiet hall, cut drum behind.',
			people: ['choiri', 'nakrangso'],
			tone: '#6b7a8a',
			ratio: 2,
			time: 'night',
			nsfw: false,
			prompt: ''
		},
		{
			id: 'hodong-floor',
			at: 'Nakso—',
			alt: 'Dawn conquered hall: Hodong on his knees holding Nakso — letter in sleeve, crushed grief, Daemusin silhouette.',
			people: ['hodong', 'nakrangso', 'daemusin'],
			tone: '#d4563a',
			ratio: 2,
			time: 'dawn',
			nsfw: false,
			prompt: ''
		},
		{
			id: 'hodong-sword',
			at: 'Then me',
			alt: 'Hodong falls on his sword; Daemusin reaches — blade as hard vertical line, tears.',
			people: ['hodong', 'daemusin'],
			tone: '#C30000',
			ratio: 2,
			time: 'night',
			nsfw: false,
			prompt: ''
		}
	];

	console.log('blocks', e.blocks.length, 'images', e.images.length);
});
