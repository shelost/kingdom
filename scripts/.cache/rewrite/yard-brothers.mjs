/**
 * Class 51 pass.
 * - Forty Fortresses: cut the straw-ridge arrow borrowing (too close to Zhuge Liang).
 * - Jeon: Yumjong disobeys "let him go home", waylays Yushin at the outer ditch after Seohyun dies,
 *   and dies on his sword. Ends on two griefs: Bidam over Yumjong, Yushin in the road for his father.
 * - Gi: Bidam's first morning gains the line-up where he and Alchun first meet the Gaya boy (no names traded).
 * - Bupmin: Bidam and Alchun at the fence; the third principle; the long wall of Hwarang paintings,
 *   walked newest to oldest, ending on Sadaham and Mugwan.
 * - Gotaso: Bidam and Alchun betting at the spring match.
 */
import { editStory, find } from '../story-ops.mjs';

const CHIP = { bidam: '#7b5cd6', yushin: '#4a8fe0', alchun: '#c9a24a', munmu: '#3fa9c9', yumjong: '#8a68c9' };
const say = (person, en, ko, extra = {}) => ({ kind: 'dialogue', person, chip: CHIP[person], lines: ko, en, ...extra });
const crowd = (speaker, en, ko) => ({ kind: 'dialogue', speaker, gender: 'm', chip: '#6b7280', lines: ko, en });
const p = (html, ko) => ({ kind: 'p', html, ko });
const card = (html, ko) => p(`<b>${html}</b>`, `<b>${ko}</b>`);
const scene = (label, ko) => ({ kind: 'scene', label, ko });

