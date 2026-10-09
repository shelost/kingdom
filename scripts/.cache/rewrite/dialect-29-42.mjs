/**
 * Dialect pass, episodes 29–42 (see DIALECT-PASS.md, DIALECTS.md).
 * Silla 경상(경주)/RP, Baekje 충청/Old South, Goguryeo 평안/light Scots, Buyeo 함경 + Jolbon 평북/old Northern English,
 * Gaya 경남/Welsh English, Mahan 전라 (light), Tamla 제주어/Synge. Tang, Wei, Yamato, gods and court/foreign-facing lines stay standard.
 * Each edit swaps one dialogue line (Korean, and English when given) matched exactly inside its episode.
 * Idempotent. `DRY=1` prints instead of saving.
 */
import { editStory, lists } from '../story-ops.mjs';

const DRY = !!process.env.DRY;
const edits = [];
/** ep, kingdom tag, speaker (person id or speaker label), [oldKo, newKo], optional [oldEn, newEn]. */
const E = (ep, tag, who, ko, en) => edits.push({ ep, tag, who, ko, en });

/* ───────── #29 The Eastern Star ───────── */
E(29, 'silla', 'yushin', ['자넨 그때 글방에 있어야 했지.', '자넨 그때 글방에 있어야 했제.'], ['You were supposed to be at lessons.', 'You were meant to be at lessons.']);
E(29, 'silla', 'yushin', ['아니 그러면... 백제왕이라도 잡아들이려고?', '아니 그라믄... 백제왕이라도 잡아들일 낀가?'], ['So then… do you mean to drag the King of Baekje back too?', 'So then… you mean to drag the King of Baekje back as well?']);
E(29, 'silla', 'chunchu', ['형님… 원한은 제 것입니다. 압니다.', '형님… 원한은 제 것입니다. 압니더.'], ['Brother… the grudge is mine. I know that.', 'Brother… the grudge is mine. I’m quite aware.']);
E(29, 'silla', 'chunchu', ['그런데 뭔가 다른 것이 움직이고 있고, 그건 제가 움직이는 게 아닙니다.', '그런데 뭔가 다른 기 움직이고 있고, 그건 제가 움직이는 기 아입니더.'], ['But something else is moving, and it is not me moving it.', 'But something else is moving, and it isn’t me moving it.']);
E(29, 'silla', 'yushin', ['…자네, 그건 행성이라니까.', '…자네, 그건 행성이라 안 카나.'], ['…I told you. That one is a planet.', '…I’ve told you. That one’s a planet.']);
E(29, 'silla', 'chunchu', ['삼십 년째 그 소리십니다.', '삼십 년째 그 소리십니더.']);
E(29, 'silla', 'yushin', ['좋아할 필요는 없네. 곁에 서 있기만 하면 되지.', '좋아할 필요는 없네. 곁에 서 있기만 하면 되제.'], ['I don’t have to like it. I have to stand next to it.', 'I needn’t like it. I need only stand next to it.']);
E(29, 'silla', 'chunchu', ['형님은 그 자리 좋아하지도 않잖습니까.', '형님은 그 자리 좋아하지도 않으시잖습니꺼.']);
E(29, 'baekje', 'euija', ['의자 하나 잡겠다고 미쳐 가는 사내들을 숱하게 봤겠지.', '의자 하나 잡겠다고 미쳐 가는 사내들을 숱하게 봤겄지.'], ['You have watched men go mad reaching for a chair.', 'You’ve watched men go mad reaching for a chair, I reckon.']);
E(29, 'baekje', 'euija', ['내가 언젠가 어리석은 명을 내릴 게다. 한 번이 아닐 게고.', '내가 언젠가 어리석은 명을 내릴 겨. 한 번이 아닐 거구.'], ['One day I will give you a stupid order. More than one.', 'One day I will give you a mighty stupid order. More than one.']);
E(29, 'baekje', 'euija', ['그때는 네가 판단해라.', '그때는 네가 판단혀.']);
E(29, 'baekje', 'euija', ['계백아… 사내는 더 큰 꿈을 품어야지.', '계백아… 사내는 더 큰 꿈을 품어야 혀.'], ['Gyebek… a man should hold a larger dream.', 'Gyebek… a man ought to hold a larger dream.']);
E(29, 'goguryeo', 'dosuryu', ['조상님들하고 얘기 끝났냐?', '조상님들하고 얘기 끝났네?'], ['Done talking to your ancestors?', 'Done blethering to your ancestors?']);
E(29, 'goguryeo', 'gesomun', ['그래서 좋은 거요.', '기래서 좋은 거우다.'], ['That’s why I like them.', 'Aye. That’s why I like them.']);
E(29, 'goguryeo', 'dosuryu', ['나는 대꾸한다.', '내래 대꾸한다.']);
E(29, 'goguryeo', 'gesomun', ['아오, 형님. 그래서 곁에 두는 거요.', '아오, 형님. 기래서 곁에 두는 거우다.'], ['I know, old man. That’s why I keep you.', 'I ken, old man. That’s why I keep you.']);

/* ───────── #32 Sima Yi (the Goguryeo captain, camp talk) ───────── */
const CAP = 'The captain';
E(32, 'goguryeo', CAP, ['여기까지 와서 땅을 파?', '여기꺼정 와서 땅을 파네?']);
E(32, 'goguryeo', CAP, ['고구려에선 뭐든 죽을 때까지 말 타고 들이받아.', '고구려에선 머이든 죽을 때까지 말 타고 들이받아.']);
E(32, 'goguryeo', CAP, ['어차피 까먹을걸. 너네 한족은 안 적어 두면 다 까먹잖아.', '어차피 까먹갓디. 너네 한족은 안 적어 두면 다 까먹잖아.'], ['You’ll forget it. You Han forget anything you don’t write down.', 'You’ll only forget it. You Han forget anything you don’t write down.']);
E(32, 'goguryeo', CAP, ['그럼 종이를 잃어버리겠지.', '그럼 종이를 잃어버리갓디.']);
E(32, 'goguryeo', CAP, ['저 사람은 왜 우리 말을 세고 있어?', '데 사람은 왜 우리 말을 세고 있네?'], ['Why is that one counting our horses?', 'Why’s yon one counting our horses?']);
E(32, 'goguryeo', CAP, ['이백 마리야. 훤히 드러나 있다고.', '이백 마리야. 훤히 드러나 있다니끼니.']);
E(32, 'goguryeo', CAP, ['기병 쉰만 줘 봐. 저녁 갖다 바칠 테니.', '기병 쉰만 줘 보라우. 저녁 갖다 바칠 테니.']);
E(32, 'goguryeo', CAP, ['발 좀 말리고 싶다는 사람을 죽였어.', '발 좀 말리갓다는 사람을 죽였어.']);
E(32, 'goguryeo', CAP, ['…저거 우리 자갈밭인데.', '…데거 우리 자갈밭인데.']);
E(32, 'goguryeo', CAP, ['거봐. 단단하다니까.', '거보라우. 단단하다 했디.']);
E(32, 'goguryeo', CAP, ['고구려였으면 성문 태우고 그냥 집에 갔을 거야.', '고구려였으면 성문 태우고 기냥 집에 갔갓디.']);
E(32, 'goguryeo', CAP, ['…그럴지도.', '…기럴지도.'], ['…Maybe.', '…Aye, maybe.']);
E(32, 'goguryeo', CAP, ['너네 영감한테도 전해.', '너네 영감한테도 전하라우.']);
E(32, 'goguryeo', CAP, ['넌 말이나 좀 배워. 조 자루 얹어 놓은 것처럼 타더라.', '넌 말이나 좀 배우라우. 조 자루 얹어 놓은 것처럼 타더구만.']);

