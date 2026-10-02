// Inserts the seven animal scenes: Chunma (Hyukgosé), Sinrok (Onjo), Samjogo (Jumong), Hadong (Chunchu),
// Gomanari (Gyebek), Bisamun (Bidam) and the Nangbi flashback where Hangyul gets his name (Kim Yushin).
// Anchors are text, not indices; reruns are refused.
// Usage: node scripts/.cache/insert-animal-scenes.mjs
import { openStory, p, quote, flashback, voice, insertAfter, insertBefore, guard } from './story-edit.mjs';

const { entry, say, save } = openStory();

/* ── Hyukgosé: Chunma ───────────────────────────────────────────────── */

const hyuk = entry('Hyukgosé');
guard(hyuk, 'like lightning that had forgotten to leave');

insertAfter(hyuk, 'they named him Hyeokgeose', [
	p(
		'The chroniclers disagree about the colour of the egg and agree about the horse. Before anyone dug, the six chiefs saw it from the ridge of Mount Yang: a light hanging down beside Najeong like lightning that had forgotten to leave, and under it a white horse folded onto its knees, as if someone important were waiting in the grass.',
		'알의 빛깔을 두고는 사서들이 다투지만, 말에 대해서는 다투지 않는다. 땅을 파기도 전에 여섯 촌장은 양산 능선에서 그것을 보았다. 나정 곁으로 떠나기를 잊은 번개처럼 빛이 드리워 있고, 그 아래 흰 말 한 마리가, 풀숲에 귀한 이라도 기다리는 듯 무릎을 꿇고 있었다.'
	),
	say('alpyung', ['저거… 말이지?', '말이 왜 무릎을 꿇어. 누구한테.'], ['That’s… a horse, right?', 'Why’s a horse kneeling? Who to?']),
	say('sobuldori', ['날개 달린 말 본 적 있어? 난 없어.', '……근데 저건 날개가 있잖아.'], ['You ever seen a horse with wings? I haven’t.', '…That one’s got wings, though.']),
	say('alpyung', ['천천히. 천천히 가. 놀라면—'], ['Slow. Go slow. If it spooks—']),
	p(
		'It does not spook. It lets them come close enough to see that its wings are folded the way a bird folds them and that its eyes are on the grass, not on them. Then it looks up and sees six grown men creeping at it through the pines with their sleeves held out like nets.',
		'말은 놀라지 않는다. 새가 날개를 접듯 날개를 접고 있다는 것, 눈이 그들이 아니라 풀숲에 가 있다는 것이 보일 만큼 가까이 오게 둔다. 그러다 고개를 들고, 다 큰 사내 여섯이 그물처럼 소매를 벌린 채 소나무 사이로 기어 오는 것을 본다.'
	),
	quote(
		'Below Mount Yang, beside Najeong well, a strange vapour like a flash of lightning hung down to the ground, and there was a white horse kneeling as if in obeisance. They went to look and found a purple egg (one account says a great blue egg). The horse saw the men, gave a long neigh, and rose up to heaven.',
		'양산 아래 나정 곁에 번개 같은 이상한 기운이 땅에 드리웠고, 흰 말 한 마리가 절하듯 꿇어앉아 있었다. 찾아가 살펴보니 자줏빛 알 하나가 있었다(푸른 큰 알이라고도 한다). 말은 사람을 보자 길게 울고 하늘로 올라갔다.',
		'楊山下蘿井傍 異氣如電光垂地 有一白馬跪拜之狀 尋撿之 有一紫卵(一云靑大卵) 馬見人長嘶上天',
		'Samguk Yusa (三國遺事) bk. 1, Wonders 1 — Silla Founder Hyeokgeose (新羅始祖 赫居世王)'
	),
	p(
		'Six chiefs stand in a wet field with their arms still out, holding nothing. Much later, when the country has a name and a calendar and a clerk for everything, the horse will be painted on a saddle-flap and buried with a king and called <b>Chunma</b>, the heavenly horse. That morning nobody calls it anything. Alpyung is the first to look down at what it was kneeling over.',
		'여섯 촌장이 젖은 들판에 팔을 벌린 채, 아무것도 쥐지 못하고 서 있다. 한참 뒤, 나라에 이름과 달력과 무엇에나 서기가 생긴 뒤, 그 말은 말다래에 그려져 어느 왕과 함께 묻히고 <b>천마</b>라 불릴 것이다. 그날 아침엔 아무도 그것을 무어라 부르지 않는다. 발밑, 말이 꿇어앉아 있던 자리를 처음 내려다본 것은 알평이다.'
	),
	say('alpyung', ['……두고 갔네.', '파 봐. 다들 뭐 해, 파 보라니까.'], ['…It left something.', 'Dig. What are you all doing? Dig.'])
]);

