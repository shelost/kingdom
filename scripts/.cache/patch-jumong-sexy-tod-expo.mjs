// Add Jumong sexy-pose + time-of-day expo slots; bury `at` in existing blocks.
import fs from 'node:fs';
import path from 'node:path';

const STORY = 'src/lib/data/story.json';
const SEQ = 'src/lib/movieSequences.ts';
const SUFFIX =
	'EVERY FRAME A PAINTING: compose as a master canvas — one geometry or one body owns the frame; light is the plot; negative space is ink; not coverage, not a tourist postcard, not a game-map. 2D animated cel-painterly cinema, not photoreal, not live-action, not 3D CGI. Same film stock: anamorphic movie frame, shallow DOF, creamy bokeh, rack-focus, film grain. A CAMERA in a real Korean place — NEVER a graphic poster, split-screen collage, 3D archviz, black-triangle overlay, spotlight cone deleting the landscape, or neon outline. NO halo, bloom, glow, rim-aura, or god-ray envelope around people — light is a plane or a hard key. FACE AND GARMENTS from the attached portrait — NEVER copy the portrait stance, clasped hands, 3/4 fashion lineup, or a standing clone. Invent a new DRAMATIC body every still (mid-stride, kneel, dutch, worm’s-eye, lower-third). CINEMATOGRAPHY: dutch, crane, worm’s-eye, over-shoulder, rack focus, shallow DOF / bokeh, chiaroscuro. HIGH CONTRAST: crushed blacks + one hard key + long shadows — not even daylight wash. ICONIC MINIMAL: ONE architectural device a lens can see; empty negative space; tiny figures or lower-third; the world stays in the shot. COLOR SYMBOLISM: hex is lighting / a plane / one accent — NEVER recolor portrait garments gold. Real Korean architecture: grey giwa, timber, packed earth. No army. No readable text. No watermark.';