/* ───────── #33 Yodong ───────── */
E(33, 'goguryeo', '👰', ['…엄마한테 말해 줘요. 나 안 울었다고.', '…오마니한테 말해 줘요. 나 안 울었다고.'], ['…Tell my mum. Tell her I didn’t cry.', '…Tell my mam. Tell her I didn’t cry.']);
E(33, 'goguryeo', 'Yodong soldier', ['망루는 놔둬! 집, 집이야— 애들 집에서 끌어내!', '망루는 놔두라우! 집, 집이야— 애들 날래 끌어내!'], ['Leave the tower! The houses— get the children out of the houses!', 'Leave the tower! The houses— get the bairns out of the houses!']);
E(33, 'goguryeo', 'Lord of White Cliff', ['저놈 다시 말에 올랐어. 구멍 난 채로.', '데놈 다시 말에 올랐어. 구멍 난 채로.']);
E(33, 'goguryeo', 'Lord of White Cliff', ['…성문 열어라. 창 맞고 웃는 놈하고는 못 싸운다.', '…성문 열라우. 창 맞고 웃는 놈하고는 못 싸운다.'], ['…Open the gate. I’m not fighting a man who laughs at spears.', '…Open the gate. I’ll no fight a man who laughs at spears.']);
E(33, 'goguryeo', 'gesomun', ['고연수. 그믐까지 몇이나 끌고 나갈 수 있나?', '고연수. 그믐까지 몇이나 끌고 나가간?']);
E(33, 'goguryeo', 'gesomun', ['좋아. 안시로 가. 들판에서 맞붙어서 박살 내.', '좋아. 안시로 가라우. 들판에서 맞붙어서 박살 내.']);
E(33, 'goguryeo', 'gesomun', ['내 아들놈들도 치중대에 딸려 보내. 황제가 도망치는 꼴 좀 보게.', '내 아새끼들도 치중대에 딸려 보내. 황데가 도망치는 꼴 좀 보게.'], ['And take my boys with the baggage. Let them watch an emperor run.', 'And take my bairns with the baggage. Let them watch an emperor run.']);
E(33, 'goguryeo', 'The old officer', ['마지막으로 들판에서 제국의 군대를 맞은 임금은… 땅을 보지 않으셨지요.', '마지막으로 들판에서 제국의 군대를 맞은 임금은… 땅을 안 보셨디요.']);
E(33, 'goguryeo', 'gesomun', ['그럼 가는 길에 고연수한테 해 줘. 나흘이다. 짧게.', '그럼 가는 길에 고연수한테 해 주라우. 나흘이다. 짧게.']);

/* ───────── #34 Boiling River ───────── */
E(34, 'goguryeo', 'goyeonsu', ['그런데 그 임금은 기병 오천이었지요. 저는 십오만입니다.', '그런데 그 임금은 기병 오천이었디요. 저는 십오만입니다.']);
E(34, 'goguryeo', 'The old officer', ['…위나라도 그랬지요.', '…위나라도 기랬디요.']);

