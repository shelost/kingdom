// Harmony Council: open in 636 at the Hwarang yard, war drums, the council night as a flashback,
// then Jade Gate Valley (Alchun and Bidam against Uso). Folds Seung's Jade Gate flashback into it.
// Idempotent: skipped when the yard scene is already there.
import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';

const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (person, en, lines) => ({ kind: 'dialogue', person, lines, en });
const extra = (speaker, chip, en, lines) => ({ kind: 'dialogue', chip, speaker, gender: 'm', lines, en });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const A = (en, ko) => d('alchun', en, ko);
const B = (en, ko) => d('bidam', en, ko);
const Y = (en, ko) => d('yushin', en, ko);
const monk = (en, ko) => extra('The Monk', '#8a7f6a', en, ko);
const uso = (en, ko) => extra('Uso', '#b88a3a', en, ko);
const cadet = (en, ko) => extra('A Hwarang of Class 77', '#7fa7c9', en, ko);
const nangdo = (en, ko) => extra('A Nangdo', '#9a8f7a', en, ko);

const YARD = [
	p(
		'Four winters into the reign, nobody in Surabol says “ridiculous” out loud anymore. They say it in corridors.',
		'즉위하고 네 해. 서라벌에서 이제 아무도 ‘웃기지도 않는다’는 말을 대놓고 하지 않는다. 복도에서만 한다.'
	),
	scene('The Yard', '연무장'),
	p(
		'Midwinter. The Hwarang yard below the Moon Palace is frozen hard. Class 77 drills on it anyway, because nobody has told them they can stop.',
		'한겨울. 월성 아래 화랑 연무장은 꽁꽁 얼었다. 칠십칠기는 그래도 그 위에서 훈련한다. 그만해도 된다고 일러 준 사람이 없으니까.'
	),
	p(
		'On the yard rail sit three men who drilled on the same ground more than twenty years ago. The boys keep glancing over. They have heard the stories. They are not sure which ones are true.',
		'연무장 난간에 사내 셋이 앉아 있다. 스무 해도 더 전에 같은 땅에서 훈련하던 사내들이다. 아이들이 자꾸 그쪽을 흘끔거린다. 이야기는 들었다. 어느 게 참말인지는 모른다.'
	),
	A(
		['Four winters.', 'Four winters since that fire went out, and I still can’t feel my backside.'],
		['네 해다.', '그 불 꺼지고 네 해가 지났는데, 내 엉덩이는 아직도 감각이 없데이.']
	),
	B(['You remember Suljong’s face.', 'When the piece moved.'], ['술종 공 얼굴 기억하지.', '패가 옮겨 갈 때.']),
	A(['Like he’d swallowed the cup.'], ['잔을 통째로 삼킨 얼굴이었제.']),
	Y(['He said it again this morning. In the east corridor.'], ['오늘 아침에도 했소. 동쪽 복도에서.']),
	B(['Of course he did. Every morning for four years. It has become his prayer.'], ['당연하지. 네 해 동안 아침마다. 이제 그 양반 염불이 됐어.']),
	p(
		'Yushin is not looking at either of them. He is looking up the hill at the palace roofs, the way he does when he thinks nobody is counting.',
		'유신은 둘 중 누구도 보지 않는다. 언덕 위 궁 지붕을 보고 있다. 아무도 세지 않는다고 여길 때면 늘 그러듯이.'
	),
	A(
		['Oi. Marshal. She’s not going anywhere.', 'That palace has been in the same spot since the Founder. You can look at us for a minute.'],
		['어이, 대장군. 어데 안 간다.', '저 궁은 시조 때부터 그 자리에 있었다. 우리도 좀 봐 주라, 잠깐.']
	),
	Y(['I face where my orders come from.'], ['나는 명이 오는 쪽을 보오.']),
	B(
		['Orders. Did you hear that, Alchun? He calls her orders.', 'A lotus faces the sun too, Marshal. Nobody calls that duty.'],
		['명이라. 들었나, 알천? 저 사람은 그분을 명이라 부르네.', '연꽃도 해를 향하오, 대장군. 그걸 충성이라 부르는 사람은 없소.']
	),
	Y(['Her Majesty—', '…The queen gives the orders. That is all I said.'], ['폐하께서—', '…명은 여왕께서 내리시오. 내 말은 그뿐이오.']),
	A(
		['“Her Majesty—”', 'Twenty years he’s been starting that sentence. Never once finished it.'],
		['“폐하께서—”', '스무 해째 저 말을 꺼내기만 하고, 한 번을 못 끝맺는다 아이가.']
	),
	p(
		'Down on the ice, a boy from Class 77 drops his practice sword. Nobody laughs at him. Everybody is listening to the Marshal not answer.',
		'얼음판 위에서 칠십칠기 아이 하나가 목검을 떨어뜨린다. 아무도 웃지 않는다. 다들 대장군이 대답하지 않는 소리를 듣고 있다.'
	),
	B(['I stood first that night, you know. Before either of you.'], ['그날 밤 내가 먼저 일어섰지. 자네들 누구보다.']),
	Y(['You stood first.'], ['먼저 일어섰소.']),
	A(['And I stood for a tiger. Don’t start, the pair of you.'], ['나는 호랑이 땜에 일어섰고. 둘 다 시작하지 마래이.']),
	p(
		'Then a drum. Not the hour drum. It comes from the palace, slow, then again. The next hill picks it up, and the next, until the whole west is answering.',
		'그때 북이 운다. 시각을 알리는 북이 아니다. 궁에서 느리게 한 번, 또 한 번. 옆 언덕이 받고, 그다음 언덕이 받아, 서쪽 전체가 대답한다.'
	),
	p('On the ice, forty boys stop at once.', '얼음판 위에서 아이 마흔이 한꺼번에 멈춘다.'),
	Y(['That is a muster.'], ['소집이오.']),
	A(['In midwinter? Who marches in this?'], ['한겨울에? 누가 이 날씨에 군사를 내노.']),
	B(['Someone who wants us to believe nobody would.'], ['아무도 안 낼 거라고 우리가 믿기를 바라는 누군가겠지.']),
	p(
		'Yushin is already off the rail and walking up the hill toward the palace. He does not run. He walks very fast.',
		'유신은 벌써 난간에서 내려와 궁 쪽 언덕을 오르고 있다. 뛰지는 않는다. 아주 빨리 걷는다.'
	),
	A(['See? Orders.'], ['봐라. 명 오는 쪽.']),
	B(
		['Let him go to her. Somebody should go and see what she has heard.', 'You. You. And you, with the mended sleeve. Horses, not poems. Now.'],
		['가게 둬. 누군가는 그분이 뭘 들으셨는지 보러 가야지.', '너. 너. 그리고 소매 기운 너. 시는 두고 말을 끌고 와. 지금.']
	),
	p(
		'Six boys run for the stables before he finishes. They have waited their whole lives for one of those three to point at them.',
		'말이 끝나기도 전에 아이 여섯이 마구간으로 뛴다. 평생 저 셋 중 하나가 자기를 가리켜 주기를 기다려 온 아이들이다.'
	),
	p(
		'Riding west in the last of the light, Alchun laughs at nothing. Bidam knows what the nothing is. Four winters ago, the two of them sat all night by a brazier and made a queen.',
		'마지막 햇빛 속에서 서쪽으로 달리다가, 알천이 아무것도 아닌 일에 웃는다. 비담은 그 아무것도 아닌 게 뭔지 안다. 네 해 전, 둘은 밤새 화로 곁에 앉아 여왕을 만들었다.'
	)
];

