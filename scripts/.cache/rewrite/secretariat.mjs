// Flesh-out pass: Huangdi → Jiabeng → Royal Secretariat → King Muyeol seams, and the Secretariat rebuilt around Jukji.
// Idempotent: each episode skips when its marker is already in place. `--dry` prints without saving.
// node scripts/.cache/rewrite/secretariat.mjs [--dry]
import { editStory } from '../story-ops.mjs';

const DRY = process.argv.includes('--dry');

const P = (html, ko) => ({ kind: 'p', html, ko });
const BOLD = (html, ko) => ({ kind: 'p', html: `<b>${html}</b>`, ko: `<b>${ko}</b>` });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
/** Speaker chip colours, filled from the story before any episode is built. */
const CHIPS = new Map();
const EXTRA_CHIP = '#8a8a94';
/** D('chunchu', [['EN', 'KO'], …], { look }) */
const D = (person, pairs, extra = {}) => ({
	kind: 'dialogue',
	chip: (person && CHIPS.get(person)) || EXTRA_CHIP,
	...(person ? { person } : {}),
	en: pairs.map((p) => p[0]),
	lines: pairs.map((p) => p[1]),
	...extra
});
const X = (speaker, pairs) => D(null, pairs, { speaker });

function entry(story, title) {
	const e = story.find((c) => c.id === 'chunchu-era').entries.find((x) => x.title === title);
	if (!e) throw new Error(`no entry "${title}"`);
	return e;
}

/** The unique top-level block whose JSON contains `frag`. */
function one(e, frag) {
	const hits = e.blocks.map((b, i) => [b, i]).filter(([b]) => JSON.stringify(b).includes(frag));
	if (hits.length !== 1) throw new Error(`${e.title}: "${frag}" matched ${hits.length} blocks`);
	return hits[0][1];
}

function replaceCard(e, card) {
	const last = e.blocks.at(-1);
	if (last.kind !== 'p' || !/^<b>/.test(last.html)) throw new Error(`${e.title}: last block is not a card`);
	e.blocks.splice(e.blocks.length - 1, 1, card);
}

function step(name, marker, title, fn) {
	try {
		editStory((story) => {
			for (const c of story)
				for (const x of c.entries)
					for (const b of x.blocks) if (b.kind === 'dialogue' && b.person && b.chip && !CHIPS.has(b.person)) CHIPS.set(b.person, b.chip);
			const e = entry(story, title);
			if (JSON.stringify(e.blocks).includes(marker)) {
				console.log(`${name}: already done`);
				return false;
			}
			fn(e);
			console.log(`${name}: ${DRY ? 'ok (dry)' : 'patched'}`);
			if (DRY) return false;
		});
	} catch (err) {
		console.log(`${name}: FAILED ${err.message}`);
		process.exitCode = 1;
	}
}

// ───────────────────────── Huangdi: card now leads into Jiabeng ─────────────────────────
step('Huangdi', 'tell the six stone horses to get ready', 'Huangdi (皇帝)', (e) => {
	replaceCard(
		e,
		BOLD(
			'Back in Chang’an, the emperor is still coughing into his sleeve. Somebody should tell the six stone horses to get ready…!',
			'장안에서 황제는 아직도 소매에 대고 기침을 한다. 누가 돌말 여섯에게 채비하라고 일러 둬야 할 텐데…!'
		)
	);
});

// ───────────────────────── Jiabeng: no rewind; Surabol beat moves to the Secretariat ─────────────────────────
step('Jiabeng', 'does something nobody should do at a funeral', 'Jiabeng (駕崩)', (e) => {
	const scene = e.blocks[0];
	if (scene.kind !== 'scene') throw new Error('Jiabeng: block 0 is not the scene header');
	Object.assign(scene, { label: 'The Cuiwei Palace · 649', ko: '취미궁 · 649년' });
	e.blocks[one(e, 'Two summers earlier')] = P(
		'The Son of Heaven is dying the way he did everything else: in front of witnesses.',
		'천자는 다른 모든 일을 해 온 방식대로 죽어 간다. 증인들 앞에서.'
	);
	const from = one(e, 'The news crosses the sea in the eighth month');
	if (e.blocks[from - 1].kind !== 'scene') throw new Error('Jiabeng: Surabol header not where expected');
	e.blocks.splice(from - 1, 3);
	Object.assign(e.blocks[one(e, '"Back at Cuiwei"')], { label: 'The Anteroom', ko: '곁방' });
	replaceCard(
		e,
		BOLD(
			'Across the sea, the news reaches Surabol. Chunchu reads it, and does something nobody should do at a funeral…!',
			'바다 건너 서라벌에 소식이 닿는다. 춘추는 그것을 읽고, 초상 앞에서 아무도 해서는 안 될 짓을 한다…!'
		)
	);
});

