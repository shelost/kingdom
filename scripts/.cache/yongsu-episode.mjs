// Build the "Yongsu" episode: the true story, told in the Bihyung episode's own order,
// right after it. The King Muyeol flashback moves here; King Muyeol keeps a pointer.
import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const chapter = story.find((c) => c.entries.some((e) => e.title === 'Bihyung'));
const bh = chapter.entries.find((e) => e.title === 'Bihyung');
const km = chapter.entries.find((e) => e.title === 'King Muyeol');
if (chapter.entries.some((e) => e.title === 'Yongsu')) throw new Error('Yongsu already exists');
const flash = km.blocks.find((b) => b.kind === 'flashback');
const fb = flash.blocks;

const clone = (x) => JSON.parse(JSON.stringify(x));
const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, lines) => ({ kind: 'dialogue', person, en, lines });
const voice = (speaker, en, lines) => ({ kind: 'dialogue', speaker, en, lines });
const scene = (label, ko, jump) => ({ kind: 'scene', label, ko, ...(jump ? { jump } : {}) });
const jump = (year, en, ko) => ({ year, en, ko });
const story_ = (label, ko) => ({ kind: 'story', label, ko });

const idx = (blocks, needle) => {
	const i = blocks.findIndex((b) => JSON.stringify(b).includes(needle));
	if (i < 0) throw new Error('missing: ' + needle);
	return i;
};
/** Blocks from the one containing `from` through the one containing `to`, cloned. */
const span = (blocks, from, to) => clone(blocks.slice(idx(blocks, from), idx(blocks, to) + 1));

// ── The Cloud King's funeral, shared by both books ───────────────────────
const funeral = () => [
	scene('The eastern hills · the Cloud King’s tomb', '동쪽 언덕 · 구름왕의 무덤'),
	p(
		'They bury the Cloud King under a hill they build for him. It takes a thousand men a month, and it is still smaller than he was.',
		'구름왕은 그를 위해 쌓은 언덕 아래 묻힌다. 천 명이 한 달을 매달렸는데도, 그 사람보다는 작다.'
	),
	p(
		'The new king walks in front of the bier. He walks very straight. Twice he looks back at the coffin, as if it might have something to add.',
		'새 임금이 상여 앞에서 걷는다. 아주 꼿꼿이 걷는다. 두 번 관을 돌아본다. 거기서 무슨 말이라도 더 나올 것처럼.'
	),
	voice('A councillor', ['He doubled the country.', 'What does the son double?'], ['나라를 두 배로 만든 분이오.', '아들은 뭘 두 배로 만드나.']),
	say('geochilbu', ['The wine order, so far.', '…Give him a year. His father was a terror at twenty too.'], ['지금까진 술 주문이지.', '…한 해만 줘 보세. 그 아비도 스물엔 골칫덩이였어.']),
	voice('A councillor', ['His father was a terror at twenty with an army.'], ['그 아비는 스물에 군대를 끼고 골칫덩이였지.']),
	p(
		'At the top of the mound Saryun stops, turns round and looks at all of it: the hills with his father’s stones on them, the city, the six old men in a row. Then he asks for a cup. Somebody has one ready.',
		'봉분 꼭대기에서 사륜이 멈춰 돌아서서 전부를 내려다본다. 아버지의 비석이 선 산들, 도성, 줄지어 선 늙은이 여섯. 그러고는 잔을 달라 한다. 누군가 이미 들고 있다.'
	),
	say('sado', ['Not here, Saryun.'], ['여기선 아니다, 사륜아.']),
	say('jinji', ['Where else, Mother? He’s right there. He’d want one.'], ['그럼 어디서요, 어머니? 바로 저기 계신데. 아버지도 한 잔 원하실걸요.'])
];
if (!bh.blocks.some((b) => b.label === 'The eastern hills · the Cloud King’s tomb')) {
	bh.blocks.splice(idx(bh.blocks, 'He dies before the bell.') + 1, 0, ...funeral());
}

