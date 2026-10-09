/**
 * Seohyun crossovers (scenes pass).
 * #14 Munhee: the father walks in on the coat-mending (unpicked hem, collar, charcoal cart), half a cup at the wedding.
 * #27 Nangbi: the command post before the charge (white horse, cold cup, counting).
 * #46 Seohyun: both moments again from his side, sharing the exact dialogue blocks, plus before and after.
 * Idempotent: each episode is skipped when its marker is already present.
 */
import { editStory } from '../story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, ko) => ({ kind: 'dialogue', person, lines: ko, en });
const extra = (speaker, en, ko, gender = 'm') => ({ kind: 'dialogue', chip: '#7f96b5', speaker, gender, lines: ko, en });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const mono = (person, html, ko) => ({ kind: 'monologue', person, html, ko });

const english = (b) => [b.html, ...(b.en ?? []), b.label, b.caption].filter(Boolean).join(' ');
const clone = (b) => JSON.parse(JSON.stringify(b));

function at(entry, frag) {
	const hits = entry.blocks.map((b, i) => (english(b).includes(frag) ? i : -1)).filter((i) => i >= 0);
	if (hits.length !== 1) throw new Error(`${entry.title}: ${hits.length} blocks with “${frag}”`);
	return hits[0];
}
const insertAfter = (entry, frag, blocks) => entry.blocks.splice(at(entry, frag) + 1, 0, ...blocks);
const insertBefore = (entry, frag, blocks) => entry.blocks.splice(at(entry, frag), 0, ...blocks);

/* ——— the hall, spring 625: lines heard in both episodes ——— */
const HALL = {
	chunchuUp: () =>
		say(
			'chunchu',
			['My lord— forgive me— Kim Chunchu, my lord.', 'The coat, it— there was a foul—'],
			['어르신— 송구합니다— 김춘추라 하옵니다.', '옷이— 그게, 반칙이 있어서—']
		),
	sit: () => say('seohyeon', ['Sit, sit. Please.', 'You’ll tear something else.'], ['앉으시오, 앉으시오.', '다른 데까지 뜯어지겠소.']),
	early: () => say('munhee', ['Father. You’re early.'], ['아버지. 일찍 오셨네요.']),
	amI: () => say('seohyeon', ['Am I.'], ['그렇나.']),
	tornAgain: () => say('seohyeon', ['Torn again, is it.'], ['또 뜯어졌나.']),
	poorCoat: () => say('munhee', ['It’s a poor coat, Father.'], ['옷이 시원찮아서요, 아버지.']),
	mm: () => say('seohyeon', ['Mm.', 'Poor coat.'], ['음.', '시원찮은 옷이네.']),
	foul: () => say('yushin', ['Gyuku, Father. It was a foul.'], ['격구입니다, 아버지. 반칙이었습니다.']),
	myHall: () => say('seohyeon', ['In my hall.'], ['내 대청에서.']),
	badFoul: () => say('yushin', ['…It was a bad foul.'], ['……심한 반칙이었습니다.']),
	finish: () =>
		say(
			'seohyeon',
			['Finish it, then.', 'He can’t go out like— the lane’s— finish it.'],
			['마저 꿰매라, 그라면.', '저래 갖고 나가믄— 골목이— 마저 꿰매라.']
		),
	crooked: () =>
		say(
			'seohyeon',
			['Crooked.', '…Mind the lane going down, sir. There’s a charcoal cart comes up about this hour.'],
			['삐뚤었소.', '……내려가는 길 조심하시오. 이맘때 숯 수레가 올라오오.']
		),
	thanks: () => say('chunchu', ['…Thank you, my lord?'], ['……감사합니다, 어르신?']),
	knows: () => say('bohee', ['…He knows.'], ['……아버지 아셔.']),
	doesnt: () => say('munhee', ['He doesn’t.'], ['모르셔.']),
	window: () => say('bohee', ['He held it up to the window, Munhee.'], ['창에 대고 비춰 보셨잖아, 문희야.'])
};

