import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const PEOPLE = 'src/lib/data/image-people.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const imagePeople = JSON.parse(fs.readFileSync(PEOPLE, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		for (const en of ch.entries ?? []) {
			if (en.title === title) return en;
		}
	}
	throw new Error(`missing entry ${title}`);
}

function findFlash(entry, title) {
	const fb = (entry.blocks ?? []).find((b) => b.kind === 'flashback' && b.title === title);
	if (!fb) throw new Error(`missing flashback ${title} in ${entry.title}`);
	return fb;
}

function insertAfterHtml(blocks, needle, extra) {
	const i = blocks.findIndex((b) => b.kind === 'p' && (b.html ?? '').includes(needle));
	if (i < 0) throw new Error(`needle not found: ${needle.slice(0, 60)}`);
	blocks.splice(i + 1, 0, ...extra);
}

function replaceHtml(blocks, needle, next) {
	const i = blocks.findIndex(
		(b) => (b.kind === 'p' || b.kind === 'monologue') && (b.html ?? '').includes(needle)
	);
	if (i < 0) throw new Error(`replace needle not found: ${needle.slice(0, 60)}`);
	blocks.splice(i, 1, ...next);
}

function prependImages(entry, slots) {
	entry.images = [...slots, ...(entry.images ?? [])];
}

function upsertPeople(id, people) {
	imagePeople[id] = people;
}

function slot(partial) {
	return {
		ratio: 1.778,
		...partial
	};
}

const namseng = findEntry('Birth of Namseng');
const wedding = findEntry('Gotaso’s Wedding');
const firstKim = findEntry('The First Kim');
const daeya = findEntry('Daeya Fortress');
const jumong = findEntry('Jumong');
const gaya = findEntry('Gaya, the Lost Nations');
const deathEuija = findEntry('The Death of Buyeo Euija');
const deathChunchu = findEntry('The Death of Kim Chunchu');
const deathGesomun = findEntry('The Death of Yeon Gesomun');
const deathYushin = findEntry('The Death of Kim Yushin');
const howMet = findFlash(wedding, 'how they met');
const bupminBirth = findFlash(wedding, "Bupmin's birth");
const girlChild = findFlash(wedding, 'the girl-child');

/* ── Ibiga sees Right View from the sky ── */
replaceHtml(gaya.blocks, 'Before the sons, there is a night', [
	{
		kind: 'p',
		html: 'Before the sons, there is a look from very high up. <b>Ibiga</b> keeps the sky the way other gods keep a hall — cloud is his body, the living world a map he does not usually read. Then he looks down.',
		ko: '아들들보다 먼저, 아주 높은 곳에서의 시선이 있다. <b>이비가</b>는 하늘이 그의 몸이므로, 이승을 굳이 읽지 않는다. 그러다 내려다본다.'
	},
	{
		kind: 'p',
		html: 'On her mountain the <b>Lady of the Right View</b> is on watch — jade-mist silk, one ridge, no court behind her. She is guarding the mountain as if it were a country. She does not look up. She does not need to.',
		ko: '산 위에는 <b>정견모주</b>가 서 있다. 안개빛 비단, 능선 하나, 뒷배 없는 자리. 산을 나라처럼 지킨다. 올려다보지 않는다. 볼 필요가 없다.'
	},
	{
		kind: 'dialogue',
		chip: '#1e4d9c',
		person: 'ibiga',
		lines: ['저 능선…', '저 여자.', '이 길을 천 번도 더 날았는데. 왜 산이 나를 보냐.'],
		en: [
			'That ridge…',
			'That woman.',
			'I have flown this path a thousand times. Why is the mountain looking back.'
		]
	},
	{
		kind: 'p',
		html: 'Love arrives as weather — sudden, unasked. He cannot keep the hour. The sky comes down to touch the mountain, and does not leave.',
		ko: '사랑은 날씨처럼 온다. 허락을 묻지 않는다. 시각을 지키지 못한다. 하늘이 산에 닿으러 내려오고, 떠나지 않는다.'
	}
]);

