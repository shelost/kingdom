// Hwangsanbeol: four explicit clashes (the fourth is Yushin himself, repulsed), the Baekje-annals line,
// a quiet talk between the generals on the black and white horses, and the 백승 epithet in Korean.
// Usage: node scripts/.cache/insert-hwangsan-talk.mjs
import fs from 'node:fs';
import { openStory, indexOf, insertAfter, guard, p, quote } from './story-edit.mjs';

const { story, entry, say, save } = openStory();
const e = entry('Yellow Mountain Fields');
guard(e, 'pair of go stones');

const clashes = e.blocks[indexOf(e, 'Silla comes on the first time in three columns')];
clashes.html =
	'Silla comes on the first time in three columns — Yushin centre, Heumsun left, Pumil right — and the three Baekje camps throw them back into their own dust. The second time the same. The third time the right road almost opens, and closes again on spears counted in the night. The fourth time Yushin rides at the head of the centre himself, on the white horse, and meets Hundred-Victories in the gap between the camps. Both armies stop to watch two men, which armies are not supposed to do. It lasts about as long as it takes a banner to fall and be picked up again, and then the white horse is going back the way it came with a red line along its shoulder, and the Sword of Silla is holding his left arm against his ribs.';
clashes.ko =
	'신라가 처음으로 세 길로 온다 — 가운데 유신, 왼쪽 흠순, 오른쪽 품일 — 백제 세 진영이 그들을 제 먼지로 되밀어낸다. 두 번째도 같다. 세 번째에 오른쪽 길이 거의 열렸다가, 밤에 세어 둔 창에 다시 닫힌다. 네 번째에는 유신이 몸소 흰 말을 타고 가운데 맨 앞에 서서, 진영과 진영 사이의 틈에서 백승을 만난다. 양쪽 군대가 두 사내를 구경하느라 멈춘다. 군대가 해서는 안 되는 일이다. 깃발 하나가 쓰러졌다가 다시 들릴 만큼의 시간이다. 그러고 나면 흰 말은 왔던 길로 돌아가고 있고, 그 어깨에 붉은 줄이 하나 그어져 있으며, 신라의 도검은 왼팔을 갈비뼈에 붙여 안고 있다.';

insertAfter(e, 'Silla comes on the first time in three columns', [
	quote(
		'He led five thousand men sworn to die out to Hwangsan and fought the Silla army. Four times they met, and four times he won; but his men were few and his strength gave out, and at last he was defeated. Gyebaek died there.',
		'결사대 오천을 거느리고 황산으로 나가 신라 군사와 싸워, 네 번 맞붙어 네 번 다 이겼으나, 군사는 적고 힘이 다하여 마침내 패하니, 계백이 거기서 죽었다.',
		'帥死士五千出黄山 與羅兵戰 四合皆勝之 兵寡力屈竟敗 堦伯死之',
		'Samguk Sagi (三國史記) bk. 28, Baekje Annals — King Uija, year 20'
	)
]);

