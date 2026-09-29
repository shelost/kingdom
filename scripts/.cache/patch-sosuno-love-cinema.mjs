import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const entry = Object.values(story)
	.flatMap((ch) => ch.entries ?? [])
	.find((e) => e.title === 'Jumong');
if (!entry) throw new Error('Jumong entry missing');

const idx = (pred, label) => {
	const i = entry.blocks.findIndex(pred);
	if (i < 0) throw new Error('block not found: ' + label);
	return i;
};

const hasHtml = (s) => (b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes(s);
const hasEn0 = (person, line) => (b) =>
	b.kind === 'dialogue' && b.person === person && Array.isArray(b.en) && b.en[0] === line;

function upsertImage(slot) {
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) {
		entry.images[i] = { ...entry.images[i], ...slot };
		return;
	}
	entry.images.push(slot);
}

const sosunoRefs = ['/ch_sosuno.png', '/bn_sosuno.png'];
const bothRefs = ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'];
const queenRefs = ['/ch_sosuno_queen.png', '/bn_sosuno.png'];

const sfw = (id, at, alt, prompt, extra = {}) => ({
	id,
	ratio: extra.ratio ?? 1.778,
	tone: extra.tone ?? '#e8a04a',
	nsfw: false,
	at,
	alt,
	prompt,
	refs: extra.refs ?? sosunoRefs,
	people: extra.people ?? ['sosuno']
});

const nsfw = (id, at, alt, prompt, extra = {}) => ({
	id,
	ratio: extra.ratio ?? 0.75,
	tone: extra.tone ?? '#e8a04a',
	nsfw: true,
	at,
	alt,
	prompt,
	refs: extra.refs ?? sosunoRefs,
	people: extra.people ?? ['sosuno']
});

// --- Falling in love after she prices him ---
{
	const i = idx(hasHtml('She prices him, then forgets the count'), 'prices him');
	entry.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'The spear-count is still in her mouth. Then it is not. Packed earth drops out. In her head the yard is crushed black, and he is the only color left — a red she did not put on the ledger. Dusty-rose heat she did not ask for. Chin still up. Something under it is not. She hates that. <b>Something in her goes stupid.</b>',
		ko: '창 점고가 아직 입에 있다. 그다음엔 없다. 다진 흙이 빠진다. 머릿속 마당은 짓눌린 검고, 남은 색은 그 놈뿐이다 — 장부에 안 올린 빨강. 시키지도 않은 회분홍 열. 턱은 올라가 있다. 그 아래는 아니다. 그게 싫다. <b>안에서 뭔가 바보가 된다.</b>'
	}, {
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: [
			'Why did it go quiet.',
			'I didn’t tell it to.',
			'Don’t look at his mouth. You’re looking.',
			'Little Sosuno. Stop. I said stop—',
			'I don’t even know his name. That’s— that’s not—'
		],
		lines: [
			'왜 조용해진 거야.',
			'내가 시키지도 않았는데.',
			'입 보지 마. 보고 있잖아.',
			'작은 소서노. 멈춰. 멈추라니까—',
			'이름도 모르는데. 그건— 그건 아닌데—'
		]
	});
}

