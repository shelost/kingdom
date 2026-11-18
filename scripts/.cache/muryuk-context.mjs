import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));
const entry = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Muryuk');

function p(html, ko) {
	return { kind: 'p', html, ko };
}
function d(person, en, lines) {
	return { kind: 'dialogue', person, en, lines };
}

const open = entry.blocks.find((b) => b.html?.startsWith('Before dawn the king gets his three sons'));
if (open) {
	open.html =
		'Before dawn Noribu is already at the ledgers, and Muduk is in the bow-yard. Somebody told them a prince should be busy. The king goes for the youngest. He carries him down the long hall in his sleeping clothes. The walls are painted from floor to rafters. In the dark they are only shapes. The king has timed this. He opens the east doors, and the sun does the rest.';
	open.ko =
		'새벽 전에 노리부는 이미 장부 앞에 있고, 무덕은 활터에 있다. 왕자는 바빠야 한다고 누가 일러 둔 것이다. 임금은 막내를 데리러 간다. 잠옷을 입은 아이를 안고 긴 전각을 걸어 내려간다. 벽은 바닥에서 서까래까지 그림이다. 어둠 속에서는 형태뿐이다. 임금은 시간을 맞춰 두었다. 동쪽 문을 열자, 나머지는 해가 한다.';
}

const bed = entry.blocks.find((b) => (b.en ?? []).some((l) => l.includes('Back to bed, you two')));
if (bed) {
	bed.en = ['…Then it’s a very big harbour, isn’t it.', 'And it’s yours to learn. Just you, this morning.'];
	bed.lines = ['…그라믄 억수로 큰 포구인갑다.', '오늘 아침은 니 혼자 배워라.'];
}
for (const b of entry.blocks) {
	if (b.person === 'noribu' && (b.en ?? []).some((l) => l.includes('Same door'))) {
		b.kind = 'p';
		b.html = 'Noribu has heard the harbour line. Muduk has heard it. They are not in the hall. The king says it again, to the one in his arms.';
		b.ko = '노리부는 포구 얘기를 들어 봤다. 무덕도 들어 봤다. 둘 다 이 전각에는 없다. 임금은 팔 안의 아이에게 다시 말한다.';
		delete b.person;
		delete b.en;
		delete b.lines;
		delete b.chip;
	}
	if (b.person === 'muduk' && (b.en ?? []).some((l) => l.includes('Same sun'))) {
		b.kind = 'p';
		b.html = 'On the wall the paint is old. A man coming down through cloud. A gold box on a rope. A red sail. The king names them as if they were in the room, and they are only pigment.';
		b.ko = '벽의 그림은 오래됐다. 구름을 타고 내려오는 사내. 줄에 매달린 금 상자. 붉은 돛. 임금은 방에 있는 사람처럼 이름을 부르는데, 그들은 안료일 뿐이다.';
		delete b.person;
		delete b.en;
		delete b.lines;
		delete b.chip;
	}
}

if (!entry.blocks.some((b) => b.html?.includes('A tear gets as far as the strap'))) {
	const i = entry.blocks.findIndex((b) => b.html?.startsWith('Behind the pine, the boy'));
	entry.blocks.splice(
		i + 1,
		0,
		p(
			'His face does not move. Blood on the cheek. The plume is still. He has been a soldier all morning, and a soldier can listen.',
			'얼굴이 움직이지 않는다. 뺨에 피. 깃은 그대로다. 그는 아침 내내 군인이었고, 군인은 들을 수 있다.'
		),
		p(
			'Then his father says he would trade the kingdom for less, and not to tell the boy. The boy is the one listening.',
			'그러다 아버지가 말한다. 그보다 덜 받고도 나라를 내놓겠다고. 그 아이한테는 말하지 말라고. 듣고 있는 것이 그 아이다.'
		),
		p(
			'A tear gets as far as the strap. He does not wipe it. Another follows. He understands, which is worse than the ford.',
			'눈물이 끈까지 내려온다. 그는 닦지 않는다. 또 하나가 따른다. 그는 이해한다. 여울보다 더 나쁜 일이다.'
		)
	);
}

