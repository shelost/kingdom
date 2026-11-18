import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));
const entry = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Muryuk');
if (!entry) throw new Error('no muryuk');

function p(html, ko) {
	return { kind: 'p', html, ko };
}
function d(person, en, lines, chip) {
	const block = { kind: 'dialogue', person, en, lines };
	if (chip) block.chip = chip;
	return block;
}
function scene(label, ko) {
	return { kind: 'scene', label, ko };
}

function findHtml(needle) {
	const i = entry.blocks.findIndex((b) => (b.html ?? '').includes(needle));
	if (i < 0) throw new Error('missing: ' + needle);
	return i;
}

const treasury = findHtml('In Surabol the treasury is counted');
entry.blocks[treasury].html =
	'The treasury is counted. Then Guhae walks the length of the hall and goes down on his knees. In both hands he holds the leaf crown of Gaya. Gold, and grass. He lifts it up to the king of Silla.';
entry.blocks[treasury].ko =
	'곳간이 셈해진다. 그러고 나서 구해가 전각을 가로질러 무릎을 꿇는다. 두 손에 가야의 잎관이 있다. 금이고, 풀이다. 그는 그것을 신라 임금에게 들어 올린다.';

if (!entry.blocks.some((b) => b.html?.includes('This is the last thing the harbour had'))) {
	entry.blocks.splice(
		treasury + 1,
		0,
		d(
			'guhae',
			['This is the last thing the harbour had that was only ours.', 'I am giving it to you.'],
			['포구에 남은 것 중, 우리 것만이었던 마지막입니다.', '폐하께 드립니다.']
		),
		d('beopheung', ['Set it down.', 'If it is in my hands, it stays in my hands.'], ['내려놓게.', '내 손에 들어오면, 내 손에 남는 것이다.']),
		d('guhae', ['…Then it is yours, Majesty.', 'The harbour went this morning. This goes now.'], ['…그러면 폐하의 것입니다.', '포구는 오늘 아침에 갔습니다. 이것은 지금 갑니다.']),
		p(
			'He sets the leaf crown on the cushion. He stays down a moment longer than the bow requires. Buphung does not tell him to get up. The three princes stand in a line and watch their father give away the grass.',
			'그는 잎관을 방석 위에 놓는다. 절에 필요한 것보다 한 박자 더 무릎을 꿇고 있다. 법흥은 일어나라고 하지 않는다. 세 왕자는 나란히 서서, 아버지가 풀을 내주는 것을 본다.'
		)
	);
}

