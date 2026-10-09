// Rewrite pass for #10–#20 (The Five Principles). Run once; each episode is guarded by a marker.
import { editStory, textOf } from '../story-ops.mjs';

const CHIP = {
	yushin: '#4a8fe0', munmu: '#3fa9c9', chunchu: '#D8258C', munhee: '#e07fa8', gotaso: '#F0A3C0',
	pumsuk: '#7aa8d8', sunduk: '#E8552B', gesomun: '#d0362f', namseng: '#c25a4e', namgun: '#9e3b32',
	dosuryu: '#c98578', gusesa: '#b2554a', euija: '#e08a2e', gyebek: '#8a6f3f', yunchung: '#c9932a'
};
const P = (html, ko) => ({ kind: 'p', html, ko });
const D = (person, en, ko) => ({ kind: 'dialogue', chip: CHIP[person], person, lines: ko, en });
const S = (speaker, chip, en, ko) => ({ kind: 'dialogue', speaker, chip, lines: ko, en });
const SC = (label, ko) => ({ kind: 'scene', label, ko });

function tools(e) {
	const pick = (frag, kind) => {
		const hits = e.blocks.filter((b) => (!kind || b.kind === kind) && textOf(b).includes(frag));
		if (hits.length !== 1) throw new Error(`${e.title}: "${frag}" has ${hits.length} hits`);
		return hits[0];
	};
	const at = (id, frag) => {
		const im = (e.images ?? []).find((i) => i.id === id);
		if (!im) throw new Error(`${e.title}: no image ${id}`);
		im.at = frag;
	};
	return { pick, at };
}

function episode(n, marker, fn) {
	editStory((story) => {
		const e = story.flatMap((c) => c.entries)[n - 1];
		if (e.blocks.some((b) => b.kind === 'p' && b.html === marker)) {
			console.log(`#${n} already done`);
			return false;
		}
		fn(e, tools(e));
		console.log(`#${n} ${e.title} patched`);
	});
}

// ───────────────────────── #10 Bupmin
const F10 = 'Fifteen is old enough for the headband. It is not old enough to invent a country, though Bupmin keeps trying.';
episode(10, F10, (e, { pick, at }) => {
	const yard = pick('does not soften the yard');
	yard.html = yard.html.replace('He took forty fortresses.', 'He sleeps in his armour.');
	yard.ko = yard.ko.replace('성 마흔 개를 떨어뜨렸다더라.', '갑옷을 입은 채 잔다더라.');
	const sixLine = pick('I said that when I was six.');
	sixLine.en = ['Uncle—', 'Father said it on the hill. I only said it louder. I was six.'];
	sixLine.lines = ['외숙부—', '아버지가 언덕에서 하신 말이에요. 저는 더 크게 말했을 뿐이고요. 여섯 살 때.'];
	const west = pick('Fortress of Radiance');
	west.en = ['West of here is Baekje.', 'Learn a landscape before it learns your name.'];
	west.lines = ['여기서 서쪽이 백제다.', '땅이 자네 이름을 익히기 전에, 자네가 먼저 그 땅을 익히게.'];
	const eaves = pick('At dusk he gathers the flower youth');
	eaves.html =
		'At dusk he gathers the flower youth under the eaves and speaks the <b>Five Principles</b>, the way other houses recite ancestors. A monk wrote them for boys who would never be monks. Loyalty to the king comes first, so nobody can say they missed it. Duty to your father is easy, until the king and your father want different things. The boys elbow each other at <i>no retreat</i>. They go quiet at <i>no needless killing</i>. Boys skip that one. Old soldiers don’t. Each of them is privately certain the Marshal is looking at him. He is looking at all of them.';
	eaves.ko =
		'해 질 녘 그는 처마 아래 꽃다운 소년들을 모으고, 다른 집이 조상을 외듯 <b>세속오계</b>를 왼다. 중이 될 리 없는 아이들을 위해 중 하나가 지은 계율이다. 임금에 대한 충성이 맨 앞이다. 못 들었다는 소리는 못 하게. 부모에 대한 효는 쉽다. 임금과 아버지가 서로 다른 걸 원하기 전까지는. 소년들은 <i>임전무퇴</i>에서 서로 팔꿈치를 찌른다. <i>살생유택</i>에서는 조용해진다. 아이들은 그 계율을 건너뛴다. 늙은 군인들은 안 그런다. 저마다 장군이 바로 자기를 보고 있다고 남몰래 확신한다. 장군은 그들 모두를 보고 있다.';
	const answer = pick('…Retreat.');
	answer.en = ['…No retreat.', 'I always pull up first. At the pine, today. Every time she rides too fast.', 'I’d rather know it now than find out on a field.'];
	answer.lines = ['…임전무퇴요.', '저는 늘 먼저 고삐를 당겨요. 오늘도 소나무에서요. 누님이 너무 빨리 달릴 때마다요.', '들판에서 알게 되느니, 지금 아는 게 나아요.'];
	const good = pick('Then see the country the');
	good.en = ['Good. Most boys lie.', 'Then see the country the way a Hwarang sees a field: who holds, who falters, who dies for a vow he meant.', 'Tomorrow you ride the pine again. Beside her.'];
	good.lines = ['좋네. 대개는 거짓말을 하거든.', '그럼 화랑이 들판을 보듯 나라를 보게. 누가 버티고, 누가 흔들리고, 누가 진심으로 한 맹세에 죽는지.', '내일 다시 소나무까지 달리게. 누님 옆에서.'];

	e.blocks = [
		pick('Flowering Youth', 'scene'),
		P(F10, '열다섯이면 머리띠를 맬 나이다. 나라를 발명할 나이는 아니다. 법민은 그래도 자꾸 해 본다.'),
		e.blocks.find((b) => b.kind === 'map'),
		pick('The Hwarang train under the Marshal'),
		P(
			'His father is in the Council chamber, collecting votes. His uncle keeps the yard, and the yard is where Bupmin lives now.',
			'아버지는 화백 회의실에서 표를 모으고 있다. 연무장은 외숙이 지킨다. 법민은 이제 그 연무장에서 산다.'
		),
		e.blocks.find((b) => b.kind === 'diagram'),
		yard,
		pick('crowd the fence of the yard'),
		pick('Gaya ironwood core'),
		pick('last season’s shaft'),
		SC('The Turn', '굽이'),
		P(
			'The practice road runs east along the river and bends hard at a split pine. That bend is where boys find out who they are. Gotaso is not supposed to ride it. Gotaso rides it.',
			'연습로는 강을 따라 동쪽으로 뻗다가 갈라진 소나무에서 확 꺾인다. 사내애들은 그 굽이에서 자기가 누군지 알게 된다. 고타소는 거기서 달리면 안 된다. 고타소는 달린다.'
		),
		D('gotaso', ['Bupmin. To the pine and back.', 'Loser carries the other one’s club box for a month.'], ['법민아. 소나무까지 갔다 오기.', '지는 사람이 한 달 동안 채 함 들기.']),
		D('munmu', ['You’re not allowed on the practice road.', '…Fine. One month.'], ['누님은 연습로에 나오면 안 되잖아요.', '…좋아요. 한 달.']),
		P(
			'They go off the line together. On the straight he is ahead. At the split pine the horse leans, the ground tilts, and his hands decide for him. He pulls up. Gotaso doesn’t. She takes the bend flat out, one stirrup empty, and comes back laughing with pine needles in her hair.',
			'둘이 함께 출발선을 박차고 나간다. 직선에서는 그가 앞선다. 갈라진 소나무에서 말이 기울고, 땅이 기울고, 그의 손이 먼저 정해 버린다. 그는 고삐를 당긴다. 고타소는 안 당긴다. 등자 하나가 빈 채로 굽이를 그대로 돌아 나오더니, 머리에 솔잎을 꽂고 깔깔 웃으며 돌아온다.'
		),
		P(
			'The girls at the fence cheer for her, which is worse than laughing. Yushin has watched from the pine the whole time. He does not cheer for anybody.',
			'울타리의 아가씨들이 그녀에게 환호한다. 웃음보다 더 아프다. 유신은 처음부터 소나무 곁에서 보고 있었다. 그는 누구에게도 환호하지 않는다.'
		),
		D('gotaso', ['Club box. A month.', 'And tell Uncle it was your idea.'], ['채 함. 한 달.', '그리고 외숙한테는 네가 하자고 했다고 해.']),
		pick('A king for all who cannot hold'),
		sixLine,
		pick('Then make it true at fifteen'),
		west,
		pick('Under the Eaves', 'scene'),
		eaves,
		pick('which one will you break first'),
		answer,
		P(
			'Nobody laughs. A few boys look down at their sandals. Every one of them has a pine of his own.',
			'아무도 웃지 않는다. 몇몇이 제 짚신을 내려다본다. 다들 저만의 소나무가 하나씩 있다.'
		),
		good,
		e.blocks.at(-1)
	];
	at('scene-hwarang-oxygen-2', 'crowd the fence of the yard');
	at('scene-bupmin-sing', '…No retreat.');
});

// ───────────────────────── #11 Sadaham
episode(11, '__sadaham_v2__', (e, { pick }) => {
	if (!e.blocks.some((b) => textOf(b).includes('Mimana office'))) return console.log('#11 already done');
	const fb = e.blocks.find((b) => b.kind === 'flashback' && b.blocks.some((x) => textOf(x).includes('No names. Two boys')));
	const stone = fb.blocks.find((x) => textOf(x).includes('No names. Two boys'));
	stone.html = 'No names. Two boys, before the yard even had a name, promised Heaven three years of books, and a war if the country wanted one. What became of them, the stone doesn’t say. Stones rarely do.';
	const drop = [pick('Mimana office', 'quote'), pick('The Harmony Council is the yard with better chairs')];
	e.blocks = e.blocks.filter((b) => !drop.includes(b));
});

