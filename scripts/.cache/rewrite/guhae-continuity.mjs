// One-shot: Guhae continuity (King Guhae pre-surrender, Kim Guhae after) + Kim-surname beat.
import fs from 'node:fs';
const f = 'src/lib/data/story.json';
let t = fs.readFileSync(f, 'utf8');
let n = 0;
const rep = (a, b) => {
	const c = t.split(a).length - 1;
	if (!c) console.log('MISS:', JSON.stringify(a.slice(0, 60)));
	t = t.split(a).join(b);
	n += c;
};
rep(
	'Kim Guhae promised his youngest son a kingdom. It seemed a safe promise. He had one.',
	'King Guhae promised his youngest son a kingdom. It seemed a safe promise. He had one.'
);
rep(
	'김구해는 막내아들에게 나라를 약속했다. 안전한 약속 같았다. 나라가 있었으니까.',
	'구해왕은 막내아들에게 나라를 약속했다. 안전한 약속 같았다. 나라가 있었으니까.'
);
rep('The smith bows anyway. To Guhae.', 'The smith bows anyway. To Kim Guhae.');
rep('대장장이는 그래도 절한다. 구해에게.', '대장장이는 그래도 절한다. 김구해에게.');
rep(
	'Guhae walks past them every morning on his way up the hill',
	'Kim Guhae walks past them every morning on his way up the hill'
);
rep('구해는 아침마다 언덕을 오르며 그들 곁을 지나고', '김구해는 아침마다 언덕을 오르며 그들 곁을 지나고');
// Surname beat: insert two dialogue blocks before Guhae's gratitude line.
const anchorLines = '"성은이 망극하옵니다... 폐하...!"';
if (!t.includes(anchorLines)) throw new Error('anchor missing');
const blockStart = t.lastIndexOf('{', t.indexOf(anchorLines));
const beat = `{
						"kind": "dialogue",
						"chip": "#2f6fd4",
						"person": "beopheung",
						"lines": [
							"…한 가지를 빼먹을 뻔했군.",
							"오늘부터 자네 집안은 김가다. 과인의 성을 쓰게."
						],
						"en": [
							"…I nearly forgot one thing.",
							"From this day your house is Kim. You will carry my own surname."
						]
					},
					{
						"kind": "dialogue",
						"person": "guhae",
						"lines": [
							"김…",
							"그렇다면 제 아들들은 임금과 같은 성을 쓰고 다니게 되는 것입니까."
						],
						"en": [
							"Kim…",
							"Then my sons will walk under the same name as the king."
						],
						"speaker": "🙇"
					},
					`;
t = t.slice(0, blockStart) + beat + t.slice(blockStart);
n += 1;
fs.writeFileSync(f, t);
console.log('done, replacements:', n);