prependImages(gaya, [
	slot({
		id: 'ibiga-sky-notice',
		tone: '#1e4d9c',
		at: 'Then he looks down.',
		alt: 'Ibiga high in a cobalt sky, a tiny cloud-god looking down at one jade figure on a Korean mountain ridge',
		prompt:
			'Cinematic 16:9 movie still, dramatic lighting. Ibiga HIGH in the real sky among sculptural storm-clouds — he IS the weather. Camera with him, looking down. Far below: a REAL Korean mountain ridge a camera could stand on — granite, pine, packed earth, natural dusk. Tiny Lady of the Right View in jade-mist silk on watch. Face matches the attached Ibiga portrait. Cobalt #1e4d9c silk catching rim-light. Painterly anime-adjacent cinema, not photoreal, not cartoon, not an abstract color-plane. No army. No text. No watermark.',
		refs: ['/ch_ibiga.png', '/ch_rightview.png'],
		people: ['ibiga', 'jeonggyeon']
	}),
	slot({
		id: 'rightview-ridge-guard',
		tone: '#c084fc',
		at: 'She is guarding the mountain',
		alt: 'Lady of the Right View on her ridge, jade-mist silk, watching the mountain as if it were a court',
		prompt:
			'Cinematic CLOSE-UP 16:9 movie still, dramatic side-light. REAL Korean mountain ridge: granite, pine, packed earth, natural dusk sky. Lady of the Right View on watch, jade-mist #c084fc silk catching wind. Face matches the attached portrait. She does not look up yet. Painterly anime-adjacent cinema, not photoreal, not an abstract slab. No army. No text. No watermark.',
		refs: ['/ch_rightview.png'],
		people: ['jeonggyeon']
	})
]);
upsertPeople('ibiga-sky-notice', ['ibiga', 'jeonggyeon']);
upsertPeople('rightview-ridge-guard', ['jeonggyeon']);

/* ── Haemosu sees Yuhwa and sisters from the sky ── */
replaceHtml(jumong.blocks, 'looks down from the sky and finds', [
	{
		kind: 'p',
		html: '<b>Haemosu</b>, god of the sun, is high up — the gold disc, the five dragons, the hour he is supposed to keep. Then he looks down and the hour breaks.',
		ko: '태양신 <b>해모수</b>는 높이 있다. 금빛 원반, 다섯 용, 지켜야 할 시각. 그러다 내려다보고 시각이 깨진다.'
	},
	{
		kind: 'p',
		html: 'In the Ubal shallows <b>Lady Yuhwa</b> and her sisters <b>Hwahye</b> and <b>Wihye</b> are bathing — clothes on the rocks, silk slipped, nearly topless, wet hair, the river at their hips. Three river-daughters who did not dress for heaven. He falls in love and in lust in the same glance. <b>Habek</b>, god of the Amnok, will cast her out for it; King Geumwa of Buyeo will take her in.',
		ko: '우발 여울에 <b>유화부인</b>과 언니 <b>화혜</b>, <b>위혜</b>가 목욕한다. 옷은 바위에, 비단은 흘러 거의 윗도리 없이, 젖은 머리, 강물이 허리까지. 하늘을 위해 입은 옷이 아니다. 사랑과 욕망이 한 눈에 온다. 압록의 신 <b>하백</b>은 그 일로 내쫓고, 부여의 금와왕이 들인다.'
	}
]);
replaceHtml(jumong.blocks, 'leave their clothes on the rocks', [
	{
		kind: 'p',
		html: 'A hot afternoon. Three daughters of <b>Habek</b> leave their clothes on the rocks. <b>Hwahye</b> and <b>Wihye</b> first — eldest, then second — silk undone at the shoulder, almost nothing left above the water. <b>Yuhwa</b> steps in last, wet hair down her back, and does not hide.',
		ko: '더운 오후. <b>하백</b>의 세 딸이 옷을 바위에 벗는다. <b>화혜</b>와 <b>위혜</b>가 먼저 — 언니, 그다음 — 어깨에서 비단이 풀려, 물 위로는 거의 남는 것이 없다. <b>유화</b>가 맨 나중에 들어가고, 등을 적신 채 숨기지 않는다.'
	}
]);

prependImages(jumong, [
	slot({
		id: 'haemosu-sky-sisters',
		tone: '#f0b429',
		nsfw: true,
		at: 'Then he looks down and the hour breaks.',
		alt: 'From very high in the gold sun-chariot: three river-daughters bathing in the Amnok, silk slipped, nearly undressed',
		prompt:
			'Cinematic 16:9 movie still, dramatic lighting. FROM VERY HIGH: Haemosu at the gold rail of a real wheeled sun-chariot, five living dragons, natural cloudy sky. Face matches the attached Haemosu portrait. Far below: REAL Amnok river shallows a camera could stand in — wet stones, packed bank, current. Three river-daughters bathing, wet pale silk slipped off the shoulders, hiked at the hip. Gold #f0b429 accent. Painterly anime-adjacent cinema, not photoreal, not abstract. No army. No text. No watermark.',
		refs: ['/ch_haemosu.png', '/ch_yuhwa.png', '/ch_hwahye.png', '/ch_wihye.png'],
		people: ['haemosu', 'yuhwa', 'hwahye', 'wihye']
	})
]);
upsertPeople('haemosu-sky-sisters', ['haemosu', 'yuhwa', 'hwahye', 'wihye']);

