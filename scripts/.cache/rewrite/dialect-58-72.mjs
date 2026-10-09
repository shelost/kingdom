/**
 * Dialect pass, episodes #58–#72 (the Tamla nights through Three Realms). Brief: DIALECT-PASS.md / DIALECTS.md.
 * Each edit swaps one dialogue line (Korean, and English when given) for one speaker; idempotent.
 * Tamla: downshifted 제주어 endings and keywords + Synge grammar. Baekje: 충청 (전라 at Gomamiji) + genteel South.
 * Silla: 경북 + clipped RP. Buyeo: 함경 + old Northern English. Jolbon: 평북 + Northern English.
 * Gods, myth tales, court, quotes and locked lines stay standard.
 */
import { editStory, lists } from '../story-ops.mjs';

const RANGE = [58, 72];

/** [episode, speaker (person id or "speaker" label, '' = unnamed), kingdom tag, koOld, koNew, enOld?, enNew?] */
const EDITS = [
	/* ── #58 Heaven–Earth King (frame only; the myth stays standard) ── */
	[58, 'yuridora', 'tamla', '오늘 밤에만 세 번째다.', '오늘 밤에만 세 번째라.', 'That’s the third time tonight.', 'It’s the third time tonight you’re after saying that.'],
	[58, 'yuridora', 'tamla', '하. 그럼 세상을 정정당당하게 도둑맞은 이야기가 필요하겠구나.', '하. 게민 세상을 정정당당하게 도둑맞은 이야기가 필요허주.', 'Ha. Then you want the one about a world stolen fair and square.', 'Ha. It’s the one about a world stolen fair and square you want, so.'],
	[58, 'yuridora', 'tamla', '앉든 말든.', '앚든 말든.'],
	[58, 'yuridora', 'tamla', '알았지.', '알았주.', 'He knew.', 'Sure he knew.'],
	[58, 'yuridora', 'tamla', '줬지. 그리고 밑으로 갔다.', '줬주. 경허고 밑으로 갔저.', 'He did. And he went down.', 'He did. And down he went.'],
	[58, 'yuridora', 'tamla', '밑이 저승, 여기가 이승. 서쪽 끝에 꽃밭이 하나 더 있고, 그 위로 환인 어른이 계시다.', '밑이 저승, 이디가 이승. 서쪽 끝에 꽃밭이 하나 더 있고, 그 위로 환인 어른이 계시주.'],
	[58, 'yuridora', 'tamla', '다 합쳐 삼계라 한다. 오늘 밤은 둘만 알면 된다.', '다 합쳐 삼계렌 헌다. 오늘 밤은 둘만 알민 된다.', 'Three Realms, all told. Tonight you only need the two.', 'Three Realms, all told. It’s only the two you need tonight.'],

	/* ── #59 Sulmun ── */
	[59, 'yuridora', 'tamla', '손님은 지붕 안 고친다.', '손님은 지붕 안 고치는 거라.', 'Guests don’t mend roofs.', 'Guests don’t be mending roofs.'],
	[59, 'yuridora', 'tamla', '지붕 다 고치면?', '지붕 다 고치민?'],
	[59, 'yuridora', 'tamla', '바람 좋으면 이틀.', '바람 좋으민 이틀.'],
	[59, 'yuridora', 'tamla', '여기엔 너한테 좋은 바람 내줄 놈이 없다, 거북아.', '이디엔 느신디 좋은 바람 내줄 놈이 엇다, 거북아.', 'Nobody here has a good wind for you, Turtle.', 'There’s nobody here has a good wind for you, Turtle.'],
	[59, 'yuridora', 'tamla', '하! 있을 뻔했지.', '하! 있을 뻔했주.', 'Ha! There nearly was.', 'Ha! Sure there nearly was.'],
	[59, 'yuridora', 'tamla', '이 섬은 여자 하나가 만들었다. 설문대할망.', '이 섬은 여자 하나가 멩글았저. 설문대할망.'],
	[59, 'yuridora', 'tamla', '…어떻게 알았노?', '…어떵 알안?', '…How did you know that?', '…And how did you know that, now?'],
	[59, 'yuridora', 'tamla', '너는 이야기를 듣는 게 아니라 검사를 하는구나.', '느는 이야기를 듣는 게 아니라 검사를 허는구나.', 'You do not listen to a story. You inspect it.', 'It’s not listening to a story you are. It’s inspecting it.'],
	[59, 'yuridora', 'tamla', '평생 먹어 본 것 중에 제일이라고.', '평생 먹어 본 것 중에 제일이렌.'],
	[59, 'yuridora', 'tamla', '아니지. 그래서 막내가 바다로 걸어 들어간 거다.', '아니주. 게난 막내가 바당으로 걸어 들어간 거라.'],
	[59, 'yuridora', 'tamla', '다들 그 소리 한다.', '다들 그 소리 허주.', 'Everybody says that.', 'They all do be saying that.'],
	[59, 'yuridora', 'tamla', '그래서 섬에는 돌이 된 아들들만 있고 다리는 없었지. 할망이 그걸 고치려 했다.', '게난 섬에는 돌이 된 아들들만 있고 다리는 엇었주. 할망이 그걸 고치젠 했저.', 'So the island had stone sons, and no bridge. She meant to fix that.', 'So the island had stone sons, and no bridge. She had a mind to fix that.'],
	[59, 'yuridora', 'tamla', '그래.', '기주.'],

	/* ── #60 Three Princes ── */
	[60, 'haenyeo', 'tamla', '쓸모 있어서 출세했다가 같은 죄로 벌받은 사람 얼굴이네. 소별왕 이승이 원래 그런 장난으로 굴러가지.', '쓸모 있언 출세했당 같은 죄로 벌받은 사람 얼굴이여. 소별왕 이승이 원래 경헌 장난으로 굴러가주.', 'You look like a man who was promoted by being useful and punished for the same crime. That joke is how Little Star runs the living world.', 'You have the face of a man promoted for being useful and punished for the same crime. Sure that joke is how Little Star runs the living world.'],
	[60, 'haenyeo', 'tamla', '우리도 있지. 깃발에만 안 쓸 뿐.', '우리도 있주. 깃발에만 안 쓸 뿐.', 'We have those. We just don’t put them on banners.', 'We have those too. It’s only on banners we don’t put them.'],
	[60, 'haenyeo', 'tamla', '이 섬은 땅구멍에서 나왔수다, 거북아. 누구 아들인지 안 물어.', '이 섬은 땅구멍에서 나왔수다, 거북아. 누게 아들인지 안 물어.', 'This island came out of a hole in the ground, Turtle. It doesn’t ask whose son you are.', 'This island came out of a hole in the ground, Turtle. It’s not asking whose son you are.'],
	[60, 'haenyeo', 'tamla', '그건 나중 얘기. 임금님한테 물어.', '그건 나중 얘기. 임금님신디 물어보라.', 'Those came later. Ask the king.', 'Those came later. Ask himself, the king.'],
	[60, 'yuridora', 'tamla', '더러는. 제 부모한테 버림받은 놈 이야기를 해 주마.', '더러는. 지 부모신디 버림받은 놈 이야기 해 주크라.', 'Some. Let me tell you about one whose own parents threw him out.', 'Some do. I’ll tell you about one whose own parents threw him out.'],
	[60, 'yuridora', 'tamla', '사냥의 신 소천국이 농사의 신 백주또와 혼인했다. / 백주또가 밭을 갈라고 소를 줬는데—', '사냥의 신 소천국이 농사의 신 백주또영 혼인했저. / 백주또가 밭 갈렌 쇠를 줬는디—'],
	[60, 'yuridora', 'tamla', '…니 이 이야기 들어 봤나?', '…느 이 이야기 들어 봔?', '…Have you heard this one?', '…Is it you’ve heard this one?'],
	[60, 'yuridora', 'tamla', '돌아와서 지 땅의 신이 됐다. / 쫓아낸 사람들이 절하는 신이.', '돌아왕 지 땅의 신이 됐저. / 쫓아낸 사람들이 절허는 신이.'],

	/* ── #61 Stone Lady (the Sanbangdeok legend stays standard) ── */
	[61, 'yuridora', 'tamla', '오늘은 좋은 이야기가 아니다.', '오늘 건 좋은 이야기 아니여.', 'Today’s is not a kind one.', 'It’s not a kind one I have today.'],
	[61, 'yuridora', 'tamla', '또 바다 봤구나.', '또 바당 봤구나.', 'You looked at the sea again.', 'You’re after looking at the sea again.'],
	[61, 'yuridora', 'tamla', '그럼 뒤돌아본 놈 이야기를 들어야지.', '게민 뒤돌아본 놈 이야기를 들어사 허주.', 'Then you get the one about looking back.', 'Then it’s the one about looking back you’ll get.'],
	[61, 'yuridora', 'tamla', '이겼는지 확인하려고.', '이겼는지 보젠.', 'To check that he had won.', 'To see had he won.'],
	[61, 'yuridora', 'tamla', '매일 아침 돌아보잖느냐, 거북아. 바다를.', '매일 아침 돌아보는 거 아니가, 거북아. 바당을.', 'You look back every morning, Turtle. At the sea.', 'Sure you look back every morning, Turtle. At the sea.'],
	[61, 'yuridora', 'tamla', '아이다. 다 <b>돌</b>로 끝난다. / 슬픈 거하고는 다르다. 돌은 남는 거 아이가.', '아니여. 다 <b>돌</b>로 끝나주. / 슬픈 거허곤 달라. 돌은 남는 거 아니가.', 'No. They all end as <b>stone</b>. / That’s not the same as badly. Stone stays.', 'No. It’s as <b>stone</b> they all end. / That’s not the same as badly. Stone stays.'],
	[61, 'yuridora', 'tamla', '하. 딱 하나 옳았던 계집애 이야기를 해 주마. 그 집안은 그 때문에 망했지.', '하. 딱 하나 옳았던 비바리 이야기 해 주크라. 그 집안은 그 때문에 망했주.', 'Ha. Here’s a girl who was right about one thing. It went badly for her family.', 'Ha. Here’s a girl who was right about one thing. It went badly for her family, so it did.'],
	[61, 'yuridora', 'tamla', '부잣집에 딸이 셋 있었다. 아비가 누구 덕에 사느냐고 물었지.', '부잣집에 딸이 셋 있었저. 아방이 누게 덕에 사느냐고 물었주.'],
	[61, 'yuridora', 'tamla', '위의 둘은 아버지 덕이라 했고, 막내는 제 배꼽줄 덕이라 했다. / 그래서 쫓겨났다.', '위의 둘은 아방 덕이렌 했고, 막내는 지 배꼽줄 덕이렌 했저. / 게난 쫓겨났주.'],
	[61, 'yuridora', 'tamla', '…그래. 그랬겠지.', '…기주. 경했을 거주.'],
	[61, 'yuridora', 'tamla', '아이다. 복은 원래 지 것이었다. / 버린 쪽이 눈이 먼 거고.', '아니여. 복은 원래 지 거였주. / 버린 쪽이 눈이 먼 거고.', 'No. The luck was always hers. / It was the ones who threw her out who went blind.', 'No. The luck was always hers. / It’s the ones that threw her out went blind.'],

	/* ── #62 Gardener (Jacheongbi and the flower field stay standard) ── */
	[62, 'yuridora', 'tamla', '네 임금한테?', '느 임금신디?', 'To your king?', 'To your king, is it?'],
	[62, 'yuridora', 'tamla', '흠. 그럼 앉아라. 누굴 기다리게 해 놓고 간 놈 이야기다.', '흠. 게민 앚으라. 누게를 기다리게 해 두엉 간 놈 이야기라.', 'Hm. Then sit. Here’s one about a man who left somebody waiting.', 'Hm. Sit down, so. Here’s one about a man who left somebody waiting.'],
	[62, 'yuridora', 'tamla', '사라도령이란 사내가 있었지. 하늘이 서쪽 꽃밭을 지키라고 그를 불렀어.', '사라도령이렌 사내가 있었주. 하늘이 서쪽 꽃밭을 지키렌 그를 불렀저.'],
	[62, 'yuridora', 'tamla', '아내는 배가 불러 있었고, 하늘이 바라는 만큼 빨리 걷지를 못했지. 그래서 사내는 어느 부잣집에 아내를 맡겨 두고 갔단다.', '각시는 배가 불러 있었고, 하늘이 바라는 만큼 재게 걷지를 못했주. 게난 사내는 어느 부잣집에 각시를 맡겨 두엉 갔덴 허여.'],
	[62, 'yuridora', 'tamla', '말 안 했지.', '말 안 했주.'],
	[62, 'yuridora', 'tamla', '그게 첫 번째 잘못이야. 세고 싶으면 세렴.', '그게 첫 번째 잘못이라. 세고 싶으민 세라.'],
	[62, 'yuridora', 'tamla', '아이가 클 만큼 크자 그녀는 아비가 어디 있는지 일러 줬어. 아이는 그날 밤 서쪽으로 떠났고.', '아이가 클 만큼 크난 어멍은 아방이 어디 있는지 일러 줬주. 아이는 그날 밤 서쪽으로 떠났고.'],
	[62, 'yuridora', 'tamla', '부자는 아이가 없어진 걸 알고, 대신 어미를 죽여 대숲에 던졌지.', '부자는 아이가 엇어진 걸 알안, 대신 어멍을 죽영 대숲에 던졌저.', 'And the rich man, when he found the boy gone, killed the mother instead and threw her into a bamboo grove.', 'And the rich man, and he finding the boy gone, killed the mother instead and threw her into a bamboo grove.'],
	[62, 'yuridora', 'tamla', '알았지.', '알았주.'],
	[62, 'yuridora', 'tamla', '그래도 말해 줬어.', '경해도 말해 줬저.'],
	[62, 'yuridora', 'tamla', '그 부잣집으로 돌아가서 작은 잔치를 열었지. 웃음꽃, 싸움꽃, 그리고 마지막 꽃. 그다음 대숲에 가서 어머니 뼈를 찾아, 순서대로 맞췄어. 뼈, 살, 피, 숨, 넋.', '그 부잣집으로 돌아강 작은 잔치를 열었주. 웃음꽃, 싸움꽃, 경허고 마지막 꽃. 그다음 대숲에 강 어멍 뼈를 찾안, 순서대로 맞췄저. 뼈, 살, 피, 숨, 넋.'],
	[62, 'yuridora', 'tamla', '아니. 아들이 그 문을 맡을 만해질 때까지 지켰지.', '아니. 아들이 그 문을 맡을 만해질 때까지 지켰주.'],
	[62, 'yuridora', 'tamla', '…거북아, 넌 맞는 질문을 꼭 엉뚱한 데서 하더라.', '…거북아, 느는 맞는 질문을 꼭 엉뚱한 디서 허더라.', '…You ask the right questions in the wrong places, Turtle.', '…It’s the right questions you ask, Turtle, and always in the wrong places.'],
	[62, 'yuridora', 'tamla', '너 마누라가 있냐.', '느 각시 있냐.', 'You have a wife.', 'Is it a wife you have?'],
	[62, 'yuridora', 'tamla', '한 해 내내 저녁마다 붙어 앉아 놓고, 말 한 번을 안 했어.', '한 해 내내 저녁마다 붙어 앚아 놓고, 말 혼 번을 안 했저.', 'A whole year of evenings, and you never said.', 'A whole year of evenings, and never a word out of you.'],
	[62, 'yuridora', 'tamla', '……그래서. 배에 실을 말은.', '……게난. 배에 실을 말은.'],
	[62, 'yuridora', 'tamla', '자청비는 하늘에서 온 도령을 따라 글을 배우고 싶었다. / 여자는 그 방에 못 들어가니, 머리를 자르고 남자 옷을 입었지.', '자청비는 하늘에서 온 도령을 따라 글을 배우고 싶었저. / 여자는 그 방에 못 들어가난, 머리를 자르고 남자 옷을 입었주.'],
	[62, 'yuridora', 'tamla', '아이다. 규칙에 여자가 남자 옷을 입으면 안 된다는 말은 없었거든.', '아니여. 규칙에 여자가 남자 옷 입으민 안 된덴 말은 엇었거든.', 'No. The rule never said a woman could not wear a man’s clothes.', 'No. Sure the rule never said a woman couldn’t wear a man’s clothes.'],

	/* ── #63 Kangrim (Kangrim and Yumla stay standard) ── */
	[63, 'yuridora', 'tamla', '그렇지.', '기주.'],
	[63, 'yuridora', 'tamla', '틀렸지. 앉아라, 거북아. 섬이 이야기 하나를 끝까지 아껴 두는 게 이래서다.', '틀렸주. 앚으라, 거북아. 섬이 이야기 하나를 끝까지 아껴 두는 게 이 때문이라.', 'It is. Sit, Turtle. The island keeps one story for last, and this is why.', 'It is. Sit down, Turtle. It’s for this the island keeps one story for last.'],
	[63, 'yuridora', 'tamla', '이제 마지막이다.', '이제 마지막이라.'],
	[63, 'yuridora', 'tamla', '하늘이 보낸 게 아이다.', '하늘이 보낸 게 아니여.', 'Heaven did not send him.', 'It wasn’t heaven sent him.'],
	[63, 'yuridora', 'tamla', '물 위에 꽃 셋. 구슬 셋. 아들 셋. 묻지 마라, 그것만 하룻밤 걸린다.', '물 위에 꽃 셋. 구슬 셋. 아들 셋. 묻지 말라, 그것만 하룻밤 걸린다.', 'Three flowers on the water. Three beads. Three sons. Don’t ask, that part takes a whole night.', 'Three flowers on the water. Three beads. Three sons. Don’t be asking, that part’s a night’s work in itself.'],
	[63, 'yuridora', 'tamla', '그리고 그래, 김치. 웃지 마라. 진지한 양반이었다.', '경허고 기주, 김치. 웃지 말라. 진지한 양반이었저.'],
	[63, 'yuridora', 'tamla', '보냈지.', '보냈주.'],
	[63, 'yuridora', 'tamla', '원님은 거절했다. 혼 같은 건 믿지도 않았으니까.', '원님은 거절했저. 혼 같은 건 믿지도 않았으난.'],
	[63, 'yuridora', 'tamla', '그래서 둘로 갈랐다. 원님은 몸을 가졌다. 염라는 혼을 가지고 갔다.', '게난 둘로 갈랐주. 원님은 몸을 가졌고, 염라는 혼을 가지고 갔저.'],
	[63, 'yuridora', 'tamla', '둘 다 갖고 싶었으니까.', '둘 다 갖고 싶었으난.', 'They both wanted him.', 'It’s the both of them wanted him.'],
	[63, 'yuridora', 'tamla', '책은 길에서 틀어졌다. 걸음은 안 틀어졌다.', '책은 길에서 틀어졌저. 걸음은 안 틀어졌저.'],
	[63, 'yuridora', 'tamla', '그게 열쇠다.', '그게 열쇠라.'],
	[63, 'yuridora', 'tamla', '받지. 대답도 하고.', '받주. 대답도 허고.'],

	/* ── #64 Tribute ── */
	[64, 'The Captain', 'baekje', '상은 끝났습니다, 장군. 설에 마치셨지요.', '상은 끝났습니다, 장군. 설에 마치셨지유.', 'The rite is over, General. Done at the new year.', 'The rite is over, General. Done at the new year, sir.'],
	[64, 'The Captain', 'baekje', '아니요.', '아니유.', 'No.', 'No, sir.'],
	[64, 'The Captain', 'baekje', '…배 댈 때 부인께서 부두에 나오셨습니다. 전해 달라고—', '…배 댈 때 부인께서 부두에 나오셨습니다. 전해 달라구—'],
	[64, 'yuridora', 'tamla', '빚이 없어? 하. 옛날에 우리가 귤을 깜빡한 적이 있지.', '빚이 엇어? 하. 옛날에 우리가 귤을 깜빡헌 적이 있주.', 'Owe nothing? Ha. Once, long ago, we forgot the oranges.', 'Owe nothing, is it? Ha. Once, long ago, we forgot the oranges.'],
	[64, 'yuridora', 'tamla', '봤지? 항구까지 와서 멈췄다.', '봔? 항구까지 왕 멈췄저.'],
	[64, 'yuridora', 'tamla', '건너고 싶었던 게 아니야. 건널 수 있다는 걸 알리고 싶었던 거지.', '건너고 싶었던 게 아니여. 건널 수 있덴 걸 알리고 싶었던 거주.', 'He didn’t want to cross. He wanted us to know he could.', 'It wasn’t crossing he wanted. He wanted us to know he could.'],
	[64, 'yuridora', 'tamla', '거북아. 항구까지 와서 멈추는 임금은 뭔가를 말하고 있는 거다.', '거북아. 항구까지 왕 멈추는 임금은 뭔가를 말하는 거라.'],
	[64, 'yuridora', 'tamla', '옆 바위도 똑같은데.', '옆 바위도 똑같은디.', 'The next rock is the same.', 'Sure the next rock is the same.'],
	[64, 'haenyeo', 'tamla', '숨은 참는 게 아니라, 노래로 미는 거라.', '숨은 참는 게 아니여, 노래로 미는 거라.', 'You don’t hold the breath. You push it out with singing.', 'It’s not holding the breath you do. You push it out with singing.'],
	[64, 'haenyeo', 'tamla', '못 하는 사람이 어딨노. 안 하는 사람만 있제.', '못 허는 사람이 어디 이시니. 안 허는 사람만 있주.', 'Nobody cannot. There are only people who don’t.', 'Sure nobody cannot. There’s only them that don’t.'],
	[64, 'yuridora', 'tamla', '그럼 이십 년을 조정에서 어떻게 살았노.', '게민 이십 년을 조정에서 어떵 살안?', 'Then how did you survive twenty years at a court?', 'Then how is it you survived twenty years at a court?'],
	[64, '', 'tamla', '본토에선 백승이라 부르지 — 여기선 귤이 도망갈까 봐 세고 있어.', '육지선 백승이렌 부르주 — 이디선 귤이 도망갈까 봐 세엄서.', 'Hundred-Victories, they call him on the mainland — and here he counts oranges like they might desert.', 'Hundred-Victories, they call him on the mainland — and he here counting oranges like they might desert.'],

	/* ── #65 Coup (the assembly stays court standard) ── */
	[65, 'chunbok', 'baekje', '아이고 온조대왕님 — 미쳤네…', '아이고 온조대왕님 — 미쳤구먼…'],
	[65, 'chunbok', 'baekje', '회의 전에 포고문을 찍어 두셨네. 먹 냄새 나요.', '회의 전에 포고문을 찍어 두셨네. 먹 냄새 나유.'],
	[65, 'euija', 'baekje', '탐라다. 포구에서 제일 빠른 배로.', '탐라여. 포구서 제일 빠른 배루.'],
	[65, 'euija', 'baekje', '좋다. 한 달. 그놈은 기다리는 건 잘해. 세거든.', '그려. 한 달. 그놈은 기다리는 건 잘혀. 세거든.', 'Fine. A month. He’s good at waiting. He counts.', 'Fine. A month. He’s mighty good at waiting. He counts.'],
	[65, 'courtmaid', 'baekje', '폐하. 오늘은 몇 분이나 자르셨습니까? / …저희는 몇이나 남기시려고요.', '폐하. 오늘은 몇 분이나 자르셨습니까? / …저희는 몇이나 남기시려구유.', 'Your Majesty. How many did you dismiss today? / …And how many of us will you keep.', 'Your Majesty. How many did you dismiss today? / …And how many of us are you fixing to keep.'],
	[65, 'courtmaid', 'baekje', '…무서워라. / 그런데 어쩌죠. 그런 폐하가… 더 가깝게 느껴져요.', '…무서워라. / 그런디 워쩌유. 그런 폐하가… 더 가깝게 느껴져유.', '…How frightening. / And yet — that kind of Majesty… feels nearer.', '…Mercy, how frightening. / And yet — that kind of Majesty… feels nearer.'],
	[65, 'courtmaid', 'baekje', '아직 없습니다. / 오늘 밤에 하나 지어 주세요. / 계백 장군한테 하셨듯이 — 오래.', '아직 없습니다. / 오늘 밤에 하나 지어 주셔유. / 계백 장군한테 하셨듯이 — 오래.'],

	/* ── #66 Descent ── */
	[66, 'courtmaid', 'baekje', '…또 숫자를 말씀하셨어요.', '…또 숫자를 말씀하셨어유.'],
	[66, 'euija', 'baekje', '아니. 물 타지 마라. 물 타면 다 안다.', '아니. 물 타지 말어. 물 타믄 다 알어.', 'No. Don’t water it. I can tell when you water it.', 'No. Don’t you go watering it. I can tell when you water it.'],
	[66, 'courtmaid', 'baekje', '…어제는요.', '…어제는유.'],
	[66, 'courtmaid', 'baekje', '폐하가 멈추라고 하셔도… 허리가 먼저 대답해요.', '폐하가 멈추라구 하셔두… 허리가 먼저 대답해유.'],
	[66, 'euija', 'baekje', '…뭐가 궁금한데.', '…뭐가 궁금헌디.'],
	[66, 'courtmaid', 'baekje', '아드님이 쉰이 넘으신다면서요.', '아드님이 쉰이 넘으신다면서유.'],
	[66, 'courtmaid', 'baekje', '삼신께서 폐하 몫 장부를 따로 두시나 봐요. 부엌에선 그게 어찌 가능한가 내기까지 붙었어요.', '삼신께서 폐하 몫 장부를 따로 두시나 봐요. 부엌에선 그게 워찌 되는 건가 내기꺼정 붙었어요.'],
	[66, 'courtmaid', 'baekje', '아, 그럼 폐하는 아직 여유가 있으시네요.', '아, 그럼 폐하는 아직 여유가 있으시네유.', 'Ah. Then Your Majesty still has room to work with.', 'Ah. Then Your Majesty still has room to work with, I reckon.'],
	[66, 'courtmaid', 'baekje', '사실 진작 알고 있었고요.', '사실 진작 알구 있었구유.'],
	[66, 'euija', 'baekje', '…기다리라 해라.', '…기다리라 혀.'],
	[66, 'courtmaid', 'baekje', '언제까지요?', '언제까지유?', 'Until when?', 'Till when, Majesty?'],

	/* ── #67 Nine Omens ── */
	[67, 'euija', 'baekje', '…흠. 껍데기 보는 눈은 있는 놈이로구나.', '…흠. 껍데기 보는 눈은 있는 놈이구먼.', '…Hm. Somebody with good taste in shells.', '…Hm. Somebody with mighty good taste in shells.'],
	[67, 'euija', 'baekje', '요즘 저잣거리에서 무어라 한다더냐.', '요새 저잣거리서 뭐라 한댜?'],
	[67, 'euija', 'baekje', '잘 만들었구나.', '잘 맹글었구먼.', 'Well made.', 'Mighty well made.'],
	[67, 'euija', 'baekje', '물으라 해라.', '물으라 혀.'],
	[67, 'euija', 'baekje', '우린 처음부터 작은아들네 집이었다, 춘복. 고구려가 대청을 가졌고, 우리는 남쪽 길을 가졌지.', '우린 처음부터 작은아들네 집이었어, 춘복. 고구려가 대청을 가졌구, 우리는 남쪽 길을 가졌지.'],
	[67, 'euija', 'baekje', '빌린 길 위에서 칠백 년이다. 그래도 아직 여기 있다.', '빌린 길 위에서 칠백 년이여. 그래두 아직 여기 있잖여.'],
	[67, 'euija', 'baekje', '맨 처음 그분한테도 딱 그렇게들 말했지.', '맨 처음 그분헌테두 딱 그렇게들 말혔지.'],
	[67, 'chunchu', 'silla', '의자는 스무 해 동안 백성한테 기적을 팔았소. / 용이니 흰 사슴이니 하는 것들.', '의자는 스무 해 동안 백성한테 기적을 팔았소. / 용이니 흰 사슴이니 카는 것들.', 'For twenty years Euija has been selling his people miracles. / Dragons. White deer.', 'For twenty years Euija has been selling his people miracles. / Dragons. White deer. That sort of thing.'],
	[67, 'yushin', 'silla', '거짓인 걸 알고?', '거짓인 줄 알고 그랬나?'],
	[67, 'chunchu', 'silla', '만든 사람이 본인인데. / 그러니 이제 그자는 세상에서 징조를 제일 못 읽는 사람이오. / 한평생 징조가 사람 손으로 만들어진다는 걸 알면서 살았으니까.', '만든 사람이 본인 아이가. / 그러니 이제 그자는 세상에서 징조를 제일 못 읽는 사람이오. / 한평생 징조가 사람 손으로 만들어진다는 걸 알면서 살았으니까.', 'He made them himself. / Which makes him the worst reader of signs alive. / He has spent his whole life knowing that signs are made by hands.', 'He made them himself, didn’t he. / Which makes him, I dare say, the worst reader of signs alive. / He has spent his whole life knowing that signs are made by hands.'],
	[67, 'yushin', 'silla', '…그럼 왜 통하겠나.', '…그라믄 와 통하겠노.', '…Then why would it work on him?', '…Right. Then why would it work on him?'],
	[67, 'chunchu', 'silla', '그자한테 통할 필요가 없소. / 그자의 백성한테만 통하면 되지.', '그자한테 통할 필요가 없소. / 그자의 백성한테만 통하믄 되제.', 'It doesn’t have to work on him. / It only has to work on his people.', 'It needn’t work on him. / It only has to work on his people.'],
	[67, 'chunchu', 'silla', '나라를 무너뜨리는 데 군대는 마지막에나 필요하오. / 먼저 필요한 건 소문이고. / 소문은 백성이 이미 두려워하는 것으로 만들면 되지.', '나라를 무너뜨리는 데 군대는 마지막에나 필요하오. / 먼저 필요한 건 소문이고. / 소문은 백성이 이미 두려워하는 걸로 만들믄 되는 기라.'],

	/* ── #68 Onjo (Jumong and Sosuno's last night stays as written) ── */
	[68, 'Water-carrier', 'buyeo', '어느 집 자식이야, 대체? 애비 없이 자라서 버릇도 없지.', '어느 집 아새끼야, 대체? 애비 없이 커서 버릇두 없지비.', 'Whose son are you, anyway? No father, no manners.', 'Whose lad are tha, any road? No father, no manners.'],
	[68, 'yuri', 'buyeo', '우리 아버지는 어떤 사람입니까? 지금 어디에 계십니까?', '우리 아버지는 어떤 사람입니까? 지금 어디 계심둥?', 'What kind of man was my father? Where is he now?', 'What manner of man was my father? Where is he now?'],
	[68, 'ladyye', 'buyeo', '네 아버지는 보통 사람이 아니었다. 이 나라가 그를 담지 못했지.', '네 아버지는 보통 사람이 아니었다. 이 나라가 그를 담지 못했지비.', 'Your father was no ordinary man. The country couldn’t hold him.', 'Thy father was no ordinary man. The country couldn’t hold him.'],
	[68, 'ladyye', 'buyeo', '그걸 찾으면, 너를 알아볼 거다.', '그걸 찾으믄, 너를 알아볼 거요.', 'Find it, and he’ll know you.', 'Find it, and he’ll know thee.'],
	[68, 'biryu', 'jolbon', '움직이지 마.', '움직이디 마.'],
	[68, 'biryu', 'jolbon', '열 신하 저녁거리다. 저 뿔만 해도 한 달은—', '열 신하 저녁거리다. 저 뿔만 해도 한 달은—', 'That’s dinner for ten ministers. The antlers alone, a month of—', 'That’s dinner for ten ministers, that. The antlers alone, a month of—'],
	[68, 'biryu', 'jolbon', '뿔로 보이지. 뿔 달린 고기.', '뿔로 보이디. 뿔 달린 고기.'],
	[68, 'sosuno', 'jolbon', '……엄마 말 들어. 활 내려.', '……오마니 말 들으라우. 활 내려.', '…Listen to your mother. Bow down.', '…Listen to your mam. Bow down.'],
	[68, 'onjo', 'jolbon', '……사슴이 길을 알아, 엄마?', '……사슴이 길을 알아, 오마니?', '…A deer knows the way, Mother?', '…A deer knows the way, Mam?'],
	[68, 'sosuno', 'jolbon', '너희 아버지는 거북이 등 밟고 강 건넜어.', '너희 아바지는 거북이 등 밟고 강 건넜어.', 'Your father crossed a river on turtles’ backs.', 'Thy father crossed a river on turtles’ backs.'],
	[68, 'sosuno', 'jolbon', '사슴이면 양반이지.', '사슴이믄 양반이디.'],
	[68, 'biryu', 'jolbon', '바다 냄새 나지. 나 저기로 간다.', '바다 냄새 나디. 내레 저기로 간다.', 'Smell that? Sea. I’m going there.', 'Smell that? Sea. I’m off there.'],
	[68, 'biryu', 'jolbon', '강 끼고 산 등지고, 다 좋아. 근데 배를 못 띄우잖아.', '강 끼고 산 등지고, 다 좋아. 기런데 배를 못 띄우잖아.', 'River in front, mountains behind, sure, lovely. You can’t float a ship on it.', 'River in front, mountains behind, aye, lovely. Tha can’t float a ship on it.'],
	[68, 'biryu', 'jolbon', '그럼 열 사람은 여기 살라 그래.', '기럼 열 사람은 여기 살라 기래.'],
	[68, 'biryu', 'jolbon', '엄마는? 엄마는 누구 따라와?', '오마니는? 오마니는 누구 따라와?', 'And Mother? Who’s Mother coming with?', 'And Mam? Who’s Mam coming with?'],

	/* ── #69 Sungchung (the hall stays court standard) ── */
	[69, 'courtmaid', 'baekje', '폐하… 그건 그 좌평 나리 것이에요.', '폐하… 그건 그 좌평 나리 거예유.'],
	[69, 'courtmaid', 'baekje', '저희가 안 버렸어요.', '저희가 안 버렸어유.'],
	[69, 'courtmaid', 'baekje', '폐하, 그다음은 강이랑 고개 얘기예요.', '폐하, 그다음은 강이랑 고개 얘기여유.'],
	[69, 'courtmaid', 'baekje', '…그리고 그분 이름뿐이에요.', '…그리구 그분 이름뿐이유.'],

	/* ── #70 Heungsu (Gomamiji is the far south: 전라 for the locals) ── */
	[70, 'heungsu', 'baekje', '그 종이요. 둘째 장은 없소.', '그 종이유. 둘째 장은 없소.'],
	[70, 'heungsu', 'baekje', '탄현을 밟고 서 있소.', '탄현을 밟구 서 있슈.', 'You’re standing on Tanhyeon.', 'You’re standing on Tanhyeon, friend.'],
	[70, 'heungsu', 'baekje', '다섯 해 만에, 이번 주라.', '다섯 해 만에, 이번 주여.'],
	[70, '', 'baekje', '아저씨, 그거 뱀이에요?', '아재, 그거 뱀이지라우?'],
	[70, '', 'baekje', '무슨 강이요?', '뭔 강인디요?'],
	[70, 'heungsu', 'baekje', '네가 평생 안 봤으면 하는 강.', '니가 평생 안 봤으믄 허는 강이여.'],
	[70, '', 'baekje', '…나리께서 아시던 분입니까?', '…나리께서 아시던 분이었지라우?'],
	[70, 'heungsu', 'baekje', '…글씨는 그 사람이 나았소.', '…글씨는 그 사람이 나았슈.', '…Better handwriting than mine.', '…Better handwriting than mine, I reckon.'],
	[70, 'heungsu', 'baekje', '자네... 진짜로 가는 건가?', '자네... 증말 가는 건가?'],
	[70, 'Gyebek’s Son', 'baekje', '아버지. 탐라는 며칠이에요?', '아버지. 탐라는 며칠이여유?', 'Father. How many days is Tamla?', 'Father. How many days is Tamla, sir?'],
	[70, 'Gyebek’s Son', 'baekje', '그럼 넷까지 셀게요.', '그럼 넷까지 셀게유.'],
	[70, 'gyebek', 'baekje', '다섯까지 세라. 바람이 늘 좋지는 않다.', '다섯까지 세라. 바람이 늘 좋은 건 아니여.', 'Count to five. The wind is not always good.', 'Count to five, son. The wind is not always good.'],
	[70, 'gyebek', 'baekje', '길은 알고 있소.', '길은 알구 있소.', 'I know the roads.', 'I know the roads, sir.'],

	/* ── #71 Gyebek ── */
	[71, 'yuridora', 'tamla', '거북아. 왜 그리 급하노. / 여기서 죽으면 편할 낀데.', '거북아. 무사 경 급허냐. / 이디서 죽으민 펜안헐 건디.', 'Turtle. What is the hurry. / You could die comfortable here.', 'Turtle. What’s the hurry on you? / Sure you could die comfortable here.'],
	[71, 'yuridora', 'tamla', '그럼 뭐가 니 거고.', '게민 뭐가 느 거고.'],
	[71, 'yuridora', 'tamla', '거북아. 하나만 배워 가라. / 이야기는 끝을 정해 놓고 시작하는 게 아이다.', '거북아. 하나만 배왕 가라. / 이야기는 끝을 정해 두엉 시작허는 게 아니여.'],
	[71, 'yuridora', 'tamla', '계백! 자네 같은 사내를 만날 수 있게 되서 난 너무 좋았다.', '계백! 이녁 같은 사내를 만나난 나 하영 지꺼졌저.', 'Gyebek! It gladdened me to know a man like you.', 'Gyebek! It’s glad I was to know a man like yourself.'],
	[71, 'yuridora', 'tamla', '본토로 돌아가면, 이제 우리는 다시 볼 수 있을 지 모르겠지.', '육지로 돌아가민, 우리 다시 볼 수 있을지 모르주.', 'Once you go back to the mainland, who knows if we shall meet again.', 'Once you’re back on the mainland, who knows will we meet again.'],
	[71, 'yuridora', 'tamla', '이거 하나만 약속해주게나.', '이거 하나만 약속허라.', 'Promise me just one thing.', 'Promise me the one thing.'],
	[71, 'yuridora', 'tamla', '사람을 까먹지 말겠나.', '사람을 잊지 말라.'],
	[71, 'Gyebek’s Wife', 'baekje', '…아이가 배가 보일 때부터 세고 있어요.', '…애가 배 보일 때부터 세구 있어유.'],
	[71, 'Gyebek’s Wife', 'baekje', '당신이 그만하라 할 때까지 안 멈출 거예요.', '당신이 그만허라 할 때까지 안 멈출 거유.', 'He won’t stop until you tell him.', 'He won’t stop till you tell him to.'],
	[71, 'Gyebek’s Son', 'baekje', '맞았어요?', '맞었어유?', 'Was it right?', 'Was it right, sir?'],
	[71, '', 'baekje', '……고마나리도요?', '……고마나리두유?'],
	[71, 'gyebek', 'baekje', '말은 종이 안 돼.', '말은 종이 안 되여.'],
	[71, 'gyebek', 'baekje', '말은 그냥 말이야.', '말은 그냥 말이여.'],
	[71, 'euija', 'baekje', '거기서 너를 그렇게 부른다며? 뱃사공이 그러더라.', '거기서 너를 그렇게 부른다며? 뱃사공이 그러더라구.'],
	[71, 'euija', 'baekje', '하— 어울린다. 바위 밑에서 살다 온 꼴이구나.', '하— 어울린다. 바위 밑에서 살다 온 꼴이구먼.', 'Ha— it suits you. You look like you’ve been living under a rock.', 'Ha— suits you mighty fine. You look like you’ve been living under a rock.'],
	[71, 'euija', 'baekje', '과인은 임금이다. 같은 말 두 번 안 한다.', '과인은 임금이여. 같은 말 두 번 안 혀.'],
	[71, 'euija', 'baekje', '그럼 내 몫은 다 쓴 거로구나!', '그럼 내 몫은 다 쓴 거구먼!'],
	[71, 'euija', 'baekje', '오천. 그게 주머니 전부다.', '오천. 그게 주머니 전부여.'],
	[71, 'euija', 'baekje', '사택의 사병은 ‘오는 중’이란다. 한 해째 오는 중이지.', '사택네 사병은 ‘오는 중’이랴. 한 해째 오는 중이지.'],
	[71, 'euija', 'baekje', '기억하지? 지난번에 내가 한 말.', '기억허지? 지난번에 내가 한 말.'],
	[71, 'euija', 'baekje', '이건 어리석은 명이 아니다. 그냥 나쁜 명이지.', '이건 어리석은 명이 아니여. 그냥 나쁜 명이지.'],
	[71, 'euija', 'baekje', '계백아— 네 집. 처자식 말이다.', '계백아— 네 집. 처자식 말여.']
];

