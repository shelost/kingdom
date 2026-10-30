import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));

function find(entries) {
	for (const e of entries || []) {
		if (e.title === 'Yongsu') return e;
		const hit = find(e.entries) || find(e.chapters);
		if (hit) return hit;
	}
}
function walkTop(obj) {
	if (Array.isArray(obj)) return find(obj);
	for (const k of Object.keys(obj)) {
		if (Array.isArray(obj[k])) {
			const h = find(obj[k]);
			if (h) return h;
		}
	}
}

const ep = walkTop(story);
if (!ep) throw new Error('Yongsu episode not found');

function idx(pred) {
	const i = ep.blocks.findIndex(pred);
	if (i < 0) throw new Error('block not found: ' + pred);
	return i;
}
function htmlOf(b) {
	return b.html || '';
}
function en0(b) {
	return (b.en && b.en[0]) || '';
}

function splice(at, deleteCount, ...items) {
	ep.blocks.splice(at, deleteCount, ...items);
}

const d = (person, lines, en) => ({ kind: 'dialogue', person, lines, en });
const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });

// --- 1. Gildal's last words: Yongsu wants the palace; Gildal refuses ---
{
	const i = idx((b) => en0(b) === '…Ah. They sent you.');
	const after = i + 1;
	splice(after, 0,
		p(
			'The riders are a blur of torches on the road. They can’t hear a word from here. That’s why Gildal sat in the reeds.',
			'길 위 횃불이 흐릿하다. 여기선 한마디도 안 들린다. 길달이 갈대밭에 앉은 이유다.'
		),
		d('yongsu',
			['그럼 지금 해요. 지금.', '궁 길은 내가 알아요. 문마다. 지금 가면—', '갈대에 남은 사람들. 그거면 군대예요. 월성을 밀고 들어가. 끝내요.'],
			['Then we do it now. Now.', 'I know the palace. Every door. If we go—', 'Whoever’s left in the reeds. That’s an army. We take the Moon Palace. We end it.']
		),
		d('gildal',
			['안 되오.', '도련님은 그 자리에 있어야 하오. 임금이 볼 수 있는 자리.'],
			['No.', 'You stay where you are. Where the king can see you.']
		),
		d('yongsu',
			['저들이 나머지를 다—'],
			['They’ll hang the rest—']
		),
		d('gildal',
			['그러면 내 목을 치오. 도련님 것은 안 되오.'],
			['Then they hang me. Not you.']
		),
		p(
			'He is crying too. A clerk’s tears. He keeps trying to fold his hands and they will not stay folded.',
			'그도 운다. 서기처럼 운다. 손을 모으려 하는데, 손이 말을 안 듣는다.'
		),
		d('gildal',
			['처음부터 이름이었어요. 애들 이름. 다시 사람 되고 싶다는 거.', '그러다 이 나라를 미워하게 됐소. 비단. 의자. 왕이고 귀족이고.'],
			['It started as names. The children’s names. They wanted to come back up.', 'Then I hated this country. The silk. The chairs. Kings. Lords. All of it.']
		),
		d('yongsu',
			['길달—'],
			['Gildal—']
		),
		d('gildal',
			['그러다가 도련님이 왔소.', '쌀을 들고. 셈을 들고. 우리 쪽을 돌아보고.', '그래서 생각했소. 아직 사람이 있구나. 저 집에도.'],
			['Then you kept coming.', 'With rice. With the sums. Looking after them.', 'I started to think there were still people. Even in that house.']
		),
		d('yongsu',
			['그건— 그건 거사가 아닌데요.'],
			['That— that isn’t the mission.']
		),
		d('gildal',
			['복권은 이름만이 아니오.', '나쁜 아비 값을 착한 아들이 안 치른다는 걸, 보여주는 거요. 애들이 도련님을 그렇게 봐요.', '월성 안에서 하시오. 그게 이제 거사요. 그 총애를 잃지 마시오.'],
			['It was never only the names.', 'A good son does not pay for a bad father. They look at you and think that. All of them.', 'Do it from inside the Moon Palace. That is the mission now. Stay in his good graces.']
		)
	);
}