const winter = findHtml('That winter he decides Gaya lost');
if (!entry.blocks.some((b) => b.label === 'The Helm')) {
	entry.blocks.splice(
		winter + 1,
		0,
		scene('The Helm', '투구'),
		p(
			'Guhae comes home in the council’s white. The robe is new. The beard is the same. He looks at the plume in his own hallway as if it had followed him in off the street.',
			'구해가 화백의 흰 옷을 입고 집에 온다. 옷은 새것이다. 수염은 그대로다. 그는 자기 집 복도의 자색 깃을, 길에서 따라 들어온 것처럼 본다.'
		),
		d(
			'guhae',
			['Take it off in the house.', 'You are a Kim of Silla now. Dress like one. Eat like one. Let them forget the river.'],
			['집 안에서는 벗어라.', '이제 너는 신라 김가다. 그 집처럼 입어라. 그 집처럼 먹어라. 강은 잊게 둬라.']
		),
		d(
			'muryuk',
			['I ride for him. That was the bargain.', 'The helm wasn’t in it.'],
			['저는 폐하를 위해 말을 탑니다. 그 거래였지예.', '투구는 그 안에 없었심더.']
		),
		d(
			'guhae',
			['Pride is a loud coat, Muryuk. The neighbours can hear it through the wall.', 'The wall is already a hand too low.'],
			['자존심은 시끄러운 옷이다, 무력아. 이웃이 담 너머로 듣는다.', '담은 벌써 한 뼘 낮다.']
		),
		d(
			'muryuk',
			['Let them hear it.', 'He said bought things stay bought. He bought a general. Generals wear what they wore.'],
			['듣게 두이소.', '산 물건은 무르지 않는다 하셨지예. 장수를 사셨심더. 장수는 입던 걸 입습니다.']
		),
		p(
			'He asks the king, because his father will. Buphung looks at the plume once.',
			'아버지가 물을 것이니, 그가 먼저 임금에게 묻는다. 법흥은 깃을 한 번 본다.'
		),
		d(
			'beopheung',
			['If it keeps him on a horse, he may keep the hat.', 'I did not buy a man to dress him.'],
			['말에 붙어 있게 하는 거라면, 모자는 그대로 두게.', '옷을 입히려고 사람을 산 게 아니다.']
		),
		p(
			'So the helm stays. In the street. At the council gate. At his own table. Guhae stops asking. He does not stop minding.',
			'그래서 투구는 남는다. 길에서. 화백 문 앞에서. 자기 밥상에서. 구해는 더 묻지 않는다. 마음이 편해지지는 않는다.'
		),
		scene('Two Kings', '두 임금'),
		p(
			'They take to meeting after the council, when the hall is empty. An old king who knelt, and a king who bought him. Both of them want the joining to be quiet. Neither of them is good at quiet.',
			'회의가 끝난 뒤, 전각이 비면 둘이 남는다. 무릎 꿇었던 옛 임금과, 그를 산 임금. 둘 다 두 백성의 합침이 조용하기를 바란다. 둘 다 조용한 재주는 없다.'
		),
		d(
			'guhae',
			[
				'My boy will ride wherever you point him.',
				'He will not eat at their tables. They look at the plume and they remember the river.'
			],
			['제 아들은 폐하가 가리키는 곳이면 말을 달릴 것입니다.', '저들의 상에는 앉지 않습니다. 깃을 보면 강을 기억하니까요.']
		),
		d(
			'beopheung',
			['Then give them a table they cannot refuse.', 'A marriage. Mine, and yours.'],
			['그럼 거절 못 할 상을 주게.', '혼인이다. 내 집과 자네 집.']
		),
		d('guhae', ['A daughter.', 'You have one who can stand in a room without performing.'], ['따님이시오.', '방에서 연기하지 않고 서 있을 수 있는 분.']),
		d(
			'beopheung',
			['Ayang.', 'A steady head. No use for theatre. Your son has too much, and all of it is iron.'],
			['아양이다.', '머리는 단단하고, 연극은 쓸모가 없지. 자네 아들은 연극이 너무 많고, 전부 쇠다.']
		),
		d(
			'guhae',
			['She will sand him down.', 'Or she will not, and the children will.'],
			['그 아이가 제 아들을 갈아 낼 것입니다.', '아니면 못 갈고, 아이들이 갈겠지요.']
		),
		d('beopheung', ['The children are the point.', 'Pick a day. Tell them after.'], ['아이들이 목적이다.', '날을 잡게. 아이들에게는 나중에 알리고.']),
		p(
			'They pick the eighth day. You have seen this trick. A queen and a marshal will sit in a garden, years from now, and bend two other children the same way. These two are only earlier, and worse at it.',
			'그들은 여드레 뒤를 잡는다. 당신은 이 수를 본 적이 있다. 몇 해 뒤 여왕 하나와 원수 하나가 정원에 앉아, 다른 아이 둘을 같은 쪽으로 굽힐 것이다. 이 둘은 그보다 먼저고, 솜씨는 더 없다.'
		),
		scene('Ayang', '아양'),
		p(
			'They tell her in the morning. They tell him at noon. She finds him in the yard, in the helm, oiling a sword that does not need it.',
			'그녀에게는 아침에 알린다. 그에게는 한낮에 알린다. 그녀는 마당에서 그를 찾는다. 투구를 쓴 채, 기름칠이 필요 없는 칼에 기름을 치고 있다.'
		),
		d('ayang', ['You’re the ford.', 'My father laughed. He doesn’t, much.'], ['여울이 당신이군요.', '아버지께서 웃으셨어요. 잘 안 웃으시는데.'], '#2A5FB8'),
		d('muryuk', ['…Thirty-one.', 'I lost count after.'], ['…서른하나.', '그다음부터는 세지 못했습니다.'], '#8B5CF6'),
		p(
			'He looks at her earrings so he does not have to look at her face. The chin strap creaks.',
			'그는 얼굴을 보지 않으려고 그녀의 귀고리를 본다. 턱 끈이 삐걱인다.'
		),
		d('ayang', ['Do you sleep in it?'], ['그거 쓰고 주무세요?'], '#2A5FB8'),
		d('muryuk', ['The strap itches.', '…Not yet.'], ['끈이 가렵습니다.', '…아직은.'], '#8B5CF6'),
		d('ayang', ['Then don’t.', 'They’ve picked the day. Did they tell you the day, or only me?'], ['그럼 벗지 마세요.', '날은 정해졌대요. 당신한테는 날을 말했나요, 저만 말했나요?'], '#2A5FB8'),
		d('muryuk', ['The bride.', '…You’re the bride.'], ['신부를 말했습니다.', '…신부이십니다.'], '#8B5CF6'),
		d('ayang', ['That’s the idea.', 'You can look at me. The earrings don’t mind.'], ['그런 생각이죠.', '저를 보셔도 돼요. 귀고리는 상관없어요.'], '#2A5FB8'),
		p(
			'He has brought her a bar of harbour iron, wrapped in a cloth, because nobody told him what a Silla princess is given. She takes it. She does not laugh.',
			'그는 포구의 쇠막대 하나를 보자기에 싸 왔다. 신라 공주에게 무엇을 드리는지 아무도 말해 주지 않아서. 그녀는 받는다. 웃지 않는다.'
		),
		p(
			'On the eighth day they are married. Noribu makes the speech. Muduk corrects his vowels during it. At the table Muryuk tries her accent and gets it wrong, and she laughs once. She does not laugh at it again. Guhae sits at the head in the white robe and cries, which nobody mentions.',
			'여드레 뒤 둘은 혼인한다. 노리부가 축사를 한다. 무덕은 축사 도중에 형의 모음을 고친다. 상에서 무력이 그녀의 말씨를 흉내 내다 틀리고, 그녀는 한 번 웃는다. 다시는 그 말씨를 웃지 않는다. 구해는 흰 옷을 입고 상석에 앉아 운다. 아무도 그 얘기는 하지 않는다.'
		)
	);
}

