import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const SEQ = 'src/lib/movieSequences.ts';

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

const AFTER = 'In her head the ledger is grain';
const insertAt = entry.blocks.findIndex(
	(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes(AFTER)
);
if (insertAt < 0) throw new Error('ledger paragraph not found');

const NEW_IDS = new Set([
	'jumong-seq-report-morning',
	'sosuno-seq-point-millet',
	'jumong-seq-follow-finger',
	'jumong-seq-haul-grin',
	'sosuno-seq-wrong-stack',
	'sosuno-seq-ditch-dont',
	'jumong-seq-ditch-chat',
	'sosuno-seq-rope-watch',
	'jumong-seq-bucket-work',
	'sosuno-seq-dusk-count',
	'sosuno-seq-work-chin-ecu',
	'jumong-seq-work-soft-ecu',
	'sosuno-seq-work-first-two',
	'sosuno-seq-dont-grin-work'
]);

entry.blocks = entry.blocks.filter((b, i) => {
	if (i <= insertAt) return true;
	if (b.kind === 'scene' && b.label === 'First Morning') return false;
	if (b._firstTasks) return false;
	return true;
});

const blocks = [
	{
		kind: 'scene',
		label: 'First Morning',
		ko: '첫 아침'
	},
	{
		kind: 'p',
		html: 'First light on the grain porch. He reports the way Tabal told him — red silk, easy face, already talking. She does not look up. The millet stick ticks. One. Two. West. <b>She does not look up from the count.</b>',
		ko: '곡식 누대에 첫빛. 타발이 시킨 대로 보고한다 — 붉은 비단, 쉬운 얼굴, 이미 말 중. 그녀는 안 올려다본다. 조 막대가 간다. 하나. 둘. 서쪽. <b>셈에서 고개를 안 든다.</b>'
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['Morning—', 'I mean. Reporting. You said west millet, so I—'],
		lines: ['아침요—', '아니, 보고요. 서쪽 조라 하셔서, 그래서 제가—']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: ['I didn’t say talk.', 'West. Those.', 'Don’t stand on the line.'],
		lines: ['말하랬어?', '서쪽. 그거.', '줄 위에 서지 마.']
	},
	{
		kind: 'p',
		html: 'The chin stays down at the stick. Then a finger, not a look. Millet. West line. The rope on the hook if he finishes. He follows the finger like it is a hunt. <b>She points the west millet.</b> <b>He follows the finger.</b>',
		ko: '턱은 막대에 내려가 있다. 그다음 손가락이지, 눈이 아니다. 조. 서쪽 줄. 끝나면 갈고리의 새끼줄. 그는 사냥처럼 그 손가락을 따라간다. <b>서쪽 조를 가리킨다.</b> <b>손가락을 따라간다.</b>'
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['These? Or— wait, the dry ones.', 'I can do both. I’m good at both.'],
		lines: ['이거요? 아니면— 잠깐, 마른 거?', '둘 다 돼요. 둘 다 잘해요.']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: ['Dry. If you mix wet I make you eat it.', 'Wrong stack. Do it again.'],
		lines: ['마른 거. 젖은 거 섞으면 네가 먹어.', '잘못된 더미야. 다시.']
	},
	{
		kind: 'p',
		html: 'He already has the wet sack on his shoulder. She is there before he sets it down — dusty-rose correcting a red sleeve, no blush, no thanks. He grins like the correction is a compliment. <b>He hauls the sacks grinning.</b>',
		ko: '젖은 가마니는 이미 어깨에 있다. 내려놓기 전에 그녀가 있다 — 회분홍이 붉은 소매를 고친다. 홍조 없다. 고맙다는 말도 없다. 그는 칭찬받은 것처럼 웃는다. <b>웃으면서 가마니를 든다.</b>'
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ["See? Working. Grinning's extra. I can stop.", "…I probably can't."],
		lines: ['봐. 일하는 중. 웃음은 덤이에요. 멈출 수 있어요.', '…아마 못 할 거예요.']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: ['You can’t.', 'Don’t.'],
		lines: ['못 하잖아.', '하지 마.']
	},
	{
		kind: 'p',
		html: 'Ditch after the sacks. Mud to the knee. He talks about the hall, the shed, Tabal’s almost— she cuts him. <b>Don’t talk in the ditch.</b>',
		ko: '가마니 다음엔 도랑. 무릎까지 진흙. 대청 이야기, 헛간, 타발이 하마터면— 그녀가 자른다. <b>도랑에서 말하지 마.</b>'
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['So the hall last night, your father almost—', 'I can go faster if you—'],
		lines: ['어젯밤 대청이요, 아버지가 하마터면—', '더 빨리 할 수 있어요, 그냥—']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: ['Don’t.', 'Mud. Not a story.'],
		lines: ['하지 마.', '진흙이야. 이야기 아니야.']
	},
	{
		kind: 'p',
		html: 'Rope at the well-beam. Work. Two buckets on packed earth. Nobody kissing. She watches him pull the way she watches a spear-count. <b>Pull. Don’t chat the rope.</b> <b>Buckets stay on packed earth.</b>',
		ko: '우물 들보에서 줄. 일. 다진 흙 위 두레박 둘. 키스하는 사람 없다. 창 점고 보듯 그가 당기는 걸 본다. <b>당겨. 줄한테 말 걸지 마.</b> <b>두레박은 다진 흙에 둔다.</b>'
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['Rope’s being a— okay. Not a villain. Just rope.', 'You want the other end or—'],
		lines: ['줄이 좀— 아, 아니. 악당 아니에요. 그냥 줄.', '저쪽 잡으실래요, 아니면—']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: ['I want it done.', 'Chin. Count. Not you.'],
		lines: ['끝내.', '턱. 셈. 너 말고.']
	},
	{
		kind: 'p',
		html: 'Dusk puts the unused peg and the dry bowl back in the frame. She finishes the stick. He waits for a job that does not come. <b>The peg waits through dusk.</b> <b>Chin stays up on the count.</b>',
		ko: '해 질 녘이면 안 쓰는 못과 마른 그릇이 다시 보인다. 막대를 끝낸다. 그는 안 오는 다음 일을 기다린다. <b>못은 황혼까지 기다린다.</b> <b>셈하는 동안 턱은 올라가 있다.</b>'
	}
];

entry.blocks.splice(insertAt + 1, 0, ...blocks);

const refsBoth = [
	'/ch_jumong.png',
	'/ch_sosuno.png',
	'/bn_sosuno.png',
	'/temp/jumong-seq-jolbon-wide.jpg',
	'/temp/jumong-set-well-day-empty.jpg',
	'/temp/jumong-set-jolbon-dusk-porch.jpg'
];
const refsHer = [
	'/ch_sosuno.png',
	'/bn_sosuno.png',
	'/temp/jumong-seq-jolbon-wide.jpg',
	'/temp/jumong-set-jolbon-dusk-porch.jpg'
];
const refsHim = [
	'/ch_jumong.png',
	'/temp/jumong-seq-jolbon-wide.jpg',
	'/temp/jumong-set-well-day-empty.jpg'
];

const slots = [
	{
		id: 'jumong-seq-report-morning',
		at: 'She does not look up from the count',
		alt: 'Dutch porch: Jumong mid-stride reporting; Sosuno chin-down at the millet stick',
		tone: '#e8a04a',
		people: ['jumong', 'sosuno'],
		refs: refsBoth
	},
	{
		id: 'sosuno-seq-point-millet',
		at: 'She points the west millet',
		alt: 'Dutch: Sosuno pointing west millet, chin up; Jumong turning to follow',
		tone: '#e8a04a',
		people: ['sosuno', 'jumong'],
		refs: refsBoth
	},
	{
		id: 'jumong-seq-follow-finger',
		at: 'He follows the finger',
		alt: 'OTS: Sosuno’s pointing sleeve; Jumong mid-stride toward sacks',
		tone: '#e8563f',
		people: ['jumong', 'sosuno'],
		refs: refsBoth
	},
	{
		id: 'jumong-seq-haul-grin',
		at: 'He hauls the sacks grinning',
		alt: 'Worm’s-eye: Jumong hauling a millet sack, easy grin; Sosuno a porch stamp',
		tone: '#e8563f',
		people: ['jumong', 'sosuno'],
		refs: refsBoth
	},
	{
		id: 'sosuno-seq-wrong-stack',
		at: 'Wrong stack. Do it again.',
		alt: 'Dutch: Sosuno correcting the wet sack off his shoulder; he still grins',
		tone: '#e8a04a',
		people: ['sosuno', 'jumong'],
		refs: refsBoth
	},
	{
		id: 'sosuno-seq-ditch-dont',
		at: 'Don’t talk in the ditch',
		alt: 'Worm’s-eye ditch: Jumong digging and talking; Sosuno a stern stamp above',
		tone: '#e8a04a',
		people: ['sosuno', 'jumong'],
		refs: refsBoth
	},
	{
		id: 'jumong-seq-ditch-chat',
		at: 'So the hall last night',
		alt: 'Close: Jumong’s stupid-soft grin from the ditch, muddy, talking',
		tone: '#e8563f',
		people: ['jumong'],
		refs: refsHim
	},
	{
		id: 'sosuno-seq-rope-watch',
		at: 'Pull. Don’t chat the rope',
		alt: 'Dutch well: Jumong mid-pull on hemp; Sosuno watching, chin up',
		tone: '#e8a04a',
		people: ['sosuno', 'jumong'],
		refs: refsBoth
	},
	{
		id: 'jumong-seq-bucket-work',
		at: 'Buckets stay on packed earth',
		alt: 'OTS well: bucket sharp in front; Jumong lifting the other; Sosuno counting in bokeh',
		tone: '#e8563f',
		people: ['jumong', 'sosuno'],
		refs: refsBoth
	},
	{
		id: 'sosuno-seq-dusk-count',
		at: 'The peg waits through dusk',
		alt: 'Dutch dusk porch: unused peg and dry bowl; Sosuno finishing the stick; Jumong waiting',
		tone: '#e8a04a',
		people: ['sosuno', 'jumong'],
		refs: refsBoth
	},
	{
		id: 'sosuno-seq-work-chin-ecu',
		at: 'Chin stays up on the count',
		alt: 'ECU: Sosuno work-face, chin up, no blush, dusty-rose rim',
		tone: '#e8a04a',
		people: ['sosuno'],
		refs: refsHer
	},
	{
		id: 'jumong-seq-work-soft-ecu',
		at: "Grinning's extra",
		alt: 'ECU: Jumong clean-shaven stupid-soft grin, millet-dust bokeh',
		tone: '#e8563f',
		people: ['jumong'],
		refs: refsHim
	},
	{
		id: 'sosuno-seq-work-first-two',
		at: 'Work first. Looking later.',
		alt: 'Dutch two-shot: Sosuno counting, Jumong hauling; packed-earth gap between them',
		tone: '#e8a04a',
		people: ['sosuno', 'jumong'],
		refs: refsBoth
	},
	{
		id: 'sosuno-seq-dont-grin-work',
		at: 'Don’t grin at the work.',
		alt: 'Intimate two-shot: her stern lid, his easy grin; they do not kiss',
		tone: '#e8a04a',
		people: ['sosuno', 'jumong'],
		refs: refsBoth
	}
];

entry.images = (entry.images ?? []).filter((im) => !NEW_IDS.has(im.id));
for (const s of slots) {
	entry.images.push({
		id: s.id,
		ratio: 1.778,
		tone: s.tone,
		nsfw: false,
		at: s.at,
		alt: s.alt,
		refs: s.refs,
		people: s.people,
		prompt: s.alt
	});
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

let seq = fs.readFileSync(SEQ, 'utf8');
const SHOTS = `			{ id: 'jumong-seq-report-morning', role: 'first morning report', angle: 'dutch porch', at: 'She does not look up from the count' },
			{ id: 'sosuno-seq-point-millet', role: 'she points west', angle: 'dutch point', at: 'She points the west millet' },
			{ id: 'jumong-seq-follow-finger', role: 'he follows', angle: 'OTS sleeve', at: 'He follows the finger' },
			{ id: 'jumong-seq-haul-grin', role: 'hauls grinning', angle: 'worm’s-eye sack', at: 'He hauls the sacks grinning' },
			{ id: 'sosuno-seq-wrong-stack', role: 'wrong stack', angle: 'dutch correct', at: 'Wrong stack. Do it again.' },
			{ id: 'sosuno-seq-ditch-dont', role: 'ditch don’t', angle: 'worm’s-eye cut', at: 'Don’t talk in the ditch' },
			{ id: 'jumong-seq-ditch-chat', role: 'he talks mud', angle: 'close grin', at: 'So the hall last night' },
			{ id: 'sosuno-seq-rope-watch', role: 'rope watch', angle: 'dutch well', at: 'Pull. Don’t chat the rope' },
			{ id: 'jumong-seq-bucket-work', role: 'bucket work', angle: 'OTS well', at: 'Buckets stay on packed earth' },
			{ id: 'sosuno-seq-dusk-count', role: 'dusk peg', angle: 'dutch dusk', at: 'The peg waits through dusk' },
			{ id: 'sosuno-seq-work-chin-ecu', role: 'her stern ECU', angle: 'ECU chin', at: 'Chin stays up on the count' },
			{ id: 'jumong-seq-work-soft-ecu', role: 'his soft ECU', angle: 'ECU grin', at: "Grinning's extra" },
			{ id: 'sosuno-seq-work-first-two', role: 'work first', angle: 'dutch two-shot', at: 'Work first. Looking later.' },
			{ id: 'sosuno-seq-dont-grin-work', role: 'don’t grin', angle: 'intimate two-shot', at: 'Don’t grin at the work.' },
`;

for (const id of NEW_IDS) {
	seq = seq.replace(
		new RegExp(`\\t*\\{ id: '${id}'[^}]*\\},\\n`, 'g'),
		''
	);
}

const ANCHOR = "\t\t\t{ id: 'sosuno-seq-tough-chin', role: 'chieftain’s daughter', angle: 'low dutch porch', at: 'She prices him, then forgets the count' },\n";
if (!seq.includes(ANCHOR)) throw new Error('tough-chin shot not found');
if (!seq.includes("{ id: 'jumong-seq-report-morning'")) {
	seq = seq.replace(ANCHOR, ANCHOR + SHOTS);
}

fs.writeFileSync(SEQ, seq);
console.log(`Jumong images now ${entry.images.length}; inserted ${blocks.length} blocks after ledger`);
