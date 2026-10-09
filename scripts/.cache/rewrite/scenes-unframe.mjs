// Unframe the whole-episode flashbacks: #3 Jinheung, #40 Jolbon, #54 Hyukgose, #55 Talhae, #56 Alji.
// Present-day speakers and inline flashback wrappers go; each story is told straight, in order.
// Idempotent: every step checks for its own marker before it writes.
import { editStory, textOf } from '../story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const S = (label, ko) => ({ kind: 'scene', label, ko });
const D = (person, lines, en) => ({ kind: 'dialogue', person, lines, en });
const X = (speaker, gender, lines, en) => ({ kind: 'dialogue', chip: '#8a8a94', speaker, gender, lines, en });

const has = (e, frag) => e.blocks.some((b) => textOf(b).includes(frag));
const one = (list, frag, pred = () => true) => {
	const hits = list.filter((b) => pred(b) && textOf(b).includes(frag));
	if (hits.length !== 1) throw new Error(`"${frag}": ${hits.length} hits`);
	return hits[0];
};
const idx = (e, frag) => e.blocks.indexOf(one(e.blocks, frag));

function jinheung(e) {
	if (!e.blocks.some((b) => b.speaker === 'The Old Hwarang')) return 'skip';
	const B = e.blocks;
	const hook = one(B, 'Ask anyone in Surabol about the Cloud King');
	const map = one(B, '', (b) => b.kind === 'map');
	const card = one(B, '', (b) => b.kind === 'card' && b.person === 'jinheung');
	const quote = one(B, '', (b) => b.kind === 'quote');
	const term = one(B, '', (b) => b.kind === 'term');
	const fence = one(B, '', (b) => b.kind === 'flashback').blocks;
	const closing = B.at(-1);
	closing.html = '<b>The rain fell on Baekje’s field, and Baekje kept the grudge. Two generations on, it names the prince who will inherit it…!</b>';
	closing.ko = '<b>그 비는 백제의 밭에 내렸고, 백제는 원한을 간직했다. 두 대가 지나, 백제는 그 원한을 물려받을 왕자를 세운다…!</b>';

	e.blocks = [
		hook,
		map,
		S('The Too-Big Crown', '너무 큰 왕관'),
		P(
			'He was seven when they put the crown on him. It was too big, and nobody mentioned it. Picture the first morning. The whole court is face-down on the floor, and the crown is sliding toward his eyebrows.',
			'왕관을 쓸 때 그는 일곱 살이었다. 왕관은 너무 컸고, 아무도 그 말을 하지 않았다. 첫날 아침을 떠올려 보라. 조정 전체가 바닥에 엎드려 있고, 왕관은 그의 눈썹 쪽으로 미끄러지는 중이다.'
		),
		D('jinheung', ['어마마마. 이거 내려와요.', '앞이 안 보여요.'], ['Mother. It’s slipping.', 'I can’t see.']),
		X('The Queen Mother', 'f', ['고개 드세요, 전하. 다들 엎드려 있어서 아무도 못 봐요.'], ['Chin up, Majesty. They’re all face-down. Nobody can see.']),
		D('jinheung', ['그럼 왜 써요?'], ['Then why wear it?']),
		P(
			'She doesn’t answer. She folds a strip of silk inside the band, and the crown stops sliding. He will remember the silk longer than any lesson she gave him.',
			'어머니는 대답하지 않는다. 비단 한 자락을 접어 테 안쪽에 끼운다. 왕관이 더는 미끄러지지 않는다. 그는 어머니의 어떤 가르침보다 그 비단을 오래 기억할 것이다.'
		),
		card,
		P(
			'By the end, Silla will have a river, a coastline and Gaya. He gets there by being the best ally in Samhan, right up until the afternoon he isn’t.',
			'끝에 가면 신라는 강 하나, 해안 하나, 그리고 가야를 쥐게 된다. 그는 삼한에서 가장 믿을 만한 동맹이라서 거기까지 간다. 믿을 만하지 않게 되는 그 오후 전까지는.'
		),
		S('The First Yard', '첫 마당'),
		P(
			'The boy grows up. So do a great many noble sons with nothing to do. His first idea is girls. Two beauties lead the young men in song. Then one gets the other drunk and pushes her into a river. The court does not bring it up.',
			'소년은 자란다. 할 일 없는 귀족 자제들도 잔뜩 자란다. 그의 첫 생각은 여자다. 두 미인이 젊은 사내들을 이끌고 노래한다. 그러다 하나가 다른 하나를 취하게 해서 강에 밀어 넣는다. 조정은 그 일을 입에 올리지 않는다.'
		),
		P(
			'So he tries boys. He fills a yard with the noblest sons in Surabol and watches from the porch.',
			'그래서 이번엔 사내아이들이다. 서라벌에서 가장 귀한 집 아들들로 마당을 채우고, 그는 툇마루에서 지켜본다.'
		),
		X('A minister', 'm', ['분을 바르게 하신다고요, 전하? 사내아이들한테요?'], ['Powder, Majesty? On boys?']),
		D('jinheung', ['예쁘게 보이느라 바쁘면 서로 물에 빠뜨릴 틈이 없겠지.'], ['If they’re busy being pretty, they won’t have time to drown each other.']),
		X('A minister', 'm', ['…여자들 때도 그렇게 말씀하셨습니다.'], ['…You said that about the girls, Majesty.']),
		P(
			'The king does not answer. In the yard a thirteen-year-old knocks a bigger boy flat and doesn’t offer him a hand.',
			'왕은 대답하지 않는다. 마당에서 열세 살짜리 하나가 저보다 큰 아이를 메다꽂고는 손도 내밀지 않는다.'
		),
		D('sadaham', ['일어나. 아니면 누워 있든가.'], ['Get up. Or don’t.']),
		X('A bigger boy', 'm', ['너 몇 살인데?'], ['How old even are you?']),
		D('sadaham', ['그럼 따라와 보든가.'], ['Then keep up.']),
		D('jinheung', ['저 애는 누군가?'], ['Who’s that one?']),
		X('A minister', 'm', ['사다함입니다. 열셋인데, 벌써 셋을 울렸습니다.'], ['Sadaham, Majesty. Thirteen. He’s made three of them cry already.']),
		D('jinheung', ['맨 윗줄에 적게.'], ['Put him at the top of the list.']),
		P(
			'That is the Hwarang. Take the noblest boys and put them in one yard. Make them ride, sing and rank each other until the ranking feels like fate.',
			'그것이 화랑이다. 가장 귀한 집 소년들을 한 마당에 모은다. 말 타고 노래하고 서로 순위를 매기게 한다. 순위가 운명처럼 느껴질 때까지.'
		),
		term,
		P(
			'Seventy years on, six old men around a brazier will put a woman on the throne. Every one of them learned to fall down in this yard.',
			'칠십 년 뒤, 화로를 둘러싼 늙은이 여섯이 한 여인을 왕좌에 앉힐 것이다. 그들은 모두 이 마당에서 넘어지는 법을 배웠다.'
		),
		S('The Northern Ridge', '북쪽 고개'),
		P(
			'The boys grow up, and the border grows faster. By the time the crown fits, he is wearing it up mountains. On a bare ridge in the far north, a mason is cutting a stone taller than himself. He is also arguing.',
			'소년들은 자라고, 국경은 그보다 빨리 자란다. 왕관이 머리에 맞을 무렵, 그는 그걸 쓰고 산을 오르고 있다. 먼 북쪽의 민둥 고개에서 석공 하나가 제 키보다 큰 돌을 쪼고 있다. 그리고 따지고 있다.'
		),
		X('The mason', 'm', ['전하, 글자 하나에 쌀 한 되씩입니더.', '공덕을 몇 줄 새기시믄 돌이 훨씬 번듯할 낍니더.'], ['Majesty, it’s a measure of rice a character.', 'Put in a few virtues and it’ll look a good deal grander.']),
		D('jinheung', ['누가 왔는지, 언제 왔는지. 그리고 이 땅이 이제 안쪽이라는 것.', '그거면 되네.'], ['Who came, and when. And that this ground is inside now.', 'That’ll do.']),
		X('The mason', 'm', ['그라믄 돌이 너무 밋밋합니더. 북쪽 놈들이 보고 웃을 낍니더.'], ['Then it’s a plain stone, Majesty. The northerners will laugh.']),
		D('jinheung', ['뽐내는 건 뺏길까 걱정하는 놈들이나 하는 거야.', '…그리고 쌀은 내가 내.'], ['Boasting is for men who are worried about losing it.', '…Also, I’m paying for the rice.']),
		X('The mason', 'm', ['…예. 밋밋하게 새기겠습니더.'], ['…Plain it is, Majesty.']),
		P(
			'He puts up four stones in all, on mountains, at the edges of what he takes. They are meant to be property deeds. The mason, it turns out, slipped in a few virtues anyway. Masons do.',
			'그는 모두 넷을 세운다. 산 위에, 제가 취한 것의 가장자리에. 등기 문서가 될 참이었다. 알고 보니 석공은 공덕 몇 줄을 슬쩍 끼워 넣었다. 석공들은 원래 그런다.'
		),
		quote,
		S('Dharma Cloud', '법운'),
		P(
			'Near the end he shaves his head. The king of the four mountain stones puts on a monk’s robe and takes a new name: Dharma Cloud. His queen goes into a nunnery beside him. The court keeps calling him Majesty. He keeps answering to the other thing.',
			'말년에 그는 머리를 깎는다. 네 산에 비석을 세운 왕이 승복을 입고 새 이름을 받는다. 법운, 법의 구름. 왕비도 그 곁 절로 들어간다. 조정은 계속 전하라 부른다. 그는 계속 다른 이름에 대답한다.'
		),
		X('A courtier', 'm', ['오늘도 법운 스님 하니까 돌아보시고, 전하 하니까 못 들은 척하시더군.'], ['Called him Brother Dharma Cloud today and he turned round. Called him Majesty and he didn’t hear.']),
		X('Another courtier', 'm', ['그래도 도장은 찍으시잖나.'], ['He still stamps things, though.']),
		X('A courtier', 'm', ['찍으시지. 염불하면서.'], ['Oh, he stamps them. Chanting.']),
		P(
			'Some afternoons he wanders down to the Hwarang yard. Nobody has thought to stop him.',
			'어떤 오후엔 그가 화랑의 마당으로 어슬렁어슬렁 내려간다. 말리려고 생각한 사람은 아무도 없다.'
		),
		S('The Yard Fence', '마당 울타리'),
		...fence,
		X('The Boy', 'm', ['…어느 벗이요, 전하?'], ['…Which friend, Majesty?']),
		D('jinheung', ['어깨. 다시.'], ['Shoulder. Again.']),
		P(
			'He never says. He dies that same year, still in the robe. If you want the friend’s name, ask in Sabi. They’ll change the subject.',
			'그는 끝내 말하지 않는다. 그해, 승복을 입은 채 죽는다. 그 벗의 이름이 궁금하면 사비에 가서 물어보라. 말을 돌릴 것이다.'
		),
		P(
			'Surabol calls him the Cloud King after that, for the name he took at the end. A cloud has no border. For an afternoon, the ground under it is its ground. It never asks whose field it’s raining on.',
			'그 뒤로 서라벌은 그를 구름왕이라 부른다. 마지막에 받은 이름을 따서. 구름에는 경계가 없다. 한나절 동안은 그 아래 땅이 다 제 땅이다. 구름은 누구 밭에 비를 뿌리는지 묻지 않는다.'
		),
		P(
			'Someday his great-granddaughter will put a stone in the middle of Surabol and point it at the sky. Nobody will be able to say she took that from a friend.',
			'언젠가 그의 증손녀가 서라벌 한복판에 돌을 세우고 하늘을 향하게 할 것이다. 그건 벗한테서 뺏었다고 아무도 말하지 못할 것이다.'
		),
		closing
	];
	return 'ok';
}