/* ───────── #35 Stallion Mountain ───────── */
E(35, 'goguryeo', 'The old officer', ['저게 다가 아닙니다.', '저게 다가 아니우다.'], ['That isn’t all of them.', 'That’s no all of them.']);
E(35, 'goguryeo', 'goyeonsu', ['겨울은 아직 안 왔소, 어르신. 저자는 왔지. 몸소.', '겨울은 아직 안 왔소, 어르신. 저자는 왔디. 몸소.'], ['Winter isn’t here, grandfather. He is. In person.', 'Winter’s no here yet, grandfather. He is. In person.']);
E(35, 'goguryeo', 'goyeonsu', ['황제 목을 칠 기회가 이보다 좋을 순 없소.', '황데 목을 칠 기회가 이보다 좋을 순 없소.']);
E(35, 'goguryeo', 'Goguryeo picket', ['장군. 산 위에 뭐가 움직입니다. 많이요.', '장군. 산 우에 뭐이 움직입네다. 많이요.']);
E(35, 'goguryeo', 'Goguryeo picket', ['깃발은 없는데요.', '깃발은 없는데요.'], ['No banners, though.', 'No banners, mind.']);
E(35, 'goguryeo', 'goyeonsu', ['깃발이 없으면 군대도 없지. 사슴이야.', '깃발이 없으면 군대도 없디. 사슴이야.']);
E(35, 'goguryeo', 'goyeonsu', ['가서 자. 아침엔 황제를 먹을 거니까.', '가서 자. 아침엔 황데를 먹을 거니까.'], ['Go to sleep. We’re having an emperor for breakfast.', 'Away to your bed. We’re having an emperor for breakfast.']);
E(35, 'silla', 'xuejitou', ['삼한이지. 신라.', '삼한이제. 신라.']);
E(35, 'silla', 'xuejitou', ['신라에선 사람 쓸 때 뼈부터 따져. 재주가 아무리 크고 공이 아무리 커도, 뼈가 아니면 못 넘어. 그냥 못 넘어.', '신라선 사람 쓸 때 뼈부터 따진데이. 재주가 아무리 크고 공이 아무리 커도, 뼈가 아이면 몬 넘는다. 그냥 몬 넘는다.'], ['In Silla they count your bones before they hire you. Doesn’t matter how big your talent is or how big your deeds — wrong bones, and you don’t get over the wall. You just don’t.', 'In Silla they count your bones before they hire you. Doesn’t matter how big your talent is or how big your deeds — wrong bones, and you don’t get over the wall. Simply don’t.']);
E(35, 'silla', 'xuejitou', ['그래서 바다 건너왔지. 천자 곁에서 관 쓰고 띠 두르고 칼 차고 드나들어 보려고.', '그래가 바다 건너왔제. 천자 곁에서 관 쓰고 띠 두르고 칼 차고 드나들어 볼라꼬.']);
E(35, 'silla', 'xuejitou', ['…그거면 돼.', '…그거믄 된다.']);
E(35, 'goguryeo', 'goyeonsu', ['노인이 진을 치랬지.', '노인이 진을 치라 했디.']);
E(35, 'goguryeo', 'goyeonsu', ['…그 양반 살아 있나? 누가 좀 알아봐. 사과할 게 있어.', '…그 양반 살아 있네? 누가 좀 알아보라우. 사과할 게 있어.']);
E(35, 'goguryeo', 'goguard_a', ['황제… 이쪽으로 온다.', '황데… 이쪽으로 온다.']);
E(35, 'goguryeo', 'goguard_a', ['오늘 밤. 흰옷 입은 놈을 은으로 사 가겠다고. 성왕이시여, 굽어살피소서.', '오늘 밤. 흰옷 입은 놈을 은으로 사 가갓다고. 성왕이시여, 굽어살피소서.']);
E(35, 'goguryeo', 'goguard_a', ['당나라 포로들이 저놈을 여포라고 부르더라. 그땐 웃었는데. 이젠 안 웃겨.', '당나라 포로들이 데놈을 여포라고 부르더라. 기땐 웃었는데. 이젠 안 웃기다.'], ['The Tang prisoners call him Lu Bu. I laughed at them. I’m not laughing.', 'The Tang prisoners call him Lu Bu. I laughed at them. I’m no laughing now.']);
E(35, 'goguryeo', 'namseng', ['형이니까.', '형이니끼니.']);
E(35, 'goguryeo', 'Rider', ['둘 다입니다, 대막리지. 황제가 아이들에게 너그럽게 하겠다고 전해 왔습니다.', '둘 다입니다, 대막리지. 황데가 아이들에게 너그럽게 하갓다고 전해 왔습니다.']);
E(35, 'goguryeo', 'gesomun', ['제 형제를 죽인 놈이 내 아들들한테 너그럽겠다고.', '제 형제 죽인 놈이 내 아새끼들한테 너그럽갓다고.'], ['A man who killed his brothers is being kind to my sons.', 'A man that killed his own brothers, being kind to my bairns.']);
E(35, 'goguryeo', 'gesomun', ['내가 일곱 살 때, 아버지가 살수에서 수나라 깃발을 옆구리에 끼고 돌아왔어. 난 깃발이 황제한테서 열리는 열맨 줄 알았지.', '내가 일곱 살 때, 아버지가 살수에서 수나라 깃발을 옆구리에 끼고 돌아왔어. 난 깃발이 황데한테서 열리는 열맨 줄 알았디.']);
E(35, 'goguryeo', 'gesomun', ['깊이 들어오라 그래. 저번 놈도 그랬어.', '깊이 들어오라 기래. 저번 놈도 기랬어.'], ['Let him come deep. The last one did.', 'Let him come deep, aye. The last one did.']);

/* ───────── #36 Colossal River ───────── */
E(36, 'goguryeo', 'The boy', ['그거 황제 거예요?', '그거 황데 거예요?']);
E(36, 'goguryeo', 'His father', ['그중 하나지. 황제한텐 많아.', '그중 하나디. 황데한텐 많아.'], ['One of them. Emperors have plenty.', 'Aye, one of them. Emperors have plenty.']);
E(36, 'goguryeo', 'His father', ['도망칠 때 흘리고 가거든. 자. 비단 말고 장대를 잡아라.', '도망칠 때 흘리고 가거든. 자. 비단 말고 장대를 잡으라우.']);