insertAfter(hyuk, 'and that is enough.', [
	p(
		'Sixty-one years later, the chronicle says, the king went up into the sky, and seven days after that his body came down again in five pieces, scattered over the ground. Nobody records a horse. Everybody in Seorabeol says there was one.',
		'예순한 해 뒤, 편년은 말한다. 왕이 하늘로 올라갔고, 이레 뒤 그 몸이 다섯 조각으로 땅에 흩어져 내려왔다고. 말이 있었다고 적은 사람은 없다. 서라벌 사람들은 모두 있었다고 말한다.'
	),
	quote(
		'He ruled the country sixty-one years, and the king rose up to heaven. Seven days later his remains fell scattered to the ground… The people wished to bury them together, but a great serpent chased them off; so they buried the five parts separately and made the Five Tombs, also called the Serpent Tombs.',
		'나라를 다스린 지 예순한 해에 왕이 하늘로 올라갔다. 이레 뒤 유체가 땅에 흩어져 떨어졌다… 나라 사람들이 합쳐 장사 지내려 하자 큰 뱀이 쫓아 막으므로, 다섯 몸을 따로 묻어 오릉으로 삼았다. 사릉이라고도 한다.',
		'理國六十一年 王升于天 七日後 遺體散落于地 … 國人欲合而葬之 有大蛇逐禁 各葬五體爲五陵 亦名蛇陵',
		'Samguk Yusa (三國遺事) bk. 1, Wonders 1 — Silla Founder Hyeokgeose (新羅始祖 赫居世王)'
	)
]);

/* ── Onjo: Sinrok ───────────────────────────────────────────────────── */

const onjo = entry('Onjo');
guard(onjo, 'Meat with antlers.');

