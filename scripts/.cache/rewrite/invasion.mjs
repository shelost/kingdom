/**
 * Invasion rewrite (#31–#39): The Seventh Invasion and the Jumong myth.
 * Run once: `node scripts/.cache/rewrite/invasion.mjs`. Each episode checks a marker and skips if already applied.
 */
import fs from 'node:fs';
import { editStory, loadStory } from '../story-ops.mjs';
import { makeKit, get, del, after, before, set, move, unwrap, withAnchors, words, flat } from './invasion-lib.mjs';

const GES = { look: 'supreme' };
const BRIDE = { speaker: '👰', chip: '#d98a8a' };
const OLD = { speaker: 'The old officer', chip: '#7a6b5a' };

const DRY = process.env.DRY === '1';
let dryStory = null;
const run = DRY ? (fn) => fn((dryStory ??= loadStory())) : editStory;
if (DRY) process.on('exit', () => fs.writeFileSync('/tmp/invasion-dry.json', JSON.stringify(dryStory)));

function episode(n, marker, fn, overrides) {
	run((story) => {
		const e = story.flatMap((c) => c.entries)[n - 1];
		if (flat(e.blocks).some((b) => (b.html ?? '').includes(marker) || (b.en ?? []).some((l) => l.includes(marker)))) {
			console.log(`#${n} already applied`);
			return false;
		}
		const kit = makeKit(story);
		const moved = withAnchors(e, () => fn(e, kit), overrides);
		console.log(`#${n} ${e.title}: ${words(e)} words, ${moved} anchors re-pointed`);
	});
}

// ───────────────────────────── #31 Four Dragons ─────────────────────────────
episode(31, 'one word nobody says', (e, { P, S, D }) => {
	const open = P('In Chang’an there is one word nobody says. It is the emperor’s name.', '장안에는 아무도 입에 올리지 않는 말이 하나 있다. 황제의 이름이다.');
	const vanish = get(e, 'He never quite forbids it.');
	const known = set(e, 'known by many names', {
		html: 'He has plenty of other names, and those you may say all day. The Heaven-Sent General. The Khan of Heaven.',
		ko: '다른 이름은 많다. 그건 하루 종일 불러도 된다. 하늘이 보낸 장군. 하늘의 칸.'
	});
	del(e, vanish, known);
	before(e, 'resides in the Palace', open, vanish, known);
	del(e, 'resides in the Palace', 'The inner palace is a country', 'One more thing about him');
	set(e, 'They don’t write it either.', {
		person: 'chusuiliang',
		chip: '#5b6b7a',
		en: ['Nor written, sir. We leave off a stroke.', 'It saves everyone a great deal of trouble.'],
		lines: ['쓰지도 않습니다. 획 하나를 뺍니다.', '그러면 다들 큰 수고를 덥니다.']
	});
	set(e, 'The Grand Minister is dying.', {
		html: 'The Imperial Minister is dying. At the foot of the bed the court diarist, Chu Suiliang, writes down everything the emperor says.',
		ko: '황제의 대신이 죽어 가고 있다. 침상 발치에서는 기거주를 맡은 저수량이 황제의 말을 하나도 빠짐없이 받아 적는다.'
	});
	del(e, 'The Great Tang is still a young dynasty.', 'The western dream?', 'The great revival of the Central Plain', 'By the next spring the dream', 'From India');
	del(e, get(e, 'The Great Tang Dream', (b) => b.kind === 'scene'));
	set(e, 'Later that month', {
		html: 'All that month the eastern reports keep coming in. In Goryeo, a king has been murdered by his own minister.',
		ko: '그달 내내 동방의 보고가 올라온다. 고려에서 왕이 제 신하 손에 죽었다고 한다.'
	});
	set(e, 'Gai Suwen…?', {
		en: ['Gai Suwen.', 'I have been turning that name over for a month. It does not get any sweeter.'],
		lines: ['개소문.', '그 이름을 한 달째 혀끝에서 굴리고 있노라. 굴릴수록 달아지지 않는구나.']
	});
	set(e, 'Chang’an writes the name without the Yeon', {
		html: 'Chang’an writes the name without the Yeon. Yeon was the given name of the emperor’s late father, so the word is gone from the palace. A whole family loses its surname to a dead man’s dignity. It is an old family, too. Older than Goguryeo, if you ask them. They will tell you anyway.',
		ko: '장안은 그 이름을 ‘연’ 자 없이 적는다. 연은 황제 선친의 이름자라, 궁에서 그 글자는 사라졌다. 한 집안이 죽은 사람의 체면 때문에 성을 잃는다. 게다가 오래된 집안이다. 물어보면 고구려보다 오래됐다고 한다. 안 물어봐도 말해 준다.'
	});

	// The envoy Gesomun sends away, then the muster (moved after the diplomacy).
	const bidam = get(e, 'He offers us a king the way a temple');
	const lastDiplomacy = after(
		e,
		bidam,
		S('Five Hundred Li', '오백 리'),
		P('In the new year the emperor sends a man to Pyongyang to tell Goguryeo to leave Silla alone. Gesomun receives him standing up, and does not offer a mat.', '새해가 되자 황제는 평양에 사람을 보내, 신라를 그만 건드리라고 이른다. 개소문은 선 채로 그를 맞는다. 자리도 내주지 않는다.'),
		D({ speaker: 'Tang envoy' }, ['The Son of Heaven asks that Goguryeo stop troubling Silla.', 'They are his vassals. As you are.'], ['천자께서 고구려더러 신라를 그만 괴롭히라 하셨소.', '신라는 천자의 번신이오. 그대들처럼.']),
		D('gesomun', ['Vassals. Ha!', 'When the Sui were sitting on our chest, Silla crept in and took five hundred li of our land.', 'Give back the dirt. Then talk to me about peace.'], ['번신. 하!', '수나라 놈들이 우리 가슴팍에 올라타 있을 때, 신라가 슬그머니 기어들어 와서 우리 땅 오백 리를 집어갔소.', '흙부터 돌려놓으시오. 화친 얘기는 그다음이오.'], GES),
		D({ speaker: 'Tang envoy' }, ['That was long ago. Why quarrel over old things?'], ['다 지난 일이오. 묵은 일로 다툴 게 뭐 있소?']),
		D('gesomun', ['Old?', 'It’s dirt. Dirt doesn’t get old, you fool.', 'Go tell him that. Use small words.'], ['묵어?', '흙이야. 흙은 안 묵어, 이 양반아.', '가서 그대로 전해. 쉬운 말로.'], GES),
		P('The envoy carries it west word for word. The Second Emperor has it read to him twice and smiles. A refusal in writing is worth an army. Now he can raise one.', '사신은 그 말을 한 자도 빼지 않고 서쪽으로 가져간다. 황제는 두 번 읽게 하고 웃는다. 글로 받은 거절은 군대 하나만큼 값어치가 있다. 이제 군대를 일으킬 수 있다.'),
		S('The Muster', '출정')
	);
	const muster = get(e, 'He launches the Seventh Invasion');
	const edict = get(e, 'Gesomun of Goguryeo has murdered his lord');
	move(e, [muster, edict, 'Four dragon banners go up', 'The emperor’s most patient general', 'The fifth banner has no name', 'Three roads in and five hundred hulls', 'Two of the four dragons'], lastDiplomacy);
	del(e, get(e, 'White Dragon', (b) => b.kind === 'table'));
	set(e, 'Two of the four dragons', {
		html: 'Two of the four dragons were born on the steppe. The Red Dragon keeps felt tents inside the capital walls and sleeps better in them. The White Dragon walked his whole tribe across the border as a boy. He has been proving it was worth it ever since. The Black Dragon is the empress’s brother. He argued against this war in council. He’s riding to it anyway.',
		ko: '네 마리 용 가운데 둘은 초원에서 났다. 적룡은 도성 성벽 안에 펠트 천막을 치고 거기서 더 잘 잔다. 백룡은 소년 시절 부족 전체를 이끌고 국경을 넘어왔다. 그 뒤로 그게 잘한 일이었음을 줄곧 증명하는 중이다. 흑룡은 황후의 오라비다. 조정에서 이 전쟁에 반대했다. 그래도 간다.'
	});

	// Longmen: keep the marriage, cut the record pile.
	set(e, 'The cloth on his back', {
		html: 'The cloth on his back is plain yellow peasant hemp, the cheapest dye the village still sells, the colour of millet at the wrong hour. He hoes. His wife, <b>Liu</b>, keeps the hut door.',
		ko: '등에 걸친 것은 평범한 노란 농부의 삼베다. 마을이 아직 파는 가장 싼 물감, 잘못된 시각의 기장 빛. 그는 호미질한다. 아내 <b>유씨</b>가 흙집 문을 지킨다.'
	});
	const call = get(e, 'The edict comes on red paper');
	set(e, call, { html: call.html.replace('It does not ask for Xue Li.', 'It does not ask for him by name.'), ko: call.ko.replace('칙령은 설례를 부르지 않는다.', '칙령은 그의 이름을 부르지 않는다.') });
	del(e, 'The chronicler does not invent her sentence', 'A man of talent that outstrips his age', 'Xue Rengui was a man of Longmen in Jiangzhou', 'His weapon is the same one the storytellers', 'Later opera won’t leave Liu', 'My husband enlisted; there is no word', 'By summer the yellow hemp');
});

