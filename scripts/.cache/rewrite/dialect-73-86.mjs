/**
 * Dialect pass, episodes 73–86 (see DIALECT-PASS.md / DIALECTS.md).
 * Each edit swaps one dialogue line by exact text: ko [old, new], optional en [old, new].
 * Re-runnable: a line already in its new form is skipped. An image `at` that quoted the old line must survive.
 * `node scripts/.cache/rewrite/dialect-73-86.mjs`
 */
import { editStory, lists } from '../story-ops.mjs';

const EDITS = {
	// Yellow Mountain: Baekje camp talk (Seokdal full, Gyebek light to his own), Silla among their own.
	73: [
		{ ko: ['척후가 돌아왔습니다, 장군. 탄현을 넘어옵니다. 맨 앞에 유신의 깃발입니다.', '척후가 돌아왔슈, 장군. 탄현을 넘어오는디, 맨 앞에 유신의 깃발이구먼요.'] },
		{ ko: ['5만이라 하옵니다.', '5만이래유.'] },
		{ ko: ['…아시지 않습니까, 장군.', '…아시잖어유, 장군.'] },
		{ ko: ['말하시오. 한 번은 소리로 듣고 싶소.', '말허슈. 한 번은 소리루 듣구 싶소.'] },
		{ ko: ['오천입니다.', '오천이유.'] },
		{
			ko: ['그리고 바다입니다, 장군. 강어귀에 돛이 가득합니다. 뱃사람들이 세다가 그만뒀답니다.', '그리구 바다입니다, 장군. 강어귀에 돛이 그득허구, 뱃사람들이 세다가 그만뒀대유.'],
			en: ['And the sea, General. Sails at the river mouth. The boatmen gave up counting them.', 'And the sea, General. A mighty lot of sails at the river mouth. The boatmen gave up counting them.']
		},
		{ ko: ['그럼 나중에 내가 세겠소.', '그럼 냉중에 내가 세겄소.'] },
		{ ko: ['…유신. 당이 먼저 도착하게 하지 마라. 저들은 천 년 동안 그렇게 적을 거다.', '…유신. 당이 먼저 도착하게 하지 마래이. 저들은 천 년 동안 그래 적을 끼다.'] },
		{ ko: ['세 갈래입니다, 장군. 길마다 하나씩.', '세 갈래유, 장군. 길마다 하나씩.'] },
		{
			ko: ['개울 건너에 진을 칩니다. 팔천 걸음쯤입니다.', '개울 건너서 진을 치는디, 팔천 걸음은 되겄어유.'],
			en: ['They’re making camp past the stream. Eight thousand paces, about.', 'They’re making camp past the stream. Eight thousand paces, I reckon.']
		},
		{ ko: ['죽음이 일찍 왔다면, 우리는 제시각인 거다.', '죽음이 일찍 왔다면, 우리는 제시각인 겨.'] },
		{ ko: ['셋 다 개울 너머로 물러갑니다, 장군.', '셋 다 개울 너머루 물러가유, 장군.'] },
		{ ko: ['가운데는 사람이 있습니다.', '가운데는 사람이 있구유.'] },
		{ ko: ['오른쪽은 둘 다 있고, 한 시진 전보다 둘 다 적습니다.', '오른쪽은 둘 다 있는디, 한 시진 전보다 둘 다 줄었슈.'] },
		{ ko: ['장군, 백마입니다. 그 사람입니다.', '장군, 백마입니다. 그 사람이유.'] },
		{ ko: ['유신이 직접 옵니다. 가운데 길로.', '유신이 직접 와유. 가운데 길루.'] },
		{ ko: ['형님. 당군이 강어귀에 와 있습니다.', '형님. 당군이 강어귀에 와 있심더.'] },
		{ ko: ['내일이 열흘입니다.', '내일이 열흘입니더.'] },
		{ ko: ['무슨 날인지는 아네.', '무신 날인지는 아네.'], en: ['I know what day it is.', 'I know quite well what day it is.'] },
		{ ko: ['왜 이런 짓을 하는 게냐?', '왜 이런 짓을 허는 겨?'], en: ['Why do you do all of this?', 'Why on earth do you do all of this?'] },
		{ ko: ['너한텐 네 약조가 있지. 이제 내 약조도 있다.', '너한텐 네 약조가 있지. 이제 내 약조두 있다.'] },
		{ ko: ['…보통은 그런 걸 안 묻는데.', '…보통은 그런 걸 안 묻는디.'], en: ['…People don’t usually ask that.', '…Folks don’t usually ask that.'] }
	],

	// Sabi: Euija drinking and on the river (private), the Ye brothers among their own, the cliff maids,
	// Gumil cornered, Chunchu and Bupmin at home. The steps, the feast and the Tang tent stay standard.
	74: [
		{ ko: ['저거 봐라. 남은 놈들이 전부 한 벌판에 있다.', '저거 봐라. 남은 놈들이 몽땅 한 벌판에 있구먼.'] },
		{ ko: ['하… 세어 주지 마라. 나도 셀 줄 안다.', '하… 세어 주지 마라. 나두 셀 줄 알어.'], en: ['Ha… Don’t count them for me. I can count.', 'Ha… Don’t you count them for me. I can count.'] },
		{ ko: ['성충이 그랬지. 고개를 막아라. 강어귀를 막아라. 옥에서, 다 떨리는 손으로 적어 보냈다.', '성충이 그랬지. 고개를 막어라. 강어귀를 막어라. 옥에서, 다 떨리는 손으루 적어 보냈어.'] },
		{ ko: ['그 옥에 넣은 게 나다. …하.', '그 옥에 넣은 게 나여. …하.'] },
		{ ko: ['이걸 봤으면 좋아했을 게다. 꼴 보기 싫게 굴었겠지.', '이걸 봤으믄 좋아라 했을 겨. 꼴 보기 싫게 굴었겄지.'], en: ['He’d love this. He’d be unbearable.', 'He’d love this. He’d be plumb unbearable.'] },
		{
			ko: ['폐하께서 어제처럼… 저희를 찾으시겠지.', '폐하께서 어제맨치로… 우릴 찾으시겄지.'],
			en: ['He’ll reach for us today, like yesterday.', 'He’ll be reaching for us today, same as yesterday.']
		},
		{ ko: ['오늘은 안 계셔. / …그래도 몸이 기억나.', '오늘은 안 계셔. / …그래두 몸이 기억혀.'] },
		{
			ko: ['식진아! 좋은 놈. 네 할아비가 내 할아비 위해 이 바위를 지켰지?', '식진아! 좋은 놈. 네 할아비가 내 할아비 위해 이 바위를 지켰잖여?'],
			en: ['Sikjin! Good man. Your grandfather held this rock for my grandfather, eh?', 'Sikjin! Good man. Your granddaddy held this rock for my granddaddy, didn’t he?']
		},
		{ ko: ['다시 지키는 거다. 주작이 언제까지 진흙탕에 앉아 있겠냐.', '다시 지키는 겨. 주작이 은제까지 진흙탕에 앉아 있겄냐.'] },
		{ ko: ['예순둘? 하! 뱃전에 대고 토하는 놈들이 예순두 척이로구나.', '예순둘? 하! 뱃전에 대구 토하는 놈들이 예순두 척이구먼.'] },
		{ ko: ['식진아, 멀미하는 소로는 밭을 못 간다. 하하!', '식진아, 멀미허는 소루는 밭을 못 갈어. 하하!'] },
		{ ko: ['술 가져오너라. 좋은 잔으로. 수비대 잔 말고.', '술 가져오너라. 좋은 잔으루. 수비대 잔 말구.'], en: ['Bring wine. The good cups. Not the garrison ones.', 'Fetch wine. The good cups. Not the garrison ones.'] },
		{ ko: ['태가 왕관을 썼다고? 그놈은 호박에 갓도 못 씌우는 놈이다!', '태가 왕관을 썼다구? 그놈은 호박에 갓도 못 씌우는 놈이여!'] },
		{ ko: ['…좋다. 꿇은 아들도 아들이지. 성을 되찾으면 한 달은 마당에 세워 두마. 하하!', '…됐어. 꿇은 아들두 아들이지 뭐. 성 되찾으믄 한 달은 마당에 세워 둘 겨. 하하!'] },
		{
			ko: ['그 장군은 진흙 얘기를 날씨 얘기하듯 하더라. 진흙은 젖은 길일 뿐이라나.', '그 장군은 진흙 얘기를 날씨 얘기허듯 허더라. 진흙은 젖은 길일 뿐이랴.'],
			en: [
				'That general talks about mud the way other men talk about weather. Mud is just wet road, apparently.',
				'That general talks about mud the way other men talk about weather. Mud is just wet road, if you please.'
			]
		},
		{ ko: ['그리고 이 성에 방이 몇 개냐고 묻더군. 아우한테 물어봐야 한다고 했다. 세는 건 너니까.', '그리구 이 성에 방이 몇 개냐구 묻더구먼. 아우한테 물어봐야 헌다구 했지. 세는 건 너니께.'] },
		{ ko: ['폐하 방까지 치면요.', '폐하 방까지 치믄유.'] },
		{ ko: ['방에 따라 다릅니다.', '방 나름이지유.'] },
		{ ko: ['수비대 술도 마시다 보니 정이 드는구나, 식진아!', '수비대 술두 마시다 보니 정이 드는구먼, 식진아!'] },
		{ ko: ['끝나면 너는 조정으로 올라온다. 진짜 자리로. 앞줄로. 배 세는 짓은 그만이다.', '끝나믄 너는 조정으로 올라오는 겨. 진짜 자리루. 앞줄루. 배 세는 짓은 그만이다.'] },
		{ ko: ['얼굴이 왜 그러냐? 농담 아니다. 마셔라!', '얼굴이 왜 그려? 농담 아니다. 마셔라!'], en: ['What’s that face? That wasn’t a joke. Drink!', 'What’s that face? That wasn’t a joke. Drink up!'] },
		{ ko: ['하! 들었느냐? 어느 자리냐니! 아무 데나 골라라.', '하! 들었냐? 어느 자리냐니! 아무 디나 골라.'] },
		{ ko: ['내 자리가 마흔하나나 있다.', '내 자리가 마흔하나나 있어.'] },
		{ ko: ['내가 한 말이다. 열아홉 해 전에. 너 같은 놈들로 꽉 찬 전각에서.', '내가 한 말이여. 열아홉 해 전에. 너 같은 놈들루 꽉 찬 전각에서.'] },
		{ ko: ['…뭘 보느냐? 밧줄은 좋은 걸로 가져와라. 수비대 것 말고.', '…뭘 보느냐? 밧줄은 좋은 걸루 가져와라. 수비대 것 말구.'] },
		{ ko: ['이제 돛은 그만 세도 되겠다.', '이제 돛은 그만 세두 되겄다.'] },
		{ ko: ['…하나 더 있습니다.', '…하나 더 있슈.'] },
		{ ko: ['내려가는 배요.', '내려가는 배유.'] },
		{ ko: ['아~ 아버지가 결국 왔네.', '아~ 아부지가 결국 왔네.'] },
		{ ko: ['저 양반한테 뭐가 들었냐고 묻는 거 다 들었어. 해 봐. 나한테도.', '저 양반한테 뭐가 들었냐꼬 묻는 거 다 들었다. 해 봐라. 내한테도.'] },
		{ ko: ['아니래? 아이고~ 신라 제일가는 말쟁이가, 아니래.', '아니라꼬? 아이고~ 신라 제일가는 말쟁이가, 아니라 카네.'] },
		{
			ko: ['그 성 놈들 다 쓰레기였어. 당신 사위가 내 마누라를 데려갔고, 나머지는 구경만—', '그 성 놈들 다 쓰레기였다 카이. 당신 사위가 내 마누라를 데려갔고, 나머지는 구경만—'],
			en: [
				'Everyone in that fortress was trash, you know. Your son-in-law took my wife, and the rest of them watched—',
				'Everyone in that fortress was trash, I tell you. Your son-in-law took my wife, and the rest of them watched—'
			]
		},
		{
			ko: ['아버님. 평양 이남과 백제 땅 전부. 그 말들 앞에서 그렇게 말했다고, 아버님이 그러셨잖습니까.', '아버님. 평양 이남하고 백제 땅 전부. 그 말들 앞에서 그래 말했다꼬, 아버님이 그러셨다 아입니꺼.'],
			en: [
				'Father. Everything south of Pyongyang and the whole of Baekje. He said it in front of the horses. You told me.',
				'Father. Everything south of Pyongyang and the whole of Baekje. He said it in front of the horses. You told me so yourself.'
			]
		},
		{ ko: ['그랬지.', '그랬제.'] },
		{
			ko: ['천자의 말이 곧 문서라고도 했다. 붓을 챙겨 갈 걸 그랬어.', '천자 말이 곧 문서라꼬도 캤다. 붓을 챙겨 갈 걸 그랬다.'],
			en: ['He also said an emperor’s word was the writing. I should have brought a brush.', 'He also said an emperor’s word was the writing. I rather wish I’d brought a brush.']
		}
	],

	// Buyeo Euija: standard in the Tang hall; light when only the dead are listening.
	75: [
		{ ko: ['흥… 너희 진짜였구나…', '흥… 너희 진짜였구먼…'], en: ['Heh… so you guys are real after all…', 'Heh… so y’all are real after all…'] },
		{ ko: ['…용이지. 당연히.', '…용이지. 당연허지.'] },
		{ ko: ['용은 수백 명이 봤다. 증자가 뭘 하는 건 아무도 못 봤고.', '용은 수백 명이 봤어. 증자가 뭘 허는 건 아무두 못 봤구.'] },
		{ ko: ['너였다, 이 바보야. 이름은 그냥 그때 내가 가진 것 중에 제일 좋은 거였고.', '너였어, 이 바보야. 이름은 그냥 그때 내가 가진 것 중에 젤 좋은 거였구.'] },
		{ ko: ['몇 번째냐.', '몇 번째여?'] }
	],

	// Kim Chunchu: the deathbed is family. Kangrim stays standard, and so does Chunchu answering him.
	76: [
		{ ko: ['당이 겨울까지 평양으로 오라 하네.', '당이 겨울꺼정 평양으로 오라 카네.'] },
		{ ko: ['자네가 바쁘다고 해 두었네.', '자네가 바쁘다꼬 해 뒀네.'], en: ['I told them you were busy.', 'I told them you were rather busy.'] },
		{
			ko: ['형님, 오늘은 좀 앉으시오. 형님이 서 있으면 방이 성문 같소.', '형님, 오늘은 쫌 앉으소. 형님이 서 있으믄 방이 성문 같소.'],
			en: ['Brother, sit down for once. You make the room look like a gate.', 'Brother, do sit down for once. You make the room look like a gate.']
		},
		{ ko: ['…북으로 데려가 주시오. 법민을. 저 애는 성벽에 돌격하고 싶어 할 거요. 돌격하게 두지 마시오.', '…북으로 데려가 주소. 법민이를. 저 애는 성벽에 돌격하고 싶어 할 끼요. 돌격하게 두지 마소.'] },
		{ ko: ['문희야. 내가... 값을 다 치렀느냐?', '문희야. 내가... 값을 다 치렀나?'] },
		{ ko: ['아직요. 나머지는 제가 치를게요.', '아직예. 나머지는 제가 치를게요.'] },
		{ ko: ['아주 좋은 치마였지요.', '아주 좋은 치마였지예.'] },
		{ ko: ['애 앞에서 울리지 마세요.', '애 앞에서 울리지 마이소.'] },
		{
			ko: ['두 번째지요. 법민아, 문간에 서 있지 말고. 들어와.', '두 번째지예. 법민아, 문간에 서 있지 말고. 퍼뜩 들어온나.'],
			en: ['Second best. Bupmin, don’t stand in the door. Come in.', 'Second best. Bupmin, don’t stand in the door. Come in, quick.']
		},
		{ ko: ['사람들은… 이 전쟁이 오직 네 누나를 위한 줄 알 거다.', '사람들은… 이 전쟁이 오직 니 누나를 위한 줄 알 끼다.'] },
		{ ko: ['그것도 맞다. 대야는 하루도 이 방을 나간 적이 없다.', '그것도 맞다. 대야는 하루도 이 방을 나간 적이 없데이.'] },
		{ ko: ['하지만 그게 내가 갚던 유일한 빚은 아니었다.', '하지만 그기 내가 갚던 유일한 빚은 아이었다.'] },
		{ ko: ['그걸 제가 훔쳤지요. 여섯 살 때. 밥상머리에서 그 말만—', '그걸 지가 훔쳤다 아입니꺼. 여섯 살 때. 밥상머리에서 그 말만—'] },
		{ ko: ['나는 백제까지 길을 텄다. 고구려는 아직 서 있고, 당은 웃고 있을 게다.', '나는 백제까지 길을 텄다. 고구려는 아직 서 있고, 당은 웃고 있을 끼다.'] },
		{ ko: ['…다들한테 무릎을 꿇은 양반이야. 연개소문한테도, 황제한테도. 문 잡아 줄 사람이면 누구한테든.', '…다들한테 무릎을 꿇은 양반이다. 연개소문한테도, 황제한테도. 문 잡아 줄 사람이믄 누구한테든.'] },
		{ ko: ['백제한테만은 한 번도 안 꿇었지.', '백제한테만은 한 번도 안 꿇었제.'] },
		{
			ko: ['일어나라, 법민아. 이제 네가 왕이다. 왕은 침상 옆에서 무릎 꿇는 거 아니다.', '일어나라, 법민아. 인자 니가 왕이다. 왕은 침상 옆에서 무릎 꿇는 거 아이다.'],
			en: ['Get up, Bupmin. You’re the king. Kings don’t kneel by beds.', 'Get up, Bupmin. You’re the king now. Kings don’t kneel by beds.']
		}
	],

	// Ungjin Commandery: the king and his uncle over the edict. Tang hall and Silla council stay standard.
	77: [
		{ ko: ['주라 하오, 외숙. 아버님의 나라를 주로 만들고, 나를 그 고을 원으로 삼았소.', '주라 카오, 외숙. 아버님의 나라를 주로 만들고, 나를 그 고을 원으로 삼았소.'] },
		{ ko: ['그럼 고을 원으로 서명하십시오, 전하.', '그럼 고을 원으로 서명하이소, 전하.'] },
		{ ko: ['그리고 사본을 남겨 두십시오.', '그라고 사본은 남겨 두이소.'] }
	],

	// King Pungjang: the generals among themselves. Pung grew up abroad and keeps standard; so do Yamato and Tang.
	78: [
		{ ko: ['장군, 팔. 팔 동작 말입니다. 얘기했잖습니까.', '장군, 팔. 팔 동작 말이유. 얘기했잖습니까.'] },
		{ ko: ['얘기는 당신이 했지.', '얘기는 그짝이 했지.'] },
		{
			ko: ['사택상여. 배 마흔 척, 쌀 천백 섬, 화살 삼만, 밧줄은 세다 말았고.', '사택상여. 배 마흔 척, 쌀 천백 섬, 화살 삼만, 밧줄은 세다 말았구.'],
			en: [
				'Satek Sangya. Forty boats, eleven hundred bales of rice, thirty thousand arrows, and I stopped counting the rope.',
				'Satek Sangya. Forty boats, eleven hundred bales of rice, thirty thousand arrows, and I quit counting the rope.'
			]
		},
		{ ko: ['아직 아무도 값을 안 쳤어. 이게 내 인사요.', '아직 아무두 값을 안 쳤어. 이게 내 인사요.'] }
	],

	// Pyongyang I: the Yeon house on its own wall, the river garrison. The motto stays standard.
	79: [
		{ ko: ['어제도 그 말 했잖아.', '어제두 그 말 했디.'], en: ['You said that yesterday.', 'Aye, you said that yesterday.'] },
		{ ko: ['어제도 맞는 말이었으니까.', '어제두 맞는 말이었으니끼니.'] },
		{ ko: ['짐승 네 마리를 보냈단다. 이제 황제가 짐승을 부려.', '짐승 네 마리를 보냈단다. 이제 황데가 짐승을 부리누만.'] },
		{ ko: ['그중 한 놈은 아들들을 데려왔다. 열세 놈 전부.', '그중 한 놈은 아새끼들을 데려왔다. 열세 놈 전부.'], en: ['One of them brought his sons. All thirteen of them.', 'One of them brought his bairns. All thirteen of them.'] },
		{ ko: ['열셋이요? 전쟁에 애들을 데려왔단 말입니까?', '열셋이요? 전쟁에 애들을 데려왔단 말입네까?'] },
		{ ko: ['애들 아니다. 다 큰 놈들이야.', '애들 아니다. 다 큰 놈들이디.'], en: ['Not children. Grown men.', 'Not bairns. Grown men.'] },
		{ ko: ['아비가 일하는 걸 구경하러 왔다더군.', '아비레 일하는 걸 구경하러 왔다누만.'] },
		{ ko: ['아버지! 대동강에 돛입니다. 남쪽 성벽 바로 밑까지요!', '아바지! 대동강에 돛입네다. 남쪽 성벽 바로 밑까지요!'] },
		{ ko: ['…앉습니다. 왜 앉는 겁니까?', '…앉습니다. 왜 앉는 겁네까?'] },
		{ ko: ['앉으라 그래. 엉덩이가 땅에 얼어붙을 때까지 앉아 있으라 그래.', '앉으라 기래. 엉덩이레 땅에 얼어붙을 때꺼정 앉아 있으라 기래.'] },
		{ ko: ['장군님. 여울이 하얗게 얼었습니다.', '장군님. 여울이 하얗게 얼었습네다.'] },
		{ ko: ['…가운데도 얼고 있습니다.', '…가운데두 얼구 있수다.'] },
		{ ko: ['어느 기록에도 없어.', '어느 기록에두 없어.'] },
		{ ko: ['장군님. 강은 기록을 안 읽습니다.', '장군님. 강은 기록을 안 읽습네다.'] },
		{
			ko: ['얼 줄 몰랐다는 소리는 하지 마라. 거긴 해마다 언다.', '얼 줄 몰랐다는 소리는 하디 말라. 거긴 해마다 언다.'],
			en: ['Don’t tell me you didn’t know it would freeze. It freezes every year.', 'Dinnae tell me you didn’t know it would freeze. It freezes every year.']
		},
		{ ko: ['전례! 강이 글을 읽냐, 이놈아.', '전례! 강이 글을 읽네, 이놈아?'] },
		{ ko: ['아버님, 형님이 병사들을 데리고 돌아왔습니다. 절반은—', '아버님, 형님이 병사들을 데리고 돌아왔습네다. 절반은—'] },
		{ ko: ['잘 들어. 성벽은 안 무너진다. 이걸 무너뜨린 놈은 아무도 없어.', '잘 들으라우. 성벽은 안 무너진다. 이걸 무너뜨린 놈은 아무도 없어.'] },
		{ ko: ['이제 이 문은 네 거다. 네가 어느 쪽에 서 있는지 잊지 마라.', '이제 이 문은 네 거다. 네레 어느 쪽에 서 있는지 잊디 말라.'] },
		{ ko: ['말을 잡아먹고 있는 거다. 말이 떨어지면 불도 줄지.', '말을 잡아먹구 있는 거다. 말이 떨어지면 불두 줄디.'] },
		{ ko: ['계속 세라, 걸걸. 불이 안 줄어드는 밤이 오면, 누가 저놈들을 먹이고 있는 거다.', '계속 세라우, 걸걸. 불이 안 줄어드는 밤이 오면, 누구레 데놈들을 멕이구 있는 거다.'] }
	],

	// Snake River: Gesomun in the field, his scout. The counting stays bare; the reapers and the Tang stay standard.
	80: [
		{ ko: ['저놈은 강을 길로 안다. 걸어 들어오게 둬.', '데놈은 강을 길로 안다. 걸어 들어오게 두라우.'] },
		{ ko: ['실망시킬 아들이 아직 남았거든.', '실망시킬 아새끼들이 아직 남았거든.'], en: ['I still have sons to disappoint.', 'I still have bairns to disappoint.'] },
		{ ko: ['아직도 정신 못 차렸나, 이 새끼들아?!', '아직두 정신 못 차렸네, 이 새끼들아?!'] },
		{ ko: ['누가 저놈들을 먹이고 있다.', '누구레 데놈들을 멕이구 있다.'] },
		{ ko: ['…누군지 알아내. 그리고 집까지 따라가.', '…누군지 알아내라우. 그리구 집꺼정 따라가.'] },
		{ ko: ['우리 사는 데를 보겠다고 여기까지 따라왔군.', '우리 사는 데를 볼라꼬 여기꺼정 따라왔구마.'] },
		{ ko: ['이제 알았겠지. 말들 물 먹이게.', '인자 알았겠제. 말들 물 멕이게.'], en: ['Now they know. Water the horses.', 'Well, now they know. Water the horses.'] },
		{ ko: ['새 호랑이는 그 흰옷입니다, 대막리지. 주필산의 그놈이요.', '새 호랑이는 그 흰옷입네다, 대막리지. 주필산의 그놈이요.'] },
		{ ko: ['포로들은 이름도 안 댑니다. 여포랍니다. 여포가 돌아왔다고요.', '포로들은 이름두 안 대구, 여포랍네다. 여포레 돌아왔다구요.'] },
		{ ko: ['여포는 성문 누각에서 목 졸려 뒈졌어. 우리한테도 누각은 있다고 전해.', '여포는 성문 누각에서 목 졸려 뒈졌어. 우리한테두 누각은 있다구 전하라우.'] }
	],

	// Tamla Surrenders: Yuri Dora downshifts to mainland-intelligible Jeju for the envoys; the divers go full.
	81: [
		{
			ko: ['이름만이라. 들었냐? 이름만이란다.', '이름만이라. 들언? 이름만이렌 햄저.'],
			en: ['Only my name. You hear that? Only a name.', 'Only my name. Did you hear that? Only a name, says he.']
		},
		{
			ko: ['이 섬에서 제일 비싼 게 이름이다. 몇 개 없거든.', '이 섬에서 제일 비싼 게 이름이주. 몇 개 없거든.'],
			en: ['Names are the dearest thing on this island. We have so few.', 'Names are the dearest thing on this island. It’s few enough we have.']
		},
		{
			ko: ['그럼 귤이나 사러 멈추라지. 다들 그러니까.', '게민 귤이나 사러 멈추렌 허라. 다들 경 허난.'],
			en: ['Then it can stop for oranges. Everyone does.', 'Then it can stop for oranges. Sure, everyone does.']
		},
		{
			ko: ['먼저 멕여요, 왕님. 배고프민 아무것도 못 정해.', '먼저 멕입서, 왕님. 배고프민 아무것도 못 정허우다.'],
			en: ['Feed them first, my lord. Nobody decides anything hungry.', 'Feed them first, my lord. Sure nobody decides anything hungry.']
		},
		{ ko: ['첫날 밤에 그놈이 나한테 며칠이냐고 묻더라. 인사도 없이. 며칠이냐고.', '첫날 밤에 그놈이 나신디 며칠이냐고 묻더라. 인사도 없이. 며칠이냐고.'] },
		{
			ko: ['다섯 해야. 이 불 앞에 한 번을 안 앉더구나.', '다섯 해여. 이 불 앞에 혼 번을 안 앉더라.'],
			en: ['Five years. He never once sat down by this fire.', 'Five years, and he never once sat down by this fire.']
		},
		{ ko: ['떠날 때 딱 한마디 해 줬지. 사람을 잊지 말라고.', '떠날 때 딱 혼마디 해 줬주. 사람을 잊지 말렌.'] },
		{
			ko: ['왕을 잊지 말라곤 안 했다. 왕은 잘만 기억하더라. 그래서 어떻게 됐는지 봐라.', '왕을 잊지 말렌 말은 안 했저. 왕은 잘만 기억허더라. 게난 어떵 됐는지 보라.'],
			en: ['I didn’t say, don’t forget kings. Kings he remembered fine. Look where it got him.', 'I never said, don’t forget kings. Kings he remembered fine. And look where it got him.']
		},
		{
			ko: ['저게 내 사람들이다. 내가 안 잊을 건 저거야.', '저것들이 내 사람들이주. 내가 안 잊을 건 저거라.'],
			en: ['Those are my people. That’s who I’m not forgetting.', 'Those are my people. It’s them I’m not forgetting.']
		},
		{ ko: ['배 두 척 준비해라.', '배 두 척 준비허라.'] },
		{
			ko: ['한 척은 내 이름 들고 신라로 간다. 명부에 똑바로 적으라고 해.', '혼 척은 내 이름 들렁 신라로 감저. 명부에 똑바로 적으렌 허라.'],
			en: ['One goes to Silla with my name for their list. Make them spell it right.', 'One goes to Silla with my name for their list. Let them spell it right, so.']
		},
		{ ko: ['한 척은 이 사람 태우고 그 산성으로 돌아가고. 보리든 귤이든, 해녀들이 내줄 수 있는 건 다 실어.', '혼 척은 이 사람 태왕 그 산성으로 돌아가고. 보리든 귤이든, 해녀들이 내줄 수 있는 건 다 실르라.'] },
		{ ko: ['봐라. 나는 섬이다. 편 같은 건 없고, 포구가 있지.', '보라. 나는 섬이여. 편 같은 건 없고, 포구가 있주.'] },
		{ ko: ['그리고 이야기는 끝을 정해 놓고 시작하는 게 아니다.', '그리고 이야기는 끝을 정해 놓앙 시작허는 게 아니여.'] },
		{ ko: ['…그래서 우리 누구 편인데?', '…게민 우린 누게 편인고?'], en: ['…So whose side are we on?', '…So whose side is it we’re on?'] },
		{ ko: ['우리 편. 문어나 먹어.', '우리 편. 문어나 먹으라.'] }
	],

	// Rebellion: two True Bone friends at the gyuku rail; the king and his uncle in private. The hall stays standard.
	82: [
		{
			ko: ['산성 하나에 장군이 열아홉이야. 스무 번째는 필요 없어.', '산성 하나에 장군이 열아홉이다. 스무 번째는 필요 없다.'],
			en: ['Nineteen generals for one hill fort. They don’t need a twentieth.', 'Nineteen generals for one hill fort. They hardly need a twentieth.']
		},
		{
			ko: ['게다가 전쟁은 끝났잖나. 누군가는 그렇다고 말해야지.', '게다가 전쟁은 끝났다 아이가. 누군가는 그렇다꼬 말해야제.'],
			en: ['Besides. The war’s over. Somebody should say so.', 'Besides. The war’s over. Somebody ought to say so.']
		},
		{
			ko: ['임금의 사람이 관람석에 있네. 셋째 줄. 공은 한 번도 안 보더군.', '임금 사람이 관람석에 있데이. 셋째 줄. 공은 한 번도 안 보더라.'],
			en: ['The king’s man is in the stands. Third row. He hasn’t watched the ball once.', 'The king’s man is in the stands. Third row. Hasn’t watched the ball once.']
		},
		{ ko: ['세라지. 내 아들이 황제의 문을 지키네.', '세라 캐라. 내 아들이 황제 문을 지키는데.'] },
		{
			ko: ['문무는 장안에 아들 둔 집안은 못 건드려. 황제가 너무 아쉽거든.', '문무는 장안에 아들 둔 집안은 몬 건드린다. 황제가 너무 아쉽거든.'],
			en: ['Munmu won’t touch a house with a boy in Chang’an. He needs the emperor too much.', 'Munmu won’t touch a house with a boy in Chang’an. He needs the emperor far too much.']
		},
		{ ko: ['숙부. 내가 저들을 살려 두면 어찌 되겠소?', '숙부. 내가 저들을 살려 두믄 우째 되겠소?'] },
		{ ko: ['그러면 내년에 장수 열아홉을 부르시면, 전하, 열일곱이 올 것입니다.', '그라믄 내년에 장수 열아홉을 부르시믄, 전하, 열일곱이 올 낍니더.'] },
		{ ko: ['진주의 아들이 장안에서 그 소식을 들으면?', '진주 아들이 장안에서 그 소식 들으믄?'] },
		{ ko: ['어느 쪽이든 듣게 될 겁니다. 진심이셨다는 걸 듣는 편이 낫습니다.', '어느 쪽이든 듣게 될 낍니더. 진심이셨다는 걸 듣는 기 낫심더.'] }
	],

	// Betrayal: Boksin's sickbed and the two generals at the jar. Anything said to the king stays standard.
	83: [
		{ ko: ['상지. 앉게. 전하께서 오시는가?', '상지. 앉게. 전하께서 오신댜?'] },
		{ ko: ['해 질 녘에 오십니다, 장군.', '해 질 녘에 오신대유, 장군.'] },
		{ ko: ['그런데 관은 그가 쓰고 있지.', '근디 관은 그 양반이 쓰구 있지.'] },
		{ ko: ['저 병풍 밑에 신발이 네 켤레입니다, 장군.', '저 병풍 밑에 신발이 네 켤레유, 장군.'] },
		{ ko: ['손님일세. 병자는 외로운 법이지.', '손님일세. 병자는 외로운 법이여.'], en: ['Guests. A sick man gets lonely.', 'Guests. A sick man gets lonesome.'] },
		{ ko: ['…그리고 또 도읍을 옮기자고 할 걸세. 자네도 알잖나.', '…그리구 또 도읍을 옮기자구 헐 걸세. 자네두 알잖여.'] },
		{ ko: ['자기를 왕으로 세운 사람이다. 항아리에.', '자기를 왕으로 세운 사람이여. 항아리에.'] },
		{
			ko: ['…세워 주지도 않은 우리는 어떻게 할 것 같나.', '…세워 주지두 않은 우리는 워쩔 것 같여?'],
			en: ['…What do you think he does with the ones who didn’t?', '…What do you reckon he does with the ones who didn’t?']
		},
		{ ko: ['똑같이. 소금만 덜 치고.', '똑같이. 소금만 덜 치구.'] },
		{ ko: ['이 군대는 부처님이 내게 주셨다, 복신. 자네는 먹이기만 했지.', '이 군대는 부처님이 내게 주셨네, 복신. 자네는 멕이기만 했지.'] },
		{ ko: ['잘 먹이게. 사비로 갈 군대니까.', '잘 멕이게. 사비루 갈 군대니께.'] },
		{
			ko: ['그럼 오늘 저녁 드시지요. 단둘이. 사비 이야기를 하십시다.', '그럼 오늘 저녁 드시지유. 단둘이. 사비 얘기나 하십시다.'],
			en: ['Supper tonight, then. Just the two of us. We’ll talk about Sabi.', 'Do come to supper tonight, then. Just the two of us. We’ll talk about Sabi.']
		}
	],

	// White River: Silla on its own ridge. Yung and Sangji speak to the Tang, so they stay standard.
	84: [
		{ ko: ['좋은 기병이군. 배를 지키고 있어.', '좋은 기병이구마. 배를 지키고 있네.'] },
		{ ko: ['장안에서 이걸 적을 때, 첫 줄에 신라가 있어야 한다.', '장안에서 이걸 적을 때, 첫 줄에 신라가 있어야 한데이.'] }
	],

	// Yeon Gesomun: the deathbed is family. "Do not fight amongst yourselves" stays standard; Yumla is standard.
	85: [
		{ ko: ['아버지는 형제를 곁에 두신 적이 없습니다.', '아버지는 형제를 곁에 두신 적이 없습네다.'] },
		{ ko: ['…그래서 하는 말이다.', '…기래서 하는 말이다.'] },
		{ ko: ['…진심이셔, 형.', '…진심이시디, 형.'], en: ['…He means it, brother.', '…Aye, he means it, brother.'] },
		{ ko: ['아버지는 늘 진심이시지. 그게 문제였던 적은 없어.', '아버지는 늘 진심이시디. 그게 문제였던 적은 없어.'] },
		{ ko: ['걸걸. 의자. 의자에 앉혀.', '걸걸. 의자. 의자에 앉히라우.'] },
		{ ko: ['내가 한 번 말했지. 뼈가 다 부러질 때까지라고.', '내가 한 번 말했디. 뼈가 다 부러질 때까지라고.'] },
		{ ko: ['세어 봐라, 걸걸. 몇 개 남았냐?', '세어 보라우, 걸걸. 몇 개 남았네?'] },
		{ ko: ['충분합니다.', '충분합네다.'] },
		{ ko: ['…사수에서 실패한 게 누구냐.', '…사수에서 실패한 게 누구네.'] },
		{ ko: ['자. 물어라. 이번에도 아니라고 할 준비는 됐다.', '자. 물으라우. 이번에두 아니라구 할 준비는 됐다.'] },
		{ ko: ['서기들은 실패하고, 상관이 출근했군.', '서기들은 실패하구, 상관이 출근했구만.'] },
		{ ko: ['좋아. 나는 원래 윗사람과 거래하는 편이니까.', '좋아. 나는 원래 윗사람하구 거래하는 편이니끼니.'] },
		{ ko: ['…고구려다, 이놈아. 끝까지 다 말해.', '…고구려다, 이놈아. 끝꺼정 다 말하라우.'] },
		{ ko: ['야... 그런 사람도 결국 염라 앞엔 서긴 하네.', '야... 기런 사람두 결국 염라 앞엔 서긴 하누만.'] },
		{ ko: ['아버지가… 재주 하나는 정말 끝내주셨지, 그렇지?', '아바지가… 재주 하나는 정말 끝내주셨디, 기렇디?'] },
		{ ko: ['아버지한텐 있었지. 우리한텐 없고.', '아바지한텐 있었디. 우리한텐 없구.'] }
	],

	// Brothers' Coup: Namgun loud on his own wall. Namseng has already started talking like a Tang official.
	86: [
		{ ko: ['성문 닫아라! 폐하께 아뢰어라, 대막리지가 반역했다고!', '성문 닫으라우! 폐하께 아뢰라, 대막리지레 반역했다구!'] },
		{ ko: ['대막리지라! 아우들 저녁상에 첩자를 보내 놓고 그걸 지휘라고 하냐!', '대막리지라! 아우들 저녁상에 첩자를 보내 놓구 그걸 지휘라구 하네?!'] },
		{ ko: ['형이 맏이니까. 그날부터 하루도 안 빼고 맏이였지.', '형이 맏이니끼니. 그날부터 하루도 안 빼고 맏이였디.'] },
		{ ko: ['그리고 형이 내 목 칠 인장을 들고 돌아온다고 하더라.', '그리고 형이 내 목 칠 인장을 들구 돌아온다더라.'] },
		{ ko: ['역적…? 내가?', '역적…? 내레?'] },
		{ ko: ['형한테 가는 편지를 품고 있었어. 수구문으로 빠져나가다가.', '형한테 가는 편지를 품구 있었어. 수구문으로 빠져나가다가.'] }
	]
};

