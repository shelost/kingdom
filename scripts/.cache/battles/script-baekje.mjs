/**
 * Script ↔ map alignment for the Baekje battles: hwangsan (#72), sabi-660 (#73),
 * pyongyang-661 (#78, #79), sasu-662 (#79), baekgang-663 (#83).
 * Each op is guarded by the text it replaces, so a second run is a no-op.
 */
import { editStory } from '../story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const D = (who, en, lines, chip) => ({ kind: 'dialogue', ...(chip ? { chip } : {}), ...who, lines, en });
const MAP = (battle, phase) => ({ kind: 'battle', battle, phase });
const SEOKDAL = { speaker: 'Seokdal', gender: 'm' };

const isMap = (b, battle, phase) => b.kind === 'battle' && b.battle === battle && b.phase === phase;
const text = (b) => [b.html, ...(b.en ?? [])].filter(Boolean).join(' ');

function idx(e, pred, label) {
	const hits = e.blocks.flatMap((b, i) => (pred(b) ? [i] : []));
	if (hits.length !== 1) throw new Error(`${label}: ${hits.length} hits`);
	return hits[0];
}
const has = (e, frag) => e.blocks.some((b) => text(b).includes(frag));
const at = (e, frag) => idx(e, (b) => text(b).includes(frag), frag);
const mapAt = (e, battle, phase) => idx(e, (b) => isMap(b, battle, phase), `${battle}/${phase}`);
const exact = (e, person, line) => idx(e, (b) => b.kind === 'dialogue' && b.person === person && b.en.length === 1 && b.en[0] === line, line);

/** Replace a substring in both languages of one block. */
function swap(e, frag, [enOld, enNew], [koOld, koNew]) {
	const b = e.blocks[at(e, frag)];
	if (!b.html.includes(enOld) || !b.ko.includes(koOld)) throw new Error(`swap: ${frag}`);
	b.html = b.html.replace(enOld, enNew);
	b.ko = b.ko.replace(koOld, koNew);
}
function setP(e, frag, html, ko) {
	Object.assign(e.blocks[at(e, frag)], { html, ko });
}
/** Pull block `from` out and reinsert it right after the block found by `afterPred`. */
function moveAfter(e, from, afterIdxFn) {
	const [b] = e.blocks.splice(from, 1);
	e.blocks.splice(afterIdxFn() + 1, 0, b);
}
const insertAfter = (e, i, ...bs) => e.blocks.splice(i + 1, 0, ...bs);
const insertBefore = (e, i, ...bs) => e.blocks.splice(i, 0, ...bs);
function reanchor(e, id, frag) {
	const img = e.images.find((x) => x.id === id);
	if (!img) throw new Error(`image ${id}`);
	img.at = frag;
}

