import { editStory } from './story-ops.mjs';

const p = (html, ko, extra = {}) => ({ kind: 'p', html, ko, ...extra });
const d = (who, en, lines) => {
	const block = { kind: 'dialogue', en, lines };
	if (who.person) block.person = who.person;
	else {
		block.speaker = who.speaker;
		if (who.gender) block.gender = who.gender;
	}
	if (who.chip) block.chip = who.chip;
	return block;
};

const M = { person: 'munduk', chip: '#e0503f' };

const after = (blocks, pred, insert) => {
	const i = blocks.findIndex(pred);
	if (i < 0) throw new Error('anchor not found');
	blocks.splice(i + 1, 0, ...insert);
	return i + 1;
};

editStory((story) => {
	const en = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Eulji Mundeok');
	if (!en) throw new Error('Eulji Mundeok not found');
	const b = en.blocks;

	const mapLiao = b.find((x) => x.kind === 'map' && x.year === 612 && !x.title);
	if (mapLiao) mapLiao.riverNames = true;

	const camp = b.find((x) => x.kind === 'scene' && x.label === 'The West Camp');
	if (camp) camp.weather = 'clear';
	const seven = b.find((x) => x.kind === 'scene' && x.label === 'Seven');
	if (seven) seven.weather = 'ash';
	const river = b.find((x) => x.kind === 'scene' && x.label === 'The River');
	if (river) river.weather = 'storm';

	for (const x of b) {
		if (x.person === 'munduk') x.chip = '#e0503f';
		if (typeof x.ko === 'string') {
			x.ko = x.ko.replaceAll('서국는', '서국은').replaceAll('서국가', '서국이');
		}
		if (x.kind === 'p' && x.html?.includes('“The Defender”')) {
			x.ko = '싸움이 끝난 뒤 문덕은 <i><b>「수비」</b></i>라는 호를 받는다.';
		}
		if (x.kind === 'dialogue' && x.speaker === 'The boy') {
			x.lines = ['저거, 황제 거야?'];
		}
		if (x.kind === 'dialogue' && x.speaker === 'His father') {
			x.lines = ['그래, 그중 하나다. 황제는 많거든.', '달아날 때 떨어뜨리지. 자. 비단이 아니라 깃대를 잡아.'];
		}
	}

	if (!b.some((x) => x.kind === 'card' && x.person === 'munduk')) {
		after(b, (x) => x.kind === 'place' && x.place === 'salsu', [
			{
				kind: 'card',
				person: 'munduk',
				caption: 'Ulchi Munduk. He counts the enemy the way other men count rice.',
				ko: '을지문덕. 남은 쌀을 세듯 적을 센다.'
			}
		]);
	}

	if (!b.some((x) => x.html?.includes('There is no granary'))) {
		after(b, (x) => x.kind === 'dialogue' && x.en?.[0]?.includes('Not one granary'), [
			d(
				{ speaker: 'Western general', gender: 'm', chip: '#8a7a3a' },
				['They are running. Running men have already lost.'],
				['달아나고 있다. 달아나는 자는 이미 진 것이다.']
			),
			p(
				'On the third morning a Western captain plants a flag in an empty yard and shouts that the granary is theirs. There is no granary. There is a well, and a dog, and the dust of a road going south.',
				'사흘째 아침, 서국 교위 하나가 빈 마당에 깃발을 꽂고 창고는 우리 것이라고 외친다. 창고는 없다. 우물과 개와, 남으로 가는 길의 먼지만 있다.'
			),
			d(M, ['Leave the well.', 'They’ll need it on the way back.'], ['우물은 놔둬라.', '돌아갈 때 쓸 테니.'])
		]);
	}

	if (!b.some((x) => x.kind === 'scene' && x.label === 'The Stakes')) {
		after(b, (x) => x.kind === 'p' && x.html?.includes('the eighth surrender'), [
			{ kind: 'scene', label: 'The Stakes', ko: '말뚝', weather: 'mist' },
			p(
				'Upstream, the night before they turn, Munduk’s men are already in the water. Timber. Rope. A line of stakes across a throat of the Colossal River that nobody on the far bank can see.',
				'서국이 돌아서기 전날 밤, 문덕의 병사들은 이미 물에 서 있다. 재목. 밧줄. 살수의 목, 저쪽 강가에선 안 보이는 곳에, 말뚝 한 줄.'
			),
			d(M, ['When their belts are wet.', 'Not before.'], ['허리띠가 젖었을 때.', '그전엔 안 된다.']),
			p(
				'He puts his palm on a post and leaves it there a while, the way you test whether a stove is still warm.',
				'말뚝에 손바닥을 얹고 잠시 그대로 둔다. 아궁이가 아직 따뜻한지 재 보듯.'
			)
		]);
	}

	const flood = b.find((x) => x.kind === 'p' && x.html?.includes('When the army is halfway over'));
	if (flood && !b.some((x) => x.html?.includes('The river stands up'))) {
		const i = b.indexOf(flood);
		b.splice(
			i,
			0,
			p('Upstream they pull the stakes. The river stands up.', '상류에서 말뚝을 뽑는다. 강이 일어선다.', {
				weather: 'storm'
			})
		);
		flood.html =
			'When the army is halfway over, Goguryeo comes down on the rearguard. Men on the far bank can’t come back. Men on the near bank can’t get over. The water takes the ones in the middle without asking anyone’s rank.';
		flood.ko =
			'군대가 반쯤 건넜을 때 고구려가 후군을 덮친다. 저쪽 강가의 자들은 돌아올 수 없다. 이쪽의 자들은 건널 수 없다. 물은 가운데 선 자들을 품계를 묻지 않고 데려간다.';
	}

	const next = b.find((x) => x.kind === 'p' && x.html?.startsWith('<b>'));
	if (next) {
		next.html =
			'<b>The shrine girl is still waiting for a name. To give her one, we have to go back to a god who stopped a chariot…!</b>';
		next.ko =
			'<b>사당의 아이는 아직 이름을 기다린다. 이름을 주려면, 전차를 세운 신에게로 돌아가야 한다…!</b>';
	}

	const emp = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Emperor');
	if (!emp) throw new Error('Emperor not found');
	const i = emp.blocks.findIndex((x) => x.kind === 'card' && x.person === 'lishiji');
	if (i < 0) throw new Error('Blue Dragon card not found');
	if (!emp.blocks.some((x) => x.kind === 'card' && x.person === 'qibiheli')) {
		emp.blocks.splice(
			i + 1,
			0,
			{
				kind: 'card',
				person: 'qibiheli',
				caption:
					'The White Dragon. He walked a whole tribe across the border as a boy, and has been proving it was worth it ever since.',
				ko: '백룡. 어린 칸으로 부족을 통째 국경 너머로 데려왔다. 그 뒤로 줄곧, 그게 맞았다고 증명한다.'
			},
			{
				kind: 'card',
				person: 'ashinasheer',
				caption:
					'The Red Dragon. A Turkic prince with a felt tent inside the capital walls, and a perfectly good house he will not sleep in.',
				ko: '적룡. 돌궐 왕자. 장안 성안에 천막이 있고, 안 자는 집도 하나 있다.'
			},
			{
				kind: 'card',
				person: 'zhangsunwuji',
				caption:
					'The Black Dragon. The emperor’s oldest friend. He said no to this war out loud, and then he came anyway.',
				ko: '흑룡. 황제의 가장 오래된 친구. 이 전쟁을 소리 내어 말렸고, 그래도 왔다.'
			}
		);
	}

	console.log('eulji blocks', en.blocks.length, 'emperor splice after', i);
});
