/** Tang-war rewrite, #87–#98. Idempotent: each episode is skipped once its marker text is present. */
import { P, S, N, patch } from './tangwar-lib.mjs';

// #87 Mount Gain — open the night Pyongyang falls, step back three summers to the horse, return with the question #88 answers.
patch(87, 'goes to visit a piece of paper', ({ e, at, D }) => {
	const b = (i, f) => at(i, f);
	const scene0 = b(0, 'Bear Ford');
	scene0.label = 'Bear Ford, Three Summers Earlier';
	scene0.ko = '세 해 전, 웅진';
	const b1 = b(1, 'Two springs after the river');
	b1.html = "Two springs after the White River, the empire names a governor for what is left of Baekje. It is Buyeo Yung. He once knelt at Bupmin's horse and was spat on. Then he went to the emperor's city and came back in imperial robes. Now he will rule from the fortress where his father was arrested.";
	b1.ko = '백강 싸움이 끝나고 두 번째 봄, 제국은 남은 백제를 맡을 도독을 세운다. 부여융이다. 그는 한때 법민의 말 앞에 꿇어 침을 맞았다. 그러고는 황제의 도성에 갔다가 황제의 관복을 입고 돌아왔다. 이제 그는 아버지가 붙잡혀 간 바로 그 성에서 다스린다.';
	const b4 = b(4, 'Yung moves into the commandery');
	b4.html = 'Yung moves into the commandery offices in the spring. The rooms his father was taken from have been whitewashed. The Black Tortoise shows him the registers, and the calendar, and the list of names he may not write.';
	b4.ko = '융은 봄에 도독부 관아로 들어간다. 아버지가 끌려 나간 방들은 하얗게 회칠이 되어 있다. 현무가 그에게 호적과 역서와, 써서는 안 될 이름 목록을 보여 준다.';
	const b8 = b(8, 'swear to be brothers');
	b8.html = 'That summer, the empire makes the two men who rule the south swear to be brothers. It picks a hill outside Bear Ford. The clerks name it the Mountain Where One Goes for Gain. They mean it kindly.';
	b8.ko = "그해 여름, 제국은 남쪽을 다스리는 두 사내에게 형제가 되겠다고 맹세하게 한다. 웅진 밖 언덕 하나를 고른다. 서기들은 그 산을 '이익을 좇아가는 산'이라 적는다. 좋은 뜻으로 지은 이름이다.";
	b(11, 'Mount Chwiri at Ungjin');
	b(24, 'In days past, the late king of Baekje');
	const keep = (from, to) => e.blocks.slice(from, to + 1);
	const munmuOath = b(3, 'Everything south of Pyongyang');
	const card = b(31, 'To find the first king of this land');
	e.blocks = [
		S('The Ancestral Temple', '종묘'),
		P('The night Pyongyang falls, the king of Silla goes to visit a piece of paper.', '평양이 떨어진 날 밤, 신라 왕은 종이 한 장을 보러 간다.'),
		P(
			"It hangs in the ancestral temple, beside his father's tablet. Gold letters on iron. An oath, sworn over a dead horse, to love Baekje's prince like a brother. Goguryeo is gone tonight. Up north, the emperor's clerks are already measuring what is left.",
			'그것은 종묘, 아버지의 위패 곁에 걸려 있다. 쇠에 새긴 금 글씨. 죽은 말 위에서, 백제 왕자를 형제처럼 아끼겠다고 한 맹세다. 오늘 밤 고구려는 사라졌다. 북쪽에서는 황제의 서기들이 벌써 남은 땅을 재고 있다.'
		),
		munmuOath,
		D('yushin', ['The emperor will have learned a sentence too, Majesty.'], ['황제께서도 외우시는 문장이 있겠지요, 전하.']),
		D('munmu', ['I know. It’s hanging right here.', 'Uncle. Do you remember the horse?'], ['알고 있소. 바로 여기 걸려 있으니까.', '외숙. 그 말, 기억하시오?']),
		D('yushin', ['…Every day, Majesty.'], ['…날마다요, 전하.']),
		P(
			'Every war starts with an insult somebody swallowed. Silla swallowed this one three summers ago. To taste it, go back to a hill outside Bear Ford, and the only white horse in the camp.',
			'모든 전쟁은 누군가 삼킨 모욕 하나에서 시작된다. 신라는 이 모욕을 세 해 전 여름에 삼켰다. 그 맛을 보려면 웅진 밖 언덕으로, 진영에 단 한 마리뿐이던 흰 말에게로 거슬러 가야 한다.'
		),
		scene0,
		b1,
		b(2, 'goes very quiet'),
		...keep(4, 10),
		...keep(12, 23),
		...keep(25, 30),
		S('The Ancestral Temple', '종묘'),
		P(
			'Three summers later, the old man got his war. It ended tonight, with a monk at a gate. He stands beside the king in the temple now, and neither of them looks at the iron for long.',
			'세 해 뒤, 노인은 전쟁을 얻었다. 그 전쟁은 오늘 밤 끝났다. 한 승려가 문 하나를 열면서. 이제 그는 종묘에서 왕 곁에 서 있고, 둘 다 그 쇠를 오래 쳐다보지 못한다.'
		),
		D(
			'munmu',
			['Uncle. Before the emperors. Before seals, and oaths, and governors with lists.', 'Who was the first king of this land?'],
			['외숙. 황제들보다 먼저. 도장이니 맹세니, 명단 든 도독이니 하는 것들보다 먼저.', '이 땅의 첫 임금은 누구였소?']
		),
		D('yushin', ['Ask your mother. She tells it to every child in the house.', 'It starts with a bear.'], ['어머님께 여쭤 보십시오. 집안 아이마다 들려주십니다.', '곰 이야기로 시작하지요.']),
		D('munmu', ['A bear.'], ['곰이라.']),
		D('yushin', ['A patient one. Your mother always looks at me when she gets to that part.'], ['참을성 많은 곰입니다. 어머님은 그 대목만 오면 꼭 저를 보십니다.']),
		card
	];
	e.logline = {
		en: 'The night Pyongyang falls, Munmu goes to look at an oath. Three summers earlier, the empire made him swear it over his uncle’s white horse.',
		ko: '평양이 떨어진 밤, 문무는 맹세문 하나를 보러 간다. 세 해 전, 제국은 외숙의 흰 말 위에서 그 맹세를 시켰다.'
	};
});

// #88 Dangun — reorder the myth, trim the Joseon cast, return to Munmu before the card.
patch(88, 'with extra garlic', ({ e, at, anchor }) => {
	const quote = at(6, 'Dangun Wanggeom');
	const short = at(7, 'That is the short way to tell it');
	short.html = 'There is a short way to tell the rest, the way it is carved on stones. The long way begins, as long ways do, with a bear who wanted something so badly that she outlasted a tiger for it.';
	short.ko = '나머지를 짧게 전하는 방식이 있다. 돌에 새기는 방식이다. 길게 전하는 방식은, 긴 이야기가 늘 그렇듯, 무언가를 너무나 간절히 원한 나머지 호랑이보다 오래 견딘 곰 한 마리에서 시작된다.';
	const laws = at(8, 'civilisation in instalments');
	const crowns = at(35, 'Every later crown in these kingdoms');
	crowns.html = 'Every later crown in these kingdoms argues, one way or another, back to the woman who used to be a bear. Her son’s city keeps his name long after he has become a mountain.';
	crowns.ko = '이후 이 왕국들의 왕관은, 어떤 식으로든, 한때 곰이었던 여자에게로 거슬러 올라간다. 아들의 도성은 그가 산이 된 뒤에도 오래 그의 이름을 지닌다.';
	const ugeo = at(41, 'King Ugeo');
	ugeo.html = '<b>King Ugeo</b> has stopped sleeping in the palace. He sleeps on the wall, where he can hear the Han camp coughing, and his son, the prince, has started sleeping somewhere else.';
	ugeo.ko = '<b>우거왕</b>은 궁에서 자지 않은 지 오래다. 한나라 진영의 기침 소리가 들리는 성벽 위에서 잔다. 태자는 언제부턴가 다른 데서 잔다.';
	const ministers = at(46, 'Noin, one of the ministers');
	ministers.html = 'One of the ministers who have been doing the talking goes over the wall that week and dies on the road before he reaches the Han tents. Another does not bother with the road. One night at the start of summer he sends men up the wall-stair instead.';
	ministers.ko = '말을 주고받던 대신 하나가 그 주에 성벽을 넘어가다, 한나라 장막에 닿기도 전에 길에서 죽는다. 또 한 대신은 길로 나서지 않는다. 초여름 어느 밤, 그는 성벽 계단으로 사람들을 올려 보낸다.';
	const lanes = at(50, 'He holds it until Noin’s son Choi');
	lanes.html = 'He holds it until the dead minister’s son and the prince go down into the lanes, where people have been eating bark since the spring.';
	lanes.ko = '죽은 대신의 아들과 태자가 골목으로 내려갈 때까지는 지킨다. 골목 사람들은 봄부터 나무껍질을 먹고 있었다.';
	const card = at(57, 'Eight hundred years later');
	const dangunCard = at(33, 'all the paperwork of a first king');
	const blocks = e.blocks.slice(0, 57).filter((x) => x !== quote);
	const iShort = blocks.indexOf(short);
	blocks.splice(iShort, 2, laws, short);
	blocks.splice(blocks.indexOf(dangunCard) + 1, 0, quote);
	e.blocks = [
		...blocks,
		P(
			'That is the story Munmu gets, in his mother’s version, with extra garlic. He came for the bear. He keeps thinking about the door.',
			'문무가 들은 이야기는 그것이다. 어머니 판본이라, 마늘이 좀 더 들어갔다. 그는 곰 이야기를 들으러 왔다. 그런데 자꾸 문 생각이 난다.'
		),
		card
	];
	anchor('scene-dangun-founding-13', 'There is a short way to tell');
	anchor('scene-fall-of-joseon-3', 'He holds it until the dead minister');
	anchor('scene-fall-of-joseon-37', 'He holds it until the dead minister');
});