// --- Other daughters: pose + kick-out ---
{
	const i = idx(hasHtml('At the well three girls laugh too long'), 'three girls');
	const j = idx(hasEn0('sosuno', 'The roof owns him.'), 'roof owns');
	const kick = [
		{
			kind: 'p',
			html: 'At the well they pose like they practiced. Teal hikes the chima a finger and laughs into it. Saffron leans on the beam, hip first, like the bucket is a joke he is in. Plum looks at him over a sleeve. He grins easy — the sun-grin, not even trying. Sosuno arrives with an empty bucket she does not need. The laugh dies late. <b>They hitch at his well.</b>',
			ko: '우물에서 연습한 것처럼 선다. 청록이 치마를 한 손가락 걷고 그 안으로 웃는다. 사프란은 들보에 엉덩이부터 기대고, 두레박이 그 놈 농담인 척. 자두는 소매 너머로 본다. 그는 쉽게 웃는다 — 해 웃음, 힘도 안 주고. 소서노가 필요 없는 빈 두레박을 들고 온다. 웃음이 늦게 죽는다. <b>그의 우물에 엉덩이를 건다.</b>'
		},
		{
			kind: 'dialogue',
			person: 'jumong',
			chip: '#e8563f',
			en: [
				'Hi.',
				'I didn’t— I just pulled the rope.',
				'They’re funny. I didn’t say anything.'
			],
			lines: [
				'안녕.',
				'난— 줄만 당겼어.',
				'웃기네. 난 말 안 했어.'
			]
		},
		{
			kind: 'dialogue',
			chip: '#c4a06a',
			en: [
				'Stay. The knot can wait.',
				'Your arms are— yeah.',
				'Come fetch at our well next. Ours is nicer.'
			],
			lines: [
				'있어. 매듭은 기다려.',
				'팔이— 그래.',
				'다음엔 우리 우물로. 우리 게 더 좋아.'
			]
		},
		{
			kind: 'p',
			html: 'She finds a flaw because that is what eldest does. Teal’s pin is crooked. Saffron’s laugh is too wet. Then she stops finding flaws and uses her mouth like a hunt. <b>Get off my well.</b>',
			ko: '흠을 찾는다. 맏이가 하는 일이다. 청록 비녀가 삐뚤다. 사프란 웃음이 너무 젖었다. 그다음 흠 찾기를 그만두고 사냥처럼 입을 쓴다. <b>내 우물에서 꺼져.</b>'
		},
		{
			kind: 'dialogue',
			person: 'sosuno',
			chip: '#e8a04a',
			en: [
				'Get off my well.',
				'That’s my worker. Sleeve. Ditch. Now.',
				'You can laugh at empty buckets. Not at him.',
				'Go. I said go. If I count to three you’re on the west line with bent spears.'
			],
			lines: [
				'내 우물에서 꺼져.',
				'내 일꾼이야. 소매. 도랑. 지금.',
				'빈 두레박 보고 웃든가. 그 놈은 안 돼.',
				'가. 가라니까. 셋 세면 휜 창 들고 서쪽 줄이야.'
			]
		},
		{
			kind: 'dialogue',
			chip: '#c4a06a',
			en: [
				'She’s scary.',
				'He’s still looking though.',
				'…Going. Going.'
			],
			lines: [
				'무섭다.',
				'근데 아직 보긴 보더라.',
				'…가. 가.'
			]
		},
		{
			kind: 'dialogue',
			person: 'jumong',
			chip: '#e8563f',
			en: [
				'You kicked them.',
				'I was just— rope.',
				'…You’re scowling.'
			],
			lines: [
				'쫓아냈네.',
				'난 그냥— 줄.',
				'…너 찌푸리잖아.'
			]
		},
		{
			kind: 'dialogue',
			person: 'sosuno',
			chip: '#e8a04a',
			en: [
				'Stop enjoying it.',
				'Don’t smile at them.',
				'Father put you on my count. I count.',
				'The roof owns him. I count the roof. Next.'
			],
			lines: [
				'즐기지 마.',
				'그애들한테 웃지 마.',
				'아버지가 내 셈에 올렸어. 내가 세.',
				'지붕이 가져. 지붕은 내가 세. 다음.'
			]
		}
	];
	entry.blocks.splice(i, j - i + 1, ...kick);
}