function jolbon(e) {
	if (!has(e, 'In the burned shrine at Yodong')) return 'skip';
	const from = e.blocks.indexOf(one(e.blocks, 'Yodong', (b) => b.kind === 'scene'));
	const to = idx(e, 'Look what they do in your name');
	e.blocks.splice(
		from,
		to - from + 1,
		P(
			'Long after, when Goguryeo is old and frightened, towns along the Liao will dress girls as his brides and shut them in his shrine for luck. They remember that a valley once handed him a girl and became a country. They forget she did the picking.',
			'한참 뒤, 고구려가 늙고 겁에 질렸을 때, 요하 가의 성들은 여자아이들을 그의 신부로 꾸며 사당에 들여보내고 문을 닫을 것이다. 골짜기 하나가 그에게 여자를 내주었더니 그 골짜기가 나라가 되었다는 건 기억한다. 그 여자가 골랐다는 건 잊는다.'
		),
		P(
			'One of those brides will sit under the chain mail in a burned shrine and hear how Sosuno shot at him. Then she will take off the crown, set it down like something borrowed, and walk home through the ash.',
			'그 신부 중 하나는 불탄 사당의 쇠사슬 갑옷 아래 앉아, 소서노가 그에게 활을 쐈다는 이야기를 듣게 된다. 그러고는 빌린 물건을 내려놓듯 관을 벗어 놓고, 잿더미를 지나 집으로 걸어갈 것이다.'
		)
	);
	return 'ok';
}

