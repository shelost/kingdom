import { editStory } from './story-ops.mjs';

const INTIMATE = new Set(['nulji', 'chisul']);

function brothers(s) {
	if (typeof s !== 'string') return s;
	return s
		.replace(/Miseheun/g, 'Mihae')
		.replace(/Misahun/g, 'Mihae')
		.replace(/미사흔/g, '미해')
		.replace(/Bokho/g, 'Bohae')
		.replace(/복호/g, '보해');
}

function intimateName(s) {
	if (typeof s !== 'string') return s;
	return brothers(s)
		.replace(/Park Jesang/g, '\u0001')
		.replace(/박제상/g, '\u0002')
		.replace(/\bJesang\b/g, 'Momal')
		.replace(/제상아/g, '모말아')
		.replace(/제상/g, '모말')
		.replace(/\u0001/g, 'Park Jesang')
		.replace(/\u0002/g, '박제상');
}

function publicName(s) {
	return brothers(s);
}

function walkText(block, intimate) {
	const n = intimate ? intimateName : publicName;
	if (block.html) block.html = n(block.html);
	if (block.ko) block.ko = n(block.ko);
	if (block.caption) block.caption = n(block.caption);
	if (Array.isArray(block.en)) block.en = block.en.map(n);
	if (Array.isArray(block.lines)) block.lines = block.lines.map(n);
}

function walkBlocks(blocks) {
	for (const b of blocks) {
		if (b.kind === 'flashback' && b.blocks) {
			walkBlocks(b.blocks);
			continue;
		}
		const intimate =
			b.kind === 'p' ||
			b.kind === 'place' ||
			(b.kind === 'card' && (b.person === 'jesang' || b.person === 'nulji' || b.person === 'chisul' || b.person === 'bokho' || b.person === 'miseheun')) ||
			(b.kind === 'dialogue' && (INTIMATE.has(b.person) || (b.person === 'jesang' && !b.speaker)));
		// Jesang speaking to foreign halls stays public in those rooms — handled per-scene below.
		walkText(b, intimate && b.kind !== 'dialogue');
		if (b.kind === 'dialogue') {
			const toIntimate = INTIMATE.has(b.person) || b.person === 'jesang';
			walkText(b, toIntimate);
		}
	}
}

function find(blocks, pred) {
	const i = blocks.findIndex(pred);
	if (i < 0) throw new Error('anchor not found: ' + pred);
	return i;
}

function insertAfter(blocks, pred, items) {
	const i = find(blocks, pred);
	blocks.splice(i + 1, 0, ...items);
}

function insertBefore(blocks, pred, items) {
	const i = find(blocks, pred);
	blocks.splice(i, 0, ...items);
}

function replaceDialogue(blocks, person, matchEn1, en, lines) {
	const b = blocks.find((x) => x.kind === 'dialogue' && x.person === person && x.en?.[1] === matchEn1);
	if (!b) throw new Error('dialogue not found: ' + person + ' / ' + matchEn1);
	b.en = en;
	b.lines = lines;
}

function replaceP(blocks, starts, html, ko) {
	const b = blocks.find((x) => x.kind === 'p' && typeof x.html === 'string' && x.html.startsWith(starts));
	if (!b) throw new Error('p not found: ' + starts);
	b.html = html;
	b.ko = ko;
}

