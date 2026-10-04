import json

PATH = 'src/lib/data/story.json'
TITLE = 'Heaven–Earth King'

CHIP = {
    'yuridora': '#f97316',
    'gyebek': '#8a6f3f',
    'heavenearthking': '#C30000',
    'daebyeol': '#3B6FBF',
    'sobyeol': '#C94040',
    'chongmyeong': '#c9b18f',
    'sumyeongjangja': '#8a7a3a',
}


def p(en, ko):
    return {'kind': 'p', 'html': en, 'ko': ko}


def d(person, ko, en):
    return {'kind': 'dialogue', 'chip': CHIP[person], 'lines': ko, 'en': en, 'person': person}


BLOCKS = [
    p('Told on the first night, before he has agreed to listen to anything. Yuri Dora has a fire going, two cups, and no plan to ask permission.',
      '첫날 밤, 그가 무엇이든 듣겠다고 하기도 전에 들려진 이야기. 유리도라에게는 피워 둔 불과 잔 두 개가 있고, 허락을 구할 생각은 없다.'),
    d('yuridora', ['처음부터 말하마.', '앉든 말든.'], ['I’ll start at the beginning.', 'Sit or don’t.']),
    p('<b>Gyebek</b> stays standing by the door. Yuri Dora starts anyway.',
      '<b>계백</b>은 문가에 선 채로 있다. 유리도라는 그냥 시작한다.'),

    # Two suns, two moons, the dream
    p('In the beginning there were two suns and two moons. By day people dropped in the fields with their hoes still in their hands; by night they froze in their own doorways. Nobody ever had a decent night’s sleep or a decent harvest, and the old died faster than anyone could bury them.',
      '처음에 해는 둘, 달도 둘이었다. 낮에는 사람들이 호미를 쥔 채 밭고랑에 쓰러졌고, 밤에는 제 집 문간에서 얼어 죽었다. 누구도 제대로 자 본 적이 없고 제대로 거둬 본 적도 없었으며, 늙은이들은 묻어 줄 손보다 빨리 죽어 나갔다.'),
    p('Above all of it sat <b>Heaven–Earth King</b>, who ran the living and the dead out of one office and therefore never went home. One night he fell asleep at the desk anyway, and dreamed he was eating: one sun, one moon, swallowed whole, one of each.',
      '그 모든 것 위에 <b>천지왕</b>이 있었다. 산 자와 죽은 자를 한 관청에서 다스렸으니 집에 갈 일이 없었다. 어느 밤 그는 기어이 책상에서 잠이 들었고, 꿈에서 무언가를 먹었다. 해 하나, 달 하나, 통째로, 하나씩.'),
    d('heavenearthking', ['……어.', '하나씩.', '하나씩 먹었다.', '하하— 아들이다. 저걸 쏘아 떨굴 놈.'],
      ['……Huh.', 'One each.', 'I ate one of each.', 'Ha— that’s a son. Someone’s going to shoot those down.']),

    # the Lady of Wisdom and the rice
    p('He comes down to the world to find the mother of that dream, and finds her in the poorest house on the road: a girl the village calls <b>the Lady of Wisdom</b>, a hearth with no fire in it, and a rice jar she does not open in front of guests.',
      '그는 그 꿈의 어미를 찾으러 세상에 내려왔고, 길가에서 가장 가난한 집에서 그를 찾았다. <b>총명아기</b>라는 처녀, 불 없는 아궁이, 손님 앞에서는 열지 않는 쌀독.'),
    d('chongmyeong', ['누구세요.'], ['Who are you.']),
    d('heavenearthking', ['지나가던 사람.', '배고픈.'], ['Someone passing.', 'A hungry one.']),
    d('chongmyeong', ['……앉아 계세요.'], ['……Sit, then.']),
    p('She goes round the back and lifts the lid of the jar. The bottom of it looks up at her. She puts the lid back as if that might help, ties up her hair, and walks across the road.',
      '그는 뒤꼍으로 돌아가 쌀독 뚜껑을 연다. 독 바닥이 그를 올려다본다. 그러면 나아지기라도 할 것처럼 뚜껑을 도로 덮고, 머리를 묶고, 길 건너로 간다.'),
    p('Across the road lives <b>Sumyung Jangja</b>, who is rich the way a flood is wet. He has nine storehouses, a horse that kicks beggars, a dog that bites whatever the horse misses, and a rice measure that comes out a little smaller when he lends and a little larger when he collects.',
      '길 건너에는 <b>수명장자</b>가 산다. 홍수가 젖은 것처럼 부자인 사내다. 곳간이 아홉, 거지를 걷어차는 말 한 마리, 말이 놓친 것을 무는 개 한 마리, 그리고 꿔 줄 때는 조금 작아지고 받을 때는 조금 커지는 됫박이 하나 있다.'),
    d('chongmyeong', ['쌀 한 되만 꿔 주세요.', '손님이 왔어요.'], ['Lend me one measure of rice.', 'I have a guest.']),
    d('sumyeongjangja', ['한 되.', '갚을 땐 두 되.', '손님? 네 집에 올 손님이면 뻔하지.'],
      ['One measure.', 'Two when you pay it back.', 'A guest? Anyone who’d come to your house, I can guess.']),
    d('chongmyeong', ['두 되요.'], ['Two, then.']),
    p('He fills the measure himself, with his back to her.',
      '그는 등을 돌린 채, 제 손으로 됫박을 채운다.'),
    p('She washes it nine times at the well and spends the last of her firewood on it. The king takes the first spoonful. Something in his mouth grinds.',
      '그는 우물가에서 아홉 번을 씻고, 남은 장작을 다 때서 밥을 짓는다. 왕이 첫 숟가락을 뜬다. 입안에서 무언가 서걱거린다.'),
    d('heavenearthking', ['……', '이 집 쌀은 씹는 맛이 있네.'], ['……', 'Your rice has a bit of bite to it.']),
    d('chongmyeong', ['……모래예요.', '아홉 번 씻었는데.'], ['……It’s sand.', 'I washed it nine times.']),
    d('heavenearthking', ['누가 줬어.'], ['Who gave it to you.']),
    d('chongmyeong', ['건너 집이요.', '두 되로 갚기로 했어요.'], ['The house across the road.', 'I said I’d pay back two.']),
    d('heavenearthking', ['두 되.', '모래 섞은 한 되에, 두 되.', '……먹어. 다 먹어. 나 잠깐 나갔다 올게.'],
      ['Two.', 'One measure with sand in it, for two.', '……Eat. Eat all of it. I’m stepping out for a minute.']),

    # The scoundrel
    p('Sumyung Jangja is counting his storehouses, which is how he prays, when the sky over the ninth one goes black at noon. The horse will not kick. The dog gets under the porch.',
      '수명장자는 곳간을 세고 있다. 그것이 그의 기도다. 그때 아홉째 곳간 위 하늘이 한낮에 까맣게 내려앉는다. 말은 차지 않는다. 개는 마루 밑으로 기어든다.'),
    d('sumyeongjangja', ['누구냐.', '하늘 아래 나 건드릴 놈은 없다.'], ['Who’s there.', 'There’s nobody under heaven who can touch me.']),
    d('heavenearthking', ['그래서 위에서 왔지.'], ['That’s why I came from above.']),
    d('sumyeongjangja', ['……뭐, 뭘 원하시오.', '쌀이오? 쌀이면— 두 되, 아니, 열 되, 곳간째로—'],
      ['……W-what is it you want.', 'Rice? If it’s rice— two measures, no, ten, the whole storehouse—']),
    d('heavenearthking', ['모래는 빼고?'], ['Without the sand?']),
    p('The floor of the ninth storehouse opens. The richest man in the world goes down through it, past the dirt and past the dark, into the place under everything where the measures are honest. He is the first one there. He will not be lonely for long.',
      '아홉째 곳간 바닥이 열린다. 세상에서 가장 부자인 사내가 그리로 떨어진다. 흙을 지나고 어둠을 지나, 모든 것의 밑, 됫박이 정직한 곳으로. 그가 처음 도착한 자다. 오래 외롭지는 않을 것이다.'),

    # The marriage and the tokens
    p('He goes back across the road. He stays until the day the calendar allows, and the morning after, he is already tying his sleeves.',
      '그는 길을 건너 돌아온다. 날을 받은 그날까지 머물고, 그다음 날 아침에는 벌써 소매를 묶고 있다.'),
    d('chongmyeong', ['가세요?'], ['You’re going?']),
    d('heavenearthking', ['위에 일이 많아.', '해가 둘이잖아.'], ['Lots of work upstairs.', 'There are two suns, remember.']),
    d('heavenearthking', ['아들 둘이다. 먼저 나온 놈은 대별, 나중 놈은 소별.', '열다섯 되면 이거 심으라 해.'],
      ['Two sons. The first one out is Daebyeol, the second one Sobyeol.', 'When they turn fifteen, have them plant these.']),
    p('Two gourd seeds in her palm, and half of a wooden comb. The other half goes into his sleeve.',
      '그의 손바닥에 박씨 두 알, 그리고 얼레빗 반쪽. 나머지 반쪽은 왕의 소매 속으로 들어간다.'),
    d('chongmyeong', ['……열다섯 해요.'], ['……Fifteen years.']),
    d('heavenearthking', ['……', '밥 잘 먹었다.'], ['……', 'Thanks for the rice.']),

    # The twins
    p('She has twins. The elder comes out quiet and looks at everything. The younger comes out already complaining. They grow up under two suns and two moons, and get asked whose sons they are in every yard in the village.',
      '그는 쌍둥이를 낳는다. 형은 조용히 나와 모든 것을 둘러보고, 아우는 나오면서부터 투덜댄다. 둘은 해 둘, 달 둘 아래서 자라고, 마을 마당마다 누구네 아들이냐는 소리를 듣는다.'),
    d('sobyeol', ['엄마. 우리 아버지 누구야.', '애들이 또 놀려.'], ['Mom. Who’s our father.', 'The other kids are at it again.']),
    d('daebyeol', ['그만해. 엄마 피곤하셔.'], ['Leave it. Mom’s tired.']),
    d('chongmyeong', ['……열다섯 되면.'], ['……When you’re fifteen.']),
    p('At fifteen she puts the seeds in their hands and the half comb in the elder’s. They plant them by the wall at dusk. By morning the vine has gone past the roof, past the clouds, and out of sight.',
      '열다섯이 되자 그는 두 아들 손에 박씨를 쥐여 주고, 형의 손에는 빗 반쪽을 쥐여 준다. 둘은 해 질 녘 담 밑에 씨를 심는다. 아침이 되자 넝쿨은 지붕을 넘고 구름을 넘어 보이지 않는 데까지 올라가 있다.'),
    d('chongmyeong', ['올라가.', '끝까지.'], ['Climb.', 'All the way up.']),
    d('sobyeol', ['엄마는?'], ['What about you?']),
    d('chongmyeong', ['난 여기 있어. 밥 해 놓을게.'], ['I’ll be here. I’ll have rice on.']),
    p('Sobyeol gets to the top first and pretends he wasn’t racing. The man at the top of the vine holds out his hand without getting up.',
      '소별이 먼저 꼭대기에 닿고는 내기한 적 없는 척한다. 넝쿨 끝에 있던 사내는 일어나지도 않고 손을 내민다.'),
    d('heavenearthking', ['빗.'], ['The comb.']),
    p('Daebyeol puts the half in his palm. The king takes the other half out of his sleeve, where it has been for fifteen years, and fits them. The teeth close.',
      '대별이 반쪽을 그 손바닥에 올린다. 왕은 열다섯 해 동안 소매 속에 있던 나머지 반쪽을 꺼내 맞춘다. 빗살이 맞물린다.'),
    d('heavenearthking', ['……맞네.'], ['……Fits.']),
    d('sobyeol', ['한 번도 안 내려왔잖아요.'], ['You never came down. Not once.']),
    d('heavenearthking', ['……해가 둘이었어.'], ['……There were two suns.']),

    # The shooting
    p('He has a thousand geun of iron melted down into two bows and two arrows, heavy enough that nobody but a son of his could draw them, and walks the boys to the edge of the sky.',
      '그는 무쇠 천 근을 녹여 활 둘과 살 둘을 만들게 한다. 그의 아들이 아니면 아무도 당기지 못할 무게다. 그리고 두 아들을 하늘 끝까지 데리고 간다.'),
    d('heavenearthking', ['해 둘, 달 둘.', '열다섯 해 동안 네 엄마 지붕 위에 둘씩 떴다.', '하나씩.'],
      ['Two suns, two moons.', 'Two of each over your mother’s roof for fifteen years.', 'One each.']),
    p('Daebyeol takes the sun at noon. He breathes out once and lets go, and the second sun breaks like a plate. Its pieces scatter east and stay there as stars. At midnight Sobyeol draws on the second moon and hits it square, and its pieces go west.',
      '대별은 한낮에 해를 맡는다. 숨을 한 번 내쉬고 놓자, 두 번째 해가 접시처럼 깨진다. 그 조각들은 동쪽으로 흩어져 별로 남는다. 한밤중에 소별이 두 번째 달을 겨누어 정통으로 맞히고, 그 조각들은 서쪽으로 흩어진다.'),
    d('sobyeol', ['형. 한 번에 맞혔다.', '봤지?'], ['Brother. Got it in one.', 'You saw?']),
    d('daebyeol', ['봤다.'], ['I saw.']),
    p('In the morning people go out to the fields and do not fall down. That night they sleep. Nobody thanks anyone, because nobody knows who to thank.',
      '아침에 사람들은 밭에 나가서도 쓰러지지 않는다. 그날 밤에는 잠을 잔다. 아무도 누구에게 고맙다고 하지 않는다. 누구에게 해야 할지 아무도 모르니까.'),
    d('heavenearthking', ['됐다. 세상은 너희 거다.', '산 쪽이랑 죽은 쪽. 누가 어디 갈지는 둘이 정해.', '나는 안 정한다. 내가 정하면 꼭 나중에 따지더라.', '나는 쉰다.'],
      ['Done. The world’s yours.', 'The living side and the dead side. You two decide who takes which.', 'I’m not deciding. Whoever I pick always comes back to argue.', 'I’m resting.']),

    # The riddles
    p('They decide it the way brothers decide things. Daebyeol proposes riddles, which suits the one who knows the answers.',
      '둘은 형제들이 일을 정하는 식으로 정한다. 대별이 수수께끼를 내자고 한다. 답을 아는 쪽에게 어울리는 방법이다.'),
    d('daebyeol', ['어떤 나무는 평생 잎이 안 지고, 어떤 나무는 잎이 지느냐.'],
      ['Which trees keep their leaves all their lives, and which ones drop them?']),
    d('sobyeol', ['속이 꽉 찬 나무는 안 지고, 속 빈 나무는 지지.'], ['Solid ones keep them. Hollow ones drop them.']),
    d('daebyeol', ['설운 동생아, 모르는 말 마라.', '청대랑 갈대는 마디마디 비었어도 잎이 안 진다.'],
      ['Poor little brother, don’t talk about what you don’t know.', 'Bamboo and reeds are hollow at every joint, and they keep their leaves.']),
    d('sobyeol', ['……하나 더.'], ['……Another.']),
    d('daebyeol', ['어째서 동산 풀은 짧고, 구렁 풀은 기냐.'], ['Why is the grass short on the hill and long down in the hollow?']),
    d('sobyeol', ['봄비 오면 동산 흙이 구렁으로 쓸려 내려가니까.'], ['Spring rain washes the hill’s dirt down into the hollow.']),
    d('daebyeol', ['그럼 사람 머리털은 왜 길고, 발등 털은 짧으냐.'],
      ['Then why is the hair on your head long and the hair on your feet short?']),
    d('sobyeol', ['……', '그건 반칙이지.'], ['……', 'That one’s cheating.']),

    # The flowers
    p('Two for two. Their father, who said he would not decide anything, leans over the edge of his rest and drops two flower seeds between them.',
      '둘에 둘. 아무것도 정하지 않겠다던 아버지가 쉬던 자리에서 몸을 기울여, 둘 사이에 꽃씨 두 알을 떨어뜨린다.'),
    d('heavenearthking', ['꽃.', '잘 피우는 놈이 이승.', '……더는 안 끼어든다.'],
      ['Flowers.', 'Whoever grows the better one gets the living side.', '……That’s me done interfering.']),
    p('They plant them in two silver basins and sit up with them. Daebyeol’s flower comes up green and keeps coming, and by the third evening it has opened. Sobyeol’s comes up yellow and leans.',
      '둘은 은동이 두 개에 씨를 심고 곁을 지킨다. 대별의 꽃은 푸르게 올라와 멈추지 않고, 사흘째 저녁에는 활짝 핀다. 소별의 꽃은 누렇게 올라와 기운다.'),
    d('sobyeol', ['형. 자자.', '아침에 보자. 누가 잘 피웠는지.'], ['Let’s sleep, Brother.', 'We’ll look in the morning. See whose did better.']),
    d('daebyeol', ['그래.'], ['All right.']),
    p('Daebyeol sleeps the way honest men sleep, all the way down. Sobyeol lies on his side and counts his brother’s breathing up to a hundred. Then he gets up, trades the basins, and lies down again in the same shape, so his brother will wake first.',
      '대별은 정직한 사람이 자듯 잔다. 바닥까지. 소별은 모로 누워 형의 숨을 백까지 센다. 그러고는 일어나 은동이를 바꿔 놓고, 똑같은 모양으로 다시 눕는다. 형이 먼저 깨도록.'),
    d('sobyeol', ['……형! 일어나 봐!', '이거 봐, 내 거!'], ['……Brother! Wake up!', 'Look, it’s mine!']),
    p('Daebyeol looks at the open flower in front of his brother, the one he watered for three days. He looks at the yellow one by his own hand.',
      '대별은 아우 앞의 활짝 핀 꽃을 본다. 사흘 동안 제가 물을 준 꽃이다. 그리고 제 손 옆의 누런 꽃을 본다.'),
    d('daebyeol', ['……', '그래. 네 꽃이 잘 피었구나.'], ['……', 'Yes. Your flower did well.']),
    p('He gets up and brushes the soil off his knees.',
      '그는 일어나 무릎의 흙을 턴다.'),
    d('daebyeol', ['아우야, 이승에는 수많은 사람들이 산다. 그중에는 도둑놈도 있으며 사기꾼도 있지. 그들을 잘 다스리려면 힘과 슬기도 필요하지만 무엇보다도 참된 마음이 있어야 한다. 그러니 그들을 다스려서 아름답고 평화로운 세상을 만들기 바란다.'],
      ['Brother, countless people live in the mortal world. Among them are thieves and swindlers. To govern them well you need strength and wisdom — but above all, a true heart. So govern them, and make a beautiful, peaceful world.']),
    p('He is already walking toward the dark edge when he says the rest, and he does not turn round.',
      '나머지 말은 이미 어두운 끝 쪽으로 걸어가면서 한다. 돌아보지는 않는다.'),
    d('daebyeol', ['그런데 아우야. 훔친 꽃으로 받은 세상이다.', '이승엔 살인이 많고, 역적이 많고, 도둑이 많고, 남의 계집 남의 사내 넘보는 일이 많을 거다.', '저승법은 맑을 거고.'],
      ['But, little brother. You took it with a stolen flower.', 'The living world will have plenty of murder, plenty of treason, plenty of thieves, and plenty of people reaching for other people’s wives and husbands.', 'The law down below will run clear.']),
    d('sobyeol', ['……형!', '형, 그건—'], ['……Brother!', 'Brother, that’s—']),
    p('<b>Big Star</b> goes down. <b>Little Star</b> keeps the warm side.',
      '<b>대별왕</b>은 내려간다. <b>소별왕</b>은 따뜻한 쪽을 갖는다.'),

    # The weighing
    p('It goes the way his brother said, and worse, because Sobyeol had never thought about the parts he didn’t want. The trees still talk. So do the birds, the cattle and the stones, mostly about him. When a mother calls her son’s name at dusk a ghost answers too, and the living and the dead walk the same roads in the same clothes, and nobody can tell which is which.',
      '형이 말한 대로 된다. 더 나쁘게. 소별은 갖고 싶지 않은 쪽은 생각해 본 적이 없었으니까. 나무가 아직 말을 한다. 새도, 소도, 돌도 말을 한다. 대개 그의 이야기다. 해 질 녘 어미가 아들 이름을 부르면 귀신도 대답을 하고, 산 자와 죽은 자가 같은 옷을 입고 같은 길을 걸어, 누가 누군지 아무도 모른다.'),
    d('sobyeol', ['형님.', '형님, 한 번만 도와주오.', '나무가 말을 하오. 귀신이 대답을 하오. 누가 사람이고 누가 귀신인지 모르겠소.'],
      ['Brother.', 'Brother, help me, just this once.', 'The trees talk. The ghosts answer. I can’t tell who’s a man and who’s a ghost.']),
    p('Big Star comes up. He scatters five measures of pine-bark powder over the world, and the trees and the birds and the cattle go quiet and have stayed quiet since. Then he hangs a scale from the sky.',
      '대별왕이 올라온다. 송피 가루 닷 말을 세상에 뿌리자 나무와 새와 짐승이 입을 다물고, 그 뒤로 다시는 말하지 않는다. 그러고는 하늘에 저울을 건다.'),
    d('daebyeol', ['줄 서.', '백 근 넘으면 이승에 남아라.', '못 넘으면, 따라와.'],
      ['Line up.', 'A hundred geun or more, you stay up here.', 'Less, you come with me.']),
    d('sobyeol', ['……그럼 도둑은? 사람 죽이는 놈들은?'], ['……And the thieves? The ones who kill people?']),
    d('daebyeol', ['그건 네 꽃이다.'], ['Those are your flower.']),
    p('He goes back down with the light ones following him in a long quiet line. Since then the dead weigh less than the living, the law below runs clear, and the law up here belongs to Little Star. Under Big Star, <b>Yumla</b> judges, and the measures are honest.',
      '그는 가벼운 자들을 긴 침묵의 줄로 거느리고 다시 내려간다. 그 뒤로 죽은 자는 산 자보다 가볍고, 아래의 법은 맑고, 위의 법은 소별왕의 것이다. 대별왕 아래서는 <b>염라</b>가 판결하고, 됫박이 정직하다.'),

    # The listener
    p('The fire has gone low. Gyebek sat down at some point and does not remember when.',
      '불이 사위었다. 계백은 언젠가 앉았는데, 언제였는지 기억하지 못한다.'),
    d('gyebek', ['……형이 알았습니까. 꽃을 바꾼 걸.'], ['……Did the brother know. That the flowers were switched.']),
    d('yuridora', ['알았지.'], ['He knew.']),
    d('gyebek', ['그런데도 줬습니까.'], ['And he gave it up anyway.']),
    d('yuridora', ['줬지. 그리고 밑으로 갔다.', '밑이 저승, 여기가 이승. 서쪽 끝에 꽃밭이 하나 더 있고, 그 위로 환인 어른이 계시다.', '다 합쳐 삼계라 한다. 오늘 밤은 둘만 알면 된다.'],
      ['He did. And he went down.', 'Down there is the dead world, up here the living. There’s a flower field out at the western end, and above all of it, old Lord Hwanin.', 'Three Realms, all told. Tonight you only need the two.']),
    d('gyebek', ['……모래 섞인 쌀.'], ['……Rice with sand in it.']),
    d('yuridora', ['응?'], ['Hm?']),
    d('gyebek', ['아닙니다.'], ['Nothing.']),
    p('It is the first story on the island he does not inspect.',
      '섬에서 들은 이야기 중, 그가 검사하지 않은 첫 번째 이야기다.'),
    {'kind': 'moral', 'label': 'The telling',
     'html': 'The world was not given to the better brother. Stop waiting for it to behave as if it was.',
     'ko': '세상은 더 나은 형제에게 주어지지 않았다. 그런 척 굴기를 기대하지 마라.'},
]

