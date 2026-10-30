/**
 * Jeon, second pass.
 * - Day 8: the falling star is the eastern star the two boys argued about. Yushin's kite climbs so high
 *   its fire hangs where the star was; both walls watch. The queen gives her doors for paper.
 * - Yumjong at the ditch, after Hector and Achilles: the refused pact, the three laps of the ditch,
 *   the turn, the feint on the left shoulder Bidam always mocked, the blade in the chest.
 *   Yushin closes his eyes and sends him home on a horse. Bidam receives him at the gate,
 *   mourns, then screams at the sky. Yushin grieves in the road.
 */
import { editStory, find } from '../story-ops.mjs';

const CHIP = { bidam: '#7b5cd6', yushin: '#4a8fe0', chunchu: '#D8258C', yumjong: '#8a68c9' };
const say = (person, en, ko) => ({ kind: 'dialogue', person, chip: CHIP[person], lines: ko, en });
const crowd = (speaker, en, ko, gender = 'm') => ({ kind: 'dialogue', speaker, gender, chip: '#6b7280', lines: ko, en });
const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });

editStory((story) => {
	let jeon;
	for (const c of story) for (const e of c.entries) if (e.title === 'Jeon (轉)') jeon = e;
	if (find(jeon, 'No bargains tonight.').length) {
		console.log('already applied');
		return false;
	}
	const b = jeon.blocks;
	const at = (frag) => {
		const hits = find(jeon, frag).filter((h) => h.list === b);
		if (hits.length !== 1) throw new Error(`${hits.length} hits for "${frag}"`);
		return hits[0].i;
	};

	/* ——— Day 8: the eastern star falls ——— */
	b.splice(
		at('On the eighth night a star falls toward'),
		1,
		p('On the eighth night the eastern star falls.', '여덟째 밤, 동쪽 별이 떨어진다.'),
		p(
			'Not a shooting star. Those come and go, and nobody writes them down. This is the big one, low in the east, the one two boys used to argue about on a hill. It comes loose, slides down the sky with a tail like a torn sleeve, and goes out somewhere past the west wall of the Moon Palace. Both camps see it. Both camps stop talking.',
			'별똥별이 아니다. 그런 건 왔다 가고, 아무도 적어 두지 않는다. 이건 동쪽 낮은 하늘의 그 큰 별이다. 두 소년이 언덕 위에서 두고 다투던 그 별. 그것이 떨어져 나와, 찢어진 소매 같은 꼬리를 달고 하늘을 미끄러져 내려가, 월성 서쪽 담 너머 어딘가에서 꺼진다. 양쪽 진영이 다 본다. 양쪽 진영이 다 말을 멈춘다.'
		),
		p(
			'On the palace wall, Chunchu has stopped halfway through a sentence about rice.',
			'월성 성벽 위에서, 춘추는 쌀 이야기를 하다 말고 멈춰 있다.'
		),
		say('chunchu', ['Brother.', 'That was ours.'], ['형님.', '저거 우리 별 아입니꺼.']),
		say('yushin', ['…It was a planet.'], ['……그건 행성이라 안 캤나.']),
		say(
			'chunchu',
			['Then a planet has just fallen on my aunt’s palace. You can explain the difference to the soldiers.'],
			['그라믄 방금 행성이 이모님 궁에 떨어진 기네예. 그 차이는 형님이 군사들한테 설명하이소.']
		),
		p(
			'Across the field the Radiance wall begins to roar. Bidam does not invent the omen. He only names it in a useful direction.',
			'들판 건너 명활성 성벽이 함성을 지르기 시작한다. 비담이 징조를 지어낸 건 아니다. 쓸모 있는 쪽으로 이름을 붙였을 뿐이다.'
		)
	);

	/* ——— The kite ——— */
	b.splice(
		at('He flies the kite from the palace dark'),
		1,
		p(
			'They build it in the queen’s own yard by torchlight, out of what a palace has: bamboo from the garden, and the oiled paper off the lattice doors of the hall where the queen lies listening. A steward objects. A maid comes out with the answer.',
			'연은 여왕의 뜰에서, 횃불 아래, 궁궐에 있는 것으로 만든다. 정원의 대나무, 그리고 여왕이 누워서 듣고 있는 전각의 살창에서 뜯어낸 기름 먹인 창호지. 한 내관이 막아선다. 시녀 하나가 대답을 들고 나온다.'
		),
		crowd('A maid', ['Her Majesty says take the doors.', 'She says she can do a little draught.'], ['폐하께서 문을 뜯어 가라 하십니더.', '바람 쪼매는 견디신다 하십니더.'], 'f'),
		p(
			'The scarecrow is a guard’s spare coat stuffed with straw and soaked in lamp oil. Somebody paints a face on it. Yushin makes them wipe it off.',
			'허수아비는 경비병의 여벌 웃옷에 짚을 채우고 등잔 기름에 적신 것이다. 누가 거기에 얼굴을 그린다. 유신이 지우게 한다.'
		),
		say('yushin', ['No face.', 'It’s a star.'], ['얼굴은 안 된다.', '별이다.']),
		p(
			'There is a west wind off the hills, the first useful thing heaven has done all week. Yushin takes the line himself. Four Hwarang hold the reel. He lights the scarecrow with his own torch and lets it go.',
			'서쪽 산에서 바람이 분다. 이번 주 들어 하늘이 처음으로 쓸모 있는 일을 한다. 유신이 손수 줄을 잡는다. 화랑 넷이 얼레를 붙든다. 그는 제 횃불로 허수아비에 불을 붙이고, 놓는다.'
		),
		p(
			'It climbs. One spool of line runs out, then a second knotted to the first, then the fishing line off every hook in the palace kitchens. The kite goes out of sight. The paper goes, the bamboo goes, the burning coat goes, and what is left is one small hard point of fire, higher than anyone has ever put anything in the sky.',
			'연이 오른다. 얼레 하나가 다 풀리고, 거기 이어 묶은 두 번째도 풀리고, 궁궐 부엌의 낚싯바늘마다 매달려 있던 낚싯줄까지 다 풀린다. 연이 보이지 않게 된다. 종이가 사라지고, 대나무가 사라지고, 불타는 웃옷이 사라지고, 남는 건 작고 단단한 불빛 하나. 사람이 하늘에 무언가를 올려 본 중에 가장 높은 데다.'
		),
		p('Then it stops. Low in the east. Exactly where the old star used to hang.', '그러고는 멈춘다. 동쪽 낮은 하늘. 옛 별이 걸려 있던 바로 그 자리.'),
		say('chunchu', ['…Brother.', 'You’ve put it back.'], ['……형님.', '도로 걸어 놓으셨네예.']),
		say('yushin', ['It’s a star tonight.'], ['오늘 밤만은 별일세.'])
	);
	b.splice(
		at('It’s going back up.') ,
		0,
		crowd(
			'On the palace wall',
			['It’s back.', 'It’s back up. Look at it. Look at it!', 'Told you it never came down inside.', 'You told me it came down on the kitchens.'],
			['돌아왔다.', '도로 올라갔다. 저거 봐라. 저거 좀 봐라!', '안에 안 떨어졌다 캤제.', '니는 부엌에 떨어졌다 캤다 아이가.']
		)
	);
	b.splice(
		at('It’s going back up.') + 1,
		0,
		crowd('A boy on the Radiance wall', ['Can people do that?', 'Can people put a star back?'], ['저거 사람이 할 수 있는 기가?', '사람이 별을 도로 걸 수 있나?']),
		p(
			'Nobody on either wall can say what it is. Both walls decide what it means. For one night the sky is on the queen’s side, and in a siege one night is a long time.',
			'어느 성벽에서도 그게 뭔지 말할 수 있는 사람은 없다. 두 성벽 다 그게 무슨 뜻인지는 정해 버린다. 하룻밤 동안 하늘은 여왕 편이다. 그리고 포위전에서 하룻밤은 긴 시간이다.'
		)
	);

	/* ——— The ditch ——— */
	const from = at('Yushin rides back before light');
	const to = at('…Go home. Go home and count it.');
	b.splice(
		from,
		to - from + 1,
		p(
			'Yushin rides back before light, because the gate is still a gate. He hasn’t said a word since the house. Hansul doesn’t know the road yet, and Yushin lets him find it. Low in the east his star is still burning, a little smaller now.',
			'유신은 동트기 전에 돌아간다. 성문은 여전히 성문이니까. 그 집을 나선 뒤로 한마디도 하지 않았다. 한슬은 아직 이 길을 모른다. 유신은 녀석이 알아서 찾게 둔다. 동쪽 낮은 하늘에서 그의 별이 아직 타고 있다. 조금 작아졌다.'
		),
		p(
			'Where the south road crosses the outer ditch, there are torches across it. Twenty black headbands, and in the middle a mild man on foot, leaning on a spear like a walking stick.',
			'남쪽 길이 바깥 도랑을 건너는 자리에, 횃불이 길을 막고 있다. 검은 머리띠 스물. 그 한가운데, 순해 보이는 사내 하나가 창을 지팡이처럼 짚고 서 있다.'
		),
		say('yumjong', ['Marshal.', 'My condolences. I mean it. We heard at supper.'], ['대장군.', '삼가 조의를 표합니더. 진심입니더. 저녁 먹다 들었지예.']),
		say('yushin', ['Move your men.'], ['길 비키게.']),
		say(
			'yumjong',
			['The Councillor said let you go home. He’s a gentleman, the Councillor.', 'He never said a word about letting you come back.'],
			['상대등께서 집에는 보내 드리라 카셨지예. 신사시거든요, 우리 상대등은.', '돌아오는 길 얘기는 한마디도 안 하셨습니더.']
		),
		say('yushin', ['Yumjong. Not tonight.'], ['염종. 오늘 밤은 아니네.']),
		say('yumjong', ['Tonight’s the only night you’ve come out alone.'], ['대장군이 혼자 나온 밤은 오늘뿐인데예.']),
		crowd('Twenty black headbands', ['Gaya!', 'Gaya dog! Back to your cart!'], ['가야!', '가야 개야! 니 수레로 돌아가라!']),
		say(
			'yumjong',
			['Shh. Manners.', 'One thing first, Marshal. Between gentlemen. Whoever falls, the other sends him home.', 'Not to the dogs. Home.'],
			['쉿. 예의 좀 차리라.', '하나만 먼저 정하입시더, 대장군. 점잖은 사람끼리. 누가 쓰러지든, 남은 쪽이 집에 보내 주기로.', '개한테 말고. 집에.']
		),
		say('yushin', ['No bargains tonight.'], ['오늘 밤은 흥정 없네.']),
		say(
			'yumjong',
			['…Pity.', 'How did the old man go, then, Marshal? They say at the end a man talks the way his mother did.'],
			['……아깝네예.', '어르신은 어떻게 가셨습니꺼, 대장군? 사람이 마지막엔 지 어매 말투로 돌아간다 카던데.']
		),
		p(
			'Yushin gets down. He leaves the rein on the saddle, and the grey stands where it is left, as if it already knows this is not a night for wandering.',
			'유신이 말에서 내린다. 고삐는 안장에 걸쳐 둔다. 회색 말은 둔 자리에 그대로 선다. 오늘 밤은 돌아다닐 밤이 아니라는 걸 벌써 아는 것처럼.'
		),
		p(
			'Nobody has ever noticed Yumjong. It turns out he has spent thirty years of mornings with a spear where nobody was looking. The first thrust is faster than it has any right to be. It opens Yushin’s sleeve from wrist to elbow, and something small and grey drops out of it into the ditch.',
			'염종을 눈여겨본 사람은 아무도 없었다. 알고 보니 그는 아무도 안 보는 데서 삼십 년 아침을 창과 보냈다. 첫 찌르기가 터무니없이 빠르다. 유신의 소매가 손목부터 팔꿈치까지 갈라지고, 작고 잿빛인 무언가가 도랑으로 떨어진다.'
		),
		p(
			'Yushin doesn’t look down. Something in his face does, and the twenty see it. He comes through them the way the river comes through a weir. Torches go into the ditch and hiss. Black headbands go up the slope. In the time it takes to say it, there are no twenty. There is a mild man with a spear, and the marshal.',
			'유신은 내려다보지 않는다. 대신 그의 얼굴 속 무언가가 내려앉는다. 스물이 그걸 본다. 그는 보를 넘는 강물처럼 그들 사이를 뚫고 지나간다. 횃불들이 도랑에 떨어져 치익 소리를 낸다. 검은 머리띠들이 비탈 위로 달아난다. 말 한마디 할 동안에 스물은 없다. 창을 든 순한 사내 하나와, 대장군이 있을 뿐이다.'
		),
		p(
			'Yumjong is brave for exactly as long as he has twenty men. Then he runs. Along the ditch, in the dark, under the Radiance wall, with the marshal behind him not running but walking, the way you walk after a horse you know will tire. The length of the ditch. Back. Once more. Up on the wall the sentries find their torches and start shouting for the Councillor.',
			'염종의 용기는 딱 스물이 곁에 있는 동안만 간다. 그러고는 달린다. 어둠 속에서, 도랑을 따라, 명활성 성벽 밑으로. 대장군은 그 뒤를 뛰지 않고 걸어서 따라간다. 지칠 줄 아는 말을 쫓아갈 때처럼. 도랑 끝까지. 되돌아서. 한 번 더. 성벽 위의 보초들이 횃불을 찾아 들고 상대등을 부르기 시작한다.'
		),
		p(
			'Somewhere in the far west, a blind poet once sang this lap of a wall, with a city and a chariot in it. Yushin has never heard of him. He is about to sing it differently.',
			'저 먼 서쪽 어딘가에서, 눈먼 시인 하나가 성벽을 도는 이 장면을 노래한 적이 있다. 거기엔 도시가 하나 있었고 전차가 하나 있었다. 유신은 그런 시인을 들어 본 적이 없다. 그는 이 노래를 다르게 부르려는 참이다.'
		),
		p('At the third turn Yumjong stops. He is a True Bone. He has just remembered.', '세 번째로 돌아설 때 염종이 멈춘다. 그는 진골이다. 방금 그게 생각났다.'),
		say('yumjong', ['No.', 'Not round a ditch. Not in front of the wall.'], ['아니.', '도랑 빙빙 돌다가는 아니지. 성벽 앞에서는.']),
		p(
			'He levels the spear, and this time he is good. He takes Yushin across the cheek. He takes him again along the ribs. Spear against ring-pommel sword, in the mud, in the dark, with the whole Radiance wall leaning over to watch.',
			'그가 창을 겨누고, 이번에는 제대로다. 유신의 뺨을 긋는다. 다시 갈비뼈를 따라 긋는다. 창과 환두대도가 진흙 속에서, 어둠 속에서 맞붙고, 명활성 성벽 전체가 몸을 내밀고 내려다본다.'
		),
		say('yumjong', ['The Councillor says you drop your left shoulder.'], ['상대등께서 대장군은 왼쪽 어깨를 떨군다 카시던데예.']),
		say('yushin', ['He’s said so for thirty years.'], ['삼십 년째 하는 소리네.']),
		p(
			'Yushin drops it. On purpose, for the first time in thirty years. The gap opens on his left like a door. Yumjong goes for the door with everything he has, and Yushin steps inside the spear with the old yard step, the one two boys of Class 51 learned together in the mud, and puts the blade into his chest.',
			'유신이 어깨를 떨군다. 삼십 년 만에 처음으로, 일부러. 그의 왼쪽에 빈틈이 문처럼 열린다. 염종이 온 힘을 다해 그 문으로 뛰어든다. 유신은 옛 연무장의 그 걸음으로 창 안쪽에 들어서서, 칼날을 그의 가슴에 박는다. 오십일기의 두 소년이 진흙탕에서 함께 익힌 걸음이다.'
		),
		p('Yumjong sits down in the ditch as if somebody had offered him a seat.', '염종은 누가 자리라도 권한 것처럼 도랑에 주저앉는다.'),
		say(
			'yumjong',
			['…Huh.', 'He said you would.', '…You said no bargains. Send me back anyway.'],
			['……허.', '그 양반이 그라실 끼라 카셨는데.', '……흥정 없다 카셨지예. 그래도 보내 주이소.']
		),
		say('yushin', ['I’ll send you.'], ['보내 줌세.']),
		say('yumjong', ['…It was a good word, though. Gaya.', 'They liked shouting it.'], ['……그래도 좋은 말이었지예. 가야.', '다들 외치기 좋아했는데.']),
		p(
			'Yushin kneels in the mud beside him. First for the stone. He finds it by feel, wipes it on the torn sleeve, and closes his fist on it. Then, with the same hand, he closes Yumjong’s eyes.',
			'유신이 그 옆 진흙에 무릎을 꿇는다. 먼저 돌을 위해서. 손으로 더듬어 찾아, 찢어진 소매에 닦고, 주먹 안에 쥔다. 그러고는 같은 손으로 염종의 눈을 감긴다.'
		),
		p(
			'One of the twenty has left a horse at the ditch. Yushin lifts the body across its saddle, ties it there with the dead man’s own sash, leaves the black headband where it is, and turns the horse’s head toward the Radiance gate. Then he slaps its rump once.',
			'스물 중 누군가 도랑가에 말 한 마리를 두고 갔다. 유신은 시신을 그 안장 위에 가로로 얹고, 죽은 이의 허리띠로 묶고, 검은 머리띠는 그대로 둔 채, 말머리를 명활성 성문 쪽으로 돌린다. 그리고 엉덩이를 한 번 친다.'
		),
		p(
			'The horse walks up the slope alone, its rider folded over the saddle. On the wall the shouting stops. Yushin mounts the grey and is gone up the road before the gate opens.',
			'말이 혼자 비탈을 걸어 오른다. 탄 이는 안장 위에 접혀 있다. 성벽 위의 고함이 멎는다. 유신은 회색 말에 올라, 성문이 열리기 전에 길 위로 사라진다.'
		),
		scene('The Radiance Gate', '명활성 성문'),
		p(
			'The gate opens for a horse. Bidam comes down through it with no sword, only the beads he put away at dusk, snatched up again on the way down. He lifts Yumjong’s face from the saddle with both hands.',
			'성문이 말 한 마리를 위해 열린다. 비담이 칼도 없이 그 문을 지나 내려온다. 해 질 녘 치워 두었던 염주를, 내려오는 길에 도로 움켜쥐었을 뿐이다. 그는 두 손으로 안장에서 염종의 얼굴을 들어 올린다.'
		),
		say('bidam', ['Yumjong.', '…Yumjong.', 'I said tomorrow. I said the gate would still be there.'], ['염종아.', '……염종아.', '내일이라 안 캤나. 성문은 내일도 있다꼬 안 캤나.']),
		p(
			'Somebody has closed his eyes. Bidam knows whose hand it was, and that is worse. He unties the sash and takes his friend down into his arms, and kneels in the mud with him. The wound is under the left arm, where a man goes in when a door opens on his left. Bidam knows that step. He taught half of it.',
			'누군가 그의 눈을 감겨 주었다. 비담은 그게 누구 손인지 안다. 그래서 더 아프다. 그는 허리띠를 풀어 벗을 안아 내리고, 그를 안은 채 진흙에 무릎을 꿇는다. 상처는 왼팔 아래다. 왼쪽에 문이 열릴 때 사람이 파고드는 자리. 비담은 그 걸음을 안다. 그 절반은 그가 가르쳤다.'
		),
		p(
			'The quieter name on the banner goes first. Bidam unties the black headband from Yumjong’s brow and winds it round his own wrist, under the beads, and does not let anyone see his hand.',
			'깃발의 조용한 이름이 먼저 간다. 비담은 염종의 이마에서 검은 머리띠를 풀어 제 손목에, 염주 밑에 감는다. 그리고 그 손을 아무에게도 보이지 않는다.'
		),
		p(
			'He recites for the dead, the whole sutra, slowly, while the men on the wall hold their torches and don’t know where to look. When he reaches the end he lays Yumjong down, and stands, and walks out onto the open slope, and looks up.',
			'그는 망자를 위한 경을 왼다. 처음부터 끝까지, 천천히. 성벽 위의 군사들은 횃불을 든 채 어디를 봐야 할지 모른다. 끝까지 다 외고 나서, 그는 염종을 내려놓고, 일어나, 트인 비탈로 걸어 나가, 하늘을 올려다본다.'
		),
		p('In the east the marshal’s star has burned out. The place where it hung is empty.', '동쪽에서 대장군의 별은 다 타 버렸다. 그것이 걸려 있던 자리가 비어 있다.'),
		say(
			'bidam',
			['Is that your omen?!', 'You threw a star down at her, and he hung it back up with paper!', 'Where were you for him?! He never asked you for anything! Not once!'],
			['그게 니 징조가?!', '여자 하나 겨냥해 별을 내던지더니, 저놈은 종이로 그걸 도로 걸어 놨다!', '저 사람한테는 어디 있었노?! 니한테 뭘 달라 칸 적도 없는 사람이다! 한 번도!']
		),
		p(
			'Then there are no more words, only the noise a man makes at the sky when the sky has nothing to say back. The whole Radiance wall hears it. So does the palace. Nobody on either side will describe it afterwards, and nobody on either side forgets it.',
			'그다음엔 말이 없다. 하늘이 아무 대답도 하지 않을 때 사람이 하늘에 대고 내는 소리만 있다. 명활성 성벽 전체가 그걸 듣는다. 궁궐도 듣는다. 어느 쪽도 나중에 그 소리를 입에 올리지 않고, 어느 쪽도 잊지 않는다.'
		),
		say('bidam', ['Yushin! Brother of the yard!', 'We learned that step together. Tonight you used it on him.'], ['유신아! 연무장 동기야!', '그 걸음, 우리 같이 배운 기다. 오늘 밤 니는 그걸 저 사람한테 썼다.'])
	);
	console.log('applied');
});
