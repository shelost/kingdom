import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const entry = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Sadaham');
const B = entry.blocks;
if (B.some((b) => b.label === 'The yard · that spring')) throw new Error('already applied');

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const say = (person, en, lines) => ({ kind: 'dialogue', person, en, lines });
const extra = (speaker, en, lines) => ({ kind: 'dialogue', speaker, gender: 'm', chip: '#7f96b5', en, lines });
const S = (en, ko) => say('sadaham', en, ko);
const M = (en, ko) => say('mugwan', en, ko);

const firstDay = [
	p(
		'Mugwan has decided to be unimpressed by the hwarang. His father told him to keep his head down, his sword clean and his mouth shut, and he means to do all three.',
		'무관은 화랑 따위에 감탄하지 않기로 마음먹었다. 아버지는 고개 숙이고, 칼 깨끗이 하고, 입 다물라고 했다. 셋 다 할 생각이다.'
	),
	p(
		'The yard is new this year, and so is the idea. A hundred noble sons stand in rows in powder and silk, trying to look like they meant to come. One of them is not in a row. He is on the roof.',
		'올해 연무장은 새것이고, 그 생각도 새것이다. 귀한 집 아들 백 명이 분 바르고 비단 입고 줄지어 서서, 원해서 온 척을 하고 있다. 그중 하나는 줄에 없다. 지붕 위에 있다.'
	),
	extra('The yard master', ['You! Off the roof! Now!'], ['니! 지붕에서 내리온나! 당장!']),
	S(['In a moment!', 'From up here you can see all the way to the sea!'], ['쪼매만요!', '여서 보믄 바다까지 다 보입니더!']),
	p(
		'You cannot see the sea from anywhere in Surabol. Mugwan knows this. Everyone knows this. A hundred boys look up anyway, and Mugwan, who has decided to be unimpressed, looks up with them.',
		'서라벌 어디서도 바다는 안 보인다. 무관도 안다. 다 안다. 그래도 백 명이 고개를 든다. 감탄 안 하기로 한 무관도 같이 든다.'
	),
	p(
		'The boy on the roof jumps. He lands in the dirt a step from Mugwan, rolls, and comes up grinning, as if the ground had been in on it.',
		'지붕 위 소년이 뛰어내린다. 무관 한 걸음 앞 흙바닥에 떨어져 한 바퀴 구르더니, 땅이랑 미리 짠 것처럼 웃으며 일어선다.'
	),
	S(['You looked.', 'Everybody looked, but you looked longest. What’s your name?'], ['니 봤제.', '다 봤는데, 니가 제일 오래 봤다. 이름이 뭐꼬?']),
	M(['…There’s no sea.'], ['…바다 없다.']),
	S(
		['Not from here. Not yet.', 'Give me a year. I’m Sadaham. I’m going to be the best one in this yard.'],
		['여서는 아직 없지.', '일 년만 줘 봐라. 내 사다함이다. 이 연무장에서 내가 제일 잘나갈 끼다.']
	),
	M(['Everyone says that.'], ['다 그래 말한다.']),
	S(['Yes, but I’m going to be right.'], ['그래도 내는 맞을 끼다.'])
];

const spring = [
	scene('The yard · that spring', '연무장 · 그해 봄'),
	p(
		'Mugwan is the best sword in his family. On the third morning he finds out that is not the same as the best sword in the yard. He finds out flat on his back, with Sadaham’s wooden blade resting on his collarbone.',
		'무관은 집안에서 칼을 제일 잘 쓴다. 그게 연무장에서 제일이라는 말은 아니라는 걸, 사흘째 아침에 알게 된다. 등을 땅에 대고 누워서, 사다함의 목검을 쇄골에 얹은 채로.'
	),
	S(['Again.'], ['한 번 더.']),
	M(['You’ve won. Three times.'], ['니가 이겼다. 세 번.']),
	S(
		['I know. I want to see what you do on the fourth.', 'You keep your elbow in like your father’s watching. He isn’t. Hit me like he isn’t.'],
		['안다. 네 번째에 니가 우짜는지 볼라꼬.', '니 팔꿈치를 아부지가 보는 것맨치로 붙이고 있다. 안 본다. 안 보는 것맨치로 쳐 봐라.']
	),
	p(
		'On the fourth, Mugwan hits him. Sadaham sits down hard in the dust and laughs so loudly the yard master comes out to see who is dying.',
		'네 번째에 무관이 맞힌다. 사다함은 흙바닥에 털썩 주저앉더니, 누가 죽는 줄 알고 교관이 뛰어나올 만큼 크게 웃는다.'
	),
	S(['THERE he is!'], ['봐라, 거 있네!']),
	p(
		'It goes on like that all spring. Sadaham rides at night because the road is empty. He sings in the bath, badly, and makes the boys at the bottom of the list sing with him until they forget they are at the bottom. He gives his rice away, is hungry by noon, and doesn’t seem to mind. Mugwan keeps waiting for him to run out. He doesn’t.',
		'봄 내내 그렇다. 사다함은 길이 비었다고 밤에 말을 달린다. 목욕하면서 노래를 하는데, 못 부른다. 명단 맨 끝 아이들을 끌어다 같이 부르게 해서, 그 아이들이 자기가 끝인 걸 잊게 만든다. 자기 밥을 나눠 주고 점심때면 배가 고픈데, 상관도 안 하는 눈치다. 무관은 저게 언제 바닥나나 기다린다. 안 난다.'
	),
	S(['Ride with me.'], ['같이 가자.']),
	M(['Where?'], ['어데?']),
	S(['Haven’t decided. That’s the good part.'], ['안 정했다. 그기 재밌는 기다.']),
	M(['No.'], ['싫다.']),
	p('He says no eleven times that spring. He goes all eleven.', '그해 봄 무관은 열한 번 싫다고 한다. 열한 번 다 따라간다.')
];

