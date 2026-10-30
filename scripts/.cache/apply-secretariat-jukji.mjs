// Royal Secretariat: open on Unsang/Dosal + Jukji under Yushin; Chunchu courts
// him; Jukjuk is the hidden brother (True Bone, yellow sleeve at Daeya).
// Mystery-box the Jukjuk episode. Rerun-safe.
import { openStory, p, text, guard } from './story-edit.mjs';

const { entry, say, save, chipFor } = openStory();

const scene = (label, ko, extra = {}) => ({ kind: 'scene', label, ko, ...extra });
const section = (label, ko) => ({ kind: 'section', label, ko });
const hw = (person, lines, en) => ({
	kind: 'dialogue',
	person,
	look: 'hwarang',
	chip: chipFor(person),
	lines,
	en
});
const nam = (speaker, lines, en, extra = {}) => ({
	kind: 'dialogue',
	speaker,
	gender: extra.gender ?? 'm',
	chip: extra.chip ?? '#8d8d95',
	lines,
	en
});

function walkMut(blocks, fn) {
	for (const b of blocks ?? []) {
		fn(b);
		if (b.blocks) walkMut(b.blocks, fn);
	}
}

function replacePair(b, enFrom, enTo, koFrom, koTo) {
	if (b.html === enFrom) b.html = enTo;
	if (b.ko === koFrom) b.ko = koTo;
	if (b.en) b.en = b.en.map((x) => (x === enFrom ? enTo : x));
	if (b.lines) b.lines = b.lines.map((x) => (x === koFrom ? koTo : x));
}

/* ── Jukjuk episode: hide brother / True Bone ── */
const jj = entry('Jukjuk');
walkMut(jj.blocks, (b) => {
	replacePair(
		b,
		'His wife comes out with a letter. Their eldest is twenty-two, in the Hwarang yard at Surabol, and writes the way he does everything: small, exact, and far too much.',
		'His mother comes out with a letter. From the Hwarang yard at Surabol. Twenty-two, and he writes the way he does everything: small, exact, and far too much.',
		'아내가 편지를 들고 나온다. 맏아들은 스물둘, 서라벌 화랑 연무장에 있다. 무슨 일이든 하는 식대로 편지를 쓴다. 잘게, 정확하게, 그리고 너무 길게.',
		'어머니가 편지를 들고 나온다. 서라벌 화랑 연무장에서 온 것이다. 스물둘. 무슨 일이든 하는 식대로 편지를 쓴다. 잘게, 정확하게, 그리고 너무 길게.'
	);
	replacePair(
		b,
		'Be kind to him. He’s our boy’s age.',
		'Be kind to him. He’s Jukji’s age.',
		'잘해 주소. 우리 아 또래 아입니꺼.',
		'잘해 주소. 죽지 또래 아입니꺼.'
	);
	replacePair(
		b,
		'The cart goes up the river road at midnight: his wife, the two youngest, and a joint of bamboo wrapped in a skirt. He doesn’t watch it go. He has a wall to look at.',
		'The cart goes up the river road at midnight: his mother, the two youngest, and a joint of bamboo wrapped in a skirt. He doesn’t watch it go. He has a wall to look at.',
		'한밤중에 수레가 강 위 길로 올라간다. 아내와 막내 둘, 그리고 치마에 싼 대나무 한 마디. 그는 떠나는 걸 지켜보지 않는다. 지켜볼 성벽이 있다.',
		'한밤중에 수레가 강 위 길로 올라간다. 어머니와 막내 둘, 그리고 치마에 싼 대나무 한 마디. 그는 떠나는 걸 지켜보지 않는다. 지켜볼 성벽이 있다.'
	);
	replacePair(
		b,
		'They made your father a geupchan.',
		'They made him a geupchan.',
		'너거 아부지 급찬 됐다 카더라.',
		'그분 급찬 됐다 카더라.'
	);
	replacePair(
		b,
		'They plant it that week behind a small house in Surabol, and it takes. Jukji will spend his life learning the other half of what bamboo does, which is bend. His father would have hated it. It will hold up a kingdom.',
		'They plant it that week behind a small house in Surabol, and it takes. Jukji will spend his life learning the other half of what bamboo does, which is bend. The grove would have hated it. It will hold up a kingdom.',
		'그 주에 서라벌의 작은 집 뒤에 그것을 심는다. 뿌리를 내린다. 죽지는 평생 대나무가 하는 나머지 반쪽을 배우며 살게 된다. 휘는 법이다. 아버지라면 질색했을 것이다. 그 휘는 법이 나라 하나를 떠받친다.',
		'그 주에 서라벌의 작은 집 뒤에 그것을 심는다. 뿌리를 내린다. 죽지는 평생 대나무가 하는 나머지 반쪽을 배우며 살게 된다. 휘는 법이다. 그 대숲이라면 질색했을 것이다. 그 휘는 법이 나라 하나를 떠받친다.'
	);
});