if (!entry.blocks.some((b) => b.html?.includes('They are still under the pines'))) {
	const i = entry.blocks.findIndex((b) => (b.en ?? []).some((l) => l.includes('Your grace is boundless')));
	entry.blocks.splice(
		i + 1,
		0,
		p(
			'Guhae has the leaf crown in the needles beside his knee. Gold leaves. He lifts it with both hands. They are still under the pines. The canopy ticks in the wind.',
			'구해의 무릎 옆 솔잎 위에 잎관이 있다. 금빛 잎. 그는 두 손으로 들어 올린다. 아직 소나무 아래다. 차일이 바람결에 탁탁거린다.'
		),
		d(
			'guhae',
			['This is the last thing the harbour had that was only ours.', 'I am giving it to you. Here. Not in a hall.'],
			['포구에 남은 것 중, 우리 것만이었던 마지막입니다.', '폐하께 드립니다. 여기서. 전각이 아닙니다.']
		),
		d(
			'beopheung',
			['Set it in my hands.', 'I will not wear it. A Silla crown is a different tree.'],
			['내 손에 놓게.', '내가 쓰지는 않겠다. 신라의 관은 다른 나무다.']
		),
		p(
			'Buphung takes the leaf crown and does not put it on. It sits in his lap like a thing that has finished being a kingdom. Behind the pine, the boy watches his father’s hands come back empty.',
			'법흥은 잎관을 받아 쓰고 있지 않는다. 나라가 끝나 버린 물건처럼 무릎 위에 놓여 있다. 소나무 뒤에서 소년은, 아버지의 손이 빈 채로 돌아오는 것을 본다.'
		)
	);
}

const hall = entry.blocks.find((b) => b.html?.startsWith('The treasury is counted. Then Guhae walks'));
if (hall) {
	hall.html =
		'In Surabol the treasury is counted. The leaf crown is already in a box. It was given under the pines. The three princes are lined up before the dais.';
	hall.ko =
		'서라벌에서 곳간이 셈해진다. 잎관은 이미 상자 안이다. 소나무 아래에서 바친 것이다. 세 왕자는 단 앞에 나란히 선다.';
}
entry.blocks = entry.blocks.filter((b) => {
	const en = (b.en ?? []).join(' ');
	if (en.includes('This is the last thing the harbour had') && !entry) return false;
	if (en.startsWith('Set it down.')) return false;
	if (en.includes('The harbour went this morning')) return false;
	if ((b.html ?? '').startsWith('He sets the leaf crown on the cushion')) return false;
	return true;
});

const crown = entry.images.find((im) => im.id === 'mur-leaf-crown');
if (crown) {
	crown.at = 'They are still under the pines.';
	crown.alt = 'Under the pines, Guhae kneels and gives Buphung the leaf crown. No hall. No armor.';
	crown.time = 'day';
	crown.people = ['guhae', 'beopheung'];
}
const kings = entry.images.find((im) => im.id === 'mur-two-kings');
if (kings) {
	kings.alt = 'After the council. Guhae in white. Buphung in court silk, no armor. One lamp.';
}

const slots = [
	{
		id: 'mur-pine-stoic',
		ratio: 2,
		time: 'day',
		at: 'His face does not move.',
		alt: 'Behind a pine, Muryuk listens. His face does not move.',
		people: ['muryuk']
	},
	{
		id: 'mur-pine-tears',
		ratio: 2,
		time: 'day',
		at: 'A tear gets as far as the strap.',
		alt: 'The same pine. Tears on his face. He does not wipe them.',
		people: ['muryuk']
	},
	{
		id: 'mur-walk-ibiga',
		ratio: 2,
		time: 'day',
		at: 'Coming down, he is. That’s Ibiga.',
		alt: 'Guhae carries only Muryuk along the painted hall. Ibiga is a mural, not a man in the room.',
		people: ['guhae', 'muryuk']
	},
	{
		id: 'mur-walk-suro',
		ratio: 2,
		time: 'day',
		at: 'Six eggs! And the first one’s Suro.',
		alt: 'The boy looks up at an old mural: six eggs, Suro, a red sail.',
		people: ['guhae', 'muryuk']
	},
	{
		id: 'mur-walk-harbour',
		ratio: 2,
		time: 'day',
		at: 'The sun reaches the end of the wall',
		alt: 'Guhae sets the boy on the threshold and turns him toward the harbour. Only the two of them.',
		people: ['guhae', 'muryuk']
	}
];
for (const slot of slots) {
	if (!entry.images.some((im) => im.id === slot.id)) entry.images.push(slot);
}

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('context ok');