/* ── Heo presents in Suro’s court ── */
replaceHtml(gaya.blocks, 'She arrives on a red-sailed ship at sixteen', [
	{
		kind: 'p',
		html: 'She arrives on a red-sailed ship at sixteen — foreign, luminous, built like nowhere on this coast. The beach is only a door. The first time <b>Suro</b> falls in love is not on the sand.',
		ko: '열여섯에 붉은 돛을 달고 온다. 이 해안에 없는 몸. 바다는 문일 뿐이다. <b>수로</b>가 사랑에 빠지는 첫 순간은 모래가 아니다.'
	},
	{
		kind: 'p',
		html: 'In the timber court of Golden Gaya she presents herself — no servant speaking for her, her own name, silk that does not belong to this hall. He is already on the dais. He meant to receive a princess. He receives a woman, and love hits him before protocol can stand up.',
		ko: '금관가야의 나무 조정에서 스스로 선다. 대신 말하는 하인 없이, 제 이름, 이 전각에 없는 비단. 수로는 이미 자리에 있다. 공주를 받으려 했다. 한 여자를 받고, 예법이 일어서기 전에 사랑에 맞는다.'
	}
]);
replaceHtml(gaya.blocks, 'Suro sends servants. She refuses.', [
	{
		kind: 'p',
		html: 'Servants had been sent to the ship. She refused them. So the court is where they meet — and the moment he sees her, speech leaves him like heat from an open kiln.',
		ko: '배로 하인을 보냈다. 거절했다. 그래서 조정에서 만난다. 보는 순간 말이 가마의 열처럼 달아난다.'
	}
]);

prependImages(gaya, [
	slot({
		id: 'heo-court-present',
		tone: '#d98fa8',
		at: 'In the timber court of Golden Gaya she presents herself',
		alt: 'Princess Heo presenting herself in Suro’s timber court — foreign silk, empty hall, the king on a low dais',
		prompt:
			'Cinematic 16:9 movie still, dramatic lamp-shaft. REAL Gaya timber court a camera could stand in — packed earth, wooden posts, giwa-shadow, one low dais, empty of furniture clutter. Princess Heo presents herself in violet #d98fa8 silk in the open floor. King Suro on the dais in gold #e0a33c, stunned. Faces match the attached portraits. Painterly anime-adjacent cinema, not photoreal, not an abstract hall. No army. No text. No watermark.',
		refs: ['/ch_heo.png', '/ch_suro.png'],
		people: ['heohwangok', 'suro']
	}),
	slot({
		id: 'suro-court-love',
		tone: '#e0a33c',
		nsfw: true,
		at: 'love hits him before protocol can stand up',
		alt: 'Suro on the dais — gold branch crown, stunned, falling in love the first time he sees Heo in his court',
		prompt:
			'Cinematic CLOSE-UP 16:9 movie still, dramatic lamp. REAL Gaya timber hall — wooden posts, packed earth. King Suro, gold branch crown, gold #e0a33c silk, falling in love the first time he sees her. Face matches the attached portrait. Heo a violet silk sliver at the edge. Painterly anime-adjacent cinema. No text. No watermark.',
		refs: ['/ch_suro.png', '/ch_heo.png'],
		people: ['suro', 'heohwangok']
	})
]);
upsertPeople('heo-court-present', ['heohwangok', 'suro']);
upsertPeople('suro-court-love', ['suro', 'heohwangok']);