// #89 Anseung — new hook, one identity for Anseung, the quarrel played as a scene, no patent quote.
patch(89, 'a flag and a royal', ({ e, at, D, anchor }) => {
	const scene0 = at(0, 'The Protectorate');
	const record = at(3, 'son of the Goguryeo minister Yeon Jungto');
	at(4, 'An Shun');
	const soil = at(6, 'four hundred years deep');
	const keepers = at(7, 'The kings in the soil will keep');
	const killed = at(8, 'That night Anseung has him killed');
	killed.html = 'That night Anseung has him killed in his tent. It is the first Goguryeo blood the revival spills, and it is spilled by Goguryeo.';
	killed.ko = '그날 밤 안승은 그를 장막 안에서 죽인다. 부흥군이 흘린 첫 고구려 피이고, 그것을 흘린 것도 고구려다.';
	const south = at(9, 'four thousand households south');
	const scene10 = at(10, "Silla's Guest");
	const fiction = at(11, 'a useful fiction');
	const bride = at(12, 'gets a bride');
	const seal = at(13, 'Give him a seal');
	at(14, 'Be reverent');
	const mojam = (en, ko) => N('Geom Mojam', '#C30000', en, ko);
	const anseung = (en, ko) => N('Anseung', '#d0362f', en, ko);
	e.blocks = [
		scene0,
		P('Every revival needs two things: a flag and a royal. Geom Mojam has the flag.', '부흥에는 두 가지가 필요하다. 깃발 하나와 왕족 하나. 검모잠에게는 깃발이 있다.'),
		P(
			'The empire has done it again on the Taedong. Pyongyang is a Protectorate now, run by Tang clerks who seem surprised that anyone minds. Mojam minds. He kills the clerks, raises Goguryeo’s colours, and goes looking for someone royal to stand under them.',
			'제국이 대동강에서 또 같은 짓을 했다. 평양은 이제 도호부다. 누가 싫어하는 걸 보고 놀라는 당의 서기들이 다스린다. 모잠은 싫다. 서기들을 죽이고, 고구려의 깃발을 올리고, 그 아래 세울 왕족을 찾아 나선다.'
		),
		P(
			'He finds one on an island in the western sea, mending a net. His name is Anseung. His father is Yeon Jungto, the uncle who took twelve cities over to Silla. His mother was a king’s daughter. Mojam only needs the second half.',
			'그는 서해의 한 섬에서 그물을 깁고 있는 사내를 찾아낸다. 이름은 안승. 아버지는 열두 성을 들고 신라로 넘어간 숙부, 연정토다. 어머니는 왕의 딸이었다. 모잠에게 필요한 건 뒤의 절반뿐이다.'
		),
		record,
		S('The River Camp', '강가 진영'),
		P(
			'By the next spring the revival has a court, a royal, and four thousand households camped along the river. It also has a Tang army coming down the north road. The two men argue about it in front of everyone, because a revival has no rooms with doors.',
			'이듬해 봄, 부흥군에게는 조정이 있고, 왕족이 있고, 강을 따라 진을 친 사천 호가 있다. 북쪽 길로 내려오는 당군도 있다. 두 사내는 모두가 보는 앞에서 그 일로 다툰다. 부흥군에게는 문 달린 방이 없으니까.'
		),
		mojam(['We hold the river. We hold Pyongyang.', 'If they want it back, they can climb over us.'], ['강을 지키오. 평양을 지키오.', '도로 가져가려면 우리 시체를 넘어오라 하시오.']),
		anseung(['They climbed over Pyongyang two years ago. With better walls than ours in the way.'], ['두 해 전에 저들은 평양도 넘었소. 우리 것보다 나은 성벽을 두고도.']),
		soil,
		keepers,
		mojam(['Then go. Take your households.', 'I’ll hold it with whoever stays.'], ['그럼 가시오. 그 사천 호 데리고.', '나는 남는 자들과 지키겠소.']),
		P(
			'He says it loud, to the fires. Around the fires, men stop eating. Anseung looks at them. Nobody stands up. Nobody sits down either. He understands what that means before Mojam does. In the morning they will follow whoever is still alive.',
			'그는 그 말을 크게, 모닥불들 쪽으로 한다. 불가의 사내들이 먹던 손을 멈춘다. 안승이 그들을 본다. 일어서는 자도 없고, 다시 앉는 자도 없다. 그게 무슨 뜻인지 그는 모잠보다 먼저 안다. 아침이 되면, 저들은 살아 있는 쪽을 따를 것이다.'
		),
		anseung(['…You’re right, General.', 'Let’s sleep on it.'], ['…장군 말이 맞소.', '하룻밤 자고 생각합시다.']),
		killed,
		P('In the morning the men by the fires do not ask where the general is. They pack.', '아침에 불가의 사내들은 장군이 어디 있느냐고 묻지 않는다. 짐을 싼다.'),
		south,
		scene10,
		fiction,
		bride,
		seal,
		D('munmu', ['And end the patent the way the emperor ends his. “Be reverent.”', 'Twice. He’ll hate that most of all.'], ['책서 끝은 황제가 쓰는 대로 맺어라. ‘삼가고 삼갈지어다.’', '두 번. 그게 제일 싫을 거다.']),
		P(
			'Anseung bows when the seal comes, very low: a king of Goguryeo in a Silla hall. Far north, on the Taedong, a tent is still standing with nobody in it.',
			'인장이 오자 안승은 아주 깊이 절한다. 신라의 전각 안에 선 고구려의 왕. 저 북쪽 대동강가에는, 아무도 없는 장막 하나가 아직 서 있다.'
		),
		P(
			'<b>The emperor hears there is a king of Goguryeo in Silla. His general reaches for a brush instead of a sword…!</b>',
			'<b>황제가 신라 안에 고구려 왕이 있다는 말을 듣는다. 그의 장수는 칼 대신 붓을 집어 든다…!</b>'
		)
	];
	anchor('andong-grid-stamp', 'Pyongyang is a Protectorate now');
	anchor('white-tiger-banner', 'raises Goguryeo’s colours');
	for (const id of ['revival-torch', 'tang-navy-fleet', 'tang-daming-palace-sunset', 'tang-imperial-procession']) anchor(id, 'Geom Mojam has the flag');
	e.logline = {
		en: 'Geom Mojam raises Goguryeo’s flag and finds a royal to stand under it. They disagree about dying, and only one of them sees the morning.',
		ko: '검모잠이 고구려의 깃발을 세우고 그 아래 세울 왕족을 찾는다. 둘은 죽는 일을 두고 갈라서고, 아침을 맞는 건 하나뿐이다.'
	};
});

// #90 Letters — cut the two records that repeat Munmu's speech; flag Xue's record draft.
patch(90, 'has a cicada in it', ({ e, at }) => {
	const record = at(4, 'reaches for the cicada');
	at(15, 'In the twenty-second year of Zhenguan my late father');
	at(17, 'South we carried grain to Bear Ford');
	const out = e.blocks.filter((_, i) => i !== 15 && i !== 17);
	out.splice(out.indexOf(record), 0, P('The copy the archives keep is longer, and has a cicada in it.', '기록에 남은 판본은 더 길고, 매미가 한 마리 나온다.'));
	e.blocks = out;
});

