/**
 * Put Jumong cinema lock-lines back into the chapter.
 * Each missing `at` is buried in the beat it was shot for.
 * node scripts/.cache/restore-jumong-scenes.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
let entry = null;
for (const ch of story) {
	for (const e of ch.entries ?? []) {
		if (e.title === 'Jumong') entry = e;
	}
}
if (!entry) throw new Error('no Jumong entry');

for (const b of entry.blocks) {
	if (typeof b.html === 'string' && b.html.includes('<b>Daeso</b> stands too close')) {
		b.html = b.html.replace('<b>Daeso</b> stands too close', 'Daeso stands too close');
	}
}

function textOf(b) {
	switch (b.kind) {
		case 'p':
		case 'cite':
		case 'moral':
		case 'monologue':
		case 'quote':
			return (b.html || '') + ' ' + (b.ko || '');
		case 'dialogue':
			return [...(b.lines || []), ...(b.en || [])].join(' ');
		case 'scene':
		case 'day':
			return [b.label, b.ko].filter(Boolean).join(' ');
		default:
			return '';
	}
}

function norm(s) {
	return s
		.replaceAll('\u2019', "'")
		.replaceAll('\u2018', "'")
		.replaceAll('\u2014', '-')
		.replaceAll('\u2013', '-')
		.replaceAll('\u2026', '...');
}

const byNorm = new Map();
const nsfwOnly = new Set();
const seenAt = new Set();
for (const im of entry.images ?? []) {
	if (!im.at) continue;
	const at = im.at.trim();
	if (!byNorm.has(norm(at))) {
		byNorm.set(norm(at), { at, sfw: 0, nsfw: 0 });
	}
	const rec = byNorm.get(norm(at));
	if (im.nsfw) rec.nsfw++;
	else rec.sfw++;
	seenAt.add(at);
}

const present = new Set();
for (const b of entry.blocks) {
	const t = textOf(b).toLowerCase();
	for (const { at } of byNorm.values()) {
		if (t.includes(at.toLowerCase())) present.add(at);
	}
}
const missing = [...byNorm.values()].map((r) => r.at).filter((at) => !present.has(at));
for (const { at, sfw } of byNorm.values()) {
	if (sfw === 0) nsfwOnly.add(at);
}

if (entry.blocks.some((b) => (b.html || '').includes('The sky is empty first'))) {
	console.log('Jumong scenes already restored');
	process.exit(0);
}

const used = new Set();
function exact(key) {
	const rec = byNorm.get(norm(key));
	if (!rec) throw new Error('not a lock-line: ' + key);
	if (used.has(rec.at)) throw new Error('lock-line used twice: ' + rec.at);
	used.add(rec.at);
	return rec.at;
}
function fill(s, at) {
	return s.replaceAll('{{at}}', at);
}

const CHIP = {
	haemosu: '#7fc4e8',
	yuhwa: '#8fc4e0',
	hwahye: '#8a62c4',
	wihye: '#4fad72',
	habek: '#3E79E4',
	geumwa: '#a89a72',
	jumong: '#e8563f',
	daeso: '#9b8f6a',
	galsa: '#6b8f4a',
	sosuno: '#e8a04a',
	yeontabal: '#a97c4a',
	ladyye: '#c4a882',
	songyang: '#c4a35a',
	oi: '#8d8d95',
	mari: '#7a7a82',
	hyupbo: '#6a6a72',
	onjo: '#d9b13a',
	biryu: '#6fa8ff',
	haewonmek: '#6b5b6e',
	teal: '#2eb8c4',
	plum: '#c45a7a',
	girl: '#d4a0b0',
	scout: '#8d8d95'
};

const SPEAKER = new Set(['teal', 'plum', 'girl', 'scout']);

function P(at, html, ko) {
	return { kind: 'p', at, html, ko };
}
function R(html, ko) {
	return { kind: 'rawp', html, ko };
}
function D(who, at, ko, more = []) {
	return {
		kind: 'd',
		who,
		at,
		en: ['{{at}}', ...more.map((m) => m[0])],
		lines: [ko, ...more.map((m) => m[1])]
	};
}
function T(who, pairs) {
	return { kind: 'talk', who, pairs };
}
function SC(label, ko) {
	return { kind: 'scene', label, ko };
}

function materialize(specs) {
	const made = [];
	for (const spec of specs) {
		if (spec.kind === 'scene') {
			made.push({ block: { kind: 'scene', label: spec.label, ko: spec.ko }, ats: [] });
			continue;
		}
		if (spec.kind === 'rawp') {
			made.push({ block: { kind: 'p', html: spec.html, ko: spec.ko }, ats: [] });
			continue;
		}
		if (spec.kind === 'p') {
			const at = exact(spec.at);
			const html = fill(spec.html, at);
			if (!html.toLowerCase().includes(at.toLowerCase())) {
				throw new Error('paragraph dropped its line: ' + at);
			}
			made.push({ block: { kind: 'p', html, ko: spec.ko }, ats: [at] });
			continue;
		}
		if (spec.kind === 'talk') {
			const block = {
				kind: 'dialogue',
				chip: CHIP[spec.who] || '#8d8d95',
				en: spec.pairs.map((p) => p[0]),
				lines: spec.pairs.map((p) => p[1])
			};
			if (SPEAKER.has(spec.who)) block.speaker = spec.who[0].toUpperCase() + spec.who.slice(1);
			else block.person = spec.who;
			made.push({ block, ats: [] });
			continue;
		}
		if (spec.kind === 'd') {
			const at = exact(spec.at);
			const en = spec.en.map((s) => fill(s, at));
			const lines = spec.lines;
			if (en.length !== lines.length) throw new Error('dialogue length: ' + spec.at);
			const blob = [...en, ...lines].join(' ');
			if (!blob.toLowerCase().includes(at.toLowerCase())) {
				throw new Error('dialogue dropped its line: ' + at);
			}
			const block = {
				kind: 'dialogue',
				chip: CHIP[spec.who] || '#8d8d95',
				en,
				lines
			};
			if (SPEAKER.has(spec.who)) block.speaker = spec.who[0].toUpperCase() + spec.who.slice(1);
			else block.person = spec.who;
			made.push({ block, ats: [at] });
			continue;
		}
		throw new Error('bad spec');
	}
	return made;
}

function has(hay, needle) {
	return norm(hay).includes(norm(needle));
}
function findHtml(needle) {
	const i = entry.blocks.findIndex((b) => has(b.html || '', needle));
	if (i < 0) throw new Error('anchor missing: ' + needle);
	return i;
}
function findEn(needle) {
	const i = entry.blocks.findIndex((b) => (b.en || []).some((l) => has(String(l), needle)));
	if (i < 0) throw new Error('en anchor missing: ' + needle);
	return i;
}
function findScene(label) {
	const i = entry.blocks.findIndex((b) => b.kind === 'scene' && b.label === label);
	if (i < 0) throw new Error('scene missing: ' + label);
	return i;
}

const ops = [];
function insert(index, specs, order = 0) {
	ops.push({ index, deleteCount: 0, order, made: materialize(specs) });
}
function replace(index, deleteCount, specs, order = 0) {
	ops.push({ index, deleteCount, order, made: materialize(specs) });
}

// ——— sky and empty Amnok, before the myth starts ———
insert(0, [
	P('The sky is empty first', '{{at}}. The dragons are still in the yoke, and the hour is not a road yet.', '하늘이 먼저 비어 있다. 용은 아직 멍에에 있고, 시각은 아직 길이 아니다.'),
	P('Dawn run is a cool gold stamp', '{{at}} on a sky that has not picked a river.', '새벽 운행은 강을 고르지 않은 하늘 위의 서늘한 금빛 도장이다.'),
	P('He drives the dawn hour', '{{at}} with one palm on the rail, laughing at nothing in particular.', '그는 난간에 손바닥을 얹고 새벽 시각을 몬다. 딱히 누구한테도 아닌 웃음.'),
	P('Usual run: five dragons across the noon sky', '{{at}}. Gold, crimson, azure, jade, white. The same joke they tell the sun every day.', '늘 하던 운행. 용 다섯이 한낮 하늘을 가른다. 금, 진홍, 푸른색, 비취, 흰. 해에게 매일 하는 같은 농담.'),
	P('A tiny gold chariot cuts the noon', '{{at}}, small enough that the river has not earned a look yet.', '작은 금 수레가 한낮을 가른다. 강이 아직 한 번 볼 값을 못 할 만큼 작다.'),
	P('From earth the chariot is a stamp', '{{at}}, a gold fleck and a wheel, nothing a bather could call a face.', '땅에서 보면 수레는 도장이다. 금빛 점과 바퀴. 목욕하는 사람이 얼굴이라 부를 만한 건 없다.'),
	P('Dutch streak keeps the hour', '{{at}}. The rail stays level. The sky does not.', '기울어진 궤적이 시각을 지킨다. 난간은 평평하다. 하늘은 아니다.'),
	P('Same rail under his palms', '{{at}}, the wood he has driven since before the river had daughters.', '같은 난간이 손바닥 아래, 강에 딸이 생기기 전부터 몰던 나무.'),
	P('looks down from the sky', 'He {{at}} because the noon flashed, not because anyone called.', '하늘에서 내려다본다. 누가 불러서가 아니다. 한낮이 번뜩여서.'),
	P('stands in the chariot', 'He {{at}} the way a man stands in a doorway he owns, one hip on the rail.', '수레에 선다. 제 문간에 서듯, 엉덩이 한쪽은 난간.'),
	P('Dusk on the Amnok is a low gold bar', '{{at}} where the water takes the last of the run.', '압록의 해질녘은 낮은 금빛 막대다. 물이 운행의 마지막을 받는 자리.'),
	P('Dusk run leans on the rail', '{{at}}, elbow down, the hour almost spent and not sorry.', '해질 운행은 난간에 기댄다. 팔꿈치, 거의 다 쓴 시각, 미안함은 없다.'),
	P('Night stars keep the same route', '{{at}}. The chariot does not invent a second sky.', '밤의 별이 같은 길을 지킨다. 수레가 다른 하늘을 만들지 않는다.'),
	P('Night drive over a dark ribbon', '{{at}}. Below, the Amnok is a line he is not supposed to break.', '어두운 띠 위로 밤 운행. 아래 압록은 깨면 안 되는 선이다.'),
	P('Dawn on the Amnok is a cool bar', '{{at}} of wet stone and no daughters yet.', '압록의 새벽은 서늘한 막대다. 젖은 돌, 딸은 아직 없다.'),
	P('Morning shallows hold no boat', '{{at}}. Clothes have not been folded. The rocks are only rocks.', '아침 여울에 배가 없다. 옷이 개어져 있지 않다. 바위는 그냥 바위다.'),
	P('Daylight Amnok still has a hard key', '{{at}}, one shaft on the water, the rest of the bank in crush.', '한낮 압록에도 단단한 빛이 있다. 물 위의 한 줄기, 강턱의 나머지는 눌린 그늘.'),
	P('The Amnok is empty water first', '{{at}}. Then it is a place where three women might stand.', '압록은 먼저 빈 물이다. 그다음에야 여자 셋이 설 수 있는 곳이다.'),
	P('Then the Amnok flashes under the wheel', '{{at}}, and the hour in his hands forgets its name.', '그러고 바퀴 아래로 압록이 번뜩인다. 손안의 시각이 제 이름을 잊는다.')
]);

// ——— sisters in the shallows ———
insert(findHtml('leave their clothes on the rocks') + 1, [
	P(
		'Hwahye and Wihye leave their silk on the rocks',
		'{{at}}. Eldest folds once. The middle does not bother. Yuhwa’s ice-blue is still on her shoulder, wet.',
		'화혜와 위혜가 비단을 바위 위에 둔다. 언니는 한 번 접는다. 둘째는 귀찮다. 유화의 얼음빛은 아직 어깨에, 젖어 있다.'
	),
	P('There are three of you', 'From the rail the count is stupid and exact. {{at}}.', '난간에서 세면 바보 같고 정확하다. 셋이다.'),
	P(
		'Yuhwa kneels in the shallows',
		'{{at}}, hair a dark rope in one fist, the other hand still in the river as if the river had asked.',
		'유화가 여울에 무릎을 꿇는다. 머리는 한 손에 검은 밧줄, 다른 손은 강이 물은 것처럼 아직 물속.'
	),
	P(
		'She rinses the river from her hair',
		'{{at}} and does not hurry. Heaven can wait on a rinse. She has decided that without saying it.',
		'강물을 머리에서 헹군다. 서두르지 않는다. 하늘은 헹굼을 기다려도 된다. 말은 안 했는데, 그렇게 정했다.'
	),
	P(
		'Chin up, mouth already wanting',
		'{{at}}. She has not been introduced. The mouth does not care.',
		'턱은 올라가고, 입은 이미 원한다. 인사도 안 했다. 입은 상관하지 않는다.'
	)
]);

// ——— the dive ———
insert(findHtml('The older sisters dive'), [
	T('hwahye', [
		['Hey. In.', '야. 들어가.'],
		['Now. You hear me?', '지금. 안 들려?']
	]),
	P(
		'Hwahye dives first and does not look back',
		'{{at}}. The eldest treats the sky like a timetable she will not miss.',
		'화혜가 먼저 잠수하고 뒤를 안 본다. 언니는 하늘을 놓치면 안 되는 시간표처럼 다룬다.'
	),
	T('wihye', [
		['Pfft— wait up.', '푸핫, 언니 기다려.'],
		['Whatever, I’m going.', '아 몰라, 나 먼저.']
	]),
	P('Wihye laughs and follows', '{{at}}, a splash that is mostly amusement.', '위혜가 웃으며 따라간다. 물보라의 대부분이 재미다.'),
	D('yuhwa', "Go. I'm here.", '가. 난 여기.', [['…I was going to say don’t look up.', '…올려다보지 마, 라고 하려고.']]),
	P('Two wakes cut the shallows', '{{at}}. Two. The third body is still standing.', '물살 두 줄이 여울을 가른다. 둘. 세 번째 몸은 아직 서 있다.'),
	P(
		'Two wakes cut the shallows; Yuhwa stays',
		'{{at}}. She watches the wakes close and does not pick one.',
		'물살 두 줄이 여울을 가르고, 유화는 남는다. 물살이 닫히는 걸 보고, 어느 쪽도 고르지 않는다.'
	),
	P(
		'Yuhwa is the only one who does not run',
		'{{at}}. The river has three daughters. Only one of them is still a person the sun can talk to.',
		'도망가지 않는 건 유화뿐이다. 강의 딸이 셋이다. 해와 말할 수 있는 사람으로 남은 건 하나.'
	)
]);

// ——— flirt before he builds the copper ———
insert(findHtml('He comes down. He builds a copper'), [
	P('He forgets the hour on her face', '{{at}}. The rail is still in his hands. The schedule is not.', '그녀의 얼굴 앞에서 시각을 잊는다. 난간은 아직 손안에 있다. 일정은 아니다.'),
	P('He forgets how to swallow', '{{at}}. A god, doing a mortal’s small panic.', '삼키는 법을 잊는다. 신이, 인간의 작은 공황을 한다.'),
	P(
		'He leans over the gold rail and drops the hour',
		'{{at}} the way a man drops a cup he meant to keep.',
		'금 난간 위로 기울여 시각을 떨어뜨린다. 지키려던 잔을 놓듯.'
	),
	P('He grins and leaves the rail', '{{at}}, and the grin arrives before the plan.', '웃으며 난간을 떠나고, 계획보다 웃음이 먼저다.'),
	P('He grins and leaves the rail.', '{{at}} Water takes him at the knee.', '웃으며 난간을 떠난다. 물이 무릎에서 받는다.'),
	P('He leaves the rail and the hour', '{{at}} in the same motion, and the dragons keep the joke without him.', '난간과 시각을 같은 동작으로 떠난다. 용들은 그 없이 농담을 잇는다.'),
	P('She does not run.', '{{at}} Wet silk, chin up, the shallows to her thighs.', '도망가지 않는다. 젖은 비단, 턱, 허벅지까지 오는 여울.'),
	P(
		'He wades close. She does not run.',
		'{{at}} He stops where a stranger should stop. Then he doesn’t.',
		'가까이 걸어 들어온다. 그녀는 도망가지 않는다. 낯선 사람이 설 자리에서 선다. 그러고 안 선다.'
	),
	D('haemosu', "Why didn't you run away", '왜 안 도망갔어.', [['Your sisters did.', '언니들은 했는데.']]),
	D('yuhwa', "didn't see any reason", '…이유가 안 보여서요.', [['The water’s cold. You’re warm. That’s the whole account.', '물은 차갑고. 당신은 따뜻하고. 장부는 그게 다예요.']]),
	D('haemosu', 'looking directly at the sun', '해를 똑바로 보면', [['you burn.', '덴다.']]),
	D('yuhwa', 'oh, is that so', '아, 그래요.', [['Then I should blink.', '그럼 깜빡여야겠네요.']]),
	D('haemosu', 'burn your eyes out', '눈 다 탄다.', [['I’m not a lamp.', '난 등잔이 아니야.']]),
	D('yuhwa', 'like what I see', '보는 게… 좋아요.', [['Don’t make me say it twice.', '두 번 말하게 하지 마요.']]),
	D('yuhwa', "I'm looking anyway.", '어차피 보고 있는데요.', [['You came down.', '내려오셨잖아요.']]),
	D('yuhwa', 'And I kind of- like it.', '그리고 좀… 좋은데요.', [['The looking.', '보는 거요.']]),
	P('He swallows.', '{{at}} The grin survives it. Barely.', '그가 삼킨다. 웃음은 산다. 간신히.'),
	P(
		'does the sun like what it sees',
		'She tips her mouth and asks if the {{at}}, silk already losing the argument with the water.',
		'입을 기울여 묻는다. 해는 보이는 게 좋으냐고. 비단은 이미 물과의 말다툼에서 지고 있다.'
	),
	D('yuhwa', 'This way. The bank.', '이쪽이요. 강턱.', [['The sky has too many sisters.', '하늘엔 언니가 너무 많아요.']]),
	R(
		'He follows like the hour had been her idea. The shallows take them both at the knee.',
		'시각이 그녀의 생각이었다는 듯이 따라간다. 여울이 둘의 무릎을 받는다.'
	)
]);

// ——— copper ———
insert(findHtml('The copper is already hot'), [
	P('The copper stands empty', '{{at}} on the bank, a kiln with no fire in it yet, the door a dark mouth.', '구리가 강턱에 빈 채로 서 있다. 아직 불 없는 가마, 문은 어두운 입.'),
	P(
		'The copper room rises on the bank like a kiln',
		'{{at}}. He builds it the same afternoon, because the open sky has become too many witnesses.',
		'구리 방이 강턱에 가마처럼 올라온다. 같은 날 오후 짓는다. 열린 하늘이 너무 많은 증인이 되어서.'
	),
	P(
		'She kisses him with river still on her mouth',
		'{{at}}. The kiss tastes like the shallows. He makes a sound he will deny.',
		'입에 강이 남은 채로 그를 입 맞춘다. 키스는 여울 맛이다. 그는 나중에 부인할 소리를 낸다.'
	),
	P('Off-shoulder on the copper', '{{at}}, ice-blue slipped, the wall already keeping her heat.', '구리를 맨 어깨. 얼음빛이 미끄러지고, 벽이 이미 그녀의 열을 간직한다.'),
	P('Look-back against the kiln', 'A {{at}}. She checks that he is still wrecked. He is.', '가마에 기댄 뒤돌아봄. 그가 아직 망가졌는지 확인한다. 그렇다.'),
	P('The copper keeps the afternoon', '{{at}}. Outside, the river goes on being a river.', '구리가 오후를 간직한다. 밖에서는 강이 계속 강이다.'),
	P('Pinned to the copper, she does not look away', '{{at}}. Gold on wet skin. Her mouth stays open like an answer.', '구리에 눌린 채 시선을 안 피한다. 젖은 살 위의 금. 입은 대답처럼 열려 있다.'),
	P('Wet silk hiked, gold light as a hard plane', '{{at}} across her hip, not a halo, a cut of sun.', '젖은 비단이 걷히고, 금빛이 단단한 면으로 엉덩이를 가른다. 후광이 아니다. 해의 칼날.'),
	P('Her face goes wanting against the wall-heat', '{{at}}. Blush, bitten lip, the kiln answering in her cheek.', '벽의 열에 얼굴이 원하게 된다. 홍조, 깨문 입술, 뺨에서 대답하는 가마.'),
	P(
		'From his shoulder: her ice-blue back on copper',
		'{{at}}. He watches the silk lose.',
		'그의 어깨 너머로, 구리 위의 얼음빛 등. 비단이 지는 걸 본다.'
	),
	P(
		'Dutch two-shot: sun and river sharing one mouth',
		'{{at}}. The frame tilts because the kiss does.',
		'기울어진 투 숏. 해와 강이 입 하나를 나눈다. 화면이 기운다. 키스가 기울어서.'
	),
	D('yuhwa', 'Look back if you want it.', '원하면 뒤돌아봐요.', [['I’m not going to ask twice.', '두 번은 안 물어요.']]),
	P('She hikes the ice-blue from behind', '{{at}}, both hands, a dare with a hem.', '뒤에서 얼음빛을 걷어 올린다. 두 손. 단으로 하는 도전.'),
	P('bounce that tight little ass', 'He gets a handful and she tells him to {{at}} like the kiln had a tempo.', '한 줌을 잡으니 가마에 박자가 있다는 듯이, 그 작은 엉덩이를 튕기라고 한다.'),
	P("Worm's-eye: her hips own the copper", '{{at}}. The wall is a dark wedge. She is the bright part.', '벌레의 시점. 그녀의 엉덩이가 구리를 차지한다. 벽은 어두운 쐐기. 밝은 부분은 그녀다.'),
	P('몸매 is insane', 'He says it against her neck, wrecked and delighted: {{at}}.', '목덜미에 대고 말한다. 망가지고 기뻐하며. 몸매가 미쳤다고.'),
	D('yuhwa', 'Give me- all of it', '다 줘요.', [['Don’t save any.', '아껴 두지 마요.']])
]);

// ——— Habek, exile, Buyeo gates ———
replace(findHtml('Habek</b> casts her out'), 1, [
	SC("Habek's Court", '하백의 조정'),
	P(
		'The Amnok keeps its own court',
		'The copper is still warm when the river notices. {{at}}. Habek stands on the wet stones as if the current were a hall.',
		'구리가 아직 따뜻할 때 강이 알아챈다. 압록은 제 조정이 있다. 하백이 젖은 돌 위에 선다. 여울이 대청인 것처럼.'
	),
	P('Mist is the dais', '{{at}}. He does not need a chair. The fog does the rank for him.', '안개가 대좌다. 의자가 필요 없다. 안개가 품계를 한다.'),
	D('habek', 'Who stopped the chariot.', '수레를 멈춘 게 누구냐.'),
	D('habek', 'Who stopped the chariot. Say a name.', '수레를 멈춘 게 누구냐. 이름을 대라.'),
	D('yuhwa', 'I... looked up.', '저… 올려다봤어요.'),
	D('yuhwa', 'I just- looked.', '그냥… 봤어요.', [['That’s all it was.', '그게 다였어요.']]),
	D('habek', "You don't sleep in my mist after that", '그 다음엔 내 안개에서 자지 못한다.', [
		['You smell like copper.', '구리 냄새가 난다.']
	]),
	D('habek', 'Go. The bank is closed.', '가라. 이 강턱은 닫았다.'),
	P(
		'Hwahye and Wihye do not argue the sentence',
		'{{at}}. Eldest watches the current. The middle watches the copper glow die. Neither looks at their father’s face.',
		'화혜와 위혜는 판결을 논하지 않는다. 언니는 여울을 본다. 둘째는 죽어 가는 구리 빛을 본다. 둘 다 아버지 얼굴은 안 본다.'
	),
	P('Habek kicks Yuhwa out', '{{at}} with a look, not a foot. The bank understands.', '하백이 유화를 내쫓는다. 발이 아니라 눈으로. 강턱이 알아듣는다.'),
	P(
		'Habek finds the kiln still warm and casts her out',
		'{{at}}. The afternoon is still in the copper. She does not get to take it.',
		'하백이 아직 따뜻한 가마를 보고 그녀를 내쫓는다. 오후가 아직 구리 안에 있다. 가져가게 두지 않는다.'
	),
	P('She follows behind.', 'The road takes her south. {{at}} Bare feet, ice-blue gone dull with dust.', '길이 남쪽으로 데려간다. 그녀가 뒤를 따른다. 맨발, 먼지에 탁해진 얼음빛.'),
	P('leaves pawprints', 'A fox-shaped quiet {{at}} in the wet margin, and then she is a woman again, walking.', '여우의 조용함이 젖은 가장자리에 발자국을 남긴다. 그러고 다시 여자가 되어 걷는다.'),
	P(
		'The capital is a palisade from the river',
		'{{at}}, timber teeth, a hill of roofs, weather still attached to the sky.',
		'수도는 강에서 보면 목책이다. 나무 이빨, 지붕의 언덕, 하늘에는 아직 날씨가 붙어 있다.'
	),
	P('Iron-boss doors keep the river', '{{at}} out of the yard. She stands small in front of the studs.', '쇠 장식 문이 강을 마당 밖에 둔다. 그녀는 못 장식 앞에 작게 선다.'),
	P('The river-capital opens', '{{at}} on a path of packed earth and red-brown timber. Not a dream of a city. A city.', '강수도가 열린다. 다진 흙과 적갈색 나무의 길. 도시의 꿈이 아니다. 도시다.'),
	D('geumwa', "Come in. I've got a room free.", '들어와. 빈 방이 있다.', [['The yard can learn your name later.', '이름은 마당이 나중에 알아도 된다.']]),
	P('the hall is empty timber', 'Inside, {{at}}, a beam, a mat, daylight in a hard bar across the floor.', '안에는 빈 나무 대청. 들보, 자리, 바닥을 가로지르는 단단한 낮빛.'),
	P('A sun-shaft finds her', '{{at}} where she kneels to wring the river out of her sleeve.', '해 한 줄기가 그녀를 찾는다. 소매에서 강을 짜내려고 무릎 꿇은 자리.'),
	P(
		"Yuhwa's ice-blue sleeve is the first roof",
		'{{at}} the boy will remember, though he is not a boy yet.',
		'유화의 얼음빛 소매가 첫 지붕이다. 아이는 그걸 기억할 것이다. 아직 아이가 아닌데.'
	),
	P('Morning Buyeo is a packed-earth square', '{{at}} under a real sky, giwa on the hill, wash-water in the ditch.', '아침 부여는 다진 흙의 사각형이다. 진짜 하늘, 언덕의 기와, 도랑의 빨래물.'),
	P('Day Buyeo keeps a hard key', '{{at}}. Shadow is a thing with edges. The yard is not a wash of gold.', '낮의 부여는 단단한 빛을 지킨다. 그늘은 모서리가 있다. 마당이 금빛으로 풀리지 않는다.'),
	P(
		'From the roof the yard is a packed-earth square',
		'{{at}}, three small bodies and a stake, the hall a dark bar at the top of the frame.',
		'지붕에서 보면 마당은 다진 흙의 사각형이다. 작은 몸 셋과 말뚝, 화면 위의 어두운 막대가 대청.'
	),
	P('The packed-earth yard tilts', '{{at}} under a dutch sky, the stake a nail in the square.', '다진 흙 마당이 기운다. 기울어진 하늘 아래, 말뚝은 사각형에 박힌 못.'),
	P('The river-edge is a real bank', '{{at}}, reeds, a wet path, the palisade throwing a long afternoon shadow.', '강가는 진짜 둑이다. 갈대, 젖은 길, 목책이 길게 던지는 오후 그늘.'),
	P('The Buyeo night is a sky', '{{at}} with stars that mind their business, and one window still lit.', '부여의 밤은 하늘이다. 제 일을 보는 별, 아직 켜진 창 하나.'),
	P(
		'moves; the yellow follows',
		'She crosses the night yard and the sun-shaft {{at}}, a bar of gold keeping her sleeve.',
		'밤 마당을 건너면 해 줄기가 움직이고, 노란 빛이 따른다. 소매를 지키는 금빛 막대.'
	)
]);

const { addMore } = await import('./restore-jumong-more.mjs');
addMore({ insert, replace, findHtml, findEn, findScene, P, D, T, R, SC });

ops.sort((a, b) => b.index - a.index || b.order - a.order);
const owned = new Map();
for (const op of ops) {
	const blocks = [];
	for (const item of op.made) {
		const t = textOf(item.block).toLowerCase();
		const hits = missing.filter((at) => t.includes(at.toLowerCase()));
		if (hits.length && hits.every((at) => nsfwOnly.has(at))) item.block.nsfw = true;
		for (const at of item.ats) owned.set(at, item.block);
		blocks.push(item.block);
	}
	entry.blocks.splice(op.index, op.deleteCount, ...blocks);
}

const early = [];
const unmatched = [];
for (const at of missing) {
	const i = entry.blocks.findIndex((b) => textOf(b).toLowerCase().includes(at.toLowerCase()));
	if (i < 0) unmatched.push(at);
	else if (owned.get(at) && entry.blocks[i] !== owned.get(at)) {
		early.push(at + ' || hit: ' + textOf(entry.blocks[i]).replace(/\s+/g, ' ').slice(0, 90));
	}
}
const unused = missing.filter(
	(at) => !used.has(at) && !entry.blocks.some((b) => textOf(b).toLowerCase().includes(at.toLowerCase()))
);
if (unmatched.length || early.length || unused.length) {
	console.log('UNUSED', unused.length);
	unused.forEach((s) => console.log('  U', JSON.stringify(s)));
	console.log('UNMATCHED', unmatched.length);
	unmatched.forEach((s) => console.log('  M', JSON.stringify(s)));
	console.log('EARLY', early.length);
	early.forEach((s) => console.log('  E', s));
	process.exit(1);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('restored', missing.length, 'lock-lines;', entry.blocks.length, 'blocks');
