/**
 * Scenes pass — Gaya (#11 Sadaham, #44 Muryuk, #46 Seohyun's 562 section).
 * #11: drop Yushin's yard frame, unwrap the flashbacks into a straight 560 → 564 telling, stage the Battle of Great Gaya,
 *      and add the crossover: an unnamed Silla general with a Gaya accent talks hwarang with Sadaham by the cut rope.
 * #44: the ford becomes "The Battle of Golden Gaya" (in medias res); a late 562 scene shows the same night from Muryuk's side.
 * #46: the 562 section becomes Seohyun's angle — twelve, holding the horses, hearing the talk in pieces.
 * Idempotent: skips once #11 has the rope-coil line.
 */
import { editStory } from '../story-ops.mjs';

const MARK = 'You’re the Gaya one. You talk like the gate.';

const english = (b) => [b.html, ...(b.en ?? []), b.label, b.caption].filter(Boolean).join(' ');
const clone = (b) => JSON.parse(JSON.stringify(b));

let CHIP = {};
const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const say = (person, en, ko, extra = {}) => ({ kind: 'dialogue', person, ...(CHIP[person] ? { chip: CHIP[person] } : {}), lines: ko, en, ...extra });
const extra = (speaker, en, ko, gender = 'm') => ({ kind: 'dialogue', chip: '#7f96b5', speaker, gender, lines: ko, en });
const mono = (person, html, ko) => ({ kind: 'monologue', person, html, ko });

function pick(blocks, name) {
	return (frag, pred = () => true) => {
		const hits = blocks.filter((b) => pred(b) && english(b).includes(frag));
		if (hits.length !== 1) throw new Error(`${name}: ${hits.length} blocks with “${frag}”`);
		return hits[0];
	};
}

