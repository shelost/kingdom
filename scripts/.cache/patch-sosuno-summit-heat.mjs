/**
 * Sosuno / Jumong / Tabal arc: fix dirty-talk calques, deepen grinding/creampie heat,
 * land the first five-tribes summit as kingship climax, wire new still slots.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(path, 'utf8'));
const jumong = story.flatMap((c) => c.entries).find((e) => e.title === 'Jumong');
if (!jumong) throw new Error('Jumong missing');

const p = (html, ko, nsfw) => ({ kind: 'p', html, ko, ...(nsfw ? { nsfw: true } : {}) });
const d = (person, chip, en, lines, nsfw) => ({
	kind: 'dialogue',
	person,
	chip,
	en,
	lines,
	...(nsfw ? { nsfw: true } : {})
});
const scene = (label, ko) => ({ kind: 'scene', label, ko });

const J = '#e8563f';
const S = '#e8a04a';
const T = '#a97c4a';

function enJoin(b) {
	return (b.en || []).join('\n');
}

function replaceBlock(pred, next, label) {
	const i = jumong.blocks.findIndex(pred);
	if (i < 0) throw new Error('block not found: ' + label);
	jumong.blocks[i] = next;
	return i;
}

function upsertImage(slot) {
	const i = jumong.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) jumong.images[i] = { ...jumong.images[i], ...slot };
	else jumong.images.push(slot);
}

// --- Fix loft dirty talk (no 그 고기) ---
replaceBlock(
	(b) => b.nsfw && b.person === 'sosuno' && enJoin(b).includes('hungry today'),
	d(
		'sosuno',
		S,
		[
			'Little Sosuno… you’re hungry today aren’t you…',
			'I don’t blame you…. 음! look at him…',
			'Those big— 흐읍— chest…. back….',
			'Ah— 뚝. Wait. Wait—',
			'Out there working shirtless… I want— 하아—'
		],
		[
			'작은 소서노야… 오늘 배고프지…',
			'이해해…. 음! 저 놈 봐봐…',
			'그 근육— 흐읍— 가슴…. 등….',
			'아— 뚝. 잠깐. 잠깐—',
			'저고리 벗고 일하네… 그거— 하아—'
		],
		true
	),
	'loft hunger'
);

replaceBlock(
	(b) => b.nsfw && b.person === 'sosuno' && enJoin(b).includes('some of that meat'),
	d(
		'sosuno',
		S,
		[
			'질척— don’t— 안 돼—',
			'You’re dripping. Listen. That’s you.',
			'Fill me— 하아— put it in— all of it—',
			'안 돼. 안 돼. 더—'
		],
		[
			'질척— 하지 마— 안 돼—',
			'흘리잖아. 들어. 네 소리야.',
			'채워— 하아— 넣어— 다—',
			'안 돼. 안 돼. 더—'
		],
		true
	),
	'loft fill'
);

// --- Grain room: grinding fit + creampie fetish + other-women dirty talk ---
replaceBlock(
	(b) =>
		b.nsfw &&
		typeof b.html === 'string' &&
		b.html.includes('Dusty-rose hiked, her back to him against the sacks'),
	p(
		'Dusty-rose hiked, her back to him against the sacks. She pulls him in by the collar and tells him she hates him in the same breath. Then the head of him presses and she goes quiet — too tight, too much — and she starts grinding that small ass back anyway, stubborn, until it seats. Love and spite in one grip. <b>since the first time</b>',
		'회분홍이 걷히고, 가마니에 등을 댄다. 깃을 잡고 끌어당기면서 미워한다고 한다. 그다음 끝이 닿고 말이 끊긴다 — 너무 꽉, 너무 커 — 그래도 그 작은 엉덩이를 뒤로 비벼 넣는다. 고집. 자리가 잡힐 때까지. 사랑과 미움이 한 손에. <b>처음 본 그날부터</b>',
		true
	),
	'grain grind setup'
);

const grindIdx = jumong.blocks.findIndex(
	(b) => b.nsfw && typeof b.html === 'string' && b.html.includes('grinding that small ass')
);
if (grindIdx < 0) throw new Error('grind setup missing after replace');
if (!jumong.blocks[grindIdx + 1]?.en?.join?.('\n')?.includes('Wait— wait wait— too—')) {
	jumong.blocks.splice(
		grindIdx + 1,
		0,
		d(
			'sosuno',
			S,
			[
				'Wait— wait wait— too—',
				'It won’t— ah— fit—',
				'Don’t pull out. Just— let me— grind—',
				'There— there— fuck— yes—'
			],
			[
				'잠깐— 잠깐잠깐— 너무—',
				'안— 아— 안 들어가—',
				'빼지 마. 그냥— 내가— 비빌게—',
				'거기— 거기— 씨— 응—'
			],
			true
		),
		d(
			'jumong',
			J,
			['Hey. Easy—', 'You’re shaking.', 'I’ve got you. Slow.'],
			['야. 천천히—', '떨리잖아.', '잡고 있어. 천천히.'],
			true
		),
		d(
			'sosuno',
			S,
			[
				'I said don’t be nice—',
				'I want it to hurt a little— then— then I want to ride that stretch—',
				'Other girls can look. Only I get this cock—'
			],
			[
				'착하게 굴 생각 마—',
				'조금 아팠으면 좋겠어— 그다음— 그 꽉 낀 거 타게—',
				'다른 년들은 눈으로만. 이 자지는 나만—'
			],
			true
		)
	);
}

replaceBlock(
	(b) => b.nsfw && b.person === 'sosuno' && enJoin(b).includes('man meat'),
	d(
		'sosuno',
		S,
		[
			'Look— look at you— that chest— that back— those hips I watched from the loft—',
			'That sound. Wet. Slap. That’s— that’s Little Sosuno, she’s— ah— dripping, she—',
			'Take it. Put it in— I said— destroy my tight little ass—',
			'Beat her up. Beat up Little Sosuno till she’s just wet. Nothing left. That’s all she is—'
		],
		[
			'봐— 봐봐— 그 가슴— 그 등— 그 엉덩이 다락에서 봤거든—',
			'그 소리. 젖은. 철썩. 그게— 작은 소서노야, 얘가— 아— 흘리고, 얘가—',
			'가져와. 넣어— 내 말— 내 꽉 끼는 엉덩이 박살내—',
			'두들겨 패. 작은 소서노 패. 젖은 것만 남게. 아무것도 없게. 그게 얘야—'
		],
		true
	),
	'grain man-meat fix'
);

replaceBlock(
	(b) => b.nsfw && b.person === 'sosuno' && enJoin(b).includes('Well girls'),
	d(
		'sosuno',
		S,
		[
			'Don’t slow. Don’t be nice. I said destroy—',
			'I want the slap. The noise when you— when you hit that wet— again— again—',
			'Fill her. Ruin her. She’s been hungry since the yard went quiet—',
			'Those well girls can stare all they want. They don’t get this. Only I get to fuck you—'
		],
		[
			'천천히 하지 마. 착하게 굴지 마. 박살내라니까—',
			'그 철썩 원해. 젖은 데 맞을 때 그 소리— 또— 또—',
			'채워. 망가뜨려. 마당 조용해진 그날부터 배고팠어—',
			'우물 년들은 눈만 굴려. 이건 못 가져. 너랑 하는 건 나뿐이야—'
		],
		true
	),
	'well girls claim'
);

replaceBlock(
	(b) => b.nsfw && b.person === 'sosuno' && enJoin(b).includes('The meat. All of it'),
	d(
		'sosuno',
		S,
		[
			'Don’t NAME her don’t— ah— she can hear— she likes it she likes it—',
			'Deeper. All of it. Don’t you dare pull out—',
			'AHH— DON’T STOP—',
			'DUMB BIG IDIOT—'
		],
		[
			'이름 부르지 마— 아— 듣거든— 좋아하거든 좋아하거든—',
			'더 깊이. 다. 빼지 마—',
			'아아— 멈추지 마—',
			'이 멍청한 큰 바보야—'
		],
		true
	),
	'pull out fix'
);

replaceBlock(
	(b) => b.nsfw && typeof b.html === 'string' && b.html.startsWith('He spends in her against the grain sacks'),
	p(
		'He spends in her against the grain sacks. Hot. Thick. She feels it hit and keeps grinding that tight little ass on him like she can milk more — creampie dripping down her thighs onto the millet dust, and she looks down at the mess like it is a ledger she finally likes. She bites his shoulder so she does not have to hear herself moan <b>Give me— all of it</b>.',
		'곡식 가마니에 대고 싼다. 뜨겁고, 진하다. 맞는 걸 느끼면서도 그 꽉 낀 엉덩이를 비비며 더 짜내려 한다 — 허벅지로 흘러 조 가루에 떨어지고, 그 지저분한 걸 장부처럼 내려다본다. 제 신음이 듣기 싫어서 어깨를 문다. <b>다 줘— 전부</b>.',
		true
	),
	'creampie spend'
);

// --- Five tribes summit climax ---
replaceBlock(
	(b) => b.kind === 'scene' && b.label === 'The First King',
	scene('First Summit of the Five Tribes', '오부 초대 회의'),
	'first king scene -> summit'
);

replaceBlock(
	(b) =>
		typeof b.html === 'string' &&
		b.html.includes('After the marriage the five tribes sit in Tabal'),
	p(
		'After the marriage the five tribes gather on Tabal’s packed-earth yard — <b>the first summit of the five tribes</b>. Five fires. Five roofs that hate sharing a yard. They sit anyway. They do the thing they hate more than a ditch: they agree. They vote Jumong first king — not because he asked, because the grin has already become a roof. <b>The five tribes vote.</b>',
		'혼인 뒤에 다섯 부족이 연타발의 다진 흙 마당에 모인다 — <b>오부 초대 회의</b>. 불 다섯. 마당을 안 나누던 지붕 다섯. 그래도 앉는다. 도랑보다 싫은 일을 한다. 합의. 주몽을 첫 왕으로 뽑는다 — 그가 청해서가 아니다. 그 웃음이 이미 지붕이 되어서. <b>다섯 부족이 뽑는다.</b>'
	),
	'summit gather'
);

const iKingReply = jumong.blocks.findIndex(
	(b) => b.person === 'jumong' && enJoin(b).includes('For the roof.') && enJoin(b).includes('I will.')
);
if (iKingReply < 0) throw new Error('king reply missing');

const already = jumong.blocks.some((b) => b.kind === 'scene' && b.label === 'Behind the Door');
if (!already) {
	const summitTail = [
		p(
			'No feast. No drum line. Tabal sets a vermilion cord on his son-in-law’s brow the way a man sets a tool on a workbench — rough, final. The five fires take the same wind. Sosuno stands at the rail in dusty-rose, chin up, first queen of a country that still smells like millet. <b>the largest kingdom in Samhan</b> is a later map. Tonight the map is five roofs answering one name.',
			'잔치 없다. 북줄도 없다. 연타발이 사위의 이마에 주홍 끈을 올린다 — 연장 올려두듯, 거칠고, 끝. 불 다섯이 같은 바람을 먹는다. 소서노는 회분홍으로 난간에 선다. 턱. 아직 조 냄새 나는 나라의 첫 왕비. <b>삼한에서 가장 큰 나라</b>는 나중의 지도다. 오늘 밤의 지도는 이름 하나에 대답하는 지붕 다섯.'
		),
		d(
			'sosuno',
			S,
			[
				'Don’t look at me like that in front of them.',
				'I’m counting the fires.',
				'…You can look later. Behind the door.'
			],
			['그들 앞에서 그 눈으로 보지 마.', '불 세는 중이니까.', '…나중에 봐. 문 안에서.']
		),
		d(
			'jumong',
			J,
			['Yes, ma’am.', 'King later.', 'Husband first if you say so.'],
			['예.', '왕은 나중에.', '당신이 시키면 남편 먼저.']
		),
		d(
			'yeontabal',
			T,
			[
				'Eat.',
				'Then go be quiet somewhere I can’t hear.',
				'If the ditches open again I blame both of you.'
			],
			['먹어.', '그다음 내가 안 듣는 데서 조용히 해.', '도랑 다시 열리면 둘 다 네 탓이다.']
		),
		scene('Behind the Door', '문 안'),
		p(
			'Outside she is first queen of Goguryeo — cord, rail, five fires answering. Inside the grain room again, the dusty-rose hits the floor and she is still the dirtiest woman in the valley for her dream man. She backs onto him and works that tight little ass in a grind until the stretch makes her swear. <b>The marriage is real hunger first</b>',
			'밖에서는 고구려의 첫 왕비다 — 끈, 난간, 대답하는 불 다섯. 다시 곡식방 안에서는 회분홍이 바닥에 떨어지고, 꿈에 그리던 사내 앞에서는 골짜기에서 제일 야한 여자다. 뒤로 올라타 그 꽉 낀 엉덩이를 비벼 넣는다. 늘어나는 게 욕이 나오게. <b>혼인은 먼저 진짜 허기다</b>',
			true
		),
		d(
			'sosuno',
			S,
			[
				'Queen out there. Here I’m— ah— your dirty little—',
				'Grind— wait— let me— seat it— fuck it’s big—',
				'Those porch girls wanted you. The well ones. The chieftain’s kid.',
				'They can starve. Only I get to fuck the king—'
			],
			[
				'밖에선 왕비. 여기선— 아— 네 더러운—',
				'비벼— 잠깐— 자리— 씨 커—',
				'누대 년들이 너 원해 했어. 우물 것들도. 그 족장 딸도.',
				'굶기든가. 왕 따먹는 건 나뿐이야—'
			],
			true
		),
		d(
			'jumong',
			J,
			['Hey—', 'You’re the queen.', 'Also— god— look at you talking.'],
			['야—', '왕비잖아.', '그리고— 진짜— 말하는 거 봐.'],
			true
		),
		d(
			'sosuno',
			S,
			[
				'Don’t call me queen when you’re in me—',
				'Call me— Little Sosuno— no don’t— ah she likes it—',
				'Cum in. Don’t pull out. I want to feel it drip—',
				'Fill me till it runs down my thighs. That’s my crown—'
			],
			[
				'안에 있을 때 왕비라고 하지 마—',
				'작은 소서노라고— 아니 하지 마— 아 얘 좋아하거든—',
				'안에 싸. 빼지 마. 흘러내리는 거 느끼고 싶어—',
				'허벅지로 흐를 때까지 채워. 그게 내 관이야—'
			],
			true
		),
		p(
			'He finishes deep. She keeps grinding through it — milking, greedy — until white runs down dusty skin onto millet dust and she laughs once, wrecked, triumphant, the first queen of a country and the slut who got there first. <b>Give me— all of it</b>',
			'깊숙이 싼다. 그래도 비빈다 — 짜내고, 욕심 — 흰 게 회분홍 피부로 흘러 조 가루에 떨어지고, 한 번 웃는다. 망가지고, 이기고. 나라의 첫 왕비이자, 먼저 가져간 년. <b>다 줘— 전부</b>',
			true
		),
		d(
			'sosuno',
			S,
			[
				'…Don’t tell the yard.',
				'I’m still counting fires in public.',
				'In here you’re mine. Only mine.',
				'Big idiot. Stay.'
			],
			['…마당엔 말하지 마.', '밖에선 아직 불 세는 여자야.', '여기선 내 거야. 나만.', '이 큰 바보. 남아.'],
			true
		),
		d(
			'jumong',
			J,
			['Staying.', 'Fires can wait.', 'You’re fun when you’re like this.'],
			['남아.', '불은 기다려도 돼.', '이럴 때 재밌어.'],
			true
		)
	];
	jumong.blocks.splice(iKingReply + 1, 0, ...summitTail);
}

replaceBlock(
	(b) =>
		typeof b.html === 'string' &&
		b.html.includes('He comes out of the cavern a king the valley already'),
	p(
		'He comes out of the cavern a king the valley already crowned at the first summit, and a son who finally saw the face that had been the hour. The chronicles start the years from the five fires. His descendants will push the borders until Goryeo is <b>the largest kingdom in Samhan</b> — a later argument, a later map. This morning is only a roof, a grin, and a gold break in the stone.',
		'오부 초대 회의에서 이미 올린 왕으로, 시각이던 얼굴을 드디어 본 아들로, 동굴에서 나온다. 편년은 불 다섯부터 해를 센다. 자손은 국경을 밀어 <b>삼한에서 가장 큰 나라</b>를 만들 것이다 — 나중의 싸움, 나중의 지도. 이 아침은 지붕과 웃음과, 돌 틈의 금빛뿐이다.'
	),
	'cavern coda'
);

// --- Image slots ---
const houseHint =
	'HIGH CONTRAST: crushed blacks + one hard key + long shadows. ONE named geometric device. Dramatic pose (dutch / worm’s-eye / lower-third). Person hex as plane or single accent. No even daylight postcard. No text. No watermark.';

upsertImage({
	id: 'sosuno-grain-porch',
	ratio: 1.778,
	tone: S,
	nsfw: false,
	at: 'already on the grain porch',
	alt: 'Wide Jolbon grain porch: Sosuno mid-count as tiny Jumong enters the yard below',
	prompt: `Minimal iconic 16:9 still. DUTCH crane wide of REAL Jolbon timber grain porch — grey giwa, packed earth, millet sacks as stamps. Sosuno on the porch rail mid-count, dusty-rose chima, FACE from attached portrait, NEW body leaning on rail not fashion plate. Tiny Jumong lower-third in red #e8563f silk entering yard. ONE device: the porch beam as a hard horizontal bar. Sosuno #e8a04a as rim on dusty-rose only — not gold robes. ${houseHint}`,
	refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
	people: ['sosuno', 'jumong']
});

upsertImage({
	id: 'jumong-seq-summit-wide',
	ratio: 1.778,
	tone: J,
	nsfw: false,
	at: 'the first summit of the five tribes',
	alt: 'Iconic wide: first summit of the five tribes — five fire-stamps on packed earth, tiny figures',
	prompt: `Minimal iconic 16:9 still. BIRD’S-EYE dutch of REAL Jolbon packed-earth tribal yard — timber halls, grey giwa, five small fire-stamps in a broken ring. Tiny silky hanbok figures lower-third only. ONE device: five fires as a broken ring geometry. Jumong #e8563f as a single red accent on one figure. Natural dusk sky, crushed blacks, long shadows. No army catalog. No text. No watermark. ${houseHint}`,
	refs: ['/ch_jumong.png', '/pl_white_river.png'],
	people: ['jumong']
});

upsertImage({
	id: 'jumong-seq-summit-fires',
	ratio: 1.778,
	tone: T,
	nsfw: false,
	at: 'Five fires. Five roofs',
	alt: 'Worm’s-eye: five fires answering one wind in Tabal’s yard',
	prompt: `Minimal iconic 16:9 still. WORM’S-EYE dutch in REAL Jolbon timber yard. FIVE fire-stamps as vertical columns of ember light. Tiny chieftain silhouettes. ONE device: five fire columns as the whole geometry. Tabal #a97c4a cloth accent only. Crushed blacks, monumental emptiness. No crowd catalog. No text. No watermark. ${houseHint}`,
	refs: ['/ch_yeon_tabal.png'],
	people: ['yeontabal']
});

upsertImage({
	id: 'jumong-seq-summit-crown',
	ratio: 1.778,
	tone: J,
	nsfw: false,
	at: 'vermilion cord on his son-in-law’s brow',
	alt: 'Tabal sets a vermilion cord on Jumong’s brow — first king at the summit',
	prompt: `Minimal iconic 16:9 still. DUTCH OTS: Yeon Tabal setting a vermilion cord on Jumong’s brow in REAL Jolbon packed-earth yard. FACES from attached portraits; NEW kinetic bodies — not fashion clones. ONE device: the vermilion cord as a hard horizontal stamp across the frame. Jumong #e8563f as rim/plane; Tabal #a97c4a second accent only. Five fire bokeh behind. High contrast chiaroscuro. No army. No text. No watermark. ${houseHint}`,
	refs: ['/ch_jumong.png', '/ch_yeon_tabal.png'],
	people: ['jumong', 'yeontabal']
});

upsertImage({
	id: 'jumong-seq-summit-queen',
	ratio: 1.778,
	tone: S,
	nsfw: false,
	at: 'first queen of a country that still smells like millet',
	alt: 'Sosuno at the rail in dusty-rose — first queen, five fires answering',
	prompt: `Minimal iconic 16:9 still. DUTCH: Sosuno at a timber porch rail, dusty-rose chima, chin up, first queen. FACE AND GARMENTS from attached portrait + binyeo; NEW lean-on-rail body. Jumong tiny lower-third with vermilion cord, #e8563f rim. ONE device: the rail as a hard horizontal. Sosuno #e8a04a as single rim accent — dusty-rose stays dusty-rose, not gold. Five fire stamps in bokeh. Crushed blacks. No text. No watermark. ${houseHint}`,
	refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
	people: ['sosuno', 'jumong']
});

upsertImage({
	id: 'jumong-seq-king-vote',
	ratio: 1.778,
	tone: J,
	nsfw: false,
	at: 'The five tribes vote',
	alt: 'Five tribe seals agree — Jumong mid-kneel in Tabal’s yard',
	prompt: `Minimal iconic 16:9 still. DUTCH: Jumong mid-kneel on packed earth accepting the vote, FACE from ch_jumong, NEW body. Tiny elder stamps at edges. ONE device: five hand-seals / cord stamps in a low arc. #e8563f as plane. Real Jolbon timber hall bokeh. High contrast. No army. No text. No watermark. ${houseHint}`,
	refs: ['/ch_jumong.png', '/ch_yeon_tabal.png'],
	people: ['jumong', 'yeontabal']
});

upsertImage({
	id: 'jumong-seq-tribes-wide',
	ratio: 1.778,
	tone: J,
	nsfw: false,
	at: 'You keep cutting each other',
	alt: 'Wide: five Jolbon roofs that will not share a yard',
	prompt: `Minimal iconic 16:9 still. BIRD’S-EYE of REAL Jolbon valley — five timber/giwa roof stamps that refuse a shared yard, ditches as dark seams. Tiny figures only. ONE device: five roofs as a broken ring. #e8563f single accent on one bow-man. Natural sky, crushed blacks, long shadows. No army. No text. No watermark. ${houseHint}`,
	refs: ['/ch_jumong.png', '/pl_white_river.png'],
	people: ['jumong']
});

upsertImage({
	id: 'nsfw-sosuno-grind-fit',
	ratio: 1.778,
	tone: S,
	nsfw: true,
	at: 'It won’t— ah— fit—',
	alt: 'Intimate: Sosuno grinding to seat Jumong — too tight, stubborn',
	prompt:
		'Intimate CLOSE 16:9 erotic manhwa panel. Sosuno dusty-rose hiked, grinding her tight ass back onto Jumong against grain sacks, struggling to fit, heavy blush, bitten mouth, sweat. FACE from ch_sosuno + bn_sosuno; Jumong FACE from ch_jumong. #e8a04a rim; #e8563f key on his skin. One device: her arched back as a hard curve. Explicit penetration stretch. No text. No watermark.',
	refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
	people: ['sosuno', 'jumong']
});

upsertImage({
	id: 'nsfw-sosuno-creampie-drip',
	ratio: 1.778,
	tone: S,
	nsfw: true,
	at: 'creampie dripping down her thighs',
	alt: 'Intimate: creampie drip down Sosuno’s thighs onto millet dust',
	prompt:
		'Intimate CLOSE 16:9 erotic manhwa. Aftermath: Sosuno looking down at cum dripping from her used pussy down thighs onto millet dust, wrecked triumphant face, heavy blush. FACE from ch_sosuno. Jumong’s red-silk hip at frame edge. #e8a04a accent. Grain-room timber. Explicit creampie fetish. No text. No watermark.',
	refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
	people: ['sosuno', 'jumong']
});

upsertImage({
	id: 'nsfw-sosuno-queen-slut',
	ratio: 1.778,
	tone: S,
	nsfw: true,
	at: 'Queen out there. Here I’m— ah— your dirty little—',
	alt: 'Intimate: first queen Sosuno riding/grinding Jumong behind the door',
	prompt:
		'Intimate CLOSE 16:9. Contrast beat: Sosuno riding Jumong reverse, dusty-rose fallen, vermilion cord still in her fist, filthy pleasure face. FACE from ch_sosuno + bn; Jumong from ch_jumong. #e8a04a and #e8563f as dual accents. Grain timber. Explicit sex, grinding ass. No text. No watermark.',
	refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
	people: ['sosuno', 'jumong']
});

upsertImage({
	id: 'nsfw-sosuno-only-mine',
	ratio: 1.778,
	tone: S,
	nsfw: true,
	at: 'Only I get to fuck the king—',
	alt: 'Intimate ECU: Sosuno dirty-talk face — jealous, wrecked, claiming Jumong',
	prompt:
		'Intimate ECU 16:9 manhwa. Sosuno face filling frame — open mouth, drool, heavy blush, blown pupils, whispering filthy jealousy. FACE from ch_sosuno + bn. Jumong’s shoulder #e8563f behind. #e8a04a rim. Grain loft shadow. No text. No watermark.',
	refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
	people: ['sosuno']
});

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');

const meat = jumong.blocks.filter(
	(b) => b.kind === 'dialogue' && JSON.stringify(b).includes('그 고기')
);
console.log(
	JSON.stringify(
		{
			blocks: jumong.blocks.length,
			images: jumong.images.length,
			behindDoor: jumong.blocks.some((b) => b.label === 'Behind the Door'),
			firstSummit: jumong.blocks.some(
				(b) => typeof b.html === 'string' && b.html.includes('first summit of the five tribes')
			),
			meatDialogues: meat.length,
			newSlots: [
				'sosuno-grain-porch',
				'jumong-seq-summit-wide',
				'jumong-seq-summit-fires',
				'jumong-seq-summit-crown',
				'jumong-seq-summit-queen',
				'nsfw-sosuno-grind-fit',
				'nsfw-sosuno-creampie-drip',
				'nsfw-sosuno-queen-slut',
				'nsfw-sosuno-only-mine'
			].map((id) => !!jumong.images.find((im) => im.id === id))
		},
		null,
		2
	)
);
