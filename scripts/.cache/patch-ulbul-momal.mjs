import { editStory } from './story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (person, chip, lines, en) => ({ kind: 'dialogue', person, chip, lines, en });
const card = (person, caption, ko, extra = {}) => ({ kind: 'card', person, caption, ko, ...extra });

const J = '#e8563f';
const C = '#8a7048';
const JS = '#8B5A2B';
const N = '#9a3060';

editStory((story) => {
	const ulbul = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Ulbul');
	if (!ulbul) throw new Error('Ulbul not found');

	const iChang = ulbul.blocks.findIndex(
		(b) => b.kind === 'dialogue' && (b.en ?? []).some((l) => /The mud.s fine/.test(l))
	);
	if (iChang < 0) throw new Error('changjori kneel not found');
	if (!ulbul.blocks.some((b) => b.kind === 'card' && b.person === 'changjori')) {
		ulbul.blocks.splice(
			iChang + 1,
			0,
			card(
				'changjori',
				'The man who put his knees in the mud first. The reed comes later.',
				'무릎을 먼저 진흙에 넣은 사람. 갈대는 나중이다.'
			)
		);
	}

	const iSteam = ulbul.blocks.findIndex((b) => b.kind === 'p' && /Someone is already sitting in the dark/.test(b.html ?? ''));
	if (iSteam < 0) throw new Error('cave sit not found');
	const already = ulbul.blocks.some((b) => /The cave breathes/.test(b.html ?? ''));
	if (!already) {
		ulbul.blocks.splice(
			iSteam + 1,
			0,
			p('The cave breathes. Steam. Not water.', '굴이 숨을 쉰다. 김이다. 물이 아니다.'),
			p('Three figures in it. One close. Two farther, paler.', '세 그림자. 하나는 가깝다. 둘은 멀고, 흐리다.'),
			p('The closest sits like a man who has been waiting a long time.', '가까운 쪽은, 오래 기다린 사람처럼 앉아 있다.')
		);
	}

	const iHey = ulbul.blocks.findIndex((b) => b.kind === 'dialogue' && (b.en ?? []).includes('Hey. You. Salt.'));
	if (iHey < 0) throw new Error('jumong hey not found');
	if (!ulbul.blocks.some((b) => b.kind === 'card' && b.person === 'jumong')) {
		ulbul.blocks.splice(
			iHey + 1,
			0,
			card(
				'jumong',
				'Eleven from him. The first time the book lets you see the face.',
				'그로부터 열하나. 얼굴을 보는 건, 이번이 처음이다.',
				{ look: 'exile' }
			)
		);
	}

	const iFather = ulbul.blocks.findIndex((b) => b.kind === 'p' && /The face is a boy/.test(b.html ?? ''));
	if (iFather >= 0 && !ulbul.blocks.some((b) => /The far one is his father/.test(b.html ?? ''))) {
		ulbul.blocks.splice(
			iFather + 1,
			0,
			p(
				'Behind him, paler: a king in a gold crown. A father with no crown.',
				'뒤로, 흐리게: 금관 쓴 왕. 관 없는 아비.'
			),
			p('The far one is his father. He cannot be. He is.', '먼 쪽이 아버지다. 그럴 리 없다. 그렇다.')
		);
	}

	const fb292 = ulbul.blocks.find((b) => b.kind === 'flashback' && String(b.year).includes('292'));
	const fb293 = fb292?.blocks?.find((b) => b.kind === 'flashback');
	if (fb293 && !fb293.blocks.some((b) => b.kind === 'card' && b.person === 'dolgo')) {
		const i = fb293.blocks.findIndex((b) => b.kind === 'dialogue' && b.person === 'dolgo');
		if (i >= 0)
			fb293.blocks.splice(
				i + 1,
				0,
				card('dolgo', 'The brother people smiled for. Tonight he has a cup and a back door.', '사람들이 웃어 주던 아우. 오늘 밤엔 잔과 뒷문이 있다.')
			);
	}

	const momal = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Momal');
	if (!momal) throw new Error('Momal not found');
	const iHall = momal.blocks.findIndex(
		(b) => b.kind === 'dialogue' && b.person === 'nulji' && (b.en ?? []).some((l) => /The hall says Park Jesang/.test(l))
	);
	if (iHall < 0) throw new Error('Nulji hall line not found');
	const next = momal.blocks[iHall + 1];
	if (next?.person === 'jesang' && (next.en ?? []).includes('The rest was Momal.')) {
		momal.blocks.splice(
			iHall + 1,
			0,
			d('jesang', JS, ['박이야. 시조한테서 곧장.', '혁거세. 직계.'], ['Park. Straight from the first king.', 'Hyukgose. Direct.']),
			d('nulji', N, ['알아. 그 이름.', '그걸 물으려던 게 아냐.'], ['I know. That name.', "That's not what I asked."])
		);
	}

	console.log('patched Ulbul cards + cave steam; Momal Hyukgose line');
});