// ── Yongsu ───────────────────────────────────────────────────────────────
const Y = [];
const add = (...xs) => Y.push(...xs.flat());

add(
	p('Nobody kills the strange boy.', '이상한 애는 아무도 안 죽인다.'),
	p(
		'His mother told him that when he was eight. She was right for seventy years, which is longer than most mothers get to be right about anything.',
		'여덟 살 때 어머니가 해 준 말이다. 그 말은 일흔 해 동안 맞았다. 어머니들이 뭐가 됐든 맞는 기간으로는 꽤 긴 편이다.'
	),
	p(
		'You’ve heard the song. Now here is the same story with the lamps turned up. Same people. Same bridge. Same fox. It just has fewer ghosts in it, and more men.',
		'노래는 들었을 것이다. 이제 같은 이야기를 등잔 심지 올리고 다시 해 보자. 같은 사람들. 같은 다리. 같은 여우. 귀신이 좀 줄고, 사람이 좀 늘었을 뿐이다.'
	),
	scene('The bluff over the river · the night of the lotuses', '강 위 벼랑 · 연등 띄우던 밤', jump(642, 'The Night of the Lotuses…', '연등 띄우던 밤…')),
	span(fb, 'The palace ends at the bluff.', 'Chunchu laughs, because what else do you do.'),
	scene('The house by the stream · a night when Chunchu was seven', '개울가 집 · 춘추가 일곱 살이던 어느 밤', jump(610, 'Thirty-Two Years Earlier…', '서른두 해 전…')),
	span(fb, 'He was seven. He woke in the dark', 'In the morning his father was talking to the rafters again.'),
	scene('The bluff', '벼랑', jump(642, 'Back on the Bluff…', '다시 벼랑…')),
	span(fb, 'I heard you once. Through the door.', 'Then he tells it, for the first time in his life')
);

