import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const entry = Object.values(story)
	.flatMap((ch) => ch.entries ?? [])
	.find((e) => e.title === 'Jumong');
if (!entry) throw new Error('Jumong entry missing');

const idxHtml = (sub) => {
	const i = entry.blocks.findIndex((b) => b.kind === 'p' && (b.html || '').includes(sub));
	if (i < 0) throw new Error(`html not found: ${sub}`);
	return i;
};
const idxLabel = (label) => {
	const i = entry.blocks.findIndex((b) => b.kind === 'scene' && b.label === label);
	if (i < 0) throw new Error(`scene not found: ${label}`);
	return i;
};
const idxPersonLine = (person, sub) => {
	const i = entry.blocks.findIndex(
		(b) => b.kind === 'dialogue' && b.person === person && (b.en || []).some((l) => l.includes(sub))
	);
	if (i < 0) throw new Error(`dialogue not found: ${person} ${sub}`);
	return i;
};

const already = (sub) => entry.blocks.some((b) => b.kind === 'p' && (b.html || '').includes(sub));

function upsertSlot(im) {
	const i = entry.images.findIndex((x) => x.id === im.id);
	if (i >= 0) {
		const keep = entry.images[i];
		entry.images[i] = { ...keep, ...im, tempImage: keep.tempImage, src: keep.src };
	} else {
		entry.images.push(im);
	}
}

const house =
	'EVERY FRAME A PAINTING: one geometry or one body owns the frame; light is the plot. 2D animated cel-painterly cinema, not photoreal, not live-action. Anamorphic movie frame, shallow DOF, creamy bokeh, rack-focus, film grain. NO halo, bloom, glow, rim-aura around people — light is a plane or a hard key. FACE AND GARMENTS from attached portraits — NEVER copy portrait stance. Invent a new DRAMATIC body. Black pupils, dark Korean irises — NOT blue, green, gold, or glowing eyes. HIGH CONTRAST chiaroscuro. ICONIC MINIMAL: one architectural device. Hex is lighting/plane/accent — NEVER recolor portrait garments. No army catalog. No readable text. No watermark.';

// —— Rewrite Amnok: he falls for all three; only Yuhwa stays ——
{
	const i = idxHtml('naked in the Ubal');
	entry.blocks[i].html =
		'In the Ubal shallows <b>Lady Yuhwa</b> and her sisters <b>Hwahye</b> and <b>Wihye</b> are bathing <b>naked in the Ubal</b> — clothes on the rocks, silk slipped, wet hair, the river at their hips. He falls for all three in the same glance: eldest, middle, youngest. <b>Hwahye</b> and <b>Wihye</b> run for the current. <b>Yuhwa is the only one who does not dive away.</b>';
	entry.blocks[i].ko =
		'우발 여울에 <b>유화부인</b>과 언니 <b>화혜</b>, <b>위혜</b>가 벗고 목욕한다. 옷은 바위에, 비단은 흘러, 젖은 머리, 강물이 허리까지. 그는 세 사람을 한 눈에 다 좋아한다. <b>화혜</b>와 <b>위혜</b>는 여울 쪽으로 달아난다. <b>달아나지 않는 것은 유화뿐이다.</b>';
}

{
	const i = idxPersonLine('haemosu', 'Stop the chariot');
	entry.blocks[i].lines = ['…멈춰라. 수레를 멈춰.', '세 사람이구나.', '다— 왜 둘은 가느냐.'];
	entry.blocks[i].en = ['…Stop. Stop the chariot.', 'There are three of you.', 'Why are two of you leaving.'];
}

{
	const i = idxPersonLine('hwahye', 'Do not look up');
	entry.blocks[i].lines = ['올려다보지 마.', '우리는 간다.', '하늘은 일정이 있어.'];
	entry.blocks[i].en = ['Do not look up.', 'We are leaving.', 'Heaven has a schedule.'];
}

{
	const i = idxPersonLine('wihye', 'already late');
	entry.blocks[i].lines = ['올려다보면 늦는 거야.', '보고 있으면 이미 늦었어.', '막내만 남겠지. 늘 남잖아.'];
	entry.blocks[i].en = [
		'If you look up, you are already late.',
		'If he is watching, he is already too late.',
		'The youngest will stay. She always stays.'
	];
}

{
	const i = idxHtml('The older sisters dive');
	entry.blocks[i].html =
		'The older sisters dive — Hwahye first, then Wihye after her laugh. <b>Yuhwa is the only one who does not run.</b> She stays standing in the shallows and looks straight up, as if she had been waiting for heaven to notice, and draws her wet hair over one shoulder so that nothing is left to guess.';
	entry.blocks[i].ko =
		'언니들이 잠수한다 — 화혜가 먼저, 위혜는 웃고 따라간다. <b>달아나지 않는 것은 유화뿐이다.</b> 여울에 그대로 서서 위를 똑바로 올려다본다 — 하늘이 알아채기를 기다리고 있던 사람처럼 — 젖은 머리를 한쪽 어깨로 넘겨, 짐작할 것을 남기지 않는다.';
}