// --- 2. Masks stand down from the plot; he still goes to them ---
{
	const i = idx((b) => htmlOf(b).startsWith('And under the bridges'));
	ep.blocks[i] = p(
		'And under the bridges, in the culvert, in the reeds, people in masks hear a madman scream a king’s name across the whole city, and understand exactly what he is telling them. Don’t come for the palace. Don’t pick it back up. Stay down.',
		'그리고 다리 밑에서, 수로 속에서, 갈대밭에서, 탈 쓴 사람들은 온 도성을 가로질러 임금 이름을 외치는 미친놈의 목소리를 듣고, 그가 하는 말을 정확히 알아듣는다. 궁엔 오지 마라. 다시 집어 들지 마라. 엎드려 있어라.'
	);
	const j = idx((b) => htmlOf(b).startsWith('They don’t come. They never come again.'));
	ep.blocks[j] = p(
		'They don’t come. Not for that. The song will say the ghosts of Surabol are afraid of the name Bihyung. The song is half right. They are afraid of the ride. They are not afraid of him.',
		'그들은 오지 않는다. 그 일로는. 노래는 말한다. 서라벌 귀신들은 비형이라는 이름만 들어도 겁을 낸다고. 반은 맞다. 겁내는 건 그 행렬이다. 그는 아니다.'
	);
}

// --- 3. Jinpyung stops the confession; clerk test ---
{
	const i = idx((b) => htmlOf(b).startsWith('The next morning the king hugs him'));
	splice(i, 1,
		p(
			'The next morning the king hugs him in front of the whole hall. “I told them,” he says. Yongsu opens his mouth.',
			'이튿날 아침 임금은 온 조정 앞에서 그를 안는다. “내가 그렇게 말했잖나.” 용수가 입을 연다.'
		),
		scene('The king’s small room · that same morning', '임금의 작은 방 · 그날 아침'),
		p(
			'The door shuts. One lamp. Yongsu starts anyway.',
			'문이 닫힌다. 등불 하나. 용수는 그래도 입을 연다.'
		),
		d('yongsu',
			['전하. 저, 그 여우—', '저 일에 제가—'],
			['Majesty. The fox—', 'I was in that—']
		),
		d('jinpyung',
			['그만.'],
			['Stop.']
		),
		d('yongsu',
			['들어 주셔야—'],
			['You have to hear—']
		),
		d('jinpyung',
			['안 듣는다.', '대답하지 마.'],
			['I’m not listening.', 'Don’t answer.']
		),
		p(
			'He waits until the boy’s mouth closes. Then two questions, the way he asks everything.',
			'아이의 입이 다물길 기다린다. 그리고 질문을 둘. 늘 하던 대로.'
		),
		d('jinpyung',
			['평생 날 섬길 준비 됐느냐.', '내 딸을 사랑하느냐. 천명.'],
			['Are you ready to serve me for the rest of your life.', 'Do you love my daughter. Chunmyung.']
		),
		d('yongsu',
			['…예.'],
			['…Yes.']
		),
		d('jinpyung',
			['서기한테는 그거면 된다.'],
			['That’s all a clerk needs.']
		),
		p(
			'He never asks the other thing. Yongsu never gets to say it. That one is still his to carry.',
			'다른 건 묻지 않는다. 용수도 끝내 말하지 못한다. 그건 여전히 그가 질 짐이다.'
		)
	);
}

