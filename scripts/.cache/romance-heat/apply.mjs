// Romance escalation pass (after the Chunchu–Munhee model): flirt → tease → past the limit → sex → aftermath.
// Maehwa (Pumsuk loses control; she wakes alone and Gumil is in the doorway), Suro (the walk round the palace),
// Ibiga (under the cloud). Idempotent: each episode is skipped once its marker line exists.
import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';
const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, chip) => (en, lines) => ({ kind: 'dialogue', person, chip, lines, en });
const M = say('gumilwife', '#c98fb0');
const P = say('pumsuk', '#7aa8d8');
const G = say('gumil', '#6b7f9e');
const S = say('suro', '#e0a33c');
const H = say('heohwangok', '#d98fa8');
const R = say('jeonggyeon', '#c084fc');
const I = say('ibiga', '#1e4d9c');

const raw = fs.readFileSync(FILE, 'utf8');
const story = JSON.parse(raw);
const entry = (ch, title) => story.find((c) => c.id === ch).entries.find((e) => e.title === title);
const has = (e, text) => JSON.stringify(e.blocks).includes(text);
const find = (e, text) => {
	const i = e.blocks.findIndex((b) => (b.html ?? '').includes(text) || (b.en ?? []).join(' ').includes(text));
	if (i < 0) throw new Error(`${e.title}: no block with “${text}”`);
	return i;
};
const done = [];

