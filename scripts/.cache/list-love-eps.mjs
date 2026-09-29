import { readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('src/lib/data/story.json', 'utf8'));
const chapters = Array.isArray(story) ? story : story.chapters;

function slug(title) {
	return title
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['’‘]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

const re =
	/jumong|sosuno|haemosu|yuhwa|ungnyeo|dangun|gaya|heo|ibiga|suro|munhee|gotaso|wedding|harbour|sunduk|yushin|longmen|xue|liu|jahee|bupmin|onjo|birch|amnok|ridge|coat|skirt|secret|melomance|romance/i;

for (const ch of chapters) {
	for (const en of ch.entries || []) {
		const id = `${ch.id}-${slug(en.title)}`;
		const line = `${id}\t${en.year || ''}\t${en.title}\t${en.tone || ''}`;
		if (re.test(line)) console.log(line);
	}
}