// Jinji
const deathbed = span(bh.blocks, 'The palace · the Cloud King’s last night', 'He dies before the bell.');
deathbed[0].jump = jump(576, 'Sixty-Six Years Earlier…', '예순여섯 해 전…');
add(story_('Jinji', '진지'), deathbed, funeral());
add(span(bh.blocks, 'The Harmony Council · three days later', 'Then, yes.'));
add(
	p(
		'He laughs. The song keeps that part. It leaves out that he stops.',
		'그가 웃는다. 노래는 거기까지 기억한다. 웃음이 멈췄다는 건 빼놓는다.'
	),
	p(
		'He sends the musicians out. Then the dancers. Then the guards, who go, because he is still the king. The doors are pulled shut from outside. A lamp goes over and nobody comes in to right it.',
		'그는 악사들을 내보낸다. 다음엔 무희들. 다음엔 호위들. 호위들은 나간다. 그는 아직 임금이니까. 문이 밖에서 닫힌다. 등잔 하나가 넘어지고, 아무도 세우러 들어오지 않는다.'
	),
	p(
		'From the yard you can see the paper screen. Two shadows on it. One of them is trying to get to the door. The other one is bigger.',
		'마당에서는 종이 병풍이 보인다. 그림자 둘. 하나는 문 쪽으로 가려 한다. 다른 하나가 더 크다.'
	),
	p(
		'The song says he let her go home. The song was written by people who liked him.',
		'노래는 그가 그녀를 집에 보내 줬다고 한다. 노래를 지은 건 그를 좋아하던 사람들이다.'
	),
	scene('The bluff', '벼랑', jump(642, 'Back on the Bluff…', '다시 벼랑…')),
	span(fb, 'The king they took the crown off. My father.', 'That is all he says about it, and all he will ever say.')
);
add(span(bh.blocks, 'The Harmony Council · the night drum', 'Jinji’s fall moved his whole branch off the trunk'));
add(
	scene('Saryang ward · the tenth night', '사량부 · 열흘째 밤', jump(579, 'That Autumn…', '그해 가을…')),
	p(
		'That same autumn the charcoal seller does not die of a fever. He takes one look at his wife, counts backwards on his fingers, and is gone by the next market day.',
		'그해 가을 숯장수는 열병으로 죽지 않는다. 아내를 한 번 보고, 손가락으로 거꾸로 날을 세어 보고, 다음 장날이 오기 전에 사라진다.'
	),
	p(
		'On the tenth night nobody knocks. Dohwa sits up anyway, in her mourning white, with a hand on her belly, and watches the door until dawn. She isn’t waiting for anyone. She just wants to see it stay shut.',
		'열흘째 밤엔 아무도 문을 두드리지 않는다. 도화는 그래도 상복 차림으로 배에 손을 얹고 앉아 새벽까지 문을 지켜본다. 누굴 기다리는 게 아니다. 그냥 그 문이 닫혀 있는 걸 보고 싶다.'
	),
	p(
		'The lane counts too. At the well the women stop talking when she comes, and start again behind her. Somebody spits. It lands near her feet, which in that lane counts as manners.',
		'골목도 날을 센다. 우물가 여자들은 그녀가 오면 말을 멈추고, 지나가면 다시 시작한다. 누가 침을 뱉는다. 발치 근처에 떨어진다. 그 골목에선 그게 예의다.'
	),
	voice(
		'Dohwa’s mother',
		['Tell them it was the king.', 'The dead one. Tell them he came back for you, the way he promised. A ghost they’ll forgive.'],
		['임금이라고 해.', '죽은 그 임금. 약속대로 널 찾아왔다고 해. 귀신이면 용서해 줄 거다.']
	),
	say('dohwa', ['He never promised anything, Mother.'], ['그 사람은 아무것도 약속 안 했어요, 어머니.']),
	voice('Dohwa’s mother', ['Then he can start now. He’s got nothing else to do.'], ['그럼 이제부터 하라지. 달리 할 일도 없을 텐데.']),
	p(
		'So the lane gets its story: a dead king at the door on the tenth night, seven days of coloured cloud, a ghost who kept his word. It’s a lovely story. People still spit. Just less.',
		'그렇게 골목은 이야기를 얻는다. 열흘째 밤 문 앞의 죽은 임금, 이레 동안의 오색구름, 약속을 지킨 귀신. 고운 이야기다. 사람들은 그래도 침을 뱉는다. 덜 뱉을 뿐이다.'
	),
	scene('Saryang ward · the birth', '사량부 · 해산', jump(580, 'The Next Spring…', '이듬해 봄…')),
	p(
		'The boy comes in spring, small and loud, in a hut with no cloud over it. One midwife. She takes her fee before she takes her coat off.',
		'아이는 봄에 온다. 작고, 시끄럽게. 구름 한 점 없는 오두막에서. 산파는 하나. 외투보다 삯을 먼저 받는다.'
	),
	span(bh.blocks, 'Three days after the birth, an old woman comes down', 'So the boy gets two names')
);

