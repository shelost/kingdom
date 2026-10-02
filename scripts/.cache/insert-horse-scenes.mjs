// Inserts the horse scenes (Jumong's thin horse, Chunchu's rabbit fable, Yushin's Hangyul)
// and the Goguryeo royal-epithet fix. Anchors are text, not indices; reruns are refused.
// Usage: node scripts/.cache/insert-horse-scenes.mjs
import { openStory, p, quote, indexOf, insertAfter, guard } from './story-edit.mjs';

const { entry, say, save } = openStory();

/* ── Jumong: the thin horse ─────────────────────────────────────────── */

const jumong = entry('Jumong');
guard(jumong, 'Put it in his tongue.');

insertAfter(jumong, 'splits a smaller country and names it for himself', [
	p(
		'<b>Geumwa</b> answers his heir the way tired kings answer. He refuses the knife and gives the foundling a chore instead: Jumong is sent to the royal stables, which in Buyeo is where a hall keeps a prince it would rather not see at dinner.',
		'<b>금와</b>는 지친 왕들이 답하는 식으로 맏아들에게 답한다. 칼은 거절하고, 주워 온 아이에게는 일거리를 준다. 주몽은 왕의 마구간으로 보내진다. 부여에서 마구간은, 저녁상에서 마주치고 싶지 않은 왕자를 두는 곳이다.'
	),
	quote(
		'The king did not listen, and set him to tending the horses. Jumong knew which ones were swift; he cut their feed and made them lean, and fed the sluggish ones well and made them fat. The king rode the fat ones himself and gave the lean one to Jumong.',
		'왕은 듣지 않고 그에게 말을 기르게 하였다. 주몽은 날랜 말을 알아보고 먹이를 줄여 여위게 하고, 둔한 말은 잘 먹여 살찌게 하였다. 왕은 살찐 말을 자기가 타고, 여윈 말을 주몽에게 주었다.',
		'王不聽 使之養馬 朱蒙知其駿者 而減食令瘦 駑者善養令肥 王以肥者自乘 瘦者給朱蒙',
		'Samguk Sagi (三國史記) bk. 13, Goguryeo Annals — Jumong; Lee Byong-do ed., vol. 1'
	),
	p(
		'<b>Yuhwa</b> comes to the stable after the lamps are out, a river-daughter in a frog-king’s straw, and finds her son brushing the best horse in Buyeo as if he could apologise to it in advance.',
		'등잔이 꺼진 뒤 <b>유화</b>가 마구간에 온다. 개구리 왕의 짚더미에 선 강의 딸. 아들은 부여에서 제일 좋은 말을 빗질하고 있다. 미리 사과라도 해 두려는 듯이.'
	),
	say('yuhwa', ['이 녀석이지?', '제일 빠른 애.'], ['This one, isn’t it?', 'The fast one.']),
	say('jumong', ['……어떻게 알았어요.', '아무한테도 말 안 했는데.'], ['…How’d you know?', 'I didn’t tell anyone.']),
	say(
		'yuhwa',
		['너 이 녀석만 빗질을 오래 하잖아.', '바늘 줄게. 혀에 꽂아.', '나중에 미안하다 하고, 배 터지게 먹이고.'],
		['You brush this one longer than the others.', 'I’ll give you a needle. Put it in his tongue.', 'Say sorry later, and feed him till he bursts.']
	),
	say('jumong', ['엄마, 무서운 사람이었네.', '……며칠이나요?'], ['Mother, you’re terrifying.', '…For how many days?']),
	say('yuhwa', ['대소가 칼을 다 갈 때까지.'], ['Until Daeso’s done sharpening.']),
	p(
		'By the next moon the fastest horse in the yard looks like a rack of kindling with a mane, and the slow ones shine like lacquer. Geumwa walks the stalls, picks the fattest for himself, and tosses the thin one to the foundling with a joke about how well they match. Daeso laughs loudest, which is a pity, because he is the one man in Buyeo who should have looked twice.',
		'다음 달이 되자 마구간에서 제일 빠른 말은 갈기 달린 장작더미가 되어 있고, 느린 말들은 옻칠한 듯 번들거린다. 금와는 마구간을 돌며 제일 살찐 말을 자기 몫으로 고르고, 여윈 말은 주워 온 아이에게 던져 준다. 둘이 참 닮았다는 농담과 함께. 대소가 제일 크게 웃는다. 안됐다. 부여에서 두 번 쳐다봤어야 할 사람은 그 하나뿐이었는데.'
	),
	say('geumwa', ['너랑 잘 어울린다.', '둘 다 내 밥을 먹고도 마르는구나.'], ['Suits you.', 'You both eat my rice and still stay thin.']),
	say('jumong', ['감사합니다, 폐하.', '잘 키울게요.'], ['Thank you, Majesty.', 'I’ll take good care of him.']),
	p('He pulls the needle out that night. The horse eats until dawn.', '그날 밤 그는 바늘을 뽑는다. 말은 새벽까지 먹는다.')
]);

