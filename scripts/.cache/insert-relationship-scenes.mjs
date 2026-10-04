// Nangbi flashback (Sword of Silla, Goguryeo's fear, Samguk Sagi quotes) + the three
// relationship beats that had no shared scene: Yongsu & Chunchu, Chunmyung & Chunchu, Sunduk & Jinduk.
// Usage: node scripts/.cache/insert-relationship-scenes.mjs
import { openStory, p, quote, flashback, guard, insertAfter, text } from './story-edit.mjs';

const { entry, say, save } = openStory();

// ——— Nangbi (642 · Kim Yushin) ———
const ky = entry('Kim Yushin');
guard(ky, '我兵敗北');
const nangbi = ky.blocks.find((b) => b.kind === 'flashback' && /Nangbi/.test(b.title ?? ''));
if (!nangbi) throw new Error('Kim Yushin: Nangbi flashback missing');
const fb = nangbi.blocks;
const at = (needle) => {
	const i = fb.findIndex((b) => text(b).includes(needle));
	if (i < 0) throw new Error(`Nangbi: anchor not found: ${needle}`);
	return i;
};

const open = fb[0];
open.html = open.html.replace('the forty-sixth year of King Jinpyeong', 'King Jinpyeong’s fifty-first year');
open.ko = open.ko.replace('진평왕 마흔여섯 해 가을', '진평왕 쉰한 해 가을');

const SRC_BIO = 'Samguk Sagi (三國史記) bk. 41, Biographies — Kim Yushin; Lee Byong-do ed., vol. 2 (Nangbi Fortress, 629)';

fb.splice(
	1,
	0,
	quote(
		'In the eighth month of autumn, in the forty-sixth year of Geonbok, a gichuk year, the king sent the Ichan Im Malli, the Pajinchan Yongchun and Baekryong, and the Sopan Daein and Seohyeon at the head of an army to attack the Goguryeo fortress of Nangbi. The Goguryeo men came out and struck back without warning. Our side was beaten and many died; the men’s spirit was broken, and they had no heart left to fight.',
		'건복 46년 기축(己丑; 629년, 진평왕 51년) 가을 8월에 〔진평〕왕이 이찬(伊飡) 임말리(任末里), 파진찬(波珍飡) 용춘(龍春)·백룡(白龍), 소판(蘇判) 대인(大因)·서현(舒玄) 등을 보내 군사를 거느리고 고구려 낭비성(娘臂城)을 공격하게 하였다. 고구려인들이 군사를 내어 갑자기 습격해와 우리 편이 패하여 죽은 자가 많았고, 군사들[衆]의 사기가 꺾여 다시 싸울 마음이 없었다.',
		'建福四十六年己丑秋八月 王遣伊湌任末里 波珍湌龍春白龍 蘇判大因舒玄等 率兵攻高句麗娘臂城 麗人出兵逆擊之 吾人失利 死者衆多 衆心折衄 無復鬪心',
		SRC_BIO
	)
);

fb.splice(
	at('Let me be that rope and that collar'),
	0,
	quote(
		'Yushin was then captain of the Middle Banner. He went before his father, took off his helmet, and said: “Our army is beaten. All my life I have held myself to loyalty to the country and duty to my parents; facing battle, I cannot fail to be brave.”',
		'유신이 이때 중당당주(中幢幢主)였는데, 아버지 앞에 나아가 투구를 벗고 고하여 말하기를, “우리 군사들이 패하였습니다. 제가 평생 나라에 충성하고 부모에 효도할 것을 스스로 기약하였으니, 전투에 임하여 용맹하지 않을 수 없습니다.”',
		'庾信時爲中幢幢主 進於父前 脫胄而告曰 我兵敗北 吾平生以忠孝自期 臨戰不可不勇',
		SRC_BIO
	)
);

