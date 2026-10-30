import { editStory } from './story-ops.mjs';

const ORDER = [
	'Dangun & Old Joseon',
	'Prosperity Mountain',
	'Ansung',
	'Letters',
	'Stone Gate',
	'Wonsul',
	'Kim Yushin†',
	'Munmu',
	'Maeso',
	'Final Ford',
	'Wanggum'
];

editStory((story) => {
	const chs = Array.isArray(story) ? story : story.chapters;
	const samhan = chs.find((c) => c.id === 'samhan');
	if (!samhan) throw new Error('samhan arc missing');
	samhan.title = 'Three Kingdoms';
	samhan.korean = '삼국';
	samhan.hanja = '三國';

	const stw = chs.find((c) => c.id === 'silla-tang-war');
	if (!stw) throw new Error('silla-tang-war arc missing');
	const byTitle = new Map();
	for (const e of stw.entries) {
		if (e.title === "The Wanggum's Guest") {
			e.title = 'Munmu';
			e.subtitle = '문무왕';
		} else if (e.title === 'The King for All') {
			e.title = 'Wanggum';
		}
		byTitle.set(e.title, e);
	}
	const missing = ORDER.filter((t) => !byTitle.has(t));
	const leftover = [...byTitle.keys()].filter((t) => !ORDER.includes(t));
	if (missing.length || leftover.length) {
		throw new Error(`order mismatch missing=${missing.join(',')} leftover=${leftover.join(',')}`);
	}
	stw.entries = ORDER.map((t) => byTitle.get(t));
});

console.log('renamed Arc I → Three Kingdoms; reordered Silla-Tang War; Munmu / Wanggum');
