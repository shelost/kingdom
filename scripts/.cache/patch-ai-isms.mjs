import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const pairs = [
	[
		'She begs a man who is not there to make her cum until the words break. She moans into the cave. She yells names at the rock as if volume alone could conjure a body. The rock is wetter than the steam. Her hands shake when she lifts them.',
		'She begs a man who is not there to make her cum until the words break. She moans into the cave. She yells names at the rock. The rock is wetter than the steam. Her hands shake when she lifts them.'
	],
	[
		'없는 남자한테 싸게 해 달라고 빈다. 말이 갈라질 때까지. 동굴에 대고 신음한다. 바위에 대고 이름을 소리친다. 소리만으로 몸이 생길 수 있다면 그렇게라도. 바위가 김보다 젖어 있다. 손을 들 때 손이 떤다.',
		'없는 남자한테 싸게 해 달라고 빈다. 말이 갈라질 때까지. 동굴에 대고 신음한다. 바위에 대고 이름을 소리친다. 바위가 김보다 젖어 있다. 손을 들 때 손이 떤다.'
	],
	[
		'He comes up in a bowl of black water under stone that has a rule he does not know yet.',
		'He comes up in a bowl of black water under stone. The spring has a rule. He will learn it.'
	],
	[
		'돌 아래 검은 물의 사발에서 올라온다. 아직 법이 있는 줄 모른다.',
		'돌 아래 검은 물의 사발에서 올라온다. 샘에 법이 있다. 그는 나중에 배운다.'
	],
	[
		'He does not step out of the water. He stands as if the black bowl were a wall he is holding in front of himself. It is not a wall. The spring does not hide much. He forgets the horse.',
		'He does not step out of the water. He holds the black bowl in front of his chest and it covers almost nothing. The spring is cold on him. He forgets the horse.'
	],
	[
		'물 밖으로 나오지 않는다. 검은 사발이 제 앞에 세운 벽인 것처럼 선다. 벽이 아니다. 샘이 감춰 주는 게 없다. 말을 잊는다.',
		'물 밖으로 나오지 않는다. 검은 사발을 가슴 앞에 들고 서 있어도 가려지는 게 거의 없다. 샘물이 차다. 말을 잊는다.'
	],
	[
		'They tease him first — centuries of hunger looking at grey temples as if age were a joke they could still tell out loud. Golhwa loudest. Narim cutting. Hyullé almost silent, which is worse.',
		'They tease him first. Grey temples, centuries of hunger. Golhwa loudest. Narim cutting. Hyullé almost silent.'
	],
	[
		'먼저 놀린다 — 회색 관자놀이를 보고 수백 년 허기가 나이를 아직도 큰 소리로 말할 수 있는 농담처럼 여긴다. 골화가 제일 시끄럽다. 나림은 짧게 자른다. 휼레는 거의 말이 없고, 그게 더 나쁘다.',
		'먼저 놀린다. 회색 관자놀이, 수백 년 허기. 골화가 제일 시끄럽다. 나림은 짧게 자른다. 휼레는 거의 말이 없다.'
	],
	[
		'She collapses on his wet chest. Spent. Trembling. Messy hair. Hiked chima still open over his lap, him still inside, his cum already leaking around the cock she will not let out, into the black bowl. Possessive even wrecked — arms locked, thighs locked, as if the sisters could steal the night by breathing.',
		'She collapses on his wet chest. Spent. Trembling. Messy hair. Hiked chima still open over his lap, him still inside, his cum already leaking around the cock she will not let out, into the black bowl. Arms locked, thighs locked. She will not give the night back.'
	],
	[
		'젖은 가슴에 쓰러진다. 다 씀. 떨림. 헝클어진 머리. 걷힌 치마가 아직 무릎 위에 열려 있고, 그는 아직 안에, 빼지 못하게 붙든 그 주위로 벌써 흘러 검은 사발로 간다. 망가져도 소유욕 — 팔이 잠기고 허벅지가 잠긴다. 숨을 쉬는 것만으로도 자매가 이 밤을 훔칠 수 있을 것처럼.',
		'젖은 가슴에 쓰러진다. 다 씀. 떨림. 헝클어진 머리. 걷힌 치마가 아직 무릎 위에 열려 있고, 그는 아직 안에, 빼지 못하게 붙든 그 주위로 벌써 흘러 검은 사발로 간다. 팔이 잠기고 허벅지가 잠긴다. 이 밤은 안 돌려준다.'
	],
	[
		'A sound finally leaves her. It is not a lesson. It is not a laugh. It is the first honest thing she has said since the plum.',
		'A sound finally leaves her — small, wrecked, nothing she meant to give him. Since the plum she has been teaching. This is just a sound.'
	],
	[
		'드디어 소리가 나온다. 수업이 아니다. 웃음이 아니다. 자두 이후로 처음 하는 진짜 말이다.',
		'드디어 소리가 나온다. 작고, 망가지고, 주려고 했던 게 아니다. 자두 이후로 그녀는 가르쳐 왔다. 이건 그냥 소리다.'
	],
	[
		'He is quoting her. He will keep quoting her for the eighteen years he has left, and he will be executed in Sabi by a king who does not know he is watching a marriage end.',
		'He is quoting her. He will keep quoting her for the eighteen years he has left, until a king in Sabi has him killed.'
	],
	[
		'아내의 말을 옮기는 것이다. 남은 십팔 년 동안 그는 계속 그 말을 옮길 것이고, 한 혼인이 끝나는 것을 보고 있는 줄 모르는 왕의 손에 사비에서 처형될 것이다.',
		'아내의 말을 옮기는 것이다. 남은 십팔 년 동안 그는 계속 그 말을 옮길 것이고, 사비의 왕이 그를 죽일 때까지 그럴 것이다.'
	],
	[
		'The air thins. A man who was not in the fortress is suddenly in the fortress — ledger under one arm, crow-dark robe, the polite distance of a messenger from another kingdom: the underworld’s, whose king is <b>Yumla</b>.',
		'A man who was not in the fortress is suddenly in the fortress, ledger under one arm, crow-dark robe, standing the polite distance of a messenger. The underworld’s. Whose king is <b>Yumla</b>.'
	],
	[
		'공기가 옅어진다. 성에 없던 사내가 갑자기 성 안에 있다 — 한쪽 팔에 명부, 까마귀빛 도포, 다른 나라 사신의 공손한 거리. 그 나라는 저승이고, 임금은 <b>염라</b>다.',
		'성에 없던 사내가 갑자기 성 안에 있다. 한쪽 팔에 명부, 까마귀빛 도포, 사신처럼 한 걸음 물러선 거리. 저승에서 온 것이다. 임금은 <b>염라</b>다.'
	],
	[
		'After Daeya, the Sword of Silla does not sleep in the capital. He rides to the cavern as if the steam could wash a year off his hands, and strips at the lip of the rock without looking up — no need to look; he already knows who will be there. Narim, Golhwa, Hyullé. The same three who named themselves to him before the fortress fell.',
		'After Daeya, the Sword of Silla does not sleep in the capital. He rides to the cavern and strips at the lip of the rock without looking up. Narim, Golhwa, Hyullé. The same three who named themselves to him before the fortress fell.'
	],
	[
		'대야 뒤, 신라의 도검은 도읍에서 자지 않는다. 김이 손에서 한 해를 씻어 주기라도 할 것처럼 동굴로 달려가, 올려다보지도 않고 바위 끝에서 옷을 벗는다 — 볼 필요가 없다. 누가 있을지 이미 아니까. 나림, 골화, 혈레. 성이 무너지기 전에 제 이름을 알려 준 바로 그 셋.',
		'대야 뒤, 신라의 도검은 도읍에서 자지 않는다. 동굴로 달려가, 올려다보지도 않고 바위 끝에서 옷을 벗는다. 나림, 골화, 혈레. 성이 무너지기 전에 제 이름을 알려 준 바로 그 셋.'
	],
	[
		'He stops smiling. Not angry — done asking the buckets to speak for her. He unslings the bow and lays it on the packed earth at the well-rim, as if the yard could keep it better than a mouth that will not. Then he walks. <b>He leaves the bow on packed earth.</b>',
		'He stops smiling. He is done asking the buckets to speak for her. He unslings the bow and lays it on the packed earth at the well-rim. Then he walks. <b>He leaves the bow on packed earth.</b>'
	],
	[
		'웃음을 접는다. 화가 아니다 — 두레박이 대신 말해주길 그만둔다. 활을 풀어 우물 가 다진 흙 위에 놓는다. 입이 안 지키는 것을 마당이 지키라는 듯이. 그리고 걷는다. <b>활을 다진 흙 위에 두고 간다.</b>',
		'웃음을 접는다. 두레박이 대신 말해주길 그만둔다. 활을 풀어 우물 가 다진 흙 위에 놓는다. 그리고 걷는다. <b>활을 다진 흙 위에 두고 간다.</b>'
	],
	[
		'That is the mortal last line. The body finishes falling after the name does.',
		'The body finishes falling after the name does.'
	],
	[
		'그것이 인간의 마지막 말줄이다. 몸은 이름보다 늦게 쓰러진다.',
		'몸은 이름보다 늦게 쓰러진다.'
	],
	[
		'The great emperor is given a temple name — <b>Taizong</b> — as if greatness could be nailed to a single character and made to stay.',
		'The great emperor is given a temple name — <b>Taizong</b>. The clerks write it in the register and close the book.'
	],
	[
		'위대한 황제에게 묘호 <b>태종</b>이 올려진다. 위대함을 한 글자에 못 박아 붙들어 둘 수 있다는 듯이.',
		'위대한 황제에게 묘호 <b>태종</b>이 올려진다. 서리가 등록부에 쓰고 책을 덮는다.'
	],
	[
		'<b>King Euija (49)</b> grows more watchful of the Great Clans — as if the West’s new silence were a sound that could travel.',
		'<b>King Euija (49)</b> grows more watchful of the Great Clans. Tang has gone quiet, and quiet from that direction rarely stays put.'
	],
	[
		'<b>의자왕 (49)</b>은 대성팔족을 더욱 경계한다. 서쪽의 새 고요함이 소리처럼 건너올 수 있다는 듯이.',
		'<b>의자왕 (49)</b>은 대성팔족을 더욱 경계한다. 당이 조용해졌고, 그쪽에서 오는 조용함은 오래 머물지 않는다.'
	],
	[
		'He drills in units of five hundred. He does not know yet why five hundred, and in four years’ time he will stand in a field with exactly ten of them and no more, and the number will be the only thing about that day that does not surprise him.',
		'He drills in units of five hundred. Four years from now he will take ten of those units to a field and leave the rest behind. The count is already in his mouth.'
	],
	[
		'그는 오백을 한 단위로 훈련한다. 아직 왜 오백인지는 모른다. 사 년 뒤 그는 그것 열 개를 데리고, 그 이상은 없이 어느 벌판에 설 것이다. 그날 그를 놀라게 하지 않는 유일한 것이 그 숫자일 것이다.',
		'그는 오백을 한 단위로 훈련한다. 사 년 뒤 그는 그것 열 개를 벌판으로 데려가고 나머지는 남겨 둘 것이다. 숫자는 이미 입에 있다.'
	],
	[
		'He keeps a shaman on retainer the way other kings keep song-girls — not because he believes the sky talks, but because watching someone else believe it is the best theatre in Sabi. He has told Gyebek the gods are cheap civil servants; he has told Gesomun the same with wine on his breath. The shaman does not know he is an atheist. She thinks he is frightened. Both readings amuse him.',
		'He keeps a shaman on retainer the way other kings keep song-girls. He likes watching someone else believe the sky talks; he has told Gyebek the gods are cheap civil servants, and told Gesomun the same with wine on his breath. The shaman thinks he is frightened. He lets her.'
	],
	[
		'그는 다른 임금들이 가창꾼을 두듯 무당을 둔다 — 하늘이 말한다 믿어서가 아니라, 믿는 사람을 지켜보는 것이 사비에서 가장 재미 있는 연극이라서. 계백에게는 신을 값싼 관리라 했고, 개소문에게도 술 취해 같은 말을 했다. 무당은 그가 무신론자인 줄 모른다. 겁먹었다고 생각한다. 두 해석 모두 그를 즐겁게 한다.',
		'그는 다른 임금들이 가창꾼을 두듯 무당을 둔다. 하늘이 말한다고 믿는 사람을 보는 재미가 있다. 계백에게는 신을 값싼 관리라 했고, 개소문에게도 술 취해 같은 말을 했다. 무당은 그가 겁먹었다고 생각한다. 그는 그냥 둔다.'
	],
	[
		'The blade is out before the last word cools. He cuts her down where she sits — as if killing the mouth could kill the meaning.',
		'The blade is out before the last word cools. He cuts her down where she sits. The turtle’s sentence stays in the room.'
	],
	[
		'마지막 말이 식기 전에 칼이 나온다. 그는 그가 앉은 자리에서 벤다 — 입을 죽이면 뜻도 죽을 것처럼.',
		'마지막 말이 식기 전에 칼이 나온다. 그는 그가 앉은 자리에서 벤다. 거북의 말은 방에 남는다.'
	],
	[
		'The hall does not know he is naming a kingdom three centuries away. Later men will call it Later Baekje, and put a different crown on it, and argue whether the name counts. He is only shouting at the man who won.',
		'He is shouting at the man who won. Later men will call it Later Baekje, put a different crown on it, and argue whether the name counts.'
	],
	[
		'전각은 그가 세 세기 뒤의 나라를 부르고 있음을 모른다. 후대는 후백제라 부르고, 다른 왕관을 얹고, 그 이름이 세는지 다툰다. 그는 이긴 사내에게만 고함치고 있을 뿐이다.',
		'그는 이긴 사내에게 고함친다. 후대는 후백제라 부르고, 다른 왕관을 얹고, 그 이름이 세는지 다툰다.'
	],
	[
		'<i>The charge against him is that he brought a foreign army onto Samhan soil, and the charge is true. He knew it was true while he was doing it. He did it anyway, and then spent the rest of his life teaching his son how to get them out again — which is not absolution, but it is not nothing either.</i>',
		'<i>The charge against him is that he brought a foreign army onto Samhan soil, and the charge is true. He knew it while he was doing it. He did it anyway, and spent the rest of his life teaching his son how to get them out again.</i>'
	],
	[
		'<i>그를 향한 죄목은 삼한의 땅으로 외세를 끌어들였다는 것이고, 그 죄목은 사실이다. 그는 그렇게 하는 동안에도 그것이 사실임을 알고 있었다. 그래도 했고, 남은 평생을 아들에게 그들을 다시 몰아내는 법을 가르치며 보냈다. 그것이 사면은 아니지만, 아무것도 아닌 것도 아니다.</i>',
		'<i>그를 향한 죄목은 삼한의 땅으로 외세를 끌어들였다는 것이고, 그 죄목은 사실이다. 그는 그렇게 하는 동안에도 알고 있었다. 그래도 했고, 남은 평생을 아들에게 그들을 다시 몰아내는 법을 가르치며 보냈다.</i>'
	],
	[
		'Upriver at Juryu, <b>King Pungjang</b> still believes a kingdom can be restored by enough sails. The East has sent him nearly eight hundred ships and some forty-two thousand men — Echi no Takutsu among the captains who still say <i>Kudara</i> as if the old name could float. They come down on the eighth month’s water, packed too tight for oars, shouting for a victory the tide has already priced differently.',
		'Upriver at Juryu, <b>King Pungjang</b> still believes a kingdom can be restored by enough sails. The East has sent him nearly eight hundred ships and some forty-two thousand men — Echi no Takutsu among the captains who still say <i>Kudara</i>. They come down on the eighth month’s water, packed too tight for oars, shouting for a victory the tide has already priced differently.'
	],
	[
		'상류 주류에서 <b>풍장왕</b>은 아직, 배가 충분하면 나라를 되돌릴 수 있다고 믿는다. 왜는 거의 팔백 척과 사만 이천을 보내 주었다 — 에치노 다쿠쓰처럼 옛 이름 <i>쿠다라</i>를, 띄울 수 있다는 듯 부르는 장수들과 함께. 그들은 팔월의 물을 타고 내려온다. 노를 젓기엔 너무 빽빽하고, 밀물이 이미 다른 값으로 매긴 승리를 외친다.',
		'상류 주류에서 <b>풍장왕</b>은 아직, 배가 충분하면 나라를 되돌릴 수 있다고 믿는다. 왜는 거의 팔백 척과 사만 이천을 보내 주었다 — 에치노 다쿠쓰처럼 옛 이름 <i>쿠다라</i>를 아직 입에 올리는 장수들과 함께. 그들은 팔월의 물을 타고 내려온다. 노를 젓기엔 너무 빽빽하고, 밀물이 이미 다른 값으로 매긴 승리를 외친다.'
	],
	[
		'In the worst hour of the fighting — arrows spent, horse down, a Tang blade a finger from his throat — the air thins the way Tamla stories promised. <b>Kangrim</b> and <b>Haewonmek</b> are simply there, hovering as if courtesy required altitude, ledger half-open between them.',
		'In the worst hour of the fighting — arrows spent, horse down, a Tang blade a finger from his throat — the air thins the way Tamla stories promised. <b>Kangrim</b> and <b>Haewonmek</b> are there. Ledger half-open between them.'
	],
	[
		'싸움의 가장 나쁜 시각 — 화살 떨어지고 말 쓰러지고 당의 칼이 목에서 손가락 하나 간격일 때 — 탐라 이야기가 약속한 대로 공기가 옅어진다. <b>강림</b>과 <b>해원맥</b>이 그냥 있다. 예의가 고도를 요구한다는 듯 떠 있고, 명부는 둘 사이에서 반쯤 열려 있다.',
		'싸움의 가장 나쁜 시각 — 화살 떨어지고 말 쓰러지고 당의 칼이 목에서 손가락 하나 간격일 때 — 탐라 이야기가 약속한 대로 공기가 옅어진다. <b>강림</b>과 <b>해원맥</b>이 있다. 명부는 둘 사이에서 반쯤 열려 있다.'
	],
	[
		'The air thins the way it thinned at the Snake River. He expects one of them — Kangrim with his Question, or Haewonmek with his last words. He has been rehearsing a refusal.',
		'He expects one of them — Kangrim with his Question, or Haewonmek with his last words. He has been rehearsing a refusal.'
	],
	[
		'살수에서처럼 공기가 옅어진다. 그는 둘 중 하나를 기대한다 — 물음을 든 강림, 아니면 유언을 묻는 해원맥. 거절할 대사는 이미 연습해 두었다.',
		'그는 둘 중 하나를 기대한다. 물음을 든 강림, 아니면 유언을 묻는 해원맥. 거절할 대사는 이미 연습해 두었다.'
	],
	[
		'The boy stops in the millet. Wind moves the crowns of the grain the way banners used to move. He presses the cloth once, as if the three-legged crow could still hear through gold, and answers the empty north the only way the chronicle will keep.',
		'The boy stops in the millet. Wind moves the crowns of the grain the way banners used to move. He presses the cloth once, gold crow against his palm, and answers the empty north the only way the chronicle will keep.'
	],
	[
		'아이는 조밭 한가운데 선다. 바람이 곡식 이삭을 예전 깃발처럼 움직인다. 천을 한 번 누르며 — 삼족오가 금 너머로도 들을 수 있다는 듯 — 빈 북쪽을 사가가 기억할 유일한 방식으로 대답한다.',
		'아이는 조밭 한가운데 선다. 바람이 곡식 이삭을 예전 깃발처럼 움직인다. 천을 한 번 누른다. 금 까마귀가 손바닥에 있다. 빈 북쪽을 사가가 기억할 유일한 방식으로 대답한다.'
	],
	[
		'He goes quiet between the two names, as if the war had always been a sentence with two subjects, and he has finally finished saying both.',
		'He goes quiet between the two names. The room still knows him as Chunchu. The ledger has already written Muyeol.'
	],
	[
		'두 이름 사이에서 그가 고요해진다. 전쟁이 처음부터 주어가 둘인 문장이었고, 그가 이제야 둘 다 말해 마친 것처럼.',
		'두 이름 사이에서 그가 고요해진다. 방은 여전히 그를 춘추로 안다. 명부에는 이미 무열이 적혀 있다.'
	]
];