// —— Habek court / exile (before Geumwa takes her in) ——
if (!already('The Amnok keeps its own court')) {
	const i = idxHtml('Habek</b> casts her out');
	const habekBlocks = [
		{
			kind: 'scene',
			label: 'Habek’s Court',
			ko: '하백의 조정'
		},
		{
			kind: 'p',
			html: 'The copper room is still warm when the river notices. Mist comes in like a door. <b>The Amnok keeps its own court.</b> <b>Habek</b> stands on the wet stones as if the current were a dais — not a father asking, a border asking.',
			ko: '구리 방이 아직 따뜻할 때 강이 알아챈다. 안개가 문처럼 들어온다. <b>압록은 제 조정이 있다.</b> <b>하백</b>이 젖은 돌 위에 선다. 여울이 대청인 것처럼 — 묻는 아버지가 아니라, 국경이 묻는 것이다.'
		},
		{
			kind: 'dialogue',
			chip: '#2f8f7a',
			person: 'habek',
			lines: ['너는 서서 올려다봤다.', '여울에서 그게 어떻게 보이겠느냐.', '누가 수레를 세웠느냐.'],
			en: ['You stayed standing. You looked up.', 'Do you know what that looks like from the current.', 'Who stopped the chariot.']
		},
		{
			kind: 'dialogue',
			chip: '#8fc4e0',
			person: 'yuhwa',
			lines: ['언니들은 잠수했어요.', '저는— 올려다봤어요.', '그게 다예요. 아버지.'],
			en: ['My sisters dove.', 'I— looked up.', 'That’s all, Father.']
		},
		{
			kind: 'dialogue',
			chip: '#2f8f7a',
			person: 'habek',
			lines: ['태양이 강의 딸에게 그게 다가 아니다.', '구리 냄새다. 이 안개에 그 냄새를 들이지 마라.', '내 안개에서 자지 못한다. 가거라.'],
			en: [
				'The sun does not “that’s all” a river’s daughter.',
				'I can smell the copper. Do not bring that into my mist.',
				'You don’t sleep in my mist after that. Go.'
			]
		},
		{
			kind: 'p',
			html: '<b>Habek kicks Yuhwa out.</b> No negotiation. The bank empties the way a hall empties when the host has decided the guest was never a guest. Ice-blue silk on packed wet sand. The five-dragon chariot is already gone from the hour.',
			ko: '<b>하백이 유화를 내쫓는다.</b> 협상은 없다. 주인이 손님을 손님이 아니었다고 정한 대청처럼 강가가 빈다. 젖은 모래 위 얼음빛 비단. 다섯 용의 수레는 이미 시각에서 빠져 있다.'
		}
	];
	entry.blocks.splice(i, 0, ...habekBlocks);
	const j = idxHtml('Habek</b> casts her out');
	entry.blocks[j].html =
		'King <b>Geumwa</b> of Buyeo takes her in — gold-frog king, a timber yard by a river-capital, weather still attached to the sky. <b>The Buyeo yard is a timber country.</b> <b>From the roof the yard is a packed-earth square.</b> The court wants a category. He sets a room instead.';
	entry.blocks[j].ko =
		'부여의 <b>금와왕</b>이 그를 거둔다 — 금빛 개구리 임금, 강수도의 나무 마당, 하늘에는 아직 날씨가 붙어 있다. <b>지붕에서 보면 마당은 다진 흙 네모다.</b> 조정은 분류를 원한다. 그는 방부터 내준다.';
}

// —— Light shaft on Yuhwa before the egg ——
if (!already('A sun-shaft finds her')) {
	const i = idxLabel('The Egg');
	entry.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'Before the egg, Geumwa’s timber room is only packed earth and a window-bar. <b>A sun-shaft finds her</b> — not a halo around the body, a hard gold plane cutting the dark, ice-blue silk in the cut. She sits as if the hour had followed her from the Amnok. Then the room has a guest that will not give a name.',
		ko: '알보다 먼저, 금와의 나무 방은 다진 흙과 창살뿐이다. <b>햇기둥이 그녀를 찾는다</b> — 몸 둘레의 후광이 아니라, 어둠을 가르는 단단한 금빛 면, 그 자른 자리의 얼음빛 비단. 압록의 시각이 따라온 사람처럼 앉아 있다. 그리고 방에는 이름 안 대는 손님이 생긴다.'
	});
}

{
	const i = idxHtml('Out of the egg comes a boy');
	entry.blocks[i].html =
		'Then the shell goes. Not a painted face in a crack: a wet newborn, fists, shell-pieces on timber. <b>Out of the egg comes a baby boy.</b> <b>He looks up from the shell.</b> Yuhwa’s ice-blue sleeve is the first roof. They name him <b>Jumong</b> — the good shot — because in those days people were named for what heaven had plainly already decided.';
	entry.blocks[i].ko =
		'그리고 껍질이 간다. 금 간 데 붙여 넣은 얼굴이 아니다. 젖은 갓난아이, 주먹, 나무 위 껍질 조각. <b>알에서 사내아이가 나온다.</b> <b>껍질에서 위를 본다.</b> 유화의 얼음빛 소매가 첫 지붕이다. 사람들은 아이를 <b>주몽</b> — 활 잘 쏘는 이 — 이라 이름 짓는다. 그 시절에는 하늘이 이미 정해 둔 것을 따라 이름을 지었기 때문이다.';
}

// —— Childhood extra (same yard) ——
if (!already('They are boys first')) {
	const i = idxHtml('grows up with his brothers');
	entry.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: '<b>They are boys first</b> in the same Buyeo yard — three small figures at one mark-stake, grey-giwa hall as a dark bar, packed earth. Jumong grins when the arrow lands. Daeso does not. Galsa’s laugh is a breath late even then.',
		ko: '<b>처음엔 아이다</b>. 같은 부여 마당, 과녁 말뚝 하나, 회색 기와 대청이 어두운 가로띠, 다진 흙. 화살이 꽂히면 주몽은 웃는다. 대소는 아니다. 갈사의 웃음은 그때도 한 박자 늦다.'
	});
	entry.blocks.splice(i + 2, 0, {
		kind: 'p',
		html: 'Then they are youths in the same square. Same hall. Same stake moved farther. <b>The smiles keep shrinking.</b> Jealousy is not a speech. It is Daeso standing too close, and Galsa looking at the packed earth instead of the hit.',
		ko: '그러고 같은 네모에서 청년이 된다. 같은 대청. 같은 말뚝을 더 멀리. <b>웃음은 자꾸 줄어든다.</b> 질투는 연설이 아니다. 대소가 너무 가까이 서는 것, 갈사가 맞힌 곳 대신 흙을 보는 것이다.'
	});
}

