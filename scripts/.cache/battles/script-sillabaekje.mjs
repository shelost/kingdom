/**
 * Script ↔ map pass for gwansan-554 (#20), daeya-642 (#21, #23), nangbi-629 (#27), bidam-647 (#40, #42, #44, #46).
 * `node scripts/.cache/battles/script-sillabaekje.mjs` — idempotent: skips any edit whose text is already in place.
 */
import { editStory, lists, textOf } from '../story-ops.mjs';

const GREY = '#6b7280';

const p = (html, ko) => ({ kind: 'p', html, ko });
const map = (battle, phase) => ({ kind: 'battle', battle, phase });

const run = () => editStory((story) => {
	const all = story.flatMap((c) => c.entries);
	const chips = new Map();
	for (const e of all) for (const l of lists(e)) for (const b of l) if (b.kind === 'dialogue' && b.person && b.chip && !chips.has(b.person)) chips.set(b.person, b.chip);

	const say = (person, en, lines) => ({ kind: 'dialogue', ...(chips.has(person) ? { chip: chips.get(person) } : {}), person, lines, en });
	const voice = (speaker, en, lines, chip = GREY) => ({ kind: 'dialogue', speaker, chip, lines, en });

	const log = [];
	for (const [n, fn] of Object.entries(EDITS)) {
		const e = all[n - 1];
		const hay = () => lists(e).flat().map(textOf).join('\n');
		const one = (frag, pred = () => true) => {
			const hits = [];
			for (const list of lists(e)) list.forEach((b, i) => pred(b) && textOf(b).includes(frag) && hits.push({ list, i, b }));
			if (hits.length !== 1) throw new Error(`#${n} ${e.title}: "${frag}" matched ${hits.length}`);
			return hits[0];
		};
		const battle = (phase) => one('', (b) => b.kind === 'battle' && b.phase === phase && !b.full);
		const api = {
			done: (frag) => hay().includes(frag),
			/** Replace the p holding `frag` (html/ko). */
			set(frag, html, ko) {
				const { b } = one(frag, (x) => x.kind === 'p');
				if (b.html === html && b.ko === ko) return;
				b.html = html;
				b.ko = ko;
				log.push(`#${n} rewrote "${frag.slice(0, 40)}"`);
			},
			after(frag, blocks, pred) {
				const { list, i } = one(frag, pred);
				list.splice(i + 1, 0, ...blocks);
				log.push(`#${n} +${blocks.length} after "${frag.slice(0, 40)}"`);
			},
			afterMap(phase, blocks) {
				const { list, i } = battle(phase);
				list.splice(i + 1, 0, ...blocks);
				log.push(`#${n} +${blocks.length} after map ${phase}`);
			},
			beforeMap(phase, blocks) {
				const { list, i } = battle(phase);
				list.splice(i, 0, ...blocks);
				log.push(`#${n} +${blocks.length} before map ${phase}`);
			},
			/** Move the map for `phase` to sit right after the block holding `frag`. */
			moveMap(phase, frag, pred) {
				const { list, i, b } = battle(phase);
				list.splice(i, 1);
				const at = one(frag, pred);
				at.list.splice(at.i + 1, 0, b);
				log.push(`#${n} moved map ${phase} after "${frag.slice(0, 40)}"`);
			},
			/** Add a first line to the dialogue holding `frag`. */
			prepend(frag, en, ko) {
				const { b } = one(frag, (d) => d.kind === 'dialogue');
				b.en.unshift(en);
				b.lines.unshift(ko);
				log.push(`#${n} +line on "${frag.slice(0, 40)}"`);
			},
			mapFollows(phase, frag) {
				const { list, i } = one(frag);
				const nx = list[i + 1];
				return nx?.kind === 'battle' && nx.phase === phase;
			},
			p,
			map,
			say,
			voice
		};
		fn(api);
	}
	console.log(log.length ? log.join('\n') : 'nothing to do');
	return log.length > 0;
});