// ───────────────────────── #12 Gotaso
episode(12, 'Two springs ago she proved it, and her father has not slept properly since.', (e, { pick }) => {
	const open = pick('It begins two springs earlier');
	open.html = 'Two springs ago she proved it, and her father has not slept properly since.';
	open.ko = '두 해 전 봄에 그 애가 그걸 증명했다. 그 뒤로 아버지는 잠을 제대로 자 본 적이 없다.';
	const market = pick('goes out to the lantern market');
	market.html = '<b>Gotaso</b> is fourteen. She goes out to the lantern market with two maids and does not come back with any. The maids are found first, by the river, in the morning.';
	market.ko = '<b>고타소</b>는 열네 살이다. 시녀 둘을 데리고 등 시장에 나갔다가, 아무도 없이 돌아오지 못한다. 시녀들이 먼저 발견된다. 강가에서, 아침에.';
	const before = pick('Before the wedding, there is a year');
	before.html = 'Before anyone says the word <i>wedding</i>, there is a spring match. Gotaso attends with two new guards, and her father watches her instead of the ball.';
	before.ko = '누가 <i>혼인</i>이라는 말을 꺼내기도 전에, 봄 격구가 있다. 고타소는 새 호위 둘을 달고 나오고, 아버지는 공 대신 딸을 본다.';
	const match = pick('the Hwarang ride for the Queen');
	match.html = match.html.replace('<b>Princess Gotaso (16)</b> is only meant to watch.', 'Gotaso is sixteen now, and only meant to watch.');
	match.ko = match.ko.replace('<b>고타소 (16)</b>는 보기만 하러 왔다.', '고타소는 이제 열여섯이고, 보기만 하러 왔다.');
	const box = pick('Look at that club box.');
	box.en = ['Look at that club box.', 'A Hwarang that young carrying that… you can see the household.'];
	box.lines = ['저 채 함 보렴.', '저 나이 화랑이 저런 걸 들고 나오면… 집안이 보여.'];
	const cut = pick('takes the ball on the off-side');
	cut.html = cut.html.replace('<b>Pumsuk (23)</b>', '<b>Pumsuk</b>');
	cut.ko = cut.ko.replace('<b>품석 (23)</b>', '<b>품석</b>');
	const knowing = pick('Knowing I shouldn’t.');
	knowing.en = ['…I don’t know.', 'Your father looked at me at the match. The way a man looks at a horse he may have to shoot.', 'I came anyway. Knowing I shouldn’t.'];
	knowing.lines = ['…모르겠습니다.', '경기 때 아버님께서 저를 보셨습니다. 쏘아야 할지도 모르는 말을 보듯이.', '그래도 왔습니다. 오면 안 되는 줄 알면서.'];

	const out = [];
	for (const b of e.blocks) {
		if (b.kind === 'monologue' || (b.kind === 'quote' && textOf(b).includes('brow-black'))) continue;
		out.push(b);
		if (b === pick('weather they have decided to live in'))
			out.push(
				D('sunduk', ['You are watching your daughter, Chunchu.', 'Your daughter is watching something else.'], ['자네는 딸을 보고 있군, 춘추.', '자네 딸은 다른 걸 보고 있고.']),
				D('chunchu', ['…I see it, Majesty.', 'I am choosing not to.'], ['…보입니다, 폐하.', '안 보기로 했을 뿐입니다.'])
			);
		if (b === knowing)
			out.push(
				D('gotaso', ['He looks at everyone like that now. Since the ford.', 'The others stopped coming. You came twice.'], ['아버지는 요즘 다들 그렇게 봐요. 그 나루 일 뒤로.', '다른 사람들은 다 안 왔어요. 당신은 두 번 왔고요.']),
				D(
					'pumsuk',
					['That cut at the match. The one the umpires argued over.', 'It was for you. I have never risked a foul in my life.', '…I would risk it again.'],
					['경기 때 그 컷 말입니다. 심판들이 다투던.', '아씨 보시라고 한 겁니다. 평생 반칙을 무릅써 본 적이 없습니다.', '…또 무릅쓰겠습니다.']
				)
			);
	}
	e.blocks = out;
});

// ───────────────────────── #13 Pumsuk
const F13 = 'Pumsuk asks for the girl. Chunchu asks for something else.';
episode(13, F13, (e, { pick, at }) => {
	const great = pick('watches her niece marry for love');
	great.html = 'At the back of the hall, the Queen watches her great-niece marry for love.';
	great.ko = '식장 뒤편에서, 여왕은 종손녀가 사랑하는 사람과 혼인하는 것을 지켜본다.';
	const fb = e.blocks.find((b) => b.kind === 'flashback');
	fb.year = 625;
	fb.blocks = fb.blocks.filter((x) => !textOf(x).includes('again the white'));
	const aunt = e.blocks.find((b) => b.kind === 'card' && b.person === 'chunmyung');
	aunt.caption = 'The Queen’s elder sister, and Chunchu’s mother. She gave up a throne to marry for love.';
	aunt.ko = '여왕의 언니이자 춘추의 어머니. 사랑을 위해 왕좌를 내려놓았다.';
	const cart = pick('The new couple move to');
	cart.html =
		'Three days later the couple leave for <b>Daeya Fortress</b>, where Pumsuk has just been named Guardian. She waves from the cart until the capital is out of sight; he rides beside the wheel the whole way. Daeya is a border post. Nobody at the wedding said the word <i>border</i> out loud.';
	cart.ko =
		'사흘 뒤 신혼부부는 품석이 막 도독으로 부임한 <b>대야성</b>으로 떠난다. 그녀는 서라벌이 보이지 않을 때까지 수레에서 손을 흔들고, 그는 내내 바퀴 옆에서 말을 몬다. 대야성은 국경의 성이다. 혼례에서 <i>국경</i>이라는 말을 입 밖에 낸 사람은 아무도 없었다.';

	const hallStart = e.blocks.indexOf(pick('The Empty Hall', 'scene'));
	const hallEnd = e.blocks.indexOf(pick('Neither of them mentions that night again.'));
	const nightStart = e.blocks.indexOf(pick('The Wedding Night', 'scene'));
	const card = e.blocks.at(-1);
	e.logline = { en: F13, ko: '품석은 딸을 청한다. 춘추는 다른 것을 청한다.' };

	e.blocks = [
		P(F13, '품석은 딸을 청한다. 춘추는 다른 것을 청한다.'),
		SC('The Study', '서재'),
		P(
			'Chunchu receives him in the study, not the hall. A go game sits half-played between them. Chunchu is wiping his hands on a cloth, slowly, both sides. He has not been doing anything to dirty them.',
			'춘추는 그를 대청이 아니라 서재에서 맞는다. 둘 사이에 바둑판이 반쯤 두어진 채 놓여 있다. 춘추는 천으로 손을 닦는다. 천천히, 앞뒤로. 손을 더럽힐 일은 아무것도 하지 않았는데.'
		),
		D('pumsuk', ['Sir. I— I have come about Lady Gotaso.', 'With your permission, I would like— that is, I would ask—'], ['대감. 저— 고타소 아씨 일로 왔습니다.', '허락해 주신다면, 제가— 그러니까, 청을 드리고자—']),
		D('chunchu', ['Sit. You’re making the stones nervous.', 'She told me at breakfast. Four children, all named. She is very thorough. She gets that from me.'], ['앉게. 바둑돌이 다 긴장하겠네.', '아침에 그 애가 말하더군. 아이 넷, 이름까지. 아주 꼼꼼해. 나를 닮아서.']),
		D('pumsuk', ['…Then you consent, sir?'], ['…그럼 허락하시는 겁니까, 대감?']),
		D(
			'chunchu',
			['I consent to the girl. She was never mine to keep.', 'Do you know what the yard teaches, Hwarang? Five rules.', 'Here is a sixth.'],
			['딸은 허락하네. 그 애는 애초에 내가 붙잡아 둘 수 있는 아이가 아니었어.', '화랑, 연무장에서 뭘 가르치는지 아나? 계율 다섯.', '여기 여섯째가 있네.']
		),
		P(
			'Munhee is in the doorway. She has been there the whole time. Pumsuk only notices now, which tells you something about Pumsuk.',
			'문희가 문간에 서 있다. 처음부터 거기 있었다. 품석은 이제야 알아챈다. 품석에 대해 꽤 많은 걸 말해 주는 대목이다.'
		),
		pick('Don’t make him swear.'),
		pick('…Why not.'),
		pick('If he keeps it, it was owed anyway'),
		pick('He makes him swear.'),
		pick('you know I’m going to kill you'),
		P(
			'He laughs. He puts the cloth down. Pumsuk has heard, the way all of Surabol has heard, about a certain ford. Nobody else in the room is laughing.',
			'그가 웃는다. 천을 내려놓는다. 품석도 들었다. 서라벌 사람이 다 들었듯, 어느 나루에서 있었던 일을. 방 안에서 웃는 사람은 그 하나뿐이다.'
		),
		pick('On my life, I will protect'),
		SC('The Wedding', '혼례'),
		great,
		e.blocks.find((b) => b.kind === 'wed'),
		fb,
		pick('Your son’s girl'),
		aunt,
		pick('If Your Majesty counts honestly'),
		pick('…I count honestly.'),
		pick('We will be happy forever'),
		...e.blocks.slice(nightStart, e.blocks.indexOf(pick('Behind the doors the feast falls away.')) + 1),
		...e.blocks.slice(hallStart, hallEnd + 1),
		SC('The Road to Daeya', '대야로 가는 길'),
		cart,
		e.blocks.find((b) => b.kind === 'place'),
		P('Her parents stand at the gate until the dust settles. Then a little longer.', '부모는 먼지가 가라앉을 때까지 대문에 서 있다. 그러고도 조금 더.'),
		D('chunchu', ['She waved the whole way. Like someone I know.'], ['끝까지 손을 흔드는군. 누굴 닮았는지.']),
		D('munhee', ['I never waved at you. I was busy sewing.'], ['난 당신한테 손 흔든 적 없어요. 바느질하느라 바빴거든요.']),
		D('chunchu', ['…So you do remember.'], ['…그럼 기억은 하는군.']),
		D('munhee', ['Don’t you start. Not at the gate.'], ['시작하지 마세요. 대문 앞에서는.']),
		card
	];
	at('gotaso_03', 'She told me at breakfast');
	at('scene-gotaso-pumsuk-12', 'She told me at breakfast');
	at('sunduk-regret-love', 'marry for love');
	at('gotaso-birth-white', 'the girl-child arriving, pink silk');
	at('gotaso-birth-lantern', 'the girl-child arriving, pink silk');
});

