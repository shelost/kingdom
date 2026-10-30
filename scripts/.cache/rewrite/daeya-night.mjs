/**
 * Daeya, rebuilt.
 * - Gotaso makes a gold butterfly (Gotaso) and ties it to Pumsuk's belt on the wedding night (Pumsuk).
 * - Gumil: Pumsuk is newly posted; the banquet moves out to Maehwa.
 * - Maehwa: the banquet for his posting, the sleepless pallet, the wall-walk where she waits,
 *   their lives, the butterfly given away, his room. All at night.
 * - Siege of Daeya: at night, from inside the walls. Panic at the gate, a green commander, the empty
 *   granary report → Gumil flashback → defection; Yunchung cold outside; the deaths told from inside,
 *   Kangrim takes Gotaso, Haewonmek takes Pumsuk.
 */
import { editStory } from '../story-ops.mjs';

const C = {
	pumsuk: '#7aa8d8',
	gotaso: '#F0A3C0',
	gumil: '#9a7b5f',
	gumilwife: '#c98fb0',
	mochuk: '#8f7f6a',
	jukjuk: '#6f8a5a',
	yunchung: '#c9932a',
	kangrim: '#5f5f6b',
	haewonmek: '#6b5b6e',
	extra: '#8a8a94'
};
const say = (person, en, ko, extra = {}) => ({ kind: 'dialogue', person, chip: C[person], lines: ko, en, ...extra });
const voice = (speaker, en, ko) => ({ kind: 'dialogue', chip: C.extra, speaker, lines: ko, en });
const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const card = (html, ko) => p(`<b>${html}</b>`, `<b>${ko}</b>`);

function entryByTitle(story, title) {
	for (const c of story) for (const e of c.entries) if (e.title === title) return e;
	throw new Error(`no entry ${title}`);
}
const plain = (s = '') => s.replace(/<[^>]+>/g, '');
const enHas = (s) => (b) =>
	(b.en ?? []).some((l) => plain(l).includes(s)) || plain(b.html).includes(s) || b.label === s;
function find(blocks, s) {
	const i = blocks.findIndex(enHas(s));
	if (i < 0) throw new Error(`missing block: ${s}`);
	return i;
}
const pick = (blocks, s) => blocks[find(blocks, s)];