const flight = jumong.blocks[indexOf(jumong, 'a red silk and three earth-tones, no horses')];
flight.html =
	'Before the river, the four go south, a red silk and three earth-tones and one horse between them, the one Geumwa thought was thin. The palisade is already behind them.';
flight.ko = '강 전에 넷이 남으로 간다. 붉은 비단과 흙빛 셋, 그 사이에 말 한 마리. 금와가 여위었다고 여긴 그 말이다. 목책은 이미 뒤.';

insertAfter(jumong, 'Find us when you still have a bow.', [
	say('jumong', ['얘 데려가.', '능선 길은 너희가 더 멀어. 강은 내가 혼자 건널게.'], ['Take him.', 'Your road over the ridge is longer. I’ll do the river alone.']),
	say('oi', ['미쳤어? 네 말이잖아.'], ['Are you crazy? He’s your horse.']),
	say('jumong', ['그러니까. 나 대신 살찌워 놔.', '……찾으러 갈게.'], ['Exactly. Fatten him up for me.', '…I’ll come find you.'])
]);

/* ── Chunchu & Gesomun: the turtle and the rabbit ───────────────────── */

const prison = entry('Chunchu & Gesomun');
guard(prison, 'the turtle and the rabbit');

const vow = prison.blocks[indexOf(prison, 'my horse will trample Goryeo')];
vow.lines = ['공이 가서 돌아오지 않는다면, 한결의 말발굽이 반드시 고려 왕정을 짓밟을 것이오.'];
vow.en = ['If you go and do not return, Hangyul’s hooves will trample Goryeo underfoot without fail.'];

