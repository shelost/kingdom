import { editStory, entryOf } from './story-ops.mjs';

editStory((story) => {
	const entry = entryOf(story, 'silla-tang-war', 'Munmu');
	if (!entry) throw new Error('Munmu not found');
	for (const b of entry.blocks) {
		if (b.person === 'jinduk' && b.chip === '#c4a0b4') b.chip = '#9d7bd0';
		if (b.person === 'jesang' && b.chip === '#c4a574') b.chip = '#8B5A2B';
	}
	return true;
});
console.log('Munmu chips fixed');
