#!/usr/bin/env python3
"""Intensify sensual romance dialogue in story.json (implication-forward)."""

import json
from pathlib import Path

PATH = Path('src/lib/data/story.json')


def D(chip, person, ko_lines, en_lines, speaker=None):
	assert len(ko_lines) == len(en_lines), (person, len(ko_lines), len(en_lines), ko_lines, en_lines)
	d = {'kind': 'dialogue', 'chip': chip, 'lines': ko_lines, 'en': en_lines, 'person': person}
	if speaker:
		d['speaker'] = speaker
	return d


def P(html, ko):
	return {'kind': 'p', 'html': html, 'ko': ko}


def first_key(b):
	if b.get('kind') == 'dialogue':
		en = b.get('en') or []
		return en[0] if en else None
	if b.get('kind') == 'p':
		return b.get('html')
	return None


def replace_span(blocks, start_en_first, end_en_first, new_blocks):
	si = ei = None
	for i, b in enumerate(blocks):
		k = first_key(b)
		if si is None and k == start_en_first:
			si = i
		if si is not None and k == end_en_first:
			ei = i
			break
	if si is None or ei is None:
		return None
	return blocks[:si] + new_blocks + blocks[ei + 1 :]


gotaso_courtship = [
	D(
		'#f472b6',
		'gotaso',
		['손… 닿으면 안 되는 거죠?', '그럼 왜… 제 손목 안쪽에 입이 와 있어요.'],
		['And I’m not supposed to… touch your hand either?', 'Then why… is your mouth on the inside of my wrist.'],
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['안 됩니다.', '…그런데 지금 잡고 계십니다.', '그리고… 제가 거두지 못하고 있습니다.'],
		['You mustn’t.', '…And yet you’re holding it.', 'And… I cannot take it back.'],
	),
	P(
		'Rain finds them once on the palace steps. There is nowhere to look that is not the other’s mouth — and when he finally finds it, he does not kiss her politely.',
		'비는 궁 섬돌에서 한 번 그들을 붙잡는다. 서로의 입 말고 둘 곳이 없다 — 그리고 그가 마침내 그걸 찾았을 때, 예의 바른 키스가 아니다.',
	),
	D(
		'#f472b6',
		'gotaso',
		['젖으셨잖아요.', '…왜 웃어요.', '아. / 입술이… 제 아랫입술을 물고 계셔서요.'],
		['You’re soaked.', '…Why are you smiling.', 'Ah. / Because your mouth… is on my lower lip.'],
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['공주님 머리카락이… 제 소매에 붙어 있어서요.', '떼어 드려야 하는데.', '손이 안 갑니다.', '입도… 안 갑니다.'],
		['Your hair is… caught on my sleeve.', 'I should free it.', 'My hand won’t move.', 'Neither will my mouth.'],
	),
	D(
		'#f472b6',
		'gotaso',
		['그럼 그대로 두세요.', '계속요.', '소매도. 입도.', '저는 이 소매 옆에 평생 서 있을 수도 있어요.', '아니 — 더 가까이요.'],
		[
			'Then leave it.',
			'Leave it there.',
			'The sleeve. The mouth.',
			'I could stand beside this sleeve for the rest of my life.',
			'No — closer.',
		],
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['공주님.', '이러다간… 제가 무너집니다.', '여기서. 섬돌에서.', '사람들 앞에서… 당신을 더 깊이 물 것 같습니다.'],
		[
			'My lady.',
			'If this goes on… I will come apart.',
			'Here. On the steps.',
			'In front of everyone… I am going to bite you deeper.',
		],
	),
]

