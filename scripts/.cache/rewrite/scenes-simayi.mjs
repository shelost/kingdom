/**
 * Scenes pass: #32 "Sima Yi" (238) as a straight episode (no Tang frame), and a light consistency fix in #34 "Boiling River".
 * alliance → the Western Chancellor rumour → reveal → the rain → the board → Lord Gongsun at the river → the vow at the ford.
 * Idempotent: `node scripts/.cache/rewrite/scenes-simayi.mjs` (`DRY=1` to test).
 */
import { editStory, find } from '../story-ops.mjs';

const MARK = 'the Western Chancellor';

const P = (html, ko) => ({ kind: 'p', html, ko });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
const CHIP = { simayi: '#4a4f63', gongsunyuan: '#a08040', dongchun: '#C30000' };
const zhOf = (zh, zhLatn) => (zh ? { zh, zhLatn } : {});
const D = (person, en, ko, zh, zhLatn, extra = {}) => ({ kind: 'dialogue', chip: CHIP[person] ?? '#8a8a94', person, ...extra, lines: ko, en, ...zhOf(zh, zhLatn) });
const S = (speaker, chip, en, ko, zh, zhLatn) => ({ kind: 'dialogue', speaker, gender: 'm', chip, lines: ko, en, ...zhOf(zh, zhLatn) });

const SY = (en, ko, zh, zhLatn) => D('simayi', en, ko, zh, zhLatn);
const SYX = (en, ko, zh, zhLatn) => D('simayi', en, ko, zh, zhLatn, { look: 'chancellor' });
const DC = (en, ko, zh, zhLatn) => D('dongchun', en, ko, zh, zhLatn);
const GS = (en, ko, zh, zhLatn) => D('gongsunyuan', en, ko, zh, zhLatn, { look: 'lord' });
const CAP = (en, ko) => S('The captain', '#7a6b5a', en, ko);
const SEC = (en, ko, zh, zhLatn) => S('The secretary', '#6b7480', en, ko, zh, zhLatn);
const TRADER = (en, ko) => S('The horse trader', '#8d7a62', en, ko);
const MIN = (en, ko) => S('The old minister', '#8d8d95', en, ko);
const WEI = (speaker, en, ko, zh, zhLatn) => S(speaker, '#7d6a58', en, ko, zh, zhLatn);

