/**
 * Dialect pass, episodes #43–#57 (Bidam's Rebellion with the Gaya arc, Jinduk → Exile).
 * Gaya: Gimhae 경남 + Welsh English (Suro's spirit fullest; Muryuk at home / among Gaya only; Seohyun on his deathbed in Jeon).
 * Silla: Gyeongju 경상 + clipped RP (commoners full, leads light in private, court untouched).
 * Baekje: 충청 + genteel Southern (light). Tamla: Yuri Dora to Jeju speech.
 * Idempotent. Each edit: [speaker, oldKo, newKo, oldEn?, newEn?]; matched by speaker + exact line.
 */
import { editStory, lists, textOf } from '../story-ops.mjs';

const KINGDOM = {
	muryuk: 'gaya', guhae: 'gaya', suro: 'gaya', seohyeon: 'gaya',
	'The arms-master': 'gaya', 'A Daegaya archer': 'gaya', 'An old lord of Daegaya': 'gaya',
	euija: 'baekje', eldersatek: 'baekje', elderyunbi: 'baekje', 'Gyebek’s Wife': 'baekje',
	yuridora: 'tamla'
};

const EDITS = {
	'Seung (承)': [
		['alchun', '너희 둘은 점수 때문에 서로를 죽일 거다.', '너거 둘은 점수 때문에 서로 쥑일 끼다.'],
		['alchun', '나는 가운데 있는 아이 때문에 나를 죽일 거다.', '나는 가운데 있는 아 때문에 내를 쥑일 끼고.', 'I will kill myself over the girl in the middle.', 'I shall kill myself over the girl in the middle.'],
		['alchun', '…농담이다. 농담으로 정리해 둬라.', '…농담이다. 농담으로 정리해 도라.'],
		['alchun', '저쪽 장수가 안장을 풀면, 위원회를 기다리지 않는다.', '저짝 장수가 안장 풀믄, 위원회 안 기다린데이.', 'If their captain loosens a saddle, we do not wait for a committee.', 'If their captain loosens a saddle, we shan’t wait for a committee.'],
		['bidam', '오늘은 내가 앞선다, 가야!', '오늘은 내가 앞선데이, 가야!'],
		['bidam', '……그리고 이길 때는 형님 소리 하지 마라.', '……그라고 이길 때는 형님 소리 하지 마라.'],
		['chunchu', '항아리 하나 가져가.', '항아리 하나 가 가라.'],
		['chunchu', '샘은 네 외숙이 아는 곳이다. 네가 김씨니까 문이 열릴 거다.', '샘은 니 외숙이 아는 데다. 니가 김씨니까 문이 열릴 끼다.'],
		['chunchu', '그 사람은 좋은 생각도 당나라 봉투에 담겨 오면 태울 사람이다. 강령의 전부가 그것이고 — 인기는 좋다.', '그 사람은 좋은 생각도 당나라 봉투에 담겨 오믄 태울 사람이다. 강령의 전부가 그기고 — 인기는 좋데이.', 'The man would burn a good idea for arriving in a Tang envelope. That is the whole platform — and it polls well.', 'The man would burn a good idea for arriving in a Tang envelope. That is the whole platform — and it polls rather well.'],
		['munhee', '이미 쌌어요.', '벌써 쌌어예.', 'I already packed.', 'I’ve already packed.'],
		['munhee', '여왕께서 즉위하시던 해에 쌌어요. 당신은 포위 때만 눈치채시죠.', '여왕께서 즉위하시던 해에 쌌어예. 당신은 포위 때만 눈치채시지예.']
	],
	Muryuk: [
		['guhae', '무력아. 일어나. 봐라.', '무력아. 일나라. 봐라.', 'Muryuk-a. Wake up. Look.', 'Muryuk-a. Up you get. Look.'],
		['guhae', '아니, 위. 더 위. 저기.', '아이, 우에. 더 우에. 저기.'],
		['muryuk', '…구름 속에 사람이 있어요.', '…구름 속에 사람이 있어예.', '…There’s a man in the clouds.', '…There’s a man in the clouds, there is.'],
		['muryuk', '왜 거꾸로예요?', '와 거꾸로라예?', 'Why is he upside down?', 'Upside down, why is he?'],
		['guhae', '내려오시는 중이다. 저분이 이비가, 하늘이시다.', '내려오시는 중이다. 저분이 이비가, 하늘이시데이.', 'He’s coming down. That’s Ibiga. The sky.', 'Coming down, he is. That’s Ibiga. The sky.'],
		['guhae', '산 위의 아씨를 한번 보시고는 집에 가는 걸 잊으셨지.', '산 우에 아씨를 한분 보시고는 집에 가는 거를 까묵으셨다 아이가.', 'He saw a lady on a mountain once and forgot to go home.', 'Saw a lady on a mountain once and forgot to go home, didn’t he.'],
		['muryuk', '왜요?', '와예?'],
		['guhae', '크면 알게 된다.', '크믄 안다.'],
		['guhae', '운이 좋으면 평생 모르고. 다음.', '운 좋으믄 평생 모르고. 다음.'],
		['muryuk', '알 여섯! 첫 번째가 수로왕이고요.', '알 여섯! 첫 번째가 수로왕이고예.'],
		['muryuk', '혼자서 바닷가까지 걸어 내려가서, 붉은 돛 단 배를 기다렸어요.', '혼자서 바닷가꺼정 걸어 내려가가, 붉은 돛 단 배를 기다렸어예.', 'He walked down to the beach all by himself and waited for a ship with red sails.', 'Walked down to the beach all by himself, he did, and waited for a ship with red sails.'],
		['guhae', '이건 아는구나.', '이건 아는구마.', 'You know this one.', 'This one you know.'],
		['muryuk', '설마다 들었어요. 그래도 해 주세요.', '설마다 들었어예. 그래도 해 주이소.', 'Every New Year. Tell it anyway.', 'Every New Year. Tell it anyway, go on.'],
		['guhae', '허왕후. 얼마나 먼 데서 오셨는지, 여기선 아무도 그 나라 이름을 제대로 말하지 못했다.', '허왕후. 얼마나 먼 데서 오셨는지, 여서는 아무도 그 나라 이름을 제대로 말을 몬 했다.', 'Queen Heo. She came from so far off that nobody here could say the name of her country.', 'Queen Heo. So far off she came that nobody here could say the name of her country.'],
		['muryuk', '…그다음은 저요?', '…그 담은 저라예?', '…Then me?', '…Then me, is it?'],
		['guhae', '여기서 해가 닿는 건 전부다.', '여서 해가 닿는 기 전부다.'],
		['guhae', '포구도, 쇠도, 언덕도. 언젠가 저걸 다 네가 돌보게 된다.', '포구도, 쇠도, 언덕도. 언젠가 저걸 다 니가 돌보게 될 끼다.', 'The harbour, the iron, the hills. One day all of it is yours to look after.', 'The harbour, the iron, the hills. Yours to look after one day, all of it.'],
		['muryuk', '전부요?', '전부예?'],
		['muryuk', '형들은요?', '형들은예?', 'What about the brothers?', 'What about the brothers, then?'],
		['muryuk', '아무것도 안 보여요.', '아무것도 안 보여예.'],
		['guhae', '크면 맞는다.', '크믄 맞는다.'],
		['guhae', '그리고 못 보는 임금은 들어야 하지. 나쁜 버릇은 아니다.', '그라고 못 보는 임금은 들어야 안 되나. 나쁜 버릇은 아이다.', 'And a king who can’t see has to listen. Not the worst habit.', 'And a king who can’t see has to listen. Not the worst habit, that.'],
		['The arms-master', '또요? 저하, 해도 안 떴습니다.', '또예? 저하, 해도 안 떴심더.', 'Again? Highness, the sun isn’t even up.', 'Again, is it? Highness, the sun isn’t even up.'],
		['The arms-master', '형님들은 아직 주무십니다.', '형님들은 아직 주무십니더.'],
		['muryuk', '그럼 주무시라 하게. 내가 깨어 있으면 되지.', '그라믄 주무시라 카게. 내가 깨어 있으믄 되지.', 'Then let them sleep. I’ll be up.', 'Then let them sleep. I’ll be up, won’t I.'],
		['A Silla spearman', '고깔— 고깔한테 붙지 마! 돌아가, 돌아서 가라고—', '고깔— 고깔한테 붙지 마라! 돌아가, 돌아서 가라 안 카나—'],
		['A Silla spearman', '몇 명째야— 저거 겸이잖아, 방금 겸이—', '몇 명째고— 저거 겸이 아이가, 방금 겸이—', 'How many has he— that was Gyeom, he just did Gyeom—', 'How many’s that— that was Gyeom, he’s just done Gyeom—'],
		['muryuk', '아버지—', '아부지—'],
		['muryuk', '여울 지켜. 지키라고. 내가 올라간다.', '여울 지키라. 지키라 카이. 내 올라간데이.', 'Hold the ford. HOLD it. I’m going up.', 'Hold the ford. HOLD it, I said. Up I go.'],
		['guhae', '앞을 봐라, 무력아.', '앞에 봐라, 무력아.'],
		['guhae', '형들은 앞을 보고 있다.', '형들은 앞에 보고 있다 아이가.', 'Your brothers are facing front.', 'Your brothers are facing front, aren’t they.'],
		['muryuk', '누군가는 어떻게 생겼는지 기억해야지요.', '누군가는 우째 생겼는지 기억해야지예.', 'Somebody should remember what it looked like.', 'Somebody should remember what it looked like, shouldn’t they.'],
		['muryuk', '……포구 말입니다. 그 전에.', '……포구 말입니더. 그 전에.'],
		['guhae', '그럼 조용히 기억해라. 임금들은 자기가 산 걸 상기받는 걸 싫어한다.', '그라믄 조용히 기억해라. 임금들은 지가 산 거 들추는 걸 싫어한데이.', 'Then remember it quietly. Kings don’t like being reminded what they bought.', 'Then remember it quietly. Don’t like being reminded what they bought, kings don’t.'],
		['Muryuk’s wife', '뭐 해요? 뭐라고 말 좀 해 줘요.', '뭐 하능교? 뭐라꼬 말 좀 해 주소.', 'Well? Say something to him.', 'Well? Do say something to him.'],
		['Muryuk’s wife', '밤새 당신 목소리 기다렸을 텐데.', '밤새 당신 목소리 기다렸을 낀데.'],
		['muryuk', '……당신이 먼저 하시오.', '……당신이 먼저 하소.'],
		['muryuk', '신라 말을 먼저 들어야지.', '신라 말을 먼저 들어야 안 되겠나.', 'He should hear Silla first.', 'Silla he should hear first.']
	],
	'Jeon (轉)': [
		['bidam', '…오늘은 안 오는구나.', '…오늘은 안 오는갑다.'],
		['bidam', '괜찮아. 여섯 번째 밤까지는 예의를 지켰어.', '됐다. 여섯 번째 밤까지는 예의를 지켰다 아이가.'],
		['chunchu', '……흰 말은 또 있어. 마구간에 셋이나.', '……흰 말은 또 있다. 마구간에 셋이나.'],
		['chunchu', '꼭 얘여야 해?', '꼭 야라야 되나?', 'Does it have to be this one?', 'Must it be this one?'],
		['yushin', '저쪽도 다 알아. 내가 무슨 말을 타는지.', '저쪽도 다 안다. 내가 무슨 말 타는지.'],
		['yushin', '남의 말을 바치면 하늘이 웃는 게 아니라 비담이 웃어.', '남의 말 바치믄 하늘이 웃는 기 아이라 비담이가 웃는다.'],
		['yushin', '낭비성에서 네가 아니었으면 난 거기서 끝났어.', '낭비성에서 니 아이었으믄 난 거서 끝났다.'],
		['chunchu', '……내가 할까.', '……내가 하까?', '…Want me to do it?', '…Shall I do it?'],
		['yushin', '내 말이야.', '내 말이다.'],
		['yushin', '……부르기 쉽게 지었다. 그만 울고 불러 봐.', '……부르기 쉽게 지었다. 고마 울고 불러 봐라.'],
		['A runner', '대장군— 아버님이십니다.', '대장군— 아버님이십니더.'],
		['A runner', '의원들이 오늘 밤이라 합니다. 자꾸 대장군을 찾으십니다.', '의원들이 오늘 밤이라 캅니더. 자꾸 대장군을 찾으십니더.'],
		['A runner', '…말도 찾으십니다. 어느 말을 말씀하시는지 저희는 모르겠고요.', '…말도 찾으십니더. 어느 말을 말씀하시는지 저희는 모르겠고예.'],
		['chunchu', '…안 보낼 거야. 점잖은 양반이거든. 그게 제일 고약한 점이지.', '…안 보낼 끼다. 점잖은 양반 아이가. 그기 제일 고약한 기라.', '…He won’t, though. He’s a gentleman. It’s the worst thing about him.', '…He won’t, though. He’s a gentleman. Rather the worst thing about him.'],
		['A rebel officer', '상대등. 대장군이 나갔습니다. 혼자.', '상대등. 대장군이 나갔습니더. 혼자.'],
		['A rebel officer', '이백만 주십시오. 아침이면 저 성문은 우리 겁니다.', '이백만 주이소. 아침이믄 저 성문은 우리 낍니더.'],
		['A rebel officer', '김씨 댁입니다. 노인이 위독하답니다.', '김씨 댁입니더. 노인이 위독하답니더.'],
		['bidam', '열여섯 살에 그 어른 밥상에서 밥을 먹었다. 밤새 국이 싱겁다고 사과하시더군.', '열여섯에 그 어른 밥상에서 밥을 묵었다. 밤새 국이 싱겁다꼬 사과하시더라.'],
		['bidam', '……집에 가게 둬라.', '……집에 가구로 놔도라.'],
		['seohyeon', '흠. 네 어미가 늘 그랬지. 언젠가 네가 하늘에 불을 놓을 거라고. 부추기지 말라 했는데.', '흠. 니 어매가 늘 그캤다 아이가. 언젠가 니가 하늘에 불을 놓을 끼라꼬. 부추기지 마라 캤는데.', 'Hm. Your mother always said you’d set the sky on fire one day. I told her not to encourage you.', 'Hm. Always said it, your mother did, that you’d set the sky on fire one day. Told her not to encourage you, I did.'],
		['seohyeon', '아무한테도 말하지 마라.', '아무한테도 말하지 마래이.', 'Don’t tell anyone.', 'Don’t you tell anyone, now.'],
		['seohyeon', '유신아. 가까이. 할 말이— 마흔 해를 하려고 했는데, 늘 말을 봐야 했거나, 아니면—', '유신아. 가까이 온나. 할 말이— 마흔 해를 할라 캤는데, 늘 말을 봐야 했거나, 아이믄—', 'Yushin. Closer. There’s a thing I— I’ve meant to say it for forty years, and there was always a horse to see to, or—', 'Yushin. Closer, bach. There’s a thing I— forty years I’ve meant to say it, and always a horse to see to, or—'],
		['seohyeon', '아— 실례하오. 아직 안 끝났소.', '아— 실례합니더. 아직 안 끝났심더.', 'Ah— excuse me. I wasn’t finished.', 'Ah— excuse me. Not finished, I wasn’t.'],
		['seohyeon', '아들한테 하던 말이 있는데, 저 녀석이 끝을—', '아들한테 하던 말이 있는데, 저 아가 끝을—'],
		['seohyeon', '……그건 좀 길어지겠소.', '……그건 좀 길어질 낍니더.', '…That’s going to take a while.', '…Long one, that’s going to be.'],
		['cheongwan', '오셨어요?', '오셨어예?'],
		['cheongwan', '……어머님께 다시는 안 오신다고 맹세하셨다더니.', '……어머님께 다시는 안 오신다꼬 맹세하셨다 카더니.']
	],
	Seohyun: [
		['A boy in the lane', '얼른, 깨 봐! 너네 집은 다 알에서 나왔다며.', '퍼뜩, 깨 봐라! 너거 집은 다 알에서 나왔다 카대.'],
		['A boy in the lane', '알 말로 뭐라고 해 봐. 너네 아버지처럼— 해 보라니까—', '알 말로 뭐라 캐 봐라. 너거 아부지맨치로— 해 보라 안 카나—'],
		['muryuk', '우리 것이었다. 이제는 신라 것이고.', '우리 끼었다. 인자는 신라 끼고.', 'It was ours. Now it’s Silla’s.', 'Ours, it was. Silla’s now.'],
		['muryuk', '밥 먹어라.', '밥 무라.'],
		['muryuk', '……누가 그러더냐.', '……누가 그카더노.', '…Who said that.', '…Who said that, then.'],
		['muryuk', '너는 뒷방에서 태어났다. 나는 밤새 갑옷 입고 마당에 서 있었고. 바보처럼.', '니는 뒷방에서 났다. 나는 밤새 갑옷 입고 마당에 서 있었고. 바보맨치로.', 'You were born in the back room. I stood in the yard all night in my armour, like a fool.', 'Born in the back room, you were. I stood in the yard all night in my armour, like a fool.'],
		['muryuk', '알에서 나온 놈은 없다. 먹어라.', '알에서 나온 놈은 없다. 무라.'],
		['muryuk', '애한테 말 좀 더 해 주시오. 당신이.', '애한테 말 좀 더 해 주소. 당신이.'],
		['muryuk', '……내 말은 다 포구에서 나오오. 애가 도깨비바늘처럼 묻혀 온단 말이오.', '……내 말은 다 포구에서 나온다 카이. 애가 도깨비바늘맨치로 묻혀 온단 말이요.', '…Everything I say comes out of a harbour. He picks it up like burrs.', '…Everything I say comes out of a harbour. Picks it up like burrs, he does.'],
		['Muryuk’s wife', '당신 아들이잖아요. 당신 목소리 좀 닮으면 어때서요.', '당신 아들 아입니꺼. 당신 목소리 좀 닮으믄 어때서예.'],
		['muryuk', '내 품계는 가져가라 하시오.', '내 품계는 가져가라 카소.', 'He can have my rank.', 'My rank he can have.'],
		['muryuk', '목소리는 당신 걸 주고.', '목소리는 당신 거 주고.'],
		['dodo', '나리. 가야 분한테 드리라던데요.', '나리. 가야 분한테 드리라 카던데예.'],
		['dodo', '……나리 맞으시죠?', '……나리 맞으시지예?'],
		['muryuk', '……잡은 게 아니다. 제가 도랑에 빠진 거지.', '……잡은 기 아이다. 지가 도랑에 빠진 기지.', '…I didn’t catch him. He rode into a ditch.', '…Didn’t catch him. Rode into a ditch, he did.'],
		['muryuk', '‘예, 나리’ 했잖느냐. 할 말은 그게 전부다.', '‘예, 나리’ 했다 아이가. 할 말은 그기 전부다.', 'I said “yes, my lord.” That’s the whole speech.', 'I said “yes, my lord.” Whole speech, that is.'],
		['muryuk', '……배워 둬라. 격구보다 쓸 데가 많을 거다.', '……배아 둬라. 격구보다 쓸 데가 많을 끼다.'],
		['muryuk', '누군가 아주 큰 값을 치렀다. 네가 저 대문 앞에 서서 왕자한테 욕이라도 들을 수 있게.', '누가 억수로 큰 값을 치렀다. 니가 저 대문 앞에 서가 왕자한테 욕이라도 들을 수 있구로.'],
		['muryuk', '말은 돌려줘라.', '말은 돌려조라.', 'Give the horse back.', 'Give the horse back, now.'],
		['A Daegaya archer', '애잖아. 애를 보냈어—', '얼라 아이가. 얼라를 보냈다—', 'That’s a child. They sent a child—', 'A child, that is. They sent a child—'],
		['A Daegaya archer', '안에 들어왔어. 어떻게 벌써 안이야?', '안에 들어왔다. 우째 벌써 안이고?'],
		['An old lord of Daegaya', '금관의 막내로구나.', '금관 막내로구마.', 'Geumgwan’s youngest.', 'Geumgwan’s youngest, is it.'],
		['An old lord of Daegaya', '그 말 하라고 너를 보냈나.', '그 말 하라꼬 니를 보냈나.'],
		['An old lord of Daegaya', '어떠냐. 저쪽은.', '우떻노. 저쪽은.', 'What is it like? Over there.', 'What’s it like, then? Over there.'],
		['muryuk', '보낸 사람 없습니다. 제가 오겠다고 했습니다.', '보낸 사람 없심더. 지가 오겠다 캤심더.', 'Nobody sent me. I asked to come.', 'Nobody sent me. Asked to come, I did.'],
		['muryuk', '처음 십 년은 춥습니다.', '처음 십 년은 춥심더.'],
		['muryuk', '그러다 손주가 생기는데, 그 애들은 추웠던 걸 기억 못 합니다.', '그라다 손주가 생기는데, 그 아아들은 추웠던 거 기억 몬 합니더.'],
		['Manmyung’s maid', '아가씨. 또 그 사람이에요.', '아가씨. 또 그 사람입니더.'],
		['Manmyung’s maid', '같은 말이에요. 같은— 안 보는 척해요.', '같은 말입니더. 같은— 안 보는 척하네예.'],
		['manmyung', '되게 못한다, 저거.', '디게 못한다, 저거.', 'He’s terrible at it.', 'He’s frightfully bad at it.'],
		['manmyung', '보지 마. …아니, 봐. 뭐 하나 보게.', '보지 마라. …아이다, 봐라. 뭐 하나 보구로.'],
		['First guard', '올 것 같냐?', '올 것 같나?', 'You think he’ll come?', 'Think he’ll come, then?'],
		['Second guard', '가야 놈? 그놈 제 말한테도 미안하다는 놈이야.', '가야 놈? 그놈 지 말한테도 미안타 카는 놈이다.', 'The Gaya one? He says sorry to his own horse.', 'The Gaya one? He apologises to his own horse.'],
		['Second guard', '담 넘어올 위인이 아니지.', '담 넘어올 위인이 아이제.'],
		['First guard', '모레 새벽에 북으로 떠난다던데.', '모레 새벽에 북으로 떠난다 카던데.'],
		['Second guard', '잘됐네. 그럼 우리도 집에 가고.', '잘됐네. 그라믄 우리도 집에 가고.'],
		['Second guard', '하늘이— 문을 쳤어, 문을 쳤다고—', '하늘이— 문을 쳤다, 문을 쳤다 안 카나—'],
		['First guard', '놔둬! 불붙었어, 문 놔둬, 놔두라고—', '놔도라! 불붙었다, 문 놔도라, 놔두라꼬—'],
		['manmyung', '보내라 그래. 일 년은 화난 척하실 거야.', '보내라 캐라. 일 년은 화난 척하실 끼다.'],
		['manmyung', '그다음엔 편지로 애 이름이 뭐냐고 물으시겠지.', '그 담엔 편지로 애 이름이 뭐냐꼬 물으시겠제.'],
		['The clerk’s wife', '스무 달이에요, 마님.', '스무 달입니더, 마님.'],
		['The clerk’s wife', '소도 이보단 빨라요.', '소도 이보다는 빠릅니더.'],
		['The clerk’s wife', '애가 보통이 아니거나, 처음부터 누가 셈을 틀렸거나. 어느 쪽인지는 말 안 해요. 사또댁이시니까.', '애가 보통이 아이거나, 처음부터 누가 셈을 틀렸거나. 어느 쪽인지는 말 안 할랍니더. 사또댁이시니까.', 'Either that child is something, or somebody counted wrong at the start, and I won’t say which. You’re the governor’s.', 'Either that child is something, or somebody counted wrong at the start, and I shan’t say which. You’re the governor’s.'],
		['The clerk’s wife', '…애가 보통이 아니에요.', '…애가 보통이 아입니더.'],
		['The clerk’s wife', '마님. 등이요.', '마님. 등이예.'],
		['The clerk’s wife', '보세요— 여기. 일곱 개예요. 누가 엄지로 꾹꾹 찍은 것처럼.', '보이소— 여기. 일곱 개라예. 누가 엄지로 꾹꾹 찍은 거맨치로.'],
		['The clerk’s wife', '별이요, 나리. 북두칠성. 갓난애 등에.', '별입니더, 나리. 북두칠성. 갓난애 등에.'],
		['The clerk’s wife', '저 좀 앉을게요.', '저 좀 앉을랍니더.'],
		['A Daeya officer', '이 성은 못 뺏는다들 합니다, 나리.', '이 성은 몬 뺏는다 캅니더, 나리.'],
		['manmyung', '보내 줘요. 제 무리한테 늦겠어요.', '보내 주이소. 지 무리한테 늦겠어예.'],
		['muryuk', '이리 다오.', '이리 도.']
	],
	'Gyeol (結)': [
		['suro', '음. 그다음이 뭐더라?', '음. 그 담이 뭐였노?', 'Mm. How does the rest go?', 'Mm. How does the rest go, now?'],
		['suro', '응? 아니, 아니. 거꾸로 물었소.', '응? 아이다, 아이다. 거꾸로 물었소.', 'Hm? No, no. You’ve got it the wrong way round.', 'Hm? No, no. Wrong way round, you’ve got it.'],
		['suro', '왜 머뭇거리오?', '와 머뭇거리요?', 'Why the hesitation?', 'Why the hesitation, then?'],
		['suro', '아니, 아니, 비담 생각을 묻는 게 아니오.', '아이다, 아이다, 비담 생각 묻는 기 아이요.', 'No, no, I’m not asking what Bidam thinks.', 'No, no, not asking what Bidam thinks, am I.'],
		['suro', '…비슷한 거요.', '…비슷한 기요.'],
		['suro', '그러셨소? 잘하셨네.', '그러셨소? 잘하셨네예.'],
		['suro', '그래서, 먹혔소?', '그래가, 먹혔소?', 'Did it work?', 'And did it work, then?'],
		['suro', '대체로라!', '대체로라 카네!', 'Mostly!', 'Mostly, is it!'],
		['suro', '자. 물어볼 게 있어서 내려왔지.', '자. 물어볼 기 있어가 내려왔제?', 'So. You came down here with a question.', 'So. Came down here with a question, you did.'],
		['suro', '물어보시오.', '물어보소.', 'Ask it.', 'Ask it, then.'],
		['suro', '낯선 이라! 이 물에서?', '낯선 이라 카나! 이 물에서?', 'A stranger! In this water?', 'A stranger, is it! In this water?'],
		['suro', '이건 뭘로 만들었소?', '이건 뭘로 맨들었소?', 'What’s this made of?', 'Made of what, this is?'],
		['suro', '흠! 그런데 신라를 위해 베는군.', '흠! 근데 신라 위해 베는구마.', 'Hm! And it cuts for Silla.', 'Hm! And cuts for Silla, it does.'],
		['suro', '쇠가 그걸 언짢아하오?', '쇠가 그걸 언짢아하요?', 'Does the iron mind?', 'Mind, does it, the iron?'],
		['suro', '그럼 그대는 왜 언짢소?', '그라믄 그대는 와 언짢소?', 'Then why do you?', 'Then why do you, cariad?'],
		['suro', '내려다보시오.', '내리다보소.', 'Look down.', 'Look down, now.'],
		['suro', '뿐이라! 꼭 작은 것처럼 말하는구려.', '뿐이라! 꼭 쪼매난 것맨치로 말하네.', 'Only! You say it like it’s small.', 'Only! Small, you make it sound.'],
		['suro', '더 자세히 보시오.', '더 자세히 보소.', 'Look harder.', 'Look harder, bach.'],
		['muryuk', '물에 서 있는 꼴이 나랑 똑같구나.', '물에 서 있는 꼴이 내캉 똑같네.', 'You stand in the water the way I did.', 'Stand in the water the way I did, you do.'],
		['muryuk', '뒷발에 무게를 싣고. 언제든 떠날 사람처럼.', '뒷발에 무게 싣고. 언제든 떠날 사람맨치로.'],
		['muryuk', '나도 한때는 왕자였다. 셋 중 막내로, 북쪽으로 가는 수레에 타고.', '나도 한때는 왕자였다 아이가. 셋 중 막내로, 북쪽으로 가는 수레에 타고.', 'I was a prince once. The youngest of three, in a cart going north.', 'A prince I was, once. The youngest of three, in a cart going north.'],
		['muryuk', '형들은 앞길을 봤지. 나는 뒤를 돌아봤다.', '형들은 앞길을 봤제. 나는 뒤를 돌아봤고.'],
		['muryuk', '그다음엔 장수였다. 그 길의 주인들을 위한.', '그 담엔 장수였제. 그 길 주인들을 위한.', 'Then I was a general, for the people who owned the road.', 'A general, then, for the people who owned the road.'],
		['yumjong', '그런— 그런 얼굴 마십시오, 상대등.', '그런— 그런 얼굴 마이소, 상대등.'],
		['yumjong', '행군했잖습니까. 안 할 거라 하셨는데. 했잖습니까…', '행군 안 했습니꺼. 안 할 끼라 카셨는데. 했다 아입니꺼…'],
		['yumjong', '……그래도 좋은 말이었지요. 가야. 다들 외치기 좋아했는데.', '……그래도 좋은 말이었지예. 가야. 다들 외치기 좋아했는데.'],
		['bidam', '……저쪽은 그저께 흰 말을 태웠지. 내가 지더라도 이 녀석은 누가 붙잡고 있어야 해.', '……저짝은 그저께 흰 말을 태웠제. 내가 지더라도 이놈은 누가 붙잡고 있어야 된다.'],
		['bidam', '북쪽 지키는 분 이름이야.', '북쪽 지키는 분 이름이데이.'],
		['bidam', '오늘은 서쪽만 봐.', '오늘은 서쪽만 봐라.'],
		['bidam', '너 아직도 왼어깨가 처지는구나.', '니 아직도 왼어깨가 처지네.'],
		['bidam', '평생 딱 한 번. “졌다”고.', '평생 딱 한 번. “졌다” 캐라.'],
		['A Hwarang', '대장군— 성벽이 비었습니다. 골짜기로 달아납니다.', '대장군— 성벽이 비었습니더. 골짜기로 달아납니더.'],
		['A Hwarang', '쫓을까요?', '쫓으까예?']
	],
	'Queen Jinduk': [
		['courtmaid', '선왕마마셨으면 비 올 줄 아셨을 텐데.', '선왕마마 같았으믄 비 올 줄 아셨을 낀데.'],
		['courtmaid', '…아시긴 하셨겠지.', '…아시기는 하셨을 끼다.'],
		['courtmaid', '……비 온다.', '……비 온데이.'],
		['courtmaid', '누가 알았어?', '누가 알았나?']
	],
	'Huangdi (皇帝)': [
		['chunchu', '공부해라, 인문아. 여기선 그게 핏줄보다 빠르다.', '공부해라, 인문아. 여서는 그기 핏줄보다 빠르데이.'],
		['inmun', '풀이 아직 안 말랐습니다, 아버님.', '풀이 아직 안 말랐습니더, 아버님.'],
		['inmun', '이것도… 조화롭게 한 겁니까?', '이것도… 조화롭게 한 깁니꺼?'],
		['chunchu', '갓 한 거다. 여긴 풀이 마르기도 전에 조화롭게 하지.', '갓 한 기다. 여는 풀이 마르기도 전에 조화롭게 한다 아이가.'],
		['ongunhae', '공께서는 작은 배로.', '공께서는 작은 배로 가이소.'],
		['ongunhae', '그래서 제가 씁니다.', '그래가 지가 씁니더.']
	],
	'Royal Secretariat': [
		['jukji', '황제가 바뀌면 연호도 바뀌어.', '황제가 바뀌믄 연호도 바뀐다.'],
		['jukji', '정월부터 우리가 보내는 편지마다, 날짜에 그 사람 연호를 다느냐 안 다느냐야.', '정월부터 우리가 보내는 편지마다, 날짜에 그 사람 연호를 다느냐 마느냐 아이가.'],
		['munmu', '……그래서, 형?', '……그래가, 형?'],
		['jukji', '그게 답이라고. 우리가 저쪽 사람인지 아닌지. 저쪽은 편지보다 날짜를 먼저 읽을 거야.', '그기 답이라 카이. 우리가 저쪽 사람인지 아인지. 저쪽은 편지보다 날짜를 먼저 읽을 끼다.'],
		['Granary clerk', '이백열두 섬입니다, 나리. 봄부터요.', '이백열두 섬입니더, 나리. 봄부터예.'],
		['Granary clerk', '네 번 올렸습니다. 벽에도 써 놨습지요. 벽도 아무도 안 읽습니다.', '네 번 올렸심더. 벽에도 써 놨지예. 벽도 아무도 안 읽습니더.'],
		['Monk', '글자로 된 건 다 읽소. 마음에 드는지는 별개 문제고.', '글자로 된 기믄 다 읽소. 맘에 드는지는 딴 문제고.'],
		['euija', '“신라에서 빼앗은 성을 돌려주라.” 하! 들어 봐라, 계백아. 더 재밌다.', '“신라에서 빼앗은 성을 돌려주라.” 하! 들어 봐, 계백아. 더 재밌어.'],
		['euija', '싸워서! 천자께서 집에 계시겠다는 말을 두루마리 하나 가득 써 보내셨구나.', '싸워서! 천자께서 집에 계시겠다는 말을 두루마리 하나 가득 써 보내셨구먼.'],
		['euija', '신라뿐! 들었느냐? 하늘이 내 적을 세어 주셨다. 하나!', '신라뿐! 들었냐? 하늘이 내 적을 세어 주셨네그려. 하나!'],
		['euija', '영광이라고 답장 써라. 그리고 가서 성 하나 더 빼앗아 와.', '영광이라구 답장 써. 그리구 가서 성 하나 더 뺏어 와.', 'Write back that we’re honoured. Then go and take another fort.', 'Write back that we’re mighty honoured. Then go and take another fort.']
	],
	'King Muyeol': [
		['jayi', '서쪽 성들 쌀. 하나를 잘못 올렸잖아.', '서쪽 성들 쌀. 하나 잘못 올렸다 아이가.'],
		['jayi', '십 년인데, 아직도 하나를 잘못 올리잖아.', '십 년인데, 아직도 하나 잘못 올린다 아이가.']
	],
	Jahee: [
		['jayi', '셈이 틀렸어요.', '셈이 틀렸어예.'],
		['jayi', '조수는 왕자인 걸 상관하지 않아요.', '조수는 왕자든 말든 상관 안 해예.'],
		['jayi', '다시 세요.', '다시 세이소.'],
		['jayi', '제가 보는 앞에서요.', '제 보는 앞에서예.'],
		['jayi', '안 닫혀요. 마흔 섬이 비어요. 셋째 배와 다섯째 배 사이 어딘가에서.', '안 닫혀예. 마흔 섬이 빕니더. 셋째 배캉 다섯째 배 사이 어데서.'],
		['jayi', '마흔 섬이면 한 부대가 이레를 굶어요.', '마흔 섬이믄 한 부대가 이레를 굶어예.'],
		['jayi', '……우리 아버지 기침이에요.', '……우리 아부지 기침이라예.'],
		['jayi', '없는 척할 때만 저렇게 기침하세요.', '없는 척할 때만 저래 기침하시거든예.'],
		['jayi', '……그러니까 지금이 아니면 안 돼요.', '……그라니까 지금 아이믄 안 돼예.'],
		['jayi', '유신 장군은 아침 물때라고 했잖아요.', '유신 장군은 아침 물때라 캤다 아입니꺼.'],
		['jayi', '……그리고 돌아와서 셈 고칠 거예요?', '……그라고 돌아와가 셈 고칠 낍니꺼?'],
		['jayi', '아버지. 이 포구 사람들 다 셈할 줄 알아요.', '아부지. 이 포구 사람들 다 셈할 줄 압니더.'],
		['jayi', '아버지가 가르치셨잖아요.', '아부지가 가르치셨다 아입니꺼.'],
		['seonpum', '넌 입 다물어라. 누구냐? 이름을 대!', '니는 입 다물어라. 누고? 이름 대라!'],
		['seonpum', '이거 참 끔찍하게 놀랍구먼.', '이거 참 디게 놀랍데이.', 'What a terrible shock.', 'What a frightful shock.'],
		['yushin', '물때를 놓쳤군.', '물때를 놓쳤구마.'],
		['yushin', '대답이 연설뿐이면 넌 아직 여섯이다.', '대답이 연설뿐이믄 니는 아직 여섯이다.'],
		['yushin', '멍이 값이면 — 화랑이 되어 가는 거다.', '멍이 값이믄 — 화랑이 되어 가는 기다.'],
		['alchun', '이 나라에 옷일 뿐인 건 없다, 얘야.', '이 나라에 옷일 뿐인 기 없다, 얘야.'],
		['alchun', '첫 임금이 어디서 왔는지 물어봐라. 그럼 저 양반들이 뭘 투덜대는지 알 게다.', '첫 임금이 어데서 왔는지 물어봐라. 그라믄 저 양반들이 뭘 투덜대는지 알 끼다.']
	],
	Hyukgose: [
		['alchun', '그게 육촌이다, 얘야. 내 윗대 할아버지가 그중 하나였다. 비담네도 그랬고.', '그기 육촌이다, 얘야. 내 윗대 할아버지가 그중 하나였다. 비담이네도 그랬고.'],
		['alchun', '그건 네 아버지한테 물어라. 이야기 좋아하잖냐.', '그건 니 아부지한테 물어봐라. 이야기 좋아한다 아이가.']
	],
	Talhae: [
		['suro', '그리고 그대, 배고파 보였소. 혹시— 먹을 게 있소만.', '그라고 그대, 배고파 보였소. 혹시— 묵을 기 있소만.', 'And you looked hungry. Are you— there’s food.', 'And hungry, you looked. Are you— there’s food.']
	],
	Exile: [
		['eldersatek', '상이 끝나면, 그 말머리가 어느 집 쪽으로 돌 것 같소.', '상이 끝나믄, 그 말머리가 어느 집 쪽으루 돌 것 같슈.', 'When the mourning’s over, whose house do you suppose that horse turns toward.', 'When the mourning’s over, whose house do you reckon that horse turns toward.'],
		['elderyunbi', '사대요.', '사대유.'],
		['elderyunbi', '우리끼리 싸우다 다 망하겠구려.', '우리끼리 싸우다 다 망하겄구려.', 'We will destroy each other and lose everything.', 'We will destroy each other and lose everything, I reckon.'],
		['eldersatek', '아이를 생각하게.', '아이를 생각허게.', 'Think of the boy.', 'Think of the boy, son.'],
		['eldersatek', '임금이 지어낸 이름을 달고 클 걸세. 사비의 문이란 문은 다 그걸 알 테고.', '임금이 지어낸 이름 달구 클 걸세. 사비 문이란 문은 다 그걸 알 테구.'],
		['Gyebek’s Wife', '얼마나요.', '얼마나유.'],
		['Gyebek’s Wife', '아무 거라도요. 애들한테 해 줄 말.', '아무 거라두유. 애들한테 해 줄 말.'],
		['Gyebek’s Wife', '아무 숫자나 말해 봐요.', '아무 숫자나 말해 봐유.'],
		['Gyebek’s Wife', '…그렇죠. 당신은 안 그러지.', '…그렇쥬. 당신은 안 그러지.'],
		['euija', '그다음에 배를 보낸다. 뭐 하느냐? 시작해라.', '그다음에 배를 보낸다. 뭐 혀? 시작혀.', 'Then I send a boat. Well? Start.', 'Then I send a boat. Well? What are you waiting on? Start.'],
		['yuridora', '아이고, 인사부터 하는 사람은 아니구나.', '아이고, 인사부터 허는 사름은 아니로구나.', 'Ah. Not one for greetings, then.', 'Ah. It’s no man for greetings you are.'],
		['yuridora', '열하루. 됐나?', '열하루. 이젠 됐주?', 'Eleven. Better?', 'Eleven, so. Better?'],
		['yuridora', '뭐까지 말이냐?', '무신 날꺼지 말이냐?'],
		['yuridora', '허. 달력을 품고 다니는 놈이로구나.', '허. 달력을 품엉 댕기는 놈이로구나.', 'Ha. A man who carries his own calendar.', 'Ha. A man that carries his own calendar about with him.'],
		['yuridora', '이름은?', '이름은 뭐고?', 'Your name?', 'And what is it they call you?'],
		['yuridora', '뭐? 계백? 거북이라고?', '뭐? 계백? 거북이엔?', 'Gyebek? Like geobuk? A man named Turtle?', 'Gyebek? Like geobuk? Sure you’re never called Turtle?'],
		['yuridora', '…농담이었다.', '…농담이주.', '…It was a joke.', '…It was a joke I was making.']
	]
};

