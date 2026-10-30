import { editStory, entryOf, find } from './story-ops.mjs';

editStory((story) => {
	const en = entryOf(story, 'five-principles', 'Ulbul');
	if (!en) throw new Error('missing Ulbul');

	function once(after, blocks) {
		const hits = find(en, after);
		if (hits.length !== 1) throw new Error(`anchor ${JSON.stringify(after)}: ${hits.length}`);
		const next = hits[0].list[hits[0].i + 1];
		if (next && blocks[0].html && next.html === blocks[0].html) return;
		if (next && blocks[0].kind === 'dialogue' && next.en?.[0] === blocks[0].en?.[0]) return;
		hits[0].list.splice(hits[0].i + 1, 0, ...blocks);
	}

	function rewrite(fragment, html, ko) {
		const hits = find(en, fragment);
		if (hits.length !== 1) throw new Error(`rewrite ${JSON.stringify(fragment)}: ${hits.length}`);
		hits[0].b.html = html;
		hits[0].b.ko = ko;
	}

	/* Jaemo is Ummo's nephew — hire + boat */
	rewrite(
		'Tomorrow does not come. Ummo puts him on wood',
		'Tomorrow does not come. Ummo puts him on wood, then on stones, then on salt. He does not ask a name. He already has a nephew who talks enough for two.',
		'내일은 오지 않는다. 음모는 나무를 시키고, 돌을 시키고, 소금을 시킨다. 이름은 안 묻는다. 조카가 이미 두 사람 분량은 떠든다.'
	);

	once('The name sits in his mouth like a stone', [
		{
			kind: 'p',
			html: 'In the morning Ummo slaps a bowl down and eats beside him. He does not look kind. He looks like a man who has decided the boy will not starve on his floor.',
			ko: '아침에 음모가 그릇을 내려놓고 옆에 앉아 먹는다. 착해 보이지 않는다. 자기 바닥에선 이 아이가 안 굶을 거라고 정한 사람처럼 보인다.'
		},
		{
			kind: 'dialogue',
			person: 'eummo',
			chip: '#6b5a48',
			lines: ['먹어.', '말은 나중에.', '조카가 오면 네가 진다.'],
			en: ['Eat.', 'Talk later.', 'When my nephew comes, you lose.']
		}
	]);

	const boat = find(en, 'That is the beginning of');
	if (boat.length === 1 && !boat[0].list[boat[0].i + 1]?.html?.includes('Ummo’s nephew')) {
		boat[0].list.splice(boat[0].i + 1, 0, {
			kind: 'dialogue',
			person: 'eummo',
			chip: '#6b5a48',
			lines: ['재모다.', '내 조카.', '입 많아. 너는 묶어.'],
			en: ['Jaemo.', 'My nephew.', 'He talks. You tie.']
		});
		boat[0].list.splice(boat[0].i + 2, 0, {
			kind: 'p',
			html: 'They eat on the boat that first night. Jaemo talks until the frogs give up. Ulbul almost laughs. He puts the laugh back. Jaemo pretends not to see it.',
			ko: '첫날 밤 배 위에서 먹는다. 재모가 개구리가 포기할 때까지 떠든다. 을불이 웃을 뻔한다. 웃음을 도로 넣는다. 재모는 못 본 척한다.'
		});
	}

	const jaemoCard = find(en, 'He talks first and counts later');
	if (jaemoCard.length === 1 && jaemoCard[0].b.kind === 'card') {
		jaemoCard[0].b.caption = 'Ummo’s nephew. He talks first and counts later, except when the young one is watching.';
		jaemoCard[0].b.ko = '음모의 조카. 말은 먼저, 셈은 나중. 다만 젊은 쪽이 볼 때는 아니다.';
	}

	/* Bongsang depravity */
	once('Neither do the women.', [
		{
			kind: 'p',
			html: 'He drinks until the floor is a second table. A girl on each knee. Silk hiked. Someone is singing a song that used to be about a harvest. He has them sing it again, slower, because he likes the part where the grain is gone.',
			ko: '바닥이 두 번째 상이 될 때까지 마신다. 무릎마다 여자. 비단이 걷힌다. 누가 예전에 추수 노래였던 것을 부른다. 다시, 느리게, 하라고 한다. 곡식이 없어지는 대목이 좋으니까.'
		},
		{
			kind: 'dialogue',
			person: 'bongsang',
			chip: '#6e2a2a',
			lines: ['더.', '지붕이 낮으면 올려.', '굶는 소리는 여기까지 안 들려.'],
			en: ['More.', 'If the roof is low, raise it.', 'Hunger doesn’t carry this far.']
		}
	]);

	/* Market full vs famine — after the living market, before the hall that night */
	once('He does not look up again. Not today.', [
		{
			kind: 'p',
			html: 'From above, this market is a living thing. Aisles. Elbows. A child stealing a persimmon. Salt white on the boards. The red munru on the ridge watching like it always has.',
			ko: '위에서 보면 이 장은 살아 있다. 골목. 팔꿈치. 감 훔치는 아이. 판자 위 흰 소금. 능선 위 붉은 문루는 늘 보던 대로 본다.'
		},
		{
			kind: 'scene',
			label: 'The same market · a famine morning',
			ko: '같은 장 · 기근 아침',
			weather: 'dusk'
		},
		{
			kind: 'p',
			html: 'Same posts. Same ridge. Same munru. The aisles are empty. A dog pulls at something in the ditch that used to be a person. The persimmon stall is a board and a fly.',
			ko: '같은 기둥. 같은 능선. 같은 문루. 골목은 비었다. 개 한 마리가, 예전에 사람이었던 것을 구렁에서 당긴다. 감 좌판은 판자와 파리다.'
		},
		{
			kind: 'p',
			html: 'Changjori walks the empty aisle with a ledger he cannot fill. He counts what is not there. That is the only arithmetic left.',
			ko: '창조리가 채울 수 없는 장부를 들고 빈 골목을 걷는다. 없는 것을 센다. 남은 셈이 그것이다.'
		}
	]);

	/* Remonstrate — bird's eye, broken face */
	once('Changjori bows. In the corridor his hands', [
		{
			kind: 'p',
			html: 'From the roof the hall is a dark rectangle and one gray head on the floor. The king is a red stamp on the dais, cup up, laughing. Changjori does not get up until the laugh is finished.',
			ko: '지붕에서 보면 전각은 검은 사각형이고, 바닥에 회색 머리 하나다. 임금은 대 위의 붉은 도장, 잔을 들고 웃는다. 창조리는 그 웃음이 끝날 때까지 일어나지 않는다.'
		},
		{
			kind: 'dialogue',
			person: 'changjori',
			chip: '#8a7048',
			lines: ['전하.', '한 번만. 장만 가 보십시오.', '비었습니다.'],
			en: ['Majesty.', 'Once. Just walk the market.', 'It’s empty.']
		},
		{
			kind: 'dialogue',
			person: 'bongsang',
			chip: '#6e2a2a',
			lines: ['비었으면 네가 채워.', '나는 잔이 있다.'],
			en: ['If it’s empty, you fill it.', 'I have a cup.']
		}
	]);

	/* Find Ulbul — more dramatic */
	once('They look at each other. That is all it takes.', [
		{
			kind: 'p',
			html: 'The old man’s face does something a ledger is not supposed to do. Ulbul’s does not. He has practiced not doing it.',
			ko: '늙은이의 얼굴이, 장부가 하면 안 되는 짓을 한다. 을불의 얼굴은 안 한다. 안 하는 연습을 해 왔다.'
		},
		{
			kind: 'dialogue',
			person: 'changjori',
			chip: '#8a7048',
			lines: ['을불.', '돌고 아들.', '내가— 문을 안 열었소. 그때.', '이제 열어 주시오.'],
			en: ['Eulbul.', 'Dolgo’s son.', 'I— I didn’t open the door. Then.', 'Open it for me now.']
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			chip: '#C30000',
			look: 'exile',
			lines: ['소금이오.', '문은 궁에 있소.', '나는 가마니요.'],
			en: ['Salt.', 'The door is at the palace.', 'I’m a sack.']
		}
	]);

	/* Side room — Euija parallel, bloodied, half-conscious */
	rewrite(
		'He knows he will not walk out. His sons stay.',
		'He knows he will not walk out. Blood on the mouth from the path. The crown tipped. Half a laugh still in him, then not. His sons sit against the door. He is already somewhere else, the way a man is when the room has decided.',
		'나가지 못할 줄 안다. 길에서 묻은 피가 입에 있다. 왕관이 삐뚤다. 웃음이 반쯤 남아 있다가, 없다. 아들들이 문에 등을 댄다. 그는 이미 다른 데 있다. 방이 정한 뒤에 사내가 가는 곳으로.'
	);

	once('I— just a minute. A minute.', [
		{
			kind: 'p',
			html: 'He sits in the dark with the belt and cannot remember which knot is for a horse. The blood dries on his lip. He asks the boys if the door is locked. They do not answer, because they are children, and because it is.',
			ko: '어둠 속에 띠를 들고 앉아, 말 매는 매듭이 어느 쪽인지 기억 못 한다. 입술의 피가 마른다. 아이들에게 문이 잠겼냐고 묻는다. 대답 없다. 아이니까. 그리고 잠겼으니까.'
		}
	]);

	/* Coup plan establishing */
	once('the first roof in sev', [
		{
			kind: 'scene',
			label: 'The south house · the plan',
			ko: '남쪽 집 · 계획',
			weather: 'night'
		},
		{
			kind: 'p',
			html: 'One lamp. A branch on the table, still green. Changjori draws the hunt with a wet finger. Who stands where. Who puts the reed in. Who takes the reins.',
			ko: '등불 하나. 아직 푸른 가지가 상 위에 있다. 창조리가 젖은 손가락으로 사냥을 그린다. 누가 어디에 서는지. 누가 갈대를 꽂는지. 누가 고삐를 가져가는지.'
		},
		{
			kind: 'dialogue',
			person: 'changjori',
			chip: '#8a7048',
			lines: ['사냥이오.', '북사면.', '가지를 모자에 꽂으면, 우리요.'],
			en: ['A hunt.', 'North slope.', 'Branch in the cap. That’s us.']
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			chip: '#C30000',
			look: 'exile',
			lines: ['나는.', '어디에.'],
			en: ['Me.', 'Where.']
		},
		{
			kind: 'dialogue',
			person: 'changjori',
			chip: '#8a7048',
			lines: ['여기.', '끝날 때까지.', '끝나면 전각이오.'],
			en: ['Here.', 'Until it’s done.', 'Then the hall.']
		}
	]);

	return true;
});

console.log('patched Ulbul comic beats');
