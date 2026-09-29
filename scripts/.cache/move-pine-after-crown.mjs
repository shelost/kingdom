import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const ch = Object.values(story).find((c) => c.entries?.some((e) => e.title === 'Jumong'));
const entry = ch.entries.find((e) => e.title === 'Jumong');
if (!entry) throw new Error('Jumong entry missing');

const pineStart = entry.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Pine Kingdom');
const wealth = entry.blocks.findIndex(
	(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.startsWith('Her wealth still buys')
);
const cavern = entry.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Dawn in the Cavern');
if (pineStart < 0 || wealth < 0 || cavern < 0) {
	throw new Error(`markers: pine=${pineStart} wealth=${wealth} cavern=${cavern}`);
}

const HOUSE =
	'EVERY FRAME A PAINTING: compose as a master canvas — one geometry or one body owns the frame; light is the plot; negative space is ink; not coverage, not a tourist postcard, not a game-map. 2D animated cel-painterly cinema, not photoreal, not live-action, not 3D CGI. Same film stock: anamorphic movie frame, shallow DOF, creamy bokeh, rack-focus, film grain. A CAMERA in a real Korean place — NEVER a graphic poster, split-screen collage, 3D archviz, black-triangle overlay, spotlight cone deleting the landscape, or neon outline. NO halo, bloom, glow, rim-aura, or god-ray envelope around people — light is a plane or a hard key. FACE AND GARMENTS from the attached portrait — NEVER copy the portrait stance, clasped hands, 3/4 fashion lineup, or a standing clone. Invent a new DRAMATIC body every still (mid-stride, kneel, dutch, worm’s-eye, lower-third). CINEMATOGRAPHY: dutch, crane, worm’s-eye, over-shoulder, rack focus, shallow DOF / bokeh, chiaroscuro. HIGH CONTRAST: crushed blacks + one hard key + long shadows — not even daylight wash. ICONIC MINIMAL: ONE architectural device a lens can see; empty negative space; tiny figures or lower-third; the world stays in the shot. COLOR SYMBOLISM: hex is lighting / a plane / one accent — NEVER recolor portrait garments gold. Real Korean architecture: grey giwa, timber, packed earth. No army. No readable text. No watermark.';

const pineBlocks = [
	{ kind: 'scene', label: 'The Pine Kingdom', ko: '소나무 나라' },
	{
		kind: 'p',
		html: 'He is already king when the next pine-roof sends a runner with a story the man thinks is small. Cord on the brow. Queen on the porch. Then three Buyeo mouths under timber that is not Tabal’s. Names that match. <b>Oi, Mari, and Hyupbo did not vanish.</b> <b>They reached the Pine Kingdom</b> — 소나무 나라; the ledgers write 松國 if they must write hanja, and nobody in the yard says the later son’s name for it.',
		ko: '이미 왕인 다음에야 옆 솔지붕 심부름꾼이 작은 이야기인 줄 알고 입을 연다. 이마의 끈. 누대의 왕비. 그다음, 타발 것이 아닌 나무 아래 부여 입 셋. 이름이 맞다. <b>오이, 마리, 협보는 사라지지 않았다.</b> <b>소나무 나라에 닿아 있었다.</b> 장부에 한자를 써야 하면 松國이라고 쓰고, 마당에서는 뒷날 아들의 이름으로 그 나라를 부르지 않는다.'
	},
	{
		kind: 'dialogue',
		chip: '#a97c4a',
		person: 'yeontabal',
		lines: [
			'솔지붕에서 온 애 말이야.',
			'부여 입 셋. 손님처럼 들여놓고 안 내보낸대.',
			'이름— 오이. 마리. 여분 시위 들고 다니던 애.'
		],
		en: [
			'Runner from the pines this morning.',
			'Three Buyeo mouths. Taken in like guests who don’t get to leave.',
			'Names— Oi. Mari. The one with the spare string.'
		]
	},
	{
		kind: 'dialogue',
		chip: '#e8563f',
		person: 'jumong',
		lines: ['잠깐. 이름 다시.', '살았네.', '그물인 줄 알았어요. 능선이—'],
		en: ['Wait. Say the names again.', 'They’re alive.', 'I thought the net had them. The ridge—']
	},
	{
		kind: 'dialogue',
		chip: '#e8a04a',
		person: 'sosuno',
		lines: [
			'바보처럼 서 있지 마.',
			'왕이면 왕답게. 벗 찾으러 가면 그 지붕까지 가져가야 돼.',
			'골짜기는 그렇게 굴러.',
			'나도 가. 말리지 마. 지붕은 내가 세니까.'
		],
		en: [
			'Don’t just stand there looking stupid.',
			'You’re king. If you want them, you take the roof they’re under.',
			'That’s how a valley works.',
			'I’m coming. Don’t argue. I count roofs.'
		]
	},
	{
		kind: 'dialogue',
		chip: '#e8563f',
		person: 'jumong',
		lines: ['지붕이요.', '이름부터 온 거 아니에요. 진짜로.', '…난간에 서서 세셔도 돼요.'],
		en: ['The roof.', 'I’m not going for the name first. Seriously.', '…You can count from the rail if you want.']
	},
	{
		kind: 'p',
		html: 'He walks to Song Yang’s packed earth as king, not as Tabal’s exile. Queen Sosuno on the pine-yard rail, chin up, counting like fires. Real pines. Grey giwa as a dark bar. The mark-stake is already in the yard as if seniority were a weapon. Jumong is not here to pick a fight about who hatched first. He is here because the friends are under that timber, and <b>the pine roof comes with them</b>. <b>Song Yang will not share the roof</b> — not the three, not the trees — until a shaft says otherwise.',
		ko: '타발의 망명이 아니라 왕으로 송양의 흙에 선다. 왕비 소서노는 솔마당 난간에, 턱 들고, 불 세듯 센다. 진짜 소나무. 회색 기와가 어두운 가로띠. 과녁 말뚝은 이미 마당에 있다. 선후배가 무기인 사람처럼. 주몽은 누가 먼저 알에서 나왔는지 싸우러 온 게 아니다. 벗이 그 나무 아래 있어서 온 것이고, <b>솔지붕은 벗이랑 같이 온다</b>. <b>송양은 지붕을 나누려 하지 않는다</b> — 셋도, 나무도 — 화살이 달리 말할 때까지.'
	},
	{
		kind: 'dialogue',
		chip: '#c4a35a',
		person: 'songyang',
		lines: [
			'이 솔나라는 네가 알에서 나오기 전에 이름이 있었다.',
			'왕끈 차고 손님 노릇 하지 마라.',
			'과녁을 어디에 둘지 내가 정한다.'
		],
		en: [
			'This pine country had a name before you hatched.',
			'Don’t play guest with a cord on your brow.',
			'I set where the mark stands.'
		]
	},
	{
		kind: 'dialogue',
		chip: '#e8a04a',
		person: 'sosuno',
		lines: ['나무 때문에 온 거 아니야.', '능선에서 들어온 셋 때문에야.', '맞으면 내놔. 그게 거래야.'],
		en: ['He’s not here for your trees.', 'He’s here for three men who took the ridge.', 'Yield if he hits. That’s the deal.']
	},
	{
		kind: 'dialogue',
		chip: '#e8563f',
		person: 'jumong',
		lines: [
			'그럼 이름을 과녁에 두시오.',
			'능선에서 들어온 셋입니다. 오이, 마리, 협보.',
			'맞으면— 소나무 나라 지붕을 내놓으시고, 그 셋도.'
		],
		en: [
			'Then put the name on the mark.',
			'Three men came in from the ridge. Oi, Mari, Hyupbo.',
			'If it hits— you yield the pine roof, and them.'
		]
	},
	{
		kind: 'dialogue',
		chip: '#c4a35a',
		person: 'songyang',
		lines: ['한 발이다.', '네가 먼저냐. 내가 먼저냐.', '웃지 마라. 웃으면 아직 손님이다.'],
		en: ['One shot.', 'You first, or me.', 'Don’t grin. Grin and you’re still a guest.']
	},
	{
		kind: 'p',
		html: 'The pine yard hears the wood take it. <b>Song Yang’s arrow is honest and short.</b> Jumong’s is the same fly-wing cruelty the Buyeo stake learned. <b>The contest is one bow, one yard, not an army.</b> The pine-country king looks at the hit the way Daeso used to look at a foundling. On the rail Sosuno does not clap. She already counted.',
		ko: '솔마당이 나무가 받는 소리를 듣는다. <b>송양의 화살은 정직하고 짧다.</b> 주몽의 것은 부여 말뚝이 배운 파리 날개 잔인함이다. <b>겨루는 것은 활 하나, 마당 하나이지 군대가 아니다.</b> 소나무 나라의 왕이 맞은 자리를 본다. 대소가 주워 온 아이를 보던 그 눈으로. 난간의 소서노는 박수치 않는다. 이미 셌다.'
	},
	{
		kind: 'dialogue',
		chip: '#c4a35a',
		person: 'songyang',
		lines: [
			'…졌다.',
			'소나무 나라는 이 지붕 아래다.',
			'셋은 데려가라. 이름은 남겨 둬라. 진 사람은 이름이 필요하니까.'
		],
		en: [
			'…I lost.',
			'The pine country is under this roof.',
			'Take your three. Keep my name. The one who loses still needs one.'
		]
	},
	{
		kind: 'dialogue',
		chip: '#e8563f',
		person: 'jumong',
		lines: ['남깁니다.', '벗 먼저요.', '웃은 거 아닙니다. 진짜로.'],
		en: ['I’ll keep it.', 'Friends first.', 'I wasn’t grinning. Seriously.']
	},
	{
		kind: 'p',
		html: 'Dusk. Mud to the knee, not river-wet. <b>The three come out of the pine hall</b> like men who have been guests too long. The king of Jolbon is standing in someone else’s yard this time, cord still catching the last light, the queen a dusty-crimson stamp on the rail. They look at him like a man who took the stupid fork and lived, and then like a man who came back for them anyway — and then at the cord, as if the joke had gone too far.',
		ko: '해 질 녘. 무릎까지 진흙, 강물기는 아니다. <b>셋이 솔대청에서 나온다</b> — 손님을 너무 오래 한 사람들처럼. 이번엔 졸본의 왕이 남의 마당에 서 있다. 끈이 마지막 빛을 받고, 왕비는 난간에 회진홍 점. 벗들은 바보 갈림길을 택하고도 산 사람을 보듯 보다가, 그래도 데리러 온 사람을 보고 — 그다음 끈을 본다. 농담이 지나간 것처럼.'
	},
	{
		kind: 'dialogue',
		chip: '#7a6b5a',
		person: 'oi',
		lines: ['살았네.', '강은 어떻게 했어.', '아니— 나중에. 잠깐. 그 끈. 너 지금—'],
		en: ['You’re alive.', 'What did you do with the river.', 'No— later. Wait. That cord. Are you—']
	},
	{
		kind: 'dialogue',
		chip: '#e8563f',
		person: 'jumong',
		lines: ['말하면 안 믿을걸.', '너희는?', '능선이야? 졸본에서 기다렸어. 미안.', '절하지 마. 나야. 아직.'],
		en: [
			'If I say it you won’t believe me.',
			'You?',
			'Ridge? I waited in Jolbon. I’m sorry.',
			'Don’t bow. It’s still me.'
		]
	},
	{
		kind: 'dialogue',
		chip: '#e8a04a',
		person: 'sosuno',
		lines: ['절하지 마. 먹어.', '불 세고 난 뒤로 이 바보는 너희만 찾았어.', '그리고 난 왕비니까. 밥은 손님 밥 아니야.'],
		en: [
			'Don’t bow. Eat.',
			'He’s been stupid about you since the fires.',
			'And I’m the queen, so the food is not guest food.'
		]
	},
	{
		kind: 'dialogue',
		chip: '#5c6b6e',
		person: 'mari',
		lines: [
			'동쪽. 그물은 물을 닫더라고.',
			'우리는 닫히지 않는 쪽으로 갔어. 이쪽이 닫히더라.',
			'네 활은 솔잎에 있더라 — 졸본 척후가 자랑하던데. 소문은 여기까지 왔어.'
		],
		en: [
			'East. The net closed on the water.',
			'We took the side that wouldn’t shut. This side did.',
			'Your bow was in the needles — Jolbon scouts were bragging. The story made it here.'
		]
	},
	{
		kind: 'dialogue',
		chip: '#4a5548',
		person: 'hyupbo',
		lines: ['시위는 돌려줄게.', '졸본에서 보자고 했지.', '지금은— 서 있기만 해도 된다.'],
		en: ['I’ll give you the string back.', 'I did say see you in Jolbon.', 'For now— standing is enough.']
	}
];

const stills = {
	'jumong-pine-news': {
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'Oi, Mari, and Hyupbo did not vanish',
		alt: 'Dutch Jolbon porch: King Dongmyung mid-turn hearing the names; Queen Sosuno a crimson stamp on the rail; pines as one vertical',
		refs: ['/ch_dongmyung.png', '/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_yeon_tabal.png'],
		people: ['jumong', 'sosuno', 'yeontabal'],
		prompt:
			'Minimal iconic 16:9 still. Dutch two-shot on a real Jolbon timber porch: grey giwa bar, packed earth, pine trunks as ONE vertical device. King Dongmyung mid-turn, open mouth, FUN not a grim statue — FACE AND GARMENTS from attached ch_dongmyung (gold flame crown, red dragon robe #e8563f, blue panel, black sleeves) NOT the young exile worker portrait. Queen Sosuno on the rail, chin up, counting — FACE AND GARMENTS from attached ch_sosuno_queen (royal gache, crimson dragon robe, jade-gold belt, phoenix pins) NOT dusty-rose village silk; hair ornament matches attached binyeo. Tabal a small khaki stamp in bokeh. ONE of each person. Black pupils, dark Korean irises — NOT blue. #e8563f and #e8a04a as two rims against crushed black. Painterly anime-adjacent cinema. No army. No text. No watermark. ' +
			HOUSE
	},
	'songyang-yard-wide': {
		ratio: 1.778,
		nsfw: false,
		tone: '#c4a35a',
		at: 'They reached the Pine Kingdom',
		alt: 'Bird’s-eye Pine Kingdom: real Korean pines, timber giwa hall as a dark bar, tiny king and queen on packed earth',
		refs: ['/ch_dongmyung.png', '/ch_sosuno_queen.png', '/ch_songyang.png'],
		people: ['jumong', 'sosuno', 'songyang'],
		prompt:
			'Minimal iconic 16:9. Bird’s-eye of a REAL Korean pine country: dense pines, weathered timber hall with grey giwa, packed-earth mark-yard, one stake. Not an abstract forest, not a color-plane. Tiny King Dongmyung red #e8563f (crown suggestion from attached ch_dongmyung) and Queen Sosuno crimson on the rail (ch_sosuno_queen) and Song Yang pine-ochre #c4a35a in the lower third. Hall as a dark bar device. Natural Earth sky, crushed blacks, one hard key. FACE suggestion from attached royal portraits only — not exile Jumong, not worker Sosuno. Black pupils. Painterly anime-adjacent. No army. No text. No watermark. ' +
			HOUSE
	},
	'jumong-songyang-draw': {
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'Then put the name on the mark',
		alt: 'Worm’s-eye: King Dongmyung full-draw grinning; Song Yang a pine-ochre stamp at the stake; queen tiny on the rail',
		refs: ['/ch_dongmyung.png', '/ch_songyang.png', '/ch_sosuno_queen.png'],
		people: ['jumong', 'songyang', 'sosuno'],
		prompt:
			'Minimal iconic 16:9. Worm’s-eye. King Dongmyung full-draw, FUN grin, FACE AND GARMENTS from attached ch_dongmyung gold crown red dragon robe #e8563f — NOT exile jumong. Song Yang older chieftain FACE from attached ch_songyang, pine-ochre #c4a35a court silk, standing too close to the mark-stake. Queen Sosuno a tiny crimson rail-stamp from ch_sosuno_queen, not dusty-rose. SAME pine packed-earth yard, real pines, giwa bar. ONE device: the bow as a hard black arc. Black pupils, dark Korean irises. High contrast chiaroscuro. No army. No text. No watermark. ' +
			HOUSE
	},
	'songyang-shot-short': {
		ratio: 1.778,
		nsfw: false,
		tone: '#c4a35a',
		at: 'Song Yang’s arrow is honest and short',
		alt: 'Dutch 16:9: Song Yang after the honest short shot; stake in bokeh; pine trunks as verticals',
		refs: ['/ch_songyang.png'],
		people: ['songyang'],
		prompt:
			'Minimal iconic 16:9. Dutch. Song Yang FACE from attached ch_songyang, older Korean chieftain, black pupils, after-release, not a catalog pose. Pine-ochre #c4a35a as rim — not gold-plate. Mark-stake creamy bokeh. SAME pine packed earth, real pines, timber giwa. ONE device: the short arrow as a failed horizontal. High contrast chiaroscuro. No army. No text. No watermark. ' +
			HOUSE
	},
	'jumong-songyang-win': {
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'The pine country is under this roof',
		alt: 'OTS: Song Yang yielding; King Dongmyung tiny crowned red at the far mark; queen on the rail; giwa a dark bar',
		refs: ['/ch_songyang.png', '/ch_dongmyung.png', '/ch_sosuno_queen.png'],
		people: ['songyang', 'jumong', 'sosuno'],
		prompt:
			'Minimal iconic 16:9. Over-shoulder Song Yang yielding, FACE from attached ch_songyang. King Dongmyung a small crowned red figure at the far mark-stake, grin, FACE from attached ch_dongmyung NOT exile. Queen Sosuno tiny crimson on the rail from ch_sosuno_queen. SAME pine yard, giwa bar. ONE device: empty packed-earth as a plane. #c4a35a and #e8563f as two accents. Black pupils. No army. No text. No watermark. ' +
			HOUSE
	},
	'jumong-friends-jolbon': {
		ratio: 1.778,
		nsfw: false,
		tone: '#a97c4a',
		at: 'the three come out of the pine hall',
		alt: 'Dutch dusk pine-hall gate: three muddy friends coming out; King Dongmyung a small crowned red grin; queen on the rail',
		refs: ['/ch_dongmyung.png', '/ch_sosuno_queen.png', '/bn_sosuno.png'],
		people: ['oi', 'mari', 'hyupbo', 'jumong', 'sosuno'],
		prompt:
			'Minimal iconic 16:9. Dutch dusk gate of a real Korean pine-country timber hall, giwa roof, packed earth. Three muddy friends in anonymous earth-tone silks coming OUT of the hall — faces not cloned from Jumong, not portrait plates, no invented celebrity faces, silhouettes/backs/shadows OK. King Dongmyung a small crowned red #e8563f grin in the lower third, FACE from attached ch_dongmyung only — gold crown, red dragon robe, NOT exile worker. Queen Sosuno a crimson rail-stamp, FACE from ch_sosuno_queen, binyeo from attached. Gate as a dark rectangle device. Reunion after the annex, not an arrival at Jolbon. Black pupils. Painterly anime-adjacent. No army. No text. No watermark. ' +
			HOUSE
	}
};

if (pineStart < cavern) {
	throw new Error('expected pine currently AFTER cavern');
}

const oldPine = entry.blocks.splice(pineStart, wealth - pineStart);
void oldPine;
const cavernNow = entry.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Dawn in the Cavern');
entry.blocks.splice(cavernNow, 0, ...pineBlocks);

for (const im of entry.images ?? []) {
	if (stills[im.id]) Object.assign(im, stills[im.id]);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

const pineNow = entry.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Pine Kingdom');
const cavernAfter = entry.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Dawn in the Cavern');
const doorNow = entry.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Behind the Door');
console.log({ doorNow, pineNow, cavernAfter, pineLen: pineBlocks.length });
