import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const SEQ = 'src/lib/movieSequences.ts';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

const jumong = findEntry('Jumong');

function findDlg(pred, label) {
	const b = jumong.blocks.find((x) => x.kind === 'dialogue' && pred(x));
	if (!b) throw new Error(`missing dialogue: ${label}`);
	return b;
}

function setDlg(b, lines, en) {
	b.lines = lines;
	b.en = en;
}

const join0 = (b) => (b.en || []).join(' | ');

setDlg(
	findDlg((b) => b.person === 'yuhwa' && /I’m staying|I'm staying/.test(join0(b)), 'staying'),
	['언니들—', '잠깐. 난—', '가. 난 여기.'],
	['Unni—', 'Wait. I—', 'Go. I’m here.']
);

setDlg(
	findDlg((b) => b.person === 'haemosu' && join0(b).includes('stop the chariot'), 'chariot'),
	['야—', '잠깐. 야.', '거기. 너.'],
	['Hey—', 'Wait. Hey.', 'You. Stay.']
);

setDlg(
	findDlg((b) => b.person === 'yuhwa' && join0(b).includes('Should I just show him more'), 'show him'),
	['언니.', '가. 난 여기.', '…올려다보지 마, 라고 하려고—'],
	['Unni.', 'Go. I’m here.', '…I was going to say don’t look up—']
);

setDlg(
	findDlg((b) => b.person === 'hwahye' && join0(b).includes('We’re going under'), 'hwahye'),
	['야. 들어가.', '지금. 안 들려?'],
	['Hey. In.', 'Now. You hear me?']
);

setDlg(
	findDlg((b) => b.person === 'wihye' && join0(b).includes('Youngest will stay'), 'wihye'),
	['푸핫— 언니 기다려.', '막내 너 진짜—', '아 몰라, 나 먼저—'],
	['Pfft— wait up.', 'You, seriously—', 'Whatever. I’m going—']
);

setDlg(
	findDlg((b) => b.person === 'haemosu' && join0(b).includes('why aren’t you hiding') || (b.person === 'haemosu' && join0(b).includes('why aren')), 'hiding'),
	['야—', '그렇게 보면 나…', '내려간다. 지금.'],
	['Hey—', 'You look at me like that and I…', 'I’m coming down. Right now.']
);

setDlg(
	findDlg((b) => b.person === 'yuhwa' && join0(b).includes('Heaven stares down'), 'heaven stares'),
	['매일 보잖아요.', '오늘만 부끄러워하라고요?', '…오려면 오세요. 물까지요.', '손부터요. 그다음에—'],
	['You look every day.', 'I’m supposed to get shy just today?', '…Come if you’re coming. Into the water.', 'Hands first. Then—']
);

setDlg(
	findDlg((b) => b.person === 'haemosu' && join0(b).includes('Give me a name first'), 'name first'),
	['이름. 나중에.', '아니면 그냥—', '입부터.'],
	['Name. Later.', 'Or I might just—', 'Mouth first.']
);

setDlg(
	findDlg((b) => b.person === 'yuhwa' && join0(b).includes('Ask with your mouth, and then I’ll say my name'), 'ask mouth'),
	['먼저 내려와요.', '거기서는 명령 같아요.', '여기선— 부탁으로 들을게요.', '입술로 물으면, 그때요.'],
	['Come down first.', 'From up there it sounds like an order.', 'Down here I’ll take it as asking.', 'Ask with your mouth. Then I’ll say it.']
);

setDlg(
	findDlg((b) => b.person === 'yuhwa' && join0(b).includes('Copper gets hot'), 'copper hot'),
	['뜨거워요.', '등. 여기.', '만져 보면—', '구리인지 나인지… 구분 못 하실걸요.'],
	['It’s hot.', 'My back. Here.', 'Touch it and—', 'You won’t tell copper from me.']
);

setDlg(
	findDlg((b) => b.nsfw && b.person === 'yuhwa' && join0(b).includes('Pinned to the copper'), 'pinned'),
	['보지 마— 아니, 봐요.', '눈 돌리지 마.'],
	['Don’t look— no. Look.', 'Don’t look away.']
);

setDlg(
	findDlg((b) => b.nsfw && b.person === 'yuhwa' && join0(b).includes('Her face goes wanting'), 'wanting face'),
	['얼굴이— 이상해. 더—'],
	['My face is— weird. More—']
);

setDlg(
	findDlg((b) => b.person === 'haemosu' && join0(b).includes('I am aware.'), 'aware'),
	['알아.', '손 못 떼겠어.', '입도.'],
	['I know.', 'I can’t take my hands off.', 'Or my mouth.']
);

setDlg(
	findDlg((b) => b.person === 'yuhwa' && join0(b).includes('Not while heaven is watching'), 'heaven watching'),
	['그럼 떼지 마요.', '보는 동안은.', '보는 동안… 더요.'],
	['Then don’t.', 'Not while it’s watching.', 'And while it watches… more.']
);

const yuhwaSlots = [
	{
		id: 'nsfw-yuhwa-lookback-hips',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Look back if you want it.',
		alt: 'OTS 16:9: Yuhwa looking back over her shoulder, wet ice-blue hips and ass the picture, flirty',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png'],
		people: ['yuhwa'],
		prompt:
			'Intimate CLOSE 16:9 film still. OVER-THE-SHOULDER / from behind. Adult Lady Yuhwa in the copper room on the Amnok bank OR waist-deep Amnok shallows — hammered copper plane or wet river stones. The PICTURE is her ass and hips: wet ice-blue #8fc4e0 silk hiked, back to camera, looking BACK over her shoulder with a flirty wanting face. FACE AND pearl-wave binyeo from attached portrait. Black Korean pupils, dark irises, heavy blush, bitten mouth, wink. ONE device: her back as a pale-blue COLUMN. Gold #f0b429 as a hard light-plane through a copper slit, never a halo. Skin-forward cinematic, hiked silk, naked back, not a porn-act catalog. Painterly 2D cel. No text. No watermark.'
	},
	{
		id: 'nsfw-yuhwa-dutch-hike-back',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'She hikes the ice-blue from behind',
		alt: 'Dutch 16:9 from behind: Yuhwa hiking wet ice-blue chima, hips filling the frame, look-back',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png'],
		people: ['yuhwa'],
		prompt:
			'Intimate CLOSE 16:9. DUTCH ANGLE from behind. Adult Yuhwa hiking wet ice-blue #8fc4e0 chima up her hips, ass the midground, looking back over her shoulder. FACE and binyeo from attached. Copper room: hammered copper wall as ONE warm plane, crushed blacks, gold #f0b429 slit-light. Black Korean pupils, wanting look-back, heavy blush. Dramatic hike, not a standing portrait clone. Skin-forward cinematic, hiked silk, naked back. 2D cel-painterly. No text. No watermark.'
	},
	{
		id: 'nsfw-haemosu-grab-yuhwa-back',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: true,
		at: 'He grabs the wet silk at her hip',
		alt: 'OTS 16:9: Haemosu feral open mouth grabbing Yuhwa’s hiked ice-blue back',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png'],
		people: ['yuhwa', 'haemosu'],
		prompt:
			'Intimate CLOSE 16:9 OVER-THE-SHOULDER. Camera on Yuhwa’s wet ice-blue BACK and hiked hips; Haemosu grabbing the silk at her hip, looking feral — open mouth, wanting, not serene. Yuhwa FACE from attached looking back, binyeo matching attached. Haemosu FACE from attached at the edge: silver-white hair, white silk open, gold #f0b429 as the light-plane. Prefer her back as the lead. Copper room, crushed blacks. Black Korean pupils. Skin-forward cinematic, naked back, hiked silk. 2D cel. No text. No watermark.'
	},
	{
		id: 'nsfw-yuhwa-worm-hips',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Worm’s-eye: her hips own the copper',
		alt: 'Worm’s-eye 16:9: Yuhwa’s hips and hiked ice-blue silk fill the frame against copper',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png'],
		people: ['yuhwa'],
		prompt:
			'Intimate CLOSE 16:9. WORM’S-EYE from the copper floor. Adult Yuhwa’s hips and hiked wet ice-blue #8fc4e0 silk OWN the frame; looking down/back, FACE from attached, binyeo matching. ONE device: hips as a monumental lower-third wedge against hammered copper. Gold #f0b429 hard key as a light-plane. Black Korean pupils, wanting. Skin-forward cinematic, hiked silk, not a porn catalog. 2D cel-painterly. No text. No watermark.'
	}
];

const daughterSlots = [
	{
		id: 'jumong-seq-daughters-lean',
		ratio: 1.778,
		tone: '#e8563f',
		nsfw: false,
		at: 'Hip first on the beam',
		alt: 'Dutch Jolbon well: anonymous teal daughter leaning hip-first on the timber beam; tiny Jumong red grin',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt:
			'Minimal iconic 16:9. DUTCH Jolbon well: round granite rim, timber beam, two buckets, packed earth, grey giwa hall — nobody in the shaft. Anonymous OTHER daughter (NOT Sosuno, NOT her face, NOT dusty-rose): teal silk, hip-FIRST lean on the beam, invitation look. Tiny Jumong in red #e8563f grinning easy at the rim. ONE device: the beam as a hard HORIZONTAL. Black Korean pupils. High contrast. SFW sexy pose, not nude. No text. No watermark.'
	},
	{
		id: 'jumong-seq-daughters-hike',
		ratio: 1.778,
		tone: '#e8563f',
		nsfw: false,
		at: 'She hikes it like a dare',
		alt: 'OTS well: anonymous saffron daughter hiking chima a finger; Jumong red grin, grey giwa bokeh',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt:
			'Minimal iconic 16:9. OVER-THE-SHOULDER at the SAME Jolbon well: packed earth, grey giwa, timber beam, two buckets. Anonymous saffron-silk daughter (NOT Sosuno clone) hiking chima a finger, sexy invitation face. Jumong FACE from attached, red #e8563f, easy sun-grin. ONE device: rope as a vertical. Black pupils. SFW. High contrast chiaroscuro. No text. No watermark.'
	},
	{
		id: 'jumong-seq-daughters-invite',
		ratio: 1.778,
		tone: '#c4a06a',
		nsfw: false,
		at: 'Come fetch at ours',
		alt: 'Worm’s-eye well-rim: two anonymous teal/saffron girls invitation faces; Jumong tiny red grin',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt:
			'Minimal iconic 16:9. WORM’S-EYE from packed earth at the Jolbon well rim. Two anonymous daughters — teal and saffron silks, invitation faces, lean and hike — NOT Sosuno, not dusty-rose, not her face. Tiny Jumong red #e8563f grin. Grey giwa hall a dark bar. ONE device: well-rim as a stone ARC. Black pupils. SFW sexy posing. High contrast. No army. No text. No watermark.'
	},
	{
		id: 'jumong-seq-daughters-grin',
		ratio: 1.778,
		tone: '#e8563f',
		nsfw: false,
		at: 'He grins at the wrong well',
		alt: 'Dutch OTS: Jumong red grin filling the frame; teal/saffron girls posing at the well behind',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt:
			'Minimal iconic 16:9. DUTCH OTS. Jumong FACE from attached filling foreground, easy red #e8563f grin, not grim. Midground: anonymous teal and saffron daughters posing at the SAME Jolbon well (beam, two buckets, packed earth, grey giwa). NOT Sosuno clones. ONE device: his grin as the near plane; well as creamy bokeh. Black pupils. SFW. High contrast. No text. No watermark.'
	},
	{
		id: 'sosuno-seq-kick-well-dutch',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: false,
		at: 'Get. Off.',
		alt: 'Dutch wedge: Sosuno dusty-rose kicking teal/saffron off the Jolbon well; Jumong still grinning',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		prompt:
			'Minimal iconic 16:9. DUTCH WEDGE. Sosuno FACE AND dusty-rose garments from attached, bird binyeo matching attached, kicking anonymous teal/saffron daughters OFF the SAME Jolbon well. Packed earth, grey giwa, timber beam, two buckets. Jumong tiny red #e8563f still grinning. ONE device: her dusty-rose sleeve as a hard DIAGONAL. Black pupils. High contrast. SFW. No text. No watermark.'
	}
];

function upsertSlot(slot) {
	const i = jumong.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) jumong.images[i] = { ...jumong.images[i], ...slot };
	else jumong.images.push(slot);
}