/* ───────── #37 Ansi ───────── */
E(37, 'goguryeo', 'Kkachi', ['짝눈이 아저씨! 지금 우리 중에 누구 봐?', '짝눈이 아저씨! 지금 우리 중에 누구 보네?']);
E(37, 'goguryeo', 'yangmanchun', ['둘 다. 늘 둘 다지.', '둘 다. 늘 둘 다디.'], ['Both. Always both.', 'Both. Aye, always both.']);
E(37, 'goguryeo', 'yangmanchun', ['할매 발이 자꾸 길을 막잖아요.', '할마니 발이 자꾸 길을 막잖아요.']);
E(37, 'goguryeo', 'Granny', ['네 앞엔 뭐든 길을 막지. 문짝 지고 가는 놈처럼 추는구나.', '네 앞엔 머이든 길을 막디. 문짝 지고 가는 놈처럼 추는구나.']);
E(37, 'goguryeo', 'The mason', ['잠깐 가만있어 봐.', '잠깐 가만있어 보라우.'], ['Hold still a minute.', 'Hold still a wee minute.']);
E(37, 'goguryeo', 'The mason', ['그럼 천천히 춰. 얼굴 익히는 중이야. 언젠가 이 고을이 그 얼굴을 돌에 새기자고 할 거다.', '그럼 천천히 춰. 얼굴 익히는 중이야. 언젠가 이 고을이 그 얼굴을 돌에 새기자고 하갓디.']);
E(37, 'goguryeo', 'The mason', ['그럼 둘 중 하나라도 얼른 돼 봐.', '그럼 둘 중 하나라도 날래 돼 보라우.']);
E(37, 'goguryeo', 'yangmanchun', ['…그래.', '…기래.'], ['…Well.', '…Aye.']);
E(37, 'goguryeo', 'yangmanchun', ['이제 어느 시절인지 알겠네.', '이제 어느 시절인지 알갓네.'], ['Now we know what age it is.', 'Now we ken what age it is.']);
E(37, 'goguryeo', 'Kkachi', ['짝눈이 아저씨? 전쟁 나?', '짝눈이 아저씨? 전쟁 나네?']);
E(37, 'goguryeo', 'Granny', ['누가 북 좀 들어. 세상이 망해도 장단은 맞춰서 망해야지.', '누가 북 좀 들라우. 세상이 망해도 장단은 맞춰서 망해야디.']);
E(37, 'goguryeo', 'yangmanchun', ['네 주인한테 물어봐. 그 잔치에 같이 있었으니까.', '네 주인한테 물어보라우. 그 잔치에 같이 있었으니끼니.']);
E(37, 'goguryeo', 'yangmanchun', ['그럼 돌려받고 싶겠지. 머리랑 같이 보내.', '그럼 돌려받고 싶갓디. 머리랑 같이 보내.']);
E(37, 'goguryeo', 'Young archer', ['성주님, 저거 우리 깃발인데요. 누굴 쏴요?', '성주님, 데거 우리 깃발인데요. 누굴 쏴요?']);
E(37, 'goguryeo', 'Granny', ['저 맷돌 값은 누가 내냐?', '데 맷돌 값은 누가 내네?']);
E(37, 'goguryeo', 'The mason', ['평양이 내야지. 값 받으러 사람 보낼 거다.', '평양이 내야디. 값 받으러 사람 보내갓다.']);
E(37, 'goguryeo', 'yangmanchun', ['그래서 오는 게 보였지.', '기래서 오는 게 보였디.']);
E(37, 'goguryeo', 'dosuryu', ['이번엔 만 명 보낼까?', '이번엔 만 명 보내간?']);
E(37, 'goguryeo', 'gesomun', ['…됐어. 당이 요하에서 말을 세고 있어. 창이란 창은 전부 서쪽을 봐야지, 산꼭대기 볼 때가 아니야.', '…일없어. 당이 요하에서 말을 세고 있어. 창이란 창은 전부 서쪽을 봐야디, 산꼭대기 볼 때가 아니야.'], ['…No. The Tang is counting horses at the Liao. I need every spear facing west, not up some hill.', '…Naw. The Tang is counting horses at the Liao. I need every spear facing west, not up some hill.']);
E(37, 'goguryeo', 'gesomun', ['성 하나다. 가지라고 해. 그렇게 잘 지키면, 황제한테서도 지켜 보라지.', '성 하나다. 가지라고 해. 기렇게 잘 지키면, 황데한테서도 지켜 보라디.']);
E(37, 'goguryeo', 'Ansi soldier', ['누런 깃발이다! 저놈이다— 북 쳐, 북!', '누런 깃발이다! 데놈이다— 북 쳐, 북!']);
E(37, 'goguryeo', 'Ansi soldier', ['어이, 천자 양반! 우리 울타리가 너네 망루보다 높다!', '어이, 천자 양반! 우리 울타리레 너네 망루보다 높다!'], ['Hey, Son of Heaven! Our fence is taller than your tower!', 'Oi, Son of Heaven! Our fence is taller than your wee tower!']);
E(37, 'goguryeo', 'Ansi soldier', ['성주님, 저놈들 벌써 예순 날째 저럽니다.', '성주님, 데놈들 벌써 예순 날째 저럽니다.']);
E(37, 'goguryeo', 'yangmanchun', ['그럼 우리는 예순 밤째다. 돌 넘겨.', '그럼 우리는 예순 밤째다. 돌 넘기라우.']);
E(37, 'goguryeo', 'Granny', ['봐라. 문짝을 지워 놓으니까 춤이 되네.', '보라우. 문짝을 지워 놓으니끼니 춤이 되네.']);
E(37, 'goguryeo', 'Weaver', ['그거 내 베틀 들보야. 쓸모 있는 데 박아.', '그거 내 베틀 들보야. 쓸모 있는 데 박으라우.']);
E(37, 'goguryeo', 'Ansi soldier', ['성주님. 저 위에서 우리 밥솥까지 보이겠는데요.', '성주님. 데 우에서 우리 밥솥꺼정 보이갓시요.']);
E(37, 'goguryeo', 'yangmanchun', ['그럼 냄새 좋은 거 해. 저놈들도 한번 배고파 보라고.', '그럼 냄새 좋은 거 해. 데놈들도 한번 배고파 보라디.']);
E(37, 'goguryeo', 'yangmanchun', ['벽은 됐고. 저 위에 지금 누가 있냐?', '벽은 일없고. 데 우에 지금 누가 있네?'], ['Never mind the wall. Who’s up on that thing right now?', 'Never mind the wall. Who’s up on yon thing right now?']);
E(37, 'goguryeo', 'yangmanchun', ['가만있어 봐, 이 양반아.', '가만있어 보라우, 이 양반아.']);
E(37, 'goguryeo', 'yangmanchun', ['일산 노렸어. 나머진 눈이 알아서 했지.', '일산 노렸어. 나머진 눈이 알아서 했디.']);
E(37, 'goguryeo', 'The mason', ['성왕님. 요동 사당에 있지. 이 성벽보다 오래됐어.', '성왕님. 요동 사당에 있디. 이 성벽보다 오래됐어.']);
E(37, 'goguryeo', 'The mason', ['그분이 누군지는 다들 알지.', '그분이 누군지는 다들 알디.']);
E(37, 'goguryeo', 'Kkachi', ['그러니까 누구?', '기러니까 누구?']);
E(37, 'goguryeo', 'yangmanchun', ['나 보지 마. 난 활 나오는 대목밖에 몰라.', '나 보디 마. 난 활 나오는 대목밖에 몰라.'], ['Don’t look at me. I only know the part with the bow.', 'Don’t look at me. I only ken the part with the bow.']);
E(37, 'goguryeo', 'gesomun', ['그래도 할 일은 했네.', '기래도 할 일은 했구만.']);
E(37, 'goguryeo', 'gesomun', ['…하. 좀 비켜 앉아. 얘기가 길어. 신 하나가 강물 속 계집애를 내려다본 데서 시작하지.', '…하. 좀 비켜 앉아. 얘기가 길어. 신 하나가 강물 속 에미나이를 내려다본 데서 시작하디.']);

/* ───────── #38 Haemosu (Geumwa at the Buyeo gate) ───────── */
E(38, 'buyeo', 'geumwa', ['들어와. 빈 방이 있다.', '들어오오. 빈 방이 있소.']);
E(38, 'buyeo', 'geumwa', ['이름은 마당이 나중에 알아도 된다.', '이름은 마당이 나중에 알아도 되오.'], ['The yard can learn your name later.', 'The yard can learn thy name later.']);

/* ───────── #39 Buyeo ───────── */
E(39, 'buyeo', 'daeso', ['먹여 주는 집보다 멀리 쏘지 마라.', '먹여 주는 집보다 멀리 쏘지 마라.'], ['Do not outshoot the house that feeds you.', 'Do not outshoot the house that feeds thee.']);
E(39, 'buyeo', 'jumong', ['그럼 과녁을 더 멀리 두시오.', '그럼 과녁으 더 멀리 두시오.']);
E(39, 'buyeo', 'galsa', ['맞으면, 치려던 거다.', '맞으면, 치려던 거지비.']);
E(39, 'buyeo', 'daeso', ['다음 사냥 전에 끝내.', '다음 사냥 전에 끝내오.'], ['Do it before the next hunt.', 'Do it afore the next hunt.']);
E(39, 'buyeo', 'daeso', ['조용하면 됐다.', '조용하면 됐지비.'], ['Quiet is fine.', 'Quiet will do.']);
E(39, 'buyeo', 'jumong', ['엄마, 무서운 사람이었네.', '어마이, 무서운 사람이었네.']);
E(39, 'buyeo', 'geumwa', ['너랑 잘 어울린다.', '너랑 잘 어울리오.'], ['Suits you.', 'Suits thee.']);
E(39, 'buyeo', 'geumwa', ['둘 다 내 밥을 먹고도 마르는구나.', '둘 다 내 밥으 먹고도 마르는구나.'], ['You both eat my rice and still stay thin.', 'The pair of you eat my rice and still stay thin.']);
E(39, 'buyeo', 'ladyye', ['부여를 떠나. 오늘 밤.', '부여르 떠나오. 오늘 밤.']);
E(39, 'buyeo', 'ladyye', ['등잔은 내가 켤게.', '등잔은 내 켜 두겠소.']);
E(39, 'buyeo', 'oi', ['우리는 능선으로 간다.', '우린 능선으로 가기오.'], ['We’ll take the ridge.', 'We’ll take the ridge, lad.']);
E(39, 'buyeo', 'oi', ['활이 남아 있을 때 찾아.', '활이 남아 있을 때 찾소.'], ['Find us when you still have a bow.', 'Find us while tha still has a bow.']);
E(39, 'buyeo', 'oi', ['미쳤어? 네 말이잖아.', '미쳤소? 네 말이지비.'], ['Are you crazy? He’s your horse.', 'Has tha gone daft? He’s thy horse.']);