// #91 Stone Gate — the chase and the bridle as a scene; the apology as a move.
patch(91, 'most dangerous thing an army can do', ({ e, at, D, anchor }) => {
	const scene0 = at(0, 'Stone Gate');
	const map = at(2, 'Watch where the chase ends');
	const turn = at(3, 'At Seokmun the Tang turn around');
	turn.html = 'At Seokmun the Tang turn around. Out of the side valleys come the Mohe cavalry, into a Silla army that has not yet formed up. It is over in an afternoon.';
	turn.ko = '석문에서 당군이 돌아선다. 옆 골짜기에서 말갈 기병이 쏟아져, 아직 진을 펴지도 못한 신라군을 친다. 한나절 만에 끝난다.';
	const place = at(4, 'looks like a way out');
	at(5, 'Gao Kan and the rest fell back');
	at(6, 'Mount Baeksu');
	const formation = at(7, 'Seokmun, eighth month');
	formation.sides[1].units[1] = { label: 'Seven commanders', sub: 'all seven die in the valley' };
	const scene8 = at(8, 'The Apology');
	const apologySent = at(9, 'Silla sends an apology');
	const apology = at(10, 'guilty unto death');
	const flashback = at(11, 'a year before Baekje falls');
	const danneung = (en, ko) => N('Danneung', '#8d8d95', en, ko);
	const wonsul = (en, ko) => N('Wonsul', '#5b7fc4', en, ko);
	const minister = (en, ko) => N('True Bone minister', '#8d8d95', en, ko);
	e.blocks = [
		scene0,
		P('Winning is the most dangerous thing an army can do.', '군대가 할 수 있는 가장 위험한 일은 이기는 것이다.'),
		P(
			'Silla and what is left of the Goguryeo revival meet the Tang coming south, break them, and cut down several thousand. By noon the Tang are running north. Soon after, Silla is running after them.',
			'신라와 고구려 부흥군의 남은 이들이 남하하는 당군을 맞아 깨뜨리고 수천을 벤다. 한낮이 되자 당군은 북으로 달아난다. 얼마 뒤, 신라가 그 뒤를 쫓는다.'
		),
		map,
		P(
			'Among the riders is a lieutenant barely old enough for the rank, with a famous father and a borrowed horse. His name is <b>Wonsul</b>. Like every boy in his father’s yard, he has been taught that a Hwarang does not retreat. Nobody has taught him where a chase ends.',
			'말 탄 이들 가운데 그 계급을 달기에도 겨우 될까 말까 한 비장이 있다. 이름난 아버지와 빌린 말. 이름은 <b>원술</b>. 아버지의 연무장 아이들이 다 그렇듯, 화랑은 물러서지 않는다고 배웠다. 추격이 어디서 끝나는지는 아무도 가르쳐 주지 않았다.'
		),
		danneung(['Lieutenant. The column’s strung out over two li. We’re not in line.'], ['비장님. 대열이 이 리나 늘어졌습니다. 진이 안 섰어요.']),
		wonsul(['They’re running. You don’t form a line to chase a man who’s running.'], ['저놈들 달아나잖아. 달아나는 놈 쫓는 데 무슨 진이야.']),
		place,
		turn,
		P(
			'Wonsul sees the general ahead of him go down, and then the next one. He turns his horse toward the Mohe, which is the direction a son of Kim Yushin is supposed to turn.',
			'원술은 앞서 가던 장수가 쓰러지는 것을 본다. 그다음 장수도. 그는 말머리를 말갈 쪽으로 돌린다. 김유신의 아들이라면 돌려야 하는 쪽이다.'
		),
		wonsul(['Let go.'], ['놔.']),
		P('His aide, Danneung, has the bridle in both fists.', '그의 보좌 담릉이 두 주먹으로 고삐를 쥐고 있다.'),
		danneung(
			['No.', 'Dying’s not the hard part, Lieutenant. Any fool can do it in the next ten breaths.', 'Picking where is hard. This is a ditch. Die here and you’ve bought nothing.'],
			['못 놓습니다.', '죽는 건 어려운 게 아닙니다, 비장님. 바보도 열 숨 안에 합니다.', '죽을 자리를 고르는 게 어렵지요. 여긴 도랑입니다. 여기서 죽으면 아무것도 못 삽니다.']
		),
		wonsul(['My father—', 'Let go, or I’ll cut your hand off.'], ['우리 아버지가—', '놔. 안 놓으면 손목을 자른다.']),
		danneung(['Then cut it. I’ll still be holding.'], ['자르십시오. 그래도 쥐고 있을 겁니다.']),
		P(
			'He doesn’t cut it. Danneung turns the horse himself and runs it south through the dust, with a lieutenant on its back who screams at him the whole way. Seven Silla generals die in that valley. Wonsul is not one of them.',
			'원술은 자르지 않는다. 담릉이 손수 말머리를 돌려, 등 위에서 내내 소리 지르는 비장을 태운 채 먼지 속을 남으로 달린다. 그 골짜기에서 신라 장수 일곱이 죽는다. 원술은 그 일곱에 들지 않는다.'
		),
		formation,
		scene8,
		apologySent,
		P('The draft comes to the king’s table that winter. The court has read it. The court would like a word.', '그해 겨울, 초안이 왕의 탁자에 오른다. 조정은 이미 읽었다. 조정은 할 말이 있다.'),
		apology,
		minister(
			['Majesty. “Tear your servant limb from limb”? We won the morning.', 'We are apologizing for the morning?'],
			['전하. ‘신의 몸을 찢으소서’라니요? 아침 싸움은 우리가 이겼습니다.', '이긴 걸 사죄합니까?']
		),
		D('munmu', ['We’re apologizing for the afternoon.', 'And for the next fortress. And the one after that.'], ['오후를 사죄하는 거요.', '그리고 다음 성도. 그다음 성도.']),
		minister(['…Who wrote this?'], ['…이걸 누가 썼습니까?']),
		D('munmu', ['My father. Thirteen years ago.', 'I’m only signing it.'], ['아버님이. 열세 해 전에.', '나는 서명만 하는 거요.']),
		P(
			'The minister thinks it is a joke. It is a room in Surabol, a year before Baekje fell, and a father asking his son a question.',
			'대신은 농담인 줄 안다. 실은 백제가 무너지기 한 해 전, 서라벌의 어느 방이다. 아버지가 아들에게 묻고 있다.'
		),
		flashback,
		P('Munmu signs. The ink is still wet when the first stones of the new walls go in.', '문무가 서명한다. 먹이 채 마르기도 전에, 새 성벽의 첫 돌이 놓인다.'),
		P('<b>Wonsul came home alive. In his father’s house, that is the crime…!</b>', '<b>원술은 살아서 돌아왔다. 그의 아버지 집에서는, 그것이 죄다…!</b>')
	];
	anchor('seokmun-map', 'Silla is running after them');
});

// #92 Wonsul — new hook, the mother's lamp, Munmu's boyhood "Retreat".
patch(92, 'a day before the news does', ({ e, at, D }) => {
	at(1, 'Danneung held the bridle');
	const map = at(2, '');
	const scene3 = at(3, "Father's House");
	const notMine = at(4, 'He is not my son');
	const point = at(5, 'The retreat is almost beside the point');
	point.html = 'The retreat is almost beside the point. A hundred men ran that afternoon and kept their fathers. But a house that came into Silla by treaty does not get to be ordinary, or it is simply Gaya again.';
	point.ko = '실은 퇴각이 문제의 핵심도 아니다. 그날 오후 백 명이 달아나고도 아버지를 잃지 않았다. 그러나 조약으로 신라에 들어온 집안에게 평범함은 허락되지 않는다. 그러지 못하면 그저 다시 가야일 뿐이다.';
	const mine = at(6, 'Mine may not');
	const scene7 = at(7, "The King's Hall");
	const request = at(8, 'asks, in so many words');
	const lieutenants = at(9, 'Lieutenants follow');
	const house = at(10, 'do not ask me to call him back');
	const scene11 = at(11, 'The Hill Farms');
	const farms = at(12, 'Wonsul does not go home');
	farms.html = 'Wonsul does not go home. He goes into the hill farms east of the capital and works another man’s fields under no name at all, which is the one punishment his father did not think to ask for. He does not write. Twice he comes as far as the road below his father’s gate and turns back at the sight of his mother’s lamp.';
	farms.ko = '원술은 집에 가지 않는다. 도성 동쪽 산골 농가로 들어가 이름도 없이 남의 밭을 간다. 아버지가 미처 청하지 못한 단 하나의 벌이다. 그는 편지를 쓰지 않는다. 두 번, 아버지 집 대문 아래 길까지 왔다가 어머니의 등불을 보고 돌아선다.';
	e.blocks = [
		P('Wonsul gets home a day before the news does. It doesn’t help.', '원술은 소식보다 하루 먼저 집에 닿는다. 그래 봐야 소용없다.'),
		P(
			'His father’s gate stays shut. The lamp above it is his mother’s. <b>Lady Jiso</b> is King Muyeol’s daughter, and she keeps it lit every night her men are at war. Tonight it burns, and she does not come down.',
			'아버지의 대문은 닫혀 있다. 대문 위 등불은 어머니의 것이다. 무열왕의 딸 <b>지소부인</b>은 집안 사내들이 싸움터에 있는 밤이면 늘 등불을 켜 둔다. 오늘 밤도 불은 타지만, 그녀는 내려오지 않는다.'
		),
		map,
		scene3,
		P('Inside, Yushin is told his son is at the gate. He doesn’t get up.', '안에서 유신은 아들이 대문에 왔다는 말을 듣는다. 일어나지 않는다.'),
		N('Steward', '#8d8d95', ['My lord. It’s the young master. He’s hurt, I think. His horse is—'], ['나리. 작은 도련님이십니다. 다치신 것 같습니다. 말이—']),
		notMine,
		point,
		mine,
		scene7,
		request,
		lieutenants,
		D('yushin', ['The law is the law, Majesty. A Hwarang does not retreat.'], ['법은 법입니다, 전하. 화랑은 물러서지 않습니다.']),
		D(
			'munmu',
			['On your yard you once asked me which of the five I would break first.', 'I said retreat. I was fifteen. You didn’t ask my father to kill me.'],
			['외숙의 연무장에서, 다섯 가운데 무엇을 먼저 깨겠느냐고 물으신 적이 있소.', '나는 물러섬이라 했소. 열다섯이었지. 외숙은 아버님께 나를 죽이라 청하지 않으셨소.']
		),
		D('yushin', ['…You were not my son.'], ['…전하는 제 아들이 아니었으니까요.']),
		P('The king has no answer to that. The old man knows it. Neither of them looks away first.', '왕은 그 말에 할 대답이 없다. 노인도 그걸 안다. 둘 중 누구도 먼저 눈을 돌리지 않는다.'),
		house,
		D('munmu', ['…As you wish, Marshal.'], ['…뜻대로 하시오, 대장군.']),
		scene11,
		farms,
		...e.blocks.slice(13)
	];
	e.logline = {
		en: 'Wonsul came home alive from Stone Gate. His father asks the king to execute him, and the king answers with something he said at fifteen.',
		ko: '원술은 석문에서 살아 돌아왔다. 아버지는 왕에게 아들을 죽여 달라 청하고, 왕은 열다섯 살 때 했던 말로 답한다.'
	};
});