editStory((story) => {
	const all = story.flatMap((c) => c.entries);
	const S11 = all.find((e) => e.title === 'Sadaham');
	const M = all.find((e) => e.title === 'Muryuk');
	const SH = all.find((e) => e.title === 'Seohyun');
	if (S11.blocks.some((b) => english(b).includes(MARK))) {
		console.log('scenes-gaya: already applied');
		return false;
	}
	for (const e of all)
		for (const b of e.blocks) if (b.kind === 'dialogue' && b.person && b.chip && !CHIP[b.person]) CHIP[b.person] = b.chip;

	/* ——— old pieces ——— */
	const fb = (title) => S11.blocks.find((b) => b.kind === 'flashback' && b.title === title).blocks;
	const first = fb('the first class');
	const young = fb('too young');
	const prize = fb('the prize');
	const swear = fb('the swear');
	const seven = fb('seven days');
	const top = pick(S11.blocks, 'Sadaham');
	const hook = top('Every yard has its ghosts.');
	const ssQuote = S11.blocks.find((b) => b.kind === 'quote' && (b.hanja ?? '').includes('栴檀門'));
	const nsQuote = S11.blocks.find((b) => b.kind === 'quote' && (b.source ?? '').startsWith('Nihon Shoki'));
	const card = S11.blocks.at(-1);

	const sh = pick(SH.blocks, 'Seohyun');
	const shAt = (frag) => SH.blocks.findIndex((b) => english(b).includes(frag));
	const gateLines = ['They said too young.', 'Don’t die first.', 'Then keep up.'].map((f) => sh(f, (b) => b.kind === 'dialogue'));
	const alone = sh('Let me walk up first. Alone.');
	const shoot = sh('They’ll shoot you.');
	const keepWarm = sh('Then keep the gate warm for me.');
	const charge = sh('Sadaham does not wait for anyone to finish a sentence.');
	const archer = sh('A child, that is. They sent a child');
	const wallAnswers = sh('The wall answers first.');
	const shortMean = sh('Inside the walls the fighting is short and mean');
	const oldLordsP = sh('He finds the old lords of Daegaya in the hall');
	const lord1 = sh('Geumgwan’s youngest, is it.');
	const nobodySent = sh('Nobody sent me. Asked to come, I did.');
	const lord2 = sh('What’s it like, then? Over there.');
	const cold = sh('Cold, for the first ten years.');
	const goodPrice = sh('Gaya has always listened to a good price.');
	const showingOff = sh('Mugwan says I’m showing off.');
	const areYou = sh('Are you?', (b) => b.person === 'muryuk');
	const aLittle = sh('Somebody should get to go home.');
	const faceFront = sh('Now I can face front.');
	const embarrassed = sh('Live long enough to be embarrassed by tonight');
	const bothOfUs = sh('Mugwan will be embarrassed for both of us.');
	const shortYear = sh('Neither of them knows how short a year can be.');

	/* ——— the night by the cut rope: one conversation, three angles ——— */
	const C = {
		rope: say('sadaham', ['If it’s the rope you want, I cut it. All of it.', 'Ask the king for more.'], ['밧줄 찾으러 오셨으면, 제가 다 끊었어요.', '더 필요하시면 임금님께 달라 하세요.']),
		rice: say('muryuk', ['I came for the rice.', 'Smells better than ours, it does.'], ['밥 냄새 맡고 왔다.', '우리 진 밥보다 냄새가 낫구마.']),
		helmet: say('sadaham', ['It’s in my helmet.'], ['투구에 담은 건데요.']),
		worse: say('muryuk', ['I’ve eaten out of worse.'], ['더한 데서도 먹어 봤다.']),
		gayaOne: say('sadaham', [MARK], ['가야 분이시죠. 말씨가 저 성문이랑 똑같네요.']),
		soThey: say('muryuk', ['So they keep telling me.'], ['다들 그렇게 부르더군.']),
		yours: say('sadaham', ['Were any of them yours? The ones on the rope.'], ['그중에 아는 사람 있었어요? 줄에 묶였던 사람들.']),
		allNone: say('muryuk', ['All of them. None of them.', 'Eat your rice.'], ['전부. 아무도 아니고.', '밥이나 먹어라.']),
		helmOff: say('sadaham', ['You walked up to that gate with your helmet off.', 'I’d have been shot.'], ['아까 투구 벗고 성문으로 걸어 올라가셨잖아요.', '저였으면 맞았을 거예요.']),
		charged: say('muryuk', ['You’d have charged it. They were waiting for that.'], ['넌 돌격했겠지. 저들은 그걸 기다리고 있었다.']),
		didCharge: say('sadaham', ['I did charge it.'], ['돌격했잖아요.']),
		welcome: say('muryuk', ['After they’d spent their arrows on an old man. You’re welcome.'], ['늙은이한테 화살 다 쓴 다음에. 고맙단 말은 됐다.']),
		cough: p(
			'Sadaham laughs with his mouth full, which is a mistake, and spends a while coughing rice into the fire.',
			'사다함이 입에 밥을 문 채 웃는다. 실수다. 한동안 모닥불에 밥알을 뱉으며 기침을 한다.'
		),
		what: say(
			'muryuk',
			['What is it, then. This hwarang.', 'In the capital I see you lot up the hills with flowers in your hair, singing. Then today you go through a gate like a debt collector.'],
			['그래서 그게 뭐꼬. 화랑이란 거.', '도성에선 너희들 머리에 꽃 꽂고 산에서 노래나 부르더니. 오늘은 빚 받으러 온 놈처럼 성문을 뚫고 들어가더군.']
		),
		old: say('sadaham', ['You don’t know? Everyone knows.', 'It’s because you’re old.'], ['모르세요? 다 아는데.', '늙으셔서 그래요.']),
		slow: say('muryuk', ['Old, I am. Tell it slow, then.'], ['늙었지. 그럼 천천히 말해 봐라.']),
		boys: say(
			'sadaham',
			['It’s boys. Good families. The king picks one of us to lead, and the rest follow him up mountains, and we ride, and we sing, and—'],
			['사내애들이에요. 집안 좋은. 임금님이 하나 골라 앞세우면 나머지가 산으로 따라다니고, 말 타고, 노래하고, 그리고—']
		),
		sing: say('muryuk', ['Sing.'], ['노래.']),
		important: say('sadaham', ['The singing’s important. Don’t laugh.'], ['노래가 중요해요. 웃지 마세요.']),
		notLaughing: say('muryuk', ['I’m not laughing.'], ['안 웃는다.']),
		who: say('muryuk', ['Who gets in?'], ['누가 들어가나?']),
		face: say('sadaham', ['Anyone with a good face and a better family.', '…And me.'], ['얼굴 반반하고 집안은 더 좋은 애들이면 누구든.', '…그리고 저요.']),
		swear: say('muryuk', ['And what do you swear? Everybody swears something.'], ['맹세는 뭘 하나? 다들 뭔가 걸고 맹세하잖나.']),
		official: say(
			'sadaham',
			['There’s the official one. Loyalty, the king, the mountains. Nobody remembers the words.', 'Then there’s the real one.'],
			['공식으로 하는 게 있어요. 충성, 임금님, 산. 말은 아무도 기억 못 해요.', '그리고 진짜가 있고요.']
		),
		which: say('muryuk', ['Which is?'], ['그게 뭔데?']),
		chin: p(
			'Sadaham doesn’t answer. He tips his chin at the cart wheel, where Mugwan has fallen asleep sitting up, snoring loud enough to bother the horses.',
			'사다함은 대답하지 않는다. 턱으로 수레바퀴 쪽을 가리킨다. 무관랑이 앉은 채 잠들어, 말들이 신경 쓸 만큼 크게 코를 골고 있다.'
		),
		snores: say('sadaham', ['He says that’s me. It’s him.'], ['쟤는 코 고는 게 저래요. 자기면서.']),
		isIt: say('muryuk', ['…That’s the swear, is it.'], ['……그게 맹세라.']),
		thatsIt: say('sadaham', ['That’s the swear.'], ['그게 맹세예요.']),
		why: say('muryuk', ['And the rope? Why let them go?'], ['밧줄은? 왜 풀어 줬나?']),
		boy: say('muryuk', ['I’ve a boy. That one, with the horses.'], ['나도 아들이 하나 있다. 저기, 말 잡고 있는 녀석.']),
		wrong: say('sadaham', ['He’s holding them wrong.'], ['잘못 잡고 있네요.']),
		twelve: say('muryuk', ['He’s twelve.'], ['열둘이다.']),
		wasTwelve: say('sadaham', ['I was twelve.'], ['저도 열둘이었어요.']),
		hope: say('muryuk', ['…So you were.', 'I hope he turns out like you.'], ['……그랬겠지.', '저 녀석이 너처럼 컸으면 좋겠구마.']),
		likeHow: say('sadaham', ['Like me how? I’m the best rider in the whole—'], ['저처럼 어떻게요? 제가 서라벌에서 말은 제일—']),
		notRiding: say('muryuk', ['Not the riding.'], ['말 타는 거 말고.'])
	};
	const c = (...keys) => keys.map((k) => clone(C[k]));
	const unnamed = (blocks) =>
		blocks.map((b) => {
			if (b.person === 'muryuk') b.look = 'unnamed';
			return b;
		});

	/* ——— #11 SADAHAM ——— */
	const [ssay, smugwan] = [first.find((b) => b.kind === 'card' && b.person === 'sadaham'), first.find((b) => b.kind === 'card' && b.person === 'mugwan')];
	if (!ssay || !smugwan) throw new Error('Sadaham: cards missing');
	const opening = first.slice(1);
	const yard = p(
		'The yard is new this year, and so is the idea. The king wants boys who will ride ahead of the army and not ask why. The first year he gets a lot of them. Two of them get each other.',
		'올해 연무장은 새것이고, 그 생각도 새것이다. 왕은 군대보다 앞서 달리면서 이유를 묻지 않을 소년들을 원한다. 첫해에 그런 소년은 많이 온다. 그중 둘은 서로를 얻는다.'
	);
	const hallOpen = young[0];
	hallOpen.html =
		'Two summers on, the little stone has worn a hole in Sadaham’s sleeve, and Great Gaya stops paying. The king calls the war in his hall, and the hall fills up with men old enough to have opinions.';
	hallOpen.ko = '두 해 뒤 여름, 작은 돌은 사다함의 소매에 구멍을 냈고, 대가야는 공물을 끊는다. 왕은 전당에서 전쟁을 정하고, 전당은 할 말이 있을 만한 나이의 사내들로 가득 찬다.';
	const asks = young.find((b) => english(b).includes('was fifteen when he asked'));
	asks.html =
		'<b>Sadaham</b> is fifteen when he asks to ride against Great Gaya. He asks on his knees, in front of everyone. It is the only way a boy can ask a king for anything and not be sent outside.';
	asks.ko = '<b>사다함</b>은 열다섯에 대가야를 치겠다고 청한다. 무릎을 꿇고, 모두가 보는 앞에서. 소년이 왕에게 무언가를 청하면서 쫓겨나지 않는 방법은 그것뿐이다.';

	const prizeOpen = prize[0];
	const knot = prize.slice(1, 3);
	const alcheon = prize[3];
	const coughOpen = swear[0];
	coughOpen.html = 'That winter the snoring turns into a cough Mugwan cannot put down. Sadaham sits by the mat and counts his breathing, the way they used to count snores.';
	coughOpen.ko = '그 겨울, 코 고는 소리가 무관랑이 내려놓을 수 없는 기침으로 바뀐다. 사다함은 자리 옆에 앉아 숨소리를 센다. 예전에 코 고는 소리를 세던 것처럼.';
	const dies = swear.at(-1);
	dies.html = '<b>Mugwan</b> dies of illness not long after the campaign. He does it quietly, the way he did everything, before dawn, so as not to wake anyone.';
	dies.ko = '<b>무관랑</b>은 전역이 끝난 지 얼마 되지 않아 병으로 죽는다. 무엇이든 그렇게 했듯 조용히, 새벽이 오기 전에, 아무도 깨우지 않으려는 듯이.';
	const fast = seven[0];
	fast.html = 'Sadaham does not take food for seven days. The cooks leave bowls by his door. The order sends its oldest men to argue with him. He thanks them, and does not eat.';
	fast.ko = '사다함은 이레 동안 음식을 들지 않는다. 부엌에선 문 앞에 그릇을 둔다. 화랑은 가장 나이 든 이들을 보내 그를 설득한다. 그는 고맙다고 하고, 먹지 않는다.';
	const buried = seven.at(-1);
	buried.html =
		'He is seventeen. The order buries two headbands beside him, and one small stone with terrible handwriting. It keeps the story, because a Hwarang who outlives his vow is only a boy with a nice coat.';
	buried.ko = '열일곱이다. 화랑은 그 곁에 머리띠 둘과, 글씨가 엉망인 작은 돌 하나를 묻는다. 그리고 이야기를 남긴다. 맹세보다 오래 사는 화랑은, 옷만 좋은 소년에 불과하므로.';

	S11.year = '560–564';
	S11.tone = 'boyhood legend (Hwarang)';
	S11.blocks = [
		hook,
		scene('Surabol, the hwarang yard · 560', '서라벌, 화랑 연무장 · 560'),
		yard,
		...opening,
		scene('Surabol, the king’s hall · 562', '서라벌, 임금의 전당 · 562'),
		...young,
		scene('The Battle of Great Gaya · 562', '대가야 전투 · 562'),
		p(
			'The ninth month. Rain on the hill road, smoke on the hill. Great Gaya sits on its ridge behind a timber gate, and every roof inside the wall has a bow on it.',
			'아홉째 달. 산길엔 비, 산 위엔 연기. 대가야는 능선 위 나무 성문 뒤에 앉아 있고, 성안 지붕마다 활이 하나씩 올라앉아 있다.'
		),
		extra('A Silla rider', ['Shields! Shields up, they’re on the roofs—', 'Where’s the main army? Where’s the old man with the lions?'], ['방패! 방패 올리라, 지붕에 붙었다—', '본진은 어데 있노? 사자 그 영감은 어데 갔노?']),
		extra('A Daegaya archer', ['Horses, is it? Let them come up the mud, then—', 'Hold— wait for it— wait till they’re under the gate—'], ['말 타고 온다꼬? 진흙탕으로 기어 올라오라 캐라—', '참아라— 아직— 성문 밑에 올 때까지 참아라—']),
		p(
			'At the head of the Silla riders Sadaham is fifteen, soaked, and grinning. Beside him a Silla general nobody in the vanguard knows well is looking up at the gate the way you look at a relative.',
			'신라 기병의 맨 앞에서 사다함은 열다섯이고, 흠뻑 젖었고, 웃고 있다. 그 곁에서 선봉의 누구도 잘 모르는 신라 장군 하나가, 친척을 보듯 성문을 올려다본다.'
		),
		p('The men on that gate wear the same helm he does: the tall Gaya cone with the iron plates.', '저 성문 위의 사내들은 그와 같은 투구를 썼다. 쇠 비늘을 단 높은 가야 고깔.'),
		...unnamed([clone(alone), clone(shoot), clone(keepWarm)]),
		p('He takes the helm off, tucks it under his arm, and walks up the gate road alone.', '그는 투구를 벗어 옆구리에 끼고, 혼자 성문 길을 걸어 올라간다.'),
		extra('A Silla rider', ['What’s he— he’s taken it OFF— has the old man gone mad?'], ['저 양반 뭐 하노— 투구를 벗었다— 돌았나?']),
		say('sadaham', ['Is he mad, or is he winning?'], ['미친 기가, 이기는 기가?']),
		say('mugwan', ['Both. Look at the roofs. They’re all looking at him.'], ['둘 다. 지붕 봐라. 전부 저 사람만 보고 있다.']),
		say('sadaham', ['Then nobody’s looking at me.'], ['그라믄 내는 아무도 안 보네.']),
		clone(charge),
		clone(archer),
		p(
			'He is fifteen, and he fights like it: too fast, too far ahead, laughing once when a spear misses him by a hand. Mugwan stays one horse behind him all the way up the street and takes the men Sadaham doesn’t see.',
			'열다섯이고, 열다섯처럼 싸운다. 너무 빠르고, 너무 앞서 나가고, 창이 한 뼘 차이로 비껴가자 한 번 웃기까지 한다. 무관랑은 큰길 끝까지 말 한 마리 뒤를 지키며, 사다함이 못 본 놈들을 맡는다.'
		),
		...gateLines.map(clone),
		ssQuote,
		p(
			'Across the sea, Yamato has been taking rent off the Gaya ports for a long time. It takes the news personally.',
			'바다 건너 야마토는 오랫동안 가야의 포구에서 세를 받아 왔다. 이 소식을 제 일처럼 받아들인다.'
		),
		nsQuote,
		scene('Great Gaya, the square · that afternoon', '대가야, 광장 · 그날 오후'),
		prizeOpen,
		...knot,
		extra('A Gaya child', ['Mam. Mam, what’s he doing to the rope?'], ['엄마. 엄마, 저 사람 줄에 뭐 하노?'], 'f'),
		extra('Her mother', ['Hush. Don’t look at him.', 'And don’t thank him yet. He might stop.'], ['쉬. 쳐다보지 마라.', '고맙다 소리도 아직 하지 마라. 그만둘지도 모른다.'], 'f'),
		p(
			'At the edge of the square, the general who walked up the gate road bareheaded sits his horse with the helm back on and watches the boy work down the line. He doesn’t say anything. A skinny boy of about twelve holds his bridle and watches him watch.',
			'광장 가장자리에서, 맨머리로 성문 길을 걸어 올라갔던 장군이 투구를 다시 쓰고 말 위에 앉아, 소년이 줄을 따라 내려가는 것을 지켜본다. 아무 말도 하지 않는다. 열두어 살 된 마른 아이가 그의 굴레를 잡고, 그가 지켜보는 것을 지켜본다.'
		),
		alcheon,
		scene('The Silla camp below Great Gaya · that night', '대가야 아래 신라 진영 · 그날 밤'),
		p(
			'That night the freed captives sleep in the Silla camp, because they have nowhere else to sleep. Sadaham sits on a coil of the rope he cut, eating rice out of his helmet. Out of the dark comes the general, with his boy behind him leading the horses.',
			'그날 밤 풀려난 포로들은 신라 진영에서 잔다. 달리 잘 데가 없어서다. 사다함은 자기가 끊은 밧줄 더미 위에 앉아 투구에 담은 밥을 먹고 있다. 어둠 속에서 장군이 나온다. 그 뒤로 아이가 말을 끌고 따라온다.'
		),
		...unnamed([
			...c('rope', 'rice', 'helmet', 'worse'),
			p(
				'He sits down on the rope beside the boy without being asked. Sadaham hands him the helmet. It is the politest thing he does all year.',
				'그는 청하지도 않았는데 소년 옆 밧줄 더미에 앉는다. 사다함이 투구를 건넨다. 그해 소년이 한 일 중 가장 예의 바른 일이다.'
			),
			...c('gayaOne', 'soThey', 'yours', 'allNone', 'helmOff', 'charged', 'didCharge', 'welcome', 'cough', 'what', 'old', 'slow', 'boys', 'sing', 'important', 'notLaughing'),
			p(
				'He is. It never reaches his mouth, but it gets as far as his eyes, and the boy holding his horses has never seen it get that far.',
				'웃고 있다. 입까지는 끝내 안 오지만 눈까지는 온다. 그의 말을 잡고 선 아이는 그게 거기까지 오는 걸 본 적이 없다.'
			),
			...c('who', 'face', 'swear', 'official', 'which', 'chin', 'snores', 'isIt', 'thatsIt', 'why'),
			clone(showingOff),
			clone(areYou),
			clone(aLittle),
			p(
				'The general looks across the river, where Great Gaya’s roofs are still smoking, for longer than a man needs to look at roofs. Sadaham, for once in his short life, does not say anything at all.',
				'장군은 강 건너, 아직 연기가 오르는 대가야의 지붕들을 본다. 지붕을 보는 데 필요한 시간보다 오래. 사다함은 그 짧은 생에 처음으로, 아무 말도 하지 않는다.'
			),
			clone(faceFront),
			...c('boy', 'wrong', 'twelve', 'wasTwelve', 'hope', 'likeHow', 'notRiding'),
			clone(embarrassed),
			clone(bothOfUs)
		]),
		p(
			'He gets up slowly, the way older men get up after a day on a horse, and goes back to the boy holding the horses wrong.',
			'그는 천천히 일어난다. 말 위에서 하루를 보낸 나이 든 사내들이 일어나듯. 그리고 말을 잘못 잡고 있는 아이에게 돌아간다.'
		),
		clone(shortYear),
		p('Sadaham never asks the general’s name. You will want it. Not yet.', '사다함은 끝내 장군의 이름을 묻지 않는다. 당신은 알고 싶을 것이다. 아직은 아니다.'),
		scene('Surabol, the hwarang hall · winter, 563', '서라벌, 화랑의 방 · 563년 겨울'),
		...swear,
		scene('Surabol · seven days, 564', '서라벌 · 이레, 564'),
		...seven,
		card
	];

	S11.images = (S11.images ?? []).filter((im) => im.id !== 'sadaham-seq-yushin-tells');
	const reAt = {
		'sadaham-gaya-road': '<b>Sadaham</b> is fifteen',
		'sadaham-seq-ask': 'asks to ride against Great Gaya',
		'sadaham-seq-sickbed': 'dies of illness not long after the campaign',
		'sadaham-seq-seven-close': 'Sadaham does not take food for seven days',
		'sadaham-seven-days': 'Sadaham does not take food for seven days',
		'sadaham-grief-clutch': 'Sadaham does not take food for seven days',
		'sadaham-seq-headbands': 'buries two headbands'
	};
	for (const im of S11.images) if (reAt[im.id]) im.at = reAt[im.id];

	/* ——— #44 MURYUK: the Battle of Golden Gaya ——— */
	const mi = (frag) => M.blocks.findIndex((b) => english(b).includes(frag));
	const fordAt = M.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The ford below Geumgwan · 532');
	if (fordAt < 0) throw new Error('Muryuk: ford scene missing');
	const arithmetic = M.blocks[fordAt + 1];
	if (!english(arithmetic).startsWith('Silla comes down the river in spring')) throw new Error('Muryuk: arithmetic block moved');
	M.blocks.splice(
		fordAt,
		2,
		scene('The Battle of Golden Gaya', '금관가야 전투'),
		p(
			'The river is full of men, and none of them are swimming. Smoke stands up off the iron sheds in black columns. The harbour bell has been ringing since dawn, and nobody has had a spare moment to tell the ringer to stop.',
			'강에 사람이 가득한데, 헤엄치는 사람은 하나도 없다. 쇠 굽는 막에서 검은 연기 기둥이 선다. 포구의 종은 새벽부터 울리고 있고, 종지기에게 그만 치라고 일러 줄 짬이 난 사람은 아무도 없다.'
		),
		extra('A Gaya shieldman', ['Bank’s gone! West bank’s gone, they’re over the—', 'Where’s the cone, then? Where’s the prince?'], ['둑 넘어왔다! 서쪽 둑 다 넘어왔다, 저놈들—', '고깔은? 왕자님은 어데 계시노?']),
		extra('A Silla officer', ['Shields UP! They’ve got the good iron, the bastards, it goes straight through—', 'The ford! Take the ford and it’s finished—'], ['방패 올리라! 저놈들 쇠가 좋다, 그대로 뚫고 들어온다—', '여울! 여울만 잡으믄 끝이다—']),
		extra('A Gaya archer', ['Arrows! Who’s got arrows— give us yours, bach, give it HERE—'], ['화살! 화살 있는 사람— 니 거 내놔라, 퍼뜩 이리 내놔라—']),
		p(
			'Silla came down the river at first light, with more spears than Geumgwan has people. The king did the arithmetic first. His youngest son refused to.',
			'신라는 새벽에 금관의 백성보다 많은 창을 이끌고 강을 따라 내려왔다. 임금이 먼저 셈을 했다. 막내아들은 셈하기를 거부했다.'
		)
	);

	/* ——— #44 MURYUK: Great Gaya, 562, from the cone's side ——— */
	const day6 = M.blocks.findIndex((b) => b.kind === 'day' && b.label === 'DAY 6');
	if (day6 < 0 || mi('in the accent of a harbour that isn’t there any more') !== day6 - 1) throw new Error('Muryuk: cradle/DAY 6 seam moved');
	const lordP = clone(oldLordsP);
	M.blocks.splice(
		day6,
		0,
		scene('Great Gaya · 562', '대가야 · 562'),
		p(
			'Thirty years on, the cone is still on his head and Silla is still shopping. This time the shop is Great Gaya, the last of the six eggs still calling itself a kingdom. Muryuk rides south with the army. His son rides behind him, twelve years old, to hold the horses.',
			'서른 해가 지나도 고깔은 여전히 그의 머리에 있고, 신라는 여전히 장을 보러 다닌다. 이번 가게는 대가야. 여섯 알 가운데 아직 나라라고 자처하는 마지막 하나다. 무력은 군대와 함께 남으로 간다. 열두 살 아들이 말을 잡으려고 그 뒤를 따른다.'
		),
		p('From the road, the gate of Great Gaya looks like every gate he grew up behind. The men on it wear his father’s helm.', '길에서 보면 대가야의 성문은 그가 자라며 뒤에 숨었던 모든 성문과 닮았다. 그 위의 사내들은 아버지의 투구를 썼다.'),
		clone(alone),
		clone(shoot),
		clone(keepWarm),
		p(
			'He walks up the gate road bareheaded, the helm in his hand. Every bow on the wall finds him.',
			'그는 투구를 손에 든 맨머리로 성문 길을 걸어 올라간다. 성벽의 활이란 활은 모두 그를 찾는다.'
		),
		clone(wallAnswers),
		p(
			'Somewhere behind him a fifteen-year-old notices where every bow is pointing, and five thousand horse go through the Jeondan Gate while the archers are still busy with the old man.',
			'등 뒤 어딘가에서 열다섯 살짜리가 활이 모두 어디를 겨누는지 알아채고, 궁수들이 아직 그 늙은이에게 매달려 있는 사이 기병 오천이 전단문을 뚫는다.'
		),
		clone(shortMean),
		lordP,
		clone(lord1),
		clone(nobodySent),
		clone(lord2),
		clone(cold),
		extra('An old lord of Daegaya', ['And the people? The ones they’ll rope?'], ['백성은? 저놈들이 줄줄이 묶어 갈 사람들은?']),
		say('muryuk', ['…Not mine to sell. I’ll not lie to you about it.'], ['……그건 내가 팔 수 있는 기 아이요. 거짓말은 안 하겠소.']),
		clone(goodPrice),
		p(
			'An hour later the king’s prize is roped in a line across the square below the hall: three hundred Gaya, the boy-general’s to keep. From the hall steps Muryuk watches the boy walk down the line once, and start cutting.',
			'한 시진 뒤, 임금이 내린 상이 전각 아래 광장에 줄줄이 묶여 있다. 가야 사람 삼백, 소년 장수의 몫이다. 무력은 전각 계단에서, 소년이 줄을 따라 한 번 걸어 내려가더니 밧줄을 끊기 시작하는 것을 본다.'
		),
		extra('An old lord of Daegaya', ['……Silla, that is?'], ['……저게 신라가?']),
		say('muryuk', ['One of them.'], ['그중 하나요.']),
		p('Muryuk watches the ropes come off and says nothing. It is the first Silla habit he has ever liked.', '무력은 밧줄이 풀리는 것을 보며 아무 말도 하지 않는다. 처음으로 마음에 드는 신라의 버릇이다.'),
		scene('The Cut Rope', '끊긴 밧줄'),
		p(
			'That night he goes looking for the boy. He tells himself it is for the rice. He finds him on a coil of the rope he cut, eating out of his helmet, with a friend snoring against a cart wheel.',
			'그날 밤 그는 소년을 찾아 나선다. 밥 때문이라고 스스로에게 말한다. 소년은 자기가 끊은 밧줄 더미 위에서 투구에 밥을 담아 먹고 있고, 벗 하나가 수레바퀴에 기대어 코를 골고 있다.'
		),
		...c('rope', 'rice', 'helmet', 'worse'),
		p(
			'Muryuk sits down on the rope beside the boy without being asked. Sadaham hands him the helmet. It is the politest thing the boy does all year.',
			'무력은 청하지도 않았는데 소년 옆 밧줄 더미에 앉는다. 사다함이 투구를 건넨다. 그해 소년이 한 일 중 가장 예의 바른 일이다.'
		),
		...c('gayaOne', 'soThey', 'yours', 'allNone'),
		p(
			'All of them, because they talk like his mother. None of them, because he said so himself this afternoon, to an old man in a hall.',
			'전부다. 다들 어머니 말씨로 말하니까. 아무도 아니다. 오늘 오후 전각에서 한 노인에게 제 입으로 그렇게 말했으니까.'
		),
		...c('what', 'old', 'slow', 'boys', 'sing', 'important', 'notLaughing'),
		p(
			'He asks who gets in, and what they swear. The boy answers the first question and points his chin at his snoring friend for the second. Muryuk doesn’t need it explained.',
			'누가 들어가는지, 무엇을 맹세하는지 묻는다. 소년은 앞의 것에 대답하고, 뒤의 것에는 턱으로 코 고는 벗을 가리킨다. 무력에게는 설명이 필요 없다.'
		),
		...c('why'),
		clone(showingOff),
		clone(areYou),
		clone(aLittle),
		p(
			'Muryuk looks across the river at Great Gaya’s smoking roofs. Thirty years ago he looked back from a cart until the river bent, because somebody should remember what it looked like. He looks now until he has it. It takes less time than he thought. The boy beside him, for once in his short life, does not say anything at all.',
			'무력은 강 건너, 연기 오르는 대가야의 지붕들을 본다. 서른 해 전 그는 수레에서 강이 굽을 때까지 뒤를 돌아보았다. 누군가는 어떤 모습이었는지 기억해야 했으니까. 지금은 그 모습을 다 담을 때까지 본다. 생각보다 오래 걸리지 않는다. 곁의 소년은 그 짧은 생에 처음으로, 아무 말도 하지 않는다.'
		),
		clone(faceFront),
		...c('boy', 'wrong', 'twelve', 'wasTwelve', 'hope', 'likeHow', 'notRiding'),
		clone(embarrassed),
		clone(bothOfUs),
		p('He goes back to the horse lines. His son is still holding both horses, wrong, exactly where he was told to stand.', '그는 말을 매어 둔 곳으로 돌아간다. 아들은 여전히 말 두 필을 잘못 쥐고, 서 있으라던 자리에 그대로 서 있다.'),
		say('seohyeon', ['Father. Was that him? The one who went through the gate?'], ['아버지. 저 사람이에요? 성문 뚫고 들어간 사람?']),
		say('muryuk', ['That was him.'], ['그래.']),
		say('seohyeon', ['What did he say? You were laughing. I saw.'], ['뭐래요? 웃으셨잖아요. 봤어요.']),
		say('muryuk', ['……', 'Hold the reins higher. You’re choking the horse.'], ['……', '고삐 좀 높이 잡아라. 말 숨 막히겠다.']),
		p(
			'They ride north in the morning. Muryuk rides behind his son the whole way, where he can watch him without being caught at it: too thin, too careful in the saddle, twelve. He doesn’t look back at Gaya once. Halfway to Surabol he notices he hasn’t been trying not to.',
			'아침에 둘은 북으로 떠난다. 무력은 가는 내내 아들 뒤에서 말을 몬다. 들키지 않고 볼 수 있는 자리다. 너무 마르고, 안장 위에서 너무 조심스럽고, 열둘. 그는 가야를 한 번도 돌아보지 않는다. 서라벌까지 반쯤 왔을 때, 안 돌아보려고 애쓰지도 않았다는 걸 깨닫는다.'
		),
		say('muryuk', ['Seohyun-a.'], ['서현아.']),
		say('seohyeon', ['Father?'], ['예, 아버지?']),
		say('muryuk', ['…Nothing. Sit up straight.'], ['……아니다. 허리 펴라.'])
	);

	/* ——— #46 SEOHYUN: 562 from the horse lines ——— */
	const from = SH.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Daegaya · 562');
	const to = shAt('My father looked back for thirty years and stopped that night.');
	if (from < 0 || to < from) throw new Error('Seohyun: 562 section not found');
	const keep = (frag) => SH.blocks.slice(from, to).find((b) => english(b).includes(frag));
	const [mapBlock, lastGateOpen, heldHorse, helms, quote562, alcheonLine, cutRopeScene] = [
		SH.blocks[from + 1],
		keep('the Cloud King comes for what is left of Gaya'),
		keep('I’d have held his horse for nothing.'),
		keep('The men on Daegaya’s gate wear the same helm his father does.'),
		SH.blocks.slice(from, to).find((b) => b.kind === 'quote'),
		keep('Alcheon dirt.'),
		keep('The Cut Rope')
	];
	const takeLand = keep('Take the land. Leave the people.');
	takeLand.html = 'The boy takes his prize anyway. He cuts every rope in the square and keeps only the Alcheon dirt. Take the land. Leave the people.';
	takeLand.ko = '소년은 그래도 상을 받는다. 광장의 밧줄을 하나도 남김없이 끊고, 알천의 박토만 챙긴다. 땅은 가져라. 사람은 놔둬라.';
	SH.blocks.splice(
		from,
		to - from,
		SH.blocks[from],
		mapBlock,
		lastGateOpen,
		heldHorse,
		p(
			'He is twelve, and his whole war is two horses at the back of the Silla lines. From there a battle is mostly noise and other men’s backs.',
			'그는 열둘이고, 그의 전쟁은 신라 진 맨 뒤의 말 두 필이 전부다. 거기서 보는 싸움은 대개 소음과 남의 등짝이다.'
		),
		helms,
		p(
			'Up at the front his father says something to the boy-general. Then he takes off the helm and walks up the gate road alone, with it in his hand. Seohyun forgets he is holding anything.',
			'앞쪽에서 아버지가 소년 장수에게 무언가 말한다. 그러고는 투구를 벗어 손에 들고 혼자 성문 길을 걸어 올라간다. 서현은 자기가 뭘 쥐고 있는지 잊는다.'
		),
		p(
			'He hears the charge before he sees it. Five thousand horse go past close enough to spatter his boots, and at the head of them is a boy not much older than he is, laughing.',
			'돌격은 보기 전에 들린다. 기병 오천이 그의 신발에 진흙이 튈 만큼 가까이 지나간다. 그 맨 앞에 그보다 별로 나이 많지 않은 소년이 웃고 있다.'
		),
		p('Afterwards they come back past the horse lines, the laughing boy and his quiet friend, both filthy.', '싸움이 끝나고 둘이 말 대기소 앞을 지나 돌아온다. 웃던 소년과 말없는 그 벗. 둘 다 흙투성이다.'),
		...gateLines,
		quote562,
		takeLand,
		alcheonLine,
		p(
			'Seohyun watches his father watch the ropes come off. His father’s face does something it has never once done at supper.',
			'서현은 밧줄이 풀리는 것을 지켜보는 아버지를 지켜본다. 아버지의 얼굴이, 저녁상에서는 한 번도 하지 않던 무언가를 한다.'
		),
		cutRopeScene,
		p(
			'That night the freed captives sleep in the Silla camp, because they have nowhere else to sleep. His father goes looking for the boy-general. Seohyun follows with the horses, because nobody has told him not to, and stops where he is told to stop, at the edge of the firelight.',
			'그날 밤 풀려난 포로들은 신라 진영에서 잔다. 달리 잘 데가 없어서다. 아버지는 소년 장수를 찾아 나선다. 서현은 말을 끌고 따라간다. 따라오지 말라는 사람이 없어서다. 그리고 서 있으라는 자리, 모닥불 빛 가장자리에 멈춘다.'
		),
		p('From there he gets the talk in pieces, the way you get a song from the next valley.', '거기서는 이야기가 토막토막 들린다. 옆 골짜기에서 넘어오는 노래처럼.'),
		...c('important', 'notLaughing'),
		p(
			'His father is laughing. Seohyun can see it from the horses. It never reaches his mouth, but it gets as far as his eyes, and Seohyun has never once seen it get that far.',
			'아버지가 웃고 있다. 말 곁에서도 보인다. 입까지는 끝내 안 오지만 눈까지는 온다. 서현은 그게 거기까지 오는 걸 한 번도 본 적이 없다.'
		),
		...c('boy', 'wrong'),
		p('Seohyun moves his hands on the reins. Then he moves them back, in case they were right the first time.', '서현은 고삐 쥔 손을 옮긴다. 그러고는 도로 옮긴다. 처음 게 맞았을지도 모르니까.'),
		...c('twelve', 'wasTwelve', 'hope', 'likeHow', 'notRiding'),
		mono(
			'seohyeon',
			'I was ten paces away, holding his horse. He hoped I would turn out like that boy. I spent most of my life trying to work out which part he meant.',
			'나는 열 걸음 떨어져서 아버지 말을 잡고 있었소. 아버지는 내가 그 소년처럼 크기를 바라셨지. 어느 쪽을 말씀하신 건지, 평생 알아내려 애썼소.'
		),
		p(
			'On the road home his father rides behind him the whole way. Twice he says Seohyun’s name. Twice, when Seohyun turns round, he tells him to sit up straight.',
			'돌아오는 길 내내 아버지는 그의 뒤에서 말을 몬다. 두 번 서현의 이름을 부른다. 두 번 다, 서현이 돌아보면 허리 펴라고 한다.'
		)
	);

	console.log(`scenes-gaya: #11 ${S11.blocks.length} blocks, #44 ${M.blocks.length}, #46 ${SH.blocks.length}`);
	if (process.env.DRY) return false;
});

/* ——— touch-ups (safe to rerun) ——— */
editStory((story) => {
	const S11 = story.flatMap((c) => c.entries).find((e) => e.title === 'Sadaham');
	let changed = 0;
	for (const b of S11.blocks) {
		if (b.en?.[0] === 'What’s he— he’s taken it OFF— has the old man gone mad?') {
			b.en = ['What’s he— he’s taken it OFF— has he gone mad?'];
			changed++;
		}
		if (b.html === 'He sits down on the rope beside the boy without being asked. Sadaham hands him the helmet. It is the politest thing he does all year.') {
			b.html = 'He sits down on the rope beside the boy without being asked. Sadaham hands him the helmet. It is the politest thing the boy does all year.';
			changed++;
		}
	}
	console.log(`scenes-gaya touch-ups: ${changed}`);
	return changed > 0;
});