// Yongsu
add(
	story_('Yongsu', '용수'),
	scene('The edge of Surabol · the charcoal road', '서라벌 끝 · 숯 길', jump(588, 'Eight Years Later…', '여덟 해 뒤…')),
	p(
		'Surabol has an edge, where the tiled roofs give up and the fields start. The boy lives there. He carries charcoal into the city in a basket bigger than he is, and carries the money home, and the other boys carry stones.',
		'서라벌에도 끝이 있다. 기와지붕이 손을 놓고 밭이 시작되는 곳. 아이는 거기 산다. 자기보다 큰 바구니에 숯을 담아 성안으로 지고 가서, 돈을 지고 돌아온다. 다른 아이들은 돌을 지고 다닌다.'
	),
	voice('A boy with a stone', ['Ghost’s bastard! Where’s your daddy? Under the floor?'], ['귀신 새끼! 니 아빠 어딨냐? 마루 밑에?']),
	say('dohwa', ['Don’t fight them.', 'Be strange. Talk to something they can’t see. Nobody kills the strange boy.'], ['싸우지 마.', '이상하게 굴어. 쟤들 눈에 안 보이는 거한테 말을 걸어. 이상한 애는 아무도 안 죽여.']),
	say('yongsu', ['What do I say to it?'], ['뭐라고 해요?']),
	say('dohwa', ['Anything. Tell it about your day. It’s had a worse one.'], ['아무거나. 오늘 있었던 일. 그쪽은 더 험한 하루였을 테니.']),
	p(
		'The next morning he stops in the lane and has a long, polite conversation with the empty air beside the well. The stones stop. Within a month the other boys cross the road when they see him. He is eight, and it is the first thing that has ever worked.',
		'이튿날 아침 아이는 골목에 멈춰 서서 우물 옆 빈 허공과 길고 공손한 대화를 나눈다. 돌이 멈춘다. 한 달이 안 돼 다른 아이들은 그를 보면 길을 건넌다. 여덟 살, 처음으로 뭔가가 통했다.'
	),
	span(bh.blocks, 'Prince Suulbu’s house · supper', 'He hears every word about the list.'),
	scene('Saryang ward · the charcoal hut', '사량부 · 숯 오두막', jump(594, 'The Next Spring…', '이듬해 봄…')),
	p(
		'The record says a king met a boy on a river bank. There is no river bank. There is an old woman from the back rooms who goes to the king, and a king who goes to a hut.',
		'기록은 임금이 강둑에서 소년을 만났다고 한다. 강둑은 없다. 뒷방 노파가 임금에게 갔고, 임금이 오두막으로 왔을 뿐이다.'
	),
	p(
		'He comes at dusk in a groom’s borrowed coat, ducks under the lintel, and stops. A woman on a mat, very thin. A boy of fifteen holding a bowl for her. The boy looks up and does not bow, because nobody has ever taught him who to bow to.',
		'그는 해 질 녘에 마부 외투를 빌려 입고 와서, 문인방 밑으로 고개를 숙이고 들어오다 멈춘다. 거적 위에 아주 마른 여자. 그녀에게 사발을 들어 주는 열다섯 살 소년. 소년이 올려다보고도 절하지 않는다. 누구한테 절하는지 가르쳐 준 사람이 없었으니까.'
	),
	span(bh.blocks, '…Who are your parents, boy?', 'That’ll do. You’re coming to the palace.'),
	say('dohwa', ['Sir.', 'Whoever you are. Keep him.'], ['나리.', '누구시든. 이 아이를 맡아 주세요.']),
	say('jinpyung', ['I know who his father was.', '…I’ll keep him. I promise.'], ['아이 아비가 누군지 압니다.', '…맡겠습니다. 약속하지요.']),
	say('dohwa', ['And you. Be strange.', 'Promise me.'], ['너도. 이상하게 굴어.', '약속해.']),
	p(
		'She dies that summer. On the ride back from the burial the king and the boy make up the river bank between them, the slumping earth, the voices, the bridle. The king is very good at it. If he hadn’t been a king he would have been a wonderful liar.',
		'그녀는 그해 여름에 죽는다. 장례에서 돌아오는 길에 임금과 소년은 둘이서 강둑을 지어낸다. 무너지는 흙, 목소리들, 말고삐. 임금은 아주 잘한다. 임금만 아니었으면 대단한 거짓말쟁이가 됐을 것이다.'
	),
	span(bh.blocks, 'The Moon Palace · the king’s small room', 'In public the king who brought him in never once interferes.')
);

