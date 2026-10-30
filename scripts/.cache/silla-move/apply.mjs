// Silla run: Jinji's deposition and the night bridge move into Harmony Council,
// Jade Gate Valley follows the Council and takes the bone-rank talk out of Queen Sunduk.
// Idempotent: rerunning finds every change already made.
import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';
const chapters = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const samhan = chapters.find((c) => c.id === 'samhan');
const entry = (title) => {
	const e = samhan.entries.find((x) => x.title === title);
	if (!e) throw new Error(`missing entry ${title}`);
	return e;
};
const textOf = (b) => [b.html, b.label, ...(b.en || []), b.title].filter(Boolean).join(' ');
const findIdx = (blocks, needle) => blocks.findIndex((b) => textOf(b).includes(needle));
const must = (i, what) => {
	if (i < 0) throw new Error(`not found: ${what}`);
	return i;
};

const queen = entry('Queen Sunduk');
const council = entry('Harmony Council');
const jade = entry('Jade Gate Valley');
const gwanggeto = samhan.entries.find((e) => e.title.startsWith('Gwanggeto'));

const p = (html, ko) => ({ kind: 'p', html, ko });
const card = (html, ko) => p(`<b>${html}</b>`, `<b>${ko}</b>`);
const boy = (speaker, chip, en, lines) => ({ kind: 'dialogue', speaker, chip, gender: 'm', en, lines });
const PURPLE = 'A Hwarang of Class 77';
const PURPLE_CHIP = '#7fa7c9';
const MENDED = 'The boy with the mended sleeve';
const MENDED_CHIP = '#c96a5a';

// 1. The Three Counts leaves Jade Gate Valley and splits in two.
let flashJinji = null;
let flashBridge = null;
const jadeFlash = jade.blocks.findIndex((b) => b.kind === 'flashback' && b.title?.startsWith('The Three Counts'));
if (jadeFlash >= 0) {
	const subs = jade.blocks[jadeFlash].blocks;
	const bridgeAt = must(
		subs.findIndex((b) => b.kind === 'scene' && b.label?.startsWith('The Night Bridge')),
		'Night Bridge scene'
	);
	flashJinji = {
		kind: 'flashback',
		year: '579',
		title: 'The Three Counts · 세 번의 셈',
		blocks: subs.slice(0, bridgeAt)
	};
	flashBridge = {
		kind: 'flashback',
		year: '612',
		title: 'The Night Bridge · 밤의 다리',
		blocks: subs.slice(bridgeAt + 1)
	};
	const opener = flashJinji.blocks.find((b) => b.kind === 'p' && b.html.startsWith('Same pavilion.'));
	opener.html = 'Same pavilion. Same pond. Same brazier. Fifty-three winters before tonight, six sleeves sat here and unmade a king.';
	opener.ko = '같은 정자, 같은 연못, 같은 화로. 오늘 밤보다 쉰세 해 앞서, 여섯 소매가 여기 앉아 왕 하나를 끌어내렸다.';
	jade.blocks.splice(jadeFlash, 1);
	console.log('Jade: Three Counts flashback lifted out');
}

// 2. Harmony Council: the deposition after the rules, the bridge after "He was nine".
if (flashJinji && !council.blocks.some((b) => b.kind === 'flashback' && b.year === '579')) {
	const rules = must(
		council.blocks.findIndex((b) => b.kind === 'diagram' && b.step === 'session'),
		'session diagram'
	);
	council.blocks.splice(
		rules + 1,
		0,
		flashJinji,
		p(
			'Six mats unmade a king in this room. Tonight they are being asked to make a queen.',
			'이 방에서 여섯 자리가 왕 하나를 끌어내렸다. 오늘 밤 그 자리들은 여왕 하나를 세우라는 청을 받는다.'
		)
	);
	console.log('Harmony Council: Jinji flashback in');
}
if (flashBridge && !council.blocks.some((b) => b.kind === 'flashback' && b.year === '612')) {
	const nine = must(findIdx(council.blocks, 'He was nine when he learned why.'), 'He was nine');
	council.blocks.splice(nine + 1, 0, flashBridge);
	console.log('Harmony Council: Night Bridge flashback in');
}
const bridgeImg = (jade.images || []).findIndex((im) => im.id === 'rel-yongsu-chunchu');
if (bridgeImg >= 0) {
	council.images = council.images || [];
	council.images.push(jade.images.splice(bridgeImg, 1)[0]);
	console.log('image rel-yongsu-chunchu → Harmony Council');
}

// 3. Bone rank leaves Queen Sunduk.
const boneAt = queen.blocks.findIndex((b) => b.kind === 'term' && b.diagram === 'bone-rank');
let bone = null;
if (boneAt >= 0) {
	bone = queen.blocks.splice(boneAt, 1)[0];
	console.log('Queen Sunduk: Bone Rank term lifted out');
}

