import { editStory } from './story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const S = (label, ko, extra = {}) => ({ kind: 'scene', label, ko, ...extra });
const Sec = (label, ko) => ({ kind: 'section', label, ko });
const Place = (html, ko) => ({ kind: 'place', html, ko });
const Card = (person, caption, ko) => ({ kind: 'card', person, caption, ko });
const D = ({ person, speaker, gender = 'm', en, lines, look, chip }) => {
	const b = { kind: 'dialogue', en, lines };
	if (person) b.person = person;
	if (speaker) {
		b.speaker = speaker;
		b.gender = gender;
	}
	if (look) b.look = look;
	if (chip) b.chip = chip;
	return b;
};

const gyebek = { person: 'gyebek', chip: '#d9b13a' };
const dora = { person: 'yuridora', chip: '#ff9a3d' };
const euija = { person: 'euija', chip: '#e08a2e' };
const chunbok = { person: 'chunbok', chip: '#d4a94e' };
const satek = { person: 'eldersatek', chip: '#b8933f' };
const yunbi = { person: 'elderyunbi', chip: '#7f9b6b' };
const wife = { speaker: "Gyebek’s Wife", gender: 'f' };
const son = { speaker: "Gyebek’s Son", gender: 'm' };

const YURI = [
	P(
		'He wakes on a beach with sand in his teeth and no idea where he is.',
		'입 안에 모래를 문 채 바닷가에서 깨어난다. 여기가 어딘지 모른다.'
	),
	P(
		'The not-knowing is worse than the beach.',
		'모른다는 것이 바닷가보다 더 나쁘다.'
	),
	Place('The island where Baekje sends men it can’t afford to kill.', '백제가 죽이기엔 아까운 사내들을 보내는 섬.'),
	P(
		'Orange trees. Black stone. Women coming up from the water with their nets full, laughing at a joke he did not hear. Nobody is in a hurry. That, more than the sand, is what he cannot parse.',
		'귤나무. 검은 돌. 그물 가득 들고 물에서 올라오는 여자들, 못 들은 농담에 웃는다. 서두르는 사람이 없다. 모래보다 그게 안 읽힌다.'
	),
	D({
		...gyebek,
		en: ['Where is this.', 'How many days.'],
		lines: ['여기가 어딥니까.', '며칠입니까.']
	}),
	D({
		speaker: 'A diver',
		gender: 'f',
		en: ['Tamla, love.', 'And I wasn’t counting.'],
		lines: ['탐라유, 총각.', '난 안 셌는디.']
	}),
	P(
		'He looks north. There is only water.',
		'북쪽을 본다. 물뿐이다.'
	),
	Card(
		'yuridora',
		'Yuri Dora, king of Tamla. He tells stories to men nobody else will talk to.',
		'탐라의 임금 유리도라. 아무도 말을 걸지 않는 사내들에게 이야기를 들려준다.'
	),
	P(
		'The man who finds him is barefoot, and not in a hurry either. He has a folded robe over one arm, undyed, still warm from the sun on a wall.',
		'그를 찾아온 사내는 맨발이다. 서두르지도 않는다. 한쪽 팔에 접은 옷. 물들이지 않은 것. 담에 말려 아직 따뜻하다.'
	),
	D({ ...gyebek, en: ['How many days.'], lines: ['며칠입니까.'] }),
	D({ ...dora, en: ['Ah. It’s no man for greetings you are.'], lines: ['아이고, 인사부터 허는 사름은 아니로구나.'] }),
	D({ ...gyebek, en: ['…How many days.'], lines: ['…며칠입니까.'] }),
	D({ ...dora, en: ['Eleven, so. Better?'], lines: ['열하루. 이젠 됐주?'] }),
	P(
		'It is better. Visibly. The islanders will spend five years noticing that this man is calmed by numbers and unsettled by almost everything else.',
		'나아진다. 눈에 보이게. 섬사람들은 다섯 해에 걸쳐 알게 된다. 이 사내는 숫자로 가라앉고, 그 밖에는 거의 다 흔들린다.'
	),
	P(
		'He takes eleven from a number he has carried since the hall.',
		'그는 교서가 읽힌 대전에서부터 지니고 온 숫자에서 열하루를 뺀다.'
	),
	D({ ...gyebek, en: ['Nine hundred and sixty-one.'], lines: ['구백예순하루.'] }),
	D({ ...dora, en: ['Until what?'], lines: ['무신 날꺼지 말이냐?'] }),
	D({
		...gyebek,
		en: ['Until His Majesty can sign again.', 'Then he sends for me.', 'I need a boat. North.'],
		lines: ['폐하께서 다시 서명하실 수 있을 때까지입니다.', '그때 저를 부르십니다.', '배가 필요합니다. 북쪽.']
	}),
	D({
		...dora,
		en: ['Ha. A man that carries his own calendar about with him.', 'And what is it they call you?'],
		lines: ['허. 달력을 품엉 댕기는 놈이로구나.', '이름은 뭐고?']
	}),
	D({ ...gyebek, en: ['I am called Gyebek.'], lines: ['계백입니다.'] }),
	D({
		...dora,
		en: ['Gyebek? Like geobuk? Sure you’re never called Turtle?'],
		lines: ['뭐? 계백? 거북이엔?']
	}),
	D({
		...gyebek,
		en: ['No. <em>Gye</em> is the stone step, and <em>baek</em> is the eldest.'],
		lines: ['아닙니다. 계(階)는 섬돌이고 백(伯)은 맏이입니다.']
	}),
	D({ ...dora, en: ['…It was a joke I was making.'], lines: ['…농담이주.'] }),
	D({ ...gyebek, en: ['…Ah.'], lines: ['…아.'] }),
	P(
		'He says <em>ah</em> the way another man would say <em>I will write that down</em>. It would be a mistake to read the pause as slowness; somewhere behind those eyes, a ledger has just gained a line.',
		'<em>아</em> 하는 소리가, 다른 사내의 <em>적어 두지</em>와 같다. 그 멈춤을 둔함으로 읽으면 틀린다. 눈 뒤의 장부에 한 줄이 방금 늘었다.'
	),
	S('The robe', '옷'),
	P(
		'Dora holds the robe out and waits. Gyebek’s yellow is stiff with salt. He does not take it.',
		'도라가 옷을 내밀고 기다린다. 계백의 노란 옷은 소금에 뻣뻣하다. 받지 않는다.'
	),
	D({ ...gyebek, en: ['This is the king’s colour.'], lines: ['이건 임금의 색입니다.'] }),
	D({
		...dora,
		en: ['Was.', 'Salt’s a better king than most.', 'Put it on. You’ll scare the oranges.'],
		lines: ['이었주.', '소금이 임금보단 낫다.', '입어. 귤들이 놀래카네.']
	}),
	P(
		'He puts it on. The cloth is plain and sits wrong on a man who has only ever worn a colour someone else chose. Dora nods once, as if a wall had finally taken the right stone.',
		'입는다. 무명이다. 남이 고른 색만 입어 온 사내에게는 앉는 법이 틀리다. 도라가 한 번 끄덕인다. 돌이 겨우 앉은 담처럼.'
	),
	S('The island', '섬'),
	P(
		'They walk. Dora names things as if the names were the whole lesson: the mountain, the women who dive, the walls that let the wind through, the harbour that forgot oranges once and had an army wait at it until somebody remembered.',
		'걷는다. 도라가 이름을 붙인다. 이름이 수업인 것처럼. 산. 물질하는 여자들. 바람 통과하게 쌓은 담. 귤을 한 번 잊어서 군대가 포구에서 기다리다, 누가 기억하고야 끝난 그 포구.'
	),
	D({ ...gyebek, en: ['Baekje.', 'How far.'], lines: ['백제.', '얼마나.'] }),
	D({
		...dora,
		en: ['Far enough that your king can’t shout.', 'Close enough the tide still brings his mail.', 'When he remembers he has any.'],
		lines: ['임금이 소리쳐도 안 들리는 만큼.', '밀물이 편지는 아직 가져오는 만큼.', '편지 있는 줄을 기억허면.']
	}),
	P(
		'Gyebek looks at the water the way he looked at a drill ground. The islanders eat. They sing on the way down to the boats. A child runs past with an orange in each hand and does not ask him his rank.',
		'계백이 연병장 보듯 물을 본다. 섬사람들은 먹는다. 배 내려가며 노래한다. 아이 하나가 귤을 양손에 들고 뛰어간다. 벼슬을 묻지 않는다.'
	),
	D({
		...gyebek,
		en: ['They are not afraid.', 'A country is dying north of this.', 'How do you stay like that.'],
		lines: ['겁이 없습니다.', '이 북쪽에서는 나라가 죽고 있습니다.', '어떻게 그렇게 삽니까.']
	}),
	D({
		...dora,
		en: [
			'Like what.',
			'Eating? Walking?',
			'The affairs of this world are a small noise, Turtle.',
			'Compared with the grand workings of the universe, sure they’re nothing at all.'
		],
		lines: ['어떵.', '밥? 걷기?', '이승 일은 작은 소리여, 거북아.', '우주가 돌아가는 옆에 두면, 아무 것도 아니주.']
	}),
	D({
		...gyebek,
		en: ['‘This world’….', 'Are there other worlds….?'],
		lines: ['‘이승’….', '다른 세상이 있습니까….?']
	}),
	P(
		'Dora laughs. He laughs the way a man laughs when a child has finally asked the right question, and he has been waiting years to be asked.',
		'도라가 웃는다. 아이가 겨우 바른 질문을 했을 때, 몇 해를 기다리다 받은 웃음이다.'
	),
	D({
		...dora,
		en: [
			'There.',
			'See. You can be taught.',
			'Living. Dead. Flower field. And a desk above the lot of them that never comes home for dinner.',
			'Sit or don’t. I tell it either way.'
		],
		lines: [
			'거.',
			'봐라. 배우긴 허네.',
			'이승. 저승. 꽃밭. 그 위에 저녁 먹으러 안 들어오는 책상 하나.',
			'앉든 말든. 나는 어차피 헌다.'
		]
	}),
	D({ ...gyebek, en: ['Which king.'], lines: ['어느 임금입니까.'] }),
	D({
		...dora,
		en: [
			'The only king you need to worry about for now, Turtle, is the Lord of the Living.',
			'이승임금.',
			'Also known as Little Star.',
			'He cheated for the warm side. You’ll like him. You won’t like why.'
		],
		lines: [
			'지금은 그 임금만 걱정허라, 거북아. 이승임금.',
			'이승임금.',
			'소별왕이라고도 허주.',
			'따뜻한 쪽을 속여서 가졌저. 마음에 들 거여. 이유는 안 들 거고.'
		]
	}),
	P(
		'Night. A fire. Two cups. Gyebek does not sit. Dora does not ask him to, which is how you know he will, later.',
		'밤. 불. 잔 둘. 계백은 앉지 않는다. 도라는 앉으라 하지 않는다. 나중에 앉을 줄 아는 표시가 그것이다.'
	),
	D({
		...dora,
		en: ['Sit or don’t.', 'Once there were two suns…'],
		lines: ['앉든 말든.', '옛날에 해가 둘이었저…']
	}),
	P(
		'<b>First night on the island. A fire, two cups, and a storyteller who never asks permission…!</b>',
		'<b>섬의 첫날 밤. 불 하나, 잔 둘, 그리고 허락 따윈 구하지 않는 이야기꾼…!</b>'
	)
];