insertAfter(onjo, 'the door that let you in', [
	p(
		'It happens like this. Three days south of the river, on a ridge path too narrow for the cart, a stag is standing in the way. Pale as mulberry paper, gold wherever the light touches it, antlers branching like a winter tree somebody decided to keep. It does not run. It looks at the three of them as if it had been told to expect three.',
		'일은 이렇게 된다. 강을 건너 남으로 사흘, 수레가 지나기엔 좁은 능선 길에 수사슴 한 마리가 길을 막고 서 있다. 닥종이처럼 희고, 빛이 닿는 데마다 금빛이고, 뿔은 누가 베지 않기로 한 겨울나무처럼 갈라져 있다. 달아나지 않는다. 셋이 올 거라고 미리 들은 것처럼 세 사람을 쳐다본다.'
	),
	say('biryu', ['움직이지 마.', '열 신하 저녁거리다. 저 뿔만 해도 한 달은—'], ['Don’t move.', 'That’s dinner for ten ministers. The antlers alone, a month of—']),
	say('onjo', ['형. 형, 잠깐.', '……저게 저녁으로 보여? 진짜로?'], ['Hyung. Hyung, wait.', '…That look like dinner to you? Really?']),
	say('biryu', ['뿔로 보이지. 뿔 달린 고기.'], ['Looks like antlers to me. Meat with antlers.']),
	say('sosuno', ['비류. 내려.', '……엄마 말 들어. 활 내려.'], ['Biryu. Lower it.', '…Listen to your mother. Bow down.']),
	p(
		'Biryu lowers the bow the way an elder son does, slowly enough that everyone understands it was his own idea. The stag turns, walks ten paces up the ridge, and stops to look back. When they do not follow, it waits. When they do, it walks on. It keeps that up for nine days.',
		'비류는 맏아들답게 활을 내린다. 제 생각이었다는 걸 모두가 알아볼 만큼 천천히. 사슴은 돌아서서 능선을 열 걸음 오르더니 멈춰 서서 돌아본다. 따라가지 않으면 기다린다. 따라가면 다시 걷는다. 그렇게 아흐레를 간다.'
	),
	say('onjo', ['따라오라는 거지?', '……사슴이 길을 알아, 엄마?'], ['It wants us to follow, right?', '…A deer knows the way, Mother?']),
	say('sosuno', ['너희 아버지는 거북이 등 밟고 강 건넜어.', '사슴이면 양반이지.'], ['Your father crossed a river on turtles’ backs.', 'A deer’s practically civilised.']),
	p(
		'On the ninth day it takes them up Mount Buak, and from the top the brothers see all of it: a river looped across the plain like a belt somebody has unbuckled, high peaks at their backs, wet green flats to the south and, somewhere past the haze, the sea. Biryu smells the salt before he sees it.',
		'아흐레째 사슴은 그들을 부아악 위로 데려가고, 꼭대기에서 형제는 그 모두를 본다. 누가 풀어 놓은 허리띠처럼 들판을 감아 도는 강, 등 뒤의 높은 봉우리들, 남쪽의 젖은 푸른 벌, 그리고 안개 너머 어딘가의 바다. 비류는 바다를 보기도 전에 소금 냄새부터 맡는다.'
	),
	quote(
		'At length they reached Hansan and climbed Mount Buak to look for land fit to live on. Biryu wished to live by the sea. The ten ministers remonstrated: “This land south of the river is belted by the Han to the north, held by high mountains to the east, looks out on fertile marshes to the south, and is barred by the great sea to the west. Such natural defences and advantages of ground are hard to come by. Would it not be fitting to make the capital here?” Biryu would not listen; he divided the people and went to Michuhol to live.',
		'드디어 한산에 이르러 부아악에 올라 살 만한 땅을 바라보았다. 비류는 바닷가에 살고자 하였다. 열 신하가 간하였다. “오직 이 하남의 땅은 북으로 한수를 띠고, 동으로 높은 산에 의지하며, 남으로 기름진 못을 바라보고, 서로 큰 바다에 막혀 있습니다. 하늘이 내린 험함과 땅의 이로움은 얻기 어려운 형세이니, 여기에 도읍하는 것이 마땅하지 않겠습니까.” 비류는 듣지 않고 그 백성을 나누어 미추홀로 돌아가 살았다.',
		'遂至漢山 登負兒嶽 望可居之地 沸流欲居於海濱 十臣諫曰 惟此河南之地 北帶漢水 東據高岳 南望沃澤 西阻大海 其天險地利 難得之勢 作都於斯 不亦宜乎 沸流不聽 分其民 歸彌鄒忽以居之',
		'Samguk Sagi (三國史記) bk. 23, Baekje Annals — King Onjo, founding; Lee Byong-do ed., vol. 1'
	),
	say('biryu', ['바다 냄새 나지. 나 저기로 간다.', '강 끼고 산 등지고, 다 좋아. 근데 배를 못 띄우잖아.'], ['Smell that? Sea. I’m going there.', 'River in front, mountains behind, sure, lovely. You can’t float a ship on it.']),
	say('onjo', ['형, 열 사람이 다 여기라잖아.', '……열 사람이 다 틀릴 수도 있긴 한데, 열 사람이 다—'], ['Hyung, all ten of them say here.', '…I mean, ten people can all be wrong, but all ten—']),
	say('biryu', ['그럼 열 사람은 여기 살라 그래.', '엄마는? 엄마는 누구 따라와?'], ['Then the ten can live here.', 'And Mother? Who’s Mother coming with?']),
	say('sosuno', ['……그런 거 물어보지 마.'], ['…Don’t ask me that.']),
	p(
		'Nobody answers him. The stag, which has stood a little apart all morning, crosses the summit and lies down in the grass at Onjo’s feet, facing the river. Biryu laughs too loudly and says the deer has no taste, and takes his half of the people down to Michuhol and the salt flats. The stag stays. Baekje will call it <b>Sinrok</b>, the guardian deer, for as long as Baekje has anything to call.',
		'아무도 대답하지 않는다. 아침 내내 조금 떨어져 서 있던 사슴이 꼭대기를 가로질러 와서, 강을 바라보며 온조의 발치 풀밭에 엎드린다. 비류는 너무 크게 웃으며 사슴이 보는 눈이 없다고 하고, 제 몫의 백성을 이끌고 미추홀의 소금벌로 내려간다. 사슴은 남는다. 백제는 그것을 <b>신록</b>, 나라를 지키는 사슴이라 부를 것이다. 백제가 무언가를 부를 수 있는 동안은.'
	)
]);

