// Yeon Taejo pass: the father behind the Eastern Command.
// 634 Summit: the son goes in the old man's place. 629 Nangbi: the High Commander's
// house, the report read a third time. 642: the feast celebrates the Eastern Command.
// Usage: node scripts/.cache/yeon-taejo-pass.mjs [--dry]
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const BACKUP = 'scripts/.cache/prev-stills/story.pre-yeon-taejo.json';
const DRY = process.argv.includes('--dry');

const raw = fs.readFileSync(STORY, 'utf8');
const story = JSON.parse(raw);
const entries = story.flatMap((c) => c.entries);

if (entries.some((e) => e.blocks.some((b) => b.person === 'yeontaejo'))) {
	console.log('yeon taejo pass already applied');
	process.exit(0);
}

function textOf(b) {
	switch (b.kind) {
		case 'p':
		case 'cite':
		case 'moral':
		case 'monologue':
		case 'quote':
			return b.html + ' ' + (b.ko ?? '');
		case 'dialogue':
			return [...b.lines, ...(b.en ?? [])].join(' ');
		case 'scene':
			return (b.label ?? '') + ' ' + (b.ko ?? '');
		case 'flashback':
			return (b.title ?? '') + ' ' + (b.year ?? '') + ' ' + b.blocks.map(textOf).join(' ');
		default:
			return JSON.stringify(b);
	}
}

const anchorOf = (en, im) =>
	im.at ? en.blocks.find((b) => textOf(b).toLowerCase().includes(im.at.toLowerCase())) : undefined;

const before = new Map();
for (const en of entries) for (const im of en.images ?? []) before.set(im, anchorOf(en, im));

const E = (title) => {
	const en = entries.find((e) => e.title === title);
	if (!en) throw new Error(`missing entry ${title}`);
	return en;
};

function find(en, pred, what) {
	const hits = en.blocks.filter(pred);
	if (hits.length !== 1) throw new Error(`${en.title}: ${hits.length} blocks match ${what}`);
	return hits[0];
}

const has = (needle) => (b) => textOf(b).includes(needle);

function insertAfter(en, anchor, blocks) {
	en.blocks.splice(en.blocks.indexOf(anchor) + 1, 0, ...blocks);
}

function insertBefore(en, anchor, blocks) {
	en.blocks.splice(en.blocks.indexOf(anchor), 0, ...blocks);
}

function swap(b, field, from, to) {
	if (!b[field]?.includes(from)) throw new Error(`swap: “${from}” not in ${field}`);
	b[field] = b[field].replace(from, to);
}

const TAEJO = '#8f3a2e';
const GESOMUN = '#d0362f';

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const d = (person, chip, en, ko) => ({ kind: 'dialogue', chip, person, lines: ko, en });
const taejo = (en, ko) => d('yeontaejo', TAEJO, en, ko);
const gesomun = (en, ko) => d('gesomun', GESOMUN, en, ko);

// ————— 634 · The Summit: the son goes in his father's place —————
{
	const en = E('The Summit');
	const whyGo = find(en, has('why do you have to go to Pyongyang'), 'why-go line');
	insertBefore(en, whyGo, [
		p(
			'The summons is not addressed to him. The Eastern Commander is still his father, <b>Yeon Taejo</b>, who sat the High Command in Pyongyang for twelve years, came home to the east when his brother Gusesa took the chair, and is now too old to sit a horse as far as the capital. The son has done the work for years. The seal is still the old man’s.',
			'소집장은 그에게 온 것이 아니다. 동부의 대가는 여전히 그의 아버지 <b>연태조</b>다. 열두 해 동안 평양에서 막리지 자리에 앉았다가, 아우 구세사가 그 자리를 잇자 동쪽으로 돌아온 노인. 이제는 도성까지 말을 타고 갈 기력이 없다. 일은 몇 해째 아들이 해 왔다. 인장만은 아직 노인의 것이다.'
		),
		taejo(
			['Take the seal. You sit in my place this year.', '…And say half of what you think.'],
			['인장 가져가라. 올해는 네가 내 자리에 앉는다.', '…그리고 생각한 것의 반만 말해.']
		)
	]);
	whyGo.en = ['Me? Why do I have to go to Pyongyang?', 'It’s a place where mouths open only to say useless things…'];
	whyGo.lines = ['제가요? 평양엔 제가 왜 가야 합니까?', '어차피 쓸데없는 소리나 하려고 주둥이 벌리는 데인데...'];
	insertAfter(en, whyGo, [
		taejo(['I know. I sat in it for twelve years.', 'Half, son. Half.'], ['안다. 내가 열두 해를 앉아 있었다.', '반만이다, 개소문아. 반만.'])
	]);
	const heads = find(en, has('a gathering of all Five Commanderies'), 'summit p');
	swap(heads, 'html', 'of Goguryeo.', 'of Goguryeo, in his father’s place.');
	swap(heads, 'ko', '평양으로 향한다.', '평양으로 향한다. 아버지를 대신해서다.');
}

