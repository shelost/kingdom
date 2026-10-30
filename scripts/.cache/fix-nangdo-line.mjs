import { editStory, find } from './story-ops.mjs';

editStory((story) => {
	const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Sadaham');
	if (!e) throw new Error('Sadaham not found');
	const hits = find(e, 'the word for them is nangdo');
	if (!hits.length) throw new Error('nangdo line not found');
	for (const { b } of hits) {
		b.html = b.html.replace(
			'and the word for them is nangdo — disciples. It only means the ones who went.',
			'and the word for them is disciples. It only means the ones who went.'
		);
	}
	console.log('patched', hits.length);
});
