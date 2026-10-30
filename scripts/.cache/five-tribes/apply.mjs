// Five Tribes (634): Yeon's road from Chek Fortress to Pyongyang, before High Summit.
// Lazy-eye becomes an Eastern soldier who walks the cart south and is given to the West at dusk.
// Idempotent: skips the insert if 'Five Tribes' exists; text edits check before replacing.
import fs from 'fs';

const FILE = 'src/lib/data/story.json';
const chapters = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const samhan = chapters.find((c) => c.id === 'samhan');
const entry = (title) => samhan.entries.find((e) => e.title === title);
const text = (b) => `${b.html ?? ''} ${(b.en ?? []).join(' ')}`;
const findIdx = (blocks, needle) => blocks.findIndex((b) => text(b).includes(needle));

const chipOf = (person) => {
	for (const c of chapters)
		for (const e of c.entries)
			for (const b of e.blocks) if (b.kind === 'dialogue' && b.person === person && b.chip) return b.chip;
	return undefined;
};

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko, weather) => ({ kind: 'scene', label, ko, ...(weather ? { weather } : {}) });
const say = (person, en, lines) => {
	const chip = chipOf(person);
	return { kind: 'dialogue', person, ...(chip ? { chip } : {}), en, lines };
};
const extra = (speaker, en, lines, gender = 'm') => ({ kind: 'dialogue', speaker, gender, chip: '#8d8d95', en, lines });
const eye = (en, lines) => extra('Junior warrior', en, lines);
const gulgul = (en, lines, mnc) => ({
	kind: 'dialogue',
	person: 'gulgul',
	speaker: '🧒',
	chip: '#8fa87a',
	en,
	lines,
	...(mnc ? { mnc } : {})
});
const Y = (en, ko) => say('gesomun', en, ko);
const W = (en, ko) => say('yeonwife', en, ko);
const D = (en, ko) => say('dosuryu', en, ko);

