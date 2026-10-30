/** Brothers’ Coup: flesh out the 666 split from the record (Samguk Sagi Bojang 25 + Namseng biography, Namseng epitaph, Tang histories, Munmu 6). */
import { editStory, find, makeInserter } from '../story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, chip, en, lines) => ({ kind: 'dialogue', person, chip, lines, en });
const NAMSENG = '#c25a4e';
const NAMGUN = '#9e3b32';
const NAMSAN = '#d4776a';
const BOJANG = '#8f4a44';
const WHITE = '#d8d4c8';

editStory((story) => {
	const entry = story.find((c) => c.id === 'final-stand')?.entries.find((e) => e.title.startsWith('Brothers'));
	if (!entry) throw new Error('Brothers’ Coup not found');
	if (find(entry, 'which of us is the fish').length) {
		console.log('already applied');
		return false;
	}
	const insert = makeInserter(entry);
	const must = (after, blocks) => {
		const r = insert(after, blocks);
		if (r !== true) throw new Error(`anchor “${after}” matched ${r}`);
	};

	must('Nobody in Pyongyang asks who profits', [
		{ kind: 'scene', label: 'The Supper', ko: '저녁상' },
		p(
			'In Pyongyang the two younger brothers eat supper in their father’s hall without their father. Neither of them has done that before. A man from the household stays after the dishes are cleared, and says it plainly: your brother hates having you this close to the seal. He means to clear you out when he gets back. Better to move first.',
			'평양에서는 두 아우가 아버지 없는 아버지의 대청에서 저녁을 먹는다. 둘 다 처음 해 보는 일이다. 상을 물린 뒤에도 집안 사람 하나가 남아서 대놓고 말한다. 형님은 아우님들이 인장 곁에 있는 걸 싫어하신다. 돌아오시면 치우실 생각이다. 먼저 움직이시는 게 낫다.'
		),
		say('namgun', NAMGUN, ['Did you hear that? Brother means to clear us out.'], ['들었네? 형이 우릴 치운대.']),
		say('namsan', NAMSAN, ['I heard. Who says so?'], ['들었어. 누가 기러는데?']),
		say('namgun', NAMGUN, ['…He does.'], ['…저 사람이.']),
		say('namsan', NAMSAN, ['And who told him to say it?'], ['저 사람한텐 누가 기러라구 했는데?']),
		say(
			'namgun',
			NAMGUN,
			['Don’t pick at it, Namsan. Brother grew up under Father. He learned the sword there. And how to clear a man out of the way.'],
			['남산아, 꼬치꼬치 따디디 말라. 형은 아바지 밑에서 컸어. 칼두 거기서 배웠구, 사람 치우는 것두 거기서 배웠디.']
		),
		say('namsan', NAMSAN, ['What did Father say, at the end? Get along like fish and water.'], ['아바지가 마지막에 뭐랬어. 물고기하구 물처럼 지내라구.']),
		say('namgun', NAMGUN, ['Right. So which of us is the fish, and which is the water?'], ['기래. 기런데 누가 물고기구 누가 물이네?']),
		say('namsan', NAMSAN, ['…Brother.'], ['…형.']),
		p(
			'Neither of them believes it. That is the first night. By the fourth night they check who is at the door before either of them speaks.',
			'둘 다 믿지 않는다. 그게 첫날 밤이다. 나흘째 밤이 되면, 둘은 말을 꺼내기 전에 문 앞에 누가 있는지부터 살핀다.'
		)
	]);

	must('Tell the king the Supreme Commander has rebelled!', [
		p(
			'Then, because even a coup likes paperwork, they wake the king. A summons goes out under his seal: the Supreme Commander is to come home at once.',
			'그다음엔, 반란도 문서를 좋아하는 법이라, 둘은 왕을 깨운다. 왕의 인장이 찍힌 소환장이 나간다. 대막리지는 즉시 돌아오라.'
		),
		say('bojang', BOJANG, ['It— it only says come home? Only come home?'], ['도— 돌아오라고만 쓰는 게지? 돌아오라고만?']),
		say('namgun', NAMGUN, ['Only come home, Majesty.'], ['돌아오라구만 씁네다, 폐하.']),
		p(
			'The summons finds Namseng at a post station. He reads it, and then he reads who carried it: Namgun’s own riders. For ten days he does not come.',
			'소환장은 역참에서 남생을 찾아낸다. 그는 그것을 읽고, 그다음엔 그것을 가져온 자들을 읽는다. 남건의 기병들이다. 열흘 동안 그는 오지 않는다.'
		)
	]);

	const send = find(entry, 'From there he sends his other son west')[0]?.b;
	if (!send) throw new Error('Gungnae send block');
	send.html =
		'That night he rides north to the old capital at Gungnae. From there he sends Heonseong west, fifteen years old, to Chang’an, to ask the Third Emperor for an army.';
	send.ko = '그날 밤 그는 북쪽 옛 도읍 국내성으로 간다. 거기서 열다섯 살 헌성을 서쪽 장안으로 보내, 황제에게 군대를 청한다.';

	must('including the man it is written about, by the time the fast rider reaches him', [
		p(
			'Namgun sits down in the big chair the same morning and takes his brother’s title. Nobody pretends not to notice this time. By the end of the month his army is marching north.',
			'그날 아침 남건이 큰 의자에 앉아 형의 관작을 가져간다. 이번에는 아무도 못 본 척하지 않는다. 그달이 다 가기 전에 그의 군대가 북쪽으로 떠난다.'
		),
		{ kind: 'scene', label: 'Gungnae · Summer', ko: '국내성 · 여름' },
		p(
			'Gungnae was the capital before Pyongyang was. The old kings sleep on the slope behind it, under stone steps the size of houses. Namseng holds it with the riders who came north with him, and the handful of nearby cities that still answer to his name.',
			'국내성은 평양보다 먼저 도읍이었다. 옛 임금들이 그 뒤 비탈에, 집채만 한 돌계단 밑에 잠들어 있다. 남생은 함께 북으로 온 기병들과, 아직 그의 이름에 대답하는 인근 몇 개 성으로 그곳을 지킨다.'
		),
		p(
			'Namgun’s army camps on the river below and does not attack. Nobody in either camp wants to be the first Yeon to kill a Yeon in daylight. Every week the camp gets a little bigger. Every week there are fewer riders on the wall.',
			'남건의 군대는 아래 강가에 진을 치고 치지 않는다. 어느 진영에서도 대낮에 연씨를 죽이는 첫 연씨가 되고 싶은 자는 없다. 주마다 진은 조금씩 커진다. 주마다 성벽 위 기병은 줄어든다.'
		),
		p(
			'Some nights he walks up the slope to the Great King’s stone, the tall one that lists every city the Great King ever took. He reads it the way other men pray. He has never noticed before how long the list is.',
			'어떤 밤에는 비탈을 올라 대왕의 비석까지 간다. 대왕이 빼앗은 성을 하나하나 새겨 둔 그 키 큰 돌이다. 그는 남들이 기도하듯 그것을 읽는다. 그 목록이 이렇게 길다는 걸 전에는 몰랐다.'
		)
	]);

	must('Defection of Yeon Namseng', [
		p(
			'The answer arrives in midsummer, at the head of an army. The emperor has sent the White Dragon, the Tiele horse-lord who took a Goguryeo spear in the waist at Begam twenty-one years ago and rode out again the same evening.',
			'답은 한여름에, 군대를 앞세우고 온다. 황제가 보낸 것은 백룡이다. 스물한 해 전 백암에서 고구려 창을 허리에 맞고도 그날 저녁 다시 말에 오른 철륵의 기마 대장.'
		),
		say('qibiheli', WHITE, ['At Begam, one of your country’s spears went in here.', '…If you can ride, keep up.'], ['백암에서. 너희 나라 창이 여기 들어왔다.', '…말 탈 줄 알면 따라와라.']),
		say('namseng', NAMSENG, ['My country, General, is chasing me at the moment.'], ['제 나라는 지금 저를 쫓고 있습니다, 장군.']),
		say('qibiheli', WHITE, ['Then ride faster.'], ['그럼 더 빨리 타라.']),
		p(
			'Namseng breaks out of Gungnae with the city registers rolled under his arm. Six cities, a hundred thousand households, and every name on them a tax somebody in Chang’an will now collect.',
			'남생은 성의 호적을 둘둘 말아 겨드랑이에 끼고 국내성을 빠져나온다. 여섯 성, 십만 호. 거기 적힌 이름 하나하나가 이제 장안의 누군가가 거둘 세금이다.'
		)
	]);

	const jungto = find(entry, 'the family is finished in three directions at once')[0]?.b;
	if (!jungto) throw new Error('Jungto block');
	jungto.html +=
		' Silla’s clerks, who love a total, write down seven hundred and sixty-three households and three thousand five hundred and forty-three people.';
	jungto.ko += ' 합계를 좋아하는 신라의 서기들은 칠백예순세 호, 삼천오백마흔세 명이라고 적는다.';

	must('the family is finished in three directions at once', [
		p(
			'In the twelfth month the emperor names his marshal for the last war. It is the Blue Dragon, past seventy now, who took Yodong from Goguryeo twenty-one years ago and has been patient ever since. Last time he had to walk around the wall. This time he has a man who knows where the doors are.',
			'열두째 달, 황제가 마지막 전쟁의 총사령을 정한다. 청룡이다. 이제 일흔이 넘었고, 스물한 해 전 고구려에게서 요동성을 빼앗은 뒤로 줄곧 참아 온 사람이다. 지난번에는 성벽을 돌아가야 했다. 이번에는 문이 어디 있는지 아는 사람이 있다.'
		)
	]);

	const card = find(entry, 'with the whole the Western army at his back')[0]?.b;
	if (card) card.html = card.html.replace('the whole the Western army', 'the whole Western army');
});
console.log('Brothers’ Coup updated');