// ───────────────────────── #14 Munhee
episode(14, 'Back at the gate, the dust from the Daeya road has settled. Munhee has not let go of his arm.', (e, { pick, at }) => {
	const shame = pick('what disgrace is this');
	shame.en = ['Pregnant, with no husband to name… what disgrace is this!', 'A sister who shames the house burns in its yard.'];
	shame.lines = ['남편도 없이 임신했다니… 웬 체면망신인가!', '집안을 욕보인 누이는 그 집 마당에서 태운다.'];
	const pyre = pick('Yushin builds the pyre');
	pyre.html += ' Munhee stands beside it with her hands folded over the child. Nobody has tied her. Nobody has needed to.';
	pyre.ko += ' 문희는 그 곁에 서서 두 손을 배 위에 포갠다. 아무도 그녀를 묶지 않았다. 묶을 필요가 없었다.';
	const wed = pick('rumour becomes a wedding');
	wed.html = 'Chunchu and Munhee are married. The green-wood rumour becomes a wedding, and the wedding becomes a household that is openly fond of itself.';
	wed.ko = '춘추와 문희는 혼인한다. 생나무 연기 소문은 혼례가 되고, 혼례는 제 자신을 아끼는 살림이 된다.';
	const walls = pick('neighbors on both walls');
	walls.html =
		'The neighbors on both walls learn their names the wrong way, through plaster. At night the paper window glows, and the shadows on it are not ambiguous. Servants stop knocking. Someone on the east side moves his sleeping mat away from the shared timber and blames the draft.';
	walls.ko = '양쪽 담 너머 이웃들은 두 사람의 이름을 엉뚱한 길로 배운다. 회벽 너머로. 밤이면 창호지가 환하고, 거기 비치는 그림자는 오해의 여지가 없다. 하인들은 문 두드리기를 그만둔다. 동쪽 집 누군가는 맞닿은 벽에서 잠자리를 멀찍이 옮기고 외풍 탓을 한다.';
	const household = pick('Bupmin’s Birth', 'scene');
	household.label = 'The Household';
	household.ko = '식구';
	const hill = pick('Chunchu stopped going to the hill');
	hill.html = 'For a few years, Chunchu stops going to the hill.';
	hill.ko = '몇 해 동안, 춘추는 언덕에 가지 않는다.';
	const star = pick('The east star… I think');
	star.en = ['Brother. I have a daughter and a son now.', 'The east star… I think I will let it just be a star.'];
	star.lines = ['형님. 저는 이제 딸 하나에 아들 하나입니다.', '동쪽 별은… 그냥 별로 두렵니다.'];
	const card = e.blocks.at(-1);
	card.html = '<b>Same spring, in Pyongyang, another father walks his son to school. He means to pick a fight with the Buddha…!</b>';
	card.ko = '<b>같은 봄, 평양에서는 또 다른 아버지가 아들을 학당에 데려간다. 부처와 한판 붙을 작정으로…!</b>';

	const B = (f, k) => pick(f, k);
	const i = (b) => e.blocks.indexOf(b);
	const head = e.blocks.slice(0, i(B('Mid-Bone pine')));
	const head2 = e.blocks.slice(i(B('Mid-Bone pine')) + 1, i(shame) + 1);
	e.blocks = [
		head[0],
		head[1],
		D('munhee', ['Forgotten? I was there.', 'You were the one without a coat.'], ['잊어요? 내가 거기 있었는데.', '웃옷 벗고 있던 건 당신이었고요.']),
		...head.slice(2),
		...head2,
		D('munhee', ['Then build it, brother.', 'I’m not giving you a name. You already know it.'], ['그럼 쌓아, 오라버니.', '이름은 안 대. 오라버니도 이미 알잖아.']),
		B('The Pyre', 'scene'),
		pyre,
		B('The smoke goes straight up'),
		B('What is that smoke?'),
		S('A lady-in-waiting', '#b9a3c9', ['Kim Yushin’s yard, Highness.', 'His sister is with child and won’t name the father. He says she burns at noon.'], ['김유신 댁 마당이옵니다, 마마.', '누이가 아이를 뱄는데 아비 이름을 대지 않는답니다. 정오에 태운다 하옵니다.']),
		B('Lord… Chunchu?'),
		P(
			'Then Chunchu is running. A True Bone does not run in front of a princess. He runs the whole way: down the terrace stairs, through two gates, into the smoke.',
			'그러더니 춘추가 뛴다. 진골은 공주 앞에서 뛰지 않는다. 그는 끝까지 뛴다. 누대 계단을 내려가, 문 두 개를 지나, 연기 속으로.'
		),
		D('munhee', ['Don’t you dare. Not because of smoke.'], ['하지 마세요. 연기 때문이라면.']),
		B('Th-the father of that child'),
		P(
			'He says it to the yard, to the princess on the terrace, and to half of Surabol on its rooftops. Munhee closes her eyes. She had hoped for a quieter proposal. She will take this one.',
			'그는 마당에, 누대 위의 공주에게, 지붕에 올라앉은 서라벌 절반에게 그 말을 한다. 문희는 눈을 감는다. 좀 더 조용한 청혼을 바랐다. 이걸로 하기로 한다.'
		),
		P('Yushin kicks the green wood apart. It was never going to catch.', '유신이 생나무 더미를 발로 흩뜨린다. 애초에 불이 붙을 나무가 아니었다.'),
		B('You did not choose my sister.'),
		wed,
		e.blocks.find((b) => b.kind === 'wed'),
		P('At the feast the two of them end up where they always end up: outside, on the steps, sharing one cup.', '잔치에서 둘은 늘 그렇듯 같은 자리에 앉는다. 바깥 계단, 잔 하나.'),
		e.blocks.find((b) => b.kind === 'dialogue' && b.en?.length === 1 && b.en[0] === 'Brother.'),
		B('lay Gaya blood and Silla royalty'),
		B('You should have simply become king yourself'),
		B('You know exactly why not'),
		B('…I do.'),
		B('Neither of them says the word.'),
		B('The Closed Months', 'scene'),
		B('The wedding itself is quiet'),
		B('They shut the door'),
		B('The first time he is still trying to be gentle'),
		B('don’t even try to count'),
		B('I have… already lost'),
		walls,
		B('They say… they heard us'),
		B('Then the wall… is on our side'),
		B('Months pass before either of them remembers the yard'),
		household,
		P(
			'Samsin comes the way she always comes when a breath starts: in white, with nobody else in the room. The first child is a girl who talks early and never stops. They call her <b>Gotaso</b>. A year later comes a boy who walks before he talks. They call him <b>Bupmin</b>. Chunchu sits where a husband sits when he has not yet learned what children will steal from him.',
			'숨이 하나 시작될 때면 늘 그렇듯 삼신이 온다. 하얗게, 방에 아무도 들이지 않고. 첫아이는 말이 빠르고 그칠 줄 모르는 딸이다. <b>고타소</b>라 부른다. 한 해 뒤에는 말보다 걸음이 먼저인 아들이 온다. <b>법민</b>이라 부른다. 춘추는 아이들이 자기에게서 무엇을 훔쳐 갈지 아직 모르는 남편의 자리에 앉아 있다.'
		),
		hill,
		B('You have not been coming to Council lately'),
		star,
		B('So you will.'),
		P('Back at the gate, the dust from the Daeya road has settled. Munhee has not let go of his arm.', '다시 대문 앞. 대야 길의 먼지는 가라앉았다. 문희는 아직 남편의 팔을 놓지 않았다.'),
		D('munhee', ['You went back to the hill, of course.'], ['결국 언덕엔 다시 갔죠, 당신.']),
		D('chunchu', ['Somebody had to. The star wasn’t going to climb down by itself.'], ['누군가는 가야지. 별이 제 발로 내려올 리는 없으니.']),
		card
	];
	at('bupmin-birth-white', 'Samsin comes the way she always comes');
	at('bupmin-birth-lantern', 'Samsin comes the way she always comes');
	at('nsfw-munhee-chunchu-tangled-silk', 'They shut the door');
	at('nsfw-munhee-chunchu-they-fit', 'The first time he is still trying to be gentle');
	at('nsfw-munhee-chunchu-lattice-morning', 'Months pass before either of them remembers the yard');
	at('nsfw-munhee-chunchu-window-straddle', 'the paper window glows');
	at('nsfw-munhee-chunchu-window-pressed', 'the shadows on it are not ambiguous');
	at('nsfw-munhee-chunchu-window-lift', 'the shadows on it are not ambiguous');
	at('nsfw-munhee-chunchu-window-neighbor-eye', 'neighbors on both walls');
	at('moonlit-silhouettes-romance', 'the paper window glows');
});

