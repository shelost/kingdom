/**
 * Suro (chunchu-era): Ijinasi on stage + intro card; the six Gaya nations as place cards and a one-line list of the little
 * ones; a new council scene on Turtle Peak (no high king, ends in laughter); the queen contest gets rivals, a book,
 * a sabotage and a bead. Idempotent on the council scene header. `DRY=1` to test.
 */
import { editStory } from '../story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
const PLACE = (place, html, ko) => ({ kind: 'place', place, html, ko });
const S = (speaker, gender, chip, en, ko) => ({ kind: 'dialogue', chip, speaker, gender, lines: ko, en });

const MARK = 'Turtle Peak · the next spring';

const GREY = '#8a8a94';
const IJINASI = '#6a34a6';
/* The league's purples, one per court (GayaLeague.svelte). */
const ARA = ['The king of Ara', '#7d4bbd'];
const GORYEONG = ['The king of Goryeong Gaya', '#c3a3ea'];
const SEONGSAN = ['The king of Seongsan', '#a983dc'];
const SOGAYA = ['The king of Sogaya', '#9468cf'];
const CHIEF = ['The eldest chief', GREY];
const RIDER = ['The rider from Goguryeo', '#b5402f'];
const MAHAN = ['The girl in the Mahan beads', '#3f8f6b'];
const DIVER = ['The diver from Tamla', '#2e7d9a'];
const WEAVER = ['The weaver’s daughter from Jinhan', '#a0527a'];

const king = ([who, chip], en, ko) => S(who, 'm', chip, en, ko);
const woman = ([who, chip], en, ko) => S(who, 'f', chip, en, ko);