// --- Loft: visceral ---
{
	const i = idx(hasHtml('Little Sosuno.'), 'loft little p');
	entry.blocks[i] = {
		kind: 'p',
		html: 'Dusty-rose hiked around the hips. She sits on the loft timber with her legs spread wide — not a goddess invitation, a mortal one, knees shaking, packed-earth heat still on her skin. One hand over her mouth. The other already talking to the part of her that does not run a hunt. Shame and want in the same breath. <b>Little Sosuno.</b> <b>Legs wide on the timber.</b>',
		ko: '회분홍이 허리까지 걷힌다. 다락 나무에 다리 크게 벌리고 앉는다 — 여신 초대가 아니라 사람 것, 무릎이 떨리고, 다진 흙 열이 아직 피부에. 한 손은 입. 다른 손은 이미 사냥 안 돌리는 쪽에 말을 건다. 부끄러움과 욕이 한 숨. <b>작은 소서노.</b> <b>나무에 다리 벌리고.</b>'
	};
}
{
	const i = idx(
		(b) =>
			b.kind === 'dialogue' &&
			b.person === 'sosuno' &&
			Array.isArray(b.en) &&
			b.en[0]?.startsWith('Little Sosuno'),
		'little sosuno loft talk'
	);
	entry.blocks[i] = {
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: [
			'Little Sosuno… you’re hungry today aren’t you…',
			'I don’t blame you…. 음! look at him…',
			'Those big— 흐읍— chest…. back….',
			'Spread. Wider. He can’t see. That’s the point. That’s— ah—',
			'You pulled him off teal for a ditch. Liar.',
			'Out there working shirtless… I want— 하아—'
		],
		lines: [
			'작은 소서노야… 오늘 배고프지…',
			'이해해…. 음! 저 놈 봐봐…',
			'그 근육— 흐읍— 가슴…. 등….',
			'벌려. 더. 안 보잖아. 그게 포인트야. 그게— 아—',
			'청록이한테서 빼서 도랑 시켰지. 거짓말쟁이야.',
			'저고리 벗고 일하네… 그거— 하아—'
		]
	};
}
{
	const i = idx(hasHtml('Silk hitch'), 'silk hitch');
	entry.blocks[i] = {
		kind: 'p',
		html: 'Silk hitch. Two fingers under the hiked chima, in, slow because she is still the eldest downstairs and a coward up here. The loft is quiet except the wet. <b>질척.</b> She hates that she can hear it. She does it anyway — legs still open, wrist working, forehead on the window frame so she does not have to watch her own hand. <b>Fingers under the chima.</b>',
		ko: '비단이 걸린다. 걷힌 치마 밑으로 손가락 둘, 들어가, 아래에서는 아직 맏이고 위에서는 겁쟁이라 천천히. 다락은 그 젖은 소리만. <b>질척.</b> 들리는 게 싫다. 그래도 한다 — 다리는 그대로 벌리고, 손목이 일하고, 자기 손을 안 보려고 창틀에 이마. <b>치마 밑 손가락.</b>'
	};
}
{
	const i = idx(
		(b) =>
			b.kind === 'dialogue' &&
			b.person === 'sosuno' &&
			Array.isArray(b.en) &&
			b.en[0]?.startsWith('질척'),
		'wet loft talk'
	);
	entry.blocks[i] = {
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: [
			'질척— don’t— 안 돼—',
			'You’re dripping. Listen. That’s you. Fingers. Two. Deeper—',
			'Fill me— 하아— put it in— all of it— his, not mine—',
			'안 돼. 안 돼. 더— 벌려 그대로—',
			'If he looks up he can’t see this. If he looks up I die. Don’t stop—'
		],
		lines: [
			'질척— 하지 마— 안 돼—',
			'흘리잖아. 들어. 네 소리야. 손가락. 둘. 더 깊이—',
			'채워— 하아— 넣어— 다— 내 거 말고 그 놈 거—',
			'안 돼. 안 돼. 더— 벌린 채—',
			'올려다보면 이 꼴은 안 보여. 올려다보면 죽어. 멈추지 마—'
		]
	};
}

