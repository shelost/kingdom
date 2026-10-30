import { editStory, find } from './story-ops.mjs';

editStory((story) => {
	const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Bupmin');
	const hits = find(e, 'Then a last bay the yard does not number');
	if (hits.length !== 1) throw new Error('intro ' + hits.length);
	hits[0].b.html =
		'When a class has been a month on the yard, the Marshal walks the new boys down it with one lamp. Five bays. One precept each. He walks them in the order he recited.';
	hits[0].b.ko =
		'마당에 온 지 한 달이 되면, 장군이 신참들을 등불 하나로 그 벽을 걷는다. 다섯 칸. 계율마다 하나. 외운 그 차례대로 걷는다.';
	console.log('wall intro trimmed');
});
