import { loadStory, lists, textOf } from './story-ops.mjs';

const broken = [];
for (const ch of loadStory())
	for (const en of ch.entries ?? []) {
		const text = lists(en).flat().map(textOf).join(' \u0001 ');
		for (const im of en.images ?? []) if (im.at && !text.includes(im.at)) broken.push(`${en.title} :: ${im.id}`);
	}
console.log(broken.length);
if (process.argv[2]) console.log(broken.filter((b) => b.startsWith(process.argv[2] + ' ::')).join('\n'));
else console.log(broken.join('\n'));
