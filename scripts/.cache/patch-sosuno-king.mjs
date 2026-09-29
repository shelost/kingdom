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
const scene = (label, ko) => ({ kind: 'scene', label, ko });

const J = '#e8563f';
const S = '#e8a04a';
const T = '#a97c4a';
const H = '#f0b429';

const iCave = jumong.blocks.findIndex((b) => b.html?.includes('He prays at the Jumong cavern'));
const iQuote = jumong.blocks.findIndex((b) => b.kind === 'quote' && b.html?.includes('I am the son of the Heavenly Emperor'));
if (iCave < 0 || iQuote < 0) throw new Error(`markers ${iCave} ${iQuote}`);

const before = jumong.blocks.slice(0, iCave + 1);
const after = jumong.blocks.slice(iQuote);

const mid = [
	p(
		'He comes across mountain tribes in the Jolbon valley. <b>Yeon Tabal</b>, the richest chieftain on the river, does not welcome him — he weighs him. An exiled prince with a bow and three friends is either a son-in-law or a fire. Tabal has not decided which. <b>The Jolbon hall is a timber country.</b>',
		'그는 졸본 골짜기의 산속 부족들을 만난다. 강가에서 가장 부유한 족장 <b>연타발</b>은 그를 환영하지 않는다 — 잰다. 활 하나와 벗 셋을 가진 망명 왕자는 사윗감이거나 불이다. 연타발은 아직 고르지 않았다. <b>졸본 대청은 나무 나라다.</b>'
	),
	d(
		'yeontabal',
		T,
		['I have heard the name. Jumong.', 'Go blood with nothing but a bow.', 'I do not want ash tracked into my hall.'],
		['이름은 들었다. 주몽.', '활 하나 든 고씨 피.', '내 마루에 재 끌어들이고 싶지 않다.']
	),
	d(
		'jumong',
		J,
		['I do not mean to leave ash.', 'Only… a roof for one night.', 'The bow I can show you, if you wish.'],
		['재는 남기고 싶지 않소.', '다만… 하룻밤 지붕이 필요하오.', '활은, 원하시면 보여 드리겠소.']
	),
	p(
		'His daughter <b>Sosuno</b> is already watching from the grain porch — a widow with two sons and a gaze that has priced every man who entered that hall. This one she prices as danger, out loud. Under the counting-voice she is already too warm. <b>She prices him, then forgets the count.</b>',
		'딸 <b>소서노</b>는 이미 곡식 누대에서 보고 있다 — 아들 둘을 둔 과부, 그 대청에 들어온 사내마다 값을 매겨 온 눈. 이번엔 위험으로 값을 매긴다, 소리 내어. 세는 목소리 아래는 이미 덥다. <b>값을 매기다가 세던 것을 잊는다.</b>'
	),
	p(
		'She turns her face as if going back to the grain, proud — the chieftain’s daughter, a widow who will not be seen wanting. And still she stares at the line of his back. Heat climbs her throat. <b>She blushes at his back.</b> He is not looking. That is when the heat is worst.',
		'곡식을 세러 돌아가는 척 얼굴을 돌린다. 자존심이다 — 족장의 딸, 원하는 티를 내면 안 되는 과부. 그런데도 그의 등 선을 본다. 열이 목으로 오른다. <b>등 뒤에서 얼굴을 붉힌다.</b> 그는 안 본다. 그때가 제일 덥다.'
	),
	p(
		'The counting-voice says one, two, three. The other voice — the one she keeps in books she should not have read — says his weight on her, his mouth at her neck, the hall empty except for that. <b>In her head the ledger is not grain.</b> Outside she is already turning away, as if the sacks mattered more.',
		'세는 목소리는 하나, 둘, 셋. 다른 목소리 — 읽지 말았어야 할 책에 적어 둔 목소리 — 는 그의 무게, 목덜미의 입, 대청이 그것만 남는 일을 말한다. <b>머릿속 장부는 곡식이 아니다.</b> 겉으로는 이미 외면한다. 가마니가 더 중요해 보이게.'
	),
	d(
		'sosuno',
		S,
		['Father.', "He's still here.", 'Walked in like he already lives here.', "I'm counting. Don't watch me."],
		['아버지.', '저 사람 아직 있어요.', '집 구한 얼굴로 들어왔잖아요.', '전 곡식 세요. 보지 마세요.']
	),
	d(
		'yeontabal',
		T,
		['You counted that sack twice.', "And you're pink.", 'Have you forgotten why you are a widow.'],
		['가마니 두 번 셌다.', '그리고 얼굴이 빨개.', '과부 된 이유, 잊었냐.']
	),
	d(
		'sosuno',
		S,
		["I haven't.", 'Leave ash as ash.', "…Don't look at my face. The count goes wrong."],
		['안 잊었어요.', '재는 재로 두라고요.', '…얼굴 보지 마세요. 셈 틀어지니까.']
	),
	p(
		'For three days she treats him like weather she did not order. She answers his hello with a sack count. She takes the long way around the yard so their sleeves will not touch, then stands too long at the post he just left. He grins. She hates that she looked. <b>Don’t follow me.</b>',
		'사흘 동안 그를, 시키지 않은 날씨처럼 대한다. 인사에는 가마니 숫자로 답한다. 소매가 안 닿게 마당을 멀리 돌아, 그가 막 떠난 기둥 앞에 너무 오래 선다. 그는 웃는다. 본 자신이 싫다. <b>따라오지 마요.</b>'
	),
	d(
		'sosuno',
		S,
		['That door is mine.', 'Yours is the yard.', "Don't follow me.", 'And wipe that look off.'],
		['그 문은 제 거예요.', '당신은 마당.', '따라오지 마요.', '그 얼굴 치우세요.']
	),
	d(
		'jumong',
		J,
		['I was going to the well.', 'You just happen to be between me and water.', '…See? Funny.'],
		['우물 가려던 길이오.', '물이 그쪽에 있을 뿐이오.', '…봐. 또 웃잖아.']
	),
	d(
		'sosuno',
		S,
		['I am not funny.', 'Drink somewhere else.', 'This hall has other buckets.'],
		['안 웃겨요.', '물 다른 데서 뜨세요.', '이 대청 두레박이 당신 것만은 아니에요.']
	),
	p(
		'On the second morning she dumps a bucket at his boots on purpose and calls it a slip. He laughs. She walks off so fast the dusty-rose looks angry. At the grain post she stops, listens for his step, and hates that she listened. Tabal, from the porch, says nothing. That is worse.',
		'이튿날 아침, 일부러 두레박을 그의 신에 쏟고 미끄러졌다고 한다. 그는 웃는다. 먼지로즈가 화난 것처럼 빠르게 간다. 곡식 기둥에서 멈춰, 발소리를 듣고, 들은 자신이 싫다. 연타발은 누대에서 아무 말도 안 한다. 그게 더 나쁘다.'
	),
	d(
		'sosuno',
		S,
		['It slipped.', 'Your feet were in the way.', "Don't look at me like I did it for you."],
		['미끄러졌어요.', '발이 거기가 아니라서요.', '당신 때문에 한 것처럼 보지 마요.']
	),
	d(
		'jumong',
		J,
		['My feet are wet.', 'The rest of me is fine.', "I'll wring the sleeve. Stay mad."],
		['신만 젖었소.', '나머지는 괜찮소.', '소매는 짜겠소. 화는 그대로 두시오.']
	),
	p(
		'They meet at the well the next morning, entirely by accident — an accident she has arranged by timing the water, and he by timing his thirst. <b>The well is an accident she timed.</b> She looks at the buckets first. At him second. As if the buckets were the point.',
		'이튿날 아침, 둘은 우물에서 순전히 우연으로 만난다 — 소서노가 물 뜨는 시각을 맞춰 두고, 주몽이 목마름을 맞춰 둔, 그런 우연으로. <b>우물은 그녀가 맞춘 우연이다.</b> 먼저 두레박을 본다. 그다음 그를 본다. 두레박이 목적인 것처럼.'
	),
	d(
		'jumong',
		J,
		['Lady…', 'May I ask your name.', "Rope's stuck. Want me to—"],
		['부인.', '이름… 여쭤도 되겠소.', '줄이 걸렸소. 잡아 드릴까.']
	),
	d(
		'sosuno',
		S,
		['Sosuno.', "Don't talk.", 'Just draw the water.', "Don't look at my face. The count goes wrong."],
		['소서노요.', '말 시키지 마세요.', '물만 뜨세요.', '얼굴은… 보지 마세요. 곡식 셈이 틀어지니까.']
	),
	d(
		'jumong',
		J,
		['I was looking at the well.', 'A hand is not— whatever you think.', "…You're funny."],
		['우물만 보고 있었소.', '손은— 그 정도는 아니오.', '…재미있네.']
	),
	d(
		'sosuno',
		S,
		['Who asked you to speak.', 'Draw it and go.', 'And stop smiling.'],
		['누가 말하래요.', '뜨고 가세요.', '웃지 마세요.']
	),
	p(
		'He keeps ending up thirsty at the same hour. She keeps being there, rude, pink at the ears. On the fourth morning he stops pretending he does not know. They are both on the packed earth, at the rim — not in the well, she would never forgive him that. <b>He kisses her at the well-beam.</b>',
		'같은 시각에 목이 마르고, 같은 우물에 그녀가 있다. 독하고, 귓불이 분홍이다. 나흘째 아침에 모르는 척을 그만둔다. 둘 다 다진 흙 위, 우물 가에 있다 — 안에 들어가면 평생 안 봐준다. <b>우물 들보에서 입을 맞춘다.</b>'
	),
	p(
		'She does not pull away first. She turns. Dusty-rose silk at the waist, wet from the well-rope, and <b>the back is the picture</b> — a column, the look over the shoulder at the man who just used the beam. He is still on packed earth, still not in the shaft, grinning like an idiot who got away with it.',
		'먼저 떼지 않는다. 돌아선다. 허리의 회분홍 비단, 우물줄에 젖고, <b>등이 그림이다</b> — 기둥, 들보를 쓴 남자를 넘겨보는 눈. 그는 아직 다진 흙 위, 아직 우물 안이 아니고, 된 놈처럼 웃는다.',
		true
	),
	d('sosuno', S, ['You—', 'How dare you.', 'Here. At the well.'], ['당신—', '어떻게 감히.', '지금— 우물에서—']),
	d(
		'jumong',
		J,
		['Yeah. That was me.', 'I’ll leave the village. Tonight.', 'If that is easier.'],
		['알아. 내가 먼저였소.', '원하시면… 오늘 밤 떠나겠소.', '쉬운 쪽으로.']
	),
	p(
		'She does not say stay. She goes at the rope, the weather, his boots, anything that is not his name. <b>The second bucket isn’t full.</b>',
		'남으라는 말은 안 한다. 줄, 날씨, 신발, 이름만 빼고 다 말한다. <b>둘째 두레박이 안 찼다.</b>'
	),
	d(
		'sosuno',
		S,
		['The second bucket isn’t full.', 'You’re on the rope.', 'I didn’t say leave.', 'I said the bucket.'],
		['둘째 두레박이… 안 찼어요.', '줄 밟지 마세요.', '가라는 말은 안 했거든요.', '그냥— 두레박요.']
	),
	d(
		'jumong',
		J,
		['Then I will wait for the second bucket.', 'Just the bucket.', 'This is fun, you know.', "Don't scowl. I'm smiling."],
		['그럼 기다리겠소.', '두레박.', '재밌소, 부인.', '화내지 마시오. 웃는 거요.']
	),
	p(
		'He has been collecting her collecting. From the grain-porch post, a cloth: thread off his sleeve, a fletch he dropped, well-rope, a scrap of headband. He holds it up like a joke that might not be one. <b>You hide these like a thief.</b>',
		'소서노가 모아 온 것을 주몽이 모아 왔다. 곡식 누대 기둥의 보자기 — 소매 실, 떨어뜨린 깃, 우물 새끼, 머리띠 조각. 농담인 척 들어 올린다. <b>도둑처럼 숨겼구나.</b>'
	),
	d(
		'jumong',
		J,
		["That's my headband.", 'You were going to say it was dirty.', 'Four of them. You hide these like a thief.'],
		['내 머리띤데.', '흙 묻었소, 라고 말하려던 참이오?', '네 개요. 도둑처럼 숨겼소.']
	),
	p(
		'She goes so red the dusty-rose looks pale. She snatches at the cloth and misses. <b>Those are… inventory.</b>',
		'얼굴이 너무 달아 먼지로즈가 창백해 보인다. 보자기를 뺏으려다 놓친다. <b>재고예요….</b>'
	),
	d(
		'sosuno',
		S,
		['Those are… inventory.', 'Grain inventory.', "Trash. I'll burn them.", 'Get your face off it.'],
		['재고예요.', '곡식 재고.', '쓰레기. 태울 거예요.', '얼굴 치우세요.']
	),
	p(
		'He stops smiling. Not angry — done asking the buckets to speak for her. He unslings the bow and lays it on the packed earth at the well-rim, as if the yard could keep it better than a mouth that will not. Then he walks. <b>He leaves the bow on packed earth.</b>',
		'웃음을 접는다. 화가 아니다 — 두레박이 대신 말해주길 그만둔다. 활을 풀어 우물 가 다진 흙 위에 놓는다. 입이 안 지키는 것을 마당이 지키라는 듯이. 그리고 걷는다. <b>활을 다진 흙 위에 두고 간다.</b>'
	),
	d(
		'jumong',
		J,
		['Then I will go.', 'You keep your numbers.', 'The bow stays. I don’t.'],
		['그럼 가겠소.', '숫자나 세요.', '활은 두고 가오. 나는 안 남소.']
	),
	p(
		'She does not call stay. She picks the bow up the way she picks a wrong count — too fast, furious at her own hands. One arrow. The timber well-beam beside his ear takes it. The hall hears the wood. He stops. <b>She puts an arrow in the beam.</b>',
		'남으라는 말은 안 한다. 틀린 셈을 집듯 활을 집는다 — 너무 빠르고, 제 손이 밉다. 화살 하나. 귀 옆 우물 들보가 받는다. 대청이 나무를 듣는다. 그가 멈춘다. <b>들보에 화살을 박는다.</b>'
	),
	d(
		'sosuno',
		S,
		['Don’t—', 'If you take one more step—', 'I wasn’t aiming at you.', 'I was aiming at you leaving.'],
		['가지—', '한 발만 더 가면—', '당신을 쏜 거 아니에요.', '가는 걸 쏜 거예요.']
	),
	p(
		'The confession does not come as a speech. It comes like a tooth she has been biting on since the porch. She looks at the dirt. At the bow. Anywhere but his grin, which has started to come back. <b>I wasn’t going to say it.</b>',
		'고백은 연설이 아니다. 누대부터 깨물고 있던 이처럼 나온다. 흙을 본다. 활을 본다. 다시 올라오는 그 웃음만 빼고. <b>말하려고 한 적 없어요.</b>'
	),
	d(
		'sosuno',
		S,
		[
			'Wait—',
			'I wasn’t going to say it.',
			'If you walk out with that face I— ugh.',
			'I’ve been— wanting. Since you walked into the hall.',
			'There. Happy? Don’t make me say it twice.'
		],
		[
			'기다려요—',
			'말하려고 한 적 없어요.',
			'그 얼굴로 나가면 나— 하.',
			'원했어요. 대청에 들어왔을 때부터.',
			'됐어요. 기뻐요? 두 번은 안 해요.'
		]
	),
	d(
		'jumong',
		J,
		['Alright, alright.', "I'm not going.", 'Before you say don’t smirk — too late.', 'You shot my leaving. I’ll stay.'],
		['알겠어, 알겠어.', '안 가요.', '웃지 말라고 하기 전에— 벌써 웃고 있소.', '가는 걸 쏘셨으니. 남겠소.']
	),
	p(
		'Tabal has been on the porch the whole time, looking like a man who bit a persimmon too early. <b>I am not pleased. I am also not blind.</b>',
		'연타발은 처음부터 누대에 있었다. 감이 너무 일찍 온 얼굴. <b>안 기쁘다. 눈은 있다.</b>'
	),
	d(
		'yeontabal',
		T,
		[
			'…The pine.',
			'A hundred paces. Now.',
			'Hit it, he eats. Miss, I throw him out myself.',
			'I am not pleased. I am also not blind. Nobody on this porch is.'
		],
		['…소나무다.', '백 보. 지금.', '맞히면 밥. 빗나가면 내가 직접 내보낸다.', '안 기쁘다. 눈은 있다. 이 누대에 눈 없는 사람 없으니까.']
	),
	p(
		'He had already named the pine from the porch. Now he makes them do it in front of the hall — publicly, so no one can claim the weight was wrong. Three flights. His best men first. Then himself. Then the exile, if the exile still has the nerve after being kissed in the yard.',
		'소나무는 이미 누대에서 짚었다. 이제 대청 앞에서 시킨다 — 공개적으로, 무게가 틀렸다고 말할 수 없게. 세 순. 먼저 제 장수들. 그다음 자신. 그다음 망명객, 마당에서 입 맞춘 뒤에도 배가 남아 있다면.'
	),
	d(
		'yeontabal',
		T,
		['I already said. The pine.', 'A hundred paces.', 'Everybody watches. No peeking from the rail.'],
		['말했잖소. 소나무.', '백 보.', '다들 보게. 숨어서 볼 생각 말고.']
	),
	p(
		'<b>The pine is a hundred paces.</b> Packed earth. One tree. The hall behind them, giwa catching late light. Sosuno on the porch rail, knuckles already white, pretending she is only here for the count.',
		'<b>소나무는 백 보다.</b> 다진 흙. 나무 하나. 등 뒤의 대청, 늦은 빛을 받는 기와. 소서노는 누대 난간에 있다. 손마디가 이미 하얗다. 셈하러 온 척한다.'
	),
	p(
		'The best men hit bark. Tabal hits the knot he named. Jumong does not aim at the knot. He splits Tabal’s arrow down the shaft — so cleanly the hall hears the wood cry before it sees the feather still trembling. <b>The hall hears the wood cry.</b>',
		'장수들은 껍질을 맞힌다. 연타발은 자신이 짚은 옹이를 맞힌다. 주몽은 옹이를 조준하지 않는다. 연타발의 화살을 자루째 가른다 — 깃털이 떨리기도 전에 대청이 나무 우는 소리를 들을 만큼 깨끗하게. <b>대청이 나무 우는 소리를 듣는다.</b>'
	),
	d('jumong', J, ['…Ash does not look like this.', "See? I'm still smiling."], ['…재는 이렇게 안 생겼소.', '봐. 아직 웃고 있잖소.']),
	p(
		'Silence. Then Tabal laughs — short, unwilling, the laugh of a man whose suspicion has just been outshot. Sosuno’s hand is already on the porch rail, white at the knuckles.',
		'침묵. 이윽고 연타발이 웃는다 — 짧고, 마지못해, 의심이 활에 진 사내의 웃음. 소서노의 손은 이미 누대 난간에 올려져 있고, 마디가 하얗다.'
	),
	d(
		'yeontabal',
		T,
		['…You will eat.', 'And I will not hurry the road.', 'But my daughter —'],
		['…밥은 먹이겠소.', '길은… 서두르지 않겠소.', '허나 내 딸은 —']
	),
	d(
		'sosuno',
		S,
		['The bow is the bow.', "Don't look at me like that.", 'I only— lost the count.', 'Stop smiling.'],
		['활은 활이고요.', '그렇게 보지 마세요.', '전 그냥— 셈이 틀린 거예요.', '웃지 마요.']
	),
	d(
		'yeontabal',
		T,
		[
			'…Ha.',
			'I thought the river would take him. Instead my daughter ran after it.',
			'Sosuno. You chose him with your mouth. You keep him. I’m not throwing a feast.',
			'Jumong. Ash of my daughter and no bow will stop me.',
			'Eat. Stay. Grumble in my hall like the rest of us.'
		],
		[
			'…하.',
			'강물이 데려가는 줄 알았더니 딸이 쫓아가네.',
			'소서노. 네 입으로 골랐으면 네가 지켜. 축하하는 거 아니다.',
			'주몽. 내 딸 재로 만들면 활로도 못 막아.',
			'먹어. 남아. 이 대청에서 우리처럼 투덜거려.'
		]
	),
	p(
		'After that the war-talk still happens, but nights belong to something else. He watches her count grain. She lets him. The ledger stays open longer than it needs to, because neither of them wants to be the first to close it.',
		'그 뒤로도 전쟁 이야기는 이어지지만, 밤은 다른 것의 몫이다. 주몽이 곡식을 세는 소서노를 본다. 소서노는 그것을 허락한다. 장부는 필요 이상으로 오래 열려 있다. 둘 다 먼저 덮고 싶지 않아서.'
	),
	d(
		'jumong',
		J,
		['Wife.', 'Close the ledger.', "I can't see the numbers.", 'Your throat. Brighter than the lamp. Sorry.'],
		['부인.', '장부 덮으시오.', '숫자 안 보이오.', '목 때문에. 촛불보다 밝아서.']
	),
	d(
		'sosuno',
		S,
		['I am not your wife yet.', "Don't call me that. My hands shake.", 'Do you need the counting hand, or me.', "Don't ask if you know."],
		['아직 아내 아닌데요.', '그렇게 부르지 마요. 손 떨리잖아요.', '세는 손이 필요해요, 아니면 나예요.', '답 알고 묻지 마요.']
	),
	d(
		'jumong',
		J,
		['Only you.', 'From the first look — only you.', 'Give me your mouth… first.', 'The country… we can found later.'],
		['당신만.', '처음부터 당신만이었소.', '입을… 먼저 주시오.', '나라는… 나중에 세우겠소.']
	),
	d(
		'sosuno',
		S,
		['Then take them.', 'The mouth.', 'The ledger.', 'The tribes.', 'Do not put a price on the love.', 'I have already lost the count.'],
		['그럼 받으세요.', '입도.', '장부도.', '부족도.', '사랑은… 값을 매기지 말아요.', '저는 이미 값을 잃었으니까.']
	),
	p(
		'<b>Sosuno (24)</b> is still a widow with two sons and her father’s rivers in her head. The marriage is real hunger first — and only afterwards the alliance Tabal can explain to the other chieftains without sounding like a man who was outshot by his future son-in-law.',
		'<b>소서노 (24)</b>는 여전히 아들 둘을 둔 과부이고, 아버지의 물길을 머릿속에 담고 있다. 혼인은 먼저 진짜 허기고 — 그다음에야, 연타발이 다른 족장들에게 «사위한테 활로 진 사람»처럼 들리지 않게 설명할 수 있는 동맹이다.'
	),
	p(
		'The grain-room lamp. Dusty-rose hiked. She still pretends the count is what she came for until his cock is in her from behind, one hand on the open ledger, and she is not pretending. The tsundere hide splits. The book-pervert underneath has been waiting since the porch. <b>since the first time</b>',
		'곡식방 등잔. 먼지로즈가 걷혀 있다. 셈하러 온 척하다가, 뒤에서 들어가고, 한 손은 열린 장부에, 척이 끝난다. 츤데레 껍질이 찢어진다. 아래 숨긴 책벌레는 누대부터 기다렸다. <b>처음 본 그날부터</b>',
		true
	),
	d(
		'jumong',
		J,
		['Say it.', 'When did you start wanting this.', 'Not the bucket. The first look.'],
		['말해.', '언제부터 이걸 원했소.', '두레박 말고. 처음 본 눈.'],
		true
	),
	d(
		'sosuno',
		S,
		[
			'The— porch— your back— ah—',
			'I counted sacks so I wouldn’t look—',
			'I imagined you inside me— don’t make me—',
			'Since I laid eyes on you— there—'
		],
		['누대— 등— 아—', '안 보려고 가마니를 셌어요—', '안에 넣는 걸 그렸어요— 시키지 마요—', '눈 마주친 그때부터— 됐어요—'],
		true
	),
	d(
		'sosuno',
		S,
		[
			'Give me your thick creamy nut—',
			"I've been waiting— don't you dare pull out—",
			'AHH— DON’T STOP— FILL ME—',
			'HARDER— YOUR— CREAM— IN ME—'
		],
		['진하고 걸쭉한 거 주세요—', '기다렸어요— 빼지 마요—', '아아— 멈추지 마— 채워—', '더 세게— 그 크림— 안에—'],
		true
	),
	d(
		'jumong',
		J,
		['Take it—', 'That ass— bounce—', 'I’m going to nut—', 'Scream it. Louder.'],
		['받아—', '그 엉덩이— 튀겨—', '쌀 것이오—', '소리 질러. 더 크게.'],
		true
	),
	d(
		'sosuno',
		S,
		['AH— AHHH— YES—', 'I’M— CUMMING— DON’T YOU DARE STOP—', 'GIVE ME EVERY DROP— AHH—'],
		['아— 아아아— 좋아—', '가— 가버려— 멈추지 마—', '한 방울까지— 아아—'],
		true
	),
	p(
		'He spends in her against the grain sacks — a fugitive’s unused load, messy, the dusty-rose already ruined at the hip. She laughs into the timber because she lost the count on purpose. Messy hair. Spent. The secret pervert is not secret in this room. Tonight she just wants the next one.',
		'곡식 가마니에 대고 싼다 — 망명객의 안 쓴 한 방, 지저분하고, 먼지로즈는 이미 허리에서 망가졌다. 일부러 셈을 잃어서 들보에 웃는다. 헝클어진 머리. 다 씀. 이 방에서는 숨긴 변태가 숨이 아니다. 오늘 밤은 다음이 고프다.',
		true
	),
	d(
		'jumong',
		J,
		['…All I own is a bow.', 'And still… I have you.'],
		['…내가 가진 게 활 하나요.', '그래도… 당신을 얻었소.']
	),
	d(
		'sosuno',
		S,
		['The bow won me.', 'The rest… we can carry together.'],
		['활이 저를 얻었지요.', '나머지는… 같이 가면 됩니다.']
	),
	scene('Five Tribes', '오부'),
	p(
		'Jolbon is five roofs that will not share a yard. Cousins cut cousins over a ditch, a ford, a winter store. Jumong watches it for a week and then says it in the hall, easy, as if counting wet sacks. <b>You keep cutting each other.</b>',
		'졸본은 마당을 안 나누는 지붕 다섯이다. 사촌이 사촌을 벤다. 도랑, 여울, 겨울 곳간 때문에. 주몽은 일주일을 보다가 대청에서 말한다. 젖은 가마니 세듯, 쉽게. <b>서로만 베고 있소.</b>'
	),
	d(
		'jumong',
		J,
		[
			'You keep cutting each other.',
			'A ditch is not a country.',
			'I crossed a river on turtles. You fight over who owns the mud.'
		],
		['서로만 베고 있소.', '도랑이 나라가 아니오.', '나는 자라 타고 강을 건넜소. 여기는 진흙 주인 싸움이오.']
	),
	d(
		'yeontabal',
		T,
		['…Watch your mouth.', 'Those are my cousins.', 'They have been mine longer than you have been dry.'],
		['…입 조심해.', '그놈들이 내 사촌이다.', '네가 마르기 전부터 내 사람들이야.']
	),
	d(
		'jumong',
		J,
		['Then make them one hall.', 'Five fires, one roof.', 'Or keep the ditches. I can leave a bow on dirt again.'],
		['그럼 대청을 하나로 하시오.', '불 다섯, 지붕 하나.', '아니면 도랑이나 지키시오. 활은 또 흙에 둘 수 있소.']
	),
	p(
		'He does not conquer them. He walks the five yards with the same grin he used on Sosuno, and the same refusal to be impressed by a feud. Grain is counted in one book. Fords are shared. A cousin who draws in the ditch finds Jumong already there, bow unstrung, talking about weather until the cousin looks stupid. <b>This valley is one roof.</b>',
		'정복하지 않는다. 소서노에게 쓰던 그 웃음으로 다섯 마당을 걷고, 원한에 감명받은 척을 거부한다. 곡식은 장부 하나에 센다. 여울은 같이 쓴다. 도랑에서 칼을 뽑는 사촌 앞에, 이미 주몽이 있다. 활시위는 풀어 두고, 날씨 이야기를 해서 사촌이 바보가 되게 한다. <b>이 골짜기는 지붕 하나다.</b>'
	),
	scene('The First King', '초대 왕'),
	p(
		'After the marriage the five tribes sit in Tabal’s hall and do the thing they hate more than a ditch: they agree. They vote Jumong first king — not because he asked, because the grin has already become a roof. <b>The five tribes vote.</b>',
		'혼인 뒤에 다섯 부족이 연타발의 대청에 앉아, 도랑보다 싫은 일을 한다. 합의. 주몽을 첫 왕으로 뽑는다 — 그가 청해서가 아니다. 그 웃음이 이미 지붕이 되어서. <b>다섯 부족이 뽑는다.</b>'
	),
	d(
		'yeontabal',
		T,
		['…Fine.', 'King, then.', 'If the ditches start again I will say I told you.', 'Eat. Stay. Wear it.'],
		['…됐다.', '왕이면 왕이지.', '도랑이 다시 열리면 내가 그랬다고 한다.', '먹어. 남아. 쓰고 다녀.']
	),
	d(
		'jumong',
		J,
		['I will.', 'Not for the chair.', 'For the roof.'],
		['알겠소.', '의자 때문이 아니오.', '지붕 때문에.']
	),
	scene('Dawn in the Cavern', '동굴의 새벽'),
	p(
		'Later he goes back to the mouth in the hill — the same stone, the same leaf-light — to pray the way a man prays when a hall has already named him and he still does not quite believe the name. Night thins. <b>A break of light at dawn.</b>',
		'나중에 다시 산허리의 입으로 간다 — 같은 돌, 같은 잎빛 — 대청이 이미 이름을 붙여 준 뒤에도 그 이름을 다 믿지 못하는 사람이 비는 방식으로. 밤이 얇아진다. <b>새벽에 빛이 틈을 낸다.</b>'
	),
	d('jumong', J, ['Father!'], ['아버지!']),
	p(
		'Gold where the dark had been. Not a lamp. A person. <b>Haemosu unveils himself</b> — silver-white hair, the sun’s hour delayed on purpose, looking at his son the way he once looked down from a chariot rail.',
		'어둠이던 자리에 금빛. 등잔이 아니다. 사람. <b>해모수가 모습을 드러낸다</b> — 은빛 흰 머리, 일부러 늦춘 태양의 시각, 한때 수레 난간에서 내려다보던 눈으로 아들을 본다.'
	),
	d('haemosu', H, ['Jumong…. my son…'], ['주몽.... 내 아들아...']),
	d('jumong', J, ['Father… are you even listening to me?'], ['아버지... 제 말을 듣기는 하시는 거예요?']),
	d(
		'haemosu',
		H,
		['It is to build a new world.', 'Build a world of your own…. my son…!'],
		['새로운 세상을 만드는 것이다.', '너만의 세상을 만들어라.... 아들아...!']
	),
	p(
		'He comes out of the cavern a king the valley already voted for, and a son who finally saw the face that had been the hour. The chronicles start the years from here. His descendants will push the borders until Goryeo is <b>the largest kingdom in Samhan</b> — a later argument, a later map. This morning is only a roof, a grin, and a gold break in the stone.',
		'골짜기가 이미 뽑은 왕으로, 시각이던 얼굴을 드디어 본 아들로, 동굴에서 나온다. 편년은 여기부터 해를 센다. 자손은 국경을 밀어 <b>삼한에서 가장 큰 나라</b>를 만들 것이다 — 나중의 싸움, 나중의 지도. 이 아침은 지붕과 웃음과, 돌 틈의 금빛뿐.'
	),
	p(
		'Her wealth still buys what love alone cannot: tribes, grain, river routes. Her two sons are raised in the hall of the kingdom they build together. Twenty years later a first wife walks in from Buyeo with a boy and a broken sword, and the succession goes to him, and Sosuno takes her sons and walks south, and founds the other kingdom in this story. The first love was real enough; she simply refuses to live as a footnote in it.',
		'사랑만으로는 못 사는 것들을 그의 재산이 여전히 산다: 부족, 곡식, 물길. 두 아들은 함께 세운 나라의 대청에서 자란다. 이십 년 뒤 부여에서 첫 아내가 아들 하나와 부러진 칼을 들고 걸어 들어오고, 왕위는 그 아이에게 간다. 그러자 소서노는 아들들을 데리고 남쪽으로 걸어가, 이 이야기의 다른 한 나라를 세운다. 첫사랑이 거짓이었던 것은 아니다. 다만 그 이야기의 각주로 살기를 거절했을 뿐이다.'
	),
	d(
		'sosuno',
		S,
		['You learn something from founding a country twice. / The second one is easier.'],
		['나라는 두 번 세워 보면 아는 게 있습니다. / 두 번째가 쉽다는 거예요.']
	)
];