const strip = (s = '') => s.replace(/<[^>]+>/g, '');

const report = editStory((story) => {
	const problems = [];
	const counts = {};
	let changed = 0;
	let n = 0;
	for (const c of story)
		for (const e of c.entries) {
			n++;
			const edits = EDITS[n];
			if (!edits) continue;
			const dialogues = lists(e)
				.flat()
				.filter((b) => b.kind === 'dialogue');
			const anchors = (e.images ?? []).map((im) => im.at).filter(Boolean);
			for (const ed of edits) {
				const [oldKo, newKo] = ed.ko;
				const hits = dialogues.flatMap((b) => b.lines.map((l, j) => (l === oldKo ? { b, j } : null)).filter(Boolean));
				if (!hits.length) {
					const done = dialogues.some((b) => b.lines.includes(newKo));
					if (!done) problems.push(`#${n} ${e.title}: not found: ${oldKo}`);
					continue;
				}
				if (hits.length > 1) {
					problems.push(`#${n} ${e.title}: ${hits.length} hits: ${oldKo}`);
					continue;
				}
				const { b, j } = hits[0];
				if (ed.en && b.en[j] !== ed.en[0]) {
					problems.push(`#${n} ${e.title}: en mismatch at "${oldKo}": ${b.en[j]}`);
					continue;
				}
				const before = [b.lines[j], b.en[j]].map(strip).join('\n');
				const after = [newKo, ed.en ? ed.en[1] : b.en[j]].map(strip).join('\n');
				const lost = anchors.filter((a) => before.includes(strip(a)) && !after.includes(strip(a)));
				if (lost.length) {
					problems.push(`#${n} ${e.title}: would detach anchor(s) ${lost.join(' | ')}`);
					continue;
				}
				b.lines[j] = newKo;
				if (ed.en) b.en[j] = ed.en[1];
				changed++;
				counts[b.person ?? 'extra'] = (counts[b.person ?? 'extra'] ?? 0) + 1;
			}
		}
	if (problems.length) {
		console.error(problems.join('\n'));
		process.exitCode = 1;
		return false;
	}
	return { changed, counts };
});

if (report) console.log(`changed ${report.changed} lines`, report.counts);
