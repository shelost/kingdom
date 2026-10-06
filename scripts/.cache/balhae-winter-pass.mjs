import { readFileSync, writeFileSync } from 'node:fs';

const STORY = new URL('../../src/lib/data/story.json', import.meta.url);
const CANON = new URL('../../src/lib/data/visual-canon.json', import.meta.url);

const story = JSON.parse(readFileSync(STORY, 'utf8'));
const entry = story.flatMap((c) => c.entries).find((e) => e.title === 'Balhae');
if (!entry) throw new Error('Balhae entry missing');

const GULGUL = '#8b3a3a';
const JOYOUNG = '#c45a4a';
const GESOMUN = '#d0362f';
const GULGUL_BOY = '#8fa87a';

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, chip, lines, en, extra = {}) => ({ kind: 'dialogue', chip, person, lines, en, ...extra });

const old = entry.blocks;
const find = (pred, label) => {
	const b = old.find(pred);
	if (!b) throw new Error(`missing old block: ${label}`);
	return b;
};
const keepUnderCoat = find((b) => b.person === 'gulgul' && b.en?.[0] === 'Keep it under the coat.', 'under the coat');
const whatDoWeCall = find((b) => b.person === 'daejoyoung' && b.en?.some((l) => l.includes('what do we call it')), 'what do we call it');
const heCalledIt = find((b) => b.person === 'gulgul' && b.en?.[0] === 'He called it Goguryeo.', 'he called it');
const neverDies = find((b) => b.person === 'daejoyoung' && b.en?.[0] === 'Goguryeo never dies…!', 'never dies');
const codaStart = old.findIndex((b) => b.kind === 'p' && b.html.startsWith('They walk on.'));
if (codaStart < 0) throw new Error('coda missing');
const coda = old.slice(codaStart);

const doorway = {
	kind: 'flashback',
	year: '634',
	title: 'A Mohe doorway, thirty-four winters before',
	blocks: [
		p(
			'A doorway with no house behind it. Snow is settling on the ash. In the doorway stands a Mohe boy with a shaved crown and two braids, holding a stick the way he has seen men hold spears. A big man in red-edged armor gets down off a red-bay horse and walks up until the stick touches his chest.',
			'뒤에 집이 없는 문간. 재 위로 눈이 내려앉는다. 문간에는 정수리를 밀고 머리를 두 갈래로 땋은 말갈 아이가, 어른들이 창 잡는 걸 본 대로 막대기를 쥐고 서 있다. 붉은 테 갑옷을 입은 덩치 큰 사내가 붉은 밤색 말에서 내려, 막대기 끝이 가슴에 닿을 때까지 걸어온다.'
		),
		say('gesomun', GESOMUN, ['비켜라.'], ['Move.']),
		say('gulgul', GULGUL_BOY, ['…'], ['…'], { speaker: '🧒' }),
		p(
			'The boy does not move. The man laughs, the slap of a laugh his officers will learn to dread, and pulls off his gloves.',
			'아이는 비키지 않는다. 사내가 웃는다. 부하들이 두려워하게 될, 뺨을 치는 듯한 웃음이다. 그러고는 장갑을 벗는다.'
		),
		say(
			'gesomun',
			GESOMUN,
			['이놈 봐라. 다 타 버린 집을 지키고 섰네.', '좋다. 이런 놈이 고구려다.', '타라. 두 번째 말.'],
			['Look at this one. Guarding a house that’s already burned.', 'Good. This is what Goguryeo looks like.', 'Get on. The second horse.']
		),
		p(
			'Years later, on the north wall of Pyongyang in a winter worse than this one, the same man stands with the grown boy a step behind him and the river frozen white below. He says the thing he says every winter, to anyone in earshot, as if the cold might forget it otherwise.',
			'여러 해 뒤, 이번보다 더 혹독한 겨울, 평양 북쪽 성벽 위에 같은 사내가 서 있다. 다 큰 아이가 한 걸음 뒤에 있고, 아래로는 강이 하얗게 얼어 있다. 사내는 겨울마다, 듣는 사람만 있으면 누구에게나 하는 말을 한다. 추위가 잊어버리기라도 할 것처럼.'
		),
		say('gesomun', GESOMUN, ['춥냐.'], ['Cold?']),
		say('gulgul', GULGUL, ['…아닙니다.'], ['…No, sir.']),
		say(
			'gesomun',
			GESOMUN,
			['거짓말 마라. 나도 춥다.', '그래도 기억해. 왕은 죽고, 조정은 지치고, 성은 무너져도—', '<b>고구려는 죽지 않는다.</b>'],
			['Liar. I’m cold too.', 'Remember it anyway. Kings die, courts get tired, walls come down—', '<b>Goguryeo never dies.</b>']
		)
	]
};