// ───────────────────────────── #32 Yodong ─────────────────────────────
episode(32, 'I’m married.', (e, { P, S, D, CARD }) => {
	const gate = get(e, 'Then the Eastern Fortress itself.');
	set(e, gate, { html: gate.html.replace('Then the Eastern Fortress itself.', 'Then Yodong itself, the Eastern Fortress.'), ko: gate.ko.replace('그리고 동쪽의 성, 그 자체.', '그리고 요동, 동쪽의 성 그 자체.') });
	const shrine = get(e, 'Inside the walls there is a shrine to Jumong');
	set(e, shrine, {
		html: 'Inside the walls there is a shrine to the Holy King. Ask the town who he was and they say Jumong, as if that settles it. A coat of chain mail hangs in it, and a long sharp spear, and the town will tell you both came down from heaven. By the eighth day stones are coming over the parapet. The elders choose a girl from the town, wash her, paint her, dress her in red silk and a bride’s crown, and walk her up to the shrine to be given to the god.',
		ko: '성안에는 성왕의 사당이 있다. 성 사람들에게 그가 누구냐고 물으면 주몽이라고 한다. 그거면 다 설명된다는 듯이. 사당에는 쇠사슬 갑옷 한 벌과 날 선 긴 창이 걸려 있는데, 성 사람들은 둘 다 하늘에서 내려온 것이라고 말한다. 여드레째가 되자 성가퀴 너머로 돌이 날아든다. 어른들은 성안에서 처녀 하나를 골라 씻기고, 단장시키고, 붉은 비단과 신부의 관을 입혀, 신에게 바치러 사당으로 데려간다.'
	});
	set(e, 'They close the shrine door on her.', {
		html: 'They close the shrine door on her. The town sleeps better that night. She doesn’t.',
		ko: '그들은 아이를 들여보내고 사당 문을 닫는다. 그날 밤 성은 조금 편히 잔다. 아이는 못 잔다.'
	});
	del(e, 'which they falsely said had come down from heaven');
	const fall = set(e, 'The Holy King isn’t consulted again.', {
		html: 'The Holy King isn’t consulted again. The Blue Dragon’s throwers hurl rocks the size of grain jars over the walls. Towers roll up to the parapet. On the twelfth day a south wind rises. They fire the south-west tower, and the wind carries it into town.',
		ko: '성왕께 다시 묻는 사람은 없다. 청룡의 포차가 독만 한 돌을 성벽 너머로 날린다. 공성탑이 성가퀴에 붙는다. 열이틀째 남풍이 인다. 그들이 서남쪽 망루에 불을 지르자 바람이 불길을 성안으로 실어 간다.'
	});
	after(
		e,
		fall,
		P('The fire takes the town street by street. The shrine is stone, so it is the last roof standing when the gate gives. A Tang squad kicks its door in, looking for gold.', '불은 거리를 하나씩 삼킨다. 사당은 돌집이라, 성문이 무너질 때 서 있는 마지막 지붕이 된다. 당군 한 무리가 금붙이를 찾아 사당 문을 걷어찬다.'),
		P('They find a girl in red silk sitting under the chain mail, holding the god’s spear the wrong way round.', '그들이 찾은 건 쇠사슬 갑옷 아래 앉은 붉은 비단의 처녀 하나다. 신의 창을 거꾸로 쥐고 있다.'),
		D(BRIDE, ['Don’t.', 'I’m married.'], ['오지 마요.', '나 시집온 몸이에요.']),
		P('The soldiers laugh. Then the emperor’s horse is in the doorway, and nobody laughs.', '병사들이 웃는다. 그러다 문간에 황제의 말이 들어서고, 아무도 웃지 않는다.'),
		D('taizong', ['Whose bride is this?'], ['누구의 신부냐?'], { speaker: '👑' }),
		D({ speaker: '🪖' }, ['Their god’s, Majesty. The one who owns the armour.'], ['저들 신의 신부랍니다, 폐하. 저 갑옷 주인이요.']),
		D('taizong', ['Then We do not take another man’s wife. Not even a dead man’s.', 'Leave her to him. Let the city see what its god can do for her.'], ['그렇다면 남의 아내는 취하지 않는다. 죽은 자의 아내라도.', '그에게 두어라. 저들의 신이 그녀에게 무엇을 해 줄 수 있는지, 이 성이 보게 하라.'], { speaker: '👑' }),
		P('When the fighting stops, the clerks count ten thousand dead, then lose interest and count the grain. The fortress a million men couldn’t open has lasted twelve days.', '싸움이 그치자 서기들은 죽은 자를 만까지 세다가, 흥미를 잃고 곡식을 센다. 백만 대군이 열지 못한 성이 열이틀을 버텼다.')
	);
	set(e, 'Veterans spit and say', { html: 'Veterans spit and say the real argument is still ahead, at <b>Ansi</b>.', ko: '늙은 병사들은 침을 뱉으며 말한다. 진짜 싸움은 아직이라고. <b>안시</b>에서.' });

	const guardianFirst = set(e, 'You will simply…', {
		en: ['You will simply… have to call me the man on the wall.', 'I hear you don’t care for names anyway.'],
		lines: ['그냥… 성 위의 놈이라고 불러.', '듣자 하니 그쪽은 이름 불리는 거 질색이라며.']
	});
	before(e, guardianFirst, D('taizong', ['You. On the wall. Your name.', 'We like to know whom We are about to forgive.'], ['성 위의 자. 이름을 대라.', '짐은 용서할 자의 이름은 알아 두는 편이다.'], { speaker: '👑' }));
	set(e, 'History? I am the one writing it.', {
		en: ['A nameless man, then.', 'History will not trouble itself to remember you. We are the one writing it.'],
		lines: ['이름 없는 자로구나.', '역사는 너를 기억하는 수고를 하지 않으리라. 역사는 짐이 쓰는 것이니.']
	});
	const reply = set(e, 'Civilised? You call this civilisation', {
		en: ['Write fast, then.', 'You’ve got two hundred li of mud behind you and no road home. I’ve got a wall and all autumn.'],
		lines: ['그럼 빨리 써.', '그쪽 뒤엔 이백 리 진흙에, 돌아갈 길도 없잖아. 난 성벽 하나랑 가을 한 철이 통째로 있고.']
	});
	after(e, reply, P('The emperor does not ask twice. Nobody has ever made him ask twice. He turns his horse and starts looking at the ground around Ansi the way a cook looks at a goose.', '황제는 두 번 묻지 않는다. 누구도 그에게 두 번 묻게 만든 적이 없다. 그는 말머리를 돌리고, 요리사가 거위를 보듯 안시 주변의 땅을 살피기 시작한다.'));

	const line = set(e, 'Meanwhile the rest of the line', {
		html: 'The rest of the line comes down like roof tiles. At White Cliff, Yeon’s riders break out and put a spear into the White Dragon’s waist. He has it bound and is back in the saddle by evening, laughing.',
		ko: '나머지 방어선은 기왓장처럼 무너져 내린다. 백암성에서는 연의 기병이 뛰쳐나와 백룡의 허리에 창을 꽂는다. 백룡은 상처를 동여매고 저녁이 되기 전에 다시 안장에 오른다. 웃으면서.'
	});
	after(
		e,
		line,
		D({ speaker: 'Lord of White Cliff' }, ['He’s back on his horse. With a hole in him.', '…Open the gate. I’m not fighting a man who laughs at spears.'], ['저놈 다시 말에 올랐어. 구멍 난 채로.', '…성문 열어라. 창 맞고 웃는 놈하고는 못 싸운다.']),
		P('Of all the forts Yeon spent fourteen years hauling stone for, two still fly Goguryeo’s banners. One of them is Ansi.', '연이 십사 년 동안 돌을 날라 쌓은 성들 가운데, 아직 고구려 깃발을 단 곳은 둘뿐이다. 그중 하나가 안시다.')
	);
	del(e, get(e, 'Hyeondo', (b) => b.kind === 'table'));

	const card = e.blocks.at(-1);
	before(
		e,
		card,
		S('Pyongyang', '평양'),
		P('In Pyongyang, Gesomun reads the Yodong report twice and feeds it to the brazier.', '평양에서 개소문은 요동의 보고를 두 번 읽고 화로에 던져 넣는다.'),
		D('gesomun', ['Twelve days.', 'The Sui sat outside that wall for three summers. This one does it in twelve days!', 'Go Yeonsu. How many can you march by the new moon?'], ['열이틀.', '수나라 놈들은 그 성 앞에서 여름을 세 번 났어. 이놈은 열이틀이야!', '고연수. 그믐까지 몇이나 끌고 나갈 수 있나?'], GES),
		D('goyeonsu', ['A hundred and fifty thousand, Supreme Commander. With the Mohe horse.'], ['십오만입니다, 대막리지. 말갈 기병까지 합쳐서요.']),
		D('gesomun', ['Good. Go to Ansi. Meet him in the open and break him on the plain.', 'And take my boys with the baggage. Let them watch an emperor run.'], ['좋아. 안시로 가. 들판에서 맞붙어서 박살 내.', '내 아들놈들도 치중대에 딸려 보내. 황제가 도망치는 꼴 좀 보게.'], GES),
		P('An old officer at the end of the table clears his throat. He has been clearing it for forty years. This time he finishes.', '탁자 끝의 늙은 장교가 헛기침을 한다. 사십 년째 하는 헛기침이다. 이번에는 끝까지 한다.'),
		D(OLD, ['The open field, sir? With respect.', 'The last king who met an empire in the open… didn’t look at the ground.'], ['들판 말입니까? 송구하오나.', '마지막으로 들판에서 제국의 군대를 맞은 임금은… 땅을 보지 않으셨지요.']),
		D('gesomun', ['Then tell Go Yeonsu on the road. You’ve got four days. Make it short.'], ['그럼 가는 길에 고연수한테 해 줘. 나흘이다. 짧게.'], GES)
	);
	set(e, card, {
		html: '<b>On the road to Ansi, the old man tells it anyway. Once, a king won twice and went back for a third…!</b>',
		ko: '<b>안시로 가는 길에서 노인은 끝내 이야기를 꺼낸다. 옛날, 두 번 이긴 왕이 세 번째를 하러 나갔다…!</b>'
	});
});