// ───────────────────────── #15 Academy
const F15 = 'Yeon has three sons, and only one of them is old enough to annoy a monk.';
episode(15, F15, (e, { pick, at }) => {
	const ng = pick('is the careful one');
	ng.html = '<b>Namseng</b>, seven, is the careful one: the heir, eager to be approved of.';
	ng.ko = '<b>남생</b>은 일곱 살, 신중한 맏이다. 인정받고 싶어 하는 후계자.';
	const nk = pick('is the fierce one');
	nk.html = '<b>Namgun</b>, four, is the fierce one, who never backs down first.';
	nk.ko = '<b>남건</b>은 네 살, 사나운 둘째다. 먼저 물러서는 법이 없다.';
	const ns = pick('is the quiet one, watching');
	ns.html = '<b>Namsan</b>, two, is the quiet one, watching his brothers.';
	ns.ko = '<b>남산</b>은 두 살, 조용한 막내다. 형들을 지켜본다.';
	const gate = pick('to the gate himself, in riding boots');
	gate.html = 'Yeon brings <b>Namseng</b> to the gate himself, in riding boots, and does not take them off on the swept stone. Namgun has come too, uninvited, clinging to the back of the saddle.';
	gate.ko = '연은 <b>남생</b>을 직접 문 앞까지 데려온다. 말 탈 때 신는 장화 그대로, 쓸어 놓은 돌바닥 위에서도 벗지 않는다. 남건도 따라왔다. 아무도 부르지 않았는데, 안장 뒤에 매달려서.';
	const monk = pick('has stopped sweeping');
	monk.html = 'Across the courtyard a monk has stopped sweeping. His name is <b>Bodeok</b>. His monastery, up at Banryong, owns a great deal of farm.';
	monk.ko = '마당 건너편에서 승려 하나가 비질을 멈췄다. 이름은 <b>보덕</b>. 그가 있는 반룡사는 농토를 아주 많이 가졌다.';
	const complaint = pick('The complaint reaches the High Commander');
	complaint.html = 'The complaint reaches the High Commander’s table before Yeon has ridden home. It is written in a monk’s neat hand. Gusesa reads it at supper, between courses.';
	complaint.ko = '연이 집에 닿기도 전에 그 불평은 막리지의 상에 올라간다. 단정한 중의 글씨다. 구세사는 저녁상에서, 요리와 요리 사이에 그것을 읽는다.';

	const MONK = '#a39171';
	e.blocks = [
		P(F15, '연에게는 아들이 셋 있다. 그중 중을 성가시게 할 만큼 큰 건 하나뿐이다.'),
		e.blocks.find((b) => b.kind === 'map'),
		ng,
		e.blocks.find((b) => b.kind === 'card' && b.person === 'namseng'),
		nk,
		e.blocks.find((b) => b.kind === 'card' && b.person === 'namgun'),
		ns,
		pick('There is a fourth boy at that table'),
		pick('The Taehak', 'scene'),
		pick('The Grand Academy is old'),
		gate,
		...e.blocks.slice(e.blocks.indexOf(pick('begin with the Analects')), e.blocks.indexOf(pick('whatever doesn’t own a farm')) + 1),
		monk,
		S('Bodeok', MONK, ['Commander. The Buddha has no landlords.', 'He has guests. Some of them stay a long time.'], ['대가. 부처님께는 지주가 없습니다.', '손님이 있을 뿐이지요. 오래 머무는 손님도 있고요.']),
		D(
			'gesomun',
			['A guest who keeps the farm, the barn and the plough? That’s a landlord, monk.', 'Go on, sweep. Don’t let me stop you working. Somebody here ought to.'],
			['농토에 곳간에 쟁기까지 차고 앉은 손님? 그게 지주야, 중아.', '쓸어. 계속. 일하는 거 내가 막을 생각 없어. 여기서 누구 하나는 일을 해야지.']
		),
		P(
			'Namgun is four. He decides this is a fight and that his side is winning. He kicks the monk’s swept pile across the stone.',
			'남건은 네 살이다. 이게 싸움이고 자기 편이 이기는 중이라고 판단한다. 그래서 중이 쓸어 모은 낙엽 더미를 돌바닥에 걷어차 흩는다.'
		),
		D('namseng', ['Namgun! Say sorry.', '…Venerable sir. My brother is four. I will read the sutra too, if I am allowed.'], ['남건! 잘못했다고 해.', '…스님. 제 아우가 네 살이라서요. 허락해 주시면 저도 불경을 읽겠습니다.']),
		D('gesomun', ['You’re not allowed.', '…Don’t look at me like that. Read it on your own time. Just don’t pay for it.'], ['안 돼.', '…그런 눈으로 보지 마. 읽고 싶으면 네 시간에 읽어. 돈만 내지 마.']),
		P(
			'Bodeok bows to the boy, not to the father. Then he goes back to sweeping. He sweeps the same patch of stone until dark, and he does not forget a word.',
			'보덕은 아버지가 아니라 아이에게 절한다. 그러고는 다시 비질을 한다. 해가 질 때까지 같은 돌바닥만 쓴다. 그리고 한 마디도 잊지 않는다.'
		),
		pick('The Uncle’s Supper', 'scene'),
		complaint,
		pick('A Yeon telling monks what to own'),
		P(
			'Yeon is called to the table. He does not sit, because nobody offers. He does not take his boots off, because nobody asks.',
			'연이 상 앞으로 불려 온다. 앉으라는 말이 없으니 앉지 않는다. 신을 벗으라는 말이 없으니 벗지 않는다.'
		),
		D(
			'gusesa',
			['Nephew. The monks of Banryong pray for the king every morning.', 'They will pray for you too, now. You won’t like what they pray.'],
			['조카야. 반룡사 중들은 아침마다 임금님 잘되라고 빈다.', '이제 너를 위해서도 빌 거다. 무얼 비는지는 마음에 안 들 테지만.']
		),
		D('gesomun', ['Let them. Prayers are free.', 'Only thing in this country the monks don’t charge for.'], ['빌라 하시오. 기도는 공짜요.', '이 나라에서 중들이 돈 안 받는 건 그거 하나뿐이니.']),
		P(
			'Gusesa wipes his fingers and goes back to his soup. That is how the meeting ends. Only one of the two men at the table knows it is also how a list begins.',
			'구세사는 손가락을 닦고 다시 국을 뜬다. 그렇게 자리가 끝난다. 그게 명단 하나의 시작이기도 하다는 걸, 그 상에 앉은 두 사람 중 하나만 안다.'
		),
		pick('Namseng is enrolled anyway'),
		e.blocks.at(-1)
	];
	at('gesomun-tripod-gate', 'A pot stands on three legs');
});

