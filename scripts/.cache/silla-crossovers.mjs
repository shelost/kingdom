import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));

function find(entries, title) {
	for (const e of entries || []) {
		if (e.title === title) return e;
		const hit = find(e.entries, title) || find(e.chapters, title);
		if (hit) return hit;
	}
}
function walkTop(obj, title) {
	if (Array.isArray(obj)) return find(obj, title);
	for (const k of Object.keys(obj)) {
		if (Array.isArray(obj[k])) {
			const h = find(obj[k], title);
			if (h) return h;
		}
	}
}
function walkBlocks(blocks, fn) {
	for (const b of blocks || []) {
		fn(b);
		if (b.blocks) walkBlocks(b.blocks, fn);
	}
}

const forty = walkTop(story, 'Forty Fortresses');
if (!forty) throw new Error('Forty Fortresses not found');

walkBlocks(forty.blocks, (b) => {
	if (
		b.html ===
		'You will sit through a louder wedding later, in a hall with a pink ribbon, and watch a different girl pick a different man. This one is quieter. The girl watching is seven. The choosing is the same.'
	) {
		b.html =
			'You’ve already sat through a louder wedding, in a hall with a pink ribbon, and watched a different girl pick a different man. This one is quieter. The girl watching is seven. The choosing is the same.';
		b.ko =
			'분홍 리본 달린 마루의 더 시끄러운 혼례는 이미 앉아 보셨을 것이다. 다른 아이가 다른 사내를 고르는 자리. 여기는 더 조용하다. 보는 아이는 일곱이다. 고르는 일은 같다.';
		console.log('Fixed cake-on-the-stream reader-order.');
	}
});

const jinhung = walkTop(story, 'Jinhung, the Cloud');
if (!jinhung) throw new Error('Jinhung not found');
let n = 0;
walkBlocks(jinhung.blocks, (b) => {
	if (b.kind === 'dialogue' && b.person === 'sadaham' && !b.look) {
		b.look = 'unnamed';
		n++;
	}
});
console.log(`Jinhung: Sadaham look:unnamed on ${n} lines.`);

const munhee = walkTop(story, 'Munhee');
if (!munhee) throw new Error('Munhee not found');
const already = munhee.blocks.some((b) =>
	b.html?.includes('You already know most of the room')
);
if (!already) {
	const idx = munhee.blocks.findIndex((b) =>
		b.html?.startsWith('The bride’s father sits near the dais')
	);
	if (idx < 0) throw new Error('Munhee wedding hall not found');
	munhee.blocks.splice(idx + 1, 0, {
		kind: 'p',
		html: 'You already know most of the room. The princess who will be queen sits with her sister — the groom’s mother — and does not try the chair. Across from the old man, a woman in Gaya silk watches her husband pour half a cup on the step. The marshal stands where he always stands: not quite at the table.',
		ko: '방 안의 대부분은 이미 아신다. 여왕이 될 공주는 언니 — 신랑의 어머니 — 옆에 앉아 있고, 자리는 앉아 보지 않는다. 늙은이 건너편, 가야 비단을 입은 여자가 남편이 잔의 반을 섬돌에 붓는 걸 본다. 대장군은 늘 서는 자리에 서 있다. 상 옆이 아니다.'
	});
	console.log('Munhee wedding: guest cameo sweep added.');
} else {
	console.log('Munhee wedding sweep already present.');
}

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('Wrote story.json');