function hwangsan(e) {
	if (has(e, 'between the eastern camp and the stream'))
		swap(e, 'between the eastern camp and the stream', ['the eastern camp', 'the centre camp'], ['동쪽 진영에서', '가운데 진영에서']);

	// camps: the formation board repeats the first map; set the scene from the pass instead.
	if (!has(e, 'It splits three ways, one cloud to each road')) {
		const f = e.blocks.findIndex((b) => b.kind === 'formation' && b.title?.startsWith('Yellow Mountain'));
		if (f >= 0) e.blocks.splice(f, 1);
		insertBefore(
			e,
			mapAt(e, 'hwangsan', 'camps'),
			P(
				'From the pass, Gyebek watches the dust come off the eastern hills. It splits three ways, one cloud to each road, as if it had seen his map.',
				'고개 위에서 계백은 동쪽 산에서 내려오는 먼지를 지켜본다. 먼지가 셋으로 갈라진다. 길마다 한 줄기씩. 그의 지도를 보기라도 한 것처럼.'
			)
		);
		insertAfter(
			e,
			mapAt(e, 'hwangsan', 'camps'),
			D(SEOKDAL, ['Three columns, General. One on each road.', 'They’re making camp past the stream. Eight thousand paces, about.'], ['세 갈래입니다, 장군. 길마다 하나씩.', '개울 건너에 진을 칩니다. 팔천 걸음쯤입니다.'], '#d9b13a'),
			D({ person: 'gyebek' }, ['Eight thousand three hundred.'], ['팔천삼백.'], '#d9b13a')
		);
	}

	// first: name each column's road and camp; the count comes after the map.
	if (has(e, 'Yushin centre, Heumsun left, Pumil right')) {
		setP(
			e,
			'Yushin centre, Heumsun left, Pumil right',
			'Silla comes on the first time in three columns. Heumsun takes the northern road to the left camp. Yushin takes the middle, straight at the pass. Pumil takes the southern road to the right camp. All three at once, exactly as the arithmetic says. They wade the stream, and then it is uphill. In the heat. Into yellow shields set edge to edge. The archers wait to see which column is thickest, and loose at that one. All three camps throw them back across the water into their own dust.',
			'신라는 첫 공격을 세 갈래로 해 온다. 흠순은 북쪽 길로 왼쪽 진영을 친다. 유신은 가운데로, 곧장 고개를 향한다. 품일은 남쪽 길로 오른쪽 진영을 친다. 산수가 시키는 그대로, 셋이 한꺼번에. 개울을 건너면 그다음은 오르막이다. 땡볕에. 가장자리를 맞댄 노란 방패를 향해. 궁수들은 어느 줄이 가장 두꺼운지 보고 나서야 그 줄에 쏜다. 세 진영이 그들을 개울 건너 제 먼지 속으로 도로 밀어낸다.'
		);
		reanchor(e, 'hwangsan-yushin-column', 'Yushin takes the middle, straight at the pass');
		moveAfter(e, exact(e, 'gyebek', 'One.'), () => mapAt(e, 'hwangsan', 'first'));
		insertAfter(e, mapAt(e, 'hwangsan', 'first'), D(SEOKDAL, ['All three back over the stream, General.'], ['셋 다 개울 너머로 물러갑니다, 장군.'], '#d9b13a'));
	}

	// second: Heumsun's fist on the northern road, the centre sliding north behind it.
	if (has(e, 'It comes down the northern road in one fist')) {
		swap(e, 'It comes down the northern road in one fist', ['It comes down the northern road', 'Heumsun brings it down the northern road'], ['북쪽 길로 한 주먹이', '흠순이 북쪽 길로 한 주먹이']);
		swap(
			e,
			'The fist opens on the stakes',
			['The fist opens on the stakes and goes back up the road carrying its own.', 'Behind the fist, Yushin’s centre edges north, waiting for a hole. The fist opens on the stakes and goes back down the road, over the stream, carrying its own.'],
			['주먹은 말뚝 앞에서 펴지고, 제 사람들을 메고 길을 되올라간다.', '주먹 뒤로 유신의 가운데가 북쪽으로 슬며시 붙는다. 구멍이 나기를 기다리며. 주먹은 말뚝 앞에서 펴지고, 제 사람들을 메고 길을 되짚어 개울 너머로 내려간다.']
		);
		moveAfter(e, exact(e, 'gyebek', 'Two.'), () => mapAt(e, 'hwangsan', 'second'));
	}

	// third: Pumil on the southern road, the right camp moved back and up.
	if (has(e, 'and for the length of a held breath the right road almost opens')) {
		setP(
			e,
			'and for the length of a held breath the right road almost opens',
			'The third time Pumil takes the southern road, where the ground is softest and the right camp sits lowest. For the length of a held breath the road almost opens. Then it closes again on spears counted in the night. The right camp is not quite where Pumil’s scouts drew it at dawn. It is further back and higher. Every pace of the difference is uphill, and the Silla line arrives at the stakes with nothing left in its legs.',
			'세 번째에 품일이 남쪽 길을 탄다. 땅이 가장 무르고 오른쪽 진영이 가장 낮게 앉은 곳이다. 숨 한 번 참는 동안 길이 거의 열린다. 그러고는 밤에 세어 둔 창에 다시 닫힌다. 오른쪽 진영은 새벽에 품일의 척후가 그려 온 자리에 꼭 있지 않다. 더 뒤에, 더 높은 곳에 있다. 그 차이의 걸음은 전부 오르막이라, 신라의 대열은 다리에 남은 것 없이 말뚝에 닿는다.'
		);
		moveAfter(e, exact(e, 'gyebek', 'Three.'), () => mapAt(e, 'hwangsan', 'third'));
	}

	// fourth: the map moves up to the charge itself; the duel plays as the reaction.
	if (!has(e, 'straight up the middle road toward the pass')) {
		swap(
			e,
			'The fourth time Yushin rides',
			['on the white horse, and meets', 'on the white horse, straight up the middle road toward the pass, and meets'],
			['가운데 맨 앞에 서서, 진영과 진영 사이의 틈에서', '가운데 맨 앞에 서서, 가운데 길을 곧장 올라 고개로 향한다. 그리고 진영과 진영 사이의 틈에서']
		);
		moveAfter(e, mapAt(e, 'hwangsan', 'fourth'), () => at(e, 'The fourth time Yushin rides'));
		insertAfter(
			e,
			mapAt(e, 'hwangsan', 'fourth'),
			D(SEOKDAL, ['General— the white horse. That’s him.', 'Yushin himself, on the middle road.'], ['장군, 백마입니다. 그 사람입니다.', '유신이 직접 옵니다. 가운데 길로.'], '#d9b13a'),
			D({ person: 'gyebek' }, ['Hold the camps.'], ['진영을 지키시오.'], '#d9b13a')
		);
	}

	// boys: both charges go up the middle road into the pass.
	if (has(e, 'Bangul rides out alone and does not come back. He goes into the Baekje line where it is thickest'))
		swap(
			e,
			'Bangul rides out alone and does not come back',
			['Bangul rides out alone and does not come back. He goes into the Baekje line where it is thickest', 'Bangul rides out alone up the middle road and does not come back. He goes into the Baekje line at the pass, where it is thickest,'],
			['반굴이 홀로 말을 몰고 나가 돌아오지 않는다. 그는 백제의 대열이', '반굴이 홀로 가운데 길을 달려 올라가 돌아오지 않는다. 그는 고개 앞, 백제의 대열이']
		);
	if (has(e, 'He ties the head to the saddle and sends the horse back.'))
		swap(e, 'He ties the head to the saddle', ['sends the horse back.', 'sends the horse back down the middle road.'], ['말을 돌려보낸다.', '말을 가운데 길로 돌려보낸다.']);

	// last: all three roads, the left camp first, the right folding north.
	if (has(e, 'goes forward and does not stop. A father'))
		setP(
			e,
			'goes forward and does not stop. A father',
			'The Silla line, which has failed four times that morning, comes up all three roads at once and does not stop. A father’s wet sleeve is worth more than a fourth failure. The left camp on the northern road goes under first — not broken so much as used up. The right camp holds the southern road one more breath, then folds north toward the centre like a hinge that has decided to finish.',
			'그날 아침 네 번을 실패한 신라의 대열이 세 길로 한꺼번에 올라오고, 이번엔 멈추지 않는다. 아비의 젖은 소매가 네 번째 실패보다 값이 크다. 북쪽 길의 왼쪽 진영이 먼저 가라앉는다 — 부서졌다기보다 다 쓰인 것에 가깝다. 오른쪽 진영이 남쪽 길을 한 숨 더 버티다가, 끝내기로 한 경첩처럼 북쪽 가운데로 접힌다.'
		);
}

