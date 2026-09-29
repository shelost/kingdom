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
		'He is still wet from the river when the pines stop being empty. Two men in Yeon leather, spears too casual to be hunting, too careful to be lost. <b>Jolbon scouts find him first.</b> He puts the bow down before they ask. He is very good at looking harmless.',
		'강물기가 채 마르기 전에 소나무가 빈 곳이 아니게 된다. 연씨 가죽 두 사람, 사냥이라기엔 창이 너무 대충이고, 길 잃었다기엔 너무 조심스럽다. <b>졸본 척후가 먼저 찾는다.</b> 묻기도 전에 활을 내려놓는다. 해쳐 보이지 않는 데에 아주 능하다.'
	),
	dx(
		'Scout',
		'#8d8d95',
		['Hold.', 'Red silk. That’s not a Yeon cut.', 'Bow’s down. Keep it down.'],
		['서.', '붉은 비단이네. 연씨 옷이 아니야.', '활 내려놨지. 그대로 있어.']
	),
	dx(
		'Second scout',
		'#7a7a82',
		['Name.', 'If you have one that isn’t going to get us yelled at.'],
		['이름.', '우리 혼날 이름만 아니면 돼.']
	),
	d(
		'jumong',
		J,
		['Jumong.', 'I was hoping for water.', 'Maybe a road. Maybe not the yelling.'],
		['주몽이오.', '물은 바라던 참이오.', '길이면 더 좋고. 혼내는 목소리는… 없어도 되고.']
	),
	dx(
		'Scout',
		'#8d8d95',
		['You’ll get Tabal.', 'He hates names that arrive first.', 'Walk. Don’t make it a story.'],
		['타발 어른께 가게.', '이름부터 오는 걸 제일 싫어하셔.', '걸어. 이야기 만들지 마.']
	),
	p(
		'They bring him in at dusk, not as a guest. The valley opens under grey giwa like a thing already counted. Tabal is on the porch with a cup he is not drinking. <b>The Jolbon hall is a timber country.</b>',
		'손님으로 데려오지 않는다. 해 질 녘. 회색 기와 아래 골짜기가 이미 세어 둔 것처럼 열린다. 연타발은 누대에 있다. 잔은 들었는데 안 마신다. <b>졸본 대청은 나무 나라다.</b>'
	),
	scene('Tabal’s Hall', '연타발의 대청'),
	p(
		'<b>Yeon Tabal</b> shows the stranger the valley the way a man shows a ledger he does not want copied. Grain porch, well, pine, the five roofs that will not share a yard. He does not smile. He does not offer the good mat. <b>Tabal shows him the valley like a ledger.</b>',
		'<b>연타발</b>은 낯선 자에게 골짜기를, 베끼기 싫은 장부처럼 보여 준다. 곡식 누대, 우물, 소나무, 마당을 안 나누는 지붕 다섯. 웃지 않는다. 좋은 자리도 안 내준다. <b>골짜기를 장부처럼 보여 준다.</b>'
	),
	d(
		'yeontabal',
		T,
		[
			'So.',
			'The river spat you out.',
			'Go blood. A bow. Three friends I have not seen yet, which means they are smarter than you or already dead.'
		],
		['그래.', '강이 널 뱉었구나.', '고씨 피. 활. 벗 셋은 아직 안 보이는데, 너보다 똑똑하거나 이미 죽었겠지.']
	),
	d(
		'jumong',
		J,
		['The river was polite about it.', 'They’re in the pines. Hungry. Not dead.', 'I can call them if you like a crowd.'],
		['강은 예의 있더이다.', '소나무에 있소. 배고프고. 안 죽었고.', '사람이 많으면 부르겠소.']
	),
	d(
		'yeontabal',
		T,
		[
			'I do not like a crowd.',
			'I do not want ash tracked into my hall.',
			'You sleep in the shed. You eat if you hunt. You look at my daughter, I find a ditch.'
		],
		['사람 많은 거 싫다.', '내 마루에 재 끌어들이고 싶지 않다.', '헛간에서 자라. 사냥하면 밥. 내 딸 보면 내가 도랑을 판다.']
	),
	d(
		'jumong',
		J,
		['Shed. Hunt. Ditches.', 'Understood.', '…You’re very clear. I like that.'],
		['헛간. 사냥. 도랑.', '알겠소.', '…말씀이 분명해서 좋소.']
	),
	d('yeontabal', T, ['Don’t smile at me.'], ['나한테 웃지 마.']),
	p(
		'For a week Tabal uses him like a tool he has not paid for. West millet has a boar. Two cousins have a ditch and a knife each. Jumong hits the boar, then the mark both cousins named, then sits in the dirt like a man waiting to be told he can stand. Tabal does not thank him. He just stops finding new ditches. <b>The millet likes you. I don’t.</b>',
		'일주일 동안 연타발은 값을 안 매긴 연장처럼 그를 쓴다. 서쪽 조에 멧돼지. 사촌 둘은 도랑 하나와 칼 하나씩. 주몽은 멧돼지를 맞히고, 사촌이 짚은 표를 맞히고, 일어서라는 말을 기다리듯 흙에 앉는다. 연타발은 고맙다는 말을 안 한다. 새 도랑만 안 판다. <b>조는 너를 좋아한다. 나는 아니다.</b>'
	),
	d(
		'yeontabal',
		T,
		['The millet likes you. I don’t.', 'Stay anyway.', 'Shed stays the shed. Don’t get ideas about the hall.'],
		['조는 너를 좋아한다. 나는 아니다.', '그래도 남아.', '헛간은 헛간이다. 대청 생각 말고.']
	),
	d(
		'jumong',
		J,
		['Wouldn’t dream.', 'The shed has a very honest roof.', 'Your well’s nicer, though. Just saying.'],
		['꿈도 안 꾸오.', '헛간 지붕은 정직해서 좋소.', '우물이 더 예쁘긴 하오. 그냥.']
	),
	d('yeontabal', T, ['…Go draw water if you love it so much.'], ['…그렇게 좋으면 물이나 떠.']),
	p(
		'His daughter <b>Sosuno</b> is already on the grain porch — a widow with two sons, a chieftain’s daughter who has priced every man who walked that packed earth. This one she prices as trouble, out loud. Under the counting-voice she is already too warm. <b>She prices him, then forgets the count.</b>',
		'딸 <b>소서노</b>는 이미 곡식 누대에 있다 — 아들 둘을 둔 과부, 그 다진 흙에 들어온 사내마다 값을 매겨 온 족장의 딸. 이번엔 문제로 값을 매긴다, 소리 내어. 세는 목소리 아래는 이미 덥다. <b>값을 매기다가 세던 것을 잊는다.</b>'
	),
	p(
		'Chin up, she is her father’s hall: independent, bored, nobody’s girl to fetch. Then his red back crosses the yard and the chin fails. Heat at the throat. She turns as if the sacks called her. They did not. <b>She blushes at his back.</b>',
		'턱을 들면 아버지의 대청이다. 독립이고, 심심하고, 심부름할 계집이 아니다. 그런데 붉은 등이 마당을 가로지르면 턱이 무너진다. 열이 목. 가마니가 부른 척 돈다. 안 불렀다. <b>등 뒤에서 얼굴을 붉힌다.</b>'
	),
	p(
		'The counting-voice says one, two, three. The other voice — the one she keeps for nights and books she should not have — puts his mouth at her neck and his weight where the sacks are. <b>In her head the ledger is not grain.</b> Outside she is already walking away, like a woman with better work.',
		'세는 목소리는 하나, 둘, 셋. 다른 목소리 — 밤과, 읽지 말았어야 할 책을 위한 목소리 — 는 그의 입을 목덜미에, 무게를 가마니 자리에 둔다. <b>머릿속 장부는 곡식이 아니다.</b> 겉으로는 이미 간다. 할 일 있는 여자처럼.'
	),
	d(
		'sosuno',
		S,
		['Father.', 'He’s still here.', 'The shed has a door. Why is he in my yard.'],
		['아버지.', '저 사람 아직 있어요.', '헛간에 문 있잖아요. 왜 내 마당에 있어요.']
	),
	d(
		'yeontabal',
		T,
		['Because the millet voted.', 'You counted that sack twice.', 'And you’re pink. Sit down.'],
		['조가 뽑아서.', '가마니 두 번 셌다.', '얼굴도 빨개. 앉아.']
	),
	d(
		'sosuno',
		S,
		['I’m not pink.', 'Wind.', '…Don’t look at my face. The numbers go stupid.'],
		['안 빨개요.', '바람이에요.', '…얼굴 보지 마세요. 숫자 바보 돼요.']
	),
	p(
		'She starts calling him names because names are cheaper than looking. <b>Big idiot</b> is the one that sticks. He answers to it on the third day, cheerful, which makes it worse. She takes the long way around the yard so their sleeves will not touch, then stands too long at the post he just left.',
		'보기보다 싼 게 욕이라서 욕을 시작한다. <b>큰 바보</b>가 남는다. 사흘째에 그가 그 이름으로 대답한다. 기분 좋게. 그게 더 싫다. 소매가 안 닿게 마당을 멀리 돌아, 그가 막 떠난 기둥 앞에 너무 오래 선다.'
	),
	d(
		'sosuno',
		S,
		['Move.', 'That’s not a path. That’s my count.', 'Big idiot. Go around.'],
		['비키세요.', '길이 아니에요. 내 셈이에요.', '이 큰 바보. 돌아가요.']
	),
	d(
		'jumong',
		J,
		['I live here now. Apparently the millet voted.', 'You keep saying idiot.', 'I’m starting to answer to it.'],
		['이제 여기 산다오. 조가 뽑았다지.', '바보, 바보.', '이젠 그 이름에 대답하게 생겼소.']
	),
	d(
		'sosuno',
		S,
		['Don’t.', 'Don’t answer.', 'Don’t— just— go around. Don’t follow me.'],
		['하지 마요.', '대답하지 마요.', '그냥— 돌아가요. 따라오지 마요.']
	),
	d(
		'jumong',
		J,
		['Wasn’t following.', 'Well’s that way.', 'You just keep being between me and thirsty.', 'It’s a talent.'],
		['안 따라갔소.', '우물이 그쪽이오.', '목마른 길이 자꾸 부인이오.', '재주요.']
	),
	d(
		'sosuno',
		S,
		['Don’t call it a talent.', 'Don’t call me lady.', 'There’s other water. Use it.'],
		['재주 아니에요.', '부인 붙이지 마요.', '물 다른 데도 있어요. 거기로.']
	),
	p(
		'On the second morning she dumps a bucket at his boots and does not even bother with slipped. He laughs. She hates the laugh in her stomach, which is not where hate should live. At the grain post she stops to hear if he followed. He did not. That is worse.',
		'이튿날 아침, 두레박을 그의 신에 쏟고 미끄러졌다는 말도 안 한다. 그는 웃는다. 그 웃음이 뱃속에 있는 게 싫다. 미움이 살 곳이 아닌데. 곡식 기둥에서 멈춰, 따라왔나 듣는다. 안 왔다. 그게 더 나쁘다.'
	),
	d(
		'sosuno',
		S,
		['Watch your feet.', 'Or don’t. Drown. I don’t care.', 'Stop smiling like I did you a favor.'],
		['발 조심해요.', '아니면 말든가. 빠져 죽든가. 상관없어요.', '호의해 준 얼굴 하지 마요.']
	),
	d(
		'jumong',
		J,
		['Favor? Lady, that was a declaration.', 'I’m flattered.', 'I’ll wring the sleeve. You can keep being mean. It suits you.'],
		['호의? 그건 선언이오, 부인.', '영광이오.', '소매는 짜겠소. 독하게 있으시오. 잘 어울리니까.']
	),
	d(
		'sosuno',
		S,
		['I— that’s not— you—', 'Big idiot.', 'If you say suits me again I’ll dump the next one on your head.'],
		['그건— 아니라— 당신—', '이 큰 바보.', '또 어울린다 하면 다음엔 머리에 쏟아요.']
	),
	d('jumong', J, ['Looking forward to it.'], ['기대하고 있겠소.']),
	scene('The Well', '우물'),
	p(
		'The well is always the same well: round stone rim, one timber beam across the mouth, hemp rope, two buckets on packed earth, grey giwa hall in the back, grain porch to the left. Nobody stands in the shaft. They keep meeting there as if the rim were a coincidence. <b>The well is an accident she timed.</b>',
		'우물은 늘 그 우물이다. 둥근 돌 테, 입구를 가로지른 나무 들보 하나, 삼 줄, 다진 흙 위 두레박 둘, 뒤의 회색 기와 대청, 왼쪽 곡식 누대. 아무도 우물 안에 서지 않는다. 테두리가 우연인 것처럼 거기서 만난다. <b>우물은 그녀가 맞춘 우연이다.</b>'
	),
	d(
		'jumong',
		J,
		['Rope’s being a villain.', 'Want me to—', 'Or you can scowl at it. Also works. I’ve seen you do both.'],
		['줄이 못됐소.', '잡아 드릴까.', '아니면 흘겨보셔도 되고. 둘 다 하는 거 봤소.']
	),
	d(
		'sosuno',
		S,
		['Draw or don’t.', 'Talking doesn’t fill it.', 'And my name isn’t for you yet.', '…Sosuno. There. Water.'],
		['뜨든가 말든가.', '말로 안 차요.', '이름도 아직 당신 거 아니에요.', '…소서노요. 됐어요. 물.']
	),
	d(
		'jumong',
		J,
		['Sosuno.', 'Nice. Fits the scowl.', 'Your ears are pink.'],
		['소서노.', '좋네. 흘겨보는 얼굴이랑 맞소.', '귓불이 분홍이오.']
	),
	d(
		'sosuno',
		S,
		['Wind.', 'There’s— don’t look at my ears.', 'Big idiot. Pull.'],
		['바람이에요.', '바람— 귀 보지 마요.', '이 큰 바보. 당기세요.']
	),
	d(
		'jumong',
		J,
		['There’s no wind.', 'You waited.', 'I can tell because the bucket’s already wet and you’re pretending it isn’t.'],
		['바람 없소.', '기다렸잖소.', '두레박이 벌써 젖었는데 아닌 척해서 알아오.']
	),
	d(
		'sosuno',
		S,
		['I was here first.', 'That’s not waiting. That’s water.', 'Don’t mhm. If you mhm I will—', 'Just pull.'],
		['내가 먼저였어요.', '기다린 거 아니에요. 물이에요.', '음 하지 마요. 음 하면 나—', '그냥 당기세요.']
	),
	p(
		'He keeps ending up thirsty at the same hour. She keeps being there, rude, pink, calling him idiot with a voice that wants something else. On the fourth morning he stops pretending the rope is the problem. They are both on packed earth at the rim. <b>He kisses her at the well-beam.</b>',
		'같은 시각에 목이 마르고, 같은 우물에 그녀가 있다. 독하고, 분홍이고, 바보라고 하면서 다른 걸 원하는 목소리. 나흘째 아침에 줄이 문제인 척을 그만둔다. 둘 다 다진 흙, 우물 가. <b>우물 들보에서 입을 맞춘다.</b>'
	),
	p(
		'She does not pull away first. When she turns, the dusty-rose is wet at the waist from the rope and <b>the back is the picture</b> — a column, a look over the shoulder at the man who used the beam. He is still not in the shaft. He is grinning like a fool who got away with it.',
		'먼저 떼지 않는다. 돌아서면 회분홍이 허리에서 줄에 젖어 있고 <b>등이 그림이다</b> — 기둥, 들보를 쓴 남자를 넘겨보는 눈. 그는 아직 우물 안이 아니다. 된 놈처럼 웃는다.',
		true
	),
	d(
		'sosuno',
		S,
		['You—', 'At my father’s well—', 'How dare you. How— I am going to kill you.', 'After the bucket. Move.'],
		['당신—', '아버지 우물에서—', '어떻게 감히. 어떻게— 죽일 거예요.', '두레박 다음에. 비키세요.']
	),
	d(
		'jumong',
		J,
		['I’ll apologize to the well.', 'You kissed back, by the way.', 'Just so the well has the facts.'],
		['우물엔 사과하겠소.', '참고로 부인도 따라왔소.', '우물이 사실을 알아야지.']
	),
	d(
		'sosuno',
		S,
		['I did not.', 'That was— surprise.', 'Don’t look at me like that. Big idiot.', 'The second bucket isn’t full. That’s all I said.'],
		['안 했어요.', '그건— 놀라서.', '그렇게 보지 마요. 이 큰 바보.', '둘째 두레박이 안 찼어요. 그게 다예요.']
	),
	d(
		'jumong',
		J,
		['Mm.', 'I’ll wait for the bucket.', 'Not leaving. You can keep threatening murder. It’s cute.'],
		['음.', '두레박 기다리겠소.', '안 가요. 죽인다는 말은 계속해도 되오. 귀여우니까.']
	),
	d(
		'sosuno',
		S,
		['Cute—', 'I will dump your head.', 'Stop saying cute. Stop— your mouth.', 'I hate that. I hate that I— ugh. Draw.'],
		['귀엽—', '머리에 쏟을 거예요.', '귀엽다 하지 마요. 그 입— 그만.', '싫어요. 내가— 하. 뜨세요.']
	),
	p(
		'He has been collecting her collecting. From the grain-porch post, a cloth: thread off his sleeve, a fletch he dropped, well-rope, a scrap of headband. He holds it up like a joke that might not be one. <b>You hide these like a thief.</b>',
		'소서노가 모아 온 것을 주몽이 모아 왔다. 곡식 누대 기둥의 보자기 — 소매 실, 떨어뜨린 깃, 우물 새끼, 머리띠 조각. 농담인 척 들어 올린다. <b>도둑처럼 숨겼구나.</b>'
	),
	d(
		'jumong',
		J,
		['So.', 'Either the mice in this hall have excellent taste,', 'or you keep my headband under the sacks.', 'Four of them. You hide these like a thief.'],
		['자.', '이 대청 쥐가 취향이 좋든지,', '아니면 가마니 밑에 내 머리띠를 두든지.', '네 개요. 도둑처럼 숨겼소.']
	),
	p(
		'She goes so red the dusty-rose looks pale. She snatches and misses. <b>Those are… inventory.</b>',
		'얼굴이 너무 달아 먼지로즈가 창백해 보인다. 뺏으려다 놓친다. <b>재고예요….</b>'
	),
	d(
		'sosuno',
		S,
		['Those are— inventory.', 'Grain. Trash. I’ll burn them.', 'Don’t— don’t grin. If you grin I can’t talk.', 'Give— give it—'],
		['그건— 재고예요.', '곡식. 쓰레기. 태울 거예요.', '웃지 마요. 웃으면 말 못 해요.', '내놔— 요—']
	),
	d(
		'jumong',
		J,
		['Inventory. Sure.', 'You blush pretty when you’re lying.', 'Want me to put it back so you can steal it again?'],
		['재고. 그래요.', '거짓말할 때 예쁘게 빨개지오.', '다시 넣어 드릴까. 또 훔치게.']
	),
	d(
		'sosuno',
		S,
		['I wasn’t— I’m not— you—', 'Big idiot. Shut up.', 'That isn’t— funny—'],
		['아니라— 아니— 당신—', '이 큰 바보. 닥쳐요.', '안— 웃겨요—']
	),
	p(
		'He stops smiling. Not angry — done asking buckets to speak. He unslings the bow and lays it on packed earth at the well-rim. Then he walks. <b>He leaves the bow on packed earth.</b>',
		'웃음을 접는다. 화가 아니다 — 두레박이 대신 말해주길 그만둔다. 활을 풀어 우물 가 다진 흙 위에 놓는다. 그리고 걷는다. <b>활을 다진 흙 위에 두고 간다.</b>'
	),
	d(
		'jumong',
		J,
		['Alright.', 'You keep the numbers.', 'Bow stays. I don’t.', 'Tell the millet I said thanks.'],
		['그래.', '숫자는 부인이 세고.', '활은 두고. 나는 안 남고.', '조한테 고맙다고 전해주시오.']
	),
	p(
		'She does not call stay. She picks the bow up too fast, furious at her own hands. One arrow. The timber well-beam beside his ear takes it. The hall hears the wood. He stops. <b>She puts an arrow in the beam.</b>',
		'남으라는 말은 안 한다. 틀린 셈을 집듯 활을 집는다 — 너무 빠르고, 제 손이 밉다. 화살 하나. 귀 옆 우물 들보가 받는다. 대청이 나무를 듣는다. 그가 멈춘다. <b>들보에 화살을 박는다.</b>'
	),
	d(
		'sosuno',
		S,
		['Wait— wait wait wait—', 'If you take one more step I— I wasn’t aiming at you.', 'I was aiming at you leaving.', 'Don’t. Don’t turn around yet. If you look I can’t—'],
		['기다려요— 잠깐 잠깐—', '한 발만 더 가면 나— 당신을 쏜 거 아니에요.', '가는 걸 쏜 거예요.', '아직 돌아보지 마요. 보면 말 못 해요—']
	),
	p(
		'The confession comes like a tooth she has been biting since the porch. She looks at dirt, at the bow, at his ear the arrow almost loved. Not at his mouth. <b>I wasn’t going to say it.</b>',
		'고백은 누대부터 깨물고 있던 이처럼 나온다. 흙을 본다. 활을 본다. 화살이 거의 사랑한 귀를 본다. 입은 안 본다. <b>말하려고 한 적 없어요.</b>'
	),
	d(
		'sosuno',
		S,
		[
			'I wasn’t going to say it.',
			'I was going to let you be stupid and leave.',
			'Then you put the bow down like a— like a speech, and I—',
			'I. Want. You.',
			'There. From the hall. Your dumb back. I counted the same sack three times.',
			'Don’t make me— I can’t do it twice.',
			'Big idiot. Stay. Or I’ll shoot the other ear.'
		],
		[
			'말하려고 한 적 없어요.',
			'바보인 채로 가게 둘 뻔했어요.',
			'그런데 활을 내려놓는 게— 연설 같아서, 내가—',
			'원해요. 당신을.',
			'됐어요. 대청부터. 그 dumb한 등. 가마니 하나를 세 번 셌어요.',
			'두 번은 못 해요. 시키지 마요.',
			'이 큰 바보. 남아요. 아니면 다른 귀 쏘겠어요.'
		]
	),
	d(
		'jumong',
		J,
		[
			'There it is.',
			'You can look now. I’m very stay.',
			'Before you say don’t smirk — too late.',
			'Come here. Please. I’ve been thirsty since the shed.'
		],
		[
			'나왔네.',
			'이제 봐도 되오. 아주 남아 있소.',
			'웃지 말라고 하기 전에— 벌써.',
			'이리 오시오. 제발. 헛간부터 목말랐소.'
		]
	),
	p(
		'She hits his chest, once, not hard enough to mean it. Then she is on his mouth like she is angry at it. They do not make it to a feast, or a pine, or her father’s permission. The grain-room door is closer than pride. <b>The first time is the grain room.</b>',
		'가슴을 한 대 친다. 진심이 되기엔 약하다. 그다음엔 입이 미운 것처럼 그 입에 간다. 잔치도, 소나무도, 아버지 허락도 없다. 자존심보다 곡식방 문이 가깝다. <b>첫밤은 곡식방이다.</b>',
		true
	),
	p(
		'Dusty-rose hiked, her back to him against the sacks — the chieftain’s daughter’s spine, then the shy shake under it. He teases the name she just gave him. She hates that it works. The hide splits. <b>since the first time</b>',
		'회분홍이 걷히고, 가마니에 등을 댄다 — 족장의 딸의 등뼈, 그 아래 수줍은 떨림. 방금 준 이름을 놀린다. 통하는 게 싫다. 껍질이 찢어진다. <b>처음 본 그날부터</b>',
		true
	),
	d(
		'jumong',
		J,
		['Say it again.', 'Not the bucket. Me.', 'You can still call me idiot. I like that one.'],
		['한 번 더.', '두레박 말고. 나.', '바보라고 해도 돼. 그거 좋거든.'],
		true
	),
	d(
		'sosuno',
		S,
		[
			'Don’t— don’t say my name like that—',
			'I hate you. I don’t. Don’t stop—',
			'Big— ah— idiot— your—',
			'I’ve been— since the porch— your back—'
		],
		['그렇게 이름 부르지 마요—', '미워요. 아니에요. 멈추지 마요—', '이 큰— 아— 바보— 당신—', '누대부터— 등—'],
		true
	),
	d(
		'sosuno',
		S,
		[
			'Give me— all of it— don’t you dare pull out—',
			'AHH— DON’T STOP—',
			'DUMB BIG IDIOT—',
			'DUMB— BIG— IDIOT— FILL ME—'
		],
		['다 줘요— 빼지 마요—', '아아— 멈추지 마—', '이 멍청한 큰 바보야—', '이 멍청한— 큰— 바보야— 채워—'],
		true
	),
	d(
		'jumong',
		J,
		['That’s it—', 'Louder.', 'I’ve got you.', 'Take it—'],
		['그래—', '더 크게.', '잡고 있소.', '받아—'],
		true
	),
	p(
		'He spends in her against the grain sacks — messy, the dusty-rose already ruined at the hip. She laughs into timber because the count is gone and she did that on purpose. Naked back, spent, hair wrecked. Tonight she just wants the next one.',
		'곡식 가마니에 대고 싼다 — 지저분하고, 회분홍은 이미 허리에서 망가졌다. 셈이 없어져서 들보에 웃는다. 일부러다. 벗은 등, 다 씀, 머리 헝클어짐. 오늘 밤은 다음이 고프다.',
		true
	),
	d(
		'sosuno',
		S,
		['…Don’t look at my back like that.', 'I’m a chieftain’s daughter.', 'I’m not— shy.', '…Shut up. You didn’t say anything. I know.'],
		['…등 그렇게 보지 마요.', '족장 딸이에요.', '수줍은 거 아니에요.', '…닥쳐요. 말 안 했잖아요. 알아요.']
	),
	d(
		'jumong',
		J,
		['Didn’t say a word.', 'Your back’s doing a whole speech, though.', 'Come here. Second bucket. Metaphorically.'],
		['말 안 했소.', '등이 연설 중이오.', '이리. 둘째 두레박. 비유로.']
	),
	d(
		'sosuno',
		S,
		['If you say bucket in this room again I will actually kill you.', '…Stay.', 'Not because you asked. Because I said.'],
		['이 방에서 두레박 한 번만 더 말하면 진짜 죽여요.', '…남아요.', '당신이 청해서가 아니에요. 내가 말해서.']
	),
	p(
		'Tabal has been on the porch since before the arrow. He looks like a man who bit a persimmon too early. In the morning he makes it public, so no one can say the weight was a private accident. <b>I am not pleased. I am also not blind.</b>',
		'연타발은 화살 전부터 누대에 있었다. 감이 너무 일찍 온 얼굴. 아침이 되면 공개한다. 무게가 사사로운 사고였다고 말할 수 없게. <b>안 기쁘다. 눈은 있다.</b>'
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
		'<b>The pine is a hundred paces.</b> Packed earth. One tree. The hall behind them, giwa catching late light. Sosuno on the porch rail, knuckles white, pretending she is only here for the count. Chin up. Chieftain’s daughter. The blush is none of the hall’s business.',
		'<b>소나무는 백 보다.</b> 다진 흙. 나무 하나. 등 뒤의 대청, 늦은 빛을 받는 기와. 소서노는 누대 난간에 있다. 손마디가 하얗다. 셈하러 온 척. 턱. 족장의 딸. 붉어진 얼굴은 대청 일이 아니다.'
	),
	p(
		'The best men hit bark. Tabal hits the knot he named. Jumong does not aim at the knot. He splits Tabal’s arrow down the shaft — so cleanly the hall hears the wood cry before it sees the feather still trembling. <b>The hall hears the wood cry.</b>',
		'장수들은 껍질을 맞힌다. 연타발은 자신이 짚은 옹이를 맞힌다. 주몽은 옹이를 조준하지 않는다. 연타발의 화살을 자루째 가른다 — 깃털이 떨리기도 전에 대청이 나무 우는 소리를 들을 만큼 깨끗하게. <b>대청이 나무 우는 소리를 듣는다.</b>'
	),
	d('jumong', J, ['…Ash does not look like this.', 'See? Still smiling.', 'Shed roof was honest. This is just showing off.'], [
		'…재는 이렇게 안 생겼소.',
		'봐. 아직 웃고 있소.',
		'헛간 지붕은 정직했소. 이건 그냥 자랑이오.'
	]),
	p(
		'Silence. Then Tabal laughs — short, unwilling, the laugh of a man whose suspicion has just been outshot. Sosuno’s hand is already on the porch rail.',
		'침묵. 이윽고 연타발이 웃는다 — 짧고, 마지못해, 의심이 활에 진 사내의 웃음. 소서노의 손은 이미 누대 난간에 있다.'
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
		['The bow is the bow.', 'Don’t look at me like that.', 'I only— lost the count.', 'Big idiot. Stop smiling.'],
		['활은 활이고요.', '그렇게 보지 마세요.', '전 그냥— 셈이 틀린 거예요.', '이 큰 바보. 웃지 마요.']
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
		'The marriage is real hunger first — already spent in the grain room — and only afterwards the alliance Tabal can explain to the other chieftains without sounding like a man who was outshot by his future son-in-law. Nights still belong to the ledger staying open longer than it needs to.',
		'혼인은 먼저 진짜 허기다 — 곡식방에서 이미 썼고 — 그다음에야, 연타발이 다른 족장들에게 «사위한테 활로 진 사람»처럼 들리지 않게 설명할 수 있는 동맹이다. 밤은 여전히, 필요 이상으로 열린 장부의 몫이다.'
	),
	d(
		'jumong',
		J,
		['Wife.', 'Close the ledger.', 'I can’t see the numbers.', 'Your throat. Brighter than the lamp. Sorry.'],
		['부인.', '장부 덮으시오.', '숫자 안 보이오.', '목 때문에. 촛불보다 밝아서.']
	),
	d(
		'sosuno',
		S,
		['I am not your wife yet.', 'Don’t call me that. My hands shake.', 'Do you need the counting hand, or me.', 'Don’t ask if you know.', '…Big idiot.'],
		['아직 아내 아닌데요.', '그렇게 부르지 마요. 손 떨리잖아요.', '세는 손이 필요해요, 아니면 나예요.', '답 알고 묻지 마요.', '…이 큰 바보.']
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
	)
];