// --- 4. After the plot dies he still vanishes into the woods ---
{
	const i = idx((b) => htmlOf(b).startsWith('Chunchu is nine and mortified.'));
	splice(i + 1, 0,
		p(
			'After the fox the plot is dead. He still vanishes. Two days. Four. The watch sees him talking to a tree and writes it down. The city decides he has gone all the way mad, and says so, loudly, where a boy can hear.',
			'여우 이후로 거사는 죽었다. 그래도 그는 사라진다. 이틀. 나흘. 순라꾼이 나무에 대고 말하는 걸 보고 적어 둔다. 도성은 이제 완전히 미쳤다고 결정하고, 아이가 들을 수 있는 데서 그렇게 말한다.'
		),
		p(
			'Chunchu grows up on that story. A father who mumbles. Who goes into the woods and comes back with wet shoes and nothing to show for it. The boy thinks he is a madman. He is supposed to.',
			'춘추는 그 이야기 위에서 자란다. 중얼거리는 아버지. 숲에 들어갔다가 젖은 신만 신고 오는 아버지. 아이는 그를 미치광이로 본다. 그래야 한다.'
		),
		p(
			'Yongsu never tells him. He wants the boy free of the whole thing. The sack in the rafters is rice and salve. The path behind the west wall is the same culvert. The people in the woods are older now, and then they have children, and he counts them the way he always did.',
			'용수는 끝내 말하지 않는다. 아이를 이 이야기에서 완전히 빼 두고 싶어서. 서까래 자루엔 쌀과 약이 있다. 서문 뒤 길은 그 수로다. 숲의 사람들은 이제 늙었고, 그러다 제 아이를 낳고, 그는 늘 하던 대로 센다.'
		)
	);
}

// --- 5. Sunduk: royal decree, rehabilitation, Chief Architect, name restored ---
{
	const i = idx((b) => htmlOf(b).startsWith('The little girl who asked whether the stream'));
	ep.blocks[i] = p(
		'The little girl who asked whether the stream was invited to the wedding grows up and becomes the first queen of Silla. The first thing she does with the crown is send for her sister. Chunmyung says no. So she asks again, as queen. A royal decree. Chunmyung cannot refuse one of those. The new queen has a habit of this. You’d think a decree was for armies.',
		'혼례에 개울도 초대받았냐고 묻던 꼬마는 자라서 신라의 첫 여왕이 된다. 관을 쓰자마자 언니를 부른다. 천명이 거절한다. 그래서 여왕으로 다시 묻는다. 왕명. 천명은 그걸 거절할 수 없다. 새 여왕은 이런 버릇이 있다. 왕명이면 군대나 움직인다 생각하겠지만.'
	);

	const sit = idx((b) => en0(b) === 'Sit down, brother-in-law.');
	ep.blocks[sit] = d('sunduk',
		['앉게, 형부.', '언니가 다 말했어. 내가 시켜서.', '왕명이야. 언니는 거절을 못 해.'],
		['Sit down, brother-in-law.', 'Unni told me. Because I made her.', 'It was a royal decree. She can’t refuse one of those.']
	);

	const afterSit = sit + 1;
	// replace the "He stops... road" paragraph and the "All of it is a great deal" + father-told beats
	const stop = idx((b) => htmlOf(b).startsWith('He stops. For a while he looks at the lamp'));
	ep.blocks[stop] = p(
		'He stops. For a while he looks at the lamp instead of her. This is her father’s overthrow. He can feel the floor under the chair.',
		'그가 멈춘다. 한동안 그는 그녀 대신 등불을 본다. 이건 그 아버지 끌어내리기다. 의자 밑 마루가 느껴진다.'
	);

	const allOfIt = idx((b) => en0(b) === '…All of it is a great deal for one night.');
	ep.blocks[allOfIt] = d('yongsu',
		['…전하. 그 일은—', '전하의 아버님을—'],
		['…Majesty. That business—', 'Your father—']
	);

	const saved = idx((b) => en0(b) === 'He’d been saving it up.');
	ep.blocks[saved] = d('sunduk',
		['알아.', '앉아.', '언니가 겁에 질려 있더군. 형부는 더하고.'],
		['I know.', 'Sit.', 'Unni was frightened. You’re worse.']
	);
}