function hyukgose(e) {
	if (!has(e, 'Back in the coronation yard')) return 'skip';
	const from = e.blocks.indexOf(one(e.blocks, 'The Coronation Year', (b) => b.kind === 'scene'));
	const to = idx(e, 'The egg is the polite one');
	e.blocks.splice(from, to - from + 1);

	const chiefs = idx(e, 'They are village chiefs, from six valleys');
	e.blocks.splice(chiefs, 0, S('The Ridge of Mount Yang', '양산 능선'));
	e.blocks.splice(
		chiefs + 2,
		0,
		D('jibekho', ['올해 모임은 우리 골짜기서 하자 캤제. 술은 누가 가왔노?'], ['We said this year’s meeting was at my valley. Who brought the wine?']),
		D('sobuldori', ['술 얘기 하러 왔나. 임금 얘기 하러 왔지.'], ['Did we come about wine? We came about a king.']),
		D('jibekho', ['임금 얘기는 작년에도 했다. 재작년에도 했고. 술은 그때도 없었다.'], ['We talked about a king last year. And the year before. There wasn’t any wine then either.']),
		D('alpyung', ['북쪽에 살던 우리 할배들은 임금이 있었다 카더라.', '있어서 망했다는 사람도 있고.'], ['Our grandfathers had a king up north, they say.', 'Some say that’s why it fell.']),
		D('sobuldori', ['그라믄 임금 없이 계속 이래 싸우자고?'], ['So we just keep arguing like this, with no king?']),
		D('jibekho', ['싸우는 게 아이고 모이는 기다. 술만 있으믄.'], ['It’s not arguing, it’s meeting. Given wine.']),
		P('Alpyung stops in the middle of a word. Five heads turn.', '알평이 말하다 말고 멈춘다. 다섯 고개가 돌아간다.')
	);

	const rice = idx(e, 'The six just came up out of the ground, like rice');
	e.blocks.splice(
		rice + 1,
		0,
		P(
			'Six hundred years on, one of their grandsons will pour tea for a room full of Kims and remind them of it. Nobody will thank him.',
			'육백 년 뒤, 그 손자 하나가 김씨들로 가득한 방에 차를 따르며 그 일을 일깨울 것이다. 고맙다는 사람은 없을 것이다.'
		),
		S('The Six Villages', '여섯 마을'),
		P(
			'The boy from the egg and the girl from the well grow up, and they turn out to be good at the job. Every spring the king and queen walk the six villages together. He takes his shoes off in the paddies. She checks the mulberry leaves for worms, and the village heads for lies.',
			'알에서 난 소년과 우물에서 난 소녀는 자라서, 일을 꽤 잘한다. 봄마다 왕과 왕비는 함께 여섯 마을을 걷는다. 그는 논에 들어가 신을 벗는다. 그녀는 뽕잎에 벌레가 없는지, 촌장들 얼굴에 거짓말이 없는지 살핀다.'
		),
		X('A farmer', 'm', ['전하, 발 빠집니더! 거기 거머리 천지입니더—'], ['Majesty, you’ll sink! That end’s all leeches—']),
		D('hyukgose', ['알고 있소. 그래서 들어온 거요.', '모가 다 기울었잖소.'], ['I know. That’s why I’m in it.', 'Your seedlings are all leaning.']),
		D('alyoung', ['이 집 뽕잎은 반이 벌레요. 작년에 누에 몇 섶 올렸소?'], ['Half the leaves on this tree have worms. How many trays of silkworms did you raise last year?']),
		X('A village head', 'm', ['그게… 넉넉히 올렸습니더, 마마.'], ['Oh… plenty, Your Highness.']),
		D('alyoung', ['넉넉히는 숫자가 아니오.'], ['Plenty isn’t a number.']),
		D('hyukgose', ['알영, 이 집 모는 반듯하오!'], ['Alyoung, this man’s rows are straight!']),
		D('alyoung', ['그 집 말고. 이 집 말이오.'], ['Not his. This one’s.']),
		P(
			'The villages start calling them the Two Saints, which is the kind of thing villages say when the tax is light. One night raiders come over the hills from the Han commandery in the north. They find the doors unbarred and the grain stacked loose in the fields. They go home. A land with no locks, they decide, must have something worse than locks.',
			'마을들은 두 사람을 두 성인이라 부르기 시작한다. 세금이 가벼울 때 마을들이 흔히 하는 소리다. 어느 밤 북쪽 한나라 군현에서 약탈꾼들이 고개를 넘어온다. 문은 빗장이 없고, 곡식은 들판에 그냥 쌓여 있다. 그들은 돌아간다. 자물쇠가 없는 땅이라면 자물쇠보다 더 무서운 게 있겠지, 하고.'
		),
		S('The Hall of Mahan', '마한의 궁'),
		P(
			'Not every neighbour is so easily embarrassed. To the west sits Mahan, a big old country that thinks of the southern valleys as its porch. When Surabol stops sending tribute, its king wants an explanation. Surabol sends a man from Wa with a gourd still tied at his belt. It is the kind of errand where you want someone who floats.',
			'모든 이웃이 그렇게 쉽게 머쓱해지지는 않는다. 서쪽에는 마한이 있다. 남쪽 골짜기들을 제 집 툇마루쯤으로 여기는, 크고 오래된 나라다. 서라벌이 공물을 끊자 마한 왕은 해명을 요구한다. 서라벌은 허리에 아직 박을 매단 왜 사람 하나를 보낸다. 물에 뜨는 사람이 필요한 심부름이다.'
		),
		X('The King of Mahan', 'm', ['진한도 변한도 내 울타리 안이다. 몇 해째 공물이 없어.', '큰 나라 섬기는 예법이 그 모양이냐?'], ['Jinhan and Byeonhan are inside my fence. Years now, and no tribute.', 'Is that how you serve a greater country?']),
		X('The envoy', 'm', ['저희 나라는 두 성인께서 일어나신 뒤로 하늘이 고르고 창고가 찼습니다.', '북에서 내려온 유민부터 변한, 낙랑, 왜 사람까지 저희를 어려워합니다.'], ['Since our Two Saints rose, the weather’s been fair and the granaries full.', 'Refugees from the north, Byeonhan, Lelang, my own people from Wa. They all mind their manners with us.']),
		X('The King of Mahan', 'm', ['그래서?'], ['So?']),
		X('The envoy', 'm', ['그런데도 저희 임금께서 굳이 저를 보내 인사를 여쭙게 하셨지요. 예법이 넘친 겁니다, 대왕.', '그런데 대왕께서는 칼부터—'], ['So my king sent me to pay his respects anyway. That’s more courtesy than he owes, Great King.', 'And the Great King reaches for a sword—']),
		P('He does reach for one. Two ministers grab his sleeves.', '왕은 정말로 칼에 손을 뻗는다. 신하 둘이 소매를 붙든다.'),
		X('A Mahan minister', 'm', ['대왕! 사신입니다, 사신!'], ['Great King! He’s an envoy!']),
		X('The King of Mahan', 'm', ['…저 박 단 놈을 내보내라.'], ['…Get the man with the gourd out of my hall.']),
		X('The envoy', 'm', ['나가는 길은 압니다. 물에 뜨는 법도 알고요.'], ['I know the way out. I also know how to float.']),
		P(
			'The next year the king of Mahan dies. In Surabol somebody suggests the obvious.',
			'이듬해 마한 왕이 죽는다. 서라벌에서 누군가 뻔한 소리를 한다.'
		),
		X('A minister', 'm', ['그 왕이 우리 사신을 욕보였습니다. 지금 상중이니 치면 하루거리입니다.'], ['That king insulted our envoy. They’re in mourning. We’d be done in a day.']),
		D('hyukgose', ['남의 초상을 틈타는 건 어진 일이 아니오.'], ['Using another man’s funeral isn’t kind.']),
		X('A minister', 'm', ['어진 거 말고, 이기는 거 말씀드린 겁니다.'], ['I wasn’t talking about kind, Majesty. I was talking about winning.']),
		P(
			'The king does not repeat himself. Alyoung pours the minister more wine, which in that house means the meeting is over.',
			'왕은 같은 말을 두 번 하지 않는다. 알영이 신하의 잔에 술을 더 따른다. 그 집에서 그건 회의가 끝났다는 뜻이다.'
		)
	);
	return 'ok';
}

