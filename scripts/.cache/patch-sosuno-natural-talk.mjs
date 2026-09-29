import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(path, 'utf8'));
const jumong = story.flatMap((c) => c.entries).find((e) => e.title === 'Jumong');
if (!jumong) throw new Error('Jumong missing');

const p = (html, ko, nsfw) => ({ kind: 'p', html, ko, ...(nsfw ? { nsfw: true } : {}) });
const d = (person, chip, en, lines, nsfw) => ({
	kind: 'dialogue',
	person,
	chip,
	en,
	lines,
	...(nsfw ? { nsfw: true } : {})
});
const dx = (speaker, chip, en, lines) => ({
	kind: 'dialogue',
	speaker,
	chip,
	en,
	lines
});
const scene = (label, ko) => ({ kind: 'scene', label, ko });

const J = '#e8563f';
const S = '#e8a04a';
const T = '#a97c4a';

const iCave = jumong.blocks.findIndex((b) => b.html?.includes('He prays at the Jumong cavern'));
const iFive = jumong.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Five Tribes');
if (iCave < 0 || iFive < 0) throw new Error(`markers ${iCave} ${iFive}`);

const mid = [
	scene('The Scouts', '척후'),
	p(
		'He is still wet from the river when the pines stop being empty. Two men in Yeon leather, spears too casual to be hunting, too careful to be lost. <b>Jolbon scouts find him first.</b> The bow is already in the pine needles. His hands are empty and shaking anyway.',
		'강물기가 채 마르기 전에 소나무가 빈 곳이 아니게 된다. 연씨 가죽 두 사람, 사냥이라기엔 창이 너무 대충이고, 길 잃었다기엔 너무 조심스럽다. <b>졸본 척후가 먼저 찾는다.</b> 활은 이미 솔잎 위. 손은 비었는데도 떤다.'
	),
	dx('Scout', '#8d8d95', ['Stop— stop stop—', 'Bow—'], ['서— 서 서—', '활—']),
	dx('Second scout', '#7a7a82', ['I got him I got—', 'Red. That’s not ours.'], ['잡았다 잡—', '빨강이네. 우리 옷 아냐.']),
	d('jumong', J, ['Down. It’s down.', 'Don’t— spear. Please.', 'Water—'], ['내렸어. 내려놨어.', '창— 창만. 제발.', '물—']),
	dx('Scout', '#8d8d95', ['Hands. Hands where I can see.', 'You deaf?'], ['손. 손 보여.', '귀 먹었어?']),
	d('jumong', J, ['Yeah. Yeah look.', 'Just— I ran. River. That’s it.'], ['응. 봐봐.', '그냥— 뛰었어. 강. 그게 다야.']),
	dx(
		'Second scout',
		'#7a7a82',
		['Name. Fast.', 'If Tabal has to come out here I’m blaming you.'],
		['이름. 빨리.', '타발 어른이 여기까지 나오면 너 탓이다.']
	),
	d('jumong', J, ['Jumong.', 'Jumong. That’s— that’s the name.'], ['주몽.', '주몽. 그게— 이름이야.']),
	dx(
		'Scout',
		'#8d8d95',
		['You’ll get Tabal.', 'Walk. If you trip I swear—'],
		['타발 어른께 가게.', '걸어. 넘어지면 진짜—']
	),
	p(
		'They bring him in at dusk, not as a guest. One scout keeps looking back like the pines might grow more men. The valley opens under grey giwa. Tabal is on the porch with a cup he is not drinking. <b>The Jolbon hall is a timber country.</b>',
		'손님으로 데려오지 않는다. 척후 하나가 자꾸 뒤를 본다. 소나무에서 사람이 더 나올까 봐. 회색 기와 아래 골짜기가 열린다. 연타발은 누대에 있다. 잔은 들었는데 안 마신다. <b>졸본 대청은 나무 나라다.</b>'
	),
	scene('Tabal’s Hall', '연타발의 대청'),
	p(
		'<b>Yeon Tabal</b> walks him the packed earth like a man showing a storeroom to a thief. Grain porch, well, pine, five roofs that will not share a yard. No good mat. <b>Tabal shows him the valley like a ledger.</b>',
		'<b>연타발</b>은 도둑에게 곳간 보여 주듯 다진 흙을 걷힌다. 곡식 누대, 우물, 소나무, 마당을 안 나누는 지붕 다섯. 좋은 자리 없다. <b>골짜기를 장부처럼 보여 준다.</b>'
	),
	d('yeontabal', T, ['River dump you?'], ['강이 뱉었냐.']),
	d('jumong', J, ['Yeah.', 'Still wet. Sorry.'], ['예.', '아직 젖었어요. 미안합니다.']),
	d(
		'yeontabal',
		T,
		['Go blood. Bow. Friends?', 'I do not want ash tracked into my hall.'],
		['고씨. 활. 놈들은?', '내 마루에 재 끌어들이고 싶지 않다.']
	),
	d('jumong', J, ['Pines. Hungry. Not dead.', 'I can— I won’t call them. Unless you—'], [
		'소나무요. 배고프고. 안 죽었어요.',
		'부를— 안 부를게요. 원하시면—'
	]),
	d('yeontabal', T, ['Don’t.', 'Shed. You hunt, you eat.', 'My daughter. You look, I dig a ditch.'], [
		'하지 마.',
		'헛간. 사냥하면 밥.',
		'내 딸. 보면 도랑 판다.'
	]),
	d('jumong', J, ['Shed. Hunt. Got it.'], ['헛간. 사냥. 알겠어요.']),
	d('yeontabal', T, ['And wipe that off your face.'], ['그 얼굴 치워.']),
	p(
		'For a week Tabal uses him like a tool he has not paid for. West millet has a boar. Two cousins have a ditch and a knife each. Jumong hits both problems and sits in the dirt until someone tells him to stand. Tabal does not thank him. He just stops inventing work. <b>The millet likes you. I don’t.</b>',
		'일주일 동안 연타발은 값을 안 매긴 연장처럼 그를 쓴다. 서쪽 조에 멧돼지. 사촌 둘은 도랑 하나와 칼 하나씩. 주몽은 둘 다 맞히고 일어서라는 말을 기다리듯 흙에 앉는다. 연타발은 고맙다는 말을 안 한다. 일만 안 만든다. <b>조는 너를 좋아한다. 나는 아니다.</b>'
	),
	d('yeontabal', T, ['The millet likes you. I don’t.', 'Stay anyway.', 'Shed stays the shed.'], [
		'조는 너를 좋아한다. 나는 아니다.',
		'그래도 남아.',
		'헛간은 헛간이다.'
	]),
	d('jumong', J, ['Yes sir.', '…The well’s nicer though.'], ['예.', '…우물이 더 좋긴 해요.']),
	d('yeontabal', T, ['Then go fetch. Out.'], ['그럼 떠. 나가.']),
	p(
		'His daughter <b>Sosuno</b> is already on the grain porch — a widow with two sons, a chieftain’s daughter who has priced every man who walked that packed earth. This one she prices as trouble, out loud. Under the counting-voice she is already too warm. <b>She prices him, then forgets the count.</b>',
		'딸 <b>소서노</b>는 이미 곡식 누대에 있다 — 아들 둘을 둔 과부, 그 다진 흙에 들어온 사내마다 값을 매겨 온 족장의 딸. 이번엔 문제로 값을 매긴다, 소리 내어. 세는 목소리 아래는 이미 덥다. <b>값을 매기다가 세던 것을 잊는다.</b>'
	),
	p(
		'Chin up, she is her father’s hall. Then his red back crosses the yard and the chin fails. Heat at the throat. She turns as if the sacks called her. They did not. <b>She blushes at his back.</b>',
		'턱을 들면 아버지의 대청이다. 그런데 붉은 등이 마당을 가로지르면 턱이 무너진다. 열이 목. 가마니가 부른 척 돈다. 안 불렀다. <b>등 뒤에서 얼굴을 붉힌다.</b>'
	),
	p(
		'The counting-voice says one, two, three. The other voice puts his mouth at her neck. <b>In her head the ledger is not grain.</b> Outside she is already walking away.',
		'세는 목소리는 하나, 둘, 셋. 다른 목소리는 그의 입을 목덜미에 둔다. <b>머릿속 장부는 곡식이 아니다.</b> 겉으로는 이미 간다.'
	),
	d('sosuno', S, ['Father.', 'He’s still— why is he in the yard.'], ['아버지.', '저 사람 아직— 왜 마당에 있어요.']),
	d('yeontabal', T, ['Millet.', 'You counted that twice.', 'Sit. You’re pink.'], ['조.', '그거 두 번 셌다.', '앉아. 빨개.']),
	d('sosuno', S, ['Sun’s in my eyes.', 'I’m not— don’t look at me.'], ['햇빛 때문에요.', '아니— 보지 마세요.']),
	p(
		'She starts calling him names because looking is worse. <b>Big idiot</b> is the one that sticks. He answers to it on the third day, cheerful, which makes it worse. She takes the long way around the yard so their sleeves will not touch, then stands too long at the post he just left.',
		'보기보다 싼 게 욕이라서 욕을 시작한다. <b>큰 바보</b>가 남는다. 사흘째에 그가 그 이름으로 대답한다. 기분 좋게. 그게 더 싫다. 소매가 안 닿게 마당을 멀리 돌아, 그가 막 떠난 기둥 앞에 너무 오래 선다.'
	),
	d('sosuno', S, ['Move.'], ['비키든가.']),
	d('jumong', J, ['Hi.'], ['안녕.']),
	d('sosuno', S, ['Not hi.', 'Around. Big idiot.', "Don't follow me."], ['안녕 아니야.', '돌아가. 이 큰 바보.', '따라오지 마.']),
	d('jumong', J, ['Wasn’t.', 'Well’s that way.'], ['안 따라가.', '우물이 그쪽이야.']),
	d('sosuno', S, ['Other water exists.', 'Use it.'], ['물 다른 데도 있거든.', '거기로.']),
	p(
		'On the second morning she dumps a bucket at his boots and does not bother with slipped. He laughs. She hates where the laugh lands. Then he says it like it is nothing.',
		'이튿날 아침, 두레박을 그의 신에 쏟고 미끄러졌다는 말도 안 한다. 그는 웃는다. 그 웃음이 어디에 떨어지는지 싫다. 그런데 그가 아무것도 아닌 척 말한다.'
	),
	d('sosuno', S, ['Watch it.', 'Or don’t. Drown. Whatever.'], ['조심하든가.', '아니면 빠져 죽든가. 상관없어.']),
	d('jumong', J, ['Hey.', 'You’re pretty when you’re mean.', 'Like— actually. Sorry. Not sorry.'], [
		'야.',
		'화내면 예쁘더라.',
		'진짜. 미안. 안 미안.'
	]),
	d('sosuno', S, ['하—!?', '누가— 예쁘기는—', '그런 거 아니거든!!', 'Big idiot. Go. Go go—'], [
		'하—!?',
		'누가— 예쁘기는—',
		'그런 거 아니거든!!',
		'이 큰 바보. 가. 가 가—'
	]),
	d('jumong', J, ['Going. Going.', 'Sleeve’s wet. Thanks.'], ['가. 가.', '소매 젖었어. 고마워.']),
	p(
		'He wrings the sleeve on the way to the shed. She waits until the yard is empty. Then she hides her whole face in the dusty-rose and stays there, red to the hairline, whispering idiot at nobody until the sacks are a joke.',
		'그는 헛간으로 가며 소매를 짠다. 소서노는 마당이 빌 때까지 기다린다. 그제야 회분홍 소매에 얼굴을 묻고, 머리끝까지 빨개진 채로, 없는 사람을 향해 바보라고 중얼거린다. 가마니가 웃긴 것이 될 때까지.'
	),
	scene('The Well', '우물'),
	p(
		'The well is always the same well: round stone rim, one timber beam across the mouth, hemp rope, two buckets on packed earth, grey giwa hall in the back, grain porch to the left. Nobody stands in the shaft. They keep meeting there as if the rim were a coincidence. <b>The well is an accident she timed.</b>',
		'우물은 늘 그 우물이다. 둥근 돌 테, 입구를 가로지른 나무 들보 하나, 삼 줄, 다진 흙 위 두레박 둘, 뒤의 회색 기와 대청, 왼쪽 곡식 누대. 아무도 우물 안에 서지 않는다. 테두리가 우연인 것처럼 거기서 만난다. <b>우물은 그녀가 맞춘 우연이다.</b>'
	),
	d('jumong', J, ['Rope’s stuck.', 'Want me to—'], ['줄 걸렸어.', '내가—']),
	d('sosuno', S, ['Pull or don’t.', 'Talking doesn’t fill it.', '…Sosuno.', 'There. Now pull.'], [
		'당기든가 말든가.',
		'말로 안 차.',
		'…소서노야.',
		'됐어. 당겨.'
	]),
	d('jumong', J, ['Sosuno.', 'Cute name.', 'Your ears are pink.'], ['소서노.', '이름 귀엽네.', '귓불 분홍이야.']),
	d('sosuno', S, ['Wind.', 'Don’t— look.', '바보 같애. Pull.'], ['바람이야.', '보지— 마.', '바보 같애. 당겨.']),
	d('jumong', J, ['There’s no wind.', 'You waited, huh.'], ['바람 없어.', '기다렸지.']),
	d('sosuno', S, ['I was here first.', 'That’s water.', 'If you mhm I will kill you.', 'Pull.'], [
		'내가 먼저야.',
		'물이야.',
		'음 하면 죽여.',
		'당겨.'
	]),
	p(
		'He keeps ending up thirsty at the same hour. She keeps being there. On the fourth morning he stops pretending the rope is the problem. They are both on packed earth at the rim. <b>He kisses her at the well-beam.</b>',
		'같은 시각에 목이 마르고, 같은 우물에 그녀가 있다. 나흘째 아침에 줄이 문제인 척을 그만둔다. 둘 다 다진 흙, 우물 가. <b>우물 들보에서 입을 맞춘다.</b>'
	),
	p(
		'She does not pull away first. When she turns, the dusty-rose is wet at the waist from the rope and <b>the back is the picture</b> — a look over the shoulder. He is still not in the shaft.',
		'먼저 떼지 않는다. 돌아서면 회분홍이 허리에서 줄에 젖어 있고 <b>등이 그림이다</b> — 넘겨보는 눈. 그는 아직 우물 안이 아니다.',
		true
	),
	d('sosuno', S, ['You—', 'My father’s well—', 'I will kill you.', 'After. Move.'], [
		'너—',
		'아버지 우물에서—',
		'죽여 버릴 거야.',
		'그다음에. 비키든가.'
	]),
	d('jumong', J, ['You kissed back.', 'Just saying.'], ['너도 따라왔거든.', '참고로.']),
	d('sosuno', S, ['Did not.', 'Surprise.', 'The second bucket isn’t full.', 'That’s all I said.'], [
		'안 했어.',
		'놀라서.',
		'둘째 두레박 안 찼어.',
		'그게 다야.'
	]),
	d('jumong', J, ['Okay.', 'Waiting.', 'You’re kinda sexy when you threaten me.', 'I’ll shut up. I’ll shut up.'], [
		'알겠어.',
		'기다릴게.',
		'협박하면 좀 섹시해.',
		'입 닫을게. 닫을게.'
	]),
	d('sosuno', S, ['하!? 그만해— 부끄럽게—', '그런 거 아니거든!!', 'Draw. Go. Go—'], [
		'하!? 그만해— 부끄럽게—',
		'그런 거 아니거든!!',
		'떠. 가. 가—'
	]),
	p(
		'He takes the full bucket and actually goes. She stands at the rim until he is a red speck at the shed. Then both hands over her face, furious, shaking, as if someone else said sexy and it was not him and not her well.',
		'그는 두레박을 들고 진짜 간다. 소서노는 그가 헛간 쪽 붉은 점이 될 때까지 테두리에 선다. 그제야 두 손으로 얼굴을 가린다. 화가 나고, 떨리고, 섹시하다는 말을 다른 놈이 한 것처럼. 우물도 자기 것이 아닌 것처럼.'
	),
	p(
		'He has been collecting her collecting. From the grain-porch post, a cloth: thread, a fletch, well-rope, a scrap of headband. He holds it up. <b>You hide these like a thief.</b>',
		'소서노가 모아 온 것을 주몽이 모아 왔다. 곡식 누대 기둥의 보자기 — 실, 깃, 우물 새끼, 머리띠 조각. 들어 올린다. <b>도둑처럼 숨겼구나.</b>'
	),
	d('jumong', J, ['Hey.', 'Mice don’t fold headbands.', 'You hide these like a thief.'], [
		'야.',
		'쥐가 머리띠를 접진 않거든.',
		'도둑처럼 숨겼구나.'
	]),
	p(
		'She goes so red the dusty-rose looks pale. She snatches and misses. <b>Those are… inventory.</b>',
		'얼굴이 너무 달아 먼지로즈가 창백해 보인다. 뺏으려다 놓친다. <b>재고예요….</b>'
	),
	d('sosuno', S, ['Those are— inventory.', 'Trash. I’ll burn them.', 'Don’t grin. If you grin I— give it—'], [
		'그건— 재고야.',
		'쓰레기. 태울 거야.',
		'웃지 마. 웃으면 나— 내놔—'
	]),
	d('jumong', J, ['You’re beautiful when you lie.', 'Want it back so you can steal it again?'], [
		'거짓말할 때 진짜 예쁘다.',
		'다시 넣어 줄까. 또 훔치게.'
	]),
	d('sosuno', S, ['예쁘기는— 하—', 'Shut up. Big idiot.', 'That’s not— funny—'], [
		'예쁘기는— 하—',
		'닥쳐. 이 큰 바보.',
		'안— 웃겨—'
	]),
	p(
		'He stops smiling. Not angry. Done. He unslings the bow and lays it on packed earth at the well-rim. Then he walks. <b>He leaves the bow on packed earth.</b>',
		'웃음을 접는다. 화가 아니다. 끝이다. 활을 풀어 우물 가 다진 흙 위에 놓는다. 그리고 걷는다. <b>활을 다진 흙 위에 두고 간다.</b>'
	),
	d('jumong', J, ['Keep it.', 'I’m gonna go.', 'Tell the millet thanks.'], ['가져.', '나 갈게.', '조한테 고맙대.']),
	p(
		'She does not call stay. She picks the bow up too fast. One arrow. The timber well-beam beside his ear takes it. He stops. <b>She puts an arrow in the beam.</b>',
		'남으라는 말은 안 한다. 활을 너무 빨리 집는다. 화살 하나. 귀 옆 우물 들보가 받는다. 그가 멈춘다. <b>들보에 화살을 박는다.</b>'
	),
	d('sosuno', S, ['Wait— wait wait—', 'Don’t. Don’t turn around.', 'If you look I can’t—'], [
		'기다려— 잠깐 잠깐—',
		'돌아보지 마.',
		'보면 말 못 해—'
	]),
	p(
		'The confession comes like a tooth she has been biting since the porch. Dirt. Bow. Not his mouth. <b>I wasn’t going to say it.</b>',
		'고백은 누대부터 깨물고 있던 이처럼 나온다. 흙. 활. 입은 안 본다. <b>말하려고 한 적 없어요.</b>'
	),
	d(
		'sosuno',
		S,
		[
			'I wasn’t going to say it.',
			'I was gonna let you leave. Stupid. Fine.',
			'Then you put the bow down and I—',
			'I want you. There. Stay.',
			'Don’t make me— I can’t twice.',
			'Big idiot. Other ear. I swear.'
		],
		[
			'말하려고 한 적 없어.',
			'가게 둘 뻔했어. 바보로. 됐어.',
			'활 내려놓으니까 내가—',
			'원해요. 당신. 남아.',
			'두 번은 못 해. 시키지 마.',
			'이 큰 바보. 다른 귀야. 진짜.'
		]
	),
	d('jumong', J, ['Hey. Hey I’m here.', 'Look. Still here.', 'Come here. You’re shaking.'], [
		'야. 야 나 여기 있어.',
		'봐. 아직이야.',
		'이리 와. 떨리잖아.'
	]),
	p(
		'She hits his chest, once, not hard enough. Then she is on his mouth like she is angry at it. They do not make it to a feast. The grain-room door is closer than pride. <b>The first time is the grain room.</b>',
		'가슴을 한 대 친다. 진심이 되기엔 약하다. 그다음엔 입이 미운 것처럼 그 입에 간다. 잔치까지 못 간다. 자존심보다 곡식방 문이 가깝다. <b>첫밤은 곡식방이다.</b>',
		true
	),
	p(
		'Dusty-rose hiked, her back to him against the sacks. She pulls him in by the collar and tells him she hates him in the same breath. Love and spite in one grip. <b>since the first time</b>',
		'회분홍이 걷히고, 가마니에 등을 댄다. 깃을 잡고 끌어당기면서 미워한다고 한다. 사랑과 미움이 한 손에. <b>처음 본 그날부터</b>',
		true
	),
	d(
		'jumong',
		J,
		['Hate me then.', 'Harder.', 'God you’re— look at you.'],
		['그럼 미워해.', '더.', '진짜— 너 봐봐.'],
		true
	),
	d(
		'sosuno',
		S,
		['I hate you— I hate— don’t you dare stop—', 'Don’t look at me—', 'Don’t say it don’t say—'],
		['미워— 미워— 멈추지 마—', '보지 마—', '말하지 마 말하지—'],
		true
	),
	d('jumong', J, ['You’re so sexy like this.', 'Beautiful. Even mad. Especially mad.'], ['이렇게 섹시해.', '예쁘다. 화내도. 화낼수록.'], true),
	d(
		'sosuno',
		S,
		[
			'Shut up shut up I hate you—',
			'Give me— all of it— don’t you dare pull out—',
			'AHH— DON’T STOP—',
			'DUMB BIG IDIOT—'
		],
		['닥쳐 닥쳐 미워—', '다 줘— 빼지 마—', '아아— 멈추지 마—', '이 멍청한 큰 바보야—'],
		true
	),
	d('jumong', J, ['That’s it—', 'I’ve got you.', 'Take it—'], ['그래—', '잡고 있어.', '받아—'], true),
	p(
		'He spends in her against the grain sacks. She bites his shoulder so she does not have to hear herself. Messy. Dusty-rose ruined at the hip. Love-hate, spent.',
		'곡식 가마니에 대고 싼다. 제 목소리가 듣기 싫어서 그의 어깨를 문다. 지저분하다. 회분홍은 허리에서 망가졌다. 사랑이고 미움이고, 다 씀.',
		true
	),
	d('jumong', J, ['Hey.', 'You’re beautiful.', 'I’m gonna… water. You want?'], ['야.', '예쁘다.', '나… 물. 줄까.']),
	d('sosuno', S, ['Get out.', 'Don’t look at my back.', 'I’m a chieftain’s daughter. I’m not— shy.', 'Out.'], [
		'나가.',
		'등 보지 마.',
		'족장 딸이야. 수줍은 거 아니거든.',
		'나가.'
	]),
	d('jumong', J, ['Okay. Okay.', 'Stay though. I mean— I’ll be right back.', 'You’re shaking again.'], [
		'알겠어. 알겠어.',
		'근데 남아. 아니— 금방 올게.',
		'또 떨리잖아.'
	]),
	d('sosuno', S, ['I said out.', '…Door. Close it.'], ['나가라니까.', '…문. 닫아.']),
	p(
		'The door shuts. She lasts three breaths. Then she slides down the sacks with both palms over her mouth, scarlet, furious at a word he already left in the room. Beautiful. She mouths idiot at the timber until it is safe to stand.',
		'문이 닫힌다. 숨 세 번. 그다음 가마니를 타고 주저앉아 두 손으로 입을 막는다. 새빨개지고, 방에 두고 간 그 단어가 밉다. 예쁘다. 일어서도 될 때까지 들보를 향해 바보라고 입만 움직인다.'
	),
	p(
		'Tabal has been on the porch since before the arrow. Morning makes it public. <b>I am not pleased. I am also not blind.</b>',
		'연타발은 화살 전부터 누대에 있었다. 아침이 되면 공개한다. <b>안 기쁘다. 눈은 있다.</b>'
	),
	d(
		'yeontabal',
		T,
		['The pine.', 'Hundred paces. Now.', 'Hit, he eats. Miss, I throw him.', 'I am not pleased. I am also not blind.'],
		['소나무.', '백 보. 지금.', '맞히면 밥. 빗나가면 내가 내보낸다.', '안 기쁘다. 눈은 있다.']
	),
	p(
		'<b>The pine is a hundred paces.</b> Packed earth. One tree. Sosuno on the porch rail, knuckles white, chin up. The blush is none of the hall’s business.',
		'<b>소나무는 백 보다.</b> 다진 흙. 나무 하나. 소서노는 누대 난간에 있다. 손마디가 하얗다. 턱. 붉어진 얼굴은 대청 일이 아니다.'
	),
	p(
		'The best men hit bark. Tabal hits the knot. Jumong splits Tabal’s arrow down the shaft. <b>The hall hears the wood cry.</b>',
		'장수들은 껍질을 맞힌다. 연타발은 옹이를 맞힌다. 주몽은 그 화살을 자루째 가른다. <b>대청이 나무 우는 소리를 듣는다.</b>'
	),
	d('jumong', J, ['…Yeah.', 'Still here.'], ['…예.', '아직 있어요.']),
	p(
		'Silence. Then Tabal laughs — short, unwilling. Sosuno’s hand is already on the rail.',
		'침묵. 이윽고 연타발이 웃는다 — 짧고, 마지못해. 소서노의 손은 이미 난간에 있다.'
	),
	d('yeontabal', T, ['Eat.', 'Road can wait.', 'My daughter—'], ['먹어.', '길은 나중에.', '내 딸은—']),
	d('sosuno', S, ['The bow is the bow.', 'Don’t.', 'I only— lost the count.', 'Big idiot. Stop smiling.'], [
		'활은 활이고.',
		'보지 마.',
		'그냥— 셈이 틀린 거야.',
		'이 큰 바보. 웃지 마.'
	]),
	d(
		'yeontabal',
		T,
		[
			'Ha.',
			'River was supposed to take him. Daughter ran after it.',
			'Sosuno. You picked. You keep. No feast.',
			'Jumong. Hurt her, bow won’t save you.',
			'Eat. Stay. Grumble like the rest of us.'
		],
		[
			'하.',
			'강이 데려가는 줄 알았더니 딸이 쫓아가네.',
			'소서노. 네가 골랐으면 네가 지켜. 잔치 없다.',
			'주몽. 다치면 활로도 못 막아.',
			'먹어. 남아. 우리처럼 투덜거려.'
		]
	),
	p(
		'The marriage is real hunger first — already spent in the grain room — and only afterwards the alliance Tabal can explain. <b>The ledger stays open longer than it needs to</b>, because neither of them wants to be the first to close it.',
		'혼인은 먼저 진짜 허기다 — 곡식방에서 이미 썼고 — 그다음에야 연타발이 설명할 수 있는 동맹이다. <b>장부는 필요 이상으로 오래 열려 있다</b>. 둘 다 먼저 덮고 싶지 않아서.'
	),
	d('jumong', J, ['Hey.', 'Numbers later.', 'Your throat’s brighter than the lamp. Sorry. Not sorry.'], [
		'야.',
		'숫자는 나중에.',
		'목이 촛불보다 밝아. 미안. 안 미안.'
	]),
	d('sosuno', S, ['Not your wife yet.', 'Don’t— my hands.', 'Counting hand or me.', '…Big idiot.', '그런 거 아니거든.'], [
		'아직 아내 아니거든.',
		'만지지— 손.',
		'세는 손이야, 나야.',
		'…이 큰 바보.',
		'그런 거 아니거든.'
	]),
	d('jumong', J, ['Only you.', 'From the first look.', 'Mouth first.', 'Country later.'], [
		'너만.',
		'처음부터.',
		'입 먼저.',
		'나라는 나중에.'
	]),
	d('sosuno', S, ['Then take it.', 'Don’t put a price on it.', 'I already lost the count.'], [
		'그럼 가져.',
		'값 매기지 마.',
		'난 이미 셈 잃었거든.'
	])
];

jumong.blocks = [...jumong.blocks.slice(0, iCave + 1), ...mid, ...jumong.blocks.slice(iFive)];
writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('natural talk patched', mid.filter((b) => b.kind === 'dialogue').length, 'dialogue beats');