gotaso_wedding = [
	D(
		'#7aa8d8',
		'pumsuk',
		['…아씨. 손이 차십니다.', '그런데 목덜미는… 뜨겁습니다.'],
		['…My lady. Your hands are cold.', 'But the back of your neck… is hot.'],
	),
	D(
		'#f472b6',
		'gotaso',
		['떨려서요.', '그리고… 품석 공 손이 너무 뜨거워서요.', '허리에 두신 손이요.', '거두지 마세요.'],
		['Because I am shaking.', 'And… because yours are too warm.', 'The hand at my waist.', 'Don’t take it away.'],
	),
	D('#7aa8d8', 'pumsuk', ['무서우십니까?', '제가… 더 가까이 가면.'], ['Are you frightened?', 'If I… come closer.']),
	D(
		'#f472b6',
		'gotaso',
		[
			'아니요.',
			'빨리 아무도 없는 데로 가고 싶어서요.',
			'오늘 밤… 참지 못할까 봐.',
			'아니 — 참기 싫어서요.',
			'옷을… 푸시기 전에 저를 한 번 더 봐 주세요.',
		],
		[
			'No.',
			'Because I want to be somewhere with nobody in it.',
			'Tonight… I’m afraid I won’t be able to hold back.',
			'No — I don’t want to hold back.',
			'Look at me once more… before you undo anything.',
		],
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['…아씨.', '저도 이미…', '입이 말라서… 이름을 제대로 못 부르겠습니다.'],
		['…My lady.', 'I am already…', 'My mouth is so dry… I cannot say your name properly.'],
	),
	D(
		'#f472b6',
		'gotaso',
		['이제 «아씨»라고 부르지 마세요.', '오늘부터는 다르게 부르셔야지요.', '혀로.', '목으로.', '밤새.'],
		[
			'Stop calling me “my lady.”',
			'From tonight you have to call me something else.',
			'With your tongue.',
			'With your throat.',
			'All night.',
		],
	),
	P(
		'Behind the doors the feast falls away. He kisses her as if the year of waiting has been poured into a single breath — careful at first, then open-mouthed, then so deep she makes a sound into him that he will remember for the rest of his short life.',
		'문 너머로 잔치가 멀어진다. 그는 일 년의 기다림을 한 호흡에 담듯 입을 맞춘다 — 처음엔 조심스레, 이내 입을 벌리고, 더 깊이, 그녀가 그 안으로 낸 소리를 그는 짧은 남은 평생 동안 기억한다.',
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['고타소…', '손을 어디에 두어야 할지… 모르겠습니다.', '여기요…?', '아니면… 더 아래요.'],
		['Gotaso…', 'I don’t know… where to put my hands.', 'Here…?', 'Or… lower.'],
	),
	D(
		'#f472b6',
		'gotaso',
		['알고 계시잖아요.', '그냥… 참지 마세요.', '제가 먼저 가르칠게요.', '입술부터. 다시.', '더 깊게.'],
		['You know.', 'Just… don’t hold back.', 'I’ll teach you first.', 'The mouth again. Again.', 'Deeper.'],
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['이러다간… 신랑 구실을 밤새 못할 것 같습니다.', '한 번도… 이렇게 배가 고픈 적이 없습니다.'],
		['At this rate… I won’t last the night as a proper husband.', 'I have never… been this hungry.'],
	),
	D(
		'#f472b6',
		'gotaso',
		['그럼 처음부터 다시 하시면 되죠.', '영원히 — 아까 말했잖아요.', '배고프면… 저를 드세요.'],
		['Then start again from the beginning.', 'Forever — you said so.', 'If you’re hungry… take me.'],
	),
]