// ————— 629 · Nangbi: the High Commander's house —————
{
	const en = E('Nangbi');
	const sword = find(en, (b) => b.person === 'gesomun' && textOf(b).includes('Silla’s sword.'), 'sword line');
	insertAfter(en, sword, [
		scene('The High Commander’s House', '막리지의 집'),
		p(
			'The Yeon family lives in Pyongyang these years, in the big house below the palace hill, because the High Commander is Gesomun’s father, <b>Yeon Taejo</b>. He has held the chair for ten years, long enough to outlive most of the men who voted for him and none of the ones who voted against. Most nights he comes home from the Summit in a silence the servants have learned to walk around.',
			'이 무렵 연씨 집안은 평양, 왕궁 언덕 아래 큰 집에 산다. 막리지가 개소문의 아버지 <b>연태조</b>이기 때문이다. 그는 그 자리를 십 년째 지키고 있다. 그를 밀어준 사람들은 대부분 먼저 죽었고, 반대한 사람들은 하나도 죽지 않았다. 거의 매일 밤 그는 회의에서 말없이 돌아오고, 하인들은 그 침묵을 비켜 다니는 법을 익혔다.'
		),
		p(
			'Tonight he does not take off his boots. He sits at the low table with a copy of the Nangbi report, the one the king asked to hear twice, and reads it a third time with his finger under the lines.',
			'오늘 밤 그는 신도 벗지 않는다. 낮은 상 앞에 앉아, 왕이 두 번 읽으라 한 낭비성 보고의 사본을 펼쳐 놓고, 손가락으로 줄을 짚어 가며 세 번째로 읽는다.'
		),
		gesomun(
			['Father. You’re still on that?', 'It’s one fortress. We take it back by spring.'],
			['아버지. 아직도 그거 보십니까?', '성 하나입니다. 봄이면 도로 찾습니다.']
		),
		taejo(
			['Sit.', '…Five thousand heads. Off one charge. How many men have you seen do that?'],
			['앉아라.', '…오천 수급이다. 한 번 뛰어들어서. 그런 놈을 몇이나 봤느냐?']
		),
		gesomun(['One.', 'You. At the Great River.'], ['하나요.', '아버지. 살수에서.']),
		taejo(
			['I had thirty thousand men and a river on my side.', 'He had a ditch and a horse.'],
			['나한텐 삼만 군사가 있었고 강도 우리 편이었다.', '이놈은 도랑 하나에 말 한 필이다.']
		),
		p(
			'Gesomun has seen his father angry, drunk and bleeding, and once, when he was seven, riding home from the Great River with a Sui banner rolled under his arm like a bolt of cloth. He has never seen him frightened of a piece of paper. He finds he does not know where to put his hands.',
			'개소문은 아버지가 화내는 것도, 취한 것도, 피 흘리는 것도 보았다. 일곱 살 때는 수나라 깃발을 비단 한 필처럼 옆구리에 말아 끼고 살수에서 돌아오는 것도 보았다. 종이 한 장을 두려워하는 아버지는 처음 본다. 손을 어디 둬야 할지 모르겠다.'
		),
		taejo(
			['Thirty-four, and still a banner captain. Silla won’t let a Gaya grandson climb any faster.', 'They’re wasting him. They won’t waste him forever.'],
			['서른넷에 아직 당주다. 신라 놈들이 가야 손자를 더 빨리 올려 줄 리가 없지.', '썩히고 있는 거다. 언제까지나 썩히진 않을 거고.']
		),
		gesomun(['Then I’ll kill him before they stop.'], ['그럼 그 전에 제가 죽이면 됩니다.']),
		taejo(
			['You’ll try.', 'Listen to me. Never on a field he picked. Never when you’re angry. And when this city tells you he’s only a captain, don’t believe it.'],
			['해 보겠지.', '잘 들어라. 그놈이 고른 땅에선 절대 싸우지 마라. 화났을 때도 마라. 그리고 이 도성이 그놈을 고작 당주라고 하거든, 믿지 마라.']
		),
		gesomun(['His Majesty already did.'], ['전하께서 벌써 그러셨습니다.']),
		taejo(
			[
				'His Majesty heard it twice and asked the Summit what to do.',
				'Do you know what the Summit did? Argued half a day over who pays to rebuild the fort. Nobody said his name. Not once.',
				'Ten years I’ve sat in that room. They’ll lose this country one granary at a time and call it caution.'
			],
			[
				'전하는 두 번 들으시고 회의에 물으셨지.',
				'회의가 뭘 했는지 아느냐? 성 다시 쌓는 값을 누가 낼지 반나절을 싸웠다. 아무도 그놈 이름을 입에 안 올렸어. 한 번도.',
				'십 년을 그 방에 앉아 있었다. 저것들은 곳간 하나씩 이 나라를 잃어버릴 거다. 그러고는 신중했다고 하겠지.'
			]
		),
		p(
			'Euija learns the Eight Great Clans at his father’s table, and Chunchu learns the Harmony Council from the way it walked his grandfather off the throne and kept his father waiting outside its doors. Yeon Gesomun learns Pyongyang here, from an old man reading the same report three times by lamplight because nobody else in the city would read it once.',
			'의자는 아버지의 밥상머리에서 대성팔족을 배우고, 춘추는 화백회의가 할아버지를 왕좌에서 끌어내리고 아버지를 문밖에 세워 둔 방식에서 그것을 배운다. 연개소문은 여기서 평양을 배운다. 도성 안 누구도 한 번 읽지 않는 보고를 등불 아래 세 번 읽는 노인에게서.'
		),
		gesomun(['…Kim Yushin.'], ['…김유신.'])
	]);
	const coda = find(en, has('a report read twice'), 'coda p');
	swap(coda, 'html', 'a hall in Pyongyang and a report read twice.', 'a hall in Pyongyang, a report read twice, and his father reading it a third time.');
	swap(coda, 'ko', '평양의 한 전각과 두 번 읽힌 보고를 떠올린다.', '평양의 한 전각과 두 번 읽힌 보고, 그리고 그것을 세 번째로 읽던 아버지를 떠올린다.');
}

