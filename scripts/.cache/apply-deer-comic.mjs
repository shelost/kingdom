/** Expand Munhee's Class 59 deer hunt into comic-ready beats, and rename Katsuragi. */
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const HW = { person: 'alchun', look: 'hwarang', chip: '#8fb3e0' };
const CH = { person: 'chunchu', look: 'hwarang', chip: '#D8258C' };
const YU = { person: 'yushin', look: 'hwarang', chip: '#4a8fe0' };

const DEER = [
	{ kind: 'scene', label: 'The forest · a piece of an animal', ko: '숲 · 짐승 조각' },
	{
		kind: 'p',
		html: 'Alchun stands them in a line and does not raise his voice. He never does.',
		ko: '알천이 아이들을 한 줄로 세운다. 목소리를 높이지 않는다. 원래 안 높인다.'
	},
	{
		kind: 'p',
		html: 'Twenty-two. Teal over rust. A red scar cutting the left temple. Crescent still on him. The boys call him senior. The yard calls him the tiger-catcher. He doesn’t have to shout.',
		ko: '스물둘. 녹슨 붉은 옷 위에 청록. 왼쪽 관자놀이를 가르는 붉은 흉터. 초승달 머리띠는 아직 있다. 아이들은 선배라 한다. 연무장은 호랑이 잡은 사람이라 한다. 소리를 지를 필요가 없다.'
	},
	{
		kind: 'dialogue',
		...HW,
		en: [
			'A piece of an animal before sundown.',
			'Walking does not count.',
			'Empty does not count either.'
		],
		lines: ['해 지기 전에 짐승 조각이다.', '걷는 건 안 된다.', '빈손도 안 된다.']
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['Each hyangdo goes into the forest. I will be here when you come back. Most of you.'],
		lines: ['향도마다 숲에 들어가라. 돌아올 때 내가 여기 있다. 대부분은.']
	},
	{
		kind: 'p',
		html: 'The bands form the way they always form. Heum takes six. Somebody takes five. Nobody wants the ghost boy in their hyangdo.',
		ko: '무리는 늘 그렇듯 묶인다. 흠이 여섯. 누가 다섯. 귀신 자식을 향도에 넣겠다는 사람이 없다.'
	},
	{
		kind: 'p',
		html: 'The space around Chunchu stays a space. He has known it would, since the shoes in the pond. He stands in it anyway, as if the line might change its mind.',
		ko: '춘추 주위만 빈다. 못에 신발 빠지던 밤부터 이럴 줄 알았다. 그래도 그 빈자리에 선다. 줄이 마음을 바꿀지도 모른다는 듯이.'
	},
	{
		kind: 'dialogue',
		speaker: 'Heum',
		gender: 'm',
		en: ['Who’s taking the ghost?', 'He’ll talk it to death.'],
		lines: ['귀신 누가 데려가?', '말로 죽여 버리겠지.']
	},
	{
		kind: 'p',
		html: 'Nobody answers. Alchun does not usually walk out with a group. He looks at the empty ring the way he looks at a crooked stance.',
		ko: '대답하는 사람이 없다. 알천은 원래 무리를 직접 끌고 나가지 않는다. 빈 줄을 본다. 자세가 틀린 아이를 보듯.'
	},
	{
		kind: 'p',
		html: 'He was the skinny one once. He remembers the laugh. Then he walks into it.',
		ko: '자기도 마른 아이였던 적이 있다. 그 웃음도 기억한다. 그리고 그 안으로 걸어 들어간다.'
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['I am.', 'You lot, move.'],
		lines: ['내가 간다.', '너희는 가라.']
	},
	{
		kind: 'dialogue',
		speaker: 'Heum',
		gender: 'm',
		en: ['Alchun?', 'For him?'],
		lines: ['알천 선배가?', '저거 때문에?']
	},
	{
		kind: 'p',
		html: 'Chunchu looks at Alchun, and then at the gate, and does not ask why. Asking why is how you lose a thing like this.',
		ko: '춘추가 알천을 보고, 문을 보고, 왜냐고 묻지 않는다. 이런 건 왜냐고 묻는 순간 놓친다.'
	},
	{ kind: 'scene', label: 'The pines', ko: '소나무' },
	{
		kind: 'p',
		html: 'Pines. Afternoon. A path deer use, if you believe the droppings. Alchun is already mid-throw when the thing is gone.',
		ko: '소나무. 오후. 배설물을 믿자면 사슴이 다니는 길. 알천이 던지려던 참에, 그게 없다.'
	},
	{
		kind: 'p',
		html: 'The deer is there and then it is not. Alchun’s arm is still out.',
		ko: '사슴이 있다. 그리고 없다. 알천의 팔은 아직 나와 있다.'
	},
	{
		kind: 'p',
		html: 'Chunchu does not run. He tilts his head, the way he tilts it at a go board when the other person has just played the obvious stone.',
		ko: '춘추는 쫓지 않는다. 머리를 기울인다. 바둑에서 상대가 뻔한 수를 두었을 때 기울이는 그 각이다.'
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['Well.', 'That’s a deer.'],
		lines: ['그래.', '사슴이구나.']
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['You going to talk to it, or chase it.', 'Talking didn’t work on a tiger. I’ll tell you that for free.'],
		lines: ['말 걸 거냐, 쫓을 거냐.', '호랑이한테 말은 안 먹히더라. 그건 공짜로 알려 준다.']
	},
	{
		kind: 'dialogue',
		...CH,
		en: ['If I chase it I lose it.', 'Give me until the shadow hits that pine.'],
		lines: ['쫓으면 잃습니다.', '저 소나무에 그늘 닿을 때까지만요.']
	},
	{
		kind: 'dialogue',
		...CH,
		en: ['I have an idea. It’s a bit— ugly. You might not like it.'],
		lines: ['생각이 있습니다. 좀— 지저분합니다. 마음에 안 드실 수도 있고요.']
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['Ugly I can live with.', 'Stupid I send home.', 'Sit down if you’re sitting.'],
		lines: ['지저분한 건 참는다.', '바보 같은 건 보낸다.', '앉을 거면 앉아.']
	},
	{
		kind: 'p',
		html: 'He sits. He carves. Alchun takes a root and watches him the way you watch a boy who might still be stupid.',
		ko: '앉는다. 깎는다. 알천은 뿌리를 잡고, 아직 바보일 수 있는 아이를 보듯 본다.'
	},
	{
		kind: 'p',
		html: 'A wooden doe with a coat of moss. The first ears are too long. Chunchu swears under his breath, which Alchun also pretends not to hear, and cuts them back.',
		ko: '이끼 입힌 나무 암사슴. 첫 귀가 길다. 춘추가 낮은 소리로 욕을 하고, 알천은 그것도 안 들은 척하고, 귀를 다시 깎는다.'
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['That’s not a deer.'],
		lines: ['그건 사슴이 아니다.']
	},
	{
		kind: 'dialogue',
		...CH,
		en: ['It will be, if I get the ears right.', 'They look at the ears first. I checked.'],
		lines: ['귀만 맞으면 됩니다.', '귀부터 보더라고요. 확인해 봤습니다.']
	},
	{
		kind: 'p',
		html: 'He picks leaves Alchun does not know the name of and crushes them against a stone until the smell goes sweet and wrong. He paints the wooden mouth. His hands are steady. Alchun’s are not, quite.',
		ko: '알천이 이름 모르는 잎을 집어, 돌에 짓이겨 달고 이상한 냄새가 날 때까지 간다. 나무 입에 바른다. 춘추의 손은 안 떤다. 알천의 손은, 조금, 떤다.'
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['And that.'],
		lines: ['그건.']
	},
	{
		kind: 'dialogue',
		...CH,
		en: [
			'These put a horse to sleep.',
			'A deer is smaller.',
			'It shouldn’t— I mean. It should wake up. If I didn’t take too much.'
		],
		lines: ['말 재우는 잎입니다.', '사슴은 더 작고요.', '안— 그러니까. 깨긴 깰 겁니다. 너무 많이 안 바르면.']
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['And if you did.'],
		lines: ['많이 바르면.']
	},
	{
		kind: 'dialogue',
		...CH,
		en: ['Then I bring a head, and Heum gets his joke.', 'I’d rather not give him that.'],
		lines: ['그러면 머리를 가져가고, 흠이 웃겠지요.', '그건 주기 싫습니다.']
	},
	{
		kind: 'p',
		html: 'They set the doe on the path. They sit downwind. Alchun’s fingers drum once on his knee and stop.',
		ko: '암사슴을 길에 세운다. 바람 아래로 앉는다. 알천의 손가락이 무릎에서 한 번 구르다 멈춘다.'
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['How long.'],
		lines: ['얼마나.']
	},
	{
		kind: 'dialogue',
		...CH,
		en: ['Until it comes.'],
		lines: ['올 때까지요.']
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['That’s not a time.'],
		lines: ['그건 시간이 아니다.']
	},
	{
		kind: 'dialogue',
		...CH,
		en: ['Until the shadow hits that pine. I said.'],
		lines: ['저 소나무에 그늘 닿을 때까지요. 말씀드렸잖아요.']
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['You said a lot of things.'],
		lines: ['말은 많이 하더라.']
	},
	{
		kind: 'p',
		html: 'Nothing happens for long enough that a lesser boy would have started explaining. Chunchu does not explain.',
		ko: '한참 아무 일도 없다. 덜된 아이면 설명을 시작했을 시간이다. 춘추는 설명하지 않는다.'
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['If this doesn’t work I’m telling them you made me sit in damp leaves.'],
		lines: ['안 되면, 네가 나더러 젖은 잎에 앉혔다고 이를 거다.']
	},
	{
		kind: 'dialogue',
		...CH,
		en: ['If this doesn’t work, they won’t ask you anything.'],
		lines: ['안 되면, 선배한테 물을 사람이 없을 겁니다.']
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['You’re shivering.'],
		lines: ['떨리네.']
	},
	{
		kind: 'dialogue',
		...CH,
		en: ['The leaves. They’re a bit— damp.'],
		lines: ['잎이요. 좀— 젖어서.']
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['Mm.'],
		lines: ['음.']
	},
	{
		kind: 'p',
		html: 'The deer comes. It noses the wooden mouth.',
		ko: '사슴이 온다. 나무 입에 코를 댄다.'
	},
	{
		kind: 'p',
		html: 'The deer that comes is huge. Shoulder as high as the boy’s chest. It folds anyway.',
		ko: '오는 사슴이 크다. 어깨가 아이 가슴까지다. 그래도 접힌다.'
	},
	{
		kind: 'p',
		html: 'The knife is in Chunchu’s hand before he has decided to pick it up. Alchun does not take it from him.',
		ko: '결정하기도 전에 칼이 춘추 손에 있다. 알천은 뺏지 않는다.'
	},
	{
		kind: 'p',
		html: 'The pines go. There is only his face. Then he lets the knife hang, and looks at the sleeping animal, and laughs once, very quietly, at himself.',
		ko: '소나무가 사라진다. 그 얼굴만 남는다. 그리고 칼을 늘어뜨리고, 잠든 짐승을 보고, 아주 낮게, 한 번, 자기를 보고 웃는다.'
	},
	{
		kind: 'dialogue',
		...CH,
		en: [
			'If I bring a head, they’ll say I found it.',
			'If it walks— they have to look at me.',
			'That’s ugly too. I did warn you.'
		],
		lines: [
			'머리만 가져가면, 주웠다고 할 겁니다.',
			'걸어오면— 절 볼 수밖에 없잖아요.',
			'이것도 지저분합니다. 말씀드렸잖아요.'
		]
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['Do it.', 'I’m not carrying it.', 'And if it doesn’t wake, you carry the head. That’s the bet.'],
		lines: ['해.', '나는 안 든다.', '안 깨면 네가 머리 든다. 그게 내기다.']
	},
	{
		kind: 'p',
		html: 'The antlers come off like a hat.',
		ko: '뿔이 모자처럼 떨어진다.'
	},
	{
		kind: 'dialogue',
		...CH,
		en: ['Easy. Just the hat. You can keep the rest.'],
		lines: ['편히. 모자만이야. 나머지는 네 거야.']
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['You’re talking to it.'],
		lines: ['말 거네.']
	},
	{
		kind: 'dialogue',
		...CH,
		en: ['It seemed polite.'],
		lines: ['예의가 아닐까 해서요.']
	},
	{
		kind: 'p',
		html: 'He ties a plum blossom on the cut because his hands are shaking now and a flower is something to hold.',
		ko: '자른 자리에 매화 한 송이를 맨다. 이제 손이 떨리고, 꽃은 잡을 것이라서다.'
	},
	{
		kind: 'p',
		html: 'The deer wakes. It startles. It looks at him. It walks.',
		ko: '사슴이 깬다. 깜짝 놀란다. 그를 본다. 걷는다.'
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['Hah.'],
		lines: ['하.']
	},
	{ kind: 'scene', label: 'The yard · last through the gate', ko: '연무장 · 문으로 마지막' },
	{
		kind: 'p',
		html: 'Last through the gate: a magenta sleeve, and a deer still walking.',
		ko: '문으로 마지막. 자홍빛 소매, 그리고 아직 걷는 사슴.'
	},
	{
		kind: 'p',
		html: 'Heum has a fawn on the line and a joke half out. The joke dies. The fawn looks embarrassed to be dead. Alchun is beside Chunchu, empty hands, as if he had planned this, which he had not.',
		ko: '흠은 선에 새끼를 내려놓고 농담을 반쯤 꺼낸 채다. 농담이 죽는다. 새끼는 죽어 있는 게 민망한 얼굴이다. 곁에 알천. 쥐지도 않은 고삐 위에 빈 손. 계획한 사람처럼. 계획하지는 않았다.'
	},
	{
		kind: 'dialogue',
		speaker: 'Heum',
		gender: 'm',
		en: ['Goblin’s boy’s still out.', 'Probably talking to—', '…That’s walking.'],
		lines: ['도깨비 녀석 아직이다.', '말하고 있겠지, 사슴이—', '…걷잖아.']
	},
	{
		kind: 'dialogue',
		speaker: 'A judge',
		gender: 'm',
		en: ['Doesn’t count.', 'Kill it.'],
		lines: ['안 된다.', '죽여.']
	},
	{
		kind: 'dialogue',
		...CH,
		en: ['If I kill it now, sir, it’s just late.', 'If I don’t, it’s a deer.'],
		lines: ['지금 죽이면, 늦은 사슴입니다.', '안 죽이면 사슴입니다.']
	},
	{
		kind: 'p',
		html: 'The judges shout. On the wall, a young hwarang in blue is eating a pear. He is not the one who walked out. Class 51 still owns the wall. He has been watching the rope, not the horn. He puts the pear down.',
		ko: '심판들이 소리를 지른다. 담 위, 푸른 옷의 젊은 화랑이 배를 먹고 있다. 걸어 나온 사람은 아니다. 오십일기는 아직 그 담의 것이다. 그는 뿔이 아니라 고삐를 보고 있었다. 배를 내려놓는다.'
	},
	{
		kind: 'dialogue',
		...HW,
		en: ['He brought a deer.'],
		lines: ['사슴을 데려왔다.']
	},
	{
		kind: 'dialogue',
		...YU,
		en: ['The game said bring a deer.', 'It did not say kill one.'],
		lines: ['놀이가 사슴을 내라 했지.', '죽이라 하진 않았네.']
	},
	{
		kind: 'p',
		html: 'The deer eats the blossom off its own horn. Somebody starts to laugh and cannot finish it.',
		ko: '사슴이 제 뿔에서 꽃을 뜯어 먹는다. 누가 웃다가 끝을 못 낸다.'
	},
	{
		kind: 'p',
		html: 'After that they start saying the magenta one is clever, which is a different kind of laugh, and Chunchu stands in it as if he had expected that too.',
		ko: '그다음부터는 자홍빛 아이가 똑똑하다 한다. 다른 종류의 웃음이다. 춘추는 그것도 알고 있었다는 듯이 그 안에 선다.'
	},
	{
		kind: 'dialogue',
		...YU,
		en: ['Name.'],
		lines: ['이름.']
	},
	{
		kind: 'dialogue',
		...CH,
		en: ['Kim Chunchu, sir.'],
		lines: ['김춘추입니다.']
	},
	{
		kind: 'dialogue',
		...YU,
		en: ['The deer is still walking.', 'Don’t lose that.'],
		lines: ['사슴이 아직 걷고 있네.', '그걸 잃지 말게.']
	}
];