feast = [
	P(
		'At the feast the wine finds Pumsuk first. He is twenty-four and has been handed everything he owns, and he has never once sat this close to a woman who was not being careful with him — a woman whose voice alone makes the wine taste like something else.',
		'연회에서 술이 품석을 먼저 찾는다. 스물넷, 가진 것을 모두 받아만 온 사내다. 그리고 그는 자기를 조심스럽게 다루지 않는 여자 곁에 — 목소리만으로 술맛을 바꿔 버리는 여자 곁에 — 이렇게 가까이 앉아 본 적이 없다.',
	),
	D(
		'#c98fb0',
		'gumilwife',
		['앉으셔요.', '제 옆에.', '바람이 덜합니다.', '무릎이… 제 무릎에 닿아도 됩니다.', '아니. / 닿으셔야 해요.'],
		['Sit here.', 'Beside me.', 'There is less wind.', 'Your knee… may touch mine.', 'No. / It should.'],
	),
	D('#7aa8d8', 'pumsuk', ['…자네 남편은.'], ['…Your husband—']),
	D(
		'#c98fb0',
		'gumilwife',
		['창고예요. 새벽까지.', '…장군님은 술을 더 드셔야겠어요.', '손이 아직 예의가 바르네요.', '그 예의를… 제 허리에 좀 내려놓으시죠.'],
		[
			'The stores. Until dawn.',
			'…You need more wine, my lord.',
			'Your hands are still too polite.',
			'Put that politeness… on my waist.',
		],
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['…자리를 옮기겠습니다.', '…옮기겠다고 세 번째 말했습니다.', '그런데… 다리가 말을 안 듣습니다.'],
		['…I should move.', '…That is the third time I have said that.', 'And yet… my legs will not obey.'],
	),
	D(
		'#c98fb0',
		'gumilwife',
		['세고 계셨어요?', '저도 세고 있었는데.', '장군님이 제 입술을 보는 횟수요.', '지금은… 열일곱.'],
		['You were counting?', 'So was I.', 'How many times you look at my mouth.', 'Seventeen… so far.'],
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['…서라벌에서는 아무도 이렇게 말하지 않습니다.', '이렇게… 가깝게 숨 쉬지도 않습니다.'],
		['…Nobody in Surabol talks like this.', 'Nobody… breathes this close.'],
	),
	D(
		'#c98fb0',
		'gumilwife',
		['그럼 서라벌 얘기는 그만하세요.', '여기 계시잖아요.', '제 숨이… 장군님 목덜미에 닿는 데에.'],
		['Then stop talking about Surabol.', 'You are here.', 'Where my breath… is on your throat.'],
	),
	D(
		'#c98fb0',
		'gumilwife',
		['진골 아씨들은 이렇게 안 앉지요?', '저는… 배우지 못해서요.', '다리도. 시선도.', '장군님 허벅지에… 손이 가도 되는지도.'],
		[
			'True Bone ladies do not sit like this, do they.',
			'I… was never taught.',
			'Not the legs. Not the eyes.',
			'Not whether my hand… may go to your thigh.',
		],
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['배우지 마시오.', '…그대로.', '눈이 안 떨어져.', '손도… 거두지 마시오.'],
		['Don’t learn it.', '…Stay as you are.', 'I cannot look away.', 'And… don’t take the hand away.'],
	),
	D(
		'#c98fb0',
		'gumilwife',
		['손을 주십시오.', '귀하신 손은 다른가 해서.', '손바닥을… 제 가슴 위에 올려 볼게요.', '뛰는 게 누구 것인지… 맞춰 보셔요.'],
		[
			'Give me your hand.',
			'To see whether a noble hand feels different.',
			'I’ll put your palm… here.',
			'Guess whose pulse it is.',
		],
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['…여기.', '…떨고 있는 건 접니다.', '아니 —', '둘 다요.'],
		['…Here.', '…I am the one shaking.', 'No —', 'Both of us.'],
	),
	D(
		'#c98fb0',
		'gumilwife',
		['압니다.', '그래서 안 놓는 거고요.', '장군님 손가락 사이에… 제 숨을 넣어도 될까요.'],
		['I know.', 'That is why I am not letting go.', 'May I put my breath… between your fingers.'],
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['…그 이름 말하지 마.', '지금은.', '지금 입술이… 다른 데에 있으니까.'],
		['…Don’t say her name.', 'Not now.', 'Not when my mouth… is somewhere else.'],
	),
	D(
		'#c98fb0',
		'gumilwife',
		['저는 안 했는데요.', '장군님이 하셨어요.', '입술로.', '다시 해 주세요.', '더 깊게.'],
		['I didn’t.', 'You did.', 'With your mouth.', 'Do it again.', 'Deeper.'],
	),
	P(
		'He kisses her the way a boy kisses when he has decided all at once to stop being careful — open, hungry, tasting the wine off her tongue — and she takes his head in both hands and does not let him make it small again. When he tries to pull back for air she follows him into it. The feast goes on somewhere behind them. It is a long moment before either of them remembers that breathing is separate from this.',
		'그는 조심하기를 한꺼번에 그만두기로 한 소년처럼 입을 맞춘다 — 입을 벌리고, 배고프게, 혀에서 술맛을 찾으며. 그리고 예화가 두 손으로 그의 머리를 붙들어, 다시 작게 만들지 못하게 한다. 숨을 쉬려고 물러나면 그녀가 따라와 다시 그 안으로 넣는다. 잔치는 등 뒤 어딘가에서 계속된다. 둘 중 누가 숨과 이것을 따로 생각하게 되기까지는 한참이다.',
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['…잠깐.', '잠깐만.', '이러다… 소리 납니다.'],
		['…Wait.', 'Just — wait.', 'At this rate… I will make a sound.'],
	),
	D(
		'#c98fb0',
		'gumilwife',
		['안 기다립니다.', '소리는… 제 입 안으로 넣으세요.', '아무도 모르게.'],
		['No.', 'Put the sound… into my mouth.', 'Where nobody hears.'],
	),
	P(
		'The second kiss is not careful at all, and it is not his. She bites his lower lip just enough that his hands finally learn where they belong — under silk, at her back, pulling her into the kind of closeness Surabol never taught him.',
		'두 번째는 조금도 조심스럽지 않고, 그가 시작한 것도 아니다. 그녀가 아랫입술을 조금만 문다. 그제야 그의 손이 갈 곳을 배운다 — 비단 아래, 등, 서라벌이 가르쳐 준 적 없는 가까움으로 끌어당기며.',
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['…이러다 제가 성을 잃습니다.', '아니 —', '이미… 잃은 것 같습니다.'],
		['…At this rate I lose this fortress.', 'No —', 'I think… I already have.'],
	),
	D(
		'#c98fb0',
		'gumilwife',
		['지금 성 얘기 하시는 거 맞아요?', '손이… 다른 데에 있는데요.'],
		['Is it the fortress you are talking about?', 'Your hands… are somewhere else.'],
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['…아니오.', '당신 얘기입니다.', '당신 목. 당신 숨. 당신…'],
		['…No.', 'I am talking about you.', 'Your throat. Your breath. Your…'],
	),
	D(
		'#c98fb0',
		'gumilwife',
		['장군님.', '가시기 전에 하나만 두고 가세요.', '밤에… 저를 채운 것으로요.'],
		['My lord.', 'Leave me one thing before you go.', 'Something… that fills me tonight.'],
	),
	D('#7aa8d8', 'pumsuk', ['…무얼.'], ['…What.']),
	D(
		'#c98fb0',
		'gumilwife',
		['반은 장군님인 것.', '그러면 이 성에서 안 늙어도 되는 아이가 하나 생기잖습니까.', '그리고… 저도 빈손으로 안 남고요.'],
		[
			'Something that is half you.',
			'Then there would be one child here who does not have to grow old in this fortress.',
			'And… I would not be left empty.',
		],
	),
	D(
		'#7aa8d8',
		'pumsuk',
		['…그런 아이를 뭐라고 부르는지 알고 있나.', '…알고도. 원하지.', '지금. 여기서. 당신 입술이 아직… 제 것에 닿은 채로.'],
		[
			'…You know what they would call a child like that.',
			'…I know. And I want it.',
			'Now. Here. While your mouth… is still on mine.',
		],
	),
]