/* ── Jumong: Samjogo ────────────────────────────────────────────────── */

const jumong = entry('Jumong');
guard(jumong, 'He is too frightened to count its legs.');

insertAfter(jumong, 'He runs until the pines smear', [
	p(
		'Something keeps pace with him above the trees, black on black, going from branch to branch without seeming to hurry. A crow. He is too frightened to count its legs.',
		'나무 위로 무언가가 그와 나란히 간다. 검은 위의 검은 것, 서두르는 기색도 없이 가지에서 가지로. 까마귀다. 다리를 셀 정신이 그에게는 없다.'
	)
]);

insertAfter(jumong, 'Will is the fourth leg', [
	p(
		'It is sitting on a rock on the far bank when he comes off the last shell, soaked, laughing like an idiot because he is alive. This time he counts.',
		'마지막 등껍질에서 내려섰을 때 그것은 건너편 강가 바위에 앉아 있다. 그는 흠뻑 젖어서, 살아 있다는 게 우스워 바보처럼 웃고 있다. 이번에는 센다.'
	),
	say('jumong', ['……하나, 둘.', '셋?', '야. 너 다리가 왜 셋이야.'], ['…One, two.', 'Three?', 'Hey. Why’ve you got three legs?']),
	p(
		'The crow looks at him without blinking, which is either rude or holy, then drops off the rock, flies ten paces into the pines, lands again, and looks back.',
		'까마귀는 눈도 깜박이지 않고 그를 본다. 무례하거나 신령하거나 둘 중 하나다. 그러고는 바위에서 내려앉아 소나무 숲으로 열 걸음 날아가 다시 앉고, 돌아본다.'
	),
	say(
		'jumong',
		['따라오라고?', '……너 나 곰한테 데려가면 진짜 구워 먹는다.', '다리 셋이면 하나는 남겠네.'],
		['Follow you?', '…If you’re leading me to a bear, I swear I’m roasting you.', 'Three legs. There’d be one to spare.']
	),
	p(
		'He follows it all afternoon, uphill, through pines that stop being Buyeo’s and start being nobody’s. It keeps ten paces ahead and never once lets him catch up. At dusk it lands on a stone lip above a dark opening in the hill and stays there, folded, like a doorman whose shift is over.',
		'그는 오후 내내 그것을 따라 오르막을, 부여의 것이기를 그만두고 누구의 것도 아니게 된 소나무 숲을 간다. 까마귀는 늘 열 걸음 앞에 있고 한 번도 따라잡히지 않는다. 해 질 녘 그것은 산허리에 난 어두운 입구 위 돌턱에 내려앉아, 날개를 접고 그대로 있다. 교대를 마친 문지기처럼.'
	),
	say('jumong', ['……여기?', '고마워. 진짜로.', '이제 못 구워 먹겠다, 너는.'], ['…Here?', 'Thanks. Really.', 'Can’t roast you now, can I.'])
]);

/* ── Chunchu & Gesomun: Hadong ──────────────────────────────────────── */

const prison = entry('Chunchu & Gesomun');
guard(prison, 'Hadong');

insertAfter(prison, 'I will return within sixty days', [
	p(
		'He leaves by the west gate of Wolseong on <b>Hadong</b>, a lean red bay he named for summer and winter, because a diplomat’s horse, he says, has to stand in both. Yushin walks beside the bridle as far as the gate and no farther, which for Yushin is a speech.',
		'그는 <b>하동</b>을 타고 월성 서문으로 떠난다. 여름과 겨울에서 이름을 딴 마른 적갈색 말. 사신의 말은 둘 다 견뎌야 한다고, 그는 말한다. 유신은 굴레 옆을 걸어 문까지만 따라오고 그 이상은 오지 않는다. 유신에게 그건 연설이다.'
	),
	say('yushin', ['예순 날.', '얘는 길 알아. 네가 까먹어도.'], ['Sixty days.', 'He knows the way back. Even if you forget.']),
	say('chunchu', ['나보다 똑똑하다는 거지.', '……하동아, 들었지? 유신이가 너 믿는대.'], ['You’re saying he’s smarter than me.', '…Hear that, Hadong? Yushin trusts you.']),
	say('yushin', ['널 못 믿는 거야.'], ['It’s you I don’t trust.'])
]);