// ───────────────────────────── #33 Boiling River ─────────────────────────────
episode(33, 'the part kings like to hear', (e, { P, D, CARD }) => {
	const CAPTAIN = { speaker: 'The captain', chip: '#7a6b5a' };
	set(e, 'King Dongchun picks a fight', { html: 'The old officer starts with the part kings like to hear. Goguryeo won. Twice.', ko: '늙은 장교는 왕들이 듣기 좋아하는 대목부터 꺼낸다. 고구려가 이겼다. 두 번.' });
	const spat = set(e, 'The spat is this', {
		html: 'Four hundred years back, King Dongcheon picked a fight with the northern empire of Wei. Wei sent its most famous general to explain why that was a mistake. Goguryeo met him at the Boiling River and won. Then it won again.',
		ko: '사백 년 전, 동천왕은 북쪽의 위나라에 싸움을 걸었다. 위는 그게 왜 실수인지 설명하라고 가장 이름난 장수를 보냈다. 고구려는 비류수에서 그를 맞아 이겼다. 그리고 또 이겼다.'
	});
	after(
		e,
		spat,
		D('dongchun', ['Wei’s great army is worse than our small one.', 'Their famous general? His life is in the palm of my hand.', 'Five thousand horse. We ride now.'], ['위나라 대군이 우리 소군만 못하다.', '그 이름난 장수란 놈? 그놈 목숨은 내 손바닥 안에 있다.', '철기 오천. 지금 나간다.']),
		D(CAPTAIN, ['Majesty, the ground past the river— nobody’s ridden it.', 'Let me send scouts. One afternoon.'], ['전하, 강 건너 땅은— 아무도 달려 보지 않았습니다.', '척후를 보내게 해 주십시오. 반나절이면 됩니다.']),
		D('dongchun', ['One afternoon is all I need to win.'], ['반나절이면 이기고도 남는다.'])
	);
	set(e, 'took five thousand horse out to win a third time', {
		html: 'So the king took five thousand horse out to win a third time, on ground he had not looked at. The Wei general formed a square on a slope that ran his way. The square held. The horses didn’t. Eighteen thousand men died in an afternoon.',
		ko: '그렇게 왕은 세 번째 승리를 거두러 철기 오천을 끌고 나갔다. 들여다본 적도 없는 땅으로. 위의 장수는 제 쪽으로 기운 비탈에 방진을 쳤다. 방진은 버텼다. 말들은 버티지 못했다. 한나절 만에 만 팔천이 죽었다.'
	});
	const run = set(e, 'Hwando is burned.', {
		html: 'Hwando is burned. The king runs east with a handful of men, and the Wei riders are one valley behind and closing.',
		ko: '환도성이 불탄다. 왕은 한 줌의 사람을 데리고 동쪽으로 달아나고, 위의 기병은 골짜기 하나 뒤에서 좁혀 온다.'
	});
	after(
		e,
		run,
		P('At a ford in the rain, the captain who asked for scouts holds out his hand.', '빗속의 여울목에서, 척후를 청했던 그 장교가 손을 내민다.'),
		D(CAPTAIN, ['Your robe, Majesty.', 'They’re chasing a king’s robe. Let them catch one.'], ['어의를 주십시오, 전하.', '놈들은 임금의 옷을 쫓고 있습니다. 하나 잡게 해 주지요.']),
		D('dongchun', ['…Your name. I never even asked your name.'], ['…네 이름. 내가 네 이름도 묻지 않았구나.']),
		D(CAPTAIN, ['You didn’t look at the ground either, Majesty.', 'Go.'], ['땅도 안 보셨지요, 전하.', '가십시오.']),
		P('He rides back up the valley in the king’s robe, slowly, so they can see it. They see it. Nobody on either side writes down his name.', '그는 임금의 옷을 입고 골짜기를 거슬러 천천히 올라간다. 저들이 볼 수 있게. 저들은 본다. 어느 쪽에서도 그의 이름을 적어 두지 않는다.')
	);
	del(e, 'Guanqiu Jian is Wei’s famous general', 'led twenty thousand foot and horse');
	const card = e.blocks.at(-1);
	before(
		e,
		card,
		P('On the road to Ansi, the young general hears him out politely, the way you let a grandfather finish.', '안시로 가는 길에서, 젊은 장수는 끝까지 공손히 듣는다. 할아버지 얘기를 끊지 않고 들어 드리듯이.'),
		D('goyeonsu', ['Good story, grandfather.', 'But he had five thousand horse. I have a hundred and fifty thousand men.'], ['좋은 이야기입니다, 어르신.', '그런데 그 임금은 기병 오천이었지요. 저는 십오만입니다.']),
		D(OLD, ['…So did Wei.'], ['…위나라도 그랬지요.'])
	);
	set(e, card, {
		html: '<b>A hundred and fifty thousand men march toward an open plain. On a hill above it, the emperor is waiting…!</b>',
		ko: '<b>십오만 대군이 탁 트인 들판으로 나아간다. 그 위 언덕에서 황제가 기다리고 있다…!</b>'
	});
});