function sabi(e) {
	// landing: the river-mouth line arrives before Euija's feast idea.
	if (!has(e, 'Before noon a second runner comes up the road from the river mouth')) {
		const m = e.blocks.splice(mapAt(e, 'sabi-660', 'landing'), 1)[0];
		insertAfter(
			e,
			at(e, 'Euija sits down on the top step'),
			P(
				'Before noon a second runner comes up the road from the river mouth, muddy to the waist, with what is left of the river-mouth line behind him.',
				'정오가 되기 전, 두 번째 전령이 강어귀 길을 따라 올라온다. 허리까지 진흙투성이고, 그 뒤로 강어귀 방어선의 남은 자들이 따라온다.'
			),
			m
		);
	}

	// plain: both allies at once, Euija on the wall.
	if (!has(e, 'Euija watches from the wall.')) {
		insertBefore(
			e,
			mapAt(e, 'sabi-660', 'plain'),
			P(
				'Next morning the allies come at the city together, the Tang up from their camp in the south, Silla down the road from the east. Baekje puts everything it has left on the plain between them. Euija watches from the wall.',
				'이튿날 아침 두 동맹군이 함께 도성으로 온다. 당군은 남쪽 진영에서 올라오고, 신라군은 동쪽 길로 내려온다. 백제는 남은 것을 전부 그 사이 벌판에 내놓는다. 의자는 성벽 위에서 지켜본다.'
			)
		);
		insertAfter(
			e,
			mapAt(e, 'sabi-660', 'plain'),
			D({ person: 'euija' }, ['Look at that. Every man I had left, on one plain.', 'Ha… Don’t count them for me. I can count.'], ['저거 봐라. 남은 놈들이 전부 한 벌판에 있다.', '하… 세어 주지 마라. 나도 셀 줄 안다.'], '#e0b155')
		);
	}

	// flight: the battle map replaces the world map that showed the same boat.
	const world = e.blocks.findIndex((b) => b.kind === 'map' && b.routes?.includes('euija660-flight'));
	if (world >= 0) {
		e.blocks.splice(world, 1);
		moveAfter(e, mapAt(e, 'sabi-660', 'flight'), () => at(e, 'leaves Sabi at night for'));
		swap(e, 'leaves Sabi at night for', ['</b>, with fewer men', '</b>, upriver to the north-east, with fewer men'], ['<b>웅진성</b>으로 향한다.', '강을 거슬러 북동쪽, <b>웅진성</b>으로 향한다.']);
	}

	// ungjin: back down the river, the Ye brothers on the wall.
	if (has(e, 'By morning the king is on his way to the Red Fowl’s tent.')) {
		setP(
			e,
			'By morning the king is on his way to the Red Fowl’s tent.',
			'By morning the king is on the river again, bound, going back down it toward the Red Fowl’s tent. The Ye brothers watch the boat from the wall.',
			'아침이 되자 임금은 묶인 채 다시 강 위에 있다. 이번에는 강을 따라 내려가, 주작의 군막으로. 예씨 형제가 성벽에서 그 배를 지켜본다.'
		);
		insertAfter(
			e,
			mapAt(e, 'sabi-660', 'ungjin'),
			D({ person: 'yegun' }, ['You can stop counting sails now.'], ['이제 돛은 그만 세도 되겠다.']),
			D({ person: 'yesikjin' }, ['…One more.', 'Going down.'], ['…하나 더 있습니다.', '내려가는 배요.'], '#a3813d')
		);
	}
}