fb.splice(
	at('takes the trench in one jump') + 1,
	0,
	quote(
		'Then he mounted, drew his sword and rode straight at the enemy line. Three times he went in and three times he came out, and each time he went in he either cut down a commander or tore down a banner.',
		'이에 말을 타고 칼을 빼 들고는 적진으로 향하여 곧바로 나아가 세 번 들어가고 세 번 나옴에, 매번 들어갈 때마다 장수의 목을 베고 혹은 깃발을 뽑았다.',
		'乃跨馬拔劒 向敵陣直前 三入三出 每入或斬將或搴旗',
		'Samguk Sagi (三國史記) bk. 4, Silla Annals — King Jinpyeong, year 51 (629)'
	),
	p(
		'He brings it back to the command post and sets it down in the mud in front of his father, wrapped in a torn banner, because he does not know what else a son is supposed to do with a general’s head. The staff officers wait for the speech. Seohyeon looks at the bundle, then at the boy, for long enough that someone coughs.',
		'그는 그것을 지휘소로 가져와 아버지 앞 진흙 위에 내려놓는다. 찢긴 깃발에 싸여 있다. 장군의 머리를 아들이 어떻게 해야 하는지, 그는 모른다. 참모들이 연설을 기다린다. 서현은 보따리를 보고, 아들을 본다. 누군가 헛기침을 할 만큼 오래.'
	),
	say('seohyeon', ['……투구가 비뚤어졌다.'], ['…Your helmet’s crooked.']),
	p(
		'He reaches up and straightens it himself, both hands, the way you fix a boy’s collar before a feast, and then turns away and shouts for his officers before anyone can see his face. It is the most Kim Seohyeon has ever said to his son about anything, and Yushin will carry it longer than the helmet.',
		'그는 손을 뻗어 직접 바로잡는다. 두 손으로, 잔치 전에 아이 옷깃을 매만지듯. 그리고 누가 얼굴을 보기 전에 돌아서서 장교들을 부른다. 김서현이 아들에게 무엇에 대해서든 해 준 말 중 가장 긴 말이다. 유신은 그것을 투구보다 오래 지니고 다닌다.'
	),
	quote(
		'Our soldiers saw it, rode the turn of the battle and threw themselves into the attack. They took more than five thousand heads and a thousand prisoners alive. The people inside the walls were so terrified that none dared resist, and all came out and surrendered.',
		'우리 군사들이 그것을 보고 승세를 타 분발하여 공격하여 5천여 명의 목을 베고 1,000명을 사로잡았다. 성안의 사람들이 몹시 두려워하여 감히 저항하지 못하고 모두 나와 항복하였다.',
		'我軍見之 乘勝奮擊 斬殺五千餘級 生擒一千人 城中兇懼無敢抗 皆出降',
		SRC_BIO
	)
);

fb.push(
	p(
		'The few who get out of Nangbi walk north for nine days with the story, and it grows a little at every well. By Pyongyang the white horse has cleared the trench at a gallop with a general’s head in one hand and a banner in the other, and the man on it has a name the Goguryeo clerks must write down for the first time.',
		'낭비성을 빠져나간 몇 안 되는 자들이 이야기를 들고 아흐레를 북으로 걷는다. 이야기는 우물을 지날 때마다 조금씩 자란다. 평양에 닿을 무렵 흰 말은 한 손에 장군의 머리, 한 손에 깃발을 들고 전속력으로 참호를 넘었고, 그 위의 사내에게는 고구려 서기들이 처음으로 받아 적어야 하는 이름이 생겨 있다.'
	),
	quote(
		'Twelfth year, autumn, the eighth month: the Silla general Kim Yushin invaded the eastern border and broke Nangbi Fortress.',
		'12년 가을 8월, 신라 장군 김유신이 동쪽 변경을 침범하여 낭비성을 함락시켰다.',
		'十二年 秋八月 新羅將軍金庾信 來侵東邊 破娘臂城',
		'Samguk Sagi (三國史記) bk. 20, Goguryeo Annals — King Yeongnyu, year 12 (629)'
	),
	p(
		'In Pyongyang the report is read to the king twice, the second time because he asks for it. At the back of the hall the Yeon heir, twenty-four, stands with his arms folded, the way he stands everywhere.',
		'평양에서 보고는 왕 앞에서 두 번 읽힌다. 두 번째는 왕이 다시 읽으라 해서다. 전각 뒤편에서 연씨 가문의 후계자, 스물넷이 팔짱을 끼고 서 있다. 그는 어디서나 그렇게 선다.'
	),
	say('yeongnyu', ['김유신… 당주라.', '처음 듣는 이름이구나.'], ['Kim Yushin… a banner captain.', 'We have never heard the name.']),
	say(
		'gesomun',
		['또 듣게 될 겁니다.', '놈 하나가 도랑 하나 넘었는데 우리 오천이 드러누웠소. 그게 당주요? 칼이지.', '신라의 칼.'],
		['You’ll hear it again.', 'One man jumps one ditch and five thousand of ours lie down. That’s a captain? That’s a sword.', 'Silla’s sword.']
	),
	p(
		'That is where the name comes from. Not from Surabol, which likes its titles stamped and filed, but from the people he beat: Goguryeo calls him the Sword of Silla first, and means it as a warning. On the eastern border mothers use it for a generation to get children indoors before dark. Thirteen years later, when the Eternal General hears that the same sword is riding for a Silla prince in his prison, he remembers a hall in Pyongyang and a report read twice.',
		'그 이름은 거기서 왔다. 칭호를 도장 찍어 철해 두기 좋아하는 서라벌이 아니라, 그에게 진 사람들에게서. 그를 처음 신라의 칼이라 부른 것은 고구려이고, 경고로 한 말이다. 동쪽 변경의 어미들은 한 세대 내내 해 지기 전에 아이들을 불러들일 때 그 이름을 쓴다. 열세 해 뒤, 그 칼이 감옥에 갇힌 신라 왕자를 찾아 달려오고 있다는 말을 들었을 때, 영원한 장군은 평양의 한 전각과 두 번 읽힌 보고를 떠올린다.'
	)
);

