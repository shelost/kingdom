// Gi (起): Chunchu's turn in two flashbacks, Bidam and Yushin as old yard friends,
// the Alchun exchange reversed, and an ending where Bidam decides on the rebellion.
// node scripts/.cache/aug/gi.cjs [--dry]
const { ep, at, log, insertAfter, insertBefore, remove, replace, finish } = require('./lib.cjs');

const T = 'Gi (起)';
const say = (person, en, ko) => ({ kind: 'dialogue', person, en, lines: ko });
const p = (html, ko) => ({ kind: 'p', html, ko });

// 1. Flashback: the Daeya pillar (642), right after Munhee packs.
insertAfter(T, /Then I will pack for more/, [
	{
		kind: 'flashback',
		year: '642',
		title: 'The pillar · 기둥',
		blocks: [
			p(
				'Three winters ago a rider came in from Daeya. Chunchu heard the news standing up. The fortress. His daughter. Her husband. He leaned on a pillar of the hall and did not move again until dark.',
				'세 해 전 겨울, 대야에서 말 탄 전령이 들어왔다. 춘추는 선 채로 소식을 들었다. 성. 딸. 사위. 그는 대청 기둥에 기대섰고, 해가 질 때까지 움직이지 않았다.'
			),
			{
				kind: 'quote',
				html: 'When Chunchu heard it, he stood leaning against a pillar all day without blinking. People and things passed before him and he did not see them. At last he said: “Alas! Is a grown man not able to swallow Baekje?”',
				ko: '춘추가 이를 듣고 기둥에 기대어 서서 종일 눈도 깜박이지 않았고, 사람과 물건이 앞을 지나가도 알아보지 못하였다. 이윽고 말하기를, “아! 대장부가 어찌 백제를 삼키지 못하겠는가!” 하였다.',
				hanja: '春秋聞之，倚柱而立，終日不瞬，人物過前而不之省。旣而言曰：「嗟乎！大丈夫豈不能呑百濟乎！」',
				source: 'Samguk Sagi (三國史記) bk. 5, Silla Annals — Queen Seondeok, yr. 11 (642), winter'
			},
			p(
				'Goguryeo answered him with a cell. Now he is trying the islands. Somewhere in him a list is being kept, one country to a line, and the last name on it is the biggest.',
				'고구려는 감옥으로 답했다. 이제 그는 섬나라를 두드린다. 그의 속 어딘가에 명단이 하나 있다. 한 줄에 한 나라씩. 맨 끝의 이름이 제일 크다.'
			)
		]
	}
]);

// 2. Flashback: thirty thousand men for the emperor (summer 645), after Kuromaro's warning.
insertAfter(T, /ask after a woman who finishes the emperor/, [
	{
		kind: 'flashback',
		year: '645',
		title: 'Thirty thousand · 삼만',
		blocks: [
			p(
				'Earlier that summer the emperor in Chang’an marched on Goguryeo himself. Chunchu talked the queen into lending him men. Silla did not have the men to lend. Baekje noticed.',
				'그해 여름, 장안의 황제가 몸소 고구려를 치러 나섰다. 춘추는 여왕을 설득해 군사를 빌려주게 했다. 신라에는 빌려줄 군사가 없었다. 백제가 그걸 알아챘다.'
			),
			{
				kind: 'quote',
				html: 'Summer, fifth month. Taizong of Tang marched on Goguryeo in person, and the queen raised thirty thousand troops to help him. Baekje took advantage of the gap and seized seven fortresses in the west of the country.',
				ko: '여름 5월, 당 태종이 친히 고구려를 치니, 왕이 군사 3만을 내어 이를 도왔다. 백제가 그 빈틈을 타 나라 서쪽의 일곱 성을 습격해 빼앗았다.',
				hanja: '夏五月，太宗親征高句麗，王發兵三萬以助之。百濟乘虛，襲取國西七城。',
				source: 'Samguk Sagi (三國史記) bk. 5, Silla Annals — Queen Seondeok, yr. 14 (645)'
			},
			say(
				'bidam',
				['Thirty thousand of our sons, Lord Chunchu. For another man’s war.'],
				['남의 전쟁에 우리 아들 삼만이라니요, 춘추 공.']
			),
			say(
				'chunchu',
				['Not a gift, Bidam. A loan.', 'Empires keep their ledgers longer than kings keep their thrones.'],
				['선물이 아니오, 비담 공. 빚이지.', '제국의 장부는 왕의 옥좌보다 오래가는 법이오.']
			),
			say(
				'bidam',
				['Leave your own field to plough another man’s, and it grows weeds by autumn.', 'Baekje is the weeds.'],
				['남의 밭 갈러 제 논을 비워 두면, 가을엔 잡초가 나오.', '백제가 그 잡초요.']
			)
		]
	}
]);