// —— Friends split before the river (do not put them on the shells) ——
if (!already('We take the ridge')) {
	const i = idxHtml('The pines are a net from above');
	entry.blocks.splice(i + 1, 0, {
		kind: 'scene',
		label: 'The Split',
		ko: '갈림'
	});
	entry.blocks.splice(i + 2, 0, {
		kind: 'p',
		html: 'The net has two mouths: water, and a ridge that does not glitter. Jumong still has the river in his head. Oi is already counting the other path. <b>They split in the pines before the crossing.</b>',
		ko: '그물에 입이 둘이다. 물, 그리고 빛나지 않는 능선. 주몽의 머리엔 아직 강이 있다. 오이는 이미 다른 길을 센다. <b>건너기 전에 소나무에서 갈라선다.</b>'
	});
	entry.blocks.splice(i + 3, 0, {
		kind: 'dialogue',
		chip: '#7a6b5a',
		person: 'oi',
		lines: ['물은 덫이야.', '우리는 능선으로 간다.', '껍질 위에서 기다리지 마.'],
		en: ['The water’s a trap.', 'We take the ridge.', 'Don’t wait on any shells.']
	});
	entry.blocks.splice(i + 4, 0, {
		kind: 'dialogue',
		chip: '#5c6b6e',
		person: 'mari',
		lines: ['갈라서면 둘 다 못 닫지.', '네가 강이면 우리는 동쪽.', '문 조용한 게 더 나빠. 기억하지?'],
		en: ['If we split they can’t close both.', 'If you take the river, we go east.', 'Quiet gates were worse. Remember?']
	});
	entry.blocks.splice(i + 5, 0, {
		kind: 'dialogue',
		chip: '#4a5548',
		person: 'hyupbo',
		lines: ['여분 시위는 네 거야.', '우리는 다른 길로 간다.', '졸본에서 보자.'],
		en: ['Spare string’s yours.', 'We go the other way.', 'See you in Jolbon.']
	});
	entry.blocks.splice(i + 6, 0, {
		kind: 'dialogue',
		chip: '#e8563f',
		person: 'jumong',
		lines: ['알겠어.', '껍질은— 나 혼자.', '저쪽에서 봐. 기다리지 말고.'],
		en: ['Yeah.', 'The shells— that’s me.', 'I’ll see you on the other side. Don’t wait.']
	});
}

{
	const i = idxHtml('They reach water at night');
	entry.blocks[i].html =
		'<b>Jumong reaches the water alone.</b> Night. A river with no ford, no boat, and a death already written for that day. His friends are already on the ridge. Something flies at him from the far bank. Then a flash, as if dawn had forgotten the hour. <b>Two 해 cut the rain-canopy.</b>';
	entry.blocks[i].ko =
		'<b>주몽만 물에 닿는다.</b> 밤. 여울도 배도 없고, 오늘 죽기로 적힌 목숨. 벗들은 이미 능선에 있다. 저편에서 무언가가 날아온다. 그러고 섬광. 새벽이 시각을 잊은 듯. <b>두 해가 빗속 수관을 가른다.</b>';
}

// Friends arrive Jolbon another way (after shed, before the week of labor)
if (!already('They did not cross on the shells')) {
	const i = idxHtml('For a week Tabal uses him');
	entry.blocks.splice(i, 0, {
		kind: 'scene',
		label: 'The Other Path',
		ko: '다른 길'
	});
	entry.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'Three men come in from the east path at dusk — mud to the knee, not river-wet. <b>Oi, Mari, and Hyupbo reach Jolbon by another road.</b> <b>They did not cross on the shells.</b> Tabal’s yard already has the exile. The friends look at him like a man who took the stupid fork and lived.',
		ko: '해 질 녘, 동쪽 길로 세 사람이 들어온다 — 무릎까지 진흙, 강물기는 아니다. <b>오이, 마리, 협보가 다른 길로 졸본에 닿는다.</b> <b>껍질 위로는 건너지 않았다.</b> 타발의 마당엔 이미 망명이 있다. 벗들은 바보 갈림길을 택하고도 산 사람을 보듯 그를 본다.'
	});
	entry.blocks.splice(i + 2, 0, {
		kind: 'dialogue',
		chip: '#7a6b5a',
		person: 'oi',
		lines: ['살았네.', '강은 어떻게 했어.', '아니— 나중에. 밥 있냐.'],
		en: ['You’re alive.', 'What did you do with the river.', 'No— later. Is there food.']
	});
	entry.blocks.splice(i + 3, 0, {
		kind: 'dialogue',
		chip: '#e8563f',
		person: 'jumong',
		lines: ['말하면 안 믿을걸.', '너희는?', '능선이야?'],
		en: ['If I say it you won’t believe me.', 'You?', 'Ridge?']
	});
	entry.blocks.splice(i + 4, 0, {
		kind: 'dialogue',
		chip: '#5c6b6e',
		person: 'mari',
		lines: ['동쪽. 그물은 물을 닫더라고.', '우리는 닫히지 않는 쪽으로 갔어.', '네 활은 솔잎에 있더라 — 척후가 자랑하던데.'],
		en: ['East. The net closed on the water.', 'We took the side that wouldn’t shut.', 'Your bow was in the needles — the scouts were bragging.']
	});
	entry.blocks.splice(i + 5, 0, {
		kind: 'dialogue',
		chip: '#4a5548',
		person: 'hyupbo',
		lines: ['시위는 돌려줄게.', '지금은— 서 있기만 해도 된다.'],
		en: ['I’ll give you the string back.', 'For now— standing is enough.']
	});
}

