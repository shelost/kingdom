import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));

function walk(blocks, fn) {
	for (const b of blocks || []) {
		fn(b);
		if (b.blocks) walk(b.blocks, fn);
	}
}
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

const forty = walkTop(story, 'Forty Fortresses');
if (!forty) throw new Error('Forty Fortresses not found');

const swaps = [
	[
		'She hasn’t slept. You can tell by the lamp. It has been dying since yesterday and nobody has trimmed it, because trimming it would mean the night is still going and she would rather the night be over.',
		'She hasn’t slept. You can tell by the lamp. It has been dying since yesterday. Nobody has trimmed it.',
		'그녀는 자지 않았다. 등잔을 보면 안다. 어제부터 죽어 가는데 아무도 심지를 깎지 않았다. 깎으면 밤이 아직 남았다는 뜻이니까. 밤은 끝났으면 한다.',
		'그녀는 자지 않았다. 등잔을 보면 안다. 어제부터 죽어 간다. 아무도 심지를 안 깎았다.'
	],
	[
		'You’re going to be in a place where you don’t get to.',
		'You’re not allowed.',
		'너는 고르면 안 되는 자리가 될 거야.',
		'너는 고르면 안 돼.'
	],
	[
		'I’ll take the hundred-and-ninth first today.',
		'I’ll win today.',
		'오늘은 백아홉을 먼저 가져가겠소.',
		'오늘은 내가 이기겠소.'
	],
	[
		'Neither of them is the girl at the match. Neither of them is the man with the club. They keep their hands. That is also a way of picking.',
		'Neither of them is the girl at the match. Neither of them is the man with the club. They keep their hands.',
		'둘 다 시합장의 그 아이가 아니다. 둘 다 채를 든 그 사내가 아니다. 손을 접어 둔다. 그것도 고르는 일이다.',
		'둘 다 시합장의 그 아이가 아니다. 둘 다 채를 든 그 사내가 아니다. 손을 접어 둔다.'
	]
];

let n = 0;
walk(forty.blocks, (b) => {
	for (const [en0, en1, ko0, ko1] of swaps) {
		if (b.html === en0) {
			b.html = en1;
			if (b.ko === ko0) b.ko = ko1;
			n++;
		}
		if (Array.isArray(b.en)) {
			const i = b.en.indexOf(en0);
			if (i >= 0) {
				b.en[i] = en1;
				if (b.lines?.[i] === ko0) b.lines[i] = ko1;
				n++;
			}
		}
	}
});

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log(`Polished ${n} strings.`);