// ───────────────────────── Royal Secretariat: rebuilt ─────────────────────────
step('Royal Secretariat', 'Silla has now won this war!', 'Royal Secretariat', (e) => {
	const old = (frag) => e.blocks[one(e, frag)];
	const keep = (...frags) => frags.map(old);

	// — the old blocks this pass keeps (looked up before anything moves) —
	const petitionCircling = old('For three months a border petition');
	const sideHall = old('He clears a side hall in the palace');
	sideHall.ko = sideHall.ko.replace('늙은 성골들이 변칙라', '늙은 가문들이 변칙이라');
	const pitch = keep(
		'"A petition."',
		'"A seal."',
		'"A courier."',
		'Are you getting it?',
		'These are not three separate offices.',
		'This is one office.',
		'We call it the Royal Secretariat.',
		'Today, Silla reinvents the court.',
		'Nobody laughs. The youngest clerk'
	);
	const jukjiCard = old('"kind":"card","person":"jukji"');
	Object.assign(jukjiCard, {
		caption: 'Bupmin’s friend from the yard. He sailed to Chang’an as the tenth head in the count and wrote down everything. Nobody asked him to.',
		ko: '법민의 연무장 친구. 열 번째 머릿수로 장안에 다녀오며 모든 걸 받아 적었다. 시킨 사람은 없었다.'
	});
	const jukjiThroat = old('before the Council finishes clearing its throat');
	const alchunVisit = old('The Council finds out in the third week');
	Object.assign(alchunVisit, {
		html: 'Three weeks later, Alchun comes to the side hall himself, with a border petition under his arm. He has been meaning to debate it.',
		ko: '삼 주 뒤, 알천이 변방의 청원을 옆구리에 끼고 몸소 곁채로 온다. 그것을 논할 참이었다.'
	});
	const alchunScene = keep(
		'We were going to argue about it at the full moon.',
		'The garrison marched yesterday.',
		'Then what’s the Council for, Chunchu?',
		'For the day the seal is wrong, my lord.',
		'That’s a very polite way of saying a chair.',
		'like a man returning a borrowed bowl'
	);
	const market = keep('Our prince is in love with the emperor', 'a door that opens when he knocks');
	const title = old('The Council asked what my title means.');
	title.en = ['The Council asked what my title means.', 'I told them: 中侍. The one in the middle. I stand beside the work.', 'They did not laugh. That was how I knew it had worked.'];
	title.lines = ['화백이 제 직함이 뭐냐고 물었습니다.', '中侍라고 했습니다. 가운데 선 사람. 일 옆에 선다고요.', '안 웃더군요. 그래서 된 줄 알았습니다.'];
	const ode = keep(
		'"The Woven Ode"',
		'The queen weaves the ode herself',
		'Tell him I wove it.',
		'I’ll tell him, Your Highness.',
		'Bupmin sails west with it.',
		'Ode to Great Peace'
	);
	const collar = keep('Father. The collar itches.', 'Everything new itches.');
	const tail = keep(
		'"Yamato"',
		'That summer a Silla tribute ship',
		'If we do not strike Silla now',
		'The Yamato emperor does not fill the sea.',
		'"Sabi"',
		'The emperor’s answer goes to Sabi first',
		'Return the cities you took from Silla.',
		'Then it is only Silla.',
		'Heaven just counted my enemies for me.',
		'For now, one.',
		'"label":"Surabol"',
		'Jukji reads the copy that came home with Bupmin',
		'He’ll let us fight them, my lord.',
		'In a gallery full of horses'
	);

	e.place ??= 'surabol';
	e.blocks = [
		// ── The news ──
		SCENE('Surabol · autumn 649', '서라벌 · 649년 가을'),
		{ kind: 'place', place: 'surabol', html: 'A small capital, waiting on a letter from a large one.', ko: '큰 나라의 편지를 기다리는 작은 나라의 도읍.' },
		P('Every small kingdom knows that an emperor’s promises are buried with him.', '작은 나라라면 누구나 안다. 황제의 약속은 황제와 함께 묻힌다.'),
		P(
			'The ship from the Tang coast comes in with its banners lowered. By the time the letter reaches Chunchu’s house, half the Council is already there, wearing its mourning face. Bupmin has brought a friend from the yard. Nobody asks why.',
			'당 쪽 바다에서 오는 배가 깃발을 내린 채 들어온다. 편지가 춘추의 집에 닿을 즈음엔 화백의 절반이 벌써 와서 상주 같은 얼굴을 하고 있다. 법민은 연무장 친구 하나를 데려왔다. 왜 데려왔는지 묻는 사람은 없다.'
		),
		D('alchun', [['Well, read it. We’ve all got the faces on already.', '자, 읽어 보시오. 다들 얼굴은 벌써 갖추고 왔으니.']]),
		D('chunchu', [
			['“The carriage of the Son of Heaven has collapsed.”', '“천자의 수레가 무너졌다.”'],
			['…So he’s gone.', '……가셨군.'],
			['“By his last command, the war in Liaodong is to end.”', '“유조에 따라, 요동의 전쟁을 그만둔다.”']
		]),
		D('alchun', [
			['There it is.', '그렇지.'],
			['The army he promised you just went into the ground with him.', '공한테 약속한 군대도 같이 땅에 들어갔구려.']
		]),
		D('yushin', [['Then it’s just us again.', '그럼 또 우리끼리요.']]),
		P(
			'Chunchu reads on. Halfway down the page he stops, lays the letter on the table, and smooths it flat with both hands, as if it might wake up and change its mind.',
			'춘추는 계속 읽는다. 장 중간쯤에서 멈추더니, 편지를 탁자에 내려놓고 두 손으로 판판하게 편다. 깨어나서 마음을 바꾸기라도 할까 봐.'
		),
		D('chunchu', [
			['“The crown prince has ascended the throne.”', '“태자가 보위에 올랐다.”'],
			['…Zhi.', '……치가.']
		]),
		D('chunchu', [
			['Gentlemen.', '여러분.'],
			['Silla has now won this war!', '이제 신라가 이 전쟁을 이겼소!']
		]),
		P(
			'He said something like it once before, at a gate in Chang’an, to a young man who didn’t understand him. The young man has a throne now.',
			'비슷한 말을 그는 전에도 한 번 했다. 장안의 성문 앞에서, 알아듣지 못한 젊은이에게. 이제 그 젊은이에게 옥좌가 있다.'
		),
		D('alchun', [
			['Won.', '이겼다고.'],
			['Chunchu, the man is dead. The will says stop.', '춘추, 사람이 죽었소. 유조엔 그만두라 했고.']
		]),
		D('chunchu', [
			['The will was written by the father. The chair is sitting under the son.', '유조는 아버지가 썼지요. 의자에는 아들이 앉아 있고.'],
			['The father promised me an army. The son played gyuku with me until we were the same colour.', '아버지는 내게 군대를 약속했소. 아들은 나랑 먼지가 같은 색이 될 때까지 격구를 했고.']
		]),
		D('yushin', [['A ball game isn’t a treaty.', '공놀이는 맹약이 아니오.']]),
		D('chunchu', [['No. It’s better. A treaty has clauses.', '아니지요. 그보다 낫소. 맹약엔 조항이 붙으니.']]),
		D('alchun', [['And boys grow up.', '애들은 크기도 하고.']]),
		D('chunchu', [
			['He’s been grown up for three months.', '큰 지 석 달 됐소.'],
			['He’ll want someone who knew him before.', '그 전의 자기를 아는 사람이 아쉬울 거요.']
		]),
		P(
			'Nobody else in the room feels like a winner. Yushin studies the table. Alchun studies Yushin. At the back, Bupmin’s friend leans over to him and says something that was not meant for anyone else.',
			'방 안의 누구도 이긴 기분이 아니다. 유신은 탁자를 본다. 알천은 유신을 본다. 뒤쪽에서 법민의 친구가 법민에게 몸을 기울이고, 다른 사람 들으라고 한 게 아닌 말을 한다.'
		),
		D('jukji', [
			['New emperor, new year-name.', '황제가 바뀌면 연호도 바뀌어.'],
			['Come New Year, every letter we send either carries his name on the date, or it doesn’t.', '정월부터 우리가 보내는 편지마다, 날짜에 그 사람 연호를 다느냐 안 다느냐야.']
		]),
		D('munmu', [['…So?', '……그래서, 형?']]),
		D('jukji', [['So that’s the answer. Whether we’re his. They’ll read the date before they read the letter.', '그게 답이라고. 우리가 저쪽 사람인지 아닌지. 저쪽은 편지보다 날짜를 먼저 읽을 거야.']]),
		D('chunchu', [['Say that again.', '다시 말해 보게.']]),
		D('jukji', [['I— that was to Bupmin, my lord.', '아, 그건— 법민한테 한 말입니다, 대감.']]),
		D('chunchu', [['I know who it was to. Say it again.', '누구한테 한 말인지는 아네. 다시 해 보게.']]),
		D('jukji', [['…They’ll read the date before they read the letter.', '……저쪽은 편지보다 날짜를 먼저 읽을 겁니다.']]),
		jukjiCard,
		D('chunchu', [['Bupmin. Where did you find him?', '법민아. 이 사람 어디서 찾았느냐?']]),
		D('munmu', [['In the yard, Father. He beat me at archery once, and then wrote down why.', '연무장에서요, 아버님. 활쏘기로 저를 한 번 이기더니, 왜 이겼는지 적어 두더군요.']]),
		D('chunchu', [
			['You. Stay.', '자네는 남게.'],
			['The rest of you, go home and be sad. You’re better at it than I am.', '나머지 분들은 댁에 가서 슬퍼들 하시오. 나보다 잘들 하시니.']
		]),

		// ── The study ──
		SCENE('Chunchu’s Study', '춘추의 서재'),
		P(
			'Munhee calls it the stable, because it smells of ink and nothing in it is ever put back. Papers cover the floor, the walls and one of the chairs. Chang’an is pinned up in pieces: a ward register, a map of walled squares, a rubbing of a stele about a leaf. A go board sits under the window with a game half played.',
			'문희는 이 방을 마구간이라 부른다. 먹 냄새가 나고, 무엇 하나 제자리로 돌아가는 법이 없어서다. 종이가 바닥과 벽과 의자 하나를 덮고 있다. 장안이 조각조각 꽂혀 있다. 방(坊)의 장부, 담장 두른 네모들의 지도, 나뭇잎 이야기를 새긴 비석의 탁본. 창 아래엔 두다 만 바둑판이 놓여 있다.'
		),
		P('Jukji has been in the room for as long as it takes to cross it. He has already read two walls.', '죽지가 방에 들어선 지는 방을 가로지를 만큼밖에 안 됐다. 그새 벽 두 개를 다 읽었다.'),
		D('chunchu', [['You were on the ship. You saw the city.', '자네 그 배에 있었지. 그 도성도 봤고.']]),
		D('jukji', [['I saw the wards, my lord. The gates, the drums. I wrote down the streets.', '방들을 봤습니다, 대감. 성문이랑 북이랑. 거리를 적었습니다.']]),
		D('chunchu', [
			['Then you saw what Chang’an shows its guests.', '그럼 장안이 손님한테 보여 주는 걸 본 게지.'],
			['Sit. I’ll tell you what it says after the guests go home.', '앉게. 손님들이 돌아간 뒤에 장안이 하는 말을 들려주지.']
		]),
		P('There is nowhere to sit. Jukji moves a stack of the Tang code onto another stack of the Tang code, and sits.', '앉을 데가 없다. 죽지는 당 율령 한 무더기를 다른 당 율령 무더기 위로 옮기고 앉는다.'),
		D('chunchu', [
			['This is how the emperor sees the world. One man under heaven. Everyone else facing in.', '황제는 세상을 이렇게 보네. 하늘 아래 한 사람. 나머지는 다 안쪽을 보고 앉았지.'],
			['We aren’t a country to him. We’re a direction.', '그에게 우리는 나라가 아닐세. 방향이지.']
		]),
		{
			kind: 'diagram',
			diagram: 'tang-imperial',
			step: 'tribute',
			title: 'The world from the dais · 천자의 천하',
			caption: 'How Chang’an draws the world: one man under heaven, and every king on earth facing inward. Silla is in the ring. So are the two kingdoms trying to eat it.',
			ko: '장안이 그리는 세상. 하늘 아래 한 사람, 그리고 안쪽을 향해 앉은 땅 위의 모든 왕. 신라도 그 고리 안에 있다. 신라를 삼키려는 두 나라도.'
		},
		D('jukji', [['Baekje’s in the same ring.', '백제도 같은 고리에 있습니다.']]),
		D('chunchu', [['Baekje, Goguryeo, us. Three kneelers. From the dais we look exactly alike.', '백제, 고구려, 우리. 무릎 꿇은 셋. 단 위에서 보면 셋이 똑같아 보이네.']]),
		P(
			'Chunchu pulls a sheet off the wall. It is in his own hand: three boxes, six under them, and one at the top that he has inked so hard the brush went through.',
			'춘추가 벽에서 종이 한 장을 떼어 낸다. 제 손으로 그린 것이다. 상자 셋, 그 밑에 여섯, 그리고 맨 위에 하나. 그 하나는 어찌나 세게 칠했는지 붓이 종이를 뚫었다.'
		),
		{
			kind: 'diagram',
			diagram: 'tang-departments',
			step: 'flow',
			title: 'One brush · 붓 한 자루',
			caption: 'Inside the ring: one office drafts, one checks, one does it. The paper never waits for a vote.',
			ko: '고리 안쪽. 한 곳이 쓰고, 한 곳이 살피고, 한 곳이 행한다. 종이는 표결을 기다리지 않는다.'
		},
		D('chunchu', [
			['I sat at his desk, Jukji. He signed a paper, and a province three months away got up and moved.', '그의 책상 앞에 앉아 봤네, 죽지. 그가 종이 한 장에 서명하니, 석 달 길 밖의 고을이 일어나 움직이더군.'],
			['Nobody met. Nobody agreed. One office writes it, one checks it, one does it.', '아무도 모이지 않았네. 아무도 동의하지 않았고. 한 곳이 쓰고, 한 곳이 살피고, 한 곳이 행하지.']
		]),
		D('jukji', [['And here, twelve uncles have to—', '여기선 삼촌 열두 분이—']]),
		D('chunchu', [['Six. It only feels like twelve.', '여섯일세. 열둘처럼 느껴질 뿐이지.']]),
		D('jukji', [['And any one of them can say no.', '그중 한 분만 아니라 해도 끝이고요.']]),
		D('chunchu', [['And go home to dinner.', '그러고는 저녁 자시러 집에 가지.']]),
		D('jukji', [
			['But my lord. If we copy the machine, we’re still in the ring.', '하지만 대감. 그 틀을 베껴 와도 우린 여전히 고리 안입니다.'],
			['Just a kneeler with a nicer office.', '관청이 좀 그럴듯한, 무릎 꿇은 나라일 뿐이지요.']
		]),
		P(
			'Chunchu looks at him for a moment the way he once looked at the emperor’s brush. Then he laughs, and points at the third wall.',
			'춘추는 잠시, 언젠가 황제의 붓을 바라보던 눈으로 그를 본다. 그러고는 웃으며 세 번째 벽을 가리킨다.'
		),
		D('chunchu', [
			['That one. A tributary brings a gift to the door, and is thanked at the door.', '저거. 조공국은 문 앞까지 선물을 들고 가서, 문 앞에서 인사를 받네.'],
			['An ally knows where the kitchen is.', '동맹은 부엌이 어딘지 알지.']
		]),
		{
			kind: 'table',
			head: ['', 'Tributary · 조공국', 'Ally · 동맹국'],
			rows: [
				['Era name · 연호', 'Our own years (Taehwa) · 우리 연호, 태화', 'His years (Yonghui) · 황제의 연호, 영휘'],
				['Court dress · 관복', 'Silla caps and robes · 신라의 관모와 옷', 'Tang robes, ivory tablets · 당의 관복과 상아 홀'],
				['Envoys · 사신', 'A ship a year, then home · 해마다 배 한 척, 그리고 귀국', 'A son in the imperial guard · 황제의 숙위에 아들 하나'],
				['New Year · 정월 초하루', 'No rite at home · 본국엔 하례가 없다', 'The court bows to the throne at dawn · 새벽에 온 조정이 왕좌에 하례'],
				['Troops · 군대', 'Ask, and get a letter · 청하면 편지가 온다', 'Ask, and get an army · 청하면 군대가 온다']
			]
		},
		D('jukji', [['Every line on the right costs us something.', '오른쪽 줄마다 우리가 뭘 내줘야 합니다.']]),
		D('chunchu', [['Every line on the left costs us Silla.', '왼쪽 줄마다 신라를 내주는 거고.']]),
		D('jukji', [
			['So Taehwa is retired. From New Year we count in his years, whatever he names them.', '그럼 태화는 거두는 거군요. 정월부터는 황제의 연호로 셉니다. 뭐라 이름을 붙이든.']
		]),
		D('chunchu', [
			['Taehwa. “Great Harmony.” A fine name. It never harmonised anything.', '태화라. 큰 화합. 좋은 이름이었지. 화합시킨 건 하나도 없었네만.'],
			['Retire it with honours.', '예를 갖춰 거두게.']
		]),
		D('jukji', [
			['Tang robes and caps for every official, an ivory tablet in every hand.', '모든 관리는 당의 관복과 관을 갖추고, 손에는 상아 홀을 들고.'],
			['I once saw a camel driver in Chang’an better turned out than our whole—', '장안에서 본 낙타 몰이꾼 하나가 우리 조정 전체보다 잘 차려입었더군요—']
		]),
		D('chunchu', [['Officials. Only officials.', '관리만. 관리만일세.']]),
		D('jukji', [['…And the people?', '……백성은요?']]),
		D('chunchu', [
			['The people keep their own clothes.', '백성은 제 옷을 입네.'],
			['If the whole market starts dressing like Chang’an, someone in Chang’an will think he owns the market.', '저잣거리가 통째로 장안처럼 입기 시작하면, 장안의 누군가는 그 저잣거리가 제 것인 줄 알 걸세.']
		]),
		D('jukji', [['And when Chang’an asks, very politely, about our borders?', '장안이 아주 정중하게 우리 국경을 물어 오면요?']]),
		D('chunchu', [
			['We send silk and poems. We keep the country.', '비단과 시는 보내네. 나라는 우리가 갖고.'],
			['Write it so they can’t tell which one I said louder.', '어느 쪽을 더 크게 말했는지 모르게 적게.']
		]),
		D('jukji', [['The crowns. A court in Tang dress, they’ll say, shouldn’t be seen in—', '관은요. 당의 옷을 입은 조정이 그런 걸 쓰고 나서면—']]),
		D('chunchu', [['No.', '안 되네.']]),
		D('jukji', [['I haven’t finished the—', '아직 다 말씀을—']]),
		D('chunchu', [
			['The crowns stay. Have you looked at them? Gold trees. Antlers. Little jade commas that ring when you nod.', '관은 그대로 두네. 들여다본 적 있나? 금으로 만든 나무. 사슴뿔. 고개만 끄덕여도 짤랑거리는 곡옥.'],
			['The emperor can have our calendar. He can’t have those.', '황제는 우리 달력을 가져가도 되네. 저건 안 되네.']
		]),
		P('Jukji writes every answer down. The one about the crowns, he writes twice.', '죽지는 대답을 모두 받아 적는다. 관에 대한 대답은 두 번 적는다.'),
		P(
			'Chunchu kicks open a chest by the wall. It came home from Chang’an with him. Inside, folded in paper, are Tang official robes cut to Silla measure: green, scarlet, and on top, one purple.',
			'춘추가 벽 옆의 궤짝을 발로 차서 연다. 장안에서 함께 건너온 궤짝이다. 안에는 종이에 싸인 당의 관복이 신라 사람 치수로 들어 있다. 초록, 진홍, 그리고 맨 위에 자주 한 벌.'
		),
		D('chunchu', [['Try it on.', '입어 보게.']]),
		D('jukji', [['My lord, that’s purple. In Chang’an, purple is—', '대감, 그건 자주입니다. 장안에서 자주는—']]),
		D('chunchu', [
			['The third rank and up. I know.', '삼품 이상이지. 아네.'],
			['I watched a clerk’s son earn one by reciting the Odes without a slip. You earned it by telling Bupmin something I hadn’t thought of.', '서리의 아들이 시경을 한 자도 안 틀리고 외워서 그걸 입는 걸 봤네. 자네는 내가 생각 못 한 걸 법민한테 말해서 입는 거고.']
		]),
		P(
			'The sleeves are too long. Jukji stands in the middle of the papers with his arms out, like a scarecrow somebody has promoted.',
			'소매가 너무 길다. 죽지는 종이 더미 한가운데서 팔을 벌리고 선다. 누가 승진시켜 준 허수아비처럼.'
		),
		D('chunchu', [
			['Silla is going to have a Secretariat. Petitions in at one door, seals out the other, and no uncles in the corridor.', '신라에 집사부가 생길 걸세. 청원은 이 문으로 들어오고, 인장은 저 문으로 나가고, 복도엔 삼촌이 없고.'],
			['It needs a head. In Chang’an they’d say Chancellor. We’ll say Premier.', '우두머리가 하나 있어야 하네. 장안이라면 재상이라 하겠지. 우리는 중시라 하세.']
		]),
		D('jukji', [['…I could get used to the sleeves.', '……소매는 익숙해질 수 있겠습니다.']]),
		D('chunchu', [
			['Then you are its Premier. The first one.', '그럼 자네가 중시일세. 첫 번째.'],
			['Nobody to copy, and nobody to blame but me.', '베낄 사람도 없고, 탓할 사람은 나뿐이지.']
		]),
		D('jukji', [['The Council will never vote for an office that takes their seals.', '화백은 자기네 인장을 가져가는 관청에 절대 표를 안 줄 겁니다.']]),
		D('chunchu', [
			['Not yet. First we fill it with men.', '아직은 그렇지. 먼저 사람을 채우세.'],
			['Then we ask the Council to vote for something that already works.', '그다음에 이미 돌아가는 걸 두고 표를 달라 하는 걸세.']
		]),
		D('jukji', [['That’s backwards.', '순서가 거꾸로입니다.']]),
		D('chunchu', [
			['That’s Chang’an.', '그게 장안일세.'],
			['There the emperor does not wait for every uncle to agree. I watched that power, and I want it for this country. Not for my vanity. For speed.', '거기선 황제가 삼촌들이 다 동의할 때까지 기다리지 않더군. 나는 그 힘을 보았고, 이 나라에 들이고 싶네. 허영 때문이 아니라. 속도 때문에.']
		]),
		P(
			'Much later that night, Chunchu sleeps the sleep of the saved and the thankful. He is the only man in Surabol who does.',
			'그날 밤 아주 늦게, 춘추는 구원받고 감사하는 자의 잠을 잔다. 서라벌에서 그렇게 자는 사람은 그 하나뿐이다.'
		),

		// ── Recruiting ──
		SCENE('Surabol · 650', '서라벌 · 650년'),
		petitionCircling,
		P('So Chunchu goes shopping for men. Not in the great houses. Great houses come with uncles.', '그래서 춘추는 사람을 사러 나선다. 큰 가문에서는 아니다. 큰 가문에는 삼촌이 딸려 온다.'),
		P(
			'He takes Jukji, and looks where the counting gets done. At the royal granary, a clerk has kept the same books for eleven years. His bones are one grade too short for the Council, and he will die at this desk.',
			'그는 죽지를 데리고, 셈이 실제로 이루어지는 곳을 찾아다닌다. 왕실 창고에서는 서리 하나가 십일 년째 같은 장부를 맡고 있다. 화백에 앉기엔 뼈가 한 등급 짧고, 그는 이 책상에서 죽을 것이다.'
		),
		D('chunchu', [['How short is the western store?', '서쪽 창고는 얼마나 모자라나?']]),
		X('Granary clerk', [
			['Two hundred and twelve sacks, my lord. Since spring.', '이백열두 섬입니다, 나리. 봄부터요.'],
			['I’ve reported it four times. I wrote it on the wall, too. Nobody reads the wall either.', '네 번 올렸습니다. 벽에도 써 놨습지요. 벽도 아무도 안 읽습니다.']
		]),
		D('chunchu', [
			['I read walls.', '나는 벽을 읽네.'],
			['Bring the book. You’re coming with me.', '장부 챙기게. 나랑 가세.']
		]),
		P(
			'At a temple off the market road, a monk copies Tang sutras faster than the Tang. Jukji does the asking.',
			'저잣길 옆 절에서는 승려 하나가 당의 불경을 당나라보다 빨리 베낀다. 묻는 건 죽지가 한다.'
		),
		D('jukji', [['Can you read the Tang code, Venerable?', '스님, 당 율령을 읽으실 수 있습니까?']]),
		X('Monk', [['I can read anything with characters in it. Whether I approve of it is a separate matter.', '글자로 된 건 다 읽소. 마음에 드는지는 별개 문제고.']]),
		D('jukji', [['You don’t have to approve. Just be quick.', '마음에 드실 필요는 없습니다. 빠르기만 하시면 됩니다.']]),
		P(
			'In the courier stables, a captain owns the only horse in Surabol that arrives before the rumour. Chunchu does the smiling. Nobody says no. Nobody has ever asked them before.',
			'파발 마구간에서는 대장 하나가, 서라벌에서 소문보다 먼저 닿는 유일한 말을 갖고 있다. 웃는 건 춘추가 한다. 아무도 거절하지 않는다. 이제껏 이들에게 물어본 사람이 없었으니까.'
		),
		sideHall,
		...pitch,
		jukjiThroat,
		D('chunchu', [['Good. Now all we need is for the Council to agree that it exists.', '좋네. 이제 화백이 이게 있다는 데 동의만 해 주면 되네.']]),

		// ── The woven ode (650) ──
		...ode,

		// ── The vote ──
		SCENE('The Harmony Council · 651', '화백회의 · 651년'),
		P(
			'On the first dawn of the new year, the whole court bows to the queen at once. Silla never bothered with that before. Every True Bone with a post now carries an ivory tablet. He holds it like a man who has been handed a live fish.',
			'새해 첫 새벽, 온 조정이 한꺼번에 여왕에게 절한다. 신라는 그런 수고를 해 본 적이 없다. 이제 벼슬 있는 진골은 모두 상아 홀을 든다. 산 물고기를 받아 든 사람처럼 쥐고서.'
		),
		P(
			'A month later, Chunchu calls the Harmony Council. This is not how it is done. The queen calls the Council, and it meets on one of the four sacred hills, under open sky, so heaven can hear. Chunchu is not a king. He calls it to a palace hall, with a clerk by the door.',
			'한 달 뒤, 춘추가 화백회의를 소집한다. 원래 이렇게 하는 게 아니다. 화백은 임금이 부르고, 네 신령한 산 가운데 하나에서, 하늘이 들을 수 있도록 맨하늘 아래 모인다. 춘추는 임금이 아니다. 그는 궁궐 전각으로 화백을 부르고, 문 옆에 서리 하나를 앉혀 둔다.'
		),
		P(
			'Four years ago, nobody would have come. Four years ago Bidam sat in the first chair. Now his friends are in exile or in the ground, and the old houses that are left have become very, very polite.',
			'사 년 전이라면 아무도 오지 않았을 것이다. 사 년 전엔 비담이 첫째 자리에 앉아 있었다. 이제 그의 벗들은 귀양을 갔거나 땅속에 있고, 남은 옛 가문들은 아주, 아주 공손해졌다.'
		),
		...collar,
		P('Bupmin walks in wearing it. Several uncles scratch.', '법민이 그 옷을 입고 들어선다. 삼촌 여럿이 긁는다.'),
		D('murim', [['My father voted on Green Pine Hill. In the wind. You could hear the pines making up their minds.', '우리 아버님은 청송산에서 표를 던지셨소. 바람 속에서. 소나무가 마음 정하는 소리가 들렸지.']]),
		D('suljong', [['Your father voted a king off his throne and went home for lunch.', '공의 부친은 임금 하나를 끌어내리고 점심 드시러 댁에 가셨지.']]),
		D('murim', [['That’s what I mean.', '내 말이 그거요.']]),
		D('imjong', [['Look at the boy. Next it’ll be Chang’an hats on all of us.', '저 아이 좀 보시오. 다음엔 우리 모두 장안 모자를 쓰게 생겼소.']]),
		D('suljong', [['Next? Look at your hand.', '다음? 공 손에 든 거나 보시오.']]),
		P(
			'Far to the west, on the other side of the world, another council once went on meeting long after it mattered. It kept its benches. It kept its robes. It kept voting, and the man who emptied it was careful never to call himself king. Nobody in this hall has heard of him. They would have recognised him at once.',
			'서쪽으로 아주 멀리, 세상 반대편에서, 또 다른 회의 하나가 쓸모가 다한 뒤로도 오래 모였다. 자리도 그대로 두었다. 옷도 그대로 입었다. 표결도 계속했다. 그 회의를 비워 낸 사내는 끝까지 자기를 왕이라 부르지 않으려 조심했다. 이 전각의 누구도 그 이름을 들어 본 적이 없다. 보았다면 한눈에 알아봤을 것이다.'
		),
		D('chunchu', [['My lords. One office. It takes the petitions you haven’t time for, and brings you the ones you do.', '여러분. 관청 하나요. 여러분이 볼 틈 없는 청원은 거기서 받고, 보셔야 할 것만 여러분께 올리지요.']]),
		D('murim', [['And who decides which ones we have time for?', '우리가 뭘 볼 틈이 있는지는 누가 정하오?']]),
		D('chunchu', [['The office.', '그 관청이요.']]),
		D('murim', [['…Of course.', '……그렇겠지.']]),
		P(
			'Every head turns to the first chair. Alchun has sat in it for four years. It came to him because at Radiance he raised neither blade nor banner, and when it was over he was the only senior man nobody had to forgive. It has taken him four years, this hall and the clerk by the door to work out why nobody had to.',
			'모든 고개가 첫째 자리로 돌아간다. 알천이 그 자리에 앉은 지 사 년이다. 명활성에서 칼도 깃발도 들지 않았고, 일이 끝났을 때 아무도 용서할 필요가 없던 원로가 그 하나뿐이어서 온 자리다. 왜 아무도 용서할 필요가 없었는지 깨닫는 데, 사 년과 이 전각과 문 옆의 서리가 필요했다.'
		),
		D('alchun', [
			['Oi. Four years in that chair.', '어이. 저 의자에 사 년이다.'],
			['Know what I’ve decided in four years?', '사 년 동안 내가 뭘 정했는지 아나?']
		]),
		D('yushin', [['What?', '뭘 정했소.']]),
		D('alchun', [['Lunch.', '점심.']]),
		P('Then he raises his sleeve, first, before anyone can watch him decide.', '그러고는 소매를 든다. 맨 먼저. 누가 그가 마음 정하는 모습을 보기도 전에.'),
		D('alchun', [['Aye. Write it down, you.', '가하오. 적어라, 거기.']]),
		P(
			'Five more sleeves follow. Nobody is the last one up, which is the only courtesy the old houses have left to give each other.',
			'소매 다섯이 뒤따른다. 아무도 마지막으로 들지 않는다. 옛 가문들이 서로에게 베풀 수 있는 마지막 예의다.'
		),
		{
			kind: 'diagram',
			diagram: 'harmony-council',
			step: 'unanimous',
			title: 'The Secretariat vote · 집사부 표결 6:0',
			caption: 'Six sleeves, the High Councillor’s first. The Council votes, unanimously, to need itself a little less.',
			ko: '소매 여섯, 상대등의 것이 맨 먼저. 화백은 만장일치로, 자기가 조금 덜 필요해지는 쪽에 표를 던진다.',
			cast: { s0: 'yushin', s1: 'alchun', s2: 'murim', s3: 'suljong', s4: 'imjong', s5: 'yumjang' }
		},

		// ── The Secretariat at work ──
		alchunVisit,
		...alchunScene,
		P('On his way out he bows to Jukji. Not deeply. But first.', '나가는 길에 그는 죽지에게 고개를 숙인다. 깊이는 아니다. 그러나 먼저.'),
		...market,
		title,

		// ── Yamato, Sabi, Surabol ──
		...tail,
		D('jukji', [['Then what do we do?', '그럼 어찌합니까?']]),
		D('chunchu', [['Emperors write to kings, Jukji. Not to a queen’s nephew.', '황제는 임금한테 편지를 쓰네, 죽지. 여왕의 조카한테가 아니라.']]),
		P(
			'Jukji writes it down. Then, for the first time since he put on the purple, he crosses something out.',
			'죽지가 그것을 적는다. 그러고는 자주 관복을 입은 뒤 처음으로, 적은 것을 지운다.'
		),
		BOLD(
			'The queen is tired. The nephew is busy. Sooner or later, Silla has to admit who is really sitting in the chair…!',
			'여왕은 지쳤고, 조카는 바쁘다. 언젠가 신라는 그 자리에 정말 누가 앉아 있는지 인정해야 한다…!'
		)
	];

	const im = (e.images ?? []).find((x) => x.id === 'secretariat-jukji-kneel');
	if (im) im.at = 'Then you are its Premier';
});
