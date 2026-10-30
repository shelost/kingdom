import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const entry = story.flatMap((c) => c.entries).find((e) => e.title === 'Jahee');
if (entry.blocks.some((b) => b.kind === 'scene' && b.label === 'The Grain Loft')) {
	console.log('already expanded');
	process.exit(0);
}

const J = { kind: 'dialogue', chip: '#e8a0bf', person: 'jayi' };
const B = { kind: 'dialogue', chip: '#C41E3A', person: 'munmu' };
const say = (who, en, lines) => ({ ...who, lines, en });
const p = (html, ko) => ({ kind: 'p', html, ko });

const at = entry.blocks.findIndex((b) => b.kind === 'p' && b.html.startsWith('He comes back in the spring'));
if (at < 0) throw new Error('spring paragraph not found');

const spring = [
	p(
		'He comes back in the spring to fix his sums. The sums are fine. He brings them anyway, every morning, and she finds mistakes in them that are not there.',
		'봄에 그는 셈을 고치러 돌아온다. 셈은 멀쩡하다. 그래도 매일 아침 들고 오고, 그녀는 거기서 있지도 않은 틀린 곳을 찾아낸다.'
	),
	say(J, ['This one’s wrong.'], ['이거 틀렸네예.']),
	say(B, ['It isn’t.'], ['안 틀렸습니다.']),
	say(J, ['I know. Sit down.'], ['알아예. 앉으이소.']),
	p(
		'She decides his brush hand is the real problem. He holds a brush like a spear. She stands behind his stool, puts her hand over his, and shows him how much ink a small brush can take.',
		'그녀는 진짜 문제가 붓 잡는 손이라고 정한다. 그는 붓을 창처럼 쥔다. 그녀는 그의 의자 뒤에 서서 그의 손 위에 제 손을 얹고, 작은 붓이 먹을 얼마나 머금을 수 있는지 보여 준다.'
	),
	say(
		J,
		['Lighter. You press like a soldier.', 'Wet it properly. All the way down, then slow. Don’t stab the stone.'],
		['살살요. 무슨 군인처럼 눌러예.', '먹을 제대로 묻히이소. 끝까지 푹, 그라고 천천히. 벼루 찌르지 말고예.']
	),
	say(B, ['…Is this still about the brush?'], ['……이거, 아직 붓 얘기 맞습니까?']),
	say(J, ['You’re a prince. You should be able to tell.'], ['왕자님이시잖아예. 그 정도는 알아들으셔야지예.']),
	p(
		'He can tell. He writes the next column so badly that she has to stand there for an hour.',
		'그는 알아듣는다. 다음 줄을 어찌나 엉망으로 쓰는지, 그녀는 한 시진을 그 자리에 서 있어야 한다.'
	),
	p(
		'In the second week she teaches him the spring tides. At new moon the sea comes in higher and harder than any other day, and it does not ask the quay first. She explains this with her mouth very close to his ear.',
		'둘째 주에는 사리를 가르친다. 그믐에는 바다가 어느 날보다 높고 세게 들어오고, 부두한테 먼저 묻지 않는다. 그녀는 그의 귀에 입을 바짝 대고 이것을 설명한다.'
	),
	say(
		J,
		['Twice a day it comes in. Every day. You can’t stop it, you can only be ready for it.'],
		['하루에 두 번 들어와예. 매일. 막을 수는 없고, 받을 준비만 하는 기라예.']
	),
	say(B, ['Are we… talking about the sea.'], ['우리… 지금 바다 얘기 하는 겁니까.']),
	say(J, ['Count it, prince. The new moon is in six days.'], ['세 보이소, 왕자님. 그믐이 엿새 남았어예.']),
	p(
		'He counts it. He counts it every night for six nights, on his back in the guesthouse, and gets the same number every time, which has never happened to him before.',
		'그는 센다. 엿새 밤을 객사에 누워 세고, 매번 같은 숫자가 나온다. 그에게는 처음 있는 일이다.'
	),
	{ kind: 'scene', label: 'The Grain Loft', ko: '곡간 다락' },
	p(
		'The new moon. The fifth ship’s warehouse, the one that was forty sacks short. Her father has gone up the coast to argue about salt. The tide climbs the pilings under the floor, and the whole loft creaks with it.',
		'그믐. 마흔 섬이 모자랐던 다섯째 배의 창고. 아버지는 소금 일로 다투러 해안을 따라 올라갔다. 바닥 밑에서 물이 기둥을 타고 오르고, 다락 전체가 그 소리로 삐걱인다.'
	),
	p(
		'She brought the lamp. He brought nothing, and has been standing at the top of the ladder for some time.',
		'등잔은 그녀가 들고 왔다. 그는 아무것도 안 들고 왔고, 한참째 사다리 꼭대기에 서 있다.'
	),
	say(
		J,
		['Are you coming up, or are you going to stand there and count the rungs?'],
		['올라올 기가, 아니믄 거 서서 사다리 칸이나 셀 기가?']
	),
	say(B, ['I was— I already counted them. Nine.'], ['저는— 벌써 셌습니다. 아홉.']),
	say(J, ['Ten. You’re standing on one.'], ['열. 하나 밟고 있다 아이가.']),
	p(
		'He comes up. He tries to undo her jacket tie and gets it wrong, and she laughs at him, and takes his hands, and does it with him slowly, the way she did the brush.',
		'그가 올라온다. 그녀의 옷고름을 풀려다 엉뚱하게 당기고, 그녀는 웃고, 그의 손을 잡아, 붓을 가르칠 때처럼 천천히 같이 푼다.'
	),
	say(J, ['Not like that. You’re one knot short.', '…There. Now you’re not.'], ['그래 말고. 매듭 하나 모자라네.', '……됐다. 인자 안 모자라네.']),
	p(
		'His red coat comes off and goes somewhere in the dark. She pulls him down onto the sacks by the collar of what’s left. Below them the sea keeps coming in, twice as high as it has any right to, and nobody on the quay is counting anything.',
		'그의 붉은 겉옷이 벗겨져 어둠 어딘가로 간다. 그녀는 남은 옷의 깃을 잡고 그를 가마니 위로 끌어내린다. 그 밑에서 바다는 자격도 없이 두 배 높이로 자꾸 들어오고, 부두의 누구도 아무것도 세지 않는다.'
	),
	p(
		'Around midnight a sack splits under them. Rice pours out over red silk and down between the boards, and the lamp gutters, and for a while neither of them can breathe well enough to care.',
		'자정쯤 가마니 하나가 그들 밑에서 터진다. 쌀이 붉은 비단 위로 쏟아져 널빤지 틈으로 흘러내리고, 등잔불이 흔들리고, 한동안 둘 다 숨이 차서 신경 쓸 겨를이 없다.'
	),
	say(J, ['…Forty-one.'], ['……마흔하나.']),
	say(B, ['What?'], ['예?']),
	say(
		J,
		['Sacks. That one’s split. Somebody has to write it down, and it won’t be you, your hands are useless.'],
		['가마니. 저거 터졌다 아이가. 누가 적어야 되는데, 니는 아이다. 니 손은 하나도 쓸모가 없다.']
	),
	say(B, ['You said that about my hands in the autumn too.', '…You were wrong then as well.'], ['가을에도 제 손 보고 그러셨습니다.', '……그때도 틀리셨고요.']),
	p(
		'In the morning Sunpum comes back, finds a split sack in the fifth warehouse, and writes it in the book in his own small hand: <i>one sack, damaged by the tide.</i> Then he coughs, though there is nobody there to hear it.',
		'아침에 선품이 돌아와 다섯째 창고에서 터진 가마니를 찾아내고, 제 작은 글씨로 장부에 적는다. <i>한 섬, 물에 상함.</i> 그러고는 기침을 한다. 들을 사람이 아무도 없는데도.'
	),
	p(
		'The tide comes in twice a day, all spring. He is ready for it every time.',
		'그 봄 내내 물은 하루에 두 번 들어온다. 그는 매번 받을 준비가 되어 있다.'
	),
	p(
		'By midsummer Jahee is not fine, in the way that shows, and her father picks the busiest hour on the quay to notice.',
		'한여름이 되자 자희는 괜찮지 않다. 티가 나는 쪽으로. 그리고 아버지는 부두가 가장 붐비는 시각을 골라 그것을 알아챈다.'
	)
];

const old = entry.blocks[at];
console.log('replacing:', old.ko);
entry.blocks.splice(at, 1, ...spring);
fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
console.log('blocks now', entry.blocks.length);