// #93 Kim Yushin† — make #1's promises audible, ask after Wonsul, one obituary paragraph, Daeto moves to #94.
patch(93, 'bare name in forty-one years', ({ e, at, D }) => {
	const head = e.blocks.slice(0, 15);
	at(14, 'Yushin…');
	const princess = at(15, 'Princess…');
	const counsel = at(16, 'to succeed is not easy');
	at(17, 'as a fish having water');
	const ritual = e.blocks.slice(18, 22);
	at(18, 'Kangrim reads his name three times');
	const yard = at(22, 'Munhee is in the courtyard');
	yard.html = 'When the escort walks out through the courtyard, Munhee is standing by the well. She is sixty-seven. She sees her brother walking beside the stranger. Nobody else in the yard does. Above the roof the eastern star is up, the one that sits among the stars without being one of them.';
	yard.ko = '저승 길잡이가 마당을 지나 나갈 때, 문희는 우물가에 서 있다. 예순일곱이다. 낯선 사내 곁에서 걸어가는 오라비를 그녀는 본다. 마당의 다른 누구도 보지 못한다. 지붕 위로 동쪽 별이 떠 있다. 별들 사이에 있으면서 별은 아닌, 그 별.';
	const ask = at(23, 'Are you a Silla man now');
	const answer = at(24, 'Ask them for me');
	const buried = at(25, 'He is buried at Geumsan');
	at(26, 'Daeto');
	const header = at(27, 'Kim Yushin');
	const obit = at(28, 'His grandfather bought the family a rank');
	obit.html = '<i>His grandfather bought the family a rank with a kingdom. Everyone honoured the deal, and everyone remembered it. So he made himself the one thing they could not do without, and he was very, very good at it. He loved a queen for forty years and never once said so where it could be heard. They would not let him all the way in while he lived. Once he was safely dead, they made him a king.</i>';
	obit.ko = '<i>그의 할아버지는 나라 하나로 집안의 신분을 샀다. 모두가 그 거래를 지켰고, 모두가 그것을 기억했다. 그래서 그는 그들이 없이는 안 되는 단 하나가 되었고, 그것을 아주, 아주 잘해 냈다. 사십 년을 한 여왕을 사랑했으나, 들릴 만한 자리에서는 한 번도 그렇다고 말하지 않았다. 살아 있는 동안에는 끝내 다 들여보내 주지 않았다. 안전하게 죽고 나자, 그들은 그를 왕으로 만들었다.</i>';
	const jisoScene = at(33, 'Lady Jiso');
	const gate = at(34, 'asks at the gate for his mother');
	gate.html = 'After the funeral Wonsul comes down from the hills at last and asks at the gate for his mother. The lamp is out. <b>Lady Jiso</b> has already cut her hair for the nunnery.';
	gate.ko = '장례가 끝나고 원술은 마침내 산에서 내려와 대문에서 어머니를 청한다. 등불은 꺼져 있다. <b>지소부인</b>은 이미 비구니가 되려고 머리를 잘랐다.';
	e.blocks = [
		...head,
		P('Nobody has called him by his bare name in forty-one years. The last one was a queen, on her coronation morning.', '마흔한 해 동안 아무도 그를 이름만으로 부르지 않았다. 마지막으로 그렇게 부른 이는 즉위하던 아침의 여왕이었다.'),
		princess,
		D('yushin', ['…The boy. Is he eating?'], ['…그 아이는. 밥은 먹습니까?']),
		D('munmu', ['He’s farming. Badly. Shall I send for him?'], ['밭을 갈고 있소. 서툴게. 부를까요?']),
		D('yushin', ['…No.', 'Good. That he’s eating.'], ['…아닙니다.', '됐습니다. 먹고 있다니.']),
		counsel,
		...ritual,
		yard,
		ask,
		answer,
		P('She lets him go without asking twice. There is nobody left now who calls her little sister.', '그녀는 두 번 묻지 않고 그를 보낸다. 이제 그녀를 동생이라 불러 줄 사람은 아무도 없다.'),
		buried,
		header,
		obit,
		jisoScene,
		gate,
		at(35, 'A woman has three to follow'),
		at(36, 'She does not come to the gate'),
		P(
			'<b>The king has buried his uncle. He still has one letter to answer, and a path nobody ever showed him…!</b>',
			'<b>왕은 외숙을 묻었다. 아직 답할 편지가 하나 남았고, 아무도 보여 주지 않은 길이 하나 남았다…!</b>'
		)
	];
});

