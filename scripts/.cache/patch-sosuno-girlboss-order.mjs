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
const dx = (speaker, chip, en, lines) => ({ kind: 'dialogue', speaker, chip, en, lines });
const scene = (label, ko) => ({ kind: 'scene', label, ko });

const J = '#e8563f';
const S = '#e8a04a';
const T = '#a97c4a';
const C = '#8d8d95';

const iStart = jumong.blocks.findIndex((b) => b.html?.includes('His daughter <b>Sosuno</b> is already on the grain porch'));
const iFive = jumong.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Five Tribes');
if (iStart < 0 || iFive < 0) throw new Error(`markers ${iStart} ${iFive}`);

const mid = [
	scene('The Hunt Muster', '사냥 점고'),
	p(
		'His daughter <b>Sosuno</b> — a widow with two sons — is already running Jolbon before she has priced the exile. Spear-count. West line. Who eats, who rides. The yard answers her first and her father second. Chin up. Not soft. <b>She is running the hunt.</b>',
		'딸 <b>소서노</b> — 아들 둘을 둔 과부 — 는 망명객의 값을 매기기 전에 이미 졸본을 굴린다. 창 점고. 서쪽 줄. 누가 먹고 누가 탄다. 마당은 아버지보다 그녀에게 먼저 답한다. 턱. 안 부드럽다. <b>사냥을 돌린다.</b>'
	),
	d(
		'sosuno',
		S,
		['West line. Two short.', 'You. Spear. Not that one, the one that isn’t bent.', 'We leave at first light. If you’re late I leave you.'],
		['서쪽 줄. 둘 모자라.', '너. 창. 그거 말고, 안 휜 거.', '새벽에 나간다. 늦으면 두고 가.']
	),
	dx('A hunter', C, ['Yes—'], ['예—']),
	p(
		'Then the wet man is in the yard. Red silk. A back she has not counted. <b>The yard goes quiet.</b> Nobody dropped a spear. They just stopped being loud, because she did.',
		'그때 젖은 사내가 마당에 있다. 붉은 비단. 세지 않은 등. <b>마당이 조용해진다.</b> 창을 떨어뜨린 사람은 없다. 그녀가 먼저 입을 다물어서, 다들 따라 다물었을 뿐이다.'
	),
	p(
		'Chin stays up. Girl-boss face stays on. Inside she is already wrecked. She does not know his father’s name. She knows the line of a shoulder. <b>She prices him, then forgets the count.</b>',
		'턱은 그대로다. 맏딸 얼굴도. 안은 이미 망가졌다. 아버지 이름은 모른다. 어깨 선은 안다. <b>값을 매기다가 세던 것을 잊는다.</b>'
	),
	d('sosuno', S, ['…Next.', 'I said next.', 'Don’t look at me. Look at the line.'], [
		'…다음.',
		'다음이라니까.',
		'나 보지 마. 줄 봐.'
	]),
	p(
		'<b>Little Sosuno is purring</b> so loud she can hear it in her teeth. Hungry. Stupid. Staring at his mouth like it is a job. She keeps the spear-count going with a voice that does not shake. The other voice is not for the yard.',
		'<b>작은 소서노가 그르렁거린다</b>. 이빨까지 들린다. 배고프고. 바보고. 입이 일인 것처럼 본다. 창 점고는 안 떨리는 목소리로 한다. 다른 목소리는 마당 것이 아니다.',
		true
	),
	d(
		'sosuno',
		S,
		[
			'Oh you like him. You like him immediately. Shut up.',
			'Look at that face. That chest. Wet. I could—',
			'Not here. Not with father. Purr quieter. I said quieter—'
		],
		[
			'좋아하네. 바로 좋아하네. 닥쳐.',
			'저 얼굴. 저 가슴. 젖었어. 내가—',
			'여기선 안 돼. 아버지 앞에서. 좀 작게 그르렁거려. 작게—'
		],
		true
	),
	d('yeontabal', T, ['Sosuno.', 'The line.'], ['소서노.', '줄.']),
	d('sosuno', S, ['I have the line.', 'West is short two. I said that.', 'Sun’s in my eyes.'], [
		'줄은 내가 봐요.',
		'서쪽 둘 모자라요. 말했잖아요.',
		'햇빛 때문에요.'
	]),
	p(
		'Chin up, she is her father’s hall. Then his red back crosses the packed earth and the chin fails when nobody is looking. Heat at the throat. <b>She blushes at his back.</b>',
		'턱을 들면 아버지의 대청이다. 붉은 등이 다진 흙을 가로지르면, 보는 사람 없을 때 턱이 무너진다. 열이 목. <b>등 뒤에서 얼굴을 붉힌다.</b>'
	),
	p(
		'The counting-voice says one, two, three. The other voice puts his mouth at her neck. <b>In her head the ledger is not grain.</b> Outside she is already walking away.',
		'세는 목소리는 하나, 둘, 셋. 다른 목소리는 그의 입을 목덜미에 둔다. <b>머릿속 장부는 곡식이 아니다.</b> 겉으로는 이미 간다.'
	),
	p(
		'She starts calling him names because looking is worse. <b>Big idiot</b> is the one that sticks. He answers to it on the third day, cheerful, which makes it worse.',
		'보기보다 싼 게 욕이라서 욕을 시작한다. <b>큰 바보</b>가 남는다. 사흘째에 그가 그 이름으로 대답한다. 기분 좋게. 그게 더 싫다.'
	),
	d('sosuno', S, ['Move.'], ['비키든가.']),
	d('jumong', J, ['Hi.'], ['안녕.']),
	d('sosuno', S, ['Not hi.', 'Around. Big idiot.', "Don't follow me."], ['안녕 아니야.', '돌아가. 이 큰 바보.', '따라오지 마.']),
	d('jumong', J, ['Wasn’t.', 'Well’s that way.'], ['안 따라가.', '우물이 그쪽이야.']),
	d('sosuno', S, ['Other water exists.', 'Use it.'], ['물 다른 데도 있거든.', '거기로.']),
	p(
		'On the second morning she dumps a bucket at his boots and does not bother with slipped. He laughs. Then he says it like it is nothing.',
		'이튿날 아침, 두레박을 그의 신에 쏟고 미끄러졌다는 말도 안 한다. 그는 웃는다. 그런데 아무것도 아닌 척 말한다.'
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
		'He wrings the sleeve on the way to the shed. She waits until the yard is empty. Then she hides her whole face in the dusty-rose, red to the hairline, whispering idiot at nobody.',
		'그는 헛간으로 가며 소매를 짠다. 마당이 빌 때까지 기다린다. 그제야 회분홍에 얼굴을 묻고, 머리끝까지 빨개진 채로, 없는 사람을 향해 바보라고 한다.'
	),

	scene('Upstairs', '윗방'),
	p(
		'She does not stay in the yard. Chin still up, loft stairs two at a time like a woman with grain to count. The window faces the millet. Shirt off. Red silk knotted at the hip. A back doing work. She does not know whose son he is. She knows the muscles. <b>She ogles him from the loft.</b>',
		'마당에 안 남는다. 턱은 올라가 있고, 곡식 세는 여자처럼 다락 계단을 두 칸씩 오른다. 창이 조밭을 본다. 저고리 벗음. 붉은 비단을 허리에. 일하는 등. 누구 아들인지는 모른다. 근육은 안다. <b>다락에서 그를 빤다.</b>',
		true
	),
	p(
		'Dusty-rose hiked. Thighs apart on the timber. One hand over her mouth. The other talking to the part of her that does not run a hunt. <b>Little Sosuno.</b>',
		'회분홍이 걷힌다. 나무 바닥에 다리 벌리고. 한 손은 입. 다른 손은 사냥 안 돌리는 쪽에 말을 건다. <b>작은 소서노.</b>',
		true
	),
	d(
		'sosuno',
		S,
		[
			'Little Sosuno… you’re hungry today aren’t you…',
			'I don’t blame you…. mmm! look at him…',
			'Those big muscles…. chest…. back….',
			'Ah fuck dripping wet again…',
			'Out hunting for meat…',
			'I want you to fill me up with some of that meat….'
		],
		[
			'작은 소서노야… 오늘 배고프지…',
			'이해해…. 음! 저 놈 봐봐…',
			'그 근육…. 가슴…. 등….',
			'아 씨 또 흘러…',
			'고기 잡으러 나갔네…',
			'그 고기 좀 채워 줘….'
		],
		true
	),
	d('yeontabal', T, ['Sosuno!', 'West count. Now.', 'Don’t make me climb.'], ['소서노!', '서쪽 셈. 지금.', '내가 올라가게 하지 마.']),
	p(
		'She freezes mid-breath. Dusty-rose yanked down. Hands wiped on the sleeve like accounts. Stairs. Chin. By the packed earth she is the chieftain’s eldest again. <b>She comes down a different woman.</b>',
		'숨이 중간에 멈춘다. 회분홍을 내린다. 장부 만진 손처럼 소매에 닦는다. 계단. 턱. 다진 흙에선 다시 족장의 맏딸이다. <b>다른 여자로 내려온다.</b>'
	),
	d('sosuno', S, ['West is short two.', 'I counted. Twice.', 'Don’t send the exile. He’ll get lost.'], [
		'서쪽 둘 모자라요.',
		'셌어요. 두 번이요.',
		'망명객 보내지 마세요. 길 잃어요.'
	]),
	d('yeontabal', T, ['He hit the boar.', 'You just don’t like his back.'], ['멧돼지는 맞혔다.', '등짝이 싫은 거지.']),
	d('sosuno', S, ['I don’t like his anything.', 'Can we do the millet.'], ['아무거나 싫어요.', '조나 세요.']),

	scene('Other Daughters', '다른 딸들'),
	p(
		'Word gets out that the exile hits what he aims at and looks like a sun when he works shirtless. Jolbon women find reasons to fetch water. Other chieftains mention daughters. Sosuno is suddenly everywhere those reasons are. <b>She finds a flaw every time.</b>',
		'망명객이 겨눈 걸 맞히고, 저고리 벗으면 해처럼 보인다는 소문이 난다. 졸본 여자들이 물을 뜨러 온다. 다른 족장들이 딸 이야기를 꺼낸다. 소서노는 그 이유들이 있는 곳에 갑자기 있다. <b>매번 흠을 찾는다.</b>'
	),
	dx('A chieftain', C, ['My girl can count.', 'Strong arms. Good hall.'], ['우리 애도 셈해.', '팔 좋아. 대청에 어울려.']),
	d(
		'sosuno',
		S,
		['He walks into buckets.', 'Can’t wring a sleeve. Talks to millet.', 'You’d be bored in a week. Big idiot. Next.'],
		['두레박에 빠져요.', '소매도 못 짜요. 조한테 말 걸어요.', '일주일이면 질려요. 큰 바보예요. 다음.']
	),
	p(
		'At the well three girls laugh too long at something he did not say. Sosuno arrives with an empty bucket she does not need. Chin up. Eldest. The laugh dies.',
		'우물에서 계집 셋이, 그가 안 한 말에 너무 오래 웃는다. 소서노가 필요 없는 빈 두레박을 들고 온다. 턱. 맏딸. 웃음이 죽는다.'
	),
	d('sosuno', S, ['This well’s ours.', 'Ditch is that way.', 'He doesn’t need help. He needs to work.'], [
		'이 우물 우리 거야.',
		'도랑은 그쪽이고.',
		'도움 필요 없어. 일이나 해.'
	]),
	d('jumong', J, ['I was just—'], ['난 그냥—']),
	d('sosuno', S, ['You. Shed.', 'Don’t smile at them.', 'Don’t smile at me either.'], ['너는. 헛간.', '그애들한테 웃지 마.', '나한테도 웃지 마.']),
	p(
		'He waits until the girls are gone. Then he does not go to the shed. He follows her to the grain post and says it like weather. <b>You keep chasing them off.</b>',
		'계집들이 갈 때까지 기다린다. 그런데 헛간으로 안 간다. 곡식 기둥까지 따라와서, 날씨처럼 말한다. <b>자꾸 쫓아내잖아.</b>'
	),
	d(
		'jumong',
		J,
		['So.', 'You keep chasing them off.', 'The well girls. That chieftain’s kid. You told her I talk to millet.'],
		['자.', '자꾸 쫓아내잖아.', '우물 애들. 그 족장 딸. 조한테 말 건다고 했지.']
	),
	d(
		'sosuno',
		S,
		['BECAUSE YOU DO—', 'WHO ASKED YOU—', 'I don’t— they’re in the WAY—', 'This is MY yard— MY well—'],
		['하잖아—!!', '누가 물어봤어—!!', '아니라— 길에 있잖아—', '여긴 내 마당이야— 내 우물이야—']
	),
	d('jumong', J, ['Okay. Okay.', 'You’re screaming.', 'I’m just asking why I can’t say hi.'], [
		'알겠어. 알겠어.',
		'소리 지르고 있거든.',
		'인사하면 안 되는 이유만 물은 거야.'
	]),
	d(
		'sosuno',
		S,
		['DON’T HI THEM.', 'DON’T HI ME.', 'BIG IDIOT. GET— get off my post—'],
		['그애들한테 안녕 하지 마.', '나한테도 하지 마.', '이 큰 바보. 내— 내 기둥에서 떨어져—']
	),
	p(
		'She is <b>screaming mad</b> and pink to the hairline and everyone on the porch can hear the hide crack. He grins. That is worse. She leaves him the post and the well for tomorrow, which is not a coincidence.',
		'<b>소리를 지르며 화났고</b> 머리끝까지 분홍이고, 누대에 있는 사람 누구나 껍질이 깨지는 소리를 듣는다. 그는 웃는다. 그게 더 싫다. 기둥과 내일 우물을 남겨 두고 간다. 우연이 아니다.'
	),

	scene('The Well', '우물'),
	p(
		'The well is always the same well: round stone rim, one timber beam across the mouth, hemp rope, two buckets on packed earth, grey giwa hall in the back, grain porch to the left. Nobody stands in the shaft. They keep meeting there as if the rim were a coincidence. <b>The well is an accident she timed.</b>',
		'우물은 늘 그 우물이다. 둥근 돌 테, 입구를 가로지른 나무 들보 하나, 삼 줄, 다진 흙 위 두레박 둘, 뒤의 회색 기와 대청, 왼쪽 곡식 누대. 아무도 우물 안에 서지 않는다. 테두리가 우연인 것처럼 거기서 만난다. <b>우물은 그녀가 맞춘 우연이다.</b>'
	),
	d('jumong', J, ['Rope’s being a villain.', 'Want me to—'], ['줄이 못됐어.', '내가—']),
	d('sosuno', S, ['Pull or don’t.', 'Talking doesn’t fill it.', 'Don’t look at my face.', '…Sosuno.', 'There. Now pull.'], [
		'당기든가 말든가.',
		'말로 안 차.',
		'얼굴 보지 마.',
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
	d('sosuno', S, ['You—', 'How dare you.', 'My father’s well—', 'I will kill you.', 'After. Move.'], [
		'너—',
		'어떻게 감히.',
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
		'He takes the full bucket and actually goes. She stands at the rim until he is a red speck at the shed. Then both hands over her face, furious, shaking.',
		'그는 두레박을 들고 진짜 간다. 소서노는 그가 헛간 쪽 붉은 점이 될 때까지 테두리에 선다. 그제야 두 손으로 얼굴을 가린다. 화가 나고, 떤다.'
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
		'They do not make it to a feast. The grain-room lamp is closer than pride. <b>The ledger stays open longer than it needs to</b>, because neither of them wants to be the first to close it.',
		'잔치까지 못 간다. 자존심보다 곡식방 등잔이 가깝다. <b>장부는 필요 이상으로 오래 열려 있다</b>. 둘 다 먼저 덮고 싶지 않아서.'
	),
	d('jumong', J, ['Hey.', 'Numbers later.', 'Your throat’s brighter than the lamp. Sorry. Not sorry.'], [
		'야.',
		'숫자는 나중에.',
		'목이 촛불보다 밝아. 미안. 안 미안.'
	]),
	d(
		'sosuno',
		S,
		['I am not your wife yet.', 'Don’t— my hands.', 'Counting hand or me.', '…Big idiot.', '그런 거 아니거든.'],
		['아직 아내 아니거든.', '만지지— 손.', '세는 손이야, 나야.', '…이 큰 바보.', '그런 거 아니거든.']
	),
	d('jumong', J, ['Only you.', 'From the first look.', 'Give me your mouth… first.', 'Country later.'], [
		'너만.',
		'처음부터.',
		'입… 먼저 줘.',
		'나라는 나중에.'
	]),
	d('sosuno', S, ['Then take it.', 'Don’t put a price on it.', 'I already lost the count.'], [
		'그럼 가져.',
		'값 매기지 마.',
		'난 이미 셈 잃었거든.'
	]),
	p(
		'She hits his chest, once, not hard enough. Then she is on his mouth like she is angry at it. <b>The first time is the grain room.</b>',
		'가슴을 한 대 친다. 진심이 되기엔 약하다. 그다음엔 입이 미운 것처럼 그 입에 간다. <b>첫밤은 곡식방이다.</b>',
		true
	),
	p(
		'Dusty-rose hiked, her back to him against the sacks. She pulls him in by the collar and tells him she hates him in the same breath. Then she feels the weight of him and the hate gets specific. Love and spite in one grip. <b>since the first time</b>',
		'회분홍이 걷히고, 가마니에 등을 댄다. 깃을 잡고 끌어당기면서 미워한다고 한다. 그다음 무게를 느낀다. 미움이 구체가 된다. 사랑과 미움이 한 손에. <b>처음 본 그날부터</b>',
		true
	),
	d('jumong', J, ['Hate me then.', 'Harder.', 'God you’re— look at you.'], ['그럼 미워해.', '더.', '진짜— 너 봐봐.'], true),
	d(
		'sosuno',
		S,
		[
			'I hate you— you’re huge— that’s not fair—',
			'Listen. Listen to that. Wet. That’s me. That’s little Sosuno, she—',
			'Don’t you dare stop— she’s trying to eat you—'
		],
		['미워— 커— 반칙이야—', '들어. 그 소리. 젖은 거. 나야. 작은 소서노가—', '멈추지 마— 널 먹으려고 하잖아—'],
		true
	),
	d('jumong', J, ['Little— what?', 'Okay. Okay she’s cute.', 'I’ve got you.'], ['작은— 뭐?', '알겠어. 귀엽네.', '잡고 있어.'], true),
	d(
		'sosuno',
		S,
		[
			'Don’t name her don’t— ah— she can hear you—',
			'Deeper. The sound when you— that slap— I want that—',
			'Those ditch girls would die. They don’t get this. Mine—'
		],
		['이름 부르지 마— 아— 듣거든—', '더 깊이. 그 소리— 그 철썩— 그거 원해—', '도랑 계집들 죽겠지. 이건 못 가져. 내 거—'],
		true
	),
	d('jumong', J, ['You’re so sexy like this.', 'Beautiful. Even mad. Especially mad.'], ['이렇게 섹시해.', '예쁘다. 화내도. 화낼수록.'], true),
	d(
		'sosuno',
		S,
		['Shut up shut up I hate you—', 'Give me— all of it— don’t you dare pull out—', 'AHH— DON’T STOP—', 'DUMB BIG IDIOT—'],
		['닥쳐 닥쳐 미워—', '다 줘— 빼지 마—', '아아— 멈추지 마—', '이 멍청한 큰 바보야—'],
		true
	),
	d('jumong', J, ['That’s it—', 'I’ve got you.', 'Take it—'], ['그래—', '잡고 있어.', '받아—'], true),
	p(
		'He spends in her against the grain sacks. She bites his shoulder so she does not have to hear herself. Messy. Love-hate, spent. Then she hears the loft-voice still in the room.',
		'곡식 가마니에 대고 싼다. 제 목소리가 듣기 싫어서 어깨를 문다. 지저분하다. 사랑이고 미움이고, 다 씀. 그런데 다락 목소리가 아직 방에 있다.',
		true
	),
	d('sosuno', S, ['I didn’t— you didn’t hear that.', 'Little— I don’t have a—', 'Forget it. Get out.'], [
		'그런 말— 안 했어. 못 들었잖아.',
		'작은— 그런 거 없어—',
		'잊어. 나가.'
	], true),
	d('jumong', J, ['I heard.', 'She’s cute.', 'You’re cute. Both of you. I’m keeping you.'], [
		'들었어.',
		'귀엽더라.',
		'너도 귀여워. 둘 다. 둘 다 둘게.'
	], true),
	d(
		'sosuno',
		S,
		['Don’t— don’t be nice.', 'I’ll get stupid.', 'I am not— melting. I’m a chieftain’s daughter. I’m not— shy.', '…Stay. Not because you asked.'],
		['착하게 굴 생각하지 마.', '바보 돼.', '녹는 거 아니거든. 족장 딸이야. 수줍은 거 아니거든.', '…남아. 네가 청해서가 아니야.']
	),
	d('jumong', J, ['Hey.', 'You’re beautiful.', 'Water. You want?'], ['야.', '예쁘다.', '물. 줄까.']),
	d('sosuno', S, ['Get— no. Door. Close it if you go.', 'Don’t look at my back.'], ['나가— 아니. 문. 가면 닫아.', '등 보지 마.']),
	p(
		'He goes for water. The door shuts. She lasts three breaths. Then she slides down the sacks with both palms over her mouth, scarlet, furious at a word he already left. Beautiful. Little Sosuno. She mouths idiot at the timber until it is safe to stand.',
		'물을 뜨러 간다. 문이 닫힌다. 숨 세 번. 그다음 가마니를 타고 주저앉아 두 손으로 입을 막는다. 새빨개지고, 두고 간 그 단어들이 밉다. 예쁘다. 작은 소서노. 일어서도 될 때까지 들보를 향해 바보라고 입만 움직인다.'
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
		'<b>The pine is a hundred paces.</b> Packed earth. One tree. Sosuno on the porch rail, knuckles white, chin up.',
		'<b>소나무는 백 보다.</b> 다진 흙. 나무 하나. 소서노는 누대 난간에 있다. 손마디가 하얗다. 턱.'
	),
	p(
		'The best men hit bark. Tabal hits the knot. <b>He splits Tabal’s arrow down the shaft.</b> <b>The hall hears the wood cry.</b>',
		'장수들은 껍질을 맞힌다. 연타발은 옹이를 맞힌다. <b>그 화살을 자루째 가른다.</b> <b>대청이 나무 우는 소리를 듣는다.</b>'
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
		'The marriage is real hunger first — already spent in the grain room — and only afterwards the alliance Tabal can explain.',
		'혼인은 먼저 진짜 허기다 — 곡식방에서 이미 썼고 — 그다음에야 연타발이 설명할 수 있는 동맹이다.'
	)
];

jumong.blocks = [...jumong.blocks.slice(0, iStart), ...mid, ...jumong.blocks.slice(iFive)];

function upsert(slot) {
	const i = jumong.images.findIndex((im) => im.id === slot.id);
	const row = {
		id: slot.id,
		ratio: 1.778,
		tone: slot.tone ?? '#e8a04a',
		nsfw: !!slot.nsfw,
		at: slot.at,
		alt: slot.alt,
		refs: slot.refs,
		people: slot.people,
		prompt: slot.prompt
	};
	if (i >= 0) jumong.images[i] = { ...jumong.images[i], ...row };
	else jumong.images.push(row);
}

const chJ = '/ch_jumong.png';
const chS = '/ch_sosuno.png';
const bnS = '/bn_sosuno.png';

const slots = [
	{
		id: 'sosuno-seq-hunt-wide',
		at: 'She is running the hunt',
		alt: 'Worm’s-eye: Sosuno poster-scale on packed earth, tiny spear-ranks, dusty-rose, chin up',
		people: ['sosuno'],
		refs: [chS, bnS],
		prompt: 'Minimal iconic 16:9. WORM’S-EYE. Sosuno commanding a hunt muster, chin up, dusty-rose hanbok NOT gold, FACE from ch_sosuno, binyeo. Tiny spear-ranks, no army catalog. ONE device: her spear as a vertical. #e8a04a rim. Jolbon packed earth, grey giwa. High contrast. Cel-painterly. No text.'
	},
	{
		id: 'sosuno-seq-silence-ecu',
		at: 'The yard goes quiet',
		alt: 'ECU: Sosuno’s eyes freeze mid-order; Jumong a red bokeh in the yard',
		people: ['sosuno', 'jumong'],
		refs: [chS, bnS, chJ],
		prompt: 'Minimal iconic 16:9 ECU. Sosuno eyes wide then shuttered, girl-boss face cracking, FACE from ch_sosuno, binyeo, dusty-rose. Jumong red bokeh. ONE device: her eye as the frame. Rack-focus. Cel-painterly. No text.'
	},
	{
		id: 'nsfw-sosuno-first-purr',
		nsfw: true,
		at: 'Little Sosuno is purring',
		alt: 'ECU: Sosuno staring hungry at Jumong’s mouth and chest, heavy blush, wanting',
		people: ['sosuno', 'jumong'],
		refs: [chS, bnS, chJ],
		prompt: 'Intimate 16:9 ECU. Sosuno staring at a man’s face and chest, heavy blush, bitten lip, wanting, FACE from ch_sosuno, binyeo. Jumong wet red silk bokeh. ONE device: her open mouth. Manhwa hunger, not cute. Cel-painterly. No text.'
	},
	{
		id: 'nsfw-sosuno-loft-hike',
		nsfw: true,
		at: 'She ogles him from the loft',
		alt: 'Dutch OTS loft: hiked dusty-rose, thighs apart, looking out at his back in millet',
		people: ['sosuno', 'jumong'],
		refs: [chS, bnS, chJ],
		prompt: 'Intimate 16:9 DUTCH OTS. Sosuno at a loft window, dusty-rose hiked, thighs apart, hand under the chima, looking out, FACE from ch_sosuno, binyeo. Jumong shirtless tiny in millet. ONE device: the window frame. Manhwa wanting. Cel-painterly. No text.'
	},
	{
		id: 'sosuno-seq-scream-mad',
		at: 'screaming mad',
		alt: 'ECU: Sosuno screaming at Jumong, furious blush, dusty-rose, not cute',
		people: ['sosuno', 'jumong'],
		refs: [chS, bnS, chJ],
		prompt: 'Minimal iconic 16:9 ECU. Sosuno screaming mad, mouth wide, furious blush, FACE from ch_sosuno, binyeo, dusty-rose. Jumong grin in bokeh. ONE device: her open shout. High contrast. Cel-painterly. No text.'
	},
	{
		id: 'jumong-seq-girls-fawn',
		at: 'She finds a flaw every time',
		alt: 'Dutch well: Jumong easy grin, three tiny women leaning in, Sosuno a dusty-rose wedge between',
		people: ['jumong', 'sosuno'],
		refs: [chJ, chS, bnS],
		prompt: 'Minimal iconic 16:9 DUTCH. SAME Jolbon well: granite rim, timber beam, two buckets. Jumong mid-grin FACE from ch_jumong, red #e8563f. Three tiny women fawning. Sosuno stepping in, dusty-rose, chin up. ONE device: the beam horizontal. Cel-painterly. No text.'
	},
	{
		id: 'jumong-seq-royal-pair',
		at: 'the largest kingdom in Samhan',
		alt: 'Worm’s-eye: Jumong and Sosuno in Goguryeo royal dress, jeolpung feathers, dusty-rose queen silk not gold-washed',
		tone: '#e8563f',
		people: ['jumong', 'sosuno'],
		refs: [chJ, chS, bnS],
		prompt: 'Minimal iconic 16:9 WORM’S-EYE courtyard. Jumong as first king: long-sleeved Goguryeo court silk, wide trousers, pointed jeolpung cap with two bird feathers (조우관), FACE from ch_jumong, red #e8563f as rim NOT gold plate. Sosuno as queen: full silk jeogori + dusty-rose chima #e8a04a NOT gold-washed, royal layer is rank silk and gilt binyeo from attached, FACE from ch_sosuno. Dramatic pose, not fashion plate. ONE device: a hard vermilion pillar. Grey giwa Jolbon hall. High contrast chiaroscuro. Cel-painterly. No text. No watermark.'
	}
];

for (const s of slots) upsert(s);

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('girlboss+order patched', mid.filter((b) => b.kind === 'scene').map((b) => b.label));