function walk(blocks, fn) {
	for (const b of blocks) {
		fn(b);
		if (b.kind === 'flashback' && Array.isArray(b.blocks)) walk(b.blocks, fn);
	}
}

let jesang = 0;
for (const ch of story) {
	for (const en of ch.entries ?? []) {
		if (en.title === 'Munhee') {
			const start = en.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The forest · a piece of an animal');
			const end = en.blocks.findIndex(
				(b) =>
					b.kind === 'dialogue' &&
					b.person === 'yushin' &&
					Array.isArray(b.en) &&
					b.en.includes('Don’t lose that.')
			);
			if (start < 0 || end < 0) throw new Error(`Munhee deer span missing: start=${start} end=${end}`);
			en.blocks.splice(start, end - start + 1, ...DEER);
			console.log(`Munhee deer: replaced ${end - start + 1} blocks with ${DEER.length} at ${start}`);
		}
		walk(en.blocks ?? [], (b) => {
			if (b.kind === 'dialogue' && b.person === 'nintoku' && Array.isArray(b.en)) {
				const i = b.en.indexOf('Katsuragi.');
				if (i >= 0) {
					b.en[i] = 'Sotsuhiko.';
					if (b.lines?.[i] === '가쓰라기.') b.lines[i] = '소쓰히코.';
					jesang++;
				}
			}
			if (b.kind === 'p' && typeof b.html === 'string' && b.html.includes('Katsuragi brings')) {
				b.html = b.html.replace('Katsuragi brings', 'Sotsuhiko brings');
				if (typeof b.ko === 'string') b.ko = b.ko.replace('가쓰라기가', '소쓰히코가').replace('가쓰라기', '소쓰히코');
				jesang++;
			}
		});
		for (const im of en.images ?? []) {
			if (typeof im.alt === 'string' && im.alt.includes('Katsuragi')) {
				im.alt = im.alt.replaceAll('Katsuragi', 'Sotsuhiko');
			}
			if (typeof im.prompt === 'string' && im.prompt.includes('Katsuragi')) {
				im.prompt = im.prompt.replaceAll('Katsuragi', 'Sotsuhiko');
			}
		}
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`Katsuragi → Sotsuhiko story hits: ${jesang}`);