// #94 The Wanggeom's Guest — Daeto's arrest opens it, grief before the cavern, a reunion instead of a replayed meet-cute.
patch(94, 'a letter falls out of a sleeve', ({ e, at, D }) => {
	const ride = at(0, 'After the funeral rites');
	ride.html = 'That evening Munmu rides alone into the hills east of Surabol. His uncle never showed him the path. He finds it anyway, the way sons find what uncles hid on purpose.';
	ride.ko = '그날 저녁 문무는 홀로 서라벌 동쪽 언덕으로 말을 달린다. 외숙은 그 길을 가르쳐 준 적이 없다. 그래도 그는 찾아낸다. 아들들이 외숙이 일부러 숨긴 것을 찾아내듯이.';
	at(1, 'best of both');
	const strip = at(2, 'He strips at the rock lip');
	const crimson = at(3, 'Crimson leaves his shoulders');
	const smell = at(4, 'They smell him before they see him');
	smell.html = 'They smell him before they see him. Uncle’s heat, father’s road-dust, both houses in one walk. He still thinks he is alone. Golhwa’s mouth opens and does not close. Hyullé cannot get a word out. Narim bites her lip and fails at being eldest.';
	smell.ko = '보기 전에 냄새로 안다. 외숙의 열, 아버지의 길먼지, 한 걸음 안에 집 둘. 그는 아직 혼자인 줄 안다. 골화의 입이 열리고 다물어지지 않는다. 혈레는 말이 안 나온다. 나림은 입술을 깨물고 언니 노릇에 실패한다.';
	const both = at(5, 'they said it first when he was twenty-one');
	both.html = 'They know him. The <b>best of both</b>: they said it first when he was twenty-one and came in with a jar, and they say it again now that the uncle is ash. Gaya in the shoulders. Surabol in the mouth. Fire comes off Golhwa’s skin. Water streams from Hyullé’s chin. A leaf turns in the steam around Narim and will not fall.';
	both.ko = '그들은 그를 안다. <b>양쪽의 최선</b>. 스물하나, 항아리를 들고 왔을 때 처음 그렇게 말했고, 외숙이 재가 된 지금 다시 말한다. 어깨는 가야. 입은 서라벌. 골화의 살에서 불이 난다. 혈레의 턱에서 물이 흐른다. 나림 주위 김 속에서 잎 하나가 돌고, 떨어지지 않는다.';
	const breath = at(8, 'Narim cannot finish the sentence');
	breath.html = 'He looks at her like she is kind. Narim cannot finish the sentence. She is out of breath, and pretends the steam did that. Uncle’s shoulders. Father’s mouth. She is not supposed to want both, tonight of all nights.';
	breath.ko = '그가 친절한 사람을 보듯 그녀를 본다. 나림은 문장을 끝내지 못한다. 숨이 가쁘다. 김 탓인 척한다. 외숙의 어깨. 아버지의 입. 둘 다 원하면 안 된다. 하필 오늘 같은 밤에.';
	const hello = at(13, 'I’ll be quiet');
	const near = at(15, 'She stands near him');
	near.html = 'That is all Hyullé gets out. She stands near him in the water and looks like she will break. He keeps the black water as a wall. He does not climb out.';
	near.ko = '혈레가 꺼낼 수 있는 말은 그게 전부다. 물속에서 그의 곁에 서서, 금방이라도 부서질 것처럼 보인다. 그는 검은 물을 벽으로 쓴다. 올라오지 않는다.';
	const fallIn = at(16, 'Sit down before you fall in again');
	const westQ = at(17, 'I came because he died');
	const solid = at(18, 'The comedy goes out of the cave');
	solid.html = 'Something goes out of the cave. When they speak again the eyes are solid: green, cyan, ember.';
	solid.ko = '동굴에서 무언가가 빠져나간다. 다시 말할 때 그들의 눈은 통째로 빛난다. 초록, 청록, 불씨.';
	const oracle = at(19, 'The west will take your name');
	const back = at(20, 'That was the hill. This is me.');
	back.en = ['That was the hill. This is me.', 'Come back anyway. With nothing in your hands, like tonight. We like you better that way.'];
	back.lines = ['그건 언덕이었어. 이건 나야.', '그래도 또 와. 오늘처럼 빈손으로. 그게 더 좋아.'];
	const tail = e.blocks.slice(21, 24).concat(e.blocks.slice(25, 27));
	at(24, 'dwelling of the immortal Wanggeom');
	const told = at(27, 'Munmu tells no one');
	told.html = 'Munmu tells no one. The court records note only a day’s ride and a night’s silence. But he has heard the bear’s son’s name before, in his mother’s version, with extra garlic, and he keeps it.';
	told.ko = '문무는 아무에게도 말하지 않는다. 조정 기록에는 하루의 기승과 하룻밤의 침묵만 남는다. 그러나 그는 곰의 아들 이름을 전에도 들은 적이 있다. 어머니 판본으로, 마늘이 좀 더 들어간. 그는 그 이름을 간직한다.';
	const card = at(28, 'The ship is here');
	e.blocks = [
		S('The Second Letter', '두 번째 편지'),
		P('The day after the funeral, a letter falls out of a sleeve.', '장례 이튿날, 소매에서 편지 한 통이 떨어진다.'),
		P(
			'It is short. It is addressed to the Tang garrison at Bear Ford, and it promises them a door in the wall of Surabol, the way a man at Daeya once promised Baekje a granary. The hand is very steady. The king knows that hand. It copied his letter to Xue Rengui.',
			'짧은 편지다. 받는 곳은 웅진의 당군 진영이고, 서라벌 성벽의 문 하나를 약속한다. 언젠가 대야성의 한 사내가 백제에 곳간을 약속했듯이. 글씨가 아주 차분하다. 왕은 그 글씨를 안다. 설인귀에게 보낸 그의 답서를 정서한 손이다.'
		),
		D('daeto', ['Majesty. A softer word here and there—'], ['전하. 여기저기 말 한두 마디만 누그러뜨리면—']),
		D('munmu', ['You said that in the writing room.', 'You copied my letter very well, Daeto. Copy this one.'], ['글방에서도 그 말을 했지.', '내 편지를 아주 잘 옮겨 적었소, 대토. 이것도 옮겨 적으시오.']),
		P(
			'It is his own death warrant. Daeto copies it out fair, and his hand is still very steady. His wife and children are made slaves. Nobody mentions it at court.',
			'그것은 그 자신의 사형 명령이다. 대토는 그것을 정서한다. 손은 여전히 아주 차분하다. 처자는 노비가 된다. 조정에서 그 이야기를 꺼내는 사람은 아무도 없다.'
		),
		S('The Steam Cavern', '김 서린 동굴'),
		ride,
		strip,
		crimson,
		P(
			'For a long time he only stands in the water. He is forty-seven, and a king, and there is nobody left alive who taught him to ride. He lets the steam have his face, so that nobody has to see it. Not even the rock.',
			'한참 동안 그는 물속에 서 있기만 한다. 마흔일곱, 왕이다. 말 타는 법을 가르쳐 준 사람은 이제 아무도 살아 있지 않다. 그는 김에 얼굴을 맡긴다. 아무도 보지 않도록. 바위조차.'
		),
		smell,
		both,
		D('munmu', ['…You’re still here.', 'I brought a jar last time. I didn’t bring anything tonight.'], ['…아직 계셨구려.', '지난번엔 항아리를 들고 왔었소. 오늘 밤엔 아무것도 안 가져왔소.']),
		D('narim', ['You brought him. On your shoulders. We can smell it.', 'Sit. Before you fall—'], ['그분을 데려왔잖아요. 어깨에. 냄새가 나요.', '앉아요. 쓰러지기 전에—']),
		breath,
		D('golhwa', ['He’s the one crying and I’m the one who can’t sit.', '…Sorry. Ignore me. Stay till the steam drops.'], ['우는 건 쟤인데 못 앉는 건 나야.', '…미안. 나 무시해. 김 식을 때까지 있어.']),
		hello,
		near,
		fallIn,
		westQ,
		solid,
		oracle,
		back,
		...tail,
		told,
		card
	];
	e.logline = {
		en: 'The day after the funeral, Munmu signs a traitor’s death warrant, then finds his uncle’s spring. Something older than any kingdom is waiting on the water.',
		ko: '장례 이튿날, 문무는 배신자의 사형 명령에 서명하고 외숙의 샘을 찾아간다. 물 위에서 어느 나라보다 오래된 누군가가 기다린다.'
	};
});

// #95 Maeso — Punghun on Xue's deck with a fate, Sideuk planted, Wonsul at the picket line in two lines.
patch(95, 'the sand is firm', ({ e, at, D }) => {
	const b = (i, f) => at(i, f);
	const scene0 = b(0, 'The Landing');
	const open = b(1, 'His pilot is Kim Punghun');
	b(2, 'took Punghun as his guide');
	const map = b(3, 'Horses by sea');
	const older = b(4, 'He is older now');
	older.html = 'He is older now. The white coat is a reputation he can no longer take off. Tang’s eastern command sits on his shoulders the way a yoke sits on an ox that still believes in the field. In a poor field at home, his ancestors are still waiting for their graves.';
	older.ko = '그는 이제 늙었다. 흰옷은 벗을 수 없는 이름이다. 당의 동방 총지휘는, 아직도 밭을 믿는 소의 어깨에 얹힌 멍에처럼 그의 어깨에 있다. 고향의 척박한 밭에서는 조상들이 아직도 무덤을 기다리고 있다.';
	const lastOpp = b(5, 'my last opponent');
	const ji = b(6, 'He does not curse them');
	const munhun = b(7, 'Munhun');
	const captain = (i, f) => {
		const x = b(i, f);
		x.speaker = 'Sideuk';
		return x;
	};
	const horsesFirst = captain(8, 'Horses first');
	const letThem = b(9, 'Let them');
	const told = captain(10, 'We were told to stop the landing');
	const wetSand = b(11, 'A horse on wet sand');
	const stands = b(12, 'Munhun stands up');
	const toBoats = b(13, 'To the boats');
	const evening = b(14, 'fourteen hundred heads');
	const rest1 = e.blocks.slice(15, 21);
	b(20, 'Cut the picket lines');
	const rest2 = e.blocks.slice(21, 24);
	b(24, 'One of the men who cut the picket lines');
	b(25, 'wash away his old shame');
	const fleet = e.blocks.slice(26, 36);
	b(36, 'Li Jinxing camped at Maeso');
	b(37, 'three battles and won them all');
	const ships = b(38, 'It’s the sea now');
	b(39, 'One last river mouth');
	const punghun = (en, ko) => N('Kim Punghun', '#9a8fc4', en, ko);
	const wonsul = (en, ko) => N('Wonsul', '#5b7fc4', en, ko);
	const commander = (en, ko) => N('Silla commander', '#4f7fbf', en, ko);
	e.blocks = [
		scene0,
		open,
		map,
		older,
		P(
			'Punghun stands at the bow beside him. He left Silla a boy, a hostage in the emperor’s guard. He is coming back as a guide.',
			'풍훈이 뱃머리에 그와 나란히 선다. 소년으로 신라를 떠나 황제의 숙위에 볼모로 갔던 그가, 이제 길잡이로 돌아온다.'
		),
		D('xuerengui', ['You know this coast, Master Kim.'], ['이 해안을 아십니까, 김 공.']),
		punghun(['I know my father’s coast.', 'The king made it mine to sell.'], ['아버지의 해안을 압니다.', '왕이 그걸 제가 팔 물건으로 만들어 주었지요.']),
		D('xuerengui', ['I am not buying anything.', 'I only ask where the sand is firm. For the horses.'], ['저는 아무것도 사지 않습니다.', '말을 내릴 모래가 단단한 곳을 여쭐 뿐입니다.']),
		P('Punghun looks at the beach below Cheon Fortress for a long time.', '풍훈은 천성 아래 바닷가를 오래 바라본다.'),
		punghun(['…There. Firm enough.'], ['…저기요. 그만하면 단단합니다.']),
		lastOpp,
		ji,
		munhun,
		P(
			'Beside him lies a ship captain named <b>Sideuk</b>, who has commanded boats for twelve years and never once won anything.',
			'그 곁에는 <b>시득</b>이라는 선장이 엎드려 있다. 열두 해 배를 몰았고, 한 번도 이겨 본 적이 없다.'
		),
		horsesFirst,
		letThem,
		told,
		wetSand,
		N('Sideuk', '#4f7fbf', ['…Wet sand. I’ll remember that.'], ['…젖은 모래라. 기억해 두겠습니다.']),
		stands,
		toBoats,
		evening,
		P(
			'Nobody ever learns whether Punghun knew about the sand. Xue does not ask him. He sends him back to Chang’an on the next empty transport, and neither country writes his name down again.',
			'풍훈이 그 모래를 알았는지는 아무도 모른다. 설인귀는 묻지 않는다. 다음 빈 수송선에 그를 실어 장안으로 돌려보내고, 두 나라 어느 쪽도 다시는 그의 이름을 적지 않는다.'
		),
		...rest1,
		P(
			'The worst stretch of the line is under the walls, where the archers can see. A man nobody in the capital has seen for three years asks for it.',
			'가장 험한 자리는 성벽 바로 아래, 궁수들 눈에 보이는 곳이다. 세 해 동안 도성에서 아무도 보지 못한 사내 하나가 그 자리를 청한다.'
		),
		commander(['Name?'], ['이름은?']),
		wonsul(['Lieutenant. Of Seokmun.'], ['비장입니다. 석문의.']),
		...rest2,
		P('Afterwards the king sends for the lieutenant to give him rank. Wonsul comes in still smelling of horses.', '뒤에 왕이 벼슬을 주려고 그 비장을 부른다. 원술은 아직 말 냄새를 풍기며 들어온다.'),
		D('munmu', ['Your father would have—'], ['그대 아버지였다면—']),
		wonsul(['My father would have said I owe one afternoon, Majesty. I haven’t paid it yet.'], ['아버지라면 제가 한나절을 빚졌다 하셨을 겁니다, 전하. 아직 다 못 갚았습니다.']),
		...fleet,
		P('The Tang history says Maeso was three Tang victories, after which Silla begged pardon. It does not mention the horses.', '당의 역사서는 매소성이 당의 세 번 승리였고, 그 뒤 신라가 용서를 빌었다고 적는다. 말 이야기는 없다.'),
		ships,
		P('<b>One last river mouth. One captain who has never won a fight. Three tries to end a war…!</b>', '<b>마지막 강어귀. 한 번도 이겨 본 적 없는 선장 하나. 전쟁을 끝낼 기회는 세 번…!</b>')
	];
});