/* ——— the rise at Nangbi, 629: lines heard in both episodes ——— */
const RISE = {
	reform: () =>
		extra(
			'A staff officer',
			['Pull the left back to the stream, sir. Call it reforming.'],
			['좌군을 개울까지 물리시이소, 장군. 진을 고쳐 친다 카면 됩니더.']
		),
	running: () =>
		extra('Another officer', ['Call it what you like. Goguryeo will call it running.'], ['뭐라 카든 고구려 놈들은 도망이라 캅니더.']),
	whoWhite: () => say('seohyeon', ['Who’s that. On the white horse.'], ['저 누고. 흰 말 탄 거.']),
	yourSon: () => extra('A staff officer', ['…Your son, sir.'], ['……아드님이십니더, 장군.']),
	iKnow: () =>
		say('seohyeon', ['I know.', 'I was hoping you’d say someone— I know.'], ['안다.', '딴 사람이라 캐 주기를— 안다.']),
	protest: () =>
		extra(
			'A staff officer',
			['My lord— a banner captain, alone, into that— he’s your—'],
			['장군— 당주 하나가 혼자서 저기를— 아드님이—']
		),
	whoseHeIs: () =>
		say(
			'seohyeon',
			['I know whose he is.', 'He said collar. Let him be the collar.'],
			['누 아들인지 안다.', '옷깃이 되겠다 안 카나. 되라 캐라.']
		)
};

const M14 = 'He holds the hem up to the window';
const M27 = 'Who’s that. On the white horse.';
const M46 = 'Granaries are why he is in Surabol that spring.';