const VALLEY = [
	scene('Jade Gate Valley', '옥문곡'),
	{
		kind: 'place',
		place: 'jade_gate_valley',
		html: 'A valley west of the capital with a polite name. Ask a scholar what a jade gate is and watch him find something interesting on the ceiling.',
		ko: '도성 서쪽, 이름만은 점잖은 골짜기. 학자에게 옥문이 무슨 뜻이냐고 물어보라. 그는 갑자기 천장에서 볼 게 생긴다.'
	},
	p(
		'Night is down by the time they reach the valley mouth, and a fog with it. Bidam stops the boys with one raised hand.',
		'골짜기 어귀에 닿을 즈음엔 밤이 내렸고, 안개도 함께 내렸다. 비담이 손 하나를 들어 아이들을 세운다.'
	),
	p('Smoke where there should be no smoke. Five hundred men can hide in a valley. They cannot hide their supper.', '연기가 날 리 없는 데서 연기가 난다. 사내 오백은 골짜기에 숨을 수 있다. 저녁밥은 못 숨긴다.'),
	p(
		'Down the road out of the valley comes a monk with a bundle of firewood and a string of beads. He is walking toward the capital at an hour when monks are asleep.',
		'골짜기에서 나오는 길로 중 하나가 장작 한 짐과 염주 한 줄을 들고 내려온다. 중들이 잠든 시각에 도성 쪽으로 걷고 있다.'
	),
	monk(['Amitabha. A cold night for riders, young lords.'], ['나무아미타불. 말 타기엔 추운 밤이옵니다, 도령님들.']),
	B(['It is. Sit a moment, brother. Say the Heart Sutra with me, for the cold.'], ['춥지요. 잠깐 앉으시오, 스님. 추위 쫓게 반야심경이나 같이 외웁시다.']),
	p(
		'The monk begins. He is fluent for three lines. On the fourth, his thumb moves a bead his mouth has not reached.',
		'중이 외기 시작한다. 세 줄까진 유창하다. 넷째 줄에서, 입이 닿지도 않은 염주알을 엄지가 넘긴다.'
	),
	B(['You are a bead short, brother.', 'Monks count. Spies only carry.'], ['염주알이 하나 모자라오, 스님.', '중은 세고, 간자는 들고 다닐 뿐이지.']),
	p(
		'The firewood hits the snow. Alchun has him by the collar before he finishes turning. None of the boys saw Alchun get off his horse.',
		'장작이 눈 위로 떨어진다. 몸을 다 돌리기도 전에 알천이 그의 멱살을 쥐고 있다. 알천이 말에서 내리는 걸 본 아이는 하나도 없다.'
	),
	A(['How many. Where. Who’s in charge.', 'Quick, I’m freezing.'], ['몇이고. 어데고. 대장은 누고.', '빨리 말해라, 춥다.']),
	monk(['…Five hundred. General Uso.', 'The hill fort behind you. From the back, at dawn.'], ['…오백입니다. 우소 장군.', '뒷산 성을. 뒤에서, 새벽에.']),
	p(
		'Bidam sends the boy with the mended sleeve back down the road at a gallop, to find whatever army the drums have raised. The other five lie on their bellies in the snow beside two men in their forties and look down into the valley.',
		'비담은 소매 기운 아이를 왔던 길로 달려 보낸다. 북소리가 일으킨 군사가 어디 있든 찾아오라고. 나머지 다섯은 마흔 줄 사내 둘 곁에 눈밭에 엎드려 골짜기를 내려다본다.'
	),
	p(
		'Below, the Baekje camp. They have marched four nights in the dark. Now, at the bottom of a valley nobody watches, their captain lets them loosen their saddles.',
		'아래에 백제 진이 있다. 나흘 밤을 어둠 속에 걸어왔다. 이제 아무도 지켜보지 않는 골짜기 바닥에서, 그들의 장수가 안장을 풀게 한다.'
	),
	A(['Bidam. Left ridge. I take the dry creek.', 'They’ve loosed their saddles. We’re not waiting on a committee.'], ['비담. 왼쪽 능선. 나는 마른 시내.', '저짝이 안장 풀었다. 위원회 안 기다린데이.']),
	B(['Finally. An enemy I am allowed to hate in public.', 'Alchun. On my mark.'], ['드디어 — 공공연히 미워해도 되는 적이다.', '알천. 내 신호에.']),
	p(
		'The army comes up the road behind them, two thousand men breathing smoke, and does not stop to be told anything. Two men walk out in front of it. That is all the order there is.',
		'뒤쪽 길로 군사가 올라온다. 입김을 연기처럼 뿜는 이천이다. 무엇을 들으려고 멈추지 않는다. 그 앞으로 사내 둘이 걸어 나간다. 명령은 그게 전부다.'
	),
	scene('Two of Class 51', '오십일기 둘'),
	p(
		'Bidam goes down the left ridge on foot, because horses are loud. His beads are looped on his sword wrist. They click once when he draws, and that is the last sound the first sentry hears.',
		'비담은 왼쪽 능선을 걸어서 내려간다. 말은 시끄러우니까. 염주가 칼 쥔 손목에 감겨 있다. 칼을 뽑을 때 한 번 딸깍한다. 첫 보초가 듣는 마지막 소리다.'
	),
	p(
		'He does not hurry. He moves through the camp the way he walks through a temple, courteous to the furniture. Men stand up in front of him and do not stay standing.',
		'그는 서두르지 않는다. 절집을 걷듯 진영을 지나간다. 세간에도 예의를 갖추면서. 그의 앞에서 일어선 사내들은 서 있지 못한다.'
	),
	p(
		'Alchun comes up the dry creek like a rockslide that has learned to swear. A Baekje captain sets a spear against him. Alchun takes the spear by the shaft, and then Alchun has a spear.',
		'알천은 욕을 배운 산사태처럼 마른 시내를 치고 올라온다. 백제 장교 하나가 창을 겨눈다. 알천이 창 자루를 잡는다. 그러자 창은 알천의 것이 된다.'
	),
	p(
		'A loose horse comes at him out of the smoke. He catches it by the bridle with one arm and turns it, the way he once turned a tiger, and rides it straight into the next fire.',
		'연기 속에서 고삐 풀린 말 한 마리가 그에게 달려든다. 그는 한 팔로 굴레를 잡아 말머리를 돌린다. 언젠가 호랑이를 돌리던 그 솜씨로. 그러고는 그 말을 타고 다음 모닥불로 곧장 들어간다.'
	),
	p(
		'On the ridge, the five boys have forgotten to draw. Behind them the nangdo of the army, farm sons with spears, have stopped at the valley lip in a long ragged line, the way people stop at a fire.',
		'능선 위의 아이 다섯은 칼 뽑는 것도 잊었다. 그 뒤로 군대의 낭도들이, 창을 든 농가 아들들이, 골짜기 턱에 길고 들쭉날쭉한 줄로 멈춰 서 있다. 사람들이 불구경할 때 멈추듯이.'
	),
	cadet(['Are they— is that what— are they always like that?'], ['저— 저게— 저분들 원래 저렇습니까?']),
	nangdo(['Shut up and watch, young lord.', 'You’ll be telling this when you’re old. Get it right.'], ['입 다물고 보이소, 도련님.', '늙어서 이 얘기 하실 낍니다. 똑바로 보이소.']),
	p(
		'Two thousand men find they have very little to do. Some will tell it for the rest of their lives. Most will get the numbers wrong. All of them will remember that it looked easy.',
		'이천 군사는 할 일이 별로 없다는 걸 안다. 몇몇은 남은 평생 이 얘기를 할 것이다. 대부분은 숫자를 틀리게 말할 것이다. 모두가 그게 쉬워 보였다는 것만은 기억할 것이다.'
	),
	scene('The Rock', '큰 돌'),
	p(
		'Uso climbs the biggest rock in the valley with a bow and a full quiver, and holds it alone. He is good. Every arrow finds somebody. Then the quiver ends before the argument does.',
		'우소는 활과 가득 찬 화살통을 들고 골짜기에서 제일 큰 바위에 올라가 혼자 버틴다. 솜씨가 좋다. 화살마다 누군가를 찾아간다. 그러다 화살이 먼저 바닥난다.'
	),
	uso(['Come up, then. One of you.', 'I’ll come down for a man. Not for a mob.'], ['올라와 봐유. 하나만.', '떼거리 말구, 사내 하나믄 내려가 줄 테니께.']),
	A(['Go on. You’re prettier.'], ['니 가라. 니가 더 곱다.']),
	B(['I am. Which is why I am staying clean.'], ['그렇지. 그러니 나는 깨끗이 있어야지.']),
	p(
		'Alchun climbs the rock with nothing in his hands. Uso has one arrow left and spends it. It goes through Alchun’s sleeve, which is the closest anyone comes all night. Alchun takes the bow off him like a father taking a toy, and carries the general of Baekje down the rock under one arm.',
		'알천은 빈손으로 바위를 오른다. 우소에게 화살이 하나 남았고, 그걸 쏜다. 화살은 알천의 소매를 뚫는다. 그 밤 누구라도 그에게 가장 가까이 간 것이 그것이다. 알천은 아비가 아이 장난감을 빼앗듯 활을 빼앗고, 백제의 장수를 한 팔에 끼고 바위를 내려온다.'
	),
	A(['We make a good pair when the target is outside the wall.'], ['과녁이 성 밖에 있으면, 우린 좋은 짝이제.']),
	B(['Inside the wall is still the sacred country.', '…I do not miss, either way.'], ['성 안도 여전히 신국이지.', '…어느 쪽이든, 나는 빗나가지 않네.']),
	p(
		'The boys of Class 77 ride home behind them in silence, which for boys that age is a kind of prayer. Tomorrow on the ice they will try to move like that, and fall down, and try again.',
		'칠십칠기 아이들은 그 뒤를 따라 말없이 돌아간다. 그 나이 사내아이에게 말없음은 일종의 기도다. 내일 얼음판 위에서 아이들은 저렇게 움직여 보려다 넘어지고, 또 해 볼 것이다.'
	),
	scene('The Queen’s Door', '여왕의 문'),
	p(
		'Alchun carries something to the queen’s door again, in his fist again, because again nobody has told him there is a box. A string of a hundred and seven beads.',
		'알천이 또 무언가를 여왕의 문 앞까지 들고 간다. 또 주먹에 쥐고. 또 아무도 함이 있다고 일러 주지 않았으니까. 백일곱 알짜리 염주 한 줄이다.'
	),
	d('sunduk', ['All of them?'], ['오백 다?']),
	A(['All five hundred, Majesty. And one monk who couldn’t count.'], ['오백 다요, 폐하. 셈 못 하는 중 하나까지.']),
	p(
		'Yushin is at the door. He has been at the door since the drums. Bidam notices, and for once says nothing. Alchun will later call it the bravest thing he saw all night.',
		'유신이 문 앞에 있다. 북이 울린 뒤로 줄곧 문 앞에 있었다. 비담은 그걸 보고도, 웬일로 아무 말도 하지 않는다. 알천은 나중에 그것이 그 밤 본 것 중 가장 용감한 일이었다고 말한다.'
	),
	p(
		'By spring the court has its own version. The queen heard frogs croaking in the palace pond in midwinter, and knew the valley, and the number. Ask the men who were there and they will tell you about a monk who was one bead short.',
		'봄이 되자 조정엔 조정의 이야기가 생긴다. 여왕이 한겨울 궁 연못에서 개구리 우는 소리를 듣고 골짜기와 그 숫자를 알아맞혔다고. 거기 있던 사내들에게 물어보면, 염주알 하나가 모자랐던 중 이야기를 해 줄 것이다.'
	)
];