// --- Surprise kiss ---
{
	const i = idx(hasHtml('He kisses her at the well-beam'), 'kiss p');
	const j = idx(hasEn0('sosuno', 'Did not.'), 'did not kiss back');
	entry.blocks.splice(i, j - i + 1,
		{
			kind: 'p',
			html: 'He does not wait for her to finish being brave. Packed earth, the rim, the beam. He takes her face and kisses her without asking — no count, no hi, just his mouth. She goes rigid. The bucket rope slaps the stone. <b>He kisses her at the well-beam.</b>',
			ko: '그녀가 용감한 척을 끝낼 때까지 안 기다린다. 다진 흙, 테, 들보. 얼굴을 잡고 묻지도 않고 입을 맞춘다 — 셈도 안녕도 없이, 입만. 몸이 굳는다. 두레박 줄이 돌에 맞는다. <b>우물 들보에서 입을 맞춘다.</b>'
		},
		{
			kind: 'p',
			html: 'Shock first. Then the blush detonates — ears, throat, the whole dusty-rose. Her hands hit his chest. Water sloshes his sleeve. She shoves. <b>How dare you.</b>',
			ko: '먼저 놀람. 그다음 홍조가 터진다 — 귀, 목, 회분홍 전부. 손이 가슴을 친다. 물이 소매에 튄다. 민다. <b>어떻게 감히.</b>'
		},
		{
			kind: 'dialogue',
			person: 'sosuno',
			chip: '#e8a04a',
			en: [
				'You—',
				'How dare you.',
				'My father’s well—',
				'Don’t— don’t just—'
			],
			lines: [
				'너—',
				'어떻게 감히.',
				'아버지 우물에서—',
				'그냥— 그냥 하지—'
			]
		},
		{
			kind: 'dialogue',
			person: 'jumong',
			chip: '#e8563f',
			en: [
				'Hey. Hey— you okay?',
				'You were listing buckets like a war.',
				'I just— wanted to.'
			],
			lines: [
				'야. 야— 괜찮아?',
				'두레박을 전쟁처럼 세고 있었잖아.',
				'그냥— 하고 싶었어.'
			]
		},
		{
			kind: 'p',
			html: 'She hits his chest again, not hard enough to mean it, hard enough to cover. Water still dripping off the beam. Her mouth is open like she might shout and then she does not. <b>Don’t grin. If you grin I—</b>',
			ko: '가슴을 한 번 더 친다. 진심일 만큼은 아니고, 가릴 만큼은. 들보에서 물이 아직 떨어진다. 입이 벌어져 소리칠 것 같다가 안 한다. <b>웃지 마. 웃으면 나—</b>'
		},
		{
			kind: 'dialogue',
			person: 'sosuno',
			chip: '#e8a04a',
			en: [
				'Don’t grin. If you grin I—',
				'Did not kiss back. Surprise. That’s all.',
				'…The second bucket still isn’t full.'
			],
			lines: [
				'웃지 마. 웃으면 나—',
				'안 따라왔어. 놀라서. 그게 다야.',
				'…둘째 두레박 아직 안 찼어.'
			]
		}
	);
}

// --- Queen/king sex extra beats ---
{
	const i = idx(hasHtml('her royal back is the picture'), 'royal back p');
	entry.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'She turns on all fours on the millet sacks the way she used to hide a hunt stance. Naked. Ass as the picture — royal back dipping, looking over her shoulder like she is still shocked he will look. Then she backs onto him. <b>her royal ass is the picture.</b>',
		ko: '조 가마니 위에 네 발로 돈다. 예전에 사냥 자세를 숨기던 것처럼. 벗고. 엉덩이가 그림이다 — 왕비 등이 내려가고, 넘겨보는 눈은 아직 보면 안 되는 척. 그다음 뒤로 올라탄다. <b>왕비의 엉덩이가 그림이다.</b>'
	}, {
		kind: 'p',
		html: 'Grind, not a pose. Skin on skin. The cord is still in her fist. She works him until the stretch makes her swear, then laughs at herself for swearing. <b>Grind me like a queen.</b>',
		ko: '자세가 아니라 비빔. 살과 살. 끈이 아직 주먹에. 늘어나 욕이 나올 때까지 비비고, 욕한 자기를 보고 웃는다. <b>왕비처럼 비벼.</b>'
	}, {
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: [
			'Look. Don’t look. Look.',
			'That’s— that’s the picture. My back. My— ah— ass. You wanted it.',
			'Grind me like a queen. No. Like Little Sosuno. Both. I don’t care.',
			'Naked. Door shut. If the yard heard this I would still—'
		],
		lines: [
			'봐. 보지 마. 봐.',
			'그게— 그게 그림이야. 등. 내— 아— 엉덩이. 원했잖아.',
			'왕비처럼 비벼. 아니. 작은 소서노처럼. 둘 다. 상관없어.',
			'벗고. 문 닫고. 마당이 들어도 난 그래도—'
		]
	});
}