// 4. Jade Gate Valley: the boys on the yard count bones.
if (!jade.blocks.some((b) => b.speaker === MENDED)) {
	bone = bone || {
		kind: 'term',
		hanja: '骨品',
		reading: '골품',
		term: 'Bone Rank',
		diagram: 'bone-rank',
		step: 'ranks'
	};
	bone.html =
		'Bone, as in the bone you were born with. Sacred Bone may wear the crown. True Bone may run the country. Everyone else may count the robes. The True Bone houses are the grandchildren of the Six Elders, the village chiefs who were here before there were any kings. Even among them, the eldest son of the eldest son outranks his cousins, and at every dinner in Surabol everyone knows exactly who that is.';
	bone.ko =
		'뼈. 타고난 그 뼈다. 성골은 왕관을 쓸 수 있다. 진골은 나라를 굴릴 수 있다. 나머지는 옷 색깔을 셀 수 있다. 진골 집안은 육촌장의 자손이다. 왕이 있기 전부터 이 땅에 있던 마을의 촌장들. 그 안에서도 맏아들의 맏아들로 내려온 줄기가 사촌들 위에 앉고, 서라벌의 어느 잔칫상에서든 그게 누군지 모르는 사람은 없다.';

	const table = {
		kind: 'table',
		head: ['Bone · 뼈', 'Robe · 옷', 'As high as · 오를 수 있는 끝', 'The work · 맡는 일'],
		rows: [
			['Sacred Bone · 성골', 'Purple · 자색', 'The throne · 왕위', 'King or queen. Nobody else. · 왕 또는 여왕. 그뿐.'],
			['True Bone · 진골', 'Purple · 자색', 'First rank · 첫째 관등', 'Ministers, generals, the Council · 재상, 장군, 화백'],
			['Head Rank Six · 6두품', 'Scarlet · 비색', 'Sixth rank · 여섯째 관등', 'Scholars, scribes, the deputies who write the orders · 학자, 서기, 명을 받아 적는 차관'],
			['Head Rank Five · 5두품', 'Blue · 청색', 'Tenth rank · 열째 관등', 'Magistrates, section chiefs, captains · 현령, 부서의 장, 대장'],
			['Head Rank Four · 4두품', 'Yellow · 황색', 'Twelfth rank · 열두째 관등', 'Clerks, tax counters, sergeants · 아전, 세금 세는 이, 하급 군관'],
			['Commoners · 평민', 'Undyed white · 흰 베', 'No rank · 관등 없음', 'Farm, pay, march · 농사, 세금, 행군']
		]
	};

	const yard = [
		p(
			'Two of the boys have stopped drilling to stare. One wears a purple sleeve. The other’s sleeve is scarlet, and somebody has mended it twice.',
			'아이 둘이 훈련을 멈추고 넋을 놓고 본다. 하나는 자색 소매다. 다른 하나는 비색 소매인데, 누가 두 번이나 기웠다.'
		),
		boy(PURPLE, PURPLE_CHIP, ['That’s them. The Three Eternal.'], ['저기다. 화랑삼웅.']),
		boy(MENDED, MENDED_CHIP, ['Eternal. They’re sitting on a fence.'], ['삼웅이라꼬. 난간에 걸터앉아 있는데.']),
		boy(
			PURPLE,
			PURPLE_CHIP,
			[
				'There’s a wall in the gallery. Every class paints its best man on it, and the next class paints over him.',
				'Those three, nobody paints over. That’s what eternal means.'
			],
			['회랑에 벽 있다 아이가. 기수마다 제일 잘난 놈을 거기 그리고, 다음 기수가 그 위에 덧칠한다.', '근데 저 셋은 아무도 못 덮는다. 그기 삼웅이다.']
		),
		boy(MENDED, MENDED_CHIP, ['Why them?'], ['와 저 셋인데?']),
		boy(
			PURPLE,
			PURPLE_CHIP,
			[
				'The one with the beads. Bidam. He got a mat on the Council at thirty-eight. Thirty-eight!',
				'My father’s fifty and still waiting.'
			],
			['염주 찬 분. 비담공. 서른여덟에 화백 자리를 받았다. 서른여덟!', '우리 아부지는 쉰인데 아직도 기다린다.']
		),
		boy(MENDED, MENDED_CHIP, ['So he’s good.'], ['그라믄 잘난 기네.']),
		boy(
			PURPLE,
			PURPLE_CHIP,
			[
				'He’s a Son. Eldest son of the eldest son, all the way back to the Musan elder. Bone of the bone.',
				'They’d have given him a mat at twelve if he’d asked nicely.'
			],
			['손씨다. 무산 촌장까지 맏아들의 맏아들로 쭉. 뼈 중의 뼈.', '곱게 청했으면 열두 살에도 자리 줬을 끼다.']
		),
		boy(MENDED, MENDED_CHIP, ['And the big one?'], ['큰 분은?']),
		boy(
			PURPLE,
			PURPLE_CHIP,
			[
				'Alchun. Choi, from old Sobuldori. But off a younger son. Good bone, wrong branch.',
				'He had to kill a tiger to get his mat. They say he kept talking the whole time.'
			],
			['알천공. 최씨, 소벌도리 어른 줄. 근데 작은아들 쪽이다. 뼈는 좋은데 가지가 틀렸다.', '자리 얻을라꼬 호랑이를 잡았다 카더라. 잡는 내내 말을 안 멈췄다 카고.']
		),
		boy(MENDED, MENDED_CHIP, ['And the Marshal?'], ['대장군은?']),
		boy(PURPLE, PURPLE_CHIP, ['…Don’t.'], ['…하지 마라.']),
		boy(MENDED, MENDED_CHIP, ['What? He’s purple. He’s True Bone, isn’t he?'], ['와? 자색이잖아. 진골 아이가?']),
		boy(
			PURPLE,
			PURPLE_CHIP,
			['He’s True Bone. That’s all.', 'Nobody asks about the Marshal’s family. Not here.'],
			['진골이다. 그뿐이다.', '대장군 집안은 아무도 안 묻는다. 여기선.']
		),
		p(
			'Nobody in Surabol finishes a sentence about the Marshal’s family. They start one, glance round, and remark on the weather.',
			'서라벌에서 대장군 집안 이야기를 끝까지 하는 사람은 없다. 말을 꺼냈다가, 주위를 한 번 보고, 날씨 이야기를 한다.'
		),
		p('Here is how Silla counts a boy. It starts with his bones.', '신라가 아이 하나를 세는 법은 이렇다. 뼈부터 센다.'),
		bone,
		table,
		p(
			'The boy with the mended sleeve is Head Rank Six. Somewhere in the middle of a drill, he has worked out that the highest step he can ever reach is one the purple boy will walk past on his way up.',
			'소매 기운 아이는 6두품이다. 훈련 한가운데서 셈이 끝났다. 그가 평생 오를 수 있는 가장 높은 계단은, 옆의 자색 소매가 올라가다 지나쳐 갈 계단이다.'
		)
	];
	const rail = must(findIdx(jade.blocks, 'They are not sure which ones are true.'), 'yard rail');
	jade.blocks.splice(rail + 1, 0, ...yard);
	console.log('Jade: bone-rank yard talk in');
}