jumong.blocks = [...before, ...mid, ...after];

const slots = [
	{
		id: 'sosuno-seq-dump-water',
		at: 'Don’t follow me.',
		alt: 'Dutch: Sosuno dumping a bucket at Jumong’s boots, looking away, dusty-rose silk',
		nsfw: false,
		tone: '#e8a04a',
		people: ['sosuno', 'jumong'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png']
	},
	{
		id: 'sosuno-seq-beam-shot',
		at: 'She puts an arrow in the beam',
		alt: 'Worm’s-eye: Sosuno full-draw; arrow in the well-beam beside Jumong; packed earth',
		nsfw: false,
		tone: '#e8a04a',
		people: ['sosuno', 'jumong'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png']
	},
	{
		id: 'sosuno-seq-forced-confess',
		at: 'I wasn’t going to say it',
		alt: 'ECU: Sosuno looking down, heavy blush, mouth bitten, dusty-rose; Jumong’s grin in bokeh',
		nsfw: false,
		tone: '#e8a04a',
		people: ['sosuno', 'jumong'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png']
	},
	{
		id: 'jumong-seq-tribes-wide',
		at: 'You keep cutting each other',
		alt: 'Bird’s-eye: five tiny timber-hall roofs, one packed-earth yard, Jumong a red speck',
		nsfw: false,
		tone: '#e8563f',
		people: ['jumong'],
		refs: ['/ch_jumong.png']
	},
	{
		id: 'jumong-seq-tribes-speak',
		at: 'This valley is one roof',
		alt: 'Dutch hall: Jumong mid-speech, red silk; Tabal on the porch-beam, weighing',
		nsfw: false,
		tone: '#e8563f',
		people: ['jumong', 'yeontabal'],
		refs: ['/ch_jumong.png', '/ch_yeon_tabal.png']
	},
	{
		id: 'jumong-seq-king-vote',
		at: 'The five tribes vote',
		alt: 'Low strip: Jumong kneeling to receive a crown-band; five tiny chiefs; giwa hall',
		nsfw: false,
		tone: '#e8563f',
		people: ['jumong', 'yeontabal'],
		refs: ['/ch_jumong.png', '/ch_yeon_tabal.png']
	},
	{
		id: 'jumong-seq-cave-dawn',
		at: 'A break of light at dawn',
		alt: 'Same Jumong cavern: hard dawn light-seam; tiny kneeling red figure in lower third',
		nsfw: false,
		tone: '#f0b429',
		people: ['jumong'],
		refs: ['/ch_jumong.png', '/pl_jumong_cave.png']
	},
	{
		id: 'jumong-seq-haemosu-unveil',
		at: 'Haemosu unveils himself',
		alt: 'Cavern two-shot: painterly Jumong kneeling; photoreal Haemosu in dawn gold',
		nsfw: false,
		tone: '#f0b429',
		people: ['jumong', 'haemosu'],
		refs: ['/ch_jumong.png', '/ch_haemosu.png', '/pl_jumong_cave.png']
	},
	{
		id: 'jumong-seq-largest',
		at: 'the largest kingdom in Samhan',
		alt: 'Iconic wide: Jumong as king, tiny in a vast Jolbon courtyard, red #e8563f accent',
		nsfw: false,
		tone: '#e8563f',
		people: ['jumong'],
		refs: ['/ch_jumong.png']
	},
	{
		id: 'nsfw-sosuno-first-lust',
		at: 'since the first time',
		alt: 'Intimate: Jumong pinning Sosuno, forcing her eyes; hiked dusty-rose, wanting mouths',
		nsfw: true,
		tone: '#e8a04a',
		people: ['sosuno', 'jumong'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png']
	},
	{
		id: 'nsfw-sosuno-beg-nut',
		at: 'Give me your thick creamy nut',
		alt: 'Close: Sosuno ahegao, hiked chima, begging, cream at the hip; Jumong red silk',
		nsfw: true,
		tone: '#e8a04a',
		people: ['sosuno', 'jumong'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png']
	},
	{
		id: 'nsfw-sosuno-scream-caps',
		at: 'AHH— DON’T STOP— FILL ME—',
		alt: 'ECU scream: Sosuno climax face, all-caps mouth, sweat, heart-flush; grain-room dark',
		nsfw: true,
		tone: '#e8a04a',
		people: ['sosuno', 'jumong'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png']
	}
];

const have = new Set(jumong.images.map((im) => im.id));
for (const s of slots) {
	if (have.has(s.id)) continue;
	jumong.images.push({
		id: s.id,
		ratio: 1.778,
		tone: s.tone,
		at: s.at,
		alt: s.alt,
		nsfw: s.nsfw,
		people: s.people,
		refs: s.refs
	});
}

const leave = jumong.images.find((im) => im.id === 'jumong-seq-leave-bow');
if (leave) {
	leave.at = 'He leaves the bow on packed earth';
	leave.alt = 'Worm’s-eye: Jumong walking away; his bow left on packed earth at the well-rim';
}
const run = jumong.images.find((im) => im.id === 'sosuno-seq-run-kiss');
if (run) {
	run.at = 'I wasn’t going to say it';
	run.alt = 'Dutch: Sosuno after the beam-shot, looking down, forced to confess; Jumong stopped mid-stride';
}
const king = jumong.images.find((im) => im.id === 'jumong-seq-king');
if (king) king.at = 'the largest kingdom in Samhan';

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('blocks', jumong.blocks.length, 'images', jumong.images.length);