// 3. Bidam and Yushin at the Council: old yard friends, not a debate.
replace(T, (b) => b.kind === 'dialogue' && b.person === 'yushin' && /The sister of the queen you raised/.test(b.en.join(' ')), say(
	'yushin',
	['Bidam. Come on.', 'Same blood. Same house.', 'Thirteen years ago you put her sister on that chair yourself.'],
	['비담, 이 사람아.', '같은 피요. 같은 집안이고.', '열세 해 전에 그 언니를 저 자리에 올린 게 당신 아니오.']
));
replace(T, (b) => b.kind === 'dialogue' && b.person === 'bidam' && /A country is not a scoreboard/.test(b.en.join(' ')), say(
	'bidam',
	[
		'Which is exactly why I’m saying no, you Gaya ox.',
		'Don’t give me that face. A hundred and eight to a hundred and eight, remember? Neither of us ever got to be right for long.',
		'A country is not a scoreboard.',
		'And on a night when Lord Chunchu’s eyes turn toward Chang’an, you want another soft Sacred Bone on that chair? Then who sells this country?'
	],
	[
		'그러니까 더 반대하는 거다, 이 가야 황소야.',
		'그런 얼굴 하지 마. 백팔 대 백팔, 기억하지? 우리 둘 다 오래 이겨 본 적이 없어.',
		'나라는 점수판이 아니다.',
		'춘추 공이 장안으로 눈을 돌리는 이 밤에, 또 무른 성골을 저 자리에 앉히자고? 그럼 이 나라는 누가 팔아먹나.'
	]
));

// 4. Alchun believes Chunchu; Bidam is the one who warns.
replace(T, (b) => b.kind === 'dialogue' && b.person === 'alchun' && /who sits there\? Chunchu/.test(b.en.join(' ')), say(
	'alchun',
	['…And use your head. If Princess Seungman doesn’t take the throne, who sits there?', 'There’s one more royal neck in Surabol. Chunchu’s.'],
	['…그라고 머리 좀 써 봐라. 승만공주가 못 오르면 그 자리에 누가 앉노?', '서라벌에 왕족 목이 하나 더 있제. 춘추.']
));
replace(T, (b) => b.kind === 'dialogue' && b.person === 'bidam' && /Lord Chunchu says he will not/.test(b.en.join(' ')), say('bidam', ['Precisely.'], ['바로 그걸세.']));
replace(T, (b) => b.kind === 'dialogue' && b.person === 'alchun' && /most cunning man in Samhan/.test(b.en.join(' ')), say(
	'alchun',
	['Ah, he doesn’t want it. Told me so himself, over wine.', 'Laughed at the whole idea, he did.'],
	['에이, 지는 싫다 카더라. 술자리에서 지 입으로 그랬다.', '그 얘기 듣고 웃기까지 하던데.']
));
insertAfter(T, /Laughed at the whole idea/, [
	say(
		'bidam',
		['Chunchu is the most cunning man in Samhan…!', 'Never — not for one moment — believe a word that comes out of that mouth…!'],
		['춘추는 삼한에서 제일 교활한 자일세...!', '절대로, 한 순간도 그 입에서 나오는 말을 믿어선 안 되네...!']
	)
]);