const raw = fs.readFileSync(FILE, 'utf8');
const chapters = JSON.parse(raw);
const samhan = chapters.find((c) => c.id === 'samhan');
const council = samhan.entries.find((e) => e.title === 'Harmony Council');

if (council.blocks.some((b) => b.kind === 'scene' && b.label === 'The Yard')) {
	console.log('already applied');
	process.exit(0);
}

/* The council night (everything but the closing card) becomes the flashback. */
const closing = council.blocks.at(-1);
if (!/^<b>/.test(closing.html ?? '')) throw new Error('Harmony Council: last block is not the card');
const night = council.blocks.slice(0, -1);
if (!night[0].html.startsWith('One night earlier.')) throw new Error('Harmony Council: unexpected opening');
night[0] = p(
	'The night before the crowning. Six nobles, one brazier, and nobody stands up until they all agree.',
	'즉위 전날 밤. 귀족 여섯, 화로 하나. 뜻이 모두 같아질 때까지 아무도 일어서지 않는다.'
);
council.blocks = [...YARD, { kind: 'flashback', year: '632', title: 'The Harmony Council · 화백회의', blocks: night }, ...VALLEY, closing];
council.year = '636';
council.logline = {
	en: 'Four winters into the queen’s reign, war drums send two old Hwarang west, and the night they crowned her rides with them.',
	ko: '여왕 즉위 네 해째 겨울, 전고가 늙은 화랑 둘을 서쪽으로 내몬다. 그들이 여왕을 세운 그 밤도 함께 달린다.'
};