function walk(blocks, stats) {
	for (const b of blocks ?? []) {
		if (b.kind === 'flashback' && b.blocks) walk(b.blocks, stats);
		for (const key of ['html', 'ko']) {
			if (typeof b[key] !== 'string') continue;
			for (const [from, to] of pairs) {
				if (b[key] === from) {
					b[key] = to;
					stats.n++;
				}
			}
		}
		if (Array.isArray(b.en) && Array.isArray(b.lines)) {
			const enJoin = b.en.join('\n');
			const koJoin = b.lines.join('\n');
			if (enJoin.includes('were you saving the country, or saving the version')) {
				b.en = [
					'Councillor — before the minutes close.',
					'The opposite kite. What do you want written?'
				];
				b.lines = ['상대등 — 회의록을 닫기 전에.', '반대편 연. 뭐라고 적을까요?'];
				stats.n++;
			}
			if (enJoin.includes('I needed to be necessary')) {
				b.en = [
					'…Write that I flew it.',
					'The rest they can guess.',
					'Tell the sacred country I loved it badly.'
				];
				b.lines = ['…띄웠다고 적으시오.', '나머지는 제 알아서 짐작하겠지.', '신국에 전하게 — 나는 서툴게 사랑했다고.'];
				stats.n++;
			}
			if (enJoin.includes('manufacturing a miracle')) {
				b.en = [
					'Eraha.',
					'The boy at the White River. The name you gave him is still in the ledger.'
				];
				b.lines = ['어라하.', '백강의 아이. 당신이 준 이름이 아직 명부에 있습니다.'];
				stats.n++;
			}
			if (enJoin.includes('The miracle was the cheap part')) {
				b.en = ['…A friend.', 'Put the miracle on the cheap side of the page.'];
				b.lines = ['…친구.', '기적은 싼 칸에 적으시오.'];
				stats.n++;
			}
			if (enJoin.includes('ending the kind of country that argues')) {
				b.en = [
					'King Muyeol.',
					'We have met before — in your daughter’s eyes, if not in yours.',
					'Your son is packing. The West is already in the hall.'
				];
				b.lines = [
					'무열왕.',
					'우리는 만난 적 있습니다 — 당신 눈이 아니라 따님의 눈에서.',
					'아들은 짐을 싸고 있습니다. 서쪽은 이미 전각 안에 있습니다.'
				];
				stats.n++;
			}
			if (enJoin.includes('That is my crime, and my gift to my son')) {
				b.en = [
					'…I know.',
					'I saw a room where they all absolutely obeyed one man — no matter what.',
					'I never un-saw it. Tell Bupmin the packing list is his.'
				];
				b.lines = [
					'…아오.',
					'한 사람에게 — 무슨 일이 있어도 — 모두가 절대 복종하는 방을 보았소.',
					'그걸 언-보지는 못했소. 법민에게 전하게. 짐 목록은 이제 그의 것이오.'
				];
				stats.n++;
			}
		}
	}
}

const stats = { n: 0 };
for (const ch of story) {
	for (const en of ch.entries ?? []) walk(en.blocks, stats);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('replacements', stats.n);
