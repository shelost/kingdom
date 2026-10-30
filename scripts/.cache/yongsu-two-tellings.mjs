// Myth vs reality. Bihyung (myth): the spirits name him; Gildal stays a fox until the red cloth.
// Yongsu (reality): Jinpyung hides the name from Suulbu's list; the purge as it was; scenes identical to the
// myth sped through (header + one line + their stills); the Suulbu supper cut.
// Usage: node scripts/.cache/yongsu-two-tellings.mjs   (idempotent)
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const E = story.flatMap((c) => c.entries ?? []);
const bi = E.find((e) => e.title === 'Bihyung');
const ys = E.find((e) => e.title === 'Yongsu');
const plain = (b) => (b.html ?? (b.en ?? []).join(' / ') ?? '').replace(/<[^>]+>/g, '');
const at = (e, frag) => e.blocks.findIndex((b) => plain(b).includes(frag));
const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, lines) => ({ kind: 'dialogue', ...(person ? { person } : {}), lines, en });
const log = [];

function swap(e, frag, ...blocks) {
	const i = at(e, frag);
	if (i < 0) return false;
	e.blocks.splice(i, 1, ...blocks);
	return true;
}

/* ═════════ Bihyung · the myth ═════════ */

/* the name is the spirits’ gift, not a disguise */
swap(bi, 'Yongsu. / …Bihyung, at home.', say('yongsu', ['Yongsu.'], ['용수요.'])) && log.push('myth: he gives his own name');
if (swap(bi, 'One thing. Don’t say Yongsu inside these walls.', say('jinpyung', ['You’ll sleep in the servants’ wing. Keep your head down, and your feet dry.'], ['하인채에서 자거라. 고개 숙이고, 발은 젖지 않게 하고.']))) {
	swap(bi, 'Bihyung. …It’s because of my nose.');
	swap(bi, 'Then you’re Bihyung. I’ll tell the steward in the morning.');
	swap(
		bi,
		'So the king tells the palace the ghost’s boy is called Bihyung',
		p(
			'So the ghost’s boy comes into the palace as Yongsu, a sutra name on a servant, which makes the steward wince. It will not stay his name for long.',
			'그렇게 귀신의 아이는 용수라는 이름으로 궁에 들어온다. 하인에게 붙은 불경 이름이라 집사가 얼굴을 찡그린다. 그 이름은 오래가지 않는다.'
		)
	);
	log.push('myth: no hidden name');
}
/* Gildal in the reeds: a fox, and stays one */
swap(bi, 'Not Bihyung. Not ghost boy. Majesty.', p('Not boy. Not ghost. Majesty.', '얘도 아니고, 귀신도 아니고. 전하.'));
swap(
	bi,
	'He nearly runs. Instead a fox comes out of the reeds',
	p(
		'He nearly runs. Instead a fox comes out of the reeds, red as a lantern, with a goblin’s eyes, and stands up on its hind legs. It does not stop being a fox. It goes down on its forelegs in the mud, which is how a fox kneels.',
		'그는 하마터면 도망칠 뻔한다. 대신 갈대숲에서 등불처럼 붉은 여우 한 마리가 도깨비 눈을 하고 나와 뒷다리로 일어선다. 여우이기를 그만두지는 않는다. 앞발을 진흙에 꿇는다. 여우는 그렇게 무릎을 꿇는다.'
	)
) && log.push('myth: Gildal stays a fox');
if (at(bi, 'Down here we have our own name for you.') < 0) {
	const follow = at(bi, 'Please. Follow me…!');
	if (follow >= 0)
		bi.blocks.splice(
			follow + 1,
			0,
			say('gildal', ['Down here we have our own name for you, young lord.', 'Bihyung.'], ['여기선 도련님을 부르는 이름이 따로 있지요.', '비형.']),
			say('yongsu', ['Why that?'], ['왜 그거야?']),
			say('gildal', ['Ask the reeds. They chose it.'], ['갈대한테 물어보세요. 걔들이 골랐어요.'])
		);
}
swap(
	bi,
	'He follows the fox into the reeds. The song doesn’t say what he saw there.',
	p(
		'He follows the fox into the reeds. The song doesn’t say what he saw there. It only says he came back at dawn answering to the spirits’ name, and went again the next night, and the next.',
		'그는 여우를 따라 갈대숲으로 들어간다. 노래는 거기서 그가 무엇을 봤는지 말하지 않는다. 다만 새벽에 그가 귀신들이 붙여 준 이름에 대답하며 돌아왔고, 다음 날 밤에도, 그다음 날 밤에도 또 갔다고만 한다.'
	)
);
for (const b of bi.blocks)
	if (b.html?.startsWith('Surabol takes the king’s nickname and turns it into an insult.')) {
		b.html = b.html.replace('Surabol takes the king’s nickname', 'Surabol takes the spirits’ name for him');
		b.ko = b.ko?.replace(/^[^.]*\./, '서라벌은 귀신들이 붙인 그 이름을 주워다 욕으로 만든다.');
	}