const gate = findHtml('He walks up the gate road bareheaded');
if (gate >= 0) {
	entry.blocks[gate].html =
		'He walks up the gate road in the helm. The purple plume is the tallest thing on the road. Every bow on the wall finds it.';
	entry.blocks[gate].ko =
		'그는 투구를 쓴 채 성문 길을 걸어 올라간다. 자색 깃이 그 길에서 가장 높다. 성벽의 모든 활이 그 깃을 찾는다.';
}

const marryDecision = findHtml('He will marry.');
if (marryDecision >= 0) {
	entry.blocks[marryDecision].html =
		'Somewhere between the fire and the horse lines he decides one thing. If a boy comes, the boy goes to that yard, flowers and singing and all. He has a wife already. He has not told her this.';
	entry.blocks[marryDecision].ko =
		'모닥불에서 말 매는 데까지 걸어가는 사이 그는 한 가지를 정한다. 아들이 생기면, 그 아이는 그 마당에 보낼 것이다. 꽃이며 노래며 다. 그에게는 이미 아내가 있다. 이 얘기는 아직 하지 않았다.';
}

const marries = findHtml('He marries the next spring');
if (marries >= 0) {
	entry.blocks[marries] = scene('The Door', '문간');
	entry.blocks.splice(
		marries + 1,
		0,
		p(
			'He comes home still wearing it. Ayang is in the doorway. She has counted the days and does not say the number.',
			'그는 아직 그것을 쓴 채 집에 온다. 아양은 문간에 있다. 그녀는 날짜를 세었고, 그 숫자는 말하지 않는다.'
		),
		d('ayang', ['You’re late.', 'The neighbours counted too.'], ['늦었어요.', '이웃도 세었어요.'], '#2A5FB8'),
		d(
			'muryuk',
			['There was a boy. Fifteen.', 'He untied them. All of them. Said they came out of their mothers the same as us.'],
			['아이가 하나 있었다. 열다섯.', '풀어 줬다. 전부. 우리도 엄마 배에서 나온 거랑 같다고 하더군.'],
			'#8B5CF6'
		),
		d('ayang', ['And you believed a boy.', 'You, who don’t take the hat off for a king.'], ['그리고 그 아이 말을 믿으셨고요.', '임금한테도 모자 안 벗는 분이.'], '#2A5FB8'),
		d(
			'muryuk',
			['…If we have a son.', 'He goes to that yard.'],
			['…아들이 생기면.', '그 마당에 보낼 끼다.'],
			'#8B5CF6'
		),
		d('ayang', ['We don’t have a son.'], ['아들 없잖아요.'], '#2A5FB8'),
		d('muryuk', ['Not yet.'], ['아직은.'], '#8B5CF6'),
		p(
			'She looks at the plume. She does not ask him to take it off. She steps aside, and he comes in wearing it.',
			'그녀는 깃을 본다. 벗으라고는 하지 않는다. 그녀는 비켜서고, 그는 쓴 채로 들어온다.'
		)
	);
}

