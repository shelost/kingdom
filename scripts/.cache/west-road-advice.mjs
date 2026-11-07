import { editStory } from './story-ops.mjs';

editStory((story) => {
	const en = story.flatMap((p) => p.entries ?? []).find((e) => e.title === 'Gardener');
	if (!en) throw new Error('Gardener missing');
	const d = en.blocks.find(
		(b) => b.kind === 'dialogue' && b.person === 'wongang' && (b.en?.[0] ?? '').startsWith('West.')
	);
	if (!d) throw new Error('wongang west line missing');
	if (/Western Empire|서쪽 제국/.test(d.en?.[0] ?? '')) return false;
	d.lines = [
		'서쪽. 서쪽 제국 건너. 바람의 땅이랑 대지의 땅은 돌고. 불의 땅, 물의 땅 지나. 길 셋으로 갈라지먼 가운데. 약수 지키는 승려. 거서 삼천 리 더.',
		'사라도령. 느 아방.'
	];
	d.en = [
		'West. Cross the Western Empire. Around Air and Earth — through Fire and Water. When the road splits three ways, take the middle. The monk at the spring. Three thousand li more.',
		'Sara. Your father.'
	];
	const i = en.blocks.indexOf(d);
	const next = en.blocks[i + 1];
	if (next?.kind === 'p' && /Sinrok|신록/.test(next.html ?? '')) {
		/* leave the night departure as-is */
	}
	console.log('updated wongang west advice at', i);
});