// ───────────────────────────── #34 Stallion Mountain ─────────────────────────────
episode(34, 'He just didn’t think it was about him', (e, { P, S, D, CARD }) => {
	before(e, 'By summer the farmer from Longmen', P('Go Yeonsu liked the old man’s story. He just didn’t think it was about him.', '고연수는 노인의 이야기가 마음에 들었다. 다만 그게 자기 얘기라고는 생각하지 않았다.'));
	del(e, 'By summer the farmer from Longmen');
	const relief = set(e, 'Goguryeo sends a relief army', {
		html: 'The relief army comes down the crow road under banners that think numbers are an argument. <b>Go Yeonsu</b> and <b>Go Hyejin</b> ride at the front. Across the plain, under a hill, the Tang look like a single army of fifteen thousand.',
		ko: '구원군은 숫자가 곧 논리라고 믿는 깃발을 앞세우고 까마귀 길을 내려온다. <b>고연수</b>와 <b>고혜진</b>이 맨 앞에서 달린다. 들판 건너 언덕 아래, 당군은 만오천짜리 군대 하나로 보인다.'
	});
	after(
		e,
		relief,
		D(OLD, ['That isn’t all of them.', 'An emperor doesn’t come this far with fifteen thousand. Dig in. Cut his grain. Let winter do the fighting.'], ['저게 다가 아닙니다.', '황제가 고작 만오천 데리고 여기까지 오진 않습니다. 진을 치십시오. 군량을 끊고 싸움은 겨울한테 맡기십시오.']),
		D('goyeonsu', ['Winter isn’t here, grandfather. He is. In person.', 'We will never get a better chance at an emperor’s head.'], ['겨울은 아직 안 왔소, 어르신. 저자는 왔지. 몸소.', '황제 목을 칠 기회가 이보다 좋을 순 없소.']),
		P('Nobody tells Go Yeonsu about the valley behind him. A second army has gone round through it in the night, with the Black Dragon at its head.', '고연수 뒤편 골짜기 얘기는 아무도 해 주지 않는다. 밤새 또 한 무리의 군대가 그 골짜기를 돌아 들어왔다. 흑룡이 이끄는 군대다.'),
		P('At dawn, drums start on the mountain above the field. The emperor is up there with his horns and his flags, playing the battle like a court orchestra.', '새벽, 들판 위 산에서 북이 울리기 시작한다. 황제가 그 위에서 뿔나팔과 깃발로, 궁중 악단 부리듯 싸움을 연주한다.')
	);
	del(e, 'He is not the other Xue.');
	set(e, 'No one in the Goguryeo line stops him', {
		html: 'No one in the Goguryeo line stops him for long. Then the drums on the mountain change, and the Black Dragon’s banners come out of the valley behind them. The relief army turns to face the wrong way twice. The formation breaks. The mountain learns a new colour.',
		ko: '고구려 진에서 그를 오래 막아서는 자는 없다. 그때 산 위의 북소리가 바뀌고, 뒤편 골짜기에서 흑룡의 깃발이 쏟아져 나온다. 구원군은 엉뚱한 쪽으로 두 번 돌아선다. 진이 무너진다. 산이 새로운 색 하나를 배운다.'
	});
	del(e, 'our army gave way. The main army followed through');
	after(
		e,
		'They give him gold, silk',
		P('That night he has a clerk write home for him. Two lines. The mounds can be finished properly now. Liu should buy the good stone.', '그날 밤 그는 서기를 시켜 집에 편지를 쓴다. 두 줄이다. 이제 무덤을 제대로 마무리할 수 있다. 유씨는 좋은 돌을 사라.'),
		P('Go Yeonsu pulls what is left onto a hill to regroup. Behind the hill, the Tang have already burned the bridges. Nobody goes home the way they came. The emperor likes that trick.', '고연수는 남은 군을 수습하려고 언덕 위로 물린다. 언덕 뒤의 다리는 당군이 이미 불태웠다. 왔던 길로 돌아가는 자는 없다. 황제가 아끼는 수법이다.')
	);
	const robe = get(e, 'Reaching Liaodong, he fought the men of Goguryeo');
	before(
		e,
		robe,
		D('taizong', ['Who is this?', 'He is further in than any of Ours.'], ['이자는 누구냐?', '짐의 군사 누구보다 깊이 들어갔구나.']),
		D('lishiji', ['A Silla man, Majesty. Sul Gedu.', 'His friends say he wanted a cap, a sash and a sword. At your side.'], ['신라 사람입니다, 폐하. 설계두라 합니다.', '동료들 말이, 폐하 곁에서 관과 띠와 칼을 받는 게 평생 소원이었답니다.']),
		D('taizong', ['Our own men look about them and will not advance. A foreigner dies for Us.', 'Give him the rank. Bury him with full rites.'], ['짐의 군사들은 죽음이 두려워 두리번거리며 나아가지 않는데, 이방 사람이 짐을 위해 죽었구나.', '벼슬을 내려라. 예를 갖추어 장사 지내라.']),
		P('Then he takes off the imperial robe and lays it over the dead man himself.', '그러고는 손수 어포를 벗어 죽은 이 위에 덮는다.')
	);
	del(e, robe);
	del(e, 'Where is the ji.', 'A farmer asking for his farming tool', 'Then a runner comes up the stair', 'the way a chained animal hears the key');
	set(e, 'is coming this way.', {
		en: ['The Second Emperor… is coming this way.', 'Tonight. With silver, to buy back the man in white. Holy King, look down.'],
		lines: ['황제… 이쪽으로 온다.', '오늘 밤. 흰옷 입은 놈을 은으로 사 가겠다고. 성왕이시여, 굽어살피소서.']
	});
	set(e, 'Among the prisoners taken at the mountain', {
		html: 'Among the prisoners taken at the mountain are two boys, eleven and eight: Gesomun’s sons, the careful one and the one who never backs down first. Their father sent them with the baggage to watch an emperor run.',
		ko: '주필산에서 잡힌 포로 가운데 열한 살, 여덟 살 난 사내아이 둘이 있다. 개소문의 아들들이다. 조심성 많은 맏이와, 먼저 물러서는 법이 없는 둘째. 황제가 도망치는 꼴을 보라며 아버지가 치중대에 딸려 보낸 아이들이다.'
	});
	const card = e.blocks.at(-1);
	before(
		e,
		card,
		S('Pyongyang', '평양'),
		P('The news reaches Pyongyang in two pieces. The field army is gone. The boys are in the emperor’s tent.', '소식은 두 토막으로 평양에 닿는다. 들판의 군대는 사라졌다. 아이들은 황제의 막사에 있다.'),
		D('gesomun', ['Both of them?'], ['둘 다?'], GES),
		D({ speaker: 'Rider' }, ['Both, Supreme Commander. The emperor sends word he will be kind to them.'], ['둘 다입니다, 대막리지. 황제가 아이들에게 너그럽게 하겠다고 전해 왔습니다.']),
		D('gesomun', ['Kind.', 'A man who killed his brothers is being kind to my sons.'], ['너그럽게.', '제 형제를 죽인 놈이 내 아들들한테 너그럽겠다고.'], GES),
		P('The hall waits for him to break something. He doesn’t. He calls for a map and puts his thumb on the one fort still flying the old king’s colours. The fort that refused him.', '대청은 그가 뭔가 부수기를 기다린다. 그는 부수지 않는다. 지도를 가져오게 하고, 아직 옛 왕의 깃발을 단 성 하나에 엄지를 얹는다. 그를 거부한 성이다.'),
		D('gesomun', ['Ansi. That madman.', 'When I was seven, my father came home from the Colossal River with a Sui flag under his arm. I thought flags grew on emperors.', 'Let him come deep. The last one did.'], ['안시. 그 미친 놈.', '내가 일곱 살 때, 아버지가 살수에서 수나라 깃발을 옆구리에 끼고 돌아왔어. 난 깃발이 황제한테서 열리는 열맨 줄 알았지.', '깊이 들어오라 그래. 저번 놈도 그랬어.'], GES)
	);
	set(e, card, {
		html: '<b>Why isn’t Gesomun afraid? Go back thirty-three years, to a general who surrendered seven times and won…!</b>',
		ko: '<b>개소문은 왜 두려워하지 않는가? 서른세 해 전으로 가 보자. 일곱 번 항복하고 이긴 장수가 있었다…!</b>'
	});
});