editStory((story) => {
	const gotasoEp = entryByTitle(story, 'Gotaso');
	const pumsukEp = entryByTitle(story, 'Pumsuk');
	const gumilEp = entryByTitle(story, 'Gumil');
	const maehwaEp = entryByTitle(story, 'Maehwa');
	const siegeEp = entryByTitle(story, 'Siege of Daeya');
	if (gotasoEp.blocks.some(enHas('like my pin. So we’re a pair'))) {
		console.log('already applied');
		return false;
	}

	/* ——— Gotaso: the goldsmith ——— */
	{
		const b = gotasoEp.blocks;
		b.splice(
			find(b, 'The Palace Steps'),
			0,
			scene('The Goldsmiths’ Lane', '금장이 골목'),
			p(
				'Gotaso does not buy him a present. Buying is for people who haven’t thought about it.',
				'고타소는 선물을 사지 않는다. 사는 건 생각을 안 해 본 사람들이나 하는 짓이다.'
			),
			p(
				'She goes down to the goldsmiths’ lane with one maid and a pouch of her own hairpin money, and asks the oldest smith there to teach her to hammer.',
				'하녀 하나와 비녀값을 모은 주머니를 들고 금장이 골목으로 내려가서, 거기서 제일 늙은 장인에게 망치질을 가르쳐 달라고 한다.'
			),
			voice(
				'The goldsmith',
				['Princess, gold doesn’t care whose daughter you are. It burns everybody the same.'],
				['아기씨, 금은 누구 따님인지 안 따집니다. 데는 건 다 똑같아요.']
			),
			say(
				'gotaso',
				['Good. Then it’ll really be mine.', 'A butterfly. Like my pin. So we’re a pair.'],
				['좋아요. 그럼 진짜 내 거네요.', '나비요. 내 비녀랑 똑같이. 한 쌍이 되게.']
			),
			p(
				'It takes her nine days. She burns two fingers and one sleeve. One wing comes out bigger than the other, and the smith offers, very politely, to fix it.',
				'아흐레가 걸린다. 손가락 둘과 소매 하나를 태운다. 날개 한쪽이 다른 쪽보다 크게 나오자, 장인이 아주 공손하게 고쳐 드리겠다고 한다.'
			),
			say(
				'gotaso',
				['Don’t you dare.', 'That one’s bigger because I was thinking about him when I hit it.'],
				['손대지 마세요.', '그쪽이 큰 건, 그 사람 생각하면서 두드려서 그래요.']
			),
			p(
				'She threads it on a pink cord and hides it up her sleeve. Not yet. A thing like that needs a day big enough to hold it.',
				'분홍 끈에 꿰어 소매 속에 감춘다. 아직은 아니다. 그런 물건에는 그걸 담을 만큼 큰 날이 필요하다.'
			)
		);
	}

	/* ——— Pumsuk: the gift on the wedding night, the butterfly on the road ——— */
	{
		const b = pumsukEp.blocks;
		b.splice(
			find(b, 'Behind the doors the feast falls away.'),
			0,
			say('gotaso', ['Wait. Close your eyes.', '…No peeking. Hold out your hand.'], ['잠깐. 눈 감아요.', '…훔쳐보기 없기. 손 내밀어요.']),
			p(
				'She puts it in his palm: a gold butterfly no bigger than a thumb, one wing too big, still smelling faintly of the forge. She ties the pink cord to his belt herself, with a knot nobody taught her.',
				'그녀가 그의 손바닥에 그것을 올려놓는다. 엄지만 한 금나비. 날개 한쪽이 너무 크고, 아직 대장간 냄새가 희미하게 난다. 분홍 끈은 그녀가 직접 그의 허리띠에 묶는다. 아무도 가르쳐 준 적 없는 매듭으로.'
			),
			say(
				'pumsuk',
				['…You made this.', 'One wing is— forgive me. It’s beautiful. One wing is bigger.'],
				['…이것을 손수 만드셨습니까.', '날개 한쪽이— 송구합니다. 아름답습니다. 한쪽이 더 큽니다.']
			),
			say(
				'gotaso',
				['That’s the side where I was thinking about you.', 'Mine’s on my pin. Yours is on your belt. From far away nobody can tell us apart.'],
				['그쪽이 당신 생각하던 쪽이에요.', '내 건 비녀에, 당신 건 허리띠에. 이제 멀리서 보면 아무도 우리 구분 못 해요.']
			),
			say('pumsuk', ['I will never take it off.'], ['평생 풀지 않겠습니다.'])
		);
		const road = find(b, 'Three days later the couple leave for Daeya Fortress');
		b[road] = p(
			'Three days later the couple leave for Daeya Fortress, where Pumsuk has just been named Guardian. She waves from the cart until the capital is out of sight. He rides beside the wheel the whole way, and every time the cart jolts, the gold butterfly on his belt jumps. Daeya is a border post. Nobody at the wedding said the word border out loud.',
			'사흘 뒤 부부는 대야성으로 떠난다. 품석이 막 성주로 임명된 곳이다. 그녀는 도성이 보이지 않을 때까지 수레에서 손을 흔든다. 그는 내내 바퀴 옆에서 말을 몬다. 수레가 덜컹일 때마다 허리띠의 금나비가 튀어 오른다. 대야성은 국경 초소다. 혼례에서 국경이라는 말을 입 밖에 낸 사람은 아무도 없었다.'
		);
	}

	/* ——— Gumil: newly posted; the banquet leaves for Maehwa ——— */
	const banquetBlocks = {};
	{
		const b = gumilEp.blocks;
		b[find(b, 'Pumsuk is twenty-four.')] = p(
			'Pumsuk is twenty-four. He came in with the first frost, riding beside his wife’s cart, and he holds the fortress because his blood is right and his wife’s father is Chunchu. He is not a bad man. He is just a man who has never had to read the second sheet.',
			'품석은 스물넷이다. 첫서리와 함께, 아내의 수레 옆에서 말을 타고 들어왔다. 그가 성을 맡은 건 피가 맞고 장인이 춘추이기 때문이다. 나쁜 사람은 아니다. 두 번째 장을 읽어 볼 필요가 한 번도 없었던 사람일 뿐이다.'
		);
		b[find(b, 'Everything is after the feast this week.')] = say(
			'pumsuk',
			['Four years…', 'I— that should not happen. I will write to Surabol.', 'After the banquet. The Queen’s seal comes this week, and everything is after the banquet.'],
			['사 년이라…', '그런— 그런 일이 있어선 안 되오. 서라벌에 서신을 쓰겠소.', '잔치가 끝나면. 이번 주에 폐하의 인장이 오니, 모든 게 잔치 다음이오.']
		);
		b[find(b, 'He does not ask Gumil’s name.')] = p(
			'He seals the harvest count. He hands the second sheet back, unsealed, with a kind smile. He does not ask Gumil’s name. In five months he has never needed it.',
			'그는 추수 장부에 인장을 찍는다. 두 번째 장은 인장 없이, 다정한 미소와 함께 돌려준다. 검일의 이름은 묻지 않는다. 다섯 달 동안 한 번도 필요 없었다.'
		);
		const feast = find(b, 'The Feast');
		for (const [k, s] of Object.entries({
			name: 'He sends for the grain clerk.',
			ask: 'You. The— grain tallies.',
			gumil4: 'Gumil, Commander.',
			who: 'That woman. In the green. Who is she?',
			waited: 'Gumil has waited four years',
			wife: 'My wife, Commander.',
			red: 'Pumsuk goes very red.',
			order: 'Bring the sheet to me tomorrow.',
			honest: 'It may be an honest order.',
			dawn: '…By dawn, Commander.',
			passes: 'On his way out he passes Maehwa.'
		}))
			banquetBlocks[k] = pick(b, s);
		b.splice(
			feast,
			b.length - feast,
			card(
				'Tomorrow the Queen’s seal arrives, and Daeya throws its new Guardian a banquet. Every eye in the hall will find her first…!',
				'내일 폐하의 인장이 도착하고, 대야성은 새 성주를 위해 잔치를 연다. 그 잔칫자리의 모든 눈이 제일 먼저 그녀를 찾을 것이다…!'
			)
		);
	}

	/* ——— Maehwa ——— */
	{
		const old = maehwaEp.blocks;
		const keep = {
			rumor: pick(old, 'The commander took Gumil’s wife.'),
			took: old[find(old, 'The commander took Gumil’s wife.') + 1],
			quote: old.find((b) => b.kind === 'quote'),
			morning: pick(old, 'THE NEXT MORNING'),
			start: pick(old, 'From the start.'),
			name: pick(old, 'How many times.'),
			trash: pick(old, 'Because everyone in this fortress is trash.'),
			trash2: pick(old, 'You are trash as well.'),
			doorslit: pick(old, 'They stand in the door-slit of morning'),
			where: pick(old, 'Where.'),
			nobody: pick(old, 'Somewhere nobody knows my husband.'),
			last: pick(old, 'That is the last thing they ever say to each other.'),
			northWall: pick(old, 'The North Wall'),
			drums: pick(old, 'The drums start before the quarrel is over.'),
			runner: pick(old, 'dust on the north road'),
			cardEnd: old.at(-1)
		};
		maehwaEp.blocks = [
			old[0],
			scene('The Banquet', '연회'),
			p(
				'The Queen’s seal arrives in a lacquer box, and Daeya, which has eaten millet all winter, gets a banquet out of it.',
				'폐하의 인장이 옻칠 상자에 담겨 도착하고, 겨우내 조밥만 먹던 대야성은 그 덕에 잔치를 얻는다.'
			),
			p(
				'The long hall is lit end to end. Purple at the top table, yellow at the back, families on the floor between. Every toast is to the new Guardian of Daeya. He is twenty-four, and he has never been toasted by people who weren’t related to him.',
				'긴 전각에 끝에서 끝까지 불이 켜진다. 윗상엔 자색, 뒷줄엔 황색, 그 사이 바닥엔 가족들. 건배는 전부 대야성의 새 성주에게 간다. 그는 스물넷이고, 친척 아닌 사람들에게 건배를 받아 본 건 처음이다.'
			),
			p(
				'Lady Gotaso sits beside him for the first cup and goes up at the first drum. She is seventeen, and wine makes her sleepy. She squeezes his hand under the table on her way, and the gold butterfly on his belt rocks on its cord.',
				'고타소 부인은 첫 잔까지 그의 곁에 앉아 있다가 첫 북소리에 올라간다. 열일곱이고, 술을 마시면 졸리다. 가면서 상 밑으로 그의 손을 꼭 쥐고, 허리띠의 금나비가 끈에 매달려 흔들린다.'
			),
			say(
				'gotaso',
				['Don’t stay up all night being important.', '…Come up soon. I’ll pretend I’m awake.'],
				['밤새 잘난 척하다 오지 말아요.', '…빨리 와요. 깨어 있는 척하고 있을게요.']
			),
			say('pumsuk', ['Soon. I promise.'], ['곧 가겠소. 약속하오.']),
			p(
				'Then the lamp-line is hers. Maehwa walks under the cheap hanging lamps like she built them, in the old green and the red sash tied by habit, carrying a jug nobody asked her to carry. Every head at the top table turns. His turns last, and stays.',
				'그다음, 등불 줄은 그녀의 것이 된다. 매화는 싸구려 매단 등 아래를 제가 지은 집처럼 걷는다. 낡은 초록 저고리, 버릇처럼 맨 붉은 띠, 아무도 들라고 하지 않은 술병. 윗상의 고개가 전부 돌아간다. 그의 고개가 제일 늦게 돌아가고, 돌아가서는 멈춘다.'
			),
			p(
				'She pours for the yellow tables first. She takes her time getting to the purple one.',
				'그녀는 황색 상부터 따른다. 자색 상까지는 천천히 온다.'
			),
			say(
				'gumilwife',
				['Wine, Guardian?', '…That’s what they’re calling you tonight, isn’t it. I heard it eleven times on the way up the hall.'],
				['술 드릴까요, 성주님?', '…오늘 밤엔 다들 그렇게 부르던데요. 올라오는 길에 열한 번 들었어요.']
			),
			say('pumsuk', ['Twelve, now.', 'I— thank you. Yes. Half a cup.'], ['이제 열두 번이구려.', '아— 고맙소. 예. 반 잔만.']),
			say(
				'gumilwife',
				['Half.', 'A man who takes half a cup at his own banquet is either very careful or very scared.'],
				['반 잔.', '자기 잔치에서 반 잔 받는 남자는, 아주 조심스럽거나 아주 겁먹었거나 둘 중 하나죠.']
			),
			say('pumsuk', ['Which am I?'], ['나는 어느 쪽이오?']),
			say('gumilwife', ['Ask me when the jug’s empty.'], ['술병 비면 물어보세요.']),
			p(
				'She moves on. She doesn’t look back, which is how he knows she meant him to watch her go.',
				'그녀는 다음 상으로 간다. 돌아보지 않는다. 그래서 그는 그녀가 일부러 보라고 했다는 걸 안다.'
			),
			p(
				'She takes a plum from a tray and eats it slowly, because a plum is cheaper than silk. At the back of the hall, among the yellow sleeves, Gumil watches the purple sleeve watch his wife.',
				'그녀는 쟁반에서 매실 하나를 집어 천천히 먹는다. 매실은 비단보다 싸니까. 전각 뒤쪽 황색 소매들 사이에서, 검일은 자색 소매가 제 아내를 보는 걸 본다.'
			),
			p(
				'Pumsuk talks to his cup. It doesn’t help. Nine years of Hwarang drill, and nobody taught him what to do with his eyes. Then he does something he hasn’t done in five months.',
				'품석은 잔에 대고 말한다. 소용없다. 구 년 화랑 수련에, 눈을 어디 둬야 하는지는 아무도 가르쳐 주지 않았다. 그러다 그는 다섯 달 동안 한 번도 안 한 일을 한다.'
			),
			banquetBlocks.name,
			banquetBlocks.ask,
			banquetBlocks.gumil4,
			banquetBlocks.who,
			banquetBlocks.waited,
			banquetBlocks.wife,
			banquetBlocks.red,
			banquetBlocks.order,
			banquetBlocks.honest,
			banquetBlocks.dawn,
			banquetBlocks.passes,
			p(
				'Later, when the hall is half asleep, the jug is empty and she is at his table again, refilling nothing.',
				'나중에, 전각이 반쯤 잠들었을 때, 술병은 비었고 그녀는 다시 그의 상 앞에 있다. 아무것도 채우지 않으면서.'
			),
			say('gumilwife', ['…Jug’s empty, Guardian.'], ['…술병 비었어요, 성주님.']),
			say('pumsuk', ['Then which am I.'], ['그럼 나는 어느 쪽이오.']),
			say('gumilwife', ['Scared.', 'It’s nicer than careful. Careful men are boring.'], ['겁먹은 쪽.', '조심스러운 쪽보다 나아요. 조심스러운 남자는 재미없거든요.']),
			p(
				'He does the correct thing. He stands. He bows to a banquet that hasn’t asked him to leave, and goes up past Gotaso’s pink door to the little room at the top of the stair, where the Guardian sleeps when he works late. Tonight he tells himself he is working late.',
				'그는 옳은 일을 한다. 일어선다. 아무도 가라고 하지 않은 잔치에 절을 하고, 고타소의 분홍 문을 지나 계단 꼭대기의 작은 방으로 올라간다. 성주가 늦게까지 일할 때 자는 방이다. 오늘 밤 그는 늦게까지 일하는 거라고 스스로에게 말한다.'
			),
			scene('He Tries to Sleep', '자려고 한다'),
			p(
				'One dying lamp on dark timber. He lies in ice-blue with his eyes open. The hall has come up the stair with him: the jug, the plum, <i>ask me when the jug’s empty</i>. A True Bone should be able to close his eyes. He is twenty-four. He knows exactly why he can’t.',
				'어두운 나무 위에 꺼져 가는 등잔 하나. 그는 얼음빛 푸른 옷을 입은 채 눈을 뜨고 누워 있다. 잔칫자리가 계단을 따라 같이 올라왔다. 술병, 매실, <i>술병 비면 물어보세요</i>. 진골이라면 눈쯤은 감을 수 있어야 한다. 그는 스물넷이다. 왜 못 감는지 정확히 안다.'
			),
			p(
				'He gets up for air. That’s what he tells the lamp.',
				'바람 좀 쐬러 일어난다. 등잔한테는 그렇게 말한다.'
			),
			p(
				'On his way down he passes Gotaso’s door. A pink ribbon hangs on the post where her maid tied it. He turns his shoulder so his sleeve won’t brush it. That is the whole of his self-control tonight, and he is proud of it for four steps.',
				'내려가는 길에 고타소의 방문을 지난다. 하녀가 묶어 둔 분홍 리본이 기둥에 걸려 있다. 그는 소매가 스치지 않게 어깨를 돌린다. 오늘 밤 그의 절제는 그게 전부고, 그는 네 걸음 동안 그게 자랑스럽다.'
			),
			scene('The Wall-Walk', '성벽길'),
			p(
				'The wall-walk above the river is the only place in Daeya where nobody is counting anything. The moon is on the water. The sentries are at the far towers. She is sitting on the parapet steps in the old green, a shawl around her knees, as if she has been there a while.',
				'강 위의 성벽길은 대야성에서 아무도 뭘 세지 않는 유일한 곳이다. 달이 물 위에 떠 있다. 보초들은 먼 망루에 있다. 그녀는 낡은 초록 저고리 차림으로 무릎에 숄을 두르고 성가퀴 계단에 앉아 있다. 한참 그러고 있었던 것처럼.'
			),
			p(
				'She has. She knew which stair he would take. It’s the only one that doesn’t go past the barracks.',
				'한참 그러고 있었다. 그가 어느 계단으로 올지 알았다. 병영 앞을 안 지나는 계단은 그것 하나뿐이다.'
			),
			say('pumsuk', ['…You.', 'I mean— good evening. I didn’t think anyone would be up here.'], ['…당신이.', '아니— 좋은 밤이오. 여기 누가 있을 줄은 몰랐소.']),
			say(
				'gumilwife',
				['Nobody is. I’m nobody, remember?', 'Sit. The stone’s warm on this side. I’ve been sitting on it for an hour.'],
				['아무도 없어요. 난 아무것도 아니잖아요, 기억나요?', '앉아요. 이쪽 돌은 따뜻해. 한 시간째 내가 깔고 앉아 있었거든.']
			),
			p(
				'He sits. Not close. A True Bone’s arm’s length, which is longer than other people’s.',
				'그는 앉는다. 가깝지는 않게. 진골의 팔 길이만큼. 남들 팔보다 길다.'
			),
			say('pumsuk', ['Your husband is in the stores.'], ['남편은 곳간에 있소.']),
			say(
				'gumilwife',
				['Counting your sacks. I know. You sent him.', 'Don’t make that face. You’re not the first man to send him somewhere.'],
				['성주님 쌀가마 세고 있죠. 알아요. 당신이 보냈잖아요.', '그런 얼굴 하지 마요. 그 사람 어디 보낸 남자, 당신이 처음 아니니까.']
			),
			say(
				'gumilwife',
				['So. Why’s the Guardian of Daeya on a wall at midnight, instead of in bed with his princess?'],
				['그래서. 대야성 성주님이 왜 공주님 옆에 안 누워 있고 한밤중에 성벽에 계실까.']
			),
			say('pumsuk', ['She’s asleep. She sleeps like a child. She is—', '…I couldn’t sleep. That’s all.'], ['잠들었소. 아이처럼 자오. 그 사람은—', '…잠이 안 왔소. 그뿐이오.']),
			say('gumilwife', ['Liar. Go on. Nobody up here writes anything down.'], ['거짓말. 말해 봐요. 여기선 아무도 안 받아 적어요.']),
			say(
				'pumsuk',
				[
					'Do you know how I got this fortress?',
					'I was born. That’s the whole of it. My grandfather was somebody, I married somebody’s daughter, and the Queen put a seal on it.',
					'Every man at that banquet has held a wall longer than I’ve held a sword. They toasted me twelve times. Not one of them believed it.'
				],
				[
					'내가 이 성을 어떻게 얻었는지 아시오?',
					'태어났소. 그게 다요. 할아버지가 누구였고, 내가 누구의 딸과 혼인했고, 폐하께서 거기 인장을 찍으셨소.',
					'오늘 잔치에 온 사내들은 하나같이 내가 칼을 잡은 세월보다 오래 성벽을 지켰소. 열두 번 건배를 했는데, 믿는 자는 하나도 없었소.'
				]
			),
			say('gumilwife', ['Eleven. The twelfth was me.'], ['열한 번이죠. 열두 번째는 나였으니까.']),
			say('pumsuk', ['…And did you believe it?'], ['…당신은 믿었소?']),
			say('gumilwife', ['I believed you were scared. That’s more than they gave you.'], ['겁먹었다는 건 믿었죠. 저 사람들이 준 것보단 많잖아요.']),
			say('pumsuk', ['Your turn. Why are you up here?'], ['이제 당신 차례요. 당신은 왜 여기 있소?']),
			say(
				'gumilwife',
				[
					'Because down there I’m Gumil’s wife. Up here I’m just cold.',
					'I was fifteen when I married him. He had a good coat and a job with a seal on it. I thought the seal would follow him home one day.',
					'Sixteen years. It’s the same coat.'
				],
				[
					'저 밑에선 검일이 마누라고, 여기선 그냥 추운 사람이니까.',
					'열다섯에 시집왔어요. 그 사람 옷이 좋았고, 인장 찍히는 일자리가 있었죠. 언젠가 그 인장이 집까지 따라올 줄 알았어요.',
					'십육 년. 옷은 그때 그 옷이에요.'
				]
			),
			say(
				'gumilwife',
				['You know what I wanted? To see the sea. Once. They say it’s flat all the way to the edge. I’ve never been past that river.'],
				['내가 뭘 원했는지 알아요? 바다. 한 번만. 끝까지 평평하다던데. 난 저 강 너머로 가 본 적이 없어요.']
			),
			say(
				'pumsuk',
				['I’ve seen it. From the east hills at Surabol.', 'It is flat. It— doesn’t stop. You keep waiting for the other side.'],
				['나는 보았소. 서라벌 동쪽 언덕에서.', '평평하오. 그게— 끝이 없소. 자꾸 건너편을 기다리게 되오.']
			),
			say('gumilwife', ['Don’t. Don’t make it nice. I’m never going to see it.'], ['그러지 마요. 좋게 말하지 마. 난 평생 못 볼 거니까.']),
			p(
				'She says it lightly. It doesn’t come out light. For a while neither of them says anything, and the river does the talking.',
				'가볍게 말한다. 가볍게 나오지 않는다. 한동안 둘 다 아무 말도 하지 않고, 말은 강이 한다.'
			),
			say('pumsuk', ['I have a wife.'], ['나는 아내가 있소.']),
			say('gumilwife', ['I know. Gotaso. The pink ribbon.', 'Did you walk past it on the way out?'], ['알아요. 고타소. 분홍 리본.', '나오는 길에 그 앞 지나왔어요?']),
			say('pumsuk', ['…I turned my shoulder.'], ['…어깨를 돌렸소.']),
			say('gumilwife', ['Half of a True Bone.', 'Still more than mine will ever be.'], ['진골 반쪽이네.', '그래도 우리 집 양반이 평생 될 수 있는 것보단 많아.']),
			p(
				'Her eyes go to his belt. The gold butterfly is catching the moon.',
				'그녀의 눈이 그의 허리띠로 간다. 금나비가 달빛을 받고 있다.'
			),
			say('gumilwife', ['Is that real?'], ['그거 진짜예요?']),
			say('pumsuk', ['…Gold. Yes. My wife made it.'], ['…금이오. 예. 내 아내가 만들었소.']),
			say(
				'gumilwife',
				['Made it. Of course she did.', 'I’ve never held gold. Isn’t that stupid? Sixteen years in a fortress full of it, and I’ve never once held any.'],
				['만들었구나. 그렇겠지.', '난 금을 쥐어 본 적이 없어요. 웃기죠? 금 천지인 성에서 십육 년을 살았는데, 한 번도.']
			),
			p(
				'He should say something kind and go to bed. Instead his hands are already at the knot. It is a knot nobody taught Gotaso, and it comes apart for him on the first pull, the way it was never meant to.',
				'다정한 말 한마디 하고 자러 가야 한다. 그런데 그의 손은 벌써 매듭에 가 있다. 아무도 고타소에게 가르쳐 준 적 없는 매듭인데, 첫 번에 그에게 풀려 버린다. 그러라고 맨 매듭이 아니었는데.'
			),
			say('pumsuk', ['Here. Hold it.', '…Keep it.'], ['자. 쥐어 보시오.', '…가지시오.']),
			say('gumilwife', ['You don’t mean that.'], ['진심 아니잖아요.']),
			say('pumsuk', ['I don’t know what I mean. I’ve never— I don’t know what I mean tonight.'], ['내가 무슨 뜻인지 모르겠소. 한 번도— 오늘 밤은 내가 무슨 뜻인지 모르겠소.']),
			p(
				'She closes her hand over it. Then over his. That is the whole of the conversation about whether.',
				'그녀가 그것 위로 손을 오므린다. 그다음 그의 손 위로. 할지 말지에 대한 이야기는 그게 전부다.'
			),
			say(
				'gumilwife',
				['Your room’s the little one at the top of the stair. The one with the cold lamp.', '…I’ve watched the light in it for five months.'],
				['성주님 방, 계단 꼭대기 그 작은 방이죠. 등잔 차가운 방.', '…다섯 달 동안 그 불빛 봤어요.']
			),
			scene('The Little Room', '작은 방'),
			p(
				'He doesn’t remember the stair. He remembers the door, and her hand finding the bar behind them before his does.',
				'계단은 기억나지 않는다. 문이 기억나고, 등 뒤의 빗장을 그의 손보다 먼저 찾는 그녀의 손이 기억난다.'
			),
			p(
				'The lamp is too small for manners. The red sash comes off in one impatient pull, and the old green follows it. She is thirty-one, and she knows exactly where she wants him. He is twenty-four, and for once in his life nobody has told him what comes next.',
				'등잔이 너무 작아서 예의 차릴 데가 없다. 붉은 띠가 성급한 손짓 한 번에 풀리고, 낡은 초록이 그 뒤를 따른다. 그녀는 서른하나고, 그를 어디에 두고 싶은지 정확히 안다. 그는 스물넷이고, 평생 처음으로 다음에 뭘 해야 하는지 아무도 말해 주지 않았다.'
			),
			say('gumilwife', ['Slow. Slow down.', '…Nobody’s coming. Nobody ever comes up here. I checked.'], ['천천히. 천천히 해요.', '…아무도 안 와요. 여긴 아무도 안 올라와요. 내가 봤어요.']),
			say('pumsuk', ['Say my name. Not the other thing. Not Guardian.'], ['내 이름을 불러 주시오. 그거 말고. 성주 말고.']),
			say('gumilwife', ['…Pumsuk.'], ['…품석.']),
			p(
				'The lamp burns down. Neither of them gets up to fix it. Somewhere below, a clerk is counting sacks by torchlight, in the order he will one day burn them.',
				'등잔이 다 탄다. 둘 다 고치러 일어나지 않는다. 저 아래 어딘가에서, 서기 하나가 횃불 아래 쌀가마를 센다. 언젠가 그것들을 태울 순서대로.'
			),
			scene('Dawn', '새벽'),
			p(
				'She leaves his room at grey dawn by the back stair. The well-post sees her anyway. The well-post sees everything.',
				'그녀는 잿빛 새벽에 뒷계단으로 그의 방을 나선다. 그래도 우물가는 본다. 우물가는 다 본다.'
			),
			keep.rumor,
			keep.took,
			keep.quote,
			keep.morning,
			p(
				'Grey in the door-slit. Gumil comes back from the stores and finds his wife sitting on their bed in the old green, turning something over and over in her hand. It is gold. They have never owned anything gold.',
				'문틈에 잿빛. 곳간에서 돌아온 검일은, 낡은 초록 저고리 차림으로 침상에 앉아 손안의 무언가를 자꾸 뒤집는 아내를 본다. 금이다. 그들은 금붙이를 가져 본 적이 없다.'
			),
			keep.start,
			say('gumilwife', ['The banquet. The jug.', 'The wall. The river.', 'After that… his room.'], ['잔치. 술병.', '성벽. 강.', '그다음엔… 그 사람 방.']),
			keep.name,
			p(
				'She tells it. The jug. The wall. The knot on his belt that came apart on the first pull. He makes her say the gold last.',
				'그녀는 말한다. 술병. 성벽. 첫 번에 풀린 허리띠의 매듭. 그는 금 이야기를 맨 마지막에 하게 한다.'
			),
			say(
				'gumilwife',
				['He gave it to me.', 'His wife made it. He told me that first. Then he gave it to me anyway.'],
				['그 사람이 줬어요.', '자기 아내가 만든 거래요. 그 말부터 하더라고. 그러고도 줬어요.']
			),
			say('gumil', ['Half a True Bone.', 'More than mine.', 'You said that too. Did you.'], ['진골 반쪽.', '우리 집 양반보다 많다.', '그 말도 했지. 했어?']),
			keep.trash,
			keep.trash2,
			keep.doorslit,
			p(
				'By noon she has a bundle, the old green on her back and a gold butterfly in her fist. She leaves by the south gate on her own feet. Nobody else in Daeya will.',
				'정오쯤 그녀는 보따리 하나에 낡은 초록 저고리를 걸치고, 주먹엔 금나비를 쥐고 있다. 남문으로, 제 발로 나간다. 대야성의 다른 누구도 그러지 못할 것이다.'
			),
			keep.where,
			keep.nobody,
			keep.last,
			keep.northWall,
			keep.drums,
			keep.runner,
			keep.cardEnd
		];
		for (const [k, v] of Object.entries(keep)) if (!v) throw new Error(`maehwa keep ${k}`);
	}

	/* ——— Siege of Daeya ——— */
	{
		const old = siegeEp.blocks;
		const battle = (phase) => old.find((b) => b.kind === 'battle' && b.phase === phase);
		const tail = old.slice(find(old, 'The Last Gate'));
		const kangrimFrom = find(old, 'A man who was not in the fortress is suddenly in the fortress');
		const kangrimBlocks = old.slice(kangrimFrom, find(old, 'She goes with him surprised to the last') + 1);
		const swear = pick(old, 'If you swear to spare us all');
		const sun = pick(old, 'I swear it on that bright sun.');
		const bait = pick(old, 'That sweet talk is bait.');
		const wife = pick(old, '…My wife is inside.');
		const lookAtMe = pick(old, 'If you are going to do it');
		const why = pick(old, 'Why are you doing this. Truly.');
		const trash = pick(old, 'Because everyone in this fortress is trash.');
		const quoting = pick(old, 'He is quoting her.');
		const gateOpens = pick(old, 'The north gate opens.');
		const shieldBoy = pick(old, 'A Silla shield-boy from the levy');

		const lastGate = tail.findIndex(enHas('He holds the inner gate until sundown'));
		tail[lastGate] = p(
			'They come up the hill from the north gate, the way the garrison went down. He holds the inner gate until the sun is up, the bright one Yunchung swore on. Then he is broken, exactly as promised, and not bent.',
			'수비대가 내려간 그 길로, 그들이 북문에서 언덕을 올라온다. 그는 해가 뜰 때까지 안문을 지킨다. 윤충이 걸고 맹세한 그 밝은 해가. 그리고 약속대로 꺾인다. 굽지는 않는다.'
		);
		const rope = tail.findIndex(enHas('In the morning a thousand of Daeya’s people walk west'));
		tail.splice(
			rope,
			0,
			p(
				'When it is over, Yunchung walks up to the inner room himself. He looks at the two of them on the boards for about as long as he looked at Gumil. Then he has their heads taken and packed in salt for Sabi. The king will want to see what True Bone looks like up close.',
				'다 끝나자 윤충은 직접 안채로 올라간다. 마룻바닥의 두 사람을, 검일을 볼 때만큼만 본다. 그리고 두 사람의 목을 베어 소금에 절여 사비로 보내게 한다. 임금께서 진골이 가까이서 어떻게 생겼는지 보고 싶어 하실 테니.'
			)
		);

		siegeEp.blocks = [
			p(
				'Nobody in Daeya has ever seen ten thousand of anything. Tonight they get to count.',
				'대야성에서 만 개짜리 무언가를 본 사람은 아무도 없다. 오늘 밤 세어 볼 기회가 생긴다.'
			),
			scene('The North Road', '북쪽 길'),
			p(
				'They come at night, three weeks after the drums, the way the drums promised. The river covers three sides of the hill, so they all come up the fourth. A line of torches, then another behind it, then so many that the north road looks like a river of its own, running the wrong way.',
				'북이 울린 지 삼 주 뒤, 북이 약속한 대로 그들이 밤에 온다. 강이 언덕 세 면을 감싸고 있으니, 전부 나머지 한 면으로 올라온다. 횃불 한 줄, 그 뒤에 또 한 줄, 그러다 북쪽 길 전체가 거꾸로 흐르는 또 하나의 강처럼 보일 만큼.'
			),
			battle('siege'),
			p(
				'The villages under the wall get in first. Carts, goats, grandmothers, a pig nobody owns. The north gate jams with them. A woman loses a child in the press and screams a name over and over, and the whole gate takes it up, until it isn’t anybody’s name any more.',
				'성벽 아래 마을들이 먼저 밀려 들어온다. 수레, 염소, 할머니들, 주인 없는 돼지 한 마리. 북문이 그들로 막힌다. 한 여자가 인파 속에서 아이를 놓치고 이름 하나를 자꾸 부르고, 문 전체가 그 이름을 따라 부르다가, 결국 그건 누구의 이름도 아니게 된다.'
			),
			voice('The gate', ['Open it— open the other leaf!', 'My mother’s still out there—', 'Push! PUSH!'], ['열어— 반대쪽 문도 열어!', '우리 어머니 아직 밖에 있어요—', '밀어! 밀라고!']),
			p(
				'Up on the gatehouse the Guardian of Daeya is in his armour for the first time outside a parade yard. It fits. That’s the trouble. Everything about him fits except the face.',
				'문루 위에서 대야성 성주는 열병장 밖에서 처음으로 갑옷을 입고 있다. 잘 맞는다. 그게 문제다. 얼굴만 빼고 다 잘 맞는다.'
			),
			say(
				'pumsuk',
				['Close the gate.', 'No— wait. There are still people out— leave it open. Half. Can we open it half?'],
				['성문을 닫아라.', '아니— 잠깐. 아직 밖에 사람들이— 열어 두어라. 반만. 반만 열 수 있소?']
			),
			p(
				'Beside him stands a yellow-sleeve officer named Jukjuk, who has been holding this wall since Pumsuk was learning to ride. He does not raise his voice. He has never needed to.',
				'그의 곁에는 죽죽이라는 황색 소매 관리가 서 있다. 품석이 말 타기를 배울 때부터 이 성벽을 지켜 온 사람이다. 목소리를 높이지 않는다. 높일 필요가 한 번도 없었다.'
			),
			say(
				'jukjuk',
				['Half a gate is a whole gate, Commander. To them.', 'Close it now and those people die outside. Leave it and we all do. Your order.'],
				['반만 연 문도 저놈들한테는 다 연 문입니다, 성주님.', '지금 닫으면 저 사람들이 밖에서 죽고, 열어 두면 우리가 다 죽습니다. 명을 내리십시오.']
			),
			p(
				'Pumsuk looks at him the way he used to look at his tutors: for the answer. Jukjuk doesn’t give it to him. It is the cruelest kindness of the night.',
				'품석은 스승들을 보던 눈으로 그를 본다. 답을 달라는 눈으로. 죽죽은 주지 않는다. 그날 밤 가장 잔인한 친절이다.'
			),
			say('pumsuk', ['…Close it.'], ['…닫아라.']),
			p(
				'The bar comes down on the woman’s screaming. Pumsuk does not look over the parapet. He hasn’t learned that part yet either.',
				'여자의 비명 위로 빗장이 내려온다. 품석은 성가퀴 너머를 보지 않는다. 그것도 아직 못 배웠다.'
			),
			scene('The Baekje Camp', '백제 진영'),
			p(
				'Below the wall, Yunchung eats standing up. He heard the gate close. He knows the sound.',
				'성벽 아래에서 윤충은 선 채로 밥을 먹는다. 성문 닫히는 소리를 들었다. 아는 소리다.'
			),
			p(
				'The villagers who didn’t get in are brought to him. He doesn’t look up from his bowl.',
				'못 들어간 마을 사람들이 그 앞에 끌려온다. 그는 밥그릇에서 눈을 들지 않는다.'
			),
			say('yunchung', ['Farmers?'], ['농사꾼이냐?']),
			voice('A Baekje captain', ['Farmers, General. Some of them old.', 'What do we—'], ['농사꾼입니다, 장군. 늙은 것들도 있고.', '어떻게—']),
			say(
				'yunchung',
				['Put them where the wall can see.', 'Then finish your supper. It’s going to be a long night.'],
				['성벽에서 잘 보이는 데 세워.', '그리고 저녁 마저 먹어. 긴 밤이 될 거다.']
			),
			p(
				'That is the whole order. Up on the gatehouse, Pumsuk watches it carried out by torchlight, and learns, one at a time, what the word siege means.',
				'명령은 그게 전부다. 문루 위에서 품석은 횃불 아래 그 명령이 집행되는 걸 지켜보며, 포위라는 말이 무슨 뜻인지 한 명씩 배운다.'
			),
			scene('The Gatehouse', '문루'),
			p(
				'By the second night Pumsuk has given eleven orders and taken back four. He is counting. So is everyone else.',
				'둘째 날 밤까지 품석은 명령 열한 개를 내리고 넷을 거둬들였다. 본인도 세고 있다. 다른 사람들도 다 세고 있다.'
			),
			say('pumsuk', ['How long can we hold?'], ['얼마나 버틸 수 있소?']),
			say('jukjuk', ['With the granary? All winter. They’ll freeze before we starve.'], ['곳간만 있으면 겨울 내내 버팁니다. 우리가 굶기 전에 저놈들이 얼어 죽습니다.']),
			say(
				'pumsuk',
				['Good. Good. Then— the wall men haven’t eaten since yesterday. Send someone to the stores. Double rations. Let them see we have plenty.'],
				['좋소. 좋소. 그럼— 성벽 병사들이 어제부터 못 먹었소. 곳간에 사람을 보내라. 두 배로 내주어라. 넉넉하다는 걸 보여 주어야 하오.']
			),
			p(
				'It is the first good order he gives. A boy from the levy runs down the stair with an empty sack over his shoulder.',
				'그가 내린 첫 번째 좋은 명령이다. 징집된 소년 하나가 빈 자루를 어깨에 메고 계단을 뛰어 내려간다.'
			),
			p('He comes back without the sack.', '소년은 자루 없이 돌아온다.'),
			voice(
				'The levy boy',
				['Commander—', 'The stores. The granary.', 'It’s gone. All of it. It’s— it’s burnt, sir. There’s nothing in there but fire.'],
				['성주님—', '곳간이요. 곳간이.', '없어요. 다요. 다— 다 탔어요, 성주님. 안에 불밖에 없어요.']
			),
			p(
				'Everyone on the gatehouse turns south. Above the granary roof the sky is orange, and has been for a while, and nobody looked.',
				'문루 위의 모두가 남쪽으로 돌아선다. 곳간 지붕 위 하늘이 주황색이다. 한참 전부터 그랬는데, 아무도 보지 않았다.'
			),
			say('pumsuk', ['Who keeps the granary?'], ['곳간은 누가 맡았소?']),
			say('jukjuk', ['…Gumil, Commander.'], ['…검일입니다, 성주님.']),
			p('Pumsuk knows the name now. He learned it at a banquet.', '품석은 이제 그 이름을 안다. 잔칫자리에서 배웠다.'),
			{
				kind: 'flashback',
				year: '642',
				title: 'an hour earlier',
				blocks: [
					p(
						'An hour earlier. The granary is dark and smells of rice and rats. Gumil walks the rows with a torch, the way he has every night for four years, counting.',
						'한 시간 전. 곳간은 어둡고 쌀과 쥐 냄새가 난다. 검일은 횃불을 들고 줄 사이를 걷는다. 사 년 동안 매일 밤 그랬듯이, 세면서.'
					),
					p(
						'Every sack is in his ledger, written in a hand nobody upstairs ever read. Tonight he reads them back to himself, out loud.',
						'모든 가마는 그의 장부에 있다. 위층의 누구도 읽어 본 적 없는 글씨로. 오늘 밤 그는 그걸 소리 내어 자기한테 읽어 준다.'
					),
					say(
						'gumil',
						['Forty from the east fields. Sealed.', 'Sixty from the river farms. Sealed.', 'Four years’ pay. Not sealed.'],
						['동쪽 밭에서 마흔. 인장 찍힘.', '강가 농장에서 예순. 인장 찍힘.', '사 년 치 녹봉. 인장 안 찍힘.']
					),
					p(
						'Close on his face in the torchlight. He isn’t crying. He isn’t even angry. He looks like a man finishing a sum.',
						'횃불 아래 그의 얼굴. 울지 않는다. 화가 난 얼굴도 아니다. 셈을 끝내는 사람의 얼굴이다.'
					),
					say('gumil', ['And one gold butterfly.', '…Not sealed either.'], ['그리고 금나비 하나.', '…그것도 인장 안 찍힘.']),
					p(
						'He puts the torch to the first sack. Then the next, in the order he wrote them down.',
						'그가 첫 가마에 횃불을 댄다. 그다음 가마, 그가 적어 둔 순서대로.'
					),
					p(
						'Mochuk is at the river postern with the bar already lifted. He is yellow too: same rank, same pay, same four years. He reads Gumil’s face before Gumil reaches him.',
						'모척은 이미 빗장을 들어 올린 채 강 쪽 쪽문에 있다. 그도 황색이다. 같은 등급, 같은 녹봉, 같은 사 년. 검일이 닿기도 전에 그의 얼굴을 읽는다.'
					),
					why,
					trash,
					quoting,
					p(
						'They go out along the river in the dark. At the Baekje lines a torch comes up into Gumil’s face, and Yunchung looks at him for exactly as long as it takes to decide he is useful.',
						'둘은 어둠 속에서 강을 따라 나간다. 백제 진영에서 횃불 하나가 검일의 얼굴 앞으로 올라오고, 윤충은 그가 쓸모 있다고 판단하는 데 필요한 만큼만 그를 본다.'
					),
					say('yunchung', ['You’re the grain clerk.'], ['네가 그 곳간지기로구나.']),
					say('gumil', ['I was.'], ['였지요.']),
					say('yunchung', ['Kneel, then. You’re mine now.'], ['그럼 꿇어. 이제 내 거다.']),
					p(
						'Gumil kneels in the mud. Behind him, over the wall, the sky is starting to turn orange.',
						'검일이 진흙에 무릎을 꿇는다. 그의 등 뒤, 성벽 너머 하늘이 주황빛으로 물들기 시작한다.'
					)
				]
			},
			battle('fire'),
			scene('The Fire', '불'),
			p(
				'Without the granary, Daeya is a stone ring around a bonfire. The fire jumps from the stores to the barracks roof, from the barracks to the stables. The horses scream in a way the levy boys will hear for the rest of their lives, which is about a day.',
				'곳간이 없는 대야성은 모닥불을 둘러싼 돌 고리다. 불은 곳간에서 병영 지붕으로, 병영에서 마구간으로 옮겨붙는다. 말들이 비명을 지른다. 징집된 소년들은 남은 평생 그 소리를 듣게 될 것이다. 하루쯤 되는 평생을.'
			),
			p(
				'Outside, Yunchung sits his horse on the rise and watches it burn. He doesn’t cheer. He doesn’t hurry. When a few men drop from the wall to run for the river, he points with two fingers, his riders ride them down, and he goes back to watching.',
				'밖에서 윤충은 둔덕 위 말 등에 앉아 불타는 걸 지켜본다. 환호하지 않는다. 서두르지도 않는다. 몇 사람이 성벽에서 뛰어내려 강으로 달아나자, 손가락 두 개로 가리킨다. 기병들이 그들을 짓밟고, 그는 다시 지켜본다.'
			),
			say('yunchung', ['Don’t waste arrows on the ones who jump.', 'Wait at the bottom.'], ['뛰어내리는 놈들한테 화살 낭비하지 마.', '밑에서 기다려.']),
			scene('The Wall', '성벽'),
			p(
				'Just before dawn, a purple sleeve stands on the wall in the smoke and asks the dark for terms.',
				'동트기 직전, 자색 소매 하나가 연기 속 성벽 위에 서서 어둠에 대고 조건을 묻는다.'
			),
			swear,
			sun,
			p(
				'He points east. The sun isn’t up yet. Nobody on the wall notices what he has sworn on.',
				'그가 동쪽을 가리킨다. 해는 아직 뜨지 않았다. 그가 무엇에 걸고 맹세했는지, 성벽 위의 누구도 눈치채지 못한다.'
			),
			bait,
			wife,
			say('jukjuk', ['So is everyone’s, Commander.'], ['다들 그렇습니다, 성주님.']),
			p(
				'Pumsuk doesn’t answer that. He goes down to open the gate himself.',
				'품석은 대답하지 않는다. 직접 성문을 열러 내려간다.'
			),
			gateOpens,
			battle('terms'),
			p(
				'Then the killing starts. Yunchung doesn’t turn his horse. He watches it the way he watched the fire. When a captain asks about the wounded, he says one word.',
				'그리고 살육이 시작된다. 윤충은 말머리를 돌리지 않는다. 불을 볼 때처럼 본다. 한 군관이 부상자는 어떻게 하느냐고 묻자, 한 마디만 한다.'
			),
			say('yunchung', ['All.'], ['전부.']),
			p(
				'On the rise behind him, Gumil is not glad. He had thought he would be.',
				'그 뒤 둔덕 위에서, 검일은 기쁘지 않다. 기쁠 줄 알았다.'
			),
			shieldBoy,
			scene('The Inner Room', '안채'),
			p(
				'Pumsuk is at the inner gate with his wife’s hand in his, about to walk her out, when he hears it. Not a battle. A battle has two sides. This is one sound, going on and on, from the road where his men laid their shields down.',
				'품석은 아내의 손을 잡고 안문 앞에서 막 그녀를 데리고 나가려던 참에 그 소리를 듣는다. 전투가 아니다. 전투에는 양쪽이 있다. 이건 한 가지 소리다. 그의 병사들이 방패를 내려놓은 길에서, 끝없이 이어지는.'
			),
			p(
				'He turns around and takes her back up the stair. She lets him. She has been reading his face since the gyuku match.',
				'그는 돌아서서 그녀를 데리고 계단을 다시 올라간다. 그녀는 따라간다. 격구 시합 때부터 그의 얼굴을 읽어 온 사람이다.'
			),
			p(
				'In the inner room Gotaso understands before anyone says the word. Her pink ribbon is crooked on the post. She tied it again herself at dawn, badly, and knew why. She is seventeen, and the forever she promised at the wedding has run out of road.',
				'안채에서 고타소는 누가 말하기도 전에 안다. 기둥의 분홍 리본이 비뚤어져 있다. 새벽에 자기가 다시 묶었다. 서툴게. 그리고 왜인지 알았다. 그녀는 열일곱이고, 혼례 날 약속한 영원은 갈 길이 다 떨어졌다.'
			),
			p(
				'She looks at his belt. The pink cord is there. The butterfly isn’t.',
				'그녀는 그의 허리띠를 본다. 분홍 끈은 있다. 나비는 없다.'
			),
			say('gotaso', ['…Where’s the butterfly?'], ['…나비는 어디 갔어요?']),
			say('pumsuk', ['I— lost it.'], ['내가— 잃어버렸소.']),
			p(
				'She looks at him for a long moment, and decides something. You can watch her decide it, the way you can watch a girl decide to jump into cold water.',
				'그녀는 한참 그를 본다. 그리고 뭔가를 정한다. 차가운 물에 뛰어들기로 정하는 여자아이를 보듯, 그녀가 정하는 게 보인다.'
			),
			say('gotaso', ['Then I’ll make you another one.', 'I’ll make the other wing bigger this time.'], ['그럼 하나 더 만들어 줄게요.', '이번엔 다른 쪽 날개를 크게.']),
			lookAtMe,
			p(
				'He draws the parade sword with the fox in its ring. It has never been blooded. He looks at her the whole time, the way she asked.',
				'그는 고리에 여우가 든 의장용 칼을 뽑는다. 한 번도 피를 묻혀 본 적 없는 칼이다. 그녀가 부탁한 대로, 그는 내내 그녀를 본다.'
			),
			p('It is fast. It is the one thing he does well all night.', '빠르다. 그날 밤 그가 제대로 해낸 유일한 일이다.'),
			p(
				'It doesn’t hurt the way she thought. It is more like missing a step in the dark. Then the room is very quiet, the smoke has stopped moving, and she is standing by the lattice, and there is a man in the room who was not in the room.',
				'생각했던 것처럼 아프지 않다. 어둠 속에서 계단 하나를 헛디딘 느낌에 가깝다. 그러고 나니 방이 아주 조용하고, 연기가 멈춰 있고, 그녀는 창살 옆에 서 있고, 방에 없던 남자가 방에 있다.'
			),
			...kangrimBlocks,
			p(
				'Behind her, Pumsuk kneels beside what she left on the floor. He doesn’t see the man in the gat. Not yet.',
				'그녀 뒤에서 품석은 그녀가 바닥에 남기고 간 것 옆에 무릎을 꿇는다. 갓 쓴 남자는 보이지 않는다. 아직은.'
			),
			p(
				'He turns the fox-ring blade around in his hands. He is a True Bone, and there is no road left, and he does what a True Bone does.',
				'그는 여우 고리 칼을 손안에서 돌려 쥔다. 진골이고, 남은 길이 없고, 진골이 하는 일을 한다.'
			),
			p(
				'For him it isn’t like missing a step. It is like being very cold, very quickly. Then he is on his knees on the same boards, there is no blood on his coat, and a second man in a black gat is standing over him with a red book open.',
				'그에게는 계단을 헛디딘 느낌이 아니다. 아주 빠르게, 아주 추워지는 느낌이다. 그러고 나니 그는 같은 마룻바닥에 무릎을 꿇고 있고, 옷에 피가 없고, 검은 갓을 쓴 두 번째 남자가 붉은 책을 펼친 채 그를 내려다보고 있다.'
			),
			p(
				'He reads the name three times. Pumsuk. Pumsuk. Pumsuk. A second door in the same fortress.',
				'남자가 이름을 세 번 읽는다. 품석. 품석. 품석. 같은 성의 두 번째 문.'
			),
			{
				kind: 'card',
				person: 'haewonmek',
				caption: 'Kangrim’s partner on the reaper roads. He doesn’t ask a question. He asks for last words.',
				ko: '저승길에서 강림과 짝을 이루는 차사. 질문은 하지 않는다. 유언을 묻는다.'
			},
			say('haewonmek', ['The red book is open.', 'Any last words?'], ['붉은 명부가 열렸다.', '유언은?']),
			say('pumsuk', ['Is she—', 'Where is she?'], ['그 사람은—', '그 사람은 어디 있소?']),
			say('haewonmek', ['Ahead. With the other one.', 'Last words.'], ['앞에. 다른 놈이랑.', '유언.']),
			say(
				'pumsuk',
				['…Her hands were cold.', 'On our wedding night. Her hands were cold, and I said so, and she said it was because she was shaking.'],
				['…손이 차가웠소.', '첫날밤에. 그 사람 손이 차가워서 내가 그리 말했더니, 떨려서 그렇다 했소.']
			),
			say('haewonmek', ['That’s not last words. That’s a report.'], ['그건 유언이 아니라 보고다.']),
			say('pumsuk', ['It’s all I have.'], ['그것밖에 없소.']),
			p(
				'Haewonmek writes it down anyway. He doesn’t usually. Last autumn Pumsuk rode into Daeya beside her cart, at the wheel, never ahead. Tonight he walks behind her into the dark.',
				'해원맥은 그래도 받아 적는다. 원래는 안 그런다. 지난가을 품석은 그녀의 수레 옆, 바퀴 곁에서, 한 번도 앞서지 않고 대야성에 들어왔다. 오늘 밤 그는 그녀 뒤를 따라 어둠 속으로 걸어간다.'
			),
			...tail
		];
		for (const [i, b] of siegeEp.blocks.entries()) if (!b) throw new Error(`siege block ${i} missing`);

		/* ——— Images ——— */
		const drop = new Set([
			'yunchung-daeya-assault',
			'gumil-granary-burn',
			'mochuk-open-gates',
			'daeya-door-inside',
			'daeya_granary_gate',
			'scene-fortress-omen-2',
			'scene-fortress-omen-13',
			'scene-fortress-omen-35',
			'scene-fortress-omen-40',
			'gotaso-death-black',
			'pumsuk-death-black',
			'scene-maehwa-coming-of-age-28',
			'scene-maehwa-coming-of-age-39',
			'daeya-wide'
		]);
		const move = (from, to, id, at) => {
			const i = (from.images ?? []).findIndex((im) => im.id === id);
			if (i < 0) return;
			const [im] = from.images.splice(i, 1);
			im.at = at;
			(to.images ??= []).push(im);
		};
		move(gumilEp, maehwaEp, 'daeya_03', 'She takes a plum from a tray and eats it slowly');
		move(siegeEp, maehwaEp, 'gumil-yehwa-confront', 'They stand in the door-slit of morning');
		move(siegeEp, maehwaEp, 'daeya_05', 'He doesn’t remember the stair.');
		const anchors = {
			'scene-maehwa-sing': 'Then the lamp-line is hers.',
			'scene-maehwa-coming-of-age-17': 'Later, when the hall is half asleep',
			'scene-maehwa-coming-of-age-10': 'She has. She knew which stair he would take.',
			'scene-maehwa-coming-of-age-16': 'Your room’s the little one at the top of the stair.',
			'scene-maehwa-coming-of-age-18': 'He doesn’t remember the stair.',
			'scene-maehwa-coming-of-age-19': 'The lamp is too small for manners.',
			'scene-maehwa-coming-of-age-20': 'Say my name. Not the other thing.',
			'scene-maehwa-coming-of-age-24': 'She leaves his room at grey dawn',
			'scene-maehwa-coming-of-age-2': 'She leaves by the south gate on her own feet.',
			'yunchung-gate-ride': 'Outside, Yunchung sits his horse on the rise',
			daeya_04: 'Because everyone in this fortress is trash.',
			daeya_kangrim_gotaso: 'A man who was not in the fortress is suddenly in the fortress'
		};
		for (const e of [gumilEp, maehwaEp, siegeEp]) {
			e.images = (e.images ?? []).filter((im) => !drop.has(im.id));
			for (const im of e.images) if (anchors[im.id]) im.at = anchors[im.id];
		}
	}
});
console.log('daeya-night applied');
