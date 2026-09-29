import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const entry = Object.values(story)
	.flatMap((ch) => ch.entries ?? [])
	.find((e) => e.title === 'Jumong');
if (!entry) throw new Error('Jumong entry missing');

const idx = (pred) => {
	const i = entry.blocks.findIndex(pred);
	if (i < 0) throw new Error('block not found');
	return i;
};

const slot = (im) => {
	const i = entry.images.findIndex((x) => x.id === im.id);
	if (i >= 0) entry.images[i] = { ...entry.images[i], ...im };
	else {
		const after = entry.images.findIndex((x) => x.id === 'jumong-seq-buyeo-wide');
		entry.images.splice(after >= 0 ? after + 1 : entry.images.length, 0, im);
	}
};

const house =
	'EVERY FRAME A PAINTING: compose as a master canvas — one geometry or one body owns the frame; light is the plot; negative space is ink. 2D animated cel-painterly cinema, not photoreal. Anamorphic movie frame, shallow DOF, creamy bokeh, rack-focus, film grain. LOCK architecture to the attached Buyeo yard plate: packed earth, grey-giwa timber hall as a dark bar, timber palisade, iron-boss doors, thin river at the far edge, natural dusk sky. NO halo, bloom, glow. FACE AND GARMENTS from attached portraits — NEVER copy portrait stance. Invent a new DRAMATIC body. HIGH CONTRAST chiaroscuro. No army. No palace furniture dump. No readable text. No watermark.';

slot({
	id: 'jumong-seq-buyeo-wide',
	ratio: 1.778,
	nsfw: false,
	tone: '#a89a72',
	at: 'The Buyeo yard is a timber country',
	alt: 'Bird’s-eye dusk: Northern Buyeo packed-earth yard, grey-giwa timber hall as a dark bar, river ribbon, Geumwa a tiny red-burgundy figure mid-stride',
	refs: ['/pl_buyeo_yard.png', '/ch_geumwa.png'],
	people: ['geumwa'],
	prompt:
		'Minimal iconic 16:9 still. Bird’s-eye dutch dusk. SAME Northern Buyeo yard as the attached place plate. Geumwa a tiny lower-third figure mid-stride in red-burgundy court silk and gold crown from the attached portrait — FACE ONLY, new body. ONE device: the giwa hall as a dark horizontal bar. #a89a72 as a single bronze-olive stamp on packed earth. Natural Earth sky. ' +
		house
});

slot({
	id: 'jumong-buyeo-egg',
	ratio: 1.778,
	nsfw: false,
	tone: '#8fc4e0',
	at: 'Yuhwa lays a great egg',
	alt: 'Dutch timber room: Yuhwa kneeling over a pale egg on packed earth, Geumwa a dark doorway stamp',
	refs: ['/pl_buyeo_yard.png', '/ch_yuhwa.png', '/ch_geumwa.png'],
	people: ['yuhwa', 'geumwa'],
	prompt:
		'Minimal iconic 16:9 still. Dutch low in a Northern Buyeo timber room opening onto the attached yard. Adult Yuhwa kneeling, FACE from attached portrait, wearing pale ice-blue court silk (NOT the bathing wrap, NOT nude). A large pale egg on packed earth as ONE device: the egg is a hard oval occupying the lower third. Geumwa a silhouette stamp in the doorway, gold crown, red-burgundy silk. Ice-blue #8fc4e0 as a thin rim on her sleeve. Crushed blacks, one lamp key. ' +
		house
});

slot({
	id: 'jumong-buyeo-hatch',
	ratio: 0.75,
	nsfw: false,
	tone: '#e8563f',
	at: 'out of the egg comes a boy',
	alt: 'ECU cracked pale egg; a small boy’s face in the split, one red #e8563f seam',
	refs: ['/ch_jumong.png', '/ch_yuhwa.png'],
	people: ['jumong', 'yuhwa'],
	prompt:
		'Intimate 3:4 still. ECU of a cracked pale egg on timber. ONE device: a single red #e8563f seam splitting the shell. A small boy’s face in the crack — FACE suggestion from Jumong’s attached portrait (younger, no goatee, no red headband yet), not a standing clone. Yuhwa’s ice-blue sleeve as creamy bokeh at the edge. Faces want: curious, not serene. No text. ' +
		house
});

