// One-shot: Buyeo episode — sun-god oddities, Daeso lead-up, three friends bonding.
import fs from 'node:fs';
const f = 'src/lib/data/story.json';
let t = fs.readFileSync(f, 'utf8');
const P = (en, ko) =>
	`{\n\t\t\t\t\t\t"kind": "p",\n\t\t\t\t\t\t"html": "${en}",\n\t\t\t\t\t\t"ko": "${ko}"\n\t\t\t\t\t}`;
const after = (anchor, block) => {
	const i = t.indexOf(anchor);
	if (i < 0) throw new Error('anchor missing: ' + anchor.slice(0, 50));
	if (t.indexOf(anchor, i + 1) >= 0) throw new Error('anchor ambiguous: ' + anchor.slice(0, 50));
	const end = t.indexOf('},', i) + 2;
	t = t.slice(0, end) + '\n\t\t\t\t\t' + block + t.slice(end);
};
// A. sun-god oddities after the fly-wing line
after(
	'before the bow fits his arm.',
	P(
		'Odd things happen around the sun\u2019s son, and the yard learns not to mention them. Lamps lean toward him in a still room. Deso\u2019s hounds leave their master for his feet. Once, at noon, his shadow points the wrong way, and the whole square looks elsewhere.',
		'태양의 아들 둘레에서는 이상한 일이 일어난다. 마당은 말하지 않기로 배운다. 바람 없는 방에서 등잔불이 그쪽으로 눕는다. 대소의 사냥개들이 주인을 버리고 그의 발치에 눕는다. 한번은 정오에 그의 그림자가 엉뚱한 쪽을 가리켰고, 마당 전체가 딴 데를 봤다.'
	)
);
// B1. ministers keep two counts, after "Only two come back talking"
after(
	'The third has already started a country in his head.',
	P(
		'The ministers start keeping two counts: the heir\u2019s arrows and the foundling\u2019s. Deso notices, and stops inviting Jumong on the hunts that matter. The excuse is different every time. The reason never is.',
		'신하들이 두 가지 셈을 시작한다. 태자의 화살과 주워 온 아이의 화살. 대소가 알아차리고, 중요한 사냥에는 주몽을 부르지 않기 시작한다. 핑계는 매번 다르다. 속내는 한결같다.'
	)
);
// B2. Deso counts men, after the grin line (bridges to the side room)
after(
	'Deso hates the price.',
	P(
		'Deso starts counting things: how many of his own men laugh at Jumong\u2019s jokes, how many ask the foundling to judge their shots. The count goes the wrong way. That is when the side room starts filling after lamps-out.',
		'대소는 세기 시작한다. 제 사람들 중 몇이 주몽의 농담에 웃는지, 몇이 주워 온 아이에게 제 활솜씨를 봐 달라는지. 셈은 엉뚱한 쪽으로 간다. 그때부터 등잔이 꺼진 뒤 곁방에 사람이 모이기 시작한다.'
	)
);
// C. friends' month + pact, after "By the end of the month they are his."
after(
	'By the end of the month they are his.',
	P(
		'The month teaches them each other\u2019s shapes. Oi eats half his millet and puts the other half in Jumong\u2019s bowl without a word. Mari asks why about everything until Jumong runs out of answers and starts inventing. Hyupbo cries the first night and lies about it for a year.',
		'한 달이면 서로의 결이 보인다. 오이는 제 기장 절반을 먹고 나머지를 말없이 주몽의 그릇에 담는다. 마리는 모든 것에 왜냐고 묻다가, 주몽의 답이 떨어지면 주몽이 지어내기 시작한다. 협보는 첫날 밤 울고, 일 년 내내 잡아뗀다.'
	) +
		',\n\t\t\t\t\t' +
		`{
						"kind": "dialogue",
						"person": "oi",
						"lines": [
							"죽일라 한다, 이 녀석아.",
							"알지?"
						],
						"en": [
							"They\u2019ll kill thee, lad.",
							"Tha knows that."
						]
					},
					{
						"kind": "dialogue",
						"person": "jumong",
						"lines": [
							"그럼 짐 빨리 싸고, 왜냐고 묻고, 남는 짐 드는 사람이 필요하지.",
							"남아. 셋 다."
						],
						"en": [
							"Then I need men who pack fast, ask why, and carry extra.",
							"Stay. All three of you."
						]
					}`
);
fs.writeFileSync(f, t);
console.log('done');