function pyongyang(e) {
	if (has(e, 'He comes up the Taedong in the eighth month')) {
		swap(e, 'He comes up the Taedong in the eighth month', ['He comes up the Taedong in', 'He comes up the Taedong from the sea in'], ['그는 팔월에 대동강을', '그는 팔월에 바다에서 대동강을']);
		insertAfter(
			e,
			mapAt(e, 'pyongyang-661', 'taedong'),
			D({ person: 'namgun' }, ['Father! Sails on the Taedong, right up under the south wall!', '…They’re sitting down. Why are they sitting down?'], ['아버지! 대동강에 돛입니다. 남쪽 성벽 바로 밑까지요!', '…앉습니다. 왜 앉는 겁니까?'], '#9e3b32'),
			D({ person: 'gesomun' }, ['Let them sit. Let them sit till their arses freeze to the ground.'], ['앉으라 그래. 엉덩이가 땅에 얼어붙을 때까지 앉아 있으라 그래.'], '#d0362f')
		);
	}
	if (has(e, 'Thirty thousand men die defending a line that has gone white.'))
		swap(e, 'Thirty thousand men die defending', [' Thirty thousand men die defending a line that has gone white.', ''], [' 하얗게 지워진 선 하나를 지키다 삼만 명이 죽는다.', '']);
	if (has(e, 'He comes home through the fortress gate at dusk'))
		swap(e, 'He comes home through the fortress gate at dusk', ['He comes home through the fortress gate', 'He rides south all the way home and comes in through the fortress gate'], ['그는 해 질 녘, 빌린 말을 타고 성문을 지나', '그는 남쪽으로 줄곧 말을 달려, 해 질 녘 빌린 말을 타고 성문을 지나']);
	if (!has(e, 'The White Dragon goes back north the way he came'))
		swap(
			e,
			'freezes in the snow outside the walls',
			['The Red Fowl’s army freezes', 'The White Dragon goes back north the way he came, called away to some other war. The Red Fowl’s army freezes'],
			['주작의 군대가', '백룡은 다른 전쟁에 불려, 왔던 길로 북쪽으로 돌아간다. 주작의 군대가']
		);
}