// ——— Yongsu & Chunchu (632 · Queen Sunduk) ———
const qs = entry('Queen Sunduk');
guard(qs, 'laying flat stones across the water');
insertAfter(qs, 'Chunchu’s mother is a Royal, but his father is a Noble', [
	flashback(612, 'The night bridge · 귀교', [
		p(
			'Chunchu is nine. His father wakes him past midnight, which is not unusual, and walks him down to the stream below the palace, which is. Kim Yongsu is the son of the king the Council unmade, and Surabol has a word for him that it only says after he leaves the room. He talks to the dark. He laughs a beat after everyone else. He can add a granary ledger in his head faster than the clerk can read it aloud.',
			'춘추는 아홉 살이다. 아버지가 자정 넘어 그를 깨우는 건 드문 일이 아니다. 궁 아래 개울까지 데리고 내려가는 건 드문 일이다. 김용수는 화백이 끌어내린 왕의 아들이고, 서라벌에는 그가 방을 나간 뒤에야 입에 올리는 말이 하나 있다. 그는 어둠에게 말을 건다. 남들보다 한 박자 늦게 웃는다. 서기가 소리 내어 읽는 것보다 빨리 곳간 장부를 머릿속으로 맞춘다.'
		),
		p(
			'Tonight he is laying flat stones across the water by lamplight, one at a time, as if someone on the far bank were waiting for the bridge to be finished before dawn.',
			'오늘 밤 그는 등불 아래서 납작한 돌을 하나씩 물 위에 놓고 있다. 건너편 기슭의 누군가가 새벽 전에 다리가 끝나기를 기다리고 있기라도 한 것처럼.'
		),
		say('yongsu', ['쉿. 일하는 중이야.', '……아니, 찾지 마. 쳐다보는 거 싫어해. 나처럼.'], ['Shh. They’re working.', '…No, don’t look for them. They hate being looked at. Like me.']),
		say('chunchu', ['아버지… 누가요?'], ['Father… who is?']),
		say(
			'yongsu',
			['네 할아버지가 그 큰 자리에 네 해 앉았다. 세 번 세고 나서, 방이 도로 가져갔지.', '그 방은 자길 즐겁게 해 주는 사람을 먹어.', '그러니까— 그 방엔 들어가지 마. 다른 데 앉아. 다리 위에 앉든가.'],
			['Your grandfather sat in the big chair four years. Three counts, and the room took it back.', 'That room eats the men who amuse it.', 'So— stay out of that room. Sit anywhere else. Sit on the bridge.']
		),
		say('chunchu', ['……그 방 아니면, 사람은 어디 앉아요?'], ['…If not in the room, where does a person sit?']),
		say('yongsu', ['(한 박자 늦게 웃는다)', '방이 너한테 오게 되는 데.'], ['(laughs, a beat late)', 'Wherever the room has to come to you.']),
		p(
			'By morning there is a bridge of flat stones across the stream that nobody in the palace remembers ordering. The servants say goblins. Chunchu, who carried the lamp, says nothing at all, and finds he is good at it.',
			'아침이 되자 개울 위에 납작한 돌다리가 놓여 있다. 궁에서 그걸 시킨 기억이 있는 사람은 없다. 하인들은 도깨비라고 한다. 등불을 들었던 춘추는 아무 말도 하지 않는다. 그리고 자기가 그걸 잘한다는 걸 안다.'
		)
	])
]);