// ───────────────────────── #16 Stele
const F16 = 'The Great King’s stone is taller than four men. Namseng is not impressed.';
episode(16, F16, (e, { pick, at }) => {
	const ask = pick('Sixty-four fortresses are written on that rock');
	ask.en = ['Sixty-four fortresses are written on that rock.', 'Go on. Read me one.'];
	ask.lines = ['저 바위에 성이 예순넷 적혀 있다.', '자. 하나만 읽어 봐라.'];
	const ENVOY = '#c9a24a';
	e.blocks = [
		P(F16, '대왕의 비석은 사람 넷을 포갠 것보다 높다. 남생은 감동하지 않는다.'),
		e.blocks.find((b) => b.kind === 'place'),
		e.blocks.find((b) => b.kind === 'map'),
		P(
			'Yeon has ridden two days to the old capital to show his sons this. Namseng has heard about it since before he could sit a horse. Namgun has heard nothing and is having a wonderful time. Gulgul carries Namsan, who is asleep.',
			'연은 이걸 보여 주려고 아들들을 데리고 옛 도읍까지 이틀을 달려왔다. 남생은 말에 앉기도 전부터 이 비석 얘기를 들었다. 남건은 아무것도 못 들었고, 그래서 신이 났다. 굴굴은 잠든 남산을 업고 있다.'
		),
		pick('that’s it? A big rock?'),
		pick('Every Goguryeo boy is raised on him'),
		ask,
		P(
			'Namseng reads the Analects every morning. He gets four characters into the stone and stops. The carving is old, and the Great King’s scribes did not write for boys.',
			'남생은 아침마다 논어를 읽는다. 비문은 네 글자를 읽고 멈춘다. 새김은 오래됐고, 대왕의 서기들은 어린애 읽으라고 쓰지 않았다.'
		),
		e.blocks.find((b) => b.kind === 'quote' && textOf(b).includes('Villages: one thousand four hundred')),
		P(
			'They are not alone on the hill. A Tang party has come up the other path: an envoy in good silk, two clerks with ink boxes, and a Goguryeo official paid to show them everything. One clerk is already copying the list.',
			'언덕에 그들만 있는 게 아니다. 반대편 길로 당나라 일행이 올라와 있다. 좋은 비단을 걸친 사신 하나, 먹통을 든 서기 둘, 그리고 전부 보여 주라고 돈을 받은 고구려 관리 하나. 서기 하나는 벌써 그 목록을 베끼고 있다.'
		),
		S(
			'The Tang envoy',
			ENVOY,
			['A remarkable stone, Commander. My emperor loves history.', 'He asked me to see all of it. Every road, every fort, every ford. Your officials have been most generous.'],
			['대단한 비석이오, 대가. 우리 황제께서 역사를 몹시 좋아하시지요.', '전부 보고 오라 하셨소. 길이며 성이며 나루며, 하나도 빠짐없이. 귀국 관리들이 아주 친절하더이다.']
		),
		D('gesomun', ['Generous. I bet.', 'What did he cost you? That one, holding your horse.'], ['친절하겠지.', '저 말고삐 잡은 놈, 얼마 줬소?']),
		P(
			'The paid official finds something interesting in the grass. The envoy only smiles. He has been smiling for three provinces.',
			'돈 받은 관리는 풀숲에서 뭔가 재미있는 걸 찾아낸다. 사신은 웃기만 한다. 세 고을째 웃는 중이다.'
		),
		D('namgun', ['Father. I can push that one off.', 'The little one. With the ink.'], ['아버지. 제가 저 사람 밀어 버릴 수 있습니다.', '작은 사람이요. 먹 든 사람.']),
		D('gesomun', ['Not today.', 'Let him copy. Let him count every one.'], ['오늘은 아냐.', '베끼라고 해. 하나도 빼지 말고 세라고 해.']),
		P(
			'The clerk counts. The envoy bows, prettily, and takes his party down the hill before supper. His report will reach the emperor by autumn. It is very thorough.',
			'서기는 센다. 사신은 곱게 절하고, 저녁 전에 일행을 데리고 언덕을 내려간다. 그의 보고는 가을이면 황제에게 닿는다. 아주 꼼꼼한 보고다.'
		),
		D(
			'gesomun',
			['Sixty-four. And now a man in Tang silk walks up our hill and counts them.', 'Here’s your lesson. Every spring and every autumn we send tribute west. Silk, horses, boys.', 'How does a country that took sixty-four come to bow to the Tang twice a year?'],
			['예순넷. 그런데 이제는 당나라 비단 걸친 놈이 우리 언덕에 올라와서 그걸 세.', '자, 오늘 공부다. 봄마다 가을마다 우리는 서쪽에 조공을 보낸다. 비단, 말, 사내애들.', '예순넷을 빼앗은 나라가 어쩌다 일 년에 두 번 당에 절하게 됐냐?']
		),
		D('namseng', ['Because… it is polite, Father?'], ['…예의라서입니까, 아버지?']),
		D('gesomun', ['Wrong. Again.'], ['틀렸다. 다시.']),
		D('namseng', ['Because we stopped… counting?'], ['…세는 걸 그만둬서입니까?']),
		D(
			'gesomun',
			['Closer.', 'Because the men in Pyongyang got old and fat and scared, and called it peace.', 'Remember it. One day you’ll sit where they sit.'],
			['가까워.', '평양에 앉은 놈들이 늙고, 살찌고, 겁을 먹고는 그걸 평화라고 불러서다.', '기억해 둬. 언젠가 네가 그 자리에 앉는다.']
		),
		P(
			'Namseng nods as if he understands. On Gulgul’s back, Namsan has woken up. He looks at the stone, then at his father, then at the path the Tang clerks took, and says nothing at all.',
			'남생은 알아들은 척 고개를 끄덕인다. 굴굴의 등에서 남산이 깨어 있다. 비석을 보고, 아버지를 보고, 당나라 서기들이 내려간 길을 본다. 그리고 아무 말도 하지 않는다.'
		),
		P(
			'On the ride home Yeon is quiet, which his sons have never seen. Somewhere down the valley, a clerk’s brush is still moving.',
			'돌아오는 길에 연은 말이 없다. 아들들은 그런 아버지를 처음 본다. 골짜기 저 아래 어딘가에서, 서기의 붓은 아직 움직이고 있다.'
		),
		P(
			'<b>Some visitors knock. Some take their boots off. One old friend is about to do neither…!</b>',
			'<b>문을 두드리는 손님이 있다. 신을 벗는 손님이 있다. 그리고 둘 다 안 할 오랜 벗이 하나 있다…!</b>'
		)
	];
	at('stele-sunrise', 'Yeon has ridden two days');
	at('ink-stele-yeon-sons', 'Yeon has ridden two days');
});

// ───────────────────────── #17 Dosuryu
const F17 = 'In thirty years Dosuryu has never knocked at this house. Tonight, for the first time, he keeps his boots on.';
episode(17, F17, (e, { pick }) => {
	e.blocks = [
		P(F17, '삼십 년 동안 도수류는 이 집 문을 두드린 적이 없다. 오늘 밤, 처음으로, 그는 신을 신은 채 들어온다.'),
		pick('Old man. Boots.'),
		pick('You listen better standing'),
		pick('the same little room behind the audience hall'),
		pick('So they drink together'),
		pick('That’s what’s wrong with it'),
		pick('HAHAHAHAHAHA'),
		pick('Kill me? Yeon Gesomun?'),
		D('gesomun', ['Sixty-four fortresses on a rock up the road, and they think one wall will hold me?'], ['길 위 바위엔 성이 예순넷이나 적혀 있는데, 성벽 하나로 날 묶어 두겠다고?']),
		pick('Laugh. Go on.'),
		D('gesomun', ['Who told you. The cook?'], ['누가 그래. 요리사?']),
		D(
			'dosuryu',
			['The cook’s my cousin. The cook’s wife is my other cousin.', 'Half that palace is my cousin. That’s what forty years in Pyongyang buys you. Relatives.'],
			['요리사가 내 사촌이다. 요리사 마누라는 다른 사촌이고.', '그 궁 절반이 내 사촌이야. 평양에서 사십 년 살면 그게 남는다. 친척.']
		),
		D('gesomun', ['Then I’ll go up there tonight. Ask His Majesty to his face.'], ['그럼 오늘 밤 올라가지. 임금 면전에서 물어보면 되겠네.']),
		D(
			'dosuryu',
			['You go tonight with that face, you go as a traitor. They’ll thank you for saving them the trouble.', 'Stand still. I said stand.'],
			['그 얼굴로 오늘 밤 올라가면 역적으로 가는 거다. 수고 덜어 줘서 고맙다고들 하겠지.', '가만있어. 서 있으라고 했다.']
		),
		pick('Yeon stops laughing.'),
		P(
			'In the doorway behind them, a seven-year-old in his sleeping robe has come to see why the old man is shouting. Namseng hears one word, <i>list</i>, and does not understand it. Gulgul picks him up and carries him back to bed without turning his back on the door.',
			'둘 뒤 문간에, 잠옷 바람의 일곱 살짜리가 늙은이가 왜 소리를 지르나 보러 나와 있다. 남생은 <i>명단</i>이라는 말 하나를 듣고, 알아듣지 못한다. 굴굴이 그를 안아 들고 잠자리로 데려간다. 문에 등을 보이지 않은 채.'
		),
		pick('How many names on their list.'),
		pick('Why are you smiling like that?'),
		pick('Mine’ll be longer.'),
		D('dosuryu', ['Whatever you put on yours, I don’t want to read it.', 'I’m old. I’d like to sleep.'], ['네 명단에 뭘 적든, 난 안 읽고 싶다.', '늙었어. 잠은 좀 자고 싶다.']),
		pick('stands a long time in the yard'),
		P(
			'<b>Far to the south, Sabi has a new king. On his coronation morning, several hundred people see a dragon…!</b>',
			'<b>저 멀리 남쪽, 사비에 새 임금이 섰다. 즉위하는 날 아침, 수백 명이 용을 본다…!</b>'
		)
	];
});

// ───────────────────────── #18 King Euija
const F18 = 'Several hundred people see the dragon. Only one of them can see the string.';
episode(18, F18, (e, { pick, at }) => {
	const dragon = pick('a dragon is seen over the Sabi River');
	dragon.html = 'On the morning of his coronation, a dragon is seen over the Sabi River. The court diarist writes it down, because it happened.';
	dragon.ko = '즉위하는 날 아침, 사비강 위로 용이 나타난다. 사관은 그것을 적는다. 실제로 일어난 일이므로.';
	const method = pick('Hate the method. You have my permission.');
	method.en = method.en.map((l) => l.replace('Seongchung', 'Sungchung'));
	const table = pick('Look at that table!');
	table.en = table.en.map((l) => l.replace('Seongchung', 'Sungchung'));
	const gyebek21 = pick('No market calls him Hundred-Victories');
	gyebek21.html = 'Gyebek is twenty-one, and seated far down the table. No market calls him Hundred-Victories. Not yet. He is passed over every season, because nobody knows what clan he comes from, and he won’t make one up.';
	gyebek21.ko = '계백은 스물하나, 상 끝자락에 앉아 있다. 아직 어느 장터도 그를 백승이라 부르지 않는다. 아직은. 철마다 승진에서 밀린다. 어느 가문 출신인지 아무도 모르고, 그는 지어낼 생각이 없다.';
	const east = pick('The East wants a prince of Baekje');
	east.en = ['The island king across the sea wants a prince of Baekje at his court, to show the world how close we are. You’re going.', east.en[1]];
	east.lines = ['바다 건너 섬나라 임금이 백제 왕자를 제 조정에 두고 싶어 한다. 우리 둘이 얼마나 가까운지 세상에 보이고 싶은 게지. 네가 가거라.', east.lines[1]];

	const kills = pick('it is the sentence that kills him');
	const props = pick('Gods are props. Spirits are lighting.');
	const drop = new Set([
		pick('King Mu is dead at'),
		...e.blocks.filter((b) => b.kind === 'quote' && /Buyeo Jang has died|Pillar of State|yams to the village|sent in Prince Pung/.test(textOf(b))),
		e.blocks.find((b) => b.kind === 'poem'),
		kills,
		pick('He counts the hem'),
		pick('One is lonely, and three'),
		pick('Which of us sits beside you today'),
		pick('between our knees'),
		pick('the ties… come undone first')
	]);
	const throne = pick('Euija takes the throne at');
	const card = e.blocks.find((b) => b.kind === 'card' && b.person === 'euija');
	const map = e.blocks.find((b) => b.kind === 'map');
	const term = e.blocks.find((b) => b.kind === 'term');
	const moved = new Set([throne, card, map, term, dragon, pick('four lacquered paper kites')]);
	const rest = e.blocks.filter((b) => !drop.has(b) && !moved.has(b));
	const out = [
		P(F18, '수백 명이 용을 본다. 줄이 보이는 사람은 그중 하나뿐이다.'),
		dragon,
		pick('four lacquered paper kites'),
		P(
			'King Mu is dead at eighty, still cursing Silla, and nobody at the river is thinking about him. His son has waited forty-one years for this morning.',
			'무왕은 여든에 죽었다. 죽는 날까지 신라를 욕했다. 그런데 강가의 누구도 지금 그를 생각하지 않는다. 그의 아들은 이 아침을 마흔한 해 동안 기다렸다.'
		),
		throne,
		card,
		map,
		term
	];
	for (const b of rest) {
		out.push(b);
		if (b === props) out.push(kills);
		if (b === pick('The Princes', 'scene')) {
			out.splice(out.indexOf(gyebek21), 1);
			out.push(gyebek21);
		}
	}
	e.blocks = out;
	at('mu-sinrok-pond', 'King Mu is dead at');
	at('gyebek-sword', 'Sungchung. Hate the method.');
	at('euija-maid-hem-pour', 'Two court maids attend him');
	at('euija-maid-grab', 'The greed is Your Majesty');
	at('mu-sinrok-pagoda', 'Before he was king, King Mu paid the children of Sabi');
});