// --- Image slots ---
upsertImage(
	sfw(
		'sosuno-seq-love-void',
		'Something in her goes stupid',
		'Iconic crushed-black void: Sosuno lower-third, stern face cracking to want, one dusty-rose plane',
		'Minimal iconic 16:9 still. Empty crushed BLACK void, indoor/night-black. Poster-scale Sosuno in the lower third, mid-turn, chin cracking from girl-boss to want, bitten mouth, blown black pupils, dark irises, Korean eyes NOT blue/green/gold/glowing. ONE dusty-rose #e8a04a plane as the only accent — silk catching that hue, not gold robes. FACE AND GARMENTS from attached ch_sosuno + binyeo from bn_sosuno. New dramatic body, not portrait stance, not clasped hands. High contrast tenebrism. No well, no yard clutter, no text, no watermark.',
		{ refs: sosunoRefs, people: ['sosuno'] }
	)
);
upsertImage(
	sfw(
		'sosuno-seq-love-ecu',
		'Something in her goes stupid',
		'ECU: Sosuno eyes and mouth, black pupils blown, blush, yard gone',
		'Minimal iconic 3:4 ECU. Faces fill the frame. Sosuno eyes and mouth only — stern cracking, heavy blush, blown BLACK pupils, dark irises, Korean eyes, NOT blue/green/gold/glowing. Dusty-rose #e8a04a as a thin rim. FACE from attached ch_sosuno, binyeo from bn_sosuno if hair visible. Shallow DOF, chiaroscuro, crushed blacks. No even daylight. No text. No watermark.',
		{ ratio: 0.75, refs: sosunoRefs, people: ['sosuno'] }
	)
);
upsertImage(
	sfw(
		'jumong-seq-first-look-ots',
		'The yard goes quiet',
		'Dutch OTS: first look across packed earth, Sosuno POV on red silk',
		'Minimal iconic 16:9 still. CINEMATOGRAPHY: dutch over-shoulder. Sosuno dusty-rose shoulder sharp in foreground; Jumong a red #e8563f smear midground on packed earth, timber hall grey giwa melting to bokeh. HIGH CONTRAST crushed blacks, one hard dusk key, long shadows. FACE from attached portraits. Black pupils, dark irises, Korean eyes NOT blue/green/gold. ONE device: her sleeve as a dusty-rose #e8a04a bar. Dramatic bodies, not fashion plates. Real Jolbon yard: packed earth, timber, giwa. No army. No text. No watermark.',
		{ tone: '#e8563f', refs: bothRefs, people: ['jumong', 'sosuno'] }
	)
);
upsertImage(
	sfw(
		'sosuno-seq-kiss-shock',
		'How dare you.',
		'ECU: Sosuno shocked at the well-beam, blush detonating, black pupils',
		'Minimal iconic 16:9 ECU. CINEMATOGRAPHY: ECU dutch. Sosuno face fill — taken aback, mouth open, blush detonating ears and throat, BLACK pupils, dark irises, Korean eyes NOT blue/green/gold. Dusty-rose hanbok from attached, bird binyeo. ONE device: well-rope as a dark vertical behind. HIGH CONTRAST. Packed earth well rim bokeh. FACE from ch_sosuno + bn_sosuno. Not a smile. Shock. No text. No watermark.',
		{ refs: sosunoRefs, people: ['sosuno'] }
	)
);
upsertImage(
	sfw(
		'sosuno-seq-kiss-lash',
		'Don’t grin. If you grin I—',
		'Dutch: Sosuno shoving Jumong’s chest at the well, blush-rage, water slosh',
		'Minimal iconic 16:9. CINEMATOGRAPHY: dutch worm’s-eye. Sosuno mid-shove, palms hitting Jumong’s chest, blush-rage, dusty-rose silk, water sloshing from a bucket in the foreground as a round stamp. Jumong red #e8563f, easy-not-yet grin frozen. FACE AND GARMENTS from attached. Black pupils, dark irises, Korean eyes NOT blue/green/gold. ONE device: her arms as a dusty-rose wedge. Same Jolbon well: stone rim, timber beam, packed earth, grey giwa. HIGH CONTRAST chiaroscuro, not even daylight. No text. No watermark.',
		{ refs: bothRefs, people: ['sosuno', 'jumong'] }
	)
);
upsertImage(
	sfw(
		'jumong-seq-daughters-pose',
		'They hitch at his well.',
		'Dutch well: two anonymous daughters posing sexy (hike, lean); tiny Jumong red grin',
		'Minimal iconic 16:9. CINEMATOGRAPHY: dutch. Jolbon well: stone rim, timber beam, packed earth, grey giwa. Two anonymous Korean young women NOT Sosuno clones, NOT celebrity faces — teal silk and saffron silk, one hiking chima a finger at the hip, one leaning on the beam invitation-face, tasteful SFW. Tiny Jumong lower-third in red #e8563f, easy grin, FACE from attached ch_jumong. ONE device: the well-beam as a hard horizontal. HIGH CONTRAST dusk, crushed blacks. Black pupils, dark irises, Korean eyes NOT blue/green/gold. No Sosuno in frame. No army. No text. No watermark.',
		{ tone: '#e8563f', refs: ['/ch_jumong.png'], people: ['jumong'] }
	)
);
upsertImage(
	sfw(
		'sosuno-seq-kick-out',
		'Get off my well.',
		'Iconic wedge: Sosuno kicking other daughters off the well-yard',
		'Minimal iconic 16:9. CINEMATOGRAPHY: dutch worm’s-eye. ONE device: Sosuno as a dusty-rose #e8a04a wedge splitting the frame, mid-stride kicking/pointing other daughters off the packed-earth well-yard. FACE from attached ch_sosuno + bn_sosuno. Stern girl-boss, not fashion plate. Two anonymous fleeing silks teal/saffron, tiny, not clones of her. Jumong a red #e8563f sliver. Same well architecture. HIGH CONTRAST, long shadows, crushed blacks. Black pupils, dark irises, Korean eyes NOT blue/green/gold. No even daylight. No text. No watermark.',
		{ refs: bothRefs, people: ['sosuno', 'jumong'] }
	)
);
upsertImage(
	sfw(
		'jumong-seq-tiny-red',
		'The yard goes quiet',
		'Bird’s-eye empty Jolbon yard: tiny Jumong red lower-third, Sosuno a dusty-rose plane',
		'Minimal iconic 16:9. CINEMATOGRAPHY: bird’s-eye. Empty Jolbon packed-earth yard, grey giwa timber hall, well as a small stone circle. Tiny Jumong in the lower third, red #e8563f silk. Sosuno a dusty-rose #e8a04a color-plane at the porch edge, not a standing portrait. Monumental emptiness. HIGH CONTRAST dusk haze, crushed blacks, one hard key. Black pupils if faces readable, Korean eyes NOT blue/green/gold. FACE suggestion from attached. No army. No even daylight postcard. No text. No watermark.',
		{ tone: '#e8563f', refs: bothRefs, people: ['jumong', 'sosuno'] }
	)
);

