import { editStory, lists } from '../story-ops.mjs';
editStory((story) => {
	let n = 0, hit = 0;
	for (const c of story)
		for (const e of c.entries) {
			if (++n !== 99) continue;
			for (const list of lists(e))
				for (const b of list) {
					if (b.kind !== 'dialogue' || b.person !== 'gesomun') continue;
					b.lines = b.lines.map((l) => {
						const m = l
							.replace('거짓말 말라우. 나도 춥다.', '거짓말 말라. 나두 춥다.')
							.replace('그래도 기억해. 왕은', '기래도 기억해라. 왕은');
						if (m !== l) hit++;
						return m;
					});
				}
		}
	console.log('changed', hit);
	return hit > 0;
});