const slots = [
	{
		id: 'yuhwa-amnok-kneel-look',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Yuhwa kneels in the shallows',
		alt: 'Intimate: Yuhwa kneeling in Amnok shallows, chin up, wanting face, wet ice-blue silk',
		people: ['yuhwa'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_white_river.png']
	},
	{
		id: 'yuhwa-amnok-rinse-lookback',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'She rinses the river from her hair',
		alt: 'Intimate: Yuhwa rinsing wet hair in the Amnok, look-aside, off-shoulder ice-blue silk',
		people: ['yuhwa'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_white_river.png']
	},
	{
		id: 'yuhwa-amnok-hike-dusk',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Hiked ice-blue at dusk',
		alt: 'Intimate dusk: Yuhwa hiking wet ice-blue chima at the Amnok bank, wanting look-back',
		people: ['yuhwa'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_white_river.png']
	},
	{
		id: 'yuhwa-amnok-wanting-chin',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Chin up, mouth already wanting',
		alt: 'Intimate ECU: Yuhwa chin up from the Amnok, bitten mouth, flush, wet silk',
		people: ['yuhwa'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_white_river.png']
	},
	{
		id: 'hwahye-amnok-dive-leave',
		ratio: 1.778,
		tone: '#a8d4e8',
		nsfw: true,
		at: 'Hwahye dives first and does not look back',
		alt: 'Intimate: Hwahye mid-dive leaving the Amnok shallows, curt, wet pale silk',
		people: ['hwahye'],
		refs: ['/ch_hwahye.png', '/pl_white_river.png']
	},
	{
		id: 'wihye-amnok-laugh-follow',
		ratio: 1.778,
		tone: '#7eb8c8',
		nsfw: true,
		at: 'Wihye laughs and follows',
		alt: 'Intimate: Wihye laughing mid-turn into the Amnok, wet teal silk, follow energy',
		people: ['wihye'],
		refs: ['/ch_wihye.png', '/pl_white_river.png']
	},
	{
		id: 'yuhwa-copper-offshoulder-lean',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Off-shoulder on the copper',
		alt: 'Intimate: Yuhwa alone leaning on copper kiln wall, off-shoulder ice-blue, wanting',
		people: ['yuhwa'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png']
	},
	{
		id: 'yuhwa-copper-lookback-want',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Look-back against the kiln',
		alt: 'Intimate: Yuhwa look-back against copper kiln, hiked ice-blue, bitten mouth',
		people: ['yuhwa'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png']
	},
	{
		id: 'daughter-teal-well-hike',
		ratio: 1.778,
		tone: '#2aa89a',
		nsfw: true,
		at: 'Teal hikes at his well',
		alt: 'Intimate: anonymous teal Jolbon daughter hiking chima at the granite well-beam',
		people: [],
		refs: []
	},
	{
		id: 'daughter-saffron-well-hitch',
		ratio: 1.778,
		tone: '#d4a017',
		nsfw: true,
		at: 'Saffron leaves the hem',
		alt: 'Intimate: anonymous saffron Jolbon daughter hitching hip at the well rim',
		people: [],
		refs: []
	},
	{
		id: 'jumong-set-amnok-dawn-empty',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: false,
		at: 'Dawn on the Amnok is a cool bar',
		alt: 'Empty Amnok dawn: cool gold-pink bar on shallows, wet stones, no boats, no bodies',
		people: [],
		refs: ['/pl_white_river.png']
	},
	{
		id: 'jumong-set-amnok-morning-empty',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: false,
		at: 'Morning shallows hold no boat',
		alt: 'Empty Amnok morning: cool haze, wet stones, crushed shadow, no boats',
		people: [],
		refs: ['/pl_white_river.png']
	},
	{
		id: 'jumong-set-amnok-day-empty',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: false,
		at: 'Daylight Amnok still has a hard key',
		alt: 'Empty Amnok day: hard sun key, long shadows, crushed banks, no boats, no bodies',
		people: [],
		refs: ['/pl_white_river.png']
	},
	{
		id: 'jumong-set-buyeo-morning-empty',
		ratio: 1.778,
		tone: '#9b8f6a',
		nsfw: false,
		at: 'Morning Buyeo is a packed-earth square',
		alt: 'Empty Buyeo yard morning: mark-stake, grey-giwa hall, long shadow, no bodies',
		people: [],
		refs: ['/pl_buyeo_yard.png']
	},
	{
		id: 'jumong-set-buyeo-day-yard',
		ratio: 1.778,
		tone: '#9b8f6a',
		nsfw: false,
		at: 'Day Buyeo keeps a hard key',
		alt: 'Empty Buyeo yard day: hard key, crushed shadow, palisade, mark-stake, no bodies',
		people: [],
		refs: ['/pl_buyeo_yard.png']
	},
	{
		id: 'jumong-set-well-day-empty',
		ratio: 1.778,
		tone: '#c4a06a',
		nsfw: false,
		at: 'Day at the well is two buckets',
		alt: 'Empty Jolbon well day: granite rim, T-beam, two buckets, hard key, no bodies',
		people: [],
		refs: []
	},
	{
		id: 'jumong-set-jolbon-dusk-porch',
		ratio: 1.778,
		tone: '#a97c4a',
		nsfw: false,
		at: 'Dusk Jolbon porch is empty timber',
		alt: 'Empty Jolbon dusk porch: grey giwa, timber door, gold-bar dusk, no bodies',
		people: [],
		refs: []
	}
];

for (const s of slots) {
	s.prompt = `${s.alt}. ${SUFFIX}`;
}

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
let entry;
for (const ch of story) {
	for (const en of ch.entries ?? []) {
		if (en.title === 'Jumong') {
			entry = en;
			break;
		}
	}
	if (entry) break;
}
if (!entry) throw new Error('Jumong entry not found');

const have = new Set((entry.images ?? []).map((im) => im.id));
let added = 0;
for (const s of slots) {
	if (have.has(s.id)) continue;
	entry.images.push(s);
	have.add(s.id);
	added++;
}

const patches = [
	{
		find: 'The older sisters dive — Hwahye first, then Wihye after her laugh. <b>Yuhwa is the only one who does not run.</b> She stays standing in the shallows and looks straight up, as if she had been waiting for heaven to notice, and draws her wet hair over one shoulder so that nothing is left to guess.',
		html: 'The older sisters dive — Hwahye first, then Wihye after her laugh. <b>Hwahye dives first and does not look back.</b> <b>Wihye laughs and follows.</b> <b>Yuhwa is the only one who does not run.</b> <b>Yuhwa kneels in the shallows.</b> She stays in the water and looks straight up, as if she had been waiting for heaven to notice, and draws her wet hair over one shoulder so that nothing is left to guess. <b>Chin up, mouth already wanting.</b>',
		ko: '언니들이 잠수한다 — 화혜가 먼저, 위혜는 웃고 따라간다. <b>화혜는 먼저 잠기고 뒤를 안 본다.</b> <b>위혜는 웃고 따라간다.</b> <b>달아나지 않는 것은 유화뿐이다.</b> <b>유화는 여울에 무릎을 꿇는다.</b> 물에 남아 위를 똑바로 올려다본다 — 하늘이 알아채기를 기다리고 있던 사람처럼 — 젖은 머리를 한쪽 어깨로 넘겨, 짐작할 것을 남기지 않는다. <b>턱을 들고, 입은 이미 원한다.</b>'
	},
	{
		find: 'She washes her hair with her back to heaven, whole body wet, and looks over her shoulder as if the sun had a mouth.',
		html: 'She washes her hair with her back to heaven, whole body wet, and looks over her shoulder as if the sun had a mouth. <b>She rinses the river from her hair.</b>',
		ko: '그녀는 하늘을 등지고 머리를 감는다. 온몸이 젖어 있다. 해가 입이라도 가진 것처럼, 어깨 너머로 돌아본다. <b>머리에서 강을 헹군다.</b>'
	},
	{
		find: '<b>She draws the wet silk higher</b> — one hip, then the other — and lets the sun finish looking. Hwahye is already under. Wihye’s laugh breaks the surface and is gone.',
		html: '<b>She draws the wet silk higher</b> — one hip, then the other — and lets the sun finish looking. <b>Hiked ice-blue at dusk.</b> Hwahye is already under. Wihye’s laugh breaks the surface and is gone.',
		ko: '<b>젖은 비단을 더 걷는다</b> — 한쪽 엉덩이, 그다음 — 해가 다 보게 둔다. <b>땅거미에 얼음빛 치마를 걷는다.</b> 화혜는 이미 물 밑. 위혜의 웃음이 수면을 깨고 사라진다.'
	},
	{
		find: '<b>The copper room rises on the bank like a kiln</b> — hammered walls, timber posts, an afternoon’s heat boxed in so the sky cannot watch the rest. <b>The copper stands empty.</b>',
		html: '<b>The copper room rises on the bank like a kiln</b> — hammered walls, timber posts, an afternoon’s heat boxed in so the sky cannot watch the rest. <b>The copper stands empty.</b> Later the wall holds her: <b>Off-shoulder on the copper.</b> <b>Look-back against the kiln.</b>',
		ko: '<b>구리 방이 강가에 가마처럼 올라선다</b> — 두드린 벽, 나무 기둥, 오후의 열을 상자 안에 넣어, 하늘이 나머지를 못 보게. <b>구리는 빈 채로 선다.</b> 나중에 벽이 그녀를 받는다. <b>구리에 어깨가 벗어진다.</b> <b>가마에 등을 대고 돌아본다.</b>'
	},
	{
		find: '<b>Dusk on the Amnok is a low gold bar</b> — three daughters still in the water, Yuhwa’s chin already up. <b>The Amnok is empty water first.</b>',
		html: '<b>Dusk on the Amnok is a low gold bar</b> — three daughters still in the water, Yuhwa’s chin already up. <b>The Amnok is empty water first.</b> <b>Dawn on the Amnok is a cool bar.</b> <b>Morning shallows hold no boat.</b> <b>Daylight Amnok still has a hard key.</b>',
		ko: '<b>압록의 땅거미는 낮은 금빛 띠다</b> — 세 딸이 아직 물에 있고, 유화의 턱은 이미 올라가 있다. <b>압록은 먼저 빈 물이다.</b> <b>압록의 새벽은 차가운 띠다.</b> <b>아침 여울에는 배가 없다.</b> <b>한낮 압록에도 센 키가 있다.</b>'
	},
	{
		find: '<b>The Buyeo yard is a timber country.</b> <b>From the roof the yard is a packed-earth square.</b> <b>The packed-earth yard tilts</b> under the last light; a mark-stake throws a long shadow. <b>Iron-boss doors keep the river</b> on the other side of the palisade. Inside, <b>the hall is empty timber</b> and one lamp, the doorway still looking at the yard. <b>The Buyeo night is a sky.</b>',
		html: '<b>The Buyeo yard is a timber country.</b> <b>From the roof the yard is a packed-earth square.</b> <b>Morning Buyeo is a packed-earth square.</b> <b>Day Buyeo keeps a hard key.</b> <b>The packed-earth yard tilts</b> under the last light; a mark-stake throws a long shadow. <b>Iron-boss doors keep the river</b> on the other side of the palisade. Inside, <b>the hall is empty timber</b> and one lamp, the doorway still looking at the yard. <b>The Buyeo night is a sky.</b>',
		ko: '<b>부여 마당은 나무 나라다.</b> <b>지붕에서 보면 마당은 다진 흙 네모다.</b> <b>아침 부여는 다진 흙 네모다.</b> <b>한낮 부여는 센 키를 지킨다.</b> <b>다진 흙 마당이 기울어진다</b>, 마지막 빛 아래, 과녁 말뚝이 긴 그림자를 민다. <b>쇠징 박힌 문이 강을 바깥에 둔다.</b> 안쪽은 <b>빈 나무 대청</b>과 등잔 하나, 문턱이 아직 마당을 보고 있다. <b>부여의 밤은 하늘이다.</b>'
	},
	{
		find: 'They bring him in at dead of night, not as a guest. They put him <b>on his knees before Tabal</b> opens his mouth. A woman is already in the door-dark, chin up, not invited to the questions. One scout keeps looking back like the pines might grow more men. The valley opens under grey giwa. Moon-haze, no daylight. Tabal is on the porch with a cup he is not drinking. <b>The Jolbon hall is a timber country.</b> <b>The hall is only torches.</b> <b>Jolbon roofs keep the stars.</b>',
		html: 'They bring him in at dead of night, not as a guest. They put him <b>on his knees before Tabal</b> opens his mouth. A woman is already in the door-dark, chin up, not invited to the questions. One scout keeps looking back like the pines might grow more men. The valley opens under grey giwa. Moon-haze, no daylight. Tabal is on the porch with a cup he is not drinking. <b>The Jolbon hall is a timber country.</b> Earlier the same porch waits empty: <b>Dusk Jolbon porch is empty timber.</b> <b>The hall is only torches.</b> <b>Jolbon roofs keep the stars.</b>',
		ko: '손님으로 데려오지 않는다. 한밤중이다. 연타발이 입을 열기 전에 <b>무릎을 꿇린다</b>. 문 어둠에 이미 여자가 있다. 턱. 질문에는 안 불렸다. 척후 하나가 자꾸 뒤를 본다. 소나무에서 사람이 더 나올까 봐. 회색 기와 아래 골짜기가 열린다. 달 안개. 낮빛은 없다. 연타발은 누대에 있다. 잔은 들었는데 안 마신다. <b>졸본 대청은 나무 나라다.</b> 그 전, 같은 누대가 비어 기다린다. <b>땅거미 졸본 누대는 빈 나무다.</b> <b>대청은 횃불뿐이다.</b> <b>졸본 지붕이 별을 붙잡는다.</b>'
	},
	{
		find: 'The well is always the same well: round stone rim, one timber beam, hemp rope, two buckets on packed earth, grey giwa hall behind, grain porch left. Nobody stands in the shaft. She is already there, chin up, and there are two Jolbon girls still holding steam like they were invited. Sosuno looks at them. They go. Then she looks at him like he is late to a count he did not know he was on. <b>The well is an accident she timed.</b> <b>The well holds the night.</b>',
		html: 'The well is always the same well: round stone rim, one timber beam, hemp rope, two buckets on packed earth, grey giwa hall behind, grain porch left. Nobody stands in the shaft. <b>Day at the well is two buckets.</b> She is already there, chin up, and there are two Jolbon girls still holding steam like they were invited. Sosuno looks at them. They go. Then she looks at him like he is late to a count he did not know he was on. <b>The well is an accident she timed.</b> <b>The well holds the night.</b>',
		ko: '우물은 늘 그 우물이다. 둥근 돌 테, 들보 하나, 삼 줄, 다진 흙 위 두레박 둘, 뒤의 회색 기와, 왼쪽 곡식 누대. 아무도 우물 안에 안 선다. <b>한낮 우물은 두레박 둘이다.</b> 그녀는 이미 있다. 턱. 졸본 계집 둘이 아직 김을 들고 있는 게, 초대한 사람처럼. 소서노가 본다. 간다. 그다음 그를 본다. 자기가 모르는 셈에 늦은 사람처럼. <b>우물은 그녀가 맞춘 우연이다.</b> <b>우물이 밤을 잡고 있다.</b>'
	},
	{
		find: 'At the well they don’t pose so much as linger. <b>At the well three girls laugh too long.</b> Teal tips her weight on the beam — <b>Hip first on the beam</b> — and grins like she meant to bump him. Saffron hikes the chima a finger because the water splashed, then leaves it — <b>She hikes it like a dare.</b> Plum laughs at a joke that was only half good. He grins easy — the sun-grin, not even trying. <b>He grins at the wrong well.</b> <b>They hitch at his well.</b>',
		html: 'At the well they don’t pose so much as linger. <b>At the well three girls laugh too long.</b> Teal tips her weight on the beam — <b>Hip first on the beam</b> — and grins like she meant to bump him. <b>Teal hikes at his well.</b> Saffron hikes the chima a finger because the water splashed, then leaves it — <b>She hikes it like a dare.</b> <b>Saffron leaves the hem.</b> Plum laughs at a joke that was only half good. He grins easy — the sun-grin, not even trying. <b>He grins at the wrong well.</b> <b>They hitch at his well.</b>',
		ko: '우물에서 포즈라기보다 그냥 안 간다. <b>우물에서 세 여자가 너무 오래 웃는다.</b> 청록이 들보에 무게를 싣고 — <b>엉덩이부터</b> — 일부러 부딪친 것처럼 웃는다. <b>청록이 그의 우물에서 걷는다.</b> 사프란은 물 튀었다고 치마를 한 손가락 걷고 그대로 둔다 — <b>내기처럼 걷는다.</b> <b>사프란은 단을 그냥 둔다.</b> 자두는 반만 웃긴 농담에 웃는다. 그는 쉽게 웃는다 — 해 웃음. <b>틀린 우물에 웃는다.</b> <b>그의 우물에 엉덩이를 건다.</b>'
	}
];

let patched = 0;
for (const b of entry.blocks ?? []) {
	for (const p of patches) {
		if (b.kind === 'p' && b.html === p.find) {
			b.html = p.html;
			b.ko = p.ko;
			patched++;
		}
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

const seqSrc = fs.readFileSync(SEQ, 'utf8');
function insertShots(src, seqId, afterId, shots) {
	const marker = `\t\t\t{ id: '${afterId}',`;
	const seqStart = src.indexOf(`id: '${seqId}'`);
	if (seqStart < 0) throw new Error(`seq ${seqId} missing`);
	const from = src.indexOf(marker, seqStart);
	if (from < 0) throw new Error(`shot ${afterId} missing in ${seqId}`);
	const lineEnd = src.indexOf('\n', from);
	const block = shots
		.map(
			(s) =>
				`\t\t\t{ id: '${s.id}', role: '${s.role}', angle: '${s.angle}', at: '${s.at}' }`
		)
		.join(',\n');
	return src.slice(0, lineEnd + 1) + block + ',\n' + src.slice(lineEnd + 1);
}

const inserts = [
	{
		seqId: 'jumong-amnok-myth',
		afterId: 'jumong-set-amnok-dusk-empty',
		shots: [
			{ id: 'jumong-set-amnok-dawn-empty', role: 'empty dawn river', angle: 'wide dawn', at: 'Dawn on the Amnok is a cool bar' },
			{ id: 'jumong-set-amnok-morning-empty', role: 'empty morning river', angle: 'wide morning', at: 'Morning shallows hold no boat' },
			{ id: 'jumong-set-amnok-day-empty', role: 'empty day river', angle: 'wide day key', at: 'Daylight Amnok still has a hard key' }
		]
	},
	{
		seqId: 'jumong-amnok-myth',
		afterId: 'yuhwa-only-stays',
		shots: [
			{ id: 'yuhwa-amnok-kneel-look', role: 'kneel look-up', angle: 'intimate worm’s-eye', at: 'Yuhwa kneels in the shallows' },
			{ id: 'yuhwa-amnok-wanting-chin', role: 'wanting chin', angle: 'intimate ECU', at: 'Chin up, mouth already wanting' },
			{ id: 'yuhwa-amnok-rinse-lookback', role: 'rinse hair', angle: 'intimate dutch', at: 'She rinses the river from her hair' },
			{ id: 'yuhwa-amnok-hike-dusk', role: 'hike dusk', angle: 'intimate OTS', at: 'Hiked ice-blue at dusk' },
			{ id: 'hwahye-amnok-dive-leave', role: 'eldest dives', angle: 'intimate dutch', at: 'Hwahye dives first and does not look back' },
			{ id: 'wihye-amnok-laugh-follow', role: 'middle follows', angle: 'intimate dutch', at: 'Wihye laughs and follows' }
		]
	},
	{
		seqId: 'jumong-amnok-myth',
		afterId: 'haemosu-copper-room',
		shots: [
			{ id: 'yuhwa-copper-offshoulder-lean', role: 'copper lean', angle: 'intimate lean', at: 'Off-shoulder on the copper' },
			{ id: 'yuhwa-copper-lookback-want', role: 'copper look-back', angle: 'intimate OTS', at: 'Look-back against the kiln' }
		]
	},
	{
		seqId: 'haemosu-yuhwa-amnok',
		afterId: 'yuhwa-amnok-dusk-expo',
		shots: [
			{ id: 'jumong-set-amnok-dawn-empty', role: 'dawn empty', angle: 'wide dawn', at: 'Dawn on the Amnok is a cool bar' },
			{ id: 'jumong-set-amnok-morning-empty', role: 'morning empty', angle: 'wide morning', at: 'Morning shallows hold no boat' },
			{ id: 'jumong-set-amnok-day-empty', role: 'day empty', angle: 'wide day key', at: 'Daylight Amnok still has a hard key' },
			{ id: 'yuhwa-amnok-kneel-look', role: 'kneel look-up', angle: 'intimate worm’s-eye', at: 'Yuhwa kneels in the shallows' },
			{ id: 'yuhwa-amnok-wanting-chin', role: 'wanting chin', angle: 'intimate ECU', at: 'Chin up, mouth already wanting' },
			{ id: 'yuhwa-amnok-rinse-lookback', role: 'rinse hair', angle: 'intimate dutch', at: 'She rinses the river from her hair' },
			{ id: 'yuhwa-amnok-hike-dusk', role: 'hike dusk', angle: 'intimate OTS', at: 'Hiked ice-blue at dusk' },
			{ id: 'hwahye-amnok-dive-leave', role: 'eldest dives', angle: 'intimate dutch', at: 'Hwahye dives first and does not look back' },
			{ id: 'wihye-amnok-laugh-follow', role: 'middle follows', angle: 'intimate dutch', at: 'Wihye laughs and follows' }
		]
	},
	{
		seqId: 'haemosu-yuhwa-amnok',
		afterId: 'yuhwa-copper-room-rise',
		shots: [
			{ id: 'yuhwa-copper-offshoulder-lean', role: 'copper lean', angle: 'intimate lean', at: 'Off-shoulder on the copper' },
			{ id: 'yuhwa-copper-lookback-want', role: 'copper look-back', angle: 'intimate OTS', at: 'Look-back against the kiln' }
		]
	},
	{
		seqId: 'jumong-buyeo-north',
		afterId: 'jumong-seq-buyeo-wide',
		shots: [
			{ id: 'jumong-set-buyeo-morning-empty', role: 'morning empty yard', angle: 'bird’s-eye morning', at: 'Morning Buyeo is a packed-earth square' },
			{ id: 'jumong-set-buyeo-day-yard', role: 'day empty yard', angle: 'dutch day key', at: 'Day Buyeo keeps a hard key' }
		]
	},
	{
		seqId: 'jumong-sosuno-tsun',
		afterId: 'jumong-set-well-dutch-empty',
		shots: [
			{ id: 'jumong-set-well-day-empty', role: 'empty well day', angle: 'dutch day', at: 'Day at the well is two buckets' }
		]
	},
	{
		seqId: 'jumong-sosuno-tsun',
		afterId: 'jumong-seq-daughters-hike',
		shots: [
			{ id: 'daughter-teal-well-hike', role: 'teal hike close', angle: 'intimate dutch', at: 'Teal hikes at his well' },
			{ id: 'daughter-saffron-well-hitch', role: 'saffron hitch close', angle: 'intimate OTS', at: 'Saffron leaves the hem' }
		]
	},
	{
		seqId: 'jumong-sosuno-tsun',
		afterId: 'jumong-seq-jolbon-wide',
		shots: [
			{ id: 'jumong-set-jolbon-dusk-porch', role: 'empty dusk porch', angle: 'dutch dusk', at: 'Dusk Jolbon porch is empty timber' }
		]
	}
];

let next = seqSrc;
for (const ins of inserts) {
	if (next.includes(`id: '${ins.shots[0].id}'`) && next.indexOf(`id: '${ins.shots[0].id}'`) > next.indexOf(`id: '${ins.seqId}'`)) {
		// allow same id in two sequences; only skip if already present inside this seq
		const seqStart = next.indexOf(`id: '${ins.seqId}'`);
		const seqEnd = next.indexOf('\n\t},', seqStart);
		const slice = next.slice(seqStart, seqEnd);
		if (slice.includes(`id: '${ins.shots[0].id}'`)) continue;
	}
	next = insertShots(next, ins.seqId, ins.afterId, ins.shots);
}
fs.writeFileSync(SEQ, next);

const manifest = slots.map((s) => ({ id: s.id, alt: s.alt, prompt: s.prompt }));
const manPath = 'scripts/.cache/jumong-sexy-tod-expo-manifest.json';
fs.writeFileSync(manPath, JSON.stringify(manifest, null, '\t') + '\n');

console.log(`added ${added} slots; patched ${patched} blocks; manifest ${manPath}`);
console.log(slots.map((s) => s.id).join('\n'));