// ───────────────────────────── #35 Colossal River ─────────────────────────────
const RIVER = 'When the army is halfway over, Goguryeo comes down';
episode(
	35,
	'Every time, the river gets closer.',
	(e, { P, S, D }) => {
		const SUI = { speaker: 'Sui general', chip: '#8a7a3a' };
		const OFF = { speaker: 'Sui officer', chip: '#8d8d95' };
		const M = (en, ko) => D('munduk', en, ko);
		const map1 = get(e, 'Nine armies over the Liao');
		const place = e.blocks.find((b) => b.kind === 'place');
		const map2 = get(e, 'They marched to within thirty li');
		const poem = e.blocks.find((b) => b.kind === 'poem');
		const count = get(e, 'When the nine armies crossed the Liao');
		const title = get(e, 'Munduk is honored with the title');
		const card = e.blocks.at(-1);
		e.blocks.splice(
			0,
			e.blocks.length,
			P('Ulchi Munduk surrenders seven times on the way south. Every time, the river gets closer.', '을지문덕은 남쪽으로 내려가는 길에 일곱 번 항복한다. 그때마다 강이 가까워진다.'),
			map1,
			P('Gesomun is seven that summer. The last dynasty’s emperor has sent three hundred thousand men at Pyongyang. Goguryeo sends one man to look at them.', '그해 여름 개소문은 일곱 살이다. 지난 왕조의 황제가 삼십만 대군을 평양으로 보냈다. 고구려는 그들을 구경하라고 사람 하나를 보낸다.'),
			place,
			S('The Sui Camp', '수나라 진영'),
			P('Munduk walks into the enemy camp himself first, to look at them. He brings a white flag, a polite face and no guards. He has come, he says, to surrender.', '을지문덕은 먼저 몸소 적진으로 걸어 들어가 그들을 살핀다. 흰 깃발 하나, 공손한 얼굴 하나, 호위는 없다. 항복하러 왔다고 한다.'),
			D(SUI, ['Goguryeo surrenders? Just like that?'], ['고구려가 항복한다고? 이렇게 쉽게?']),
			M(['Just like that, General.', 'We are a small country. You are a very large army.', '…How long have your men carried their own rice? They look tired.'], ['이렇게 쉽게 말입니다, 장군.', '저희는 작은 나라고, 장군께선 아주 큰 군대시니까요.', '…병사들이 제 군량을 지고 다닌 지 얼마나 됐습니까? 다들 지쳐 보이는군요.']),
			P('A hundred days of rice each, on their own backs. At night most of them bury half of it under the tent to lighten the load. Munduk notices the fresh dirt.', '한 사람당 백 일 치 쌀을 제 등에 졌다. 밤이면 대부분 짐을 덜려고 막사 밑에 절반을 묻는다. 을지문덕은 갓 뒤집힌 흙을 본다.'),
			D(SUI, ['The emperor’s orders are to seize you if you come.'], ['황상의 명은, 네가 오면 붙잡으라는 것이다.']),
			D(OFF, ['General— if we seize an envoy who came to surrender, nobody will ever surrender to us again.'], ['장군— 항복하러 온 사신을 잡으면 앞으로 아무도 우리한테 항복하지 않을 겁니다.']),
			P('So they let him walk out. He has seen everything he came for. By evening the general regrets it and sends a rider after him: come back, there is more to discuss.', '그래서 그들은 그를 걸어 나가게 둔다. 그는 보러 온 것을 다 보았다. 저녁이 되자 장군은 후회하고 기병 하나를 뒤쫓아 보낸다. 돌아오라, 더 의논할 것이 있다.'),
			M(['Tell the general I’m flattered.', 'Tell him we can discuss it further south.'], ['장군께 영광이라고 전하게.', '의논은 남쪽에서 마저 하자고 전하게.']),
			S('Seven', '일곱 번'),
			P('He surrenders seven times on the way south and runs seven times. Each time the Sui win a small fight, plant a flag and feel wonderful. Each running pulls them further from their buried rice and closer to Pyongyang.', '그는 남쪽으로 가는 길에 일곱 번 항복하고 일곱 번 달아난다. 그때마다 수나라는 작은 싸움에서 이기고, 깃발을 꽂고, 기분이 아주 좋다. 달아날 때마다 그들은 묻어 둔 쌀에서 멀어지고 평양에 가까워진다.'),
			D(SUI, ['Seven victories in a day! Write that down.'], ['하루에 일곱 번 이겼다! 받아 적어라.']),
			D(OFF, ['General… we have won seven times and taken nothing. Not one granary.'], ['장군… 일곱 번 이겼는데 얻은 게 없습니다. 곳간 하나도요.']),
			map2,
			P('Thirty li from Pyongyang, the army stops and looks at the walls. The walls look back. Then a letter arrives from Munduk. It is a poem.', '평양 삼십 리 앞에서 군대는 멈춰 성벽을 바라본다. 성벽도 마주 본다. 그때 을지문덕의 편지가 온다. 시다.'),
			poem,
			D(SUI, ['Is he… praising me?'], ['이자가… 나를 칭찬하는 건가?']),
			D(OFF, ['He’s telling you to go home, General.'], ['집에 가시라는 겁니다, 장군.']),
			P('A second note follows, plainer. If the Sui turn around, the king of Goguryeo will come and bow to their emperor in person. It is the eighth surrender. The general takes it, because it is the only one he can carry home.', '두 번째 편지가 뒤따른다. 이번엔 쉬운 말이다. 수나라가 군을 돌리면 고구려 왕이 몸소 황제께 나아가 절하겠다. 여덟 번째 항복이다. 장군은 받아들인다. 집에 들고 갈 수 있는 건 그것뿐이니까.'),
			S('The River', '살수'),
			P('They turn for home starving. At the Colossal River the water is low and wide, and the army starts across.', '그들은 굶주린 채 돌아선다. 살수의 물은 얕고 넓다. 군대가 건너기 시작한다.'),
			M(['Wait.', '…Wait.', 'Now. While their feet are wet.'], ['기다려.', '…기다려.', '지금이다. 발이 젖었을 때.']),
			P(`${RIVER} on the rearguard. Men on the far bank can’t come back. Men on the near bank can’t get over. The ones in the middle find out how deep a shallow river is.`, '군대가 절반쯤 건넜을 때 고구려가 후군을 덮친다. 건너편에 닿은 자들은 돌아올 수 없다. 이쪽에 남은 자들은 건너갈 수 없다. 한가운데 있던 자들은 얕은 강이 얼마나 깊은지 알게 된다.'),
			count,
			title,
			P('Gesomun’s father rides home through the Pyongyang gate with a Sui banner rolled under his arm like a bolt of cloth. The boy at the gate decides, then and there, what emperors are for.', '개소문의 아버지는 수나라 깃발을 비단 필처럼 옆구리에 말아 끼고 평양 성문으로 돌아온다. 성문에 선 아이는 그 자리에서 정한다. 황제란 무엇에 쓰는 것인지.'),
			D({ speaker: 'The boy', chip: '#d0362f' }, ['Is that the emperor’s?'], ['그거 황제 거예요?']),
			D({ speaker: 'His father', chip: '#8a3a2a' }, ['One of them. Emperors have plenty.', 'They drop them when they run. Here. Hold it by the pole, not the silk.'], ['그중 하나지. 황제한텐 많아.', '도망칠 때 흘리고 가거든. 자. 비단 말고 장대를 잡아라.']),
			card
		);
	},
	{
		'Emperor Yang of Sui invades Goguryeo in the year 612.': 'Ulchi Munduk surrenders seven times on the way south.',
		'On the Colossal River, Ulchi': RIVER,
		'The Salsu, 612 Of 305,000': RIVER
	}
);