const border = [
	scene('The Gaya border, a ford on the Hwang · autumn, 561', '가야 접경, 황강 나루 · 561년 가을'),
	p(
		'The second autumn, the yard sends twenty boys to ride the border with a real patrol. Nobody expects anything. The border has other ideas.',
		'두 번째 가을, 연무장은 소년 스물을 진짜 순찰대에 붙여 국경으로 보낸다. 아무도 별일 없을 줄 안다. 국경 생각은 다르다.'
	),
	extra(
		'A patrol sergeant',
		['Raiders at the ford! Gaya hill men— twenty, thirty—', 'Boys to the back! You hear me? To the BACK!'],
		['나루에 도적 떼다! 가야 산사람들, 스물, 서른—', '애들은 뒤로! 들리나? 뒤로 빠지라!']
	),
	p(
		'Halfway across the ford Mugwan’s horse takes an arrow in the shoulder and goes down sideways into the river, and Mugwan goes with it. The water is cold and full of hooves. He cannot find which way is up.',
		'강 한가운데서 무관의 말이 어깨에 화살을 맞고 옆으로 쓰러진다. 무관도 같이 처박힌다. 물은 차갑고, 말발굽 천지다. 어디가 위인지 모르겠다.'
	),
	p(
		'A hand finds his collar and drags him up into the air and the noise. It belongs to the one boy who was told to go to the back and turned round instead. Sadaham rides down the first man and cuts down the second, and he never lets go of Mugwan.',
		'손 하나가 그의 깃을 잡아 공기와 소음 속으로 끌어올린다. 뒤로 빠지라는 말을 듣고 오히려 돌아선 단 하나의 소년의 손이다. 사다함은 첫 번째 놈은 말로 받아 넘기고 두 번째 놈은 칼로 벤다. 그동안 무관을 한 번도 놓지 않는다.'
	),
	M(['You— you were told to go back—'], ['니— 뒤로 빠지라 캤잖아—']),
	S(['I did go back. You were back there.', 'That’s where I keep you. Hold on to the saddle.'], ['빠졌다. 니가 뒤에 있더라.', '니는 내가 거 둔다. 안장 꽉 잡아라.']),
	p(
		'The raiders break when the patrol reaches the bank. The sergeant, who has done this for twenty years, rides over to shout at the boy and finds he has nothing to say. That night Mugwan cannot stop shaking. Sadaham sits beside him and talks about horses until he stops.',
		'순찰대가 강둑에 닿자 도적들이 흩어진다. 이십 년을 이 일 한 하사가 소년을 혼내러 말을 몰고 오는데, 막상 와서는 할 말이 없다. 그날 밤 무관은 떨림이 안 멈춘다. 사다함이 옆에 앉아 멈출 때까지 말 이야기를 한다.'
	),
	scene('Mount Danseok · winter, 561', '단석산 · 561년 겨울'),
	p(
		'Winter is for mountains. The hwarang climb them, sleep on them, and sing at the top as if the mountain had asked. On the third day the snow gives way under Mugwan on a ledge, and for one long breath there is nothing beneath him at all.',
		'겨울은 산의 계절이다. 화랑은 산을 오르고, 산에서 자고, 산이 청하기라도 한 듯 꼭대기에서 노래한다. 사흘째 되는 날 바위 턱에서 무관의 발밑 눈이 꺼진다. 숨 한 번 길게 쉬는 동안, 발밑에 아무것도 없다.'
	),
	p(
		'Then there is a fist in his belt. Sadaham is flat on the ice, one arm round a pine root and the other holding his friend over the drop. He is laughing again, the idiot, because his face is full of snow.',
		'그다음 허리띠에 주먹이 걸린다. 사다함이 얼음 위에 납작 엎드려, 한 팔로는 솔뿌리를 감고 다른 팔로 낭떠러지 위의 친구를 붙들고 있다. 그리고 또 웃는다, 저 바보. 얼굴에 눈이 잔뜩 묻어서.'
	),
	S(['That’s twice!', 'I’m counting! Climb, I can’t feel my hand—'], ['이걸로 두 번이다!', '세고 있다! 올라온나, 손에 감각이 없다—']),
	M(['Then let go.'], ['그라믄 놔라.']),
	S(['Don’t be stupid. Climb.'], ['바보 같은 소리 하지 마라. 올라온나.']),
	p(
		'Afterward, by the fire, Mugwan watches him sleep, which is the only time Sadaham is ever still. Mugwan has met plenty of boys who are sure of things. This is the first one who makes him sure too. He doesn’t know yet what of. He thinks it might be everything.',
		'그 뒤, 모닥불 가에서 무관은 그가 자는 걸 본다. 사다함이 가만히 있는 건 잘 때뿐이다. 무관은 뭔가를 확신하는 아이들을 많이 봤다. 자기까지 확신하게 만드는 건 이 아이가 처음이다. 뭘 확신하는지는 아직 모른다. 어쩌면 전부일지도 모른다고 생각한다.'
	)
];