/** Image anchors that quoted a line rewritten above. [episode, image id, new at] */
const REANCHOR = [
	[60, 'ox-iron-tale', '밭 갈렌 쇠를 줬는디'],
	[61, 'iron-chest', 'To see had he won.'],
	[64, 'jacheongbi', 'Then how is it you survived twenty years at a court?']
];

const who = (b) => b.person ?? b.speaker ?? '';
const matches = (b, speaker) => b.kind === 'dialogue' && (speaker === '' ? !b.person && !b.speaker : who(b) === speaker);

function hits(entry, speaker, ko) {
	const out = [];
	for (const list of lists(entry))
		for (const b of list) if (matches(b, speaker)) b.lines.forEach((l, k) => l === ko && out.push({ b, k }));
	return out;
}

editStory((story) => {
	const all = story.flatMap((c) => c.entries);
	const tally = {};
	let changed = 0;
	for (const [n, speaker, kingdom, koOld, koNew, enOld, enNew] of EDITS) {
		if (n < RANGE[0] || n > RANGE[1]) throw new Error(`#${n} outside range`);
		const e = all[n - 1];
		const at = `#${n} ${e.title} [${speaker || 'unnamed'}] "${koOld}"`;
		let found = hits(e, speaker, koOld);
		if (koOld !== koNew && !found.length && hits(e, speaker, koNew).length === 1) {
			const { b, k } = hits(e, speaker, koNew)[0];
			if (enNew && b.en[k] !== enNew) throw new Error(`${at}: done in Korean, English drifted`);
			continue;
		}
		if (found.length !== 1) throw new Error(`${at}: matched ${found.length}`);
		const { b, k } = found[0];
		if (enOld) {
			if (b.en[k] === enNew && b.lines[k] === koNew) continue;
			if (b.en[k] !== enOld) throw new Error(`${at}: English is "${b.en[k]}"`);
			b.en[k] = enNew;
		} else if (koOld === koNew) continue;
		b.lines[k] = koNew;
		tally[kingdom] = (tally[kingdom] ?? 0) + 1;
		changed++;
	}
	for (const [n, id, text] of REANCHOR) {
		const im = all[n - 1].images?.find((i) => i.id === id);
		if (!im) throw new Error(`#${n}: no image ${id}`);
		im.at = text;
	}
	console.log(changed ? `changed ${changed} lines: ${JSON.stringify(tally)}` : 'already applied');
	if (!changed) return false;
});