for (const s of [...yuhwaSlots, ...daughterSlots]) upsertSlot(s);

function insertAfterHtml(needle, blocks) {
	if (jumong.blocks.some((b) => b.html === blocks[0].html || b.en?.[0] === blocks[0].en?.[0])) return;
	const i = jumong.blocks.findIndex((b) => b.kind === 'p' && String(b.html).includes(needle));
	if (i < 0) throw new Error(`missing p ${needle}`);
	jumong.blocks.splice(i + 1, 0, ...blocks);
}

insertAfterHtml('From his shoulder: her ice-blue back on copper', [
	{
		kind: 'p',
		nsfw: true,
		html: '<b>Look back if you want it.</b> She does. Wet ice-blue hiked; the hips are the picture; the mouth is a dare.',
		ko: '<b>보고 싶으면 돌아봐요.</b> 돌아본다. 젖은 얼음빛이 걷히고, 엉덩이가 그림이고, 입은 내기.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: '#8fc4e0',
		person: 'yuhwa',
		lines: ['뒤로 보지 마요—', '아니, 봐요. 거기.', ' hiked— 아니, 이거.'],
		en: ['Don’t look from behind—', 'No. Look. There.', 'The hike. This.']
	},
	{
		kind: 'p',
		nsfw: true,
		html: '<b>She hikes the ice-blue from behind.</b> Dutch. The copper takes the rest of the light.',
		ko: '<b>뒤에서 얼음빛을 걷는다.</b> 더치. 구리가 남은 빛을 가져간다.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: '<b>He grabs the wet silk at her hip.</b> Open mouth. Not serene. Gold as a plane.',
		ko: '<b>그가 허리의 젖은 비단을 잡는다.</b> 입 벌리고. 고요하지 않다. 금은 면.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: '#7fc4e8',
		person: 'haemosu',
		lines: ['야. 여기.', '손 빼지 마.', '더—'],
		en: ['Hey. Here.', 'Don’t take your hand off.', 'More—']
	},
	{
		kind: 'p',
		nsfw: true,
		html: '<b>Worm’s-eye: her hips own the copper.</b> The floor looks up. She does not cover.',
		ko: '<b>웜즈아이: 엉덩이가 구리를 가진다.</b> 바닥이 올려다본다. 가리지 않는다.'
	}
]);