slot({
	id: 'jumong-buyeo-boys',
	ratio: 1.778,
	nsfw: false,
	tone: '#e8563f',
	at: 'grows up with his brothers',
	alt: 'Worm’s-eye Buyeo yard: three boys mid-draw at one mark-stake, Jumong grinning, Daeso too close, Galsa delayed',
	refs: ['/pl_buyeo_yard.png', '/ch_jumong.png', '/ch_daeso.png', '/ch_galsa.png'],
	people: ['jumong', 'daeso', 'galsa'],
	prompt:
		'Minimal iconic 16:9 still. Worm’s-eye in the SAME attached Buyeo yard. THREE boys at ONE mark-stake — never clone anyone twice. Younger Jumong FACE from attached portrait (no adult goatee), red silk, grinning mid-draw. Daeso FACE from attached portrait, blue headband, standing too close, not clapping. Galsa FACE from attached portrait, sage silk, smile shrinking on a delay. ONE device: the mark-stake as a vertical black line. Jumong #e8563f as the single accent on the loosed string. Dramatic poses, not a fashion lineup. ' +
		house
});

slot({
	id: 'jumong-buyeo-fly',
	ratio: 1.778,
	nsfw: false,
	tone: '#e8563f',
	at: 'find a fly’s wing with an arrow',
	alt: 'Shallow DOF: Jumong full-draw, a fly’s wing pinned to the mark-stake, Daeso’s blue sleeve crushed in bokeh',
	refs: ['/pl_buyeo_yard.png', '/ch_jumong.png', '/ch_daeso.png'],
	people: ['jumong', 'daeso'],
	prompt:
		'Minimal iconic 16:9 still. Rack-focus ECU-to-mid. SAME attached Buyeo yard. Jumong full-draw, FACE from attached portrait, laid-back grin, red headband, red silk. ONE device: a tiny fly’s wing pinned to the mark-stake in sharp foreground. Daeso’s blue sleeve a crushed-black mass in creamy bokeh. #e8563f as the arrow-line. No army. ' +
		house
});

slot({
	id: 'jumong-buyeo-knife',
	ratio: 1.778,
	nsfw: false,
	tone: '#9b8f6a',
	at: 'One night Jumong slips an assassination',
	alt: 'Dutch night corridor: blade as a hard black line, Jumong ducking, one lamp, empty timber',
	refs: ['/pl_buyeo_yard.png', '/ch_jumong.png', '/ch_daeso.png'],
	people: ['jumong', 'daeso'],
	prompt:
		'Minimal iconic 16:9 still. Extreme dutch night interior of the SAME Buyeo timber hall. ONE device: a blade as a hard black vertical line top-to-bottom. Jumong ducking mid-stride, FACE from attached portrait, red silk catching one lamp. Assassin anonymous — no portrait face, dark sleeve only. Daeso a tiny blue stamp at the far colonnade, watching, not swinging. Crushed blacks. #9b8f6a as dusty bronze-olive floor plane. Natural night, no glow. ' +
		house
});

slot({
	id: 'jumong-buyeo-four',
	ratio: 1.778,
	nsfw: false,
	tone: '#e8563f',
	at: 'the four go south',
	alt: 'Night gate of Buyeo: Jumong mid-stride through iron-boss doors, three friends as lower-third silks, pines beyond',
	refs: ['/pl_buyeo_yard.png', '/ch_jumong.png'],
	people: ['jumong', 'oi', 'mari', 'hyupbo'],
	prompt:
		'Minimal iconic 16:9 still. Low dutch night. SAME attached Buyeo yard — iron-boss timber doors as ONE device, a dark rectangle cracked open. Jumong mid-stride through the gap, FACE from attached portrait, red silk #e8563f, grin gone serious. THREE friends as lower-third silks only (anonymous faces, not clones of Jumong): brown, grey, moss — Oi already ahead, Mari counting the gate, Hyupbo with a spare bowstring. No army. Pines as a net beyond. ' +
		house
});