maids_early = [
	P(
		'Two court maids attend him — close enough that the air between them feels arranged. He is proud of the number the way a man is proud of a hunger he has not yet failed to satisfy.',
		'궁녀 둘이 그를 모신다 — 그 사이 공기가 이미 정해진 것처럼 가깝게. 그는 그 수효를 자랑스러워한다. 아직 실패해 보지 않은 허기를 자랑하는 사내의 방식으로.',
	),
	D(
		'#e0b155',
		'euija',
		['둘이면 족하다.', '하나는 외롭고, 셋은… 방이 좁아진다.', '좁아지면… 손이 어디에 가는지 모르게 된다.'],
		[
			'Two is enough.',
			'One is lonely, and three… the room grows small.',
			'And when it is small… hands forget where they belong.',
		],
	),
	D(
		'#c9a0a8',
		'courtmaid',
		['폐하.', '오늘은 어느 쪽이 곁에 앉을까요?', '아니면… 둘 다, 숨소리만 나누고 있을까요.', '무릎 사이에… 폐하 손목을 두고.'],
		[
			'Your Majesty.',
			'Which of us sits beside you today?',
			'Or… shall both of us only share your breath.',
			'With Your Majesty’s wrist… between our knees.',
		],
	),
	D(
		'#e0b155',
		'euija',
		['…둘 다 욕심내지 말거라.', '지금은… 지도를 보고 있다.'],
		['…Don’t both be greedy.', 'I am… looking at a map.'],
	),
	D(
		'#c9a0a8',
		'courtmaid',
		['욕심은 폐하 것이잖아요.', '보시니… 이미 알고 계시면서.', '지도보다… 저희 목이 더 가까이 있지 않습니까.'],
		[
			'The greed is Your Majesty’s.',
			'You look at us… as if you already know.',
			'Our throats… are closer than the map.',
		],
	),
	D('#e0b155', 'euija', ['…나는 지금 신라 국경 얘기를 하고 있었다.'], ['…I was talking about the Silla border.']),
	D(
		'#c9a0a8',
		'courtmaid',
		[
			'예, 폐하.',
			'국경 얘기 하실 때 목소리가 제일 좋으세요.',
			'그래서 저희가 자꾸 여쭙는 거고요.',
			'그 목소리로… 저희 이름을 불러 주시면,',
			'옷고름이… 먼저 풀립니다.',
		],
		[
			'Yes, Your Majesty.',
			'Your voice is at its best when you talk about borders.',
			'Which is why we keep asking.',
			'If you say our names… in that voice,',
			'the ties… come undone first.',
		],
	),
]

maids_gesomun = [
	D(
		'#c9a0a8',
		'courtmaid',
		['폐하. 고려는 춥습니다.', '저희로… 녹여 드릴까요?', '입술로. 허벅지로.', '폐하가 지도 보시는 동안에도요.'],
		[
			'Your Majesty. Goguryeo is cold.',
			'Shall we… warm you?',
			'With mouths. With thighs.',
			'Even while you look at the map.',
		],
	),
	D(
		'#e0b155',
		'euija',
		['알고 있다.', '…둘 다 오너라.', '조용히.', '연 장군이… 듣기 전에.'],
		['I am aware.', '…Both of you, come.', 'Quietly.', 'Before Commander Yeon… hears.'],
	),
	D(
		'#c9a0a8',
		'courtmaid',
		['오늘 밤은 둘이 들어가겠습니다.', '폐하를 한 몸으로 감싸기엔… 모자라서요.', '양쪽에서… 동시에요.'],
		[
			'So tonight two of us will come in.',
			'One body isn’t enough… to hold Your Majesty.',
			'From both sides… at once.',
		],
	),
	D(
		'#e0b155',
		'euija',
		['…아첨하지 말거라.', '이미… 몸이 대답하고 있다.'],
		['…Don’t flatter.', 'The body… is already answering.'],
	),
	D(
		'#c9a0a8',
		'courtmaid',
		['아첨이 아니에요.', '손이… 기억하니까요.', '어제 밤 폐하가… 어디에 두라고 하셨는지.'],
		[
			'It isn’t flattery.',
			'The hands… remember.',
			'Where Your Majesty… told them to go last night.',
		],
	),
]