// —— Song Yang contest (end of entry, after cavern king) ——
if (!already('Song Yang will not share the roof')) {
	const i = idxHtml('This morning is only a roof');
	const song = [
		{ kind: 'scene', label: 'Song Yang', ko: '송양' },
		{
			kind: 'p',
			html: 'Biryu still has a roof the five fires did not count. <b>Song Yang</b> comes to Tabal’s packed-earth yard as if seniority were a weapon. Same giwa bar. Same mark-stake language. <b>Song Yang will not share the roof</b> until a shaft says otherwise.',
			ko: '다섯 불이 세지 않은 지붕이 아직 비류에 있다. <b>송양</b>이 타발의 흙마당으로 온다. 선후배이 무기인 사람처럼. 같은 기와 가로띠. 같은 과녁의 말. <b>송양은 지붕을 나누려 하지 않는다</b> — 화살이 달리 말할 때까지.'
		},
		{
			kind: 'dialogue',
			chip: '#c4a35a',
			person: 'songyang',
			lines: ['이 골짜기는 네가 알에서 나오기 전에 이름이 있었다.', '활로 손님 노릇 하지 마라.', '과녁을 어디에 둘지 내가 정한다.'],
			en: ['This valley had a name before you hatched.', 'Don’t play guest with a bow.', 'I set where the mark stands.']
		},
		{
			kind: 'dialogue',
			chip: '#e8563f',
			person: 'jumong',
			lines: ['그럼 이름을 과녁에 두시오.', '형이 앞에 서서 그래요.', '맞으면— 지붕을 나누면 됩니다.'],
			en: ['Then put the name on the mark.', 'You’re standing too close, that’s why.', 'If it hits— we share the roof.']
		},
		{
			kind: 'dialogue',
			chip: '#c4a35a',
			person: 'songyang',
			lines: ['한 발이다.', '네가 먼저냐. 내가 먼저냐.', '웃지 마라. 웃으면 손님이다.'],
			en: ['One shot.', 'You first, or me.', 'Don’t grin. Grin and you’re still a guest.']
		},
		{
			kind: 'p',
			html: 'The yard hears the wood take it. Song Yang’s arrow is honest and short. Jumong’s is the same fly-wing cruelty the Buyeo stake learned. <b>The contest is one bow, one yard, not an army.</b> Biryu’s chieftain looks at the hit the way Daeso used to look at a foundling.',
			ko: '마당이 나무가 받는 소리를 듣는다. 송양의 화살은 정직하고 짧다. 주몽의 것은 부여 말뚝이 배운 파리 날개 잔인함이다. <b>겨루는 것은 활 하나, 마당 하나이지 군대가 아니다.</b> 비류의 우두머리가 맞은 자리를 본다. 대소가 주워 온 아이를 보던 그 눈으로.'
		},
		{
			kind: 'dialogue',
			chip: '#c4a35a',
			person: 'songyang',
			lines: ['…졌다.', '비류는 이 지붕 아래다.', '이름은 남겨 둬라. 진 사람은 이름이 필요하니까.'],
			en: ['…I lost.', 'Biryu is under this roof.', 'Keep my name. The one who loses still needs one.']
		},
		{
			kind: 'dialogue',
			chip: '#e8563f',
			person: 'jumong',
			lines: ['남깁니다.', '밥은— 마당에 있습니다.', '웃은 거 아닙니다. 진짜로.'],
			en: ['I’ll keep it.', 'Food’s— in the yard.', 'I wasn’t grinning. Seriously.']
		}
	];
	entry.blocks.splice(i + 1, 0, ...song);
}

// —— End: succession hint ——
if (!already('the bow waits on packed earth')) {
	const i = idxHtml('The tellers always pause here');
	entry.blocks.splice(i, 0, {
		kind: 'p',
		html: 'His last winters are the same Jolbon timber. Grey giwa. Empty mark-stake. <b>The bow waits on packed earth</b> as if a boy from Buyeo were already walking with a broken sword. The chronicles will give that boy a year. This still is only a king who has put the weight down for an hour, and a queen who still counts fires like they are lovers.',
		ko: '마지막 겨울도 같은 졸본의 나무다. 회색 기와. 빈 과녁 말뚝. <b>활이 다진 흙 위에 기다려 있다</b> — 부여에서 부러진 칼을 들고 걸어올 아이가 이미 오는 것처럼. 사가는 그 아이에게 해를 줄 것이다. 이 장면은 한 시간만 무게를 내려놓은 왕과, 아직도 불을 연인처럼 세는 왕비뿐이다.'
	});
}