function snake(e) {
	if (has(e, 'The Tiger is marching to join the Red Fowl outside Pyongyang. If he gets there'))
		swap(
			e,
			'The Tiger is marching to join',
			['The Tiger is marching to join the Red Fowl outside Pyongyang.', 'The Tiger is marching west to join the Red Fowl outside Pyongyang, and the Snake is in his way.'],
			['백호는 평양성 밖의 주작과 합치려고 행군 중이다.', '백호는 평양성 밖의 주작과 합치려고 서쪽으로 행군 중이고, 사수가 그 길을 막고 있다.']
		);
	if (!has(e, 'behind the Tiger, where nobody has looked'))
		swap(
			e,
			'Gesomun lets him get halfway.',
			['and Gesomun knows which is which.', 'and Gesomun knows which is which. His men already hold the west bank, and more of them wait on the east, behind the Tiger, where nobody has looked.'],
			['개소문은 어디가 어딘지 안다.', '개소문은 어디가 어딘지 안다. 그의 군사는 이미 서쪽 둑을 쥐고 있고, 동쪽에도, 백호의 등 뒤 아무도 돌아보지 않은 곳에 더 기다리고 있다.']
		);
	if (!has(e, 'Mud. It’s only mud. Keep walking.'))
		insertAfter(
			e,
			mapAt(e, 'sasu-662', 'halfway'),
			D({ person: 'pangxiaotai' }, ['Mud. It’s only mud. Keep walking.', '…Boys? Boys, on me.'], ['진흙이다. 그냥 진흙이야. 계속 걸어.', '…얘들아? 얘들아, 내 쪽으로.'], '#c4b896')
		);
	if (has(e, 'The seventh almost makes the far bank.'))
		swap(e, 'The seventh almost makes the far bank.', ['the far bank', 'the east bank'], ['건너편 둑', '동쪽 둑']);

	// convoy and home (pyongyang-661 maps that live in this episode)
	if (has(e, 'a train of carts comes up out of the south through snow to the axles'))
		swap(
			e,
			'a train of carts comes up out of the south',
			['a train of carts comes up out of the south through snow to the axles.', 'a train of carts comes north out of Silla and across the Imjin, through snow to the axles.'],
			['바퀴 축까지 차는 눈을 뚫고 남쪽에서 수레 행렬이 올라온다.', '바퀴 축까지 차는 눈을 뚫고 신라에서 임진강을 건너 북쪽으로 수레 행렬이 올라온다.']
		);
	if (has(e, 'and the white horse carries him across it.')) {
		swap(
			e,
			'and the white horse carries him across it.',
			['Goguryeo’s horsemen follow the empty carts all the way to the Imjin, and the white horse carries him across it.', 'Goguryeo’s horsemen follow the empty carts south all the way to the Imjin. At the ford, Yushin turns the white horse round.'],
			['고구려 기병이 빈 수레를 임진강까지 쫓아오고, 흰 말이 그를 태우고 강을 건넌다.', '고구려 기병이 빈 수레를 남쪽으로 임진강까지 쫓아온다. 나루에서 유신이 흰 말의 머리를 돌린다.']
		);
		insertAfter(
			e,
			mapAt(e, 'pyongyang-661', 'home'),
			D({ person: 'yushin' }, ['They followed us all this way to see where we live.', 'Now they know. Water the horses.'], ['우리 사는 데를 보겠다고 여기까지 따라왔군.', '이제 알았겠지. 말들 물 먹이게.'], '#4a8fe0')
		);
	}
}