add(
	scene('The king’s small room · baduk', '임금의 작은 방 · 바둑'),
	p(
		'Some nights the king sends for the madman to play baduk. One lamp. The door shut. Inside that room there is no madman, and nobody has ever told the steward.',
		'어떤 밤이면 임금은 미치광이를 불러 바둑을 둔다. 등잔 하나. 닫힌 문. 그 방 안에는 미치광이가 없다. 집사한테 그걸 말해 준 사람은 아무도 없다.'
	),
	say('jinpyung', ['You’re letting me win.'], ['일부러 져 주는군.']),
	say('yongsu', ['You’re letting me let you.'], ['져 주게 놔두시잖아요.']),
	say('jinpyung', ['…Do you know how many people in this palace call me by my name?', 'None. Call me Baekjung.'], ['…이 궁에서 내 이름 부르는 사람이 몇인지 아나?', '하나도 없어. 백정이라 불러.']),
	say('yongsu', ['…Baekjung?'], ['…백정?']),
	say('jinpyung', ['It sounded like a question.', 'Your father put me on that chair when I was ten. He tied my sleeves back so I wouldn’t trip on them.'], ['묻는 말 같군.', '네 아버지가 열 살 난 날 저 의자에 앉혔다. 넘어지지 말라고 소매를 묶어 줬지.']),
	say('yongsu', ['Was he kind?'], ['다정했어요?']),
	p('The king puts down a stone in the wrong place, on purpose or not.', '임금이 엉뚱한 자리에 돌을 놓는다. 일부러인지 아닌지.'),
	say('jinpyung', ['He was kind to me.', '…I’ve heard he wasn’t kind to everyone.'], ['나한텐 다정했지.', '…모두한테 그랬던 건 아니라더군.']),
	p('Neither of them says anything for a while. The boy wins the game. It is the only time he ever does.', '한동안 둘 다 아무 말이 없다. 소년이 그 판을 이긴다. 평생 그 한 번뿐이다.'),
	scene('The palace roof · the night of the plum wine', '궁 지붕 · 매실주 마시던 밤'),
	p(
		'The other place they talk is the roof of the east hall, which the king is not allowed on, so he goes there often. Plum wine. Legs over the edge. Below them the city, and the lamps in the Council’s windows.',
		'둘이 이야기하는 다른 자리는 동궁 지붕이다. 임금은 올라가면 안 되는 곳이라, 자주 올라간다. 매실주. 처마 끝에 걸친 다리. 발아래 도성, 그리고 화백들 창에 켜진 등불.'
	),
	say('jinpyung', ['Six old men.', 'They took your father. Every morning I count them, to see if any of them died in the night.'], ['늙은이 여섯.', '네 아버지를 끌어내린 자들이지. 아침마다 세어 본다. 밤새 누가 죽었나 하고.']),
	say('yongsu', ['So do I.'], ['저도 세요.']),
	say('jinpyung', ['…Then we’ll count together. It’ll go faster.'], ['…그럼 같이 세지. 빨리 끝나겠군.']),
	say('yongsu', ['You laugh too soon, cousin. When they say something clever. Laugh a beat late. Then they think you didn’t get it.'], ['형님은 너무 빨리 웃어요. 저쪽이 영리한 말 하면요. 한 박자 늦게 웃으세요. 그럼 못 알아들은 줄 알아요.']),
	say('jinpyung', ['Is that what you do?'], ['너는 그렇게 하나?']),
	say('yongsu', ['I’m doing it now.'], ['지금도 하고 있잖아요.']),
	p(
		'The king laughs, a beat late. It is the first lesson. He will be laughing late at the Council for thirty-eight more years, and none of them will ever work out why.',
		'임금이 한 박자 늦게 웃는다. 첫 수업이다. 그는 앞으로 서른여덟 해 동안 화백 앞에서 늦게 웃을 것이고, 화백 누구도 끝내 그 까닭을 알아내지 못할 것이다.'
	),
	span(fb, 'The Hwangchun reeds · a walk at night', 'He goes back through the culvert before the temple bell.'),
	span(bh.blocks, 'He is seventeen, and his cousin King Jinpyung', 'The men with gifts stop coming.'),
	span(bh.blocks, 'The king eats with his family when he can', 'I’m always thinking something. It’s the job.')
);
// the supper scene plate (with its 598 jump) belongs in front of that last span
const supperPlate = clone(bh.blocks[idx(bh.blocks, 'The king eats with his family when he can') - 1]);
Y.splice(idx(Y, 'The king eats with his family when he can'), 0, supperPlate);