/* ── Seohyeon accidental cave; goddesses man-starved ── */
firstKim.blocks = [
	{
		kind: 'p',
		html: 'Years before the marshal. <b>Kim Seohyeon</b> is not looking for a shrine. He is looking for water, and the hill opens under his foot, and he falls into a bowl of black water under stone that has a rule he does not know yet.',
		ko: '원수보다 몇 해 전. <b>김서현</b>은 사당을 찾는 것이 아니다. 물을 찾다 언덕이 발 밑에서 열리고, 돌 아래 검은 물의 사발로 떨어진다. 아직 법이 있는 줄 모른다.'
	},
	{
		kind: 'p',
		html: 'The robe falls because every man who enters here is naked. He does not choose it. The steam chooses it for him. Bright blue silk on wet stone — accidental, already too late to dress.',
		ko: '도포가 내린다. 여기는 남자라면 벗으니까. 그가 고른 것이 아니다. 김이 고른다. 밝은 푸른 비단이 젖은 돌 위에 — 실수이고, 이미 다시 입을 때는 늦었다.'
	},
	{
		kind: 'p',
		html: 'They have never seen a Kim. They have been man-starved longer than a surname. Three goddesses on the far rock, and then this — athletic, clean-shaven, very attractive, accidentally theirs. They fall in love before they finish looking at his face. Their heads fill with lust they are not supposed to say aloud.',
		ko: '김을 본 적이 없다. 남자에 굶주린 지가 성씨보다 길다. 맞은편 바위에 여신 셋, 그리고 이 사람 — 몸 좋고, 수염 없고, 너무 잘생기고, 실수로 그들의 것이 된. 얼굴 보기를 마치기 전에 사랑에 빠진다. 머리 속이 말하면 안 되는 욕망으로 찬다.'
	},
	{
		kind: 'monologue',
		person: 'golhwa',
		html: 'If I do not put my mouth on him I will die. Look at the back. Look at the hip. I have not had a clean thought since he hit the water. We have been hungry. He is the meal.',
		ko: '입에 안 넣으면 죽는다. 등 봐. 허리 봐. 물에 떨어진 뒤로 깨끗한 생각이 없다. 굶었다. 저 사람이 밥이다.'
	},
	{
		kind: 'monologue',
		person: 'hyulle',
		html: 'Do not stare. Stare. Do not. I want him to turn around. I also never want him to turn around. If he looks at me I will make a sound. I am already making it in my head.',
		ko: '보지 마. 봐. 보지 마. 돌아봤으면. 돌아보지 않았으면. 날 보면 소리가 난다. 머리 속에서는 이미 났다.'
	},
	{
		kind: 'monologue',
		person: 'narim',
		html: 'Counsel. I am supposed to give counsel. My head is full of the worst possible sentences. He is very attractive. We are extremely hungry. Those two facts are now the same fact. Golhwa is drooling. Hyullé is hiding and looking anyway. I am sitting like an eldest and my eyes have gone to hearts with the rest.',
		ko: '조언. 조언을 해야 한다. 머리 속은 최악의 문장뿐이다. 너무 잘생겼다. 우리는 너무 굶었다. 그 두 사실이 이제 하나다. 골화는 침을 흘린다. 혈레는 숨으면서도 본다. 나는 언니처럼 앉아 있는데, 눈만 나머지를 따라 하트가 된다.'
	},
	{
		kind: 'p',
		html: '<b>Golhwa</b> drools. <b>Hyullé</b> hides behind her hands and looks anyway. <b>Narim</b> sits like an eldest and her eyes go to hearts with the rest. Steam, surname — 김 — the same sound, waiting for a first mouth to say it.',
		ko: '<b>골화</b>는 침을 흘린다. <b>혈레</b>는 손 뒤에 숨으면서도 본다. <b>나림</b>은 언니처럼 앉아 있는데, 눈만 나머지를 따라 하트가 된다. 김, 성 — 같은 소리. 첫 입이 말해주기를 기다리고 있다.'
	}
];
for (const im of firstKim.images ?? []) {
	if (im.id === 'seohyeon-cavern-wide' || im.id === 'seohyeon-robe-falls' || im.id === 'seohyeon-naked-enter') {
		im.at = 'The robe falls because every man';
	} else {
		im.at = 'They have never seen a Kim';
	}
}
firstKim.images = [
	slot({
		id: 'seohyeon-accident-wide',
		tone: '#3E8EF0',
		nsfw: true,
		at: 'the hill opens under his foot',
		alt: 'Wide steam cavern: Seohyeon has just fallen in — tiny bright-blue figure at the rock lip, three goddess specks on the far wet rock',
		prompt:
			'Cinematic 16:9 movie still, dramatic cave-light. REAL Korean mountain steam-cavern matching the attached cave: wet black stone, cyan steam, water bowl. Kim Seohyeon has just stumbled in at the rock lip, bright blue #3E8EF0 silk, from behind. Three goddesses on the far wet rock. Faces match the attached portraits. Painterly anime-adjacent cinema, not an abstract wedge. No army. No text. No watermark.',
		refs: ['/pl_cave.png', '/ch_kim_seohyun.png', '/ch_narim.png', '/ch_golhwa.png', '/ch_hyullé.png'],
		people: ['seohyeon', 'narim', 'golhwa', 'hyulle']
	}),
	...(firstKim.images ?? [])
];
upsertPeople('seohyeon-accident-wide', ['seohyeon', 'narim', 'golhwa', 'hyulle']);

