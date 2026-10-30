/**
 * Scenes pass: #31 "Four Dragons" (643–645).
 * herald banter → Wei Zheng's last no → the council Wuji loses → the cauldron clerks → three choices, cut off →
 * the Harmony Council → mud in the envoy's palm → the muster gossip → the well-house edict → eggs and the ji →
 * the recruiting table (a Lu Bu joke that lands wrong).
 * Rebuilds the block list from the existing blocks (kept verbatim where unchanged, Heewon's 👑 line included).
 * Idempotent: `node scripts/.cache/rewrite/scenes-xue.mjs` (`DRY=1` to test).
 */
import { editStory } from '../story-ops.mjs';

const TITLE = 'Four Dragons';
const MARK = 'Look out, it’s Lu Bu.';

const P = (html, ko) => ({ kind: 'p', html, ko });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
const CHIP = {
	taizong: '#c97a2e',
	chusuiliang: '#8c7a5b',
	weizheng: '#9a7b4f',
	zhangsunwuji: '#2b2b33',
	herald: '#8d8d95',
	gesomun: '#d0362f',
	bidam: '#7b5cd6',
	alchun: '#8fb3e0',
	xuerengui: '#e8e3d5',
	xueliu: '#c4a484'
};
const zhOf = (zh, zhLatn) => (zh ? { zh, zhLatn } : {});
const D = (person, en, ko, zh, zhLatn, extra = {}) => ({ kind: 'dialogue', chip: CHIP[person] ?? '#8a8a94', person, ...extra, lines: ko, en, ...zhOf(zh, zhLatn) });
const S = (speaker, chip, en, ko, zh, zhLatn, gender = 'm') => ({ kind: 'dialogue', speaker, gender, chip, lines: ko, en, ...zhOf(zh, zhLatn) });

const TZ = (...a) => D('taizong', ...a);
const CHU = (...a) => D('chusuiliang', ...a);
const WZ = (...a) => D('weizheng', ...a);
const BD = (...a) => D('zhangsunwuji', ...a);
const XUE = (...a) => D('xuerengui', ...a);
const LIU = (...a) => D('xueliu', ...a);
const GS = (en, ko) => D('gesomun', en, ko, undefined, undefined, { look: 'supreme' });
const HERALD = (en, ko) => D('herald', en, ko);
const ALCHUN = (en, ko) => D('alchun', en, ko);
const CLERK = (speaker, ...a) => S(speaker, '#7d6a58', ...a);
const SILLA_ENVOY = (...a) => S('Silla envoy', '#6fa8ff', ...a);
const TANG_ENVOY = (...a) => S('Tang envoy', '#8d8d95', ...a);
const GOG_ENVOY = (...a) => S('Goguryeo envoy', '#d0362f', ...a);
const COUNCILLOR = (en, ko) => S('An old councillor', '#a39a8a', en, ko);
const MUSTER = (speaker, ...a) => S(speaker, '#7a6b5a', ...a);
const VILLAGE = (speaker, en, ko, zh, zhLatn, gender) => S(speaker, '#9a8b6e', en, ko, zh, zhLatn, gender);