// Chunmyung
const betrothal = span(bh.blocks, 'Four years later, the same table.', 'She doesn’t laugh. Then she very nearly does');
const betrothalPlate = clone(bh.blocks[idx(bh.blocks, 'Four years later, the same table.') - 1]);
add(story_('Chunmyung', '천명'), betrothalPlate, betrothal);
add(
	scene('The princesses’ room · that night', '공주들 방 · 그날 밤'),
	p('That night Chunmyung cries into her pillow with great efficiency, the way she does everything.', '그날 밤 천명은 베개에 대고 운다. 무슨 일이든 그렇듯, 아주 효율적으로.'),
	say('chunmyung', ['I’d rather marry the stream.'], ['차라리 개울한테 시집갈래.']),
	say('sunduk', ['The stream’s probably nicer.', '…Unni. Does he really talk to ghosts?'], ['개울이 더 착하겠다.', '…언니. 그 사람 진짜 귀신이랑 말해?']),
	say('chunmyung', ['He talks to everything except people.', 'Go to sleep, Dukman.'], ['사람 빼고 다 하고 말해.', '자, 덕만아.']),
	p('Dukman doesn’t go to sleep. She lies awake deciding that her sister’s madman is the most interesting thing that has ever happened to the family.', '덕만은 안 잔다. 깨어 누워서, 언니의 미치광이야말로 이 집안에 일어난 일 중 제일 재미있는 일이라고 결론 내린다.')
);
add(span(bh.blocks, 'The Sinwon temple ditch · night', 'Nobody asks why forty men nobody can name'));
add(span(fb, 'The Sinwon ditch · the night of the bridge', 'After the bridge, a miracle a season, all his.'));
add(span(bh.blocks, 'The Ghost Bridge · the next night', 'He comes back the next night. So does she.'));
add(
	p(
		'Behind the plum tree at the end of the bridge, a seven-year-old in a sleeping robe is watching all of it and memorising. Nobody in the family ever works out where Dukman learned to keep a secret. It was here.',
		'다리 끝 매화나무 뒤에서 잠옷 바람의 일곱 살 아이가 전부 지켜보며 외우고 있다. 덕만이 어디서 비밀 지키는 법을 배웠는지 집안 누구도 끝내 알아내지 못한다. 여기서였다.'
	)
);
const culvert = span(fb, 'Under the west wall · the night the princess followed', 'That is the night it stops being an arrangement.');
culvert.splice(
	idx(culvert, 'Chunmyung comes down the culvert in a maid’s coat') + 1,
	0,
	p(
		'The smell reaches her first. Smoke, wet straw, too many people in one room. A one-eyed man smiles at her, and she steps back into the water without meaning to.',
		'냄새가 먼저 닿는다. 연기, 젖은 짚, 한 방에 너무 많은 사람. 외눈 사내가 그녀에게 웃어 보이고, 그녀는 저도 모르게 물속으로 한 걸음 물러선다.'
	),
	say('chunmyung', ['These are traitors’ children.'], ['역적의 자식들이잖아.']),
	say('yongsu', ['They were six when their fathers became traitors.', 'Somebody wrote it next to their names. It took one brush.'], ['아비들이 역적이 됐을 때 이 애들은 여섯 살이었어요.', '누가 이름 옆에 적었죠. 붓질 한 번이었어요.'])
);
culvert.splice(
	idx(culvert, 'The old man shows her where his eye was.') + 1,
	0,
	p(
		'The first night she can’t look at the eye. The fifth night she brings salve for it. By the end of the month she is holding the baby so its mother can sleep, and doing the rice-cake sums in her head, and losing her temper at the price of lamp oil like a woman who lives here.',
		'첫날 밤 그녀는 그 눈을 쳐다보지 못한다. 닷새째 밤엔 연고를 들고 온다. 그달 끝 무렵엔 애 엄마가 잘 수 있게 아기를 안고 있고, 떡값 셈을 머릿속으로 하고, 등잔 기름값에 성을 낸다. 여기 사는 여자처럼.'
	)
);
add(culvert);
add(
	p(
		'They are very proper about it. On the bridge she sits a hand’s width from him. Every night the hand’s width gets smaller, and both of them pretend to be measuring something else.',
		'둘은 아주 점잖다. 다리 위에서 그녀는 그에게서 한 뼘 떨어져 앉는다. 밤마다 한 뼘이 줄어들고, 둘 다 다른 걸 재는 척한다.'
	),
	p(
		'At the top of the culvert, wet to the knees, she takes his collar in her fist to pull him up the last step, and then doesn’t let go of it.',
		'수로 꼭대기에서, 무릎까지 젖은 채로, 그녀가 마지막 계단에서 끌어올리려고 그의 옷깃을 움켜쥔다. 그러고는 놓지 않는다.'
	),
	say('chunmyung', ['You’re very quiet for a madman.'], ['미친 사람치고 되게 조용하네.']),
	say('yongsu', ['The stream told me to be careful with princesses.'], ['개울이 공주님은 조심하랬어요.']),
	say('chunmyung', ['The stream’s a coward.'], ['개울이 겁쟁이네.']),
	span(bh.blocks, 'Don’t come tomorrow.', 'It is the first thing he has said in eight years'),
	span(bh.blocks, 'The court is scandalised for a season.', 'The wedding is small, at the house by the stream.'),
	p(
		'At the gate, uninvited, a woman in a plain coat stands with a boy of seven by the hand. She is the High Councillor’s daughter, the one who ran north with a Gaya boy, and the boy has a wooden sword through his belt and is standing like a guard. Suulbu’s chair is carried past them twice. He does not look. The boy looks at everything. His name is Yushin.',
		'대문 밖에, 초대받지 않은 여자가 수수한 옷차림으로 일곱 살 사내아이 손을 잡고 서 있다. 가야 사내와 북쪽으로 달아났던 그 상대등의 딸이다. 아이는 허리에 나무칼을 차고 파수처럼 서 있다. 수을부의 가마가 그 앞을 두 번 지나간다. 그는 쳐다보지 않는다. 아이는 전부 쳐다본다. 이름은 유신이다.'
	),
	span(bh.blocks, 'The first night in the house by the stream', 'It is the only room in Surabol where he never once performs.')
);
add(span(fb, 'The storehouse · the night before the clerk', 'One man is not impressed.'));
add(span(bh.blocks, 'A month later Suulbu puts a servant behind the screen', 'He talks to walls, uncle. You talk to the Council.'));
add(span(fb, 'The Harmony Council · the cellar', 'He rides until the horse won’t.'));
add(
	p(
		'When he gets home Chunmyung puts him in the bath and sits on the floor beside it until morning. She doesn’t say a word. She is very good at that.',
		'집에 오자 천명은 그를 목욕통에 넣고 아침까지 그 옆 바닥에 앉아 있다. 한마디도 안 한다. 그런 걸 아주 잘한다.'
	),
	p(
		'The next morning the king hugs him in front of the whole hall. “I told them,” he says. Yongsu lets him. He never tells him either. That one is his to carry.',
		'이튿날 아침 임금은 온 조정 앞에서 그를 안는다. “내가 그렇게 말했잖나.” 용수는 가만히 있는다. 그에게도 끝내 말하지 않는다. 그건 그가 질 짐이다.'
	)
);