const BLOCKS = [
	p('Goguryeo has one king and five roofs. The roofs were here first.', '고구려에는 임금이 하나, 지붕이 다섯 있다. 지붕이 먼저 있었다.'),
	{
		kind: 'map',
		year: 634,
		places: ['chek_fort', 'gungnae', 'pyongyang'],
		routes: ['yeon634-south'],
		riverNames: true,
		title: 'Chek Fortress to Pyongyang',
		caption: 'A month of road. Two rivers, one old capital, and a pass that doesn’t care who you are.',
		ko: '한 달 길. 강 둘, 옛 도읍 하나, 그리고 누가 지나가든 상관 않는 고개 하나.'
	},

	scene('The Cart', '수레', 'snow'),
	p(
		'Yeon meant to ride south with six men and be in Pyongyang in twelve days. Then his wife told him she was coming.',
		'연은 사내 여섯을 데리고 남쪽으로 달려 열이틀 만에 평양에 닿을 셈이었다. 그때 아내가 자기도 가겠다고 했다.'
	),
	{
		kind: 'card',
		person: 'yeonwife',
		caption: 'Seven months gone. Twice the Eastern hall has made a cradle and put it away again.',
		ko: '일곱 달째. 동부의 집은 요람을 두 번 짰다가 두 번 치웠다.'
	},
	p(
		'This time she wants the old Yeon house in Pyongyang: the midwife who caught Yeon himself, and a painting of the birth goddess that three generations of Yeon women have rubbed pale with their hands.',
		'이번에는 평양의 연씨 옛집에서 낳겠다고 한다. 연을 받아 낸 산파가 거기 있고, 연씨 집안 여자들이 삼 대째 손으로 쓸어 빛바랜 삼신 그림이 거기 걸려 있다.'
	),
	Y(['A month of road. In a cart. In the thaw.', 'You’ll be sick at every rut.'], ['한 달 길이다. 수레로. 얼음 풀릴 때.', '바퀴 자국마다 속 뒤집힐 기야.']),
	W(['Then drive round the ruts.', '…Not in this fort. This fort has bad luck.'], ['그럼 자국을 비켜 가요.', '…이 성에선 안 낳아요. 이 성은 운이 나빠요.']),
	p(
		'So the Eastern Commander goes to the High Summit at the pace of an ox. Six riders, one covered cart, a spare horse, and a junior soldier walking at the cart’s wheel, because somebody has to, and in the East it is always him.',
		'그래서 동부 대가는 소걸음으로 제가회의에 간다. 기병 여섯, 덮개 수레 하나, 여벌 말 한 필, 그리고 수레바퀴 옆을 걷는 말단 군사 하나. 누군가는 걸어야 하고, 동부에서는 늘 그다.'
	),
	p(
		'He is twenty-four, a mason’s son from the hill farms under the fortress. One of his eyes looks where he looks. The other wanders off on business of its own.',
		'스물넷, 성 아래 산골 석수장이의 아들이다. 한쪽 눈은 그가 보는 곳을 본다. 다른 쪽은 제 볼일을 보러 딴 데로 간다.'
	),
	p(
		'On the first morning Yeon loads the cart himself, grain sacks at the back. By the time he has his gloves on, the sacks are at the front.',
		'첫날 아침, 연이 손수 수레에 짐을 싣는다. 곡식 자루는 뒤쪽에. 장갑을 다 끼고 보니 자루가 앞쪽에 가 있다.'
	),
	Y(['Who moved my sacks.'], ['내 자루 누가 옮겼네.']),
	eye(
		['Me, sir. Weight over the axle.', 'Else the back end bucks in a rut, and your lady with it.'],
		['내래 옮겼습네다. 무게는 굴대 위에 실어야 합네다.', '안 기러면 바퀴 자국에서 뒤가 튑네다. 마님도 같이요.']
	),
	Y(['Did I ask?'], ['내가 물어봤네?']),
	eye(['No, sir. The ruts will.'], ['아닙네다. 바퀴 자국이 물어볼 겁네다.']),
	Y(['…Which one of those is looking at me?'], ['…어느 눈으로 날 보고 있네?']),
	eye(['Both, sir. Always both.'], ['둘 다입네다. 늘 둘 다요.']),
	p(
		'Yeon has a thousand men and knows almost none of their names. He doesn’t ask this one’s either. By the second day he is calling him Eye.',
		'연에게는 군사가 천이고, 이름을 아는 이는 거의 없다. 이 사내 이름도 묻지 않는다. 이틀째부터는 그냥 ‘눈’이라고 부른다.'
	),
	p(
		'That night a rider comes up the road behind them in the dark. It is Dosuryu, with the Mohe boy in front of him on the saddle and two neat sets of teeth marks on his wrist.',
		'그날 밤 어둠 속에서 말 한 필이 뒤따라 올라온다. 도수류다. 안장 앞에 말갈 아이를 태웠고, 손목에는 가지런한 잇자국이 두 벌 나 있다.'
	),
	D(['He bit me. Twice.', 'You told me not to let him. Nobody told him.'], ['물었어. 두 번.', '너는 물리지 말라 기랬디. 쟤한테는 아무도 말 안 했어.']),
	Y(['So you brought him.'], ['기래서 데려왔네.']),
	D(['He was already walking. Barefoot. In that.'], ['벌써 걷고 있었어. 맨발로. 이 눈밭을.']),
	p(
		'Yeon’s wife lifts the cart flap and looks at the boy for a long moment. Then she moves her feet to make room. Gulgul climbs in without a word in any language. By morning he is asleep against her belly, the baby is kicking him, and neither of them seems to mind.',
		'연의 아내가 수레 덮개를 들추고 아이를 한참 본다. 그러고는 발을 옮겨 자리를 낸다. 걸걸은 어느 나라 말로도 아무 말 없이 기어 들어간다. 아침이 되자 아이는 그녀의 배에 기대 잠들어 있고, 배 속 아기는 그를 걷어차고 있고, 둘 다 별로 개의치 않는 눈치다.'
	),

	scene('The Singing Ice', '우는 얼음', 'snow'),
	p(
		'Five days south, the road meets a river frozen white from bank to bank. The headman of the nearest village swears by it. It held his ox at New Year.',
		'남쪽으로 닷새, 길이 강과 만난다. 이 기슭부터 저 기슭까지 하얗게 얼었다. 가까운 마을 촌장이 장담한다. 설날에 자기 소가 건넜다는 것이다.'
	),
	Y(['Then it holds a cart. Across.'], ['기럼 수레도 버티갔다. 건너.']),
	p('The soldier called Eye is lying flat on the ice with one ear pressed to it.', '‘눈’이라 불리는 군사가 얼음 위에 납작 엎드려 한쪽 귀를 대고 있다.'),
	eye(
		['Not here, sir. Listen. It’s singing.', 'There’s water running under. Down by the reeds it’s quiet.'],
		['여기는 안 됩네다. 들어 보십시오. 얼음이 웁네다.', '밑으로 물이 흐릅네다. 저 아래 갈대 있는 데는 조용합네다.']
	),
	Y(['Ice doesnae sing. The man’s ox crossed here.'], ['얼음이 무슨 울어. 데 사람 소가 여기로 건넜대.']),
	eye(['At New Year, sir. It’s been a warm month.'], ['설날에요, 장군님. 그 뒤로 한 달 내내 따뜻했습네다.']),
	gulgul(['The ice is crying.'], ['얼음이 운다.'], ['Juhe songgombi.']),
	p(
		'Yeon looks at the headman. The headman finds something interesting in the reeds. Yeon sends the spare horse over first, at the spot he chose, to prove a point.',
		'연이 촌장을 본다. 촌장은 갈대숲에서 갑자기 볼 것이 생긴다. 연은 제 말이 옳다는 걸 보이려고, 자기가 고른 자리로 여벌 말부터 건너보낸다.'
	),
	p(
		'Ten paces out, the ice opens like a mouth. The horse goes in to the neck. Yeon goes in after it to the chest, in his boots and his commander’s coat, and hauls it out by the bridle with his own two hands, swearing the whole time in a voice that carries to the next village.',
		'열 걸음쯤에서 얼음이 입처럼 벌어진다. 말이 목까지 빠진다. 연이 장화에 대가의 외투를 입은 채 가슴까지 뛰어들어, 제 두 손으로 굴레를 잡아 끌어낸다. 그동안 내내 욕을 하는데, 그 소리가 옆 마을까지 간다.'
	),
	p(
		'When he climbs out, the cart is already across. The soldier walked the ox over by the reeds while everyone was watching the horse.',
		'그가 기어 나와 보니 수레는 이미 건너가 있다. 모두가 말을 보는 사이, 그 군사가 갈대 쪽으로 소를 몰고 건너간 것이다.'
	),
	Y(['You crossed without my order.'], ['내 명도 없이 건넜네.']),
	eye(['Aye, sir. Your lady was in it.'], ['예, 장군님. 마님이 타고 계셨습네다.']),
	Y(['Next time you disobey me, I’ll have your head.'], ['다음에 또 내 명을 어기면 네 목을 치갔다.']),
	eye(['Aye, sir. Next time I’m wrong, have it.'], ['예, 장군님. 다음에 제가 틀리면 치십시오.']),
	p(
		'Inside the cart, Yeon’s wife laughs for the first time in a month. Yeon stands dripping on the bank and decides, for reasons he will not explain, not to hear it.',
		'수레 안에서 연의 아내가 한 달 만에 처음으로 웃는다. 연은 강가에 물을 뚝뚝 흘리며 서서, 설명할 생각도 없는 이유로 못 들은 척하기로 한다.'
	),

	scene('The Hill Farms', '산골 마을'),
	p(
		'South of the river the road runs through farms the Mohe used to visit every winter. They haven’t visited in three years. The farms know exactly whose doing that is.',
		'강 남쪽으로 길은 산골 마을들을 지난다. 말갈이 겨울마다 들르던 마을들이다. 삼 년째 오지 않는다. 그게 누구 덕인지 마을들은 똑똑히 안다.'
	),
	p(
		'They come out for him. Children run beside the red bay. Women push rice cakes into the cart until Yeon’s wife starts passing them out the other side.',
		'사람들이 그를 보러 나온다. 아이들이 붉은 말 옆을 따라 뛴다. 아낙들이 수레 안으로 떡을 밀어 넣는데, 하도 많아서 연의 아내가 반대편으로 도로 내주기 시작한다.'
	),
	extra(
		'Old farmer',
		['Commander! Three winters and not one roof burned!', 'Take a hen. Take two. Take my grandson, he eats too much!'],
		['장군님! 세 겨울째 지붕 하나 안 탔습네다!', '닭 가져가시라요. 두 마리 가져가시라요. 내 손주도 가져가시라요, 너무 많이 먹습네다!']
	),
	Y(['Keep the hen. Feed the boy. I’ll want him in ten years.'], ['닭은 두라. 아이나 먹이라우. 십 년 뒤에 데려가갔다.']),
	p('Behind the crowd, in every village, there are also the doors that stay shut.', '그리고 마을마다, 사람들 뒤쪽에는 끝내 열리지 않는 문들도 있다.'),
	extra(
		'Woman at a door',
		['That’s him. The one from the black-river village.', 'Bring the wee one in.'],
		['데 사람이야. 검은 강 마을 일 한 사람.', '꼬맹이 들여보내라.'],
		'f'
	),
	extra('Her neighbour', ['He’s no going to eat him, Ok-nyeo.'], ['잡아먹기야 하갔네, 옥녀야.'], 'f'),
	extra('Woman at a door', ['I said bring him in.'], ['들여보내라 했다.'], 'f'),
	extra(
		'Old man on a bench',
		['My grandson rode with him last winter. Came home fine.', 'Doesnae talk now. Not a word, since.'],
		['내 손주가 지난겨울에 데 사람 따라갔디. 멀쩡히 돌아왔어.', '기런데 말을 안 해. 기 뒤로 한마디도.']
	),
	p(
		'Gulgul watches the shut doors from the cart. He has seen a village from the other side.',
		'걸걸은 수레에서 닫힌 문들을 본다. 그는 마을이라는 걸 반대편에서 본 적이 있다.'
	),
	W(['And the doors?'], ['문 닫는 사람들은요?']),
	Y(['Doors are fine. A door means the house is still standing.'], ['문은 괜찮아. 문이 있다는 건 집이 아직 서 있다는 기야.']),

	scene('The Log', '통나무', 'snow'),
	p(
		'In a pass of fir and rock there is a log across the road, and behind it a dozen men with picks.',
		'전나무와 바위뿐인 고개에 통나무 하나가 길을 막고 있고, 그 뒤에 곡괭이를 든 사내 열둘이 있다.'
	),
	p(
		'They are not Mohe. They are Goguryeo farm sons in the quilted jackets the wall gangs wear, and they have been living in the trees since autumn.',
		'말갈이 아니다. 성벽 부역 패가 입는 누비저고리를 걸친 고구려 농사꾼 아들들이다. 가을부터 숲에서 살았다.'
	),
	extra(
		'Deserter',
		['Leave the cart and walk on. Nobody gets hurt.', '…Is that— that’s the East’s banner.'],
		['수레 두고 걸어가라. 아무도 안 다친다.', '…데거— 데거 동부 깃발 아니네?']
	),
	p(
		'It goes about as well for them as you’d expect. Eye drops the first one with a stone the size of a fist, thrown sidearm, the way a mason’s boy learns on a scree slope. Yeon’s riders do the rest without drawing.',
		'그들에게는 짐작한 만큼 일이 풀린다. ‘눈’이 주먹만 한 돌을 옆으로 던져 첫째를 쓰러뜨린다. 석수장이 아들이 돌비탈에서 배우는 솜씨다. 나머지는 연의 기병들이 칼도 안 뽑고 끝낸다.'
	),
	p(
		'Yeon has the twelve kneeling in the snow when the county magistrate comes up the pass at a trot, waving a scroll with a royal seal on it.',
		'연이 열둘을 눈밭에 꿇려 놓았을 때, 고을 현령이 왕의 인장이 찍힌 두루마리를 흔들며 종종걸음으로 고개를 올라온다.'
	),
	extra(
		'Magistrate',
		[
			'Commander! Commander, they’re pardoned!',
			'His Majesty’s New Year amnesty. Every man who ran from the wall and goes home is forgiven. Every one.'
		],
		['대가님! 대가님, 사면받은 놈들입네다!', '폐하의 설날 대사면입네다. 성벽에서 도망쳤어도 집에만 돌아가면 다 용서한다 하셨습네다. 하나도 빠짐없이.']
	),
	Y(['They didn’t go home. They went into the trees with picks.'], ['집에 안 갔어. 곡괭이 들고 숲에 들어갔디.']),
	extra('Magistrate', ['Then they’re going home now. His Majesty is merciful.'], ['그럼 이제 가면 됩네다. 폐하께서는 자비로우십네다.']),
	Y(
		[
			'His Majesty builds a wall a thousand li long, and forgives every man who walks off it.',
			'…Fine. Pardoned. Good. A pardoned man can carry stone.',
			'Walk them back to the wall. All twelve. If one of them goes home on the way, he’s pardoned, and you can tell his mother where we buried him.'
		],
		[
			'폐하께서는 천 리짜리 성을 쌓으시면서, 거기서 도망치는 놈은 다 용서하시는구만.',
			'…좋다. 사면. 좋아. 사면받은 놈도 돌은 나를 수 있디.',
			'성벽으로 도로 끌고 가라. 열둘 다. 가는 길에 하나라도 집에 가면, 그놈은 사면이다. 묻은 데는 네가 어미한테 알려 주라우.'
		]
	),
	p(
		'The magistrate rolls his scroll back up very slowly, the way you’d put away a toy in front of a dog.',
		'현령이 두루마리를 아주 천천히 도로 만다. 개 앞에서 장난감을 치우는 사람처럼.'
	),
	p(
		'Twelve men walk back north with two of Yeon’s riders behind them. None of them goes home on the way.',
		'사내 열둘이 연의 기병 둘을 뒤에 달고 북쪽으로 도로 걷는다. 가는 길에 집에 간 놈은 하나도 없다.'
	),

	scene('Gungnae', '국내성'),
	{
		kind: 'place',
		place: 'gungnae',
		html: 'The old capital, on the Amnok. Kings lived here for four hundred years. Now it keeps their tombs, and the tombs are bigger than the houses.',
		ko: '압록강 가의 옛 도읍. 임금들이 사백 년을 살았다. 지금은 그 무덤을 지키는데, 무덤이 집보다 크다.'
	},
	p(
		'On the twentieth day the road drops into the Amnok valley. A square stone wall stands on the near bank with the mountain fort behind it, and across the plain rise stepped stone tombs as tall as hills, as if the old kings wanted to be found.',
		'스무날째, 길이 압록강 골짜기로 내려선다. 가까운 기슭에 네모난 돌성이 서 있고 그 뒤로 산성이 있다. 들판 건너에는 언덕만 한 계단식 돌무덤들이 솟아 있다. 옛 임금들이 꼭 찾아 주길 바랐던 것처럼.'
	),
	p(
		'Among them stands a stone taller than three men, rough as a cliff, with writing cut into all four faces. Yeon gets down and drops his plumb line against it. The string hangs flat to the stone all the way down.',
		'그 사이에 사람 셋 키보다 높은 돌 하나가 서 있다. 벼랑처럼 거칠고, 네 면 모두에 글이 새겨져 있다. 연이 말에서 내려 다림줄을 댄다. 줄이 처음부터 끝까지 돌에 딱 붙어 내려간다.'
	),
	eye(['Who set that one, sir?'], ['데건 누가 세웠습네까, 장군님?']),
	Y(['A king who didnae pay anybody.'], ['아무한테도 안 바친 임금.']),
	p(
		'He does not kick it. Gulgul runs his fingers along the carved characters, as if they might turn into Mohe if he reads them fast enough.',
		'그는 걷어차지 않는다. 걸걸이 새겨진 글자를 손가락으로 따라 훑는다. 빨리 읽으면 말갈 말이 될지도 모른다는 듯이.'
	),

	scene('Five Stones', '돌 다섯'),
	p(
		'That night they camp under the tombs. Yeon, who has never explained anything to anyone, decides to explain Goguryeo to a boy who doesn’t speak the language.',
		'그날 밤 그들은 무덤 아래서 야영한다. 평생 누구에게도 무엇을 설명해 본 적 없는 연이, 말도 안 통하는 아이에게 고구려를 설명하기로 한다.'
	),
	p('He puts five stones on the ground by the fire.', '그가 모닥불 옆 땅바닥에 돌 다섯 개를 놓는다.'),
	Y(
		[
			'Five roofs. Listen.',
			'This one’s the East. The crow. That’s us. Eastern hall, Yeon, since before there was a Goguryeo.',
			'The horse sits in the middle. Whoever’s High Commander sits on the horse.',
			'Cow’s the West. Pig’s the South. Dog’s the North.'
		],
		['지붕 다섯. 들어 보라.', '이게 동쪽. 까마귀. 우리다. 동부, 연씨. 고구려가 생기기도 전부터.', '말은 가운데 앉는다. 막리지가 누구든 말 위에 앉디.', '소는 서쪽. 돼지는 남쪽. 개는 북쪽.']
	),
	gulgul(['Crow.'], ['까마귀.'], ['Gaha.']),
	Y(['Aye! Crow! You see? He gets it.'], ['기래! 까마귀! 봤네? 알아듣잖아.']),
	D(
		['He’s said that at every crow since the river. It’s his word for crow, not yours.'],
		['강 건넌 뒤로 까마귀만 보면 기래. 쟤네 말로 까마귀란 거디, 네 말 알아들은 게 아니고.']
	),
	Y(['Same thing.'], ['기게 기거디.']),
	{
		kind: 'term',
		hanja: '五部',
		reading: '오부',
		term: 'Five Tribes',
		html: 'Five roofs. Before there was a Goguryeo, they were five tribes in one valley, each with its own chief, its own herds and its own grudges. The names are older still: men in the far north named their chiefs after their herds. Now the five are five commands and five quarters of the capital. The grudges kept.',
		ko: '지붕 다섯. 고구려가 생기기 전, 한 골짜기에 살던 다섯 부족이다. 저마다 족장이 있고, 가축이 있고, 원한이 있었다. 이름은 그보다도 오래됐다. 먼 북쪽 사람들은 족장을 제 가축 이름으로 불렀다. 지금 다섯은 다섯 군단이고, 도읍의 다섯 구역이다. 원한은 그대로 남았다.',
		diagram: 'five-tribes',
		step: 'league'
	},
	p('Then he picks up a sixth thing, a pine cone, and sets it on top of the pile.', '그러고는 여섯째 것, 솔방울 하나를 집어 돌무더기 위에 얹는다.'),
	Y(
		['And the king. The king’s house sits on top of the five.', 'It came over the river and married in. Then it stayed.'],
		['기리고 임금. 임금 집안은 다섯 위에 앉아 있디.', '강 건너와서 장가들었어. 기러고 눌러앉았디.']
	),
	W(['Tell him the rest.'], ['나머지도 얘기해 줘요.']),
	Y(['What rest.'], ['무슨 나머지.']),
	W(
		['That the kings used to come from another roof, until it went soft. It still keeps its own ancestor shrine. As if it might be needed again.'],
		['임금이 원래는 다른 지붕에서 났다는 거요. 그 지붕이 물러지기 전까지는. 지금도 자기네 조상 사당을 따로 모셔요. 언제 또 쓰일지 모른다는 듯이.']
	),
	Y(['The West. Aye. That’s why the West never starts anything. It’s waiting.'], ['서부. 기래. 기래서 서부는 아무 일도 안 벌이는 기야. 기다리는 거디.']),
	W(['And the North gives the kings their wives.'], ['기리고 북부는 임금한테 왕비를 대고요.']),
	Y(['I didnae forget the North. I was hoping.'], ['북부 잊은 거 아니야. 잊고 싶었디.']),
	p(
		'She is right, and so is the record. The far west wrote the five roofs down once, under names no roof answers to. It got the kings right.',
		'그녀 말이 맞고, 기록도 맞다. 먼 서쪽 사람들이 한번 이 지붕 다섯을 적어 둔 적이 있다. 어느 지붕도 대답하지 않는 이름으로. 임금 이야기만은 맞게 적었다.'
	),
	{
		kind: 'quote',
		html: 'From the beginning there were five clans: the Yeonno, the Jeolno, the Sunno, the Gwanno and the Gyeru. At first the Yeonno gave the king. They grew weak, and now the Gyeru have taken their place. … The Yeonno were once lords of the country. Though they no longer give the king, their rightful chief may still be called Gochu-ga, and they may keep their own ancestral shrine. … The Jeolno marry the kings, generation after generation.',
		ko: '본래 다섯 족이 있으니 연노부·절노부·순노부·관노부·계루부이다. 본래 연노부에서 왕이 나왔으나 점점 약해져서 지금은 계루부가 대신한다. … 연노부는 본래 나라의 주인이었으므로, 지금은 왕이 되지 못하나 그 적통 대인은 고추가라 일컬을 수 있고, 또한 종묘를 세울 수 있다. … 절노부는 대대로 왕과 혼인한다.',
		hanja: '本有五族，有涓奴部、絶奴部、順奴部、灌奴部、桂婁部。本涓奴部爲王，稍微弱，今桂婁部代之。…涓奴部本國主，今雖不爲王，適統大人，得稱古雛加，亦得立宗廟。…絶奴部世與王婚。',
		source: 'Records of the Three Kingdoms (三國志) bk. 30, Wei — Eastern Barbarians, Goguryeo'
	},
	eye(
		['Sir. Every ka keeps his own men, aye? Our names go up to the king, but we stand behind the king’s men. Never in the same row.'],
		['장군님. 대가마다 자기 사람을 따로 둔다 했디요? 우리 이름은 임금께 올라가도, 줄은 임금 사람들 뒤에 섭네다. 한 줄에는 절대 안 서고요.']
	),
	Y(['Aye. So?'], ['기래. 기래서?']),
	eye(['So whose man am I, sir? The king’s, or yours?'], ['기럼 저는 누구 사람입네까? 임금님 사람입네까, 장군님 사람입네까?']),
	Y(['Mine.'], ['내 사람.']),
	eye(['And whose are you?'], ['기럼 장군님은 누구 사람입네까?']),
	p('Dosuryu stops chewing. Yeon looks at the soldier for an unreasonably long time.', '도수류가 씹던 걸 멈춘다. 연이 그 군사를 터무니없이 오래 쳐다본다.'),
	Y(['…Goguryeo’s.'], ['…고구려 사람.']),
	eye(['Then I’m Goguryeo’s too, sir. Same as you.'], ['기럼 저도 고구려 사람입네다, 장군님. 장군님이랑 똑같이요.']),
	p(
		'Yeon laughs, the slap of a laugh, and throws the pine cone at him. Years from now he will wish he had asked the man’s name that night, when it would have been easy.',
		'연이 철썩 하는 그 웃음을 터뜨리고 솔방울을 그에게 던진다. 여러 해 뒤, 그는 그날 밤 그 사내 이름을 물어 둘 걸 그랬다고 생각하게 된다. 그날 밤이라면 쉬웠을 텐데.'
	),

	scene('The Ferry', '나루'),
	p(
		'In the morning the Amnok is breaking up. Plates of grey ice the size of threshing floors turn slowly in the current and knock together like slow drums.',
		'아침이 되자 압록강 얼음이 깨지고 있다. 타작마당만 한 잿빛 얼음판들이 물살에 천천히 돌며, 느린 북처럼 서로 부딪친다.'
	),
	extra(
		'Ferryman',
		[
			'Can’t take a cart in that, Commander. Not on this raft.',
			'His Majesty let the ferry tax go three years running. Kind man. Very kind.',
			'So nobody’s mended the raft in three years.'
		],
		['저기로 수레는 못 건넵네다, 대가님. 이 뗏목으로는요.', '폐하께서 나룻세를 삼 년째 안 받으셨습네다. 인자하신 분이디요. 아주 인자하셔.', '기래서 삼 년째 뗏목 고친 사람이 없습네다.']
	),
	p(
		'Eye spends the morning lashing new crossbeams to the raft with the cart’s spare rope. Yeon spends it on the bank with the plumb line, telling him every lashing is crooked. They cross at noon with poles, between two plates of ice, and Yeon’s wife holds Gulgul’s hand the whole way and pretends it is for his sake.',
		'‘눈’이 오전 내내 수레의 여벌 밧줄로 뗏목에 새 가로대를 묶는다. 연은 오전 내내 강가에서 다림줄을 들고 매듭마다 삐뚤어졌다고 한다. 정오에 그들은 장대를 짚어 얼음판 두 장 사이로 건넌다. 연의 아내는 내내 걸걸의 손을 잡고 있고, 그게 아이를 위해서인 척한다.'
	),
	p(
		'Halfway over, the ferryman tells them the rest of the news from the capital. He tells it the way ferrymen tell everything, to the water.',
		'강 한복판에서 뱃사공이 도읍 소식을 마저 전한다. 뱃사공들이 늘 그러듯, 물에다 대고.'
	),
	extra(
		'Ferryman',
		[
			'Six years back His Majesty sent the Western emperor a map. Of us. Every river, every fort.',
			'A present, they said. The emperor had caught some khan.'
		],
		['육 년 전에 폐하께서 서국 황제한테 지도를 보내셨답네다. 우리 지도요. 강이란 강, 성이란 성 다.', '선물이라 했답네다. 황제가 무슨 가한을 잡았다고.']
	),
	Y(['A map.', '…Of us.'], ['지도.', '…우리 지도.']),
	extra(
		'Ferryman',
		['And when he was new on the throne he sent ten thousand Western prisoners home. Fed them first. Very kind.'],
		['기리고 즉위하시고 얼마 안 돼서 서국 포로 만 명을 돌려보내셨디요. 배불리 먹여서. 아주 인자하셔.']
	),
	p(
		'Yeon says nothing for the rest of the crossing. Dosuryu, who has known him since he was six, moves to the far end of the raft.',
		'연은 건너는 내내 아무 말도 하지 않는다. 그가 여섯 살 때부터 알아 온 도수류가 뗏목 반대쪽 끝으로 옮겨 간다.'
	),

	scene('The Pass', '고개', 'snow'),
	p(
		'Beyond the Amnok the road climbs for eight days through hills that have not heard it is spring. On the sixth, in a late snow, the cart’s axle cracks.',
		'압록강 너머로 길은 여드레를 오른다. 봄이 온 줄도 모르는 산들이다. 엿새째, 늦눈 속에서 수레 굴대가 갈라진다.'
	),
	p(
		'Then Yeon’s wife makes a sound inside the cart that every man on the road understands.',
		'그때 수레 안에서 연의 아내가 소리를 낸다. 길 위의 사내라면 누구나 알아듣는 소리다.'
	),
	Y(['Not here. Not— Dosuryu, how far’s the next village?'], ['여기서는 안 돼. 안— 도수류, 다음 마을까지 얼마네?']),
	D(['Two days. With a wheel.'], ['이틀. 바퀴가 있으면.']),
	W(['…It’s not him. Not yet.', 'He kicks when the road is bad. Tell the road.'], ['…아기 아니에요. 아직은.', '길이 험하면 차요. 길한테 말해요.']),
	p(
		'Yeon tells the road, loudly, in words the hill farms will be using for a generation. Eye, meanwhile, has walked up the slope, chosen a young pine, felled it with a borrowed axe, and is shaving it square with the axe-head turned sideways.',
		'연이 길한테 말한다. 크게, 산골 마을들이 한 세대 동안 써먹을 말로. 그사이 ‘눈’은 비탈을 올라가 어린 소나무 하나를 골라, 빌린 도끼로 베어서는, 도낏날을 옆으로 뉘어 모나게 깎고 있다.'
	),
	Y(['What’s that.'], ['기건 뭐네.']),
	eye(['Axle, sir. Pine’s soft. It’ll get her to Pyongyang and not a step further.'], ['굴대입네다, 장군님. 소나무는 무릅네다. 마님을 평양까지는 모셔다 드리고, 한 발짝도 더는 못 갑네다.']),
	Y(['…Is it straight?'], ['…곧긴 하네?']),
	eye(['No, sir. It’s leaning. It’ll hold.'], ['아닙네다, 장군님. 기대 있습네다. 버팁네다.']),
	p(
		'Yeon doesn’t get the plumb line out. That night in the cart, with the lamp low, his wife asks him the question she has been saving since the fortress.',
		'연은 다림줄을 꺼내지 않는다. 그날 밤 수레 안, 등잔불을 낮춘 채, 아내가 성을 떠날 때부터 아껴 둔 질문을 한다.'
	),
	W(['Your father said half. Will you say half?'], ['아버님이 반만 말하라 하셨죠. 반만 말할 거예요?']),
	Y(['…No.'], ['…아니.']),
	W(
		['Then come home before they find a reason.', 'And don’t give him a poem for a name. Something he can carry.'],
		['그럼 그 사람들이 핑계를 찾기 전에 돌아와요.', '그리고 아기 이름에 시 같은 거 넣지 마요. 아이가 지고 다닐 수 있는 걸로.']
	),
	p(
		'Gulgul is asleep against her, as usual. In his sleep he says the one word of Goguryeo he owns.',
		'걸걸은 여느 때처럼 그녀에게 기대 잠들어 있다. 잠결에 자기가 가진 고구려 말 한 마디를 한다.'
	),
	gulgul(['…Cold.'], ['…춥네.']),
	W(['I know, little one. Me too.'], ['알아, 아가. 나도.']),

	scene('The Last Ridge', '마지막 고개'),
	p(
		'On the thirty-second day they come over the last ridge, and below them is the Taedong, wide and brown with the thaw, and on it Pyongyang: walls inside walls, smoke from ten thousand roofs, and a red two-tier gate you can see from a day away.',
		'서른이틀째, 마지막 고개를 넘자 발아래 대동강이 보인다. 해빙에 넓고 누렇게 불었다. 그 위에 평양이 있다. 성안에 또 성, 만 개 지붕에서 오르는 연기, 하루 거리에서도 보이는 붉은 이층 문루.'
	),
	p(
		'On the road below, the capital has heard the Eastern banner is coming. Some people have come out to cheer. Some have come out to look. From up here you can’t tell which is which, and that, Yeon decides, is Pyongyang all over.',
		'아래 길에서는 도읍 사람들이 동부 깃발이 온다는 소식을 들었다. 환호하러 나온 이도 있고, 구경하러 나온 이도 있다. 여기서는 어느 쪽이 어느 쪽인지 알 수가 없다. 연은 그게 바로 평양이라고 생각한다.'
	),
	Y(
		['Eye. You walk the cart to the old house. Then come to the palace yard and hold the horses.'],
		['눈. 수레 몰고 옛집까지 가라. 기러고 궁 마당으로 와서 말 잡고 있으라우.']
	),
	eye(['Aye, sir. Which yard, sir?'], ['예, 장군님. 어느 마당입네까?']),
	Y(['The one with a wall in it. You’ll find something wrong with it.'], ['담 있는 마당. 거기서 뭐든 틀린 걸 찾아낼 기야.']),
	p(
		'Yeon’s wife pulls the flap back and looks at the city for a long time, one hand on her belly, the other on the Mohe boy’s head. Then she lets it fall.',
		'연의 아내가 덮개를 젖히고 한참 도시를 본다. 한 손은 배 위에, 한 손은 말갈 아이 머리 위에. 그러고는 덮개를 내린다.'
	),
	p(
		'<b>He promised his father half. Tomorrow, five roofs and a king find out what half sounds like…!</b>',
		'<b>그는 아버지에게 반만 하겠다고 약속했다. 내일, 지붕 다섯과 임금 하나가 그 반이 어떤 소리인지 듣게 된다…!</b>'
	)
];