/* ═════════ Yongsu · the reality ═════════ */

/* the name hidden from Suulbu */
swap(
	ys,
	'One thing. Don’t say Yongsu inside these walls.',
	say(
		'jinpyung',
		['One thing. Never say Yongsu inside these walls.', 'The night your father fell, Suulbu walked this city with a list. He is still alive, and he still reads it. A sutra name on a servant boy is a line he will want to finish.', 'What does your mother call you?'],
		['하나만. 이 담 안에선 절대 용수라고 하지 마라.', '네 아버지가 쓰러지던 밤, 수을부가 명단을 들고 이 도성을 돌았다. 그 사람 아직 살아 있고, 아직도 그 명단을 읽는다. 하인 아이한테 붙은 불경 이름은, 그 사람이 마저 채우고 싶어 할 한 줄이야.', '네 어미는 널 뭐라 부르냐?']
	)
) && log.push('reality: the name hidden from Suulbu');
for (const b of ys.blocks)
	if (b.html?.startsWith('So the king tells the palace the ghost’s boy is called Bihyung') && !b.html.includes('Not for the joke')) {
		b.html += ' Not for the joke. For the list.';
		b.ko = (b.ko ?? '') + ' 농담 때문이 아니다. 그 명단 때문이다.';
	}

/* the purge, as it was */
if (swap(
	ys,
	'Here is what the song leaves out. When the Council took the crown off Jinji',
	p(
		'Here is what the song leaves out. When the Council took the crown off Jinji, Suulbu, the old king’s brother and the next High Councillor, went through the city with a list and forty riders. The guards who had stood at the king’s door went first. He had their eyes put out, so they would never again stand at a door and see who came through it.',
		'노래가 빼먹는 대목은 이렇다. 화백이 진지의 관을 벗기자, 선왕의 아우이자 다음 상대등이 될 수을부가 명단과 기병 마흔을 데리고 성안을 돌았다. 맨 먼저 임금 문 앞을 지키던 호위들. 그는 그들의 눈을 뽑게 했다. 다시는 어느 문 앞에 서서 누가 드나드는지 보지 못하게.'
	),
	p(
		'Then the men who had argued against the vote: hanged in their own yards, or sent to the northern forts in chains, which came to the same thing a winter later. Their wives went after them. Then the children. The small ones were tied in rice sacks and put in the Hwangchun at night, where the current runs fast, so that nobody would have to dig. The older ones were simply left: no parents, no house, no name.',
		'다음은 표결에 반대한 자들. 제 집 마당에서 목이 매달리거나, 쇠사슬에 묶여 북쪽 성으로 보내졌다. 한 해 겨울이 지나면 결국 같은 일이었다. 아내들도 뒤따랐다. 그다음은 아이들. 어린것들은 쌀자루에 묶여 밤에 물살 빠른 황천에 던져졌다. 아무도 땅을 팔 필요가 없게. 큰 아이들은 그냥 남겨졌다. 부모도, 집도, 이름도 없이.'
	),
	p(
		'And once nobody had stopped him, anybody Suulbu simply didn’t like got “Jinji’s man” written beside his name too. You’d be surprised how many Jinji’s men there turned out to be.',
		'그리고 아무도 말리지 않자, 그냥 수을부 눈에 거슬리는 자 누구든 이름 옆에 “진지의 사람”이 적혔다. 진지의 사람이 그렇게 많았는지 알면 놀랄 거다.'
	)
)) log.push('reality: the purge');
swap(
	ys,
	'She’s the last. My littlest. There were three before her.',
	say(
		null,
		['She’s the last. My littlest. There were three before her.', 'Suulbu wrote “Jinji’s man” next to their father’s name, and then next to theirs. Fourteen, twelve and nine.', 'They tied them in rice sacks and carried them down to the river. I heard it from the bank. Three times.', 'She’s got no name. She can’t even be buried properly. Give her back a name. That’s all.'],
		['얘가 마지막이에요. 우리 막내. 위로 셋이 더 있었어요.', '수을부가 걔들 아버지 이름 옆에 “진지의 사람”이라고 썼고, 그다음엔 걔들 이름 옆에도 썼어요. 열네 살, 열두 살, 아홉 살.', '쌀자루에 묶어서 강으로 지고 갔어요. 둑에서 다 들었어요. 세 번.', '얘는 이름도 없어요. 죽어도 제대로 묻히지도 못해요. 이름만 돌려줘요. 그게 다예요.']
	)
);
for (const b of ys.blocks) if (b.kind === 'dialogue' && b.en?.[0] === 'She’s the last. My littlest. There were three before her.' && !b.speaker) b.speaker = 'A woman with a baby';