editStory((story) => {
	const entry = (chapter, title) => story.find((c) => c.id === chapter).entries.find((e) => e.title === title);
	const E14 = entry('five-principles', 'Munhee');
	const E27 = entry('iron-will', 'Nangbi');
	const E46 = entry('chunchu-era', 'Seohyun');
	const has = (e, m) => e.blocks.some((b) => english(b).includes(m));
	let changed = false;

	/* ——— #14 Munhee ——— */
	if (!has(E14, M14)) {
		insertAfter(E14, 'They do not leap. They accumulate.', [
			p(
				'On the fourth afternoon the house gets a visitor nobody planned for. The girls’ father is in the capital for three days, to tell the palace about a granary on the Baekje border. He comes in from the gate in his riding boots and stops in his own doorway.',
				'나흘째 오후, 아무도 셈에 넣지 않은 손님이 든다. 아가씨들의 아버지다. 백제 접경의 곳간 일을 궁에 아뢰러 사흘 일정으로 서라벌에 와 있다. 그는 승마 신을 신은 채 대문에서 들어와, 제 집 문간에서 멈춘다.'
			),
			p(
				'A young nobleman is sitting on his floor in an underrobe. His younger daughter is standing behind him with a needle. His son is studying the rafters with great interest.',
				'제 집 마루에 젊은 귀공자가 속적삼 바람으로 앉아 있다. 작은딸은 그 뒤에 바늘을 들고 서 있다. 아들은 서까래를 아주 열심히 올려다보고 있다.'
			),
			HALL.chunchuUp(),
			HALL.sit(),
			HALL.early(),
			HALL.amI(),
			p(
				'He crosses the hall and takes the coat off her arm. He holds the hem up to the window. It has not torn. Somebody has unpicked it along the seam, stitch by stitch, very neatly. He gives it back to her.',
				'그는 대청을 건너와 딸의 팔에서 옷을 받아 든다. 밑단을 창 쪽으로 들어 본다. 뜯어진 게 아니다. 누군가 솔기를 따라 한 땀 한 땀, 아주 얌전히 풀어 놓았다. 그는 옷을 딸에게 돌려준다.'
			),
			HALL.tornAgain(),
			HALL.poorCoat(),
			HALL.mm(),
			HALL.foul(),
			HALL.myHall(),
			HALL.badFoul(),
			HALL.finish(),
			p(
				'Nobody in that hall has ever sewn so slowly. When the coat is back on, the old man reaches over and fixes the gentleman’s collar with both hands, the way he has fixed every collar in this house, and steps back.',
				'그 대청에서 그토록 느린 바느질은 처음이다. 옷이 다시 어깨에 걸리자 노인은 손을 뻗어 두 손으로 귀공자의 옷깃을 바로잡는다. 이 집 옷깃이란 옷깃은 다 그렇게 바로잡아 온 손이다. 그리고 물러선다.'
			),
			HALL.crooked(),
			HALL.thanks(),
			p(
				'He goes out to see to his horse, which does not need seeing to. Munhee waits until his boots have crossed the yard. Through the side door, her sister has heard every word.',
				'그는 돌볼 필요도 없는 말을 돌보러 나간다. 문희는 그의 발소리가 마당을 다 건널 때까지 기다린다. 옆문 너머에서 언니가 한 마디도 빼놓지 않고 들었다.'
			),
			HALL.knows(),
			HALL.doesnt(),
			HALL.window()
		]);
		insertBefore(E14, 'At the feast the two of them end up where they always end up', [
			p(
				'The bride’s father sits near the dais with royal Kims on every side and says almost nothing all night. Halfway through, a steward brings him a cup from a very old man across the hall. He drinks half of it. The other half goes on the step, and nobody asks him why.',
				'신부의 아버지는 단 가까이, 사방이 왕족 김씨인 자리에 앉아 밤새 거의 말이 없다. 잔치가 한창일 때 청지기가 대청 건너편 아주 늙은 노인에게서 잔 하나를 들고 온다. 그는 반을 마신다. 나머지 반은 섬돌에 붓는다. 왜냐고 묻는 사람은 없다.'
			)
		]);
		changed = true;
	}

	/* ——— #27 Nangbi ——— */
	if (!has(E27, M27)) {
		insertBefore(E27, 'He rides back to his father’s command post', [
			p(
				'On the rise behind the trenches, the general’s staff have been arguing for an hour about how to retreat without calling it one. The general has said nothing. He is holding a cup of barley tea he has forgotten to drink.',
				'참호 뒤 언덕에서 장군의 참모들은 한 시진째, 후퇴를 후퇴라 부르지 않고 하는 법을 두고 다투고 있다. 장군은 말이 없다. 마시는 걸 잊은 보리차 잔을 들고 있다.'
			),
			RISE.reform(),
			RISE.running(),
			RISE.whoWhite(),
			RISE.yourSon(),
			RISE.iKnow()
		]);
		insertAfter(E27, 'Then go.', [RISE.protest(), RISE.whoseHeIs()]);
		insertAfter(E27, 'The white horse takes the trench in one jump', [
			p(
				'On the rise, his father has not moved. The officer nearest him hears him counting under his breath, the way you count a breath you are afraid will be the last. One. A long while. Two. At three he sets the cold cup down on the ground, very carefully, as if it might spill.',
				'언덕 위, 아버지는 꼼짝도 않는다. 제일 가까이 선 장교가 그가 숨죽여 세는 소리를 듣는다. 마지막일까 겁나는 숨을 세듯. 하나. 한참. 둘. 셋에서 그는 식은 잔을 땅에 내려놓는다. 쏟아질까 봐 아주 조심스럽게.'
			)
		]);
		changed = true;
	}

	/* ——— #46 Seohyun ——— */
	if (!has(E46, M46)) {
		const n = (frag) => clone(E27.blocks[at(E27, frag)]);
		const collarAsk = n('Let me be the collar.');
		const goLine = n('Then go.');
		const helmetCrooked = n('Your helmet’s crooked.');

		insertAfter(E46, 'My wife ran the granary at Manno.', [
			scene('Surabol · the torn coat', '서라벌 · 뜯긴 옷고름'),
			p(
				'Granaries are why he is in Surabol that spring. The palace wants the Daeya stores counted out loud, in person, by the man who keeps them. It takes three days. He spends the first two in corridors.',
				'그해 봄 그가 서라벌에 와 있는 것도 곳간 때문이다. 궁에서는 대야성 곳간을, 맡은 사람이 직접 와서 소리 내어 셈하라 한다. 사흘이 걸린다. 처음 이틀은 복도에서 보낸다.'
			),
			p(
				'On the third afternoon he rides up the lane to his own gate and finds a horse tied at it. A good horse, with a magenta saddlecloth. The groom says it was there yesterday too. And the day before.',
				'사흘째 오후, 제 집 골목을 올라오니 대문에 말 한 필이 매여 있다. 좋은 말이다. 자홍 안장 깔개를 얹었다. 마부 말로는 어제도 있었다. 그제도.'
			),
			extra('The groom', ['A gentleman’s, sir. Comes for the sewing.'], ['어느 나리 말입니더. 바느질 때문에 오십니더.']),
			say('seohyeon', ['What sewing.'], ['무슨 바느질.']),
			extra('The groom', ['His coat, sir. It tears.', 'Every day, like. Same coat.'], ['그 나리 옷이 뜯어진다 캅니더.', '날마다 그렇심더. 같은 옷이요.']),
			p(
				'Seohyun looks at the horse for a long while. A horse that goes somewhere every day for a reason it can’t give: he has ridden one of those.',
				'서현은 한참 그 말을 본다. 댈 수 없는 이유로 날마다 같은 데를 다니는 말. 그도 그런 말을 타 봤다.'
			),
			mono(
				'seohyeon',
				'I knew that horse. Not that one. The kind. Mine nearly ate a charcoal cart.',
				'그 말을 알았소. 그 말 말고, 그런 말. 내 말은 숯 수레를 먹을 뻔했지.'
			),
			p(
				'He goes in through his own door in his riding boots, and stops. There is a young man on his floor in an underrobe, trying to stand up and bow at the same time. There is Munhee behind him with a needle. There is Yushin, looking at the rafters as if he had paid for them.',
				'그는 승마 신을 신은 채 제 집 문으로 들어가다, 멈춘다. 마루에 젊은 사내가 속적삼 바람으로, 일어서는 동시에 절을 하려 애쓰고 있다. 그 뒤에 바늘을 든 문희. 그리고 서까래를 제 돈으로 올린 양 올려다보는 유신.'
			),
			HALL.chunchuUp(),
			HALL.sit(),
			HALL.early(),
			HALL.amI(),
			p(
				'He knows the face. Everyone in Surabol does: the grandson of the king the council took the crown off. He takes the coat from his daughter because his hands want something to do, and holds the hem to the window. Unpicked, not torn. Neat, patient, stitch by stitch. His daughter’s work. He would know it anywhere.',
				'그 얼굴을 안다. 서라벌 사람이면 다 안다. 화백이 왕관을 벗겨 낸 임금의 손자다. 그는 손이 할 일을 찾느라 딸에게서 옷을 받아 들고, 밑단을 창에 대어 본다. 뜯어진 게 아니라 풀어 놓은 거다. 얌전하고 참을성 있게, 한 땀 한 땀. 딸의 솜씨다. 어디서 봐도 알아본다.'
			),
			HALL.tornAgain(),
			HALL.poorCoat(),
			HALL.mm(),
			HALL.foul(),
			HALL.myHall(),
			HALL.badFoul(),
			p(
				'He could say a great deal. He thinks of a mulberry shed, and a bar lifted from the inside, and a man who had no idea what the rules were. He waits for the coat instead.',
				'할 말은 많다. 뽕나무 헛간이 떠오르고, 안에서 들어 올린 빗장이 떠오르고, 규칙이 뭔지 하나도 몰랐던 사내가 떠오른다. 그는 대신 옷을 기다린다.'
			),
			HALL.finish(),
			p(
				'When the coat is on, he fixes the young man’s collar with both hands. It is the only thing he can think of to do that is not a question.',
				'옷이 다시 걸리자 그는 두 손으로 젊은이의 옷깃을 바로잡는다. 질문이 아닌 일로는 그것밖에 떠오르지 않는다.'
			),
			HALL.crooked(),
			HALL.thanks(),
			p(
				'He goes out to see to a horse that does not need seeing to. Behind him, through a side door, Bohee is saying he knows, and Munhee is saying he doesn’t.',
				'그는 돌볼 필요도 없는 말을 돌보러 나간다. 등 뒤 옆문 너머에서 보희는 아버지가 아신다 하고, 문희는 모르신다 한다.'
			),
			p('Yushin follows him into the yard.', '유신이 그를 따라 마당으로 나온다.'),
			say('yushin', ['Father— about the coat.'], ['아버지— 그 옷 말입니다.']),
			say('seohyeon', ['Your foot, was it.'], ['니 발이가.']),
			say('yushin', ['…My foot.'], ['……제 발입니다.']),
			say('seohyeon', ['On purpose.'], ['일부러.']),
			say(
				'yushin',
				[
					'He wouldn’t come in on his own, Father. They took the crown off his grandfather. He doesn’t go into houses where he might be wanted.',
					'Somebody had to step on something.'
				],
				['제 발로는 안 들어옵니다, 아버지. 할아버지 왕관을 빼앗긴 집안입니다. 반길 만한 집엔 발을 안 들입니다.', '누군가는 뭘 밟아야 했습니다.']
			),
			say('seohyeon', ['Does your mother know?'], ['니 어무이는 아나?']),
			say('yushin', ['Does she need to?'], ['아셔야 합니까?']),
			say(
				'seohyeon',
				['She’ll know before I’m home. She always— she knew about me before I did.'],
				['내가 집에 닿기도 전에 알 끼다. 그 사람은 늘— 나에 대해서도 나보다 먼저 알았다.']
			),
			say('yushin', ['Will you stop it?'], ['막으실 겁니까?']),
			p(
				'Seohyun doesn’t answer. He walks to the gate. The gentleman comes out behind him with his collar straight and his face the colour of his coat, mounts, looks back once at the window over the yard, and very nearly rides into a charcoal cart.',
				'서현은 답하지 않는다. 대문으로 걸어간다. 뒤따라 귀공자가 옷깃을 바로 하고 옷 빛깔만큼 붉은 얼굴로 나와 말에 오른다. 마당 위 창을 한 번 돌아보고, 숯 수레를 들이받을 뻔한다.'
			),
			extra('The charcoal man', ['Eyes front, sir! Eyes front!'], ['앞 보이소, 나리! 앞!']),
			p(
				'Seohyun laughs. Out loud, at his own gate. Yushin has never heard the sound, and looks at his father as if the wall had spoken.',
				'서현이 웃는다. 제 집 대문 앞에서, 소리 내어. 유신은 그 소리를 처음 듣는다. 담벼락이 말을 한 것처럼 아버지를 본다.'
			),
			say('yushin', ['…Father?'], ['……아버지?']),
			say('seohyeon', ['Nothing. Nothing.', 'Leave it. Leave all of it.'], ['아이다. 아무것도.', '고마 놔둬라. 다 놔둬라.']),
			p(
				'He rides back to Daeya the next morning and talks to his wife about the granary all summer.',
				'이튿날 아침 그는 대야로 돌아가, 여름 내내 아내에게 곳간 이야기만 한다.'
			)
		]);

		const who = at(E46, 'The deposed one’s— Manmyung, that’s a king’s—');
		E46.blocks.splice(
			who,
			0,
			say('seohyeon', ['…Magenta.', 'A magenta coat. It kept tearing.'], ['……자홍.', '자홍 옷이오. 자꾸 뜯어지더군.']),
			say(
				'manmyung',
				['You knew.', 'You were in that house in the spring, and you knew, and you came home and talked to me about grain.'],
				['알았군요.', '봄에 그 집에 있었고, 알았고, 와서는 나한테 곡식 얘기만 했어요.']
			),
			say('seohyeon', ['I straightened his collar.'], ['옷깃은 바로잡아 줬소.']),
			say('manmyung', ['Whose collar?'], ['누구 옷깃을요?'])
		);

		insertAfter(E46, 'He drinks half the cup. The other half he pours out', [
			p(
				'Out on the steps, past the place where he poured, his daughter and her husband are sharing one cup. The groom’s collar is crooked again. Seohyun lets it be.',
				'그가 술을 부은 자리 너머 계단에서, 딸과 사위가 잔 하나를 나눠 마시고 있다. 사위의 옷깃이 또 삐뚤다. 서현은 그냥 둔다.'
			),
			scene('Nangbi · the rise behind the trenches', '낭비성 · 참호 뒤 언덕'),
			p(
				'Four autumns later he is holding another cup he will not drink. It is barley tea, and it went cold an hour ago, on a rise above the trenches at Nangbi, where his army is losing politely.',
				'네 번의 가을이 지나, 그는 또 마시지 않을 잔을 들고 있다. 보리차다. 한 시진 전에 식었다. 낭비성 참호 위 언덕, 그의 군대가 점잖게 지고 있는 자리다.'
			),
			p(
				'He is the commanding general. He is past sixty and his knees know it. His staff have been arguing for an hour about how to retreat without calling it one.',
				'그는 총대장이다. 예순이 넘었고 무릎이 그걸 안다. 참모들은 한 시진째, 후퇴를 후퇴라 부르지 않고 하는 법을 두고 다투고 있다.'
			),
			RISE.reform(),
			RISE.running(),
			RISE.whoWhite(),
			RISE.yourSon(),
			RISE.iKnow(),
			mono(
				'seohyeon',
				'I asked who it was. I knew. I wanted one of them to be wrong for once.',
				'누구냐고 물었소. 알고 있었지. 한 번쯤은 저것들이 틀려 주길 바랐소.'
			),
			p(
				'The boy rides up, gets down in front of the whole staff, and takes his helmet off. Seohyun taught him that. He regrets it at once.',
				'아들이 말을 몰아 와서 참모들 앞에 내려 투구를 벗는다. 그건 서현이 가르친 거다. 그는 곧바로 후회한다.'
			),
			collarAsk,
			goLine,
			mono(
				'seohyeon',
				'Put your helmet on. I said that first so I wouldn’t say anything else.',
				'투구 써라. 다른 말이 나올까 봐 그 말부터 했소.'
			),
			RISE.protest(),
			RISE.whoseHeIs(),
			p(
				'He counts. He counted his father’s last breath at Manno and never told anyone. Now he counts charges. One. The line bends. Two. He cannot see the white horse at all. At three he puts the cup down, because his hands have started to shake and the cup is rattling in them.',
				'그는 센다. 만노에서 아버지의 마지막 숨을 셌고, 아무한테도 말하지 않았다. 이제는 돌격을 센다. 하나. 적의 줄이 휜다. 둘. 흰 말이 아예 안 보인다. 셋에서 그는 잔을 내려놓는다. 손이 떨려 잔이 달그락거리기 시작해서다.'
			),
			p(
				'The boy comes back with something wrapped in a torn banner and sets it in the mud at his feet. The staff wait for a speech. Seohyun has one. It is about his father, and a cart, and a helm on a stand by a door, and it would take all night.',
				'아들이 찢긴 깃발에 싼 것을 들고 돌아와 그의 발치 진흙에 내려놓는다. 참모들은 연설을 기다린다. 서현에게는 할 연설이 있다. 아버지와 수레와 문간 받침대 위의 투구에 관한 것이고, 밤새 걸릴 것이다.'
			),
			helmetCrooked,
			p(
				'He fixes it with both hands. Then he shouts for his officers, walks behind the horse lines where nobody is, and stands with his forehead against a saddle until it is dark enough. The saddle belongs to a white horse with no name. It stands still for him. It has had a long day too.',
				'두 손으로 바로잡는다. 그리고 장교들을 부르고, 아무도 없는 말 대열 뒤로 걸어가, 충분히 어두워질 때까지 안장에 이마를 대고 서 있다. 그 안장은 이름 없는 흰 말의 것이다. 말은 가만히 서 준다. 녀석도 긴 하루였다.'
			),
			say('seohyeon', ['Steady, you.', 'All three times. Steady.'], ['한결같데이, 니는.', '세 번 다. 한결같다.']),
			mono(
				'seohyeon',
				'That night the boy named the horse. He hadn’t heard me. He just had the same word.',
				'그날 밤 아이가 말에 이름을 붙였소. 내 말을 들은 것도 아닌데. 그냥 같은 낱말을 가졌더이다.'
			)
		]);
		changed = true;
	}

	console.log(changed ? 'scenes-seohyun: applied' : 'scenes-seohyun: already applied');
	return changed;
});
