import { editStory } from './story-ops.mjs';

function walk(story, title) {
	const find = (entries) => {
		for (const e of entries || []) {
			if (e.title === title) return e;
			const hit = find(e.entries);
			if (hit) return hit;
		}
	};
	for (const ch of story) {
		if (ch.title === title) return ch;
		const hit = find(ch.entries) || find(ch.chapters);
		if (hit) return hit;
	}
}

function lists(entry) {
	const out = [entry.blocks];
	const dive = (blocks) => {
		for (const b of blocks || [])
			if (b.blocks) {
				out.push(b.blocks);
				dive(b.blocks);
			}
	};
	dive(entry.blocks);
	return out;
}

function insertAfter(list, pred, blocks) {
	const i = list.findIndex(pred);
	if (i < 0) return false;
	if (list[i + 1]?.kind === 'place' && list[i + 1].place === blocks[0].place) return 'dup';
	list.splice(i + 1, 0, ...blocks);
	return true;
}

editStory((story) => {
	const seohyun = walk(story, 'Seohyun');
	if (!seohyun) throw new Error('Seohyun');
	for (const list of lists(seohyun)) {
		const lightning = list.find(
			(b) =>
				b.html?.startsWith('On the last night it storms.') ||
				b.html?.startsWith('On the last night the sky comes down')
		);
		if (lightning && lightning.html.startsWith('On the last night it storms.')) {
			lightning.html =
				'On the last night the sky comes down on the door. First the white — a sheet of it, no thunder yet, the whole house-apart printed on the inside of the eye. Then the sound arrives, late and huge, and the timber door splits down the iron bar as if someone had taken an axe to the lock. The smell is burned pine and wet dust. The two cousins do what men do when heaven picks the house they are guarding. They run.';
			lightning.ko =
				'마지막 밤, 하늘이 그 문 위로 내려온다. 먼저 하얗다. 천둥은 아직이다. 별채 안이 눈꺼풀 뒤에 그대로 찍힌다. 그다음에 소리가 온다. 늦고, 크다. 나무문이 쇠빗장 따라 갈라진다. 누가 자물쇠에 도끼를 댄 것처럼. 냄새는 탄 소나무와 젖은 먼지다. 하늘이 제가 지키는 집을 골라 내리치면 사람들이 하는 짓을, 사촌 둘도 한다. 도망친다.';
			const i = list.indexOf(lightning);
			if (!list[i + 1]?.html?.startsWith('In that noise Manmyung')) {
				list.splice(i + 1, 0, {
					kind: 'p',
					html: 'In that noise Manmyung is already on her elbows in the drain. The gap is so low the good silk catches and tears. She stands up in the lane with mud to the wrists and walks toward the two horses as if she were going to market.',
					ko: '그 소란 속에 만명은 이미 팔꿈치로 도랑을 기고 있다. 틈이 너무 낮아 좋은 비단이 걸려 찢어진다. 그녀는 손목까지 진흙인 채로 골목에 일어서서, 장에 가는 여자처럼 말 두 마리 쪽으로 걸어간다.'
				});
			}
			console.log('Seohyun: lightning made visceral.');
		}
		insertAfter(
			list,
			(b) => b.kind === 'scene' && b.label === 'The House Apart',
			[{ kind: 'place', place: 'locked_room', html: 'The room her father locked.', ko: '아버지가 잠근 방.' }]
		);
		insertAfter(
			list,
			(b) => b.kind === 'scene' && b.label === 'Manno',
			[{ kind: 'place', place: 'mannogun', html: 'A wooden wall, a granary, one door that shuts.', ko: '나무 성벽, 곳간, 닫히는 문 하나.' }]
		);
	}

	const sunduk = walk(story, 'Queen Sunduk');
	if (!sunduk) throw new Error('Queen Sunduk');
	for (const list of lists(sunduk)) {
		const sea = list.find((b) => b.html?.startsWith('They cross an open field at a gallop'));
		if (sea) {
			sea.html =
				'They cross an open field at a gallop and do not stop until the grass turns to sand. The eastern harbour, such as it is: a timber quay, boats pulled up, the sea lying flat and silver. Somewhere past it are the pirates.';
			sea.ko =
				'그들은 탁 트인 들판을 내달려, 풀이 모래로 바뀌어서야 멈춘다. 동항이라 하기엔 소박하다. 나무 선창, 끌어올린 배들, 은빛으로 납작하게 누운 바다. 그 너머 어딘가에 해적들이 있다.';
			insertAfter(list, (b) => b === sea, [
				{ kind: 'place', place: 'eastern_harbor', html: 'Where the grass turns to sand.', ko: '풀이 모래로 바뀌는 곳.' }
			]);
			console.log('Queen Sunduk: eastern harbour named.');
		}
	}

	for (const list of lists(sunduk)) {
		const fb = list.find((b) => b.kind === 'flashback' && b.title?.startsWith('The Night Bridge'));
		if (!fb?.blocks) continue;
		const morning = fb.blocks.find((b) => b.html?.startsWith('By morning there is a bridge'));
		if (morning) {
			morning.html =
				'By morning there is a bridge of dressed stones across the stream that nobody in the palace remembers ordering. West of the Moon Palace, over the Hwangcheon ditch — the capital will call it the Ghost Bridge. The servants say goblins. Chunchu, who carried the lamp, says nothing at all, and finds he is good at it.';
			morning.ko =
				'아침이 되자 다듬은 돌다리가 개울 위에 놓여 있다. 궁에서 그걸 시킨 기억이 있는 사람은 없다. 월궁 서쪽, 황천 도랑 위 — 도성은 나중에 귀교라 부를 것이다. 하인들은 도깨비라고 한다. 등불을 들었던 춘추는 아무 말도 하지 않는다. 그리고 자기가 그걸 잘한다는 걸 안다.';
		}
		insertAfter(fb.blocks, (b) => b.html?.startsWith('Chunchu is nine.'), [
			{ kind: 'place', place: 'ghost_bridge', html: 'A night’s work. The stones stay.', ko: '하룻밤 일. 돌은 남는다.' }
		]);
		console.log('Queen Sunduk: Ghost Bridge named.');
	}

	const bidam = walk(story, 'Bidam');
	if (bidam) {
		for (const list of lists(bidam)) {
			const first = list.find((b) => b.html?.startsWith('Class 51’s first morning.'));
			if (first) {
				insertAfter(list, (b) => b === first, [
					{ kind: 'place', place: 'hwarang_gate', html: 'His father walks him this far. No further.', ko: '아버지는 여기까지 데려온다. 더 이상은 아니다.' }
				]);
				console.log('Bidam: Hwarang gate card.');
			}
		}
	}

	const munhee = walk(story, 'Munhee');
	if (munhee) {
		for (const list of lists(munhee)) {
			insertAfter(
				list,
				(b) => b.kind === 'scene' && /Hwarang yard gate/.test(b.label ?? ''),
				[{ kind: 'place', place: 'hwarang_gate', html: 'The gate lets them in.', ko: '그 문이 들여보낸다.' }]
			);
		}
	}
});