maids_descent = [
	P(
		'Hundreds, by now. Nobody keeps the roll. They no longer have separate duties — only who pours, who steadies his wrist, who is still there when the wine runs out, and who is bold enough to speak while his mouth is busy elsewhere.',
		'이제는 수백이다. 명부를 적는 사람이 없다. 소임은 없다 — 누가 따르는지, 누가 손목을 붙드는지, 술이 떨어지면 누가 남아 있는지, 그리고 폐하의 입이 다른 데에 있는 동안에도 감히 말하는 자가 누구인지뿐.',
	),
	D(
		'#c9a0a8',
		'courtmaid',
		['폐하. 어제 하신 말씀을 오늘 또 하셨습니다.', '…같은 숨으로요.', '저희 쇄골에… 같은 이로요.'],
		[
			'Your Majesty. You said that yesterday, and again today.',
			'…With the same breath on us.',
			'The same teeth… at our collarbones.',
		],
	),
	D(
		'#e0b155',
		'euija',
		['좋은 말이었더냐?', '아니면… 좋은 밤이었더냐.'],
		['Was it good?', 'Or… was it a good night.'],
	),
	D(
		'#c9a0a8',
		'courtmaid',
		['…어제는요.', '몸이 아직 기억해요.', '폐하가 멈추라고 하셔도… 허리가 먼저 대답해요.'],
		[
			'…It was, yesterday.',
			'The body still remembers.',
			'Even if Your Majesty says stop… the hips answer first.',
		],
	),
	D(
		'#c9a0a8',
		'courtmaid',
		['폐하. 젊으실 때 얘기 좀 해 주십시오.', '옷을… 푸시기 전에.', '아니 —', '푸시면서요.', '한 매듭에 한 마디씩.'],
		[
			'Your Majesty. Tell us about when you were young.',
			'Before you… undo anything.',
			'No —',
			'While you undo it.',
			'One word per knot.',
		],
	),
]

haemosu = [
	D(
		'#7fc4e8',
		'haemosu',
		['…멈춰라. 수레를 멈춰.', '저 허벅지…', '물방울이…'],
		['…Stop. Stop the chariot.', 'Those thighs…', 'The water…'],
	),
	D(
		'#8fc4e0',
		'yuhwa',
		['언니. 위에.', '…보고 있어.', '부끄러운 척할까요.', '아니면… 더 보여 줄까요.'],
		['Sister. Above us.', '…He’s watching.', 'Shall I pretend to blush.', 'Or… show him more.'],
	),
	P(
		'The older sisters dive. Yuhwa stays standing, and looks straight up — as if she had been waiting for heaven to notice — and draws her wet hair over one shoulder so that nothing is left to guess.',
		'언니들은 물에 들어간다. 유화는 그대로 서서 위를 똑바로 올려다본다 — 하늘이 알아채기를 기다리고 있던 사람처럼 — 그리고 젖은 머리를 한쪽 어깨로 넘겨, 짐작할 것을 남기지 않는다.',
	),
	D(
		'#7fc4e8',
		'haemosu',
		['…왜 안 숨느냐.', '그렇게 보면…', '내가 내려간다.'],
		['…Why do you not hide.', 'If you look at me like that…', 'I will come down.'],
	),
	D(
		'#8fc4e0',
		'yuhwa',
		[
			'하늘이 매일 내려다보는데.',
			'오늘만 부끄러워하라고요?',
			'…더 가까이 오세요. 보고 싶으시다면.',
			'물속까지요.',
			'손… 어디에 두실지도 정하고 오시고요.',
		],
		[
			'Heaven looks down every day.',
			'Am I to blush only today?',
			'…Come closer, if you wish to see.',
			'Into the water.',
			'And decide… where your hands will go.',
		],
	),
	D(
		'#7fc4e8',
		'haemosu',
		['…이름.', '이름을 알아야… 내려가겠느냐.', '안 그러면… 이름 없이 입을 맞출 테니.'],
		['…Your name.', 'I need it… before I come down.', 'Or… I will kiss you without one.'],
	),
	D(
		'#8fc4e0',
		'yuhwa',
		[
			'먼저 내려오세요.',
			'하늘에서 부르면 명령이니까.',
			'물가에서는… 청으로 들을게요.',
			'입술로 물으시면… 이름으로 대답할게요.',
		],
		[
			'Come down first.',
			'From the sky it’s an order.',
			'At the water… I’ll hear it as a request.',
			'Ask with your mouth… and I’ll answer with my name.',
		],
	),
	P(
		'He comes down. He builds a copper room on the bank that same afternoon — because waiting has become unbearable, and the open sky is suddenly too much company for what he means to do with her.',
		'그는 내려온다. 그날 오후 강가에 구리 방을 짓는다 — 기다림이 견딜 수 없어졌고, 열린 하늘이 갑자기, 그에게 하려 하는 일에는, 너무 많은 동행이어서.',
	),
	D(
		'#8fc4e0',
		'yuhwa',
		['구리는 여름에 뜨겁습니다.', '…만지면 알 수 있어요.', '제 등도요.', '구리에 기대면… 어디에 데었는지 구분 못 하실 거예요.'],
		[
			'Copper gets hot in summer.',
			'…You’ll know if you touch it.',
			'My back, too.',
			'If you press me to it… you won’t tell which burned you.',
		],
	),
	D(
		'#7fc4e8',
		'haemosu',
		['알고 있다.', '손을 거둘 수가 없어서 그렇지.', '입도.'],
		['I am aware.', 'That is why I cannot take my hands away.', 'Or my mouth.'],
	),
	D(
		'#8fc4e0',
		'yuhwa',
		['그럼 떼지 마세요.', '하늘이 보는 동안은.', '보는 동안… 더 깊이요.'],
		['Then don’t.', 'Not while heaven is watching.', 'And while it watches… deeper.'],
	),
]