// ───────────────────────── #19 Yunchung
episode(19, 'You’ve been to Daeya. You waved a cart into it.', (e, { pick }) => {
	const enough = pick('resume counting berths');
	enough.en = ['Enough.', 'You can count berths when the frontier is settled.', 'Until then, the Eraha counts fortresses.'];
	enough.lines = ['그만.', '선석은 변경이 정리되면 그때 세라.', '그때까지 어라하는 산성을 센다.'];
	const heaven = pick('the invisible committee');
	heaven.en = [heaven.en[0]];
	heaven.lines = [heaven.lines[0]];
	const story = pick('governed by a single story');
	story.en = story.en.map((l) => l.replace('not Goryeo or Silla people', 'not Goguryeo or Silla people'));
	story.lines = story.lines.map((l) => l.replace('고려나 신라 사람', '고구려나 신라 사람'));
	const big = pick('too large to move');
	big.en = ['Goguryeo is too large to move.', big.en[1]];
	big.lines = ['고구려는 너무 커서 안 움직이고,', big.lines[1]];
	const chunbok = e.blocks.find((b) => b.kind === 'card' && b.person === 'chunbok');
	chunbok.caption = 'A young Satek with good manners and a quick eye for an opening.';
	chunbok.ko = '예의 바르고, 빈틈을 빨리 보는 젊은 사택.';
	const fort = pick('Daeya… how about it?');
	fort.en = ['A border fortress…', 'That too is good.', 'I have one in mind.'];
	fort.lines = ['변방의 성이라...', '그것도 좋지.', '마음에 둔 데가 하나 있다.'];
	const doom = pick('Then we’re done for');
	doom.en = ['Then Silla’s finished at Daeya. Plain and simple.'];
	doom.lines = ['그럼 대야에서 신라는 끝장입니다. 간단합니다.'];
	const go = pick('go and be done for at Daeya');
	go.en = ['Ha! Then go and finish it, General. Ten thousand men.', 'Bring me back the fortress. And a story to go with it.'];
	go.lines = ['하! 그럼 가서 끝장을 보게, 장군. 군사 만이야.', '성을 가져오게. 이야기도 하나 곁들여서.'];

	const drop = new Set([
		pick('somebody has to inherit the salt'),
		e.blocks.find((b) => b.kind === 'card' && b.person === 'ministersatek'),
		pick('A harbour that changes clans'),
		pick('We are tired of hearing harbour'),
		pick('The Premier is chosen via'),
		pick('Rock of Politics. When the state', 'quote'),
		e.blocks.find((b) => b.kind === 'diagram'),
		pick('they worship the Cloud King like a god'),
		pick('then he took the river')
	]);
	const map45 = pick('The last wall between Baekje');
	const out = [];
	for (const b of e.blocks) {
		if (drop.has(b)) continue;
		if (b === enough)
			out.push(
				P(
					'By spring the Assembly is fighting about harbours, as it always is. Gyebek sits through three sessions. He understands every number and none of the smiles.',
					'봄이 되자 정사암 회의는 늘 그렇듯 항구 문제로 싸운다. 계백은 세 번의 회의를 끝까지 앉아 있는다. 숫자는 다 알아듣고, 웃음은 하나도 못 알아듣는다.'
				)
			);
		if (b === e.blocks.at(-1))
			out.push(
				P('The hall empties. Gyebek does not.', '회의장이 빈다. 계백은 남는다.'),
				D(
					'gyebek',
					['Majesty. The Severing.', 'You said it is not a figure of speech. Then it is a fact. I do not know it.', 'Men will ask me why we march. I want to answer with a fact.'],
					['전하. 그 斷 말입니다.', '비유가 아니라 하셨습니다. 그럼 사실입니다. 저는 그 사실을 모릅니다.', '왜 진군하느냐고 병사들이 물을 것입니다. 사실로 답하고 싶습니다.']
				),
				D(
					'euija',
					['Ha! A man who wants his war with the ledger attached.', 'Ask any grandmother in Sabi. They tell it better than I do. I add dragons.'],
					['하! 전쟁을 하면서 장부까지 달라는 놈은 처음 보는구나.', '사비 아무 할미한테나 물어보거라. 나보다 잘 이야기한다. 나는 용을 보태서 탈이지.']
				)
			);
		out.push(b);
		if (b === map45) out.push(P('You’ve been to Daeya. You waved a cart into it.', '대야에는 당신도 가 봤다. 수레 한 대를 손 흔들어 들여보냈다.'));
	}
	e.blocks = out;
});

// ───────────────────────── #20 The Severing
episode(20, 'Gyebek finds the chestnut seller at the west gate of Sabi. She is not his grandmother. She is everybody’s, and she has waited her whole life for a soldier to ask.', (e, { pick, at }) => {
	const GRAN = '#a08c6e';
	const halves = pick('the Cloud King turns his army');
	halves.html =
		'Two kings take a river back together: Seong of Baekje and the Cloud King of Silla. For a while their banners fly side by side. Then the Cloud King turns his army on Baekje’s half. He takes the river mouth and fills it with men who won’t ask what the alliance meant.';
	halves.ko =
		'두 임금이 함께 강을 되찾는다. 백제의 성왕과 신라의 구름왕. 한동안 두 나라 깃발은 나란히 나부낀다. 그러다 구름왕이 백제 몫으로 군대를 돌린다. 하류를 빼앗고, 동맹이 무엇이었는지 묻지 않을 사람들로 그곳을 채운다.';
	const camp = pick('For months the fight goes');
	camp.html = 'For months the fight goes Baekje’s way. The crown prince holds the forward camp, half-starved; his men are boiling their saddle leather. One night his father rides out with fifty horse to steady him.';
	camp.ko = '몇 달 동안 싸움은 백제 쪽으로 기운다. 태자는 굶주리며 앞 진영을 지킨다. 군사들은 안장 가죽을 삶아 먹는다. 어느 밤, 아버지가 기병 쉰을 이끌고 아들을 다독이러 나간다.';
	const hand = pick('hand drops. That is the signal');
	hand.html = 'On the ridge, the Cloud King’s hand drops. That is the signal. He has already said the rest, low, to the only man the rank will allow to finish it.';
	hand.ko = '능선 위에서 구름왕의 손이 떨어진다. 그것이 신호다. 나머지는 이미 낮게, 골품이 끝을 허락할 단 한 사람에게 말해 두었다.';
	const oath = pick('If you broke the oath');
	const card = e.blocks.at(-1);
	card.html = '<b>Ten thousand Baekje men march on Daeya. Its grain clerk is called Gumil. Remember that name…!</b>';
	card.ko = '<b>백제군 만 명이 대야성으로 향한다. 그 성의 곳간지기 이름은 검일. 기억해 두라…!</b>';

	const drop = new Set([pick('Two kings take a river back together. One is Seong'), pick('Mononobe no Makamu', 'quote'), pick('when Euija tells the story'), card]);
	const out = [];
	for (const b of e.blocks) {
		if (drop.has(b)) continue;
		out.push(b);
		if (b === e.blocks[0])
			out.push(
				P(
					'Gyebek finds the chestnut seller at the west gate of Sabi. She is not his grandmother. She is everybody’s, and she has waited her whole life for a soldier to ask.',
					'계백은 사비 서문에서 군밤 파는 할미를 찾아낸다. 그의 할미는 아니다. 사비 모두의 할미다. 그리고 군인 하나가 이걸 물어 주기를 평생 기다려 왔다.'
				),
				D('gyebek', ['What is the Severing.', 'His Majesty said any grandmother could tell it.'], ['斷이 뭡니까.', '전하께서 아무 할머니나 이야기해 줄 수 있다 하셨습니다.']),
				S(
					'A Sabi grandmother',
					GRAN,
					['Any grandmother? Hmph. Sit, then. Eat a chestnut. You’re too thin to march.', 'It starts with a river, and a friend. They always start with a friend.'],
					['아무 할미나? 흥. 앉아 봐. 밤 하나 먹고. 진군하기엔 너무 말랐어.', '강에서 시작해. 그리고 친구. 이런 얘긴 늘 친구로 시작하지.']
				)
			);
		if (b === oath) out.push(P('Which oath, and whose, nobody on the ridge asks.', '어느 맹세를, 누가 깼는지. 능선 위에서 그걸 묻는 사람은 없다.'));
	}
	out.push(
		P('The chestnuts have gone cold. Gyebek has not eaten his.', '군밤이 식었다. 계백은 제 몫을 먹지 않았다.'),
		S(
			'A Sabi grandmother',
			GRAN,
			['That’s the Severing. Silla keeps his skull under a staircase and walks on it every morning.', 'So. Now you know why you march.'],
			['그게 斷이야. 신라는 그 해골을 계단 밑에 두고 아침마다 밟고 다녀.', '자. 이제 왜 가는지 알겠지.']
		),
		D('gyebek', ['That is a fact. Thank you.', 'Silla broke the oath. The slave said Seong did.', 'I will remember which.'], ['사실입니다. 고맙습니다.', '맹세를 깬 건 신라입니다. 종은 성왕이 깼다고 했습니다.', '어느 쪽인지 기억하겠습니다.']),
		P(
			'A hundred years on, Baekje has not forgiven the cloud that emptied itself over its side of the river. The grandmothers tell it with chestnuts. Euija tells it with dragons. Either way, ten thousand men are about to march on it.',
			'백 년이 지나도 백제는 강 건너 제 쪽에 비를 다 쏟아 버린 그 구름을 용서하지 않았다. 할미들은 군밤을 까며 이야기하고, 의자는 용을 띄워 이야기한다. 어느 쪽이든, 이제 만 명이 그 이야기를 들고 진군한다.'
		),
		card
	);
	e.blocks = out;
	at('sever-jinheung-hand', 'Cloud King’s hand drops');
});