// #96 Final Ford — the 660 bookend, the third sortie from Sideuk's deck, Xue's exit, no messenger.
patch(96, 'The Third Sortie', ({ e, at, D }) => {
	const b = (i, f) => at(i, f);
	const open = b(0, 'In the second month');
	const map = b(1, 'one last idea');
	const scene2 = b(2, 'Final Ford');
	const mouth = b(3, 'The last of it happens');
	mouth.html = 'The last of it happens at the mouth of the Geum, in the eleventh month. Sixteen years ago the Tang came in through this same water, onto a mile of grey mud, while Baekje watched from the high ground. Seongchung had begged a different king to hold it.';
	mouth.ko = '마지막은 열한째 달, 금강 어귀에서 벌어진다. 열여섯 해 전 당군이 바로 이 물로 들어와 십 리 잿빛 개펄에 올랐고, 백제는 높은 땅에서 그것을 지켜보았다. 성충이 다른 임금에게 지켜 달라 애원했던 물목이다.';
	const sideuk = b(4, 'Sideuk');
	sideuk.html = 'The Silla ships belong to <b>Sideuk</b>, the captain who has never won anything. He takes them out on the ebb and loses.';
	sideuk.ko = '신라의 배는 한 번도 이겨 본 적 없는 선장 <b>시득</b>이 맡고 있다. 그는 썰물에 배를 몰고 나가, 진다.';
	const again = e.blocks.slice(5, 9);
	const big = b(9, 'A big ship can’t turn');
	big.en = ['Their ships are big.', 'A big ship can’t turn on the mudflats. Draw them in.', 'Like a horse on wet sand.'];
	big.lines = ['저놈들 배는 크다.', '큰 배는 개펄에서 못 돈다. 끌고 들어와.', '젖은 모래 위의 말처럼.'];
	b(10, 'twenty-two fights');
	b(11, 'Final Ford, eleventh month');
	const surabol = b(12, 'Surabol');
	b(13, 'No treaty comes after it');
	b(14, 'pulling out');
	const west = b(15, 'Nobody signs anything');
	b(16, 'Sideuk led ship-troops');
	const won = b(17, 'Have we… won…?');
	const card = b(18, 'hold still');
	const helm = (en, ko) => N('Silla helmsman', '#8d8d95', en, ko);
	const capt = (en, ko) => N('Sideuk', '#4f7fbf', en, ko);
	e.blocks = [
		open,
		map,
		scene2,
		mouth,
		sideuk,
		...again,
		big,
		S('The Third Sortie', '세 번째 출격'),
		P('The third time, Sideuk does not try to win. He runs.', '세 번째에 시득은 이기려 하지 않는다. 달아난다.'),
		P(
			'He takes eight boats up the estuary on the last of the flood, close enough to the Tang flagship to be insulting. Arrows thud into his deck. He lets them. Then he turns, badly, the way a beaten man turns, and makes for the mudflats.',
			'그는 밀물 끝자락을 타고 배 여덟 척을 강어귀 위로 몬다. 당의 기함에 모욕이 될 만큼 가까이. 화살이 갑판에 박힌다. 그대로 둔다. 그러고는 진 사람이 돌듯 엉성하게 돌아서, 개펄 쪽으로 간다.'
		),
		helm(['They’re coming! All of them— Sachan, the big ones are coming!'], ['옵니다! 다— 사찬님, 큰 놈들이 다 따라옵니다!']),
		capt(['Of course they are. They’ve beaten us twice.', 'Keep running. Look scared.'], ['당연하지. 두 번이나 이겼으니까.', '계속 달려. 겁먹은 척해.']),
		helm(['I’m not pretending, sir.'], ['척하는 거 아닙니다, 사찬님.']),
		P(
			'The tide turns under them. Sideuk’s boats float in a hand’s depth of water. The Tang tower-ships need a man’s height. One by one, the great hulls feel the mud take their keels, and stop, and lean.',
			'발밑에서 물때가 바뀐다. 시득의 배는 한 뼘 물이면 뜬다. 당의 누선은 사람 키만큼의 물이 필요하다. 하나씩, 큰 배들의 용골이 진흙에 잡히고, 멈추고, 기운다.'
		),
		capt(['Now. Turn. Everyone, turn!'], ['지금이다. 돌아. 다들 돌아!']),
		P(
			'What follows is twenty-two fights, large and small, in water too shallow for the ships that started them. Silla men cross the mud on planks, on oars, on their own bellies. The tower-ships cannot turn to face them. They can only lean further.',
			'그다음은 크고 작은 스물두 번의 싸움이다. 그 싸움을 시작한 배들에게는 너무 얕은 물에서. 신라 군사들은 널빤지로, 노로, 제 배를 깔고 진흙을 건넌다. 누선은 돌아서 맞설 수가 없다. 더 기울 수 있을 뿐이다.'
		),
		S('The Flagship', '기함'),
		P(
			'On the flagship, Xue Rengui stands at the rail and watches his fleet sit down in the mud like oxen in a flooded field. He is sixty-two. He knows exactly what he is looking at. He grew up looking at it.',
			'기함 난간에서 설인귀는 제 함대가 물 찬 논의 소처럼 진흙에 주저앉는 것을 지켜본다. 예순둘이다. 자기가 무엇을 보고 있는지 정확히 안다. 그걸 보며 자랐으니까.'
		),
		N('Tang officer', '#b45309', ['Commander. We can still float the flagship on the night tide. The others—'], ['대총관. 밤 물때에 기함은 띄울 수 있습니다. 나머지는—']),
		D(
			'xuerengui',
			['The others are a field we planted in the wrong season.', 'Float what floats. Take the men off the rest. Leave no one in the mud.'],
			['나머지는 철을 잘못 맞춰 심은 밭이오.', '뜨는 것만 띄우시오. 나머지 배에서는 사람만 내리시오. 진흙에 아무도 두고 가지 마시오.']
		),
		P('He does not curse Silla. He never has. At midnight the flagship lifts off the mud, and he turns her west.', '그는 신라를 욕하지 않는다. 한 번도 그런 적이 없다. 한밤중에 기함이 진흙에서 떠오르고, 그는 뱃머리를 서쪽으로 돌린다.'),
		D(
			'xuerengui',
			['Ancestors.', 'I asked you to wait a little longer. It was longer than I said.', 'I am coming home without the east. I still have the ji.'],
			['조상님.', '조금만 기다려 달라 말씀드렸지요. 말씀드린 것보다 길어졌습니다.', '동쪽은 못 가져갑니다. 극은 아직 있습니다.']
		),
		P('No treaty comes after it, and no envoy. The Tang ships simply keep going west, and nobody on them looks back.', '그 뒤로 조약도 오지 않고 사신도 오지 않는다. 당의 배들은 그저 계속 서쪽으로 가고, 그 위의 누구도 돌아보지 않는다.'),
		west,
		surabol,
		P(
			'In Surabol the king waits a month for a letter from the west, so that he will at least have something to refuse. None comes.',
			'서라벌에서 왕은 서쪽에서 올 편지를 한 달 동안 기다린다. 적어도 거절할 거리라도 있도록. 아무것도 오지 않는다.'
		),
		won,
		N('Court scribe', '#8d8d95', ['Nobody has told us we haven’t, Majesty.'], ['졌다고 알려 온 사람은 아무도 없습니다, 전하.']),
		P('He laughs, for the first time since the funeral, and goes to tell his mother.', '그는 장례 뒤 처음으로 웃는다. 그리고 어머니에게 알리러 간다.'),
		card
	];
	e.logline = {
		en: 'At the river mouth where the Tang landed sixteen years ago, a captain who has never won anything loses twice on purpose. Xue Rengui watches his fleet sit down in the mud.',
		ko: '열여섯 해 전 당군이 상륙했던 강어귀에서, 한 번도 이겨 본 적 없는 선장이 일부러 두 번 진다. 설인귀는 제 함대가 진흙에 주저앉는 것을 지켜본다.'
	};
});

