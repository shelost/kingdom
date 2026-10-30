// One-shot: move Yumjong's death from Gyul to Jeon as a full battle scene + Bidam's curse.
import fs from 'node:fs';
const f = 'src/lib/data/story.json';
let t = fs.readFileSync(f, 'utf8');
const cutBlock = (marker) => {
	const idx = t.indexOf(marker);
	if (idx < 0) throw new Error('marker missing: ' + marker.slice(0, 50));
	const bs = t.lastIndexOf('\n\t\t\t\t\t{', idx);
	const be = t.indexOf('\n\t\t\t\t\t},', idx) + '\n\t\t\t\t\t},'.length;
	const block = t.slice(bs + 1, be); // without leading newline
	t = t.slice(0, bs) + t.slice(be);
	return block;
};
// Capture the four Gyul blocks (order: cut from last to first to keep offsets trivial — using fresh indexOf each time, order irrelevant)
const pDeath = cutBlock('Yumjong goes down in the outer ditch');
const dYum = cutBlock('don\u2019t make that face, Councillor');
const dBidam = cutBlock('"\u2026Yumjong."');
const pEyes = cutBlock('The quieter name on the banner goes first');
// Mourning callback left behind in Gyul
const callback = `{
						"kind": "p",
						"html": "Bidam still walks the rampart past the outer ditch every night, and every night he stops where Yumjong fell. Yumjong\u2019s black headband hangs from his wrist now. He has stopped explaining it to anyone.",
						"ko": "비담은 여전히 밤마다 바깥 도랑 앞 성가퀴를 걷고, 밤마다 염종이 쓰러진 자리에서 멈춘다. 염종의 검은 두건은 이제 그의 손목에 걸려 있다. 누구에게도 설명하지 않는다."
					},`;
const ladders = 'Don\u2019t stop on them, don\u2019t stop on the bodies, keep';
{
	const idx = t.indexOf(ladders);
	if (idx < 0) throw new Error('ladders anchor missing');
	const end = t.indexOf('},', idx) + 2;
	t = t.slice(0, end) + '\n\t\t\t\t\t' + callback + t.slice(end);
}
// Build the Jeon scene
const scene = [
	`{
						"kind": "scene",
						"label": "The Outer Ditch",
						"ko": "바깥 도랑"
					}`,
	`{
						"kind": "p",
						"html": "Yushin\u2019s captains probe the Radiance slope while the marshal sits at his father\u2019s bedside. Yumjong holds the outer ditch with the men he mustered himself, and the night fills with ladders.",
						"ko": "대장이 부친의 병상 곁에 앉은 틈에 유신의 장수들이 광명의 비탈을 찔러 본다. 염종은 손수 모아 온 군사들과 바깥 도랑을 지킨다. 밤이 사다리로 가득 찬다."
					}`,
	`{
						"kind": "p",
						"html": "They come up twice, and twice the ditch throws them back. The third time the blue line does not stop, and Yumjong steps into the gap with his spear level, shouting the word his men like best.",
						"ko": "두 번 올라오고, 두 번 도랑이 밀어낸다. 세 번째는 푸른 대오가 멈추지 않고, 염종이 창을 수평으로 들고 빈자리로 들어선다. 군사들이 제일 좋아하는 구호를 외치면서."
					}`,
	pDeath,
	dYum,
	dBidam,
	pEyes,
	`{
						"kind": "dialogue",
						"chip": "#7b5cd6",
						"person": "bidam",
						"lines": [
							"왕관이여! 순덕이여! 네 옥좌가 얼마짜린지 봐라. 조용한 놈들이 먼저 낸다.",
							"그리고 유신. 마당의 형제여. 함께 배운 창술로 오늘 밤 서로를 찔렀다. 와서 직접 값을 세어 봐라."
						],
						"en": [
							"Crown! Sunduk! Look what your throne costs. The quiet ones pay first.",
							"And you, Yushin. Brother of the yard. We learned the spear-drill together, and tonight we used it on each other. Come and count the cost yourself."
						]
					}`
].join(',\n\t\t\t\t\t');
const anchor = 'Will still be there tomorrow. So will I.';
{
	const idx = t.indexOf(anchor);
	if (idx < 0) throw new Error('jeon anchor missing');
	if (t.indexOf(anchor, idx + 1) >= 0) throw new Error('jeon anchor ambiguous');
	const end = t.indexOf('},', idx) + 2;
	t = t.slice(0, end) + '\n\t\t\t\t\t' + scene + ',' + t.slice(end);
}
fs.writeFileSync(f, t);
JSON.parse(t);
console.log('done, json ok');