/* ── Maehwa ─────────────────────────────────────────────────────────── */
const mae = entry('iron-will', 'Maehwa');
if (!has(mae, 'He gets to four.')) {
	for (const b of mae.blocks) {
		if (b.kind !== 'p') continue;
		b.html = b.html.replace('He is twenty-four', 'He is twenty-one');
		b.ko = b.ko.replace('그는 스물넷이다', '그는 스물하나다').replace('그는 스물넷', '그는 스물하나');
	}
	const cup = mae.blocks[find(mae, 'Pumsuk talks to his cup.')];
	cup.html = cup.html.replace(' Then he does something he hasn’t done in five months.', '');
	cup.ko = cup.ko.replace(' 그러다 그는 다섯 달 동안 한 번도 안 한 일을 한다.', '');

	const tease = [
		p(
			'She doesn’t let go. She turns his hand over in hers like a coin she is checking, and finds it shaking.',
			'그녀는 놓지 않는다. 동전을 확인하듯 그의 손을 뒤집어 보고, 그 손이 떨리는 걸 알아낸다.'
		),
		M(['Your hand’s shaking, Guardian.', 'Is that the wind? Or is that your famous self-control?'], ['손이 떨리네요, 성주님.', '바람 때문이에요? 아니면 그 잘난 절제 때문이에요?']),
		P(['It is— the wind. The wind is cold.'], ['바람이— 바람이 차서 그렇소.']),
		M(['The stone’s warm. I told you.'], ['돌은 따뜻하다니까요. 말했잖아요.']),
		p(
			'She moves his hand to the inside of her wrist, where he can feel what her pulse is doing, and leaves it there for exactly one breath. Then she takes it back.',
			'그녀는 그의 손을 제 손목 안쪽으로 옮긴다. 맥이 뭘 하고 있는지 느껴지는 자리다. 딱 한 숨 동안 거기 둔다. 그러고는 도로 가져간다.'
		),
		P(['…That is not fair.'], ['…그건 공정하지 않소.']),
		M(['Nothing up here is fair. That’s why I come up.'], ['여기 위엔 공정한 게 하나도 없어요. 그래서 올라오는 거고.']),
		p(
			'She stands, shakes the shawl off her knees and stretches, slowly, like a woman with nowhere to be. The old green rides up at the waist. He looks. She lets him, and watches him do it.',
			'그녀가 일어나 무릎의 숄을 털고, 갈 데 없는 여자처럼 천천히 기지개를 켠다. 낡은 초록이 허리께로 말려 올라간다. 그는 본다. 그녀는 보게 두고, 그가 보는 걸 지켜본다.'
		)
	];
	const leave = [
		M(['Goodnight, Guardian.', 'Mind your self-control. I hear it’s what a man is measured by.'], ['주무세요, 성주님.', '절제 잘 챙기시고요. 사내는 그걸로 잰다던데.']),
		p(
			'She goes down the wall stair without hurrying, the butterfly in her fist, and does not look back. The True Bone stays on the parapet. He decides to count to ten. He gets to four.',
			'그녀는 서두르지 않고 성벽 계단을 내려간다. 주먹엔 금나비. 돌아보지 않는다. 진골은 성가퀴에 남는다. 열까지 세기로 한다. 넷에서 멈춘다.'
		),
		p(
			'He catches her on the landing under his own door: her wrist, then her waist, then the rest of her against the timber. He has never taken anything that wasn’t handed to him on a tray, and he doesn’t know how to do it gently. He doesn’t try. He pulls her up the last three steps and through the door with the cold lamp.',
			'그는 제 방 문 아래 층계참에서 그녀를 붙잡는다. 손목, 그다음 허리, 그다음 나머지 전부를 나무 벽에 대고. 쟁반에 받쳐 건네받지 않은 걸 가져 본 적이 없는 사내라, 살살 가져가는 법을 모른다. 해 보지도 않는다. 마지막 세 계단을 끌어 올려, 차가운 등잔이 있는 방 문 안으로 들인다.'
		),
		p('She laughs into his collar. She was counting too. She got to three.', '그녀가 그의 옷깃에 대고 웃는다. 그녀도 세고 있었다. 셋까지 셌다.'),
		M(['There you are.'], ['…거기 있었네.'])
	];
	const room = mae.blocks[find(mae, 'Your room’s the little one at the top of the stair.')];
	const closes = find(mae, 'She closes her hand over it.');
	mae.blocks.splice(closes + 1, mae.blocks.indexOf(room) - closes, ...tease, room, ...leave);

	const manners = find(mae, 'The lamp is too small for manners. The red sash comes off in one impatient pull, and the old green follows it. She is thirty-one');
	mae.blocks.splice(
		manners + 1,
		0,
		p(
			'He is not gentle, and she doesn’t ask him to be. He has her against the door before the bar has settled, then on the narrow mat, which was laid for one Guardian working late and complains about two. She puts his hands where she wants them, and every rule of the Hwarang yard leaves him at once. The first time he lasts about as long as a True Bone has ever waited for anything, which is to say not long. He hides his face in her neck. She laughs and pulls him back down by the hair.',
			'그는 살살 하지 않고, 그녀도 그러라고 하지 않는다. 빗장이 다 걸리기도 전에 그녀를 문에 붙이고, 그다음엔 좁은 요 위다. 늦게까지 일하는 성주 하나 눕자고 깐 요라, 둘이 되자 삐걱대며 투덜댄다. 그녀가 그의 손을 원하는 데 놓는다. 화랑 연무장에서 배운 법도가 한꺼번에 그를 떠난다. 처음엔 진골이 뭘 기다려 본 만큼밖에 못 버틴다. 말하자면 금방이다. 그는 그녀 목덜미에 얼굴을 묻는다. 그녀는 웃으며 그의 머리채를 잡아 도로 끌어내린다.'
		)
	);
	const slow = find(mae, 'Slow. Slow down.');
	mae.blocks.splice(
		slow + 1,
		0,
		p(
			'The second time she is on top and in no hurry at all, and she makes him watch her. He does. He has stopped being able to do anything else.',
			'두 번째엔 그녀가 위에 있고, 조금도 서두르지 않는다. 그리고 그에게 자기를 보게 한다. 그는 본다. 이제 다른 건 아무것도 못 한다.'
		)
	);
	const named = find(mae, '…Pumsuk.');
	mae.blocks.splice(named + 1, 0, P(['…Again. Please. I— again.'], ['…한 번 더. 부탁이오. 나는— 한 번 더.']), M(['Greedy.', '…Good.'], ['욕심쟁이네.', '…좋아.']));

	/* Morning: she wakes alone in his room, and her husband brings the count up the stair. */
	const dawn = find(mae, 'She leaves his room at grey dawn by the back stair.');
	const [leaves, rumour, answer, record] = mae.blocks.slice(dawn, dawn + 4);
	const drums = mae.blocks[dawn + 4];
	const day = mae.blocks[dawn + 5];
	const home = find(mae, 'Grey in the door-slit.');
	const slit = find(mae, 'They stand in the door-slit of morning');
	const talk = mae.blocks.slice(home + 1, slit + 1);
	if (drums.kind !== 'story' || day.kind !== 'day') throw new Error('Maehwa: unexpected blocks after the dawn rumour');
	leaves.html = 'She leaves his room at grey dawn by the back stair, past her husband, the butterfly in her fist. The well-post sees her anyway. The well-post sees everything.';
	leaves.ko = '그녀는 잿빛 새벽에 뒷계단으로 그의 방을 나선다. 남편 곁을 지나, 주먹엔 금나비를 쥐고. 그래도 우물가는 본다. 우물가는 다 본다.';
	day.label = 'NOON';
	day.ko = '정오';
	const noon = mae.blocks[slit + 1];
	noon.html = noon.html.replace('By noon she has a bundle', 'She has a bundle');
	noon.ko = noon.ko.replace('정오쯤 그녀는', '그녀는');
	const morning = [
		p(
			'Grey in the door-slit. She wakes alone. His side of the mat is cold, the ice-blue robe is gone from its peg, and the lamp has been out for hours. On the pillow where his head was, he has left the gold butterfly, as if it were a note.',
			'문틈에 잿빛. 그녀는 혼자 깬다. 요의 그쪽은 식었고, 얼음빛 푸른 겉옷은 횃대에서 사라졌고, 등잔은 꺼진 지 오래다. 그가 머리를 뉘었던 베개 위에 금나비가 놓여 있다. 쪽지라도 되는 것처럼.'
		),
		p(
			'Gumil is standing in the doorway. He has the tally in his hand: every sack in the stores, counted by dawn, as ordered. He climbed the stair to give it to the Guardian.',
			'문간에 검일이 서 있다. 손에 장부를 들고 있다. 곳간의 쌀가마 전부, 분부대로 새벽까지 센 것. 성주에게 건네려고 계단을 올라왔다.'
		),
		G(['Every sack. By dawn.', '…Commander.'], ['다 셌다. 새벽까지.', '…성주님.']),
		p('He says it to the empty half of the mat. Then he looks at the other half.', '그는 요의 빈 쪽에 대고 말한다. 그러고는 나머지 반쪽을 본다.'),
		G(['Where is he.'], ['어데 갔노.']),
		M(['Gone. Before I woke.', '…They always are.'], ['갔어. 내가 깨기도 전에.', '…다들 그래.']),
		p(
			'Down the stair, the Guardian of Daeya is sitting outside a door with a pink ribbon on it, waiting for his wife to wake up, so that he can lie to her first.',
			'계단 아래, 대야성 성주는 분홍 리본이 걸린 문 앞에 앉아 있다. 아내가 깨기를 기다리고 있다. 먼저 거짓말을 하려고.'
		),
		...talk,
		leaves,
		rumour,
		answer,
		record,
		drums,
		day
	];
	mae.blocks.splice(dawn, slit - dawn + 1, ...morning);
	done.push('Maehwa');
}