// #97 The King for All — Inmun's letter, the first act in the hall, the eastern star, the broken oath, Kangrim at the sea.
patch(97, 'Open the doors', ({ e, at, D, anchor }) => {
	const b = (i, f) => at(i, f);
	const open = b(0, 'stands where a six-year-old once stole a sentence');
	const map = b(1, 'Sixteen years, start to finish');
	const kept = b(2, 'I kept the childhood sentence');
	const packed = b(3, 'I packed for every country');
	const room = b(4, 'getting someone else ready');
	const seventy = b(5, 'Munhee is seventy');
	const collar = b(6, 'Your collar is crooked');
	const today = b(7, 'Today I become king of all Samhan');
	const still = b(8, 'all the more reason to hold still');
	const every = b(9, 'She has been in the room for every single one of them');
	every.html = 'She has been in the room for every single one of them. The sword was never in her hand, and she is the only one still standing.';
	every.ko = '그는 그 모든 자리에 있었다. 칼을 쥔 적은 한 번도 없고, 아직 서 있는 사람은 그뿐이다.';
	const thousand = b(10, 'A kingdom that lasts a thousand years');
	const round = b(11, 'round the numbers up');
	const ninetwo = b(12, 'nine hundred and ninety-two years');
	const later = b(13, '681');
	later.label = 'Five Summers Later';
	later.ko = '다섯 해 뒤';
	const dying = b(14, 'Five summers later the king for all is dying');
	const dragon = b(15, 'great dragon that guards the country');
	const shore = b(16, 'They burn him on the shore');
	const tabletScene = b(17, '692');
	tabletScene.label = 'The Tablet';
	tabletScene.ko = '위패';
	const envoy = b(18, 'Eleven years after the tide closes over him');
	envoy.html = 'Eleven years after the tide closes over him, an envoy comes from the Empress’s court with a complaint that is thirty years late. King Muyeol’s tablet in Silla’s ancestral temple says Taejong, and Taejong is the Second Emperor’s temple name, and a vassal may not share a name with the Son of Heaven. Nobody from the Empress’s court mentions the iron oath hanging beside the tablet, broken in every line.';
	envoy.ko = '밀물이 그를 덮은 지 열한 해 뒤, 여제의 조정에서 사신이 온다. 삼십 년 늦은 항의를 들고. 신라 종묘의 무열왕 위패에 태종이라 적혀 있는데, 태종은 선제의 묘호이고, 번국은 천자와 이름을 나눌 수 없다는 것이다. 위패 곁에 걸린 쇠 맹세문이 한 줄도 남김없이 깨졌다는 이야기는, 여제의 조정 누구도 꺼내지 않는다.';
	const change = b(19, 'Change it');
	const writing = b(20, 'answers in writing');
	const reply = b(21, 'worth a name');
	const dropped = b(22, 'The court reads the name Kim Yushin');
	dropped.html = 'The court reads the name Kim Yushin, and an old archivist goes looking. He finds a note in the late emperor’s own hand, from his boyhood: a voice in the sky once told him that one of the Thirty-Three Heavens had been born in the east as a general. Nobody ever learned whose voice it was. Heaven gossips more than it lets on. The complaint is dropped. The tablet still says Taejong.';
	dropped.ko = '조정은 김유신이라는 이름을 읽고, 늙은 사관 하나가 서고를 뒤진다. 그는 선제가 어릴 적 손수 적어 둔 쪽지를 찾아낸다. 하늘에서 들린 목소리가, 서른세 하늘 가운데 하나가 동쪽에 장수로 태어났다고 일러 주었다는 것이다. 그 목소리가 누구였는지는 끝내 아무도 알아내지 못했다. 하늘은 보기보다 말이 많다. 항의는 거두어진다. 위패에는 지금도 태종이라 적혀 있다.';
	const card = b(23, 'we left someone in the snow');
	const elder = (en, ko) => N('True Bone elder', '#8d8d95', en, ko);
	e.blocks = [
		open,
		map,
		S('The Collar', '옷깃'),
		room,
		seventy,
		collar,
		today,
		still,
		kept,
		packed,
		every,
		D('munhee', ['Your sister rode out of this room to Daeya.', 'Hold still. I’m not losing another one to a door.'], ['네 누이는 이 방에서 대야로 떠났다.', '가만있어. 문 하나에 자식을 또 잃을 생각은 없다.']),
		P(
			'A letter has come from Chang’an. It is the first in Inmun’s hand in twenty years, and it is very short.',
			'장안에서 편지가 왔다. 스무 해 만에 처음 보는 인문의 글씨다. 아주 짧다.'
		),
		D(
			'inmun',
			[
				'Brother.',
				'The emperor made me King of Silla for a season. I got as far as the coast road before he changed his mind. I am told I abdicated. I agreed.',
				'Word came that you said my name. I heard it.',
				'— Inmun'
			],
			['형님.', '황제가 한 철 동안 저를 신라 왕으로 삼았습니다. 해안 길까지 갔는데 황제가 마음을 바꾸었지요. 제가 물러났다고들 합니다. 저도 그렇다 했습니다.', '형님이 제 이름을 불렀다는 말을 들었습니다. 들었습니다.', '— 인문'],
			{ chat: 'mail' }
		),
		D('munhee', ['His handwriting hasn’t improved.'], ['글씨는 하나도 안 늘었구나.']),
		P('She folds it into his sleeve, next to his arm, where he will feel it all day.', '그녀는 편지를 접어 아들의 소매 안, 팔에 닿는 자리에 넣어 준다. 하루 내내 느껴지도록.'),
		thousand,
		round,
		ninetwo,
		S('The Hall', '정전'),
		P(
			'The hall is full of bone. True Bone in the front rows, Head-rank Six behind them, and behind them the new men nobody has a rank for yet: Baekje captains who fought for Silla, Goguryeo’s guest king and his officers, a Mohe interpreter. Out in the yard stand the ones with no bone at all. They have come to see what a king for all looks like. Mostly he looks tired.',
			'전각은 뼈로 가득하다. 앞줄에 진골, 그 뒤에 육두품, 그 뒤에 아직 관등이 없는 새 사람들. 신라를 위해 싸운 백제 장수들, 고구려의 손님 왕과 그 신하들, 말갈 통역 하나. 마당에는 뼈가 아예 없는 사람들이 서 있다. 모두의 왕이 어떻게 생겼는지 보러 왔다. 대체로 그는 피곤해 보인다.'
		),
		D('munmu', ['Open the doors.', 'All of them. The yard too.'], ['문을 여시오.', '전부. 마당 쪽도.']),
		P('The doors open. The yard comes up to the threshold and stops there, the way people stop at a river.', '문이 열린다. 마당 사람들이 문턱까지 와서 멈춘다. 사람들이 강가에서 멈추듯.'),
		D(
			'munmu',
			[
				'Sixteen years of war were paid for with grain borrowed from people who had none.',
				'Every grain debt from the war years is cancelled. Today.',
				'The men of Baekje and Goguryeo who bled under our banners will hold Silla ranks. The same ranks.'
			],
			['열여섯 해 전쟁은 가진 것 없는 백성에게서 꾼 곡식으로 치렀소.', '전쟁 동안 진 곡식 빚은 모두 없던 것으로 하오. 오늘부로.', '우리 깃발 아래 피 흘린 백제와 고구려 사람은 신라의 관등을 받소. 같은 관등을.']
		),
		elder(['Majesty. The bone ranks are older than the throne. If a Baekje captain sits where—'], ['전하. 골품은 왕좌보다 오래되었습니다. 백제 장수 따위가 앉는 자리에—']),
		D(
			'munmu',
			['When I was six I said everyone would have to listen to me. Even the bone people.', '…I meant you, my lord.'],
			['여섯 살 때 내가 그랬소. 모두 내 말을 들어야 한다고. 뼈 있는 사람들도.', '…경을 두고 한 말이었소.']
		),
		P(
			'Somebody in the yard laughs. Then the whole yard does. The elder sits down. It is the first time that hall has ever heard the yard.',
			'마당의 누군가가 웃는다. 이어 마당 전체가 웃는다. 원로가 자리에 앉는다. 그 전각이 마당 소리를 들은 건 처음이다.'
		),
		D(
			'munmu',
			['I asked my uncle once. Every kingdom, or every person who bleeds for one. He never answered.', 'Both. Write that down.'],
			['외숙께 여쭌 적이 있소. 나라 전부냐, 나라를 위해 피 흘리는 사람 전부냐. 끝내 대답을 안 해 주셨지.', '둘 다요. 그렇게 적으시오.']
		),
		S('The Eastern Star', '동쪽 별'),
		P(
			'Thirty-four winters ago, three men looked up at one star and wanted the same title. One died a guest in Chang’an, still calling himself a king. One died in his bed, and the king of the dead came to fetch him in person. One left the title in his son’s mouth.',
			'서른네 해 전 겨울, 세 사내가 별 하나를 올려다보며 같은 칭호를 원했다. 하나는 장안에서 손님으로 죽었다. 끝까지 스스로를 왕이라 부르며. 하나는 제 침상에서 죽었고, 저승의 왕이 몸소 데리러 왔다. 하나는 그 칭호를 아들의 입에 남겼다.'
		),
		P(
			'That night the son climbs the hill above Surabol where two boys once lay on their backs, arguing about the sky.',
			'그날 밤 아들은 서라벌 위 언덕에 오른다. 한때 두 소년이 등을 대고 누워 하늘을 두고 다투던 곳이다.'
		),
		D('munmu', ['Uncle always said it was a planet.'], ['외숙은 늘 저게 행성이라 하셨지.']),
		P(
			'It sits among the stars without being one of them. He looks at it until the cold gets into his knees. Then he walks down to his own house, like anybody.',
			'별들 사이에 있으면서 별은 아니다. 그는 추위가 무릎에 스밀 때까지 그것을 올려다본다. 그러고는 여느 사람처럼, 제 집으로 걸어 내려간다.'
		),
		S('The Ancestral Temple', '종묘'),
		P(
			'In the morning he reports to his father. The tablet stands in the ancestral temple, and beside it hangs the iron oath from Mount Gain, the one he swore over his uncle’s horse.',
			'아침에 그는 아버지께 고한다. 위패는 종묘에 서 있고, 그 곁에 취리산의 쇠 맹세문이 걸려 있다. 외숙의 말 위에서 그가 맹세했던 그것이다.'
		),
		D(
			'munmu',
			['Father. I broke it. Every line.', 'Baekje is ours. Its prince is in Luoyang, with a title and no country.', 'His sons are growing. I asked. The gods have been lenient with us both.'],
			['아버님. 깼습니다. 한 줄도 남김없이.', '백제는 우리 것입니다. 그 왕자는 낙양에서 땅 없는 작위를 받았습니다.', '그 아들들은 잘 자란답니다. 알아봤습니다. 신들이 우리 둘 다를 봐주신 모양입니다.']
		),
		P(
			'He leaves the oath where it hangs. The kings of Silla will have to walk past it every time they visit their fathers. He wants them to read it.',
			'그는 맹세문을 걸린 그대로 둔다. 신라의 왕들은 선왕을 뵈러 올 때마다 그 앞을 지나가야 한다. 그는 그들이 그것을 읽기를 바란다.'
		),
		later,
		dying,
		D(
			'munmu',
			['The war is over. Melt the swords. Make ploughs.', 'Lighten the tax at the markets and the ferries.', 'And don’t build me a tomb. The people would only have to carry the stones.'],
			['전쟁은 끝났소. 칼을 녹이시오. 보습을 만드시오.', '장터와 나루의 세금을 가볍게 하시오.', '그리고 내 무덤은 짓지 마시오. 그 돌을 날라야 하는 건 백성이오.']
		),
		P(
			'Kangrim reads his name three times at the bedside — Bupmin. Bupmin. Bupmin. — the name the boy stole a sentence with, not the one the ledger writes.',
			'강림은 침상 곁에서 그의 이름을 세 번 부른다 — 법민. 법민. 법민. — 장부에 적힌 이름이 아니라, 소년이 문장을 훔치던 때의 이름이다.'
		),
		D(
			'kangrim',
			['King Munmu.', 'Sixteen years of war, one hill, one ally shown the door, and a yard you let into the hall.', 'One question, then we walk. Were you a king of Silla — or a king for all?'],
			['문무왕.', '열여섯 해의 전쟁, 언덕 하나, 문밖으로 내보낸 동맹 하나, 그리고 전각에 들인 마당 하나.', '하나만 묻고 갑시다. 신라의 왕이었소 — 아니면 모두의 왕이었소?']
		),
		D('munmu', ['…Ask the ones with no bone.', 'There are more of them.'], ['…뼈 없는 사람들한테 물으시오.', '그쪽이 더 많으니까.']),
		D('kangrim', ['The ledger has never asked them anything.', '…I suppose I’ll start. Come. The sea is this way.'], ['장부는 그들에게 무엇 하나 물어본 적이 없소.', '…내가 시작해야겠군. 갑시다. 바다는 이쪽이오.']),
		dragon,
		shore,
		tabletScene,
		envoy,
		change,
		writing,
		reply,
		dropped,
		card
	];
	anchor('three-crowns', 'She has been in the room for every single one of them. T');
	e.logline = {
		en: 'On the morning he becomes king of all Samhan, Munmu opens the hall to the yard. Five summers later, Kangrim asks him the question.',
		ko: '삼한 모두의 왕이 되는 아침, 문무는 전각 문을 마당에 연다. 다섯 해 뒤, 강림이 그에게 질문을 던진다.'
	};
});

