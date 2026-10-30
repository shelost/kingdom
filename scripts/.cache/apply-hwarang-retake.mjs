import { editStory, find } from './story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const D = ({ person, speaker, gender = 'm', en, lines, look, chip }) => {
	const b = { kind: 'dialogue', en, lines };
	if (person) b.person = person;
	if (speaker) {
		b.speaker = speaker;
		b.gender = gender;
	}
	if (look) b.look = look;
	if (chip) b.chip = chip;
	return b;
};

const alchun = { person: 'alchun', look: 'hwarang', chip: '#8fb3e0' };

function one(entry, frag) {
	const hits = find(entry, frag);
	if (hits.length !== 1) throw new Error(`"${frag.slice(0, 70)}" → ${hits.length} in ${entry.title}`);
	return hits[0];
}

function insertAfter(entry, frag, blocks) {
	const h = one(entry, frag);
	h.list.splice(h.i + 1, 0, ...blocks);
}

function setP(entry, frag, html, ko) {
	const h = one(entry, frag);
	h.list[h.i].html = html;
	h.list[h.i].ko = ko;
}

function walk(blocks, fn) {
	for (const b of blocks ?? []) {
		fn(b);
		if (b.blocks) walk(b.blocks, fn);
	}
}

function dropFb(entry, title) {
	const go = (list) => {
		const i = list.findIndex((b) => b.kind === 'flashback' && b.title === title);
		if (i >= 0) {
			list.splice(i, 1);
			return true;
		}
		for (const b of list) if (b.kind === 'flashback' && go(b.blocks || [])) return true;
		return false;
	};
	if (!go(entry.blocks)) throw new Error(`no flashback ${title} in ${entry.title}`);
}