if (!entry('Five Tribes')) {
	const summit = entry('High Summit');
	const at = samhan.entries.indexOf(summit);
	samhan.entries.splice(at, 0, {
		year: '634',
		tone: 'road movie in the thaw',
		subtitle: '오부',
		logline: {
			en: 'A month of road, a wife seven months gone, and five roofs that each think they hold up the house.',
			ko: '한 달의 길, 일곱 달 된 아내, 그리고 저마다 집을 떠받친다고 믿는 지붕 다섯.'
		},
		badges: ['flag:goguryeo', '🐂'],
		music: summit.music,
		title: 'Five Tribes',
		place: 'chek_fort',
		weather: 'snow',
		blocks: BLOCKS,
		images: []
	});
	console.log('inserted Five Tribes before High Summit');
}

// Commander Yeon now hands off to the road, not the Summit.
{
	const cy = entry('Commander Yeon');
	const last = cy.blocks.at(-1);
	if (last.html.includes('room full of men counting grain')) {
		last.html =
			'<b>He promised his father half. First there is a month of road, a wife seven months gone, and five roofs to explain to a boy who doesn’t speak the language…!</b>';
		last.ko = '<b>아버지께 반만 하겠다고 했다. 그 전에 한 달 길이 있고, 일곱 달 된 아내가 있고, 말도 안 통하는 아이에게 설명해야 할 지붕 다섯이 있다…!</b>';
		console.log('Commander Yeon card → Five Tribes');
	}
}