{
	const lean = idx((b) => htmlOf(b).startsWith('Then she leans across the table'));
	ep.blocks[lean] = p(
		'Then she leans across the table and says the thing she sent for him to say.',
		'그러고는 상 너머로 몸을 기울여, 그를 불러 놓고 하려던 말을 한다.'
	);

	const reeds = idx((b) => en0(b) === 'I want you out of the reeds.');
	ep.blocks[reeds] = d('sunduk',
		['숲에 남은 사람들을 끌어올리게.', '아직 그림자 속에 사는 자들. 그 자식들까지.', '이젠 됐네. 사람 이름으로 나오게.'],
		['I want the ones left in the woods brought up.', 'The ones still living in the shadows. Their children too.', 'Enough. They come out with names.']
	);

	const honest = idx((b) => en0(b) === 'Honest.');
	ep.blocks[honest] = d('yongsu',
		['…'],
		['…']
	);

	const confused = idx((b) => en0(b).startsWith('Then the ghosts will be very confused'));
	ep.blocks[confused] = p(
		'He looks at the lamp until his eyes fill. He has been waiting for someone in this house to say that since he was seventeen, and he had decided nobody would.',
		'등불을 보다가 눈이 찬다. 열일곱부터 이 집에서 누가 그 말을 하기를 기다렸다. 안 할 거라고 정해 두고 있었다.'
	);
}

{
	const councilWont = idx((b) => en0(b) === 'The Council won’t like it.');
	ep.blocks[councilWont] = d('yongsu',
		['그 사람들… 짓는 덴 밝아요.', '그게 그 사람들이에요.'],
		['They’re… they’re good at building.', 'That’s what they are.']
	);

	const councilMe = idx((b) => en0(b) === 'The Council doesn’t like me either.');
	ep.blocks[councilMe] = d('sunduk',
		['그럼 짓게 하세.', '형부가 어디를 지을지 정하고.', '신라의 영선을 맡게. 대목장.', '숲의 사람들 — 이젠 늙었거나 그 자식들이겠지 — 그 밑에서 짓게.'],
		['Then they will build.', 'You tell them where.', 'Chief Architect of Silla. That’s you.', 'The people in the woods — old now, or their children — they build under you.']
	);

	const storyStays = idx((b) => en0(b) === '…Then the story stays. The goblins, the fox, the ghost who kept his word.');
	ep.blocks[storyStays] = d('yongsu',
		['…이름은요.'],
		['…The name.']
	);

	const why = idx((b) => en0(b) === 'Why?' && b.person === 'sunduk');
	ep.blocks[why] = d('sunduk',
		['용수야.', '지금부터 그걸로 다녀.', '형부를 귀신이라고 부르는 건 이제 지겨워.'],
		['Yongsu.', 'You go by that now.', 'I’m tired of calling my brother-in-law a ghost.']
	);

	const trueOne = idx((b) => en0(b) === 'Because the true one still has living men in it.');
	ep.blocks[trueOne] = d('yongsu',
		['…알겠어요.', '이야기는 그대로 둡시다. 도깨비, 여우, 약속을 지킨 혼령.', '책엔 그걸 남기세요. 진짜 이야기엔 아직 산 사람들이 나오니까요.'],
		['…All right.', 'Then the story stays. The goblins, the fox, the ghost who kept his word.', 'Let the book keep that one. The true one still has living men in it.']
	);
}

{
	const so = idx((b) => en0(b) === 'So. A rank. Land. Your mother’s name on a tablet.');
	ep.blocks[so] = d('sunduk',
		['명단.', '몇이나 되나.'],
		['The list.', 'How many.']
	);

	const oneThing = idx((b) => en0(b) === 'One thing.');
	ep.blocks[oneThing] = d('yongsu',
		['여기요.', '마흔하나요. 이제는 서른여덟. 나무 할배가 봄에 갔어요.', '그때 애였던 놈들도 있어요. 지금은 장가까지 든 어른인데, 누구 하나 대낮에 부를 이름이 없어요.'],
		['Here.', 'Forty-one. Thirty-eight, now. Old Man Tree went in the spring.', 'Some of them were children when it happened. They’re grown men with wives, and none of them has a name you can say in daylight.']
	);

	// drop the old "How many?" / duplicate count exchange
	const howMany = idx((b) => en0(b) === '…How many?');
	const thenCompany = idx((b) => en0(b) === 'Then you’ll have even more company.');
	// howMany, forty-one reply, council-hate, then-company — keep council-hate + company, drop howMany + duplicate count
	const fortyOne = howMany + 1;
	if (en0(ep.blocks[fortyOne]).startsWith('Forty-one.')) {
		splice(howMany, 2); // remove How many? + Forty-one (already said)
	}
}