editStory((story) => {
	const e = story.find((c) => c.id === 'chunchu-era').entries.find((x) => x.title === 'Suro');
	if (!e) throw new Error('no Suro');
	if (e.blocks.some((b) => b.kind === 'scene' && b.label === MARK)) return false;

	const B = e.blocks;
	const en = (b) => [b.html, ...(b.en ?? [])].filter(Boolean).join(' ');
	const at = (frag, pred = () => true) => {
		const hits = B.map((b, i) => (pred(b) && en(b).includes(frag) ? i : -1)).filter((i) => i >= 0);
		if (hits.length !== 1) throw new Error(`"${frag}" matched ${hits.length}`);
		return hits[0];
	};
	const chipOf = (person) => B.find((b) => b.kind === 'dialogue' && b.person === person)?.chip ?? GREY;
	for (const b of B) if (b.kind === 'dialogue' && b.person === 'ijinasi') b.chip = IJINASI;
	const D = (person, en, ko) => ({ kind: 'dialogue', chip: person === 'ijinasi' ? IJINASI : chipOf(person), person, lines: ko, en });

	/* ───────────── Turtle Peak: the six claims, the little ones, the council ───────────── */
	const iFrom = at('Six eggs. Six thrones.');
	const iCrown = at('So Gaya doesn’t have a crown.');
	const placeGeumgwan = B.find((b) => b.kind === 'place' && b.place === 'geumgwan');
	const ijinasiLine = B[iFrom];
	const suroSea = B[at('I want… the sea.')];
	const crownP = B[iCrown];
	const diagram = B[iCrown + 1];
	if (diagram?.kind !== 'diagram' || B[iCrown + 2] !== placeGeumgwan) throw new Error('unexpected Turtle Peak tail');

	const turtle = [
		{
			kind: 'card',
			person: 'ijinasi',
			caption: 'King Ijinasi. The other egg from the ridge. He counted the hills before he could walk.',
			ko: '이진아시왕. 능선에서 온 또 하나의 알. 걷기도 전에 언덕부터 셌다.'
		},
		ijinasiLine,
		suroSea,
		D(
			'ijinasi',
			['The sea?', 'You can’t stand on the sea. You can’t wall it. You can’t plant a thing in it.'],
			['바다?', '바다 위엔 못 서. 담도 못 쌓고, 뭘 심지도 못해.']
		),
		D('suro', ['…Ships come on it.', 'Things… arrive.'], ['…배가 오지 않소.', '무언가가… 들어온다오.']),
		D(
			'ijinasi',
			['“Things arrive.” Listen to him. Two weeks old and already waiting on a delivery.'],
			['“무언가가 들어온다.” 들어 봐라. 태어난 지 보름 된 게 벌써 뭘 기다려.']
		),
		P(
			'Ijinasi walks inland that same afternoon, up the river, counting hills under his breath. He picks the high valley where the iron sits closest to the grass, and calls it Great Gaya. He means it.',
			'이진아시는 그날 오후로 강을 거슬러 내륙으로 걷는다. 입속으로 언덕을 세면서. 쇠가 풀뿌리 바로 밑에 묻힌 높은 골짜기를 골라 대가야라 부른다. 진심이다.'
		),
		PLACE('daegaya', 'Great Gaya. The biggest hill, and the brother who counted it.', '대가야. 가장 큰 언덕, 그리고 그걸 세어 본 형제.'),
		P(
			'Suro stays on the beach. He builds a timber hall facing the water, then a market, then a pier, in that order. Ships come in before the pier is finished. The harbour gets a name, Golden Gaya. Suro was right about the sea, and Ijinasi will not mention it for forty years.',
			'수로는 바닷가에 남는다. 물을 바라보는 나무 전각을 짓고, 장터를 열고, 나루를 놓는다. 그 순서대로. 나루가 다 놓이기도 전에 배가 들어온다. 포구에 이름이 붙는다. 금관가야. 바다에 대해선 수로가 옳았고, 이진아시는 그 얘기를 사십 년 동안 꺼내지 않는다.'
		),
		placeGeumgwan,
		P(
			'The other four have their own ideas. One takes Ara, on the river bend to the west, and wants a horse before he can walk. His people will one day put armour on their horses, and on themselves as an afterthought.',
			'나머지 넷도 다 제 생각이 있다. 하나는 서쪽 강굽이의 아라를 가진다. 걷기도 전에 말부터 찾는다. 그 나라 사람들은 훗날 말에게 갑옷을 입히고, 그다음에야 생각난 듯 저희도 입는다.'
		),
		PLACE('ara', 'Ara. Horses first. Everything else after.', '아라가야. 말이 먼저. 나머지는 그다음.'),
		P(
			'One takes Goryeong Gaya, far up the river. He is so quiet his brothers forget to invite him to things.',
			'하나는 강을 한참 거슬러 올라간 고령가야를 가진다. 어찌나 조용한지 형제들이 모일 때마다 부르는 걸 잊는다.'
		),
		PLACE(
			'goryeonggaya',
			'Goryeong Gaya. Ask the others where it is. Watch them think.',
			'고령가야. 다른 형제들한테 어디 있냐고 물어보라. 한참 생각할 거다.'
		),
		P(
			'One takes Seongsan, the hill nearest the neighbours, and spends his life staring at them over the wall.',
			'하나는 이웃과 가장 가까운 언덕 성산을 가진다. 평생 담 너머 이웃을 노려본다.'
		),
		PLACE('seongsan', 'Seongsan. The wall faces out. So does he.', '성산가야. 담은 바깥을 본다. 그도 그렇다.'),
		P(
			'The last takes Sogaya, a bay full of boats, and smells of salt before he is a week old.',
			'막내는 배가 가득한 만, 소가야를 가진다. 태어난 지 이레도 안 돼 소금 냄새가 난다.'
		),
		PLACE('sogaya', 'Sogaya, which means Little Gaya. Nobody says that to his face.', '소가야. 작은 가야라는 뜻이다. 그 앞에서 그렇게 말하는 사람은 없다.'),
		P(
			'And those are only the six big ones. Round them the little ones crowd in, like boats round a good pier. The old villages keep Byeonhan names nobody can say twice: Mirimidong, Gojamidong, Jeopdo, Gamno. Later come Takseun, Takgitan, Sanbanha, Jolma, Dara, Gimun, Bihwa, and more. Each has a chief, a wall and a grudge. Don’t try to remember them. The six didn’t.',
			'이건 큰 여섯일 뿐이다. 그 둘레로 작은 나라들이 좋은 나루에 배 몰리듯 몰려든다. 오래된 마을들은 두 번 말하기도 힘든 변한 이름을 지니고 있다. 미리미동, 고자미동, 접도, 감로. 나중엔 탁순, 탁기탄, 산반하, 졸마, 다라, 기문, 비화, 그리고 더. 저마다 추장 하나, 담 하나, 원한 하나씩 있다. 외우려 하지 마시라. 여섯도 안 외웠다.'
		),
		P(
			'Six boys, six kings before their voices break. That leaves the nine chiefs with a question nobody on this coast has ever had to ask. Which one is the king?',
			'사내아이 여섯이 목소리가 굵어지기도 전에 임금 여섯이 된다. 그러자 아홉 추장에게 이 바닷가 누구도 물어본 적 없는 질문이 남는다. 그래서 누가 임금인가?'
		),

		SCENE(MARK, '구지봉 · 이듬해 봄'),
		P(
			'The chiefs call all six back to the peak where the box came down. Six young kings, one hilltop, no chairs. The chiefs thought chairs would only start an argument. The chiefs have met these boys.',
			'추장들이 상자가 내려왔던 봉우리로 여섯을 다시 부른다. 젊은 임금 여섯, 꼭대기 하나, 의자는 없다. 의자를 놓으면 싸움만 날 거라고 추장들은 생각했다. 추장들은 이 아이들을 겪어 봤다.'
		),
		king(
			CHIEF,
			['Majesties. Heaven sent six of you. The coast was hoping for one.', 'Choose. Any of you. We’ll bow to whoever’s left standing.'],
			['전하들. 하늘은 여섯을 보내셨는데, 바닷가는 하나를 바랐습니다.', '고르십시오. 누구든. 끝까지 서 계신 분께 절하겠습니다.']
		),
		D('ijinasi', ['Fine. Me.', 'Biggest hill, most iron, most men. Count it yourself.'], ['좋아. 나.', '언덕 제일 크고, 쇠 제일 많고, 사람 제일 많아. 세어 봐.']),
		king(SEONGSAN, ['And while you’re counting, who watches my wall?'], ['네가 세는 동안 내 담은 누가 지키는데?']),
		D('ijinasi', ['I would.', 'From my hill.'], ['내가.', '내 언덕에서.']),
		king(SEONGSAN, ['That’s what I’m afraid of.'], ['그게 무섭다는 거야.']),
		king(ARA, ['Whoever it is, I want horses.', '…Not now. Generally.'], ['누가 되든 난 말 줘.', '…지금 말고. 그냥 대체로.']),
		king(
			SOGAYA,
			['He wants horses. I want the tide in on time. Can a king do that?'],
			['얘는 말 달래. 난 물때가 제때 들어왔으면 좋겠는데. 임금이 그거 해 줘?']
		),
		D('ijinasi', ['No.'], ['아니.']),
		king(SOGAYA, ['Then what’s he for?'], ['그럼 뭐 하러 있는데?']),
		king(CHIEF, ['Majesty Suro. You were first out of the box.'], ['수로 전하. 상자에서 제일 먼저 나오셨지요.']),
		D(
			'suro',
			['…By half a breath.', 'That is… not a reason.', 'I don’t want his hill. I don’t want anybody’s hill.'],
			['…숨 반 박자 먼저요.', '그건… 이유가 못 되오.', '과인은 저 언덕 원치 않소. 누구 언덕도.']
		),
		D('ijinasi', ['He wants the sea. He’s expecting a delivery.'], ['얘는 바다를 원해. 뭐 배달 올 게 있대.']),
		king(SOGAYA, ['From who?'], ['누구한테서?']),
		D('suro', ['…It hasn’t come yet.'], ['…아직 안 왔소.']),
		P(
			'It goes round the hilltop like that until noon. Ijinasi calls a vote, counts it, loses, and calls for a recount. The Seongsan king votes for nobody, on principle. The Ara king votes for whoever said “horse” last.',
			'정오까지 꼭대기에서 말이 그렇게 돈다. 이진아시가 표결을 하자고 하고, 세고, 지고, 다시 세자고 한다. 성산 임금은 원칙상 아무도 안 찍는다. 아라 임금은 마지막에 ‘말’ 소리 한 사람을 찍는다.'
		),
		king(
			CHIEF,
			['Majesties. We nine have argued over one boundary stone for eleven years.', 'Please. Don’t make it twelve.'],
			['전하들. 저희 아홉은 경계석 하나로 열한 해를 싸웠습니다.', '제발. 열두 해로 만들지 마십시오.']
		),
		king(GORYEONG, ['Why one?'], ['왜 하나야?']),
		P('Five heads turn. Nobody saw him sit down.', '고개 다섯이 돌아간다. 그가 언제 앉았는지 아무도 못 봤다.'),
		king(SOGAYA, ['…When did you get here?'], ['…너 언제 왔어?']),
		king(
			GORYEONG,
			[
				'I came with the eggs.',
				'Six houses. Six roofs. Everybody minds his own.',
				'When one roof catches fire, we all bring water. Then we go home.'
			],
			['알이랑 같이 왔는데.', '집 여섯. 지붕 여섯. 다들 제 지붕 돌보고.', '어느 지붕에 불나면 다 같이 물 들고 가. 그러고 집에 가.']
		),
		king(CHIEF, ['…So that’s no king, then.'], ['…그럼 임금이 없는 거군요.']),
		king(GORYEONG, ['That’s six.'], ['여섯인 거지.']),
		king(SEONGSAN, ['…And my wall stays where it is?'], ['…내 담은 그대로고?']),
		king(GORYEONG, ['Your wall stays.'], ['네 담은 그대로.']),
		king(ARA, ['And horses?'], ['말은?']),
		king(GORYEONG, ['Buy them off Suro. He’ll have boats.'], ['수로한테 사. 배 있잖아.']),
		D('ijinasi', ['And if one roof gets too big?'], ['어느 지붕이 너무 커지면?']),
		P('Nobody answers. Everybody looks at Ijinasi.', '아무도 대답하지 않는다. 다들 이진아시를 본다.'),
		D('ijinasi', ['…What.'], ['…뭐.']),
		D(
			'suro',
			['…Then we all climb his hill.', 'And sing at him. Turtle, turtle…', 'show your head—'],
			['…그럼 다 같이 그 언덕에 올라가면 되오.', '그리고 노래를 불러 주는 거요. 거북아, 거북아…', '머리를 내어라—']
		),
		king(SOGAYA, ['—or we’ll roast you!'], ['—안 내면 구워 먹는다!']),
		P(
			'The Sogaya king goes first, through his nose. Then Ara. The Seongsan king tries to keep an eye on his wall and can’t. The quiet one laughs without a sound, shoulders going. Ijinasi holds out longest, which is the most Ijinasi thing anyone has seen him do, and then he is flat on his back in the grass where he hatched, howling. Suro laughs last. He said it, and he is only now hearing it.',
			'소가야 임금이 먼저 코로 터진다. 그다음 아라. 성산 임금은 담 쪽을 계속 보려다가 못 버틴다. 조용한 형제는 소리 없이 웃는다. 어깨만 들썩인다. 이진아시가 제일 오래 버틴다. 지금껏 본 중 가장 이진아시다운 짓이다. 그러다 제가 깨어난 풀밭에 벌러덩 누워 꺽꺽 웃는다. 수로가 마지막으로 웃는다. 제가 한 말을 이제야 들은 것이다.'
		),
		crownP,
		diagram
	];
	B.splice(iFrom, iCrown + 3 - iFrom, ...turtle);
	const oldClaims = ['The other four have their own ideas. One takes Ara, and wants', 'Six boys, six kings before their voices break. Suro’s harbour'];
	for (const frag of oldClaims) if (B.some((b) => en(b).includes(frag))) throw new Error(`stale block: ${frag}`);

	/* ───────────── The Red Sail: rivals, the book, the beads ───────────── */
	const after = (frag, blocks) => B.splice(at(frag) + 1, 0, ...blocks);

	after('more jade beads than skin', [
		P(
			'The rider from Goguryeo walks her horse over to pull her arrow out of the post, and takes a good long look at the beads on the way.',
			'고구려 기수가 기둥에서 화살을 뽑으러 말을 몰고 가다가, 가는 길에 그 구슬을 한참 훑어본다.'
		),
		woman(RIDER, ['Can you lift your arms in all that?'], ['그거 다 걸고 팔은 올라가?']),
		woman(MAHAN, ['I don’t need to. People lift things for me.'], ['올릴 필요 없어요. 남들이 들어 주니까.']),
		woman(RIDER, ['Horses don’t.'], ['말은 안 들어 줘.']),
		woman(MAHAN, ['Then I’ll marry the man, and you can have the horse.'], ['그럼 난 사내랑 혼인할게요. 말은 그쪽 가지세요.'])
	]);

	after('A king can’t think on a dais.', [
		P(
			'On the second morning a second plain coat turns up beside him, on a man who has never looked plain in his life.',
			'둘째 날 아침, 그의 옆에 수수한 두루마기가 하나 더 나타난다. 평생 수수해 보인 적 없는 사내가 입었다.'
		),
		D(
			'ijinasi',
			[
				'Hiding in a crowd. At your own wedding.',
				'Half of them can already tell, you know. You’re the only man on this beach not looking at the women. You’re looking at the sea.'
			],
			['제 혼삿날에 구경꾼 틈에 숨다니.', '반은 벌써 알아봤어. 이 해변에서 여자들 안 보는 사내는 너 하나야. 넌 바다를 보고 있잖아.']
		),
		D('suro', ['…I am looking at the women.', 'Between ships.'], ['…여인들을 보고 있소.', '배와 배 사이에.']),
		D(
			'ijinasi',
			[
				'The chiefs are running a book. Mahan’s the favourite. Beads count for more than gold over there, and the chiefs can count.',
				'I put a sack of iron on the one with the bow.'
			],
			['추장들이 판을 벌였어. 마한이 일번이야. 거기선 구슬이 금보다 비싸고, 추장들은 셈을 할 줄 알거든.', '난 활 든 애한테 쇠 한 자루 걸었다.']
		),
		D('suro', ['…Why her.'], ['…어째서 그 여인이오.']),
		D(
			'ijinasi',
			[
				'She put an arrow in your welcome post. A woman like that puts the next one in your enemies.',
				'And she’s been hunting for you since sunrise.'
			],
			['네 환영 기둥에 화살을 박았잖아. 그런 여자는 다음 화살을 네 원수한테 박아.', '그리고 해 뜰 때부터 너 사냥 중이야.']
		),
		D('suro', ['…She has not found me.'], ['…아직 못 찾았소.']),
		D('ijinasi', ['Yet.'], ['아직은.'])
	]);

	after('will not say what happened in the dream', [
		P(
			'She looks at each of the other women in turn. At the Mahan girl she smiles, the way you smile at a funeral you’ve been invited to.',
			'그녀는 다른 여자들을 하나씩 차례로 본다. 마한 처녀를 볼 때는 웃는다. 초대받은 장례식에서 짓는 그런 웃음이다.'
		)
	]);

	after('wringing out her hair', [
		P(
			'She walks straight into the crowd, still wringing, and stops in front of a man in a plain coat. She finishes. Most of it lands on his feet. She holds his eyes the whole time. Then she walks on.',
			'그녀는 머리를 짜며 곧장 구경꾼들 사이로 걸어 들어가, 수수한 두루마기 입은 사내 앞에 선다. 마저 짠다. 물은 거의 다 그의 발등에 떨어진다. 그동안 내내 눈을 떼지 않는다. 그러고는 지나간다.'
		),
		D('suro', ['…She—'], ['…저 여인이—']),
		D('ijinasi', ['She knows.'], ['알아.']),
		D('suro', ['She does not know.'], ['모르오.']),
		D(
			'ijinasi',
			['She wrung her hair out on your feet, brother. She knows.', 'I’m moving half my iron.'],
			['네 발등에 머리를 짰어, 형. 알아.', '쇠 반 자루 옮긴다.']
		),
		P(
			'Up the beach, the rider from Goguryeo has seen it too. She turns her stolen horse and walks it down through the crowd, close enough that Suro has to step back, and looks down at him the way she looked at the welcome post.',
			'해변 위쪽에서 고구려 기수도 그걸 봤다. 훔친 말을 돌려 구경꾼 틈으로 천천히 내려온다. 수로가 한 걸음 물러설 만큼 가까이. 그리고 환영 기둥을 보던 그 눈으로 그를 내려다본다.'
		),
		woman(RIDER, ['Found you.', 'Next time, hide behind somebody taller.'], ['찾았다.', '다음엔 좀 큰 사람 뒤에 숨어.']),
		D('suro', ['…I was not hiding.', 'I was… judging.'], ['…숨은 게 아니오.', '과인은… 심사하는 중이었소.']),
		woman(RIDER, ['Then judge this.'], ['그럼 이것도 심사해 봐.']),
		P(
			'She wheels the horse. The spray off its hooves catches the Tamla diver, who is already soaked and takes it personally anyway.',
			'그녀가 말머리를 돌린다. 말굽에서 튄 물보라가 탐라 해녀를 덮친다. 이미 흠뻑 젖었는데도 해녀는 그걸 사적인 모욕으로 받는다.'
		),
		woman(DIVER, ['Do that again and I’ll drown your horse.'], ['한 번만 더 해 봐. 네 말 빠뜨려 버린다.']),
		P(
			'By the third day there are factions. Dongye and Okjeo, neighbours up the east coast, have pooled the sealskins and the salted fish and are voting for each other. The Nangnang lady has lent the Han niece her mirror, so the niece can see how green she is. The smith’s daughter has found the forge and won’t come out. The weaver keeps looking at hems.',
			'사흘째가 되자 패가 갈린다. 동해안 이웃인 동예와 옥저는 바다표범 가죽과 절인 생선을 한데 모으고 서로를 밀어준다. 낙랑 아씨는 한나라 조카딸에게 거울을 빌려준다. 제 얼굴이 얼마나 파랗게 질렸는지 보라고. 대장장이 딸은 대장간을 찾아 들어가서 안 나온다. 비단 집 딸은 계속 옷단을 본다.'
		),
		king(
			CHIEF,
			['Majesty. Mahan’s still on top. The bow girl’s climbing. And somebody put half a sack of iron on the diver.'],
			['전하. 마한이 여전히 일번입니다. 활 든 처녀가 올라오고 있고요. 그리고 누가 해녀한테 쇠 반 자루를 걸었습니다.']
		),
		D('ijinasi', ['Somebody did.'], ['누가 걸었지.']),
		D('suro', ['…Who bets on a queen.'], ['…누가 왕비에 내기를 거오.']),
		D('ijinasi', ['Everyone, brother. You’re the only one on this beach who hasn’t.'], ['다 걸어, 형. 이 해변에서 안 건 사람은 너 하나야.']),
		P(
			'On the fourth night the chiefs hold a feast, so the women can be looked at properly, by lamplight, which is kinder. Each of them dances once. Suro stands at the back in the plain coat with a wine jar, pouring. Half the hall knows. Nobody says.',
			'나흘째 밤, 추장들이 잔치를 연다. 여자들을 제대로, 등잔불 아래서 보자는 것이다. 등잔불이 더 너그럽다. 저마다 한 번씩 춤을 춘다. 수로는 수수한 두루마기 차림으로 뒤편에 서서 술동이를 들고 술을 따른다. 전각의 절반은 안다. 아무도 말하지 않는다.'
		),
		P(
			'The Mahan girl dances last, slowly, because she has to, and well. Halfway through, her great rope of beads gives way. You remember the weaver’s daughter who spent the contest inspecting hems? She was not admiring them. She was looking for knots.',
			'마한 처녀가 마지막으로 춘다. 천천히, 그럴 수밖에 없으니까. 그리고 잘. 중간쯤에서 그 굵은 구슬 줄이 끊어진다. 겨루는 내내 옷단만 살피던 비단 집 딸, 기억하시는지? 감탄하고 있던 게 아니다. 매듭을 찾고 있었다.'
		),
		P(
			'Jade goes everywhere: across the floor, under the tables, into the salted fish. The chiefs dive after it like boys. The Mahan girl does not dive. She stands in the middle of the floor, bare-throated for the first time in her life, and keeps dancing.',
			'옥이 사방으로 튄다. 바닥을 가로질러, 상 밑으로, 절인 생선 속으로. 추장들이 아이들처럼 엎드려 줍는다. 마한 처녀는 엎드리지 않는다. 난생처음 맨목이 된 채로 바닥 한가운데 서서 계속 춤을 춘다.'
		),
		P(
			'One man comes through the scramble on his knees, a wine jar still in one hand. He picks up the last bead from beside her foot and holds it up to her.',
			'사내 하나가 술동이를 한 손에 든 채 무릎으로 그 북새통을 헤치고 온다. 그녀의 발치에서 마지막 구슬을 집어 그녀에게 들어 올린다.'
		),
		woman(MAHAN, ['…You’re the king.'], ['…임금님이시네요.']),
		D('suro', ['…I am the man with the wine.'], ['…과인은 술 따르는 사람이오.']),
		woman(
			MAHAN,
			['You’re on your knees.', 'Keep it. Give it back when you’ve made up your mind.'],
			['무릎 꿇고 계시잖아요.', '가지세요. 마음 정하시면 돌려주시고요.']
		),
		woman(WEAVER, ['Cheap knots. Not my fault.'], ['매듭이 싸구려네. 내 탓 아니야.']),
		P(
			'Overnight, the book moves. The Mahan girl goes from favourite to certainty. The king knelt. The chiefs start talking about dowries.',
			'하룻밤 새 판이 움직인다. 마한 처녀가 일번에서 확정으로 올라선다. 임금이 무릎을 꿇었으니까. 추장들은 혼수 얘기를 시작한다.'
		)
	]);

	after('You’re standing on my fish.', [
		P(
			'All along the beach, the contest turns round to look. The rider lowers her bow. The diver stops wringing her hair. The Mahan girl puts a hand to her throat, where the beads used to be.',
			'해변을 따라 겨루던 여자들이 모두 돌아본다. 기수가 활을 내린다. 해녀가 머리 짜던 손을 멈춘다. 마한 처녀가 한 손을 목에 올린다. 구슬이 있던 자리에.'
		),
		D('ijinasi', ['…Who had the red sail?'], ['…붉은 돛에 건 사람?']),
		king(CHIEF, ['Nobody had the red sail, Majesty.'], ['아무도 안 걸었습니다, 전하.']),
		D('ijinasi', ['Then nobody wins.'], ['그럼 아무도 못 땄네.']),
		king(CHIEF, ['The house wins, Majesty. We ran the book.'], ['판을 연 쪽이 땁니다, 전하. 저희가 열었지요.'])
	]);

	after('They will be married a hundred and fifty years.', [
		P(
			'The others go home with better stories than they came with. The rider keeps the stolen horse. The diver swims. Dongye and Okjeo are still voting for each other. The weaver opens a stall by the pier and does very well in knots. On the wedding morning the king walks down to the Mahan tents himself, puts one jade bead in a girl’s palm, and says nothing. She keeps it all her life, and tells her grandchildren a version where she won.',
			'다른 여자들은 올 때보다 나은 이야깃거리를 안고 돌아간다. 기수는 훔친 말을 그냥 가진다. 해녀는 헤엄쳐 간다. 동예와 옥저는 아직도 서로를 민다. 비단 집 딸은 나루 옆에 가게를 내고 매듭으로 꽤 재미를 본다. 혼례 날 아침, 임금은 몸소 마한의 천막으로 내려가 처녀의 손바닥에 옥구슬 하나를 올려놓는다. 아무 말 없이. 그녀는 평생 그 구슬을 지니고, 손주들에게는 자기가 이긴 이야기를 들려준다.'
		)
	]);

	/* The six-kingdoms plate sits on the little ones, not on the first "Golden Gaya". */
	const six = (e.images ?? []).find((im) => im.id === 'gaya_06');
	if (six) six.at = 'only the six big ones';

	if (process.env.DRY) {
		console.log('ok (dry)', B.length);
		return false;
	}
	return true;
});