const gayaSave = [
	p(
		'Halfway up the street a spear takes Mugwan’s horse out from under him. He lands on his back in the mud with three men coming, and he has time to think, quite calmly, that this is how it ends: one horse behind.',
		'거리 중턱에서 창 하나가 무관의 말을 쓰러뜨린다. 무관은 진흙탕에 등으로 떨어지고, 세 놈이 달려온다. 무관은 꽤 담담하게 생각할 틈이 있다. 이렇게 끝나는구나, 말 한 마리 뒤에서.'
	),
	p(
		'It isn’t. Sadaham comes back down the street against his own charge, the whole Silla vanguard parting round him like water, and puts his horse between Mugwan and the spears.',
		'안 끝난다. 사다함이 자기 돌격을 거슬러 거리를 되짚어 내려온다. 신라 선봉 전체가 물처럼 그를 비켜 갈라지고, 그는 무관과 창들 사이에 말을 세운다.'
	),
	S(['Three!', 'Get up behind me. Hurry, I want that gate.'], ['세 번째다!', '뒤에 타라. 빨리, 내 저 문 갖고 싶다.']),
	p(
		'They take the gate together, two boys on one horse. Sadaham plants the white banner on it, and Mugwan holds the pole straight, because Sadaham’s hands are shaking and he will not admit it.',
		'둘은 말 한 마리에 타고 함께 문을 차지한다. 사다함이 그 위에 흰 깃발을 세우는데, 장대는 무관이 붙들어 바로 세운다. 사다함 손이 떨리는데, 본인은 절대 인정 안 하기 때문이다.'
	)
];

const roof = [
	p(
		'Near the end he asks to be carried outside. Sadaham carries him up the ladder onto the roof of the hall, the same roof, because Mugwan asks for it by name.',
		'끝 무렵, 무관은 밖으로 데려가 달라고 한다. 사다함은 그를 업고 사다리를 올라 화랑 집 지붕으로 간다. 그 지붕이다. 무관이 콕 집어 거기라고 했으니까.'
	),
	M(['…Well?', 'You said a year. It’s been three.'], ['…그래서?', '일 년이라 캤다. 삼 년 됐다.']),
	S(['Look. Past the hills. There.', '…There.'], ['봐라. 저 산 너머. 저기.', '…저기.']),
	p(
		'There is nothing past the hills but more hills and the first grey of morning. Mugwan looks for a long time anyway. He has never once been able to tell Sadaham he was wrong about anything that mattered.',
		'산 너머엔 산하고 새벽의 첫 잿빛뿐이다. 그래도 무관은 오래 본다. 중요한 일에서 사다함이 틀렸다고, 무관은 한 번도 말해 본 적이 없다.'
	),
	M(['…Yeah. I see it.'], ['…그래. 보인다.'])
];

const after = p(
	'Sadaham doesn’t shout. He sits on the roof with him until the sun is all the way up. Then he climbs down and tells the cooks there will be one less bowl. He says it very politely. That is how they know.',
	'사다함은 소리 지르지 않는다. 해가 다 뜰 때까지 지붕에서 그와 같이 앉아 있다. 그러고는 내려와서 부엌에 그릇 하나 덜 놓으라고 한다. 아주 공손하게 말한다. 그래서 다들 안다.'
);