/* ── Royal Secretariat ── */
const sec = entry('Royal Secretariat');
guard(sec, 'The hill under Dosal is quiet');

const bamboo = sec.blocks.find((b) => b.kind === 'flashback' && /Bamboo/i.test(b.title ?? ''));

const opening = [
	p(
		'The hill under Dosal is quiet. The man who made it quiet is already writing the report.',
		'도살 아래 언덕이 고요하다. 고요하게 만든 사람은 이미 보고서를 쓰고 있다.'
	),
	section('Dosalseong', '도살성'),
	scene('The Seven Forts', '일곱 성', {
		jump: { year: 649, en: 'Two Winters Earlier…', ko: '이년 전…' }
	}),
	p(
		'Unsang has seven forts by the tenth morning. Seokto is one of them. He is a Baekje general, and he is good at taking things.',
		'은상은 열흘째 되는 아침에 일곱 성을 가지고 있다. 석토가 그 중 하나다. 백제 장군이다. 빼앗는 일에는 능하다.'
	),
	p(
		'Yushin camps under Dosal and does not come out. He needs a rumour. He looks at the man with the brush.',
		'유신은 도살 아래 진을 치고 나오지 않는다. 소문이 필요하다. 붓을 든 사람을 본다.'
	),
	say(
		'yushin',
		['적게. 우리 쪽이 두 배라고.', '그가 믿을 때까지.'],
		['Write that we have twice what we have.', 'Until he believes it.']
	),
	hw('jukji', ['몇 배로 쓸까요, 장군.'], ['How many times, sir.']),
	say('yushin', ['믿을 때까지다.'], ['Until he believes it.']),
	p(
		'Jukji writes it as a count. Dust. Horses. A number that is not true and looks like it slept in a ledger. A scout takes it over the ridge as if it were bread.',
		'죽지는 숫자로 쓴다. 먼지. 말. 거짓인데 장부에서 하룻밤 잔 것처럼 보이는 수. 정찰병이 떡 심부름하듯 고개 너머로 가져간다.'
	),
	scene('The Dust', '먼지'),
	p(
		'Unsang sits his horse on the ridge. The seven forts are behind him, small, yellow banners on real stone. The dust in front of him does not stop.',
		'은상은 능선 위에 말을 세운다. 일곱 성은 등 뒤다. 작고, 노란 깃발이 진짜 돌 위에 있다. 앞의 먼지는 멈추지 않는다.'
	),
	nam('A scout', ['끊기질 않소. 끝이 안 보이오.'], ['It doesn’t stop. There’s no end to it.']),
	say('unsang', ['몇이냐.'], ['How many.']),
	nam('A scout', ['세다가 말았소.'], ['I stopped counting.']),
	say(
		'unsang',
		['그러면 가진 일곱을 지키겠소.', '내일 보자.'],
		['Then we keep the seven we have.', 'Tomorrow.']
	),
	p(
		'He turns the horse. Tomorrow the seven are Silla’s again. You would think a general who can take a hill could sit on a rumour. He could not.',
		'말을 돌린다. 내일 일곱 성은 다시 신라 것이다. 언덕을 빼앗는 장군이 소문 하나에는 앉을 수 있을 거라고 생각하겠지. 못 했다.'
	),
	scene('The Report', '보고서'),
	p(
		'The hill is quiet. Jukji is already on the second sheet. He has not looked up. Coral-red sleeves, green at the throat, the little gold moon on his brow. A Hwarang who fights with a count.',
		'언덕이 고요하다. 죽지는 이미 두 번째 장이다. 고개를 들지 않는다. 산호빛 소매, 목의 녹색, 이마의 작은 금달. 숫자로 싸우는 화랑이다.'
	),
	say('yushin', ['이름.'], ['Name.']),
	hw('jukji', ['죽지입니다.'], ['Jukji, sir.']),
	say('yushin', ['그 숫자, 서라벌로 보내.'], ['That number. Send it to Surabol.']),
	p(
		'He sends the true one too. Yushin does not tell him to. Some men need both.',
		'진짜 숫자도 보낸다. 유신이 시키지는 않았다. 어떤 사람은 둘 다 있어야 한다.'
	),
	section('The Name', '이름'),
	scene('Surabol', '서라벌'),
	p(
		'Chunchu reads the two numbers in the same sitting. He keeps the false one. He asks about the hand.',
		'춘추는 숫자 둘을 한자리에 앉아서 읽는다. 거짓인 쪽을 남긴다. 글씨를 묻는다.'
	),
	say('chunchu', ['법민아. 이 손, 누구냐.'], ['Bupmin. Whose hand is this.']),
	hw(
		'munmu',
		['연무장 친구입니다, 아버님.', '활쏘기로 저를 한 번 이기더니, 왜 이겼는지 적어 두더군요.', '도살에 있었습니다.'],
		[
			'A friend from the yard, Father.',
			'He beat me at archery once, and then wrote down why.',
			'He was at Dosal.'
		]
	),
	say('chunchu', ['데려오너라.'], ['Bring him.']),
	p(
		'He does not offer a chair. He offers a petition that has been circling the Council since spring, and a brush.',
		'자리를 내주지는 않는다. 봄부터 화백을 돌고 있는 청원서 하나와 붓을 내민다.'
	),
	scene('The Yard', '연무장'),
	p(
		'They meet in the Hwarang yard because Jukji will not come to the house. Bupmin waits at the post and pretends he is not listening.',
		'죽지가 집으로 오지 않아서, 화랑 연무장에서 만난다. 법민은 기둥 곁에서 안 듣는 척한다.'
	),
	say(
		'chunchu',
		['도살에서 쓴 숫자, 봤네.', '거짓인 쪽이 더 쓸모 있더군.'],
		['I saw the number you wrote at Dosal.', 'The false one was more useful.']
	),
	hw('jukji', ['장군이 쓰라 하셨습니다.'], ['The marshal told me to write it.']),
	say(
		'chunchu',
		['장군은 쓰라고만 하지.', '몇 배로 쓸지는 자네가 정했을 텐데.'],
		['The marshal only says write it.', 'How many times — that was you.']
	),
	p(
		'Jukji looks at the petition as if it might bite. He does not take the brush.',
		'죽지는 청원서를, 물릴지도 모른다는 얼굴로 본다. 붓은 받지 않는다.'
	),
	say(
		'chunchu',
		['이 나라 돌아가는 속도가 마음에 드나.', '화백이 봄부터 이걸 돌리고 있네. 성 하나가 기다린다.'],
		['Do you like the speed of this country.', 'The Council has been walking this since spring. A fort is waiting.']
	),
	hw(
		'jukji',
		['신라가 언제부터 백성을 아꼈습니까.', '성이야 늘 기다리지요. 기다리는 쪽이 누구냐가 문제입니다.'],
		['Since when did Silla care about its people.', 'Forts always wait. The question is who they wait for.']
	),
	p(
		'Bupmin looks at his father. His father does not look back. He has heard worse from men he liked less.',
		'법민이 아버지를 본다. 아버지는 보지 않는다. 덜 좋아하는 사람에게서 더 심한 말도 들었다.'
	),
	say('chunchu', ['내일 또 오르게.', '이 장, 밤에 읽어 두게.'], ['Come again tomorrow.', 'Read this tonight.']),
	p(
		'Jukji takes the petition because refusing a paper is harder than refusing a man. He reads it. He writes in the margin, small, exact, and far too much.',
		'종이를 거절하는 일이 사람을 거절하는 일보다 어려워서, 죽지는 청원서를 받는다. 읽는다. 난외에 쓴다. 잘게, 정확하게, 그리고 너무 길게.'
	),
	scene('The Margin', '난외'),
	p(
		'Chunchu keeps sending papers. Jukji keeps sending them back with the country improved in the margin and the man unconvinced in the hall. This goes on long enough that Bupmin starts leaving food.',
		'춘추는 계속 종이를 보낸다. 죽지는 계속 난외를 고쳐서 돌려보낸다. 나라는 난외에서 나아지고, 사람은 마루에서 설득되지 않는다. 법민이 밥을 놓아 두기 시작할 만큼 오래 간다.'
	),
	hw('munmu', ['밥은 먹고 달래.'], ['Eat, at least.']),
	hw('jukji', ['네가 남긴 거지.'], ['You left it.']),
	hw('munmu', ['아버지가 남기라고 했어.'], ['Father said leave it.']),
	hw('jukji', ['…그래.'], ['…Fine.']),
	p(
		'On the fifth visit Chunchu comes himself, after rain, and walks Jukji as far as the bamboo behind the small house. He still has not said the word Premier. Jukji still has not asked.',
		'다섯 번째에 춘추가 직접 온다. 비 온 뒤다. 작은 집 뒤 대숲까지 죽지를 배웅한다. 아직 중시라는 말은 하지 않았다. 죽지도 아직 묻지 않았다.'
	),
	say(
		'chunchu',
		['자네가 쓰면, 성이 기다리지 않네.', '화백이 목을 가다듬기 전에 말이네.'],
		['When you write it, the fort does not wait.', 'Before the Council clears its throat.']
	),
	hw(
		'jukji',
		['속도를 높이면 누가 먼저 죽습니까.', '성 안의 사람입니까. 성 밖의 사람입니까.'],
		['If you make it faster, who dies first.', 'The people inside the wall. Or the people you sent.']
	),
	p(
		'The bamboo ticks. One joint, then another, the way it does when someone is about to say a name they have been carrying.',
		'대나무가 톡, 한다. 마디 하나, 또 하나. 품고 있던 이름을 말하려는 사람이 있을 때 나는 소리다.'
	),
	scene('The Wall', '성벽'),
	hw(
		'jukji',
		[
			'형님이 대야에 있었습니다.',
			'노란 소매였습니다. 낮은 자리입니다. 원래 그런 성을 지키는 사람들은 제일 낮은 사람들입니다.'
		],
		[
			'My brother was at Daeya.',
			'Yellow sleeve. A low post. The men who hold a wall like that are supposed to be the lowest.'
		]
	),
	hw(
		'jukji',
		[
			'형님은 진골이었습니다.',
			'아무도 모르게 그 소매를 입었습니다. 거기가 끝이라고, 그래서 갔습니다.',
			'이름도 안 밝혔습니다. 죽은 다음에야.'
		],
		[
			'He was True Bone.',
			'He wore that sleeve so nobody would know. He said the border was the real duty. So he went.',
			'He never gave the house. Not until he was dead.'
		]
	)
];