const blocks = [
	P(
		'Every kingdom keeps one neighbour it hates more than any empire. Goguryeo’s has a family name.',
		'나라마다 어느 제국보다 더 미운 이웃이 하나씩 있다. 고구려의 그 이웃에겐 성씨가 붙어 있다.'
	),
	P(
		'Gongsun. Three Lords Gongsun in a row have sat in Liaodong, between Goguryeo and the West, like a fat man in a doorway. One of them burned a Goguryeo capital. Another took in a Goguryeo prince who wanted his brother’s throne, and fed him soldiers. The one sitting there now sends silk in spring and spies in autumn. Lately he calls himself a king.',
		'공손. 공손씨 영주가 삼대째 요동에 앉아 있다. 고구려와 서쪽 사이, 문간을 막고 앉은 뚱뚱한 사내처럼. 하나는 고구려의 도읍을 불태웠다. 또 하나는 형의 왕좌를 탐내던 고구려 왕자를 받아 주고 군사까지 먹였다. 지금 앉아 있는 자는 봄엔 비단을, 가을엔 첩자를 보낸다. 요즘은 스스로를 왕이라 부른다.'
	),
	SCENE('Hwando · spring', '환도 · 봄'),
	{
		kind: 'map',
		year: 238,
		places: ['hwando', 'liao', 'yodong'],
		caption: 'The West, the hills, and in the doorway between them, Lord Gongsun.',
		ko: '서쪽, 산골, 그리고 그 사이 문간에 앉은 공손씨.'
	},
	P(
		'In a mountain capital that smells of pine smoke, a young king is listening to a horse trader lie, and enjoying it.',
		'솔 연기 냄새가 나는 산속 도읍에서, 젊은 왕이 말장수의 허풍을 듣고 있다. 아주 즐겁게.'
	),
	{
		kind: 'card',
		person: 'dongchun',
		caption: 'Young, proud, and fond of any war he can win from the saddle. So far, that has been all of them.',
		ko: '젊고, 콧대 높고, 말 위에서 이길 수 있는 전쟁이라면 다 좋아한다. 지금까지는 전부 그랬다.'
	},
	TRADER(
		[
			'So the southern genius, the one with the fan, he sits outside this old man’s fort a hundred days.',
			'Sends him a lady’s dress. In a box. With a ribbon on.',
			'Says, come out and fight, or wear this.'
		],
		['그래 그 남쪽 천재 말이우, 부채 든 양반. 그 양반이 늙은이 성 앞에 백 날을 앉아 있었다 이거요.', '그러구는 늙은이한테 여편네 치마를 보냈디요. 함에 넣어서. 끈까지 매서.', '나와서 싸우든지, 이걸 입든지 하라구.']
	),
	DC(['And?'], ['그래서?']),
	TRADER(
		['He puts it on, Majesty.', 'Thanks the man for the gift. Says it fits.', 'And he doesnae come out. Not that day, not the next. A hundred days the genius waits, and then the genius dies.'],
		['입었답니다, 전하.', '선물 고맙다 하구. 꼭 맞는다 하구.', '그러구 안 나왔디요. 그날도, 그다음 날도. 천재가 백 날을 기다리다가, 천재가 먼저 죽었시요.']
	),
	P(
		'The hall laughs. The king laughs loudest, then stops halfway, and asks the only question a king cares about.',
		'대전이 웃음바다가 된다. 왕이 제일 크게 웃다가, 중간에 멈추고, 임금이 궁금해할 만한 단 하나를 묻는다.'
	),
	DC(['What’s his name?'], ['그자 이름이 뭐냐?']),
	TRADER(
		['Out west nobody says it, Majesty. Bad luck.', 'They call him the Western Chancellor. Like he’s weather.'],
		['서쪽에선 아무도 그 이름을 입에 안 올려요, 전하. 재수 없다구.', '그냥 서쪽 승상이라구 부르디요. 무슨 날씨 부르듯이.']
	),
	P(
		'The trader has never been within five hundred li of the man. Nobody in this hall has. That is how legends travel: on horseback, with the price going up at every stop.',
		'말장수는 그 사내 근처 오백 리 안에도 가 본 적이 없다. 이 대전의 누구도 마찬가지다. 전설은 원래 그렇게 다닌다. 말을 타고, 들르는 데마다 값이 오르면서.'
	),
	P(
		'Then a letter comes from the West. It has a seal and no name, and it turns out the legend wants something.',
		'그러다 서쪽에서 편지 한 통이 온다. 인장은 찍혔는데 이름은 없다. 그리고 그 전설이 뭔가를 원한다는 게 드러난다.'
	),
	DC(
		['Wei is marching on Lord Gongsun.', 'Wei would welcome friends. Friends. Look, he wrote it twice.'],
		['위가 공손씨를 치러 간단다.', '벗이 있으면 반갑겠다는군. 벗. 봐라, 두 번이나 썼다.']
	),
	MIN(
		['Majesty, Wei is a thousand li away. Lord Gongsun is next door.', 'If Wei loses, he will remember who—'],
		['전하, 위는 천 리 밖이옵고 공손씨는 바로 옆집이옵니다.', '위가 지면, 공손씨는 누가 누구 편을 들었는지—']
	),
	DC(
		['—who burned my father’s city? I remember that too.', 'Help the far one kill the near one. That’s not strategy. That’s housekeeping.'],
		['—누가 아버님 도성을 태웠는지? 그건 나도 기억한다.', '먼 놈 도와서 가까운 놈 치는 거다. 병법이랄 것도 없어. 집안 청소지.']
	),
	DC(['Saddle a thousand. I’m going.', 'I want to see this man in a dress.'], ['천 기 안장 얹어라. 내가 간다.', '치마 입은 그 사내, 내 눈으로 좀 봐야겠다.']),
	MIN(['Majesty, a king does not ride out himself to—'], ['전하, 임금께서 몸소 나가시는 법은—']),
	DC(['This one does. Somebody find me a captain who can count.'], ['이 임금은 나간다. 누가 셈할 줄 아는 대장 하나 데려와.']),
	P(
		'They find him one. A young captain who can count, ride, and keep his mouth shut, which is two more skills than the king asked for. Nobody tells the king his name. The king doesn’t ask.',
		'하나 찾아온다. 셈도 하고 말도 타고 입도 무거운 젊은 대장. 왕이 바란 것보다 재주가 둘이나 더 많다. 아무도 왕에게 그의 이름을 일러 주지 않는다. 왕도 묻지 않는다.'
	),

	SCENE('The Liao · summer', '요하 · 여름'),
	P(
		'The Wei camp is the first thing the king has seen that is bigger than a mountain and flatter than a lake. Forty thousand men, and every one of them is digging.',
		'위나라 진영은 왕이 난생처음 보는, 산보다 크고 호수보다 납작한 물건이다. 사만 명이 있고, 그 하나하나가 땅을 파고 있다.'
	),
	P(
		'Everywhere the Goguryeo thousand ride, the Western Chancellor has just left. He was at the ford this morning. He was at the ditch by noon. He has looked at this hill. He did not like it.',
		'고구려의 천 기가 가는 곳마다, 서쪽 승상은 방금 떠나고 없다. 아침엔 나루에 있었다. 한낮엔 도랑에 있었다. 이 언덕도 보고 갔다. 마음에 안 들었다고 한다.'
	),
	WEI(
		'Wei soldier',
		['The old man walked the ditch again. Measured it with his feet.', 'Says it’s two fingers too shallow.'],
		['영감님이 또 도랑을 걸으셨어. 발로 재 보시더라.', '두 손가락만큼 얕대.'],
		['老頭子又來走了一遍溝，用腳量的。', '說淺了兩指。'],
		['Lǎotóuzi yòu lái zǒu le yí biàn gōu, yòng jiǎo liáng de.', 'Shuō qiǎn le liǎng zhǐ.']
	),
	WEI(
		'Another digger',
		['Two fingers. He can see two fingers from a horse?'],
		['두 손가락? 말 위에서 그게 보인대?'],
		['兩指？他騎在馬上看得見兩指？'],
		['Liǎng zhǐ? Tā qí zài mǎ shàng kàn de jiàn liǎng zhǐ?']
	),
	WEI(
		'Wei soldier',
		['He saw the man with the fan coming five years off. He can see two fingers.', 'Dig.'],
		['부채 든 그 양반 오는 걸 다섯 해 전에 내다보신 분이야. 두 손가락쯤이야.', '파기나 해.'],
		['拿扇子的那位要來，他五年前就看見了。兩指算什麼。', '挖。'],
		['Ná shànzi de nà wèi yào lái, tā wǔ nián qián jiù kànjiàn le. Liǎng zhǐ suàn shénme.', 'Wā.']
	),
	CAP(
		['Majesty, that’s the third camp he’s “just left”.', 'Either he’s a ghost or he doesnae want to meet us.'],
		['전하, 방금 떠났다는 진이 이걸로 세 번째입니다.', '귀신이든지, 우릴 안 만나구 싶든지 둘 중 하나디요.']
	),
	DC(['Or he wants us to come and find him. Which is worse.', 'Where’s his tent?'], ['아니면 우리더러 찾아오라는 거지. 그게 더 고약하다.', '그자 막사가 어디냐?']),
	P(
		'His tent is the plain one. No banner on it, no guard worth the name, and an argument going on inside.',
		'그의 막사는 제일 수수한 것이다. 깃발도 없고, 이렇다 할 호위도 없고, 안에서는 말다툼이 한창이다.'
	),

	SCENE('The plain tent', '수수한 막사'),
	P(
		'The king stops outside the canvas. He has more Han than he lets on, and tonight, for once, it is useful.',
		'왕은 천막 밖에서 걸음을 멈춘다. 그는 남들이 아는 것보다 한어를 잘한다. 오늘 밤엔 모처럼 그게 쓸모가 있다.'
	),
	SEC(
		['Grand Commandant, with respect. Shouldn’t we be fighting Liu Bei’s people?', 'Zhuge Liang—'],
		['태위 각하, 외람되오나. 우리가 칠 상대는 유비 쪽 무리가 아닙니까?', '제갈량이—'],
		['太尉，恕下官直言。我們該打的，不是劉備那邊的人嗎？', '諸葛亮——'],
		['Tàiwèi, shù xiàguān zhíyán. Wǒmen gāi dǎ de, bú shì Liú Bèi nà biān de rén ma?', 'Zhūgě Liàng——']
	),
	SYX(
		['—is dead. He’d laugh at you.', 'Before he came north at me, he went south. Beat the southern barbarians seven times, until they stayed beaten.', 'Then he came north with nothing at his back.'],
		['—죽었네. 살았으면 자네를 비웃었을 걸세.', '그 사람은 나를 치러 북으로 오기 전에 먼저 남으로 갔네. 남쪽 오랑캐를 일곱 번 꺾었지. 다시는 안 일어날 때까지.', '그러고 나서야 등 뒤를 비워 두고 북으로 왔네.'],
		['——死了。他若在，會笑你。', '他北上打我之前，先南征。南蠻七擒七縱，打到服為止。', '然後才北上，背後空無一物。'],
		['——Sǐ le. Tā ruò zài, huì xiào nǐ.', 'Tā běishàng dǎ wǒ zhīqián, xiān nánzhēng. Nánmán qī qín qī zòng, dǎ dào fú wéizhǐ.', 'Ránhòu cái běishàng, bèihòu kōng wú yí wù.']
	),
	SEC(['So…'], ['그러면…'], ['那麼……'], ['Nàme……']),
	SYX(
		['So. He took the south. I’ll take the east.', 'The doorway first. Then whatever is behind the doorway.'],
		['그러니까. 그 사람이 남쪽을 치웠으니, 나는 동쪽을 치우겠네.', '먼저 문간. 그다음엔 문간 뒤에 있는 것.'],
		['所以。他取南，我取東。', '先取門口。再取門後的。'],
		['Suǒyǐ. Tā qǔ nán, wǒ qǔ dōng.', 'Xiān qǔ ménkǒu. Zài qǔ mén hòu de.']
	),
	SEC(
		['Behind the doorway is Goguryeo, Grand Commandant. Our ally.', 'Their king is meant to arrive today, in fact—'],
		['문간 뒤는 고구려입니다, 각하. 우리 동맹이고요.', '실은 그 왕이 오늘 도착하기로—'],
		['門後是高句麗，太尉。是我們的盟友。', '其實他們的王今天就該到——'],
		['Mén hòu shì Gāogōulí, tàiwèi. Shì wǒmen de méngyǒu.', 'Qíshí tāmen de wáng jīntiān jiù gāi dào——']
	),
	SYX(['Yes. I’d like to see how he rides.'], ['그렇지. 말 타는 걸 좀 보고 싶네.'], ['是啊。我想看看他騎得怎樣。'], ['Shì a. Wǒ xiǎng kànkan tā qí de zěnyàng.']),
	P(
		'The flap opens. The eastern barbarian walks in, dusty to the knees, and does not wait to be translated.',
		'천막 자락이 걷힌다. 동쪽 오랑캐가 무릎까지 먼지를 뒤집어쓰고 들어온다. 통역을 기다리지도 않는다.'
	),
	DC(['I ride well.', 'I’m told I’m next.'], ['말은 잘 타오.', '듣자 하니 내가 다음 차례라던데.'], ['我騎得好。', '聽說下一個是我。'], ['Wǒ qí de hǎo.', 'Tīngshuō xià yí ge shì wǒ.']),
	P(
		'The man on the camp stool does not stand. He is old and thin, in a plain robe with ink on one cuff. He looks the king over the way a farmer looks at a field after rain. So this is the Western Chancellor. You may have guessed already. Goguryeo hasn’t. His name, which nobody out west says for luck, is Sima Yi.',
		'걸상에 앉은 사내는 일어서지 않는다. 늙고 마른 몸에, 소매 한쪽에 먹이 묻은 수수한 옷. 그는 농부가 비 갠 밭을 보듯 왕을 훑어본다. 이 사람이 서쪽 승상이다. 당신은 벌써 눈치챘을지도 모른다. 고구려는 아직이다. 서쪽에서 재수 없다고 아무도 입에 올리지 않는 그 이름은, 사마의다.'
	),
	{
		kind: 'card',
		person: 'simayi',
		caption: 'Fifty-nine years old, and he has never once been in a hurry. Everyone who fought him has learned to find that frightening.',
		ko: '쉰아홉. 평생 한 번도 서두른 적이 없다. 그와 싸운 자들은 모두 그게 무섭다는 걸 배웠다.'
	},
	SY(
		['“Next” is a long word.', 'Sit. You rode a thousand li to be rude to me. Be comfortable doing it.'],
		['‘다음’이란 건 긴 말일세.', '앉게. 무례하려고 천 리를 왔으니, 편히 앉아서 하게.'],
		['「下一個」，是很長的話。', '坐。你騎了千里來對我無禮，坐著無禮吧。'],
		['“Xià yí ge”, shì hěn cháng de huà.', 'Zuò. Nǐ qí le qiān lǐ lái duì wǒ wúlǐ, zuòzhe wúlǐ ba.']
	),
	DC(['Did you just talk to me like one of your captains?'], ['방금 나더러 자네라 했소?']),
	SY(
		['You walked into my tent like one of my captains.', 'We’ll call it even. Wine?'],
		['자네도 내 막사에 내 부하처럼 들어오지 않았나.', '비긴 걸로 하세. 술?'],
		['你也像我的部將一樣闖進我的帳。', '扯平了。喝酒？'],
		['Nǐ yě xiàng wǒ de bùjiàng yíyàng chuǎng jìn wǒ de zhàng.', 'Chěpíng le. Hē jiǔ?']
	),
	P(
		'The secretary, who has served the old man eleven years and never once been offered wine, goes to fetch it.',
		'열한 해를 노인을 모시면서 술 한 잔 권받아 본 적 없는 서기가, 술을 가지러 나간다.'
	),

	SCENE('Liaodong · the rains', '요동 · 장마'),
	P(
		'Lord Gongsun has built twenty li of earthworks along the river and is sitting behind them. The old man looks at them for one afternoon. That night he leaves his banners standing in the south, crosses in the north, and walks past the earthworks toward the city behind them. The men guarding the earthworks find they are guarding nothing. They run home.',
		'공손씨는 강을 따라 이십 리 토루를 쌓고 그 뒤에 앉아 있다. 노인은 그걸 한나절 들여다본다. 그날 밤 그는 남쪽에 깃발을 세워 둔 채 북쪽으로 강을 건너, 토루를 지나쳐 그 뒤의 성으로 곧장 걸어간다. 토루를 지키던 자들은 자기들이 아무것도 안 지키고 있다는 걸 깨닫는다. 그리고 집으로 달아난다.'
	),
	DC(['They’re running back inside. We could catch them on the road.'], ['안으로 도망치는군. 길에서 잡을 수 있소.']),
	SY(
		['Why? He is going exactly where I want him.', 'A man who runs is hard to catch. A man who sits in a city has already been caught.', 'He simply hasn’t been told.'],
		['왜? 내가 원하는 데로 꼭 가고 있는데.', '달아나는 자는 잡기 어렵네. 성에 들어앉은 자는 이미 잡힌 걸세.', '아직 그 말을 못 들었을 뿐이지.'],
		['何必？他正往我要他去的地方去。', '逃的人難抓。坐在城裡的人，已經抓住了。', '只是還沒人告訴他。'],
		['Hébì? Tā zhèng wǎng wǒ yào tā qù de dìfang qù.', 'Táo de rén nán zhuā. Zuò zài chéng lǐ de rén, yǐjīng zhuāzhù le.', 'Zhǐshì hái méi rén gàosu tā.']
	),
	P(
		'Then it rains. It rains for a month. The river comes over its banks, and forty thousand men stand in a lake a few feet deep.',
		'그리고 비가 온다. 한 달 내내 온다. 강이 둑을 넘고, 사만 명이 발목 넘는 호수 한가운데 서 있게 된다.'
	),
	P('Inside the walls, Lord Gongsun is delighted.', '성안에서, 공손씨는 신이 났다.'),
	{
		kind: 'card',
		person: 'gongsunyuan',
		look: 'lord',
		write: '公孫',
		caption: 'Lord of Liaodong, third of his line, and a friend to anyone who might help him. He is running out of anyone.',
		ko: '요동의 영주, 그 집안의 세 번째. 자기를 도울 만한 자라면 누구의 벗이든 되었다. 이제 그 누구가 바닥나고 있다.'
	},
	GS(
		['Look at them. Standing in the lake like herons.', 'Heaven has always liked me. Send the cattle out to graze. Let them watch us eat.'],
		['저것들 좀 봐라. 호수에 서 있는 꼴이 꼭 백로 떼로구나.', '하늘은 늘 나를 아꼈다. 소를 내보내 풀을 먹여라. 우리가 먹는 걸 구경이나 하라지.'],
		['看看他們。站在湖裡，跟白鷺似的。', '天一向眷顧我。把牛放出去吃草。讓他們看著我們吃。'],
		['Kànkan tāmen. Zhàn zài hú lǐ, gēn báilù shìde.', 'Tiān yíxiàng juàngù wǒ. Bǎ niú fàng chūqù chī cǎo. Ràng tāmen kànzhe wǒmen chī.']
	),
	P(
		'So the cattle graze in full view, and the city’s woodcutters work under the walls. The Goguryeo riders sit their horses in the water and watch dinner walk past.',
		'그래서 소 떼가 보란 듯이 풀을 뜯고, 성안 나무꾼들이 성벽 아래서 장작을 팬다. 고구려 기병들은 물속에서 말 위에 앉아 저녁거리가 지나가는 걸 구경한다.'
	),
	DC(
		['Two hundred head, in the open. Give me fifty riders and you eat beef tonight.'],
		['소 이백 마리가 훤히 나와 있소. 기병 쉰만 주시오. 오늘 밤 쇠고기 드시게 해 드리리다.']
	),
	SY(
		['I know.', 'In your hills, when you hunt deer in the rain, do you chase them?'],
		['알고 있네.', '자네 산에서 비 오는 날 사슴을 잡을 때, 쫓아가나?'],
		['我知道。', '你們山裡，雨天獵鹿，會追嗎？'],
		['Wǒ zhīdào.', 'Nǐmen shān lǐ, yǔtiān liè lù, huì zhuī ma?']
	),
	DC(['…No. They’re faster in the mud than we are.'], ['…안 쫓소. 진흙에선 사슴이 우리보다 빠르니.']),
	SY(['So is a frightened city.'], ['겁먹은 성도 그렇다네.'], ['受驚的城也是。'], ['Shòujīng de chéng yě shì.']),
	DC(['They don’t look frightened. They look like they’re having a picnic.'], ['겁먹은 꼴이 아니오. 꽃놀이 나온 꼴이지.']),
	SY(['Good. A man at a picnic doesn’t run.'], ['좋네. 꽃놀이 나온 사람은 안 달아나거든.'], ['好。出來野宴的人，不會跑。'], ['Hǎo. Chūlái yěyàn de rén, bú huì pǎo.']),
	P(
		'That afternoon a Wei officer asks to move the camp to higher ground. The old man has his head taken off and put on a pole above the water. Nobody asks again.',
		'그날 오후 위나라 장교 하나가 진을 높은 데로 옮기자고 청한다. 노인은 그의 목을 베어 물 위 장대에 걸게 한다. 다시 묻는 사람은 없다.'
	),
	DC(['You killed a man for wanting dry feet.'], ['발 좀 말리고 싶다고 사람을 죽였소.']),
	SY(
		['For saying so out loud.', 'Everyone else wants dry feet very quietly. You included.'],
		['그걸 소리 내어 말해서지.', '다들 발 마르기를 아주 조용히 바라고 있네. 자네도.'],
		['是因為他說出口了。', '其他人都很安靜地想要乾腳。你也是。'],
		['Shì yīnwèi tā shuō chūkǒu le.', 'Qítā rén dōu hěn ānjìng de xiǎng yào gān jiǎo. Nǐ yě shì.']
	),
	DC(['I’m a king. I want things loudly.'], ['나는 임금이오. 뭘 바라도 크게 바라지.']),
	SY(
		['Then want this. When the water goes down, which part of this plain dries first?'],
		['그럼 이걸 바라게. 물이 빠지면, 이 들판 어디가 제일 먼저 마르겠나?'],
		['那就要這個。水退了，這片平地哪裡先乾？'],
		['Nà jiù yào zhège. Shuǐ tuì le, zhè piàn píngdì nǎlǐ xiān gān?']
	),
	DC(['…How would I know?'], ['…그걸 내가 어찌 아오?']),
	SY(
		['You ride well. Do you look at the ground as well as you ride?', 'Go and find out. Look at the ground first. Always.'],
		['말은 잘 타더군. 땅도 그만큼 잘 보나?', '가서 알아 오게. 땅부터 보게. 언제나.'],
		['你騎得好。看地也看得那麼好嗎？', '去查清楚。先看地。永遠先看地。'],
		['Nǐ qí de hǎo. Kàn dì yě kàn de nàme hǎo ma?', 'Qù chá qīngchu. Xiān kàn dì. Yǒngyuǎn xiān kàn dì.']
	),
	P(
		'So for the rest of the rain, the King of Goguryeo rides around a besieged city in water to his horse’s knees. He pokes the mud with a spear butt, like a farmer deciding when to plant. His captain rides behind him with a charcoal map on a board. The south-east dries first. Under the water, a spine of gravel runs down to a little river behind the city.',
		'그래서 비가 그칠 때까지, 고구려 왕은 말 무릎까지 차는 물속에서 포위된 성을 빙빙 돈다. 씨 뿌릴 날을 가늠하는 농부처럼 창 자루로 진흙을 쿡쿡 찔러 본다. 대장이 판때기에 숯으로 지도를 그리며 뒤를 따른다. 동남쪽이 제일 먼저 마른다. 물 밑으로 자갈 등줄기가 성 뒤 작은 강까지 뻗어 있다.'
	),
	CAP(['Majesty, you ken you’re the only king in the world doing this.'], ['전하, 세상에 이러는 임금은 전하뿐인 거 아시디요.']),
	DC(['Shut up and write. South-east. Firm.'], ['입 다물고 적어라. 동남쪽. 단단함.']),

	SCENE('The plain tent · nights', '수수한 막사 · 밤'),
	P(
		'In the evenings the king comes back to the plain tent wet to the thigh, and the old man has the stone board out.',
		'저녁이면 왕은 허벅지까지 젖어서 수수한 막사로 돌아오고, 노인은 바둑판을 꺼내 놓고 기다린다.'
	),
	DC(['Again.'], ['한 판 더.']),
	SY(['That’s the fourth “again”.'], ['‘한 판 더’가 이걸로 네 번째일세.'], ['這是第四個「再來」了。'], ['Zhè shì dì sì ge “zài lái” le.']),
	DC(['You keep winning. It’s rude to a guest.'], ['자꾸 이기잖소. 손님한테 무례하게.']),
	SY(['You keep attacking. It’s rude to the board.'], ['자네는 자꾸 덤비지 않나. 판한테 무례하게.'], ['你一直進攻。對棋盤無禮。'], ['Nǐ yìzhí jìngōng. Duì qípán wúlǐ.']),
	P(
		'The king plays the way he rides, straight at a thing until it dies. The old man plays the way it rains.',
		'왕은 말 타듯 둔다. 죽을 때까지 곧장 들이받는다. 노인은 비 오듯 둔다.'
	),
	SY(
		['Your captain draws a good map. What’s his name?'],
		['자네 대장, 지도를 잘 그리더군. 이름이 뭔가?'],
		['你那個隊長，地圖畫得好。叫什麼名字？'],
		['Nǐ nàge duìzhǎng, dìtú huà de hǎo. Jiào shénme míngzi?']
	),
	DC(['He has one.', 'Your move.'], ['있겠지.', '당신 차례요.']),
	DC(['One more. If I win, you owe me.'], ['한 판만 더. 내가 이기면, 빚이오.']),
	SY(['Owe you what?'], ['무슨 빚?'], ['欠你什麼？'], ['Qiàn nǐ shénme?']),
	DC(['Something big. I’ll think of it.'], ['큰 거. 생각해 두지.']),
	SY(['Kings always do.'], ['임금들은 늘 그렇지.'], ['君王總是這樣。'], ['Jūnwáng zǒngshì zhèyàng.']),
	P(
		'On the twentieth night of rain the king plays slowly. He takes nothing. He waits. The old man looks at the board for a long time, then at the king, and puts his stones back in the box.',
		'장마 스무째 날 밤, 왕은 느리게 둔다. 아무것도 따 먹지 않는다. 기다린다. 노인은 오래도록 판을 들여다보다가, 왕을 보고, 제 돌을 통에 도로 담는다.'
	),
	SY(['Where did you learn that?'], ['어디서 배웠나?'], ['哪裡學的？'], ['Nǎlǐ xué de?']),
	DC(['From a man in a dress.'], ['치마 입은 사내한테서.']),
	P('Across the tent, the secretary drops a cup.', '막사 저쪽에서 서기가 잔을 떨어뜨린다.'),
	SY(['…Who told you that story?'], ['…그 얘긴 누가 하던가?'], ['……誰跟你說的？'], ['……Shéi gēn nǐ shuō de?']),
	DC(['Everybody. It’s the only story anyone tells about you.'], ['다들. 당신 얘기라곤 그거 하나뿐이오.']),
	SY(['…It fit, you know.'], ['…꼭 맞았네, 그거.'], ['……其實挺合身的。'], ['……Qíshí tǐng héshēn de.']),
	P(
		'Two clever men, thirty years apart, who like each other rather more than their courts would want. History will try this pairing again in four hundred years, with different hats.',
		'서른 살 차이 나는 영리한 사내 둘이, 각자의 조정이 바랄 만한 것보다 서로를 훨씬 더 좋아한다. 역사는 사백 년 뒤에 이 짝을 한 번 더 시험해 본다. 모자만 바꿔 쓰고.'
	),

	SCENE('Liaodong · the rain stops', '요동 · 비가 그치다'),
	P(
		'The rain stops. Within a week Wei has ramps against the walls, ladders, rams, and engines throwing stones over the parapet. Inside, the grain runs out. Then the cattle. Then people start to go missing, and nobody asks where.',
		'비가 그친다. 한 주 만에 위나라는 성벽에 흙 비탈을 대고, 사다리와 충차를 붙이고, 성가퀴 너머로 돌을 날리는 포차를 세운다. 성안에선 곡식이 떨어진다. 그다음엔 소가. 그다음엔 사람들이 하나둘 사라지는데, 어디로 갔는지 묻는 사람이 없다.'
	),
	P(
		'One night the king and his captain are on watch on the south-east gravel when the sky does something.',
		'어느 밤 왕과 대장이 동남쪽 자갈밭에서 망을 보고 있는데, 하늘이 무언가를 한다.'
	),
	CAP(['Majesty— look up—'], ['전하— 위에, 위에—']),
	P(
		'A long white star with a tail like a horse’s mane crosses over the city and drops into the little river behind it. Right where the gravel runs down to the water.',
		'말갈기 같은 꼬리를 단 긴 흰 별 하나가 성 위를 가로질러 성 뒤 작은 강으로 떨어진다. 꼭 자갈밭이 물로 내려가는 그 자리에.'
	),
	DC(['…That’s our gravel.'], ['…저기 우리 자갈밭인데.']),
	CAP(['That’s his grave, Majesty. My grannie’d say so.', 'She’d also say dinnae point at it.'], ['저게 그놈 무덤이디요, 전하. 우리 할매라면 그랬을 거요.', '손가락질은 하지 말라구도 했을 거구요.']),
	P('Inside the walls, everyone saw it. Nobody sleeps.', '성안에서도 모두 그걸 봤다. 아무도 잠들지 못한다.'),
	P(
		'In the morning old men come out under a white flag with terms, then a younger one offering a hostage. The old man sends them all back with a list.',
		'아침이 되자 늙은 신하들이 흰 깃발을 들고 나와 조건을 내민다. 다음엔 젊은 자가 나와 볼모를 내민다. 노인은 그들 모두를 목록 하나 들려서 돌려보낸다.'
	),
	SY(
		['There are five things a general can do.', 'Fight. Hold. Run. Kneel. Die.'],
		['장수가 할 수 있는 일은 다섯이네.', '싸우거나, 지키거나, 달아나거나, 무릎 꿇거나, 죽거나.'],
		['為將者能做的，有五件。', '戰，守，走，降，死。'],
		['Wéi jiàng zhě néng zuò de, yǒu wǔ jiàn.', 'Zhàn, shǒu, zǒu, xiáng, sǐ.']
	),
	DC(
		['He can’t fight. He’s done holding. And he won’t kneel, or he’d have come out himself instead of sending old men.'],
		['싸우진 못하고, 지키는 건 끝났고. 무릎 꿇을 생각이었으면 늙은이들 대신 제가 나왔겠지.']
	),
	SY(['So.', 'Which way does he run?'], ['그러니.', '어느 쪽으로 달아나겠나?'], ['所以。', '他往哪邊跑？'], ['Suǒyǐ.', 'Tā wǎng nǎ biān pǎo?']),
	DC(['…South-east. It’s the only ground that will hold a horse.'], ['…동남쪽. 말을 받쳐 줄 땅은 거기뿐이오.']),
	SY(['Then go and sit on it.'], ['그럼 가서 거기 앉아 있게.'], ['那就去那裡坐著。'], ['Nà jiù qù nàlǐ zuòzhe.']),
	GS(
		['A list. He sends me a list, like a grain merchant.', 'Saddle the horses. Whichever ones are still horses.'],
		['목록이라. 곡물 장수처럼 목록을 보내왔구나.', '말에 안장을 얹어라. 아직 말인 놈들한테만.'],
		['一張單子。他給我送來一張單子，跟糧商似的。', '備馬。還算是馬的那些。'],
		['Yì zhāng dānzi. Tā gěi wǒ sòng lái yì zhāng dānzi, gēn liángshāng shìde.', 'Bèi mǎ. Hái suàn shì mǎ de nàxiē.']
	),

	SCENE('The little river', '작은 강'),
	P(
		'He breaks out at night through the southern lines, with his son and a few hundred riders, and turns south-east. Of course he does.',
		'그는 밤에 아들과 기병 수백을 데리고 남쪽 포위를 뚫고 나와 동남쪽으로 꺾는다. 당연히 그렇다.'
	),
	P('The Goguryeo thousand are already sitting on it.', '고구려의 천 기는 이미 거기 앉아 있다.'),
	DC(['Told you. Firm.'], ['거봐라. 단단하지.']),
	CAP(['You told a board, Majesty. I wrote it.'], ['판때기한테 말씀하셨디요, 전하. 적은 건 저고요.']),
	P(
		'It isn’t much of a fight. The lord’s riders are starved, and their horses are worse. The king’s arrow takes Lord Gongsun’s horse at the water’s edge, about where the star went in. Lord Gongsun goes into the shallows on his hands and knees and comes up muddy to the eyes, still in silk.',
		'싸움이랄 것도 없다. 영주의 기병들은 굶주렸고, 말들은 더하다. 왕의 화살이 물가에서 공손씨의 말을 꿰뚫는다. 별이 떨어진 바로 그 언저리다. 공손씨는 손과 무릎으로 여울에 처박혔다가, 눈까지 진흙을 뒤집어쓰고 일어난다. 여전히 비단 차림이다.'
	),
	GS(
		['Goguryeo! You’re Goguryeo, aren’t you? Look at your hat.', 'Listen. Listen to me. I’m your neighbour.'],
		['고구려! 너 고구려지? 그 모자 좀 봐.', '들어 봐. 내 말 좀 들어. 나 너희 이웃이야.'],
		['高句麗！你是高句麗的，對吧？看你那帽子。', '聽著。聽我說。我是你們的鄰居。'],
		['Gāogōulí! Nǐ shì Gāogōulí de, duì ba? Kàn nǐ nà màozi.', 'Tīngzhe. Tīng wǒ shuō. Wǒ shì nǐmen de línjū.']
	),
	DC(['Your family burned my father’s city.'], ['네 집안이 아버님 도성을 태웠다.']),
	GS(
		['That was my father! I send you silk! Every spring!', 'Think, boy. Kill me tonight, and tomorrow who’s your neighbour?', 'Them.'],
		['그건 우리 아버지가 한 거야! 나는 비단을 보냈잖아! 봄마다!', '생각 좀 해, 이놈아. 오늘 밤 나를 죽이면, 내일 너희 이웃은 누구냐?', '저놈들이다.'],
		['那是我爹！我給你們送綢緞！每年春天！', '想想，小子。今晚殺了我，明天誰是你的鄰居？', '他們。'],
		['Nà shì wǒ diē! Wǒ gěi nǐmen sòng chóuduàn! Měi nián chūntiān!', 'Xiǎngxiang, xiǎozi. Jīnwǎn shā le wǒ, míngtiān shéi shì nǐ de línjū?', 'Tāmen.']
	),
	P(
		'The king’s bow stays half drawn. He looks up the gravel at the Wei banners coming down it, and the old man riding slowly under them. For one breath he does the arithmetic.',
		'왕의 활은 반쯤 당겨진 채 멈춘다. 그는 자갈밭 위로, 내려오는 위나라 깃발들과 그 아래 느릿느릿 말을 모는 노인을 올려다본다. 한 숨 동안, 그는 셈을 한다.'
	),
	GS(['Grand Commandant! Look, I’m kneeling! I’m kneeling!'], ['태위! 보시오, 무릎 꿇었소! 꿇었다고!'], ['太尉！你看，我跪了！我跪了！'], ['Tàiwèi! Nǐ kàn, wǒ guì le! Wǒ guì le!']),
	SY(['In a river.', 'It doesn’t count.'], ['강물 속에서.', '그건 셈에 들지 않는다.'], ['在河裡。', '不算。'], ['Zài hé lǐ.', 'Bú suàn.']),
	P(
		'The king lets the arrow go. Three generations of Gongsun end in a little river behind a city, in silk. The Wei riders find the son a little further up the bank.',
		'왕이 시위를 놓는다. 공손씨 삼대가 성 뒤 작은 강에서, 비단 차림으로 끝난다. 위나라 기병들은 조금 더 위 둑에서 아들을 찾아낸다.'
	),
	DC(['He said you’d be my neighbour now.'], ['저자가 그러던데, 이제 당신이 내 이웃이라고.']),
	SY(
		['He was right. I’m a better one.', 'I don’t send spies. I come myself.'],
		['맞는 말이네. 내가 더 나은 이웃이지.', '나는 첩자를 안 보내네. 직접 오지.'],
		['他說得對。我是更好的鄰居。', '我不派探子。我親自來。'],
		['Tā shuō de duì. Wǒ shì gèng hǎo de línjū.', 'Wǒ bú pài tànzi. Wǒ qīnzì lái.']
	),

	SCENE('Liaodong · after', '요동 · 그 뒤'),
	P(
		'The old man enters the city the next day and sorts it like a clerk sorting grain. Every man over fifteen is walked out onto the plain. The heads go into a mound by the gate, so that anyone coming down the western road will understand.',
		'노인은 다음 날 성에 들어가 아전이 곡식 고르듯 성을 고른다. 열다섯 넘은 사내는 모두 들판으로 끌려 나간다. 머리들은 성문 옆에 무덤처럼 쌓인다. 서쪽 길로 오는 자라면 누구든 알아듣게.'
	),
	P('It turns cold early that year. Some Wei soldiers come to the old man’s tent about coats.', '그해는 추위가 일찍 온다. 위나라 병사 몇이 솜옷 일로 노인의 막사를 찾아온다.'),
	WEI(
		'Wei soldier',
		['Grand Commandant. The stores are full of padded coats.', 'We’re freezing out there.'],
		['태위 각하, 창고에 솜옷이 가득합니다.', '밖에선 다들 얼어 죽게 생겼습니다.'],
		['太尉，庫裡堆滿了絮衣。', '我們在外頭凍壞了。'],
		['Tàiwèi, kù lǐ duī mǎn le xùyī.', 'Wǒmen zài wàitou dòng huài le.']
	),
	SY(
		['The stores belong to the state.', 'So does the cold, this year. Bear it for the state.'],
		['창고는 나라의 것이다.', '올해는 추위도 나라의 것이다. 나라를 위해 견뎌라.'],
		['庫是國家的。', '今年，冷也是國家的。為國家忍著。'],
		['Kù shì guójiā de.', 'Jīnnián, lěng yě shì guójiā de. Wèi guójiā rěnzhe.']
	),
	P('The king stands at the mound for a long time. He has killed men. He has never seen them stacked.', '왕은 그 무더기 앞에 오래 서 있다. 사람을 죽여 본 적은 있다. 쌓아 놓은 건 처음 본다.'),
	DC(['In Goguryeo we’d have burned the gate and gone home.'], ['고구려 같았으면 성문이나 태우고 집에 갔을 거요.']),
	SY(['In Goguryeo you’d still be standing in the lake.'], ['고구려 같았으면 자네는 아직 호수에 서 있을 걸세.'], ['在高句麗，你還站在湖裡呢。'], ['Zài Gāogōulí, nǐ hái zhàn zài hú lǐ ne.']),
	DC(['You’re a cold old man. You know that?'], ['당신, 차가운 노인네요. 알긴 아시오?']),
	SY(['Yes. It’s how I got old.'], ['알지. 그래서 늙을 수 있었네.'], ['知道。所以才活到老。'], ['Zhīdào. Suǒyǐ cái huó dào lǎo.']),

	SCENE('The Liao ford · autumn', '요하 나루 · 가을'),
	P(
		'The thousand go home before the first snow. The old man rides with them as far as the ford, which a Grand Commandant has no business doing. His secretary mentions this twice.',
		'천 기는 첫눈 전에 집으로 간다. 노인은 나루까지 그들과 함께 말을 탄다. 태위라는 자리가 할 일은 아니다. 서기가 그 말을 두 번 한다.'
	),
	SEC(['Grand Commandant, the court will—'], ['각하, 조정에서—'], ['太尉，朝廷那邊——'], ['Tàiwèi, cháotíng nà biān——']),
	SY(
		['The court will be there when I get back. Courts always are.'],
		['조정은 내가 돌아가도 거기 있을 걸세. 조정이란 늘 그렇지.'],
		['我回去，朝廷還在。朝廷總是在的。'],
		['Wǒ huíqù, cháotíng hái zài. Cháotíng zǒngshì zài de.']
	),
	P(
		'At the water the king pulls off his riding coat, Goguryeo cut with the fur turned in, and throws it at the old man.',
		'물가에서 왕은 털을 안으로 댄 고구려식 승마 외투를 벗어 노인에게 던진다.'
	),
	SY(['I can’t take that.'], ['이건 못 받네.'], ['這我不能收。'], ['Zhè wǒ bù néng shōu.']),
	DC(['In Goguryeo a coat belongs to whoever’s cold.', 'Bear it for the state.'], ['고구려에선 옷은 추운 사람 거요.', '나라를 위해 견디시오.']),
	P('The old man puts it on. It is too big in the shoulders.', '노인이 그걸 걸친다. 어깨가 너무 크다.'),
	SY(['…It fits.'], ['…맞는군.'], ['……合身。'], ['……Héshēn.']),
	DC(['You owe me. From the board. I’ve thought of something big.'], ['빚 있소. 바둑판 빚. 큰 걸로 생각해 뒀지.']),
	SY(['Go on.'], ['말해 보게.'], ['說吧。'], ['Shuō ba.']),
	DC(['Samhan and the West stay friends.', 'Not you and me. We’re easy. Them.'], ['삼한과 서쪽이 벗으로 지내는 거요.', '당신이랑 나 말고. 우린 쉽지. 저쪽 다들 말이오.']),
	SY(['That’s big.'], ['크군.'], ['真大。'], ['Zhēn dà.']),
	DC(['I said it would be.'], ['크다고 했잖소.']),
	SY(
		['While I live, Wei does not cross your river. That much I can sign.', 'The rest I can only wish.'],
		['내가 살아 있는 동안, 위는 자네 강을 건너지 않네. 그만큼은 내가 도장을 찍을 수 있지.', '나머지는 바랄 수밖에 없고.'],
		['我在世一日，魏不渡你的河。這個我能落印。', '其餘的，只能盼著。'],
		['Wǒ zàishì yí rì, Wèi bú dù nǐ de hé. Zhège wǒ néng luò yìn.', 'Qíyú de, zhǐ néng pànzhe.']
	),
	DC(['Then wish it loudly. I will.'], ['그럼 크게 바라시오. 나도 그럴 테니.']),
	P(
		'They drink to it at the ford, and pour the rest into the Liao, which has heard this sort of thing before.',
		'둘은 나루에서 그 약속에 잔을 들고, 남은 술을 요하에 붓는다. 요하는 이런 말을 전에도 들어 본 강이다.'
	),
	SY(['Look at the ground first. Always.'], ['땅부터 보게. 언제나.'], ['先看地。永遠。'], ['Xiān kàn dì. Yǒngyuǎn.']),
	DC(['You said that already.'], ['그 말 벌써 했소.']),
	SY(
		['I’m old. I say things twice, so one of them stays.'],
		['늙어서 그렇네. 두 번 말해야 하나는 남거든.'],
		['老了。話說兩遍，總有一遍留得住。'],
		['Lǎo le. Huà shuō liǎng biàn, zǒng yǒu yí biàn liú de zhù.']
	),
	P(
		'A word about vows between kingdoms. Two men make them on a riverbank. Courts that were not there keep them. The old man means every word. He will spend his last years very busy at court, which is a long way from any river.',
		'나라 사이의 맹세에 대해 한마디만 하자. 맹세는 강가에서 두 사내가 한다. 지키는 건 그 자리에 없던 조정들이다. 노인은 한 마디 한 마디 진심이다. 그는 남은 해들을 조정에서 몹시 바쁘게 보낼 것이다. 조정은 어느 강에서든 멀다.'
	),
	P(
		'The king rides home and tells everyone the Western Chancellor is his friend. For a while, it is even true.',
		'왕은 집으로 돌아가 만나는 사람마다 서쪽 승상이 자기 벗이라고 말한다. 한동안은, 그게 사실이기까지 하다.'
	),
	P(
		'<b>Four hundred years later, another western army reaches the same walls. This one did not bring a friend…!</b>',
		'<b>사백 년 뒤, 또 다른 서쪽 군대가 같은 성벽 앞에 선다. 이번엔 벗을 데려오지 않았다…!</b>'
	)
];