// Fix the accidental English in Korean line
const badKo = jumong.blocks.find(
	(b) => b.kind === 'dialogue' && Array.isArray(b.lines) && b.lines.some((l) => String(l).includes('hiked'))
);
if (badKo) {
	badKo.lines = ['뒤로 보지 마요—', '아니, 봐요. 거기.', '이거. 걷은 거.'];
	badKo.en = ['Don’t look from behind—', 'No. Look. There.', 'This. The hike.'];
}

insertAfterHtml('They hitch at his well.', [
	{
		kind: 'dialogue',
		chip: '#2aa89a',
		en: ['Hip first on the beam.', 'Don’t look at the bucket.', 'Look.'],
		lines: ['들보에 엉덩이부터.', '두레박 보지 마.', '여기.']
	},
	{
		kind: 'dialogue',
		chip: '#d4a017',
		en: ['She hikes it like a dare.', 'Come fetch at ours.', 'Ours is nicer. Stay.'],
		lines: ['이렇게 걷으면— 내기야.', '우리 우물로 와.', '우리 게 더 예뻐. 있어.']
	},
	{
		kind: 'p',
		html: 'He does the sun-grin anyway. The well is hers and he grins at the wrong one. <b>He grins at the wrong well.</b>',
		ko: '그래도 해 웃음을 한다. 우물은 그녀 것인데 틀린 우물에 웃는다. <b>틀린 우물에 웃는다.</b>'
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['Hi.', 'I— rope. Just the rope.', 'They’re— yeah. Funny.'],
		lines: ['안녕.', '난— 줄. 줄만.', '걔네— 그래. 웃기네.']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: ['Get. Off.', 'That’s my worker. My well.', 'If you hike it here I count spears.'],
		lines: ['꺼. 져.', '내 일꾼이야. 내 우물이야.', '여기서 걷으면 창 센다.']
	}
]);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