/* the Suulbu supper: not part of his story */
const blockText = (b) => [b.html, b.ko, b.label, ...(b.en ?? []), ...(b.lines ?? [])].filter(Boolean).join(' ').toLowerCase();
function sceneRange(label) {
	const i = ys.blocks.findIndex((b) => (b.kind === 'scene' || b.kind === 'story') && b.label === label);
	if (i < 0) return null;
	let j = i + 1;
	while (j < ys.blocks.length && !['scene', 'story'].includes(ys.blocks[j].kind)) j++;
	return [i, j];
}
const anchored = (im, from, to) => {
	const k = ys.blocks.findIndex((b) => blockText(b).includes((im.at ?? '').toLowerCase()));
	return k >= from && k < to;
};
const supper = sceneRange('Prince Suulbu’s house · supper');
if (supper) {
	const [i, j] = supper;
	const dropped = ys.images.filter((im) => anchored(im, i, j)).map((im) => im.id);
	ys.images = ys.images.filter((im) => !dropped.includes(im.id));
	ys.blocks.splice(i, j - i);
	log.push(`reality: cut the Suulbu supper (${dropped.length} stills left to the myth)`);
}

/* the same in both tellings: one line, and the stills */
const BRIEF = {
	'The palace · the Cloud King’s last night': [
		'The Cloud King dies in a monk’s robe. His second son Saryun kneels by the bed smelling of plum wine, with his dead brother’s boy Baekjung asleep across his knees.',
		'구름왕이 승복을 입고 죽는다. 둘째 아들 사륜이 매실주 냄새를 풍기며 침상 곁에 무릎을 꿇고, 그 무릎엔 죽은 형의 아들 백정이 잠들어 있다.'
	],
	'The eastern hills · the Cloud King’s tomb': [
		'They bury him under a hill a thousand men build in a month. At the top the new king turns, looks at all of it, and asks for a cup.',
		'천 명이 한 달 걸려 쌓은 언덕 아래 그를 묻는다. 꼭대기에서 새 임금은 돌아서서 그 모든 걸 내려다보고, 잔을 달라고 한다.'
	],
	'The Harmony Council · three days later': [
		'Three days later six old men vote, and a boy named Eulje writes the new king’s name in the minutes. Saryun is crowned Jinji. Remember the boy’s face.',
		'사흘 뒤 늙은이 여섯이 표결하고, 을제라는 소년이 새 임금의 이름을 회의록에 적는다. 사륜은 진지왕이 된다. 그 소년의 얼굴을 기억해 두라.'
	],
	'The Moon Palace · the wine years': [
		'He tries, for one winter. Then the forts start falling, the Moon Palace fills with lantern boats and dancers, and the Council’s reports wait outside a shut door.',
		'그는 한 해 겨울은 애쓴다. 그러다 성들이 떨어지기 시작하고, 월성은 등불 띄운 배와 춤꾼들로 가득 차고, 화백의 보고는 닫힌 문 밖에서 기다린다.'
	],
	'The throne hall · after midnight': [
		'One night after midnight the drunk king lifts his ten-year-old nephew onto the throne, and the musicians stop. Then he carries the boy back to bed and ties back his sleeves so he won’t trip. Remember the sleeves.',
		'어느 날 자정 넘어 술 취한 임금이 열 살 조카를 왕좌에 올려 앉히고, 악사들이 멈춘다. 그러고는 아이를 안아다 재우며, 밤에 걸려 넘어지지 않게 소매를 묶어 준다. 그 소매를 기억해 두라.'
	],
	'The Moon Palace · before dawn': [
		'Before dawn forty guards knock three times on a barred door. The party is still going when they come in.',
		'동트기 전, 군사 마흔이 빗장 걸린 문을 세 번 두드린다. 그들이 들어설 때도 잔치는 아직 계속되고 있다.'
	],
	'The throne hall · three days later': [
		'Three days later they bring him back to watch his nephew crowned in a robe hemmed in a hurry. For a moment, across the hall, it is only a boy and his uncle.',
		'사흘 뒤 그를 다시 데려와, 급히 단을 꿰맨 옷을 입고 왕관을 쓰는 조카를 보게 한다. 잠깐 동안, 전각을 사이에 두고, 그저 소년과 그의 숙부일 뿐이다.'
	],
	'The walled house · autumn': [
		'His mother comes once. He dies before the first frost in the walled house with a cup in his hand, and his house drops a bone, from Sacred to True.',
		'어머니는 한 번 찾아온다. 그는 첫서리 전에 담 높은 집에서 잔을 든 채 죽고, 그의 집은 뼈 하나가 내려앉는다. 성골에서 진골로.'
	],
	'The Moon Palace · the servants’ yard': [
		'A palace servant who talks to the air is the lowest thing in the palace. They salt his shoes and leave his bowl by the kitchen door like a dog’s, and the maids who won’t sleep near him still walk past his door.',
		'허공에 대고 말하는 궁 하인은 궁에서 제일 낮은 존재다. 사람들은 그의 신발에 소금을 치고, 개밥처럼 부엌문 밖에 그릇을 내놓는다. 그래도 그 곁에선 안 자겠다는 시녀들이 그의 방 앞을 지나간다.'
	],
	'The palace garden · the introduction': [
		'The king introduces them in the garden, the madman in a borrowed coat and the princess in a temper, and leaves them alone, which is a terrible idea.',
		'임금은 정원에서 둘을 인사시킨다. 빌린 옷을 입은 미치광이와, 잔뜩 성난 공주. 그리고 둘만 두고 간다. 아주 나쁜 생각이다.'
	],
	'The Sinwon temple ditch · night': [
		'King Jinpyung tests his ghost in public: a bridge over the Sinwon ditch in one night. In the morning there is a bridge, a little crooked, and the court walks the long way round.',
		'진평왕은 사람들 앞에서 제 귀신을 시험한다. 하룻밤 만에 신원사 도랑에 다리를 놓으라고. 아침이 되자 조금 삐뚤어진 다리가 놓여 있고, 조정은 먼 길로 돌아간다.'
	],
	'The House by the Stream · spring': [
		'Spring comes early. Chunmyung labours all night in the house by the water while her husband talks to the stream for nine hours, loudly, and in the morning there is a boy.',
		'봄이 일찍 온다. 천명이 물가 집에서 밤새 산고를 겪는 동안 남편은 아홉 시간 내내 큰 소리로 개울에 말을 건다. 아침이 되자 사내아이가 하나 있다.'
	],
	'Surabol · Chunchu’s wedding': [
		'Thirteen years later the goblin’s whelp marries the sister of the strongest boy in Silla. Across the hall, ninety-year-old Suulbu sends a cup, and only the groom’s father understands it.',
		'열세 해 뒤 도깨비 새끼가 신라에서 제일 센 소년의 누이와 혼인한다. 전각 건너편에서 아흔 살 수을부가 잔을 보내고, 그 뜻을 아는 건 신랑의 아버지뿐이다.'
	]
};
const KEEP = new Set(['diagram', 'map', 'quote', 'battle', 'table']);
let briefed = 0;
for (const [label, [en, ko]] of Object.entries(BRIEF)) {
	const range = sceneRange(label);
	if (!range) continue;
	const [i, j] = range;
	if (ys.blocks[i + 1]?.html === en) continue;
	const kept = ys.blocks.slice(i + 1, j).filter((b) => KEEP.has(b.kind));
	const stills = ys.images.filter((im) => anchored(im, i + 1, j));
	ys.blocks.splice(i + 1, j - i - 1, p(en, ko), ...kept);
	const anchor = en.split(' ').slice(0, 6).join(' ');
	for (const im of stills) im.at = anchor;
	briefed++;
}
log.push(`reality: ${briefed} shared scenes sped through`);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
for (const e of [bi, ys]) for (const b of e.blocks) if (b.kind === 'dialogue' && b.lines.length !== b.en.length) console.log('MISMATCH', e.title, b.en);
const lost = (e) => (e.images ?? []).filter((im) => im.at && !e.blocks.some((b) => blockText(b).includes(im.at.toLowerCase()))).map((im) => im.id);
console.log(log.join('\n'));
console.log('unanchored · Bihyung', lost(bi), '· Yongsu', lost(ys));
console.log('blocks · Bihyung', bi.blocks.length, '· Yongsu', ys.blocks.length);