entry.blocks = [
	p(
		'The winter after Pyongyang falls, the mountains of Manchuria do not care who won. Snow comes to the knee, then to the thigh, and the wind off the ridges finds every seam a coat has. <b>Gulgul</b> walks in front, bent under a leather pack and wrapped in so much fur he looks like something the forest would hunt. His son walks in his tracks, because there are no other tracks.',
		'평양이 무너진 그해 겨울, 만주의 산은 누가 이겼는지 관심이 없다. 눈은 무릎까지 차오르다 허벅지까지 차오르고, 능선에서 내려오는 바람은 옷의 솔기마다 기어이 파고든다. <b>걸걸</b>이 앞서 걷는다. 가죽 등짐에 허리를 굽히고, 털가죽을 하도 껴입어서 숲이 사냥할 짐승처럼 보인다. 아들은 아버지의 발자국을 밟고 걷는다. 다른 발자국은 없으니까.'
	),
	p(
		'In the pack, under dried millet and a spare pair of boots, wrapped in a strip of red silk, rides a piece of the Goguryeo crown no longer than a finger: one gold branch snapped off when the palace fell, its little leaves still hanging on their wires. Nobody else would carry it north. Behind them is the smoke of someone else’s victory. Ahead is only the cold that Yeon once pulled a Mohe boy out of.',
		'등짐 속, 마른 조와 여벌 신발 밑에, 붉은 비단 한 자락에 싸여, 손가락만 한 고구려 왕관 조각이 실려 간다. 궁이 무너질 때 꺾여 나간 금 가지 하나. 작은 잎들이 아직 철사에 매달려 있다. 북쪽으로 그걸 가져가려 한 사람은 아무도 없었다. 뒤에는 남의 승리가 피워 올린 연기. 앞에는 연이 한때 말갈 아이를 끌어낸 그 추위뿐이다.'
	),
	say('daejoyoung', JOYOUNG, ['아버지…', '아버지, 발이… 발이 안 느껴져요.'], ['Father…', 'Father, my feet… I can’t feel my feet.']),
	say('gulgul', GULGUL, ['그럼 됐다.', '아픈 것보단 낫다.'], ['Good.', 'Better than feeling them.']),
	say('daejoyoung', JOYOUNG, ['그게 무슨— 아버지!'], ['What kind of— Father!']),
	say('gulgul', GULGUL, ['저기. 바위 밑.', '조금만 더 가.'], ['There. Under the rock.', 'A little more.']),
	p(
		'The cave is a crack in the mountain’s side, deep enough to put the wind behind them. Gulgul strikes the flint four times before the moss takes. The fire is the size of two cupped hands. He sets the pack down beside it, and the boy, thawing, sees a small gold shine through a split seam in the leather, brighter than a fire that size has any right to make it.',
		'동굴은 산허리에 난 틈이다. 바람을 등 뒤로 돌릴 만큼은 깊다. 걸걸이 부싯돌을 네 번 치고 나서야 이끼에 불이 붙는다. 불은 두 손을 모은 만큼이다. 그가 등짐을 그 옆에 내려놓는데, 몸이 녹기 시작한 아이의 눈에 가죽 터진 솔기 사이로 작은 금빛이 들어온다. 그만한 불이 낼 수 있는 빛보다 밝다.'
	),
	say(
		'daejoyoung',
		JOYOUNG,
		['아버지. 그거… 뭐예요?', '반짝이는 거. 그거요.', '금이에요? 우리 금 있었어요? 그럼 왜 맨날 조죽만—'],
		['Father. What’s… that?', 'The shiny thing. That.', 'Is that gold? We had gold? Then why is it always millet gruel—']
	),
	say('gulgul', GULGUL, ['목소리 낮춰.'], ['Keep your voice down.']),
	p(
		'Gulgul looks at the cave mouth for a long time, as if the snow might be listening. Then he pulls the red silk free. On his palm lies the gold branch, bent where it was torn, its leaves trembling in the heat off the fire.',
		'걸걸은 동굴 입구를 오래 바라본다. 눈이 엿듣기라도 할 것처럼. 그러고는 붉은 비단을 풀어낸다. 손바닥 위에 금 가지가 놓인다. 꺾인 자리가 휘어 있고, 작은 잎들이 불기운에 떨린다.'
	),
	say('gulgul', GULGUL, ['왕관 조각이다.', '고구려 왕관.'], ['A piece of the crown.', 'The Goguryeo crown.']),
	say('daejoyoung', JOYOUNG, ['…훔친 거예요?'], ['…Did you steal it?']),
	say('gulgul', GULGUL, ['가져온 거다.', '아무도 안 가져가길래.'], ['I took it.', 'Nobody else was going to.']),
	say('daejoyoung', JOYOUNG, ['근데 왜 아버지가요?', '아버지는… 말갈이잖아요. 다들 그러던데.'], ['But why you?', 'You’re… Mohe. Everybody says so.']),
	say('gulgul', GULGUL, ['…그래. 말갈이다.'], ['…Yes. I’m Mohe.']),
	p(
		'Gulgul is not a man who tells stories. He tells this one the way he would report a border skirmish: in order, without adjectives, looking at the fire instead of the boy.',
		'걸걸은 이야기를 하는 사람이 아니다. 이 이야기도 변경의 작은 접전을 보고하듯 한다. 순서대로, 꾸밈말 없이, 아이 대신 불을 보면서.'
	),
	say(
		'gulgul',
		GULGUL,
		['내가 너보다 어렸을 때다. 마을이 불탔다.', '고구려 군사들이 왔다 갔지. 연 장군의 군사들.', '나는 문간에 서 있었다. 지붕도 없는 집 문간에.'],
		['I was younger than you. Our village burned.', 'Goguryeo soldiers came through. General Yeon’s men.', 'I stood in the doorway. A doorway with no roof over it.']
	),
	say('daejoyoung', JOYOUNG, ['…왜요?'], ['…Why?']),
	say('gulgul', GULGUL, ['몰라.', '거기가 우리 집이었으니까.'], ['Don’t know.', 'It was our house.']),
	doorway,
	p('The fire has sunk to coals. Gulgul turns the gold over once in his fingers.', '불이 숯으로 가라앉았다. 걸걸이 손가락으로 금 가지를 한 번 뒤집는다.'),
	say(
		'gulgul',
		GULGUL,
		['그 말을 몇 번이나 했는지 모른다.', '겨울마다. 술 마실 때도, 안 마실 때도. 싸우기 전에도, 싸운 뒤에도.'],
		['I don’t know how many times he said it.', 'Every winter. Drunk or sober. Before a fight, after one.']
	),
	p('He wraps the silk around the branch again and puts it in the boy’s hands.', '그는 금 가지를 다시 비단으로 싸서 아이 손에 쥐여 준다.'),
	keepUnderCoat,
	whatDoWeCall,
	heCalledIt,
	p(
		'The boy holds the bundle to the coals. It is warm already, from the pack, from his father’s back. Outside, the snow keeps filling the cave mouth. He presses the cloth once, gold against his palm, and answers the empty north the only way the chronicle will keep.',
		'아이는 보따리를 숯불 쪽으로 든다. 이미 따뜻하다. 등짐에서, 아버지의 등에서 옮아온 온기다. 바깥에서는 눈이 계속 동굴 입구를 메운다. 천을 한 번 누른다. 금이 손바닥에 있다. 빈 북쪽을 사가가 기억할 유일한 방식으로 대답한다.'
	),
	neverDies,
	p('The last coal goes out. Cut to black.', '마지막 숯이 꺼진다. 암전.'),
	...coda
];