let seq = fs.readFileSync(SEQ, 'utf8');
if (!seq.includes('nsfw-yuhwa-lookback-hips')) {
	seq = seq.replace(
		`{ id: 'nsfw-yuhwa-ots-copper-back', role: 'OTS back', angle: 'OTS', at: 'From his shoulder: her ice-blue back on copper' },`,
		`{ id: 'nsfw-yuhwa-ots-copper-back', role: 'OTS back', angle: 'OTS', at: 'From his shoulder: her ice-blue back on copper' },
			{ id: 'nsfw-yuhwa-lookback-hips', role: 'flirty backshot', angle: 'OTS hips', at: 'Look back if you want it.' },
			{ id: 'nsfw-yuhwa-dutch-hike-back', role: 'dutch hike back', angle: 'dutch behind', at: 'She hikes the ice-blue from behind' },
			{ id: 'nsfw-haemosu-grab-yuhwa-back', role: 'feral grab', angle: 'OTS grab', at: 'He grabs the wet silk at her hip' },
			{ id: 'nsfw-yuhwa-worm-hips', role: 'worm hips', angle: 'worm’s-eye', at: 'Worm’s-eye: her hips own the copper' },`
	);
}
if (!seq.includes('jumong-seq-daughters-lean')) {
	seq = seq.replace(
		`{ id: 'jumong-seq-daughters-pose', role: 'hitch at the well', angle: 'dutch well', at: 'They hitch at his well.' },
			{ id: 'sosuno-seq-kick-out', role: 'kicks them off', angle: 'dutch wedge', at: 'Get off my well.' },`,
		`{ id: 'jumong-seq-daughters-pose', role: 'hitch at the well', angle: 'dutch well', at: 'They hitch at his well.' },
			{ id: 'jumong-seq-daughters-lean', role: 'hip-first lean', angle: 'dutch beam', at: 'Hip first on the beam' },
			{ id: 'jumong-seq-daughters-hike', role: 'hike dare', angle: 'OTS hike', at: 'She hikes it like a dare' },
			{ id: 'jumong-seq-daughters-invite', role: 'invitation faces', angle: 'worm’s-eye rim', at: 'Come fetch at ours' },
			{ id: 'jumong-seq-daughters-grin', role: 'sun-grin', angle: 'dutch OTS grin', at: 'He grins at the wrong well' },
			{ id: 'sosuno-seq-kick-out', role: 'kicks them off', angle: 'dutch wedge', at: 'Get off my well.' },
			{ id: 'sosuno-seq-kick-well-dutch', role: 'Get. Off.', angle: 'dutch kick', at: 'Get. Off.' },`
	);
}
fs.writeFileSync(SEQ, seq);
console.log('patched story + sequences');
