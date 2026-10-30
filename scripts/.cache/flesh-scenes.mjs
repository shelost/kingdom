// One-shot prose inserts for Nangbi, the Yeon brothers, and Muryuk at the pine.
// Safe to re-run: each insert is skipped once its first line is in the entry.
import { editStory } from './story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (person, en, lines) => ({ kind: 'dialogue', person, en, lines });

const jobs = [
	{
		title: 'Nangbi',
		after: 'His white horse doesn’t even have a name.',
		mark: 'Kim Yongsu walks that trench',
		blocks: [
			p(
				'Down on the left, the company that was meant to take the pits has been sitting in them since morning.',
				'왼쪽에서, 구덩이를 빼앗으러 간 부대가 아침부터 그 안에 앉아 있다.'
			),
			p(
				'Kim Yongsu walks that trench with his helmet under his arm. He is twenty-four. He has been talking for an hour, which is what he does when a count is going bad.',
				'김용수가 투구를 겨드랑이에 끼고 그 참호를 걷는다. 스물넷이다. 한 시진째 떠들고 있다. 숫자가 나빠질 때 그가 하는 일이다.'
			),
			d(
				'yongsu',
				[
					'Up. It’s a hole, not a house.',
					'I counted you at dawn. I’m counting you again. I’d like the same number.',
					'You. Where’s your spear.'
				],
				[
					'일어나. 구멍이지, 집이 아니야.',
					'새벽에 세었어. 다시 셀 거야. 같은 숫자가 나왔으면 좋겠어.',
					'너. 창은 어디 있어.'
				]
			),
			d(
				undefined,
				['In the pit, sir. With the others. They’re walking on our spears.'],
				['구덩이 안요, 나리. 다른 것들이랑. 우리 창 위로 걸어 다녀요.']
			),
			d('yongsu', ['So we’re lending them a road. Stand up.'], ['그럼 길을 빌려 주는 거네. 서.']),
			p(
				'Three men stand. Up on the nearest pit a Goguryeo captain watches with his hands on his hips, and laughs. Yongsu looks at him. For once he has nothing to add.',
				'세 명이 일어선다. 가장 가까운 구덩이 위에서 고구려 대장이 허리에 손을 얹고 보고, 웃는다. 용수가 그를 본다. 이번엔 덧붙일 말이 없다.'
			)
		]
	},
	{
		title: 'Nangbi',
		after: 'He is holding a cup of barley tea he has forgotten to drink.',
		mark: 'The left’s gone, sir.',
		blocks: [
			d(
				'yongsu',
				[
					'Sir. The left’s gone. I asked twice.',
					'The second time I asked quietly, which is supposed to work.'
				],
				['장군. 좌군은 무너졌습니다. 두 번 부탁했습니다.', '두 번째는 조용히 했습니다. 그러면 된다던데.']
			),
			d('seohyeon', ['How many standing.'], ['몇이나 서 있나.']),
			d(
				'yongsu',
				['Three. And me. I’m counting myself. A commander shouldn’t.'],
				['셋. 그리고 접니다. 저도 세고 있습니다. 지휘관이 하면 안 되는 짓인데.']
			)
		]
	},
	{
		title: 'Nangbi',
		after: 'Yushin names it',
		mark: 'Yushin comes through on the white horse',
		// fallback: the horse-naming block ends the field; insert before the walk north
		before: 'The few who get out of Nangbi walk north',
		blocks: [
			p(
				'They ride home in the first cold. Nine days. The story reaches Surabol before they do.',
				'첫추위에 말을 몰아 돌아온다. 아흐레. 이야기는 그들보다 먼저 서라벌에 닿는다.'
			),
			p(
				'The west gate is already full. Somebody has tied pine branches over the lintel, which is what you do for a wedding or a win, and the city has decided this is both.',
				'서문은 이미 사람이다. 누군가 문설주 위에 솔가지를 매달아 두었다. 혼례나 이긴 날에 하는 일이다. 도시는 오늘이 둘 다라고 정했다.'
			),
			p(
				'Yushin comes through on the white horse. Across the saddle, muddy and unfurled, is the flag from the fort. Theirs. He has not folded it. He wants the colour seen.',
				'유신이 흰 말로 들어온다. 안장 위로, 진흙투성이에 펴진 채, 성의 깃발이 걸쳐 있다. 저쪽 깃발이다. 그는 접지 않았다. 색이 보이게 하고 싶었다.'
			),
			p(
				'Yongsu rides three horses back. That is as close as he will come to a moment that isn’t his. He is telling the man beside him what oats cost this month. His eyes are on the flag.',
				'용수는 말 세 마리쯤 뒤에서 간다. 자기 것이 아닌 순간에 그가 허용하는 거리다. 옆 사람에게 이번 달 귀리 값을 말하고 있다. 눈은 깃발에 있다.'
			),
			p(
				'Seohyun walks. He will not ride in behind his son. On the palace steps King Jinpyung waits in a coat too thin for the wind. Nobody managed to send him inside.',
				'서현은 걷는다. 아들 뒤로 말을 타고 들어가진 않을 것이다. 궁 계단 위에 진평왕이 바람에 얇은 옷으로 서 있다. 아무도 그를 안으로 들여보내지 못했다.'
			),
			d('jinpyung', ['Banner captain.', 'That’s their flag.'], ['깃발 대장.', '저쪽 깃발이로군.']),
			d(
				'yushin',
				['Majesty.', 'It was on their gate. The gate opened.'],
				['폐하.', '저쪽 문에 걸려 있었습니다. 문이 열렸습니다.']
			),
			p(
				'He gets down and lays the flag on the steps. He still does not know what a man is supposed to do with a thing he has taken. The crowd does the rest. They shout the name until the pine branches shake.',
				'그는 내려서 깃발을 계단 위에 놓는다. 빼앗은 것을 남자가 어떻게 해야 하는지, 아직도 모른다. 나머지는 군중이 한다. 솔가지가 흔들릴 때까지 이름을 외친다.'
			),
			p(
				'At the back, Yongsu stops talking about oats. He tries to count the shouts, loses the count, and lets it go.',
				'뒤에서 용수가 귀리 이야기를 멈춘다. 함성을 세어 보려다, 세기를 잃고, 놓아 준다.'
			)
		]
	},
	{
		title: 'Muryuk',
		after: 'Behind the pine, the boy who held the ford all morning cannot make a sound.',
		mark: 'His back finds the pine',
		blocks: [
			p(
				'His back finds the pine and stays there. The bark takes his weight. His eyes go, and he lets them, because a sound would be worse. Under the helm the tears are quiet enough to pass for sweat.',
				'등이 소나무에 닿고, 그대로 있다. 껍질이 무게를 받는다. 눈이 풀린다. 내버려 둔다. 소리가 나면 더 나쁘다. 투구 밑의 눈물은 땀으로 넘어갈 만큼 조용하다.'
			)
		]
	},
	{
		title: 'Brothers’ Coup',
		after: 'By the fourth night they check who is at the door before either of them speaks.',
		mark: 'He used to steal the meat',
		blocks: [
			p(
				'On the fifth night Namsan sets a third cup on the table and does not pour it. Namgun looks at the cup. Neither of them moves it.',
				'닷새째 밤, 남산이 세 번째 잔을 상에 놓고 따르지 않는다. 남건이 잔을 본다. 둘 다 치우지 않는다.'
			),
			d(
				'namsan',
				['He used to steal the meat off my bowl. Then blame the dog.'],
				['내 그릇에서 고기를 집어 가곤 했지. 그러고 개 탓을 했어.']
			),
			d('namgun', ['There wasn’t a dog.'], ['개 없었어.']),
			d('namsan', ['I know. I let him.'], ['알아. 놔뒀어.'])
		]
	},
	{
		title: 'Brothers’ Coup',
		after: 'A gold ring, a child’s size.',
		mark: 'The ring is warm',
		blocks: [
			p(
				'The ring is warm. That is the part he will never find a way to tell. Mud, and under the mud, warm.',
				'반지가 따뜻하다. 이 부분만은 끝내 말할 길을 못 찾는다. 진흙, 그리고 진흙 밑의 온기.'
			),
			p(
				'His eldest boy is beside the horse, fifteen, with his grandfather’s jaw. He watches the hand fail to close around the ring, and looks at the horse instead.',
				'큰아들이 말 옆에 있다. 열다섯, 할아버지의 턱이다. 반지를 쥐지 못하는 손을 보고, 대신 말을 본다.'
			)
		]
	},
	{
		title: 'Brothers’ Coup',
		after: 'Nobody pretends not to notice this time.',
		mark: 'He picked the ring up',
		blocks: [
			d('namsan', ['He picked the ring up.'], ['반지 주웠어.']),
			d('namgun', ['I saw.'], ['봤어.']),
			d('namsan', ['Father said fish and water.'], ['아버지가 물고기와 물처럼 지내래셨잖아.']),
			d('namgun', ['Father’s dead. Sit down, or don’t.'], ['아버지는 죽었어. 앉든가, 말든가.'])
		]
	},
	{
		title: 'Yeon Gesomun†',
		after: 'He always means it. That has never been the trouble.',
		mark: 'Look at me. All three.',
		blocks: [
			p(
				'Namgun is already crying, and angry that he is. Namsan counts the knots in the floor. If he looks at Namseng he will have to choose, and their father is still breathing.',
				'남건은 벌써 울고 있고, 우는 게 화가 난다. 남산은 마루의 옹이를 센다. 남생을 보면 골라야 한다. 아버지는 아직 숨을 쉬고 있다.'
			),
			d('gesomun', ['Look at me. All three.'], ['날 봐. 셋이.']),
			p(
				'They look. For one breath they are boys in a doorway. Then both mouths open at once, and their father sees which sentence is going to win.',
				'본다. 한 숨 동안 그들은 문간의 아이들이다. 그리고 입이 둘 다 열린다. 아버지는 어느 말이 이길지 본다.'
			),
			d(
				'gesomun',
				['Not in this room.', 'Save it. I’ve no time to referee.'],
				['이 방에선 안 된다.', '아껴. 심판할 시간이 없어.']
			)
		]
	},
	{
		title: 'Pyongyang II',
		after: 'Everyone on the wall can see him.',
		mark: 'He is looking for a window',
		blocks: [
			p(
				'Namseng is not looking at the wall. He is looking for a window in the big house under the palace hill, the one with the low table. The shutter is shut. He looks anyway.',
				'남생은 성벽을 보고 있지 않다. 궁 언덕 아래 큰 집, 낮은 상이 있는 그 집의 창을 찾고 있다. 덧문은 닫혀 있다. 그래도 본다.'
			),
			d(
				'namsan',
				['He used to come home by that road. Same horse. He waved.'],
				['저 길로 들어오곤 했지. 같은 말. 손 흔들었어.']
			),
			d('namgun', ['He’s not waving.'], ['안 흔들어.']),
			d('namsan', ['…No.'], ['…그래.'])
		]
	},
	{
		title: 'Pyongyang II',
		after: 'So it is Namsan who walks out first.',
		mark: 'once it is open there is no brother left',
		blocks: [
			p(
				'At the gate he stops with the banner still furled. Once it is open there is no brother left to be. He looks back up the wall. Namgun is not on it. A sentry is. Namsan opens the banner himself.',
				'문 앞에서 그는 깃발을 아직 말아서 멈춘다. 펴는 순간 형제로 남을 자리는 없다. 성벽을 올려다본다. 남건은 없다. 보초가 있다. 남산이 직접 깃발을 편다.'
			)
		]
	},
	{
		title: 'Pyongyang II',
		after: 'The gate towers catch one after another',
		mark: 'watches the towers take light',
		blocks: [
			p(
				'On the north road Namseng has not ridden in. He sits the Western horse and watches the towers take light, one after another, like lamps for a feast he was not asked home to.',
				'북쪽 길에서 남생은 들어가지 않는다. 서역의 말 위에 앉아, 망루가 하나씩 불 붙는 걸 본다. 초대받지 못한 잔치의 등처럼.'
			),
			d('namseng', ['…Namgun.'], ['…남건.'])
		]
	}
];

const has = (e, s) => JSON.stringify(e.blocks).includes(s);

editStory((story) => {
	let n = 0;
	for (const job of jobs) {
		const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === job.title);
		if (!e) throw new Error('no entry ' + job.title);
		if (has(e, job.mark)) continue;
		const needle = job.before || job.after;
		const i = e.blocks.findIndex((b) => (b.html || '').includes(needle) || (b.en || []).some((l) => l.includes(needle)));
		if (i < 0) throw new Error(`${job.title}: anchor not found: ${needle}`);
		const at = job.before ? i : i + 1;
		e.blocks.splice(at, 0, ...job.blocks);
		n += job.blocks.length;
		console.log(job.title, 'inserted', job.blocks.length, 'at', at);
	}
	console.log('blocks added', n);
	return n > 0;
});