/* ── Munhee knits; Chunchu disrobed; slow visits ── */
const sewIdx = howMet.blocks.findIndex((b) => b.kind === 'p' && (b.html ?? '').includes('She sews it standing'));
if (sewIdx < 0) throw new Error('sewing block missing');
howMet.blocks.splice(
	sewIdx,
	3,
	{
		kind: 'p',
		html: 'He has to take the coat off for her to mend it. Magenta silk leaves his shoulders. He sits disrobed in her brother’s hall with a True Bone’s embarrassment and nowhere to put his hands. She knits the tear standing close enough to feel the heat off his skin — and that is all, the first time. Needle. Breath. The slow fact of a man without his coat.',
		ko: '고쳐 주려면 겉옷을 벗어야 한다. 자홍 비단이 어깨에서 내린다. 오라비 집에서 벗은 채로 앉아, 진골의 민망함과 손 둘 곳이 없다. 그녀는 찢어진 곳을 꿰매며 그의 피부 열을 느낄 만큼 가까이 선다. 그게 전부다, 첫날은. 바늘. 숨. 겉옷 없는 남자라는 느린 사실.'
	},
	{
		kind: 'dialogue',
		chip: '#D8258C',
		person: 'chunchu',
		lines: ['…손이 빠르시군.', '나는… 이렇게 앉아 본 적이 없소.'],
		en: ['…Your hands are quick.', 'I have… not sat like this.']
	},
	{
		kind: 'dialogue',
		chip: '#E07FA8',
		person: 'munhee',
		lines: ['앉아 계시면 됩니다.', '옷은 제가 입혀 드릴 테니.', '오늘은… 그것만.'],
		en: ['Sit.', 'I will put the coat back on you.', 'Today… only that.']
	},
	{
		kind: 'p',
		html: 'He comes back the next day, needing nothing sewn, and again the day after that. Each visit she finds a new place on the garment — and they sit closer. The needle slows. His breath learns the back of her hand. They do not leap. They accumulate.',
		ko: '다음 날 다시 온다. 꿰맬 것은 없다. 그다음 날도. 올 때마다 옷의 다른 곳을 찾는다. 더 가까이 앉는다. 바늘이 느려진다. 그의 숨이 손등을 배운다. 뛰어오르지 않는다. 쌓인다.'
	},
	{
		kind: 'p',
		html: 'On a later visit the coat is off again. She stands behind him, needle forgotten, staring at the breadth of his shoulders as if the knitting were only an excuse to keep looking. Magenta silk has slipped. She does not tell him to cover it. When the needle pauses it is because her mouth has found the place above his pulse — and Yushin is careful to be looking somewhere else the entire time.',
		ko: '나중 방문에 또 겉옷을 벗는다. 뒤에 서서 바늘을 잊고, 어깨 너비를 본다. 뜨개질은 계속 보기 위한 핑계일 뿐인 것처럼. 자홍 비단이 흘렀다. 가리라고 하지 않는다. 바늘이 멈추는 것은 입이 맥 위를 찾아서다. 유신은 그 시간 내내 다른 곳을 보도록 조심한다.'
	}
);

const munheeFirst = (wedding.images ?? []).find((im) => im.id === 'munhee-sewing-first');
const munheeLater = (wedding.images ?? []).find((im) => im.id === 'munhee-sewing-later');
const munheeBack = (wedding.images ?? []).find((im) => im.id === 'munhee-chunchu-back');
if (munheeFirst) munheeFirst.at = 'He has to take the coat off';
if (munheeLater) munheeLater.at = 'He comes back the next day';
if (munheeBack) munheeBack.at = 'On a later visit the coat is off again';

wedding.images = [
	slot({
		id: 'munhee-knit-disrobe',
		tone: '#E07FA8',
		nsfw: true,
		at: 'He has to take the coat off',
		alt: 'First visit: Chunchu sits disrobed in magenta light while Munhee knits his coat standing close — not yet a kiss',
		prompt:
			'Cinematic CLOSE-UP 16:9 movie still, dramatic oil-lamp. REAL Silla timber inner-hall matching the attached palace: packed earth, wooden posts, paper lattice. Young Kim Chunchu sits disrobed, magenta #D8258C silk fallen at the waist, three-quarter from behind. Munhee in pink #E07FA8 silk stands close knitting his coat. Faces match the attached portraits. Slow first visit, not a kiss. Painterly anime-adjacent cinema. No clutter. No text. No watermark.',
		refs: ['/ch_chunchu_hwarang.png', '/ch_munhee.png', '/pl_eastern_palace.png'],
		people: ['chunchu', 'munhee']
	}),
	...(wedding.images ?? [])
];
upsertPeople('munhee-knit-disrobe', ['chunchu', 'munhee']);