editStory((story) => {
	const entry = story.flatMap((c) => c.entries ?? []).find((e) => e.title === TITLE);
	if (!entry) throw new Error(`no entry ${TITLE}`);
	if (JSON.stringify(entry.blocks).includes(MARK)) {
		console.log('already applied');
		return false;
	}
	const old = entry.blocks;
	const text = (b) => [b.html, b.label, b.caption, ...(b.en ?? [])].filter(Boolean).join(' ');
	const keep = (frag, pred = () => true) => {
		const hits = old.filter((b) => pred(b) && text(b).includes(frag));
		if (hits.length !== 1) throw new Error(`keep(${frag}): ${hits.length} hits`);
		return structuredClone(hits[0]);
	};
	const card = (person) => keep('', (b) => b.kind === 'card' && b.person === person);
	const with_ = (b, patch) => Object.assign(b, patch);

	const blocks = [
		keep('In Chang’an there is one word nobody says.'),
		keep('He never quite forbids it.'),
		keep('He has plenty of other names,'),
		keep('Tell that to a herald from Samhan.'),
		HERALD(['…They don’t say his name? At all?', 'Not even his mother? Surely his mother—'], ['…이름을 안 부른다고요? 아예?', '어머니도요? 설마 어머니는—']),
		CHU(
			['Her late Majesty went to the ancestors thirty winters ago, sir.'],
			['선황후께서는 서른 해 전에 조상께 가셨습니다.'],
			['先皇后三十年前已歸祖廟矣，大人。'],
			['Xiān huánghòu sānshí nián qián yǐ guī zǔmiào yǐ, dàrén.']
		),
		HERALD(['Well— a friend, then. A drinking friend. Somebody who knew him before.'], ['그럼— 친구라도요. 술친구. 옛날부터 알던 사람이라든가.']),
		CHU(
			['Nor written, sir. We leave off a stroke.', 'It saves everyone a great deal of trouble.'],
			['쓰지도 않습니다. 획 하나를 뺍니다.', '그러면 다들 큰 수고를 덥니다.'],
			['亦不書也，大人。缺其一筆。', '省卻眾人許多麻煩。'],
			['Yì bù shū yě, dàrén. Quē qí yì bǐ.', 'Shěngquè zhòngrén xǔduō máfan.']
		),
		HERALD(['That isn’t what I asked.'], ['그걸 물은 게 아닌데요.']),
		CHU(['No, sir.'], ['압니다.'], ['是，大人。'], ['Shì, dàrén.']),
		keep('So the Second Emperor of the West'),
		P(
			'One man in the palace still holds a licence nearly as rare. He is allowed to say no. This month he is using it up.',
			'궁 안에 그만큼 드문 허락을 받은 사내가 하나 더 있다. 그는 ‘아니’라고 말해도 된다. 이달, 그는 그 허락을 다 써 가는 중이다.'
		),

		keep('The Sickroom', (b) => b.kind === 'scene'),
		keep('The Imperial Minister is dying.'),
		card('weizheng'),
		keep('When I am gone, there will be no one left to tell you no.'),
		keep('Why else do you think I put up with you'),
		WZ(
			['Then let me spend it while I still can.', 'Goryeo.'],
			['그럼 쓸 수 있을 때 써 두겠습니다.', '고려 말입니다.'],
			['那麼臣趁還能說，便說了。', '高麗。'],
			['Nàme chén chèn hái néng shuō, biàn shuō le.', 'Gāolí.']
		),
		TZ(['Not tonight.'], ['오늘 밤엔 그만두게.'], ['今夜不談。'], ['Jīnyè bù tán.']),
		WZ(
			['Tonight is what I have, Majesty.', 'Liaodong ate four Sui armies. It will—'],
			['신에게 남은 게 오늘 밤뿐입니다, 폐하.', '요동이 수나라 대군을 네 번이나 삼켰습니다. 그 땅은 또—'],
			['臣所餘者，唯今夜耳，陛下。', '遼東吞了隋朝四次大軍。那地方還會——'],
			['Chén suǒ yú zhě, wéi jīnyè ěr, Bìxià.', 'Liáodōng tūn le Suí cháo sì cì dàjūn. Nà dìfang hái huì——']
		),
		P(
			'He coughs, and the cough goes on longer than the sentence did. The emperor holds the cup himself. The diarist holds his brush in the air and waits.',
			'그가 기침을 한다. 기침이 말보다 길다. 황제가 손수 잔을 받친다. 기거주는 붓을 허공에 든 채 기다린다.'
		),
		WZ(
			['…Chu. Write down that I said it.', 'Not what. That.'],
			['…저수량. 내가 말했다고 적게.', '무슨 말인지는 말고. 말했다는 것만.'],
			['……褚遂良。記下臣說過。', '不記說了甚麼。記說過。'],
			['……Chǔ Suìliáng. Jì xià chén shuō guò.', 'Bú jì shuō le shénme. Jì shuō guò.']
		),
		CHU(['It is written, Minister.'], ['적었습니다, 대감.'], ['已記，魏公。'], ['Yǐ jì, Wèi gōng.']),
		P(
			'The minister sleeps. The emperor stays on the stool, which no emperor has sat on before, turning over the bronze hand-mirror the physicians hold to a dying man’s lips to see if it fogs.',
			'대신이 잠든다. 황제는 어느 황제도 앉아 본 적 없는 걸상에 그대로 앉아, 의원들이 죽어 가는 사람 입술에 대어 김이 서리나 보는 청동 손거울을 만지작거린다.'
		),
		keep('With bronze for a mirror, a man straightens his robes.'),
		CHU(['Shall I write that, Majesty?'], ['그것도 적을까요, 폐하?'], ['此言亦記否，陛下？'], ['Cǐ yán yì jì fǒu, Bìxià?']),
		TZ(['You already have.'], ['벌써 적었잖으냐.'], ['你早記了。'], ['Nǐ zǎo jì le.']),
		P(
			'He has. The minister does not see the end of the month. Two years from now, on a cold road, the emperor will wish very much that this man had lived. Chu will write that down too.',
			'적었다. 대신은 그달을 넘기지 못한다. 두 해 뒤, 어느 추운 길 위에서 황제는 이 사내가 살아 있었으면 하고 몹시 바라게 된다. 저수량은 그것도 적을 것이다.'
		),

		keep('All that month the eastern reports keep coming in.'),
		keep('Gai Suwen.'),
		keep('Chang’an writes the name without the Yeon.'),
		keep('The King of Goryeo was a friend I valued.'),
		P('The diarist writes <i>friend</i>. He leaves out the pause.', '기거주는 ‘벗’이라고 적는다. 머뭇거린 대목은 빼고.'),

		SCENE('The Council Hall', '어전'),
		keep('Everything is in place.'),
		BD(
			['Majesty, the roads east of the Liao are mud until the fifth month. Every account says—'],
			['폐하, 요하 동쪽 길은 오월까지 진창이옵니다. 어느 기록을 보아도—'],
			['陛下，遼水以東，五月以前道路泥濘。諸記皆言——'],
			['Bìxià, Liáo shuǐ yǐ dōng, wǔ yuè yǐqián dàolù nínìng. Zhū jì jiē yán——']
		),
		TZ(['Then we leave in the sixth.'], ['그럼 유월에 떠나면 되겠군.'], ['那便六月啟程。'], ['Nà biàn liù yuè qǐchéng.']),
		BD(['The grain alone—'], ['군량만 해도—'], ['單是糧草——'], ['Dān shì liángcǎo——']),
		TZ(
			['Is already on the boats. You counted it yourself, Wuji.'],
			['벌써 배에 실렸다. 네가 직접 세지 않았느냐, 무기야.'],
			['已在船上。無忌，是你親手點的。'],
			['Yǐ zài chuán shàng. Wújì, shì nǐ qīnshǒu diǎn de.']
		),
		BD(['I counted it so that you would see how much it was.'], ['얼마나 많은지 보시라고 센 것이옵니다.'], ['臣點它，是要陛下看看有多少。'], ['Chén diǎn tā, shì yào Bìxià kànkan yǒu duōshǎo.']),
		TZ(['I saw. It’s a great deal. Good.'], ['봤다. 아주 많더구나. 됐다.'], ['朕看了。很多。好。'], ['Zhèn kàn le. Hěn duō. Hǎo.']),
		P(
			'The empress’s brother closes his mouth. He has been losing arguments to this man since they were boys, and he knows the sound of the last one.',
			'황후의 오라비가 입을 다문다. 소년 시절부터 이 사내에게 말싸움을 져 왔으니, 마지막 판이 어떤 소리를 내는지 안다.'
		),
		P('From the foot of the room, where nobody expects a voice, the diarist puts down his brush.', '아무도 목소리가 나오리라 생각지 않던 방 끝자리에서, 기거주가 붓을 내려놓는다.'),
		with_(keep('Majesty, we have invaded six times already'), {
			zh: ['陛下，已征六次——還要再去？'],
			zhLatn: ['Bìxià, yǐ zhēng liù cì——hái yào zài qù?']
		}),
		keep('Because I have not gone myself.'),
		P('The diarist picks his brush back up and writes it down. Nobody else asks anything.', '기거주는 다시 붓을 들어 받아 적는다. 다른 누구도 더 묻지 않는다.'),

		keep('The Third Leg', (b) => b.kind === 'scene'),
		keep('In the third month an envoy arrives from Pyongyang'),
		CLERK('Rites clerk', ['Daoists. He’s written Daoists.'], ['도사. 도사라고 썼어.'], ['道士。他寫的是道士。'], ['Dàoshì. Tā xiě de shì dàoshì.']),
		CLERK(
			'Senior clerk',
			['Copying error. He means physicians. They always want physicians.'],
			['베껴 쓰다 틀린 거야. 의원 말이겠지. 저쪽은 늘 의원을 달라잖아.'],
			['抄錯了。是要醫師。他們向來要醫師。'],
			['Chāo cuò le. Shì yào yīshī. Tāmen xiànglái yào yīshī.']
		),
		CLERK('Rites clerk', ['He’s drawn a cauldron in the margin.'], ['여백에 솥을 그려 놨는데.'], ['他在旁邊畫了個鼎。'], ['Tā zài pángbiān huà le ge dǐng.']),
		CLERK('Senior clerk', ['…That’s not a physician.'], ['…의원은 아니네.'], ['……那不是醫師。'], ['……Nà búshì yīshī.']),
		keep('The Mangniji says a cauldron stands on three legs.'),
		keep('He wants Laozi?'),
		GOG_ENVOY(
			['And a copy of the Classic, Majesty. A good one. The Mangniji reads.'],
			['도덕경도 한 질 청하옵니다, 폐하. 좋은 것으로요. 막리지께서 글을 읽으십니다.'],
			['並乞《道德經》一部，陛下。要好本。莫離支讀書。'],
			['Bìng qǐ “Dàodé jīng” yí bù, Bìxià. Yào hǎo běn. Mòlízhī dú shū.']
		),
		TZ(
			['Does he. Send him the one with all the commentaries.', 'Let him find out how long it is.'],
			['그래? 주석 다 달린 걸로 보내 줘라.', '그게 얼마나 긴지 알아보라고.'],
			['是嗎。給他那部注疏俱全的。', '讓他知道有多長。'],
			['Shì ma. Gěi tā nà bù zhùshū jù quán de.', 'Ràng tā zhīdào yǒu duō cháng.']
		),
		keep('Eight Daoists go east'),
		keep('carries the smallest bell down the hill'),
		keep('All conditioned things are impermanent', (b) => b.kind === 'quote'),
		P(
			'The bell sits on its floor. Six months on, at the far end of the peninsula, another country comes to ask the emperor for something. It has less to trade.',
			'종은 바닥에 앉아 있다. 여섯 달 뒤, 반도의 반대쪽 끝에서 또 한 나라가 황제에게 뭔가를 청하러 온다. 내놓을 것은 더 적다.'
		),

		keep('Three Choices', (b) => b.kind === 'scene'),
		P(
			'In the ninth month an envoy comes from Silla, which is losing fortresses to Baekje faster than it can count them. He has rehearsed his speech for the whole voyage. He gets one sentence in.',
			'구월, 신라에서 사신이 온다. 백제에게 성을 세는 것보다 빨리 잃고 있는 나라다. 사신은 바닷길 내내 할 말을 외워 왔다. 한 문장밖에 못 한다.'
		),
		SILLA_ENVOY(
			['Majesty, forty fortresses have fallen since last summer, and Daeya— we ask only that the Son of Heaven—'],
			['폐하, 지난여름 이래 성 마흔이 떨어졌고, 대야성마저— 저희는 다만 천자께서—'],
			['陛下，自去夏以來，四十城陷，大耶城亦——臣等唯乞天子——'],
			['Bìxià, zì qù xià yǐlái, sìshí chéng xiàn, Dàyé chéng yì——chén děng wéi qǐ tiānzǐ——']
		),
		TZ(
			['Yes. I have read the list.', 'One. I send the Khitan and the Mohe into Liaodong, and Goguryeo looks north for a year.'],
			['그래. 목록은 읽었다.', '하나. 거란과 말갈을 요동에 풀어, 고구려가 한 해 동안 북쪽만 보게 하겠다.'],
			['知道。單子朕看過了。', '其一，朕發契丹、靺鞨直入遼東，使高麗北顧一年。'],
			['Zhīdào. Dānzi zhèn kàn guò le.', 'Qí yī, zhèn fā Qìdān, Mòhé zhí rù Liáodōng, shǐ Gāolí běi gù yì nián.']
		),
		SILLA_ENVOY(
			['That would be— yes, Majesty, that would be a great—'],
			['그리만 해 주신다면— 예, 폐하, 그것이야말로—'],
			['若得如此——是，陛下，此乃大——'],
			['Ruò dé rúcǐ——shì, Bìxià, cǐ nǎi dà——']
		),
		TZ(
			['For a year.', 'Two. I give you a few thousand red coats and Tang banners. Stand them on your walls. Baekje will think I have come, and run.'],
			['한 해 동안이다.', '둘. 붉은 군복 몇천 벌과 당의 깃발을 주겠다. 성벽에 세워 두어라. 백제가 보면 짐이 온 줄 알고 달아날 게다.'],
			['一年而已。', '其二，朕給爾絳袍丹幟數千，立於城上，百濟見之，以為朕至，必走。'],
			['Yì nián ér yǐ.', 'Qí èr, zhèn gěi ěr jiàngpáo dānzhì shù qiān, lì yú chéng shàng, Bǎijì jiàn zhī, yǐwéi zhèn zhì, bì zǒu.']
		),
		SILLA_ENVOY(['And… when they stop running?'], ['그러면… 달아나기를 멈춘 뒤에는요?'], ['那……他們不走了以後呢？'], ['Nà……tāmen bù zǒu le yǐhòu ne?']),
		TZ(
			['They notice the coats don’t move.', 'Three.'],
			['군복이 꼼짝도 안 한다는 걸 알아채겠지.', '셋.'],
			['便會發覺那些袍子不會動。', '其三。'],
			['Biàn huì fājué nàxiē páozi bú huì dòng.', 'Qí sān.']
		),
		keep('Your country is ruled by a woman'),
		keep('The envoy says yes, and then no'),
		keep('A mediocre man.'),

		SCENE('Surabol · the twelfth month', '서라벌 · 섣달'),
		P(
			'The report reaches Surabol in the twelfth month. The Harmony Council has the third option read aloud twice, because the first time nobody believed it.',
			'보고는 섣달에 서라벌에 닿는다. 화백회의는 세 번째 안을 두 번 읽게 한다. 처음엔 아무도 믿지 않았으니까.'
		),
		COUNCILLOR(
			['A Tang prince. With Tang soldiers to guard him.', 'Think about it before you all start shouting. The raids would stop by spring.'],
			['당나라 종친이라. 당나라 군사까지 붙여서.', '다들 소리 지르기 전에 생각 좀 해 보시오. 봄이면 침략이 멎을 거요.']
		),
		S('Another councillor', '#8d8d95', ['And Her Majesty?'], ['그럼 폐하는요?']),
		COUNCILLOR(['Her Majesty would… rest. She has earned a rest.'], ['폐하께서는… 쉬시는 거지. 쉬실 만도 하시고.']),
		ALCHUN(['Say that again, Councillor. Louder.', 'I want to be sure who I heard.'], ['다시 말해 보시오, 대감. 더 크게.', '누가 한 말인지 똑똑히 들어 둬야겠소.']),
		COUNCILLOR(['I only meant that—'], ['내 말은 그저—']),
		P(
			'<b>Bidam</b> has read it once. He folds it in half, then in half again, small enough to lose.',
			'<b>비담</b>은 한 번 읽었다. 반으로 접고, 또 반으로 접는다. 잃어버리기 딱 좋을 만큼 작게.'
		),
		keep('He offers us a king the way a temple puts out rice'),
		P(
			'The old councillor finds something interesting on the floor. Nobody calls a vote. Bidam drops the folded letter into the brazier and watches it catch.',
			'늙은 대감은 바닥에서 뭔가 재미난 것을 찾아낸다. 아무도 표결을 부르지 않는다. 비담은 접은 편지를 화로에 떨어뜨리고, 불이 붙는 걸 지켜본다.'
		),

		keep('Five Hundred Li', (b) => b.kind === 'scene'),
		P(
			'In the new year the emperor sends a man to Pyongyang to tell Goguryeo to leave Silla alone. The man waits nine days in a guesthouse. Gesomun is down south taking two more Silla forts, and he comes home with the mud still on his boots.',
			'새해가 되자 황제는 평양에 사람을 보내, 신라를 그만 건드리라고 이른다. 사신은 객관에서 아흐레를 기다린다. 개소문은 남쪽에서 신라 성을 둘 더 빼앗는 중이었고, 장화에 진흙을 그대로 묻힌 채 돌아온다.'
		),
		P(
			'He receives the envoy standing up, a leg of mutton in one hand, and does not offer a mat.',
			'그는 선 채로 사신을 맞는다. 한 손엔 양 다리를 든 채. 자리는 내주지 않는다.'
		),
		TANG_ENVOY(
			['The Son of Heaven, whose virtue covers the four seas, has learned with sorrow—'],
			['사해를 덕으로 덮으시는 천자께서, 근심 어린 마음으로 들으시기를—'],
			['天子德被四海，聞之惻然——'],
			['Tiānzǐ dé bèi sìhǎi, wén zhī cèrán——']
		),
		GS(['Sorrow. Where’s he sore?', 'Sit— no. Don’t sit. Go on.'], ['근심? 어드메가 쑤신다오?', '앉으— 아니. 앉지 마시오. 계속하오.']),
		TANG_ENVOY(
			['—that Goguryeo troubles Silla. Silla is his vassal.', 'As you are.'],
			['—고구려가 신라를 괴롭힌다 하시니. 신라는 천자의 번신이오.', '그대들처럼.'],
			['——高麗侵擾新羅。新羅乃天子藩臣，', '與爾等同。'],
			['——Gāolí qīnrǎo Xīnluó. Xīnluó nǎi tiānzǐ fānchén,', 'yǔ ěr děng tóng.']
		),
		keep('Vassals. Ha!'),
		with_(keep('That was long ago. Why quarrel over old things?'), {
			zh: ['往事已矣，何必追論？'],
			zhLatn: ['Wǎngshì yǐ yǐ, hébì zhuī lùn?']
		}),
		P(
			'Gesomun looks at the mutton, then at his boot. He sets the meat down, scrapes a cake of southern mud off his heel with two fingers, and presses it into the envoy’s clean palm.',
			'개소문은 양고기를 보고, 제 장화를 본다. 고기를 내려놓고, 뒤꿈치에서 남쪽 진흙 한 덩이를 두 손가락으로 긁어내, 사신의 깨끗한 손바닥에 꾹 눌러 준다.'
		),
		keep('Dirt doesn’t get old, you fool.'),
		S('A Goguryeo officer', '#a0392f', ['Will I fetch the man a mat now, sir?'], ['이제 이 양반 자리 하나 내오갓시요?']),
		GS(['He’s leaving.'], ['가는 길이야.']),
		P(
			'The envoy carries it west word for word, and the mud too, folded in a silk kerchief because he can’t think what else to do with it. The Second Emperor has the words read to him twice and smiles. A refusal in writing is worth an army. Now he can raise one.',
			'사신은 그 말을 한 자도 빼지 않고 서쪽으로 가져간다. 진흙도 비단 수건에 싸서 가져간다. 달리 어쩌면 좋을지 몰라서다. 황제는 그 말을 두 번 읽게 하고 웃는다. 글로 받은 거절은 군대 하나만큼 값어치가 있다. 이제 군대를 일으킬 수 있다.'
		),

		keep('The Muster', (b) => b.kind === 'scene'),
		P(
			'Youzhou, the spring the roads dry out. The plain outside the city has been shouting since before dawn and shows no sign of stopping.',
			'유주, 길이 마르는 봄. 성 밖 벌판은 동트기 전부터 고함이고, 멎을 기미가 없다.'
		),
		MUSTER(
			'Muster clerk',
			['—Hedong levy, second company, two hundred! Hedong levy, third company—'],
			['—하동 징발, 이대 이백! 하동 징발, 삼대—'],
			['——河東徵兵，第二隊，二百！河東徵兵，第三隊——'],
			['——Hédōng zhēngbīng, dì èr duì, èrbǎi! Hédōng zhēngbīng, dì sān duì——']
		),
		MUSTER('A recruit', ['Is it true he’s coming himself?'], ['진짜 그분이 몸소 오신대요?'], ['聽說他要親自來，真的假的？'], ['Tīngshuō tā yào qīnzì lái, zhēn de jiǎ de?']),
		MUSTER(
			'The sergeant',
			['He’s here, turnip. Look for the quiet.', 'Wherever the shouting stops, that’s him.'],
			['벌써 와 계셔, 이 무청 같은 놈아. 조용한 데를 봐.', '고함이 뚝 끊기는 데, 거기가 그분이야.'],
			['早來了，蘿蔔頭。往安靜的地方看。', '哪兒不嚷了，哪兒就是他。'],
			['Zǎo lái le, luóbo tóu. Wǎng ānjìng de dìfang kàn.', 'Nǎr bù rǎng le, nǎr jiù shì tā.']
		),
		keep('He launches the Seventh Invasion'),
		keep('', (b) => b.kind === 'edict'),
		keep('Four dragon banners go up'),
		card('lishiji'),
		keep('The fifth banner has no name'),
		keep('', (b) => b.kind === 'map'),
		MUSTER('A recruit', ['Which dragon’s ours?'], ['우리는 어느 용이에요?'], ['咱們歸哪條龍？'], ['Zánmen guī nǎ tiáo lóng?']),
		MUSTER(
			'The sergeant',
			['Red. A Turk. Keeps a felt tent inside the capital walls, with a perfectly good house right next to it.'],
			['적룡. 돌궐 양반이지. 도성 안에 멀쩡한 집을 두고 바로 옆에 펠트 천막을 치고 산다.'],
			['赤龍。突厥人。京城裡好好的宅子不住，偏在旁邊搭氈帳。'],
			['Chìlóng. Tūjué rén. Jīngchéng lǐ hǎohǎo de zháizi bú zhù, piān zài pángbiān dā zhānzhàng.']
		),
		MUSTER('A recruit', ['Why?'], ['왜요?'], ['為啥？'], ['Wèi shá?']),
		MUSTER('The sergeant', ['Ask him. I’m not asking him.'], ['가서 물어봐. 난 안 물어.'], ['你去問他。我可不問。'], ['Nǐ qù wèn tā. Wǒ kě bú wèn.']),
		MUSTER(
			'A veteran',
			['The black one didn’t even want to come. Said so in council. Out loud.'],
			['흑룡은 오기도 싫었대. 어전에서 대놓고 그랬다더라.'],
			['黑龍根本不想來。在朝上當面說的。'],
			['Hēilóng gēnběn bù xiǎng lái. Zài cháo shàng dāngmiàn shuō de.']
		),
		MUSTER('A recruit', ['Then why’s he—'], ['그럼 왜—'], ['那他幹嘛——'], ['Nà tā gànmá——']),
		MUSTER(
			'The sergeant',
			['Because the other one wanted to. Heels in, you lot, the clerk’s reaching us.'],
			['그분이 오고 싶으셨으니까. 발 붙여, 이놈들아. 서기가 우리 차례 부른다.'],
			['因為那一位想來。都站好，文書念到咱們了。'],
			['Yīnwèi nà yí wèi xiǎng lái. Dōu zhàn hǎo, wénshū niàn dào zánmen le.']
		),
		P(
			'Nobody gossips about the White Dragon. He walked his whole tribe across the border as a boy, and he has been proving it was worth it ever since. Men who are proving something are no fun to talk about.',
			'백룡을 두고는 아무도 수군대지 않는다. 그는 소년 시절 부족 전체를 이끌고 국경을 넘어왔고, 그 뒤로 그게 잘한 일이었음을 줄곧 증명하는 중이다. 뭔가를 증명하는 중인 사내는 뒷말하는 재미가 없다.'
		),
		P(
			'The clerks read for three days. Somewhere deep in the third day is a name nobody on that plain has heard. A season ago, it was still at home with a hoe.',
			'서기들은 사흘을 읽는다. 사흘째 깊숙한 데, 그 벌판의 누구도 들어 본 적 없는 이름이 하나 있다. 한 계절 전만 해도 그 이름은 아직 집에서 호미를 들고 있었다.'
		),

		keep('Longmen Field', (b) => b.kind === 'scene'),
		keep('In a poor field at Longmen'),
		card('xuerengui'),
		keep('The cloth on his back is plain yellow peasant hemp'),
		keep('The Son of Heaven is calling up troops for Liaodong.'),
		keep('The edict comes on red paper'),
		VILLAGE('A neighbour', ['One man a household. One!'], ['집집마다 하나씩이래. 하나!'], ['一戶一個。一個！'], ['Yí hù yí ge. Yí ge!'], 'm'),
		VILLAGE(
			'A woman at the well',
			['Old Wang’s got three sons and he’s crying anyway.'],
			['왕 영감네는 아들이 셋인데도 울고 있더라.'],
			['老王家三個兒子，照樣在哭。'],
			['Lǎo Wáng jiā sān ge érzi, zhàoyàng zài kū.'],
			'f'
		),
		VILLAGE('A neighbour', ['He’s crying because he has to pick one.'], ['하나 고르라니까 우는 거지.'], ['他哭是因為得挑一個。'], ['Tā kū shì yīnwèi děi tiāo yí ge.'], 'm'),
		P(
			'Nobody laughs. Xue Rengui stands at the back with his hoe on his shoulder, reading the small characters twice.',
			'아무도 웃지 않는다. 설인귀는 호미를 어깨에 걸치고 맨 뒤에 서서, 작은 글씨를 두 번 읽는다.'
		),
		VILLAGE('A boy', ['Uncle Xue, you can read. What’s it say?'], ['설 아저씨, 아저씨 글 읽잖아요. 뭐라고 써 있어요?'], ['薛叔，你識字。上頭寫啥？'], ['Xuē shū, nǐ shízì. Shàngtou xiě shá?'], 'm'),
		XUE(['…It says the emperor wants men.'], ['…천자께서 사람을 찾으신단다.'], ['……說天子要人。'], ['……Shuō tiānzǐ yào rén.']),
		VILLAGE('A boy', ['Does he want you?'], ['아저씨도요?'], ['要你不？'], ['Yào nǐ bù?'], 'm'),
		P(
			'Xue moves the hoe to his other shoulder and goes home. He takes the long way, past the graves.',
			'설인귀는 호미를 다른 어깨로 옮기고 집으로 간다. 무덤 쪽으로 도는 먼 길로.'
		),
		card('xueliu'),
		LIU(['You went the long way.'], ['먼 길로 왔네요.'], ['你繞遠路了。'], ['Nǐ rào yuǎn lù le.']),
		XUE(['I went past the graves.'], ['무덤 들렀다 왔어.'], ['去墳地看了看。'], ['Qù féndì kàn le kàn.']),
		LIU(['You went past the well.'], ['우물가 들렀다 왔잖아요.'], ['你去了井邊。'], ['Nǐ qù le jǐng biān.']),
		XUE(['…The well’s on the way to the graves.'], ['…우물이 무덤 가는 길에 있잖아.'], ['……井在去墳地的路上。'], ['……Jǐng zài qù féndì de lù shang.']),
		LIU(['It isn’t.'], ['안 있어.'], ['不在。'], ['Bú zài.']),
		keep('The mounds… they’re not done.'),
		keep('Mounds don’t wait because a man is short of hands.'),
		keep('Liu, we don’t own a ji.'),
		keep('Liu goes into the hut without a word.'),
		keep('Under the hemp is an old ji.'),
		keep('…Where did you—'),
		keep('From the house your father sold it to.'),
		keep('Six fathers back, a Xue rode for kings'),
		keep('It’s lighter than I thought.'),
		keep('I’ll shut the door.'),
		keep('…Ancestors. Wait a little longer.'),
		LIU(
			['Leave them. They’re the wrong colour anyway.', 'And don’t stand at the back. Nobody ever got noticed at the back.'],
			['두고 가요. 어차피 색도 틀렸어.', '그리고 맨 뒤에 서지 마요. 맨 뒤에 서서 눈에 띈 사람은 없어요.'],
			['留下吧。顏色本來就不對。', '還有，別站在後頭。站後頭的，沒人看得見。'],
			['Liú xià ba. Yánsè běnlái jiù bú duì.', 'Háiyǒu, bié zhàn zài hòutou. Zhàn hòutou de, méi rén kàn de jiàn.']
		),
		keep('He goes. She is right,'),

		SCENE('The Recruiting Table', '모병소'),
		P(
			'The recruiting table stands in the Jiangzhou market, between a melon seller and a man selling charms against arrows. Business is good for both.',
			'모병소 탁자는 강주 장터에 놓여 있다. 참외 장수와 화살 막는 부적 장수 사이에. 둘 다 장사가 잘된다.'
		),
		P(
			'General <b>Zhang Shigui</b> sits behind the clerk on a camp stool, eating a melon and watching farmers lift a test stone. He has watched a great many farmers lift a great many stones.',
			'장군 <b>장사귀</b>는 서기 뒤 걸상에 앉아 참외를 먹으며, 농부들이 시험 돌을 드는 걸 지켜본다. 그는 아주 많은 농부가 아주 많은 돌을 드는 걸 봐 왔다.'
		),
		CLERK('The clerk', ['Next. Horse?'], ['다음. 말은?'], ['下一個。馬？'], ['Xià yí ge. Mǎ?']),
		XUE(['No, sir.'], ['없습니다.'], ['沒有，大人。'], ['Méiyǒu, dàrén.']),
		CLERK('The clerk', ['Armour?'], ['갑옷은?'], ['甲？'], ['Jiǎ?']),
		XUE(['No, sir.'], ['없습니다.'], ['沒有。'], ['Méiyǒu.']),
		CLERK('The clerk', ['What’s that, then. A fishing pole?'], ['그럼 그건 뭔데. 낚싯대야?'], ['那是啥。釣竿？'], ['Nà shì shá. Diàogān?']),
		P('Xue unwinds the oiled hemp. The line behind him leans out to look.', '설인귀가 기름 먹인 삼베를 푼다. 뒤에 선 줄이 고개를 빼고 들여다본다.'),
		S('A farmer in the line', '#9a8b6e', ['Oho. Look out, it’s Lu Bu.'], ['오호. 비켜라, 여포 납신다.'], ['喲。快讓開，呂布來了。'], ['Yō. Kuài ràngkāi, Lǚ Bù lái le.']),
		P('The line laughs. Xue doesn’t.', '줄이 웃는다. 설인귀는 웃지 않는다.'),
		XUE(['…Who?'], ['…누구요?'], ['……誰？'], ['……Shéi?']),
		S('A farmer in the line', '#9a8b6e', ['Lu Bu. You know. The— never mind.'], ['여포. 그 왜, 그— 됐소.'], ['呂布啊。就是那個——算了。'], ['Lǚ Bù a. Jiù shì nàge——suàn le.']),
		CLERK('The clerk', ['Stone’s over there.'], ['돌은 저기다.'], ['石頭在那邊。'], ['Shítou zài nàbiān.']),
		P(
			'Xue sets the ji down carefully, the way you put down something you paid for in eggs. He lifts the stone to his chest, then over his head. Then, because nobody has told him to stop, he carries it to the melon seller and back.',
			'설인귀는 극을 조심스레 내려놓는다. 달걀 값을 치르고 산 물건을 내려놓듯이. 돌을 가슴까지, 이어 머리 위로 든다. 그러고는 아무도 그만하라는 말을 안 했으니, 돌을 든 채 참외 장수까지 갔다가 돌아온다.'
		),
		P('General Zhang stops eating.', '장 장군이 먹던 걸 멈춘다.'),
		CLERK('The clerk', ['…Your name?'], ['…이름?'], ['……姓名？'], ['……Xìngmíng?']),
		XUE(['Xue Rengui, sir. Of Longmen.'], ['설인귀입니다. 용문 사람입니다.'], ['薛仁貴，大人。龍門人。'], ['Xuē Rénguì, dàrén. Lóngmén rén.']),
		P('The clerk writes <i>Xue Rengui</i>. The clerk does not look up. History will.', '서기는 <i>설인귀</i>라 적는다. 서기는 고개를 들지 않는다. 역사는 들 것이다.'),
		keep('Yodong has never opened its gates to the West.')
	];

	entry.blocks = blocks;
	console.log(`#31 ${TITLE}: ${old.length} → ${blocks.length} blocks`);
	return process.env.DRY ? false : true;
});