insertAfter(e, 'Right has both, and less of each than an hour ago.', [
	p(
		'After the fourth time there is a lull, the kind both sides pretend is for water. Yushin rides out alone into the gap on the white horse, his sleeve tied off with his own sash, and stops at a distance where a bow would be bad manners. After a while the black horse comes out of the centre camp to meet him. Nobody is near enough to hear. The chronicle has it anyway, the way it has most things, from men who swore afterwards they had not been listening.',
		'네 번째가 끝나고 소강이 온다. 양쪽 다 물 마시는 시간인 척하는 그런 소강이다. 유신이 제 띠로 소매를 동여맨 채 흰 말을 타고 혼자 틈으로 나와, 활을 쏘면 무례가 될 거리에서 멈춘다. 한참 뒤 가운데 진영에서 검은 말이 마중을 나온다. 들을 만큼 가까이 있는 사람은 없다. 그래도 기록에는 남아 있다. 대부분이 그렇듯, 나중에 자기는 안 듣고 있었다고 맹세한 사내들에게서.'
	),
	p(
		'Black horse, white horse, nose to nose in the yellow dust. From either line they look like a pair of go stones someone has forgotten to play.',
		'검은 말, 흰 말, 누런 먼지 속에서 코와 코를 맞댄다. 어느 쪽 대열에서 보아도, 누가 두다 만 바둑돌 한 쌍 같다.'
	),
	say('yushin', ['오른쪽 진영 말이오. 밤에 옮겼소?'], ['Your right camp. You moved it in the night.']),
	say('gyebek', ['마흔 걸음이오.', '…알아채셨군.'], ['Forty paces.', '…You noticed.']),
	say('yushin', ['세 번째에야 알았소.', '…나이가 몇이오.'], ['On the third time. Not before.', '…How old are you.']),
	say('gyebek', ['마흔. 그쯤이오. 아무도 적어 두지 않았소.'], ['Forty. Near enough. Nobody wrote it down.']),
	say(
		'yushin',
		['나는 예순다섯이오.', '내가 마흔일 때 만났으면 내가 이겼을 거요.', '…아니. 못 이겼겠지.'],
		['Sixty-five.', 'If we had met when I was forty, I would have had you.', '…No. I would not have.']
	),
	p(
		'Gyebek looks at the tied sleeve and does not say anything polite about it.',
		'계백은 동여맨 소매를 본다. 그것에 대해 예의 바른 말은 하지 않는다.'
	),
	say('gyebek', ['네 번째엔 직접 나왔소. 안 그래도 됐을 텐데.'], ['You came yourself, the fourth time. You did not have to.']),
	say('yushin', ['애들이 봐야 했소. 할 수 있다는 걸.'], ['The boys needed to see it could be done.']),
	say('gyebek', ['할 수 있었소?'], ['Could it?']),
	say(
		'yushin',
		['나로는 안 되오. 오늘은.', '오만을 데리고 왔소. 아직 사만 몇은 남았고. 그대는 오천을 데리고 왔지.'],
		['Not by me. Not today.', 'I came with fifty thousand. I still have forty-some. You came with five.']
	),
	say('gyebek', ['넷이오. 이제.'], ['Four. Now.']),
	say('yushin', ['알고 있소. 나도 셀 줄 아오.'], ['I know. I can count too.']),
	say('gyebek', ['그럼 돌아가시오.'], ['Then go home.']),
	say('yushin', ['그대 먼저.'], ['You first.']),
	p('Neither of them laughs, but it is close.', '둘 다 웃지는 않는다. 웃을 뻔했을 뿐이다.'),
	say('gyebek', ['주점들 말이오.'], ['Your taverns.']),
	say('yushin', ['그게 왜.'], ['What about them.']),
	say('gyebek', ['아니오. 긴 겨울이 되겠다 싶어서.'], ['Nothing. They will have a long winter.']),
	p(
		'They turn the horses at the same moment, black and white, as if somebody had rehearsed it, and ride back to their counts. In the Silla line Heumsun is already looking at his son.',
		'둘은 같은 순간에 말머리를 돌린다. 검은 말과 흰 말, 누가 미리 맞춰 둔 것처럼. 그리고 각자의 셈으로 돌아간다. 신라 쪽 대열에서 흠순이 벌써 제 아들을 보고 있다.'
	)
]);

const collapse = e.blocks[indexOf(e, 'By the fourth charge the left camp')];
collapse.html = collapse.html.replace('By the fourth charge', 'By the fifth charge');
collapse.ko = collapse.ko.replace('네 번째 돌격쯤이면', '다섯 번째 돌격쯤이면');

const EPITHET = [
	['백전불패 계백', '백승계백'],
	['백전불패가', '백승이'],
	['백전불패는', '백승은'],
	['백전불패라', '백승이라'],
	['백전불패냐', '백승이냐'],
	['백전불패', '백승']
];
const rename = (s) => EPITHET.reduce((acc, [a, b]) => acc.split(a).join(b), s);
const walk = (o) => {
	if (Array.isArray(o)) return o.map(walk);
	if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, walk(v)]));
	return typeof o === 'string' ? rename(o) : o;
};
story.splice(0, story.length, ...walk(story));
save();

const PEOPLE = 'src/lib/people.ts';
const people = fs.readFileSync(PEOPLE, 'utf8');
fs.writeFileSync(PEOPLE, people.split("'백전불패 계백',\n\t\t\t'백전불패'").join("'백승계백',\n\t\t\t'백승'"));

console.log('Yellow Mountain Fields: clashes, annals quote, quiet talk, fifth charge, 백승 epithet');
