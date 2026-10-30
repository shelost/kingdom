import { editStory } from './story-ops.mjs';

editStory((story) => {
	const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Momal');
	if (!e) throw new Error('Momal not found');
	const B = e.blocks;

	const find = (pred, label) => {
		const i = B.findIndex(pred);
		if (i < 0) throw new Error('missing ' + label);
		return i;
	};

	// Reattach stills the rename pulled off their `at` fragments.
	const reattach = {
		'jesang-jangsu-guest': 'Momal does not kneel first',
		'jesang-silla-ship': 'Momal puts him on the Silla ship himself',
		'jesang-wa-silhouette': 'Momal does not bow'
	};
	for (const im of e.images ?? []) {
		if (reattach[im.id]) im.at = reattach[im.id];
	}

	const iSit = find((b) => b.kind === 'p' && b.html?.startsWith('Momal does not kneel first'), 'sit');
	B.splice(iSit, 0, {
		kind: 'p',
		html: 'They announce him. The hall uses the formal name. Jangsu does not stand.',
		ko: '이름을 부른다. 대청은 공식 이름을 쓴다. 장수는 안 일어선다.'
	}, {
		kind: 'dialogue',
		speaker: 'A Goguryeo officer',
		gender: 'm',
		en: ['Park Jesang of the south shore.'],
		lines: ['남쪽 박제상입니다.']
	});

	const iOrder = find((b) => b.kind === 'dialogue' && b.person === 'jangsu' && b.en?.[0] === 'Bring the boy.', 'order');
	B.splice(iOrder + 1, 0, {
		kind: 'p',
		html: 'He does not go himself. He lifts two fingers. The yard below the window fills with horses.',
		ko: '직접 안 간다. 손가락 둘을 든다. 창 아래 마당이 말로 찬다.'
	});

	const iLow = find((b) => b.kind === 'dialogue' && b.person === 'jesang' && b.en?.[0] === 'Keep low.', 'low');
	B.splice(iLow + 1, 0, {
		kind: 'p',
		html: 'One rider does come down. Spear first. Momal turns the horse into the man’s shoulder and the grass takes him.',
		ko: '기병 하나가 내려온다. 창이 먼저다. 모말이 말을 그 어깨로 돌린다. 풀이 받는다.'
	}, {
		kind: 'p',
		html: 'A second tries the other flank. The ring-pommel comes out only long enough to knock the spear aside. He does not stay to finish.',
		ko: '둘째가 다른 옆을 노린다. 환두가 나와, 창을 밀어낼 만큼만 나온다. 끝내려고 서지 않는다.'
	});

	console.log('blocks', B.length);
	return true;
});
