import { editStory, entryOf, makeInserter, find } from './story-ops.mjs';

const D = (person, chip, en, lines) => ({ kind: 'dialogue', person, chip, en, lines });
const P = (html, ko) => ({ kind: 'p', html, ko });
const S = (label, ko) => ({ kind: 'scene', label, ko });

function cutRange(blocks, start, end) {
	const s = blocks.findIndex(start);
	const e = blocks.findIndex(end);
	if (s < 0 || e < 0 || e < s) throw new Error(`cutRange failed ${s}..${e}`);
	return blocks.splice(s, e - s + 1);
}

editStory((story) => {
	const entry = entryOf(story, 'silla-tang-war', 'Munmu');
	if (!entry) throw new Error('Munmu not found');
	const blocks = entry.blocks;
	const insert = makeInserter(entry);

	cutRange(
		blocks,
		(b) => b.kind === 'scene' && b.label === 'The First Yard',
		(b) => b.html?.includes('opens on gold, and the yard steps aside')
	);

	cutRange(
		blocks,
		(b) => b.kind === 'scene' && b.label === 'The Outlet',
		(b) => b.html?.includes('wishes he could hear what the water says')
	);

	const sundukKnows = find(entry, 'She is sitting with her feet in the water');
	if (sundukKnows.length !== 1) throw new Error(`sunduk ledge: ${sundukKnows.length}`);
	sundukKnows[0].list.splice(sundukKnows[0].i + 1, 0, {
		kind: 'p',
		html: 'Great-aunt. The queen who sat him down at six and did not laugh. He has known that face longer than he has known his own name in a hall.',
		ko: '큰이모. 여섯 살에 앉혀 놓고 웃지 않던 여왕. 홀에서 자기 이름보다 먼저 안 얼굴이다.'
	});

	if (
		insert('It is the plainest advice anyone has given him in years', [
			S('The Three Who Stayed', '남은 셋'),
			P(
				'The steam at his back is not empty. Three men. No crowns. Salt in one sleeve. A fox mask pushed up on a brow. A high cap crushed in a fist.',
				'등 뒤 김은 비어 있지 않다. 남자 셋. 관은 없다. 소매엔 소금. 여우 가면이 이마에 올라가 있다. 높은 관이 주먹 안에 구겨져 있다.'
			),
			P(
				'He knows the first from a song. Every boy in Surabol learns it before he sits a horse. The south-shore Park who stayed. He has never seen the face.',
				'첫 사람은 노래로 안다. 서라벌 아이면 말 타기 전에 배운다. 남쪽 나루의 박씨. 남은 사람. 얼굴은 처음이다.'
			),
			D('jesang', '#8B5A2B', ['Park Jesang.', 'I served King Nulji.'], ['박제상이오.', '눌지왕을 모셨소.']),
			D('munmu', '#C41E3A', ['I know.', 'We sang you. I was small.', 'You stayed so the princes could leave.'], [
				'압니다.',
				'노래로 들었습니다. 어릴 때요.',
				'왕자들이 떠나게, 형은 남으셨죠.'
			]),
			D('jesang', '#8B5A2B', ['The boats were Momal’s.', 'The hall said Jesang.'], ['배는 모말이 몰았소.', '홀에선 제상이라 했소.']),
			D('munmu', '#C41E3A', ['Nulji is my ninth-generation ancestor.'], ['눌지왕은 제 구대 조상입니다.']),
			P(
				'Jesang goes still. Then he laughs once, the way a man laughs when he has been holding his breath for two hundred years, and he almost sits down in the water.',
				'제상이 멈춘다. 그러고 한 번 웃는다. 이백 년을 숨 참고 있던 사람이 웃는 법이다. 물에 주저앉을 뻔한다.'
			),
			D(
				'jesang',
				'#8B5A2B',
				['He’s—', 'The house held.', 'You’re here. You’re a king.', 'Then it wasn’t for nothing.'],
				['그분이—', '집이 남았군.', '여기 있소. 왕이오.', '그럼 헛일이 아니었소.']
			),
			D(
				'jesang',
				'#8B5A2B',
				['I thought if the line had gone I wouldn’t know who I did it for.'],
				['대가 끊겼으면, 누구를 위해 남았는지 모를 뻔했소.']
			),
			P(
				'The second he knows from Grandfather’s “dreams.” The fox. The clerk. The man who said he would not be late.',
				'둘째는 할아버지의 「꿈」으로 안다. 여우. 서기. 안 늦겠다고 한 사람.'
			),
			D('gildal', '#c45a28', ['Gildal.', 'I served Kim Yongsu.'], ['길달이오.', '김용수를 모셨소.']),
			D(
				'munmu',
				'#C41E3A',
				['Grandfather told me as dreams.', 'I thought you were a goblin.'],
				['할아버지가 꿈이라고 하셨습니다.', '도깨비인 줄 알았습니다.']
			),
			D('gildal', '#c45a28', ['I was a clerk.', 'I was never late.'], ['서기였소.', '늦은 적 없소.']),
			P(
				'The third he saw leave. He was twenty-three. Father’s attendant put on the high cap at the quay and did not come home.',
				'셋째는 떠나는 걸 봤다. 스물셋이었다. 아버지의 수행이 나루에서 높은 관을 쓰고, 돌아오지 않았다.'
			),
			D('ongunhae', '#8a6240', ['On Gunhae.', 'I wore the cap.'], ['온군해요.', '관을 썼소.']),
			D(
				'munmu',
				'#C41E3A',
				['You left with Father.', 'I was on the quay.', 'You didn’t come back.'],
				['아버지를 따라 가셨습니다.', '나루에 있었습니다.', '안 돌아오셨죠.']
			),
			D('ongunhae', '#8a6240', ['The small boat.', 'That was the job.'], ['작은 배요.', '그게 일이었소.']),
			P(
				'Three men. Each stayed so a king could go. They look at him the way you look at the job after it has grown up.',
				'세 사람. 저마다 왕이 가게, 남았다. 일이 다 자란 뒤를 보듯 그를 본다.'
			),
			D('jesang', '#8B5A2B', ['A king decides who stays.'], ['누가 남을지는 왕이 정하는 것이오.']),
			D(
				'gildal',
				'#c45a28',
				['You stay inside.', 'You carry it.', 'A good son does not pay for a bad father.'],
				['안에 남으시오.', '지고 가시오.', '착한 아들이 나쁜 아비 값을 치르지 않소.']
			),
			D('ongunhae', '#8a6240', ['Wear the thing they want.', 'Let the right man leave.'], ['그들이 원하는 걸 쓰시오.', '나가야 할 사람을 내보내시오.']),
			D('munmu', '#C41E3A', ['They want a letter.', 'On my knees. To the West.'], ['편지를 쓰라 합니다.', '무릎 꿇고. 서국에.']),
			D(
				'jesang',
				'#8B5A2B',
				['Sail the boat.', 'Let someone else copy the letter.'],
				['배는 몰으시오.', '편지는 남이 베끼게 두시오.']
			)
		]) !== true
	)
		throw new Error('loyalists insert');

	if (
		insert('Two women have been sitting on the ledge', [
			P(
				'He knows that voice. Aunt Sungman used to dry his hair in the yard. She was queen later. He still stands up when she speaks.',
				'그 목소리는 안다. 승만 이모가 마당에서 머리를 말려 주던 목소리다. 나중엔 여왕이었다. 지금도 그 사람이 말하면 일어선다.'
			),
			P(
				'And Grandmother. She never asked how he was. She told him to sit.',
				'그리고 할머니. 어떻게 지내냐고는 물은 적이 없다. 앉으라고만 했다.'
			)
		]) !== true
	)
		throw new Error('sisters knows insert');

	if (
		insert('Ask who?', [
			S('The Three Kims', '김 셋'),
			P(
				'Two more behind the marshal. One still wearing a Gaya helm indoors. One who looks as if he is about to call for his horse.',
				'대장군 뒤로 둘이 더 있다. 하나는 집 안에서도 가야 투구를 쓰고 있다. 하나는 지금이라도 말을 부를 얼굴이다.'
			),
			P(
				'Mother’s grandfather. Mother’s father. He has never seen the first. He has not seen the second since he was twenty-one.',
				'어머니 쪽 증조. 외할아버지. 첫째는 처음이다. 둘째는 스물하나 이후로 못 봤다.'
			),
			D(
				'munmu',
				'#C41E3A',
				['Great-grandfather.', 'Mother kept your helm on a stand.', 'I wasn’t allowed to touch it.'],
				['증조할아버지.', '어머님이 투구를 받침대에 두셨습니다.', '만지지 못하게 하셨습니다.']
			),
			D('muryuk', '#8B5CF6', ['…You may look now.'], ['…지금은 봐도 됩니다.']),
			D(
				'munmu',
				'#C41E3A',
				['Grandfather.', 'You redid my headband at the gate.', 'I was six.'],
				['외할아버지.', '대문에서 머리띠를 다시 매 주셨습니다.', '여섯 살이었습니다.']
			),
			D('seohyeon', '#3E8EF0', ['I— yes.', 'It sat wrong. I…'], ['그— 그렇소.', '비뚤었소. 내가…']),
			P(
				'They do not look at him first. They look at Yushin. The one they just buried. The boy Muryuk held for one breath. The son Seohyun named in this water.',
				'그를 먼저 보지 않는다. 유신을 본다. 방금 묻은 사람. 무력이 한숨만 안고 간 아이. 서현이 이 물에서 이름을 불러 준 아들.'
			),
			D('muryuk', '#8B5CF6', ['Look at you.'], ['보게.']),
			D('yushin', '#4a8fe0', ['Grandfather.'], ['할아버지.']),
			D('seohyeon', '#3E8EF0', ['No matter what you do—'], ['네가 무엇을 하든—']),
			D('yushin', '#4a8fe0', ['I heard the end.', 'You said you were proud.'], ['끝은 들었습니다.', '자랑스럽다고 하셨습니다.']),
			D('seohyeon', '#3E8EF0', ['I still am.'], ['지금도 그렇소.']),
			P(
				'Then they remember the living one in the water.',
				'그제야 물속의 산 사람을 기억한다.'
			),
			D(
				'muryuk',
				'#8B5CF6',
				['I sold a kingdom so a boy I had not met could keep a sword.', 'You are that boy’s sister’s son.', 'Stay. That is the whole of a king.'],
				['만나지 못한 아이가 칼을 갖게, 나라를 팔았습니다.', '그 아이의 누이 아들이오.', '남으시오. 왕이 할 일은 그게 다요.']
			),
			D(
				'seohyeon',
				'#3E8EF0',
				['You are Munhee’s.', 'You are Kim.', 'If the letter makes you smaller, do not write it.'],
				['문희 아들이오.', '김이오.', '그 편지가 작아지게 하면, 쓰지 마시오.']
			),
			D(
				'yushin',
				'#4a8fe0',
				['I already told you.', 'Write the paper. Don’t chase.', 'Stand.'],
				['이미 말했다.', '종이는 써라. 쫓지 마라.', '서라.']
			),
			D('munmu', '#C41E3A', ['…I heard you.'], ['…들었습니다.'])
		]) !== true
	)
		throw new Error('kims insert');

	if (
		insert('…I heard you.', [
			S('The Outlet', '물 빠지는 곳'),
			P(
				'On the far side of the pool, where the water slips out through a crack in the rock, an old man is sitting on a stone with his feet in the stream. He is not talking to it. He never was. That was the show for the night watch. Tonight the show has nowhere to go.',
				'못 건너편, 바위틈으로 물이 빠져나가는 곳에 한 노인이 돌 위에 앉아 개울에 발을 담그고 있다. 물에 말을 걸고 있지 않다. 원래 안 걸었다. 밤 파수꾼에게 보여 주던 것이다. 오늘 밤은 보여줄 데가 없다.'
			),
			P(
				'Grey topknot, a little crooked. Plain hemp. Ink on his fingers. Golhwa mutters something about goblins and moves her feet away from his.',
				'조금 삐뚤어진 하얀 상투. 수수한 삼베옷. 손가락엔 먹물. 골화가 도깨비가 어쩌고 하고 투덜대더니 그쪽에서 발을 치운다.'
			),
			D('munmu', '#C41E3A', ['…Grandfather?'], ['…할아버지?']),
			D(
				'yongsu',
				'#6a7cb0',
				['Mm.', 'You were under the azaleas. The night of the lanterns.'],
				['음.', '너, 진달래 밑에 있었지. 등불 띄우던 밤에.']
			),
			D('munmu', '#C41E3A', ['You saw me?'], ['보셨어요?']),
			D('yongsu', '#6a7cb0', ['Everyone saw your heel, Bupmin.'], ['네 발뒤꿈치는 다들 봤어, 법민아.']),
			P(
				'Beside him, sitting very straight with her hands folded, is a woman with a wax tablet tucked in her sleeve. She has been there the whole time too. They died on the same night, and they have plainly not been apart since.',
				'그 곁에 손을 모으고 아주 꼿꼿하게 앉은 여인이 있다. 소매에 밀랍판을 넣은 채로. 그녀도 내내 거기 있었다. 둘은 같은 밤에 죽었고, 그 뒤로 떨어진 적이 없는 게 분명하다.'
			),
			P(
				'Gildal comes over from the three. He does not hurry. He was never late.',
				'셋 가운데 길달이 건너온다. 서두르지 않는다. 늦은 적 없는 사람이다.'
			),
			D('gildal', '#c45a28', ['Young lord.'], ['나리.']),
			P('Yongsu is quiet a long time. Then he smiles the late smile.', '용수가 오래 말이 없다. 그러다 한 박자 늦은 웃음을 짓는다.'),
			D('yongsu', '#6a7cb0', ['You’re on time.'], ['제시간에 왔네.']),
			D('gildal', '#c45a28', ['I said I wouldn’t be late.'], ['안 늦겠다고 했소.']),
			D('yongsu', '#6a7cb0', ['I know.', 'I kept the name.'], ['알아.', '이름은 남겨 뒀어.']),
			D('gildal', '#c45a28', ['The children grew.', 'Some of them built.', 'You paid them.'], ['아이들이 컸소.', '어떤 아이는 지었소.', '품삯은 나리 손으로 주셨고.']),
			D('yongsu', '#6a7cb0', ['I did.'], ['그랬지.']),
			P(
				'They do not say the south road. They do not say the knife. Munmu is standing there, and some things you do not say in front of a grandson.',
				'남쪽 길은 말하지 않는다. 칼도 말하지 않는다. 문무가 서 있다. 손자 앞에서는 안 하는 말이 있다.'
			),
			D(
				'chunmyung',
				'#d8a0e8',
				['He hasn’t been talking to the rock.', 'He’s been waiting.', 'Ask him your question.'],
				['돌에다 말한 게 아니야.', '기다리고 있었어.', '어서 물어.']
			),
			D(
				'munmu',
				'#C41E3A',
				['Grandfather. The West wants me on my knees in a letter.', 'Father would have written it and not meant a word. Uncle says write it, paper is cheap. The queen says count the hungry.', 'What do you say?'],
				['할아버지. 서국이 저더러 편지로 무릎을 꿇으랍니다.', '아버지라면 쓰고 한 마디도 진심은 아니었겠죠. 외숙은 쓰라고 합니다. 종이는 싸다고. 여왕께선 굶주린 사람을 세라고 하시고요.', '할아버지는요?']
			),
			D('yongsu', '#6a7cb0', ['I say, who’s counting you?'], ['나는 이렇게 묻지. 누가 너를 세고 있냐?']),
			D(
				'munmu',
				'#C41E3A',
				['The emperor. Every border, every granary. He has a whole office for it.'],
				['황제요. 국경이며 곳간이며 전부요. 그 일만 하는 관청이 따로 있습니다.']
			),
			D(
				'yongsu',
				'#6a7cb0',
				['Then give him something boring to count.', 'A loyal little king. Bad at sums. Always writing thank-you letters.', 'A man who is laughing at you isn’t counting you. I did it for forty years with a stream.'],
				['그럼 지루한 걸 세게 해 줘라.', '충성스러운 조그만 임금. 셈은 못 하고, 맨날 감사 편지나 쓰는.', '너를 비웃는 사람은 너를 세지 않아. 난 개울 하나로 사십 년을 그렇게 했다.']
			),
			D('munmu', '#C41E3A', ['And meanwhile?'], ['그동안엔요?']),
			D(
				'yongsu',
				'#6a7cb0',
				['Meanwhile you build the bridge at night.', 'And pay the masons yourself. Never let a goblin do the heavy part.'],
				['그동안엔 밤에 다리를 놓는 거지.', '석수 품삯은 네 손으로 주고. 무거운 일은 절대 도깨비한테 맡기지 마라.']
			),
			D(
				'chunmyung',
				'#d8a0e8',
				['And when it’s built, tell your son what it cost.', 'Don’t wait as long as he did.'],
				['그리고 다 놓으면, 네 아들한테 그게 얼마 들었는지 말해 줘라.', '저 양반처럼 그렇게 오래 기다리지 말고.']
			),
			P(
				'The old man looks at Gildal, then at the water, and does not laugh at anything that isn’t there.',
				'노인은 길달을 보고, 물을 보고, 없는 것에 대고는 웃지 않는다.'
			)
		]) !== true
	)
		throw new Error('outlet insert');

	if (
		insert('Then the near ones let go', [
			S('The First Yard', '첫 마당'),
			P(
				'The steam in front of the gold will not open yet. A boy in ice-blue comes through it first, laughing as if he just got hit and liked it.',
				'금빛 앞 김은 아직 열리지 않는다. 먼저 얼음빛 옷을 입은 아이가 그 김을 뚫고 나온다. 방금 얻어맞고 좋아서 웃는 얼굴이다.'
			),
			P(
				'He knows the song. Uncle made them learn it before they sat a horse. First Class. The boy who took Gaya and died of grief.',
				'노래는 안다. 외숙이 말 타기 전에 외우게 했다. 제일기. 가야를 따고 슬픔으로 죽은 아이.'
			),
			D('sadaham', '#6fa8ff', ['STILL HERE.', 'Hey. Are you a king?'], ['아직 있어.', '야. 너 왕이야?']),
			D('munmu', '#C41E3A', ['…Sadaham.', 'We sang you.'], ['…사다함.', '노래로 불렀습니다.']),
			D('sadaham', '#6fa8ff', ['You know me. So the song stuck.', 'Wait. Jinheung’s?'], ['알아? 노래가 남았구나.', '잠깐. 진흥 쪽이야?']),
			D('munmu', '#C41E3A', ['Great-great-grandson.'], ['고손입니다.']),
			D('sadaham', '#6fa8ff', ['Mugwan. Look. They still sing us.', 'And he’s HIS.'], ['무관아. 봐. 우리 노래 아직 있어.', '그리고 이 애, 그분 거야.']),
			D('mugwan', '#7aa0c8', ['That’s your song.', '…Tell him we took Gaya.'], ['그건 네 노래야.', '…가야 딴 거 말해 줘.']),
			D('sadaham', '#6fa8ff', ['He knows!'], ['알아!']),
			P(
				'Two more behind them. Not First Class. The western hills. He knows them as the precepts. Uncle would not let them skip the fourth.',
				'그 뒤로 둘이 더 있다. 제일기는 아니다. 서쪽 언덕이다. 계로 안다. 외숙이 네 번째는 빼지 못하게 했다.'
			),
			D('gwisan', '#3d8c4a', ['We kept the fourth.'], ['네 번째는 지켰습니다.']),
			D('chuhang', '#4a7a8c', ['I said it would be the hard one.', 'We kept it anyway.'], ['어렵다고 한 건 나다.', '그래도 지켰지.']),
			D('munmu', '#C41E3A', ['Amak.', 'We said your names every morning.'], ['아마크.', '매일 아침 두 분 이름을 댔습니다.']),
			D('gwisan', '#3d8c4a', ['Yes.'], ['예.']),
			P(
				'Then two boys younger than the apology. Cousin. And the other one. He was on the east slope that day. He saw them go.',
				'그다음엔 사죄문보다 어린 아이 둘. 사촌. 그리고 다른 아이. 그날 동쪽 언덕에 있었다. 나가는 걸 봤다.'
			),
			D('bangul', '#5e9dd8', ['Ride first. Someone has to.'], ['먼저 나가. 누군가는 해야지.']),
			D('gwanchang', '#79b6f2', ['Yes.'], ['예.']),
			D(
				'munmu',
				'#C41E3A',
				['…Yellow Mountain.', 'Cousin. I was on the east slope.', 'I saw you go.'],
				['…황산.', '사촌. 동쪽 언덕에 있었습니다.', '나가는 거 봤습니다.']
			),
			D('gwanchang', '#79b6f2', ['Yes.'], ['예.']),
			P('Then the steam in front of him opens on gold, and the yard steps aside.', '그때 앞 김이 금빛으로 열리고, 마당은 길을 비킨다.')
		]) !== true
	)
		throw new Error('yard insert');

	if (
		insert('the steam is only steam', [
			S('The Empty Seat', '빈 자리'),
			P(
				'The steam does not empty. Two more. Magenta, and a pink he has not seen on a grown woman.',
				'김은 비지 않는다. 둘이 더 있다. 자홍, 그리고 다 큰 여자에게서는 본 적 없는 분홍.'
			),
			P(
				'Sister. He was sixteen. The seat at supper stayed empty and nobody moved it. Father went quiet. He has been counting that year ever since.',
				'언니. 열여섯이었다. 저녁 자리가 비었고 아무도 그 자리를 옮기지 않았다. 아버지는 조용해졌다. 그 해를 지금까지 세고 있다.'
			),
			D('munmu', '#C41E3A', ['Unni—', 'You—'], ['언니—', '언니가—']),
			D(
				'gotaso',
				'#F0A3C0',
				['I can look however I want now.', 'This is closer to how long you’ve been missing me.'],
				['지금은 어떻게든 보일 수 있어.', '네가 그리워한 시간에 더 가깝게.']
			),
			P(
				'He cannot get the next word out. She does not wait. She never waited.',
				'다음 말이 안 나온다. 언니는 기다리지 않는다. 원래 안 기다렸다.'
			),
			D(
				'gotaso',
				'#F0A3C0',
				['Are you eating.', 'Bupmin. Are you eating.', 'Wait. You’re the king.'],
				['밥은 먹어.', '법민아. 밥은 먹어.', '잠깐. 너 왕이야.']
			),
			D('munmu', '#C41E3A', ['Unni.'], ['언니.']),
			D('gotaso', '#F0A3C0', ['Faster. Say it. I missed you too.'], ['빨리. 말해. 나도 보고 싶었어.']),
			P(
				'Father does not put a finger to his lips this time. He lets the boy cry.',
				'이번엔 아버지가 입술에 손가락을 대지 않는다. 울게 둔다.'
			),
			D('chunchu', '#D8258C', ['Bupmin.'], ['법민아.']),
			D('munmu', '#C41E3A', ['Father—'], ['아버지—']),
			D(
				'gotaso',
				'#F0A3C0',
				['The beach.', 'You said everyone has to listen.', 'So go make them.'],
				['그 해변.', '다들 네 말 들어야 한다고 했잖아.', '가서 그렇게 해.']
			),
			D(
				'chunchu',
				'#D8258C',
				['The dream was mine.', 'The kingdom is yours.', 'Don’t stand in the water all night being polite to the dead.'],
				['꿈은 내 것이었다.', '나라는 네 것이다.', '물속에 밤새 서서 죽은 사람들한테 공손히 있지 마라.']
			),
			D('munmu', '#C41E3A', ['I don’t— I don’t want to leave you again.'], ['또— 또 두고 가기 싫습니다.']),
			D('chunchu', '#D8258C', ['I love you.', 'Go.'], ['사랑한다.', '가거라.']),
			D('gotaso', '#F0A3C0', ['Faster. Bupmin. Faster.'], ['빨리. 법민아. 빨리.'])
		]) !== true
	)
		throw new Error('empty seat insert');

	const dawn = find(entry, 'He comes out at first light with wet hair');
	if (dawn.length !== 1) throw new Error(`dawn: ${dawn.length}`);
	Object.assign(dawn[0].b, {
		html: 'He comes out at first light with wet hair, wearing the winter coat his mother packed. Behind him the cave is full. Everyone who came. They do not follow. They watch.',
		ko: '첫새벽에 젖은 머리로 나온다. 어머니가 넣어 준 겨울 외투를 입고. 등 뒤 동굴은 가득하다. 온 사람들. 따라오지 않는다. 본다.'
	});

	return true;
});

console.log('Munmu groups rewritten');
