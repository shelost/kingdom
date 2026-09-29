/**
 * Jumong story fill: Habek sentence, egg ordeal, turtle crossing cinema,
 * Daeso side-room, Tabal bow, Onjo/Biryu watch, dry post-thatch, place locks.
 * Skips Yuri half-sword return (Onjo entry).
 * node scripts/.cache/patch-jumong-story-fill.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const SEQ = path.join(ROOT, 'src/lib/movieSequences.ts');

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const j = story[4].entries[5];

function findHtml(s) {
	return j.blocks.findIndex((b) => typeof b.html === 'string' && b.html.includes(s));
}
function findScene(label) {
	return j.blocks.findIndex((b) => b.kind === 'scene' && b.label === label);
}
function ensureImage(slot) {
	if (!j.images.some((i) => i.id === slot.id)) j.images.push(slot);
}

// ========== 1. Habek border-king sentence ==========
{
	const i = findHtml('The Amnok keeps its own court');
	if (i >= 0) {
		j.blocks[i] = {
			kind: 'p',
			html: 'The copper room is still warm when the river notices. Mist comes in like a door. <b>The Amnok keeps its own court.</b> <b>Habek</b> stands on the wet stones as if the current were a dais — not a father asking, a border asking. The sun crossed without a matchmaker. That is the charge.',
			ko: '구리 방이 아직 따뜻할 때 강이 알아챈다. 안개가 문처럼 들어온다. <b>압록은 제 조정이 있다.</b> <b>하백</b>이 젖은 돌 위에 선다. 여울이 대청인 것처럼 — 묻는 아버지가 아니라, 국경이 묻는 것이다. 해가 중매 없이 건넜다. 그게 죄목이다.'
		};
	}
	const d = j.blocks.findIndex(
		(b) =>
			b.kind === 'dialogue' &&
			Array.isArray(b.en) &&
			b.en.some((l) => String(l).includes('You don’t sleep in my mist'))
	);
	if (d >= 0) {
		j.blocks[d] = {
			kind: 'dialogue',
			person: 'habek',
			chip: '#3E79E4',
			en: [
				'The sun does not cross a river on “I looked up.”',
				'No matchmaker. You followed a light and stayed on your feet.',
				'You smell like copper. Keep that out of my mist.',
				'You don’t sleep in my mist after that.',
				'Go. The bank is closed.'
			],
			lines: [
				'해가 ‘올려다봤어요’로 강을 건너지 않는다.',
				'중매도 없이. 빛을 따라 선 채로 남았다.',
				'구리 냄새가 난다. 내 안개에 들이지 마라.',
				'그 다음엔 내 안개에서 잠자지 못한다.',
				'가라. 이 강턱은 닫았다.'
			]
		};
	}
	// Sisters silence beat
	const kick = findHtml('Habek kicks Yuhwa out');
	if (kick >= 0 && !j.blocks[kick - 1]?.html?.includes?.('Hwahye and Wihye do not argue')) {
		j.blocks.splice(kick, 0, {
			kind: 'p',
			html: '<b>Hwahye and Wihye do not argue the sentence.</b> Eldest looks at the current. Middle looks at the copper glow dying. Neither looks at their father’s face. The mist takes the room’s heat and leaves the bank empty.',
			ko: '<b>화혜와 위혜는 판결을 논하지 않는다.</b> 언니는 여울을 본다. 둘째는 죽어 가는 구리 빛을 본다. 둘 다 아버지 얼굴은 안 본다. 안개가 방의 열을 가져가고 강턱을 비운다.'
		});
	}
}

// ========== 2. Egg ordeal montage ==========
{
	const egg = findHtml('Yuhwa lays a great egg');
	const hatch = findHtml('out of the egg comes a baby boy');
	const hatchAlt = findHtml('The hatch-room opens');
	const insertAt = egg >= 0 ? egg + 1 : -1;
	if (insertAt >= 0 && !j.blocks.some((b) => b.html?.includes?.('dogs and pigs will not eat it'))) {
		const ordeal = [
			{
				kind: 'p',
				html: 'Geumwa has the egg taken from her. <b>Dogs and pigs will not eat it.</b> The sty refuses the guest.',
				ko: '금와가 알을 빼앗아 간다. <b>개와 돼지가 먹지 않는다.</b> 외양간이 손님을 거절한다.'
			},
			{
				kind: 'p',
				html: 'They throw it in the road. <b>Cattle and horses step around it.</b> Hooves know better than ministers.',
				ko: '길에 버린다. <b>소와 말이 피해서 간다.</b> 발굽이 신하보다 낫다.'
			},
			{
				kind: 'p',
				html: 'They leave it in the open field. <b>Birds cover it with their wings</b> instead of pecking. The yard goes quiet watching that.',
				ko: '들에 둔다. <b>새들이 쪼아 먹지 않고 날개로 덮는다.</b> 마당이 그걸 보고 조용해진다.'
			},
			{
				kind: 'p',
				html: 'An axe is brought. <b>The axe will not split the egg.</b> Geumwa gives it back. Yuhwa wraps it warm. Then the shell goes.',
				ko: '도끼를 가져온다. <b>도끼로도 알이 안 깨진다.</b> 금와가 돌려준다. 유화가 따뜻하게 싼다. 그다음 껍질이 간다.'
			}
		];
		// Insert after Jashin dialogue cluster — find "Leave it. We can wait"
		const leave = j.blocks.findIndex(
			(b) => b.kind === 'dialogue' && b.en?.some?.((l) => String(l).includes('Leave it. We can wait'))
		);
		const at = leave >= 0 ? leave + 1 : insertAt + 2;
		j.blocks.splice(at, 0, ...ordeal);
	}
}

// ========== 3. Expand turtle/fish crossing ==========
{
	const i = findHtml('The river answers. Tortoises rise');
	if (i >= 0) {
		j.blocks.splice(
			i,
			1,
			{
				kind: 'scene',
				label: 'The Crossing',
				ko: '건넌 강'
			},
			{
				kind: 'p',
				html: '<b>I am the son of the great Haemosu</b> — he said it to the water, not to a hall. The river answers. Soft-shelled turtles and fish rise and lock shell to shell, scale to scale, in the dark. A living ford. No boat. No bridge. <b>Tortoises rise and lock shell to shell.</b>',
				ko: '<b>나는 위대한 해모수의 아들이다</b> — 조정이 아니라 물에 말한다. 강이 대답한다. 자라와 물고기가 어둠 속에서 등껍질과 비늘을 맞댄다. 살아 있는 여울. 배 없음. 다리 없음. <b>자라가 올라와 등껍질을 맞댄다.</b>'
			},
			{
				kind: 'p',
				html: '<b>Jumong runs the wet backs</b> as if they had always been a road — crimson silk, bow high, night river, the far bank a black strip. Behind him Haemosu and Haewonmek stay on the near stones. The shells do not follow onto Jolbon mud.',
				ko: '<b>주몽이 젖은 등 위를 달린다</b> — 원래 길이었던 것처럼. 진홍 비단, 활은 높이, 밤 강, 저편은 검은 띠. 뒤에는 해모수와 해원맥이 이편 돌에 남는다. 등껍질은 졸본 진흙까지 따라오지 않는다.'
			}
		);
	}
}

// ========== 4. Daeso side-room ==========
{
	const i = findHtml('Daeso takes ministers into a side room');
	if (i >= 0) {
		j.blocks[i] = {
			kind: 'p',
			html: 'Geumwa will not take the heir’s counsel. So Daeso takes ministers into a <b>side room</b> instead — the kind of room where knives are sharpened off the record. Lamp low. Table empty. Nobody writes His Highness’s words down. If they write it, the scandal arrives before the blade.',
			ko: '금와가 태자의 말을 받지 않는다. 그래서 대소는 신하들을 <b>곁방</b>으로 부른다 — 기록 없이 칼을 가는 방. 등잔은 낮고. 상은 비고. 전하의 말씀을 적는 사람이 없다. 적으면 칼보다 스캔들이 먼저 온다.'
		};
		if (!j.blocks[i + 1]?.en?.some?.((l) => String(l).includes('I will not put His Highness'))) {
			// dialogue may already exist at 85 area - check
		}
	}
	// Ensure dialogue present
	const sideDlg = j.blocks.findIndex(
		(b) => b.kind === 'dialogue' && b.en?.some?.((l) => String(l).includes('I will not put His Highness'))
	);
	if (sideDlg >= 0) {
		j.blocks[sideDlg] = {
			kind: 'dialogue',
			chip: '#9b8f6a',
			en: [
				'I will not put His Highness’s words on the record.',
				'If I do, the scandal arrives before the knife.',
				'We do this quiet. No seal. No name.'
			],
			lines: [
				'전하의 말씀을 기록에 올리지 않겠습니다.',
				'올리면 칼보다 스캔들이 먼저 옵니다.',
				'조용히 합니다. 인장 없이. 이름 없이.'
			]
		};
		j.blocks.splice(sideDlg + 1, 0, {
			kind: 'dialogue',
			person: 'daeso',
			chip: '#9b8f6a',
			en: [
				'Quiet is fine.',
				'Father said no. The yard still has a foundling.',
				'Do it before the next hunt.'
			],
			lines: [
				'조용하면 됐다.',
				'아버지는 안 된다고 했다. 마당엔 여전히 주워 온 놈이 있다.',
				'다음 사냥 전에 끝내.'
			]
		});
	}
}

// ========== 5. Tabal bow strain ==========
{
	const i = findHtml('The string will not come');
	if (i >= 0) {
		j.blocks[i] = {
			kind: 'p',
			html: 'They put Jumong’s bow in Tabal’s hands to finish him with his own wood. <b>He cannot pull the string.</b> The string will not come. Tabal puts his back into it the way he puts his back into a boar. The limb does not bend. Veins. Torch. A hall waiting for a clean death that will not open. He tries again. The bow refuses a chieftain.',
			ko: '주몽의 활을 타발 손에 쥐어, 제 나무로 끝내게 한다. <b>시위를 당길 수가 없다.</b> 시위가 안 온다. 타발이 멧돼지 잡듯 등을 넣는다. 몸통이 안 휜다. 핏줄. 횃불. 깨끗한 죽음을 기다리는 전각이 열리지 않는다. 다시. 활이 족장을 거절한다.'
		};
	}
	const stop = j.blocks.findIndex(
		(b) => b.kind === 'dialogue' && b.en?.some?.((l) => String(l) === 'Stop!' || String(l).startsWith('Stop!'))
	);
	if (stop >= 0) {
		j.blocks[stop] = {
			kind: 'dialogue',
			person: 'yeontabal',
			chip: '#141C2E',
			en: [
				'Stop!',
				'…Boy. Who did you say you were again.',
				'That bow does not bend for me. Talk.'
			],
			lines: [
				'멈춰!',
				'…야. 네가 누구라고 했지.',
				'이 활이 나한테는 안 휜다. 말해.'
			]
		};
	}
}

// ========== 6. Dry stretch after Thatched Bed ==========
{
	const morning = findHtml('Morning will put the chin back');
	const other = findScene('Other Daughters');
	if (morning >= 0 && other > morning) {
		// Replace lusty head-ledger paras with work-only
		const chin = findHtml('Chin up, she is her father’s hall');
		if (chin > morning && chin < other) {
			j.blocks[chin] = {
				kind: 'p',
				html: 'Morning puts the chin back. She is her father’s hall again — spear-count, west line, who eats. His red back crosses the packed earth and she looks past it on purpose. <b>Work first. Looking later. Looking never.</b>',
				ko: '아침이 턱을 다시 올린다. 다시 아버지 전각이다 — 창 숫자, 서쪽 줄, 누가 먹나. 붉은 등이 다진 흙을 가로질러도 일부러 지나쳐 본다. <b>일은 먼저. 보는 건 나중. 보는 건 없다.</b>'
			};
		}
		const ledger = findHtml('In her head the ledger is not gr');
		if (ledger > morning && ledger < other) {
			j.blocks[ledger] = {
				kind: 'p',
				html: 'The counting-voice stays on one, two, three. She assigns him ditch and rope and does not watch him do either. <b>In her head the ledger is grain</b> — for three whole mornings. That is a personal best.',
				ko: '세는 목소리는 하나, 둘, 셋에 남는다. 도랑과 줄을 주고 하는 걸 안 본다. <b>머릿속 장부는 곡식이다</b> — 사흘 아침 내내. 개인 최고 기록이다.'
			};
		}
	}
}

// ========== 7. Onjo / Biryu watching (no Yuri return) ==========
{
	const wealth = findHtml('Her two sons are raised in the hall');
	if (wealth >= 0 && !j.blocks.some((b) => b.html?.includes?.('Onjo and Biryu watch the well'))) {
		j.blocks.splice(
			wealth,
			1,
			{
				kind: 'p',
				html: 'Her wealth still buys what love alone cannot: tribes, grain, river routes. Her two sons grow in the same yard that hired their father.',
				ko: '재산은 사랑만으로는 못 사는 것을 산다: 부족, 곡식, 강길. 두 아들은 아버지를 고용했던 같은 마당에서 자란다.'
			},
			{
				kind: 'scene',
				label: 'Two Sons',
				ko: '두 아들'
			},
			{
				kind: 'p',
				html: '<b>Onjo and Biryu watch the well</b> the way other boys watch a hunt — rope, bucket, their mother’s chin. They do not know yet which shore they will choose. They know the grain porch answers her first.',
				ko: '<b>온조와 비류가 우물을 본다</b> — 다른 아이들이 사냥을 보듯. 줄, 두레박, 어머니 턱. 어느 물가를 고를지는 아직 모른다. 곡식 누대가 어머니에게 먼저 대답하는 건 안다.'
			},
			{
				kind: 'dialogue',
				person: 'onjo',
				chip: '#d9b13a',
				en: [
					'Mother’s counting again.',
					'Father’s grinning at the rope.',
					'…I’m staying near the porch.'
				],
				lines: [
					'어머니 또 세신다.',
					'아버지는 줄 보고 웃고.',
					'…난 누대 근처에 있을래.'
				]
			},
			{
				kind: 'dialogue',
				person: 'biryu',
				chip: '#6fa8ff',
				en: [
					'I’m going farther.',
					'When I’m bigger.',
					'Don’t tell her I said that.'
				],
				lines: [
					'난 더 멀리 갈 거야.',
					'크면.',
					'어머니한테 말하지 마.'
				]
			},
			{
				kind: 'p',
				html: 'Jealousy without a map. Two small shadows on packed earth. The south road is years away. The well is today.',
				ko: '지도 없는 질투. 다진 흙 위 작은 그림자 둘. 남쪽 길은 몇 년 뒤다. 우물은 오늘이다.'
			},
			{
				kind: 'dialogue',
				person: 'sosuno',
				chip: '#e8a04a',
				en: [
					'You learn something from founding a country twice.',
					'The second one is easier.'
				],
				lines: [
					'나라를 두 번 세우면 아는 게 있어.',
					'두 번째가 더 쉬워.'
				]
			}
		);
		// Remove duplicate "You learn something" if we left the old dialogue
		const dup = j.blocks.findIndex(
			(b, idx) =>
				idx > wealth + 5 &&
				b.kind === 'dialogue' &&
				b.en?.some?.((l) => String(l).includes('founding a country twice'))
		);
		if (dup >= 0) j.blocks.splice(dup, 1);
	}
}

// ========== Image slots ==========
const slots = [
	{
		id: 'habek-sentence-mist',
		ratio: 1.778,
		tone: '#3E79E4',
		at: 'The Amnok keeps its own court',
		alt: 'Bird’s-eye mist-court: Habek on wet stones as a dais; copper kiln stamp; tiny Yuhwa',
		refs: ['/ch_habek.png', '/ch_yuhwa.png', '/pl_white_river.png'],
		people: ['habek', 'yuhwa'],
		prompt: ''
	},
	{
		id: 'egg-ordeal-sty',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'Dogs and pigs will not eat it',
		alt: 'Iconic: pale egg in sty; animals refuse; Buyeo timber bokeh',
		refs: ['/pl_buyeo_yard.png'],
		prompt: ''
	},
	{
		id: 'egg-ordeal-road',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'Cattle and horses step around it',
		alt: 'Iconic: egg on road; cattle/hooves parting; Buyeo packed earth',
		refs: ['/pl_buyeo_yard.png'],
		prompt: ''
	},
	{
		id: 'egg-ordeal-birds',
		ratio: 1.778,
		tone: '#8fc4e0',
		at: 'Birds cover it with their wings',
		alt: 'Iconic: birds wing-covering the egg in an open field',
		refs: ['/pl_buyeo_yard.png'],
		prompt: ''
	},
	{
		id: 'egg-ordeal-axe',
		ratio: 1.778,
		tone: '#9b8f6a',
		at: 'The axe will not split the egg',
		alt: 'Dutch: axe stopped on pale egg; Geumwa doorway stamp',
		refs: ['/ch_geumwa.png', '/pl_buyeo_yard.png'],
		people: ['geumwa'],
		prompt: ''
	},
	{
		id: 'jumong-turtle-crossing-wide',
		ratio: 1.778,
		tone: '#e8563f',
		at: 'Tortoises rise and lock shell to shell',
		alt: 'Wide night river: living turtle-fish ford; tiny crimson Jumong mid-run',
		refs: ['/ch_jumong.png', '/pl_white_river.png'],
		people: ['jumong'],
		prompt: ''
	},
	{
		id: 'jumong-turtle-crossing-dutch',
		ratio: 1.778,
		tone: '#e8563f',
		at: 'Jumong runs the wet backs',
		alt: 'Dutch: Jumong crimson running wet turtle shells; night river',
		refs: ['/ch_jumong.png', '/pl_white_river.png'],
		people: ['jumong'],
		prompt: ''
	},
	{
		id: 'daeso-side-room',
		ratio: 1.778,
		tone: '#9b8f6a',
		at: 'side room',
		alt: 'Dutch empty side room: low lamp, no record; Daeso and two minister silhouettes',
		refs: ['/ch_daeso.png', '/pl_buyeo_yard.png'],
		people: ['daeso'],
		prompt: ''
	},
	{
		id: 'tabal-bow-strain',
		ratio: 1.778,
		tone: '#141C2E',
		at: 'He cannot pull the string',
		alt: 'Worm’s-eye: Tabal straining Jumong’s bow; torch hall; string won’t come',
		refs: ['/ch_yeon_tabal.png', '/ch_jumong.png'],
		people: ['yeontabal', 'jumong'],
		prompt: ''
	},
	{
		id: 'tabal-bow-stop',
		ratio: 0.75,
		tone: '#141C2E',
		at: 'Stop!',
		alt: 'ECU Tabal: Stop! — torch sweat, bow still unbent',
		refs: ['/ch_yeon_tabal.png'],
		people: ['yeontabal'],
		prompt: ''
	},
	{
		id: 'onjo-biryu-well-watch',
		ratio: 1.778,
		tone: '#d9b13a',
		at: 'Onjo and Biryu watch the well',
		alt: 'Dutch Jolbon well: two small princes watching; Sosuno chin at porch',
		refs: ['/ch_onjo.png', '/ch_biryu.png', '/ch_sosuno_queen.png', '/bn_sosuno.png'],
		people: ['onjo', 'biryu', 'sosuno'],
		prompt: ''
	}
];
for (const s of slots) ensureImage(s);

// Fix Stop! at - dialogue may be "Stop!" with more lines - already ok via includes

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

// ========== movieSequences place locks + shots ==========
let seq = fs.readFileSync(SEQ, 'utf8');

const tabalLock =
	'LOCK Tabal night hall: torch pools ONLY, crushed blacks, timber posts, no daylight leftover. ';
const wellLock =
	'LOCK Jolbon well EVERY well-cut: round granite rim, timber beam, hemp rope, two buckets on packed earth, nobody in the shaft, grey giwa hall. ';
const pineLock =
	'LOCK pine yard: real Korean pines, timber giwa hall as dark bar, packed-earth mark — not Jolbon well cousins. ';

if (!seq.includes('LOCK Tabal night hall')) {
	seq = seq.replace(
		"canon: 'SAME Jolbon well every well-cut:",
		`canon: '${tabalLock}${wellLock}SAME Jolbon well every well-cut:`
	);
}
if (!seq.includes('LOCK pine yard: real Korean pines') && seq.includes("id: 'jumong-songyang'")) {
	seq = seq.replace(
		"canon: 'AFTER jumong-sosuno-tsun crown shots. LOCK pine timber + real pines every Earth cut.",
		`canon: 'AFTER jumong-sosuno-tsun crown shots. ${pineLock}LOCK pine timber + real pines every Earth cut.`
	);
}

if (!seq.includes('jumong-turtle-crossing-wide')) {
	seq = seq.replace(
		`{ id: 'jumong-friends-split-ots', role: 'ridge', angle: 'OTS', at: 'We take the ridge' }`,
		`{ id: 'jumong-friends-split-ots', role: 'ridge', angle: 'OTS', at: 'We take the ridge' },
			{ id: 'jumong-turtle-crossing-wide', role: 'living ford', angle: 'wide night river', at: 'Tortoises rise and lock shell to shell' },
			{ id: 'jumong-turtle-crossing-dutch', role: 'runs the shells', angle: 'dutch run', at: 'Jumong runs the wet backs' }`
	);
}
if (!seq.includes('egg-ordeal-sty')) {
	seq = seq.replace(
		`{ id: 'jumong-buyeo-egg', role: 'the egg', angle: 'dutch room', at: 'Yuhwa lays a great egg' },`,
		`{ id: 'jumong-buyeo-egg', role: 'the egg', angle: 'dutch room', at: 'Yuhwa lays a great egg' },
			{ id: 'egg-ordeal-sty', role: 'sty refuses', angle: 'iconic stamp', at: 'Dogs and pigs will not eat it' },
			{ id: 'egg-ordeal-road', role: 'hooves part', angle: 'iconic road', at: 'Cattle and horses step around it' },
			{ id: 'egg-ordeal-birds', role: 'birds cover', angle: 'field wide', at: 'Birds cover it with their wings' },
			{ id: 'egg-ordeal-axe', role: 'axe fails', angle: 'dutch axe', at: 'The axe will not split the egg' },`
	);
}
if (!seq.includes('habek-sentence-mist')) {
	seq = seq.replace(
		`{ id: 'habek-court-wide', role: 'river court', angle: 'bird’s-eye bank', at: 'The Amnok keeps its own court' },`,
		`{ id: 'habek-court-wide', role: 'river court', angle: 'bird’s-eye bank', at: 'The Amnok keeps its own court' },
			{ id: 'habek-sentence-mist', role: 'border sentence', angle: 'bird’s-eye mist', at: 'The Amnok keeps its own court' },`
	);
}
if (!seq.includes('daeso-side-room')) {
	seq = seq.replace(
		`{ id: 'jumong-buyeo-knife', role: 'assassination', angle: 'dutch blade-line', at: 'One night Jumong slips an assassination' },`,
		`{ id: 'daeso-side-room', role: 'off the record', angle: 'dutch lamp room', at: 'side room' },
			{ id: 'jumong-buyeo-knife', role: 'assassination', angle: 'dutch blade-line', at: 'One night Jumong slips an assassination' },`
	);
}
if (!seq.includes('tabal-bow-strain')) {
	seq = seq.replace(
		`{ id: 'jumong-seq-tabal-bow', role: 'the bow will not bend', angle: 'worm’s-eye strain', at: 'He cannot pull the string' },`,
		`{ id: 'jumong-seq-tabal-bow', role: 'the bow will not bend', angle: 'worm’s-eye strain', at: 'He cannot pull the string' },
			{ id: 'tabal-bow-strain', role: 'string won’t come', angle: 'worm’s-eye', at: 'He cannot pull the string' },
			{ id: 'tabal-bow-stop', role: 'Stop!', angle: 'ECU', at: 'Stop!' },`
	);
}
if (!seq.includes('onjo-biryu-well-watch')) {
	seq = seq.replace(
		`{ id: 'jumong-death-bow', role: 'the bow waits', angle: 'dutch empty yard', at: 'the bow waits on packed earth' }`,
		`{ id: 'onjo-biryu-well-watch', role: 'two sons at the well', angle: 'dutch well', at: 'Onjo and Biryu watch the well' },
			{ id: 'jumong-death-bow', role: 'the bow waits', angle: 'dutch empty yard', at: 'the bow waits on packed earth' }`
	);
}

fs.writeFileSync(SEQ, seq);
console.log('jumong story fill patched');