ibiga = [
	D(
		'#7c6cf0',
		'ibiga',
		['산이여.', '네 어깨가… 구름보다 따뜻하구나.', '허리가… 벼랑보다 가파르고.'],
		['Mountain.', 'Your shoulder… is warmer than cloud.', 'Your waist… steeper than cliff.'],
	),
	D(
		'#c084fc',
		'jeonggyeon',
		['하늘이 왜 내려왔느냐.', '구경이냐.', '아니면… 만지려고.', '만지려면… 무릎부터 꿇어라.'],
		['Why has heaven come down.', 'To look?', 'Or… to touch.', 'If to touch… kneel first.'],
	),
	D(
		'#7c6cf0',
		'ibiga',
		['만지려고.', '보다가… 참을 수가 없어서.', '무릎은… 이미.'],
		['To touch.', 'I looked… and could not hold back.', 'The knees… already are.'],
	),
	D(
		'#c084fc',
		'jeonggyeon',
		['그럼 더 가까이.', '능선은 손님을 오래 붙잡지 않으니.', '오늘 밤은 예외로 두마.', '네 입을… 내 목덜미에 두마.'],
		[
			'Then closer.',
			'Ridges do not keep guests long.',
			'Tonight I will make an exception.',
			'I will keep your mouth… at my throat.',
		],
	),
	D(
		'#7c6cf0',
		'ibiga',
		['네 이름… 바른 경치라.', '보면 볼수록 바르지 않은 생각이 든다.', '네 허벅지 사이로… 하늘을 넣고 싶다.'],
		[
			'Your name… Right View.',
			'The longer I look, the less rightful my thoughts become.',
			'I want to put heaven… between your thighs.',
		],
	),
	D(
		'#c084fc',
		'jeonggyeon',
		['그럼 그릇된 채로 있으라.', '하늘이 산 위에 엎드리는 밤이… 그리 잦지 않으니.', '엎드리거라.', '끝까지.'],
		[
			'Then stay wrongful.',
			'Nights when heaven kneels on a mountain… are not so common.',
			'Kneel.',
			'All the way.',
		],
	),
]

suro = [
	D(
		'#d98fa8',
		'heohwangok',
		['절 데리러 오셨습니까…', '아니면, 이미 저를 보고 계십니까?', '시선이… 제 입술에 멈춰 있는데.'],
		[
			'Have you come to fetch me…',
			'or have you already begun to look?',
			'Your eyes… have stopped on my mouth.',
		],
	),
	D(
		'#e0a33c',
		'suro',
		['…시선을 어디에 두어야 할지 모르겠소.', '두었다가는… 거둘 수가 없을 것 같소.', '입술에서. 목에서. 그 아래로.'],
		[
			'…I do not know where I am supposed to look.',
			'If I look… I may not be able to look away.',
			'From the mouth. The throat. Below that.',
		],
	),
	D(
		'#d98fa8',
		'heohwangok',
		['그럼 거두지 마십시오.', '제가 나중에 고쳐 드릴 테니.', '손으로요.', '천천히요.'],
		['Then don’t.', 'I’ll correct you later.', 'With my hands.', 'Slowly.'],
	),
	D(
		'#e0a33c',
		'suro',
		['…고쳐 주셔도.', '이미 늦은 것 같소.', '이미… 배가 고프오.'],
		['…Even if you correct me.', 'I think it is already too late.', 'I am already… hungry.'],
	),
	D(
		'#d98fa8',
		'heohwangok',
		['늦게 오셔도 됩니다.', '오늘 밤은 길 테니까.', '배고프시면… 저를 먼저 드세요.'],
		['You may arrive late.', 'Tonight will be long enough.', 'If you are hungry… take me first.'],
	),
]

