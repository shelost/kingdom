/** Remaining Jumong beats. Loaded by restore-jumong-scenes.mjs */
export function addMore({ insert, replace, findHtml, findEn, findScene, P, D, T, R, SC }) {
	replace(findHtml('In time Yuhwa lays a great egg'), 1, [
		P(
			'Geumwa has the egg taken from her',
			'In time Yuhwa lays a great egg. {{at}} before the court has agreed what a river-daughter is allowed to bear.',
			'때가 되어 유화가 커다란 알을 낳는다. 금와가 알을 빼앗아 간다. 조정은 강의 딸이 무엇을 낳아도 되는지 아직 합의하지 못했다.'
		),
		SC('The Egg', '알'),
		R(
			'Dogs and pigs will not eat it. The sty refuses the guest, and the ministers pretend that is a kind of answer.',
			'개와 돼지가 먹지 않는다. 외양간이 손님을 거절하고, 신하들은 그걸 대답인 척한다.'
		),
		R(
			'They throw it in the road. Cattle and horses step around it. Hooves know better than the hall.',
			'길에 버린다. 소와 말이 피해서 간다. 발굽이 대청보다 낫다.'
		),
		R(
			'They leave it in the open field. Birds cover it with their wings instead of pecking. The yard goes quiet at that.',
			'들에 둔다. 새들이 쪼지 않고 날개로 덮는다. 마당이 그걸 보고 조용해진다.'
		),
		P('The axe will not split the egg', 'An axe is brought. {{at}}. The edge sings and the shell does not bother to crack.', '도끼를 가져온다. 도끼로도 알이 안 깨진다. 날이 울고, 껍질은 갈라질 생각도 안 한다.'),
		P('He winds up', '{{at}}, both arms, the pale egg against red-brown timber.', '그가 자세를 잡는다. 두 팔, 적갈색 나무에 기댄 하얀 알.'),
		P('then hurls it', 'The court flinches, {{at}} toward the open air.', '조정이 움츠러든다. 그러고 허공으로 내던진다.'),
		P('He casts it off the palisade', '{{at}}. It meets the stones and stays whole.', '목책 밖으로 던진다. 돌에 닿아도 그대로다.'),
		P('Yuhwa wraps it warm', '{{at}} in her own sleeve and takes it back upstairs, and nobody reaches for the axe again.', '유화가 제 소매로 따뜻하게 싼다. 다시 위층으로 가져간다. 다시 도끼에 손대는 사람이 없다.'),
		P('The hatch-room is empty timber', '{{at}} before the shell gives, a mat, a door, the yard in a hard bar of day.', '부화의 방은 빈 나무다. 껍질이 열리기 전, 자리, 문, 단단한 낮빛의 막대 속 마당.'),
		P('The hatch-room opens onto the yard', '{{at}} through a timber door, so the first light on him is a real afternoon.', '부화의 방이 마당으로 열린다. 나무 문 너머, 그에게 닿는 첫 빛은 진짜 오후다.'),
		P('out of the egg comes a baby boy', 'Then {{at}}, wet, furious, already trying to focus.', '그러고 알에서 사내아이가 나온다. 젖고, 화가 나 있고, 이미 초점을 맞추려 한다.'),
		P('He looks up from the shell', '{{at}} as if the room had owed him an explanation.', '껍질에서 올려다본다. 방이 해명을 빚진 것처럼.'),
		P('Not a painted face', '{{at}}. A new one, creased, mouth open, no god’s finish on it.', '그린 얼굴이 아니다. 새 얼굴, 주름, 열린 입, 신의 마무리는 없다.'),
		R(
			'They name him <b>Jumong</b>, the good shot, because in those days people were named for what heaven had plainly already decided. He grows up with his brothers Daeso and Galsa, and the better he shoots, the smaller their smiles become.',
			'사람들은 아이를 <b>주몽</b>, 활 잘 쏘는 이라 이름 짓는다. 그 시절에는 하늘이 이미 정해 둔 것을 따라 이름을 지었기 때문이다. 주몽은 형 대소, 갈사와 함께 자라고, 활이 늘수록 웃음은 작아진다.'
		),
		P('They are boys first', '{{at}}, three of them in one square, before anybody is an heir on purpose.', '처음에는 그냥 아이들이다. 사각형 하나에 셋. 누가 일부러 태자가 되기 전에.'),
		P('tiny stamps at the same stake', 'From the roof they are {{at}}, red and bronze and sage, one mark for all of them.', '지붕에서 보면 같은 말뚝의 작은 도장들이다. 붉고, 청동이고, 풀빛이고, 과녁은 하나.'),
		P('three tiny princes at one stake', '{{at}}. The arrow is the only thing that knows which boy threw it.', '왕자 셋이 말뚝 하나에. 어느 아이가 던졌는지는 화살만 안다.'),
		P('borrowed bows', 'They shoot with {{at}}, too long in the arm, the string a rumor of a man’s draw.', '빌린 활로 쏜다. 팔보다 길고, 시위는 어른 당김의 소문.'),
		P("He practices on a fly's wing", '{{at}} before he can be trusted with a cup.', '잔을 믿기기 전에 파리 날개로 연습한다.'),
		D('jumong', "I'll take the fly.", '파리는 내가.'),
		P(
			'Daeso teaches the grip, then resents the hit',
			'{{at}}. The lesson ends the moment the arrow is better than the teacher.',
			'대소가 쥐는 법을 가르치고, 맞히면 분을 낸다. 화살이 스승보다 나아지는 순간 수업이 끝난다.'
		),
		P('The yard hears the wood take it', '{{at}}, a clean tick, and the praise does not arrive.', '마당이 나무가 맞는 소리를 듣는다. 깨끗한 틱. 칭찬은 안 온다.'),
		P('Daeso does not clap', '{{at}}. His hands stay on his own bow as if applause were a confession.', '대소는 박수 치지 않는다. 손은 제 활에 있다. 박수가 자백인 것처럼.'),
		P(
			'Galsa looking at the dirt instead of the hit',
			'{{at}}. Second son, doing the arithmetic where nobody can score his face.',
			'갈사는 맞은 곳 대신 흙을 본다. 둘째가, 얼굴에 점수를 매길 수 없는 곳에서 셈을 한다.'
		),
		P('The smiles keep shrinking', '{{at}} every time the fly loses a wing.', '파리의 날개가 떨어질 때마다 웃음이 줄어든다.'),
		P('They sleep in a pile like dogs', '{{at}} under one quilt, and in the morning the quilt has taken sides.', '개들처럼 뭉쳐 잔다. 이불 하나. 아침이면 이불이 편을 든다.'),
		P('Jumong steals the last millet', '{{at}} and grins through it, which is worse than the theft.', '주몽이 마지막 기장을 훔친다. 그러면서 웃는다. 도둑질보다 그게 더 나쁘다.'),
		P('Yuhwa watches from the hall door', '{{at}}, ice-blue sleeve on the post, not stepping into the boys’ weather.', '유화가 대청 문에서 본다. 기둥에 얼음빛 소매. 아이들 날씨 안으로 들어가지 않는다.'),
		P(
			'They grow apart in the same square',
			'{{at}}, a hand’s width more between bowls each season.',
			'같은 마당에서 서로 멀어진다. 계절마다 그릇 사이가 손바닥만큼.'
		),
		P('They grow apart in the same square.', '{{at}} Nobody moves house. The distance does.', '같은 마당에서 서로 멀어진다. 집을 옮기는 사람은 없다. 거리가 옮긴다.'),
		P('Only two come back talking', '{{at}} from the stake. The third has already started a country in his head.', '말하면서 돌아오는 건 둘뿐이다. 셋째는 이미 머릿속에서 나라를 시작했다.'),
		P('One roof, three bowls', '{{at}}. The roof is sincere. The bowls are not.', '지붕 하나, 그릇 셋. 지붕은 성실하다. 그릇은 아니다.'),
		D('daeso', 'You slept.', '잤냐.', [['The last bowl was yours. It isn’t.', '마지막 그릇은 네 거였다. 이제 아니야.']]),
		P('The second bowl stays dry', '{{at}}. Galsa watches the dry one and does not ask whose turn it was.', '두 번째 그릇은 마른 채로 남는다. 갈사는 그 마른 걸 보고, 누구 차례였는지 안 묻는다.'),
		D('daeso', 'This house feeds you.', '이 집이 널 먹인다.', [['Remember the order.', '순서를 기억해.']]),
		P(
			'grinning is cheaper than asking why',
			'Jumong keeps the grin because {{at}}, and Daeso hates the price.',
			'주몽은 웃음을 유지한다. 왜냐고 묻는 것보다 웃음이 싸서. 대소는 그 값을 싫어한다.'
		),
		D('galsa', "He is not. That's the problem.", '아니야. 그게 문제지.', [['He’s not grateful. He’s good.', '고마워하는 게 아니야. 잘해.']]),
		D('jumong', "I'm going to look at the dirt", '나 흙이나 볼게.', [['The stake’s still there.', '말뚝은 아직 있어.']]),
		P(
			'side room',
			'Geumwa will not take the heir’s counsel, so Daeso takes the ministers into a {{at}}. Lamp low. If they write it down, the scandal arrives before the knife.',
			'금와가 태자의 말을 받지 않아서, 대소가 신하들을 곁방으로 부른다. 등잔은 낮고. 적으면 칼보다 소문이 먼저 온다.'
		),
		D('daeso', 'Do it before the next hunt.', '다음 사냥 전에 끝내.', [['Quiet is fine.', '조용하면 됐다.']])
	]);

	insert(findHtml('One night Jumong slips'), [
		P(
			"Jumong's arranged marriage to Lady Ye",
			'{{at}} is a hall’s solution: a wife, a lamp, a door that still opens onto Buyeo.',
			'주몽의 정략혼은 대청의 해법이다. 아내, 등잔, 아직 부여로 열리는 문.'
		),
		P(
			'Lady Ye gets pregnant with their son Yuri',
			'{{at}} while the yard is still pretending the foundling is a guest.',
			'예씨부인이 아들 유리를 밴다. 마당은 아직 그 주워 온 아이를 손님인 척한다.'
		),
		D('ladyye', 'Leave Buyeo. Tonight.', '부여를 떠나. 오늘 밤.', [['I’ll keep the lamp.', '등잔은 내가 켤게.']]),
		D('jumong', 'Leave the door half if you go.', '가면 문은 반만 닫아.', [['So I know which way is still yours.', '어느 쪽이 아직 네 건지 알게.']]),
		P('Night at the palisade', '{{at}}. Iron studs, a red sleeve, and a wife who does not come out to wave.', '목책의 밤. 쇠 못, 붉은 소매, 손 흔들러 나오지 않는 아내.')
	]);

	insert(findHtml('They reach water at night'), [
		SC('The Flight', '달아남'),
		P('the four go south', 'Before the river, {{at}}, a red silk and three earth-tones, no horses, the palisade already behind them.', '강 전에 넷이 남으로 간다. 붉은 비단과 흙빛 셋. 말 없이. 목책은 이미 뒤.'),
		P(
			'They split in the pines before the crossing',
			'{{at}}. The friends will not walk the turtles. That road is his alone.',
			'건너기 전에 소나무 속에서 갈라진다. 벗들은 자라를 밟지 않는다. 그 길은 그만의 것이다.'
		),
		D('oi', 'We take the ridge', '우리는 능선으로 간다.', [['Find us when you still have a bow.', '활이 남아 있을 때 찾아.']]),
		P('He runs until the pines smear', '{{at}}. Red is a streak. The net is faster than a man.', '소나무가 번질 때까지 뛴다. 붉은색은 줄. 그물은 사람보다 빠르다.'),
		P('The net is spears in the dark', '{{at}}, points only, no faces he is allowed to know.', '그물은 어둠 속의 창이다. 날만. 알아도 되는 얼굴은 없다.'),
		P('A root. He goes down.', '{{at}} The bow leaves his hand before his breath does.', '뿌리. 넘어진다. 숨보다 활이 먼저 손을 떠난다.'),
		P('His cheek is in the grit', '{{at}}. Pine needles in his mouth. The day tastes like iron.', '뺨이 모래에 있다. 입에 솔잎. 하루가 쇠 맛이다.'),
		P('His eyes roll', '{{at}}, white for a second, the kind of second a ledger likes.', '눈이 돌아간다. 잠깐 흰자. 장부가 좋아하는 종류의 잠깐.'),
		P('The day is almost collected', '{{at}}. Something in the dark has already reached for it.', '하루가 거의 걷힌다. 어둠 속의 무언가가 이미 손을 뻗었다.'),
		P('Jumong reaches the water alone', '{{at}}. No ford. No boat. The friends are a ridge away, on purpose.', '주몽이 홀로 물에 닿는다. 여울도 배도 없다. 벗들은 일부러 능선 하나 떨어져 있다.'),
		P('He does not see who comes for it', '{{at}}. The night has a face. He is looking at the river.', '그것을 가지러 온 자를 보지 못한다. 밤에는 얼굴이 있다. 그는 강을 보고 있다.')
	]);

	insert(findEn('I am the son of the great Haemosu'), [SC('The Crossing', '건넌 강')]);

	insert(findEn("You'll get Tabal") + 1, [
		P('He looks past the spear.', '{{at}} The pine behind the man is a better door than the man’s face.', '창 너머를 본다. 남자 뒤의 소나무가 그 얼굴보다 나은 문이다.'),
		P('Jolbon roofs keep the stars', '{{at}} in the gaps between giwa, a valley that has not decided he may sleep in it.', '졸본 지붕이 기와 틈으로 별을 지킨다. 그가 자도 되는지 아직 정하지 않은 골짜기.'),
		P('Dusk Jolbon porch is empty timber', '{{at}}, a grain rail, no feast, the kind of welcome that is mostly a count.', '해질녘 졸본 누대는 빈 나무다. 곡식 난간, 잔치 없이. 환영의 대부분이 숫자다.')
	]);

	const dump = findEn('River dump you?');
	const week = findHtml('For a week Tabal uses him');
	replace(dump, week - dump, [
		P('The hall is only torches', '{{at}} and a man who has not offered a mat.', '대청은 횃불뿐이다. 자리를 내주지 않은 남자.'),
		P('on his knees before Tabal', 'They put him {{at}}, packed earth in the weave of his red silk.', '타발 앞에 무릎을 꿇린다. 붉은 비단 결에 다진 흙.'),
		P("Jumong's knees in the packed earth", '{{at}} leave two dark ovals. He tries a grin. It does not survive the torches.', '주몽의 무릎이 다진 흙에 어두운 타원 둘을 남긴다. 웃어 본다. 횃불 앞에서는 못 산다.'),
		D('yeontabal', 'So who sent you', '그래서 누가 보냈냐.'),
		D('jumong', 'Nobody sent me', '아무도 안 보냈어요.', [['Your men grabbed me. I was just— here.', '당신 사람들이 잡았어요. 그냥… 여기 있었어요.']]),
		D('yeontabal', 'I asked for a name.', '이름은 물었다.'),
		T('jumong', [
			['Jumong.', '주몽이요.'],
			['That’s the name.', '그게 이름이에요.']
		]),
		D('yeontabal', "Your clothes don't look like anything nearby", '네 옷은 이 근처 어디에도 안 닮았다.', [
			['Mohe? Khitan? Or the commandery?', '말갈? 거란? 아니면 군현?']
		]),
		D('jumong', 'Pretty. Just-', '예쁘… 그냥.'),
		D('yeontabal', 'Eyes. Front.', '눈. 앞.'),
		D('sosuno', 'Count the dirt.', '흙이나 세.', [['Not him.', '저 사람 말고.']]),
		D('jumong', 'Ow- I said it.', '앗, 말했잖아요.'),
		P('So this is how I die', 'He thinks it with his mouth shut: {{at}}, for a compliment, in a hall that smells like pine smoke.', '입을 다문 채로 생각한다. 이렇게 죽는구나. 칭찬 한마디에, 솔 연기 냄새 나는 대청에서.'),
		P('He notices the bow.', 'Tabal {{at}} The wood is wrong for every hand in the room except one.', '타발이 활을 알아본다. 이 방의 손들 중 하나를 빼고는 다 맞지 않는 나무.'),
		P('He cannot pull the string', 'They put Jumong’s bow in Tabal’s hands. {{at}}, and the limb does not do him the courtesy of bending.', '주몽의 활을 타발 손에 쥐여 준다. 시위를 당길 수가 없다. 몸통은 휠 예의도 없다.'),
		P('He cannot pull the string.', '{{at}} Veins. Torch. A hall waiting for a clean death that will not open.', '시위를 당길 수가 없다. 핏줄. 횃불. 깨끗한 죽음을 기다리는 대청이 열리지 않는다.'),
		D('yeontabal', 'Stop!', '멈춰!'),
		D('jumong', 'Son of Haemosu', '해모수의 아들이요.', [['The bow knows. I didn’t ask it to.', '활이 알아요. 제가 부탁한 건 아닌데.']]),
		P('the wood stays as it was', 'He gives it back, and {{at}}, which is worse than if it had snapped.', '돌려준다. 나무는 원래대로 남는다. 부러진 것보다 그게 더 나쁘다.'),
		D('yeontabal', "You're a slave. My daughter's.", '넌 종이다. 내 딸의.', [['Shed. You hunt, you eat.', '헛간. 사냥하면 먹어.']])
	]);

	insert(findHtml('Then the wet man is in the yard') + 1, [
		P('The yard does not move', '{{at}}. Nobody dropped a spear. Everybody forgot what a spear is for.', '마당이 움직이지 않는다. 창을 떨어뜨린 사람은 없다. 모두 창이 뭔지 잊었다.'),
		P('Something in her goes stupid', '{{at}} while the chin stays up. She will deny this to the millet.', '무언가가 그녀 안에서 바보가 된다. 턱은 그대로다. 기장에게는 부인할 것이다.')
	]);

	insert(findHtml('She starts calling him names') + 1, [
		P('She does not look up from the count', '{{at}}. West line, two short, and a red back she is not counting.', '셈에서 고개를 안 든다. 서쪽 줄, 둘 모자라, 그리고 세지 않는 붉은 등.'),
		P('She points the west millet', '{{at}} with two fingers, the way she points at weather.', '서쪽 기장을 가리킨다. 두 손가락. 날씨를 가리키듯.'),
		P('He follows the finger', '{{at}} and the sacks, grinning like the job was a favor.', '손가락을 따라간다. 가마니도. 일이 부탁이었다는 듯이 웃으며.'),
		P('He hauls the sacks grinning', '{{at}}. The porch hears the laugh and pretends it is a cough.', '가마니를 웃으며 나른다. 누대는 웃음을 듣고 기침인 척한다.'),
		D('sosuno', 'Wrong stack. Do it again.', '더미가 틀려. 다시.'),
		D('sosuno', "Don't talk in the ditch", '도랑에서 말하지 마.'),
		D('sosuno', 'Ditch. Now.', '도랑. 지금.'),
		D('sosuno', "Count the sacks. Don't grin.", '가마니를 세. 웃지 마.'),
		D('sosuno', "Don't grin at the mud.", '진흙보고 웃지 마.'),
		P('She makes him wring the rope', '{{at}} until his hands complain, and she watches the hands, not the grin.', '줄을 짜게 한다. 손이 불평할 때까지. 그녀는 웃음이 아니라 손을 본다.'),
		D('sosuno', "Pull. Don't chat the rope", '당겨. 줄이랑 수다 떨지 마.'),
		P('Chin stays up on the count', '{{at}}. One, two, three. The other number is his mouth, and she will not say it.', '셈하는 동안 턱이 올라간 채로 남는다. 하나, 둘, 셋. 다른 숫자는 그의 입이고, 그녀는 그걸 말하지 않을 것이다.'),
		D('sosuno', "Grinning's extra", '웃음은 덤이야.', [['I didn’t order it.', '시킨 적 없어.']]),
		P('Work first. Looking later.', 'She tells the yard, and herself, {{at}} The yard believes her. She doesn’t.', '마당에게, 그리고 자신에게 말한다. 일이 먼저. 보는 건 나중. 마당은 믿는다. 그녀는 아니다.'),
		D('sosuno', "It's not like that. Worker.", '그런 거 아니야. 일꾼.', [['Move the sack.', '가마니나 옮겨.']]),
		P("He's Sosuno's worker", 'By the third morning the porch has a sentence: {{at}}. She hates how easily it fits.', '사흘째 아침, 누대에 문장이 생긴다. 그는 소서노의 일꾼이다. 그녀는 그게 너무 잘 맞는 게 싫다.'),
		D('sosuno', "That's my worker", '저건 내 일꾼이야.', [['Not yours to stare at.', '네가 볼 거 아니야.']]),
		D('jumong', 'So how long has it been.', '그래서 얼마나 됐어.'),
		D('sosuno', "Don't- don't grin like you found something.", '웃지 마, 뭐 찾은 것처럼 웃지 마.'),
		D('jumong', 'Then why are you furiously blushing.', '그럼 왜 그렇게 세게 붉어져.'),
		D('sosuno', "I'm also not stopping.", '나도 안 멈춰.', [['The count. Not you.', '셈. 너 말고.']])
	]);

	insert(findScene('Other Daughters') + 2, [
		P('He flirts at the wrong well', '{{at}}, which is any well she can see from the porch.', '잘못된 우물에서 농을 한다. 누대에서 보이는 우물은 다 잘못된 우물이다.'),
		P('He grins at the wrong well', '{{at}}. The girls laugh too long at a sentence he did not finish.', '잘못된 우물을 보고 웃는다. 여자들은 그가 끝내지 않은 문장에 너무 오래 웃는다.'),
		D('teal', 'Hey big boy~', '야, 큰 남자~'),
		D('jumong', "You're- yeah. Funny. Too funny.", '너, 응. 웃겨. 너무 웃겨.'),
		D('jumong', 'Poor bucket.', '불쌍한 두레박.'),
		D('teal', "Don't look at Sosuno. Look at me.", '소서노 보지 마. 나를 봐.'),
		P('Teal hikes at his well', '{{at}}, a hem, a dare, the rope between them like a bad idea.', '청록이 그의 우물에서 치맛자락을 걷는다. 단, 도전, 둘 사이의 줄은 나쁜 생각.'),
		D('teal', "Don't follow me.", '따라오지 마.', [['Unless you are.', '따라올 거면 말고.']]),
		P('Hip first on the beam', 'She leans {{at}}, the timber taking her weight, his ears taking the rest.', '엉덩이부터 들보에 기댄다. 나무는 무게를 받고, 그의 귀는 나머지를 받는다.'),
		P('She hikes it like a dare', '{{at}}, ice-nothing, some other girl’s silk, and waits to see if he is stupid.', '도전처럼 걷어 올린다. 다른 애의 비단. 그가 바보인지 보려고 기다린다.'),
		D('plum', 'Come fetch at ours', '우리 우물로 물 뜨러 와.'),
		D('sosuno', 'Get. Off.', '내려. 와.'),
		P('They hitch at his well.', '{{at}} Silk, laughter, a rope that was supposed to be for water.', '그의 우물에서 걸친다. 비단, 웃음, 물을 위한 줄이었던 것.'),
		D('sosuno', 'Get off my well.', '내 우물에서 내려.'),
		P('They can do sexy. She can do eldest', '{{at}}, which is a worse weapon, and she knows it before they do.', '저들은 야하게 할 수 있다. 그녀는 맏이처럼 할 수 있다. 더 나쁜 무기이고, 저들보다 그녀가 먼저 안다.'),
		P('Ass first onto him', 'Plum turns and it is {{at}}, a joke with a body, and the well-rim is not wide enough.', '자두가 돌면 엉덩이부터 그에게 닿는다. 몸으로 하는 농담. 우물 테가 그만큼 넓지 않다.'),
		P('She backs it onto his thigh', '{{at}} and laughs like the bucket had asked.', '허벅지에 등을 밀착하고, 두레박이 부탁한 것처럼 웃는다.'),
		P('Plum laughs and backs it', '{{at}} again, meaner, prettier, waiting for the porch to break.', '자두가 웃으며 다시 민다. 더 심하고, 더 예쁘고, 누대가 깨지길 기다리며.'),
		D('sosuno', 'BECAUSE YOU WERE HANGING WITH THOSE OTHER BITCHES-', '그 다른 년들이랑 붙어 있었으니까!'),
		P("Jumong's grin dies in his mouth", '{{at}} when he sees who is holding the empty bucket.', '빈 두레박을 든 사람이 누구인지 보는 순간, 주몽의 웃음이 입안에서 죽는다.'),
		P('The grin dies mid-face', '{{at}}. One eye still thinks this is funny. The mouth has quit.', '웃음이 얼굴 한가운데서 죽는다. 한쪽 눈은 아직 웃긴 줄 안다. 입은 그만뒀다.'),
		P('Sosuno is already there', '{{at}}, dusty-rose, chin up, the well suddenly a courtroom.', '소서노가 이미 거기 있다. 먼지 장미, 턱, 우물이 갑자기 법정.'),
		P(
			'A Sosuno-shaped shadow stands behind him',
			'{{at}} before her voice does. The girls notice the shadow first.',
			'소서노 모양의 그림자가 목소리보다 먼저 뒤에 선다. 여자들이 그림자를 먼저 알아본다.'
		)
	]);

	insert(findScene('Upstairs') + 2, [
		P('The loft is the whole room first', '{{at}}, dust, a beam, her breath louder than the yard.', '다락이 먼저 방 전부다. 먼지, 들보, 마당보다 큰 그녀의 숨.'),
		P('Sosuno lies on her thatched bed the first night', '{{at}} and tells the thatch she is only tired.', '첫날 밤 소서노가 초가지붕 침상에 눕고, 초가에게 그냥 피곤한 거라고 말한다.'),
		P('She tries to fight the lustful fantasies', '{{at}} with a count. The count knows his mouth.', '음란한 공상과 싸우려 한다. 숫자로. 숫자는 그의 입을 안다.'),
		P('His face first', '{{at}}, then the rest of him arrives in the dark behind her eyes.', '그의 얼굴이 먼저. 그러고 나머지가 눈 뒤의 어둠으로 온다.'),
		P('his bare back', 'She gets stuck on {{at}}, the one the yard already ruined her with.', '그의 맨등에 걸린다. 마당이 이미 그걸로 그녀를 망쳐 놓았다.'),
		P('He haunts her into heat.', '{{at}} The thatch is a poor witness and an eager one.', '그가 그녀를 열 속으로 쫓아온다. 초가는 형편없는 증인이고, 열심인 증인이다.'),
		P('Her hand slips down between her legs', '{{at}} while the other stays over her mouth, as if the mouth were the scandal.', '손이 다리 사이로 미끄러진다. 다른 손은 입 위에. 입이 추문인 것처럼.'),
		P('She fantasizes about him filling her up', '{{at}} and hates the sentence even as she spends it.', '그가 채워 넣는 걸 상상한다. 그 문장을 쓰면서도 싫어한다.'),
		P('She scolds the heat that used his face.', '{{at}} The heat does not apologize.', '그의 얼굴을 쓴 열을 꾸짖는다. 열은 사과하지 않는다.'),
		P('The first night does not leave the bed', '{{at}}. Morning will have to come up the stairs and fetch her.', '첫날 밤은 침상을 떠나지 않는다. 아침이 계단으로 올라와 데려가야 한다.'),
		P('Legs wide on the timber.', 'Another afternoon: {{at}} Dusty-rose hiked. One hand on her own mouth.', '다른 오후. 나무 위에 다리를 벌린다. 먼지 장미는 걷히고. 한 손은 제 입.'),
		P('Fingers under the chima.', '{{at}} The count downstairs goes on without her.', '치마 속의 손가락. 아래층 셈은 그녀 없이 계속된다.'),
		P('She comes on the timber', '{{at}}, a bitten sound, the beam taking the shake.', '나무 위에서 간다. 깨문 소리. 들보가 떨림을 받는다.'),
		P('Silk hitch', 'A {{at}} at her hip where her own hand lost the argument.', '엉덩이에서 비단이 걸린다. 제 손이 말다툼에서 진 자리.'),
		D('sosuno', 'Those big- 흐읍-', '그 큰, 흐읍.'),
		D('sosuno', 'I want- 하아-', '원해, 하아.'),
		P('Timber under the knees', '{{at}}, splinters she will not mention, the loft a closed mouth.', '무릎 아래 나무. 말하지 않을 가시. 다락은 다문 입.'),
		P('Tabal is in the doorway', '{{at}} of the yard, not the loft, and his voice still climbs the stairs.', '타발이 마당 문간에 있다. 다락이 아니다. 목소리는 그래도 계단을 올라온다.'),
		D('sosuno', "Idiot. Don't grin in my head", '바보. 내 머릿속에서 웃지 마.'),
		D('sosuno', 'This is your fault, big idiot', '네 탓이야, 바보야.')
	]);

	insert(findScene('The Well') + 1, [
		P('Day at the well is two buckets', '{{at}} and a rope that already knows her hands.', '우물의 낮은 두레박 둘이다. 이미 그녀의 손을 아는 줄.'),
		P('Buckets stay on packed earth', '{{at}}. Nobody has earned the right to lift one yet.', '두레박은 다진 흙 위에 머문다. 아직 들 자격을 얻은 사람이 없다.'),
		P('The peg waits through dusk', '{{at}}, a small wood tooth, the rope bitten into it.', '말뚝이 해질녘을 기다린다. 작은 나무 이빨. 줄이 거기에 물려 있다.'),
		P('The well holds the night', '{{at}} in a round black mouth. Stars, no boat, her hour.', '우물이 밤을 담는다. 둥근 검은 입. 별, 배 없이, 그녀의 시간.')
	]);

	insert(findHtml('The confession comes') + 1, [
		P('The bird pin comes out', '{{at}} in her own fingers. She does not look at what she is doing.', '비녀가 빠진다. 제 손가락으로. 자기가 하는 일을 안 본다.'),
		P('Hair falls', '{{at}} in a sheet and the well-rim disappears behind it.', '머리가 떨어진다. 막처럼. 우물 테가 그 뒤로 사라진다.'),
		P('She sits on packed earth facing down', '{{at}}, dusty-rose in a heap, the bow beside her knee.', '다진 흙에 앉아 아래를 본다. 먼지 장미가 더미, 무릎 옆에 활.'),
		P('dusty-rose a surrendered heap', 'The silk is {{at}}. She is not performing ruin. She is in it.', '비단은 항복한 더미다. 망가짐을 연기하는 게 아니다. 그 안에 있다.'),
		P('forehead toward the boards', '{{at}} of the well, close enough to smell wet stone.', '이마가 우물 널을 향한다. 젖은 돌 냄새가 날 만큼 가깝게.'),
		P('Undone hair veils her face', '{{at}}. The binyeo is a small betrayal on the dirt.', '푼 머리가 얼굴을 가린다. 비녀는 흙 위의 작은 배신.'),
		P('The crown of undone hair', '{{at}} is what he can see. Not her eyes. She is spending those on the ground.', '푼 머리의 정수리가 그가 볼 수 있는 전부다. 눈이 아니다. 눈은 땅에 쓰고 있다.'),
		P('She keeps talking into the dirt', '{{at}} because his face is a luxury she has not paid for.', '흙을 향해 계속 말한다. 그의 얼굴은 아직 값을 치르지 않은 사치라서.'),
		P("She still doesn't look up", '{{at}}. The sentence arrives anyway.', '그래도 올려다보지 않는다. 문장은 그래도 도착한다.'),
		P('Her hands stay on the packed earth', '{{at}}, flat, as if the yard might tip if she lets go.', '손은 다진 흙에 머문다. 편평하게. 놓으면 마당이 기울 것처럼.'),
		P('Hair hides the binyeo', '{{at}} until a glint gives it up beside her wrist.', '머리가 비녀를 숨긴다. 손목 옆에서 반짝임이 배신할 때까지.'),
		P('He kneels into the downcast frame', '{{at}}, lower than her crown, careful of the hair.', '그가 내리깐 화면 안으로 무릎 꿇는다. 정수리보다 낮게. 머리를 조심하며.'),
		D('sosuno', "I don't- I don't like you.", '나, 너 안 좋아해.'),
		D('jumong', "Then I'm going.", '그럼 갈게.'),
		P('Then he grins.', '{{at}} Not the yard grin. A smaller one, asking.', '그러고 웃는다. 마당의 웃음이 아니다. 더 작은, 묻는 웃음.'),
		D('jumong', "Okay. I'm here.", '알았어. 나 여기 있어.'),
		P(
			'Sosuno hears herself and cannot take it back',
			'{{at}}. The dirt has the sentence now. So does he.',
			'소서노는 제 말을 듣고 주워 담지 못한다. 이제 문장은 흙의 것이다. 그의 것이기도 하다.'
		)
	]);

	insert(findEn('From the first look.') + 1, [
		D('jumong', 'I wanted you. From the first look.', '처음부터 원했어. 처음 본 순간부터.'),
		D('sosuno', 'What you want me to do to you.', '나한테 뭘 시키고 싶은데.', [['Say it or don’t.', '말하든가 말든가.']]),
		D('sosuno', "I've never-", '나 한 번도…'),
		D('jumong', "I've done this.", '난 해봤어.', [['Not like you.', '너처럼은 아니야.']]),
		D('sosuno', 'Now come here before I take it back', '취소하기 전에 이리 와.'),
		D('sosuno', "It won't- ah- fit-", '안 들어가, 아.'),
		P('She sticks it out anyway', '{{at}}, furious at the fit, more furious at stopping.', '그래도 내민다. 안 맞는 게 화나고, 멈추는 게 더 화나다.'),
		D('sosuno', "Look at my back. That's... that's the picture", '내 등 봐. 그게… 그게 그림이야.'),
		D('jumong', "That's yours. Tight", '네 거야. 조여.'),
		P('Worker silk, same grammar', '{{at}} as a queen’s, only dustier: the back, the hitch, the dare.', '일꾼의 비단, 같은 문법. 여왕의 것과, 다만 더 먼지투성이. 등, 걸침, 도전.'),
		P('They sleep in the granary', '{{at}} because the loft is a rumor and the sacks are closer than pride.', '곳간에서 잔다. 다락은 소문이고, 가마니가 자존심보다 가까워서.')
	]);

	insert(findHtml('Tabal has been on the porch'), [
		D('sosuno', 'So the hall last night', '그래서 어젯밤 대청.', [['Don’t.', '하지 마.']])
	]);

	insert(findHtml('The pine is a hundred paces') + 1, [
		P('He turns for the pine', '{{at}} with the easy shoulder of a man who already knows the knot.', '소나무를 향해 돌아선다. 이미 옹이를 아는 사람의 편한 어깨.'),
		P('carrying the pine he has torn up', 'Later they will tell it as {{at}}. Tonight it is only the arrow, and the hall hearing the wood cry.', '나중에는 뽑아 온 소나무를 졌다고 말할 것이다. 오늘 밤은 화살뿐이다. 대청이 나무 우는 소리를 듣는다.')
	]);

	insert(findHtml('The marriage is real hunger') + 1, [
		P(
			'Tabal sets a vermilion cord',
			'{{at}} where a feast would have been, a short red line, two people who have already spent the night.',
			'연타발이 주홍 끈을 놓는다. 잔치가 있었을 자리에. 짧은 붉은 선. 이미 밤을 보낸 두 사람.'
		)
	]);

	insert(findScene('Five Tribes') + 1, [
		P('the first summit of the five tribes', 'What he calls a talk, the valley will call {{at}}.', '그가 이야기라 부르는 것을, 골짜기는 다섯 부족의 첫 회의라 부를 것이다.'),
		P('Five fires. Five roofs', '{{at}}. He says it like weather, not like a throne.', '불 다섯. 지붕 다섯. 왕좌처럼이 아니라 날씨처럼 말한다.'),
		P('The five fires take the same wind', '{{at}} off the pine, and for once the smoke agrees.', '다섯 불이 소나무에서 같은 바람을 받는다. 이번만은 연기가 동의한다.'),
		P('They sit in a ring the yard can hold', '{{at}}. No dais. Knees. A ditch that has been demoted to a line on the ground.', '마당이 감당하는 고리에 앉는다. 대좌 없이. 무릎. 도랑은 땅 위의 선으로 강등된다.')
	]);

	insert(findScene('The First King') + 1, [
		P(
			'first queen of a country that still smells like millet',
			'She is the {{at}}. The cord is still new. The sacks have not learned to be tribute.',
			'그녀는 아직 기장 냄새 나는 나라의 첫 왕비다. 끈은 아직 새것이다. 가마니는 조공을 아직 배우지 못했다.'
		),
		P('King and queen on packed earth', '{{at}}, no throne between them, the yard they already know how to fight in.', '다진 흙 위의 왕과 왕비. 사이에 옥좌 없이. 이미 싸울 줄 아는 마당.'),
		P('Crow roof votes', 'The {{at}} with the others, a dark sleeve, a short nod, the king already grinning like it hurts.', '까마귀 지붕이 다른 이들과 함께 표를 던진다. 어두운 소매, 짧은 고개. 왕은 이미 아픈 것처럼 웃고 있다.'),
		P('a queen who still counts fires', 'He sleeps beside {{at}}, one, two, three, even with a crown in the room.', '여전히 불을 세는 왕비 곁에서 잔다. 하나, 둘, 셋. 방에 왕관이 있어도.'),
		P('her royal back is the picture', 'In the new room {{at}}, dusty-rose gone richer, the same dare.', '새 방에서 그녀의 왕의 등이 그림이다. 먼지 장미가 더 무거워졌을 뿐, 도전은 같다.'),
		P('his royal back is the picture', 'She turns him, and {{at}}, the one she inventoried from a porch.', '그녀가 그를 돌리면 그의 왕의 등이 그림이다. 누대에서 재고 조사했던 그 등.'),
		P('her royal ass is the picture.', 'He gets scolded for looking and then {{at}}', '보다가 혼나고, 그러고 그녀의 왕의 엉덩이가 그림이 된다.'),
		D('sosuno', 'Grind me like a queen.', '왕비처럼 갈아.', [['Don’t you dare be gentle about the title.', '작호 가지고 부드럽게 하지 마.']]),
		P('blushing queen', 'The {{at}} still hides her mouth in her own wrist.', '붉어지는 왕비가 여전히 제 손목에 입을 숨긴다.'),
		D('sosuno', "I'm blushing- don't you dare stop", '빨개졌어, 멈추기만 해 봐.'),
		D('sosuno', 'Flirty? Shut up. Look at my back anyway', '농탕? 닥쳐. 그래도 내 등 봐.'),
		D('sosuno', "Only you can have this queen's ass, your majesty", '이 왕비 엉덩이는 전하만 가져, 폐하.')
	]);

	insert(findScene('Dawn in the Cavern'), [
		SC('The Pine Kingdom', '소나무 나라'),
		P(
			'Oi, Mari, and Hyupbo did not vanish',
			'Word reaches the millet porch: {{at}}. They reached a pine roof that is not Tabal’s.',
			'기장 누대에 소식이 닿는다. 오이, 마리, 협보는 사라지지 않았다. 연타발의 것이 아닌 솔 지붕에 닿았다.'
		),
		P('They reached the Pine Kingdom', '{{at}}, a real stand of trees and a hall like a dark bar under them.', '소나무 나라에 닿았다. 진짜 솔숲, 그 아래 어두운 막대 같은 대청.'),
		D('jumong', 'Then put the name on the mark', '그럼 이름을 과녁에 올려.', [['One arrow. Then we talk.', '화살 하나. 그러고 이야기하자.']]),
		P("Song Yang's arrow is honest and short", '{{at}}. It hits wood. It does not hit the knot.', '송양의 화살은 정직하고 짧다. 나무에 맞는다. 옹이에는 안 맞는다.'),
		D('songyang', 'The pine country is under this roof', '솔나라는 이 지붕 아래다.', [['Take the three. They ate.', '셋은 데려가. 밥은 먹었다.']]),
		P('the three come out of the pine hall', 'At dusk {{at}}, earth-tone silk, thinner, grinning like men who were not sure of the door.', '해질녘 셋이 솔 대청에서 나온다. 흙빛 비단, 더 야위고, 문을 확신 못 했던 사람들의 웃음.'),
		P('the bow waits on packed earth', 'Years later {{at}}, and the yard is quieter than a feast, which is how this country keeps a death.', '몇 해 뒤 활이 다진 흙 위에서 기다린다. 마당은 잔치보다 조용하다. 이 나라는 그렇게 죽음을 지킨다.')
	]);

	insert(findHtml('Her wealth still buys'), [
		SC('Two Sons', '두 아들'),
		P(
			'Onjo and Biryu watch the well',
			'{{at}} the way other boys watch a hunt. Rope, bucket, their mother’s chin.',
			'온조와 비류가 우물을 본다. 다른 아이들이 사냥을 보듯. 줄, 두레박, 어머니 턱.'
		),
		T('onjo', [
			['Mother’s counting again.', '어머니 또 세.'],
			['I’m staying near the porch.', '난 누대 쪽에 있을게.']
		]),
		T('biryu', [
			['I’m going farther. When I’m bigger.', '난 더 멀리 갈 거야. 크면.'],
			['Don’t tell her I said that.', '어머니한테 말하지 마.']
		])
	]);

	insert(findHtml('He does not ask a question'), [
		P(
			'she keeps the moon',
			'When the chariot takes her, {{at}}. The yard keeps a grave. The sky keeps the sleeve.',
			'수레가 그녀를 태울 때, 그녀가 달을 지킨다. 마당은 무덤을 지킨다. 하늘은 소매를 지킨다.'
		)
	]);
}
