/**
 * The Eastern Star, the end of Part I. Three vows under one star, then a cross-cut where all three
 * say "The King for All…!" at once.
 * - Wolji steps: Chunchu's life told to Yushin; Sunduk and Munhee float lamps for Daeya; Bupmin
 *   hides under the azaleas and repeats it.
 * - Deer Rock: Euija's palace childhood, the hedonist prince, his sons, his hope in Gyebek.
 * - Jumong Cavern: Gesomun alone. Self-reliance, no crown; he will fight even the King for All.
 * Heewon's lines (🙎 blocks, Euija's king-or-slave speech, Gesomun's direction/bone lines) are reused
 * as the same block objects.
 */
import { editStory } from '../story-ops.mjs';

const plain = (s = '') => s.replace(/<[^>]+>/g, '');
const enHas = (s) => (b) =>
	(b.en ?? []).some((l) => plain(l).includes(s)) || plain(b.html).includes(s) || b.label === s;

editStory((story) => {
	let ep;
	for (const c of story) for (const e of c.entries) if (e.title === 'The Eastern Star') ep = e;
	if (!ep) throw new Error('no Eastern Star');
	const old = ep.blocks;
	if (old.some(enHas('which kingdoms they could keep'))) {
		console.log('already applied');
		return false;
	}
	const pick = (s) => {
		const b = old.find(enHas(s));
		if (!b) throw new Error(`missing block: ${s}`);
		return b;
	};
	const chipOf = (person) => {
		for (const c of story)
			for (const e of c.entries) for (const b of e.blocks) if (b.person === person && b.chip) return b.chip;
		throw new Error(`no chip for ${person}`);
	};
	const say = (person, en, ko) => ({ kind: 'dialogue', person, chip: chipOf(person), lines: ko, en });
	const p = (html, ko) => ({ kind: 'p', html, ko });
	const place = (id, html, ko) => ({ kind: 'place', place: id, html, ko });

	/* Heewon's blocks and the anchored ones, reused as-is. */
	const lessons = pick('You were meant to be at lessons.');
	const soWereYou = pick('So were you, brother.');
	const enoughNow = pick('Well — is it enough now?');
	const kingOfBaekje = pick('drag the King of Baekje back');
	const grudge = pick('the grudge is mine');
	const littleInterest = pick('I had little interest in any of it.');
	const whatAreYouSaying = pick('Chunchu, what on earth are you saying');
	const easternStar = pick('The eastern star shines especially bright tonight');
	const planet = pick('That one’s a planet.');
	const thirtyYears = pick('Thirty years and you are still saying that.');
	const theChair = pick('I want the chair, brother.');
	const besideYou = pick('Then I will stand beside you.');
	const saidOnce = pick('He said that once before');
	const dontLike = pick('You don’t even like the chair.');
	const standNext = pick('I need only stand next to it.');
	const nineThatNight = pick('Chunchu was nine that first night');

	const kingOrSlave = pick('a king, or a slave');
	const obey = pick('I will obey.');
	const dontFollow = pick('Do not follow me.');
	const whyTellMe = pick('why are you telling me this?');
	const largerDream = pick('a man ought to hold a larger dream');
	const horse = pick('In Pyongyang, Gesomun offered me a horse');
	const cups = pick('Euija opens his mouth to laugh');
	const toastP = pick('Then he goes to the window');
	const toast = pick('May he trip on the stairs.');

	const caveScene = pick('The Sacred Cave');
	const map = old.find((b) => b.kind === 'map');
	const scrubbed = pick('The banquet hall has been scrubbed');
	const fiveBlades = pick('five blades still on his back');
	const kneels = pick('He kneels at the mouth');
	const quote = old.find((b) => b.kind === 'quote');
	const forge = pick('The Holy King forged a country here.');
	const direction = pick('Thank you for giving me a direction.');
	const bones = pick('Until every bone in me is broken.');
	const nextCard = pick('Gesomun wants a country.');

	saidOnce.html = saidOnce.html.replace('on this hill', 'on the hill');
	saidOnce.ko = saidOnce.ko.replace('이 언덕에서', '그 언덕에서');
	cups.html = cups.html.replace('across the table', 'across the stone');
	cups.ko = cups.ko.replace('상 건너로', '바위 위로 건너');
	toastP.html = toastP.html.replace('goes to the window with his own cup', 'goes to the edge of the rock with his own cup');
	toastP.ko = toastP.ko.replace('창가로 간다', '바위 끝으로 간다');

	/* Gesomun's vow loses its last line; it returns in the cross-cut. */
	const bonesVow = {
		...bones,
		lines: bones.lines.slice(0, 3),
		en: bones.en.slice(0, 3)
	};

	ep.logline = { en: 'Same star. Same minute. Three places.', ko: '같은 별. 같은 시각. 세 곳.' };
	if (!ep.badges.includes('flag:goguryeo')) ep.badges.push('flag:goguryeo');

	ep.blocks = [
		/* ——— Wolji ——— */
		p(
			'There is a hill above Surabol where two boys once lay on their backs and argued about a star. Thirty years on, they don’t climb it. They sit on the palace steps instead, which is what becomes of stargazers.',
			'서라벌 위에는 언덕이 하나 있다. 옛날 두 소년이 거기 드러누워 별 하나를 두고 다퉜다. 삼십 년 뒤, 둘은 언덕에 오르지 않는다. 궁궐 섬돌에 앉는다. 별 보던 아이들은 대개 그렇게 된다.'
		),
		place(
			'moon_palace',
			'The old palace keeps a pond. Tonight the pond keeps the lamps.',
			'옛 궁궐엔 못이 있다. 오늘 밤엔 그 못이 등불을 품는다.'
		),
		p(
			'The queen has had the pond lit for Daeya’s dead. Little lamps on the water, one for every name the heralds could find.',
			'여왕은 대야에서 죽은 이들을 위해 못에 불을 띄우게 했다. 물 위에 작은 등잔들. 전령들이 찾아낸 이름 하나에 하나씩.'
		),
		p(
			'Sunduk sets them on the water herself. Munhee stands beside her with one lamp in both hands and does not set it down.',
			'선덕이 손수 하나씩 물에 놓는다. 문희는 그 곁에 서서 등잔 하나를 두 손으로 들고 있다. 내려놓지 않는다.'
		),
		p(
			'Up on the pavilion steps, with their backs to all of it, sit two men. Yushin still has river-fort mud on his boots. Chunchu’s left hand is still in its sling. Neither of them mentions either.',
			'누각 섬돌 위, 그 모든 것에 등을 돌리고 두 사내가 앉아 있다. 유신의 장화엔 아직 강가 성의 진흙이 묻어 있다. 춘추의 왼손은 아직 천에 걸려 있다. 둘 다 그 얘기는 꺼내지 않는다.'
		),
		p(
			'And under the azaleas by the wall, a sixteen-year-old who was sent to bed an hour ago lies very still in the dirt, the way his uncle taught him to lie in a ditch.',
			'그리고 담장 밑 진달래 덤불 아래엔, 한 시진 전에 자러 가라는 소리를 들은 열여섯 살짜리가 흙바닥에 꼼짝 않고 엎드려 있다. 외삼촌이 도랑에 엎드리는 법을 가르쳐 준 그대로.'
		),
		nineThatNight,
		lessons,
		soWereYou,
		enoughNow,
		kingOfBaekje,
		grudge,
		say(
			'chunchu',
			[
				'Do you remember what I was, the first time you saw me?',
				'A Sacred Bone prince with a wooden sword, telling the gardeners which kingdoms they could keep.'
			],
			['형님, 저 처음 보셨을 때 제가 뭐였는지 기억하십니꺼?', '나무칼 찬 성골 왕자였지예. 정원지기들한테 어느 나라는 가져도 된다꼬 나눠 주던.']
		),
		say('yushin', ['You gave the gardeners Gaya. I’ve never forgiven you.'], ['가야는 정원지기들한테 주더구먼. 내 아직도 그거 안 잊었네.']),
		say(
			'chunchu',
			[
				'I was going to be king of all of it. Every kingdom under one roof, and the roof mine.',
				'Then they took the crown off my grandfather’s head, and it turned out my bones came off with it.'
			],
			[
				'그걸 다 다스릴 임금이 될 거라 캤지예. 삼한을 한 지붕 아래. 지붕은 제 끼고.',
				'그라다 할아버님 머리에서 왕관을 벗겼지예. 알고 보니 제 뼈도 같이 벗겨지데예.'
			]
		),
		say('yushin', ['You weren’t even born. It wasn’t yours to lose.'], ['자넨 나기도 전이었네. 자네가 잃은 게 아이다.']),
		say(
			'chunchu',
			[
				'No. Only mine to find out about. Nine years old, and a eunuch showing me where I stand at New Year now.',
				'Three rows back. Behind a pillar.'
			],
			['예. 알게 된 것만 제 몫이었지예. 아홉 살에, 내시가 정초에 이제 어디 서야 하는지 일러 주더이다.', '세 줄 뒤에. 기둥 뒤에.']
		),
		say('yushin', ['That was the night you came up the hill.'], ['그날 밤에 자네가 언덕에 올라왔제.']),
		say(
			'chunchu',
			[
				'And you were already there, pretending to read.',
				'After that I watched the court the way you watch dice in an inn. Everyone cheating, everyone outraged. I wasn’t going to sit at that table.'
			],
			[
				'형님은 벌써 거기서 책 읽는 척하고 계셨고예.',
				'그 뒤로는 조정을 주막 노름판 보듯 봤습니다. 다들 속이고, 다들 억울하다 카고. 저는 그 판엔 안 앉겠다 했지예.'
			]
		),
		say('yushin', ['So you joined the Hwarang and sat at mine.'], ['그래서 화랑에 들어와 내 판에 앉았제.']),
		say('chunchu', ['Yours had better wine.'], ['형님 판이 술이 낫더이다.']),
		say('yushin', ['Yours had worse footwork. You lost a coat string in my yard.'], ['자네 판은 발이 시원찮았제. 내 마당에서 옷고름을 떨궜으니.']),
		say(
			'chunchu',
			['You stepped on it, brother. On purpose. It took me seventeen years to work that out.'],
			['형님이 밟으셨지예. 일부러. 그거 알아채는 데 십칠 년 걸렸습니다.']
		),
		say('yushin', ['…Sixteen. Munhee told you last spring.'], ['…십육 년이제. 작년 봄에 문희가 일러 줬다 아이가.']),
		p(
			'Chunchu looks down at the water. Munhee hasn’t moved. Neither has the lamp.',
			'춘추가 못 쪽을 내려다본다. 문희는 그대로다. 등잔도 그대로다.'
		),
		say(
			'chunchu',
			[
				'She sewed it back on so slowly, brother. I thought, there it is. A whole life, and it fits in one yard.',
				'A son who argues. A daughter who rides too fast.'
			],
			[
				'그 사람이 옷고름을 어찌나 천천히 달던지예. 그때 생각했습니다. 아, 사람 한평생이 마당 하나에 다 들어가는구나.',
				'말대꾸하는 아들 하나. 말을 너무 빨리 모는 딸 하나.'
			]
		),
		littleInterest,
		whatAreYouSaying,
		say(
			'chunchu',
			[
				'I shut my gate and called the quiet peace. It was other men’s walls, brother. Daeya’s, mostly.',
				'I heard about my daughter from a salt merchant. A salt merchant.'
			],
			[
				'저는 대문 걸어 잠그고 조용한 걸 태평이라 불렀습니다. 그기 남의 성벽 덕이었지예. 거의 다 대야 성벽.',
				'제 딸 소식을 소금장수한테서 들었습니다. 소금장수한테서.'
			]
		),
		p(
			'Yushin says nothing. He has heard Chunchu talk his way out of every room in Surabol. He has never heard him say the same thing twice.',
			'유신은 아무 말도 하지 않는다. 춘추가 말로 서라벌의 모든 방을 빠져나가는 건 숱하게 들었다. 같은 말을 두 번 하는 건 처음 듣는다.'
		),
		theChair,
		besideYou,
		saidOnce,
		dontLike,
		standNext,
		say('chunchu', ['Then stand next to it in Sabi. We start with Baekje.'], ['그라믄 사비에서 곁에 서 주이소. 백제부터 합니다.']),
		say('yushin', ['Baekje first.'], ['백제부터.']),
		p(
			'Chunchu looks up. The eastern star is out over the pond, and there is another one in the water, among the lamps.',
			'춘추가 고개를 든다. 동쪽 별이 못 위에 떠 있다. 물속 등잔들 사이에도 하나 더 떠 있다.'
		),
		say('chunchu', ['There it is.'], ['저기 있네예.']),
		planet,
		thirtyYears,
		p('Under the azaleas, the boy has stopped breathing to listen.', '진달래 덤불 아래, 소년은 숨까지 참고 듣는다.'),

		/* ——— Deer Rock ——— */
		{ kind: 'scene', label: 'Deer Rock', ko: '정사암' },
		place(
			'deer_rock',
			'Heaven picks Baekje’s ministers here. Heaven has a cousin in every clan.',
			'하늘이 여기서 백제의 재상을 고른다. 하늘에겐 대성마다 사촌이 있다.'
		),
		p(
			'The clans put names in a box and leave the box on this rock. Whichever name comes back with a seal on it, heaven chose. Heaven, for the record, has never been near the box.',
			'대성들은 이름을 함에 넣어 이 바위에 둔다. 도장이 찍혀 돌아온 이름이 하늘의 뜻이다. 분명히 해 두자면, 하늘은 그 함 근처에도 가 본 적이 없다.'
		),
		p(
			'Tonight the rock has a king on it, a jar of wine, and one young captain who climbed up behind him because he was told to.',
			'오늘 밤 그 바위 위엔 임금 하나, 술 단지 하나, 그리고 젊은 장수 하나가 있다. 장수는 따라 올라오라 해서 따라 올라왔다.'
		),
		say('euija', ['You know what this rock is, Gyebek?'], ['계백아, 이 바위가 뭔지 아느냐?']),
		say('gyebek', ['Deer Rock. The clans choose the chief minister here.'], ['정사암입니다. 대성들이 좌평을 뽑는 곳입니다.']),
		say(
			'euija',
			[
				'The clans choose everything here. I learned to walk on this rock.',
				'My nurse was a Sa and my tutor was a Hae, and both of them ran home to tell their uncles which hand I ate with.'
			],
			['대성들이 다 뽑는 데지. 나는 이 바위에서 걸음마를 뗐다.', '유모는 사씨, 스승은 해씨. 둘 다 내가 어느 손으로 밥 먹는지 즈이 삼촌들한테 일러바치러 뛰어갔지.']
		),
		say('gyebek', ['Which hand?'], ['어느 손이었습니까?']),
		say(
			'euija',
			[
				'The left! To annoy them!',
				'Every clan wanted a prince. Nobody wanted a king. So I gave them a prince, and I gave it to them for thirty years.'
			],
			['왼손이지! 약 올리려고!', '대성마다 왕자는 원했다. 임금은 아무도 안 원했고. 그래서 왕자를 줬다. 삼십 년을 줬지.']
		),
		say('gyebek', ['And sons.'], ['그리고 아드님들.']),
		say(
			'euija',
			[
				'And sons! I stopped counting. The clerks didn’t. The clerks say forty-one.',
				'A prince busy making sons isn’t plotting. The clans slept like babies. So did I. Not alone.'
			],
			[
				'그리고 아들들! 나는 세다 말았다. 서기들은 안 말았지. 마흔하나랴.',
				'아들 만드느라 바쁜 왕자는 역모를 안 꾸미거든. 대성들은 두 발 뻗고 잤다. 나도 잤지. 혼자는 아니고.'
			]
		),
		p(
			'He laughs first, as usual. Gyebek doesn’t. Nobody has told him it was a joke.',
			'늘 그렇듯 의자가 먼저 웃는다. 계백은 웃지 않는다. 농담이라고 말해 준 사람이 없다.'
		),
		say(
			'euija',
			[
				'Then they put the crown on me anyway, and I looked down that hall.',
				'Every man in it had a clan behind him. Not one of them would have died for Baekje. For his uncle, sure.'
			],
			[
				'그러다 결국 왕관을 씌우더라. 그래서 그 전각을 내려다봤지.',
				'다들 뒤에 대성 하나씩 끼고 있더라. 백제를 위해 죽을 놈은 하나도 없었다. 즈이 삼촌을 위해서라면 몰라도.'
			]
		),
		say('gyebek', ['I would.'], ['저라면 죽습니다.']),
		say(
			'euija',
			['I know. That’s the trouble. Nobody ever asked you a thing, and you’re the only man in Sabi I’d believe.'],
			['안다. 그게 문제여. 아무도 너한테 뭘 물은 적이 없는디, 사비에서 내가 믿을 놈은 너 하나다.']
		),
		kingOrSlave,
		obey,
		dontFollow,
		horse,
		cups,
		toastP,
		toast,
		whyTellMe,
		say(
			'euija',
			[
				'Because I’m done being a prince.',
				'Baekje was something once, Gyebek. Other kings copied our ships. Now we’re a rock where clans count boxes.',
				'I’m going to wake it up.'
			],
			[
				'왕자 노릇은 이제 끝이니께.',
				'백제도 한때는 대단했다, 계백아. 딴 나라 임금들이 우리 배를 베꼈어. 지금은 대성들이 함이나 세는 바위 하나지.',
				'내가 다시 깨울 겨.'
			]
		),

		/* ——— Jumong Cavern ——— */
		caveScene,
		map,
		place(
			'jolbon',
			'Every northern vow begins here. Most of them end somewhere else.',
			'북방의 맹세는 다 여기서 시작한다. 끝나는 곳은 대개 딴 데다.'
		),
		scrubbed,
		fiveBlades,
		kneels,
		p(
			'He came alone. He told Dosuryu to wait at the bottom of the hill, and for once Dosuryu did.',
			'혼자 왔다. 도수류에겐 언덕 아래서 기다리라 했고, 웬일로 도수류가 그 말을 들었다.'
		),
		quote,
		forge,
		say(
			'gesomun',
			['Nobody’s coming, Holy King. Not the Tang. Not the south. Not heaven either, begging its pardon.'],
			['아무도 안 옵니다, 성왕이시여. 당나라도 안 오고, 남쪽도 안 오고. 하늘도 안 옵니다. 송구하지만.']
		),
		say(
			'gesomun',
			[
				'Good.',
				'A country that waits for help is a country on its knees. We eat our own grain. We ride our own horses. We bleed our own blood.',
				'This people stands on its own feet, or it doesn’t stand.'
			],
			[
				'잘됐습니다.',
				'도움을 기다리는 나라는 무릎 꿇은 나라요. 우리 곡식은 우리가 먹고, 우리 말은 우리가 타고, 우리 피는 우리가 흘립니다.',
				'이 겨레는 제 발로 서든지, 아니면 못 섭니다.'
			]
		),
		direction,
		say(
			'gesomun',
			['Let the kings have their crown dreams.', 'I don’t want a crown. I want walls that hold and people who eat.'],
			['임금들은 왕관 꿈이나 꾸라 하십시오.', '저는 왕관 필요 없습니다. 버티는 성벽, 배부른 겨레면 됩니다.']
		),
		say(
			'gesomun',
			['Give me strength. Not luck. Luck is for the Tang.', 'Enough to do it alone, if it has to be alone.'],
			['힘을 주십시오. 운 말고. 운은 당나라 놈들 거요.', '혼자 해야 한다믄, 혼자 할 만큼.']
		),
		p(
			'The cave gives him back his own voice, a little late. He decides that counts as an answer.',
			'동굴이 그의 목소리를 조금 늦게 되돌려 준다. 그는 그걸 대답으로 치기로 한다.'
		),
		bonesVow,

		/* ——— One star ——— */
		p('Same star. Same minute. Three places.', '같은 별. 같은 시각. 세 곳.'),
		easternStar,
		say('munmu', ['…The King for All…'], ['…삼한왕검…']),
		largerDream,
		say(
			'gesomun',
			['Whoever comes for it. Tang, Silla, Baekje. Anyone.', 'Even the one who would be—', '<b>The “King for All”…!</b>'],
			['누가 오든. 당이든, 신라든, 백제든. 누구든.', '설령 그게—', '<b>“삼한왕검”이라 해도…!</b>']
		),
		p(
			'Three men say it at the same moment. Four, if you count a boy under an azalea, and you should. None of them hears the others. The star hears all of them, and Yushin would like it noted that it is a planet.',
			'세 사내가 같은 순간에 같은 말을 한다. 진달래 밑의 소년까지 치면 넷이다. 쳐 줘야 한다. 아무도 다른 이의 말을 듣지 못한다. 별은 다 듣는다. 유신은 그게 행성이라는 걸 꼭 짚어 두고 싶어 할 것이다.'
		),
		p('<b>End of Part I.</b>', '<b>제1부 끝.</b>'),
		nextCard
	];
	if (ep.blocks.some((b) => !b)) throw new Error('undefined block');
	console.log(`Eastern Star: ${old.length} → ${ep.blocks.length} blocks`);
});