{
	const nextMorning = idx((b) => htmlOf(b).startsWith('The next morning the east wing gets a new resident'));
	ep.blocks[nextMorning] = p(
		'The next morning the east wing gets a new resident and a title the record will keep: Chief Architect of Silla. He signs Yongsu. The servants still cross the courtyard rather than pass his door after dark. He still talks to the rafters when anyone is listening. When nobody is, he reads the works’ books, and for the first time in years the timber starts to add up.',
		'이튿날 아침 동쪽 채에 새 식구가 들고, 기록이 남길 직함이 붙는다. 신라 대목장. 그는 용수라고 쓴다. 하인들은 여전히 해가 지면 그의 방문 앞을 지나가느니 마당을 가로질러 돌아간다. 누가 듣고 있으면 그는 여전히 서까래와 이야기한다. 아무도 없을 땐 영선 장부를 읽는다. 그리고 몇 해 만에 처음으로, 나무의 셈이 맞아떨어지기 시작한다.'
	);
}

{
	const wages = idx((b) => en0(b) === 'My sister tells me you’re good with wages.');
	ep.blocks[wages] = d('sunduk',
		['언니가 형부가 품삯 계산을 잘하신다고.', '처음엔 안 말하더군. 그래서 왕명으로 다시 물었지.'],
		['My sister tells me you’re good with wages.', 'She wouldn’t, at first. So I asked again. As queen.']
	);
}

// polish pass on already-applied text
{
	const empty = ep.blocks.findIndex((b) => b.kind === 'dialogue' && b.person === 'yongsu' && en0(b) === '…' && (b.en || []).length === 1);
	if (empty >= 0) ep.blocks.splice(empty, 1);

	const write = ep.blocks.findIndex((b) => en0(b) === 'Write me the list.');
	if (write >= 0) {
		ep.blocks[write] = d('sunduk', ['이리 내.', '내가 줄을 긋지.'], ['Give it here.', 'I’ll do the uncrossing.']);
	}

	const race = ep.blocks.findIndex((b) => en0(b) === 'Your sister found out on her own. You were seven.');
	if (race >= 0) {
		ep.blocks[race] = d('yongsu',
			['언니는 전하한테 말 안 하기로 했어요.', '제가 그렇게 부탁했고요.'],
			['Unni promised she wouldn’t tell you.', 'I asked her not to.']
		);
	}
	const raceAns = ep.blocks.findIndex((b) => en0(b) === 'Everything in this family is a race.');
	if (raceAns >= 0) {
		ep.blocks[raceAns] = d('sunduk',
			['그래서 왕명이야.', '부탁으로는 안 되니까.'],
			['That’s what a decree is for.', 'Asking doesn’t work.']
		);
	}

	const thesis = ep.blocks.findIndex((b) => (b.en || []).some((l) => l.startsWith('A good son does not pay')));
	if (thesis >= 0) {
		ep.blocks[thesis] = d('gildal',
			['복권은 이름만이 아니오.', '아비가 나쁜 집 아들이 그 값을 다 치르면, 애들이 뭘 보고 자라겠소. 도련님을 봐요.', '월성 안에서 하시오. 그게 이제 거사요. 그 총애를 잃지 마시오.'],
			['It was never only the names.', 'If a good son pays for a bad father, what do they look at. They look at you.', 'Do it from inside the Moon Palace. That is the mission now. Stay in his good graces.']
		);
	}

	const arch = ep.blocks.findIndex((b) => en0(b) === 'Then they will build.');
	if (arch >= 0) {
		ep.blocks[arch] = d('sunduk',
			['그럼 짓게 하세.', '형부가 어디를 지을지 정하고.', '신라의 영선을 맡게. 대목장.'],
			['Then they will build.', 'You tell them where.', 'Chief Architect of Silla. That’s you.']
		);
		ep.blocks.splice(arch + 1, 0,
			d('yongsu', ['…그 사람들요?'], ['…And them?']),
			d('sunduk',
				['숲의 사람들 — 이젠 늙었거나 그 자식들이겠지 — 그 밑에서 짓게.'],
				['The people in the woods — old now, or their children — they build under you.']
			)
		);
	}
}

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('Yongsu blocks:', ep.blocks.length);
