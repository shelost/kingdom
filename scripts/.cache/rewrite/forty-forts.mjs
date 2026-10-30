// One-shot: Forty Fortresses — beacon + straw-ridge vignettes, second map.
import fs from 'node:fs';
const f = 'src/lib/data/story.json';
let t = fs.readFileSync(f, 'utf8');
const blocks = [
	`{
						"kind": "map",
						"year": 642,
						"places": ["sabi", "daeya"],
						"caption": "Seven ridges, one abacus.",
						"ko": "일곱 능선, 주판 하나."
					}`,
	`{
						"kind": "scene",
						"label": "The Beacons",
						"ko": "봉화"
					}`,
	`{
						"kind": "p",
						"html": "He does not take a second fort. He takes Baekje\u2019s sleep instead. For seven nights his riders light fires on seven ridges, a different ridge every night, and the forty forts light their own beacons in answer, turn out their garrisons, and stand in the cold until dawn.",
						"ko": "두 번째 성은 취하지 않는다. 백제의 잠을 취한다. 이레 동안 밤마다 그의 기병이 일곱 능선에 불을 밝힌다. 밤마다 다른 능선. 마흔 성은 답으로 저희 봉화에 불을 붙이고, 수비병을 깨워, 새벽까지 추위에 세워 둔다."
					}`,
	`{
						"kind": "p",
						"html": "Beacon oil is not free. Neither is a garrison\u2019s breakfast after a false alarm. On the eighth night the ridges stay dark, and the forty forts sleep through the one rider who actually comes.",
						"ko": "봉화 기름은 공짜가 아니다. 오경보 뒤 수비병의 아침밥도 그렇다. 여드레째 밤 능선은 깜깜하다. 마흔 성은 그 사이로 정말로 오는 한 기병을 자면서 맞이한다."
					}`,
	`{
						"kind": "dialogue",
						"speaker": "The grain clerk",
						"gender": "m",
						"chip": "#8a8a94",
						"lines": [
							"한 성에 기름 세 북. 마흔 성. 이레 밤.",
							"대장이 산수 가르쳐 줘서 고맙다고 하오."
						],
						"en": [
							"Three drums of oil a fort. Times forty. Times seven nights.",
							"The marshal thanks you for the arithmetic."
						]
					}`,
	`{
						"kind": "scene",
						"label": "The Straw Ridge",
						"ko": "짚 능선"
					}`,
	`{
						"kind": "p",
						"html": "At the third fort he does not bring ladders. He brings straw. All night his men dress straw men in Silla blue and stand them along the ridge in the mist, and at dawn the fort shoots at an army that is not there.",
						"ko": "세 번째 성에는 사다리를 안 가져간다. 짚을 가져간다. 밤새 군사들이 짚사람에 신라 파랑을 입혀 안개 낀 능선에 세워 둔다. 새벽에 성은 없는 군대를 향해 쏜다."
					}`,
	`{
						"kind": "p",
						"html": "By noon the fort\u2019s arrow barrels are empty and the ridge is bristling. Yushin\u2019s men walk up in their socks again and collect the arrows out of the straw. The fort surrenders before supper, mostly out of embarrassment. Zhuge Liang borrowed arrows with boats. Yushin does it with socks.",
						"ko": "정오가 되면 성의 화살통은 비고 능선은 화살투성이가 된다. 유신의 군사들은 다시 양말 차림으로 올라가 짚에서 화살을 줍는다. 성은 저녁 전에 항복한다. 대체로 민망해서. 제갈량은 배로 화살을 빌렸다. 유신은 양말로 한다."
					}`
].join(',\n\t\t\t\t\t');
const marker = '"label": "Sabi"';
const si = t.indexOf(marker);
if (si < 0) throw new Error('sabi anchor missing');
const bs = t.lastIndexOf('\n\t\t\t\t\t{', si);
t = t.slice(0, bs + 1) + blocks + ',' + t.slice(bs + 1);
fs.writeFileSync(f, t);
JSON.parse(t);
console.log('done, json ok');