insertAfter(prison, 'a more fearsome man than I expected', [
	p(
		'On the Silla side of the border, in a camp that should not exist, Yushin has brought the horse. Hadong is tied at the front of the lines with an empty saddle, the way some armies carry an empty chair. When Chunchu comes down the last hill on foot, thinner, the left hand bound against his chest, the horse sees him before the men do.',
		'국경 이쪽, 있어서는 안 될 진영에 유신은 그 말을 데려와 있다. 하동은 빈 안장을 얹은 채 대열 맨 앞에 매여 있다. 어떤 군대가 빈 의자를 메고 다니듯이. 춘추가 마지막 언덕을 걸어 내려올 때, 더 마르고, 왼손을 가슴에 동여맨 채, 사람들보다 말이 먼저 그를 알아본다.'
	),
	say('chunchu', ['……하동아.', '너 살쪘다. 유신이가 나보다 잘 먹였네.'], ['…Hadong.', 'You got fat. Yushin fed you better than they fed me.']),
	say('yushin', ['손.', '……이리 줘. 오른손.'], ['Hand.', '…Give it here. The right one.']),
	p(
		'Chunchu cannot close the left hand on a rein, so Yushin ties both reins around his right wrist himself, in a knot he learned in the drill yard for men who have been shot. He says nothing about the hand, and Chunchu says nothing about the camp.',
		'춘추는 왼손으로 고삐를 쥘 수 없다. 그래서 유신이 두 고삐를 그의 오른 손목에 직접 묶는다. 화살 맞은 사람을 위해 연병장에서 배운 매듭으로. 그는 손에 대해 아무 말도 하지 않고, 춘추도 진영에 대해 아무 말도 하지 않는다.'
	)
]);

/* ── Gyebek: Gomanari ───────────────────────────────────────────────── */

const loyal = entry('The Three Loyalists');
guard(loyal, 'Gomanari');

insertAfter(loyal, 'the histories record it in one line', [
	p(
		'He comes out of the house before the light is properly up. The yard is swept. Nothing in it belongs to him any more except a black horse at the post, <b>Gomanari</b>, named for the old bear ferry at Ungjin where he learned to ride: the one thing he owns that the Tang cannot sell in a slave market.',
		'그는 날이 채 밝기 전에 집에서 나온다. 마당은 쓸려 있다. 이제 그 안에 그의 것이라곤 말뚝에 매인 검은 말 하나, <b>고마나리</b>뿐이다. 그가 말 타기를 배운 웅진의 옛 곰나루에서 따온 이름. 당나라가 노예 시장에 내다 팔 수 없는, 그가 가진 단 하나.'
	),
	p(
		'The groom, a boy from the next village who did not sleep in the house and is therefore alive, holds the bridle out at arm’s length and will not look at him.',
		'마부는 옆 마을 아이다. 그 집에서 자지 않았고, 그래서 살아 있다. 아이는 팔을 한껏 뻗어 굴레를 내밀 뿐 그를 쳐다보지 못한다.'
	),
	voice(['자, 장군님.', '……고마나리도요?'], ['H-here, General.', '…Gomanari too?']),
	say('gyebek', ['말은 종이 안 돼.', '말은 그냥 말이야.'], ['A horse can’t be made a slave.', 'A horse is just a horse.']),
	p(
		'He saddles it himself, counting the buckles under his breath, and when he is done he stands with his forehead against the black neck for exactly as long as it takes to count to ten. Then he mounts and does not look at the house.',
		'그는 손수 안장을 얹는다. 버클을 입속으로 세면서. 다 얹고 나서는 검은 목덜미에 이마를 대고, 꼭 열을 셀 만큼만 서 있는다. 그러고는 말에 오르고, 집 쪽은 돌아보지 않는다.'
	)
]);