if (bamboo) opening.push(bamboo);

opening.push(
	p(
		'Jukji was not there. He was in Surabol, copying a tax roll. He still writes a name at the top of every new ledger, then crosses it out, then starts.',
		'죽지는 거기 없었다. 서라벌에서 세금 장부를 베끼고 있었다. 그는 지금도 새 장부를 펼 때마다 맨 위에 이름을 하나 쓰고, 지우고, 그다음에 시작한다.'
	),
	hw(
		'jukji',
		[
			'그 문, 품석이 열었습니다.',
			'품석을 그 자리에 앉힌 사람이 나리 아닙니까.',
			'신라가 언제부터 백성을 아꼈습니까. 그때도 안 아꼈습니다.'
		],
		[
			'Pumsuk opened that gate.',
			'The man who sat him there was you.',
			'Since when did Silla care about its people. It didn’t then either.'
		]
	),
	p(
		'Chunchu does not deny it. He has been denying other things for nine years. This one he will not.',
		'춘추는 부인하지 않는다. 구 년 동안 다른 것들은 부인했다. 이건 안 한다.'
	),
	say(
		'chunchu',
		['나도 거기서 한 조각을 두고 왔네.', '그래서 고치려는 걸세. 이 나라를.', '자네가 그 붓이면 좋겠네.'],
		[
			'I left a piece of mine there too.',
			'That is why I want this country mended.',
			'I would like that brush to be yours.'
		]
	),
	p(
		'He does not say which piece. You already know. Jukji looks at the bamboo, which is bending in the wet, and does not say yes. He takes the next petition.',
		'어느 조각인지는 말하지 않는다. 자네는 이미 안다. 죽지는 비에 휘는 대나무를 보고, 예라고 하지 않는다. 다음 청원서를 받는다.'
	),
	p(
		'That is how a master finds an apprentice. Not with a robe. With a margin they both hate to leave empty.',
		'스승이 제자를 얻는 법이 그렇다. 도포가 아니다. 둘 다 빈칸으로 두기 싫어하는 난외다.'
	)
);