const EDITS = {
	/* ── #20 The Severing · gwansan-554 ─────────────────────────────── */
	20(x) {
		x.set(
			'King Seong feels the cut',
			'King Seong feels the cut in the marrow. He calls in everyone who still owes him: the last Gaya houses, a boatload of soldiers from the islands. Then he marches east, on the fortress that opens Silla’s throat.',
			'성왕은 그 칼날을 골수로 느낀다. 아직 그에게 빚진 이들을 모두 불러 모은다. 가야의 남은 집안들, 섬나라에서 건너온 군사들. 그리고 동쪽으로, 신라의 목을 여는 성으로 진군한다.'
		);
		if (!x.done('Every house that owed him sent its sons'))
			x.after(
				'Every road into Silla’s valley squeezes through here',
				[
					x.say('gyebek', ['How many.'], ['몇 명입니까.']),
					x.voice('A Sabi grandmother', ['All of them. Every house that owed him sent its sons. The column took a whole morning to pass this gate.'], ['다. 빚진 집은 다 아들을 보냈어. 그 행렬이 이 문 지나가는 데 아침나절이 다 걸렸대.'], '#a08c6e')
				],
				(b) => b.kind === 'place'
			);
		x.set(
			'For months the fight goes',
			'For months the fight goes Baekje’s way. The garrison keeps trying its gate and keeps getting shoved back inside. The crown prince holds the forward camp below the wall, half-starved; his men are boiling their saddle leather.',
			'몇 달 동안 싸움은 백제 쪽으로 기운다. 수비군은 자꾸 성문을 나서고, 자꾸 도로 밀려 들어간다. 태자는 성벽 아래 앞 진영에서 굶주리며 버틴다. 군사들은 안장 가죽을 삶아 먹는다.'
		);
		if (!x.done('All that year Sabi was winning'))
			x.afterMap('siege', [
				x.voice(
					'A Sabi grandmother',
					['Winning, see. All that year Sabi was winning.', 'My grandmother’s grandmother sold twice the chestnuts. Everybody wanted something warm in their hand to wave at the carts.'],
					['이기고 있었다니까. 그해 내내 사비는 이기고 있었어.', '우리 할미의 할미가 밤을 두 배로 팔았대. 수레 지나갈 때 다들 뭐 따뜻한 거 하나씩 쥐고 흔들고 싶어 했거든.'],
					'#a08c6e'
				)
			]);
		if (!x.done('Nobody in the forward camp is watching the north road')) {
			x.moveMap('relief', 'All that year Sabi was winning');
			x.beforeMap('relief', [
				x.p(
					'Nobody in the forward camp is watching the north road. Down it comes a second Silla army, out of the new lands on the river. Part of it leaves the road, goes into the hills, and swings south and then west, around behind the prince.',
					'앞 진영에서 북쪽 길을 보는 사람은 아무도 없다. 그 길로 신라군이 하나 더 내려온다. 강가에 새로 얻은 땅에서. 그중 일부가 길을 벗어나 산으로 들어가더니, 남쪽으로, 다시 서쪽으로 돌아 태자의 등 뒤로 간다.'
				)
			]);
			x.afterMap('relief', [
				x.say('gyebek', ['Behind him.'], ['등 뒤로.']),
				x.voice(
					'A Sabi grandmother',
					['Behind him. And the prince was looking at the wall the whole time. The way you’re looking at me.'],
					['등 뒤로. 태자는 내내 성벽만 보고 있었지. 지금 네가 나 보듯이.'],
					'#a08c6e'
				)
			]);
		}
		x.set(
			'Silla’s ambush is waiting.',
			'One night King Seong rides out from the west with fifty horse to steady his son. Silla’s ambush is waiting. The road to the prince is a ditch that was not there at dusk. Fifty horse stop, because the torches coming up the bank are the wrong color.',
			'어느 밤, 성왕이 아들을 다독이러 기병 쉰을 이끌고 서쪽에서 달려온다. 신라의 복병이 기다린다. 태자에게 가는 길은, 해 질 녘에는 없던 도랑이다. 보기 오십이 멈춘다. 둑으로 올라오는 횃불이 틀린 색이어서.'
		);
		x.set(
			'The ditch takes the head',
			'The ditch takes the head. <b>Dodo</b> does the work the rank will not put on a prince’s hands. The record almost forgets the slave.',
			'도랑이 목을 가져간다. <b>도도</b>가, 골품이 왕자의 손에 올리지 않을 일을 한다. 기록은 노비를 거의 잊는다.'
		);
		if (!x.done('By dawn the news is at the fortress'))
			x.beforeMap('rout', [
				x.p(
					'By dawn the news is at the fortress. Thirty thousand men hear it at once. Silla comes down the north road and up out of the ditch together, and the ring around the wall comes apart. The prince gets out west, behind the island archers.',
					'새벽이 되자 소식이 성에 닿는다. 삼만이 한꺼번에 듣는다. 신라가 북쪽 길로 내려오고 도랑에서 올라와 한꺼번에 덮치자, 성을 두른 고리가 풀린다. 태자는 섬나라 궁수들 뒤에 숨어 서쪽으로 빠져나간다.'
				)
			]);
		if (!x.done('How many came home.'))
			x.after('Gyebek has not eaten his', [
				x.say('gyebek', ['How many came home.'], ['몇이나 돌아왔습니까.']),
				x.voice('A Sabi grandmother', ['The prince. A few islanders. Don’t ask me about the horses.'], ['태자. 섬사람 몇. 말은 묻지도 마.'], '#a08c6e')
			]);
	},

	/* ── #21 Gumil · daeya-642 road ─────────────────────────────────── */
	21(x) {
		x.set(
			'reads Silla’s border the way he reads everything',
			'Over the western hills, King Euija reads Silla’s border the way he reads everything: patiently, and only once. Daeya is young at the top and hollow underneath. He sends Yunchung east with ten thousand men.',
			'서쪽 산 너머에서 의자왕은 신라의 국경을, 모든 것을 읽듯이 읽는다. 참을성 있게, 그리고 단 한 번만. 대야성은 윗자리가 어리고 그 밑이 비어 있다. 그는 윤충에게 군사 만 명을 주어 동쪽으로 보낸다.'
		);
		if (!x.done('If anyone asks, they are the baggage'))
			x.afterMap('road', [
				x.say(
					'yunchung',
					['Three weeks to the river, if the roads behave.', 'The last two thousand keep a day behind us. If anyone asks, they are the baggage.'],
					['길이 순하면 강까지 세 주요.', '뒤의 이천은 하루 늦게 따라오시오. 누가 묻거든 짐이라고 하시오.']
				)
			]);
	},

	/* ── #23 Siege of Daeya · daeya-642 siege / fire / terms / bamboo ─ */
	23(x) {
		x.set(
			'Yunchung’s ten thousand are under the wall',
			'Three weeks later, Yunchung’s ten thousand are under the wall. The river covers three sides of the hill, so they all camp on the fourth, the north. From the granary roof you can count their cookfires. Gumil does.',
			'세 주 뒤, 윤충의 만 명이 성벽 아래에 와 있다. 강이 언덕 세 면을 막고 있으니, 모두 남은 한 면, 북쪽에 진을 친다. 곳간 지붕에 오르면 그들의 밥 짓는 불을 셀 수 있다. 검일은 센다.'
		);
		x.set(
			'Mochuk lifts the bar',
			'Mochuk lifts the bar. The leaf swings. The approach road fills with Baekje men who have walked round the hill in the dark, along the river. He does not look at the men coming in. He looks at the man who asked him to.',
			'모척이 빗장을 든다. 문이 열린다. 어둠 속에 강을 따라 언덕을 돌아온 백제군으로 진입로가 찬다. 들어오는 사람들을 보지 않는다. 열어 달라 한 사람을 본다.'
		);
		if (!x.done('The whole east row is going up'))
			x.prepend('Why are you doing this. Truly.', 'The whole east row is going up, man—', '동쪽 곳간 줄이 통째로 타고 있네—');
		if (!x.done('The north gate opens. The garrison files out first')) {
			x.set(
				'The oath lasts until the last Silla shield is down',
				'The north gate opens. The garrison files out first, shields down, onto the road toward the Baekje camp. Out of the west come the men Yunchung kept a day behind. The oath lasts until the last Silla shield is down.',
				'북문이 열린다. 수비군이 먼저, 방패를 내린 채 백제 진영 쪽 길로 줄지어 나간다. 서쪽에서, 윤충이 하루 뒤에 두었던 군사들이 몰려온다. 맹세는 마지막 신라 방패가 내려질 때까지만 간다.'
			);
			x.afterMap('terms', [
				x.p(
					'Then the killing starts. Yunchung turns his horse so the sun is behind him. On the roof, Gumil is not glad. He had thought he would be.',
					'그다음엔 살육이 시작된다. 윤충은 해가 등 뒤로 가도록 말머리를 돌린다. 지붕 위의 검일은 기쁘지 않다. 기쁠 줄 알았다.'
				)
			]);
		}
		x.set(
			'He holds the inner gate until sundown',
			'They come up the hill from the north gate, the way the garrison went down. He holds the inner gate until sundown. Then he is broken, exactly as promised, and not bent.',
			'그들은 수비군이 내려간 그 길로, 북문에서 언덕을 올라온다. 그는 해 질 녘까지 안쪽 문을 지킨다. 그리고 약속대로 부러진다. 굽지 않고.'
		);
		if (!x.done('walk west on one long rope'))
			x.afterMap('bamboo', [
				x.p(
					'In the morning a thousand of Daeya’s people walk west on one long rope. Gumil walks beside the rope, not on it.',
					'아침이 되자 대야 사람 천 명이 긴 밧줄 하나에 묶여 서쪽으로 걷는다. 검일은 그 밧줄 곁에서 걷는다. 묶이지 않은 채.'
				),
				x.voice('A Daeya captive', ['Gumil? …Gumil! Tell them. Tell them you know me—'], ['검일이? …검일아! 말 좀 해 줘. 나 안다고 말 좀—']),
				x.p('Gumil does not turn his head.', '검일은 고개를 돌리지 않는다.')
			]);
	},

	/* ── #27 Nangbi · nangbi-629 break / three / rout ───────────────── */
	27(x) {
		x.set(
			'Autumn. Silla’s army is breaking',
			'Autumn. Silla’s army is breaking against a Goguryeo line that didn’t bother to stay behind its wall. It came down the hill and formed up behind a row of pits, and now the men who should be charging are sitting in the trenches. Yushin is thirty-four, a banner captain. His white horse doesn’t even have a name.',
			'가을. 신라군이 부서지고 있다. 고구려군은 성벽 뒤에 머물 생각도 하지 않았다. 언덕을 내려와 구덩이 줄 뒤에 진을 쳤고, 돌격해야 할 병사들은 지금 참호에 주저앉아 있다. 유신은 서른넷, 깃발 하나를 맡은 대장이다. 그의 흰 말에는 아직 이름도 없다.'
		);
		if (!x.done('They came out of the fort, sir'))
			x.after('A Goguryeo wall that is about to make somebody famous', [
				x.voice('A spearman in the trench', ['They came out of the fort, sir. Right out. They knew they could.'], ['성에서 나왔습니다, 나리. 아예 나와 버렸어요. 나와도 되는 줄 아는 거죠.'])
			]);
		if (!x.done('Nobody waits for the officers')) {
			x.moveMap('rout', 'shouts for his officers before anyone can see his face');
			x.beforeMap('rout', [
				x.p(
					'Nobody waits for the officers. The trench climbs out after the white horse, uphill, and by dusk the Goguryeo line is lying in the field. The fort on the hill opens its gate before anyone knocks.',
					'장교들을 기다리는 사람은 없다. 참호가 흰 말을 따라 언덕 위로 기어 나오고, 해 질 녘이면 고구려의 줄은 들판에 누워 있다. 언덕 위 성은 누가 두드리기도 전에 문을 연다.'
				)
			]);
			x.afterMap('rout', [x.voice('A Silla spearman', ['Who was that? The white horse— whose son is that?'], ['저 흰 말 누구야? 누구 집 아들이냐고?'])]);
		}
	},

	/* ── #40 Gi · bidam-647 banners ─────────────────────────────────── */
	40(x) {
		x.set(
			'raise men at the Fortress of Radiance',
			'Bidam and Yumjong raise men at the Fortress of Radiance, on the hill north-east of the palace. The slogan is old. They only give it a banner. Yumjong holds the outer muster, down the slope on the palace side. Bidam walks the rampart as if the stones owed him rent. Inside the palace, the stewards count the grain and arrive at ten days. Nobody says the number aloud. Everybody schedules by it. The rebels tie on black headbands, Bidam’s old colour from the yard, so they can tell their own from the palace blue. Bidam ties on the old one, brown stain and all.',
			'비담과 염종이 궁 북동쪽 언덕의 명활성에서 군사를 일으킨다. 구호는 오래된 것이다. 그들은 거기에 깃발만 달아 줄 뿐이다. 염종이 궁 쪽 비탈 아래에서 바깥 소집을 맡는다. 비담은 돌들이 자기에게 세라도 밀린 듯 성벽 위를 걷는다. 궁 안에서는 집사들이 곡식을 세다가 열흘이라는 답에 이른다. 아무도 그 숫자를 소리 내어 말하지 않는다. 모두가 그 숫자에 맞춰 일정을 짠다. 반란군은 비담이 화랑 시절 쓰던 검은 머리띠를 맨다. 궁의 푸른색과 제 편을 가리기 위해서다. 비담은 그 낡은 것을, 갈색 얼룩째로 맨다.'
		);
		if (!x.done('Nobody sends for a river'))
			x.after(
				'Close enough to the palace to shout at it',
				[
					x.say('bidam', ['Look at them come down the valley road, Yumjong. Like the spring melt.', 'Nobody sends for a river.'], ['보시오, 염종. 골짜기 길로 내려오는 꼴이 봄 눈석임물 같소.', '강은 누가 불러서 오는 게 아니오.']),
					x.say('yumjong', ['Rivers don’t eat, Councillor. These do.'], ['강은 밥을 안 먹지요, 상대등. 저것들은 먹습니다.'])
				],
				(b) => b.kind === 'place'
			);
	},

	/* ── #42 Seung · bidam-647 arrows ───────────────────────────────── */
	42(x) {
		x.set(
			'the Harmony Council discovers it can convene without deciding anything',
			'Arrows trade across the open ground between the camps. Each morning the palace blue comes up the road, the black headbands come down to meet it, and by dusk both are home again. Messengers lie; the Harmony Council discovers it can convene without deciding anything, which is its highest form. Chunchu’s clerks call the unanimity rule quaint. Bidam calls it ours. Inside the palace, the stewards count eight days of grain.',
			'두 진영 사이 빈 땅으로 화살이 오간다. 아침마다 궁의 푸른 띠가 길을 올라오고, 검은 머리띠가 내려와 맞서고, 해 질 녘이면 둘 다 제자리로 돌아간다. 전령은 거짓말하고, 화백회의는 아무것도 결정하지 않고도 모일 수 있음을 발견한다. 그것이 회의의 최고 형태다. 춘추의 서기들은 만장일치 규칙을 예스럽다고 부른다. 비담은 우리 것이라고 부른다. 궁 안에서 집사들은 여드레 치 곡식을 센다.'
		);
		if (!x.done('Same ditch as yesterday'))
			x.afterMap('arrows', [
				x.say('alchun', ['Oi. Same ditch as yesterday. Same ditch tomorrow.', 'Wake me when one of you means it.'], ['어이. 어제 그 도랑이다. 내일도 그 도랑일 끼고.', '둘 중 하나라도 진심이면 그때 깨워라.'])
			]);
	},

	/* ── #44 Jeon · bidam-647 star ──────────────────────────────────── */
	44(x) {
		x.set(
			'He flies the kite from the palace dark',
			'He flies the kite from the palace dark: a burning scarecrow climbing back up the path the star came down, so the night sky seems to take its light back.',
			'궁의 어둠에서 연을 띄운다 — 별이 내려온 길을 거슬러 타오르는 허수아비가 올라, 밤하늘이 빛을 도로 가져가는 것처럼.'
		);
		if (!x.mapFollows('star', 'He flies the kite from the palace dark')) x.moveMap('star', 'He flies the kite from the palace dark');
	},

	/* ── #46 Gyeol · bidam-647 works / gate ─────────────────────────── */
	46(x) {
		x.set(
			'spent eight days pretending they could avoid',
			'By midday the ninth day has turned into the battle both sides spent eight days pretending they could avoid. The palace blue goes up the road all the way to the outer works under the Radiance wall, and the black comes down off the rampart to throw it back.',
			'한낮이 되자 아홉째 날은, 양쪽이 여드레 동안 피할 수 있는 척했던 싸움이 된다. 궁의 푸른 띠가 길을 따라 명활성 아래 외성까지 밀고 올라가고, 검은 띠가 성벽에서 쏟아져 내려와 그것을 밀어낸다.'
		);
		if (!x.done('By then the Radiance wall is emptying')) {
			x.beforeMap('gate', [
				x.p(
					'By then the Radiance wall is emptying. Black headbands go over the back of it and up the same valley road, and the palace blue goes up the slope after them.',
					'그때쯤 명활성 성벽은 비어 가고 있다. 검은 머리띠들이 성 뒤로 넘어가 같은 골짜기 길로 달아나고, 궁의 푸른 띠가 비탈을 올라 그 뒤를 쫓는다.'
				)
			]);
			x.afterMap('gate', [x.voice('A Hwarang', ['Marshal— the wall’s empty. They’re running up the valley.', 'Do we go after them?'], ['대장군— 성벽이 비었습니다. 골짜기로 달아납니다.', '쫓을까요?'])]);
		}
	}
};

run();