const j04 = entry.images.find((x) => x.id === 'jumong_04');
if (j04) j04.at = 'take the hills with him';

const j02 = entry.images.find((x) => x.id === 'jumong_02');
if (j02) j02.at = 'Yuhwa lays a great egg';

const iStart = idx(
	(b) => b.kind === 'p' && String(b.html).includes('lays a great egg')
);
const iEnd = idx(
	(b) => b.kind === 'p' && String(b.html).includes('One night Jumong slips an assassination')
);

const blocks = [
	{ kind: 'scene', label: 'The Egg', ko: '알' },
	{
		kind: 'p',
		html: 'In time <b>Yuhwa lays a great egg</b>. The court wants a category. <b>Jashin</b> files it before anyone decides whether to smash it. Geumwa does not smash it. He sets a room, and the egg sits in the room like a guest who will not give a name.',
		ko: '때가 되어 <b>유화는 커다란 알을 낳는다</b>. 조정은 분류를 원한다. <b>자신</b>은 깨기 전에 먼저 기록한다. 금와는 깨지 않는다. 방을 내주고, 알은 이름 안 대는 손님처럼 그 방에 앉아 있다.'
	},
	{
		kind: 'dialogue',
		chip: '#9b2d2d',
		person: 'buyeojashin',
		lines: ['알도 기록입니다.', '깨면, 깨진 기록이 됩니다.'],
		en: ['An egg is still a record.', 'Smash it, and you file a smash.']
	},
	{
		kind: 'dialogue',
		chip: '#a89a72',
		person: 'geumwa',
		lines: ['두어라.', '마당은 비어 있다.'],
		en: ['Leave it.', 'The yard has space.']
	},
	{
		kind: 'dialogue',
		chip: '#8fc4e0',
		person: 'yuhwa',
		lines: ['이름 짓지 마세요.', '아직— 손님이잖아요.'],
		en: ['Don’t name it.', 'It’s still— a guest.']
	},
	{
		kind: 'p',
		html: 'Then the shell goes. <b>Out of the egg comes a boy</b> who can find a fly’s wing with an arrow before he can properly walk. They name him <b>Jumong</b> — the good shot — because in those days people were named for what heaven had plainly already decided.',
		ko: '그리고 껍질이 간다. <b>알에서 사내아이가 나온다</b>. 제대로 걷기도 전에 화살로 파리의 날개를 맞히는 아이다. 사람들은 아이를 <b>주몽</b> — 활 잘 쏘는 이 — 이라 이름 짓는다. 그 시절에는 하늘이 이미 정해 둔 것을 따라 이름을 지었기 때문이다.'
	},
	{
		kind: 'dialogue',
		chip: '#a89a72',
		person: 'geumwa',
		lines: ['주몽이다.', '활이 먼저 왔다.'],
		en: ['Jumong.', 'The bow got here first.']
	},
	{ kind: 'scene', label: 'The Brothers', ko: '형제' },
	{
		kind: 'p',
		html: 'He <b>grows up with his brothers</b> <b>Daeso</b> and <b>Galsa</b> in the same packed-earth yard. Same mark-stake. Same grey-giwa bar of a hall. The better he shoots, the smaller their smiles become. Daeso stands too close. Galsa’s laugh arrives a breath late, then not at all.',
		ko: '주몽은 같은 흙마당에서 형 <b>대소</b>, <b>갈사</b>와 <b>함께 자란다</b>. 같은 과녁 말뚝. 같은 회색 기와 대청. 활솜씨가 늘수록 형들의 웃음은 줄어든다. 대소는 너무 가까이 선다. 갈사의 웃음은 한 박자 늦게 오다가, 이내 안 온다.'
	},
	{
		kind: 'dialogue',
		chip: '#9b8f6a',
		person: 'daeso',
		lines: ['다시.', '말뚝이 가깝다.', '네가 가까운 게 아니라.'],
		en: ['Again.', 'The stake is close.', 'Not you. The stake.']
	},
	{
		kind: 'dialogue',
		chip: '#e8563f',
		person: 'jumong',
		lines: ['형이 앞에 서서 그래요.', '뒤로— 한 발.'],
		en: ['You’re standing in front, hyung.', 'Back— one step.']
	},
	{
		kind: 'dialogue',
		chip: '#6b8f4a',
		person: 'galsa',
		lines: ['맞으면 친다.', '지금은— 아직.'],
		en: ['If it lands, I’ll clap.', 'Not yet.']
	},
	{
		kind: 'p',
		html: 'He can <b>find a fly’s wing with an arrow</b>. The yard hears the wood take it. Daeso does not clap. A horse goes missing from Jumong’s stall and turns up under the heir’s saddle. A hunt is called on a day the wind is wrong. Jumong still grins, because grinning is cheaper than asking why.',
		ko: '그는 <b>화살로 파리의 날개를 맞힌다</b>. 마당이 나무가 받는 소리를 듣는다. 대소는 박수치지 않는다. 주몽의 마구간에서 말이 사라지고 태자의 안장 아래 나타난다. 바람 나쁜 날에 사냥이 걸린다. 주몽은 그래도 웃는다. 왜냐고 묻는 것보다 웃음이 싸니까.'
	},
	{
		kind: 'dialogue',
		chip: '#e8563f',
		person: 'jumong',
		lines: ['말— 가져가셨네.', '사냥은 내일로 하죠.', '오늘은 파리가 더 재밌어요.'],
		en: ['Horse— you took it.', 'Hunt tomorrow.', 'The fly’s more fun today.']
	},
	{
		kind: 'dialogue',
		chip: '#9b8f6a',
		person: 'daeso',
		lines: ['웃지 마.', '이 집이 너를 먹인다.'],
		en: ['Stop smiling.', 'This house feeds you.']
	},
	{ kind: 'scene', label: 'The Mark', ko: '과녁' },
	{
		kind: 'p',
		html: 'The Buyeo yard keeps a mark-stake for princes. <b>Daeso</b> stands too close when Jumong’s arrow lands. He does not clap. <b>Galsa</b>’s smile shrinks on a delay — second-son arithmetic, not the heir’s shout.',
		ko: '부여 마당에는 왕자용 과녁 말뚝이 있다. 주몽의 화살이 꽂히면 <b>대소</b>는 너무 가까이 서 있다. 박수는 치지 않는다. <b>갈사</b>의 웃음은 한 박자 늦게 줄어든다 — 둘째의 셈이지, 태자의 고함이 아니다.'
	},
	{
		kind: 'dialogue',
		chip: '#9b8f6a',
		person: 'daeso',
		lines: ['먹여 주는 집보다 멀리 쏘지 마라.'],
		en: ['Do not outshoot the house that feeds you.']
	},
	{
		kind: 'dialogue',
		chip: '#e8563f',
		person: 'jumong',
		lines: ['그럼 과녁을 더 멀리 두시오.'],
		en: ['Then put the mark farther.']
	},
	{
		kind: 'dialogue',
		chip: '#6b8f4a',
		person: 'galsa',
		lines: ['맞으면, 치려던 거다.'],
		en: ['If it lands, I meant to applaud.']
	},
	{
		kind: 'p',
		html: '<b>Galsa</b> will not stay to be the second smile in that hall. East of Buyeo he splits a smaller country and names it for himself — Galsa-Buyeo.',
		ko: '<b>갈사</b>는 그 대청의 두 번째 웃음으로 남지 않는다. 부여 동쪽에서 작은 나라를 가르고 자기 이름을 붙인다 — 갈사부여.'
	},
	{ kind: 'scene', label: 'The Knife', ko: '칼' },
	{
		kind: 'p',
		html: '<b>One night Jumong slips an assassination.</b> A blade in the colonnade that should have been a servant. He ducks. The lamp keeps burning. In the morning Daeso asks if he slept. Jumong says yes, because the other answer is a war in a hallway.',
		ko: '<b>어느 밤, 주몽은 암살을 간신히 피한다.</b> 하인이어야 할 회랑에 칼이 있다. 숙인다. 등잔은 그대로 탄다. 아침이 되면 대소가 잠은 잤느냐고 묻는다. 주몽은 잤다고 한다. 다른 대답은 회랑에서의 전쟁이니까.'
	},
	{
		kind: 'dialogue',
		chip: '#9b8f6a',
		person: 'daeso',
		lines: ['잘 잤나.', '꿈은— 없었지.'],
		en: ['You slept.', 'No dreams.']
	},
	{
		kind: 'dialogue',
		chip: '#e8563f',
		person: 'jumong',
		lines: ['잘 잤소.', '칼은 꿈이 아니더군요.'],
		en: ['I slept.', 'The knife wasn’t a dream.']
	},
	{
		kind: 'dialogue',
		chip: '#9b2d2d',
		person: 'buyeojashin',
		lines: ['기록에 칼은 없습니다.', '태자께서 묻기 전에— 남쪽으로.'],
		en: ['There is no knife on the record.', 'South. Before the heir asks twice.']
	},
	{ kind: 'scene', label: 'The Four', ko: '넷' },
	{
		kind: 'p',
		html: 'He whispers something to his wife, <b>Lady Ye</b>, and goes. A lamp. A half-sword left where a boy will later dig. She does not follow. She was never going to. His friends <b>Oi</b>, <b>Mari</b>, and <b>Hyupbo</b> take the hills with him. <b>The four go south.</b>',
		ko: '아내 <b>예씨부인</b>에게 무언가를 속삭이고 간다. 등잔. 나중에 아이가 팔 자리에 남긴 반쪽 칼. 그녀는 따라가지 않는다. 원래 안 갈 사람이었다. 벗 <b>오이</b>, <b>마리</b>, <b>협보</b>가 그와 함께 산으로 달아난다. <b>넷이 남쪽으로 간다.</b>'
	},
	{
		kind: 'dialogue',
		chip: '#d98fa8',
		person: 'ladyye',
		lines: ['말해.', '아니— 말고.', '칼만 남겨.'],
		en: ['Say it.', 'No— don’t.', 'Leave the sword.']
	},
	{
		kind: 'dialogue',
		chip: '#e8563f',
		person: 'jumong',
		lines: ['반쪽이다.', '나머지는— 나중에.', '문 열어 둬.'],
		en: ['It’s half.', 'The rest— later.', 'Leave the door.']
	},
	{
		kind: 'dialogue',
		chip: '#7a6b5a',
		person: 'oi',
		lines: ['남쪽.', '세지 못하게.', '지금.'],
		en: ['South.', 'Before they count us.', 'Now.']
	},
	{
		kind: 'dialogue',
		chip: '#5c6b6e',
		person: 'mari',
		lines: ['문이 조용한데.', '조용한 게 더 나빠.', '칼은 진짜였어.'],
		en: ['Gate’s quiet.', 'Quiet’s worse.', 'The knife was real.']
	},
	{
		kind: 'dialogue',
		chip: '#4a5548',
		person: 'hyupbo',
		lines: ['여분 시위 가져왔어.', '활은— 네 거.'],
		en: ['I brought the spare string.', 'Bow’s— yours.']
	},
	{
		kind: 'p',
		html: 'Behind them: Buyeo troops <b>Daeso</b> sent — not a hunt so much as a closing net. <b>The forest is a closing net.</b> <b>The pines are a net from above.</b>',
		ko: '뒤로는 <b>대소</b>가 보낸 부여의 기병 — 사냥이라기보다, 그물을 조이는 일. <b>숲이 그물이다.</b> <b>소나무는 위에서 그물이다.</b>'
	}
];

entry.blocks.splice(iStart, iEnd - iStart + 1, ...blocks);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched Jumong Buyeo', blocks.length, 'blocks; images', entry.images.filter((x) => String(x.id).includes('buyeo') || x.id.startsWith('jumong-buyeo')).map((x) => x.id).join(', '));
