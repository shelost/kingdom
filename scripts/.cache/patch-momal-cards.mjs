import { editStory, entryOf, find } from './story-ops.mjs';

editStory((story) => {
	const momal = entryOf(story, 'five-principles', 'Momal');
	if (!momal) throw new Error('Momal not found');

	const childHits = find(momal, 'The boats are already Momal', (b) => b.kind === 'card' && b.person === 'jesang');
	if (childHits.length !== 1) throw new Error(`childhood card hits: ${childHits.length}`);
	const child = childHits[0].b;
	child.look = 'child';
	child.write = 'Park Momal';
	child.still = '/intro/jesang-child--momal.jpg';

	const already = find(momal, 'formerly known as Momal', (b) => b.kind === 'card');
	if (already.length) return;

	const announce = find(momal, '대청은 예스러운 쪽을 쓴다', (b) => b.kind === 'p');
	if (announce.length !== 1) throw new Error(`announce hits: ${announce.length}`);
	const { list, i } = announce[0];
	list.splice(i + 1, 0, {
		kind: 'card',
		person: 'jesang',
		look: 'lord',
		write: 'Park Jesang',
		sub: '(formerly known as Momal)',
		caption: 'The hall’s name. The boats were the other one.',
		ko: '대청의 이름. 배는 다른 쪽이었다.',
		still: '/intro/jesang-lord--momal.jpg'
	});
});

console.log('patched Momal cards');