/* ── Suro ───────────────────────────────────────────────────────────── */
const suro = entry('chunchu-era', 'Suro');
if (!has(suro, 'So he walks her round the outside of it.')) {
	const start = find(suro, 'Somewhere between the tide line and the tent');
	const end = find(suro, 'Later she lies watching the width of his back');
	if (end !== start + 1) throw new Error('Suro: tent blocks moved');
	suro.blocks.splice(
		start,
		2,
		p(
			'After the lesson she still won’t come up to the palace. So he walks her round the outside of it.',
			'수업이 끝나도 그녀는 궁에 올라오지 않는다. 그래서 그는 궁 바깥을 돌며 그녀와 걷는다.'
		),
		p(
			'It is a timber wall, new enough to smell of resin. He built it, and he has never once walked its outside. Torches on the gate, dark everywhere else. Her brother follows at a polite distance, then at a less polite one, then turns round and goes to bed.',
			'송진 냄새가 아직 가시지 않은 새 나무 담이다. 그가 지었고, 바깥을 걸어 본 적은 한 번도 없다. 문에는 횃불, 나머지는 다 어둠. 오라비가 점잖은 거리를 두고 따라오다가, 덜 점잖은 거리로 물러나더니, 돌아서서 자러 간다.'
		),
		H(['So this is your palace.', 'From the outside.', 'Is the inside as nice, or should I keep my expectations where they are?'], ['이게 전하 궁이군요.', '바깥에서 보니.', '안도 이만큼 좋아요? 아니면 기대는 지금 자리에 둘까요?']),
		S(['…The inside has… a roof.'], ['…안에는… 지붕이 있소.']),
		H(['I have a roof. I came for the king.'], ['지붕은 저도 있어요. 전 임금님 보러 왔는데요.']),
		p(
			'She walks closer to him than the path needs. On the dark side of the wall, where the torches can’t see, her shoulder finds his arm and stays there. He forgets which way the gate is.',
			'그녀는 길이 필요로 하는 것보다 가까이 붙어 걷는다. 횃불이 닿지 않는 담 그늘 쪽에서, 그녀의 어깨가 그의 팔을 찾아 거기 머문다. 그는 문이 어느 쪽인지 잊는다.'
		),
		S(['You are… standing very close.'], ['…아주 가까이 서 있구려.']),
		H(['The ground is still moving, Majesty. I told you.', 'Hold on to something.'], ['땅이 아직 흔들린다니까요, 전하. 말씀드렸잖아요.', '뭐라도 잡으세요.']),
		p(
			'He holds on to her. She lets him find out what the purple silk has been keeping from the beach, a hand’s width at a time, and goes on walking, as if a king’s hand at her waist were weather.',
			'그는 그녀를 잡는다. 그녀는 자색 비단이 바닷가에 숨겨 온 것을 한 뼘씩 알아 가게 두고, 임금의 손이 허리에 있는 게 날씨라도 되는 양 계속 걷는다.'
		),
		p(
			'Halfway round, at the darkest corner, the walk stops being a walk. He is kissing the throat he will marry before anyone has told him he may, with her back to the wall of his own palace. It is the first thing the wall has ever been for.',
			'반쯤 돌았을 때, 가장 어두운 모퉁이에서 산책은 산책이기를 그만둔다. 그는 누가 허락하기도 전에 장차 혼인할 목에 입을 맞추고 있다. 그녀의 등은 그의 궁 담에 닿아 있다. 그 담이 생기고 처음으로 쓸모가 생긴다.'
		),
		H(['Not against a fence, Majesty.', 'Not even a royal one.'], ['담에 대고는 안 돼요, 전하.', '임금님 담이라도요.']),
		p(
			'She takes him by the collar back down the path to the tent by the water. Before anyone may say marriage, the lamp in the tent burns late.',
			'그녀가 그의 옷깃을 잡고 물가 천막까지 길을 되짚어 데려간다. 혼인이라는 말이 나오기도 전에, 천막의 등잔은 늦도록 꺼지지 않는다.'
		),
		p(
			'She lights the lamp herself. She turns, and he sees the curve of her hip catching lamp through the silk. Then she lets the purple go, all at once, the way she let her trousers go to the mountain, and watches him take it.',
			'등잔은 그녀가 직접 켠다. 그녀가 몸을 돌리자 비단 너머로 등잔불을 받은 허리선이 보인다. 그러고는 산에 바지를 내주던 것처럼, 자색을 한 번에 놓아 버린다. 그리고 그가 그걸 어떻게 받아 내는지 지켜본다.'
		),
		p(
			'He was a king this morning. He is not one now. She takes her time with him, sure of every move, a woman who crossed a sea and will not be hurried by a beach. He comes apart under her hands about as fast as he said he would. She does not let him be embarrassed about it. She starts again, and this time she tells him what to do in a language he doesn’t speak, and he understands every word.',
			'아침엔 임금이었다. 지금은 아니다. 그녀는 서두르지 않고, 손짓 하나하나에 망설임이 없다. 바다를 건너온 여자가 바닷가 하나에 쫓길 리 없다. 그는 자기가 말한 그대로, 그녀의 손 아래에서 금방 무너진다. 그녀는 그가 부끄러워하게 두지 않는다. 다시 시작한다. 이번엔 그가 모르는 말로 뭘 하라고 일러 주고, 그는 한 마디도 빼놓지 않고 알아듣는다.'
		),
		p(
			'Later she lies watching the width of his back while he trims the wick, and doesn’t hide what it does to her mouth.',
			'나중에 그가 심지를 다듬는 동안, 그녀는 누운 채 그의 넓은 등을 바라보고, 그게 제 입가에 어떻게 번지는지 감추지 않는다.'
		)
	);
	for (const im of suro.images ?? []) if (im.at === 'Two nights in a tent') im.at = 'the lamp in the tent burns late';
	done.push('Suro');
}

