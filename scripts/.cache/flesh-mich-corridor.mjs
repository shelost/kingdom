/** Insert the corridor kill Changjori watched — the …예. anchor was not unique. */
import { editStory, find } from './story-ops.mjs';

editStory((story) => {
	const mich = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'King Micheon');
	if (!mich) throw new Error('missing');
	const hits = find(
		mich,
		'짧게 하자. 사람들 앞에서 말고.',
		(b) => b.kind === 'dialogue' && b.person === 'bongsang'
	);
	if (hits.length !== 1) throw new Error(`bongsang corridor: ${hits.length}`);
	const { list, i } = hits[0];
	/* Dalga’s …Yes. is the next dialogue; put the kill after it. */
	let at = i + 1;
	if (list[at]?.person === 'dalga') at += 1;
	list.splice(
		at,
		0,
		{
			kind: 'scene',
			label: 'A corridor · the next day',
			ko: '복도 · 다음날',
			weather: 'night'
		},
		{
			kind: 'p',
			html: 'Changjori is in the doorway with the ledger he was told not to keep. Two men. A door that should have been a door. The general reaches for the staff and does not make it.',
			ko: '창조리는 적지 말라는 장부를 든 채 문간에 있다. 사내 둘. 문이어야 할 문. 장군이 지팡이에 손을 뻗고, 닿지 못한다.'
		},
		{
			kind: 'dialogue',
			person: 'changjori',
			chip: '#8a7048',
			lines: ['장군— 문—', '잠깐, 문 열면—'],
			en: ['General— the door—', 'Wait, if I open it—']
		},
		{
			kind: 'p',
			html: 'He does not open it. The staff hits the floor. He picks it up afterwards and does not know why.',
			ko: '열지 않는다. 지팡이가 바닥에 떨어진다. 나중에 집어 들고, 왜 집었는지 모른다.'
		}
	);
	return { ok: true };
});