sec.blocks.unshift(...opening);

/* Strip the old father / find-him stretch; keep You. Stay. */
const cutStart = sec.blocks.findIndex((b) => (b.html ?? '').includes('Jukji’s father wore yellow'));
const stayAt = sec.blocks.findIndex((b) => (b.en ?? []).includes('You. Stay.'));
if (cutStart >= 0 && stayAt > cutStart) {
	sec.blocks.splice(cutStart, stayAt - cutStart);
}

walkMut(sec.blocks, (b) => {
	replacePair(
		b,
		'The ship from the West coast comes in with its banners lowered. By the time the letter reaches Chunchu’s house, half the Council is already there, wearing its mourning face. Bupmin has brought a friend from the yard. Nobody asks why.',
		'The ship from the West coast comes in with its banners lowered. By the time the letter reaches Chunchu’s house, half the Council is already there, wearing its mourning face. Bupmin has brought Jukji. Nobody asks why. Chunchu already knows why.',
		'서국 쪽 바다에서 오는 배가 깃발을 내린 채 들어온다. 편지가 춘추의 집에 닿을 즈음엔 화백의 절반이 벌써 와서 상주 같은 얼굴을 하고 있다. 법민은 연무장 친구 하나를 데려왔다. 왜 데려왔는지 묻는 사람은 없다.',
		'서국 쪽 바다에서 오는 배가 깃발을 내린 채 들어온다. 편지가 춘추의 집에 닿을 즈음엔 화백의 절반이 벌써 와서 상주 같은 얼굴을 하고 있다. 법민은 죽지를 데려왔다. 왜 데려왔는지 묻는 사람은 없다. 춘추는 이미 안다.'
	);
	replacePair(
		b,
		'Nobody else in the room feels like a winner. Yushin studies the table. Alchun studies Yushin. At the back, Bupmin’s friend leans over to him and says something that was not meant for anyone else.',
		'Nobody else in the room feels like a winner. Yushin studies the table. Alchun studies Yushin. At the back, Jukji leans over to Bupmin and says something that was not meant for anyone else.',
		'방 안의 누구도 이긴 기분이 아니다. 유신은 탁자를 본다. 알천은 유신을 본다. 뒤쪽에서 법민의 친구가 법민에게 몸을 기울이고, 다른 사람 들으라고 한 게 아닌 말을 한다.',
		'방 안의 누구도 이긴 기분이 아니다. 유신은 탁자를 본다. 알천은 유신을 본다. 뒤쪽에서 죽지가 법민에게 몸을 기울이고, 다른 사람 들으라고 한 게 아닌 말을 한다.'
	);
});

/* Looks: hwarang until the scarecrow robe, premier after. */
let premier = false;
walkMut(sec.blocks, (b) => {
	const blob = text(b);
	if (blob.includes('like a scarecrow somebody has promoted') || blob.includes('Try it on')) {
		premier = true;
	}
	if (b.kind === 'dialogue' && b.person === 'jukji') {
		b.look = premier ? 'premier' : 'hwarang';
	}
	if (b.kind === 'dialogue' && b.person === 'munmu') {
		b.look ??= 'hwarang';
	}
});

save();
console.log('secretariat + jukjuk applied');