// ───────────────────────── Growth pass: stubs under 800 words get more scene.
function grow(n, marker, fn) {
	editStory((story) => {
		const e = story.flatMap((c) => c.entries)[n - 1];
		if (e.blocks.some((b) => textOf(b).includes(marker))) return false;
		const { pick } = tools(e);
		const after = (b, ...add) => e.blocks.splice(e.blocks.indexOf(b) + 1, 0, ...add);
		const before = (b, ...add) => e.blocks.splice(e.blocks.indexOf(b), 0, ...add);
		fn(e, pick, after, before);
		console.log(`#${n} grown`);
	});
}

grow(10, 'He asked me.', (e, pick, after, before) => {
	after(
		pick('You’re not allowed on the practice road.'),
		D('yushin', ['Gotaso. Off the road.'], ['고타소. 길에서 나와라.']),
		D('gotaso', ['One run, Uncle. He asked me.'], ['한 번만요, 외숙. 얘가 하자고 했어요.']),
		D('munmu', ['I did not—'], ['제가 언제—']),
		D('yushin', ['…One run.'], ['…한 번만.'])
	);
	const club = pick('Club box. A month.');
	club.en = ['Club box. A month.', 'Carry it where the girls can see.'];
	club.lines = ['채 함. 한 달.', '아가씨들 보는 데서 들고 다녀.'];
	before(
		e.blocks.at(-1),
		P('Gotaso has been listening from the fence, where she is not supposed to be either.', '고타소는 울타리에서 듣고 있었다. 거기 있으면 안 되는 건 그녀도 마찬가지다.'),
		D('gotaso', ['You pulled up because of me?'], ['나 때문에 당긴 거야?']),
		D('munmu', ['No. Because of me.'], ['아니요. 저 때문에요.']),
		D('gotaso', ['…Tomorrow, then. Don’t you dare let me win.'], ['…그럼 내일. 봐주기만 해 봐.']),
		P(
			'She means it. She always means it. That is the trouble with Gotaso, and the whole yard will miss it one day.',
			'진심이다. 그녀는 언제나 진심이다. 고타소의 문제가 바로 그거고, 언젠가 연무장 전체가 그걸 그리워하게 된다.'
		)
	);
});

grow(16, 'He was, by the wrong man.', (e, pick, after) => {
	after(
		pick('My emperor loves history.'),
		P(
			'Namseng knows exactly what a guest from afar is owed. He steps forward, bows the way his tutor taught him, and recites the first line of the Analects.',
			'남생은 먼 데서 온 손님에게 무엇을 해야 하는지 정확히 안다. 앞으로 나서서, 스승이 가르친 대로 절하고, 논어 첫 구절을 왼다.'
		),
		D('namseng', ['“Is it not a joy to have friends come from afar?”'], ['“벗이 먼 곳에서 찾아오니 또한 즐겁지 아니한가.”']),
		S(
			'The Tang envoy',
			'#c9a24a',
			['Charming! The Commander’s son has been well taught.', 'My emperor would be glad of such boys at his academy. Your crown prince has sent him several already.'],
			['훌륭하오! 대가의 아드님이 배움이 깊구려.', '우리 황제께서 이런 아이들이라면 태학에 기꺼이 받으실 거요. 귀국 태자께서도 벌써 여럿 보내셨지.']
		),
		P('Namseng goes red to the ears. He had wanted to be told he did well. He was, by the wrong man.', '남생의 귀까지 빨개진다. 잘했다는 말을 듣고 싶었다. 들었다. 엉뚱한 사람한테서.')
	);
	const g = pick('What did he cost you?');
	g.en = ['He’s not for sale.', 'And what did that one cost you? The one holding your horse.'];
	g.lines = ['얘는 안 팔아.', '그리고 저놈은 얼마 줬소? 말고삐 잡은 놈.'];
});

grow(17, 'He has been in a mood about you since.', (e, pick, after, before) => {
	after(
		e.blocks[0],
		P(
			'Gesomun is at supper with his boots on the table, which his wife gave up on years ago. The boys are in bed. The house is warm and loud, and nobody in it is afraid of anything.',
			'게소문은 장화 신은 발을 상에 올리고 저녁을 먹는 중이다. 아내는 오래전에 포기했다. 아이들은 잠자리에 들었다. 집은 따뜻하고 시끄럽고, 그 안에 뭘 무서워하는 사람은 하나도 없다.'
		)
	);
	after(
		pick('the same little room behind the audience hall'),
		D('gesomun', ['My uncle. Gusesa.', 'He eats with the king now? He doesn’t eat with anybody.'], ['내 삼촌이. 구세사가.', '이제 임금이랑 밥을 먹어? 그 양반 누구랑도 밥 안 먹는데.']),
		D('dosuryu', ['A monk wrote him a letter this spring. Neat hand. Lots of complaints.', 'He has been in a mood about you since.'], ['올봄에 중 하나가 편지를 보냈다더라. 글씨는 단정하고, 불평은 많고.', '그 뒤로 너만 보면 심사가 꼬였지.'])
	);
	before(
		e.blocks.at(-1),
		P(
			'When the old man has gone, Yeon calls for a lamp and a brush. Gulgul brings both and stands where he can see the door. Yeon writes for a long time. Once he stops, counts on his fingers, and adds another name.',
			'늙은이가 가고 나자 연은 등잔과 붓을 가져오라 한다. 굴굴이 둘 다 가져와서, 문이 보이는 자리에 선다. 연은 오래도록 쓴다. 한 번은 멈추고, 손가락을 꼽아 세고, 이름을 하나 더 적는다.'
		),
		D('gesomun', ['Don’t read it.'], ['읽지 마.']),
		P('Gulgul cannot read. He looks at the door anyway, to be polite.', '굴굴은 글을 모른다. 그래도 예의 삼아 문 쪽을 본다.')
	);
});

grow(20, 'like snow', (e, pick, after) => {
	after(
		e.blocks.find((b) => b.speaker === 'A Sabi grandmother'),
		D('gyebek', ['How long ago.'], ['얼마나 오래전입니까.']),
		S(
			'A Sabi grandmother',
			'#a08c6e',
			['A hundred years. My grandmother’s grandmother sold chestnuts at this gate when the news came.', 'She said the whole city went quiet, like snow. Nobody bought a thing all day.'],
			['백 년. 소식이 왔을 때 우리 할미의 할미가 이 문에서 밤을 팔았지.', '온 성안이 눈 온 것처럼 조용해졌대. 그날 하루 종일 아무도 아무것도 안 샀대.']
		)
	);
	after(
		pick('I will remember which.'),
		S('A Sabi grandmother', '#a08c6e', ['Remember which. Most people only remember the stool.'], ['어느 쪽인지 기억해. 다들 그 걸상만 기억하더라.'])
	);
});

grow(16, 'Nobody wrote him a letter about it.', (e, pick, after, before) => {
	after(
		pick('Every Goguryeo boy is raised on him'),
		D('namgun', ['Father! I’m going to climb it.'], ['아버지! 저거 올라갈래요.']),
		D('gesomun', ['Go on. Fall off. Then you’ll remember it.'], ['올라가. 떨어져 봐. 그래야 기억하지.']),
		P(
			'Namgun gets as high as the first crack and sits there, delighted, like a cat on a roof. Gulgul stands underneath with his arms half out. Nobody tells him to.',
			'남건은 첫 번째 금까지 올라가서는 지붕 위 고양이처럼 신이 나서 걸터앉는다. 굴굴이 그 밑에 팔을 반쯤 벌리고 선다. 시킨 사람은 없다.'
		),
		D('gesomun', ['He was eighteen when they put him on the throne. You know what he did first?'], ['그 양반, 열여덟에 왕위에 올랐다. 제일 먼저 뭘 했는지 아냐?']),
		D('namseng', ['Built a temple, Father?'], ['절을 지으셨습니까, 아버지?']),
		D(
			'gesomun',
			['He rode west and took back every fort his grandfather lost. Then he kept going.', 'Nobody wrote him a letter about it.'],
			['서쪽으로 가서 할아버지가 잃은 성을 죄다 도로 찾았다. 그러고도 멈추질 않았지.', '그걸로 편지 써 보낸 놈은 하나도 없었고.']
		)
	);
	before(
		pick('On the ride home Yeon is quiet'),
		D('namseng', ['Father. Will that man come back?'], ['아버지. 그 사람 다시 옵니까?']),
		D('gesomun', ['Not him. His emperor.'], ['그놈은 안 와. 그놈 황제가 오지.']),
		D('namseng', ['With tribute?'], ['조공을 들고요?']),
		D('gesomun', ['With an army, if we’re lucky. Then we find out what we’re worth.'], ['운이 좋으면 군대를 들고. 그래야 우리가 얼마짜리인지 알지.']),
		P(
			'The sun goes down behind the stone. Its shadow runs all the way down the hill, past the old tombs, to the river.',
			'해가 비석 뒤로 진다. 비석 그림자가 언덕을 타고 옛 무덤들을 지나 강까지 길게 뻗는다.'
		)
	);
});

