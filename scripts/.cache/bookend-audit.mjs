// Which episodes lack a still on their opening line or on their final scene (the block before the next-episode card).
import fs from 'node:fs';
const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const norm = (t) => (t ?? '').replace(/<[^>]+>/g, '').toLowerCase();
const text = (b) => norm([b.html, b.ko, b.caption, b.title, ...(b.en ?? []), ...(b.lines ?? [])].filter(Boolean).join(' '));
const isCard = (b) => b.kind === 'p' && /^\s*<b>[\s\S]*<\/b>\s*$/.test(b.html ?? '');
const story_ = (b) => b.kind === 'p' || b.kind === 'dialogue' || b.kind === 'monologue';
export function bookends(e) {
	const first = e.blocks.findIndex(story_);
	let last = e.blocks.length - 1;
	while (last >= 0 && (isCard(e.blocks[last]) || !story_(e.blocks[last]))) last--;
	return { first, last };
}
export function anchoredAt(e, i) {
	return (e.images ?? []).filter((im) => {
		if (!im.at) return false;
		const k = e.blocks.findIndex((b) => text(b).includes(im.at.toLowerCase()));
		return k === i;
	});
}
if (process.argv[1].endsWith('bookend-audit.mjs')) {
	let n = 0, openNeed = 0, closeNeed = 0;
	for (const ch of Object.values(story)) for (const e of ch.entries ?? []) {
		n++;
		const { first, last } = bookends(e);
		const o = anchoredAt(e, first).length, c = anchoredAt(e, last).length;
		if (!o) openNeed++;
		if (!c) closeNeed++;
	}
	console.log({ episodes: n, openNeed, closeNeed });
}