function baekgang(e) {
	if (has(e, 'On the bank the Baekje horsemen guard the landing.'))
		swap(e, 'On the bank the Baekje horsemen', ['On the bank the Baekje', 'On the south shore of the mouth the Baekje'], ['강기슭에서는 백제 기병이', '강어귀 남쪽 기슭에서는 백제 기병이']);
	if (!has(e, 'Then he takes the foot south down the road to Juryu')) {
		swap(
			e,
			'which is how old generals watch something they no longer need to do themselves',
			['no longer need to do themselves.', 'no longer need to do themselves. Then he takes the foot south down the road to Juryu, and closes the ring.'],
			['늙은 장수들은 그렇게 지켜본다.', '늙은 장수들은 그렇게 지켜본다. 그러고는 보병을 이끌고 남쪽 길로 내려가 주류의 포위를 닫는다.']
		);
		insertAfter(
			e,
			mapAt(e, 'baekgang-663', 'shore'),
			D({ person: 'pung' }, ['Those were my last horsemen.', '…Then we have ships. Ships do not run.'], ['저것이 과인의 마지막 기병이었소.', '…그렇다면 배가 있소. 배는 달아나지 않소.'], '#e6c76a')
		);
	}
	if (!e.blocks.some((b) => isMap(b, 'baekgang-663', 'vanguard'))) {
		swap(
			e,
			'They row straight at the Tang line on the evening water',
			['They row straight at the Tang line', 'They come up out of the south-west and row straight at the Tang line'],
			['저녁 물을 타고 당의 대열로 곧장 저어 간다.', '남서쪽 바다에서 올라와, 저녁 물을 타고 당의 대열로 곧장 저어 간다.']
		);
		reanchor(e, 'wr-wa-vanguard', 'row straight at the Tang line on the evening water');
		insertAfter(e, at(e, 'row straight at the Tang line on the evening water'), MAP('baekgang-663', 'vanguard'));
	}
	if (!e.blocks.some((b) => isMap(b, 'baekgang-663', 'escape')))
		insertAfter(e, at(e, 'He leaves behind his fleet, his allies, his capital on the hill, and his sword.'), MAP('baekgang-663', 'escape'));
}

editStory((story) => {
	const es = story.flatMap((c) => c.entries);
	const ep = (n, title) => {
		const e = es[n - 1];
		if (e.title !== title) throw new Error(`#${n} is ${e.title}, expected ${title}`);
		return e;
	};
	hwangsan(ep(72, 'Yellow Mountain'));
	sabi(ep(73, 'Sabi'));
	pyongyang(ep(78, 'Pyongyang I'));
	snake(ep(79, 'Snake River'));
	baekgang(ep(83, 'White River'));
});
console.log('ok');