const MILLET = new Set(['balhae-wide', 'balhae-north-walk']);
entry.images = entry.images.filter((im) => !MILLET.has(im.id));
for (const im of entry.images) {
	if (im.id === 'balhae-new-dawn') im.at = 'Thirty years later';
	if (im.id === 'balhae-two-courts') im.at = 'Northern and Southern States Era begins';
}

writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

const canon = JSON.parse(readFileSync(CANON, 'utf8'));
canon.characters.gulgul = {
	look: 'Mohe-born, lean and weathered; dark skin, hard narrow eyes, thin moustache and a short chin beard as a man.',
	dress: 'Goguryeo border warden: grey steel lamellar under a heavy white-grey fur mantle, dark-red sash and wrapped forearms.',
	demeanor: 'Grim and spare. Says little, watches the door, stands one step behind whoever he serves.',
	hat: false,
	eras: [
		{ until: 641, text: 'Boy (stage portrait ch_dae_gulgul_young): BEARDLESS, shaved crown with one dark centre strip, two long braids, blood-streaked defiant face, ragged fur over a white wrap.' },
		{ from: 668, text: 'The flight north: no helm, a fur hood and layered pelts over the lamellar, frost in the beard, a leather pack on his back.' }
	],
	never: ['a Goguryeo court robe', 'a crown']
};
canon.characters.daejoyoung = {
	look: 'A boy in 668: round face, dark eyes under heavy brows, a soot or frost smudge on one cheek.',
	dress: 'Red headband with a black sun-disc, brown fur collar, pale blue padded coat, red sash, tan trousers, wrapped leggings, a walking staff.',
	demeanor: 'Restless and stubborn; complains, asks too many questions, then sets his jaw.',
	hat: false,
	never: ['a beard as a boy', 'a crown before 698']
};
writeFileSync(CANON, JSON.stringify(canon, null, '\t') + '\n');

console.log(`Balhae: ${entry.blocks.length} blocks, ${entry.images.length} images.`);