// Chunchu
add(
	story_('Chunchu', '춘추'),
	clone(bh.blocks[idx(bh.blocks, 'Spring comes early that year.') - 1]),
	span(bh.blocks, 'Spring comes early that year.', 'Spring and autumn. In the old books'),
	clone(bh.blocks[idx(bh.blocks, 'Chunchu is nine and mortified.') - 1]),
	span(bh.blocks, 'Chunchu is nine and mortified.', 'Chunchu decides his father is the strangest man in Silla.'),
	scene('The palace yard · the winter Chunchu was eleven', '궁 마당 · 춘추가 열한 살이던 겨울', jump(614, 'Two Years Later…', '두 해 뒤…')),
	span(fb, 'He was eleven, and there were five of them', 'He hated his father that winter'),
	clone(bh.blocks[idx(bh.blocks, 'Thirteen years later the goblin’s whelp') - 1]),
	span(bh.blocks, 'Thirteen years later the goblin’s whelp', 'He laughs, a beat late. The chair goes on.'),
	clone(bh.blocks[idx(bh.blocks, 'The little girl who asked whether the stream') - 1]),
	span(bh.blocks, 'The little girl who asked whether the stream', 'The next morning the east wing gets a new resident'),
	scene('The bluff', '벼랑', jump(642, 'Back on the Bluff…', '다시 벼랑…')),
	span(fb, 'You watched. That winter. Five of them, and you sang.', 'Go on. Your friend’s waiting.'),
	clone(bh.blocks[idx(bh.blocks, 'They are buried on the same day') - 1]),
	span(bh.blocks, 'They are buried on the same day', 'Then he says something to the water.')
);
const tableAt = idx(km.blocks, 'If you’ve been keeping both books');
add(km.blocks.slice(tableAt, tableAt + 2));
add(clone(bh.blocks[bh.blocks.length - 1]));

