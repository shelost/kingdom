/** King Micheon: banquet cold open → salt trio → Bongsang paranoia flashback. */
import { editStory } from './story-ops.mjs';

const BUYER = { speaker: 'A man', gender: 'm', chip: '#7a6a58' };

function d(person, lines, en, extra = {}) {
	const { look, chip, speaker, gender, ...rest } = extra;
	const out = { kind: 'dialogue', lines, en, ...rest };
	if (person) out.person = person;
	if (speaker) {
		out.speaker = speaker;
		out.gender = gender ?? 'm';
	}
	if (chip) out.chip = chip;
	if (look) out.look = look;
	return out;
}

function p(html, ko) {
	return { kind: 'p', html, ko };
}

function scene(label, ko, extra = {}) {
	return { kind: 'scene', label, ko, ...extra };
}

function card(person, caption, ko, extra = {}) {
	return { kind: 'card', person, caption, ko, ...extra };
}

editStory((story) => {
	const mich = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'King Micheon');
	if (!mich) throw new Error('King Micheon missing');

	mich.cast = [
		...new Set([
			'suchun',
			'ilu',
			'sobal',
			'bongsang',
			'dalga',
			'dolgo',
			'micheon',
			'eummo',
			'jaemo',
			'changjori',
			'jobul',
			'sou',
			'zhangtong'
		])
	];
	mich.toneNote =
		'Brothers invite a king to supper. A boy watches the heads come off. Years later the same boy wears the crown and kills anyone the country likes. Under a Chinese fortress, the nephew sells salt.';
	mich.logline = {
		en: 'Brothers invite a king to supper. A boy watches. Years later the nephew is just a salt merchant.',
		ko: '아우들이 임금을 저녁에 부른다. 아이가 본다. 몇 해 뒤, 조카는 소금장수일 뿐이다.'
	};

	const fbIdx = mich.blocks.findIndex((b) => b.kind === 'flashback' && b.title === 'The name he put down');
	if (fbIdx < 0) throw new Error('outer flashback missing');
	const oldFb = mich.blocks[fbIdx];
	const afterFb = mich.blocks.slice(fbIdx + 1);

	const nightIdx = oldFb.blocks.findIndex((b) => b.kind === 'flashback' && b.title === 'The night he was told to lie');
	if (nightIdx < 0) throw new Error('nested night missing');
	const night = oldFb.blocks[nightIdx];
	const afterNight = oldFb.blocks.slice(nightIdx + 1);

	const opening = [
		p('They invited him to supper.', '저녁에 불렀다.'),
		p(
			'His own brothers. You know how that kind of night goes. Cups. Music. Too many men behind the screens.',
			'친아우들이다. 그런 밤은 아실 것이다. 잔. 풍악. 병풍 뒤에 너무 많은 사내.'
		),
		scene('The banquet · the inner hall', '연회 · 내전', { weather: 'night', year: 286 }),
		p(
			'Ilu has already poured. Sobal has already smiled with the eye that still works. The king comes in last, which is manners, and also a way of counting the room.',
			'일우는 이미 따랐다. 소발은 남은 눈으로 이미 웃었다. 임금이 맨 나중에 들어온다. 예절이고, 방을 세는 방법이기도 하다.'
		),
		d('ilu', ['형. 앉으시오.', '기다렸소.'], ['Hyung. Sit.', 'We waited.'], { chip: '#c45a3a' }),
		d(
			'sobal',
			['술은 좋은 거요.', '아바지 숨겨 두신 거.'],
			['The wine is the good one.', 'The one Father hid.'],
			{ chip: '#a84838' }
		),
		d('suchun', ['불렀으니, 왔소.'], ['You invited me. I came.'], { chip: '#8b1e2d' }),
		card('suchun', 'He accepted the cup. He had already counted the screens.', '잔을 받았다. 병풍은 이미 세어 두었다.'),
		p(
			'The screens on Ilu’s side breathe. A sleeve. A blade that thinks it is hidden.',
			'일우 쪽 병풍이 숨 쉰다. 소매. 숨은 줄 아는 칼.'
		),
		d('ilu', ['형.', '오늘은… 형한테 할 말이 있어서.'], ['Hyung.', 'Today I… I had something to tell you.'], {
			chip: '#c45a3a'
		}),
		d('suchun', ['하지 마.'], ['Don’t.'], { chip: '#8b1e2d' }),
		p(
			'The other screens drop. His men. The hall becomes a throat.',
			'반대쪽 병풍이 떨어진다. 그의 사람들이다. 전각이 목이 된다.'
		),
		d(
			'sobal',
			['잠깐—', '형, 이건— 우린 그냥—'],
			['Wait—', 'Hyung, this— we were just—'],
			{ chip: '#a84838' }
		),
		d(
			'suchun',
			['불렀으니 온 거다.', '앉으라 한 자리에 앉지 않는다.', '끌어내.'],
			['You invited me. That was the mistake.', 'I don’t sit where I’m told.', 'Take them out.'],
			{ chip: '#8b1e2d' }
		),
		p(
			'The blades come down together. Two heads. The floor learns a new color. Nobody in the hall is surprised except the two who poured.',
			'칼이 같이 내려온다. 머리 둘. 바닥이 새 색깔을 배운다. 전각에서 놀란 사람은, 따른 둘뿐이다.'
		),
		p(
			'The boy is behind a pillar. Not tall enough to see over the table. Tall enough to see the floor.',
			'아이는 기둥 뒤에 있다. 상 너머를 볼 키는 못 된다. 바닥을 볼 키는 된다.'
		),
		card(
			'bongsang',
			'Prince Saburu. He will wear the crown. He will never forget who poured.',
			'왕자 상부. 왕관을 쓸 아이다. 누가 따랐는지는 잊지 않는다.',
			{ look: 'prince' }
		),
		p(
			'He does not make a sound. He watches his uncles leave their necks, and he learns the only lesson a crown ever teaches.',
			'소리는 내지 않는다. 숙부들이 목을 떠나는 걸 본다. 왕관이 가르치는 유일한 수업을 배운다.'
		),
		p(
			'Family is the first knife. A king who forgets that, dies at supper.',
			'가족은 첫 칼이다. 그걸 잊은 임금은 저녁에 죽는다.'
		),
		p(
			'Years later, under a fortress that is not his, a man walks to the market for salt.',
			'몇 해 뒤, 제 것이 아닌 성 아래에서, 사내가 소금을 사러 시장에 간다.'
		),
		scene('The market · under the fortress', '시장 · 성 아래', { weather: 'dusk' }),
		{
			kind: 'map',
			year: 300,
			places: ['pyongyang', 'amnok', 'gungnae'],
			riverNames: true,
			caption: 'A Chinese city on a Goguryeo river. Salt goes in. Tax comes out.',
			ko: '고구려 강 위의 중국 성. 소금이 들어가고, 세금이 나온다.'
		},
		p(
			'The stall has three backs. The old one shouts. The middle one argues. The young one ties.',
			'좌판에 등 셋. 늙은 등이 소리친다. 가운데가 따진다. 젊은 등이 묶는다.'
		),
		p(
			'The fortress sits over them the way a landlord sits over a debt. Red munru. Grey stone. Chinese roofs on a river that has been fighting them for nearly four hundred years, one commandery at a time, and this one is still here.',
			'성은 빚 위에 앉은 주인처럼 그들 위에 앉아 있다. 붉은 문루. 회색 돌. 거의 사백 년째 이 강이 치고 있는 중국 지붕이다. 군현을 하나씩. 이건 아직 남아 있다.'
		),
		d('eummo', ['되. 가득.', '다시.'], ['The measure. Full.', 'Again.'], { chip: '#6b5a48' }),
		d(
			'jaemo',
			['가득이면 밑져.', '사장님은 그걸 몰라?'],
			['Full is how we lose.', 'You the boss and you don’t know that?'],
			{ chip: '#c4a574' }
		),
		d(
			'eummo',
			['나는 사장이야.', '너는 입이야.', '입은 묶여.'],
			['I’m the boss.', 'You’re the mouth.', 'Tie the mouth.'],
			{ chip: '#6b5a48' }
		),
		d('micheon', ['…묶었습니다.'], ['…Tied.'], { chip: '#C30000', look: 'exile' }),
		card('eummo', 'Ummo. The stall is his. The names are not his business.', '음모. 좌판은 그의 것이다. 이름은 그의 일이 아니다.'),
		card('jaemo', 'Jaemo. He talks first and counts later, except when the young one is watching.', '재모. 먼저 떠들고 나중에 센다. 젊은 등이 볼 때는 빼고.'),
		d(
			null,
			['소금. 한 되.', '요즘 값이 왜 이래. 북쪽 임금이 지붕을 올린다며.'],
			['Salt. One measure.', 'Why is it dear. They say the king up north is putting up a roof.'],
			BUYER
		),
		d(
			'micheon',
			['지붕은 못 먹죠.', '된 만큼만 드립니다.'],
			['A roof cannot be eaten.', 'You get what fills the measure.'],
			{ chip: '#C30000', look: 'exile' }
		),
		d(
			null,
			[
				'여기 세금이 더 독해. 손목에 매긴다니까.',
				'사백 년째 이 성이 이 강을 먹고 있어.',
				'북쪽은 군현을 하나씩 부순다며.',
				'여기는 안 건드리고.'
			],
			[
				'Tax is worse here. They put it on the wrist.',
				'This fortress has been eating this river for four hundred years.',
				'They say the north knocks the commanderies down one at a time.',
				'Not this one. Not yet.'
			],
			BUYER
		),
		d(
			'eummo',
			['손님 말 길어.', '소금이나 받아.'],
			['The customer talks long.', 'Take the salt.'],
			{ chip: '#6b5a48' }
		),
		p(
			'The satgat brim lifts. The face comes out slowly. Young. Burned down to the cheek. A sly tired look, the kind you get from counting the same sack twice and still not being sure.',
			'삿갓 챙이 올라간다. 얼굴이 천천히 나온다. 젊다. 볼까지 타 있다. 가마니를 두 번 세고도 아직 확신이 없는 사람의, 슬쩍 지친 표정.'
		),
		p(
			'He does not look at the buyer. He looks up. At the fortress. Red pavilion on grey stone. The look of a man measuring a roof he has not been invited to climb.',
			'손님을 보지 않는다. 위를 본다. 성을. 회색 돌 위의 붉은 전각. 초대받지 않은 지붕을 재는 눈.'
		),
		d(null, ['누구요.', '장수 얼굴이 아니네.'], ['Who are you.', 'That’s not a merchant’s face.'], BUYER),
		d('jaemo', ['우리 애요.', '말 적게 해요, 그 애.'], ['Ours.', 'He doesn’t talk much.'], { chip: '#c4a574' }),
		p('The measure sits between them. A breath. Then another.', '되가 둘 사이에 앉아 있다. 숨. 그리고 한 숨 더.'),
		d('micheon', ['……소금장수요.'], ['……Just a salt merchant.'], { chip: '#C30000', look: 'exile' }),
		card(
			'micheon',
			'He has not used his name since the night his father told him to stop.',
			'아버지가 그만두라 한 밤 이후로, 그는 제 이름을 쓰지 않는다.',
			{ look: 'exile' }
		)
	];

	const bongsangLead = [
		p('They put the crown on the boy who watched.', '보던 아이에게 왕관을 씌운다.'),
		scene('The hall · the first morning', '전각 · 첫 아침', { weather: 'night' }),
		p(
			'He sits. The pillar is still in the room, even if they moved the banquet. He can feel it at his back.',
			'앉는다. 연회를 옮겼어도 기둥은 방에 남아 있다. 등 뒤에 느껴진다.'
		),
		card(
			'bongsang',
			'King Bongsang. He remembers who poured. He will not be poured for.',
			'봉상왕. 누가 따랐는지 기억한다. 당할 생각은 없다.'
		),
		p(
			'Anyone the country likes is a screen with a blade behind it. He starts with the uncle the yards still cheer.',
			'나라가 좋아하는 사람은, 뒤에 칼이 있는 병풍이다. 마당이 아직 환호하는 숙부부터 한다.'
		),
		scene('The yard · a popular uncle', '마당 · 인기 있는 숙부', { weather: 'dusk' }),
		p(
			'Dalga comes in from the wall with dust on the boots. People bow before they remember there is a new king.',
			'달가가 장화에 먼지를 묻히고 성에서 들어온다. 새 임금이 있는 줄 기억하기 전에 사람들이 먼저 절한다.'
		),
		d(
			'bongsang',
			['숙부.', '백성이 숙부 이름을 먼저 부른다며.'],
			['Uncle.', 'They say the people say your name first.'],
			{ chip: '#6e2a2a' }
		),
		d(
			'dalga',
			['전하. 숙신은 제가 막았습니다.', '이름은 벽에 남는 겁니다. 그게 다입니다.'],
			['Majesty. I held the Suksin.', 'A name stays on a wall. That is all it does.'],
			{ chip: '#7a2e2e' }
		),
		d(
			'bongsang',
			['벽에 남는 이름이 문제야.', '내일 복도에서 보자. 짧게.'],
			['A name on a wall is the problem.', 'See me in the corridor tomorrow. Keep it short.'],
			{ chip: '#6e2a2a' }
		),
		d('dalga', ['…예.'], ['…Yes.'], { chip: '#7a2e2e' }),
		p(
			'That spring the popular uncle dies in a corridor. Two men. A door that should have been a door. He does not get his hand to the staff.',
			'그 봄, 인기 있던 숙부가 복도에서 죽는다. 사내 둘. 문이어야 할 문. 지팡이까지 손이 가지 못한다.'
		),
		p(
			'The country mourns a general. The king drinks. That is the first year.',
			'나라는 장수를 애도한다. 임금은 마신다. 첫해다.'
		),
		scene('The inner rooms · after Dalga', '내전 · 달가 다음', { weather: 'night' }),
		p(
			'He stops coming out. Wine. Women who do not get to leave until morning. Ministers wait in the outer hall and learn to like the wait.',
			'나오지 않는다. 술. 아침까지 나가지 못하는 여인들. 대신들은 바깥 전각에서 기다리고, 기다리는 법을 배운다.'
		),
		p(
			'You have seen this king before. A different hall. A different cup. The same closed door. He is not the last man in this book who will hide from a country he is supposed to feed.',
			'이런 임금, 보신 적 있다. 다른 전각. 다른 잔. 같은 닫힌 문. 먹여야 할 나라를 피해 숨는 마지막 사내는 아니다.'
		),
		d(
			'bongsang',
			['문 열지 마.', '간할 거면 내일.', '내일은 없다.'],
			['Don’t open the door.', 'If you’re here to advise me, tomorrow.', 'There is no tomorrow.'],
			{ chip: '#6e2a2a' }
		),
		p(
			'Then the brother they smile at. The one who does not wear a crown, which is, as it turns out, the trick.',
			'그다음, 웃음을 받던 아우. 왕관을 쓰지 않는 쪽. 알고 보니 그게 비결이었다.'
		),
		p('The cup is already on the table. Bronze. Too full. The whole house has been told to drink.', '잔은 이미 상 위에 있다. 놋쇠. 너무 가득하다. 집 전체가 마시라는 명을 받았다.'),
		scene('A doorway · the inner rooms', '문간 · 내전', { weather: 'night' })
	];

	const cupBefore = [
		p(
			'The father stands in a doorway and will not come in. The cup is in his hand. That is how Eulbul knows it is already over.',
			'아버지가 문간에 선 채 들어오지 않는다. 잔이 손에 있다. 을불은 그걸로 이미 끝났음을 안다.'
		)
	];

	night.title = 'The night he was told to run';
	const skipFirst = night.blocks.findIndex((b) => String(b.html ?? '').includes('The father stands in a doorway'));
	if (skipFirst >= 0) {
		night.blocks = [...cupBefore, ...night.blocks.slice(skipFirst + 1)];
	}

	const meetUmmo = [
		p(
			'He runs until the hall is a smell behind him. On a pond road an old man is kicking a sack that will not sit up.',
			'전각이 냄새로만 남을 때까지 달린다. 연못 길에, 늙은 사내가 일어서지 않는 가마니를 차고 있다.'
		),
		d(
			'eummo',
			['야.', '손 있어?', '있으면 들어.', '이름은 내일.'],
			['Hey.', 'You got hands?', 'Then lift.', 'Name tomorrow.'],
			{ chip: '#6b5a48' }
		),
		d('micheon', ['…내일요.'], ['…Tomorrow.'], { chip: '#C30000', look: 'exile' }),
		p(
			'Tomorrow does not come. Ummo puts him on wood, then on stones, then on salt. Seven years. The stall you already saw.',
			'내일은 오지 않는다. 음모는 나무를 시키고, 돌을 시키고, 소금을 시킨다. 일곱 해. 이미 보신 좌판이다.'
		)
	];

	mich.blocks = [
		...opening,
		{
			kind: 'flashback',
			year: '292',
			title: 'The boy who watched',
			blocks: [...bongsangLead, night, ...meetUmmo, ...afterNight]
		},
		...afterFb
	];

	const sameMorning = mich.blocks.findIndex((b) => b.label === 'The market · the same morning');
	if (sameMorning >= 0) {
		mich.blocks.splice(
			sameMorning + 1,
			0,
			p(
				'Ummo is already shouting at the next measure. Jaemo is already lying about the weight. The young one ties, and does not look up again. Not today.',
				'음모는 이미 다음 되를 향해 소리친다. 재모는 이미 무게를 속인다. 젊은 등은 묶고, 다시 올려다보지 않는다. 오늘은.'
			)
		);
	}

	return { ok: true, blocks: mich.blocks.length };
});