editStory((story) => {
	const E = {};
	for (const c of story) for (const e of c.entries) E[e.title] = e;
	if (find(E['Jeon (轉)'], 'Tonight’s the only night you’ve come out alone.').length) {
		console.log('already applied');
		return false;
	}
	const one = (entry, frag) => {
		const hits = find(entry, frag);
		if (hits.length !== 1) throw new Error(`${entry.title}: ${hits.length} hits for "${frag}"`);
		return hits[0];
	};
	const after = (entry, frag, ...blocks) => {
		const { list, i } = one(entry, frag);
		list.splice(i + 1, 0, ...blocks);
	};
	const cut = (entry, fromFrag, toFrag) => {
		const a = one(entry, fromFrag);
		const z = one(entry, toFrag);
		if (a.list !== z.list || z.i < a.i) throw new Error(`${entry.title}: bad cut ${fromFrag} → ${toFrag}`);
		return a.list.splice(a.i, z.i - a.i + 1);
	};

	/* ——— Forty Fortresses: no arrow borrowing ——— */
	cut(E['Forty Fortresses'], 'The Straw Ridge', 'Zhuge Liang borrowed arrows');

	/* ——— Jeon: Yumjong at the ditch ——— */
	const jeon = E['Jeon (轉)'];
	const officer = (frag, en, ko) => {
		const { list, i } = one(jeon, frag);
		list[i] = say('yumjong', en, ko);
	};
	officer(
		'The marshal’s ridden out. Alone.',
		['Councillor. The marshal’s ridden out. Alone.', 'Give me two hundred men and the gate is ours by morning.'],
		['상대등. 대장군이 나갔습니더. 혼자요.', '이백만 주이소. 아침이믄 저 성문은 우리 낍니더.']
	);
	officer('The Kim house. They say the old man’s dying.', ['The Kim house. They say the old man’s dying.'], ['김씨 집입니더. 어르신이 오늘을 못 넘긴답니더.']);
	officer('Sangdedung, the gate—', ['Councillor, the gate—'], ['상대등, 성문이—']);
	after(
		jeon,
		'Will still be there tomorrow. So will I.',
		p(
			'Yumjong bows. He goes down off the wall, and he does not take two hundred men. He takes twenty, and the word they like shouting. A road that takes a man home also brings him back.',
			'염종은 고개를 숙인다. 성벽을 내려가는데, 이백은 데려가지 않는다. 스물을 데려간다. 그리고 다들 외치기 좋아하는 그 말도. 사람을 집으로 데려가는 길은, 그 사람을 다시 데려오기도 한다.'
		)
	);
	cut(jeon, 'The Outer Ditch', 'Come and count the cost yourself.');
	cut(jeon, 'To answer, Seohyun has to go back to a road', 'To answer, Seohyun has to go back to a road');
	after(
		jeon,
		'It’s a long road, sir.',
		scene('The Outer Ditch · before light', '바깥 도랑 · 동트기 전'),
		p(
			'Yushin rides back before light, because the gate is still a gate. He hasn’t said a word since the house. Hansul doesn’t know the road yet, and Yushin lets him find it.',
			'유신은 동트기 전에 돌아간다. 성문은 여전히 성문이니까. 그 집을 나선 뒤로 한마디도 하지 않았다. 한슬은 아직 이 길을 모른다. 유신은 녀석이 알아서 찾게 둔다.'
		),
		p(
			'Where the south road crosses the outer ditch, there are torches across it. Twenty black headbands, and in the middle a mild man on foot, leaning on a spear like a walking stick.',
			'남쪽 길이 바깥 도랑을 건너는 자리에, 횃불이 길을 막고 있다. 검은 머리띠 스물. 그 한가운데, 순해 보이는 사내 하나가 창을 지팡이처럼 짚고 서 있다.'
		),
		say('yumjong', ['Marshal.', 'My condolences. I mean it. We heard at supper.'], ['대장군.', '삼가 조의를 표합니더. 진심입니더. 저녁 먹다 들었지예.']),
		say('yushin', ['Move your men.'], ['길 비키게.']),
		say(
			'yumjong',
			['The Councillor said let you go home. He’s a gentleman, the Councillor.', 'He never said a word about letting you come back.'],
			['상대등께서 집에는 보내 드리라 카셨지예. 신사시거든요, 우리 상대등은.', '돌아오는 길 얘기는 한마디도 안 하셨습니더.']
		),
		say('yushin', ['Yumjong. Not tonight.'], ['염종. 오늘 밤은 아니네.']),
		say('yumjong', ['Tonight’s the only night you’ve come out alone.'], ['대장군이 혼자 나온 밤은 오늘뿐인데예.']),
		crowd('Twenty black headbands', ['Gaya!', 'Gaya dog! Back to your cart!'], ['가야!', '가야 개야! 니 수레로 돌아가라!']),
		say(
			'yumjong',
			['Shh. Manners.', '…How did the old man go, then, Marshal? They say at the end a man talks the way his mother did.'],
			['쉿. 예의 좀 차리라.', '……어르신은 어떻게 가셨습니꺼, 대장군? 사람이 마지막엔 지 어매 말투로 돌아간다 카던데.']
		),
		p(
			'Yushin gets down. He leaves the rein on the saddle, and the grey stands where it is left, as if it already knows this is not a night for wandering.',
			'유신이 말에서 내린다. 고삐는 안장에 걸쳐 둔다. 회색 말은 둔 자리에 그대로 선다. 오늘 밤은 돌아다닐 밤이 아니라는 걸 벌써 아는 것처럼.'
		),
		p(
			'Nobody has ever noticed Yumjong. It turns out he has spent thirty years of mornings with a spear where nobody was looking. The first thrust is faster than it has any right to be. It opens Yushin’s sleeve from wrist to elbow, and something small and grey drops out of it into the ditch.',
			'염종을 눈여겨본 사람은 아무도 없었다. 알고 보니 그는 아무도 안 보는 데서 삼십 년 아침을 창과 보냈다. 첫 찌르기가 터무니없이 빠르다. 유신의 소매가 손목부터 팔꿈치까지 갈라지고, 작고 잿빛인 무언가가 도랑으로 떨어진다.'
		),
		p(
			'Yushin doesn’t look down. He lets the second thrust go past his ribs. Then he steps inside the spear with the old yard step, the one two boys of Class 51 learned together in the mud, and it is over before the twenty have finished shouting the word.',
			'유신은 내려다보지 않는다. 두 번째 찌르기는 갈비뼈 옆으로 흘려보낸다. 그리고 옛 연무장의 그 걸음으로 창 안쪽으로 파고든다. 오십일기의 두 소년이 진흙탕에서 함께 익힌 걸음이다. 스물이 그 말을 다 외치기도 전에 끝난다.'
		),
		p('Yumjong sits down in the ditch as if somebody had offered him a seat.', '염종은 누가 자리라도 권한 것처럼 도랑에 주저앉는다.'),
		say('yumjong', ['…Huh.', 'He said you would.'], ['……허.', '그 양반이 그라실 끼라 카셨는데.']),
		p(
			'Yushin kneels in the mud beside him. Not for him. For the stone. He finds it by feel, wipes it on the torn sleeve, and closes his fist on it.',
			'유신이 그 옆 진흙에 무릎을 꿇는다. 그를 위해서가 아니다. 돌을 위해서다. 손으로 더듬어 찾아, 찢어진 소매에 닦고, 주먹 안에 쥔다.'
		),
		p(
			'Up the slope, torches are coming down from the Radiance wall at a run. One of them carries no sword, only a string of beads swinging from the fist. Yushin mounts. For one breath the two men look at each other across the ditch. Neither says anything. Then the grey is gone up the road, and Bidam is on his knees in the mud where Yushin knelt.',
			'비탈 위, 명활성 성벽에서 횃불들이 뛰어 내려온다. 그중 하나는 칼이 없다. 주먹에 염주만 흔들린다. 유신이 말에 오른다. 한 호흡 동안, 두 사내가 도랑을 사이에 두고 서로를 본다. 아무도 아무 말 하지 않는다. 그러고 나서 회색 말은 길 위로 사라지고, 유신이 꿇었던 진흙에 비담이 무릎을 꿇는다.'
		),
		say(
			'yumjong',
			['Don’t— don’t make that face, Councillor.', 'You said let him go home. I heard you. I just—', '…It was a good word, though. Gaya. They liked shouting it.'],
			['그런— 그런 얼굴 마이소, 상대등.', '집에 보내 주라 카셨지예. 들었습니더. 그냥 제가—', '……그래도 좋은 말이었지예. 가야. 다들 외치기 좋아했는데.']
		),
		say('bidam', ['Yumjong.', '…Yumjong.', 'I said tomorrow. I said the gate would still be there.'], ['염종아.', '……염종아.', '내일이라 안 캤나. 성문은 내일도 있다꼬 안 캤나.']),
		p(
			'The quieter name on the banner goes first. Bidam closes his eyes for him. He unties the black headband from Yumjong’s brow and winds it round his own wrist, under the beads, and does not let anyone see his hand.',
			'깃발의 조용한 이름이 먼저 간다. 비담이 그의 눈을 감긴다. 염종의 이마에서 검은 머리띠를 풀어 제 손목에, 염주 밑에 감는다. 그리고 그 손을 아무에게도 보이지 않는다.'
		),
		p(
			'Then he recites for the dead, the whole sutra, slowly, in the mud, while twenty men stand around him with torches and don’t know where to look. When he reaches the end he stands up and shouts at the dark where the road went.',
			'그러고는 망자를 위한 경을 왼다. 처음부터 끝까지, 천천히, 진흙 속에서. 횃불을 든 스물이 둘러서서 어디를 봐야 할지 모른다. 끝까지 다 외고 나서 그는 일어나, 길이 사라진 어둠에 대고 소리친다.'
		),
		say(
			'bidam',
			['Yushin! Brother of the yard!', 'We learned that step together. Tonight you used it on him.', '…Go home. Go home and count it.'],
			['유신아! 연무장 동기야!', '그 걸음, 우리 같이 배운 기다. 오늘 밤 니는 그걸 저 사람한테 썼다.', '……가라. 집에 가서 세어 봐라.']
		),
		scene('The South Road', '남쪽 길'),
		p(
			'A li up the road, out of sight of both walls, Yushin gets down again. He sits in the road like a boy who has been sent out of a room.',
			'길을 따라 한 리쯤, 양쪽 성벽 어디서도 보이지 않는 데서 유신은 다시 말에서 내린다. 방에서 쫓겨난 아이처럼 길바닥에 앉는다.'
		),
		p(
			'Hansul puts his nose into his chest and waits for the reason, the way the white horse used to. That is what does it.',
			'한슬이 그의 가슴에 코를 묻고 까닭을 기다린다. 흰 말이 늘 그랬던 것처럼. 그게 그를 무너뜨린다.'
		),
		say('yushin', ['He asked which horse.', 'I said a grey.', '…That was true, at least. You’re grey.'], ['어떤 말이냐고 물으셨다.', '회색이라 했다.', '……그건 참말이었다. 니는 회색이니까.']),
		p(
			'Then the Marshal of Silla cries in the road, the way men cry who have held it the whole way on horseback, with the stone in his fist and the grey standing over him.',
			'그러고 나서 신라의 대장군은 길바닥에서 운다. 말 등에서 내내 참아 온 사내들이 우는 식으로. 주먹엔 돌을 쥐고, 회색 말이 그 위에 서 있다.'
		),
		p(
			'Two men grieve on the same road tonight, a li apart. Neither will ever mention it to the other.',
			'오늘 밤 두 사내가 같은 길 위에서, 한 리를 사이에 두고 운다. 어느 쪽도 상대에게 그 얘기를 꺼내지 않을 것이다.'
		),
		card(
			'Kangrim’s question is still waiting at the Kim house. To answer it, Seohyun has to go back to a road, a gate, and a young man who got very lost on purpose…!',
			'강림의 물음은 아직 김씨 집에서 기다리고 있다. 대답하려면 서현은 돌아가야 한다. 길 하나, 대문 하나, 그리고 일부러 아주 크게 길을 잃었던 젊은이에게로…!'
		)
	);

	/* ——— Gi: the first line-up ——— */
	after(
		E['Gi (起)'],
		'He only ties Bidam’s headband once, tight',
		p(
			'The gate lets him into a yard full of boys trying not to look new. Class 51 lines up by height. Bidam is tall enough for the back row.',
			'대문 안은 새내기 티를 안 내려고 애쓰는 소년들로 가득한 마당이다. 오십일기가 키 순서로 줄을 선다. 비담은 뒷줄에 설 만큼 크다.'
		),
		p(
			'Next to him a round boy is eating a rice cake he has clearly been told not to bring. Bidam has known Alchun since they were both too small for the yard. Alchun has not changed.',
			'옆에서는 동글동글한 소년 하나가, 가져오지 말라는 소리를 분명 들었을 떡을 먹고 있다. 비담은 둘 다 연무장에 서기엔 한참 작던 때부터 알천을 알았다. 알천은 그때랑 똑같다.'
		),
		say('alchun', ['Oi, Bidam. Your father walk you to the gate?', 'Mine sent a servant and a lunch. Want half?'], ['어이, 비담아. 너거 아부지가 대문까지 데려다주더나?', '우리 아부지는 종 하나랑 도시락 보냈다. 반 무끼가?']),
		say('bidam', ['We are standing in a line, Alchun.'], ['줄 서 있다 아이가, 알천아.'], { look: 'hwarang' }),
		say('alchun', ['I can eat in a line.'], ['줄 서서도 묵을 수 있다.']),
		p(
			'At the far end of the row, a head shorter than the back rank, stands a boy with country dust on his boots. He stands so straight it looks like it hurts. His lips are moving.',
			'줄 맨 끝, 뒷줄보다 머리 하나 작은 소년이 신발에 시골 먼지를 묻힌 채 서 있다. 보기에 아플 만큼 꼿꼿하다. 입술이 움직이고 있다.'
		),
		say('alchun', ['What’s he muttering?'], ['점마 뭐라 중얼거리노?']),
		say('bidam', ['Vowels.', 'He’s practising the capital’s vowels.'], ['모음.', '서라벌 모음을 연습하고 있다.'], { look: 'hwarang' }),
		p(
			'Alchun breaks the line, which is not done on the first morning, walks the length of it, and holds out the other half of the rice cake.',
			'알천이 줄에서 빠져나온다. 첫날 아침에 할 짓이 아니다. 줄 끝까지 걸어가서, 떡 나머지 반쪽을 내민다.'
		),
		say('alchun', ['Oi. New boy. Hungry?'], ['어이, 새내기. 배고프나?']),
		say('yushin', ['…We are standing in a line.'], ['……줄 서 있는 중이오.']),
		p(
			'Bidam laughs out loud, in a line, on the first morning, and the drum master writes his name down. It is the first time anyone in the yard writes it down. It will not be the last.',
			'비담이 소리 내어 웃는다. 줄 선 채로, 첫날 아침에. 북 치는 교관이 그의 이름을 적는다. 연무장에서 누가 그 이름을 적는 건 이게 처음이다. 마지막은 아닐 것이다.'
		),
		say('alchun', ['Gods. There’s two of you.', 'What’s your name, then, new boy?'], ['아이고. 둘이네, 둘.', '니 이름이 뭐꼬, 새내기?']),
		p(
			'The drum goes before the new boy can answer. Alchun goes back to his place, and then, when the drum master isn’t looking, to the place between the two of them. He will eat between those two for the next forty years.',
			'새내기가 대답하기 전에 북이 울린다. 알천은 제자리로 돌아간다. 그러다 교관이 안 볼 때, 둘 사이 자리로 옮겨 선다. 앞으로 사십 년, 그는 그 둘 사이에서 밥을 먹게 된다.'
		),
		p(
			'Nobody gets the new boy’s name before the drum. Bidam will get it at a desk later that morning, for the price of two noses.',
			'북이 울리기 전에 새내기 이름을 들은 사람은 없다. 비담은 그날 오전, 책상 앞에서 그 이름을 듣게 된다. 코 두 개 값으로.'
		)
	);

	/* ——— Bupmin: the fence, the third rule, the long wall ——— */
	const bup = E['Bupmin'];
	after(
		bup,
		'A True Bone does not play last season’s shaft.',
		p(
			'Alchun is at the fence most afternoons, eating something. Today he has brought a councillor with prayer beads, and the girls find this hilarious: two grown men leaning on the rail among them like boys.',
			'알천은 오후면 대개 울타리에 기대 뭘 먹고 있다. 오늘은 염주 든 대신 하나를 데려왔고, 아가씨들은 그게 우스워 죽는다. 다 큰 사내 둘이, 저들 틈에서 소년들처럼 난간에 기대 있으니.'
		),
		say('bidam', ['He still drops his left shoulder.'], ['저 사람, 아직도 왼쪽 어깨 떨군다.']),
		say('alchun', ['Tell him.'], ['가서 말해라.']),
		say(
			'bidam',
			['I’ve told him for thirty years. It’s the only advice I’ve ever given him that he hears and ignores.'],
			['삼십 년째 말하고 있다. 내 말 중에 저 사람이 다 듣고도 무시하는 건 그거 하나뿐이다.']
		),
		say('yushin', ['I heard that.'], ['다 들리오.']),
		say('bidam', ['You were meant to, Marshal.'], ['들으라고 한 말이오, 대장군.']),
		p(
			'Bupmin, who has never heard anyone talk to his uncle like that and live, edges along the rail toward Alchun.',
			'외숙에게 저렇게 말하고 멀쩡한 사람을 본 적 없는 법민이, 난간을 따라 알천 쪽으로 슬금슬금 다가간다.'
		),
		say('munmu', ['Sir. Are they… friends?'], ['어르신. 저 두 분… 친구라예?']),
		say('alchun', ['Worse. Same class.'], ['그보다 더 나쁘다. 동기다.'])
	);
	after(
		bup,
		'Then see the country the way a Hwarang sees a field',
		p(
			'He said the third one slower than the others, trust among friends, and nobody noticed but Bupmin. Two of the Marshal’s classmates sat in this yard with him once. One of them still sends him tea every New Year, with a note that has only the score on it.',
			'그는 세 번째, 교우이신만 다른 것보다 천천히 말했다. 알아챈 건 법민 하나뿐이다. 장군의 동기 둘이 한때 이 마당에서 그와 함께 앉았다. 그중 하나는 지금도 설마다 차를 보낸다. 쪽지엔 점수만 적혀 있다.'
		)
	);
	cut(bup, 'The yard has two names it still whispers. Tonight', 'The yard has two names it still whispers. Tonight');
	after(
		bup,
		'That is the trouble with Gotaso',
		scene('The Long Wall', '긴 벽'),
		p(
			'The Hwarang hall has a wall nobody is allowed to lean on. It runs the whole length of the yard under its own little roof, and it is painted from end to end. The newest paint is by the gate. The oldest is so far down that the new boys have never walked that far.',
			'화랑 연무장에는 아무도 기대면 안 되는 벽이 있다. 마당 길이만큼 길게, 제 지붕을 따로 이고 뻗어 있고, 끝에서 끝까지 그림이 그려져 있다. 가장 새 그림은 대문 곁에 있다. 가장 오래된 그림은 하도 멀어서, 새내기들은 거기까지 걸어가 본 적이 없다.'
		),
		p(
			'On the first night of every class, the Marshal walks the new boys down it with one lamp. He starts at the gate and walks backwards through time. He has never explained why.',
			'기수마다 첫날 밤이면, 장군은 등불 하나를 들고 새내기들을 데리고 그 벽을 따라 걷는다. 대문에서 시작해 시간을 거꾸로 걸어간다. 왜 그런지 설명한 적은 없다.'
		),
		p(
			'The first panel is still bright. A young man in magenta sits cross-legged at a campfire among forty Baekje raiders. All of them are laughing. Every sword is on the ground.',
			'첫 그림은 아직 선명하다. 자홍빛 옷의 젊은이가 백제 약탈꾼 마흔 틈에서 모닥불 앞에 책상다리로 앉아 있다. 다들 웃고 있다. 칼은 전부 땅바닥에 있다.'
		),
		say(
			'yushin',
			['A raider camp in the western hills. Two summers they’d been taking our grain.', 'He walked in alone with a jar of wine. At dawn he walked out with forty prisoners.', 'They asked to come.'],
			['서쪽 산에 약탈꾼 진채가 있었다. 두 해 여름을 우리 곡식을 털어 갔지.', '그 사람은 술 한 동이 들고 혼자 걸어 들어갔다. 새벽에 포로 마흔을 데리고 걸어 나왔다.', '따라오겠다고 지들이 졸랐다.']
		),
		crowd('A new Hwarang', ['Who is it, Marshal?'], ['누굽니꺼, 장군?']),
		say('yushin', ['Ask him.'], ['저 아한테 물어봐라.']),
		p(
			'He lifts the lamp an inch toward Bupmin. Sixty heads turn. A month as the boy who pulls up at the pine, and Bupmin is suddenly the most interesting person in Surabol.',
			'장군이 등불을 법민 쪽으로 한 치 든다. 머리 예순 개가 돌아간다. 소나무에서 고삐 당기는 아이로 한 달을 지낸 법민이, 갑자기 서라벌에서 제일 흥미로운 사람이 된다.'
		),
		crowd('The new Hwarang', ['That’s your father?!', 'Is it true about the wine?', 'Did they really ask to come?'], ['저기 니 아부지가?!', '술 얘기 참말이가?', '진짜로 따라오겠다 캤나?']),
		say(
			'munmu',
			['He says it was forty.', 'Last New Year it was sixty.', '…He says it was the wine. Mother says it was him.'],
			['아버지는 마흔이라 카십니더.', '작년 설에는 예순이었고예.', '……아버지는 술 덕이라 카시고. 어머니는 아버지 덕이라 카십니더.']
		),
		p(
			'For the rest of the walk two boys carry Bupmin’s club box without being asked. It lasts until breakfast.',
			'남은 길 내내 두 소년이 시키지도 않았는데 법민의 채 함을 들어 준다. 그 인기는 아침밥 때까지 간다.'
		),
		p(
			'The next stretch of wall is older, and the paint has started to go. A tiger on Mount Nam, and three boys about to be eaten by it: a round one with his arms round its neck, one with a sword, one with a string of beads.',
			'다음 벽은 더 오래됐고, 물감이 바래기 시작했다. 남산의 호랑이 한 마리, 그리고 막 잡아먹히게 생긴 소년 셋. 호랑이 목을 끌어안은 동글한 아이, 칼을 든 아이, 염주를 든 아이.'
		),
		crowd('A new Hwarang', ['Marshal! That’s you!'], ['장군! 저거 장군이시지예!']),
		say('yushin', ['Keep walking.'], ['계속 걸어라.']),
		p(
			'He doesn’t stop. He doesn’t raise the lamp. The boys have to read it at the edge of the light. The Three Eternal Hwarang, the whole country calls them, and the Marshal walks past himself like a door he has no use for.',
			'그는 멈추지 않는다. 등불도 들지 않는다. 소년들은 불빛 가장자리에서 겨우 그림을 읽는다. 온 나라가 화랑삼웅이라 부르는 그 셋. 장군은 쓸 일 없는 문 앞을 지나가듯 제 그림을 지나간다.'
		),
		say('munmu', ['Uncle. Who’s the one with the beads?'], ['외숙. 염주 든 분은 누굽니꺼?']),
		say(
			'yushin',
			['A councillor. He talks less now.', '…No. He talks the same. Now they pay him for it.', 'And Alchun caught the tiger. Write that down. He checks.'],
			['대신이다. 요새는 말이 줄었다.', '……아니다. 똑같다. 요새는 그걸로 녹봉을 받을 뿐이지.', '그라고 호랑이는 알천이 잡았다. 적어 둬라. 그 사람 확인한다.']
		),
		p(
			'Then two young men under a fallen horse, arrows standing in them like reeds, and in the corner, painted small, a monk writing.',
			'그다음엔 쓰러진 말 밑의 두 청년. 화살이 갈대처럼 꽂혀 있다. 귀퉁이엔 작게, 뭔가 쓰고 있는 스님 하나.'
		),
		say(
			'yushin',
			['Gwisan. Chuhang.', 'They went to the monk and asked for rules a layman could keep. He gave them the five you said tonight.', 'The next year they kept the fourth one, at a fort in the western hills. Both of them.'],
			['귀산. 추항.', '둘이 스님을 찾아가 속인이 지킬 만한 계율을 청했다. 스님이 준 게 오늘 밤 너거가 외운 그 다섯이다.', '이듬해 서쪽 산의 성에서, 둘 다 네 번째를 지켰다.']
		),
		p(
			'Bupmin, who said tonight which rule he would break first, looks at the arrows for a long time. Nobody offers to carry his club box for this part.',
			'오늘 밤 어느 계율을 제일 먼저 깰지 말했던 법민이, 화살들을 오래 바라본다. 이 대목에선 아무도 그의 채 함을 들어 주겠다고 나서지 않는다.'
		),
		p(
			'After that the wall gets older and the Marshal walks faster. Boys on horses. Boys on walls. A boy swimming a river with a letter in his teeth. The paint goes brown, then grey, and the lamp starts finding bare plaster between the panels, where the painters ran out of money or of heroes.',
			'그다음부터 벽은 더 오래되고 장군의 걸음은 빨라진다. 말 탄 소년들. 성벽 위의 소년들. 편지를 입에 물고 강을 헤엄치는 소년. 물감이 갈색이 되고, 잿빛이 되고, 등불이 그림 사이사이 맨 회벽을 비추기 시작한다. 화공들이 돈이 떨어졌든 영웅이 떨어졌든 한 자리다.'
		),
		p(
			'At the very end, where the wall meets the old gate, the lamp finds two boys. No battle. No horse. Two thirteen-year-olds on a riverbank, one scratching at a flat grey stone with a knife, the other watching him do it badly.',
			'맨 끝, 벽이 옛 대문과 만나는 자리에서 등불이 소년 둘을 찾아낸다. 싸움도 없고 말도 없다. 강가의 열세 살 둘. 하나는 납작한 잿빛 돌을 칼로 서툴게 긁고 있고, 하나는 그걸 지켜보고 있다.'
		),
		crowd('A new Hwarang', ['That’s it?', 'What did they do?'], ['이기 다라예?', '뭘 했는데예?']),
		p(
			'Yushin sets the lamp down on the ground in front of them. He did not do that for Chunchu, or for the tiger, or for himself.',
			'유신이 그 앞 땅바닥에 등불을 내려놓는다. 춘추 그림 앞에서도, 호랑이 앞에서도, 제 그림 앞에서도 하지 않은 일이다.'
		),
		say(
			'yushin',
			['Sit down.', 'The yard has two names it still whispers. Sadaham. Mugwan.', 'It’s a long one.'],
			['앉아라.', '연무장이 아직도 목소리를 낮추는 이름이 둘 있다. 사다함. 무관.', '길다.']
		),
		card(
			'The yard is new. The idea is newer. Two boys share one gap in the hall, and argue about who snores…!',
			'연무장은 새것이고, 그 생각은 더 새것이다. 숙소의 빈자리 하나를 나눠 쓰는 소년 둘이, 누가 코를 고는지 다툰다…!'
		)
	);

	/* ——— Gotaso: two old Hwarang in the stands ——— */
	after(
		E['Gotaso'],
		'the Hwarang ride for the Queen. The stands smell of horse',
		p(
			'In the councillors’ row two old Hwarang sit together and bet against each other out of habit: a councillor with prayer beads, and a broad man with a lunch. They have not agreed on anything since they were sixteen, except where to sit.',
			'대신들 줄에 늙은 화랑 둘이 나란히 앉아, 버릇처럼 서로 반대편에 내기를 건다. 염주 든 대신 하나, 도시락 든 덩치 하나. 열여섯 이후로 둘이 뜻을 모은 건 앉을 자리 하나뿐이다.'
		),
		say('alchun', ['Two cups on the Gaya boy’s side.'], ['가야 아 쪽에 두 잔.']),
		say('bidam', ['He isn’t a boy, Alchun. He’s forty-six. He carries a marshal’s seal.'], ['아는 무슨 아고, 알천아. 마흔여섯이다. 대장군 인장까지 찼다.']),
		say('alchun', ['He’s a Gaya boy to you till one of you dies.'], ['니한테는 둘 중 하나 죽을 때까지 가야 아다.']),
		say('bidam', ['…Two cups on his side, then. Somebody has to lose to him.'], ['……그라믄 저쪽에 두 잔. 누군가는 저 사람한테 져 줘야지.'])
	);
	console.log('applied');
});