const edit = (name, fn) =>
	editStory((s) => {
		const r = fn(s);
		console.log(name, r === false ? 'skip' : 'ok');
		return process.env.DRY ? false : r;
	});

const entry = (story, title) => {
	const e = story.flatMap((c) => c.entries).find((x) => x.title === title);
	if (!e) throw new Error(`no entry ${title}`);
	return e;
};

edit('Sima Yi', (story) => {
	const e = entry(story, 'Sima Yi');
	if (JSON.stringify(e.blocks).includes(MARK)) return false;
	Object.assign(e, {
		tone: 'war legend — unlikely friends',
		subtitle: '사마의 (司馬懿)',
		logline: {
			en: 'A young king of the hills hears of a man in the West who outwaited Zhuge Liang. He rides a thousand li to meet him, and makes a friend he cannot afford.',
			ko: '산골의 젊은 왕이 제갈량보다 오래 버틴 서쪽 사내의 소문을 듣는다. 그를 만나러 천 리를 달려가, 감당 못 할 벗을 하나 얻는다.'
		}
	});
	e.blocks = blocks;
	e.images = (e.images ?? []).filter((im) => !String(im.id).startsWith('simayi-'));
	return true;
});

edit('Boiling River', (story) => {
	const e = entry(story, 'Boiling River');
	const hits = find(e, 'Wei sent its most famous general to explain why that was a mistake.');
	if (hits.length !== 1) return false;
	Object.assign(hits[0].b, {
		html: 'Four hundred years back, a few summers after a vow at a ford, King Dongcheon picked a fight with Wei anyway. Wei did not send its old Chancellor. It sent a general who had stood behind him at Liaodong and taken notes. Goguryeo met him at the Boiling River and won. Then it chased him west up a valley and won again.',
		ko: '사백 년 전, 나루에서 맹세를 하고 몇 해 지나지 않아, 동천왕은 기어이 위나라에 싸움을 걸었다. 위는 늙은 승상을 보내지 않았다. 요동에서 그 뒤에 서서 받아 적던 장수를 보냈다. 고구려는 비류수에서 그를 맞아 이겼다. 그리고 서쪽 골짜기로 그를 쫓아가 또 이겼다.'
	});
	return true;
});