INK = (
    'STRIKING INK PAINTING. Joseon sumi ink on raw paper with EXTREME LIGHT AGAINST DARK: huge saturated masses of black ink '
    'set against blinding bare paper; light is always the unpainted paper itself, never painted white; almost no mid-grey; hard '
    'edges where light meets dark, wet bleeding edges everywhere else. Splashed ink, dry-brush flying white, ink spatter. Monumental '
    'emptiness and one graphic device. {accent} Figures in confident calligraphic brush line; faces match the attached portraits, '
    'translated into a few ink strokes. Not photoreal, not webtoon shading, not watercolor, not oil, no glow, no halo. Dramatic angle. '
    'Composed for a 2:1 letterbox crop; nothing important at the top or bottom edge. No text, no calligraphy, no seal stamp, no watermark.'
)
RED = 'The only colour is one cinnabar wash.'
BLUE = 'The only colour is one indigo wash.'
NONE = 'No colour at all, black ink and paper only.'

HEK = '/ch_heaven_earth_king.png'
BIG_Y, LIT_Y = '/ch_big_star_young.png', '/ch_little_star_young.png'
BIG, LIT = '/ch_big_star.png', '/ch_little_star.png'


def slot(id, tone, at, alt, people, refs, scene, accent):
    return {'id': id, 'ratio': 2, 'tone': tone, 'at': at, 'alt': alt, 'people': people, 'refs': refs,
            'prompt': scene + ' ' + INK.format(accent=accent)}