function marshalToAlchun(entry) {
	walk(entry.blocks, (b) => {
		if (b.kind === 'dialogue' && b.speaker === 'The Yard Marshal') {
			delete b.speaker;
			delete b.gender;
			b.person = 'alchun';
			b.look = 'hwarang';
			b.chip = '#8fb3e0';
		}
		if (typeof b.html === 'string') {
			b.html = b.html
				.replace('He has two fingers left on the sword hand, and he uses both of them to point at the empty ring around the boy in magenta.', 'He looks at the empty ring the way he looks at a crooked stance, and then he walks into it.')
				.replace('The Marshal does not usually walk out with a group. He looks at the empty ring the way he looks at a crooked stance, and then he walks into it.', 'Alchun does not usually walk out with a group. He looks at the empty ring the way he looks at a crooked stance, and then he walks into it.')
				.replace('The Marshal does not usually walk out with a group.', 'Alchun does not usually walk out with a group.')
				.replace('The Marshal stands them in a line and does not raise his voice. He never does. He doesn’t have to.', 'Alchun stands them in a line and does not raise his voice. He never does. He doesn’t have to.')
				.replace('Chunchu looks at the two fingers on the Marshal’s sword hand, and then at the gate, and does not ask why.', 'Chunchu looks at Alchun, and then at the gate, and does not ask why.')
				.replace('The Marshal’s arm is still out.', 'Alchun’s arm is still out.')
				.replace('The Marshal sits on a root and does not help', 'Alchun sits on a root and does not help')
				.replace('The Marshal takes a root and watches him', 'Alchun takes a root and watches him')
				.replace('The Marshal’s face does not move.', 'Alchun’s face does not move.')
				.replace('The Marshal watches his hands, not the forest.', 'Alchun watches his hands, not the forest.')
				.replace('leaves the Marshal does not know', 'leaves Alchun does not know')
				.replace('The Marshal’s are not, quite.', 'Alchun’s are not, quite.')
				.replace('The Marshal’s two fingers drum once on his knee and stop.', 'Alchun’s fingers drum once on his knee and stop.')
				.replace('The Marshal would not stop him.', 'Alchun would not stop him.')
				.replace('The Marshal does not take it from him.', 'Alchun does not take it from him.')
				.replace('the Marshal pretends not to hear.', 'Alchun pretends not to hear.')
				.replace('The Marshal is beside him, two fingers on the rope he is not holding.', 'Alchun is beside him, empty hands on the rope he is not holding.')
				.replace(
					'The Marshal is beside Chunchu, two fingers on the rope he is not holding, as if he had planned this, which he had not.',
					'Alchun is beside Chunchu, empty hands, as if he had planned this, which he had not.'
				)
				.replace('He is not the marshal. He has been watching the rope, not the horn.', 'He is not the one who walked out. He has been watching the rope, not the horn.')
				.replace(
					'He is not the marshal. Class 51 left years ago, and the yard still runs drills under his name. He has been watching the rope, not the horn.',
					'He is not the one who walked out. Class 51 left the headband years ago, and the yard still runs drills under his name. He has been watching the rope, not the horn.'
				);
		}
		if (typeof b.ko === 'string') {
			b.ko = b.ko
				.replace('도감은 원래 무리를 직접 끌고 나가지 않는다. 칼잡이 손에 손가락이 둘 남았고, 그 둘로 자홍빛 아이 주위 빈 줄을 가리킨다.', '알천은 원래 무리를 직접 끌고 나가지 않는다. 빈 줄을 본다. 자세가 틀린 아이를 보듯. 그리고 그 안으로 걸어 들어간다.')
				.replace('도감은 원래 무리를 직접 끌고 나가지 않는다. 빈 줄을 본다. 자세가 틀린 아이를 보듯. 그리고 그 안으로 걸어 들어간다.', '알천은 원래 무리를 직접 끌고 나가지 않는다. 빈 줄을 본다. 자세가 틀린 아이를 보듯. 그리고 그 안으로 걸어 들어간다.')
				.replace('도감은 원래 무리를 직접 끌고 나가지 않는다.', '알천은 원래 무리를 직접 끌고 나가지 않는다.')
				.replace('도감이 아이들을 한 줄로 세운다.', '알천이 아이들을 한 줄로 세운다.')
				.replace('춘추가 도감의 칼잡이 손, 손가락 둘을 보고, 문을 보고, 왜냐고 묻지 않는다.', '춘추가 알천을 보고, 문을 보고, 왜냐고 묻지 않는다.')
				.replace('도감의 팔은 아직 나와 있다.', '알천의 팔은 아직 나와 있다.')
				.replace('도감은 뿌리에 앉아 돕지 않는다.', '알천은 뿌리에 앉아 돕지 않는다.')
				.replace('도감은 뿌리를 잡고', '알천은 뿌리를 잡고')
				.replace('도감의 얼굴은 꿈쩍도 하지 않는다.', '알천의 얼굴은 꿈쩍도 하지 않는다.')
				.replace('도감은 숲이 아니라 그 손을 본다.', '알천은 숲이 아니라 그 손을 본다.')
				.replace('도감이 이름 모르는 잎을', '알천이 이름 모르는 잎을')
				.replace('도감의 손은, 조금, 떤다.', '알천의 손은, 조금, 떤다.')
				.replace('도감의 손가락 둘이 무릎에서 한 번 구르다 멈춘다.', '알천의 손가락이 무릎에서 한 번 구르다 멈춘다.')
				.replace('도감이 말리지는 않을 것이다.', '알천이 말리지는 않을 것이다.')
				.replace('도감은 뺏지 않는다.', '알천은 뺏지 않는다.')
				.replace('도감은 안 들은 척한다.', '알천은 안 들은 척한다.')
				.replace('곁에 도감. 쥐지도 않은 고삐 위에 손가락 둘.', '곁에 알천. 쥐지도 않은 고삐 위에 빈 손.')
				.replace(
					'곁에 도감. 쥐지도 않은 고삐 위에 손가락 둘. 계획한 사람처럼. 계획하지는 않았다.',
					'곁에 알천. 빈 손. 계획한 사람처럼. 계획하지는 않았다.'
				)
				.replace('도감이 아니다.', '걸어 나온 사람은 아니다.');
		}
		if (Array.isArray(b.en)) {
			b.en = b.en.map((s) =>
				s
					.replace('The Marshal?', 'Alchun?')
					.replace('Kim. The game said kill—', 'He brought a deer.')
			);
		}
		if (Array.isArray(b.lines)) {
			b.lines = b.lines.map((s) =>
				s
					.replace('도감이?', '알천 선배가?')
					.replace('김 화랑. 놀이가 죽이라—', '사슴을 데려왔다.')
			);
		}
	});
}