const grief = [
	p(
		'On the fourth day he goes down to the river where they found the stones, and the boys who follow him hear him for the first time. It is not crying, exactly. It is the sound a horse makes when it has run too far. It goes on for a long time, and nobody goes near.',
		'나흘째 되는 날, 그는 돌을 찾았던 그 강가로 내려간다. 따라간 아이들은 그 소리를 처음 듣는다. 우는 거라고 하기는 어렵다. 너무 멀리 달린 말이 내는 소리 같은 것이다. 오래 이어지고, 아무도 다가가지 못한다.'
	),
	p('On the fifth day the king comes himself.', '닷새째에는 왕이 직접 온다.'),
	say('jinheung', ['Eat. That is an order.'], ['먹거라. 어명이다.']),
	S(['You told them, Majesty. If I die, it was my idea.', 'Write it down.'], ['마마께서 그러셨지예. 내 죽으면 내 생각이었다꼬.', '적어 두이소.']),
	p(
		'The king stands in the doorway for a while. Then he goes, and does not send anyone else.',
		'왕은 한동안 문간에 서 있다. 그러고는 돌아가, 아무도 다시 보내지 않는다.'
	)
];

const song = [
	scene('The Song of Sadaham', '사다함의 노래'),
	p(
		'One more thing came down from that year, in a manuscript that may or may not be what it says it is. It gives Sadaham a song, the Song of the Blue Bird. The book says he wrote it for a woman. The yard, which knew him, has always sung it for somebody else.',
		'그해에서 내려온 게 하나 더 있다. 진짜인지 아닌지 모를 필사본에 실려서. 거기엔 사다함의 노래가 하나 있다. 청조가, 파랑새의 노래. 책은 그가 한 여인에게 지어 줬다고 한다. 그를 알던 연무장은, 언제나 다른 사람을 위해 불렀다.'
	),
	{
		kind: 'quote',
		html: 'Blue bird, blue bird,<br>blue bird above the clouds,<br>why do you stay in my bean field?<br>Blue bird, blue bird,<br>blue bird of my bean field,<br>why fly back up into the clouds?<br>If you came, why not stay?<br>If you would go, why did you come?<br>Why make me weep for nothing,<br>ache and waste and die?<br>When I die, what ghost will I be?<br>When I die, I will be a guardian spirit.',
		ko: '파랑새야 파랑새야<br>저 구름 위의 파랑새야<br>어찌하여 나의 콩밭에 머무는가<br>파랑새야 파랑새야<br>너 나의 콩밭의 파랑새야<br>어찌하여 다시 날아들어 구름 위로 가는가<br>이미 왔으면 가지 말지<br>또 갈 것을 어찌하여 왔는가<br>부질없이 눈물짓게 하며<br>마음 아프고 여위어 죽게 하는가<br>나는 죽어 무슨 귀신 될꼬<br>나는 죽어 신병 되리',
		source: 'Hwarang Segi (花郞世紀), “Cheongjoga” (靑鳥歌), attributed to Sadaham; the manuscript’s authenticity is disputed'
	},
	p(
		'The yard still sings it at roll call. Two places in the front row stay empty.',
		'연무장은 지금도 점호 때 이 노래를 부른다. 맨 앞줄 두 자리는 지금도 비어 있다.'
	)
];

const card = B[B.length - 1];
const out = [];
for (const b of B) {
	const h = b.html ?? '';
	if (b === card) out.push(...song);
	if (h.startsWith('The yard is new this year')) {
		out.push(...firstDay.slice(0, 6), B.find((x) => x.kind === 'card' && x.person === 'sadaham'), ...firstDay.slice(6));
		continue;
	}
	if (b.kind === 'card' && b.person === 'sadaham') continue;
	if (b.kind === 'scene' && b.label === 'Surabol, the king’s hall · 562') out.push(...border);
	if (h.startsWith('Their first spring, the yard sends them')) out.push(...spring);
	if (h.startsWith('<b>Mugwan</b> dies of illness')) out.push(...roof);
	out.push(b);
	if (h.startsWith('He is fifteen, and he fights like it')) out.push(...gayaSave);
	if (h.startsWith('<b>Mugwan</b> dies of illness')) out.push(after);
	if (h.startsWith('Sadaham does not take food for seven days')) out.push(...grief);
}
entry.blocks = out;
fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
console.log(`Sadaham: ${B.length} → ${out.length} blocks`);