// ————— 642 · Supreme Commander: the feast for the Eastern Command —————
{
	const en = E('Supreme Commander');
	const open = find(en, has('Yeon decides to host a banquet'), 'banquet p');
	open.html =
		'<b>Yeon Taejo</b> dies in the spring, in his own bed in the east. The Eastern Command is his son’s by blood and by a decade of doing the work, and the Summit takes the whole summer to admit it. When it finally does, Yeon decides to host a banquet to celebrate becoming the Eastern Commander. <b>King Youngryu (59)</b> is in attendance.';
	open.ko =
		'봄에 <b>연태조</b>가 동쪽 제 집 자리에서 숨을 거둔다. 동부 대가 자리는 핏줄로 보나 십 년 넘게 대신 일해 온 것으로 보나 아들의 것인데, 제가회의는 그걸 인정하는 데 여름 한 철을 다 쓴다. 마침내 인정이 떨어지자, 연이 동부 대가가 된 것을 기념하며 연회를 연다. <b>영류왕 (59)</b>도 자리한다.';
	const claim = find(en, has('error of his ways'), 'retirement claim');
	claim.html =
		'All summer he has bowed. He went to every seat at the Summit one at a time and asked for his father’s seal like a younger son asking for an inheritance. Among themselves they have already agreed that he will have it for one winter, out on the border forts, and not come back.';
	claim.ko =
		'여름 내내 그는 고개를 숙였다. 제가회의의 자리를 하나하나 찾아가, 막내아들이 유산을 청하듯 아버지의 인장을 청했다. 그들끼리는 이미 정해 두었다. 인장은 주되, 한 겨울만. 변경의 성 쌓는 데로 보내고, 돌아오지 못하게.';
	const old = find(en, has('Stepping aside of his own accord'), 'grown-old line');
	old.en = ['Ah — so even the renowned Gesomun has learned to bow…', 'Your father would have liked to see it.'];
	old.lines = ['아, 그 명망 높은 개소문도 이제 고개 숙일 줄을 아는구나…', '자네 부친이 봤으면 기뻐했을 게요.'];
}

// ————— anchors —————
const problems = [];
for (const en of entries) {
	for (const im of en.images ?? []) {
		if (!before.has(im)) continue;
		const was = before.get(im);
		const now = anchorOf(en, im);
		if (was !== now) problems.push(`${im.id}: “${im.at}” moved`);
	}
}
if (problems.length) {
	console.log(`${problems.length} anchor problem(s):\n  - ${problems.join('\n  - ')}`);
	process.exit(1);
}
console.log('anchors: all stable');

if (DRY) {
	console.log('dry run, nothing written');
	process.exit(0);
}
fs.writeFileSync(BACKUP, raw);
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`story.json written; backup at ${BACKUP}`);