/* ───────── #40 Jolbon ───────── */
E(40, 'jolbon', 'Second scout', ['빨강이네. 우리 옷 아냐.', '빨강이네. 우리 옷 아니디.'], ['Red. That’s not ours.', 'Red. That’s none of ours.']);
E(40, 'jolbon', 'Scout', ['귀 먹었어?', '귀 먹었네?'], ['You deaf?', 'Tha deaf?']);
E(40, 'jolbon', 'Second scout', ['이름. 빨리.', '이름. 날래.']);
E(40, 'jolbon', 'Second scout', ['타발 어른이 여기까지 나오면 너 탓이다.', '타발 어른이 여기꺼정 나오면 너 탓이다.'], ['If Tabal has to come out here I’m blaming you.', 'If Tabal has to come out here I’m blaming thee.']);
E(40, 'jolbon', 'yeontabal', ['그래서 누가 보냈냐.', '기래서 누구레 보냈네?']);
E(40, 'jolbon', 'yeontabal', ['이름은 물었다.', '이름은 물었디.']);
E(40, 'jolbon', 'yeontabal', ['네 옷은 이 근처 어디에도 안 닮았다.', '네 옷은 이 근처 어드메도 안 닮았다.']);
E(40, 'jolbon', 'yeontabal', ['…넌 누구 아들이냐.', '…넌 누구 아들이네?'], ['…Whose son are you.', '…Whose lad are you.']);
E(40, 'jolbon', 'yeontabal', ['내 마루에 재 끌어들이고 싶지 않다.', '내 마루에 재 끌어들이고 싶디 않다.'], ['I do not want ash tracked into my hall.', 'I’ll not have ash tracked into my hall.']);
E(40, 'jolbon', 'yeontabal', ['그래도 남아.', '기래도 남아.']);
E(40, 'jolbon', 'yeontabal', ['내가 올라가게 하지 마.', '내래 올라가게 하디 마.']);
E(40, 'jolbon', 'yeontabal', ['등짝이 싫은 거지.', '등짝이 싫은 거디.'], ['You just don’t like his back.', 'Tha just doesn’t like his back.']);
E(40, 'jolbon', 'yeontabal', ['맞히면 밥. 빗나가면 내가 내보낸다.', '맞히면 밥. 빗나가면 내래 내보낸다.']);
E(40, 'jolbon', 'yeontabal', ['내 딸이 네 활을 당겼다더군. 난 못 했는데—', '내 딸이 네 활을 당겼다더구만. 내래 못 했는데—'], ['My daughter bent your bow, I hear. I couldn’t—', 'My daughter bent thy bow, I hear. I couldn’t—']);
E(40, 'jolbon', 'yeontabal', ['소서노. 네가 골랐으면 네가 지켜. 잔치 없다.', '소서노. 네레 골랐으면 네레 디켜. 잔치 없다.'], ['Sosuno. You picked. You keep. No feast.', 'Sosuno. Tha picked. Tha keeps. No feast.']);
E(40, 'jolbon', 'yeontabal', ['…입 조심해.', '…입 조심하라우.'], ['…Watch your mouth.', '…Watch thy mouth.']);
E(40, 'jolbon', 'yeontabal', ['그놈들이 내 사촌이다.', '기놈들이 내 사촌이다.']);
E(40, 'jolbon', 'yeontabal', ['네가 마르기 전부터 내 사람들이야.', '네가 마르기 전부터 내 사람들이야.'], ['They have been mine longer than you have been dry.', 'They have been mine longer than tha’s been dry.']);
E(40, 'jolbon', 'yeontabal', ['왕이면 왕이지.', '왕이면 왕이디.']);
E(40, 'jolbon', 'yeontabal', ['도랑이 다시 열리면 내가 그랬다고 한다.', '도랑이 다시 열리면 내래 그랬다고 한다.'], ['If the ditches start again I will say I told you.', 'If the ditches start again I will say I told thee.']);
E(40, 'jolbon', 'sosuno', ['아니면 빠져 죽든가. 상관없어.', '아니면 빠져 죽든가. 일없어.']);
E(40, 'jolbon', 'sosuno', ['네가 볼 거 아니야.', '네가 볼 거 아니디.']);
E(40, 'jolbon', 'A chieftain', ['우리 애도 셈해.', '우리 애도 셈할 줄 알디.'], ['My girl can count.', 'My lass can count.']);
E(40, 'jolbon', 'Teal', ['소서노 보지 마. 나를 봐.', '소서노 보디 마. 나를 봐.']);
E(40, 'jolbon', 'Crow cousin', ['도랑에서 나와, 종놈아.', '도랑에서 나오라우, 종놈아.']);
E(40, 'jolbon', 'Cliff cousin', ['…우리 할아버지들이. 같이.', '…우리 할아바지들이. 같이.']);
E(40, 'buyeo', 'oi', ['살찌우라며.', '살찌우라 했지비.'], ['You said fatten him up.', 'Tha said fatten him up.']);
E(40, 'buyeo', 'oi', ['살찌웠어.', '살찌웠소.']);
E(40, 'buyeo', 'mari', ['못 뛰어. 못 올라. 먹기는 대청만큼 먹고.', '못 뛰오. 못 오르오. 먹기는 대청만큼 먹고.']);
E(40, 'buyeo', 'mari', ['너 찾느라 한 달 걸렸다. 우리 지붕은 어디야?', '너 찾느라 한 달 걸렸소. 우리 지붕은 어디요?'], ['Took us a month to find you. Where’s our roof?', 'Took us a month to find thee. Where’s our roof?']);
E(40, 'goguryeo', 'gesomun', ['쏘고 나서 시집갔지. 우리 집안 여자들이 그래.', '쏘고 나서 시집갔디. 우리 집안 여자들이 기래.'], ['Shot at him, then married him. The women in my family are like that.', 'Shot at him, then married him. Aye, the women in my family are like that.']);
E(40, 'goguryeo', 'gesomun', ['골라, 그럼.', '고르라우, 기럼.']);

