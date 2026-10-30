// One-off: Suro contest race + far sighting; Onjo departure, last kiss, the long march south.
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const entry = (t) => story.flatMap((c) => c.entries ?? []).find((e) => e.title === t);

const P = (html, ko) => ({ kind: 'p', html, ko });
const D = (person, en, lines) => ({ kind: 'dialogue', person, lines, en });
const S = (speaker, gender, en, lines) => ({ kind: 'dialogue', speaker, gender, lines, en });
const SC = (label, ko) => ({ kind: 'scene', label, ko });

function expect(blocks, i, frag) {
	const s = JSON.stringify(blocks[i]);
	if (!s.includes(frag)) throw new Error(`block ${i} lacks ${frag}: ${s.slice(0, 120)}`);
}

/* ———————— Suro ———————— */
{
	const b = entry('Suro').blocks;
	expect(b, 172, 'Standing on my fish');
	expect(b, 169, 'She arrives on a red-sailed ship');
	expect(b, 159, 'On the fourth night the chiefs hold a feast');

	b.splice(173, 0,
		P('From four rows back she is a long way off: a violet shape at the waterline, half a beach and a hundred heads between them. It is far enough to see everything. Her skin is darker than anyone’s on this coast, burnt gold where the sun sits on it. Her silk is purple and cut close, to the waist, to the hip, and then exactly as much as it needs to be. She is wringing seawater out of her hem and arguing with her brother, and she has not looked at the beach once.',
			'네 줄 뒤에서 보면 그녀는 한참 멀다. 물가의 보랏빛 형체 하나, 그 사이에 해변 절반과 머리 백 개. 다 보기엔 충분한 거리다. 살결은 이 바닷가 누구보다 짙고, 햇빛이 앉은 자리는 그을린 금빛이다. 비단은 보라색이고 몸에 꼭 맞게 지었다. 허리까지, 엉덩이까지, 그리고 딱 필요한 만큼만. 그녀는 치맛단의 바닷물을 짜면서 오라비와 말다툼 중이고, 해변 쪽은 한 번도 보지 않았다.'),
		P('Suro would like it on record that he fell in love first. The rest of him arrives at the same moment and does not wait to be recorded. He starts walking.',
			'수로는 사랑에 먼저 빠졌다고 기록해 두고 싶을 것이다. 나머지 그는 같은 순간에 도착했고, 기록될 때까지 기다려 주지 않는다. 그는 걷기 시작한다.'),
		D('ijinasi', ['Brother. Brother— the contest is that way—'], ['형. 형— 시합은 저쪽이라고—']),
		P('He goes through the crowd like a man wading out to a ship. He loses her behind a cart of eels. He finds her again. Ten paces from the waterline he stops, because she has finally looked up, and he has forgotten how feet work.',
			'그는 배를 향해 물을 헤치듯 사람들 사이를 헤친다. 장어 수레 뒤에서 그녀를 놓친다. 다시 찾는다. 물가 열 걸음 앞에서 멈춘다. 그녀가 마침내 고개를 들었고, 그는 발이 어떻게 움직이는지 잊어버렸다.'),
		D('heohwangok', ['You’re standing where my brother means to put the chest.', '…Or are you the welcome?'], ['제 오라버니가 상자를 놓으려는 자리에 서 계시네요.', '……아니면, 마중 나오신 분인가요?']),
		D('suro', ['…I am—', 'Yes.'], ['……과인은—', '그렇소.']),
		D('heohwangok', ['Then you’re late. I’ve been looking at your beach since dawn.'], ['그럼 늦으셨네요. 새벽부터 이 해변을 보고 있었거든요.'])
	);

	b[169] = P('She arrives on a red-sailed ship, the last of them and from farthest away, from a country on the far side of the southern sea that nobody here has heard of. With her come a brother, two old servants and their wives, and a chest nobody is allowed to touch. She is twenty-one, and built like nowhere on this coast. She has spent the last night on deck, and it shows only in her eyes.',
		'그녀는 붉은 돛을 단 배를 타고 온다. 가장 늦게, 가장 먼 곳에서. 남쪽 바다 건너, 여기 누구도 들어 본 적 없는 나라에서. 함께 온 건 오라비 하나, 늙은 하인 둘과 그 아내들, 그리고 아무도 손대면 안 되는 상자 하나. 스물한 살이고, 이 바닷가 어디에도 없는 몸매다. 지난밤을 갑판에서 새웠는데, 그 티는 눈에만 난다.');

	b.splice(159, 0,
		P('On the third afternoon the chiefs, who have run out of ways to look at women without being obvious, announce a race. Up Turtle Peak, to the rock where the box came down. First to touch it gets the king’s cup. The king, they say, will be at the top, judging. He is at the top. He is also in a plain coat, holding the cup, and pretending to be the man who holds the cup.',
			'사흘째 오후, 티 안 나게 여자를 구경할 방법이 바닥난 추장들이 경주를 연다. 구지봉 꼭대기, 상자가 내려온 바위까지. 먼저 손대는 사람이 왕의 잔을 받는다. 왕은 꼭대기에서 심판을 본다고 한다. 꼭대기에 있긴 하다. 허름한 옷을 입고, 잔을 들고, 잔 드는 사람인 척하고 있다.'),
		S('The eldest chief', 'm', ['Ladies. No horses.'], ['아씨들. 말은 안 됩니더.']),
		S('The rider from Goguryeo', 'f', ['Then what’s the point.'], ['그럼 뭐 하러 뛰어.']),
		P('She runs it anyway, in riding boots, and leads to the first bend. The Tamla diver doesn’t take the path at all. She swims round the headland, climbs the seaward cliff barefoot, and arrives a hand behind, dripping. The Eastern priestess walks the whole way and announces at the top that she dreamt the result, and it was her. The Mahan girl does not run. Jade does not run. She arrives last and least out of breath.',
			'그녀는 어쨌든 승마 장화를 신고 뛰고, 첫 굽이까지 앞선다. 탐라 해녀는 길로 오지도 않는다. 곶을 헤엄쳐 돌아 바다 쪽 절벽을 맨발로 기어올라, 물을 뚝뚝 흘리며 한 뼘 차이로 들어온다. 동국 무녀는 내내 걸어와서는 꼭대기에서 결과를 꿈에서 봤다고, 자기가 이겼다고 선언한다. 마한 아가씨는 뛰지 않는다. 옥구슬은 뛰지 않는다. 그녀는 꼴찌로, 가장 숨차지 않게 도착한다.'),
		S('The rider from Goguryeo', 'f', ['…Found you again.', 'Cup.'], ['……또 찾았네.', '잔.']),
		D('suro', ['…The cup is— for the winner.'], ['……잔은— 이긴 사람 것이오.']),
		S('The rider from Goguryeo', 'f', ['I am the winner.'], ['내가 이긴 사람이야.']),
		S('The diver from Tamla', 'f', ['Touched the rock first, I did. With my hand. She touched it with her boot. A boot’s no hand.'], ['바위에 먼저 손댄 건 나라. 손으로. 저 아씨는 장화로 댔주게. 장화는 손이 아니우다.']),
		D('suro', ['…Both.', 'Half. Each.'], ['……둘 다.', '반씩. 각자.']),
		P('They split the cup. Neither will drink first. It goes round the peak half-full, through ten women and nine chiefs, and comes back to Suro empty. Ijinasi says it is the most kingly thing his brother has done all week.',
			'둘은 잔을 나눈다. 아무도 먼저 마시지 않는다. 잔은 반쯤 찬 채 꼭대기를 한 바퀴 돈다. 여자 열, 추장 아홉을 거쳐 수로에게 빈 채로 돌아온다. 이진아시는 형이 이번 주에 한 일 중 가장 왕다운 일이라고 한다.')
	);
}