// #98 Balhae — compress the replayed doorway, cut the coda records and era label, land on Gulgul's son.
patch(98, 'two kings under one sky', ({ e, at, anchor }) => {
	const fb = at(22, 'A Mohe doorway');
	const [d0, , , , , wall, cold, no, liar] = fb.blocks;
	if (!textOf98(d0).includes('A doorway with no house behind it')) throw new Error('#98 flashback changed');
	d0.html = 'A doorway with no house behind it. Snow on the ash. A Mohe boy holds a stick the way he has seen men hold spears. A big man in red-edged armor gets down off a red-bay horse, walks up until the stick touches his chest, laughs, and pulls off his gloves.';
	d0.ko = '뒤에 집이 없는 문간. 재 위의 눈. 말갈 아이 하나가 어른들이 창 잡는 걸 본 대로 막대기를 쥐고 서 있다. 붉은 테 갑옷의 덩치 큰 사내가 붉은 밤색 말에서 내려, 막대기 끝이 가슴에 닿을 때까지 걸어오더니, 웃고, 장갑을 벗는다.';
	const goodBlock = fb.blocks[4];
	goodBlock.en = ['Look at this one. Guarding a house that’s already burned.', 'Good. Get on.'];
	goodBlock.lines = ['이놈 봐라. 다 타 버린 집을 지키고 섰네.', '좋다. 타라.'];
	fb.blocks = [d0, goodBlock, wall, cold, no, liar];
	const walk = at(33, 'Thirty years later the boy will raise');
	walk.html = 'They walk on. Thirty years later, in 698, the boy will raise a kingdom called Balhae on those three words, and the shard will still be warm.';
	walk.ko = '그들은 계속 걷는다. 삼십 년 뒤인 698년, 아이는 그 세 마디 위에 발해라는 나라를 세울 것이다. 그리고 조각은 여전히 따뜻할 것이다.';
	const grid = at(34, 'stamped grid of halls');
	at(35, 'Dae Joyoung of the Balhae Mohe');
	at(36, 'Muye reports');
	at(37, 'Northern and Southern States Era');
	const theEnd = at(38, 'THE END');
	e.blocks = [
		...e.blocks.slice(0, 35),
		P(
			'So this story ends with two kings under one sky, each sure the sky meant him. In the south, a dead king lies under a rock in the sea, listening for the ones with no bone. In the north, a boy with frozen feet carries a piece of a crown. From high enough up, you can’t tell which of them is the King for All. The sky stopped trying a long time ago. It just watches the boy.',
			'그래서 이 이야기는 한 하늘 아래 두 임금으로 끝난다. 저마다 하늘이 자기를 두고 한 말이라 믿는다. 남쪽에서는 죽은 임금이 바닷속 바위 아래 누워, 뼈 없는 사람들의 소리에 귀를 기울인다. 북쪽에서는 발이 언 아이가 왕관 한 조각을 품고 간다. 충분히 높이서 보면, 누가 모두의 왕인지 가려낼 수가 없다. 하늘은 오래전에 가려내기를 그만두었다. 그저 아이를 지켜볼 뿐이다.'
		),
		P('Dae Joyoung keeps walking north, one hand on the gold under his coat.', '대조영은 웃옷 안의 금을 한 손으로 누른 채, 계속 북쪽으로 걷는다.'),
		theEnd
	];
	if (!e.blocks.includes(grid)) throw new Error('#98 grid lost');
	anchor('balhae-two-courts', 'two kings under one sky');
	anchor('balhae-lotus-tile', 'Lotus tiles');
	anchor('balhae-stone-lantern', 'A stone lantern');
});

function textOf98(b) {
	return [b.html, b.ko, ...(b.en ?? []), ...(b.lines ?? [])].filter(Boolean).join(' ');
}