suro_tent = [
	P(
		'Two nights in a tent by the water before anyone may say marriage. By the second dusk he can barely keep his voice steady when she says his name — and she says it into his mouth so he has to swallow it.',
		'혼인이라는 말 전에 물가 장막에서 두 밤. 둘째 날 해질녘이면, 그가 제 이름을 부를 때 왕의 목소리가 겨우 유지된다 — 그리고 그는 그 이름을 왕의 입 안으로 넣어, 삼키게 한다.',
	),
	D(
		'#d98fa8',
		'heohwangok',
		['천천히.', '혀를… 여기.', '제 이름처럼.', '아랫입술.', '그 아래.', '더.'],
		['Slowly.', 'Your tongue — here.', 'The way you say my name.', 'The lower lip.', 'Below that.', 'More.'],
	),
	D(
		'#e0a33c',
		'suro',
		['…이러면 말을 배우겠소.', '못 배우겠소.', '배우기 전에 무너질 것 같소.', '당신 안에서…'],
		[
			'…At this rate I will learn the language.',
			'Or I won’t.',
			'I think I will fall apart first.',
			'Inside you…',
		],
	),
	D(
		'#d98fa8',
		'heohwangok',
		['무너지십시오.', '그러면 제가 매일 밤 다시 세워야 하니까.', '손으로.', '입으로.', '왕이 다시 왕이 될 때까지.'],
		[
			'Then fall.',
			'That way I have to put you back together every night.',
			'With hands.',
			'With mouth.',
			'Until the king is a king again.',
		],
	),
]

munhee = [
	P(
		'She sews it standing, which means she has to stand close enough that he can feel her breathing on his collarbone, and she takes her time, and when the needle pauses it is because her mouth has found the place above his pulse — and Yushin is careful to be looking somewhere else the entire time.',
		'그는 선 채로 꿰맨다. 그러자면 숨결이 그의 쇄골에 닿을 만큼 가까이 서야 한다. 그리고 그는 서두르지 않는다. 바늘이 멈추는 것은, 입이 맥이 뛰는 위를 찾았기 때문이다. 유신은 그동안 내내 다른 데를 보고 있으려 애쓴다.',
	),
	D(
		'#D8258C',
		'chunchu',
		['…손이 참 빠르십니다.', '입술은… 더 빠르고.'],
		['…Your hands are quick.', 'Your mouth… is quicker.'],
	),
	D(
		'#e07fa8',
		'munhee',
		['아니요.', '일부러 늦게 하고 있습니다.', '공의 숨이… 제 손등에 닿을 때까지요.'],
		['No.', 'I am doing it slowly on purpose.', 'Until your breath… is on the back of my hand.'],
	),
	D(
		'#D8258C',
		'chunchu',
		['…왜요.', '이러다… 제가 공을 찢겠습니다.'],
		['…Why.', 'At this rate… I will tear the coat myself.'],
	),
	D(
		'#e07fa8',
		'munhee',
		['공께서 아직 안 가셨으니까요.', '가시기 전에…', '제 허리에 손을 두셔야죠.', '바느질이 끝날 때까지요.'],
		[
			'Because you have not left yet.',
			'Before you leave…',
			'your hand belongs at my waist.',
			'Until the sewing is done.',
		],
	),
	P(
		'He comes back the next day. He does not need anything sewn. He comes back the day after that — and each time she finds a new place on him that needs mending with her mouth.',
		'그는 이튿날 다시 온다. 꿰맬 것은 없다. 그다음 날도 다시 온다 — 그리고 매번, 그는 입으로 기워야 할 자리를 새로 찾아낸다.',
	),
	D(
		'#e07fa8',
		'munhee',
		['오늘은 어디가 찢어지셨습니까?', '아니면… 어디를 찢어 드릴까요.'],
		['And what is torn today?', 'Or… what shall I tear for you.'],
	),
	D(
		'#D8258C',
		'chunchu',
		['…아무 데도.', '아니 —', '여기요.', '입이… 어제 닿았던 데요.'],
		['…Nothing.', 'No —', 'Here.', 'Where your mouth… was yesterday.'],
	),
	D(
		'#e07fa8',
		'munhee',
		['그럼 제가 찢어 드릴까요?', '옷만요.', '아니면… 공의 참는 것도요.'],
		['Shall I tear something for you, then?', 'Only the coat.', 'Or… your restraint as well.'],
	),
	D(
		'#D8258C',
		'chunchu',
		['…그렇게 말씀하시면.', '오늘 밤엔 못 갑니다.', '문 앞에서… 이미 무너지고 있습니다.'],
		[
			'…If you say it like that.',
			'I won’t be able to leave tonight.',
			'I am already… coming apart at the door.',
		],
	),
	D(
		'#e07fa8',
		'munhee',
		['그럼 가지 마세요.', '바느질은… 내일 해도 되니까.', '밤은… 저를 꿰매는 데 쓰세요.'],
		['Then don’t.', 'The sewing… can wait until morning.', 'Spend the night… mending me.'],
	),
]