/* ── Pumsuk / Maehwa: feast, curvy body, cannot contain ── */
replaceHtml(daeya.blocks, 'At first he does not look', [
	{
		kind: 'p',
		html: 'At the feast he notices her before he has a sentence for it. <b>Maehwa</b> walks the lamp-line and the teal silk tells on her — hip, waist, the heavy curve of a woman who has never been True Bone-thin. Extremely curvy. Extremely attractive. His body answers before his rank does.',
		ko: '잔치에서 말이 생기기도 전에 먼저 본다. <b>매화</b>가 등잔 줄을 걷고, 청록 비단이 그를 고발한다 — 엉덩이, 허리, 진골처럼 가늘지 않은 몸의 곡선. 너무 글래머러스하다. 너무 예쁘다. 몸이 품계보다 먼저 대답한다.'
	},
	{
		kind: 'p',
		html: 'He tries to contain himself. True Bone boys are trained to. He talks to the cup, to the rank, to the idea of a fortress. He looks at the beams. He looks at his own hands. It does not work. He is so horny the training feels like a joke, and her body and the way she sits — untaught, erotic without trying — will not let him be polite.',
		ko: '참으려 한다. 진골 소년은 그렇게 배운다. 잔에 말하고, 품계에 말하고, 요새라는 생각에 말한다. 들보를 본다. 제 손을 본다. 안 된다. 너무 흥분해서 훈련이 농담 같고, 몸과 앉은 자세 — 배우지 않았고, 애쓰지 않아도 에로틱한 — 가 예의를 허락하지 않는다.'
	}
]);
replaceHtml(daeya.blocks, 'Then the lamp finds the place her chima', [
	{
		kind: 'p',
		html: 'Then the lamp finds the place her chima pulls taut at the hip, and whatever was left of containment fails in one glance. He notices the body before he notices the woman. He hates that about himself and cannot stop.',
		ko: '등잔이 치마가 허리에서 팽팽해지는 곳을 찾고, 남은 절제가 한 눈에 무너진다. 여자보다 몸을 먼저 본다. 그게 싫고, 멈출 수가 없다.'
	}
]);

daeya.images = [
	slot({
		id: 'pumsuk-feast-curve',
		tone: '#8AAFA0',
		nsfw: true,
		at: 'Maehwa walks the lamp-line',
		alt: 'Daeya feast: Maehwa’s teal silk tells on a heavy hip and waist; Pumsuk in ice-blue trying not to look',
		prompt:
			'Cinematic CLOSE-UP 16:9 movie still, dramatic oil-lamp. REAL Daeya timber feast-hall matching the attached fortress interior language: wooden posts, packed-earth floor, oil lamps. Maehwa in teal-sage #8AAFA0 silk, S-curve, hiked chima, plump hip in the lamp — extremely curvy. Pumsuk in ice-blue #7EB8F0 at the edge, flushed, trying not to look. Faces match the attached portraits. Painterly anime-adjacent cinema. Clothed. No text. No watermark.',
		refs: ['/ch_gumil_wife.png', '/ch_pumsuk.png', '/pl_daeya_fortress.png'],
		people: ['gumilwife', 'pumsuk']
	}),
	slot({
		id: 'pumsuk-cannot-hold',
		tone: '#7EB8F0',
		nsfw: true,
		at: 'He tries to contain himself',
		alt: 'Pumsuk failing at self-control — ice-blue silk, flushed throat, knuckles white on the cup, Maehwa’s hip in lamp',
		prompt:
			'Cinematic CLOSE-UP 16:9 movie still, dramatic lamp. REAL Daeya timber feast-hall: wooden posts, packed earth. Kim Pumsuk, blue crescent headband, ice-blue #7EB8F0 silk, flushed, knuckles white on a cup, failing to look away. Face matches attached portrait. Maehwa’s teal-sage hiked-silk hip in the lower frame. Painterly anime-adjacent cinema. No text. No watermark.',
		refs: ['/ch_pumsuk.png', '/ch_gumil_wife.png'],
		people: ['pumsuk', 'gumilwife']
	}),
	...(daeya.images ?? [])
];
upsertPeople('pumsuk-feast-curve', ['gumilwife', 'pumsuk']);
upsertPeople('pumsuk-cannot-hold', ['pumsuk', 'gumilwife']);

const notice = (daeya.images ?? []).find((im) => im.id === 'pumsuk-yehwa-notice');
const indifferent = (daeya.images ?? []).find((im) => im.id === 'pumsuk-yehwa-indifferent');
if (notice) notice.at = 'Then the lamp finds the place her chima';
if (indifferent) indifferent.at = 'He tries to contain himself';

/* ── Birth: white, Samsin + mother only ── */
replaceHtml(namseng.blocks, 'labours beside a hanging portrait', [
	{
		kind: 'p',
		html: 'Yeon’s wife labours in a Goguryeo timber chamber blasted white with daylight — no extra bodies, no portrait-frame crowd. Only the midwife who opens a birth, and the mother. The rest of the world falls out of the light.',
		ko: '연씨 부인의 해산은 고구려 목조 방 안, 햇빛이 하얗게 터진 빛 속에서다. 다른 몸 없고, 액자 구경꾼 없다. 숨을 여는 산파와 어머니뿐. 세상의 나머지는 그 빛 밖으로 떨어진다.'
	}
]);