// ───────────────────────────── #36 Ansi ─────────────────────────────
episode(36, 'You’re not him either.', (e, { P, S, D, CARD }) => {
	del(e, 'They will not give us his name.', 'the Eternal General is standing behind him', 'The ring at his hip', 'Six hundred li to the south');
	set(e, 'The Second Emperor tries the wall first', {
		html: 'The Second Emperor tries the wall first. When the wall does not work he tries the ground, which is the sort of thing only an empire can afford to try. Goguryeo archers watch him do it from the parapet.',
		ko: '황제는 먼저 성벽을 쳐 본다. 성벽이 안 되자 땅을 쳐 본다. 제국이나 되어야 해 볼 수 있는 짓이다. 고구려 궁수들이 성가퀴에서 그 꼴을 지켜본다.'
	});
	after(e, 'Then it’s sixty nights for us', P('Inside the walls the stone runs out first. Then the doors. Then the roof beams of the houses nearest the south wall. Families sleep in the open and pass their own lintels up the ladder.', '성안에서는 돌이 먼저 떨어진다. 다음은 문짝이다. 그다음은 남쪽 성벽 가까운 집들의 서까래다. 사람들은 한데서 자고, 제 집 문지방을 사다리 위로 올려 보낸다.'));
	const helm = set(e, 'the lacquered bowl leaves his head', {
		html: 'The arrow takes the helmet clean off. The lacquered bowl leaves his head and rings once on packed earth, then keeps rolling. For the first time in the siege, the two men look straight at each other.',
		ko: '화살이 투구를 깨끗이 벗겨 낸다. 옻칠한 투구가 머리를 떠나 다진 흙 위에서 한 번 울리고는 계속 굴러간다. 포위가 시작된 뒤 처음으로, 두 사내가 서로를 똑바로 바라본다.'
	});
	before(
		e,
		helm,
		P('On the second day the Guardian sees him: a yellow parasol on the near slope, closer than any emperor should be. He takes the bow from the archer beside him.', '이틀째, 성주의 눈에 그가 들어온다. 가까운 비탈 위의 누런 일산. 어느 황제도 그렇게 가까이 와선 안 된다. 성주는 옆의 궁수에게서 활을 받아 든다.'),
		D('yangmanchun', ['Hold still, you.'], ['가만있어 봐, 이 양반아.'])
	);
	after(
		e,
		helm,
		D('taizong', ['…That man.', 'Find out his name.'], ['…저자.', '저자의 이름을 알아 오라.']),
		P('Nobody can. A cut over the emperor’s eye bleeds into his beard. The surgeons say it is nothing, and he lets them.', '아무도 알아 오지 못한다. 황제의 눈썹 위 상처에서 피가 수염으로 흘러든다. 의원들은 별것 아니라 하고, 그는 그렇게 믿어 준다.')
	);
	const cold = set(e, 'Then the cold comes early', {
		html: 'Then the cold comes early. Sixty days of hauling earth were sixty days of horses eating the plain, and the plain is bare. There is nothing left to feed them.',
		ko: '그러다 추위가 일찍 온다. 흙을 나른 예순 날은 말들이 들판을 뜯어 먹은 예순 날이기도 했다. 들판은 맨땅이다. 말을 먹일 것이 남지 않았다.'
	});
	const crazier = set(e, 'you will never be crazier than we are', {
		en: ['Tell him thanks for the silk.', 'And tell him this. You may outnumber us. You may outthink us.', 'But you will never be crazier than we are…!'],
		lines: ['비단 고맙다고 전해.', '그리고 이것도. 수가 많은 것도 알고, 머리가 좋은 것도 알겠소.', '그런데 당신들은 절대로 우리보다 미치지는 못할 거요…!']
	});
	const humiliated = set(e, 'With all the armies under heaven', {
		en: ['With all the armies under heaven, how was I humiliated by so small a barbarian land?', '…If the old minister were alive, he would never have let me come.', 'Somebody tell me no. Anybody.'],
		lines: ['내가 천하의 군사를 가지고도 작은 오랑캐에게 곤욕을 당한 것은 무엇 때문인가?', '…그 노신이 살아 있었다면, 짐을 결코 오게 두지 않았을 것을.', '누가 아니라고 말해 보라. 아무라도.']
	});
	const map = get(e, 'All those arrows in');
	const madman = get(e, 'Still — he does what must be done.');
	const card = e.blocks.at(-1);
	del(e, 'That day, for the first', 'Had [the Grand Minister]', 'added to the Great Heroes', 'On the day the army turned for home', 'He paraded his troops below Ansi', 'history has lost his name');
	for (const b of [crazier, humiliated, map, madman]) del(e, b);
	after(
		e,
		cold,
		P('On the morning he turns for home, the emperor parades his army under the wall one last time, so the wall can see what it beat. Inside, nobody shows a face. Then one man climbs the parapet and bows.', '회군하는 날 아침, 황제는 마지막으로 성 아래에서 군을 사열한다. 성이 무엇을 이겼는지 보라는 듯이. 성안에서는 아무도 얼굴을 내밀지 않는다. 그러다 한 사내가 성가퀴에 올라 절을 한다.'),
		P('A proper bow, from the waist. The kind you give a guest who stayed too long.', '허리를 굽힌 제대로 된 절이다. 너무 오래 머문 손님에게 하는 그런 절.'),
		D('taizong', ['Bring up the silk. A hundred bolts.', 'For a man who serves his lord well. Let every wall in Our empire hear of it.', 'And ask him his name. Once more.'], ['비단을 올려라. 백 필이다.', '제 주군을 잘 섬긴 자에게 주는 것이다. 짐의 천하 모든 성이 듣게 하라.', '그리고 이름을 물어라. 한 번 더.']),
		crazier,
		P('The silk goes up the wall on a rope. The name does not come down.', '비단은 밧줄에 매달려 성벽을 올라간다. 이름은 내려오지 않는다.'),
		P('Then the marsh. Two hundred li of mud, and the road across it is the road he tore up himself. Nobody goes home the way they came. He said that.', '그리고 늪이다. 이백 리 진흙. 그 위를 건너던 길은 그가 손수 걷어 낸 길이다. 왔던 길로 돌아가는 자는 없다. 그가 한 말이다.'),
		P('Snow comes down on the column in the mud. The emperor gets off his horse and cuts brush with his own hands to fill the ruts. His officers can’t be seen carrying less.', '진흙 속 행렬 위로 눈이 내린다. 황제는 말에서 내려 손수 덤불을 베어 바퀴 자국을 메운다. 장수들은 황제보다 적게 나르는 모습을 보일 수 없다.'),
		humiliated,
		P('Nobody does. That was the whole trouble.', '아무도 말하지 않는다. 처음부터 그게 문제였다.'),
		map,
		S('The Gate', '성문'),
		P('Three weeks later a rider in red comes up the empty road from Pyongyang, alone. The last time he came, he looked at this wall and rode away.', '세 주쯤 뒤, 붉은 옷의 기수 하나가 평양에서 텅 빈 길을 홀로 올라온다. 지난번에 왔을 때 그는 이 성벽을 보고 말머리를 돌렸다.'),
		D('yangmanchun', ['Supreme Commander! Come for my head, now the work’s done?'], ['대막리지 나리! 일 다 끝났으니 이제 내 목 가지러 왔나?']),
		set(e, madman, { en: ['Madman…', 'Still — you did what had to be done.'], lines: ['미친 놈...', '그래도 할 일은 했네.'], look: 'supreme' }),
		D('gesomun', ['Keep your head. Keep your old colours. Keep your gate shut, I don’t care.', 'I came to see what stopped him. It’s smaller than I thought.'], ['목은 갖고 있어. 옛 깃발도 달고 있고. 성문도 닫아 두든가, 상관없어.', '뭐가 그놈을 막았나 보러 왔어. 생각보다 작네.'], GES),
		D('yangmanchun', ['So’s the emperor, up close.'], ['황제도 가까이서 보니 작던데.']),
		P('Gesomun laughs, a laugh like a slap, and turns his horse. He does not ask to come in. The Guardian does not offer.', '개소문은 따귀 같은 웃음을 터뜨리고 말머리를 돌린다. 들여보내 달라고 하지 않는다. 성주도 권하지 않는다.'),
		S('Yodong', '요동'),
		P('He rides home by way of Yodong. The Tang marched its people west when they left, seventy thousand of them, roped in lines. What is left is ash, and a stone shrine on the hill with its door open.', '그는 요동을 거쳐 돌아간다. 당군은 물러가며 성 사람들을 서쪽으로 끌고 갔다. 칠만 명을 줄줄이 엮어서. 남은 건 재와, 언덕 위 문 열린 돌 사당 하나다.'),
		P('Under the chain mail sits a girl in red silk gone the colour of rust. A lamp beside her. She has kept it lit for three months on what the soldiers left behind.', '쇠사슬 갑옷 아래, 녹슨 빛이 된 붉은 비단의 처녀 하나가 앉아 있다. 곁에 등잔이 있다. 병사들이 버리고 간 것으로 석 달째 불을 지켜 왔다.'),
		D(BRIDE, ['You’re not him either.'], ['아저씨도 그분 아니죠.']),
		D('gesomun', ['Who?'], ['누구?'], GES),
		D(BRIDE, ['My husband. Everybody else went west. The emperor said I belonged to him, so they left me here.', '…Nobody ever told me who he is. They just gave me to him.'], ['내 신랑이요. 다른 사람들은 다 서쪽으로 갔어요. 황제가 나는 그분 거라고 해서 나만 두고 갔어요.', '…그분이 누군지 아무도 안 알려 줬어요. 그냥 나를 줬어요.']),
		D('gesomun', ['Nobody told you.', '…Ha. Move over. It’s a long one. It starts with a god looking down at a girl in a river.'], ['아무도 안 알려 줬다.', '…하. 좀 비켜 앉아. 얘기가 길어. 신 하나가 강물 속 계집애를 내려다본 데서 시작하지.'], GES)
	);
	set(e, card, {
		html: '<b>Who was the Holy King, and why does Goguryeo give him brides? Seven hundred years back, the sun looked down…!</b>',
		ko: '<b>성왕은 누구였고, 고구려는 왜 그에게 신부를 바치는가? 칠백 년 전, 해가 내려다보았다…!</b>'
	});
});

// ───────────────────────────── #37 Haemosu ─────────────────────────────
episode(37, 'Today he looks down.', (e, { P, D }) => {
	e.blocks.unshift(P('Every day the sun crosses the sky on the same road. Today he looks down.', '해는 날마다 같은 길로 하늘을 건넌다. 오늘, 그가 내려다본다.'));
	const wall = get(e, 'He puts her back to it anyway.');
	set(e, wall, { html: wall.html.replace('The copper is already hot. ', ''), ko: wall.ko.replace('구리는 이미 뜨겁다. ', '') });
	after(
		e,
		'The copper keeps the afternoon.',
		P('Up on the road, the dragons have hauled an empty chariot to dusk on their own. Half the world got its evening late. Heaven noticed.', '하늘 길 위에선 용들이 빈 수레를 저희끼리 끌고 해 질 녘까지 갔다. 세상 절반이 저녁을 늦게 맞았다. 하늘이 알아챘다.'),
		D('haemosu', ['They’re calling.', 'I’m late. I’m never late.'], ['부른다.', '늦었어. 난 늦는 법이 없는데.']),
		D('yuhwa', ['Go, then.', '…Come back tomorrow. Same hour. I’ll break it for you this time.'], ['그럼 가요.', '…내일 또 와요. 같은 시각에. 이번엔 내가 깨 줄게요.']),
		D('haemosu', ['They won’t let me come down twice. Not while I’m up there.', 'Hey. Don’t look at me like that. I’ll find a way.'], ['두 번은 안 내려 보내 줘. 해 떠 있는 동안은.', '야. 그런 눈으로 보지 마. 방법 찾을게.']),
		P('He goes up in a flash of copper. Heaven fines the sun the only way it can: while he is in the sky, he may not set foot on the earth. He may look. He may talk. That is all.', '그는 구릿빛 섬광 속에 올라간다. 하늘이 해에게 내릴 수 있는 벌은 그것뿐이다. 하늘에 떠 있는 동안에는 땅을 밟지 못한다. 볼 수는 있다. 말할 수도 있다. 거기까지다.')
	);
	del(e, 'I am Habek’s daughter, and my name is Yuhwa.', 'Geumwa found her strange and shut her away', 'Habek’s daughter was shut in a room by the king of Buyeo');
});