// ——— Chunmyung & Chunchu (642 · Daeya Fortress) ———
const dy = entry('Daeya Fortress');
guard(dy, 'lowers herself down beside him');
insertAfter(dy, 'I am the one who made him swear it.', [
	p(
		'That night his mother finds him in the empty audience hall, sitting on the floor below the dais the way he used to sit there when he was small enough to be overlooked. Princess Chunmyung is sixty-two. She gave up a throne to marry his father and has never once brought it up. She lowers herself down beside him slowly, one hand on his shoulder for the knees, and does not ask how he is.',
		'그날 밤 어머니는 텅 빈 정전에서 그를 찾아낸다. 어좌 단 아래 바닥에 앉아 있다. 눈에 띄지 않을 만큼 작았을 때 거기 앉곤 하던 그대로. 천명 공주는 예순둘이다. 그의 아버지와 혼인하려고 왕위를 내려놓았고, 그 얘기를 꺼낸 적은 한 번도 없다. 그녀는 무릎 때문에 아들 어깨에 한 손을 짚고 천천히 그 옆에 앉는다. 괜찮으냐고 묻지 않는다.'
	),
	say(
		'chunchu',
		['어머니.', '바둑에선 돌 하나 잃으면, 그게 얼마짜리 집이었는지 세요.', '이건… 어디까지가 끝인지 모르겠어요.'],
		['Mother.', 'In go, when you lose a stone, you count the territory it cost.', 'This one… I can’t find the edge of it.']
	),
	say(
		'chunmyung',
		['그럼 세지 마라.', '아홉 살 때부터 세고 있잖니. 네 아버지가 가르쳤고, 난 내버려 뒀지.', '……머리 대. 오늘 밤만. 이 방에선 아직 내가 너보다 크다.'],
		['Then stop counting.', 'You’ve been counting since you were nine. Your father taught you, and I let him.', '…Put your head down. Just tonight. In this hall I’m still bigger than you.']
	),
	p(
		'He does. The most cunning man in Samhan sleeps an hour with his head on his mother’s knee, and in the morning he asks the Queen for a road north.',
		'그는 그렇게 한다. 삼한에서 가장 교활한 사내가 어머니 무릎을 베고 한 시진을 잔다. 그리고 아침에 여왕께 북으로 가는 길을 청한다.'
	)
]);

// ——— Sunduk & Jinduk (647 · Bidam’s Rebellion) ———
const br = entry('Bidam’s Rebellion');
guard(br, 'sits on the edge of the sickbed with a comb');
insertAfter(br, 'Bury me in the Heaven of the Thirty-Three', [
	p(
		'Princess Seungman sits on the edge of the sickbed with a comb, because somebody has to do the Queen’s hair and the maids’ hands shake. They are cousins, five years apart, the last two Sacred Bone women in the world, and they have been doing each other’s hair since the younger one was tall enough to reach.',
		'승만 공주가 빗을 들고 병상 가장자리에 앉는다. 누군가는 여왕의 머리를 해야 하고, 시녀들은 손이 떨린다. 둘은 다섯 살 터울의 사촌, 세상에 남은 마지막 두 성골 여인이고, 동생 쪽 키가 닿을 만해졌을 때부터 서로의 머리를 해 왔다.'
	),
	say('jinduk', ['가만있어, 언니.', '……관자놀이가 많이 비었네. 언제 이렇게 됐어.'], ['Hold still, unni.', '…You’ve gone thin at the temple. When did that happen.']),
	say('sunduk', ['네가 안 볼 때. 다 그때 일어나.', '높이 꽂아. 도리천 가는데 신들보다는 커 보여야지.'], ['While you weren’t looking. That’s when everything happens.', 'Pin it high. If I’m going to the Thirty-Three Heavens I want to look taller than the gods.']),
	say('jinduk', ['그러지 마.', '어디 가는 걸 장 보러 가는 것처럼 말하지 마.'], ['Don’t.', 'Don’t talk about where you’re going like it’s the market.']),
	say('sunduk', ['……승만아. 네가 앉아야 할 거야.', '미안해. 딱딱한 자리야. 방석은 하나 두고 갈게.'], ['…Seungman-ah. You’ll have to sit in it.', 'I’m sorry. It’s a hard chair. I’ll leave you a cushion.']),
	p(
		'Seungman pins the binyeo high, exactly where the Queen asked, and does not answer, which is the only way she has ever won an argument with her.',
		'승만은 여왕이 말한 바로 그 자리, 높이 비녀를 꽂는다. 그리고 대답하지 않는다. 그녀가 언니를 상대로 말다툼에서 이겨 본 방법은 그것뿐이다.'
	)
]);

save();
console.log('inserted: Nangbi expansion, Yongsu & Chunchu, Chunmyung & Chunchu, Sunduk & Jinduk');
