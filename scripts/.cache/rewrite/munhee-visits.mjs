/**
 * Munhee, the visits: blush → hands → first kiss, then Chunchu tearing his own coat to have a reason to go back.
 * Inserted after "They do not leap. They accumulate." and before the father comes home early.
 */
import { editStory, find } from '../story-ops.mjs';

const CHIP = { chunchu: '#D8258C', munhee: '#F06292' };
const say = (person, en, ko) => ({ kind: 'dialogue', person, chip: CHIP[person], lines: ko, en });
const crowd = (speaker, en, ko, gender = 'm') => ({ kind: 'dialogue', speaker, gender, chip: '#6b7280', lines: ko, en });
const p = (html, ko) => ({ kind: 'p', html, ko });

editStory((story) => {
	let ep;
	for (const c of story) for (const e of c.entries ?? []) if (e.title === 'Munhee') ep = e;
	if (find(ep, 'That’s the third coat this month.').length) {
		console.log('already applied');
		return false;
	}
	const chip = ep.blocks.find((b) => b.person === 'munhee')?.chip;
	if (chip) CHIP.munhee = chip;
	const hits = find(ep, 'They do not leap. They accumulate.').filter((h) => h.list === ep.blocks);
	if (hits.length !== 1) throw new Error(`${hits.length} hits for the anchor`);

	ep.blocks.splice(
		hits[0].i + 1,
		0,
		p(
			'The second visit, she measures his shoulders with her hands. The string stays in her sleeve. He goes red to the ears and lets her.',
			'두 번째에는 치수 끈 대신 손으로 그의 어깨를 잰다. 끈은 소매 속에 그대로 있다. 그는 귀까지 빨개져서, 그냥 재게 둔다.'
		),
		p(
			'The third, their fingers meet on the needle. Neither of them lets go first.',
			'세 번째에는 바늘 위에서 손가락이 닿는다. 누구도 먼저 놓지 않는다.'
		),
		p(
			'The fifth, she bites off the thread. He kisses her before she can put it down.',
			'다섯 번째에는 그녀가 이로 실을 끊는다. 그는 그녀가 실을 내려놓기도 전에 입을 맞춘다.'
		),
		p(
			'Across the city, in a house with too many servants, a young True Bone stands in his underrobe and rips the tie off his own coat with his teeth. He looks at the hem. He rips that too. Then he calls for his horse.',
			'도성 건너편, 하인이 너무 많은 집에서 젊은 진골 하나가 속옷 바람으로 서서 제 옷고름을 이로 물어뜯는다. 밑단을 내려다본다. 그것도 뜯는다. 그러고는 말을 대령하라 이른다.'
		),
		crowd(
			'His manservant',
			['My lord. That’s the third coat this month.', 'You didn’t play gyuku today, my lord.'],
			['나리. 이번 달만 세 벌째입니다요.', '오늘은 격구도 안 하셨잖습니까요.']
		),
		say('chunchu', ['…Then it’s a very violent city.'], ['…그럼 서라벌이 험한 게지.']),
		p(
			'At the Gaya house Munhee holds the tie up to the light. There are teeth marks on it.',
			'가야 집에서 문희가 옷고름을 빛에 비춰 든다. 이빨 자국이 나 있다.'
		),
		say('munhee', ['You bit this.'], ['이거, 이로 뜯었네요.']),
		say('chunchu', ['Gyuku.'], ['격구였소.']),
		say('munhee', ['Sit down.', '…And take the rest off. I’ll find something.'], ['앉아요.', '…나머지도 벗어요. 꿰맬 데는 내가 찾을 테니.'])
	);
	console.log('applied');
});