function talhae(e) {
	if (!has(e, 'King Muyeol spends his first night')) return 'skip';
	const from = e.blocks.indexOf(one(e.blocks, 'The Moon Palace', (b) => b.kind === 'scene'));
	const to = idx(e, 'if a rooster crows, it’s a rooster');
	e.blocks.splice(
		from,
		to - from + 1,
		S('The First Night', '첫날 밤'),
		P(
			'His first night as king, Talhae lies awake in the house he stole. He keeps listening for someone digging by the gate.',
			'왕이 된 첫날 밤, 탈해는 훔친 집에서 뜬눈으로 누워 있다. 누가 대문 옆을 파는 소리가 나지 않나 자꾸 귀를 기울인다.'
		),
		D('talhae', ['대보. 자오?', '밖에 누가 땅 파는 소리 안 들리오?'], ['Grand Minister. Asleep?', 'You don’t hear anyone digging out there?']),
		D('hogong', ['아무도 안 팝니다, 폐하. 주무십시오.', '판다 해도 제가 파겠지요. 밤에. 누구한테 배웠는지는 아실 테고.'], ['Nobody’s digging, Majesty. Go to sleep.', 'And if anyone does, it’ll be me. At night. You know who taught me.']),
		D('talhae', ['하.', '…잘 자오, 대보.'], ['Ha.', '…Good night, Grand Minister.']),
		P(
			'He sleeps, eventually. Kings do. Eight springs later, something in the woods will wake him.',
			'결국 그는 잠든다. 왕들도 잠은 잔다. 여덟 해 뒤 봄, 숲에서 무언가가 그를 깨울 것이다.'
		)
	);
	return 'ok';
}