// Fix leftover English in Korean confession line
mid.find((b) => b.lines?.some((l) => l.includes('dumb한'))) &&
	(mid.find((b) => b.lines?.some((l) => l.includes('dumb한'))).lines = mid
		.find((b) => b.lines?.some((l) => l.includes('dumb한')))
		.lines.map((l) => l.replace('그 dumb한 등', '그 멍청한 등')));

jumong.blocks = [...jumong.blocks.slice(0, iCave + 1), ...mid, ...jumong.blocks.slice(iFive)];

const WELL =
	'SAME LOCKED WELL every cut: round weathered granite rim, ONE timber beam across the mouth, hemp rope, two wooden buckets on packed earth at the rim, grey giwa timber hall behind, grain porch left. Nobody in the shaft. Natural dusk sky, crushed blacks, one hard key.';

const suffixNote =
	'2D animated cel-painterly cinema, not photoreal. FACE AND GARMENTS from attached portraits. Sosuno dusty-rose hanbok NOT gold; Jumong red silk #e8563f; Sosuno accent #e8a04a as rim only. No text. No watermark.';

function upsert(slot) {
	const i = jumong.images.findIndex((im) => im.id === slot.id);
	const base = {
		ratio: 1.778,
		tone: slot.tone ?? '#e8a04a',
		nsfw: !!slot.nsfw,
		at: slot.at,
		alt: slot.alt,
		refs: slot.refs,
		people: slot.people,
		prompt: slot.prompt
	};
	if (i >= 0) jumong.images[i] = { ...jumong.images[i], ...base, id: slot.id };
	else jumong.images.push({ id: slot.id, ...base });
}

