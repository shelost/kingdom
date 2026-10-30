// One-shot: death-scene expansion (palace boy, Youngryu's end, Daeya shield-boy).
import fs from 'node:fs';
const f = 'src/lib/data/story.json';
let t = fs.readFileSync(f, 'utf8');
const after = (anchor, block) => {
	const i = t.indexOf(anchor);
	if (i < 0) throw new Error('anchor missing: ' + anchor.slice(0, 50));
	if (t.indexOf(anchor, i + 1) >= 0) throw new Error('anchor ambiguous: ' + anchor.slice(0, 50));
	const end = t.indexOf('},', i) + 2;
	t = t.slice(0, end) + '\n\t\t\t\t\t' + block + ',' + t.slice(end);
};
const P = (en, ko) =>
	`{\n\t\t\t\t\t\t"kind": "p",\n\t\t\t\t\t\t"html": "${en}",\n\t\t\t\t\t\t"ko": "${ko}"\n\t\t\t\t\t}`;
after(
	'dies looking west, as if the road might still be argued shut.',
	P(
		'A palace boy with his first spear stands it between himself and the door. It does not help. Yeon steps over him the way a man steps over a threshold, and somebody\u2019s son stays on the floor of the room he was told to guard.',
		'첫 창을 든 궁궐 소년이 창을 세워 자신과 문 사이를 막는다. 소용없다. 연은 문지방 넘듯 그를 넘어간다. 누군가의 아들이 지키라던 방 바닥에 남는다.'
	)
);
after(
	'May You live ten thousand years.',
	P(
		'The blade goes in under the ribs, the way the drill teaches, and the king folds over the Samhan dream like a man finishing a letter. His last breath moves the crown where it lies. It does not roll. Nothing in the room rolls. A hundred commanders are already down, and the boy at the door makes it a hundred and one.',
		'칼은 교본대로 갈빗대 아래로 들어간다. 임금은 편지를 끝내는 사람처럼 삼한의 꿈 위로 접힌다. 마지막 숨이 떨어진 왕관을 흔든다. 구르지는 않는다. 방 안의 아무것도 구르지 않는다. 지휘관 백이 이미 쓰러졌고, 문가의 소년이 백하나째가 된다.'
	)
);
after(
	'Yunchung turns his horse so the sun is behind him.',
	P(
		'A Silla shield-boy from the levy, fourteen, holds the gate road for the length of a song and dies with somebody else\u2019s spear in his hands. Nobody learns his village. The rope in the morning will not have his name on it either, because the rope only counts the living.',
		'징집된 신라 방패 소년, 열넷. 노래 한 곡 길이만큼 길목을 지키고, 남의 창을 쥔 채 죽는다. 고향 마을을 아는 사람이 없다. 아침의 밧줄에도 그의 이름은 없다. 밧줄은 산 사람만 세니까.'
	)
);
fs.writeFileSync(f, t);
JSON.parse(t);
console.log('done, json ok');