sosuno = [
	D(
		'#e8563f',
		'jumong',
		['부인.', '장부를 덮으시오.', '내가… 숫자를 못 세겠소.', '당신의 목이… 촛불보다 밝아서.'],
		['Wife.', 'Close the ledger.', 'I… can’t count anymore.', 'Your throat… is brighter than the lamp.'],
	),
	D(
		'#e8a04a',
		'sosuno',
		['숫자를 세는 손이 필요한 건가요.', '아니면 저를요.', '장부 위에… 저를 눕히시려는 건가요.'],
		['Do you need the hand that counts.', 'Or do you need me.', 'Or do you mean… to lay me on the ledger.'],
	),
	D(
		'#e8563f',
		'jumong',
		['둘 다요.', '…아니. 당신만.', '입을… 먼저 주시오.', '숫자는… 나중에.'],
		['Both.', '…No. Only you.', 'Give me your mouth… first.', 'Numbers… later.'],
	),
]

JOBS = [
	(
		'And I’m not supposed to… touch your hand either?',
		'My lady. / If this goes on… I will come apart.',
		gotaso_courtship,
	),
	(
		'…My lady. Your hands are cold.',
		'Then start again from the beginning. / Forever — you said so.',
		gotaso_wedding,
	),
	(
		'At the feast the wine finds Pumsuk first. He is twenty-four and has been handed everything he owns, and he has never once sat this close to a woman who was not being careful with him.',
		'…You know what they would call a child like that.',
		feast,
	),
	(
		'Two court maids attend him — close enough that the air between them feels arranged. He is proud of the number the way a man is proud of a hunger he has not yet failed to satisfy.',
		'Yes, Your Majesty.',
		maids_early,
	),
	(
		'Your Majesty. Goguryeo is cold. / Shall we… warm you?',
		'It isn’t flattery. / The hands… remember.',
		maids_gesomun,
	),
	# already-updated Gesomun start may be split after first pass
	(
		'Your Majesty. Goguryeo is cold.',
		'Where Your Majesty… told them to go last night.',
		maids_gesomun,
	),
	(
		'Hundreds, by now. Nobody keeps the roll. They no longer have separate duties — only who pours, who steadies his wrist, and who is still there when the wine runs out.',
		'Your Majesty. Tell us about when you were young. / Before you… undo anything.',
		maids_descent,
	),
	('…Stop. Stop the chariot.', 'Then don’t. / Not while heaven is watching.', haemosu),
	(
		'Mountain. / Your shoulder… is warmer than cloud.',
		'Then stay wrongful. / Nights when heaven kneels on a mountain… are not so common.',
		ibiga,
	),
	(
		'Have you come to fetch me… / or have you already begun to look?',
		'You may arrive late. / Tonight will be long enough.',
		suro,
	),
	(
		'Two nights in a tent by the water before anyone may say marriage. By the second dusk he can barely keep his voice steady when she says his name.',
		'Then fall. / That way I have to put you back together every night.',
		suro_tent,
	),
	(
		'She sews it standing, which means she has to stand close enough that he can feel her breathing on his collarbone, and she takes her time, and Yushin is careful to be looking somewhere else the entire time.',
		'Then don’t. / The sewing… can wait until morning.',
		munhee,
	),
	('Wife. / Close the ledger. / I… can’t count anymore.', 'Both. / …No. Only you.', sosuno),
]


def apply_to_blocks(blocks):
	cur = blocks
	hits = []
	for start, end, newb in JOBS:
		nxt = replace_span(cur, start, end, newb)
		if nxt is not None:
			cur = nxt
			hits.append(start[:48])
	# flashbacks
	out = []
	for b in cur:
		if b.get('kind') == 'flashback':
			inner, ih = apply_to_blocks(b.get('blocks') or [])
			if ih:
				b = {**b, 'blocks': inner}
				hits.extend('flash:' + x for x in ih)
			out.append(b)
		else:
			out.append(b)
	return out, hits


def main():
	story = json.loads(PATH.read_text())
	updated = []
	for ch in story:
		for e in ch['entries']:
			nb, hits = apply_to_blocks(e.get('blocks') or [])
			if hits:
				e['blocks'] = nb
				updated.append((f"{e.get('year')} {e.get('title')}", hits))

	bad = []
	for ch in story:
		for e in ch['entries']:

			def check(blocks, loc):
				for b in blocks:
					if b.get('kind') == 'dialogue' and len(b.get('lines') or []) != len(b.get('en') or []):
						bad.append((loc, b.get('person'), len(b.get('lines') or []), len(b.get('en') or [])))
					if b.get('kind') == 'flashback':
						check(b.get('blocks') or [], loc)

			check(e.get('blocks') or [], f"{e.get('year')} {e.get('title')}")

	print('UPDATED:')
	for title, hits in updated:
		print(' -', title)
		for h in hits:
			print('    ', h)
	print('BAD', bad)
	print('jobs', len(JOBS), 'hit entries', len(updated))

	PATH.write_text(json.dumps(story, ensure_ascii=False, indent='\t') + '\n')


if __name__ == '__main__':
	main()