const chJ = '/ch_jumong.png';
const chS = '/ch_sosuno.png';
const bnS = '/bn_sosuno.png';
const chT = '/ch_yeon_tabal.png';

const slots = [
	{
		id: 'jumong-seq-scouts-wide',
		at: 'Jolbon scouts find him first',
		alt: 'Bird’s-eye dusk pines: tiny red Jumong, two spear-scouts closing, no army catalog',
		tone: '#e8563f',
		people: ['jumong'],
		refs: [chJ],
		prompt: `Minimal iconic 16:9 still. BIRD’S-EYE dusk pine forest. ONE device: a dark pine-net V closing on a tiny red figure in the lower third. Jumong mid-stumble, bow lowered. Two tiny Yeon scouts with spears, no faces to invent. ${suffixNote} HIGH CONTRAST. No army.`
	},
	{
		id: 'jumong-seq-scouts-ots',
		at: 'You’ll get Tabal',
		alt: 'OTS: a scout’s spear in sharp foreground, Jumong grinning in bokeh, pines',
		tone: '#e8563f',
		people: ['jumong'],
		refs: [chJ],
		prompt: `Minimal iconic 16:9 still. OVER-SHOULDER. Sharp spear-haft foreground, Jumong midground easy grin, FACE from attached, red silk #e8563f. Pines melting to bokeh. ONE device: the spear as a hard diagonal. ${suffixNote}`
	},
	{
		id: 'jumong-seq-tabal-ledger',
		at: 'Tabal shows him the valley like a ledger',
		alt: 'Wide dusk: Tabal on the porch pointing the valley; Jumong tiny in packed earth',
		tone: '#a97c4a',
		people: ['yeontabal', 'jumong'],
		refs: [chT, chJ],
		prompt: `Minimal iconic 16:9 still. DUTCH WIDE dusk. Jolbon timber hall as a dark wedge, grey giwa. Tabal on the porch mid-point, FACE AND GARMENTS from ch_yeon_tabal. Jumong a red lower-third speck. ONE device: the porch beam as a hard horizontal. ${suffixNote} Earth: real timber, packed earth.`
	},
	{
		id: 'jumong-seq-tabal-use',
		at: 'The millet likes you. I don’t.',
		alt: 'Worm’s-eye: Jumong full-draw on a boar in millet; Tabal tiny on the porch weighing',
		tone: '#a97c4a',
		people: ['jumong', 'yeontabal'],
		refs: [chJ, chT],
		prompt: `Minimal iconic 16:9 still. WORM’S-EYE. Jumong mid full-draw, FACE from ch_jumong, red silk. A single boar in millet, not a hunt catalog. Tabal a tiny porch silhouette. ONE device: the bow as a hard black arc. ${suffixNote}`
	},
	{
		id: 'sosuno-seq-tough-chin',
		at: 'She prices him, then forgets the count',
		alt: 'Low dutch: Sosuno chin-up on the grain porch, dusty-rose, independent, Jumong tiny in yard',
		people: ['sosuno', 'jumong'],
		refs: [chS, bnS, chJ],
		prompt: `Minimal iconic 16:9 still. LOW DUTCH. Sosuno mid-count on grain porch, chin up, tough chieftain’s daughter, dusty-rose hanbok from portrait NOT gold, binyeo from attached. Jumong a tiny red figure in the yard bokeh. ONE device: porch post as a vertical. ${suffixNote}`
	},
	{
		id: 'sosuno-seq-shy-back',
		at: 'She blushes at his back',
		alt: 'OTS from Sosuno: her bitten mouth and blush ECU; Jumong’s red back in creamy bokeh',
		people: ['sosuno', 'jumong'],
		refs: [chS, bnS, chJ],
		prompt: `Minimal iconic 16:9 still. ECU OVER-SHOULDER. Sosuno bitten mouth, heavy blush, wanting eyes, FACE from ch_sosuno, binyeo attached. Jumong’s red back midground, rack-focus. ONE device: her sleeve as a dusty-rose plane. ${suffixNote} Intimate/close.`
	},
	{
		id: 'jumong-seq-well-bird',
		at: 'The well is an accident she timed',
		alt: 'Bird’s-eye: round stone well, timber beam, two tiny figures at the rim, giwa hall',
		people: ['jumong', 'sosuno'],
		refs: [chJ, chS, bnS],
		prompt: `Minimal iconic 16:9 still. BIRD’S-EYE exposition. ${WELL} Tiny Jumong and Sosuno at the rim, lower-third emptiness. ONE device: the circular rim as a stamp. ${suffixNote}`
	},
	{
		id: 'jumong-seq-well-ecu-rope',
		at: 'Rope’s being a villain',
		alt: 'ECU: two hands on hemp rope over the timber well-beam, buckets bokeh',
		people: ['jumong', 'sosuno'],
		refs: [chJ, chS],
		prompt: `Minimal iconic 16:9 still. ECU rack-focus. Sharp hemp rope and two hands on the timber well-beam; stone rim bokeh. ${WELL} ONE device: the rope as a hard diagonal. ${suffixNote}`
	},
	{
		id: 'jumong-seq-well-wide',
		at: 'The well is an accident she timed',
		alt: 'Dutch wide dusk: SAME Jolbon well, beam, two buckets, Jumong and Sosuno at the rim',
		people: ['jumong', 'sosuno'],
		refs: [chJ, chS, bnS],
		prompt: `Minimal iconic 16:9 still. DUTCH WIDE dusk. ${WELL} Jumong and Sosuno at the rim, dramatic bodies not portraits. ONE device: timber beam as a hard horizontal. ${suffixNote}`
	},
	{
		id: 'jumong-seq-well-topdown',
		at: 'Your ears are pink',
		alt: 'Top-down: Sosuno’s blushing face and dusty-rose shoulders over the dark well-mouth',
		people: ['sosuno'],
		refs: [chS, bnS],
		prompt: `Minimal iconic 16:9 still. TOP-DOWN. Sosuno leaning over the dark well-mouth, blush, bitten lip, FACE from ch_sosuno, binyeo, dusty-rose NOT gold. ${WELL} ONE device: the black well-disc. ${suffixNote} Intimate.`
	},
	{
		id: 'nsfw-sosuno-naked-back',
		nsfw: true,
		at: 'the back is the picture',
		alt: 'OTS: Sosuno’s bare back at the well-beam, dusty-rose fallen to the hips, look over the shoulder',
		people: ['sosuno', 'jumong'],
		refs: [chS, bnS, chJ],
		prompt: `Intimate 16:9 still. OVER-SHOULDER from behind. Sosuno’s naked back filling the frame, dusty-rose silk fallen to the hips, look over the shoulder, heavy blush, wanting mouth, FACE from ch_sosuno, binyeo in hair. Jumong a red bokeh at the rim. ${WELL} Bodies on packed earth, not in the shaft. ONE device: her spine as a vertical. Skin-forward, manhwa panel, not serene. ${suffixNote}`
	},
	{
		id: 'nsfw-sosuno-grain-back',
		nsfw: true,
		at: 'The first time is the grain room',
		alt: 'OTS: Sosuno’s naked back against grain sacks, dusty-rose hiked, Jumong behind her',
		people: ['sosuno', 'jumong'],
		refs: [chS, bnS, chJ],
		prompt: `Intimate 16:9 still. OVER-SHOULDER. Sosuno’s naked back and hiked dusty-rose against grain sacks, looking back, wrecked wanting face from ch_sosuno, binyeo. Jumong behind her, FACE from ch_jumong, red silk open. Timber grain-room, one lamp, crushed black. ONE device: the sack-stack as a wedge. Manhwa panel, heavy blush, climax-adjacent. No text.`
	},
	{
		id: 'nsfw-sosuno-dumb-idiot',
		nsfw: true,
		at: 'DUMB BIG IDIOT',
		alt: 'ECU: Sosuno screaming, wrecked pleasure face, dusty-rose off one shoulder',
		people: ['sosuno'],
		refs: [chS, bnS],
		prompt: `Intimate 16:9 still. ECU. Sosuno screaming pleasure, ahegao-adjacent, heavy blush, tears, bitten-open mouth, FACE from ch_sosuno, binyeo, dusty-rose off one shoulder. Grain-room bokeh. ONE device: her open mouth as the frame’s center. Manhwa panel, sweaty, not cute smile. No text. No watermark.`
	}
];

for (const s of slots) upsert(s);

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('patched Jumong mid +', slots.length, 'slots');