/* ───────── #41 Gi ───────── */
E(41, 'silla', 'bidam', ['……혼자입니다, 아버지. 말씀하신 대로.', '……혼자입니더, 아버지. 말씀하신 대로.']);
E(41, 'silla', 'bidam', ['그러니까 더 반대하는 거다, 이 가야 황소야.', '그라니까 더 반대하는 기다, 이 가야 황소야.']);
E(41, 'silla', 'bidam', ['그런 얼굴 하지 마. 백팔 대 백팔, 기억하지? 우리 둘 다 오래 이겨 본 적이 없어.', '그런 얼굴 하지 마라. 백팔 대 백팔, 기억나제? 우리 둘 다 오래 이겨 본 적이 없다 아이가.']);
E(41, 'silla', 'munhee', ['이번엔 몇 달입니까?', '이번엔 몇 달입니꺼?']);
E(41, 'silla', 'munhee', ['그럼 옷은 넉넉히 넣겠습니다.', '그럼 옷은 넉넉히 넣겠습니더.'], ['Then I will pack for more.', 'Then I shall pack for more.']);
E(41, 'silla', 'haesang', ['동국에 가시거든 옻칠을 물어보십시오.', '동국에 가시거든 옻칠을 물어보이소.']);
E(41, 'silla', 'haesang', ['언젠가 장안에 가시거든 — 황제 문장을 끝내는 여인을 물어보십시오. 상인은 날씨를 일찍 듣습니다.', '언젠가 장안에 가시거든 — 황제 문장을 끝내는 여인을 물어보이소. 상인은 날씨를 일찍 듣습니더.']);
E(41, 'silla', 'bidam', ['…그때 이걸 그 애한테 내밀었지.', '…그때 이걸 그 아한테 내밀었제.']);
E(41, 'silla', 'bidam', ['아무도 안 괴롭힐 거라고.', '아무도 안 괴롭힐 끼라고.']);
E(41, 'silla', 'bidam', ['유신은 폐하가 서신 자리에 서오. 늘 그랬지.', '유신은 폐하가 서신 자리에 서오. 늘 그랬제.'], ['Yushin stands where the Queen stands. He always has.', 'Yushin stands where the Queen stands. Always has.']);
E(41, 'silla', 'yumjong', ['그 사람은 신라 사람도 아니잖습니까.', '그 사람은 신라 사람도 아입니더.']);
E(41, 'silla', 'bidam', ['…조심하오, 염종.', '…조심하소, 염종.']);
E(41, 'silla', 'yumjong', ['그래서. 몇이나 됩니까, 상대등.', '그래서. 몇이나 됩니꺼, 상대등.']);
E(41, 'silla', 'bidam', ['보시오, 염종. 골짜기 길로 내려오는 꼴이 봄 눈석임물 같소.', '보소, 염종. 골짜기 길로 내려오는 꼴이 봄 눈석임물 같소.'], ['Look at them come down the valley road, Yumjong. Like the spring melt.', 'Look at them come down the valley road, Yumjong. Rather like the spring melt.']);
E(41, 'silla', 'yumjong', ['강은 밥을 안 먹지요, 상대등. 저것들은 먹습니다.', '강은 밥을 안 묵지요, 상대등. 저것들은 묵습니더.']);
E(41, 'silla', 'yumjong', ['뭘 말입니까?', '뭘 말입니꺼?']);
E(41, 'silla', 'A young rebel officer', ['가야가 대체 뭡니까? 아버지는 쇠의 한 종류라고 하던데요.', '가야가 대체 뭡니꺼? 아부지는 쇠의 한 종류라 카던데요.'], ['What is Gaya, anyway? My father says it was a kind of iron.', 'What is Gaya, anyway? My father says it was a sort of iron.']);
E(41, 'silla', 'A young rebel officer', ['그리고 졌습니까?', '그라고 졌습니꺼?']);
E(41, 'silla', 'A young rebel officer', ['그런데 왜 아직도—', '그란데 와 아직도—']);
E(41, 'silla', 'bidam', ['네 아비 말이 틀리진 않다.', '니 아비 말이 틀린 건 아이다.']);
E(41, 'silla', 'bidam', ['팔렸지. 포구 하나씩.', '팔렸제. 포구 하나씩.']);
E(41, 'silla', 'jinduk', ['……관자놀이가 많이 비었네. 언제 이렇게 됐어.', '……관자놀이가 많이 비었네. 언제 이래 됐노.']);
E(41, 'silla', 'sunduk', ['높이 꽂아. 도리천 가는데 신들보다는 커 보여야지.', '높이 꽂아라. 도리천 가는데 신들보다는 커 보여야제.']);