// ───────────────────────────── #38 Buyeo ─────────────────────────────
episode(38, 'The egg declines.', (e, { P, D }) => {
	before(e, 'Dogs and pigs will not eat it', P('Buyeo tries very hard to get rid of the egg. The egg declines.', '부여는 그 알을 치우려고 무진 애를 쓴다. 알은 사양한다.'));
	set(e, 'They name him', {
		html: 'They name him <b>Jumong</b>, the good shot, because in those days people were named for what heaven had plainly already decided. He grows up with Geumwa’s sons, Daeso and Galsa.',
		ko: '그들은 아이를 <b>주몽</b>, 활 잘 쏘는 이라 부른다. 그 시절엔 하늘이 이미 정해 둔 것을 이름으로 붙였다. 아이는 금와의 아들 대소, 갈사와 함께 자란다.'
	});
	del(e, 'They grow apart in the same square', 'will not stay to be the second smile', 'The king did not listen, and set him to tending the horses');
	after(e, 'refuses the knife and gives the foundling a chore', P('The stables come with three boys who smell worse than he does. Oi, who is always already packing. Mari, who asks why. Hyupbo, who carries the extra. By the end of the month they are his.', '마구간에는 그보다 냄새 고약한 사내아이 셋이 딸려 있다. 늘 짐부터 싸 두는 오이. 왜냐고 묻는 마리. 남는 짐을 드는 협보. 달이 다 가기 전에 셋은 그의 사람이 된다.'));
	const knife = set(e, 'Before the next hunt,', {
		html: 'Before the next hunt, a knife comes through the dark of his room. Lady Ye’s lamp is still lit, so the shadow moves on the wall before the man does. Jumong rolls. The blade goes into the quilt up to the hilt.',
		ko: '다음 사냥이 오기 전, 어둠 속에서 칼 하나가 그의 방으로 들어온다. 예씨 부인의 등잔이 아직 켜져 있어, 사내보다 그림자가 먼저 벽 위에서 움직인다. 주몽이 구른다. 칼날이 손잡이까지 이불에 박힌다.'
	});
	after(e, knife, P('The man runs. He wears a palace sleeve, and he runs toward Daeso’s end of the hall.', '사내는 달아난다. 궁의 소매를 입었고, 대소의 처소 쪽으로 달린다.'));
	after(
		e,
		'Leave Buyeo. Tonight.',
		P('He takes his sword down from the wall and breaks it across the seven-sided stone under the pine pillar. It takes two tries. He is not a swordsman.', '그는 벽에서 칼을 내려, 소나무 기둥 밑 일곱 모 주춧돌에 대고 꺾는다. 두 번 만에 부러진다. 그는 칼잡이가 아니다.'),
		D('jumong', ['Half stays. In the crack, under the pillar.', 'If it’s a boy, tell him: under the pine, on the seven-sided stone. He’ll work it out.'], ['반은 여기 둬. 기둥 밑 틈에.', '아들이면 말해 줘. 소나무 아래, 일곱 모 돌 위. 알아서 찾을 거야.']),
		D('ladyye', ['And if it’s a girl?'], ['딸이면?']),
		D('jumong', ['Then she’ll work it out faster.'], ['그럼 더 빨리 찾겠지.'])
	);
	const fetch = get(e, 'I’ll leave my little brother alone');
	set(e, fetch, {
		en: fetch.en.map((l) => (l.startsWith('I’ll leave my little brother') ? 'You’re my little brother and it’s your first week. I’ll go easy on you.' : l)),
		lines: fetch.lines.map((l) => (l.startsWith('아우가 새 일') ? '넌 내 아우고, 이 일 맡은 지 이레도 안 됐지. 살살 해 줄게.' : l))
	});
	del(e, 'Jumong spoke to the water', 'Thereupon the fish and turtles formed a bridge');
});

