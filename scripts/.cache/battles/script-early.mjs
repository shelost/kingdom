/** Script ↔ map pass: pyongyang-371 (#6), gwanggaeto-400 (#9), biryu-244 (#33), salsu-612 (#35). */
import { editStory } from '../story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (speaker, en, lines, gender = 'm') => ({ kind: 'dialogue', chip: '#8a8a94', speaker, gender, en, lines });
const map = (battle, phase) => ({ kind: 'battle', battle, phase });

editStory((story) => {
	const entries = story.flatMap((c) => c.entries);
	const ep = (n) => entries[n - 1].blocks;
	const at = (blocks, frag) => {
		const hits = blocks.flatMap((b, i) => ([b.html, ...(b.en ?? [])].some((t) => t?.includes(frag)) ? [i] : []));
		if (hits.length !== 1) throw new Error(`"${frag}": ${hits.length} hits`);
		return hits[0];
	};
	const mapAt = (blocks, battle, phase) => blocks.findIndex((b) => b.kind === 'battle' && b.battle === battle && b.phase === phase);
	const already = (blocks, battle, phase) => mapAt(blocks, battle, phase) !== -1;

	/* #6 Gunchogo — road, (new) assault, arrow, home */
	{
		const B = ep(6);
		if (already(B, 'pyongyang-371', 'assault')) return false;
		const camp = B[at(B, 'sits by a fire below the wall')];
		camp.html = 'The night before, the Baekje king sits by a fire on the south bank with his son, the crown prince. Across the water is the wall. The boy has never seen a city this big and is trying not to show it.';
		camp.ko = '그 전날 밤, 백제 임금은 강 남쪽 기슭 모닥불 곁에 아들과 앉아 있다. 물 건너편에 성벽이 있다. 태자는 이렇게 큰 성을 처음 보고, 티를 내지 않으려 애쓰는 중이다.';

		const wall = at(B, 'On the wall of Pyongyang there is a Goguryeo boy');
		B[wall].html = 'At first light the Baekje army wades the river and comes at the wall. ' + B[wall].html;
		B[wall].ko = '동이 트자 백제군이 강을 건너 성벽으로 몰려온다. ' + B[wall].ko;
		B.splice(wall + 1, 0, map('pyongyang-371', 'assault'));

		const home = mapAt(B, 'pyongyang-371', 'home');
		B.splice(home, 1);
		const road = at(B, 'On the road south the crown prince asks');
		B.splice(
			road,
			1,
			map('pyongyang-371', 'home'),
			say('The Crown Prince', ['Father, the gate would have opened by spring. Why are we going home?'], ['아바마마, 봄이면 성문이 열렸을 겁니다. 왜 돌아갑니까?']),
			{ kind: 'dialogue', person: 'gyeonggeunchogo', en: ['Listen.'], lines: ['들어 봐라.'] },
			p('Down the column, the men are already singing about it.', '행렬 저 뒤에서 병사들은 벌써 그 일을 노래하고 있다.')
		);
	}

	/* #9 Gwanggaeto — wa, (new) south, relief, jongbal */
	{
		const B = ep(9);
		const fires = B[at(B, 'counts the sea-raiders’ fires')];
		fires.html = 'The Silla king stands on his own wall and counts the sea-raiders’ fires. They sit on the north road, on the south road, and under the west wall. There are more every night. Below, in the hall, his court is arguing about pride.';
		fires.ko = '신라 왕은 제 성벽 위에 서서 바다 도적들의 불을 센다. 북쪽 길에도, 남쪽 길에도, 서쪽 성벽 밑에도 있다. 밤마다 늘어난다. 아래 전각에서는 조정이 체면을 두고 다툰다.';

		const come = at(B, 'The horsemen come down out of the north like weather.');
		B.splice(
			come,
			1,
			p('The horsemen come down out of the north like weather.', '기병들이 날씨처럼 북에서 내려온다.'),
			map('gwanggaeto-400', 'south'),
			say('A Silla Lookout', ['Majesty— the north road. That dust isn’t Wa.'], ['전하— 북쪽 길입니다. 저 먼지는 왜가 아닙니다.']),
			say('The Silla King', ['No. That’s my letter.'], ['아니지. 내 편지다.']),
			p(
				'From his wall he watches the raiders’ fires go out one by one. Then he watches the red banners come through his own gate, and keep coming.',
				'그는 성벽 위에서 도적들의 불이 하나씩 꺼지는 것을 본다. 그다음엔 붉은 깃발들이 제 성문으로 들어오는 것을 본다. 들어오고, 또 들어온다.'
			)
		);
		const relief = mapAt(B, 'gwanggaeto-400', 'relief');
		B.splice(
			relief + 1,
			0,
			say('A Silla Elder', ['They’re still coming in, Majesty.'], ['아직도 들어옵니다, 전하.']),
			say('The Silla King', ['I wrote the word. Let them in.'], ['그 말은 내가 썼다. 들여라.'])
		);

		const clear = at(B, 'They clear the peninsula in a season.');
		B.splice(
			clear,
			1,
			p(
				'The horsemen ride at the raiders’ backs, southwest over the big river and into Gaya country. At the last fortress the gate opens before the ladders are even up.',
				'기병들은 도적들의 등 뒤를 몰아 남서쪽으로, 큰 강을 건너 가야 땅까지 내려간다. 마지막 성은 사다리를 대기도 전에 문을 연다.'
			)
		);
		const jongbal = mapAt(B, 'gwanggaeto-400', 'jongbal');
		B.splice(
			jongbal + 1,
			0,
			say('A Goguryeo Rider', ['That’s it? I didn’t even get off my horse.'], ['이게 끝이야? 말에서 내리지도 않았는데.']),
			p(
				'Silla had asked. That’s the part everyone forgets. Then the horsemen ride back to the Silla capital, and don’t leave for fifty years.',
				'신라가 청했다. 다들 잊는 대목이다. 그리고 기병들은 신라 도성으로 돌아와, 오십 년 동안 떠나지 않는다.'
			)
		);
	}

	/* #33 Boiling River — yangmaek, (new) charge, square, hwando */
	{
		const B = ep(33);
		const won = B[at(B, 'Goguryeo met him at the Boiling River and won.')];
		won.html = won.html.replace('Then it won again.', 'Then it chased him west up a valley and won again.');
		won.ko = won.ko.replace('그리고 또 이겼다.', '그리고 서쪽 골짜기로 그를 쫓아가 또 이겼다.');

		const third = at(B, 'took five thousand horse out to win a third time');
		B.splice(
			third,
			1,
			p(
				'So the king took five thousand horse out to win a third time, on ground he had not looked at. The Wei general formed a square on a slope that ran his way, and waited.',
				'그렇게 왕은 세 번째 승리를 거두러 철기 오천을 끌고 나갔다. 들여다본 적도 없는 땅으로. 위의 장수는 제 쪽으로 기운 비탈에 방진을 치고 기다렸다.'
			),
			map('biryu-244', 'charge'),
			say('The captain', ['Majesty, they’re not running.', 'Why aren’t they running?'], ['전하, 놈들이 달아나지 않습니다.', '왜 안 달아나는 겁니까?']),
			p('The square held. The horses didn’t. Eighteen thousand men died in an afternoon.', '방진은 버텼다. 말들은 버티지 못했다. 한나절 만에 만 팔천이 죽었다.')
		);
	}

	/* #35 Colossal River — camp, seven, halt, salsu */
	{
		const B = ep(35);
		const stop = at(B, 'Thirty li from Pyongyang, the army stops');
		B.splice(
			stop,
			1,
			p(
				'The Colossal River is low that summer. They wade it without losing a man and nobody thinks about it twice. Thirty li from Pyongyang, the army stops and looks at the walls. The walls look back.',
				'그해 여름 살수는 얕다. 그들은 한 명도 잃지 않고 걸어서 건넌다. 아무도 그걸 두 번 생각하지 않는다. 평양 삼십 리 앞에서 군대는 멈춰 성벽을 바라본다. 성벽도 마주 본다.'
			)
		);
		const halt = mapAt(B, 'salsu-612', 'halt');
		B.splice(
			halt + 1,
			0,
			say('Sui officer', ['General, we have no ladders up here, and no rice to wait with.'], ['장군, 여기엔 사다리도 없고, 버틸 쌀도 없습니다.']),
			p('Then a letter arrives from Munduk. It is a poem.', '그때 을지문덕의 편지가 온다. 시다.')
		);

		const turn = B[at(B, 'They turn for home starving.')];
		turn.html = 'They turn for home starving, in squares, with Goguryeo riders on every side. At the Colossal River the water is still low and wide, and the army starts back across.';
		turn.ko = '그들은 굶주린 채 방진을 짜고 돌아선다. 사방에 고구려 기병이 붙는다. 살수의 물은 여전히 얕고 넓다. 군대가 다시 건너기 시작한다.';

		const salsu = mapAt(B, 'salsu-612', 'salsu');
		B.splice(salsu + 1, 0, say('A Sui soldier', ['It was knee-deep! It was knee-deep on the way down—'], ['무릎까지였어! 내려올 땐 무릎까지였다고—']));
	}
});

console.log('ok');