// Reword bare NSFW slots (will generate or delete later)
upsertImage(
	nsfw(
		'nsfw-sosuno-queen-slut',
		'Queen out there. Here I’m— ah— your dirty little—',
		'Queen Sosuno reverse-cowgirl, ass as picture, vermilion cord in fist',
		'score_9, score_8_up, explicit, 1girl riding 1boy reverse cowgirl, Korean woman Sosuno face, black pupils dark irises, dusty-rose silk fallen, ass to camera, grinding, heavy blush, grain timber lamp, manhwa, no text',
		{ ratio: 0.75, refs: queenRefs, people: ['sosuno'] }
	)
);
upsertImage(
	nsfw(
		'nsfw-sosuno-only-mine',
		'Only I get to fuck the king—',
		'ECU Sosuno filthy jealous claim face',
		'score_9, score_8_up, ECU Korean woman face, black pupils dark irises, open mouth drool heavy blush, dusty-rose, grain shadow, manhwa, no text',
		{ ratio: 1.778, refs: sosunoRefs, people: ['sosuno'] }
	)
);
upsertImage(
	nsfw(
		'nsfw-grain-ots-her-back',
		'her royal ass is the picture.',
		'OTS backshot: Sosuno naked arched back riding, ass as picture',
		'score_9, score_8_up, from behind, 1girl naked, Korean woman, black pupils if face turns, arched back ass, riding, grain sacks, dusty-rose at hips, manhwa, no text',
		{ ratio: 1.778, refs: sosunoRefs, people: ['sosuno'] }
	)
);
upsertImage(
	nsfw(
		'nsfw-sosuno-jealous-heat',
		'Get off my well.',
		'Sosuno pinning after jealousy, hiked chima, filthy mouth',
		'score_9, score_8_up, 1girl pinning, Korean woman Sosuno, black pupils, hiked dusty-rose, heavy blush open mouth, grain timber, intimate, manhwa, no text',
		{ ratio: 0.75, refs: sosunoRefs, people: ['sosuno'] }
	)
);