grow(17, 'Kings can count cheering.', (e, pick, after) => {
	after(
		pick('You listen better standing'),
		D('dosuryu', ['If they see my horse at your gate tonight, my name goes on the list too. So listen fast.'], ['오늘 밤 내 말이 네 대문에 서 있는 걸 누가 보면, 내 이름도 그 명단에 올라간다. 그러니 빨리 들어.'])
	);
	after(
		pick('That’s what’s wrong with it'),
		D('gesomun', ['When?'], ['언제?']),
		D(
			'dosuryu',
			['Spring. The far end of the wall, past Buyeo Fortress. So far the letters take a month.', 'And one night out there, you fall off your horse. Very sad. Big funeral.'],
			['봄. 성벽 맨 끝, 부여성 너머. 편지가 한 달은 걸리는 데다.', '그리고 거기서 어느 밤, 네가 말에서 떨어지는 거지. 참 안됐지. 장례는 크게 치러 주고.']
		)
	);
	after(
		pick('Laugh. Go on.'),
		D('gesomun', ['Why now?'], ['왜 하필 지금?']),
		D(
			'dosuryu',
			['Because you walked out of the Summit and the whole city cheered.', 'Kings can count cheering. Your uncle counts it twice.'],
			['네가 회의장을 박차고 나왔을 때 온 성안이 환호했으니까.', '임금은 환호 소리를 셀 줄 안다. 네 삼촌은 두 번 세고.']
		)
	);
	after(
		pick('Yeon stops laughing.'),
		P(
			'He sits down for the first time all evening. He takes his boots off the table and sets them on the floor, side by side, the way a man lines up things he means to use.',
			'그는 저녁 내내 처음으로 앉는다. 상 위의 장화를 내려 바닥에 나란히 놓는다. 쓸 물건을 줄 세워 두는 사람처럼.'
		)
	);
	after(
		pick('does not understand it'),
		D('gesomun', ['Oi. Bed. Now.'], ['야. 자. 당장.']),
		D('namseng', ['Father, what list—'], ['아버지, 무슨 명단—']),
		D('gesomun', ['The rice list. Bed.'], ['쌀 명단이다. 자.'])
	);
});

grow(16, 'I want to count it too.', (e, pick, after) => {
	after(
		pick('He has been smiling for three provinces.'),
		D('gesomun', ['You. With the horse. When they’re gone, come and see me.', 'Bring the money. I want to count it too.'], ['너. 말 잡은 놈. 저것들 가고 나면 나 좀 보자.', '돈도 가져와. 나도 좀 세 보게.']),
		P('The official goes very white, which is answer enough.', '관리의 얼굴이 하얗게 질린다. 그걸로 대답은 충분하다.'),
		D('namgun', ['Can I push him off now?'], ['이제 밀어도 돼요?']),
		D('gesomun', ['Later.'], ['나중에.'])
	);
});

grow(17, 'You’ll need them.', (e, pick, after) => {
	const hear = pick('does not understand it');
	hear.html = 'In the doorway behind them, a seven-year-old in his sleeping robe has come to see why the old man is shouting. Namseng hears one word, <i>list</i>, and does not understand it.';
	hear.ko = '둘 뒤 문간에, 잠옷 바람의 일곱 살짜리가 늙은이가 왜 소리를 지르나 보러 나와 있다. 남생은 <i>명단</i>이라는 말 하나를 듣고, 알아듣지 못한다.';
	after(
		pick('The rice list. Bed.'),
		P('Gulgul picks him up and carries him back to bed without turning his back on the door.', '굴굴이 그를 안아 들고 잠자리로 데려간다. 문에 등을 보이지 않은 채.')
	);
	after(e.blocks[1], P('Then the door bangs open.', '그때 문이 벌컥 열린다.'));
	after(
		pick('Very sad. Big funeral.'),
		D('gesomun', ['Past Buyeo Fortress. Hah. I’d fall off my horse out there too. From boredom.'], ['부여성 너머라. 하. 거기 가면 나라도 말에서 떨어지겠다. 심심해서.'])
	);
	after(
		pick('I’d like to sleep.'),
		D('gesomun', ['Old man.', '…Thanks.'], ['영감.', '…고맙소.']),
		D('dosuryu', ['Don’t thank me. Put your boots back on.', 'You’ll need them.'], ['고맙긴. 장화나 도로 신어.', '쓸 데가 있을 거다.'])
	);
});

// One-off fix of an earlier draft line (the boots are already on the floor by then).
editStory((story) => {
	const all = story.flatMap((c) => c.entries);
	const e17 = all[16];
	const b = e17.blocks.find((x) => x.kind === 'dialogue' && x.en?.[0] === 'Don’t thank me. Take your boots off my table.');
	const e16 = all[15];
	const g = e16.blocks.find((x) => x.kind === 'dialogue' && x.en?.[0] === 'You. With the horse. When they’re gone, come and see me.');
	if (!b && e16.blocks.some((x) => x.en?.[0] === 'Later.')) return false;
	if (b) { b.en = ['Don’t thank me. Put your boots back on.', 'You’ll need them.']; b.lines = ['고맙긴. 장화나 도로 신어.', '쓸 데가 있을 거다.']; }
	if (g && !e16.blocks.some((x) => x.en?.[0] === 'Later.'))
		e16.blocks.splice(e16.blocks.indexOf(g) + 2, 0, D('namgun', ['Can I push him off now?'], ['이제 밀어도 돼요?']), D('gesomun', ['Later.'], ['나중에.']));
	console.log('fix applied');
});

// Dedupe the double-run of the #17 growth step; swap the redundant father lines for "why now".
editStory((story) => {
	const all = story.flatMap((c) => c.entries);
	let changed = false;
	for (const e of [all[15], all[16]]) {
		const out = [];
		const seen = new Set();
		for (const b of e.blocks) {
			const k = JSON.stringify(b);
			if (seen.has(k)) { changed = true; continue; }
			seen.add(k);
			out.push(b);
		}
		e.blocks = out;
	}
	const e = all[16];
	const i = e.blocks.findIndex((b) => b.en?.[0] === 'Your father stood where you’re standing, the year you were born. Same room, same rumour.');
	if (i >= 0) {
		e.blocks.splice(
			i,
			3,
			D('gesomun', ['Why now?'], ['왜 하필 지금?']),
			D(
				'dosuryu',
				['Because you walked out of the Summit and the whole city cheered.', 'Kings can count cheering. Your uncle counts it twice.'],
				['네가 회의장을 박차고 나왔을 때 온 성안이 환호했으니까.', '임금은 환호 소리를 셀 줄 안다. 네 삼촌은 두 번 세고.']
			)
		);
		changed = true;
	}
	if (!changed) return false;
	console.log('dedupe applied');
});

grow(17, 'thank my uncle for supper', (e, pick, after) => {
	after(
		pick('He looks at the door anyway, to be polite.'),
		P(
			'Near dawn he folds the paper twice and puts it inside his coat, against the skin, where a man keeps the things he does not mean to lose.',
			'새벽녘 그는 종이를 두 번 접어 옷 안, 살갗에 닿는 자리에 넣는다. 잃어버릴 생각이 없는 물건을 두는 자리다.'
		),
		D('gesomun', ['Gulgul. Saddle the bay.', 'Tomorrow I go and thank my uncle for supper. Then I bow to the king. All summer, if that’s what it takes.'], ['굴굴. 밤색 말에 안장 얹어.', '내일 삼촌한테 저녁 잘 먹었다고 인사하러 간다. 그다음엔 임금한테 절하고. 여름 내내라도.'])
	);
});

editStory((story) => {
	const e = story.flatMap((c) => c.entries)[17];
	const mu = e.blocks.find((b) => b.kind === 'p' && b.html?.startsWith('King Mu is dead at eighty, still cursing Silla'));
	const pung = e.blocks.find((b) => b.kind === 'p' && b.html?.includes('<b>Prince Pung (17)</b> stands.'));
	if (!pung && !mu?.html.includes('forty-one years')) return false;
	if (mu) {
		mu.html = 'King Mu is dead at eighty, still cursing Silla, and nobody at the river is thinking about him.';
		mu.ko = '무왕은 여든에 죽었다. 죽는 날까지 신라를 욕했다. 그런데 강가의 누구도 지금 그를 생각하지 않는다.';
	}
	if (pung) {
		pung.html = pung.html.replace('<b>Prince Pung (17)</b> stands.', '<b>Prince Pung</b> stands. He is seventeen.');
		pung.ko = pung.ko.replace('<b>풍 왕자 (17)</b>가 일어선다.', '<b>풍 왕자</b>가 일어선다. 열일곱 살이다.');
	}
	console.log('#18 tidy applied');
});

editStory((story) => {
	const e = story.flatMap((c) => c.entries)[9];
	const b = e.blocks.find((x) => x.kind === 'p' && x.html?.includes('the whole yard will miss it one day'));
	if (!b) return false;
	b.html = 'She means it. She always means it. That is the trouble with Gotaso, and also the best thing about her.';
	b.ko = '진심이다. 그녀는 언제나 진심이다. 고타소의 문제가 바로 그거고, 고타소의 제일 좋은 점도 그거다.';
	console.log('#10 tease softened');
});