editStory((story) => {
	const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Park Jesang' || x.title === 'Momal');
	if (!e) throw new Error('episode not found');

	e.title = 'Momal';
	e.subtitle = '박모말';
	e.logline = {
		en: 'The hall said Jesang. The boats were Momal. He did not come home between the two jobs.',
		ko: '대청은 제상이라 했다. 배는 모말이었다. 그 사람은 두 일 사이에 집에 들르지 않았다.'
	};

	const B = e.blocks;

	walkBlocks(B);

	const card = (person) => B.find((b) => b.kind === 'card' && b.person === person);
	if (card('jesang')) {
		card('jesang').caption = 'Park of the south shore. The hall says Jesang. The boats were Momal.';
		card('jesang').ko = '남쪽 나루의 박. 대청은 제상이라 한다. 배는 모말이었다.';
	}
	if (card('bokho')) {
		card('bokho').caption = 'Bohae. The Goguryeo hostage. Came home first. Knows what a hostage costs.';
		card('bokho').ko = '보해. 고구려의 인질. 먼저 돌아왔다. 인질이 얼마인지 안다.';
	}
	if (card('miseheun')) {
		card('miseheun').caption = 'Mihae. The Wa hostage. Wants to stay with the man who came for him.';
		card('miseheun').ko = '미해. 왜의 인질. 데리러 온 사람 곁에 있고 싶어 한다.';
	}

	// Specific overlays after the general name walk.
	replaceDialogue(
		B,
		'nulji',
		'If I ever have to send someone.',
		['Momal.', 'If I ever have to send someone.'],
		['모말아.', '내가 언제 사람을 보내야 하면.']
	);
	replaceDialogue(
		B,
		'nulji',
		'It can’t be anybody else.',
		['Momal.', 'It can’t be anybody else.'],
		['모말아.', '다른 사람은 안 돼.']
	);
	replaceDialogue(
		B,
		'nulji',
		'The north has one.',
		['Jesang.', 'The north has one.', 'The island has the other.', 'I have a chair.'],
		['제상아.', '북에 하나.', '섬에 하나.', '난 의자야.']
	); // keep the court name on his lips so the reveal can correct it
	replaceDialogue(
		B,
		'nulji',
		'I said your name would last.',
		['Momal.', 'I said the name would last.', 'They’ll say Jesang.', 'I’ll see to both.'],
		['모말아.', '이름 남는다고 했어.', '사람들은 제상이라 할 거야.', '둘 다 할게.']
	);

	insertAfter(
		B,
		(b) => b.kind === 'dialogue' && b.person === 'nulji' && b.en?.[0] === 'Jesang.' && b.en?.[1] === 'The north has one.',
		[
			{
				kind: 'dialogue',
				person: 'jesang',
				en: ['The hall says Jesang.', 'The boats were Momal.', 'You remember the oar.'],
				lines: ['대청은 제상이라 하지.', '배는 모말이었어.', '노는 기억하지.']
			},
			{
				kind: 'dialogue',
				person: 'nulji',
				en: ['…Momal.', 'I was going to say that.', 'I was.'],
				lines: ['……모말아.', '그거 말하려고 했어.', '하려고 했어.']
			},
			{
				kind: 'p',
				html: 'Only the house and this chair still use the old one. He took Jesang when the seat got high. The tricks stayed Momal.',
				ko: '옛 이름을 쓰는 건 집이랑 이 의자뿐이다. 자리 높아지며 제상을 받았다. 장난은 모말로 남았다.'
			}
		]
	);

	// Chisul at the palace door said 제상 — walk made it 모말. Good.
	// Traitor charge must stay Park Jesang (walk preserved Park Jesang).

	// Foreign / prince lines that walk made too intimate: fix Mihae "No, Momal" back to Jesang
	for (const b of B) {
		if (b.kind === 'dialogue' && b.person === 'miseheun' && b.en?.[0]?.includes('Momal')) {
			b.en = b.en.map((s) => s.replace(/Momal/g, 'Jesang'));
			b.lines = (b.lines || []).map((s) => s.replace(/모말/g, '제상'));
		}
		if (b.kind === 'dialogue' && b.person === 'jesang' && Array.isArray(b.en)) {
			// In Wa / to princes, keep Jesang out of his mouth as self-name except the servant speech
			if (b.en[0]?.includes('Lord Mihae')) {
				/* keep */
			}
		}
	}

	// ——— new opening: desolate streets, peasants, council tent, overwhelmed Nulji ———
	insertAfter(
		B,
		(b) => b.kind === 'p' && b.html?.startsWith('A stone hits the palace wall'),
		[
			{
				kind: 'p',
				html: 'Further down, a stall has one fish and three buyers. The fish is yesterday. Nobody argues. Arguing costs breath.',
				ko: '더 내려가면 가게에 물고기 하나, 손 셋. 물고기는 어제의 것이다. 다투는 사람 없다. 숨이 아깝다.'
			},
			{
				kind: 'p',
				html: 'A peasant sits in the packed earth with his back to a post. White hemp. Bare feet. He is counting nothing. His mouth moves with the song anyway.',
				ko: '백성이 기둥에 등을 대고 다진 흙에 앉는다. 흰 베. 맨발. 세는 건 없다. 입은 그래도 노래를 따른다.'
			},
			{
				kind: 'dialogue',
				speaker: 'A peasant',
				gender: 'm',
				en: ['Rice went north.', 'The brothers went north.', 'What’s left for a field.'],
				lines: ['쌀은 북으로 갔지.', '아우들도 북으로 갔지.', '밭에 뭐가 남나.']
			},
			{
				kind: 'dialogue',
				speaker: 'His wife',
				gender: 'f',
				en: ['Don’t.', 'The banner can hear you.'],
				lines: ['그만.', '깃발이 듣는다.']
			},
			{
				kind: 'p',
				html: 'The red banner over the lane is faded at the fold. It has been there long enough to learn the wind. It does not leave.',
				ko: '골목 위 붉은 깃발, 접힌 데가 바랬다. 바람을 배울 만큼 오래 있다. 안 떠난다.'
			}
		]
	);

	insertAfter(
		B,
		(b) => b.kind === 'p' && b.html?.startsWith('Nulji hears it from the window'),
		[
			{
				kind: 'p',
				html: 'He has a list. He does not write it. Writing it would make it a country, and he is not sure he still has one.',
				ko: '목록이 있다. 안 적는다. 적으면 나라가 된다. 아직 있는지도 모른다.'
			},
			{
				kind: 'p',
				html: 'Bohae in the north. Mihae over the water. A hall that fills only when he asks who talks. A people who sing him empty. Goguryeo banners that learned the lanes. No army he can send without asking the man who put a boot on his father’s head.',
				ko: '보해는 북. 미해는 물 너머. 대청은 누가 말하냐고 물을 때만 찬다. 백성은 그를 비었다고 노래한다. 골목을 배운 고구려 깃발. 아비 머리에 발을 올린 자에게 안 묻고는 보낼 군대가 없다.'
			},
			{
				kind: 'scene',
				label: 'The Tent',
				ko: '장막'
			},
			{
				kind: 'p',
				html: 'The Harmony Council meets in a tent because the good hall leaks, and the timber that would fix it went north as rent.',
				ko: '화백은 장막에서 모인다. 좋은 대청은 샌다. 고칠 나무는 세로 북에 갔다.'
			},
			{
				kind: 'p',
				html: 'Half the canvas is ripped. Wind comes through like a councillor who was not invited. Someone has tied the tear with a sash that used to be white.',
				ko: '천의 반이 찢겼다. 바람은 안 부른 의원처럼 들어온다. 찢긴 데를 옛날엔 희던 띠로 묶었다.'
			},
			{
				kind: 'dialogue',
				speaker: 'A councillor',
				gender: 'm',
				en: ['We should write again.', 'Ask them to send the brothers home.', 'Politely.'],
				lines: ['다시 글을 써야지요.', '아우들을 돌려 달라.', '공손히.']
			},
			{
				kind: 'dialogue',
				speaker: 'A second councillor',
				gender: 'm',
				en: ['We wrote.', 'They kept the paper.', 'They kept the boys.'],
				lines: ['썼소.', '종이는 가져갔소.', '아이도 가져갔소.']
			},
			{
				kind: 'dialogue',
				speaker: 'A third',
				gender: 'm',
				en: ['Then we wait.', 'Waiting is also a policy.'],
				lines: ['그럼 기다립시다.', '기다리는 것도 정사지요.']
			},
			{
				kind: 'p',
				html: 'Nulji sits on a low stool that is not a throne. The crown is on. It does not help. He looks at the rip. He looks at the men. He does not look like a king who has an answer.',
				ko: '눌지는 왕좌가 아닌 낮은 걸상에 앉는다. 관은 썼다. 소용없다. 찢긴 데를 본다. 사람들을 본다. 답이 있는 임금처럼 안 보인다.'
			},
			{
				kind: 'dialogue',
				person: 'nulji',
				en: ['Who talks best.', 'Not here.', 'In a hall that can still say no to us.'],
				lines: ['누가 제일 잘 말해.', '여기 말고.', '아직 우리에게 아니 할 수 있는 대청에서.']
			},
			{
				kind: 'p',
				html: 'Nobody answers in the tent. They are used to not answering. He stands anyway. The sash on the rip comes loose and nobody ties it back.',
				ko: '장막에서는 답이 없다. 안 하는 데 익숙하다. 그래도 일어선다. 찢긴 데 띠가 풀린다. 다시 묶는 사람 없다.'
			}
		]
	);

	// The Ask already has "Who talks best" — that's the hall version. Fine, he asks twice.

	// ——— Bohae embrace ———
	insertAfter(
		B,
		(b) => b.kind === 'p' && b.html?.includes('comes in first') && b.html?.includes('stands up'),
		[
			{
				kind: 'p',
				html: 'Nulji does not speak first. He takes his brother by the back of the neck and holds him. Bohae’s purple silk is still wet from the Han. The king’s mouth is in his brother’s hair.',
				ko: '눌지는 먼저 말 안 한다. 아우 목덜미를 잡고 안는다. 보해의 보라 비단이 한강을 아직 머금고 있다. 임금의 입이 아우 머리카락에 있다.'
			},
			{
				kind: 'dialogue',
				person: 'nulji',
				en: ['You’re here.', 'You’re— you’re here.'],
				lines: ['왔다.', '너— 여기 있다.']
			},
			{
				kind: 'dialogue',
				person: 'bokho',
				en: ['…Hyung.', 'I thought the hall would be bigger.'],
				lines: ['……형.', '대청이 더 클 줄 알았소.']
			},
			{
				kind: 'p',
				html: 'They stay like that longer than a court allows. A maid looks away. Momal waits by the lamp and does not cough.',
				ko: '조정이 허락하는 것보다 오래 그렇게 있다. 계집종이 눈을 돌린다. 모말은 등불 곁에서 기다린다. 기침 안 한다.'
			}
		]
	);

	// ——— more visceral torture ———
	insertAfter(
		B,
		(b) => b.kind === 'p' && b.html?.startsWith('They beat him first'),
		[
			{
				kind: 'p',
				html: 'The post is already black from the last man. They spread his arms. Rope. A stake in packed earth. The yard is a ring of Wa faces that do not blink.',
				ko: '기둥은 지난 사람 때문에 이미 검다. 팔을 벌린다. 밧줄. 다진 흙의 말뚝. 마당은 눈 안 깜빡이는 왜의 얼굴들이다.'
			}
		]
	);

	insertAfter(
		B,
		(b) => b.kind === 'p' && b.html?.startsWith('They tie him to the post'),
		[
			{
				kind: 'p',
				html: 'The flames go up. Not a hearth. A column. Magenta silk becomes a dark shape inside it. From the road you would see a man-shaped hole in a sheet of fire, and the fire going into the sky.',
				ko: '불이 올라간다. 화덕이 아니다. 기둥이다. 자줏빛 비단이 그 안의 검은 모양이 된다. 길에서는, 불 장막 속 사람 모양 구멍만 보일 것이다. 그리고 하늘로 가는 불.'
			}
		]
	);

	// ——— Mihae embrace + hope ending ———
	insertAfter(
		B,
		(b) => b.kind === 'p' && b.html?.startsWith('Mihae comes home on the Silla ship'),
		[
			{
				kind: 'p',
				html: 'Nulji is already in the packed earth when the cream sail shows. He does not wait for the speech. He takes Mihae the way he took Bohae — both arms, no crown between them, the blue silk crushed against vermilion.',
				ko: '크림 돛이 보일 때 눌지는 이미 다진 흙에 있다. 말을 안 기다린다. 보해를 안듯이 미해를 안는다. 두 팔. 그 사이에 관 없다. 푸른 비단이 주홍에 구겨진다.'
			},
			{
				kind: 'dialogue',
				person: 'nulji',
				en: ['You’re late.', 'I don’t care.', 'Come here.'],
				lines: ['늦었다.', '상관없어.', '이리 와.']
			},
			{
				kind: 'dialogue',
				person: 'miseheun',
				en: ['Hyung—', 'The coat— he wore the coat—'],
				lines: ['형—', '그 옷— 그이가 입었어요—']
			},
			{
				kind: 'p',
				html: 'Nulji’s hand is on the back of the boy’s head. He lets him finish the sentence into his shoulder. The yard can wait.',
				ko: '눌지의 손이 아이 뒤통수에 있다. 어깨에 대고 문장을 끝내게 둔다. 마당은 기다려도 된다.'
			}
		]
	);

	insertAfter(
		B,
		(b) => b.kind === 'p' && b.html?.startsWith('They start to believe'),
		[
			{
				kind: 'scene',
				label: 'The Streets Again',
				ko: '다시, 거리'
			},
			{
				kind: 'p',
				html: 'The well-woman puts the bucket down and does not pick up a stone. The boy starts a different song and gets the words wrong, and nobody hits him for it.',
				ko: '우물가 여자가 들통을 내려놓고 돌을 안 집는다. 아이가 다른 노래를 시작하다 가사를 틀린다. 때리는 사람 없다.'
			},
			{
				kind: 'dialogue',
				speaker: 'A woman at the well',
				gender: 'f',
				en: ['That’s all three.', 'You hear me? That’s a country again.'],
				lines: ['저게 셋이야.', '들리냐. 다시 나라고.']
			},
			{
				kind: 'p',
				html: 'Nulji comes out of the gate. Not a funeral walk. The crown is on and he does not hide it. People stand. Someone shouts the name they used to sing empty. It comes out full.',
				ko: '눌지가 문으로 나온다. 장례 걸음이 아니다. 관을 쓰고 숨기지 않는다. 사람들이 선다. 누가, 예전에 비었다고 부르던 이름을 소리친다. 이번에는 차 있다.'
			},
			{
				kind: 'dialogue',
				speaker: 'A drunk against the gate',
				gender: 'm',
				en: ['Kan.', 'Our kan.', 'Look at him.'],
				lines: ['간이다.', '우리 간.', '봐라.']
			},
			{
				kind: 'p',
				html: 'He walks the lane the red banner used to own. The banner is still there. It looks smaller. A peasant in white hemp bows and then, because nobody stops him, he smiles.',
				ko: '붉은 깃발이 차지하던 골목을 걷는다. 깃발은 아직 있다. 작아 보인다. 흰 베 백성이 절하고, 말리는 사람 없어서, 웃는다.'
			},
			{
				kind: 'dialogue',
				person: 'nulji',
				en: ['Keep the songs.', 'Change the words.'],
				lines: ['노래는 남겨.', '가사만 바꿔.']
			}
		]
	);

	// Image alts / at fragments that name brothers
	for (const im of e.images ?? []) {
		if (im.alt) im.alt = brothers(im.alt);
		if (im.at) im.at = brothers(im.at);
	}

	console.log('title', e.title, 'blocks', B.length);
	return true;
});