insertAfter(prison, 'whose blade opened the hand', [
	p(
		'Chunchu has no physician, but he has a sleeve, and sewn into it is what a Silla envoy carries when he expects to be robbed. Somehow it reaches <b>Seon Dohae</b>, the king’s favourite, without passing through any door the Mangniji is watching.',
		'춘추에게 의원은 없지만 소매는 있다. 그 안에는 털릴 각오를 한 신라 사신이 챙기는 것이 꿰매져 있다. 그것은 어찌어찌 막리지가 지키는 어느 문도 지나지 않고 왕의 총신 <b>선도해</b>에게 닿는다.'
	),
	quote(
		'Chunchu secretly gave three hundred measures of blue cloth to the king’s favourite, Seon Dohae.',
		'춘추는 푸른 베 삼백 보를 왕의 총신 선도해에게 몰래 주었다.',
		'春秋以靑布三百步 密贈王之寵臣先道解',
		'Samguk Sagi (三國史記) bk. 41, Biographies — Kim Yushin; Lee Byong-do ed., vol. 2 (Chunchu in Goguryeo, 642)'
	),
	p(
		'Seon Dohae arrives with a jar of wine and no guards, which is either courage or an arrangement. He pours two cups, drinks both when Chunchu does not reach for his, and starts talking about the sea.',
		'선도해는 술 한 단지를 들고 호위도 없이 온다. 배짱이거나, 이미 말이 된 일이거나. 그는 두 잔을 따르고, 춘추가 손을 뻗지 않자 두 잔을 다 마신 뒤, 바다 이야기를 꺼낸다.'
	),
	say(
		'seondohae',
		['손이 그래서야 잔을 들겠소. 내가 마셔 드리지.', '……그런데 공, 거북이와 토끼 이야기 들어 보셨소?'],
		['Can’t hold a cup with a hand like that. I’ll drink it for you.', '…Tell me, my lord. Ever heard the one about the turtle and the rabbit?']
	),
	say('chunchu', ['……들어 봤어도, 공의 입으로 다시 듣고 싶군요.'], ['…Even if I had, I’d like to hear it from you.']),
	say(
		'seondohae',
		[
			'동해 용왕의 딸이 가슴앓이를 했다지. 의원이 그러는 거요, 토끼 간이면 낫는다고.',
			'바다에 토끼가 있나. 그래서 거북이가 뭍에 올라가 토끼한테 말을 걸어.',
			'“저 바다 한가운데 섬이 있는데, 물 맑고 열매 많고, 매도 수리도 못 오는 데다. 가자, 내 등에 타라.”'
		],
		[
			'The Dragon King of the Eastern Sea had a daughter with a sick heart. The physician said a rabbit’s liver would cure her.',
			'No rabbits in the sea. So the turtle climbs up on land and strikes up a conversation with a rabbit.',
			'“Out in the middle of the sea there’s an island. Clear water, fruit everywhere, no hawks, no eagles. Come on. Get on my back.”'
		]
	),
	say('chunchu', ['토끼가 탔겠군요.'], ['And the rabbit got on.']),
	say(
		'seondohae',
		[
			'탔지. 성왕께서 강 건너실 때도 거북이 등을 밟으셨으니, 거북이는 대개 믿을 만하거든. 대개는.',
			'두어 리쯤 가서 거북이가 고개를 돌리고 실토를 해. 사실은 네 간이 필요하다고.',
			'그래서 토끼가 뭐라 했는지 아시오?'
		],
		[
			'Got right on. The Holy King ran across a river on turtles’ backs, so turtles are generally trustworthy. Generally.',
			'Two or three li out, the turtle turns his head and confesses. Actually, we need your liver.',
			'And do you know what the rabbit said?'
		]
	),
	say('chunchu', ['……'], ['…']),
	say(
		'seondohae',
		[
			'“아이고, 나는 신령의 자손이라 오장을 꺼내 씻어 둘 수 있거든. 마침 요새 속이 답답해서 간을 꺼내 바위 밑에 말려 두고 왔지 뭐냐. 돌아가서 가져오자.”',
			'거북이가 믿고 돌아갔지. 뭍에 닿자마자 토끼는 풀숲으로 쏙.',
			'“멍청하긴. 간 없이 사는 놈이 어디 있냐.”'
		],
		[
			'“Oh dear. I’m descended from spirits, I can take out my insides and wash them. My chest’s been tight lately, so I left my liver drying under a rock. Let’s go back and fetch it.”',
			'The turtle believed him and turned around. The moment they touched the shore, the rabbit was into the grass.',
			'“Idiot. Who lives without a liver?”'
		]
	),
	p(
		'Seon Dohae refills his own cup and looks at nothing in particular. Chunchu looks at his ruined hand for a long time, then laughs once, quietly, the way a man laughs when a lock he has been picking turns over.',
		'선도해는 제 잔을 다시 채우고 아무 데도 아닌 곳을 본다. 춘추는 망가진 손을 오래 내려다보다가, 한 번 조용히 웃는다. 붙들고 있던 자물쇠가 돌아갈 때 사람이 웃는 식으로.'
	),
	say('chunchu', ['……종이를 좀 얻을 수 있겠소.', '왼손이 이 모양이니, 오른손으로 쓰지요.'], ['…Could I trouble you for paper?', 'The left one’s in no state, so I’ll use the right.']),
	p(
		'The letter goes to King Bojang rather than the Mangniji. Mamok Pass and Jungnyeong were Goguryeo’s land to begin with, it says, and once Chunchu is home he will ask his own sovereign to give them back. He signs it with a flourish. He has no intention of doing any such thing, and Seon Dohae, finishing the jar, has no intention of mentioning it.',
		'편지는 막리지가 아니라 보장왕에게 간다. 마목현과 죽령은 본디 고구려의 땅이니, 돌아가거든 제 임금께 돌려드리라 청하겠노라고. 춘추는 멋들어지게 서명한다. 그럴 생각은 털끝만큼도 없고, 단지를 비우는 선도해도 그걸 입 밖에 낼 생각이 털끝만큼도 없다.'
	)
]);

/* ── Bidam’s Rebellion: Hangyul ─────────────────────────────────────── */

const rebellion = entry('Bidam’s Rebellion');
guard(rebellion, 'Hangyul');