// 5. Next-episode cards follow the new order.
const COUNCIL_CARD = card(
	'The council made a queen. Four winters later, five hundred Baekje men come to find out what she’s made of…!',
	'화백이 여왕을 만들었다. 네 겨울 뒤, 백제 사내 오백이 그 여왕이 무엇으로 만들어졌는지 보러 온다…!'
);
const CLOUD_CARD = card(
	'Every man who voted that night grew up in her great-grandfather’s yard. Who was the Cloud King? Ask anyone in Surabol…!',
	'그날 밤 패를 놓은 사내들은 모두 그녀의 증조부가 만든 마당에서 컸다. 구름왕은 누구였나? 서라벌 아무에게나 물어보라…!'
);
const BUPMIN_CARD = card(
	'The prince who will beg has a son. Bupmin is fifteen now, and his uncle has one question: which rule will you break first…?',
	'언젠가 빌러 갈 그 왕자에게는 아들이 있다. 법민이 열다섯이 되었고, 외숙에게는 질문이 하나 있다. 어느 계율을 제일 먼저 어기겠느냐…?'
);
const setLast = (e, c) => {
	const last = e.blocks.at(-1);
	if (last.kind === 'p' && last.html.startsWith('<b>')) e.blocks[e.blocks.length - 1] = c;
	else e.blocks.push(c);
};
setLast(council, COUNCIL_CARD);
setLast(jade, CLOUD_CARD);
setLast(gwanggeto, BUPMIN_CARD);

// 6. Jade Gate Valley sits right after Harmony Council.
const from = samhan.entries.indexOf(jade);
samhan.entries.splice(from, 1);
samhan.entries.splice(samhan.entries.indexOf(council) + 1, 0, jade);

fs.writeFileSync(FILE, JSON.stringify(chapters, null, '\t') + '\n');
console.log(
	'order:',
	samhan.entries.map((e) => e.title).join(' | ')
);