INK_SLOTS = [
    slot('hek-ink-two-suns', '#111111', 'two suns and two moons. By day',
         'Ink: two suns burn as bare paper holes in a black sky; tiny farmers fall in the furrows',
         [], [],
         'Low wide. The sky is a solid mass of black ink with TWO suns burned out of it as perfect discs of bare white paper, side by side. Below, cracked furrows in dry-brush, and three tiny farmers fallen with hoes still in their hands, drawn in a few strokes. No faces.',
         NONE),
    slot('hek-ink-dream', '#C30000', 'one sun, one moon, swallowed whole',
         'Ink: Heaven–Earth King asleep at his desk, a sun and a moon sliding into his open mouth',
         ['heavenearthking'], [HEK],
         'Worm’s-eye at the desk edge. Heaven–Earth King asleep, head thrown back, mouth open; above him a white paper sun and a black ink moon pour down into his mouth like water. His half-white, half-black-and-red robe sprawls in wet ink. Black void around the lamp-white page of the desk.',
         RED),
    slot('hek-ink-jar', '#c9b18f', 'a rice jar she does not open in front of guests',
         'Ink: in a black hut, a girl lifts the lid of an empty rice jar; a stranger waits in the white doorway',
         ['heavenearthking'], [HEK],
         'Interior almost all black ink. One blinding white doorway rectangle; in it, small, a stranger sits waiting, silhouette with a topknot and a bow. Foreground, huge: a girl’s hands lifting the lid of an earthenware rice jar, the inside of the jar bare white and empty. Her face is turned away and hidden by her hair; do not draw her face.',
         NONE),
    slot('hek-ink-measure', '#8a7a3a', 'He fills the measure himself',
         'Ink: the scoundrel’s back fills the frame as he pours sand into the rice measure',
         [], [],
         'Over-the-shoulder from behind a fat rich man whose back is a huge black ink mass filling two-thirds of the frame, his face never seen. His hands pour rice into a square wooden measure and, from his sleeve, a thin trickle of sand that catches the light as bare paper. Beyond him, tiny in a white gap, a girl waits at the gate with her head down. Nine storehouse roofs as black wedges.',
         NONE),
    slot('hek-ink-sand', '#C30000', 'Your rice has a bit of bite to it.',
         'Ink: Heaven–Earth King stops chewing, a grain of sand white on the spoon',
         ['heavenearthking'], [HEK],
         'Extreme close-up. Heaven–Earth King mid-chew, eyes narrowing, one brow up, half of his face in solid black ink and half in bare paper. A brass spoon in the foreground holds rice, and among the grains a few points of sand are the brightest white in the frame. Steam as dry-brush.',
         RED),
    slot('hek-ink-fall', '#8a7a3a', 'The floor of the ninth storehouse opens.',
         'Ink: the scoundrel falls through a storehouse floor into solid black, rice scattering up as white',
         [], [],
         'Bird’s-eye straight down into a storehouse whose floor has split open into absolute black ink. A fat man in rich robes falls head-first into it, small, arms flung up, face lost in shadow. Thousands of rice grains fly upward past him as white specks against the black. The broken floorboards are hard white shards at the frame edges.',
         NONE),
    slot('hek-ink-comb', '#c9b18f', 'Two gourd seeds in her palm',
         'Ink: two gourd seeds and half a comb in her palm; his sleeve leaving the frame',
         ['heavenearthking'], [HEK],
         'Close. Her open palm fills the lower half, bare paper skin in a black field, holding two gourd seeds and one half of a wooden comb, the broken edge of its teeth sharp. In the upper corner his cinnabar-and-black sleeve is already pulling out of frame, carrying the other half. Dawn as a white seam behind.',
         RED),
    slot('hek-ink-vine', '#111111', 'the vine has gone past the roof',
         'Ink: two boys climb a gourd vine that rises out of a black night into white sky',
         ['daebyeol', 'sobyeol'], [BIG_Y, LIT_Y],
         'Vertical device: one gourd vine of wet black ink rising from a thatched roof at the bottom edge straight up through the frame, leaves in splashed ink. Two fifteen-year-old boys climb it, the younger above and grinning back down, the elder steady below with a comb half in his teeth. Below them all is black night; above them the paper turns white.',
         RED),
    slot('hek-ink-sun', '#3B6FBF', 'breaks like a plate',
         'Ink: Big Star looses an iron arrow and the second sun shatters into stars',
         ['daebyeol', 'sobyeol'], [BIG_Y, LIT_Y],
         'Worm’s-eye at the edge of the sky. Big Star at full draw has just loosed; a huge black iron bow. The second sun shatters in the upper frame like a plate: a white disc breaking into white shards that scatter across a black ink sky as stars. Little Star crouched behind him, iron bow on his back, mouth open. Hard white light from the remaining sun rakes the elder’s face.',
         BLUE),
    slot('hek-ink-swap', '#C94040', 'counts his brother',
         'Ink: in the dark, Little Star lifts his brother’s blooming basin while Big Star sleeps',
         ['daebyeol', 'sobyeol'], [BIG_Y, LIT_Y],
         'Dutch night, nearly all black. Big Star asleep on his side, an indistinct mass of ink. Little Star crouched, mid-motion, lifting a silver basin with a fully open flower whose petals are the only bare white paper in the frame; his own basin with a wilted yellow-grey stalk set down by his brother’s hand. His eyes catch the white of the flower.',
         RED),
    slot('hek-ink-yield', '#3B6FBF', 'Your flower did well.',
         'Ink: Big Star kneels, looking at the stolen flower; his own wilted one by his hand',
         ['daebyeol', 'sobyeol'], [BIG_Y, LIT_Y],
         'Low two-shot at dawn. A white horizon seam. Big Star kneeling, still, looking at the open flower in front of his brother; his face is half black ink, half bare paper, the eyes calm. Little Star sits behind the stolen flower, grinning too hard, one cinnabar wash in his hair. The wilted stalk lies against Big Star’s fingers.',
         RED),
    slot('hek-ink-scale', '#3B6FBF', 'Then he hangs a scale from the sky.',
         'Ink: Big Star holds a giant steelyard scale; a line of pale ghosts and living people under it',
         ['daebyeol', 'sobyeol'], [BIG, LIT],
         'Monumental. A huge steelyard scale hangs from the top of the frame on a single black cord, its beam a hard horizontal line. Big Star, grown, stands beside it, grey-bearded, hand on the weight. Beneath, a long line of people: the heavy ones solid black ink, the light ones bare paper ghosts. Little Star, grown, small at the edge, watching. Pine-bark powder falls as grey dry-brush.',
         BLUE),
    slot('hek-ink-descent', '#3B6FBF', 'the light ones following him',
         'Ink: Big Star walks down into the black with a long line of white ghosts following',
         ['daebyeol'], [BIG],
         'The frame splits horizontally: the upper third is bare paper with tiny black roofs of the living world, the lower two-thirds solid black ink. Big Star walks down a diagonal stair into the black, back to us, small, and behind him a long quiet line of ghosts drawn only as bare-paper silhouettes trails up the stair toward the light.',
         BLUE),
]

KEEP_IDS = {'poster_heavenearthking', 'poster_sobyeol', 'poster_daebyeol'}

story = json.load(open(PATH))
entry = next(e for ch in story for e in (ch.get('entries') or []) if e.get('title') == TITLE)
blob = json.dumps(BLOCKS, ensure_ascii=False)
for s in INK_SLOTS:
    assert s['at'] in blob, s['id'] + ': ' + s['at']
removed = [im['id'] for im in entry['images'] if im['id'] not in KEEP_IDS]
entry['images'] = [im for im in entry['images'] if im['id'] in KEEP_IDS] + INK_SLOTS
entry['blocks'] = BLOCKS
json.dump(story, open(PATH, 'w'), ensure_ascii=False, indent='\t')
open(PATH, 'a').write('\n')
json.dump([{'id': s['id'], 'alt': s['alt'], 'prompt': s['prompt'], 'ratio': 2} for s in INK_SLOTS],
          open('scripts/.cache/hek-ink-manifest.json', 'w'), ensure_ascii=False, indent=2)
print('blocks', len(BLOCKS), 'slots', len(INK_SLOTS))
print('removed', removed)