/* The previous episode's card now leads into the yard, not straight into the brazier. */
const queen = samhan.entries.find((e) => e.title === 'Queen Sunduk');
const qCard = queen.blocks.at(-1);
if (qCard.html.includes('six men around a brazier')) {
	qCard.html = '<b>Six men around a brazier argued over her crown all night. Four winters later, two of them are still arguing, until the war drums start…!</b>';
	qCard.ko = '<b>화로 앞의 사내 여섯이 밤새 그 왕관을 두고 다퉜다. 네 해 뒤, 그중 둘은 아직도 티격태격한다. 전고가 울리기 전까지는…!</b>';
}

/* Seung keeps the memory, not a second telling. */
const seung = chapters.find((c) => c.id === 'chunchu-era').entries.find((e) => e.title === 'Seung (承)');
const fb = seung.blocks.findIndex((b) => b.kind === 'flashback' && b.title?.startsWith('Jade Gate Valley'));
if (fb > 0) {
	seung.blocks.splice(fb, 1);
	seung.blocks[fb - 1] = p(
		'On the wall Bidam looks west and remembers a cleaner war: Jade Gate Valley, when the enemy still had the courtesy to be foreign, and Alchun climbed a rock for him without being asked.',
		'성벽 위에서 비담은 서쪽을 보며 더 깨끗했던 전쟁을 떠올린다. 옥문곡. 적이 아직 외국인이라는 예의를 지키던 때, 알천이 부탁받지 않고도 그를 위해 바위를 오르던 때.'
	);
}

fs.writeFileSync(FILE, JSON.stringify(chapters, null, '\t') + (raw.endsWith('\n') ? '\n' : ''));
console.log(`Harmony Council: ${council.blocks.length} top-level blocks; Seung flashback ${fb > 0 ? 'folded' : 'already gone'}`);
