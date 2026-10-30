// Two scenes-gaya stills in Sadaham anchored to wording that has since changed.
import fs from 'node:fs';
import { editStory } from '../story-ops.mjs';
const AT = {
	'scenes-gaya-charge': 'He takes five thousand horse at the',
	'scenes-gaya-watcher': 'He watches the boy work down the line for a while.'
};
editStory((story) => {
	let n = 0;
	for (const e of story.flatMap((c) => c.entries))
		for (const im of e.images ?? []) if (AT[im.id] && im.at !== AT[im.id]) (im.at = AT[im.id]), n++;
	console.log('re-anchored', n);
	return n > 0;
});
const f = 'scripts/.cache/scene-stills/scenes-gaya.json';
const items = JSON.parse(fs.readFileSync(f, 'utf8'));
for (const i of items) if (AT[i.id]) i.at = AT[i.id];
fs.writeFileSync(f, JSON.stringify(items, null, '\t') + '\n');