const strip = (s = '') => s.replace(/<[^>]+>/g, '');
const problems = [];
const changed = {};
let already = 0;

editStory((story) => {
	const entries = story.flatMap((c) => c.entries);
	for (const [title, edits] of Object.entries(EDITS)) {
		const hits = entries.filter((e) => e.title === title);
		if (hits.length !== 1) {
			problems.push(`${title}: ${hits.length} entries`);
			continue;
		}
		const e = hits[0];
		const swaps = [];
		for (const [who, oldKo, newKo, oldEn, newEn] of edits) {
			const found = [];
			for (const list of lists(e))
				for (const b of list) {
					if (b.kind !== 'dialogue' || (b.person ?? b.speaker) !== who) continue;
					b.lines.forEach((l, j) => {
						if (l !== oldKo && l !== newKo) return;
						if (oldEn && b.en[j] !== oldEn && b.en[j] !== newEn) return;
						found.push({ b, j });
					});
				}
			if (found.length !== 1) {
				problems.push(`${title} · ${who} · "${oldKo}": ${found.length} matches`);
				continue;
			}
			const { b, j } = found[0];
			const doneKo = b.lines[j] === newKo;
			const doneEn = !newEn || b.en[j] === newEn;
			if (doneKo && doneEn) {
				already++;
				continue;
			}
			if (!doneKo) swaps.push([b.lines[j], newKo]);
			if (!doneEn) swaps.push([b.en[j], newEn]);
			b.lines[j] = newKo;
			if (newEn) b.en[j] = newEn;
			const k = KINGDOM[who] ?? 'silla';
			changed[k] = (changed[k] ?? 0) + 1;
		}
		const hay = lists(e).flat().map((b) => strip(textOf(b))).join('\n');
		for (const im of e.images ?? []) {
			if (!im.at || hay.includes(strip(im.at))) continue;
			const swap = swaps.find(([old]) => strip(old).includes(strip(im.at)));
			if (swap) {
				console.log(`anchor ${im.id}: "${im.at}" → "${strip(swap[1])}"`);
				im.at = strip(swap[1]);
			}
		}
	}
});

console.log('lines changed by kingdom:', changed, `(already applied: ${already})`);
if (problems.length) {
	console.log(problems.join('\n'));
	process.exitCode = 1;
}