upsertImage(
	nsfw(
		'nsfw-sosuno-loft-spread',
		'Legs wide on the timber.',
		'Loft: Sosuno legs spread wide on timber, hiked chima, wanting face',
		'score_9, score_8_up, 1girl sitting loft timber, legs spread wide, hiked chima, Korean woman Sosuno face, black pupils dark irises, heavy blush, masturbation pose, manhwa, no text',
		{ ratio: 0.75, refs: sosunoRefs, people: ['sosuno'] }
	)
);
upsertImage(
	nsfw(
		'nsfw-sosuno-loft-fingers',
		'Fingers under the chima.',
		'Loft ECU: fingers under hiked chima, legs open, shame-want face',
		'score_9, score_8_up, 1girl, fingers in pussy, hiked skirt, legs open, Korean woman Sosuno, black pupils, heavy blush, timber loft, manhwa, no text',
		{ ratio: 0.75, refs: sosunoRefs, people: ['sosuno'] }
	)
);
upsertImage(
	nsfw(
		'nsfw-royal-queen-ass',
		'her royal ass is the picture.',
		'Queen naked backshot, ass filling frame, look over shoulder',
		'score_9, score_8_up, from behind, 1girl naked ass, Korean queen Sosuno face over shoulder, black pupils, gache hair, grain lamp, manhwa, no text',
		{ ratio: 0.75, refs: queenRefs, people: ['sosuno'] }
	)
);
upsertImage(
	nsfw(
		'nsfw-royal-grind',
		'Grind me like a queen.',
		'Queen grinding naked on Jumong, back arched',
		'score_9, score_8_up, 1girl grinding naked on 1boy, Korean woman, black pupils, ass grind, grain room, manhwa, no text',
		{ ratio: 0.75, refs: queenRefs, people: ['sosuno'] }
	)
);
upsertImage(
	nsfw(
		'nsfw-royal-naked-pose',
		'Grind me like a queen.',
		'Queen naked sexy pose on sacks, shy then filthy',
		'score_9, score_8_up, 1girl fully naked kneeling on sacks, Korean queen Sosuno, black pupils, sexy pose, heavy blush, grain lamp, manhwa, no text',
		{ ratio: 0.75, refs: queenRefs, people: ['sosuno'] }
	)
);

// Reword remaining bare dual-face slots to single-lead (or they get deleted if gen fails)
const rewordBare = {
	'nsfw-sosuno-grind-fit':
		'score_9, 1girl grinding, tight, Korean Sosuno, black pupils, hiked dusty-rose, grain sacks, manhwa, no text',
	'nsfw-sosuno-creampie-drip':
		'score_9, 1girl aftermath, cum on thighs, Korean Sosuno, black pupils, wrecked blush, grain dust, manhwa, no text',
	'nsfw-sosuno-pov-his-back':
		'score_9, male naked muscular back filling frame, Korean, grain lamp, woman peek, manhwa, no text',
	'nsfw-jumong-pov-her-back':
		'score_9, from behind 1girl naked back, Korean Sosuno look over shoulder, black pupils, grain, manhwa, no text',
	'nsfw-grain-ots-his-back':
		'score_9, male naked back OTS, woman cheek on shoulder, Korean, grain loft, manhwa, no text',
	'nsfw-loft-backs-embrace':
		'score_9, 1girl 1boy hug from behind, naked backs, grain loft, Korean, manhwa, no text',
	'nsfw-royal-queen-back-h':
		'score_9, from behind 1girl naked back, Korean queen, look over shoulder, black pupils, 16:9, grain, manhwa, no text'
};
for (const [id, prompt] of Object.entries(rewordBare)) {
	const im = entry.images.find((x) => x.id === id);
	if (im) {
		im.prompt = prompt;
		if (id !== 'nsfw-sosuno-pov-his-back' && id !== 'nsfw-grain-ots-his-back' && id !== 'nsfw-loft-backs-embrace') {
			im.refs = sosunoRefs;
			im.people = ['sosuno'];
		}
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched Jumong blocks + slots');
console.log('images', entry.images.length, 'blocks', entry.blocks.length);