namseng.images = [
	slot({
		id: 'namseng-birth-white',
		tone: '#e8b4c8',
		at: 'Only the midwife who opens a birth, and the mother.',
		alt: 'White-blasted Goguryeo birth-chamber: Samsin and Yeon’s wife only',
		prompt:
			'Cinematic 16:9 movie still, dramatic overexposed daylight. REAL Goguryeo timber birth-chamber a camera could stand in — wooden posts, paper window blasting PITCH-WHITE light until the floor almost vanishes. ONLY two figures: goddess Samsin and the labouring mother. Samsin, mature midwife, white hair, cream jeogori, royal-blue chima, red sash. Face matches the attached Samsin portrait. Mother from behind / three-quarter, Goguryeo silk, no invented face. Blush-pink #e8b4c8 accent. No husband, no servants. Painterly anime-adjacent cinema, not an abstract white rectangle. No text. No watermark.',
		refs: ['/ch_samsin.png'],
	}),
	...(namseng.images ?? [])
];
upsertPeople('namseng-birth-white', ['samsin', 'yeonwife']);
const oldBirth = (namseng.images ?? []).find((im) => im.id === 'samsin-namseng-birth');
if (oldBirth) {
	oldBirth.at = 'Only the midwife who opens a birth, and the mother.';
	oldBirth.alt =
		'Pitch-white: Samsin laying a hand on the labouring mother — two figures only, no hall';
	oldBirth.prompt =
		'Minimal iconic 16:9 still. PITCH WHITE background. ONLY Samsin and the mother. Face matches attached Samsin portrait. Blush-pink #e8b4c8 accent. No architecture. No husband. No text. No watermark.';
}

bupminBirth.blocks.unshift({
	kind: 'p',
	html: 'Samsin is there the way she is always there when a breath starts — and no one else. Pitch white. Mother and midwife. The rest of the house can wait outside the light.',
	ko: '삼신은 숨이 열릴 때 늘 있는 방식으로 있다. 다른 사람은 없다. 새하얀 빛. 어머니와 산파. 집의 나머지는 그 빛 밖에서 기다리면 된다.'
});
girlChild.blocks.unshift({
	kind: 'p',
	html: 'The girl-child arriving: again the white, again only Samsin and Munhee. Pink silk already too sure of itself in a void that has no furniture to flatter it.',
	ko: '여자아이가 온다. 다시 흰 빛, 다시 삼신과 문희뿐. 분홍 비단이 가구 없는 허공에서 벌써 너무 자신 있다.'
});

wedding.images = [
	slot({
		id: 'bupmin-birth-white',
		tone: '#e8b4c8',
		at: 'Samsin is there the way she is always there',
		alt: 'White-blasted Silla birth-chamber: Samsin and Munhee only — Bupmin’s birth',
		prompt:
			'Cinematic 16:9 movie still, dramatic overexposed daylight. REAL Silla timber inner-chamber matching the attached Eastern Palace: wooden posts, paper window blasting PITCH-WHITE light. ONLY two figures: Samsin and Munhee as mother. Faces match the attached portraits. Pink #E07FA8 silk. Newborn implied at her chest, not a third portrait. No Chunchu. Painterly anime-adjacent cinema. No text. No watermark.',
		refs: ['/ch_samsin.png', '/ch_munhee.png', '/pl_eastern_palace.png'],
		tone: '#F0A3C0',
		at: 'The girl-child arriving: again the white',
		alt: 'White-blasted Silla birth-chamber: Samsin and Munhee only — Gotaso’s birth',
		prompt:
			'Cinematic 16:9 movie still, dramatic overexposed daylight. REAL Silla timber inner-chamber: wooden posts, paper window blasting PITCH-WHITE light. ONLY Samsin and Munhee. Faces match attached portraits. Gotaso-pink #F0A3C0 silk. No husband. Painterly anime-adjacent cinema. No text. No watermark.',
		refs: ['/ch_samsin.png', '/ch_munhee.png', '/pl_eastern_palace.png'],
		people: ['samsin', 'munhee']
	}),
	slot({
		id: 'gotaso-birth-white',
		tone: '#F0A3C0',
		at: 'The girl-child arriving: again the white',
		alt: 'White-blasted Silla birth-chamber: Samsin and Munhee only — Gotaso’s birth',
		prompt:
			'Cinematic 16:9 movie still, dramatic overexposed daylight. REAL Silla timber inner-chamber: wooden posts, paper window blasting PITCH-WHITE light. ONLY Samsin and Munhee. Faces match attached portraits. Gotaso-pink #F0A3C0 silk. No husband. Painterly anime-adjacent cinema. No text. No watermark.',
		refs: ['/ch_samsin.png', '/ch_munhee.png', '/pl_eastern_palace.png'],
		people: ['samsin', 'munhee']
	}),
	...(wedding.images ?? [])
];
upsertPeople('bupmin-birth-white', ['samsin', 'munhee']);
upsertPeople('gotaso-birth-white', ['samsin', 'munhee']);
const bupLantern = (wedding.images ?? []).find((im) => im.id === 'bupmin-birth-lantern');
const gotasoLantern = (wedding.images ?? []).find((im) => im.id === 'gotaso-birth-lantern');
if (bupLantern) bupLantern.at = 'Samsin is there the way she is always there';
if (gotasoLantern) gotasoLantern.at = 'The girl-child arriving: again the white';

