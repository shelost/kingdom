/** Align the script with the battle maps in #32 Yodong, #34 Stallion Mountain, #36 Ansi. */
import { editStory, textOf } from '../story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, lines) => ({ kind: 'dialogue', person, lines, en });
const voice = (speaker, chip, en, lines) => ({ kind: 'dialogue', speaker, chip, lines, en });
const map = (battle, phase) => ({ kind: 'battle', battle, phase });

function at(blocks, frag, kind) {
	const hits = blocks.map((b, i) => [b, i]).filter(([b]) => (!kind || b.kind === kind) && textOf(b).includes(frag));
	if (hits.length !== 1) throw new Error(`"${frag}": ${hits.length} hits`);
	return hits[0][1];
}
const mapAt = (blocks, battle, phase) => {
	const i = blocks.findIndex((b) => b.kind === 'battle' && b.battle === battle && b.phase === phase);
	if (i < 0) throw new Error(`no map ${battle} ${phase}`);
	return i;
};
const set = (blocks, frag, html, ko) => Object.assign(blocks[at(blocks, frag, 'p')], { html, ko });
const insertAfter = (blocks, i, ...add) => blocks.splice(i + 1, 0, ...add);

editStory((story) => {
	const all = story.flatMap((c) => c.entries);
	if (all[31].blocks.some((b) => b.kind === 'battle' && b.phase === 'relief')) {
		console.log('already applied');
		return false;
	}

	// #32 Yodong
	{
		const B = all[31].blocks;
		set(
			B,
			'Between the army and the walls lies the Liao marsh.',
			'Between the army and the walls lies the Liao marsh. Two hundred li of mud. A Sui host once went in up to the knee and came out as a song. The emperor’s engineer lays a road of earth across it as the column walks, wide enough for carts. The Blue Dragon is already under Yodong’s walls, waiting for him.',
			'군대와 성벽 사이에 요하의 늪이 있다. 이백 리의 진흙. 수나라 대군이 무릎까지 빠져 들어갔다가 노래가 되어 나온 곳이다. 황제의 장인이 대열이 걷는 대로 그 위에 수레가 다닐 만한 흙길을 깐다. 청룡은 벌써 요동성 아래서 그를 기다린다.'
		);
		insertAfter(
			B,
			mapAt(B, 'yodong-645', 'marsh'),
			voice(
				'Tang lookout',
				'#8d8d95',
				['Dust! North road—', 'No. Two roads. North and east. That’s not a patrol, that’s an army.'],
				['먼지다! 북쪽 길—', '아니, 길이 둘이야. 북쪽하고 동쪽. 저건 순찰이 아니라 군대다.']
			),
			p(
				'Goguryeo has sent forty thousand to break the siege. The emperor’s cousin has four thousand, and orders to dig in and wait. He charges instead. His line breaks. He climbs a rise, sees their ranks in a muddle, and goes back in.',
				'고구려가 포위를 풀러 사만을 보냈다. 황제의 사촌에게는 사천과, 참호를 파고 기다리라는 명이 있다. 그는 대신 돌격한다. 줄이 무너진다. 그는 언덕에 올라 저쪽 대열이 엉망인 걸 보고, 다시 들어간다.'
			),
			map('yodong-645', 'relief'),
			say(
				'taizong',
				['He was told to wait for Us.', '…A thousand heads, and he disobeyed. We shall have to scold him at length. After dinner.'],
				['짐을 기다리라 일렀거늘.', '…머리가 천이요, 명은 어겼다. 길게 꾸짖어야겠구나. 저녁을 든 뒤에.']
			),
			p(
				'When the last wagon is over the marsh, the emperor has the road torn up. Nobody goes home the way they came. He wants every man in the column to know it.',
				'마지막 수레가 늪을 건너자 황제는 길을 걷어 내게 한다. 아무도 왔던 길로 돌아가지 못한다. 그는 대열의 모든 병사가 그걸 알기를 바란다.'
			)
		);
		set(
			B,
			'The Holy King isn’t consulted again.',
			'The Holy King isn’t consulted again. Towers roll up to the parapet. On the twelfth day a south wind rises. They fire the south-west tower, and the wind carries it into town.',
			'성왕께 다시 묻는 사람은 없다. 공성탑이 성가퀴에 붙는다. 열이틀째 남풍이 인다. 그들이 서남쪽 망루에 불을 지르자 바람이 불길을 성안으로 실어 간다.'
		);
		insertAfter(
			B,
			mapAt(B, 'yodong-645', 'fire'),
			voice(
				'Yodong soldier',
				'#7a6b5a',
				['Wind’s turned— it’s coming in!', 'Leave the tower! The houses— get the children out of the houses!'],
				['바람이 꺾였다— 들어온다!', '망루는 놔둬! 집, 집이야— 애들 집에서 끌어내!']
			)
		);
	}

	// #34 Stallion Mountain
	{
		const B = all[33].blocks;
		set(
			B,
			'The relief army comes down the crow road',
			'The relief army comes down the crow road under banners that think numbers are an argument. <b>Go Yeonsu</b> and <b>Go Hyejin</b> ride at the front. The emperor sends a thousand Turkish horse to meet them and tells them to lose. They lose beautifully, all the way west to the foot of a mountain. Across the plain, under a ridge, the Tang look like a single army of fifteen thousand.',
			'구원군은 숫자가 곧 논리라고 믿는 깃발을 앞세우고 까마귀 길을 내려온다. <b>고연수</b>와 <b>고혜진</b>이 맨 앞에서 달린다. 황제는 돌궐 기병 천을 내보내 맞서게 하고, 지라고 이른다. 그들은 아주 보기 좋게 진다. 서쪽으로, 산기슭까지 내내. 들판 건너 고개 아래, 당군은 만오천짜리 군대 하나로 보인다.'
		);
		const old = B[at(B, 'That isn’t all of them.', 'dialogue')];
		old.en.unshift('Since when do Turks run?');
		old.lines.unshift('돌궐이 언제부터 등을 보였습니까?');
		set(
			B,
			'Nobody tells Go Yeonsu about the valley behind him.',
			'Nobody tells Go Yeonsu about the valley behind him. In the night the Black Dragon takes a second army round the north of the mountain and into it. The emperor climbs the mountain with his drums, banners furled.',
			'고연수 뒤편 골짜기 얘기는 아무도 해 주지 않는다. 밤사이 흑룡이 또 한 무리를 이끌고 산 북쪽을 돌아 그 골짜기로 든다. 황제는 북을 데리고, 깃발을 눕힌 채 산에 오른다.'
		);
		insertAfter(
			B,
			mapAt(B, 'jupilsan-645', 'night'),
			voice(
				'Goguryeo picket',
				'#7a6b5a',
				['Sir. Something’s moving on the mountain. A lot of something.', 'No banners, though.'],
				['장군. 산 위에 뭐가 움직입니다. 많이요.', '깃발은 없는데요.']
			),
			say(
				'goyeonsu',
				['No banners, no army. Deer.', 'Go to sleep. We’re having an emperor for breakfast.'],
				['깃발이 없으면 군대도 없지. 사슴이야.', '가서 자. 아침엔 황제를 먹을 거니까.']
			)
		);
		const sur = at(B, 'When the dust settles, the two relief commanders', 'p');
		Object.assign(B[sur], {
			html: 'When the dust settles, the two relief commanders walk into the Tang camp on their knees. Their army walks in behind them.',
			ko: '먼지가 가라앉자 구원군의 두 장수가 무릎걸음으로 당나라 진영에 들어간다. 그들의 군대가 뒤를 따라 들어온다.'
		});
		insertAfter(
			B,
			mapAt(B, 'jupilsan-645', 'surrender'),
			say(
				'goyeonsu',
				['The old man said dig in.', '…Is he alive? Somebody find out. I owe him an apology.'],
				['노인이 진을 치랬지.', '…그 양반 살아 있나? 누가 좀 알아봐. 사과할 게 있어.']
			),
			p(
				'The officers are sent inland, to be subjects far from any border. The common soldiers are sent home. The Mohe riders who came south with them are marched into a valley and buried alive.',
				'장교들은 국경에서 먼 내지로 보내져 당의 백성이 된다. 병졸들은 집으로 돌려보내진다. 그들과 함께 남하한 말갈 기병은 골짜기로 끌려가 산 채로 묻힌다.'
			)
		);
	}

	// #36 Ansi
	{
		const B = all[35].blocks;
		const scene = at(B, 'The Earthen Mountain', 'scene');
		const end = mapAt(B, 'ansi-645', 'assault');
		const g = (frag, kind) => B[at(B, frag, kind)];
		const m = (phase) => B[mapAt(B, 'ansi-645', phase)];

		const wallP = Object.assign(g('The Second Emperor tries the wall first.', 'p'), {
			html: 'The Second Emperor tries the wall first. The Blue Dragon’s rams go at the west wall six or seven times a day. Every tower they knock down is a timber fence by dark.',
			ko: '황제는 먼저 성벽을 쳐 본다. 청룡의 충차가 하루 예닐곱 번 서쪽 성벽에 붙는다. 무너진 망루는 해 질 녘이면 나무 울타리가 되어 있다.'
		});
		const inside = Object.assign(g('Inside the walls the stone runs out first.', 'p'), {
			html: 'Inside the walls the stone runs out first. Then the doors. Then the roof beams of the houses nearest that corner. Families sleep in the open and pass their own lintels up the ladder.',
			ko: '성안에서는 돌이 먼저 떨어진다. 다음은 문짝이다. 그다음은 그 모서리 가까운 집들의 서까래다. 사람들은 한데서 자고, 제 집 문지방을 사다리 위로 올려 보낸다.'
		});
		const crown = Object.assign(g('Five hundred thousand man-days, sixty days of hauling', 'p'), {
			html: 'Five hundred thousand man-days, sixty days of hauling, and the mountain’s crown stands higher than the wall. From up there you can count the cook fires.',
			ko: '연인원 오십만, 예순 날의 흙짐. 마침내 흙산 꼭대기가 성벽보다 높아진다. 거기 서면 성안의 밥 짓는 불까지 셀 수 있다.'
		});
		const fallen = Object.assign(g('A few hundred men come out through the gap', 'p'), {
			html: 'A few hundred men are standing on sixty days of Tang work. They pile timber on its slopes and set it alight. By noon there is a Goguryeo banner on top.',
			ko: '수백 명이 당군의 예순 날 위에 서 있다. 그들은 비탈에 나무를 쌓아 불을 지른다. 한낮이 되자 꼭대기에 고구려 깃발이 선다.'
		});
		const behead = Object.assign(g('has Fu Fuai, the officer who left the mound, beheaded', 'p'), {
			html: 'The emperor has Fu Fuai beheaded, very courteously, and orders three days of assault on the mound.',
			ko: '황제는 아주 정중하게 부복애의 목을 베고, 흙산에 사흘간의 총공격을 명한다.'
		});

		const seq = [
			B[scene],
			wallP,
			m('wall'),
			voice(
				'Ansi soldier',
				'#9a5c55',
				['Yellow banners! That’s him— drums, drums!', 'Hey, Son of Heaven! Our fence is taller than your tower!'],
				['누런 깃발이다! 저놈이다— 북 쳐, 북!', '어이, 천자 양반! 우리 울타리가 너네 망루보다 높다!']
			),
			p(
				'When the wall does not work he tries the ground, which is the sort of thing only an empire can afford to try. His cousin starts piling earth against the south-east corner, and the emperor moves his camp south to watch it grow. The archers on the parapet watch every basket.',
				'성벽이 안 되자 그는 땅을 쳐 본다. 제국이나 되어야 해 볼 수 있는 짓이다. 사촌이 동남쪽 모서리에 흙을 쌓기 시작하고, 황제는 그게 자라는 걸 보려고 진영을 남쪽으로 옮긴다. 성가퀴의 궁수들은 흙짐 하나하나를 지켜본다.'
			),
			m('ramp'),
			g('How many baskets is that now?', 'dialogue'),
			g('It gets heavier when you count.', 'dialogue'),
			g('that’s sixty days they’ve been at it', 'dialogue'),
			g('Then it’s sixty nights for us.', 'dialogue'),
			inside,
			crown,
			voice('Ansi soldier', '#9a5c55', ['Chief. They can see our rice pots from up there.'], ['성주님. 저 위에서 우리 밥솥까지 보이겠는데요.']),
			say('yangmanchun', ['Then cook something that smells good. Let them be hungry for a change.'], ['그럼 냄새 좋은 거 해. 저놈들도 한번 배고파 보라고.']),
			B[at(B, 'Ansi Fortress, sixth to ninth month', 'formation')],
			g('Then it rains, and the mountain slumps', 'p'),
			g('Chief, the wall—', 'dialogue'),
			g('Never mind the wall.', 'dialogue'),
			g('The officer who was supposed to be holding the mound', 'p'),
			g('There’s nobody up there.', 'dialogue'),
			g('Then it’s ours.', 'dialogue'),
			m('collapse'),
			fallen,
			say('taizong', ['Sixty days.', '…Whose banner is that, on Our mountain?'], ['예순 날이다.', '…짐의 산 위에 걸린 저 깃발은 누구의 것이냐?']),
			voice('Tang officer', '#b45309', ['Theirs, Majesty. Fu Fuai had… stepped down from it.'], ['저들 것이옵니다, 폐하. 부복애가… 잠시 자리를 비웠다 하옵니다.']),
			behead,
			g('The emperor rides up to watch. Too close.', 'p'),
			m('assault')
		];
		const kept = new Set(seq);
		const dropped = B.slice(scene, end + 1).filter((b) => !kept.has(b));
		if (dropped.length) throw new Error(`#36 would drop ${dropped.length} block(s): ${dropped.map((b) => textOf(b).slice(0, 60)).join(' | ')}`);
		B.splice(scene, end - scene + 1, ...seq);
	}
});
