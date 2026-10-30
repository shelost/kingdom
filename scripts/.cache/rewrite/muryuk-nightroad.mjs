// One-shot: Muryuk's angle of the Night Road (Severing crossover).
import fs from 'node:fs';
const f = 'src/lib/data/story.json';
let t = fs.readFileSync(f, 'utf8');
const anchor = 'You just didn\u2019t know whose ditch it was.';
const i = t.indexOf(anchor);
if (i < 0) throw new Error('anchor missing');
if (t.indexOf(anchor, i + 1) >= 0) throw new Error('anchor ambiguous');
const scene = [
	`{
						"kind": "scene",
						"label": "The Night Road",
						"ko": "밤길"
					}`,
	`{
						"kind": "p",
						"html": "Muryuk rides the cut with Silla\u2019s commission folded inside his helm. Military governor of Sinju. The title fits the way the cone never will, which is to say it pinches. Below him, on the west road, fifty Baekje horse ride into Jinhung\u2019s arithmetic.",
						"ko": "무력은 신라의 임명장을 투구 속에 접어 넣고 패인 길로 탄다. 신주 군주. 관직은 투구처럼 맞지 않는다. 꽉 낀다는 뜻이다. 아래 서쪽 길로 백제 기병 쉰이 진흥의 셈 속으로 들어간다."
					}`,
	`{
						"kind": "p",
						"html": "He is first down into the cut, because the cone is the tallest thing on the ridge and hiding it is a habit he has not learned. The fallen king looks up and sees Gaya before he sees Silla. That is the whole of Muryuk\u2019s orders, arriving before he does.",
						"ko": "그는 맨 먼저 패인 길로 내려간다. 뿔투구가 능선에서 제일 크기 때문이다. 숨기는 버릇은 아직 못 배웠다. 쓰러진 임금이 올려다보고, 신라보다 먼저 가야를 본다. 그것이 무력의 명령 전부다. 그보다 먼저 도착한다."
					}`,
	`{
						"kind": "dialogue",
						"person": "muryuk",
						"lines": [
							"신주 군주 무력이다.",
							"앉으시오."
						],
						"en": [
							"Military governor of Sinju.",
							"Sit."
						]
					}`,
	`{
						"kind": "p",
						"html": "They sit the king on a camp stool. A Silla slave asks for the head, and the king refuses the slave\u2019s hand, and Muryuk says the slave\u2019s name once, the way a door closes. Dodo. He will remember the name longer than the annals do.",
						"ko": "임금을 야전의자에 앉힌다. 신라 노비가 목을 달라 하고, 임금은 노비의 손을 거부하고, 무력은 노비의 이름을 한 번 부른다. 문 닫히듯. 도도. 연대기보다 오래 기억할 것이다."
					}`,
	`{
						"kind": "p",
						"html": "The king unfastens his own knife. Muryuk does not look away, because looking away is a Silla habit and he is not Silla tonight. He is Gaya, watching a king die well, and taking notes for the day his own turn comes.",
						"ko": "임금이 제 칼을 푼다. 무력은 눈을 돌리지 않는다. 눈 돌리기는 신라 버릇이고, 오늘 밤 그는 신라가 아니다. 그는 가야다. 임금이 잘 죽는 것을 보고, 제 차례가 올 날을 위해 적어 둔다."
					}`
].join(',\n\t\t\t\t\t');
const end = t.indexOf('},', i) + 2;
t = t.slice(0, end) + '\n\t\t\t\t\t' + scene + ',' + t.slice(end);
fs.writeFileSync(f, t);
JSON.parse(t);
console.log('done, json ok');
