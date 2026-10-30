/**
 * The Eastern Star, second pass: who stands beside each man.
 * - Wolji: an unofficial funeral for Gotaso (no body yet). The whole family fits around one pond:
 *   Sunduk and Munhee (grief → jokes → Yushin), Chunmyung sending Chunchu up the steps,
 *   Seungman hiding Bupmin's heel.
 * - Deer Rock: Euija and Gyebek alone. Gyebek's son holds his finger. Euija, not Gyebek, grew up in the palace.
 * - Jumong Cavern: Dosuryu at the foot of the hill, sent back. Gesomun goes up alone.
 */
import { editStory } from '../story-ops.mjs';

const plain = (s = '') => s.replace(/<[^>]+>/g, '');
const enHas = (s) => (b) =>
	(b.en ?? []).some((l) => plain(l).includes(s)) || plain(b.html).includes(s) || b.label === s;

editStory((story) => {
	let ep;
	for (const c of story) for (const e of c.entries) if (e.title === 'The Eastern Star') ep = e;
	if (!ep) throw new Error('no Eastern Star');
	const b = ep.blocks;
	if (b.some(enHas('whose body you don’t have'))) {
		console.log('already applied');
		return false;
	}
	const find = (s) => {
		const i = b.findIndex(enHas(s));
		if (i < 0) throw new Error(`missing block: ${s}`);
		return i;
	};
	const chipOf = (person) => {
		for (const c of story)
			for (const e of c.entries) for (const x of e.blocks) if (x.person === person && x.chip) return x.chip;
		throw new Error(`no chip for ${person}`);
	};
	const say = (person, en, ko) => ({ kind: 'dialogue', person, chip: chipOf(person), lines: ko, en });
	const p = (html, ko) => ({ kind: 'p', html, ko });
	const before = (s, ...blocks) => b.splice(find(s), 0, ...blocks);
	const after = (s, ...blocks) => b.splice(find(s) + 1, 0, ...blocks);
	const replace = (s, ...blocks) => b.splice(find(s), 1, ...blocks);

	/* ——— Wolji: the funeral nobody calls one ——— */
	replace(
		'The queen has had the pond lit',
		p(
			'You can’t bury a girl whose body you don’t have. Silla has rules about funerals, and every one of them starts with a body. So nobody calls this anything. It is only the family, at the pond, after dark.',
			'시신 없는 아이는 묻을 수가 없다. 신라에는 장례의 법도가 있고, 그 법도는 하나같이 시신에서 시작한다. 그래서 아무도 이걸 무어라 부르지 않는다. 그냥 식구들이, 어두워진 뒤에, 못가에 나와 있을 뿐이다.'
		),
		p(
			'The queen has had the pond lit for Daeya’s dead. Paper lotuses on the water, a candle in each, one for every name the heralds could find. The pond drains into a stream and the stream into the river. Whatever goes on the water tonight, the river takes somewhere nobody here can follow.',
			'여왕은 대야에서 죽은 이들을 위해 못에 불을 띄우게 했다. 물 위에 종이 연꽃들, 꽃마다 초 하나. 전령들이 찾아낸 이름 하나에 하나씩. 못물은 개울로 빠지고 개울은 강으로 간다. 오늘 밤 물에 놓인 것은, 여기 누구도 따라갈 수 없는 데로 강이 데려간다.'
		),
		p(
			'The whole house has come. The queen. Chunchu’s mother, who doesn’t come out for anybody. Princess Seungman, who comes out for everybody and gets noticed by nobody. Munhee. Yushin, straight from the river. Silla’s royal family is small and badly knotted, and tonight all of it fits around one pond.',
			'온 집안이 나왔다. 여왕. 아무 일에도 바깥에 나오지 않는 춘추의 어머니. 무슨 일에든 나오지만 아무도 눈여겨보지 않는 승만 공주. 문희. 강에서 곧장 온 유신. 신라 왕실은 작고 매듭이 엉망이다. 그래도 오늘 밤엔 그 전부가 못 하나 둘레에 다 들어간다.'
		)
	);
	const sets = b[find('Sunduk sets them on the water herself.')];
	sets.html = sets.html.replace('one lamp in both hands', 'one lotus in both hands');
	sets.ko = sets.ko.replace('등잔 하나를', '연꽃 하나를');
	after(
		'Sunduk sets them on the water herself.',
		say('sunduk', ['This one’s hers. You set it down.'], ['이건 그 아이 거다. 네가 띄워라.']),
		say('munhee', ['I’ve been holding it an hour, Majesty. My hands won’t listen.'], ['한 시진째 들고 있습니더, 폐하. 손이 말을 안 듣네예.']),
		say('sunduk', ['Then hold it a little longer. The pond isn’t going anywhere.'], ['그럼 조금 더 들고 있어. 못이 어디 가는 것도 아니고.']),
		say(
			'munhee',
			['…She fell in when she was six. Right there.', 'My brother fished her out by the collar, and she bit him for it.'],
			['…여섯 살 때 저기 빠졌잖아예. 바로 저기.', '오라버니가 뒷덜미 잡고 건졌는데, 그 아가 오라버니 손을 물었다 아입니꺼.']
		),
		say('sunduk', ['She bit me too. Coronation day. I wouldn’t let her try the crown.'], ['나도 물렸어. 즉위식 날. 왕관 안 씌워 준다고.']),
		say(
			'munhee',
			['…It would have suited her.', 'She never once asked permission for anything.'],
			['…왕관 잘 어울렸을 낀데.', '허락 같은 거 한 번도 안 구했으니까.']
		),
		say('sunduk', ['Neither did you.'], ['너도 안 구했지.']),
		say('munhee', ['I asked. I just didn’t wait for the answer.'], ['구했지예. 대답을 안 기다렸을 뿐이지.']),
		p(
			'They are quiet a while. Then Munhee’s eyes go up the steps, and come back down with something in them that wasn’t there a moment ago.',
			'둘은 한동안 말이 없다. 그러다 문희의 눈이 섬돌 위로 올라갔다가, 조금 전엔 없던 걸 담고 내려온다.'
		),
		say(
			'munhee',
			['Speaking of not waiting, Majesty.', 'My brother’s sitting on your steps with mud on his boots again.'],
			['대답 안 기다리는 얘기가 나와서 말인데예, 폐하.', '우리 오라버니가 또 장화에 진흙 묻히고 폐하 섬돌에 앉아 있네예.']
		),
		say('sunduk', ['He came straight from the river to report. That’s diligence.'], ['강에서 곧장 보고하러 온 거다. 성실한 거지.']),
		say('munhee', ['He came straight to the pond you were standing at. That’s something else.'], ['폐하 계신 못으로 곧장 온 거지예. 그건 딴 거고.']),
		say('sunduk', ['Munhee.'], ['문희야.']),
		say('munhee', ['You looked. Just now. Three times.'], ['방금 보셨잖아예. 세 번.']),
		say('sunduk', ['I’m the queen. Looking at everything is the job.'], ['나는 여왕이야. 다 보는 게 내 일이다.']),
		say('munhee', ['Mm. Everything else gets looked at once.'], ['음. 다른 건 한 번씩만 보시데예.']),
		say('sunduk', ['…Float your flower.'], ['…꽃이나 띄워.']),
		p(
			'Munhee laughs, for the first time in a month. While she is laughing her hands open, and the lotus is on the water before she can stop it. Sunduk watches it drift toward the outlet. That was the point.',
			'문희가 웃는다. 한 달 만에 처음이다. 웃는 사이에 손이 풀리고, 말릴 새도 없이 연꽃이 물 위에 놓인다. 선덕은 그 꽃이 물길 쪽으로 흘러가는 걸 지켜본다. 노린 게 그거였다.'
		),
		p(
			'Chunchu is counting the lotuses. His mother, who has watched him count things since before he could walk, comes and stands next to him.',
			'춘추는 연꽃을 세고 있다. 걸음마도 떼기 전부터 아들이 뭘 세는 걸 지켜봐 온 어머니가, 와서 곁에 선다.'
		),
		say('chunmyung', ['Sit down before you fall down.'], ['넘어지기 전에 앉아라.']),
		say('chunchu', ['I’m all right, Mother.'], ['괜찮습니더, 어머니.']),
		say('chunmyung', ['You’ve counted them twice. I watched.'], ['두 번 세더라. 봤다.']),
		say('chunchu', ['Three hundred and twelve.'], ['삼백열둘입니더.']),
		say('chunmyung', ['Stop counting.'], ['그만 세라.']),
		say(
			'chunchu',
			['…She’d have laughed at all this fuss.'],
			['…그 아이가 봤으면 웃었을 겁니더. 이 법석을.']
		),
		say(
			'chunmyung',
			['She’d have taken one home in her sleeve.', 'Go and sit with your friend. He’s been waiting longer than he’ll say.'],
			['하나 소매에 넣어 갔겠지.', '가서 네 동무 옆에 앉아라. 저 사람, 말하는 것보다 오래 기다렸다.']
		)
	);
	replace(
		'Up on the pavilion steps',
		p(
			'So Chunchu goes up the pavilion steps and sits with his back to all of it, next to Yushin. Yushin still has river-fort mud on his boots. Chunchu’s left hand is still in its sling. Neither of them mentions either.',
			'그래서 춘추는 누각 섬돌을 올라, 그 모든 것에 등을 돌리고 유신 곁에 앉는다. 유신의 장화엔 아직 강가 성의 진흙이 묻어 있다. 춘추의 왼손은 아직 천에 걸려 있다. 둘 다 그 얘기는 꺼내지 않는다.'
		)
	);
	after(
		'And under the azaleas by the wall',
		p(
			'Princess Seungman, who notices everything and mentions almost none of it, sees a heel sticking out of the azaleas. She moves a little to her left, so that her skirt covers it, and stays there.',
			'무엇이든 다 보고 거의 아무것도 입에 올리지 않는 승만 공주가, 진달래 덤불 밖으로 삐져나온 발뒤꿈치 하나를 본다. 공주는 치마가 그걸 덮도록 왼쪽으로 조금 옮겨 서서, 그대로 있는다.'
		)
	);
	{
		const i = find('Neither has the lamp.');
		b[i].html = b[i].html.replace('Neither has the lamp.', 'The lotus is long gone down the stream. She is still looking where it went.');
		b[i].ko = b[i].ko.replace('등잔도 그대로다.', '연꽃은 이미 개울을 따라 내려갔다. 문희는 아직 그쪽을 보고 있다.');
	}
	{
		const i = find('there is another one in the water, among the lamps');
		b[i].html = b[i].html.replace('among the lamps', 'among the lotuses');
		b[i].ko = b[i].ko.replace('물속 등잔들 사이에도', '물속 연꽃들 사이에도');
	}

	/* ——— Deer Rock: two ——— */
	after(
		'Tonight the rock has a king on it',
		p(
			'In Surabol it takes a whole pond to fit the people who love Chunchu. Euija’s fit on a rock, with room left over for the jar.',
			'서라벌에선 춘추를 아끼는 사람들을 다 들이려면 못 하나가 통째로 든다. 의자의 사람들은 바위 하나에 다 들어간다. 술 단지 놓을 자리까지 남는다.'
		),
		say('euija', ['Sit, Gyebek. You’re making the rock nervous.'], ['앉아라, 계백아. 바위가 다 불편해하겄다.']),
		say('gyebek', ['Yes.'], ['예.']),
		say('euija', ['You’ve a wife now, they tell me.'], ['장가갔다매.']),
		say('gyebek', ['Yes. Last spring.'], ['예. 지난봄에.']),
		say('euija', ['And?'], ['그래서?']),
		say('gyebek', ['And a son. Four months.'], ['아들이 있습니다. 넉 달 됐습니다.']),
		say('euija', ['What’s he like?'], ['어떤 놈이냐?']),
		say('gyebek', ['Small.'], ['작습니다.']),
		say('euija', ['Small! Ha! What else?'], ['작다! 하! 또?']),
		say(
			'gyebek',
			['He holds my finger. He does not let go.', 'I have to wait until he is asleep.'],
			['제 손가락을 쥡니다. 안 놓습니다.', '잠들 때까지 기다려야 합니다.']
		),
		p('Euija stops laughing.', '의자가 웃음을 그친다.'),
		say(
			'euija',
			[
				'I’ve sons I couldn’t pick out of a crowd, Gyebek.',
				'Their mothers send them up at New Year, and a steward whispers the names in my ear.'
			],
			['나는 사람들 틈에 섞이면 못 알아볼 아들들이 있다, 계백아.', '정초마다 즈이 어미들이 올려 보내면, 내관이 귀에다 이름을 속삭여 줘.']
		),
		say('gyebek', ['Why?'], ['왜 그렇습니까?']),
		say(
			'euija',
			['Because I never once waited for any of them to fall asleep.', 'Go home more than I did. That’s an order.'],
			['한 놈도 잠들 때까지 기다려 본 적이 없으니께.', '너는 나보다 집에 자주 가라. 명이다.']
		),
		say('gyebek', ['Yes, Your Majesty.'], ['예, 폐하.']),
		p('Remember the finger. Somebody should.', '그 손가락을 기억해 두자. 누군가는 기억해야 한다.')
	);
	{
		const i = find('The clans choose everything here.');
		b[i].en[0] = 'The clans choose everything here.';
		b[i].lines[0] = '대성들이 다 뽑는 데지.';
	}
	{
		const i = find('a king, or a slave');
		const blk = b[i];
		blk.lines[0] = '계백아. 나는 저 궁 안에서 자랐다.';
		blk.en[0] = 'Gyebek. I grew up inside that palace.';
		blk.lines[1] = '의자 하나 잡겠다고 미쳐 가는 사내들을 숱하게 봤다.';
		blk.en[1] = 'I watched men go mad reaching for a chair.';
	}

	/* ——— Jumong Cavern: one ——— */
	replace(
		'He came alone.',
		p(
			'Count them, if you like. In Surabol, a pond full. On Deer Rock, two. Up this hill, one, and he prefers the arithmetic.',
			'세어 보시라. 서라벌엔 못 하나 가득. 정사암엔 둘. 이 언덕 위엔 하나. 그리고 그는 그 셈이 마음에 든다.'
		)
	);
	before(
		'five blades still on his back',
		p(
			'At the foot of the hill, Dosuryu has the horses and an opinion.',
			'언덕 아래, 도수류가 말 두 필과 한마디를 붙들고 서 있다.'
		),
		say('dosuryu', ['I’ll carry the torch up.'], ['홰는 내래 들고 올라가갔다.']),
		say('gesomun', ['No.'], ['됐소.']),
		say('dosuryu', ['Your father let me carry it.'], ['너 아바지는 들게 했어.']),
		say('gesomun', ['My father trusted people.'], ['우리 아바지는 사람을 믿었지.']),
		say('dosuryu', ['Thirty-seven years I’ve wiped your nose, laddie.'], ['삼십칠 년을 니 코 닦아 줬다, 이놈아.']),
		say(
			'gesomun',
			[
				'Then you know I don’t take anybody up there.',
				'If it goes wrong up there, somebody has to be down here who wasn’t in it.'
			],
			['기러니 알 거 아이오. 저 위엔 아무도 안 데려간다는 거.', '저 위에서 일이 틀어지믄, 그 일에 안 낀 사람이 아래 하나는 있어야 하오.']
		),
		say('dosuryu', ['…Daft boy. Take a cloak, then. It’s cold in there.'], ['…미련한 놈. 기럼 이거라도 걸치라. 거기 안은 춥다.']),
		p(
			'Gesomun takes the cloak. It is the only thing he lets anyone hand him tonight.',
			'개소문은 겉옷을 받는다. 오늘 밤 그가 남의 손에서 받는 건 그것 하나뿐이다.'
		)
	);

	console.log(`Eastern Star: ${b.length} blocks`);
});