// 5. The queen falls. "That night" (the headband) now follows this.
insertBefore(T, /takes the old black headband out of the chest/, [
	{ kind: 'scene', label: 'The Queen’s Chamber', ko: '여왕의 침전' },
	p(
		'Bidam hears it from a harbour clerk, which is the worst way to hear anything. Chunchu has sailed east. The queen signed the order herself. Nobody asked the Council.',
		'비담은 그 소식을 포구의 서기에게서 듣는다. 무슨 소식이든 듣기 가장 나쁜 경로다. 춘추가 동쪽으로 배를 띄웠다. 여왕이 손수 명을 내렸다. 화백에 물은 사람은 없다.'
	),
	p(
		'He finds her in the small hall, not the throne room. She is sitting very straight, the way people sit when they no longer trust themselves to lie down.',
		'그는 옥좌가 있는 정전이 아니라 작은 전각에서 그녀를 찾는다. 그녀는 아주 꼿꼿이 앉아 있다. 누우면 다시 못 일어날까 봐 겁나는 사람처럼.'
	),
	say(
		'bidam',
		[
			'…Why wasn’t this told to the Council?',
			'Lord Chunchu isn’t even a member of the Council… he’s just…',
			'(eyes widen) …your nephew…'
		],
		['…어째서 이 일을 화백에 알리지 않으셨습니까?', '춘추 공은 화백의 일원도 아닙니다… 그저…', '(눈이 커진다) …폐하의 조카일 뿐…']
	),
	say('sunduk', ['Lord Bidam… I-I need to lie down… (collapses)'], ['비담 공… 나, 나 좀 누워야겠네… (쓰러진다)']),
	say('bidam', ['(stunned) Y-Your Majesty! GUARDS! THE QUEEN IS DOWN!'], ['(얼어붙는다) 폐, 폐하! 게 누구 없느냐! 폐하께서 쓰러지셨다!']),
	p(
		'Physicians. Doors. By evening the palace has stopped answering questions.',
		'의원들. 닫히는 문들. 저녁이 되자 궁은 더는 물음에 답하지 않는다.'
	)
]);

// 6. The headband, then the Hwarang oath turned sour.
insertAfter(T, /the one troubling him would turn out to be the country/, [
	say(
		'bidam',
		[
			'As young Hwarang, they told us we’d be the future of this nation…',
			'to protect the Sacred Bone class…',
			'Bullshit…',
			'“Sacred Bone class”? You mean the two dying grandmas?'
		],
		['어린 화랑 시절, 우리가 이 나라의 미래라고들 했지…', '성골을 지키라고…', '개소리…', '“성골”? 죽어 가는 할망구 둘 말이냐?']
	)
]);

// 7. The Moon Palace gate.
insertBefore(T, (b) => b.kind === 'scene' && b.label === 'Yumjong', [
	{ kind: 'scene', label: 'The Moon Palace', ko: '월성' },
	p(
		'Nine days later the gate of the Moon Palace is still shut. The guards have orders to open it for no one. No one, it turns out, includes the Harmony Council.',
		'아흐레가 지나도 월성의 문은 닫혀 있다. 문지기들은 아무에게도 열지 말라는 명을 받았다. 그 아무에는 화백도 들어 있다.'
	),
	say(
		'bidam',
		[
			'WE’RE THE HARMONY COUNCIL! WHY CAN’T WE ENTER THE PALACE??',
			'WHAT AUTHORITY DO YOU HAVE?',
			'(pauses)',
			'SHE’S DEAD, ISN’T SHE?',
			'THE QUEEN IS DEAD, AND YOU’RE HIDING IT FROM THE PEOPLE!!',
			'DID CHUNCHU ORDER THIS?'
		],
		[
			'우리는 화백이다! 어째서 궁에 들어갈 수 없단 말이냐??',
			'너희가 무슨 권한으로 막는 게냐?',
			'(멈칫한다)',
			'돌아가신 게지?',
			'폐하께서 돌아가셨는데, 백성에게 숨기고 있는 게지!!',
			'춘추가 시킨 것이냐?'
		]
	),
	p(
		'The guards look at their spears. Chunchu is across the sea. His orders, apparently, are not.',
		'문지기들은 제 창끝만 본다. 춘추는 바다 건너에 있다. 그의 명은, 아무래도, 아닌 모양이다.'
	)
]);