/* ───────── #42 Suro ───────── */
const CHIEF = 'The eldest chief';
E(42, 'gaya', CHIEF, ['누가 묻는 거요?', '누가 묻소?'], ['Who’s asking?', 'Who’s asking, then?']);
E(42, 'gaya', CHIEF, ['…어딘지도 모르고 거기 있소?', '…어덴지도 모르고 거기 있소?'], ['…You don’t know where you are?', '…Don’t know where you are, is it?']);
E(42, 'gaya', 'A villager', ['뭘 불러?', '뭘 부르노?'], ['Sing what?', 'Sing what, then?']);
E(42, 'gaya', 'A villager', ['거북한테 머리 내밀라고, 안 그러면 구워 먹겠다고 하래.', '거북한테 머리 내밀라 카래. 안 그라믄 구워 묵는다고.']);
E(42, 'gaya', 'A villager', ['…우리가 산을 협박한다고?', '…우리가 산을 협박한다꼬?'], ['…We’re threatening the mountain?', '…Threatening the mountain, are we?']);
E(42, 'gaya', 'A villager', ['여섯이요. 상자에. 하늘에서.', '여섯이라예. 상자에. 하늘에서.']);
E(42, 'gaya', CHIEF, ['하늘에서 온 건 나도 보여. 왜 하필 알이냐고 묻는 거다.', '하늘에서 온 건 내도 보인다. 와 하필 알이냐꼬 묻는 기다.'], ['I can see it’s from the sky. I’m asking why it’s eggs.', 'From the sky, I can see. Why eggs is what I’m asking.']);
E(42, 'gaya', 'ijinasi', ['큰 언덕을 가져라. …됐다. 내가 가진다.', '큰 언덕 가져가라. …됐다, 마. 내가 가진다.'], ['Take the larger hill. …Fine. I’ll take it.', 'Take the larger hill. …Fine. I’ll take it, then.']);
E(42, 'gaya', 'suro', ['…가지시오.', '…가지소.']);
E(42, 'gaya', 'ijinasi', ['바다 위엔 못 서. 담도 못 쌓고, 뭘 심지도 못해.', '바다 위엔 몬 선다. 담도 몬 쌓고, 뭘 심지도 몬 한다.'], ['You can’t stand on the sea. You can’t wall it. You can’t plant a thing in it.', 'You can’t stand on the sea, can you. Can’t wall it. Can’t plant a thing in it.']);
E(42, 'gaya', 'suro', ['…배가 오지 않소.', '…배가 오지 않소.'], ['…Ships come on it.', '…Ships come on it, don’t they.']);
E(42, 'gaya', 'ijinasi', ['“무언가가 들어온다.” 들어 봐라. 태어난 지 보름 된 게 벌써 뭘 기다려.', '“무언가가 들어온다.” 들어 봐라. 태어난 지 보름 된 기 벌써 뭘 기다리노.']);
E(42, 'gaya', CHIEF, ['전하들. 하늘은 여섯을 보내셨는데, 바닷가는 하나를 바랐습니다.', '전하들. 하늘은 여섯을 보내셨는데, 바닷가는 하나를 바랐습니더.']);
E(42, 'gaya', CHIEF, ['고르십시오. 누구든. 끝까지 서 계신 분께 절하겠습니다.', '고르시이소. 누구든. 끝까지 서 계신 분께 절하겠습니더.'], ['Choose. Any of you. We’ll bow to whoever’s left standing.', 'Choose, then. Any of you. We’ll bow to whoever’s left standing.']);
E(42, 'gaya', 'ijinasi', ['언덕 제일 크고, 쇠 제일 많고, 사람 제일 많아. 세어 봐.', '언덕 제일 크고, 쇠 제일 많고, 사람 제일 많다. 세어 봐라.']);
E(42, 'gaya', 'The king of Seongsan', ['네가 세는 동안 내 담은 누가 지키는데?', '니가 세는 동안 내 담은 누가 지키노?'], ['And while you’re counting, who watches my wall?', 'And while you’re counting, who’s watching my wall, then?']);
E(42, 'gaya', 'The king of Seongsan', ['그게 무섭다는 거야.', '그기 무섭다 카는 기다.']);
E(42, 'gaya', 'The king of Ara', ['누가 되든 난 말 줘.', '누가 되든 내는 말 도.'], ['Whoever it is, I want horses.', 'Whoever it is, horses I want.']);
E(42, 'gaya', 'The king of Sogaya', ['얘는 말 달래. 난 물때가 제때 들어왔으면 좋겠는데. 임금이 그거 해 줘?', '야는 말 달라 카고, 내는 물때가 제때 들어왔으면 좋겠는데. 임금이 그거 해 주나?'], ['He wants horses. I want the tide in on time. Can a king do that?', 'He wants horses. The tide in on time, I want. Can a king do that?']);
E(42, 'gaya', 'The king of Sogaya', ['그럼 뭐 하러 있는데?', '그라믄 뭐 할라꼬 있노?'], ['Then what’s he for?', 'What’s he for, then?']);
E(42, 'gaya', CHIEF, ['수로 전하. 상자에서 제일 먼저 나오셨지요.', '수로 전하. 상자에서 제일 먼저 나오셨지예.']);
E(42, 'gaya', 'ijinasi', ['얘는 바다를 원해. 뭐 배달 올 게 있대.', '야는 바다를 원한다. 뭐 배달 올 기 있단다.']);
E(42, 'gaya', CHIEF, ['전하들. 저희 아홉은 경계석 하나로 열한 해를 싸웠습니다.', '전하들. 저희 아홉은 경계석 하나로 열한 해를 싸웠습니더.']);
E(42, 'gaya', CHIEF, ['제발. 열두 해로 만들지 마십시오.', '제발. 열두 해로 만들지 마이소.'], ['Please. Don’t make it twelve.', 'Please, now. Don’t make it twelve.']);
E(42, 'gaya', 'The king of Goryeong Gaya', ['왜 하나야?', '와 하나고?']);
E(42, 'gaya', 'The king of Sogaya', ['…너 언제 왔어?', '…니 언제 왔노?']);
E(42, 'gaya', 'The king of Goryeong Gaya', ['알이랑 같이 왔는데.', '알이랑 같이 왔다 아이가.'], ['I came with the eggs.', 'Came with the eggs, didn’t I.']);
E(42, 'gaya', CHIEF, ['…그럼 임금이 없는 거군요.', '…그라믄 임금이 없는 기네예.']);
E(42, 'gaya', 'The king of Goryeong Gaya', ['수로한테 사. 배 있잖아.', '수로한테 사라. 배 있다 아이가.'], ['Buy them off Suro. He’ll have boats.', 'Buy them off Suro. He’ll have boats, won’t he.']);
E(42, 'gaya', 'ijinasi', ['…뭐.', '…뭐꼬.']);
E(42, 'gaya', CHIEF, ['전하. 제 아우의 딸이 열여섯입니다. 이가 고르고요. 천까지 셉니다.', '전하. 제 아우의 딸이 열여섯입니더. 이가 고르고요. 천까지 셉니더.'], ['Majesty. My brother’s girl is sixteen. Good teeth. She can count to a thousand.', 'Majesty. My brother’s girl is sixteen. Good teeth. Counts to a thousand, she does.']);
E(42, 'gaya', 'A younger chief', ['제 딸은 천부터 거꾸로 셉니다.', '제 딸은 천부터 거꾸로 셉니더.'], ['Mine counts to a thousand backwards.', 'Backwards from a thousand, mine counts.']);
E(42, 'gaya', 'suro', ['…그래도. 방을 붙이시오. 길마다, 나루마다. 왕비가 되고 싶은 이는… 오라 하시오.', '…그래도. 방을 붙이소. 길마다, 나루마다. 왕비가 되고 싶은 이는… 오라 하소.']);
E(42, 'gaya', CHIEF, ['어디서 말입니까, 전하?', '어데서 말입니꺼, 전하?']);
E(42, 'gaya', 'suro', ['어디서든.', '어데서든.']);
E(42, 'goguryeo', 'The rider from Goguryeo', ['그거 다 걸고 팔은 올라가?', '그거 다 걸고 팔은 올라가네?']);
E(42, 'goguryeo', 'The rider from Goguryeo', ['말은 안 들어 줘.', '말은 안 들어 주디.']);
E(42, 'goguryeo', 'The rider from Goguryeo', ['다음엔 좀 큰 사람 뒤에 숨어.', '다음엔 좀 큰 사람 뒤에 숨으라우.']);
E(42, 'mahan', 'The girl in the Mahan beads', ['올릴 필요 없어요. 남들이 들어 주니까.', '올릴 필요 없지라우. 남들이 들어 주니께.'], ['I don’t need to. People lift things for me.', 'Why, I don’t need to. Folks lift things for me.']);
E(42, 'mahan', 'The girl in the Mahan beads', ['가지세요. 마음 정하시면 돌려주시고요.', '가지씨요. 마음 정하시면 돌려주시고요.']);
E(42, 'silla', 'The weaver’s daughter from Jinhan', ['매듭이 싸구려네. 내 탓 아니야.', '매듭이 싸구려네. 내 탓 아이다.']);
E(42, 'gaya', 'ijinasi', ['반은 벌써 알아봤어. 이 해변에서 여자들 안 보는 사내는 너 하나야. 넌 바다를 보고 있잖아.', '반은 벌써 알아봤다. 이 해변에서 여자들 안 보는 사내는 니 하나다. 니는 바다를 보고 있다 아이가.'], ['Half of them can already tell, you know. You’re the only man on this beach not looking at the women. You’re looking at the sea.', 'Half of them can already tell, you know. You’re the only man on this beach not looking at the women. Looking at the sea, you are.']);
E(42, 'gaya', 'ijinasi', ['난 활 든 애한테 쇠 한 자루 걸었다.', '내는 활 든 아한테 쇠 한 자루 걸었다.'], ['I put a sack of iron on the one with the bow.', 'A sack of iron I put on the one with the bow.']);
E(42, 'gaya', 'suro', ['…어째서 그 여인이오.', '…와 그 여인이오.']);
E(42, 'gaya', 'ijinasi', ['네 환영 기둥에 화살을 박았잖아. 그런 여자는 다음 화살을 네 원수한테 박아.', '니 환영 기둥에 화살을 박았다 아이가. 그런 여자는 다음 화살을 니 원수한테 박는다.']);
E(42, 'gaya', 'ijinasi', ['알아.', '안다.']);
E(42, 'gaya', 'ijinasi', ['네 발등에 머리를 짰어, 형. 알아.', '니 발등에 머리를 짰다 아이가, 형. 안다.']);
E(42, 'tamla', 'The diver from Tamla', ['한 번만 더 해 봐. 네 말 빠뜨려 버린다.', '혼 번만 더 해 보라. 느 몰 빠뜨려 불크라.'], ['Do that again and I’ll drown your horse.', 'Do that again and it’s drowning your horse I’ll be.']);
E(42, 'gaya', CHIEF, ['전하. 마한이 여전히 일번입니다. 활 든 처녀가 올라오고 있고요. 그리고 누가 해녀한테 쇠 반 자루를 걸었습니다.', '전하. 마한이 여전히 일번입니더. 활 든 처녀가 올라오고 있고요. 그리고 누가 해녀한테 쇠 반 자루를 걸었습니더.']);
E(42, 'gaya', 'ijinasi', ['누가 걸었지.', '누가 걸었제.'], ['Somebody did.', 'Somebody did, didn’t they.']);
E(42, 'gaya', 'ijinasi', ['다 걸어, 형. 이 해변에서 안 건 사람은 너 하나야.', '다 건다, 형. 이 해변에서 안 건 사람은 니 하나다.']);
E(42, 'gaya', 'suro', ['…말하시오. 바위 위에 선 사내라고.', '…말하소. 바위 위에 선 사내라고.']);
E(42, 'gaya', CHIEF, ['그건 저입니다, 전하.', '그건 접니더, 전하.']);
E(42, 'gaya', 'A fish seller', ['늦은 사람이지 누구긴. 끝난 거 아니었어?', '늦은 사람이지 누구긴. 끝난 거 아이었나?'], ['Late, is who. Isn’t it over?', 'Late, is who. Over, wasn’t it?']);
E(42, 'gaya', 'A fish seller', ['…저기요? 내 생선 밟고 계신데.', '…보이소? 내 생선 밟고 계신데예.'], ['…Sir? You’re standing on my fish.', '…Sir? Standing on my fish, you are.']);
E(42, 'gaya', 'ijinasi', ['그럼 아무도 못 땄네.', '그라믄 아무도 몬 땄네.']);
E(42, 'gaya', CHIEF, ['판을 연 쪽이 땁니다, 전하. 저희가 열었지요.', '판을 연 쪽이 땁니더, 전하. 저희가 열었지예.'], ['The house wins, Majesty. We ran the book.', 'The house wins, Majesty. Ran the book, we did.']);
E(42, 'gaya', 'suro', ['어째서. 어째서 그리 먼 데서 왔소.', '와. 와 그리 먼 데서 왔소.']);
E(42, 'gaya', 'suro', ['그래서— 그 꿈. 거짓이었소?', '그래가— 그 꿈. 거짓이었소?']);
E(42, 'gaya', 'suro', ['…이러다간 과인이 그대 말을 배우겠소.', '…이라다간 과인이 그대 말을 배우겠소.']);