const GYEBEK = [
	P(
		'He comes off the boat without counting.',
		'그는 세지 않고 배에서 내린다.'
	),
	P(
		'Five years ago that would have frightened him for a week. It does not, now. The island taught him to wait without a number. The rest of the lesson is still on the water behind him.',
		'오 년 전이면 한 주 동안 겁이 났을 일이다. 지금은 아니다. 섬이 숫자 없이 기다리는 법을 가르쳤다. 나머지 수업은 아직 뒤 물에 있다.'
	),
	D({
		speaker: 'The Boatman',
		gender: 'm',
		en: [
			'General Gyebek?',
			'His Majesty’s words. He made me say them back to him twice.',
			'‘The river was cold. I went in. Come home.’'
		],
		lines: [
			'계백 장군이십니까?',
			'폐하의 말씀입니다. 두 번이나 따라 외우게 하셨습니다.',
			'‘강물이 차더라. 들어갔다. 돌아오너라.’'
		]
	}),
	D({ ...gyebek, en: ['…That is three things.'], lines: ['…세 가지요.'] }),
	D({ speaker: 'The Boatman', gender: 'm', en: ['Sir?'], lines: ['예?'] }),
	D({
		...gyebek,
		en: ['He said three things. I heard all three.'],
		lines: ['세 가지를 말씀하셨소. 셋 다 들었소.']
	}),
	S('Sabi', '사비'),
	P(
		'He lands at the White River mouth and rides without changing his clothes. The robe under the armour is plain island cloth. Nobody in the capital has seen him in that colour.',
		'백강 어귀에 내려 옷도 갈아입지 않고 달린다. 갑옷 아래는 섬의 무명이다. 서울에서 그 색을 본 사람이 없다.'
	),
	P(
		'The guards do not know his face any more. The streets do. Two house banners on the same bridge, pointed at each other. A market with the shutters still up at noon. A boy running with a spear too long for him, and nobody telling him to put it down.',
		'문지기들은 이제 그의 얼굴을 모른다. 거리는 안다. 같은 다리 위에 집 깃발 둘, 서로를 가리킨다. 정한낮인데 장옥 문이 아직 닫혀 있다. 창이 너무 긴 아이가 뛴다. 내려놓으라는 사람이 없다.'
	),
	D({
		...gyebek,
		en: ['Whose men.'],
		lines: ['누구 병사요.']
	}),
	D({
		speaker: 'A porter',
		gender: 'm',
		en: ['Satek’s, till the next corner.', 'Then Yunbi’s.', 'Then whoever paid this morning.', 'Don’t stand in the middle, sir. That’s how you get counted twice.'],
		lines: ['사택이유, 저 모퉁이까지는.', '그다음이 윤비고.', '그다음이 오늘 아침 돈 준 쪽이고.', '한가운데 서지 마슈, 나리. 두 번 세는 법이우.']
	}),
	P(
		'He does not stand in the middle. He has learned that much.',
		'한가운데 서지 않는다. 그건 배웠다.'
	),
	S('The loyalists', '남은 사람들'),
	P(
		'He looks for the men who used to tell the king the truth. He finds a cell that has been empty long enough for the straw to go grey. A clerk will not meet his eye.',
		'왕에게 참말을 하던 사람들을 찾는다. 짚이 회색이 될 만큼 오래 빈 방을 찾는다. 서기는 눈을 안 맞춘다.'
	),
	D({ ...gyebek, en: ['Sunchung.'], lines: ['성충.'] }),
	D({
		speaker: 'A clerk',
		gender: 'm',
		en: ['Dead, General.', 'In there.', 'The paper went to His Majesty. I don’t know if he read it.'],
		lines: ['돌아가셨습니다, 장군.', '저기서요.', '종이는 폐하께 올라갔습니다. 읽으셨는지는.']
	}),
	D({ ...gyebek, en: ['Hungsu.'], lines: ['흥수.'] }),
	D({
		speaker: 'A clerk',
		gender: 'm',
		en: ['Posted.', 'Gomamiji.', 'Four years. Nobody recalls a posted man, sir. Not in this court.'],
		lines: ['좌천입니다.', '고마미지.', '사 년입니다. 이 조정에서 좌천된 사람을 부르는 일은, 없습니다.']
	}),
	P(
		'Two names. One grave he cannot see. One road he cannot ride today. He files both, the way he files a count.',
		'이름 둘. 볼 수 없는 무덤 하나. 오늘 갈 수 없는 길 하나. 둘 다 넣어 둔다. 숫자를 넣듯.'
	),
	S('The chair', '자리'),
	P(
		'The Prime Minister’s chair has a young Satek in it. Chunbok smiles the way a man smiles at a procedure he wrote himself.',
		'상좌평 자리에 젊은 사택이 앉아 있다. 춘복이 웃는다. 제가 쓴 절차를 보는 웃음이다.'
	),
	D({
		...chunbok,
		en: [
			'General. As you well know, the houses are counting.',
			'Levies have been requested. They are on the way.',
			'A returned man will understand patience. His Majesty does.'
		],
		lines: [
			'장군. 잘 아시다시피, 가문들이 셈을 하고 있습니다.',
			'병력은 요청해 두었습니다. 오는 중입니다.',
			'돌아온 사람은 기다림을 아실 겁니다. 폐하께서도 그러십니다.'
		]
	}),
	D({ ...gyebek, en: ['How long. On the way.'], lines: ['얼마나. 오는 중이.'] }),
	D({
		...chunbok,
		en: ['A year, as Your— as the records have it.', 'These things take a year.'],
		lines: ['일 년입니다, 폐하— 기록상으로는.', '이런 일은 일 년이 걸립니다.']
	}),
	D({
		...gyebek,
		en: ['The Western ships will not take a year.', 'I need men who will die. Not men who are coming.'],
		lines: ['서선은 일 년을 안 줍니다.', '죽을 사람이 필요합니다. 오는 중인 사람이 아니라.']
	}),
	D({
		...chunbok,
		en: ['Then you will have to scrape, General.', 'The chair can request. It cannot invent a house that wants to fight.'],
		lines: ['그러면 긁어모으셔야죠, 장군.', '이 자리는 요청할 수 있습니다. 싸우고 싶은 가문을 만들 수는 없습니다.']
	}),
	P(
		'Euija meets him in the yard, not the hall. Thinner. Sober, which does not suit him yet. For a moment neither of them says anything, which for Euija is some kind of record.',
		'의자는 대청이 아니라 마당에서 그를 맞는다. 더 말랐다. 술이 깨 있다. 아직 안 어울린다. 한동안 둘 다 말이 없다. 의자로서는 기록에 가까운 일이다.'
	),
	D({
		...euija,
		en: [
			'Turtle!',
			'That’s what they call you down there, isn’t it? The boatman told me.',
			'Ha— suits you mighty fine. You look like you’ve been living under a rock.'
		],
		lines: [
			'거북아!',
			'거기서 너를 그렇게 부른다며? 뱃사공이 그러더라구.',
			'하— 어울린다. 바위 밑에서 살다 온 꼴이구먼.'
		]
	}),
	D({
		...gyebek,
		en: ['Five years.', 'Your Majesty sent for me after four.'],
		lines: ['다섯 해입니다.', '폐하께서는 네 해째에 부르셨습니다.']
	}),
	D({
		...euija,
		en: [
			'…I wrote it the night of the Assembly.',
			'I didn’t send it. The houses were counting, and a careful man said wait a month, and I—',
			'I am the king. I don’t say the same thing twice.'
		],
		lines: [
			'…회의가 있던 그날 밤에 썼다.',
			'보내지 않았다. 가문들이 셈을 하고 있었고, 조심성 많은 놈 하나가 한 달만 기다리라 했고, 과인은—',
			'과인은 임금이여. 같은 말 두 번 안 혀.'
		]
	}),
	D({ ...gyebek, en: ['You explained it once.'], lines: ['한 번 하셨습니다.'] }),
	D({ ...euija, en: ['Then that’s my allowance spent!'], lines: ['그럼 내 몫은 다 쓴 거구먼!'] }),
	P(
		'He laughs first, the way he always does. Then he tells him the rest the way a king gives orders. Western ships for the river mouth. Silla on the eastern road. Fifty thousand between them. He does not dress it.',
		'늘 그렇듯 먼저 웃는다. 그러고는 나머지를 명이듯 말한다. 강 어귀의 서선. 동쪽 길의 신라. 합치면 오만. 꾸미지 않는다.'
	),
	D({
		...euija,
		en: ['Five thousand. That’s the whole purse.', 'The Satek levies are ‘on the way’. They’ve been on the way for a year.'],
		lines: ['오천. 그게 주머니 전부여.', '사택네 사병은 ‘오는 중’이랴. 한 해째 오는 중이지.']
	}),
	D({ ...gyebek, en: ['Where.'], lines: ['어디입니까.'] }),
	D({
		...euija,
		en: ['Wherever you judge.', 'You remember what I told you. The last time.'],
		lines: ['네가 판단하는 곳.', '기억허지? 지난번에 내가 한 말.']
	}),
	D({
		...gyebek,
		en: [
			'‘One day I will give you a stupid order. Judge it yourself.’',
			'‘You are still the king of your own life.’'
		],
		lines: ['‘내가 언젠가 어리석은 명을 내릴 게다. 그때는 네가 판단해라.’', '‘네 삶의 임금은 너다.’']
	}),
	D({
		...euija,
		en: [
			'Word for word. Of course.',
			'This isn’t a stupid order. It’s just a bad one.',
			'You don’t owe me this. The name was a gift.'
		],
		lines: [
			'한 글자도 안 틀리는구나. 그렇지.',
			'이건 어리석은 명이 아니여. 그냥 나쁜 명이지.',
			'너는 이걸 빚진 게 아니다. 이름은 선물이었어.'
		]
	}),
	D({ ...gyebek, en: ['I gave my word.'], lines: ['약조를 했습니다.'] }),
	D({
		...euija,
		en: ['Gyebek— your house. Your wife, the children.', 'Send them to Bear Fortress. Lord Ye’s walls are thick.'],
		lines: ['계백아— 네 집. 처자식 말여.', '웅진성으로 보내라. 예 공의 성벽이 두껍다.']
	}),
	D({
		...gyebek,
		en: ['If Sabi falls, no wall in Baekje is thick.'],
		lines: ['사비가 무너지면, 백제에 두꺼운 성벽은 없습니다.']
	}),
	D({
		...euija,
		en: ['…Then judge it yourself. You always do.'],
		lines: ['…그럼 네가 판단해라. 늘 그랬듯이.']
	}),
	S('The monastery', '산사'),
	P(
		'The two old men still meet at night, at a monastery that belongs to neither of them. They have been leading this country into disorder since Euija was a prince. Exile was only the year they agreed.',
		'두 늙은이는 아직 밤에 만난다. 어느 쪽 것도 아닌 절에서. 의자가 태자이던 때부터 이 나라를 어지럽혀 온 사람들이다. 유배는 둘이 겨우 합의한 해일 뿐이다.'
	),
	P(
		'Gyebek walks in without being counted at the gate. The men in the yard arrange themselves, by habit, into the shape of a fight, and then look at his hands, and stop arranging.',
		'계백이 문에서 세이지 않고 들어간다. 마당의 사람들이 버릇대로 싸움의 모양을 잡다, 그의 손을 보고, 그만둔다.'
	),
	D({
		...satek,
		en: ['The one with no house.', 'We did you a kindness, son. You lived.'],
		lines: ['가문 없는 것.', '호의를 베푼 걸세. 살아서 돌아왔잖나.']
	}),
	D({
		...yunbi,
		en: ['And now you come to the wrong table.', 'The chair is Chunbok’s. We only keep the roads.'],
		lines: ['이젠 틀린 상에 왔구려.', '자리는 춘복이네. 우리는 길만 지킬 뿐이오.']
	}),
	D({ ...gyebek, en: ['The roads are at each other.', 'That ends.'], lines: ['길이 서로를 보고 있습니다.', '그건 끝입니다.'] }),
	D({
		...satek,
		en: ['Spill the cups, then.', 'Tonight the doors matter more than the words.'],
		lines: ['그럼 잔을 엎으시오.', '오늘 밤은 말보다 문이 중요하오.']
	}),
	P(
		'Gyebek does not spill anything. He has one sword. Reverse grip. The ring above the thumb, the way the border taught him, and the way the island never asked him to unlearn.',
		'계백은 아무것도 엎지 않는다. 칼은 하나다. 역수. 엄지 위로 고리. 변방에서 배운 대로. 섬이 버리라 하지 않은 대로.'
	),
	P(
		'Elder Satek starts a sentence about berths. Elder Yunbi starts a sentence about the arm, not the sleeve. Neither sentence finishes. Gyebek does not give a speech. He has never learned how.',
		'사택 어른이 선석 얘기를 시작한다. 윤비 어른이 소매가 아니라 팔 얘기를 시작한다. 어느 문장도 끝나지 않는다. 계백은 연설하지 않는다. 배운 적이 없다.'
	),
	S('Ten thousand', '만'),
	P(
		'He gathers everyone still willing to fight for Baekje. Farmers’ sons. Old border men. A few who stood on the mudbank the day a prince named a boy. He scrapes together ten thousand. Chunbok’s year of coming does not arrive in time to help.',
		'아직 백제를 위해 싸울 사람을 모은다. 농부의 아들. 늙은 변방. 왕자가 아이를 이름 지어 주던 날 뻘에 섰던 몇. 만 명을 긁어모은다. 춘복의 일 년은 돕러 오지 않는다.'
	),
	P(
		'Before he marches he goes home. His wife is in the yard. She has heard; the whole street has heard. She does not ask how many. She has been married to him long enough to know he will tell her the exact number.',
		'출정 전에 집에 들른다. 마당에 아내가 있다. 들었다. 거리 전체가 들었다. 몇이냐고 묻지 않는다. 정확한 숫자를 말할 줄 아는 사람과 오래 살아서다.'
	),
	D({ ...gyebek, en: ['Ten thousand. Against fifty.'], lines: ['만. 오만을 상대로.'] }),
	D({
		...wife,
		en: ['…The boy has been counting since the boat was sighted.', 'He won’t stop till you tell him to.'],
		lines: ['…애가 배 보일 때부터 세구 있어유.', '당신이 그만허라 할 때까지 안 멈출 거유.']
	}),
	D({
		...son,
		en: ['Father! Nine thousand, four hundred and— and twelve!'],
		lines: ['아버지! 구천, 사백— 사백 열둘!']
	}),
	D({ ...gyebek, en: ['You can stop.'], lines: ['그만 세도 된다.'] }),
	D({ ...son, en: ['Was it right, sir?'], lines: ['맞었어유?'] }),
	D({ ...gyebek, en: ['Yes.'], lines: ['그래.'] }),
	P(
		'His wife looks at him for a long time. Then she takes the children inside and leaves the door open, and he goes in after them.',
		'아내는 오래 그를 바라본다. 그러고는 아이들을 데리고 안으로 들어가, 문을 열어 둔다. 그가 뒤따라 들어간다.'
	),
	P(
		'What he does there, he does so that nothing of his can be used against him. He comes out before the light is properly up, with their clothes in a bundle under his arm.',
		'그가 거기서 하는 일은, 그의 것 그 무엇도 적에게 쓰이지 않게 하려는 것이다. 빛이 채 오르기 전에 나온다. 옷이 팔 아래 보따리다.'
	),
	S('The yard · ten thousand', '연무장 · 만'),
	P(
		'He comes back with their clothes. The ten thousand see the bundle before they see his face. Somebody drops a spear. Nobody picks it up.',
		'그는 그 옷을 들고 돌아온다. 만이, 얼굴보다 보따리를 먼저 본다. 누가 창을 떨어뜨린다. 줍는 사람이 없다.'
	),
	D({
		...gyebek,
		en: [
			'We are going toward a death that is almost certain.',
			'Silla and the West. Fifty thousand.',
			'Anyone unwilling to die should leave.'
		],
		lines: [
			'거의 확실한 죽음을 향해 갑니다.',
			'신라와 서. 오만.',
			'죽지 않을 사람은 떠나시오.'
		]
	}),
	P(
		'The crowd shrinks. Men look at the bundle, and at the road, and at each other. Half of them go. Five thousand remain.',
		'무리가 줄어든다. 보따리를 보고, 길을 보고, 서로를 본다. 반이 간다. 오천이 남는다.'
	),
	D({
		...gyebek,
		en: ['Five thousand. Against fifty.', 'For everyone who stayed. I will tell you a story.'],
		lines: ['오천. 오만을 상대로.', '남은 사람들에게. 이야기를 하나 하겠습니다.']
	}),
	P(
		'The yard is swept. Nothing in it is his any more except a black horse at the post. He saddles it himself, counting the buckles under his breath, and when he is done he stands with his forehead against the black neck for exactly as long as it takes to count to ten.',
		'마당은 쓸려 있다. 이제 그의 것은 말뚝의 검은 말뿐이다. 직접 안장을 얹으며 버클을 센다. 끝나면 검은 목에 이마를 댄다. 열을 셀 동안만.'
	),
	P(
		'<b>For the five thousand who stayed, he has a story. It does not begin in this world…!</b>',
		'<b>남은 오천에게, 이야기가 있다. 이승에서 시작하지 않는 이야기다…!</b>'
	)
];

