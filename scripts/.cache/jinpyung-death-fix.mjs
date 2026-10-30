import { readFileSync, writeFileSync } from 'fs';

const FILE = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(FILE, 'utf8'));

let found = null;
for (const ch of story) {
	const e = ch.entries.find((x) => x.title === 'Harmony Council');
	if (e) {
		found = e;
		break;
	}
}
if (!found) throw new Error('no Harmony Council');

const html = (b) => b.html ?? '';
const B = found.blocks;
const at = (frag) => {
	const i = B.findIndex((b) => html(b).includes(frag));
	if (i < 0) throw new Error('missing: ' + frag);
	return i;
};

B[at('His daughters Dukman')].html =
	'His daughters Dukman and Chunmyung. Their cousin Sungman. Three left, and all of them in this room.';
B[at('His daughters Dukman')].ko =
	'딸은 덕만과 천명. 사촌은 승만. 남은 건 셋이고, 셋이 다 이 방에 있다.';

const cardI = B.findIndex((b) => b.kind === 'card' && b.person === 'jinpyung' && b.tab !== 'epitaph');
if (cardI < 0) throw new Error('no intro jinpyung card');
B.splice(cardI, 1);

B[at('He looks worse than anyone')].html =
	'He looks worse than anyone else in the room. You’ll meet the two of them properly in Bihyung. Not tonight.';
B[at('He looks worse than anyone')].ko =
	'이 방에서 제일 상한 얼굴이다. 그 둘의 일은 비형에서 제대로 본다. 오늘 밤은 아니다.';

const whisper = B[at('He beckons Dukman last')];
whisper.html =
	'He calls Dukman back. Whatever he tells her stays on the pillow. She looks at Yongsu when he is done.';
whisper.ko = '다시 덕만을 부른다. 그 말은 베개에 남는다. 다 듣고 나서 덕만은 용수를 본다.';

const lampI = at('He asks if the lamp has oil');
if (B[lampI + 1]?.tab === 'epitaph') throw new Error('epitaph already there');
B.splice(lampI + 1, 0, {
	kind: 'card',
	person: 'jinpyung',
	tab: 'epitaph',
	caption: 'King Jinpyung. Fifty-three years. He asked short questions, and listened to the whole answer.',
	ko: '진평왕. 쉰세 해. 짧은 물음을 던지고, 대답은 끝까지 들었다.'
});

const close = B[at('The lamp burns down')];
close.html = 'The lamp burns down. That night the pavilion lights.';
close.ko = '등잔이 잦아든다. 그날 밤, 정자에 불이 켜진다.';

writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
const cut = B.findIndex((b) => b.label === 'The Night Before');
console.log(
	B.slice(0, cut)
		.map((b, i) => `${i} ${b.kind} ${b.person || b.tab || b.label || (b.html || '').slice(0, 70)}`)
		.join('\n')
);