const field = entry('Yellow Mountain Fields');
guard(field, 'Nobody can lead the black horse');

insertAfter(field, 'The White River, downstream, opens.', [
	p(
		'Nobody can lead the black horse off the field. It stands over the place where he went down until the Silla grooms come at dusk with ropes, and it takes six of them, and in the night it breaks the line and goes south toward the ferry it was named for. Nobody on either side ever reports seeing it again.',
		'아무도 그 검은 말을 들판에서 끌어내지 못한다. 말은 그가 쓰러진 자리를 지키고 서 있다가, 해 질 녘 신라 마부들이 밧줄을 들고 오자 여섯이 달라붙어야 하고, 밤이 되자 줄을 끊고 제 이름이 된 나루 쪽, 남으로 간다. 어느 편에서도 그 말을 다시 보았다는 보고는 없다.'
	)
]);

/* ── Bidam’s Rebellion: Bisamun ─────────────────────────────────────── */

const rebellion = entry('Bidam’s Rebellion');
guard(rebellion, 'knots them to the bridle');

insertAfter(rebellion, 'DAY 10', [
	p(
		'Before the gate opens Bidam goes down to the lines and saddles <b>Bisamun</b> himself, which a Sangdaedeung does not do. He slips nine beads off the end of his string and knots them to the bridle, under the horse’s jaw.',
		'성문이 열리기 전 비담은 진영으로 내려가 <b>비사문</b>에 손수 안장을 얹는다. 상대등이 할 일은 아니다. 염주 끝에서 아홉 알을 빼내, 말 턱 아래 굴레에 매듭지어 묶는다.'
	),
	voice(['상대등, 그건…'], ['Sangdaedeung, those are…']),
	say(
		'bidam',
		['원광 스님 다섯째 계율. 살생유택.', '부리는 짐승은 죽이지 마라. 말, 소, 닭, 개.', '……저쪽은 그저께 흰 말을 태웠지. 내가 지더라도 이 녀석은 누가 붙잡고 있어야 해.'],
		['Master Wongwang’s fifth precept. Be choosy about killing.', 'Never the animals that work for you. Horse, ox, chicken, dog.', '…They burned a white horse over there the other day. Even if I lose, somebody should still be holding on to this one.']
	),
	p(
		'Bisamun is named for the guardian king who stands at the north of every temple with a pagoda in his hand. Bidam rubs the horse’s nose once and speaks to it in the voice he keeps for sutras.',
		'비사문은 탑을 손에 들고 모든 절의 북쪽에 서 있는 천왕에게서 따온 이름이다. 비담은 말의 코를 한 번 쓰다듬고, 경을 욀 때의 목소리로 말한다.'
	),
	say('bidam', ['북쪽 지키는 분 이름이야.', '오늘은 서쪽만 봐.'], ['You’re named for the one who guards the north.', 'Today just watch the west.'])
]);

insertAfter(rebellion, 'the ledger catching up to the last word', [
	p(
		'Bisamun comes through the lines without a rider, at a walk, and stops over him. Nine beads swing under its jaw. When a Silla groom reaches for the bridle it lays its ears flat and shows him its teeth, and the groom, who has had a long ten days, steps back.',
		'비사문이 주인 없이, 걸어서 대열을 지나와 그의 곁에 멈춰 선다. 턱 아래 아홉 알이 흔들린다. 신라 마부가 굴레에 손을 뻗자 말은 귀를 납작 젖히고 이를 드러내고, 열흘이 길었던 마부는 물러선다.'
	),
	say('yushin', ['놔둬.', '……풀어 줘. 북쪽으로.'], ['Leave it.', '…Let it go. North.']),
	p(
		'Nobody asks him why north. The horse stands there until the body is taken, then turns and goes, past the Radiance wall and up the valley road, and afterwards the officers on the rampart cannot agree whether anyone opened the gate for it.',
		'왜 북쪽이냐고 묻는 사람은 없다. 말은 시신이 옮겨질 때까지 서 있다가, 돌아서서 명활성 성벽을 지나 골짜기 길로 올라간다. 나중에 성벽 위의 장교들은 누가 그 말에게 문을 열어 주었는지를 두고 끝내 의견이 갈린다.'
	)
]);

/* ── Kim Yushin: Nangbi (Hangyul’s name) ────────────────────────────── */