const BEAR_IDS = ['hunt-isabu-dirt', 'hunt-sadaham-charge', 'hunt-sadaham-third', 'hunt-sadaham-passout'];

editStory((story) => {
	const entry = (title) => {
		const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === title);
		if (!e) throw new Error(`no entry ${title}`);
		return e;
	};
	const bup = entry('Bupmin');
	const mun = entry('Munhee');
	const sad = entry('Sadaham');

	insertAfter(bup, 'From above, the yard is a pale square under the Moon Palace roofs', []);

	setP(
		bup,
		'Beside the stone, a bear, and a boy who would not stay down',
		'Beside the stone, a bear, and a boy who would not stay down. Isabu had a plan. The boy did not read it. The rest of that story is not this wall’s to tell.',
		'돌 옆, 곰, 그리고 눕지 않기로 한 아이. 이사부에게는 계획이 있었다. 아이는 읽지 않았다. 그 이야기의 나머지는 이 벽이 할 말이 아니다.'
	);
	dropFb(bup, 'the bear');
	bup.images = (bup.images || []).filter((i) => !BEAR_IDS.includes(i.id));

	insertAfter(bup, 'Each hyangdo goes into the forest and brings back a piece of an animal', [
		P(
			'Nam is all pines from above. Then it is a path, and a goat, and three boys who have not yet decided who is bait.',
			'남산은 위에선 소나무뿐이다. 그다음이 길이고, 염소고, 누가 미끼인지 아직 안 정한 아이 셋이다.'
		)
	]);

	const neck = one(bup, 'I can take the neck.');
	const neckB = neck.list[neck.i];
	neckB.en = ['Oi.', 'Both of you shut up.', 'I don’t— I don’t even have a sword.'];
	neckB.lines = ['야.', '둘 다 입 다물어.', '나— 나 칼도 없거든.'];

	setP(
		bup,
		'a goat on a rope, and a strip of blood',
		'Bidam does not shut up. He kneels in the pine-dirt and draws with a stick: a goat on a rope, and a strip of blood down the creek, a mark where a person stands, a mark in the pine. Yushin watches the marks the way he watches a drill. Alchun is the skinniest of the three. He has been frightened since the lots. His hands will not close on the pine.',
		'비담은 입을 다물지 않는다. 소나무 흙에 무릎 꿇고 막대기로 그린다. 밧줄에 맨 염소, 개울을 따라 그은 피 자국, 사람 서는 자리, 소나무 자리. 유신은 훈련을 보듯 그 표시를 본다. 알천은 셋 중 가장 마르다. 제비 뽑을 때부터 겁이 나 있다. 소나무에서 손이 안 쥐어진다.'
	);

	insertAfter(bup, 'does not say the next instruction. Yushin does not move.', [
		P(
			'Alchun’s hands will not close on the pine. Then they do.',
			'알천의 손이 소나무에서 안 쥐어진다. 그러고는 쥐어진다.'
		)
	]);

	setP(
		bup,
		'Alchun comes out of the pine the way a stone comes out of a sling',
		'Alchun comes out of the pine the way a stone comes out of a sling. Nothing in his hands. The mountain goes. There is only his face. Then Alchun’s arms find the neck, and the tiger’s weight is suddenly a problem for the skinniest boy in the yard, who was eating a rice cake this morning.',
		'알천이 소나무에서 나온다. 물매에서 돌이 나오듯. 손은 비었다. 산이 사라진다. 그 얼굴만 남는다. 그리고 알천의 팔이 목을 찾는다. 호랑이 무게가, 연무장에서 제일 말랐던, 오늘 아침 떡 먹던 아이의 문제가 된다.'
	);

	marshalToAlchun(mun);
	marshalToAlchun(bup);

	insertAfter(mun, 'The deer comes. It noses the wooden mouth. It folds.', [
		P(
			'The deer that comes is huge. Shoulder as high as the boy’s chest. It folds anyway.',
			'오는 사슴이 크다. 어깨가 아이 가슴까지다. 그래도 접힌다.'
		)
	]);

	const sadOk = find(sad, 'He draws the plan in dirt');
	if (sadOk.length !== 1) throw new Error(`Sadaham bear hunt missing (${sadOk.length})`);
});

console.log('hwarang retake applied');