// —— Image slots ——
const slots = [
	{
		id: 'yuhwa-sunshaft-timber',
		ratio: 0.75,
		nsfw: false,
		tone: '#8fc4e0',
		at: 'A sun-shaft finds her',
		alt: 'Dutch Buyeo timber room: hard gold sun-plane cutting dark; Yuhwa in ice-blue court silk in the cut, not a body-halo',
		refs: ['/pl_buyeo_yard.png', '/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_geumwa.png'],
		people: ['yuhwa', 'geumwa'],
		prompt:
			'Minimal iconic 3:4 still. Dutch timber interior opening onto Northern Buyeo yard (attached place). ONE device: a hard gold sun-SHAFT as a geometric PLANE through the window-bar, slicing crushed-black room — NOT a halo, bloom, or glow around her body. Yuhwa seated/kneeling in pale ice-blue court silk (NOT bathing wrap), FACE and garments from attached portrait, hair ornament from attached binyeo. Pregnant stillness before the egg. Geumwa a tiny burgundy doorway stamp. Ice-blue #8fc4e0 rim on silk; gold plane is Haemosu’s leftover hour #f0b429. Black pupils, dark Korean irises. ' +
			house
	},
	{
		id: 'jumong-buyeo-hatch',
		ratio: 0.75,
		nsfw: false,
		tone: '#e8563f',
		at: 'out of the egg comes a baby boy',
		alt: 'Painterly ECU: wet newborn boy in broken pale shell on timber; Yuhwa ice-blue sleeve; one red #e8563f seam — not a teen face in an egg',
		refs: ['/ch_jumong.png', '/ch_yuhwa.png', '/bn_yuhwa.png'],
		people: ['jumong', 'yuhwa'],
		prompt:
			'Intimate 3:4 painterly cinema still, NOT photoreal product shot. ECU timber floor, broken pale eggshell pieces. A REAL HUMAN INFANT / newborn baby boy, wet, vernix-sheen, tiny fists, umbilical suggestion, crying or gasping — NOT a miniature adult, NOT a teen, NOT a goatee, NOT a red headband, NOT Jumong’s adult portrait pasted in a crack. FACE only a family resemblance to the attached Jumong portrait (baby round cheeks, black pupils, dark Korean irises). Yuhwa’s ice-blue court silk sleeve and hand in frame, FACE from attached Yuhwa if visible, binyeo if hair visible. ONE device: a single red #e8563f light-seam in the shell split (magical aura as SHAFT/seam, not a glow halo). Magical aura allowed as that seam only. 2D cel-painterly. ' +
			house
	},
	{
		id: 'jumong-buyeo-hatch-worm',
		ratio: 0.75,
		nsfw: false,
		tone: '#e8563f',
		at: 'He looks up from the shell',
		alt: 'Worm’s-eye from shell pieces: wet newborn looking up; Yuhwa ice-blue silk above; red #e8563f seam',
		refs: ['/ch_jumong.png', '/ch_yuhwa.png'],
		people: ['jumong', 'yuhwa'],
		prompt:
			'Minimal iconic 3:4. Worm’s-eye from inside broken eggshell on timber. A wet NEWBORN infant looking up — baby, not miniature adult Jumong, no goatee, no headband. Yuhwa’s ice-blue silk as a plane above. ONE device: red #e8563f seam of light in the shell. Black pupils. Painterly, not photoreal egg catalog. ' +
			house
	},
	{
		id: 'jumong-buyeo-hatch-hold',
		ratio: 0.75,
		nsfw: false,
		tone: '#8fc4e0',
		at: 'Yuhwa’s ice-blue sleeve is the first roof',
		alt: 'OTS: Yuhwa in ice-blue court silk holding a wet newborn; shell pieces on Buyeo timber; red seam accent',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_jumong.png', '/pl_buyeo_yard.png'],
		people: ['yuhwa', 'jumong'],
		prompt:
			'Intimate 3:4 OTS. Yuhwa kneeling on packed timber, FACE from attached, ice-blue court silk, binyeo from attached. She holds a wet NEWBORN baby (family resemblance to attached Jumong only, infant, no adult clone). Shell pieces in foreground bokeh. ONE device: ice-blue silk as a roof-plane. Red #e8563f seam on a shard. Buyeo timber. Black pupils. ' +
			house
	},
	{
		id: 'jumong-buyeo-boys-young',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'They are boys first',
		alt: 'Bird’s-eye dusk: same Buyeo packed-earth square, three small boys at one mark-stake, giwa hall as a dark bar',
		refs: ['/pl_buyeo_yard.png', '/ch_jumong.png', '/ch_daeso.png', '/ch_galsa.png'],
		people: ['jumong', 'daeso', 'galsa'],
		prompt:
			'Minimal iconic 16:9. Bird’s-eye dusk. LOCK to attached Buyeo yard: packed earth, grey-giwa hall as a dark horizontal bar, palisade, iron-boss doors. THREE small BOYS (children ~8) at one mark-stake — one of each: Jumong red silk no adult goatee, Daeso bronze-olive #9b8f6a too close, Galsa sage #6b8f4a delayed. FACE suggestion from attached portraits as children. ONE device: the hall bar. Jumong #e8563f as the only hard accent. Natural dusk sky. High contrast. No army. ' +
			house
	},
	{
		id: 'jumong-buyeo-youths',
		ratio: 1.778,
		nsfw: false,
		tone: '#9b8f6a',
		at: 'The smiles keep shrinking',
		alt: 'Dutch dusk same Buyeo yard: three youths, Jumong mid-draw grinning, Daeso too close, Galsa looking at dirt',
		refs: ['/pl_buyeo_yard.png', '/ch_jumong.png', '/ch_daeso.png', '/ch_galsa.png'],
		people: ['jumong', 'daeso', 'galsa'],
		prompt:
			'Minimal iconic 16:9. Dutch low dusk. SAME attached Buyeo yard. Three YOUTHS (not children): Jumong mid-stride full-draw grinning, red #e8563f rim, FACE from attached (fun, not grim founder). Daeso too close, bronze-olive #9b8f6a, no clap. Galsa sage #6b8f4a looking at packed earth. ONE device: mark-stake as a vertical. Geumwa burgundy garments stay burgundy. Natural sky. ' +
			house
	},
	{
		id: 'haemosu-falls-three',
		ratio: 1.778,
		nsfw: false,
		tone: '#f0b429',
		at: 'There are three of you',
		alt: 'Bird’s-eye from the five-dragon gold chariot: three river-daughters in the Amnok; Hwahye and Wihye turning to dive, Yuhwa looking up',
		refs: ['/ch_haemosu.png', '/ch_yuhwa.png', '/ch_hwahye.png', '/ch_wihye.png', '/bn_yuhwa.png'],
		people: ['haemosu', 'yuhwa', 'hwahye', 'wihye'],
		prompt:
			'Minimal iconic 16:9. Bird’s-eye from the SAME five-dragon gold sun-chariot (two spoked wheels, gold rail, five living dragons gold crimson azure jade white — do not invent a new chariot). Amnok shallows real river, natural sky, wet rocks. THREE river-daughters: Hwahye FACE from attached turning to dive, Wihye FACE from attached mid-dive laugh, Yuhwa FACE from attached looking STRAIGHT UP, ice-blue wet silk. Haemosu a gold #f0b429 lower-rail stamp. ONE device: chariot wheel-rim as an arc. Sisters consistent faces. Black pupils. Painterly myth cinema. ' +
			house
	},
	{
		id: 'yuhwa-only-stays',
		ratio: 0.75,
		nsfw: false,
		tone: '#8fc4e0',
		at: 'Yuhwa is the only one who does not run',
		alt: 'Worm’s-eye Amnok: Yuhwa standing looking up; two sister-wakes in the water; gold chariot a tiny house in the sky',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_hwahye.png', '/ch_wihye.png', '/ch_haemosu.png'],
		people: ['yuhwa', 'hwahye', 'wihye', 'haemosu'],
		prompt:
			'Minimal iconic 3:4. Worm’s-eye from Amnok water. Yuhwa standing waist-deep, looking straight up, FACE from attached, ice-blue wet silk, binyeo. Hwahye and Wihye only as wakes/diving backs with FACES matching attached if visible — they are leaving. ONE device: gold chariot as a tiny house in the sky (same five-dragon wheeled chariot). Ice-blue #8fc4e0 as the water-plane. Black pupils. ' +
			house
	},
	{
		id: 'habek-court-wide',
		ratio: 1.778,
		nsfw: false,
		tone: '#2f8f7a',
		at: 'The Amnok keeps its own court',
		alt: 'Bird’s-eye iconic: real Amnok bank, mist as a dais, tiny Habek and Yuhwa, copper room a small warm stamp',
		refs: ['/ch_habek.png', '/ch_yuhwa.png', '/ch_yuhwa.png'],
		people: ['habek', 'yuhwa'],
		prompt:
			'Minimal iconic 16:9. Bird’s-eye exposition. REAL Amnok riverbank: wet stones, mist, timber copper hut a small warm stamp, natural sky. ONE device: mist as a hard horizontal court-plane. Tiny figures lower-third: Habek FACE from attached, river-god silk teal #2f8f7a rim; Yuhwa ice-blue. Monumental emptiness. High contrast. Not a graphic void. ' +
			house
	},
	{
		id: 'habek-exile-dutch',
		ratio: 0.75,
		nsfw: false,
		tone: '#2f8f7a',
		at: 'Habek kicks Yuhwa out',
		alt: 'Dutch Amnok bank: Habek pointing the current as a border; Yuhwa ice-blue mid-turn leaving',
		refs: ['/ch_habek.png', '/ch_yuhwa.png', '/bn_yuhwa.png'],
		people: ['habek', 'yuhwa'],
		prompt:
			'Minimal iconic 3:4. Dutch angle on real Amnok bank. Habek mid-gesture, FACE from attached, teal #2f8f7a as rim not costume recolor. Yuhwa mid-turn leaving, ice-blue silk, FACE from attached, binyeo. ONE device: the river as a hard diagonal border. Natural sky, wet stones. Black pupils. Dramatic, not a standing lineup. ' +
			house
	},
	{
		id: 'habek-exile-ots',
		ratio: 1.778,
		nsfw: false,
		tone: '#8fc4e0',
		at: 'You don’t sleep in my mist after that',
		alt: 'OTS Habek’s shoulder: Yuhwa walking the wet sand, ice-blue, copper hut bokeh',
		refs: ['/ch_habek.png', '/ch_yuhwa.png', '/bn_yuhwa.png'],
		people: ['habek', 'yuhwa'],
		prompt:
			'Minimal iconic 16:9. Over-shoulder: Habek’s teal-rim shoulder sharp in foreground, Yuhwa walking away along wet Amnok sand, ice-blue silk catching one hard key, FACE from attached. Copper room a creamy bokeh stamp. ONE device: empty wet-sand path as a wedge. ' +
			house
	},
	{
		id: 'jumong-friends-split-wide',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'They split in the pines before the crossing',
		alt: 'Aerial dusk pines: tiny red Jumong toward water; three earth-tone friends turning the ridge',
		refs: ['/ch_jumong.png'],
		people: ['jumong', 'oi', 'mari', 'hyupbo'],
		prompt:
			'Minimal iconic 16:9. Aerial crane dusk. Korean pine forest as a net, packed-earth path fork. Tiny Jumong in red #e8563f going toward a dark river-ribbon. THREE anonymous friends in earth-tone silks (umber, slate, pine-dark — NOT clones of Jumong, NOT his face) turning the ridge. ONE device: the path-fork as a Y. Natural sky. High contrast. No army catalog. FACE of Jumong from attached only on the red figure. ' +
			house
	},
	{
		id: 'jumong-friends-split-ots',
		ratio: 0.75,
		nsfw: false,
		tone: '#7a6b5a',
		at: 'We take the ridge',
		alt: 'OTS: Jumong’s red shoulder; three friends already on the ridge path, not looking back',
		refs: ['/ch_jumong.png'],
		people: ['jumong', 'oi', 'mari', 'hyupbo'],
		prompt:
			'Minimal iconic 3:4. Over-shoulder Jumong red silk, FACE from attached glancing. Three anonymous men in umber/slate/pine silk already walking the ridge, backs, not Jumong clones. ONE device: pine trunks as vertical bars. Dusk. ' +
			house
	},
	{
		id: 'jumong-friends-jolbon',
		ratio: 1.778,
		nsfw: false,
		tone: '#a97c4a',
		at: 'Oi, Mari, and Hyupbo reach Jolbon by another road',
		alt: 'Dutch dusk Jolbon packed-earth gate: three muddy friends arriving; Jumong a small red grin in the yard',
		refs: ['/ch_jumong.png'],
		people: ['oi', 'mari', 'hyupbo', 'jumong'],
		prompt:
			'Minimal iconic 16:9. Dutch dusk. REAL Jolbon timber gate, grey giwa, packed earth, iron bosses. Three anonymous travel-stained men mud to the knee arriving (umber, slate, pine silks), not Jumong faces. Jumong a small red #e8563f grin in the yard, FACE from attached. ONE device: the gate as a dark rectangle. Natural dusk sky. High contrast. ' +
			house
	},
	{
		id: 'songyang-yard-wide',
		ratio: 1.778,
		nsfw: false,
		tone: '#c4a35a',
		at: 'Song Yang will not share the roof',
		alt: 'Bird’s-eye Jolbon packed-earth yard: giwa hall bar, two tiny archers, one mark-stake',
		refs: ['/ch_jumong.png', '/ch_songyang.png'],
		people: ['jumong', 'songyang'],
		prompt:
			'Minimal iconic 16:9. Bird’s-eye exposition. SAME Jolbon packed-earth archery yard: grey giwa timber hall as a dark bar, one mark-stake, natural dusk sky. Two tiny figures lower-third. ONE device: the hall bar. High contrast. No army. Pine-ochre #c4a35a as one ground stamp; Jumong red #e8563f as the other. ' +
			house
	},
	{
		id: 'jumong-songyang-draw',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'Then put the name on the mark',
		alt: 'Worm’s-eye: Jumong full-draw grinning; Song Yang a pine-ochre stamp too close to the stake',
		refs: ['/ch_jumong.png', '/ch_songyang.png'],
		people: ['jumong', 'songyang'],
		prompt:
			'Minimal iconic 16:9. Worm’s-eye. Jumong full-draw, FUN grin, FACE from attached, red silk #e8563f rim, NOT a grim statue. Song Yang older chieftain FACE from attached, pine-ochre #c4a35a court silk, standing too close to the mark-stake. SAME Jolbon yard. ONE device: the bow as a hard black arc. High contrast chiaroscuro. ' +
			house
	},
	{
		id: 'songyang-shot-short',
		ratio: 0.75,
		nsfw: false,
		tone: '#c4a35a',
		at: 'Song Yang’s arrow is honest and short',
		alt: 'Dutch ECU: Song Yang after the shot, honest miss, pine-ochre silk, stake in bokeh',
		refs: ['/ch_songyang.png'],
		people: ['songyang'],
		prompt:
			'Minimal iconic 3:4. Dutch ECU. Song Yang FACE from attached, older Korean chieftain, black pupils, after-release, not a catalog pose. Pine-ochre #c4a35a as rim. Mark-stake creamy bokeh. SAME Jolbon packed earth. ONE device: the short arrow as a failed horizontal. ' +
			house
	},
	{
		id: 'jumong-songyang-win',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'Biryu is under this roof',
		alt: 'OTS: Song Yang yielding; Jumong tiny red at the far mark; giwa hall a dark bar',
		refs: ['/ch_songyang.png', '/ch_jumong.png'],
		people: ['songyang', 'jumong'],
		prompt:
			'Minimal iconic 16:9. Over-shoulder Song Yang yielding, FACE from attached. Jumong a small red figure at the far mark-stake, grin, FACE from attached. SAME Jolbon yard, giwa bar. ONE device: empty packed-earth as a plane. #c4a35a and #e8563f as two accents. ' +
			house
	},
	{
		id: 'jumong-founding-dawn-wide',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'the largest kingdom in Samhan',
		alt: 'Bird’s-eye dawn: Jolbon timber courtyard, five cold fire-pits, tiny king in red',
		refs: ['/ch_dongmyung.png'],
		people: ['jumong'],
		prompt:
			'Minimal iconic 16:9. Bird’s-eye dawn. REAL Jolbon timber courtyard: grey giwa, packed earth, five fire-pits, natural dawn sky. Tiny King Dongmyung FACE from attached, red #e8563f lower-third. ONE device: the hall as a dark wedge. High contrast. No army catalog. ' +
			house
	},
	{
		id: 'jumong-cave-dawn-ots',
		ratio: 0.75,
		nsfw: false,
		tone: '#f0b429',
		at: 'A break of light at dawn',
		alt: 'OTS Jumong kneeling: same cavern mouth, hard dawn gold plane, Haemosu photoreal in the seam',
		refs: ['/pl_jumong_cave.png', '/ch_jumong.png', '/ch_haemosu.png'],
		people: ['jumong', 'haemosu'],
		prompt:
			'Minimal iconic 3:4. Over-shoulder kneeling Jumong (painterly mortal, FACE from attached, red silk). SAME attached Jumong cavern. ONE device: a hard dawn gold PLANE through the mouth — not a halo. Divine Haemosu more photoreal/numinous in the seam, FACE from attached, gold #f0b429. Mortal/divine split. Black pupils on Jumong. ' +
			house
	},
	{
		id: 'jumong-king-queen-timber',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8a04a',
		at: 'a queen who still counts fires',
		alt: 'Worm’s-eye Jolbon hall: King Dongmyung and Queen Sosuno, vermilion posts, empty packed earth',
		refs: ['/ch_dongmyung.png', '/ch_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt:
			'Minimal iconic 16:9. Worm’s-eye. REAL Jolbon timber hall, vermilion posts, packed earth, grey giwa beyond. King FACE from attached Dongmyung portrait, red #e8563f rim. Queen Sosuno dusty-rose #e8a04a hanbok FACE from attached, chin up. ONE device: empty hall as a dark wedge. Two people, two color accents, crushed black. Not a fashion lineup. ' +
			house
	},
	{
		id: 'jumong-death-bow',
		ratio: 0.75,
		nsfw: false,
		tone: '#e8563f',
		at: 'the bow waits on packed earth',
		alt: 'Dutch empty Jolbon yard: bow on packed earth as a hard red line; king a small lower-third stamp',
		refs: ['/ch_dongmyung.png'],
		people: ['jumong'],
		prompt:
			'Minimal iconic 3:4. Dutch dusk. SAME Jolbon packed-earth yard. ONE device: the bow as a hard black-red line on packed earth in the foreground. Tiny aging king lower-third, FACE from attached Dongmyung, red #e8563f. Grey giwa hall as a dark bar. Natural sky. Empty, succession-hint, not a death-gore scene. ' +
			house
	},
	{
		id: 'nsfw-haemosu-copper-titian',
		ratio: 0.75,
		nsfw: true,
		tone: '#f0b429',
		at: 'He comes down. He builds a copper room',
		alt: 'History-painting close: Haemosu and Yuhwa in the copper room, skin-forward, wanting faces, gold on wet ice-blue',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png'],
		people: ['haemosu', 'yuhwa'],
		prompt:
			'Intimate close Titian/Delacroix academic myth painting + 2D cel, not porn photo. Copper room on Amnok bank. Yuhwa FACE from attached, ice-blue silk hiked, wanting open mouth, heavy blush, black pupils. Haemosu gold #f0b429 as light-plane on skin, silver-white hair. Sex, skin-forward, thighs, copper wall heat. ONE device: copper wall as a warm plane. Magical aura as shaft not halo.'
	},
	{
		id: 'nsfw-haemosu-copper-ots',
		ratio: 0.75,
		nsfw: true,
		tone: '#8fc4e0',
		at: 'If you press me to it',
		alt: 'OTS: Yuhwa’s ice-blue back to hot copper, looking over her shoulder, wanting; Haemosu gold light',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png'],
		people: ['yuhwa', 'haemosu'],
		prompt:
			'Intimate OTS. Yuhwa’s back to hot copper wall, wet ice-blue hiked, look over shoulder, FACE from attached, binyeo, wanting, drool, black pupils. Haemosu pressing, gold light-plane. Greek-myth history painting + 2D cel, not photoreal porn. Copper room.'
	},
	{
		id: 'nsfw-haemosu-copper-ecu',
		ratio: 0.75,
		nsfw: true,
		tone: '#f0b429',
		at: 'heaven is this thick',
		alt: 'ECU two-shot: Yuhwa climax-adjacent face and Haemosu gold, copper bokeh, skin-forward',
		refs: ['/ch_yuhwa.png'],
		people: ['yuhwa', 'haemosu'],
		prompt:
			'Intimate ECU. Yuhwa FACE from attached filling frame, ahegao-adjacent pleasure, heavy blush, black pupils, sweat. Haemosu mouth at her throat, gold #f0b429 key. Copper room bokeh. History-painting heat, 2D cel, not porn photo.'
	},
	{
		id: 'nsfw-haemosu-shallows-myth',
		ratio: 0.75,
		nsfw: true,
		tone: '#7fc4e8',
		at: 'Into the water',
		alt: 'Myth-painting shallows: Haemosu taking Yuhwa in the Amnok, wet silk, gold chariot tiny in sky, wanting faces',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png'],
		people: ['haemosu', 'yuhwa'],
		prompt:
			'Intimate myth cinema in Amnok shallows. Yuhwa FACE attached, wet ice-blue around hips, legs, wanting. Haemosu gold light, silver-white hair. Same five-dragon gold chariot tiny in sky. Painterly Titian river-god energy + 2D cel, not photoreal porn. Black pupils.'
	}
];

for (const im of slots) upsertSlot(im);

// Retarget hatch at-fragments to new copy
{
	const h = entry.images.find((x) => x.id === 'jumong-buyeo-hatch');
	if (h) h.at = 'out of the egg comes a baby boy';
	const w = entry.images.find((x) => x.id === 'jumong-buyeo-hatch-worm');
	if (w) w.at = 'He looks up from the shell';
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('Jumong blocks', entry.blocks.length, 'images', entry.images.length);
console.log(
	'new scenes',
	entry.blocks.filter((b) => b.kind === 'scene').map((b) => b.label).join(' | ')
);
