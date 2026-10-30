import { editStory } from './story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const d = (who, en, lines) => {
	const block = { kind: 'dialogue', en: Array.isArray(en) ? en : [en], lines: Array.isArray(lines) ? lines : [lines] };
	if (who.person) block.person = who.person;
	else {
		block.speaker = who.speaker;
		if (who.gender) block.gender = who.gender;
	}
	if (who.chip) block.chip = who.chip;
	return block;
};

const K = { person: 'kangrim', chip: '#4a4a58' };
const Y = { person: 'yumla', chip: '#7c3aed' };
const H = { person: 'haewonmek', chip: '#6b5b6e' };
const MAG = { speaker: 'Magistrate Gimchi', gender: 'm', chip: '#8a7a3a' };
const WIFE = { speaker: 'His Wife', gender: 'f', chip: '#c4a574' };
const CROW = { speaker: 'The Crow', gender: 'm', chip: '#2a2a2a' };
const OLD = { speaker: 'The Old Man', gender: 'm', chip: '#c9b18f' };

editStory((story) => {
	const en = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Kangrim');
	if (!en) throw new Error('Kangrim not found');

	const orangeAt = en.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Orange Boat');
	if (orangeAt < 0) throw new Error('Orange Boat not found');
	const orange = en.blocks.slice(orangeAt);

	const myth = [
		p(
			'Every death you’ve watched so far has had a visitor: a man with a red book and one question. Here is where he came from.',
			'지금까지 네가 본 죽음마다 손님이 있었다. 붉은 책 든 사내, 질문 하나. 그가 어디서 왔는지다.'
		),
		scene('The Pond', '못'),
		p(
			'Three brothers went to a rich house to sell silk. They did not come home. The couple who bought the silk put them in a pond and kept the cloth.',
			'형제 셋이 비단 팔러 부잣집에 갔다. 안 돌아왔다. 비단을 산 내외는 형제를 못에 넣고 비단은 남겼다.'
		),
		p(
			'Their mother walked west. You know that road now. She came back with three flowers and three beads, and the brothers sat up in the yard and asked for breakfast.',
			'어머니가 서쪽으로 걸었다. 그 길, 이제 알지. 꽃 세 송이와 구슬 세 개를 들고 왔다. 형제들이 마당에서 일어나 아침을 찾았다.'
		),
		p(
			'The couple killed them again. A living court can try a murder. It cannot try the same murder twice.',
			'내외는 형제를 다시 죽였다. 산 자의 법정은 살인을 재판할 수 있다. 같은 살인을 두 번은 못 한다.'
		),
		scene('The Magistrate’s Hall', '원님 동헌'),
		p(
			'The magistrate was called Gimchi. He had one man he sent when the law ran out of rooms. That man had a wife who kept the gate-god and the kitchen-god fed, and a promise to be back by harvest.',
			'원님 이름은 김치였다. 법이 방을 잃으면 보내는 부하가 하나 있었다. 그 사내에겐 문신과 조왕을 먹여 살리는 아내가 있었고, 가을걷이 전에 돌아오겠다는 약속이 있었다.'
		),
		d(WIFE, ['The shrine is fed.', 'Don’t make me feed it twice.'], ['신에게 올렸다.', '두 번은 올리지 말게.']),
		d(K, ['Harvest.', 'I will be back before it.'], ['가을걷이.', '그 전에 돌아오리다.']),
		d(MAG, ['Kangrim.', 'Go down and bring me King Yumla.'], ['강림.', '내려가서 염라대왕을 데려오너라.']),
		d(K, ['…Down, sir.'], ['…아래로 말이오.']),
		d(MAG, ['Down.', 'The hearing is in three days.'], ['아래.', '심리는 사흘 후다.']),
		d(K, ['Sir. Does he know he’s coming?'], ['원님. 그이가 온다는 걸 아오?']),
		d(MAG, ['He will when you tell him.'], ['네가 말하면 알지.']),

		scene('The Road Down', '저승길'),
		p(
			'The gate-god and the kitchen-god put him on the road, because his wife had kept them fed. At the last pond he shut his eyes and jumped. He stood up at a gate that did not have a sun.',
			'문신과 조왕이 길을 열어 준다. 아내가 먹여 줘서다. 마지막 못에서 눈을 감고 뛰어든다. 해 없는 문간에 서서 일어난다.'
		),
		p(
			'Someone is already walking that road. Younger. Night-road. He does not offer his name. He points.',
			'그 길을 이미 걷는 자가 있다. 더 젊고, 밤길이다. 이름은 안 댄다. 가리키기만 한다.'
		),
		d(H, ['That way.', 'He hates being fetched.'], ['그쪽.', '데리러 오는 거 싫어한다.']),
		d(K, ['Your Majesty.', 'The living court requests you.', 'There is a case. Living law cannot close it.'], [
			'대왕마마.',
			'산 자의 법정이 청하오.',
			'사건이 있소. 산 자의 법으로는 닫을 수가 없소.'
		]),
		{
			kind: 'card',
			person: 'yumla',
			caption: 'The judge of the dead. Every ledger in the dark ends on his desk.',
			ko: '죽은 자의 판관. 어둠의 장부는 전부 그 책상에서 끝난다.'
		},
		d(Y, ['Go home.', 'I will come at the hour I name.'], ['돌아가거라.', '내가 정한 시에 가리라.']),
		p(
			'He came. The pond dried. The bones came up. The three brothers went home to their parents. The couple who had killed them did not. Yumla keeps the sentence. The living magistrate keeps the paperwork, and is not grateful.',
			'그는 왔다. 못이 말랐다. 뼈가 올라왔다. 형제 셋은 부모에게 돌아갔다. 죽인 내외는 아니었다. 염라가 형을 갖는다. 산 원님은 문서를 갖고, 고마워하지 않는다.'
		),
		d(Y, ['Lend me that man.', 'I still have errands.'], ['그 사내를 빌려다오.', '볼일이 남았다.']),
		d(MAG, ['No.', 'I do not believe in souls.', 'I am not lending my best man to one.'], [
			'안 된다.',
			'나는 영혼 따윈 안 믿는다.',
			'제일 쓸모 있는 부하를 그런 것에게 빌려 줄 수는 없다.'
		]),
		p(
			'So they split him. The magistrate kept the half he could see. Yumla took the other. That is how Kangrim died upstairs and woke as a fetch of the dead.',
			'그래서 그를 쪼갠다. 원님은 보이는 반을 가졌다. 염라는 다른 반을. 강림이 위에서는 죽고, 아래에서는 차사로 일어난 이유다.'
		),
		p(
			'His wife buried the body. She never learned he was still walking. The shrine got fed twice after all.',
			'아내는 그 몸을 묻었다. 그가 아직 걷고 있는 줄은 끝내 모른다. 신에게는 결국 두 번 올렸다.'
		),
		p(
			'Yumla put a ledger in his hands. Eighty years, in order, the old before the young. On the way down Kangrim trusted it to a crow. The crow lost it at a slaughter-field. A snake ate the writing.',
			'염라가 장부를 쥐여 준다. 여든, 순서대로, 늙은 이 먼저. 내려가는 길에 강림은 그걸 까마귀에게 맡긴다. 까마귀는 도살장에서 잃는다. 뱀이 글을 먹는다.'
		),
		d(CROW, ['When it’s the old one’s turn, let the child come.', 'When it’s the child’s, let the old one.'], [
			'늙은 이 차례면 아이를 보내라.',
			'아이 차례면 늙은 이를.'
		]),
		p(
			'That is why nobody knows the hour until he is already in the room. One errand was left: a man who had dodged death for three thousand years.',
			'그래서 그가 방에 들어올 때까지는 아무도 시를 모른다. 볼일이 하나 남았다. 삼천 년을 죽음을 피해 온 사내.'
		),
		p(
			'Kangrim sat in a stream washing charcoal. The old man stopped to laugh at him. That was enough.',
			'강림은 시내에서 숯을 씻고 앉아 있었다. 노인이 멈춰 서서 웃었다. 그걸로 됐다.'
		),
		d(OLD, ['Charcoal.', 'You cannot wash it white.'], ['숯이구나.', '씻는다고 희어지나.']),
		d(K, ['I do not punish.', 'I collect — for His Majesty.', 'Since the list was scrambled, nobody knows the hour until I am already in the room.'], [
			'벌하지 않소.',
			'거둬 가오. 대왕마마 대신.',
			'명부가 뒤섞인 뒤로는, 내가 방에 들어올 때까지 시를 아는 이가 없소.'
		]),
		p('He still asks it, the question. You have heard him. You will hear him again.', '그는 아직도 그 질문을 한다. 너는 들었다. 또 들을 것이다.')
	];

	en.blocks = [...myth, ...orange];
	return true;
});