function alji(e) {
	if (!has(e, 'After dark the new king walks his son through it')) return 'skip';
	const from = e.blocks.indexOf(one(e.blocks, 'Gyerim', (b) => b.kind === 'scene' && b.label === 'Gyerim'));
	const to = idx(e, 'Starting with the one that keeps knocking');
	e.blocks.splice(from, to - from + 1);
	const bones = one(e.blocks, 'Here is the trouble with a country that counts bones');
	bones.html =
		'Here is the trouble with a country that counts bones. Every house that ever wore this crown arrived in something: an egg, a chest, a box. The people who were here first need something to count. And the more carefully you count, the fewer you have. Every few generations a royal house runs short of sons who count, and the crown has to come from the floor instead. So no king of Silla can lean on the egg. He leans on the room.';
	bones.ko =
		'뼈를 세는 나라의 골치는 이렇다. 이 왕관을 쓴 집안은 모두 무언가를 타고 왔다. 알, 궤짝, 상자. 먼저 와 있던 사람들에게는 셀 것이 있어야 한다. 그런데 꼼꼼히 셀수록 남는 게 적다. 몇 대에 한 번씩 왕가는 셈에 드는 아들이 모자라고, 그러면 왕관은 마루에서 나와야 한다. 그래서 신라의 어느 임금도 알에 기댈 수 없다. 그는 방에 기댄다.';
	return 'ok';
}

const JOLBON_ANCHORS = {
	'Hip first on the beam': 'hip first on the beam',
	'Don’t talk in the ditch': 'She starts calling him names because',
	'예쁘… 그냥. Pretty.': 'Pretty. Just—',
	'I am the son': 'I crossed a river on turtles'
};

function jolbonAnchors(e) {
	let n = 0;
	for (const im of e.images ?? [])
		if (JOLBON_ANCHORS[im.at]) {
			im.at = JOLBON_ANCHORS[im.at];
			n++;
		}
	return n ? 'ok' : 'skip';
}

const plan = {
	'Jinheung, the Cloud': jinheung,
	Jolbon: (e) => [jolbon(e), jolbonAnchors(e)].includes('ok') ? 'ok' : 'skip',
	Hyukgose: hyukgose,
	Talhae: talhae,
	Alji: alji
};

editStory((story) => {
	const out = [];
	for (const c of story)
		for (const e of c.entries) {
			const fn = plan[e.title];
			if (fn) out.push(`${e.title}: ${fn(e)}`);
		}
	console.log(out.join('\n'));
	return out.some((l) => l.endsWith('ok')) ? undefined : false;
});