const FAMILY_FB = {
	kind: 'flashback',
	year: '660',
	title: 'The house · 집',
	blocks: [
		P(
			'The door is still open. The boy has stopped counting. His wife has both children behind her, and she has already understood the bundle he has not yet made.',
			'문이 아직 열려 있다. 아이는 세기를 멈췄다. 아내가 두 아이를 뒤에 두고 있다. 아직 안 싼 보따리를, 이미 안다.'
		),
		D({
			...wife,
			en: ['You’re not sending us to the fortress.'],
			lines: ['성으로 안 보내실 거구먼유.']
		}),
		D({ ...gyebek, en: ['No.'], lines: ['아니오.'] }),
		D({
			...wife,
			en: ['Then say it.', 'You always say the number. Say this.'],
			lines: ['그럼 말해 유.', '당신은 늘 숫자를 말하잖어유. 이것도 말허유.']
		}),
		D({
			...gyebek,
			en: [
				'On the island they told me this world is small.',
				'There are other worlds.',
				'Living. Dead. A field of flowers.',
				'We will meet again. After.'
			],
			lines: [
				'섬에서, 이승은 작다고 했습니다.',
				'다른 세상이 있습니다.',
				'이승. 저승. 꽃밭.',
				'다시 만납니다. 그다음에.'
			]
		}),
		D({
			...wife,
			en: ['…That’s a story.', 'Are you sure it’s a true one.'],
			lines: ['…이야기구먼유.', '참말인지, 당신 확실허유.']
		}),
		D({ ...gyebek, en: ['I am sure enough to do this.'], lines: ['이 일을 할 만큼은 확실합니다.'] }),
		D({
			...son,
			en: ['Father. Was the count right.'],
			lines: ['아버지. 셈, 맞았어유?']
		}),
		D({ ...gyebek, en: ['Yes.'], lines: ['그래.'] }),
		P(
			'He is crying. He does not notice until the boy wipes his own face, copying him. His wife does not look away. She has never asked him to be a different kind of man.',
			'운다. 아이가 제 얼굴을 닦으며 따라 하기 전까지, 모른다. 아내는 눈을 피하지 않는다. 다른 종류의 사내가 되라고 한 적이 없다.'
		),
		P(
			'He picks up his blade. Reverse grip. The ring above the thumb. He has counted to ten against a horse’s neck for less than this.',
			'칼을 든다. 역수. 엄지 위로 고리. 말 목에 이마를 대고 열을 센 적이, 이것보다 가벼웠다.'
		)
	]
};