insertAfter(rebellion, 'we changed heaven’s handwriting', [
	p(
		'The kite buys one night. A sky can only be argued with for so long, and by the grey hour both camps are already arguing about what they saw. Before the drums, <b>Yushin</b> goes down to the palace stables alone and leads out the white horse.',
		'연은 하룻밤을 번다. 하늘과는 그리 오래 다툴 수 없고, 잿빛 새벽이 되자 두 진영은 벌써 자기들이 무엇을 보았는지를 두고 다툰다. 북이 울리기 전, <b>유신</b>은 홀로 궁의 마구간으로 내려가 흰 말을 끌어낸다.'
	),
	p(
		'<b>Hangyul</b> has carried him for eighteen years, since the charge at Nangbi Fortress, to every border the queen sent him to and a few he went to without asking. The groom, a boy of fourteen, works out what the rope in the marshal’s other hand is for before anyone says it, and starts to cry with his mouth shut.',
		'<b>한결</b>은 낭비성 돌격 때부터 열여덟 해 동안 그를 태웠다. 여왕이 보낸 모든 국경으로, 묻지 않고 간 몇몇 국경으로. 열네 살 마부 아이는 대장군의 다른 손에 들린 밧줄이 무엇에 쓰일지 누가 말하기도 전에 알아차리고, 입을 꾹 다문 채 운다.'
	),
	{
		kind: 'flashback',
		year: '612',
		title: 'Hanbyul',
		blocks: [
			p(
				'Seventeen, drunk, and asleep in the saddle. His first horse, <b>Hanbyul</b>, does what any good horse does with a sleeping rider and takes him where he always goes. He wakes at the courtesan <b>Cheongwan</b>’s gate with her lantern already lifted and her face already glad.',
				'열일곱, 취해서, 안장 위에서 잠든 채. 첫 말 <b>한별</b>은 잠든 주인을 태운 좋은 말이라면 누구나 하는 일을 한다. 늘 가던 곳으로 데려간다. 그가 눈을 뜬 곳은 기생 <b>천관</b>의 문 앞이고, 그녀의 등불은 이미 들려 있고, 얼굴은 이미 반갑다.'
			),
			say(
				'cheongwan',
				['오셨어요?', '……어머님께 다시는 안 오신다고 맹세하셨다더니.'],
				['You came?', '…They said you swore to your mother you’d never come again.']
			),
			p(
				'He had sworn it. The horse had not. He gets down, draws, and takes Hanbyul’s head off at the gate in one stroke, then walks home past the lantern without looking at it. The song Cheongwan made about that night outlives both of them.',
				'맹세는 그가 했다. 말은 하지 않았다. 그는 내려서 칼을 뽑아, 문 앞에서 단칼에 한별의 목을 벤다. 그리고 등불은 쳐다보지도 않고 걸어서 집으로 간다. 그날 밤을 두고 천관이 지은 노래는 두 사람보다 오래 산다.'
			)
		]
	},
	p(
		'The star came down past the west wall of Wolseong, where the ground is still scorched in a long smear. Yushin walks Hangyul there himself. <b>Chunchu</b> is already waiting with two priests, a bronze basin, and a face that has decided not to argue.',
		'별은 월성 서쪽 담 너머에 떨어졌고, 그곳 땅은 아직 길게 그을려 있다. 유신은 한결을 직접 끌고 간다. <b>춘추</b>는 이미 제관 둘과 청동 대야, 그리고 따지지 않기로 마음먹은 얼굴을 하고 기다리고 있다.'
	),
	say('chunchu', ['……흰 말은 또 있어. 마구간에 셋이나.', '꼭 얘여야 해?'], ['…There are other white horses. Three in the stable.', 'Does it have to be this one?']),
	say(
		'yushin',
		['저쪽도 다 알아. 내가 무슨 말을 타는지.', '남의 말을 바치면 하늘이 웃는 게 아니라 비담이 웃어.'],
		['They know over there. Everyone knows which horse I ride.', 'Offer someone else’s horse and it isn’t heaven that laughs. It’s Bidam.']
	),
	p(
		'He takes the halter off with his own hands. Hangyul, who has been led to a great many strange places at night, puts his nose into Yushin’s chest and waits for the reason, as he always has.',
		'그는 제 손으로 굴레를 벗긴다. 밤마다 낯선 곳으로 수없이 끌려가 본 한결은, 늘 그래 왔듯 유신의 가슴에 코를 묻고 이유를 기다린다.'
	),
	say(
		'yushin',
		['열여덟 해.', '낭비성에서 네가 아니었으면 난 거기서 끝났어.', '……미안하다. 이번엔 내가 너를 데려왔구나.'],
		['Eighteen years.', 'If it weren’t for you at Nangbi, I’d have ended there.', '…I’m sorry. This time I’m the one who brought you.']
	),
	say('chunchu', ['유신아.', '……내가 할까.'], ['Yushin.', '…Want me to do it?']),
	say('yushin', ['아니.', '내 말이야.'], ['No.', 'He’s mine.']),
	p(
		'He does it the way the rite asks and faster than the rite asks, so the horse never quite finishes turning his head. White goes down into the scorched black. The priests begin the prayer, and Yushin, who has never once let another man finish a sentence for him, lets them.',
		'그는 의례가 시키는 대로, 그러나 의례보다 빠르게 한다. 말이 고개를 미처 다 돌리기도 전에. 흰 것이 그을린 검은 땅 위로 무너진다. 제관들이 축문을 시작하고, 평생 남이 제 말을 대신 끝맺게 둔 적 없는 유신이 이번에는 그렇게 둔다.'
	),
	quote(
		'He slaughtered a white horse and offered it at the place where the star had fallen, and prayed: “In the way of Heaven, yang is firm and yin is yielding; in the way of men, the sovereign is honoured and the subject humble. Should this ever be reversed, there is great disorder.”',
		'흰 말을 잡아 별이 떨어진 곳에 제사 지내고 빌었다. “하늘의 도는 양이 굳세고 음이 부드러우며, 사람의 도는 임금이 높고 신하가 낮습니다. 만일 이를 바꾸면 곧 큰 난리가 됩니다.”',
		'刑白馬 祭於星落之地 祝曰 天道則陽剛而陰柔 人道則君尊而臣卑 苟或易之 卽爲大亂',
		'Samguk Sagi (三國史記) bk. 41, Biographies — Kim Yushin; Lee Byong-do ed., vol. 2 (Bidam’s rebellion, 647)'
	),
	p(
		'Across the field, on the Radiance wall, <b>Bidam</b> watches the smoke of the offering go up and asks an officer what was burned. When he is told, he puts his beads away for the first time in eight days and goes down to the lines to stand beside his own horse, <b>Bisamun</b>, for a while, saying nothing to anybody.',
		'들판 건너 명활성 성벽에서 <b>비담</b>은 제물 연기가 오르는 것을 보고, 무엇을 태웠느냐고 장교에게 묻는다. 대답을 듣자 그는 여드레 만에 처음으로 염주를 거두고, 진영으로 내려가 제 말 <b>비사문</b> 곁에 한동안 서 있다. 아무에게도 아무 말 없이.'
	),
	p(
		'At dawn the groom leads out a young grey, too green for a marshal, the only horse left in the royal stable that nobody has been afraid of all week.',
		'새벽에 마부 아이가 어린 회색 말을 끌고 나온다. 대장군이 타기엔 아직 풋내기, 이번 주 내내 아무도 무서워하지 않은 왕궁 마구간의 마지막 말.'
	),
	say('yushin', ['이름은?'], ['Name?']),
	p('The boy shakes his head. He is still crying.', '아이는 고개를 젓는다. 아직 울고 있다.'),
	say('yushin', ['한슬.', '……부르기 쉽게 지었다. 그만 울고 불러 봐.'], ['Hanseul.', '…It’s easy to say. Stop crying and try it.']),
	p(
		'It is the last horse he names. He rides <b>Hanseul</b> out on the tenth day, and across the Yellow Mountain fields thirteen years later, and never once lets a groom catch him brushing it longer than the others.',
		'그가 이름을 지어 준 마지막 말이다. 열째 날 그는 <b>한슬</b>을 타고 나가고, 열세 해 뒤 황산벌도 한슬을 타고 건넌다. 그리고 다른 말보다 그 녀석을 오래 빗질하는 모습을, 마부에게 단 한 번도 들키지 않는다.'
	)
]);

/* ── Goguryeo royal epithets ────────────────────────────────────────── */

const massacre = entry('Yeon’s Massacre');
const flash = massacre.blocks[0];
const forged = flash.blocks?.find((b) => b.person === 'gesomun' && (b.en ?? []).some((l) => l.includes('Jumong forged')));
if (forged) {
	forged.lines = forged.lines.map((l) => l.replace('주몽이 여기서 나라를 빚었소.', '성왕께서 여기서 나라를 빚으셨소.'));
	forged.en = forged.en.map((l) => l.replace('Jumong forged a country here.', 'The Holy King forged a country here.'));
}

save();
console.log('inserted: Jumong thin horse, Chunchu rabbit fable, Yushin Hangyul; epithet fix:', Boolean(forged));