/* ── Death: black, reaper + person only ── */
function deathSlot(id, personId, at, alt, name, hex, ch, extraPeople = []) {
	const people = ['kangrim', personId, ...extraPeople];
	upsertPeople(id, people.filter((p, i, a) => a.indexOf(p) === i));
	return slot({
		id,
		tone: '#4a4a58',
		at,
		alt,
		prompt: `Cinematic 16:9 movie still, dramatic lighting. REAL underworld road a camera could stand on — packed dark earth, faint mist, night so black the world falls away. ONLY two figures: Kangrim the grim reaper and ${name}. Kangrim in black gat, charcoal #4a4a58 robe, one rust-red sleeve catching a rim light. ${name} in ${hex} silk. Faces match the attached portraits. Painterly anime-adjacent cinema, not photoreal, not cartoon, not an abstract color-plane. No army. No court furniture. No text. No watermark.`,
		refs: ['/ch_kangrim.png', ch, '/pl_underworld.png'],
		people
	});
}

daeya.images = [
	deathSlot(
		'gotaso-death-black',
		'gotaso',
		'One question, then we walk.',
		'Pitch-black void: Kangrim and Gotaso only — ledger, pink silk, no fortress',
		'Gotaso',
		'#F0A3C0',
		'/ch_gotaso.png'
	),
	deathSlot(
		'pumsuk-death-black',
		'pumsuk',
		'Hwarang Pumsuk.',
		'Pitch-black void: Kangrim and Pumsuk only — ice-blue silk, no fortress',
		'Pumsuk',
		'#7EB8F0',
		'/ch_pumsuk.png'
	),
	...(daeya.images ?? [])
];

deathChunchu.images = [
	deathSlot(
		'chunchu-death-black',
		'chunchu',
		'The escort arrives on schedule.',
		'Pitch-black void: Kangrim and Chunchu only — magenta silk, no temple',
		'Chunchu',
		'#D8258C',
		'/ch_chunchu.png'
	),
	...(deathChunchu.images ?? [])
];

deathEuija.images = [
	deathSlot(
		'euija-death-black',
		'euija',
		'Before the enemy capital finishes humiliating you',
		'Pitch-black void: Kangrim and Euija only — no Tang court',
		'Euija',
		'#e08a2e',
		'/ch_buyeo_euija.png'
	),
	...(deathEuija.images ?? [])
];

deathYushin.images = [
	deathSlot(
		'yushin-death-black',
		'yushin',
		'Kangrim reads his name three times at the bedside',
		'Pitch-black void: Kangrim and Yushin only — Confucian blue, no house',
		'Yushin',
		'#2A5FB8',
		'/ch_kim_yushin_old.png'
	),
	...(deathYushin.images ?? [])
];

deathGesomun.images = [
	slot({
		id: 'gesomun-death-black',
		tone: '#7c3aed',
		at: 'himself stands in the room.',
		alt: 'Pitch-black void: Yumla and Gesomun only — a king for a king, no deathbed crowd',
		prompt:
			'Cinematic 16:9 movie still, dramatic rim-light. REAL underworld road matching the attached place: packed dark earth, faint mist, night so black the world falls away. ONLY two figures: Judge Yumla and Yeon Gesomun. Yumla in purple #7c3aed robes. Gesomun in dark Goguryeo silk. Faces match the attached portraits. Painterly anime-adjacent cinema, not an abstract void. No sons. No furniture dump. No text. No watermark.',
		refs: ['/ch_yumla.png', '/ch_yeon_gesomun.png', '/pl_underworld.png'],
		people: ['yumla', 'gesomun']
	}),
	...(deathGesomun.images ?? [])
];
upsertPeople('gesomun-death-black', ['yumla', 'gesomun']);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
fs.writeFileSync(PEOPLE, JSON.stringify(imagePeople, null, '\t') + '\n');
console.log('patched first-meets, births, deaths');