// ── The myth now hands off to the truth ──────────────────────────────────
bh.blocks[bh.blocks.length - 1] = p(
	'<b>That is the song. Now the truth. Same bridge, same fox, fewer ghosts. On a bluff over the river, a madman is about to stop being mad…!</b>',
	'<b>여기까지가 노래다. 이제 참말이다. 같은 다리, 같은 여우, 귀신만 조금 적다. 강 위 벼랑에서, 미치광이가 미치광이를 그만두려 한다…!</b>'
);

// ── King Muyeol keeps a pointer where the flashback was ──────────────────
const flashAt = km.blocks.indexOf(flash);
km.blocks.splice(
	flashAt,
	3,
	p(
		'You know what his father told him there. The lotuses went out to sea, and for one night the madman of Surabol was not mad.',
		'거기서 아버지가 무슨 말을 했는지 당신은 안다. 연등은 바다로 흘러갔고, 하룻밤 동안 서라벌의 미치광이는 미치지 않았다.'
	)
);

// ── Images: everything anchored in the old flashback, plus the shared history ──
const lc = (s) => s.toLowerCase();
const lands = (blocks, at) => blocks.some((b) => lc(JSON.stringify(b)).includes(lc(at)));
const flashSlots = km.images.filter((m) => m.at && lands(fb, m.at) && !lands(km.blocks, m.at));
km.images = km.images.filter((m) => !flashSlots.includes(m));
const images = [...flashSlots];
const seen = new Set(images.map((m) => m.tempImage));
for (const m of bh.images) {
	if (!m.at || seen.has(m.tempImage) || !lands(Y, m.at)) continue;
	const copy = { ...clone(m), id: 'ys-' + m.id.replace(/^bh-/, '') };
	delete copy.inset;
	images.push(copy);
	seen.add(m.tempImage);
}

const entry = {
	year: '576–653',
	tone: 'tragedy',
	subtitle: '용수',
	logline: { en: 'Nobody kills the strange boy.', ko: '이상한 애는 아무도 안 죽인다.' },
	thumbnail: 'km-cliff-no-goblins',
	badges: ['flag:silla'],
	title: 'Yongsu',
	place: 'surabol',
	flash: true,
	kinds: ['love', 'flashback'],
	images,
	blocks: Y
};
chapter.entries.splice(chapter.entries.indexOf(bh) + 1, 0, entry);

fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
console.log('Yongsu blocks', Y.length, 'images', images.length, '· King Muyeol blocks', km.blocks.length, 'images', km.images.length, '· Bihyung blocks', bh.blocks.length);