// High Summit: the soldier with the wandering eye is the East's, and is given to the West at dusk.
{
	const hs = entry('High Summit');
	const B = hs.blocks;

	const stirrup = findIdx(B, 'At his stirrup walks a junior warrior of twenty-four');
	if (stirrup >= 0) {
		B.splice(stirrup, 1);
		console.log('High Summit: removed the West’s stirrup line');
	}

	const east = B[findIdx(B, 'Yeon comes last, in his father’s place')];
	if (!east.html.includes('old house')) {
		east.html = east.html.replace('with Dosuryu and six riders.', 'with Dosuryu and six riders. The cart has gone on to the old house.');
		east.ko = east.ko.replace('도수류와 기병 여섯을 데리고 온다.', '도수류와 기병 여섯을 데리고 온다. 수레는 옛집으로 먼저 갔다.');
	}

	const laid = findIdx(B, 'Me, sir.');
	if (laid >= 0 && !text(B[laid + 1]).includes('Of course it was')) {
		B.splice(laid + 1, 0, say('gesomun', ['…Of course it was.'], ['…기렇갔디.']));
	}

	const which = B[findIdx(B, 'Which one of those is looking at me?')];
	if (which) {
		which.en = ['Which one’s looking at me today?'];
		which.lines = ['오늘은 어느 눈으로 날 보고 있네?'];
	}

	const limp = B[findIdx(B, 'Yeon goes in limping slightly')];
	if (!limp.html.includes('for a month')) {
		limp.html =
			'Yeon goes in limping slightly, with a face that dares anyone to ask. The soldier goes back to the horses. Yeon never forgets an insult. He has walked beside this man for a month without asking his name, and he won’t think to ask again for eleven years.';
		limp.ko =
			'연은 아무도 묻지 못하게 하는 얼굴로, 살짝 절며 들어간다. 병사는 말들에게 돌아간다. 연은 모욕이라면 하나도 잊지 않는 사람이다. 그런데 한 달을 나란히 걸어온 이 사내의 이름은 끝내 묻지 않았고, 열한 해 동안 다시 물을 생각을 못 한다.';
	}

	const late = findIdx(B, 'Then we’re two hundred years late. Get the horses.');
	if (late >= 0 && !text(B[late + 1]).includes('Give him to the West')) {
		B.splice(
			late + 1,
			0,
			say('gesomun', ['And Eye. The one holding our horses. Give him to the West.'], ['기리고 ‘눈’. 우리 말 잡고 있는 놈. 서부에 줘 버리라.']),
			say('dosuryu', ['Give him? He’s ours. He walked your wife here.'], ['줘? 우리 사람이야. 네 마누라를 여기까지 모셔 왔어.']),
			say(
				'gesomun',
				['Every ka keeps his own men. Mine are mine to give.', 'The West is short of men who argue with string. He can argue with the Liao.'],
				['대가마다 제 사람은 제가 둔다. 내 사람은 내가 준다.', '서부엔 다림줄하고 싸울 놈이 모자라. 가서 요하하고 싸우라 하라우.']
			)
		);
	}

	const road = B[findIdx(B, 'The junior warrior with the wandering eye rides at the Western Commander')];
	if (!road.html.includes('gave him away')) {
		road.html =
			'The junior warrior with the wandering eye rides at the Western Commander’s stirrup now. The East gave him away in the palace yard, the way you’d give away a dog that bites the right people. He held the horses by the gate all afternoon. He saw the man from the East come out early, take his sword off the rack and look at nobody.';
		road.ko =
			'한쪽 눈이 제멋대로 도는 그 말단 무사가 이제 서부 대가의 등자 곁에 따른다. 동부가 궁 마당에서 그를 줘 버렸다. 물어야 할 놈을 무는 개를 남에게 주듯이. 그는 오후 내내 대문 곁에서 말을 붙들고 있었다. 동쪽에서 온 사내가 일찍 나와 시렁에서 제 칼을 집어 들고, 아무도 보지 않고 가는 것도 보았다.';
	}

	const mad = B[findIdx(B, 'He kicked my stone this morning')];
	if (mad) {
		mad.en = ['Sir. The one from the East…', 'I walked beside his cart a month. This morning he kicked my stone. It didn’t move.', 'Is he mad?'];
		mad.lines = ['장군님. 그 동쪽 분 말입네다…', '한 달을 그분 수레 옆에서 걸었습네다. 오늘 아침엔 제 돌을 걷어찼고요. 꿈쩍도 안 했디요.', '미친 겁네까?'];
	}

	const westImg = hs.images.find((im) => im.id === 'scenes-yeon-gate-west');
	if (westImg) westImg.at = 'rides at the Western Commander’s stirrup now';
}

// Ansi remembers the horses, not "his commander's horse".
{
	const ansiCh = chapters.find((c) => c.id === 'seventh-invasion');
	const ansi = ansiCh.entries.find((e) => e.title === 'Ansi');
	const fb = ansi.blocks.find((b) => b.kind === 'flashback' && String(b.year) === '634');
	const first = fb?.blocks[0];
	if (first?.html.includes('held his commander’s horse')) {
		first.html = first.html.replace('held his commander’s horse', 'held the horses');
		first.ko = first.ko.replace('제 장군의 말고삐를 잡고 있었다', '말고삐를 잡고 있었다');
		console.log('Ansi flashback: held the horses');
	}
}

fs.writeFileSync(FILE, JSON.stringify(chapters, null, '\t') + '\n');
console.log('done');