// ───────────────────────────── #39 Jolbon ─────────────────────────────
episode(39, 'Look what they do in your name.', (e, { P, S, D, CARD }) => {
	const isP = (t) => (b) => b.kind === 'p' && b.html === t;
	del(e, 'A merchant’s daughter who reads a valley');
	after(
		e,
		'He gives it back, and the wood stays as it was',
		D('yeontabal', ['Wife?'], ['마누라는?']),
		D('jumong', ['…One. In Buyeo. She told me to run.', 'So I ran.'], ['…하나 있소. 부여에. 도망치라 하더이다.', '그래서 도망쳤소.']),
		P('At her father’s shoulder, the woman with the tally-stick makes a small mark she did not need to make.', '아버지 어깨 옆에서, 셈대를 든 여자가 굳이 안 해도 될 금을 하나 긋는다.')
	);
	// The tsundere loop: keep the nickname, the "worker", the bucket.
	del(e, 'She points him at the west millet', 'Wrong stack. Do it again.', 'She makes him wring the rope', 'Pull. Don’t chat with the rope.', 'She tells the yard, and herself');
	del(e, 'So how long has it been.', 'don’t grin like you found something', 'Then why are you furiously blushing', 'I’m also not stopping.', get(e, 'Move.', (b) => b.kind === 'dialogue' && b.en.length === 1 && b.en[0] === 'Move.'), get(e, 'Hi.', (b) => b.kind === 'dialogue' && b.en[0] === 'Hi.'), 'Around. Big idiot.', 'Well’s that way.', 'Other water exists.', 'You’re fun when you’re like this.', 'I’m not fun.');
	del(e, 'Sosuno lies on her thatched bed', 'She tries to fight it with a count', 'His face comes first, then the rest of him', 'The first night does not leave the bed');
	// The keepsakes become the fight about Buyeo.
	set(e, 'You’re beautiful when you lie.', { en: ['You’re keeping a little me in a cloth.', 'Want it back so you can steal it again?'], lines: ['천 쪼가리에 나 하나 쟁여 놨네.', '다시 훔치게 돌려줄까?'] });
	set(e, 'Pretty, my foot', {
		en: ['Keep— ha— keep you?', 'Go get kept somewhere else. Buyeo. Somebody’s keeping a lamp lit for you there, right? A wife with a lamp.', 'I’m not your— I’m not anybody’s spare bucket.'],
		lines: ['간직— 하— 누가 누굴 간직해?', '딴 데 가서 간직돼. 부여. 거기 등잔 켜 놓고 기다리는 사람 있잖아. 등잔 든 마누라.', '난 니— 난 누구 여분 두레박 아니거든.']
	});
	set(e, 'He stops smiling.', {
		html: 'He stops smiling. Not angry. Done. He doesn’t lie about the lamp. He has never once lied to her, which is its own kind of problem. He unslings the bow and lays it on packed earth at the well-rim. Then he walks.',
		ko: '그는 웃음을 거둔다. 화난 게 아니다. 끝난 거다. 등잔 얘기에 거짓말하지 않는다. 그는 그녀에게 한 번도 거짓말을 한 적이 없고, 그게 또 문제다. 활을 풀어 우물 가장자리 다진 흙 위에 내려놓는다. 그리고 걷는다.'
	});
	set(e, 'Tell the millet thanks.', {
		en: ['She told me to run. I ran.', 'I’m not gonna stay in your yard as something you hide behind a post.', 'Keep the bow. Tell the millet thanks.'],
		lines: ['그 사람이 도망치라 했고, 난 도망쳤어.', '네 마당에서 기둥 뒤에 숨겨 두는 물건으로 살진 않을래.', '활은 가져. 기장한테 고맙다고 전해 줘.']
	});
	set(e, 'She does not call stay.', {
		html: 'She does not call stay. She picks the bow up too fast: the bow her father could not bend. She bends it. One arrow. The timber well-beam beside his ear takes it. He stops.',
		ko: '그녀는 가지 말라고 부르지 않는다. 너무 서둘러 활을 집어 든다. 아버지도 당기지 못한 그 활이다. 그녀는 당긴다. 화살 하나. 그의 귀 옆 우물 들보에 박힌다. 그가 멈춘다.'
	});
	set(e, 'From the first look.', {
		en: ['From the first look.', 'Buyeo was a hall’s idea. This one’s mine.', 'Give me your mouth… first.', 'Country later.'],
		lines: ['처음 본 순간부터.', '부여는 대청이 정해 준 거고. 이건 내가 고른 거야.', '입… 먼저 줘.', '나라는 나중에.']
	});
	// Grain room, halved.
	del(e, 'furious at the fit and more furious', get(e, 'Look at my back.', (b) => b.kind === 'dialogue' && b.en[0] === 'Look at my back.'), 'Look at you talking.', 'I said destroy', 'I’ve got you.');
	del(e, get(e, 'Little Sosuno.', isP('Little Sosuno.')), 'She mouths idiot at the timber');
	set(e, 'My daughter—', { en: ['Eat.', 'Road can wait.', 'My daughter bent your bow, I hear. I couldn’t—'], lines: ['먹어.', '길은 나중에.', '내 딸이 네 활을 당겼다더군. 난 못 했는데—'] });
	// The founding: one ditch, played.
	del(e, 'Five roofs, five chiefs, five animals');
	const ditch = set(e, 'He does not conquer them.', {
		html: 'He does not conquer them. He walks the five yards with the same grin he used on Sosuno. At the worst ditch, two cousins stand with a knife each. Jumong climbs down between them and sits in the mud, bow unstrung.',
		ko: '그는 그들을 정복하지 않는다. 소서노에게 쓰던 그 웃음을 달고 다섯 마당을 돈다. 가장 고약한 도랑에는 사촌 둘이 칼을 하나씩 들고 서 있다. 주몽은 그 사이로 내려가 진흙에 주저앉는다. 활은 풀어 둔 채다.'
	});
	after(
		e,
		ditch,
		D({ speaker: 'Crow cousin' }, ['Out of the ditch, slave.', 'This is family.'], ['도랑에서 나와, 종놈아.', '집안일이다.']),
		D('jumong', ['Okay, okay. I’m just sitting.', 'Nice ditch. Who dug it?'], ['알았어, 알았어. 앉아만 있을게.', '도랑 잘 팠네. 누가 팠어?']),
		D({ speaker: 'Cliff cousin' }, ['…Our grandfathers. Together.'], ['…우리 할아버지들이. 같이.']),
		D('jumong', ['Huh. Together.', 'So they could share a shovel, and you two can’t share a puddle.'], ['어. 같이.', '할아버지들은 삽 하나를 나눠 썼는데, 너넨 물웅덩이 하나를 못 나누네.']),
		P('Nobody says anything for a while. Then the Crow cousin laughs, because the alternative is looking stupid, and the knives go back in the belts.', '한동안 아무도 말이 없다. 그러다 까마귀 집 사촌이 웃음을 터뜨린다. 안 그러면 바보가 되니까. 칼이 허리띠로 돌아간다.')
	);
	after(
		e,
		'What he calls a talk',
		P('That week three men ride into Jolbon on one very fat horse.', '그 주에 사내 셋이 아주 뚱뚱한 말 한 마리에 올라타고 졸본으로 들어온다.'),
		D('oi', ['You said fatten him up.', 'We fattened him up.'], ['살찌우라며.', '살찌웠어.']),
		D('jumong', ['Okay. Okay. He’s beautiful.', '…He can’t run anymore, can he.'], ['그래. 그래. 예쁘다.', '…이제 못 뛰지, 얘?']),
		D('mari', ['Can’t run. Can’t climb. Eats like a hall.', 'Took us a month to find you. Where’s our roof?'], ['못 뛰어. 못 올라. 먹기는 대청만큼 먹고.', '너 찾느라 한 달 걸렸다. 우리 지붕은 어디야?'])
	);
	// Codas: one, in order.
	del(e, 'She lived as a widow in Jolbon', 'He sleeps beside a queen', 'In the new room the dusty-rose', 'Like a queen, then.', 'The blushing queen still hides', 'I’m blushing— don’t');
	del(e, get(e, 'The Pine Kingdom', (b) => b.kind === 'scene'), 'Word reaches the millet porch', 'It is the Pine Kingdom', get(e, 'Old trees, older pride'), get(e, 'King of the Pine Kingdom'), 'This pine country had a name', 'Then put the name on the mark', 'Song Yang’s arrow', 'The pine country is under this roof', 'At dusk the three come out', 'Years later, the bow will wait');
	del(e, get(e, 'Two Sons', (b) => b.kind === 'scene'), 'watch the well the way other boys', get(e, 'He watches everything, including his brother'), 'Mother’s counting again.', get(e, 'He likes the sea more than anyone'), 'I’m going farther.');
	set(e, get(e, 'Dongmyung', (b) => b.kind === 'scene'), { label: 'The Moon', ko: '달' });
	del(e, 'You learn something from founding a country twice');
	const fb = e.blocks.find((b) => b.kind === 'flashback');
	unwrap(e, fb);
	const word = get(e, 'Word comes from Buyeo');
	set(e, word, { html: word.html.replace('Word comes from Buyeo while the new country is still learning its name.', 'Thirteen winters pass. Word comes from Buyeo.'), ko: word.ko.replace('새 나라가 아직 제 이름을 익히는 동안, 부여에서 소식이 온다.', '열세 해 겨울이 지난다. 부여에서 소식이 온다.') });
	set(e, 'Jumong spends the', {
		html: 'Jumong spends the rest of his life driving the western commanderies from the river valleys, and the country grows the way countries grow in old stories: one bowshot, one bride, one sworn brother at a time. Later halls will call him <b>Dongmyung</b>, Bright of the East. The walls just call him the Holy King.',
		ko: '주몽은 남은 생을 중원의 군현을 강가 골짜기에서 몰아내는 데 쓰고, 나라는 옛이야기 속 나라들이 자라는 방식으로 자란다. 화살 한 발, 신부 한 사람, 의형제 한 명씩. 훗날의 대청들은 그를 <b>동명</b>, 동쪽의 밝음이라 부를 것이다. 성벽들은 그냥 성왕이라 부른다.'
	});
	del(e, 'The chronicles will not write that the Yeon hall');

	// Trim to length: cut repeats, keep the best scenes whole.
	del(
		e,
		'He looks past the spear.',
		'He thinks it with his mouth shut',
		'She does not smile when they move.',
		'Little Sosuno is purring',
		'Oh you like him.',
		'Chin up, she is her father’s hall.',
		'The counting-voice says one, two, three.',
		'not like that. Worker.',
		'Come fetch at ours.',
		'Plum does not bother with the beam.',
		'Jumong’s grin dies in his mouth',
		'They can do sexy.',
		'We were only—',
		'That well is not a porch.',
		'Day at the well is two buckets',
		'There’s no wind.',
		'I was here first.',
		get(e, 'Did not.', (b) => b.kind === 'dialogue'),
		'You’re kinda sexy when you threaten me.',
		'Ha!? Stop it— that’s embarrassing',
		'Sosuno hears herself and cannot take it back.',
		'Don’t— don’t be nice.',
		'Get— no. Door.',
		'He turns for the pine with the easy shoulder',
		'The Crow roof votes with the others',
		'King and queen on packed earth, no throne',
		'You’ll get Tabal.',
		'He kneels lower than her crown',
		'Tabal has been on the porch since before the arrow'
	);
	set(e, 'What he calls a talk', {
		html: 'What he calls a talk, the valley will call the first summit of the five tribes. For once the smoke agrees.',
		ko: '그가 얘기라고 부른 것을, 골짜기는 다섯 부족의 첫 회의라고 부를 것이다. 이번만은 연기도 한쪽으로 오른다.'
	});
	set(e, 'Later he goes back to the mouth in the hill', {
		html: 'Later he goes back to the mouth in the hill to pray, the way a man prays when a hall has named him and he still does not quite believe the name. At dawn the light breaks through.',
		ko: '얼마 뒤 그는 언덕의 굴 어귀로 돌아가 기도한다. 대청이 이름을 붙여 줬는데도 아직 그 이름을 다 믿지 못하는 사람의 기도. 새벽에 빛이 뚫고 들어온다.'
	});
	set(e, 'Silence. Then Tabal laughs', { html: 'Then Tabal laughs, short and unwilling.', ko: '그러자 타발이 웃는다. 짧게, 마지못해.' });
	set(e, 'The bird pin comes out in her own fingers.', {
		html: 'The bird pin comes out in her own fingers. Her hair falls in a sheet, and she sits in the dirt with the bow by her knee and talks into the ground, because his face is a luxury she has not paid for.',
		ko: '새 모양 비녀가 제 손가락 사이에서 빠져나온다. 머리가 막처럼 쏟아진다. 그녀는 활을 무릎 옆에 두고 흙바닥에 앉아 땅에 대고 말한다. 그의 얼굴은 아직 값을 치르지 않은 사치라서.'
	});
	set(e, 'He comes out of the cavern a king', {
		html: 'He comes out of the cavern a king the valley already voted for, and a son who finally saw the face that had been the hour. This morning is only a roof, a grin, and a gold break in the stone.',
		ko: '골짜기가 이미 뽑은 왕으로, 시각이던 얼굴을 드디어 본 아들로, 동굴에서 나온다. 이 아침은 지붕과 웃음과, 돌 틈의 금빛뿐.'
	});
	// Back to Yodong, 645.
	before(
		e,
		e.blocks.at(-1),
		S('Yodong', '요동'),
		P('In the burned shrine at Yodong, the lamp is down to a bead. Gesomun has told it badly, with his boots on, the way his family always tells it.', '불탄 요동의 사당에서 등잔불은 콩알만 하게 줄었다. 개소문은 신발도 안 벗고 서툴게 얘기를 마쳤다. 그 집안이 늘 하던 식으로.'),
		D(BRIDE, ['So nobody gave her to him.', 'Sosuno. She picked him. She shot at him.'], ['그럼 아무도 그 여자를 그분한테 준 게 아니네요.', '소서노요. 그 여자가 골랐어요. 활까지 쐈고.']),
		D('gesomun', ['Shot at him, then married him. The women in my family are like that.', 'Tabal couldn’t bend that bow, you know. We’ve been sore about it for seven hundred years.'], ['쏘고 나서 시집갔지. 우리 집안 여자들이 그래.', '타발은 그 활을 못 당겼어. 그거 가지고 칠백 년째 속 끓이는 중이야.'], GES),
		D(BRIDE, ['Then why do they give him girls? Why me?'], ['그럼 왜 그분한테 여자애들을 바쳐요? 왜 나예요?']),
		D('gesomun', ['Because the first time a valley handed him a girl, the valley turned into a country, and the walls held.', 'Scared towns remember that half. They forget she did the picking.'], ['처음으로 골짜기 하나가 그한테 여자를 줬을 때, 그 골짜기가 나라가 됐거든. 성벽도 버텼고.', '겁먹은 성들은 그 반쪽만 기억해. 고른 게 그 여자였다는 건 까먹고.'], GES),
		D(BRIDE, ['…So I can pick.'], ['…그럼 나도 고를 수 있네요.']),
		D('gesomun', ['Pick, then.'], ['골라, 그럼.'], GES),
		P('She takes off the bride’s crown and sets it on the floor under the chain mail, carefully, the way you put down something borrowed. Then she walks out into the ash, toward whatever is left of her mother’s street.', '그녀는 신부의 관을 벗어 쇠사슬 갑옷 아래 바닥에 내려놓는다. 빌린 물건을 돌려놓듯 조심스럽게. 그러고는 재 속으로 걸어 나간다. 엄마가 살던 골목에 무엇이 남았든, 그쪽으로.'),
		D('gesomun', ['…Holy King.', 'You big idiot. Look what they do in your name.'], ['…성왕이시여.', '이 큰 바보 양반아. 당신 이름 걸고 저것들이 무슨 짓을 하는지 좀 보쇼.'], GES)
	);
});