/* ───────── apply ───────── */
const counts = {};
let applied = 0;
let already = 0;
editStory((story) => {
	const entries = story.flatMap((c) => c.entries);
	for (const ed of edits) {
		const entry = entries[ed.ep - 1];
		const [oldKo, newKo] = ed.ko;
		const hits = [];
		for (const list of lists(entry))
			for (const b of list) {
				if (b.kind !== 'dialogue' || (b.person ?? b.speaker) !== ed.who) continue;
				b.lines.forEach((l, i) => {
					if (l === oldKo || l === newKo) hits.push({ b, i });
				});
			}
		const where = `#${ed.ep} ${entry.title} · ${ed.who} · ${oldKo}`;
		if (hits.length !== 1) throw new Error(`${hits.length} matches: ${where}`);
		const { b, i } = hits[0];
		const koDone = b.lines[i] === newKo;
		const enDone = !ed.en || b.en[i] === ed.en[1];
		if (koDone && enDone) {
			already++;
			continue;
		}
		if (ed.en && b.en[i] !== ed.en[0] && b.en[i] !== ed.en[1]) throw new Error(`English drifted: ${where}\n  have: ${b.en[i]}`);
		if (DRY) console.log(`${where}\n  → ${newKo}${ed.en ? `\n  ${ed.en[0]}\n  → ${ed.en[1]}` : ''}`);
		b.lines[i] = newKo;
		if (ed.en) b.en[i] = ed.en[1];
		applied++;
		counts[ed.tag] = (counts[ed.tag] ?? 0) + 1;
	}
	return !DRY && applied > 0;
});
console.log(`${applied} lines changed, ${already} already applied`, counts);