const yushinEntry = entry('Kim Yushin');
guard(yushinEntry, 'Let me be the collar.');

insertBefore(yushinEntry, 'Kim Yushin!!', [
	flashback(629, 'Nangbi', [
		p(
			'Autumn, the forty-sixth year of King Jinpyeong. Silla’s army is breaking against the walls of Nangbi Fortress, and the men who are supposed to be charging are sitting down in the trenches instead. Yushin is thirty-four, a banner captain, on a white horse nobody in the army has bothered to name.',
			'진평왕 마흔여섯 해 가을. 신라군은 낭비성 성벽에 부딪혀 부서지고 있고, 돌격해야 할 병사들은 참호에 주저앉아 있다. 유신은 서른넷, 중당의 당주, 군에서 아무도 이름을 붙여 줄 생각을 하지 않은 흰 말을 타고 있다.'
		),
		p(
			'He rides back to his father’s command post, gets down, and takes off his helmet, which is how a son asks permission in front of an army.',
			'그는 아버지의 지휘소로 말을 몰아 돌아와 내리고, 투구를 벗는다. 군대 앞에서 아들이 허락을 구하는 방식이다.'
		),
		say(
			'yushin',
			['아버님. 저희가 지고 있습니다.', '옷깃을 쥐고 떨쳐야 갖옷이 바로 서고, 벼리를 들어야 그물이 펴진다고 했습니다.', '……제가 그 깃이 되겠습니다.'],
			['Father. We’re losing.', 'They say you shake a coat by the collar to make it hang straight, and lift the head-rope to open a net.', '…Let me be the collar.']
		),
		say('seohyeon', ['……투구 써라.', '그리고 가.'], ['…Put your helmet on.', 'Then go.']),
		quote(
			'“I have heard that when you shake the collar the coat hangs straight, and when you lift the head-rope the net opens. Let me be that rope and that collar.” Then he mounted his horse, drew his sword, leapt the trench, and went in and out of the enemy lines; he cut down their general and came back carrying his head.',
			'“듣건대 옷깃을 떨치면 갖옷이 바르게 되고 벼리를 들면 그물이 펴진다 하니, 제가 그 벼리와 옷깃이 되겠습니다.” 이에 말에 올라 칼을 빼어 들고 참호를 뛰어넘어 적진을 드나들며 장군을 베고 그 머리를 들고 돌아왔다.',
			'蓋聞振領而裘正 提綱而網張 吾其爲綱領乎 迺跨馬拔劍 跳坑 出入賊陣 斬將軍 提其首而來',
			'Samguk Sagi (三國史記) bk. 41, Biographies — Kim Yushin; Lee Byong-do ed., vol. 2 (Nangbi Fortress, 629)'
		),
		p(
			'The white horse takes the trench in one jump that the men in it will describe for the rest of their lives, usually with their hands. In, out. In again. The third time Yushin comes back there is something heavy hanging from his saddle, and the men in the trench are already climbing out.',
			'흰 말은 단번에 참호를 뛰어넘는다. 그 안에 있던 병사들이 평생, 대개는 손짓까지 해 가며 이야기하게 될 도약이다. 들어갔다, 나왔다. 다시 들어간다. 세 번째로 유신이 돌아올 때 안장에는 묵직한 것이 매달려 있고, 참호의 병사들은 벌써 기어 나오고 있다.'
		),
		p(
			'That night he asks the groom what the white horse is called. The groom says it has no name; it came from the royal stable as a spare. Yushin looks at it for a long time, at the mud on its chest and the way it still will not quite stand still.',
			'그날 밤 그는 마부에게 흰 말의 이름을 묻는다. 이름은 없다고, 왕실 마구간에서 여벌로 온 말이라고 마부가 답한다. 유신은 오래도록 말을 바라본다. 가슴팍의 진흙을, 아직도 가만히 서 있지 못하는 모양을.'
		),
		say('yushin', ['한결.', '……한결같이 돌아왔으니까. 세 번 다.'], ['Hangyul.', '…It means steady. It came back steady. All three times.'])
	])
]);

save();
console.log('inserted: Chunma, Sinrok, Samjogo, Hadong, Gomanari, Bisamun, Nangbi');
