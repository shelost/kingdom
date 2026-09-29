/**
 * Haemosu fuckboy copper talk + denser Amnok anchors + daughters 여우짓 + chariot intro.
 * Run: node scripts/.cache/patch-haemosu-fuckboy-amnok.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const SEQ = path.join(ROOT, 'src/lib/movieSequences.ts');

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const jumong = story[4].entries[5];
if (!jumong?.blocks) throw new Error('jumong entry missing');

const LOCK =
	'SAME LOCK every Amnok cut: attach /pl_white_river.png — flat gold Ubal water, dark timber bank, wet stones. SAME five-dragon gold wheeled sun-chariot: TWO gold spoked wheels, gold rail, floor, yoke; five PLAYFUL living East-Asian dragons gold/crimson/azure/jade/white (coiling, teasing each other, not stiff heraldry). Copper room on THAT bank only: hammered copper kiln walls, timber posts, one slit — Haemosu IS the sun so gold #f0b429 light-planes and copper REFLECTIONS travel with him wherever he stands indoors (hard key + bounce light on walls, never a body-halo).';

function retarget(id, at) {
	const im = jumong.images.find((i) => i.id === id);
	if (!im) return;
	im.at = at;
}

// --- Stack sparse copper stills onto denser dirty-talk anchors ---
retarget('haemosu-yuhwa-copper-skin', '몸매 is insane');
retarget('nsfw-yuhwa-copper-kiss', '몸매 is insane');
retarget('nsfw-yuhwa-wet-silk-grind', 'bounce that tight little ass');
retarget('nsfw-yuhwa-ots-copper-back', 'bounce that tight little ass');
retarget('nsfw-haemosu-grab-yuhwa-back', 'bounce that tight little ass');
retarget('nsfw-yuhwa-lookback-hips', 'bounce that tight little ass');
retarget('nsfw-yuhwa-dutch-hike-back', 'cheek at a time');
retarget('nsfw-yuhwa-worm-hips', 'cheek at a time');
retarget('nsfw-haemosu-copper-ots', 'cheek at a time');
retarget('nsfw-yuhwa-copper-pinned', 'Pinned to the copper, she does not look away');
retarget('nsfw-yuhwa-wanting-ecu', 'Her face goes wanting against the wall-heat');
retarget('nsfw-haemosu-copper-ecu', 'heaven is this thick');
retarget('nsfw-yuhwa-dutch-two-shot', 'Dutch two-shot: sun and river sharing one mouth');

// Ensure place refs on Amnok/copper stills
for (const im of jumong.images) {
	if (!/haemosu|yuhwa|hwahye|wihye|amnok|copper|chariot|ubal|shallows|grab|hike|worm|kiss|pinned|wanting|lookback|ots|bath|rail|dive|falls|sky-sisters/i.test(im.id))
		continue;
	im.refs = im.refs ?? [];
	if (
		/amnok|shallows|bath|ubal|chariot|dive|falls|sky|rail|lookdown|copper-room-rise|copper-skin/i.test(im.id) &&
		!im.refs.includes('/pl_white_river.png')
	) {
		im.refs.push('/pl_white_river.png');
	}
}

function insertAfterHtml(snippet, blocks) {
	const i = jumong.blocks.findIndex(
		(b) => typeof b.html === 'string' && b.html.includes(snippet)
	);
	if (i < 0) throw new Error(`insertAfterHtml miss: ${snippet}`);
	jumong.blocks.splice(i + 1, 0, ...blocks);
}

function replaceDialogue(person, matchEn, next) {
	const i = jumong.blocks.findIndex(
		(b) =>
			b.kind === 'dialogue' &&
			b.person === person &&
			Array.isArray(b.en) &&
			b.en.some((l) => String(l).includes(matchEn))
	);
	if (i < 0) throw new Error(`replaceDialogue miss: ${person} / ${matchEn}`);
	jumong.blocks[i] = { ...jumong.blocks[i], ...next, kind: 'dialogue', person };
}

// --- Expand chariot intro (usual sun-run before the break) ---
{
	const i = jumong.blocks.findIndex(
		(b) => typeof b.html === 'string' && b.html.includes('god of the sun, is high up')
	);
	if (i < 0) throw new Error('chariot open miss');
	jumong.blocks.splice(
		i,
		1,
		{
			kind: 'p',
			html: '<b>Haemosu</b>, god of the sun, drives the hour the way he always does — gold wheeled chariot high, five playful dragons pulling and teasing each other across a living sky, the disc cutting charcoal into day. Same route. Same joke with the azure one. Same rail under his palms.',
			ko: '태양신 <b>해모수</b>는 늘 하던 대로 시각을 몬다 — 금빛 바퀴 수레가 높이, 다섯 장난기 많은 용이 서로 놀리며 이승 하늘을 끌고, 원반이 숯을 낮으로 가른다. 같은 길. 푸른 용과는 같은 농담. 손바닥 아래 같은 난간.'
		},
		{
			kind: 'p',
			html: '<b>Usual run: five dragons across the noon sky.</b> Gold and crimson race the traces; jade loops under the axle for fun; white nips azure’s tail; he laughs and keeps the hour anyway.',
			ko: '<b>평소 주행: 다섯 용이 한낮 하늘을 가로지른다.</b> 금과 진홍이 끌줄을 다투고, 옥빛은 장난으로 차축 밑을 한 바퀴 돌고, 흰 용이 푸른 용 꼬리를 깨문다. 그는 웃고도 시각은 지킨다.'
		},
		{
			kind: 'p',
			html: 'Then the Amnok flashes under the wheel — wet silk, three bodies — and the hour breaks. He looks down.',
			ko: '그러다 바퀴 아래 압록이 번쩍인다 — 젖은 비단, 몸 셋 — 시각이 깨진다. 그는 내려다본다.'
		}
	);
}

// --- Copper: fuckboy dirty talk (Mommae register) + AV-soft Yuhwa ---
replaceDialogue('haemosu', 'Don’t take your hand off', {
	nsfw: true,
	chip: '#7fc4e8',
	lines: [
		'야. 여기.',
		'씨발— 몸매 미쳤다.',
		'니 몸매 is insane.',
		'손 빼지 마.',
		'이 부드러운 거— 미쳤어.'
	],
	en: [
		'Hey. Here.',
		'Fuck— your body is insane.',
		'Your 몸매 is insane.',
		'Don’t take my hand off.',
		'This soft— I’m gone.'
	]
});

replaceDialogue('haemosu', "I can’t take my hands off", {
	nsfw: true,
	chip: '#7fc4e8',
	lines: [
		'알아. 손 못 떼겠어.',
		'야. 그 엉덩이—',
		'bounce that tight little ass.',
		'한 쪽씩. cheek at a time.',
		'내 거 위에. 천천히. 다시.'
	],
	en: [
		'I know. Can’t take my hands off.',
		'Hey. That ass—',
		'Bounce that tight little ass.',
		'One cheek at a time.',
		'On my shaft. Slow. Again.'
	]
});

replaceDialogue('haemosu', 'I am going to nut in this river', {
	nsfw: true,
	chip: '#7fc4e8',
	lines: [
		'시각 따위 됐어.',
		'니 허벅지— 택시처럼 쭉빵해.',
		'이 부드러운 몸매에 정신 나갔어.',
		'강에 쌀 거야. 지금.',
		'이름— 지금— 말해.'
	],
	en: [
		'Fuck the hour.',
		'Those thighs— packed tight.',
		'Your soft body wiped my brain.',
		'I’m nutting in this river. Now.',
		'Name— now— say it.'
	]
});

// Insert denser dirty-talk after grab paragraph if not already expanded
{
	const grabIdx = jumong.blocks.findIndex(
		(b) => typeof b.html === 'string' && b.html.includes('He grabs the wet silk at her hip')
	);
	if (grabIdx >= 0) {
		const next = jumong.blocks[grabIdx + 1];
		const already = next?.en?.some?.((l) => String(l).includes('몸매 is insane'));
		if (!already) {
			// replace thin haemosu after grab with the fuckboy block already applied via replaceDialogue;
			// add Yuhwa AV breath + second Haemosu bounce block before worm’s-eye
			const worm = jumong.blocks.findIndex(
				(b) => typeof b.html === 'string' && b.html.includes('Worm’s-eye: her hips own the copper')
			);
			if (worm > grabIdx) {
				jumong.blocks.splice(worm, 0, {
					kind: 'dialogue',
					nsfw: true,
					chip: '#8fc4e0',
					person: 'yuhwa',
					lines: [
						'하아…',
						'그렇게 말하면—',
						'…더 세게 말해 줘요.',
						'보고 싶으면 말해요. 어디.'
					],
					en: [
						'Haa…',
						'When you talk like that—',
						'…Say it dirtier.',
						'Tell me where you want to look.'
					]
				});
			}
		}
	}
}

// Inject bounce / cheek phrases into narration so ats lock
{
	const dutch = jumong.blocks.findIndex(
		(b) => typeof b.html === 'string' && b.html.includes('Dutch two-shot: sun and river sharing one mouth')
	);
	if (dutch >= 0) {
		jumong.blocks.splice(
			dutch,
			0,
			{
				kind: 'p',
				nsfw: true,
				html: 'He talks like the hour never mattered. <b>몸매 is insane</b> — soft river body, ice-blue hiked, him gone on it. He wants her to <b>bounce that tight little ass</b> on him, <b>cheek at a time</b>, copper throwing his own sun back at both of them.',
				ko: '시각 따위 상관없다는 식으로 말한다. <b>몸매 is insane</b> — 부드러운 강 몸, 얼음빛 걷힌 채, 그는 그거에 무너진다. <b>bounce that tight little ass</b>, <b>cheek at a time</b>. 구리가 제 해를 둘에게 되던진다.'
			}
		);
	}
}

// --- Daughters well: textbook 여우짓 ---
{
	const hitch = jumong.blocks.findIndex(
		(b) => typeof b.html === 'string' && b.html.includes('They hitch at his well')
	);
	if (hitch < 0) throw new Error('hitch miss');
	// Replace the thin anonymous dialogues after hitch p with foxier ones
	// Find first teal dialogue after hitch
	let j = hitch + 1;
	while (j < jumong.blocks.length && jumong.blocks[j].kind === 'dialogue' && jumong.blocks[j].person !== 'sosuno') {
		j++;
	}
	const foxBlocks = [
		{
			kind: 'dialogue',
			chip: '#2aa89a',
			en: [
				'Hip first on the beam.',
				'Don’t look at the bucket. Look at me.',
				'Your joke was— ha. Say it again. Closer.'
			],
			lines: [
				'들보에 엉덩이부터.',
				'두레박 보지 마. 나 봐.',
				'방금 농담— 푸핫. 다시. 더 가까이.'
			]
		},
		{
			kind: 'dialogue',
			chip: '#d4a017',
			en: [
				'She hikes it like a dare.',
				'Come fetch at ours.',
				'Ours is nicer. Stay. Hand— here. On my shoulder is fine.'
			],
			lines: [
				'이렇게 걷으면— 내기야.',
				'우리 우물로 와.',
				'우리 게 더 예뻐. 있어. 손— 여기. 어깨에 얹어도 돼.'
			]
		},
		{
			kind: 'dialogue',
			person: 'jumong',
			chip: '#e8563f',
			en: [
				'Hi.',
				'I— rope. Just the rope.',
				'You’re— yeah. Funny. Too funny.'
			],
			lines: [
				'안녕.',
				'난— 줄. 줄만.',
				'웃기네. 너무 웃겨.'
			]
		},
		{
			kind: 'dialogue',
			chip: '#c4a06a',
			en: [
				'Heh— he said the bucket was jealous.',
				'Stay. The knot can wait.',
				'Your arms are— mm. Come fetch at our well next. I’ll hold the rope for you. Or you hold me.',
				'Come fetch at ours.'
			],
			lines: [
				'푸핫— 두레박이 질투한대.',
				'있어. 매듭은 기다려.',
				'팔이— 음. 다음엔 우리 우물. 내가 줄 잡아 줄게. 아니면 날 잡아.',
				'우리 우물로 와.'
			]
		},
		{
			kind: 'p',
			html: 'Teal’s fingers find his shoulder and stay there like an accident that knows what it is. Saffron laughs too loud at a joke that was not that good. Plum tilts her head, soft voice, harder eyes. Textbook fox-work. <b>They hitch at his well.</b>',
			ko: '청록 손가락이 어깨에 올라 사고인 척 머문다. 사프란은 별로 안 웃긴 농담에 너무 크게 웃는다. 자두는 고개 기울이고 목소리는 부드럽고 눈은 더 세다. 교과서 여우짓. <b>그의 우물에 엉덩이를 건다.</b>'
		}
	];
	// Remove old dialogues between hitch and sosuno flaw p
	const flaw = jumong.blocks.findIndex(
		(b, idx) => idx > hitch && typeof b.html === 'string' && b.html.includes('They can do sexy')
	);
	if (flaw < 0) throw new Error('flaw miss');
	jumong.blocks.splice(hitch + 1, flaw - hitch - 1, ...foxBlocks);
}

// New still slots for chariot usual-run + copper combo
const ensureImage = (slot) => {
	if (jumong.images.some((i) => i.id === slot.id)) return;
	jumong.images.push(slot);
};

ensureImage({
	id: 'haemosu-chariot-usual-run',
	ratio: 1.778,
	tone: '#f0b429',
	at: 'Usual run: five dragons across the noon sky',
	alt: 'Wide iconic: Haemosu driving the five-dragon gold wheeled sun-chariot across a living noon sky',
	refs: ['/ch_haemosu.png', '/pl_white_river.png'],
	people: ['haemosu'],
	prompt: ''
});

ensureImage({
	id: 'nsfw-haemosu-copper-combo-bounce',
	ratio: 0.75,
	tone: '#f0b429',
	nsfw: true,
	at: 'bounce that tight little ass',
	alt: 'Manhwa multi-inset copper: Haemosu fuckboy lust; Yuhwa soft AV look-back; gold light reflections on hammered copper',
	refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png'],
	people: ['yuhwa', 'haemosu'],
	prompt: ''
});

ensureImage({
	id: 'nsfw-haemosu-copper-combo-mommae',
	ratio: 0.75,
	tone: '#8fc4e0',
	nsfw: true,
	at: '몸매 is insane',
	alt: 'Manhwa multi-inset: Yuhwa soft sexy body on copper; Haemosu open-mouth lust; sun reflections',
	refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png'],
	people: ['yuhwa', 'haemosu'],
	prompt: ''
});

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

let seq = fs.readFileSync(SEQ, 'utf8');
const canonBoost =
	"LOCK: /pl_white_river.png every Earth Amnok cut. SAME chariot forever (two spoked wheels, rail, floor, yoke; five PLAYFUL dragons gold/crimson/azure/jade/white). Copper kiln on that bank only. Haemosu = sun: gold #f0b429 light-planes + copper reflections wherever he stands indoors — never a body-halo. ";
if (!seq.includes('five PLAYFUL dragons')) {
	seq = seq.replace(
		/SAME Amnok bank every Earth cut\. SAME five-dragon gold chariot \(do not invent a new one\)\./g,
		canonBoost + 'SAME Amnok bank every Earth cut. SAME five-dragon gold chariot (do not invent a new one).'
	);
}
if (!seq.includes('haemosu-chariot-usual-run')) {
	seq = seq.replace(
		`{ id: 'haemosu-sky-sisters', role: 'looks down', angle: 'from the chariot', at: 'Then he looks down and the hour breaks' },`,
		`{ id: 'haemosu-chariot-usual-run', role: 'usual sun-run', angle: 'wide sky dutch', at: 'Usual run: five dragons across the noon sky' },
			{ id: 'haemosu-sky-sisters', role: 'looks down', angle: 'from the chariot', at: 'Then he looks down and the hour breaks' },`
	);
}
if (!seq.includes('nsfw-haemosu-copper-combo-bounce')) {
	seq = seq.replace(
		`{ id: 'nsfw-haemosu-grab-yuhwa-back', role: 'feral grab', angle: 'OTS grab', at: 'He grabs the wet silk at her hip' },`,
		`{ id: 'nsfw-haemosu-copper-combo-mommae', role: '몸매 combo', angle: 'manhwa multi-inset', at: '몸매 is insane' },
			{ id: 'nsfw-haemosu-copper-combo-bounce', role: 'bounce combo', angle: 'manhwa multi-inset', at: 'bounce that tight little ass' },
			{ id: 'nsfw-haemosu-grab-yuhwa-back', role: 'feral grab', angle: 'OTS grab', at: 'bounce that tight little ass' },`
	);
}
fs.writeFileSync(SEQ, seq);
console.log('patched', LOCK.slice(0, 80) + '…');