// 8. Yumjong: the opening Bidam has been waiting for, and the decision last.
insertAfter(T, (b) => b.kind === 'card' && b.person === 'yumjong', [
	say(
		'yumjong',
		['The islands, now. Last summer it was Chang’an.', 'Your Lord Chunchu does get around.'],
		['이번엔 섬나라랍니다. 지난여름엔 장안이었고.', '춘추 공은 참 부지런도 하십니다.']
	),
	say('bidam', ['Chunchu wants absolute power…!'], ['춘추는 절대 권력을 원하는 거요...!']),
	say(
		'bidam',
		[
			'What’s the difference between the West and the East anyway?',
			'In both nations, their emperors cannot be removed by a vote.',
			'Their people live as slaves.'
		],
		['서쪽이나 동쪽이나, 대체 뭐가 다르오?', '두 나라 다 황제를 표결로 끌어내릴 수 없소.', '백성은 노비처럼 살고.']
	)
]);
const count = remove(T, (b) => b.kind === 'dialogue' && b.person === 'yumjong' && /^How many men, Councillor\?$/.test(b.en.join(' ')));
const paddy = remove(T, (b) => b.kind === 'dialogue' && b.person === 'bidam' && /A paddy is not planted in a morning/.test(b.en.join(' ')));
insertAfter(T, /as if testing the weight/, [
	{ ...count, en: ['So. How many men, Councillor?'], lines: ['그래서. 몇이나 됩니까, 상대등.'] },
	paddy,
	p(
		'Bidam sets the cup down. Chunchu is across the sea. The queen is behind a shut gate. The Council has no one left to ask. So, for the first time in his life, Bidam decides something without a vote.',
		'비담이 잔을 내려놓는다. 춘추는 바다 건너에 있다. 여왕은 닫힌 문 뒤에 있다. 화백은 더 물을 사람이 없다. 그래서 비담은 난생처음, 표결 없이 무언가를 정한다.'
	)
]);

// Harmony Council: the hundred-and-ninth bout, in friends' voices. Bidam is the elder.
replace('Harmony Council', (b) => b.kind === 'dialogue' && b.person === 'yushin' && /the hundred-and-ninth is mine/.test(b.en.join(' ')), say(
	'yushin',
	['Well stood.', 'Tomorrow on the yard, the hundred-and-ninth is mine.'],
	['잘 버텼소.', '내일 연무장에서, 백아홉째는 내 거요.']
));
replace('Harmony Council', (b) => b.kind === 'dialogue' && b.person === 'bidam' && /Come now, brother/.test(b.en.join(' ')), say(
	'bidam',
	['Ha. Listen to him.', 'You still owe me a jar from the hundred-and-eighth. Pay that first.', 'Today is the country’s business. Tomorrow you can lose to me again.'],
	['하. 이 사람 말하는 것 좀 보게.', '백여덟째 판 술 한 동이부터 갚아.', '오늘은 나라 일이고. 내일 또 지게 해 주지.']
));

// The episode must still end on its next-episode card.
const last = ep(T).blocks.at(-1);
if (!(last.kind === 'p' && /^<b>/.test(last.html))) throw new Error('Gi no longer ends on its card');
log.push(`  ${T} ends on: ${last.html.slice(0, 60)}`);
at(T, /Six eggs, falling out of the sky/);

finish();