const EXILE_IMAGE_IDS = new Set([
	'satek-clan-2',
	'yunbi-clan-2',
	'gyebek-sig-ridge',
	'gyebek-sig-eye',
	'gyebek-sig-hooves',
	'gyebek-sig-tuck',
	'gyebek-sig-turn',
	'gyebek-sig-impact',
	'gyebek-sig-cut',
	'gyebek-sig-riderless',
	'gyebek-sig-frozen',
	'gyebek-sunset',
	'scene-gyebek-who-am-i-27',
	'exile-order-hall',
	'euija-mourning-fury',
	'ma-gyebek-kneels',
	'exile-queen-bier',
	'exile-gate-count',
	'exile-lantern-festival',
	'exile-footprints',
	'exile-shape-of-fight',
	'exile-name-offer',
	'exile-tent-arrow',
	'exile-watched-cooking',
	'exile-seongchung',
	'exile-berth',
	'scene-euija-anger-f-3',
	'scene-euija-anger-f-2',
	'scene-euija-anger-sing',
	'satek-stele-palm'
]);

editStory((story) => {
	const entry = (t) => story.flatMap((c) => c.entries ?? []).find((x) => x.title === t);
	const cheon = entry('Cheonbok');
	const yuri = entry('Yuri Dora');
	const gye = entry('Gyebek');
	const hw = entry('Hwangsan Field');
	if (!cheon || !yuri || !gye || !hw) throw new Error('missing episode');

	const islandAt = yuri.blocks.findIndex((b) => b.kind === 'section' && (b.label === '섬' || b.ko === '섬'));
	if (islandAt < 0) throw new Error('no island section in Yuri Dora');
	const exile = yuri.blocks.slice(0, islandAt);

	cheon.year = '655';
	cheon.sub = 'Mourning';
	cheon.tone = 'exile, then coup';
	cheon.logline = {
		en: 'Queen Satek dies, and the king loses the right to say no. Two years later he takes the chairs back.',
		ko: '사택왕후가 승하하고, 왕은 ‘안 된다’고 말할 권리를 잃는다. 이 년 뒤, 자리를 도로 가져온다.'
	};
	cheon.blocks = [
		...exile,
		{
			kind: 'scene',
			label: 'The Rock of Politics',
			ko: '정사암',
			year: 657,
			jump: { year: 657, en: 'Two Years Later…', ko: '이 년 뒤…' }
		},
		...cheon.blocks
	];

	const moved = [];
	const kept = [];
	for (const im of yuri.images ?? []) {
		if (EXILE_IMAGE_IDS.has(im.id)) moved.push(im);
		else kept.push(im);
	}
	cheon.images = [...moved, ...(cheon.images ?? [])];
	yuri.images = kept;
	yuri.logline = {
		en: 'He wakes on a beach with sand in his teeth and no idea where he is.',
		ko: '입 안에 모래를 문 채 바닷가에서 깨어난다. 여기가 어딘지 모른다.'
	};
	yuri.tone = 'island folklore — a flashback';
	yuri.thumbnail = 'turtle-beach';
	yuri.blocks = YURI;

	gye.logline = {
		en: 'He comes off the boat without counting. The country he swore to is already eating itself.',
		ko: '그는 세지 않고 배에서 내린다. 약조한 나라는 이미 제 것을 먹고 있다.'
	};
	gye.tone = 'return, purge, last levy';
	gye.blocks = GYEBEK;
	for (const im of gye.images ?? []) {
		if (im.at === 'Then what is yours.') im.at = 'He lands at the White River mouth';
		if (im.at === 'He says goodbye at the water.') im.at = 'He comes back with their clothes';
		if (im.at === 'Somewhere in the') im.at = 'He comes off the boat without counting';
		if (im.at === 'They are waiting at the crossroads') im.at = 'The crowd shrinks';
		if (im.id === 'yellow-banner') im.at = 'Five thousand remain';
		if (im.at === 'Long live Baekje….!') im.at = 'I will tell you a story';
		if (im.at === 'his five thousand set out for the') im.at = 'Five thousand remain';
	}

	const fbI = hw.blocks.findIndex((b) => b.kind === 'flashback' && b.title === 'The bank · 강둑');
	if (fbI < 0) throw new Error('no bank flashback');
	hw.blocks.splice(fbI, 0, FAMILY_FB);

	return true;
});

console.log('applied gyebek-tamla-split');