/* ── Ibiga and the Lady of the Right View (in the Suro episode) ─────── */
if (!has(suro, 'Rain falls upward.')) {
	const under = find(suro, 'Cloud covers the ridge. What happens under it is not for the song.');
	suro.blocks.splice(
		under,
		1,
		p(
			'He kneels. The cloud kneels with him, all down the ridge, filling the ravines one by one, the way water finds every low place in a field.',
			'그가 무릎을 꿇는다. 구름도 함께 꿇는다. 능선을 따라 내려가며 골짜기를 하나씩 채운다. 물이 들판의 낮은 데를 빠짐없이 찾아가듯이.'
		),
		R(['Slower, sky. A mountain is not taken in an afternoon.', '…Who told you to stop.'], ['천천히 하거라, 하늘아. 산은 한나절에 넘어가지 않는다.', '…누가 멈추라 했느냐.']),
		I(['You did. A breath ago.', '…I’ve stopped listening.'], ['네가. 한 숨 전에.', '…이제 안 들을래.']),
		p(
			'Cloud covers the ridge. The song stops there, out of politeness. The mountain doesn’t.',
			'구름이 능선을 덮는다. 노래는 예의 바르게 거기서 멈춘다. 산은 멈추지 않는다.'
		),
		p(
			'Mist goes into every fold of her and does not come out. Her pines bend all one way. A spring that has been dry since before there were people comes up out of the rock, hot. Somewhere under the cloud the Lady of the Right View gives an order and it is obeyed, then gives the opposite order, and that is obeyed too. Rain falls upward. Thunder rolls without any lightning, one long low sound, and it does not stop for a very long time.',
			'안개가 그녀의 굽이굽이로 들어가 나오지 않는다. 소나무들이 한쪽으로만 휜다. 사람이 생기기 전부터 말라 있던 샘이 바위를 뚫고 솟는다. 뜨겁다. 구름 아래 어딘가에서 정견모주가 명을 내리고, 그 명이 지켜진다. 그러고는 정반대의 명을 내리고, 그것도 지켜진다. 비가 위로 내린다. 번개 없는 천둥이 낮고 길게 울리고, 아주 오래 그치지 않는다.'
		)
	);
	done.push('Ibiga');
}

fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + (raw.endsWith('\n') ? '\n' : ''));
console.log(done.length ? `updated: ${done.join(', ')}` : 'already applied');