for (const b of entry.blocks) {
	if (b.speaker === "Muryuk’s wife" || b.speaker === "Muryuk's wife") {
		b.person = 'ayang';
		b.chip = '#2A5FB8';
		delete b.speaker;
	}
}

const dawn = findHtml('At dawn he takes the helm off.');
if (dawn >= 0 && !entry.blocks.some((b) => b.html?.includes('rice in his helmet'))) {
	entry.blocks.splice(
		dawn,
		0,
		p(
			'He thinks of the boy with the rice in his helmet, and of this weight, which is not a sword. The plume has been a country. The child in his arms will need a different one.',
			'그는 투구에 밥을 담아 먹던 아이와, 칼이 아닌 이 무게를 생각한다. 깃은 나라였다. 팔 안의 아이는 다른 나라가 필요할 것이다.'
		)
	);
}

const slots = [
	{
		id: 'mur-leaf-crown',
		ratio: 2,
		time: 'day',
		at: 'In both hands he holds the leaf crown of Gaya.',
		alt: 'Guhae kneels and lifts the leaf crown of Gaya to King Buphung.',
		people: ['guhae', 'beopheung']
	},
	{
		id: 'mur-helm-father',
		ratio: 2,
		time: 'night',
		at: 'Take it off in the house.',
		alt: 'Guhae in the council’s white robe faces his son. Muryuk will not take the purple-plume helm off.',
		people: ['guhae', 'muryuk']
	},
	{
		id: 'mur-two-kings',
		ratio: 2,
		time: 'night',
		at: 'Then give them a table they cannot refuse.',
		alt: 'After the council, Guhae and King Buphung plan the marriage in an empty hall.',
		people: ['guhae', 'beopheung']
	},
	{
		id: 'mur-ayang-iron',
		ratio: 2,
		time: 'day',
		at: 'Do you sleep in it?',
		alt: 'Princess Ayang finds Muryuk in the yard, still in the Gaya helm, and he cannot quite look at her.',
		people: ['muryuk', 'ayang']
	},
	{
		id: 'mur-ford-plume',
		ratio: 2,
		time: 'day',
		at: 'The tall Gaya cone still fights',
		alt: 'Muryuk holds the ford in steel lamellar and the purple-plume Gaya helm.',
		people: ['muryuk']
	},
	{
		id: 'mur-sadaham-plume',
		ratio: 2,
		time: 'day',
		at: 'He walks up the gate road in the helm.',
		alt: 'Muryuk in the purple-plume helm walks the gate road. Sadaham, in steel and ice-blue, is already at the gate.',
		people: ['muryuk', 'sadaham']
	}
];
for (const slot of slots) {
	if (!entry.images.some((im) => im.id === slot.id)) entry.images.push(slot);
}

const bare = entry.images.find((im) => im.id === 'mur-bareheaded');
if (bare && bare.at?.includes('bareheaded')) {
	bare.at = 'He walks up the gate road in the helm.';
	bare.alt = 'Muryuk on the Great Gaya gate road, the purple plume the tallest thing the bows can find.';
}

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('scenes ok', entry.images.filter((im) => im.id.startsWith('mur-')).map((im) => im.id).join(','));