/* ———————— Onjo ———————— */
{
	const b = entry('Onjo').blocks;
	expect(b, 65, 'My prince builds low');
	expect(b, 58, 'Nobody answers him');
	expect(b, 57, 'Eight of the ten stay');
	expect(b, 51, 'On the ninth day');
	expect(b, 47, 'nine days');
	expect(b, 42, 'Three days south of the river');
	expect(b, 41, 'Of the ten the records name two');
	expect(b, 40, 'At dawn ten men');
	expect(b, 38, 'Grinning. Like an idiot.');

	b.splice(66, 0,
		P('On the way out of the high king’s hall, Maryeo is passed on the steps by a small bald foreigner being shown out much faster. He has a dried gourd tied at his waist, and the face of a man who has just been threatened with death and considers it a scheduling problem.',
			'높은 임금의 전각을 나오는 계단에서, 마려는 자기보다 훨씬 빨리 쫓겨나는 작은 대머리 이방인과 엇갈린다. 허리에 마른 박을 매달았고, 방금 죽이겠다는 소리를 듣고도 그걸 일정 문제쯤으로 여기는 얼굴이다.'),
		D('hogong', ['Bow lower, northerner. I bowed to exactly the right height, and he wanted my head for it.'], ['더 낮게 절하시오, 북쪽 양반. 나는 딱 알맞게 절했는데, 저 양반이 그걸로 내 목을 달라 하더이다.']),
		S('Maryeo', 'm', ['Who do you serve, uncle?'], ['어르신은 누구를 모십니까?']),
		D('hogong', ['A boy on the east coast who came out of an egg.', 'He has better manners than yours. Than all of yours.'], ['동쪽 바닷가에서 알에서 나온 소년이오.', '당신네 임금보다 예의가 바르오. 당신네 전부보다.']),
		P('Maryeo laughs all the way back to the river. It will be a long time before Baekje meets that boy’s people properly.',
			'마려는 강에 닿을 때까지 웃는다. 백제가 그 소년의 사람들을 제대로 만나려면 한참 걸릴 것이다.')
	);

	b[58] = P('Biryu stays. The youngest two of the ten stay with him, because somebody has to make sure the elder prince eats. They promise to write. They don’t. Onjo turns the other eight back east, and in the morning the stag is already ahead of them on the riverbank. It lies down in the grass at Onjo’s feet, facing the river. Baekje will call it <b>Sinrok</b>, the guardian deer, for as long as Baekje has anything to call.',
		'비류는 남는다. 열 중 막내 둘이 그와 함께 남는다. 큰 왕자가 밥은 챙겨 먹는지 누군가는 봐야 하니까. 편지 쓰겠다고 약속한다. 안 쓴다. 온조는 나머지 여덟을 데리고 동쪽으로 돌아선다. 아침이 되자 사슴은 벌써 강둑에서 그들을 앞서 있다. 강을 바라보며 온조의 발치 풀밭에 엎드린다. 백제는 그것을 <b>신록</b>, 나라를 지키는 사슴이라 부를 것이다. 백제가 무언가를 부를 수 있는 동안은.');
	b[57] = P('Nobody answers him. The stag, which has stood a little apart all morning, turns and walks off the summit to the west, toward the salt. Biryu laughs out loud and says even the deer agrees. So they follow it, all of them, down off Buak and across the wet flats, and it walks them all the way to Michuhol. At the edge of the sea it stops, because there is nowhere left to walk. It looks at the water a long time. Then it looks back at the river.',
		'아무도 대답하지 않는다. 아침 내내 조금 떨어져 서 있던 사슴이 돌아서서 서쪽으로, 소금 냄새 쪽으로 꼭대기를 내려간다. 비류가 소리 내어 웃으며 사슴도 내 편이라 한다. 그래서 모두 따라간다. 부아악을 내려와 질척한 벌판을 건너, 사슴은 그들을 미추홀까지 데려간다. 바다 끝에서 멈춘다. 더 걸을 데가 없으니까. 한참 물을 바라본다. 그러고는 강 쪽을 돌아본다.');

	b[51].html = b[51].html.replace('On the ninth day', 'On the third day');
	b[51].ko = b[51].ko.replace('아흐레째', '사흘째').replace('아흐레', '사흘');
	b[47].html = b[47].html.replace('nine days', 'three days');
	b[47].ko = b[47].ko.replace('아흐레', '사흘');

	b[42].html = b[42].html.replace('Three days south of the river,', 'Halfway, where the Han comes down wide and brown out of the eastern mountains,');
	b[42].ko = b[42].ko.replace('강을 건너 사흘 남쪽,', '길의 절반, 한강이 동쪽 산에서 넓고 누렇게 흘러 내려오는 곳,');

	b.splice(42, 0,
		SC('The Amnok', '압록강'),
		P('The first river is the one Jumong crossed coming the other way. It is late spring, and the Amnok is high and green with snowmelt. There are no turtles.',
			'첫 강은 주몽이 반대 방향으로 건넜던 그 강이다. 늦봄, 압록강은 눈 녹은 물로 높고 푸르다. 거북이는 없다.'),
		D('onjo', ['Mam. Father said turtles came up and made him a bridge.', '…Where are the turtles?'], ['어머니. 아버지가 그러는데 거북이들이 올라와서 다리를 놔 줬대.', '……거북이 어디 있어?']),
		D('sosuno', ['Your father says a lot of things at feasts.', 'Build a raft.'], ['너희 아바지는 잔치 자리에서 별소리를 다 해.', '뗏목 엮어.']),
		P('They build rafts. Yeon Ga, who can’t swim, crosses flat on the grain sacks with his eyes shut. Halfway over, a cormorant lands on his chest. He doesn’t open them.',
			'뗏목을 엮는다. 헤엄을 못 치는 연가는 곡식 자루 위에 납작 엎드려 눈을 꼭 감고 건넌다. 강 한가운데서 가마우지 한 마리가 그의 가슴에 내려앉는다. 그래도 눈을 안 뜬다.'),

		SC('Myohyang', '묘향산'),
		P('South of the river the land stands up. The Myohyang hills are fir and granite and fog. The cart paths are deer paths, and the deer paths are worse. On the ninth night something big walks past the fires and does not hurry.',
			'강 남쪽에서 땅이 일어선다. 묘향의 산들은 전나무와 화강암과 안개다. 수레 길은 짐승 길이고, 짐승 길은 더 나쁘다. 아흐레째 밤, 커다란 무언가가 모닥불 곁을 지나간다. 서두르지도 않는다.'),
		S('Ogan', 'm', ['Tiger.', '…One. I counted.'], ['범입니다.', '……한 마리. 셌습니다.']),
		S('Maryeo', 'm', ['Should I talk to it?'], ['제가 말 좀 걸어 볼까요?']),
		D('sosuno', ['Maryeo, you talk to that tiger, I’m not burying you.'], ['마려, 저 범한테 말 걸믄 안 묻어 준다.']),
		P('Nobody talks to the tiger. In the morning its prints are in the frost round Granny Boksil’s bedroll, neat as a seal on a letter. She says it was only looking at her rice.',
			'아무도 범에게 말을 걸지 않는다. 아침이 되자 복실 할미의 잠자리 둘레 서리 위에 발자국이 찍혀 있다. 편지에 찍은 도장처럼 반듯하다. 할미는 범이 자기 쌀을 구경했을 뿐이라고 한다.'),

		SC('The Taedong', '대동강'),
		P('The next river has a city on it, and the city has a Han flag. The commandery has sat on the Taedong for a hundred years, collecting grain and names. A column of northerners with ten carts and two princes is exactly the kind of thing it writes down.',
			'다음 강에는 성이 있고, 성에는 한나라 깃발이 있다. 군현이 대동강에 앉은 지 백 년, 곡식과 이름을 거둬 왔다. 수레 열 대에 왕자 둘을 거느린 북쪽 행렬은 딱 그 성이 적어 두는 종류의 물건이다.'),
		D('biryu', ['We could take it. Ten carts, a few spears—'], ['치믄 되디. 수레 열에 창 몇 자루믄—']),
		D('sosuno', ['We could die in it, is what we could do.', 'Upstream. At night.'], ['거기서 죽는 건 되디.', '상류로. 밤에.']),
		P('They cross upstream in the dark, wheels wrapped in rice straw, the oxen led by the nose. On the far bank Onjo looks back at the watchfires on the city wall and counts them, the way Ogan would. It is the first time he has looked at a wall and wondered how to build one.',
			'그들은 어둠 속에 상류로 건넌다. 바퀴는 볏짚으로 싸고, 소는 코뚜레를 잡고 끈다. 건너편 기슭에서 온조는 성벽 위 횃불을 돌아보며 하나하나 센다. 오간이 그러듯이. 성벽을 보며 저걸 어떻게 쌓나 생각한 건 그게 처음이다.'),

		SC('The Imjin', '임진강'),
		P('Past the Myeorak hills the ground goes soft and red, and then the Imjin cuts across it in a trench of black stone: cliffs of basalt columns standing in rows like a palace nobody ordered. Cranes stand in the shallows below, red-capped and white, and watch the carts with the faces of officials.',
			'멸악의 산들을 지나면 땅이 붉고 물러지다가, 임진강이 검은 돌 골짜기로 그 땅을 가른다. 아무도 짓지 않은 궁궐처럼 줄지어 선 현무암 기둥 절벽. 그 아래 여울에 머리 붉은 흰 학들이 서서, 벼슬아치 같은 얼굴로 수레를 구경한다.'),
		D('onjo', ['Hyung. Look. Those cliffs. Who cut them?'], ['형. 저기 봐. 저 절벽. 누가 깎았어?']),
		D('biryu', ['Nobody cut them. Them’s cliffs. They grow.'], ['깎긴 누가 깎아. 절벽이다. 자라는 거디.']),
		D('onjo', ['…Cliffs don’t grow.'], ['……절벽은 안 자라.']),
		D('biryu', ['These did. Ask the cranes.'], ['이건 자랐어. 학한테 물어보라우.']),

		SC('A Mahan Hall', '마한의 집'),
		P('South of the Imjin the villages change. Houses sit half in the ground under grass roofs, with the door in the roof. The men wear tattoos on their arms and beads instead of gold. On the third evening one village takes the column at spear-point and walks the princes into its headman’s hall, which is warm, and smoky, and has no mat for guests.',
			'임진강 남쪽에서 마을이 달라진다. 집은 풀 지붕을 이고 땅에 반쯤 묻혀 있고, 문은 지붕에 나 있다. 사내들은 팔에 문신을 하고, 금 대신 구슬을 건다. 사흘째 저녁, 한 마을이 창끝으로 행렬을 붙잡아 왕자들을 우두머리의 집으로 데려간다. 따뜻하고, 연기 자욱하고, 손님에게 내줄 자리는 없는 집이다.'),
		S('A Mahan headman', 'm', ['So who sent you.'], ['그래, 누가 보냈소.']),
		D('onjo', ['Nobody sent us.', 'Your men grabbed us. We were just— on the road.'], ['아무도 안 보냈어요.', '당신네 사람들이 잡았잖아요. 우린 그냥… 길에 있었어요.']),
		S('A Mahan headman', 'm', ['I asked for a name.'], ['이름을 물었소.']),
		P('Behind her sons, Sosuno makes a noise into her sleeve. It might be a cough. It is not a cough.',
			'아들들 뒤에서 소서노가 소매에 대고 무슨 소리를 낸다. 기침일 수도 있다. 기침이 아니다.'),
		D('onjo', ['…Onjo. Mam, what?'], ['……온조요. 어머니, 왜?']),
		D('sosuno', ['Nothing.', 'Your father knelt in a hall just like this and said it exactly like that.', 'Then he married the chief’s daughter.'], ['아무것도 아니야.', '너희 아바지도 딱 이런 집에서 무릎 꿇고 똑같이 그랬어.', '그러고는 족장 딸이랑 혼인했디.']),
		P('The headman’s daughter, who has been standing at his shoulder with a lamp, looks at Onjo very hard and then at nothing at all. Onjo goes red to the ears. The headman, who has daughters and has seen this before, sighs and sends for a mat.',
			'우두머리 어깨 뒤에서 등잔을 들고 서 있던 딸이 온조를 한참 뚫어지게 보다가, 아무것도 안 보는 척한다. 온조는 귀까지 빨개진다. 딸이 있고 이런 걸 전에도 본 우두머리는 한숨을 쉬고 자리를 깔라 이른다.'),
		S('A Mahan headman', 'm', ['Sit, then. Northerners always come down this road.', 'They always say nobody sent them. And they always stay.'], ['앉으시오, 그럼. 북쪽 사람들은 늘 이 길로 내려오지.', '늘 아무도 안 보냈다 하고. 그리고 늘 눌러앉고.']),

		SC('The Han', '한강'),
		{ kind: 'map', year: -18, places: ['michuhol', 'wirye'], routes: ['onjo-deer'], riverNames: true, title: 'Halfway', caption: 'Where the Han comes down out of the mountains, something is waiting.', ko: '한강이 산에서 내려오는 곳, 무언가 기다리고 있다.' }
	);

	b.splice(41, 1);
	b[40] = P('At dawn ten carts roll out through the gate, and she looks back once, at the gate, where a man is still grinning like an idiot because she told him to. Onjo and Biryu take their mother south. She walks like a woman who has been thoroughly answered and will not explain it to a deer, a son, or a chronicle.',
		'새벽, 수레 열 대가 문을 나선다. 그녀는 딱 한 번 돌아본다. 문 앞에 한 사내가, 시킨 대로 바보같이 웃고 서 있다. 온조와 비류가 어머니를 모시고 남쪽으로 간다. 그녀는 제대로 대답을 들은 여자처럼 걷고, 그 대답을 사슴에게도, 아들에게도, 연대기에게도 설명하지 않는다.');
	b.splice(41, 0, { kind: 'map', year: -18, places: ['jolbon', 'michuhol', 'wirye'], routes: ['onjo-south'], riverNames: true, title: 'The Road South', caption: 'Three months, five rivers, and somebody else’s commandery in the way.', ko: '석 달, 강 다섯, 그리고 길을 막은 남의 군현.' });

	b.splice(39, 0,
		SC('The Yard at Dawn', '새벽 마당'),
		P('By sunrise the whole yard knows, because a yard always does. The five roofs come out in their good clothes to watch a family leave politely.',
			'해가 뜰 무렵엔 마당이 다 안다. 마당이란 원래 그렇다. 다섯 지붕의 사람들이 좋은 옷을 차려입고 나와, 한 집안이 점잖게 떠나는 걸 구경한다.'),
		P('Jumong sits in the hall door. Yuri stands beside him, new to standing beside anything. Onjo steps out in front of them with a speech he has practised all night.',
			'주몽은 전각 문간에 앉아 있다. 유리가 그 곁에 선다. 누구 곁에 서 보는 게 처음이다. 온조가 밤새 연습한 연설을 들고 그 앞에 나선다.'),
		D('onjo', ['Father. Majesty. We’re going south.', 'Mam, Hyung and me. And whoever wants to—', '…That’s it. That was the announcement. It was longer in my head.'], ['아버지. 폐하. 저희 남쪽으로 갑니다.', '어머니랑 형이랑 저요. 그리고 따라오고 싶은 사람은 누구든—', '……끝이에요. 이게 발표예요. 머릿속에선 더 길었는데.']),
		D('biryu', ['I cut the bit about the sunrise.', 'No need to thank me.'], ['해 뜨는 대목은 내가 뺐다.', '고맙단 말은 됐다.']),
		D('jumong', ['…How long was the bit about the sunrise?'], ['……해 뜨는 대목이 얼마나 길었는데?']),
		D('sosuno', ['Long.', 'We take my father’s grain and my father’s carts. Nothing of yours.', 'Anyone of mine who wants to walk, walks.'], ['길었어.', '아바지 곡식, 아바지 수레만 가져간다. 네 건 하나도 안 가져가.', '내 사람들 중에 걷고 싶은 사람은 걸으라우.']),
		D('jumong', ['Take something of mine.', '…Anything. Not the well.'], ['내 것도 가져가.', '……뭐든. 우물만 빼고.']),
		P('Then the yard finds out whose people are whose. Ogan stands first, because he has already counted the carts twice and hates to waste a count. Maryeo stands second and says something that makes the guards laugh, which is how he volunteers for everything.',
			'그제야 마당은 누가 누구 사람인지 알게 된다. 오간이 먼저 일어선다. 수레를 이미 두 번 세어 놨는데 그 셈을 버리기 싫어서다. 마려가 두 번째로 일어서며 뭐라고 하자 경비병들이 웃는다. 그는 늘 그렇게 자원한다.'),
		S('Ogan', 'm', ['Ten carts. Counted twice.', '…Kicked the wheels too, Majesty. They’ll hold.'], ['수레 열. 두 번 셌습니다.', '……바퀴도 차 봤습니다, 폐하. 버팁니다.']),
		S('Maryeo', 'm', ['Somebody has to do the talking down there. The prince stops halfway.'], ['저 아래 가면 누군가는 말을 해야지요. 왕자님은 중간에 끊으시니까.']),
		P('Eight more stand. The records lose them, so here they are, once. Sa Dol carries a hoe like a spear. Yeon Ga can’t swim, and says so. Jin Hoe writes everything down; Mok Hyeop writes nothing. Hae Ru is the oldest and was born in Buyeo. Baek Sun sings. The youngest two, Guk Ji and Ahn Mo, stand up together because neither will go first. Don’t bother with the men. Remember the surnames.',
			'여덟이 더 일어선다. 기록은 이들을 잃어버렸으니, 여기서 한 번만 부른다. 사돌은 괭이를 창처럼 든다. 연가는 헤엄을 못 치고, 그렇다고 말한다. 진회는 뭐든 적고, 목협은 아무것도 안 적는다. 해루는 제일 늙었고 부여 태생이다. 백순은 노래를 한다. 막내 둘, 국지와 안모는 서로 먼저 안 나서려다 같이 일어선다. 사람은 굳이 기억할 것 없다. 성을 기억하라.'),
		P('Behind the ten come the old Jolbon people, the ones who remember when this yard was her father’s. Granny Boksil, who nursed her. Old Dalgu, her father’s storekeeper, with his tally-sticks in a bundle. A dozen households from the five roofs. They have put on their court clothes for it: jackets banded at the collar and cuffs in a second colour, wide trousers, and on the men who once held office, the little peaked cap with two feathers. They are dressed for a court that does not exist yet.',
			'열 명 뒤로 옛 졸본 사람들이 따라온다. 이 마당이 그녀 아버지의 것이던 시절을 기억하는 이들이다. 그녀를 젖 먹여 키운 복실 할미. 셈 막대를 한 묶음 든, 아버지의 곳간지기 달구 영감. 다섯 지붕에서 나온 열두어 집. 다들 관복을 차려입었다. 깃과 소맷부리에 다른 색 단을 댄 저고리, 통 넓은 바지, 그리고 한때 벼슬을 했던 사내들 머리엔 새 깃 두 개 꽂은 작은 절풍. 아직 있지도 않은 조정에 나갈 차림이다.'),
		S('Granny Boksil', 'f', ['Agassi. You’ll want somebody who remembers how your father liked his rice.'], ['아기씨. 아바지가 밥을 어드렇게 드셨는지 기억하는 사람 하나는 있어야디.']),
		D('sosuno', ['Granny, it’s three months of road.'], ['할마니, 석 달 길이야.']),
		S('Granny Boksil', 'f', ['Then I’ll remember it slowly.'], ['기러믄 천천히 기억하디.']),
		P('At the gate she does not look back. That lasts eleven steps.',
			'문에서 그녀는 돌아보지 않는다. 열한 걸음 동안은.'),
		D('sosuno', ['…Don’t follow me.'], ['……따라오지 마.']),
		D('jumong', ['Wasn’t going to.'], ['안 따라가.']),
		P('He has followed her to the gate anyway. She turns, takes him by the collar of the red silk, and kisses him in front of the whole yard: the ten, the carts, the old people in their feathers, the new crown prince. It is not a goodbye kiss. It is the kind that makes a yard look at its feet. Her fist stays in his collar. His hand goes into her hair and finds the gold pin. Yuri studies the roof. Biryu coughs. Onjo does not know where to put his face.',
			'그래 놓고 그는 문까지 따라와 있다. 그녀가 돌아서서 붉은 비단 깃을 움켜잡고, 마당 전체가 보는 앞에서 입을 맞춘다. 열 사람, 수레들, 깃털 꽂은 노인들, 새 태자까지. 작별 입맞춤이 아니다. 마당이 제 발끝을 내려다보게 만드는 그런 입맞춤이다. 그녀의 주먹은 그의 깃을 놓지 않는다. 그의 손은 그녀 머리칼 속으로 들어가 금비녀를 찾는다. 유리는 지붕을 살핀다. 비류는 헛기침을 한다. 온조는 얼굴을 어디 둬야 할지 모른다.'),
		D('sosuno', ['…Ha.', 'That’s the last one.'], ['……하.', '이게 마지막이야.']),
		D('jumong', ['You said that last night.'], ['어젯밤에도 그랬잖아.']),
		D('sosuno', ['I meant it last night too.', '…Grin all you like. I’m not looking.'], ['어젯밤에도 진심이었어.', '……실컷 웃어. 안 볼 거니까.'])
	);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('ok');
